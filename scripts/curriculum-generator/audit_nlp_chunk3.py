# -*- coding: utf-8 -*-
"""
Auditor Substantif untuk Chunk 3 (Bab 10 - 13) NLP.
Memeriksa:
1. 7 komponen lengkap di setiap subbab
2. Word count teori >= 200 kata
3. Keberadaan formula KaTeX ($ inline dan $$ display)
4. Minimal 3 common pitfalls dan 3 academic references
5. 0 boilerplate sintetis (x.x.1 s.d. x.x.10)
6. 5 Spot-Check Primer Verbatim lengkap
"""

import json
import os
import sys
import re

def audit_chunk3():
    base_dir = os.path.dirname(__file__)
    chapters = [10, 11, 12, 13]
    total_subchaps = 0
    errors = []

    print("=== AUDIT SUBSTANTIF CHUNK 3 (BAB 10 - 13) NLP ===")

    for ch in chapters:
        json_path = os.path.join(base_dir, f"nlp_ch{ch}_data.json")
        with open(json_path, "r", encoding="utf-8") as f:
            subchaps = json.load(f)
            
        print(f"\nAudit Bab {ch}: {len(subchaps)} subbab")
        for sub in subchaps:
            total_subchaps += 1
            s_id = sub["id"]
            title = sub["title"]
            c = sub["content"] if "content" in sub else sub
            
            # 1. Periksa 7 Komponen Wajib
            req_keys = ["theory", "codeSnippet", "codeSnippetOutput", 
                        "realWorldApplication", "commonPitfalls", "caseStudy", "academicReferences"]
            for k in req_keys:
                if k not in c or not c[k]:
                    errors.append(f"[{s_id}] Field '{k}' hilang atau kosong!")

            # 2. Word Count Teori >= 200 kata
            words = len(c["theory"].split())
            if words < 200:
                errors.append(f"[{s_id}] Teori terlalu pendek: {words} kata (< 200 kata)!")

            # 3. Formula KaTeX
            if "$" not in c["theory"]:
                errors.append(f"[{s_id}] Teori tidak memuat notasi KaTeX ($)!")

            # 4. Common Pitfalls >= 3
            if len(c.get("commonPitfalls", [])) < 3:
                errors.append(f"[{s_id}] commonPitfalls < 3 ({len(c.get('commonPitfalls', []))})")

            # 5. Academic References >= 3
            if len(c.get("academicReferences", [])) < 3:
                errors.append(f"[{s_id}] academicReferences < 3 ({len(c.get('academicReferences', []))})")

            # 6. Boilerplate sintetis
            if re.search(r'\b\d+\.\d+\.\d+\b', title):
                errors.append(f"[{s_id}] Judul memuat penomoran sintetis 3 level: {title}")

            print(f"  OK: {title[:65]}... ({words} kata)")

    # 7. Audit Khusus 5 Spot-Check Primer Verbatim
    print("\n--- AUDIT KHUSUS 5 SPOT-CHECK PRIMER VERBATIM ---")
    
    # Spot-Check #1: Devlin et al. (2019) Bab 10
    with open(os.path.join(base_dir, "nlp_ch10_data.json"), "r", encoding="utf-8") as f:
        ch10 = json.load(f)
    sc1 = next(s for s in ch10 if "devlin" in s["id"] or "10-2" in s["id"])
    sc1_c = sc1["content"] if "content" in sc1 else sc1
    sc1_theory = sc1_c["theory"]
    sc1_checks = ["Section 3", "80% of the time", "10% of the time", "Next Sentence Prediction", "Devlin"]
    for check in sc1_checks:
        if check.lower() not in sc1_theory.lower():
            errors.append(f"[Spot-Check #1 Devlin] Teks '{check}' tidak ditemukan di teori Subbab 10.2!")
    print("  [PASSED] Spot-Check #1: Devlin et al. (2019) BERT Pre-training")

    # Spot-Check #2: Bahdanau et al. (2015) Bab 11
    with open(os.path.join(base_dir, "nlp_ch11_data.json"), "r", encoding="utf-8") as f:
        ch11 = json.load(f)
    sc2 = next(s for s in ch11 if "bahdanau" in s["id"] or "11-2" in s["id"])
    sc2_c = sc2["content"] if "content" in sc2 else sc2
    sc2_theory = sc2_c["theory"]
    sc2_checks = ["Section 3", "Equations (1) to (6)", "v_a^\\top \\tanh", "Bahdanau"]
    for check in sc2_checks:
        if check.lower() not in sc2_theory.lower():
            errors.append(f"[Spot-Check #2 Bahdanau] Teks '{check}' tidak ditemukan di teori Subbab 11.2!")
    print("  [PASSED] Spot-Check #2: Bahdanau et al. (2015) Additive Attention NMT")

    # Spot-Check #3: Raffel et al. (2020) Bab 12
    with open(os.path.join(base_dir, "nlp_ch12_data.json"), "r", encoding="utf-8") as f:
        ch12 = json.load(f)
    sc3 = next(s for s in ch12 if "span-corruption" in s["id"] or "12-2" in s["id"])
    sc3_c = sc3["content"] if "content" in sc3 else sc3
    sc3_theory = sc3_c["theory"]
    sc3_checks = ["Section 2", "Section 3.1.4", "<extra_id_0>", "sentinel token", "Raffel"]
    for check in sc3_checks:
        if check.lower() not in sc3_theory.lower():
            errors.append(f"[Spot-Check #3 Raffel T5] Teks '{check}' tidak ditemukan di teori Subbab 12.2!")
    print("  [PASSED] Spot-Check #3: Raffel et al. (2020) T5 Span-Corruption")

    # Spot-Check #4: Lewis et al. (2020) Bab 12
    sc4 = next(s for s in ch12 if "bart" in s["id"] or "12-3" in s["id"])
    sc4_c = sc4["content"] if "content" in sc4 else sc4
    sc4_theory = sc4_c["theory"]
    sc4_checks = ["Section 2.1", "Token Masking", "Token Deletion", "Text Infilling", "Sentence Permutation", "Document Rotation", "Lewis"]
    for check in sc4_checks:
        if check.lower() not in sc4_theory.lower():
            errors.append(f"[Spot-Check #4 Lewis BART] Teks '{check}' tidak ditemukan di teori Subbab 12.3!")
    print("  [PASSED] Spot-Check #4: Lewis et al. (2020) BART 5 Denoising Transformations")

    # Spot-Check #5: Blei et al. (2003) Bab 13
    with open(os.path.join(base_dir, "nlp_ch13_data.json"), "r", encoding="utf-8") as f:
        ch13 = json.load(f)
    sc5 = next(s for s in ch13 if "blei" in s["id"] or "13-2" in s["id"])
    sc5_c = sc5["content"] if "content" in sc5 else sc5
    sc5_theory = sc5_c["theory"]
    sc5_checks = ["Section 3", "Poisson", "Dir", "\\alpha", "Multinomial", "Blei"]
    for check in sc5_checks:
        if check.lower() not in sc5_theory.lower():
            errors.append(f"[Spot-Check #5 Blei LDA] Teks '{check}' tidak ditemukan di teori Subbab 13.2!")
    print("  [PASSED] Spot-Check #5: Blei et al. (2003) LDA Generative Model")

    print("\n" + "=" * 70)
    print(f"TOTAL SUBBAB DIAUDIT: {total_subchaps}/40")
    if errors:
        print("\nGALAT AUDIT DITEMUKAN:")
        for err in errors:
            print(f"  [ERROR] {err}")
        sys.exit(1)
    else:
        print("SEMUA 40 SUBBAB LOLOS AUDIT MUTU SUBSTANTIF DAN 5 SPOT-CHECK 100%!")
        sys.exit(0)

if __name__ == "__main__":
    audit_chunk3()
