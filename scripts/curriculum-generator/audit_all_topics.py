# -*- coding: utf-8 -*-
"""
Skrip Audit Riil untuk Menghitung Jumlah Bab dan Subbab Aktual di Seluruh File .ts Topik Kurikulum
"""

import os
import re
import sys

topics_dir = os.path.abspath("src/lib/curriculum/topics")
files = sorted([f for f in os.listdir(topics_dir) if f.endswith(".ts")])

print(f"{'No':<3} | {'File':<40} | {'Chapters':<10} | {'Total Subchaps':<15} | {'Substantive-Verified'}")
print("-" * 95)

results = []

for idx, f in enumerate(files, 1):
    path = os.path.join(topics_dir, f)
    with open(path, "r", encoding="utf-8") as fp:
        content = fp.read()
    
    # Hitung bab: pola 'orderIndex: X' di tingkat bab, atau regex chapter ID
    # Di kurikulum Velqora, bab memiliki struktur:
    # id: "...-ch-X" atau "...-chX"
    chapters = re.findall(r'id:\s*["\']([a-zA-Z0-9_-]+-ch-?\d+)["\']', content)
    
    # Hitung subbab:
    # Setiap subbab memiliki 'contentStatus:' atau id yang memuat '-sub'
    # Atau cari setiap blok subbab di dalam 'subchapters: ['
    sub_verified = len(re.findall(r'contentStatus:\s*["\']substantive-verified["\']', content))
    sub_ids = len(re.findall(r'id:\s*["\'][a-zA-Z0-9_-]+-ch\d+-sub\d+["\']', content))
    
    # Hitung total subchapters array elements
    # Setiap subbab memiliki pattern `orderIndex: \d+` di dalam subchapters
    # Atau hitung jumlah occurrences `learningObjectives:` di dalam subchapters
    # Mari kita hitung berapa banyak `title:` yang memiliki nomor subbab atau format subbab
    sub_order_indices = len(re.findall(r'orderIndex:\s*\d+', content))
    # Jumlah subbab murni kira-kira sub_order_indices - len(chapters) jika bab juga punya orderIndex
    
    # Mari kita hitung juga dengan membaca AST via ts-node atau menghitung struktur kurikulum
    print(f"{idx:<3} | {f:<40} | {len(chapters):<10} | {sub_ids:<15} | {sub_verified}")
    results.append({
        "file": f,
        "chapters": len(chapters),
        "sub_ids": sub_ids,
        "sub_verified": sub_verified,
        "raw_order_indices": sub_order_indices
    })
