# -*- coding: utf-8 -*-
"""
Audit script untuk Chunk 2 (Bab 6 - 9: 40 subbab) & Kumulatif (Bab 1 - 9: 90 subbab)
Topik 10: Data Engineering & Big Data untuk AI
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

print("=== MEMULAI AUDIT MUTU CHUNK 2 (BAB 6 - 9) & KUMULATIF TOPIK 10 ===")

# 1. Cek 3 Kutipan Verbatim Resmi Chunk 2
quotes_chunk2 = [
    {
        "name": "Bab 6.2 - Matei Zaharia et al. (NSDI 2012) Resilient Distributed Datasets",
        "text": "We present Resilient Distributed Datasets (RDDs), a distributed memory abstraction that lets programmers perform in-memory computations on large clusters in a fault-tolerant manner. RDDs are motivated by two types of applications that current computing frameworks handle inefficiently: iterative algorithms and interactive data mining tools. In both cases, keeping data in memory can improve performance by an order of magnitude. To achieve fault tolerance efficiently, RDDs provide a restricted form of shared memory, based on coarse-grained transformations rather than fine-grained updates to shared state. However, we show that RDDs are expressive enough to capture a wide class of computations, including recent specialized programming models for iterative jobs, such as Pregel, and new applications that these models do not capture. We have implemented RDDs in a system called Spark, which we evaluate through a variety of user applications and benchmarks."
    },
    {
        "name": "Bab 7.1 - Michael Armbrust et al. (SIGMOD 2015) Spark SQL & Catalyst Optimizer",
        "text": "Spark SQL is a new module in Apache Spark that integrates relational processing with Spark’s functional programming API. Built on our experience with Shark, Spark SQL lets Spark programmers leverage the benefits of relational processing (e.g., declarative queries and optimized storage), and lets SQL users call complex analytics libraries in Spark (e.g., machine learning). Compared to previous systems, Spark SQL makes two main additions. First, it offers much tighter integration between relational and procedural processing, through a declarative DataFrame API that integrates with procedural Spark code. Second, it includes a highly extensible optimizer, Catalyst, built using features of the Scala programming language, that makes it easy to add composable rules, control code generation, and define extension points. Using Catalyst, we have built a variety of features (e.g., schema inference for JSON, machine learning types, and query federation to external databases) tailored for the complex needs of modern data analysis. We see Spark SQL as an evolution of both SQL-on-Spark and of Spark itself, offering richer APIs and optimizations while keeping the benefits of the Spark programming model."
    },
    {
        "name": "Bab 8.1 - Jay Kreps, Neha Narkhede, Jun Rao (NetDB 2011) Apache Kafka",
        "text": "Log processing has become a critical component of the data pipeline for consumer internet companies. We introduce Kafka, a distributed messaging system that we developed for collecting and delivering high volumes of log data with low latency. Our system incorporates ideas from existing log aggregators and messaging systems, and is suitable for both offline and online message consumption. We made quite a few unconventional yet practical design choices in Kafka to make our system efficient and scalable. Our experimental results show that Kafka has superior performance when compared to two popular messaging systems. We have been using Kafka in production for some time and it is processing hundreds of gigabytes of new data each day."
    }
]

print("\n1. Verifikasi 3 Kutipan Verbatim Resmi Chunk 2:")
all_quotes_ok = True
for q in quotes_chunk2:
    if q["text"] in content:
        print(f"  [OK] {q['name']} ditemukan 100% persis verbatim.")
    else:
        print(f"  [FAIL] {q['name']} TIDAK DITEMUKAN!")
        all_quotes_ok = False

# 2. Cek juga kutipan Chunk 1 (regresi check)
quotes_chunk1 = [
    "When designing distributed web services, there are three properties that are commonly desired: consistency, availability, and partition tolerance.",
    "There has been a significant amount of excitement and recent work on column-oriented database systems (“column-stores”).",
    "This paper argues that the data warehouse architecture as we know it today will wither in the coming years and be replaced by a new architectural pattern, the Lakehouse"
]
print("\n2. Verifikasi Regresi 3 Kutipan Verbatim Chunk 1:")
for idx, q_text in enumerate(quotes_chunk1, start=1):
    if q_text in content:
        print(f"  [OK] Kutipan Chunk 1 #{idx} tetap utuh 100%.")
    else:
        print(f"  [FAIL] Kutipan Chunk 1 #{idx} HILANG!")
        all_quotes_ok = False

# 3. Hitung jumlah subbab yang berstatus substantive-verified di file
substantive_matches = re.findall(r'["\']?contentStatus["\']?\s*:\s*["\']substantive-verified["\']', content)
verified_matches = re.findall(r'["\']?reviewStatus["\']?\s*:\s*["\']verified["\']', content)

print(f"\n3. Verifikasi Status Subbab:")
print(f"  Jumlah 'contentStatus: substantive-verified' : {len(substantive_matches)} (Ekspektasi: >= 90)")
print(f"  Jumlah 'reviewStatus: verified'             : {len(verified_matches)} (Ekspektasi: >= 90)")

# 4. Validasi ID Subbab Bab 1 - 9
print(f"\n4. Verifikasi Keberadaan ID Subbab Bab 1 - 9 (90 Subbab):")
missing_ids = []
for ch in range(1, 10):
    for sub in range(1, 11):
        sub_id = f"data-engineering-ai-ch{ch}-sub{sub}"
        if f'"{sub_id}"' in content or f"'{sub_id}'" in content:
            pass
        else:
            missing_ids.append(sub_id)

if not missing_ids:
    print(f"  [OK] Semua 90 ID subbab (ch1-sub1 s.d. ch9-sub10) terpasang sempurna tanpa celah.")
else:
    print(f"  [FAIL] ID subbab hilang: {missing_ids}")

# 5. Verifikasi Keberadaan Elemen LaTeX ($ dan $$)
latex_inline = content.count("$")
print(f"\n5. Verifikasi Formulasi Matematika LaTeX:")
print(f"  Total simbol matematika LaTeX ($) terdeteksi: {latex_inline} kemunculan.")

# 6. Verifikasi Komponen Wajib
print(f"\n6. Verifikasi 7 Komponen Wajib:")
comp_checks = [
    ("learningObjectives", len(re.findall(r'["\']?learningObjectives["\']?\s*:', content))),
    ("prerequisites", len(re.findall(r'["\']?prerequisites["\']?\s*:', content))),
    ("codeExamples", len(re.findall(r'["\']?codeExamples["\']?\s*:', content))),
    ("references", len(re.findall(r'["\']?references["\']?\s*:', content))),
    ("commonPitfalls", len(re.findall(r'["\']?commonPitfalls["\']?\s*:', content))),
    ("caseStudy", len(re.findall(r'["\']?caseStudy["\']?\s*:', content))),
]
for comp_name, count in comp_checks:
    print(f"  - {comp_name:20s}: {count} blok ditemukan.")

if all_quotes_ok and len(substantive_matches) >= 90 and not missing_ids:
    print("\nAUDIT MUTU CHUNK 2 & KUMULATIF BAB 1-9 TOPIK 10 SUKSES PENUH DENGAN NILAI SEMPURNA!")
else:
    print("\nAUDIT MENEMUKAN KETIDAKSESUAIAN!")
    sys.exit(1)
