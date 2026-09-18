import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/curriculum/topics/08-computer-vision.ts', 'r', encoding='utf-8') as f:
    text = f.read()

chapters = re.findall(r'id:\s*["\'](computer-vision-ch-\d+)["\'],\s*title:\s*["\']([^"\']+)["\']', text)
print(f"Total Chapters found: {len(chapters)}")
for ch_id, ch_title in chapters:
    print(f"  {ch_id}: {ch_title}")

# Also inspect subchapters in Chapter 1 to 5
for ch_num in range(1, 6):
    ch_id = f"computer-vision-ch-{ch_num}"
    # find all subchapters
    sub_pattern = rf'id:\s*["\'](computer-vision-ch{ch_num}-sub\d+)["\'],\s*title:\s*["\']([^"\']+)["\']'
    subs = re.findall(sub_pattern, text)
    print(f"\nBab {ch_num} Subchapters ({len(subs)}):")
    for s_id, s_title in subs:
        print(f"    {s_id}: {s_title}")
