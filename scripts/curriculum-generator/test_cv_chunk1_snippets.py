import io
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Load the 5 chapter data files
base_dir = os.path.dirname(__file__)
total_tested = 0
passed = 0
failed = 0

print("================================================================================")
print("PENGUJIAN OTOMATIS: 50/50 CUPLIKAN KODE COMPUTER VISION CHUNK 1 (BAB 1-5)")
print("================================================================================\n")

for ch_num in range(1, 6):
    data_path = os.path.join(base_dir, f"cv_ch{ch_num}_data.json")
    with open(data_path, "r", encoding="utf-8") as f:
        subs = json.load(f)
        
    print(f"--- Menguji Bab {ch_num} ({len(subs)} subbab) ---")
    for s_idx, sub in enumerate(subs):
        sub_id = sub["id"]
        title = sub["title"]
        code = sub["codeSnippet"]
        expected = sub["expectedOutput"].strip()
        
        # Execute snippet
        old_stdout = sys.stdout
        redirected = io.StringIO()
        sys.stdout = redirected
        exec_error = None
        out = ""
        try:
            exec_globals = {}
            exec(code, exec_globals)
            out = redirected.getvalue().strip()
        except Exception as e:
            exec_error = str(e)
        finally:
            sys.stdout = old_stdout
            
        total_tested += 1
        if exec_error:
            failed += 1
            print(f"  ❌ [{sub_id}] {title}: EXECUTION ERROR: {exec_error}")
        elif out != expected:
            failed += 1
            print(f"  ❌ [{sub_id}] {title}: OUTPUT MISMATCH!")
            print(f"     Expected: {repr(expected[:60])}...")
            print(f"     Actual  : {repr(out[:60])}...")
        else:
            passed += 1
            print(f"  ✅ [{sub_id}] {title}: PASS (Output Terverifikasi Sesuai)")

print("\n================================================================================")
print(f"HASIL AKHIR PENGUJIAN: {passed}/{total_tested} LULUS ({(passed/total_tested)*100:.1f}%)")
if failed > 0:
    print(f"PERINGATAN: {failed} pengujian gagal.")
    sys.exit(1)
else:
    print("STATUS: 100% CUPLIKAN KODE RUNNABLE & TERVERIFIKASI SEMPURNA.")
    print("================================================================================")
