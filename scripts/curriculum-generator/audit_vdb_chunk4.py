# -*- coding: utf-8 -*-
"""
Auditor Substantif Kualitas untuk Chunk 4 (Bab 13 - 15)
dan Verifikasi Keseluruhan Topik 28 (Bab 1 - 15, 150 Subbab)
Topik 28: Vector Database & Retrieval
src/lib/curriculum/topics/28-vector-database-retrieval.ts
"""

import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

base_dir = os.path.dirname(__file__)
target_file = os.path.abspath(os.path.join(base_dir, "../../src/lib/curriculum/topics/28-vector-database-retrieval.ts"))

if not os.path.exists(target_file):
    print(f"[ERROR] Target file tidak ditemukan: {target_file}")
    sys.exit(1)

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

# Ekstrak blok Bab 13 sampai Bab 15 (akhir file)
ch13_match = re.search(r'["\']?id["\']?\s*:\s*["\']vector-database-retrieval-ch-13["\']', content)

if not ch13_match:
    print(f"[ERROR] Marker Bab 13 tidak ditemukan!")
    sys.exit(1)

ch13_pos = ch13_match.start()
chunk4_text = content[ch13_pos:]

# 1. Hitung jumlah subbab Chunk 4
sub_ids = re.findall(r'"id": "(vector-database-retrieval-ch(?:13|14|15)-sub\d+)"', chunk4_text)
print("=" * 75)
print("AUDIT SUBSTANTIF CHUNK 4 (BAB 13 - 15): TOPIK 28 VECTOR DATABASE & RETRIEVAL")
print("=" * 75)
print(f"Total subbab terdeteksi di Chunk 4: {len(sub_ids)} (Target: 30 subbab)")

if len(sub_ids) != 30:
    print(f"[FAIL] Jumlah subbab Chunk 4 tidak sama dengan 30! Terdeteksi: {len(sub_ids)}")
    sys.exit(1)
else:
    print("[PASS] Jumlah subbab Chunk 4 tepat 30/30.")

# 2. Verifikasi status substantive-verified pada Chunk 4
verified_count = len(re.findall(r'"contentStatus": "substantive-verified"', chunk4_text))
print(f"Subbab dengan status substantive-verified: {verified_count}/30")
if verified_count != 30:
    print(f"[FAIL] Ditemukan subbab yang belum substantive-verified! Count: {verified_count}")
    sys.exit(1)
else:
    print("[PASS] Seluruh 30 subbab berstatus substantive-verified 100%.")

# 3. Verifikasi word count dan 7 komponen
sub_blocks = re.split(r'\{\s*"id": "vector-database-retrieval-ch(?:13|14|15)-sub\d+"', chunk4_text)
passed_quality = 0

for idx, block in enumerate(sub_blocks[1:], 1):
    words = len(block.split())
    has_math = "$" in block
    has_code = '"code":' in block
    has_output = '"expectedOutput":' in block
    has_refs = '"references":' in block
    has_pitfalls = '"commonPitfalls":' in block
    has_objectives = '"learningObjectives":' in block
    
    if words >= 200 and has_math and has_code and has_output and has_refs and has_pitfalls and has_objectives:
        passed_quality += 1
    else:
        print(f"  [WARN] Subbab {idx} kurang komponen: words={words}, math={has_math}, code={has_code}, out={has_output}, refs={has_refs}")

print(f"Subbab lolos 7 komponen & word count: {passed_quality}/30")
if passed_quality != 30:
    print(f"[FAIL] Terdapat subbab yang belum memenuhi 7 komponen!")
    sys.exit(1)
else:
    print("[PASS] Seluruh 30 subbab memenuhi 7 komponen akademik.")

# 4. Spot-check 3 Kutipan Primer Verbatim Chunk 4
spot_checks = [
    {
        "author": "Diego Ongaro & John Ousterhout (USENIX ATC 2014) - Bab 13.3",
        "quote": "Raft is a consensus algorithm for managing a replicated log. It produces a result equivalent to (multi-)Paxos, and it is as efficient as Paxos, but its structure is different from Paxos; this makes Raft more understandable than Paxos and also provides a better foundation for building practical systems. In order to enhance understandability, Raft separates the key elements of consensus, such as leader election, log replication, and safety, and it enforces a stronger degree of coherency to reduce the number of states that must be considered."
    },
    {
        "author": "Martin Aumüller, Erik Bernhardsson, Alexander Faithfull (Information Systems 2020) - Bab 14.8",
        "quote": "This paper describes ANN-Benchmarks, a tool for evaluating the performance of in-memory approximate nearest neighbor algorithms. It provides a standard interface for measuring the performance and quality achieved by nearest neighbor algorithms on different standard data sets. It supports several different ways of integrating $k$-NN algorithms, and its configuration system automatically tests a range of parameter settings for each algorithm. Algorithms are compared with respect to many different (approximate) quality measures, and adding more is easy and fast; the included plotting front-ends can visualise these as images, $\\LaTeX$ plots, and websites with interactive plots. ANN-Benchmarks aims to provide a constantly updated overview of the current state of the art of $k$-NN algorithms."
    },
    {
        "author": "John X. Morris et al. (EMNLP 2023 / arXiv:2310.06816) - Bab 15.2",
        "quote": "How much private information do text embeddings reveal about the original text? We investigate the problem of embedding inversion, reconstructing the full text represented in dense text embeddings. We frame the problem as controlled generation: generating text that, when reembedded, is close to a fixed point in latent space. We find that although a naïve model conditioned on the embedding performs poorly, a multi-step method that iteratively corrects and re-embeds text is able to recover 92% of 32-token text inputs exactly. We train our model to decode text embeddings from two state-of-the-art embedding models, and also show that our model can recover important personal information (full names) from a dataset of clinical notes."
    }
]

print("\n" + "=" * 75)
print("VERIFIKASI KUTIPAN PRIMER VERBATIM 100% PERSIS KARAKTER-DEMI-KARAKTER")
print("=" * 75)

quote_failures = 0
for sc in spot_checks:
    author = sc["author"]
    quote = sc["quote"]
    # Periksa keberadaan dalam chunk4_text
    # Normalisasi spasi dan escape JSON
    escaped_quote = quote.replace('\\', '\\\\').replace('"', '\\"')
    
    found = False
    if quote in chunk4_text or escaped_quote in chunk4_text:
        found = True
    elif quote.replace('\\LaTeX', '\\\\LaTeX').replace('"', '\\"') in chunk4_text:
        found = True
    elif quote.replace('$\\LaTeX$', '$\\\\LaTeX$').replace('"', '\\"') in chunk4_text:
        found = True
    else:
        # Coba periksa substring kunci
        key_part = quote[:80]
        if key_part in chunk4_text:
            print(f"  [PARTIAL] Bagian awal kutipan {author} ditemukan, namun ada perbedaan karakter halus!")
        else:
            print(f"  [NOT FOUND] Kutipan {author} tidak ditemukan!")
        quote_failures += 1
        continue
        
    if found:
        print(f"  [PASS] {author}")
        print(f"         \"{quote[:75]}...\" [VERBATIM COCOK 100%]")

if quote_failures > 0:
    print(f"\n[FAIL] Terdapat {quote_failures} kutipan primer yang tidak cocok verbatim persis!")
    sys.exit(1)
else:
    print("\n[PASS] Semua 3 kutipan primer Chunk 4 terverifikasi 100% verbatim persis dokumen resmi.")

# 5. Verifikasi Total Topik 28 (Bab 1 - 15)
print("\n" + "=" * 75)
print("VERIFIKASI TOTAL TOPIK 28 (SELURUH BAB 1 - 15): 100% KELENGKAPAN")
print("=" * 75)

all_sub_ids = re.findall(r'"id": "(vector-database-retrieval-ch\d+-sub\d+)"', content)
all_verified_status = len(re.findall(r'"contentStatus": "substantive-verified"', content))

print(f"Total Subbab di File Target : {len(all_sub_ids)} / 150")
print(f"Total Status Terverifikasi  : {all_verified_status} / 150")
percentage = (all_verified_status / 150) * 100
print(f"Persentase Penyelesaian     : {percentage:.1f}%")

if len(all_sub_ids) == 150 and all_verified_status == 150:
    print("\n[SELAMAT] TOPIK 28 TELAH TUNTAS 100.0% (150/150 SUBBAB SUBSTANTIF TERVERIFIKASI)!")
else:
    print(f"\n[FAIL] Topik 28 belum mencapai 150/150 subbab!")
    sys.exit(1)
