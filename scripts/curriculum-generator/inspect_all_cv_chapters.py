import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/curriculum/topics/08-computer-vision.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Look for chapter definitions
ch_matches = re.finditer(r'\"?id\"?:\s*\"(computer-vision-ch-?\d+)\",\s*\"?slug\"?:\s*\"([^"]+)\",\s*\"?title\"?:\s*\"([^"]+)\"', text)
chapters = list(ch_matches)
print(f"Found {len(chapters)} chapters:")
for m in chapters:
    print(f"  {m.group(1)} | {m.group(2)} | {m.group(3)}")

# Let's also check how subchapters are distributed
for i in range(1, 19):
    sub_count = len(re.findall(rf'\"?id\"?:\s*\"computer-vision-ch0?{i}-sub\d+\"', text))
    print(f"Chapter {i}: {sub_count} subchapters")
