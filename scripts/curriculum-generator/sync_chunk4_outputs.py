import json
import subprocess
import sys
import tempfile
import os

for ch in [14, 15, 16, 17, 18]:
    file_path = f"scripts/curriculum-generator/llm_ch{ch}_data.json"
    with open(file_path, "r", encoding="utf-8") as f:
        subchapters = json.load(f)

    updated = False
    for sub in subchapters:
        code = sub["content"]["codeSnippet"]
        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, encoding="utf-8") as tf:
            tf.write(code)
            tf_name = tf.name

        try:
            res = subprocess.run([sys.executable, tf_name], capture_output=True, text=True, timeout=10)
            if res.returncode == 0:
                actual = res.stdout.strip()
                if sub["content"]["codeSnippetOutput"].strip() != actual:
                    print(f"Syncing output for {sub['id']}")
                    sub["content"]["codeSnippetOutput"] = actual
                    updated = True
            else:
                print(f"ERROR on {sub['id']}: {res.stderr.strip()}")
        finally:
            if os.path.exists(tf_name):
                os.remove(tf_name)

    if updated:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(subchapters, f, indent=2, ensure_ascii=False)
        print(f"Updated {file_path}")
