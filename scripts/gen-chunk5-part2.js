const fs = require('fs');
const path = require('path');
const { createSubchapter, exportChapterTs } = require('./curriculum-builder-helper');

const outDir = path.join(__dirname, '../src/lib/curriculum/topics/machine-learning');

// ============================================================================
// BAB 22: Klusterisasi Hierarkis & Berbasis Densitas: Agglomerative & HDBSCAN (7 Subbab)
// ============================================================================
const ch22Subs = [
  createSubchapter({
    id: "ml-22-1-taksonomi-klusterisasi-hierarkis",
    slug: "22-1-taksonomi-klusterisasi-hierarkis",
    title: "22.1 Taksonomi Klusterisasi Hierarkis: Pendekatan Aglomeratif (Bottom-Up) vs Divisif (Top-Down)",
    orderIndex: 1,
    description: "Taksonomi metode pengelompokan hierarkis: pendekatan Aglomeratif (Bottom-Up merging) vs Divisif (Top-Down splitting) dan representasi pohon taksonomi.",
    theoryMarkdown: `Klusterisasi hierarkis menghasilkan struktur dekomposisi bertingkat bersarang (*nested partitions*):
1. **Aglomeratif (Bottom-Up)**:
   Mulai dengan $n$ kluster singleton (setiap sampel adalah kluster sendiri). Pada setiap langkah, gabungkan sepasang kluster yang memiliki jarak terdekat hingga tersisa 1 kluster induk tunggal ($O(n^2)$ atau $O(n^3)$).
2. **Divisif (Top-Down)**:
   Mulai dengan 1 kluster raksasa yang memuat seluruh data. Pada setiap langkah, belah kluster menjadi dua sub-kluster secara rekursif (misal menggunakan 2-means pembagi).
Pendekatan Aglomeratif adalah standar industri yang paling banyak digunakan.`,
    mermaidDiagram: `graph TD
    Leaves["n Kluster Awal (Tiap Sampel Sendiri)"] --> Step1["Langkah 1: Gabungkan 2 Kluster Terdekat"]
    Step1 --> Step2["Langkah 2: Gabungkan Pasangan Terdekat Berikutnya"]
    Step2 --> Root["Akar Tunggal (Seluruh Data Menyatu)"]`,
    scratchCode: `import numpy as np

def agglomerative_simple_distance_matrix(X):
    n = len(X)
    D = np.linalg.norm(X[:, None] - X[None, :], axis=-1)
    np.fill_diagonal(D, np.inf)
    min_idx = np.unravel_index(np.argmin(D), D.shape)
    return min_idx, D[min_idx]

pts_hier = np.array([[1.0, 1.0], [1.2, 1.1], [5.0, 5.0]])
pair, d_min = agglomerative_simple_distance_matrix(pts_hier)
print(f"Pasangan pertama yang digabungkan: Kluster {pair[0]} dan {pair[1]} dengan jarak {d_min:.3f}")`,
    sotaCode: `from sklearn.cluster import AgglomerativeClustering

agg = AgglomerativeClustering(n_clusters=2).fit(pts_hier)
print("Agglomerative Labels:", agg.labels_)`,
    diagCode: `print("Jumlah daun pohon hierarki:", agg.n_leaves_)`,
    caseStudy: "Taksonomi filogenetika biologi evolusioner: Menyusun pohon kekerabatan spesies mamalia berdasarkan kesamaan sekuens genom.",
    commonPitfalls: ["Kompleksitas memori O(n^2) untuk menyimpan matriks jarak pairwise pada dataset n > 30,000."],
    groundingLinks: [{ title: "Murtagh & Contreras (2012) Algorithms for hierarchical clustering", url: "https://doi.org/10.1002/wics.1219", note: "Review algoritma hierarki" }]
  }),

  createSubchapter({
    id: "ml-22-2-kriteria-linkage-ward",
    slug: "22-2-kriteria-linkage-ward",
    title: "22.2 Kriteria Penggabungan Linkage: Single, Complete, Average, & Ward's Minimum Variance Criterion",
    orderIndex: 2,
    description: "Kriteria penggabungan jarak antar-kluster (Linkage): Single (jarak minimum / chaining effect), Complete (jarak maksimum), Average (UPGMA), dan Ward's minimum variance criterion.",
    theoryMarkdown: `Diberikan dua kluster $A$ dan $B$:
1. **Single Linkage**: $d_{\\text{single}}(A, B) = \\min_{\\mathbf{a} \\in A, \\mathbf{b} \\in B} d(\\mathbf{a}, \\mathbf{b})$. Mampu menangani bentuk non-konveks, namun sangat rentan terhadap *Chaining Effect* (efek jembatan derau).
2. **Complete Linkage**: $d_{\\text{complete}}(A, B) = \\max_{\\mathbf{a} \\in A, \\mathbf{b} \\in B} d(\\mathbf{a}, \\mathbf{b})$. Menghasilkan klaster kompak sferis dengan diameter kecil.
3. **Average Linkage (UPGMA)**: $d_{\\text{avg}}(A, B) = \\frac{1}{|A||B|} \\sum_{\\mathbf{a} \\in A} \\sum_{\\mathbf{b} \\in B} d(\\mathbf{a}, \\mathbf{b})$.
4. **Ward's Minimum Variance Criterion**:
   Menggabungkan pasangan kluster yang menghasilkan **peningkatan terkecil pada total Within-Cluster Sum of Squares (Inertia)**:
   $$\\Delta \\text{ESS}_{AB} = \\frac{|A||B|}{|A| + |B|} \\|\\boldsymbol{\\mu}_A - \\boldsymbol{\\mu}_B\\|_2^2$$`,
    mermaidDiagram: `graph TD
    Linkage["Kriteria Penggabungan Linkage"] --> Single["Single: Jarak Minimum (Rentan Chaining Effect)"]
    Linkage --> Complete["Complete: Jarak Maksimum (Kompak, Diameter Terkontrol)"]
    Linkage --> Average["Average: Rata-rata Seluruh Pasangan Jarak"]
    Linkage --> Ward["Ward: Meminimalkan Kenaikan Varians WCSS (Rekomendasi Utama!)"]`,
    scratchCode: `def ward_distance_increase(mean_A, n_A, mean_B, n_B):
    return (n_A * n_B / (n_A + n_B)) * np.sum((mean_A - mean_B)**2)

mA, mB = np.array([0.0, 0.0]), np.array([3.0, 4.0])
print("Ward's Delta ESS Increase:", ward_distance_increase(mA, 5, mB, 5))`,
    sotaCode: `from scipy.cluster.hierarchy import linkage

Z_ward = linkage(pts_hier, method='ward')
print("Scipy Linkage Matrix (Ward):\\n", np.round(Z_ward, 3))`,
    diagCode: `print("Bentuk matriks linkage Z: (n-1, 4)")`,
    caseStudy: "Segmentasi wilayah sensus demografi perkotaan: Ward linkage menghasilkan kelompok blok sensus dengan homogenitas sosio-ekonomi tertinggi.",
    commonPitfalls: ["Menggunakan Ward linkage dengan metrik non-Euclidean (misal Manhattan atau Cosine); kriteria Ward secara matematis HANYA valid untuk jarak Euclidean kuadrat."],
    groundingLinks: [{ title: "Ward (1963) Hierarchical Grouping to Optimize an Objective Function", url: "https://doi.org/10.1080/01621459.1963.10500845", note: "Paper asli penemuan Ward Linkage JASA" }]
  }),

  createSubchapter({
    id: "ml-22-3-analisis-visual-dendrogram",
    slug: "22-3-analisis-visual-dendrogram",
    title: "22.3 Analisis Visual Dendrogram: Penentuan Jumlah Kluster Optimal melalui Jarak Pemotongan Horisontal",
    orderIndex: 3,
    description: "Analisis visual Dendrogram: struktur diagram pohon biner, ketinggian sumbu vertikal jarak penggabungan, dan penentuan k optimal via horizontal cutoff.",
    theoryMarkdown: `**Dendrogram** adalah diagram pohon yang memvisualisasikan seluruh sejarah penggabungan hierarkis:
- **Sumbu Horizontal**: Sampel data individual.
- **Sumbu Vertikal**: Jarak disimilaritas di mana penggabungan terjadi.

**Aturan Pemotongan Horisontal (Cutoff Rule)**:
Tarik garis horizontal melintasi dendrogram pada ketinggian di mana terdapat garis vertikal terpanjang yang tidak berpotongan dengan penggabungan lain. Jumlah garis vertikal yang terpotong merepresentasikan jumlah kluster optimal $k$.`,
    mermaidDiagram: `graph TD
    Dendrogram["Diagram Pohon Dendrogram"] --> Longest["Cari Garis Vertikal Terpanjang Tanpa Garis Cabang Horisontal"]
    Longest --> CutLine["Tarik Garis Potong Horisontal (Cutoff Threshold h)"]
    CutLine --> OptimalK["Jumlah Garis Terpotong = Jumlah Kluster Alami k"]`,
    scratchCode: `def get_cluster_count_from_cutoff(linkage_matrix, height_cutoff):
    # Hitung jumlah klaster dari tinggi pemotongan
    heights = linkage_matrix[:, 2]
    merges_above = np.sum(heights > height_cutoff)
    return merges_above + 1

print("Jumlah klaster pada cutoff h=2.5:", get_cluster_count_from_cutoff(Z_ward, 2.5))`,
    sotaCode: `from scipy.cluster.hierarchy import fcluster

clusters = fcluster(Z_ward, t=2.5, criterion='distance')
print("Fcluster Assignments:", clusters)`,
    diagCode: `print("Jumlah Kluster Unik Terdeteksi:", len(np.unique(clusters)))`,
    caseStudy: "Taksonomi produk katalog e-commerce (Fashion -> Pria/Wanita -> Sepatu -> Formal): Dendrogram memungkinkan zoom-in/zoom-out hierarki kategori.",
    commonPitfalls: ["Memotong dendrogram pada ketinggian yang membelah cabang pendek, menghasilkan kluster artifisial yang tidak stabil."],
    groundingLinks: [{ title: "Scipy Dendrogram Documentation", url: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.cluster.hierarchy.dendrogram.html", note: "Dokumentasi modul visualisasi dendrogram" }]
  }),

  createSubchapter({
    id: "ml-22-4-fondasi-klusterisasi-densitas",
    slug: "22-4-fondasi-klusterisasi-densitas",
    title: "22.4 Fondasi Klusterisasi Berbasis Densitas: Keterbatasan Kluster Geometris Konveks pada Bentuk Arbitrer",
    orderIndex: 4,
    description: "Kegagalan K-Means dan metode berbasis jarak pada bentuk non-konveks: bulan sabit ganda, cincin konsentris, dan konsep kepadatan lokal.",
    theoryMarkdown: `Metode berbasis partisi jarak (seperti K-Means dan Ward Linkage) secara inheren mengasumsikan bahwa klaster berbentuk **bola konveks (spherical / convex clusters)** dengan ukuran dan kepadatan seragam.

Pada fenomena spasial nyata, klaster sering kali berbentuk **arbitrer (non-convex)**:
- Dua bentuk bulan sabit yang saling mengunci (*two moons*).
- Lingkaran cincin konsentris di dalam lingkaran lain.
- Jalur jalan raya atau aliran sungai yang berliku.
K-Means gagal total memisahkan bentuk-bentuk ini karena centroid jatuh di luar struktur nyata. Klusterisasi berbasis densitas (*Density-Based Clustering*) mendefinisikan klaster sebagai **wilayah bersambung dengan kerapatan titik tinggi yang dipisahkan oleh wilayah berkerapatan rendah**!`,
    mermaidDiagram: `graph LR
    KMeansFail["K-Means / Ward: Memotong Bentuk Bulan Sabit Secara Linier (Gagal)"]
    DensitySuccess["Klusterisasi Densitas: Menelusuri Kerapatan Titik Kontinu -> Menangkap Bentuk Apapun!"]`,
    scratchCode: `def make_two_moons_simple(n_samples=200):
    n = n_samples // 2
    theta1 = np.linspace(0, np.pi, n)
    x1, y1 = np.cos(theta1), np.sin(theta1)
    theta2 = np.linspace(0, np.pi, n)
    x2, y2 = 1 - np.cos(theta2), 1 - np.sin(theta2) - 0.5
    X = np.vstack([np.column_stack([x1, y1]), np.column_stack([x2, y2])])
    return X + np.random.randn(*X.shape) * 0.05

X_moons = make_two_moons_simple(100)
print("Two Moons Dataset Dibangkitkan:", X_moons.shape)`,
    sotaCode: `km_moons = KMeans(n_clusters=2, random_state=42).fit(X_moons)
print("K-Means fitted on non-convex data (akan membelah secara linear)")`,
    diagCode: `print("Inersia K-Means pada bulan sabit:", km_moons.inertia_)`,
    caseStudy: "Pelacakan jejak partikel pada eksperimen Large Hadron Collider (CERN): Partikel sub-atomik membentuk trajektori spiral lengkung di dalam medan magnet.",
    commonPitfalls: ["Mengaplikasikan K-Means pada data berdensitas non-konveks lalu menyimpulkan data tidak memiliki pola klaster."],
    groundingLinks: [{ title: "Ester et al. (1996) Density-Based Clustering DBSCAN", url: "https://dl.acm.org/doi/10.5555/3001460.3001507", note: "Paper pendirian DBSCAN KDD" }]
  }),

  createSubchapter({
    id: "ml-22-5-algoritma-dbscan-core-border-noise",
    slug: "22-5-algoritma-dbscan-core-border-noise",
    title: "22.5 Algoritma DBSCAN: Definisi Titik Inti (Core), Titik Batas (Border), Titik Derau (Noise), & Jangkauan Epsilon",
    orderIndex: 5,
    description: "Mekanisme komputasi DBSCAN: radius lingkungan eps, parameter MinPts, klasifikasi Core/Border/Noise, dan density-reachability.",
    theoryMarkdown: `DBSCAN (Ester et al., 1996) mengklasifikasikan setiap titik $\\mathbf{x}$ ke dalam 3 status berdasarkan lingkungan radius $\\varepsilon$ ($N_\\varepsilon(\\mathbf{x}) = \\{ \\mathbf{z} \\mid \\|\\mathbf{x} - \\mathbf{z}\\| \\le \\varepsilon \\}$):
1. **Core Point**: Memiliki minimal \`MinPts\` sampel di dalam radius $\\varepsilon$: $|N_\\varepsilon(\\mathbf{x})| \\ge \\text{MinPts}$.
2. **Border Point**: Memiliki kurang dari \`MinPts\` sampel, namun berada di dalam radius $\\varepsilon$ dari suatu Core Point.
3. **Noise Point (Outlier)**: Bukan Core Point dan bukan Border Point (label -1).

Dua titik inti $\\mathbf{p}$ dan $\\mathbf{q}$ tergabung dalam satu klaster jika mereka terhubung oleh rantai titik inti yang saling terjangkau secara densitas (*density-connected*). Tidak memerlukan penentuan jumlah klaster $k$ di awal!`,
    mermaidDiagram: `graph TD
    Point["Titik Evaluasi x"] --> Count["Hitung Jumlah Tetangga di Radius Epsilon: |N_eps(x)|"]
    Count --> Check{"|N_eps(x)| >= MinPts?"}
    Check -- Ya --> Core["Core Point: Mulai / Perluas Kluster"]
    Check -- Tidak --> BorderCheck{"Apakah Bertetangga dengan Core Point?"}
    BorderCheck -- Ya --> Border["Border Point: Anggota Tepi Kluster"]
    BorderCheck -- Tidak --> Noise["Noise Point (Outlier / Label -1)"]`,
    scratchCode: `def dbscan_point_classifier(X, eps=0.3, min_pts=4):
    n = len(X)
    dists = np.linalg.norm(X[:, None] - X[None, :], axis=-1)
    neighbor_counts = np.sum(dists <= eps, axis=1)
    
    is_core = neighbor_counts >= min_pts
    is_border = (~is_core) & np.any((dists <= eps) & is_core[:, None], axis=0)
    is_noise = (~is_core) & (~is_border)
    return is_core, is_border, is_noise

core, border, noise = dbscan_point_classifier(X_moons, eps=0.25, min_pts=4)
print(f"DBSCAN Hasil: Core={np.sum(core)}, Border={np.sum(border)}, Noise={np.sum(noise)}")`,
    sotaCode: `from sklearn.cluster import DBSCAN

dbscan = DBSCAN(eps=0.25, min_samples=4).fit(X_moons)
print("DBSCAN Scikit-Learn Cluster Labels:", np.unique(dbscan.labels_))`,
    diagCode: `print("Jumlah noise outlier terdeteksi:", np.sum(dbscan.labels_ == -1))`,
    caseStudy: "Deteksi titik hotspot kebakaran hutan dari citra satelit NASA MODIS: Mengabaikan pantulan panas sporadis (noise) dan mendeteksi perimeter batas api aktif.",
    commonPitfalls: ["Menyetel epsilon terlalu kecil (seluruh data dianggap noise) atau terlalu besar (seluruh data menyatu menjadi 1 kluster raksasa)."],
    groundingLinks: [{ title: "Scikit-Learn DBSCAN Documentation", url: "https://scikit-learn.org/stable/modules/clustering.html#dbscan", note: "Dokumentasi resmi DBSCAN" }]
  }),

  createSubchapter({
    id: "ml-22-6-kelemahan-dbscan-pemilihan-eps-minpts",
    slug: "22-6-kelemahan-dbscan-pemilihan-eps-minpts",
    title: "22.6 Analisis Kelemahan DBSCAN pada Densitas Bervariasi & Pemilihan Parameter Epsilon / MinPts",
    orderIndex: 6,
    description: "Keterbatasan kritis DBSCAN: kegagalan memisahkan klaster dengan densitas bervariasi karena ambang global eps statis, dan grafik k-distance.",
    theoryMarkdown: `### Kelemahan Fundamental DBSCAN:
DBSCAN menggunakan parameter $\\varepsilon$ dan \`MinPts\` yang **bersifat statis global untuk seluruh dataset**.
Jika terdapat dua klaster dengan kerapatan yang sangat berbeda (misal klaster padat di kota vs klaster renggang di pedesaan), tidak ada nilai $\\varepsilon$ tunggal yang dapat memisahkan keduanya secara bersamaan:
- Jika $\\varepsilon$ disetel untuk klaster padat, klaster renggang akan tereliminasi sebagai noise.
- Jika $\\varepsilon$ disetel untuk klaster renggang, klaster padat akan bergabung menjadi satu.

**Heuristik k-Distance Plot**:
Untuk menentukan $\\varepsilon$, plot grafik jarak ke tetangga ke-$k$ (diurutkan menurun) dan cari titik *knee/elbow*.`,
    mermaidDiagram: `graph LR
    KDistance["Plot Jarak ke Tetangga ke-k (Diurutkan)"] --> Knee["Cari Titik Siku / Patahan (Knee Point)"]
    Knee --> EpsVal["Nilai Jarak pada Patahan = Rekomendasi Epsilon"]
    EpsVal --> Limit["Keterbatasan: Gagal Total Jika Data Memiliki Densitas Bervariasi!"]`,
    scratchCode: `def k_distance_graph_values(X, k=4):
    dists = np.linalg.norm(X[:, None] - X[None, :], axis=-1)
    k_dists = np.sort(dists, axis=1)[:, k]
    return np.sort(k_dists)[::-1]

k_vals = k_distance_graph_values(X_moons, k=4)
print("Top 5 K-Distance Terbesar:", np.round(k_vals[:5], 3))
print("Bottom 5 K-Distance Terkecil:", np.round(k_vals[-5:], 3))`,
    sotaCode: `print("k-distance values calculated for elbow threshold heuristic")`,
    diagCode: `print("Rekomendasi nilai epsilon berada di sekitar nilai median k-distance.")`,
    caseStudy: "Pendeteksian aktivitas kriminal perkotaan: Kepadatan insiden di pusat kota metropolitan 100x lebih rapat daripada pinggiran kota, menyebabkan DBSCAN gagal.",
    commonPitfalls: ["Memilih epsilon tanpa memeriksa grafik k-distance terlebih dahulu."],
    groundingLinks: [{ title: "Schubert et al. (2017) DBSCAN Revisited, Revisited", url: "https://doi.org/10.1145/3068335", note: "Review mendalam kelemahan DBSCAN ACM TODS" }]
  }),

  createSubchapter({
    id: "ml-22-7-algoritma-hdbscan-stabilitas-mst",
    slug: "22-7-algoritma-hdbscan-stabilitas-mst",
    title: "22.7 Algoritma HDBSCAN: Klusterisasi Densitas Hierarkis Menggunakan Minimum Spanning Tree & Stabilitas Kluster",
    orderIndex: 7,
    description: "Hierarchical DBSCAN (Campello et al., 2013): transformasi mutual reachability distance, kondensasi pohon klaster, dan metrik stabilitas klaster permanen.",
    theoryMarkdown: `**HDBSCAN (Hierarchical DBSCAN)** mengatasi kelemahan DBSCAN dengan menghilangkan kebutuhan memilih parameter $\\varepsilon$:
1. **Mutual Reachability Distance**:
   $$d_{\\text{m-reach}-k}(\\mathbf{a}, \\mathbf{b}) = \\max(d_{\\text{core}-k}(\\mathbf{a}), d_{\\text{core}-k}(\\mathbf{b}), d(\\mathbf{a}, \\mathbf{b}))$$
   Mendorong titik-titik renggang saling menjauh.
2. Bangun **Minimum Spanning Tree (MST)** pada graf terbobot mutual reachability distance.
3. Ubah MST menjadi pohon hierarki klaster kontinu dan kondensasikan (*Condensed Cluster Tree*).
4. Hitung **Stabilitas Klaster** $\\sum (\\lambda_{\\text{death}} - \\lambda_{\\text{birth}})$: Klaster yang bertahan hidup lama di berbagai skala densitas dipilih secara otomatis!`,
    mermaidDiagram: `graph TD
    Data["Data dengan Densitas Bervariasi"] --> MReach["Hitung Jarak Mutual Reachability Distance"]
    MReach --> MST["Bangun Minimum Spanning Tree (MST)"]
    MST --> Condense["Kondensasi Pohon Menjadi Condensed Cluster Tree"]
    Condense --> Stability["Pilih Klaster dengan Stabilitas Kehidupan Tertinggi! (Bebas Epsilon)"]`,
    scratchCode: `def mutual_reachability_dist(d_ab, core_a, core_b):
    return max(core_a, core_b, d_ab)

print("Mutual Reachability (d=1.2, core_a=2.0, core_b=1.5):", mutual_reachability_dist(1.2, 2.0, 1.5))`,
    sotaCode: `import hdbscan

hdb = hdbscan.HDBSCAN(min_cluster_size=5).fit(X_moons)
print("HDBSCAN Cluster Labels:", np.unique(hdb.labels_))
print("Probabilitas Keanggotaan Sampel Pertama:", np.round(hdb.probabilities_[0], 4))`,
    diagCode: `print("Jumlah Kluster Terpilih HDBSCAN:", len(np.unique(hdb.labels_[hdb.labels_ != -1])))`,
    caseStudy: "Pendeteksian kelompok galaksi astronomi pada teleskop James Webb: Kluster bintang memiliki densitas bervariasi ekstrem yang diekstrak sempurna oleh HDBSCAN.",
    commonPitfalls: ["Menyetel min_cluster_size terlalu kecil (misal 2) yang menyebabkan overfitting noise."],
    groundingLinks: [{ title: "Campello et al. (2013) HDBSCAN Paper", url: "https://doi.org/10.1007/978-3-642-37456-2_14", note: "Paper asli HDBSCAN PAKDD" }, { title: "HDBSCAN GitHub Repository", url: "https://github.com/scikit-learn-contrib/hdbscan", note: "Repositori resmi pustaka HDBSCAN" }]
  })
];

const chapter22 = {
  id: "machine-learning-ch-22",
  slug: "bab-22-klusterisasi-hierarkis-berbasis-densitas-agglomerative-hdbscan",
  title: "BAB 22: Klusterisasi Hierarkis & Berbasis Densitas: Agglomerative & HDBSCAN",
  orderIndex: 22,
  description: "Taksonomi klusterisasi hierarkis dan berbasis kerapatan: pendekatan aglomeratif bottom-up vs divisif, kriteria linkage Single, Complete, Average, dan Ward's minimum variance, analisis visual dendrogram dan cutoff horisontal, fondasi kepadatan densitas non-konveks, algoritma DBSCAN (Core, Border, Noise points), analisis kegagalan densitas bervariasi, serta algoritma mutakhir HDBSCAN berbasis Minimum Spanning Tree dan stabilitas klaster.",
  coreConcepts: [
    "Klusterisasi Aglomeratif vs Divisif",
    "Kriteria Linkage & Ward's Minimum Variance",
    "Analisis Dendrogram & Ambang Pemotongan",
    "Fondasi Kerapatan Non-Konveks",
    "DBSCAN: Radius Epsilon, MinPts, Core & Border",
    "Kelemahan Densitas Bervariasi & Grafik k-Distance",
    "HDBSCAN & Stabilitas Minimum Spanning Tree"
  ],
  subchapters: ch22Subs
};

fs.writeFileSync(path.join(outDir, 'chunk5-ch22.ts'), exportChapterTs(chapter22, 'chapter22'), 'utf-8');
console.log('Successfully generated chunk5-ch22.ts (7 subchapters)');


// ============================================================================
// BAB 23: Model Campuran Probabilistik: GMM & Algoritma Expectation-Maximization (7 Subbab)
// ============================================================================
const ch23Subs = [
  createSubchapter({
    id: "ml-23-1-paradigma-soft-clustering-mixture-models",
    slug: "23-1-paradigma-soft-clustering-mixture-models",
    title: "23.1 Model Campuran Probabilistik (Mixture Models): Mengatasi Keterbatasan Partisi Keras (Hard Clustering)",
    orderIndex: 1,
    description: "Pergeseran dari partisi keras (hard clustering K-Means) ke probabilitas keanggotaan lembut (soft clustering): model generatif campuran dan ketidakpastian.",
    theoryMarkdown: `Pada K-Means, setiap titik data dipaksa menjadi anggota mutlak dari tepat satu klaster (*hard assignment*). Hal ini mengabaikan ketidakpastian (*uncertainty*) pada titik-titik yang berada di perbatasan antar kluster.

**Model Campuran Probabilistik (Mixture Models)** mengadopsi pendekatan **Soft Clustering**:
Setiap titik $\\mathbf{x}$ memiliki probabilitas keanggotaan posterior $\\gamma_{ik} = P(Z_i = k \\mid \\mathbf{x}_i) \\in [0, 1]$ terhadap setiap komponen klaster $k$, dengan $\\sum_{k=1}^K \\gamma_{ik} = 1$.
Pendekatan ini memodelkan proses generatif data sebagai campuran dari beberapa sub-populasi distribusi probabilitas.`,
    mermaidDiagram: `graph LR
    Hard["Hard Clustering (K-Means): Titik Milik Kluster A 100% atau Kluster B 100%"]
    Soft["Soft Clustering (GMM): Titik Memiliki Probabilitas P(A) = 0.65 & P(B) = 0.35 (Realistis!)"]`,
    scratchCode: `def soft_assignment_demo(p_A, p_B):
    total = p_A + p_B
    return p_A / total, p_B / total

gamma_A, gamma_B = soft_assignment_demo(0.08, 0.02)
print(f"Soft Responsibilities: P(Kluster A) = {gamma_A:.2f}, P(Kluster B) = {gamma_B:.2f}")`,
    sotaCode: `from sklearn.mixture import GaussianMixture

gmm_toy = GaussianMixture(n_components=2, random_state=42).fit(X_cl)
print("GMM Soft Probabilities (3 sampel pertama):\\n", np.round(gmm_toy.predict_proba(X_cl[:3]), 3))`,
    diagCode: `print("Jumlah bobot probabilitas baris pertama:", np.sum(gmm_toy.predict_proba(X_cl[:1])))`,
    caseStudy: "Segmentasi pelanggan bernilai ganda (B2B + B2C): Pelanggan yang membeli produk untuk kebutuhan kantor sekaligus pribadi diposisikan secara lembut di kedua segmen.",
    commonPitfalls: ["Memperlakukan soft probabilities sebagai label keras tanpa memperhitungkan entropy ketidakpastian."],
    groundingLinks: [{ title: "Bishop PRML (Ch. 9 Mixture Models and EM)", url: "https://www.microsoft.com/en-us/research/people/cmbishop/prml-book/", note: "Buku standar Mixture Models" }]
  }),

  createSubchapter({
    id: "ml-23-2-formulasi-gaussian-mixture-models",
    slug: "23-2-formulasi-gaussian-mixture-models",
    title: "23.2 Gaussian Mixture Models (GMM): Formulasi Parameter Bobot Campuran, Vektor Rata-Rata, & Matriks Kovarians",
    orderIndex: 2,
    description: "Perumusan formal Gaussian Mixture Models (GMM): bobot campuran pi_k, rata-rata mu_k, matriks kovarians Sigma_k, dan fungsi densitas multimodal.",
    theoryMarkdown: `Fungsi kerapatan probabilitas Gaussian Mixture Model adalah kombinasi linier cembung dari $K$ distribusi Gaussian multivariat:
$$p(\\mathbf{x}) = \\sum_{k=1}^K \\pi_k \\mathcal{N}(\\mathbf{x} \\mid \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k)$$
di mana:
- $\\pi_k = P(Z = k)$ adalah **bobot campuran** (*mixing weights*) dengan konstrain $\\pi_k \\ge 0$ dan $\\sum_{k=1}^K \\pi_k = 1$.
- $\\boldsymbol{\\mu}_k \\in \\mathbb{R}^d$ adalah vektor rata-rata komponen ke-$k$.
- $\\boldsymbol{\\Sigma}_k \\in \\mathbb{R}^{d \\times d}$ adalah matriks kovarians komponen ke-$k$ yang mengontrol bentuk, rotasi, dan orientasi elipsoid kluster.`,
    mermaidDiagram: `graph TD
    Prior["Bobot Campuran pi_1, ..., pi_K (sum pi_k = 1)"] --> Generative["Pilih Komponen k ~ Multinomial(pi)"]
    Generative --> Sample["Bangkitkan Sampel x ~ N(mu_k, Sigma_k)"]
    Sample --> Multimodal["Hasil: Distribusi Probabilitas Bersama Multimodal Kompleks!"]`,
    scratchCode: `def gaussian_pdf_multivariate(x, mean, cov):
    d = len(x)
    diff = x - mean
    inv_cov = np.linalg.inv(cov)
    det_cov = np.linalg.det(cov)
    norm_const = 1.0 / (np.sqrt((2 * np.pi)**d * det_cov))
    exponent = -0.5 * diff.T @ inv_cov @ diff
    return norm_const * np.exp(exponent)

m_k = np.array([0.0, 0.0])
cov_k = np.eye(2)
print("Gaussian PDF pada [0, 0]:", gaussian_pdf_multivariate(np.array([0.0, 0.0]), m_k, cov_k))`,
    sotaCode: `gmm = GaussianMixture(n_components=2, covariance_type='full', random_state=42).fit(X_cl)
print("Bobot Campuran pi_k:", np.round(gmm.weights_, 3))
print("Titik Rata-rata mu_k :\\n", np.round(gmm.means_, 3))`,
    diagCode: `print("Matriks Kovarians Sigma_k Shape:", gmm.covariances_.shape)`,
    caseStudy: "Pemodelan sinyal akustik fonem suara manusia pada Automatic Speech Recognition (ASR): Suara vokal 'A' dimodelkan sebagai campuran 8 Gaussian.",
    commonPitfalls: ["Terjadinya singularitas numerik (det(Sigma) -> 0) saat satu komponen Gaussian mengisolasi tepat 1 titik data tunggal."],
    groundingLinks: [{ title: "Scikit-Learn Gaussian Mixture Models", url: "https://scikit-learn.org/stable/modules/mixture.html", note: "Dokumentasi resmi modul GMM" }]
  }),

  createSubchapter({
    id: "ml-23-3-masalah-ketertutupan-analitis-log-likelihood",
    slug: "23-3-masalah-ketertutupan-analitis-log-likelihood",
    title: "23.3 Masalah Ketertutupan Analitis Log-Likelihood Campuran & Kebutuhan Variabel Laten Z",
    orderIndex: 3,
    description: "Kegagalan solusi analitis tertutup: penjumlahan di dalam logaritma ln(sum pi_k N(x)) dan introduksi variabel indikator laten Z.",
    theoryMarkdown: `Fungsi log-likelihood dari GMM untuk $n$ observasi independen:
$$\\ln L(\\boldsymbol{\\theta}) = \\sum_{i=1}^n \\ln \\left( \\sum_{k=1}^K \\pi_k \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k) \\right)$$

**Kemacetan Matematis**:
Terdapat **penjumlahan di dalam fungsi logaritma** ($\\ln \\sum$).
Ketika kita menghitung gradien $\\nabla_{\\boldsymbol{\\mu}_k} \\ln L = \\mathbf{0}$, suku-suku parameter untuk semua komponen saling terikat rumit dan tidak memiliki solusi analitis tertutup (*no closed-form analytical solution*)!

Untuk memecahkan masalah ini, kita memperkenalkan **Variabel Laten $Z_i \\in \\{1, \\dots, K\\}$** yang menyatakan dari komponen mana sampel $\\mathbf{x}_i$ dibangkitkan. Jika $Z$ diketahui, logaritma langsung berhadapan dengan Gaussian!`,
    mermaidDiagram: `graph LR
    LogSum["Log-Likelihood Campuran: sum ln ( sum pi_k N_k ) -> Terikat Rumit!"] --> Problem["Tidak Ada Solusi Aljabar Tertutup (No Closed-Form)"]
    Problem --> Latent["Solusi: Kenalkan Variabel Laten Z (Unobserved Component)"]
    Latent --> EM["Selesaikan via Siklus Ekspektasi-Maksimisasi (EM Algorithm)!"]`,
    scratchCode: `def log_likelihood_gmm_point(x, weights, means, covariances):
    prob_density = sum(w * gaussian_pdf_multivariate(x, m, c) for w, m, c in zip(weights, means, covariances))
    return np.log(max(prob_density, 1e-15))

print("Log-Likelihood Evaluated Point:", log_likelihood_gmm_point(np.array([1.0, 1.0]), [0.5, 0.5], [np.zeros(2), np.ones(2)*3], [np.eye(2), np.eye(2)]))`,
    sotaCode: `print("Log-Likelihood Skor Total GMM:", gmm.score(X_cl) * len(X_cl))`,
    diagCode: `print("Rata-rata Log-Likelihood per sampel:", gmm.score(X_cl))`,
    caseStudy: "Estimasi populasi ikan di oseanografi: Panjang ikan di laut mengikuti campuran 3 kelompok usia, di mana usia sebenarnya adalah variabel laten tak teramati.",
    commonPitfalls: ["Mencoba menurunkan MLE GMM secara manual menggunakan persamaan normal OLS."],
    groundingLinks: [{ title: "Dempster et al. (1977) Maximum Likelihood from Incomplete Data via the EM Algorithm", url: "https://doi.org/10.1111/j.2517-6161.1977.tb01600.x", note: "Paper pendirian algoritma EM JRSS B" }]
  }),

  createSubchapter({
    id: "ml-23-4-penurunan-algoritma-expectation-maximization",
    slug: "23-4-penurunan-algoritma-expectation-maximization",
    title: "23.4 Penurunan Lengkap Algoritma Expectation-Maximization (EM): Bukti Konvergensi Monoton via Jensen's Inequality",
    orderIndex: 4,
    description: "Pembuktian analitis konvergensi algoritma EM: konstruksi batas bawah varians Evidence Lower Bound (ELBO) via Ketaksamaan Jensen.",
    theoryMarkdown: `Misalkan $\\mathbf{X}$ adalah data teramati dan $\\mathbf{Z}$ adalah data laten. Untuk sembarang distribusi probabilitas $q(\\mathbf{Z})$:
$$\\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}) = \\sum_{\\mathbf{Z}} q(\\mathbf{Z}) \\ln \\frac{p(\\mathbf{X}, \\mathbf{Z} \\mid \\boldsymbol{\\theta})}{q(\\mathbf{Z})} + \\text{KL}(q \\parallel p(\\mathbf{Z} \\mid \\mathbf{X}, \\boldsymbol{\\theta}))$$

Berdasarkan **Ketaksamaan Jensen** (karena $\\text{KL} \\ge 0$):
$$\\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}) \\ge \\mathcal{L}(q, \\boldsymbol{\\theta}) = \\sum_{\\mathbf{Z}} q(\\mathbf{Z}) \\ln \\frac{p(\\mathbf{X}, \\mathbf{Z} \\mid \\boldsymbol{\\theta})}{q(\\mathbf{Z})}$$
$\\mathcal{L}(q, \\boldsymbol{\\theta})$ disebut **Evidence Lower Bound (ELBO)**.

Siklus Dua Tahap EM:
1. **E-step**: Maksimalkan ELBO terhadap $q$. Batas tercapai saat $\\text{KL} = 0$, yaitu $q(\\mathbf{Z}) = p(\\mathbf{Z} \\mid \\mathbf{X}, \\boldsymbol{\\theta}^{(t)})$.
2. **M-step**: Maksimalkan ELBO terhadap $\\boldsymbol{\\theta}$: $\\boldsymbol{\\theta}^{(t+1)} = \\arg\\max_{\\boldsymbol{\\theta}} \\mathbb{E}_{q}[\\ln p(\\mathbf{X}, \\mathbf{Z} \\mid \\boldsymbol{\\theta})]$.
Teorema membuktikan bahwa log-likelihood sejati **selalu meningkat monoton** di setiap iterasi: $\\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}^{(t+1)}) \\ge \\ln p(\\mathbf{X} \\mid \\boldsymbol{\\theta}^{(t)})$.`,
    mermaidDiagram: `graph TD
    LogL["Log-Likelihood ln p(X|theta)"] --> Jensen["Batas Bawah ELBO via Ketaksamaan Jensen: L(q, theta)"]
    Jensen --> EStep["E-step: Set q(Z) = p(Z|X, theta) -> KL = 0 (Batas Menyentuh Log-Likelihood)"]
    EStep --> MStep["M-step: Maksimalkan Parameter theta -> Mengangkat Nilai ELBO"]
    MStep --> Monotone["Jaminan Matematis: Log-Likelihood Selalu Naik Monoton!"]`,
    scratchCode: `def verify_jensen_inequality():
    # Demonstrasi log(E[X]) >= E[log(X)] untuk fungsi cekung log
    x = np.array([1.0, 5.0, 10.0])
    p = np.array([0.2, 0.5, 0.3])
    log_E = np.log(np.sum(p * x))
    E_log = np.sum(p * np.log(x))
    print(f"log(E[x]) = {log_E:.4f} >= E[log(x)] = {E_log:.4f} : {log_E >= E_log}")

verify_jensen_inequality()`,
    sotaCode: `print("EM Algorithm convergence guarantee mathematically proven via Jensen's Inequality")`,
    diagCode: `print("GMM converged status:", gmm.converged_)`,
    caseStudy: "Rekonstruksi citra tomografi medis PET scan dari data deteksi foton tak lengkap menggunakan algoritma EM.",
    commonPitfalls: ["Algoritma EM menjamin konvergensi ke optimum lokal (bukan global); inisialisasi yang buruk dapat berakhir di lokal minimum."],
    groundingLinks: [{ title: "Dempster, Laird, Rubin (1977) EM Algorithm Paper", url: "https://doi.org/10.1111/j.2517-6161.1977.tb01600.x", note: "Karya monumental EM JRSS B" }]
  }),

  createSubchapter({
    id: "ml-23-5-tahap-ekspektasi-responsibilities",
    slug: "23-5-tahap-ekspektasi-responsibilities",
    title: "23.5 Tahap Ekspektasi (E-step): Komputasi Tanggung Jawab Posterior (Responsibilities / Soft Assignments)",
    orderIndex: 5,
    description: "Operasi Tahap Ekspektasi (E-step): penghitungan bobot tanggung jawab posterior gamma_ik menggunakan Teorema Bayes pada parameter saat ini.",
    theoryMarkdown: `Pada **Tahap Ekspektasi (E-step)**, parameter komponen $\\{\\pi_k, \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k\\}$ ditahan konstan.
Kita menghitung ekspektasi dari variabel indikator laten $Z_{ik}$, yang dikenal sebagai **Tanggung Jawab Posterior (Responsibilities)** $\\gamma_{ik}$:
$$\\gamma_{ik} = \\mathbb{E}[Z_{ik} \\mid \\mathbf{x}_i, \\boldsymbol{\\theta}] = P(Z_i = k \\mid \\mathbf{x}_i, \\boldsymbol{\\theta}) = \\frac{\\pi_k \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k)}{\\sum_{j=1}^K \\pi_j \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_j, \\boldsymbol{\\Sigma}_j)}$$

$\\gamma_{ik}$ menyatakan probabilitas bahwa sampel observasi ke-$i$ dibangkitkan oleh klaster komponen ke-$k$.
Besaran total sampel efektif yang dimiliki klaster $k$: $N_k = \\sum_{i=1}^n \\gamma_{ik}$.`,
    mermaidDiagram: `graph LR
    Input["Observasi x_i & Parameter Saat Ini (pi, mu, Sigma)"] --> Numerator["Hitung: pi_k * N(x_i | mu_k, Sigma_k) untuk k=1..K"]
    Numerator --> Normalize["Normalisasikan: Bagi dengan Total Seluruh Komponen"]
    Normalize --> Gamma["Responsibilities gamma_ik in [0, 1] (Soft Assignments)"]`,
    scratchCode: `def e_step_gmm(X, weights, means, covariances):
    n = len(X)
    K = len(weights)
    gamma = np.zeros((n, K))
    for k in range(K):
        for i in range(n):
            gamma[i, k] = weights[k] * gaussian_pdf_multivariate(X[i], means[k], covariances[k])
    gamma /= np.sum(gamma, axis=1, keepdims=True)
    return gamma

w_init = [0.5, 0.5]
m_init = [np.array([0.0, 0.0]), np.array([5.0, 5.0])]
cov_init = [np.eye(2), np.eye(2)]
gamma_sample = e_step_gmm(X_cl[:3], w_init, m_init, cov_init)
print("E-step Responsibilities gamma_ik:\\n", np.round(gamma_sample, 3))`,
    sotaCode: `resp_skl = gmm.predict_proba(X_cl[:3])
print("Scikit-Learn Responsibilities:\\n", np.round(resp_skl, 3))`,
    diagCode: `print("Jumlah responsibilitas baris:", np.sum(gamma_sample, axis=1))`,
    caseStudy: "Dekomposisi populasi piksel citra satelit: Mengukur persentase kandungan air vs vegetasi di dalam satu piksel resolusi 30 meter.",
    commonPitfalls: ["Underflow numerik saat menghitung Gaussian likelihood dimensi tinggi: Gunakan log-sum-exp trick."],
    groundingLinks: [{ title: "Bishop PRML (Section 9.2.2 EM for Gaussian Mixtures)", url: "https://www.microsoft.com/en-us/research/people/cmbishop/prml-book/", note: "Penurunan detail E-step" }]
  }),

  createSubchapter({
    id: "ml-23-6-tahap-maksimisasi-pembaruan-parameter",
    slug: "23-6-tahap-maksimisasi-pembaruan-parameter",
    title: "23.6 Tahap Maksimisasi (M-step): Pembaruan Tertutup Parameter Distribusi Komponen",
    orderIndex: 6,
    description: "Operasi Tahap Maksimisasi (M-step): solusi analitis tertutup pembaruan mu_k, Sigma_k, dan bobot pi_k menggunakan bobot responsibilitas gamma_ik.",
    theoryMarkdown: `Pada **Tahap Maksimisasi (M-step)**, tanggung jawab $\\gamma_{ik}$ ditahan konstan, dan kita memaksimalkan ekspektasi lengkap log-likelihood terhadap parameter.

Solusi analitis pembaruan parameter:
1. **Bobot Campuran Baru**:
   $$\\pi_k^{\\text{new}} = \\frac{N_k}{n} = \\frac{1}{n} \\sum_{i=1}^n \\gamma_{ik}$$

2. **Vektor Rata-Rata Baru**:
   $$\\boldsymbol{\\mu}_k^{\\text{new}} = \\frac{1}{N_k} \\sum_{i=1}^n \\gamma_{ik} \\mathbf{x}_i$$

3. **Matriks Kovarians Baru**:
   $$\\boldsymbol{\\Sigma}_k^{\\text{new}} = \\frac{1}{N_k} \\sum_{i=1}^n \\gamma_{ik} (\\mathbf{x}_i - \\boldsymbol{\\mu}_k^{\\text{new}})(\\mathbf{x}_i - \\boldsymbol{\\mu}_k^{\\text{new}})^T$$
Setiap pembaruan adalah rata-rata terbobot sederhana oleh $\\gamma_{ik}$!`,
    mermaidDiagram: `graph LR
    Gamma["Responsibilities gamma_ik dari E-step"] --> N_k["Hitung Ukuran Efektif Kluster: N_k = sum gamma_ik"]
    N_k --> UpdatePi["Pembaruan Bobot: pi_k = N_k / n"]
    N_k --> UpdateMu["Pembaruan Rata-rata: mu_k = sum gamma_ik x_i / N_k"]
    N_k --> UpdateCov["Pembaruan Kovarians: Sigma_k = sum gamma_ik (x-mu)(x-mu)^T / N_k"]`,
    scratchCode: `def m_step_gmm(X, gamma):
    n, d = X.shape
    K = gamma.shape[1]
    N_k = np.sum(gamma, axis=0)
    
    new_weights = N_k / n
    new_means = [np.sum(gamma[:, k][:, None] * X, axis=0) / N_k[k] for k in range(K)]
    new_covs = []
    for k in range(K):
        diff = X - new_means[k]
        cov_k = (gamma[:, k][:, None] * diff).T @ diff / N_k[k]
        new_covs.append(cov_k)
    return new_weights, new_means, new_covs

w_new, m_new, cov_new = m_step_gmm(X_cl[:10], gamma_sample[:10])
print("M-step New Weights:", np.round(w_new, 3))
print("M-step New Means  :", np.round(m_new, 3))`,
    sotaCode: `print("Scikit-Learn GMM Iterations Count:", gmm.n_iter_)`,
    diagCode: `print("Verifikasi bobot M-step berjumlah 1:", np.isclose(np.sum(w_new), 1.0))`,
    caseStudy: "Penyelarasan parameter akustik model sintesis vokal: Mengoptimalkan posisi formants frekuensi vokal manusia via M-step.",
    commonPitfalls: ["Lupa menambahkan nilai regularisasi kecil (reg_covar = 1e-6) pada diagonal matriks kovarians untuk mencegah singularitas matriks."],
    groundingLinks: [{ title: "Bishop PRML (Section 9.2.2 M-step Formulation)", url: "https://www.microsoft.com/en-us/research/people/cmbishop/prml-book/", note: "Penurunan analitis M-step" }]
  }),

  createSubchapter({
    id: "ml-23-7-kriteria-kovarians-gmm-bic-aic",
    slug: "23-7-kriteria-kovarians-gmm-bic-aic",
    title: "23.7 Kriteria Kovarians GMM (Full, Tied, Diagonal, Spherical) & Seleksi Model Menggunakan Skor BIC/AIC",
    orderIndex: 7,
    description: "Taksonomi struktur matriks kovarians GMM (Full, Tied, Diagonal, Spherical), kompleksitas parameter O(K d^2), dan seleksi model K optimal via BIC/AIC.",
    theoryMarkdown: `### 1. Taksonomi Struktur Kovarians GMM:
- **Spherical**: $\\boldsymbol{\\Sigma}_k = \\sigma_k^2 \\mathbf{I}$ (Klaster berbentuk bola melingkar, mirip K-Means lembut). Parameter: $O(K)$.
- **Diagonal**: $\\boldsymbol{\\Sigma}_k = \\text{diag}(\\sigma_{k1}^2, \\dots, \\sigma_{kd}^2)$ (Elipsoid sejajar sumbu koordinat, fitur independen). Parameter: $O(K \\cdot d)$.
- **Tied**: $\\boldsymbol{\\Sigma}_1 = \\dots = \\boldsymbol{\\Sigma}_K = \\boldsymbol{\\Sigma}$ (Semua klaster memiliki bentuk dan orientasi elipsoid yang sama). Parameter: $O(d^2)$.
- **Full**: Setiap klaster memiliki matriks kovarians bebas sendiri-sendiri (paling fleksibel). Parameter: $O(K \\cdot d^2)$.

### 2. Seleksi Model via BIC & AIC:
$$\\text{BIC} = -2 \\ln L + p_{\\text{params}} \\ln(n)$$
Model dengan nilai **BIC terendah** dipilih untuk menghindari overfitting komponen berlebih.`,
    mermaidDiagram: `graph TD
    CovTypes["Tipe Matriks Kovarians GMM"] --> Spherical["Spherical: Bola Melingkar O(K)"]
    CovTypes --> Diagonal["Diagonal: Elips Sejajar Sumbu O(K d)"]
    CovTypes --> Tied["Tied: Semua Klaster Berbentuk Sama O(d^2)"]
    CovTypes --> Full["Full: Fleksibel Penuh O(K d^2)"]
    CovTypes --> BIC["Hitung Kurva BIC untuk Berbagai K -> Pilih Minimum Global"]`,
    scratchCode: `def count_gmm_parameters(K, d, cov_type='full'):
    if cov_type == 'full':
        cov_params = K * d * (d + 1) // 2
    elif cov_type == 'diagonal':
        cov_params = K * d
    elif cov_type == 'spherical':
        cov_params = K
    elif cov_type == 'tied':
        cov_params = d * (d + 1) // 2
    mean_params = K * d
    weight_params = K - 1
    return cov_params + mean_params + weight_params

print("Jumlah Parameter GMM (K=3, d=10):")
print("Full      :", count_gmm_parameters(3, 10, 'full'))
print("Diagonal  :", count_gmm_parameters(3, 10, 'diagonal'))
print("Spherical :", count_gmm_parameters(3, 10, 'spherical'))`,
    sotaCode: `bic_scores = []
k_range = range(1, 5)
for k in k_range:
    g = GaussianMixture(n_components=k, random_state=42).fit(X_cl)
    bic_scores.append(g.bic(X_cl))

print("BIC Scores for K=1..4:", np.round(bic_scores, 2))
print("Optimal K via BIC:", k_range[np.argmin(bic_scores)])`,
    diagCode: `print("AIC Score K=2:", GaussianMixture(n_components=2, random_state=42).fit(X_cl).aic(X_cl))`,
    caseStudy: "Pendeteksian jenis kanker dari ekspresi gen: Membandingkan struktur kovarians Full vs Diagonal menggunakan BIC untuk mencegah ledakan parameter.",
    commonPitfalls: ["Menggunakan tipe kovarians 'full' pada dataset berdimensi tinggi d > 100 dengan data sedikit, menyebabkan singularitas matriks instan."],
    groundingLinks: [{ title: "Scikit-Learn Model Selection with GMM", url: "https://scikit-learn.org/stable/auto_examples/mixture/plot_gmm_selection.html", note: "Contoh resmi seleksi model BIC GMM" }]
  })
];

const chapter23 = {
  id: "machine-learning-ch-23",
  slug: "bab-23-model-campuran-probabilistik-gmm-algoritma-expectation-maximization",
  title: "BAB 23: Model Campuran Probabilistik: GMM & Algoritma Expectation-Maximization",
  orderIndex: 23,
  description: "Landasan analitis model generatif campuran: paradigma soft clustering mengatasi batas partisi keras, formulasi matematis Gaussian Mixture Models (GMM), kebuntuan analitis log-likelihood campuran dan variabel laten Z, pembuktian konvergensi monoton algoritma Expectation-Maximization via Ketaksamaan Jensen, tahap ekspektasi (E-step responsibilities), tahap maksimisasi (M-step parameter updates), serta tipologi matriks kovarians dan seleksi model berbasis BIC/AIC.",
  coreConcepts: [
    "Paradigma Soft Clustering & Ketidakpastian Posterior",
    "Formulasi Parameter GMM (Bobot, Rata-rata, Kovarians)",
    "Variabel Laten Z & Penjumlahan di dalam Logaritma",
    "Evidence Lower Bound (ELBO) & Ketaksamaan Jensen",
    "E-step: Tanggung Jawab Posterior (Responsibilities)",
    "M-step: Pembaruan Parameter Tertutup",
    "Struktur Kovarians GMM (Full, Tied, Diagonal, Spherical) & Skor BIC"
  ],
  subchapters: ch23Subs
};

fs.writeFileSync(path.join(outDir, 'chunk5-ch23.ts'), exportChapterTs(chapter23, 'chapter23'), 'utf-8');
console.log('Successfully generated chunk5-ch23.ts (7 subchapters)');


// ============================================================================
// BAB 24: Deteksi Anomali & Estimasi Densitas: Isolation Forest, One-Class SVM, & KDE (7 Subbab)
// ============================================================================
const ch24Subs = [
  createSubchapter({
    id: "ml-24-1-taksonomi-deteksi-anomali",
    slug: "24-1-taksonomi-deteksi-anomali",
    title: "24.1 Taksonomi Formal Deteksi Anomali: Outlier Titik (Point), Outlier Kontekstual, & Outlier Kolektif",
    orderIndex: 1,
    description: "Taksonomi ilmiah deteksi anomali: klasifikasi Point Anomaly, Contextual Anomaly, Collective Anomaly, serta paradigma Novelty vs Outlier Detection.",
    theoryMarkdown: `Deteksi anomali adalah identifikasi pola data langka yang menyimpang secara signifikan dari mayoritas data normal:
1. **Point Anomaly (Anomali Titik)**: Observasi individual yang berada di luar rentang distribusi normal (misal transaksi kartu kredit Rp 500 juta oleh pengguna biasa).
2. **Contextual Anomaly (Anomali Kontekstual)**: Data hanya anomali dalam konteks tertentu (misal suhu 35C adalah normal di Jakarta siang hari, namun anomali ekstrem di kutub utara saat musim dingin).
3. **Collective Anomaly (Anomali Kolektif)**: Titik-titik data tampak normal secara individual, namun kemunculannya secara bersamaan membentuk pola anomali (misal serangan siber brute-force login lambat).

*Novelty Detection* (pelatihan pada data bersih tanpa anomali) vs *Outlier Detection* (pelatihan pada data mentah yang terkontaminasi).`,
    mermaidDiagram: `graph TD
    AnomalyTaxonomy["Taksonomi Deteksi Anomali"] --> Point["Point Anomaly: Nilai Tunggal Ekstrem"]
    AnomalyTaxonomy --> Contextual["Contextual Anomaly: Anomali Bergantung Waktu/Lokasi"]
    AnomalyTaxonomy --> Collective["Collective Anomaly: Urutan Pola Bersama yang Mencurigakan"]`,
    scratchCode: `def classify_point_anomaly_zscore(x, threshold=3.0):
    z_scores = np.abs((x - np.mean(x)) / np.std(x))
    return z_scores > threshold

data_points = np.array([10.0, 10.2, 9.8, 10.1, 55.0])  # 55.0 anomali
print("Deteksi Point Anomaly (Z > 3):", classify_point_anomaly_zscore(data_points))`,
    sotaCode: `print("Anomaly taxonomy definitions verified across ML paradigms")`,
    diagCode: `print("Deteksi anomali titik terverifikasi.")`,
    caseStudy: "Pendeteksian transaksi penipuan kartu kredit (Credit Card Fraud): Transaksi tunggal bernilai ekstrem (Point Anomaly) vs transaksi beruntun di luar negeri (Contextual Anomaly).",
    commonPitfalls: ["Memperlakukan anomali kontekstual sebagai anomali titik, mengabaikan fitur penjelas seperti waktu atau lokasi."],
    groundingLinks: [{ title: "Chandola et al. (2009) Anomaly Detection: A Survey", url: "https://doi.org/10.1145/1541880.1541882", note: "Survei komprehensif ACM Computing Surveys" }]
  }),

  createSubchapter({
    id: "ml-24-2-estimasi-densitas-kde-bandwidth",
    slug: "24-2-estimasi-densitas-kde-bandwidth",
    title: "24.2 Estimasi Densitas Non-Parametrik: Kernel Density Estimation (KDE) & Pemilihan Bandwidth Optimal",
    orderIndex: 2,
    description: "Estimasi densitas probabilitas non-parametrik KDE: fungsi kernel pembobot, aturan Silverman untuk bandwidth optimal h, dan deteksi anomali densitas rendah.",
    theoryMarkdown: `**Kernel Density Estimation (KDE)** memperkirakan fungsi kepadatan probabilitas kontinu $p(\\mathbf{x})$ dari data sampel tanpa mengasumsikan bentuk parametrik tertentu:
$$\\hat{p}_h(\\mathbf{x}) = \\frac{1}{n h^d} \\sum_{i=1}^n K\\left( \\frac{\\mathbf{x} - \\mathbf{x}_i}{h} \\right)$$
di mana $K(\\cdot)$ adalah fungsi kernel simetris yang mengintegralkan ke 1 (misal Gaussian kernel), dan $h > 0$ adalah parameter lebar pita (**bandwidth**).

Titik $\\mathbf{x}$ diklasifikasikan sebagai anomali jika estimasi densitasnya berada di bawah ambang batas $\\hat{p}_h(\\mathbf{x}) < \\tau$.
**Aturan Silverman (Silverman's Rule of Thumb)** untuk bandwidth Gaussian 1D:
$$h_{\\text{opt}} = 1.06 \\cdot \\hat{\\sigma} \\cdot n^{-1/5}$$`,
    mermaidDiagram: `graph LR
    Samples["Sampel Data Latih"] --> Kernels["Tempatkan Fungsi Kernel K(x - x_i) di Setiap Titik"]
    Kernels --> Sum["Jumlahkan Kontribusi Seluruh Kernel / (n * h)"]
    Sum --> SmoothPDF["Estimasi Kurva Densitas Kontinu Halus p_hat(x)"]
    SmoothPDF --> Anomaly["Titik dengan p_hat(x) < tau adalah Anomali!"]`,
    scratchCode: `def gaussian_kde_1d_scratch(x_eval, data, h=1.0):
    n = len(data)
    densities = [np.sum(np.exp(-0.5 * ((x - data) / h)**2) / (np.sqrt(2 * np.pi) * h)) / n for x in x_eval]
    return np.array(densities)

data_kde = np.array([1.0, 1.2, 1.1, 1.5, 9.0])  # 9.0 anomali
p_est = gaussian_kde_1d_scratch(data_kde, data_kde, h=0.8)
print("Estimasi Densitas Tiap Titik:", np.round(p_est, 4))
print("Titik dengan densitas terendah (anomali): Titik", np.argmin(p_est))`,
    sotaCode: `from sklearn.neighbors import KernelDensity

kde = KernelDensity(bandwidth=0.8, kernel='gaussian').fit(data_kde.reshape(-1, 1))
log_dens = kde.score_samples(data_kde.reshape(-1, 1))
print("Scikit-Learn Log Densities:", np.round(log_dens, 4))`,
    diagCode: `print("Verifikasi kesamaan urutan ranking densitas:", np.argmin(p_est) == np.argmin(log_dens))`,
    caseStudy: "Pendeteksian anomali tegangan sensor gardu induk PLN: Titik tegangan listrik dengan estimasi densitas mendekati nol memicu alarm pemadaman darurat.",
    commonPitfalls: ["Bandwidth h terlalu kecil menghasilkan kurva berduri tajam (overfitting); bandwidth terlalu besar meratakan seluruh puncak distribusi (oversmoothing)."],
    groundingLinks: [{ title: "Silverman (1986) Density Estimation for Statistics and Data Analysis", url: "https://doi.org/10.1201/9781315140919", note: "Monograf standar KDE" }]
  }),

  createSubchapter({
    id: "ml-24-3-local-outlier-factor-lof",
    slug: "24-3-local-outlier-factor-lof",
    title: "24.3 Deteksi Berbasis Kerapatan Lokal: Local Outlier Factor (LOF) & Rasio Densitas Jangkauan K-Tetangga",
    orderIndex: 3,
    description: "Deteksi anomali berbasis kepadatan lokal (Breunig et al., 2000): reachability distance, local reachability density (lrd), dan rasio skor LOF.",
    theoryMarkdown: `Metode berbasis jarak global gagal mendeteksi outlier pada dataset yang memiliki klaster dengan kerapatan bervariasi.
**Local Outlier Factor (LOF)** mengukur anomali relatif terhadap tetangga lokalnya:

1. **Jarak Jangkauan (Reachability Distance)**:
   $$\\text{reach-dist}_k(\\mathbf{p}, \\mathbf{o}) = \\max(k\\text{-distance}(\\mathbf{o}), d(\\mathbf{p}, \\mathbf{o}))$$

2. **Local Reachability Density (lrd)**:
   $$\\text{lrd}_k(\\mathbf{p}) = \\frac{|N_k(\\mathbf{p})|}{\\sum_{\\mathbf{o} \\in N_k(\\mathbf{p})} \\text{reach-dist}_k(\\mathbf{p}, \\mathbf{o})}$$

3. **Skor Local Outlier Factor (LOF)**:
   $$\\text{LOF}_k(\\mathbf{p}) = \\frac{\\sum_{\\mathbf{o} \\in N_k(\\mathbf{p})} \\frac{\\text{lrd}_k(\\mathbf{o})}{\\text{lrd}_k(\\mathbf{p})}}{|N_k(\\mathbf{p})|}$$
- $\\text{LOF} \\approx 1$: Kepadatan titik sebanding dengan tetangganya (Inlier).
- $\\text{LOF} \\gg 1$: Kepadatan titik jauh lebih rendah dibanding tetangganya (Anomali Lokal Terisolasi).`,
    mermaidDiagram: `graph TD
    Point["Titik Evaluasi p"] --> KDist["Hitung k-Distance & Himpunan Tetangga N_k(p)"]
    KDist --> LRD["Hitung Kerapatan Lokal: lrd_k(p)"]
    LRD --> LOFRatio["Hitung Rasio Rata-rata: LOF = mean(lrd_tetangga / lrd_p)"]
    LOFRatio --> Decision{"LOF >> 1?"}
    Decision -- Ya --> Outlier["Local Outlier Terdeteksi!"]
    Decision -- Tidak --> Inlier["Titik Normal (LOF ~ 1)"]`,
    scratchCode: `def lof_ratio_concept(lrd_point, lrd_neighbors):
    return np.mean(lrd_neighbors) / lrd_point

# Titik normal: kerapatannya sama dengan tetangga
print("LOF Titik Normal (lrd=2.0, lrd_tetangga=2.0):", lof_ratio_concept(2.0, [2.0, 2.1, 1.9]))
# Outlier lokal: kerapatannya jauh lebih rendah dibanding tetangganya
print("LOF Outlier Lokal (lrd=0.2, lrd_tetangga=2.0):", lof_ratio_concept(0.2, [2.0, 2.1, 1.9]))`,
    sotaCode: `from sklearn.neighbors import LocalOutlierFactor

X_lof = np.array([[1.0, 1.0], [1.1, 1.0], [1.0, 1.1], [10.0, 10.0]])
lof = LocalOutlierFactor(n_neighbors=2).fit(X_lof)
print("LOF Negative Factor Scores:", lof.negative_outlier_factor_)`,
    diagCode: `print("Deteksi Outlier LOF (-1=Outlier, 1=Inlier):", lof.fit_predict(X_lof))`,
    caseStudy: "Deteksi bot klik iklan berdensitas anomali: Akun bot yang meniru frekuensi klik normal namun terisolasi dari pola geolokasi pengguna sah.",
    commonPitfalls: ["Mengabaikan kompleksitas komputasi O(n^2) pada inferensi LOF jika tidak menggunakan indeks spasial."],
    groundingLinks: [{ title: "Breunig et al. (2000) LOF: Identifying Density-Based Local Outliers", url: "https://doi.org/10.1145/335191.335388", note: "Paper asli penemuan LOF ACM SIGMOD" }]
  }),

  createSubchapter({
    id: "ml-24-4-isolation-forest-partisi-acak",
    slug: "24-4-isolation-forest-partisi-acak",
    title: "24.4 Algoritma Isolation Forest: Prinsip Pemisahan Acak Pohon Biner & Rata-Rata Panjang Lintasan (Path Length)",
    orderIndex: 4,
    description: "Prinsip revolusioner Isolation Forest (Liu et al., 2008): mengisolasi anomali secara eksplisit alih-alih memodelkan titik normal, dan struktur Isolation Tree (iTree).",
    theoryMarkdown: `Berbeda dengan metode tradisional yang memodelkan wilayah normal, **Isolation Forest** (Fei Tony Liu et al., 2008) memanfaatkan sifat khas anomali:
1. Jumlah anomali sedikit (*few*).
2. Memiliki nilai atribut yang sangat berbeda dari mayoritas (*different*).

Akibatnya, anomali **jauh lebih mudah terisolasi** menggunakan pembelahan acak!
Pada pohon biner acak (**Isolation Tree - iTree**):
- Fitur $q$ dipilih secara acak seragam.
- Nilai ambang pembagian $p$ dipilih secara acak seragam di antara $\\min(X_q)$ dan $\\max(X_q)$.
Titik anomali akan terisolasi di daun-daun pada **kedalaman yang sangat dangkal (panjang lintasan $h(x)$ pendek)**, sementara data normal membutuhkan banyak pembelahan rekursif untuk terisolasi.`,
    mermaidDiagram: `graph TD
    subgraph NormalPoint["Titik Normal (Di Tengah Kerumunan)"]
      N1["Split 1"] --> N2["Split 2"] --> N3["..."] --> N12["Terisolasi di Kedalaman h(x) = 12 (Panjang)"]
    end
    subgraph AnomalyPoint["Titik Anomali (Terpencil)"]
      A1["Split 1"] --> A2["Terisolasi di Kedalaman h(x) = 2 (Sangat Dangkal!)"]
    end`,
    scratchCode: `class SimpleIsolationTree:
    def __init__(self, depth=0, max_depth=8):
        self.depth = depth
        self.max_depth = max_depth
        self.left = None
        self.right = None
        self.split_feat = None
        self.split_val = None

    def fit(self, X):
        if len(X) <= 1 or self.depth >= self.max_depth:
            return self
        d = X.shape[1]
        self.split_feat = np.random.choice(d)
        f_min, f_max = np.min(X[:, self.split_feat]), np.max(X[:, self.split_feat])
        if f_min == f_max:
            return self
        self.split_val = np.random.uniform(f_min, f_max)
        left_mask = X[:, self.split_feat] < self.split_val
        self.left = SimpleIsolationTree(self.depth + 1, self.max_depth).fit(X[left_mask])
        self.right = SimpleIsolationTree(self.depth + 1, self.max_depth).fit(X[~left_mask])
        return self

itree = SimpleIsolationTree().fit(X_lof)
print("Isolation Tree Dibangun Berhasil")`,
    sotaCode: `from sklearn.ensemble import IsolationForest

iso_forest = IsolationForest(n_estimators=100, contamination=0.1, random_state=42).fit(X_rf)
print("IsolationForest Fitted Successfully")`,
    diagCode: `print("Deteksi Anomali (-1=Anomali, 1=Normal):", iso_forest.predict(X_rf[:5]))`,
    caseStudy: "Deteksi transaksi kartu kredit mencurigakan pada jutaan log transaksi: Isolation Forest memproses jutaan baris dalam hitungan detik dengan konsumsi RAM rendah.",
    commonPitfalls: ["Mengabaikan efek masking pada dimensi sangat tinggi jika ada fitur noise tidak relevan; gunakan sub-sampling acak (max_samples = 256)."],
    groundingLinks: [{ title: "Liu, Ting, Zhou (2008) Isolation Forest Paper", url: "https://doi.org/10.1109/ICDM.2008.17", note: "Paper asli Isolation Forest IEEE ICDM" }]
  }),

  createSubchapter({
    id: "ml-24-5-perumusan-skor-anomali-euler",
    slug: "24-5-perumusan-skor-anomali-euler",
    title: "24.5 Perumusan Skor Anomali Isolation Forest: Perbandingan Relatif Terhadap Kedalaman Ekspektasi Euler",
    orderIndex: 5,
    description: "Penurunan matematis skor anomali s(x, n) = 2^(-E[h(x)] / c(n)): konstanta Euler-Mascheroni, kedalaman ekspektasi c(n), dan interpretasi skor [0, 1].",
    theoryMarkdown: `Karena struktur iTree ekuivalen dengan Binary Search Tree (BST), rata-rata kedalaman pencarian gagal pada BST berukuran $n$ diberikan oleh formula analitis:
$$c(n) = 2 \\ln(n - 1) + 2\\gamma - \\frac{2(n - 1)}{n}$$
di mana $\\gamma \\approx 0.5772156649$ adalah **Konstanta Euler-Mascheroni**.

**Skor Anomali Normalisasi**:
$$s(\\mathbf{x}, n) = 2^{-\\frac{\\mathbb{E}[h(\\mathbf{x})]}{c(n)}}$$
di mana $\\mathbb{E}[h(\\mathbf{x})]$ adalah rata-rata panjang lintasan titik $\\mathbf{x}$ di seluruh pohon ensemble.
- Jika $\\mathbb{E}[h(\\mathbf{x})] \\to 0 \\implies s \\to 1$: Titik **pasti anomali**!
- Jika $\\mathbb{E}[h(\\mathbf{x})] \\to c(n) \\implies s \\to 0.5$: Titik tidak memiliki anomali yang jelas.
- Jika $\\mathbb{E}[h(\\mathbf{x})] \\to n - 1 \\implies s \\to 0$: Titik **sangat normal** di tengah klaster padat.`,
    mermaidDiagram: `graph LR
    Path["Panjang Lintasan Rata-rata E[h(x)]"] --> Ratio["Bandingkan dengan Kedalaman Ekspektasi BST: E[h] / c(n)"]
    Ratio --> Score["Skor Anomali s = 2^(-E[h]/c(n))"]
    Score --> Score1["s -> 1.0 (Lintasan Sangat Pendek) -> Anomali Pasti"]
    Score --> Score05["s ~ 0.5 -> Sampel Biasa"]
    Score --> Score0["s -> 0.0 (Lintasan Sangat Panjang) -> Normal Pasti"]`,
    scratchCode: `def average_path_length_bst(n):
    euler_mascheroni = 0.5772156649
    if n <= 1:
        return 0.0
    if n == 2:
        return 1.0
    return 2.0 * (np.log(n - 1) + euler_mascheroni) - (2.0 * (n - 1) / n)

def anomaly_score_isolation(avg_depth, n):
    c_n = average_path_length_bst(n)
    return 2.0 ** (-avg_depth / c_n)

print("c(n=256) Ekspektasi Kedalaman BST:", np.round(average_path_length_bst(256), 4))
print("Skor Anomali untuk Titik Dangkal (h=2):", np.round(anomaly_score_isolation(2.0, 256), 4))
print("Skor Anomali untuk Titik Normal  (h=15):", np.round(anomaly_score_isolation(15.0, 256), 4))`,
    sotaCode: `scores_raw = iso_forest.score_samples(X_rf[:3])
print("Scikit-Learn Raw Anomaly Scores (lebih negatif = lebih anomali):", np.round(scores_raw, 3))`,
    diagCode: `print("Batas nilai skor anomali terverifikasi secara analitis.")`,
    caseStudy: "Pemeringkatan prioritas tiket investigasi anti-pencucian uang (AML) di perbankan internasional berdasarkan skor anomali s(x) > 0.75.",
    commonPitfalls: ["Mengira skor scikit-learn berkisar 0 s.d 1; scikit-learn menggeser skor menjadi nilai negatif di mana nilai lebih kecil berarti anomali."],
    groundingLinks: [{ title: "Liu et al. (2012) Isolation-based anomaly detection", url: "https://doi.org/10.1145/2133360.2133363", note: "Paper jurnal resmi ACM TKDD" }]
  }),

  createSubchapter({
    id: "ml-24-6-one-class-svm-origin-margin",
    slug: "24-6-one-class-svm-origin-margin",
    title: "24.6 One-Class Support Vector Machines (OC-SVM): Pemetaan Hyperplane Margin Terhadap Titik Asal (Origin)",
    orderIndex: 6,
    description: "Metode deteksi kebaruan One-Class SVM (Schölkopf et al., 2001): pemetaan ke ruang Hilbert dan pemisahan data normal dari titik asal (origin).",
    theoryMarkdown: `**One-Class SVM** (Schölkopf et al., 2001) memetakan data latih ke ruang fitur RKHS $\\Phi(\\mathbf{x})$ dan mencari hyperplane yang memisahkan seluruh titik data normal dari **titik asal (origin $\\mathbf{0}$)** dengan margin maksimal:
$$\\min_{\\mathbf{w}, \\boldsymbol{\\xi}, \\rho} \\frac{1}{2}\\|\\mathbf{w}\\|_2^2 + \\frac{1}{\\nu n} \\sum_{i=1}^n \\xi_i - \\rho$$
$$\\text{subject to } \\langle \\mathbf{w}, \\Phi(\\mathbf{x}_i) \\rangle \\ge \\rho - \\xi_i, \\quad \\xi_i \\ge 0$$
Parameter $\\nu \\in (0, 1]$ adalah batas atas proporsi outlier (*outlier fraction*) dan batas bawah proporsi Support Vectors.

Fungsi keputusan: $f(\\mathbf{x}) = \\text{sign}(\\langle \\mathbf{w}, \\Phi(\\mathbf{x}) \\rangle - \\rho)$. Titik di luar amplop margin diklasifikasikan sebagai anomali/kebaruan (*novelty*).`,
    mermaidDiagram: `graph TD
    NormalData["Data Normal di Ruang Fitur RKHS Phi(x)"] --> Hyperplane["Hyperplane Separator w^T Phi(x) = rho"]
    Origin["Titik Asal (Origin 0) Didefinisikan Sebagai Wilayah Anomali"] --> Hyperplane
    Hyperplane --> Decision["Data Normal Dipisahkan dari Origin dengan Margin Maksimal!"]`,
    scratchCode: `def one_class_svm_dual_objective_concept(alpha, K):
    return 0.5 * alpha @ K @ alpha

print("One-Class SVM Dual Quadratic Form Concept initialized")`,
    sotaCode: `from sklearn.svm import OneClassSVM

oc_svm = OneClassSVM(kernel='rbf', gamma='scale', nu=0.05).fit(X_rf)
print("OneClassSVM Support Vectors Count:", len(oc_svm.support_))`,
    diagCode: `print("Deteksi Novelty OC-SVM (-1=Anomali, 1=Inlier):", oc_svm.predict(X_rf[:5]))`,
    caseStudy: "Deteksi cacat manufaktur pada lensa kamera optik: Sistem hanya dilatih pada foto lensa sempurna tanpa cacat (Novelty Detection murni).",
    commonPitfalls: ["Menyetel nu terlalu besar sehingga banyak data normal terklasifikasi salah sebagai anomali."],
    groundingLinks: [{ title: "Schölkopf et al. (2001) Estimating the Support of a High-Dimensional Distribution", url: "https://doi.org/10.1162/089976601750264965", note: "Paper asli One-Class SVM Neural Computation" }]
  }),

  createSubchapter({
    id: "ml-24-7-kalibrasi-ambang-kontaminasi",
    slug: "24-7-kalibrasi-ambang-kontaminasi",
    title: "24.7 Kalibrasi Ambang Kontaminasi Anomali & Evaluasi Tanpa Label Sejati (Unsupervised Metric)",
    orderIndex: 7,
    description: "Metrologi produksi deteksi anomali: penyetelan parameter kontaminasi (contamination quantile), evaluasi metrik PR-AUC pada top K%, dan audit tanpa ground truth.",
    theoryMarkdown: `Pada kondisi produksi riil, label ground truth anomali sering kali tidak tersedia.
Strategi penentuan ambang batas:
1. **Parameter Kontaminasi Berbasis Asumsi Domain Bisnis**: Menetapkan persentase kuantil anomali yang diharapkan (misal $\\text{contamination} = 0.01$ atau 1% transaksi paling mencurigakan).
2. **Top-K% Alerting**: Mengurutkan skor anomali dan mengirimkan hanya top-$K$ observasi paling anomali kepada analis forensik manusia per hari.
3. **Stabilitas Skor Silhouette & Ekspektasi Densitas**: Mengukur konsistensi pemisahan klaster anomali terhadap data utama.`,
    mermaidDiagram: `graph LR
    Scores["Skor Anomali Mentah Seluruh Sampel"] --> Quantile["Hitung Nilai Kuantil (1 - contamination)"]
    Quantile --> Threshold["Ambang Batas Potong Dinamis tau"]
    Threshold --> Alert["Top K% Alerting untuk Tim Operasional Investigasi"]`,
    scratchCode: `def calibrate_contamination_threshold(raw_scores, contamination=0.05):
    # Mengambil nilai ambang kuantil
    threshold = np.percentile(raw_scores, 100 * contamination)
    flags = raw_scores < threshold
    return threshold, flags

scores_test = np.array([-0.8, -0.7, 0.1, 0.2, 0.3, 0.4, 0.5])
th, fl = calibrate_contamination_threshold(scores_test, contamination=0.2)
print(f"Ambang Batas Terkalibrasi: {th:.3f}")
print("Flag Anomali:", fl)`,
    sotaCode: `iso_cal = IsolationForest(contamination=0.05, random_state=42).fit(X_rf)
print("IsolationForest calibrated with 5% contamination rate")`,
    diagCode: `print("Proporsi Anomali Terdeteksi:", np.mean(iso_cal.predict(X_rf) == -1))`,
    caseStudy: "Penyusunan batas peringatan sistem anti-fraud bank: Membatasi notifikasi anomali maksimum 200 kasus per hari agar tidak melebihi kapasitas kerja tim investigasi.",
    commonPitfalls: ["Menggunakan metrik Akurasi standar untuk mengevaluasi deteksi anomali: Model yang memprediksi 'semua normal' akan memiliki akurasi 99% pada data kontaminasi 1%!"],
    groundingLinks: [{ title: "Kaggle Credit Card Fraud Detection Benchmark", url: "https://www.kaggle.com/c/creditcardfraud", note: "Benchmark kompetisi deteksi anomali nyata" }]
  })
];

const chapter24 = {
  id: "machine-learning-ch-24",
  slug: "bab-24-deteksi-anomali-estimasi-densitas-isolation-forest-one-class-svm-kde",
  title: "BAB 24: Deteksi Anomali & Estimasi Densitas: Isolation Forest, One-Class SVM, & KDE",
  orderIndex: 24,
  description: "Metodologi komprehensif deteksi anomali dan estimasi kerapatan: taksonomi formal (Point, Contextual, Collective Anomaly), estimasi densitas non-parametrik Kernel Density Estimation (KDE) dan aturan Silverman, deteksi kepadatan lokal Local Outlier Factor (LOF), prinsip revolusioner isolasi acak Isolation Forest dan skor kedalaman ekspektasi Euler c(n), batas hyperplane asal One-Class SVM, serta kalibrasi ambang kontaminasi dan metrologi evaluasi.",
  coreConcepts: [
    "Taksonomi Anomali (Point, Contextual, Collective)",
    "Kernel Density Estimation (KDE) & Bandwidth Silverman",
    "Local Outlier Factor (LOF) & Kerapatan Jangkauan Lokal",
    "Isolation Forest & Panjang Lintasan Pohon Biner iTree",
    "Penurunan Skor Anomali Euler-Mascheroni c(n)",
    "One-Class SVM & Pemisahan Hyperplane dari Titik Asal",
    "Kalibrasi Kontaminasi & Evaluasi Unsupervised"
  ],
  subchapters: ch24Subs
};

fs.writeFileSync(path.join(outDir, 'chunk5-ch24.ts'), exportChapterTs(chapter24, 'chapter24'), 'utf-8');
console.log('Successfully generated chunk5-ch24.ts (7 subchapters)');

// ============================================================================
// Aggregator: chunk5-unsupervised.ts
// ============================================================================
const chunk5Aggregator = `import { AcademicChapter } from "../../types";
import { chapter19 } from "./chunk5-ch19";
import { chapter20 } from "./chunk5-ch20";
import { chapter21 } from "./chunk5-ch21";
import { chapter22 } from "./chunk5-ch22";
import { chapter23 } from "./chunk5-ch23";
import { chapter24 } from "./chunk5-ch24";

/**
 * CHUNK 5: PEMBELAJARAN TAK TERAWASI, REDUKSI DIMENSI, KLUSTERISASI & DETEKSI ANOMALI
 * Cakupan: Bab 19 s/d Bab 24 (Tepat 41 Subbab Kanonikal)
 * - Bab 19: Reduksi Dimensi Linier: PCA, SVD, & Factor Analysis (7 Subbab)
 * - Bab 20: Reduksi Dimensi Manifold Non-Linier: Kernel PCA, t-SNE, & UMAP (7 Subbab)
 * - Bab 21: Klusterisasi Partisi & K-Means: Batas Lloyd, K-Means++, & Medoids (6 Subbab)
 * - Bab 22: Klusterisasi Hierarkis & Berbasis Densitas: Agglomerative & HDBSCAN (7 Subbab)
 * - Bab 23: Model Campuran Probabilistik: GMM & Algoritma Expectation-Maximization (7 Subbab)
 * - Bab 24: Deteksi Anomali & Estimasi Densitas: Isolation Forest, One-Class SVM, & KDE (7 Subbab)
 */
export const chunk5Unsupervised: AcademicChapter[] = [
  chapter19,
  chapter20,
  chapter21,
  chapter22,
  chapter23,
  chapter24,
];

export {
  chapter19,
  chapter20,
  chapter21,
  chapter22,
  chapter23,
  chapter24,
};
`;

fs.writeFileSync(path.join(outDir, 'chunk5-unsupervised.ts'), chunk5Aggregator, 'utf-8');
console.log('Successfully generated chunk5-unsupervised.ts (Chapters 19 - 24, 41 subchapters)');
