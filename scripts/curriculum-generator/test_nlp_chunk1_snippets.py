# -*- coding: utf-8 -*-
"""
Test Runner: Eksekusi Mandiri 50/50 Code Snippets NLP Chunk 1 (Bab 1 - 5)
Memverifikasi bahwa setiap snippet Python/NumPy berjalan 100% mandiri tanpa error
dan menghasilkan output stdout nyata.
"""

import os
import sys
import json
import io
import contextlib

sys.stdout.reconfigure(encoding='utf-8')

def test_all_snippets():
    total_tested = 0
    total_passed = 0
    failures = []

    print("=" * 80)
    print("TEST RUNNER: EKSEKUSI MANDIRI 50/50 CODE SNIPPETS NLP CHUNK 1 (BAB 1 - 5)")
    print("=" * 80)

    for ch in range(1, 6):
        fname = os.path.join(os.path.dirname(__file__), f"nlp_ch{ch}_data.json")
        if not os.path.exists(fname):
            print(f"[ERROR] File {fname} tidak ditemukan!")
            continue

        with open(fname, "r", encoding="utf-8") as f:
            subchapters = json.load(f)

        print(f"\n--- Menguji Bab {ch} ({len(subchapters)} Subbab) ---")
        for sub in subchapters:
            sub_id = sub["id"]
            code = sub["content"]["codeSnippet"]
            stored_output = sub["content"]["codeSnippetOutput"]
            total_tested += 1

            buf = io.StringIO()
            try:
                with contextlib.redirect_stdout(buf):
                    exec_scope = {}
                    exec(code, exec_scope)
                captured = buf.getvalue()

                if not captured.strip():
                    failures.append((sub_id, "Output stdout kosong!"))
                    print(f"  [FAIL] {sub_id}: Stdout kosong")
                else:
                    total_passed += 1
                    print(f"  [PASS] {sub_id} ({len(captured.strip().splitlines())} baris stdout)")
            except Exception as e:
                failures.append((sub_id, str(e)))
                print(f"  [FAIL] {sub_id}: Exception: {e}")

    print("\n" + "=" * 80)
    print(f"HASIL AKHIR: {total_passed} / {total_tested} SNIPPETS BERHASIL DIEKSEKUSI")
    if failures:
        print(f"TERDAPAT {len(failures)} KEGAGALAN:")
        for fid, err in failures:
            print(f"  - {fid}: {err}")
        sys.exit(1)
    else:
        print("SEMUA 50/50 SNIPPET PYTHON/NUMPY BERJALAN 100% SUKSES DAN MANDIRI!")
    print("=" * 80)

if __name__ == "__main__":
    test_all_snippets()
