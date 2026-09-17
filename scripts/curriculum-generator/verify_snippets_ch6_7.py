import json
import traceback

files = [
    'scripts/curriculum-generator/ch6_data.json',
    'scripts/curriculum-generator/ch7_data.json',
    'scripts/curriculum-generator/ch8_data.json',
    'scripts/curriculum-generator/ch9_data.json'
]

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"=== Verifying {fpath} ({len(data['subchapters'])} subchapters) ===")
    for sub in data['subchapters']:
        num = sub['num']
        code = sub['code']
        try:
            compile(code, f"sub_{num}.py", "exec")
        except Exception as e:
            print(f"[SYNTAX ERROR] {num}: {e}")
            continue

        # Let's also execute it to ensure no runtime crashes
        try:
            scope = {}
            exec(code, scope)
            print(f"[OK] Executed {num}: SUCCESS")
        except Exception as e:
            print(f"[RUNTIME ERROR] {num}: {e}")
            traceback.print_exc()

print("Verification run finished!")
