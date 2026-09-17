# scripts/curriculum-generator/fix_code_newlines.py
import json
import re

with open('scripts/curriculum-generator/dl_all_ch1_5.json', 'r', encoding='utf-8') as f:
    chapters = json.load(f)

for ch in chapters:
    for sub in ch['subchapters']:
        code = sub['code']
        lines = code.split('\n')
        fixed_lines = []
        skip_next = False
        for i in range(len(lines)):
            if skip_next:
                skip_next = False
                continue
            line = lines[i]
            # Check if this line has an unclosed double-quoted string in print(...)
            # Case 1: print(f"something... without closing quote
            if re.search(r'print\(f"[^"]*$', line) and i + 1 < len(lines):
                next_line = lines[i+1]
                merged = line + '\\n' + next_line.lstrip()
                fixed_lines.append(merged)
                skip_next = True
            # Case 2: print("something... without closing quote
            elif re.search(r'print\("[^"]*$', line) and i + 1 < len(lines):
                next_line = lines[i+1]
                merged = line + '\\n' + next_line.lstrip()
                fixed_lines.append(merged)
                skip_next = True
            else:
                fixed_lines.append(line)
        sub['code'] = '\n'.join(fixed_lines)

with open('scripts/curriculum-generator/dl_all_ch1_5.json', 'w', encoding='utf-8') as f:
    json.dump(chapters, f, indent=2, ensure_ascii=False)

print('Successfully processed and saved dl_all_ch1_5.json!')
