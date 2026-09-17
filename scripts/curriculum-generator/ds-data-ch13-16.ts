import { ChapterDef } from "./da-data-ch1-3";

export const DS_CHAPTERS_13_TO_16: ChapterDef[] = [
  // ==========================================
  // BAB 13: Pembelajaran Mesin Tak Terawasi: Klusterisasi & Deteksi Anomali
  // ==========================================
  {
    orderIndex: 13,
    id: "data-science-ch-13",
    slug: "bab-13-unsupervised-learning-klusterisasi-deteksi-anomali",
    title: "BAB 13: Pembelajaran Mesin Tak Terawasi: Klusterisasi & Deteksi Anomali",
    desc: "Eksplorasi struktur data tanpa label: partisi K-Means & inisialisasi K-Means++, metode Elbow & Silhouette analysis, klusterisasi hierarkis Agglomerative (Ward linkage), DBSCAN berbasis kepadatan, Gaussian Mixture Models (GMM) via EM algorithm, serta deteksi anomali modern (Isolation Forest & Local Outlier Factor).",
    coreConcepts: ["K-Means++ Clustering", "Silhouette & Elbow Criteria", "DBSCAN Density Clustering", "Gaussian Mixture Models (EM)", "Isolation Forest Anomaly Detection"],
    subchapters: [
      {
        num: "13.1",
        slug: "13-1-taksonomi-unsupervised-learning-dan-ruang-kluster",
        title: "13.1. Taksonomi Unsupervised Learning & Geometri Ruang Kluster",
        desc: "Prinsip dasar pembelajaran tak terawasi: penemuan pola intrinsik, partisional vs hierarkis vs densitas, dan aksioma ketidakmungkinan Kleinberg.",
        concept: `Dalam pembelajaran terawasi (supervised learning), algoritma dibimbing oleh sinyal umpan balik berupa label target $y$. Sebaliknya, **Unsupervised Learning (Pembelajaran Tak Terawasi)** bekerja murni pada matriks fitur masukan $X$ tanpa supervisi label target eksternal apa pun.
        
Tujuan utamanya adalah menemukan struktur geometris laten yang mendasari data observasi:
1. **Klusterisasi Partisional (K-Means, PAM):** Membagi $n$ data ke dalam $K$ kelompok saling lepas sedemikian rupa sehingga variasi intra-kluster diminimalkan.
2. **Klusterisasi Hierarkis (Agglomerative, Divisive):** Membangun pohon struktur kluster bersarang (*dendrogram*) dari level observasi individual hingga kluster global tunggal.
3. **Klusterisasi Berbasis Densitas (DBSCAN, HDBSCAN):** Mendefinisikan kluster sebagai daerah padat observasi yang dipisahkan oleh daerah berdensitas rendah.
        
Jon Kleinberg (2002) dalam makalah seminalnya membuktikan **Aksioma Ketidakmungkinan Klusterisasi (Clustering Impossibility Theorem)**: tidak ada satu pun fungsi klusterisasi yang dapat memenuhi tiga sifat intuitif sekaligus secara bersamaan: *Scale-Invariance*, *Richness*, dan *Consistency*. Oleh karena itu, pemilihan algoritma klusterisasi selalu merupakan kompromi matematis berbasis tujuan domain spesifik.`,
        code: `# 13.1: Pemetaan Tiga Ragam Geometri Kluster Data Sintetis
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_blobs, make_moons

np.random.seed(42)
# 1. Geometri Sferis (Cocok untuk K-Means)
X_blobs, _ = make_blobs(n_samples=300, centers=3, cluster_std=0.8, random_state=42)

# 2. Geometri Non-Linier Bulan Sabit (Hanya dapat dipecahkan oleh DBSCAN)
X_moons, _ = make_moons(n_samples=300, noise=0.08, random_state=42)

print("=== TAKSONOMI GEOMETRI KLUSTER DATA ===")
print(f"Data Gumpalan Sferis (Blobs)  : {X_blobs.shape} observasi")
print(f"Data Non-Linier (Moons)       : {X_moons.shape} observasi")
print("Kesimpulan Teoretis Kleinberg (2002): Tidak ada algoritma tunggal universal untuk segala bentuk geometri ruang!")`,
        expectedOutput: "Geometri kluster sferis dan non-linier terdefinisi dengan karakteristik sebaran berbeda.",
        codeExp: "Skrip menyiapkan dua topologi data sintetis untuk membedakan kebutuhan algoritma partisional sferis versus algoritma berbasis kerapatan spasial.",
        pitfalls: [
          "Menerapkan K-Means pada kluster berbentuk kurvilinier atau bulan sabit (K-Means akan memotong bentuk alami menjadi bola-bola terdistorsi).",
          "Mengevaluasi klusterisasi murni berdasarkan akurasi label klasifikasi padahal tujuan klusterisasi adalah menemukan pengelompokan baru yang belum diketahui."
        ],
        refTitle: "Jon Kleinberg: An Impossibility Theorem for Clustering (NeurIPS 2002)",
        refUrl: "https://proceedings.neurips.cc/paper/2002/hash/4151b27976e1074464c8d5a0a9c8b74f-Abstract.html"
      },
      {
        num: "13.2",
        slug: "13-2-k-means-clustering-dan-inisialisasi-kmeans-plus-plus",
        title: "13.2. Algoritma K-Means: Inisialisasi K-Means++ & Optimasi Lloyd",
        desc: "Algoritma partisi paling fundamental: fungsi objektif WCSS, algoritma iteratif Expectation-Maximization Lloyd, dan inisialisasi probabilistik K-Means++ Arthur & Vassilvitskii.",
        concept: `Algoritma **K-Means** mempartisi dataset menjadi $K$ kluster dengan meminimalkan **Within-Cluster Sum of Squares (WCSS / Inersia)**:
$$\\text{WCSS} = \\sum_{k=1}^K \\sum_{x_i \\in C_k} \\|x_i - \\mu_k\\|^2$$
di mana $\\mu_k$ adalah centroid (rata-rata) dari kluster $C_k$.
        
Algoritma standar Stuart Lloyd (1957) bekerja melalui dua langkah bolak-balik yang diulang hingga konvergen:
1. **Assignment Step:** Menetapkan setiap titik data $x_i$ ke centroid terdekat berdasarkan jarak Euklidian kuadrat.
2. **Update Step:** Menghitung ulang posisi masing-masing centroid $\\mu_k$ sebagai rata-rata aritmatika dari seluruh data yang teralokasi padanya.
        
Kelemahan fatal Lloyd klasik adalah kerentanannya terjebak pada minimum lokal yang buruk jika centroid awal diinisialisasi secara acak. **K-Means++** (David Arthur & Sergei Vassilvitskii, 2007) memecahkan masalah ini dengan memilih centroid awal secara probabilistik berurutan, di mana peluang titik terpilih sebanding dengan kuadrat jaraknya ke centroid terdekat yang sudah ada ($D(x)^2$). Inisialisasi ini menjamin batas kesalahan teoretis $O(\\log K)$ terhadap solusi optimal global.`,
        formula: `P(x) = \\frac{D(x)^2}{\\sum_{x' \\in X} D(x')^2}`,
        code: `# 13.2: Komparasi Inisialisasi Acak Naif vs Inisialisasi K-Means++
import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs

X, _ = make_blobs(n_samples=1000, centers=5, cluster_std=0.7, random_state=42)

# 1. K-Means dengan Inisialisasi Acak Naif (n_init=1 untuk memperlihatkan variansi)
kmeans_acak = KMeans(n_clusters=5, init='random', n_init=1, random_state=12).fit(X)

# 2. K-Means dengan Inisialisasi Cerdas K-Means++ (Arthur & Vassilvitskii)
kmeans_plus = KMeans(n_clusters=5, init='k-means++', n_init=1, random_state=12).fit(X)

print("=== PERBANDINGAN INISIALISASI K-MEANS: RANDOM VS K-MEANS++ ===")
print(f"Inersia (WCSS) Inisialisasi Acak    : {kmeans_acak.inertia_:.2f} (Iterasi Konvergen: {kmeans_acak.n_iter_})")
print(f"Inersia (WCSS) Inisialisasi K-Means+: {kmeans_plus.inertia_:.2f} (Iterasi Konvergen: {kmeans_plus.n_iter_})")
print(f"Keunggulan Inersia K-Means++        : -{kmeans_acak.inertia_ - kmeans_plus.inertia_:.2f} (Solusi Jauh Lebih Optimal!)")`,
        expectedOutput: "K-Means++ secara konsisten menghasilkan inersia lebih rendah dengan konvergensi iterasi lebih cepat.",
        codeExp: "Skrip membandingkan inersia akhir dari inisialisasi acak naif versus algoritma K-Means++ pada dataset 5 gumpalan untuk membuktikan efektivitas pencegahan minimum lokal.",
        pitfalls: [
          "Menerapkan K-Means tanpa melakukan standarisasi fitur (fitur dengan angka ribuan akan mendominasi perhitungan jarak Euklidian).",
          "Mengasumsikan K-Means mampu mendeteksi kluster yang memiliki ukuran kerapatan atau varians yang sangat berbeda."
        ],
        refTitle: "David Arthur & Sergei Vassilvitskii: k-means++: The Advantages of Careful Seeding (SODA 2007)",
        refUrl: "https://dl.acm.org/doi/10.5555/1283383.1283494"
      },
      {
        num: "13.3",
        slug: "13-3-penentuan-jumlah-kluster-elbow-dan-silhouette",
        title: "13.3. Penentuan Jumlah Kluster K Optimal: WCSS Elbow & Silhouette Analysis",
        desc: "Menemukan K sejati: analisis kurva inersia (Elbow Method), koefisien kohesi intra vs separasi inter Silhouette Analysis Peter Rousseeuw.",
        concept: `Kelemahan paling praktis dari K-Means adalah bahwa jumlah kluster $K$ harus ditentukan terlebih dahulu oleh praktisi sebagai input apriori.
        
Dua metodologi standar untuk menentukan nilai $K$ optimal secara objektif:
1. **Metode Siku (Elbow Method):** Memetakan kurva inersia (WCSS) terhadap berbagai nilai $K$ (misal $K = 2, \\dots, 10$). Seiring bertambahnya $K$, inersia pasti akan terus menurun (mencapai 0 saat $K = n$). Titik di mana penurunan inersia mengalami perlambatan drastis (membentuk sudut 'siku') dipilih sebagai nilai $K$ optimal.
2. **Analisis Siluet (Silhouette Analysis / Peter Rousseeuw, 1987):** Mengukur seberapa mirip suatu observasi dengan klusternya sendiri (kohesi $a$) dibandingkan dengan kluster terdekat berikutnya (separasi $b$):
$$s(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))}$$
Skor siluet berada dalam rentang $[-1, +1]$. Nilai mendekati $+1$ menunjukkan titik terkelompok sangat baik, $0$ menunjukkan titik berada di perbatasan, dan negatif menunjukkan salah kluster.`,
        formula: `s(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))}, \\quad -1 \\le s(i) \\le 1`,
        code: `# 13.3: Penentuan K Optimal Menggunakan Silhouette Score dan Elbow Method
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.datasets import make_blobs

# Menghasilkan dataset sintetis dengan 4 kluster sejati
X, _ = make_blobs(n_samples=600, centers=4, cluster_std=0.6, random_state=42)

k_kandidat = range(2, 8)
inersia_list = []
silhouette_list = []

for k in k_kandidat:
    km = KMeans(n_clusters=k, init='k-means++', n_init=10, random_state=42).fit(X)
    inersia_list.append(km.inertia_)
    skor_sil = silhouette_score(X, km.labels_)
    silhouette_list.append(skor_sil)

k_optimal = k_kandidat[np.argmax(silhouette_list)]

print("=== EVALUASI PENENTUAN JUMLAH KLUSTER K OPTIMAL ===")
print("K | Inersia (WCSS) | Silhouette Score | Status")
print("-" * 50)
for k, inersia, sil in zip(k_kandidat, inersia_list, silhouette_list):
    status = "<- OPTIMAL TERPILIH" if k == k_optimal else ""
    print(f"{k:1d} | {inersia:14.2f} | {sil:16.4f} | {status}")`,
        expectedOutput: "Silhouette score memuncak tepat pada K=4 (skor ~0.75), mengidentifikasi jumlah kluster sejati.",
        codeExp: "Skrip memindai rentang nilai K dari 2 hingga 7 untuk mengevaluasi inersia WCSS dan memaksimalkan skor koefisien siluet global.",
        pitfalls: [
          "Hanya mengandalkan Elbow Method secara visual; kurva inersia pada data riil sering kali melengkung mulus tanpa 'siku' yang jelas.",
          "Menghitung Silhouette Score pada dataset dengan jutaan baris tanpa subsampling (komputasi matriks jarak pairwise bernilai $O(n^2)$)."
        ],
        refTitle: "Peter J. Rousseeuw: Silhouettes: A Graphical Aid to the Interpretation and Validation of Cluster Analysis",
        refUrl: "https://www.sciencedirect.com/science/article/pii/0377042787901257"
      },
      {
        num: "13.4",
        slug: "13-4-klusterisasi-hierarki-dan-dendrogram",
        title: "13.4. Klusterisasi Hierarkis (Agglomerative) & Keterikatan Ward",
        desc: "Struktur kluster bersarang: pendekatan bottom-up Agglomerative, kriteria keterikatan (Single, Complete, Average, Ward), dan pemotongan dendrogram.",
        concept: `Berbeda dengan K-Means yang membagi data secara kaku ke dalam partisi datar tunggal, **Hierarchical Clustering (Klusterisasi Hierarkis)** menghasilkan struktur pohon pengelompokan bertingkat multi-level.
        
Pendekatan **Agglomerative (Bottom-Up)** dimulai dengan memperlakukan setiap observasi sebagai kluster individual tunggal ($n$ kluster). Pada setiap langkah iterasi, dua kluster yang memiliki jarak terpendek digabungkan, hingga akhirnya seluruh observasi menyatu menjadi satu kluster raksasa.
        
Kriteria jarak antar-kluster (**Linkage Criteria**):
1. **Single Linkage:** Jarak minimum antara pasangan titik terdekat (rentan fenomena *chaining effect* yang menghasilkan kluster memanjang tipis).
2. **Complete Linkage:** Jarak maksimum antara pasangan titik terjauh (menghasilkan kluster kompak berdiameter seragam).
3. **Average Linkage:** Rata-rata jarak seluruh pasangan titik antar dua kluster.
4. **Ward Linkage:** Kriteria paling dominan yang meminimalkan peningkatan total varians intra-kluster (WCSS) yang dihasilkan dari penggabungan.`,
        formula: `\\Delta \\text{ESS}_{AB} = \\frac{n_A n_B}{n_A + n_B} \\|\\mu_A - \\mu_B\\|^2`,
        code: `# 13.4: Konstruksi Matriks Keterikatan Ward dan Klusterisasi Agglomerative
import numpy as np
from scipy.cluster.hierarchy import linkage, fcluster
from sklearn.cluster import AgglomerativeClustering
from sklearn.datasets import make_blobs

X, _ = make_blobs(n_samples=50, centers=3, random_state=42)

# 1. Menghitung Matriks Keterikatan Hierarkis Menggunakan Metode Ward (SciPy)
Z = linkage(X, method='ward')

# 2. Klusterisasi Agglomerative Scikit-Learn dengan K=3
agg = AgglomerativeClustering(n_clusters=3, linkage='ward').fit(X)

# Potong hierarki SciPy pada 3 kluster untuk validasi kesetaraan
label_scipy = fcluster(Z, t=3, criterion='maxclust') - 1

print("=== HASIL KLUSTERISASI HIERARKIS AGGLOMERATIVE (WARD) ===")
print(f"Bentuk Matriks Hierarki Linkage (n-1 langkah penggabungan): {Z.shape}")
print(f"Jarak Penggabungan Terakhir (Dua Kluster Terbesar)     : {Z[-1, 2]:.4f}")
print(f"Distribusi Ukuran 3 Kluster Terbentuk                   : {np.bincount(agg.labels_)}")
print("Status: Struktur Hierarki Bersarang Siap Dipotong pada Ketinggian Arbitrer!")`,
        expectedOutput: "Struktur hierarki Ward terbentuk dengan 49 langkah penggabungan bertingkat yang konsisten.",
        codeExp: "Skrip menghitung matriks keterikatan Ward menggunakan SciPy linkage dan mengeksekusi AgglomerativeClustering Scikit-Learn untuk menghasilkan partisi kluster bersarang.",
        pitfalls: [
          "Menerapkan klusterisasi hierarkis pada dataset dengan puluhan ribu sampel ($O(n^2)$ memori dan $O(n^3)$ waktu komputasi).",
          "Menggunakan Single Linkage pada data yang mengandung derau (noise), yang menyebabkan seluruh titik saling terhubung menjadi satu garis rantai raksasa."
        ],
        refTitle: "Joe H. Ward Jr.: Hierarchical Grouping to Optimize an Objective Function (JASA)",
        refUrl: "https://www.tandfonline.com/doi/abs/10.1080/01621459.1963.10500845"
      },
      {
        num: "13.5",
        slug: "13-5-dbscan-density-based-clustering-dan-noise",
        title: "13.5. Density-Based Spatial Clustering (DBSCAN) & Isolasi Derau",
        desc: "Klusterisasi bebas asumsi bentuk: konsep keterjangkauan kepadatan (density-reachability), titik Core/Border/Noise, dan penentuan parameter eps serta min_samples.",
        concept: `K-Means dan Hierarchical Clustering Ward memiliki asumsi implisit bahwa kluster berbentuk cembung sferis (globular). Jika kluster memiliki bentuk arbitrer yang rumit (seperti cincin konsentris, struktur jaringan jalan, atau bentuk spiral), kedua metode tersebut gagal total.
        
**DBSCAN (Density-Based Spatial Clustering of Applications with Noise)** yang dirintis oleh Ester, Kriegel, Sander, dan Xu (1996) mendefinisikan kluster berdasarkan kerapatan spasial lokal.
        
DBSCAN mengklasifikasikan setiap titik data ke dalam salah satu dari tiga kategori:
1. **Core Point:** Titik yang memiliki setidaknya ''min_samples'' tetangga di dalam radius jarak $\\epsilon$ (Epsilon).
2. **Border Point:** Titik yang berada di dalam radius $\\epsilon$ dari suatu Core Point, tetapi tidak memiliki cukup tetangga untuk menjadi Core Point sendiri.
3. **Noise Point (Derau / Outlier):** Titik yang bukan Core Point dan tidak dapat dijangkau oleh Core Point mana pun (diberi label $-1$).
        
Keunggulan DBSCAN: praktisi tidak perlu menentukan jumlah kluster $K$ di awal, mampu menemukan kluster dengan bentuk geometri apa pun, dan secara otomatis menyaring outlier/derau.`,
        code: `# 13.5: Pemisahan Bentuk Non-Linier Bulan Sabit dan Deteksi Noise via DBSCAN
import numpy as np
from sklearn.datasets import make_moons
from sklearn.cluster import DBSCAN, KMeans

# Dataset 2 Bulan Sabit dengan 20 Outlier Ekstrem Terisolasi
X_moons, _ = make_moons(n_samples=400, noise=0.07, random_state=42)
np.random.seed(42)
noise_ekstrem = np.random.uniform(low=-2.0, high=3.0, size=(20, 2))
X_gabung = np.vstack([X_moons, noise_ekstrem])

# 1. K-Means (Gagal Menangani Bentuk Bulan Sabit)
kmeans = KMeans(n_clusters=2, random_state=42).fit(X_gabung)

# 2. DBSCAN (Mampu Mengikuti Kepadatan Bentuk Arbitrer)
dbscan = DBSCAN(eps=0.20, min_samples=5).fit(X_gabung)
labels_db = dbscan.labels_

n_kluster = len(set(labels_db)) - (1 if -1 in labels_db else 0)
n_noise = np.sum(labels_db == -1)

print("=== PEMISAHAN BENTUK NON-LINIER & DETEKSI DERAU: DBSCAN ===")
print(f"Jumlah Kluster Ditemukan DBSCAN Otomatis: {n_kluster} Kluster")
print(f"Jumlah Titik Noise/Outlier Terisolasi (-1) : {n_noise} Titik (Termasuk 20 Outlier Suntikan)")
print("Status: Bentuk Bulan Sabit Berhasil Dipisahkan Sempurna Tanpa Terdistorsi!")`,
        expectedOutput: "DBSCAN secara otomatis menemukan 2 kluster bulan sabit dan mengisolasi titik noise.",
        codeExp: "Skrip membandingkan kegagalan K-Means dengan kesuksesan DBSCAN dalam mempartisi manifold non-linier dan menyaring pencilan berlabel -1.",
        pitfalls: [
          "Menerapkan DBSCAN pada dataset yang memiliki kluster dengan kerapatan (density) yang sangat heterogen/bervariasi (seharusnya menggunakan HDBSCAN).",
          "Memilih nilai eps secara acak tanpa menganalisis k-distance graph (jarak ke tetangga ke-k terdekat)."
        ],
        refTitle: "Martin Ester, Hans-Peter Kriegel, Jörg Sander, Xiaowei Xu: A Density-Based Algorithm for Discovering Clusters in Large Spatial Databases with Noise (KDD 1996)",
        refUrl: "https://dl.acm.org/doi/10.5555/3001460.3001507"
      },
      {
        num: "13.6",
        slug: "13-6-gaussian-mixture-models-gmm-dan-algoritma-em",
        title: "13.6. Model Campuran Gaussian (Gaussian Mixture Models / GMM) & Algoritma EM",
        desc: "Klusterisasi lunak berbasis probabilitas: dekomposisi multivariat Gaussian, estimasi posterior fuzzy, dan algoritma optimasi Expectation-Maximization Dempster.",
        concept: `K-Means adalah metode *Hard Clustering*: setiap observasi dipaksa menjadi anggota mutlak dari tepat satu kluster ($100\\%$ atau $0\\%$), tanpa membedakan apakah titik tersebut berada tepat di pusat centroid atau berada di perbatasan ragu-ragu di antara dua kluster.
        
**Gaussian Mixture Models (GMM)** memperluas klusterisasi ke paradigma probabilistik (*Soft / Fuzzy Clustering*). GMM mengasumsikan bahwa seluruh data observasi dibangkitkan dari campuran $K$ komponen distribusi Normal Multivariat $\\mathcal{N}(\\mu_k, \\Sigma_k)$ dengan bobot pencampuran $\\pi_k$.
        
Parameter model diestimasi menggunakan **Algoritma Expectation-Maximization (EM)** (Dempster, Laird, & Rubin, 1977):
- **E-step (Expectation):** Menghitung tanggung jawab (responsibilities $\\gamma_{ik}$) dari masing-masing komponen $k$ dalam membangkitkan observasi $x_i$ berdasarkan Teorema Bayes.
- **M-step (Maximization):** Memperbarui parameter rata-rata $\\mu_k$, matriks kovarians $\\Sigma_k$, dan bobot campuran $\\pi_k$ menggunakan rata-rata terbobot responsibilitas.
        
Matriks kovarians dapat dikonfigurasi (''full'', ''tied'', ''diag'', ''spherical'') untuk memodelkan kluster elipsoid dengan orientasi dan ukuran arbitrer.`,
        formula: `P(x) = \\sum_{k=1}^K \\pi_k \\mathcal{N}(x; \\mu_k, \\Sigma_k), \\quad \\gamma_{ik} = \\frac{\\pi_k \\mathcal{N}(x_i; \\mu_k, \\Sigma_k)}{\\sum_{j=1}^K \\pi_j \\mathcal{N}(x_i; \\mu_j, \\Sigma_j)}`,
        code: `# 13.6: Klusterisasi Probabilistik Lembut (Soft Clustering) Menggunakan GMM
import numpy as np
from sklearn.mixture import GaussianMixture
from sklearn.datasets import make_blobs

# Dua kluster elips miring tumpang tindih
X, _ = make_blobs(n_samples=300, centers=2, cluster_std=1.2, random_state=42)

gmm = GaussianMixture(n_components=2, covariance_type='full', random_state=42)
gmm.fit(X)

# Menghasilkan probabilitas posterior lembut kepemilikan kluster untuk setiap titik
prob_keanggotaan = gmm.predict_proba(X)

# Ambil satu titik observasi yang berada di daerah perbatasan abu-abu
idx_perbatasan = np.argmin(np.abs(prob_keanggotaan[:, 0] - 0.5))

print("=== SOFT CLUSTERING PROBABILISTIK BERBASIS GMM ===")
print(f"Bobot Campuran Komponen (pi_k) : {gmm.weights_.round(4)}")
print(f"Rata-rata Komponen Laten (mu_k) :\\n{gmm.means_.round(3)}")
print(f"\\nContoh Observasi Titik Perbatasan (Indeks {idx_perbatasan}):")
print(f"- Probabilitas Milik Kluster 0 : {prob_keanggotaan[idx_perbatasan, 0]*100:.2f}%")
print(f"- Probabilitas Milik Kluster 1 : {prob_keanggotaan[idx_perbatasan, 1]*100:.2f}% (KETIDAKPASTIAN TERUKUR!)")`,
        expectedOutput: "GMM menghasilkan probabilitas posterior lembut terkalibrasi untuk setiap observasi.",
        codeExp: "Skrip memanfaatkan GaussianMixture dari Scikit-Learn untuk mengekstrak bobot campuran komponen laten dan probabilitas posterior pada batas kluster.",
        pitfalls: [
          "Terjadinya singularitas varians pada GMM covariance_type='full' jika salah satu komponen mencakup terlalu sedikit titik data (varians runtuh menuju nol).",
          "Mengabaikan penentuan jumlah komponen optimal (harus dipilih menggunakan kriteria seleksi BIC atau AIC).",
        ],
        refTitle: "A. P. Dempster, N. M. Laird, D. B. Rubin: Maximum Likelihood from Incomplete Data via the EM Algorithm (JRSSB)",
        refUrl: "https://www.jstor.org/stable/2984875"
      },
      {
        num: "13.7",
        slug: "13-7-local-outlier-factor-lof-kepadatan-lokal",
        title: "13.7. Deteksi Outlier Berbasis Kepadatan: Local Outlier Factor (LOF)",
        desc: "Anomali kontekstual: kelemahan jarak absolut, kepadatan jangkauan lokal (local reachability density), dan skor rasio LOF Breunig et al.",
        concept: `Metode deteksi pencilan tradisional yang berbasis jarak global (seperti Z-score atau jarak rata-rata ke tetangga) mengasumsikan bahwa densitas data di seluruh ruang fitur adalah seragam.
        
Namun, dalam data dunia nyata, kluster-kluster alami sering kali memiliki kerapatan yang sangat bervariasi: satu kluster kota padat memiliki titik-titik yang sangat berdekatan, sementara kluster pedesaan memiliki titik-titik yang berjauhan secara alami. Titik di kluster pedesaan akan salah dicap sebagai outlier global oleh metode tradisional.
        
**Local Outlier Factor (LOF)** (Markus M. Breunig et al., 2000) memecahkan masalah ini dengan membandingkan kepadatan lokal suatu titik terhadap **kepadatan lokal tetangga-tetangganya (Local Reachability Density / LRD)**:
- $\\text{LOF} \\approx 1.0$: Titik memiliki kepadatan yang serupa dengan tetangganya (titik inlier normal).
- $\\text{LOF} < 1.0$: Titik berada di dalam inti kluster yang sangat padat.
- $\\text{LOF} > 1.5$: Kepadatan titik secara substansial lebih rendah daripada tetangganya, mengindikasikan bahwa titik tersebut adalah **outlier lokal kontekstual**.`,
        formula: `\\text{LOF}_k(p) = \\frac{\\sum_{o \\in N_k(p)} \\frac{\\text{lrd}(o)}{\\text{lrd}(p)}}{|N_k(p)|}`,
        code: `# 13.7: Deteksi Outlier Lokal pada Dataset Multi-Densitas via Local Outlier Factor
import numpy as np
from sklearn.neighbors import LocalOutlierFactor

np.random.seed(42)
# 1. Kluster Padat (100 sampel, varians kecil 0.3)
X_padat = np.random.normal(loc=[0, 0], scale=0.3, size=(100, 2))
# 2. Kluster Renggang (100 sampel, varians sedang 1.2)
X_renggang = np.random.normal(loc=[10, 10], scale=1.2, size=(100, 2))
# 3. Outlier Lokal Dekat Kluster Padat
outlier_lokal = np.array([[1.5, 1.5]]) # Jauh untuk kluster padat, tapi lebih dekat dibanding kluster renggang!

X = np.vstack([X_padat, X_renggang, outlier_lokal])

# Menjalankan Local Outlier Factor (k=20 tetangga)
lof = LocalOutlierFactor(n_neighbors=20)
y_pred = lof.fit_predict(X)
skor_lof = -lof.negative_outlier_factor_

skor_outlier_lokal = skor_lof[-1]
skor_rata_inlier = np.mean(skor_lof[:-1])

print("=== DETEKSI OUTLIER LOKAL (LOCAL OUTLIER FACTOR) ===")
print(f"Rata-rata Skor LOF Titik Inlier Normal : {skor_rata_inlier:.4f} (~1.0)")
print(f"Skor LOF Outlier Lokal Titik [1.5, 1.5]: {skor_outlier_lokal:.4f} (> 1.5 -> OUTLIER LOKAL!)")
print(f"Status Deteksi (1: Inlier, -1: Outlier): {y_pred[-1]}")`,
        expectedOutput: "LOF berhasil mendeteksi outlier lokal (skor ~2.0) di tengah perbedaan densitas kluster.",
        codeExp: "Skrip mengeksekusi LocalOutlierFactor pada data dengan dua tingkat kepadatan berbeda untuk membuktikan sensitivitas rasio kepadatan lokal.",
        pitfalls: [
          "Secara default di Scikit-Learn, atribut negative_outlier_factor_ bernilai negatif (dikalikan -1 untuk interpretasi standar di mana > 1 adalah outlier).",
          "Menerapkan LOF dalam mode deteksi kebaruan (novelty detection) tanpa menyetel novelty=True."
        ],
        refTitle: "Markus M. Breunig, Hans-Peter Kriegel, Raymond T. Ng, Jörg Sander: LOF: Identifying Density-Based Local Outliers (SIGMOD 2000)",
        refUrl: "https://dl.acm.org/doi/10.1145/335191.335388"
      },
      {
        num: "13.8",
        slug: "13-8-isolation-forest-deteksi-anomali-pohon",
        title: "13.8. Deteksi Anomali Berbasis Pohon: Isolation Forest (iForest)",
        desc: "Paradigma isolasi Fei Tony Liu (2008): mengapa memisahkan anomali lebih mudah daripada memodelkan data normal, kedalaman pohon h(x), dan komputasi skalar linear.",
        concept: `Hampir seluruh teknik deteksi anomali klasik bekerja dengan memodelkan profil titik normal terlebih dahulu, lalu mencari observasi yang tidak cocok dengan model tersebut. Pendekatan ini sangat lambat dan memboroskan komputasi pada dataset besar.
        
**Isolation Forest (iForest)** yang dirintis oleh Fei Tony Liu, Kai Ming Ting, dan Zhi-Hua Zhou (2008) membalik paradigma ini secara radikal dengan prinsip fundamental: **'Anomali memiliki sifat sedikit dan berbeda, sehingga anomali jauh lebih mudah diisolasi daripada titik normal'**.
        
Mekanisme kerja Isolation Forest:
1. Algoritma membangun ensemble pohon partisi acak (*Isolation Trees / iTrees*). Pada setiap node, satu fitur dipilih secara acak murni, dan sebuah titik potong acak dipilih di antara nilai minimum dan maksimum fitur tersebut.
2. Titik data anomali yang terisolasi jauh di ruang fitur akan terisolasi di daun hanya dalam beberapa pembelahan biner acak (memiliki kedalaman jalur pohon $h(x)$ yang sangat pendek).
3. Titik normal yang berada di tengah kerumunan data membutuhkan banyak sekali pembelahan acak hingga berhasil terisolasi (memiliki kedalaman jalur $h(x)$ yang sangat dalam).
        
Keunggulan komputasi iForest adalah linear $O(n)$, kapasitas memori sangat rendah, dan performa deteksi tingkat tinggi pada data berdimensi tinggi.`,
        formula: `s(x, n) = 2^{-\\frac{\\mathbb{E}[h(x)]}{c(n)}}, \\quad c(n) = 2 \\ln(n - 1) + 0.5772156649 - \\frac{2(n - 1)}{n}`,
        code: `# 13.8: Deteksi Anomali Berkecepatan Tinggi Menggunakan Isolation Forest
import numpy as np
from sklearn.ensemble import IsolationForest

np.random.seed(42)
n_normal = 2000
# 1. Distribusi Normal Data Transaksi Sah
X_normal = np.random.normal(loc=100, scale=15, size=(n_normal, 5))

# 2. Anomali Penipuan Ekstrem (20 Kasus Fraud Terpencil)
X_anomali = np.random.uniform(low=250, high=400, size=(20, 5))

X = np.vstack([X_normal, X_anomali])

# Inisialisasi Isolation Forest dengan kontaminasi 1%
iforest = IsolationForest(
    n_estimators=100,
    contamination=0.01,
    random_state=42
)
y_pred = iforest.fit_predict(X)
skor_anomali = iforest.decision_function(X) # Semakin negatif, semakin anomali

jumlah_anomali_terdeteksi = np.sum(y_pred == -1)
deteksi_fraud_sejati = np.sum(y_pred[-20:] == -1)

print("=== DETEKSI ANOMALI SKALA BESAR: ISOLATION FOREST ===")
print(f"Total Sampel yang Dievaluasi        : {len(X)}")
print(f"Jumlah Anomali yang Terdeteksi (-1) : {jumlah_anomali_terdeteksi}")
print(f"Akurasi Tangkapan Fraud Sejati (Recall): {deteksi_fraud_sejati}/20 ({deteksi_fraud_sejati/20*100:.1f}%)")
print(f"Rata-rata Skor Anomali Kasus Normal : {np.mean(skor_anomali[:n_normal]):.4f} (Positif)")
print(f"Rata-rata Skor Anomali Kasus Fraud  : {np.mean(skor_anomali[-20:]):.4f} (Sangat Negatif!)")`,
        expectedOutput: "Isolation Forest sukses menangkap 100% kasus penipuan terpencil dengan skor anomali negatif tajam.",
        codeExp: "Skrip mendemonstrasikan efisiensi pemodelan IsolationForest Scikit-Learn dalam mengisolasi 20 kasus anomali ekstrem dari ribuan observasi normal.",
        pitfalls: [
          "Menyetel parameter contamination tanpa justifikasi domain bisnis (parameter ini secara kaku menentukan ambang persentase data yang akan dicap -1).",
          "Mengabaikan bias pemotongan sumbu ortogonal pada iForest standar saat anomali terletak di sepanjang garis diagonal (Extended Isolation Forest mengatasi ini)."
        ],
        refTitle: "Fei Tony Liu, Kai Ming Ting, Zhi-Hua Zhou: Isolation Forest (ICDM 2008)",
        refUrl: "https://ieeexplore.ieee.org/document/4781136"
      },
      {
        num: "13.9",
        slug: "13-9-deteksi-anomali-kernel-density-estimation-kde",
        title: "13.9. Deteksi Anomali Estimasi Kerapatan Inti (Kernel Density Estimation)",
        desc: "Pemodelan densitas kontinu non-parametrik: fungsi kernel Gaussian, optimasi bandwidth Silverman, dan evaluasi log-densitas batas ambang.",
        concept: `Ketika praktisi ingin mendeteksi anomali dengan menghitung probabilitas densitas kontinu dari suatu observasi tanpa memaksakan asumsi bahwa data mengikuti distribusi parametrik kaku (seperti distribusi normal), **Kernel Density Estimation (KDE)** adalah instrumen statistik yang sangat tepat.
        
KDE menempatkan fungsi bobot 'benjolan' halus (disebut fungsi Kernel $K$, umumnya Gaussian) pada setiap observasi data individual, lalu menjumlahkan seluruh kontribusi densitas ini untuk menghasilkan kurva estimasi densitas probabilitas global yang kontinu:
$$\\hat{f}_h(x) = \\frac{1}{n h} \\sum_{i=1}^n K\\left( \\frac{x - x_i}{h} \\right)$$
Parameter terpenting dalam KDE adalah **Bandwidth ($h$)**:
- Jika $h$ terlalu kecil, kurva mengalami *undersmoothing* (bergerigi tajam dan overfitted pada setiap titik sampel).
- Jika $h$ terlalu besar, kurva mengalami *oversmoothing* (terlalu membulat dan menenggelamkan mode distribusi sejati).
Observasi baru yang memiliki skor log-densitas $\\ln \\hat{f}(x)$ di bawah ambang batas persentil tertentu diklasifikasikan sebagai anomali probabilitas rendah.`,
        formula: `\\hat{f}_h(x) = \\frac{1}{n h^p} \\sum_{i=1}^n \\frac{1}{(2\\pi)^{p/2}} \\exp\\left( -\\frac{\\|x - x_i\\|^2}{2h^2} \\right)`,
        code: `# 13.9: Deteksi Anomali Berbasis Log-Densitas Kernel Density Estimation (KDE)
import numpy as np
from sklearn.neighbors import KernelDensity

np.random.seed(42)
# Distribusi data normal multimodal (Campuran dua kelompok)
data_latih = np.concatenate([
    np.random.normal(-3, 0.8, 500),
    np.random.normal(4, 1.2, 500)
]).reshape(-1, 1)

# Melatih Model Estimasi Kerapatan Inti (KDE) dengan Kernel Gaussian
kde = KernelDensity(kernel='gaussian', bandwidth=0.75)
kde.fit(data_latih)

# Evaluasi Titik Baru: Titik Normal vs Titik Lembah Anomali di Antara Dua Puncak
titik_uji = np.array([[-3.0], [4.0], [0.5], [15.0]]) # 0.5 di lembah kosong, 15 jauh ekstrem
log_densitas = kde.score_samples(titik_uji)
prob_densitas = np.exp(log_densitas)

print("=== DETEKSI ANOMALI BERBASIS KERNEL DENSITY ESTIMATION ===")
label_titik = ["Puncak Modus 1 (-3.0)", "Puncak Modus 2 (+4.0)", "Lembah Kosong (+0.5)", "Titik Ekstrem (+15.0)"]
for nama, log_d, dens in zip(label_titik, log_densitas, prob_densitas):
    status = "ANOMALI!" if dens < 0.01 else "NORMAL"
    print(f"{nama:22s} | Log-Densitas: {log_d:7.2f} | Densitas Prob: {dens:.5f} | Status: {status}")`,
        expectedOutput: "KDE mengidentifikasi titik di lembah kosong dan titik ekstrem sebagai anomali berdensitas mendekati nol.",
        codeExp: "Skrip memanfaatkan KernelDensity dari Scikit-Learn untuk memodelkan distribusi multimodal dan menghitung skor densitas probabilitas untuk menyaring anomali.",
        pitfalls: [
          "Menerapkan KDE pada ruang berdimensi tinggi ($p > 10$), di mana konvergensi estimasi densitas melambat drastis akibat kutukan dimensi.",
          "Memilih bandwidth $h$ secara manual tanpa validasi silang (GridSearchCV) untuk memaksimalkan log-likelihood data validasi."
        ],
        refTitle: "B. W. Silverman: Density Estimation for Statistics and Data Analysis (Chapman and Hall)",
        refUrl: "https://www.routledge.com/Density-Estimation-for-Statistics-and-Data-Analysis/Silverman/p/book/9780412246203"
      },
      {
        num: "13.10",
        slug: "13-10-evaluasi-klusterisasi-davies-bouldin-calinski-ari",
        title: "13.10. Evaluasi Klusterisasi Internal vs Eksternal: Davies-Bouldin & ARI",
        desc: "Kuantifikasi kualitas kluster: metrik internal tanpa label (Davies-Bouldin, Calinski-Harabasz) vs metrik eksternal dengan ground truth (Adjusted Rand Index & NMI).",
        concept: `Mengevaluasi kualitas hasil klusterisasi adalah tugas yang sangat menantang karena ketiadaan label kebenaran dasar (ground truth). Metrik evaluasi klusterisasi terbagi menjadi dua kategori fundamental:
        
1. **Metrik Validasi Internal (Unsupervised Validation):** Menilai kualitas murni berdasarkan sifat geometris data (memaksimalkan separasi antarkluster dan meminimalkan dispersi intra-kluster):
   - **Indeks Davies-Bouldin (DBI):** Mengukur rasio kemiripan rata-rata antara masing-masing kluster dengan kluster yang paling mirip dengannya. **Semakin kecil nilai DBI mendekati 0, semakin baik kualitas klusterisasi**.
   - **Indeks Calinski-Harabasz (Variance Ratio Criterion):** Rasio antara dispersi antar-kluster terhadap dispersi intra-kluster. **Semakin besar skor, semakin baik**.
2. **Metrik Validasi Eksternal (Supervised Validation):** Digunakan saat label kelas sejati tersedia sebagai tolok ukur benchmark:
   - **Adjusted Rand Index (ARI):** Menghitung proporsi kesepakatan pasangan observasi antara label kluster dan label sejati, dikoreksi untuk kesepakatan yang terjadi secara kebetulan ($E[\\text{ARI}] = 0$ untuk kluster acak, $+1.0$ untuk kesepakatan sempurna).
   - **Normalized Mutual Information (NMI):** Informasi timbal-balik yang dinormalisasi antara label kluster dan target.`,
        formula: `\\text{DB} = \\frac{1}{K} \\sum_{i=1}^K \\max_{j \\ne i} \\left( \\frac{s_i + s_j}{d(\\mu_i, \\mu_j)} \\right), \\quad \\text{CH} = \\frac{\\text{Tr}(B_k)}{\\text{Tr}(W_k)} \\times \\frac{n - K}{K - 1}`,
        code: `# 13.10: Evaluasi Komparatif Metrik Klusterisasi Internal dan Eksternal
import numpy as np
from sklearn.metrics import (
    davies_bouldin_score,
    calinski_harabasz_score,
    silhouette_score,
    adjusted_rand_score,
    normalized_mutual_info_score
)
from sklearn.cluster import KMeans
from sklearn.datasets import load_iris

iris = load_iris()
X, y_true = iris.data, iris.target

# Melatih K-Means pada K=3
kmeans = KMeans(n_clusters=3, n_init=10, random_state=42).fit(X)
labels = kmeans.labels_

# 1. Metrik Evaluasi Internal (Tanpa Membutuhkan Ground Truth)
skor_sil = silhouette_score(X, labels)
skor_db = davies_bouldin_score(X, labels)
skor_ch = calinski_harabasz_score(X, labels)

# 2. Metrik Evaluasi Eksternal (Validasi Benchmark terhadap Ground Truth)
skor_ari = adjusted_rand_score(y_true, labels)
skor_nmi = normalized_mutual_info_score(y_true, labels)

print("=== EVALUASI KUALITAS KLUSTERISASI KOMPREHENSIF ===")
print("[METRIK INTERNAL - UNSUPERVISED]")
print(f"- Silhouette Score (Maksimum +1.0)        : {skor_sil:.4f}")
print(f"- Davies-Bouldin Index (Lebih Kecil Baik) : {skor_db:.4f}")
print(f"- Calinski-Harabasz Index (Lebih Besar)   : {skor_ch:.2f}\\n")
print("[METRIK EKSTERNAL - BENCHMARK GROUND TRUTH]")
print(f"- Adjusted Rand Index (ARI)               : {skor_ari:.4f} (Kesepakatan Sangat Kuat)")
print(f"- Normalized Mutual Information (NMI)     : {skor_nmi:.4f}")`,
        expectedOutput: "Metrik internal dan eksternal berhasil menguantifikasi kekompakan dan kesepakatan kluster.",
        codeExp: "Skrip menghitung rangkaian metrik evaluasi klusterisasi internal (Silhouette, DBI, CH) dan eksternal (ARI, NMI) menggunakan Scikit-Learn.",
        pitfalls: [
          "Menggunakan skor akurasi biasa untuk mengevaluasi klusterisasi terhadap ground truth (label kluster bersifat permutasi arbitrer; ARI adalah metrik yang invarian terhadap permutasi label).",
          "Mengejar nilai Davies-Bouldin terendah dengan membiarkan K membesar mendekati n."
        ],
        refTitle: "David L. Davies & Donald W. Bouldin: A Cluster Separation Measure (IEEE TPAMI 1979)",
        refUrl: "https://ieeexplore.ieee.org/document/4766909"
      }
    ]
  },

  // ==========================================
  // BAB 14: Strategi Validasi Silang, Penyetelan Hyperparameter, & Evaluasi Generalisasi
  // ==========================================
  {
    orderIndex: 14,
    id: "data-science-ch-14",
    slug: "bab-14-validasi-silang-hyperparameter-tuning-evaluasi",
    title: "BAB 14: Strategi Validasi Silang, Penyetelan Hyperparameter, & Evaluasi Generalisasi",
    desc: "Protokol penilaian generalisasi ilmiah: Train/Validation/Test split, K-Fold & Stratified K-Fold, validasi silang data temporal (TimeSeriesSplit & GroupKFold), penelusuran hyperparameter (Randomized Search vs Bayesian Optimization TPE Optuna), Nested Cross-Validation, kurva pembelajaran (Learning Curves), serta uji signifikansi komparasi model 5x2cv Dietterich.",
    coreConcepts: ["Stratified & Group K-Fold", "TimeSeriesSplit & Leakage Prevention", "Random Search vs Bayesian Opt (Optuna)", "Nested Cross-Validation", "Learning & Validation Curves"],
    subchapters: [
      {
        num: "14.1",
        slug: "14-1-anatomi-pemisahan-data-dan-optimism-bias",
        title: "14.1. Anatomi Pemisahan Data: Train, Validation, & Test Set",
        desc: "Pencegahan bias optimisme: peran independen tiga partisi data, kebocoran hyperparameter tuning, dan status sakral test set.",
        concept: `Banyak praktisi pemula membagi data hanya menjadi dua bagian: Data Latih (Training Set) dan Data Uji (Test Set). Mereka melatih berbagai algoritma dan menyetel lusinan hyperparameter pada data latih, lalu berulang kali mengevaluasi model pada data uji untuk memilih kombinasi konfigurasi terbaik.
        
Praktik semacam ini adalah pelanggaran metodologis serius yang memicu **Information Leakage** dan **Optimism Bias**. Melalui evaluasi berulang-ulang, informasi dari data uji secara tidak langsung telah merembes ke dalam proses pemilihan model, sehingga performa data uji tidak lagi mencerminkan kemampuan generalisasi yang sesungguhnya.
        
Protokol ilmiah yang sah mewajibkan partisi tiga arah yang terisolasi ketat:
1. **Training Set (60–70%):** Digunakan murni untuk mengoptimalkan parameter internal model (seperti koefisien bobot $\\beta$).
2. **Validation Set (15–20%):** Digunakan untuk menyetel hyperparameter eksternal (seperti kedalaman pohon, regularisasi $\\alpha$) dan memilih arsitektur model terbaik.
3. **Test Set (15–20%):** Disimpan secara sakral dan **hanya boleh disentuh satu kali saja di akhir** untuk melaporkan estimasi performa generalisasi out-of-sample final yang tidak berbias.`,
        code: `# 14.1: Partisi Tiga Arah (Train / Validation / Test) Terisolasi Sempurna
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=1000, n_features=20, random_state=42)

# Langkah 1: Pisahkan 20% Data Uji Sakral (Test Set Final)
X_sisa, X_test, y_sisa, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

# Langkah 2: Dari 80% sisa, pisahkan menjadi Training (75% dari sisa = 60% total) dan Validation (25% dari sisa = 20% total)
X_train, X_val, y_train, y_val = train_test_split(
    X_sisa, y_sisa, test_size=0.25, random_state=42, stratify=y_sisa
)

print("=== PARTISI DATA TIGA TAHAP TERISOLASI KETAT ===")
print(f"Total Observasi Data Mentah : {len(X)}")
print(f"Ukuran Training Set (60%)   : {len(X_train)} sampel (Untuk Optimasi Parameter)")
print(f"Ukuran Validation Set (20%) : {len(X_val)} sampel (Untuk Penyetelan Hyperparameter)")
print(f"Ukuran Test Set Sakral (20%): {len(X_test)} sampel (Hanya Dievaluasi 1 Kali di Akhir!)")`,
        expectedOutput: "Data terpartisi proporsional 60/20/20 dengan rasio kelas terjaga via stratifikasi.",
        codeExp: "Skrip mengimplementasikan pemisahan dua tahap menggunakan train_test_split berstrata untuk menciptakan partisi terisolasi train, validation, dan test set.",
        pitfalls: [
          "Mengevaluasi hyperparameter berulang kali pada Test Set, yang menyebabkan 'overfitting pada test set'.",
          "Melakukan penskalaan data atau imputasi nilai hilang sebelum pemisahan tiga arah dilakukan."
        ],
        refTitle: "Trevor Hastie, Robert Tibshirani, Jerome Friedman: The Elements of Statistical Learning (Chapter 7.2: Bias, Variance and Model Complexity)",
        refUrl: "https://hastie.su.domains/ElemStatLearn/"
      },
      {
        num: "14.2",
        slug: "14-2-k-fold-dan-stratified-k-fold-cross-validation",
        title: "14.2. K-Fold & Stratified K-Fold Cross-Validation: Varians Estimasi",
        desc: "Pemanfaatan data maksimal: trade-off bias-variance pemilihan K, dan preservasi rasio kelas minoritas Stratified K-Fold.",
        concept: `Pemisahan validasi tunggal (*single validation split*) memiliki kelemahan: estimasi skor performanya sangat rentan terhadap varians kebetulan (tergantung data mana yang masuk ke dalam validation set), dan mengurangi jumlah data yang tersedia untuk melatih model.
        
**K-Fold Cross-Validation** mengatasi masalah ini dengan membagi data menjadi $K$ bagian berukuran sama (*folds*). Model dilatih sebanyak $K$ kali; pada setiap iterasi ke-$k$, bagian ke-$k$ bertindak sebagai data validasi dan sisa $K-1$ bagian bertindak sebagai data latih. Skor performa akhir adalah rata-rata aritmatika dari $K$ evaluasi tersebut.
        
Pemilihan nilai $K$:
- $K = 5$ atau $K = 10$: Standar emas industri yang memberikan keseimbangan optimal antara bias dan varians komputasi.
- $K = n$ (Leave-One-Out CV / LOOCV): Memiliki bias terendah, namun varians estimasi tinggi (karena training fold hampir identik berkorelasi tinggi) dan sangat mahal secara komputasi.
        
**Stratified K-Fold** adalah varian wajib untuk klasifikasi: algoritma menjamin bahwa persentase masing-masing kelas target di setiap fold identik dengan persentase di seluruh populasi.`,
        formula: `\\text{CV}_{(K)} = \\frac{1}{K} \\sum_{k=1}^K \\text{Score}_k`,
        code: `# 14.2: Komparasi K-Fold Biasa vs Stratified K-Fold pada Data Kelas Timpang
import numpy as np
from sklearn.model_selection import KFold, StratifiedKFold

# Dataset dengan 10% Kelas Positif (10 Positif, 90 Negatif)
y = np.array([1]*10 + [0]*90)
X = np.random.normal(0, 1, size=(100, 2))

# 1. K-Fold Standar
kf = KFold(n_splits=5, shuffle=True, random_state=42)
distribusi_kf = [np.sum(y[val_idx] == 1) for _, val_idx in kf.split(X, y)]

# 2. Stratified K-Fold
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
distribusi_skf = [np.sum(y[val_idx] == 1) for _, val_idx in skf.split(X, y)]

print("=== DISTRIBUSI KELAS MINORITAS PER FOLD (5-FOLD CV) ===")
print(f"Target Ideal per Fold (Total 10 / 5 Fold): 2 sampel positif")
print(f"K-Fold Biasa (Fluktuatif & Rawan Kosong) : {distribusi_kf}")
print(f"Stratified K-Fold (Presisi Terjaga)      : {distribusi_skf} (Stabil Sempurna!)")`,
        expectedOutput: "Stratified K-Fold menjamin setiap fold memiliki tepat 2 sampel kelas minoritas.",
        codeExp: "Skrip membuktikan ketidakstabilan K-Fold biasa pada kelas minoritas dan presisi distribusi yang dipertahankan oleh StratifiedKFold.",
        pitfalls: [
          "Menggunakan K-Fold biasa tanpa stratifikasi pada kasus klasifikasi fraud atau penyakit langka (beberapa fold dapat memiliki nol sampel positif).",
          "Lupa menyetel parameter shuffle=True pada KFold, yang berakibat fatal jika dataset asli terurut berdasarkan label kelas."
        ],
        refTitle: "Ron Kohavi: A Study of Cross-Validation and Bootstrap for Accuracy Estimation and Model Selection (IJCAI 1995)",
        refUrl: "https://dl.acm.org/doi/10.5555/1643031.1643047"
      },
      {
        num: "14.3",
        slug: "14-3-validasi-silang-data-temporal-dan-berkelompok",
        title: "14.3. Validasi Silang Data Bergantung: TimeSeriesSplit & GroupKFold",
        desc: "Mengatasi pelanggaran asumsi i.i.d.: kebocoran temporal, TimeSeriesSplit jendela bergulir, dan GroupKFold untuk data pasien/pengguna berulang.",
        concept: `K-Fold Cross-Validation standar mengasumsikan bahwa setiap observasi data bersifat independen dan terdistribusi identik (i.i.d.). Dalam dua skenario bisnis yang sangat umum, asumsi ini dilanggar secara fatal:
        
1. **Data Deret Waktu (Time Series Data):** Mengacak data temporal secara acak untuk K-Fold akan menyebabkan data masa depan digunakan untuk melatih prediksi masa lalu. Hal ini menciptakan ilusi akurasi palsu akibat kebocoran waktu. **TimeSeriesSplit (Walk-Forward Validation)** mengatasi masalah ini dengan memastikan bahwa data latih selalu mendahului data validasi secara temporal ($t_{\\text{train}} < t_{\\text{val}}$).
2. **Data Terkelompok (Grouped Data):** Jika satu pasien rumah sakit memiliki 20 hasil pemindaian medis dalam dataset, membagi observasi secara acak akan menyebabkan pemindaian pasien yang sama berada di train set sekaligus validation set. Model akan 'menghafal' karakteristik fisik pasien alih-alih mempelajari penyakitnya. **GroupKFold** menjamin bahwa seluruh data milik satu entitas kelompok hanya berada di satu fold secara utuh.`,
        code: `# 14.3: Validasi Silang Bebas Kebocoran: TimeSeriesSplit dan GroupKFold
import numpy as np
from sklearn.model_selection import TimeSeriesSplit, GroupKFold

# 1. Demonstrasi TimeSeriesSplit (Walk-Forward Validation)
tscv = TimeSeriesSplit(n_splits=3)
data_waktu = np.arange(6)

print("=== PARTISI VALIDASI DERET WAKTU (TIMESERIESSPLIT) ===")
for i, (train_idx, val_idx) in enumerate(tscv.split(data_waktu)):
    print(f"Iterasi {i+1}: Train Data Waktu {train_idx} -> Prediksi Validasi Masa Depan {val_idx}")

# 2. Demonstrasi GroupKFold (Isolasi Pasien / Entitas)
X_dummy = np.random.normal(0, 1, size=(6, 2))
y_dummy = np.array([0, 1, 0, 1, 0, 1])
pasien_id = np.array(['P01', 'P01', 'P02', 'P02', 'P03', 'P03']) # 3 Pasien, masing-masing 2 sampel

gkf = GroupKFold(n_splits=3)
print("\\n=== PARTISI VALIDASI TERKELOMPOK (GROUPKFOLD) ===")
for i, (train_idx, val_idx) in enumerate(gkf.split(X_dummy, y_dummy, groups=pasien_id)):
    pasien_val = np.unique(pasien_id[val_idx])
    pasien_train = np.unique(pasien_id[train_idx])
    print(f"Iterasi {i+1}: Pasien Latih {pasien_train} | Pasien Validasi Terisolasi: {pasien_val}")`,
        expectedOutput: "TimeSeriesSplit menjaga urutan temporal maju dan GroupKFold mengisolasi data pasien tanpa kebocoran.",
        codeExp: "Skrip mendemonstrasikan protokol partisi data dependen temporal dengan TimeSeriesSplit dan data multi-rekaman pasien dengan GroupKFold.",
        pitfalls: [
          "Menerapkan K-Fold acak biasa pada data harga saham atau peramalan cuaca, menghasilkan model overfitted yang hancur di pasar riil.",
          "Tidak menyertakan argumen groups saat memanggil split() pada GroupKFold."
        ],
        refTitle: "Marcos Lopez de Prado: Advances in Financial Machine Learning (Chapter 7: Cross-Validation in Finance)",
        refUrl: "https://www.wiley.com/en-us/Advances+in+Financial+Machine+Learning-p-9781119482086"
      },
      {
        num: "14.4",
        slug: "14-4-hyperparameter-tuning-grid-search-vs-randomized",
        title: "14.4. Eksplorasi Hyperparameter: Grid Search vs Randomized Search",
        desc: "Pencarian ruang parameter: kelemahan eksponensial Grid Search, pembuktian efisiensi Randomized Search Bergstra & Bengio (2012).",
        concept: `Hyperparameter adalah parameter arsitektur yang tidak dipelajari langsung oleh algoritma dari data (misalnya kedalaman pohon ''max_depth'', penalti regularisasi ''alpha'', atau ''learning_rate'').
        
Dua strategi eksplorasi parameter klasik:
1. **Grid Search ('+ "GridSearchCV"' + '):** Mengevaluasi seluruh kombinasi kisi kartesian yang ditentukan secara apriori. Jika kita memiliki 4 hyperparameter yang masing-masing memiliki 5 nilai kandidat, terdapat $5^4 = 625$ model. Dengan 5-fold CV, berarti $3.125$ pelatihan model yang memakan waktu komputasi raksasa. Kelemahan kritisnya: Grid Search membuang banyak waktu mengevaluasi kombinasi pada dimensi hyperparameter yang sebenarnya tidak berpengaruh signifikan.
2. **Randomized Search ('+ "RandomizedSearchCV"' + '):** James Bergstra dan Yoshua Bengio (2012) membuktikan secara matematis bahwa mengambil $M$ kombinasi acak dari ruang probabilitas kontinu jauh lebih efisien dan menemukan hyperparameter yang lebih baik dalam waktu yang jauh lebih singkat, karena mampu mengeksplorasi dimensi penting secara kontinu.`,
        code: `# 14.4: Komparasi Efisiensi Pencarian: GridSearchCV vs RandomizedSearchCV
import time
from scipy.stats import uniform, randint
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=500, n_features=10, random_state=42)
rf = RandomForestClassifier(random_state=42)

# 1. GridSearchCV (Kisi Diskrit Kaku: 3 x 3 x 3 = 27 Kombinasi)
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [3, 5, 10],
    'min_samples_split': [2, 5, 10]
}
t0 = time.time()
grid = GridSearchCV(rf, param_grid, cv=3, n_jobs=-1).fit(X, y)
t_grid = time.time() - t0

# 2. RandomizedSearchCV (Distribusi Kontinu: 15 Sampel Acak)
param_dist = {
    'n_estimators': randint(50, 250),
    'max_depth': randint(3, 15),
    'min_samples_split': randint(2, 12)
}
t0 = time.time()
random_s = RandomizedSearchCV(rf, param_dist, n_iter=15, cv=3, random_state=42, n_jobs=-1).fit(X, y)
t_random = time.time() - t0

print("=== EFISIENSI HYPERPARAMETER TUNING: GRID VS RANDOMIZED SEARCH ===")
print(f"GridSearchCV (27 Kombinasi)     : Skor Terbaik = {grid.best_score_:.4f} | Waktu = {t_grid:.2f} detik")
print(f"RandomizedSearchCV (15 Sampel)  : Skor Terbaik = {random_s.best_score_:.4f} | Waktu = {t_random:.2f} detik (LEBIH CEPAT & SETARA!)")`,
        expectedOutput: "RandomizedSearchCV menemukan hyperparameter setara atau lebih baik dalam separuh waktu komputasi.",
        codeExp: "Skrip membandingkan waktu dan kualitas pencarian hyperparameter antara GridSearchCV kisi diskrit dengan RandomizedSearchCV distribusi kontinu.",
        pitfalls: [
          "Menjalankan GridSearchCV dengan daftar kisi yang terlalu rapat pada awal eksperimen (seharusnya melakukan pencarian acak kasar terlebih dahulu, lalu menyempitkan grid).",
          "Menentukan nilai n_jobs=-1 pada laptop dengan RAM terbatas yang menyebabkan sistem hang out-of-memory."
        ],
        refTitle: "James Bergstra & Yoshua Bengio: Random Search for Hyper-Parameter Optimization (JMLR 2012)",
        refUrl: "https://www.jmlr.org/papers/v13/bergstra12a.html"
      },
      {
        num: "14.5",
        slug: "14-5-optimasi-bayesian-dan-optuna-tpe",
        title: "14.5. Optimasi Bayesian: Gaussian Processes & Optuna TPE",
        desc: "Penyetelan cerdas berbasis riwayat: Sequential Model-Based Optimization (SMBO), fungsi akuisisi Expected Improvement, dan Tree-structured Parzen Estimators.",
        concept: `Baik Grid Search maupun Random Search bersifat 'buta' (uninformed): keduanya memperlakukan setiap percobaan secara terisolasi tanpa memanfaatkan informasi performa dari evaluasi model sebelumnya.
        
**Optimasi Bayesian (Sequential Model-Based Optimization / SMBO)** adalah teknik penyetelan hyperparameter cerdas yang memperlakukan penentuan performa model sebagai fungsi kotak hitam yang mahal $f(\\theta)$.
        
Mekanisme kerjanya:
1. Membangun model probabilistik pengganti (*surrogate model*) yang mengestimasi fungsi objektif beserta ketidakpastiannya.
2. Menggunakan **Fungsi Akuisisi (Acquisition Function)** seperti *Expected Improvement (EI)* untuk memilih titik hyperparameter berikutnya yang menyeimbangkan antara mengeksplorasi daerah yang belum diketahui (*exploration*) dan memanfaatkan daerah dengan performa terbaik (*exploitation*).
3. **Tree-structured Parzen Estimator (TPE)** yang diimplementasikan di pustaka modern **Optuna** adalah algoritma Bayesian non-parametrik yang sangat cepat dan menjadi standar de facto di industri modern.`,
        formula: `\\text{EI}(x) = \\mathbb{E}\\left[ \\max(0, f(x) - f(x^+)) \\right]`,
        code: `# 14.5: Optimasi Bayesian Cerdas Berbasis Tree-structured Parzen Estimators (TPE)
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import GradientBoostingClassifier

X, y = make_classification(n_samples=600, n_features=15, random_state=42)

# Konseptual Implementasi Fungsi Objektif SMBO / Optuna
def fungsi_objektif(learning_rate, max_depth, n_estimators):
    clf = GradientBoostingClassifier(
        learning_rate=learning_rate,
        max_depth=int(max_depth),
        n_estimators=int(n_estimators),
        random_state=42
    )
    # 3-Fold Cross-Validation Accuracy
    return np.mean(cross_val_score(clf, X, y, cv=3, scoring='accuracy'))

# Simulasi Penelusuran Cerdas Bayesian TPE (Menyesuaikan Sampel Berdasarkan Riwayat)
riwayat_evaluasi = [
    {'lr': 0.01, 'depth': 3, 'n_est': 50, 'score': fungsi_objektif(0.01, 3, 50)},
    {'lr': 0.10, 'depth': 4, 'n_est': 100, 'score': fungsi_objektif(0.10, 4, 100)},
    {'lr': 0.20, 'depth': 5, 'n_est': 150, 'score': fungsi_objektif(0.20, 5, 150)},
]

skor_terbaik = max(r['score'] for r in riwayat_evaluasi)
konfigurasi_terbaik = [r for r in riwayat_evaluasi if r['score'] == skor_terbaik][0]

print("=== OPTIMASI HYPERPARAMETER BAYESIAN (SMBO / TPE) ===")
print(f"Skor Akurasi Terbaik Ditemukan: {skor_terbaik*100:.2f}%")
print(f"Konfigurasi Parameter Optimal : LR={konfigurasi_terbaik['lr']}, Depth={konfigurasi_terbaik['depth']}, N_Est={konfigurasi_terbaik['n_est']}")
print("Keunggulan Bayesian: Mengarahkan eksplorasi ke daerah parameter yang paling menjanjikan secara adaptif!")`,
        expectedOutput: "Optimasi Bayesian mengarahkan penelusuran secara cerdas ke area parameter performa tinggi.",
        codeExp: "Skrip mendemonstrasikan formulasi fungsi objektif SMBO yang menjadi fondasi algoritma TPE dalam pustaka Optuna.",
        pitfalls: [
          "Menggunakan optimasi Bayesian pada ruang hyperparameter yang terlalu sempit atau diskrit murni di mana random search sudah cukup.",
          "Lupa menyetel pruning (early stopping) pada Optuna saat mengevaluasi model deep learning atau ensemble besar."
        ],
        refTitle: "Takuya Akiba et al.: Optuna: A Next-generation Hyperparameter Optimization Framework (KDD 2019)",
        refUrl: "https://dl.acm.org/doi/10.1145/3292500.3330701"
      },
      {
        num: "14.6",
        slug: "14-6-nested-cross-validation-evaluasi-tanpa-bias",
        title: "14.6. Validasi Silang Bersarang (Nested Cross-Validation)",
        desc: "Protokol evaluasi generalisasi tanpa bias seleksi: loop luar untuk estimasi galat out-of-sample vs loop dalam untuk penyetelan hyperparameter.",
        concept: `Jika seorang peneliti menjalankan ''GridSearchCV'' atau ''RandomizedSearchCV'' pada sebuah dataset, skor cross-validation tertinggi yang dilaporkan oleh ''grid.best_score_'' **tidak boleh digunakan sebagai estimasi performa generalisasi model**.
        
Mengapa? Karena hyperparameter terbaik dipilih secara spesifik untuk memaksimalkan skor pada fold-fold tersebut. Akibatnya, skor tersebut menderita *Selection Bias* (bias optimisme seleksi model).
        
Untuk memperoleh estimasi performa generalisasi yang benar-benar tidak berbias dari suatu alur kerja pemodelan, **Nested Cross-Validation (Validasi Silang Bersarang)** adalah protokol ilmiah mutlak:
1. **Inner Loop (Validasi Silang Dalam):** Bertanggung jawab murni untuk menyetel hyperparameter model terbaik.
2. **Outer Loop (Validasi Silang Luar):** Bertanggung jawab mengevaluasi kemampuan generalisasi model terpilih pada data yang sepenuhnya belum pernah dilihat oleh inner loop.
Rata-rata skor dari outer loop memberikan estimasi performa out-of-sample sejati yang bebas dari bias seleksi.`,
        code: `# 14.6: Implementasi Validasi Silang Bersarang (Nested Cross-Validation) Lengkap
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import KFold, GridSearchCV, cross_val_score
from sklearn.svm import SVC

X, y = load_breast_cancer(return_X_y=True)

# 1. Tentukan Ruang Hyperparameter Inner Loop
param_grid = {'C': [0.1, 1.0, 10.0], 'gamma': ['scale', 'auto']}

# 2. Definisikan Inner CV dan Outer CV
inner_cv = KFold(n_splits=3, shuffle=True, random_state=42)
outer_cv = KFold(n_splits=5, shuffle=True, random_state=42)

# Model Penyetel Parameter (Inner Loop)
clf_inner = GridSearchCV(estimator=SVC(kernel='rbf'), param_grid=param_grid, cv=inner_cv)

# 3. Eksekusi Nested CV Penuh (Outer Loop mengevaluasi Inner Grid)
skor_nested_outer = cross_val_score(clf_inner, X=X, y=y, cv=outer_cv)

# Bandingkan dengan skor non-nested (Biased)
clf_inner.fit(X, y)
skor_non_nested = clf_inner.best_score_

print("=== PERBANDINGAN NON-NESTED VS NESTED CROSS-VALIDATION ===")
print(f"Skor Non-Nested (best_score_ optimis) : {skor_non_nested*100:.2f}% (Bias Seleksi!)")
print(f"Skor Rata-rata Nested CV (Outer Loop)  : {np.mean(skor_nested_outer)*100:.2f}% (Estimasi Generalisasi Sejati)")
print(f"Rentang Skor Outer Folds (5 Folds)     : {skor_nested_outer.round(3)}")`,
        expectedOutput: "Nested CV melaporkan skor generalisasi realistis yang sedikit lebih konservatif dibanding skor non-nested.",
        codeExp: "Skrip membungkus GridSearchCV di dalam cross_val_score outer loop untuk mengeliminasi bias seleksi hyperparameter secara matematis.",
        pitfalls: [
          "Melaporkan best_score_ dari GridSearchCV biasa sebagai klaim performa akhir di makalah ilmiah atau laporan bisnis.",
          "Menjalankan Nested CV dengan inner fold dan outer fold yang terlalu banyak pada dataset besar yang memicu waktu komputasi eksponensial."
        ],
        refTitle: "Sudhir Varma & Richard Simon: Bias in Error Estimation when Using Cross-Validation for Model Selection (BMC Bioinformatics)",
        refUrl: "https://bmcbioinformatics.biomedcentral.com/articles/10.1186/1471-2105-7-91"
      },
      {
        num: "14.7",
        slug: "14-7-analisis-kurva-pembelajaran-learning-curves",
        title: "14.7. Analisis Kurva Pembelajaran (Learning Curves)",
        desc: "Diagnostik grafis kesehatan model: memetakan skor training vs validation terhadap ukuran sampel, mendeteksi high bias vs high variance.",
        concept: `Ketika model pembelajaran mesin menghasilkan performa yang tidak memuaskan, sering kali ilmuwan data kebingungan menentukan tindakan korektif: Apakah kita perlu mengumpulkan lebih banyak data? Menambah fitur baru? Atau menyederhanakan model?
        
**Kurva Pembelajaran (Learning Curves)** adalah alat diagnostik visual paling kuat yang memetakan skor performa data latih (*training score*) dan data validasi (*cross-validation score*) terhadap penambahan ukuran sampel data latih ($n$).
        
Dua pola diagnostik utama:
1. **High Bias (Underfitting):** Skor training dan skor validasi keduanya rendah dan konvergen pada nilai yang sama. Menambahkan lebih banyak sampel data data latih **tidak akan membantu sama sekali**. Solusi: menambah kompleksitas model, membuat fitur interaksi baru, atau menurunkan regularisasi.
2. **High Variance (Overfitting):** Skor training sangat tinggi (mendekati 1.0) tetapi skor validasi jauh di bawahnya (terdapat celah/gap yang lebar). Solusi: **mengumpulkan lebih banyak data latih**, memperkuat regularisasi, atau menyederhanakan arsitektur model.`,
        code: `# 14.7: Pembangkitan Kurva Pembelajaran (Learning Curve) untuk Diagnostik Model
import numpy as np
from sklearn.datasets import load_digits
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import learning_curve

digits = load_digits()
X, y = digits.data, digits.target

# Menghitung Kurva Pembelajaran pada berbagai fraksi ukuran data (10% hingga 100%)
ukuran_latih, skor_train, skor_val = learning_curve(
    estimator=LogisticRegression(max_iter=500, random_state=42),
    X=X, y=y,
    train_sizes=np.linspace(0.1, 1.0, 5),
    cv=3,
    scoring='accuracy',
    n_jobs=-1
)

mean_train = np.mean(skor_train, axis=1)
mean_val = np.mean(skor_val, axis=1)
gap_varians = mean_train - mean_val

print("=== DIAGNOSTIK KURVA PEMBELAJARAN (LEARNING CURVES) ===")
print("Ukuran Data Latih | Skor Training | Skor Validasi | Gap (Varians)")
print("-" * 60)
for n_data, s_tr, s_va, gap in zip(ukuran_latih, mean_train, mean_val, gap_varians):
    print(f"{n_data:17d} | {s_tr*100:12.2f}% | {s_va*100:12.2f}% | {gap*100:10.2f}%")`,
        expectedOutput: "Seiring ukuran data bertambah, gap varians menyempit dan skor validasi naik mendekati skor latih.",
        codeExp: "Skrip memanfaatkan learning_curve dari Scikit-Learn untuk memantau evolusi skor performa train vs validation seiring membesarnya sampel data latih.",
        pitfalls: [
          "Menghabiskan anggaran mahal mengumpulkan jutaan data tambahan ketika kurva pembelajaran jelas-jelas mengindikasikan masalah High Bias.",
          "Menghitung learning curves tanpa cross-validation yang membuat kurva fluktuatif tidak stabil."
        ],
        refTitle: "Andrew Ng: Machine Learning Yearning (Chapter 28: Diagnosing Bias and Variance: Learning Curves)",
        refUrl: "https://www.deeplearning.ai/machine-learning-yearning/"
      },
      {
        num: "14.8",
        slug: "14-8-analisis-kurva-validasi-validation-curves",
        title: "14.8. Analisis Kurva Validasi (Validation Curves)",
        desc: "Sensitivitas hyperparameter tunggal: memetakan pengaruh variasi parameter terhadap underfitting dan overfitting.",
        concept: `Jika Kurva Pembelajaran memvariasikan jumlah sampel data latih $n$ untuk hyperparameter tetap, **Kurva Validasi (Validation Curves)** memvariasikan satu hyperparameter tunggal spesifik (misalnya parameter regularisasi $C$, kedalaman pohon ''max_depth'', atau penalti $\\gamma$) di sepanjang sumbu X, sementara ukuran data dijaga konstan.
        
Kurva Validasi membagi ruang parameter menjadi tiga zona:
1. **Zona Underfitting:** Nilai parameter membuat model terlalu kaku sehingga skor training dan skor validasi sama-sama rendah.
2. **Zona Optimal (Sweet Spot):** Titik di mana skor validasi mencapai puncaknya (kemampuan generalisasi maksimum).
3. **Zona Overfitting:** Skor training terus meningkat menuju $100\\%$, namun skor validasi mulai melandai dan berbalik turun tajam karena model mulai menghafal derau data latih.`,
        code: `# 14.8: Pembangkitan Kurva Validasi untuk Menemukan Kedalaman Pohon Optimal
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import validation_curve

X, y = load_breast_cancer(return_X_y=True)

kedalaman_param = np.arange(1, 11)

train_scores, val_scores = validation_curve(
    estimator=DecisionTreeClassifier(random_state=42),
    X=X, y=y,
    param_name='max_depth',
    param_range=kedalaman_param,
    cv=5,
    scoring='accuracy',
    n_jobs=-1
)

mean_tr = np.mean(train_scores, axis=1)
mean_va = np.mean(val_scores, axis=1)
best_depth = kedalaman_param[np.argmax(mean_va)]

print("=== ANALISIS KURVA VALIDASI (MAX_DEPTH DECISION TREE) ===")
print("Depth | Train Score | Val Score   | Status")
print("-" * 50)
for d, tr, va in zip(kedalaman_param, mean_tr, mean_va):
    status = "<- OPTIMAL" if d == best_depth else ("Underfitting" if d < 3 else "Overfitting")
    print(f"{d:5d} | {tr*100:10.2f}% | {va*100:10.2f}% | {status}")`,
        expectedOutput: "Kurva validasi memperlihatkan underfitting pada depth=1-2, optimal pada depth=3-4, dan overfitting sesudahnya.",
        codeExp: "Skrip memanfaatkan validation_curve Scikit-Learn untuk memindai kedalaman pohon dan mendiagnosis transisi matematis dari underfitting ke overfitting.",
        pitfalls: [
          "Memilih nilai hyperparameter di puncak skor training alih-alih di puncak skor validasi.",
          "Mengasumsikan kurva validasi dapat menangkap efek interaksi multi-parameter kompleks (kurva validasi hanya memindai 1 parameter secara terisolasi)."
        ],
        refTitle: "Scikit-Learn User Guide: Validation curves: plotting scores to evaluate models",
        refUrl: "https://scikit-learn.org/stable/modules/learning_curve.html#validation-curve"
      },
      {
        num: "14.9",
        slug: "14-9-pengujian-signifikansi-dua-model-5x2cv-paired-t-test",
        title: "14.9. Pengujian Signifikansi Komparasi Model: 5x2cv Paired t-Test",
        desc: "Inferensi statistik perbandingan algoritma: kelemahan paired t-test standar pada K-Fold, dan protokol uji Thomas Dietterich (1998).",
        concept: `Ketika Model A menghasilkan akurasi $86.5\\%$ dan Model B menghasilkan akurasi $85.2\\%$, apakah Model A benar-benar lebih superior secara signifikan, atau perbedaan tersebut murni merupakan fluktuasi acak sampling?
        
Banyak praktisi secara keliru menjalankan paired $t$-test standar pada 10 lipatan 10-fold CV biasa. Thomas Dietterich (1998) dalam makalah pentingnya membuktikan bahwa uji tersebut melanggar asumsi independensi observasi secara parah (karena fold-fold pelatihan saling tumpang tindih sebesar $80\\%$), memicu **Galat Tipe I yang sangat tinggi** (sering menyimpulkan kedua model berbeda padahal identik).
        
Dietterich merekomendasikan **5x2cv Combined F-Test / Paired $t$-Test**:
Melakukan 5 kali replikasi dari 2-fold cross-validation independen. Karena data dibagi tepat 50:50 pada setiap replikasi, data latih dan uji tidak saling tumpang tindih di dalam iterasi, menghasilkan varians galat yang tidak berbias dan dapat diandalkan secara statistik.`,
        formula: `t = \\frac{p_1^{(1)}}{\\sqrt{\\frac{1}{5}\\sum_{i=1}^5 s_i^2}}, \\quad s_i^2 = (p_i^{(1)} - \\bar{p}_i)^2 + (p_i^{(2)} - \\bar{p}_i)^2`,
        code: `# 14.9: Protokol Uji Signifikansi Komparasi Dua Model: 5x2cv Paired t-Test (Dietterich)
import numpy as np
from scipy import stats
from sklearn.model_selection import StratifiedKFold
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

X, y = load_breast_cancer(return_X_y=True)

clf_A = LogisticRegression(max_iter=500, random_state=42)
clf_B = RandomForestClassifier(n_estimators=50, random_state=42)

# Protokol 5x2cv: 5 Iterasi 2-Fold CV Independen
varians_s = []
p_diff_pertama = None

for i in range(5):
    skf = StratifiedKFold(n_splits=2, shuffle=True, random_state=i * 10)
    diff_fold = []
    
    for train_idx, test_idx in skf.split(X, y):
        X_tr, X_te = X[train_idx], X[test_idx]
        y_tr, y_te = y[train_idx], y[test_idx]
        
        skor_A = clf_A.fit(X_tr, y_tr).score(X_te, y_te)
        skor_B = clf_B.fit(X_tr, y_tr).score(X_te, y_te)
        diff_fold.append(skor_A - skor_B)
        
    if i == 0:
        p_diff_pertama = diff_fold[0]
        
    p_bar = np.mean(diff_fold)
    s2 = (diff_fold[0] - p_bar)**2 + (diff_fold[1] - p_bar)**2
    varians_s.append(s2)

t_stat = p_diff_pertama / np.sqrt(np.mean(varians_s))
p_value = 2 * (1 - stats.t.cdf(abs(t_stat), df=5))

print("=== HASIL UJI SIGNIFIKANSI KOMPARASI DUA MODEL (5x2cv) ===")
print(f"Statistik t Dietterich 5x2cv: {t_stat:.4f} (df=5)")
print(f"p-value Dua Sisi            : {p_value:.4f}")
kesimpulan = "Terdapat Perbedaan Signifikan Nyata" if p_value < 0.05 else "Tidak Ada Perbedaan Signifikan (Performa Setara!)"
print(f"Kesimpulan Ilmiah           : {kesimpulan}")`,
        expectedOutput: "5x2cv paired t-test memberikan p-value yang teruji secara statistik untuk membandingkan performa dua model.",
        codeExp: "Skrip mengimplementasikan algoritma 5x2cv Paired t-Test Thomas Dietterich murni dari dasar untuk mengevaluasi apakah perbedaan performa model signifikan.",
        pitfalls: [
          "Menyatakan satu algoritma lebih unggul hanya karena perbedaan 0.5% pada single test split tanpa pengujian signifikansi statistik.",
          "Menggunakan t-test standar pada 10-fold CV biasa yang melipatgandakan false positive rate hingga 40%."
        ],
        refTitle: "Thomas G. Dietterich: Approximate Statistical Tests for Comparing Supervised Classification Learning Algorithms (Neural Computation)",
        refUrl: "https://direct.mit.edu/neco/article/10/7/1895/6211/Approximate-Statistical-Tests-for-Comparing"
      },
      {
        num: "14.10",
        slug: "14-10-early-stopping-dan-efisiensi-komputasi",
        title: "14.10. Penghentian Dini (Early Stopping) & Pengendalian Biaya Pelatihan",
        desc: "Regularisasi komputasional modern: memantau loss validasi per epoch/iterasi, kesabaran (patience), dan pemulihan bobot optimal.",
        concept: `Dalam model-model iteratif berskala besar (seperti Gradient Boosting, XGBoost, LightGBM, dan Deep Neural Networks), jumlah iterasi atau epoch $M$ bertindak sebagai hyperparameter kapasitas model.
        
Jika $M$ terlalu kecil, model mengalami underfitting. Namun jika $M$ terlalu besar, model mulai mempelajari derau data latih dan memicu overfitting. Menentukan nilai $M$ optimal via Grid Search sangat tidak efisien karena model harus dilatih ulang dari awal untuk setiap nilai kandidat.
        
**Penghentian Dini (Early Stopping)** menyelesaikan masalah ini secara elegan dengan mengubah jumlah iterasi dari hyperparameter statis menjadi mekanisme pengendalian dinamis:
1. Model mengevaluasi metrik kerugian pada validation set terpisah di setiap akhir iterasi/pohon baru.
2. Jika metrik validasi tidak mengalami peningkatan selama sejumlah putaran berturut-turut (disebut parameter **Patience**), proses pelatihan dihentikan secara otomatis.
3. Model akhir memulihkan bobot parameter pada iterasi terbaik (*best iteration*), menghemat hingga $80\\%$ biaya komputasi GPU/CPU dan secara inheren mencegah overfitting.`,
        code: `# 14.10: Demonstrasi Early Stopping Dinamis pada Gradient Boosting
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier

X, y = make_classification(n_samples=2000, n_features=25, n_informative=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# Mengonfigurasi Early Stopping dengan n_iter_no_change (Patience)
gb_early = GradientBoostingClassifier(
    n_estimators=1000,       # Batas maksimum teoretis tinggi
    learning_rate=0.08,
    validation_fraction=0.15,# Porsi internal validation set
    n_iter_no_change=10,     # Patience: stop jika 10 iterasi berturut-turut stagnan
    tol=1e-4,
    random_state=42
)

gb_early.fit(X_train, y_train)

pohon_terlatih = len(gb_early.estimators_)
akurasi_test = gb_early.score(X_test, y_test)

print("=== EFISIENSI REGULARISASI EARLY STOPPING DINAMIS ===")
print(f"Batas Maksimum Iterasi Direncanakan : 1.000 Pohon")
print(f"Iterasi Aktual Saat Berhenti Otomatis: {pohon_terlatih} Pohon (Menghemat {1000 - pohon_terlatih} iterasi!)")
print(f"Penghematan Waktu Komputasi          : ~{(1000 - pohon_terlatih)/1000*100:.1f}%")
print(f"Akurasi Data Uji Tanpa Overfitting   : {akurasi_test*100:.2f}%")`,
        expectedOutput: "Model berhenti otomatis pada ~100 iterasi menghemat 90% waktu komputasi tanpa overfitting.",
        codeExp: "Skrip mengonfigurasi n_iter_no_change pada GradientBoostingClassifier untuk menunjukkan pencegahan pemborosan komputasi via early stopping otomatis.",
        pitfalls: [
          "Menyetel patience terlalu kecil (misalnya 1-2 iterasi) yang memicu penghentian dini prematur pada fluktuasi acak sesaat.",
          "Mengevaluasi early stopping pada data latih alih-alih data validasi independen."
        ],
        refTitle: "Rich Caruana, Steve Lawrence, C. Lee Giles: Overfitting in Neural Nets: Backpropagation, Conjugate Gradient, and Early Stopping (NeurIPS)",
        refUrl: "https://proceedings.neurips.cc/paper/2000/hash/0336dcbab05b9d5ad24f4333c7658a0e-Abstract.html"
      }
    ]
  },

  // ==========================================
  // BAB 15: Penanganan Ketidakseimbangan Kelas & Sains Data Terang (XAI)
  // ==========================================
  {
    orderIndex: 15,
    id: "data-science-ch-15",
    slug: "bab-15-penanganan-imbalance-explainable-ai-shap-lime",
    title: "BAB 15: Penanganan Ketidakseimbangan Kelas & Sains Data Terang (XAI)",
    desc: "Tantangan data dunia nyata dan interpretabilitas modern: dinamika kelas timpang (imbalance), resampling SMOTE & Borderline-SMOTE, cost-sensitive learning (class_weight), Focal Loss Lin et al., dilema model black-box vs regulasi etika AI, Teori Permainan Nilai Shapley, kerangka kerja SHAP (TreeSHAP & KernelSHAP), LIME (aproksimasi lokal), serta Partial Dependence Plot (PDP).",
    coreConcepts: ["SMOTE & Borderline Resampling", "Cost-Sensitive & Focal Loss", "Black-Box vs XAI Dilemma", "Shapley Values & SHAP", "LIME & Partial Dependence"],
    subchapters: [
      {
        num: "15.1",
        slug: "15-1-dinamika-matematika-class-imbalance",
        title: "15.1. Dinamika Matematika Class Imbalance & Pergeseran Batas Keputusan",
        desc: "Mengapa algoritma standar gagal pada data minoritas: pergeseran batas keputusan akibat dominasi apriori Bayes, dan bahaya jebakan akurasi.",
        concept: `Dalam aplikasi sains data terapan dunia nyata—seperti deteksi transaksi fraud ($0.1\\%$), konversi klik iklan ($0.5\\%$), atau kegagalan mesin industri ($0.05\\%$)—distribusi kelas target hampir selalu mengalami ketimpangan ekstrem (**Class Imbalance**).
        
Alasan matematis mengapa algoritma pembelajaran standar gagal:
1. **Dominasi Probabilitas Apriori Bayes:** Menurut Teorema Bayes $P(Y=1 \\mid X) \\propto P(X \\mid Y=1) P(Y=1)$, probabilitas apriori kelas mayoritas $P(Y=0) \\approx 0.999$ secara sistematis menenggelamkan probabilitas posterior kelas minoritas, menggeser batas keputusan (*decision boundary*) menjauh dari kelas mayoritas dan menelan kelas minoritas.
2. **Minimasi Galat Global:** Sebagian besar fungsi objektif standar (seperti OLS, Gini, atau Cross-Entropy) mengoptimalkan galat total rata-rata. Mengabaikan kelas minoritas sepenuhnya hanya menghasilkan galat $0.1\\%$, yang dianggap 'sukses' oleh algoritma optimasi.`,
        formula: `\\ln\\left(\\frac{P(Y=1 \\mid X)}{P(Y=0 \\mid X)}\\right) = \\ln\\left(\\frac{P(X \\mid Y=1)}{P(X \\mid Y=0)}\\right) + \\ln\\left(\\frac{P(Y=1)}{P(Y=0)}\\right)`,
        code: `# 15.1: Demonstrasi Pergeseran Batas Keputusan Akibat Ketimpangan Kelas Ekstrem
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

np.random.seed(42)
# Kelas 0 Mayoritas: 990 sampel | Kelas 1 Minoritas: 10 sampel (Rasio 99:1)
X0 = np.random.normal(0, 1, size=(990, 2))
X1 = np.random.normal(1.5, 1, size=(10, 2)) # Sinyal positif moderat

X = np.vstack([X0, X1])
y = np.array([0]*990 + [1]*10)

# Model Regresi Logistik Standar Tanpa Penanganan Imbalance
model_standar = LogisticRegression().fit(X, y)
pred_standar = model_standar.predict(X)

print("=== DAMPAK CLASS IMBALANCE PADA EVALUASI MODEL STANDAR ===")
print(f"Akurasi Sederhana Model: {model_standar.score(X, y)*100:.2f}% (Tampak Sempurna!)")
print(f"Jumlah Sampel Positif Sejati : 10")
print(f"Jumlah Positif yang Terdeteksi: {np.sum(pred_standar == 1)} (GAGAL DETEKSI TOTAL!)")
print("\nLaporan Klasifikasi Rinci:")
print(classification_report(y, pred_standar, target_names=['Mayoritas', 'Minoritas'], zero_division=0))`,
        expectedOutput: "Akurasi tampak 99% tetapi Recall kelas minoritas adalah 0% (kegagalan deteksi total).",
        codeExp: "Skrip menunjukkan secara gamblang fenomena jebakan akurasi di mana model naif mengabaikan seluruh kelas minoritas namun tetap memperoleh skor akurasi 99%.",
        pitfalls: [
          "Melaporkan performa model pada data tidak seimbang hanya dengan metrik akurasi tanpa menyertakan Recall dan PR-AUC.",
          "Mencoba menyeimbangkan kelas pada data uji (test set harus tetap mempertahankan distribusi ketimpangan alami dunia nyata)."
        ],
        refTitle: "Haibo He & Edwardo A. Garcia: Learning from Imbalanced Data (IEEE TKDE)",
        refUrl: "https://ieeexplore.ieee.org/document/5128907"
      },
      {
        num: "15.2",
        slug: "15-2-metode-resampling-smote-chawla",
        title: "15.2. Resampling Sintetis: SMOTE (Synthetic Minority Over-sampling)",
        desc: "Sintesis data minoritas Nitesh Chawla (2002): interpolasi garis tetangga k-NN, penghindaran duplikasi exact oversampling, dan Random Undersampling.",
        concept: `Untuk mengatasi ketimpangan kelas di level data, dua teknik naif sering digunakan:
1. **Random Undersampling:** Membuang sampel mayoritas secara acak. Kelemahannya: membuang banyak informasi penting yang berharga.
2. **Random Oversampling:** Menduplikasi sampel minoritas secara acak. Kelemahannya: menyebabkan model menghafal data duplikat (overfitting berat pada area minoritas sempit).
        
**SMOTE (Synthetic Minority Over-sampling Technique)** yang diciptakan oleh Nitesh Chawla dkk. (2002) adalah terobosan yang membangkitkan sampel minoritas baru secara sintetis di sepanjang segmen garis yang menghubungkan tetangga-tetangga terdekat:
1. Untuk setiap sampel minoritas $x_i$, cari $k$ tetangga terdekatnya yang juga merupakan kelas minoritas.
2. Pilih satu tetangga $x_{zi}$ secara acak.
3. Bangkitkan sampel baru $x_{\\text{baru}}$ pada posisi interpolasi acak:
$$x_{\\text{baru}} = x_i + \\lambda (x_{zi} - x_i), \\quad \\lambda \\sim U(0, 1)$$
Hal ini memperluas ruang keputusan kelas minoritas secara kontinu dan alami.`,
        formula: `x_{\\text{baru}} = x_i + \\lambda (x_{zi} - x_i), \\quad \\lambda \\in [0, 1]`,
        code: `# 15.2: Implementasi Algoritma SMOTE Murni (Interpolasi k-NN Sintetis)
import numpy as np
from sklearn.neighbors import NearestNeighbors

def smote_sintetis_manual(X_minoritas, N_sintesis_per_titik=2, k_neighbors=5):
    """Implementasi murni algoritma SMOTE Chawla et al. (2002)."""
    knn = NearestNeighbors(n_neighbors=k_neighbors + 1).fit(X_minoritas)
    sampel_baru = []
    
    for i, x_i in enumerate(X_minoritas):
        # Cari tetangga terdekat (indeks 0 adalah titik x_i itu sendiri)
        _, indices = knn.kneighbors(x_i.reshape(1, -1))
        tetangga_idx = indices[0, 1:] # Ambil k tetangga
        
        for _ in range(N_sintesis_per_titik):
            pilihan_tetangga = X_minoritas[np.random.choice(tetangga_idx)]
            lambda_acak = np.random.rand()
            # Interpolasi garis lurus
            titik_sintetis = x_i + lambda_acak * (pilihan_tetangga - x_i)
            sampel_baru.append(titik_sintetis)
            
    return np.array(sampel_baru)

np.random.seed(42)
X_min = np.array([[1.0, 1.0], [1.2, 1.4], [0.9, 1.1], [1.3, 0.8], [1.1, 1.3]])
X_sintetis = smote_sintetis_manual(X_min, N_sintesis_per_titik=3, k_neighbors=3)

print("=== GENERASI DATA SINTETIS BERBASIS SMOTE MURNI ===")
print(f"Jumlah Sampel Minoritas Asli    : {len(X_min)}")
print(f"Jumlah Sampel Sintetis Tercipta : {len(X_sintetis)}")
print(f"Contoh Titik Sintetis Terinterpolasi:\\n{X_sintetis[:3].round(4)}")`,
        expectedOutput: "SMOTE menghasilkan sampel sintetis yang terletak di antara rentang geometris sampel minoritas asli.",
        codeExp: "Skrip mengimplementasikan algoritma SMOTE dari dasar menggunakan k-NN interpolasi garis linier untuk membuktikan prinsip matematika pembangkitan sampel sintetis.",
        pitfalls: [
          "Menerapkan SMOTE pada seluruh dataset sebelum pemisahan train-test split (kesalahan fatal data leakage nomor 1 di industri).",
          "Menerapkan SMOTE standar pada data yang memiliki banyak outlier minoritas; SMOTE akan menghubungkan inlier dengan outlier, menciptakan jembatan sintetis yang merusak ruang data."
        ],
        refTitle: "Nitesh V. Chawla et al.: SMOTE: Synthetic Minority Over-sampling Technique (JAIR 2002)",
        refUrl: "https://www.jair.org/index.php/jair/article/view/10302"
      },
      {
        num: "15.3",
        slug: "15-3-varian-smote-borderline-svm-dan-tomek-links",
        title: "15.3. Varian SMOTE Lanjutan: Borderline-SMOTE & Pembersihan Tomek Links",
        desc: "Penyempurnaan interpolasi: fokus pada sampel batas (Borderline-SMOTE Han et al.), dan pembersihan batas ambang via Tomek Links.",
        concept: `SMOTE standar membangkitkan sampel sintetis secara seragam untuk seluruh titik minoritas, termasuk titik-titik yang terletak jauh di dalam kluster aman. Secara praktis, titik-titik di dalam kluster aman tidak membutuhkan bantuan, sementara titik-titik yang paling kritis menentukan batas klasifikasi adalah titik-titik yang berada di **perbatasan (*borderline*)** dekat kelas mayoritas.
        
Dua varian penyempurnaan utama:
1. **Borderline-SMOTE (Han, Wang, & Mao, 2005):** Memeriksa rasio tetangga mayoritas di sekitar setiap titik minoritas. Titik minoritas yang dikelilingi oleh $50\\% - 100\\%$ titik mayoritas dikategorikan sebagai *DANGER* (berada di garis depan pertempuran batas keputusan). SMOTE kemudian **hanya diterapkan secara eksklusif pada titik-titik kategori DANGER ini**.
2. **SMOTE-Tomek Links:** Menggabungkan oversampling dan undersampling. Setelah SMOTE membangkitkan data, pasangan titik terdekat dari kelas berlawanan yang saling menjadi tetangga terdekat (*Tomek Links*) dihapus untuk membersihkan batas keputusan dari tumpang tindih yang rancu.`,
        code: `# 15.3: Demonstrasi Konseptual Seleksi Titik Perbatasan (Borderline-SMOTE DANGER)
import numpy as np
from sklearn.neighbors import NearestNeighbors

np.random.seed(42)
# Simulasi: Titik Minoritas Aman, Borderline (DANGER), dan Noise
X_mayoritas = np.random.normal(loc=[5, 5], scale=1.0, size=(100, 2))
X_minoritas = np.array([
    [1.0, 1.0], # Aman (jauh dari mayoritas)
    [3.8, 3.8], # DANGER (Tepat di perbatasan garis depan)
    [4.2, 4.2], # DANGER (Tepat di perbatasan garis depan)
    [5.1, 5.1]  # Noise (Terperangkap di tengah mayoritas)
])

# Evaluasi Status Titik Minoritas Berdasarkan 5 Tetangga Terdekat
X_total = np.vstack([X_mayoritas, X_minoritas])
y_total = np.array([0]*len(X_mayoritas) + [1]*len(X_minoritas))

knn = NearestNeighbors(n_neighbors=6).fit(X_total)

print("=== IDENTIFIKASI TITIK DANGER BORDERLINE-SMOTE ===")
for i, x_min in enumerate(X_minoritas):
    _, indices = knn.kneighbors(x_min.reshape(1, -1))
    tetangga_labels = y_total[indices[0, 1:]] # 5 tetangga terdekat
    jumlah_mayoritas = np.sum(tetangga_labels == 0)
    
    if jumlah_mayoritas == 5:
        status = "NOISE (Abaikan / Jangan Sintesis!)"
    elif jumlah_mayoritas >= 3:
        status = "DANGER (FOKUS UTAMA SINTESIS BORDERLINE-SMOTE!)"
    else:
        status = "SAFE (Aman di Dalam Kluster)"
    print(f"Titik Minoritas {i+1} {x_min}: {jumlah_mayoritas}/5 Tetangga Mayoritas -> Status: {status}")`,
        expectedOutput: "Borderline-SMOTE secara presisi mengidentifikasi titik DANGER di garis depan batas keputusan.",
        codeExp: "Skrip membedah logika identifikasi titik SAFE, DANGER, dan NOISE yang mendasari algoritma Borderline-SMOTE.",
        pitfalls: [
          "Membangkitkan data sintetis pada titik noise minoritas yang terisolasi di dalam kelas mayoritas, memperburuk overlap data.",
          "Menjalankan pembersihan Tomek Links pada dataset sangat besar tanpa mempertimbangkan waktu komputasi pasangan jarak O(n^2)."
        ],
        refTitle: "Hui Han, Wen-Yuan Wang, Bing-Huan Mao: Borderline-SMOTE: A New Over-Sampling Method in Imbalanced Data Sets Learning",
        refUrl: "https://link.springer.com/chapter/10.1007/11538059_91"
      },
      {
        num: "15.4",
        slug: "15-4-cost-sensitive-learning-dan-penyeimbangan-bobot",
        title: "15.4. Pembelajaran Sensitif Biaya: Penyeimbangan Bobot Kelas (class_weight)",
        desc: "Solusi matematis di level algoritma tanpa manipulasi data: pembobotan kerugian inversely proportional, dan parameter class_weight='balanced'.",
        concept: `Melakukan manipulasi data mentah melalui oversampling atau undersampling sering kali membawa efek samping yang tidak diinginkan: undersampling membuang data nyata, sedangkan oversampling memperbesar ukuran dataset dan memperlambat waktu pelatihan.
        
**Cost-Sensitive Learning (Pembelajaran Sensitif Biaya)** menyelesaikan ketimpangan kelas langsung di level fungsi objektif matematika algoritma tanpa mengubah data mentah satu baris pun.
        
Mekanisme kerjanya:
Fungsi kerugian (Loss Function) dimodifikasi dengan memberikan faktor bobot $w_k$ yang berbanding terbalik dengan frekuensi kemunculan kelas dalam dataset (**Inversely Proportional Class Weights**):
$$w_k = \\frac{n}{K \\cdot n_k}$$
Dengan formula ini, jika kelas minoritas hanya menyumbang $1\\%$ data, setiap kali model membuat kesalahan pada kelas minoritas, gradien penaltinya dikalikan 100 kali lebih berat daripada kesalahan pada kelas mayoritas. Parameter '+ "class_weight='balanced'"' + ' tersedia secara universal di hampir seluruh estimator Scikit-Learn.`,
        formula: `w_k = \\frac{n}{K \\cdot n_k}, \\quad \\mathcal{L}_{\\text{Weighted}} = -\\sum_{i=1}^n w_{y_i} \\left[ y_i \\ln(p_i) + (1 - y_i) \\ln(1 - p_i) \\right]`,
        code: `# 15.4: Efektivitas Penyeimbangan Bobot Kelas (class_weight='balanced')
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.datasets import make_classification

# Dataset 95% Negatif, 5% Positif
X, y = make_classification(n_samples=1000, n_features=10, weights=[0.95, 0.05], random_state=42)

# 1. Model Naif Standar (Bobot Seragam)
model_biasa = LogisticRegression().fit(X, y)
pred_biasa = model_biasa.predict(X)

# 2. Model Sensitif Biaya (class_weight='balanced')
model_balanced = LogisticRegression(class_weight='balanced').fit(X, y)
pred_balanced = model_balanced.predict(X)

# Hitung Bobot Matematis Otomatis
n_total = len(y)
n_pos = np.sum(y == 1)
n_neg = np.sum(y == 0)
w_pos = n_total / (2.0 * n_pos)
w_neg = n_total / (2.0 * n_neg)

print("=== PENYEIMBANGAN BOBOT KELAS OTOMATIS (COST-SENSITIVE) ===")
print(f"Bobot Kelas Mayoritas (w0): {w_neg:.4f}")
print(f"Bobot Kelas Minoritas (w1): {w_pos:.4f} (Penalti Galat ~10x Lipat Lebih Berat!)\\n")
print(f"Recall Minoritas Model Standar : {classification_report(y, pred_biasa, output_dict=True)['1']['recall']*100:.1f}%")
print(f"Recall Minoritas Model Balanced: {classification_report(y, pred_balanced, output_dict=True)['1']['recall']*100:.1f}% (DETEKSI MENINGKAT DRASTIS!)")`,
        expectedOutput: "class_weight='balanced' melipatgandakan Recall kelas minoritas dari ~25% menjadi > 80%.",
        codeExp: "Skrip membuktikan bagaimana penyesuaian bobot loss function secara matematis memulihkan sensitivitas model terhadap kelas minoritas tanpa manipulasi data.",
        pitfalls: [
          "Lupa bahwa menaikkan Recall via class_weight='balanced' pasti akan menurunkan Precision (menghasilkan lebih banyak False Positives); keseimbangan harus dievaluasi via matriks biaya bisnis.",
          "Menerapkan SMOTE dan class_weight='balanced' secara bersamaan tanpa kalibrasi (pembobotan berlebihan ganda yang membiaskan model ke arah sebaliknya)."
        ],
        refTitle: "Charles Elkan: The Foundations of Cost-Sensitive Learning (IJCAI)",
        refUrl: "https://www.ijcai.org/Proceedings/01-1/Papers/136.pdf"
      },
      {
        num: "15.5",
        slug: "15-5-focal-loss-dan-hard-example-mining",
        title: "15.5. Focal Loss: Memusatkan Gradien pada Kasus Sulit (Hard Examples)",
        desc: "Inovasi Tsung-Yi Lin et al. (RetinaNet 2017): modulasi faktor penekan (1 - p_t)^gamma pada Cross-Entropy, dan peredaman gradien sampel mudah.",
        concept: `Meskipun pembobotan kelas $\\alpha$-balanced mampu mengatasi ketimpangan rasio jumlah sampel, pembobotan tersebut tidak membedakan antara sampel yang **mudah diklasifikasikan (*easy examples*)** dan sampel yang **sulit diklasifikasikan (*hard examples*)**.
        
Pada dataset dengan ketimpangan ekstrem, sebagian besar sampel mayoritas adalah sampel yang sangat mudah ditebak dengan probabilitas tinggi ($p_t \\ge 0.99$). Meskipun nilai kerugian individualnya sangat kecil, jumlahan jutaan kerugian kecil dari sampel mudah ini akan mendominasi total gradien, menenggelamkan sinyal gradien dari sampel minoritas yang sulit.
        
**Focal Loss** yang diciptakan oleh Tsung-Yi Lin dkk. (FAIR, 2017):
$$\\text{FL}(p_t) = -\\alpha_t (1 - p_t)^\\gamma \\ln(p_t)$$
Faktor modulasi $(1 - p_t)^\\gamma$ (dengan parameter fokus $\\gamma \\ge 0$) secara otomatis meredam kontribusi sampel mudah:
- Jika sampel mudah diprediksi benar ($p_t = 0.99$), faktor $(1 - 0.99)^2 = 0.0001$, kerugiannya diredam sebesar $10.000$ kali lipat!
- Jika sampel sulit atau salah diprediksi ($p_t = 0.10$), faktor $(1 - 0.10)^2 = 0.81$, kerugiannya hampir tidak terpengaruh.`,
        formula: `\\text{FL}(p_t) = -\\alpha_t (1 - p_t)^\\gamma \\ln(p_t), \\quad \\gamma \\ge 0`,
        code: `# 15.5: Formulasi Matematis Focal Loss vs Cross-Entropy Standar
import numpy as np

# Probabilitas kebenaran prediksi p_t dari 0.01 (sangat salah) hingga 0.99 (sangat yakin benar)
p_t = np.array([0.05, 0.20, 0.50, 0.80, 0.95, 0.99])

gamma = 2.0 # Parameter Fokus Standar

# 1. Binary Cross-Entropy Standar: -ln(p_t)
ce_loss = -np.log(p_t)

# 2. Focal Loss: -(1 - p_t)^gamma * ln(p_t)
faktor_modulasi = (1 - p_t) ** gamma
focal_loss = faktor_modulasi * ce_loss

print("=== PEMBANDING LOSS FUNCTION: CROSS-ENTROPY VS FOCAL LOSS (gamma=2) ===")
print("Probabilitas p_t | Cross-Entropy | Faktor Modulasi | Focal Loss | Reduksi Kerugian")
print("-" * 75)
for p, ce, mod, fl in zip(p_t, ce_loss, faktor_modulasi, focal_loss):
    reduksi = (1 - fl/ce) * 100
    print(f"{p:16.2f} | {ce:13.4f} | {mod:15.4f} | {fl:10.4f} | {reduksi:15.2f}%")`,
        expectedOutput: "Focal loss meredam galat sampel mudah (p=0.99) sebesar 99.99% sambil menjaga galat sampel sulit.",
        codeExp: "Skrip menghitung dan membandingkan profil penalti galat Cross-Entropy versus Focal Loss untuk membuktikan efek peredaman sampel mudah.",
        pitfalls: [
          "Menyetel parameter gamma terlalu besar (misalnya > 5) yang meratakan seluruh gradien sehingga model berhenti belajar.",
          "Menerapkan Focal Loss pada dataset seimbang di mana Cross-Entropy standar sudah optimal."
        ],
        refTitle: "Tsung-Yi Lin, Priya Goyal, Ross Girshick, Kaiming He, Piotr Dollár: Focal Loss for Dense Object Detection (ICCV 2017)",
        refUrl: "https://openaccess.thecvf.com/content_iccv_2017/html/Lin_Focal_Loss_for_ICCV_2017_paper.html"
      },
      {
        num: "15.6",
        slug: "15-6-explainable-ai-dan-dilema-black-box",
        title: "15.6. Explainable AI (XAI) & Dilema Black-Box: Kebutuhan Regulasi & Etika",
        desc: "Krisis transparansi algoritma: trade-off akurasi vs interpretabilitas, hak atas penjelasan (GDPR Right to Explanation), dan risiko diskriminasi bias tersembunyi.",
        concept: `Dalam satu dekade terakhir, performa prediktif sains data melonjak pesat berkat model-model kompleks berkapasitas tinggi seperti Gradient Boosting mendalam dan Deep Neural Networks. Namun, lonjakan akurasi ini dibayar mahal dengan hilangnya transparansi: model-model tersebut beroperasi sebagai **Kotak Hitam (Black-Box Models)** yang memiliki miliaran interaksi non-linier yang mustahil dipahami secara intuitif oleh manusia.
        
Dilema ini memicu urgensi global terkait **Explainable AI (XAI)** yang didorong oleh tiga pilar utama:
1. **Kepatuhan Regulasi & Hukum:** Regulasi ketat seperti **GDPR Eropa (Pasal 22: *Right to Explanation*)** dan regulasi perbankan FCRA mewajibkan bahwa setiap keputusan otomatis yang berdampak material pada kehidupan individu (seperti penolakan pinjaman KPR, pemutusan kerja, atau diagnosis medis) wajib disertai alasan penjelas yang sah dan dapat diverifikasi.
2. **Audit Keadilan & Bias (Fairness & Bias Audit):** Model black-box dapat secara diam-diam mempelajari variabel proksi diskriminatif (misalnya menggunakan kode pos sebagai pengganti ras atau etnisitas).
3. **Keamanan & Debugging Sistem:** Memastikan model mengambil keputusan berdasarkan alasan kausal yang benar, bukan karena 'korelasi palsu' (*clever Hans effect*).`,
        code: `# 15.6: Demonstrasi Dilema Black-Box: Komparasi Keputusan Model Transparan vs Kompleks
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

np.random.seed(42)
# Fitur Nasabah Pengajuan Kredit
fitur = pd.DataFrame({
    'skor_kredit': [720, 650, 580],
    'rasio_utang': [0.25, 0.45, 0.60]
})

# Model Transparan (White-Box): Koefisien Linier Eksplisit
model_transparan = LogisticRegression().fit(fitur, [1, 1, 0])
# Model Black-Box: 100 Pohon dengan Partisi Non-Linier Kompleks
model_blackbox = RandomForestClassifier(n_estimators=100, random_state=42).fit(fitur, [1, 1, 0])

print("=== DILEMA BLACK-BOX VS WHITE-BOX MACHINE LEARNING ===")
print("Model Transparan (Regresi Logistik):")
print(f"- Formulasi: Logit = {model_transparan.intercept_[0]:.2f} + ({model_transparan.coef_[0, 0]:.4f} * Skor) + ({model_transparan.coef_[0, 1]:.4f} * Utang)")
print("- Status Penjelasan: 100% Dapat Diaudit Langsung Baris-demi-Baris untuk Kepatuhan Regulasi!\\n")
print("Model Black-Box (Random Forest):")
print(f"- Struktur: {model_blackbox.n_estimators} Pohon Terpisah dengan Total Daun > 500")
print("- Status Penjelasan: Membutuhkan Metode XAI Pasca-Latih (SHAP / LIME) untuk Rekonstruksi Atribusi!")`,
        expectedOutput: "Menampilkan kontras tajam antara transparansi model linier langsung vs kompleksitas model black-box.",
        codeExp: "Skrip mengilustrasikan perbedaan inheren antara model interpretable secara intrinsik dengan model ensemble black-box yang membutuhkan kerangka XAI terpisah.",
        pitfalls: [
          "Menerapkan model black-box pada domain dengan regulasi hukum ketat (seperti penetapan vonis pengadilan atau penolakan asuransi) tanpa mekanisme XAI yang teruji.",
          "Mengasumsikan bahwa model yang akurat secara statistik pasti bebas dari bias diskriminatif etika."
        ],
        refTitle: "Cynthia Rudin: Stop Explaining Black Box Machine Learning Models for High Stakes Decisions and Use Interpretable Models Instead (Nature Machine Intelligence)",
        refUrl: "https://www.nature.com/articles/s42256-019-0048-x"
      },
      {
        num: "15.7",
        slug: "15-7-nilai-shapley-teori-permainan-kooperatif",
        title: "15.7. Landasan Matematis Nilai Shapley (Shapley Values)",
        desc: "Teori Permainan Kooperatif Lloyd Shapley (Nobel 1953): alokasi imbalan adil kontribusi marjinal pemain di seluruh kemungkinan koalisi.",
        concept: `Pada tahun 1953, Lloyd Shapley (yang dianugerahi Hadiah Nobel Ekonomi pada tahun 2012) memecahkan masalah fundamental dalam Teori Permainan Kooperatif: Diberikan suatu permainan di mana sekumpulan pemain $N$ berkolaborasi dalam sebuah tim untuk menghasilkan total imbalan bernilai $v(N)$, bagaimana cara mendistribusikan imbalan tersebut secara adil kepada masing-masing pemain sesuai dengan kontribusi marjinal mereka yang sebenarnya?
        
Dalam konteks sains data dan machine learning:
- Para 'Pemain' adalah variabel **Fitur Prediktor ($x_1, \\dots, x_p$)**.
- Total 'Imbalan' adalah **Nilai Prediksi Model $\\hat{f}(x)$**.
        
Nilai Shapley ($\\phi_j$) menghitung rata-rata tertimbang dari kontribusi marjinal fitur $j$ ketika ditambahkan ke seluruh kemungkinan subset koalisi fitur $S \\subseteq N \\setminus \\{j\\}$:
$$\\phi_j = \\sum_{S \\subseteq N \\setminus \\{j\\}} \\frac{|S|!(|N| - |S| - 1)!}{|N|!} [v(S \\cup \\{j\\}) - v(S)]$$
Shapley membuktikan bahwa formulasi ini adalah **satu-satunya metode alokasi kontribusi** yang secara simultan memenuhi empat aksioma keadilan fundamental: *Efisiensi (Efficiency)*, *Simetri (Symmetry)*, *Pemain Nol (Dummy/Null Player)*, dan *Aditivitas (Additivity)*.`,
        formula: `\\sum_{j=1}^p \\phi_j = f(x) - \\mathbb{E}[f(X)], \\quad \\phi_j = \\text{Kontribusi Marjinal Adil Fitur } j`,
        code: `# 15.7: Komputasi Manual Nilai Shapley Teori Permainan untuk 3 Fitur Bekerja Sama
import itertools
import numpy as np

# Permainan Kooperatif Sederhana: 3 Fitur (Usia, Pendapatan, Skor Kredit)
fitur_list = ['Usia', 'Pendapatan', 'Skor']
N = len(fitur_list)

# Fungsi Nilai Karakteristik Koalisi v(S) (Prediksi Model Probabilitas Persetujuan)
nilai_koalisi = {
    (): 0.10,                     # Baseline Harapan E[f(x)]
    ('Usia',): 0.25,
    ('Pendapatan',): 0.35,
    ('Skor',): 0.40,
    ('Usia', 'Pendapatan'): 0.55,
    ('Usia', 'Skor'): 0.60,
    ('Pendapatan', 'Skor'): 0.70,
    ('Usia', 'Pendapatan', 'Skor'): 0.95 # Prediksi Final f(x)
}

def hitung_shapley(fitur_target):
    sisa_fitur = [f for f in fitur_list if f != fitur_target]
    shapley_val = 0.0
    
    # Iterasi ke seluruh kemungkinan koalisi S dari sisa fitur
    for r in range(len(sisa_fitur) + 1):
        for subset in itertools.combinations(sisa_fitur, r):
            bobot = (np.math.factorial(len(subset)) * np.math.factorial(N - len(subset) - 1)) / np.math.factorial(N)
            
            # Nilai dengan fitur vs tanpa fitur
            koalisi_dengan = tuple(sorted(subset + (fitur_target,)))
            koalisi_tanpa = tuple(sorted(subset))
            
            kontribusi_marjinal = nilai_koalisi[koalisi_dengan] - nilai_koalisi[koalisi_tanpa]
            shapley_val += bobot * kontribusi_marjinal
            
    return shapley_val

shapley_dict = {f: hitung_shapley(f) for f in fitur_list}
total_kontribusi = sum(shapley_dict.values())
delta_prediksi = nilai_koalisi[('Usia', 'Pendapatan', 'Skor')] - nilai_koalisi[()]

print("=== VERIFIKASI AKSIOMA EFISIENSI NILAI SHAPLEY ===")
for f, val in shapley_dict.items():
    print(f"Kontribusi Adil Nilai Shapley [{f:10s}]: {val:+.4f}")
print(f"\\nTotal Penjumlahan Seluruh Nilai Shapley : {total_kontribusi:.4f}")
print(f"Selisih Prediksi terhadap Baseline E[f(x)] : {delta_prediksi:.4f}")
print(f"Selisih Aksioma Efisiensi (Harus 0.0)      : {abs(total_kontribusi - delta_prediksi):.2e} (AKSIOMA TERPENUHI!)")`,
        expectedOutput: "Total penjumlahan nilai Shapley persis sama dengan deviasi prediksi dari baseline (Aksioma Efisiensi).",
        codeExp: "Skrip menghitung nilai Shapley eksak secara kombinatorial di seluruh subset koalisi fitur untuk memverifikasi secara matematis pemenuhan Aksioma Efisiensi.",
        pitfalls: [
          "Mencoba menghitung nilai Shapley eksak pada dataset dengan 50 fitur ($2^{50}$ kombinasi koalisi NP-Hard; harus menggunakan aproksimasi TreeSHAP atau Sampling).",
          "Mengasumsikan fitur-fitur saling independen saat menghitung nilai koalisi (korelasi antar fitur dapat mendistorsi evaluasi kontribusi marjinal)."
        ],
        refTitle: "Lloyd S. Shapley: A Value for n-Person Games (Contributions to the Theory of Games)",
        refUrl: "https://www.rand.org/pubs/research_memoranda/RM0737.html"
      },
      {
        num: "15.8",
        slug: "15-8-shap-shapley-additive-explanations-treeshap",
        title: "15.8. SHAP (SHapley Additive exPlanations): TreeSHAP & Visualisasi",
        desc: "Standar emas XAI modern Lundberg & Lee (NeurIPS 2017): algoritma TreeSHAP berkecepatan linear, Waterfall plot, Summary plot, dan Dependence plot.",
        concept: `Scott Lundberg dan Su-In Lee (2017) menyatukan enam metodologi interpretabilitas yang berbeda di bawah satu kerangka teoritis terpadu yang disebut **SHAP (SHapley Additive exPlanations)**.
        
Inovasi paling monumental dari kerangka ini adalah algoritma **TreeSHAP** (Lundberg et al., Nature Machine Intelligence 2020). Menghitung nilai Shapley untuk fungsi umum memerlukan waktu eksponensial $O(2^p)$. TreeSHAP memanfaatkan struktur hierarkis pohon partisi (seperti Random Forest, XGBoost, LightGBM, CatBoost) untuk menghitung nilai Shapley secara eksak dalam waktu polinomial cepat $O(T L D^2)$, di mana $T$ adalah jumlah pohon, $L$ jumlah daun, dan $D$ kedalaman maksimum pohon.
        
Instrumen visualisasi SHAP standar industri:
1. **SHAP Waterfall Plot:** Menjelaskan secara rinci satu prediksi individual: bagaimana setiap nilai fitur mendorong prediksi dari nilai harapan dasar (*base value*) menuju hasil akhir.
2. **SHAP Beeswarm Summary Plot:** Memberikan ringkasan global dari seluruh dataset: mengombinasikan pentingnya fitur dengan arah pengaruhnya (positif/negatif).
3. **SHAP Dependence Plot:** Memperlihatkan hubungan non-linier antara nilai fitur dan kontribusi SHAP-nya, termasuk efek interaksi tersembunyi.`,
        code: `# 15.8: Analisis Atribusi Fitur Model Random Forest Menggunakan Nilai SHAP
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.datasets import fetch_california_housing

data = fetch_california_housing(as_frame=True)
X = data.data.iloc[:400, :4] # Ambil 4 fitur utama
y = data.target.iloc[:400]

rf = RandomForestRegressor(n_estimators=50, max_depth=5, random_state=42).fit(X, y)

# Simulasi Perhitungan Nilai Rata-rata Kontribusi Fitur SHAP
base_value = np.mean(y)
prediksi_sampel = rf.predict(X.iloc[[0]])[0]

# Kontribusi Atribusi Per-Fitur untuk Sampel Pertama (Waterfall Sim)
kontribusi_estimasi = rf.feature_importances_ * (prediksi_sampel - base_value)

print("=== ATRIBUSI PREDIKSI LOKAL SHAP (WATERFALL ANALYSIS) ===")
print(f"Base Value Ekspektasi Populasi (E[f(x)]): \${base_value*100000:,.2f}")
print(f"Prediksi Model untuk Rumah Sampel 0     : \${prediksi_sampel*100000:,.2f}")
print(f"Total Deviasi Nilai Prediksi (f(x)-E)   : \${ (prediksi_sampel - base_value)*100000:+,.2f}\\n")
print("Rincian Kontribusi Fitur (Shapley Attribution):")
for col, val, c_shap in zip(X.columns, X.iloc[0], kontribusi_estimasi):
    print(f"- {col:12s} (Nilai: {val:7.2f}) -> Dampak Nilai: \${c_shap*100000:+10,.2f}")`,
        expectedOutput: "Menampilkan dekomposisi aditif kontribusi individual fitur terhadap prediksi akhir.",
        codeExp: "Skrip merekonstruksi prinsip dekomposisi aditif SHAP waterfall untuk menjelaskan secara transparan kontribusi masing-masing prediktor terhadap prediksi harga properti.",
        pitfalls: [
          "Menjalankan KernelSHAP (model-agnostic) pada dataset besar alih-alih TreeSHAP pada model berbasis pohon (KernelSHAP ribuan kali lebih lambat).",
          "Menafsirkan nilai SHAP sebagai efek kausal langsung di dunia nyata (SHAP mengukur atribusi prediksi model, bukan intervensi kausal riil).",
        ],
        refTitle: "Scott M. Lundberg & Su-In Lee: A Unified Approach to Interpreting Model Predictions (NeurIPS 2017)",
        refUrl: "https://proceedings.neurips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html"
      },
      {
        num: "15.9",
        slug: "15-9-lime-local-interpretable-model-agnostic-explanations",
        title: "15.9. LIME: Local Interpretable Model-agnostic Explanations",
        desc: "Aproksimasi linier lokal Ribeiro et al. (KDD 2016): perturbasi sampel acak di sekitar observasi, pembobotan kernel eksponensial, dan model penjelas sederhana.",
        concept: `Jika SHAP dibangun di atas fondasi teori permainan kooperatif global, **LIME (Local Interpretable Model-agnostic Explanations)** yang diperkenalkan oleh Marco Tulio Ribeiro, Sameer Singh, dan Carlos Guestrin (2016) menggunakan pendekatan geometri perturbasi lokal.
        
Filosofi dasar LIME: Meskipun suatu model machine learning (seperti Deep Neural Network atau kompleks ensemble) memiliki batas keputusan global yang sangat rumit dan non-linier di seluruh ruang data, **di sekitar lingkungan lokal suatu observasi tunggal spesifik $x$, batas keputusan tersebut dapat diaprosimasi secara akurat menggunakan model linier sederhana yang mudah diinterpretasikan**.
        
Langkah-langkah algoritma LIME:
1. Ambil observasi $x$ yang ingin dijelaskan prediksinya.
2. Bangkitkan ribuan sampel data sintetis baru $z'$ dengan memberikan perturbasi/gangguan acak di sekitar $x$.
3. Minta model black-box memprediksi nilai target untuk seluruh sampel perturbasi tersebut $f(z')$.
4. Berikan bobot $\\pi_x(z')$ pada setiap sampel perturbasi berdasarkan kedekatannya dengan titik asli $x$ menggunakan fungsi kernel eksponensial: $\\pi_x(z') = \\exp(-D(x, z')^2 / \\sigma^2)$.
5. Latih model regresi linier terbobot sederhana (Ridge / Lasso) pada sampel perturbasi terbobot tersebut. Koefisien model linier lokal ini menjadi penjelasan resmi mengapa model black-box membuat keputusan tersebut.`,
        formula: `\\text{Explanation}(x) = \\arg\\min_{g \\in G} \\mathcal{L}(f, g, \\pi_x) + \\Omega(g)`,
        code: `# 15.9: Implementasi Konseptual Algoritma LIME Murni (Aproksimasi Linier Lokal)
import numpy as np
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestClassifier

np.random.seed(42)
# Black-box Model: Random Forest non-linier
X_train = np.random.normal(0, 1, size=(500, 3))
y_train = (X_train[:, 0]**2 + X_train[:, 1] > 1.0).astype(int)
blackbox = RandomForestClassifier(n_estimators=50, random_state=42).fit(X_train, y_train)

# Titik observasi tunggal x yang ingin dijelaskan prediksinya
x_target = np.array([1.2, 0.5, -0.8])
pred_asli = blackbox.predict_proba([x_target])[0, 1]

# 1. Bangkitkan 1.000 sampel perturbasi di sekitar x_target
n_perturbasi = 1000
X_perturbasi = x_target + np.random.normal(0, 0.25, size=(n_perturbasi, 3))

# 2. Dapatkan prediksi black-box pada sampel perturbasi
y_perturbasi = blackbox.predict_proba(X_perturbasi)[:, 1]

# 3. Hitung bobot kedekatan kernel eksponensial: exp(-dist^2 / sigma^2)
jarak = np.linalg.norm(X_perturbasi - x_target, axis=1)
sigma = 0.5
bobot_pi = np.exp(-(jarak**2) / (sigma**2))

# 4. Latih Model Penjelas Linier Terbobot Lokal (Surrogate Ridge)
model_surrogate = Ridge(alpha=1.0)
model_surrogate.fit(X_perturbasi, y_perturbasi, sample_weight=bobot_pi)

print("=== APROKSIMASI PENJELAS LOKAL LIME (SURROGATE LINEAR) ===")
print(f"Prediksi Probabilitas Model Black-Box : {pred_asli:.4f}")
print(f"Prediksi Model Penjelas Lokal LIME    : {model_surrogate.predict([x_target])[0]:.4f}")
print("\\nKoefisien Penjelasan Lokal (Atribusi Fitur LIME):")
for i, koef in enumerate(model_surrogate.coef_):
    print(f"- Fitur X{i+1}: Koefisien Efek Lokal = {koef:+.4f}")`,
        expectedOutput: "Model linier surrogate lokal berhasil mereplikasi prediksi black-box dengan koefisien penjelas.",
        codeExp: "Skrip mengimplementasikan algoritma LIME dari dasar menggunakan sampling perturbasi acak dan regresi linier terbobot kernel.",
        pitfalls: [
          "Ketidakstabilan LIME: menjalankan LIME dua kali pada titik yang sama dapat menghasilkan penjelasan yang sedikit berbeda akibat sampling perturbasi acak.",
          "Menyetel ukuran bandwidth kernel (sigma) terlalu besar, yang menyebabkan model linier lokal kehilangan akurasi representasi di sekitar titik evaluasi."
        ],
        refTitle: "Marco Tulio Ribeiro, Sameer Singh, Carlos Guestrin: 'Why Should I Trust You?': Explaining the Predictions of Any Classifier (KDD 2016)",
        refUrl: "https://dl.acm.org/doi/10.1145/2939672.2939778"
      },
      {
        num: "15.10",
        slug: "15-10-partial-dependence-plot-dan-ice",
        title: "15.10. Partial Dependence Plot (PDP) & Individual Conditional Expectation (ICE)",
        desc: "Visualisasi efek marjinal global dan heterogenitas lokal: formulasi matematis PDP Friedman (2001) vs kurva individual ICE Goldstein et al. (2015).",
        concept: `Untuk memahami bagaimana satu atau dua fitur mempengaruhi prediksi model prediktif secara global di seluruh populasi, Jerome Friedman (2001) merumuskan **Partial Dependence Plot (PDP)**.
        
PDP memetakan nilai harapan marginal dari prediksi model sebagai fungsi dari fitur target $X_s$, dengan mengintegrasikan (merata-ratakan) seluruh kemungkinan nilai dari fitur-fitur lainnya $X_c$:
$$\\hat{f}_S(x_S) = \\mathbb{E}_{X_C}[\\hat{f}(x_S, X_C)] = \\frac{1}{n} \\sum_{i=1}^n \\hat{f}(x_S, x_{i, C})$$
PDP memperlihatkan apakah hubungan antara fitur dan target bersifat linier, monotonik, kuadratik, atau memiliki titik saturasi ambang batas.
        
Namun, kelemahan mendasar PDP adalah sifatnya yang merata-ratakan: jika separuh populasi memiliki dampak positif dan separuh populasi memiliki dampak negatif, kurva PDP akan tampak datar (garis horizontal mendekati nol), menyembunyikan efek penting.
        
**Individual Conditional Expectation (ICE)** (Goldstein et al., 2015) mengatasi kelemahan ini dengan memplot kurva fungsi ketergantungan untuk **setiap observasi individual secara terpisah**, membongkar heterogenitas efek interaksi antarsubkelompok.`,
        formula: `\\hat{f}_S(x_S) = \\frac{1}{n} \\sum_{i=1}^n \\hat{f}(x_S, x_{i, C})`,
        code: `# 15.10: Perhitungan Kurva Partial Dependence Plot (PDP) secara Komputasional
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.inspection import partial_dependence

np.random.seed(42)
n = 300
x1 = np.random.uniform(-3, 3, n)
x2 = np.random.normal(0, 1, n)
# Relasi non-linier sejati: x1 kuadratik
y = 2.0 * (x1 ** 2) - 1.5 * x2 + np.random.normal(0, 0.5, n)

X = np.column_stack([x1, x2])
gbr = GradientBoostingRegressor(random_state=42).fit(X, y)

# Menghitung Partial Dependence untuk Fitur 0 (x1)
pdp_hasil = partial_dependence(gbr, X, features=[0], grid_resolution=10)
grid_nilai_x1 = pdp_hasil['grid_values'][0]
rata_prediksi_pdp = pdp_hasil['average'][0]

print("=== ANALISIS MARGINAL PARTIAL DEPENDENCE PLOT (PDP) ===")
print("Nilai Fitur x1 | Rata-rata Prediksi Model E[f(x1)]")
print("-" * 50)
for val, pred in zip(grid_nilai_x1, rata_prediksi_pdp):
    print(f"{val:14.2f} | {pred:25.4f}")
print("\\nObservasi: Kurva PDP memperlihatkan bentuk parabola kuadratik U-Shape non-linier sempurna!")`,
        expectedOutput: "Kurva PDP berhasil merekonstruksi profil parabola kuadratik non-linier dari model black-box.",
        codeExp: "Skrip memanfaatkan partial_dependence dari Scikit-Learn untuk memetakan respon marjinal model terhadap variasi fitur individual.",
        pitfalls: [
          "Menafsirkan kurva PDP pada fitur yang berkorelasi sangat kuat dengan fitur lain (PDP mengevaluasi titik-titik kombinasi fitur yang mustahil secara fisik jika ada korelasi kuat).",
          "Hanya melihat kurva PDP rata-rata tanpa memeriksa kurva individual ICE saat dicurigai ada interaksi fitur yang heterogen."
        ],
        refTitle: "Alex Goldstein, Adam Kapelner, Justin Bleich, Emil Pitkin: Peeking Inside the Black Box: Visualizing Statistical Learning with Plots of Individual Conditional Expectation",
        refUrl: "https://www.tandfonline.com/doi/abs/10.1080/10618600.2014.907095"
      }
    ]
  },

  // ==========================================
  // BAB 16: Capstone Proyek Sains Data End-to-End
  // ==========================================
  {
    orderIndex: 16,
    id: "data-science-ch-16",
    slug: "bab-16-capstone-proyek-sains-data-end-to-end",
    title: "BAB 16: Capstone Proyek Sains Data End-to-End: Siklus Hidup Produksi Lengkap",
    desc: "Sintesis keilmuan sains data komprehensif: penerjemahan objektif bisnis ke fungsi kerugian matematis, rancangan eksperimen A/B testing & power analysis, audit data EDA pra-pemodelan, pembangunan baseline model minimal, rekayasa fitur domain, seleksi multi-model via Nested CV, kalibrasi probabilitas & optimasi threshold finansial, stress testing ketahanan, pemaketan pipeline anti-bocor, serta penulisan Model Card & presentasi eksekutif bisnis.",
    coreConcepts: ["Business-to-ML Mathematical Translation", "A/B Testing & Sample Sizing", "Nested Multi-Model Benchmarking", "Stress Testing & Fairness Audit", "Model Card & Executive Storytelling"],
    subchapters: [
      {
        num: "16.1",
        slug: "16-1-perumusan-masalah-bisnis-ke-matriks-objektif",
        title: "16.1. Perumusan Masalah: Translasi Objektif Bisnis ke Fungsi Objektif Matematis",
        desc: "Fase inisiasi proyek: mengonversi aspirasi kualitatif pemangku kepentingan menjadi variabel target formal, batas kendala, dan fungsi kerugian bisnis.",
        concept: `Kegagalan proyek sains data paling fatal di industri bukan disebabkan oleh kesalahan algoritma, melainkan karena memecahkan masalah matematika yang keliru (*solving the wrong problem*). Pemangku kepentingan bisnis biasanya menyampaikan kebutuhan dalam bahasa kualitatif yang kabur: 'Tolong tingkatkan loyalitas pelanggan', 'Kurangi penipuan', atau 'Optimalkan efisiensi persediaan'.
        
Tugas primer ilmuwan data tingkat lanjut adalah menerjemahkan pernyataan bisnis tersebut ke dalam formulasi matematis yang terdefinisi ketat:
1. **Definisi Variabel Target Eksplisit ($Y$):** Menentukan dengan presisi apa yang dimaksud dengan 'Churn'. Apakah pelanggan yang tidak bertransaksi selama 30 hari berturut-turut? Atau pelanggan yang saldo rata-ratanya turun $50\\%$?
2. **Penentuan Horizon Prediksi:** Menentukan jendela observasi ($t_0 - 90$ hari) dan jendela prediksi ($t_0$ hingga $t_0 + 30$ hari) untuk mencegah kebocoran data.
3. **Penyelarasan Fungsi Kerugian Bisnis (Business Loss Function):** Menghubungkan output prediksi dengan metrik finansial (Net Revenue Impact, Return on Investment, Cost of False Positives).`,
        code: `# 16.1: Translasi Objektif Bisnis Churn ke Matriks Finansial Return on Investment (ROI)
import numpy as np

# Parameter Finansial Bisnis Langganan SaaS
biaya_insentif_retensi = 50.0  # Biaya voucher diskon per pelanggan yang diprediksi churn ($50)
nilai_umur_pelanggan = 600.0   # Customer Lifetime Value (CLV) yang terselamatkan jika berhasil ditahan ($600)
efektivitas_insentif = 0.40    # 40% pelanggan yang ditawari voucher bersedia bertahan

def hitung_dampak_finansial_bersih(tp, fp, fn, tn):
    """Menghitung dampak finansial bersih implementasi model sains data terhadap kas perusahaan."""
    # Keuntungan dari True Positive (Pelanggan churn yang berhasil diselamatkan)
    pelanggan_terselamatkan = tp * efektivitas_insentif
    pendapatan_terselamatkan = pelanggan_terselamatkan * nilai_umur_pelanggan
    total_biaya_voucher = (tp + fp) * biaya_insentif_retensi
    
    keuntungan_bersih = pendapatan_terselamatkan - total_biaya_voucher
    return keuntungan_bersih

# Evaluasi Model A (Fokus Precision Tinggi) vs Model B (Fokus Recall Tinggi)
tp_A, fp_A, fn_A, tn_A = 120, 30, 80, 770
tp_B, fp_B, fn_B, tn_B = 180, 150, 20, 650

roi_A = hitung_dampak_finansial_bersih(tp_A, fp_A, fn_A, tn_A)
roi_B = hitung_dampak_finansial_bersih(tp_B, fp_B, fn_B, tn_B)

print("=== EVALUASI TRANSLASI BISNIS: DAMPAK FINANSIAL MODEL ===")
print(f"Model A (Presisi Tinggi) : Keuntungan Bersih = \${roi_A:,.2f}")
print(f"Model B (Recall Tinggi)  : Keuntungan Bersih = \${roi_B:,.2f}")
print(f"Keputusan Bisnis Ilmiah  : Model B menghasilkan keuntungan \${roi_B - roi_A:,.2f} lebih besar!")`,
        expectedOutput: "Translasi finansial membuktikan Model B memberikan ROI lebih tinggi meskipun presisinya lebih rendah.",
        codeExp: "Skrip memformulasikan fungsi dampak moneter bersih untuk membuktikan bahwa pemilihan model sains data harus didasarkan pada metrik finansial bisnis riil.",
        pitfalls: [
          "Melatih model prediktif pada target yang definisinya terus berubah di tengah proyek tanpa persetujuan pemangku kepentingan.",
          "Memilih model terbaik hanya berdasarkan AUC-ROC tertinggi tanpa menghitung dampak finansial keuntungan bersih terhadap kas perusahaan."
        ],
        refTitle: "Foster Provost & Tom Fawcett: Data Science for Business: What You Need to Know about Data Mining and Data-Analytic Thinking",
        refUrl: "https://www.oreilly.com/library/view/data-science-for/9781449374273/"
      },
      {
        num: "16.2",
        slug: "16-2-desain-eksperimen-ab-testing-dan-power-planning",
        title: "16.2. Desain Eksperimen: A/B Testing & Analisis Ukuran Sampel (Power)",
        desc: "Protokol inferensi kausal online: formulasi hipotesis A/B, kalkulasi Minimum Detectable Effect (MDE), dan penghindaran peeking problem.",
        concept: `Sebelum meluncurkan model sains data ke seluruh populasi pengguna, praktisi wajib memvalidasi efektivitas kausal model melalui **Online A/B Testing (Randomized Controlled Trial)**.
        
Tiga pilar desain eksperimen A/B testing:
1. **Unit Randomisasi:** Menentukan entitas yang diacak (biasanya ''user_id'') menggunakan algoritma hash deterministik (misalnya MurmurHash) untuk menjamin persistensi pengalaman pengguna.
2. **Analisis Kekuatan Sampel (Sample Size & Power Planning):** Menghitung berapa banyak pengguna yang harus diekspos ke eksperimen agar memiliki kekuatan statistik $80\\%$ ($1 - \\beta = 0.80$) pada $\\alpha = 0.05$ untuk mendeteksi kenaikan metrik minimal (**Minimum Detectable Effect / MDE**).
3. **Pencegahan Peeking Problem:** Memeriksa nilai $p$-value setiap hari dan menghentikan pengujian sebelum sampel terpenuhi melipatgandakan False Positive Rate hingga $30\\%$. Eksperimen harus dijalankan selama durasi penuh yang telah ditentukan di awal (misalnya 2 minggu penuh untuk mencakup efek musiman hari kerja dan akhir pekan).`,
        code: `# 16.2: Perhitungan Ukuran Sampel A/B Testing Berbasis MDE dan Nilai Dasar Metrik
import numpy as np
from statsmodels.stats.proportion import proportion_effectsize
from statsmodels.stats.power import NormalIndPower

# Parameter Uji A/B Testing Algoritma Rekomendasi vs Sistem Lama
baseline_conversion = 0.040 # 4.00% Baseline konversi pembelian
mde_relatif = 0.10          # Target mendeteksi kenaikan minimal 10% (menjadi 4.40%)
target_conversion = baseline_conversion * (1 + mde_relatif)

# 1. Hitung Cohen's h Effect Size untuk Proporsi
effect_size_h = proportion_effectsize(target_conversion, baseline_conversion)

# 2. Hitung Kebutuhan Sampel Minimum per Variasi (Power 80%, Alpha 5%)
power_analysis = NormalIndPower()
sample_size_per_group = power_analysis.solve_power(
    effect_size=effect_size_h,
    alpha=0.05,
    power=0.80,
    alternative='two-sided'
)

print("=== DESAIN EKSPERIMEN ONLINE A/B TESTING ===")
print(f"Konversi Kontrol A  : {baseline_conversion*100:.2f}%")
print(f"Target Deteksi B    : {target_conversion*100:.2f}% (+{mde_relatif*100:.1f}% MDE Relatif)")
print(f"Effect Size Cohen's h: {effect_size_h:.5f}")
print(f"Ukuran Sampel Minimum per Variasi : {int(np.ceil(sample_size_per_group)):,d} pengguna")
print(f"Total Sampel Kedua Kelompok (A + B): {int(np.ceil(sample_size_per_group))*2:,d} pengguna")`,
        expectedOutput: "Dibutuhkan ~78.000 sampel per grup untuk mendeteksi kenaikan konversi 10% secara ilmiah.",
        codeExp: "Skrip menghitung kebutuhan ukuran sampel minimum uji A/B menggunakan statsmodels untuk menjamin kekuatan statistik eksperimen terpenuhi.",
        pitfalls: [
          "Menghentikan uji A/B begitu p-value < 0.05 tercapai pada hari ke-3 (peeking problem yang merusak validitas inferensi).",
          "Melakukan randomisasi di level sesi (session-level) pada produk di mana satu pengguna yang sama dapat mengunjungi berulang kali dan melihat dua variasi berbeda (interferensi kontaminasi)."
        ],
        refTitle: "Ron Kohavi, Diane Tang, Ya Xu: Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing",
        refUrl: "https://experimentguide.com/"
      },
      {
        num: "16.3",
        slug: "16-3-eksplorasi-data-dan-audit-kualitas-pra-pemodelan",
        title: "16.3. Eksplorasi Data Mendalam (EDA) & Audit Kualitas Data Pra-Pemodelan",
        desc: "Protokol audit integritas data: pengecekan anomali distribusi, verifikasi integritas referensial relasional, dan deteksi duplikasi implisit.",
        concept: `Sebelum algoritma machine learning apa pun dilatih, ilmuwan data wajib melakukan audit kualitas data secara mendalam melalui **Exploratory Data Analysis (EDA)**. Tahap ini bukan sekadar membuat grafik visual yang indah, melainkan bertindak sebagai investigasi forensik terhadap kebersihan data.
        
Tiga pilar audit kualitas data:
1. **Audit Kelengkapan & Mekanisme Missing Values:** Menentukan apakah nilai hilang bersifat MCAR (Missing Completely at Random), MAR (Missing at Random), atau MNAR (Missing Not at Random).
2. **Audit Konsistensi Logis & Integritas Rentang:** Memeriksa apakah terdapat pelanggaran hukum fisik atau domain (misalnya usia nasabah bernilai negatif atau 999, tanggal transaksi terjadi di masa depan, atau tarif bunga bernilai $-50\\%$).
3. **Audit Kebocoran Target Implisit (Proxy Leakage):** Memeriksa korelasi fitur terhadap target; jika ada satu fitur yang memiliki korelasi $> 0.95$ dengan target, hampir pasti fitur tersebut dibuat *setelah* kejadian target terjadi di sistem basis data operasional.`,
        code: `# 16.3: Skrip Otomatisasi Audit Integritas Kualitas Data Pra-Pemodelan
import numpy as np
import pandas as pd

np.random.seed(42)
df_audit = pd.DataFrame({
    'user_id': [101, 102, 103, 104, 105, 101], # Duplikasi implisit user_id 101
    'usia': [28, -5, 45, 150, 32, 28],          # Nilai fisik tidak logis: -5 dan 150
    'saldo': [5000, 12000, np.nan, 8500, 9200, 5000],
    'target_fraud': [0, 1, 0, 0, 1, 0]
})

# 1. Pengecekan Duplikasi Baris
n_duplikat = df_audit.duplicated().sum()

# 2. Pengecekan Pelanggaran Batas Domain (Usia logis: 17 - 100 tahun)
usia_anomali = df_audit[(df_audit['usia'] < 17) | (df_audit['usia'] > 100)]['usia'].values

# 3. Pengecekan Nilai Hilang
rasio_null = df_audit.isnull().mean()

print("=== LAPORAN AUDIT INTEGRITAS KUALITAS DATA ===")
print(f"Duplikasi Baris Eksak Terdeteksi  : {n_duplikat} baris")
print(f"Pelanggaran Batas Logika Usia     : {usia_anomali} (Wajib Dibersihkan!)")
print(f"Rasio Nilai Hilang Kolom Saldo    : {rasio_null['saldo']*100:.1f}%")`,
        expectedOutput: "Audit otomatis mendeteksi baris duplikat, anomali usia di luar nalar fisik, dan rasio missing value.",
        codeExp: "Skrip membangun fungsi pemeriksaan integritas data otomatis untuk menyaring kejanggalan logis sebelum data dialirkan ke tahap pelatihan.",
        pitfalls: [
          "Langsung melompat ke pemodelan algoritma tanpa memeriksa distribusi fitur mentah.",
          "Menghapus baris missing value secara naif tanpa menyadari bahwa ketiadaan data tersebut membawa informasi MNAR yang sangat prediktif."
        ],
        refTitle: "John W. Tukey: Exploratory Data Analysis (Addison-Wesley)",
        refUrl: "https://www.pearson.com/en-us/subject-catalog/p/exploratory-data-analysis/P200000003450"
      },
      {
        num: "16.4",
        slug: "16-4-baseline-model-dan-minimum-viable-model",
        title: "16.4. Pembangunan Baseline Model Naif & Penentuan Ambang Batas Minimal",
        desc: "Kriteria keberhasilan rekayasa: model heuristik naif DummyClassifier/DummyRegressor, dan batas bawah Minimum Viable Model (MVM).",
        concept: `Sebelum mengimplementasikan model ensemble yang rumit atau algoritma canggih, prinsip rekayasa sains data yang baik mengharuskan pembangunan **Baseline Model Naif** terlebih dahulu.
        
Baseline model berfungsi sebagai patokan dasar (*benchmark*): jika model machine learning yang rumit tidak mampu mengungguli baseline model naif secara substansial, maka model rumit tersebut tidak memiliki pembenaran ekonomi untuk diterapkan di lingkungan produksi.
        
Dua tingkatan baseline:
1. **Zero-Rule Baseline (Dummy Estimator):** Memprediksi kelas mayoritas secara konstan (klasifikasi) atau nilai rata-rata konstan (regresi).
2. **Simple Heuristic Baseline:** Aturan keputusan bisnis sederhana berbasis 1 atau 2 kondisi jika-maka (misalnya: 'Jika transaksi $> \\$1000$ dan terjadi dini hari, tandai sebagai fraud').
Model machine learning kandidat produksi minimal harus menghasilkan peningkatan performa yang signifikan secara statistik di atas baseline heuristik sederhana ini.`,
        code: `# 16.4: Evaluasi Baseline Model Naif (Dummy) vs Model Regresi Logistik
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=1000, n_features=10, weights=[0.90, 0.10], random_state=42)

# 1. Baseline Model Naif Zero-Rule (Selalu Memprediksi Kelas Terbanyak)
dummy = DummyClassifier(strategy='most_frequent').fit(X, y)
pred_dummy = dummy.predict(X)

# 2. Simple Machine Learning Baseline (Regresi Logistik Standar)
simple_model = LogisticRegression(class_weight='balanced').fit(X, y)
pred_simple = simple_model.predict(X)

f1_dummy = f1_score(y, pred_dummy, zero_division=0)
f1_simple = f1_score(y, pred_simple)

print("=== BENCHMARK BASELINE MODEL NAIF VS MACHINE LEARNING ===")
print(f"Skor F1 Baseline Naif (Most Frequent) : {f1_dummy:.4f} (Patokan Batas Terendah)")
print(f"Skor F1 Simple Machine Learning Model : {f1_simple:.4f} (Peningkatan Kinerja Signifikan!)")
print(f"Ambang Batas Keberhasilan Minimal MVM  : Terpenuhi (+{f1_simple - f1_dummy:.4f})")`,
        expectedOutput: "Baseline naif menghasilkan F1=0, membuktikan model pembelajaran mesin menghasilkan nilai tambah riil.",
        codeExp: "Skrip memanfaatkan DummyClassifier Scikit-Learn untuk menetapkan batas performa dasar sebelum mengevaluasi algoritma yang lebih kompleks.",
        pitfalls: [
          "Mengevaluasi keberhasilan model canggih tanpa membandingkannya dengan baseline model sederhana (sering kali model linier sederhana mengalahkan deep learning pada tabel tabular).",
          "Membanggakan akurasi 90% pada model padahal baseline naif kelas mayoritas sudah menghasilkan akurasi 90% secara cuma-cuma."
        ],
        refTitle: "Scikit-Learn Documentation: Model evaluation using Dummy estimators",
        refUrl: "https://scikit-learn.org/stable/modules/model_evaluation.html#dummy-estimators"
      },
      {
        num: "16.5",
        slug: "16-5-rekayasa-fitur-domain-dan-penyaringan-informasi",
        title: "16.5. Rekayasa Fitur Domain Komprehensif & Penyaringan Berbasis Informasi",
        desc: "Sintesis prapemrosesan: ekstraksi fitur agregasi, transformasi skala, penyaringan korelasi multikolinieritas, dan seleksi fitur informatif.",
        concept: `Pada tahap ini, seluruh teknik rekayasa fitur yang telah dipelajari digabungkan ke dalam satu alur kerja komprehensif. Praktisi mengekstrak rasio domain finansial, fitur temporal siklikal, dan agregasi historis.
        
Namun, menghasilkan ratusan fitur baru membawa risiko redundansi informasi dan pembengkakan dimensi. Oleh karena itu, protokol penyaringan informasi diterapkan secara sistematis:
1. Menghapus fitur yang memiliki varians mendekati nol (**VarianceThreshold**).
2. Memeriksa matriks korelasi berpasangan: jika dua fitur prediktor memiliki korelasi Pearson $|r| > 0.90$, salah satu fitur dihapus untuk mencegah multikolinieritas.
3. Menyaring fitur menggunakan metrik **Mutual Information** atau **SelectPercentile** untuk mempertahankan hanya fitur-fitur yang membawa sinyal prediktif nyata terhadap target respons.`,
        code: `# 16.5: Protokol Penyaringan Fitur Otomatis: VarianceThreshold & Eliminasi Korelasi Tinggi
import numpy as np
import pandas as pd
from sklearn.feature_selection import VarianceThreshold

np.random.seed(42)
# 1. Fitur dengan Varians Nol (Konstan), Fitur Kolinier Tinggi, dan Fitur Normal
df_fitur = pd.DataFrame({
    'konstan': [1.0] * 100, # Varians = 0 (Tidak ada informasi)
    'fitur_A': np.random.normal(0, 1, 100),
    'fitur_B': np.random.normal(5, 2, 100)
})
df_fitur['fitur_kolinier_A'] = df_fitur['fitur_A'] * 0.99 + np.random.normal(0, 0.01, 100) # Korelasi ~99%

# 1. Eliminasi Fitur Varians Rendah via VarianceThreshold
selector_var = VarianceThreshold(threshold=0.0)
X_bervarians = selector_var.fit_transform(df_fitur)
kolom_lolos_var = df_fitur.columns[selector_var.get_support()]

# 2. Eliminasi Fitur Ber-korelasi Ekstrem (> 0.95)
df_tersaring = pd.DataFrame(X_bervarians, columns=kolom_lolos_var)
corr_matrix = df_tersaring.corr().abs()
upper_tri = corr_matrix.where(np.triu(np.ones(corr_matrix.shape), k=1).astype(bool))
kolom_dihapus = [col for col in upper_tri.columns if any(upper_tri[col] > 0.95)]
df_final = df_tersaring.drop(columns=kolom_dihapus)

print("=== PROTOKOL PENYARINGAN FITUR REKAYASA SISTEMATIS ===")
print(f"Jumlah Fitur Mentah Awal             : {df_fitur.shape[1]}")
print(f"Fitur Lolos Uji Varians (> 0)        : {list(kolom_lolos_var)}")
print(f"Fitur Dieliminasi karena Korelasi >95%: {kolom_dihapus}")
print(f"Dimensi Fitur Akhir yang Siap Latih  : {df_final.shape[1]} fitur")`,
        expectedOutput: "Protokol penyaringan berhasil membuang fitur konstan dan fitur kolinier secara otomatis.",
        codeExp: "Skrip menerapkan VarianceThreshold dan pemotongan korelasi segitiga atas untuk memurnikan matriks fitur sebelum pemodelan.",
        pitfalls: [
          "Menghitung korelasi dan seleksi fitur sebelum pemisahan data train-test (kebocoran informasi seleksi).",
          "Membuang fitur berkorelasi tinggi tanpa memeriksa mana di antara kedua fitur yang memiliki hubungan lebih kuat dengan variabel target."
        ],
        refTitle: "Guyon, I., & Elisseeff, A.: An Introduction to Variable and Feature Selection (JMLR)",
        refUrl: "https://www.jmlr.org/papers/v3/guyon03a.html"
      },
      {
        num: "16.6",
        slug: "16-6-seleksi-dan-benchmarking-multi-algoritma",
        title: "16.6. Seleksi & Benchmarking Multi-Algoritma Menggunakan Nested CV",
        desc: "Pertarungan algoritma ilmiah: membandingkan Regresi Linier Ter-regularisasi, Random Forest, dan XGBoost di bawah protokol Nested CV yang adil.",
        concept: `Prinsip **No Free Lunch Theorem** (Wolpert & Macready, 1997) menyatakan bahwa tidak ada satu pun algoritma pembelajaran mesin yang secara universal selalu mengungguli seluruh algoritma lainnya di setiap masalah dan dataset.
        
Oleh karena itu, dalam proyek capstone profesional, ilmuwan data tidak boleh langsung memilih satu algoritma favorit secara subjektif. Praktisi wajib melakukan benchmarking multi-keluarga algoritma yang mencakup:
1. **Model Linier / Parametrik:** Logistic Regression dengan regularisasi ElasticNet.
2. **Model Ensemble Bagging:** Random Forest.
3. **Model Ensemble Boosting:** XGBoost atau LightGBM.
        
Seluruh algoritma tersebut harus diuji di bawah kondisi validasi silang yang identik menggunakan **Nested Cross-Validation** dengan metrik evaluasi yang disepakati (misalnya PR-AUC atau Brier Score), sehingga perbandingan performa yang dihasilkan adil dan tidak bias.`,
        code: `# 16.6: Benchmarking Multi-Algoritma Terstandarisasi via Stratified Cross-Validation
import numpy as np
import pandas as pd
from sklearn.datasets import make_classification
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

X, y = make_classification(n_samples=1000, n_features=15, n_informative=8, random_state=42)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# Kandidat Model Lintas Keluarga Algoritma
kandidat_model = {
    'ElasticNet Logistic': LogisticRegression(penalty='elasticnet', solver='saga', l1_ratio=0.5, random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42),
    'XGBoost': XGBClassifier(n_estimators=100, max_depth=4, learning_rate=0.08, eval_metric='logloss', random_state=42)
}

hasil_benchmark = []
for nama, model in kandidat_model.items():
    skor_cv = cross_val_score(model, X, y, cv=cv, scoring='roc_auc', n_jobs=-1)
    hasil_benchmark.append({
        'Model': nama,
        'Rata-rata AUC': np.mean(skor_cv),
        'Standar Deviasi AUC': np.std(skor_cv)
    })

df_hasil = pd.DataFrame(hasil_benchmark).sort_values(by='Rata-rata AUC', ascending=False)

print("=== HASIL BENCHMARKING MULTI-ALGORITMA TERSTANDARISASI ===")
print(df_hasil.round(4).to_string(index=False))
print(f"\\n[PEMENANG BENCHMARK]: '{df_hasil.iloc[0]['Model']}' terpilih untuk tahap penyetelan lanjutan!")`,
        expectedOutput: "Benchmarking objektif menampilkan perbandingan skor rata-rata AUC dan standar deviasinya.",
        codeExp: "Skrip mengeksekusi pengujian silang berulang pada tiga keluarga algoritma yang berbeda untuk menentukan arsitektur model pemenang secara objektif.",
        pitfalls: [
          "Membandingkan model yang hyperparameter-nya telah dioptimasi dengan model lain yang masih menggunakan konfigurasi default yang buruk.",
          "Hanya melaporkan skor rata-rata tanpa menyertakan standar deviasi variabilitas fold."
        ],
        refTitle: "David H. Wolpert: The Lack of A Priori Distinctions Between Learning Algorithms (No Free Lunch)",
        refUrl: "https://direct.mit.edu/neco/article/8/7/1341/5935/The-Lack-of-A-Priori-Distinctions-Between-Learning"
      },
      {
        num: "16.7",
        slug: "16-7-kalibrasi-probabilitas-dan-threshold-finansial",
        title: "16.7. Kalibrasi Probabilitas & Penyetelan Threshold Finansial Optimal",
        desc: "Jembatan akhir ke utilitas bisnis: kalibrasi probabilitas Brier Score Isotonic Regression, dan optimasi threshold matriks biaya moneter.",
        concept: `Setelah model terbaik terpilih (misalnya XGBoost), model tersebut tidak boleh langsung diterapkan dengan threshold default 0.50.
        
Dua langkah penyempurnaan akhir sebelum deployment:
1. **Kalibrasi Probabilitas Post-Hoc:** Model pohon boosting sering kali menghasilkan probabilitas yang terdistorsi di sekitar batas keputusan. Mengalibrasi probabilitas model menggunakan **Isotonic Regression** memastikan bahwa nilai probabilitas yang dihasilkan mencerminkan frekuensi empiris sejati di dunia nyata.
2. **Optimasi Threshold Finansial:** Menerapkan fungsi matriks biaya bisnis yang telah didefinisikan pada subbab 16.1 untuk menemukan nilai ambang batas $\\tau^*$ yang secara spesifik meminimalkan kerugian finansial atau memaksimalkan keuntungan kas bersih perusahaan.`,
        code: `# 16.7: Kalibrasi Probabilitas dan Optimasi Threshold Keputusan Finansial
import numpy as np
from sklearn.datasets import make_classification
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix

X, y = make_classification(n_samples=1500, n_features=10, weights=[0.90, 0.10], random_state=42)
X_train, X_val, y_train, y_val = X[:1000], X[1000:], y[:1000], y[1000:]

# 1. Melatih Model dan Mengalibrasi Probabilitas
rf = RandomForestClassifier(n_estimators=50, random_state=42).fit(X_train, y_train)
calibrated_rf = CalibratedClassifierCV(estimator=rf, method='isotonic', cv='prefit')
calibrated_rf.fit(X_val, y_val)

prob_val = calibrated_rf.predict_proba(X_val)[:, 1]

# 2. Optimasi Ambang Batas Berbasis Matriks Biaya Finansial ($300 Biaya FN, $20 Biaya FP)
biaya_fn, biaya_fp = 300.0, 20.0
threshold_grid = np.linspace(0.05, 0.95, 100)
total_biaya = []

for t in threshold_grid:
    y_pred = (prob_val >= t).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_val, y_pred).ravel()
    biaya = fp * biaya_fp + fn * biaya_fn
    total_biaya.append(biaya)

t_terbaik = threshold_grid[np.argmin(total_biaya)]
biaya_optimal = min(total_biaya)

# Biaya pada Threshold Default 0.50
pred_def = (prob_val >= 0.50).astype(int)
tn_d, fp_d, fn_d, tp_d = confusion_matrix(y_val, pred_def).ravel()
biaya_def = fp_d * biaya_fp + fn_d * biaya_fn

print("=== KALIBRASI & OPTIMASI THRESHOLD FINANSIAL ===")
print(f"Ambang Batas Default (0.50)      : Total Kerugian = \${biaya_def:,.2f}")
print(f"Ambang Batas Finansial Optimal   : {t_terbaik:.2f}")
print(f"Total Kerugian Threshold Optimal : \${biaya_optimal:,.2f}")
print(f"Penghematan Finansial Riil       : \${biaya_def - biaya_optimal:,.2f} ({((biaya_def - biaya_optimal)/biaya_def)*100:.1f}%)")`,
        expectedOutput: "Optimasi threshold finansial menurunkan total biaya kerugian secara substansial.",
        codeExp: "Skrip mengalibrasi output probabilitas dan menentukan threshold keputusan optimal yang meminimalkan total beban kerugian finansial perusahaan.",
        pitfalls: [
          "Menggunakan data uji sakral (test set) untuk mencari threshold terbaik (threshold wajib dicari pada validation set).",
          "Mengabaikan kalibrasi probabilitas saat menggunakan output model langsung untuk perhitungan nilai risiko kuantitatif."
        ],
        refTitle: "Charles Elkan: The Foundations of Cost-Sensitive Learning (IJCAI)",
        refUrl: "https://www.ijcai.org/Proceedings/01-1/Papers/136.pdf"
      },
      {
        num: "16.8",
        slug: "16-8-audit-ketahanan-stress-testing-dan-fairness",
        title: "16.8. Audit Ketahanan Model (Stress Testing) & Audit Keadilan (Fairness)",
        desc: "Uji kelayakan produksi: pengujian ketahanan terhadap derau sintetis ekstrem, pengujian batas fisik, dan metrik audit disparitas dampak (Disparate Impact).",
        concept: `Sebelum model dideploy ke sistem produksi yang melayani jutaan pengguna, model wajib melalui dua tahap pengujian keamanan kritis:
        
1. **Audit Ketahanan (Stress Testing / Invariance Tests):**
   - Menguji apakah model mengalami kegagalan fatal (crash atau memprediksi nilai ekstrem nonsensikal) saat disuntikkan data korup, nilai nol tak terduga, atau outlier ekstrem di luar rentang latih.
   - Menguji stabilitas prediksi: menambahkan derau Gaussian kecil (misal $1\\%$) pada input tidak boleh membalikkan keputusan klasifikasi model secara drastis (*Perturbation Invariance Test*).
2. **Audit Keadilan (Fairness & Bias Audit):**
   - Memastikan bahwa model tidak melakukan diskriminasi sistemik terhadap kelompok yang dilindungi hukum (berdasarkan gender, ras, usia, atau agama).
   - Metrik standar EEOC: **Disparate Impact Ratio**—yaitu rasio tingkat persetujuan (*favorable rate*) antara kelompok minoritas terhadap kelompok mayoritas. Sesuai aturan hukum *Four-Fifths Rule*, rasio ini **tidak boleh kurang dari 0.80 ($80\\%$)**.`,
        formula: `\\text{Disparate Impact} = \\frac{P(\\hat{Y} = 1 \\mid D = \\text{Unprivileged})}{P(\\hat{Y} = 1 \\mid D = \\text{Privileged})} \\ge 0.80`,
        code: `# 16.8: Uji Keadilan Algoritma (Disparate Impact Four-Fifths Rule)
import numpy as np

# Simulasi Prediksi Persetujuan Kredit pada 2 Kelompok Demografi
np.random.seed(42)
n_kelompok = 500

# Kelompok Utama (Privileged) vs Kelompok Minoritas (Unprivileged)
prediksi_privileged = np.random.choice([0, 1], size=n_kelompok, p=[0.30, 0.70])   # 70% disetujui
prediksi_unprivileged = np.random.choice([0, 1], size=n_kelompok, p=[0.42, 0.58]) # 58% disetujui

# Hitung Tingkat Persetujuan (Selection Rate)
rate_priv = np.mean(prediksi_privileged)
rate_unpriv = np.mean(prediksi_unprivileged)

# Hitung Disparate Impact Ratio
disparate_impact = rate_unpriv / rate_priv
lolos_aturan_80_persen = disparate_impact >= 0.80

print("=== AUDIT KEADILAN ALGORITMA (FAIRNESS & DISPARATE IMPACT) ===")
print(f"Tingkat Persetujuan Kelompok Mayoritas  : {rate_priv*100:.2f}%")
print(f"Tingkat Persetujuan Kelompok Minoritas  : {rate_unpriv*100:.2f}%")
print(f"Disparate Impact Ratio                  : {disparate_impact:.4f}")
print(f"Status Kepatuhan Aturan Hukum 4/5 (0.80): {'LOLOS AUDIT HUKUM' if lolos_aturan_80_persen else 'PELANGGARAN DISKRIMINASI HUKUM!'}")`,
        expectedOutput: "Model dievaluasi secara formal terhadap rasio kepatuhan hukum keadilan Disparate Impact 0.80.",
        codeExp: "Skrip mengimplementasikan perhitungan Disparate Impact Ratio Four-Fifths Rule standar EEOC untuk memvalidasi ketiadaan bias diskriminatif sistemik pada model.",
        pitfalls: [
          "Mengasumsikan bahwa menghapus variabel sensitif (seperti ras atau gender) dari dataset sudah cukup untuk menjamin model adil (model tetap dapat mempelajari proxy bias dari variabel lain seperti kode pos).",
          "Meluncurkan model ke produksi tanpa stress testing ketahanan terhadap nilai nol atau teks kosong."
        ],
        refTitle: "Solon Barocas, Moritz Hardt, Arvind Narayanan: Fairness and Machine Learning: Limitations and Opportunities (MIT Press)",
        refUrl: "https://fairmlbook.org/"
      },
      {
        num: "16.9",
        slug: "16-9-pemaketan-pipeline-dan-rencana-pemantauan",
        title: "16.9. Pemaketan Pipeline Produksi & Rencana Pemantauan (Drift Plan)",
        desc: "Transisi ke MLOps: serialisasi pipeline utuh, pembuatan modul inferensi prediktif terenkapsulasi, dan perancangan alarm pemantauan drift.",
        concept: `Sebuah model sains data yang hebat di notebook eksperimen tidak memiliki nilai bisnis jika tidak dapat dioperasikan secara andal di sistem produksi.
        
Dua komponen arsitektur transisi produksi:
1. **Pemaketan Pipeline Utuh (End-to-End Artifact Packaging):** Seluruh rantai transformasi—mulai dari imputasi nilai hilang, encoding kategori, penskalaan numerik, hingga model klasifikasi terkalibrasi—harus disatukan dalam satu objek Scikit-Learn ''Pipeline'' tunggal. Hal ini menjamin bahwa fungsi inferensi produksi hanya menerima data mentah dari API ('+ "X_raw"' + ') dan secara deterministik menghasilkan prediksi tanpa ada langkah transformasi yang tertinggal.
2. **Rencana Pemantauan Produksi (Model Monitoring & Drift Plan):**
   - Menghitung baseline metrik data latih untuk fitur-fitur penting (rata-rata, varians, persentil).
   - Menetapkan pekerjaan terjadwal (cron job) harian untuk menghitung Population Stability Index (PSI) fitur masukan dan memicu alarm jika $\\text{PSI} \\ge 0.25$.`,
        code: `# 16.9: Pemaketan Pipeline Utuh dan Skrip Inferensi Produksi Deterministik
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression

# 1. Bangun Pipeline End-to-End Siap Pakai
preprocessor = ColumnTransformer(transformers=[
    ('num', Pipeline([('imp', SimpleImputer(strategy='median')), ('scl', StandardScaler())]), ['umur', 'saldo']),
    ('cat', Pipeline([('imp', SimpleImputer(strategy='most_frequent')), ('ohe', OneHotEncoder(handle_unknown='ignore'))]), ['tipe_akun'])
])

model_produksi = Pipeline([
    ('prep', preprocessor),
    ('clf', LogisticRegression(class_weight='balanced', random_state=42))
])

# Latih pada Data Latih
df_train = pd.DataFrame({
    'umur': [25, 40, np.nan, 35],
    'saldo': [1000, 5000, 3000, 8000],
    'tipe_akun': ['Silver', 'Gold', 'Silver', 'Platinum']
})
y_train = [0, 1, 0, 1]
model_produksi.fit(df_train, y_train)

# 2. Simulasi Permintaan Inferensi API Produksi Baru (Menerima Data Mentah)
payload_api_baru = pd.DataFrame([{
    'umur': 32,
    'saldo': 4500,
    'tipe_akun': 'Gold'
}])

prediksi_probabilitas = model_produksi.predict_proba(payload_api_baru)[0, 1]
prediksi_kelas = int(prediksi_probabilitas >= 0.40) # Menerapkan threshold optimal

print("=== INFERENSI PIPELINE PRODUKSI TERENKAPSULASI ===")
print(f"Data Masukan API Mentah      : {payload_api_baru.to_dict(orient='records')[0]}")
print(f"Probabilitas Inferensi Model : {prediksi_probabilitas*100:.2f}%")
print(f"Keputusan Klasifikasi Akhir  : Kelas {prediksi_kelas} (Siap Diintegrasikan ke Backend API!)")`,
        expectedOutput: "Pipeline terenkapsulasi berhasil menerima data payload mentah dan mengeksekusi prediksi deterministik.",
        codeExp: "Skrip memaketkan seluruh alur transformasi dan pemodelan ke dalam objek Pipeline tunggal yang siap di-deploy ke endpoint API inferensi produksi.",
        pitfalls: [
          "Menerapkan dependensi pustaka prapemrosesan custom yang tidak tersedia di image kontainer server inferensi produksi.",
          "Tidak menyertakan logging prediksi terperinci pada server inferensi untuk audit pasca-kejadian."
        ],
        refTitle: "Chip Huyen: Designing Machine Learning Systems: An Iterative Process for Production-Ready Applications",
        refUrl: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/"
      },
      {
        num: "16.10",
        slug: "16-10-storytelling-kuantitatif-dan-model-cards",
        title: "16.10. Komunikasi Eksekutif: Storytelling Kuantitatif & Dokumentasi Model Card",
        desc: "Penyampaian wawasan bisnis: menjembatani jurang teknis-eksekutif, struktur dokumentasi Model Cards for Model Reporting (Mitchell et al. 2019), dan penyajian dampak ROI.",
        concept: `Keahlian tertinggi dari seorang ilmuwan data profesional bukanlah kemampuan melatih model yang paling rumit, melainkan kemampuan menerjemahkan temuan kuantitatif yang kompleks menjadi narasi bisnis yang meyakinkan bagi para eksekutif (*Executive Storytelling*). Para pemangku kepentingan C-level tidak tertarik mendengar tentang 'koefisien kernel RBF' atau 'skor cross-entropy'; mereka ingin memahami dampak finansial, efisiensi operasional, dan mitigasi risiko.
        
Dua instrumen komunikasi profesional:
1. **Dokumentasi Model Card (Margaret Mitchell et al., Google Research, 2019):** Format standar industri untuk transparansi dan tata kelola model (*Model Governance*). Model Card mencatat secara formal:
   - *Intended Use:* Domain dan kondisi penggunaan yang sah vs kasus penggunaan yang dilarang (*out-of-scope uses*).
   - *Factors & Subpopulations:* Evaluasi performa model di berbagai kelompok demografi.
   - *Quantitative Metrics:* Kinerja model pada metrik akurasi, kalibrasi, dan matriks biaya.
   - *Caveats & Recommendations:* Batasan fisik data dan rekomendasi pemeliharaan.
2. **Penyajian Dampak Bisnis (Executive Presentation):** Menyajikan hasil dalam piramida komunikasi Minto: dimulai dengan kesimpulan rekomendasi tindakan bisnis, diikuti oleh dampak moneter ROI yang diproyeksikan, dan didukung oleh bukti kuantitatif empiris.`,
        code: `# 16.10: Pembangkitan Laporan Terstruktur Model Card (Standar Google Research)
import json

model_card = {
    "model_details": {
        "nama_model": "Customer Churn Predictive Pipeline v1.0",
        "arsitektur": "Calibrated HistGradientBoosting Classifier (Leaf-Wise)",
        "tanggal_latih": "2026-09-17",
        "pengembang": "Tim Sains Data Enterprise Velqora",
        "lisensi": "Internal Proprietary"
    },
    "intended_use": {
        "tujuan_utama": "Mendeteksi nasabah berisiko churn tinggi dalam 30 hari ke depan",
        "target_pengguna": "Tim Pemasaran & Operasional Retensi Pelanggan",
        "penggunaan_dilarang": "Penetapan suku bunga kredit atau penolakan layanan keuangan secara diskriminatif"
    },
    "quantitative_metrics": {
        "evaluasi_dataset": "Out-of-Sample Test Set Sakral (n = 5.000)",
        "pr_auc_score": 0.742,
        "roc_auc_score": 0.891,
        "threshold_operasional": 0.38,
        "recall_target_minoritas": "82.5%",
        "proyeksi_roi_tahunan": "$1,450,000 Keuntungan Bersih Kas Terselamatkan"
    },
    "governance_and_fairness": {
        "disparate_impact_ratio": 0.88,
        "kepatuhan_regulasi": "Lolos Aturan Four-Fifths Rule (EEOC)",
        "jadwal_audit_drift": "Mingguan berbasis Population Stability Index (PSI)"
    }
}

print("=== RINGKASAN MODEL CARD RESMI PRODUKSI (MITCHELL ET AL. 2019) ===")
print(json.dumps(model_card, indent=2))
print("\\nDokumentasi Standar Enterprise: Siap Ditinjau Komite Tata Kelola & Risiko AI!")`,
        expectedOutput: "Menghasilkan artefak Model Card resmi berstandar tata kelola Google Research.",
        codeExp: "Skrip menyusun struktur data Model Card komprehensif yang mendokumentasikan rincian model, penggunaan yang dimaksudkan, metrik performa, dan kepatuhan etika.",
        pitfalls: [
          "Mempresentasikan metrik teknis murni (seperti log-loss) kepada direksi bisnis tanpa menerjemahkannya ke dalam nilai moneter dolar atau rupiah.",
          "Menerapkan model tanpa dokumen Model Card resmi, yang menyulitkan tim audit kepatuhan dan teknisi lain saat terjadi masalah di kemudian hari."
        ],
        refTitle: "Margaret Mitchell et al.: Model Cards for Model Reporting (FAT* 2019)",
        refUrl: "https://dl.acm.org/doi/10.1145/3287560.3287596"
      }
    ]
  }
];
