import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/curriculum/topics/08-computer-vision.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for ch_idx in range(1, 6):
    print(f"\n==================== BAB {ch_idx} ====================")
    # find chapter
    ch_match = re.search(rf'id:\s*"computer-vision-ch-{ch_idx}",\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)"', text)
    if ch_match:
        print(f"BAB {ch_idx}: {ch_match.group(2)}")
    
    # find all subchapters
    subs = re.findall(rf'id:\s*"(computer-vision-ch{ch_idx}-sub\d+)",\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)"', text)
    for s_id, s_slug, s_title in subs:
        print(f"  {s_id}: {s_title}")
