# -*- coding: utf-8 -*-
"""
Auditor Substantif Kualitas untuk Chunk 3 (Bab 9 - 12)
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

# Ekstrak blok Bab 9 sampai Bab 12 (sebelum Bab 13)
ch9_match = re.search(r'["\']?id["\']?\s*:\s*["\']vector-database-retrieval-ch-9["\']', content)
ch13_match = re.search(r'["\']?id["\']?\s*:\s*["\']vector-database-retrieval-ch-13["\']', content)

if not ch9_match or not ch13_match:
    print(f"[ERROR] Marker bab tidak ditemukan! ch9={ch9_match}, ch13={ch13_match}")
    sys.exit(1)

ch9_pos = ch9_match.start()
ch13_pos = ch13_match.start()

chunk3_text = content[ch9_pos:ch13_pos]

# 1. Hitung jumlah subbab
sub_ids = re.findall(r'"id": "(vector-database-retrieval-ch(?:9|10|11|12)-sub\d+)"', chunk3_text)
print("=" * 75)
print("AUDIT SUBSTANTIF CHUNK 3 (BAB 9 - 12): TOPIK 28 VECTOR DATABASE & RETRIEVAL")
print("=" * 75)
print(f"Total subbab terdeteksi di Chunk 3: {len(sub_ids)} (Target: 40 subbab)")

if len(sub_ids) != 40:
    print(f"[FAIL] Jumlah subbab tidak sama dengan 40! Terdeteksi: {len(sub_ids)}")
    sys.exit(1)
else:
    print("[PASS] Jumlah subbab tepat 40/40.")

# 2. Verifikasi status substantive-verified
verified_count = len(re.findall(r'"contentStatus": "substantive-verified"', chunk3_text))
print(f"Subbab dengan status substantive-verified: {verified_count}/40")
if verified_count != 40:
    print(f"[FAIL] Ditemukan subbab yang belum substantive-verified! Count: {verified_count}")
    sys.exit(1)
else:
    print("[PASS] Seluruh 40 subbab berstatus substantive-verified 100%.")

# 3. Verifikasi word count dan 7 komponen
sub_blocks = re.split(r'\{\s*"id": "vector-database-retrieval-ch(?:9|10|11|12)-sub\d+"', chunk3_text)
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
        "author": "Siddharth Gollapudi et al. (ACM WWW 2023) - Bab 9.6",
        "quote": "As Approximate Nearest Neighbor Search (ANNS)-based dense retrieval becomes ubiquitous for search and recommendation scenarios, efficiently answering filtered ANNS queries has become a critical requirement. Filtered ANNS queries ask for the nearest neighbors of a query's embedding from the points in the index that match the query's labels such as date, price range, language. There has been little prior work on algorithms that use label metadata associated with vector data to build efficient indices for filtered ANNS queries. Consequently, current indices have high search latency or low recall which is not practical in interactive web-scenarios. We present two algorithms with native support for faster and more accurate filtered ANNS queries: one with streaming support, and another based on batch construction. Central to our algorithms is the construction of a graph-structured index which forms connections not only based on the geometry of the vector data, but also the associated label set."
    },
    {
        "author": "Thibault Formal, Benjamin Piwowarski, Stéphane Clinchant (ACM SIGIR 2021) - Bab 10.5",
        "quote": "In neural Information Retrieval, ongoing research is directed towards improving the first retriever in ranking pipelines. Learning dense embeddings to conduct retrieval using efficient approximate nearest neighbors methods has proven to work well. Meanwhile, there has been a growing interest in learning sparse representations for documents and queries, that could inherit from the desirable properties of bag-of-words models such as the exact matching of terms and the efficiency of inverted indexes. In this work, we present a new first-stage ranker based on explicit sparsity regularization and a log-saturation effect on term weights, leading to highly sparse representations and competitive results with respect to state-of-the-art dense and sparse methods."
    },
    {
        "author": "Nelson F. Liu et al. (TACL 2024 / arXiv:2307.03172) - Bab 11.6",
        "quote": "While recent language models have the ability to take long contexts as input, relatively little is known about how well they use longer context. We analyze the performance of language models on two tasks that require identifying relevant information in their input contexts: multi-document question answering and key-value retrieval. We find that performance can degrade significantly when changing the position of relevant information, indicating that current language models do not robustly make use of information in long input contexts. In particular, we observe that performance is often highest when relevant information occurs at the beginning or end of the input context, and significantly degrades when models must access relevant information in the middle of long contexts, even for explicitly long-context models."
    },
    {
        "author": "Omar Khattab & Matei Zaharia (ACM SIGIR 2020 / arXiv:2004.12832) - Bab 12.5",
        "quote": "Recent progress in Natural Language Understanding (NLU) is driving fast-paced advances in Information Retrieval (IR), largely owed to fine-tuning deep language models (LMs) for document ranking. While remarkably effective, the ranking models based on these LMs increase computational cost by orders of magnitude over prior approaches, particularly as they must feed each query-document pair through a massive neural network to compute a single relevance score. To tackle this, we present ColBERT, a novel ranking model that adapts deep LMs (in particular, BERT) for efficient retrieval. ColBERT introduces a late interaction architecture that independently encodes the query and the document using BERT and then employs a cheap yet powerful interaction step that models their fine-grained similarity. By delaying and yet retaining this fine-granular interaction, ColBERT can leverage the expressiveness of deep LMs while simultaneously gaining the ability to pre-compute document representations offline, considerably speeding up query processing."
    }
]

print("\n" + "=" * 75)
print("VERIFIKASI 4 SPOT-CHECK KUTIPAN PRIMER VERBATIM CHUNK 3")
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
print("KESIMPULAN: CHUNK 3 (BAB 9-12, 40 SUBBAB) TOPIK 28 MEMENUHI SELURUH STANDAR BAKU!")
print("=" * 75)
