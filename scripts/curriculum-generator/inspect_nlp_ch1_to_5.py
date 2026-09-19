# -*- coding: utf-8 -*-
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/curriculum/topics/22-natural-language-processing.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Ekstrak subbab untuk bab 1 sampai 5
for ch in range(1, 6):
    pattern = rf'id:\s*["\']natural-language-processing-ch-{ch}["\'].*?subchapters:\s*\[(.*?)\]\s*,\s*caseStudy'
    m = re.search(pattern, text, re.DOTALL)
    if m:
        subs_raw = m.group(1)
        sub_titles = re.findall(r'title:\s*["\']([^"\']+)["\']', subs_raw)
        print(f"\n--- BAB {ch} ({len(sub_titles)} Subbab Ditemukan) ---")
        for st in sub_titles:
            print(f"  * {st}")
    else:
        print(f"Bab {ch} tidak cocok dengan pola regex.")
