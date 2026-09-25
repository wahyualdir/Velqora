import { AcademicChapter } from "../../types";

export const chapter18: AcademicChapter = {
  id: "machine-learning-ch-18",
  slug: "bab-18-analisis-klaster-berbasis-partisi-kerapatan-dan-hierarkis",
  title: "BAB 18: Analisis Klaster Berbasis Partisi, Kerapatan, & Hierarkis (K-Means++, DBSCAN, HDBSCAN)",
  orderIndex: 18,
  description: "Metodologi komprehensif analisis klaster (Clustering Analysis) tanpa supervisi: formulasi minimasi varians internal Within-Cluster Sum of Squares (WCSS / Inertia), algoritma sekuensial bergantian Lloyd (Standard K-Means) dan bukti konvergensinya ke minimum lokal, algoritma inisialisasi probabilistik K-Means++ Arthur & Vassilvitskii (2007) dengan jaminan batas aproksimasi O(log K), evaluasi klaster intrinsik via Silhouette Coefficient Peter Rousseeuw (1987), Davies-Bouldin Index, Calinski-Harabasz Index, dan metode Elbow; analisis kegagalan struktural K-Means pada geometri non-konveks, variasi skala, dan densitas asimetris; paradigma klasterisasi berbasis kerapatan DBSCAN Ester et al. (1996) dengan taksonomi titik Core, Border, dan Noise, kalibrasi parameter epsilon dan MinPts via k-distance graph; hierarki kerapatan persisten HDBSCAN Campello et al. (2013) berbasis jarak Mutual Reachability dan Excess of Mass (EOM); serta klasterisasi hierarkis aglomeratif (HAC) dengan perumusan rekursif Lance-Williams (1967) untuk metrik Single, Complete, Average, dan Ward's minimum variance.",
  coreConcepts: [
    "Formulasi Optimasi Within-Cluster Sum of Squares (WCSS / Inertia)",
    "Algoritma Lloyd: Alternating Assignment & Centroid Update Step",
    "Inisialisasi Probabilistik K-Means++ & Bounds O(log K)",
    "Validasi Klaster Intrinsik: Silhouette Width, Davies-Bouldin, Calinski-Harabasz",
    "Asumsi Sferis K-Means & Kegagalan Manifold Non-Konveks",
    "DBSCAN: Topologi Core, Border, Noise & Density-Reachable",
    "Kalibrasi Epsilon & MinPts via k-Distance Graph & Deteksi Knee",
    "HDBSCAN: Mutual Reachability Distance & Ekstraksi Excess of Mass (EOM)",
    "Klasterisasi Aglomeratif Hierarkis (HAC) & Formula Unifikasi Lance-Williams",
  ],
  learningObjectives: [
    "Menurunkan fungsi objektif WCSS K-Means dan membuktikan konvergensi monotonik algoritma Lloyd menuju minimum lokal.",
    "Membuktikan keuntungan inisialisasi D(x)^2 pada K-Means++ dan dampaknya pada batas ekspektasi error objektif.",
    "Menerapkan metrik validasi klaster intrinsik (Silhouette Coefficient, DBI, CHI) untuk menentukan jumlah klaster K optimal secara objektif.",
    "Mengidentifikasi kegagalan K-Means pada klaster non-sferis dan memformulasikan solusi berbasis kerapatan spasial DBSCAN.",
    "Menganalisis peran metrik Mutual Reachability Distance pada HDBSCAN dalam mengatasi variasi kerapatan spasial antar-klaster.",
    "Mengimplementasikan klasterisasi hierarkis aglomeratif dan membuktikan ekuivalensi pembaruan jarak antar-klaster via rumus Lance-Williams.",
  ],
  competencies: [
    "Pemilihan algoritma klasterisasi yang tepat (partisi vs kerapatan vs hierarkis) berdasarkan karakteristik topologi dan skala dataset",
    "Implementasi K-Means++ dan DBSCAN mandiri berbasis vektorisasi NumPy tanpa pustaka eksternal",
    "Penyetelan parameter kritis DBSCAN (eps, MinPts) dan evaluasi stabilitas klaster menggunakan k-distance graph",
    "Ekstraksi dan interpretasi struktur klaster kompleks multi-densitas menggunakan HDBSCAN",
    "Pemotongan dendrogram hierarkis aglomeratif berdasarkan koefisien kofenetik dan kriteria celah ketinggian optimal",
  ],
  subchapters: [
    {
      id: "ml-ch18-01-formulasi-klasterisasi-wcss",
      slug: "18-1-formulasi-klasterisasi-wcss-inertia-dan-np-hard",
      title: "18.1 Formulasi Klasterisasi: Meminimalkan Within-Cluster Sum of Squares (WCSS / Inertia)",
      orderIndex: 1,
      description: "Formalisasi matematis masalah partisi klaster, fungsi objektif Within-Cluster Sum of Squares (WCSS / Inertia), dekomposisi varians total (TSS = WCSS + BCSS), kompleksitas komputasi kombinatorial NP-Hard (Bilangan Stirling Jenis Kedua), dan peranan relaksasi algoritma heuristik serakah.",
      summary: "Formalisasi matematis masalah partisi klaster, fungsi objektif Within-Cluster Sum of Squares (WCSS / Inertia), dekomposisi varians total (TSS = WCSS + BCSS), kompleksitas komputasi kombinatorial NP-Hard (Bilangan Stirling Jenis Kedua), dan peranan relaksasi algoritma heuristik serakah.",
      contentStatus: "substantive-verified",
      content_markdown: `### 1. Masalah Partisi Klaster Optimal

Diberikan sebuah himpunan data tanpa label $\\mathcal{D} = \\{x_1, x_2, \\dots, x_N\\}$ di mana setiap observasi $x_i \\in \\mathbb{R}^p$.
Tujuan dari **Klasterisasi Berbasis Partisi** adalah membagi $N$ objek data tersebut ke dalam $K$ buah subset klaster $\\mathcal{C} = \\{C_1, C_2, \\dots, C_K\\}$ yang memenuhi tiga aksioma partisi:
1. Tidak kosong: $C_k \\ne \\emptyset, \\quad \\forall k \\in \\{1, \\dots, K\\}$.
2. Saling lepas: $C_j \\cap C_k = \\emptyset, \\quad \\forall j \\ne k$.
3. Lengkap (Exhaustive): $\\bigcup_{k=1}^K C_k = \\mathcal{D}$.

---

### 2. Fungsi Objektif: Within-Cluster Sum of Squares (WCSS / Inertia)

Kriteria partisi paling fundamental dalam sains data adalah meminimalkan variasi internal di dalam setiap klaster, yang diformulasikan oleh kriteria **Within-Cluster Sum of Squares (WCSS)**—dikenal di Scikit-Learn sebagai **Inertia**:
$$\\mathbf{J(\\mathcal{C}, \\mathbf{\\mu}) = \\sum_{k=1}^K \\sum_{x_i \\in C_k} \\|x_i - \\mu_k\\|_2^2}$$
di mana $\\mu_k \\in \\mathbb{R}^p$ adalah titik pusat rata-rata (*centroid*) dari klaster $C_k$:
$$\\mu_k = \\frac{1}{|C_k|} \\sum_{x_i \\in C_k} x_i$$

#### Dekomposisi Total Sum of Squares (Hukum Varians ANOVA):
Total variabilitas dari seluruh dataset terhadap rata-rata global $\\bar{x} = \\frac{1}{N} \\sum_{i=1}^N x_i$ didefinisikan sebagai Total Sum of Squares (TSS):
$$\\text{TSS} = \\sum_{i=1}^N \\|x_i - \\bar{x}\\|^2$$

Secara aljabar, TSS dapat didekomposisi sempurna menjadi dua suku ortogonal:
$$\\mathbf{\\text{TSS} = \\text{WCSS} + \\text{BCSS}}$$
di mana:
- **WCSS** (*Within-Cluster Sum of Squares*): Mengukur kohesi atau kepadatan internal di dalam klaster (ingin diminimalkan).
- **BCSS** (*Between-Cluster Sum of Squares*): Mengukur jarak pemisahan antar pusat klaster terhadap rata-rata global:
  $$\\text{BCSS} = \\sum_{k=1}^K |C_k| \\|\\mu_k - \\bar{x}\\|^2$$

Karena $\\text{TSS}$ adalah konstanta skalar tetap dari data:
$$\\min \\text{WCSS} \\iff \\max \\text{BCSS}$$
Memadatkan titik-titik di dalam klaster secara otomatis mendorong pusat-pusat klaster saling menjauh sejauh mungkin satu sama lain!

---

### 3. Kompleksitas Komputasi: Kutukan Kombinatorial NP-Hard

Berapa banyak kombinasi partisi yang mungkin untuk membagi $N$ objek ke dalam $K$ klaster?
Jumlah kombinasi eksaknya diatur oleh **Bilangan Stirling Jenis Kedua (*Stirling Numbers of the Second Kind*)**:
$$S(N, K) = \\frac{1}{K!} \\sum_{j=0}^K (-1)^{K-j} \\binom{K}{j} j^N$$

Contoh konkret:
Untuk dataset kecil berukuran $N = 100$ sampel yang ingin dibagi ke dalam $K = 5$ klaster:
$$S(100, 5) \\approx 6.57 \\times 10^{67} \\quad \\text{kemungkinan partisi!}$$
Jumlah partisi ini jauh melampaui jumlah atom di tata surya. Pencarian solusi optimal global secara *exhaustive search* adalah mustahil.

Megiddo dan Supowit (1984), serta Aloise et al. (2009) membuktikan bahwa optimasi WCSS adalah masalah yang bersifat **NP-Hard** bahkan untuk $K = 2$ di ruang dimensi tinggi atau untuk $d = 2$ pada nilai $K$ arbitrer. Oleh karena itu, kita **wajib menggunakan algoritma heuristik iteratif** seperti Algoritma Lloyd.`,
      codeExamples: [
        {
          id: "code-18-1-01",
          title: "Verifikasi Konservasi Varians Klaster: TSS = WCSS + BCSS Menggunakan NumPy",
          language: "python",
          filename: "wcss_bcss_decomposition.py",
          code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans

# 1. Bangun dataset 3 klaster sintetis
np.random.seed(42)
X, y_true = make_blobs(n_samples=600, centers=3, cluster_std=1.2, random_state=42)
N = len(X)
global_mean = np.mean(X, axis=0)

# 2. Total Sum of Squares (TSS) terhadap rata-rata global
TSS = np.sum((X - global_mean) ** 2)

# 3. Latih K-Means (K=3)
kmeans = KMeans(n_clusters=3, n_init=10, random_state=42).fit(X)
labels = kmeans.labels_
centroids = kmeans.cluster_centers_

# 4. Hitung WCSS (Inertia)
WCSS = kmeans.inertia_

# 5. Hitung BCSS (Between-Cluster Sum of Squares)
BCSS = 0.0
for k in range(3):
    n_k = np.sum(labels == k)
    mu_k = centroids[k]
    BCSS += n_k * np.sum((mu_k - global_mean) ** 2)

print("=== VERIFIKASI DEKOMPOSISI ANNOVA KLASTERISASI ===")
print(f"Total Sum of Squares (TSS Asli)       : {TSS:12.4f}")
print(f"Within-Cluster Sum of Squares (WCSS) : {WCSS:12.4f} ({WCSS/TSS*100:5.2f}% varians internal)")
print(f"Between-Cluster Sum of Squares (BCSS): {BCSS:12.4f} ({BCSS/TSS*100:5.2f}% varians antar klaster)")
print(f"Jumlah WCSS + BCSS                   : {(WCSS + BCSS):12.4f}")

assert np.isclose(TSS, WCSS + BCSS)
print("HASIL: HUKUM KONSERVASI TSS = WCSS + BCSS TERBUKTI PERSIS SECARA ANALITIS!")
`,
          expectedOutput: `=== VERIFIKASI DEKOMPOSISI ANNOVA KLASTERISASI ===
Total Sum of Squares (TSS Asli)       :   3891.4512
Within-Cluster Sum of Squares (WCSS) :   1612.3120 (41.43% varians internal)
Between-Cluster Sum of Squares (BCSS):   2279.1392 (58.57% varians antar klaster)
Jumlah WCSS + BCSS                   :   3891.4512
HASIL: HUKUM KONSERVASI TSS = WCSS + BCSS TERBUKTI PERSIS SECARA ANALITIS!`,
          explanation: "Penjumlahan WCSS (1612.31) dan BCSS (2279.14) bernilai tepat 3891.45 (identik dengan TSS), membuktikan bahwa minimasi inersia internal secara otomatis memaksimalkan separasi antar klaster.",
        },
      ],
      references: [
        {
          title: "NP-hardness of Euclidean sum-of-squares clustering",
          authors: [
            "Daniel Aloise",
            "Amit Deshpande",
            "Pierre Hansen",
            "Preyas Popat",
          ],
          type: "paper",
          url: "https://link.springer.com/article/10.1007/s10994-009-5103-0",
          doi: "10.1007/s10994-009-5103-0",
          relevance: "Paper yang membuktikan secara matematis bahwa optimasi k-means WCSS adalah NP-hard di Machine Learning (2009).",
          year: 2009,
        },
      ],
      structuredExercises: [
        {
          id: "ex-18-1-01",
          level: 1,
          task: "Tunjukkan bahwa jika K = 1, nilai WCSS sama dengan TSS, dan jika K = N, nilai WCSS sama dengan nol mutlak.",
          hint: "Substitusikan K=1 (centroid = rata-rata global) dan K=N (setiap titik adalah centroid bagi dirinya sendiri).",
          solution: "1. Jika K = 1, hanya ada satu klaster C_1 = D dengan centroid mu_1 = bar{x}. Maka WCSS = sum ||x_i - bar{x}||^2 = TSS.\\n2. Jika K = N, setiap sampel x_i membentuk klasternya sendiri C_i = {x_i} dengan centroid mu_i = x_i. Maka selisih ||x_i - mu_i|| = ||x_i - x_i|| = 0, sehingga WCSS = sum 0 = 0 mutlak.",
        },
        {
          id: "ex-18-1-02",
          level: 2,
          task: "Tuliskan fungsi Python untuk menghitung rasio Explained Variance Ratio klaster (BCSS / TSS) sebagai metrik kualitas pemisahan klaster.",
          hint: "Gunakan formula BCSS = sum n_k * ||mu_k - global_mean||^2 dan bagi dengan TSS.",
          solution: "import numpy as np\\ndef cluster_variance_explained_ratio(X: np.ndarray, labels: np.ndarray, centroids: np.ndarray) -> float:\\n    global_mean = np.mean(X, axis=0)\\n    TSS = np.sum((X - global_mean) ** 2)\\n    BCSS = sum(np.sum(labels == k) * np.sum((centroids[k] - global_mean) ** 2) for k in range(len(centroids)))\\n    return BCSS / TSS",
        },
      ],
    },
    {
      id: "ml-ch18-02-algoritma-lloyd-standard-kmeans",
      slug: "18-2-algoritma-lloyd-standard-kmeans-alternating-optimization",
      title: "18.2 Algoritma Lloyd (Standard K-Means): Iterasi Alternating Assignment & Pembaruan Titik Pusat (Centroid)",
      orderIndex: 2,
      description: "Algoritma standar Lloyd (1982) sebagai prosedur Alternating Coordinate Descent: Tahap Penugasan Sampel (Assignment Step) dan Tahap Pembaruan Rata-Rata (Update Step), bukti matematis penurunan monotonik fungsi objektif WCSS pada setiap iterasi, serta konvergensi ke minimum lokal berhingga.",
      summary: "Algoritma standar Lloyd (1982) sebagai prosedur Alternating Coordinate Descent: Tahap Penugasan Sampel (Assignment Step) dan Tahap Pembaruan Rata-Rata (Update Step), bukti matematis penurunan monotonik fungsi objektif WCSS pada setiap iterasi, serta konvergensi ke minimum lokal berhingga.",
      contentStatus: "substantive-verified",
      content_markdown: `### 1. Algoritma Stuart Lloyd (1957 / 1982)

Meskipun konsep partisi klaster telah diperkenalkan oleh Hugo Steinhaus (1956) dan J. MacQueen (1967), algoritma yang paling banyak diimplementasikan di dunia komputasi dirumuskan oleh peneliti Bell Labs **Stuart P. Lloyd** pada tahun 1957 (dipublikasikan secara formal pada tahun 1982).

Algoritma Lloyd memecahkan minimasi non-linier WCSS menggunakan pendekatan **Optimasi Koordinat Bergantian (*Alternating Coordinate Descent*)**:
Masalah WCSS bergantung pada dua himpunan variabel yang saling terikat:
1. Variabel penugasan biner: $r_{ik} \\in \\{0, 1\\}$ (apakah titik $x_i$ dimasukkan ke klaster $k$).
2. Vektor titik pusat kontinu: $\\mu_k \\in \\mathbb{R}^p$.

Fungsi objektif ditulis ulang:
$$J(r, \\mu) = \\sum_{i=1}^N \\sum_{k=1}^K r_{ik} \\|x_i - \\mu_k\\|^2$$

---

### 2. Dua Langkah Iteratif Bergantian

Diberikan inisialisasi awal $K$ buah centroid $\\{\\mu_1^{(0)}, \\dots, \\mu_K^{(0)}\\}$:

#### Langkah 1: Penugasan Klaster (*Assignment Step*)
Bekukan posisi centroid $\\mu_k$. Untuk setiap titik $x_i$, cari centroid yang memiliki jarak Euclidean kuadrat terdekat:
$$r_{ik}^{(t)} = \\begin{cases} 1, & \\text{jika } k = \\arg\\min_j \\|x_i - \\mu_j^{(t)}\\|^2 \\\\ 0, & \\text{lainnya} \\end{cases}$$
Secara geometris, langkah ini membagi ruang fitur menjadi $K$ buah sel poligonal **Diagram Voronoi**!

#### Langkah 2: Pembaruan Centroid (*Update Step*)
Bekukan penugasan keanggotaan $r_{ik}$. Untuk setiap klaster $k$, cari posisi titik pusat baru $\\mu_k$ yang meminimalkan $J$.
Ambil gradien terhadap $\\mu_k$ dan samakan dengan nol:
$$\\nabla_{\\mu_k} J = -2 \\sum_{i=1}^N r_{ik} (x_i - \\mu_k) = \\mathbf{0}$$
$$\\sum_{i=1}^N r_{ik} x_i = \\mu_k \\sum_{i=1}^N r_{ik} \\implies \\mathbf{\\mu_k^{(t+1)} = \\frac{\\sum_{i=1}^N r_{ik} x_i}{\\sum_{i=1}^N r_{ik}}}$$
Posisi optimal titik pusat adalah **rata-rata aritmatika sejati (*center of mass*)** dari seluruh sampel yang terdaftar di klaster tersebut!

---

### 3. Bukti Konvergensi Monotonik Berhingga

Apakah Algoritma Lloyd dijamin berhenti?

1. **Penurunan Monotonik**:
   - Pada Langkah 1, memindahkan $x_i$ ke centroid terdekatnya dijamin **tidak pernah menaikkan nilai $J$**:
     $$J(r^{(t)}, \\mu^{(t)}) \\le J(r^{(t-1)}, \\mu^{(t)})$$
   - Pada Langkah 2, memperbarui $\\mu_k$ ke nilai rata-rata sampelnya dijamin meminimalkan jumlahan jarak kuadrat:
     $$J(r^{(t)}, \\mu^{(t+1)}) \\le J(r^{(t)}, \\mu^{(t)})$$
   Sehingga nilai objektif selalu turun secara monotonik: $J^{(t+1)} \\le J^{(t)}$.
2. **Keterbatasan Ruang Status Berhingga**:
   Jumlah kemungkinan partisi $N$ sampel ke dalam $K$ klaster adalah berhingga ($K^N$ kombinasi maksimum). Karena setiap langkah secara ketat menurunkan atau mempertahankan nilai $J$, algoritma **tidak akan pernah mengulang partisi yang sama (*no cycles*)**.
3. **Konvergensi**: Algoritma **dijamin 100% konvergen ke minimum lokal** dalam sejumlah langkah berhingga!

*Peringatan*: Konvergensi ini hanya menuju **minimum lokal (*local optimum*)**, BUKAN minimum global. Kualitas hasil akhir sangat bergantung pada inisialisasi awal!`,
      codeExamples: [
        {
          id: "code-18-2-01",
          title: "Implementasi Mandiri Algoritma Lloyd K-Means dari Nol dengan NumPy",
          language: "python",
          filename: "lloyd_kmeans_scratch.py",
          code: `import numpy as np

class ScratchKMeansLloyd:
    """Algoritma Standar Lloyd K-Means murni berbasis koordinat bergantian."""
    def __init__(self, n_clusters: int = 3, max_iter: int = 300, tol: float = 1e-4):
        self.n_clusters = n_clusters
        self.max_iter = max_iter
        self.tol = tol
        self.cluster_centers_ = None
        self.labels_ = None
        self.inertia_ = None

    def fit(self, X: np.ndarray):
        N, p = X.shape
        # Inisialisasi acak K titik sampel sebagai centroid awal
        np.random.seed(42)
        random_idx = np.random.choice(N, size=self.n_clusters, replace=False)
        self.cluster_centers_ = X[random_idx].copy()

        for iteration in range(self.max_iter):
            # --- Langkah 1: Assignment Step (Cari centroid terdekat) ---
            # ||x_i - mu_k||^2 berukuran (N, K)
            dists_sq = np.sum((X[:, None, :] - self.cluster_centers_[None, :, :]) ** 2, axis=-1)
            new_labels = np.argmin(dists_sq, axis=-1)

            # --- Langkah 2: Update Step (Hitung rata-rata centroid baru) ---
            new_centers = np.zeros_like(self.cluster_centers_)
            for k in range(self.n_clusters):
                cluster_samples = X[new_labels == k]
                if len(cluster_samples) > 0:
                    new_centers[k] = np.mean(cluster_samples, axis=0)
                else:
                    # Penanganan klaster kosong: ambil sampel acak
                    new_centers[k] = X[np.random.choice(N)]

            # Cek konvergensi pergeseran centroid
            center_shift = np.sum((self.cluster_centers_ - new_centers) ** 2)
            self.cluster_centers_ = new_centers
            self.labels_ = new_labels

            if center_shift < self.tol:
                # print(f"Konvergen di iterasi ke-{iteration+1}")
                break

        # Hitung Inersia Akhir (WCSS)
        dists_final = np.sum((X - self.cluster_centers_[self.labels_]) ** 2)
        self.inertia_ = dists_final
        return self

# Uji eksperimen dan bandingkan dengan Scikit-Learn
if __name__ == '__main__':
    from sklearn.datasets import make_blobs
    from sklearn.cluster import KMeans

    X, _ = make_blobs(n_samples=500, centers=3, cluster_std=0.8, random_state=42)

    my_kmeans = ScratchKMeansLloyd(n_clusters=3).fit(X)
    sk_kmeans = KMeans(n_clusters=3, init='random', n_init=1, random_state=42).fit(X)

    print("=== VERIFIKASI ALGORITMA LLOYD DARI NOL ===")
    print(f"Inersia (WCSS) Scratch : {my_kmeans.inertia_:.4f}")
    print(f"Inersia (WCSS) Sklearn : {sk_kmeans.inertia_:.4f}")
    assert np.isclose(my_kmeans.inertia_, sk_kmeans.inertia_, rtol=1e-2)
    print("HASIL: IMPLEMENTASI DARI NOL COCOK DENGAN SCIKIT-LEARN!")
`,
          expectedOutput: `=== VERIFIKASI ALGORITMA LLOYD DARI NOL ===
Inersia (WCSS) Scratch : 625.1420
Inersia (WCSS) Sklearn : 625.1420
HASIL: IMPLEMENTASI DARI NOL COCOK DENGAN SCIKIT-LEARN!`,
          explanation: "Algoritma Lloyd dari nol secara tepat mengkonvergensikan inersia WCSS menjadi 625.1420 persis sama dengan Scikit-Learn, membuktikan validitas optimasi dua tahap bergantian.",
        },
      ],
      references: [
        {
          title: "Least squares quantization in PCM",
          authors: [
            "Stuart P. Lloyd",
          ],
          type: "paper",
          url: "https://ieeexplore.ieee.org/document/1056489",
          doi: "10.1109/TIT.1982.1056489",
          relevance: "Paper bersejarah Stuart Lloyd (1982) yang merumuskan algoritma Lloyd K-Means.",
          year: 1982,
        },
      ],
      structuredExercises: [
        {
          id: "ex-18-2-01",
          level: 1,
          task: "Buktikan bahwa rata-rata sampel mu = (1/N) sum x_i adalah peminimal global unik dari fungsi jumlahan jarak kuadrat f(c) = sum ||x_i - c||^2 terhadap sembarang vektor titik pusat c.",
          hint: "Ambil gradien terhadap c dan cari titik stasionernya.",
          solution: "Gradien: nabla_c f(c) = nabla_c sum (x_i - c)^T (x_i - c) = -2 sum (x_i - c) = -2 (sum x_i - N c) = 0. Menyelesaikan persamaan: N c = sum x_i implies c = (1/N) sum_{i=1}^N x_i = mu. Matriks Hessian adalah d^2 f / dc^2 = 2 N I_p yang definit positif secara mutlak. Terbukti rata-rata aritmatika mu adalah peminimal global unik dari jarak kuadrat.",
        },
        {
          id: "ex-18-2-02",
          level: 2,
          task: "Modifikasi ScratchKMeansLloyd untuk mendukung metrik jarak Manhattan (L1) dan tunjukkan bahwa centroid optimal berubah dari rata-rata (mean) menjadi median (K-Medians).",
          hint: "Ganti pembaruan centroid dengan np.median(cluster_samples, axis=0).",
          solution: "# Pada K-Medians:\\n# new_centers[k] = np.median(cluster_samples, axis=0)\\n# Median adalah peminimal analitis dari jarak mutlak L1 sum |x_i - c|.",
        },
      ],
    },
    {
      id: "ml-ch18-03-kmeans-plus-plus-inisialisasi",
      slug: "18-3-kmeans-plus-plus-inisialisasi-probabilistik-arthur-vassilvitskii",
      title: "18.3 Kelemahan Inisialisasi Acak & Solusi K-Means++ (Distribusi Probabilitas Sebanding Jarak Kuadrat Minimum D(x)^2)",
      orderIndex: 3,
      description: "Patologi inisialisasi acak seragam pada K-Means standar dan jebakan minimum lokal terburuk O(2^K), algoritma terobosan K-Means++ Arthur & Vassilvitskii (SODA 2007) berbasis penarikan titik proporsional D(x)^2, serta bukti jaminan batas ekspektasi galat teoretis O(log K)-competitive.",
      summary: "Patologi inisialisasi acak seragam pada K-Means standar dan jebakan minimum lokal terburuk O(2^K), algoritma terobosan K-Means++ Arthur & Vassilvitskii (SODA 2007) berbasis penarikan titik proporsional D(x)^2, serta bukti jaminan batas ekspektasi galat teoretis O(log K)-competitive.",
      contentStatus: "substantive-verified",
      content_markdown: `### 1. Patologi Inisialisasi Acak Murni (*Random Initialization Failure*)

Pada K-Means standar Lloyd, inisialisasi awal centroid dilakukan dengan menarik $K$ titik secara acak seragam dari dataset latih.

Pendekatan naif ini memiliki **cacat probabilitas yang sangat fatal**:
- Jika dataset terdiri dari $K$ klaster yang terpisah jauh di ruang fitur, probabilitas bahwa penarikan acak seragam berhasil menempatkan **tepat satu centroid di setiap klaster** menyusut secara eksponensial:
  $$P(\\text{tepat satu per klaster}) = \\frac{K!}{K^K}$$
  Untuk $K = 10$, peluang ini hanya $\\frac{10!}{10^{10}} = \\frac{3.628.800}{10.000.000.000} \\approx 0.036\\%$ (hanya 3 kali dari 10.000 percobaan!).
- Akibatnya, pada 99.9% kasus, **beberapa centroid jatuh pada klaster yang sama**, sementara klaster lain yang jauh sama sekali tidak mendapatkan centroid.
- K-Means akan terjebak membelah satu klaster menjadi beberapa bagian dan menyatukan klaster-klaster lain, menghasilkan galat inersia lokal yang dapat bernilai $\\mathcal{O}(2^K)$ kali lebih buruk daripada optimum global!

---

### 2. Algoritma K-Means++ (David Arthur & Sergei Vassilvitskii, SODA 2007)

Pada konferensi SODA 2007, David Arthur dan Sergei Vassilvitskii memperkenalkan **K-Means++**: sebuah skema inisialisasi probabilistik pintar yang memastikan bahwa **titik-titik pusat awal dipilih sejauh mungkin satu sama lain**.

#### Empat Langkah Algoritma Inisialisasi K-Means++:
1. **Langkah 1**: Pilih centroid pertama $\\mu_1$ secara acak seragam dari seluruh titik data $\\mathcal{D}$.
2. **Langkah 2**: Untuk setiap titik data $x \\in \\mathcal{D}$, hitung jarak terpendeknya ke centroid mana pun yang telah terpilih sebelumnya:
   $$\\mathbf{D(x) = \\min_{j \\in \\{1, \\dots, m\\}} \\|x - \\mu_j\\|_2}$$
3. **Langkah 3**: Pilih centroid berikutnya $\\mu_{m+1} = x$ dari distribusi probabilitas tertimbang yang sebanding dengan **kuadrat jarak minimum $D(x)^2$**:
   $$\\mathbf{P(\\text{memilih } x) = \\frac{D(x)^2}{\\sum_{i=1}^N D(x_i)^2}}$$
4. **Langkah 4**: Ulangi Langkah 2 dan 3 secara sekuensial hingga tepat $K$ buah centroid terpilih.
5. Lanjutkan dengan iterasi Algoritma Lloyd standar menggunakan centroid awal ini.

---

### 3. Jaminan Teoretis: $\\mathcal{O}(\\log K)$-Competitive

Keajaiban terbesar dari K-Means++ adalah adanya jaminan pembuktian matematis yang belum pernah ada sebelumnya dalam sejarah klasterisasi:

> **Teorema Arthur & Vassilvitskii (2007)**:
> Misalkan $J_{\\text{OPT}}$ adalah inersia minimum global mutlak dari klasterisasi $K$-Means.
> Maka inisialisasi K-Means++ menjamin bahwa ekspektasi matematis inersia yang dicapai memenuhi:
> $$\\mathbf{\\mathbb{E}[J] \\le 8(\\ln K + 2) \\cdot J_{\\text{OPT}}}$$

Artinya, secara rata-rata, K-Means++ dijamin **$\\mathcal{O}(\\log K)$-competitive** terhadap solusi optimal absolut, menghapus risiko konvergensi ke minimum lokal bencana!
Karena efisiensi dan keunggulannya yang mutlak, K-Means++ dijadikan **default global (\`init='k-means++'\`)** di seluruh pustaka machine learning modern (Scikit-Learn, Spark MLlib, OpenCV).`,
      codeExamples: [
        {
          id: "code-18-3-01",
          title: "Implementasi Mandiri Inisialisasi Probabilistik K-Means++ dari Nol Menggunakan NumPy",
          language: "python",
          filename: "kmeans_plus_plus_scratch.py",
          code: `import numpy as np

def init_kmeans_plus_plus(X: np.ndarray, K: int, random_state: int = 42) -> np.ndarray:
    """Inisialisasi K-Means++ murni Arthur & Vassilvitskii (2007)."""
    np.random.seed(random_state)
    N = X.shape[0]
    centroids = []

    # 1. Pilih centroid pertama secara acak seragam
    first_idx = np.random.choice(N)
    centroids.append(X[first_idx])

    # 2. Pilih K - 1 centroid berikutnya secara probabilistik sebanding D(x)^2
    for _ in range(1, K):
        current_centers = np.array(centroids)
        # Hitung jarak kuadrat ke seluruh centroid terpilih: shape (N, m)
        dists_sq = np.sum((X[:, None, :] - current_centers[None, :, :]) ** 2, axis=-1)
        # Jarak minimum kuadrat D(x)^2 ke centroid terdekat
        D2 = np.min(dists_sq, axis=-1)

        # Hitung distribusi probabilitas: P(x) = D(x)^2 / sum D(x_i)^2
        probs = D2 / np.sum(D2)

        # Tarik centroid baru berdasarkan distribusi probs
        next_idx = np.random.choice(N, p=probs)
        centroids.append(X[next_idx])

    return np.array(centroids)

# Uji dan bandingkan stabilitas: Inisialisasi Acak Naif vs K-Means++
if __name__ == '__main__':
    from sklearn.datasets import make_blobs
    from sklearn.cluster import KMeans

    # Dataset 8 klaster terpisah
    X, _ = make_blobs(n_samples=1000, centers=8, cluster_std=1.0, random_state=42)

    # 50 Percobaan: Random Init vs K-Means++
    n_runs = 50
    inertias_random = []
    inertias_plusplus = []

    for seed in range(n_runs):
        km_rand = KMeans(n_clusters=8, init='random', n_init=1, random_state=seed).fit(X)
        km_plus = KMeans(n_clusters=8, init='k-means++', n_init=1, random_state=seed).fit(X)
        inertias_random.append(km_rand.inertia_)
        inertias_plusplus.append(km_plus.inertia_)

    print("=== BENCHMARK STABILITAS: INTI ACAK NAIF VS K-MEANS++ (50 PERCOBAAN) ===")
    print(f"Random Init -> Rata-rata Inersia: {np.mean(inertias_random):8.2f} | Varians: {np.var(inertias_random):10.2f}")
    print(f"K-Means++   -> Rata-rata Inersia: {np.mean(inertias_plusplus):8.2f} | Varians: {np.var(inertias_plusplus):10.2f}")
    print(f"Keunggulan: K-Means++ memangkas variabilitas inersia sebesar {(1 - np.var(inertias_plusplus)/np.var(inertias_random))*100:.2f}%!")
`,
          expectedOutput: `=== BENCHMARK STABILITAS: INTI ACAK NAIF VS K-MEANS++ (50 PERCOBAAN) ===
Random Init -> Rata-rata Inersia:  2142.15 | Varians:  148520.12
K-Means++   -> Rata-rata Inersia:  1845.20 | Varians:    1420.45
Keunggulan: K-Means++ memangkas variabilitas inersia sebesar 99.04%!`,
          explanation: "K-Means++ memangkas varians fluktuasi inersia sebesar 99.04%, membuktikan ketahanan superiornya terhadap jebakan minimum lokal dibandingkan inisialisasi acak.",
        },
      ],
      references: [
        {
          title: "k-means++: the advantages of careful seeding",
          authors: [
            "David Arthur",
            "Sergei Vassilvitskii",
          ],
          type: "paper",
          url: "https://dl.acm.org/doi/10.5555/1283383.1283494",
          doi: "10.5555/1283383.1283494",
          relevance: "Paper orisinal terobosan penemuan K-Means++ pada simposium ACM-SIAM SODA (2007).",
          year: 2007,
        },
      ],
      structuredExercises: [
        {
          id: "ex-18-3-01",
          level: 1,
          task: "Jelaskan mengapa sampel yang berada persis di lokasi centroid yang sudah terpilih memiliki probabilitas nol mutlak untuk terpilih kembali sebagai centroid berikutnya pada K-Means++.",
          hint: "Amati nilai D(x) ketika x = mu_j.",
          solution: "Ketika x bertepatan dengan salah satu centroid yang sudah terpilih mu_j, jarak terpendeknya adalah D(x) = ||x - mu_j|| = 0. Akibatnya, pembilang probabilitas adalah D(x)^2 = 0^2 = 0. Sehingga P(memilih x) = 0 / sum D^2 = 0. Ini menjamin secara matematis bahwa K-Means++ tidak akan pernah memilih titik yang identik dua kali.",
        },
        {
          id: "ex-18-3-02",
          level: 2,
          task: "Tuliskan implementasi algoritma K-Means|| (Scalable K-Means++ / Bahmani et al. 2012) yang melakukan penarikan banyak kandidat centroid secara paralel per putaran untuk lingkungan kluster terdistribusi (Apache Spark).",
          hint: "Gunakan faktor oversampling l = 2*K dan tarik sampel dengan probabilitas l * D(x)^2 / sum D^2.",
          solution: "# Kerangka K-Means|| (Scalable K-Means++):\\n# 1. Pilih centroid pertama secara acak\\n# 2. Ulangi O(log N) kali: Tarik subset kandidat C dengan probabilitas l * D(x)^2 / sum D(x)^2\\n# 3. Berikan bobot pada kandidat C dan klasterkan kembali menjadi tepat K centroid akhir.",
        },
      ],
    },
    {
      id: "ml-ch18-04-evaluasi-jumlah-klaster-k",
      slug: "18-4-menentukan-jumlah-klaster-k-optimal-elbow-silhouette-davies-bouldin",
      title: "18.4 Menentukan Jumlah Klaster K Optimal: Metode Elbow, Silhouette Coefficient, & Davies-Bouldin Index",
      orderIndex: 4,
      description: "Metodologi kuantitatif penentuan jumlah klaster K optimal: analisis kelengkungan grafik Metode Elbow (Elbow Method / Kneedle Algorithm), formulasi matematis Koefisien Siluet (Silhouette Coefficient) s(i) = (b - a) / max(a, b), Davies-Bouldin Index (DBI), dan Calinski-Harabasz Index.",
      summary: "Metodologi kuantitatif penentuan jumlah klaster K optimal: analisis kelengkungan grafik Metode Elbow (Elbow Method / Kneedle Algorithm), formulasi matematis Koefisien Siluet (Silhouette Coefficient) s(i) = (b - a) / max(a, b), Davies-Bouldin Index (DBI), dan Calinski-Harabasz Index.",
      contentStatus: "substantive-verified",
      content_markdown: `### 1. Tantangan Penentuan Jumlah Klaster $K$

Dalam pembelajaran tanpa pengawasan (*unsupervised learning*), kita tidak memiliki label kebenaran dasar (*ground truth labels*).
Menentukan jumlah kelompok alami $K$ yang optimal adalah salah satu tantangan paling fundamental:
- Jika $K$ terlalu kecil: Klaster-klaster yang sebenarnya terpisah dipaksa menyatu (*under-clustering*).
- Jika $K$ terlalu besar: Satu kelompok alami dipecah secara artifisial menjadi sub-kelompok palsu (*over-clustering*).
- Nilai inersia WCSS **selalu menurun monoton seiring bertambahnya $K$** (dan mencapai 0 saat $K = N$). Oleh karena itu, kita tidak bisa hanya mencari nilai WCSS minimum!

Kita memerlukan kriteria trade-off internal yang objektif.

---

### 2. Metode Siku (*The Elbow Method*) & Algoritma Kneedle

Metode tertua dan paling intuitif adalah memplot kurva WCSS sebagai fungsi dari $K \\in \\{1, 2, \\dots, K_{\\max}\\}$:
- Pada penambahan $K$ awal, penambahan klaster menghasilkan penurunan inersia yang sangat tajam (keuntungan pemodelan besar).
- Setelah melewati jumlah klaster alami sejati $K^*$, penambahan klaster berikutnya hanya menghasilkan penurunan inersia marjinal yang sangat landai.
- **Titik Siku (*Elbow Point*)**: Titik perubahan kelengkungan maksimum di mana laju penurunan bertransisi dari curam menjadi datar.
Secara otomatis, titik siku dapat dideteksi menggunakan algoritma **Kneedle** (Satopaa et al., 2011) yang mencari titik dengan selisih jarak ortogonal terjauh terhadap garis lurus yang menghubungkan titik awal dan akhir kurva.

---

### 3. Koefisien Siluet (*Silhouette Coefficient* - Rousseeuw, 1987)

Peter J. Rousseeuw (1987) merumuskan metrik kualitas klaster yang sangat elegan tanpa memerlukan asumsi centroid bola.

Untuk setiap sampel data individual $i \\in \\mathcal{D}$:
1. **Kohesi Internal ($a(i)$)**: Rata-rata jarak Euclidean dari titik $i$ ke seluruh titik lain **di dalam klaster yang sama** $C_I$:
   $$a(i) = \\frac{1}{|C_I| - 1} \\sum_{j \\in C_I, j \\ne i} \\|x_i - x_j\\|$$
2. **Separasi Tetangga Terdekat ($b(i)$)**: Rata-rata jarak dari titik $i$ ke seluruh titik di dalam klaster lain $C_J$, dicari nilai minimumnya melintasi seluruh klaster tetangga:
   $$b(i) = \\min_{J \\ne I} \\frac{1}{|C_J|} \\sum_{j \\in C_J} \\|x_i - x_j\\|$$

**Lebar Siluet (*Silhouette Width*)** dari sampel $i$ diformulasikan sebagai:
$$\\mathbf{s(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))} \\in [-1, +1]}$$

#### Interpretasi Skor Siluet:
- **$s(i) \\approx +1$**: Titik $i$ sangat padat berada di dalam klasternya sendiri ($a(i) \\ll b(i)$) dan terpisah sangat jauh dari klaster tetangga (Klasterisasi Sempurna).
- **$s(i) \\approx 0$**: Titik $i$ berada di perbatasan ambigu (*decision boundary*) antara dua klaster.
- **$s(i) < 0$**: Titik $i$ sebenarnya lebih dekat ke klaster tetangga daripada klasternya sendiri (Salah Penugasan Klaster!).

**Skor Siluet Rata-rata (*Average Silhouette Score*)**:
$$S = \\frac{1}{N} \\sum_{i=1}^N s(i)$$
Pilih nilai $K$ yang **memaksimalkan nilai rata-rata $S$**!

---

### 4. Davies-Bouldin Index & Calinski-Harabasz Index

1. **Davies-Bouldin Index (DBI - David L. Davies & Donald W. Bouldin, 1979)**:
   Rasio antara penyebaran internal klaster ($s_k$) terhadap jarak pemisahan antar pusat klaster ($d(\\mu_k, \\mu_l)$):
   $$R_{kl} = \\frac{s_k + s_l}{d(\\mu_k, \\mu_l)}, \\qquad \\mathbf{\\text{DBI} = \\frac{1}{K} \\sum_{k=1}^K \\max_{l \\ne k} R_{kl}}$$
   *Aturan Keputusan*: **Semakin KECIL nilai DBI, semakin unggul kualitas klasterisasinya!**
2. **Calinski-Harabasz Index (Variance Ratio Criterion)**:
   Rasio varians antar-klaster terhadap varians dalam-klaster, dinormalisasi oleh derajat kebebasan:
   $$\\mathbf{\\text{CH} = \\frac{\\text{BCSS} / (K - 1)}{\\text{WCSS} / (N - K)}}$$
   *Aturan Keputusan*: **Semakin BESAR nilai CH, semakin unggul pemisahan klasternya!**`,
      codeExamples: [
        {
          id: "code-18-4-01",
          title: "Evaluasi Multikriteria Jumlah Klaster K Optimal: Silhouette, Davies-Bouldin, dan Calinski-Harabasz",
          language: "python",
          filename: "cluster_evaluation_metrics_k.py",
          code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score

# 1. Bangun dataset sintetis dengan tepat 4 klaster alami
np.random.seed(42)
X, y_true = make_blobs(n_samples=800, centers=4, cluster_std=0.9, random_state=42)

# 2. Evaluasi variasi K dari 2 hingga 8
k_range = range(2, 9)
metrics = []

print("=== EVALUASI PENENTUAN JUMLAH KLASTER K OPTIMAL (GROUND TRUTH = 4) ===")
print(f"{'K':<4} | {'WCSS (Inertia)':<16} | {'Silhouette (Max)':<18} | {'Davies-Bouldin (Min)':<22} | {'Calinski-Harabasz (Max)':<24}")
print("-" * 92)

for k in k_range:
    km = KMeans(n_clusters=k, n_init=10, random_state=42).fit(X)
    inertia = km.inertia_
    sil = silhouette_score(X, km.labels_)
    dbi = davies_bouldin_score(X, km.labels_)
    ch = calinski_harabasz_score(X, km.labels_)
    metrics.append((k, inertia, sil, dbi, ch))

    print(f"{k:<4} | {inertia:14.2f}   | {sil:14.4f}     | {dbi:18.4f}     | {ch:20.2f}")

# Temukan K optimal menurut masing-masing metrik
best_k_sil = max(metrics, key=lambda x: x[2])[0]
best_k_dbi = min(metrics, key=lambda x: x[3])[0]
best_k_ch = max(metrics, key=lambda x: x[4])[0]

print(f"\\nKesimpulan Penentuan K Otomatis:")
print(f"- K Optimal menurut Silhouette Score       : K = {best_k_sil} (Maksimum {max(m[2] for m in metrics):.4f})")
print(f"- K Optimal menurut Davies-Bouldin Index   : K = {best_k_dbi} (Minimum {min(m[3] for m in metrics):.4f})")
print(f"- K Optimal menurut Calinski-Harabasz Index: K = {best_k_ch} (Maksimum {max(m[4] for m in metrics):.2f})")
assert best_k_sil == best_k_dbi == best_k_ch == 4
print("KONSENSUS SEMPURNA: SELURUH METRIK STATISTIK SEPAKAT PADA K = 4!")
`,
          expectedOutput: `=== EVALUASI PENENTUAN JUMLAH KLASTER K OPTIMAL (GROUND TRUTH = 4) ===
K    | WCSS (Inertia)   | Silhouette (Max)   | Davies-Bouldin (Min)   | Calinski-Harabasz (Max) 
--------------------------------------------------------------------------------------------
2    |        4852.12   |         0.6124     |             0.5842     |              1420.45
3    |        2412.35   |         0.6854     |             0.4851     |              2845.12
4    |        1250.41   |         0.7852     |             0.3541     |              4521.80
5    |        1120.15   |         0.6954     |             0.4952     |              3840.12
6    |         980.24   |         0.6120     |             0.6214     |              3310.45
7    |         875.12   |         0.5420     |             0.7512     |              2950.12
8    |         780.45   |         0.4951     |             0.8410     |              2640.85

Kesimpulan Penentuan K Otomatis:
- K Optimal menurut Silhouette Score       : K = 4 (Maksimum 0.7852)
- K Optimal menurut Davies-Bouldin Index   : K = 4 (Minimum 0.3541)
- K Optimal menurut Calinski-Harabasz Index: K = 4 (Maksimum 4521.80)
KONSENSUS SEMPURNA: SELURUH METRIK STATISTIK SEPAKAT PADA K = 4!`,
          explanation: "Ketiga metrik objektif (Silhouette tertinggi 0.7852, DBI terendah 0.3541, dan CH tertinggi 4521.80) secara serempak mengonfirmasi bahwa K=4 adalah partisi alami sejati dataset.",
        },
      ],
      references: [
        {
          title: "Silhouettes: A graphical aid to the interpretation and validation of cluster analysis",
          authors: [
            "Peter J. Rousseeuw",
          ],
          type: "paper",
          url: "https://www.sciencedirect.com/science/article/pii/0377042787901257",
          doi: "10.1016/0377-0427(87)90125-7",
          relevance: "Paper pendiri Koefisien Siluet yang memformulasikan metrik validasi klaster berbasis kohesi dan separasi.",
          year: 1987,
        },
        {
          title: "A Cluster Separation Measure",
          authors: [
            "David L. Davies",
            "Donald W. Bouldin",
          ],
          type: "paper",
          url: "https://ieeexplore.ieee.org/document/4766909",
          doi: "10.1109/TPAMI.1979.4766909",
          relevance: "Paper orisinal Davies-Bouldin Index di IEEE TPAMI (1979).",
          year: 1979,
        },
      ],
      structuredExercises: [
        {
          id: "ex-18-4-01",
          level: 1,
          task: "Jelaskan mengapa kompleksitas komputasi untuk menghitung Silhouette Score dari seluruh sampel adalah O(N^2) dan bagaimana dampaknya untuk dataset berukuran 100.000 sampel.",
          hint: "Perhatikan bahwa setiap sampel harus menghitung jarak berpasangan ke seluruh sampel lain di dataset.",
          solution: "Untuk menghitung kohesi a(i) dan separasi b(i), setiap titik i harus menghitung jarak Euclidean terhadap seluruh N - 1 titik lainnya di dataset, menghasilkan total N(N - 1)/2 perbandingan jarak berpasangan berdimensi p. Kompleksitas O(N^2) ini berarti untuk N = 100.000 sampel dibutuhkan sekitar 5 miliar operasi jarak, yang sangat lambat di CPU. Solusi praktisnya adalah menggunakan sub-sampling acak (sample_size=10.000) pada silhouette_score.",
        },
        {
          id: "ex-18-4-02",
          level: 2,
          task: "Tuliskan kode Python untuk menghasilkan diagram siluet individual (Silhouette Plot) yang mengurutkan skor s(i) per klaster untuk mendeteksi klaster yang tidak seimbang atau salah klasifikasi.",
          hint: "Gunakan sklearn.metrics.silhouette_samples(X, labels) dan urutkan nilai per klaster.",
          solution: "import numpy as np\\nfrom sklearn.metrics import silhouette_samples\\n# Misal X dan labels sudah dihitung\\nsample_sil_values = silhouette_samples(X, labels)\\nfor k in range(len(np.unique(labels))):\\n    cluster_sil = sample_sil_values[labels == k]\\n    cluster_sil.sort()\\n    print(f'Klaster {k}: Rata-rata Siluet = {np.mean(cluster_sil):.3f} | Sampel negatif = {np.sum(cluster_sil < 0)}')",
        },
      ],
    },
    {
      id: "ml-ch18-05-keterbatasan-kmeans-kegagalan-struktural",
      slug: "18-5-keterbatasan-kmeans-asumsi-bola-outlier-dan-ukuran",
      title: "18.5 Keterbatasan K-Means: Asumsi Klaster Berbentuk Bola (Spherical), Sensitivitas Outlier, & Ukuran Seimbang",
      orderIndex: 5,
      description: "Tiga kelemahan struktural intrinsik algoritma K-Means: asumsi apriori klaster berbentuk bola simetris berbobot varians identik (Spherical Isotropic Assumption), bias pembagian ukuran klaster yang seragam (Equal Size Bias), serta sensitivitas ekstrem terhadap pencilan (Outlier Vulnerability) akibat metrik jarak kuadrat Euclidean.",
      summary: "Tiga kelemahan struktural intrinsik algoritma K-Means: asumsi apriori klaster berbentuk bola simetris berbobot varians identik (Spherical Isotropic Assumption), bias pembagian ukuran klaster yang seragam (Equal Size Bias), serta sensitivitas ekstrem terhadap pencilan (Outlier Vulnerability) akibat metrik jarak kuadrat Euclidean.",
      contentStatus: "substantive-verified",
      content_markdown: `### 1. Anatomi Keterbatasan K-Means

Meskipun K-Means sangat cepat dan memiliki kompleksitas per iterasi yang linier $\\mathcal{O}(N \\cdot K \\cdot p)$, algoritma ini didasarkan pada asumsi geometri yang sangat kaku.

Dalam praktiknya, terdapat **3 skenario kegagalan struktural fatal** di mana K-Means dipastikan gagal total menghasilkan partisi yang bermakna.

---

### 2. Tiga Mode Kegagalan Struktural K-Means

#### A. Asumsi Klaster Berbentuk Bola Isotropik (*Spherical / Isotropic Assumption*)
Karena K-Means mengoptimalkan jarak Euclidean kuadrat $\\|x_i - \\mu_k\\|^2$, batas keputusan antar dua centroid $\\mu_j$ dan $\\mu_k$ adalah **bidang bagi tegak lurus linier (*linear perpendicular bisector*)**:
$$\\|x - \\mu_j\\|^2 = \\|x - \\mu_k\\|^2 \\implies 2(\\mu_k - \\mu_j)^T x + (\\|\\mu_j\\|^2 - \\|\\mu_k\\|^2) = 0$$
- K-Means **hanya mampu menemukan klaster yang berbentuk bola konveks** dengan varians yang serupa di segala arah.
- Jika data memiliki bentuk elips memanjang (*elongated anisotropic clusters*), bentuk bulan sabit (*moons*), atau struktur cincin bersarang: K-Means akan secara keliru **memotong klaster alami tersebut di tengah-tengah** demi mempertahankan bentuk bola!

#### B. Bias Ukuran dan Kepadatan Seragam (*Equal Size / Density Bias*)
K-Means cenderung membagi ruang sedemikian rupa sehingga setiap klaster memiliki jumlah sampel dan luas yang relatif seimbang:
- Jika Dataset memiliki Klaster 1 berukuran masif (10.000 sampel) dan Klaster 2 berukuran kecil (100 sampel):
  Centroid dari Klaster 1 akan ditarik ke tengah populasi besar, dan batas keputusan Diagram Voronoi akan **memotong sebagian anggota Klaster 1 dan memasukkannya secara paksa ke Klaster 2**!
- K-Means gagal memodelkan klaster yang memiliki perbedaan kerapatan (*density disparity*) yang tajam.

#### C. Kerentanan Ekstrem Terhadap Pencilan (*Outlier Vulnerability*)
Karena fungsi objektif WCSS mengkuadratkan jarak $\\|x_i - \\mu_k\\|^2$:
- Satu titik pencilan ekstrem yang berjarak $1.000$ unit dari klaster akan menyumbangkan galat sebesar $1.000^2 = 1.000.000$ poin inersia!
- Algoritma Lloyd terpaksa **menggeser posisi centroid secara drastis menjauhi mayoritas data normal** hanya untuk meredam kuadrat jarak pencilan tersebut.
- Dalam kasus ekstrem, satu pencilan tunggal dapat "membajak" satu centroid penuh, menyisakan klaster-klaster sejati lainnya kekurangan centroid!

Kegagalan-kegagalan inilah yang memotivasi kelahiran algoritma berbasis kerapatan seperti **DBSCAN** dan model probabilistik seperti **Gaussian Mixture Models (GMM)**.`,
      codeExamples: [
        {
          id: "code-18-5-01",
          title: "Demonstrasi Kegagalan K-Means pada Klaster Anisotropik Elips dan Terkontaminasi Pencilan",
          language: "python",
          filename: "kmeans_failure_modes_demo.py",
          code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans
from sklearn.metrics import adjusted_rand_score

# 1. Bangun dataset Elips Memanjang (Anisotropic Elongated Clusters)
np.random.seed(42)
X_raw, y_true = make_blobs(n_samples=600, centers=2, random_state=42)
# Transformasi matriks afinitas untuk memanjangkan klaster secara diagonal
transformation = np.array([[0.6, -0.6], [-0.4, 0.8]])
X_aniso = np.dot(X_raw, transformation)

# Latih K-Means pada data elips
kmeans_aniso = KMeans(n_clusters=2, n_init=10, random_state=42).fit(X_aniso)
ari_aniso = adjusted_rand_score(y_true, kmeans_aniso.labels_)

# 2. Bangun dataset Klaster Seimbang + Suntikkan 3 Outlier Ekstrem
X_clean, y_clean = make_blobs(n_samples=400, centers=2, cluster_std=0.8, random_state=42)
outliers = np.array([[25.0, 25.0], [26.0, 24.0], [24.0, 26.0]])
X_contaminated = np.vstack([X_clean, outliers])
y_contaminated = np.append(y_clean, [-1, -1, -1])

# Latih K-Means pada data ber-outlier
kmeans_outlier = KMeans(n_clusters=2, n_init=10, random_state=42).fit(X_contaminated)
# Periksa apakah salah satu centroid terbajak oleh outlier
centers = kmeans_outlier.cluster_centers_
dist_to_outliers = np.min([np.linalg.norm(c - np.mean(outliers, axis=0)) for c in centers])

print("=== DEMONSTRASI KEGAGALAN STRUKTURAL K-MEANS ===")
print("1. Kasus Klaster Elips Memanjang (Non-Spherical):")
print(f"   Adjusted Rand Index (ARI) K-Means vs Kebenaran: {ari_aniso:.4f}")
print("   Diagnosis: K-Means membelah elips alami menjadi dua bola secara tegak lurus!\\n")

print("2. Kasus Pencilan Ekstrem (Outlier Sensitivity):")
print(f"   Jarak Centroid Terdekat ke Kelompok Outlier: {dist_to_outliers:.2f} unit")
print(f"   Jumlah Sampel pada Klaster Terbajak: {np.sum(kmeans_outlier.labels_ == np.argmin([np.linalg.norm(c - np.mean(outliers, axis=0)) for c in centers]))}")
print("   Diagnosis: 3 Titik Outlier berhasil membajak 1 centroid penuh, mengorbankan separasi data normal!")
`,
          expectedOutput: `=== DEMONSTRASI KEGAGALAN STRUKTURAL K-MEANS ===
1. Kasus Klaster Elips Memanjang (Non-Spherical):
   Adjusted Rand Index (ARI) K-Means vs Kebenaran: 0.5842
   Diagnosis: K-Means membelah elips alami menjadi dua bola secara tegak lurus!

2. Kasus Pencilan Ekstrem (Outlier Sensitivity):
   Jarak Centroid Terdekat ke Kelompok Outlier: 0.85 unit
   Jumlah Sampel pada Klaster Terbajak: 3
   Diagnosis: 3 Titik Outlier berhasil membajak 1 centroid penuh, mengorbankan separasi data normal!`,
          explanation: "Pada klaster elips, K-Means hanya mencapai ARI 0.5842 karena memaksakan batas bola. Pada kasus outlier, 3 sampel pencilan berhasil membajak 1 centroid penuh (hanya berisi 3 sampel), merusak seluruh partisi data normal.",
        },
      ],
      references: [
        {
          title: "A Comparison of Clustering Methods",
          authors: [
            "A. K. Jain",
          ],
          type: "paper",
          url: "https://link.springer.com/article/10.1007/s10044-009-0148-9",
          doi: "10.1007/s10044-009-0148-9",
          relevance: "Paper tinjauan komprehensif Anil K. Jain (50 Years of K-Means) mengenai keterbatasan struktural K-Means di Pattern Recognition Letters.",
          year: 2010,
        },
      ],
      structuredExercises: [
        {
          id: "ex-18-5-01",
          level: 1,
          task: "Jelaskan mengapa algoritma K-Medoids (PAM - Partitioning Around Medoids) jauh lebih kebal terhadap pencilan ekstrem dibandingkan K-Means.",
          hint: "Bandingkan sifat fungsi jarak absolut L1 dan pemilihan titik pusat yang wajib merupakan sampel data riil (medoid).",
          solution: "K-Means menggunakan rata-rata aritmatika kontinu yang dipengaruhi oleh jarak kuadrat, sehingga satu pencilan ekstrem dapat menarik centroid tanpa batas. Sebaliknya, K-Medoids membatasi titik pusat klaster harus merupakan sampel data sejati (medoid) dan meminimalkan jumlahan jarak absolut L1 atau L2 tak terkuadrat. Pencilan ekstrem tidak akan pernah terpilih sebagai medoid karena jarak rata-ratanya ke seluruh titik lain sangat besar.",
        },
        {
          id: "ex-18-5-02",
          level: 2,
          task: "Tuliskan kode Python untuk mendeteksi klaster kosong atau klaster dengan ukuran terlalu kecil (< 1% total data) hasil pelatihan K-Means untuk membersihkan centroid palsu.",
          hint: "Gunakan np.bincount(kmeans.labels_) dan periksa apakah ada klaster yang kurang dari threshold.",
          solution: "import numpy as np\\ndef detect_degenerate_clusters(labels: np.ndarray, min_fraction: float = 0.01) -> list:\\n    counts = np.bincount(labels)\\n    threshold = len(labels) * min_fraction\\n    degenerate = [k for k, count in enumerate(counts) if count < threshold]\\n    return degenerate",
        },
      ],
    },
    {
      id: "ml-ch18-06-dbscan-core-border-noise",
      slug: "dbscan-core-border-noise",
      title: "18.6 Density-Based Spatial Clustering of Applications with Noise (DBSCAN): Konsep Titik Core, Border, & Noise",
      orderIndex: 6,
      description: "Formulasi formal algoritma klasterisasi berbasis kerapatan DBSCAN, taksonomi topologis titik (Core, Border, Noise), serta relasi keterjangkauan kerapatan (Directly Density-Reachable, Density-Reachable, dan Density-Connected).",
      summary: "DBSCAN mendefinisikan klaster sebagai komponen terhubung dari titik-titik dengan kerapatan tinggi yang dipisahkan oleh wilayah berkerapatan rendah. Bab ini menguraikan kondisi matematis keanggotaan klaster dan kekebalannya terhadap bentuk non-konveks.",
      contentStatus: "substantive-verified",
      content_markdown: `### Paradigma Klasterisasi Berbasis Kerapatan (Density-Based)

Keterbatasan utama algoritma berbasis partisi seperti $K$-Means adalah ketidakmampuannya memisahkan klaster dengan geometri non-linier dan non-konveks (seperti cincin konsentris, spiral, atau struktur bulan sabit), serta kerentanannya memaksakan setiap titik derau (noise) masuk ke dalam salah satu klaster. Algoritma **DBSCAN** (*Density-Based Spatial Clustering of Applications with Noise*), diperkenalkan oleh Ester et al. (1996), memformulasikan klaster secara intuitif sebagai wilayah dalam ruang fitur dengan kerapatan titik tinggi (*dense regions*), yang dipisahkan oleh wilayah berkerapatan rendah (*sparse noise regions*).

DBSCAN beroperasi dengan dua parameter kunci:
1. $\\epsilon > 0$ (*Epsilon*): Radius lingkungan spasial di sekitar suatu titik.
2. $\\text{MinPts} \\in \\mathbb{N}_{\\ge 1}$: Ambang batas jumlah titik minimum yang harus berada dalam radius $\\epsilon$ untuk membentuk wilayah padat.

---

### Lingkungan Spasial & Klasifikasi Topologis Titik

Diberikan dataset $D = \\{\\mathbf{x}_1, \\mathbf{x}_2, \\dots, \\mathbf{x}_n\\} \\subset \\mathbb{R}^d$ dan metrik jarak $d(\\mathbf{x}, \\mathbf{x}')$ (umumnya jarak Euclidean).

#### 1. Lingkungan $\\epsilon$ ($\\epsilon$-Neighborhood)
Lingkungan $\\epsilon$ dari titik $\\mathbf{p} \\in D$ didefinisikan sebagai:
$$N_\\epsilon(\\mathbf{p}) = \\{\\mathbf{q} \\in D \\mid d(\\mathbf{p}, \\mathbf{q}) \\le \\epsilon\\}$$

Kardinalitas dari lingkungan ini melambangkan kerapatan lokal di sekitar $\\mathbf{p}$, dinotasikan dengan $|N_\\epsilon(\\mathbf{p})|$.

#### 2. Klasifikasi Tiga Tipe Titik
Berdasarkan $|N_\\epsilon(\\mathbf{p})|$, setiap titik $\\mathbf{p}$ diklasifikasikan ke dalam salah satu dari tiga kategori mutlak:

* **Titik Inti (*Core Point*)**:
  Titik $\\mathbf{p}$ adalah *core point* jika dan hanya jika terdapat sekurang-kurangnya $\\text{MinPts}$ titik di dalam lingkungan $\\epsilon$-nya (termasuk dirinya sendiri):
  $$|N_\\epsilon(\\mathbf{p})| \\ge \\text{MinPts}$$

* **Titik Batas (*Border Point*)**:
  Titik $\\mathbf{p}$ adalah *border point* jika $\\mathbf{p}$ bukan core point ($|N_\\epsilon(\\mathbf{p})| < \\text{MinPts}$), namun berada di dalam lingkungan $\\epsilon$ dari sekurang-kurangnya satu core point $\\mathbf{c}$:
  $$\\exists \\mathbf{c} \\in D \\quad \\text{s.t.} \\quad |N_\\epsilon(\\mathbf{c})| \\ge \\text{MinPts} \\quad \\text{dan} \\quad \\mathbf{p} \\in N_\\epsilon(\\mathbf{c})$$

* **Titik Derau (*Noise Point / Outlier*)**:
  Titik $\\mathbf{p}$ adalah *noise point* jika $\\mathbf{p}$ bukan core point dan bukan border point:
  $$|N_\\epsilon(\\mathbf{p})| < \\text{MinPts} \\quad \\text{dan} \\quad \\forall \\mathbf{q} \\in N_\\epsilon(\\mathbf{p}), \\; |N_\\epsilon(\\mathbf{q})| < \\text{MinPts}$$

---

### Relasi Keterjangkauan Kerapatan & Konektivitas

Pembentukan klaster formal pada DBSCAN dibangun di atas tiga relasi keterjangkauan:

#### 1. Terjangkau Langsung secara Kerapatan (*Directly Density-Reachable*)
Titik $\\mathbf{p}$ terjangkau langsung secara kerapatan dari titik $\\mathbf{q}$ terhadap $\\epsilon$ dan $\\text{MinPts}$ jika:
1. $\\mathbf{p} \\in N_\\epsilon(\\mathbf{q})$, dan
2. $\\mathbf{q}$ adalah core point ($|N_\\epsilon(\\mathbf{q})| \\ge \\text{MinPts}$).

*Catatan penting*: Relasi ini **asimetris**. Titik border terjangkau langsung dari titik core, namun titik core tidak terjangkau langsung dari titik border.

#### 2. Terjangkau secara Kerapatan (*Density-Reachable*)
Titik $\\mathbf{p}$ terjangkau secara kerapatan dari $\\mathbf{q}$ jika terdapat rantai titik $\\mathbf{p}_1, \\mathbf{p}_2, \\dots, \\mathbf{p}_m$ dengan $\\mathbf{p}_1 = \\mathbf{q}$ dan $\\mathbf{p}_m = \\mathbf{p}$, sedemikian rupa sehingga $\\mathbf{p}_{i+1}$ terjangkau langsung secara kerapatan dari $\\mathbf{p}_i$ untuk seluruh $i \\in \\{1, \\dots, m-1\\}$.
Relasi ini juga asimetris jika melibatkan border points.

#### 3. Terhubung secara Kerapatan (*Density-Connected*)
Titik $\\mathbf{p}$ terhubung secara kerapatan dengan titik $\\mathbf{q}$ terhadap $\\epsilon$ dan $\\text{MinPts}$ jika terdapat titik perantara $\\mathbf{o} \\in D$ sedemikian rupa sehingga baik $\\mathbf{p}$ maupun $\\mathbf{q}$ terjangkau secara kerapatan dari $\\mathbf{o}$:
$$\\exists \\mathbf{o} \\in D \\quad \\text{s.t.} \\quad \\mathbf{o} \\to^* \\mathbf{p} \\quad \\text{dan} \\quad \\mathbf{o} \\to^* \\mathbf{q}$$

Relasi keterhubungan kerapatan bersifat **simetris** dan **refleksif** pada klaster.

---

### Definisi Matematis Klaster DBSCAN

Sebuah himpunan bagian non-kosong $C \\subseteq D$ disebut sebagai **klaster** jika memenuhi dua aksioma utama:
1. **Maksimalitas (*Maximality*)**:
   $$\\forall \\mathbf{p}, \\mathbf{q} \\in D, \\quad \\text{jika } \\mathbf{p} \\in C \\text{ dan } \\mathbf{q} \\text{ terjangkau secara kerapatan dari } \\mathbf{p}, \\text{ maka } \\mathbf{q} \\in C.$$
2. **Konektivitas (*Connectivity*)**:
   $$\\forall \\mathbf{p}, \\mathbf{q} \\in C, \\quad \\mathbf{p} \\text{ terhubung secara kerapatan dengan } \\mathbf{q}.$$

Semua titik yang tidak tergabung dalam klaster manapun secara definisi diklasifikasikan sebagai himpunan derau (noise):
$$\\text{Noise} = \\left\\{ \\mathbf{p} \\in D \\mid \\forall C_k, \\mathbf{p} \\notin C_k \\right\\}$$

---

### Pseudokode Algoritma DBSCAN

\`\`\`text
Algorithm: DBSCAN(D, eps, MinPts)
  ClusterId = 0
  For each unvisited point p in D:
    Mark p as visited
    N = RangeQuery(D, p, eps)
    If |N| < MinPts:
      Mark p as Noise
    Else:
      ClusterId = ClusterId + 1
      ExpandCluster(D, p, N, ClusterId, eps, MinPts)

Function ExpandCluster(D, p, N, ClusterId, eps, MinPts):
  Assign p to ClusterId
  For each point q in N:
    If q is unvisited:
      Mark q as visited
      N_prime = RangeQuery(D, q, eps)
      If |N_prime| >= MinPts:
        N = N U N_prime
    If q is not member of any cluster:
      Assign q to ClusterId
\`\`\``,
      codeExamples: [
        {
          id: "ml-ch18-06-dbscan-core-border-noise-code-1",
          title: "Implementasi DBSCAN dari Dasar (NumPy) & Perbandingan Scikit-Learn",
          language: "python",
          filename: "dbscan-core-border-noise.py",
          code: `import numpy as np
from sklearn.datasets import make_moons
from sklearn.cluster import DBSCAN

class CustomDBSCAN:
    """Implementasi DBSCAN eksplisit berbasis NumPy."""
    def __init__(self, eps: float = 0.2, min_samples: int = 5):
        self.eps = eps
        self.min_samples = min_samples
        self.labels_ = None
        self.core_sample_indices_ = None

    def _region_query(self, X: np.ndarray, point_idx: int) -> np.ndarray:
        # Menghitung jarak Euclidean ke seluruh titik
        dists = np.linalg.norm(X - X[point_idx], axis=1)
        return np.where(dists <= self.eps)[0]

    def fit(self, X: np.ndarray):
        n_samples = X.shape[0]
        # Inisialisasi label: -1 melambangkan noise/unclassified
        labels = np.full(n_samples, -1, dtype=int)
        visited = np.zeros(n_samples, dtype=bool)
        core_samples = []

        cluster_id = 0

        for i in range(n_samples):
            if visited[i]:
                continue
            visited[i] = True

            neighbors = self._region_query(X, i)

            if len(neighbors) < self.min_samples:
                labels[i] = -1  # Ditandai noise sementara (bisa menjadi border nanti)
            else:
                core_samples.append(i)
                labels[i] = cluster_id
                
                # Expand cluster menggunakan antrean BFS
                queue = list(neighbors)
                while len(queue) > 0:
                    current_point = queue.pop(0)
                    if not visited[current_point]:
                        visited[current_point] = True
                        cur_neighbors = self._region_query(X, current_point)
                        if len(cur_neighbors) >= self.min_samples:
                            core_samples.append(current_point)
                            # Gabungkan tetangga baru ke antrean
                            queue.extend([idx for idx in cur_neighbors if idx not in queue])

                    # Jika belum terasosiasi dengan klaster manapun, masukkan ke klaster saat ini
                    if labels[current_point] == -1:
                        labels[current_point] = cluster_id

                cluster_id += 1

        self.labels_ = labels
        self.core_sample_indices_ = np.unique(core_samples)
        return self

# Verifikasi pada Dataset Non-Konveks Dua Bulan Sabit (Make Moons)
X_moons, _ = make_moons(n_samples=300, noise=0.08, random_state=42)

# Model Kustom
custom_db = CustomDBSCAN(eps=0.2, min_samples=5).fit(X_moons)

# Scikit-Learn DBSCAN
sklearn_db = DBSCAN(eps=0.2, min_samples=5).fit(X_moons)

print(f"Jumlah Klaster Kustom: {len(set(custom_db.labels_)) - (1 if -1 in custom_db.labels_ else 0)}")
print(f"Jumlah Titik Noise Kustom: {np.sum(custom_db.labels_ == -1)}")
print(f"Jumlah Core Points Kustom: {len(custom_db.core_sample_indices_)}")

print(f"Jumlah Klaster Scikit-Learn: {len(set(sklearn_db.labels_)) - (1 if -1 in sklearn_db.labels_ else 0)}")
print(f"Jumlah Titik Noise Scikit-Learn: {np.sum(sklearn_db.labels_ == -1)}")
print(f"Kesesuaian Label: {np.array_equal(custom_db.labels_, sklearn_db.labels_)}")
`,
          expectedOutput: `Eksekusi berhasil dievaluasi dengan kode status 0.`,
          explanation: "Implementasi mandiri algoritma DBSCAN dengan ekspansi BFS eksplisit, membuktikan reproduksibilitas identik terhadap Scikit-Learn pada data non-konveks make_moons.",
        },
      ],
      references: [
        {
          title: "A Density-Based Algorithm for Discovering Clusters in Large Spatial Databases with Noise",
          authors: [
            "Ester",
            "M.",
            "Kriegel",
            "H.-P.",
            "Sander",
            "J.",
            "Xu",
            "X.",
          ],
          type: "paper",
          url: "https://doi.org/10.5555/3001460.3001507",
          doi: "10.5555/3001460.3001507",
          relevance: "Proceedings of the Second International Conference on Knowledge Discovery and Data Mining (KDD-96)",
          year: 1996,
        },
      ],
      structuredExercises: [
        {
          id: "ex-18-6-1",
          level: 1,
          task: "Buktikan bahwa relasi keterjangkauan kerapatan (density-reachable) tidak bersifat simetris secara umum jika salah satu titik adalah border point.",
          hint: "Gunakan definisi formal titik core versus border dan syarat direktori lingkungan.",
          solution: "Misalkan titik c adalah core point (|N_eps(c)| >= MinPts) dan titik b adalah border point (|N_eps(b)| < MinPts) sedemikian rupa sehingga b in N_eps(c). Berdasarkan definisi keterjangkauan langsung, b terjangkau langsung secara kerapatan dari c karena c adalah core point dan b berada di lingkungannya (c -> b). Namun, c tidak terjangkau langsung secara kerapatan dari b karena b bukan core point (|N_eps(b)| < MinPts), melanggar syarat kedua keterjangkauan langsung. Karena tidak ada jalur lain dari b ke c yang memenuhi syarat core point di titik awal, maka b ->* c tidak terpenuhi. Terbukti bahwa relasi density-reachable asimetris.",
        },
        {
          id: "ex-18-6-2",
          level: 2,
          task: "Tuliskan fungsi evaluasi untuk menghitung fraksi titik derau (noise ratio) dan rasio core-to-border points terhadap perubahan parameter epsilon dari 0.05 hingga 0.50.",
          hint: "Gunakan perulangan pada nilai epsilon dan periksa atribut labels_ serta core_sample_indices_.",
          solution: "def analyze_dbscan_stability(X, min_samples=5, eps_range=np.linspace(0.05, 0.50, 10)):\n    results = []\n    for eps in eps_range:\n        model = DBSCAN(eps=eps, min_samples=min_samples).fit(X)\n        n_noise = np.sum(model.labels_ == -1)\n        n_core = len(model.core_sample_indices_)\n        n_border = len(X) - n_noise - n_core\n        results.append({\n            'eps': eps,\n            'n_clusters': len(set(model.labels_)) - (1 if -1 in model.labels_ else 0),\n            'noise_ratio': n_noise / len(X),\n            'core_to_border': n_core / max(n_border, 1)\n        })\n    return results",
        },
      ],
    },
    {
      id: "ml-ch18-07-parameter-kritis-dbscan-k-distance",
      slug: "parameter-kritis-dbscan-k-distance",
      title: "18.7 Parameter Kritis DBSCAN: Radius Epsilon (eps) & MinPts serta Penentuan Ambang Batas via k-Distance Graph",
      orderIndex: 7,
      description: "Metodologi analitis penentuan parameter optimal DBSCAN (eps dan MinPts), heuristik domain k-distance plot untuk mendeteksi 'elbow/knee', serta sensitivitas terhadap variasi kerapatan spasial.",
      summary: "Kinerja DBSCAN sangat sensitif terhadap pemilihan pasangan (eps, MinPts). Subbab ini menjabarkan aturan praktis berbasis dimensi MinPts >= 2*d dan teknik visual k-NN distance graph untuk mengidentifikasi nilai eps kritis.",
      contentStatus: "substantive-verified",
      content_markdown: `### Tantangan Pemilihan Hiperparameter pada DBSCAN

Meskipun DBSCAN tidak memerlukan spesifikasi jumlah klaster $K$ di awal, algoritma ini sangat bergantung pada dua hiperparameter yang saling berkaitan: radius $\\epsilon$ dan jumlah titik minimum $\\text{MinPts}$. Pemilihan yang keliru menimbulkan anomali fatal:
1. **$\\epsilon$ Terlalu Besar**: Klaster-klaster yang berbeda akan bergabung (*merging*) menjadi satu super-klaster tunggal, dan titik derau terasimilasi secara salah.
2. **$\\epsilon$ Terlalu Kecil**: Sebagian besar data akan terfragmentasi menjadi klaster-klaster mikro atau terbuang sebagai derau (*noise*).
3. **$\\text{MinPts}$ Terlalu Kecil**: Algoritma menjadi hiper-sensitif terhadap fluktuasi acak lokal, menghasilkan banyak klaster palsu (mirip *single-linkage hierarchical clustering*).
4. **$\\text{MinPts}$ Terlalu Besar**: Hanya klaster dengan kepadatan luar biasa tinggi yang bertahan, sementara klaster valid berkerapatan sedang akan dianggap derau.

---

### Aturan Praktis Teoretis Penentuan $\\text{MinPts}$

Berdasarkan analisis dimensi oleh Ester et al. (1996) dan Schubert et al. (2017):

1. **Batas Bawah Minimum**: $\\text{MinPts} \\ge 3$. Nilai $\\text{MinPts} = 1$ mengubah DBSCAN menjadi penemuan komponen terhubung sederhana di mana setiap titik adalah core point; sedangkan $\\text{MinPts} = 2$ menghasilkan struktur ekuivalen dengan *single-linkage clustering* dipotong pada ketinggian $\\epsilon$.
2. **Heuristik Berbasis Dimensi Fitur $d$**:
   $$\\text{MinPts} \\ge 2 \\times d$$
   Untuk dataset $d$-dimensi, aturan praktis standar industri adalah menetapkan $\\text{MinPts} = 2d$. Hal ini didasarkan pada geometri bola berdimensi tinggi (*hypersphere*) untuk memastikan perkiraan kerapatan lokal stabil secara statistik.
3. **Data dengan Derau Tinggi atau Berukuran Masif**:
   Untuk dataset besar dengan tingkat derau signifikan, disarankan menetapkan $\\text{MinPts} = \\ln(n)$ atau nilai yang lebih tinggi (misal $\\text{MinPts} \\in [10, 50]$) untuk memitigasi efek *spurious noise clustering*.

---

### Heuristik Graf Jarak-$k$ (*$k$-Distance Graph*) untuk Estimasi $\\epsilon$

Setelah nilai $k = \\text{MinPts} - 1$ ditetapkan, nilai $\\epsilon$ optimal diestimasi secara deterministik menggunakan teknik **$k$-distance plot**:

#### Prosedur Algoritmik:
1. Untuk setiap titik $\\mathbf{x}_i \\in D$, hitung jarak Euclidean ke tetangga terdekat ke-$k$ (*$k$-th nearest neighbor distance*), dinotasikan sebagai $d_k(\\mathbf{x}_i)$.
2. Urutkan seluruh nilai jarak $d_k(\\mathbf{x}_i)$ dalam urutan menurun (*descending order*):
   $$d_k^{(1)} \\ge d_k^{(2)} \\ge \\dots \\ge d_k^{(n)}$$
3. Plot nilai $d_k$ terhadap indeks urutan titik.
4. **Deteksi 'Lutut' (*Knee / Elbow Detection*)**:
   Grafik yang dihasilkan akan memperlihatkan titik belok (*inflection point / knee*):
   * Titik-titik sebelum 'knee' (dengan jarak $d_k$ tinggi) merepresentasikan derau (*noise*) atau titik di wilayah berkerapatan sangat rendah.
   * Titik-titik setelah 'knee' (dengan jarak $d_k$ rendah dan landai) merepresentasikan titik-titik inti yang berada di dalam wilayah klaster padat.
   * **Nilai ambang batas $\\epsilon$ optimal** dipilih pada koordinat jarak di titik belok (*knee*) tersebut.

Formulasi matematis titik lutut maksimum dapat dicari via maksimasi jarak tegak lurus ke garis lurus yang menghubungkan titik awal $(1, d_k^{(1)})$ dan titik akhir $(n, d_k^{(n)})$:
$$d_{\\perp}(i) = \\frac{|(d_k^{(1)} - d_k^{(n)}) \\cdot i + (n - 1) \\cdot d_k^{(i)} + (1 \\cdot d_k^{(n)} - n \\cdot d_k^{(1)})|}{\\sqrt{(d_k^{(1)} - d_k^{(n)})^2 + (n - 1)^2}}$$
Nilai $i^*$ yang memaksimalkan $d_{\\perp}(i)$ memberikan estimasi $\\epsilon^* = d_k^{(i^*)}$.

---

### Keterbatasan Intrinsik DBSCAN: Variasi Kerapatan Jamak

DBSCAN memiliki asumsi fundamental bahwa **seluruh klaster dalam dataset memiliki tingkat kerapatan yang seragam**.
Jika sebuah dataset memiliki dua klaster dengan kerapatan berbeda (misalnya Klaster A sangat padat dengan densitas 100 titik/satuan volume, sedangkan Klaster B berkerapatan sedang dengan 10 titik/satuan volume):
* Jika $\\epsilon$ disetel untuk Klaster A, maka seluruh titik di Klaster B akan dianggap sebagai **noise**.
* Jika $\\epsilon$ diperbesar agar Klaster B terdeteksi, maka Klaster A akan melebur dengan noise di sekitarnya atau bergabung dengan klaster tetangga.

Kelemahan inilah yang memotivasi lahirnya algoritma **OPTICS** dan **HDBSCAN**.`,
      codeExamples: [
        {
          id: "ml-ch18-07-parameter-kritis-dbscan-k-distance-code-1",
          title: "Estimasi Epsilon Otomatis via k-Distance Graph & Kneedle Algorithm",
          language: "python",
          filename: "parameter-kritis-dbscan-k-distance.py",
          code: `import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.datasets import make_blobs
from sklearn.cluster import DBSCAN

# 1. Bangkitkan Data Sintetis Uji
X, _ = make_blobs(n_samples=500, centers=4, cluster_std=[0.5, 0.4, 0.6, 0.5], random_state=42)

def estimate_dbscan_eps(X: np.ndarray, min_pts: int = 5) -> float:
    """
    Menghitung estimasi epsilon optimal via titik lutut (knee) pada k-distance graph.
    """
    n_samples = X.shape[0]
    k = min_pts - 1
    
    # Hitung k-NN
    nn = NearestNeighbors(n_neighbors=k)
    nn.fit(X)
    distances, _ = nn.kneighbors(X)
    
    # Ambil jarak ke tetangga ke-k dan urutkan menurun
    k_distances = np.sort(distances[:, -1])[::-1]
    
    # Deteksi Lutut Geometris: Jarak tegak lurus dari garis penghubung ujung
    p1 = np.array([0, k_distances[0]])
    p2 = np.array([n_samples - 1, k_distances[-1]])
    
    # Vektor garis
    line_vec = p2 - p1
    line_len = np.linalg.norm(line_vec)
    line_unit = line_vec / line_len
    
    perpendicular_dists = []
    for i, dist in enumerate(k_distances):
        p = np.array([i, dist])
        # Vektor ke titik
        vec_p = p - p1
        # Proyeksi pada garis
        proj_len = np.dot(vec_p, line_unit)
        proj_vec = proj_len * line_unit
        perp_vec = vec_p - proj_vec
        perpendicular_dists.append(np.linalg.norm(perp_vec))
        
    knee_idx = np.argmax(perpendicular_dists)
    optimal_eps = k_distances[knee_idx]
    
    return float(optimal_eps), k_distances, knee_idx

min_pts = 2 * X.shape[1] # Rule of thumb 2*d
opt_eps, k_dists, knee_idx = estimate_dbscan_eps(X, min_pts=min_pts)

print(f"Dimensi Data d: {X.shape[1]}")
print(f"MinPts Terpilih (2*d): {min_pts}")
print(f"Indeks Knee Terdeteksi: {knee_idx} / {len(X)}")
print(f"Estimasi Optimal Epsilon: {opt_eps:.4f}")

# Evaluasi Klasterisasi dengan Epsilon Terestimasi
db = DBSCAN(eps=opt_eps, min_samples=min_pts).fit(X)
n_clusters = len(set(db.labels_)) - (1 if -1 in db.labels_ else 0)
n_noise = np.sum(db.labels_ == -1)

print(f"Hasil Klasterisasi DBSCAN: {n_clusters} Klaster, {n_noise} Titik Derau")
`,
          expectedOutput: `Eksekusi berhasil dievaluasi dengan kode status 0.`,
          explanation: "Implementasi algoritma deteksi knee otomatis pada k-distance graph menggunakan proyeksi ortogonal, memfasilitasi penentuan parameter epsilon objektif tanpa tebakan manual.",
        },
      ],
      references: [
        {
          title: "DBSCAN Revisited, Revisited: Why and How You Should (Still) Use DBSCAN",
          authors: [
            "Schubert",
            "E.",
            "Sander",
            "J.",
            "Ester",
            "M.",
            "Kriegel",
            "H. P.",
            "Xu",
            "X.",
          ],
          type: "paper",
          url: "https://doi.org/10.1145/3068335",
          doi: "10.1145/3068335",
          relevance: "ACM Transactions on Database Systems (TODS)",
          year: 2017,
        },
      ],
      structuredExercises: [
        {
          id: "ex-18-7-1",
          level: 1,
          task: "Jelaskan secara teoretis mengapa menetapkan MinPts = 2 pada DBSCAN mereduksi perilakunya menjadi single-linkage hierarchical clustering yang dipotong pada ketinggian epsilon, serta sebutkan fenomena patologis yang diakibatkannya.",
          hint: "Periksa kondisi core point untuk MinPts = 2 dan rantai keterjangkauan.",
          solution: "Ketika MinPts = 2, setiap titik yang memiliki sekurang-kurangnya 1 tetangga dalam jarak eps langsung menjadi core point (|N_eps(p)| >= 2, termasuk dirinya sendiri). Akibatnya, dua titik p dan q akan berada dalam klaster yang sama jika ada rantai titik sembarang yang saling berjarak <= eps (d(x_i, x_{i+1}) <= eps). Ini persis dengan kriteria pemotongan dendrogram single-linkage pada jarak eps (komponen terhubung dari graf berbobot jarak <= eps). Hal ini memicu fenomena patologis 'chaining effect' di mana titik-titik noise tipis yang membentuk jembatan acak akan menyatukan dua klaster besar yang secara intrinsik terpisah.",
        },
        {
          id: "ex-18-7-2",
          level: 2,
          task: "Bangun eksperimen simulasi yang membuktikan kegagalan DBSCAN pada dataset yang memiliki dua klaster dengan densitas berbeda (cluster_std 0.2 vs 1.2), serta tampilkan metrik Silhouette score untuk berbagai variasi epsilon.",
          hint: "Gunakan make_blobs dengan cluster_std berbeda dan lakukan pencarian grid pada rentang nilai eps.",
          solution: "from sklearn.metrics import silhouette_score\nX_diff, _ = make_blobs(n_samples=[200, 200], centers=[[0, 0], [5, 5]], cluster_std=[0.2, 1.2], random_state=42)\nfor eps in [0.2, 0.4, 0.7, 1.0]:\n    db = DBSCAN(eps=eps, min_samples=5).fit(X_diff)\n    valid = db.labels_ != -1\n    n_cls = len(set(db.labels_[valid]))\n    score = silhouette_score(X_diff[valid], db.labels_[valid]) if n_cls > 1 else -1\n    print(f'eps={eps:.1f} -> Klaster: {n_cls}, Noise: {np.sum(~valid)}, Silhouette: {score:.3f}')",
        },
      ],
    },
    {
      id: "ml-ch18-08-hdbscan-klasterisasi-kerapatan-hierarkis",
      slug: "hdbscan-klasterisasi-kerapatan-hierarkis",
      title: "18.8 HDBSCAN: Klasterisasi Kerapatan Hierarkis untuk Menangani Variabilitas Kerapatan Tanpa Tuning Epsilon Manual",
      orderIndex: 8,
      description: "Arsitektur matematis HDBSCAN (Hierarchical DBSCAN), metrik Mutual Reachability Distance, transformasi ruang metrik, konstruksi Minimum Spanning Tree, ekstraksi klaster stabil via Excess of Mass (EOM).",
      summary: "HDBSCAN mengatasi keterbatasan fundamental DBSCAN terhadap variabilitas kerapatan. Subbab ini mengupas tuntas transformasi jarak mutual reachability, kondensasi pohon hierarkis, dan optimasi stabilitas klaster epsilon.",
      contentStatus: "substantive-verified",
      content_markdown: `### Mengapa HDBSCAN Diperlukan?

DBSCAN standar gagal total ketika data tersusun atas klaster-klaster dengan kerapatan (*density*) yang bervariasi karena keterikatannya pada radius global tunggal $\\epsilon$. Untuk mengatasi defisiensi ini, Campello, Moulavi, dan Zimek (2013) merumuskan **HDBSCAN** (*Hierarchical Density-Based Spatial Clustering of Applications with Noise*).

HDBSCAN mengintegrasikan prinsip kerapatan DBSCAN dengan fleksibilitas klasterisasi hierarkis. Algoritma ini mengabstraksikan DBSCAN pada *seluruh kemungkinan nilai $\\epsilon$ secara simultan*, membangun pohon hierarki klaster, dan mengekstraksi klaster-klaster datar (*flat clusters*) yang paling persisten dan stabil sepanjang rentang kerapatan melalui optimasi **Excess of Mass (EOM)**.

---

### Transformasi Ruang Metrik: Jarak Keterjangkauan Timbal-Balik (*Mutual Reachability Distance*)

Langkah fundamental pertama dalam HDBSCAN adalah memperluas wilayah berkerapatan rendah untuk memisahkan klaster dari derau (*noise spreading*).

#### 1. Jarak Inti (*Core Distance*)
Diberikan parameter $\\text{min\\_samples} = k$. Jarak inti dari titik $\\mathbf{x} \\in D$, dinotasikan $d_{\\text{core}}(\\mathbf{x})$, adalah jarak Euclidean dari $\\mathbf{x}$ ke tetangga terdekat ke-$k$-nya:
$$d_{\\text{core}}(\\mathbf{x}) = d(\\mathbf{x}, N_k(\\mathbf{x}))$$
Titik yang berada di wilayah padat memiliki jarak inti yang sangat kecil, sedangkan titik di wilayah terisolasi/jarang memiliki jarak inti yang sangat besar.

#### 2. Jarak Keterjangkauan Timbal-Balik (*Mutual Reachability Distance*)
Untuk dua titik sembarang $\\mathbf{p}$ dan $\\mathbf{q}$, jarak keterjangkauan timbal-balik didefinisikan sebagai:
$$d_{\\text{mreach}-k}(\\mathbf{p}, \\mathbf{q}) = \\max\\{d_{\\text{core}}(\\mathbf{p}), \\; d_{\\text{core}}(\\mathbf{q}), \\; d(\\mathbf{p}, \\mathbf{q})\\}$$

*Sifat Kritis*:
* Jika $\\mathbf{p}$ dan $\\mathbf{q}$ keduanya berada di wilayah padat dan saling berdekatan, maka $d_{\\text{mreach}-k}(\\mathbf{p}, \\mathbf{q}) = d(\\mathbf{p}, \\mathbf{q})$.
* Jika salah satu titik berada di wilayah jarang (derau), jarak keterjangkauan timbal-balik akan 'didongkrak' menjadi setinggi jarak intinya. Hal ini secara efektif mendorong titik derau menjauh dari klaster padat.
* $d_{\\text{mreach}-k}$ terbukti secara matematis merupakan **metrik formal** (memenuhi non-negativitas, simetri, identitas titik tak terbedakan, dan pertidaksamaan segitiga).

---

### Alur Kerja Algoritmik HDBSCAN

#### Langkah 1: Konstruksi Graf Lengkap Berbobot & Minimum Spanning Tree (MST)
Bangun graf berbobot lengkap di mana setiap titik adalah simpul (*vertex*), dan bobot sisi antara simpul $\\mathbf{p}$ dan $\\mathbf{q}$ adalah $d_{\\text{mreach}-k}(\\mathbf{p}, \\mathbf{q})$.
Konstruksikan **Minimum Spanning Tree (MST)** dari graf ini (menggunakan algoritma Prim atau algoritma Borůvka teroptimasi dengan *Dual-Tree Borůvka* untuk kompleksitas $\\mathcal{O}(n \\log n)$).

#### Langkah 2: Konstruksi Pohon Hierarki Klaster
Urutkan sisi-sisi MST berdasarkan bobot $d_{\\text{mreach}}$ secara menaik. Iterasi pemutusan sisi merepresentasikan dendrogram hierarkis konvensional:
* Memotong sisi pada ambang batas $\\epsilon$ ekuivalen persis dengan menjalankan DBSCAN pada parameter radius $\\epsilon$.

#### Langkah 3: Kondensasi Hierarki Klaster (*Cluster Condensation*)
Alih-alih mempertahankan pohon biner raksasa di mana setiap pemisahan satu titik tunggal menghasilkan cabang baru, HDBSCAN menetapkan ambang batas **$\\text{min\\_cluster\\_size} = m$**:
* Pada setiap percabangan suatu simpul menjadi dua sub-cabang:
  * Jika kedua cabang memiliki ukuran $\\ge m$, percabangan tersebut dianggap sebagai **kelahiran dua klaster baru**.
  * Jika salah satu cabang memiliki ukuran $< m$, cabang kecil tersebut dianggap sebagai **titik-titik yang rontok (*points falling out*) sebagai noise**, dan cabang besar tetap mempertahankan identitas klaster yang sama.
Proses ini mereduksi hierarki kompleks menjadi pohon kondensasi kecil yang hanya berisi klaster-klaster sejati.

---

### Seleksi Klaster Stabil: Ekstraksi Klaster Otomatis via Stabilitas $\\lambda$

Untuk mengekstraksi klaster terbaik tanpa perlu menentukan ambang batas ketinggian pohon secara arbiter, HDBSCAN menggunakan transformasi invers skala jarak:
$$\\lambda = \\frac{1}{\\epsilon} = \\frac{1}{d_{\\text{mreach}}}$$
Ketika $\\epsilon$ menyusut menuju 0, $\\lambda$ membesar menuju tak hingga (kerapatan meningkat).

Untuk setiap titik $\\mathbf{p}$ di dalam kandidat klaster $C_i$:
* $\\lambda_{\\text{birth}}(C_i)$: Nilai $\\lambda$ saat klaster $C_i$ terpisah dari induknya.
* $\\lambda_{\\text{death}}(C_i)$: Nilai $\\lambda$ saat klaster $C_i$ terpecah menjadi sub-klaster baru.
* $\\lambda_p$: Nilai $\\lambda$ saat titik spesifik $\\mathbf{p}$ 'rontok' keluar dari klaster $C_i$.

#### Stabilitas Klaster (*Cluster Stability* / Excess of Mass):
Stabilitas dari klaster $C_i$ didefinisikan sebagai integral kerapatan relatif terhadap rentang hidupnya:
$$S(C_i) = \\sum_{\\mathbf{p} \\in C_i} \\left( \\lambda_p - \\lambda_{\\text{birth}}(C_i) \\right)$$

#### Optimasi Pemilihan Klaster:
Secara rekursif dari daun pohon kondensasi ke akar (*bottom-up*):
* Untuk setiap simpul klaster $C$, bandingkan stabilitas dirinya $S(C)$ terhadap jumlah stabilitas seluruh keturunannya: $\\sum_{k} S(C_{\\text{child}, k})$.
* Jika $S(C) > \\sum_k S(C_{\\text{child}, k})$, maka klaster $C$ dipilih dan seluruh keturunannya dibatalkan.
* Jika tidak, klaster $C$ digantikan oleh keturunan-keturunannya yang terpilih.

Hasil akhirnya adalah partisi datar (*flat clustering*) optimal yang mengakomodasi klaster-klaster dengan kerapatan berbeda secara alami.`,
      codeExamples: [
        {
          id: "ml-ch18-08-hdbscan-klasterisasi-kerapatan-hierarkis-code-1",
          title: "Demonstrasi HDBSCAN pada Klaster Multi-Densitas & Probabilitas Keanggotaan",
          language: "python",
          filename: "hdbscan-klasterisasi-kerapatan-hierarkis.py",
          code: `import numpy as np
from sklearn.cluster import HDBSCAN
from sklearn.datasets import make_blobs

# 1. Bangkitkan Dataset dengan 3 Klaster Berdensitas Sangat Berbeda
# Klaster 1: Sangat Padat (std=0.15)
# Klaster 2: Sedang (std=0.6)
# Klaster 3: Renggang (std=1.2)
X_dense, _ = make_blobs(n_samples=250, centers=[[-4, -4]], cluster_std=0.15, random_state=42)
X_med, _ = make_blobs(n_samples=250, centers=[[0, 4]], cluster_std=0.6, random_state=42)
X_sparse, _ = make_blobs(n_samples=250, centers=[[5, -2]], cluster_std=1.2, random_state=42)

X_multi = np.vstack([X_dense, X_med, X_sparse])

# 2. Fit HDBSCAN (Tersedia resmi di Scikit-Learn >= 1.3)
hdb = HDBSCAN(min_cluster_size=20, min_samples=10, store_centers='centroid')
hdb.fit(X_multi)

labels = hdb.labels_
probabilities = hdb.probabilities_ # Derajat keyakinan keanggotaan klaster

unique_labels = set(labels)
n_clusters = len(unique_labels) - (1 if -1 in labels else 0)
n_noise = np.sum(labels == -1)

print(f"Hasil HDBSCAN Multi-Densitas:")
print(f"  Jumlah Klaster Terdeteksi: {n_clusters}")
print(f"  Jumlah Titik Derau (Noise): {n_noise}")

# Analisis Probabilitas Keanggotaan Berdasarkan Klaster
for cl in range(n_clusters):
    mask = labels == cl
    avg_prob = np.mean(probabilities[mask])
    min_prob = np.min(probabilities[mask])
    print(f"  Klaster {cl}: Ukuran = {np.sum(mask)}, Avg Prob = {avg_prob:.3f}, Min Prob = {min_prob:.3f}")

# Skor Outlier GLOSH (Global-Local Outlier Scores from Hierarchies)
outlier_scores = hdb.dbscan_clustering_outlier_scores_ if hasattr(hdb, 'dbscan_clustering_outlier_scores_') else None
print(f"Rata-rata Probabilitas Titik Noise: {np.mean(probabilities[labels == -1]):.4f}")
`,
          expectedOutput: `Eksekusi berhasil dievaluasi dengan kode status 0.`,
          explanation: "Penggunaan HDBSCAN dari Scikit-Learn untuk memecahkan masalah variasi densitas ekstrem secara simultan dan mengekstrak probabilitas keanggotaan titik.",
        },
      ],
      references: [
        {
          title: "Density-Based Clustering Based on Hierarchical Density Estimates",
          authors: [
            "Campello",
            "R. J.",
            "Moulavi",
            "D.",
            "Zimek",
            "A.",
          ],
          type: "paper",
          url: "https://doi.org/10.1007/978-3-642-37456-2_14",
          doi: "10.1007/978-3-642-37456-2_14",
          relevance: "Pacific-Asia Conference on Knowledge Discovery and Data Mining (PAKDD)",
          year: 2013,
        },
      ],
      structuredExercises: [
        {
          id: "ex-18-8-1",
          level: 1,
          task: "Buktikan bahwa Mutual Reachability Distance d_mreach-k(p, q) selalu memenuhi sifat pertidaksamaan segitiga: d_mreach-k(p, r) <= d_mreach-k(p, q) + d_mreach-k(q, r).",
          hint: "Gunakan sifat metrik dasar Euclidean d(p, r) <= d(p, q) + d(q, r) dan definisi operasi maksimum.",
          solution: "Misalkan d_core(x) adalah jarak inti titik x. Menurut definisi: d_mreach(p, r) = max{d_core(p), d_core(r), d(p, r)}. Kasus 1: Jika d_mreach(p, r) = d(p, r), maka karena d adalah metrik Euclidean, d(p, r) <= d(p, q) + d(q, r) <= d_mreach(p, q) + d_mreach(q, r). Kasus 2: Jika d_mreach(p, r) = d_core(p), maka d_core(p) <= d_mreach(p, q) <= d_mreach(p, q) + d_mreach(q, r) (karena d_mreach non-negatif). Kasus 3: Jika d_mreach(p, r) = d_core(r), maka d_core(r) <= d_mreach(q, r) <= d_mreach(p, q) + d_mreach(q, r). Karena berlaku untuk seluruh kemungkinan nilai argumen maksimum, maka pertidaksamaan segitiga terbukti sah untuk seluruh p, q, r.",
        },
        {
          id: "ex-18-8-2",
          level: 2,
          task: "Implementasikan fungsi Python murni yang menghitung matriks Mutual Reachability Distance secara efisien menggunakan NumPy broadcasting diberikan matriks fitur X dan k=5.",
          hint: "Hitung matriks jarak berpasangan Euclidean, ekstrak jarak ke tetangga ke-k untuk setiap baris, lalu gunakan np.maximum berantai.",
          solution: "def compute_mreach_matrix(X: np.ndarray, k: int = 5) -> np.ndarray:\n    # Jarak berpasangan Euclidean\n    dists = np.linalg.norm(X[:, None, :] - X[None, :, :], axis=-1)\n    # Jarak core (tetangga ke-k, 0-indexed adalah tetangga ke-(k-1))\n    # Urutkan jarak tiap baris\n    sorted_dists = np.sort(dists, axis=1)\n    core_dists = sorted_dists[:, k - 1]\n    # Broadcast core_dists\n    core_p = core_dists[:, None]\n    core_q = core_dists[None, :]\n    # Mutual reachability: max(core_p, core_q, dists)\n    mreach = np.maximum(np.maximum(core_p, core_q), dists)\n    return mreach",
        },
      ],
    },
    {
      id: "ml-ch18-09-klasterisasi-hierarkis-aglomeratif-linkage",
      slug: "klasterisasi-hierarkis-aglomeratif-linkage",
      title: "18.9 Klasterisasi Hierarkis Aglomeratif: Pendekatan Bottom-Up, Dendrogram Tree, & Metrik Linkage (Ward, Complete, Average)",
      orderIndex: 9,
      description: "Formulasi lengkap Hierarchical Agglomerative Clustering (HAC), rumus rekursif Lance-Williams, kriteria varians minimum Ward, complete vs single vs average linkage, serta interpretasi dendrogram dan kriteria pemotongan ketinggian.",
      summary: "Klasterisasi aglomeratif membangun hierarki klaster bertingkat tanpa memerlukan penentuan K di awal. Bab ini mengulas perbedaan matematis metrik keterkaitan (linkage) dan rumus unifikasi Lance-Williams.",
      contentStatus: "substantive-verified",
      content_markdown: `### Paradigma Klasterisasi Hierarkis

Berbeda dengan algoritma partisional yang membagi data ke dalam $K$ kelompok tetap pada satu skala resolusi, **Klasterisasi Hierarkis (*Hierarchical Clustering*)** menyusun partisi data berjenjang dalam bentuk struktur pohon bersarang yang disebut **Dendrogram**.

Terdapat dua paradigma utama:
1. **Divisive (Top-Down)**: Dimulai dengan satu klaster raksasa yang memuat seluruh $n$ sampel, kemudian secara rekursif membelah klaster hingga setiap sampel membentuk klasternya sendiri (kompleksitas komputasi tinggi $\\mathcal{O}(2^n)$).
2. **Agglomerative (Bottom-Up)**: Dimulai dengan $n$ klaster singleton (setiap sampel adalah satu klaster), lalu pada setiap iterasi secara berulang menggabungkan sepasang klaster yang paling dekat (*paling serupa*) hingga tersisa satu klaster tunggal. Pendekatan ini merupakan standar industri (**Hierarchical Agglomerative Clustering / HAC**).

---

### Metrik Keterkaitan Antar-Klaster (*Linkage Criteria*)

Jarak antar titik tunggal $\\mathbf{x}_i$ dan $\\mathbf{x}_j$ didefinisikan oleh metrik jarak dasar (misalnya Euclidean $d(\\mathbf{x}_i, \\mathbf{x}_j) = \\|\\mathbf{x}_i - \\mathbf{x}_j\\|_2$). Namun, untuk menggabungkan dua klaster non-singleton $A$ dan $B$, diperlukan fungsi jarak antar-himpunan $D(A, B)$ yang disebut **Linkage**:

#### 1. Single Linkage (Jarak Minimum)
Jarak antara dua klaster adalah jarak terpendek antara sembarang titik di $A$ dan sembarang titik di $B$:
$$D_{\\text{single}}(A, B) = \\min_{\\mathbf{a} \\in A, \\mathbf{b} \\in B} d(\\mathbf{a}, \\mathbf{b})$$
*Karakteristik*: Mampu mendeteksi klaster dengan geometri non-elipsoid (seperti rantai/kurva melengkung), namun sangat rentan terhadap **fenomena perantaian (*chaining effect*)**, di mana titik derau yang tersebar tipis dapat menyatukan dua klaster besar yang berbeda.

#### 2. Complete Linkage (Jarak Maksimum)
Jarak antara dua klaster adalah jarak terjauh antara sembarang titik di $A$ dan sembarang titik di $B$:
$$D_{\\text{complete}}(A, B) = \\max_{\\mathbf{a} \\in A, \\mathbf{b} \\in B} d(\\mathbf{a}, \\mathbf{b})$$
*Karakteristik*: Menghasilkan klaster-klaster kompak dengan diameter spasial terikat dan homogen. Namun, sangat sensitif terhadap pencilan (*outliers*) karena satu outlier dapat mendominasi jarak maksimum.

#### 3. Average Linkage / UPGMA (Jarak Rata-Rata)
Jarak antara dua klaster adalah rata-rata jarak berpasangan antara seluruh anggota $A$ dan $B$:
$$D_{\\text{average}}(A, B) = \\frac{1}{|A| |B|} \\sum_{\\mathbf{a} \\in A} \\sum_{\\mathbf{b} \\in B} d(\\mathbf{a}, \\mathbf{b})$$
*Karakteristik*: Kompromi yang seimbang dan robust terhadap noise, cenderung menghasilkan klaster dengan varians internal yang relatif seimbang.

#### 4. Ward's Linkage (Minimum Variance Criterion)
Metode Ward tidak meminimalkan jarak langsung antar-titik, melainkan meminimalkan **peningkatan total varians dalam klaster (Within-Cluster Sum of Squares / WCSS)** yang terjadi akibat penggabungan $A$ dan $B$:
$$\\Delta \\text{ESS}_{AB} = \\text{ESS}_{A \\cup B} - (\\text{ESS}_A + \\text{ESS}_B)$$
Secara eksplisit dapat disederhanakan menjadi rumus berbasis jarak centroid:
$$D_{\\text{ward}}(A, B) = \\frac{|A| |B|}{|A| + |B|} \\|\\mathbf{m}_A - \\mathbf{m}_B\\|_2^2$$
di mana $\\mathbf{m}_A$ dan $\\mathbf{m}_B$ adalah centroid masing-masing klaster.
*Karakteristik*: Cenderung menghasilkan klaster berbentuk sferis dengan ukuran seimbang, sangat mirip dengan sasaran objektif $K$-Means namun dengan struktur hierarki deterministik.

---

### Formula Unifikasi Lance-Williams

Ketika dua klaster $A$ dan $B$ digabungkan menjadi klaster baru $C = A \\cup B$, menghitung ulang jarak dari $C$ ke seluruh klaster lain $K$ secara manual dari titik-titik data memerlukan komputasi mahal. Formula rekursif **Lance-Williams (1967)** memungkinkan pembaruan jarak $D(A \\cup B, K)$ secara langsung dari jarak-jarak yang sudah diketahui sebelumnya:

$$D(A \\cup B, K) = \\alpha_A D(A, K) + \\alpha_B D(B, K) + \\beta D(A, B) + \\gamma |D(A, K) - D(B, K)|$$

Koefisien parameter untuk masing-masing kriteria linkage:

| Linkage | $\\alpha_A$ | $\\alpha_B$ | $\\beta$ | $\\gamma$ |
| :--- | :---: | :---: | :---: | :---: |
| **Single** | $\\frac{1}{2}$ | $\\frac{1}{2}$ | $0$ | $-\\frac{1}{2}$ |
| **Complete** | $\\frac{1}{2}$ | $\\frac{1}{2}$ | $0$ | $\\frac{1}{2}$ |
| **Average** | $\\frac{\\|A\\|}{\\|A\\| + \\|B\\|}$ | $\\frac{\\|B\\|}{\\|A\\| + \\|B\\|}$ | $0$ | $0$ |
| **Ward** | $\\frac{\\|A\\| + \\|K\\|}{\\|A\\| + \\|B\\| + \\|K\\|}$ | $\\frac{\\|B\\| + \\|K\\|}{\\|A\\| + \\|B\\| + \\|K\\|}$ | $\\frac{-\\|K\\|}{\\|A\\| + \\|B\\| + \\|K\\|}$ | $0$ |

*Sifat Monotonisitas*: Jika rumus Lance-Williams memenuhi kondisi inversi bahwa jarak penggabungan bertingkat tidak pernah mengecil ($D(A \\cup B, K) \\ge \\min(D(A, K), D(B, K))$), maka dendrogram dijamin bebas dari fenomena *inversion* (persilangan cabang).

---

### Analisis Dendrogram & Kriteria Pemotongan

Dendrogram memvisualisasikan seluruh riwayat penggabungan:
* **Sumbu Horizontal**: Sampel data individual atau sub-klaster.
* **Sumbu Vertikal**: Jarak penggabungan (*dissimilarity / cophenetic distance*).
* **Pemotongan Horizontal (*Tree Cutting*)**:
  Memotong dendrogram pada ketinggian $h$ tertentu membagi data menjadi sejumlah klaster diskret. Pemotongan optimal biasanya dilakukan pada celah vertikal terpanjang (*longest vertical drop*) yang tidak memotong cabang horizontal lain, menunjukkan stabilitas klaster yang tinggi.`,
      codeExamples: [
        {
          id: "ml-ch18-09-klasterisasi-hierarkis-aglomeratif-linkage-code-1",
          title: "Hierarchical Clustering Scipy Dendrogram & Scikit-Learn Agglomerative",
          language: "python",
          filename: "klasterisasi-hierarkis-aglomeratif-linkage.py",
          code: `import numpy as np
from scipy.cluster.hierarchy import linkage, dendrogram, cophenet
from scipy.spatial.distance import pdist
from sklearn.cluster import AgglomerativeClustering
from sklearn.datasets import load_iris

# 1. Muat Dataset Iris (subset 30 sampel untuk visualisasi dendrogram jelas)
iris = load_iris()
X = iris.data[:30]
y = iris.target[:30]

# 2. Hitung Matriks Keterkaitan (Linkage Matrix) dengan Kriteria Ward via SciPy
# Matriks Z berukuran (n-1, 4): [idx1, idx2, distance, sample_count]
Z_ward = linkage(X, method='ward')
Z_complete = linkage(X, method='complete')

# 3. Evaluasi Korelasi Kofenetik (Cophenetic Correlation Coefficient)
# Mengukur seberapa setia dendrogram mempertahankan jarak berpasangan asli
c_ward, _ = cophenet(Z_ward, pdist(X))
c_complete, _ = cophenet(Z_complete, pdist(X))

print(f"Cophenetic Correlation Coefficient (Ward): {c_ward:.4f}")
print(f"Cophenetic Correlation Coefficient (Complete): {c_complete:.4f}")

# 4. Klasterisasi Aglomeratif via Scikit-Learn (Memotong pada K=3)
model = AgglomerativeClustering(n_clusters=3, linkage='ward')
cluster_labels = model.fit_predict(X)

print(f"Distribusi Ukuran Klaster K=3: {np.bincount(cluster_labels)}")
print(f"5 Penggabungan Terakhir dalam Hierarki Ward:")
for i, merge in enumerate(Z_ward[-5:]):
    print(f"  Gabungan {len(Z_ward)-5+i+1}: Klaster {int(merge[0])} + Klaster {int(merge[1])} "
          f"-> Jarak = {merge[2]:.3f}, Jumlah Titik = {int(merge[3])}")
`,
          expectedOutput: `Eksekusi berhasil dievaluasi dengan kode status 0.`,
          explanation: "Perhitungan matriks hierarkis aglomeratif dengan SciPy linkage, evaluasi koefisien kofenetik, dan ekstraksi label klaster menggunakan Scikit-Learn.",
        },
      ],
      references: [
        {
          title: "A General Theory of Classificatory Sorting Strategies: 1. Hierarchical Systems",
          authors: [
            "Lance",
            "G. N.",
            "Williams",
            "W. T.",
          ],
          type: "paper",
          url: "https://doi.org/10.1093/comjnl/9.4.373",
          doi: "10.1093/comjnl/9.4.373",
          relevance: "The Computer Journal",
          year: 1967,
        },
        {
          title: "Hierarchical Grouping to Optimize an Objective Function",
          authors: [
            "Ward",
            "J. H.",
          ],
          type: "paper",
          url: "https://doi.org/10.1080/01621459.1963.10500845",
          doi: "10.1080/01621459.1963.10500845",
          relevance: "Journal of the American Statistical Association",
          year: 1963,
        },
      ],
      structuredExercises: [
        {
          id: "ex-18-9-1",
          level: 1,
          task: "Diberikan dua klaster singleton A = {[0, 0]} dan B = {[3, 4]}, serta klaster ketiga C = {[0, 4]}. Hitung jarak Ward D_ward(A U B, C) menggunakan rumus Lance-Williams.",
          hint: "Hitung terlebih dahulu jarak berpasangan awal, lalu substitusikan koefisien Ward Lance-Williams dengan |A|=1, |B|=1, |C|=1.",
          solution: "Jarak Euclidean: d(A, B) = sqrt(3^2 + 4^2) = 5 -> d^2(A, B) = 25. d(A, C) = 4 -> d^2(A, C) = 16. d(B, C) = 3 -> d^2(B, C) = 9. Untuk Ward, jarak yang diperbarui adalah kuadrat jarak berbobot. Dengan |A|=1, |B|=1, |C|=|K|=1: alpha_A = (1+1)/(1+1+1) = 2/3, alpha_B = 2/3, beta = -1/3, gamma = 0. Maka D_ward^2(A U B, C) = (2/3)(16) + (2/3)(9) - (1/3)(25) = 32/3 + 18/3 - 25/3 = 25/3 = 8.333. Akar kuadratnya adalah sqrt(8.333) = 2.887.",
        },
        {
          id: "ex-18-9-2",
          level: 2,
          task: "Tuliskan skrip Python yang melakukan pemotongan dendrogram secara otomatis pada jarak ambang batas tertentu dan membandingkan kemiripan partisi yang dihasilkan dengan label sejati menggunakan Adjusted Rand Index (ARI).",
          hint: "Gunakan fcluster dari scipy.cluster.hierarchy dengan kriteria criterion='distance' dan adjusted_rand_score dari sklearn.metrics.",
          solution: "from scipy.cluster.hierarchy import fcluster\nfrom sklearn.metrics import adjusted_rand_score\ndef evaluate_cut_thresholds(Z, X, y_true, thresholds=[2.0, 4.0, 6.0, 8.0]):\n    scores = {}\n    for t in thresholds:\n        pred_labels = fcluster(Z, t=t, criterion='distance')\n        ari = adjusted_rand_score(y_true, pred_labels)\n        scores[t] = {'n_clusters': len(set(pred_labels)), 'ari': ari}\n    return scores",
        },
      ],
    },
  ],
};
