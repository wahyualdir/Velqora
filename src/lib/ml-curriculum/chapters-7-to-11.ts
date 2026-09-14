import { DocSectionItem } from "@/components/modul/doc-reader-layout";

/**
 * BAB 7 - 11 KURIKULUM MACHINE LEARNING VELQORA
 * Mengintegrasikan algoritma tanpa pengawasan, pembelajaran daring, metrik evaluasi komprehensif,
 * metode ansambel canggih (HistGradientBoosting, Stacking), dan inspeksi interpretabilitas dari Scikit-Learn 1.9.
 */
export const ML_CHAPTERS_7_TO_11: DocSectionItem[] = [
  // =========================================================================
  // BAB 7: Unsupervised Learning
  // =========================================================================
  {
    id: "ml-bab-7",
    slug: "bab-7-unsupervised-learning",
    title: "BAB 7: Unsupervised Learning",
    orderIndex: 7,
    description: "K-Means & MiniBatch, Density-Based (DBSCAN & HDBSCAN), Hierarchical Clustering (Ward), Gaussian Mixture Models (GMM), Reduksi Dimensi (PCA, TruncatedSVD, t-SNE), serta Deteksi Anomali (Isolation Forest & LOF).",
    subsections: [
      {
        id: "ml-bab-7-1",
        slug: "clustering-kmeans-minibatch",
        title: "7.1. K-Means Clustering & Mini-Batch K-Means",
        orderIndex: 1,
        description: "Algoritma partisi berbasis centroid, inisialisasi k-means++, analisis Inersia (WCSS), Silhouette Score, dan optimasi MiniBatchKMeans untuk Big Data.",
        content_markdown: `# 7.1. K-Means Clustering & Mini-Batch K-Means

Algoritma **K-Means** mengelompokkan $n$ sampel data menjadi $k$ kelompok terpisah (*disjoint clusters*) $C = \\{C_1, C_2, \\dots, C_k\\}$, di mana masing-masing kluster dideskripsikan oleh titik pusat rata-rata $\\mu_j$ (*centroid*).

---

## 7.1.1. Formulasi Matematis Inersia (WCSS)
Tujuan K-Means adalah meminimalkan kriteria **Inersia** (jumlah kuadrat jarak dalam kluster / *Within-Cluster Sum of Squares*):

$$\\text{Inertia} = \\sum_{i=0}^{n} \\min_{\\mu_j \\in C} \\big(\\|x_i - \\mu_j\\|^2\\big)$$

### Algoritma Lloyd (Iteratif EM-like)
1. **Assignment Step**: Setiap observasi $x_i$ diasosiasikan ke centroid terdekat berdasarkan jarak Euclidean:
   $$c^{(i)} = \\arg\\min_j \\|x_i - \\mu_j\\|^2$$
2. **Update Step**: Menghitung ulang posisi masing-masing centroid $\\mu_j$ sebagai nilai rata-rata (*mean*) dari seluruh observasi yang masuk dalam kelompok $C_j$:
   $$\\mu_j = \\frac{1}{|C_j|} \\sum_{i \\in C_j} x_i$$

Iterasi berlanjut hingga pergeseran posisi centroid berada di bawah nilai ambang batas toleransi (\`tol=1e-4\`) atau mencapai batas maksimum iterasi (\`max_iter=300\`).

---

## 7.1.2. Inisialisasi Cerdas (k-means++)
Inisialisasi titik awal acak murni (*random initialization*) sangat rentan terjebak pada minimum lokal suboptimal (*poor local minima*). Scikit-Learn menggunakan default \`init='k-means++'\`, yang memilih centroid pertama secara seragam, lalu memilih centroid berikutnya dengan probabilitas kuadrat jarak ke centroid terdekat yang sudah terpilih:

$$P(x) = \\frac{D(x)^2}{\\sum_{x' \\in X} D(x')^2}$$

Di mana $D(x)$ merupakan jarak Euclidean terpendek dari titik $x$ ke centroid terdekat yang sudah ada. Pendekatan ini terbukti secara teoritis memberikan batas kesalahan $O(\\log k)$ dari solusi optimal.

---

## 7.1.3. Evaluasi Kualitas: Elbow Method & Koefisien Silhouette
1. **Elbow Method**: Memplot nilai inersia terhadap jumlah kluster $k$. Titik belok (*elbow point*) mengindikasikan efisiensi penambahan kluster telah menurun drastis.
2. **Silhouette Coefficient**: Mengukur seberapa dekat suatu titik dengan titik-titik di kluster yang sama ($a$) dibandingkan dengan titik-titik di kluster tetangga terdekat ($b$):
   $$s(i) = \\frac{b(i) - a(i)}{\\max\\big(a(i), b(i)\\big)}, \\quad s(i) \\in [-1, 1]$$
   - Nilai mendekati $+1$: Sampel terkelompok dengan sangat baik.
   - Nilai mendekati $0$: Sampel berada di perbatasan antar kluster.
   - Nilai negatif: Sampel kemungkinan salah dimasukkan ke dalam kluster tersebut.

---

## 7.1.4. Mini-Batch K-Means untuk Dataset Skala Besar
Untuk dataset dengan ratusan ribu hingga jutaan baris, \`MiniBatchKMeans\` melakukan pembaruan posisi centroid menggunakan sub-sampel acak (*mini-batch*) berukuran \`batch_size=1024\`. Kecepatan komputasinya berkali lipat lebih cepat dengan penurunan kualitas inersia yang sangat marjinal.

---

## 7.1.5. Implementasi Lengkap Python

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans, MiniBatchKMeans
from sklearn.datasets import make_blobs
from sklearn.metrics import silhouette_score, silhouette_samples

# 1. Generate dataset sintetis 4 kluster
X, y_true = make_blobs(n_samples=3000, centers=4, cluster_std=0.75, random_state=42)

# 2. Inisialisasi & Fitting K-Means reguler dengan k-means++
kmeans = KMeans(n_clusters=4, init='k-means++', n_init=10, max_iter=300, random_state=42)
y_kmeans = kmeans.fit_predict(X)

print("=" * 60)
print("HASIL EVALUASI K-MEANS REGULER")
print("=" * 60)
print(f"Inersia (WCSS)        : {kmeans.inertia_:.2f}")
print(f"Silhouette Score Global: {silhouette_score(X, y_kmeans):.4f}")
print(f"Jumlah Iterasi Konvergensi: {kmeans.n_iter_}")
print("Centroid Akhir:\n", np.round(kmeans.cluster_centers_, 3))

# 3. MiniBatchKMeans untuk inferensi cepat
mbk = MiniBatchKMeans(n_clusters=4, init='k-means++', batch_size=256, n_init=3, random_state=42)
y_mbk = mbk.fit_predict(X)

print("\n" + "=" * 60)
print("HASIL EVALUASI MINI-BATCH K-MEANS")
print("=" * 60)
print(f"Inersia MiniBatch     : {mbk.inertia_:.2f}")
print(f"Silhouette Score MiniBatch: {silhouette_score(X, y_mbk):.4f}")
\`\`\`
`
      },
      {
        id: "ml-bab-7-2",
        slug: "density-based-dbscan-hdbscan",
        title: "7.2. Density-Based Clustering: DBSCAN & HDBSCAN",
        orderIndex: 2,
        description: "Pengelompokan berbasis kepadatan spasial arbitrer, pemisahan noise/outlier otomatis, mutual reachability distance, dan HDBSCAN hierarkis.",
        content_markdown: `# 7.2. Density-Based Clustering: DBSCAN & HDBSCAN

Algoritma berbasis centroid seperti K-Means mengasumsikan kluster berbentuk cembung (*convex* / bulat). Ketika data riil memiliki bentuk melengkung, spiral, atau memiliki derau latar belakang (*background noise*), **DBSCAN** (*Density-Based Spatial Clustering of Applications with Noise*) dan **HDBSCAN** merupakan standar industri.

---

## 7.2.1. Konsep Inti DBSCAN
DBSCAN mempartisi ruang data berdasarkan kepadatan titik lokal:
- **$\\epsilon$ (eps)**: Jarak radius tetangga (*neighborhood radius*) maksimum dari titik observasi.
- **MinPts (min_samples)**: Jumlah titik minimum yang harus terkandung dalam radius $\\epsilon$ agar suatu titik dianggap sebagai *core point*.

### Klasifikasi Titik:
1. **Core Point (Titik Inti)**: Memiliki setidaknya \`min_samples\` titik dalam jarak $\\epsilon$:
   $$|N_\\epsilon(p)| \\ge \\text{min\\_samples}$$
2. **Border Point (Titik Perbatasan)**: Titik yang berada dalam radius $\\epsilon$ dari *core point*, namun memiliki tetangga kurang dari \`min_samples\`.
3. **Noise Point (Derau / Outlier)**: Titik yang bukan *core point* dan bukan *border point*. Scikit-Learn secara eksplisit memberi label \`-1\` pada sampel derau.

### Ketercapaian Kepadatan (Density-Reachability)
Sebuah titik $q$ dikatakan *density-reachable* dari titik $p$ jika terdapat urutan rantai titik $p_1, p_2, \\dots, p_n$ dengan $p_1 = p$ dan $p_n = q$, di mana setiap $p_{i+1}$ berada dalam radius $\\epsilon$ dari core point $p_i$. Sebuah kluster dibentuk oleh seluruh titik yang saling terhubung secara kepadatan (*density-connected*).

---

## 7.2.2. HDBSCAN (Hierarchical DBSCAN)
HDBSCAN memperluas DBSCAN dengan mengintegrasikan struktur hierarkis:
1. Menghitung **Core Distance** $d_{\\text{core}}(x)$ sebagai jarak ke tetangga ke-\`min_samples\`.
2. Menghitung **Mutual Reachability Distance**:
   $$d_{\\text{mrd}}(a, b) = \\max\\big(d_{\\text{core}}(a), d_{\\text{core}}(b), d(a, b)\\big)$$
3. Membangun Minimum Spanning Tree (MST), mengembunkan pohon kluster (*condensing tree*), dan mengekstrak kluster paling stabil berdasarkan persistensi keanggotaan.

---

## 7.2.3. Implementasi Lengkap Python

\`\`\`python
import numpy as np
from sklearn.cluster import DBSCAN, HDBSCAN
from sklearn.datasets import make_moons
from sklearn.preprocessing import StandardScaler

# 1. Generate dataset dua bulan sabit non-linear dengan noise acak
X, _ = make_moons(n_samples=800, noise=0.07, random_state=42)
X = StandardScaler().fit_transform(X)

# 2. Fitting DBSCAN
db = DBSCAN(eps=0.25, min_samples=8)
labels_db = db.fit_predict(X)

n_clusters_db = len(set(labels_db)) - (1 if -1 in labels_db else 0)
n_noise_db = list(labels_db).count(-1)

print("=" * 60)
print("HASIL EVALUASI DBSCAN")
print("=" * 60)
print(f"Jumlah kluster terdeteksi : {n_clusters_db}")
print(f"Jumlah sampel noise (-1)  : {n_noise_db} ({n_noise_db / len(X):.1%})")

# 3. Fitting HDBSCAN (Scikit-Learn 1.3+)
hdb = HDBSCAN(min_cluster_size=15, min_samples=8, store_centers='centroid')
labels_hdb = hdb.fit_predict(X)

n_clusters_hdb = len(set(labels_hdb)) - (1 if -1 in labels_hdb else 0)
n_noise_hdb = list(labels_hdb).count(-1)

print("\n" + "=" * 60)
print("HASIL EVALUASI HDBSCAN")
print("=" * 60)
print(f"Jumlah kluster terdeteksi : {n_clusters_hdb}")
print(f"Jumlah sampel noise (-1)  : {n_noise_hdb} ({n_noise_hdb / len(X):.1%})")
print("Skor persistensi probabilitas rata-rata:", np.mean(hdb.probabilities_))
\`\`\`
`
      },
      {
        id: "ml-bab-7-3",
        slug: "hierarchical-and-gmm",
        title: "7.3. Hierarchical Agglomerative & Gaussian Mixture Models (GMM)",
        orderIndex: 3,
        description: "Clustering hierarkis dendrogram dengan kriteria Ward linkage serta pemodelan probabilistik soft-clustering menggunakan Expectation-Maximization (EM).",
        content_markdown: `# 7.3. Hierarchical Agglomerative & Gaussian Mixture Models (GMM)

---

## 7.3.1. Agglomerative Hierarchical Clustering
Pendekatan *bottom-up* di mana setiap sampel data dimulai sebagai kluster independennya sendiri, lalu secara iteratif pasangan kluster terdekat digabungkan hingga seluruh data menyatu dalam satu pohon hierarki (*dendrogram*).

### Kriteria Linkage:
- **Ward's Linkage (\`linkage='ward'\`)**: Meminimalkan peningkatan total varians dalam kluster (*Error Sum of Squares* / $\\Delta ESS$):
  $$\\Delta ESS_{AB} = \\frac{n_A n_B}{n_A + n_B} \\|\\mu_A - \\mu_B\\|^2$$
  *Catatan: Ward hanya valid dengan jarak Euclidean.*
- **Complete Linkage (\`linkage='complete'\`)**: Jarak maksimum antara observasi di dua kluster ($d(A, B) = \\max_{x \\in A, y \\in B} \\|x - y\\|$).
- **Average Linkage (\`linkage='average'\`)**: Rata-rata jarak semua pasangan observasi antar kluster.

---

## 7.3.2. Gaussian Mixture Models (GMM)
GMM merupakan metode *generative soft-clustering* probabilistik yang mengasumsikan data dihasilkan dari campuran $K$ distribusi Gaussian multivariat:

$$P(x) = \\sum_{k=1}^{K} \\pi_k \\mathcal{N}(x \\mid \\mu_k, \\Sigma_k)$$

Di mana:
- $\\pi_k$ adalah bobot percampuran (*mixture weights*) dengan syarat $\\sum_{k=1}^K \\pi_k = 1$.
- $\\mu_k$ adalah vektor rata-rata kluster ke-$k$.
- $\\Sigma_k$ adalah matriks kovarians kluster ke-$k$.

### Algoritma Expectation-Maximization (EM):
1. **E-Step (Expectation)**: Menghitung tanggung jawab posterior probabilitas $\\gamma_{ik}$ bahwa sampel $x_i$ berasal dari komponen Gaussian ke-$k$:
   $$\\gamma_{ik} = \\frac{\\pi_k \\mathcal{N}(x_i \\mid \\mu_k, \\Sigma_k)}{\\sum_{j=1}^K \\pi_j \\mathcal{N}(x_i \\mid \\mu_j, \\Sigma_j)}$$
2. **M-Step (Maximization)**: Memperbarui parameter $\\pi_k, \\mu_k, \\Sigma_k$ dengan pembobotan berdasarkan responsibilitas $\\gamma_{ik}$.

### Seleksi Model dengan BIC & AIC
- **BIC (Bayesian Information Criterion)**: $-2 \\ln(\\hat{L}) + k \\ln(n)$
- **AIC (Akaike Information Criterion)**: $-2 \\ln(\\hat{L}) + 2k$

---

## 7.3.3. Implementasi Lengkap Python

\`\`\`python
import numpy as np
from sklearn.cluster import AgglomerativeClustering
from sklearn.mixture import GaussianMixture
from sklearn.datasets import load_iris
from sklearn.preprocessing import StandardScaler

# 1. Load dataset Iris
X, y = load_iris(return_X_y=True)
X_scaled = StandardScaler().fit_transform(X)

# 2. Agglomerative Clustering dengan Ward Linkage
agg = AgglomerativeClustering(n_clusters=3, metric='euclidean', linkage='ward')
labels_agg = agg.fit_predict(X_scaled)
print("Distribusi Kluster Agglomerative Ward:", np.bincount(labels_agg))

# 3. Gaussian Mixture Model (GMM) dengan BIC Model Selection
bic_scores = []
n_components_range = range(1, 6)

for n_comp in n_components_range:
    gmm_temp = GaussianMixture(n_components=n_comp, covariance_type='full', random_state=42)
    gmm_temp.fit(X_scaled)
    bic_scores.append(gmm_temp.bic(X_scaled))

best_k = n_components_range[np.argmin(bic_scores)]
print(f"Jumlah Komponen Optimal berdasarkan BIC: {best_k}")

# 4. Fit GMM Optimal
gmm = GaussianMixture(n_components=best_k, covariance_type='full', random_state=42)
gmm.fit(X_scaled)
soft_probs = gmm.predict_proba(X_scaled[:3])

print("Probabilitas Keanggotaan 3 Sampel Pertama (Soft Clustering):\n", np.round(soft_probs, 4))
\`\`\`
`
      },
      {
        id: "ml-bab-7-4",
        slug: "reduksi-dimensi-pca-tsne",
        title: "7.4. Reduksi Dimensi: PCA, IncrementalPCA, TruncatedSVD, & Manifold Learning (t-SNE)",
        orderIndex: 4,
        description: "Proyeksi linear ortogonal Principal Component Analysis (PCA), dekomposisi Singular Value Decomposition (SVD), dan visualisasi non-linear berdimensi tinggi t-SNE.",
        content_markdown: `# 7.4. Reduksi Dimensi: PCA, IncrementalPCA, TruncatedSVD, & Manifold Learning (t-SNE)

Reduksi dimensi mengatasi fenomena kutukan dimensi (*Curse of Dimensionality*), mempercepat proses komputasi pelatihan model, meminimalisir multikolinearitas antar fitur, serta memungkinkan visualisasi dataset kompleks ke dalam ruang 2D atau 3D.

---

## 7.4.1. Principal Component Analysis (PCA)
PCA memproyeksikan data ke arah vektor eigen (*eigenvectors*) ortogonal yang memaksimalkan varians data yang dipertahankan:

$$\\max_{w} \\; \\text{Var}(Xw) \\quad \\text{dengan syarat} \\quad \\|w\\| = 1$$

### Solusi via Singular Value Decomposition (SVD):
Scikit-Learn menghitung PCA secara efisien melalui faktorisasi matriks data yang telah dipusatkan (*mean-centered*):

$$X = U \\Sigma V^T$$

Di mana:
- $V$ berisi komponen utama ortogonal (*loading vectors*).
- $\\Sigma$ adalah matriks diagonal yang menyimpan nilai singular $\\sigma_i$. Varians dari komponen ke-$i$ diberikan oleh $\\frac{\\sigma_i^2}{n - 1}$.

### Rasio Varians Terjelaskan (Explained Variance Ratio)
$$\\text{EVR}_i = \\frac{\\sigma_i^2}{\\sum_{j=1}^p \\sigma_j^2}$$

---

## 7.4.2. Varian Khusus PCA
1. **IncrementalPCA (\`IncrementalPCA\`)**: Memecah dataset ke dalam mini-batch untuk memproses dataset raksasa yang tidak muat di memori RAM.
2. **TruncatedSVD (\`TruncatedSVD\`)**: Melakukan faktorisasi matriks secara langsung pada matriks jarang (*sparse matrices*, seperti representasi TF-IDF teks) tanpa sentralisasi eksplisit yang merusak efisiensi memori.
3. **t-SNE (\`TSNE\`)**: Algoritma non-linear berbasis kemungkinan probabilitas ketetanggaan yang meminimalkan divergensi Kullback-Leibler (KL) untuk mempertahankan struktur kluster lokal pada visualisasi 2D/3D.

---

## 7.4.3. Implementasi Lengkap Python

\`\`\`python
import numpy as np
from sklearn.decomposition import PCA, IncrementalPCA, TruncatedSVD
from sklearn.manifold import TSNE
from sklearn.datasets import load_digits
from sklearn.preprocessing import StandardScaler

# 1. Load dataset gambar angka tulisan tangan (8x8 pixel = 64 fitur)
digits = load_digits()
X, y = digits.data, digits.target

X_scaled = StandardScaler().fit_transform(X)

# 2. PCA: Tentukan jumlah komponen untuk mempertahankan 90% varians
pca = PCA(n_components=0.90, svd_solver='full', random_state=42)
X_pca = pca.fit_transform(X_scaled)

print("=" * 60)
print("HASIL REDUKSI DIMENSI PCA")
print("=" * 60)
print(f"Dimensi Awal  : {X.shape[1]} fitur")
print(f"Dimensi Akhir : {X_pca.shape[1]} komponen utama")
print(f"Total Varians : {np.sum(pca.explained_variance_ratio_):.2%}")

# 3. IncrementalPCA (Out-of-Core Batch Processing)
ipca = IncrementalPCA(n_components=10, batch_size=250)
for batch in np.array_split(X_scaled, 6):
    ipca.partial_fit(batch)
print("IncrementalPCA berhasil memproses data dalam 6 batch terpisah.")

# 4. t-SNE untuk Visualisasi 2D
tsne = TSNE(n_components=2, perplexity=30.0, max_iter=1000, random_state=42)
X_tsne = tsne.fit_transform(X[:600]) # Ambil subset 600 sampel
print("Visualisasi t-SNE 2D shape:", X_tsne.shape)
\`\`\`
`
      },
      {
        id: "ml-bab-7-5",
        slug: "deteksi-anomali-isolation-forest",
        title: "7.5. Deteksi Anomali & Outlier: Isolation Forest, LOF, & One-Class SVM",
        orderIndex: 5,
        description: "Mendeteksi pencilan dan anomali tanpa label menggunakan Isolation Forest, Local Outlier Factor berbasis densitas lokal, dan One-Class SVM.",
        content_markdown: `# 7.5. Deteksi Anomali & Outlier: Isolation Forest, LOF, & One-Class SVM

Deteksi anomali (*Anomaly Detection*) dan deteksi pencilan (*Outlier Detection*) bertujuan menemukan observasi langka yang menyimpang secara signifikan dari karakteristik umum populasi normal (misal kecurangan perbankan, kerusakan turbin, atau serangan intrusi jaringan).

---

## 7.5.1. Isolation Forest (\`IsolationForest\`)
Isolation Forest didasarkan pada prinsip bahwa titik anomali memiliki karakteristik "sedikit dan berbeda" (*few and different*). Algoritma ini mengisolasi observasi dengan membangun ansambel pohon biner acak (*iTrees*):
- Pada setiap node, fitur dipilih secara acak, dan nilai pemisah (*split*) dipilih secara acak antara nilai minimum dan maksimum fitur tersebut.
- Sampel anomali membutuhkan jauh lebih sedikit pemisahan untuk terisolasi sempurna pada daun pohon dibandingkan sampel normal.

Skor anomali suatu sampel $x$ dihitung sebagai:

$$s(x, n) = 2^{-\\frac{E(h(x))}{c(n)}}$$

Di mana:
- $h(x)$ adalah kedalaman lintasan partisi (*path length*) untuk mengisolasi $x$.
- $E(h(x))$ adalah rata-rata panjang lintasan di seluruh pohon ansambel.
- $c(n) = 2 \\ln(n - 1) + 0.5772156649 - \\frac{2(n - 1)}{n}$ adalah rata-rata panjang lintasan pohon pencarian biner pada dataset berukuran $n$.
- Jika $s \\to 1$: Sampel merupakan anomali pasti.
- Jika $s < 0.5$: Sampel merupakan data normal.

---

## 7.5.2. Local Outlier Factor (LOF) & One-Class SVM
1. **Local Outlier Factor (\`LocalOutlierFactor\`)**: Mengukur rasio kepadatan lokal suatu sampel terhadap kepadatan lokal $k$-tetangga terdekatnya. Sampel dengan kepadatan jauh lebih rendah daripada tetangganya ditandai sebagai outlier.
2. **One-Class SVM (\`OneClassSVM\`)**: Mempelajari fungsi keputusan yang membungkus data normal di sekitar ruang fitur RKHS menggunakan kernel non-linear (RBF) dan memisahkan origin dari distribusi data padat.

---

## 7.5.3. Implementasi Lengkap Python

\`\`\`python
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.svm import OneClassSVM

# 1. Buat data normal (inliers)
np.random.seed(42)
X_normal = 0.3 * np.random.randn(500, 2)

# Buat data anomali ekstrem (outliers)
X_anomali = np.random.uniform(low=-4, high=4, size=(25, 2))

# Gabungkan dataset
X_total = np.vstack([X_normal, X_anomali])
y_true = np.array([1] * 500 + [-1] * 25) # 1: normal, -1: outlier

# 2. Isolation Forest
iso = IsolationForest(contamination=0.05, random_state=42)
preds_iso = iso.fit_predict(X_total)
score_iso = iso.decision_function(X_total)

# 3. Local Outlier Factor (LOF)
lof = LocalOutlierFactor(n_neighbors=20, contamination=0.05)
preds_lof = lof.fit_predict(X_total)

# 4. One-Class SVM
oc_svm = OneClassSVM(kernel='rbf', gamma='scale', nu=0.05)
preds_svm = oc_svm.fit_predict(X_total)

print("=" * 60)
print("HASIL DETEKSI ANOMALI & OUTLIER")
print("=" * 60)
print(f"Isolation Forest Outliers Terdeteksi : {np.sum(preds_iso == -1)}")
print(f"Local Outlier Factor Outliers        : {np.sum(preds_lof == -1)}")
print(f"One-Class SVM Outliers               : {np.sum(preds_svm == -1)}")
print("Rata-rata Skor Anomali 5 sampel pertama:", np.round(score_iso[:5], 3))
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 8: Online & Continual Learning
  // =========================================================================
  {
    id: "ml-bab-8",
    slug: "bab-8-online-continual-learning",
    title: "BAB 8: Online & Continual Learning",
    orderIndex: 8,
    description: "Streaming learning dengan metode partial_fit(), penanganan Big Data out-of-core dengan HashingVectorizer, Passive-Aggressive algorithms, dan mitigasi catastrophic forgetting.",
    subsections: [
      {
        id: "ml-bab-8-1",
        slug: "streaming-partial-fit-sgd",
        title: "8.1. Pembelajaran Daring (Online Learning) dengan partial_fit()",
        orderIndex: 1,
        description: "Melatih model secara bertahap saat data baru tiba secara streaming tanpa perlu melatih ulang dari awal menggunakan SGDClassifier & SGDRegressor.",
        content_markdown: `# 8.1. Pembelajaran Daring (Online Learning) dengan partial_fit()

Dalam skenario data streaming modern (seperti aliran transaksi kartu kredit, log akses internet, sensor IoT, atau cuitan media sosial), data berukuran tak terbatas (*unbounded*) dan tiba secara berkala seiring waktu. Melatih ulang (*retraining*) model dari awal pada seluruh data historis menjadi mustahil secara komputasi.

---

## 8.1.1. Aturan Formal \`partial_fit()\`
Scikit-Learn menyediakan metode \`partial_fit()\` pada estimator linear seperti \`SGDClassifier\`, \`SGDRegressor\`, \`Perceptron\`, dan \`MultinomialNB\`. 

### Persyaratan Kritis:
Pada pemanggilan pertama \`partial_fit\`, parameter \`classes\` wajib diberikan agar estimator mengetahui daftar label kelas global, bahkan jika batch pertama hanya berisi sebagian kelas:

\`\`\`python
clf.partial_fit(X_batch_1, y_batch_1, classes=np.array([0, 1, 2]))
\`\`\`

### Formulasi Pembaruan Stokastik
Pada setiap sampel atau mini-batch data baru $(x_t, y_t)$, bobot diperbarui secara instan:

$$w_{t+1} = (1 - \\eta_t \\alpha) w_t - \\eta_t \\nabla L(w_t; x_t, y_t)$$

---

## 8.1.2. Fungsi Kerugian (\`loss\`) pada SGDClassifier
- \`loss='log_loss'\`: Regresi logistik stokastik dengan estimasi probabilitas melalui \`predict_proba()\`.
- \`loss='hinge'\`: Support Vector Machine (Linear SVM) dengan margin maksimum.
- \`loss='modified_huber'\`: Fungsi kerugian tahan-outlier halus yang menghasilkan estimasi probabilitas probabilistik.

---

## 8.1.3. Implementasi Lengkap Python

\`\`\`python
import numpy as np
from sklearn.linear_model import SGDClassifier
from sklearn.metrics import accuracy_score

# 1. Inisialisasi model streaming
clf = SGDClassifier(
    loss='log_loss',
    penalty='l2',
    alpha=1e-4,
    learning_rate='optimal',
    random_state=42
)

all_classes = np.array([0, 1])

# 2. Simulasi 5 Gelombang Stream Data Real-Time
print("=" * 60)
print("SIMULASI STREAMING LEARNING DENGAN PARTIAL_FIT()")
print("=" * 60)

for stream_epoch in range(1, 6):
    # Simulasi kedatangan 200 data baru per batch
    X_stream = np.random.randn(200, 10)
    # Target sintetik berbasis kombinasi linear
    y_stream = (X_stream[:, 0] * 1.5 + X_stream[:, 1] * -2.0 > 0).astype(int)
    
    if stream_epoch == 1:
        clf.partial_fit(X_stream, y_stream, classes=all_classes)
    else:
        clf.partial_fit(X_stream, y_stream)
        
    acc = accuracy_score(y_stream, clf.predict(X_stream))
    print(f"Batch Stream #{stream_epoch}: Ukuran {len(X_stream)} sampel | Akurasi Terkini: {acc:.2%}")

# Uji Inferensi Sampel Baru
x_new = np.random.randn(1, 10)
print("\nProbabilitas inferensi data baru:", np.round(clf.predict_proba(x_new), 4))
\`\`\`
`
      },
      {
        id: "ml-bab-8-2",
        slug: "passive-aggressive-algorithms",
        title: "8.2. Passive-Aggressive Algorithms (PA-I & PA-II)",
        orderIndex: 2,
        description: "Optimasi margin online margin-based: pembaruan parameter agresif saat terjadi kesalahan prediksi margin dan stabilitas pada non-stationary streams.",
        content_markdown: `# 8.2. Passive-Aggressive Algorithms (PA-I & PA-II)

Algoritma **Passive-Aggressive** (Crammer et al., 2006) adalah keluarga algoritma pembelajaran margin online berskala besar yang ideal untuk data streaming non-stasioner (*data drift*).

---

## 8.2.1. Filosofi Algoritma: Passive vs. Aggressive
- **Passive**: Jika model memprediksi sampel baru dengan benar dan margin kepastian mencukupi (fungsi kerugian hinge bernilai $0$), model **tidak mengubah** bobot parameter sama sekali ($w_{t+1} = w_t$).
- **Aggressive**: Jika model membuat kesalahan atau margin kepastian kurang dari $1$ (loss $\\ell_t > 0$), model **secara agresif memperbarui** bobotnya seminimal mungkin agar sampel tersebut diklasifikasikan dengan benar pada margin batas $1$.

### Formulasi Optimasi:
$$w_{t+1} = \\arg\\min_w \\frac{1}{2} \\|w - w_t\\|^2 \\quad \\text{dengan syarat} \\quad \\ell(w; (x_t, y_t)) = 0$$

### Aturan Pembaruan Solusi Tertutup (Closed-Form):
$$\\tau_t = \\min \\left( C, \\; \\frac{\\ell_t}{\\|x_t\\|^2} \\right) \\quad \\text{(Varian PA-I)}$$
$$w_{t+1} = w_t + \\text{sign}(y_t) \\tau_t x_t$$

---

## 8.2.2. Implementasi Lengkap Python

\`\`\`python
import numpy as np
from sklearn.linear_model import PassiveAggressiveClassifier
from sklearn.datasets import make_classification
from sklearn.metrics import classification_report

# 1. Dataset streaming sintetik
X, y = make_classification(n_samples=2000, n_features=20, n_classes=2, random_state=42)

# 2. Inisialisasi PassiveAggressiveClassifier
pac = PassiveAggressiveClassifier(C=0.5, loss='hinge', random_state=42)
classes = np.unique(y)

# Latih secara bertahap dalam 4 batch
batches_X = np.array_split(X, 4)
batches_y = np.array_split(y, 4)

for i, (bx, by) in enumerate(zip(batches_X, batches_y)):
    pac.partial_fit(bx, by, classes=classes if i == 0 else None)
    print(f"Batch #{i+1} selesai dipelajari. Akurasi batch: {pac.score(bx, by):.2%}")

# Evaluasi pada data uji terpisah
X_test, y_test = make_classification(n_samples=500, n_features=20, random_state=100)
print("\nLaporan Klasifikasi Data Uji Baru:\n", classification_report(y_test, pac.predict(X_test)))
\`\`\`
`
      },
      {
        id: "ml-bab-8-3",
        slug: "out-of-core-classification-big-data",
        title: "8.3. Out-of-Core Processing: Melatih Model pada Dataset yang Melebihi RAM",
        orderIndex: 3,
        description: "Kombinasi HashingVectorizer stateless tanpa kamus memori dan SGDClassifier untuk membaca data disk chunk demi chunk.",
        content_markdown: `# 8.3. Out-of-Core Processing: Melatih Model pada Dataset yang Melebihi RAM

Ketika ukuran dataset mencapai puluhan Gigabyte atau Terabyte dan tidak muat dalam memori RAM komputer, pendekatan standar \`fit(X, y)\` akan menghasilkan eror sistem *Out-Of-Memory (OOM)*.

---

## 8.3.1. Arsitektur Tiga Pilar Out-of-Core
1. **Streaming Data Generator**: Membaca file baris demi baris atau chunk demi chunk langsung dari disk storage tanpa memuat seluruh file ke memori.
2. **Stateless Vectorizer (\`HashingVectorizer\`)**: Mengonversi teks atau fitur kategorikal ke dalam indeks matriks sparse menggunakan fungsi hash *MurmurHash3*. Karena tidak perlu menyimpan kamus kosakata (*vocabulary*) di memori, konsumsi memorinya bernilai konstan $O(1)$.
3. **Incremental Estimator (\`SGDClassifier\` / \`SGDRegressor\`)**: Mengonsumsi batch fitur sparse menggunakan \`partial_fit()\`.

---

## 8.3.2. Implementasi Lengkap Python

\`\`\`python
from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.metrics import accuracy_score
import io

# 1. Inisialisasi HashingVectorizer stateless dengan 2^18 fitur
vectorizer = HashingVectorizer(n_features=2**18, alternate_sign=False, norm='l2')
clf = SGDClassifier(loss='modified_huber', penalty='l2', alpha=1e-5, random_state=42)
classes = [0, 1]

# 2. Generator Streaming Membaca Chunk Data Teks
def stream_text_dataset():
    # Simulasi batch teks dari file disk raksasa
    data_batches = [
        ([
            "Antarmuka sistem ini sangat responsif dan intuitif",
            "Materi pembelajaran machine learning ini sangat lengkap",
            "Pelayanan pelanggan sangat lambat dan mengecewakan",
            "Aplikasi sering mengalami crash saat proses export"
        ], [1, 1, 0, 0]),
        ([
            "Dokumentasi algoritma sangat jelas dan disertai rumus",
            "Sistem rekomendasi bekerja sangat akurat dan presisi",
            "Fitur pencarian sering menghasilkan hasil yang tidak relevan",
            "Kualitas video streaming sangat buruk dan terputus"
        ], [1, 1, 0, 0])
    ]
    for texts, labels in data_batches:
        yield texts, labels

# 3. Training Loop Out-of-Core
for i, (texts, labels) in enumerate(stream_text_dataset()):
    X_chunk = vectorizer.transform(texts)
    clf.partial_fit(X_chunk, labels, classes=classes if i == 0 else None)
    print(f"Batch Chunk #{i+1} diproses. Dimensi matriks sparse: {X_chunk.shape}")

# 4. Evaluasi Sampel Teks Baru
test_samples = [
    "Saya sangat puas dengan kelengkapan materi kurikulum ini",
    "Sangat mengecewakan, sistem lambat sekali"
]
X_test = vectorizer.transform(test_samples)
preds = clf.predict(X_test)
probs = clf.predict_proba(X_test)

print("\n" + "=" * 60)
print("HASIL INFERENSI OUT-OF-CORE")
print("=" * 60)
for txt, p, prob in zip(test_samples, preds, probs):
    label_str = "POSITIF" if p == 1 else "NEGATIF"
    print(f"Teks: '{txt}' -> Prediksi: {label_str} (Prob: {prob[p]:.2%})")
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 9: Evaluasi, Validasi & Model Selection
  // =========================================================================
  {
    id: "ml-bab-9",
    slug: "bab-9-evaluasi-validasi-model",
    title: "BAB 9: Evaluasi & Validasi Model",
    orderIndex: 9,
    description: "Strategi validasi silang (StratifiedKFold, TimeSeriesSplit, GroupKFold), metrik klasifikasi (MCC, ROC-AUC, PR-AUC), metrik regresi, kalibrasi probabilitas, dan penyetelan hiperparameter (HalvingGridSearchCV).",
    subsections: [
      {
        id: "ml-bab-9-1",
        slug: "cross-validation-strategies",
        title: "9.1. Strategi Cross-Validation Bebas Kebocoran Data",
        orderIndex: 1,
        description: "KFold, StratifiedKFold, TimeSeriesSplit, GroupKFold, dan RepeatedStratifiedKFold untuk validasi empiris yang objektif.",
        content_markdown: `# 9.1. Strategi Cross-Validation Bebas Kebocoran Data

Membagi data hanya menjadi *train-test split* tunggal sering menghasilkan estimasi performa dengan varians tinggi yang sangat bergantung pada kebetulan pembagian data acak. **Cross-Validation (Validasi Silang)** memberikan estimasi performa generalisasi yang jauh lebih kokoh dan tidak bias.

---

## 9.1.1. Taksonomi Strategi Cross-Validation
1. **\`KFold\`**: Membagi data secara seragam menjadi $K$ lipatan (*folds*). Cocok hanya untuk data regresi dengan distribusi seimbang.
2. **\`StratifiedKFold\`**: Memastikan setiap lipatan memiliki proporsi persentase kelas target yang identik dengan populasi penuh. **Wajib digunakan untuk klasifikasi dengan data tidak seimbang (*imbalanced data*)**.
3. **\`TimeSeriesSplit\`**: Skema *walk-forward validation* di mana data pelatihan hanya menggunakan data masa lalu dan data uji selalu berada di masa depan. Mencegah kebocoran masa depan (*lookahead bias*).
4. **\`GroupKFold\`**: Memastikan observasi dari kelompok yang sama (misal rekaman medis dari pasien yang sama) tidak pernah muncul sekaligus di set latih dan set uji, mencegah kebocoran identitas entitas.

---

## 9.1.2. Implementasi Lengkap Python

\`\`\`python
import numpy as np
from sklearn.model_selection import StratifiedKFold, TimeSeriesSplit, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_breast_cancer

# 1. Load dataset
X, y = load_breast_cancer(return_X_y=True)
clf = RandomForestClassifier(n_estimators=50, random_state=42)

# 2. Stratified 5-Fold Cross Validation
cv_strat = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores_strat = cross_val_score(clf, X, y, cv=cv_strat, scoring='roc_auc')

print("=" * 60)
print("HASIL STRATIFIED 5-FOLD CROSS-VALIDATION")
print("=" * 60)
print("Skor ROC-AUC per fold :", np.round(scores_strat, 4))
print(f"Rata-rata Skor       : {scores_strat.mean():.4f} (+/- {scores_strat.std():.4f})")

# 3. TimeSeriesSplit (Walk-Forward Temporal Split)
tscv = TimeSeriesSplit(n_splits=4)
print("\nAlokasi Index TimeSeriesSplit:")
for fold, (train_idx, test_idx) in enumerate(tscv.split(X)):
    print(f"Fold #{fold+1}: Latih {len(train_idx)} sampel (0 - {train_idx[-1]}) -> Uji {len(test_idx)} sampel ({test_idx[0]} - {test_idx[-1]})")
\`\`\`
`
      },
      {
        id: "ml-bab-9-2",
        slug: "metrik-klasifikasi-roc-pr",
        title: "9.2. Metrik Klasifikasi, Kurva ROC, & Precision-Recall",
        orderIndex: 2,
        description: "Confusion matrix komprehensif, Precision, Recall, F1, Matthews Correlation Coefficient (MCC), ROC-AUC vs PR-AUC, dan Display APIs.",
        content_markdown: `# 9.2. Metrik Klasifikasi, Kurva ROC, & Precision-Recall

Mengandalkan metrik **Akurasi** semata pada dataset yang tidak seimbang (*class imbalance*) menimbulkan ilusi performa semu (*accuracy paradox*). Jika 99% data adalah transaksi normal dan 1% penipuan, model yang selalu memprediksi normal akan memiliki akurasi 99%, namun gagal total mendeteksi penipuan.

---

## 9.2.1. Matriks Kebingungan (Confusion Matrix)
| | Prediksi Negatif | Prediksi Positif |
|---|---|---|
| **Aktual Negatif** | Benar Negatif ($TN$) | Salah Positif ($FP$) - Eror Tipe I |
| **Aktual Positif** | Salah Negatif ($FN$) - Eror Tipe II | Benar Positif ($TP$) |

### Formulasi Metrik Fundamental:
- **Precision (Presisi)**: Proporsi prediksi positif yang benar-benar positif:
  $$\\text{Precision} = \\frac{TP}{TP + FP}$$
- **Recall (Sensitivitas / TPR)**: Kemampuan model menemukan seluruh kasus positif aktual:
  $$\\text{Recall} = \\frac{TP}{TP + FN}$$
- **F1-Score**: Rata-rata harmonik antara presisi dan recall:
  $$F_1 = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}$$
- **Matthews Correlation Coefficient (MCC)**: Metrik paling seimbang yang memperhitungkan seluruh kuadran matriks kebingungan:
  $$\\text{MCC} = \\frac{TP \\times TN - FP \\times FN}{\\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}} \\in [-1, +1]$$

---

## 9.2.2. ROC-AUC vs PR-AUC
- **ROC-AUC**: Memetakan *True Positive Rate* ($TPR$) terhadap *False Positive Rate* ($FPR$). Sangat baik ketika kedua kelas sama pentingnya.
- **PR-AUC (Precision-Recall AUC)**: Memetakan Presisi terhadap Recall. **Jauh lebih informatif daripada ROC saat menghadapi kelas minoritas ekstrem** karena tidak dipengaruhi oleh besarnya jumlah $TN$.

---

## 9.2.3. Implementasi Lengkap Python

\`\`\`python
import numpy as np
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score,
    average_precision_score,
    matthews_corrcoef,
    brier_score_loss
)

# Simulasi data evaluasi dengan class imbalance (10% positif)
np.random.seed(42)
y_true = np.array([0] * 90 + [1] * 10)
# Probabilitas model prediktif
y_prob = np.concatenate([
    np.random.beta(1, 8, size=90),  # Mayoritas nilai rendah untuk kelas 0
    np.random.beta(6, 2, size=10)   # Mayoritas nilai tinggi untuk kelas 1
])
y_pred = (y_prob >= 0.5).astype(int)

cm = confusion_matrix(y_true, y_pred)
mcc = matthews_corrcoef(y_true, y_pred)
roc_auc = roc_auc_score(y_true, y_prob)
pr_auc = average_precision_score(y_true, y_prob)
brier = brier_score_loss(y_true, y_prob)

print("=" * 60)
print("LAPORAN EVALUASI KLASIFIKASI LENGKAP")
print("=" * 60)
print("Confusion Matrix:\n", cm)
print(f"Matthews Correlation Coefficient (MCC): {mcc:.4f}")
print(f"ROC-AUC Score                         : {roc_auc:.4f}")
print(f"PR-AUC Score (Average Precision)      : {pr_auc:.4f}")
print(f"Brier Score (Ketepatan Probabilitas)  : {brier:.4f}")
print("\nClassification Report:\n", classification_report(y_true, y_pred, digits=4))
\`\`\`
`
      },
      {
        id: "ml-bab-9-3",
        slug: "metrik-regresi-dan-residual",
        title: "9.3. Metrik Regresi & Analisis Residual",
        orderIndex: 3,
        description: "MAE, MSE, RMSE, R² Score, MAPE, Max Error, dan uji diagnostik residual homoskedastisitas.",
        content_markdown: `# 9.3. Metrik Regresi & Analisis Residual

---

## 9.3.1. Formulasi Matematis Metrik Regresi
Misalkan $y_i$ adalah nilai target sebenarnya, $\\hat{y}_i$ adalah nilai prediksi, dan $\\bar{y}$ adalah nilai rata-rata sampel:

1. **Mean Absolute Error (MAE)**: Menghitung rata-rata besaran absolut kesalahan tanpa memperhatikan arah, sangat tahan terhadap outlier:
   $$\\text{MAE} = \\frac{1}{n} \\sum_{i=1}^n |y_i - \\hat{y}_i|$$
2. **Root Mean Squared Error (RMSE)**: Akar dari rata-rata kuadrat kesalahan, memiliki satuan yang sama dengan target dan sangat menghukum eror besar:
   $$\\text{RMSE} = \\sqrt{\\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)^2}$$
3. **Koefisien Determinasi ($R^2$)**: Proporsi varians target yang mampu dijelaskan oleh model fitur input:
   $$R^2 = 1 - \\frac{\\sum_{i=1}^n (y_i - \\hat{y}_i)^2}{\\sum_{i=1}^n (y_i - \\bar{y})^2}$$
4. **Mean Absolute Percentage Error (MAPE)**: Kesalahan persentase relatif terhadap nilai aktual:
   $$\\text{MAPE} = \\frac{1}{n} \\sum_{i=1}^n \\left| \\frac{y_i - \\hat{y}_i}{y_i} \\right|$$

---

## 9.3.2. Implementasi Lengkap Python

\`\`\`python
import numpy as np
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    mean_absolute_percentage_error,
    max_error
)

# Nilai aktual vs prediksi model regresi
y_act = np.array([250.0, 310.0, 180.0, 420.0, 500.0, 290.0])
y_pred = np.array([245.0, 325.0, 170.0, 450.0, 490.0, 285.0])

mae = mean_absolute_error(y_act, y_pred)
rmse = mean_squared_error(y_act, y_pred) ** 0.5
r2 = r2_score(y_act, y_pred)
mape = mean_absolute_percentage_error(y_act, y_pred)
max_err = max_error(y_act, y_pred)

print("=" * 60)
print("HASIL EVALUASI MODEL REGRESI")
print("=" * 60)
print(f"MAE       : {mae:.2f}")
print(f"RMSE      : {rmse:.2f}")
print(f"R² Score  : {r2:.4f}")
print(f"MAPE      : {mape:.2%}")
print(f"Max Error : {max_err:.2f}")

# Analisis Residual
residuals = y_act - y_pred
print(f"Rata-rata Residual (Harus mendekati 0): {np.mean(residuals):.4f}")
print(f"Standar Deviasi Residual             : {np.std(residuals):.4f}")
\`\`\`
`
      },
      {
        id: "ml-bab-9-4",
        slug: "kalibrasi-probabilitas",
        title: "9.4. Kalibrasi Probabilitas: CalibratedClassifierCV",
        orderIndex: 4,
        description: "Memastikan probabilitas keluaran model (SVM, Random Forest, Naive Bayes) mencerminkan frekuensi empiris sesungguhnya dengan Platt Scaling & Isotonic Regression.",
        content_markdown: `# 9.4. Kalibrasi Probabilitas: CalibratedClassifierCV

Banyak estimator klasifikasi (seperti \`LinearSVC\`, \`SVC\`, atau \`GaussianNB\`) menghasilkan skor prediksi yang tidak terkalibrasi dengan baik sebagai probabilitas sejati. Ketika model mengatakan suatu peristiwa memiliki probabilitas 80%, dalam kenyataan empiris hanya 60% yang benar-benar terjadi.

---

## 9.4.1. Metode Kalibrasi
Scikit-Learn menyediakan \`CalibratedClassifierCV\` dengan dua metode utama:
1. **Sigmoid (Platt Scaling, \`method='sigmoid'\`)**: Memetakan output skor fungsi keputusan $f(x)$ ke fungsi logistik berbobot:
   $$P(y=1 \\mid f) = \\frac{1}{1 + \\exp(A f + B)}$$
   *Sangat cocok untuk dataset sampel kecil hingga menengah.*
2. **Isotonic Regression (\`method='isotonic'\`)**: Metode non-parametrik yang menyesuaikan fungsi tangga monoton bertingkat. *Hanya cocok untuk dataset besar agar tidak mengalami overfitting.*

---

## 9.4.2. Implementasi Lengkap Python

\`\`\`python
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV, calibration_curve
from sklearn.datasets import make_classification
from sklearn.metrics import brier_score_loss

# 1. Dataset klasifikasi biner
X, y = make_classification(n_samples=2000, n_features=20, random_state=42)

# LinearSVC tidak memiliki predict_proba bawaan
base_svc = LinearSVC(C=1.0, random_state=42)

# 2. Kalibrasi Sigmoid via 5-Fold Cross Validation
calibrated_svc = CalibratedClassifierCV(estimator=base_svc, method='sigmoid', cv=5)
calibrated_svc.fit(X, y)

# 3. Prediksi Probabilitas Terkalibrasi
prob_cal = calibrated_svc.predict_proba(X)
brier_cal = brier_score_loss(y, prob_cal[:, 1])

print("=" * 60)
print("HASIL KALIBRASI PROBABILITAS LINEARSVC")
print("=" * 60)
print(f"Brier Score (Makin kecil makin akurat) : {brier_cal:.4f}")
print("Contoh Probabilitas Terkalibrasi [P(0), P(1)]:\n", np.round(prob_cal[:4], 4))
\`\`\`
`
      },
      {
        id: "ml-bab-9-5",
        slug: "penyetelan-hiperparameter-gridsearch-halving",
        title: "9.5. Penyetelan Hiperparameter: GridSearchCV & HalvingGridSearchCV",
        orderIndex: 5,
        description: "Pencarian kisi komprehensif, pencarian acak, dan akselerasi successive halving (HalvingGridSearchCV) untuk efisiensi komputasi.",
        content_markdown: `# 9.5. Penyetelan Hiperparameter: GridSearchCV & HalvingGridSearchCV

Penyetelan hiperparameter (*hyperparameter tuning*) menentukan performa puncak model machine learning dalam menyeimbangkan bias dan varians.

---

## 9.5.1. Perbandingan Metode Penyetelan
- **GridSearchCV**: Menguji seluruh kombinasi parameter secara exhaustif (*Cartesian product*). Sangat lambat jika ruang pencarian besar.
- **RandomizedSearchCV**: Mengambil sampel kombinasi secara acak dari distribusi probabilitas tertentu, jauh lebih efisien pada dimensi ruang parameter tinggi.
- **HalvingGridSearchCV (Successive Halving)**: Menguji seluruh kandidat parameter pada subset data kecil (*small resource*), lalu memangkas kandidat terburuk dan melipatgandakan data pelatihan untuk kandidat terbaik pada ronde berikutnya hingga terpilih pemenang akhir. Kecepatannya mencapai 10x lebih cepat daripada GridSearchCV biasa.

---

## 9.5.2. Implementasi Lengkap Python

\`\`\`python
from sklearn.experimental import enable_halving_search_cv  # noqa
from sklearn.model_selection import HalvingGridSearchCV
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.datasets import load_breast_cancer

# 1. Load data
X, y = load_breast_cancer(return_X_y=True)

# 2. Ruang Parameter
param_grid = {
    'learning_rate': [0.01, 0.05, 0.1, 0.2],
    'max_leaf_nodes': [15, 31, 63],
    'min_samples_leaf': [10, 20, 30],
    'l2_regularization': [0.0, 0.1, 1.0]
}

# 3. HalvingGridSearchCV
halving_search = HalvingGridSearchCV(
    estimator=HistGradientBoostingClassifier(random_state=42),
    param_grid=param_grid,
    scoring='roc_auc',
    factor=3,
    random_state=42,
    cv=3
)
halving_search.fit(X, y)

print("=" * 60)
print("HASIL HALVING GRID SEARCH CV")
print("=" * 60)
print("Skor ROC-AUC Terbaik :", f"{halving_search.best_score_:.4f}")
print("Parameter Terbaik    :", halving_search.best_params_)
print(f"Total Model Diuji    : {len(halving_search.cv_results_['params'])}")
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 10: Advanced Ensembles & Gradient Boosting
  // =========================================================================
  {
    id: "ml-bab-10",
    slug: "bab-10-ensemble-learning",
    title: "BAB 10: Advanced Ensembles & Gradient Boosting",
    orderIndex: 10,
    description: "Bagging, Random Forest dengan OOB Score, Extra Trees, AdaBoost, Gradient Tree Boosting, HistGradientBoosting modern ala LightGBM, serta Stacking & Voting Ensembles.",
    subsections: [
      {
        id: "ml-bab-10-1",
        slug: "bagging-random-forests-extratrees",
        title: "10.1. Bagging, Random Forests, & Extra Trees",
        orderIndex: 1,
        description: "Bootstrap Aggregating, penurunan varians, korelasi antar pohon, Out-of-Bag (OOB) error score, dan Extremely Randomized Trees.",
        content_markdown: `# 10.1. Bagging, Random Forests, & Extra Trees

Metode **Bagging** (*Bootstrap Aggregating*) melatih sejumlah estimator dasar (*base estimators*) secara independen dan paralel pada sub-sampel acak yang diambil dengan pengembalian (*bootstrap sample*) dari dataset pelatihan.

---

## 10.1.1. Penurunan Varians Teoritis
Jika terdapat $B$ pohon keputusan yang independen dengan varians $\\sigma^2$ dan korelasi antar pohon $\\rho$, maka varians dari rata-rata prediksi ansambel adalah:

$$\\text{Var}(\\bar{T}) = \\rho \\sigma^2 + \\frac{1 - \\rho}{B} \\sigma^2$$

Ketika jumlah pohon $B \\to \\infty$, suku kedua mendekati nol, dan varians ansambel dibatasi oleh $\\rho \\sigma^2$. Oleh karena itu, kunci keberhasilan Bagging adalah **meminimalkan korelasi $\\rho$ antar pohon**.

---

## 10.1.2. Random Forest vs. Extra Trees
1. **Random Forest (\`RandomForestClassifier\` / \`RandomForestRegressor\`)**: Mendekorelasikan pohon dengan hanya mempertimbangkan subset acak berukuran \`max_features\` (default $\\sqrt{p}$ untuk klasifikasi) pada setiap proses pemisahan node.
2. **Out-of-Bag (OOB) Score**: Sekitar $1 - 1/e \\approx 36.8\\%$ data tidak terpilih dalam sampel bootstrap. Data yang tersisa ini berfungsi sebagai set validasi gratis tanpa memerlukan cross-validation terpisah.
3. **Extra Trees (\`ExtraTreesClassifier\`)**: Melangkah lebih jauh dalam mengacak model: ambang batas pemisahan (*threshold*) dipilih secara acak murni untuk setiap fitur kandidat, menghasilkan varians yang lebih rendah dan kecepatan komputasi yang lebih tinggi.

---

## 10.1.3. Implementasi Lengkap Python

\`\`\`python
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# Random Forest dengan OOB Score aktif
rf = RandomForestClassifier(n_estimators=100, max_features='sqrt', oob_score=True, random_state=42)
rf.fit(X_train, y_train)

# Extra Trees
et = ExtraTreesClassifier(n_estimators=100, max_features='sqrt', random_state=42)
et.fit(X_train, y_train)

print("=" * 60)
print("HASIL EVALUASI RANDOM FOREST VS EXTRA TREES")
print("=" * 60)
print(f"Random Forest OOB Score   : {rf.oob_score_:.4f}")
print(f"Random Forest Test ROC-AUC: {roc_auc_score(y_test, rf.predict_proba(X_test)[:, 1]):.4f}")
print(f"Extra Trees Test ROC-AUC  : {roc_auc_score(y_test, et.predict_proba(X_test)[:, 1]):.4f}")
\`\`\`
`
      },
      {
        id: "ml-bab-10-2",
        slug: "boosting-adaboost-gradient-boosting",
        title: "10.2. Boosting: AdaBoost & Gradient Tree Boosting",
        orderIndex: 2,
        description: "Pembobotan sekuensial eksponensial AdaBoost dan optimasi penurunan gradien di ruang fungsi pada Gradient Tree Boosting.",
        content_markdown: `# 10.2. Boosting: AdaBoost & Gradient Tree Boosting

Berbeda dari Bagging yang melatih model secara paralel, **Boosting** melatih pohon keputusan secara berurutan (*sekuensial*), di mana setiap pohon baru berfokus memperbaiki kesalahan yang dibuat oleh pohon-pohon sebelumnya.

---

## 10.2.1. AdaBoost (Adaptive Boosting)
Pada setiap iterasi $m$, bobot sampel $w_i$ diperbarui secara eksponensial: sampel yang salah diklasifikasikan oleh pohon sebelumnya diberi bobot lebih besar, memaksa pohon berikutnya untuk memprioritaskan sampel sulit tersebut:

$$w_i^{(m+1)} = w_i^{(m)} \\exp\\big(\\alpha_m \\mathbb{I}(y_i \\ne G_m(x_i))\\big)$$

---

## 10.2.2. Gradient Tree Boosting (GBM)
Gradient Boosting memandang pelatihan sebagai penurunan gradien (*gradient descent*) dalam ruang fungsi. Pada setiap langkah $m$, pohon baru $h_m(x)$ dilatih untuk memprediksi gradien negatif (*pseudo-residuals*) dari fungsi kerugian:

$$r_{im} = - \\left[ \\frac{\\partial L(y_i, F(x_i))}{\\partial F(x_i)} \\right]_{F = F_{m-1}}$$

Pembaruan model akhir dikontrol oleh faktor penyusutan (*shrinkage / learning rate*) $\\nu$:
$$F_m(x) = F_{m-1}(x) + \\nu \\sum_{j=1}^{J_m} \\gamma_{jm} \\mathbf{1}(x \\in R_{jm})$$

---

## 10.2.3. Implementasi Lengkap Python

\`\`\`python
from sklearn.ensemble import AdaBoostClassifier, GradientBoostingClassifier
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X, y = load_wine(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# AdaBoost
ada = AdaBoostClassifier(n_estimators=50, learning_rate=0.5, random_state=42)
ada.fit(X_train, y_train)

# Gradient Boosting
gb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
gb.fit(X_train, y_train)

print("=" * 60)
print("PERBANDINGAN AKURASI BOOSTING")
print("=" * 60)
print(f"Akurasi AdaBoost Test          : {accuracy_score(y_test, ada.predict(X_test)):.4f}")
print(f"Akurasi Gradient Boosting Test : {accuracy_score(y_test, gb.predict(X_test)):.4f}")
\`\`\`
`
      },
      {
        id: "ml-bab-10-3",
        slug: "hist-gradient-boosting-dan-stacking",
        title: "10.3. Histogram-Based Gradient Boosting & Stacking",
        orderIndex: 3,
        description: "HistGradientBoosting terinspirasi LightGBM dengan 256-bin discretization, dukungan NaN bawaan, konstrain monoton, serta StackingClassifier multi-level.",
        content_markdown: `# 10.3. Histogram-Based Gradient Boosting & Stacking

---

## 10.3.1. Histogram-Based Gradient Boosting (\`HistGradientBoosting\`)
Menghitung pemisahan (*split*) pada nilai kontinu menjadi bottleneck lambat saat data melebihi $10.000$ sampel. \`HistGradientBoosting\` (terinspirasi LightGBM) mengelompokkan nilai fitur kontinu ke dalam 256 bin integer ($1$ byte):
1. **Kecepatan & Memori**: Kecepatan pemisahan node meningkat puluhan kali lipat dengan memori sangat hemat.
2. **Missing Value Support (NaN)**: Menangani nilai hilang secara bawaan tanpa perlu tahapan imputasi sebelumnya.
3. **Fitur Kategorikal**: Mendukung fitur bertipe kategori langsung dengan parameter \`categorical_features\`.
4. **Monotonic Constraints**: Membatasi hubungan monotonik searah pada fitur tertentu demi mematuhi regulasi perbankan/bisnis.

---

## 10.3.2. Stacking & Voting Ensembles
- **VotingClassifier**: Mengagregasikan prediksi dari berbagai algoritma berbeda (misal SVM + RF + Gradient Boosting) menggunakan *soft voting* (rata-rata probabilitas) atau *hard voting* (mayoritas suara).
- **StackingClassifier**: Menggunakan prediksi *out-of-fold* dari beberapa estimator dasar sebagai fitur masukan untuk melatih *meta-learner* akhir (seperti Logistic Regression).

---

## 10.3.3. Implementasi Lengkap Python

\`\`\`python
import numpy as np
from sklearn.ensemble import (
    HistGradientBoostingClassifier,
    StackingClassifier,
    VotingClassifier,
    RandomForestClassifier
)
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

# 1. Dataset dengan missing value buatan
X, y = make_classification(n_samples=2000, n_features=15, random_state=42)
X_missing = X.copy()
X_missing[np.random.rand(*X.shape) < 0.05] = np.nan # 5% data hilang

X_tr, X_te, y_tr, y_te = train_test_split(X_missing, y, test_size=0.25, random_state=42)

# 2. HistGradientBoosting dengan penanganan NaN otomatis
hgb = HistGradientBoostingClassifier(max_iter=100, learning_rate=0.1, random_state=42)
hgb.fit(X_tr, y_tr)
print(f"Akurasi HistGradientBoosting dengan NaN: {hgb.score(X_te, y_te):.4f}")

# 3. Stacking Ensemble pada data bersih
X_clean_tr, X_clean_te, y_c_tr, y_c_te = train_test_split(X, y, test_size=0.25, random_state=42)
stacking = StackingClassifier(
    estimators=[
        ('rf', RandomForestClassifier(n_estimators=50, random_state=42)),
        ('svc', SVC(probability=True, random_state=42)),
        ('hgb', HistGradientBoostingClassifier(random_state=42))
    ],
    final_estimator=LogisticRegression(),
    cv=5
)
stacking.fit(X_clean_tr, y_c_tr)
print(f"Akurasi Stacking Ensemble Meta-Learner: {stacking.score(X_clean_te, y_c_te):.4f}")
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 11: Interpretability Model Machine Learning
  // =========================================================================
  {
    id: "ml-bab-11",
    slug: "bab-11-interpretability-model-machine-learning",
    title: "BAB 11: Interpretability & Inspeksi Model",
    orderIndex: 11,
    description: "Inspeksi model kotak hitam: Seleksi Fitur (Filter, Wrapper, Embedded), Mean Decrease Impurity (MDI) vs Permutation Importance, Partial Dependence Plots (PDP), dan Individual Conditional Expectation (ICE).",
    subsections: [
      {
        id: "ml-bab-11-1",
        slug: "feature-selection-methods",
        title: "11.1. Metode Seleksi Fitur: Filter, Wrapper, & Embedded",
        orderIndex: 1,
        description: "SelectKBest (ANOVA F-test, Mutual Information), Recursive Feature Elimination (RFE/RFECV), dan Seleksi L1 berbasis model.",
        content_markdown: `# 11.1. Metode Seleksi Fitur: Filter, Wrapper, & Embedded

Seleksi fitur (*Feature Selection*) memangkas dimensi input yang redundan, bising (*noisy*), atau tidak informatif, sehingga meningkatkan performa generalisasi, mencegah *overfitting*, dan mempercepat waktu inferensi di sistem produksi.

---

## 11.1.1. Tiga Kategori Utama Seleksi Fitur
1. **Filter Methods**: Mengevaluasi korelasi statistik individual antara masing-masing fitur dan target secara independen dari model:
   - \`f_classif\` / \`f_regression\`: Uji ANOVA F-test untuk dependensi linear.
   - \`mutual_info_classif\` / \`mutual_info_regression\`: Entropi informasi bersama non-parametrik yang mampu menangkap hubungan non-linear kompleks.
2. **Wrapper Methods**: Melatih model prediktif berulang kali untuk mencari kombinasi fitur terbaik:
   - \`RFE\` (*Recursive Feature Elimination*) & \`RFECV\`: Memangkas fitur dengan bobot terkecil secara berulang menggunakan validasi silang otomatis.
3. **Embedded Methods**: Seleksi yang terintegrasi langsung dalam proses optimasi model:
   - \`SelectFromModel\` dengan regularisasi L1 (Lasso / LinearSVC penalti L1) yang memaksa koefisien fitur non-esensial menjadi nol tepat.

---

## 11.1.2. Implementasi Lengkap Python

\`\`\`python
from sklearn.feature_selection import SelectKBest, mutual_info_classif, RFE, SelectFromModel
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_breast_cancer

X, y = load_breast_cancer(return_X_y=True)

# 1. Filter: SelectKBest dengan Mutual Information
selector_kbest = SelectKBest(score_func=mutual_info_classif, k=10)
X_kbest = selector_kbest.fit_transform(X, y)

# 2. Wrapper: Recursive Feature Elimination (RFE)
rfe = RFE(estimator=LogisticRegression(max_iter=1000), n_features_to_select=10)
X_rfe = rfe.fit_transform(X, y)

# 3. Embedded: SelectFromModel berbasis pohon Random Forest
sfm = SelectFromModel(estimator=RandomForestClassifier(n_estimators=50, random_state=42), threshold='median')
X_sfm = sfm.fit_transform(X, y)

print("=" * 60)
print("HASIL METODE SELEKSI FITUR")
print("=" * 60)
print(f"Dimensi Asli             : {X.shape[1]} fitur")
print(f"Dimensi Hasil SelectKBest: {X_kbest.shape[1]} fitur")
print(f"Dimensi Hasil RFE        : {X_rfe.shape[1]} fitur")
print(f"Dimensi Hasil Embedded   : {X_sfm.shape[1]} fitur")
\`\`\`
`
      },
      {
        id: "ml-bab-11-2",
        slug: "feature-importance-mdi-vs-permutation",
        title: "11.2. Mean Decrease Impurity (MDI) vs Permutation Feature Importance",
        orderIndex: 2,
        description: "Kelemahan kritis MDI pada fitur berkardinalitas tinggi dan keunggulan inspeksi Permutation Importance berbasis set uji independen.",
        content_markdown: `# 11.2. Mean Decrease Impurity (MDI) vs Permutation Feature Importance

---

## 11.2.1. Kelemahan MDI (\`feature_importances_\`)
Atribut bawaan pohon \`feature_importances_\` menghitung penurunan total kriteria impurity (Gini / Entropy) yang disumbangkan oleh fitur tersebut:
- **Bias Kardinalitas**: Sangat bias terhadap fitur numerik acak kontinu atau fitur berkardinalitas tinggi (seperti nomor ID unik atau timestamp) meskipun fitur tersebut tidak memiliki korelasi sejati dengan target.
- **Dihitung pada Data Latih**: Dapat melebih-lebihkan signifikansi fitur yang overfit pada noise data latihan.

---

## 11.2.2. Permutation Feature Importance (\`permutation_importance\`)
Permutation Importance mengacak (*shuffle*) nilai pada satu kolom fitur pada set uji validasi secara independen dan mengukur penurunan metrik skor model (seperti akurasi atau ROC-AUC):

$$I(f) = s_{\\text{baseline}} - s_{\\text{permuted}(f)}$$

- Jika skor model anjlok drastis setelah kolom $f$ diacak, fitur tersebut **sangat penting**.
- Jika skor model tidak berubah, fitur tersebut **tidak esensial** atau redundan.

---

## 11.2.3. Implementasi Lengkap Python

\`\`\`python
import numpy as np
from sklearn.inspection import permutation_importance
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split

X, y = load_breast_cancer(return_X_y=True)
feature_names = load_breast_cancer().feature_names

# Tambahkan fitur acak murni berkardinalitas tinggi untuk mendeteksi bias
np.random.seed(42)
random_noise_feature = np.random.randn(X.shape[0], 1)
X_with_noise = np.hstack([X, random_noise_feature])
names_with_noise = list(feature_names) + ['RANDOM_NOISE']

X_train, X_test, y_train, y_test = train_test_split(X_with_noise, y, test_size=0.3, random_state=42)

clf = RandomForestClassifier(random_state=42).fit(X_train, y_train)

# 1. MDI Feature Importance
mdi_importances = clf.feature_importances_

# 2. Permutation Importance pada Test Set Independen
perm_res = permutation_importance(clf, X_test, y_test, n_repeats=10, random_state=42)

print("=" * 60)
print("PERBANDINGAN MDI VS PERMUTATION IMPORTANCE PADA FITUR ACAK")
print("=" * 60)
noise_idx = len(names_with_noise) - 1
print(f"MDI Importance RANDOM_NOISE         : {mdi_importances[noise_idx]:.4f}")
print(f"Permutation Importance RANDOM_NOISE : {perm_res.importances_mean[noise_idx]:.4f} (+/- {perm_res.importances_std[noise_idx]:.4f})")
print("(Perhatikan bagaimana Permutation Importance secara objektif mengenali noise bernilai ~0)")
\`\`\`
`
      },
      {
        id: "ml-bab-11-3",
        slug: "partial-dependence-ice-plots",
        title: "11.3. Partial Dependence (PDP) & Individual Conditional Expectation (ICE)",
        orderIndex: 3,
        description: "Visualisasi efek marjinal fitur terhadap prediksi probabilitas model machine learning menggunakan Display APIs.",
        content_markdown: `# 11.3. Partial Dependence (PDP) & Individual Conditional Expectation (ICE)

**Partial Dependence Plots (PDP)** dan **Individual Conditional Expectation (ICE)** memvisualisasikan bagaimana variasi nilai satu atau dua fitur input secara langsung memengaruhi output prediksi model *black-box*.

---

## 11.3.1. Formulasi Matematis PDP
Fungsi dependensi parsial untuk subset fitur target $x_S$ dihitung dengan merata-ratakan prediksi model terhadap seluruh nilai fitur komplemen $x_C$ dalam dataset:

$$\\hat{f}_S(x_S) = \\frac{1}{n} \\sum_{i=1}^n \\hat{f}(x_S, \\; x_{C}^{(i)})$$

### ICE (Individual Conditional Expectation)
Jika PDP hanya menampilkan rata-rata populasi, kurva **ICE** memplot garis prediksi untuk setiap sampel individual secara terpisah. Ini sangat penting untuk mendeteksi hubungan interaksi heterogen yang tersembunyi (misal efek fitur berlawanan arah antara pria dan wanita).

---

## 11.3.2. Implementasi Lengkap Python

\`\`\`python
from sklearn.inspection import PartialDependenceDisplay
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split

# 1. Dataset Regresi Perumahan California
housing = fetch_california_housing(as_frame=True)
X, y = housing.data, housing.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = HistGradientBoostingRegressor(random_state=42).fit(X_train, y_train)

# 2. Membuat Objek Inspeksi PDP dan ICE
display = PartialDependenceDisplay.from_estimator(
    model,
    X_test,
    features=['MedInc', 'AveOccup', ('MedInc', 'HouseAge')],
    kind='both', # Menampilkan rata-rata PDP dan kurva individual ICE
    subsample=50,
    random_state=42
)

print("=" * 60)
print("INSPEKSI PARTIAL DEPENDENCE BERHASIL")
print("=" * 60)
print(f"R² Score Model Evaluasi: {model.score(X_test, y_test):.4f}")
print("Objek visualisasi PartialDependenceDisplay siap dirender di matplotlib/web interface.")
\`\`\`
`
      }
    ]
  }
];
