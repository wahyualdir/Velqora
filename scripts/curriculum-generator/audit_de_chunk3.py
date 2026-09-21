# -*- coding: utf-8 -*-
"""
Audit Komprehensif Topik 10: Data Engineering & Big Data untuk AI
Pasca-Eksekusi Chunk 3 (Bab 1 - 13: 130 subbab).
Memeriksa struktur file TypeScript, status verifikasi substantif (130/180),
dan integritas 9 kutipan primer verbatim kanonikal.
"""

import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

target_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../src/lib/curriculum/topics/10-data-engineering-ai.ts"))

if not os.path.exists(target_file):
    print(f"[ERROR] Target file tidak ditemukan: {target_file}")
    sys.exit(1)

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Hitung total bab & subbab
chapter_ids = re.findall(r'["\']?id["\']?\s*:\s*["\']data-engineering-ai-ch-(\d+)["\']', content)
subchapter_ids = re.findall(r'["\']?id["\']?\s*:\s*["\']data-engineering-ai-ch\d+-sub\d+["\']', content)
verified_statuses = re.findall(r'["\']?contentStatus["\']?\s*:\s*["\']substantive-verified["\']', content)
review_statuses = re.findall(r'["\']?reviewStatus["\']?\s*:\s*["\']verified["\']', content)

print("=" * 60)
print("HASIL AUDIT STRUKTURAL TOPIK 10 (DATA ENGINEERING)")
print("=" * 60)
print(f"Total Bab Terdeteksi            : {len(chapter_ids)} bab (Bab 1 - {len(chapter_ids)})")
print(f"Total Subbab Terdeteksi         : {len(subchapter_ids)} subbab (Target: 180)")
print(f"Subbab Berstatus Substantif     : {len(verified_statuses)} / 180 ({len(verified_statuses)/180*100:.1f}%)")
print(f"Subbab Review Status Verified   : {len(review_statuses)} / 180 ({len(review_statuses)/180*100:.1f}%)")

# 2. Verifikasi 9 Kutipan Verbatim Kumulatif
quotes = [
    # Chunk 1
    ("Bab 1 (Gilbert & Lynch 2002 - CAP Theorem)",
     "When designing distributed web services, there are three properties that are commonly desired: consistency, availability, and partition tolerance."),
    ("Bab 2 (Abadi et al. 2008 - Column Stores)",
     "There has been a significant amount of excitement and recent work on column-oriented database systems (“column-stores”)."),
    ("Bab 5 (Armbrust et al. 2021 - Lakehouse)",
     "This paper argues that the data warehouse architecture as we know it today will wither in the coming years and be replaced by a new architectural pattern, the Lakehouse"),

    # Chunk 2
    ("Bab 6 (Matei Zaharia et al. 2012 - RDD)",
     "We present Resilient Distributed Datasets (RDDs), a distributed memory abstraction that lets programmers perform in-memory computations on large clusters in a fault-tolerant manner."),
    ("Bab 7 (Michael Armbrust et al. 2015 - Catalyst)",
     "Spark SQL is a new module in Apache Spark that integrates relational processing with Spark’s functional programming API."),
    ("Bab 8 (Jay Kreps et al. 2011 - Kafka)",
     "Log processing has become a critical component of the data pipeline for consumer internet companies. We introduce Kafka, a distributed messaging system that we developed for collecting and delivering high volumes of log data with low latency."),

    # Chunk 3
    ("Bab 10 (Andreakis & Papapanagiotou 2021 - DBLog)",
     "It is a commonly observed pattern for applications to utilize multiple heterogeneous databases where each is used to serve a specific need such as storing the canonical form of data or providing advanced search capabilities."),
    ("Bab 11 (Tyler Akidau et al. 2015 - The Dataflow Model)",
     "Unbounded, unordered, global-scale datasets are increasingly common in day-to-day business (e.g. Web logs, mobile usage statistics, and sensor networks)."),
    ("Bab 13 (Sebastian Schelter et al. 2018 - Amazon Deequ)",
     "Modern companies and institutions rely on data to guide every single business process and decision. Missing or incorrect information seriously compromises any decision process downstream.")
]

print("\n" + "=" * 60)
print("VERIFIKASI 9 KUTIPAN VERBATIM KANONIKAL KUMULATIF")
print("=" * 60)

all_quotes_found = True
for label, snippet in quotes:
    if snippet in content:
        print(f"[PASS] {label}: VERIFIKASI VERBATIM 100%")
    else:
        print(f"[FAIL] {label}: KUTIPAN TIDAK DITEMUKAN ATAU TIDAK VERBATIM!")
        all_quotes_found = False

# 3. Verifikasi Subbab Bab 10 - 13
print("\n" + "=" * 60)
print("AUDIT BAB 10 - 13 (CHUNK 3)")
print("=" * 60)

ch10_subs = re.findall(r'["\']?id["\']?\s*:\s*["\']data-engineering-ai-ch10-sub\d+["\']', content)
ch11_subs = re.findall(r'["\']?id["\']?\s*:\s*["\']data-engineering-ai-ch11-sub\d+["\']', content)
ch12_subs = re.findall(r'["\']?id["\']?\s*:\s*["\']data-engineering-ai-ch12-sub\d+["\']', content)
ch13_subs = re.findall(r'["\']?id["\']?\s*:\s*["\']data-engineering-ai-ch13-sub\d+["\']', content)

print(f"Bab 10 Subbab: {len(ch10_subs)} / 10")
print(f"Bab 11 Subbab: {len(ch11_subs)} / 10")
print(f"Bab 12 Subbab: {len(ch12_subs)} / 10")
print(f"Bab 13 Subbab: {len(ch13_subs)} / 10")

# 4. Verifikasi Formulasi LaTeX
latex_count = content.count("$")
print(f"\nTotal Simbol LaTeX ($) Terdeteksi: {latex_count}")

# 5. Verifikasi Komponen Wajib per Subbab
comp_checks = [
    ("learningObjectives", len(re.findall(r'["\']?learningObjectives["\']?\s*:', content))),
    ("prerequisites", len(re.findall(r'["\']?prerequisites["\']?\s*:', content))),
    ("codeExamples", len(re.findall(r'["\']?codeExamples["\']?\s*:', content))),
    ("references", len(re.findall(r'["\']?references["\']?\s*:', content))),
    ("commonPitfalls", len(re.findall(r'["\']?commonPitfalls["\']?\s*:', content))),
    ("caseStudy", len(re.findall(r'["\']?caseStudy["\']?\s*:', content))),
]
print("\nKomponen Wajib Terdeteksi (Kumulatif):")
for name, cnt in comp_checks:
    print(f"  {name:20}: {cnt}")

success = (
    len(chapter_ids) == 18 and
    len(subchapter_ids) == 180 and
    len(verified_statuses) == 130 and
    len(review_statuses) == 130 and
    all_quotes_found and
    len(ch10_subs) == 10 and
    len(ch11_subs) == 10 and
    len(ch12_subs) == 10 and
    len(ch13_subs) == 10
)

if success:
    print("\n[SUCCESS] SELURUH AUDIT CHUNK 3 BERHASIL DILALUI DENGAN SEMPURNA!")
else:
    print("\n[ERROR] AUDIT GAGAL, SILAKAN PERIKSA DETAIL DI ATAS.")
    sys.exit(1)
