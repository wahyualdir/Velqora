# scripts/curriculum-generator/check_snippets.py
import json

with open('scripts/curriculum-generator/dl_all_ch1_5.json', 'r', encoding='utf-8') as f:
    chapters = json.load(f)

for ch in chapters:
    for sub in ch['subchapters']:
        code = sub['code']
        try:
            compile(code, sub['title'], 'exec')
        except SyntaxError as e:
            print(f"ERROR in {sub['title']} at line {e.lineno}: {e.msg}")
            lines = code.split('\n')
            start = max(0, e.lineno - 3)
            end = min(len(lines), e.lineno + 2)
            for j in range(start, end):
                print(f"   {j+1}: {repr(lines[j])}")
            print()
