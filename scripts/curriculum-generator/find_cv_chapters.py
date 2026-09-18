import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/curriculum/topics/08-computer-vision.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'chapters:' in line or 'chapter-' in line or 'id:' in line and 'ch' in line:
        print(f"Line {idx+1}: {line.strip()[:100]}")
        if idx > 3000:
            break
