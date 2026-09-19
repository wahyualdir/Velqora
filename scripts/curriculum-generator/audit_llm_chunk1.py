"""
Substantive Quality Gate & Spot-Check Auditor for LLM Chunk 1 (Bab 1 - 5)
"""

import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(__file__)
files = [os.path.join(BASE_DIR, f"llm_ch{i}_data.json") for i in range(1, 6)]

total_subchaps = 0
word_count_passes = 0
katex_passes = 0
components_passes = 0

spot_checks = {
    "1.3": {
        "found": False,
        "citation_terms": ["Attention(Q, K, V) = softmax", "1 / sqrt(d_k)", "Vaswani", "Section 3.2.1"],
        "name": "Spot-Check #1: Vaswani et al. (2017) Scaled Dot-Product Attention"
    },
    "1.8": {
        "found": False,
        "citation_terms": ["SwiGLU", "Noam Shazeer", "Section 2", "8/3 d_model"],
        "name": "Spot-Check #2: Shazeer (2020) SwiGLU FFN Activation"
    },
    "18.3.5": {
        "found": False,
        "citation_terms": ["Language Models are Unsupervised Multitask Learners", "Section 2.2", "Byte Pair Encoding", "Radford"],
        "name": "Spot-Check #3: Radford et al. (2019) GPT-2 Byte-Level BPE"
    },
    "18.4.5": {
        "found": False,
        "citation_terms": ["RoFormer: Enhanced Transformer with Rotary Position Embedding", "Section 3.1", "Jianlin Su", "R_{\\Theta, m}^{2}"],
        "name": "Spot-Check #4: Su et al. (2021/2024) RoPE Rotary Position Embedding"
    },
    "18.5.5": {
        "found": False,
        "citation_terms": ["Training Compute-Optimal Large Language Models", "Section 1", "Section 4", "Chinchilla", "Hoffmann"],
        "name": "Spot-Check #5: Hoffmann et al. (2022) Chinchilla Scaling Laws"
    }
}

print("=== STARTING SUBSTANTIVE AUDIT FOR LLM CHUNK 1 (BAB 1 - 5) ===")

for ch_idx, file_path in enumerate(files, start=1):
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
                # Cek apakah terms ada di teori
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

if word_count_passes == 50 and katex_passes == 50 and components_passes == 50 and all_spot_passed:
    print("HASIL AUDIT SUBSTANTIF: SEMPURNA 100% LOLOS QUALITY GATES!")
else:
    print("HASIL AUDIT SUBSTANTIF: ADA KEGAGALAN TERDETEKSI!")
    sys.exit(1)
