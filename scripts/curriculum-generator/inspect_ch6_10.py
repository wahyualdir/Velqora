import json
import re

with open('src/lib/curriculum/topics/05-ai-fundamentals.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect each chapter 6, 7, 8, 9, 10
# Find chapter titles, subchapters, whether they have codeExamples, contentStatus, etc.
for ch_num in range(6, 11):
    ch_match = re.search(rf'id:\s*\"ai-fundamentals-ch-{ch_num}\"', text)
    if not ch_match:
        ch_match = re.search(rf'\"id\":\s*\"ai-fundamentals-ch-{ch_num}\"', text)
    print(f"\n=== Chapter {ch_num} ===")
    if ch_match:
        print(f"Found at index {ch_match.start()}")
    else:
        print("NOT FOUND")

# Let's see what content is inside Chapter 6
ch6_pos = text.find('ai-fundamentals-ch-6')
print("\n--- Snippet around Chapter 6 start ---")
print(text[ch6_pos-100:ch6_pos+1500])
