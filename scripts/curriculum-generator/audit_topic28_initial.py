# -*- coding: utf-8 -*-
"""
Audit Awal Berkas Kurikulum: 28-vector-database-retrieval.ts
Memeriksa struktur bab, subbab, word count rata-rata, keberadaan kode,
status verifikasi (substantive-verified vs under_review/boilerplate).
"""

import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

target_file = os.path.abspath("src/lib/curriculum/topics/28-vector-database-retrieval.ts")

if not os.path.exists(target_file):
    print(f"[ERROR] File tidak ditemukan: {target_file}")
    sys.exit(1)

with open(target_file, "r", encoding="utf-8") as f:
    text = f.read()

print("=== HASIL AUDIT BERKAS: 28-vector-database-retrieval.ts ===")
print(f"Total Karakter: {len(text):,} karakter")
print(f"Total Baris   : {len(text.splitlines()):,} baris\n")

# Cari Chapter
# Pola chapter biasanya id: "vector-database-retrieval-ch-X" atau mirip
ch_matches = re.findall(r'id:\s*["\'](vector-database-retrieval-ch-?\d+)["\'].*?title:\s*["\']([^"\']+)["\']', text, re.DOTALL)
print(f"--- DAFTAR BAB ({len(ch_matches)} Bab Ditemukan) ---")
for idx, (ch_id, ch_title) in enumerate(ch_matches, 1):
    print(f"Bab {idx:02d}: [{ch_id}] {ch_title}")

# Cari Subbab
sub_matches = re.findall(r'id:\s*["\'](vector-database-retrieval-ch\d+-sub\d+)["\'].*?title:\s*["\']([^"\']+)["\']', text, re.DOTALL)
print(f"\n--- TOTAL SUBBAB: {len(sub_matches)} Subbab Terdeteksi ---")

# Status Verifikasi
verified_count = text.count('"substantive-verified"') + text.count("'substantive-verified'")
print(f"Status 'substantive-verified': {verified_count}")

# Cek sampel konten subbab untuk menganalisis boilerplate
# Cari content_markdown pada subbab pertama
content_samples = re.findall(r'content_markdown:\s*["\'](.*?)["\'],\s*\n', text)
print(f"Total content_markdown blocks: {len(content_samples)}")
if content_samples:
    first_sample = content_samples[0][:300]
    print(f"\nSampel Konten Subbab 1 (Cuplikan 300 char):\n{first_sample}...")
    word_counts = [len(c.split()) for c in content_samples]
    avg_words = sum(word_counts) / len(word_counts) if word_counts else 0
    print(f"Rata-rata Word Count per content_markdown: {avg_words:.1f} kata")
    print(f"Min Words: {min(word_counts) if word_counts else 0}, Max Words: {max(word_counts) if word_counts else 0}")

# Cek apakah ada codeExamples / codeSnippet nyata
code_examples_count = text.count('"codeExamples"') + text.count('codeExamples:')
print(f"Blok codeExamples: {code_examples_count}")

# Cek unit-unit subbab lama (format unit1, unit2, dsb)
unit_count = len(re.findall(r'id:\s*["\']vector-database-retrieval-ch\d+-sub\d+-unit\d+["\']', text))
print(f"Unit mikro sub-subbab lama (-unitX): {unit_count}")
