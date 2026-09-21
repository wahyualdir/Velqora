import json
import os
import sys
import io

sys.stdout.reconfigure(encoding='utf-8')

script_dir = os.path.dirname(os.path.abspath(__file__))
json_files = [
    os.path.join(script_dir, f"de_ch{ch}_data.json")
    for ch in range(6, 10)
]

print("=== TESTING DE CHUNK 2 (BAB 6-9: 40 SUBCHAPTERS) ===")

total_subs = 0
failures = []

for ch_idx, jf in enumerate(json_files, start=6):
    if not os.path.exists(jf):
        print(f"[FAIL] Missing JSON file: {jf}")
        sys.exit(1)
    
    with open(jf, "r", encoding="utf-8") as f:
        subs = json.load(f)
    
    print(f"\n--- Checking Bab {ch_idx} ({len(subs)} subchapters) ---")
    
    for sub in subs:
        total_subs += 1
        sub_id = sub.get("id")
        title = sub.get("title")
        
        # 1. Learning objectives
        los = sub.get("learningObjectives", [])
        if len(los) < 3:
            failures.append(f"{sub_id}: learningObjectives count < 3 ({len(los)})")
            
        # 2. Prerequisites
        prereqs = sub.get("prerequisites", [])
        if not prereqs:
            failures.append(f"{sub_id}: missing prerequisites")
            
        # 3. Substantive Theory
        content_dict = sub.get("content", {})
        theory = content_dict.get("theory", "")
        word_count = len(theory.split())
        if word_count < 200:
            failures.append(f"{sub_id}: theory word count too short ({word_count} words)")
        if "$" not in theory:
            failures.append(f"{sub_id}: missing LaTeX formulas in theory")
            
        # 4. Real World App
        rwa = content_dict.get("realWorldApplication", "")
        if not rwa or len(rwa.strip()) < 30:
            failures.append(f"{sub_id}: realWorldApplication missing or too short")
            
        # 5. Code Example & Execution
        code = content_dict.get("codeSnippet", "")
        expected_output = content_dict.get("codeSnippetOutput", "")
        if not code:
            failures.append(f"{sub_id}: codeSnippet missing")
            
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        try:
            exec(code, {"__name__": "__main__"})
            actual_output = sys.stdout.getvalue().strip()
        except Exception as e:
            actual_output = f"ERROR: {e}"
        finally:
            sys.stdout = old_stdout
            
        if actual_output.startswith("ERROR:"):
            failures.append(f"{sub_id}: Code execution error: {actual_output}")
        elif actual_output != expected_output.strip():
            failures.append(
                f"{sub_id}: Code output mismatch!\nExpected:\n{expected_output.strip()}\nGot:\n{actual_output}"
            )
            
        # 6. Common Pitfalls
        pitfalls = sub.get("commonPitfalls", [])
        if not pitfalls:
            failures.append(f"{sub_id}: missing commonPitfalls")
            
        # 7. References
        refs = sub.get("academicReferences", [])
        if not refs:
            failures.append(f"{sub_id}: missing academicReferences")

print(f"\nTotal subchapters checked: {total_subs}")

# Spot check verbatim quotes
with open(json_files[0], "r", encoding="utf-8") as f:
    ch6 = json.load(f)
sub_6_2 = next(s for s in ch6 if s["id"] in ("10.6.2", "data-engineering-ai-ch6-sub2"))
if "We present Resilient Distributed Datasets (RDDs), a distributed memory abstraction" not in sub_6_2["content"]["theory"]:
    failures.append("Bab 6.2 missing verified Zaharia quote in theory")
else:
    print("[OK] Zaharia et al. 2012 quote verified in Bab 6.2")

with open(json_files[1], "r", encoding="utf-8") as f:
    ch7 = json.load(f)
sub_7_1 = next(s for s in ch7 if s["id"] in ("10.7.1", "data-engineering-ai-ch7-sub1"))
if "Spark SQL is a new module in Apache Spark that integrates relational processing" not in sub_7_1["content"]["theory"]:
    failures.append("Bab 7.1 missing verified Armbrust quote in theory")
else:
    print("[OK] Armbrust et al. 2015 quote verified in Bab 7.1")

with open(json_files[2], "r", encoding="utf-8") as f:
    ch8 = json.load(f)
sub_8_1 = next(s for s in ch8 if s["id"] in ("10.8.1", "data-engineering-ai-ch8-sub1"))
if "Log processing has become a critical component of the data pipeline" not in sub_8_1["content"]["theory"]:
    failures.append("Bab 8.1 missing verified Kreps quote in theory")
else:
    print("[OK] Kreps et al. 2011 quote verified in Bab 8.1")

if failures:
    print(f"\n[FAIL] Found {len(failures)} issues:")
    for f in failures:
        print(f" - {f}")
    sys.exit(1)
else:
    print(f"\n[SUCCESS] ALL {total_subs} SUBCHAPTERS AND CODE SNIPPETS VALIDATED PERFECTLY!")
