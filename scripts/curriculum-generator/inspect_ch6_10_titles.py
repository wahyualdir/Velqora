import re

with open('src/lib/curriculum/topics/05-ai-fundamentals.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for ch_num in range(6, 11):
    print(f"\n==================== CHAPTER {ch_num} ====================")
    ch_match = re.search(rf'(?:\"id\"|id):\s*\"ai-fundamentals-ch-{ch_num}\"[\s\S]*?(?:\"title\"|title):\s*\"([^\"]+)\"', text)
    if ch_match:
        print("TITLE:", ch_match.group(1))
    
    subs = re.findall(rf'(?:\"id\"|id):\s*\"ai-fundamentals-ch{ch_num}-sub([0-9]+)\"[\s\S]*?(?:\"title\"|title):\s*\"([^\"]+)\"', text)
    for s_id, s_title in subs:
        print(f"  Sub {s_id}: {s_title}")
