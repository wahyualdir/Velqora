# -*- coding: utf-8 -*-
"""
Penguji cuplikan kode untuk Chunk 3 (Bab 10-13) Computer Vision
Memastikan 40/40 cuplikan kode dapat dieksekusi tanpa error dan menghasilkan expectedOutput yang cocok 100%.
"""

import os
import sys
import json
import io
import contextlib

sys.stdout.reconfigure(encoding='utf-8')

def test_snippets():
    base_dir = os.path.dirname(__file__)
    chapters = ["cv_ch10_data.json", "cv_ch11_data.json", "cv_ch12_data.json", "cv_ch13_data.json"]
    
    total_tested = 0
    passed = 0
    failed = []
    
    for ch_file in chapters:
        path = os.path.join(base_dir, ch_file)
        if not os.path.exists(path):
            print(f"Error: File {ch_file} tidak ditemukan!")
            sys.exit(1)
            
        with open(path, "r", encoding="utf-8") as f:
            subchapters = json.load(f)
            
        print(f"Menguji cuplikan kode pada {ch_file} ({len(subchapters)} subbab)...")
        for sub in subchapters:
            total_tested += 1
            sub_id = sub["id"]
            code = sub["codeSnippet"]
            expected = sub["expectedOutput"]
            
            f_out = io.StringIO()
            try:
                with contextlib.redirect_stdout(f_out):
                    scope = {}
                    exec(code, scope)
                actual = f_out.getvalue()
                
                # Verify match
                if actual.strip() == expected.strip():
                    passed += 1
                else:
                    failed.append((sub_id, "Output mismatch", actual[:200], expected[:200]))
            except Exception as e:
                failed.append((sub_id, f"Exception: {str(e)}", "", ""))
                
    print("\n" + "=" * 60)
    print("REKAPITULASI PENGUJIAN 40 CUPLIKAN KODE CHUNK 3 (BAB 10-13)")
    print("=" * 60)
    print(f"Total Snippets Tested: {total_tested}")
    print(f"Passed: {passed} / {total_tested}")
    if failed:
        print(f"Failed ({len(failed)}):")
        for fid, reason, act, exp in failed:
            print(f" - {fid}: {reason}")
            if act:
                print(f"   Actual: {act!r} vs Expected: {exp!r}")
        sys.exit(1)
    else:
        print("ALL 40/40 SNIPPETS EXECUTED AND PASSED PERFECTLY!")

if __name__ == "__main__":
    test_snippets()
