# -*- coding: utf-8 -*-
"""
Audit integritas untuk Chunk 2 (Bab 6-9) Computer Vision
"""

import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

FORBIDDEN_PHRASES = [
    "lorem ipsum",
    "placeholder",
    "todo",
    "akan dibahas nanti",
    "subbab ini membahas",
    "dalam subbab ini kita akan",
    "simak penjelasan berikut",
    "pada artikel ini",
    "penulis akan menjelaskan"
]

def audit():
    base_dir = os.path.dirname(__file__)
    chapters = [
        ("Bab 6", "cv_ch6_data.json"),
        ("Bab 7", "cv_ch7_data.json"),
        ("Bab 8", "cv_ch8_data.json"),
        ("Bab 9", "cv_ch9_data.json"),
    ]
    
    total_words = 0
    total_inline_katex = 0
    total_block_katex = 0
    total_subchapters = 0
    issues = []
    
    for ch_name, fname in chapters:
        path = os.path.join(base_dir, fname)
        with open(path, "r", encoding="utf-8") as f:
            subchapters = json.load(f)
            
        print(f"Auditing {ch_name} ({len(subchapters)} subchapters)...")
        for sub in subchapters:
            total_subchapters += 1
            sid = sub["id"]
            title = sub["title"]
            content = sub.get("content") or sub.get("content_markdown", "")
            code = sub.get("codeSnippet", "")
            out = sub.get("expectedOutput", "")
            pitfalls = sub.get("commonPitfalls", [])
            quiz = sub.get("quiz", {})
            
            # Word count
            words = len(re.findall(r'\b\w+\b', content))
            total_words += words
            
            if words < 200:
                issues.append(f"{sid}: Kata terlalu sedikit ({words} kata)")
                
            # KaTeX checks
            inline_k = len(re.findall(r'(?<!\$)\$(?!\$)[^\$]+(?<!\$)\$(?!\$)', content))
            block_k = len(re.findall(r'\$\$[^\$]+\$\$', content))
            total_inline_katex += inline_k
            total_block_katex += block_k
            
            if inline_k + block_k == 0:
                issues.append(f"{sid}: Tidak ada KaTeX ditemukan")
                
            # Forbidden phrases
            for fp in FORBIDDEN_PHRASES:
                if re.search(r'\b' + re.escape(fp) + r'\b', content.lower()):
                    issues.append(f"{sid}: Memuat frasa terlarang '{fp}'")
                    
            # Code snippet & output
            if not code or len(code.strip()) < 20:
                issues.append(f"{sid}: Code snippet kosong/terlalu pendek")
            if not out or len(out.strip()) == 0:
                issues.append(f"{sid}: Expected output kosong")
                
            # Common pitfalls
            if not pitfalls or len(pitfalls) < 2:
                issues.append(f"{sid}: Common pitfalls kurang dari 2")
                
            # Quiz
            if not quiz.get("question") or len(quiz.get("options", [])) < 3:
                issues.append(f"{sid}: Quiz tidak lengkap")
                
    print("\n" + "=" * 60)
    print("REKAPITULASI AUDIT INTEGRITAS CHUNK 2 (BAB 6-9)")
    print("=" * 60)
    print(f"Total Subbab Diaudit     : {total_subchapters}")
    print(f"Total Estimasi Kata Teks : {total_words:,} kata")
    print(f"Rata-rata Kata per Subbab: {total_words / total_subchapters:.1f} kata")
    print(f"Total Formula KaTeX      : {total_inline_katex + total_block_katex} ({total_inline_katex} inline, {total_block_katex} block)")
    print(f"Jumlah Masalah/Pelanggaran: {len(issues)}")
    
    if issues:
        print("\nDaftar Masalah:")
        for iss in issues:
            print(f" - {iss}")
        sys.exit(1)
    else:
        print("AUDIT BERSIH 100%! SEMUA STANDAR AKADEMIK TERPENUHI.")

if __name__ == "__main__":
    audit()
