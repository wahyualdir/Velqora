# -*- coding: utf-8 -*-
import json
import re

with open('src/lib/curriculum/topics/18-large-language-model.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Ekstrak judul bab dan jumlah subbab per bab
chapters_matches = re.findall(r'id:\s*["\'](large-language-model-ch-\d+)["\'].*?title:\s*["\']([^"\']+)["\']', content, re.DOTALL)
print(f"Total bab terdeteksi: {len(chapters_matches)}")
for ch_id, ch_title in chapters_matches:
    print(f"  {ch_id}: {ch_title}")

# Hitung total subbab
subchap_matches = re.findall(r'id:\s*["\'](large-language-model-ch\d+-sub\d+)["\']', content)
if not subchap_matches:
    subchap_matches = re.findall(r'slug:\s*["\']([^"\']+)["\']', content)
print(f"Total subchap matches: {len(subchap_matches)}")
