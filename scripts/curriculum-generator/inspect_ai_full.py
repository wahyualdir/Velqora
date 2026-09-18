import re

with open('src/lib/curriculum/topics/05-ai-fundamentals.ts', 'r', encoding='utf-8') as f:
    text = f.read()

print(f"Total characters: {len(text):,}")

# Find all chapters
chapters = re.findall(r'(?:\"id\"|id):\s*\"(ai-fundamentals-ch-[0-9]+)\"', text)
print(f"Chapters found ({len(chapters)}): {chapters}")

# Find titles for each chapter
ch_blocks = re.findall(r'(?:\"title\"|title):\s*\"(BAB\s+[0-9]+:[^\"]+)\"', text)
print(f"Chapter titles ({len(ch_blocks)}):")
for t in ch_blocks:
    print(" -", t)

# Find subchapters count per chapter
for i in range(1, 11):
    subs = re.findall(rf'(?:\"id\"|id):\s*\"ai-fundamentals-ch{i}-sub([0-9]+)\"', text)
    print(f"Chapter {i}: {len(subs)} subchapters")
