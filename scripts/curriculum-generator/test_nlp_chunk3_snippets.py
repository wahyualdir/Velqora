# -*- coding: utf-8 -*-
"""
Test Runner untuk Menguji Eksekusi Seluruh 40 Code Snippet Chunk 3 (Bab 10-13) NLP.
Memastikan setiap snippet bersifat mandiri (pure Python 3 / NumPy / Scipy)
dan dapat dieksekusi via exec() tanpa exception.
"""

import json
import os
import sys
import io
import traceback
import numpy as np

def run_snippet(snippet_code):
    old_stdout = sys.stdout
    redirected = io.StringIO()
    sys.stdout = redirected
    scope = {"np": np}
    try:
        exec(snippet_code, scope)
        return True, redirected.getvalue()
    except Exception as e:
        return False, f"EXCEPTION: {str(e)}\n{traceback.format_exc()}"
    finally:
        sys.stdout = old_stdout

def main():
    base_dir = os.path.dirname(__file__)
    chapters = [10, 11, 12, 13]
    total_tested = 0
    total_passed = 0
    failed_reports = []

    print("=== PENGUJIAN EKSEKUSI 40 CODE SNIPPET CHUNK 3 (BAB 10 - 13) NLP ===")
    
    for ch in chapters:
        json_path = os.path.join(base_dir, f"nlp_ch{ch}_data.json")
        if not os.path.exists(json_path):
            print(f"Error: File {json_path} tidak ditemukan!")
            continue
            
        with open(json_path, "r", encoding="utf-8") as f:
            subchaps = json.load(f)
            
        print(f"\n--- Menguji Bab {ch} ({len(subchaps)} subbab) ---")
        for sub in subchaps:
            total_tested += 1
            sub_id = sub["id"]
            code = sub.get("codeSnippet", "")
            
            ok, msg = run_snippet(code)
            if ok:
                total_passed += 1
                first_line = msg.strip().split("\n")[0] if msg.strip() else "[No stdout]"
                print(f"  [PASSED] {sub_id:<60} | Out: {first_line[:40]}...")
            else:
                failed_reports.append((sub_id, msg))
                print(f"  [FAILED] {sub_id}")
                
    print("\n" + "=" * 70)
    print(f"HASIL AKHIR: {total_passed}/{total_tested} Snippet Berhasil Dieksekusi")
    if failed_reports:
        print("\nLAPORAN KEGAGALAN:")
        for sub_id, err in failed_reports:
            print(f"\n--- {sub_id} ---")
            print(err)
        sys.exit(1)
    else:
        print("SEMUA 40 SNIPPET CHUNK 3 LOLOS EKSEKUSI MANDIRI 100%!")
        sys.exit(0)

if __name__ == "__main__":
    main()
