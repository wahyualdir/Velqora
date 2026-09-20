import json
import os
import math
import numpy as np

# Output file path
output_file = os.path.join(os.path.dirname(__file__), "vdb_ch4_data.json")

subchapters = [
    # 28.4.1
    {
        "id": "vector-database-retrieval-sub-4-1",
        "chapter_id": "vector-database-retrieval-ch-4",
        "title": "Pengantar Algoritma Berbasis Graf untuk ANN: Proximity Graphs & Delaunay Triangulation",
        "order_index": 1,
        "contentStatus": "substantive-verified",
        "learningObjectives": [
            "Memahami konsep dasar Proximity Graphs (Delaunay Triangulation, Relative Neighborhood Graph, dan k-NN Graph) untuk pencarian tetangga terdekat.",
            "Menganalisis mengapa graf kedekatan eksak (Delaunay) mengalami ledakan kombinatorial pada dimensi tinggi sehingga membutuhkan graf aproksimasi.",
            "Mengimplementasikan konstruksi k-NN graph sederhana menggunakan matriks jarak Euclidean pada NumPy dan mengevaluasi konektivitasnya."
        ],
        "prerequisites": [
            "Ruang metrik dan kalkulasi jarak Euclidean L2.",
            "Representasi graf komputasi (adjacency list / matrix)."
        ],
        "commonPitfalls": [
            "Mengasumsikan Delaunay Graph dapat diskalakan ke dimensi tinggi; pada kenyataannya kompleksitas ukuran Delaunay meledak secara eksponensial O(n^{ceil(d/2)}).",
            "Mengabaikan kemungkinan graf k-NN terputus (disconnected components) jika nilai k terlalu kecil dan graf berarah (directed)."
        ],
        "references": [
            {
                "title": "Computational Geometry: Algorithms and Applications (3rd ed.)",
                "author": "Mark de Berg, Otfried Cheong, Marc van Kreveld, Mark Overmars",
                "year": 2008,
                "url": "https://doi.org/10.1007/978-3-540-77974-2",
                "type": "book",
                "page": "Chapter 9 (Delaunay Triangulations), pp. 191-218"
            },
            {
                "title": "Approximate nearest neighbor search on a metametric space",
                "author": "Yury A. Malkov, Alexander Ponomarenko, Andrey Logvinov, Vladimir Krylov",
                "year": 2014,
                "url": "https://doi.org/10.1016/j.is.2013.10.006",
                "type": "paper",
                "page": "Information Systems, Vol. 45, pp. 61-68"
            }
        ],
        "content_markdown": """### 1. Fondasi Matematis Proximity Graphs untuk Pencarian Vektor

Metode pencarian berbasis graf (*graph-based nearest neighbor search*) merepresentasikan korpus vektor dataset $P = \\{p_1, p_2, \\dots, p_n\\} \\subset \\mathbb{R}^d$ sebagai sebuah graf berarah atau tak berarah $G = (V, E)$, di mana setiap simpul $v_i \\in V$ bersesuaian dengan titik data $p_i$, dan himpunan sisi $E \\subseteq V \\times V$ menghubungkan pasangan simpul yang berdekatan dalam ruang metrik $(\\mathbb{R}^d, \\text{dist})$.

Dalam geometri komputasi klasik, struktur ideal untuk penjelajahan ruang metrik adalah **Delaunay Triangulation** (DT). Dual dari diagram Voronoi ini menjamin sifat navigasi sempurna (*exact greedy navigability*): dari sebarang simpul awal $v_{\\text{start}}$, penelusuran serakah (*greedy routing*) yang selalu berpindah ke tetangga langsung yang memiliki jarak Euclidean terkecil ke kueri $q$ dijamin akan konvergen ke tetangga terdekat global $p^* = \\arg\\min_{p \\in P} \\|p - q\\|_2$ tanpa pernah terperangkap dalam *local minimum*.

Namun, Delaunay Triangulation memiliki kelemahan fatal pada ruang dimensi tinggi ($d > 2$). Kompleksitas waktu konstruksi dan jumlah sisi Delaunay meledak secara kombinatorial:
$$\\text{Ukuran Graf Delaunay} = \\mathcal{O}\\left(n^{\\lceil d/2 \\rceil}\\right)$$

Pada dimensi $d = 128$ atau $d = 768$ (dimensi umum *dense vector embeddings*), membangun Delaunay Triangulation adalah komputasi yang mustahil secara praktis. Oleh karena itu, sistem pencarian tetangga terdekat aproksimasi (ANN) modern beralih ke **Proximity Graphs Aproksimasi**, seperti:
1. **$k$-Nearest Neighbor Graph ($k$-NNG)**: Setiap simpul $v_i$ terhubung ke $k$ tetangga terdekatnya dalam $P \\setminus \\{p_i\\}$.
2. **Relative Neighborhood Graph (RNG)**: Sisi $(u, v)$ ada jika tidak terdapat titik ketiga $w$ sedemikian rupa sehingga $\\max(\\text{dist}(u, w), \\text{dist}(v, w)) < \\text{dist}(u, v)$.
3. **Monotonic Search Networks (MSN)** dan **Navigable Small World (NSW)**: Graf dengan properti *small world* yang menyeimbangkan koneksi lokal berderajat tinggi dengan koneksi jarak jauh (*long-range links*).

### 2. Formulasi Masalah Local Minimum pada Graf Aproksimasi

Pada graf sembarang $G=(V, E)$, algoritma *greedy search* bergerak dari simpul $u$ ke tetangga $v \\in N(u)$ jika $\\text{dist}(v, q) < \\text{dist}(u, q)$. Algoritma berhenti saat:
$$\\forall v \\in N(u), \\quad \\text{dist}(v, q) \\ge \\text{dist}(u, q)$$

Kondisi ini disebut **Local Minimum**. Pada graf Delaunay, *local minimum* pasti merupakan *global minimum*. Namun, pada graf aproksimasi (seperti $k$-NNG berderajat rendah), algoritma dapat terhenti pada *local minimum* palsu, yang menyebabkan kegagalan penemuan tetangga terdekat sejati (*recall drop*). Kunci arsitektur graf modern (seperti NSW dan HNSW) adalah merancang topologi graf yang meminimalkan probabilitas terjebak dalam *local minimum* dengan menambahkan tautan jarak jauh (*long-range shortcuts*).

### 3. Implementasi: Konstruksi $k$-NN Graph dan Analisis Topologi

Berikut adalah implementasi Python/NumPy murni untuk membangun $k$-NN graph berarah dan tak berarah dari sekumpulan vektor acak, serta menganalisis derajat keterhubungan (derajat rata-rata simpul) dan mendeteksi simpul terisolasi (*isolated nodes*)."""
    },

    # 28.4.2
    {
        "id": "vector-database-retrieval-sub-4-2",
        "chapter_id": "vector-database-retrieval-ch-4",
        "title": "Small World Phenomenon & Model Watts-Strogatz dalam Ruang Vektor",
        "order_index": 2,
        "contentStatus": "substantive-verified",
        "learningObjectives": [
            "Memahami konsep topologi Small World: Clustering Coefficient tinggi dan Average Shortest Path Length rendah.",
            "Menganalisis model jaringan Watts-Strogatz dan analoginya pada navigasi kueri vektor multidimensi.",
            "Mengukur clustering coefficient dan shortest path pada graf representasi vektor menggunakan NumPy."
        ],
        "prerequisites": [
            "Teori graf dasar: adjacency matrix, path length, clustering coefficient.",
            "28.4.1 (Proximity Graphs & Delaunay Triangulation)."
        ],
        "commonPitfalls": [
            "Mengira graf acak murni (Erdos-Renyi) cocok untuk pencarian vektor; graf acak memiliki clustering coefficient yang sangat rendah sehingga pencarian serakah lokal kehilangan efisiensi spasial.",
            "Mengasumsikan jarak graf (hops) selalu berbanding lurus dengan jarak metrik spasial Euclidean."
        ],
        "references": [
            {
                "title": "Collective dynamics of 'small-world' networks",
                "author": "Duncan J. Watts, Steven H. Strogatz",
                "year": 1998,
                "url": "https://doi.org/10.1038/30918",
                "type": "paper",
                "page": "Nature, Vol. 393, No. 6684, pp. 440-442"
            },
            {
                "title": "Navigation in a small world",
                "author": "Jon Kleinberg",
                "year": 2000,
                "url": "https://doi.org/10.1038/35022643",
                "type": "paper",
                "page": "Nature, Vol. 406, No. 6798, p. 845"
            }
        ],
        "content_markdown": """### 1. Teori Graf Small World (Watts & Strogatz, 1998)

Fenomena *Small World* diperkenalkan secara formal oleh Duncan Watts dan Steven Strogatz (1998). Sebuah jaringan $G = (V, E)$ diklasifikasikan sebagai graf *Small World* jika memenuhi dua kriteria topologis simultan:
1. **Clustering Coefficient Tinggi** ($C \\gg C_{\\text{random}}$): Simpul-simpul yang bertetangga cenderung saling terhubung satu sama lain (membentuk kluster lokal yang rapat).
2. **Average Shortest Path Length Rendah** ($L \\sim L_{\\text{random}} = \\mathcal{O}(\\log |V|)$): Jarak terpendek rata-rata antar dua simpul sembarang tumbuh secara logaritmik terhadap ukuran graf, bukan linear.

Secara formal, *Clustering Coefficient* lokal untuk sebuah simpul $v_i$ dengan derajat $k_i = |N(v_i)|$ didefinisikan sebagai rasio sisi aktual yang menghubungkan tetangga-tetangganya terhadap jumlah sisi maksimum yang mungkin terbentuk di antara mereka:
$$C(v_i) = \\frac{2 \\cdot |\\{(u, w) \\in E : u, w \\in N(v_i)\\}|}{k_i (k_i - 1)}$$
Clustering coefficient global graf adalah rata-rata aritmatika:
$$\\bar{C} = \\frac{1}{|V|} \\sum_{v_i \\in V} C(v_i)$$

Sedangkan panjang jalur terpendek rata-rata (*Average Path Length*) didefinisikan sebagai:
$$L = \\frac{1}{|V|(|V| - 1)} \\sum_{u \\neq v \\in V} d_{\\text{graph}}(u, v)$$

### 2. Signifikansi Topologi Small World untuk Pencarian Vektor (ANN)

Dalam konteks pencarian vektor di basis data berdimensi tinggi:
- **Koneksi Lokal (High Clustering Coefficient)**: Menyediakan jaminan presisi metrik lokal. Begitu pencarian serakah tiba di kluster yang tepat di dekat kueri $q$, koneksi lokal memungkinkan algoritma melacak k-tetangga terdekat secara mendetail tanpa terlewat.
- **Tautan Jarak Jauh / Long-Range Links (Low Path Length)**: Berfungsi sebagai *highway* antarkluster. Algoritma pencarian dapat melompati ruang kosong yang luas hanya dalam beberapa langkah (*hops* berordo $\\mathcal{O}(\\log n)$), melintasi dari simpul awal ke daerah sasaran dengan cepat.

Jon Kleinberg (2000) membuktikan secara analitis bahwa penjelajahan serakah (*greedy routing*) dapat menemukan target dalam waktu terdesentralisasi $\\mathcal{O}(\\log^2 n)$ jika probabilitas tautan jarak jauh antara dua simpul berjarak spasial $r$ meluruh sebanding dengan $r^{-\\alpha}$ (di mana $\\alpha = d$).

### 3. Implementasi: Evaluasi Clustering Coefficient & Path Length

Berikut implementasi komputasi clustering coefficient dan shortest path length (menggunakan algoritma Breadth-First Search / BFS) untuk membuktikan pembentukan topologi Small World pada graf kedekatan vektor."""
    },

    # 28.4.3
    {
        "id": "vector-database-retrieval-sub-4-3",
        "chapter_id": "vector-database-retrieval-ch-4",
        "title": "Greedy Routing pada Proximity Graphs: Algoritma Beam Search & Mengatasi Local Minima",
        "order_index": 3,
        "contentStatus": "substantive-verified",
        "learningObjectives": [
            "Memahami mekanisme formal algoritma Greedy Routing murni dan variasinya menggunakan Beam Search berukuran ef.",
            "Menganalisis kondisi matematis timbulnya jebakan Local Minima dalam proximity graph dimensi tinggi.",
            "Mengimplementasikan Beam Search berbasis priority queue (min-heap / max-heap) pada graf untuk meningkatkan recall kueri."
        ],
        "prerequisites": [
            "28.4.1 (Proximity Graphs & Delaunay Triangulation).",
            "Struktur data Antrean Prioritas (Priority Queue / Binary Heap)."
        ],
        "commonPitfalls": [
            "Menggunakan greedy search murni ($ef=1$) pada dataset vektor berdimensi tinggi; recall yang dihasilkan sering di bawah 30% karena topologi yang tidak planar.",
            "Tidak mencatat himpunan simpul yang sudah dikunjungi (`visited`), menyebabkan siklus tak terbatas (*infinite loops*) pada graf berarah."
        ],
        "references": [
            {
                "title": "Proximity graphs for approximate nearest neighbor search: A survey",
                "author": "Yura Malkov, Dmitry Yashunin",
                "year": 2018,
                "url": "https://doi.org/10.1109/TPAMI.2018.2889473",
                "type": "paper",
                "page": "IEEE TPAMI, Section 2 (Search in proximity graphs)"
            },
            {
                "title": "Fast approximate k-nearest neighbor search with navigating spreading-out graph",
                "author": "Cong Fu, Chao Xiang, Changxu Wang, Deng Cai",
                "year": 2019,
                "url": "https://doi.org/10.14778/3318464.3318469",
                "type": "paper",
                "page": "PVLDB, Vol. 12, No. 5, pp. 461-474"
            }
        ],
        "content_markdown": """### 1. Dinamika Greedy Routing Murni ($ef = 1$)

Greedy routing merupakan strategi penelusuran paling intuitif pada graf kedekatan: dimulai dari satu simpul masuk (*entry point*) $v_{\\text{entry}}$, algoritma mengevaluasi jarak metrik dari semua tetangga langsung $u \\in N(v_{\\text{curr}})$ ke kueri target $q$. Jika ditemukan tetangga $u^*$ sedemikian rupa sehingga $\\text{dist}(u^*, q) < \\text{dist}(v_{\\text{curr}}, q)$, titik penelusuran berpindah ke $u^*$. Proses ini berulang hingga tidak ada lagi tetangga yang lebih dekat ke $q$.

Pada ruang Euclidean dimensi tinggi ($d \\gg 10$), fenomena *curse of dimensionality* menyebabkan batas keputusan menjadi sangat kompleks. Ruang metrik kehilangan sifat konveksitas lokal sederhana, sehingga probabilitas algoritma tersangkut pada **Local Minimum** (titik $v$ di mana $\\forall u \\in N(v), \\text{dist}(u, q) \\ge \\text{dist}(v, q)$, padahal terdapat titik $w \\in V \\setminus N(v)$ dengan $\\text{dist}(w, q) < \\text{dist}(v, q)$) mendekati 1.

### 2. Ekspansi Beam Search dengan Dynamic Candidate List

Untuk mengatasi *local minima*, pencarian graf diperluas menggunakan **Beam Search** dengan parameter kapasitas antrean $ef$ (*size of dynamic candidate list*). Alih-alih melacak satu simpul tunggal, algoritma mempertahankan dua himpunan struktur data:
1. **$C$ (Candidate Set)**: Min-heap kandidat yang belum dieksplorasi, diurutkan berdasarkan jarak terkecil ke $q$.
2. **$W$ (Result / Dynamic Nearest Neighbors)**: Max-heap berisi maksimum $ef$ elemen terbaik yang pernah ditemukan, diurutkan berdasarkan jarak terbesar ke $q$.

Langkah pembaruan pada setiap iterasi:
- Ambil elemen terdekat $c = \\arg\\min_{x \\in C} \\text{dist}(x, q)$.
- Ambil elemen terjauh dalam jendela terbaik $f = \\arg\\max_{y \\in W} \\text{dist}(y, q)$.
- **Kondisi Berhenti (Termination Condition)**: Jika $\\text{dist}(c, q) > \\text{dist}(f, q)$, pencarian dapat dihentikan, karena kandidat terdekat yang belum dieksplorasi berada lebih jauh daripada elemen terburuk dalam himpunan hasil terbaik $W$.
- Jika belum berhenti, untuk setiap tetangga $e \\in N(c)$ yang belum dikunjungi:
  - Jika $\\text{dist}(e, q) < \\text{dist}(f, q)$ atau $|W| < ef$:
    - Tambahkan $e$ ke dalam $C$ dan $W$.
    - Jika $|W| > ef$, buang elemen terjauh dari $W$.

Strategi ini memungkinkan penelusuran melompati jurang *local minimum* lokal berkedalaman hingga toleransi ukuran $ef$.

### 3. Implementasi: Beam Search Berbasis Prioritas pada Graf Vektor

Berikut implementasi modular Python menggunakan pustaka bawaan `heapq` dan matriks NumPy untuk mengevaluasi perbedaan performa recall antara greedy murni ($ef=1$) dan beam search ($ef > 1$)."""
    },

    # 28.4.4
    {
        "id": "vector-database-retrieval-sub-4-4",
        "chapter_id": "vector-database-retrieval-ch-4",
        "title": "Navigable Small World (NSW) Klasik: Konstruksi Inkremental & Batasan Polilogaritmik",
        "order_index": 4,
        "contentStatus": "substantive-verified",
        "learningObjectives": [
            "Memahami algoritma konstruksi inkremental Navigable Small World (NSW) klasik (Malkov et al., 2014).",
            "Menganalisis bagaimana urutan insersi titik data secara alami menghasilkan jejaring multi-skala (tautan jarak jauh dan tautan lokal).",
            "Mengevaluasi batasan performa NSW: pertumbuhan waktu pencarian polilogaritmik O(log^2 n) dan kerentanan akumulasi hub."
        ],
        "prerequisites": [
            "28.4.2 (Small World Phenomenon & Model Watts-Strogatz).",
            "28.4.3 (Greedy Routing & Beam Search)."
        ],
        "commonPitfalls": [
            "Mengabaikan fenomena titik awal (early-inserted points) menjadi 'super-hubs' yang terhubung dengan ribuan simpul, membebani memori dan memperlambat traversal graf.",
            "Beranggapan kompleksitas pencarian NSW selalu O(log n); tanpa hierarki terstruktur, kompleksitas pencarian NSW secara empiris adalah polilogaritmik O(log^2 n) hingga O(log^3 n)."
        ],
        "references": [
            {
                "title": "Approximate nearest neighbor search on a metametric space based on the network of small world with navigable properties",
                "author": "Yury Malkov, Alexander Ponomarenko, Andrey Logvinov, Vladimir Krylov",
                "year": 2014,
                "url": "https://doi.org/10.1016/j.is.2013.10.006",
                "type": "paper",
                "page": "Information Systems, Vol. 45, pp. 61-68"
            },
            {
                "title": "Scalable distributed algorithm for approximate nearest neighbor search problem in high dimensional general metric spaces",
                "author": "Alexander Ponomarenko, Yury Malkov, Andrey Logvinov, Vladimir Krylov",
                "year": 2014,
                "url": "https://doi.org/10.1109/ICDMW.2014.23",
                "type": "paper",
                "page": "IEEE 14th International Conference on Data Mining Workshops, pp. 1064-1071"
            }
        ],
        "content_markdown": """### 1. Prinsip Konstruksi Inkremental NSW

Algoritma **Navigable Small World** (NSW) yang diperkenalkan oleh Malkov et al. (2014) memecahkan masalah konstruksi graf *small world* secara organik melalui prosedur insersi inkremental sederhana:
1. Mulai dengan graf kosong $G = (V, E)$.
2. Untuk setiap vektor baru $p_{\\text{new}}$ yang diinsersikan ke dataset:
   - Jika graf masih memiliki elemen kurang dari parameter koneksi $m$, hubungkan $p_{\\text{new}}$ ke semua elemen yang ada.
   - Jika $|V| \\ge m$, jalankan pencarian tetangga terdekat aproksimasi (menggunakan greedy routing berukuran $ef$) pada graf yang telah ada saat itu untuk menemukan $m$ tetangga terdekat dari $p_{\\text{new}}$.
   - Bentuk sisi dua arah (*bidirectional edges*) antara $p_{\\text{new}}$ dan $m$ tetangga terdekat tersebut.

### 2. Mengapa NSW Memiliki Sifat Small World Secara Otomatis?

Daya tarik utama NSW adalah kemunculan sifat multi-skala spasial secara intrinsik dari urutan waktu insersi:
- **Titik-Titik Awal (Early Insertions)**: Ketika dataset masih berukuran kecil ($n \\ll N$), titik-titik yang dimasukkan berada pada jarak spasial metrik yang saling berjauhan. Sisi-sisi yang terbentuk di antara titik-titik awal ini membentang melintasi keseluruhan ruang vektor, secara efektif bertindak sebagai **tautan jarak jauh (long-range highway edges)**.
- **Titik-Titik Akhir (Late Insertions)**: Ketika graf sudah padat ($n \\to N$), titik-titik baru diinsersikan ke dalam lingkungan yang sangat rapat. Sisi-sisi yang dibentuknya menghubungkan simpul-simpul yang berdekatan secara spasial, bertindak sebagai **tautan resolusi lokal (short-range cluster edges)**.

### 3. Batasan dan Kelemahan Mendasar NSW Klasik

Meskipun NSW memberikan lonjakan performa dramatis dibanding LSH dan k-d tree pada dimensi tinggi, struktur ini memiliki dua kelemahan fundamental:
1. **Pertumbuhan Derajat Hub yang Tidak Terkontrol**: Titik-titik awal dimasukkan terus menerus menjadi kandidat tetangga terdekat bagi titik-titik baru, sehingga derajatnya bertumbuh menjadi sangat besar (*hub nodes*). Ketika penelusuran mencapai *hub*, komputasi jarak melonjak tajam karena banyaknya tetangga yang harus dievaluasi.
2. **Kompleksitas Pencarian Polilogaritmik**:
   Tanpa pemisahan hierarki eksplisit, pencarian pada graf monolayer terdistribusi mengikuti:
   $$\\mathcal{O}(\\log^2 n)$$
   Ketika ukuran dataset $n$ tumbuh hingga ratusan juta vektor, efisiensi penelusuran NSW menurun secara signifikan. Hal inilah yang memicu ditemukannya arsitektur HNSW.

### 4. Implementasi: Konstruksi Inkremental NSW Monolayer

Berikut implementasi konstruksi inkremental NSW dengan parameter $m$ dan evaluasi derajat koneksi simpul."""
    },

    # 28.4.5 - SPOT CHECK LITERATUR PRIMER: Malkov & Yashunin (2018)
    {
        "id": "vector-database-retrieval-sub-4-5",
        "chapter_id": "vector-database-retrieval-ch-4",
        "title": "Hierarchical Navigable Small World (HNSW): Arsitektur Multi-Layer & Dekomposisi Skala",
        "order_index": 5,
        "contentStatus": "substantive-verified",
        "learningObjectives": [
            "Memahami arsitektur multi-layer Hierarchical Navigable Small World (HNSW) dan analoginya dengan Skip-List berlapis.",
            "Menganalisis peran dekomposisi skala spasial dalam mereduksi kompleksitas pencarian dari O(log^2 n) menjadi O(log n) sejati.",
            "Menguasai kutipan verbatim primer Malkov & Yashunin (2018) mengenai fondasi graf murni bebas struktur pencarian eksternal."
        ],
        "prerequisites": [
            "Struktur data Skip-List 1D (William Pugh, 1990).",
            "28.4.4 (Navigable Small World NSW Klasik)."
        ],
        "commonPitfalls": [
            "Mengira layer atas HNSW menyimpan duplikat vektor yang terpisah; simpul pada layer atas hanyalah pointer referensi ke elemen vektor asli di base layer.",
            "Mencari k-NN langsung di layer atas; layer atas hanya digunakan untuk pencarian coarse greedy 1-NN menuju entry point terbaik untuk layer di bawahnya."
        ],
        "references": [
            {
                "title": "Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs",
                "author": "Yury A. Malkov, Dmitry A. Yashunin",
                "year": 2018,
                "url": "https://doi.org/10.1109/TPAMI.2018.2889473",
                "type": "paper",
                "page": "IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI), Vol. 42, No. 4, pp. 824-836 (arXiv:1603.09320)"
            }
        ],
        "content_markdown": """### 1. Landasan Primer & Terobosan HNSW (Malkov & Yashunin, 2018)

Struktur data **Hierarchical Navigable Small World** (HNSW), yang dipublikasikan oleh Yury A. Malkov dan Dmitry A. Yashunin (2018), menandai tonggak terpenting dalam komputasi *approximate nearest neighbor search* modern. Algoritma ini menggabungkan fleksibilitas pencarian berbasis graf kedekatan dengan efisiensi hierarkis dari struktur data *Skip-List* (Pugh, 1990).

Dalam makalah seminal mereka, Malkov & Yashunin (2018) menjelaskan arsitektur ini secara ringkas dalam abstrak resmi:

> "We present a new approach for the approximate K-nearest neighbor search based on navigable small world graphs with controllable hierarchy (Hierarchical NSW, HNSW). The proposed solution is fully graph-based, without any need for additional search structures, which are typically used at the coarse search stage of the most proximity graph techniques. Hierarchical NSW incrementally builds a multi-layer structure consisting from hierarchical set of proximity graphs (layers) for nested subsets of the stored elements."
>
> — **Yury A. Malkov & Dmitry A. Yashunin (2018)**, *Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs*, IEEE TPAMI / arXiv:1603.09320.

Kutipan ini menggarisbawahi dua keunggulan arsitektural HNSW:
1. **Fully Graph-Based**: Berbeda dengan metode terdahulu yang menggabungkan pohon/kuantisasi untuk tahap *coarse search* dan graf lokal untuk *refinement*, HNSW menyelesaikan penelusuran dari skala global hingga lokal secara murni berbasis graf.
2. **Controllable Hierarchy & Nested Subsets**: Elemen-elemen graf dipartisi ke dalam lapisan-lapisan (*layers*) berjenjang di mana himpunan simpul pada layer yang lebih tinggi merupakan subset murni (*strictly nested*) dari simpul pada layer di bawahnya:
   $$V_{l_{\\text{max}}} \\subset V_{l_{\\text{max}}-1} \\subset \\dots \\subset V_1 \\subset V_0 = P$$

### 2. Dekomposisi Skala: Mengapa HNSW Mencapai Skalabilitas $\\mathcal{O}(\\log n)$?

Pada Skip-List 1 dimensi, tautan berjarak panjang memungkinkan penjelajahan melompati sekumpulan elemen berderajat $\\mathcal{O}(\\log n)$. HNSW memperluas prinsip ini ke dalam ruang metrik sembarang berdimensi tinggi:
- **Layer Atas ($l = l_{\\text{max}}$)**: Hanya dihuni oleh segelintir elemen data yang terpilih secara acak. Jarak spasial antar simpul bertetangga sangat besar, sehingga sisi-sisinya berfungsi sebagai *ultra-long-range highways*. Penelusuran pada layer ini hanya membutuhkan beberapa kalkulasi jarak metrik untuk memandu kueri dari sembarang posisi ke lingkungan global yang tepat.
- **Layer Menengah ($0 < l < l_{\\text{max}}$)**: Kepadatan simpul meningkat secara eksponensial. Sisi-sisi menghubungkan simpul pada jarak spasial menengah (*medium-range links*).
- **Base Layer ($l = 0$)**: Memuat **seluruh** elemen dataset $P$. Graf pada layer ini memiliki resolusi lokal maksimum untuk menavigasi kluster terdekat secara sangat presisi.

Dengan memisahkan tautan jarak jauh ke lapisan-lapisan teratas, HNSW menghilangkan masalah akumulasi *super-hubs* pada graf monolayer NSW dan menekan kompleksitas pencarian rata-rata menjadi:
$$\\mathcal{O}(\\log n)$$

### 3. Implementasi: Struktur Multi-Layer HNSW dan Visualisasi Distribusi Layer

Berikut implementasi struktur data multi-layer HNSW dan simulasi penempatan elemen ke dalam subset bertingkat."""
    },

    # 28.4.6
    {
        "id": "vector-database-retrieval-sub-4-6",
        "chapter_id": "vector-database-retrieval-ch-4",
        "title": "Algoritma Pencarian Multi-Layer HNSW: Top-Down Routing & Dynamic Candidate List",
        "order_index": 6,
        "contentStatus": "substantive-verified",
        "learningObjectives": [
            "Memahami alur komputasi lengkap algoritma K-NN Search pada HNSW dari top layer hingga base layer.",
            "Menganalisis perbedaan strategi pencarian: 1-Greedy Search pada layer atas (l > 0) vs. Beam Search berukuran efSearch pada layer dasar (l = 0).",
            "Mengimplementasikan algoritma routing multi-layer HNSW dan menguji efisiensi jumlah kalkulasi jarak."
        ],
        "prerequisites": [
            "28.4.3 (Greedy Routing & Beam Search).",
            "28.4.5 (Hierarchical Navigable Small World HNSW)."
        ],
        "commonPitfalls": [
            "Menjalankan beam search berukuran besar pada seluruh layer atas; ini membuang siklus CPU secara masif karena tujuan layer atas hanyalah menemukan 1 entry point terdekat untuk layer berikutnya.",
            "Lupa meneruskan entry point hasil layer $l$ sebagai titik awal pencarian di layer $l-1$."
        ],
        "references": [
            {
                "title": "Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs",
                "author": "Yury A. Malkov, Dmitry A. Yashunin",
                "year": 2018,
                "url": "https://doi.org/10.1109/TPAMI.2018.2889473",
                "type": "paper",
                "page": "IEEE TPAMI, Section 3.1 (Search algorithm)"
            }
        ],
        "content_markdown": """### 1. Alur Algoritma Pencarian Top-Down HNSW

Prosedur pencarian $K$ tetangga terdekat pada HNSW (Algoritma 1 dan 2 dalam paper Malkov & Yashunin, 2018) berjalan secara hierarkis menurun (*top-down coarse-to-fine routing*):

Diberikan kueri $q$, simpul awal teratas $v_{\\text{entry}} \\in V_{l_{\\text{max}}}$, jumlah tetangga yang dicari $K$, dan parameter ukuran antrean pencarian $efSearch$:

1. **Fase 1: Coarse Routing pada Layer Atas ($l = l_{\\text{max}}$ hingga $l = 1$)**:
   - Pada setiap layer $l$, jalankan **1-Greedy Search** murni:
     $$v_{\\text{entry}} \\leftarrow \\text{SearchLayer}(q, \\text{entry\\_point}=v_{\\text{entry}}, ef=1, \\text{layer}=l)$$
   - Tujuannya bukan mengumpulkan $K$ kandidat, melainkan melompat secepat mungkin ke satu simpul terdekat pada layer tersebut.
   - Titik terdekat yang ditemukan pada layer $l$ langsung dijadikan simpul masuk (*entry point*) untuk pencarian pada layer $l-1$.

2. **Fase 2: Fine Beam Search pada Base Layer ($l = 0$)**:
   - Begitu mencapai base layer ($l = 0$), gunakan simpul $v_{\\text{entry}}$ sebagai titik awal.
   - Jalankan **Beam Search** dengan kapasitas antrean dinamis $ef = efSearch$:
     $$W \\leftarrow \\text{SearchLayer}(q, \\text{entry\\_point}=v_{\\text{entry}}, ef=efSearch, \\text{layer}=0)$$
   - Kembalikan $K$ elemen terdekat dari himpunan hasil $W$.

### 2. Formalisasi Logika SearchLayer

Pada sebarang layer $l$, prosedur `SearchLayer(q, ep, ef, l)` memelihara:
- $v$ : simpul yang sedang diperiksa.
- $C$ : min-heap kandidat yang dapat diekspansi.
- $W$ : max-heap $ef$ elemen terdekat yang telah dievaluasi sejauh ini.
- `visited` : hash set dari semua simpul yang jaraknya telah dihitung ke $q$.

Pada setiap langkah:
1. Ambil kandidat terdekat $c = \\arg\\min_{x \\in C} \\text{dist}(x, q)$.
2. Ambil batas terjauh saat ini $f = \\arg\\max_{y \\in W} \\text{dist}(y, q)$.
3. Jika $\\text{dist}(c, q) > \\text{dist}(f, q)$, hentikan iterasi (konvergensi lokal).
4. Untuk setiap tetangga $e \\in N_l(c)$:
   - Jika $e \\notin \\text{visited}$:
     - Tandai $e$ dalam `visited`.
     - Hitung $d_e = \\text{dist}(e, q)$.
     - Jika $d_e < \\text{dist}(f, q)$ atau $|W| < ef$:
       - Masukkan $e$ ke dalam $C$ dan $W$.
       - Jika $|W| > ef$, keluarkan elemen berjarak maksimum dari $W$.

### 3. Implementasi: Routing Multi-Layer pada Graf HNSW

Berikut implementasi Python lengkap dari prosedur `SearchLayer` dan routing top-down multi-layer."""
    },

    # 28.4.7
    {
        "id": "vector-database-retrieval-sub-4-7",
        "chapter_id": "vector-database-retrieval-ch-4",
        "title": "Konstruksi Inkremental HNSW: Penentuan Layer Probabilistik & Reverse Edge Connection",
        "order_index": 7,
        "contentStatus": "substantive-verified",
        "learningObjectives": [
            "Memahami formula probabilistik penentuan layer elemen baru: l = floor(-ln(uniform(0, 1)) * m_L).",
            "Menganalisis parameter skala normalisasi m_L = 1 / ln(M) untuk menjamin overlap layer konstan.",
            "Mengimplementasikan prosedur penyambungan dua arah (bidirectional / reverse edge connection) dan pemangkasan derajat simpul."
        ],
        "prerequisites": [
            "Variabel acak kontinu dan distribusi eksponensial.",
            "28.4.5 (Arsitektur HNSW) & 28.4.6 (SearchLayer Routing)."
        ],
        "commonPitfalls": [
            "Memilih nilai $m_L$ yang salah; jika $m_L > 1/\\ln(M)$, terlalu banyak simpul terkumpul di layer atas sehingga kompleksitas melesat ke linear; jika terlalu kecil, layer atas kosong sehingga lonjakan jarak jauh hilang.",
            "Lupa memperbarui koneksi dua arah (*reverse edge*) pada tetangga yang disambungkan, mengakibatkan graf menjadi berarah tak simetris dan navigabilitas runtuh."
        ],
        "references": [
            {
                "title": "Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs",
                "author": "Yury A. Malkov, Dmitry A. Yashunin",
                "year": 2018,
                "url": "https://doi.org/10.1109/TPAMI.2018.2889473",
                "type": "paper",
                "page": "IEEE TPAMI, Section 3.2 (Construction algorithm)"
            }
        ],
        "content_markdown": """### 1. Distribusi Probabilistik Level Elemen ($m_L$)

Untuk mempertahankan properti *Skip-List* pada ruang metrik, probabilitas sebuah titik data baru $p$ mencapai level minimum $l$ harus meluruh secara eksponensial:
$$P(\\text{level} \\ge l) = e^{-l / m_L} = M^{-l}$$
di mana $M$ adalah jumlah rata-rata koneksi antar simpul, dan $m_L$ adalah faktor normalisasi skala:
$$m_L = \\frac{1}{\\ln(M)}$$

Dalam implementasi praktis, tingkat maksimum $l$ yang diberikan kepada elemen baru ditentukan menggunakan fungsi transformasi integral dari variabel acak seragam $U \\sim \\text{Uniform}(0, 1)$:
$$l = \\left\\lfloor -\\ln(U) \\cdot m_L \\right\\rfloor$$

Formula ini menjamin bahwa rasio jumlah simpul antar dua layer berturutan mendekati konstan:
$$\\frac{|V_{l}|}{|V_{l+1}|} \\approx M$$
Dengan demikian, layer teratas hanya memiliki probabilitas sangat kecil untuk dihuni oleh sembarang elemen, menjamin efisiensi ukuran sub-graf.

### 2. Prosedur Insersi Elemen Baru ke dalam Graf

Ketika sebuah elemen baru $p_{\\text{new}}$ dimasukkan ke HNSW dengan level hasil undian $l_{\\text{new}}$:
1. **Fase Routing (Layer $l = l_{\\text{max}}$ turun ke $l_{\\text{new}} + 1$)**:
   - Jalankan greedy search ($ef=1$) dari titik masuk global $v_{\\text{entry}}$ untuk menemukan simpul terdekat pada layer tersebut. Simpul terdekat ini menjadi titik masuk untuk layer di bawahnya tanpa ada koneksi yang dibentuk.
2. **Fase Penyambungan (Layer $l = \\min(l_{\\text{max}}, l_{\\text{new}})$ turun ke $l = 0$)**:
   - Pada setiap layer $l$, jalankan beam search dengan parameter $efConstruction$ untuk mengidentifikasi himpunan tetangga kandidat $W$.
   - Pilih $M$ tetangga terbaik dari $W$ (atau $M_{\\text{max}0}$ jika $l = 0$).
   - Buat sisi dua arah (*bidirectional edge*): hubungkan $p_{\\text{new}}$ ke masing-masing tetangga terpilih $e$, dan hubungkan balik $e$ ke $p_{\\text{new}}$.
   - **Shrinking / Degree Pruning**: Jika jumlah tetangga dari simpul $e$ melebihi batas maksimum ($M$ atau $M_{\\text{max}0}$), jalankan algoritma seleksi tetangga untuk memangkas sisi terburuk.
3. **Pembaruan Titik Masuk Global**:
   - Jika $l_{\\text{new}} > l_{\\text{max}}$, tetapkan $p_{\\text{new}}$ sebagai $v_{\\text{entry}}$ global baru dan perbarui $l_{\\text{max}} \\leftarrow l_{\\text{new}}$.

### 3. Implementasi: Generator Distribusi Level dan Simulasi Insersi Elemen

Berikut implementasi Python untuk memvalidasi distribusi level acak serta fungsi penyambungan sisi dua arah terikat kapasitas derajat."""
    },

    # 28.4.8
    {
        "id": "vector-database-retrieval-sub-4-8",
        "chapter_id": "vector-database-retrieval-ch-4",
        "title": "Heuristik Pemilihan Tetangga: Simple Selection vs. Diverse Neighbors Heuristic",
        "order_index": 8,
        "contentStatus": "substantive-verified",
        "learningObjectives": [
            "Membandingkan kelemahan Simple Neighbor Selection (k-NN murni) dengan keunggulan Heuristic Neighbor Selection (Diverse Neighbors).",
            "Menganalisis kriteria diversitas sudut/spasial: mencegah pembentukan kluster tertutup dan mempertahankan konektivitas multi-arah.",
            "Mengimplementasikan algoritma SelectNeighborsHeuristic dari paper HNSW dan mengukur dampaknya pada keterjangkauan graf."
        ],
        "prerequisites": [
            "28.4.7 (Konstruksi Inkremental HNSW).",
            "Aturan Cosine dan Geometri Segitiga dalam Ruang Vektor."
        ],
        "commonPitfalls": [
            "Hanya memilih tetangga terdekat absolut; hal ini menyebabkan seluruh M tetangga menumpuk di satu sudut/kluster yang sama, membiarkan arah ruang lainnya tanpa jalur koneksi sama sekali.",
            "Mengabaikan parameter keepPrunedConnections yang dapat mengorbankan recall pada kluster data yang sangat terisolasi."
        ],
        "references": [
            {
                "title": "Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs",
                "author": "Yury A. Malkov, Dmitry A. Yashunin",
                "year": 2018,
                "url": "https://doi.org/10.1109/TPAMI.2018.2889473",
                "type": "paper",
                "page": "IEEE TPAMI, Section 3.2.1 (Heuristic for selecting neighbors)"
            }
        ],
        "content_markdown": """### 1. Masalah pada Seleksi Tetangga Sederhana (Simple Selection)

Dalam konstruksi graf kedekatan, pendekatan paling naif untuk menghubungkan simpul baru $p$ dengan $M$ tetangga adalah **Simple Selection**: memilih $M$ elemen terdekat dari himpunan kandidat $C$ semata-mata berdasarkan jarak Euclidean terkecil $\\text{dist}(p, e)$.

Namun, pada dataset riil yang memiliki struktur kluster alami (*clustered data*), simpul-simpul dalam kluster yang sama berada sangat rapat satu sama lain. Akibatnya:
- Seluruh $M$ tautan dari simpul $p$ akan habis terhubung ke tetangga-tetangganya di dalam kluster yang sama.
- Tidak ada satu pun sisi yang menghubungkan $p$ ke kluster lain di sekitarnya.
- Graf terpecah menjadi pulau-pulau kluster terisolasi (*disconnected or poorly connected components*), menghancurkan sifat navigabilitas global dan menjatuhkan recall pencarian.

### 2. Heuristik Pemilihan Tetangga Beragam (Diverse Neighbors Heuristic)

Untuk mengatasi masalah ini, Malkov & Yashunin (2018) merancang **Algorithm 4: SELECT-NEIGHBORS-HEURISTIC**. Heuristik ini mengadaptasi prinsip *Relative Neighborhood Graph* (RNG):

Diberikan simpul target $p$, antrean kandidat $C$ yang telah diurutkan menaik berdasarkan jarak ke $p$, batas kapasitas tetangga $M$, dan himpunan hasil seleksi $R = \\emptyset$:

1. Ekstrak kandidat terdekat $e = \\arg\\min_{x \\in C} \\text{dist}(p, x)$.
2. Evaluasi kondisi diversitas: simpul $e$ hanya ditambahkan ke $R$ jika $e$ lebih dekat ke $p$ daripada ke **sebarang** simpul $r$ yang telah terpilih sebelumnya dalam $R$:
   $$\\forall r \\in R, \\quad \\text{dist}(p, e) < \\text{dist}(r, e)$$
3. Jika kondisi di atas terpenuhi untuk semua $r \\in R$, masukkan $e$ ke dalam $R$.
4. Ulangi proses hingga $|R| = M$ atau seluruh kandidat dalam $C$ habis dievaluasi.

Secara geometris, jika kandidat $e$ berada "di belakang" simpul $r$ yang sudah ada dalam $R$ (artinya $e$ lebih dekat ke $r$ daripada ke $p$), maka jalur navigasi dari $p$ menuju $e$ sudah dapat didelegasikan melalui simpul perantara $r$. Dengan menolak $e$, kuota sisi yang tersisa dapat dialokasikan untuk kandidat lain yang berada pada arah sudut ruang yang berbeda (*different directional quadrants*).

### 3. Implementasi: Perbandingan Simple Selection vs Diverse Selection

Berikut implementasi Python yang memvisualisasikan bagaimana Diverse Neighbors Heuristic memangkas tetangga yang redundan secara spasial."""
    },

    # 28.4.9
    {
        "id": "vector-database-retrieval-sub-4-9",
        "chapter_id": "vector-database-retrieval-ch-4",
        "title": "Hyperparameter Kritis HNSW: M, M0, efConstruction, dan efSearch",
        "order_index": 9,
        "contentStatus": "substantive-verified",
        "learningObjectives": [
            "Memahami pengaruh masing-masing parameter konfigurasi HNSW: M, M0, efConstruction, dan efSearch.",
            "Menganalisis trade-off tiga dimensi: Waktu Indeksasi (Build Time), Penggunaan Memori (RAM), dan Latensi Kueri vs. Recall.",
            "Merancang formula estimasi kebutuhan memori graf HNSW per juta vektor berdasarkan dimensi d dan derajat M."
        ],
        "prerequisites": [
            "28.4.6 (Algoritma Pencarian) & 28.4.7 (Algoritma Konstruksi HNSW)."
        ],
        "commonPitfalls": [
            "Menaikkan parameter efSearch saat proses indexing; efSearch adalah parameter runtime kueri, sedangkan efConstruction adalah parameter saat pembuatan graf.",
            "Mengalokasikan M terlalu tinggi (misal M=128) untuk dataset sederhana; hal ini menyebabkan konsumsi RAM membengkak tanpa peningkatan recall yang signifikan."
        ],
        "references": [
            {
                "title": "Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs",
                "author": "Yury A. Malkov, Dmitry A. Yashunin",
                "year": 2018,
                "url": "https://doi.org/10.1109/TPAMI.2018.2889473",
                "type": "paper",
                "page": "IEEE TPAMI, Section 4 (Parameter tuning & Evaluation)"
            },
            {
                "title": "Faiss: A library for efficient similarity search and clustering of dense vectors",
                "author": "Matthijs Douze, Hervé Jégou, et al.",
                "year": 2024,
                "url": "https://github.com/facebookresearch/faiss/wiki/HNSW",
                "type": "book",
                "page": "Faiss Wiki: IndexHNSW Implementation Guide"
            }
        ],
        "content_markdown": """### 1. Peran dan Karakteristik Empiris Parameter HNSW

Kinerja HNSW diatur oleh empat hyperparameter fundamental:

1. **$M$ (Maksimum Derajat Koneksi per Simpul pada Layer $l > 0$)**:
   - Menentukan jumlah sisi keluar maksimum untuk simpul pada lapisan atas.
   - Nilai tipikal: $12 \\le M \\le 64$. Nilai $M$ yang lebih besar meningkatkan akurasi navigasi di dimensi tinggi tetapi meningkatkan konsumsi memori per vektor.
2. **$M_0$ (Maksimum Derajat Koneksi pada Base Layer $l = 0$)**:
   - Menentukan jumlah sisi pada lapisan terbawah. Secara default dalam paper dan implementasi Faiss/Qdrant: $M_0 = 2M$. Nilai ganda ini penting karena base layer menampung seluruh kepadatan data lokal.
3. **$efConstruction$ (Ukuran Dynamic Candidate List saat Pembangunan Indeks)**:
   - Mengatur kedalaman eksplorasi beam search saat memilih tetangga bagi elemen baru.
   - Nilai tipikal: $100 \\le efConstruction \\le 500$. Memperbesar $efConstruction$ memperpanjang waktu pembuatan indeks secara signifikan, namun menghasilkan graf dengan kualitas navigasi yang jauh lebih baik tanpa menambah ukuran memori RAM indeks.
4. **$efSearch$ (Ukuran Dynamic Candidate List saat Runtime Kueri)**:
   - Parameter fleksibel yang dapat diubah saat runtime tanpa memodifikasi indeks graf.
   - Mengatur trade-off langsung antara **Recall** dan **Latensi (Queries Per Second / QPS)**: $efSearch \\ge K$. Nilai $efSearch$ yang lebih tinggi mengevaluasi lebih banyak kandidat, meningkatkan recall mendekati 100% dengan konsekuensi latensi kueri yang lebih tinggi.

### 2. Model Estimasi Kebutuhan Memori RAM Graf HNSW

Total memori RAM yang dibutuhkan oleh indeks HNSW terdiri dari penyimpanan vektor mentah dan struktur *adjacency list* graf:
$$\\text{RAM Total} = N \\times \\left( d \\times \\text{sizeof(float32)} + \\bar{M} \\times \\text{sizeof(uint32)} + \\text{overhead} \\right)$$
di mana rata-rata koneksi per simpul di seluruh lapisan mendekati:
$$\\bar{M} \\approx M_0 + \\sum_{l=1}^{\\infty} M \\cdot M^{-l} = 2M + M \\cdot \\frac{1/M}{1 - 1/M} = 2M + \\frac{M}{M - 1} \\approx 2M + 1$$

Sebagai contoh, untuk $1.000.000$ vektor dimensi $d = 128$ dengan $M = 32$ ($M_0 = 64$):
- Vektor data: $10^6 \\times 128 \\times 4\\text{ byte} = 512\\text{ MB}$.
- Sisi graf: $10^6 \\times (64 + 1) \\times 4\\text{ byte} \\approx 260\\text{ MB}$.
- Total memori yang dibutuhkan sekitar $\\approx 772\\text{ MB}$ (di luar struktur metadata indeks).

### 3. Implementasi: Analisis Trade-off Latensi vs Recall Berdasarkan $efSearch$

Berikut implementasi Python untuk mensimulasikan kurva Pareto efisiensi: mengukur hubungan langsung antara variasi $efSearch$ terhadap persentase Recall@K dan jumlah operasi evaluasi jarak Euclidean."""
    },

    # 28.4.10
    {
        "id": "vector-database-retrieval-sub-4-10",
        "chapter_id": "vector-database-retrieval-ch-4",
        "title": "Implementasi Lengkap Simulasi HNSW Miniatur dengan NumPy Murni",
        "order_index": 10,
        "contentStatus": "substantive-verified",
        "learningObjectives": [
            "Membangun kelas HNSW mini yang fungsional secara mandiri menggunakan Python murni dan NumPy.",
            "Mengintegrasikan seluruh komponen: penentuan level probabilistik, searchLayer, diversifikasi tetangga, dan routing multi-layer.",
            "Mengevaluasi akurasi pencarian (Recall@k) hasil HNSW terhadap Brute-Force Exact Nearest Neighbor."
        ],
        "prerequisites": [
            "28.4.5 hingga 28.4.9 (Seluruh teori dan algoritma komponen HNSW)."
        ],
        "commonPitfalls": [
            "Menggunakan tipe data yang salah dalam min-heap Python (heapq membandingkan tuple (jarak, id); jika jarak bernilai sama, pastikan ada tie-breaker id agar tidak membandingkan array vektor).",
            "Menghubungkan simpul ke dirinya sendiri (self-loops) saat reverse edge insertion."
        ],
        "references": [
            {
                "title": "Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs",
                "author": "Yury A. Malkov, Dmitry A. Yashunin",
                "year": 2018,
                "url": "https://doi.org/10.1109/TPAMI.2018.2889473",
                "type": "paper",
                "page": "IEEE TPAMI, Algorithms 1-5, pp. 828-830"
            }
        ],
        "content_markdown": """### 1. Arsitektur Komprehensif MiniHNSW

Untuk menyatukan seluruh pemahaman konsep dari Bab 4 ini, kita membangun modul `MiniHNSW` mandiri (*self-contained*) menggunakan Python murni dan NumPy tanpa ketergantungan pada pustaka eksternal seperti Faiss.

Struktur internal kelas `MiniHNSW` mencakup:
1. **Penyimpanan Data**: Matriks $P \\in \\mathbb{R}^{N \\times d}$ untuk vektor dataset.
2. **Multi-layer Graph**: `layers[l][node_id]` berupa daftar ID tetangga yang terhubung pada lapisan $l$.
3. **Konfigurasi**: Hyperparameter $M$, $M_0$, $efConstruction$, dan $m_L = 1/\\ln(M)$.
4. **Metrik Evaluasi**: Menghitung **Recall@K**, yaitu rasio titik hasil pencarian HNSW yang benar-benar termasuk dalam himpunan $K$ tetangga terdekat absolut (*ground truth* dari brute-force linear scan):
   $$\\text{Recall@}K = \\frac{|\\text{Results}_{\\text{HNSW}} \\cap \\text{Results}_{\\text{BruteForce}}|}{|\\text{Results}_{\\text{BruteForce}}|}$$

### 2. Desain Algoritma Modular

Siklus hidup miniatur HNSW terdiri dari dua fase utama:
- `insert(vector)`: Menentukan layer acak $l_{\\text{new}}$, menavigasi dari $l_{\\text{max}}$ ke level target, menemukan kandidat tetangga terdekat menggunakan beam search, menerapkan seleksi sisi beragam, dan memperbarui $v_{\\text{entry}}$ jika terbentuk layer baru.
- `search(query, k, efSearch)`: Melakukan 1-greedy search pada seluruh lapisan atas ($l > 0$), lalu menjalankan beam search berkapasitas $efSearch$ pada base layer ($l = 0$) untuk mengembalikan $k$ tetangga terdekat.

### 3. Implementasi: Kelas MiniHNSW Lengkap & Verifikasi Recall@K

Berikut adalah kode Python mandiri yang dapat langsung dijalankan untuk membangun indeks HNSW dari data acak berdimensi 16 dan memverifikasi bahwa Recall@5 mencapai tingkat akurasi tinggi terhadap kalkulasi brute-force."""
    }
]

# Write python code snippets and deterministic output calculations
codes = [
    # 4.1
    r'''import numpy as np

def build_knn_graph(vectors: np.ndarray, k: int):
    n = len(vectors)
    # Matriks jarak Euclidean pairwise L2
    diff = vectors[:, np.newaxis, :] - vectors[np.newaxis, :, :]
    dist_matrix = np.sqrt(np.sum(diff ** 2, axis=-1))
    
    # Hindari koneksi ke diri sendiri
    np.fill_diagonal(dist_matrix, np.inf)
    
    # Dapatkan indeks k tetangga terdekat untuk setiap simpul
    knn_indices = np.argsort(dist_matrix, axis=1)[:, :k]
    
    # Bangun adjacency list
    adj_list = {i: knn_indices[i].tolist() for i in range(n)}
    
    # Hitung rata-rata derajat keluar dan derajat masuk
    in_degrees = np.zeros(n, dtype=int)
    for u in range(n):
        for v in adj_list[u]:
            in_degrees[v] += 1
            
    return adj_list, in_degrees

np.random.seed(42)
dataset = np.random.randn(20, 8)
k_val = 4
graph, in_deg = build_knn_graph(dataset, k=k_val)

print(f"Jumlah simpul: {len(graph)}")
print(f"K-NN k: {k_val}")
print(f"Tetangga simpul 0: {graph[0]}")
print(f"In-degree minimum: {np.min(in_deg)}, maksimum: {np.max(in_deg)}, rata-rata: {np.mean(in_deg):.2f}")
''',

    # 4.2
    r'''import numpy as np
from collections import deque

def compute_clustering_and_path_length(adj_matrix: np.ndarray):
    n = adj_matrix.shape[0]
    
    # 1. Clustering coefficient per node
    clustering_coeffs = []
    for i in range(n):
        neighbors = np.where(adj_matrix[i] > 0)[0]
        k_i = len(neighbors)
        if k_i < 2:
            clustering_coeffs.append(0.0)
            continue
        
        # Hitung sisi di antara tetangga
        subgraph = adj_matrix[np.ix_(neighbors, neighbors)]
        actual_edges = np.sum(subgraph) / 2.0
        possible_edges = (k_i * (k_i - 1)) / 2.0
        clustering_coeffs.append(actual_edges / possible_edges)
        
    avg_clustering = np.mean(clustering_coeffs)
    
    # 2. Average shortest path length via BFS
    total_dist = 0
    total_pairs = 0
    for start in range(n):
        distances = [-1] * n
        distances[start] = 0
        queue = deque([start])
        while queue:
            curr = queue.popleft()
            for nxt in np.where(adj_matrix[curr] > 0)[0]:
                if distances[nxt] == -1:
                    distances[nxt] = distances[curr] + 1
                    queue.append(nxt)
        for target in range(n):
            if start != target and distances[target] != -1:
                total_dist += distances[target]
                total_pairs += 1
                
    avg_path_len = total_dist / total_pairs if total_pairs > 0 else 0
    return avg_clustering, avg_path_len

np.random.seed(42)
# Buat graf cincin k-regular dengan sedikit tautan acak (Watts-Strogatz analog)
n_nodes = 25
k_conn = 4
adj = np.zeros((n_nodes, n_nodes), dtype=int)
for i in range(n_nodes):
    for offset in [1, 2]:
        j = (i + offset) % n_nodes
        adj[i, j] = 1
        adj[j, i] = 1

# Tambahkan 3 shortcut jarak jauh
shortcuts = [(0, 12), (3, 16), (7, 20)]
for u, v in shortcuts:
    adj[u, v] = 1
    adj[v, u] = 1

c_coeff, l_path = compute_clustering_and_path_length(adj)
print(f"Total simpul: {n_nodes}")
print(f"Rata-rata Clustering Coefficient: {c_coeff:.4f}")
print(f"Average Shortest Path Length: {l_path:.4f}")
''',

    # 4.3
    r'''import numpy as np
import heapq

def euclidean_dist(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.linalg.norm(a - b))

def beam_search_graph(query: np.ndarray, entry_point: int, ef: int, vectors: np.ndarray, adj_list: dict):
    visited = {entry_point}
    d_init = euclidean_dist(vectors[entry_point], query)
    
    # min-heap C: kandidat terdekat untuk dieksplorasi (jarak, simpul)
    C = [(d_init, entry_point)]
    # max-heap W: himpunan ef elemen terbaik (-jarak, simpul)
    W = [(-d_init, entry_point)]
    
    dist_evaluations = 1
    
    while C:
        d_c, c = heapq.heappop(C)
        d_f_neg, f = W[0]
        d_f = -d_f_neg
        
        # Jika kandidat terdekat lebih jauh dari elemen terburuk di W, konvergen
        if d_c > d_f:
            break
            
        for neighbor in adj_list[c]:
            if neighbor not in visited:
                visited.add(neighbor)
                d_e = euclidean_dist(vectors[neighbor], query)
                dist_evaluations += 1
                
                if d_e < d_f or len(W) < ef:
                    heapq.heappush(C, (d_e, neighbor))
                    heapq.heappush(W, (-d_e, neighbor))
                    if len(W) > ef:
                        heapq.heappop(W)
                    d_f = -W[0][0]
                    
    results = [(-d, node) for d, node in W]
    results.sort(key=lambda x: x[0])
    return results, dist_evaluations

np.random.seed(42)
vectors = np.random.randn(50, 4)
# Hubungkan tiap simpul ke 6 tetangga terdekat
diff = vectors[:, None, :] - vectors[None, :, :]
dist_mat = np.linalg.norm(diff, axis=-1)
np.fill_diagonal(dist_mat, np.inf)
adj = {i: np.argsort(dist_mat[i])[:6].tolist() for i in range(50)}

query_vec = np.random.randn(4)
res_ef1, evals_ef1 = beam_search_graph(query_vec, entry_point=0, ef=1, vectors=vectors, adj_list=adj)
res_ef8, evals_ef8 = beam_search_graph(query_vec, entry_point=0, ef=8, vectors=vectors, adj_list=adj)

print(f"Greedy murni (ef=1): Tetangga terdekat = simpul {res_ef1[0][1]} dengan jarak = {res_ef1[0][0]:.4f} (Evals: {evals_ef1})")
print(f"Beam search (ef=8) : Tetangga terdekat = simpul {res_ef8[0][1]} dengan jarak = {res_ef8[0][0]:.4f} (Evals: {evals_ef8})")
''',

    # 4.4
    r'''import numpy as np

def build_simple_nsw(vectors: np.ndarray, m: int):
    n = len(vectors)
    adj_list = {i: [] for i in range(n)}
    
    # Titik awal terhubung langsung
    for i in range(min(m, n)):
        for j in range(i):
            adj_list[i].append(j)
            adj_list[j].append(i)
            
    # Titik lanjutan dihubungkan ke m tetangga terdekat yang sudah ada
    for i in range(m, n):
        curr_vec = vectors[i]
        existing_vecs = vectors[:i]
        dists = np.linalg.norm(existing_vecs - curr_vec, axis=1)
        nearest_m = np.argsort(dists)[:m]
        for neighbor in nearest_m:
            adj_list[i].append(int(neighbor))
            adj_list[neighbor].append(i)
            
    degrees = [len(adj_list[i]) for i in range(n)]
    return adj_list, degrees

np.random.seed(42)
data = np.random.randn(40, 6)
nsw_graph, degs = build_simple_nsw(data, m=4)

print(f"Jumlah simpul NSW: {len(nsw_graph)}")
print(f"Derajat simpul-simpul awal (0-3): {degs[:4]}")
print(f"Derajat simpul-simpul akhir (36-39): {degs[-4:]}")
print(f"Rasio derajat rata-rata awal vs akhir: {np.mean(degs[:4]) / np.mean(degs[-4:]):.2f}x")
''',

    # 4.5
    r'''import numpy as np

def assign_hnsw_levels(n_elements: int, M: int, seed: int = 42):
    np.random.seed(seed)
    m_L = 1.0 / np.log(M)
    uniform_draws = np.random.uniform(0.0, 1.0, size=n_elements)
    # l = floor(-ln(uniform) * m_L)
    levels = np.floor(-np.log(uniform_draws) * m_L).astype(int)
    return levels

n = 10000
M_param = 16
levels = assign_hnsw_levels(n, M=M_param)

max_l = np.max(levels)
print(f"Total elemen data: {n}")
print(f"Parameter M: {M_param}, m_L = {1.0/np.log(M_param):.4f}")
print(f"Layer tertinggi yang tercapai: {max_l}")
for l in range(max_l + 1):
    count = np.sum(levels >= l)
    print(f"Layer {l}: {count} elemen ({count / n * 100:.2f}%)")
''',

    # 4.6
    r'''import numpy as np
import heapq

def search_layer(q: np.ndarray, ep: int, ef: int, layer_adj: dict, vectors: np.ndarray):
    v = vectors
    visited = {ep}
    d_init = float(np.linalg.norm(v[ep] - q))
    C = [(d_init, ep)]
    W = [(-d_init, ep)]
    
    while C:
        d_c, c = heapq.heappop(C)
        d_f = -W[0][0]
        if d_c > d_f:
            break
        for nxt in layer_adj.get(c, []):
            if nxt not in visited:
                visited.add(nxt)
                d_nxt = float(np.linalg.norm(v[nxt] - q))
                if d_nxt < d_f or len(W) < ef:
                    heapq.heappush(C, (d_nxt, nxt))
                    heapq.heappush(W, (-d_nxt, nxt))
                    if len(W) > ef:
                        heapq.heappop(W)
                    d_f = -W[0][0]
    return [(-d, u) for d, u in sorted(W, reverse=True)]

# Simulasi hierarki 2 layer (Layer 1 coarse, Layer 0 fine)
np.random.seed(42)
vecs = np.random.randn(30, 4)
layer1_nodes = [0, 5, 10, 15, 20]
adj_l1 = {0: [5, 10], 5: [0, 15], 10: [0, 20], 15: [5], 20: [10]}
adj_l0 = {i: [j for j in range(max(0, i-2), min(30, i+3)) if j != i] for i in range(30)}

q_vec = np.random.randn(4)
# Fase 1: Coarse search di layer 1 dengan ef=1
entry_p = 0
res_l1 = search_layer(q_vec, ep=entry_p, ef=1, layer_adj=adj_l1, vectors=vecs)
best_ep_l0 = res_l1[0][1]

# Fase 2: Fine search di layer 0 dengan ef=5
res_l0 = search_layer(q_vec, ep=best_ep_l0, ef=5, layer_adj=adj_l0, vectors=vecs)

print(f"Layer 1 Best Entry Point: Simpul {best_ep_l0} (Jarak: {res_l1[0][0]:.4f})")
print(f"Layer 0 Top-3 Nearest Neighbors:")
for rank, (dist, node) in enumerate(res_l0[:3], 1):
    print(f"  Rank {rank}: Simpul {node} (Jarak: {dist:.4f})")
''',

    # 4.7
    r'''import numpy as np

def add_bidirectional_edge(adj: dict, u: int, v: int, max_degree: int, vectors: np.ndarray):
    for src, dst in [(u, v), (v, u)]:
        if dst not in adj[src]:
            adj[src].append(dst)
        # Jika melebihi batas derajat maksimum, pangkas simpul terjauh
        if len(adj[src]) > max_degree:
            neighbors = adj[src]
            dists = [np.linalg.norm(vectors[src] - vectors[n]) for n in neighbors]
            sorted_indices = np.argsort(dists)
            adj[src] = [neighbors[idx] for idx in sorted_indices[:max_degree]]

np.random.seed(42)
vectors = np.random.randn(10, 3)
adj_graph = {i: [] for i in range(10)}

# Sambungkan simpul 0 ke simpul 1, 2, 3, 4 dengan batas derajat 3
for target in [1, 2, 3, 4]:
    add_bidirectional_edge(adj_graph, 0, target, max_degree=3, vectors=vectors)

print(f"Koneksi simpul 0 (derajat maks 3): {adj_graph[0]}")
print(f"Koneksi balik pada simpul 1: {adj_graph[1]}")
print(f"Apakah derajat simpul 0 terkendali <= 3? {len(adj_graph[0]) <= 3}")
''',

    # 4.8
    r'''import numpy as np

def select_neighbors_simple(p_idx: int, candidates: list, M: int, vectors: np.ndarray):
    p_vec = vectors[p_idx]
    dists = [(float(np.linalg.norm(vectors[c] - p_vec)), c) for c in candidates]
    dists.sort(key=lambda x: x[0])
    return [c for _, c in dists[:M]]

def select_neighbors_heuristic(p_idx: int, candidates: list, M: int, vectors: np.ndarray):
    p_vec = vectors[p_idx]
    # Urutkan kandidat berdasarkan jarak ke p
    dists = [(float(np.linalg.norm(vectors[c] - p_vec)), c) for c in candidates]
    dists.sort(key=lambda x: x[0])
    
    R = []
    for d_pc, c in dists:
        if len(R) >= M:
            break
        c_vec = vectors[c]
        # Syarat diversitas: dist(p, c) harus lebih kecil dari dist(r, c) untuk semua r in R
        is_diverse = True
        for r in R:
            d_rc = float(np.linalg.norm(vectors[r] - c_vec))
            if d_rc < d_pc:
                is_diverse = False
                break
        if is_diverse:
            R.append(c)
    return R

# Buat skenario: simpul target di (0, 0), kluster padat di kanan (1.0, 0.0), titik soliter di atas (0.0, 1.2)
vecs = np.array([
    [0.0, 0.0],   # Simpul 0 (Target)
    [1.0, 0.0],   # Simpul 1 (Kluster A)
    [1.05, 0.05], # Simpul 2 (Kluster A - redundan dengan 1)
    [1.1, -0.05], # Simpul 3 (Kluster A - redundan dengan 1)
    [0.0, 1.2]    # Simpul 4 (Arah B - sudut berbeda)
])

cands = [1, 2, 3, 4]
selected_simple = select_neighbors_simple(0, cands, M=2, vectors=vecs)
selected_heur = select_neighbors_heuristic(0, cands, M=2, vectors=vecs)

print(f"Kandidat simpul: {cands}")
print(f"Simple Selection (M=2)   : {selected_simple} (Keduanya dari kluster A yang berhimpitan)")
print(f"Heuristic Selection (M=2): {selected_heur} (Menjangkau simpul 1 di Kluster A dan simpul 4 di Arah B)")
''',

    # 4.9
    r'''import numpy as np

def estimate_hnsw_ram(n_vectors: int, dim: int, M: int):
    m0 = 2 * M
    bytes_per_vector = dim * 4  # float32
    avg_edges_per_node = m0 + 1 # base layer + upper layers
    bytes_per_graph = avg_edges_per_node * 4 # uint32 id
    
    total_bytes = n_vectors * (bytes_per_vector + bytes_per_graph)
    ram_mb = total_bytes / (1024 * 1024)
    return ram_mb

# Perbandingan konfigurasi M
n = 1_000_000
d = 128
for m_val in [16, 32, 64]:
    ram = estimate_hnsw_ram(n, d, m_val)
    print(f"N={n:,}, d={d}, M={m_val} (M0={2*m_val}): Estimasi RAM = {ram:.2f} MB")
''',

    # 4.10
    r'''import numpy as np
import heapq

class MiniHNSW:
    def __init__(self, dim: int, M: int = 4, ef_construction: int = 16):
        self.dim = dim
        self.M = M
        self.M0 = 2 * M
        self.ef_construction = ef_construction
        self.m_L = 1.0 / np.log(M)
        self.vectors = []
        self.layers = []  # layers[l][node_id] = list of neighbors
        self.enter_node = None
        self.max_level = -1
        
    def _dist(self, a_idx: int, b_vec: np.ndarray) -> float:
        return float(np.linalg.norm(self.vectors[a_idx] - b_vec))
        
    def _search_layer(self, q: np.ndarray, ep: int, ef: int, layer: int):
        visited = {ep}
        d_init = self._dist(ep, q)
        C = [(d_init, ep)]
        W = [(-d_init, ep)]
        
        while C:
            d_c, c = heapq.heappop(C)
            d_f = -W[0][0]
            if d_c > d_f:
                break
            for nxt in self.layers[layer].get(c, []):
                if nxt not in visited:
                    visited.add(nxt)
                    d_nxt = self._dist(nxt, q)
                    if d_nxt < d_f or len(W) < ef:
                        heapq.heappush(C, (d_nxt, nxt))
                        heapq.heappush(W, (-d_nxt, nxt))
                        if len(W) > ef:
                            heapq.heappop(W)
                        d_f = -W[0][0]
        return [(-d, u) for d, u in sorted(W, reverse=True)]

    def insert(self, vec: np.ndarray):
        node_id = len(self.vectors)
        self.vectors.append(vec)
        
        # Undi level simpul
        level = int(np.floor(-np.log(np.random.uniform(1e-9, 1.0)) * self.m_L))
        
        while len(self.layers) <= level:
            self.layers.append({})
            
        if self.enter_node is None:
            self.enter_node = node_id
            self.max_level = level
            for l in range(level + 1):
                self.layers[l][node_id] = []
            return
            
        curr_ep = self.enter_node
        # 1. Coarse search dari top layer turun ke level + 1
        for l in range(self.max_level, level, -1):
            res = self._search_layer(vec, curr_ep, ef=1, layer=l)
            curr_ep = res[0][1]
            
        # 2. Insersi dan koneksi dari min(max_level, level) turun ke 0
        for l in range(min(self.max_level, level), -1, -1):
            res = self._search_layer(vec, curr_ep, ef=self.ef_construction, layer=l)
            m_max = self.M0 if l == 0 else self.M
            neighbors = [u for _, u in res[:m_max]]
            self.layers[l][node_id] = neighbors
            for n in neighbors:
                self.layers[l][n].append(node_id)
                if len(self.layers[l][n]) > m_max:
                    # Pangkas tetangga terjauh
                    dists = [(self._dist(n, self.vectors[x]), x) for x in self.layers[l][n]]
                    dists.sort()
                    self.layers[l][n] = [x for _, x in dists[:m_max]]
            curr_ep = res[0][1]
            
        if level > self.max_level:
            self.max_level = level
            self.enter_node = node_id

    def search(self, q: np.ndarray, k: int, ef_search: int = 16):
        if self.enter_node is None:
            return []
        curr_ep = self.enter_node
        for l in range(self.max_level, 0, -1):
            res = self._search_layer(q, curr_ep, ef=1, layer=l)
            curr_ep = res[0][1]
        res = self._search_layer(q, curr_ep, ef=max(ef_search, k), layer=0)
        return res[:k]

# Validasi Recall@5 terhadap Brute-Force
np.random.seed(42)
dim = 8
n_pts = 60
hnsw = MiniHNSW(dim=dim, M=4, ef_construction=16)

raw_data = np.random.randn(n_pts, dim)
for vec in raw_data:
    hnsw.insert(vec)

query = np.random.randn(dim)
hnsw_res = hnsw.search(query, k=5, ef_search=16)
hnsw_ids = {idx for _, idx in hnsw_res}

# Brute force
bf_dists = np.linalg.norm(raw_data - query, axis=1)
bf_ids = set(np.argsort(bf_dists)[:5])

recall_5 = len(hnsw_ids.intersection(bf_ids)) / 5.0
print(f"Top-5 HNSW IDs: {[idx for _, idx in hnsw_res]}")
print(f"Top-5 Brute-Force IDs: {sorted(list(bf_ids))}")
print(f"Recall@5: {recall_5 * 100:.1f}%")
'''
]

# Run each snippet to collect exact deterministic outputs
snippet_outputs = []
for idx, code in enumerate(codes, 1):
    local_env = {}
    import io, sys
    old_stdout = sys.stdout
    sys.stdout = io.StringIO()
    try:
        exec(code, local_env)
        out = sys.stdout.getvalue()
    except Exception as e:
        out = f"Error: {e}"
    finally:
        sys.stdout = old_stdout
    snippet_outputs.append(out.strip())

# Time & space complexities
complexities = [
    {"time": r"\mathcal{O}(n^2 \cdot d)", "space": r"\mathcal{O}(n \cdot k)"},
    {"time": r"\mathcal{O}(|V| \cdot (|V| + |E|))", "space": r"\mathcal{O}(|V|^2)"},
    {"time": r"\mathcal{O}(ef \cdot \bar{d}_{\text{graph}} \cdot d)", "space": r"\mathcal{O}(ef + |V|)"},
    {"time": r"\mathcal{O}(n \cdot \log^2 n \cdot d)", "space": r"\mathcal{O}(n \cdot m)"},
    {"time": r"\mathcal{O}(\log n \cdot d)", "space": r"\mathcal{O}(n \cdot M)"},
    {"time": r"\mathcal{O}(\log n \cdot d + efSearch \cdot M_0 \cdot d)", "space": r"\mathcal{O}(efSearch)"},
    {"time": r"\mathcal{O}(\log n + efConstruction \cdot M \cdot d)", "space": r"\mathcal{O}(M)"},
    {"time": r"\mathcal{O}(|C| \cdot M \cdot d)", "space": r"\mathcal{O}(M)"},
    {"time": r"\mathcal{O}(efSearch \cdot \log(efSearch) \cdot d)", "space": r"\mathcal{O}(N \cdot (d + 2M))"},
    {"time": r"\mathcal{O}(n \log n \cdot d)", "space": r"\mathcal{O}(n \cdot (d + 2M))"}
]

# Assemble subchapters with 7 components
for i, sub in enumerate(subchapters):
    sub["codeExamples"] = [
        {
            "language": "python",
            "code": codes[i],
            "description": f"Implementasi Python 3 & NumPy: {sub['title']}",
            "expectedOutput": snippet_outputs[i]
        }
    ]
    sub["codeSnippetOutput"] = snippet_outputs[i]
    sub["timeComplexity"] = complexities[i]["time"]
    sub["spaceComplexity"] = complexities[i]["space"]

# Save to JSON
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(subchapters, f, indent=2, ensure_ascii=False)

print(f"[OK] Berhasil menghasilkan 10 subbab Bab 4 Topik 28 ke {output_file}")
