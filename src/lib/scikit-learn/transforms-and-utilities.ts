import { DocSectionItem } from "@/components/modul/doc-reader-layout";

/**
 * 4. DATASET TRANSFORMATIONS & PIPELINES
 */
export const DATA_TRANSFORMS_CHAPTER: DocSectionItem = {
  id: "sec-4-data-transforms",
  slug: "data-transforms",
  title: "4. Dataset transformations",
  orderIndex: 4,
  description: "Transformasi fitur, pra-pemrosesan data numerik dan kategorikal, imputasi nilai hilang, dan perakitan Pipeline Scikit-Learn.",
  subsections: [
    {
      id: "sec-4-1-compose",
      slug: "compose",
      title: "4.1. Pipelines and composite estimators",
      orderIndex: 1,
      description: "Membangun alur kerja pemrosesan data end-to-end yang bersih dan bebas data leakage menggunakan Pipeline dan ColumnTransformer.",
      content_markdown: `# 4.1. Pipelines and composite estimators

\`Pipeline\` menggabungkan beberapa langkah pra-pemrosesan data dan model estimator menjadi satu kesatuan objek yang dapat diuji silang (*cross-validated*) tanpa kebocoran data (*data leakage*).

---

## 4.1.1. Pipeline Usage
\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

# Membangun pipeline terpadu
pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', LogisticRegression(random_state=42))
])

# Fit dan predict sekaligus
pipe.fit([[0, 0], [1, 1]], [0, 1])
print("Prediksi:", pipe.predict([[2, 2]]))
\`\`\`

---

## 4.1.2. ColumnTransformer for Heterogeneous Data
\`ColumnTransformer\` memungkinkan transformasi yang berbeda untuk setiap kelompok kolom dalam dataset tabular heterogen (misalnya One-Hot Encoding untuk kolom teks/kategori dan StandardScaler untuk kolom numerik):

\`\`\`python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), ['umur', 'gaji']),
        ('cat', OneHotEncoder(drop='first'), ['pekerjaan', 'kota'])
    ]
)
\`\`\`
`
    },
    {
      id: "sec-4-2-preprocessing",
      slug: "preprocessing",
      title: "4.2. Preprocessing data",
      orderIndex: 2,
      description: "Penskalaan fitur, normalisasi, encoding variabel kategorikal, dan diskritisasi numerik.",
      content_markdown: `# 4.2. Preprocessing data

Modul \`sklearn.preprocessing\` mengubah data mentah menjadi representasi yang optimal untuk algoritma pembelajaran mesin.

---

## 4.2.1. Feature Scaling (Penskalaan Fitur)
1. **StandardScaler**: Mengubah fitur sehingga memiliki rata-rata $\\mu = 0$ dan varians unit $\\sigma^2 = 1$:
   $$z = \\frac{x - \\mu}{\\sigma}$$
2. **MinMaxScaler**: Menskalakan fitur ke dalam rentang tetap $[0, 1]$:
   $$x_{\\text{scaled}} = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}$$
3. **RobustScaler**: Menggunakan median dan rentang interkuartil (IQR) sehingga kebal terhadap outliers.
4. **QuantileTransformer & PowerTransformer**: Mengubah distribusi fitur menjadi seragam (*uniform*) atau normal Gaussian (Box-Cox & Yeo-Johnson).

---

## 4.2.2. Categorical Encoding
- **OneHotEncoder**: Mengubah kategori diskrit menjadi representasi matriks biner *dummy*.
- **OrdinalEncoder**: Mengubah kategori menjadi nilai integer berurutan.
- **TargetEncoder**: Mengodekan kategori berdasarkan rata-rata nilai target bersyarat dengan regularisasi smoothing empiris.
`
    },
    {
      id: "sec-4-3-impute",
      slug: "impute",
      title: "4.3. Imputation of missing values",
      orderIndex: 3,
      description: "Penanganan nilai yang hilang (missing values) menggunakan SimpleImputer, KNNImputer, dan IterativeImputer.",
      content_markdown: `# 4.3. Imputation of missing values

Mengisi nilai kosong (\`NaN\`) dalam dataset tabular:
- \`SimpleImputer\`: Imputasi univariat menggunakan statistik mean, median, modus (\`most_frequent\`), atau nilai konstanta tetap.
- \`KNNImputer\`: Mengisi nilai kosong berdasarkan rata-rata terbobot jarak Euclidean dari $k$-tetangga terdekat yang memiliki nilai lengkap.
- \`IterativeImputer\` (MICE): Memodelkan setiap fitur yang hilang secara berulang sebagai fungsi regresi dari fitur-fitur lainnya.
`
    }
  ]
};

/**
 * 5. INSPECTION & VISUALIZATIONS
 */
export const INSPECTION_CHAPTER: DocSectionItem = {
  id: "sec-5-inspection-visualizations",
  slug: "inspection-visualizations",
  title: "5. Inspection and Visualizations",
  orderIndex: 5,
  description: "Alat inspeksi transparansi model ML (Partial Dependence, Permutation Importance) dan visualisasi evaluasi grafis.",
  subsections: [
    {
      id: "sec-5-1-partial-dependence",
      slug: "partial-dependence",
      title: "5.1. Partial Dependence and ICE plots",
      orderIndex: 1,
      description: "Memvisualisasikan pengaruh marginal satu atau dua fitur terhadap nilai prediksi target model.",
      content_markdown: `# 5.1. Partial Dependence and Individual Conditional Expectation plots

- **Partial Dependence Plots (PDP)** (\`PartialDependenceDisplay\`): Menunjukkan pengaruh marginal rata-rata dari satu atau dua fitur input terhadap hasil prediksi model.
- **Individual Conditional Expectation (ICE)**: Menunjukkan garis respon individual untuk setiap observasi sampel secara terpisah, membantu mendeteksi heterogenitas efek fitur antar subkelompok data.
`
    },
    {
      id: "sec-5-2-permutation-importance",
      slug: "permutation-importance",
      title: "5.2. Permutation feature importance",
      orderIndex: 2,
      description: "Pengukuran kepentingan fitur model-agnostik dengan mengocok nilai fitur secara acak dan mengamati penurunan skor performa.",
      content_markdown: `# 5.2. Permutation feature importance

\`permutation_importance\` mengevaluasi kontribusi fitur pada data uji secara *model-agnostic*. Nilai suatu fitur dikocok (*shuffled*) secara acak, dan penurunan metrik skor model diukur:

$$\\text{Importance}(f) = \\text{Skor Baseline} - \\text{Skor Shuffled}(f)$$

Keunggulan utama: tidak bias terhadap fitur berkardinalitas tinggi seperti halnya *Gini importance* pada Random Forest.
`
    },
    {
      id: "sec-5-3-visualizations",
      slug: "visualizations",
      title: "5.3. Visualizations API",
      orderIndex: 3,
      description: "Objek visualisasi terpadu untuk evaluasi grafis: ConfusionMatrixDisplay, RocCurveDisplay, PrecisionRecallDisplay.",
      content_markdown: `# 5.3. Visualizations API

Scikit-Learn menyediakan API visualisasi interaktif satu baris kode:
- \`ConfusionMatrixDisplay.from_estimator\`
- \`RocCurveDisplay.from_estimator\`
- \`PrecisionRecallDisplay.from_estimator\`
- \`PredictionErrorDisplay.from_estimator\`
- \`LearningCurveDisplay.from_estimator\`
`
    }
  ]
};

/**
 * 6. DATASET LOADING UTILITIES
 */
export const DATASETS_CHAPTER: DocSectionItem = {
  id: "sec-6-datasets",
  slug: "datasets",
  title: "6. Dataset loading utilities",
  orderIndex: 6,
  description: "Pemuatan dataset standar bawaan (toy datasets) dan generator dataset sintetis.",
  subsections: [
    {
      id: "sec-6-1-toy-datasets",
      slug: "toy-datasets",
      title: "6.1. Toy datasets",
      orderIndex: 1,
      description: "Dataset kecil bawaan Scikit-Learn untuk eksperimen cepat tanpa unduhan jaringan.",
      content_markdown: `# 6.1. Toy datasets

Scikit-Learn menyertakan kumpulan dataset bawaan yang siap pakai:
- \`load_iris()\`: 150 sampel, 4 fitur, 3 kelas bunga Iris.
- \`load_diabetes()\`: 442 sampel pasien diabetes untuk pengujian regresi.
- \`load_digits()\`: 1797 sampel citra angka tulisan tangan 8x8 piksel.
- \`load_breast_cancer()\`: 569 sampel diagnosis tumor payudara (Wisconsin).
- \`load_wine()\`: 178 sampel analisis kimiawi kultivar anggur.
`
    },
    {
      id: "sec-6-2-sample-generators",
      slug: "sample-generators",
      title: "6.2. Generated synthetic datasets",
      orderIndex: 2,
      description: "Generator dataset sintetis dengan parameter terkontrol untuk pengujian algoritma.",
      content_markdown: `# 6.2. Generated synthetic datasets

- \`make_classification\`: Membuat dataset klasifikasi multikelas sintetis dengan fitur informatif, redundan, dan noise terkontrol.
- \`make_regression\`: Membuat dataset regresi linear sintetis.
- \`make_blobs\`: Membuat kluster Gaussian bulat untuk pengujian clustering.
- \`make_moons\` & \`make_circles\`: Membuat dataset geometri non-linear untuk menguji batas keputusan kernel SVM dan Deep Learning.
`
    }
  ]
};

/**
 * 7. COMPUTING WITH SCIKIT-LEARN
 */
export const COMPUTING_CHAPTER: DocSectionItem = {
  id: "sec-7-computing",
  slug: "computing",
  title: "7. Computing with scikit-learn",
  orderIndex: 7,
  description: "Strategi komputasi dataset besar (out-of-core learning), eksekusi paralel (Joblib), dan praktik terbaik produksi.",
  subsections: [
    {
      id: "sec-7-1-scaling-strategies",
      slug: "scaling-strategies",
      title: "7.1. Scaling strategies: bigger data",
      orderIndex: 1,
      description: "Pembelajaran bertahap (incremental learning) menggunakan partial_fit untuk data yang melebihi kapasitas memori RAM.",
      content_markdown: `# 7.1. Scaling strategies: bigger data

Ketika ukuran data melebihi kapasitas RAM, Scikit-Learn menyediakan antarmuka \`partial_fit\` untuk *out-of-core streaming learning*:

Estimator yang mendukung \`partial_fit\`:
- Klasifikasi: \`SGDClassifier\`, \`Perceptron\`, \`MultinomialNB\`, \`BernoulliNB\`.
- Regresi: \`SGDRegressor\`, \`PassiveAggressiveRegressor\`.
- Clustering: \`MiniBatchKMeans\`.
- Reduksi Dimensi: \`IncrementalPCA\`.
`
    },
    {
      id: "sec-7-2-parallelism",
      slug: "parallelism",
      title: "7.2. Parallelism and resource management",
      orderIndex: 2,
      description: "Optimalisasi multi-threading dan multi-processing menggunakan Joblib dan parameter n_jobs.",
      content_markdown: `# 7.2. Parallelism and resource management

Scikit-Learn mengintegrasikan \`joblib\` untuk eksekusi komputasi paralel:
- \`n_jobs=-1\`: Memanfaatkan seluruh inti CPU yang tersedia.
- Backend \`loky\` untuk paralelisasi berbasis proses bebas race condition.
`
    },
    {
      id: "sec-7-3-common-pitfalls",
      slug: "common-pitfalls",
      title: "7.3. Common pitfalls and recommended practices",
      orderIndex: 3,
      description: "Pedoman pencegahan kebocoran data (data leakage), reproduktibilitas acak, dan alur kerja standar industri.",
      content_markdown: `# 7.3. Common pitfalls and recommended practices

### 1. Pencegahan Kebocoran Data (Data Leakage)
Jangan pernah menjalankan \`fit_transform\` dari estimator preprocessing (seperti \`StandardScaler\` atau \`OneHotEncoder\`) pada keseluruhan dataset sebelum membaginya menjadi data latih dan data uji. Selalu gunakan \`Pipeline\` agar tahap fitting hanya dilakukan pada data latih di setiap lipatan cross-validation.

### 2. Reproduktibilitas Eksperimen
Tetapkan nilai parameter \`random_state\` secara eksplisit pada algoritma stokastik agar hasil eksperimen dapat direplikasi dengan identik.
`
    }
  ]
};
