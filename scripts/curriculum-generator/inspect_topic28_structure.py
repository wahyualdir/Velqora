# -*- coding: utf-8 -*-
"""
Ekstraksi Daftar Bab dan Subbab Topik 28 (Vector Database & Retrieval)
"""

import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

target_file = os.path.abspath("src/lib/curriculum/topics/28-vector-database-retrieval.ts")

with open(target_file, "r", encoding="utf-8") as f:
    text = f.read()

# Pola bab
ch_matches = re.findall(r'id:\s*["\'](vector-database-retrieval-ch-?\d+)["\'].*?title:\s*["\']([^"\']+)["\']', text, re.DOTALL)

for idx, (ch_id, ch_title) in enumerate(ch_matches[:8], 1):
    print(f"\n========================================================")
    print(f"{ch_title} (ID: {ch_id})")
    print(f"========================================================")
    
    # Ambil subbab dalam bab ini
    ch_num = re.search(r'\d+', ch_id).group()
    # Cari subbab yang cocok
    sub_matches = re.findall(rf'id:\s*["\']vector-database-retrieval-ch{ch_num}-sub(\d+)["\'].*?title:\s*["\']([^"\']+)["\']', text, re.DOTALL)
    for s_idx, s_title in sub_matches:
        print(f"  {ch_num}.{s_idx}. {s_title}")
