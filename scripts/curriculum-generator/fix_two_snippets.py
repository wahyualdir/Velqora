import json
import os
import sys
import io

base_dir = os.path.dirname(__file__)

# 1. Perbaiki 28.2.10 di vdb_ch2_data.json
ch2_path = os.path.join(base_dir, "vdb_ch2_data.json")
with open(ch2_path, "r", encoding="utf-8") as f:
    ch2_data = json.load(f)

for sub in ch2_data:
    if sub["id"] == "28.2.10":
        code = sub["content"]["codeSnippet"]
        # Ubah print baris latensi
        code = code.replace(
            'print(f"{name:<28} | {lat:>6.2f} ms | {val:>13.4f} | #{top_id:<5}")',
            'print(f"{name:<28} | Selesai terukur | {val:>13.4f} | #{top_id:<5}")'
        )
        code = code.replace(
            "print(f\"{'Nama Metrik':<28} | {'Latensi':<10} | {'Nilai Minimum':<14} | {'Top-1 ID'}\")",
            "print(f\"{'Nama Metrik':<28} | {'Status Latensi':<15} | {'Nilai Minimum':<14} | {'Top-1 ID'}\")"
        )
        sub["content"]["codeSnippet"] = code
        # Jalankan untuk dapat output aktual
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        exec(code, {})
        out = sys.stdout.getvalue().strip()
        sys.stdout = old_stdout
        sub["content"]["codeSnippetOutput"] = out
        print("Updated 28.2.10")

with open(ch2_path, "w", encoding="utf-8") as f:
    json.dump(ch2_data, f, indent=2, ensure_ascii=False)

# 2. Perbaiki 28.3.2 di vdb_ch3_data.json
ch3_path = os.path.join(base_dir, "vdb_ch3_data.json")
with open(ch3_path, "r", encoding="utf-8") as f:
    ch3_data = json.load(f)

for sub in ch3_data:
    if sub["id"] == "28.3.2":
        code = sub["content"]["codeSnippet"]
        code = code.replace(
            'print(f"{d:>11} | {t_tree:>11.2f} ms | {t_brute:>15.2f} ms | {winner}")',
            'print(f"{d:>11} | Selesai terukur | Selesai terukur   | {winner}")'
        )
        code = code.replace(
            'print("Dimensi (d) | Waktu KD-Tree | Waktu Brute-Force | Pemenang")',
            'print("Dimensi (d) | Evaluasi KD-Tree| Evaluasi Brute-Force| Pemenang")'
        )
        code = code.replace(
            'print("----------------------------------------------------------")',
            'print("---------------------------------------------------------------")'
        )
        sub["content"]["codeSnippet"] = code
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        exec(code, {})
        out = sys.stdout.getvalue().strip()
        sys.stdout = old_stdout
        sub["content"]["codeSnippetOutput"] = out
        print("Updated 28.3.2")

with open(ch3_path, "w", encoding="utf-8") as f:
    json.dump(ch3_data, f, indent=2, ensure_ascii=False)

print("Selesai memperbaiki 2 snippet!")
