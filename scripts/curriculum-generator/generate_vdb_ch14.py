import json
import os
import sys
import numpy as np

output_file = os.path.join(os.path.dirname(__file__), "vdb_ch14_data.json")

subchapters = [
    # 28.14.1
    {
        "id": "28.14.1",
        "title": "Metrik Akurasi Retrieval: Recall@k, Precision@k, dan Exact Nearest Neighbor Baseline",
        "learningObjectives": [
            "Memahami metodologi evaluasi akurasi retrieval pada Approximate Nearest Neighbor (ANN) menggunakan perbandingan exact $k$-NN ground truth.",
            "Menganalisis perbedaan matematis antara $\\text{Recall}@k$ dan $\\text{Precision}@k$ dalam skenario pencarian vektor.",
            "Mengimplementasikan evaluasi komparasi brute-force exact $k$-NN vs approximate retrieval untuk menghitung rasio tumpang tindih secara deterministik."
        ],
        "prerequisites": [
            "Prinsip pencarian Exact $k$-NN (Brute-Force) vs Approximate Nearest Neighbor (ANN).",
            "Metrik dasar evaluasi Information Retrieval (Confusion Matrix, Recall, Precision)."
        ],
        "commonPitfalls": [
            "Menghitung Recall@k ANN terhadap dataset tanpa ground truth exact distance, melainkan mengandalkan perkiraan subyektif.",
            "Menyamakan Recall@k dengan Precision@k ketika jumlah dokumen relevan $R$ berbeda dari nilai cutoff $k$."
        ],
        "academicReferences": [
            "Manning, C. D., Raghavan, P., & Schütze, H. (2008). Introduction to Information Retrieval. Cambridge University Press.",
            "Aumüller, M., Bernhardsson, E., & Faithfull, A. (2020). ANN-Benchmarks: A benchmarking tool for approximate nearest neighbor algorithms. Information Systems, 87, 101374."
        ],
        "caseStudy": "Sebuah sistem pencarian e-commerce menguji konfigurasi HNSW dengan parameter `ef_search=16` vs `ef_search=64`. Tim mengukur Recall@10 terhadap 10,000 kueri uji menggunakan exact brute-force Euclidean distance sebagai baseline ground truth. Konfigurasi `ef_search=16` hanya menghasilkan Recall@10 sebesar 0.72, sementara `ef_search=64` mencapai Recall@10 sebesar 0.96 dengan penambahan latensi hanya 1.2 ms.",
        "content": {
            "theory": (
                "Evaluasi performa akurasi pada basis data vektor bertumpu pada perbandingan antara himpunan tetangga aproksimasi yang dihasilkan oleh algoritma ANN (seperti HNSW atau IVF-PQ) melawan himpunan tetangga sejati yang diperoleh melalui pencarian eksak (brute-force scan). "
                "Misalkan $\\mathcal{G}_k(q)$ menyatakan himpunan $k$ tetangga terdekat sejati (*ground truth nearest neighbors*) untuk kueri $q$, dan $\\mathcal{A}_k(q)$ menyatakan himpunan $k$ tetangga yang ditemukan oleh algoritma ANN. "
                "**Recall@k** (atau *Intersection Ratio*) didefinisikan sebagai proporsi tetangga sejati yang berhasil ditangkap oleh algoritma aproksimasi: "
                "$$\\text{Recall}@k(q) = \\frac{|\\mathcal{G}_k(q) \\cap \\mathcal{A}_k(q)|}{|\\mathcal{G}_k(q)|} = \\frac{|\\mathcal{G}_k(q) \\cap \\mathcal{A}_k(q)|}{k}$$ "
                "Sementara itu, jika terdapat himpunan dokumen relevan berlabel $\\mathcal{R}(q)$ dengan ukuran sembarang, **Precision@k** mengukur proporsi hasil retrieval yang benar-benar relevan: "
                "$$\\text{Precision}@k(q) = \\frac{|\\mathcal{R}(q) \\cap \\mathcal{A}_k(q)|}{k}$$ "
                "Dalam benchmarking ANN standar, karena $|\\mathcal{A}_k(q)| = |\\mathcal{G}_k(q)| = k$, nilai Recall@k bernilai ekuivalen dengan Precision@k terhadap ground-truth k-NN. Nilai $\\text{Recall}@k \\in [0, 1]$ menjadi standar baku untuk menilai degradasi kualitas aproksimasi vektor."
            ),
            "realWorldApplication": (
                "Tim machine learning di Pinterest dan Twitter menggunakan Recall@k rutin untuk memvalidasi bahwa teknik kuantisasi vektor (seperti FP16 ke INT8 atau SQ8) tidak mendegradasi kualitas rekomendasi di atas ambang batas 0.95."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Evaluasi Recall@k: Exact Brute-Force vs Approximate Nearest Neighbor\n"
                "def evaluate_retrieval_recall(exact_ground_truth, ann_candidates, k=5):\n"
                "    \"\"\"\n"
                "    exact_ground_truth: list of IDs terurut berukuran k\n"
                "    ann_candidates: list of IDs terurut berukuran k\n"
                "    \"\"\"\n"
                "    gt_set = set(exact_ground_truth[:k])\n"
                "    ann_set = set(ann_candidates[:k])\n"
                "    hits = len(gt_set.intersection(ann_set))\n"
                "    recall = hits / float(k)\n"
                "    return recall, hits\n"
                "\n"
                "np.random.seed(42)\n"
                "dim = 16\n"
                "n_docs = 1_000\n"
                "database = np.random.randn(n_docs, dim)\n"
                "database /= np.linalg.norm(database, axis=1, keepdims=True)\n"
                "\n"
                "query = np.random.randn(dim)\n"
                "query /= np.linalg.norm(query)\n"
                "\n"
                "# 1. Exact Ground Truth (Brute-Force Dot Product)\n"
                "exact_scores = np.dot(database, query)\n"
                "exact_top10 = list(np.argsort(-exact_scores)[:10])\n"
                "\n"
                "# 2. Simulasi ANN (Aproksimasi Cepat dengan Sedikit Noise)\n"
                "# Simulasikan algoritma graf yang melewatkan 2 tetangga terdekat teratas\n"
                "ann_noise = np.random.randn(n_docs) * 0.05\n"
                "ann_scores = exact_scores + ann_noise\n"
                "ann_top10 = list(np.argsort(-ann_scores)[:10])\n"
                "\n"
                "for k_val in [1, 3, 5, 10]:\n"
                "    rec, hits = evaluate_retrieval_recall(exact_top10, ann_top10, k=k_val)\n"
                "    print(f\"Evaluasi Metrik Akurasi @ k={k_val:2d}:\")\n"
                "    print(f\"  Overlap Hits : {hits}/{k_val}\")\n"
                "    print(f\"  Recall@{k_val:<2d}    : {rec:.4f} ({rec*100:.1f}%)\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.14.2
    {
        "id": "28.14.2",
        "title": "Metrik Perangkingan Berbobot: Mean Reciprocal Rank (MRR@k) dan NDCG@k",
        "learningObjectives": [
            "Memahami metrik evaluasi pemeringkatan berbobot posisi (*position-aware ranking metrics*) pada retrieval informasi: MRR@k dan NDCG@k.",
            "Menganalisis fungsi diskon logaritmik (*logarithmic discounting*) pada Discounted Cumulative Gain (DCG).",
            "Mengimplementasikan kalkulator deterministik untuk MRR@k dan Normalized Discounted Cumulative Gain (NDCG@k) multi-level relevance."
        ],
        "prerequisites": [
            "28.14.1 (Recall@k dan Precision@k).",
            "Konsep Information Retrieval: Cumulative Gain dan Posisi Dokumen."
        ],
        "commonPitfalls": [
            "Menggunakan basis logaritma yang tidak konsisten pada NDCG (misalnya log natural vs $\\log_2$) saat membandingkan benchmark antar paper.",
            "Menganggap MRR cocok untuk kueri dengan banyak dokumen relevan (MRR hanya memperhitungkan posisi dokumen relevan *pertama*)."
        ],
        "academicReferences": [
            "Järvelin, K., & Kekäläinen, J. (2002). Cumulated gain-based evaluation of retrieval techniques. ACM Transactions on Information Systems (TOIS), 20(4), 422-446.",
            "Craswell, N. (2009). Mean Reciprocal Rank. In Encyclopedia of Database Systems, 1703-1703."
        ],
        "caseStudy": "Mesin pencari dokumen legal membandingkan dua model reranker. Model A menempatkan dokumen kunci pada posisi #1, #8, #9. Model B menempatkan dokumen kunci pada posisi #3, #4, #5. Meskipun Precision@10 kedua model identik (3/10 = 0.3), Model A menghasilkan MRR@10 sempurna (1.0 vs 0.33) dan NDCG@10 jauh lebih tinggi (0.84 vs 0.61), merefleksikan kepuasan pengguna yang menemukan jawaban di urutan teratas.",
        "content": {
            "theory": (
                "Metrik Recall@k memperlakukan seluruh posisi dalam daftar peringkat $1 \\dots k$ secara setara (*unweighted binary metric*). "
                "Dalam sistem pencarian praktis, dokumen relevan yang muncul di peringkat #1 jauh lebih berharga daripada dokumen di peringkat #10. "
                "Untuk mengukur kualitas urutan, digunakan dua metrik evaluasi terbobot: "
                "1. **Mean Reciprocal Rank (MRR@k)**: "
                "Mengukur seberapa cepat sistem menyajikan dokumen relevan pertama. Untuk kumpulan kueri $\\mathcal{Q}$: "
                "$$\\text{MRR}@k = \\frac{1}{|\\mathcal{Q}|} \\sum_{i=1}^{|\\mathcal{Q}|} \\frac{1}{\\text{rank}_i}$$ "
                "Di mana $\\text{rank}_i$ adalah posisi peringkat dokumen relevan pertama pada kueri $i$ (jika tidak ada dokumen relevan dalam top-$k$, maka nilainya $0$). "
                "2. **Normalized Discounted Cumulative Gain (NDCG@k)**: "
                "Mendukung relevansi bertingkat (*multi-grade relevance*, misalnya skor $0$ sampai $3$) dan menerapkan penalti logaritmik terhadap dokumen relevan yang terlempar ke peringkat bawah: "
                "$$\\text{DCG}@k = \\sum_{i=1}^k \\frac{2^{\\text{rel}_i} - 1}{\\log_2(i + 1)}$$ "
                "$$\\text{NDCG}@k = \\frac{\\text{DCG}@k}{\\text{IDCG}@k}$$ "
                "Di mana $\\text{IDCG}@k$ (*Ideal DCG*) adalah skor DCG dari susunan dokumen yang diurutkan secara sempurna menurun berdasarkan nilai relevansinya. Nilai $\\text{NDCG}@k \\in [0, 1]$ bernilai 1.0 jika dan hanya jika susunan retrieval optimal sempurna."
            ),
            "realWorldApplication": (
                "Benchmark BEIR dan leaderboard MTEB menggunakan NDCG@10 sebagai metrik primer resmi untuk menilai akurasi model embedding teks (seperti BGE, E5, dan Cohere Embed) pada tugas retrieval heterogen."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Implementasi Komputasi MRR@k dan NDCG@k Deterministik\n"
                "def compute_mrr_at_k(relevance_labels, k=10):\n"
                "    \"\"\"relevance_labels: list binary relevance [0/1] terurut berdasarkan ranking\"\"\"\n"
                "    for idx, rel in enumerate(relevance_labels[:k]):\n"
                "        if rel > 0:\n"
                "            return 1.0 / (idx + 1)\n"
                "    return 0.0\n"
                "\n"
                "def compute_dcg_at_k(relevance_grades, k=10):\n"
                "    \"\"\"relevance_grades: list graded relevance integer [0, 1, 2, 3]\"\"\"\n"
                "    dcg = 0.0\n"
                "    for i, rel in enumerate(relevance_grades[:k]):\n"
                "        gain = (2.0 ** rel) - 1.0\n"
                "        discount = np.log2(i + 2)  # log2(rank + 1)\n"
                "        dcg += gain / discount\n"
                "    return dcg\n"
                "\n"
                "def compute_ndcg_at_k(relevance_grades, k=10):\n"
                "    actual_dcg = compute_dcg_at_k(relevance_grades, k)\n"
                "    ideal_grades = sorted(relevance_grades, reverse=True)\n"
                "    ideal_dcg = compute_dcg_at_k(ideal_grades, k)\n"
                "    if ideal_dcg == 0.0:\n"
                "        return 0.0\n"
                "    return actual_dcg / ideal_dcg\n"
                "\n"
                "# Contoh Uji: Dua Sistem Ranking dengan Tingkat Relevansi Bertingkat (0 = Tak Relevan, 3 = Sempurna)\n"
                "# Sistem A: Menemukan dokumen sempurna di ranking #1\n"
                "system_A = [3, 0, 1, 2, 0, 0, 0, 0, 0, 0]\n"
                "# Sistem B: Menemukan dokumen sempurna di ranking #4\n"
                "system_B = [1, 2, 0, 3, 0, 0, 0, 0, 0, 0]\n"
                "\n"
                "print(\"Evaluasi Ranking Metrik (MRR@10 & NDCG@10):\")\n"
                "print(f\"  [Sistem A] MRR@10 : {compute_mrr_at_k(system_A, 10):.4f} | NDCG@10: {compute_ndcg_at_k(system_A, 10):.4f}\")\n"
                "print(f\"  [Sistem B] MRR@10 : {compute_mrr_at_k(system_B, 10):.4f} | NDCG@10: {compute_ndcg_at_k(system_B, 10):.4f}\")\n"
                "print(f\"  Selisih Kualitas Ranking NDCG: {(compute_ndcg_at_k(system_A, 10) - compute_ndcg_at_k(system_B, 10)):.4f} (Sistem A Unggul Signifikan!)\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.14.3
    {
        "id": "28.14.3",
        "title": "Trade-off Segitiga Emas: Latensi (p95/p99), Throughput (QPS), dan Akurasi (Recall)",
        "learningObjectives": [
            "Menganalisis kurva Pareto-Optimal segitiga trade-off pada sistem ANN: Latensi vs Throughput vs Recall.",
            "Memahami parameter penyetelan dinamis graf (ef_search pada HNSW, nprobe pada IVF) dalam menggeser posisi pada kurva efisiensi.",
            "Mengimplementasikan simulasi profiling pencarian vektor untuk memetakan kurva Pareto Trade-Off secara empiris."
        ],
        "prerequisites": [
            "28.14.1 (Recall@k) dan 28.14.2 (MRR dan NDCG).",
            "Metrik Latensi Persentil (p50, p95, p99) dan Throughput Konkurensi."
        ],
        "commonPitfalls": [
            "Hanya mengukur rerata latensi (mean latency) alih-alih tail latency (p95/p99), menyembunyikan lonjakan latensi akibat garbage collection atau lock contention.",
            "Mengoptimalkan parameter untuk mencapai Recall 0.999 yang mengakibatkan degradasi throughput QPS hingga 80%."
        ],
        "academicReferences": [
            "Aumüller, M., Bernhardsson, E., & Faithfull, A. (2020). ANN-Benchmarks: A benchmarking tool for approximate nearest neighbor algorithms. Information Systems, 87, 101374.",
            "Johnson, J., Douze, M., & Jégou, H. (2021). Billion-scale similarity search with GPUs. IEEE Transactions on Big Data, 7(3), 535-547."
        ],
        "caseStudy": "Sebuah aplikasi asisten suara mengharuskan latensi p99 di bawah 10 ms untuk mempertahankan alur percakapan alami. Tim engineering menguji berbagai nilai `ef_search` pada klaster HNSW 10 juta vektor. Pada `ef_search=128`, Recall mencapai 0.98 namun p99 melonjak ke 28 ms. Dengan menganalisis kurva Pareto, tim memilih `ef_search=48` yang memberikan Recall 0.93 dengan p99 stabil di 8.2 ms dan throughput 2,400 QPS.",
        "content": {
            "theory": (
                "Dalam desain sistem basis data vektor, tidak ada satu algoritma atau konfigurasi pun yang dapat memaksimalkan seluruh dimensi performa secara simultan. "
                "Sistem dibatasi oleh **Segitiga Trade-off Emas (The Iron Triangle of Vector Search)**: "
                "1. **Akurasi (Recall@k)**: Tingkat ketepatan hasil pencarian mendekati exact nearest neighbor. "
                "2. **Latensi Ekor (Tail Latency - p95/p99)**: Waktu respons kueri pada persentil ke-95 dan ke-99 dalam milidetik. "
                "3. **Throughput (QPS - Queries Per Second)**: Volume kueri simultan yang dapat diselesaikan oleh klaster per detik. "
                "Hubungan matematis ini dipetakan melalui **Kurva Batas Pareto (Pareto Efficiency Frontier)**: "
                "$$\\mathcal{P} = \\left\\{ (R, L, Q) \\mid \\nexists (R', L', Q') \\text{ s.t. } R' \\ge R, L' \\le L, Q' \\ge Q \\right\\}$$ "
                "Peningkatan parameter eksplorasi graf seperti $ef_{\\text{search}}$ pada HNSW memperluas antrean prioritas kandidat secara monotonik: "
                "$$L(ef) \\propto \\mathcal{O}(ef \\cdot \\log N), \\quad R(ef) = 1 - c_1 e^{-c_2 \\cdot ef}$$ "
                "Ketika $ef$ ditingkatkan, $R(ef)$ mendekati asimtot $1.0$, namun menghasilkan pertumbuhan linier pada latensi dan penurunan dramatis pada throughput konkurensi."
            ),
            "realWorldApplication": (
                "Insinyur di Spotify dan LinkedIn menggunakan kurva Pareto untuk memilih hyperparameter HNSW terpisah pada jam sibuk (mengutamakan QPS tinggi) vs jam lengang (mengutamakan akurasi Recall maksimal)."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Simulasi Profiling Kurva Pareto Trade-Off: ef_search vs Recall vs Latency\n"
                "class SimulatedHNSWProfiler:\n"
                "    def __init__(self, n_vectors=50_000, dim=16):\n"
                "        np.random.seed(42)\n"
                "        self.db = np.random.randn(n_vectors, dim)\n"
                "        self.db /= np.linalg.norm(self.db, axis=1, keepdims=True)\n"
                "        \n"
                "    def profile_ef_search(self, query, exact_top5, ef_values=[8, 16, 32, 64, 128]):\n"
                "        results = []\n"
                "        gt_set = set(exact_top5)\n"
                "        \n"
                "        for ef in ef_values:\n"
                "            # Simulasi latensi komputasi proporsional terhadap ef (dalam ms)\n"
                "            simulated_latency_ms = 0.5 + (ef * 0.08) + (np.random.rand() * 0.1)\n"
                "            # Simulasi recall aproksimasi asimtotik: 1 - exp(-0.06 * ef)\n"
                "            simulated_recall = min(0.995, 1.0 - np.exp(-0.055 * ef) + (np.random.rand() * 0.01))\n"
                "            qps = 1000.0 / simulated_latency_ms\n"
                "            \n"
                "            results.append({\n"
                "                \"ef_search\": ef,\n"
                "                \"recall\": simulated_recall,\n"
                "                \"latency_ms\": simulated_latency_ms,\n"
                "                \"qps\": qps\n"
                "            })\n"
                "        return results\n"
                "\n"
                "profiler = SimulatedHNSWProfiler()\n"
                "q = np.random.randn(16)\n"
                "q /= np.linalg.norm(q)\n"
                "exact_top5 = list(range(5))\n"
                "\n"
                "res = profiler.profile_ef_search(q, exact_top5)\n"
                "print(f\"Kurva Pareto Trade-Off HNSW (Recall vs Latency vs Throughput):\")\n"
                "print(f\"  {'ef_search':<10} | {'Recall@5':<10} | {'Latensi (ms)':<14} | {'Throughput (QPS)':<16}\")\n"
                "print(\"  \" + \"-\" * 58)\n"
                "for r in res:\n"
                "    print(f\"  {r['ef_search']:<10d} | {r['recall']:<10.4f} | {r['latency_ms']:<14.2f} | {r['qps']:<16.1f}\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.14.4
    {
        "id": "28.14.4",
        "title": "Index Build Time, Memory Footprint per Million Vectors, dan Update Cost",
        "learningObjectives": [
            "Memahami metrik biaya operasional vektor: durasi konstruksi indeks (*Index Build Time*), konsumsi memori per satu juta vektor, dan biaya latensi mutasi (*Update Cost*).",
            "Menganalisis kompleksitas asimtotik pembangunan indeks graf $\\mathcal{O}(N \\log N)$ vs inverted index $\\mathcal{O}(N \\cdot K_{\\text{iter}})$.",
            "Mengimplementasikan model estimasi komputasi memori RAM dan durasi build time untuk berbagai arsitektur indeks (Flat, IVF-Flat, IVF-PQ, HNSW)."
        ],
        "prerequisites": [
            "28.14.3 (Trade-off Segitiga Emas).",
            "Struktur memori C-arrays, pointer overhead, dan kuantisasi kompresi data."
        ],
        "commonPitfalls": [
            "Mengabaikan lonjakan memori sementara (*peak memory spike*) selama proses pelatihan indeks IVF-PQ atau pembangunan graf HNSW (bisa mencapai $2\\times$ memori akhir).",
            "Mengabaikan biaya pembongkaran tautan graf saat operasi penghapusan dan pembaruan vektor (*graph healing overhead*)."
        ],
        "academicReferences": [
            "Johnson, J., Douze, M., & Jégou, H. (2021). Billion-scale similarity search with GPUs. IEEE Transactions on Big Data, 7(3), 535-547.",
            "Malkov, Y. A., & Yashunin, D. A. (2018). Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs. IEEE TPAMI."
        ],
        "caseStudy": "Sebuah startup fintech mengindeks 10 juta vektor transaksi berdimensi 1536. Menggunakan HNSW mentah membutuhkan RAM 75 GB dengan waktu kompilasi indeks 4.5 jam. Ketika dievaluasi ulang untuk efisiensi biaya infrastruktur, mereka bermigrasi ke IVF-PQ ($M=64$, 8-bit): konsumsi RAM menyusut menjadi 2.8 GB (penghematan 96%) dan waktu build berkurang menjadi 22 menit.",
        "content": {
            "theory": (
                "Selain metrik performa waktu kueri, kelayakan ekonomis basis data vektor di tingkat produksi ditentukan oleh tiga metrik biaya operasional: "
                "1. **Index Build Time**: Durasi waktu yang dibutuhkan untuk membangun struktur indeks dari dataset mentah berukuran $N$. "
                "Untuk graf HNSW dengan konstruksi sekuensial, kompleksitas adalah: "
                "$$\\mathcal{T}_{\\text{build, HNSW}} = \\mathcal{O}(N \\cdot M_{\\text{links}} \\cdot ef_{\\text{construction}} \\cdot d)$$ "
                "Sedangkan untuk IVF, waktu pembangunan didominasi oleh klasterisasi $k$-Means: "
                "$$\\mathcal{T}_{\\text{build, IVF}} = \\mathcal{O}(N \\cdot K_{\\text{centroids}} \\cdot d \\cdot I_{\\text{iterations}})$$ "
                "2. **Memory Footprint per Million Vectors**: Total konsumsi DRAM per $10^6$ vektor. "
                "Untuk vektor float32 ($4d$ byte), HNSW menambahkan overhead pointer graf sebesar $M_{\\text{links}} \\cdot 8\\text{ byte}$ per simpul. "
                "Kuantisasi produk (Product Quantization / PQ) mengompresi setiap sub-vektor menjadi kode $1\\text{ byte}$, memangkas kebutuhan memori hingga: "
                "$$\\text{Mem}_{\\text{PQ}} = N \\cdot M_{\\text{sub}} \\text{ bytes} + \\text{Codebook Overhead}$$ "
                "3. **Update Cost**: Latensi penulisan dan pembaruan vektor aktif. Pada HNSW, penyisipan membutuhkan traversal graf tingkat atas ke bawah dan penataan ulang tautan tetangga (*edge pruning*), sedangkan pada Flat/IVF hanya memerlukan penambahan buffer list."
            ),
            "realWorldApplication": (
                "Kalkulator sizing memori resmi dari Pinecone, Qdrant, dan Milvus menggunakan formula matematis footprint ini untuk merekomendasikan konfigurasi node klaster kepada pengguna korporat."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Model Matematis Estimasi Kebutuhan RAM & Waktu Build Indeks (per 1 Juta Vektor)\n"
                "def estimate_index_metrics(n_vectors=1_000_000, dim=768):\n"
                "    bytes_raw = n_vectors * dim * 4\n"
                "    gb_raw = bytes_raw / (1024 ** 3)\n"
                "    \n"
                "    # 1. Flat Index (Brute-Force, Zero build time)\n"
                "    flat_ram_gb = gb_raw\n"
                "    flat_build_min = 0.0\n"
                "    \n"
                "    # 2. HNSW (M=32, ef_construction=128)\n"
                "    hnsw_graph_bytes = n_vectors * 32 * 8  # 8 bytes per neighbor pointer (uint64)\n"
                "    hnsw_ram_gb = (bytes_raw + hnsw_graph_bytes) / (1024 ** 3)\n"
                "    hnsw_build_min = (n_vectors * 32 * 128 * dim * 1e-9) * 4.5  # konstanta komputasi CPU\n"
                "    \n"
                "    # 3. IVF-PQ (M=64 sub-vectors, 8-bit codebook)\n"
                "    pq_bytes = n_vectors * 64 * 1  # 1 byte per code\n"
                "    ivf_pq_ram_gb = pq_bytes / (1024 ** 3)\n"
                "    ivf_pq_build_min = 3.2  # K-means clustering + quantization overhead\n"
                "    \n"
                "    return {\n"
                "        \"raw_gb\": gb_raw,\n"
                "        \"flat\": {\"ram_gb\": flat_ram_gb, \"build_min\": flat_build_min},\n"
                "        \"hnsw\": {\"ram_gb\": hnsw_ram_gb, \"build_min\": hnsw_build_min},\n"
                "        \"ivf_pq\": {\"ram_gb\": ivf_pq_ram_gb, \"build_min\": ivf_pq_build_min}\n"
                "    }\n"
                "\n"
                "m = estimate_index_metrics(n_vectors=1_000_000, dim=768)\n"
                "print(f\"Estimasi Biaya Operasional Indeks Vektor (1,000,000 Vektor, 768-D):\")\n"
                "print(f\"  Kapasitas Data Vektor Mentah : {m['raw_gb']:.2f} GB\")\n"
                "print(f\"  [Flat Index]     RAM: {m['flat']['ram_gb']:5.2f} GB | Waktu Build: {m['flat']['build_min']:4.1f} menit\")\n"
                "print(f\"  [HNSW (M=32)]    RAM: {m['hnsw']['ram_gb']:5.2f} GB | Waktu Build: {m['hnsw']['build_min']:4.1f} menit\")\n"
                "print(f\"  [IVF-PQ (M=64)]  RAM: {m['ivf_pq']['ram_gb']:5.2f} GB | Waktu Build: {m['ivf_pq']['build_min']:4.1f} menit\")\n"
                "print(f\"  Rasio Kompresi Memori IVF-PQ vs HNSW: {m['hnsw']['ram_gb'] / m['ivf_pq']['ram_gb']:.1f}x Lebih Hemat!\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.14.5
    {
        "id": "28.14.5",
        "title": "RAG Triad Metrics: Context Relevance, Groundedness (Faithfulness), dan Answer Relevance",
        "learningObjectives": [
            "Memahami konsep evaluasi sistemik RAG Triad: Context Relevance, Groundedness (Faithfulness), dan Answer Relevance.",
            "Menganalisis titik kegagalan modular pada pipeline RAG: halusinasi model vs kegagalan pengambilan konteks.",
            "Mengimplementasikan simulator evaluasi skor RAG Triad menggunakan kalkulasi overlap leksikal dan semantik representasi."
        ],
        "prerequisites": [
            "Arsitektur RAG Modular (Retrieval, Prompt Conditioning, Generation).",
            "Metrik kesamaan semantik dan evaluasi halusinasi LLM."
        ],
        "commonPitfalls": [
            "Hanya mengevaluasi kesesuaian jawaban akhir (Answer Relevance) tanpa memeriksa Groundedness, mengabaikan halusinasi halus yang tampak logis namun tidak bersumber dari dokumen.",
            "Mengasumsikan skor Context Relevance tinggi menjamin jawaban yang benar, padahal LLM dapat mengabaikan konteks akibat Lost in the Middle."
        ],
        "academicReferences": [
            "Es, S., et al. (2023). RAGAS: Automated evaluation of retrieval augmented generation. arXiv preprint arXiv:2309.15217.",
            "Gao, Y., et al. (2023). Retrieval-augmented generation for large language models: A survey. arXiv preprint arXiv:2312.10997."
        ],
        "caseStudy": "Sebuah rumah sakit menguji asisten klinis AI untuk pedoman dosis obat. Evaluasi awal menunjukkan Answer Relevance 95%. Namun, audit RAG Triad mendeteksi bahwa skor Groundedness hanya 68%: pada sepertiga kasus, model menjawab berdasarkan memori pra-pelatihan yang usang alih-alih mengutip panduan PDF terbaru yang diambil oleh basis data vektor. Mengetatkan grounding prompt menaikkan skor keselamatan ke 99%.",
        "content": {
            "theory": (
                "Evaluasi performa Retrieval-Augmented Generation (RAG) tidak dapat disederhanakan hanya pada metrik retrieval vektor tradisional maupun metrik generasi teks bebas murni (seperti BLEU atau ROUGE). "
                "Framework **RAG Triad** membedah kualitas sistem menjadi tiga pilar matematis independen: "
                "1. **Context Relevance (Relevansi Konteks)**: "
                "Mengukur apakah konteks yang diambil $\\mathcal{C} = \\{c_1, \\dots, c_k\\}$ hanya memuat informasi yang esensial untuk menjawab kueri $q$: "
                "$$\\text{Context Relevance} = \\frac{|\\text{Kalimat Relevan dalam } \\mathcal{C}|}{|\\text{Total Kalimat dalam } \\mathcal{C}|}$$ "
                "2. **Groundedness / Faithfulness (Kebenaran Faktual Kontekstual)**: "
                "Mengukur apakah seluruh klaim faktual dalam respons generasi $a$ dapat divalidasi dan diturunkan langsung dari konteks $\\mathcal{C}$ tanpa unsur halusinasi: "
                "$$\\text{Faithfulness} = \\frac{|\\text{Klaim pada } a \\text{ yang didukung oleh } \\mathcal{C}|}{|\\text{Total Klaim pada } a|}$$ "
                "3. **Answer Relevance (Relevansi Jawaban Terhadap Pertanyaan)**: "
                "Mengukur apakah jawaban akhir $a$ secara langsung menjawab pertanyaan awal $q$ tanpa bertele-tele atau menyimpang: "
                "$$\\text{Answer Relevance} = \\cos(\\mathbf{e}_q, \\mathbf{e}_{\\text{pseudo\\_q}(a)})$$ "
                "Di mana $\\mathbf{e}$ adalah vektor embedding dan $\\text{pseudo\\_q}(a)$ adalah kueri buatan yang diproyeksikan dari jawaban."
            ),
            "realWorldApplication": (
                "Perusahaan AI enterprise menggunakan dashboard RAG Triad untuk memantau performa ribuan asisten pengetahuan internal secara harian guna mencegah liabilitas hukum halusinasi."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Simulasi Algoritma Penilaian RAG Triad Metrics\n"
                "class RAGTriadEvaluator:\n"
                "    def __init__(self):\n"
                "        pass\n"
                "\n"
                "    def evaluate_context_relevance(self, query_tokens, context_sentences):\n"
                "        # Proporsi kalimat dalam konteks yang mengandung kata kunci kueri\n"
                "        relevant_sentences = 0\n"
                "        for sent in context_sentences:\n"
                "            words = set(sent.lower().split())\n"
                "            if any(q in words for q in query_tokens):\n"
                "                relevant_sentences += 1\n"
                "        return relevant_sentences / len(context_sentences) if context_sentences else 0.0\n"
                "\n"
                "    def evaluate_faithfulness(self, answer_claims, context_text):\n"
                "        # Proporsi klaim jawaban yang benar-benar ada di konteks (Groundedness)\n"
                "        supported = 0\n"
                "        for claim in answer_claims:\n"
                "            if claim.lower() in context_text.lower():\n"
                "                supported += 1\n"
                "        return supported / len(answer_claims) if answer_claims else 0.0\n"
                "\n"
                "    def evaluate_answer_relevance(self, query_tokens, answer_tokens):\n"
                "        # Jaccard overlap kueri vs jawaban sebagai proxy relevansi\n"
                "        q_set = set(query_tokens)\n"
                "        a_set = set(answer_tokens)\n"
                "        intersection = len(q_set.intersection(a_set))\n"
                "        return intersection / len(q_set) if q_set else 0.0\n"
                "\n"
                "evaluator = RAGTriadEvaluator()\n"
                "query = [\"dosis\", \"paracetamol\", \"anak\"]\n"
                "context = [\n"
                "    \"Dosis paracetamol anak adalah 10-15 mg per kg berat badan.\",\n"
                "    \"Kemasan obat harus disimpan di tempat kering dan sejuk.\",\n"
                "    \"Pemberian dapat diulang setiap 4-6 jam jika demam.\"\n"
                "]\n"
                "context_full_text = \" \".join(context)\n"
                "\n"
                "# Skenario Respons A: Sangat Ter-grounding\n"
                "claims_A = [\"10-15 mg per kg\", \"setiap 4-6 jam\"]\n"
                "ans_tokens_A = [\"dosis\", \"paracetamol\", \"anak\", \"10-15\", \"mg\"]\n"
                "\n"
                "c_rel = evaluator.evaluate_context_relevance(query, context)\n"
                "faith = evaluator.evaluate_faithfulness(claims_A, context_full_text)\n"
                "a_rel = evaluator.evaluate_answer_relevance(query, ans_tokens_A)\n"
                "\n"
                "print(\"Hasil Audit Evaluasi RAG Triad:\")\n"
                "print(f\"  1. Context Relevance       : {c_rel:.2f} ({c_rel*100:.0f}% kalimat konteks relevan)\")\n"
                "print(f\"  2. Groundedness/Faithfulness: {faith:.2f} ({faith*100:.0f}% klaim didukung dokumen)\")\n"
                "print(f\"  3. Answer Relevance        : {a_rel:.2f} ({a_rel*100:.0f}% kata kunci kueri terjawab)\")\n"
                "print(f\"  Skor Harmoni RAG Triad     : {(c_rel + faith + a_rel)/3:.2f} / 1.00 [Status: Verified High Quality]\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.14.6
    {
        "id": "28.14.6",
        "title": "Framework Evaluasi RAG Otomatis: Ragas dan TruLens",
        "learningObjectives": [
            "Memahami arsitektur evaluasi RAG otomatis berbasis LLM-as-a-Judge menggunakan framework Ragas dan TruLens.",
            "Menganalisis teknik dekomposisi klaim faktual (*claim decomposition*) dan generation of synthetic test sets.",
            "Mengimplementasikan pipeline evaluasi otomatis terstruktur dengan skema penilaian probabilistik deterministik."
        ],
        "prerequisites": [
            "28.14.5 (RAG Triad Metrics).",
            "Mekanisme LLM Prompt Engineering, JSON Structured Outputs, dan Few-Shot In-Context Learning."
        ],
        "commonPitfalls": [
            "Mengabaikan bias evaluator (*Self-Preference Bias* dan *Position Bias*) ketika LLM bertindak sebagai penilai jawabannya sendiri.",
            "Biaya inferensi API yang membengkak akibat menjalankan evaluasi multi-aspek pada 100% kueri produksi (solusi: sampling 1-5%)."
        ],
        "academicReferences": [
            "Es, S., et al. (2023). RAGAS: Automated evaluation of retrieval augmented generation. arXiv preprint arXiv:2309.15217.",
            "Zheng, L., et al. (2023). Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena. In Advances in Neural Information Processing Systems (NeurIPS 2023), 36."
        ],
        "caseStudy": "Sebuah platform edutech mengintegrasikan Ragas ke dalam pipeline CI/CD GitHub Actions mereka. Setiap kali ada pull request yang mengubah prompt generator atau parameter chunking vector database, sistem secara otomatis mengevaluasi 200 pasangan test case sintetis. Jika skor Faithfulness turun di bawah 0.85, pipeline CI/CD otomatis memblokir merger kode ke production.",
        "content": {
            "theory": (
                "Menilai ribuan interaksi RAG di tingkat produksi secara manual oleh manusia (*human annotation*) adalah hal yang mustahil secara biaya dan waktu. "
                "Framework otomatis seperti **Ragas** dan **TruLens** mengotomatisasi pengujian kualitas menggunakan paradigma **LLM-as-a-Judge**. "
                "Proses evaluasi otomatis terdiri dari tiga tahapan sistematis: "
                "1. **Synthetic Test Data Generation**: Menggunakan teknik evolusi kueri berbasis pohon dokumen untuk menghasilkan pasangan pertanyaan-konteks-ground truth secara sintetis dengan variasi kompleksitas reasoning (*simple, multi-context, conditional*). "
                "2. **Claim Atomic Decomposition**: Jawaban sistem $a$ diurai menjadi kumpulan proposisi atomik independen $\\mathcal{S} = \\{s_1, s_2, \\dots, s_m\\}$. "
                "Setiap pernyataan tunggal diverifikasi kebenarannya terhadap konteks $\\mathcal{C}$ melalui prompting inferensi logis terstruktur (*Natural Language Inference / NLI*): "
                "$$v(s_i, \\mathcal{C}) = \\begin{cases} 1 & \\text{jika } \\mathcal{C} \\models s_i \\\\ 0 & \\text{jika kontradiktif / tidak didukung} \\end{cases}$$ "
                "3. **Aggregated Metric Scoring**: Menghitung skor akhir sebagai rata-rata terbobot kepercayaan: "
                "$$\\text{Faithfulness\\_Score} = \\frac{\\sum_{i=1}^m v(s_i, \\mathcal{C})}{m}$$ "
                "Pendekatan ini memisahkan halusinasi bahasa dari fakta retrieval secara objektif dan terukur."
            ),
            "realWorldApplication": (
                "TruLens dan Ragas digunakan oleh tim engineering di Databricks, LangChain, dan LlamaIndex sebagai standar pengujian regresi RAG otomatis."
            ),
            "codeSnippet": (
                "import json\n"
                "\n"
                "# Simulasi Framework Evaluasi Otomatis (Ragas-Style Claim Decomposition)\n"
                "class SyntheticRagasJudge:\n"
                "    def __init__(self):\n"
                "        pass\n"
                "\n"
                "    def decompose_into_atomic_claims(self, answer_text):\n"
                "        # Memecah jawaban menjadi kalimat atomik (Simulasi LLM Parser)\n"
                "        claims = [c.strip() for c in answer_text.split(\".\") if len(c.strip()) > 3]\n"
                "        return claims\n"
                "\n"
                "    def verify_claims_against_context(self, claims, context_corpus):\n"
                "        verifications = []\n"
                "        corpus_lower = context_corpus.lower()\n"
                "        for claim in claims:\n"
                "            # Cek keterkaitan leksikal/faktual terhadap korpus\n"
                "            # Ambil kata-kata penting (panjang > 4 karakter)\n"
                "            keywords = [w.lower() for w in claim.split() if len(w) > 4]\n"
                "            supported = any(kw in corpus_lower for kw in keywords)\n"
                "            verifications.append({\n"
                "                \"claim\": claim,\n"
                "                \"verdict\": \"SUPPORTED\" if supported else \"HALLUCINATED\",\n"
                "                \"score\": 1.0 if supported else 0.0\n"
                "            })\n"
                "        \n"
                "        total_score = sum(v[\"score\"] for v in verifications) / len(verifications) if verifications else 0.0\n"
                "        return total_score, verifications\n"
                "\n"
                "context = \"Python 3.12 dirilis pada Oktober 2023 dengan peningkatan kecepatan eksekusi dan perbaikan pesan kesalahan.\"\n"
                "answer_with_hallucination = \"Python 3.12 dirilis pada Oktober 2023. Versi ini menghapus Global Interpreter Lock (GIL) secara total.\"\n"
                "\n"
                "judge = SyntheticRagasJudge()\n"
                "claims = judge.decompose_into_atomic_claims(answer_with_hallucination)\n"
                "faithfulness, details = judge.verify_claims_against_context(claims, context)\n"
                "\n"
                "print(f\"Evaluasi Otomatis Ragas LLM-as-a-Judge:\")\n"
                "print(f\"  Total Klaim Terdeteksi : {len(claims)}\")\n"
                "for i, d in enumerate(details, 1):\n"
                "    print(f\"    Klaim #{i}: \\\"{d['claim']}\\\" -> [{d['verdict']}]\")\n"
                "print(f\"  Skor Faithfulness Akhir: {faithfulness:.2f} ({faithfulness*100:.0f}%)\")\n"
                "print(f\"  Rekomendasi Pipeline CI: {'TOLAK PULL REQUEST (Terdeteksi Halusinasi!)' if faithfulness < 0.8 else 'LOLOS'}\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.14.7
    {
        "id": "28.14.7",
        "title": "Dataset Benchmark Standar: BEIR, MTEB, SIFT1M/1B, dan Deep1B",
        "learningObjectives": [
            "Memahami taksonomi dataset benchmark standar industri untuk evaluasi vector database dan model embedding.",
            "Menganalisis karakteristik dataset geometris ANN (SIFT1M, SIFT1B, Deep1B) vs dataset retrieval semantik domain-beragam (BEIR, MTEB).",
            "Mengimplementasikan inspeksi statistik struktur dimensi, distribusi jarak, dan sifat sparsitas pada dataset benchmark."
        ],
        "prerequisites": [
            "28.14.1 (Recall@k) dan 28.14.2 (NDCG@k).",
            "Metrik jarak geometris L2 Euclidean vs Cosine Similarity."
        ],
        "commonPitfalls": [
            "Hanya mengevaluasi model embedding pada kueri domain in-distribution (misal MS MARCO), yang menyembunyikan performa buruk pada tugas zero-shot lintas domain (BioASQ, COVID, Climate).",
            "Menguji skalabilitas miliaran vektor hanya dengan menduplikasi vektor sintetis acak, yang gagal meniru kepadatan topologi dataset nyata (seperti manifold clustering pada Deep1B)."
        ],
        "academicReferences": [
            "Thakur, N., et al. (2021). BEIR: A heterogenous benchmark for zero-shot evaluation of information retrieval models. In Thirty-fifth Conference on Neural Information Processing Systems (NeurIPS 2021) Datasets and Benchmarks Track.",
            "Muennighoff, N., et al. (2023). MTEB: Massive Text Embedding Benchmark. In Proceedings of the 17th Conference of the European Chapter of the Association for Computational Linguistics (EACL 2023), 2014-2037."
        ],
        "caseStudy": "Sebuah tim riset AI memilih model embedding yang memiliki performa tinggi pada dataset MS MARCO. Ketika dideploy ke aplikasi tanya-jawab hukum finansial, akurasi retrieval anjlok sebesar 35%. Mengadopsi evaluasi multi-tugas berbasis benchmark BEIR (18 dataset lintas disiplin) dan MTEB (56 dataset) memungkinkan tim memilih arsitektur generalis yang tangguh secara zero-shot di seluruh korpus enterprise.",
        "content": {
            "theory": (
                "Standardisasi evaluasi basis data vektor dan model representasi laten bergantung pada kumpulan dataset tolok ukur (*benchmark datasets*) yang terkurasi secara internasional. "
                "Secara matematis, dataset benchmark mengevaluasi kemampuan algoritma dalam memetakan manifold berdimensi intrinsik rendah di dalam ruang embedding berdimensi tinggi: "
                "$$\\mathcal{M} \\subset \\mathbb{R}^d, \\quad \\text{dengan dimensi intrinsik } d_{\\text{intrinsic}}(\\mathcal{M}) \\ll d$$ "
                "Tolok ukur ini terbagi menjadi dua kategori fundamental: "
                "1. **Dataset Benchmark ANN Geometris (Skala Besar)**: "
                "- **SIFT1M / SIFT1B**: Menampilkan 1 juta hingga 1 miliar vektor deskriptor visual $\\mathbf{x} \\in \\mathbb{R}^{128}$ (fitur SIFT). Mengukur jarak Euclidean $L_2$: $\\|\\mathbf{x} - \\mathbf{y}\\|_2 = \\sqrt{\\sum_{i=1}^{128} (x_i - y_i)^2}$. Menjadi standar baku pengujian skalabilitas kuantisasi dan indeks graf Faiss/DiskANN sejak era 2010-an. "
                "- **Deep1B**: Terdiri dari 1 miliar vektor $\\mathbf{x} \\in \\mathbb{R}^{96}$ yang diekstrak dari lapisan konvolusi mendalam CNN. Memiliki karakteristik kepadatan manifold non-seragam yang merefleksikan distribusi data dunia nyata. "
                "2. **Dataset Benchmark Retrieval Semantik & Dense Passage Retrieval**: "
                "- **BEIR (Benchmarking Information Retrieval)**: Tolok ukur heterogen yang terdiri dari 18 dataset lintas domain (kedokteran, hukum, bioinformatika, tanya-jawab fakta) untuk menguji performa zero-shot retrieval tanpa fine-tuning spesifik, diukur dengan metrik $\\text{NDCG}@10$. "
                "- **MTEB (Massive Text Embedding Benchmark)**: Meliputi 56 dataset dalam 8 tugas berbeda (Retrieval, Reranking, Classification, Clustering, STS, Pair Classification, Summarization) untuk memetakan kapasitas representasi umum model embedding bahasa."
            ),
            "realWorldApplication": (
                "Hugging Face MTEB Leaderboard menjadi rujukan utama seluruh praktisi industri AI global untuk memilih checkpoint model embedding (seperti BAAI/bge-large, OpenAI text-embedding-3, dan Voyage-AI)."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Profiling Statistik Sifat Geometris Dataset Benchmark Standar (Simulasi SIFT vs Deep1B)\n"
                "def profile_benchmark_distribution(name, vectors):\n"
                "    norms = np.linalg.norm(vectors, axis=1)\n"
                "    pairwise_dot = np.dot(vectors[:100], vectors[:100].T)\n"
                "    np.fill_diagonal(pairwise_dot, np.nan)\n"
                "    mean_sim = np.nanmean(pairwise_dot)\n"
                "    std_sim = np.nanstd(pairwise_dot)\n"
                "    return {\n"
                "        \"name\": name,\n"
                "        \"dim\": vectors.shape[1],\n"
                "        \"count\": vectors.shape[0],\n"
                "        \"mean_norm\": float(np.mean(norms)),\n"
                "        \"mean_pairwise_similarity\": float(mean_sim),\n"
                "        \"sim_std\": float(std_sim)\n"
                "    }\n"
                "\n"
                "np.random.seed(42)\n"
                "# Simulasi Dataset SIFT (128-D, L2 normalized)\n"
                "sift_sim = np.random.randn(1000, 128)\n"
                "sift_sim /= np.linalg.norm(sift_sim, axis=1, keepdims=True)\n"
                "\n"
                "# Simulasi Dataset Deep1B (96-D, Highly clustered manifold)\n"
                "centers = np.random.randn(5, 96)\n"
                "deep_sim = []\n"
                "for i in range(1000):\n"
                "    c = centers[i % 5]\n"
                "    deep_sim.append(c + np.random.randn(96) * 0.1)\n"
                "deep_sim = np.array(deep_sim)\n"
                "deep_sim /= np.linalg.norm(deep_sim, axis=1, keepdims=True)\n"
                "\n"
                "p_sift = profile_benchmark_distribution(\"SIFT-Like Benchmark\", sift_sim)\n"
                "p_deep = profile_benchmark_distribution(\"Deep1B-Like Benchmark\", deep_sim)\n"
                "\n"
                "print(\"Perbandingan Sifat Geometris Benchmark Standar:\")\n"
                "for p in [p_sift, p_deep]:\n"
                "    print(f\"  [{p['name']}]\")\n"
                "    print(f\"    Dimensi Vektor   : {p['dim']}-D | Sampel: {p['count']}\")\n"
                "    print(f\"    Rerata Kesamaan  : {p['mean_pairwise_similarity']:+.4f} (Std-Dev: {p['sim_std']:.4f})\")\n"
                "    print(f\"    Karakteristik    : {'Tergolong Kerapatan Klaster Tinggi (Clustered)' if p['sim_std'] > 0.15 else 'Distribusi Isotrofik Homogen'}\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.14.8
    {
        "id": "28.14.8",
        "title": "Framework Benchmarking: ANN-Benchmarks (Aumüller et al., 2020) dan VectorDBBench",
        "learningObjectives": [
            "Memahami arsitektur metodologis framework benchmarking terstandarisasi: ANN-Benchmarks dan VectorDBBench.",
            "Menganalisis standardisasi pengukuran kurva QPS vs Recall@k pada lingkungan komputasi terkontrol.",
            "Mengimplementasikan runner benchmark otomatis yang mengeksekusi parameter grid search dan memplot Pareto frontier secara deterministik."
        ],
        "prerequisites": [
            "28.14.3 (Trade-off Segitiga Emas) dan 28.14.7 (Dataset Benchmark).",
            "Docker Containerization, Pengukuran Throughput Multiprocessing, dan Metrik Kinerja Sistem."
        ],
        "commonPitfalls": [
            "Menjalankan benchmark di mesin bersama (*shared virtual machine*) dengan variasi CPU throttling, menghasilkan hasil benchmark yang tidak dapat direproduksi (*irreproducible results*).",
            "Menguji vector database hanya pada mode in-memory tanpa menyertakan beban streaming ingestion bersamaan (*concurrent read-write workload*)."
        ],
        "academicReferences": [
            "Aumüller, M., Bernhardsson, E., & Faithfull, A. (2020). ANN-Benchmarks: A benchmarking tool for approximate nearest neighbor algorithms. Information Systems, 87, 101374.",
            "Wang, J., et al. (2021). Milvus: A purpose-built vector data management system. In SIGMOD '21."
        ],
        "caseStudy": "Sebuah konsorsium industri mengevaluasi 5 penyedia vector database komersial untuk beban kerja 100 juta vektor. Menggunakan runner kustom yang tidak terstandarisasi menghasilkan klaim pemasaran yang bertentangan. Tim beralih ke framework open-source ANN-Benchmarks dan VectorDBBench dengan spesifikasi mesin c5.4xlarge terkunci, menghasilkan laporan komparatif independen yang transparan dan dapat direproduksi secara publik.",
        "content": {
            "theory": (
                "Komparasi performa algoritma Approximate Nearest Neighbor (ANN) di masa lalu sering kali bias dan sulit direproduksi akibat variasi implementasi perangkat keras dan konfigurasi pengujian. "
                "Framework terstandarisasi **ANN-Benchmarks** diciptakan untuk menyelesaikan persoalan ini. "
                "Sebagaimana dirumuskan secara seminal oleh Martin Aumüller, Erik Bernhardsson, dan Alexander Faithfull (2020): "
                "\"This paper describes ANN-Benchmarks, a tool for evaluating the performance of in-memory approximate nearest neighbor algorithms. It provides a standard interface for measuring the performance and quality achieved by nearest neighbor algorithms on different standard data sets. It supports several different ways of integrating $k$-NN algorithms, and its configuration system automatically tests a range of parameter settings for each algorithm. Algorithms are compared with respect to many different (approximate) quality measures, and adding more is easy and fast; the included plotting front-ends can visualise these as images, $\\LaTeX$ plots, and websites with interactive plots. ANN-Benchmarks aims to provide a constantly updated overview of the current state of the art of $k$-NN algorithms.\" "
                "Sementara ANN-Benchmarks berfokus pada efisiensi algoritma pustaka in-memory (seperti Faiss, HNSWLib, Annoy, ScaNN), framework **VectorDBBench** memperluas evaluasi ke sistem basis data vektor terdistribusi skala penuh (Qdrant, Milvus, Weaviate, Pinecone). "
                "VectorDBBench menguji sistem pada skenario nyata: "
                "1. **Penyaringan Metadata Campuran (Filtered Search)**. "
                "2. **Throughput Penulisan Bersamaan (Ingestion While Querying)**. "
                "3. **Ketahanan Pemulihan Crash dan Biaya Finansial Cloud per Miliar Vektor**."
            ),
            "realWorldApplication": (
                "Situs web resmi ann-benchmarks.com menjadi barometer global bagi peneliti AI dan praktisi database untuk melihat perbandingan efisiensi algoritma nearest neighbor terkini."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Simulasi Runner ANN-Benchmarks: Automated Hyperparameter Grid & Pareto Evaluation\n"
                "class ANNBenchmarkRunner:\n"
                "    def __init__(self, algo_name=\"HNSWLib\"):\n"
                "        self.algo_name = algo_name\n"
                "\n"
                "    def run_parameter_grid(self, param_grid):\n"
                "        results = []\n"
                "        for p in param_grid:\n"
                "            # Simulasi pengukuran empiris terstandarisasi\n"
                "            # ef_search semakin besar -> Recall naik, QPS turun\n"
                "            ef = p[\"ef_search\"]\n"
                "            recall = 1.0 - (1.0 / (1.0 + 0.15 * ef))\n"
                "            latency_ms = 0.4 + 0.05 * ef\n"
                "            qps = 1000.0 / latency_ms\n"
                "            results.append({\"param\": p, \"recall\": recall, \"qps\": qps, \"latency_ms\": latency_ms})\n"
                "        return results\n"
                "\n"
                "    def filter_pareto_optimal(self, results):\n"
                "        # Mencari titik-titik optimal yang mendominasi kurva\n"
                "        sorted_res = sorted(results, key=lambda x: x[\"recall\"], reverse=True)\n"
                "        pareto = []\n"
                "        max_qps_seen = -1.0\n"
                "        for r in sorted_res:\n"
                "            if r[\"qps\"] > max_qps_seen:\n"
                "                pareto.append(r)\n"
                "                max_qps_seen = r[\"qps\"]\n"
                "        return sorted(pareto, key=lambda x: x[\"recall\"])\n"
                "\n"
                "runner = ANNBenchmarkRunner(\"Simulated-HNSW\")\n"
                "grid = [{\"ef_search\": val} for val in [10, 20, 40, 80, 160, 320]]\n"
                "raw_results = runner.run_parameter_grid(grid)\n"
                "pareto_points = runner.filter_pareto_optimal(raw_results)\n"
                "\n"
                "print(f\"Laporan Hasil Benchmarking Terstandarisasi ({runner.algo_name}):\")\n"
                "print(f\"  Total Konfigurasi Diuji : {len(raw_results)}\")\n"
                "print(f\"  Titik Batas Pareto Efisien: {len(pareto_points)} konfigurasi terpilih\")\n"
                "print(\"\\nTabel Evaluasi Pareto:\")\n"
                "for pt in pareto_points:\n"
                "    p_val = pt[\"param\"][\"ef_search\"]\n"
                "    print(f\"  ef_search={p_val:<3d} -> Recall@10: {pt['recall']:.4f} | Throughput: {pt['qps']:6.1f} QPS | Latensi: {pt['latency_ms']:5.2f} ms\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.14.9
    {
        "id": "28.14.9",
        "title": "Stress Testing, Concurrency Testing, dan Degradasi Kinerja di Bawah Beban Tinggi",
        "learningObjectives": [
            "Memahami metodologi pengujian stres (*Stress Testing*) dan konkurensi tinggi (*Concurrency Testing*) pada basis data vektor.",
            "Menganalisis fenomena degradasi performa: antrean koneksi jenuh, cache eviction cascade, dan lonjakan tail latency p99.",
            "Mengimplementasikan simulator stres pengujian beban konkurensi multi-worker untuk mendeteksi batas saturasi kapasitas sistem."
        ],
        "prerequisites": [
            "28.14.3 (Trade-off Segitiga Emas).",
            "Teori Antrean (*Queueing Theory* - Little's Law, M/M/c Model) dan Concurrency Pool."
        ],
        "commonPitfalls": [
            "Menguji sistem hanya dengan konkurensi sekuensial tunggal (concurrency=1), yang gagal mengungkap kebuntuan lock (*deadlocks*) dan thread contention.",
            "Mengirimkan pola kueri identik yang ter-cache di memori, menghasilkan throughput semu yang jauh lebih tinggi daripada kondisi produksi riil."
        ],
        "academicReferences": [
            "Dean, J., & Barroso, L. A. (2013). The tail at scale. Communications of the ACM, 56(2), 74-80.",
            "Little, J. D. (1961). A proof for the queuing formula: $L = \\lambda W$. Operations Research, 9(3), 383-387."
        ],
        "caseStudy": "Sebuah sistem pencarian dokumen hukum diuji pada hari peluncuran. Saat beban naik dari 50 ke 500 pengguna bersamaan, latensi p99 meledak dari 15 ms ke 4,200 ms (280x lipat) karena thread pool CPU jenuh dan memori swap aktif. Melalui stress testing pra-produksi dengan batas konkurensi (circuit breaker) dan backpressure, sistem mampu mempertahankan latensi stabil di bawah 45 ms pada beban puncak.",
        "content": {
            "theory": (
                "Dalam lingkungan produksi nyata, basis data vektor harus melayani lonjakan lalu lintas yang tidak terduga tanpa mengalami keruntuhan berantai (*cascading failure*). "
                "Perilaku sistem di bawah beban tinggi dijelaskan oleh **Hukum Little (Little's Law)** dalam teori antrean: "
                "$$L = \\lambda \\cdot W$$ "
                "Di mana $L$ adalah jumlah rata-rata kueri dalam sistem (konkurensi aktif), $\\lambda$ adalah laju kedatangan kueri per detik (throughput kedatangan), dan $W$ adalah waktu tunggu rata-rata (latensi respons). "
                "Ketika $\\lambda$ melampaui kapasitas saturasi maksimum klaster $\\lambda_{\\text{max}}$: "
                "1. **Thread Pool Exhaustion**: Kueri baru tertahan dalam antrean tunggu eksternal (*backlog queue*). "
                "2. **Tail Latency Explosion**: Latensi p99 meningkat secara eksponensial karena waktu tunggu antrean mendominasi total waktu eksekusi: "
                "$$W_{\\text{queue}} \\propto \\frac{\\rho}{1 - \\rho}, \\quad \\text{di mana } \\rho = \\frac{\\lambda}{c \\cdot \\mu} \\to 1$$ "
                "3. **Degradasi Berjenjang (Graceful Degradation)**: Sistem yang tangguh menerapkan mekanisme *load shedding* (menolak kueri berlebih dengan status 429), *adaptive early termination* (mengurangi nilai $ef_{\\text{search}}$ secara dinamis saat beban tinggi), dan isolasi antrean prioritas."
            ),
            "realWorldApplication": (
                "Sistem pencarian skala enterprise seperti Elasticsearch dan Pinecone mengimplementasikan dynamic backpressure dan circuit breakers untuk melindungi node worker agar tidak crash karena kehabisan memori (OOM) saat beban kueri melonjak."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Simulasi Stress Testing Beban Konkurensi & Analisis Degradasi Latensi p99\n"
                "class VectorClusterStressSimulator:\n"
                "    def __init__(self, max_capacity_qps=500.0, base_latency_ms=8.0):\n"
                "        self.capacity = max_capacity_qps\n"
                "        self.base_latency = base_latency_ms\n"
                "\n"
                "    def simulate_load(self, concurrent_requests):\n"
                "        latencies = []\n"
                "        for _ in range(concurrent_requests):\n"
                "            utilization = concurrent_requests / self.capacity\n"
                "            if utilization < 0.8:\n"
                "                # Zona Normal (latensi stabil dengan sedikit jitter)\n"
                "                lat = self.base_latency + np.random.exponential(scale=1.5)\n"
                "            elif utilization < 1.0:\n"
                "                # Zona Jenuh (antrean mulai menumpuk)\n"
                "                lat = self.base_latency * 2.0 + np.random.exponential(scale=10.0)\n"
                "            else:\n"
                "                # Zona Kelebihan Beban (Queue Explosion & Backpressure)\n"
                "                overflow_factor = (utilization - 1.0) * 15.0\n"
                "                lat = self.base_latency * 5.0 + (overflow_factor * 25.0) + np.random.exponential(scale=50.0)\n"
                "            latencies.append(lat)\n"
                "        \n"
                "        latencies = np.array(latencies)\n"
                "        return {\n"
                "            \"concurrency\": concurrent_requests,\n"
                "            \"p50_ms\": float(np.percentile(latencies, 50)),\n"
                "            \"p95_ms\": float(np.percentile(latencies, 95)),\n"
                "            \"p99_ms\": float(np.percentile(latencies, 99))\n"
                "        }\n"
                "\n"
                "np.random.seed(42)\n"
                "sim = VectorClusterStressSimulator(max_capacity_qps=200.0, base_latency_ms=5.0)\n"
                "load_levels = [50, 150, 250, 400]\n"
                "\n"
                "print(\"Laporan Uji Stres Beban Konkurensi Klaster Vektor:\")\n"
                "print(f\"  Kapasitas Saturasi Nominal: {sim.capacity:.0f} QPS\\n\")\n"
                "print(f\"  {'Konkurensi':<12} | {'p50 (ms)':<10} | {'p95 (ms)':<10} | {'p99 (ms)':<10} | {'Status Kesehatan':<15}\")\n"
                "print(\"  \" + \"-\" * 65)\n"
                "for load in load_levels:\n"
                "    metrics = sim.simulate_load(load)\n"
                "    status = \"SEHAT\" if metrics['p99_ms'] < 20 else (\"DEGRADASI\" if metrics['p99_ms'] < 100 else \"KRITIS/OVERLOAD\")\n"
                "    print(f\"  {metrics['concurrency']:<12d} | {metrics['p50_ms']:<10.1f} | {metrics['p95_ms']:<10.1f} | {metrics['p99_ms']:<10.1f} | {status:<15}\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.14.10
    {
        "id": "28.14.10",
        "title": "Continuous Monitoring, Drift Detection pada Embedding, dan Audit Kualitas Produksi",
        "learningObjectives": [
            "Memahami arsitektur pemantauan berkelanjutan (*Continuous Monitoring*) untuk basis data vektor dan aplikasi RAG di tingkat produksi.",
            "Menganalisis fenomena pergeseran distribusi representasi (*Data Drift & Concept Drift*) pada ruang embedding laten.",
            "Mengimplementasikan algoritma deteksi pergeseran embedding menggunakan Maximum Mean Discrepancy (MMD) atau Wasserstein Distance."
        ],
        "prerequisites": [
            "28.14.5 (RAG Triad) dan 28.14.9 (Stress Testing).",
            "Uji Hipotesis Statistik Kolmogorov-Smirnov, Wasserstein Distance, dan Embedding Manifold."
        ],
        "commonPitfalls": [
            "Hanya memantau metrik infrastruktur (CPU, RAM, disk) dan mengabaikan degradasi semantik (*silent quality degradation*).",
            "Menghitung drift pada teks mentah tanpa memeriksa pergeseran koordinat spasial pada output model embedding."
        ],
        "academicReferences": [
            "Rabanser, S., Günnemann, S., & Lipton, Z. (2019). Failing loudly: An empirical study of methods for detecting dataset shift. In Advances in Neural Information Processing Systems (NeurIPS 2019), 32.",
            "Gretton, A., et al. (2012). A kernel two-sample test. The Journal of Machine Learning Research, 13(1), 723-773."
        ],
        "caseStudy": "Sebuah e-commerce fashion mendeteksi penurunan konversi pencarian sebesar 18% setelah pergantian musim dari musim panas ke musim dingin. Monitoring infrastruktur menunjukkan status hijau (latensi 6 ms). Sistem audit embedding mendeteksi pergeseran spasial ekstrem (Wasserstein Distance melonjak 4.2x) pada kueri pengguna yang mencari istilah busana dingin baru yang belum ada di korpus vektor referensi.",
        "content": {
            "theory": (
                "Sistem basis data vektor yang beroperasi secara langsung di lingkungan produksi rentan terhadap penurunan kualitas senyap (*silent decay*) yang tidak terdeteksi oleh pemantau sistem berkas konvensional. "
                "Dua bentuk degradasi semantik utama adalah: "
                "1. **Covariate Shift (Data Drift)**: Distribusi probabilitas kueri pengguna berubah seiring waktu $P_t(\\mathbf{q}) \\ne P_0(\\mathbf{q})$, meskipun definisi relevansi semantik tetap sama. "
                "2. **Concept Drift**: Hubungan fungsional antara kueri dan dokumen berubah (misalnya istilah teknologi baru atau perubahan regulasi hukum). "
                "Untuk mendeteksi pergeseran pada ruang representasi berdimensi tinggi $\\mathbb{R}^d$, digunakan uji statistik dua sampel non-parametrik **Maximum Mean Discrepancy (MMD)**: "
                "$$\\text{MMD}^2(\\mathcal{P}, \\mathcal{Q}) = \\mathbb{E}_{\\mathbf{x}, \\mathbf{x}' \\sim \\mathcal{P}}[k(\\mathbf{x}, \\mathbf{x}')] - 2\\mathbb{E}_{\\mathbf{x} \\sim \\mathcal{P}, \\mathbf{y} \\sim \\mathcal{Q}}[k(\\mathbf{x}, \\mathbf{y})] + \\mathbb{E}_{\\mathbf{y}, \\mathbf{y}' \\sim \\mathcal{Q}}[k(\\mathbf{y}, \\mathbf{y}')]$$ "
                "Di mana $k(\\mathbf{x}, \\mathbf{y}) = \\exp\\left(-\\frac{\\|\\mathbf{x} - \\mathbf{y}\\|^2}{2\\sigma^2}\\right)$ adalah fungsi kernel RBF gaussian. "
                "Jika nilai MMD melebihi ambang batas kritis $\\tau_{\\alpha}$ pada tingkat signifikansi $\\alpha = 0.05$, sistem secara otomatis memicu peringatan untuk melakukan re-indexing atau pembaruan korpus dokumen referensi."
            ),
            "realWorldApplication": (
                "Platform observabilitas AI seperti Arize AI, WhyLabs, dan Fiddler AI menyediakan visualisasi pergeseran centroid dan UMAP reduction real-time untuk mendeteksi embedding drift pada vector database enterprise."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Deteksi Pergeseran Embedding Laten Menggunakan Simplified Maximum Mean Discrepancy (MMD)\n"
                "def rbf_kernel(X, Y, gamma=0.5):\n"
                "    # Menghitung matriks kernel RBF Gaussian: exp(-gamma * ||x - y||^2)\n"
                "    dist_sq = np.sum(X**2, axis=1, keepdims=True) + np.sum(Y**2, axis=1, keepdims=True).T - 2 * np.dot(X, Y.T)\n"
                "    return np.exp(-gamma * np.maximum(dist_sq, 0.0))\n"
                "\n"
                "def compute_mmd(baseline_samples, current_samples, gamma=0.5):\n"
                "    K_XX = rbf_kernel(baseline_samples, baseline_samples, gamma)\n"
                "    K_YY = rbf_kernel(current_samples, current_samples, gamma)\n"
                "    K_XY = rbf_kernel(baseline_samples, current_samples, gamma)\n"
                "    \n"
                "    # Rerata tanpa diagonal untuk estimator unbiased\n"
                "    m = len(baseline_samples)\n"
                "    n = len(current_samples)\n"
                "    mmd_sq = (K_XX.sum() - np.trace(K_XX)) / (m * (m - 1)) + \\\n"
                "             (K_YY.sum() - np.trace(K_YY)) / (n * (n - 1)) - \\\n"
                "             2 * K_XY.mean()\n"
                "    return float(np.sqrt(max(mmd_sq, 0.0)))\n"
                "\n"
                "np.random.seed(42)\n"
                "dim = 16\n"
                "# Baseline distribusi embedding kueri stabil (musim normal)\n"
                "baseline_queries = np.random.randn(200, dim)\n"
                "baseline_queries /= np.linalg.norm(baseline_queries, axis=1, keepdims=True)\n"
                "\n"
                "# Sampel 1: Kueri stabil minggu depan (tidak ada drift)\n"
                "stable_queries = np.random.randn(200, dim)\n"
                "stable_queries /= np.linalg.norm(stable_queries, axis=1, keepdims=True)\n"
                "\n"
                "# Sampel 2: Kueri mengalami pergeseran topik tren baru (drift nyata)\n"
                "shifted_queries = (np.random.randn(200, dim) + np.array([1.5] * dim))\n"
                "shifted_queries /= np.linalg.norm(shifted_queries, axis=1, keepdims=True)\n"
                "\n"
                "mmd_stable = compute_mmd(baseline_queries, stable_queries)\n"
                "mmd_drifted = compute_mmd(baseline_queries, shifted_queries)\n"
                "\n"
                "print(\"Audit Observabilitas: Deteksi Pergeseran Distribusi Embedding (MMD):\")\n"
                "print(f\"  1. Sampel Stabil vs Baseline  : MMD = {mmd_stable:.4f} [Distribusi Normal/In-Control]\")\n"
                "print(f\"  2. Sampel Shifted vs Baseline : MMD = {mmd_drifted:.4f} [Peringatan Kritis: EMBEDDING DRIFT!]\")\n"
                "print(f\"  Rasio Kenaikan Disparitas     : {mmd_drifted / max(mmd_stable, 1e-4):.1f}x lipat di atas batas toleransi\")"
            ),
            "codeSnippetOutput": ""
        }
    }
]

# Run all snippets to get exact deterministic output
for sub in subchapters:
    code = sub["content"]["codeSnippet"]
    old_stdout = sys.stdout
    import io
    sys.stdout = io.StringIO()
    local_env = {}
    try:
        exec(code, local_env)
        out = sys.stdout.getvalue().strip()
    except Exception as e:
        out = f"Error: {e}"
    finally:
        sys.stdout = old_stdout
    sub["content"]["codeSnippetOutput"] = out

# Save to JSON
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"[OK] Berhasil menghasilkan 10 subbab Bab 14 Topik 28 ke {output_file}")
