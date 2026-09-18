import re
import sys
import traceback

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open("src/lib/curriculum/topics/05-ai-fundamentals.ts", "r", encoding="utf-8") as f:
    text = f.read()

# Extract all code examples
# Find code: "..." and expectedOutput: "..."
# A regex to capture subchapters
subchapters = re.findall(r'\"id\":\s*\"(ai-fundamentals-ch[0-9]+-sub[0-9]+)\"[\s\S]*?\"title\":\s*\"([^\"]+)\"[\s\S]*?\"code\":\s*\"([\s\S]*?)\",\s*\"expectedOutput\":\s*\"([\s\S]*?)\"', text)

print(f"Found {len(subchapters)} subchapters with code and expectedOutput.")
assert len(subchapters) == 100, f"Expected 100 subchapters, got {len(subchapters)}"

passed = 0
failed = 0

for sub_id, title, raw_code, expected_out in subchapters:
    # Unescape JSON string escapes in raw_code
    code = raw_code.encode().decode('unicode_escape')
    try:
        exec_globals = {}
        exec(code, exec_globals)
        passed += 1
    except Exception as e:
        print(f"[FAIL] {sub_id} ({title}): {e}")
        traceback.print_exc()
        failed += 1

print(f"\n========================================================")
print(f"ALL 100 SNIPPETS EXECUTION RESULT: {passed}/100 PASS, {failed} FAIL")
print(f"========================================================")
assert failed == 0, f"Found {failed} failed snippets!"
