# -*- coding: utf-8 -*-
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/curriculum/topics/22-natural-language-processing.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Cari bab-bab
chapter_pattern = r'id:\s*["\'](natural-language-processing-ch-\d+)["\'],\s*slug:\s*["\'][^"\']+["\'],\s*title:\s*["\']([^"\']+)["\']'
matches = re.findall(chapter_pattern, text)

print(f"Total Bab Ditemukan: {len(matches)}")
for cid, ctitle in matches:
    print(f"  {cid}: {ctitle}")
