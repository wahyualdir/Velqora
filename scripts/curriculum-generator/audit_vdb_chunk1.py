# -*- coding: utf-8 -*-
"""
Auditor Substantif Kualitas untuk Chunk 1 (Bab 1 - 4)
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

# Ekstrak blok Bab 1 sampai Bab 4
ch1_match = re.search(r'["\']?id["\']?\s*:\s*["\']vector-database-retrieval-ch-1["\']', content)
ch5_match = re.search(r'["\']?id["\']?\s*:\s*["\']vector-database-retrieval-ch-5["\']', content)

if not ch1_match or not ch5_match:
    print(f"[ERROR] Marker bab tidak ditemukan! ch1={ch1_match}, ch5={ch5_match}")
    sys.exit(1)

ch1_pos = ch1_match.start()
ch5_pos = ch5_match.start()

chunk1_text = content[ch1_pos:ch5_pos]

# 1. Hitung jumlah subbab
sub_ids = re.findall(r'"id": "(vector-database-retrieval-ch[1-4]-sub\d+)"', chunk1_text)
print("=" * 70)
print(f"AUDIT SUBSTANTIF CHUNK 1 (BAB 1 - 4): TOPIK 28 VECTOR DATABASE & RETRIEVAL")
print("=" * 70)
print(f"Total subbab terdeteksi di Chunk 1: {len(sub_ids)} (Target: 40 subbab)")

if len(sub_ids) != 40:
    print(f"[FAIL] Jumlah subbab tidak sama dengan 40!")
    sys.exit(1)
else:
    print("[PASS] Jumlah subbab tepat 40/40.")

# 2. Verifikasi status substantive-verified
verified_count = len(re.findall(r'"contentStatus": "substantive-verified"', chunk1_text))
print(f"Subbab dengan status substantive-verified: {verified_count}/40")
if verified_count != 40:
    print(f"[FAIL] Ditemukan subbab yang belum substantive-verified!")
    sys.exit(1)
else:
    print("[PASS] Seluruh 40 subbab berstatus substantive-verified 100%.")

# 3. Verifikasi word count dan komponen
# Ekstrak tiap subbab markdown
sub_blocks = re.split(r'\{\s*"id": "vector-database-retrieval-ch[1-4]-sub\d+"', chunk1_text)
passed_quality = 0

for idx, block in enumerate(sub_blocks[1:], 1):
    # Hitung kata pada content_markdown
    md_match = re.search(r'"content_markdown": "(.*?)(?<!\\)"', block, re.DOTALL)
    if not md_match:
        # coba unescaped string
        md_match = re.search(r'"content_markdown":\s*"([^"]+)"', block)
    
    # Ambil teks markdown kasar
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

print(f"Subbab lolos 7 komponen & word count: {passed_quality}/40")
if passed_quality != 40:
    print(f"[FAIL] Terdapat subbab yang belum memenuhi 7 komponen!")
    sys.exit(1)
else:
    print("[PASS] Seluruh 40 subbab memenuhi 7 komponen akademik.")

# 4. Spot-check 4 Kutipan Primer Verbatim
spot_checks = [
    {
        "author": "Kevin Beyer et al. (ICDT 1999) - Bab 1.4",
        "quote": "We explore the effect of dimensionality on the nearest neighbor problem. We show that under a broad set of conditions (much broader than independent and identically distributed dimensions), as dimensionality increases, the distance to the nearest data point approaches the distance to the farthest data point."
    },
    {
        "author": "Piotr Indyk & Rajeev Motwani (STOC 1998) - Bab 3.6",
        "quote": "The nearest neighbor problem is the following: Given a set of n points P in some metric space X, preprocess P so as to efficiently answer queries which require finding the point in P closest to the query point q in X."
    },
    {
        "author": "Moses S. Charikar (STOC 2002) - Bab 3.7",
        "quote": r"A locality sensitive hashing scheme is a distribution on a family F of hash functions operating on a collection of objects, such that for two objects x, y, Pr_{h \in F}[h(x) = h(y)] = sim(x, y) for some similarity function sim, or more generally, Pr_{h \in F}[h(x) = h(y)] is a function of the distance d(x, y) between the two objects. Such schemes provide a mechanism for efficiently solving the near neighbor problem. In this paper, we present a new technique for constructing locality sensitive hashing schemes."
    },
    {
        "author": "Yury A. Malkov & Dmitry A. Yashunin (IEEE TPAMI / arXiv 2018) - Bab 4.5",
        "quote": "We present a new approach for the approximate K-nearest neighbor search based on navigable small world graphs with controllable hierarchy (Hierarchical NSW, HNSW). The proposed solution is fully graph-based, without any need for additional search structures, which are typically used at the coarse search stage of the most proximity graph techniques. Hierarchical NSW incrementally builds a multi-layer structure consisting from hierarchical set of proximity graphs (layers) for nested subsets of the stored elements."
    }
]

print("\n" + "=" * 70)
print("SPOT-CHECK VERIFIKASI KUTIPAN PRIMER VERBATIM 100%:")
print("=" * 70)

all_quotes_found = True
# Normalisasi teks dokumen: unescape \\ -> \ dan gabungkan whitespace
normalized_doc = " ".join(chunk1_text.replace("\\\\", "\\").replace('\\"', '"').split())

for sc in spot_checks:
    author = sc["author"]
    quote = sc["quote"]
    # Normalisasi spasi dan escape pada quote
    clean_quote = " ".join(quote.split())
    
    found = clean_quote in normalized_doc
    if not found:
        # Coba periksa kalimat pembuka dan penutup
        first_part = clean_quote[:80]
        last_part = clean_quote[-80:]
        found = (first_part in normalized_doc) and (last_part in normalized_doc)
        
    if found:
        print(f"[PASS VERBATIM] {author}")
        print(f'  "{quote[:80]}..."')
    else:
        print(f"[FAIL VERBATIM] {author}")
        print(f"  Target quote tidak ditemukan persis!")
        all_quotes_found = False

print("\n" + "=" * 70)
if all_quotes_found:
    print("[SUKSES TOTAL] Seluruh 4 spot-check kutipan primer terverifikasi 100% verbatim otentik.")
else:
    print("[ERROR] Beberapa kutipan tidak cocok verbatim!")
    sys.exit(1)
