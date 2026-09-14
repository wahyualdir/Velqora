import { DocSectionItem } from "@/components/modul/doc-reader-layout";

/**
 * BAB 7 - 11 KURIKULUM MACHINE LEARNING VELQORA
 * Mengintegrasikan algoritma tanpa pengawasan, pembelajaran daring, metrik evaluasi,
 * metode ansambel, dan interpretabilitas dari Scikit-Learn 1.9.
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
    description: "K-Means & MiniBatch, DBSCAN & HDBSCAN, Hierarchical Clustering (Ward), Gaussian Mixture Model (GMM), reduksi dimensi (PCA, TruncatedSVD, t-SNE), serta deteksi anomali (Isolation Forest).",
    subsections: [
      {
        id: "ml-bab-7-1",
        slug: "clustering-kmeans-minibatch",
        title: "7.1. K-Means Clustering & Mini-Batch K-Means",
        orderIndex: 1,
        description: "Algoritma partisi berbasis centroid, inisialisasi k-means++, dan optimasi MiniBatchKMeans untuk dataset skala besar.",
        content_markdown: `# 7.1. K-Means Clustering & Mini-Batch K-Means

Algoritma **K-Means** mengelompokkan $n$ sampel data menjadi $k$ kelompok disjoint $C = \\{C_1, C_2, \\dots, C_k\\}$, di mana masing-masing kluster dideskripsikan oleh titik pusat rata-rata $\\mu_j$ (*centroid*).

---

## 7.1.1. Formulasi Matematis Inersia
Tujuan K-Means adalah meminimalkan kriteria **Inersia** (jumlah kuadrat jarak dalam kluster / *Within-Cluster Sum of Squares*):

$$\\sum_{i=0}^{n} \\min_{\\mu_j \\in C} (\\|x_i - \\mu_j\\|^2)$$

Algoritma Lloyd berjalan secara iteratif:
1. **Assignment Step**: Setiap sampel $x_i$ diasosiasikan ke centroid terdekat:
   $$c^{(i)} = \\arg\\min_j \\|x_i - \\mu_j\\|^2$$
2. **Update Step**: Menghitung ulang posisi centroid sebagai nilai rata-rata sampel dalam kluster:
   $$\\mu_j = \\frac{1}{|C_j|} \\sum_{i \\in C_j} x_i$$

### Inisialisasi Cerdas (k-means++)
Inisialisasi acak sering terjebak dalam minimum lokal suboptimal. Scikit-Learn menggunakan default \`init='k-means++'\`, yang memilih titik awal dengan probabilitas sebanding dengan kuadrat jarak ke centroid yang sudah dipilih sebelumnya:

$$P(x) = \\frac{D(x)^2}{\\sum_{x' \\in X} D(x')^2}$$

---

## 7.1.2. Mini-Batch K-Means
Untuk dataset jutaan baris yang tidak muat dalam memori RAM, \`MiniBatchKMeans\` melakukan pembaruan centroid menggunakan sub-sampel acak (*mini-batches*), menghasilkan kecepatan komputasi berkali lipat lebih cepat dengan kualitas konvergensi yang sebanding.

\`\`\`python
from sklearn.cluster import KMeans, MiniBatchKMeans
from sklearn.datasets import make_blobs
from sklearn.metrics import silhouette_score
import numpy as np

# 1. Generate dataset sintetis 3 kluster
X, y_true = make_blobs(n_samples=1500, centers=3, cluster_std=0.60, random_state=42)

# 2. Inisialisasi K-Means dengan k-means++
kmeans = KMeans(n_clusters=3, init='k-means++', n_init=10, random_state=42)
y_kmeans = kmeans.fit_predict(X)

# 3. Evaluasi Kualitas Kluster: Inersia & Koefisien Silhouette
print(f"Inersia (WCSS): {kmeans.inertia_:.2f}")
print(f"Silhouette Score: {silhouette_score(X, y_kmeans):.4f}")
print("Pusat Centroid:\n", kmeans.cluster_centers_)

# 4. MiniBatch K-Means untuk skala besar
mbk = MiniBatchKMeans(n_clusters=3, batch_size=256, random_state=42)
mbk.fit(X)
print("MiniBatch Inersia:", mbk.inertia_)
\`\`\`
`
      },
      {
        id: "ml-bab-7-2",
        slug: "density-based-dbscan-hdbscan",
        title: "7.2. Density-Based Clustering: DBSCAN & HDBSCAN",
        orderIndex: 2,
        description: "Pengelompokan berbasis kepadatan spasial, pemisahan noise/outlier otomatis, dan kluster bentuk arbitrer.",
        content_markdown: `# 7.2. Density-Based Clustering: DBSCAN & HDBSCAN

K-Means mengasumsikan kluster berbentuk cembung (*convex* / bulat). Ketika data memiliki bentuk melengkung, spiral, atau memiliki derau tinggi, **DBSCAN** (*Density-Based Spatial Clustering of Applications with Noise*) adalah solusi ideal.

---

## 7.2.1. Konsep Inti DBSCAN
DBSCAN mendefinisikan kluster sebagai area berdensitas tinggi yang dipisahkan oleh area berdensitas rendah:
- **$\\epsilon$ (eps)**: Jari-jari tetangga maksimum di sekitar titik.
- **MinPts (min_samples)**: Jumlah minimum titik yang diperlukan dalam radius $\\epsilon$ untuk membentuk *core point*.
- **Core Point**: Titik yang memiliki $\\ge \\text{min\\_samples}$ dalam radius $\\epsilon$.
- **Border Point**: Titik dalam jarak $\\epsilon$ dari core point, namun memiliki kurang dari min_samples.
- **Noise**: Titik yang bukan core point dan bukan border point (diberi label \`-1\` di Scikit-Learn).

---

## 7.2.2. Implementasi Scikit-Learn

\`\`\`python
from sklearn.cluster import DBSCAN
from sklearn.datasets import make_moons
from sklearn.preprocessing import StandardScaler
import numpy as np

# Dataset dua bulan sabit non-linear
X, _ = make_moons(n_samples=400, noise=0.08, random_state=42)
X = StandardScaler().fit_transform(X)

# DBSCAN dengan eps=0.3 dan min_samples=5
db = DBSCAN(eps=0.3, min_samples=5)
labels = db.fit_predict(X)

n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
n_noise = list(labels).count(-1)

print(f"Jumlah kluster terdeteksi: {n_clusters}")
print(f"Jumlah sampel noise/outlier: {n_noise}")
\`\`\`
`
      },
      {
        id: "ml-bab-7-3",
        slug: "hierarchical-and-gmm",
        title: "7.3. Hierarchical Agglomerative & Gaussian Mixture Models (GMM)",
        orderIndex: 3,
        description: "Clustering hierarkis dendrogram dengan Ward linkage dan pemodelan probabilistik soft-clustering menggunakan EM algorithm.",
        content_markdown: `# 7.3. Hierarchical Agglomerative & Gaussian Mixture Models (GMM)

---

## 7.3.1. Agglomerative Hierarchical Clustering
Pendekatan *bottom-up* di mana setiap sampel dimulai sebagai klusternya sendiri, lalu pasangan kluster digabungkan secara bertahap berdasarkan kriteria linkage:
- \`linkage='ward'\`: Meminimalkan penambahan total varians dalam kluster saat digabungkan.
- \`linkage='complete'\`: Jarak maksimum antar observasi di dua kluster.
- \`linkage='average'\`: Jarak rata-rata antar observasi.

\`\`\`python
from sklearn.cluster import AgglomerativeClustering
from sklearn.datasets import load_iris

X, _ = load_iris(return_X_y=True)
agg = AgglomerativeClustering(n_clusters=3, linkage='ward')
pred_labels = agg.fit_predict(X)
print("Distribusi kluster Agglomerative:", dict(zip(*np.unique(pred_labels, return_counts=True))))
\`\`\`

---

## 7.3.2. Gaussian Mixture Models (GMM)
GMM mengasumsikan data dihasilkan dari gabungan $K$ distribusi Gaussian multivariat dengan parameter bobot $\\pi_k$, rata-rata $\\mu_k$, dan kovarians $\\Sigma_k$:

$$P(x) = \\sum_{k=1}^{K} \\pi_k \\mathcal{N}(x \\mid \\mu_k, \\Sigma_k)$$

GMM menghasilkan *soft assignment* (probabilitas setiap sampel menjadi anggota kluster tertentu):

\`\`\`python
from sklearn.mixture import GaussianMixture
import numpy as np

gmm = GaussianMixture(n_components=3, covariance_type='full', random_state=42)
gmm.fit(X)

# Prediksi probabilitas keanggotaan kluster (Soft Clustering)
probs = gmm.predict_proba(X[:3])
print("Probabilitas keanggotaan 3 sampel pertama:\n", np.round(probs, 4))
\`\`\`
`
      },
      {
        id: "ml-bab-7-4",
        slug: "reduksi-dimensi-pca-tsne",
        title: "7.4. Reduksi Dimensi: PCA, TruncatedSVD, & Manifold Learning (t-SNE)",
        orderIndex: 4,
        description: "Proyeksi linear ortogonal Principal Component Analysis (PCA) dan visualisasi non-linear berdimensi tinggi.",
        content_markdown: `# 7.4. Reduksi Dimensi: PCA, TruncatedSVD, & Manifold Learning (t-SNE)

Reduksi dimensi mengatasi *Curse of Dimensionality*, mengurangi konsumsi memori komputasi, serta memungkinkan visualisasi data multi-dimensi.

---

## 7.4.1. Principal Component Analysis (PCA)
PCA memproyeksikan data ke arah komponen utama ortogonal yang memaksimalkan varians data:

$$\\max_{w} \\text{Var}(Xw) \\quad \\text{s.t.} \\quad \\|w\\|=1$$

Solusi analitis didapatkan dari Singular Value Decomposition (SVD):
$$X = U \\Sigma V^T$$

\`\`\`python
from sklearn.decomposition import PCA
from sklearn.datasets import load_digits
import numpy as np

# Load 64-dimensi gambar angka tulisan tangan (8x8 pixel)
digits = load_digits()
X = digits.data

# Reduksi ke 2 dimensi untuk visualisasi
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

print(f"Bentuk awal: {X.shape} -> Bentuk PCA: {X_pca.shape}")
print(f"Rasio varians terjelaskan (2 komponen): {pca.explained_variance_ratio_}")
print(f"Total varians dipertahankan: {np.sum(pca.explained_variance_ratio_)*100:.2f}%")
\`\`\`

---

## 7.4.2. t-SNE (t-Distributed Stochastic Neighbor Embedding)
Metode manifold learning non-linear yang sangat efektif mempertahankan struktur lokal untuk visualisasi cluster dalam 2D/3D:

\`\`\`python
from sklearn.manifold import TSNE

tsne = TSNE(n_components=2, perplexity=30, random_state=42)
X_tsne = tsne.fit_transform(X[:500])
print("Visualisasi t-SNE 2D shape:", X_tsne.shape)
\`\`\`
`
      },
      {
        id: "ml-bab-7-5",
        slug: "deteksi-anomali-isolation-forest",
        title: "7.5. Deteksi Anomali & Outlier: Isolation Forest & One-Class SVM",
        orderIndex: 5,
        description: "Mendeteksi pencilan tanpa data berlabel dengan mengisolasi anomali pada pohon acak.",
        content_markdown: `# 7.5. Deteksi Anomali & Outlier: Isolation Forest & One-Class SVM

Deteksi anomali bertujuan menemukan observasi langka yang menyimpang secara drastis dari pola populasi normal (misal kecurangan kartu kredit, serangan siber, atau kerusakan mesin).

---

## 7.5.1. Isolation Forest (\`IsolationForest\`)
Anomali cenderung "sedikit dan berbeda". Isolation Forest mengisolasi observasi dengan memilih fitur secara acak dan membagi nilai secara acak. Karena anomali berada di pinggiran ruang fitur, jalur partisi pohon untuk mengisolasinya jauh lebih pendek daripada sampel normal.

Skor anomali dihitung berdasarkan rata-rata kedalaman pemisahan $h(x)$:
$$s(x, n) = 2^{-\\frac{E(h(x))}{c(n)}}$$

\`\`\`python
from sklearn.ensemble import IsolationForest
import numpy as np

# Generate data inlier reguler
rng = np.random.RandomState(42)
X_train = 0.3 * rng.randn(200, 2)
# Tambahkan outlier buatan
X_outliers = rng.uniform(low=-4, high=4, size=(20, 2))
X_all = np.vstack([X_train, X_outliers])

# Latih Isolation Forest
iso = IsolationForest(contamination=0.1, random_state=42)
preds = iso.fit_predict(X_all) # 1: inlier normal, -1: outlier anomali

print(f"Jumlah outlier terdeteksi: {np.sum(preds == -1)}")
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
    description: "Streaming learning dengan metode partial_fit(), penanganan Big Data out-of-core, Passive-Aggressive algorithms, dan mitigasi catastrophic forgetting.",
    subsections: [
      {
        id: "ml-bab-8-1",
        slug: "streaming-partial-fit-sgd",
        title: "8.1. Pembelajaran Daring (Online Learning) dengan partial_fit()",
        orderIndex: 1,
        description: "Melatih model secara bertahap saat data baru tiba secara streaming tanpa perlu melatih ulang dari awal.",
        content_markdown: `# 8.1. Pembelajaran Daring (Online Learning) dengan partial_fit()

Dalam skenario streaming kontinu (seperti data transaksi pasar modal, log server, atau IoT sensor), volume data tidak terbatas dan memori sistem terbatas. 

Scikit-Learn menyediakan metode \`partial_fit()\` pada estimator linear seperti:
- \`SGDClassifier\` / \`SGDRegressor\`
- \`PassiveAggressiveClassifier\` / \`PassiveAggressiveRegressor\`
- \`Perceptron\`
- \`MultinomialNB\`

---

## 8.1.1. Aturan Penggunaan \`partial_fit\`
Pada panggilan pertama \`partial_fit\`, parameter \`classes\` wajib diberikan agar estimator mengetahui daftar label kelas global:

\`\`\`python
from sklearn.linear_model import SGDClassifier
import numpy as np

# Inisialisasi classifier linear dengan loss logistik
clf = SGDClassifier(loss='log_loss', penalty='l2', alpha=1e-4, random_state=42)
classes = np.array([0, 1])

# Simulasi Streaming Stream Batch 1
X_stream_1 = np.array([[1.0, 1.2], [0.8, 0.9], [-1.0, -0.8], [-1.2, -1.1]])
y_stream_1 = np.array([1, 1, 0, 0])
clf.partial_fit(X_stream_1, y_stream_1, classes=classes)

# Stream Batch 2 tiba 5 detik kemudian
X_stream_2 = np.array([[2.0, 2.1], [-1.5, -1.3]])
y_stream_2 = np.array([1, 0])
clf.partial_fit(X_stream_2, y_stream_2)

print("Bobot model yang terus beradaptasi:", clf.coef_)
print("Prediksi data streaming baru:", clf.predict([[1.5, 1.7]]))
\`\`\`
`
      },
      {
        id: "ml-bab-8-2",
        slug: "out-of-core-classification-big-data",
        title: "8.2. Out-of-Core Processing: Melatih Model pada Dataset yang Melebihi RAM",
        orderIndex: 2,
        description: "Kombinasi HashingVectorizer tanpa kamus memori dan SGDClassifier untuk membaca file chunk demi chunk.",
        content_markdown: `# 8.2. Out-of-Core Processing: Melatih Model pada Dataset yang Melebihi RAM

Ketika ukuran dataset mencapai puluhan Gigabyte atau Terabyte dan tidak muat dalam memori RAM, kita menggunakan arsitektur **Out-of-Core**:
1. Mengalirkan data dalam batch kecil (*generator/chunks*).
2. Transformasi fitur stateless (misalnya \`HashingVectorizer\` yang tidak menyimpan dictionary kata di memori).
3. Melatih model menggunakan \`partial_fit()\`.

\`\`\`python
from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.linear_model import SGDClassifier

# HashingVectorizer stateless dengan 2^18 fitur
vectorizer = HashingVectorizer(n_features=2**18, alternate_sign=False)
clf = SGDClassifier(loss='hinge', penalty='l2', random_state=42)
classes = [0, 1]

# Generator simulasi pembacaan chunk data besar
def text_stream_generator():
    chunks = [
        (["Saya suka kursus machine learning ini", "Materi sangat buruk"], [1, 0]),
        (["Buku panduan sangat bagus dan lengkap", "Kecewa dengan kualitas"], [1, 0])
    ]
    for texts, labels in chunks:
        yield texts, labels

for text_batch, label_batch in text_stream_generator():
    X_batch = vectorizer.transform(text_batch)
    clf.partial_fit(X_batch, label_batch, classes=classes)

test_eval = vectorizer.transform(["Materi machine learning sangat luar biasa"])
print("Prediksi Out-of-Core (1: Positif, 0: Negatif):", clf.predict(test_eval)[0])
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 9: Evaluasi & Validasi Model
  // =========================================================================
  {
    id: "ml-bab-9",
    slug: "bab-9-evaluasi-validasi-model",
    title: "BAB 9: Evaluasi & Validasi Model",
    orderIndex: 9,
    description: "Metrik regresi & klasifikasi, kurva ROC-AUC & Precision-Recall, kalibrasi probabilitas (CalibratedClassifierCV), serta kurva pembelajaran dan validasi.",
    subsections: [
      {
        id: "ml-bab-9-1",
        slug: "metrik-klasifikasi-roc-pr",
        title: "9.1. Metrik Klasifikasi, Kurva ROC, & Precision-Recall",
        orderIndex: 1,
        description: "Confusion matrix, Precision, Recall, F1-Score, Macro/Micro averaging, ROC-AUC, dan PR-AUC.",
        content_markdown: `# 9.1. Metrik Klasifikasi, Kurva ROC, & Precision-Recall

Dalam klasifikasi, akurasi sederhana seringkali menyesatkan ketika distribusi kelas tidak seimbang (*class imbalance*).

---

## 9.1.1. Matriks Kebingungan (Confusion Matrix)
| | Prediksi Negatif | Prediksi Positif |
|---|---|---|
| **Aktual Negatif** | Benar Negatif ($TN$) | Salah Positif ($FP$) - Tipe I |
| **Aktual Positif** | Salah Negatif ($FN$) - Tipe II | Benar Positif ($TP$) |

### Metrik Turunan:
- **Precision**: Seberapa akurat model ketika memprediksi positif:
  $$\\text{Precision} = \\frac{TP}{TP + FP}$$
- **Recall (Sensitivitas)**: Proporsi sampel positif aktual yang berhasil ditangkap:
  $$\\text{Recall} = \\frac{TP}{TP + FN}$$
- **F1-Score**: Rata-rata harmonik antara presisi dan recall:
  $$F_1 = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}$$

---

## 9.1.2. ROC-AUC vs PR-AUC
- **ROC (Receiver Operating Characteristic)**: Memetakan *True Positive Rate* ($TPR$) vs *False Positive Rate* ($FPR$) di berbagai ambang batas (*threshold*).
- **PR-AUC (Precision-Recall AUC)**: Lebih informatif daripada ROC saat menghadapi kasus kelas minoritas ekstrem (seperti fraud detection).

\`\`\`python
from sklearn.metrics import classification_report, roc_auc_score, average_precision_score, confusion_matrix
import numpy as np

y_true = np.array([0, 0, 1, 1, 0, 1, 0, 1, 1, 0])
y_prob = np.array([0.1, 0.2, 0.85, 0.9, 0.35, 0.4, 0.15, 0.8, 0.95, 0.05])
y_pred = (y_prob >= 0.5).astype(int)

print("Confusion Matrix:\n", confusion_matrix(y_true, y_pred))
print("\nClassification Report:\n", classification_report(y_true, y_pred))
print(f"ROC-AUC Score: {roc_auc_score(y_true, y_prob):.4f}")
print(f"PR-AUC (Average Precision): {average_precision_score(y_true, y_prob):.4f}")
\`\`\`
`
      },
      {
        id: "ml-bab-9-2",
        slug: "metrik-regresi-dan-residual",
        title: "9.2. Metrik Regresi & Analisis Residual",
        orderIndex: 2,
        description: "MAE, MSE, RMSE, R² Score, Mean Absolute Percentage Error (MAPE), dan evaluasi residual.",
        content_markdown: `# 9.2. Metrik Regresi & Analisis Residual

---

## 9.2.1. Formulasi Matematis Metrik Regresi
Misalkan $y_i$ adalah nilai target sebenarnya dan $\\hat{y}_i$ adalah nilai prediksi untuk sampel ke-$i$:

- **Mean Squared Error (MSE)**: Sangat menghukum kesalahan bernilai besar:
  $$\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2$$
- **Mean Absolute Error (MAE)**: Lebih robust terhadap pencilan (*outliers*):
  $$\\text{MAE} = \\frac{1}{n} \\sum_{i=1}^{n} |y_i - \\hat{y}_i|$$
- **Koefisien Determinasi ($R^2$)**: Proporsi varians target yang dapat dijelaskan oleh model fitur:
  $$R^2 = 1 - \\frac{\\sum_{i=1}^n (y_i - \\hat{y}_i)^2}{\\sum_{i=1}^n (y_i - \\bar{y})^2}$$

\`\`\`python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np

y_actual = np.array([100.0, 150.0, 200.0, 250.0])
y_predicted = np.array([105.0, 142.0, 215.0, 240.0])

mse = mean_squared_error(y_actual, y_predicted)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_actual, y_predicted)
r2 = r2_score(y_actual, y_predicted)

print(f"MAE: {mae:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"R² Score: {r2:.4f}")
\`\`\`
`
      },
      {
        id: "ml-bab-9-3",
        slug: "kalibrasi-probabilitas",
        title: "9.3. Kalibrasi Probabilitas: CalibratedClassifierCV",
        orderIndex: 3,
        description: "Memastikan probabilitas keluaran model (misal SVM atau Naive Bayes) mencerminkan frekuensi empiris sesungguhnya.",
        content_markdown: `# 9.3. Kalibrasi Probabilitas: CalibratedClassifierCV

Banyak estimator klasifikasi (seperti \`SVC\`, \`LinearSVC\`, atau \`GaussianNB\`) menghasilkan skor prediksi yang tidak terkalibrasi dengan baik sebagai probabilitas sejati. Ketika model mengatakan suatu peristiwa memiliki probabilitas 80%, dalam kenyataannya hanya 60% yang benar-benar terjadi.

---

## 9.3.1. Metode Kalibrasi
Scikit-Learn menyediakan dua teknik regresi kalibrasi melalui \`CalibratedClassifierCV\`:
- **Sigmoid (Platt Scaling)**: Cocok untuk dataset kecil, memetakan skor ke fungsi logistik:
  $$P(y=1 \\mid f) = \\frac{1}{1 + \\exp(A f + B)}$$
- **Isotonic Regression**: Metode non-parametrik yang cocok jika data validasi cukup besar.

\`\`\`python
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=1000, random_state=42)

# LinearSVC tidak memiliki predict_proba bawaan
base_svc = LinearSVC(random_state=42)

# Kalibrasi probabilitas menggunakan Platt Scaling (sigmoid)
calibrated_svc = CalibratedClassifierCV(estimator=base_svc, method='sigmoid', cv=5)
calibrated_svc.fit(X, y)

# Sekarang dapat menghasilkan probabilitas terkalibrasi yang valid
probs = calibrated_svc.predict_proba(X[:3])
print("Probabilitas Terkalibrasi [Kelas 0, Kelas 1]:\n", probs)
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 10: Ensemble Learning
  // =========================================================================
  {
    id: "ml-bab-10",
    slug: "bab-10-ensemble-learning",
    title: "BAB 10: Ensemble Learning",
    orderIndex: 10,
    description: "Bagging (Random Forest, Extra Trees), Boosting (AdaBoost, Gradient Boosting, HistGradientBoosting), serta Stacking dan Voting Ensembles.",
    subsections: [
      {
        id: "ml-bab-10-1",
        slug: "bagging-random-forests-extratrees",
        title: "10.1. Bagging & Random Forests & Extra Trees",
        orderIndex: 1,
        description: "Bootstrap aggregating, penurunan varians, out-of-bag (OOB) error, dan Extremely Randomized Trees.",
        content_markdown: `# 10.1. Bagging & Random Forests & Extra Trees

Metode **Bagging** (*Bootstrap Aggregating*) melatih beberapa estimator dasar secara paralel pada sampel acak dengan pengembalian (*bootstrap sample*). Hasil prediksi diagregasikan melalui rata-rata (regresi) atau voting mayoritas (klasifikasi).

---

## 10.1.1. Random Forest (\`RandomForestClassifier\` / \`RandomForestRegressor\`)
Random Forest menambahkan lapisan keacakan ekstra: saat membagi suatu node pohon, hanya subset acak berukuran \`max_features\` dari total fitur yang dipertimbangkan (biasanya $\\sqrt{p}$ untuk klasifikasi).

### Out-of-Bag (OOB) Score
Sekitar $1 - 1/e \\approx 36.8\\%$ data tidak terpilih dalam setiap sampel bootstrap. Data yang tersisa ini berfungsi sebagai set validasi gratis (*Out-of-Bag*) tanpa memerlukan cross-validation terpisah:

\`\`\`python
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier
from sklearn.datasets import load_breast_cancer

X, y = load_breast_cancer(return_X_y=True)

# Random Forest dengan oob_score=True
rf = RandomForestClassifier(n_estimators=100, oob_score=True, random_state=42)
rf.fit(X, y)
print(f"OOB Accuracy Score: {rf.oob_score_:.4f}")

# ExtraTrees (Extremely Randomized Trees)
et = ExtraTreesClassifier(n_estimators=100, random_state=42)
et.fit(X, y)
print("ExtraTrees Model Fit Selesai.")
\`\`\`
`
      },
      {
        id: "ml-bab-10-2",
        slug: "boosting-adaboost-gradient-boosting",
        title: "10.2. Boosting: AdaBoost & Gradient Tree Boosting",
        orderIndex: 2,
        description: "Prinsip penambahan model sekuensial untuk mengoreksi residual kesalahan model sebelumnya.",
        content_markdown: `# 10.2. Boosting: AdaBoost & Gradient Tree Boosting

Berbeda dari Bagging yang melatih model secara independen dan paralel, **Boosting** melatih pohon keputusan secara berurutan (*sekuensial*), di mana setiap pohon baru berfokus memperbaiki kesalahan yang dibuat oleh pohon-pohon sebelumnya.

---

## 10.2.1. Gradient Tree Boosting
Gradient Boosting memandang pelatihan sebagai penurunan gradien (*gradient descent*) dalam ruang fungsi. Pada setiap langkah $m$, pohon baru $h_m(x)$ dilatih untuk memprediksi gradien negatif dari fungsi kerugian $L(y, F(x))$:

$$r_{im} = - \\left[ \\frac{\\partial L(y_i, F(x_i))}{\\partial F(x_i)} \\right]_{F(x) = F_{m-1}(x)}$$

Pembaruan ansambel dikendalikan oleh laju pembelajaran (*shrinkage*) $\\nu$:
$$F_m(x) = F_{m-1}(x) + \\nu \\sum_{j=1}^{J_m} \\gamma_{jm} \\mathbf{1}(x \\in R_{jm})$$

\`\`\`python
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

gb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
gb.fit(X_train, y_train)

print(f"Akurasi Gradient Boosting Test: {accuracy_score(y_test, gb.predict(X_test)):.4f}")
\`\`\`
`
      },
      {
        id: "ml-bab-10-3",
        slug: "hist-gradient-boosting-dan-stacking",
        title: "10.3. Histogram-Based Gradient Boosting & Stacking",
        orderIndex: 3,
        description: "HistGradientBoostingClassifier yang terinspirasi LightGBM dengan dukungan data hilang bawaan, serta StackingClassifier multi-level.",
        content_markdown: `# 10.3. Histogram-Based Gradient Boosting & Stacking

---

## 10.3.1. Histogram-Based Gradient Boosting (\`HistGradientBoostingClassifier\`)
Untuk dataset besar ($> 10.000$ sampel), menghitung split pada nilai kontinu adalah bottleneck lambat. \`HistGradientBoosting\` mendiskretisasi nilai fitur kontinu ke dalam 256 bin integer:
- Komputasi split puluhan kali lebih cepat.
- Mendukung missing value (*NaN*) secara otomatis tanpa perlu tahapan imputasi sebelumnya.
- Mendukung fitur kategorikal langsung dengan parameter \`categorical_features\`.

\`\`\`python
from sklearn.ensemble import HistGradientBoostingClassifier
import numpy as np

# Simulasi data dengan nilai NaN
X_nan = np.array([[1.0, np.nan], [2.5, 3.1], [np.nan, 2.8], [4.0, 5.2]])
y_nan = np.array([0, 1, 0, 1])

hgb = HistGradientBoostingClassifier(random_state=42)
hgb.fit(X_nan, y_nan)
print("HistGradientBoosting sukses menangani missing values secara native.")
\`\`\`

---

## 10.3.2. Stacking & Voting Ensembles
**Stacking** menggabungkan heterogenitas model (misal SVM, Random Forest, dan k-NN) dengan melatih model meta-learner (misal Logistic Regression) di atas prediksi *out-of-fold* estimator dasar:

\`\`\`python
from sklearn.ensemble import StackingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier

estimators = [
    ('rf', RandomForestClassifier(n_estimators=50, random_state=42)),
    ('svc', SVC(probability=True, random_state=42))
]

# Stacking Classifier dengan meta-learner
stacking_clf = StackingClassifier(
    estimators=estimators,
    final_estimator=LogisticRegression(),
    cv=5
)
stacking_clf.fit(X_train, y_train)
print(f"Akurasi Stacking Ensemble: {stacking_clf.score(X_test, y_test):.4f}")
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
    title: "BAB 11: Interpretability Model Machine Learning",
    orderIndex: 11,
    description: "Inspeksi model kotak hitam: MDI Feature Importance vs Permutation Importance, Partial Dependence Plots (PDP), Individual Conditional Expectation (ICE), dan Display APIs.",
    subsections: [
      {
        id: "ml-bab-11-1",
        slug: "feature-importance-mdi-vs-permutation",
        title: "11.1. Mean Decrease Impurity (MDI) vs Permutation Feature Importance",
        orderIndex: 1,
        description: "Kelemahan MDI pada fitur kardinalitas tinggi dan keunggulan inspeksi Permutation Importance berbasis set uji independen.",
        content_markdown: `# 11.1. Mean Decrease Impurity (MDI) vs Permutation Feature Importance

---

## 11.1.1. Kelemahan MDI (\`feature_importances_\`)
Atribut bawaan pohon \`feature_importances_\` menghitung penurunan total impurity kriteria (Gini/Entropy) yang disumbangkan oleh fitur tersebut:
- **Bias Kardinalitas**: Sangat bias terhadap fitur numerik acak kontinu atau fitur berkardinalitas tinggi (seperti ID atau timestamp unik) meskipun tidak memiliki korelasi sejati dengan target.
- Dihitung pada data training, sehingga dapat melebih-lebihkan fitur yang overfit.

---

## 11.1.2. Permutation Importance (\`permutation_importance\`)
Permutation Feature Importance mengacak nilai suatu kolom fitur pada set uji validasi secara independen dan mengukur seberapa drastis metrik skor model (misal akurasi atau ROC-AUC) anjlok:

$$I(f) = s_{\\text{baseline}} - s_{\\text{permuted}(f)}$$

\`\`\`python
from sklearn.inspection import permutation_importance
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

clf = RandomForestClassifier(random_state=42).fit(X_train, y_train)

# Permutasi fitur pada test set independen
perm_res = permutation_importance(clf, X_test, y_test, n_repeats=10, random_state=42)

for idx in perm_res.importances_mean.argsort()[::-1][:5]:
    mean_imp = perm_res.importances_mean[idx]
    std_imp = perm_res.importances_std[idx]
    print(f"Fitur index #{idx:02d}: Signifikansi {mean_imp:.4f} (+/- {std_imp:.4f})")
\`\`\`
`
      },
      {
        id: "ml-bab-11-2",
        slug: "partial-dependence-ice-plots",
        title: "11.2. Partial Dependence (PDP) & Individual Conditional Expectation (ICE)",
        orderIndex: 2,
        description: "Visualisasi efek marjinal fitur terhadap probabilitas target prediksi model machine learning.",
        content_markdown: `# 11.2. Partial Dependence (PDP) & Individual Conditional Expectation (ICE)

**Partial Dependence Plots (PDP)** menunjukkan hubungan marjinal antara satu atau dua fitur input dengan target prediksi model machine learning (linear, monoton, atau non-linear kompleks).

---

## 11.2.1. Formulasi PDP
Fungsi dependensi parsial untuk subset fitur target $x_S$:

$$\\hat{f}_S(x_S) = \\frac{1}{n} \\sum_{i=1}^n \\hat{f}(x_S, x_{C}^{(i)})$$

Di mana $x_C$ adalah sisa fitur pelengkap lainnya dalam dataset observasi.

\`\`\`python
from sklearn.inspection import PartialDependenceDisplay
import matplotlib.pyplot as plt

# Membuat plot PDP dan ICE curves untuk 2 fitur utama
# (Bisa dirender di Jupyter Notebook / backend visualisasi)
display = PartialDependenceDisplay.from_estimator(
    clf,
    X_test,
    features=[0, 1],
    kind="both", # Menampilkan rata-rata (PDP) dan baris individual (ICE)
    subsample=50
)
print("Objek visualisasi Partial Dependence siap dirender.")
\`\`\`
`
      }
    ]
  }
];
