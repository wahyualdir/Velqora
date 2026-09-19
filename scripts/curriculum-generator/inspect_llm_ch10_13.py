import re

with open('src/lib/curriculum/topics/18-large-language-model.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for ch in range(10, 14):
    ch_id = f"large-language-model-ch-{ch}"
    pos = text.find(ch_id)
    if pos == -1:
        print(f"Ch {ch} NOT FOUND")
        continue
    
    m_title = re.search(r'title:\s*["\'](.*?)["\']', text[pos:pos+500])
    print(f"\n=== {m_title.group(1) if m_title else ch_id} ===")
    
    next_ch_id = f"large-language-model-ch-{ch+1}" if ch < 18 else "export const"
    next_pos = text.find(next_ch_id, pos)
    block = text[pos:next_pos] if next_pos != -1 else text[pos:pos+50000]
    
    # Hanya cari id: "large-language-model-ch{ch}-sub{1..10}" dan title-nya
    sub_matches = re.findall(r'id:\s*["\']large-language-model-ch' + str(ch) + r'-sub(\d+)["\'].*?title:\s*["\'](.*?)["\']', block, re.DOTALL)
    for num, st in sub_matches:
        print(f"  {ch}.{num}. {st}")
