import { DocSectionItem } from "@/components/modul/doc-reader-layout";

/**
 * 2. UNSUPERVISED LEARNING (2.1 to 2.8)
 * Materi lengkap Scikit-Learn 1.9 dengan penjelasan teoritis, formulasi matematika,
 * perbandingan algoritma, dan contoh implementasi kode Python.
 */
export const UNSUPERVISED_LEARNING_CHAPTER: DocSectionItem = {
  id: "sec-2-unsupervised-learning",
  slug: "unsupervised-learning",
  title: "2. Unsupervised learning",
  orderIndex: 2,
  description: "Metode pembelajaran tanpa label untuk pengelompokan (clustering), estimasi densitas, reduksi dimensi, dan deteksi anomali.",
  subsections: [
    {
      id: "sec-2-1-gaussian-mixture",
      slug: "gaussian-mixture",
      title: "2.1. Gaussian mixture models",
      orderIndex: 1,
      description: "Model probabilitas campuran terhingga distribusi Gaussian dengan algoritma EM dan inferensi variasional Bayesian.",
      content_markdown: `# 2.1. Gaussian mixture models

A Gaussian mixture model is a probabilistic model that assumes all the data points are generated from a mixture of a finite number of Gaussian distributions with unknown parameters:

$$p(x) = \\sum_{k=1}^K \\pi_k \\mathcal{N}(x | \\mu_k, \\Sigma_k)$$

Where $\\pi_k$ are the mixture weights satisfying $\\sum_{k=1}^K \\pi_k = 1$.

---

## 2.1.1. GaussianMixture
\`GaussianMixture\` implements the Expectation-Maximization (EM) algorithm for fitting mixture-of-Gaussian models:
- **Covariance types** (\`covariance_type\`):
  - \`'full'\`: Setiap komponen memiliki matriks kovarians umum simetris penuh.
  - \`'tied'\`: Semua komponen berbagi satu matriks kovarians yang sama.
  - \`'diag'\`: Setiap komponen memiliki kovarians diagonal (matriks non-korelatif).
  - \`'spherical'\`: Setiap komponen memiliki varians tunggal isotropik.

\`\`\`python
from sklearn.mixture import GaussianMixture
import numpy as np

X = np.array([[1, 2], [1, 4], [1, 0], [10, 2], [10, 4], [10, 0]])
gm = GaussianMixture(n_components=2, random_state=0).fit(X)

print("Pusat kluster (means):\\n", gm.means_)
print("Prediksi kluster sampel baru:", gm.predict([[0, 0], [12, 3]]))
\`\`\`

---

## 2.1.2. Variational Bayesian Gaussian Mixture
\`BayesianGaussianMixture\` menggunakan prior Dirichlet Process untuk mengestimasi model campuran secara Bayesian. Pengguna dapat menentukan batas atas jumlah kluster yang tinggi, dan algoritma akan secara otomatis mengatur bobot $\\pi_k$ komponen yang tidak relevan mendekati nol.
`
    },
    {
      id: "sec-2-2-manifold",
      slug: "manifold",
      title: "2.2. Manifold learning",
      orderIndex: 2,
      description: "Reduksi dimensi non-linear untuk memetakan manifold tersembunyi berdimensi tinggi ke ruang 2D/3D.",
      content_markdown: `# 2.2. Manifold learning

Manifold learning memetakan struktur geometri intrinsik non-linear dataset berdimensi tinggi ke representasi berdimensi rendah tanpa kehilangan topologi lingkungan lokal.

---

## 2.2.1. t-SNE (t-Distributed Stochastic Neighbor Embedding)
\`TSNE\` mengonversi afinitas antar titik data menjadi probabilitas kondisional Gaussian pada ruang dimensi tinggi dan distribusi Student-t pada ruang dimensi rendah:

$$p_{j|i} = \\frac{\\exp(-\\|x_i - x_j\\|^2 / 2\\sigma_i^2)}{\\sum_{k \\ne i} \\exp(-\\|x_i - x_k\\|^2 / 2\\sigma_i^2)}$$

\`\`\`python
from sklearn.manifold import TSNE
from sklearn.datasets import load_digits

digits = load_digits()
X_embedded = TSNE(n_components=2, perplexity=30, random_state=42).fit_transform(digits.data)
print("Dimensi tereduksi t-SNE:", X_embedded.shape)
\`\`\`

---

## 2.2.2. Isomap
\`Isomap\` (Isometric Mapping) mempertahankan jarak geodesik terpendek (*shortest path geodesic distance*) pada graf tetangga alih-alih jarak Euclidean lurus.

---

## 2.2.3. Locally Linear Embedding (LLE)
\`LocallyLinearEmbedding\` mempertahankan rekonstruksi koordinat linear setiap titik data terhadap lingkungan tetangga terdekatnya.
`
    },
    {
      id: "sec-2-3-clustering",
      slug: "clustering",
      title: "2.3. Clustering",
      orderIndex: 3,
      description: "Partisi data tak berlabel ke dalam kelompok homogen (K-Means, DBSCAN, HDBSCAN, Hierarchical, Spectral).",
      content_markdown: `# 2.3. Clustering

Pengelompokan data tanpa label target menggunakan modul \`sklearn.cluster\`.

---

## 2.3.1. K-Means
Meminimalkan inersia (*within-cluster sum of squares*):

$$\\min_S \\sum_{i=1}^k \\sum_{x \\in S_i} \\|x - \\mu_i\\|^2$$

\`\`\`python
from sklearn.cluster import KMeans
import numpy as np

X = np.array([[1, 2], [1, 4], [1, 0], [10, 2], [10, 4], [10, 0]])
kmeans = KMeans(n_clusters=2, init='k-means++', random_state=0).fit(X)

print("Label kluster:", kmeans.labels_)
print("Pusat kluster (Centroids):\\n", kmeans.cluster_centers_)
print("Inersia:", kmeans.inertia_)
\`\`\`

---

## 2.3.2. MiniBatchKMeans
Varian K-Means yang memproses sampel dalam batch acak kecil (*minibatches*) sehingga mampu memproses jutaan sampel dengan waktu eksekusi linear dan memori konstan.

---

## 2.3.3. DBSCAN & HDBSCAN
- **DBSCAN** (\`DBSCAN\`): Menemukan kluster berkerapatan tinggi dengan bentuk arbitrer dan menandai data pencilan sebagai derau (*noise*, label -1). Parameter utama: \`eps\` (jarak radius) dan \`min_samples\` (jumlah tetangga minimum).
- **HDBSCAN** (\`HDBSCAN\`): Mengubah DBSCAN menjadi pengelompokan hierarkis yang dapat mendeteksi kluster dengan kepadatan yang bervariasi.

---

## 2.3.4. Agglomerative (Hierarchical) Clustering
Pengelompokan hierarkis *bottom-up* di mana setiap data awalnya merupakan satu kluster mandiri dan secara bertahap digabungkan berdasarkan kriteria *linkage*:
- \`linkage='ward'\`: Meminimalkan penambahan varians dalam kluster.
- \`linkage='complete'\`: Jarak maksimum antar observasi pasangan kluster.
- \`linkage='average'\`: Rata-rata jarak antar seluruh pasangan observasi.

---

## 2.3.5. Evaluasi Kualitas Clustering
- **Silhouette Score** (\`silhouette_score\`): Mengukur kerapatan dalam kluster dibanding pemisahan terhadap kluster tetangga terdekat (skor $[-1, 1]$, semakin mendekati 1 semakin baik).
- **Davies-Bouldin Index** (\`davies_bouldin_score\`): Rasio kesamaan antar kluster (skor lebih rendah lebih baik).
- **Calinski-Harabasz Index** (\`calinski_harabasz_score\`): Rasio dispersi antar kluster dan dalam kluster.
`
    },
    {
      id: "sec-2-4-biclustering",
      slug: "biclustering",
      title: "2.4. Biclustering",
      orderIndex: 4,
      description: "Pengelompokan simultan pada baris dan kolom matriks data (Spectral Co-Clustering & Biclustering).",
      content_markdown: `# 2.4. Biclustering

Biclustering algorithms simultaneously cluster rows and columns of a data matrix:
- \`SpectralCoclustering\`: Mencari submatriks berbentuk blok diagonal.
- \`SpectralBiclustering\`: Mengasumsikan matriks data memiliki struktur checkerboard tersembunyi.
`
    },
    {
      id: "sec-2-5-decomposition",
      slug: "decomposition",
      title: "2.5. Decomposing signals in components",
      orderIndex: 5,
      description: "Faktorisasi matriks untuk ekstraksi fitur dan reduksi dimensi (PCA, FastICA, NMF, TruncatedSVD).",
      content_markdown: `# 2.5. Decomposing signals in components

Dekomposisi matriks merepresentasikan matriks data $X$ sebagai perkalian dua matriks berperingkat lebih rendah $X \\approx W H$.

---

## 2.5.1. Principal Component Analysis (PCA)
PCA memproyeksikan data ke arah ortogonal varians maksimal menggunakan Singular Value Decomposition (SVD):

\`\`\`python
from sklearn.decomposition import PCA
import numpy as np

X = np.array([[-1, -1], [-2, -1], [-3, -2], [1, 1], [2, 1], [3, 2]])
pca = PCA(n_components=2)
pca.fit(X)

print("Explained variance ratio:", pca.explained_variance_ratio_)
print("Singular values:", pca.singular_values_)
\`\`\`

---

## 2.5.2. Varian PCA Lainnya:
- \`IncrementalPCA\` (IPCA): Menghitung komponen utama secara bertahap untuk data yang tidak muat di memori RAM.
- \`KernelPCA\`: Menerapkan kernel trick untuk proyeksi non-linear (RBF, Polinomial).
- \`TruncatedSVD\` (LSA): Melakukan dekomposisi nilai singular terpotong pada matriks jarang (*sparse matrices* frekuensi tf-idf teks).
- \`FastICA\`: Memisahkan sumber sinyal campuran non-Gaussian independen (Independent Component Analysis).
- \`NMF\`: Faktorisasi matriks non-negatif di mana $W \\ge 0$ dan $H \\ge 0$, sangat interpretatif untuk topik dokumen atau ekstraksi bagian citra.
`
    },
    {
      id: "sec-2-6-covariance",
      slug: "covariance",
      title: "2.6. Covariance estimation",
      orderIndex: 6,
      description: "Estimasi matriks kovarians yang stabil dan robust terhadap outliers (Ledoit-Wolf, MinCovDet).",
      content_markdown: `# 2.6. Covariance estimation

Estimasi matriks kovarians untuk data multivariat:
- \`EmpiricalCovariance\`: Estimator *Maximum Likelihood* standar $\\frac{1}{n} (X - \\mu)^T (X - \\mu)$.
- \`LedoitWolf\`: Menerapkan penyusutan terbobot optimal terhadap matriks kovarians target untuk data berdimensi tinggi ($p > n$).
- \`MinCovDet\` (Minimum Covariance Determinant): Estimator kovarians yang sangat robust terhadap kontaminasi outliers (sampai 50% data tercemar).
`
    },
    {
      id: "sec-2-7-outlier-detection",
      slug: "outlier-detection",
      title: "2.7. Novelty and Outlier Detection",
      orderIndex: 7,
      description: "Identifikasi anomali, observasi baru, dan pencilan data menggunakan Isolation Forest dan One-Class SVM.",
      content_markdown: `# 2.7. Novelty and Outlier Detection

Mendeteksi apakah suatu observasi merupakan data normal (*inlier*) atau pencilan asing (*outlier*).

---

## 2.7.1. Isolation Forest
\`IsolationForest\` mengisolasi anomali dengan partisi acak menggunakan pohon keputusan. Titik anomali membutuhkan jauh lebih sedikit partisi untuk terisolasi dibanding titik normal:

\`\`\`python
from sklearn.ensemble import IsolationForest

X = [[-1.1], [0.3], [0.5], [100.0]]
clf = IsolationForest(random_state=0).fit(X)
print("Prediksi inlier (1) vs outlier (-1):", clf.predict(X))
# Output: [ 1  1  1 -1]
\`\`\`

---

## 2.7.2. One-Class SVM & Local Outlier Factor
- \`OneClassSVM\`: Memodelkan batas dukungan probabilistik data normal pada ruang berdimensi tinggi dengan kernel RBF.
- \`LocalOutlierFactor\` (LOF): Menghitung kerapatan lokal observasi terhadap $k$-tetangga terdekatnya.
`
    },
    {
      id: "sec-2-8-density",
      slug: "density",
      title: "2.8. Density Estimation",
      orderIndex: 8,
      description: "Estimasi fungsi kepadatan probabilitas kontinu non-parametrik dengan Kernel Density Estimation.",
      content_markdown: `# 2.8. Density Estimation

\`KernelDensity\` mengestimasi fungsi kepadatan probabilitas (PDF) kontinu dari sekumpulan sampel diskrit:

$$\\hat{f}_h(x) = \\frac{1}{n h^d} \\sum_{i=1}^n K\\left(\\frac{x - x_i}{h}\\right)$$

Parameter penting:
- \`bandwidth\` ($h$): Lebar jendela kernel yang mengontrol kehalusan kurva kepadatan.
- \`kernel\`: \`'gaussian'\`, \`'tophat'\`, \`'epanechnikov'\`, \`'exponential'\`.

\`\`\`python
from sklearn.neighbors import KernelDensity
import numpy as np

X = np.array([[-1], [-2], [1], [2], [3]])
kde = KernelDensity(kernel='gaussian', bandwidth=0.5).fit(X)
log_dens = kde.score_samples([[0], [1.5]])
print("Log densitas probabilitas:", log_dens)
\`\`\`
`
    }
  ]
};
