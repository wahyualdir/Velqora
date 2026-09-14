import { DocSectionItem } from "@/components/modul/doc-reader-layout";

/**
 * BAB 1 - 6 KURIKULUM MACHINE LEARNING VELQORA
 * Mengintegrasikan materi mendalam, formulasi matematis, dan kode Python resmi Scikit-Learn 1.9
 * ke dalam struktur Bab asli website Velqora.
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
    description: "Aljabar Linear (vektor, matriks, rank), kalkulus diferensial multivariabel (gradien, chain rule), probabilitas & statistika, serta pustaka komputasi Python (NumPy, Pandas, Matplotlib).",
    subsections: [
      {
        id: "ml-bab-1-1",
        slug: "aljabar-linear-vektor-matriks",
        title: "1.1. Aljabar Linear: Vektor, Matriks, dan Operasi Ruang Vektor",
        orderIndex: 1,
        description: "Representasi data dalam bentuk matriks X (n_samples, n_features) dan target y (n_samples), perkalian titik (dot product), norma L1/L2, serta dekomposisi matriks.",
        content_markdown: `# 1.1. Aljabar Linear: Vektor, Matriks, dan Operasi Ruang Vektor

Dalam machine learning dan Scikit-Learn, data tabular direpresentasikan sebagai matriks dua dimensi $X \\in \\mathbb{R}^{n \\times p}$ di mana:
- $n = n_{\\text{samples}}$: Jumlah baris atau sampel observasi data.
- $p = n_{\\text{features}}$: Jumlah kolom atau variabel fitur numerik.

Target prediksi kontinu atau diskrit direpresentasikan sebagai vektor satu dimensi $y \\in \\mathbb{R}^n$.

---

## 1.1.1. Perkalian Titik (Dot Product) dan Proyeksi Linear
Persamaan model linear dapat dituliskan secara ringkas sebagai perkalian dot product antara vektor bobot $w$ dan vektor fitur $x$:

$$\\hat{y}(w, x) = w_0 + w_1 x_1 + \\dots + w_p x_p = w_0 + w^T x = w_0 + \\langle w, x \\rangle$$

Di Scikit-Learn, vektor bobot $w$ disimpan dalam atribut \`coef_\` dan bias $w_0$ dalam \`intercept_\`.

---

## 1.1.2. Norma Vektor (Vector Norms)
Norma mengukur besaran atau panjang suatu vektor, yang menjadi dasar teknik regularisasi:
- **Norma Euclidean ($\\ell_2$-norm)**: Menjadi dasar penalti Ridge (Tikhonov Regularization):
  $$\\|w\\|_2 = \\sqrt{\\sum_{j=1}^p w_j^2}$$
- **Norma Manhattan ($\\ell_1$-norm)**: Menjadi dasar penalti Lasso untuk seleksi fitur renggang (*sparsity*):
  $$\\|w\\|_1 = \\sum_{j=1}^p |w_j|$$

\`\`\`python
import numpy as np

# Representasi Matriks Fitur X dan Vektor Bobot w
X = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])
w = np.array([0.5, -0.2])
b = 1.0

# Operasi linear forward pass: y_hat = X @ w + b
y_hat = np.dot(X, w) + b
print("Matriks Fitur X (shape):", X.shape)
print("Hasil Prediksi Linear y_hat:", y_hat)
print("Norma L2 bobot ||w||_2:", np.linalg.norm(w, ord=2))
print("Norma L1 bobot ||w||_1:", np.linalg.norm(w, ord=1))
\`\`\`
`
      },
      {
        id: "ml-bab-1-2",
        slug: "kalkulus-diferensial-gradien",
        title: "1.2. Kalkulus Diferensial Multivariabel: Turunan Parsial & Gradien",
        orderIndex: 2,
        description: "Optimasi fungsi rugi (Loss Function) menggunakan gradien, turunan parsial, dan algoritma Gradient Descent.",
        content_markdown: `# 1.2. Kalkulus Diferensial Multivariabel: Turunan Parsial & Gradien

Pelatihan model machine learning pada dasarnya adalah masalah optimasi matematis: menemukan vektor parameter $w$ yang meminimalkan fungsi biaya empiris $J(w)$.

---

## 1.2.1. Vektor Gradien (Gradient Vector)
Gradien dari fungsi skalar $J(w)$ terhadap vektor $w = (w_1, \\dots, w_p)^T$ adalah vektor turunan parsial yang menunjuk ke arah peningkatan nilai fungsi paling curam:

$$\\nabla_w J(w) = \\left[ \\frac{\\partial J}{\\partial w_1}, \\frac{\\partial J}{\\partial w_2}, \\dots, \\frac{\\partial J}{\\partial w_p} \\right]^T$$

---

## 1.2.2. Algoritma Gradient Descent
Untuk meminimalkan fungsi biaya, parameter diperbarui secara berlawanan arah dengan gradien dengan laju pembelajaran (*learning rate*) $\\eta > 0$:

$$w^{(t+1)} = w^{(t)} - \\eta \\nabla_w J(w^{(t)})$$

Pada model Ordinary Least Squares (OLS), fungsi rugi kuadratik $J(w) = \\frac{1}{2n} \\|Xw - y\\|_2^2$ memiliki gradien eksak:

$$\\nabla_w J(w) = \\frac{1}{n} X^T (Xw - y)$$

\`\`\`python
import numpy as np

# Simulasi Gradient Descent dari dasar
np.random.seed(42)
X = 2 * np.random.rand(100, 1)
y = 4 + 3 * X + np.random.randn(100, 1)

# Tambahkan x0 = 1 untuk bias intercept
X_b = np.c_[np.ones((100, 1)), X]

eta = 0.1  # Learning rate
n_iterations = 500
m = 100

w = np.random.randn(2, 1)  # Inisialisasi acak
for iteration in range(n_iterations):
    gradients = 2/m * X_b.T.dot(X_b.dot(w) - y)
    w = w - eta * gradients

print("Parameter terkonvergensi w0 (bias):", w[0][0])
print("Parameter terkonvergensi w1 (slope):", w[1][0])
\`\`\`
`
      },
      {
        id: "ml-bab-1-3",
        slug: "probabilitas-statistika-komputasi-python",
        title: "1.3. Probabilitas, Statistika & Ekosistem Komputasi Python",
        orderIndex: 3,
        description: "Distribusi probabilitas (Gaussian, Bernoulli), nilai ekspektasi, varians, kovarians, serta pustaka NumPy, Pandas, dan Matplotlib.",
        content_markdown: `# 1.3. Probabilitas, Statistika & Ekosistem Komputasi Python

Pemodelan probabilistik dalam machine learning menjembatani data mentah dengan inferensi ketidakpastian.

---

## 1.3.1. Distribusi Normal Gaussian Multivariat
Distribusi normal adalah fondasi banyak estimator Scikit-Learn (seperti Linear Regression, Linear Discriminant Analysis, dan Gaussian Naive Bayes):

$$\\mathcal{N}(x | \\mu, \\Sigma) = \\frac{1}{(2\\pi)^{p/2} |\\Sigma|^{1/2}} \\exp\\left( -\\frac{1}{2} (x - \\mu)^T \\Sigma^{-1} (x - \\mu) \\right)$$

Di mana $\\mu$ adalah vektor rata-rata dan $\\Sigma$ adalah matriks kovarians $p \\times p$.

---

## 1.3.2. Pustaka Komputasi Standar: NumPy & Pandas
Scikit-Learn berinteraksi langsung dengan array NumPy (\`numpy.ndarray\`) dan DataFrame Pandas (\`pandas.DataFrame\`):

\`\`\`python
import numpy as np
import pandas as pd

# Membuat DataFrame eksperimen data
data = {
    'fitur_1': [2.5, 3.1, 1.8, 4.2, 5.0],
    'fitur_2': [15.0, 22.0, 10.5, 31.0, 40.0],
    'target': [1, 1, 0, 1, 0]
}
df = pd.DataFrame(data)

print("Statistik Deskriptif:\n", df.describe().round(2))
print("\nMatriks Kovarians:\n", np.cov(df[['fitur_1', 'fitur_2']].values, rowvar=False).round(3))
\`\`\`
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
    title: "BAB 2: Dasar-Dasar Data",
    orderIndex: 2,
    description: "Data cleaning, Exploratory Data Analysis (EDA), rekayasa fitur (feature engineering & scaling), penanganan missing values & imbalanced data (SMOTE), dan paradigma Data-Centric AI.",
    subsections: [
      {
        id: "ml-bab-2-1",
        slug: "feature-scaling-standardization",
        title: "2.1. Penskalaan & Standardisasi Fitur (Feature Scaling)",
        orderIndex: 1,
        description: "StandardScaler, MinMaxScaler, RobustScaler, Normalizer, serta transformasi distribusi PowerTransformer (Box-Cox & Yeo-Johnson).",
        content_markdown: `# 2.1. Penskalaan & Standardisasi Fitur (Feature Scaling)

Banyak estimator machine learning (seperti SVM, regresi linear berpenalti, SGD, dan k-NN) mengasumsikan seluruh fitur berada pada skala yang sebanding. Jika suatu fitur memiliki rentang nilai magnitudo yang jauh lebih besar dari fitur lainnya, fungsi rugi akan didominasi oleh fitur tersebut.

---

## 2.1.1. StandardScaler
Menghapus rata-rata $\\mu$ dan menskalakan fitur ke unit varians $\\sigma = 1$:

$$z = \\frac{x - \\mu}{\\sigma}$$

\`\`\`python
from sklearn.preprocessing import StandardScaler
import numpy as np

data = np.array([[0, 0], [0, 0], [1, 1], [1, 1]])
scaler = StandardScaler()
scaled = scaler.fit_transform(data)

print("Rata-rata fitur yang dipelajari (mean_):", scaler.mean_)
print("Data setelah Standardisasi:\n", scaled)
\`\`\`

---

## 2.1.2. RobustScaler
Menggunakan statistik median dan rentang interkuartil (IQR = $Q_3 - Q_1$) sehingga sangat kebal terhadap keberadaan pencilan (*outliers*):

$$x_{\\text{robust}} = \\frac{x - \\text{median}}{\\text{IQR}}$$

---

## 2.1.3. MinMaxScaler & MaxAbsScaler
- \`MinMaxScaler\`: Menskalakan data ke rentang tertutup yang ditentukan pengguna, biasanya $[0, 1]$.
- \`MaxAbsScaler\`: Membagi setiap nilai dengan nilai absolut maksimum, mempertahankan representasi matriks jarang (*sparse matrices*).
`
      },
      {
        id: "ml-bab-2-2",
        slug: "imputation-missing-values",
        title: "2.2. Penanganan Nilai Hilang (Imputation of Missing Values)",
        orderIndex: 2,
        description: "SimpleImputer (mean, median, most_frequent), KNNImputer (tetangga terdekat), dan IterativeImputer (MICE).",
        content_markdown: `# 2.2. Penanganan Nilai Hilang (Imputation of Missing Values)

Dataset dunia nyata sering kali mengandung nilai yang hilang (\`NaN\` atau \`None\`). Scikit-Learn menyediakan estimator canggih untuk imputasi data:

---

## 2.2.1. SimpleImputer
Mengisi nilai kosong dengan statistik univariat:
- \`strategy='mean'\`: Rata-rata nilai (untuk data numerik berdistribusi normal).
- \`strategy='median'\`: Median (robust terhadap outlier numerik).
- \`strategy='most_frequent'\`: Modus (untuk data kategorikal/string).
- \`strategy='constant'\`: Nilai pengisi konstan (\`fill_value\`).

\`\`\`python
import numpy as np
from sklearn.impute import SimpleImputer

X = [[np.nan, 2], [6, np.nan], [7, 6]]
imp = SimpleImputer(missing_values=np.nan, strategy='mean')
print("Hasil Imputasi Mean:\n", imp.fit_transform(X))
\`\`\`

---

## 2.2.2. KNNImputer & IterativeImputer
- **KNNImputer**: Mengisi nilai hilang berdasarkan rata-rata berbobot dari $k$-tetangga terdekat yang memiliki fitur lengkap.
- **IterativeImputer (MICE)**: Memodelkan setiap fitur yang hilang secara sekuensial sebagai fungsi regresi dari seluruh fitur lainnya (*Multivariate Imputation by Chained Equations*).
`
      },
      {
        id: "ml-bab-2-3",
        slug: "categorical-encoding-discretization",
        title: "2.3. Encoding Variabel Kategorikal & Diskritisasi Fitur",
        orderIndex: 3,
        description: "OneHotEncoder, OrdinalEncoder, TargetEncoder dengan smoothing empiris, serta KBinsDiscretizer dan Binarizer.",
        content_markdown: `# 2.3. Encoding Variabel Kategorikal & Diskritisasi Fitur

Model machine learning membutuhkan input dalam bentuk numerik. Scikit-Learn menyediakan transformasi fitur kategorikal:

---

## 2.3.1. OneHotEncoder
Mengubah kategori diskrit menjadi vektor biner *dummy*:
- \`drop='first'\`: Menghapus kategori pertama untuk mencegah multikolinearitas sempurna (*dummy variable trap*).
- \`handle_unknown='ignore'\`: Mengabaikan kategori baru yang muncul di data uji dengan mengisi vektor 0.

\`\`\`python
from sklearn.preprocessing import OneHotEncoder

enc = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
X = [['Laki-laki', 'Jakarta'], ['Perempuan', 'Bandung'], ['Perempuan', 'Surabaya']]
enc.fit(X)

print("Kategori yang dipelajari:", enc.categories_)
print("Hasil Transformasi Biner:\n", enc.transform([['Perempuan', 'Jakarta']]))
\`\`\`

---

## 2.3.2. TargetEncoder (Fitur Baru Scikit-Learn Modern)
\`TargetEncoder\` mengodekan kategori berdasarkan nilai rata-rata target bersyarat $E[y | x = c]$. Algoritma menyertakan mekanisme *empirical Bayes smoothing* untuk mencegah kebocoran target (*target leakage*) dan overfitting pada kategori dengan frekuensi kemunculan rendah.
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
    description: "Supervised vs Unsupervised vs Reinforcement Learning, Bias-Variance Tradeoff, pencegahan overfitting/underfitting, Cross-Validation, regularisasi (L1, L2, Elastic Net), dan Hyperparameter Tuning.",
    subsections: [
      {
        id: "ml-bab-3-1",
        slug: "paradigma-pembelajaran-mesin",
        title: "3.1. Paradigma Pembelajaran: Supervised, Unsupervised & Reinforcement",
        orderIndex: 1,
        description: "Taksonomi utama machine learning, perbedaan data berlabel vs tanpa label, dan estimasi fungsi pemetaan f(X) -> y.",
        content_markdown: `# 3.1. Paradigma Pembelajaran: Supervised, Unsupervised & Reinforcement

Machine Learning terbagi dalam tiga paradigma utama:

1. **Supervised Learning (Pembelajaran Terawasi)**:
   Dataset terdiri dari pasangan input-output $(x_i, y_i)$. Model mencari fungsi pendekatan $\\hat{y} = f(x)$ yang meminimalkan galat prediksi.
   - *Regresi*: Target $y$ bersifat kontinu (harga rumah, suhu, curah hujan).
   - *Klasifikasi*: Target $y$ bersifat diskrit/kategorikal (spam vs bukan spam, deteksi churn).

2. **Unsupervised Learning (Pembelajaran Tak Terawasi)**:
   Data hanya berupa input $x_i$ tanpa label target. Tujuannya menemukan pola intrinsik, pengelompokan (*clustering*), atau reduksi dimensi laten.

3. **Reinforcement Learning (Pembelajaran Penguatan)**:
   Agen belajar mengambil tindakan (*actions*) dalam lingkungan dinamis untuk memaksimalkan akumulasi hadiah (*reward*) kumulatif.
`
      },
      {
        id: "ml-bab-3-2",
        slug: "bias-variance-tradeoff",
        title: "3.2. Trade-Off Bias-Varians & Pencegahan Overfitting",
        orderIndex: 2,
        description: "Dekomposisi galat generalisasi, tanda-tanda underfitting vs overfitting, dan kurva kompleksitas model.",
        content_markdown: `# 3.2. Trade-Off Bias-Varians & Pencegahan Overfitting

Ekspektasi galat kuadratik prediksi dapat didekomposisi menjadi tiga komponen independen:

$$\\mathbb{E}\\left[(y - \\hat{f}(x))^2\\right] = \\text{Bias}[\\hat{f}(x)]^2 + \\text{Var}[\\hat{f}(x)] + \\sigma^2$$

- **Bias Kuadrat**: Kesalahan yang timbul akibat asumsi model yang terlalu sederhana (*underfitting*).
- **Varians**: Sensitivitas model terhadap fluktuasi kecil pada data latihan (*overfitting*).
- **$\\sigma^2$ (Irreducible Error)**: Derau inheren pada data yang tidak dapat dihilangkan oleh model apa pun.

### Strategi Mengatasi Overfitting:
1. Menambahkan penalti regularisasi (L1 / L2).
2. Mengurangi kompleksitas model (membatasi kedalaman pohon \`max_depth\`).
3. Menambah jumlah data pelatihan atau menerapkan data augmentation.
4. Menerapkan skema Cross-Validation yang ketat.
`
      },
      {
        id: "ml-bab-3-3",
        slug: "cross-validation-schemes",
        title: "3.3. Skema Validasi Silang (Cross-Validation)",
        orderIndex: 3,
        description: "KFold, StratifiedKFold, GroupKFold, TimeSeriesSplit, dan fungsi cross_val_score serta cross_validate.",
        content_markdown: `# 3.3. Skema Validasi Silang (Cross-Validation)

Menguji model pada data yang sama dengan data latihan adalah kesalahan metodologis fatal yang memicu overfitting palsu.

---

## 3.3.1. K-Fold & Stratified K-Fold
\`KFold\` membagi dataset menjadi $k$ lipatan berukuran sama. \`StratifiedKFold\` memastikan persentase setiap kelas target tetap seimbang di setiap fold:

\`\`\`python
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

clf = LogisticRegression(max_iter=200)
scores = cross_val_score(clf, X, y, cv=cv, scoring='accuracy')

print("Akurasi tiap fold:", scores.round(3))
print(f"Rata-rata Akurasi: {scores.mean():.3f} (+/- {scores.std():.3f})")
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
    description: "Inferensi Bayesian (Prior, Likelihood, Posterior), Gaussian Process untuk regresi non-parametrik, Bayesian Optimization untuk tuning hyperparameter cerdas, dan Naive Bayes lanjutan.",
    subsections: [
      {
        id: "ml-bab-4-1",
        slug: "inferensi-bayesian-prinsip-dasar",
        title: "4.1. Fondasi Teorema Bayes & Inferensi Probabilistik",
        orderIndex: 1,
        description: "Teorema Bayes, pembaruan keyakinan prior ke posterior, Maximum Likelihood Estimation (MLE) vs Maximum A Posteriori (MAP).",
        content_markdown: `# 4.1. Fondasi Teorema Bayes & Inferensi Probabilistik

Pendekatan Bayesian memandang parameter model $w$ bukan sebagai konstanta tetap, melainkan sebagai variabel acak yang memiliki distribusi probabilitas:

$$P(w | D) = \\frac{P(D | w) P(w)}{P(D)} = \\frac{P(D | w) P(w)}{\\int P(D | w') P(w') dw'}$$

- **$P(w)$ (Prior)**: Keyakinan awal mengenai parameter sebelum melihat data observasi.
- **$P(D | w)$ (Likelihood)**: Probabilitas kemunculan data $D$ diberikan nilai parameter $w$.
- **$P(w | D)$ (Posterior)**: Keyakinan yang telah diperbarui setelah mengamati data observasi.

Hubungan dengan Regularisasi:
- Estimasi **MLE** (Maximum Likelihood) murni setara dengan Ordinary Least Squares tanpa regularisasi.
- Estimasi **MAP** dengan prior Gaussian $w \\sim \\mathcal{N}(0, \\sigma^2)$ setara persis dengan **Ridge Regression (L2)**.
- Estimasi **MAP** dengan prior Laplace setara persis dengan **Lasso Regression (L1)**.
`
      },
      {
        id: "ml-bab-4-2",
        slug: "naive-bayes-classifiers",
        title: "4.2. Pengklasifikasi Naive Bayes (Gaussian, Multinomial, Bernoulli)",
        orderIndex: 2,
        description: "Algoritma Naive Bayes berbasis asumsi independensi bersyarat fitur, GaussianNB, MultinomialNB untuk teks, dan ComplementNB.",
        content_markdown: `# 4.2. Pengklasifikasi Naive Bayes

Naive Bayes mengasumsikan setiap pasang fitur saling independen secara kondisional diberikan label kelas $y$:

$$P(y | x_1, \\dots, x_p) \\propto P(y) \\prod_{j=1}^p P(x_j | y)$$

---

## 4.2.1. Varian di Scikit-Learn:
1. **GaussianNB**: Untuk fitur bernilai kontinu:
   $$P(x_j | y) = \\frac{1}{\\sqrt{2\\pi \\sigma_{y,j}^2}} \\exp\\left( -\\frac{(x_j - \\mu_{y,j})^2}{2\\sigma_{y,j}^2} \\right)$$
2. **MultinomialNB**: Untuk data diskrit frekuensi kata dalam klasifikasi teks.
3. **BernoulliNB**: Untuk data dengan fitur biner boolean (kehadiran fitur 0 atau 1).
4. **ComplementNB**: Dirancang khusus untuk dataset yang tidak seimbang (*imbalanced*).

\`\`\`python
from sklearn.datasets import load_iris
from sklearn.naive_bayes import GaussianNB

X, y = load_iris(return_X_y=True)
gnb = GaussianNB().fit(X, y)
print("Prior Kelas yang Dipelajari:", gnb.class_prior_)
print("Prediksi untuk sampel baru:", gnb.predict([X[0]]))
\`\`\`
`
      },
      {
        id: "ml-bab-4-3",
        slug: "gaussian-process-regression-bayesian-ridge",
        title: "4.3. Bayesian Ridge & Gaussian Process Regression (GPR)",
        orderIndex: 3,
        description: "BayesianRidge, ARDRegression, GaussianProcessRegressor dengan berbagai fungsi kernel (RBF, Matern, WhiteKernel) untuk estimasi ketidakpastian.",
        content_markdown: `# 4.3. Bayesian Ridge & Gaussian Process Regression (GPR)

---

## 4.3.1. Bayesian Ridge Regression (\`BayesianRidge\`)
Mengasumsikan prior Gaussian pada bobot $w$ dan derau data $\\alpha$, di mana hyperparameter diperbarui secara otomatis selama proses fitting tanpa perlu grid search:

\`\`\`python
from sklearn.linear_model import BayesianRidge
import numpy as np

X = np.array([[1, 1], [2, 1], [3, 2], [4, 2]])
y = np.array([2.0, 3.1, 4.0, 5.2])

reg = BayesianRidge()
reg.fit(X, y)
y_pred, y_std = reg.predict([[2.5, 1.5]], return_std=True)

print(f"Prediksi: {y_pred[0]:.3f} +/- {y_std[0]:.3f} (Std Error)")
\`\`\`

---

## 4.3.2. Gaussian Process Regression (\`GaussianProcessRegressor\`)
Pendekatan non-parametrik di mana fungsi itu sendiri dimodelkan sebagai proses stokastik Gaussian. Menyediakan batas keyakinan analitis (*analytical confidence bounds*) yang ideal untuk Bayesian Optimization.
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
    description: "Linear & Polynomial Regression, Ridge Regression (L2 penalty), Lasso Regression (L1 feature selection), Elastic Net, serta Support Vector Regression (SVR).",
    subsections: [
      {
        id: "ml-bab-5-1",
        slug: "ordinary-least-squares-linear-regression",
        title: "5.1. Ordinary Least Squares (OLS) & Regresi Linear Sederhana",
        orderIndex: 1,
        description: "Formulasi matematis OLS, solusi persamaan normal closed-form, dan atribut coef_ serta intercept_.",
        content_markdown: `# 5.1. Ordinary Least Squares (OLS)

Ordinary Least Squares meminimalkan jumlah kuadrat residual antara target aktual dan estimasi linear:

$$\\min_w \\|Xw - y\\|_2^2 = (y - Xw)^T (y - Xw)$$

Solusi analitis bentuk tertutup (*closed-form normal equation*):

$$w^* = (X^T X)^{-1} X^T y$$

\`\`\`python
from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2.1, 4.2, 6.1, 8.0, 10.2])

model = LinearRegression().fit(X, y)
print("Slope (coef_):", model.coef_[0])
print("Intercept (intercept_):", model.intercept_)
print("Skor R2:", model.score(X, y))
\`\`\`
`
      },
      {
        id: "ml-bab-5-2",
        slug: "ridge-regression-l2",
        title: "5.2. Ridge Regression (L2 Regularization) & RidgeCV",
        orderIndex: 2,
        description: "Penalti kuadrat Tikhonov untuk menangani multikolinearitas dan tuning parameter alpha dengan RidgeCV.",
        content_markdown: `# 5.2. Ridge Regression (L2 Regularization)

Ridge Regression mengatasi ketidakstabilan inversi $(X^T X)^{-1}$ pada OLS saat terjadi multikolinearitas antar fitur dengan menambahkan penalti norma $\\ell_2$:

$$\\min_w \\|Xw - y\\|_2^2 + \\alpha \\|w\\|_2^2$$

Solusi analitisnya selalu terdefinisi (*non-singular*):

$$w^* = (X^T X + \\alpha I)^{-1} X^T y$$

\`\`\`python
from sklearn.linear_model import RidgeCV

# Cross-validation otomatis untuk mencari alpha terbaik
ridge = RidgeCV(alphas=[0.01, 0.1, 1.0, 10.0])
ridge.fit(X, y)
print("Alpha optimal terpilih:", ridge.alpha_)
print("Koefisien ter-regularisasi:", ridge.coef_)
\`\`\`
`
      },
      {
        id: "ml-bab-5-3",
        slug: "lasso-regression-l1",
        title: "5.3. Lasso Regression (L1 Regularization) & Seleksi Fitur",
        orderIndex: 3,
        description: "Penalti L1 untuk mendorong solusi bobot nol (sparse coefficients) sebagai mekanisme seleksi fitur otomatis.",
        content_markdown: `# 5.3. Lasso Regression (L1 Regularization)

Lasso (*Least Absolute Shrinkage and Selection Operator*) menerapkan penalti norma $\\ell_1$:

$$\\min_w \\frac{1}{2n} \\|Xw - y\\|_2^2 + \\alpha \\|w\\|_1$$

Geometri penalti $\\ell_1$ yang memiliki sudut lancip pada sumbu koordinat mendorong banyak koefisien menjadi tepat nol ($w_j = 0$), sehingga menghasilkan model yang hemat fitur (*sparse*) dan sangat mudah diinterpretasikan.
`
      },
      {
        id: "ml-bab-5-4",
        slug: "elastic-net-regression",
        title: "5.4. Elastic-Net Regression: Menggabungkan L1 & L2",
        orderIndex: 4,
        description: "Kombinasi penalti L1 dan L2 dengan parameter l1_ratio untuk data dengan korelasi tinggi antar fitur.",
        content_markdown: `# 5.4. Elastic-Net Regression

Elastic-Net menggabungkan keunggulan seleksi fitur Lasso dengan stabilitas penyusutan Ridge:

$$\\min_w \\frac{1}{2n} \\|Xw - y\\|_2^2 + \\alpha \\rho \\|w\\|_1 + \\frac{\\alpha(1 - \\rho)}{2} \\|w\\|_2^2$$

Parameter \`l1_ratio\` mewakili $\\rho \\in [0, 1]$. Sangat efektif ketika terdapat beberapa fitur yang saling berkorelasi tinggi (*group effect*).
`
      },
      {
        id: "ml-bab-5-5",
        slug: "support-vector-regression-robust",
        title: "5.5. Support Vector Regression (SVR) & Regresi Non-Linear",
        orderIndex: 5,
        description: "SVR dengan tabung epsilon, kernel RBF/Polinomial, serta Generalized Linear Models (GLM) dan Regresi Polinomial.",
        content_markdown: `# 5.5. Support Vector Regression (SVR)

SVR meminimalkan galat dengan fungsi rugi $\\epsilon$-insensitive: deviasi prediksi yang berada di dalam interval $[-\\epsilon, +\\epsilon]$ diabaikan:

$$\\min_{w, b} \\frac{1}{2} \\|w\\|_2^2 + C \\sum_{i=1}^n \\max(0, |y_i - (w^T \\phi(x_i) + b)| - \\epsilon)$$

\`\`\`python
from sklearn.svm import SVR
import numpy as np

X = np.sort(5 * np.random.rand(40, 1), axis=0)
y = np.sin(X).ravel()

svr = SVR(kernel='rbf', C=100, gamma=0.1, epsilon=0.1)
svr.fit(X, y)
print("Prediksi titik x=3.0:", svr.predict([[3.0]])[0])
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 6: Supervised Learning - Klasifikasi & Churn Prediction
  // =========================================================================
  {
    id: "ml-bab-6",
    slug: "bab-6-supervised-learning---klasifikasi",
    title: "BAB 6: Supervised Learning - Klasifikasi & Churn Prediction",
    orderIndex: 6,
    description: "Algoritma klasifikasi komprehensif: Logistic Regression, K-Nearest Neighbors (KNN), Decision Tree, Random Forest, Support Vector Machine (SVM), serta Gradient Boosted Trees (XGBoost, LightGBM, CatBoost).",
    subsections: [
      {
        id: "ml-bab-6-1",
        slug: "logistic-regression-classification",
        title: "6.1. Logistic Regression & Batas Keputusan Linear",
        orderIndex: 1,
        description: "Fungsi sigmoid logistik, odds ratio, fungsi rugi log-loss (binary cross-entropy), dan penalti C regularisasi.",
        content_markdown: `# 6.1. Logistic Regression

Logistic Regression memodelkan probabilitas posterior kelas positif menggunakan fungsi sigmoid:

$$p = P(y = 1 | x) = \\sigma(w^T x + b) = \\frac{1}{1 + e^{-(w^T x + b)}}$$

Log-odds (*logit*) bersifat linear terhadap fitur input:

$$\\ln \\left( \\frac{p}{1 - p} \\right) = w^T x + b$$

\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_breast_cancer

X, y = load_breast_cancer(return_X_y=True)
clf = LogisticRegression(max_iter=5000, class_weight='balanced')
clf.fit(X, y)

print("Akurasi Model:", clf.score(X, y).round(4))
print("Probabilitas sampel pertama:", clf.predict_proba(X[:1]).round(3))
\`\`\`
`
      },
      {
        id: "ml-bab-6-2",
        slug: "knn-svm-classifiers",
        title: "6.2. K-Nearest Neighbors (k-NN) & Support Vector Classifier (SVC)",
        orderIndex: 2,
        description: "k-NN berbasis metrik jarak dan SVM batas margin maksimal dengan kernel RBF dan trik kernel.",
        content_markdown: `# 6.2. K-Nearest Neighbors (k-NN) & Support Vector Classifier (SVC)

- **k-NN** (\`KNeighborsClassifier\`): Algoritma non-parametrik yang menetapkan label mayoritas dari $k$ tetangga terdekat. Sensitif terhadap skala fitur.
- **SVC** (\`SVC\`): Mencari hiperbidang pemisah dengan margin pemisah terbesar (*maximum margin hyperplane*). Kernel RBF memetakan data ke ruang berdimensi tak terhingga untuk memisahkan kelas non-linear.
`
      },
      {
        id: "ml-bab-6-3",
        slug: "tree-based-classifiers-random-forest",
        title: "6.3. Pohon Keputusan (Decision Tree) & Random Forest",
        orderIndex: 3,
        description: "DecisionTreeClassifier dengan Gini/Entropy, ensemble bagging RandomForest, dan feature importances.",
        content_markdown: `# 6.3. Pohon Keputusan (Decision Tree) & Random Forest

Pohon keputusan membagi ruang fitur secara ortogonal menggunakan aturan biner sederhana:
- \`DecisionTreeClassifier\`: Sangat mudah diinterpretasikan, tetapi rentan terhadap varians tinggi (*overfitting*).
- \`RandomForestClassifier\`: Menggabungkan ratusan pohon keputusan yang dilatih pada sampel bootstrap dengan subset fitur acak (*bagging*), secara drastis memangkas varians model.
`
      },
      {
        id: "ml-bab-6-4",
        slug: "churn-prediction-pipeline-imbalance",
        title: "6.4. Studi Kasus Industri: Pipeline Churn Prediction & Imbalanced Data",
        orderIndex: 4,
        description: "Pipeline end-to-end prediksi churn pelanggan telekomunikasi, penanganan kelas tidak seimbang (class_weight='balanced'), dan evaluasi ROC-AUC.",
        content_markdown: `# 6.4. Studi Kasus Industri: Pipeline Churn Prediction & Imbalanced Data

Pada kasus churn prediction, jumlah pelanggan yang churn biasanya minoritas (misal 10-20%). Metrik akurasi standar menjadi bias (Accuracy Paradox). Solusinya adalah menggunakan pembobotan kelas (\`class_weight='balanced'\`) dan mengevaluasi area di bawah kurva ROC-AUC:

\`\`\`python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score
import numpy as np

# Simulasi data churn tidak seimbang (80% Tidak Churn, 20% Churn)
np.random.seed(42)
X = np.random.randn(1000, 6)
y = np.random.choice([0, 1], size=1000, p=[0.80, 0.20])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)

clf = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
clf.fit(X_train, y_train)

y_prob = clf.predict_proba(X_test)[:, 1]
y_pred = clf.predict(X_test)

print(f"ROC-AUC Score: {roc_auc_score(y_test, y_prob):.4f}")
print("\nLaporan Klasifikasi:\n", classification_report(y_test, y_pred, target_names=['Tetap', 'Churn']))
\`\`\`
`
      }
    ]
  }
];
