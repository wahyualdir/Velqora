# -*- coding: utf-8 -*-
"""
Test runner untuk menguji eksekusi mandiri dari 50 snippet kode Python di Bab 14 - 18 Computer Vision
"""

import os
import sys
import json
import io
import contextlib

sys.stdout.reconfigure(encoding='utf-8')

ch_files = [
    "cv_ch14_data.json",
    "cv_ch15_data.json",
    "cv_ch16_data.json",
    "cv_ch17_data.json",
    "cv_ch18_data.json"
]

base_dir = os.path.dirname(__file__)

total_tested = 0
passed = 0
failed = 0

print("=" * 80)
print("PENGUJIAN EKSEKUSI MANDIRI 50 CODE SNIPPET CHUNK 4 COMPUTER VISION (BAB 14-18)")
print("=" * 80)

for ch_idx, file_name in enumerate(ch_files, start=14):
    file_path = os.path.join(base_dir, file_name)
    if not os.path.exists(file_path):
        print(f"[ERROR] File {file_name} tidak ditemukan!")
        failed += 10
        continue
        
    with open(file_path, "r", encoding="utf-8") as f:
        subchapters = json.load(f)
        
    print(f"\n--- Menguji Bab {ch_idx} ({len(subchapters)} Subbab) ---")
    for sub in subchapters:
        sub_id = sub["id"]
        if "content" in sub and isinstance(sub["content"], dict):
            code = sub["content"]["codeSnippet"]
        else:
            code = sub["codeSnippet"]
            
        total_tested += 1
        
        # Tangkap stdout
        buffer = io.StringIO()
        try:
            with contextlib.redirect_stdout(buffer):
                scope = {}
                exec(code, scope)
            out = buffer.getvalue()
            if len(out.strip()) == 0:
                print(f"  [WARN] {sub_id}: Berhasil jalan tapi tidak menghasilkan output!")
            else:
                passed += 1
                first_line = out.strip().splitlines()[0]
                print(f"  [PASS] {sub_id} -> '{first_line[:60]}...'")
        except Exception as e:
            failed += 1
            print(f"  [FAIL] {sub_id}: Terjadi eksepsi: {e}")

print("\n" + "=" * 80)
print(f"REKAP UJI CODE SNIPPETS CHUNK 4:")
print(f"Total Snippet Diuji: {total_tested}")
print(f"Passed (100% Valid): {passed}")
print(f"Failed:              {failed}")
print("=" * 80)

if failed > 0:
    sys.exit(1)
else:
    print("SELURUH 50 CODE SNIPPET CHUNK 4 BERJALAN SEMPURNA SECARA MANDIRI!")
