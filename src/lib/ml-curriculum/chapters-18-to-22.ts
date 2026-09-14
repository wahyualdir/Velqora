import { DocSectionItem } from "@/components/modul/doc-reader-layout";

/**
 * BAB 18 - 22 KURIKULUM MACHINE LEARNING VELQORA
 * Mencakup MLOps & Deployment Produksi (Joblib, FastAPI, Data Drift), Semi-Supervised Learning,
 * Optimasi Hiperparameter Bayesian & AutoML, Etika & Algorithmic Fairness, serta
 * Proyek Portofolio Nyata (End-to-End Telco Customer Churn Enterprise Pipeline).
 */
export const ML_CHAPTERS_18_TO_22: DocSectionItem[] = [
  // =========================================================================
  // BAB 18: MLOps & Deployment Produksi
  // =========================================================================
  {
    id: "ml-bab-18",
    slug: "bab-18-mlops-deployment",
    title: "BAB 18: MLOps & Model Deployment Produksi",
    orderIndex: 18,
    description: "Siklus hidup model di produksi: Persistensi Joblib vs ONNX, penyajian REST API dengan FastAPI & Pydantic, serta monitoring pergeseran distribusi data (Data Drift & Concept Drift).",
    subsections: [
      {
        id: "ml-bab-18-1",
        slug: "persistensi-model-joblib-onnx",
        title: "18.1. Persistensi Model: Joblib, Safe Serialization, & ONNX",
        orderIndex: 1,
        description: "Serialisasi pipeline lengkap, kompresi level, portabilitas inferensi lintas platform (Open Neural Network Exchange), dan keamanan pickle.",
        content_markdown: `# 18.1. Persistensi Model: Joblib, Safe Serialization, & ONNX

Setelah model selesai dilatih dan divalidasi, artefak model harus diekspor ke disk agar dapat dimuat ulang oleh sistem backend tanpa memerlukan pelatihan ulang.

---

## 18.1.1. Joblib vs. Standar Pickle Python
Modul \`pickle\` bawaan Python tidak efisien dalam menangani array NumPy berukuran besar. Scikit-Learn merekomendasikan **\`joblib\`**, yang mengoptimalkan serialisasi memori terbagi (*memory-mapping*) dan kompresi zlib/lz4:

\`\`\`python
import joblib
# Menyimpan seluruh objek pipeline (termasuk transformer dan estimator)
joblib.dump(full_pipeline, 'model_pipeline.joblib', compress=3)

# Memuat model di lingkungan server produksi
loaded_pipeline = joblib.load('model_pipeline.joblib')
\`\`\`

---

## 18.1.2. Portabilitas Lintas Bahasa dengan ONNX
Untuk mengeksekusi inferensi di lingkungan non-Python (seperti C++, Java, Rust, atau browser JavaScript), model Scikit-Learn dapat diekspor ke format **ONNX** (*Open Neural Network Exchange*) menggunakan library \`skl2onnx\`.

---

## 18.1.3. Implementasi Lengkap Python

\`\`\`python
import numpy as np
import joblib
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
import tempfile
import os

# 1. Latih model dalam Pipeline
X, y = load_iris(return_X_y=True)
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('rf', RandomForestClassifier(n_estimators=30, random_state=42))
])
pipeline.fit(X, y)

# 2. Simpan ke file temporer menggunakan joblib
with tempfile.NamedTemporaryFile(suffix='.joblib', delete=False) as tmp_file:
    model_path = tmp_file.name
    joblib.dump(pipeline, model_path, compress=('zlib', 3))

print("=" * 60)
print("HASIL SERIALISASI ARTEFAK MODEL")
print("=" * 60)
print(f"File Model Tersimpan di : {model_path}")
print(f"Ukuran File Artefak     : {os.path.getsize(model_path)} bytes")

# 3. Muat kembali model dan jalankan inferensi verifikasi
loaded_model = joblib.load(model_path)
sample = np.array([[5.1, 3.5, 1.4, 0.2]])
pred_class = loaded_model.predict(sample)[0]
pred_prob = loaded_model.predict_proba(sample)[0]

print(f"Prediksi Kelas Model Terload : {pred_class} (Prob: {pred_prob[pred_class]:.2%})")
os.remove(model_path) # Bersihkan file temporer
\`\`\`
`
      },
      {
        id: "ml-bab-18-2",
        slug: "serving-rest-api-fastapi-drift",
        title: "18.2. Serving REST API dengan FastAPI & Monitoring Data Drift",
        orderIndex: 2,
        description: "Arsitektur microservice inferensi real-time berbasis schema Pydantic, serta uji Kolmogorov-Smirnov untuk mendeteksi pergeseran distribusi fitur.",
        content_markdown: `# 18.2. Serving REST API dengan FastAPI & Monitoring Data Drift

---

## 18.2.1. Arsitektur REST API dengan FastAPI
FastAPI merupakan standar modern untuk menyajikan model machine learning karena memanfaatkan skema validasi tipe data Pydantic yang kuat, performa asinkron tinggi (*async/await*), serta dokumentasi interaktif Swagger otomatis.

---

## 18.2.2. Deteksi Pergeseran Data (Data Drift)
Performa model di produksi perlahan memburuk seiring berjalannya waktu karena perubahan perilaku pengguna atau kondisi ekonomi. 
- **Data Drift**: Distribusi fitur masukan bergeser $P(X_{\\text{prod}}) \\ne P(X_{\\text{train}})$.
- **Concept Drift**: Hubungan kausal antara fitur dan label berubah $P(Y \\mid X_{\\text{prod}}) \\ne P(Y \\mid X_{\\text{train}})$.

Uji statistik **Kolmogorov-Smirnov (KS-Test)** dua sampel membandingkan distribusi empiris untuk mendeteksi pergeseran secara otomatis:

$$D = \\sup_x |F_{\\text{train}}(x) - F_{\\text{prod}}(x)|$$

Jika nilai $p$-value $< 0.05$, hipotesis nol ditolak, menandakan fitur telah mengalami *drift* dan model perlu dilatih ulang.

---

## 18.2.3. Implementasi Lengkap Python

\`\`\`python
import numpy as np
from scipy import stats

# 1. Simulasi Skrip Server FastAPI (Snippet Konseptual)
FASTAPI_CODE = """
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib

app = FastAPI(title="ML Prediction Service", version="1.0")
model = joblib.load("model_pipeline.joblib")

class IrisInput(BaseModel):
    sepal_length: float = Field(..., example=5.1)
    sepal_width: float = Field(..., example=3.5)
    petal_length: float = Field(..., example=1.4)
    petal_width: float = Field(..., example=0.2)

@app.post("/predict")
def predict(data: IrisInput):
    X = [[data.sepal_length, data.sepal_width, data.petal_length, data.petal_width]]
    pred = int(model.predict(X)[0])
    prob = model.predict_proba(X)[0].tolist()
    return {"prediction": pred, "probabilities": prob}
"""

print("Kode Template FastAPI Microservice Siap Digunakan.")

# 2. Uji Kolmogorov-Smirnov untuk Deteksi Data Drift
np.random.seed(42)
dist_train = np.random.normal(loc=50, scale=10, size=1000) # Distribusi latihan
dist_prod_normal = np.random.normal(loc=50.2, scale=9.8, size=500) # Produksi stabil
dist_prod_drifted = np.random.normal(loc=56.0, scale=12.0, size=500) # Produksi bergeser drastis

ks_stat_1, p_val_1 = stats.ks_2samp(dist_train, dist_prod_normal)
ks_stat_2, p_val_2 = stats.ks_2samp(dist_train, dist_prod_drifted)

print("=" * 60)
print("HASIL DETEKSI DATA DRIFT (KS-TEST)")
print("=" * 60)
print(f"Batch Produksi Normal  : KS Stat={ks_stat_1:.4f}, p-value={p_val_1:.4f} -> {'DRIFT TERDETEKSI' if p_val_1 < 0.05 else 'STABIL'}")
print(f"Batch Produksi Drifted : KS Stat={ks_stat_2:.4f}, p-value={p_val_2:.4e} -> {'DRIFT TERDETEKSI' if p_val_2 < 0.05 else 'STABIL'}")
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 19: Semi-Supervised Learning
  // =========================================================================
  {
    id: "ml-bab-19",
    slug: "bab-19-semi-supervised-learning",
    title: "BAB 19: Semi-Supervised Learning",
    orderIndex: 19,
    description: "Memanfaatkan data tak berlabel dalam jumlah besar bersama sedikit data berlabel: Algoritma LabelPropagation, LabelSpreading, dan SelfTrainingClassifier.",
    subsections: [
      {
        id: "ml-bab-19-1",
        slug: "label-propagation-dan-self-training",
        title: "19.1. Label Propagation, Label Spreading, & Self-Training",
        orderIndex: 1,
        description: "Penyebaran label berbasis graf ketetanggaan, fungsi harmonik, dan pseudo-labeling menggunakan SelfTrainingClassifier.",
        content_markdown: `# 19.1. Label Propagation, Label Spreading, & Self-Training

Dalam banyak domain industri nyata (seperti analisis citra medis atau deteksi penipuan), mendapatkan data berlabel (*ground-truth*) sangat mahal karena membutuhkan verifikasi manual oleh ahli (*expert annotator*), sedangkan data tanpa label (*unlabeled data*) sangat melimpah.

---

## 19.1.1. Konsep Inti Pembelajaran Semi-Supervised
Scikit-Learn merepresentasikan data tanpa label menggunakan nilai target **\`-1\`**.
1. **\`LabelPropagation\`**: Membangun graf ketetanggaan lengkap di mana bobot sisi merepresentasikan kedekatan sampel (kernel RBF atau KNN). Probabilitas label disebarkan secara iteratif melalui graf:
   $$Y^{(t+1)} = T Y^{(t)}$$
   Di mana $T$ adalah matriks transisi probabilitas stokastik baris.
2. **\`LabelSpreading\`**: Menggunakan regularisasi fungsi harmonik dan normalisasi Laplacian graf yang lebih tahan terhadap derau label awal.
3. **\`SelfTrainingClassifier\`**: Membungkus estimator terkalibrasi. Pada setiap iterasi, model memprediksi data tak berlabel dan menambahkan prediksi yang memiliki kepercayaan probabilitas di atas ambang batas (\`threshold=0.85\`) ke dalam set data latih (*pseudo-labeling*).

---

## 19.1.2. Implementasi Lengkap Python

\`\`\`python
import numpy as np
from sklearn.datasets import load_iris
from sklearn.semi_supervised import LabelSpreading, SelfTrainingClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

# 1. Load dataset
X, y_true = load_iris(return_X_y=True)

# 2. Simulasikan skenario 80% data TIDAK berlabel (label = -1)
rng = np.random.RandomState(42)
random_unlabeled_points = rng.rand(len(y_true)) < 0.80
y_semi = np.copy(y_true)
y_semi[random_unlabeled_points] = -1

n_labeled = np.sum(y_semi != -1)
print(f"Total Sampel: {len(y_true)} | Hanya {n_labeled} sampel berlabel ({n_labeled/len(y_true):.1%})")

# 3. Label Spreading
ls = LabelSpreading(kernel='rbf', alpha=0.8, max_iter=30)
ls.fit(X, y_semi)
acc_ls = accuracy_score(y_true, ls.predict(X))

# 4. Self-Training Classifier dengan Base SVC
base_svc = SVC(probability=True, kernel='rbf', random_state=42)
self_training = SelfTrainingClassifier(base_estimator=base_svc, threshold=0.80)
self_training.fit(X, y_semi)
acc_st = accuracy_score(y_true, self_training.predict(X))

print("=" * 60)
print("HASIL PEMBELAJARAN SEMI-SUPERVISED")
print("=" * 60)
print(f"Akurasi Label Spreading        : {acc_ls:.2%}")
print(f"Akurasi Self-Training (SVM)    : {acc_st:.2%}")
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 20: Hyperparameter Optimization Lanjutan & AutoML
  // =========================================================================
  {
    id: "ml-bab-20",
    slug: "bab-20-automl-bayesian-optimization",
    title: "BAB 20: Hyperparameter Optimization Lanjutan & AutoML",
    orderIndex: 20,
    description: "Penyetelan efisien berbasis model probabilistik Bayesian (Gaussian Process surrogate), fungsi akuisisi Expected Improvement, dan konsep Automated Machine Learning (AutoML).",
    subsections: [
      {
        id: "ml-bab-20-1",
        slug: "bayesian-optimization-automl-concepts",
        title: "20.1. Bayesian Optimization & Konsep Dasar AutoML",
        orderIndex: 1,
        description: "Surrogate model Gaussian Process, fungsi akuisisi eksplorasi vs eksploitasi (Expected Improvement), dan perbandingannya dengan Random Search.",
        content_markdown: `# 20.1. Bayesian Optimization & Konsep Dasar AutoML

Ketika evaluasi model membutuhkan waktu berjam-jam (misal pada dataset besar atau model ansambel rumit), pengujian acak (*Random Search*) atau kisi penuh (*Grid Search*) membuang terlalu banyak waktu untuk menguji konfigurasi yang buruk.

---

## 20.1.1. Prinsip Bayesian Optimization
Bayesian Optimization memperlakukan penyetelan hiperparameter sebagai optimasi fungsi kotak-hitam (*black-box function*) yang mahal:
1. **Surrogate Model (Model Pengganti)**: Memodelkan distribusi probabilitas performa fungsi menggunakan **Gaussian Process (GP)**:
   $$f(x) \\sim \\mathcal{GP}\\big(m(x), k(x, x')\\big)$$
2. **Acquisition Function (Fungsi Akuisisi)**: Menyeimbangkan antara **eksplorasi** (menguji area dengan ketidakpastian tinggi) dan **eksploitasi** (menguji area yang diprediksi menghasilkan skor tinggi), seperti *Expected Improvement (EI)*:
   $$\\text{EI}(x) = \\mathbb{E}\\big[\\max(0, f(x) - f(x^+))\\big]$$

---

## 20.1.2. Implementasi Lengkap Python

\`\`\`python
import numpy as np
from sklearn.model_selection import RandomizedSearchCV
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.datasets import load_breast_cancer
from scipy.stats import uniform, randint

# 1. Dataset
X, y = load_breast_cancer(return_X_y=True)

# 2. Distribusi Probabilitas Kontinu & Diskrit
param_distributions = {
    'learning_rate': uniform(0.01, 0.25),
    'max_leaf_nodes': randint(15, 64),
    'min_samples_leaf': randint(5, 40),
    'l2_regularization': uniform(0.0, 2.0)
}

# 3. RandomizedSearchCV yang Diarahkan
random_search = RandomizedSearchCV(
    estimator=HistGradientBoostingClassifier(random_state=42),
    param_distributions=param_distributions,
    n_iter=20,
    scoring='roc_auc',
    cv=3,
    random_state=42,
    n_jobs=-1
)
random_search.fit(X, y)

print("=" * 60)
print("HASIL OPTIMASI HIPERPARAMETER ACAK TERARAH")
print("=" * 60)
print(f"Skor ROC-AUC Terbaik : {random_search.best_score_:.4f}")
print("Konfigurasi Parameter Terbaik:\n", random_search.best_params_)
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 21: Etika, Fairness, & Responsible AI
  // =========================================================================
  {
    id: "ml-bab-21",
    slug: "bab-21-etika-fairness-responsible-ai",
    title: "BAB 21: Etika, Fairness, & Responsible AI",
    orderIndex: 21,
    description: "Keadilan algoritmik (Disparate Impact, Aturan 80%), Demographic Parity, Equalized Odds, mitigasi bias demografis, dan kepatuhan regulasi AI.",
    subsections: [
      {
        id: "ml-bab-21-1",
        slug: "metrik-fairness-dan-mitigasi-bias",
        title: "21.1. Metrik Keadilan Algoritmik (Fairness) & Mitigasi Bias",
        orderIndex: 1,
        description: "Mengukur Disparate Impact (rasio 80%), Demographic Parity, Equal Opportunity, dan teknik mitigasi pre/in/post-processing.",
        content_markdown: `# 21.1. Metrik Keadilan Algoritmik (Fairness) & Mitigasi Bias

Model machine learning yang dilatih pada data historis dapat mereplikasi atau bahkan memperparah bias diskriminatif terhadap kelompok rentan atau minoritas (berdasarkan gender, ras, usia, atau wilayah).

---

## 21.1.1. Metrik Keadilan Formal
Misalkan $A \\in \\{0, 1\\}$ adalah atribut sensitif (misal $A=0$: kelompok minoritas, $A=1$: kelompok mayoritas), dan $\\hat{Y} \\in \\{0, 1\\}$ adalah keputusan model (misal $1$: disetujui pinjaman):

1. **Demographic Parity (Paritas Demografis)**:
   Probabilitas penerimaan harus independen dari atribut sensitif:
   $$P(\\hat{Y} = 1 \\mid A = 0) = P(\\hat{Y} = 1 \\mid A = 1)$$
2. **Disparate Impact (Aturan 80% / Four-Fifths Rule)**:
   Rasio tingkat penerimaan kelompok minoritas terhadap kelompok mayoritas minimal harus $80\\%$ ($0.80$):
   $$\\text{Disparate Impact} = \\frac{P(\\hat{Y} = 1 \\mid A = 0)}{P(\\hat{Y} = 1 \\mid A = 1)} \\ge 0.80$$
3. **Equal Opportunity (Kesetaraan Peluang)**:
   Tingkat True Positive Rate ($TPR$) harus identik antar kelompok yang memenuhi kualifikasi ($Y=1$):
   $$P(\\hat{Y} = 1 \\mid Y = 1, A = 0) = P(\\hat{Y} = 1 \\mid Y = 1, A = 1)$$

---

## 21.1.2. Implementasi Lengkap Python

\`\`\`python
import numpy as np

# Simulasi data keputusan persetujuan kredit pinjaman
np.random.seed(42)
n_samples = 1000

# Atribut sensitif: 0 = Kelompok Minoritas, 1 = Kelompok Mayoritas
protected_attribute = np.random.binomial(1, 0.7, size=n_samples)

# Keputusan model (1: Pinjaman Disetujui, 0: Ditolak)
# Mensimulasikan model yang memiliki bias diskriminatif
model_predictions = np.zeros(n_samples)
for i in range(n_samples):
    if protected_attribute[i] == 1:
        model_predictions[i] = np.random.binomial(1, 0.65) # 65% diterima untuk mayoritas
    else:
        model_predictions[i] = np.random.binomial(1, 0.40) # Hanya 40% diterima untuk minoritas

# 1. Menghitung Acceptance Rate per Kelompok
rate_minority = np.mean(model_predictions[protected_attribute == 0])
rate_majority = np.mean(model_predictions[protected_attribute == 1])

# 2. Menghitung Disparate Impact
disparate_impact = rate_minority / rate_majority

print("=" * 60)
print("AUDIT KEADILAN ALGORITMIK (FAIRNESS AUDIT)")
print("=" * 60)
print(f"Tingkat Persetujuan Kelompok Mayoritas : {rate_majority:.2%}")
print(f"Tingkat Persetujuan Kelompok Minoritas : {rate_minority:.2%}")
print(f"Rasio Disparate Impact                 : {disparate_impact:.4f}")

if disparate_impact < 0.80:
    print("STATUS: PERINGATAN! Model melanggar aturan 80% (Terindikasi Disparate Impact).")
else:
    print("STATUS: AMAN. Model memenuhi standar keadilan minimum 80%.")
\`\`\`
`
      }
    ]
  },

  // =========================================================================
  // BAB 22: Proyek Capstone: End-to-End Enterprise ML Pipeline
  // =========================================================================
  {
    id: "ml-bab-22",
    slug: "bab-22-proyek-capstone-telco-churn",
    title: "BAB 22: Proyek Capstone: End-to-End Enterprise ML Pipeline",
    orderIndex: 22,
    description: "Proyek komprehensif dari hulu ke hilir: Prediksi Telco Customer Churn, EDA, penanganan data tidak seimbang, ColumnTransformer terintegrasi, benchmark 4 algoritma, evaluasi PR-AUC, dan skrip ekspor inferensi produksi.",
    subsections: [
      {
        id: "ml-bab-22-1",
        slug: "telco-churn-capstone-pipeline",
        title: "22.1. End-to-End Enterprise Pipeline: Prediksi Telco Customer Churn",
        orderIndex: 1,
        description: "Membangun sistem pembelajaran mesin industri lengkap dari pembersihan data mentah hingga pengujian inferensi real-time.",
        content_markdown: `# 22.1. End-to-End Enterprise Pipeline: Prediksi Telco Customer Churn

Pada proyek capstone akhir ini, kita merangkai seluruh pengetahuan kurikulum menjadi sebuah **arsitektur machine learning produksi kelas enterprise** untuk memprediksi pelanggan telekomunikasi yang berisiko berhenti berlangganan (*Customer Churn*).

---

## 22.1.1. Alur Kerja Arsitektur Enterprise
1. **Pembersihan & Imputasi**: Menangani nilai kosong pada fitur numerik dan kategorikal.
2. **Transformasi Kolom Atomik**: Penskalaan fitur numerik dan One-Hot Encoding fitur kategori dalam \`ColumnTransformer\`.
3. **Pelatihan & Penyetelan Model**: Menggunakan \`HistGradientBoostingClassifier\` dengan penalti regularisasi.
4. **Evaluasi Matriks Bisnis**: Menghitung skor ROC-AUC, PR-AUC, dan F1-score terkalibrasi.
5. **Ekspor Model Produksi**: Menyimpan seluruh pipeline ke dalam artefak terkompresi \`joblib\`.

---

## 22.1.2. Implementasi Lengkap Python

\`\`\`python
import numpy as np
import pandas as pd
import joblib
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, average_precision_score

print("=" * 60)
print("PROYEK CAPSTONE: TELCO CUSTOMER CHURN ENTERPRISE")
print("=" * 60)

# 1. Generate Dataset Sintetis Telco Enterprise Realistis (2.000 Pelanggan)
np.random.seed(42)
n_users = 2000

df_telco = pd.DataFrame({
    'masa_berlangganan_bulan': np.random.randint(1, 72, size=n_users),
    'tagihan_bulanan': np.random.uniform(20.0, 120.0, size=n_users),
    'total_tagihan': np.random.uniform(50.0, 8000.0, size=n_users),
    'jenis_kontrak': np.random.choice(['Bulan_ke_Bulan', 'Satu_Tahun', 'Dua_Tahun'], size=n_users, p=[0.5, 0.3, 0.2]),
    'metode_pembayaran': np.random.choice(['Transfer_Bank', 'Kartu_Kredit', 'E_Wallet'], size=n_users),
    'layanan_internet': np.random.choice(['Fiber_Optic', 'DSL', 'Tidak_Ada'], size=n_users),
    'dukungan_teknis': np.random.choice(['Ya', 'Tidak'], size=n_users, p=[0.3, 0.7])
})

# Tambahkan nilai hilang acak (Missing Values)
df_telco.loc[np.random.choice(n_users, 30), 'total_tagihan'] = np.nan

# Buat Label Target Churn (1 = Churn, 0 = Bertahan)
churn_prob = (
    (df_telco['jenis_kontrak'] == 'Bulan_ke_Bulan') * 0.35 +
    (df_telco['tagihan_bulanan'] > 80.0) * 0.25 -
    (df_telco['masa_berlangganan_bulan'] > 24) * 0.30 +
    (df_telco['dukungan_teknis'] == 'Tidak') * 0.15
)
churn_prob = np.clip(churn_prob, 0.05, 0.90)
df_telco['churn'] = np.random.binomial(1, churn_prob)

X = df_telco.drop(columns=['churn'])
y = df_telco['churn']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)

# 2. Definisikan Pipeline Preprocessing
numeric_features = ['masa_berlangganan_bulan', 'tagihan_bulanan', 'total_tagihan']
categorical_features = ['jenis_kontrak', 'metode_pembayaran', 'layanan_internet', 'dukungan_teknis']

numeric_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('ohe', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

preprocessor = ColumnTransformer([
    ('num', numeric_transformer, numeric_features),
    ('cat', categorical_transformer, categorical_features)
])

# 3. Pipeline Akhir Lengkap
production_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', HistGradientBoostingClassifier(
        max_iter=150,
        learning_rate=0.08,
        max_leaf_nodes=31,
        l2_regularization=0.5,
        random_state=42
    ))
])

# 4. Pelatihan Model
production_pipeline.fit(X_train, y_train)

# 5. Evaluasi Kinerja
y_pred = production_pipeline.predict(X_test)
y_prob = production_pipeline.predict_proba(X_test)[:, 1]

print(f"ROC-AUC Score         : {roc_auc_score(y_test, y_prob):.4f}")
print(f"PR-AUC Score          : {average_precision_score(y_test, y_prob):.4f}")
print("\nLaporan Klasifikasi Komprehensif:\n", classification_report(y_test, y_pred, digits=4))

# 6. Uji Inferensi Sampel Pelanggan Baru
new_customer = pd.DataFrame([{
    'masa_berlangganan_bulan': 3,
    'tagihan_bulanan': 105.50,
    'total_tagihan': 316.50,
    'jenis_kontrak': 'Bulan_ke_Bulan',
    'metode_pembayaran': 'E_Wallet',
    'layanan_internet': 'Fiber_Optic',
    'dukungan_teknis': 'Tidak'
}])

risk_pred = production_pipeline.predict(new_customer)[0]
risk_prob = production_pipeline.predict_proba(new_customer)[0][1]

print("=" * 60)
print("INFERENSI PELANGGAN BARU")
print("=" * 60)
print(f"Status Prediksi : {'BERISIKO CHURN TINGGI' if risk_pred == 1 else 'SETIA'}")
print(f"Probabilitas Risiko Churn: {risk_prob:.2%}")
print("\nProyek Capstone Machine Learning Berhasil Diselesaikan dan Siap Digunakan.")
\`\`\`
`
      }
    ]
  }
];
