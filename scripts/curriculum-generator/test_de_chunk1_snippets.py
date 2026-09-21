import json
import os
import sys
import io

base_dir = os.path.dirname(__file__)
json_files = [
    os.path.join(base_dir, f"de_ch{ch}_data.json")
    for ch in range(1, 6)
]

total_tested = 0
failed = []

sys.stdout.reconfigure(encoding='utf-8')

print("=== MEMULAI PENGUJIAN 50 SNIPPET PYTHON BAB 1 - BAB 5 ===")

for jf in json_files:
    if not os.path.exists(jf):
        print(f"Error: {jf} tidak ditemukan!")
        sys.exit(1)
        
    with open(jf, "r", encoding="utf-8") as f:
        subchapters = json.load(f)
        
    for sub in subchapters:
        sub_id = sub["id"]
        snippet = sub["content"]["codeSnippet"]
        expected_output = sub["content"]["codeSnippetOutput"]
        
        # Test execution
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        local_env = {}
        try:
            exec(snippet, local_env)
            captured = sys.stdout.getvalue().strip()
        except Exception as e:
            captured = f"EXECUTION_ERROR: {e}"
        finally:
            sys.stdout = old_stdout
            
        total_tested += 1
        
        if captured.startswith("EXECUTION_ERROR"):
            print(f"[FAIL] [{sub_id}] Gagal dieksekusi: {captured}")
            failed.append((sub_id, "EXECUTION_ERROR", captured))
        elif len(captured) == 0:
            print(f"[FAIL] [{sub_id}] Output kosong!")
            failed.append((sub_id, "EMPTY_OUTPUT", ""))
        else:
            print(f"[OK] [{sub_id}] Berhasil dieksekusi ({len(captured)} karakter output).")

print(f"\nTotal Snippet Diuji: {total_tested}")
print(f"Total Berhasil: {total_tested - len(failed)}")
print(f"Total Gagal: {len(failed)}")

if failed:
    print("Ada kegagalan pada snippet:")
    for f in failed:
        print(f" - {f[0]}: {f[1]}")
    sys.exit(1)
else:
    print("SEMUA 50 SNIPPET BERHASIL DIEKSEKUSI TANPA ERROR!")
