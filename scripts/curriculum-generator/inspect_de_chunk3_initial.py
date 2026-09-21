import re

with open('src/lib/curriculum/topics/10-data-engineering-ai.ts', encoding='utf-8') as f:
    c = f.read()

for ch in range(10, 14):
    print(f"\n==================== BAB {ch} ====================")
    m_ch = re.search(rf'id:\s*["\']data-engineering-ai-ch-{ch}["\']', c)
    m_next = re.search(rf'id:\s*["\']data-engineering-ai-ch-{ch+1}["\']', c)
    start = m_ch.start() if m_ch else 0
    end = m_next.start() if m_next else len(c)
    ch_text = c[start:end]
    
    subs = re.findall(r'id:\s*["\']data-engineering-ai-ch\d+-sub(\d+)["\'],\s*slug:\s*["\'][^"\']+["\'],\s*title:\s*["\']([^"\']+)["\']', ch_text)
    for s_idx, s_title in subs:
        print(f"  10.{ch-9}.{s_idx} -> {s_title}")
