import { DocSectionItem } from "@/components/modul/doc-reader-layout";

/**
 * BAB 12 - 17 KURIKULUM MACHINE LEARNING VELQORA
 * Mencakup Jaringan Saraf Tiruan (Deep Learning MLP), Pipeline & ColumnTransformer anti-kebocoran data,
 * Natural Language Processing (TF-IDF), Computer Vision (Eigenfaces & HOG), Time Series Forecasting,
 * dan Sistem Rekomendasi Ketetanggaan (Collaborative Filtering).
 */
export const ML_CHAPTERS_12_TO_17: DocSectionItem[] = [
  // =========================================================================
  // BAB 12: Dasar Deep Learning (Multi-Layer Perceptron)
  // =========================================================================
  {
    id: "ml-bab-12",
    slug: "bab-12-dasar-deep-learning",
    title: "BAB 12: Dasar Deep Learning & Neural Networks",
    orderIndex: 12,
    description: "Transisi dari model linear ke Jaringan Saraf Tiruan: Arsitektur Multi-Layer Perceptron (MLPClassifier / MLPRegressor), propagasi maju, aturan rantai backpropagation, fungsi aktivasi (ReLU, Sigmoid, Tanh), solver Adam & L-BFGS, dan penalti L2.",
    subsections: [
      {
        id: "ml-bab-12-1",
        slug: "arsitektur-multi-layer-perceptron",
        title: "12.1. Arsitektur Multi-Layer Perceptron (MLP)",
        orderIndex: 1,
        description: "Lapisan input, lapisan tersembunyi (hidden layers), propagasi maju (forward pass), dan algoritma backpropagation.",
        content_markdown: `# 12.1. Arsitektur Multi-Layer Perceptron (MLP)

**Multi-Layer Perceptron (MLP)** adalah model jaringan saraf tiruan maju (*feedforward artificial neural network*) yang memetakan set masukan ke set keluaran melalui satu atau beberapa lapisan tersembunyi (*hidden layers*) non-linear.

---

## 12.1.1. Formulasi Matematis Propagasi Maju (Forward Pass)
Diberikan vektor input $x \\in \\mathbb{R}^p$, nilai aktivasi pada lapisan tersembunyi pertama $h^{(1)}$ dihitung sebagai kombinasi linear dari bobot dan bias yang diikuti oleh fungsi aktivasi non-linear $g(\\cdot)$:

$$h^{(1)} = g\\big(W^{(1)} x + b^{(1)}\\big)$$

Di mana:
- $W^{(1)} \\in \\mathbb{R}^{m \\times p}$ adalah matriks bobot sinaptik lapisan pertama.
- $b^{(1)} \\in \\mathbb{R}^m$ adalah vektor bias.
- $g(\\cdot)$ adalah fungsi aktivasi non-linear (seperti ReLU atau Logistic Sigmoid).

Untuk jaringan dengan $L$ lapisan tersembunyi, komputasi berlanjut secara rekursif:
$$h^{(l)} = g\\big(W^{(l)} h^{(l-1)} + b^{(l)}\\big), \\quad l = 2, \\dots, L$$

Output akhir untuk klasifikasi multi-kelas dengan $K$ kelas diproyeksikan melalui fungsi **Softmax**:
$$P(y = k \\mid x) = \\frac{\\exp\\big(z_k^{(L+1)}\\big)}{\\sum_{j=1}^K \\exp\\big(z_j^{(L+1)}\\big)}$$

---

## 12.1.2. Fungsi Aktivasi Bawaan Scikit-Learn
- \`activation='relu'\` (Rectified Linear Unit): $g(z) = \\max(0, z)$. Pilihan standar industri paling stabil yang mengatasi masalah lenyapnya gradien (*vanishing gradient problem*).
- \`activation='logistic'\` (Sigmoid): $g(z) = \\frac{1}{1 + e^{-z}}$. Memetakan output ke rentang $(0, 1)$.
- \`activation='tanh'\` (Hyperbolic Tangent): $g(z) = \\tanh(z) = \\frac{e^z - e^{-z}}{e^z + e^{-z}}$. Memetakan output ke rentang $(-1, 1)$ dengan rata-rata nol (*zero-centered*).

---

## 12.1.3. Implementasi Lengkap Python

\`\`\`python
import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report

# 1. Dataset klasifikasi non-linear
X, y = make_classification(n_samples=1500, n_features=20, n_classes=3, n_informative=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# Neural network sangat sensitif terhadap skala fitur: StandardScaler mutlak wajib!
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 2. Inisialisasi MLPClassifier dengan 2 hidden layers (64 dan 32 neuron)
mlp = MLPClassifier(
    hidden_layer_sizes=(64, 32),
    activation='relu',
    solver='adam',
    alpha=1e-4, # Penalti regularisasi L2
    batch_size=64,
    learning_rate_init=0.001,
    max_iter=200,
    early_stopping=True, # Otomatis berhenti jika validasi loss tidak membaik
    validation_fraction=0.1,
    random_state=42
)

mlp.fit(X_train_scaled, y_train)

print("=" * 60)
print("HASIL TRAINING MULTI-LAYER PERCEPTRON")
print("=" * 60)
print(f"Jumlah Epoch Konvergensi : {mlp.n_iter_}")
print(f"Nilai Kerugian Akhir    : {mlp.loss_:.4f}")
print("\nLaporan Klasifikasi Data Uji:\n", classification_report(y_test, mlp.predict(X_test_scaled)))
\`\`\`
`
      },
      {
        id: "ml-bab-12-2",
        slug: "solvers-dan-regularisasi-neural-networks",
        title: "12.2. Solvers & Regularisasi Jaringan Saraf Tiruan",
        orderIndex: 2,
        description: "Optimasi Adam, L-BFGS untuk dataset kecil, regularisasi penalti L2 alpha, serta early stopping untuk mencegah memorisasi.",
        content_markdown: `# 12.2. Solvers & Regularisasi Jaringan Saraf Tiruan

Pemilihan algoritma pengoptimalan (*solver*) dan strategi regularisasi menentukan kecepatan konvergensi serta kestabilan bobot parameter model neural network.

---

## 12.2.1. Karakteristik Solvers di Scikit-Learn
1. **\`solver='adam'\` (Adaptive Moment Estimation)**:
   - Pengoptimal standar industri untuk dataset besar (ribuan hingga jutaan sampel).
   - Memelihara rata-rata eksponensial bergerak dari gradien pertama $m_t$ (momentum) dan gradien kuadrat kedua $v_t$ (skala adaptif):
     $$m_t = \\beta_1 m_{t-1} + (1 - \\beta_1) g_t, \\quad v_t = \\beta_2 v_{t-1} + (1 - \\beta_2) g_t^2$$
2. **\`solver='lbfgs'\` (Limited-memory Broyden–Fletcher–Goldfarb–Shanno)**:
   - Pengoptimal orde kedua quasi-Newton yang mendekati matriks Hessian kebalikan secara efisien.
   - **Konvergen jauh lebih cepat dan menghasilkan akurasi lebih tinggi untuk dataset kecil ($< 1.000$ sampel)**.
3. **\`solver='sgd'\`**:
   - Penurunan gradien stokastik standar dengan dukungan parameter momentum (\`momentum=0.9\`) dan momentum Nesterov (\`nesterovs_momentum=True\`).

---

## 12.2.2. Regularisasi Penalti $L_2$ (\`alpha\`)
Fungsi kerugian teratur yang diminimalkan adalah:

$$E(W, b) = L_{\\text{data}}(W, b) + \\frac{\\alpha}{2} \\sum_{l=1}^L \\|W^{(l)}\\|_F^2$$

Di mana $\\|W\\|_F$ merupakan norma Frobenius dari matriks bobot. Meningkatkan nilai \`alpha\` menekan besaran bobot ekstrem dan mencegah overfitting pada fitur bising.

---

## 12.2.3. Implementasi Lengkap Python

\`\`\`python
from sklearn.neural_network import MLPRegressor
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score

# 1. Dataset Regresi Perumahan
housing = fetch_california_housing()
X_tr, X_te, y_tr, y_te = train_test_split(housing.data[:2000], housing.target[:2000], test_size=0.2, random_state=42)

scaler = StandardScaler()
X_tr_s = scaler.fit_transform(X_tr)
X_te_s = scaler.transform(X_te)

# 2. MLPRegressor dengan Solver L-BFGS untuk Konvergensi Cepat pada Sampel Menengah
mlp_reg = MLPRegressor(
    hidden_layer_sizes=(50, 25),
    activation='relu',
    solver='lbfgs',
    alpha=0.01,
    max_iter=500,
    random_state=42
)
mlp_reg.fit(X_tr_s, y_tr)

preds = mlp_reg.predict(X_te_s)
rmse = mean_squared_error(y_te, preds) ** 0.5
r2 = r2_score(y_te, preds)

print("=" * 60)
print("HASIL EVALUASI MLPREGRESSOR (SOLVER L-BFGS)")
print("=" * 60)
print(f"RMSE Model Regresi : {rmse:.4f}")
print(f"R² Score           : {r2:.4f}")
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 13: Pipeline & ColumnTransformer Terpadu
  // =========================================================================
  {
    id: "ml-bab-13",
    slug: "bab-13-pipeline-columntransformer-terpadu",
    title: "BAB 13: Pipeline & ColumnTransformer Terpadu",
    orderIndex: 13,
    description: "Arsitektur alur kerja anti-kebocoran data: ColumnTransformer fitur heterogen, Custom Transformers dengan BaseEstimator, caching memori perantara, dan TransformedTargetRegressor.",
    subsections: [
      {
        id: "ml-bab-13-1",
        slug: "pencegahan-data-leakage-dengan-pipeline",
        title: "13.1. Pencegahan Data Leakage dengan Pipeline & ColumnTransformer",
        orderIndex: 1,
        description: "Menggabungkan imputasi data hilang, penskalaan numerik, dan one-hot encoding kategorikal secara atomik tanpa kebocoran data uji.",
        content_markdown: `# 13.1. Pencegahan Data Leakage dengan Pipeline & ColumnTransformer

Kesalahan paling umum dalam rekayasa data adalah **Data Leakage** — situasi di mana statistik dari set validasi/uji (seperti mean, standar deviasi, atau modus kategori) bocor ke dalam data pelatihan sebelum pembagian lipatan cross-validation.

---

## 13.1.1. Arsitektur Komposisi Pipeline Atomik
Dengan merangkum tahapan preprocessing dan estimator ke dalam satu objek tunggal \`Pipeline\`, Scikit-Learn menjamin bahwa \`fit()\` hanya pernah dipanggil pada data latihan di setiap lipatan cross-validation, dan data uji hanya ditransformasikan menggunakan parameter yang telah dipelajari dari set latih (\`transform()\`).

---

## 13.1.2. Implementasi Lengkap Python

\`\`\`python
import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import cross_val_score, StratifiedKFold

# 1. Buat DataFrame heterogen mentah dengan missing values
data = pd.DataFrame({
    'umur': [22, 38, 26, 35, np.nan, 45, 52, 29],
    'gaji': [5000000, 14000000, 7500000, np.nan, 12000000, 18000000, 22000000, 8000000],
    'kota': ['Jakarta', 'Surabaya', 'Bandung', 'Jakarta', 'Surabaya', np.nan, 'Bandung', 'Jakarta'],
    'status': ['Silver', 'Platinum', 'Gold', 'Silver', 'Gold', 'Platinum', 'Platinum', 'Silver'],
    'target': [0, 1, 0, 0, 1, 1, 1, 0]
})

X = data.drop(columns=['target'])
y = data['target']

num_cols = ['umur', 'gaji']
cat_cols = ['kota', 'status']

# 2. Pipeline untuk Fitur Numerik
num_pipe = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# 3. Pipeline untuk Fitur Kategorikal
cat_pipe = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('ohe', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

# 4. ColumnTransformer Menggabungkan Kedua Alur
preprocessor = ColumnTransformer([
    ('num', num_pipe, num_cols),
    ('cat', cat_pipe, cat_cols)
])

# 5. Pipeline Akhir Lengkap (Preprocessing + Estimator)
full_pipeline = Pipeline([
    ('prep', preprocessor),
    ('clf', HistGradientBoostingClassifier(random_state=42))
])

full_pipeline.fit(X, y)
print("=" * 60)
print("PIPELINE TERPADU BERHASIL DILATIH")
print("=" * 60)
print("Tahapan Pipeline:", [step[0] for step in full_pipeline.steps])
print("Prediksi Sampel Pertama:", full_pipeline.predict(X.iloc[[0]]))
\`\`\`
`
      },
      {
        id: "ml-bab-13-2",
        slug: "custom-transformers-dan-target-regressor",
        title: "13.2. Custom Transformers & TransformedTargetRegressor",
        orderIndex: 2,
        description: "Membangun transformer kustom yang kompatibel penuh dengan Scikit-Learn API menggunakan BaseEstimator dan TransformerMixin, serta transformasi target non-linear.",
        content_markdown: `# 13.2. Custom Transformers & TransformedTargetRegressor

---

## 13.2.1. Standar Scikit-Learn untuk Transformer Kustom
Untuk mengintegrasikan logika transformasi domain-spesifik ke dalam \`Pipeline\` atau \`GridSearchCV\`, kelas kustom harus mewarisi:
1. **\`BaseEstimator\`**: Memberikan metode \`get_params()\` dan \`set_params()\` secara otomatis tanpa perlu \`*args\` atau \`**kwargs\` di constructor.
2. **\`TransformerMixin\`**: Memberikan metode \`fit_transform()\` secara otomatis.

---

## 13.2.2. TransformedTargetRegressor
Banyak variabel target regresi (seperti harga rumah atau gaji) memiliki distribusi miring ke kanan (*right-skewed*). \`TransformedTargetRegressor\` menerapkan transformasi logaritmik atau Box-Cox pada target $y$ selama \`fit()\`, dan secara otomatis membalikkan transformasi (*inverse transform*) saat memanggil \`predict()\`:

$$\\hat{y} = f^{-1}\\big(g(X)\\big)$$

---

## 13.2.3. Implementasi Lengkap Python

\`\`\`python
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import TransformedTargetRegressor
from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline

# 1. Custom Transformer: Menghitung Rasio Dua Kolom Fitur
class RatioFeatureExtractor(BaseEstimator, TransformerMixin):
    def __init__(self, col_a_idx=0, col_b_idx=1):
        self.col_a_idx = col_a_idx
        self.col_b_idx = col_b_idx

    def fit(self, X, y=None):
        return self # Stateless transformer

    def transform(self, X):
        X_arr = np.asarray(X)
        ratio = (X_arr[:, [self.col_a_idx]] + 1e-6) / (X_arr[:, [self.col_b_idx]] + 1e-6)
        return np.hstack([X_arr, ratio])

# 2. Dataset Regresi dengan Target Berdistribusi Log-Normal
X_dummy = np.array([[10, 2], [20, 5], [15, 3], [30, 4]])
y_dummy = np.exp(np.array([2.5, 3.2, 2.9, 4.1])) # Target eksponensial

# 3. Model dengan Transformasi Target Logaritmik Otomatis
base_model = Pipeline([
    ('ratio_gen', RatioFeatureExtractor(0, 1)),
    ('regressor', Ridge(alpha=1.0))
])

target_model = TransformedTargetRegressor(
    regressor=base_model,
    func=np.log1p,      # Transformasi maju: log(1 + y)
    inverse_func=np.expm1 # Transformasi mundur otomatis: exp(y) - 1
)

target_model.fit(X_dummy, y_dummy)
predictions = target_model.predict(X_dummy)

print("=" * 60)
print("HASIL TRANSFORMED TARGET REGRESSOR")
print("=" * 60)
print("Nilai Aktual   :", np.round(y_dummy, 2))
print("Nilai Prediksi :", np.round(predictions, 2))
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 14: Pemrosesan Teks & NLP dengan Scikit-Learn
  // =========================================================================
  {
    id: "ml-bab-14",
    slug: "bab-14-pemrosesan-teks-nlp",
    title: "BAB 14: Pemrosesan Teks & Natural Language Processing (NLP)",
    orderIndex: 14,
    description: "Representasi teks Bag-of-Words, n-gram, formulasi matematis pembobotan TF-IDF, serta pipeline klasifikasi teks end-to-end dengan Naive Bayes dan Linear SVM.",
    subsections: [
      {
        id: "ml-bab-14-1",
        slug: "bag-of-words-tfidf-matematis",
        title: "14.1. Representasi Teks: Bag-of-Words & TF-IDF Matematis",
        orderIndex: 1,
        description: "Tokenisasi teks, n-gram ranges, stopwords, formulasi logaritmik frekuensi dokumen terbalik (TF-IDF), dan normalisasi L2 Euclidean.",
        content_markdown: `# 14.1. Representasi Teks: Bag-of-Words & TF-IDF Matematis

Komputer tidak dapat memproses teks mentah secara langsung. Teks harus dikonversi ke dalam vektor representasi numerik berdimensi tinggi.

---

## 14.1.1. Formulasi Matematis TF-IDF di Scikit-Learn
Pembobotan **TF-IDF** (*Term Frequency - Inverse Document Frequency*) mengevaluasi seberapa penting suatu kata $t$ dalam dokumen $d$ yang berada di dalam suatu korpus $D$:

$$\\text{tf-idf}(t, d) = \\text{tf}(t, d) \\times \\text{idf}(t)$$

### 1. Frekuensi Term (TF):
Frekuensi kemunculan kata $t$ di dalam dokumen $d$.

### 2. Frekuensi Dokumen Terbalik Halus (Smooth IDF):
Scikit-Learn menggunakan default \`smooth_idf=True\`, yang menambahkan konstanta $1$ pada pembilang dan penyebut untuk mencegah pembagian dengan nol jika suatu kata tidak ada di korpus:

$$\\text{idf}(t) = \\ln \\left( \\frac{1 + n}{1 + \\text{df}(t)} \\right) + 1$$

Di mana:
- $n$ adalah jumlah total dokumen dalam korpus ($n = |D|$).
- $\\text{df}(t)$ adalah jumlah dokumen yang mengandung kata $t$.

### 3. Normalisasi Vektor Euclidean ($L_2$ Norm):
Setiap vektor dokumen dinormalisasi ke panjang unit ($1$) untuk mencegah bias panjang dokumen:
$$v_{\\text{norm}} = \\frac{v}{\\|v\\|_2} = \\frac{v}{\\sqrt{v_1^2 + v_2^2 + \\dots + v_k^2}}$$

---

## 14.1.2. Implementasi Lengkap Python

\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd

corpus = [
    "Machine learning memproses data numerik dan teks",
    "Model deep learning membutuhkan komputasi GPU tinggi",
    "Scikit learn menyediakan algoritma machine learning lengkap",
    "Pemrosesan bahasa alami menggunakan representasi vektor kata"
]

# Inisialisasi TfidfVectorizer dengan n-gram (unigram + bigram)
vectorizer = TfidfVectorizer(ngram_range=(1, 2), smooth_idf=True, norm='l2')
tfidf_matrix = vectorizer.fit_transform(corpus)

print("=" * 60)
print("HASIL PEMBOBOTAN TF-IDF TEKS")
print("=" * 60)
print(f"Bentuk Matriks TF-IDF Sparse : {tfidf_matrix.shape}")
print("Contoh 5 Kosakata Pertama   :", vectorizer.get_feature_names_out()[:5])

# Tampilkan representasi dokumen pertama sebagai DataFrame
df_tfidf = pd.DataFrame(
    tfidf_matrix.toarray(),
    columns=vectorizer.get_feature_names_out()
)
top_words = df_tfidf.iloc[0].sort_values(ascending=False).head(4)
print("\nKata dengan Bobot TF-IDF Tertinggi di Dokumen #1:\n", top_words)
\`\`\`
`
      },
      {
        id: "ml-bab-14-2",
        slug: "pipeline-klasifikasi-teks-sentimen",
        title: "14.2. Pipeline Klasifikasi Teks & Analisis Sentimen End-to-End",
        orderIndex: 2,
        description: "Klasifikasi teks multi-kelas menggunakan MultinomialNB, ComplementNB untuk data teks tidak seimbang, LinearSVC, dan evaluasi matriks kebingungan.",
        content_markdown: `# 14.2. Pipeline Klasifikasi Teks & Analisis Sentimen End-to-End

---

## 14.2.1. Algoritma Klasifikasi Teks Terbaik
1. **\`MultinomialNB\`**: Model probabilitas Naive Bayes multivariat dengan estimasi penghalusan Laplace (*additive Laplace smoothing* $\\alpha$).
2. **\`ComplementNB\`**: Varian khusus Naive Bayes yang dirancang khusus untuk dataset teks yang tidak seimbang (*skewed/imbalanced classes*).
3. **\`LinearSVC\`**: Support Vector Classifier linear yang secara empiris terbukti sebagai salah satu model paling akurat untuk klasifikasi teks berdimensi tinggi.

---

## 14.2.2. Implementasi Lengkap Python

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.metrics import classification_report

# Dataset ulasan sentimen e-commerce
training_corpus = [
    ("Produk sangat memuaskan, kualitas material kokoh dan bagus", "positif"),
    ("Pengiriman cepat, kemasan rapi dan barang original", "positif"),
    ("Layanan pelanggan sangat ramah dan responsif membantu", "positif"),
    ("Barang rusak saat diterima, kemasan robek dan tidak aman", "negatif"),
    ("Kualitas sangat buruk, tidak sesuai dengan deskripsi gambar", "negatif"),
    ("Pengiriman sangat lambat, paket tertahan dua minggu", "negatif")
]

texts, labels = zip(*training_corpus)

# Pipeline Klasifikasi Teks Terpadu
nlp_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
    ('classifier', LinearSVC(C=1.0, random_state=42))
])

nlp_pipeline.fit(texts, labels)

# Evaluasi pada Ulasan Baru
new_reviews = [
    "Kualitas barang sangat bagus dan pengiriman super cepat",
    "Sangat mengecewakan, barang tidak berfungsi sama sekali"
]

preds = nlp_pipeline.predict(new_reviews)

print("=" * 60)
print("HASIL ANALISIS SENTIMEN TEKS")
print("=" * 60)
for review, sentiment in zip(new_reviews, preds):
    print(f"Ulasan: '{review}' -> Prediksi: [{sentiment.upper()}]")
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 15: Computer Vision Klasik dengan Scikit-Learn
  // =========================================================================
  {
    id: "ml-bab-15",
    slug: "bab-15-computer-vision-klasik",
    title: "BAB 15: Computer Vision Klasik dengan Scikit-Learn",
    orderIndex: 15,
    description: "Ekstraksi fitur citra digital, perataan piksel, pengenalan wajah menggunakan Eigenfaces (PCA + SVM), dan klasifikasi digit tulisan tangan MNIST.",
    subsections: [
      {
        id: "ml-bab-15-1",
        slug: "eigenfaces-pengenalan-wajah-pca",
        title: "15.1. Pengenalan Wajah (Eigenfaces) dengan PCA & SVM",
        orderIndex: 1,
        description: "Dekomposisi ruang fitur wajah menggunakan Randomized PCA untuk mengekstrak vektor 'Eigenfaces' dan klasifikasi Support Vector Machine.",
        content_markdown: `# 15.1. Pengenalan Wajah (Eigenfaces) dengan PCA & SVM

Teknik **Eigenfaces** (Turk & Pentland, 1991) adalah pendekatan klasik dalam Computer Vision yang memetakan gambar wajah berdimensi tinggi ke dalam sub-ruang linear berdimensi rendah yang merepresentasikan variasi struktural wajah utama.

---

## 15.1.1. Konsep Matematis Eigenfaces
Setiap gambar wajah berukuran $h \\times w$ direntangkan menjadi vektor satu dimensi $x \\in \\mathbb{R}^{h \\cdot w}$. Jika terdapat $N$ gambar wajah, matriks kovarians dihitung:

$$C = \\frac{1}{N} \\sum_{i=1}^N (x_i - \\bar{x})(x_i - \\bar{x})^T$$

Vektor eigen dari matriks kovarians ini disebut sebagai **Eigenfaces**. Setiap wajah baru kemudian dapat direkonstruksi atau dikenali sebagai kombinasi linear dari sejumlah kecil vektor Eigenfaces.

---

## 15.1.2. Implementasi Lengkap Python

\`\`\`python
from sklearn.datasets import fetch_lfw_people
from sklearn.decomposition import PCA
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# 1. Unduh subset dataset wajah LFW (Labeled Faces in the Wild)
lfw_people = fetch_lfw_people(min_faces_per_person=50, resize=0.4)
n_samples, h, w = lfw_people.images.shape
X = lfw_people.data
y = lfw_people.target
target_names = lfw_people.target_names

print(f"Dataset: {n_samples} gambar wajah berukuran {h}x{w} piksel ({X.shape[1]} fitur)")

# 2. Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# 3. Pipeline: Ekstraksi Eigenfaces (PCA) + Klasifikasi SVM Kernel RBF
pipeline_faces = Pipeline([
    ('pca', PCA(n_components=100, svd_solver='randomized', whiten=True, random_state=42)),
    ('svm', SVC(kernel='rbf', class_weight='balanced', C=5.0, gamma=0.005, random_state=42))
])

pipeline_faces.fit(X_train, y_train)
y_pred = pipeline_faces.predict(X_test)

print("=" * 60)
print("LAPORAN EVALUASI PENGENALAN WAJAH (EIGENFACES)")
print("=" * 60)
print(classification_report(y_test, y_pred, target_names=target_names))
\`\`\`
`
      },
      {
        id: "ml-bab-15-2",
        slug: "klasifikasi-digit-mnist-scikit",
        title: "15.2. Klasifikasi Digit Tulisan Tangan (Dataset MNIST)",
        orderIndex: 2,
        description: "Pelatihan model pengenalan karakter optik (OCR) pada gambar angka 8x8 piksel menggunakan Random Forest dan evaluasi confusion matrix.",
        content_markdown: `# 15.2. Klasifikasi Digit Tulisan Tangan (Dataset MNIST)

---

## 15.2.1. Dataset Digits Scikit-Learn
Scikit-Learn menyediakan dataset \`load_digits\` yang berisi $1.797$ gambar angka tulisan tangan dari angka $0$ sampai $9$. Setiap gambar direpresentasikan oleh matriks $8 \\times 8$ dengan nilai intensitas grayscale dari $0$ hingga $16$.

---

## 15.2.2. Implementasi Lengkap Python

\`\`\`python
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix

digits = load_digits()
X, y = digits.data, digits.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

rf_digits = RandomForestClassifier(n_estimators=100, random_state=42)
rf_digits.fit(X_train, y_train)

preds = rf_digits.predict(X_test)
acc = accuracy_score(y_test, preds)

print("=" * 60)
print("HASIL KLASIFIKASI DIGIT TULISAN TANGAN")
print("=" * 60)
print(f"Akurasi Pengenalan Karakter: {acc:.2%}")
print("Confusion Matrix:\n", confusion_matrix(y_test, preds))
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 16: Time Series Forecasting dengan Scikit-Learn
  // =========================================================================
  {
    id: "ml-bab-16",
    slug: "bab-16-time-series-forecasting",
    title: "BAB 16: Time Series Forecasting dengan Scikit-Learn",
    orderIndex: 16,
    description: "Transformasi deret waktu menjadi masalah supervised learning, rekayasa fitur lag, statistik rolling window, validasi silang TimeSeriesSplit, dan strategi multi-step forecasting.",
    subsections: [
      {
        id: "ml-bab-16-1",
        slug: "lag-features-dan-timeseriessplit",
        title: "16.1. Rekayasa Fitur Lag & Validasi Bebas Bocor (TimeSeriesSplit)",
        orderIndex: 1,
        description: "Membentuk matriks fitur tergeser (lag features), fitur kalender musiman, dan validasi walk-forward bebas kebocoran waktu masa depan.",
        content_markdown: `# 16.1. Rekayasa Fitur Lag & Validasi Bebas Bocor (TimeSeriesSplit)

Berbeda dari data tabular independen (*IID*), observasi deret waktu (*time series*) memiliki ketergantungan temporal sekuensial yang kuat.

---

## 16.1.1. Konversi Deret Waktu ke Supervised Learning
Kita memprediksi nilai masa depan $y_t$ berdasarkan nilai masa lalu (*lag values*):

$$y_t = f\\big(y_{t-1}, \\; y_{t-2}, \\; \\dots, \\; y_{t-p}, \\; \\text{RollingMean}_k(t-1)\\big)$$

### Rekayasa Fitur Waktu:
1. **Lag Features**: $y_{t-1}, y_{t-7}, y_{t-30}$ (misal untuk menangkap pola harian, mingguan, dan bulanan).
2. **Rolling Window Statistics**: Rata-rata bergerak (*moving average*) dan deviasi standar bergerak selama jendela waktu tertentu.
3. **Calendar Features**: Hari dalam minggu (0-6), bulan (1-12), dan indikator hari libur.

---

## 16.1.2. Implementasi Lengkap Python

\`\`\`python
import numpy as np
import pandas as pd
from sklearn.model_selection import TimeSeriesSplit
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_percentage_error

# 1. Buat deret waktu sintetik 365 hari dengan tren dan musiman
dates = pd.date_range('2025-01-01', periods=365, freq='D')
trend = np.linspace(100, 250, 365)
seasonality = 20 * np.sin(2 * np.pi * np.arange(365) / 7) # Musiman 7 harian
noise = np.random.randn(365) * 5
series = trend + seasonality + noise

df = pd.DataFrame({'ds': dates, 'y': series})

# 2. Rekayasa Fitur Lag dan Rolling Window
df['lag_1'] = df['y'].shift(1)
df['lag_7'] = df['y'].shift(7)
df['rolling_mean_7'] = df['y'].shift(1).rolling(window=7).mean()
df['day_of_week'] = df['ds'].dt.dayofweek

# Hapus baris awal yang mengandung NaN akibat shift
df_clean = df.dropna().reset_index(drop=True)

X = df_clean[['lag_1', 'lag_7', 'rolling_mean_7', 'day_of_week']]
y = df_clean['y']

# 3. Evaluasi TimeSeriesSplit Walk-Forward
tscv = TimeSeriesSplit(n_splits=5)
mape_scores = []

model = HistGradientBoostingRegressor(random_state=42)

for fold, (train_idx, test_idx) in enumerate(tscv.split(X)):
    X_tr, X_val = X.iloc[train_idx], X.iloc[test_idx]
    y_tr, y_val = y.iloc[train_idx], y.iloc[test_idx]
    
    model.fit(X_tr, y_tr)
    preds = model.predict(X_val)
    mape = mean_absolute_percentage_error(y_val, preds)
    mape_scores.append(mape)
    print(f"Fold #{fold+1}: Latih {len(X_tr)} hari -> Uji {len(X_val)} hari | MAPE: {mape:.2%}")

print(f"\nRata-rata MAPE Seluruh Fold: {np.mean(mape_scores):.2%}")
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 17: Sistem Rekomendasi & Analisis Ketetanggaan
  // =========================================================================
  {
    id: "ml-bab-17",
    slug: "bab-17-sistem-rekomendasi-ketetanggaan",
    title: "BAB 17: Sistem Rekomendasi & Analisis Ketetanggaan",
    orderIndex: 17,
    description: "Metrik jarak spasial (Cosine, Euclidean, Manhattan), struktur pencarian cepat KD-Tree & Ball-Tree, serta Collaborative Filtering berbasis ketetanggaan (NearestNeighbors).",
    subsections: [
      {
        id: "ml-bab-17-1",
        slug: "collaborative-filtering-nearestneighbors",
        title: "17.1. Collaborative Filtering Berbasis NearestNeighbors",
        orderIndex: 1,
        description: "Matriks interaksi user-item, Cosine Similarity matematis, dan algoritma pencarian tetangga terdekat efisien menggunakan NearestNeighbors.",
        content_markdown: `# 17.1. Collaborative Filtering Berbasis NearestNeighbors

Sistem rekomendasi berbasis **Collaborative Filtering** memprediksi minat preferensi seorang pengguna terhadap suatu item berdasarkan pola kemiripan interaksi pengguna lain (*User-Based*) atau kemiripan antar item (*Item-Based*).

---

## 17.1.1. Formulasi Matematis Cosine Distance
Untuk matriks interaksi yang jarang (*sparse interaction matrix*), **Cosine Similarity** mengukur sudut kosinus antara dua vektor profil interaksi $u$ dan $v$, terlepas dari perbedaan volume rating absolut:

$$\\text{CosineSimilarity}(u, v) = \\frac{u \\cdot v}{\\|u\\|_2 \\|v\\|_2} = \\frac{\\sum_{i=1}^p u_i v_i}{\\sqrt{\\sum_{i=1}^p u_i^2} \\sqrt{\\sum_{i=1}^p v_i^2}}$$

Scikit-Learn mengimplementasikan metrik jarak komplemen:
$$\\text{CosineDistance}(u, v) = 1 - \\text{CosineSimilarity}(u, v)$$

---

## 17.1.2. Implementasi Lengkap Python

\`\`\`python
import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from scipy.sparse import csr_matrix

# 1. Matriks Interaksi Pengguna-Item (User-Item Rating 1-5)
ratings_dict = {
    'User_A': [5, 4, 0, 0, 1],
    'User_B': [5, 5, 1, 0, 0],
    'User_C': [0, 1, 4, 5, 4],
    'User_D': [0, 0, 5, 4, 5],
    'User_E': [4, 4, 0, 1, 0]
}
item_names = ['Modul_Python', 'Modul_ScikitLearn', 'Modul_PyTorch', 'Modul_LLM', 'Modul_LangChain']

df_ratings = pd.DataFrame(ratings_dict, index=item_names)
sparse_matrix = csr_matrix(df_ratings.values)

# 2. Inisialisasi NearestNeighbors dengan Metrik Cosine
model_knn = NearestNeighbors(metric='cosine', algorithm='brute')
model_knn.fit(sparse_matrix)

# 3. Cari 2 Modul yang Paling Mirip dengan 'Modul_Python' (Indeks 0)
target_idx = 0
distances, indices = model_knn.kneighbors(
    df_ratings.iloc[target_idx, :].values.reshape(1, -1),
    n_neighbors=3
)

print("=" * 60)
print(f"REKOMENDASI ITEM TERKAIT UNTUK: '{item_names[target_idx]}'")
print("=" * 60)
for i in range(1, len(distances.flatten())):
    neighbor_idx = indices.flatten()[i]
    dist = distances.flatten()[i]
    sim = 1 - dist
    print(f"#{i}: {item_names[neighbor_idx]} (Kemiripan Cosine: {sim:.2%})")
\`\`\`
`
      }
    ]
  }
];
