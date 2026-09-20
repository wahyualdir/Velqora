import json
import subprocess
import sys
import tempfile
import os

def test_snippets():
    total = 0
    passed = 0
    failed = []

    for ch in [14, 15, 16, 17, 18]:
        file_path = f"scripts/curriculum-generator/llm_ch{ch}_data.json"
        with open(file_path, "r", encoding="utf-8") as f:
            subchapters = json.load(f)

        for sub in subchapters:
            total += 1
            sub_id = sub["id"]
            code = sub["content"]["codeSnippet"]
            expected_output = sub["content"]["codeSnippetOutput"].strip()

            with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, encoding="utf-8") as tf:
                tf.write(code)
                tf_name = tf.name

            try:
                res = subprocess.run([sys.executable, tf_name], capture_output=True, text=True, timeout=10)
                actual_output = res.stdout.strip()
                err = res.stderr.strip()

                if res.returncode != 0:
                    failed.append({
                        "id": sub_id,
                        "reason": f"Non-zero exit ({res.returncode}): {err}"
                    })
                elif actual_output != expected_output:
                    failed.append({
                        "id": sub_id,
                        "reason": "Mismatch output",
                        "expected": expected_output,
                        "actual": actual_output
                    })
                else:
                    passed += 1
            except Exception as e:
                failed.append({
                    "id": sub_id,
                    "reason": f"Exception: {str(e)}"
                })
            finally:
                if os.path.exists(tf_name):
                    os.remove(tf_name)

    print(f"Total snippets tested: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {len(failed)}")

    if failed:
        print("\n--- DETAIL KEGAGALAN ---")
        for f in failed:
            print(f"\nID: {f['id']}")
            print(f"Reason: {f['reason']}")
            if "expected" in f:
                print("EXPECTED:\n" + f["expected"])
                print("ACTUAL:\n" + f["actual"])
        sys.exit(1)
    else:
        print("\n[SUCCESS] Semua 50 snippets Chunk 4 berjalan dengan sukses dan output numerik 100% presisi!")

if __name__ == "__main__":
    test_snippets()
