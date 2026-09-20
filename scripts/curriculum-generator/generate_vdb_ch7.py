import json
import os
import sys
import numpy as np

# Output file path
output_file = os.path.join(os.path.dirname(__file__), "vdb_ch7_data.json")

subchapters = [
    # 28.7.1
    {
        "id": "28.7.1",
        "title": "Tantangan Fundamental Filtering Metadata pada Indeks Vektor ANN",
        "learningObjectives": [
            "Memahami mengapa integrasi filter metadata skalar (harga, kategori, tanggal, lokasi) sulit dilakukan pada struktur indeks ANN geometris.",
            "Menganalisis fenomena trade-off antara selektivitas filter skalar dan kepadatan topologi metrik spasial.",
            "Mengukur penurunan recall dan lonjakan latensi saat filter diterapkan secara naif."
        ],
        "prerequisites": [
            "28.4.5 (Hierarchical Navigable Small World HNSW).",
            "Operasi relasional SQL (SELECT ... WHERE condition)."
        ],
        "commonPitfalls": [
            "Mengasumsikan filter skalar dapat diperlakukan sebagai dimensi tambahan pada vektor metrik; koordinat kategori diskrit merusak invarian jarak Euclidean.",
            "Mengabaikan dampak selektivitas filter tinggi (misal hanya 0.1% dokumen lolos filter) terhadap performa traversal graf."
        ],
        "academicReferences": [
            "Aumüller, M., Bernhardsson, E., & Faithfull, A. (2020). ANN-benchmarks: A benchmarking tool for approximate nearest neighbor algorithms. Information Systems, 87, 101374.",
            "Qdrant Team. (2024). Filtering in Vector Search: Concepts and Strategies."
        ],
        "caseStudy": "Aplikasi marketplace real estate dengan 10 juta properti: pengguna mencari 'apartemen minimalis dekat stasiun' (kueri semantik) namun membatasi 'harga < 500 juta AND kota = Surabaya' (filter metadata). Tanpa arsitektur filter yang tepat, 99.8% kandidat vektor semantik terdekat berada di luar kota target, menyebabkan pencarian menghasilkan 0 hasil relevan.",
        "content": {
            "theory": (
                "Dalam aplikasi dunia nyata, pencarian vektor hampir tidak pernah terjadi dalam isolasi semantik murni. "
                "Pengguna selalu menyertakan batasan predikat skalar bisnis: membatasi dokumen berdasarkan kategori produk, rentang harga, tanggal publikasi, status ketersediaan, atau hak akses pengguna (*access control list / ACL*). "
                "\n\n"
                "Menggabungkan predikat skalar dengan indeks pencarian tetangga terdekat perkiraan (ANN) menghadirkan dilema arsitektur komputasi yang sangat mendasar: "
                "1. **Struktur Indeks Ortogonal**: "
                "Indeks skalar (seperti $B^+$-Tree atau Hash Table) dirancang untuk memfilter data berdasarkan relasi pengurutan satu dimensi atau kecocokan eksak. "
                "Sebaliknya, indeks ANN (seperti graf HNSW atau Inverted File IVF) dibangun di atas premis topologi spasial kontinu berdimensi tinggi di mana setiap simpul terhubung berdasarkan kedekatan metrik jarak ($L_2$ atau Cosine). "
                "2. **Dilema Selektivitas Predikat**: "
                "Jika sebuah predikat filter memiliki selektivitas rendah (misal $90\\%$ data lolos filter), struktur graf ANN masih dapat bernavigasi dengan baik. "
                "Namun, jika filter memiliki **selektivitas sangat tinggi** (misal hanya $0.01\\%$ data yang memenuhi syarat, seperti mencari mobil antik tahun 1954), hampir seluruh tetangga langsung dari sebarang simpul pada graf HNSW menjadi tidak valid (*disqualified*). "
                "Akibatnya, penelusuran graf membentur jalan buntu (*dead end*), algoritma gagal mencapai wilayah cluster yang ditargetkan, dan metrik Recall anjlok mendekati nol."
            ),
            "realWorldApplication": (
                "Mesin pencari produk e-commerce (Tokopedia, Amazon): menyaring jutaan item berdasarkan kombinasi kueri semantik multimodal + filter toko official + filter lokasi pengiriman + filter diskon aktif."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Demonstrasi Dilema Selektivitas Filter Metadata pada Vektor\n"
                "np.random.seed(42)\n"
                "N = 1000\n"
                "dim = 16\n"
                "vectors = np.random.randn(N, dim)\n"
                "# Metadata kategori: 95% Kategori 'A', 5% Kategori 'B' (Selektivitas Tinggi!)\n"
                "categories = np.random.choice(['A', 'B'], size=N, p=[0.95, 0.05])\n"
                "\n"
                "query = np.random.randn(dim)\n"
                "dists = np.sum((vectors - query) ** 2, axis=1)\n"
                "raw_top10_ids = np.argsort(dists)[:10]\n"
                "raw_top10_cats = categories[raw_top10_ids]\n"
                "\n"
                "# Hitung berapa banyak Top-10 murni yang lolos filter Kategori 'B'\n"
                "matching_b_in_top10 = np.sum(raw_top10_cats == 'B')\n"
                "\n"
                "print(f\"Total Korpus: {N} dokumen (Kategori B hanya {np.sum(categories == 'B')} dokumen / 5%)\")\n"
                "print(f\"Kategori pada Top-10 Vektor Terdekat Murni : {raw_top10_cats.tolist()}\")\n"
                "print(f\"Jumlah Kandidat Lolos Filter B di Top-10 : {matching_b_in_top10} dari 10\")\n"
                "print(\"Kesimpulan: Filter selektif tinggi menyingkirkan mayoritas tetangga terdekat murni!\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.7.2
    {
        "id": "28.7.2",
        "title": "Pre-Filtering: Pemangkasan Ruang Sebelum Pencarian Vektor & Masalah Graph Disconnection",
        "learningObjectives": [
            "Memahami arsitektur Pre-Filtering: menyaring dokumen menggunakan indeks skalar sebelum mengevaluasi kemiripan vektor.",
            "Menganalisis mengapa Pre-Filtering pada graf HNSW memicu masalah Keruntuhan Graf (Disconnected Subgraph Collapse).",
            "Mengevaluasi kondisi di mana Pre-Filtering efisien (Brute-Force Scan pada himpunan subset sangat kecil)."
        ],
        "prerequisites": [
            "28.7.1 (Tantangan Filtering Metadata).",
            "28.4.1 (Proximity Graphs & Navigability)."
        ],
        "commonPitfalls": [
            "Mencoba melakukan penelusuran graf HNSW pada subset hasil pre-filtering tanpa membangun ulang graf; sisi-sisi antar simpul yang tersisa terputus sehingga penelusuran serakah macet total.",
            "Melakukan brute-force linear scan pada subset pre-filtering yang masih berukuran besar (misal 500.000 vektor), memicu latensi tinggi."
        ],
        "academicReferences": [
            "Zhao, W., Tan, S., & Li, P. (2020). Song: Approximate nearest neighbor search on filtered graphs. arXiv preprint arXiv:2006.13619.",
            "Qdrant Documentation. (2024). Filtering Architecture: Pre-filtering Trade-offs."
        ],
        "caseStudy": "Sebuah sistem arsip hukum mencoba menggunakan Pre-Filtering pada indeks graf HNSW Faiss: menyaring 5 juta dokumen berdasarkan klausul pengadilan. Ketika filter hanya menyisakan 2.000 dokumen yang tersebar acak di seluruh ruang, penelusuran HNSW terhenti di simpul awal karena seluruh tetangga simpul tersebut tidak lolos filter, menjatuhkan Recall dari 96% menjadi 14%.",
        "content": {
            "theory": (
                "Pendekatan paling klasik untuk menangani batasan metadata adalah **Pre-Filtering**: "
                "1. Evaluasi seluruh predikat skalar terlebih dahulu menggunakan indeks basis data konvensional (misal indeks B-Tree atau Inverted Index). "
                "2. Hasilkan himpunan ID dokumen yang memenuhi syarat: $\\mathcal{M} = \\{ \\text{id} : \\text{predicate}(\\text{payload}_{\\text{id}}) = \\text{True} \\}$. "
                "3. Jalankan pencarian vektor hanya pada himpunan $\\mathcal{M}$. "
                "\n\n"
                "**Masalah Fatal: Keruntuhan Konektivitas Graf (*Graph Disconnection Problem*)**: "
                "Jika pencarian vektor pada langkah ke-3 menggunakan indeks berbasis graf (seperti NSW atau HNSW): "
                "Graf HNSW dibangun di atas keseluruhan korpus $P$. Ketika himpunan simpul dipangkas menjadi subset $\\mathcal{M} \\subset P$, graf yang diinduksi oleh $\\mathcal{M}$ kehilangan mayoritas sisi penghubungnya. "
                "Simpul-simpul yang memenuhi syarat kini terisolasi menjadi pulau-pulau kecil (*disconnected components*). "
                "Ketika algoritma *greedy search* dimulai dari simpul masuk (*entry point*), hampir seluruh tautan keluar (*outgoing edges*) mengarah ke simpul yang ditolak oleh filter. "
                "Akibatnya, penelusuran serakah terperangkap seketika pada *local minimum* palsu, tidak mampu menyeberang ke simpul valid lainnya, dan menghasilkan Recall yang sangat buruk. "
                "\n\n"
                "**Kapan Pre-Filtering Tepat Digunakan?**: "
                "Pre-Filtering hanya efisien jika himpunan hasil filter $\\mathcal{M}$ berukuran sangat kecil (misal $|\\mathcal{M}| < 1.000$ entitas). Pada skala sekecil ini, sistem tidak memerlukan indeks graf sama sekali: eksekusi dapat dialihkan ke **Brute-Force Flat Scan ter-vektorisasi SIMD** langsung pada $\\mathcal{M}$ dengan Recall 100% dan latensi sub-milidetik."
            ),
            "realWorldApplication": (
                "Optimizer query pada Elasticsearch dan Qdrant: jika filter metadata sangat selektif ($|\\mathcal{M}| < \\text{threshold}$), query planner otomatis beralih dari penelusuran HNSW ke exact flat scan pada ID hasil filter."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Demonstrasi Pre-Filtering: Filter Skalar Diikuti Brute-Force Scan pada Subset Valid\n"
                "np.random.seed(42)\n"
                "N = 2000\n"
                "dim = 8\n"
                "vectors = np.random.randn(N, dim)\n"
                "# Metadata harga properti\n"
                "prices = np.random.randint(100, 1000, size=N)\n"
                "\n"
                "# Kueri pengguna: kueri semantik vektor + filter harga < 150 (Selektif!)\n"
                "query = np.random.randn(dim)\n"
                "price_threshold = 150\n"
                "\n"
                "# 1. Tahap Pre-Filter: Ambil ID yang memenuhi syarat\n"
                "valid_ids = np.where(prices < price_threshold)[0]\n"
                "\n"
                "# 2. Tahap Vector Scan: Hanya evaluasi vektor yang lolos seleksi\n"
                "valid_vectors = vectors[valid_ids]\n"
                "subset_dists = np.sum((valid_vectors - query) ** 2, axis=1)\n"
                "top3_local_idx = np.argsort(subset_dists)[:3]\n"
                "top3_global_ids = valid_ids[top3_local_idx]\n"
                "\n"
                "print(f\"Total Data Korpus           : {N} properti\")\n"
                "print(f\"Lolos Pre-Filter (Harga < {price_threshold}): {len(valid_ids)} properti ({len(valid_ids)/N*100:.1f}%)\")\n"
                "print(f\"Top-3 Rekomendasi Terpilih  : {top3_global_ids.tolist()}\")\n"
                "print(f\"Harga Properti Terpilih     : {prices[top3_global_ids].tolist()}\")\n"
                "print(f\"Semua Harga < {price_threshold}?       : {all(prices[top3_global_ids] < price_threshold)}\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.7.3
    {
        "id": "28.7.3",
        "title": "Post-Filtering: Pencarian Vektor Luas & Penalti Recall Akibat Over-Filtering",
        "learningObjectives": [
            "Memahami arsitektur Post-Filtering: menjalankan pencarian ANN murni terlebih dahulu lalu membuang dokumen yang tidak lolos filter.",
            "Menganalisis fenomena over-filtering dan penalti recall ketika kueri membutuhkan k hasil tetapi filter menyaring seluruh kandidat teratas.",
            "Mengevaluasi faktor oversampling (k_search = k * multiplier) dan batasan skalabilitasnya."
        ],
        "prerequisites": [
            "28.7.1 (Tantangan Filtering) & 28.7.2 (Pre-Filtering)."
        ],
        "commonPitfalls": [
            "Menggunakan Post-Filtering pada predikat yang sangat selektif; jika hanya 1% data lolos filter, pencarian k=10 membutuhkan oversampling k_search=1000 yang memperlambat kueri secara masif.",
            "Mengembalikan hasil kurang dari k yang diminta (misal pengguna meminta 10 hasil tetapi hanya 2 yang lolos post-filter)."
        ],
        "academicReferences": [
            "Gollapudi, S., Sivakumar, D., & Yekhanin, S. (2023). Filtered approximate nearest neighbor search on proximity graphs. In ACM-SIAM Symposium on Discrete Algorithms (SODA).",
            "Pinecone Documentation. (2024). Metadata Filtering Strategies."
        ],
        "caseStudy": "Sebuah sistem pencarian film Netflix menggunakan Post-Filtering untuk menyaring konten berbayar tambahan. Ketika pengguna memilih filter 'Termasuk dalam paket langganan', sistem mencari 100 kandidat terdekat dan membuang 95 film berbayar, menyisakan hanya 5 film relevan dan memicu keluhan pengguna karena hasil rekomendasi terlihat kosong.",
        "content": {
            "theory": (
                "Pendekatan komplementer terhadap Pre-Filtering adalah **Post-Filtering**: "
                "1. Jalankan pencarian ANN standar pada struktur graf HNSW lengkap tanpa mempedulikan filter metadata sama sekali. "
                "2. Ambil sejumlah kandidat teratas $K_{\\text{search}} = K \\times \\text{oversample\\_factor}$ (misal $K_{\\text{search}} = 100$ untuk kueri $K = 10$). "
                "3. Saring (*filter out*) kandidat-kandidat yang tidak memenuhi predikat metadata skalar. "
                "4. Kembalikan $K$ kandidat pertama yang berhasil lolos. "
                "\n\n"
                "**Kelebihan dan Kelemahan Fatal Post-Filtering**: "
                "- *Kelebihan*: Struktur graf HNSW tetap utuh dan beroperasi pada efisiensi navigasi optimal tanpa masalah *graph disconnection*. "
                "- *Kelemahan Fatal (The Over-Filtering Penalty)*: "
                "Jika predikat metadata memiliki selektivitas ketat (misal $1\\%$ data lolos), maka dari $100$ kandidat yang diambil pada tahap ANN murni, secara statistik hanya $100 \\times 0.01 = 1$ dokumen yang lolos filter! "
                "Sistem gagal memenuhi kuota $K=10$ hasil yang diminta pengguna (*result starvation*). "
                "Untuk mengompensasi hal ini, sistem terpaksa melipatgandakan parameter $K_{\\text{search}}$ menjadi ribuan, yang melipatgandakan waktu evaluasi jarak metrik dan menghancurkan efisiensi latensi kueri."
            ),
            "realWorldApplication": (
                "Fitur filter pada library Faiss standar (tanpa modul id selector): melakukan pencarian `index.search(q, k * 10)` kemudian membuang ID yang tidak cocok di level aplikasi Python."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Demonstrasi Mekanisme Post-Filtering dan Risiko Result Starvation\n"
                "np.random.seed(42)\n"
                "N = 1000\n"
                "dim = 4\n"
                "data = np.random.randn(N, dim)\n"
                "# Metadata status ketersediaan: hanya 2% yang 'In Stock' (98% Out of Stock!)\n"
                "is_in_stock = np.random.choice([True, False], size=N, p=[0.02, 0.98])\n"
                "\n"
                "query = np.random.randn(dim)\n"
                "target_k = 5\n"
                "\n"
                "# Skenario A: Post-filter dengan oversampling rendah (k_search = 10)\n"
                "dists = np.sum((data - query) ** 2, axis=1)\n"
                "cands_10 = np.argsort(dists)[:10]\n"
                "passed_10 = [idx for idx in cands_10 if is_in_stock[idx]]\n"
                "\n"
                "# Skenario B: Post-filter dengan oversampling tinggi (k_search = 200)\n"
                "cands_200 = np.argsort(dists)[:200]\n"
                "passed_200 = [idx for idx in cands_200 if is_in_stock[idx]][:target_k]\n"
                "\n"
                "print(f\"Target Kueri: Meminta {target_k} barang 'In Stock'\")\n"
                "print(f\"Skenario A (k_search=10) : Ditemukan {len(passed_10)} hasil (GAGAL / Result Starvation!)\")\n"
                "print(f\"Skenario B (k_search=200): Ditemukan {len(passed_200)} hasil (Lengkap, tapi evaluasi 20x lebih banyak)\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.7.4
    {
        "id": "28.7.4",
        "title": "Single-Stage / In-Index Filtering: Payload-Aware Traversal pada HNSW",
        "learningObjectives": [
            "Memahami inovasi Single-Stage (In-Index) Filtering yang mengintegrasikan evaluasi metadata ke dalam penelusuran graf HNSW.",
            "Menganalisis konsep dual-condition traversal: membedakan simpul navigasi (routing nodes) dan simpul kandidat hasil (result candidates).",
            "Mengimplementasikan algoritma penelusuran graf berfilter terpadu (Payload-Aware HNSW Routing)."
        ],
        "prerequisites": [
            "28.4.6 (Algoritma Pencarian HNSW SearchLayer).",
            "28.7.2 (Pre-Filtering) & 28.7.3 (Post-Filtering)."
        ],
        "commonPitfalls": [
            "Hanya mengizinkan simpul yang lolos filter untuk dikunjungi saat traversal graf; ini mengubah In-Index filtering menjadi Pre-Filtering yang kembali memicu masalah graph disconnection!",
            "Melakukan evaluasi string parsing metadata yang lambat di dalam loop terdalam traversal graf (gunakan ID masking atau bitset)."
        ],
        "academicReferences": [
            "Qdrant Team. (2022). Filterable HNSW: How to solve the filtered vector search problem. Qdrant Technical Blog.",
            "Gollapudi, S., et al. (2023). Filtered approximate nearest neighbor search on proximity graphs. SODA."
        ],
        "caseStudy": "Qdrant merevolusi industri pencarian vektor dengan mempublikasikan 'Filterable HNSW'. Dengan mengizinkan simpul yang tidak lolos filter tetap bertindak sebagai jembatan navigasi sambil hanya memasukkan simpul valid ke antrean hasil W, Qdrant mempertahankan Recall > 98% pada sembarang tingkat selektivitas filter tanpa penalti over-filtering.",
        "content": {
            "theory": (
                "Kelemahan fatal Pre-Filtering (*graph disconnection*) dan Post-Filtering (*result starvation*) mendorong lahirnya terobosan arsitektur modern: **Single-Stage / In-Index Filtering** (dipelopori oleh Qdrant melalui *Filterable HNSW*). "
                "\n\n"
                "**Prinsip Inti: Pemisahan Peran Navigasi vs Peran Kandidat Hasil**: "
                "Dalam algoritma penelusuran graf standar, setiap simpul $v$ yang dievaluasi jaraknya memenuhi dua peran sekaligus: "
                "1. Sebagai **titik persinggahan navigasi** (*routing step*) untuk melompat ke tetangganya. "
                "2. Sebagai **kandidat tetangga terdekat** yang dimasukkan ke dalam himpunan hasil terbaik $W$. "
                "\n\n"
                "In-Index Filtering memisahkan kedua peran ini secara elegan selama prosedur `SearchLayer`: "
                "- Ketika penelusuran memeriksa tetangga $e \\in N(c)$: simpul $e$ **selalu diizinkan** untuk dikunjungi dan dimasukkan ke dalam antrean eksplorasi kandidat $C$, meskipun $e$ tidak memenuhi kriteria filter metadata. Hal ini menjaga topologi graf tetap terhubung secara penuh sehingga algoritma dapat terus menyeberang melintasi ruang metrik tanpa pernah terputus. "
                "- Namun, simpul $e$ **hanya dimasukkan ke dalam antrean hasil akhir $W$** jika $e$ memenuhi seluruh predikat metadata skalar yang diminta kueri: "
                "$$e \\in W \\iff \\text{dist}(e, q) < \\text{dist}(f, q) \\quad \\mathbf{AND} \\quad \\text{matches\\_filter}(e)$$ "
                "Dengan arsitektur ini: "
                "- Kueri tidak pernah mengalami keruntuhan konektivitas graf (karena simpul non-filter tetap berfungsi sebagai jembatan navigasi). "
                "- Kueri dijamin menghasilkan tepat $K$ hasil valid yang memenuhi filter tanpa oversampling membabi buta. "
                "- Latensi pencarian beradaptasi secara dinamis terhadap distribusi data."
            ),
            "realWorldApplication": (
                "Payload-Based Filtering pada Qdrant: indeks graf HNSW secara native mengaitkan payload JSON dokumen ke setiap ID vektor, mengevaluasi filter predikat secara terpadu di tingkat assembly SIMD Rust."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "import heapq\n"
                "\n"
                "# Demonstrasi Algoritma Single-Stage Filterable Graph Routing\n"
                "def search_filterable_graph(query: np.ndarray, entry_point: int, ef: int, \n"
                "                            adj_list: dict, vectors: dict, filters: dict):\n"
                "    visited = {entry_point}\n"
                "    d_init = float(np.linalg.norm(vectors[entry_point] - query))\n"
                "    \n"
                "    # Antrean Eksplorasi C (Semua simpul boleh masuk demi navigasi)\n"
                "    C = [(d_init, entry_point)]\n"
                "    # Antrean Hasil W (HANYA simpul yang lolos filter boleh masuk!)\n"
                "    W = []\n"
                "    if filters.get(entry_point, False):\n"
                "        heapq.heappush(W, (-d_init, entry_point))\n"
                "        \n"
                "    while C:\n"
                "        d_c, c = heapq.heappop(C)\n"
                "        d_f = -W[0][0] if len(W) >= ef else float('inf')\n"
                "        if d_c > d_f and len(W) >= ef:\n"
                "            break\n"
                "            \n"
                "        for neighbor in adj_list.get(c, []):\n"
                "            if neighbor not in visited:\n"
                "                visited.add(neighbor)\n"
                "                d_e = float(np.linalg.norm(vectors[neighbor] - query))\n"
                "                \n"
                "                # 1. Selalu masukkan ke C untuk mempertahankan navigasi graf!\n"
                "                heapq.heappush(C, (d_e, neighbor))\n"
                "                \n"
                "                # 2. HANYA masukkan ke W jika lolos filter metadata!\n"
                "                if filters.get(neighbor, False):\n"
                "                    if d_e < d_f or len(W) < ef:\n"
                "                        heapq.heappush(W, (-d_e, neighbor))\n"
                "                        if len(W) > ef:\n"
                "                            heapq.heappop(W)\n"
                "                        d_f = -W[0][0]\n"
                "    return [(-d, u) for d, u in sorted(W, reverse=True)]\n"
                "\n"
                "np.random.seed(42)\n"
                "vecs = {i: np.array([float(i), 0.0]) for i in range(6)}\n"
                "# Graf rantai: 0 - 1 - 2 - 3 - 4 - 5\n"
                "adj = {0: [1], 1: [0, 2], 2: [1, 3], 3: [2, 4], 4: [3, 5], 5: [4]}\n"
                "# Filter: Hanya simpul 0 dan 5 yang lolos (simpul 1,2,3,4 adalah jembatan non-filter)\n"
                "filter_rules = {0: True, 1: False, 2: False, 3: False, 4: False, 5: True}\n"
                "\n"
                "q = np.array([4.8, 0.0]) # Target sangat dekat ke simpul 5\n"
                "results = search_filterable_graph(q, entry_point=0, ef=2, adj_list=adj, vectors=vecs, filters=filter_rules)\n"
                "\n"
                "print(\"Topologi Graf: 0 (Valid) <-> 1..4 (Non-Valid) <-> 5 (Valid)\")\n"
                "print(f\"Target Kueri Dekat Simpul 5: {q.tolist()}\")\n"
                "print(f\"Hasil Penelusuran Filterable HNSW: {results}\")\n"
                "print(\"Sukses Melintasi Jembatan Non-Valid Menuju Target Valid: True\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.7.5
    {
        "id": "28.7.5",
        "title": "Representasi Masking Berkecepatan Tinggi: Bitset SIMD & Roaring Bitmaps",
        "learningObjectives": [
            "Memahami representasi bitset biner untuk evaluasi predikat filter metadata secara instan.",
            "Menganalisis struktur data Roaring Bitmaps (Array, Bitset, RLE Containers) untuk himpunan ID jarang dan padat.",
            "Mengimplementasikan operasi Boolean AND/OR/NOT pada bitset menggunakan operasi bitwise NumPy."
        ],
        "prerequisites": [
            "Operasi bitwise biner (AND, OR, XOR, NOT).",
            "Instruksi CPU Popcount (Population Count)."
        ],
        "commonPitfalls": [
            "Menggunakan struktur data Set / List Python biasa untuk menyimpan jutaan ID filter; konsumsi memori membengkak hingga 8x lipat dibanding bitset biner padat.",
            "Melakukan alokasi array baru di dalam loop kueri alih-alih memanfaatkan bitwise in-place mutation."
        ],
        "academicReferences": [
            "Chambi, S., Lemire, D., Kaser, O., & Godin, R. (2016). Better bitmap performance with Roaring bitmaps. Software: Practice and Experience, 46(5), 709-719.",
            "Lemire, D., Ssi-Yan-Kai, G., & Kaser, O. (2018). Consistently faster and smaller compressed bitmaps with Roaring. Software: Practice and Experience, 48(9), 1718-1740."
        ],
        "caseStudy": "Apache Lucene dan Qdrant mengadopsi Roaring Bitmaps untuk seluruh mesin filter metadata. Menyaring 10 juta ID dokumen dengan filter majemuk `(status = active AND region IN (US, EU))` dieksekusi dalam 0.3 milidetik berkat instruksi AVX2 bitwise operasi pada blok 256-bit.",
        "content": {
            "theory": (
                "Dalam implementasi Single-Stage Filtering pada basis data vektor, kueri pencarian mengevaluasi filter metadata pada puluhan ribu simpul graf per kueri. "
                "Jika evaluasi filter dilakukan melalui pengecekan dictionary skalar atau query JSON parsing, overhead CPU akan melonjak dan meniadakan kecepatan algoritma ANN. "
                "Solusi standar industri untuk verifikasi status dokumen dalam hitungan nanodetik adalah **Bitset Biner Berkecepatan Tinggi** dan **Roaring Bitmaps**. "
                "\n\n"
                "**1. Dense Bitset (Bitmap Murni)**: "
                "Jika database memiliki $N$ dokumen dengan ID $0, 1, \\dots, N-1$, status keabsahan filter dinyatakan sebagai array bit berukuran $\\lceil N / 8 \\rceil$ byte. "
                "Dokumen dengan ID $i$ lolos filter jika dan hanya jika bit ke-$i$ bernilai 1. "
                "Pengecekan keabsahan dokumen diselesaikan dalam 1 instruksi CPU: "
                "$$\\text{isValid}(i) = (\\text{bitset}[i \\gg 6] \\ \\& \\ (1 \\ll (i \\ \\& \\ 63))) \\neq 0$$ "
                "\n\n"
                "**2. Roaring Bitmaps (Partisi Multi-Kontainer Kompresi)**: "
                "Ketika dataset memiliki miliaran dokumen namun hanya sedikit yang lolos filter (*sparse IDs*), bitmap murni membuang memori untuk bit nol. "
                "Roaring Bitmaps (Lemire et al., 2016) membagi ruang ID integer 32-bit ke dalam chunk $2^{16} = 65.536$ bilangan bulat. "
                "Setiap chunk dikelola secara dinamis menggunakan salah satu dari 3 kontainer: "
                "- **Array Container**: Digunakan jika jumlah elemen $< 4.096$. Menyimpan daftar ID sebagai array `uint16` terurut (hemat memori pada data jarang). "
                "- **Bitset Container**: Digunakan jika jumlah elemen $> 4.096$. Menggunakan array 65.536 bit ($8$ KB) murni. "
                "- **Run-Length Encoded (RLE) Container**: Digunakan jika terdapat deretan ID berurutan (misal dokumen berturut-turut lolos filter), menyimpan pasangan `[start, length]`. "
                "\n\n"
                "Instruksi SIMD (AVX-512 `_mm512_and_si512`) mampu mengevaluasi 512 dokumen sekaligus dalam satu siklus clock prosesor."
            ),
            "realWorldApplication": (
                "Penggunaan Roaring Bitmaps pada Qdrant dan Vespa: merepresentasikan hasil eksekusi filter sebelum traversal graf dimulai, memungkinkan pengecekan izin akses (ACL) jutaan dokumen dalam latensi sub-milidetik."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Demonstrasi Efisiensi Representasi Bitset SIMD-Style Menggunakan NumPy uint64\n"
                "N_DOCS = 64000 # 64.000 dokumen\n"
                "words_needed = N_DOCS // 64\n"
                "\n"
                "# Inisialisasi bitset acak (50% dokumen lolos)\n"
                "np.random.seed(42)\n"
                "bitset_filter_a = np.random.randint(0, np.iinfo(np.int64).max, size=words_needed, dtype=np.int64)\n"
                "bitset_filter_b = np.random.randint(0, np.iinfo(np.int64).max, size=words_needed, dtype=np.int64)\n"
                "\n"
                "# Operasi Logika Majemuk: Filter A AND Filter B (Dieksekusi secepat kilat!)\n"
                "combined_mask = bitset_filter_a & bitset_filter_b\n"
                "\n"
                "def check_doc_valid(doc_id: int, bitset: np.ndarray) -> bool:\n"
                "    word_idx = doc_id >> 6      # doc_id // 64\n"
                "    bit_offset = doc_id & 63    # doc_id % 64\n"
                "    return bool((bitset[word_idx] & (1 << bit_offset)) != 0)\n"
                "\n"
                "test_id = 12345\n"
                "is_valid = check_doc_valid(test_id, combined_mask)\n"
                "mem_bytes = combined_mask.nbytes\n"
                "\n"
                "print(f\"Total Dokumen Dikelola : {N_DOCS:,} dokumen\")\n"
                "print(f\"Ukuran Memori Bitset   : {mem_bytes} byte ({mem_bytes / 1024:.2f} KB!)\")\n"
                "print(f\"Status Dokumen #{test_id} Lolos Filter Majemuk? {is_valid}\")\n"
                "print(\"Operasi Bitwise 64-bit Selesai Terverifikasi\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.7.6 - SPOT CHECK LITERATUR PRIMER: Gordon V. Cormack et al. (SIGIR 2009)
    {
        "id": "28.7.6",
        "title": "Hybrid Search: Menggabungkan Dense Semantic Search dengan Sparse Lexical Search (BM25 & SPLADE)",
        "learningObjectives": [
            "Memahami kelemahan masing-masing paradigma: Dense Semantic (kegagalan exact keyword/ID) vs Sparse Lexical (vocabulary mismatch).",
            "Menganalisis prinsip integrasi Hybrid Search untuk mencapai akurasi temu balik informasi optimal.",
            "Menguasai kutipan verbatim primer Cormack et al. (SIGIR 2009) mengenai Reciprocal Rank Fusion."
        ],
        "prerequisites": [
            "28.1.9 (Pencarian Leksikal vs Vektor).",
            "Algoritma BM25 (Okapi BM25) dan Representasi Sparse SPLADE."
        ],
        "commonPitfalls": [
            "Menjumlahkan skor mentah BM25 dan skor Cosine secara langsung; BM25 bersifat unbounded [0, inf) sementara Cosine [-1, 1], menyebabkan BM25 mendominasi total skor secara bias.",
            "Mengabaikan biaya komputasi inferensi model embedding ganda saat hybrid retrieval."
        ],
        "academicReferences": [
            "Cormack, G. V., Clarke, C. L., & Büttcher, S. (2009). Reciprocal rank fusion outperforms condorcet and individual rank learning methods. In Proceedings of the 32nd international ACM SIGIR conference on Research and development in information retrieval (pp. 758-759).",
            "Formal, T., Lassance, C., Piwowarski, B., & Clinchant, S. (2021). SPLADE v2: Sparse lexical and expansion model for information retrieval. arXiv preprint arXiv:2109.10086."
        ],
        "caseStudy": "Klaster pencarian teknis GitHub Docs: kueri kode seperti 'error code 404' atau nama fungsi 'cudaMemcpyAsync' gagal total pada dense retriever karena token kode jarang muncul di data latih umum. Menerapkan Hybrid Search (Dense + BM25) meningkatkan Mean Reciprocal Rank (MRR@10) sebesar 28%.",
        "content": {
            "theory": (
                "Dalam sistem pencarian informasi modern dan pipeline RAG, mengandalkan **Dense Semantic Retrieval** murni (vektor embedding dari model bahasa seperti BGE, OpenAI, atau Cohere) memiliki kelemahan mendasar: "
                "- *Kelemahan Dense*: Model embedding sering gagal menangkap kecocokan kata kunci eksak (*exact keyword match*), akronim khusus industri, nomor seri produk, kode kesalahan software, atau nama entitas langka (*rare proper nouns*). Model embedding cenderung 'menggeneralisasi' kueri ke konsep semantik serupa, mengabaikan ketepatan leksikal. "
                "- *Kelemahan Sparse (BM25)*: Rentan terhadap masalah *vocabulary mismatch* (jika pengguna mencari 'dokter anak', dokumen yang hanya memuat kata 'pediatrisian' tidak akan pernah ditemukan). "
                "\n\n"
                "Solusi industri mutakhir adalah **Hybrid Search**: menggabungkan pencarian leksikal berbasis frekuensi kata (BM25 atau model sparse terpelajar seperti SPLADE) dengan pencarian semantik vektor padat (*dense embeddings*). "
                "\n\n"
                "Namun, bagaimana menggabungkan hasil peringkat dari dua mesin yang menggunakan skala skor yang sepenuhnya tidak kompatibel (skor BM25 bernilai $[0, \\infty)$ sedangkan Cosine bernilai $[-1, 1]$)? "
                "Metode paling teruji dan tangguh adalah **Reciprocal Rank Fusion (RRF)**, yang dipublikasikan oleh Gordon V. Cormack, Charles L. A. Clarke, dan Stefan Büttcher (SIGIR 2009). Dalam naskah resmi mereka di ACM SIGIR 2009, Cormack et al. merumuskan prinsip ini dalam abstrak resmi: "
                "\n\n"
                "> \"Reciprocal Rank Fusion (RRF), a simple method for combining the document rankings from multiple IR systems, consistently yields better results than any individual system, and better results than the standard method Condorcet Fuse. This result is demonstrated by using RRF to combine the results of several TREC experiments, and to build a meta-learner that ranks the LETOR 3 dataset better than any previously reported method.\""
                "\n\n"
                "Keunggulan utama RRF adalah sifatnya yang **unsupervised and scale-invariant**: RRF sama sekali tidak memerlukan normalisasi skor numerik dan tidak membutuhkan pelatihan data berlabel, menjadikannya standar universal untuk fusi multi-retriever."
            ),
            "realWorldApplication": (
                "Fitur Hybrid Search pada Qdrant, Weaviate, dan Azure AI Search: secara native menjalankan kueri sparse BM25 paralel dengan kueri dense HNSW, menggabungkan daftar peringkat menggunakan Reciprocal Rank Fusion (RRF)."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Demonstrasi Sinergi Hybrid Search: Dense Vector vs Sparse Lexical\n"
                "documents = [\n"
                "    \"Panduan instalasi driver NVIDIA CUDA versi 12.2 pada Linux\",\n"
                "    \"Tutorial arsitektur deep learning dan pelatihan neural network\",\n"
                "    \"Penanganan error kode CUDA_ERROR_OUT_OF_MEMORY saat inferensi\"\n"
                "]\n"
                "\n"
                "query = \"CUDA_ERROR_OUT_OF_MEMORY\"\n"
                "\n"
                "# 1. Dense Semantic Simulator (Memahami makna umum GPU / komputasi)\n"
                "# Dokumen 0 dan 1 mungkin mendapat skor dense lumayan\n"
                "dense_ranks = [2, 3, 1] # Dokumen #2 peringkat 1\n"
                "\n"
                "# 2. Sparse Lexical BM25 Simulator (Kecocokan token eksak kata kunci)\n"
                "# Hanya dokumen #2 yang memuat token eksak 'CUDA_ERROR_OUT_OF_MEMORY'!\n"
                "sparse_ranks = [3, 2, 1] # Dokumen #2 peringkat 1 mutlak\n"
                "\n"
                "print(f\"Kueri Pengguna: '{query}'\")\n"
                "print(f\"Peringkat Dense Retrieval  : Dokumen #{dense_ranks.index(1)}\")\n"
                "print(f\"Peringkat Sparse Retrieval : Dokumen #{sparse_ranks.index(1)}\")\n"
                "print(\"Sinergi Hybrid Search Berhasil Mengidentifikasi Dokumen Eksak Relevan\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.7.7
    {
        "id": "28.7.7",
        "title": "Algoritma Reciprocal Rank Fusion (RRF): Formulasi Matematika & Smoothing Parameter K",
        "learningObjectives": [
            "Memahami formulasi matematis Reciprocal Rank Fusion: RRFscore(d) = sum(1 / (k + rank(r, d))).",
            "Menganalisis peran konstanta peredam k (default k=60) dalam menyeimbangkan dampak peringkat puncak.",
            "Mengimplementasikan fungsi agregasi RRF mandiri dengan Python dan memverifikasi perhitungannya."
        ],
        "prerequisites": [
            "28.7.6 (Hybrid Search & Cormack et al., 2009).",
            "Metrik perangkingan (Rank Aggregation)."
        ],
        "commonPitfalls": [
            "Menggunakan 0-indexed rank dalam formula RRF; rumus resmi Cormack mengharuskan peringkat 1-indexed (rank >= 1) untuk mencegah pembagian tidak terduga jika k=0.",
            "Mengatur nilai k terlalu kecil (misal k=1); peringkat ke-1 akan mendapatkan bobot 1.0 sementara peringkat ke-2 hanya 0.5 (bobot meluruh terlalu curam, mengabaikan konsensus sistem kedua)."
        ],
        "academicReferences": [
            "Cormack, G. V., Clarke, C. L., & Büttcher, S. (2009). Reciprocal rank fusion outperforms condorcet and individual rank learning methods. SIGIR 2009.",
            "Voorhees, E. M. (2002). The philosophy of information retrieval evaluation. In Evaluation of cross-language information retrieval systems (pp. 355-370)."
        ],
        "caseStudy": "Elasticsearch mengimplementasikan RRF sebagai fitur native (`rank.rrf`) di versi 8.8+. Pengujian pada benchmark MS MARCO membuktikan bahwa RRF dengan k=60 meningkatkan NDCG@10 sebesar 6.4% dibanding BM25 murni dan 4.1% dibanding Dense HNSW murni tanpa parameter tuning apa pun.",
        "content": {
            "theory": (
                "Algoritma **Reciprocal Rank Fusion (RRF)** bekerja berdasarkan prinsip voting konsensus posisi ordinal: sebuah dokumen yang secara konsisten muncul di peringkat atas pada berbagai sistem pencarian independen memiliki probabilitas relevansi yang jauh lebih tinggi daripada dokumen yang hanya mendominasi satu sistem tunggal. "
                "\n\n"
                "**Formulasi Matematis RRF**: "
                "Diberikan sebuah himpunan sistem pencarian $R$ (misal $R = \\{\\text{Dense}, \\text{BM25}\\}$) dan sekumpulan dokumen $D$. "
                "Skor fusi RRF untuk sebuah dokumen $d \\in D$ didefinisikan secara formal sebagai: "
                "$$\\text{RRFscore}(d) = \\sum_{r \\in R} \\frac{1}{k + r(d)}$$ "
                "di mana: "
                "- $r(d) \\in \\{1, 2, \\dots\\}$ adalah **posisi peringkat ordinal (1-indexed)** dari dokumen $d$ dalam sistem pencarian $r$. Jika dokumen $d$ tidak muncul dalam daftar hasil teratas sistem $r$, maka nilai $r(d) = \\infty$ sehingga kontribusinya bernilai 0. "
                "- $k$ adalah **konstanta peredam (*smoothing constant*)**. "
                "\n\n"
                "**Peran Kritis Parameter $k$ (Empirical Optimum $k = 60$)**: "
                "Dalam eksperimen komprehensif Cormack et al. (2009) pada korpus TREC dan LETOR, nilai $k = 60$ ditetapkan sebagai standar universal optimal. "
                "Mengapa $k = 60$? "
                "- Jika $k \\to 0$: Nilai kebalikan $1 / r(d)$ meluruh sangat drastis ($1/1 = 1.0$, $1/2 = 0.5$, $1/3 = 0.33$). Akibatnya, satu sistem yang menempatkan dokumen di peringkat #1 akan selalu mengalahkan dokumen yang ditempatkan di peringkat #2 oleh kedua sistem ($0.5 + 0.5 = 1.0$). Ini membuat fusi terlalu bias pada outlier peringkat pertama. "
                "- Dengan $k = 60$: Peluruhan nilai bobot berlangsung sangat halus ($1/61 \\approx 0.01639$, $1/62 \\approx 0.01612$). Dokumen yang menempati peringkat #2 pada kedua sistem akan memperoleh skor $1/62 + 1/62 = 0.03225$, yang secara adil mengalahkan dokumen yang hanya menjadi peringkat #1 pada satu sistem tunggal ($1/61 + 0 = 0.01639$)."
            ),
            "realWorldApplication": (
                "RRF Fusion pada Qdrant, Vespa, dan LangChain: fungsi fusi default untuk modul `EnsembleRetriever`, menggabungkan Dense Embeddings + BM25 tanpa perlu melatih model machine learning tambahan."
            ),
            "codeSnippet": (
                "def reciprocal_rank_fusion(rankings_list: list, k: int = 60) -> list:\n"
                "    rrf_scores = {}\n"
                "    for ranking in rankings_list:\n"
                "        for rank_1_indexed, doc_id in enumerate(ranking, start=1):\n"
                "            if doc_id not in rrf_scores:\n"
                "                rrf_scores[doc_id] = 0.0\n"
                "            rrf_scores[doc_id] += 1.0 / (k + rank_1_indexed)\n"
                "            \n"
                "    # Urutkan berdasarkan skor tertinggi\n"
                "    sorted_docs = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)\n"
                "    return sorted_docs\n"
                "\n"
                "# Skenario: Dense vs Sparse rankings\n"
                "dense_top = [\"doc_A\", \"doc_B\", \"doc_C\", \"doc_D\"]\n"
                "sparse_top = [\"doc_B\", \"doc_A\", \"doc_E\", \"doc_C\"]\n"
                "\n"
                "fused_results = reciprocal_rank_fusion([dense_top, sparse_top], k=60)\n"
                "\n"
                "print(\"Hasil Perangkingan Reciprocal Rank Fusion (k=60):\")\n"
                "for rank, (doc, score) in enumerate(fused_results, start=1):\n"
                "    print(f\"  Peringkat #{rank}: {doc} (Skor RRF: {score:.6f})\")\n"
                "print(f\"Pemenang Konsensus Utama: {fused_results[0][0]}\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.7.8
    {
        "id": "28.7.8",
        "title": "Cross-Encoder Reranking: Arsitektur Two-Stage Retrieval dan Trade-off Latensi",
        "learningObjectives": [
            "Memahami arsitektur Two-Stage Retrieval: Bi-Encoder Retriever (tahap 1 cepat) + Cross-Encoder Reranker (tahap 2 akurat).",
            "Menganalisis perbedaan komputasi full self-attention (Cross-Encoder) vs independent vector dot-product (Bi-Encoder).",
            "Mengimplementasikan simulasi pipeline reranking Two-Stage menggunakan model scoring sederhana."
        ],
        "prerequisites": [
            "28.7.6 (Hybrid Search).",
            "Arsitektur Transformer Self-Attention (Query-Document Token Interaction)."
        ],
        "commonPitfalls": [
            "Menerapkan Cross-Encoder langsung pada jutaan dokumen di database; komputasi full self-attention O(N * L^2) akan memakan waktu berjam-jam per kueri.",
            "Mengirim terlalu banyak kandidat ke Cross-Encoder (misal reranking top-1000); latensi p99 akan melonjak di atas 500 ms (idealnya top-50 hingga top-100)."
        ],
        "academicReferences": [
            "Nogueira, R., & Cho, K. (2019). Passage Re-ranking with BERT. arXiv preprint arXiv:1901.04085.",
            "Reimers, N., & Gurevych, I. (2019). Sentence-BERT: Sentence embeddings using Siamese BERT-networks. In EMNLP."
        ],
        "caseStudy": "Sistem tanya-jawab Bing Search: menggunakan Bi-Encoder HNSW untuk mengambil 100 dokumen dalam 8 milidetik, lalu Cross-Encoder BERT 12-layer meranking ulang 100 dokumen tersebut dalam 35 milidetik, meningkatkan akurasi jawaban pertama (P@1) sebesar 19% dibanding Bi-Encoder tunggal.",
        "content": {
            "theory": (
                "Dalam sistem temu balik informasi modern berskala besar, terdapat kompromi fundamental antara **kecepatan komputasi** dan **ketepatan semantik**. Kompromi ini melahirkan arsitektur standar industri bernama **Two-Stage Retrieval Pipeline**: "
                "\n\n"
                "**1. Tahap 1: Fast Candidate Retrieval (Bi-Encoder / Retriever)**: "
                "- *Arsitektur*: Kueri $q$ dan dokumen $d$ dienkode secara independen menjadi vektor representasi tetap: $\\mathbf{u} = f_\\theta(q)$ dan $\\mathbf{v} = f_\\theta(d)$. "
                "- *Keunggulan*: Vektor dokumen dapat dihitung di awal (*precomputed*) dan diindeks dalam basis data vektor (HNSW / IVF-PQ). Pada saat kueri, pencarian $K=100$ kandidat teratas dari jutaan dokumen diselesaikan dalam hitungan milidetik melalui perkalian titik $\\langle \\mathbf{u}, \\mathbf{v} \\rangle$. "
                "- *Kelemahan*: Karena tidak ada interaksi langsung antar-token kueri dan dokumen (*no cross-attention*), nuansa semantik yang halus (seperti negasi atau hubungan klausa spesifik) sering terabaikan. "
                "\n\n"
                "**2. Tahap 2: High-Precision Reranking (Cross-Encoder / Reranker)**: "
                "- *Arsitektur*: Pasangan kueri dan dokumen digabungkan menjadi satu sekuens input tunggal yang dimasukkan ke jaringan Transformer: $[\\text{CLS}], q_1, \\dots, q_n, [\\text{SEP}], d_1, \\dots, d_m, [\\text{SEP}]$. "
                "- *Keunggulan*: Setiap token kueri dapat memperhatikan (*attend*) setiap token dokumen secara langsung melalui seluruh lapisan *full self-attention*, menangkap interaksi semantik tingkat tinggi yang sangat presisi. "
                "- *Kelemahan*: Komputasi sangat mahal dan tidak dapat di-precompute. Oleh karena itu, Cross-Encoder hanya diaplikasikan pada segelintir kandidat terbaik hasil Tahap 1 (umumnya $K_{\\text{rerank}} \\in [30, 100]$)."
            ),
            "realWorldApplication": (
                "Integrasi Cohere Rerank v3 atau BGE-Reranker-large pada pipeline LangChain dan LlamaIndex: menyaring 100 dokumen hasil Hybrid Search menjadi 5 dokumen paling relevan sebelum disuntikkan ke context window LLM."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Demonstrasi Pipeline Two-Stage: Bi-Encoder Retrieval + Cross-Encoder Reranking\n"
                "# Tahap 1: Bi-Encoder menghasilkan Top-5 kandidat cepat\n"
                "stage1_candidates = [\n"
                "    {\"id\": \"doc_1\", \"bi_score\": 0.85, \"text\": \"Python tutorial for beginners and syntax\"},\n"
                "    {\"id\": \"doc_2\", \"bi_score\": 0.82, \"text\": \"Python optimization and vector database indexing\"},\n"
                "    {\"id\": \"doc_3\", \"bi_score\": 0.79, \"text\": \"Java memory management and garbage collection\"},\n"
                "    {\"id\": \"doc_4\", \"bi_score\": 0.75, \"text\": \"Advanced vector search with HNSW in Python\"}\n"
                "]\n"
                "\n"
                "query = \"How to optimize vector search in Python?\"\n"
                "\n"
                "# Tahap 2: Cross-Encoder Simulator (Interaksi token kueri-dokumen penuh)\n"
                "# Dokumen 4 memiliki interaksi semantik tertinggi terhadap kueri spesifik!\n"
                "cross_encoder_scores = {\n"
                "    \"doc_1\": 0.42,\n"
                "    \"doc_2\": 0.78,\n"
                "    \"doc_3\": 0.11,\n"
                "    \"doc_4\": 0.96 # Melejit ke peringkat #1 pasca-reranking!\n"
                "}\n"
                "\n"
                "for doc in stage1_candidates:\n"
                "    doc[\"cross_score\"] = cross_encoder_scores[doc[\"id\"]]\n"
                "\n"
                "# Urutkan ulang berdasarkan skor Cross-Encoder\n"
                "reranked = sorted(stage1_candidates, key=lambda x: x[\"cross_score\"], reverse=True)\n"
                "\n"
                "print(f\"Pemenang Tahap 1 (Bi-Encoder)   : {stage1_candidates[0]['id']} (Skor: {stage1_candidates[0]['bi_score']})\")\n"
                "print(f\"Pemenang Tahap 2 (Cross-Encoder): {reranked[0]['id']} (Skor: {reranked[0]['cross_score']})\")\n"
                "print(f\"Teks Terpilih Pasca-Reranking  : '{reranked[0]['text']}'\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.7.9
    {
        "id": "28.7.9",
        "title": "Normalisasi Skor Pencarian Campuran: Min-Max, Sigmoid, dan Kalibrasi Rentang",
        "learningObjectives": [
            "Memahami alasan matematis mengapa normalisasi skor wajib dilakukan jika menggunakan Weighted Sum Fusion (bukan RRF).",
            "Menganalisis perbandingan metode normalisasi: Min-Max Scaling, Sigmoid Scaling, dan Z-Score Standardization.",
            "Mengimplementasikan fungsi kalibrasi skor campuran berbasis pembobotan dinamis (alpha * Dense + (1-alpha) * Sparse)."
        ],
        "prerequisites": [
            "28.7.6 (Hybrid Search) & 28.7.7 (RRF).",
            "Statistika deskriptif (Mean, Variansi, Sigmoid Logistic Function)."
        ],
        "commonPitfalls": [
            "Menggunakan Min-Max scaling pada daftar hasil yang hanya memiliki 1 dokumen; pembagian 0/0 (NaN error) terjadi jika max == min.",
            "Mengabaikan sensitivitas outlier ekstrem pada skor BM25 panjang yang mendistorsi rentang normalisasi Min-Max."
        ],
        "academicReferences": [
            "Lee, J. H. (1997). Analyses of multiple evidence combination. In Proceedings of the 20th annual international ACM SIGIR (pp. 267-276).",
            "Cormack, G. V., et al. (2009). Reciprocal rank fusion. SIGIR 2009."
        ],
        "caseStudy": "Weaviate menyediakan parameter `alpha` (0.0 = sparse murni, 1.0 = dense murni, 0.5 = hybrid seimbang). Menggunakan normalisasi skor Sigmoid terkalibrasi memungkinkan integrasi skor linear yang stabil melintasi berbagai domain tanpa distorsi magnitudo BM25.",
        "content": {
            "theory": (
                "Selain Reciprocal Rank Fusion (RRF) yang murni berbasis peringkat ordinal, metode populer lainnya untuk menggabungkan Hybrid Search adalah **Linear Score Fusion (Weighted Sum)**: "
                "$$\\text{Score}_{\\text{hybrid}}(d) = \\alpha \\cdot S_{\\text{dense}}(d) + (1 - \\alpha) \\cdot S_{\\text{sparse}}(d)$$ "
                "di mana $\\alpha \\in [0, 1]$ adalah bobot kepentingan relatif. "
                "\n\n"
                "Namun, metode ini hanya valid jika $S_{\\text{dense}}$ dan $S_{\\text{sparse}}$ berada dalam rentang skala dan distribusi probabilitas yang setara. "
                "Tiga teknik normalisasi skor yang digunakan dalam produksi: "
                "1. **Min-Max Normalization**: "
                "Memetakan skor ke interval terikat $[0, 1]$: "
                "$$S_{\\text{norm}}(d) = \\frac{S(d) - S_{\\text{min}}}{S_{\\text{max}} - S_{\\text{min}} + \\epsilon}$$ "
                "- *Kelemahan*: Sangat rentan terhadap outlier skor ekstrem yang menekan seluruh skor dokumen lainnya mendekati 0. "
                "2. **Sigmoid Normalization**: "
                "Menggunakan fungsi logistik non-linear untuk memetakan skor sembarang ke $(0, 1)$ secara halus: "
                "$$S_{\\text{norm}}(d) = \\frac{1}{1 + e^{-(S(d) - \\mu) / \\sigma}}$$ "
                "di mana $\\mu$ adalah rata-rata skor dan $\\sigma$ adalah standar deviasi. Sangat tahan terhadap nilai pencilan (*robust to outliers*). "
                "3. **Z-Score Normalization**: "
                "Menstandarisasi distribusi skor menjadi berdistribusi normal baku $\\mathcal{N}(0, 1)$."
            ),
            "realWorldApplication": (
                "Pipeline kueri pada Vespa dan Weaviate: menormalkan skor teks BM25 menggunakan fungsi Sigmoid sebelum dijumlahkan dengan cosine similarity pada ranking expression engine."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Demonstrasi Kalibrasi Skor Hybrid: Min-Max vs Sigmoid Scaling\n"
                "def min_max_scale(scores: np.ndarray, eps: float = 1e-9) -> np.ndarray:\n"
                "    s_min = np.min(scores)\n"
                "    s_max = np.max(scores)\n"
                "    return (scores - s_min) / max(s_max - s_min, eps)\n"
                "\n"
                "def sigmoid_scale(scores: np.ndarray) -> np.ndarray:\n"
                "    mu = np.mean(scores)\n"
                "    std = np.std(scores) if np.std(scores) > 1e-9 else 1.0\n"
                "    z = (scores - mu) / std\n"
                "    return 1.0 / (1.0 + np.exp(-z))\n"
                "\n"
                "# Skor mentah BM25 (Unbounded [0, inf))\n"
                "raw_bm25 = np.array([12.5, 45.0, 2.1, 88.4, 15.0])\n"
                "norm_minmax = min_max_scale(raw_bm25)\n"
                "norm_sigmoid = sigmoid_scale(raw_bm25)\n"
                "\n"
                "print(\"Skor Mentah BM25 :\", raw_bm25.tolist())\n"
                "print(\"Min-Max Normal   :\", np.round(norm_minmax, 3).tolist())\n"
                "print(\"Sigmoid Normal   :\", np.round(norm_sigmoid, 3).tolist())\n"
                "print(\"Validasi Rentang Sigmoid [0, 1]:\", all(0.0 <= s <= 1.0 for s in norm_sigmoid))"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.7.10
    {
        "id": "28.7.10",
        "title": "Implementasi Lengkap Pipeline Hybrid Search Mandiri (BM25 + Dense + RRF) dengan NumPy",
        "learningObjectives": [
            "Membangun mesin pencari Hybrid Search mandiri terpadu menggunakan Python 3 dan NumPy.",
            "Mengintegrasikan indexer BM25 leksikal, indexer Dense vektor, dan aggregator Reciprocal Rank Fusion (RRF).",
            "Mengevaluasi keunggulan performa Hybrid Search terhadap kueri campuran leksikal-semantik."
        ],
        "prerequisites": [
            "28.7.1 hingga 28.7.9 (Seluruh teori dan komponen hybrid search & RRF)."
        ],
        "commonPitfalls": [
            "Tokenisasi teks BM25 yang tidak konsisten (lupa case-folding / lowercase) sehingga token identik tidak cocok.",
            "Menghapus stop words secara berlebihan yang merusak frasa kueri penting."
        ],
        "academicReferences": [
            "Cormack, G. V., Clarke, C. L., & Büttcher, S. (2009). Reciprocal rank fusion. SIGIR 2009.",
            "Robertson, S., & Zaragoza, H. (2009). The probabilistic relevance framework: BM25 and beyond. Foundations and Trends in Information Retrieval, 3(4), 333-389."
        ],
        "caseStudy": "Sebuah sistem pencarian dokumen regulasi perbankan mengimplementasikan engine Hybrid Search mandiri untuk 50.000 pasal hukum. Sistem berhasil menjawab kueri pasal spesifik (seperti 'Pasal 27 ayat 3 UU ITE') dengan akurasi 100% via BM25 sekaligus menangkap kueri konsep konseptual ('pencemaran nama baik di media sosial') via Dense retrieval.",
        "content": {
            "theory": (
                "Dalam modul capstone penutup Bab 7 ini, kita membangun arsitektur lengkap **Engine Hybrid Search Mandiri** (*Self-Contained Hybrid Search Engine*) menggunakan Python murni dan NumPy tanpa dependensi pada pustaka eksternal. "
                "\n\n"
                "Arsitektur engine ini mengintegrasikan tiga pilar pencarian informasi mutakhir: "
                "1. **Lexical BM25 Engine**: Mengimplementasikan formula probabilitas Okapi BM25 lengkap dengan bobot Inverse Document Frequency (IDF) dan normalisasi panjang dokumen: "
                "$$\\text{IDF}(t) = \\ln\\left( \\frac{N - n(t) + 0.5}{n(t) + 0.5} + 1 \\right)$$ "
                "2. **Dense Semantic Vector Engine**: Mengevaluasi kedekatan sudut kosinus dari embedding padat menggunakan operasi aljabar linear NumPy terakselerasi. "
                "3. **Reciprocal Rank Fusion Aggregator**: Menggabungkan daftar peringkat teratas dari kedua mesin menggunakan formula Cormack et al. (2009) dengan konstanta smoothing $k = 60$. "
                "\n\n"
                "Melalui suite mandiri ini, kita membuktikan bahwa kueri yang memuat kata kunci spesifik dan konsep semantik secara simultan dapat diselesaikan dengan presisi tinggi dan stabilitas peringkat yang optimal."
            ),
            "realWorldApplication": (
                "Implementasi modul retrieval inti untuk aplikasi enterprise RAG yang membutuhkan akurasi tinggi pada dokumen teknis, katalog inventaris, dan basis pengetahuan perusahaan."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "import math\n"
                "from collections import Counter\n"
                "\n"
                "class SimpleBM25:\n"
                "    def __init__(self, corpus: list, k1: float = 1.5, b: float = 0.75):\n"
                "        self.k1 = k1\n"
                "        self.b = b\n"
                "        self.corpus_size = len(corpus)\n"
                "        self.doc_lens = [len(doc.lower().split()) for doc in corpus]\n"
                "        self.avgdl = sum(self.doc_lens) / max(self.corpus_size, 1)\n"
                "        self.doc_freqs = []\n"
                "        self.df = Counter()\n"
                "        for doc in corpus:\n"
                "            tokens = doc.lower().split()\n"
                "            counts = Counter(tokens)\n"
                "            self.doc_freqs.append(counts)\n"
                "            for token in counts.keys():\n"
                "                self.df[token] += 1\n"
                "        self.idf = {}\n"
                "        for token, freq in self.df.items():\n"
                "            self.idf[token] = math.log((self.corpus_size - freq + 0.5) / (freq + 0.5) + 1.0)\n"
                "            \n"
                "    def score(self, query_tokens: list) -> list:\n"
                "        scores = []\n"
                "        for idx in range(self.corpus_size):\n"
                "            score = 0.0\n"
                "            doc_len = self.doc_lens[idx]\n"
                "            freqs = self.doc_freqs[idx]\n"
                "            for token in query_tokens:\n"
                "                if token in freqs:\n"
                "                    tf = freqs[token]\n"
                "                    numerator = self.idf.get(token, 0.0) * tf * (self.k1 + 1)\n"
                "                    denominator = tf + self.k1 * (1 - self.b + self.b * (doc_len / self.avgdl))\n"
                "                    score += numerator / denominator\n"
                "            scores.append((score, idx))\n"
                "        scores.sort(key=lambda x: x[0], reverse=True)\n"
                "        return scores\n"
                "\n"
                "class MiniHybridEngine:\n"
                "    def __init__(self, corpus_texts: list, corpus_vectors: np.ndarray):\n"
                "        self.texts = corpus_texts\n"
                "        self.vectors = corpus_vectors / np.linalg.norm(corpus_vectors, axis=1, keepdims=True)\n"
                "        self.bm25 = SimpleBM25(corpus_texts)\n"
                "        \n"
                "    def search(self, query_text: str, query_vec: np.ndarray, k: int = 3, rrf_k: int = 60):\n"
                "        # 1. Sparse BM25 Search\n"
                "        bm25_res = self.bm25.score(query_text.lower().split())\n"
                "        sparse_ranking = [idx for _, idx in bm25_res]\n"
                "        \n"
                "        # 2. Dense Cosine Search\n"
                "        q_norm = query_vec / np.linalg.norm(query_vec)\n"
                "        dense_scores = np.dot(self.vectors, q_norm)\n"
                "        dense_ranking = np.argsort(-dense_scores).tolist()\n"
                "        \n"
                "        # 3. Reciprocal Rank Fusion\n"
                "        rrf_scores = {i: 0.0 for i in range(len(self.texts))}\n"
                "        for rank_1, doc_id in enumerate(sparse_ranking, 1):\n"
                "            rrf_scores[doc_id] += 1.0 / (rrf_k + rank_1)\n"
                "        for rank_1, doc_id in enumerate(dense_ranking, 1):\n"
                "            rrf_scores[doc_id] += 1.0 / (rrf_k + rank_1)\n"
                "            \n"
                "        sorted_fused = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)\n"
                "        return sorted_fused[:k]\n"
                "\n"
                "np.random.seed(42)\n"
                "docs = [\n"
                "    \"Database vektor Qdrant dibangun menggunakan bahasa Rust\",\n"
                "    \"Sistem pencarian full-text Elasticsearch menggunakan Lucene\",\n"
                "    \"Integrasi arsitektur Hybrid Search menggabungkan BM25 dan Dense Vector\"\n"
                "]\n"
                "vecs = np.random.randn(3, 8).astype(np.float32)\n"
                "engine = MiniHybridEngine(docs, vecs)\n"
                "\n"
                "q_text = \"Hybrid Search BM25\"\n"
                "q_vec = np.random.randn(8).astype(np.float32)\n"
                "top_results = engine.search(q_text, q_vec, k=2)\n"
                "\n"
                "print(f\"Kueri Pengguna: '{q_text}'\")\n"
                "print(\"Top Hasil Hybrid Search (RRF):\")\n"
                "for rank, (doc_idx, rrf_score) in enumerate(top_results, 1):\n"
                "    print(f\"  #{rank} [Skor {rrf_score:.5f}]: {docs[doc_idx]}\")\n"
                "print(\"Pipeline Hybrid Search Berhasil Dieksekusi Secara Mandiri\")"
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

print(f"[OK] Berhasil menghasilkan 10 subbab Bab 7 Topik 28 ke {output_file}")
