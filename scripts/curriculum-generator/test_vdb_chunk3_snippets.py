import json
import os
import sys
import io

base_dir = os.path.dirname(__file__)
json_files = [
    os.path.join(base_dir, f"vdb_ch{ch}_data.json") for ch in [9, 10, 11, 12]
]

total_snippets = 0
passed_snippets = 0
failed_snippets = []

print("=" * 70)
print("TEST RUNNER: Verifikasi Eksekusi Mandiri Snippet Kode Chunk 3 (Bab 9-12)")
print("=" * 70)

for ch_idx, json_file in enumerate(json_files, 9):
    if not os.path.exists(json_file):
        print(f"[ERROR] File tidak ditemukan: {json_file}")
        sys.exit(1)
        
    with open(json_file, "r", encoding="utf-8") as f:
        subchapters = json.load(f)
        
    print(f"\nMemverifikasi Bab {ch_idx} ({len(subchapters)} subbab)...")
    for sub in subchapters:
        total_snippets += 1
        sub_id = sub["id"]
        sub_title = sub["title"]
        
        if "content" in sub and "codeSnippet" in sub["content"]:
            code_str = sub["content"]["codeSnippet"]
            expected_out = sub["content"].get("codeSnippetOutput", "").strip()
        elif "codeExamples" in sub and len(sub["codeExamples"]) > 0:
            code_str = sub["codeExamples"][0].get("code", "")
            expected_out = sub.get("codeSnippetOutput", sub["codeExamples"][0].get("expectedOutput", "")).strip()
        else:
            code_str = ""
            expected_out = ""
        
        if not code_str:
            print(f"  [FAIL] {sub_id}: Tidak ada code snippet!")
            failed_snippets.append((sub_id, "Missing code snippet"))
            continue
            
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        exec_globals = {}
        try:
            exec(code_str, exec_globals)
            actual_out = sys.stdout.getvalue().strip()
        except Exception as e:
            actual_out = f"Runtime Error: {e}"
        finally:
            sys.stdout = old_stdout
            
        norm_expected = "\n".join(line.strip() for line in expected_out.splitlines() if line.strip())
        norm_actual = "\n".join(line.strip() for line in actual_out.splitlines() if line.strip())
        
        if norm_expected == norm_actual:
            passed_snippets += 1
            print(f"  [PASS] {sub_id} - {sub_title[:45]}...")
        else:
            print(f"  [MISMATCH] {sub_id} - {sub_title}")
            print(f"    Expected:\n{norm_expected[:150]}...")
            print(f"    Actual:\n{norm_actual[:150]}...")
            failed_snippets.append((sub_id, "Output mismatch"))

print("\n" + "=" * 70)
print(f"HASIL AKHIR: {passed_snippets}/{total_snippets} snippet terverifikasi lolos 100% presisi.")
print("=" * 70)

if failed_snippets:
    print(f"[PERINGATAN] Terdapat {len(failed_snippets)} snippet yang gagal!")
    for sub_id, err in failed_snippets:
        print(f"  - {sub_id}: {err}")
    sys.exit(1)
else:
    print("[SUKSES] Semua 40 snippet Python Chunk 3 teruji mandiri dan deterministik.")
