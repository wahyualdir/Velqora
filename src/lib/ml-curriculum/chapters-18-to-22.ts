import { DocSectionItem } from "@/components/modul/doc-reader-layout";

/**
 * BAB 18 - 22 KURIKULUM MACHINE LEARNING VELQORA
 * Mencakup MLOps & Deployment, Etika & Responsible AI, Riset Terkini,
 * Ekosistem Tools, dan Proyek Portofolio / Studi Kasus Nyata.
 */
export const ML_CHAPTERS_18_TO_22: DocSectionItem[] = [
  // =========================================================================
  // BAB 18: MLOps & Deployment
  // =========================================================================
  {
    id: "ml-bab-18",
    slug: "bab-18-mlops-deployment",
    title: "BAB 18: MLOps & Deployment",
    orderIndex: 18,
    description: "Siklus hidup model di produksi: Scikit-Learn Pipeline & ColumnTransformer anti kebocoran data, persistensi Joblib, serving REST API dengan FastAPI, dan monitoring data drift.",
    subsections: [
      {
        id: "ml-bab-18-1",
        slug: "pipeline-columntransformer-anti-leakage",
        title: "18.1. Scikit-Learn Pipeline & ColumnTransformer: Mencegah Data Leakage",
        orderIndex: 1,
        description: "Mengemas imputasi, penskalaan, one-hot encoding, dan model estimasi ke dalam satu objek terpadu yang aman dari kebocoran data uji.",
        content_markdown: `# 18.1. Scikit-Learn Pipeline & ColumnTransformer: Mencegah Data Leakage

Salah satu kesalahan fatal dalam machine learning adalah **Data Leakage** — kondisi di mana informasi dari data evaluasi/uji secara tidak sengaja bocor ke proses pelatihan (misal menghitung rata-rata penskalaan atau imputasi pada seluruh dataset sebelum *train_test_split*).

---

## 18.1.1. Arsitektur Komposisi Pipeline
Scikit-Learn menyediakan \`Pipeline\` dan \`ColumnTransformer\` untuk merangkai alur kerja data secara atomik:

\`\`\`python
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np

# Simulasi data mentah heterogen
df = pd.DataFrame({
    'umur': [25, 42, np.nan, 38, 55],
    'pendapatan': [5000, 12000, 8500, np.nan, 21000],
    'kota': ['Jakarta', 'Surabaya', 'Bandung', 'Jakarta', 'Surabaya'],
    'status_member': ['Silver', 'Gold', 'Silver', 'Platinum', 'Gold'],
    'churn': [0, 1, 0, 0, 1]
})

X = df.drop(columns=['churn'])
y = df['churn']

numeric_features = ['umur', 'pendapatan']
categorical_features = ['kota', 'status_member']

# 1. Pipeline untuk fitur numerik
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# 2. Pipeline untuk fitur kategorikal
categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore'))
])

# 3. Gabungkan preprocessor berdasarkan kolom
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ]
)

# 4. Satukan Preprocessor dan Estimator ke Pipeline Akhir
full_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

# Fit hanya pada data latih (Anti Kebocoran Data Terjamin!)
full_pipeline.fit(X, y)
print("Pipeline lengkap berhasil dilatih.")
\`\`\`
`
      },
      {
        id: "ml-bab-18-2",
        slug: "serialisasi-joblib-dan-serving-fastapi",
        title: "18.2. Serialisasi Model (Joblib) & Serving Microservice REST API (FastAPI)",
        orderIndex: 2,
        description: "Menyimpan artefak model ke disk dan mengekspos endpoint inferensi berkinerja tinggi dengan validasi skema Pydantic.",
        content_markdown: `# 18.2. Serialisasi Model (Joblib) & Serving Microservice REST API (FastAPI)

---

## 18.2.1. Persistensi Model dengan \`joblib\`
\`joblib\` dioptimalkan khusus untuk objek Python yang menyimpan array NumPy berukuran besar di dalamnya:

\`\`\`python
import joblib

# Menyimpan pipeline terlatih ke file
joblib.dump(full_pipeline, 'model_churn_pipeline.joblib')

# Memuat kembali model di server produksi
loaded_model = joblib.load('model_churn_pipeline.joblib')
\`\`\`

---

## 18.2.2. Implementasi Endpoint Inferensi FastAPI

\`\`\`python
# main_api.py (Contoh implementasi microservice FastAPI)
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI(title="Velqora ML Inference API", version="1.0.0")

# Skema request validasi tipe data Pydantic
class CustomerPayload(BaseModel):
    umur: float
    pendapatan: float
    kota: str
    status_member: str

@app.post("/predict")
def predict_churn(customer: CustomerPayload):
    # Konversi payload menjadi DataFrame satu baris
    input_df = pd.DataFrame([customer.model_dump()])
    
    # Inferensi melalui model pipeline
    prob_churn = float(loaded_model.predict_proba(input_df)[0][1])
    is_churn = int(prob_churn >= 0.5)
    
    return {
        "churn_prediction": is_churn,
        "churn_probability": round(prob_churn, 4),
        "status": "success"
    }
\`\`\`
`
      },
      {
        id: "ml-bab-18-3",
        slug: "monitoring-data-drift",
        title: "18.3. Monitoring Model & Deteksi Data Drift di Lingkungan Produksi",
        orderIndex: 3,
        description: "Mendeteksi pergeseran distribusi data input (Covariate Shift) menggunakan uji statistik Kolmogorov-Smirnov.",
        content_markdown: `# 18.3. Monitoring Model & Deteksi Data Drift di Lingkungan Produksi

Performa model machine learning di produksi dapat menurun seiring waktu karena **Data Drift** (perubahan perilaku pengguna atau tren pasar).

Uji statistik **Kolmogorov-Smirnov (KS-Test)** membandingkan apakah distribusi data produksi saat ini berbeda secara signifikan dari distribusi data pelatihan:

\`\`\`python
from scipy import stats
import numpy as np

# Distribusi fitur data saat training
training_distribution = np.random.normal(loc=50, scale=10, size=1000)

# Distribusi data live dari pengguna bulan ini (terjadi drift pergeseran rata-rata ke 62)
production_distribution = np.random.normal(loc=62, scale=12, size=1000)

# Uji Kolmogorov-Smirnov 2-sampel
ks_stat, p_value = stats.ks_2samp(training_distribution, production_distribution)

print(f"KS Statistic: {ks_stat:.4f} | p-value: {p_value:.4e}")
if p_value < 0.05:
    print("PERINGATAN: Terdeteksi Data Drift signifikan! Model perlu dilatih ulang (Retrain Triggered).")
else:
    print("Distribusi stabil.")
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 19: Etika & Responsible AI
  // =========================================================================
  {
    id: "ml-bab-19",
    slug: "bab-19-etika-responsible-ai",
    title: "BAB 19: Etika & Responsible AI",
    orderIndex: 19,
    description: "Keadilan algoritmik (Fairness), rasio Disparate Impact, Demographic Parity, mitigasi bias demografi, dan privasi data terdistribusi.",
    subsections: [
      {
        id: "ml-bab-19-1",
        slug: "metrik-keadilan-disparate-impact",
        title: "19.1. Metrik Keadilan Algoritmik: Disparate Impact & Demographic Parity",
        orderIndex: 1,
        description: "Mengukur apakah keputusan otomatis model adil terhadap kelompok yang dilindungi (aturan empat per lima / four-fifths rule).",
        content_markdown: `# 19.1. Metrik Keadilan Algoritmik: Disparate Impact & Demographic Parity

Model machine learning yang dilatih pada data historis yang memiliki bias manusia akan mereproduksi dan memperparah diskriminasi tersebut.

---

## 19.1.1. Rasio Dampak Berbeda (*Disparate Impact*)
Aturan standar hukum ketenagakerjaan AS (EEOC 80% Rule) menyatakan bahwa tingkat penerimaan kelompok non-istimewa (*unprivileged*) tidak boleh kurang dari 80% dari tingkat penerimaan kelompok istimewa (*privileged*):

$$\\text{Disparate Impact} = \\frac{P(\\hat{y}=1 \\mid D=\\text{unprivileged})}{P(\\hat{y}=1 \\mid D=\\text{privileged})}$$

Jika rasio $< 0.8$, model dinyatakan memiliki bias diskriminasi yang merugikan.

\`\`\`python
import numpy as np

def evaluate_fairness(y_pred, sensitive_attribute):
    # sensitive_attribute: 1 (Privileged), 0 (Unprivileged)
    rate_unprivileged = np.mean(y_pred[sensitive_attribute == 0])
    rate_privileged = np.mean(y_pred[sensitive_attribute == 1])
    
    di_ratio = rate_unprivileged / (rate_privileged + 1e-9)
    print(f"Tingkat Penerimaan Kelompok Privileged: {rate_privileged*100:.1f}%")
    print(f"Tingkat Penerimaan Kelompok Unprivileged: {rate_unprivileged*100:.1f}%")
    print(f"Rasio Disparate Impact: {di_ratio:.3f}")
    
    if di_ratio < 0.8:
        print("STATUS: Model GAGAL uji keadilan (Indikasi Bias Sistemik)!")
    else:
        print("STATUS: Model MEMENUHI kriteria keadilan (Fairness Passed).")

# Contoh evaluasi keputusan persetujuan kredit pinjaman
dummy_preds = np.array([1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0])
dummy_group = np.array([1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0])
evaluate_fairness(dummy_preds, dummy_group)
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 20: Topik Lanjutan & Riset Terkini
  // =========================================================================
  {
    id: "ml-bab-20",
    slug: "bab-20-topik-lanjutan-riset-terkini",
    title: "BAB 20: Topik Lanjutan & Riset Terkini",
    orderIndex: 20,
    description: "Arah penelitian terdepan: Self-Supervised & Contrastive Learning (SimCLR), Graph Neural Networks (GNN), AutoML, dan Causal Inference.",
    subsections: [
      {
        id: "ml-bab-20-1",
        slug: "contrastive-learning-dan-infonce",
        title: "20.1. Self-Supervised Learning & Contrastive Loss (SimCLR)",
        orderIndex: 1,
        description: "Belajar representasi fitur berkualitas tinggi dari data tanpa label dengan mendekatkan augmentasi positif dan menjauhkan contoh negatif.",
        content_markdown: `# 20.1. Self-Supervised Learning & Contrastive Loss (SimCLR)

Pelabelan manual jutaan data membutuhkan biaya yang sangat tinggi. **Self-Supervised Learning** melatih representasi data secara mandiri tanpa label manusia.

Dalam **Contrastive Learning** (seperti SimCLR), dua augmentasi berbeda dari gambar yang sama membentuk pasangan positif $(z_i, z_j)$. Fungsi kerugian **InfoNCE** memaksimalkan kemiripan pasangan positif sekaligus meminimalkan kemiripan dengan contoh negatif lainnya:

$$\\ell_{i, j} = -\\log \\frac{\\exp(\\text{sim}(z_i, z_j) / \\tau)}{\\sum_{k=1}^{2N} \\mathbf{1}_{[k \\neq i]} \\exp(\\text{sim}(z_i, z_k) / \\tau)}$$

\`\`\`python
import numpy as np

def compute_infonce_loss(z_i, z_j, negatives, temperature=0.07):
    # Cosine similarity
    sim_pos = np.dot(z_i, z_j) / (np.linalg.norm(z_i) * np.linalg.norm(z_j))
    numerator = np.exp(sim_pos / temperature)
    
    denominator = numerator
    for neg in negatives:
        sim_neg = np.dot(z_i, neg) / (np.linalg.norm(z_i) * np.linalg.norm(neg))
        denominator += np.exp(sim_neg / temperature)
        
    return -np.log(numerator / denominator)

z_anchor = np.array([1.0, 0.2, -0.1])
z_positive = np.array([0.95, 0.25, -0.05])
z_negs = [np.array([-0.8, -0.4, 0.5]), np.array([0.0, -0.9, 0.1])]

print(f"InfoNCE Contrastive Loss: {compute_infonce_loss(z_anchor, z_positive, z_negs):.4f}")
\`\`\`
`
      },
      {
        id: "ml-bab-20-2",
        slug: "graph-neural-networks-dan-automl",
        title: "20.2. Pengantar Graph Neural Networks (GNN) & AutoML",
        orderIndex: 2,
        description: "Pembelajaran representasi pada struktur graf non-Euclidean (molekul obat, jejaring sosial) dan otomatisasi pipeline ML.",
        content_markdown: `# 20.2. Pengantar Graph Neural Networks (GNN) & AutoML

---

## 20.2.1. Graph Neural Networks (GNN)
Data dunia nyata seringkali berbentuk graf $G = (V, E)$ di mana entitas saling terhubung:
- Molekul kimia untuk penemuan obat baru (*drug discovery*).
- Graf jejaring sosial dan pencegahan penipuan transaksi keuangan (*fraud ring*).

GNN menggunakan paradigma **Message Passing**: setiap node mengagregasikan informasi dari tetangga sekitarnya untuk memperbarui representasi vektor dirinya sendiri.

---

## 20.2.2. Automated Machine Learning (AutoML)
AutoML mengotomatiskan pencarian algoritma terbaik dan tuning hyperparameter secara cerdas menggunakan Bayesian Optimization atau Genetic Algorithms:
- Pustaka: TPOT, Auto-Sklearn, Optuna, FLAML.
`
      }
    ]
  },

  // =========================================================================
  // BAB 21: Tools & Ekosistem
  // =========================================================================
  {
    id: "ml-bab-21",
    slug: "bab-21-tools-ekosistem",
    title: "BAB 21: Tools & Ekosistem",
    orderIndex: 21,
    description: "Peta ekosistem machine learning profesional: Peran komparatif Scikit-Learn, PyTorch, Hugging Face, XGBoost, LightGBM, serta integrasi OpenML dan MLflow.",
    subsections: [
      {
        id: "ml-bab-21-1",
        slug: "peta-ekosistem-dan-komparasi-tools",
        title: "21.1. Lanskap Alat Machine Learning: Dari Tabular ke Deep Learning",
        orderIndex: 1,
        description: "Kapan memilih Scikit-Learn vs PyTorch vs Gradient Boosting Libraries (XGBoost/LightGBM).",
        content_markdown: `# 21.1. Lanskap Alat Machine Learning: Dari Tabular ke Deep Learning

| Pustaka | Domain Utama | Kelebihan Utama |
|---|---|---|
| **Scikit-Learn** | Tabular Data, Preprocessing, ML Klasik | API konsisten terbaik (\`fit\`/\`transform\`/\`predict\`), dokumentasi emas, ringan di CPU. |
| **XGBoost / LightGBM** | Tabular Kompetisi (High Performance) | Sangat cepat di tabular besar, native GPU support, akurasi state-of-the-art. |
| **PyTorch** | Deep Learning, Vision, Audio, NLP Riset | Graf komputasi dinamis (Autograd), ekosistem riset paling populer di dunia. |
| **Hugging Face** | Pretrained Transformers & LLMs | Repository puluhan ribu model open-source, API \`pipeline\` praktis. |
| **MLflow** | MLOps & Experiment Tracking | Tracking metrik, parameter log, dan Model Registry terintegrasi. |

---

## 21.1.2. Integrasi OpenML di Scikit-Learn
Scikit-Learn terhubung langsung dengan basis data repositori dataset dunia **OpenML**:

\`\`\`python
from sklearn.datasets import fetch_openml

# Mengunduh dataset resmi Titanic dari OpenML secara programmatic
titanic = fetch_openml('titanic', version=1, as_frame=True)
print("Nama kolom dataset Titanic OpenML:\n", titanic.feature_names)
print(f"Bentuk data: {titanic.data.shape}")
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 22: Proyek & Studi Kasus
  // =========================================================================
  {
    id: "ml-bab-22",
    slug: "bab-22-proyek-studi-kasus",
    title: "BAB 22: Proyek & Studi Kasus",
    orderIndex: 22,
    description: "Proyek portofolio end-to-end: Studi kasus lengkap prediksi churn pelanggan telekomunikasi, strategi kompetisi Kaggle, dan pengujian model di produksi.",
    subsections: [
      {
        id: "ml-bab-22-1",
        slug: "proyek-portofolio-churn-prediction-end-to-end",
        title: "22.1. Proyek Portofolio: End-to-End Telco Customer Churn Pipeline",
        orderIndex: 1,
        description: "Implementasi proyek lengkap dari eksplorasi data, rekayasa fitur, penanganan imbalance, tuning cross-validation, hingga evaluasi bisnis.",
        content_markdown: `# 22.1. Proyek Portofolio: End-to-End Telco Customer Churn Pipeline

## Latar Belakang Masalah Bisnis
Mempertahankan pelanggan lama jauh lebih murah (5-7 kali lipat) daripada mencari pelanggan baru. Perusahaan telekomunikasi ingin mengidentifikasi pelanggan berisiko berhenti (*churn*) 30 hari sebelum kontrak berakhir agar tim retensi dapat menawarkan promosi yang tepat.

---

## Implementasi Pipeline Lengkap

\`\`\`python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix

# 1. Generate dataset telekomunikasi realistis
np.random.seed(42)
n_samples = 1200

data = {
    'tenure_months': np.random.randint(1, 72, size=n_samples),
    'monthly_charges': np.random.uniform(20.0, 120.0, size=n_samples),
    'total_charges': np.random.uniform(100.0, 8000.0, size=n_samples),
    'contract_type': np.random.choice(['Month-to-month', 'One-year', 'Two-year'], p=[0.5, 0.3, 0.2], size=n_samples),
    'payment_method': np.random.choice(['Electronic check', 'Mailed check', 'Bank transfer', 'Credit card'], size=n_samples),
    'internet_service': np.random.choice(['DSL', 'Fiber optic', 'No'], p=[0.4, 0.4, 0.2], size=n_samples)
}

df = pd.DataFrame(data)
# Hubungan probabilitas churn (Month-to-month + Fiber optic berpeluang churn lebih tinggi)
churn_prob = (
    0.15 +
    (df['contract_type'] == 'Month-to-month') * 0.35 +
    (df['internet_service'] == 'Fiber optic') * 0.20 -
    (df['tenure_months'] / 100.0) * 0.25
).clip(0.05, 0.90)

df['churn'] = (np.random.rand(n_samples) < churn_prob).astype(int)

# 2. Split Data dengan Stratifikasi (Menjaga rasio churn seimbang)
X = df.drop(columns=['churn'])
y = df['churn']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# 3. Preprocessing ColumnTransformer
num_cols = ['tenure_months', 'monthly_charges', 'total_charges']
cat_cols = ['contract_type', 'payment_method', 'internet_service']

preprocessor = ColumnTransformer(
    transformers=[
        ('num', Pipeline([
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler())
        ]), num_cols),
        ('cat', Pipeline([
            ('imputer', SimpleImputer(strategy='most_frequent')),
            ('ohe', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
        ]), cat_cols)
    ]
)

# 4. Model Pipeline dengan HistGradientBoosting
pipeline = Pipeline([
    ('prep', preprocessor),
    ('model', HistGradientBoostingClassifier(max_iter=150, learning_rate=0.08, random_state=42))
])

# 5. Evaluasi K-Fold Cross Validation
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(pipeline, X_train, y_train, cv=cv, scoring='roc_auc')
print(f"Rata-rata 5-Fold ROC-AUC Latih: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

# 6. Fit pada Full Train & Evaluasi Test Set Independen
pipeline.fit(X_train, y_train)
y_prob = pipeline.predict_proba(X_test)[:, 1]
y_pred = (y_prob >= 0.45).astype(int) # Ambang batas yang disesuaikan

print("\n--- HASIL EVALUASI BISNIS TEST SET ---")
print(f"ROC-AUC Test: {roc_auc_score(y_test, y_prob):.4f}")
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred, target_names=['Tetap', 'Churn']))
\`\`\`
`
      },
      {
        id: "ml-bab-22-2",
        slug: "strategi-kompetisi-kaggle-dan-ab-testing",
        title: "22.2. Strategi Juara Kaggle: Validasi Kokoh, Stacking, & A/B Testing",
        orderIndex: 2,
        description: "Praktek terbaik machine learning kompetitif: penyelarasan validasi lokal dengan leaderboard, blend ensemble, dan uji A/B di produksi.",
        content_markdown: `# 22.2. Strategi Juara Kaggle: Validasi Kokoh, Stacking, & A/B Testing

---

## 22.2.1. Golden Rule: "Trust Your Local CV"
Kesalahan umum pemula di kompetisi Kaggle adalah melakukan *overfitting* pada Public Leaderboard. 
- Gunakan skema **Stratified K-Fold** atau **Group K-Fold** (jika ada relasi kelompok pasien/toko) yang ketat.
- Jangan pernah memilih model hanya berdasarkan kenaikan minor di leaderboard publik jika skor CV lokal menurun.

---

## 22.2.2. Siklus A/B Testing Produksi
Setelah model berhasil dilatih:
1. **Shadow Deployment**: Model baru menerima salinan traffic nyata dan memprediksi secara pasif di latar belakang tanpa mempengaruhi pengguna untuk memverifikasi latensi dan reliabilitas.
2. **Canary Release**: 5% traffic dialihkan ke model baru.
3. **A/B Testing**: Kelompok kontrol (Model A lama) dibandingkan dengan kelompok perlakuan (Model B baru) terhadap metrik bisnis nyata (seperti rasio retensi atau konversi penjualan).
`
      }
    ]
  }
];
