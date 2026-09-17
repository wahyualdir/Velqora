import json
import traceback

with open('scripts/curriculum-generator/ch9_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Verifying Chapter 9 ({len(data['subchapters'])} subchapters)...")
for sub in data['subchapters']:
    num = sub['num']
    code = sub['code']
    try:
        compile(code, f"sub_{num}.py", "exec")
    except Exception as e:
        print(f"[SYNTAX ERROR] {num}: {e}")
        continue
    try:
        scope = {}
        exec(code, scope)
        print(f"[OK] Executed {num}: SUCCESS")
    except Exception as e:
        print(f"[RUNTIME ERROR] {num}: {e}")
        traceback.print_exc()

print("Chapter 9 verification complete!")
