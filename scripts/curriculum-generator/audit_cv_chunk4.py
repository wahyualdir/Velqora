# -*- coding: utf-8 -*-
"""
Audit Kualitas Substantif Chunk 4 (Bab 14 - 18) Computer Vision
"""

import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

ch_files = [
    ("Bab 14", "cv_ch14_data.json"),
    ("Bab 15", "cv_ch15_data.json"),
    ("Bab 16", "cv_ch16_data.json"),
    ("Bab 17", "cv_ch17_data.json"),
    ("Bab 18", "cv_ch18_data.json")
]

base_dir = os.path.dirname(__file__)

total_subchapters = 0
audit_passed = 0
audit_failed = 0

placeholder_patterns = [
    r'\bTODO\b',
    r'\bTBD\b',
    r'\bplaceholder\b',
    r'\blorem ipsum\b',
    r'akan dibahas pada bab selanjutnya',
    r'materi belum tersedia'
]

print("=" * 85)
print("AUDIT KUALITAS SUBSTANTIF CHUNK 4 COMPUTER VISION (BAB 14-18: 50 SUBBAB)")
print("=" * 85)

for ch_name, file_name in ch_files:
    file_path = os.path.join(base_dir, file_name)
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    print(f"\nAuditing {ch_name} ({len(data)} Subbab):")
    for sub in data:
        total_subchapters += 1
        sub_id = sub["id"]
        
        # Ekstrak field teori
        if "content" in sub and isinstance(sub["content"], dict):
            theory = sub["content"]["theory"]
            code = sub["content"]["codeSnippet"]
            pitfalls = sub["content"].get("commonPitfalls", [])
            refs = sub["content"].get("academicReferences", [])
        else:
            theory = sub["content"]
            code = sub["codeSnippet"]
            pitfalls = sub.get("commonPitfalls", [])
            refs = sub.get("canonicalReferences", [])
            
        words = re.findall(r'\b\w+\b', theory)
        word_count = len(words)
        
        has_katex = ("$" in theory) or ("\\" in theory)
        has_pitfalls = len(pitfalls) >= 2
        has_refs = len(refs) >= 1
        has_code = len(code.strip()) > 50
        
        # Periksa placeholder
        found_placeholder = False
        for p in placeholder_patterns:
            if re.search(p, theory, re.IGNORECASE):
                found_placeholder = True
                break
                
        issues = []
        if word_count < 200:
            issues.append(f"Word count rendah ({word_count} < 200 kata)")
        if not has_katex:
            issues.append("Tidak ditemukan formula KaTeX/matematis")
        if not has_pitfalls:
            issues.append(f"Common pitfalls kurang ({len(pitfalls)} < 2)")
        if not has_refs:
            issues.append("Tidak ada referensi literatur")
        if not has_code:
            issues.append("Code snippet terlalu pendek")
        if found_placeholder:
            issues.append("Terdeteksi kata kunci placeholder sintetis!")
            
        if issues:
            audit_failed += 1
            print(f"  [FAIL] {sub_id}: " + "; ".join(issues))
        else:
            audit_passed += 1
            # print(f"  [PASS] {sub_id} ({word_count} kata, {len(pitfalls)} pitfalls, KaTeX OK)")

print("\n" + "=" * 85)
print(f"REKAP HASIL AUDIT KUALITAS SUBSTANTIF:")
print(f"Total Subbab Di-audit:     {total_subchapters}")
print(f"Lulus Kriteria (100% OK): {audit_passed}")
print(f"Gagal Kriteria:            {audit_failed}")
print("=" * 85)

if audit_failed > 0:
    sys.exit(1)
else:
    print("SELURUH 50 SUBBAB CHUNK 4 MEMENUHI STANDAR KUALITAS SUBSTANTIF DAN BEBAS PLACEHOLDER!")
