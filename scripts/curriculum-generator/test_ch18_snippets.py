import json
import traceback

with open("scripts/curriculum-generator/ch18_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("Verifying Chapter 18 snippets...")
for sub in data["subchapters"]:
    sub_id = sub["id"]
    code = sub["codeSnippet"]
    try:
        exec_globals = {}
        exec(code, exec_globals)
        print(f"[OK] Executed {sub_id}: SUCCESS")
    except Exception as e:
        print(f"[ERROR] Failed {sub_id}: {e}")
        traceback.print_exc()
        exit(1)

print("Chapter 18 test finished with 100% SUCCESS!")
