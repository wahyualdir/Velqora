import re

target_file = "src/lib/curriculum/topics/18-large-language-model.ts"
with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

matches = list(re.finditer(r'["\']?id["\']?\s*:\s*["\'](large-language-model-ch-\d+)["\']', content))
print(f"Total chapter ID matches: {len(matches)}")
for m in matches:
    pos = m.start()
    line_num = content[:pos].count('\n') + 1
    print(f"Match: {m.group(1)} at line {line_num}, char {pos}")
