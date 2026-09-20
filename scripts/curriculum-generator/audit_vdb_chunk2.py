# -*- coding: utf-8 -*-
"""
Auditor Substantif Kualitas untuk Chunk 2 (Bab 5 - 8)
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

# Ekstrak blok Bab 5 sampai Bab 8
ch5_match = re.search(r'["\']?id["\']?\s*:\s*["\']vector-database-retrieval-ch-5["\']', content)
ch9_match = re.search(r'["\']?id["\']?\s*:\s*["\']vector-database-retrieval-ch-9["\']', content)

if not ch5_match or not ch9_match:
    print(f"[ERROR] Marker bab tidak ditemukan! ch5={ch5_match}, ch9={ch9_match}")
    sys.exit(1)

ch5_pos = ch5_match.start()
ch9_pos = ch9_match.start()

chunk2_text = content[ch5_pos:ch9_pos]

# 1. Hitung jumlah subbab
sub_ids = re.findall(r'"id": "(vector-database-retrieval-ch[5-8]-sub\d+)"', chunk2_text)
print("=" * 75)
print("AUDIT SUBSTANTIF CHUNK 2 (BAB 5 - 8): TOPIK 28 VECTOR DATABASE & RETRIEVAL")
print("=" * 75)
print(f"Total subbab terdeteksi di Chunk 2: {len(sub_ids)} (Target: 40 subbab)")

if len(sub_ids) != 40:
    print(f"[FAIL] Jumlah subbab tidak sama dengan 40! Terdeteksi: {len(sub_ids)}")
    sys.exit(1)
else:
    print("[PASS] Jumlah subbab tepat 40/40.")

# 2. Verifikasi status substantive-verified
verified_count = len(re.findall(r'"contentStatus": "substantive-verified"', chunk2_text))
print(f"Subbab dengan status substantive-verified: {verified_count}/40")
if verified_count != 40:
    print(f"[FAIL] Ditemukan subbab yang belum substantive-verified! Count: {verified_count}")
    sys.exit(1)
else:
    print("[PASS] Seluruh 40 subbab berstatus substantive-verified 100%.")

# 3. Verifikasi word count dan 7 komponen
sub_blocks = re.split(r'\{\s*"id": "vector-database-retrieval-ch[5-8]-sub\d+"', chunk2_text)
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

print(f"Subbab lolos 7 komponen & word count: {passed_quality}/40")
if passed_quality != 40:
    print(f"[FAIL] Terdapat subbab yang belum memenuhi 7 komponen!")
    sys.exit(1)
else:
    print("[PASS] Seluruh 40 subbab memenuhi 7 komponen akademik.")

# 4. Spot-check 4 Kutipan Primer Verbatim
spot_checks = [
    {
        "author": "Hervé Jégou, Matthijs Douze, Cordelia Schmid (IEEE TPAMI 2011) - Bab 5.5",
        "quote": "This paper introduces a product quantization-based approach for approximate nearest neighbor search. The idea is to decompose the space into a Cartesian product of low-dimensional subspaces and to quantize each subspace separately. A vector is represented by a short code composed of its subspace quantization indices."
    },
    {
        "author": "Jeff Johnson, Matthijs Douze, Hervé Jégou (IEEE TBD 2019 / arXiv:1702.08734) - Bab 6.5",
        "quote": "Similarity search finds application in specialized database systems handling complex data such as images or videos, which are typically represented by high-dimensional features and require specific indexing structures. This paper tackles the problem of better utilizing GPUs for this task. While GPUs excel at data-parallel tasks, prior approaches are bottlenecked by algorithms that expose less parallelism, such as k-min selection, or make poor use of the memory hierarchy. We propose a design for k-selection that operates at up to 55% of theoretical peak performance, enabling a nearest neighbor implementation that is 8.5x faster than prior GPU state of the art."
    },
    {
        "author": "Gordon V. Cormack, Charles L. A. Clarke, Stefan Büttcher (ACM SIGIR 2009) - Bab 7.6",
        "quote": "Reciprocal Rank Fusion (RRF), a simple method for combining the document rankings from multiple IR systems, consistently yields better results than any individual system, and better results than the standard method Condorcet Fuse. This result is demonstrated by using RRF to combine the results of several TREC experiments, and to build a meta-learner that ranks the LETOR 3 dataset better than any previously reported method."
    },
    {
        "author": "Patrick Lewis et al. (NeurIPS 2020 / arXiv:2005.11401) - Bab 8.1",
        "quote": "Large pre-trained language models have been shown to store factual knowledge in their parameters, and achieve state-of-the-art results when fine-tuned on downstream NLP tasks. However, their ability to access and precisely manipulate knowledge is still limited, and hence on knowledge-intensive tasks, their performance lags behind task-specific architectures."
    }
]

print("\n" + "=" * 75)
print("VERIFIKASI 4 SPOT-CHECK KUTIPAN PRIMER VERBATIM CHUNK 2")
print("=" * 75)

all_quotes_passed = True
for sc in spot_checks:
    author = sc["author"]
    expected_quote = sc["quote"]
    
    # Periksa keberadaan quote dalam teks file
    if expected_quote in content:
        print(f"[PASS] {author}")
        print(f"       Kutipan: \"{expected_quote[:80]}...\" [VERBATIM 100%]\n")
    else:
        print(f"[FAIL] {author}")
        print(f"       TIDAK DITEMUKAN VERBATIM DALAM FILE!")
        all_quotes_passed = False

if not all_quotes_passed:
    print("[ERROR] Satu atau lebih kutipan primer gagal diverifikasi verbatim!")
    sys.exit(1)
else:
    print("[SUKSES] Seluruh 4 spot-check kutipan primer terverifikasi 100% verbatim otentik.")

print("\n" + "=" * 75)
print("KESIMPULAN: CHUNK 2 (BAB 5-8, 40 SUBBAB) TOPIK 28 MEMENUHI SELURUH STANDAR BAKU!")
print("=" * 75)
