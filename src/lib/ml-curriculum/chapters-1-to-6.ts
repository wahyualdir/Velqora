import { DocSectionItem } from "@/components/modul/doc-reader-layout";

/**
 * BAB 1 - 6 KURIKULUM MACHINE LEARNING VELQORA
 * Edisi Komprehensif Resmi Berbasis Dokumentasi Scikit-Learn 1.9 User Guide:
 * Lengkap dengan teori mendalam, formulasi matematis formal (LaTeX KaTeX),
 * analisis kompleksitas komputasi, tabel parameter, dan kode Python runnable.
 */
export const ML_CHAPTERS_1_TO_6: DocSectionItem[] = [
  // =========================================================================
  // BAB 1: Fondasi Matematika & Pemrograman
  // =========================================================================
  {
    id: "ml-bab-1",
    slug: "bab-1-fondasi-matematika-pemrograman",
    title: "BAB 1: Fondasi Matematika & Pemrograman",
    orderIndex: 1,
    description: "Aljabar Linear (vektor, matriks, rank, dekomposisi), kalkulus multivariabel (gradien, rantai diferensial, optimasi SGD), teori probabilitas, dan komputasi array NumPy.",
    subsections: [
      {
        id: "ml-bab-1-1",
        slug: "aljabar-linear-vektor-matriks",
        title: "1.1. Aljabar Linear: Vektor, Matriks, dan Operasi Ruang Vektor",
        orderIndex: 1,
        description: "Representasi data tabular dalam bentuk matriks X dan vektor target y, perkalian dot product, norma vektor L1/L2/L-inf, rank matriks, serta dekomposisi nilai singular (SVD).",
        content_markdown: `# 1.1. Aljabar Linear: Vektor, Matriks, dan Operasi Ruang Vektor

Dalam Scikit-Learn dan machine learning modern, data tabular selalu diformulasikan ke dalam struktur aljabar linear:
- **Matriks Fitur** $X \\in \\mathbb{R}^{n \\times p}$: Matriks dua dimensi dengan $n = n_{\\text{samples}}$ (jumlah baris data/observasi) dan $p = n_{\\text{features}}$ (jumlah kolom variabel prediktor numerik).
- **Vektor Target** $y \\in \\mathbb{R}^n$: Vektor kolom berdimensi $n$ yang berisi label target kontinu (regresi) atau diskrit (klasifikasi).

---

## 1.1.1. Perkalian Titik (*Dot Product*) & Proyeksi Linear
Persamaan model linear menyatakan bahwa estimasi target $\\hat{y}$ merupakan kombinasi linear dari fitur-fitur input $x = (x_1, x_2, \\dots, x_p)^T$:

$$\\hat{y}(w, x) = w_0 + w_1 x_1 + w_2 x_2 + \\dots + w_p x_p = w_0 + \\sum_{j=1}^p w_j x_j = w_0 + w^T x = w_0 + \\langle w, x \\rangle$$

Di Scikit-Learn:
- Vektor bobot $w = (w_1, \\dots, w_p)^T$ disimpan dalam atribut publik \`model.coef_\` (berupa array 1D berukuran $p$).
- Nilai bias/konstanta $w_0$ disimpan dalam \`model.intercept_\` (skalar float).

Secara matriks untuk seluruh $n$ sampel sekaligus:
$$\\hat{y} = X w + w_0 \\mathbf{1}_n$$

---

## 1.1.2. Norma Vektor (*Vector Norms*) & Ruang Banach
Norma mengukur besar (*magnitude*) atau panjang suatu vektor dalam ruang berdimensi tinggi. Karakteristik norma menjadi fondasi utama teknik regularisasi Scikit-Learn:

1. **Norma Euclidean ($\\ell_2$-norm)**:
   $$\\|w\\|_2 = \\sqrt{\\sum_{j=1}^p w_j^2} = \\sqrt{w^T w}$$
   Digunakan dalam **Ridge Regression** (\`Ridge\`), **Support Vector Machines** (\`SVC\`), dan penalti $\\ell_2$ pada **Logistic Regression**. Bersifat terdiferensiasi di seluruh titik dan menyusutkan bobot menuju nol tanpa membuatnya tepat bernilai nol.

2. **Norma Manhattan ($\\ell_1$-norm)**:
   $$\\|w\\|_1 = \\sum_{j=1}^p |w_j|$$
   Digunakan dalam **Lasso Regression** (\`Lasso\`) dan penalti $\\ell_1$. Memiliki titik singular (sudut lancip) pada sumbu koordinat, mendorong koefisien fitur yang tidak signifikan menjadi tepat nol (*sparsity*), sehingga berfungsi sebagai seleksi fitur otomatis.

3. **Norma Chebyshev ($\\ell_\\infty$-norm)**:
   $$\\|w\\|_\\infty = \\max_{1 \\le j \\le p} |w_j|$$

---

## 1.1.3. Rank Matriks, Inversi, & Singular Value Decomposition (SVD)
- **Rank Matriks**: Menunjukkan jumlah kolom atau baris yang saling bebas linear (*linearly independent*). Jika $\\text{rank}(X) < p$, maka matriks $X^T X$ singular (tidak dapat dibalik), menyebabkan Ordinary Least Squares gagal karena terjadi *multikolinearitas sempurna*.
- **Singular Value Decomposition (SVD)**: Setiap matriks data $X \\in \\mathbb{R}^{n \\times p}$ dapat didekomposisi menjadi:
  $$X = U \\Sigma V^T$$
  Di mana $U \\in \\mathbb{R}^{n \\times n}$ dan $V \\in \\mathbb{R}^{p \\times p}$ adalah matriks ortogonal ($U^T U = I, V^T V = I$), dan $\\Sigma \\in \\mathbb{R}^{n \\times p}$ berisi nilai-nilai singular non-negatif terurut menurun $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge 0$. SVD adalah mesin komputasi inti di balik \`PCA\`, \`TruncatedSVD\`, dan solver SVD pada \`Ridge\`.

---

## 1.1.4. Implementasi Komputasi Aljabar Linear NumPy

\`\`\`python
import numpy as np

# 1. Representasi Matriks Fitur X (n=4 sampel, p=3 fitur)
X = np.array([
    [1.5, 2.0, 0.5],
    [2.0, 1.8, 0.7],
    [0.8, 3.2, 1.2],
    [3.1, 0.9, 0.4]
])

# 2. Vektor Bobot w dan Intercept b
w = np.array([0.4, -0.2, 0.8])
b = 1.25

# 3. Operasi Forward Linear: y_hat = X @ w + b
y_hat = np.dot(X, w) + b
print("Prediksi linear (y_hat):\n", np.round(y_hat, 4))

# 4. Menghitung Norma L1, L2, dan Linf
norm_l1 = np.linalg.norm(w, ord=1)
norm_l2 = np.linalg.norm(w, ord=2)
norm_inf = np.linalg.norm(w, ord=np.inf)
print(f"Norma L1 (Manhattan) : {norm_l1:.4f}")
print(f"Norma L2 (Euclidean) : {norm_l2:.4f}")
print(f"Norma L-inf (Max)    : {norm_inf:.4f}")

# 5. Dekomposisi Nilai Singular (SVD)
U, S, Vt = np.linalg.svd(X, full_matrices=False)
print("\nNilai Singular Matriks Data (Sigma):", np.round(S, 4))
print("Rank Matriks:", np.linalg.matrix_rank(X))
\`\`\`
`
      },
      {
        id: "ml-bab-1-2",
        slug: "kalkulus-diferensial-dan-gradien",
        title: "1.2. Kalkulus Diferensial Multivariabel & Algoritma Optimasi Gradien",
        orderIndex: 2,
        description: "Turunan parsial, vektor gradien nabla, aturan rantai diferensial, serta algoritma Batch Gradient Descent, SGD, dan Momentum.",
        content_markdown: `# 1.2. Kalkulus Diferensial Multivariabel & Algoritma Optimasi Gradien

Sebagian besar algoritma machine learning di Scikit-Learn diformulasikan sebagai masalah optimasi matematis: mencari vektor parameter $w^*$ yang meminimalkan fungsi kerugian empiris $J(w)$ (*loss function*):

$$w^* = \\arg\\min_{w} J(w)$$

---

## 1.2.1. Vektor Gradien ($\\nabla J(w)$)
Jika $J(w): \\mathbb{R}^p \\to \\mathbb{R}$ adalah fungsi bernilai skalar yang terdiferensiasi, maka vektor gradien $\\nabla J(w)$ adalah vektor turunan parsial terhadap setiap elemen bobot:

$$\\nabla J(w) = \\begin{pmatrix} \\frac{\\partial J}{\\partial w_1} \\\\ \\frac{\\partial J}{\\partial w_2} \\\\ \\vdots \\\\ \\frac{\\partial J}{\\partial w_p} \\end{pmatrix}$$

Sifat geometris utama: **Gradien selalu menunjuk ke arah kenaikan fungsi yang paling curam**. Oleh karena itu, untuk meminimalkan fungsi rugi, kita harus melangkah ke arah sebaliknya (arah gradien negatif).

---

## 1.2.2. Varian Algoritma Gradient Descent
Aturan pembaruan parameter (*parameter update rule*) dengan laju pembelajaran (*learning rate*) $\\eta > 0$:

$$w^{(t+1)} = w^{(t)} - \\eta \\nabla J(w^{(t)})$$

| Varian Algoritma | Jumlah Sampel per Langkah | Kelebihan | Kelemahan | Implementasi Scikit-Learn |
|---|---|---|---|---|
| **Batch Gradient Descent** | Seluruh dataset ($n$) | Konvergensi stabil menuju minimum global untuk fungsi konveks. | Sangat lambat dan boros memori pada dataset jutaan baris. | Solver internal pada estimator linear kecil. |
| **Stochastic GD (SGD)** | 1 sampel acak ($i$) | Sangat cepat, mampu meloloskan diri dari minimum lokal suboptimal. | Fluktuasi kurva loss sangat tinggi, tidak pernah stabil penuh. | \`SGDClassifier\`, \`SGDRegressor\`. |
| **Mini-Batch GD** | Sub-sampel ($b = 32, 64, 256$) | Kompromi terbaik antara stabilitas vektor dan pemanfaatan vektorisasi CPU/GPU. | Memerlukan tuning hyperparameter ukuran batch. | \`MiniBatchKMeans\`, \`MLPClassifier\`. |

---

## 1.2.3. Momentum & Learning Rate Decay
Untuk mengatasi osilasi pada lembah permukaan yang curam, ditambahkan suku momentum $\\beta \\in [0, 1)$:

$$v^{(t+1)} = \\beta v^{(t)} + \\eta \\nabla J(w^{(t)})$$
$$w^{(t+1)} = w^{(t)} - v^{(t+1)}$$

Scikit-Learn menyediakan skema penjadwalan laju pembelajaran (\`learning_rate='adaptive'\` atau \`'invscaling'\`):
$$\\eta^{(t)} = \\frac{\\eta_0}{t^{\\text{power\\_t}}}$$

\`\`\`python
import numpy as np

# Simulasi Optimasi Fungsi Kuadratik: J(w) = (w - 4)^2 + 10
# Turunan analitis: dJ/dw = 2 * (w - 4)
w = 0.0 # Titik awal
eta = 0.1 # Learning rate
beta = 0.9 # Koefisien Momentum
velocity = 0.0

print("--- Iterasi Gradient Descent dengan Momentum ---")
for epoch in range(1, 16):
    grad = 2.0 * (w - 4.0)
    velocity = beta * velocity + eta * grad
    w = w - velocity
    loss = (w - 4.0)**2 + 10.0
    if epoch % 3 == 0 or epoch == 1:
        print(f"Epoch {epoch:02d} | Bobot w: {w:.4f} | Gradien: {grad:+.4f} | Loss: {loss:.4f}")

print(f"Konvergensi tercapai pada w = {w:.4f} (Target analitis = 4.0000)")
\`\`\`
`
      },
      {
        id: "ml-bab-1-3",
        slug: "probabilitas-statistika-dan-teori-informasi",
        title: "1.3. Teori Probabilitas, Statistika Multivariat, & Teori Informasi",
        orderIndex: 3,
        description: "Nilai harapan E[X], varians-kovarians, distribusi Gaussian multivariat, Maximum Likelihood Estimation (MLE), dan Entropi Shannon.",
        content_markdown: `# 1.3. Teori Probabilitas, Statistika Multivariat, & Teori Informasi

Pemodelan probabilistik dalam machine learning menjembatani data mentah dengan inferensi ketidakpastian (*uncertainty estimation*).

---

## 1.3.1. Nilai Harapan (*Expectation*), Varians, & Kovarians
Untuk variabel acak kontinu $X$:
- **Nilai Harapan (Mean)**: $\\mu = \\mathbb{E}[X] = \\int x p(x) dx$
- **Varians**: $\\sigma^2 = \\text{Var}(X) = \\mathbb{E}[(X - \\mu)^2] = \\mathbb{E}[X^2] - (\\mathbb{E}[X])^2$
- **Matriks Kovarians** $\\Sigma \\in \\mathbb{R}^{p \\times p}$:
  $$\\Sigma_{jk} = \\text{Cov}(X_j, X_k) = \\mathbb{E}[(X_j - \\mu_j)(X_k - \\mu_k)]$$
  Di mana diagonal utama $\\Sigma_{jj} = \\text{Var}(X_j)$ dan elemen non-diagonal mengukur korelasi linear antar pasangan fitur. Matriks kovarians adalah dasar algoritma \`PCA\`, \`GaussianMixture\`, dan \`LinearDiscriminantAnalysis\`.

---

## 1.3.2. Distribusi Gaussian Multivariat
Banyak algoritma (seperti Naive Bayes, Linear Discriminant Analysis, dan Gaussian Process) mengasumsikan data terdistribusi secara normal multivariat:

$$\\mathcal{N}(x \\mid \\mu, \\Sigma) = \\frac{1}{(2\\pi)^{p/2} |\\Sigma|^{1/2}} \\exp\\left( -\\frac{1}{2} (x - \\mu)^T \\Sigma^{-1} (x - \\mu) \\right)$$

Di mana $(x - \\mu)^T \\Sigma^{-1} (x - \\mu)$ dikenal sebagai **Jarak Mahalanobis**, yang memperhitungkan skala dan korelasi antar fitur.

---

## 1.3.3. Entropi Shannon & Kullback-Leibler (KL) Divergence
Dalam pemisahan pohon keputusan (\`DecisionTreeClassifier\`) dan fungsi rugi logistik (*Cross-Entropy Loss*):
- **Entropi Shannon**: Mengukur ketidakpastian rata-rata suatu variabel diskrit berdistribusi $P$:
  $$H(P) = - \\sum_{k=1}^K P(k) \\log_2 P(k)$$
- **Cross-Entropy Loss**: Menghitung ketidaksesuaian antara distribusi label sebenarnya $y$ dan probabilitas prediksi model $\\hat{p}$:
  $$L_{\\text{CE}}(y, \\hat{p}) = - \\sum_{k=1}^K y_k \\ln(\\hat{p}_k)$$
`
      }
    ]
  },

  // =========================================================================
  // BAB 2: Dasar-Dasar Data
  // =========================================================================
  {
    id: "ml-bab-2",
    slug: "bab-2-dasar-dasar-data",
    title: "BAB 2: Dasar-Dasar Data & Preprocessing Scikit-Learn",
    orderIndex: 2,
    description: "Penskalaan fitur (StandardScaler, RobustScaler, MinMaxScaler), penanganan nilai kosong (SimpleImputer, KNNImputer, IterativeImputer), encoding kategorikal (OneHotEncoder, TargetEncoder), dan diskritisasi.",
    subsections: [
      {
        id: "ml-bab-2-1",
        slug: "penskalaan-dan-transformasi-fitur",
        title: "2.1. Penskalaan & Normalisasi Fitur (Feature Scaling)",
        orderIndex: 1,
        description: "Perbandingan StandardScaler, RobustScaler, MinMaxScaler, QuantileTransformer, serta dampak penskalaan terhadap konvergensi gradien dan margin SVM.",
        content_markdown: `# 2.1. Penskalaan & Normalisasi Fitur (Feature Scaling)

Banyak estimator machine learning (seperti SVM, regresi linear berpenalti Ridge/Lasso, SGD, k-NN, dan Neural Network) mengasumsikan seluruh fitur berada pada rentang skala yang sebanding. Jika suatu fitur memiliki magnitudo $[0, 1.000.000]$ sementara fitur lain berada di rentang $[0, 1]$, fungsi kerugian akan didominasi sepenuhnya oleh fitur bermagnitudo besar.

---

## 2.1.1. Perbandingan Matematis Penskalaan Scikit-Learn

| Transformer | Formulasi Matematis | Karakteristik Utama | Sensitivitas Terhadap Outlier |
|---|---|---|---|
| \`StandardScaler\` | $z = \\frac{x - \\mu}{\\sigma}$ | Menghasilkan distribusi dengan rata-rata $\\mu = 0$ dan varians $\\sigma^2 = 1$. | **Tinggi**: Outlier menarik nilai $\\mu$ dan $\\sigma$. |
| \`MinMaxScaler\` | $z = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}$ | Memetakan seluruh data ke dalam interval $[0, 1]$ (atau \`feature_range\`). | **Sangat Tinggi**: Satu outlier ekstrem memampatkan data normal. |
| \`RobustScaler\` | $z = \\frac{x - Q_2}{Q_3 - Q_1}$ | Menggunakan Median ($Q_2$) dan Rentang Interkuartil (IQR = $Q_3 - Q_1$). | **Sangat Rendah (Kuat)**: Nilai median dan IQR tidak terpengaruh outlier. |
| \`QuantileTransformer\` | $F(x) = \\text{EmpiricalCDF}(x)$ | Memetakan data ke distribusi seragam (*uniform*) atau Gaussian normal, meratakan distribusi miring. | **Kebal**: Menghaluskan pencilan ke kuantil ekstrem. |

---

## 2.1.2. Implementasi Scikit-Learn

\`\`\`python
from sklearn.preprocessing import StandardScaler, RobustScaler, MinMaxScaler
import numpy as np

# Dataset fitur dengan outlier ekstrem (baris ke-4 memiliki nilai 1200.0)
X_raw = np.array([
    [10.0, 25.0],
    [12.0, 28.0],
    [11.5, 24.0],
    [1200.0, 26.0], # Outlier fitur 0
    [9.8, 27.0]
])

# Penerapan Penskalaan
scaler_std = StandardScaler().fit(X_raw)
scaler_rob = RobustScaler().fit(X_raw)
scaler_min = MinMaxScaler().fit(X_raw)

print("StandardScaler Transform (Outlier mendominasi rata-rata):\n", np.round(scaler_std.transform(X_raw), 2))
print("\nRobustScaler Transform (Outlier terisolasi dengan aman):\n", np.round(scaler_rob.transform(X_raw), 2))
\`\`\`
`
      },
      {
        id: "ml-bab-2-2",
        slug: "imputasi-data-hilang-missing-values",
        title: "2.2. Imputasi Data Hilang (Missing Value Imputation)",
        orderIndex: 2,
        description: "SimpleImputer univariat, KNNImputer berbasis jarak tetangga terdekat, dan IterativeImputer (MICE) multivariat.",
        content_markdown: `# 2.2. Imputasi Data Hilang (Missing Value Imputation)

Dataset riil hampir selalu memiliki nilai yang hilang (*missing values* / \`NaN\`). Mengabaikan atau menghapus baris yang memiliki nilai hilang berisiko membuang sampel berharga dan menimbulkan bias seleksi.

---

## 2.2.1. Pilihan Imputer di Scikit-Learn
1. **\`SimpleImputer\` (Univariat)**:
   Mengganti nilai hilang menggunakan statistik ringkasan kolom yang bersangkutan:
   - \`strategy='mean'\`: Rata-rata aritmatika (untuk fitur numerik berdistribusi simetris).
   - \`strategy='median'\`: Nilai tengah median (lebih aman untuk fitur yang memiliki skewness atau outlier).
   - \`strategy='most_frequent'\`: Modus data (cocok untuk data diskrit atau string kategorikal).
   - \`strategy='constant'\`: Nilai konstan kustom yang ditentukan via \`fill_value\`.

2. **\`KNNImputer\` (Multivariat Spasial)**:
   Mengisi nilai hilang suatu observasi berdasarkan rata-rata terbobot dari $k$ tetangga terdekatnya menggunakan metrik jarak Euclidean nan-Euclidean:
   $$d(x, y) = \\sqrt{\\frac{p}{p_{\\text{valid}}} \\sum_{j \\in \\text{valid}} (x_j - y_j)^2}$$

3. **\`IterativeImputer\` (MICE - Multivariate Imputation by Chained Equations)**:
   Setiap fitur yang memiliki nilai hilang dimodelkan sebagai fungsi dari seluruh fitur lainnya secara bertahap menggunakan estimator regresi (default \`BayesianRidge\`).

\`\`\`python
from sklearn.impute import SimpleImputer, KNNImputer
import numpy as np

# Matriks data dengan nilai hilang np.nan
X_missing = np.array([
    [1.0, 2.0, np.nan],
    [3.0, np.nan, 3.0],
    [5.0, 6.0, 5.0],
    [np.nan, 8.0, 7.0]
])

# 1. SimpleImputer Median
imp_median = SimpleImputer(strategy='median')
print("Hasil SimpleImputer Median:\n", imp_median.fit_transform(X_missing))

# 2. KNNImputer (k=2 tetangga)
imp_knn = KNNImputer(n_neighbors=2)
print("\nHasil KNNImputer (Mempertahankan relasi multivariat):\n", imp_knn.fit_transform(X_missing))
\`\`\`
`
      },
      {
        id: "ml-bab-2-3",
        slug: "encoding-kategorikal-dan-diskritisasi",
        title: "2.3. Encoding Data Kategorikal & Diskritisasi Fitur",
        orderIndex: 3,
        description: "OneHotEncoder dengan penanganan kategori baru (handle_unknown='ignore'), OrdinalEncoder, TargetEncoder regulasi empiris Bayes, dan KBinsDiscretizer.",
        content_markdown: `# 2.3. Encoding Data Kategorikal & Diskritisasi Fitur

---

## 2.3.1. \`OneHotEncoder\`
Memetakan setiap kategori diskrit ke dalam vektor biner nol-satu:
- Parameter \`handle_unknown='ignore'\`: Menghindari exception error saat inferensi data produksi ketika muncul label kategori baru yang belum pernah dilihat saat pelatihan (kolom one-hot bernilai semua 0).
- Parameter \`drop='first'\`: Membuang kategori pertama untuk menghindari multikolinearitas sempurna (*dummy variable trap*) pada regresi linear tanpa penalti.

\`\`\`python
from sklearn.preprocessing import OneHotEncoder
import pandas as pd

df = pd.DataFrame({'kota': ['Jakarta', 'Surabaya', 'Bandung', 'Jakarta']})
ohe = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
encoded = ohe.fit_transform(df[['kota']])
print("Kolom OneHotEncoder:", ohe.get_feature_names_out())
print(encoded)
\`\`\`

---

## 2.3.2. \`TargetEncoder\` (Scikit-Learn 1.3+)
Untuk fitur kategorikal dengan kardinalitas tinggi (misal 500 kode pos), OneHotEncoder akan meledakkan dimensi matriks ($p$). \`TargetEncoder\` mengkodekan setiap kategori sebagai nilai rata-rata target kontinu yang disusutkan (*empirical Bayes shrinkage*) ke arah rata-rata target global:

$$\\hat{S}_i = \\lambda_i \\bar{y}_i + (1 - \\lambda_i) \\bar{y}$$
Di mana $\\lambda_i \\in [0, 1]$ adalah bobot penyusutan yang sebanding dengan frekuensi kemunculan kategori tersebut.
`
      }
    ]
  },

  // =========================================================================
  // BAB 3: Konsep Inti Machine Learning
  // =========================================================================
  {
    id: "ml-bab-3",
    slug: "bab-3-konsep-inti-machine-learning",
    title: "BAB 3: Konsep Inti Machine Learning",
    orderIndex: 3,
    description: "Taksonomi machine learning, dekomposisi matematis Bias-Variance Tradeoff, pencegahan overfitting, regularisasi L1/L2, serta protokol Cross-Validation.",
    subsections: [
      {
        id: "ml-bab-3-1",
        slug: "taksonomi-dan-paradigma-pembelajaran",
        title: "3.1. Taksonomi & Paradigma Pembelajaran Mesin",
        orderIndex: 1,
        description: "Supervised vs Unsupervised vs Semi-Supervised vs Reinforcement Learning, formulasi estimasi fungsi pemetaan f(X) -> y.",
        content_markdown: `# 3.1. Taksonomi & Paradigma Pembelajaran Mesin

Machine Learning terbagi dalam empat paradigma komputasi utama:

1. **Supervised Learning (Pembelajaran Terarah)**:
   Diberikan dataset berpasangan $\\mathcal{D} = \\{(x_i, y_i)\\}_{i=1}^n$, tujuannya adalah mempelajari fungsi pemetaan $\\hat{f}: \\mathcal{X} \\to \\mathcal{Y}$ yang meminimalkan ekspektasi risiko empiris pada data uji yang belum pernah dilihat:
   - **Regresi**: Target kontinu $y \\in \\mathbb{R}$ (misal estimasi harga properti, proyeksi suhu).
   - **Klasifikasi**: Target diskrit berlabel $y \\in \\{1, \\dots, C\\}$ (misal deteksi churn pelanggan, klasifikasi penyakit).

2. **Unsupervised Learning (Pembelajaran Tanpa Terarah)**:
   Diberikan data tanpa label $\\mathcal{D} = \\{x_i\\}_{i=1}^n$, tujuannya adalah menemukan struktur intrinsik laten: pengelompokan (*clustering*), reduksi dimensi (*manifold learning / PCA*), atau estimasi densitas probabilitas $P(x)$.

3. **Semi-Supervised Learning**:
   Memanfaatkan sedikit data berlabel yang dikombinasikan dengan jutaan data tanpa label (\`LabelPropagation\`, \`SelfTrainingClassifier\`).

4. **Reinforcement Learning**:
   Agen memaksimalkan imbalan kumulatif (*cumulative discounted reward*) melalui siklus aksi dan observasi keadaan (*state-action interaction*).
`
      },
      {
        id: "ml-bab-3-2",
        slug: "bias-variance-tradeoff-matematis",
        title: "3.2. Bias-Variance Tradeoff & Pencegahan Overfitting",
        orderIndex: 2,
        description: "Dekomposisi matematis galat kuadrat terkecil menjadi Bias^2, Variance, dan Irreducible Error, serta kurva pembelajaran.",
        content_markdown: `# 3.2. Bias-Variance Tradeoff & Pencegahan Overfitting

Misalkan hubungan target sebenarnya adalah $y = f(x) + \\epsilon$ di mana derau acak $\\epsilon \\sim \\mathcal{N}(0, \\sigma^2)$. Untuk model estimasi $\\hat{f}(x)$, nilai ekspektasi Mean Squared Error pada titik uji $x$ dapat didekomposisi secara analitis menjadi:

$$\\mathbb{E}\\left[ (y - \\hat{f}(x))^2 \\right] = \\underbrace{\\left( \\mathbb{E}[\\hat{f}(x)] - f(x) \\right)^2}_{\\text{Bias}^2} + \\underbrace{\\mathbb{E}\\left[ (\\hat{f}(x) - \\mathbb{E}[\\hat{f}(x)])^2 \\right]}_{\\text{Variance}} + \\underbrace{\\sigma^2}_{\\text{Irreducible Error}}$$

---

## 3.2.1. Memahami Ketiga Komponen
- **$\\text{Bias}^2$ (Galat Asumsi / Underfitting)**:
  Terjadi ketika model terlalu sederhana (misal model linear untuk pola kurva kuadratik). Model gagal menangkap tren fundamental data pada set latih maupun set uji.
- **$\\text{Variance}$ (Sensitivitas Sampel / Overfitting)**:
  Terjadi ketika model terlalu fleksibel/kompleks (misal pohon keputusan tanpa batas kedalaman). Model menghafal derau (*noise*) data latih; akurasi latih mendekati 100%, tetapi anjlok drastis pada data uji baru.
- **$\\sigma^2$ (Galat Tak Tereduksi)**:
  Batas bawah galat teoretis yang disebabkan oleh derau inheren sensor atau variabel relevan yang tidak tercatat dalam dataset.

\`\`\`python
from sklearn.model_selection import learning_curve
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_breast_cancer
import numpy as np

X, y = load_breast_cancer(return_X_y=True)

# Menghitung Kurva Pembelajaran untuk menganalisis Bias vs Variance
train_sizes, train_scores, val_scores = learning_curve(
    RandomForestClassifier(max_depth=4, random_state=42),
    X, y, cv=5, train_sizes=np.linspace(0.2, 1.0, 5), scoring='accuracy'
)

print("Ukuran Data Latih :", train_sizes)
print("Akurasi Latih     :", np.round(np.mean(train_scores, axis=1), 4))
print("Akurasi Validasi  :", np.round(np.mean(val_scores, axis=1), 4))
\`\`\`
`
      },
      {
        id: "ml-bab-3-3",
        slug: "strategi-validasi-silang-cross-validation",
        title: "3.3. Protokol Validasi Silang (Cross-Validation)",
        orderIndex: 3,
        description: "K-Fold, StratifiedKFold untuk kelas timpang, TimeSeriesSplit untuk deret waktu, dan GroupKFold untuk sampel berkelompok.",
        content_markdown: `# 3.3. Protokol Validasi Silang (Cross-Validation)

Mengevaluasi performa model hanya pada satu pembagian train-test rentan terhadap varians keberuntungan acak. Scikit-Learn menyediakan protokol validasi silang tangguh:

1. **\`KFold\`**: Membagi data secara seragam menjadi $K$ bagian partisi sama besar. Model dilatih pada $K-1$ fold dan diuji pada 1 fold sisa secara berulang.
2. **\`StratifiedKFold\`**: Wajib untuk klasifikasi, memastikan proporsi setiap kelas pada setiap fold identik dengan distribusi populasi asli.
3. **\`TimeSeriesSplit\`**: Wajib untuk data deret waktu finansial/sensor, di mana masa depan tidak boleh bocor ke masa lalu (*walk-forward rolling validation*).
4. **\`GroupKFold\`**: Mencegah observasi dari subjek/pasien/toko yang sama muncul di fold latih dan fold validasi sekaligus.

\`\`\`python
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.linear_model import LogisticRegression

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(LogisticRegression(max_iter=500), X, y, cv=cv, scoring='roc_auc')

print(f"5-Fold ROC-AUC: {scores}")
print(f"Rata-rata Skor Validasi: {scores.mean():.4f} (+/- {scores.std():.4f})")
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 4: Probabilistic & Bayesian Machine Learning
  // =========================================================================
  {
    id: "ml-bab-4",
    slug: "bab-4-probabilistic-bayesian-machine-learning",
    title: "BAB 4: Probabilistic & Bayesian Machine Learning",
    orderIndex: 4,
    description: "Teorema Bayes (Prior, Likelihood, Posterior), Maximum A Posteriori (MAP) vs MLE, keluarga Naive Bayes (Gaussian, Multinomial, Complement), Bayesian Ridge, dan Gaussian Process Regression (GPR).",
    subsections: [
      {
        id: "ml-bab-4-1",
        slug: "teorema-bayes-dan-inferensi-parameter",
        title: "4.1. Teorema Bayes & Estimasi Parameter (MLE vs MAP)",
        orderIndex: 1,
        description: "Formulasi probabilitas kondisional, fungsi likelihood, prior beliefs, dan transisi dari Maximum Likelihood ke Maximum A Posteriori.",
        content_markdown: `# 4.1. Teorema Bayes & Estimasi Parameter (MLE vs MAP)

Dalam kerangka Bayesian, parameter model $\\theta$ diperlakukan sebagai variabel acak yang memiliki distribusi probabilitas, bukan konstanta deterministik tunggal:

$$P(\\theta \\mid \\mathcal{D}) = \\frac{P(\\mathcal{D} \\mid \\theta) P(\\theta)}{P(\\mathcal{D})} = \\frac{P(\\mathcal{D} \\mid \\theta) P(\\theta)}{\\int P(\\mathcal{D} \\mid \\theta') P(\\theta') d\\theta'}$$

Di mana:
- **Prior $P(\\theta)$**: Keyakinan awal mengenai nilai parameter sebelum melihat data observasi.
- **Likelihood $P(\\mathcal{D} \\mid \\theta)$**: Peluang munculnya data observasi $\\mathcal{D}$ jika parameter bernilai $\\theta$.
- **Posterior $P(\\theta \\mid \\mathcal{D})$**: Distribusi keyakinan yang telah diperbarui setelah mengamati bukti data.

---

## 4.1.1. Perbandingan MLE vs MAP
- **Maximum Likelihood Estimation (MLE)**:
  $$\\hat{\\theta}_{\\text{MLE}} = \\arg\\max_\\theta \\log P(\\mathcal{D} \\mid \\theta)$$
  Mengabaikan prior. Menjadi dasar OLS dan regresi logistik tanpa penalti regularisasi.
- **Maximum A Posteriori (MAP)**:
  $$\\hat{\\theta}_{\\text{MAP}} = \\arg\\max_\\theta [\\log P(\\mathcal{D} \\mid \\theta) + \\log P(\\theta)]$$
  Jika prior adalah Gaussian $\\mathcal{N}(0, \\sigma^2)$, MAP setara dengan **Ridge Regression (L2)**. Jika prior adalah distribusi Laplace, MAP setara dengan **Lasso Regression (L1)**.
`
      },
      {
        id: "ml-bab-4-2",
        slug: "keluarga-naive-bayes",
        title: "4.2. Keluarga Algoritma Naive Bayes (Gaussian, Multinomial, Complement)",
        orderIndex: 2,
        description: "Asumsi independensi kondisional fitur, perumusan GaussianNB, MultinomialNB dengan smoothing Laplace, dan ComplementNB untuk kelas tidak seimbang.",
        content_markdown: `# 4.2. Keluarga Algoritma Naive Bayes

Naive Bayes mengasumsikan bahwa semua fitur $x_j$ saling bebas secara kondisional (*conditionally independent*) terhadap label kelas $y$:

$$P(x_1, \\dots, x_p \\mid y) = \\prod_{j=1}^p P(x_j \\mid y)$$

Berdasarkan Teorema Bayes, aturan keputusan kelas adalah:
$$\\hat{y} = \\arg\\max_y P(y) \\prod_{j=1}^p P(x_j \\mid y)$$

---

## 4.2.1. Model-Model Naive Bayes di Scikit-Learn

1. **\`GaussianNB\`**:
   Digunakan untuk fitur kontinu bernilai riil, mengasumsikan setiap fitur dalam kelas $y$ mengikuti kurva Gaussian:
   $$P(x_j \\mid y) = \\frac{1}{\\sqrt{2\\pi \\sigma_{yj}^2}} \\exp\\left( -\\frac{(x_j - \\mu_{yj})^2}{2 \\sigma_{yj}^2} \\right)$$

2. **\`MultinomialNB\`**:
   Standar baku untuk ekstraksi teks (*word counts*). Parameter probabilitas dihitung dengan penghalusan Laplace (*Laplace Smoothing*) $\\alpha$:
   $$\\hat{\\theta}_{yj} = \\frac{N_{yj} + \\alpha}{N_y + \\alpha p}$$

3. **\`ComplementNB\`**:
   Dirancang khusus untuk dataset teks yang memiliki ketidakseimbangan kelas (*imbalanced text classification*). Mengestimasi parameter dari komplementer kelas.

\`\`\`python
from sklearn.naive_bayes import GaussianNB, MultinomialNB
from sklearn.datasets import load_iris
import numpy as np

X, y = load_iris(return_X_y=True)
gnb = GaussianNB().fit(X, y)

print("Prior probabilitas setiap kelas:", gnb.class_prior_)
print("Rata-rata fitur per kelas (mu):\n", np.round(gnb.theta_, 3))
\`\`\`
`
      },
      {
        id: "ml-bab-4-3",
        slug: "bayesian-ridge-dan-gaussian-process",
        title: "4.3. Regresi Bayesian & Gaussian Process Regression (GPR)",
        orderIndex: 3,
        description: "BayesianRidge dengan hyperprior gamma dan GaussianProcessRegressor non-parametrik dengan estimasi interval ketidakpastian prediktif.",
        content_markdown: `# 4.3. Regresi Bayesian & Gaussian Process Regression (GPR)

---

## 4.3.1. Bayesian Ridge Regression (\`BayesianRidge\`)
Pada \`BayesianRidge\`, penalti regularisasi $\\alpha$ dan $\\lambda$ diestimasi secara otomatis dari data pelatihan selama proses optimasi menggunakan distribusi Gamma sebagai hyperprior:

$$p(w \\mid \\lambda) = \\mathcal{N}(w \\mid 0, \\lambda^{-1} I_p)$$
$$p(y \\mid X, w, \\alpha) = \\mathcal{N}(y \\mid Xw, \\alpha^{-1} I_n)$$

---

## 4.3.2. Gaussian Process Regression (\`GaussianProcessRegressor\`)
Metode non-parametrik di mana fungsi $f(x)$ diasumsikan sebagai proses Gaussian yang dicirikan oleh fungsi rata-rata $m(x)$ dan fungsi kovarians kernel $k(x, x')$ (seperti RBF / Matérn):

$$f(x) \\sim \\mathcal{GP}(m(x), k(x, x'))$$

Keunggulan utama GPR adalah kemampuannya menghasilkan **interval keyakinan analitis** (deviasi standar $\\sigma$) untuk setiap titik prediksi:

\`\`\`python
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF, ConstantKernel as C
import numpy as np

# Data observasi satu dimensi
X_train = np.atleast_2d([1.0, 3.0, 5.0, 6.0, 8.0]).T
y_train = np.sin(X_train).ravel()

# Kernel RBF dengan konstanta skala
kernel = C(1.0, (1e-3, 1e3)) * RBF(10, (1e-2, 1e2))
gp = GaussianProcessRegressor(kernel=kernel, n_restarts_optimizer=10, random_state=42)
gp.fit(X_train, y_train)

# Prediksi titik baru beserta standar deviasi (ketidakpastian)
X_test = np.atleast_2d(np.linspace(0, 10, 5)).T
y_pred, sigma = gp.predict(X_test, return_std=True)

for x, pred, s in zip(X_test.ravel(), y_pred, sigma):
    print(f"X={x:4.1f} | Estimasi Prediksi={pred:+.3f} | Ketidakpastian (95% CI): +/- {1.96*s:.3f}")
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 5: Supervised Learning - Regresi
  // =========================================================================
  {
    id: "ml-bab-5",
    slug: "bab-5-supervised-learning---regresi",
    title: "BAB 5: Supervised Learning - Regresi",
    orderIndex: 5,
    description: "Model regresi Scikit-Learn komprehensif: Ordinary Least Squares (OLS), Ridge & RidgeCV, Lasso & LassoCV, ElasticNet, Least Angle Regression (LARS), Robust Regression (Huber, RANSAC), Generalized Linear Models (GLM), dan Support Vector Regression (SVR).",
    subsections: [
      {
        id: "ml-bab-5-1",
        slug: "ordinary-least-squares-dan-regresi-linear",
        title: "5.1. Ordinary Least Squares (OLS) & Regresi Linear",
        orderIndex: 1,
        description: "Prinsip minimisasi Residual Sum of Squares (RSS), solusi Normal Equations (X^T X)^-1 X^T y, estimasi non-negatif (NNLS), dan analisis kompleksitas komputasi O(n p^2).",
        content_markdown: `# 5.1. Ordinary Least Squares (OLS) & Regresi Linear

\`LinearRegression\` menyesuaikan model linear dengan koefisien $w = (w_1, \\dots, w_p)$ untuk meminimalkan kriteria **Residual Sum of Squares (RSS)** antara nilai target sebenarnya dalam dataset dan nilai target yang diprediksi:

$$\\min_w \\|Xw - y\\|_2^2 = \\min_w \\sum_{i=1}^n \\left( y_i - (w_0 + \\sum_{j=1}^p X_{ij} w_j) \\right)^2$$

---

## 5.1.1. Penurunan Solusi Bentuk Tertutup (*Normal Equations*)
Dengan menyamakan turunan parsial terhadap $w$ ke nol:

$$\\nabla_w \\|Xw - y\\|_2^2 = 2 X^T (Xw - y) = 0 \\implies X^T X w = X^T y$$

Jika matriks Gram $X^T X$ memiliki rank penuh (*invertible*):
$$w^* = (X^T X)^{-1} X^T y$$

Scikit-Learn tidak menghitung $(X^T X)^{-1}$ secara langsung karena rentan secara numerik; melainkan menggunakan faktorisasi **LAPACK dgelsd/dgelsy** berbasis Singular Value Decomposition (SVD):
$$w^* = V \\Sigma^{-1} U^T y$$

### Kompleksitas Waktu Komputasi
Estimasi koefisien OLS memiliki kompleksitas teoretis:
$$\\mathcal{O}(n_{\\text{samples}} \\times n_{\\text{features}}^2)$$
Jika $p \\gg n$ atau fitur memiliki korelasi linear sempurna, matriks $X^T X$ menjadi singular (*rank deficient*) dan menghasilkan varians koefisien yang tak terhingga.

---

## 5.1.2. Non-Negative Least Squares (NNLS)
Dengan argumen \`positive=True\`, Scikit-Learn membatasi semua koefisien bernilai non-negatif ($w_j \\ge 0$), sangat berguna untuk data fisik seperti konsentrasi kimiawi atau porsi komposisi belanja:

\`\`\`python
from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([[1.0, 2.0], [2.0, 3.0], [3.0, 5.0], [4.0, 7.0]])
y = np.array([3.1, 5.2, 7.9, 10.8])

# 1. Standard OLS
lr = LinearRegression().fit(X, y)
print("Koefisien OLS Standar :", lr.coef_)
print("Intercept OLS         :", lr.intercept_)

# 2. Non-Negative Least Squares (w >= 0)
lr_nnls = LinearRegression(positive=True).fit(X, y)
print("Koefisien NNLS        :", lr_nnls.coef_)
\`\`\`
`
      },
      {
        id: "ml-bab-5-2",
        slug: "ridge-regression-dan-ridgecv",
        title: "5.2. Ridge Regression (L2 Regularization) & RidgeCV",
        orderIndex: 2,
        description: "Penalti kuadrat Tikhonov, solusi analitis (X^T X + alpha I)^-1 X^T y, stabilitas multikolinearitas, dan tuning otomatis Generalized Cross-Validation (GCV).",
        content_markdown: `# 5.2. Ridge Regression (L2 Regularization) & RidgeCV

\`Ridge\` mengatasi instabilitas inversi matriks OLS saat terjadi multikolinearitas dengan menambahkan penalti besaran koefisien kuadrat ($\\|w\\|_2^2$):

$$\\min_w \\|Xw - y\\|_2^2 + \\alpha \\|w\\|_2^2$$

Di mana parameter $\\alpha \\ge 0$ mengendalikan kekuatan regularisasi:
- Jika $\\alpha = 0$: Solusi kembali ke OLS tanpa batas.
- Jika $\\alpha \\to \\infty$: Seluruh koefisien $w_j$ disusutkan mendekati nol.

---

## 5.2.1. Solusi Bentuk Tertutup Ridge
Dengan menambahkan $\\alpha I_p$ pada diagonal matriks $X^T X$, matriks $(X^T X + \\alpha I)$ **dijamin selalu non-singular dan dapat dibalik** bahkan jika $p > n$:

$$w^* = (X^T X + \\alpha I)^{-1} X^T y$$

---

## 5.2.2. Generalized Cross-Validation (\`RidgeCV\`)
\`RidgeCV\` mengimplementasikan pencarian parameter $\\alpha$ terbaik secara sangat efisien menggunakan formula *Generalized Cross-Validation* (GCV) tanpa perlu melatih ulang model dari nol pada setiap fold:

\`\`\`python
from sklearn.linear_model import Ridge, RidgeCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
import numpy as np

# Penskalaan fitur wajib sebelum regularisasi L2!
alphas = np.logspace(-3, 3, 7) # [0.001, 0.01, 0.1, 1, 10, 100, 1000]

pipe_ridge = make_pipeline(
    StandardScaler(),
    RidgeCV(alphas=alphas, cv=None) # cv=None mengaktifkan GCV efisien
)
pipe_ridge.fit(X, y)

ridge_model = pipe_ridge.named_steps['ridgecv']
print(f"Alpha Optimal Terpilih GCV : {ridge_model.alpha_:.4f}")
print("Koefisien Ter-regularisasi :", ridge_model.coef_)
\`\`\`
`
      },
      {
        id: "ml-bab-5-3",
        slug: "lasso-regression-dan-lassocv",
        title: "5.3. Lasso Regression (L1 Regularization) & LassoCV",
        orderIndex: 3,
        description: "Penalti L1 untuk menghasilkan solusi renggang (sparsity), optimasi Coordinate Descent dengan soft-thresholding, dan seleksi fitur otomatis.",
        content_markdown: `# 5.3. Lasso Regression (L1 Regularization) & LassoCV

\`Lasso\` (*Least Absolute Shrinkage and Selection Operator*) menerapkan penalti norma $\\ell_1$ pada vektor bobot:

$$\\min_w \\frac{1}{2 n_{\\text{samples}}} \\|Xw - y\\|_2^2 + \\alpha \\|w\\|_1$$

Di mana $\\|w\\|_1 = \\sum_{j=1}^p |w_j|$.

---

## 5.3.1. Mekanisme Geometris Sparsity
Fungsi norma $\\ell_1$ tidak memiliki turunan (*non-differentiable*) pada titik $w_j = 0$. Kontur pembatas penalti $\\ell_1$ berbentuk belah ketupat (*hyper-diamond*) dengan sudut-sudut runcing tepat di sumbu koordinat. Kontur elips RSS kemungkinan besar menyentuh sudut ini terlebih dahulu, memaksa banyak koefisien menjadi **tepat nol** ($w_j = 0$).

---

## 5.3.2. Optimasi Coordinate Descent & Soft-Thresholding
Scikit-Learn mengoptimalkan Lasso menggunakan algoritma **Coordinate Descent**. Pada setiap iterasi, hanya satu parameter $w_j$ yang diperbarui dengan mempertahankan parameter lainnya tetap konstan, menggunakan operator *soft-thresholding* $S(z, \\lambda)$:

$$w_j^* = S\\left( \\frac{1}{n} x_j^T (y - X_{-j} w_{-j}), \\alpha \\right) = \\text{sign}(z) \\max(0, |z| - \\alpha)$$

\`\`\`python
from sklearn.linear_model import LassoCV
import numpy as np

# Simulasi data dengan 10 fitur, di mana hanya 2 fitur yang benar-benar berpengaruh
rng = np.random.RandomState(42)
X_sparse = rng.randn(100, 10)
true_weights = np.array([2.5, -1.8, 0, 0, 0, 0, 0, 0, 0, 0])
y_sparse = np.dot(X_sparse, true_weights) + 0.1 * rng.randn(100)

lasso = LassoCV(cv=5, random_state=42).fit(X_sparse, y_sparse)

print(f"Alpha Optimal Lasso: {lasso.alpha_:.4f}")
print("Koefisien yang Dipelajari:\n", np.round(lasso.coef_, 3))
print("Jumlah Fitur Tereliminasi (Bobot Tepat Nol):", np.sum(lasso.coef_ == 0))
\`\`\`
`
      },
      {
        id: "ml-bab-5-4",
        slug: "elastic-net-dan-lars",
        title: "5.4. Elastic-Net Regression, MultiTaskLasso, & LARS",
        orderIndex: 4,
        description: "Kombinasi cembung penalti L1 dan L2 (l1_ratio), efek pengelompokan fitur berkorelasi tinggi, serta Least Angle Regression (LARS).",
        content_markdown: `# 5.4. Elastic-Net Regression, MultiTaskLasso, & LARS

---

## 5.4.1. Elastic-Net (\`ElasticNet\` & \`ElasticNetCV\`)
Lasso memiliki keterbatasan ketika terdapat sekelompok fitur yang saling berkorelasi tinggi: Lasso cenderung memilih satu fitur acak dan mengabaikan sisanya. **Elastic-Net** mengatasi hal ini dengan menggabungkan penalti $\\ell_1$ dan $\\ell_2$:

$$\\min_w \\frac{1}{2n} \\|Xw - y\\|_2^2 + \\alpha \\rho \\|w\\|_1 + \\frac{\\alpha(1 - \\rho)}{2} \\|w\\|_2^2$$

Parameter \`l1_ratio\` merepresentasikan $\\rho \\in [0, 1]$:
- $\\rho = 1$: Murni penalti Lasso (L1).
- $\\rho = 0$: Murni penalti Ridge (L2).
- $0 < \\rho < 1$: Mempertahankan sifat sparsity sekaligus memunculkan efek pengelompokan (*grouping effect* di mana fitur-fitur yang berkorelasi disusutkan bersama).

\`\`\`python
from sklearn.linear_model import ElasticNetCV

enet = ElasticNetCV(l1_ratio=[0.1, 0.5, 0.7, 0.9, 0.99], cv=5, random_state=42)
enet.fit(X_sparse, y_sparse)
print("l1_ratio Optimal :", enet.l1_ratio_)
print("Alpha Optimal    :", enet.alpha_)
\`\`\`

---

## 5.4.2. Least Angle Regression (LARS)
\`Lars\` adalah algoritma efisien untuk dataset berdimensi sangat tinggi ($p \\gg n$). Alih-alih melangkah penuh, LARS bergerak di sepanjang arah ekuiangular di antara fitur-fitur yang paling berkorelasi dengan residual saat ini.
`
      },
      {
        id: "ml-bab-5-5",
        slug: "robust-regression-dan-glm",
        title: "5.5. Regresi Robust (Huber, RANSAC) & Generalized Linear Models (GLM)",
        orderIndex: 5,
        description: "Huber loss, RANSAC random sample consensus, serta regresi Poisson, Gamma, dan Tweedie untuk target non-Gaussian.",
        content_markdown: `# 5.5. Regresi Robust (Huber, RANSAC) & Generalized Linear Models (GLM)

---

## 5.5.1. Regresi Robust terhadap Pencilan (*Outliers*)
Kuadrat galat pada OLS membuatnya sangat rapuh terhadap keberadaan data pencilan. Scikit-Learn menyediakan alternatif tangguh:

1. **\`HuberRegressor\`**:
   Menggunakan fungsi rugi piecewise Huber: kuadratik untuk galat kecil ($|z| \\le \\epsilon$) dan linear untuk galat besar ($|z| > \\epsilon$):
   $$L_\\epsilon(z) = \\begin{cases} \\frac{1}{2} z^2 & \\text{jika } |z| \\le \\epsilon \\\\ \\epsilon |z| - \\frac{1}{2} \\epsilon^2 & \\text{jika } |z| > \\epsilon \\end{cases}$$

2. **\`RANSACRegressor\` (Random Sample Consensus)**:
   Mengekstraksi model berulang kali dari subset data minimum acak, mengelompokkan sampel menjadi inlier vs outlier, dan hanya melatih model akhir pada inlier.

---

## 5.5.2. Generalized Linear Models (GLM)
Jika target $y$ berdistribusi non-Gaussian (misal Poisson untuk cacah diskrit non-negatif atau Gamma untuk durasi waktu positif):
- \`PoissonRegressor\`: Fungsi tautan log $\\log(\\hat{y}) = Xw + b$, target $y \\ge 0$.
- \`TweedieRegressor\`: Generalisasi distribusi eksponensial dengan parameter daya $p_{\\text{power}}$.

\`\`\`python
from sklearn.linear_model import HuberRegressor, RANSACRegressor, PoissonRegressor
import numpy as np

# Simulasi data dengan outlier pencilan ekstrim pada target
X_out = np.linspace(0, 10, 30).reshape(-1, 1)
y_out = 2.5 * X_out.ravel() + np.random.randn(30)
y_out[5] = 120.0 # Outlier drastis

huber = HuberRegressor().fit(X_out, y_out)
ransac = RANSACRegressor(random_state=42).fit(X_out, y_out)

print("Kemiringan Huber  :", huber.coef_[0])
print("Kemiringan RANSAC :", ransac.estimator_.coef_[0])
\`\`\`
`
      },
      {
        id: "ml-bab-5-6",
        slug: "support-vector-regression-svr",
        title: "5.6. Support Vector Regression (SVR) & Regresi Polinomial",
        orderIndex: 6,
        description: "Fungsi rugi epsilon-insensitive, kernel non-linear (RBF, Polynomial), dan transformasi polinomial/spline basis.",
        content_markdown: `# 5.6. Support Vector Regression (SVR) & Regresi Polinomial

---

## 5.6.1. Support Vector Regression (\`SVR\`)
Berbeda dengan OLS yang meminimalkan total kuadrat deviasi, **SVR** mengabaikan deviasi data yang berada di dalam tabung toleransi $[-\\epsilon, +\\epsilon]$ (*$\\epsilon$-insensitive tube*):

$$\\min_{w, b} \\frac{1}{2} \\|w\\|_2^2 + C \\sum_{i=1}^n \\left( \\zeta_i + \\zeta_i^* \\right)$$
$$\\text{s.t.} \\quad \\begin{cases} y_i - (w^T \\phi(x_i) + b) \\le \\epsilon + \\zeta_i \\\\ (w^T \\phi(x_i) + b) - y_i \\le \\epsilon + \\zeta_i^* \\\\ \\zeta_i, \\zeta_i^* \\ge 0 \\end{cases}$$

Fungsi kernel $\\phi(x)$ (seperti RBF / Polinomial) memetakan data ke ruang berdimensi lebih tinggi tanpa perlu menghitung koordinat eksplisit (*Kernel Trick*).

\`\`\`python
from sklearn.svm import SVR
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline
import numpy as np

# Regresi Polinomial Derajat 2
poly_model = make_pipeline(
    PolynomialFeatures(degree=2, include_bias=False),
    LinearRegression()
)
poly_model.fit(X_out, y_out)
print("Fitur Polinomial Terbentuk:", poly_model.named_steps['polynomialfeatures'].get_feature_names_out())
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 6: Supervised Learning - Klasifikasi
  // =========================================================================
  {
    id: "ml-bab-6",
    slug: "bab-6-supervised-learning---klasifikasi",
    title: "BAB 6: Supervised Learning - Klasifikasi & Churn Prediction",
    orderIndex: 6,
    description: "Logistic Regression, Linear & Quadratic Discriminant Analysis (LDA/QDA), Support Vector Machines (SVC), k-Nearest Neighbors, Decision Trees, Random Forest, serta Studi Kasus Industri Churn Prediction.",
    subsections: [
      {
        id: "ml-bab-6-1",
        slug: "logistic-regression-dan-solvers",
        title: "6.1. Logistic Regression & Generalized Solvers",
        orderIndex: 1,
        description: "Fungsi Sigmoid, Cross-Entropy Loss, perbandingan solver optimasi (lbfgs, liblinear, saga, newton-cg), dan strategi multiclass (OvR vs Multinomial).",
        content_markdown: `# 6.1. Logistic Regression & Generalized Solvers

Meskipun menyandang nama "regresi", \`LogisticRegression\` adalah model linear untuk **klasifikasi probabilitas**.

---

## 6.1.1. Fungsi Sigmoid & Log-Loss
Model memetakan kombinasi linear $z = w^T x + b$ ke interval probabilitas $[0, 1]$ melalui fungsi logistik standar (*Sigmoid*):

$$\\sigma(z) = \\frac{1}{1 + e^{-z}} = P(y=1 \\mid x)$$

Optimasi meminimalkan fungsi kerugian Cross-Entropy biner dengan parameter penalti $C = 1/\\lambda$:

$$\\min_{w, c} \\frac{1}{2} w^T w + C \\sum_{i=1}^n \\ln\\left( 1 + \\exp(-y_i (X_i w + c)) \\right)$$

---

## 6.1.2. Tabel Karakteristik Solver di Scikit-Learn

| Solver | Penalti Didukung | Strategi Multiclass | Skala Dataset | Karakteristik Kinerja |
|---|---|---|---|---|
| \`lbfgs\` (Default) | $\\ell_2$, None | Multinomial, OvR | Menengah - Besar | Sangat stabil, algoritma Quasi-Newton orde 2. |
| \`liblinear\` | $\\ell_1$, $\\ell_2$ | Hanya OvR | Kecil - Menengah | Cepat pada dataset kecil, berbasis C library LIBLINEAR. |
| \`saga\` | $\\ell_1$, $\\ell_2$, ElasticNet, None | Multinomial, OvR | Sangat Besar | Varian SGD dengan memori historis gradien, mendukung ElasticNet. |
| \`newton-cg\` | $\\ell_2$, None | Multinomial, OvR | Menengah | Menggunakan Conjugate Gradient untuk aproksimasi Hessian. |

\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

X, y = load_breast_cancer(return_X_y=True)

# Logistic Regression dengan penalti L2 dan solver lbfgs
pipe_lr = make_pipeline(
    StandardScaler(),
    LogisticRegression(C=1.0, solver='lbfgs', max_iter=500, random_state=42)
)
pipe_lr.fit(X, y)

print("Akurasi Training Klasifikasi:", pipe_lr.score(X, y))
print("Estimasi Probabilitas 2 Sampel Pertama:\n", np.round(pipe_lr.predict_proba(X[:2]), 4))
\`\`\`
`
      },
      {
        id: "ml-bab-6-2",
        slug: "support-vector-machines-svc",
        title: "6.2. Support Vector Machines (SVC) & Kernel Trick",
        orderIndex: 2,
        description: "Maksimalisasi margin pemisah, vektor pendukung (support vectors), formulasi dual Lagrange, dan kernel non-linear (RBF, Polynomial, Sigmoid).",
        content_markdown: `# 6.2. Support Vector Machines (SVC) & Kernel Trick

Support Vector Classifier mencari hiperbidang pemisah linear (*separating hyperplane*) yang memaksimalkan jarak margin terhadap observasi terdekat dari masing-masing kelas (**Support Vectors**).

---

## 6.2.1. Formulasi Soft-Margin Primal
Untuk mengatasi data yang tidak dapat dipisahkan secara sempurna (*non-linearly separable*), diperkenalkan variabel kelonggaran (*slack variables*) $\\zeta_i \\ge 0$:

$$\\min_{w, b, \\zeta} \\frac{1}{2} \\|w\\|_2^2 + C \\sum_{i=1}^n \\zeta_i$$
$$\\text{s.t.} \\quad y_i (w^T \\phi(x_i) + b) \\ge 1 - \\zeta_i, \\quad \\zeta_i \\ge 0$$

- Parameter $C > 0$: Keseimbangan antara membesarkan margin pemisah (nilai $C$ kecil) vs meminimalkan kesalahan klasifikasi sampel (nilai $C$ besar).

---

## 6.2.2. Kernel Non-Linear Populer
- **Radial Basis Function (RBF)**:
  $$K(x, x') = \\exp(-\\gamma \\|x - x'\\|^2)$$
  Parameter $\\gamma > 0$ mengendalikan radius pengaruh satu sampel (*support vector*). $\\gamma$ yang terlalu tinggi menyebabkan model overfit membentuk pulau-pulau kecil di sekitar titik data.
- **Polynomial**: $K(x, x') = (\\gamma \\langle x, x' \\rangle + r)^d$

\`\`\`python
from sklearn.svm import SVC
from sklearn.model_selection import cross_val_score

svc_rbf = SVC(kernel='rbf', C=10.0, gamma='scale', random_state=42)
cv_scores = cross_val_score(svc_rbf, X, y, cv=5)
print(f"Rata-rata Akurasi 5-Fold SVC RBF: {cv_scores.mean():.4f}")
\`\`\`
`
      },
      {
        id: "ml-bab-6-3",
        slug: "nearest-neighbors-dan-discriminant-analysis",
        title: "6.3. k-Nearest Neighbors (k-NN) & Discriminant Analysis (LDA/QDA)",
        orderIndex: 3,
        description: "KNeighborsClassifier non-parametrik, struktur data pencarian BallTree/KDTree, serta Linear & Quadratic Discriminant Analysis.",
        content_markdown: `# 6.3. k-Nearest Neighbors (k-NN) & Discriminant Analysis (LDA/QDA)

---

## 6.3.1. k-Nearest Neighbors (\`KNeighborsClassifier\`)
Algoritma *lazy learning* berbasis instans tanpa fase pelatihan eksplisit:
- **Metrik Jarak**: Standar menggunakan Minkowski $D(x, y) = (\\sum |x_i - y_i|^p)^{1/p}$ ($p=2$ Euclidean, $p=1$ Manhattan).
- **Struktur Indeks**: Scikit-Learn secara otomatis memilih algoritma pencarian tercepat:
  - \`'brute'\`: Pencarian brute-force untuk dimensi tinggi ($p > 30$).
  - \`'kd_tree'\`: Partisi ruang ortogonal cepat untuk dimensi rendah ($p < 20$).
  - \`'ball_tree'\`: Struktur metrik bola bersarang yang efisien untuk dimensi menengah.

---

## 6.3.2. Linear & Quadratic Discriminant Analysis (LDA / QDA)
Memodelkan distribusi kondisional setiap kelas $P(x \\mid y=k)$ sebagai distribusi normal multivariat $\\mathcal{N}(\\mu_k, \\Sigma_k)$:
- **LDA (\`LinearDiscriminantAnalysis\`)**: Mengasumsikan semua kelas berbagi matriks kovarians yang sama ($\\Sigma_k = \\Sigma$), menghasilkan batas keputusan linear. Dapat juga berfungsi sebagai reduksi dimensi tersupervisi (*supervised dimensionality reduction*).
- **QDA (\`QuadraticDiscriminantAnalysis\`)**: Mengasumsikan setiap kelas memiliki matriks kovarians unik $\\Sigma_k$, menghasilkan batas keputusan kuadratik kuadratis.

\`\`\`python
from sklearn.neighbors import KNeighborsClassifier
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis

# k-NN dengan k=5 tetangga terdekat
knn = KNeighborsClassifier(n_neighbors=5, weights='distance')
knn.fit(X, y)

# LDA reduksi dimensi
lda = LinearDiscriminantAnalysis(n_components=1)
X_lda = lda.fit_transform(X, y)
print("Dimensi data asli:", X.shape, "-> Dimensi proyeksi LDA:", X_lda.shape)
\`\`\`
`
      },
      {
        id: "ml-bab-6-4",
        slug: "decision-trees-dan-random-forest",
        title: "6.4. Pohon Keputusan (Decision Tree) & Random Forest",
        orderIndex: 4,
        description: "Kriteria Gini Impurity vs Entropi Shannon, Minimal Cost-Complexity Pruning (ccp_alpha), dan ensemble Bagging Random Forest.",
        content_markdown: `# 6.4. Pohon Keputusan (Decision Tree) & Random Forest

---

## 6.4.1. Decision Tree (\`DecisionTreeClassifier\`)
Pohon keputusan mempartisi ruang fitur secara ortogonal biner berdasarkan pemisahan yang menghasilkan penurunan *impurity* terbesar $\\Delta I$:

1. **Gini Impurity (Default)**:
   $$H(Q_m) = 1 - \\sum_{k=1}^K p_{mk}^2$$
2. **Shannon Entropy (Log Loss)**:
   $$H(Q_m) = - \\sum_{k=1}^K p_{mk} \\log_2 p_{mk}$$

### Pemangkasan Pohon (*Pruning*)
Untuk mencegah overfitting, Scikit-Learn menyediakan parameter \`ccp_alpha\` (*Minimal Cost-Complexity Pruning*):
$$R_\\alpha(T) = R(T) + \\alpha |T|$$
Di mana $|T|$ adalah jumlah daun terminal dan $R(T)$ adalah galat klasifikasi.

---

## 6.4.2. Random Forest Classifier
Ensemble yang menggabungkan ratusan pohon keputusan independen:
- **Bootstrap Aggregating**: Setiap pohon dilatih pada sampel acak berukuran $n$ dengan pengembalian (*with replacement*).
- **Random Feature Subspace**: Pada setiap pemisahan node, hanya subset acak berukuran $\\sqrt{p}$ dari total fitur yang dipertimbangkan.

\`\`\`python
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.ensemble import RandomForestClassifier

# Pohon Keputusan dangkal untuk interpretasi instan
dt = DecisionTreeClassifier(max_depth=3, criterion='gini', random_state=42)
dt.fit(X[:, :2], y)
print("Representasi Aturan Pohon Keputusan:\n", export_text(dt, feature_names=['fitur_0', 'fitur_1']))

# Random Forest Ensemble
rf = RandomForestClassifier(n_estimators=100, max_features='sqrt', oob_score=True, random_state=42)
rf.fit(X, y)
print(f"Akurasi Out-of-Bag (OOB): {rf.oob_score_:.4f}")
\`\`\`
`
      },
      {
        id: "ml-bab-6-5",
        slug: "studi-kasus-churn-prediction-imbalanced",
        title: "6.5. Studi Kasus Industri: Pipeline Churn Prediction & Imbalanced Data",
        orderIndex: 5,
        description: "Pipeline end-to-end prediksi churn pelanggan telekomunikasi, penanganan kelas minoritas (class_weight='balanced'), threshold moving, dan evaluasi PR-AUC.",
        content_markdown: `# 6.5. Studi Kasus Industri: Pipeline Churn Prediction & Imbalanced Data

Pada skenario churn pelanggan industri telekomunikasi atau SaaS, pelanggan yang churn biasanya minoritas (misal 10-15%). 

---

## 6.5.1. Paradoks Akurasi (*Accuracy Paradox*)
Jika model selalu memprediksi "Tidak Churn" untuk semua pelanggan, akurasinya mencapai 85-90%, namun model sama sekali tidak berguna secara bisnis. Solusinya:
1. **Pembobotan Biaya Kelas**: Menggunakan parameter \`class_weight='balanced'\`:
   $$w_k = \\frac{n_{\\text{samples}}}{n_{\\text{classes}} \\times n_k}$$
2. **Evaluasi Berbasis PR-AUC & ROC-AUC**: Mengukur area di bawah kurva Precision-Recall.
3. **Threshold Moving**: Menurunkan ambang batas keputusan probabilitas dari default $0.5$ menjadi $0.35$ untuk meningkatkan recall pelanggan berisiko tinggi.

\`\`\`python
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, average_precision_score
from sklearn.model_selection import train_test_split
import numpy as np

# Simulasi data churn tidak seimbang (85% Tetap, 15% Churn)
rng = np.random.RandomState(42)
X_churn = rng.randn(1000, 6)
y_churn = rng.choice([0, 1], size=1000, p=[0.85, 0.15])

X_tr, X_te, y_tr, y_te = train_test_split(X_churn, y_churn, test_size=0.25, stratify=y_churn, random_state=42)

# Latih model dengan class_weight='balanced'
clf_churn = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
clf_churn.fit(X_tr, y_tr)

# Probabilitas kelas churn (index 1)
y_prob = clf_churn.predict_proba(X_te)[:, 1]

# Threshold tuning: threshold 0.35 untuk menangkap lebih banyak churn
y_pred_tuned = (y_prob >= 0.35).astype(int)

print(f"ROC-AUC Score : {roc_auc_score(y_te, y_prob):.4f}")
print(f"PR-AUC Score  : {average_precision_score(y_te, y_prob):.4f}")
print("\nLaporan Klasifikasi (Threshold 0.35):\n", classification_report(y_te, y_pred_tuned, target_names=['Tetap', 'Churn']))
\`\`\`
`
      }
    ]
  }
];
