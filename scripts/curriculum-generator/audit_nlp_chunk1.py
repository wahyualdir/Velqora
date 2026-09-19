# -*- coding: utf-8 -*-
"""
Auditor Substantif & Validasi Anti-Boilerplate NLP Chunk 1 (Bab 1 - 5)
Memverifikasi:
1. Jumlah kata per subbab >= 200 kata.
2. Keberadaan formula matematika LaTeX/KaTeX ($ atau $$).
3. 0 placeholder sintetis (x.x.1 s.d. x.x.10).
4. Struktur skema kurikulum lengkap (theory, code, output, pitfalls, case study, references).
5. Keberadaan 5 rujukan literatur primer kanonikal.
"""

import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

def audit_chunk1():
    print("=" * 80)
    print("AUDIT SUBSTANTIF & ANTI-BOILERPLATE NLP CHUNK 1 (BAB 1 - 5: 50 SUBBAB)")
    print("=" * 80)

    total_subchapters = 0
    passed_audit = 0
    issues = []

    expected_chapters = {
        1: "natural-language-processing-ch-1",
        2: "natural-language-processing-ch-2",
        3: "natural-language-processing-ch-3",
        4: "natural-language-processing-ch-4",
        5: "natural-language-processing-ch-5"
    }

    all_refs_text = []

    for ch, expected_ch_id in expected_chapters.items():
        fname = os.path.join(os.path.dirname(__file__), f"nlp_ch{ch}_data.json")
        if not os.path.exists(fname):
            issues.append(f"File {fname} hilang!")
            continue

        with open(fname, "r", encoding="utf-8") as f:
            subchapters = json.load(f)

        print(f"\n--- Mengaudit Bab {ch} ({len(subchapters)} Subbab) ---")
        for sub in subchapters:
            sub_id = sub.get("id", "")
            ch_id = sub.get("chapterId", "")
            title = sub.get("title", "")
            content = sub.get("content", {})
            theory = content.get("theory", "")
            code = content.get("codeSnippet", "")
            output = content.get("codeSnippetOutput", "")
            pitfalls = content.get("commonPitfalls", [])
            case_study = content.get("caseStudy", "")
            refs = content.get("academicReferences", [])

            total_subchapters += 1
            sub_issues = []

            # Check chapterId
            if ch_id != expected_ch_id:
                sub_issues.append(f"chapterId mismatch: {ch_id} != {expected_ch_id}")

            # Check word count in theory
            word_count = len(theory.split())
            if word_count < 200:
                sub_issues.append(f"Word count theory < 200 ({word_count} kata)")

            # Check KaTeX formulas
            if "$" not in theory:
                sub_issues.append("Tidak ditemukan formula LaTeX KaTeX ($)")

            # Check synthetic boilerplate
            if re.search(r'\b\d+\.\d+\.\d+\b', title):
                sub_issues.append(f"Terdeteksi penomoran sintetis (x.x.x) pada judul: {title}")

            # Check schema completeness
            if not code.strip():
                sub_issues.append("Code snippet kosong")
            if not output.strip():
                sub_issues.append("Code snippet output kosong")
            if len(pitfalls) < 2:
                sub_issues.append(f"Pitfalls kurang dari 2 (hanya {len(pitfalls)})")
            if not case_study.strip():
                sub_issues.append("Case study kosong")
            if len(refs) < 2:
                sub_issues.append(f"Referensi akademik kurang dari 2 (hanya {len(refs)})")

            # Collect references for primer audit
            for r in refs:
                all_refs_text.append(r)

            if sub_issues:
                issues.append((sub_id, sub_issues))
                print(f"  [FAIL] {sub_id} ({word_count} kata) -> {', '.join(sub_issues)}")
            else:
                passed_audit += 1
                print(f"  [OK] {sub_id:<45} | {word_count:>4} kata | KaTeX: Ya | Pitfalls: {len(pitfalls)} | Refs: {len(refs)}")

    print("\n" + "=" * 80)
    print(f"HASIL AUDIT STRUKTUR & KUALITAS: {passed_audit} / {total_subchapters} SUBBAB LOLOS")
    if issues:
        print(f"TERDAPAT {len(issues)} ISU KRITIS:")
        for sid, errs in issues:
            print(f"  - {sid}: {errs}")
        sys.exit(1)

    print("\n--- Verifikasi Keberadaan 5 Literatur Primer Kanonikal ---")
    joined_refs = " ".join(all_refs_text).lower()
    
    spot_checks = [
        ("Bab 1: Zellig S. Harris (1954) / J.R. Firth (1957)", any("harris" in r.lower() or "firth" in r.lower() for r in all_refs_text)),
        ("Bab 2: Rico Sennrich et al. (ACL 2016 - BPE)", any("sennrich" in r.lower() and "2016" in r.lower() for r in all_refs_text)),
        ("Bab 3: Reinhard Kneser & Hermann Ney (1995 - Kneser-Ney)", any("kneser" in r.lower() and "ney" in r.lower() for r in all_refs_text)),
        ("Bab 4: Karen Spärck Jones (1972 - TF-IDF)", any("spärck jones" in r.lower() or "sparck jones" in r.lower() for r in all_refs_text)),
        ("Bab 5: Tomas Mikolov et al. (NeurIPS 2013 - Word2Vec)", any("mikolov" in r.lower() and "2013" in r.lower() for r in all_refs_text))
    ]

    all_spots_ok = True
    for name, status in spot_checks:
        res = "[VERIFIED]" if status else "[MISSING]"
        if not status:
            all_spots_ok = False
        print(f"  {res} {name}")

    if not all_spots_ok:
        print("\n[ERROR] Terdapat rujukan literatur primer yang belum terdaftar!")
        sys.exit(1)

    print("\nSELURUH 5 SPOT-CHECK LITERATUR PRIMER TELAH TERVERIFIKASI PENUH!")
    print("=" * 80)

if __name__ == "__main__":
    audit_chunk1()
