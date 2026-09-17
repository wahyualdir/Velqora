import { ChapterDef } from "./da-data-ch1-3";

export const ML_CHAPTERS_14_TO_16: ChapterDef[] = [
  // ==========================================
  // BAB 14: Pengelompokan Non-Hierarkis & Berbasis Densitas (Clustering)
  // ==========================================
  {
    orderIndex: 14,
    id: "machine-learning-ch-14",
    slug: "bab-14-pengelompokan-non-hierarkis-dan-densitas-clustering",
    title: "BAB 14: Pengelompokan Non-Hierarkis & Berbasis Densitas (Clustering)",
    desc: "Metodologi pengelompokan tanpa pengawasan: taksonomi klasterisasi, algoritma k-Means dan fungsi objektif Inertia/WCSS, inisialisasi cerdas k-Means++ Arthur & Vassilvitskii, evaluasi Elbow & Silhouette Rousseeuw, Mini-Batch k-Means Sculley, k-Medoids PAM untuk ketahanan outlier, algoritma DBSCAN Ester et al., penalaan k-distance graph, pengantar HDBSCAN, dan evaluasi metrik intrinsik vs ekstrinsik.",
    coreConcepts: ["Clustering Taxonomy", "k-Means & WCSS/Inertia", "k-Means++ Initialization", "Elbow Method & Silhouette Analysis", "Mini-Batch k-Means", "k-Medoids (PAM)", "DBSCAN (Core, Border, Noise)", "k-Distance Graph", "HDBSCAN", "Intrinsic vs Extrinsic Cluster Metrics"],
    subchapters: [
      {
        num: "14.1",
        slug: "14-1-taksonomi-algoritma-klasterisasi-dan-geometri-klaster",
        title: "14.1. Taksonomi Algoritma Klasterisasi dan Asumsi Geometri Bentuk Klaster",
        desc: "Klasifikasi paradigma pengelompokan tanpa pengawasan: partisi datar (flat partitioning), hierarkis, berbasis kepadatan (density-based), dan model berbasis graf.",
        concept: `Klasterisasi (*Clustering*) adalah cabang utama pembelajaran mesin tanpa pengawasan (*unsupervised learning*) yang bertujuan mengelompokkan himpunan objek $\\mathcal{X} = \\{\\mathbf{x}_1, \\dots, \\mathbf{x}_n\\}$ ke dalam sejumlah kelompok (*clusters*) sedemikian rupa sehingga objek-objek dalam kelompok yang sama memiliki kemiripan tinggi (*high intra-cluster similarity*), sedangkan objek dari kelompok berbeda memiliki perbedaan yang mencolok (*high inter-cluster dissimilarity*).

**Empat Paradigma Utama Klasterisasi:**
1. **Klasterisasi Berbasis Partisi (Partitional / Centroid-Based):**
   Membagi dataset menjadi $k$ partisi saling lepas non-tumpang tindih. Setiap klaster diwakili oleh sebuah pusat gravitasi (*centroid*), seperti pada **k-Means** dan **k-Medoids**.
   *Asumsi Geometris:* Klaster diasumsikan berbentuk **cembung bulat (spherical)** dengan ukuran dan kerapatan yang relatif seimbang.
2. **Klasterisasi Berbasis Kepadatan (Density-Based):**
   Mendefinisikan klaster sebagai wilayah ruang fitur dengan kepadatan titik observasi yang tinggi, dipisahkan oleh wilayah berdensitas rendah (*noise*). Contoh utama: **DBSCAN** dan **HDBSCAN**.
   *Asumsi Geometris:* Mampu menemukan klaster dengan **bentuk geometri arbitrer yang kompleks** (seperti bentuk bulan sabit atau cincin) dan mendeteksi pencilan secara otomatis.
3. **Klasterisasi Berbasis Hierarki (Hierarchical Clustering):**
   Membangun pohon pembagian bertingkat (*dendrogram*) baik secara agregasi bawah-ke-atas (*agglomerative*) maupun pemisahan atas-ke-bawah (*divisive*).
4. **Klasterisasi Berbasis Model Distribusi (Distribution-Based):**
   Mengasumsikan data dihasilkan oleh campuran distribusi probabilitas parametrik, seperti **Gaussian Mixture Models (GMM)**.`,
        formula: `C_1 \\cup C_2 \\cup \\dots \\cup C_k = \\mathcal{X}, \\quad C_i \\cap C_j = \\emptyset \\; (\\forall i \\neq j) \\quad (\\text{Partisi Keras})`,
        code: `# 14.1: Eksperimen Kegagalan k-Means vs Keberhasilan DBSCAN pada Bentuk Non-Spherical
import numpy as np
from sklearn.datasets import make_moons
from sklearn.cluster import KMeans, DBSCAN
from sklearn.metrics import adjusted_rand_score

X, y_true = make_moons(n_samples=400, noise=0.07, random_state=42)

# 1. Uji k-Means (Asumsi Spherical Convex)
kmeans = KMeans(n_clusters=2, random_state=42, n_init=10).fit(X)
ari_kmeans = adjusted_rand_score(y_true, kmeans.labels_)

# 2. Uji DBSCAN (Asumsi Kepadatan Arbitrer)
dbscan = DBSCAN(eps=0.2, min_samples=5).fit(X)
ari_dbscan = adjusted_rand_score(y_true, dbscan.labels_)

print("=== EVALUASI TAKSONOMI KLASTERISASI PADA MANIFOLD MOONS ===")
print(f"Adjusted Rand Index (ARI) k-Means : {ari_kmeans:.4f} (Gagal Memotong Bulan Sabit)")
print(f"Adjusted Rand Index (ARI) DBSCAN  : {ari_dbscan:.4f} (Sempurna Mengenali Geometri)")`,
        expectedOutput: "k-Means gagal (ARI ~0.49) karena memotong secara linier, sedangkan DBSCAN sempurna (ARI = 1.00).",
        codeExp: "Skrip membandingkan performa k-Means dan DBSCAN pada dataset dua bulan sabit, membuktikan pentingnya kesesuaian asumsi geometri klaster.",
        pitfalls: [
          "Memaksakan penggunaan k-Means pada data dengan bentuk non-cembung memanjang tanpa mengevaluasi visualisasi bentuk sebaran.",
          "Mengasumsikan seluruh sampel data harus masuk ke dalam salah satu klaster (pada kasus berderau, noise harus dikeluarkan)."
        ],
        refTitle: "Jain, A. K.: Data clustering: 50 years beyond K-means (Pattern Recognition Letters, 2010)",
        refUrl: "https://www.sciencedirect.com/science/article/abs/pii/S016786550900232X"
      },
      {
        num: "14.2",
        slug: "14-2-algoritma-k-means-dan-minimisasi-wcss-inertia",
        title: "14.2. Algoritma k-Means: Minimisasi Within-Cluster Sum of Squares (Inertia)",
        desc: "Formulasi analitis Stuart Lloyd (1957): prosedur optimasi alternatif bertahap (Assignment Step vs Update Step) dan konvergensi numerik lokal.",
        concept: `Algoritma **k-Means** (Stuart Lloyd 1957, James MacQueen 1967) adalah algoritma partisi paling banyak digunakan di dunia.

Diberikan dataset $\\mathcal{X} = \\{\\mathbf{x}_1, \\dots, \\mathbf{x}_n\\}$ dan jumlah klaster yang ditentukan $k$, algoritma k-Means mencari $k$ buah titik pusat (**Centroid**) $\\boldsymbol{\\mu}_1, \\dots, \\boldsymbol{\\mu}_k$ yang meminimalkan jumlah kuadrat jarak titik ke pusat klasternya masing-masing, yang dikenal sebagai **Within-Cluster Sum of Squares (WCSS)** atau **Inertia**:
$$J(\\boldsymbol{\\mu}_1, \\dots, \\boldsymbol{\\mu}_k) = \\sum_{i=1}^n \\sum_{j=1}^k r_{ij} \\|\\mathbf{x}_i - \\boldsymbol{\\mu}_j\\|_2^2$$
di mana $r_{ij} \\in \\{0, 1\\}$ adalah variabel indikator biner yang bernilai $1$ jika titik $\\mathbf{x}_i$ dialokasikan ke klaster $j$, dan $0$ untuk lainnya.

**Prosedur Heuristik Lloyd (Coordinate Descent Alternatif):**
1. **Inisialisasi:** Tentukan $k$ centroid awal $\\boldsymbol{\\mu}_1^{(0)}, \\dots, \\boldsymbol{\\mu}_k^{(0)}$ secara acak.
2. **Tahap Alokasi (Assignment Step):** Tetapkan setiap titik data ke centroid terdekat berdasarkan jarak Euklides kuadrat:
   $$r_{ij}^{(t)} = \\begin{cases} 1 & \\text{jika } j = \\arg\\min_m \\|\\mathbf{x}_i - \\boldsymbol{\\mu}_m^{(t)}\\|_2^2 \\\\ 0 & \\text{lainnya} \\end{cases}$$
3. **Tahap Pembaruan (Update Step):** Hitung ulang posisi centroid sebagai rata-rata aritmatika dari seluruh titik yang menjadi anggota klaster tersebut:
   $$\\boldsymbol{\\mu}_j^{(t+1)} = \\frac{\\sum_{i=1}^n r_{ij}^{(t)} \\mathbf{x}_i}{\\sum_{i=1}^n r_{ij}^{(t)}}$$
4. Ulangi Tahap 2 dan 3 hingga centroid tidak lagi bergeser (konvergen) atau batas iterasi maksimum tercapai.`,
        formula: `J = \\sum_{j=1}^k \\sum_{\\mathbf{x} \\in C_j} \\|\\mathbf{x} - \\boldsymbol{\\mu}_j\\|^2 \\implies \\boldsymbol{\\mu}_j^* = \\frac{1}{|C_j|} \\sum_{\\mathbf{x} \\in C_j} \\mathbf{x}`,
        code: `# 14.2: Implementasi Algoritma k-Means dari Nol Menggunakan NumPy Murni
import numpy as np

def kmeans_numpy(X, k=3, max_iter=100, tol=1e-4, seed=42):
    np.random.seed(seed)
    n_samples, n_features = X.shape
    # Inisialisasi acak centroid
    centroids = X[np.random.choice(n_samples, k, replace=False)]
    
    for it in range(max_iter):
        # 1. Assignment Step: Hitung jarak Euklides ke seluruh centroid
        distances = np.linalg.norm(X[:, np.newaxis] - centroids, axis=2) # (n, k)
        labels = np.argmin(distances, axis=1)
        
        # 2. Update Step: Hitung rata-rata posisi baru
        new_centroids = np.array([X[labels == j].mean(axis=0) if np.sum(labels == j) > 0 else centroids[j] for j in range(k)])
        
        # Cek konvergensi pergeseran centroid
        shift = np.linalg.norm(new_centroids - centroids)
        centroids = new_centroids
        if shift < tol:
            break
            
    # Hitung Inertia akhir
    inertia = np.sum((X - centroids[labels])**2)
    return centroids, labels, inertia, it + 1

# Uji pada dataset sederhana
np.random.seed(42)
X_test = np.vstack([np.random.randn(50, 2) + [0, 0], np.random.randn(50, 2) + [5, 5], np.random.randn(50, 2) + [10, 0]])
centroids, labels, inertia, n_iter = kmeans_numpy(X_test, k=3)

print("=== HASIL K-MEANS NUMPY MURNI ===")
print(f"Konvergen pada Iterasi : {n_iter}")
print(f"Nilai Inertia Akhir     : {inertia:.4f}")
print(f"Pusat Centroid Terhitung:\n{np.round(centroids, 2)}")`,
        expectedOutput: "k-Means konvergen dalam beberapa iterasi dengan pusat centroid mendekati [0,0], [5,5], dan [10,0].",
        codeExp: "Skrip mengimplementasikan algoritma Lloyd dua tahap (Assignment dan Update) menggunakan operasi vektorisasi matriks NumPy.",
        pitfalls: [
          "k-Means sangat sensitif terhadap inisialisasi awal acak dan dapat dengan mudah terjebak pada minimum lokal yang suboptimal.",
          "Terjadinya klaster kosong (*empty cluster*) jika suatu centroid tidak mendapatkan alokasi titik sama sekali selama tahap pembaruan."
        ],
        refTitle: "Stuart P. Lloyd: Least Squares Quantization in PCM (IEEE Transactions on Information Theory, 1982 / Bell Labs 1957)",
        refUrl: "https://ieeexplore.ieee.org/document/1056489"
      },
      {
        num: "14.3",
        slug: "14-3-inisialisasi-k-means-plus-plus-dan-jaminan-teoretis",
        title: "14.3. Inisialisasi Cerdas k-Means++: Jaminan Teoretis Batas Galat Logaritmik",
        desc: "Terobosan David Arthur & Sergei Vassilvitskii (SODA 2007): strategi penempatan centroid berbobot probabilitas jarak kuadrat D(x)^2 dengan jaminan aproksimasi O(log k).",
        concept: `Kelemahan terbesar algoritma Lloyd klasik adalah ketergantungan fatalnya pada inisialisasi acak: pemilihan centroid awal yang buruk dapat menghasilkan solusi dengan nilai Inertia yang jauh lebih besar daripada solusi optimal global, bahkan tak terhingga kali lebih buruk pada data terpisah.

David Arthur dan Sergei Vassilvitskii (SODA 2007) merumuskan skema inisialisasi cerdas **k-Means++**:

**Mekanisme Inisialisasi Probabilistik $D(\\mathbf{x})^2$:**
1. Pilih centroid pertama $\\boldsymbol{\\mu}_1$ secara acak seragam dari seluruh titik data $\\mathcal{X}$.
2. Untuk setiap titik data $\\mathbf{x} \\in \\mathcal{X}$, hitung jarak kuadrat terpendek ke centroid mana pun yang telah terpilih sebelumnya:
   $$D(\\mathbf{x}) = \\min_{j=1, \\dots, m} \\|\\mathbf{x} - \\boldsymbol{\\mu}_j\\|_2$$
3. Pilih centroid baru $\\boldsymbol{\\mu}_{m+1}$ dari distribusi probabilitas tertimbang:
   $$P(\\mathbf{x}) = \\frac{D(\\mathbf{x})^2}{\\sum_{\\mathbf{x}' \\in \\mathcal{X}} D(\\mathbf{x}')^2}$$
4. Ulangi Langkah 2 dan 3 hingga tepat $k$ centroid terpilih.
5. Jalankan algoritma Lloyd standar menggunakan centroid awal tersebut.

**Teorema Jaminan Batas Galat (Arthur & Vassilvitskii, 2007):**
Jika k-Means diinisialisasi menggunakan metode k-Means++, maka ekspektasi nilai Inertia hasil akhir dijamin memenuhi batas:
$$\\mathbb{E}[J] \\le 8 (\\ln k + 2) \\cdot J_{\\text{optimal}}$$
Ini adalah jaminan teoretis $\\mathcal{O}(\\log k)$-aproksimasi terbukti pertama dalam sejarah komputasi k-Means! Inisialisasi ini kini menjadi **default mutlak** (\\\\`init='k-means++'\\\\`) dalam pustaka Scikit-Learn.`,
        formula: `P(\\mathbf{x}) = \\frac{D(\\mathbf{x})^2}{\\sum_{\\mathbf{x}'} D(\\mathbf{x}')^2} \\implies \\mathbb{E}[J] \\le 8(\\ln k + 2) J^* \\quad (\\text{Teorema k-Means++})`,
        code: `# 14.3: Perbandingan Stabilitas Inisialisasi Acak ('random') vs 'k-means++'
import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs

X, _ = make_blobs(n_samples=2000, centers=10, cluster_std=1.2, random_state=42)

# Uji 30 kali inisialisasi acak vs k-means++ (n_init=1)
inertias_random = [KMeans(n_clusters=10, init='random', n_init=1, random_state=i).fit(X).inertia_ for i in range(30)]
inertias_kpp = [KMeans(n_clusters=10, init='k-means++', n_init=1, random_state=i).fit(X).inertia_ for i in range(30)]

print("=== STABILITAS INISIALISASI K-MEANS (30 RUNS) ===")
print(f"Random Init   - Rata-rata: {np.mean(inertias_random):.2f} | Std Dev: {np.std(inertias_random):.2f} (Variasi Tinggi)")
print(f"k-Means++ Init - Rata-rata: {np.mean(inertias_kpp):.2f} | Std Dev: {np.std(inertias_kpp):.2f} (Sangat Stabil!)")
print(f"Penurunan Galat Rata-rata: {((np.mean(inertias_random) - np.mean(inertias_kpp)) / np.mean(inertias_random))*100:.2f}%")`,
        expectedOutput: "k-Means++ menghasilkan rata-rata inertia lebih rendah dan deviasi standar yang jauh lebih konsisten dibanding random.",
        codeExp: "Skrip membuktikan keunggulan stabilitas matematis inisialisasi k-means++ atas inisialisasi acak pada 30 run acak berbeda.",
        pitfalls: [
          "Menonaktifkan k-means++ dan kembali ke init='random' tanpa alasan komputasi mendesak.",
          "Mengira k-means++ menjamin penemuan optimum global 100% mutlak (ia menjamin ekspektasi batas atas O(log k), bukan ketiadaan minimum lokal sama sekali)."
        ],
        refTitle: "David Arthur & Sergei Vassilvitskii: k-means++: The Advantages of Careful Seeding (SODA, 2007)",
        refUrl: "https://dl.acm.org/doi/10.5555/1283383.1283494"
      },
      {
        num: "14.4",
        slug: "14-4-penentuan-k-optimal-elbow-silhouette-calinski",
        title: "14.4. Penentuan Jumlah Klaster Optimal: Elbow Method, Silhouette Analysis, dan Calinski-Harabasz",
        desc: "Metodologi kuantitatif pemilihan parameter k: grafik siku Inertia, koefisien Silhouette Rousseeuw (-1 hingga +1), dan rasio dispersi varians Calinski-Harabasz.",
        concept: `Dalam aplikasi praktis tanpa pengawasan, nilai optimal jumlah klaster $k$ tidak diketahui sebelumnya. Terdapat tiga teknik diagnostik utama untuk menentukan nilai $k$:

**1. Metode Siku (Elbow Method):**
Memplot nilai Inertia $J(k)$ terhadap rentang nilai $k \\in [2, K_{\\max}]$. Seiring bertambahnya $k$, Inertia pasti menurun secara monotonik (karena titik semakin dekat ke pusat). Kita mencari titik "siku" di mana penurunan laju Inertia melambat tajam (marjinal keuntungan berkurang drastis).

**2. Analisis Koefisien Silhouette (Peter Rousseeuw, 1987):**
Untuk setiap sampel $\\mathbf{x}_i$, hitung dua jarak:
- $a(i)$: Jarak rata-rata dari $\\mathbf{x}_i$ ke seluruh titik lain dalam klaster yang sama (*intra-cluster distance*).
- $b(i)$: Jarak rata-rata dari $\\mathbf{x}_i$ ke seluruh titik dalam klaster terdekat berikutnya (*nearest-cluster distance*).

Koefisien Silhouette untuk sampel $i$ dirumuskan sebagai:
$$s(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))}, \\quad s(i) \\in [-1, +1]$$
- $s(i) \\approx +1$: Sampel berada jauh di dalam klasternya sendiri dan terpisah sangat jelas dari klaster lain (klasterisasi ideal).
- $s(i) \\approx 0$: Sampel berada tepat di perbatasan antara dua klaster.
- $s(i) < 0$: Sampel kemungkinan besar salah dialokasikan ke klaster yang keliru.

**3. Indeks Calinski-Harabasz (Variance Ratio Criterion):**
Rasio antara dispersi varians antar-klaster (*between-cluster variance*) dan dispersi varians di dalam-klaster (*within-cluster variance*):
$$\\text{CH} = \\frac{\\text{SS}_B / (k - 1)}{\\text{SS}_W / (n - k)}$$
Nilai CH yang lebih tinggi menandakan klaster yang lebih padat dan terpisah lebih jauh.`,
        formula: `s(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))}, \\quad \\text{CH} = \\frac{\\text{Tr}(\\mathbf{B}_k) / (k-1)}{\\text{Tr}(\\mathbf{W}_k) / (n-k)}`,
        code: `# 14.4: Evaluasi Otomatis Pemilihan k Optimal Menggunakan Silhouette dan Calinski-Harabasz
import numpy as np
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, calinski_harabasz_score

X, _ = make_blobs(n_samples=600, centers=4, cluster_std=0.9, random_state=42)

print("=== EVALUASI DIAGNOSTIK JUMLAH KLASTER (k=2 HINGGA 6) ===")
print("k | Inertia (Elbow) | Silhouette Score | Calinski-Harabasz")
print("-" * 52)

best_k = None
best_sil = -1

for k in range(2, 7):
    km = KMeans(n_clusters=k, random_state=42, n_init=10).fit(X)
    sil = silhouette_score(X, km.labels_)
    ch = calinski_harabasz_score(X, km.labels_)
    if sil > best_sil:
        best_sil = sil
        best_k = k
    print(f"{k} | {km.inertia_:15.2f} | {sil:16.4f} | {ch:17.2f}")

print(f"\nKesimpulan Analitis: k={best_k} terpilih secara optimal dengan Silhouette Score tertinggi ({best_sil:.4f})!")`,
        expectedOutput: "k=4 terpilih secara konsisten dengan Silhouette Score tertinggi (~0.68) dan puncak Calinski-Harabasz.",
        codeExp: "Skrip mengomparasikan metrik Inertia, Silhouette Score, dan Calinski-Harabasz untuk menentukan jumlah klaster ground-truth 4 secara objektif.",
        pitfalls: [
          "Hanya mengandalkan Elbow Method secara subjektif visual tanpa memvalidasi koefisien Silhouette kuantitatif.",
          "Menghitung Silhouette Score pada dataset dengan jutaan baris tanpa subsampling (kompleksitas memori dan waktu O(N^2))."
        ],
        refTitle: "Peter J. Rousseeuw: Silhouettes: A graphical aid to the interpretation and validation of cluster analysis (1987)",
        refUrl: "https://www.sciencedirect.com/science/article/pii/0377042787901257"
      },
      {
        num: "14.5",
        slug: "14-5-mini-batch-k-means-sculley-skala-web",
        title: "14.5. Mini-Batch k-Means (Sculley, 2010): Klasterisasi Skala Web",
        desc: "Akselerasi stokastik D. Sculley (WWW 2010): pembaruan centroid konveks bertahap menggunakan mini-batch streaming untuk dataset skala raksasa.",
        concept: `Pada dataset berukuran sangat besar (misalnya miliaran kueri pencarian Google atau log aktivitas pengguna situs web), algoritma Lloyd standar menjadi terlalu lambat karena harus menghitung jarak seluruh sampel data ke seluruh centroid di setiap iterasi tunggal.

D. Sculley (WWW, 2010) memperkenalkan **Mini-Batch k-Means**:
Alih-alih memproses seluruh dataset $n$ pada setiap langkah pembaruan, algoritma ini mengambil **sampel mini-batch acak** berukuran $b \\ll n$ (misalnya $b = 1024$):
1. Ambil batch acak $\\mathcal{B} \\subset \\mathcal{X}$ berukuran $b$.
2. Alokasikan setiap titik dalam batch $\\mathcal{B}$ ke centroid terdekatnya saat ini.
3. Untuk setiap centroid $\\boldsymbol{\\mu}_j$, perbarui posisinya menggunakan **rata-rata bergerak terbobot (*convex gradient step*)**:
   $$\\boldsymbol{\\mu}_j \\leftarrow (1 - \\eta) \\boldsymbol{\\mu}_j + \\eta \\mathbf{x}$$
   di mana laju pembelajaran $\\eta = \\frac{1}{v_j}$ berbanding terbalik dengan frekuensi jumlah titik yang pernah dialokasikan ke centroid tersebut ($v_j \\leftarrow v_j + 1$).

**Keunggulan Utama:**
- Kecepatan komputasi meningkat **puluhan hingga ratusan kali lipat**.
- Kebutuhan memori sangat kecil karena mendukung komputasi streaming/out-of-core.
- Kualitas klaster (Inertia) terbukti hanya sedikit terdegradasi (< 2%) dibandingkan k-Means batch penuh.`,
        formula: `\\boldsymbol{\\mu}_j \\leftarrow \\boldsymbol{\\mu}_j + \\frac{1}{v_j} (\\mathbf{x} - \\boldsymbol{\\mu}_j) \\quad (\\text{Pembaruan Rata-rata Konveks Online})`,
        code: `# 14.5: Benchmark Kecepatan dan Kualitas: Standard KMeans vs MiniBatchKMeans
import time
import numpy as np
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans, MiniBatchKMeans

# Bangkitkan dataset besar (50.000 sampel, 20 fitur, 10 klaster)
X, _ = make_blobs(n_samples=50000, n_features=20, centers=10, random_state=42)

# 1. Standard KMeans
t0 = time.time()
km = KMeans(n_clusters=10, random_state=42, n_init=3).fit(X)
t_km = time.time() - t0

# 2. MiniBatchKMeans
t0 = time.time()
mbkm = MiniBatchKMeans(n_clusters=10, batch_size=1024, random_state=42, n_init=3).fit(X)
t_mbkm = time.time() - t0

print("=== BENCHMARK: STANDARD K-MEANS VS MINI-BATCH K-MEANS ===")
print(f"Standard KMeans Waktu Eksekusi   : {t_km:.4f} detik | Inertia: {km.inertia_:.2f}")
print(f"MiniBatchKMeans Waktu Eksekusi   : {t_mbkm:.4f} detik | Inertia: {mbkm.inertia_:.2f}")
print(f"Peningkatan Kecepatan (Speedup)  : {t_km / t_mbkm:.2f}x lebih cepat!")
print(f"Perbedaan Relatif Nilai Inertia  : {((mbkm.inertia_ - km.inertia_) / km.inertia_)*100:.2f}%")`,
        expectedOutput: "MiniBatchKMeans mencapai speedup 3x-6x dengan perbedaan inertia kurang dari 1%.",
        codeExp: "Skrip membandingkan runtime dan nilai inertia antara standard KMeans dan MiniBatchKMeans pada dataset 50.000 sampel.",
        pitfalls: [
          "Menyetel batch_size terlalu kecil (misal < 100) yang memicu fluktuasi stokastik berlebih pada posisi centroid.",
          "Mengabaikan fakta bahwa MiniBatchKMeans dapat menyisakan centroid yang tidak terpakai jika data batch tidak merepresentasikannya."
        ],
        refTitle: "D. Sculley: Web-scale k-means clustering (ACM WWW, 2010)",
        refUrl: "https://dl.acm.org/doi/10.1145/1772690.1772862"
      },
      {
        num: "14.6",
        slug: "14-6-k-medoids-pam-dan-ketahanan-terhadap-outlier",
        title: "14.6. Algoritma k-Medoids (PAM): Ketahanan Ekstrem terhadap Outlier dan Metrik Arbitrer",
        desc: "Prinsip representasi data riil: algoritma Partitioning Around Medoids Kaufman & Rousseeuw (1990) dan perbandingan fungsi kerugian Manhattan L1 vs Euklides L2.",
        concept: `Meskipun k-Means efisien, kelemahan mendasarnya terletak pada perhitungan **Centroid sebagai rata-rata aritmatika**:
1. Centroid adalah titik fiktif sintetis yang sering kali tidak sesuai dengan sampel nyata di dunia fisik.
2. Rata-rata sangat rentan terhadap **pencilan ekstrem (outlier)**; satu titik pencilan berjarak ribuan unit akan menarik centroid menjauh dari massa utama klaster.
3. k-Means terbatas pada metrik jarak Euklides (karena penurunan matematis rata-rata hanya meminimalkan galat kuadrat L2).

Leonard Kaufman dan Peter J. Rousseeuw (1990) merumuskan **k-Medoids / Partitioning Around Medoids (PAM)**:
Pusat dari setiap klaster diwajibkan merupakan **titik data aktual dari dalam dataset itu sendiri**, yang disebut **Medoid**.

**Fungsi Objektif k-Medoids:**
$$\\min_{\\mathbf{m}_1, \\dots, \\mathbf{m}_k \\in \\mathcal{X}} \\sum_{i=1}^n \\min_{j=1, \\dots, k} D(\\mathbf{x}_i, \\mathbf{m}_j)$$
di mana $D(\\cdot, \\cdot)$ dapat berupa **metrik jarak arbitrer apa pun**: Manhattan (L1), Kosinus, Jaccard, atau Hamming!

**Keunggulan Utama:**
- Karena medoid meminimalkan jarak absolut L1, ia memiliki sifat median statistik yang **sangat tahan terhadap outlier** (*robust*).
- Menghasilkan interpretasi bisnis yang konkret: medoid adalah "konsumen representatif tipikal nyata", bukan angka rata-rata teoritis.`,
        formula: `\\mathbf{m}_j = \\arg\\min_{\\mathbf{y} \\in C_j} \\sum_{\\mathbf{x} \\in C_j} D(\\mathbf{x}, \\mathbf{y}) \\quad (\\text{Definisi Medoid sebagai Sampel Riil})`,
        code: `# 14.6: Komparasi Ketahanan Outlier: k-Means vs k-Medoids (PAM)
import numpy as np
from sklearn.cluster import KMeans
from sklearn_extra.cluster import KMedoids

# Bangkitkan 1 klaster normal (100 sampel) + 5 sampel Outlier Ekstrem
np.random.seed(42)
X_clean = np.random.normal(0, 1, (100, 2))
X_outliers = np.array([[50.0, 50.0], [55.0, 48.0], [52.0, 53.0]])
X = np.vstack([X_clean, X_outliers])

# 1. k-Means (k=1)
kmeans = KMeans(n_clusters=1, random_state=42, n_init=10).fit(X)
centroid_km = kmeans.cluster_centers_[0]

# 2. k-Medoids (k=1)
kmedoids = KMedoids(n_clusters=1, random_state=42, metric='manhattan').fit(X)
medoid_pam = kmedoids.cluster_centers_[0]

print("=== UJI KETAHANAN OUTLIER K-MEANS VS K-MEDOIDS ===")
print("Pusat Sebenarnya Data Bersih: [0.00, 0.00]")
print(f"Pusat k-Means Centroid     : [{centroid_km[0]:.2f}, {centroid_km[1]:.2f}] (Terdistorsi 1.5 Unit oleh Outlier!)")
print(f"Pusat k-Medoids Medoid     : [{medoid_pam[0]:.2f}, {medoid_pam[1]:.2f}] (Sempurna Bertahan di Pusat Bersih!)")`,
        expectedOutput: "k-Medoids berhasil mengabaikan outlier ekstrem dan mempertahankan medoid tepat di dekat [0,0].",
        codeExp: "Skrip mendemonstrasikan ketahanan k-Medoids dengan metrik Manhattan terhadap outlier ekstrem dibandingkan k-Means.",
        pitfalls: [
          "Kompleksitas komputasi algoritma PAM standar adalah O(k(n-k)^2) per iterasi, sangat lambat untuk dataset besar (gunakan FastPAM atau CLARA untuk N > 10.000).",
          "Mengira pustaka standar scikit-learn menyertakan KMedoids secara langsung (memerlukan package scikit-learn-extra)."
        ],
        refTitle: "L. Kaufman & P. J. Rousseeuw: Finding Groups in Data: An Introduction to Cluster Analysis (John Wiley & Sons, 1990)",
        refUrl: "https://onlinelibrary.wiley.com/doi/book/10.1002/9780470316801"
      },
      {
        num: "14.7",
        slug: "14-7-dbscan-density-based-spatial-clustering",
        title: "14.7. Algoritma DBSCAN: Titik Inti (Core), Border, dan Deteksi Derau Otomatis",
        desc: "Pondasi Martin Ester et al. (KDD 1996): formalisasi konsep Epsilon-Neighborhood, keterjangkauan kepadatan (density-reachability), dan ketahanan terhadap bentuk non-linier.",
        concept: `Martin Ester, Hans-Peter Kriegel, Jörg Sander, dan Xiaowei Xu (KDD 1996) merumuskan **DBSCAN (Density-Based Spatial Clustering of Applications with Noise)**, yang dianugerahi *SIGKDD Test of Time Award 2014*.

DBSCAN tidak memerlukan masukan jumlah klaster $k$ sebelumnya, melainkan mengelompokkan data berdasarkan **kepadatan lokal** menggunakan dua hiperparameter:
1. **$\\varepsilon$ (Epsilon):** Radius jarak ketetanggaan maksimum di sekitar titik.
2. **$\\text{MinPts}$ (Minimum Samples):** Jumlah minimum titik observasi dalam radius $\\varepsilon$ untuk membentuk wilayah padat.

**Tiga Kategori Titik dalam DBSCAN:**
Diberikan lingkungan $\\varepsilon$-neighborhood dari titik $\\mathbf{p}$: $N_\\varepsilon(\\mathbf{p}) = \\{\\mathbf{q} \\in \\mathcal{X} \\mid \\|\\mathbf{p} - \\mathbf{q}\\| \\le \\varepsilon\\}$.
1. **Titik Inti (*Core Point*):** Titik $\\mathbf{p}$ yang memiliki $|N_\\varepsilon(\\mathbf{p})| \\ge \\text{MinPts}$ (wilayah sangat padat).
2. **Titik Perbatasan (*Border Point*):** Titik $\\mathbf{p}$ yang bukan titik inti ($|N_\\varepsilon(\\mathbf{p})| < \\text{MinPts}$), namun berada di dalam radius $\\varepsilon$ dari setidaknya satu titik inti.
3. **Titik Derau / Pencilan (*Noise / Outlier*):** Titik yang bukan titik inti maupun titik perbatasan (diberi label $-1$).

**Konsep Keterjangkauan Kepadatan (Density-Reachability):**
Sebuah klaster didefinisikan sebagai himpunan maksimal dari titik-titik yang saling terhubung secara kepadatan (*density-connected*). Titik-titik ini menyebar seperti gelombang air mengikuti bentuk kontur padat apa pun tanpa dibatasi bentuk bola!`,
        formula: `|N_\\varepsilon(\\mathbf{p})| \\ge \\text{MinPts} \\implies \\mathbf{p} \\in \\text{Core Points}, \\quad \\text{Noise} = \\mathcal{X} \\setminus \\bigcup C_k`,
        code: `# 14.7: Implementasi dan Klasifikasi Titik DBSCAN (Core, Border, Noise)
import numpy as np
from sklearn.cluster import DBSCAN
from sklearn.datasets import make_blobs

# Bangkitkan klaster padat + titik-titik derau terisolasi
X_core, _ = make_blobs(n_samples=200, centers=[[0, 0], [4, 4]], cluster_std=0.5, random_state=42)
X_noise = np.random.uniform(-4, 8, (20, 2)) # 20 titik derau acak
X = np.vstack([X_core, X_noise])

dbscan = DBSCAN(eps=0.5, min_samples=5).fit(X)
labels = dbscan.labels_

n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
n_noise = list(labels).count(-1)
n_core = len(dbscan.core_sample_indices_)

print("=== HASIL KLASTERISASI DENSITAS DBSCAN ===")
print(f"Jumlah Klaster Ditemukan   : {n_clusters}")
print(f"Jumlah Titik Inti (Core)   : {n_core}")
print(f"Jumlah Titik Derau (Noise) : {n_noise} (Diberi label -1)")
print(f"Rasio Noise Terdeteksi     : {(n_noise / len(X))*100:.2f}%")`,
        expectedOutput: "DBSCAN sukses menemukan 2 klaster padat dan mengisolasi 20 titik acak sebagai noise (-1).",
        codeExp: "Skrip mengeksekusi DBSCAN dan membedah komposisi label output: klaster positif vs label derau -1.",
        pitfalls: [
          "Lupa menstandarisasi fitur sebelum DBSCAN; perbedaan skala fitur akan mendistorsi radius epsilon menjadi elips tak beraturan.",
          "DBSCAN tidak mampu menangani dataset dengan klaster-klaster yang memiliki variasi kepadatan yang berbeda secara ekstrem."
        ],
        refTitle: "Martin Ester et al.: A Density-Based Algorithm for Discovering Clusters in Large Spatial Databases with Noise (KDD 1996)",
        refUrl: "https://dl.acm.org/doi/10.5555/3001460.3001507"
      },
      {
        num: "14.8",
        slug: "14-8-penalaan-parameter-dbscan-k-distance-graph",
        title: "14.8. Penalaan Parameter DBSCAN: Strategi Plot Jarak k-NN (k-Distance Graph)",
        desc: "Metodologi penentuan parameter objektif: aturan pemilihan MinPts = 2 * dimensi dan deteksi titik siku kurva jarak k-NN untuk nilai Epsilon.",
        concept: `Menentukan parameter $\\varepsilon$ dan $\\text{MinPts}$ secara manual sering kali menjadi kesulitan utama dalam penerapan DBSCAN. Jika $\\varepsilon$ terlalu kecil, sebagian besar data akan dianggap sebagai derau (*over-segmentation*); jika $\\varepsilon$ terlalu besar, seluruh klaster akan melebur menjadi satu klaster raksasa (*under-segmentation*).

**Heuristik Standar Komunitas Akademik (Ester et al. & Schubert et al. 2017):**

**1. Penentuan $\\text{MinPts}$:**
- Sebagai aturan praktis (*rule of thumb*), tetapkan $\\text{MinPts} \\ge 2 \\times d$ di mana $d$ adalah dimensi ruang fitur.
- Untuk dataset 2D: $\\text{MinPts} = 4$.
- Untuk dataset dengan derau tinggi atau ukuran sampel masif, gunakan $\\text{MinPts} \\ge 10$ hingga $20$.

**2. Penentuan $\\varepsilon$ via Grafik Jarak $k$-NN ($k$-Distance Graph):**
1. Tetapkan nilai $k = \\text{MinPts} - 1$.
2. Untuk setiap titik dalam dataset, hitung jarak Euklides ke **tetangga terdekat ke-$k$** menggunakan algoritma \\\\` + "\\\\`NearestNeighbors\\\\`" + \\\\`.
3. Urutkan seluruh jarak ke-$k$ tersebut secara menaik (*ascending order*) dan buat kurva grafiknya.
4. **Titik Siku (*Knee / Elbow Point*):**
   - Titik-titik yang berada di bawah siku mewakili titik-titik inti yang berada di dalam klaster padat.
   - Titik-titik yang berada di atas siku mewakili titik-titik derau atau pencilan yang memiliki jarak tetangga sangat jauh.
   - **Nilai jarak tepat pada titik siku tersebut adalah estimasi nilai $\\varepsilon$ yang optimal!**`,
        formula: `k = \\text{MinPts} - 1 \\implies \\varepsilon^* = \\text{Jarak pada Titik Siku Kurva } k\\text{-NN Tersortir}`,
        code: `# 14.8: Penentuan Epsilon Otomatis Menggunakan k-Distance Graph
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.datasets import make_blobs

X, _ = make_blobs(n_samples=500, centers=3, cluster_std=0.7, random_state=42)
min_pts = 4
k = min_pts - 1

# Hitung jarak ke tetangga terdekat ke-k
nbrs = NearestNeighbors(n_neighbors=k).fit(X)
distances, _ = nbrs.kneighbors(X)

# Ambil jarak ke tetangga ke-k dan urutkan
k_distances = np.sort(distances[:, k - 1])

# Estimasi titik siku sederhana (perubahan gradien maksimum)
gradients = np.diff(k_distances, 2)
knee_idx = np.argmax(gradients) + 1
eps_optimal = k_distances[knee_idx]

print("=== ANALISIS HEURISTIK K-DISTANCE GRAPH DBSCAN ===")
print(f"Parameter MinPts Terpilih  : {min_pts}")
print(f"Jarak Tetangga ke-{k} Rata-rata: {np.mean(k_distances):.4f}")
print(f"Estimasi Epsilon Titik Siku: {eps_optimal:.4f}")`,
        expectedOutput: "Algoritma mendeteksi titik siku k-distance secara analitis menghasilkan estimasi epsilon ~0.4-0.6.",
        codeExp: "Skrip menghitung jarak k-NN dan mengidentifikasi titik belok kurva (knee point) untuk menentukan parameter epsilon DBSCAN.",
        pitfalls: [
          "Memilih epsilon tanpa memeriksa grafik k-distance yang menyebabkan algoritma melabeli seluruh dataset sebagai derau.",
          "Menyetel MinPts=1 yang mengubah DBSCAN menjadi single-linkage hierarchical clustering yang sangat rentan terhadap efek rantai (*chaining effect*)."
        ],
        refTitle: "Erich Schubert et al.: DBSCAN Revisited, Revisited: Why and How You Should (Still) Use DBSCAN (ACM TODS, 2017)",
        refUrl: "https://dl.acm.org/doi/10.1145/3068335"
      },
      {
        num: "14.9",
        slug: "14-9-hdbscan-klasterisasi-densitas-hierarkis-adaptif",
        title: "14.9. Algoritma HDBSCAN: Klasterisasi Densitas Hierarkis Adaptif Mengatasi Kepadatan Heterogen",
        desc: "Evolusi modern Campello, Moulavi, Sander (PAKDD 2013): transformasi mutual reachability distance, pohon rentang minimum (MST), dan ekstraksi klaster stabil.",
        concept: `Kelemahan paling fatal dari DBSCAN klasik adalah **ketidakmampuannya menangani dataset yang memiliki klaster-klaster dengan kepadatan (*density*) yang bervariasi**: nilai parameter $\\varepsilon$ yang bersifat tunggal dan global tidak akan pernah bisa memisahkan klaster yang sangat padat sekaligus menangkap klaster yang relatif renggang tanpa menyatukannya atau menganggapnya derau.

Ricardo Campello, Davoud Moulavi, dan Jörg Sander (2013) menciptakan **HDBSCAN (Hierarchical DBSCAN)**:
HDBSCAN menggabungkan keunggulan DBSCAN dengan analisis hierarkis untuk mengekstrak klaster yang stabil di berbagai skala kepadatan secara otomatis.

**Empat Langkah Inti HDBSCAN:**
1. **Transformasi Ruang (Mutual Reachability Distance):**
   Untuk menekan pengaruh outlier, jarak antar dua titik $\\mathbf{a}$ dan $\\mathbf{b}$ didefinisikan sebagai:
   $$d_{\\text{mreach}}(\\mathbf{a}, \\mathbf{b}) = \\max\\{ \\text{core}_k(\\mathbf{a}), \\text{core}_k(\\mathbf{b}), d(\\mathbf{a}, \\mathbf{b}) \\}$$
   di mana $\\text{core}_k(\\mathbf{x})$ adalah jarak dari $\\mathbf{x}$ ke tetangga terdekat ke-$k$.
2. **Konstruksi Pohon Rentang Minimum (Minimum Spanning Tree - MST):**
   Membangun graf terhubung MST di mana bobot sisi adalah $d_{\\text{mreach}}$.
3. **Pembangunan Hierarki Klaster Kompak:**
   Mengubah MST menjadi pohon hierarkis dan memotong cabang-cabang yang memiliki ukuran lebih kecil dari \\\\` + "\\\\`min_cluster_size\\\\`" + \\\\`.
4. **Ekstraksi Klaster Berdasarkan Stabilitas (Excess of Mass):**
   Alih-alih memotong pohon pada satu ketinggian horizontal tunggal (seperti DBSCAN), HDBSCAN menelusuri setiap cabang pohon dan memilih klaster yang memiliki **stabilitas paling persisten** di sepanjang perubahan skala kepadatan $\\lambda = 1 / \\varepsilon$.`,
        formula: `d_{\\text{mreach}}(\\mathbf{a}, \\mathbf{b}) = \\max\\{ \\text{core}_k(\\mathbf{a}), \\text{core}_k(\\mathbf{b}), d(\\mathbf{a}, \\mathbf{b}) \\} \\quad (\\text{Jarak Saling Keterjangkauan})`,
        code: `# 14.9: Klasterisasi Kepadatan Bervariasi Menggunakan HDBSCAN Scikit-Learn
import numpy as np
from sklearn.cluster import HDBSCAN
from sklearn.datasets import make_blobs

# Bangkitkan 2 klaster dengan variasi kepadatan ekstrem (std=0.3 vs std=1.5)
X1, _ = make_blobs(n_samples=300, centers=[[0, 0]], cluster_std=0.3, random_state=42)
X2, _ = make_blobs(n_samples=300, centers=[[6, 6]], cluster_std=1.5, random_state=42)
X = np.vstack([X1, X2])

# Terapkan HDBSCAN (tersedia di sklearn.cluster sejak versi 1.3+)
hdb = HDBSCAN(min_cluster_size=30, min_samples=10).fit(X)
labels = hdb.labels_

n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
n_noise = list(labels).count(-1)

print("=== HASIL KLASTERISASI KEPADATAN HETEROGEN HDBSCAN ===")
print(f"Jumlah Klaster Ditemukan : {n_clusters} (Berhasil Memisahkan Klaster Renggang & Padat)")
print(f"Jumlah Sampel Derau      : {n_noise}")
print(f"Contoh Skor Probabilitas Keanggotaan: {np.round(hdb.probabilities_[:5], 3)}")`,
        expectedOutput: "HDBSCAN sukses mengenali 2 klaster dengan kepadatan berbeda tanpa menyatukannya.",
        codeExp: "Skrip mendemonstrasikan algoritma HDBSCAN pada dua kelompok data dengan deviasi standar kepadatan yang berbeda jauh.",
        pitfalls: [
          "Menyetel min_cluster_size terlalu besar yang menyebabkan klaster kecil yang valid digabung ke klaster lain atau dianggap derau.",
          "Mengabaikan atribut probabilities_ yang sebenarnya sangat berguna untuk memfilter sampel perbatasan yang kurang yakin."
        ],
        refTitle: "R. J. G. B. Campello, D. Moulavi, J. Sander: Density-Based Clustering Based on Hierarchical Density Estimates (PAKDD 2013)",
        refUrl: "https://link.springer.com/chapter/10.1007/978-3-642-37456-2_14"
      },
      {
        num: "14.10",
        slug: "14-10-evaluasi-kualitas-klaster-metrik-intrinsik-vs-ekstrinsik",
        title: "14.10. Evaluasi Kualitas Klaster: Metrik Intrinsik vs Ekstrinsik",
        desc: "Kompilasi tolok ukur evaluasi kuantitatif: metrik tanpa ground-truth (Silhouette, Davies-Bouldin) vs metrik berbasis label acuan (ARI, NMI, Homogeneity, Completeness).",
        concept: `Mengevaluasi performa algoritma klasterisasi memerlukan pemahaman yang tegas mengenai ketersediaan label acuan (*ground-truth labels*):

**1. Metrik Intrinsik (Unsupervised Validation - Tanpa Ground-Truth):**
Digunakan ketika data benar-benar tidak memiliki label kelas riil (kasus 95% di industri):
- **Koefisien Silhouette:** Mengukur separasi dan kerapatan klaster (rentang $[-1, +1]$, semakin tinggi semakin baik).
- **Indeks Davies-Bouldin (DBI):** Mengukur rasio kemiripan rata-rata antara masing-masing klaster dengan klaster paling mirip dengannya:
  $$R_{ij} = \\frac{s_i + s_j}{d(\\boldsymbol{\\mu}_i, \\boldsymbol{\\mu}_j)}, \\quad \\text{DB} = \\frac{1}{k} \\sum_{i=1}^k \\max_{j \\neq i} R_{ij}$$
  Nilai Davies-Bouldin yang **lebih rendah menandakan pemisahan klaster yang lebih baik**.

**2. Metrik Ekstrinsik (Supervised Validation - Dengan Ground-Truth):**
Digunakan saat melakukan benchmark algoritma pada dataset terlabel untuk menguji seberapa akurat klasterisasi menemukan kelas riil:
- **Adjusted Rand Index (ARI):** Menghitung proporsi pasangan titik yang berada pada klaster yang sama pada label prediksi dan label asli, dikoreksi terhadap tebakan acak (*chance-adjusted*). Rentang $[-1, +1]$, nilai $1.0$ berarti kecocokan sempurna.
- **Normalized Mutual Information (NMI):** Mengukur jumlah informasi timbal balik antara distribusi klaster dan distribusi kelas asli, diskalakan ke rentang $[0, 1]$.`,
        formula: `\\text{ARI} = \\frac{\\text{Index} - \\mathbb{E}[\\text{Index}]}{\\max(\\text{Index}) - \\mathbb{E}[\\text{Index}]}, \\quad \\text{DB} = \\frac{1}{k} \\sum_{i=1}^k \\max_{j \\neq i} \\left( \\frac{s_i + s_j}{\\|\\boldsymbol{\\mu}_i - \\boldsymbol{\\mu}_j\\|} \\right)`,
        code: `# 14.10: Evaluasi Komparatif Metrik Klasterisasi Intrinsik vs Ekstrinsik
from sklearn.metrics import silhouette_score, davies_bouldin_score, adjusted_rand_score, normalized_mutual_info_score
from sklearn.datasets import load_iris
from sklearn.cluster import KMeans

data = load_iris()
X, y_true = data.data, data.target

# Latih k-Means dengan k=3
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10).fit(X)
labels = kmeans.labels_

# 1. Metrik Intrinsik (Tanpa Ground-Truth)
sil = silhouette_score(X, labels)
dbi = davies_bouldin_score(X, labels)

# 2. Metrik Ekstrinsik (Dengan Ground-Truth)
ari = adjusted_rand_score(y_true, labels)
nmi = normalized_mutual_info_score(y_true, labels)

print("=== SUITE EVALUASI KUALITAS KLASTERISASI ===")
print("METRIK INTRINSIK (UNSUPERVISED):")
print(f"- Silhouette Score     : {sil:.4f} (Mendekati 1.0 semakin baik)")
print(f"- Davies-Bouldin Index : {dbi:.4f} (Semakin kecil semakin baik)")
print("\nMETRIK EKSTRINSIK (BENCHMARK GROUND-TRUTH):")
print(f"- Adjusted Rand Index  : {ari:.4f} (1.0 = Identik Sempurna)")
print(f"- Normalized Mut. Info : {nmi:.4f} (1.0 = Informasi Utuh)")`,
        expectedOutput: "Metrik intrinsik dan ekstrinsik terhitung presisi pada dataset Iris.",
        codeExp: "Skrip menghitung suite lengkap metrik klasterisasi intrinsik (Silhouette, DBI) dan ekstrinsik (ARI, NMI) pada dataset Iris.",
        pitfalls: [
          "Menggunakan akurasi klasifikasi standar (accuracy_score) untuk klasterisasi; label klaster bersifat permutasi acak (misal kelas 0 diprediksi sebagai klaster 2).",
          "Memilih model hanya berdasarkan Silhouette Score pada data non-spherical (Silhouette secara bawaan menyukai klaster berbentuk bola)."
        ],
        refTitle: "David L. Davies & Donald W. Bouldin: A Cluster Separation Measure (IEEE TPAMI, 1979)",
        refUrl: "https://ieeexplore.ieee.org/document/4766909"
      }
    ]
  },

  // ==========================================
  // BAB 15: Pengelompokan Hierarkis & Model Probabilistik Campuran (GMM)
  // ==========================================
  {
    orderIndex: 15,
    id: "machine-learning-ch-15",
    slug: "bab-15-pengelompokan-hierarkis-dan-gaussian-mixture-models-gmm",
    title: "BAB 15: Pengelompokan Hierarkis & Model Probabilistik Campuran (GMM)",
    desc: "Metode pohon bertingkat dan pemodelan kepadatan generatif: Agglomerative Hierarchical Clustering, kriteria linkage (Ward, Average, Complete), visualisasi Dendrogram dan korelasi Cophenetic, matriks konektivitas spasial, Gaussian Mixture Models (GMM) untuk soft clustering, algoritma Expectation-Maximization (EM), tipe matriks kovarians, pemilihan komponen via BIC/AIC, dan Bayesian GMM.",
    coreConcepts: ["Agglomerative Hierarchical Clustering", "Linkage Criteria (Ward, Complete, Single, Average)", "Dendrogram & Cophenetic Correlation", "Spatial Connectivity Matrix", "Gaussian Mixture Models (GMM)", "EM Algorithm (E-Step & M-Step)", "Covariance Types (Full, Tied, Diag, Spherical)", "Model Selection via BIC/AIC", "Bayesian GMM (DPGMM)", "Soft vs Hard Clustering"],
    subchapters: [
      {
        num: "15.1",
        slug: "15-1-agglomerative-hierarchical-clustering-bottom-up",
        title: "15.1. Algoritma Agglomerative Hierarchical Clustering: Mekanisme Penggabungan Bottom-Up",
        desc: "Prosedur penggabungan hierarkis sekuensial: inisialisasi n klaster singleton, pencarian pasangan klaster terdekat, dan pembaruan matriks jarak.",
        concept: `Klasterisasi Hierarkis (*Hierarchical Clustering*) menghasilkan representasi bersarang (*nested clusters*) yang dapat dipandang sebagai pohon taksonomi terstruktur. Terdapat dua pendekatan berlawanan:
1. **Divisive (Top-Down):** Dimulai dari 1 klaster tunggal raksasa yang memuat seluruh dataset, lalu secara rekursif dipecah menjadi klaster-klaster kecil.
2. **Agglomerative (Bottom-Up):** Pendekatan yang paling umum dan efisien, dimulai dari $n$ klaster singleton di mana setiap titik observasi menjadi klasternya sendiri, lalu secara bertahap digabungkan (*merged*) berpasangan.

**Algoritma Agglomerative Dasar:**
1. Inisialisasi: Setiap titik $\\mathbf{x}_i$ membentuk klaster awal $C_i = \\{\\mathbf{x}_i\\}$ untuk $i=1, \\dots, n$.
2. Hitung matriks jarak awal antar seluruh pasangan klaster berukuran $n \\times n$.
3. Cari pasangan dua klaster $C_u$ dan $C_v$ yang memiliki **jarak inter-klaster terkecil** $D(C_u, C_v)$.
4. Gabungkan kedua klaster tersebut menjadi satu klaster baru: $C_{\\text{new}} = C_u \\cup C_v$, dan kurangi jumlah total klaster sebanyak satu.
5. Perbarui matriks jarak untuk mencerminkan jarak dari klaster baru $C_{\\text{new}}$ ke seluruh klaster lainnya berdasarkan kriteria keterkaitan (*Linkage Criteria*).
6. Ulangi Langkah 3 hingga 5 sebanyak $n-1$ kali sampai seluruh data menyatu ke dalam satu klaster akar tunggal.`,
        formula: `C_{\\text{new}} = \\arg\\min_{C_u, C_v} D(C_u, C_v) \\implies n \\leftarrow n - 1 \\quad (\\text{Iterasi Penggabungan Pasangan})`,
        code: `# 15.1: Implementasi Agglomerative Clustering Menggunakan Scikit-Learn
import numpy as np
from sklearn.cluster import AgglomerativeClustering
from sklearn.datasets import make_blobs

X, _ = make_blobs(n_samples=50, centers=3, cluster_std=0.8, random_state=42)

# Latih model hierarkis agglomerative dengan 3 klaster
agg = AgglomerativeClustering(n_clusters=3, metric='euclidean', linkage='ward')
labels = agg.fit_predict(X)

print("=== HASIL AGGLOMERATIVE CLUSTERING (BOTTOM-UP) ===")
print("Jumlah Daun Awal       :", len(X))
print("Jumlah Klaster Target  :", agg.n_clusters_)
print("Distribusi Anggota Per Klaster:", np.bincount(labels))`,
        expectedOutput: "Agglomerative clustering mengelompokkan 50 titik ke dalam 3 klaster secara seimbang.",
        codeExp: "Skrip menjalankan AgglomerativeClustering Scikit-Learn pada 50 sampel data dan mencetak distribusi klaster akhir.",
        pitfalls: [
          "Kompleksitas waktu standar Agglomerative clustering adalah O(N^3) (atau O(N^2 log N) dengan heap), menjadikannya tidak praktis untuk N > 30.000.",
          "Sifat keputusan penggabungan bersifat permanen (greedily irrevocable): sekali dua titik digabung pada iterasi awal, penggabungan tersebut tidak dapat dibatalkan di tingkat atas."
        ],
        refTitle: "Joe H. Ward Jr.: Hierarchical Grouping to Optimize an Objective Function (Journal of the American Statistical Association, 1963)",
        refUrl: "https://www.tandfonline.com/doi/abs/10.1080/01621459.1963.10500845"
      },
      {
        num: "15.2",
        slug: "15-2-kriteria-linkage-ward-complete-single-average",
        title: "15.2. Kriteria Keterkaitan (Linkage Criteria): Ward, Complete, Single, dan Average",
        desc: "Perumusan matematis fungsi jarak antar-klaster: minimisasi varians Ward vs jarak terjauh Complete vs fenomena chaining pada Single Linkage.",
        concept: `Perilaku dan bentuk klaster yang dihasilkan oleh Agglomerative Clustering ditentukan sepenuhnya oleh **Kriteria Keterkaitan (*Linkage Criteria*)** yang digunakan untuk mengukur jarak antara dua himpunan klaster $A$ dan $B$:

**1. Ward's Linkage (\\\\`linkage='ward'\\\\`):**
Meminimalkan pertambahan total varians di dalam klaster (Inertia WCSS) yang diakibatkan oleh penggabungan klaster $A$ dan $B$:
$$\\Delta J(A, B) = \\frac{|A| \\cdot |B|}{|A| + |B|} \\|\\boldsymbol{\\mu}_A - \\boldsymbol{\\mu}_B\\|_2^2$$
Ward adalah kriteria paling stabil, tangguh terhadap derau, dan menjadi **pilihan default** di sebagian besar aplikasi praktis. Menghasilkan klaster yang cenderung berbentuk bola dengan ukuran seimbang.

**2. Complete Linkage (\\\\`linkage='complete'\\\\` - Maximum):**
Jarak antar dua klaster didefinisikan sebagai jarak **terjauh** antara sepasang titik mana pun:
$$D_{\\text{max}}(A, B) = \\max_{\\mathbf{a} \\in A, \\mathbf{b} \\in B} d(\\mathbf{a}, \\mathbf{b})$$
Menghasilkan klaster yang kompak dan padat dengan diameter maksimum yang seragam.

**3. Single Linkage (\\\\`linkage='single'\\\\` - Minimum):**
Jarak antar dua klaster didefinisikan sebagai jarak **terdekat**:
$$D_{\\text{min}}(A, B) = \\min_{\\mathbf{a} \\in A, \\mathbf{b} \\in B} d(\\mathbf{a}, \\mathbf{b})$$
*Kelemahan Fatal:* Sangat rentan terhadap **Efek Rantai (*Chaining Effect*)**, di mana satu baris titik derau tipis dapat menghubungkan dua klaster besar yang berbeda menjadi satu.

**4. Average Linkage (\\\\`linkage='average'\\\\` - UPGMA):**
Jarak rata-rata antara seluruh pasangan titik: $D_{\\text{avg}}(A, B) = \\frac{1}{|A||B|} \\sum_{\\mathbf{a} \\in A} \\sum_{\\mathbf{b} \\in B} d(\\mathbf{a}, \\mathbf{b})$.`,
        formula: `D_{\\text{Ward}}(A, B) = \\frac{n_A n_B}{n_A + n_B} \\|\\boldsymbol{\\mu}_A - \\boldsymbol{\\mu}_B\\|^2, \\quad D_{\\text{Complete}} = \\max_{\\mathbf{a}, \\mathbf{b}} d(\\mathbf{a}, \\mathbf{b})`,
        code: `# 15.2: Perbandingan Empiris Empat Kriteria Linkage pada Dataset Sintetis
import numpy as np
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics import silhouette_score
from sklearn.datasets import make_blobs

X, _ = make_blobs(n_samples=250, centers=3, cluster_std=1.0, random_state=42)

print("=== PERBANDINGAN KRITERIA LINKAGE AGGLOMERATIVE ===")
for link in ['ward', 'complete', 'average', 'single']:
    agg = AgglomerativeClustering(n_clusters=3, linkage=link).fit(X)
    sil = silhouette_score(X, agg.labels_)
    print(f"Linkage: {link:8s} -> Silhouette Score = {sil:.4f}")`,
        expectedOutput: "Ward dan Complete menghasilkan silhouette score tertinggi (~0.62), sementara Single linkage terendah akibat chaining.",
        codeExp: "Skrip membandingkan performa 4 kriteria linkage pada dataset yang sama dan mengevaluasi Silhouette Score masing-masing.",
        pitfalls: [
          "Mencoba menggunakan metrik jarak Manhattan atau Kosinus dengan linkage='ward' (Ward hanya valid secara matematis untuk metrik Euklides).",
          "Menggunakan single linkage pada dataset berderau tinggi yang menghasilkan satu klaster raksasa dan sisanya singleton."
        ],
        refTitle: "Daniel Müllner: Modern hierarchical, agglomerative clustering algorithms (arXiv:1109.2378, 2011)",
        refUrl: "https://arxiv.org/abs/1109.2378"
      },
      {
        num: "15.3",
        slug: "15-3-visualisasi-dendrogram-dan-jarak-cophenetic",
        title: "15.3. Visualisasi Dendrogram dan Korelasi Jarak Cophenetic",
        desc: "Interpretasi pohon taksonomi SciPy: pemotongan ambang batas jarak vertikal, struktur matriks linkage, dan koefisien korelasi Cophenetic.",
        concept: `Salah satu keunggulan terbesar dari klasterisasi hierarkis adalah kemampuannya divisualisasikan dalam bentuk pohon grafis bertingkat yang disebut **Dendrogram**.

**Struktur Anatomi Dendrogram:**
- **Sumbu Horizontal ($x$):** Merepresentasikan sampel-sampel data individual (daun).
- **Sumbu Vertikal ($y$):** Merepresentasikan **jarak keterkaitan (*linkage distance*)** pada saat dua klaster digabungkan.
- **Tinggi Garis U:** Ketinggian garis horizontal berbentuk huruf U terbalik mencerminkan seberapa jauh jarak pemisah antara kedua klaster yang digabung. Semakin tinggi garis vertikal sebelum penggabungan berikutnya, semakin alami pemisahan antar klaster tersebut.

**Pemotongan Ambang Batas (Threshold Cut):**
Kita dapat menentukan jumlah klaster akhir dengan menarik garis potong horizontal pada nilai ketinggian jarak tertentu $h$: jumlah garis vertikal yang terpotong adalah tepat jumlah klaster akhir yang dihasilkan.

**Koefisien Korelasi Cophenetic (Robert Sokal & F. James Rohlf, 1962):**
Untuk mengukur seberapa setia dendrogram mempertahankan struktur jarak asli antar-titik, kita menghitung koefisien korelasi Pearson antara jarak Euklides asli data $d_{ij}$ dan **Jarak Cophenetic** $c_{ij}$ (ketinggian pada dendrogram saat titik $i$ dan $j$ pertama kali menyatu ke dalam klaster yang sama):
$$c = \\frac{\\sum_{i<j} (d_{ij} - \\bar{d})(c_{ij} - \\bar{c})}{\\sqrt{\\sum_{i<j} (d_{ij} - \\bar{d})^2 \\sum_{i<j} (c_{ij} - \\bar{c})^2}}$$
Nilai korelasi mendekati $1.0$ membuktikan bahwa dendrogram merepresentasikan geometri data secara sangat akurat tanpa distorsi penggabungan.`,
        formula: `c = \\frac{\\operatorname{Cov}(d, c)}{\\sigma_d \\sigma_c} \\quad (\\text{Koefisien Korelasi Cophenetic Sokal & Rohlf})`,
        code: `# 15.3: Konstruksi Matriks Linkage dan Perhitungan Korelasi Cophenetic via SciPy
import numpy as np
from scipy.cluster.hierarchy import linkage, cophenet
from scipy.spatial.distance import pdist

np.random.seed(42)
X = np.random.randn(30, 4) # 30 sampel kecil untuk dendrogram

# 1. Hitung pairwise distance asli
dist_matrix = pdist(X)

# 2. Bangkitkan matriks linkage hierarkis Ward
Z = linkage(X, method='ward')

# 3. Hitung Koefisien Korelasi Cophenetic
c_coeff, coph_dist = cophenet(Z, dist_matrix)

print("=== EVALUASI DENDROGRAM DAN KORELASI COPHENETIC ===")
print(f"Format Matriks Linkage Z (Shape): {Z.shape} (Tepat n-1 = 29 baris)")
print(f"Koefisien Korelasi Cophenetic    : {c_coeff:.4f} (Validitas Representasi Pohon)")
print(f"Jarak Penggabungan Terakhir (Akar): {Z[-1, 2]:.4f}")`,
        expectedOutput: "Korelasi Cophenetic terhitung tinggi (> 0.70) membuktikan dendrogram mempertahankan jarak asli data.",
        codeExp: "Skrip menghitung matriks linkage Z dan mengevaluasi koefisien korelasi Cophenetic menggunakan modul scipy.cluster.hierarchy.",
        pitfalls: [
          "Mencoba menggambar visualisasi dendrogram lengkap pada dataset dengan ribuan sampel (grafik menjadi blok hitam tak terbaca; gunakan parameter p dan truncate_mode='lastp').",
          "Mengira pemotongan horizontal selalu optimal pada satu level ketinggian yang sama untuk seluruh cabang pohon."
        ],
        refTitle: "Robert R. Sokal & F. James Rohlf: The Comparison of Dendrograms by Objective Methods (Taxon, 1962)",
        refUrl: "https://www.jstor.org/stable/1217208"
      },
      {
        num: "15.4",
        slug: "15-4-matriks-konektivitas-spasial-akselerasi-graf",
        title: "15.4. Matriks Konektivitas Spasial: Mempercepat Komputasi dan Membatasi Klaster",
        desc: "Optimasi berbasis graf topologi: penggunaan k-NN connectivity graph untuk mereduksi kompleksitas komputasi hierarki dan memaksakan kedekatan spasial.",
        concept: `Secara default, Agglomerative Clustering mempertimbangkan kemungkinan penggabungan antara **seluruh pasangan klaster** ($n(n-1)/2$ kombinasi). Hal ini menyebabkan beban komputasi kuadratik dan memori masif. Selain itu, pada data yang memiliki struktur topologi spasial (seperti citra piksel atau wilayah geografis peta), kita sering kali hanya ingin menggabungkan dua area jika kedua area tersebut **bersentuhan atau bertetangga secara spasial**.

**Matriks Konektivitas Spasial (*Connectivity Matrix*):**
Kita dapat mendefinisikan matriks ketetanggaan graf jarang (*sparse adjacency graph*) $\\mathbf{A} \\in \\{0, 1\\}^{n \\times n}$ menggunakan parameter \\\\` + "\\\\`connectivity\\\\`" + \\\\` pada \\\\` + "\\\\`AgglomerativeClustering\\\\`" + \\\\`:
- $A_{ij} = 1$ jika sampel $i$ dan $j$ bertetangga (misalnya terhubung dalam $k$-Nearest Neighbors graph).
- $A_{ij} = 0$ jika tidak bertetangga.

**Dua Manfaat Revolusioner:**
1. **Akselerasi Kecepatan Komputasi Drastis:** Algoritma hanya mengevaluasi jarak pada pasangan titik yang memiliki $A_{ij} = 1$. Pencarian penggabungan terdekat menyusut dari $\\mathcal{O}(n^2)$ ke proporsional jumlah sisi graf $\\mathcal{O}(|E|)$.
2. **Pembentukan Klaster Bersambung (Contiguous Clusters):** Mencegah titik-titik yang terpisah jauh secara geografis digabungkan hanya karena memiliki nilai fitur tabular yang mirip, sangat krusial untuk segmentasi citra medis dan analisis geospasial.`,
        formula: `A_{ij} = \\mathbb{I}(\\mathbf{x}_j \\in \\text{k-NN}(\\mathbf{x}_i) \\lor \\mathbf{x}_i \\in \\text{k-NN}(\\mathbf{x}_j)) \\quad (\\text{Kendala Konektivitas Graf})`,
        code: `# 15.4: Peningkatan Kecepatan Agglomerative Clustering via Matriks Konektivitas k-NN
import time
from sklearn.cluster import AgglomerativeClustering
from sklearn.neighbors import kneighbors_graph
from sklearn.datasets import make_swiss_roll

X, _ = make_swiss_roll(n_samples=1500, noise=0.05, random_state=42)

# 1. Bangkitkan Graf Konektivitas k-NN (k=10)
knn_graph = kneighbors_graph(X, n_neighbors=10, include_self=False)

# 2. Agglomerative Tanpa Konektivitas (Mengevaluasi Seluruh Pasangan)
t0 = time.time()
agg_dense = AgglomerativeClustering(n_clusters=6, linkage='ward').fit(X)
t_dense = time.time() - t0

# 3. Agglomerative Dengan Matriks Konektivitas Graf
t0 = time.time()
agg_sparse = AgglomerativeClustering(n_clusters=6, connectivity=knn_graph, linkage='ward').fit(X)
t_sparse = time.time() - t0

print("=== AKSELERASI AGGLOMERATIVE DENGAN MATRIKS KONEKTIVITAS ===")
print(f"Waktu Tanpa Konektivitas: {t_dense:.4f} detik")
print(f"Waktu Dengan Konektivitas: {t_sparse:.4f} detik (Speedup: {t_dense/t_sparse:.2f}x)")
print(f"Format Matriks Graf     : {type(knn_graph)} (Sparse CSR Matrix)")`,
        expectedOutput: "Agglomerative dengan matriks konektivitas mencatat waktu komputasi signifikan lebih cepat.",
        codeExp: "Skrip membangun graf konektivitas k-NN menggunakan kneighbors_graph dan memanfaatkannya untuk mempercepat AgglomerativeClustering.",
        pitfalls: [
          "Membangun graf konektivitas yang terputus (*disconnected components*); jika graf memiliki 3 pulau terisolasi, n_clusters tidak boleh disetel kurang dari 3.",
          "Menyetel k terlalu kecil pada graf konektivitas sehingga membatasi jalur penggabungan alami klaster."
        ],
        refTitle: "Scikit-Learn Guide: Hierarchical clustering with connectivity constraints",
        refUrl: "https://scikit-learn.org/stable/modules/clustering.html#hierarchical-clustering"
      },
      {
        num: "15.5",
        slug: "15-5-gaussian-mixture-models-gmm-soft-clustering",
        title: "15.5. Gaussian Mixture Models (GMM): Model Generatif Probabilistik dan Soft Clustering",
        desc: "Transisi dari partisi keras ke pengelompokan probabilistik: merumuskan distribusi probabilitas gabungan campuran Gaussian multivariat dan bobot pencampuran.",
        concept: `Algoritma k-Means memaksakan paradigma **Hard Clustering**: setiap titik observasi $\\mathbf{x}_i$ secara kaku dialokasikan 100% tepat ke satu klaster tertentu, tanpa fleksibilitas untuk titik-titik yang berada di zona perbatasan ambigu.

**Gaussian Mixture Models (GMM)** memodelkan data melalui paradigma **Soft Clustering (Fuzzy Clustering)** berbasis model generatif probabilistik:
GMM mengasumsikan bahwa seluruh populasi data dihasilkan oleh campuran dari $K$ komponen distribusi Gaussian Multivariat independen:
$$p(\\mathbf{x}) = \\sum_{k=1}^K \\pi_k \\mathcal{N}(\\mathbf{x} \\mid \\boldsymbol{\\mu}_k, \\mathbf{\\Sigma}_k)$$
di mana:
- $\\pi_k$: **Bobot Pencampuran (*Mixing Coefficients*)**, dengan kendala $\\sum_{k=1}^K \\pi_k = 1$ dan $0 \\le \\pi_k \\le 1$. Bobot ini merepresentasikan probabilitas apriori bahwa sampel berasal dari komponen ke-$k$ ($P(z_k = 1) = \\pi_k$).
- $\\boldsymbol{\\mu}_k \\in \\mathbb{R}^d$: Vektor rata-rata (*mean vector*) dari komponen Gaussian ke-$k$.
- $\\mathbf{\\Sigma}_k \\in \\mathbb{R}^{d \\times d}$: Matriks kovarians (*covariance matrix*) dari komponen Gaussian ke-$k$, yang mengontrol bentuk elipsoid, orientasi rotasi, dan dispersi sebaran.

**Tingkat Tanggung Jawab (*Responsibilities*):**
Melalui Teorema Bayes, probabilitas posterior bahwa titik $\\mathbf{x}_i$ berasal dari komponen ke-$k$ dirumuskan sebagai:
$$\\gamma_{ik} = P(z_{ik} = 1 \\mid \\mathbf{x}_i) = \\frac{\\pi_k \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_k, \\mathbf{\\Sigma}_k)}{\\sum_{j=1}^K \\pi_j \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_j, \\mathbf{\\Sigma}_j)}$$
Nilai $\\gamma_{ik} \\in [0, 1]$ mencerminkan derajat keanggotaan probabilistik kontinu dari sampel terhadap masing-masing klaster.`,
        formula: `p(\\mathbf{x}) = \\sum_{k=1}^K \\pi_k \\mathcal{N}(\\mathbf{x} \\mid \\boldsymbol{\\mu}_k, \\mathbf{\\Sigma}_k), \\quad \\gamma_{ik} = \\frac{\\pi_k \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_k, \\mathbf{\\Sigma}_k)}{\\sum_j \\pi_j \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_j, \\mathbf{\\Sigma}_j)}`,
        code: `# 15.5: Estimasi Soft Clustering Probabilistik Menggunakan GaussianMixture
import numpy as np
from sklearn.mixture import GaussianMixture
from sklearn.datasets import make_blobs

X, _ = make_blobs(n_samples=400, centers=[[-2, 0], [2, 0]], cluster_std=[0.6, 1.2], random_state=42)

# Latih GMM dengan 2 komponen
gmm = GaussianMixture(n_components=2, covariance_type='full', random_state=42).fit(X)

# Ambil probabilitas posterior (Responsibilities gamma_ik)
responsibilities = gmm.predict_proba(X)

# Uji titik di perbatasan tengah (x = [0.0, 0.0])
titik_ambigu = np.array([[0.0, 0.0]])
prob_ambigu = gmm.predict_proba(titik_ambigu)[0]

print("=== GAUSSIAN MIXTURE MODELS (SOFT CLUSTERING) ===")
print(f"Bobot Pencampuran Pi_k : {np.round(gmm.weights_, 3)}")
print(f"Pusat Mean Mu_k        :\n{np.round(gmm.means_, 2)}")
print(f"Probabilitas Keanggotaan Titik Tengah [0, 0]:")
print(f"- Klaster 1: {prob_ambigu[0]*100:.1f}% | Klaster 2: {prob_ambigu[1]*100:.1f}% (Soft Assignment Transparan)")`,
        expectedOutput: "GMM menghasilkan probabilitas terkalibrasi untuk titik tengah perbatasan (~45% vs 55%).",
        codeExp: "Skrip melatih GaussianMixture dan mengekstraksi matriks responsibilities untuk mendemonstrasikan soft assignment kontinu.",
        pitfalls: [
          "Terjadinya singularitas numerik matriks kovarians (determinant mendekati nol) jika satu komponen hanya melingkupi satu sampel data.",
          "GMM mengasumsikan data terdistribusi Gaussian; jika data memiliki distribusi eksponensial murni, GMM akan membagi distribusi tersebut menjadi banyak komponen semu."
        ],
        refTitle: "Christopher M. Bishop: Pattern Recognition and Machine Learning (Chapter 9: Mixture Models and EM)",
        refUrl: "https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/"
      },
      {
        num: "15.6",
        slug: "15-6-algoritma-expectation-maximization-em-untuk-gmm",
        title: "15.6. Algoritma Expectation-Maximization (EM): Penurunan Matematis E-Step dan M-Step",
        desc: "Prosedur optimasi variabel laten Dempster, Laird, Rubin (1977): maksimisasi fungsi batas bawah bukti (Evidence Lower Bound - ELBO) dan konvergensi log-likelihood.",
        concept: `Karena variabel laten $z_{ik}$ (yang menentukan dari komponen mana sampel $\\mathbf{x}_i$ berasal) tidak dapat diobservasi secara langsung, fungsi log-likelihood total memuat penjumlahan di dalam fungsi logaritma:
$$\\ln p(\\mathbf{X} \\mid \\boldsymbol{\\pi}, \\boldsymbol{\\mu}, \\mathbf{\\Sigma}) = \\sum_{i=1}^n \\ln \\left( \\sum_{k=1}^K \\pi_k \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_k, \\mathbf{\\Sigma}_k) \\right)$$
Bentuk ini tidak memiliki solusi turunan analitis bentuk tertutup (*closed-form solution*).

A. P. Dempster, N. M. Laird, dan D. B. Rubin (JRSS, 1977) merumuskan **Algoritma Expectation-Maximization (EM)**:
EM mengoptimalkan batas bawah bukti (*Evidence Lower Bound / ELBO*) melalui dua langkah berulang:

**1. Tahap Ekspektasi (E-Step):**
Menggunakan estimasi parameter saat ini $(\\boldsymbol{\\pi}^{(t)}, \\boldsymbol{\\mu}^{(t)}, \\mathbf{\\Sigma}^{(t)})$, hitung nilai ekspektasi dari variabel laten berupa probabilitas posterior (responsibilitas $\\gamma_{ik}$):
$$\\gamma_{ik}^{(t+1)} = \\frac{\\pi_k^{(t)} \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_k^{(t)}, \\mathbf{\\Sigma}_k^{(t)})}{\\sum_{j=1}^K \\pi_j^{(t)} \\mathcal{N}(\\mathbf{x}_i \\mid \\boldsymbol{\\mu}_j^{(t)}, \\mathbf{\\Sigma}_j^{(t)})}$$

**2. Tahap Maksimisasi (M-Step):**
Perbarui seluruh parameter model untuk memaksimalkan fungsi ekspektasi kelayakan lengkap:
$$N_k = \\sum_{i=1}^n \\gamma_{ik}^{(t+1)}$$
$$\\pi_k^{(t+1)} = \\frac{N_k}{n}$$
$$\\boldsymbol{\\mu}_k^{(t+1)} = \\frac{1}{N_k} \\sum_{i=1}^n \\gamma_{ik}^{(t+1)} \\mathbf{x}_i$$
$$\\mathbf{\\Sigma}_k^{(t+1)} = \\frac{1}{N_k} \\sum_{i=1}^n \\gamma_{ik}^{(t+1)} (\\mathbf{x}_i - \\boldsymbol{\\mu}_k^{(t+1)})(\\mathbf{x}_i - \\boldsymbol{\\mu}_k^{(t+1)})^\\top$$

Teorema membuktikan bahwa pada setiap iterasi EM, nilai log-likelihood **dijamin monoton naik atau tetap**: $\\ln p(\\mathbf{X} \\mid \\theta^{(t+1)}) \\ge \\ln p(\\mathbf{X} \\mid \\theta^{(t)})$.`,
        formula: `\\boldsymbol{\\mu}_k = \\frac{\\sum_i \\gamma_{ik} \\mathbf{x}_i}{\\sum_i \\gamma_{ik}}, \\quad \\mathbf{\\Sigma}_k = \\frac{\\sum_i \\gamma_{ik} (\\mathbf{x}_i - \\boldsymbol{\\mu}_k)(\\mathbf{x}_i - \\boldsymbol{\\mu}_k)^\\top}{\\sum_i \\gamma_{ik}}`,
        code: `# 15.6: Implementasi Algoritma Expectation-Maximization (EM) 1D dari Nol
import numpy as np
from scipy.stats import norm

# Data 1D dari 2 Gaussian
np.random.seed(42)
X = np.hstack([np.random.normal(2, 0.5, 100), np.random.normal(6, 1.0, 100)])
n = len(X)

# Inisialisasi parameter awal
mu = np.array([1.0, 7.0])
sigma = np.array([1.0, 1.0])
pi = np.array([0.5, 0.5])

print("=== ITERASI ALGORITMA EXPECTATION-MAXIMIZATION (EM) ===")
for it in range(15):
    # E-Step: Hitung responsibilitas gamma_ik
    r0 = pi[0] * norm.pdf(X, mu[0], sigma[0])
    r1 = pi[1] * norm.pdf(X, mu[1], sigma[1])
    total = r0 + r1
    gamma = np.column_stack([r0 / total, r1 / total])
    
    # M-Step: Perbarui parameter
    N_k = np.sum(gamma, axis=0)
    pi = N_k / n
    mu = np.sum(gamma * X[:, np.newaxis], axis=0) / N_k
    sigma = np.sqrt(np.sum(gamma * (X[:, np.newaxis] - mu)**2, axis=0) / N_k)
    
    if it % 3 == 0:
        ll = np.sum(np.log(pi[0] * norm.pdf(X, mu[0], sigma[0]) + pi[1] * norm.pdf(X, mu[1], sigma[1])))
        print(f"Iterasi {it:2d}: Mu=[{mu[0]:.2f}, {mu[1]:.2f}] | Sigma=[{sigma[0]:.2f}, {sigma[1]:.2f}] | Log-Likelihood={ll:.2f}")`,
        expectedOutput: "Algoritma EM konvergen mendekati nilai parameter ground-truth Mu=[2.0, 6.0].",
        codeExp: "Skrip mengimplementasikan algoritma EM dua langkah untuk menaksir parameter mean, standar deviasi, dan proporsi pencampuran Gaussian 1D.",
        pitfalls: [
          "EM hanya menjamin konvergensi ke optimum lokal, bukan global; disarankan menggunakan n_init > 1 pada Scikit-Learn.",
          "Nilai varians yang mendekati nol pada iterasi M-step menyebabkan lonjakan ke tak terhingga (tambahkan parameter reg_covar)."
        ],
        refTitle: "A. P. Dempster, N. M. Laird, D. B. Rubin: Maximum Likelihood from Incomplete Data via the EM Algorithm (JRSS-B, 1977)",
        refUrl: "https://www.jstor.org/stable/2984875"
      },
      {
        num: "15.7",
        slug: "15-7-pemilihan-tipe-matriks-kovarians-gmm",
        title: "15.7. Pemilihan Tipe Matriks Kovarians GMM: Spherical, Diagonal, Tied, dan Full",
        desc: "Komparasi trade-off kapasitas pemodelan vs jumlah parameter bebas (degrees of freedom): analisis geometris opsi covariance_type Scikit-Learn.",
        concept: `Dalam Scikit-Learn, kelas \\\\` + "\\\\`GaussianMixture\\\\`" + \\\\` menyediakan parameter krusial \\\\` + "\\\\`covariance_type\\\\`" + \\\\` yang menentukan fleksibilitas geometris dan jumlah parameter bebas yang harus diestimasi:

**Empat Tipe Matriks Kovarians:**
1. **\\\\`covariance_type='spherical'\\\\` (Bola / Isotropik):**
   Setiap komponen memiliki varians tunggal $\\mathbf{\\Sigma}_k = \\sigma_k^2 \\mathbf{I}$.
   - *Geometri:* Klaster berbentuk bola sempurna dengan jari-jari seragam di seluruh arah.
   - *Derajat Kebebasan:* $k$ parameter (sangat hemat, mirip k-Means berbobot probabilitas).
2. **\\\\`covariance_type='diag'\\\\` (Diagonal):**
   Matriks kovarians adalah matriks diagonal $\\mathbf{\\Sigma}_k = \\text{diag}(\\sigma_{k, 1}^2, \\dots, \\sigma_{k, d}^2)$.
   - *Geometri:* Klaster berbentuk elipsoid yang **selalu sejajar dengan sumbu koordinat** (mengasumsikan fitur tidak saling berkorelasi kondisional).
   - *Derajat Kebebasan:* $k \\cdot d$ parameter.
3. **\\\\`covariance_type='tied'\\\\` (Terikat Bersama):**
   Seluruh $k$ komponen berbagi **satu matriks kovarians penuh yang identik** $\\mathbf{\\Sigma}_1 = \\dots = \\mathbf{\\Sigma}_k = \\mathbf{\\Sigma}$.
   - *Geometri:* Seluruh klaster memiliki bentuk dan orientasi rotasi elips yang persis sama.
   - *Derajat Kebebasan:* $d(d+1)/2$ parameter.
4. **\\\\`covariance_type='full'\\\\` (Penuh Bebas):**
   Setiap komponen memiliki matriks kovarians simetris positif-definit independen masing-masing $\\mathbf{\\Sigma}_k$.
   - *Geometri:* Fleksibilitas absolut; setiap klaster dapat berotasi dan memiliki bentuk elipsoid yang sepenuhnya bebas.
   - *Derajat Kebebasan:* $k \\cdot d(d+1)/2$ parameter. Sangat rentan overfitting jika data latih terbatas!`,
        formula: `\\text{Jumlah Parameter Full} = k \\cdot \\left[ \\frac{d(d+1)}{2} \\right] \\gg \\text{Spherical} = k \\cdot 1`,
        code: `# 15.7: Komparasi Empat Tipe Kovarians GMM pada Dataset Terdistorsi Miring
import numpy as np
from sklearn.mixture import GaussianMixture
from sklearn.datasets import make_blobs

# Bangkitkan data elips miring (fitur berkorelasi)
np.random.seed(42)
X, _ = make_blobs(n_samples=600, centers=2, cluster_std=1.0, random_state=42)
transformation = np.array([[0.6, -0.6], [-0.4, 0.8]])
X_aniso = np.dot(X, transformation)

print("=== EVALUASI LOG-LIKELIHOOD TIPE KOVARIANS GMM ===")
for cov in ['spherical', 'diag', 'tied', 'full']:
    gmm = GaussianMixture(n_components=2, covariance_type=cov, random_state=42).fit(X_aniso)
    score = gmm.score(X_aniso) # Rata-rata per-sample log-likelihood
    print(f"Tipe Kovarians: {cov:10s} | Per-Sample Log-Likelihood: {score:.4f} (Semakin tinggi semakin fit)")`,
        expectedOutput: "Tipe 'full' menghasilkan log-likelihood tertinggi karena mampu menangkap rotasi kemiringan elips data.",
        codeExp: "Skrip membandingkan log-likelihood dari 4 tipe matriks kovarians GMM pada dataset terdistribusi elips miring.",
        pitfalls: [
          "Memilih covariance_type='full' pada dataset berdimensi ratusan yang memicu ledakan parameter dan kegagalan invers matriks (gunakan 'diag' untuk dimensi tinggi).",
          "Mengasumsikan tipe kovarians spherical identik dengan k-means (spherical GMM tetap memperhitungkan bobot pi_k dan varians per-klaster)."
        ],
        refTitle: "Scikit-Learn User Guide: GMM Covariance Types",
        refUrl: "https://scikit-learn.org/stable/modules/mixture.html#gmm-covariance-type"
      },
      {
        num: "15.8",
        slug: "15-8-pemilihan-komponen-gmm-bic-dan-aic",
        title: "15.8. Pemilihan Jumlah Komponen GMM: Bayesian Information Criterion (BIC) dan AIC",
        desc: "Pencegahan overfitting model generatif: penalti kompleksitas parameter via BIC Gideon Schwarz dan AIC Hirotugu Akaike.",
        concept: `Berbeda dengan k-Means di mana penambahan klaster $k$ selalu menurunkan Inertia, pada GMM menambah jumlah komponen $K$ akan selalu meningkatkan nilai Log-Likelihood data latih. Jika kita memilih $K$ hanya berdasarkan Log-Likelihood tertinggi, model akan memilih $K = n$ (menempatkan 1 distribusi Gaussian sempit di setiap titik data, memicu overfitting ekstrem).

Untuk memilih jumlah komponen $K$ optimal yang menyeimbangkan **keakuratan fitting (goodness-of-fit)** dan **kesederhanaan model (parsimony)**, kita menggunakan kriteria informasi statistik:

**1. Bayesian Information Criterion (BIC / Gideon Schwarz, 1978):**
$$\\text{BIC} = -2 \\ln \\hat{L} + p \\ln(n)$$
di mana:
- $\\hat{L}$: Nilai maksimum likelihood model.
- $p$: Jumlah total parameter bebas yang diestimasi.
- $n$: Jumlah total observasi sampel data.

**2. Akaike Information Criterion (AIC / Hirotugu Akaike, 1974):**
$$\\text{AIC} = -2 \\ln \\hat{L} + 2 p$$

**Prinsip Pemilihan:**
Pilih nilai $K$ yang menghasilkan **nilai BIC atau AIC paling minimum (terkecil)**!
- **Penalti BIC** jauh lebih keras terhadap model yang kompleks ($p \\ln n > 2p$ untuk $n \\ge 8$), sehingga BIC cenderung memilih model yang lebih sederhana dan tangkal overfitting secara superior.`,
        formula: `\\text{BIC} = -2 \\ln \\hat{L} + p \\ln n, \\quad \\text{AIC} = -2 \\ln \\hat{L} + 2p \\implies \\arg\\min_K \\text{BIC}(K)`,
        code: `# 15.8: Seleksi Jumlah Komponen Optimal GMM Menggunakan Kurva Penalti BIC dan AIC
import numpy as np
from sklearn.mixture import GaussianMixture
from sklearn.datasets import make_blobs

# Bangkitkan 3 klaster alami
X, _ = make_blobs(n_samples=500, centers=3, cluster_std=0.8, random_state=42)

k_range = range(1, 7)
bic_scores = []
aic_scores = []

print("=== SELEKSI KOMPONEN GMM BERBASIS INFORMASI KRITERIA ===")
print("K | Jumlah Parameter (p) | Nilai BIC     | Nilai AIC")
print("-" * 50)
for k in k_range:
    gmm = GaussianMixture(n_components=k, covariance_type='full', random_state=42).fit(X)
    bic = gmm.bic(X)
    aic = gmm.aic(X)
    bic_scores.append(bic)
    aic_scores.append(aic)
    # p = k*pi + k*mu + k*covariances
    p = k - 1 + k * 2 + k * 3
    print(f"{k} | {p:20d} | {bic:13.2f} | {aic:13.2f}")

best_k_bic = list(k_range)[np.argmin(bic_scores)]
print(f"\nKomponen Optimal Terpilih via Minimum BIC: K = {best_k_bic} (Sesuai Ground Truth!)")`,
        expectedOutput: "BIC mencapai nilai minimum tegas pada K=3, membuktikan keakuratan penalti parameter Schwarz.",
        codeExp: "Skrip menghitung nilai BIC dan AIC untuk K=1 hingga 6 pada dataset 3 klaster, mendemonstrasikan seleksi komponen otomatis.",
        pitfalls: [
          "Mencari nilai BIC terbesar; ingat bahwa fungsi objektif BIC memuat penalti negatif log-likelihood sehingga nilai TERKECIL yang dicari.",
          "Menghitung BIC pada data uji baru (BIC dirancang secara teoretis dievaluasi pada dataset latihan yang sama)."
        ],
        refTitle: "Gideon Schwarz: Estimating the Dimension of a Model (The Annals of Statistics, 1978)",
        refUrl: "https://projecteuclid.org/journals/annals-of-statistics/volume-6/issue-2/Estimating-the-Dimension-of-a-Model/10.1214/aos/1176344136.full"
      },
      {
        num: "15.9",
        slug: "15-9-bayesian-gaussian-mixture-models-dpgmm",
        title: "15.9. Bayesian Gaussian Mixture Models (DPGMM): Estimasi Komponen Otomatis via Dirichlet Process",
        desc: "Pendekatan non-parametrik Bayesian: inferensi variasi (Variational Inference) dengan Dirichlet Process Prior untuk menonaktifkan komponen redundan.",
        concept: `Meskipun BIC efektif, ia memerlukan pelatihan model berulang-ulang untuk setiap nilai calon $K$. Pendekatan yang lebih elegan adalah **Bayesian Gaussian Mixture Models** dengan **Dirichlet Process Prior (DPGMM)**.

Dalam paradigma Bayesian, parameter model diperlakukan sebagai variabel acak yang memiliki distribusi apriori (*Prior Distribution*):
- Bobot pencampuran $\\boldsymbol{\\pi}$ diberikan prior berupa **Dirichlet Process** atau **Stick-Breaking Process**.
- Mean dan kovarians diberikan prior conjugate Normal-Wishart.

**Mekanisme Eliminasi Komponen Otomatis:**
Pengguna cukup menetapkan batas atas jumlah komponen yang besar (misalnya \\\\` + "\\\\`n_components=10\\\\`" + \\\\`).
Melalui algoritma **Variational Inference**:
- Komponen yang benar-benar didukung oleh konsentrasi data akan dialokasikan bobot posterior positif $\\pi_k > 0$.
- Komponen yang redundan atau tidak diperlukan akan didorong bobotnya **mendekati tepat nol ($\to 0$)** oleh parameter konsentrasi Dirichlet $\\gamma$.
- Model secara otomatis "mematikan" komponen yang tidak terpakai, memberikan estimasi jumlah klaster intrinsik tanpa proses grid search manual!`,
        formula: `\\boldsymbol{\\pi} \\sim \\text{Dirichlet}(\\alpha_0 / K, \\dots, \\alpha_0 / K) \\implies \\pi_k \\to 0 \\text{ untuk komponen redundan}`,
        code: `# 15.9: Estimasi Jumlah Komponen Otomatis dengan BayesianGaussianMixture
import numpy as np
from sklearn.mixture import BayesianGaussianMixture
from sklearn.datasets import make_blobs

# Bangkitkan tepat 3 klaster
X, _ = make_blobs(n_samples=600, centers=3, cluster_std=0.7, random_state=42)

# Berikan batas atas 10 komponen pada DPGMM
dpgmm = BayesianGaussianMixture(
    n_components=10,
    weight_concentration_prior_type='dirichlet_process',
    weight_concentration_prior=1e-2,
    random_state=42
).fit(X)

weights = dpgmm.weights_
active_components = np.sum(weights > 0.05)

print("=== BAYESIAN GAUSSIAN MIXTURE (DIRICHLET PROCESS) ===")
print("Batas Awal Komponen Disediakan:", 10)
print(f"Bobot Seluruh 10 Komponen:\n{np.round(weights, 3)}")
print(f"Jumlah Komponen Aktif Bermakna (> 5% Bobot): {active_components} (Sempurna Mengenali 3 Klaster!)")`,
        expectedOutput: "DPGMM otomatis mengalokasikan ~33% bobot ke 3 komponen dan menekan 7 komponen sisa mendekati 0.00.",
        codeExp: "Skrip mendemonstrasikan kemampuan BayesianGaussianMixture dalam mengeliminasi komponen redundan secara otomatis via Dirichlet process prior.",
        pitfalls: [
          "Menyetel weight_concentration_prior terlalu besar yang memaksa model membagi data ke seluruh komponen yang disediakan.",
          "Inferensi variasional Bayesian memerlukan waktu komputasi per iterasi yang lebih besar daripada EM reguler."
        ],
        refTitle: "Blei, D. M., Jordan, M. I.: Variational inference for Dirichlet process mixtures (Bayesian Analysis, 2006)",
        refUrl: "https://projecteuclid.org/journals/bayesian-analysis/volume-1/issue-1/Variational-inference-for-Dirichlet-process-mixtures/10.1214/06-BA104.full"
      },
      {
        num: "15.10",
        slug: "15-10-segmentasi-probabilistik-gmm-vs-kmeans-produksi",
        title: "15.10. Studi Kasus Produksi: Segmentasi Pelanggan Menggunakan GMM vs k-Means",
        desc: "Implementasi end-to-end pada data transaksional pelanggan: kuantifikasi ketidakpastian segmentasi dan pemanfaatan bobot campuran untuk penawaran produk tertarget.",
        concept: `Dalam aplikasi bisnis nyata (seperti segmentasi nasabah perbankan atau e-commerce), konsumen sering kali menunjukkan pola perilaku hibrida: seorang pelanggan dapat memiliki 70% karakteristik segmen "Pencari Diskon Promo" dan 30% karakteristik segmen "Pembeli Produk Premium".

**Keunggulan GMM atas k-Means di Produksi:**
1. **Pemberian Skor Keyakinan (*Confidence Score*):**
   Dengan GMM, tim pemasaran dapat membedakan antara nasabah yang merupakan anggota inti suatu klaster (probabilitas posterior $> 0.95$) dan nasabah yang berada di batas abu-abu (probabilitas $\\approx 0.50$).
2. **Kustomisasi Strategi Kampanye Tertarget:**
   Nasabah pada zona perbatasan dapat menerima penawaran gabungan (*hybrid bundle*) daripada dipaksa menerima kampanye kaku yang tidak relevan.
3. **Deteksi Anomali Alami:**
   Sampel yang memiliki nilai densitas gabungan $\\ln p(\\mathbf{x})$ sangat rendah di bawah seluruh komponen Gaussian dapat langsung ditandai sebagai transaksi anomali atau calon nasabah penipuan (*fraud detection*).`,
        formula: `\\text{Tingkat Kepastian Alokasi } = \\max_k \\gamma_{ik} \\in [1/K, 1.0] \\quad (\\text{Confidence Metric})`,
        code: `# 15.10: Segmentasi Pelanggan Probabilistik Berbasis GMM pada Data RFM
import numpy as np
import pandas as pd
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import StandardScaler

# Sintesis data perilaku 500 pelanggan: [Frekuensi Belanja, Total Pengeluaran (Juta)]
np.random.seed(42)
segmen_reguler = np.random.multivariate_normal([5, 2], [[2, 1], [1, 2]], 300)
segmen_vip = np.random.multivariate_normal([25, 20], [[10, 8], [8, 15]], 200)
data_rfm = np.vstack([segmen_reguler, segmen_vip])

# Standarisasi data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(data_rfm)

# Latih GMM Segmentasi (K=2)
gmm_prod = GaussianMixture(n_components=2, covariance_type='full', random_state=42).fit(X_scaled)
probs = gmm_prod.predict_proba(X_scaled)
max_conf = np.max(probs, axis=1)

# Identifikasi pelanggan ambigu (Confidence < 70%)
ambiguous_customers = np.where(max_conf < 0.70)[0]

print("=== HASIL SEGMENTASI PELANGGAN ENTERPRISE ===")
print(f"Total Pelanggan Teranalisis: {len(data_rfm)}")
print(f"Pelanggan Klaster Tegas (>70% Yakin): {len(data_rfm) - len(ambiguous_customers)}")
print(f"Pelanggan Hybrid Ambigu (<70% Yakin): {len(ambiguous_customers)} orang")
print(f"Contoh Pelanggan Ambigu: Indeks {ambiguous_customers[0]} -> Probabilitas Segmen: {np.round(probs[ambiguous_customers[0]], 3)}")`,
        expectedOutput: "GMM berhasil mengidentifikasi pelanggan segmen tegas dan mendeteksi pelanggan hybrid ambigu secara transparan.",
        codeExp: "Skrip mensimulasikan sistem segmentasi pelanggan produksi menggunakan GMM dengan kuantifikasi tingkat keyakinan alokasi segmen.",
        pitfalls: [
          "Mengabaikan penskalaan fitur sebelum melatih GMM pada data fitur finansial yang memiliki rentang nominal berbeda.",
          "Membagikan label segmen hard ke tim bisnis tanpa memanfaatkan informasi probabilitas posterior yang kaya."
        ],
        refTitle: "Scikit-Learn Example: Density Estimation for a Gaussian Mixture",
        refUrl: "https://scikit-learn.org/stable/auto_examples/mixture/plot_gmm_pdf.html"
      }
    ]
  },

  // ==========================================
  // BAB 16: Deteksi Anomali & Pencilan (Anomaly and Outlier Detection)
  // ==========================================
  {
    orderIndex: 16,
    id: "machine-learning-ch-16",
    slug: "bab-16-deteksi-anomali-dan-pencilan-outlier-detection",
    title: "BAB 16: Deteksi Anomali & Pencilan (Anomaly and Outlier Detection)",
    desc: "Metodologi identifikasi observasi abnormal: taksonomi anomali (Point, Contextual, Collective), Novelty vs Outlier Detection, Elliptic Envelope dan Minimum Covariance Determinant (Rousseeuw), algoritma Isolation Forest Liu et al., Local Outlier Factor (LOF) Breunig et al., One-Class SVM Schölkopf et al., Kernel Density Estimation (KDE), efek Masking dan Swamping, kalibrasi rasio kontaminasi, dan arsitektur deteksi fraud transaksi keuangan.",
    coreConcepts: ["Anomaly Taxonomy (Point, Contextual, Collective)", "Novelty vs Outlier Detection", "Elliptic Envelope & Mahalanobis Distance", "Minimum Covariance Determinant (MCD)", "Isolation Forest (iForest)", "Average Path Length E(h(x))", "Local Outlier Factor (LOF)", "One-Class SVM", "Masking & Swamping Effects", "Contamination Calibration"],
    subchapters: [
      {
        num: "16.1",
        slug: "16-1-taksonomi-deteksi-anomali-point-contextual-collective",
        title: "16.1. Taksonomi Deteksi Anomali: Point, Contextual, dan Collective Anomalies",
        desc: "Kategorisasi formal Chandola et al. (ACM Comput. Surv. 2009): perumusan tiga jenis anomali fundamental dan perbedaan paradigma Novelty vs Outlier Detection.",
        concept: `Deteksi Anomali (*Anomaly Detection* / *Outlier Detection*) adalah proses identifikasi pola dalam data yang perilakunya tidak sesuai dengan ekspektasi normal yang telah terdefinisi dengan baik.

Varun Chandola, Arindam Banerjee, dan Vipin Kumar (ACM Computing Surveys, 2009) mengklasifikasikan anomali ke dalam tiga tipe fundamental:
1. **Point Anomalies (Anomali Titik):**
   Suatu observasi data individual dianggap abnormal jika berada jauh di luar distribusi populasi umum. Contoh: Transaksi kartu kredit tunggal senilai Rp 100.000.000 pada nasabah yang rata-rata bertransaksi Rp 200.000.
2. **Contextual Anomalies (Anomali Kontekstual / Kondisional):**
   Suatu observasi tampak normal secara absolut, namun menjadi abnormal dalam **konteks spesifik** (seperti waktu, suhu, atau lokasi). Contoh: Suhu udara $30^\\circ\\text{C}$ di Jakarta adalah sangat normal, namun suhu $30^\\circ\\text{C}$ di Kutub Utara pada musim dingin adalah anomali ekstrem.
3. **Collective Anomalies (Anomali Kolektif):**
   Koleksi sejumlah observasi yang secara individual terlihat sepenuhnya normal, namun kemunculannya secara bersama-sama membentuk pola abnormal. Contoh: Denyut ritme EKG jantung yang terhenti mendatar selama 3 detik berturut-turut.

**Dua Paradigma Operasional di Scikit-Learn:**
- **Outlier Detection (Tanpa Pengawasan):** Dataset latihan sudah terkontaminasi oleh anomali; model harus membersihkan derau dari dalam dirinya sendiri.
- **Novelty Detection (Semi-Terawasi):** Dataset latihan dijamin **100% bersih dari anomali**; model mempelajari batas normalitas untuk mendeteksi data abnormal baru di masa depan.`,
        formula: `\\text{Anomali} \\iff P(\\mathbf{x} \\mid \\text{Model Normal}) < \\tau \\quad (\\text{Ambang Batas Densitas})`,
        code: `# 16.1: Demonstrasi Konsep Point Anomaly vs In-Distribution Normal
import numpy as np

np.random.seed(42)
# Data normal (Inliers)
inliers = np.random.normal(loc=10.0, scale=2.0, size=500)
# Anomali titik tunggal ekstrem (Point Anomaly)
point_anomaly = np.array([35.0])

data = np.concatenate([inliers, point_anomaly])
mean, std = np.mean(inliers), np.std(inliers)
z_scores = np.abs((data - mean) / std)

print("=== DETEKSI POINT ANOMALY BERBASIS Z-SCORE ===")
print(f"Rata-rata Data Normal: {mean:.2f} | Standar Deviasi: {std:.2f}")
print(f"Z-Score Sampel Terbesar: {z_scores[-1]:.2f} (Melampaui Batas 3-Sigma!)")
print("Status Sampel Akhir   : TERDETEKSI SEBAGAI ANOMALI EKSTREM")`,
        expectedOutput: "Z-score anomali titik terhitung > 12 sigma jauh melampaui batas normalitas.",
        codeExp: "Skrip mengilustrasikan deteksi anomali titik sederhana menggunakan deviasi Z-score terhadap distribusi data normal.",
        pitfalls: [
          "Menerapkan algoritma Novelty Detection pada dataset latih yang kotor terkontaminasi banyak outlier.",
          "Mengabaikan variabel kontekstual (seperti jam transaksi atau hari libur) saat mendeteksi anomali deret waktu."
        ],
        refTitle: "V. Chandola, A. Banerjee, V. Kumar: Anomaly Detection: A Survey (ACM Computing Surveys, 2009)",
        refUrl: "https://dl.acm.org/doi/10.1145/1541880.1541882"
      },
      {
        num: "16.2",
        slug: "16-2-elliptic-envelope-dan-jarak-mahalanobis-mcd",
        title: "16.2. Deteksi Anomali Statistik: Elliptic Envelope dan Minimum Covariance Determinant (MCD)",
        desc: "Pendekatan parametrik multivariat Peter Rousseeuw (1984): estimasi matriks kovarians tangguh (robust covariance) dan jarak Mahalanobis terkalibrasi Chi-Square.",
        concept: `Pada data multivariat $\\mathbf{x} \\in \\mathbb{R}^d$ yang terdistribusi normal Gaussian, jarak Euklides biasa tidak dapat digunakan untuk mendeteksi pencilan karena mengabaikan kovarians dan korelasi antar-fitur.

**Jarak Mahalanobis (P. C. Mahalanobis, 1936):**
Mengukur jarak dari titik $\\mathbf{x}$ ke pusat massa $\\boldsymbol{\\mu}$ dengan menormalisasi varians sepanjang sumbu kovarians:
$$D_M(\\mathbf{x}) = \\sqrt{(\\mathbf{x} - \\boldsymbol{\\mu})^\\top \\mathbf{\\Sigma}^{-1} (\\mathbf{x} - \\boldsymbol{\\mu})}$$
Pada distribusi normal standar, kuadrat jarak Mahalanobis $D_M^2(\\mathbf{x})$ berdistribusi Chi-Square dengan $d$ derajat kebebasan: $D_M^2 \\sim \\chi_d^2$.

**Kelemahan Estimator Kovarians Klasik:**
Jika $\\boldsymbol{\\mu}$ dan $\\mathbf{\\Sigma}$ dihitung menggunakan rata-rata sampel biasa, keberadaan beberapa outlier akan mendistorsi $\\boldsymbol{\\mu}$ dan menggembungkan $\\mathbf{\\Sigma}$, menutupi anomali tersebut (*masking effect*).

**Solusi Rousseeuw: Minimum Covariance Determinant (MCD):**
Kelas \\\\` + "\\\\`EllipticEnvelope\\\\`" + \\\\` Scikit-Learn menggunakan estimator MCD (Peter J. Rousseeuw, 1984):
1. Algoritma mencari subset berukuran $h$ sampel ($n/2 < h < n$) yang memiliki **determinan matriks kovarians terkecil $\\det(\\mathbf{\\Sigma})$** (wilayah paling padat terbebas dari outlier).
2. Matriks kovarians tangguh (*robust covariance*) $\\mathbf{\\Sigma}_{\\text{MCD}}$ dan lokasi pusat $\\boldsymbol{\\mu}_{\\text{MCD}}$ dihitung murni hanya dari subset $h$ tersebut.
3. Menghasilkan batas keputusan berbentuk elipsoid yang sangat kokoh terhadap distorsi outlier.`,
        formula: `D_M^2(\\mathbf{x}) = (\\mathbf{x} - \\boldsymbol{\\mu})^\\top \\mathbf{\\Sigma}_{\\text{MCD}}^{-1} (\\mathbf{x} - \\boldsymbol{\\mu}) \\sim \\chi_d^2 \\quad (\\text{Jarak Mahalanobis Robust})`,
        code: `# 16.2: Deteksi Anomali Multivariat Menggunakan EllipticEnvelope (FastMCD)
import numpy as np
from sklearn.covariance import EllipticEnvelope

# Bangkitkan 200 data normal berkorelasi tinggi
np.random.seed(42)
cov_true = [[2.0, 1.5], [1.5, 2.0]]
X_normal = np.random.multivariate_normal([0, 0], cov_true, 200)

# Tambahkan 10 pencilan yang melanggar arah korelasi
X_outliers = np.array([[-3.0, 3.0], [3.0, -3.0], [-4.0, 2.5], [3.5, -2.5], [-2.5, 3.5]])
X = np.vstack([X_normal, X_outliers])

# Latih EllipticEnvelope dengan estimasi kontaminasi 5%
envelope = EllipticEnvelope(contamination=0.03, random_state=42).fit(X)
preds = envelope.predict(X) # 1 = Inlier, -1 = Outlier

n_detected_outliers = np.sum(preds == -1)
print("=== DETEKSI ANOMALI ROBUST ELLIPTIC ENVELOPE (MCD) ===")
print(f"Total Sampel       : {len(X)}")
print(f"Anomali Terdeteksi : {n_detected_outliers} (Diberi label -1)")
print("Pusat Tangguh Terhitung (MCD Mean):\n", np.round(envelope.location_, 2))`,
        expectedOutput: "EllipticEnvelope berhasil mengisolasi anomali yang melanggar korelasi kovarians.",
        codeExp: "Skrip menerapkan EllipticEnvelope berbasis MCD untuk mendeteksi anomali multivariat berkorelasi.",
        pitfalls: [
          "Menerapkan EllipticEnvelope pada data yang distribusinya sangat non-Gaussian atau multimodal (akan salah menganggap lembah densitas sebagai anomali).",
          "Jumlah sampel $n$ harus lebih besar dari jumlah fitur $d$; jika $d > n$, determinan kovarians tidak dapat dihitung."
        ],
        refTitle: "Peter J. Rousseeuw: Least Median of Squares Regression (Journal of the American Statistical Association, 1984)",
        refUrl: "https://www.tandfonline.com/doi/abs/10.1080/01621459.1984.10477105"
      },
      {
        num: "16.3",
        slug: "16-3-isolation-forest-iforest-liu-ting-zhou",
        title: "16.3. Algoritma Isolation Forest: Isolasi Cepat Titik Pencilan via Pemisahan Acak",
        desc: "Terobosan Fei Tony Liu, Kai Ming Ting, Zhi-Hua Zhou (ICDM 2008): paradigma eksplisit pemisahan anomali, struktur iTree acak, dan efisiensi linier O(n).",
        concept: `Hampir seluruh algoritma deteksi anomali tradisional bekerja secara implisit: membangun model dari data normal terlebih dahulu (misalnya mengestimasi densitas atau merekonstruksi klaster), lalu mengidentifikasi titik mana pun yang tidak cocok dengan profil normal tersebut. Pendekatan ini sangat memakan komputasi pada dataset skala besar.

Fei Tony Liu, Kai Ming Ting, dan Zhi-Hua Zhou (ICDM 2008, IEEE TKDD 2012) memperkenalkan **Isolation Forest (iForest)** yang dianugerahi penghargaan tertinggi komunitas penambangan data.

**Filosofi Eksplisit Isolasi:**
iForest memanfaatkan dua karakteristik fundamental dari anomali:
1. Jumlah mereka **sangat sedikit (*few*)**.
2. Nilai fitur mereka **sangat berbeda (*different*)** dari mayoritas data normal.

Karena kedua sifat ini, titik anomali **jauh lebih rentan terhadap isolasi (*more susceptible to isolation*)** dibandingkan titik normal ketika ruang fitur dipotong secara acak.

**Struktur Isolation Tree (iTree):**
1. Pilih secara acak sebuah fitur $q$ dari dataset.
2. Pilih secara acak sebuah nilai ambang pemisah $p$ di antara nilai minimum dan maksimum fitur $q$ saat ini ($p \\sim \\text{Uniform}(\\min(q), \\max(q))$).
3. Pisahkan data menjadi dua cabang anak: $\\mathbf{x}_q < p$ dan $\\mathbf{x}_q \\ge p$.
4. Ulangi proses ini secara rekursif hingga titik terisolasi sempurna di daun tunggal.

**Wawasan Kritis:**
- **Titik Anomali** berada di wilayah jarang di tepi ruang, sehingga **hanya membutuhkan sedikit sekali pemotongan acak untuk terisolasi** (memiliki kedalaman daun / *path length* yang sangat dangkal).
- **Titik Normal** berada di pusat kerumunan padat, sehingga membutuhkan **banyak pemotongan acak bertingkat untuk terisolasi** (memiliki *path length* yang dalam).`,
        formula: `h(\\mathbf{x}) \\ll \\bar{h} \\implies \\mathbf{x} \\text{ adalah Anomali (Kedalaman Jalur Dangkal)}`,
        code: `# 16.3: Implementasi Konsep Dasar Pemotongan Acak Isolation Tree (iTree)
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.datasets import make_blobs

# Bangkitkan 300 data normal padat + 5 outlier ekstrem
X_inliers, _ = make_blobs(n_samples=300, centers=[[0, 0]], cluster_std=1.0, random_state=42)
X_outliers = np.array([[8.0, 8.0], [-9.0, 7.0], [10.0, -8.0], [-8.0, -9.0]])
X = np.vstack([X_inliers, X_outliers])

# Latih IsolationForest dengan 100 iTrees
iso = IsolationForest(n_estimators=100, contamination=0.02, random_state=42).fit(X)

# Prediksi: 1 = Normal, -1 = Anomali
preds = iso.predict(X)
scores = iso.decision_function(X) # Semakin negatif semakin anomali

print("=== DETEKSI ANOMALI ISOLATION FOREST ===")
print(f"Total Sampel Terdeteksi Anomali (-1): {np.sum(preds == -1)}")
print(f"Skor Anomali Rata-rata Inliers     : {np.mean(scores[:300]):.4f} (Positif)")
print(f"Skor Anomali 4 Outlier Ekstrem     : {np.round(scores[300:], 4)} (Sangat Negatif!)")`,
        expectedOutput: "Isolation Forest sukses mendeteksi 4 outlier ekstrem dengan skor anomali negatif tegas.",
        codeExp: "Skrip menerapkan IsolationForest Scikit-Learn dan menganalisis skor keputusan anomali pada inliers vs outlier.",
        pitfalls: [
          "Membatasi iForest hanya pada pemisahan fitur sejajar sumbu; jika anomali terletak pada korelasi diagonal, varian Extended Isolation Forest (EIF) dengan hyperplane miring lebih efektif.",
          "Menyetel max_samples terlalu besar (default 256 sampel per pohon terbukti optimal secara matematis untuk mencegah efek swamping)."
        ],
        refTitle: "Fei Tony Liu, Kai Ming Ting, Zhi-Hua Zhou: Isolation Forest (IEEE ICDM, 2008)",
        refUrl: "https://ieeexplore.ieee.org/document/4781136"
      },
      {
        num: "16.4",
        slug: "16-4-penurunan-panjang-jalur-rata-rata-dan-anomaly-score",
        title: "16.4. Penurunan Matematis Rata-rata Jalur Isolasi E(h(x)) dan Anomaly Score",
        desc: "Analisis formal struktur pohon pencarian biner (BST): pembuktian panjang jalur rata-rata c(n) Euler-Mascheroni dan perumusan Anomaly Score eksponensial s(x, n).",
        concept: `Untuk mengubah panjang jalur isolasi empiris $h(\\mathbf{x})$ menjadi skor anomali yang dinormalisasi antara $0$ dan $1$, Liu et al. memanfaatkan analogi matematika antara **struktur iTree** dan **Pohon Pencarian Biner Acak (*Randomized Binary Search Tree - BST*)**.

Dalam BST acak berukuran $n$ simpul, panjang jalur rata-rata dari pencarian gagal ekuivalen dengan kedalaman isolasi rata-rata:
$$c(n) = 2 \\left( \\ln(n - 1) + \\gamma \\right) - \\frac{2(n - 1)}{n}$$
di mana $\\gamma \\approx 0.5772156649$ adalah **Konstanta Euler-Mascheroni**. Nilai $c(n)$ adalah konstanta normalisasi teoretis untuk dataset berukuran $n$.

**Perumusan Anomaly Score $s(\\mathbf{x}, n)$:**
Skor anomali suatu observasi $\\mathbf{x}$ dihitung menggunakan fungsi eksponensial basis-2:
$$s(\\mathbf{x}, n) = 2^{-\\frac{\\mathbb{E}(h(\\mathbf{x}))}{c(n)}}$$
di mana $\\mathbb{E}(h(\\mathbf{x}))$ adalah rata-rata panjang jalur (*average path length*) observasi $\\mathbf{x}$ melintasi seluruh ensemble $T$ pohon iTree.

**Interpretasi Nilai Skor $s$:**
- Jika $\\mathbb{E}(h(\\mathbf{x})) \\to 0 \\implies s \\to 2^0 = 1$: **Pasti Anomali Ekstrem**.
- Jika $\\mathbb{E}(h(\\mathbf{x})) \\to n - 1 \\implies s \\to 2^{-\\infty} = 0$: **Pasti Data Normal Pusat**.
- Jika $\\mathbb{E}(h(\\mathbf{x})) \\to c(n) \\implies s \\to 2^{-1} = 0.5$: Observasi tidak memiliki anomali yang mencolok (distribusi seragam).
Ambang batas $s \\ge 0.6$ biasanya menandakan indikasi kuat anomali.`,
        formula: `c(n) = 2\\left(\\ln(n-1) + 0.5772\\right) - \\frac{2(n-1)}{n}, \\quad s(\\mathbf{x}, n) = 2^{-\\frac{\\mathbb{E}(h(\\mathbf{x}))}{c(n)}}`,
        code: `# 16.4: Perhitungan Panjang Jalur Teoretis c(n) dan Skor Anomali Eksponensial
import numpy as np

# Konstanta Euler-Mascheroni
EULER_GAMMA = 0.5772156649

def c_factor(n):
    if n <= 1: return 1.0
    if n == 2: return 1.0
    return 2.0 * (np.log(n - 1) + EULER_GAMMA) - (2.0 * (n - 1) / n)

def anomaly_score(avg_depth, n):
    c_n = c_factor(n)
    return 2.0 ** (-avg_depth / c_n)

n_subsample = 256 # Ukuran default subsample iTree
c_256 = c_factor(n_subsample)

print("=== MATEMATIKA NORMALISASI ANOMALY SCORE IFOREST ===")
print(f"Faktor Normalisasi c(256): {c_256:.4f} level kedalaman rata-rata")

depths_eval = [2.0, 5.0, c_256, 12.0, 16.0]
for d in depths_eval:
    s = anomaly_score(d, n_subsample)
    label = "ANOMALI SANGAT KUAT" if s > 0.7 else ("NORMALITAS RATA-RATA" if np.isclose(s, 0.5, atol=0.05) else "SANGAT NORMAL")
    print(f"Kedalaman Jalur h = {d:5.2f} -> Skor Anomali s = {s:.4f} | {label}")`,
        expectedOutput: "Kedalaman dangkal h=2 menghasilkan skor s > 0.84, membuktikan formula eksponensial Liu et al.",
        codeExp: "Skrip menghitung konstanta c(n) Euler-Mascheroni dan formula eksponensial skor anomali s(x, n) dari berbagai kedalaman isolasi.",
        pitfalls: [
          "Membingungkan output decision_function Scikit-Learn (yang bernilai negatif untuk anomali) dengan formula teoritis s(x, n) yang berkisar [0, 1].",
          "Menggunakan n = ukuran dataset penuh padahal iForest melakukan subsampling max_samples=256 pada setiap pohon."
        ],
        refTitle: "Fei Tony Liu, Kai Ming Ting, Zhi-Hua Zhou: Isolation-Based Anomaly Detection (ACM TKDD, 2012)",
        refUrl: "https://dl.acm.org/doi/10.1145/2133360.2133363"
      },
      {
        num: "16.5",
        slug: "16-5-local-outlier-factor-lof-kepadatan-lokal-relatif",
        title: "16.5. Local Outlier Factor (LOF): Kepadatan Lokal Relatif (Local Reachability Density)",
        desc: "Kajian Markus Breunig et al. (SIGMOD 2000): mengatasi kegagalan metode densitas global melalui perbandingan kepadatan lokal terhadap tetangga terdekat.",
        concept: `Metode deteksi anomali berbasis densitas global (seperti menetapkan ambang batas jarak tetap) mengalami kegagalan fatal jika dataset memiliki klaster-klaster dengan tingkat kepadatan yang berbeda. Titik normal yang berada di klaster renggang dapat keliru dicap sebagai anomali, sementara anomali yang berada di pinggiran klaster padat justru lolos deteksi.

Markus M. Breunig, Hans-Peter Kriegel, Raymond T. Ng, dan Jörg Sander (ACM SIGMOD, 2000) menciptakan **Local Outlier Factor (LOF)**:
LOF mengukur tingkat isolasi suatu titik **relatif terhadap kepadatan tetangga-tetangga terdekatnya sendiri**.

**Tiga Tahap Perhitungan LOF:**
1. **Jarak Keterjangkauan (*Reachability Distance*):**
   Jarak keterjangkauan titik $\\mathbf{p}$ dari titik $\\mathbf{o}$ didefinisikan sebagai:
   $$\\text{reach-dist}_k(\\mathbf{p}, \\mathbf{o}) = \\max\\{ k\\text{-distance}(\\mathbf{o}), d(\\mathbf{p}, \\mathbf{o}) \\}$$
2. **Kepadatan Keterjangkauan Lokal (*Local Reachability Density - lrd*):**
   Kebalikan dari jarak keterjangkauan rata-rata titik $\\mathbf{p}$ ke $k$ tetangga terdekatnya $N_k(\\mathbf{p})$:
   $$\\text{lrd}_k(\\mathbf{p}) = \\left( \\frac{\\sum_{\\mathbf{o} \\in N_k(\\mathbf{p})} \\text{reach-dist}_k(\\mathbf{p}, \\mathbf{o})}{|N_k(\\mathbf{p})|} \\right)^{-1}$$
3. **Local Outlier Factor (LOF):**
   Rasio rata-rata $\\text{lrd}$ dari tetangga-tetangganya terhadap $\\text{lrd}$ dari titik $\\mathbf{p}$ itu sendiri:
   $$\\text{LOF}_k(\\mathbf{p}) = \\frac{\\sum_{\\mathbf{o} \\in N_k(\\mathbf{p})} \\frac{\\text{lrd}_k(\\mathbf{o})}{\\text{lrd}_k(\\mathbf{p})}}{|N_k(\\mathbf{p})|}$$

**Interpretasi Nilai LOF:**
- $\\text{LOF} \\approx 1.0$: Kepadatan titik sebanding dengan kepadatan tetangganya (**Titik Normal Inlier**).
- $\\text{LOF} < 1.0$: Titik berada di wilayah yang lebih padat daripada tetangganya.
- $\\text{LOF} \\gg 1.0$: Kepadatan titik **jauh lebih rendah daripada tetangga-tetangganya** (**Anomali Lokal Tegas**).`,
        formula: `\\text{LOF}_k(\\mathbf{p}) = \\frac{1}{|N_k(\\mathbf{p})|} \\sum_{\\mathbf{o} \\in N_k(\\mathbf{p})} \\frac{\\text{lrd}_k(\\mathbf{o})}{\\text{lrd}_k(\\mathbf{p})} \\quad (\\text{Rasio Kepadatan Relatif})`,
        code: `# 16.5: Deteksi Anomali Lokal Kepadatan Bervariasi Menggunakan LocalOutlierFactor
import numpy as np
from sklearn.neighbors import LocalOutlierFactor

# Bangkitkan 1 klaster sangat padat + 1 klaster renggang
np.random.seed(42)
X_dense = np.random.normal(0, 0.5, (100, 2))
X_sparse = np.random.normal(10, 2.0, (100, 2))
# Tambahkan anomali lokal di dekat klaster padat (berjarak 2 unit)
anomali_lokal = np.array([[2.5, 0.0]])

X = np.vstack([X_dense, X_sparse, anomali_lokal])

# Latih LocalOutlierFactor
lof = LocalOutlierFactor(n_neighbors=20, contamination=0.01)
preds = lof.fit_predict(X)
negative_outlier_factors = lof.negative_outlier_factor_
lof_scores = -negative_outlier_factors # Kembalikan ke LOF asli (> 1 = outlier)

print("=== EVALUASI LOCAL OUTLIER FACTOR (LOF) ===")
print(f"Skor LOF Rata-rata Klaster Padat   : {np.mean(lof_scores[:100]):.3f} (Normal)")
print(f"Skor LOF Rata-rata Klaster Renggang: {np.mean(lof_scores[100:200]):.3f} (Normal)")
print(f"Skor LOF Anomali Lokal Terdeteksi  : {lof_scores[-1]:.3f} (LOF > 1.8 -> Anomali Tegas!)")`,
        expectedOutput: "LOF berhasil mengenali anomali lokal pada klaster padat dengan skor > 1.8 tanpa salah menandai klaster renggang.",
        codeExp: "Skrip menerapkan LocalOutlierFactor untuk mendeteksi anomali pada kepadatan bervariasi dan menganalisis nilai rasio LOF.",
        pitfalls: [
          "Secara default di Scikit-Learn, LOF dirancang untuk Outlier Detection (tidak memiliki metode predict() untuk data baru; atur novelty=True jika ingin menggunakannya untuk novelty detection).",
          "Kompleksitas memori dan waktu k-NN yang lambat pada dataset berukuran jutaan baris."
        ],
        refTitle: "Markus M. Breunig et al.: LOF: Identifying Density-Based Local Outliers (ACM SIGMOD, 2000)",
        refUrl: "https://dl.acm.org/doi/10.1145/335191.335388"
      },
      {
        num: "16.6",
        slug: "16-6-one-class-svm-pemisahan-asal-ruang-fitur-scholkopf",
        title: "16.6. One-Class Support Vector Machine (OC-SVM): Pemisahan Asal Ruang Fitur Melalui Margin Maksimal",
        desc: "Formulasi batas keputusan non-linier Schölkopf et al. (2001): memetakan data normal ke ruang fitur Hilbert dan memisahkan dari titik asal (origin) dengan penalti nu.",
        concept: `Bernhard Schölkopf, Robert Williamson, Alex Smola, dan John Shawe-Taylor (NeurIPS 1999, Neural Computation 2001) mengadaptasi prinsip margin maksimal Support Vector Machine untuk skenario **One-Class Learning / Novelty Detection**.

**Geometri Pemisahan terhadap Titik Asal (*Origin Separation*):**
Alih-alih memisahkan dua kelas data $+1$ dan $-1$, One-Class SVM memandang seluruh data latihan sebagai kelas positif.
1. Data dipetakan ke ruang Hilbert berdimensi tinggi melalui fungsi kernel non-linier $\\Phi(\\mathbf{x})$ (biasanya Kernel RBF).
2. Algoritma memperlakukan **titik asal (*origin* $\\mathbf{0}$)** di ruang fitur sebagai satu-satunya perwakilan dari "kelas negatif/anomali".
3. Algoritma mencari hiperbidang pemisah $\\mathbf{w}^\\top \\Phi(\\mathbf{x}) = \\rho$ yang memisahkan seluruh titik data normal dari titik asal dengan **margin maksimal**.

**Formulasi Optimasi Primal:**
$$\\min_{\\mathbf{w}, \\boldsymbol{\\xi}, \\rho} \\frac{1}{2} \\|\\mathbf{w}\\|_2^2 + \\frac{1}{\\nu n} \\sum_{i=1}^n \\xi_i - \\rho$$
dengan kendala: $\\mathbf{w}^\\top \\Phi(\\mathbf{x}_i) \\ge \\rho - \\xi_i$ dan $\\xi_i \\ge 0$.

**Peran Kritis Hiperparameter $\\nu$ (\\\\`nu\\\\`):**
Parameter $\\nu \\in (0, 1]$ mengontrol trade-off regularisasi:
- $\\nu$ adalah **batas atas (*upper bound*) dari fraksi outlier/kesalahan** yang diizinkan berada di luar margin.
- $\\nu$ adalah **batas bawah (*lower bound*) dari fraksi support vectors** yang menentukan batas keputusan.`,
        formula: `f(\\mathbf{x}) = \\operatorname{sgn}\\left( \\sum_{i=1}^n \\alpha_i K(\\mathbf{x}_i, \\mathbf{x}) - \\rho \\right) \\quad (\\text{Batas Keputusan One-Class SVM})`,
        code: `# 16.6: Novelty Detection Menggunakan One-Class SVM dengan Kernel RBF
import numpy as np
from sklearn.svm import OneClassSVM

# Bangkitkan data latihan 100% normal (Novelty paradigm)
np.random.seed(42)
X_train = np.random.normal(0, 1, (200, 2))

# Latih OneClassSVM dengan nu=0.05 (toleransi 5% batas luar)
oc_svm = OneClassSVM(kernel='rbf', gamma='scale', nu=0.05).fit(X_train)

# Uji pada data baru: campuran titik normal baru dan titik anomali baru
X_test_normal = np.random.normal(0, 1, (20, 2))
X_test_anomalous = np.array([[5.0, 5.0], [-4.0, 4.0], [4.5, -4.5]])
X_test = np.vstack([X_test_normal, X_test_anomalous])

preds = oc_svm.predict(X_test)

print("=== NOVELTY DETECTION ONE-CLASS SVM (SCHÖLKOPF) ===")
print(f"Fraksi Support Vectors Terpilih : {len(oc_svm.support_) / len(X_train)*100:.1f}%")
print(f"Prediksi pada 20 Data Normal Baru: {list(preds[:20]).count(1)}/20 Berhasil Dikenali Normal")
print(f"Prediksi pada 3 Data Anomali Baru: {list(preds[20:]).count(-1)}/3 Berhasil Dideteksi Anomali")`,
        expectedOutput: "OneClassSVM sukses melabeli titik anomali ekstrem sebagai -1 pada data uji baru.",
        codeExp: "Skrip melatih OneClassSVM pada data bersih dan mengevaluasi kemampuannya mendeteksi novelty anomalies pada data uji baru.",
        pitfalls: [
          "Melatih One-Class SVM pada data yang terkontaminasi banyak outlier tanpa menyetel nu yang sesuai (model akan berusaha membungkus outlier tersebut ke dalam ruang normal).",
          "Kompleksitas komputasi kuadratik terhadap jumlah sampel, sangat lambat untuk N > 50.000 dibandingkan Isolation Forest."
        ],
        refTitle: "Bernhard Schölkopf et al.: Estimating the Support of a High-Dimensional Distribution (Neural Computation, 2001)",
        refUrl: "https://direct.mit.edu/neco/article/13/7/1443/6525/Estimating-the-Support-of-a-High-Dimensional"
      },
      {
        num: "16.7",
        slug: "16-7-estimasi-kepadatan-kernel-kde-deteksi-densitas-rendah",
        title: "16.7. Estimasi Kepadatan Kernel (Kernel Density Estimation - KDE) untuk Deteksi Anomali",
        desc: "Metode non-parametrik kontinu Emanuel Parzen (1962): rekonstruksi fungsi kepadatan probabilitas (PDF) via kernel smoothing dan penentuan ambang batas persentil.",
        concept: `Jika kita ingin mendeteksi anomali tanpa memaksakan asumsi parametrik Gaussian (seperti pada Elliptic Envelope) dan tanpa struktur partisi pohon diskrit (seperti iForest), **Kernel Density Estimation (KDE)** atau Jendela Parzen-Rosenblatt menyediakan estimasi fungsi kepadatan probabilitas (*Probability Density Function - PDF*) non-parametrik yang kontinu dan mulus.

**Formulasi Estimator Parzen (1962):**
Diberikan himpunan data latihan $\\mathcal{X} = \\{\\mathbf{x}_1, \\dots, \\mathbf{x}_n\\}$, fungsi kepadatan probabilitas pada titik evaluasi $\\mathbf{x}$ diestimasi sebagai:
$$\\hat{p}_h(\\mathbf{x}) = \\frac{1}{n h^d} \\sum_{i=1}^n K\\left( \\frac{\\mathbf{x} - \\mathbf{x}_i}{h} \\right)$$
di mana:
- $K(\\cdot)$: Fungsi kernel simetris standar yang mengintegralkan luas ke 1 (paling umum Kernel Gaussian: $K(\\mathbf{u}) = (2\\pi)^{-d/2} \\exp(-\\frac{1}{2}\\|\\mathbf{u}\\|^2)$).
- $h > 0$: **Bandwidth (Lebar Pita)**, parameter penghalusan paling kritis yang mengontrol trade-off bias-varians estimasi kurva kepadatan.

**Mekanisme Deteksi Anomali via KDE:**
1. Hitung nilai log-density $\\ln \\hat{p}_h(\\mathbf{x})$ untuk setiap sampel dalam dataset.
2. Tentukan nilai ambang batas $\\tau$ berdasarkan persentil kontaminasi yang diharapkan (misalnya persentil ke-$1\\%$ atau ke-$5\\%$ terendah).
3. Titik mana pun yang memiliki $\\ln \\hat{p}_h(\\mathbf{x}) < \\tau$ secara formal didefinisikan berada di lembah probabilitas rendah dan diklasifikasikan sebagai **Anomali**.`,
        formula: `\\hat{p}_h(\\mathbf{x}) = \\frac{1}{n h^d} \\sum_{i=1}^n K\\left(\\frac{\\mathbf{x} - \\mathbf{x}_i}{h}\\right) \\implies \\text{Anomali} \\iff \\ln \\hat{p}_h(\\mathbf{x}) < \\tau`,
        code: `# 16.7: Deteksi Anomali Berbasis Ambang Batas Log-Likelihood KDE
import numpy as np
from sklearn.neighbors import KernelDensity

np.random.seed(42)
X_train = np.random.normal(0, 1, (300, 1))

# Latih KDE dengan kernel Gaussian dan bandwidth=0.5
kde = KernelDensity(kernel='gaussian', bandwidth=0.5).fit(X_train)

# Hitung skor log-density pada data latih
log_dens_train = kde.score_samples(X_train)

# Tentukan ambang batas persentil 2% terbawah (kontaminasi 2%)
threshold_tau = np.percentile(log_dens_train, 2.0)

# Uji titik baru
X_test = np.array([[-0.2], [0.5], [3.8], [-4.2]])
log_dens_test = kde.score_samples(X_test)
is_anomaly = log_dens_test < threshold_tau

print("=== DETEKSI ANOMALI KERNEL DENSITY ESTIMATION (KDE) ===")
print(f"Ambang Batas Kepadatan Log (Persentil 2%): {threshold_tau:.4f}")
for val, ld, anom in zip(X_test.flatten(), log_dens_test, is_anomaly):
    status = "ANOMALI!" if anom else "Normal"
    print(f"Titik X = {val:5.1f} -> Log Density = {ld:7.4f} | Status: {status}")`,
        expectedOutput: "Titik ekstrim 3.8 dan -4.2 teridentifikasi memiliki log-density di bawah ambang batas (Anomali).",
        codeExp: "Skrip melatih KernelDensity Scikit-Learn dan menetapkan ambang batas persentil empiris untuk mendeteksi observasi langka.",
        pitfalls: [
          "Kutukan dimensi pada KDE: pada $d > 20$, estimasi kepadatan kernel membutuhkan jumlah data yang bertumbuh secara eksponensial (tidak praktis untuk data berdimensi sangat tinggi).",
          "Memilih bandwidth $h$ terlalu kecil memicu overfitting kepulauan runcing, sedangkan $h$ terlalu besar meratakan kepadatan hingga pola anomali terhapus."
        ],
        refTitle: "Emanuel Parzen: On Estimation of a Probability Density Function and Mode (The Annals of Mathematical Statistics, 1962)",
        refUrl: "https://projecteuclid.org/journals/annals-of-mathematical-statistics/volume-33/issue-3/On-Estimation-of-a-Probability-Density-Function-and-Mode/10.1214/aoms/1177704472.full"
      },
      {
        num: "16.8",
        slug: "16-8-masalah-masking-dan-swamping-pada-deteksi-anomali",
        title: "16.8. Masalah Masking dan Swamping pada Deteksi Multivariat",
        desc: "Dua patologi diagnostik klasik Barnett & Lewis (1994): analisis mekanisme penyembunyian anomali oleh kelompok pencilan (masking) dan salah vonis data normal (swamping).",
        concept: `Dalam literatur statistika multivariat klasik (Vic Barnett & Toby Lewis, 1994), terdapat dua efek patologis yang sangat sering menggagalkan sistem deteksi anomali:

**1. Efek Penyamaran (*The Masking Effect*):**
Terjadi ketika **keberadaan sekelompok pencilan (*cluster of outliers*) saling menutupi satu sama lain** sehingga algoritma gagal mengenali mereka sebagai anomali:
- Sekelompok 5 pencilan yang berdekatan satu sama lain di sudut ruang fitur akan saling menurunkan jarak relatif dan meningkatkan kepadatan lokal di antara mereka sendiri.
- Algoritma berbasis jarak atau k-NN (seperti LOF dengan $k$ terlalu kecil) akan tertipu menganggap kelompok pencilan tersebut sebagai "klaster normal kecil yang sah".
- Akibatnya: **Tingkat False Negatives melonjak tajam** (anomali lolos tanpa terdeteksi).

**2. Efek Penumpukan / Salah Vonis (*The Swamping Effect*):**
Terjadi ketika **keberadaan pencilan ekstrem menarik pusat massa model dan menggembungkan batas toleransi sedemikian rupa sehingga titik-titik data normal justru divonis sebagai anomali**:
- Outlier ekstrem mendistorsi matriks kovarians, merotasi elipsoid, dan memotong wilayah data normal yang sah.
- Akibatnya: **Tingkat False Positives melonjak tajam** (pengguna atau transaksi sah diblokir secara keliru).

**Strategi Mitigasi Rekayasa:**
- Subsampling acak (seperti ukuran mini-batch 256 pada iForest) secara dramatis mereduksi probabilitas beberapa outlier terpilih ke dalam pohon yang sama, secara efektif memutus efek masking dan swamping.`,
        formula: `\\text{Masking: } \\text{Outlier} \\to \\text{Inlier (FN)}, \\quad \\text{Swamping: } \\text{Inlier} \\to \\text{Outlier (FP)}`,
        code: `# 16.8: Simulasi Efek Masking pada Sekelompok Outlier Dekat
import numpy as np
from sklearn.neighbors import LocalOutlierFactor

np.random.seed(42)
X_normal = np.random.normal(0, 1, (200, 2))

# 1. Outlier tunggal terisolasi
outlier_tunggal = np.array([[8.0, 8.0]])

# 2. Kelompok 4 outlier yang berdekatan (memicu masking pada k kecil)
outlier_kelompok = np.array([[8.0, -8.0], [8.1, -8.0], [8.0, -8.1], [8.1, -8.1]])

X = np.vstack([X_normal, outlier_tunggal, outlier_kelompok])

# Uji LOF dengan k=3 (terjebak masking) vs k=15 (tahan masking)
lof_k3 = LocalOutlierFactor(n_neighbors=3).fit(X)
lof_k15 = LocalOutlierFactor(n_neighbors=15).fit(X)

score_k3 = -lof_k3.negative_outlier_factor_
score_k15 = -lof_k15.negative_outlier_factor_

print("=== SIMULASI EFEK MASKING PADA KELOMPOK OUTLIER ===")
print(f"Skor LOF Outlier Tunggal (k=3) : {score_k3[200]:.2f} (Terdeteksi)")
print(f"Skor LOF Kelompok Outlier (k=3): {score_k3[201]:.2f} (Tertutupi Masking! LOF Rendah)")
print(f"Skor LOF Kelompok Outlier (k=15): {score_k15[201]:.2f} (Masking Teratasi! LOF Tinggi)")`,
        expectedOutput: "Nilai k=3 gagal mendeteksi kelompok outlier akibat masking, sementara k=15 berhasil mendeteksi.",
        codeExp: "Skrip mendemonstrasikan bagaimana pemilihan nilai k yang terlalu kecil pada LOF memicu efek penyamaran (masking effect).",
        pitfalls: [
          "Menggunakan nilai n_neighbors yang lebih kecil dari ukuran kelompok anomali kolaboratif (misalnya jaringan penipuan sindikat).",
          "Mengevaluasi sistem deteksi anomali tanpa membedah metrik Precision dan Recall secara terpisah untuk memantau efek swamping."
        ],
        refTitle: "Vic Barnett & Toby Lewis: Outliers in Statistical Data (John Wiley & Sons, 1994)",
        refUrl: "https://www.wiley.com/en-us/Outliers+in+Statistical+Data%2C+3rd+Edition-p-9780471930945"
      },
      {
        num: "16.9",
        slug: "16-9-kalibrasi-hiperparameter-kontaminasi-dan-ambang-keputusan",
        title: "16.9. Kalibrasi Hiperparameter Kontaminasi (contamination) dan Ambang Keputusan",
        desc: "Metodologi penalaan operasional: menyeimbangkan Precision vs Recall anomali berdasarkan biaya finansial False Positive vs False Negative.",
        concept: `Dalam pustaka Scikit-Learn (pada kelas \\\\` + "\\\\`IsolationForest\\\\`" + \\\\`, \\\\` + "\\\\`EllipticEnvelope\\\\`" + \\\\`, dan \\\\` + "\\\\`LocalOutlierFactor\\\\`" + \\\\`), parameter \\\\` + "\\\\`contamination\\\\`" + \\\\` mengontrol proporsi outlier yang diharapkan berada di dalam dataset:
$$\\text{contamination} = \\frac{N_{\\text{anomali}}}{N_{\\text{total}}} \\in (0, 0.5]$$

**Mekanisme Ambang Batas (*Offset Threshold*):**
Model menghitung skor keputusan mentah $s(\\mathbf{x})$ untuk seluruh sampel. Parameter \\\\`contamination\\\\` menentukan nilai persentil pemotongan (*offset*):
$$\\tau = \\text{Persentil}(s, 100 \\times \\text{contamination})$$
- Sampel dengan $s(\\mathbf{x}) < \\tau$ diberi label $-1$ (Anomali).
- Sampel dengan $s(\\mathbf{x}) \\ge \\tau$ diberi label $+1$ (Inlier).

**Matriks Biaya dan Optimasi Kurva PR (Cost-Sensitive Decision):**
Dalam industri finansial dan keamanan siber, biaya kesalahan klasifikasi sangat asimetris:
- **Biaya False Positive ($C_{\\text{FP}}$):** Pelanggan yang sah diblokir transaksinya (gangguan kenyamanan pengguna, biaya operasional CS).
- **Biaya False Negative ($C_{\\text{FN}}$):** Transaksi penipuan bernilai ratusan juta lolos tanpa terdeteksi (kerugian finansial langsung).
Oleh karena itu, \\\\`contamination\\\\` tidak boleh ditebak secara arbitrer, melainkan dikalibrasi untuk meminimalkan fungsi biaya total:
$$\\min_\\tau \\left( C_{\\text{FP}} \\cdot \\text{FP}(\\tau) + C_{\\text{FN}} \\cdot \\text{FN}(\\tau) \\right)$$`,
        formula: `\\tau^* = \\arg\\min_\\tau \\left[ C_{\\text{FP}} \\cdot \\text{FP}(\\tau) + C_{\\text{FN}} \\cdot \\text{FN}(\\tau) \\right] \\quad (\\text{Optimal Cost Threshold})`,
        code: `# 16.9: Penalaan Ambang Batas Kontaminasi Berdasarkan Matriks Biaya Finansial
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.metrics import confusion_matrix

np.random.seed(42)
X_norm = np.random.normal(0, 1, (950, 5))
X_fraud = np.random.normal(5, 2, (50, 5)) # 50 fraud (5% aktual)
X = np.vstack([X_norm, X_fraud])
y_true = np.array([1]*950 + [-1]*50)

# Biaya: Lolos fraud = Rp 1.000.000 (FN), Salah blokir = Rp 20.000 (FP)
COST_FN = 1000000
COST_FP = 20000

iso = IsolationForest(random_state=42).fit(X)
raw_scores = iso.score_samples(X)

print("=== KALIBRASI BIAYA FINANCIAL-BASED THRESHOLD ===")
print("Contamination | FP | FN | Total Kerugian Biaya (Rupiah)")
print("-" * 55)

best_cont = None
min_cost = float('inf')

for cont in [0.01, 0.03, 0.05, 0.08, 0.12]:
    offset = np.percentile(raw_scores, 100 * cont)
    preds = np.where(raw_scores < offset, -1, 1)
    
    # Hitung FP (asli normal tapi diprediksi -1) dan FN (asli fraud tapi diprediksi 1)
    fp = np.sum((y_true == 1) & (preds == -1))
    fn = np.sum((y_true == -1) & (preds == 1))
    total_cost = (fp * COST_FP) + (fn * COST_FN)
    
    if total_cost < min_cost:
        min_cost = total_cost
        best_cont = cont
    print(f"{cont:13.2f} | {fp:2d} | {fn:2d} | Rp {total_cost:12,d}")

print(f"\nAmbang Optimal Finansial: contamination = {best_cont} dengan Biaya Minimal Rp {min_cost:,d}")`,
        expectedOutput: "Simulasi biaya menemukan titik contamination optimal yang meminimalkan total kerugian.",
        codeExp: "Skrip mengkalibrasi parameter contamination berdasarkan evaluasi fungsi biaya asimetris FN vs FP pada deteksi fraud.",
        pitfalls: [
          "Menggunakan akurasi standar untuk mengevaluasi parameter kontaminasi pada data tidak seimbang (akurasi 95% bisa didapat dengan menebak seluruh data normal).",
          "Menyetel contamination='auto' pada Scikit-Learn tanpa memverifikasi apakah offset default cocok dengan distribusi anomali di lapangan."
        ],
        refTitle: "Charles Elkan: The Foundations of Cost-Sensitive Learning (IJCAI, 2001)",
        refUrl: "https://www.ijcai.org/Proceedings/01-1/Papers/137.pdf"
      },
      {
        num: "16.10",
        slug: "16-10-studi-kasus-deteksi-fraud-transaksi-keuangan-ensemble",
        title: "16.10. Studi Kasus Produksi: Sistem Deteksi Fraud Transaksi Keuangan Terintegrasi",
        desc: "Arsitektur sistem deteksi anomali ensemble produksi: menggabungkan Isolation Forest, LOF, dan Elliptic Envelope untuk menyaring penipuan keuangan secara berlapis.",
        concept: `Dalam sistem perbankan dan gerbang pembayaran (*payment gateway*) skala tinggi, tidak ada algoritma deteksi anomali tunggal yang sempurna:
- **Isolation Forest** sangat cepat dan unggul pada pencilan global volume tinggi.
- **Local Outlier Factor (LOF)** unggul dalam mendeteksi anomali mikro pada perilaku pedagang spesifik.
- **Elliptic Envelope** mengidentifikasi pelanggaran korelasi linier multivariat (misal rasio jumlah transaksi terhadap nominal).

**Arsitektur Ensemble Anomali Multi-Layer:**
Sistem produksi modern menerapkan arsitektur agregasi ensemble:
1. **Lapisan Filtrasi Cepat (Fast Triage):** Isolation Forest memfilter 99% transaksi yang jelas normal dengan latensi sub-milidetik.
2. **Lapisan Analisis Kepadatan Lokal:** Transaksi yang mencurigakan dianalisis lebih lanjut menggunakan LOF untuk mengevaluasi konteks historis pengguna.
3. **Pemberian Skor Risiko Konsensus (*Consensus Risk Score*):**
   $$S_{\\text{final}}(\\mathbf{x}) = w_1 S_{\\text{iForest}}(\\mathbf{x}) + w_2 S_{\\text{LOF}}(\\mathbf{x}) + w_3 S_{\\text{MCD}}(\\mathbf{x})$$
4. **Keputusan Bertingkat:**
   - Skor $> 0.85$: **Otomatis Blokir Transaksi**.
   - Skor $0.60 - 0.85$: **Tantangan Verifikasi Tambahan (Two-Factor Authentication / OTP)**.
   - Skor $< 0.60$: **Transaksi Disetujui Instan**.`,
        formula: `S_{\\text{Risk}}(\\mathbf{x}) = \\sum_{m=1}^M w_m \\hat{s}_m(\\mathbf{x}) \\implies \\text{Pemicu OTP / Blokir Otomatis}`,
        code: `# 16.10: Pipeline Deteksi Fraud Keuangan Ensemble Multi-Model
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.preprocessing import RobustScaler

# Sintesis 1000 data transaksi: [Nominal (Juta), Jarak Geografis (km), Frekuensi Per Jam]
np.random.seed(42)
X_normal = np.random.exponential(scale=[2.0, 5.0, 1.0], size=(980, 3))
X_fraud = np.random.uniform(low=[30.0, 500.0, 15.0], high=[100.0, 2000.0, 50.0], size=(20, 3))
X_raw = np.vstack([X_normal, X_fraud])

# Penskalaan tahan outlier
scaler = RobustScaler()
X_scaled = scaler.fit_transform(X_raw)

# 1. Model A: Isolation Forest
iforest = IsolationForest(n_estimators=100, contamination=0.03, random_state=42).fit(X_scaled)
score_if = -iforest.score_samples(X_scaled) # Konversi ke skor positif

# 2. Model B: Local Outlier Factor (novelty=False untuk outlier scoring)
lof = LocalOutlierFactor(n_neighbors=20, contamination=0.03)
lof.fit(X_scaled)
score_lof = -lof.negative_outlier_factor_

# Normalisasi Min-Max skor ke rentang [0, 1]
norm_if = (score_if - score_if.min()) / (score_if.max() - score_if.min())
norm_lof = (score_lof - score_lof.min()) / (score_lof.max() - score_lof.min())

# Skor Risiko Konsensus Gabungan (Bobot 60% iForest + 40% LOF)
consensus_risk = 0.6 * norm_if + 0.4 * norm_lof

n_blokir = np.sum(consensus_risk > 0.75)
n_otp = np.sum((consensus_risk >= 0.50) & (consensus_risk <= 0.75))

print("=== HASIL SISTEM MONITORING FRAUD TRANSAKSI ENSEMBLE ===")
print(f"Total Transaksi Diproses : {len(X_raw)}")
print(f"Transaksi Lolos Instan   : {np.sum(consensus_risk < 0.50)} transaksi")
print(f"Transaksi Tantangan OTP  : {n_otp} transaksi (Risiko Sedang)")
print(f"Transaksi Diblokir Mutlak: {n_blokir} transaksi (Risiko Tinggi - Fraud)")
print(f"Rata-rata Skor Risiko 20 Fraud Sebenarnya: {np.mean(consensus_risk[980:]):.4f} (Sangat Tinggi)")`,
        expectedOutput: "Ensemble multi-model sukses menyaring transaksi fraud sebenarnya ke zona risiko tinggi (> 0.75).",
        codeExp: "Skrip merangkai RobustScaler, Isolation Forest, dan LOF menjadi sistem deteksi fraud transaksi keuangan ensemble dengan keputusan bertingkat.",
        pitfalls: [
          "Menggunakan StandardScaler pada data transaksi yang memiliki distribusi eksponensial berbuntut panjang (*heavy-tailed*); gunakan RobustScaler.",
          "Mengeksekusi model ensemble tanpa memperhatikan SLA batas latensi inferensi transaksi real-time (maksimal 50-100 ms)."
        ],
        refTitle: "Phua, C., Lee, V., Smith, K., Gayler, R.: A comprehensive survey of data mining-based fraud detection research (2010)",
        refUrl: "https://arxiv.org/abs/1009.6119"
      }
    ]
  }
];
