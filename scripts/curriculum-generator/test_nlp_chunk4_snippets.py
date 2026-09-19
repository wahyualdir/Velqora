# -*- coding: utf-8 -*-
"""
Uji Eksekusi 50 Snippet Kode Python untuk Bab 14-18 (Chunk 4) NLP
Memastikan 50/50 snippet berjalan mandiri tanpa error eksekusi.
"""

import json
import os
import io
import sys

def main():
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    chapters = [14, 15, 16, 17, 18]
    total_tested = 0
    passed = 0
    failed = []

    print("=" * 70)
    print("MEMULAI PENGUJIAN EKSEKUSI 50 KODE SNIPPET BAB 14-18 NLP")
    print("=" * 70)

    for ch_num in chapters:
        json_file = os.path.join(cur_dir, f"nlp_ch{ch_num}_data.json")
        if not os.path.exists(json_file):
            print(f"[ERROR] File {json_file} tidak ditemukan!")
            return

        with open(json_file, "r", encoding="utf-8") as f:
            subchapters = json.load(f)

        for sub in subchapters:
            sub_id = sub["id"]
            title = sub["title"]
            code = sub["codeSnippet"]
            total_tested += 1

            # Tangkap stdout
            old_stdout = sys.stdout
            redirected_output = io.StringIO()
            sys.stdout = redirected_output

            try:
                # Eksekusi snippet secara independen dalam namespace bersih
                exec_globals = {}
                exec(code, exec_globals)
                sys.stdout = old_stdout
                passed += 1
                output_str = redirected_output.getvalue().strip()
                preview = output_str.split("\n")[0] if output_str else "(No output)"
                print(f"[PASS] Subbab {sub_id:<5} : {title[:40]:<40} -> OK")
            except Exception as e:
                sys.stdout = old_stdout
                failed.append((sub_id, title, str(e)))
                print(f"[FAIL] Subbab {sub_id:<5} : {title[:40]:<40} -> ERROR: {e}")

    print("=" * 70)
    print(f"HASIL AKHIR UJI EKSEKUSI SNIPPET CHUNK 4 NLP: {passed}/{total_tested} PASSED")
    print("=" * 70)

    if failed:
        print(f"Daftar Kegagalan ({len(failed)}):")
        for sub_id, title, err in failed:
            print(f"  - Subbab {sub_id} ({title}): {err}")
        sys.exit(1)
    else:
        print("SEMUA 50 KODE SNIPPET BERJALAN 100% SEMPURNA TANPA ERROR!")

if __name__ == "__main__":
    main()
