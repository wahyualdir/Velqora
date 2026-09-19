# -*- coding: utf-8 -*-
import json
import re

with open('src/lib/curriculum/topics/18-large-language-model.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for ch_num in range(1, 6):
    pat = rf'id:\s*["\']large-language-model-ch-{ch_num}["\'].*?title:\s*["\']([^"\']+)["\'].*?subchapters:\s*\[(.*?)\]\s*\}}'
    m = re.search(pat, text, re.DOTALL)
    if m:
        ch_title = m.group(1)
        sub_block = m.group(2)
        subs = re.findall(r'title:\s*["\']([^"\']+)["\']', sub_block)
        print(f"\n{ch_title} (Total: {len(subs)} subbab):")
        for i, s in enumerate(subs, 1):
            print(f"  {i}. {s}")
