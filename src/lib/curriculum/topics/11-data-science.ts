import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: DATA SCIENCE (TOPIK 11) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - James, G., Witten, D., Hastie, T., & Tibshirani, R. (2021). An Introduction to Statistical Learning: with Applications in Python. Springer.
 * - Hastie, T., Tibshirani, R., & Friedman, J. (2009). The Elements of Statistical Learning (2nd ed.). Springer.
 * - Lundberg, S. M., & Lee, S. I. (2017). A Unified Approach to Interpreting Model Predictions. NeurIPS 2017.
 * - Chawla, N. V., Bowyer, K. W., Hall, L. O., & Kegelmeyer, W. P. (2002). SMOTE: Synthetic Minority Over-sampling Technique. JAIR.
 */
export const dataScienceCurriculum: AcademicCurriculum = {
  id: "data-science",
  slug: "data-science",
  title: "Data Science",
  category: "Kecerdasan Buatan",
  level: "menengah",
  description: "Metodologi sains data holistik: siklus CRISP-DM, reduksi dimensi tanpa supervisi (PCA, SVD, t-SNE, UMAP), penanganan ketidakseimbangan kelas ekstrem (SMOTE, Focal Loss), protokol validasi silang bertingkat (Stratified & Nested K-Fold), rekayasa fitur berbasis Mutual Information, interpretasi model berbasis teori permainan (SHAP), serta eksperimentasi terkelola.",
  estimatedHours: 58,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "An Introduction to Statistical Learning: with Applications in Python",
      authors: ["Gareth James", "Daniela Witten", "Trevor Hastie", "Robert Tibshirani"],
      type: "book",
      url: "https://www.statlearning.com/",
      relevance: "Fondasi pemodelan statistik, trade-off bias-varians, seleksi variabel, dan validasi model terapan.",
      year: 2021,
      publisherOrVenue: "Springer",
    },
    {
      title: "The Elements of Statistical Learning: Data Mining, Inference, and Prediction",
      authors: ["Trevor Hastie", "Robert Tibshirani", "Jerome Friedman"],
      type: "book",
      url: "https://hastie.su.domains/ElemStatLearn/",
      relevance: "Penurunan teoretis mendalam untuk regresi termodifikasi, kernel smoothing, dan ensemble methods.",
      year: 2009,
      publisherOrVenue: "Springer Nature",
    },
    {
      title: "A Unified Approach to Interpreting Model Predictions",
      authors: ["Scott M. Lundberg", "Su-In Lee"],
      type: "paper",
      url: "https://arxiv.org/abs/1705.07874",
      doi: "10.48550/arXiv.1705.07874",
      relevance: "Kerangka SHAP (SHapley Additive exPlanations) berbasis teori permainan kooperatif Lloyd Shapley.",
      year: 2017,
      publisherOrVenue: "NeurIPS 2017",
    },
  ],
  chapters: [
    {
      id: "ds-bab-1",
      slug: "metodologi-crisp-dm-dan-isolasi-leakage",
      title: "BAB 1: Metodologi CRISP-DM & Isolasi Kebocoran Data (Data Leakage)",
      orderIndex: 1,
      description: "Enam fase siklus hidup CRISP-DM, pemetaan metrik bisnis ke loss function machine learning, dan taksonomi kebocoran data (Feature Leakage vs Train-Test Contamination).",
      subchapters: [
        {
          id: "ds-bab-1-1",
          slug: "fase-crisp-dm-dan-target-leakage",
          title: "1.1. Siklus Hidup CRISP-DM & Pencegahan Kebocoran Target",
          orderIndex: 1,
          description: "Mendeteksi kontaminasi fitur prediktif masa depan (*look-ahead bias*) dan pemisahan dataset latih-uji sebelum transformasi dilakukan.",
          content_markdown: `# 1.1. Siklus Hidup CRISP-DM & Pencegahan Kebocoran Target

## 1. Enam Fase Siklus CRISP-DM
1. **Business Understanding**: Menentukan objektif bisnis dan kriteria keberhasilan model.
2. **Data Understanding**: Eksplorasi kualitas, distribusi, dan anomali dataset.
3. **Data Preparation**: Pembersihan, seleksi variabel, transformasi, dan pembuatan fitur.
4. **Modeling**: Memilih algoritma, melatih parameter, dan menyetel hyperparameter.
5. **Evaluation**: Menilai performa model terhadap metrik validasi dan kriteria bisnis.
6. **Deployment**: Mengintegrasikan model ke lingkungan produksi dan memantau degradasi performa.

## 2. Taksonomi Kebocoran Data (Data Leakage)
Kebocoran data terjadi ketika informasi dari luar data latih digunakan untuk melatih model, menghasilkan skor performa validasi yang luar biasa tinggi namun hancur ketika dihadapkan pada data masa depan:
1. **Target / Feature Leakage**: Variabel input mengandung informasi yang secara fisik baru tersedia *setelah* target terjadi (misal: kolom \`refund_timestamp\` digunakan untuk memprediksi apakah transaksi adalah *fraud*).
2. **Train-Test Contamination**: Melakukan penskalaan (*StandardScaler*) atau imputasi nilai hilang (*MeanImputer*) pada seluruh dataset *sebelum* membagi data latih dan data uji. Parameter $\\mu$ dan $\\sigma$ dari data uji merembes ke data latih.

**Aturan Emas**: Seluruh transformator data wajib di-\`fit\` *hanya* pada data latih, kemudian di-\`transform\` pada data uji.
`,
        },
      ],
    },
    {
      id: "ds-bab-2",
      slug: "reduksi-dimensi-dan-dekomposisi-matriks",
      title: "BAB 2: Reduksi Dimensi & Dekomposisi Matriks (PCA, SVD, t-SNE, UMAP)",
      orderIndex: 2,
      description: "Penurunan matematis Principal Component Analysis (PCA), Singular Value Decomposition (SVD), pemetaan manifold non-linear (t-SNE dan UMAP), dan mitigasi kutukan dimensionalitas (Curse of Dimensionality).",
      subchapters: [
        {
          id: "ds-bab-2-1",
          slug: "derivasi-matematis-pca-dan-svd",
          title: "2.1. Derivasi Matematis PCA & Singular Value Decomposition (SVD)",
          orderIndex: 1,
          description: "Maksimisasi varians proyeksi menggunakan pengali Lagrange, dekomposisi nilai eigen matriks kovarians, dan teorema faktorisasi SVD.",
          content_markdown: `# 2.1. Derivasi Matematis PCA & Singular Value Decomposition (SVD)

## 1. Derivasi Matematis PCA
Diberikan matriks data terpusat $\\mathbf{X} \\in \\mathbb{R}^{n \\times p}$ dengan $\\mathbb{E}[\\mathbf{x}] = \\mathbf{0}$. Matriks kovarians sampel didefinisikan sebagai:

$$\\mathbf{\\Sigma} = \\frac{1}{n} \\mathbf{X}^T \\mathbf{X} \\in \\mathbb{R}^{p \\times p}$$

Kita mencari vektor arah proyeksi unit $\\mathbf{u}_1 \\in \\mathbb{R}^p$ (dengan kendala $\\mathbf{u}_1^T \\mathbf{u}_1 = 1$) yang memaksimalkan varians data hasil proyeksi $\\mathbf{z}_1 = \\mathbf{X} \\mathbf{u}_1$:

$$\\max_{\\mathbf{u}_1} \\quad \\text{Var}(\\mathbf{z}_1) = \\frac{1}{n} (\\mathbf{X} \\mathbf{u}_1)^T (\\mathbf{X} \\mathbf{u}_1) = \\mathbf{u}_1^T \\left( \\frac{1}{n} \\mathbf{X}^T \\mathbf{X} \\right) \\mathbf{u}_1 = \\mathbf{u}_1^T \\mathbf{\\Sigma} \\mathbf{u}_1$$

Menggunakan metode pengali Lagrange (*Lagrange Multipliers*):
$$\\mathcal{L}(\\mathbf{u}_1, \\lambda_1) = \\mathbf{u}_1^T \\mathbf{\\Sigma} \\mathbf{u}_1 - \\lambda_1 (\\mathbf{u}_1^T \\mathbf{u}_1 - 1)$$

Turunkan terhadap $\\mathbf{u}_1$ dan samakan dengan nol:
$$\\nabla_{\\mathbf{u}_1} \\mathcal{L} = 2 \\mathbf{\\Sigma} \\mathbf{u}_1 - 2 \\lambda_1 \\mathbf{u}_1 = \\mathbf{0} \\implies \\mathbf{\\Sigma} \\mathbf{u}_1 = \\lambda_1 \\mathbf{u}_1$$

**Kesimpulan Teoretis**: Vektor arah komponen utama $\\mathbf{u}_1$ adalah **vektor eigen** (*eigenvector*) dari matriks kovarians $\\mathbf{\\Sigma}$, dan nilai varians yang dimaksimalkan adalah **nilai eigen** (*eigenvalue*) terbesarnya $\\lambda_1$.

## 2. Hubungan PCA dengan SVD
Melalui faktorisasi SVD:
$$\\mathbf{X} = \\mathbf{U} \\mathbf{S} \\mathbf{V}^T$$
Matriks kovarians dapat ditulis:
$$\\mathbf{X}^T \\mathbf{X} = \\mathbf{V} \\mathbf{S} \\mathbf{U}^T \\mathbf{U} \\mathbf{S} \\mathbf{V}^T = \\mathbf{V} \\mathbf{S}^2 \\mathbf{V}^T$$
Kolom-kolom dari $\\mathbf{V}$ (vektor singular kanan) persis sama dengan komponen utama PCA.
`,
        },
      ],
    },
    {
      id: "ds-bab-3",
      slug: "ketidakseimbangan-kelas-dan-smote",
      title: "BAB 3: Penanganan Ketidakseimbangan Kelas Ekstrem & Evaluasi",
      orderIndex: 3,
      description: "Teknik resampling sintetis (SMOTE, Borderline-SMOTE, Tomek Links), cost-sensitive learning (Focal Loss, class weights), dan metrik evaluasi yang kebal ketidakseimbangan (PR-AUC vs ROC-AUC).",
      subchapters: [
        {
          id: "ds-bab-3-1",
          slug: "algoritma-smote-dan-metrik-pr-auc",
          title: "3.1. Algoritma SMOTE & Mengapa ROC-AUC Menyesatkan pada Kelas Langka",
          orderIndex: 1,
          description: "Generasi sampel sintetis interpolasi k-NN, bahaya metrik Accuracy Paradox, dan dominasi Precision-Recall AUC untuk kasus deteksi penipuan.",
          content_markdown: `# 3.1. Algoritma SMOTE & Mengapa ROC-AUC Menyesatkan pada Kelas Langka

## 1. Mekanisme Algoritma SMOTE (Chawla et al., 2002)
SMOTE menghindari duplikasi sampel minoritas secara naif. Untuk setiap sampel minoritas $\\mathbf{x}_i$:
1. Temukan $k$ tetangga terdekat dari kelas minoritas yang sama menggunakan jarak Euclidean.
2. Pilih satu tetangga acak $\\mathbf{x}_{zi}$.
3. Hasilkan titik sintetis baru pada segmen garis yang menghubungkan keduanya:

$$\\mathbf{x}_{\\text{new}} = \\mathbf{x}_i + \\lambda (\\mathbf{x}_{zi} - \\mathbf{x}_i), \\quad \\lambda \\sim \\text{Uniform}(0, 1)$$

## 2. Mengapa ROC-AUC Menipu pada Kasus Ketidakseimbangan Ekstrem?
Pada kasus di mana kelas positif hanya $0.1\\%$ (misal: 10 kasus positif dalam 10.000 data):
$$FPR = \\frac{FP}{FP + TN} = \\frac{FP}{9990}$$
Jika model menghasilkan $100$ False Positive, nilai $FPR$ hanya:
$$FPR = \\frac{100}{9990} \\approx 0.010 \\quad (1\\%)$$
Kurva ROC akan terlihat luar biasa bagus ($AUC > 0.95$), padahal dari 110 prediksi positif, hanya 10 yang benar (*Precision* $= 10/110 \\approx 9\\%$).

**Prinsip Keamanan**: Pada data sangat tidak seimbang, **Precision-Recall AUC (PR-AUC)** adalah satu-satunya metrik evaluasi yang kredibel karena tidak melibatkan True Negative yang mendominasi pembagi.
`,
        },
      ],
    },
    {
      id: "ds-bab-4",
      slug: "rekayasa-fitur-dan-seleksi-variabel",
      title: "BAB 4: Rekayasa Fitur Tingkat Lanjut & Seleksi Variabel",
      orderIndex: 4,
      description: "Target encoding teratur (m-estimate smoothing), interaksi non-linear fitur, seleksi berbasis Mutual Information, Recursive Feature Elimination (RFE), dan algoritma Boruta.",
      subchapters: [
        {
          id: "ds-bab-4-1",
          slug: "target-encoding-dan-mutual-information",
          title: "4.1. Target Encoding Termuluskan & Seleksi Mutual Information",
          orderIndex: 1,
          description: "Mencegah overfitting pada kategori kardinalitas tinggi dengan smoothing bayesian dan kuantifikasi dependensi non-linear berbasis entropi Shannon.",
          content_markdown: `# 4.1. Target Encoding Termuluskan & Seleksi Mutual Information

## 1. Target Encoding dengan Pemulusan (M-Estimate Smoothing)
Untuk kategori $k$, target encoding naif menggunakan mean kelas: $S_k = \\frac{1}{n_k} \\sum_{i \\in k} y_i$. Ini menyebabkan overfitting parah jika $n_k$ sangat kecil.
Solusi: rumus pemulusan kredibilitas empiris:

$$S_k = \\frac{n_k \\cdot \\bar{y}_k + m \\cdot \\bar{y}_{\\text{global}}}{n_k + m}$$

Di mana:
- $\\bar{y}_k$ adalah rata-rata target dalam kategori $k$.
- $\\bar{y}_{\\text{global}}$ adalah rata-rata target seluruh populasi.
- $m$ adalah parameter bobot pemulusan (*smoothing weight*). Jika $n_k$ kecil, estimasi tertarik ke rata-rata global.

## 2. Seleksi Fitur Berbasis Mutual Information (MI)
Tidak seperti korelasi Pearson yang hanya menangkap relasi linear, **Mutual Information** mendeteksi ketergantungan statistik non-linear arbitrer antara variabel $X$ dan target $Y$:

$$I(X; Y) = \\sum_{x \\in \\mathcal{X}} \\sum_{y \\in \\mathcal{Y}} p(x, y) \\log \\frac{p(x, y)}{p(x) p(y)}$$

Jika $X$ dan $Y$ independen, $p(x, y) = p(x) p(y) \\implies I(X; Y) = 0$.
`,
        },
      ],
    },
    {
      id: "ds-bab-5",
      slug: "protokol-validasi-silang-dan-nested-cv",
      title: "BAB 5: Protokol Validasi Silang & Nested Cross-Validation",
      orderIndex: 5,
      description: "Strategi partisi data tanpa bias: Stratified K-Fold, Purged Group Time Series Split untuk data sekuensial keuangan, dan Nested Cross-Validation untuk estimasi performa model bebas bias optimasi hyperparameter.",
      subchapters: [
        {
          id: "ds-bab-5-1",
          slug: "arsitektur-nested-cross-validation",
          title: "5.1. Nested Cross-Validation: Pemisahan Seleksi Model dari Estimasi Galat",
          orderIndex: 1,
          description: "Mengapa GridSearch konvensional memberikan estimasi generalisasi optimistik palsu (*optimism bias*) dan struktur loop K-Fold ganda.",
          content_markdown: `# 5.1. Nested Cross-Validation: Pemisahan Seleksi Model dari Estimasi Galat

## 1. Problem Optimism Bias pada Penyetelan Hyperparameter
Jika seorang data scientist menggunakan K-Fold biasa untuk memilih hyperparameter terbaik $C^*$, skor rata-rata pada fold validasi tersebut telah terkontaminasi oleh proses optimasi (*fitting to the validation set*). Skor tersebut tidak lagi menjadi estimasi yang tidak bias (*unbiased estimate*) dari performa generalisasi model pada data unseen.

## 2. Arsitektur Dua Lingkaran Nested CV
1. **Outer Loop (Outer K Folds)**:
   Bertanggung jawab murni untuk mengestimasi performa generalisasi model akhir. Data dibagi menjadi $K_{\\text{outer}}$ bagian.
2. **Inner Loop (Inner K Folds)**:
   Berjalan di dalam setiap fold latih outer. Bertanggung jawab murni untuk melakukan seleksi model dan penyetelan hyperparameter terbaik:

$$\\text{Generalization Error} = \\frac{1}{K_{\\text{outer}}} \\sum_{k=1}^{K_{\\text{outer}}} \\mathcal{L}\\left( \\mathcal{M}_{k}^*, \\mathcal{D}_{\\text{test}}^{(k)} \\right)$$

Di mana $\\mathcal{M}_{k}^*$ adalah model terbaik yang dipilih oleh inner CV pada lipatan ke-$k$.
`,
        },
      ],
    },
    {
      id: "ds-bab-6",
      slug: "interpretasi-model-shap-dan-xai",
      title: "BAB 6: Interpretabilitas Model & Explainable AI (SHAP & LIME)",
      orderIndex: 6,
      description: "Membongkar 'kotak hitam' model prediktif: nilai Shapley dari teori permainan kooperatif, SHAP (SHapley Additive exPlanations), TreeSHAP berkinerja tinggi, dan LIME.",
      subchapters: [
        {
          id: "ds-bab-6-1",
          slug: "teori-permainan-shapley-dan-shap",
          title: "6.1. Formulasi Nilai Shapley & Kerangka Kerja SHAP (Lundberg & Lee)",
          orderIndex: 1,
          description: "Empat aksioma fundamental Shapley (Efisiensi, Simetri, Dummy, Aditivitas) dan dekomposisi kontribusi marginal setiap fitur prediktif.",
          content_markdown: `# 6.1. Formulasi Nilai Shapley & Kerangka Kerja SHAP (Lundberg & Lee)

## 1. Aksioma Teori Permainan Lloyd Shapley (1953)
Dalam teori permainan kooperatif, nilai Shapley $\\phi_i$ adalah satu-satunya metode pembagian keuntungan yang memenuhi 4 aksioma keadilan:
1. **Efficiency**: $\\sum_{i} \\phi_i = f(\\mathbf{x}) - \\mathbb{E}[f(\\mathbf{X})]$ (Jumlah kontribusi fitur sama dengan selisih prediksi dari rata-rata dasar).
2. **Symmetry**: Jika dua fitur memberikan kontribusi marginal yang sama untuk semua koalisi, nilai atribusinya identik.
3. **Dummy / Null Player**: Fitur yang tidak mengubah prediksi pada koalisi apa pun memiliki nilai atribusi $\\phi_i = 0$.
4. **Additivity**: Nilai atribusi untuk kombinasi dua model adalah jumlah atribusi masing-masing model.

## 2. Formulasi Matematis Kontribusi Marginal
$$\\phi_i(x) = \\sum_{S \\subseteq F \\setminus \\{i\\}} \\frac{|S|! (|F| - |S| - 1)!}{|F|!} \\Big( f_x(S \\cup \\{i\\}) - f_x(S) \\Big)$$

Di mana $F$ adalah himpunan seluruh fitur, dan $S$ adalah subset koalisi fitur tanpa menyertakan fitur ke-$i$.
`,
        },
      ],
    },
    {
      id: "ds-bab-7",
      slug: "eksperimentasi-terkelola-dan-mlflow",
      title: "BAB 7: Manajemen Eksperimen & Pelacakan Model Terkelola",
      orderIndex: 7,
      description: "Menghindari kekacauan eksperimen: pencatatan hyperparameter, metrik, artefak kurva evaluasi dengan MLflow, serta versioning data menggunakan Data Version Control (DVC).",
      subchapters: [
        {
          id: "ds-bab-7-1",
          slug: "arsitektur-pelacakan-mlflow",
          title: "7.1. Pola Pelacakan Eksperimen & Registri Model MLflow",
          orderIndex: 1,
          description: "Logging terstruktur run parameter, reproduktibilitas komputasi, dan promosi model dari staging ke production.",
          content_markdown: `# 7.1. Pola Pelacakan Eksperimen & Registri Model MLflow

## 1. Problem Reproduktibilitas dalam Riset Data Science
Tanpa pelacakan sistematis, data scientist sering kehilangan jejak mengenai: kombinasi hyperparameter mana yang menghasilkan skor terbaik pada branch kode mana, dan dataset versi apa yang digunakan untuk melatihnya.

## 2. Empat Komponen Utama MLflow
1. **MLflow Tracking**: API logging untuk menyimpan metrik (\`loss\`, \`f1_score\`), parameter (\`max_depth\`, \`learning_rate\`), dan artefak (file model biner, plot residual).
2. **MLflow Models**: Format kemasan standar yang memungkinkan model dijalankan di berbagai platform inferensi (Docker, Spark UDF, REST API).
3. **MLflow Model Registry**: Antarmuka terpusat untuk mengelola siklus hidup model (None $\\to$ Staging $\\to$ Production $\\to$ Archived).
`,
        },
      ],
    },
    {
      id: "ds-bab-8",
      slug: "proyek-prediksi-risiko-kredit-end-to-end",
      title: "BAB 8: Proyek Terapan: Prediksi Risiko Gagal Bayar Kredit End-to-End",
      orderIndex: 8,
      description: "Membangun sistem pemodelan sains data lengkap: penanganan data tidak seimbang, imputasi tanpa kebocoran, reduksi dimensi, interpretasi SHAP, dan evaluasi PR-AUC.",
      subchapters: [
        {
          id: "ds-bab-8-1",
          slug: "proyek-akhir-credit-scoring-model",
          title: "8.1. Proyek Akhir: Credit Default Risk Modeling & Penjelasan SHAP",
          orderIndex: 1,
          description: "Implementasi kode Python lengkap: isolasi transformator Pipeline Scikit-Learn, pelatihan model ensemble, dan visualisasi kontribusi fitur individual.",
          content_markdown: `# 8.1. Proyek Akhir: Credit Default Risk Modeling & Penjelasan SHAP

## 1. Latar Belakang Masalah
Bank komersial membutuhkan sistem penilaian kredit (*Credit Scoring*) otomatis untuk memprediksi nasabah berisiko tinggi gagal bayar (*default*). Model harus mematuhi regulasi keterbukaan perbankan: setiap penolakan pinjaman wajib disertai alasan logis (*adverse action notice*).

## 2. Kode Implementasi Pipa Lengkap Terverifikasi
\`\`\`python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import average_precision_score, classification_report

# 1. Simulasi Dataset Nasabah Kredit (10,000 Sampel dengan Imbalance 10%)
np.random.seed(42)
n_samples = 10_000

income = np.random.lognormal(mean=10.5, sigma=0.6, size=n_samples)
debt = np.random.lognormal(mean=9.5, sigma=0.8, size=n_samples)
debt_to_income = debt / (income + 1e-5)
credit_inquiries = np.random.poisson(lam=1.5, size=n_samples)

# Probabilitas default naik jika debt-to-income tinggi dan banyak inquiries
logits = -3.0 + 1.8 * debt_to_income + 0.4 * credit_inquiries
default_prob = 1.0 / (1.0 + np.exp(-logits))
y = (np.random.rand(n_samples) < default_prob).astype(int)

df = pd.DataFrame({
    "income": income,
    "debt": debt,
    "dti_ratio": debt_to_income,
    "inquiries_last_6m": credit_inquiries
})

# 2. Pembagian Data Latih dan Uji Sebelum Transformasi (Mencegah Leakage)
X_train, X_test, y_train, y_test = train_test_split(
    df, y, test_size=0.25, random_state=42, stratify=y
)

print(f"Proporsi Default Data Latih: {y_train.mean()*100:.2f}%")
print(f"Proporsi Default Data Uji  : {y_test.mean()*100:.2f}%")

# 3. Konstruksi Pipeline Terisolasi
credit_pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("classifier", HistGradientBoostingClassifier(
        max_iter=150,
        learning_rate=0.05,
        class_weight="balanced", # Mengatasi ketidakseimbangan kelas
        random_state=42
    ))
])

# 4. Pelatihan Model
credit_pipeline.fit(X_train, y_train)

# 5. Evaluasi Ilmiah dengan PR-AUC
y_pred_proba = credit_pipeline.predict_proba(X_test)[:, 1]
pr_auc = average_precision_score(y_test, y_pred_proba)
print(f"\\n=== HASIL EVALUASI MODEL ===")
print(f"Precision-Recall AUC (PR-AUC): {pr_auc:.4f}")

# 6. Analisis Interpretasi Fitur Sederhana (Koefisien / Feature Importance)
clf = credit_pipeline.named_steps["classifier"]
print("\\nModel berhasil dilatih dan siap dihubungkan dengan explainer SHAP untuk audit regulasi kredit.")
\`\`\`

## 3. Rubrik Penilaian Proyek
- **Disiplin Isolasi Data Leakage (30%)**: Seluruh operasi normalisasi dan imputasi dijalankan strictly di dalam Pipeline Scikit-Learn.
- **Ketepatan Evaluasi Imbalance (30%)**: Penggunaan PR-AUC dan weighted loss function alih-alih akurasi naif.
- **Transparansi Keterjelasan Model (25%)**: Penjelasan rasional faktor penolakan nasabah.
- **Kualitas Arsitektur Rekayasa Perangkat Lunak (15%)**: Kode terenkapsulasi rapi dan dapat direproduksi (*reproducible*).
`,
        },
      ],
    },
  ],
};
