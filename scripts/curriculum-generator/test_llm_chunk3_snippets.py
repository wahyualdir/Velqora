# -*- coding: utf-8 -*-
"""
Tester Eksekusi Riil Snippet Kode Python Chunk 3 LLM (Bab 10 - 13: 40 Subbab)
Memastikan 40 dari 40 kode snippet Python 3 / NumPy dapat dieksekusi secara nyata tanpa error (0 crash).
"""

import os
import sys
import json
import io
import contextlib

sys.stdout.reconfigure(encoding='utf-8')

base_dir = os.path.dirname(__file__)
chapters = [10, 11, 12, 13]

total_tested = 0
passed_count = 0
failed_count = 0
failures = []

print("=== STARTING SNIPPET EXECUTION TESTS FOR LLM CHUNK 3 (BAB 10 - 13) ===")

for ch in chapters:
    json_path = os.path.join(base_dir, f"llm_ch{ch}_data.json")
    if not os.path.exists(json_path):
        print(f"[ERROR] Berkas {json_path} tidak ditemukan!")
        sys.exit(1)
        
    with open(json_path, "r", encoding="utf-8") as f:
        subchapters = json.load(f)
        
    print(f"\n--- Menguji Bab {ch} ({len(subchapters)} subbab) ---")
    for sub in subchapters:
        total_tested += 1
        sub_id = sub["id"]
        title = sub["title"]
        content = sub.get("content", sub)
        code = content["codeSnippet"]
        
        # Eksekusi snippet mandiri menggunakan exec()
        stdout_capture = io.StringIO()
        try:
            with contextlib.redirect_stdout(stdout_capture):
                # Sandbox local dictionary
                exec_globals = {"__name__": "__main__"}
                exec(code, exec_globals)
            output_str = stdout_capture.getvalue()
            passed_count += 1
            print(f"[PASSED] {sub_id}: {title[:50]}...")
        except Exception as e:
            failed_count += 1
            failures.append((sub_id, title, str(e)))
            print(f"[FAILED] {sub_id}: {title[:50]}... Error: {e}")

print("\n" + "=" * 66)
print(f"Total Snippets Tested : {total_tested}")
print(f"Passed                : {passed_count}")
print(f"Failed                : {failed_count}")
print("=" * 66)

if failed_count == 0:
    print("ALL 40 SNIPPETS IN CHUNK 3 EXECUTED PERFECTLY WITH ZERO ERRORS!\n")
else:
    print(f"TERDAPAT {failed_count} KEGAGALAN EKSEKUSI PADA CHUNK 3:")
    for f_id, f_title, f_err in failures:
        print(f"  - {f_id} ({f_title}): {f_err}")
    sys.exit(1)
