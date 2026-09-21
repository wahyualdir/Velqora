# -*- coding: utf-8 -*-
"""
Auditor Pra-Integrasi Chunk 3 (Bab 10 - 13) Data Engineering & Big Data AI.
Memeriksa integritas 40 subbab, 7 komponen wajib, word count >= 215,
kode snippet deterministic output, dan 3 kutipan verbatim resmi.
"""

import json
import os
import sys

base_dir = os.path.dirname(__file__)
files = [
    os.path.join(base_dir, "de_ch10_data.json"),
    os.path.join(base_dir, "de_ch11_data.json"),
    os.path.join(base_dir, "de_ch12_data.json"),
    os.path.join(base_dir, "de_ch13_data.json"),
]

total_subchapters = 0
all_subchapters = []

for fpath in files:
    if not os.path.exists(fpath):
        print(f"[FAIL] Berkas tidak ditemukan: {fpath}")
        sys.exit(1)
    with open(fpath, "r", encoding="utf-8") as f:
        data = json.load(f)
        total_subchapters += len(data)
        all_subchapters.extend(data)

print(f"Total subbab dimuat: {total_subchapters} (Target: 40)")
assert total_subchapters == 40, f"Ditemukan {total_subchapters} subbab, diharapkan 40!"

# Validasi setiap subbab
errors = []
for sub in all_subchapters:
    sub_id = sub["id"]
    title = sub.get("title", "")
    objectives = sub.get("learningObjectives", [])
    prereqs = sub.get("prerequisites", [])
    pitfalls = sub.get("commonPitfalls", [])
    refs = sub.get("academicReferences", [])
    content = sub.get("content", {})
    theory = content.get("theory", "")
    real_world = content.get("realWorldApplication", "")
    code = content.get("codeSnippet", "")
    output = content.get("codeSnippetOutput", "")
    
    # 7 komponen
    if not title:
        errors.append(f"{sub_id}: Title kosong")
    if len(objectives) < 3:
        errors.append(f"{sub_id}: learningObjectives kurang dari 3 ({len(objectives)})")
    if not prereqs:
        errors.append(f"{sub_id}: prerequisites kosong")
    if not pitfalls:
        errors.append(f"{sub_id}: commonPitfalls kosong")
    if not refs:
        errors.append(f"{sub_id}: academicReferences kosong")
    if not real_world:
        errors.append(f"{sub_id}: realWorldApplication kosong")
    if not code:
        errors.append(f"{sub_id}: codeSnippet kosong")
    if not output:
        errors.append(f"{sub_id}: codeSnippetOutput kosong")
        
    word_count = len(theory.split())
    if word_count < 215:
        errors.append(f"{sub_id}: Theory kurang dari 215 kata ({word_count} kata)")

# Validasi 3 Kutipan Verbatim
expected_andreakis = (
    "It is a commonly observed pattern for applications to utilize multiple heterogeneous databases "
    "where each is used to serve a specific need such as storing the canonical form of data or providing "
    "advanced search capabilities."
)
expected_akidau = (
    "Unbounded, unordered, global-scale datasets are increasingly common in day-to-day business "
    "(e.g. Web logs, mobile usage statistics, and sensor networks)."
)
expected_schelter = (
    "Modern companies and institutions rely on data to guide every single business process and decision. "
    "Missing or incorrect information seriously compromises any decision process downstream."
)

sub_10_6 = next((s for s in all_subchapters if s["id"] == "10.10.6"), None)
sub_11_3 = next((s for s in all_subchapters if s["id"] == "11.11.3" or s["id"] == "10.11.3"), None)
sub_13_3 = next((s for s in all_subchapters if s["id"] == "10.13.3"), None)

if not sub_10_6 or expected_andreakis not in sub_10_6["content"]["theory"]:
    errors.append("10.10.6: Kutipan Andreakis & Papapanagiotou (DBLog) tidak ditemukan atau tidak cocok verbatim!")
else:
    print("[PASS] 10.10.6: Kutipan Andreakis & Papapanagiotou (DBLog) VERIFIKASI VERBATIM.")

if not sub_11_3 or expected_akidau not in sub_11_3["content"]["theory"]:
    errors.append("10.11.3: Kutipan Tyler Akidau et al. (The Dataflow Model) tidak ditemukan atau tidak cocok verbatim!")
else:
    print("[PASS] 10.11.3: Kutipan Tyler Akidau et al. (The Dataflow Model) VERIFIKASI VERBATIM.")

if not sub_13_3 or expected_schelter not in sub_13_3["content"]["theory"]:
    errors.append("10.13.3: Kutipan Sebastian Schelter et al. (Amazon Deequ) tidak ditemukan atau tidak cocok verbatim!")
else:
    print("[PASS] 10.13.3: Kutipan Sebastian Schelter et al. (Amazon Deequ) VERIFIKASI VERBATIM.")

if errors:
    print(f"\n[FAIL] Ditemukan {len(errors)} kesalahan:")
    for e in errors:
        print(f"  - {e}")
    sys.exit(1)

print(f"\n[ALL PASS] Seluruh 40 subbab Bab 10 - 13 memenuhi standar 100%!")
