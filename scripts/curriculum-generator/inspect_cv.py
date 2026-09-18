import re

with open('src/lib/curriculum/topics/08-computer-vision.ts', 'r', encoding='utf-8') as f:
    text = f.read()

print(f"File size: {len(text):,} characters")

# Find chapter IDs
ch_ids = re.findall(r'(?:\"id\"|id):\s*\"([^\"]*cv[^\"]*ch-[0-9]+|[^\"]*computer-vision[^\"]*ch-[0-9]+)\"', text)
print(f"Chapter IDs ({len(ch_ids)}): {ch_ids}")

# Find all chapter titles
ch_titles = re.findall(r'(?:\"title\"|title):\s*\"(BAB\s+[0-9]+:[^\"]+)\"', text)
print(f"Chapter titles ({len(ch_titles)}):")
for idx, t in enumerate(ch_titles, 1):
    print(f" {idx}. {t}")

# Find total subchapters
subs = re.findall(r'(?:\"id\"|id):\s*\"([^\"]*cv[^\"]*ch[0-9]+-sub[0-9]+|[^\"]*computer-vision[^\"]*ch[0-9]+-sub[0-9]+)\"', text)
print(f"Total subchapters: {len(subs)}")

# Inspect subchapters per chapter
for ch_idx in range(1, 19):
    pattern = rf'(?:\"id\"|id):\s*\"[^\"]*ch{ch_idx}-sub([0-9]+)\"'
    c_subs = re.findall(pattern, text)
    print(f"Bab {ch_idx}: {len(c_subs)} subchapters")

# Sample content from first chapter to check boilerplate
print("\n--- Snippet around Chapter 1 ---")
print(text[:1500])
