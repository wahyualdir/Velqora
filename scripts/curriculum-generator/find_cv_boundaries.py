import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/curriculum/topics/08-computer-vision.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's locate the start of Chapter 1, Chapter 6, and the end of Chapter 18
for ch_num in [1, 5, 6, 18]:
    ch_id = f"computer-vision-ch-{ch_num}"
    idx = text.find(f'id: "{ch_id}"')
    print(f"Chapter {ch_num} ({ch_id}) at character index: {idx}")

# Also find where "chapters: [" starts
chap_start = text.find('chapters: [')
print(f"'chapters: [' starts at: {chap_start}")
