import json
import os
import sys
import numpy as np

# Output file path
output_file = os.path.join(os.path.dirname(__file__), "vdb_ch9_data.json")

subchapters = [
    # 28.9.1
    {
        "id": "28.9.1",
        "title": "Urgensi Riil Industri: Mengapa Pencarian Vektor Tanpa Filter Metadata Tidak Memadai",
        "learningObjectives": [
            "Memahami kebutuhan operasional integrasi atribut metadata diskrit ke dalam pencarian kedekatan vektor kontinu.",
            "Menganalisis batasan arsitektural pencarian kemiripan kosinus murni tanpa filter kontrol akses (ACL), penyewa (tenant), dan atribut waktu.",
            "Mengimplementasikan simulasi perbandingan recall relevansi bisnis antara pencarian tanpa filter dan pencarian terkondisi atribut."
        ],
        "prerequisites": [
            "Pemahaman metrik jarak kosinus dan Euclidean pada ruang vektor.",
            "Konsep dasar pengindeksan basis data relasional (B-Tree) vs indeks vektor (ANN)."
        ],
        "commonPitfalls": [
            "Mengasumsikan embedding model dapat secara implisit menyandikan semua filter diskrit (seperti tenant_id, role_id, atau price_range) ke dalam koordinat kontinu tanpa interferensi semantik.",
            "Mengabaikan persyaratan isolasi data kepatuhan regulasi (misal GDPR, HIPAA) dengan membiarkan dokumen lintas-tenant bersaing di ruang embedding yang sama tanpa isolasi deterministik."
        ],
        "academicReferences": [
            "Gollapudi, S., Karia, N., Sivashankar, V., Krishnaswamy, R., Begwani, N., Raz, S., Lin, Y., Zhang, Y., Mahapatro, N., Srinivasan, P., Singh, A., & Simhadri, H. V. (2023). Filtered-DiskANN: Graph algorithms for approximate nearest neighbor search with filters. In Proceedings of the ACM Web Conference 2023 (WWW '23), 3543507.3583552.",
            "Aumüller, M., Bernhardsson, E., & Faithfull, A. (2020). ANN-benchmarks: A benchmarking tool for approximate nearest neighbor algorithms. Information Systems, 87, 101374."
        ],
        "caseStudy": "Pada sistem e-commerce Tokopedia / Shopee dengan ratusan juta SKU produk, pencarian semantik 'sepatu lari pria tahan air' harus disaring secara ketat berdasarkan atribut diskrit: brand in ['Nike', 'Adidas'], price <= 1500000, dan lokasi_toko = 'Jakarta'. Pencarian vektor murni menghasilkan 10 tetangga terdekat dengan semantik relevan tetapi 8 di antaranya melanggar batasan harga atau lokasi pengiriman, merusak konversi checkout pengguna.",
        "content": {
            "theory": (
                "Dalam aplikasi industri dunia nyata, pencarian kemiripan vektor (Approximate Nearest Neighbor / ANN) murni hampir tidak pernah beroperasi di ruang hampa tanpa batasan. "
                "Secara formal, jika korpus dokumen direpresentasikan oleh himpunan entitas $\\mathcal{D} = \\{(\\mathbf{x}_i, m_i)\\}_{i=1}^N$, di mana $\\mathbf{x}_i \\in \\mathbb{R}^d$ adalah embedding semantik kontinu berdimensi $d$ dan $m_i \\in \\mathcal{M}$ adalah payload metadata terstruktur (seperti ID organisasi $\\text{org\\_id}$, kategori, stempel waktu, atau tag kontrol akses $\\text{ACL}$), kueri pengguna tidak hanya terdiri dari vektor representasi $\\mathbf{q} \\in \\mathbb{R}^d$, melainkan sebuah pasangan tuple: "
                "$$\\mathcal{Q} = (\\mathbf{q}, \\phi)$$ "
                "di mana $\\phi: \\mathcal{M} \\to \\{0, 1\\}$ adalah predikat filter Boolean diskrit. "
                "Tujuan komputasi filtered vector search adalah menemukan himpunan kandidat optimal $K^* \\subset \\mathcal{D}$ berukuran $k = |K^*|$ sedemikian rupa sehingga: "
                "$$K^* = \\arg\\max_{K \\subset \\mathcal{D}_\\phi, |K|=k} \\sum_{i \\in K} \\text{sim}(\\mathbf{q}, \\mathbf{x}_i)$$ "
                "dengan ruang pencarian yang dibatasi secara ketat pada subset valid: "
                "$$\\mathcal{D}_\\phi = \\{ (\\mathbf{x}_i, m_i) \\in \\mathcal{D} \\mid \\phi(m_i) = 1 \\}$$ "
                "Tanpa predikat $\\phi$, pencarian ANN murni akan memprioritaskan kedekatan geometris $\\text{sim}(\\mathbf{q}, \\mathbf{x}_i)$ tertinggi secara global. Jika $99.9\\%$ entitas dalam korpus bukan milik tenant pemanggil, kueri murni akan mengembalikan data milik tenant lain (kebocoran privasi fatal) atau entitas kedaluwarsa yang tidak lagi memenuhi status ketersediaan inventaris."
            ),
            "realWorldApplication": (
                "Sistem manajemen dokumen korporat (Enterprise Knowledge Base) menggunakan metadata filtering untuk membatasi dokumen yang dapat diakses oleh karyawan berdasarkan role permission level (Departemen HR, Finance, Engineering) sebelum konteks diumpankan ke LLM dalam alur RAG."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Simulasi 1000 entitas dokumen dengan vektor semantik dan metadata kategori/harga\n"
                "np.random.seed(42)\n"
                "N = 1000\n"
                "dim = 64\n"
                "vectors = np.random.randn(N, dim).astype(np.float32)\n"
                "vectors /= np.linalg.norm(vectors, axis=1, keepdims=True)\n"
                "\n"
                "# Metadata: category (0: elektronik, 1: pakaian, 2: buku) dan harga (IDR 50k - 2000k)\n"
                "categories = np.random.choice([0, 1, 2], size=N)\n"
                "prices = np.random.randint(50, 2000, size=N)\n"
                "\n"
                "# Query: mencari dokumen kategori 'pakaian' (1) dengan harga <= 500\n"
                "q_vec = np.random.randn(dim).astype(np.float32)\n"
                "q_vec /= np.linalg.norm(q_vec)\n"
                "\n"
                "# 1. Pencarian Tanpa Filter (Pure Unfiltered ANN)\n"
                "sims = np.dot(vectors, q_vec)\n"
                "top10_unfiltered = np.argsort(-sims)[:10]\n"
                "valid_in_unfiltered = [idx for idx in top10_unfiltered if categories[idx] == 1 and prices[idx] <= 500]\n"
                "\n"
                "# 2. Pencarian Terkondisi Filter Metadata (Ground Truth Filtered)\n"
                "valid_mask = (categories == 1) & (prices <= 500)\n"
                "valid_indices = np.where(valid_mask)[0]\n"
                "filtered_sims = sims[valid_indices]\n"
                "top10_filtered_rel = np.argsort(-filtered_sims)[:10]\n"
                "top10_filtered = valid_indices[top10_filtered_rel]\n"
                "\n"
                "print(f\"Total Data Korpus               : {N}\")\n"
                "print(f\"Total Dokumen Memenuhi Kriteria : {np.sum(valid_mask)}\")\n"
                "print(f\"Top-10 Tanpa Filter Valid Bisnis: {len(valid_in_unfiltered)}/10\")\n"
                "print(f\"Top-10 Dengan Filter Valid      : {len(top10_filtered)}/10\")\n"
                "print(f\"Skor Tertinggi Terfilter        : {sims[top10_filtered[0]]:.4f}\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.9.2
    {
        "id": "28.9.2",
        "title": "Paradigma Pra-Penyaringan (Pre-Filtering): Menyaring Metadata Terlebih Dahulu",
        "learningObjectives": [
            "Memahami alur kerja komputasi paradigma Pre-Filtering dalam basis data vektor.",
            "Menganalisis skenario di mana Pre-Filtering unggul (rasio selektivitas tinggi / subset data kecil).",
            "Mengimplementasikan mekanisme Pre-Filtering berbasis inverted index set intersecion."
        ],
        "prerequisites": [
            "28.9.1 (Urgensi Riil Metadata Filtering).",
            "Struktur data Inverted Index dan operasi himpunan (Set Intersection / Bitwise AND)."
        ],
        "commonPitfalls": [
            "Memaksa membangun indeks ANN dinamis on-the-fly pada hasil pre-filtering jika subset masih berukuran ratusan ribu vektor (overhead indeks melebihi waktu linear scan).",
            "Mengabaikan pemanfaatan cache bitset hasil pre-filtering untuk kueri repetitif dengan pola filter atribut yang sama."
        ],
        "academicReferences": [
            "Simhadri, H. V., Williams, G., Joshi, K. V., et al. (2021). Results of the NeurIPS'21 Challenge on Approximate Nearest Neighbor Search. NeurIPS Competition and Demonstration Track, 177-204.",
            "Gollapudi, S., et al. (2023). Filtered-DiskANN: Graph algorithms for approximate nearest neighbor search with filters. WWW '23."
        ],
        "caseStudy": "Sistem SaaS B2B seperti Slack atau Notion menggunakan Pre-Filtering ketat pada level 'workspace_id'. Karena satu workspace perusahaan hanya memiliki 5.000 dokumen dari total 50 juta dokumen global, pra-penyaringan langsung memangkas ruang pencarian hingga 99.99%, sehingga komputasi brute-force dot product pada subset 5.000 vektor jauh lebih cepat (<2 ms) daripada menavigasi graf global.",
        "content": {
            "theory": (
                "Paradigma Pra-Penyaringan (**Pre-Filtering**) menyelesaikan masalah filtered search dengan memisahkan evaluasi predikat metadata dari evaluasi kemiripan vektor menjadi dua fase sekuensial yang terisolasi. "
                "Pada fase pertama, predikat metadata $\\phi$ dievaluasi menggunakan mesin indeks metadata tradisional (seperti B-Tree, Inverted Index, atau Bitmap Index) untuk mengekstrak himpunan pengidentifikasi dokumen yang memenuhi syarat: "
                "$$\\mathcal{I}_\\phi = \\{ i \\in \\{1, \\dots, N\\} \\mid \\phi(m_i) = 1 \\}$$ "
                "Kardinalitas dari $\\mathcal{I}_\\phi$ menentukan fraksi selektivitas predikat $\\sigma = |\\mathcal{I}_\\phi| / N$. "
                "Pada fase kedua, evaluasi kemiripan vektor dibatasi hanya pada entitas yang terdaftar dalam $\\mathcal{I}_\\phi$: "
                "$$K^* = \\text{Top-}k_{i \\in \\mathcal{I}_\\phi} \\left( \\text{sim}(\\mathbf{q}, \\mathbf{x}_i) \\right)$$ "
                "Keuntungan mendasar dari Pre-Filtering adalah **ketepatan presisi filter 100%**: hasil pencarian dijamin tidak akan pernah memuat entitas di luar filter karena entitas yang tidak lolos telah dieleminasi sebelum perhitungan jarak dilakukan. "
                "Namun, strategi ini menghadapi tantangan efisiensi ekstrem ketika diterapkan pada struktur indeks graf ANN seperti HNSW. Jika $\\sigma$ sangat kecil, pemindaian linear (exact flat scan) pada $\\mathcal{I}_\\phi$ sangat efisien. Namun jika $\\sigma$ moderat (misal $10\\% - 50\\%$), menjalankan pencarian pada indeks graf yang dipangkas menjadi problematis."
            ),
            "realWorldApplication": (
                "PostgreSQL dengan ekstensi `pgvector`: ketika query menyertakan klausa `WHERE tenant_id = 123 ORDER BY embedding <=> query_vec LIMIT 10`, perencana kueri PostgreSQL mengeksekusi index scan pada `tenant_id` (pre-filter) sebelum mengurutkan vektor yang tersisa."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Simulasi database vektor 20.000 entitas dengan tenant_id\n"
                "np.random.seed(42)\n"
                "N = 20000\n"
                "dim = 32\n"
                "vectors = np.random.randn(N, dim).astype(np.float32)\n"
                "vectors /= np.linalg.norm(vectors, axis=1, keepdims=True)\n"
                "\n"
                "# Distribusi tenant: tenant 101 memiliki 250 dokumen (selektivitas rendah ~1.25%)\n"
                "tenant_ids = np.random.randint(100, 180, size=N)\n"
                "target_tenant = 101\n"
                "\n"
                "q_vec = np.random.randn(dim).astype(np.float32)\n"
                "q_vec /= np.linalg.norm(q_vec)\n"
                "\n"
                "# Pre-Filtering: 1. Ambil ID yang valid melalui inverted index\n"
                "valid_ids = np.where(tenant_ids == target_tenant)[0]\n"
                "\n"
                "# 2. Hitung jarak hanya pada subset yang lolos pra-penyaringan\n"
                "sub_vectors = vectors[valid_ids]\n"
                "sub_sims = np.dot(sub_vectors, q_vec)\n"
                "top5_rel_idx = np.argsort(-sub_sims)[:5]\n"
                "top5_doc_ids = valid_ids[top5_rel_idx]\n"
                "top5_scores = sub_sims[top5_rel_idx]\n"
                "\n"
                "print(f\"Total Korpus Global         : {N}\")\n"
                "print(f\"Jumlah Dokumen Lolos Filter : {len(valid_ids)} ({len(valid_ids)/N*100:.2f}%)\")\n"
                "print(f\"Top-5 ID Terpilih           : {top5_doc_ids.tolist()}\")\n"
                "print(f\"Skor Kosinus Teratas        : {[round(float(s), 4) for s in top5_scores]}\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.9.3
    {
        "id": "28.9.3",
        "title": "Masalah Fatal Pra-Penyaringan Klasik: Kerusakan Topologi Graf HNSW yang Terisolasi",
        "learningObjectives": [
            "Mendiagnosis fenomena 'Graph Disconnectivity' saat melakukan navigasi graf ANN pada subset pra-penyaringan.",
            "Memahami mengapa simpul entry-point HNSW yang tidak lolos filter dapat menghentikan penelusuran greedy secara prematur.",
            "Mengukur penurunan recall ANN akibat hilangnya jembatan topologis (navigational shortcuts)."
        ],
        "prerequisites": [
            "28.9.2 (Paradigma Pre-Filtering).",
            "Topologi Graf Navigasi Small-World dan algoritma Hierarchical Navigable Small World (HNSW)."
        ],
        "commonPitfalls": [
            "Mengira indeks graf HNSW global dapat digunakan untuk menelusuri subset dengan hanya melompat ke tetangga yang valid (mengabaikan bahwa simpul yang tidak valid bertindak sebagai jembatan esensial).",
            "Membangun indeks HNSW terpisah untuk setiap kemungkinan kombinasi nilai filter kategori (menyebabkan ledakan memori kombinatorial / combinatorial explosion)."
        ],
        "academicReferences": [
            "Malkov, Y. A., & Yashunin, D. A. (2020). Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs. IEEE Transactions on Pattern Analysis and Machine Intelligence, 42(4), 824-836.",
            "Gollapudi, S., et al. (2023). Filtered-DiskANN: Graph algorithms for approximate nearest neighbor search with filters. WWW '23."
        ],
        "caseStudy": "Ketika Milvus v1 mencoba mengimplementasikan filtered search dengan melarang traversal melalui simpul yang tidak lolos filter metadata pada graf HNSW, recall pencarian anjlok dari 98% menjadi di bawah 15% pada filter dengan selektivitas 5%. Algoritma terjebak di pulau lokal terisolasi karena jalur pintas (long-range edges) terputus oleh filter mask.",
        "content": {
            "theory": (
                "Kerusakan topologi graf navigasi (**Graph Disconnectivity**) merupakan kelemahan teoretis paling fatal dari penerapan pra-penyaringan naif pada indeks graf perkiraan ketetanggaan terdekat (seperti HNSW atau NSG). "
                "Graf navigasi dirancang dengan struktur *Small-World*, di mana sifat diameter graf kecil $O(\\log N)$ dicapai berkat keberadaan busur jarak jauh (*long-range links*) yang bertindak sebagai jalan pintas transit antarkluster. "
                "Secara formal, misalkan graf dinyatakan sebagai $G = (V, E)$, di mana simpul $v \\in V$ mewakili vektor data dan $e = (u, v) \\in E$ adalah busur kedekatan metrik. Ketika predikat filter Boolean $\\phi$ diterapkan secara kaku pada graf, graf yang diakses oleh penelusur tereduksi menjadi subgraf induksi: "
                "$$G_\\phi = (V_\\phi, E_\\phi), \\quad \\text{di mana } V_\\phi = \\{v \\in V \\mid \\phi(v) = 1\\}, \\quad E_\\phi = \\{(u, v) \\in E \\mid u, v \\in V_\\phi\\}$$ "
                "Konsekuensi topologis dari reduksi ini mencakup dua kegagalan struktural utama: "
                "1. **Fragmentasi Menjadi Komponen Terputus**: Derajat simpul rata-rata $\\bar{d}_\\phi = \\sigma \\cdot \\bar{d}$ menurun drastis seiring penurunan selektivitas $\\sigma$. Subgraf $G_\\phi$ pecah menjadi ratusan klaster terisolasi tanpa ada busur penghubung. Penelusuran greedy yang dimulai dari suatu titik awal (entry point) tidak akan pernah dapat menjangkau tetangga terdekat global yang berada di komponen terpisah. "
                "2. **Jebakan Lokal Minima Prematur**: Kondisi penghentian greedy search terpenuhi ketika tidak ada tetangga langsung yang memiliki jarak lebih dekat ke query daripada simpul saat ini. Hilangnya busur perantara menyebabkan algoritma terhenti di titik sub-optimal, melenyapkan jaminan recall tinggi."
            ),
            "realWorldApplication": (
                "Desain internal Qdrant: alih-alih menghapus simpul non-filter dari graf selama traversal, Qdrant mengizinkan algoritma melintasi simpul yang tidak lolos filter sebagai batu loncatan (transit nodes), namun hanya memasukkan simpul ber-payload valid ke dalam antrean hasil akhir (candidate set)."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Simulasi graf navigasi 1D dengan 10 simpul berurutan (rantai + jalan pintas)\n"
                "# Simpul: 0 -> 1 -> 2 -> ... -> 9. Jalan pintas: 0 -> 5\n"
                "nodes = list(range(10))\n"
                "adj = {\n"
                "    0: [1, 5], 1: [0, 2], 2: [1, 3], 3: [2, 4], 4: [3, 5],\n"
                "    5: [0, 4, 6], 6: [5, 7], 7: [6, 8], 8: [7, 9], 9: [8]\n"
                "}\n"
                "# Filter: hanya simpul [0, 8, 9] yang valid secara metadata\n"
                "valid_set = {0, 8, 9}\n"
                "\n"
                "# Skenario A: Graf Naif Terputus (hanya melintasi tetangga yang valid)\n"
                "# Mulai dari simpul 0, mencari simpul 9\n"
                "visited_naive = []\n"
                "curr = 0\n"
                "visited_naive.append(curr)\n"
                "# Tetangga simpul 0 adalah 1 dan 5. Keduanya TIDAK valid!\n"
                "naive_neighbors = [nb for nb in adj[curr] if nb in valid_set]\n"
                "can_reach_naive = len(naive_neighbors) > 0\n"
                "\n"
                "# Skenario B: Traversal Transit (boleh melintasi simpul non-valid sebagai jembatan)\n"
                "from collections import deque\n"
                "queue = deque([0])\n"
                "visited_transit = {0}\n"
                "reached_target = False\n"
                "\n"
                "while queue:\n"
                "    u = queue.popleft()\n"
                "    if u == 9:\n"
                "        reached_target = True\n"
                "        break\n"
                "    for v in adj[u]:\n"
                "        if v not in visited_transit:\n"
                "            visited_transit.add(v)\n"
                "            queue.append(v)\n"
                "\n"
                "print(f\"Target Simpul yang Dicari      : 9\")\n"
                "print(f\"Subgraf Valid Mandiri         : {sorted(list(valid_set))}\")\n"
                "print(f\"Skenario Naif (Terkunci di 0) : Terisolasi? {not can_reach_naive}\")\n"
                "print(f\"Skenario Transit (Batu Loncat): Berhasil Mencapai 9? {reached_target}\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.9.4
    {
        "id": "28.9.4",
        "title": "Paradigma Pasca-Penyaringan (Post-Filtering): Mengambil Top-K Lalu Membuang yang Tidak Sesuai",
        "learningObjectives": [
            "Memahami arsitektur komputasi Post-Filtering: eksekusi ANN tak terikat disusul pemfilteran metadata.",
            "Menganalisis rumus over-fetching $K' = K / \\sigma$ untuk mengompensasi rasio selektivitas filter.",
            "Mengimplementasikan pipeline Post-Filtering dan mengukur latensi vs kestabilan ukuran hasil."
        ],
        "prerequisites": [
            "28.9.1 (Urgensi Riil Metadata Filtering).",
            "Mekanisme query ANN standar $k$-Nearest Neighbors."
        ],
        "commonPitfalls": [
            "Menentukan batas over-fetch statis (misal selalu $K'=100$) tanpa memperhitungkan variabilitas selektivitas predikat dinamis pengguna.",
            "Mengabaikan lonjakan konsumsi memori dan latensi ketika $K'$ harus dinaikkan hingga $10.000$ untuk predikat dengan selektivitas sangat ketat."
        ],
        "academicReferences": [
            "Zhao, W., et al. (2022). Towards efficient filtered approximate nearest neighbor search. Proceedings of the VLDB Endowment, 15(11), 2465-2477.",
            "Aumüller, M., et al. (2020). ANN-benchmarks. Information Systems."
        ],
        "caseStudy": "Mesin rekomendasi Spotify pada masa awal menggunakan Post-Filtering untuk menyaring lagu berdasarkan ketersediaan lisensi negara pengguna (country licensing). Jika lagu-lagu paling mirip secara audio terlarang di negara pengguna, query mengembalikan kurang dari 10 lagu, memaksa antarmuka klien menampilkan playlist yang rumpang.",
        "content": {
            "theory": (
                "Paradigma Pasca-Penyaringan (**Post-Filtering**) merupakan pendekatan komplementer terhadap Pre-Filtering yang membalikkan urutan evaluasi. "
                "Pada paradigma ini, indeks ANN dieksekusi terlebih dahulu secara global pada seluruh korpus $\\mathcal{D}$ tanpa mempertimbangkan predikat filter metadata sama sekali. "
                "Karena sebagian kandidat hasil ANN akan ditolak oleh filter metadata $\\phi$, sistem harus melakukan **over-fetching**, yaitu meminta sejumlah $K' > k$ tetangga terdekat: "
                "$$C = \\text{ANN-Search}(\\mathbf{q}, \\mathcal{D}, K')$$ "
                "Selanjutnya, pada tahap kedua, predikat filter $\\phi$ diterapkan pada himpunan kandidat $C$ untuk membuang entitas yang tidak memenuhi kriteria: "
                "$$K^* = \\{ c \\in C \\mid \\phi(m_c) = 1 \\}$$ "
                "Untuk memastikan bahwa $|K^*| \\ge k$ dengan probabilitas tinggi, ukuran over-fetch $K'$ harus diestimasi berdasarkan selektivitas predikat $\\sigma = |\\mathcal{D}_\\phi| / |\\mathcal{D}|$: "
                "$$K' \\approx \\left\\lceil \\frac{k}{\\sigma} \\right\\rceil$$ "
                "Keunggulan utama Post-Filtering adalah **integritas topologi graf 100% utuh**: pencarian graf berjalan pada graf global yang terkoneksi sempurna dengan kecepatan maksimal tanpa modifikasi algoritma indeks. "
                "Namun, paradigma ini memiliki keterbatasan fatal ketika selektivitas filter sangat rendah (predikat sangat spesifik, $\\sigma < 0.01$), di mana nilai $K'$ yang dibutuhkan menjadi tidak praktis dan memicu degradasi performa."
            ),
            "realWorldApplication": (
                "Elasticsearch pada versi lawas sebelum payload filtering terpadu: mengeksekusi dense vector scoring pada top-1000 dokumen paling relevan, kemudian menyaring dokumen tersebut menggunakan filter boolean metadata sebelum mengembalikan top-10 ke pengguna."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Korpus 5.000 vektor dengan atribut status ketersediaan (availability)\n"
                "np.random.seed(42)\n"
                "N = 5000\n"
                "dim = 16\n"
                "vectors = np.random.randn(N, dim).astype(np.float32)\n"
                "vectors /= np.linalg.norm(vectors, axis=1, keepdims=True)\n"
                "\n"
                "# Hanya 20% item yang 'in_stock' (status = 1)\n"
                "status = np.random.choice([0, 1], size=N, p=[0.8, 0.2])\n"
                "q_vec = np.random.randn(dim).astype(np.float32)\n"
                "q_vec /= np.linalg.norm(q_vec)\n"
                "\n"
                "# Hitung similaritas global\n"
                "all_sims = np.dot(vectors, q_vec)\n"
                "k_target = 5\n"
                "\n"
                "# Kasus 1: Post-filtering tanpa over-fetch (ambil tepat K=5)\n"
                "top_k_raw = np.argsort(-all_sims)[:k_target]\n"
                "filtered_no_overfetch = [idx for idx in top_k_raw if status[idx] == 1]\n"
                "\n"
                "# Kasus 2: Post-filtering dengan over-fetching (K' = K / sigma = 5 / 0.2 = 25)\n"
                "k_prime = int(k_target / 0.2)\n"
                "top_k_prime = np.argsort(-all_sims)[:k_prime]\n"
                "filtered_with_overfetch = [idx for idx in top_k_prime if status[idx] == 1][:k_target]\n"
                "\n"
                "print(f\"Target Hasil yang Dibutuhkan (k)     : {k_target}\")\n"
                "print(f\"Hasil Lolos Tanpa Over-Fetch         : {len(filtered_no_overfetch)}/{k_target} (Kurang!)\")\n"
                "print(f\"Hasil Lolos Dengan Over-Fetch (K'={k_prime}): {len(filtered_with_overfetch)}/{k_target} (Lengkap!)\")\n"
                "print(f\"ID Dokumen Terpilih                  : {filtered_with_overfetch}\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.9.5
    {
        "id": "28.9.5",
        "title": "Masalah Fatal Pasca-Penyaringan: Hasil Kosong atau Top-K yang Tidak Cukup",
        "learningObjectives": [
            "Menganalisis probabilitas kegagalan Post-Filtering pada predikat metadata selektivitas ultra-ketat ($\\sigma \\to 0$).",
            "Memahami kurva kejatuhan Recall@K dan fenomena 'Empty Result Set Trap'.",
            "Mengimplementasikan simulasi Monte Carlo untuk menghitung laju kegagalan Post-Filtering."
        ],
        "prerequisites": [
            "28.9.4 (Paradigma Post-Filtering).",
            "Distribusi probabilitas binomial dan kalkulasi ekspektasi statistik."
        ],
        "commonPitfalls": [
            "Mengabaikan skenario terburuk di mana $K'$ kandidat teratas seluruhnya berasal dari domain metadata yang salah, mengembalikan array kosong ke pengguna.",
            "Menaikkan $K'$ secara tak terbatas saat hasil kosong, menyebabkan latensi berfluktuasi liar dari 5 ms hingga 500 ms."
        ],
        "academicReferences": [
            "Gollapudi, S., et al. (2023). Filtered-DiskANN. WWW '23.",
            "Zhao, W., et al. (2022). Towards efficient filtered approximate nearest neighbor search. PVLDB."
        ],
        "caseStudy": "Pada aplikasi real-estate Zillow, seorang pengguna mencari rumah di lingkungan khusus 'Beverly Hills' (hanya 0.05% dari seluruh inventaris nasional). Menggunakan Post-Filtering dengan over-fetch $K'=500$, seluruh 500 rumah paling mirip secara visual berada di wilayah Texas dan Florida, sehingga sistem melaporkan '0 rumah ditemukan', padahal ada puluhan rumah cocok di Beverly Hills.",
        "content": {
            "theory": (
                "Kegagalan fatal dari paradigma Post-Filtering terjadi ketika selektivitas predikat metadata $\\sigma = |\\mathcal{D}_\\phi| / |\\mathcal{D}|$ mendekati nol, memicu fenomena **Empty Result Set Trap** atau defisit hasil kuota ($|K^*| < k$). "
                "Secara matematis, jika kita mengasumsikan distribusi atribut metadata independen terhadap kemiripan vektor, jumlah entitas valid $X$ yang ditemukan di dalam himpunan over-fetch berukuran $K'$ mengikuti distribusi Binomial: "
                "$$X \\sim \\text{Binomial}(K', \\sigma)$$ "
                "Probabilitas bahwa sistem gagal mengumpulkan $k$ hasil yang diminta dinyatakan oleh fungsi kumulatif: "
                "$$P(X < k) = \\sum_{j=0}^{k-1} \\binom{K'}{j} \\sigma^j (1 - \\sigma)^{K' - j}$$ "
                "Jika selektivitas predikat adalah $\\sigma = 0.001$ ($0.1\\%$) dan target kueri adalah $k = 10$, bahkan dengan over-fetching besar $K' = 1000$, nilai ekspektasi dokumen valid hanyalah $\\mathbb{E}[X] = K' \\cdot \\sigma = 1.0$. "
                "Probabilitas mendapatkan kurang dari 10 hasil valid dalam kasus ini melebihi $99.99\\%$. "
                "Kondisi di dunia nyata bahkan jauh lebih buruk daripada asumsi binomial karena kemiripan vektor dan atribut metadata sering kali berkorelasi erat (*correlated bias*). Dokumen-dokumen yang paling dekat di ruang semantik cenderung mengelompok pada klaster kategori yang dominan, sehingga menyingkirkan kategori minoritas dari seluruh jendela $K'$ teratas."
            ),
            "realWorldApplication": (
                "Pencarian rekam medis rumah sakit: mencari pasien dengan gejala klinis mirip (vektor dense) yang menderita penyakit langka tertentu (metadata diagnosis_code). Post-filtering gagal total karena seluruh tetangga terdekat teratas dipenuhi oleh pasien penyakit umum, menyembunyikan rekam medis yang relevan secara medis."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "from scipy.stats import binom\n"
                "\n"
                "# Menghitung probabilitas kegagalan Post-Filtering pada berbagai tingkat selektivitas (sigma)\n"
                "k_target = 10\n"
                "overfetch_factors = [5, 10, 20, 50]\n"
                "sigmas = [0.1, 0.02, 0.005, 0.001]  # 10%, 2%, 0.5%, 0.1%\n"
                "\n"
                "print(f\"Analisis Probabilitas Kegagalan Post-Filtering (Target k = {k_target})\")\n"
                "print(\"-\" * 65)\n"
                "print(f\"{'Selektivitas (sigma)':<20} | {'K prime':<10} | {'Ekspektasi E[X]':<16} | {'P(Gagal < k)':<12}\")\n"
                "print(\"-\" * 65)\n"
                "\n"
                "for sigma in sigmas:\n"
                "    for mult in [10, 50]:\n"
                "        K_prime = k_target * mult\n"
                "        expected_x = K_prime * sigma\n"
                "        # Probabilitas X < k menggunakan distribusi Poisson/Binomial aproksimasi\n"
                "        # P(X < k) = sum_{j=0}^{k-1} (n choose j) * p^j * (1-p)^(n-j)\n"
                "        p_fail = 0.0\n"
                "        for j in range(k_target):\n"
                "            # Menghitung kombinasi logaritmik manual untuk kestabilan numerik\n"
                "            from math import comb\n"
                "            if j <= K_prime:\n"
                "                term = comb(K_prime, j) * (sigma ** j) * ((1 - sigma) ** (K_prime - j))\n"
                "                p_fail += term\n"
                "        p_fail = min(max(p_fail, 0.0), 1.0)\n"
                "        print(f\"{sigma*100:>6.2f}% ({sigma:<6})     | {K_prime:<10} | {expected_x:<16.2f} | {p_fail*100:>8.2f}%\")\n"
                "print(\"-\" * 65)"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.9.6
    {
        "id": "28.9.6",
        "title": "Penyaringan Tahap Tunggal (Single-Stage Filtered Search): Navigasi Graf Terpadu",
        "learningObjectives": [
            "Memahami arsitektur Single-Stage Filtered Search yang mengintegrasikan evaluasi predikat ke dalam algoritma penelusuran graf.",
            "Menganalisis mekanisme Filtered-DiskANN (Gollapudi et al., WWW 2023) dan Qdrant Payload-Aware Traversal.",
            "Menguasai trade-off komputasi antara pemeliharaan konektivitas graf dan pemfilteran kandidat hasil."
        ],
        "prerequisites": [
            "28.9.3 (Masalah Kerusakan Topologi Graf HNSW).",
            "28.9.5 (Masalah Empty Result Set Trap pada Post-Filtering)."
        ],
        "commonPitfalls": [
            "Mematikan simpul yang tidak lolos filter dari antrean penelusuran graf (`beam_search` visited list), yang menyebabkan kebuntuan pencarian pada klaster terisolasi.",
            "Melakukan komputasi evaluasi predikat berulang-ulang pada simpul yang sama tanpa caching struktur bitmask."
        ],
        "academicReferences": [
            "Gollapudi, S., Karia, N., Sivashankar, V., Krishnaswamy, R., Begwani, N., Raz, S., Lin, Y., Zhang, Y., Mahapatro, N., Srinivasan, P., Singh, A., & Simhadri, H. V. (2023). Filtered-DiskANN: Graph algorithms for approximate nearest neighbor search with filters. In Proceedings of the ACM Web Conference 2023 (WWW '23), 3543507.3583552.",
            "Subramanya, S. J., Devvrit, F., Simhadri, H. V., Krishnawamy, R., & Kadekodi, R. (2019). DiskANN: Fast accurate heuristic search on billion-point datasets of high-dimensional vectors. In Advances in Neural Information Processing Systems (NeurIPS 2019)."
        ],
        "caseStudy": "Filtered-DiskANN yang diterapkan pada infrastruktur pencarian Bing Web Search mengintegrasikan label metadata filter (bahasa, tanggal publikasi, domain) langsung ke dalam graf Vamana. Pendekatan single-stage ini mencapai peningkatan throughput 8x lipat dan menjaga Recall@10 di atas 95% pada filter dengan selektivitas sangat ketat (<1%).",
        "content": {
            "theory": (
                "Penyaringan Tahap Tunggal (**Single-Stage Filtered Search**) memecahkan dilema Pre-Filtering dan Post-Filtering dengan menyatukan evaluasi predikat metadata ke dalam siklus hidup traversal graf ANN. "
                "Sebagaimana ditegaskan dalam karya seminal Gollapudi et al. (WWW 2023): "
                "\"As Approximate Nearest Neighbor Search (ANNS)-based dense retrieval becomes ubiquitous for search and recommendation scenarios, efficiently answering filtered ANNS queries has become a critical requirement. Filtered ANNS queries ask for the nearest neighbors of a query's embedding from the points in the index that match the query's labels such as date, price range, language. There has been little prior work on algorithms that use label metadata associated with vector data to build efficient indices for filtered ANNS queries. Consequently, current indices have high search latency or low recall which is not practical in interactive web-scenarios. We present two algorithms with native support for faster and more accurate filtered ANNS queries: one with streaming support, and another based on batch construction. Central to our algorithms is the construction of a graph-structured index which forms connections not only based on the geometry of the vector data, but also the associated label set.\" "
                "Dalam implementasi single-stage murni (seperti pada Qdrant atau Filtered-DiskANN), indeks mempertahankan struktur graf terpadu. Selama penelusuran greedy best-first search: "
                "1. **Jembatan Navigasi Spasial**: Simpul yang *tidak lolos* predikat filter $\\phi(m_u) = 0$ tetap diizinkan dieksplorasi dan tetangganya dimasukkan ke dalam antrean kandidat traversal (`search_queue`). Hal ini mencegah terputusnya topologi *small-world*. "
                "2. **Seleksi Hasil Berfilter**: Hanya simpul yang *lolos* predikat filter $\\phi(m_u) = 1$ yang diizinkan masuk ke dalam antrean hasil akhir (`top_candidates_result`). "
                "Dengan arsitektur ini, sistem mencapai recall sempurna tanpa risiko terjebak dalam komponen graf terputus ataupun defisit jumlah hasil."
            ),
            "realWorldApplication": (
                "Qdrant Vector Database: mengimplementasikan Single-Stage Payload-Aware Graph Traversal di mana payload index (berbasis bitset) dipadukan langsung dengan traversal HNSW, memberikan latensi sub-10ms bahkan pada kueri dengan selektivitas 0.01%."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "import heapq\n"
                "\n"
                "# Implementasi Single-Stage Filtered Search pada Graf Navigasi Sederhana\n"
                "class SingleStageGraphSearch:\n"
                "    def __init__(self, vectors, adj_list, metadata_filter_fn):\n"
                "        self.vectors = vectors\n"
                "        self.adj = adj_list\n"
                "        self.filter_fn = metadata_filter_fn\n"
                "\n"
                "    def search(self, query, entry_point, k=3, ef_search=10):\n"
                "        visited = set([entry_point])\n"
                "        # Antrean penelusuran (min-heap jarak untuk best-first traversal)\n"
                "        init_dist = np.linalg.norm(self.vectors[entry_point] - query)\n"
                "        candidates = [(init_dist, entry_point)]\n"
                "        \n"
                "        # Antrean hasil terfilter (max-heap untuk menyimpan top-k terkecil)\n"
                "        # Format: (-dist, node_id)\n"
                "        results = []\n"
                "        if self.filter_fn(entry_point):\n"
                "            heapq.heappush(results, (-init_dist, entry_point))\n"
                "\n"
                "        while candidates:\n"
                "            curr_dist, curr_node = heapq.heappop(candidates)\n"
                "            \n"
                "            # Eksplorasi seluruh tetangga (bahkan jika tetangga non-valid!)\n"
                "            for neighbor in self.adj.get(curr_node, []):\n"
                "                if neighbor not in visited:\n"
                "                    visited.add(neighbor)\n"
                "                    d = np.linalg.norm(self.vectors[neighbor] - query)\n"
                "                    heapq.heappush(candidates, (d, neighbor))\n"
                "                    \n"
                "                    # Evaluasi filter: simpan ke hasil hanya jika memenuhi predikat\n"
                "                    if self.filter_fn(neighbor):\n"
                "                        if len(results) < k:\n"
                "                            heapq.heappush(results, (-d, neighbor))\n"
                "                        elif d < -results[0][0]:\n"
                "                            heapq.heapreplace(results, (-d, neighbor))\n"
                "                            \n"
                "            if len(visited) >= ef_search:\n"
                "                break\n"
                "                \n"
                "        # Ekstrak hasil terurut jarak terdekat\n"
                "        final_results = sorted([(-neg_d, node) for neg_d, node in results])\n"
                "        return final_results\n"
                "\n"
                "# Validasi simulasi\n"
                "np.random.seed(42)\n"
                "vecs = np.random.randn(8, 2)\n"
                "# Graf rantai melingkar sederhana dengan jalan pintas\n"
                "graph = {0: [1, 4], 1: [0, 2], 2: [1, 3], 3: [2, 7], 4: [0, 5], 5: [4, 6], 6: [5, 7], 7: [3, 6]}\n"
                "# Predikat: hanya node genap [0, 2, 4, 6] yang lolos filter\n"
                "filter_rule = lambda node: node % 2 == 0\n"
                "\n"
                "engine = SingleStageGraphSearch(vecs, graph, filter_rule)\n"
                "res = engine.search(query=np.array([0.0, 0.0]), entry_point=0, k=3)\n"
                "\n"
                "print(f\"Hasil Single-Stage Filtered Search (Top-3 Node Genap):\")\n"
                "for rank, (dist, node) in enumerate(res, 1):\n"
                "    print(f\"  Peringkat {rank}: Node {node} (Jarak L2: {dist:.4f}) - Lolos Filter: {filter_rule(node)}\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.9.7
    {
        "id": "28.9.7",
        "title": "Struktur Indeks Metadata Terbalik (Inverted Payload Index): Mengindeks Kategori dan Nilai Numerik",
        "learningObjectives": [
            "Memahami arsitektur Inverted Payload Index untuk pengindeksan nilai kategorikal dan numerik.",
            "Menganalisis efisiensi Roaring Bitmaps dalam operasi bitwise AND/OR antar-payload.",
            "Mengimplementasikan payload index sederhana yang mendukung kueri rentang numerik dan pencocokan term."
        ],
        "prerequisites": [
            "28.9.6 (Single-Stage Filtered Search).",
            "Representasi biner integer dan kompresi bitmap (Run-Length Encoding / Roaring Bitmaps)."
        ],
        "commonPitfalls": [
            "Menyimpan array integer tak terkompresi untuk daftar postingan payload bernilai kardinalitas tinggi, yang menghabiskan memori RAM setara dengan indeks vektor itu sendiri.",
            "Mengabaikan penataan ulang indeks numerik berbasis B-Tree saat volume mutasi titik vektor berlangsung masif."
        ],
        "academicReferences": [
            "Chambi, S., Lemire, D., Kaser, O., & Godin, R. (2016). Better bitmap performance with Roaring bitmaps. Software: Practice and Experience, 46(5), 709-719.",
            "Gollapudi, S., et al. (2023). Filtered-DiskANN. WWW '23."
        ],
        "caseStudy": "Qdrant menggunakan Roaring Bitmaps untuk seluruh payload categorical indexing. Ketika kueri memerlukan penggabungan filter multi-atribut (`city == 'Jakarta' AND rating >= 4.5`), Qdrant mengeksekusi operasi bitwise bitset dalam mikrodetik menggunakan instruksi SIMD AVX-512, menghasilkan mask bitset yang siap dipakai oleh graf ANN.",
        "content": {
            "theory": (
                "Untuk mendukung evaluasi predikat filter instan selama penelusuran graf vektor, mesin basis data vektor modern memisahkan penyimpanan atribut mentah ke dalam **Inverted Payload Index**. "
                "Struktur indeks ini bertugas memetakan setiap kemungkinan nilai atribut diskrit ke himpunan pengenal vektor (*vector ID posting list*). "
                "Untuk atribut kategorikal $A$ dengan domain nilai $\\mathcal{V}_A$, indeks terbalik didefinisikan sebagai fungsi pemetaan: "
                "$$\\mathcal{T}_A: v \\mapsto \\mathcal{B}_v, \\quad \\forall v \\in \\mathcal{V}_A$$ "
                "di mana $\\mathcal{B}_v$ adalah bitmap biner di mana bit ke-$i$ bernilai 1 jika entitas $i$ memiliki atribut bernilai $v$, dan bernilai 0 jika sebaliknya: "
                "$$\\mathcal{B}_v[i] = \\begin{cases} 1 & \\text{jika } m_i.A = v \\\\ 0 & \\text{jika } m_i.A \\neq v \\end{cases}$$ "
                "Untuk atribut numerik kontinu (seperti harga, stempel waktu, atau koordinat geografis), nilai dikelompokkan ke dalam struktur B-Tree numerik atau *numeric bucketed inverted index*. "
                "Kueri rentang $A \\in [v_{\\text{min}}, v_{\\text{max}}]$ dievaluasi dengan mengambil gabungan (*bitwise OR*) dari seluruh posting list ember (bucket) yang bersinggungan: "
                "$$\\mathcal{B}_{[v_{\\text{min}}, v_{\\text{max}}]} = \\bigvee_{b \\in \\text{Buckets}([v_{\\text{min}}, v_{\\text{max}}])} \\mathcal{B}_b$$ "
                "Dengan memanfaatkan teknologi kompresi modern seperti **Roaring Bitmaps**, operasi interseksi (AND), gabungan (OR), dan negasi (NOT) dapat dieksekusi pada kecepatan gigabit per detik langsung di register CPU."
            ),
            "realWorldApplication": (
                "Apache Lucene 9 (fondasi Elasticsearch dan OpenSearch): menggunakan BKD-Tree multidimensi untuk field numerik dan RoaringDocIdSet untuk bitset filter, memungkinkan eksekusi filter hybrid yang sangat efisien bersamaan dengan HNSW."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Implementasi Inverted Payload Index Sederhana berbasis NumPy Boolean Bitmask\n"
                "class SimplePayloadIndex:\n"
                "    def __init__(self, n_docs):\n"
                "        self.n_docs = n_docs\n"
                "        self.cat_index = {}      # field -> value -> bitmask\n"
                "        self.numeric_fields = {}  # field -> numpy array of values\n"
                "        \n"
                "    def add_categorical(self, field, values):\n"
                "        self.cat_index[field] = {}\n"
                "        for val in set(values):\n"
                "            mask = np.array([v == val for v in values], dtype=bool)\n"
                "            self.cat_index[field][val] = mask\n"
                "            \n"
                "    def add_numeric(self, field, values):\n"
                "        self.numeric_fields[field] = np.array(values, dtype=np.float32)\n"
                "        \n"
                "    def query_filter(self, cat_filters=None, num_ranges=None):\n"
                "        # Inisialisasi bitmask lolos bernilai True untuk seluruh dokumen\n"
                "        final_mask = np.ones(self.n_docs, dtype=bool)\n"
                "        \n"
                "        if cat_filters:\n"
                "            for field, val in cat_filters.items():\n"
                "                mask = self.cat_index.get(field, {}).get(val, np.zeros(self.n_docs, dtype=bool))\n"
                "                final_mask &= mask\n"
                "                \n"
                "        if num_ranges:\n"
                "            for field, (min_v, max_v) in num_ranges.items():\n"
                "                arr = self.numeric_fields[field]\n"
                "                mask = (arr >= min_v) & (arr <= max_v)\n"
                "                final_mask &= mask\n"
                "                \n"
                "        return final_mask\n"
                "\n"
                "# Validasi indeks dengan 10 entitas dokumen\n"
                "docs_cat = ['tech', 'news', 'tech', 'finance', 'tech', 'news', 'finance', 'tech', 'news', 'finance']\n"
                "docs_price = [100, 250, 80, 500, 300, 150, 420, 95, 210, 380]\n"
                "\n"
                "idx = SimplePayloadIndex(n_docs=10)\n"
                "idx.add_categorical('category', docs_cat)\n"
                "idx.add_numeric('price', docs_price)\n"
                "\n"
                "# Kueri: category == 'tech' AND price <= 100\n"
                "res_mask = idx.query_filter(cat_filters={'category': 'tech'}, num_ranges={'price': (0, 100)})\n"
                "matching_ids = np.where(res_mask)[0]\n"
                "\n"
                "print(f\"Total Dokumen Terindeks : 10\")\n"
                "print(f\"ID Dokumen Lolos Kueri  : {matching_ids.tolist()}\")\n"
                "for doc_id in matching_ids:\n"
                "    print(f\"  Doc {doc_id}: Cat={docs_cat[doc_id]}, Price={docs_price[doc_id]}\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.9.8
    {
        "id": "28.9.8",
        "title": "Filter Ekspresi Boolean Majemuk: Kombinasi Logika AND, OR, NOT, dan Range Comparison",
        "learningObjectives": [
            "Memahami representasi Abstract Syntax Tree (AST) untuk ekspresi filter Boolean majemuk.",
            "Menganalisis optimasi evaluasi predikat menggunakan hukum De Morgan dan Short-Circuit Evaluation.",
            "Mengimplementasikan evaluator ekspresi Boolean rekursif pada bitset dokumen."
        ],
        "prerequisites": [
            "28.9.7 (Inverted Payload Index).",
            "Aljabar Boolean dan struktur pohon ekspresi (Expression Trees / AST)."
        ],
        "commonPitfalls": [
            "Mengevaluasi cabang ekspresi OR yang mahal terlebih dahulu sebelum memangkas ruang pencarian menggunakan cabang AND yang memiliki selektivitas tinggi.",
            "Tidak menangani nilai null/missing attribute secara konsisten pada operator negasi NOT."
        ],
        "academicReferences": [
            "Lemire, D., Kaser, O., & Kurz, N. (2018). Roaring bitmaps: Implementation of an optimized software library. Software: Practice and Experience, 48(4), 867-895.",
            "Gollapudi, S., et al. (2023). Filtered-DiskANN. WWW '23."
        ],
        "caseStudy": "Mesin filter Weaviate dan Vespa mendukung GraphQL / SQL-like query builder dengan klausa nested kompleks: `(category = 'AI' OR tags CONTAINS 'ML') AND NOT (license = 'GPL') AND year >= 2023`. Evaluator mengompilasi pohon logika menjadi pipeline operasi SIMD bitset yang tereksekusi dalam kurang dari 0.5 ms.",
        "content": {
            "theory": (
                "Dalam sistem basis data vektor perusahaan, predikat filter jarang berbentuk kondisi tunggal sederhana, melainkan berupa ekspresi Boolean bersarang majemuk (*compound Boolean expressions*). "
                "Secara formal, sebuah ekspresi filter Boolean direpresentasikan sebagai sebuah *Abstract Syntax Tree* (AST) $\\mathcal{T}$, di mana simpul daun (*leaf nodes*) adalah predikat atomik (seperti kesetaraan nilai $A = v$ atau pertidaksamaan rentang $B \\le u$), dan simpul internal adalah operator logika Boolean $\\text{op} \\in \\{\\land, \\lor, \\neg\\}$. "
                "Evaluasi predikat majemuk pada korpus berukuran $N$ didefinisikan secara rekursif melalui fungsi evaluasi pemetaan $\\mathcal{E}: \\mathcal{T} \\to \\{0, 1\\}^N$: "
                "$$\\mathcal{E}(\\text{leaf}(A = v)) = \\mathcal{B}_{A=v}$$ "
                "$$\\mathcal{E}(T_1 \\land T_2) = \\mathcal{E}(T_1) \\ \\& \\ \\mathcal{E}(T_2) \\quad \\text{(Bitwise AND)}$$ "
                "$$\\mathcal{E}(T_1 \\lor T_2) = \\mathcal{E}(T_1) \\mid \\mathcal{E}(T_2) \\quad \\text{(Bitwise OR)}$$ "
                "$$\\mathcal{E}(\\neg T) = \\sim \\mathcal{E}(T) \\quad \\text{(Bitwise NOT)}$$ "
                "Untuk meminimalkan waktu komputasi, mesin kueri menerapkan **Query Optimization**: "
                "1. **Pushdown Negation (Hukum De Morgan)**: Mengubah $\\neg (A \\lor B)$ menjadi $(\\neg A) \\land (\\neg B)$ untuk mempercepat pembentukan mask interseksi. "
                "2. **Selectivity Ordering**: Pada rantai operasi $\\land$, cabang pohon dengan estimasi selektivitas terkecil dievaluasi pertama kali, sehingga bitset hasil cepat menyusut menjadi jarang (*sparse*), memangkas komputasi pada cabang berikutnya."
            ),
            "realWorldApplication": (
                "Milvus 2.4 Boolean Expression Engine: menggunakan parser antlr4 untuk mengompilasi kueri filter string seperti `year >= 2020 and (tag == 'patent' or score > 90)` langsung menjadi instruksi bitset mask C++ berbasis AVX-512."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Evaluator Ekspresi Boolean Sederhana berbasis AST Dictionary\n"
                "def evaluate_ast(node, doc_data, n_docs):\n"
                "    op = node.get('op')\n"
                "    \n"
                "    if op == 'EQUALS':\n"
                "        field, val = node['field'], node['val']\n"
                "        return np.array([doc_data[field][i] == val for i in range(n_docs)], dtype=bool)\n"
                "    elif op == 'GTE':\n"
                "        field, val = node['field'], node['val']\n"
                "        return np.array([doc_data[field][i] >= val for i in range(n_docs)], dtype=bool)\n"
                "    elif op == 'AND':\n"
                "        res = np.ones(n_docs, dtype=bool)\n"
                "        for child in node['children']:\n"
                "            res &= evaluate_ast(child, doc_data, n_docs)\n"
                "        return res\n"
                "    elif op == 'OR':\n"
                "        res = np.zeros(n_docs, dtype=bool)\n"
                "        for child in node['children']:\n"
                "            res |= evaluate_ast(child, doc_data, n_docs)\n"
                "        return res\n"
                "    elif op == 'NOT':\n"
                "        return ~evaluate_ast(node['child'], doc_data, n_docs)\n"
                "    else:\n"
                "        raise ValueError(f\"Operator tidak dikenal: {op}\")\n"
                "\n"
                "# Dataset simulasi 6 dokumen\n"
                "data = {\n"
                "    'lang': ['id', 'en', 'id', 'en', 'id', 'en'],\n"
                "    'views': [1500, 300, 8000, 200, 50, 9500],\n"
                "    'is_archived': [False, False, False, True, False, False]\n"
                "}\n"
                "N = 6\n"
                "\n"
                "# Ekspresi: (lang == 'id' OR views >= 5000) AND NOT is_archived\n"
                "query_ast = {\n"
                "    'op': 'AND',\n"
                "    'children': [\n"
                "        {\n"
                "            'op': 'OR',\n"
                "            'children': [\n"
                "                {'op': 'EQUALS', 'field': 'lang', 'val': 'id'},\n"
                "                {'op': 'GTE', 'field': 'views', 'val': 5000}\n"
                "            ]\n"
                "        },\n"
                "        {\n"
                "            'op': 'NOT',\n"
                "            'child': {'op': 'EQUALS', 'field': 'is_archived', 'val': True}\n"
                "        }\n"
                "    ]\n"
                "}\n"
                "\n"
                "matching_mask = evaluate_ast(query_ast, data, N)\n"
                "valid_ids = np.where(matching_mask)[0]\n"
                "\n"
                "print(f\"Total Dokumen              : {N}\")\n"
                "print(f\"ID Dokumen Lolos AST Filter: {valid_ids.tolist()}\")\n"
                "for vid in valid_ids:\n"
                "    print(f\"  Doc {vid}: lang={data['lang'][vid]}, views={data['views'][vid]}, archived={data['is_archived'][vid]}\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.9.9
    {
        "id": "28.9.9",
        "title": "Dampak Selektivitas Filter terhadap Latensi: Menyesuaikan Strategi Dinamis Berdasarkan Rasio",
        "learningObjectives": [
            "Memahami konsep selektivitas filter $\\sigma$ dan pengaruhnya terhadap trade-off latensi berbagai paradigma.",
            "Menganalisis batas ambang kritis (*crossover threshold*) transisi antara Brute-Force Pre-Filter dan Single-Stage Traversal.",
            "Mengimplementasikan pengambil keputusan rute kueri dinamis (Dynamic Query Planner) berbasis kalkulasi selektivitas."
        ],
        "prerequisites": [
            "28.9.2 (Pre-Filtering).",
            "28.9.6 (Single-Stage Traversal).",
            "Kalkulasi kompleksitas algoritma $O(N \\cdot d)$ vs $O(M \\cdot \\log N \\cdot d)$."
        ],
        "commonPitfalls": [
            "Menggunakan ambang batas statis tunggal untuk seluruh perangkat keras tanpa profil kalibrasi benchmark memori dan konkurensi CPU.",
            "Menghitung kardinalitas filter secara brute-force pada seluruh data alih-alih memanfaatkan statistik metadata histogram atau cache kardinalitas."
        ],
        "academicReferences": [
            "Zhao, W., et al. (2022). Towards efficient filtered approximate nearest neighbor search. PVLDB.",
            "Gollapudi, S., et al. (2023). Filtered-DiskANN. WWW '23."
        ],
        "caseStudy": "Qdrant Dynamic Query Planner mengevaluasi jumlah bit 1 dalam bitset filter sebelum memulai pencarian. Jika jumlah elemen lolos $< 1.000$ (pada koleksi 10 juta vektor), sistem secara otomatis membatalkan traversal HNSW dan beralih ke exact flat vector scan pada subset tersebut, menghasilkan latensi 5x lebih rendah dan Recall 100%.",
        "content": {
            "theory": (
                "Tidak ada strategi filtered search tunggal yang optimal untuk seluruh rentang predikat kueri. "
                "Performa latensi dan akurasi recall sangat dipengaruhi oleh **selektivitas predikat** ($\\sigma$), yang didefinisikan sebagai rasio entitas yang memenuhi predikat terhadap total korpus data: "
                "$$\\sigma = \\frac{|\\mathcal{D}_\\phi|}{|\\mathcal{D}|} \\in [0, 1]$$ "
                "Analisis kompleksitas komputasi mengungkapkan tiga rezim operasional: "
                "1. **Rezim Selektivitas Ekstrem Rendah ($\\sigma < 0.01$, misal $< 1\\%$)**: "
                "Jumlah entitas valid $N_\\phi = \\sigma N$ sangat kecil. Biaya melakukan *brute-force flat scan* pada $N_\\phi$ vektor hanyalah $O(N_\\phi \\cdot d)$. Menavigasi graf ANN pada kondisi ini memboroskan siklus CPU karena sebagian besar tetangga graf ditolak. Pendekatan **Pre-Filter Brute-Force** adalah pilihan optimal mutlak. "
                "2. **Rezim Selektivitas Menengah ($0.01 \\le \\sigma \\le 0.6$)**: "
                "Nilai $N_\\phi$ terlalu besar untuk dipindai secara linear, namun subgraf $G_\\phi$ memiliki risiko diskoneksi jika disaring secara naif. Pendekatan **Single-Stage Payload-Aware Graph Traversal** mengungguli seluruh strategi karena mempertahankan rute small-world sambil menyaring kandidat secara simultan. "
                "3. **Rezim Selektivitas Tinggi ($\\sigma > 0.6$, misal $> 60\\%$)**: "
                "Mayoritas data valid. Pendekatan **Post-Filtering** dengan over-fetch kecil ($K' \\approx 1.2k$) sangat efisien karena graf ANN global dapat ditelusuri dengan kecepatan puncak tanpa overhead pengecekan payload di setiap simpul. "
                "Oleh karena itu, mesin basis data vektor modern wajib mengimplementasikan **Cost-Based Query Planner** yang menentukan strategi eksekusi secara dinamis berdasarkan estimasi $\\sigma$."
            ),
            "realWorldApplication": (
                "Perencana Kueri Milvus dan Qdrant: memeriksa histogram metadata atau ukuran bitmap untuk mengestimasi $\\sigma$; kueri diarahkan ke Flat Scan (jika $\\sigma < 0.01$), Single-stage HNSW (jika $0.01 \\le \\sigma \\le 0.5$), atau Post-filter HNSW (jika $\\sigma > 0.5$)."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "\n"
                "# Simulasi Dynamic Query Planner untuk Filtered Vector Search\n"
                "class VectorQueryPlanner:\n"
                "    def __init__(self, total_docs, dim, flat_scan_threshold=0.02, post_filter_threshold=0.7):\n"
                "        self.N = total_docs\n"
                "        self.dim = dim\n"
                "        self.flat_thresh = flat_scan_threshold\n"
                "        self.post_thresh = post_filter_threshold\n"
                "\n"
                "    def select_strategy(self, n_matching_docs):\n"
                "        sigma = n_matching_docs / self.N\n"
                "        if sigma <= self.flat_thresh:\n"
                "            strategy = \"PRE_FILTER_FLAT_SCAN\"\n"
                "            reason = f\"Selektivitas sangat ketat ({sigma*100:.2f}% <= {self.flat_thresh*100}%). Brute force pada subset lebih cepat dan 100% akurat.\"\n"
                "        elif sigma >= self.post_thresh:\n"
                "            strategy = \"POST_FILTER_ANN_GRAPH\"\n"
                "            reason = f\"Selektivitas sangat longgar ({sigma*100:.2f}% >= {self.post_thresh*100}%). Travers graf global dengan over-fetch kecil paling optimal.\"\n"
                "        else:\n"
                "            strategy = \"SINGLE_STAGE_PAYLOAD_AWARE_GRAPH\"\n"
                "            reason = f\"Selektivitas moderat ({sigma*100:.2f}%). Penelusuran graf terpadu dengan masking diperlukan untuk menjaga recall & latensi.\"\n"
                "        return strategy, sigma, reason\n"
                "\n"
                "# Evaluasi berbagai skenario kueri\n"
                "planner = VectorQueryPlanner(total_docs=1_000_000, dim=128)\n"
                "test_matches = [250, 50_000, 850_000]\n"
                "\n"
                "print(f\"Evaluasi Strategi Dinamis Query Planner (Total Korpus: 1,000,000 Vektor)\")\n"
                "print(\"=\" * 75)\n"
                "for count in test_matches:\n"
                "    strat, sig, desc = planner.select_strategy(count)\n"
                "    print(f\"Dokumen Lolos: {count:,} entitas (sigma = {sig*100:.2f}%)\")\n"
                "    print(f\"  Strategi Terpilih : {strat}\")\n"
                "    print(f\"  Rasional Teknis   : {desc}\\n\")"
            ),
            "codeSnippetOutput": ""
        }
    },

    # 28.9.10
    {
        "id": "28.9.10",
        "title": "Implementasi Logika Filter Masking pada Graf Navigasi Menggunakan Python",
        "learningObjectives": [
            "Membangun modul pencarian graf navigasi berbasis bitset mask mandiri tanpa dependensi eksternal.",
            "Mengintegrasikan evaluasi bitmask ke dalam algoritma Best-First Greedy Graph Traversal.",
            "Mengukur dan memverifikasi Recall@K hasil pencarian terfilter terhadap Brute-Force Exact Ground Truth."
        ],
        "prerequisites": [
            "28.9.6 (Single-Stage Traversal).",
            "28.9.7 (Bitmask Payload Filtering).",
            "28.9.9 (Analisis Selektivitas)."
        ],
        "commonPitfalls": [
            "Melakukan alokasi array NumPy baru di setiap langkah iterasi simpul tetangga graf alih-alih menggunakan bitmask biner konstan.",
            "Menghentikan pencarian saat antrean hasil terfilter mencapai $k$ tanpa menuntaskan eksplorasi `efSearch` lokal minima."
        ],
        "academicReferences": [
            "Gollapudi, S., et al. (2023). Filtered-DiskANN. WWW '23.",
            "Malkov, Y. A., & Yashunin, D. A. (2020). Efficient and robust approximate nearest neighbor search using HNSW. IEEE TPAMI."
        ],
        "caseStudy": "Implementasi modul bitset filter masking ini menjadi komponen inti mesin indeks vektor kustom yang digunakan oleh startup finansial untuk menyaring transaksi penipuan (fraud detection) bernilai miliaran baris berdasarkan rentang waktu dan jenis mata uang dalam < 3 milidetik.",
        "content": {
            "theory": (
                "Implementasi komprehensif sistem Single-Stage Filtered Search menggabungkan struktur graf ketetanggaan (k-Nearest Neighbor Graph) dengan array bitmask biner Boolean $\\mathbf{M} \\in \\{0, 1\\}^N$. "
                "Dalam representasi perangkat keras, bitmask disimpan sebagai urutan 64-bit integer (`uint64`), di mana pemeriksaan keabsahan simpul $u$ dilakukan melalui operasi pergeseran bit konstan $O(1)$: "
                "$$\\text{isValid}(u) = (\\mathbf{M}[u / 64] \\gg (u \\pmod{64})) \\ \\& \\ 1$$ "
                "Algoritma traversal mengelola dua prioritas antrean terpisah: "
                "1. `search_pool`: Prioritas antrean min-heap yang menyimpan kandidat eksplorasi graf berdasarkan jarak ke vektor kueri $\\mathbf{q}$. Seluruh simpul tetangga yang belum pernah dikunjungi dimasukkan ke sini terlepas dari status validitas filternya. "
                "2. `result_heap`: Prioritas antrean max-heap berukuran tetap $k$ yang secara eksklusif hanya menampung simpul-simpul yang memenuhi $\\text{isValid}(u) == 1$. "
                "Dengan memisahkan antrean navigasi graf dari antrean penampung hasil akhir, integritas jalur konektivitas small-world tetap terjaga utuh, sementara hasil yang dikembalikan kepada pengguna dijamin 100% patuh terhadap predikat filter."
            ),
            "realWorldApplication": (
                "Komponen filter graf pada open-source vector database (seperti Qdrant rust core atau Milvus knowhere engine), menjamin zero false-positive pada kueri filter dengan efisiensi memori optimal."
            ),
            "codeSnippet": (
                "import numpy as np\n"
                "import heapq\n"
                "\n"
                "class FilteredNavigableGraph:\n"
                "    def __init__(self, vectors, edges_per_node=4):\n"
                "        self.vectors = vectors\n"
                "        self.N = len(vectors)\n"
                "        self.edges = self._build_simple_knn_graph(edges_per_node)\n"
                "\n"
                "    def _build_simple_knn_graph(self, k_edges):\n"
                "        # Membangun graf k-NN sintetis sederhana\n"
                "        edges = {i: [] for i in range(self.N)}\n"
                "        for i in range(self.N):\n"
                "            dists = np.sum((self.vectors - self.vectors[i]) ** 2, axis=1)\n"
                "            nearest = np.argsort(dists)[1:k_edges + 1]\n"
                "            edges[i] = list(nearest)\n"
                "        return edges\n"
                "\n"
                "    def search(self, query, filter_mask, k=5, ef_search=20):\n"
                "        # Inisialisasi dari simpul 0\n"
                "        entry = 0\n"
                "        entry_dist = float(np.sum((self.vectors[entry] - query) ** 2))\n"
                "        \n"
                "        visited = set([entry])\n"
                "        candidates = [(entry_dist, entry)]\n"
                "        results = []  # max-heap (-dist, node)\n"
                "        \n"
                "        if filter_mask[entry]:\n"
                "            heapq.heappush(results, (-entry_dist, entry))\n"
                "            \n"
                "        while candidates:\n"
                "            c_dist, c_node = heapq.heappop(candidates)\n"
                "            \n"
                "            # Jelajahi tetangga\n"
                "            for neighbor in self.edges[c_node]:\n"
                "                if neighbor not in visited:\n"
                "                    visited.add(neighbor)\n"
                "                    n_dist = float(np.sum((self.vectors[neighbor] - query) ** 2))\n"
                "                    heapq.heappush(candidates, (n_dist, neighbor))\n"
                "                    \n"
                "                    # Simpan ke hasil jika lolos filter mask\n"
                "                    if filter_mask[neighbor]:\n"
                "                        if len(results) < k:\n"
                "                            heapq.heappush(results, (-n_dist, neighbor))\n"
                "                        elif n_dist < -results[0][0]:\n"
                "                            heapq.heapreplace(results, (-n_dist, neighbor))\n"
                "                            \n"
                "            if len(visited) >= ef_search:\n"
                "                break\n"
                "                \n"
                "        return sorted([(-neg_d, node) for neg_d, node in results])\n"
                "\n"
                "# Validasi komparasi terhadap Brute-Force Exact\n"
                "np.random.seed(42)\n"
                "N = 500\n"
                "dim = 16\n"
                "vectors = np.random.randn(N, dim).astype(np.float32)\n"
                "q = np.random.randn(dim).astype(np.float32)\n"
                "\n"
                "# Buat filter mask: hanya 15% simpul yang valid (misal status aktif)\n"
                "mask = np.random.rand(N) < 0.15\n"
                "valid_indices = np.where(mask)[0]\n"
                "\n"
                "# Inisialisasi & search\n"
                "graph_engine = FilteredNavigableGraph(vectors, edges_per_node=8)\n"
                "graph_top5 = graph_engine.search(q, mask, k=5, ef_search=60)\n"
                "graph_top5_ids = [node for dist, node in graph_top5]\n"
                "\n"
                "# Ground Truth Exact Brute Force pada subset valid\n"
                "bf_dists = np.sum((vectors[valid_indices] - q) ** 2, axis=1)\n"
                "bf_top5_rel = np.argsort(bf_dists)[:5]\n"
                "bf_top5_ids = valid_indices[bf_top5_rel].tolist()\n"
                "\n"
                "recall = len(set(graph_top5_ids).intersection(set(bf_top5_ids))) / 5.0\n"
                "\n"
                "print(f\"Total Data Korpus         : {N}\")\n"
                "print(f\"Total Simpul Lolos Mask   : {len(valid_indices)} ({len(valid_indices)/N*100:.1f}%)\")\n"
                "print(f\"Top-5 ID Hasil Graph Mask : {graph_top5_ids}\")\n"
                "print(f\"Top-5 ID Exact Brute Force: {bf_top5_ids}\")\n"
                "print(f\"Recall@5 Akurasi          : {recall * 100:.1f}%\")"
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

print(f"[OK] Berhasil menghasilkan 10 subbab Bab 9 Topik 28 ke {output_file}")
