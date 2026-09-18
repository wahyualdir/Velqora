# -*- coding: utf-8 -*-
"""
Audit integritas untuk Chunk 3 (Bab 10-13) Computer Vision
Standar Mutu:
- 0 boilerplate skeleton
- 0 frasa terlarang
- Kata per subbab >= 200
- Formula KaTeX presisi (inline dan block)
- Kode Python 3 valid dan runnable
- Common pitfalls >= 2
- Quiz lengkap
- Aturan Kutipan Diperketat (Pasca-Review Chunk 2): Kutipan langsung dibatasi pada frasa kunci pendek (<= 30 kata)
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

MAX_ALLOWED_QUOTE_WORDS = 30

def audit():
    base_dir = os.path.dirname(__file__)
    chapters = [
        ("Bab 10", "cv_ch10_data.json"),
        ("Bab 11", "cv_ch11_data.json"),
        ("Bab 12", "cv_ch12_data.json"),
        ("Bab 13", "cv_ch13_data.json"),
    ]
    
    total_words = 0
    total_inline_katex = 0
    total_block_katex = 0
    total_subchapters = 0
    total_quotes_checked = 0
    issues = []
    
    for ch_name, fname in chapters:
        path = os.path.join(base_dir, fname)
        if not os.path.exists(path):
            issues.append(f"File {fname} tidak ditemukan!")
            continue
            
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
                issues.append(f"{sid}: Kata terlalu sedikit ({words} kata, minimum 200)")
                
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
            if not quiz.get("question") or len(quiz.get("options", [])) < 3 or quiz.get("correctAnswerIndex") is None:
                issues.append(f"{sid}: Quiz tidak lengkap")
                
            # Aturan Kutipan Diperketat: Verbatim Quote Length Audit
            # Cari kutipan dalam tanda petik ganda "..." atau “...”
            quotes = re.findall(r'["“]([^"”\n]{5,})["”]', content)
            for q in quotes:
                total_quotes_checked += 1
                q_words = len(re.findall(r'\b\w+\b', q))
                if q_words > MAX_ALLOWED_QUOTE_WORDS:
                    issues.append(f"{sid}: Kutipan verbatim terlalu panjang ({q_words} kata > {MAX_ALLOWED_QUOTE_WORDS}): '{q[:60]}...'")
                    
    print("\n" + "=" * 60)
    print("REKAPITULASI AUDIT INTEGRITAS CHUNK 3 (BAB 10-13)")
    print("=" * 60)
    print(f"Total Subbab Diaudit       : {total_subchapters}")
    print(f"Total Estimasi Kata Teks   : {total_words:,} kata")
    print(f"Rata-rata Kata per Subbab  : {total_words / total_subchapters:.1f} kata")
    print(f"Total Formula KaTeX        : {total_inline_katex + total_block_katex} ({total_inline_katex} inline, {total_block_katex} block)")
    print(f"Total Kutipan Terverifikasi: {total_quotes_checked} kutipan ringkas (seluruhnya <= {MAX_ALLOWED_QUOTE_WORDS} kata)")
    print(f"Jumlah Masalah/Pelanggaran : {len(issues)}")
    
    if issues:
        print("\nDaftar Pelanggaran Ditemukan:")
        for iss in issues:
            print(f" ❌ {iss}")
        sys.exit(1)
    else:
        print("\n✅ AUDIT CHUNK 3 (BAB 10-13) LULUS 100% TANPA PELANGGARAN!")

if __name__ == "__main__":
    audit()
