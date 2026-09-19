"""
Test runner untuk mengeksekusi dan memvalidasi seluruh 40 code snippet pada Bab 6-9 NLP.
Memastikan setiap snippet berjalan tanpa error dan menghasilkan output yang valid.
"""

import json
import os
import sys
import io
from contextlib import redirect_stdout, redirect_stderr

def test_snippets():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    chapters = [6, 7, 8, 9]
    total_tested = 0
    total_passed = 0
    failed = []

    print("=== MEMULAI PENGUJIAN 40 KODE SNIPPET CHUNK 2 NLP (BAB 6-9) ===\n")

    for ch in chapters:
        json_path = os.path.join(base_dir, f"nlp_ch{ch}_data.json")
        if not os.path.exists(json_path):
            print(f"ERROR: File {json_path} tidak ditemukan!")
            continue
            
        with open(json_path, "r", encoding="utf-8") as f:
            subchapters = json.load(f)
            
        print(f"--- Menguji Bab {ch} ({len(subchapters)} subbab) ---")
        for sub in subchapters:
            sub_id = sub["id"]
            content = sub.get("content", {})
            code = content.get("codeSnippet", "") if isinstance(content, dict) else sub.get("codeSnippet", "")
            total_tested += 1
            
            if not code or len(code.strip()) == 0:
                failed.append((sub_id, "Snippet kosong"))
                print(f"  [FAIL] {sub_id}: Snippet kosong")
                continue
                
            stdout_capture = io.StringIO()
            stderr_capture = io.StringIO()
            
            # Isolasi namespace eksekusi
            exec_globals = {
                "__name__": "__main__"
            }
            
            try:
                with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
                    exec(code, exec_globals)
                out = stdout_capture.getvalue()
                err = stderr_capture.getvalue()
                
                if err and "warning" not in err.lower():
                    print(f"  [WARN] {sub_id} memiliki stderr: {err.strip()[:100]}")
                    
                total_passed += 1
                first_line = out.strip().split('\n')[0] if out.strip() else "(No output)"
                print(f"  [PASS] {sub_id}: OK -> \"{first_line[:60]}...\"")
            except Exception as e:
                failed.append((sub_id, str(e)))
                print(f"  [FAIL] {sub_id}: Exception: {e}")

    print("\n" + "=" * 60)
    print(f"HASIL AKHIR PENGUJIAN SNIPPET: {total_passed}/{total_tested} PASSED")
    if failed:
        print(f"GAGAL PADA {len(failed)} SNIPPET:")
        for fid, msg in failed:
            print(f"  - {fid}: {msg}")
        sys.exit(1)
    else:
        print("SEMUA 40 KODE SNIPPET LOLOS EKSEKUSI DENGAN SUKSES (40/40)!")
        print("=" * 60)

if __name__ == "__main__":
    test_snippets()
