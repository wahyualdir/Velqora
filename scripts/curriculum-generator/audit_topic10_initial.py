import re

target_file = 'src/lib/curriculum/topics/10-data-engineering-ai.ts'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

for ch in range(1, 6):
    cid = f'data-engineering-ai-ch-{ch}'
    pos = content.find(f'id: "{cid}"')
    next_cid = f'data-engineering-ai-ch-{ch+1}'
    next_pos = content.find(f'id: "{next_cid}"')
    if next_pos == -1:
        next_pos = len(content)
    ch_block = content[pos:next_pos]
    title_m = re.search(r'title:\s*"([^"]+)"', ch_block)
    desc_m = re.search(r'description:\s*"([^"]+)"', ch_block)
    title = title_m.group(1) if title_m else ""
    desc = desc_m.group(1) if desc_m else ""
    print(f"=== Bab {ch}: {title} ===")
    print(f"    ID: {cid}")
    print(f"    Deskripsi: {desc}")
    subs = re.findall(r'id:\s*"(data-engineering-ai-ch\d+-sub\d+)",\s*slug:\s*"[^"]+",\s*title:\s*"([^"]+)"', ch_block)
    for sid, stitle in subs:
        print(f"      {sid}: {stitle}")
    print()
