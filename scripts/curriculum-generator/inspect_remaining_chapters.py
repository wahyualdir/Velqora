# scripts/curriculum-generator/inspect_remaining_chapters.py
with open('src/lib/curriculum/topics/05-ai-fundamentals.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'ai-fundamentals-ch-' in line and 'id:' in line:
        print(f"Line {i+1}: {line.strip()}")
