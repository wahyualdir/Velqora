import re

with open('src/lib/curriculum/types.ts', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'(?:export\s+)?(?:type|interface)\s+AcademicCurriculum[\s\S]*?(?=\n\n(?:export\s+)?(?:type|interface)|\Z)', text)
if m:
    print(m.group(0)[:1500])
else:
    print("Not found directly as type/interface, searching occurrences:")
    matches = [line for line in text.split('\n') if 'AcademicCurriculum' in line]
    print('\n'.join(matches[:10]))
