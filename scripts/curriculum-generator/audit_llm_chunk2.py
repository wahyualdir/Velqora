"""
Substantive Quality Gate & Spot-Check Auditor for LLM Chunk 2 (Bab 6 - 9)
"""

import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(__file__)
files = [os.path.join(BASE_DIR, f"llm_ch{i}_data.json") for i in range(6, 10)]

total_subchaps = 0
word_count_passes = 0
katex_passes = 0
components_passes = 0

spot_checks = {
    "18.6.5": {
        "found": False,
        "citation_terms": ["The RefinedWeb Dataset", "Falcon LLM", "Processing pipeline", "Penedo", "Section 3"],
        "name": "Spot-Check #1: Penedo et al. (2023) RefinedWeb Dataset for Falcon LLM"
    },
    "18.7.3": {
        "found": False,
        "citation_terms": ["ZeRO: Memory Optimizations", "Rajbhandari", "Section 3", "P_{os}", "P_{os+g}"],
        "name": "Spot-Check #2: Rajbhandari et al. (2020) DeepSpeed ZeRO Memory Optimizations"
    },
    "18.7.5": {
        "found": False,
        "citation_terms": ["Megatron-LM", "Model Parallel Transformers", "column-parallel", "row-parallel", "Shoeybi", "Section 3"],
        "name": "Spot-Check #3: Shoeybi et al. (2019) NVIDIA Megatron-LM Tensor Parallelism"
    },
    "18.8.3": {
        "found": False,
        "citation_terms": ["LoRA: Low-Rank Adaptation of Large Language Models", "Low-Rank Parameterized Update Matrices", "Section 4.1", "Hu", "\\Delta W = BA"],
        "name": "Spot-Check #4: Hu et al. (2022) LoRA Low-Rank Adaptation"
    },
    "18.8.8": {
        "found": False,
        "citation_terms": ["QLoRA: Efficient Finetuning of Quantized LLMs", "NormalFloat", "Double Quantization", "Dettmers", "Section 3"],
        "name": "Spot-Check #5: Dettmers et al. (2023) QLoRA 4-bit NormalFloat & Double Quantization"
    }
}

print("=== STARTING SUBSTANTIVE AUDIT FOR LLM CHUNK 2 (BAB 6 - 9) ===")

for ch_idx, file_path in enumerate(files, start=6):
    with open(file_path, "r", encoding="utf-8") as f:
        subchaps = json.load(f)
        
    print(f"\n--- Memeriksa Bab {ch_idx} ({len(subchaps)} subbab) ---")
    for sub in subchaps:
        total_subchaps += 1
        sub_id = sub.get("id", "unknown")
        title = sub.get("title", "No Title")
        c = sub.get("content", sub)
        
        theory = c.get("theory", "")
        code = c.get("codeSnippet", "")
        output = c.get("codeSnippetOutput", "")
        app = c.get("realWorldApplication", "")
        pitfalls = c.get("commonPitfalls", [])
        case_study = c.get("caseStudy", "")
        refs = c.get("academicReferences", [])
        
        # 1. Word count check
        words = len(theory.split())
        wc_ok = words >= 200
        if wc_ok:
            word_count_passes += 1
        else:
            print(f"[FAIL WC] {sub_id}: Word count {words} < 200!")
            
        # 2. KaTeX check
        katex_ok = ("$" in theory or "$$" in theory)
        if katex_ok:
            katex_passes += 1
        else:
            print(f"[FAIL KaTeX] {sub_id}: Tidak ditemukan simbol KaTeX ($)!")
            
        # 3. Components check
        comp_ok = (
            len(code) > 20 and
            len(output) > 5 and
            len(app) > 20 and
            len(pitfalls) >= 3 and
            len(case_study) > 20 and
            len(refs) >= 3
        )
        if comp_ok:
            components_passes += 1
        else:
            print(f"[FAIL COMP] {sub_id}: Komponen tidak lengkap (pitfalls={len(pitfalls)}, refs={len(refs)})!")
            
        # 4. Spot check match
        for sc_id, sc_info in spot_checks.items():
            if sub_id == sc_id:
                matches = sum(1 for term in sc_info["citation_terms"] if term.lower() in theory.lower())
                if matches >= 2:
                    sc_info["found"] = True
                    print(f"[SPOT-CHECK VERIFIED] {sc_info['name']} in Subbab {sub_id} ({matches}/{len(sc_info['citation_terms'])} key terms)")
                else:
                    print(f"[SPOT-CHECK WARNING] {sc_info['name']} in Subbab {sub_id} matched only {matches} terms!")

print("\n" + "=" * 65)
print(f"Total Subbab Diperiksa     : {total_subchaps}")
print(f"Word Count (>= 200 kata)   : {word_count_passes} / {total_subchaps}")
print(f"KaTeX Presisi ($ / $$)     : {katex_passes} / {total_subchaps}")
print(f"7 Komponen Lengkap         : {components_passes} / {total_subchaps}")
print("-" * 65)
all_spot_passed = all(sc["found"] for sc in spot_checks.values())
for sc_id, sc in spot_checks.items():
    status = "OK" if sc["found"] else "MISSING"
    print(f"  [{status}] {sc['name']}")
print("=" * 65)

if word_count_passes == 40 and katex_passes == 40 and components_passes == 40 and all_spot_passed:
    print("HASIL AUDIT SUBSTANTIF CHUNK 2: SEMPURNA 100% LOLOS QUALITY GATES!")
else:
    print("HASIL AUDIT SUBSTANTIF CHUNK 2: ADA KEGAGALAN TERDETEKSI!")
    sys.exit(1)
