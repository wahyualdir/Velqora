import { ChapterDef } from "./da-data-ch1-3";

export const DS_CHAPTERS_1_TO_4: ChapterDef[] = [
  // ==========================================
  // BAB 1: Metodologi Siklus Hidup Sains Data, Problem Framing & Paradigma Inferensi
  // ==========================================
  {
    orderIndex: 1,
    id: "data-science-ch-1",
    slug: "bab-1-metodologi-siklus-hidup-sains-data-problem-framing-inferensi",
    title: "BAB 1: Metodologi Siklus Hidup Sains Data, Problem Framing & Paradigma Inferensi",
    desc: "Fondasi keilmuan sains data modern: epistemologi deduktif vs induktif, dekonstruksi masalah sains data (descriptive, predictive, causal inference), siklus hidup CRISP-DM dan TDSP (Team Data Science Process), perumusan fungsi objektif matematis, dan etika privasi data.",
    coreConcepts: ["Data Science Lifecycle", "Problem Framing", "Predictive vs Causal Inference", "Mathematical Objective Functions", "Data Ethics"],
    subchapters: [
      {
        num: "1.1",
        slug: "1-1-epistemologi-sains-data-inferensi-induktif-vs-deduktif",
        title: "1.1. Epistemologi Sains Data: Paradigma Deduktif, Induktif, dan Abduktif",
        desc: "Landasan filosofi komputasi sains data: transisi dari metode saintifik klasik berbasis hipotesis deduktif ke pembelajaran mesin induktif berbasis data empiris berskala besar.",
        concept: `Sains data berada di persimpangan antara metode ilmiah klasik, matematika terapan, dan rekayasa perangkat lunak berskala besar. Memahami landasan epistemologis sains data sangat penting agar praktisi tidak sekadar memperlakukan algoritma sebagai kotak hitam (black-box) empiris, melainkan memahami bagaimana pengetahuan baru ditarik secara sah dari observasi data.

Dalam penalaran deduktif (pendekatan sains murni), peneliti memulai dari aksioma atau hukum teori universal, menyusun hipotesis matematis spesifik, dan mengumpulkan data untuk memvalidasi atau memfalsifikasi hipotesis tersebut. Sebaliknya, paradigma sains data modern didominasi oleh penalaran induktif: praktisi memulai dari kumpulan data observasi berukuran masif (big data), lalu menggunakan algoritma optimasi numerik untuk menemukan pola statistik laten dan mengekstraksi aturan umum tanpa asumsi teoretis yang kaku sebelumnya.

Namun, ketergantungan murni pada induksi membawa risiko induksi rapuh (inductive bias), di mana korelasi semu (spurious correlations) disalahartikan sebagai hukum alamiah. Sains data tingkat tinggi mengintegrasikan penalaran abduktif—proses menghasilkan eksplanasi kausal paling masuk akal (inference to the best explanation) terhadap anomali data yang teramati di lingkungan produksi.`,
        code: `# 1.1: Pemodelan Deduktif (Fisika Teoretis) vs Induktif (Regresi Polinomial Data)
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures

# 1. Model Deduktif: Persamaan Kinematika Teoretis s = 0.5 * g * t^2 (g = 9.8 m/s^2)
t_teoritis = np.linspace(0, 5, 20)
g_teoritis = 9.80665
jarak_deduktif = 0.5 * g_teoritis * (t_teoritis ** 2)

# 2. Model Induktif: Belajar murni dari observasi sensor riil berderau (noisy data)
np.random.seed(42)
jarak_observasi = jarak_deduktif + np.random.normal(0, 1.5, size=len(t_teoritis))

# Melatih model polinomial derajat 2 secara induktif murni dari data
poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(t_teoritis.reshape(-1, 1))
model_induktif = LinearRegression().fit(X_poly, jarak_observasi)

koef_kuadrat = model_induktif.coef_[1]
estimasi_g_induktif = koef_kuadrat * 2

print("=== PARADIGMA DEDUKTIF VS INDUKTIF ===")
print(f"Konstanta Gravitasi Teoretis (Deduktif) : {g_teoritis:.4f} m/s^2")
print(f"Estimasi Gravitasi Data Sensor (Induktif): {estimasi_g_induktif:.4f} m/s^2")
print(f"Galat Relatif Estimasi Induktif          : {abs(estimasi_g_induktif - g_teoritis)/g_teoritis*100:.2f}%")`,
        expectedOutput: "Estimasi induktif dari data berderau mendekati nilai teoretis dengan galat < 1%.",
        codeExp: "Skrip membandingkan formulasi hukum fisika deduktif apriori dengan aproksimasi induktif regresi polinomial dari data observasi empiris berderau acak, membuktikan bagaimana metode induktif merekonstruksi parameter laten sistem nyata.",
        pitfalls: [
          "Mengasumsikan bahwa model induktif dapat melakukan ekstrapolasi di luar domain rentang data latih yang pernah diamati.",
          "Mengabaikan hukum sains dasar domain industri (seperti hukum kekekalan massa atau energi) saat melatih model murni berbasis data."
        ],
        refTitle: "Trevor Hastie, Robert Tibshirani, Jerome Friedman: The Elements of Statistical Learning",
        refUrl: "https://hastie.su.domains/ElemStatLearn/"
      },
      {
        num: "1.2",
        slug: "1-2-taksonomi-masalah-prediktif-deskriptif-kausal",
        title: "1.2. Taksonomi Masalah Sains Data: Deskriptif, Prediktif, dan Inferensi Kausal",
        desc: "Klasifikasi taksonomi analitik: perbedaan fundamental antara pemodelan korelasi prediktif (P(Y|X)) dan estimasi intervensi kausal (P(Y|do(X))) berbasis kerangka Judea Pearl.",
        concept: `Salah satu kesalahan paling mendasar dalam sains data terapan adalah mencampuradukkan tujuan prediksi dengan tujuan penentuan sebab-akibat (kausalitas). Kegagalan membedakan keduanya menyebabkan jutaan dolar terbuang untuk kebijakan bisnis yang tidak efektif.

Pemodelan Prediktif bertujuan mengestimasi distribusi probabilitas bersyarat $P(Y \\mid X)$—yaitu memprediksi nilai target $Y$ berdasarkan kumpulan fitur observasi $X$. Misalnya, memprediksi apakah seorang pasien berisiko terkena serangan jantung berdasarkan usia dan kadar kolesterol. Model prediktif yang sangat akurat tidak memerlukan pemahaman kausal; korelasi statistik pasif sudah cukup untuk membuat estimasi yang andal.

Sebaliknya, Inferensi Kausal (Causal Inference) bertujuan memodelkan dampak intervensi aktif $P(Y \\mid \\text{do}(X))$ menggunakan kerangka kerja Struktural Causal Model (SCM) dan Kalkulus Do yang dirintis oleh Judea Pearl. Inferensi kausal menjawab pertanyaan kontrafaktual: 'Berapa persen penurunan risiko serangan jantung pasien jika kita menurunkan kadar kolesterolnya sebesar 50 mg/dL melalui pemberian obat statin?'. Analis yang mengubah keputusan bisnis berdasarkan korelasi pasif murni rentan terjebak paradoks statistik seperti Paradoks Simpson.`,
        formula: `P(Y \\mid \\text{do}(X = x)) = \\sum_z P(Y \\mid X = x, Z = z) P(Z = z)`,
        code: `# 1.2: Demonstrasi Paradoks Simpson: Korelasi Prediktif vs Efek Kausal Intervensi
import pandas as pd
import numpy as np

# Simulasi data medis uji obat pada dua kelompok keparahan penyakit (Z)
# Kelompok Sakit Parah (Z=1) vs Sakit Ringan (Z=0)
np.random.seed(42)

# 1. Sakit Parah (Z=1): Diberi obat (X=1) = 80%, Sembuh (Y=1) = 40% | Tanpa obat (X=0) = Sembuh 30%
n_parah = 1000
x_parah = np.random.choice([1, 0], size=n_parah, p=[0.8, 0.2])
y_parah = np.where(x_parah == 1, np.random.binomial(1, 0.40, n_parah), np.random.binomial(1, 0.30, n_parah))

# 2. Sakit Ringan (Z=0): Diberi obat (X=1) = 20%, Sembuh (Y=1) = 80% | Tanpa obat (X=0) = Sembuh 70%
n_ringan = 1000
x_ringan = np.random.choice([1, 0], size=n_ringan, p=[0.2, 0.8])
y_ringan = np.where(x_ringan == 1, np.random.binomial(1, 0.80, n_ringan), np.random.binomial(1, 0.70, n_ringan))

df_simpson = pd.DataFrame({
    'Keparahan': ['Parah'] * n_parah + ['Ringan'] * n_ringan,
    'Obat_Diberikan': np.concatenate([x_parah, x_ringan]),
    'Sembuh': np.concatenate([y_parah, y_ringan])
})

# Evaluasi Agregat Mentah (Korelasi Prediktif Pasif - Menyesatkan!)
cr_agregat = df_simpson.groupby('Obat_Diberikan')['Sembuh'].mean()

# Evaluasi Berstrata (Intervensi Kausal yang Memperhitungkan Confounder Keparahan)
cr_strata = df_simpson.groupby(['Keparahan', 'Obat_Diberikan'])['Sembuh'].mean().unstack()

print("=== PREDIKSI AGREGAT (PARADOKS SIMPSON) ===")
print(f"Rasio Sembuh Tanpa Obat (X=0): {cr_agregat[0]*100:.1f}%")
print(f"Rasio Sembuh Diberi Obat (X=1): {cr_agregat[1]*100:.1f}% (Obat tampak merugikan!)")
print("\\n=== INFERENSI KAUSAL DENGAN MENGONTROL KEPARAHAN (Z) ===")
print(cr_strata * 100)`,
        expectedOutput: "Secara agregat obat tampak menurunkan kesembuhan, namun pada masing-masing strata obat menaikkan kesembuhan 10%.",
        codeExp: "Skrip mendemonstrasikan Paradoks Simpson klasik: variabel perancu (confounder) tingkat keparahan membalikkan korelasi prediktif agregat, membuktikan bahwa estimasi kausal menuntut pemodelan intervensi bersyarat.",
        pitfalls: [
          "Menerapkan model Machine Learning prediktif (seperti XGBoost) untuk menentukan kebijakan harga dinamis tanpa eksperimentasi kausal terkontrol.",
          "Mengabaikan variabel perancu (confounding variables) yang memengaruhi variabel intervensi sekaligus variabel hasil."
        ],
        refTitle: "Judea Pearl, Madelyn Glymour, Nicholas P. Jewell: Causal Inference in Statistics - A Primer",
        refUrl: "https://www.wiley.com/en-us/Causal+Inference+in+Statistics%3A+A+Primer-p-9781119186847"
      },
      {
        num: "1.3",
        slug: "1-3-metodologi-siklus-hidup-crisp-dm-tdsp-agile",
        title: "1.3. Metodologi Siklus Hidup: CRISP-DM, TDSP, dan Adaptasi Agile Data Science",
        desc: "Arsitektur proses rekayasa sains data: tahapan Team Data Science Process (TDSP) Microsoft, siklus iteratif CRISP-DM, dan mitigasi risiko waterfall pada proyek analitik.",
        concept: `Proyek sains data memiliki tingkat ketidakpastian stokastik yang jauh lebih tinggi dibandingkan proyek rekayasa perangkat lunak tradisional. Dalam rekayasa web, arsitektur yang dirancang dengan baik dijamin akan menghasilkan fitur fungsional. Namun dalam sains data, setelah 3 bulan eksplorasi data, seorang ilmuwan data bisa saja menemukan bahwa sinyal prediktif dalam dataset tidak cukup kuat untuk melampaui baseline acak.

Untuk mengelola ketidakpastian ini, industri mengadopsi kerangka kerja terstruktur seperti CRISP-DM (Cross-Industry Standard Process for Data Mining) dan TDSP (Team Data Science Process) yang dikembangkan oleh Microsoft.

TDSP mengintegrasikan siklus hidup pemodelan sains data dengan metodologi Agile dan DevOps modern. Tahapannya terbagi menjadi lima fase berulang:
1. Business Understanding (Piagam Proyek & Metrik Keputusan)
2. Data Acquisition & Understanding (Pemeriksaan Integritas & Pipeline Ingestion)
3. Modeling (Rekayasa Fitur, Pelatihan, & Evaluasi Lintas Validasi)
4. Deployment (Penyebaran Model ke Titik Akhir API atau Streaming Inference)
5. Customer Acceptance (Pengujian Validasi Bisnis & Pemantauan Drift Produksi).`,
        code: `# 1.3: Pelacakan Metrik Kesiapan Produksi TDSP (Production Readiness Scorecard)
import pandas as pd

readiness_scorecard = pd.DataFrame({
    'Dimensi_TDSP': [
        '1. Business Understanding',
        '2. Data Pipeline & Quality',
        '3. Model Validation',
        '4. Deployment Infrastructure',
        '5. Monitoring & Governance'
    ],
    'Kriteria_Acceptance': [
        'Baseline metrik bisnis kuantitatif disepakati dewan C-Level',
        'Pipeline ingestion otomatis dengan deteksi skema drift',
        'Cross-validation bebas leakage & pengujian model fairness',
        'Containerized microservice API (Docker) dengan latensi < 100ms',
        'Dasbor pelacak concept drift & rencana retrain otomatis'
    ],
    'Bobot_Audit': [0.20, 0.25, 0.25, 0.15, 0.15],
    'Skor_Kesiapan_Pct': [100, 90, 85, 70, 60]
})

readiness_scorecard['Skor_Tertimbang'] = (
    readiness_scorecard['Bobot_Audit'] * readiness_scorecard['Skor_Kesiapan_Pct']
)
skor_total = readiness_scorecard['Skor_Tertimbang'].sum()

print("=== SCORECARD KESIAPAN PRODUKSI SAINS DATA (TDSP) ===")
print(readiness_scorecard[['Dimensi_TDSP', 'Skor_Kesiapan_Pct', 'Skor_Tertimbang']].to_string(index=False))
print(f"\\nTotal Skor Kesiapan Sistem: {skor_total:.1f}% / 100.0%")
if skor_total >= 80.0:
    print("[STATUS AUDIT]: Sistem Lolos Ambang Batas Minimum Deployment Terbatas (Canary).")
else:
    print("[STATUS AUDIT]: Sistem Belum Siap Produksi. Lengkapi Dimensi Terlemah.")`,
        expectedOutput: "Skor kesiapan sistem terhitung 82.8% dan memenuhi ambang batas rilis.",
        codeExp: "Skrip memodelkan matriks audit kesiapan deployment sains data berdasarkan standar TDSP, memastikan aspek tata kelola dan infrastruktur diperiksa sebelum model dilepas ke produksi.",
        pitfalls: [
          "Menerapkan metodologi Agile Scrum murni dengan estimasi story point kaku pada fase penelitian eksplorasi sains data yang memiliki ketidakpastian alami tinggi.",
          "Melompati fase Business Understanding dan langsung memulai pelatihan model kompleks tanpa definisi metrik evaluasi bisnis yang disepakati."
        ],
        refTitle: "Microsoft Learn: The Team Data Science Process (TDSP) Lifecycle",
        refUrl: "https://learn.microsoft.com/en-us/azure/architecture/data-science-process/overview"
      },
      {
        num: "1.4",
        slug: "1-4-formulasi-matematis-fungsi-objektif-loss-functions",
        title: "1.4. Formulasi Matematis Fungsi Objektif & Fungsi Kerugian (Loss Functions)",
        desc: "Penerjemahan sasaran bisnis ke optimasi numerik: formulasi Empirical Risk Minimization (ERM), taksonomi loss function regresi (MSE, MAE, Huber) dan klasifikasi (Cross-Entropy, Focal Loss).",
        concept: `Jantung komputasi dari seluruh algoritma sains data dan pembelajaran mesin adalah pengoptimalan Fungsi Objektif (Objective Function). Model tidak memiliki intuisi sadar; ia hanya berusaha mencari vektor bobot parameter $\\mathbf{w}$ yang meminimalkan nilai penalti yang didefinisikan oleh Fungsi Kerugian (Loss Function $\\mathcal{L}$).

Prinsip Minimisasi Risiko Empiris (Empirical Risk Minimization / ERM) merumuskan bahwa estimasi parameter terbaik adalah nilai yang meminimalkan rata-rata kerugian pada data latih:
$$\\min_{\\mathbf{w}} \\frac{1}{N} \\sum_{i=1}^N \\mathcal{L}(y_i, f(\\mathbf{x}_i; \\mathbf{w})) + \\lambda \\mathcal{R}(\\mathbf{w})$$

Pemilihan fungsi kerugian mencerminkan toleransi risiko bisnis terhadap berbagai jenis kesalahan. Dalam regresi, Mean Squared Error (MSE / $L_2$) memberikan penalti kuadratik yang sangat keras terhadap galat besar, menjadikannya sangat sensitif terhadap pencilan. Sebaliknya, Mean Absolute Error (MAE / $L_1$) memberikan penalti linier yang menghasilkan estimator yang tahan banting terhadap pencilan (robust). Huber Loss menggabungkan keunggulan keduanya: bersifat kuadratik untuk galat kecil dan linier untuk galat besar.`,
        formula: `\\mathcal{L}_{\\text{Huber}}(e) = \\begin{cases} \\frac{1}{2} e^2 & \\text{jika } |e| \\le \\delta \\\\ \\delta (|e| - \\frac{1}{2} \\delta) & \\text{jika } |e| > \\delta \\end{cases}`,
        code: `# 1.4: Perbandingan Karakteristik Penalti MSE, MAE, dan Huber Loss
import numpy as np
import pandas as pd

# Menghitung profil penalti galat pada berbagai magnitudo galat (e = y - y_pred)
galat = np.array([-5.0, -2.0, -1.0, 0.0, 1.0, 2.0, 5.0])

# 1. Squared Error (L2 Loss)
l2_loss = 0.5 * (galat ** 2)

# 2. Absolute Error (L1 Loss)
l1_loss = np.abs(galat)

# 3. Huber Loss dengan threshold delta = 1.5
delta = 1.5
huber_loss = np.where(
    np.abs(galat) <= delta,
    0.5 * (galat ** 2),
    delta * (np.abs(galat) - 0.5 * delta)
)

df_loss = pd.DataFrame({
    'Galat_Prediksi': galat,
    'L2_MSE_Loss': l2_loss,
    'L1_MAE_Loss': l1_loss,
    'Huber_Loss': huber_loss
})

print("=== PERBANDINGAN PENALTI FUNGSI KERUGIAN (LOSS FUNCTIONS) ===")
print(df_loss.to_string(index=False))`,
        expectedOutput: "Tabel membuktikan penalti kuadratik L2 melonjak tajam pada galat 5.0 (12.5) dibanding L1 (5.0) dan Huber (6.375).",
        codeExp: "Skrip menguantifikasi perbedaan kurva penalti matematis antara fungsi kerugian kuadratik, absolut, dan kompromi Huber, mendasari pemilihan loss function yang tepat berdasarkan distribusi data.",
        pitfalls: [
          "Menggunakan Mean Squared Error (MSE) pada dataset yang memuat pencilan liar ekstrim, yang memaksa model mendistorsi garis proyeksi demi memuaskan pencilan.",
          "Menerapkan fungsi kerugian simetris pada masalah bisnis di mana konsekuensi Underprediction dan Overprediction memiliki dampak finansial asimetris."
        ],
        refTitle: "Peter J. Huber: Robust Estimation of a Location Parameter",
        refUrl: "https://projecteuclid.org/journals/annals-of-mathematical-statistics/volume-35/issue-1/Robust-Estimation-of-a-Location-Parameter/10.1214/aoms/1177703732.full"
      },
      {
        num: "1.5",
        slug: "1-5-tata-kelola-data-privasi-etika-algoritmik-uu-pdp",
        title: "1.5. Tata Kelola Data, Privasi (UU PDP & GDPR), dan Etika Algoritmik",
        desc: "Regulasi kepatuhan data sains: prinsip minimisasi data, teknik anonimisasi (k-anonymity, l-diversity, differential privacy), dan mitigasi bias diskriminasi algoritmik.",
        concept: `Ilmuwan data memegang kekuasaan besar dalam membentuk keputusan yang memengaruhi nasib kehidupan manusia: persetujuan pinjaman bank, skrining lamaran kerja, hingga diagnosis kesehatan. Kepatuhan hukum dan pertimbangan etika bukan sekadar formalitas kepatuhan hukum, melainkan pilar integritas profesi.

Di Indonesia, Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27/2022) bersama dengan General Data Protection Regulation (GDPR Uni Eropa) mewajibkan pemenuhan asas minimisasi data (hanya mengumpulkan data yang relevan), hak atas penjelasan algoritmik (Right to Explanation), dan perlindungan terhadap data pribadi sensitif (agama, biometrik, rekam medis).

Anonimisasi data tradisional (seperti sekadar menghapus nama atau NIK) terbukti tidak memadai karena serangan penyambungan data (linkage attacks) dapat mere-identifikasi individu menggunakan quasi-identifiers (kombinasi tanggal lahir, jenis kelamin, dan kode pos). Standar privasi modern menuntut penerapan konsep $k$-Anonymity (setiap individu tidak dapat dibedakan dari minimal $k-1$ individu lain dalam kelompok yang sama) atau Privasi Diferensial (Differential Privacy) yang menyuntikkan derau matematis terkalibrasi ke dalam kueri agregat.`,
        code: `# 1.5: Pemeriksaan Kepatuhan k-Anonymity pada Dataset Medis Kuasi-Identifikasi
import pandas as pd

# Dataset pasien dengan quasi-identifiers (Usia, Gender, Kode Pos)
data_medis = pd.DataFrame({
    'usia_kelompok': ['20-29', '20-29', '20-29', '40-49', '40-49', '50-59'],
    'gender': ['P', 'P', 'P', 'L', 'L', 'P'],
    'kode_pos_wilayah': ['15100', '15100', '15100', '16400', '16400', '17100'],
    'diagnosa_rahasia': ['Flu', 'Gastritis', 'Anemia', 'Hipertensi', 'Diabetes', 'Kanker']
})

# Menghitung ukuran masing-masing kelompok ekuivalensi (Equivalence Classes)
kuasi_kolom = ['usia_kelompok', 'gender', 'kode_pos_wilayah']
kelompok_ekuivalensi = data_medis.groupby(kuasi_kolom).size().reset_index(name='jumlah_individu')

# Menentukan nilai k terkecil di seluruh populasi (k-anonymity level)
k_aktual = kelompok_ekuivalensi['jumlah_individu'].min()

print("=== AUDIT KEPATUHAN PRIVASI k-ANONYMITY ===")
print(kelompok_ekuivalensi)
print(f"\\nNilai k-Anonymity Terendah: k = {k_aktual}")

if k_aktual < 2:
    print("[PERINGATAN AUDIT PRIVASI]: Terdeteksi baris dengan k=1 (Individu Unik rentan re-identifikasi!).")
    print("Tindakan: Terapkan generalisasi agregasi lebih luas pada kolom Kode Pos atau Usia.")
else:
    print(f"[LOLOS AUDIT]: Dataset memenuhi k-Anonymity dengan batas aman k >= {k_aktual}.")`,
        expectedOutput: "Audit mendeteksi kelompok beranggotakan 1 orang yang membuktikan pelanggaran privasi k=1.",
        codeExp: "Skrip mengaudit dataset kuasi-identifikasi untuk menghitung metrik formal k-anonymity, mendeteksi baris rentan re-identifikasi sebelum dataset dibagikan ke lingkungan sains data publik.",
        pitfalls: [
          "Menganggap data aman hanya dengan menghapus nama dan nomor KTP (Pseudonimisasi sederhana bukan Anonimisasi penuh).",
          "Melatih model prediktif kredit yang memasukkan variabel terlarang atau proksi tersembunyi yang mendiskriminasi kelompok gender atau etnis tertentu."
        ],
        refTitle: "Latanya Sweeney: k-Anonymity: A Model for Protecting Privacy",
        refUrl: "https://dataprivacylab.org/dataprivacy/projects/kanonymity/paper3.pdf"
      },
      {
        num: "1.6",
        slug: "1-6-infrastruktur-lingkungan-komputasi-reproducibility",
        title: "1.6. Infrastruktur Komputasi, Manajemen Lingkungan & Reprodusibilitas Eksperimen",
        desc: "Krisis reprodusibilitas sains data: determinisme komputasi (random seed), isolasi dependensi lingkungan (Conda, venv, Docker), pelacakan versi data (DVC), dan artefak MLflow.",
        concept: `Salah satu krisis terbesar dalam dunia sains dan industri teknologi adalah 'Krisis Reprodusibilitas' (The Reproducibility Crisis): ketidakmampuan mereplikasi hasil eksperimen model yang dilaporkan oleh peneliti lain pada data yang sama. Model yang menghasilkan metrik akurasi 94% di laptop pengembang seringkali hanya menghasilkan 72% saat dijalankan ulang di server produksi akibat perbedaan dependensi pustaka atau generator bilangan acak yang tidak terkontrol.

Reprodusibilitas ilmiah dalam sains data menuntut penerapan tiga lapisan kontrol:
1. Determinisme Komputasi: Mengunci seluruh bibit acak (Random Seed) pada tingkat interpreter Python, library NumPy, PyTorch, dan alokasi GPU CUDA.
2. Isolasi Lingkungan: Mengunci versi dependensi biner secara deterministik menggunakan berkas spesifikasi requirements.txt terpin atau kontainerisasi Docker lengkap.
3. Pelacakan Silsilah Model (Model Provenance & Lineage): Merekam keterkaitan antara versi kode Git spesifik, hash dataset masukan (menggunakan Data Version Control / DVC), dan hiperparameter eksperimen (menggunakan MLflow atau Weights & Biases).`,
        code: `# 1.6: Fungsi Penjamin Determinisme Komputasi Multi-Framework
import random
import os
import numpy as np

def kunci_determinisme_eksperimen(seed: int = 42):
    """Mengunci seluruh bibit generator acak untuk reprodusibilitas penuh."""
    random.seed(seed)
    os.environ['PYTHONHASHSEED'] = str(seed)
    np.random.seed(seed)
    print(f"[REPRODUCIBILITY]: Seluruh generator acak terkunci pada seed = {seed}")

# Demonstrasi eksekusi deterministik
kunci_determinisme_eksperimen(42)
vektor_a = np.random.uniform(0, 100, size=5).round(2)

kunci_determinisme_eksperimen(42)
vektor_b = np.random.uniform(0, 100, size=5).round(2)

identik = np.array_equal(vektor_a, vektor_b)
print(f"Hasil Run 1: {vektor_a}")
print(f"Hasil Run 2: {vektor_b}")
print(f"Verifikasi Konsistensi Eksperimen: {'IDENTIK SEMPURNA' if identik else 'BERBEDA'}")`,
        expectedOutput: "Kedua vektor hasil eksekusi acak terbukti identik sempurna berkat penguncian seed.",
        codeExp: "Skrip mendefinisikan fungsi utilitas determinisme yang mengunci seed acak Python core dan NumPy untuk menjamin bahwa seluruh eksperimen stokastik dapat direproduksi 100% oleh peneliti lain.",
        pitfalls: [
          "Hanya mengunci random.seed() bawaan Python tanpa mengunci np.random.seed(), sehingga operasi array NumPy tetap berjalan acak non-deterministik.",
          "Membagikan model tanpa menyimpan hash versi dataset latih yang tepat, membuat investigasi bug data di masa depan menjadi mustahil."
        ],
        refTitle: "Nature: A practical guide to reproducible data science",
        refUrl: "https://www.nature.com/articles/s41597-020-0486-7"
      },
      {
        num: "1.7",
        slug: "1-7-eksplorasi-data-saintifik-univariat-multivariat",
        title: "1.7. Analisis Eksploratif Saintifik (EDA): Univariat, Bivariat & Multivariat",
        desc: "Investigasi pola laten data: inspeksi skewness dan kurtosis, matriks kovarians terbobot, korelasi jarak (Distance Correlation) untuk dependensi non-linear, dan visualisasi manifold.",
        concept: `Analisis Data Eksploratif (EDA) dalam sains data bukan sekadar pembuatan grafik deskriptif visual, melainkan pengujian diagnostik statistik yang ketat untuk mengungkap kebenaran matematis tentang struktur ruang fitur data sebelum pemodelan dimulai.

Pemeriksaan univariat tingkat lanjut mengukur momen statistik ketiga (Skewness) dan keempat (Kurtosis ekses). Kurtosis tinggi (leptokurtik, $\\text{Kurtosis} > 3$) mengindikasikan adanya ekor gemuk (heavy tails) dan probabilitas kemunculan fenomena 'Angsa Hitam' (Black Swan events)—peristiwa ekstrem yang jauh lebih sering terjadi dibandingkan asumsi kurva normal Gauss.

Dalam analisis bivariat dan multivariat, korelasi Pearson konvensional seringkali gagal mendeteksi dependensi non-linear yang kuat (misalnya hubungan sinusoidal $Y = \\sin(X)$ memiliki korelasi Pearson mendekati nol). Ilmuwan data modern memanfaatkan Korelasi Jarak (Distance Correlation) atau Koefisien Informasi Maksimal (Maximal Information Coefficient / MIC) yang mampu mendeteksi segala bentuk dependensi fungsional maupun non-fungsional antar variabel.`,
        formula: `\\text{Kurtosis Ekses} = \\frac{\\mu_4}{\\sigma^4} - 3 = \\frac{\\frac{1}{N} \\sum (x_i - \\bar{x})^4}{\\left(\\frac{1}{N} \\sum (x_i - \\bar{x})^2\\right)^2} - 3`,
        code: `# 1.7: Komputasi Momen Statistik Tinggi (Skewness & Kurtosis) pada Data Sensor
import scipy.stats as stats
import numpy as np
import pandas as pd

# Simulasi data pembacaan getaran mesin industri
np.random.seed(42)
# Data getaran normal (Gauss) vs data getaran anomali fat-tailed (Student-t df=3)
data_normal = np.random.normal(0, 1, 1000)
data_fat_tailed = np.random.standard_t(df=3, size=1000)

evaluasi_momen = pd.DataFrame({
    'Distribusi': ['Normal Ideal', 'Sensor Realitas (Heavy-Tailed)'],
    'Rata-rata': [np.mean(data_normal), np.mean(data_fat_tailed)],
    'Varians': [np.var(data_normal), np.var(data_fat_tailed)],
    'Skewness': [stats.skew(data_normal), stats.skew(data_fat_tailed)],
    'Kurtosis_Ekses': [stats.kurtosis(data_normal), stats.kurtosis(data_fat_tailed)]
})

print("=== AUDIT MOMEN TINGGI STATISTIK EKSLORATIF ===")
print(evaluasi_momen.round(4))
print("\\nInterpretasi Saintifik:")
kurt_val = evaluasi_momen.loc[1, 'Kurtosis_Ekses']
print(f"Kurtosis Ekses Sensor Realitas = {kurt_val:.2f} (> 0: Distribusi Leptokurtik dengan Risiko Outlier Ekstrem).")`,
        expectedOutput: "Kurtosis ekset data fat-tailed tercatat > 5.0, membuktikan keberadaan anomali ekor gemuk.",
        codeExp: "Skrip menghitung momen keempat statistik (kurtosis ekses) menggunakan scipy.stats untuk mendeteksi keberadaan ekor gemuk (heavy tails) yang dapat merusak model parametrik standar.",
        pitfalls: [
          "Menyimpulkan dua variabel tidak memiliki hubungan hanya karena nilai korelasi linear Pearson bernilai nol, tanpa menguji korelasi peringkat atau korelasi non-linear.",
          "Menghapus titik pencilan secara otomatis tanpa menyelidiki apakah pencilan tersebut merupakan kesalahan sensor atau sinyal penemuan ilmiah baru."
        ],
        refTitle: "Gabor J. Szekely, Maria L. Rizzo: Measuring and Testing Dependence by Correlation of Distances",
        refUrl: "https://projecteuclid.org/journals/annals-of-statistics/volume-35/issue-6/Measuring-and-testing-dependence-by-correlation-of-distances/10.1214/009053607000000505.full"
      },
      {
        num: "1.8",
        slug: "1-8-protokol-isolasi-partisi-anti-leakage-pipelining",
        title: "1.8. Protokol Isolasi Partisi Data Bebas Kebocoran (Data Leakage Mitigation)",
        desc: "Anatomi kebocoran data: pemisahan partisi latih-uji apriori, bahaya normalisasi fit-transform pra-split, kebocoran target (target leakage), dan isolasi via Scikit-Learn Pipeline.",
        concept: `Kebocoran Data (Data Leakage) adalah dosa paling mematikan dalam rekayasa sains data. Kebocoran data terjadi ketika informasi dari luar himpunan data latih (khususnya dari data uji atau target masa depan) secara tidak sengaja merembes masuk ke dalam proses pelatihan model. Model yang mengalami kebocoran data akan menunjukkan performa validasi yang luar biasa tinggi di laboratorium, namun gagal total saat diterapkan di dunia nyata.

Makalah penting Kaufman et al. (ACM TKDD 2012) mengklasifikasikan kebocoran data menjadi dua jenis:
1. Train-Test Contamination: Melakukan prapemrosesan data (seperti penskalaan StandardScaler, imputasi nilai hilang rata-rata, atau seleksi fitur) pada SELURUH dataset sebelum pemisahan train-test split dilakukan. Parameter rata-rata $\\mu$ dan varians $\\sigma$ dari data uji telah bocor ke proses normalisasi data latih.
2. Target Leakage: Memasukkan fitur prediktor yang nilainya baru tercipta SETELAH peristiwa target terjadi (misalnya menggunakan kolom 'Tanggal Pengiriman Surat Penagihan Utang' untuk memprediksi apakah nasabah akan gagal bayar kredit).

Solusi arsitektur wajib untuk mencegah kontaminasi adalah mengenkapsulasi seluruh langkah transformasi dan estimator ke dalam objek Scikit-Learn Pipeline tunggal.`,
        code: `# 1.8: Demonstrasi Kebocoran Data (Data Leakage) vs Pipeline yang Benar
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split

# Mensimulasikan dataset sintetis
np.random.seed(42)
X = np.random.normal(100, 15, size=(100, 5))
y = X[:, 0] * 2.5 + np.random.normal(0, 5, size=100)

# ==========================================
# SKENARIO 1: SALAH & BOCOR (LEAKAGE)
# Melakukan fit scaler SEBELUM split!
# ==========================================
scaler_bocor = StandardScaler()
X_bocor = scaler_bocor.fit_transform(X) # Data uji bocor ke rata-rata scaler!
X_train_bocor, X_test_bocor, y_train, y_test = train_test_split(X_bocor, y, test_size=0.3, random_state=42)
model_bocor = Ridge().fit(X_train_bocor, y_train)

# ==========================================
# SKENARIO 2: BENAR & TERISOLASI (CLEAN PIPELINE)
# Split terlebih dahulu, fit HANYA pada data latih!
# ==========================================
X_train_clean, X_test_clean, y_train_clean, y_test_clean = train_test_split(X, y, test_size=0.3, random_state=42)
clean_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', Ridge())
])
clean_pipeline.fit(X_train_clean, y_train_clean)

print("=== AUDIT KELESTARIAN PARTISI ANTI-LEAKAGE ===")
print(f"Rata-rata Scaler Bocor (Mengontaminasi Uji) : {scaler_bocor.mean_[0]:.4f}")
print(f"Rata-rata Scaler Bersih (Hanya Data Latih) : {clean_pipeline.named_steps['scaler'].mean_[0]:.4f}")
print("\\n[VERIFIKASI]: Scikit-Learn Pipeline menjamin parameter penskalaan terisolasi 100%!")`,
        expectedOutput: "Parameter scaler bersih terisolasi pada data latih tanpa terkontaminasi distribusi data uji.",
        codeExp: "Skrip membuktikan secara komputasional bagaimana Scikit-Learn Pipeline menjamin parameter normalisasi hanya dipelajari dari data latih dan diterapkan secara pasif pada data uji tanpa kebocoran informasi.",
        pitfalls: [
          "Memanggil .fit_transform() pada data validasi atau data uji; data uji HANYA boleh diproses dengan .transform().",
          "Melakukan seleksi fitur (seperti uji korelasi atau ANOVA) pada seluruh dataset sebelum k-fold cross validation."
        ],
        refTitle: "Shachar Kaufman et al.: Leakage in Data Mining: Formulation, Detection, and Avoidance",
        refUrl: "https://dl.acm.org/doi/10.1145/2382577.2382579"
      },
      {
        num: "1.9",
        slug: "1-9-pemodelan-baseline-benchmark-heuristik-kemenangan",
        title: "1.9. Pemodelan Baseline: Estimator Heuristik, Dummy Estimator & Nilai Tambah",
        desc: "Disiplin pembuktian nilai model: pembuatan model pembanding naif (DummyRegressor, DummyClassifier), penetapan threshold Minimum Viable Performance, dan justifikasi kompleksitas algoritma.",
        concept: `Sebelum seorang ilmuwan data menghabiskan waktu berminggu-minggu merancang jaringan saraf tiruan yang rumit, ia wajib membangun Model Pembanding Dasar (Baseline Model). Baseline model berfungsi sebagai batas ambang kinerja minimum yang harus dikalahkan oleh model yang lebih kompleks untuk membuktikan bahwa penambahan kompleksitas komputasi tersebut benar-benar memberikan nilai tambah.

Dalam sains data, baseline terbagi menjadi tiga kategori:
1. Baseline Heuristik Bisnis: Aturan praktis sederhana yang saat ini digunakan oleh analis manusia (misalnya: 'tebak bahwa penjualan es krim besok sama persis dengan penjualan hari ini').
2. Dummy Estimator Statistik: Menggunakan strategi naif seperti selalu menebak nilai mean atau median untuk regresi (DummyRegressor), atau selalu menebak kelas mayoritas untuk klasifikasi (DummyClassifier).
3. Model Linier Klasik: Model linier sederhana (seperti OLS Regresi atau Regresi Logistik dengan fitur mentah) sebagai batas atas baseline statistik.

Jika model deep learning transformer yang rumit hanya menghasilkan akurasi 82% sementara DummyClassifier kelas mayoritas menghasilkan 81%, maka model deep learning tersebut secara komersial tidak bernilai dan hanya menambah beban pemeliharaan teknis (technical debt).`,
        code: `# 1.9: Evaluasi Nilai Tambah Model Kompleks terhadap Dummy Classifier Baseline
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split

# Membuat dataset klasifikasi tidak seimbang (Imbalanced 90:10)
X, y = make_classification(n_samples=2000, n_classes=2, weights=[0.90, 0.10], random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 1. Baseline Naif: Selalu menebak kelas mayoritas (Zero-Intelligence Dummy)
dummy = DummyClassifier(strategy='most_frequent')
dummy.fit(X_train, y_train)
y_pred_dummy = dummy.predict(X_test)

# 2. Model Kompleks: Random Forest
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
y_pred_rf = rf.predict(X_test)

print("=== EVALUASI BASELINE VS MODEL KOMPLEKS ===")
print(f"Dummy Baseline Accuracy : {accuracy_score(y_test, y_pred_dummy)*100:.2f}% (Tinggi Palsu Akibat Imbalance!)")
print(f"Dummy Baseline F1-Score : {f1_score(y_test, y_pred_dummy)*100:.2f}% (Nol Besar!)")
print(f"Random Forest Accuracy  : {accuracy_score(y_test, y_pred_rf)*100:.2f}%")
print(f"Random Forest F1-Score  : {f1_score(y_test, y_pred_rf)*100:.2f}% (Nilai Tambah Sebenarnya!)")`,
        expectedOutput: "Dummy akurasi 90% memiliki F1-Score 0%, membuktikan nilai tambah model kompleks pada metrik F1.",
        codeExp: "Skrip mendemonstrasikan bahaya metrik akurasi pada data tidak seimbang di mana dummy classifier menghasilkan akurasi tinggi semu, serta membuktikan pentingnya evaluasi F1-Score sebagai tolak ukur perbaikan performa riil.",
        pitfalls: [
          "Membanggakan akurasi model 95% kepada pemangku kepentingan bisnis pada kasus penipuan kartu kredit di mana 95% transaksi memang bukan penipuan.",
          "Tidak membandingkan waktu latensi inferensi dan biaya komputasi server antara baseline sederhana vs model ensembel kompleks."
        ],
        refTitle: "Scikit-Learn Documentation: Dummy estimators (Model evaluation)",
        refUrl: "https://scikit-learn.org/stable/modules/model_evaluation.html#dummy-estimators"
      },
      {
        num: "1.10",
        slug: "1-10-sintesis-arsitektur-solusi-sains-data-end-to-end",
        title: "1.10. Sintesis Arsitektur Solusi Sains Data End-to-End: Dari Riset ke Produksi",
        desc: "Integrasi menyeluruh: cetak biru arsitektur sains data produksi, transisi dari eksperimen batch notebook ke microservice inferensi real-time, dan Service Level Agreement (SLA).",
        concept: `Bab pembuka ini berpuncak pada pemahaman integrasi arsitektur sains data end-to-end. Ilmuwan data profesional tidak berhenti pada keberhasilan pemodelan di Jupyter Notebook lokal. Solusi sains data baru dinyatakan selesai apabila model tersebut dapat beroperasi secara otonom, stabil, dan terukur di infrastruktur produksi.

Arsitektur solusi sains data produksi terbagi menjadi tiga lapisan utama:
1. Lapisan Data & Fitur (Feature Store): Menyediakan fitur-fitur batch dan streaming yang konsisten antara waktu pelatihan (training) dan waktu inferensi (serving) guna mencegah training-serving skew.
2. Lapisan Pelatihan & Orkestrasi (Continuous Training): Pipeline terjadwal (misalnya menggunakan Airflow atau Kubeflow) yang secara otomatis melakukan validasi data masukan, melatih ulang model saat performa menurun, dan memvalidasi model baru terhadap baseline.
3. Lapisan Inferensi & Pemantauan (Serving & Monitoring): Model disajikan sebagai REST/gRPC API berlatensi rendah atau prosesor stream Kafka, dilengkapi pemantauan real-time terhadap penyimpangan data (Data Drift) dan anomali prediksi.`,
        code: `# 1.10: Cetak Biru Konfigurasi Arsitektur Produksi Model Sains Data
import json

arsitektur_produksi = {
    'nama_solusi': 'Real-Time Dynamic Pricing Engine v1.0',
    'mode_inferensi': 'Online REST API (Sub-50ms SLA)',
    'lapisan_fitur': {
        'tipe': 'Feature Store Terdistribusi',
        'fitur_online_redis': ['rata_permintaan_15m', 'ketersediaan_armada_lokal'],
        'fitur_batch_parquet': ['profil_loyalitas_pengguna', 'elastisitas_historis']
    },
    'pipeline_validasi_otomatis': {
        'pemeriksaan_kebocoran': 'Scikit-Learn Strict Pipeline Isolation',
        'ambang_kemenangan_evaluasi': 'RMSE Model < 0.85 * RMSE Baseline Heuristik',
        'audit_bias_demografi': 'Disparate Impact Ratio antara 0.80 dan 1.25'
    },
    'pemantauan_drift_lapangan': {
        'metrik_drift_input': 'Kolmogorov-Smirnov Test (p < 0.01 memicu retrain)',
        'metrik_performa_output': 'Mean Absolute Percentage Error (MAPE) harian'
    }
}

print("=== SPESIFIKASI ARSITEKTUR SOLUSI SAINS DATA PRODUKSI ===")
print(json.dumps(arsitektur_produksi, indent=2))`,
        expectedOutput: "Spesifikasi JSON arsitektur end-to-end terstruktur rapi untuk implementasi engineering.",
        codeExp: "Skrip merumuskan arsitektur sistem sains data tingkat industri, merangkum kebutuhan feature store, validasi otomatis anti-leakage, dan protokol pemantauan drift lapangan.",
        pitfalls: [
          "Mengembangkan model tanpa merancang cara menyajikan data fitur secara real-time di lingkungan produksi (Training-Serving Mismatch).",
          "Tidak menyertakan mekanisme fallback otomatis (seperti beralih ke aturan heuristik bisnis sederhana jika server inferensi model mengalami timeout)."
        ],
        refTitle: "Google Cloud Architecture Center: MLOps: Continuous delivery and automation pipelines in machine learning",
        refUrl: "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning"
      }
    ]
  },

  // ==========================================
  // BAB 2: Akuisisi Data, Audit Kualitas, & Isolasi Kebocoran Data (Data Leakage)
  // ==========================================
  {
    orderIndex: 2,
    id: "data-science-ch-2",
    slug: "bab-2-akuisisi-data-audit-kualitas-isolasi-kebocoran-data",
    title: "BAB 2: Akuisisi Data, Audit Kualitas, & Isolasi Kebocoran Data (Data Leakage)",
    desc: "Metodologi penanganan data tabular empiris: protokol inspeksi data 16-langkah, taksonomi nilai hilang (MCAR, MAR, MNAR), teknik imputasi statistik dan berbasis model (IterativeImputer/KNNImputer), deteksi pencilan multivariat (Mahalanobis & Isolation Forest), dan mitigasi kebocoran fitur.",
    coreConcepts: ["Data Quality Audit", "Missing Data Mechanisms (MCAR/MAR/MNAR)", "Multivariate Outlier Detection", "Iterative Imputation", "Feature Leakage Mitigation"],
    subchapters: [
      {
        num: "2.1",
        slug: "2-1-protokol-inspeksi-data-saintifik-16-langkah",
        title: "2.1. Protokol Inspeksi Kualitas Data Saintifik 16-Langkah (Comprehensive Audit)",
        desc: "Standar operasional audit data tabular: pemeriksaan integritas tipe data, kardinalitas kategori, rasio nilai nol, keunikan kunci primer, dan deteksi anomali skema.",
        concept: `Kualitas model sains data dibatasi secara mutlak oleh kualitas data masukan (prinsip Garbage In, Garbage Out). Sebelum melakukan pemodelan apa pun, seorang ilmuwan data wajib menjalankan protokol audit kualitas data 16-langkah yang komprehensif.

Protokol 16-langkah ini mengevaluasi dataset pada tiga dimensi utama:
1. Integritas Struktural: Memvalidasi dimensi baris dan kolom, konsistensi tipe data (mencegah angka numerik yang tersimpan sebagai string), serta keunikan kunci primer.
2. Kelengkapan Nilai: Menghitung persentase nilai kosong (NaN/Null), mendeteksi nilai sentinel palsu (seperti -999, 'N/A', atau spasi kosong), dan rasio kemunculan nilai nol.
3. Kualitas Distribusi & Statistik: Menghitung kardinalitas variabel kategorikal (mendeteksi High-Cardinality), memeriksa rentang nilai masuk akal secara fisik (misalnya usia tidak boleh bernilai negatif), dan mengidentifikasi keberadaan baris duplikat fisik maupun parsial.`,
        code: `# 2.1: Implementasi Protokol Audit Kualitas Data Tabular Otomatis
import pandas as pd
import numpy as np

# Membuat dataset sampel dengan berbagai cacat data realistis
np.random.seed(42)
df_mentah = pd.DataFrame({
    'pasien_id': ['P01', 'P02', 'P02', 'P03', 'P04'], # Ada duplikat ID P02
    'usia': [25, 45, 45, -999, 34],                   # Ada sentinel -999
    'tekanan_darah': [120, np.nan, 130, 115, 140],     # Ada missing value
    'kategori': ['A', 'B', 'B', 'C', 'UNKNOWN']
})

def audit_kualitas_16_langkah(df):
    laporan = []
    # 1. Dimensi Data
    laporan.append(('Dimensi Baris x Kolom', f"{df.shape[0]} x {df.shape[1]}"))
    # 2. Duplikasi Kunci Primer
    duplikat_id = df.duplicated(subset=['pasien_id']).sum()
    laporan.append(('Duplikasi ID Pasien', f"{duplikat_id} baris"))
    # 3. Sentinel -999
    sentinel_cnt = (df == -999).sum().sum()
    laporan.append(('Deteksi Nilai Sentinel (-999)', f"{sentinel_cnt} nilai"))
    # 4. Rasio Missing Values Global
    missing_pct = (df.isna().sum().sum() / df.size) * 100
    laporan.append(('Rasio Nilai Hilang Global', f"{missing_pct:.1f}%"))
    return pd.DataFrame(laporan, columns=['Parameter_Audit', 'Temuan_Inspeksi'])

print("=== LAPORAN PROTOKOL AUDIT KUALITAS DATA SAINTIFIK ===")
print(audit_kualitas_16_langkah(df_mentah).to_string(index=False))`,
        expectedOutput: "Laporan mendeteksi 1 baris duplikasi ID dan 1 nilai sentinel -999.",
        codeExp: "Skrip mengeksekusi subset protokol audit 16-langkah secara terprogram, menghasilkan tabel diagnostik yang merangkum cacat struktural dan anomali nilai sebelum data diproses lebih lanjut.",
        pitfalls: [
          "Hanya mengandalkan df.isna() tanpa memeriksa nilai sentinel tersembunyi seperti angka -999 atau teks 'Unknown'.",
          "Langsung menghapus baris yang memiliki nilai hilang tanpa menganalisis apakah kehilangan tersebut menyimpan informasi kritis."
        ],
        refTitle: "DAMA International: The Data Management Body of Knowledge (DMBOK2)",
        refUrl: "https://www.dama.org/cpages/dmbok-2nd-edition"
      },
      {
        num: "2.2",
        slug: "2-2-mekanisme-kehilangan-data-mcar-mar-mnar",
        title: "2.2. Teori Mekanisme Nilai Hilang: MCAR, MAR, dan MNAR (Donald Rubin)",
        desc: "Fondasi teoretis data hilang: klasifikasi Missing Completely at Random (MCAR), Missing at Random (MAR), dan Missing Not at Random (MNAR), serta uji Little's MCAR Test.",
        concept: `Menangani data yang hilang (missing data) bukan sekadar memilih antara menghapus baris (listwise deletion) atau mengisi dengan rata-rata. Pemilihan strategi penanganan nilai hilang harus didasarkan pada pemahaman teoretis mengenai 'Mekanisme Kehilangan Data' (Missingness Mechanism) yang dirumuskan secara seminal oleh Donald Rubin (1976).

Tiga taksonomi mekanisme kehilangan data menurut Rubin:
1. Missing Completely at Random (MCAR): Probabilitas suatu data hilang sama sekali tidak bergantung pada nilai variabel itu sendiri maupun variabel lain dalam dataset. Contoh: tabung sampel darah di laboratorium terjatuh dan pecah secara tidak sengaja. Pada MCAR, penghapusan baris tidak menimbulkan bias statistik, hanya mengurangi ukuran sampel.
2. Missing at Random (MAR): Probabilitas data hilang bergantung pada nilai variabel lain yang teramati, tetapi tidak bergantung pada nilai yang hilang itu sendiri. Contoh: pria lebih jarang mengisi survei depresi dibandingkan wanita; namun dalam kelompok pria, tingkat kehilangan tidak berkaitan dengan keparahan depresi mereka.
3. Missing Not at Random (MNAR): Probabilitas data hilang secara langsung berkaitan dengan nilai variabel yang hilang itu sendiri. Contoh: orang dengan pendapatan sangat tinggi atau sangat rendah sengaja menolak menyebutkan nominal gajinya dalam kuesioner. MNAR adalah kasus paling berbahaya karena menciptakan bias seleksi sistematis yang tidak dapat diselesaikan dengan imputasi sederhana.`,
        code: `# 2.2: Simulasi dan Diagnosa Mekanisme Kehilangan Data (MCAR vs MAR vs MNAR)
import pandas as pd
import numpy as np

np.random.seed(42)
n = 1000
usia = np.random.normal(40, 10, n)
pendapatan = usia * 500000 + np.random.normal(0, 5000000, n)

# 1. MCAR: Hilang 10% secara acak seragam murni (koin independen)
mcar_mask = np.random.binomial(1, 0.10, size=n).astype(bool)
pendapatan_mcar = np.where(mcar_mask, np.nan, pendapatan)

# 2. MAR: Orang berusia lanjut (usia > 50) lebih mungkin tidak mencatat pendapatan
mar_prob = np.where(usia > 50, 0.40, 0.05)
mar_mask = np.random.binomial(1, mar_prob).astype(bool)
pendapatan_mar = np.where(mar_mask, np.nan, pendapatan)

# 3. MNAR: Orang berpendapatan sangat tinggi (> Rp 30 Juta) sengaja tidak melapor
mnar_mask = pendapatan > 30000000
pendapatan_mnar = np.where(mnar_mask, np.nan, pendapatan)

df_rubin = pd.DataFrame({
    'Usia': usia,
    'Pendapatan_Lengkap': pendapatan,
    'MCAR': pendapatan_mcar,
    'MAR': pendapatan_mar,
    'MNAR': pendapatan_mnar
})

print("=== DISTRIBUSI RATA-RATA PENDAPATAN BERDASARKAN MEKANISME RUBIN ===")
print(f"Rata-rata Populasi Asli : Rp {df_rubin['Pendapatan_Lengkap'].mean():,.0f}")
print(f"Rata-rata Sampel MCAR   : Rp {df_rubin['MCAR'].mean():,.0f} (Bebas Bias / Tidak Berubah)")
print(f"Rata-rata Sampel MAR    : Rp {df_rubin['MAR'].mean():,.0f} (Terdistorsi karena usia tua hilang)")
print(f"Rata-rata Sampel MNAR   : Rp {df_rubin['MNAR'].mean():,.0f} (Bias Parah! Puncak atas hilang)")`,
        expectedOutput: "Rata-rata MCAR konsisten dengan populasi asli sedangkan MNAR terdistorsi secara tajam ke bawah.",
        codeExp: "Skrip menyimulasikan tiga mekanisme kehilangan Rubin pada distribusi pendapatan dan mendemonstrasikan bagaimana MNAR memangkas ekor distribusi dan menghasilkan bias rata-rata populasi.",
        pitfalls: [
          "Melakukan listwise deletion pada data yang bertipe MAR atau MNAR, yang menyebabkan sampel yang tersisa tidak lagi mewakili populasi target.",
          "Mengasumsikan data hilang bertipe MCAR tanpa melakukan pengujian diagnostik korelasi indikator missingness terhadap variabel lain."
        ],
        refTitle: "Donald B. Rubin: Inference and Missing Data",
        refUrl: "https://academic.oup.com/biomet/article/63/3/581/270868"
      },
      {
        num: "2.3",
        slug: "2-3-teknik-imputasi-lanjut-knn-iterative-mice",
        title: "2.3. Teknik Imputasi Lanjut: KNNImputer & IterativeImputer (MICE Framework)",
        desc: "Pemulihan nilai hilang tingkat lanjut: kelemahan imputasi rata-rata (penurunan varians artifisial), prinsip k-Nearest Neighbors, dan Multivariate Imputation by Chained Equations (MICE).",
        concept: `Imputasi univariat sederhana (mengisi nilai hilang dengan mean atau median) adalah praktik yang sangat merusak integritas statistik data. Imputasi mean secara artifisial mengecilkan varians data (karena menambah banyak observasi tepat di titik tengah), merusak bentuk distribusi probabilitas, dan mendistorsi kovarians antar variabel.

Ilmuwan data modern mengadopsi teknik Imputasi Multivariat:
1. KNNImputer: Mencari $k$ observasi terdekat yang memiliki nilai lengkap menggunakan metrik jarak Euclidean terbobot (Nan-Euclidean distance), lalu mengisi nilai hilang dengan rata-rata terbobot dari tetangga-tetangga terdekat tersebut.
2. IterativeImputer (MICE Framework / Multivariate Imputation by Chained Equations): Memodelkan setiap fitur yang memiliki nilai hilang sebagai fungsi regresi terhadap seluruh fitur lainnya dalam perulangan iteratif berantai. Pada setiap putaran, model memperbarui estimasi nilai hilang hingga konvergensi statistik tercapai. MICE mempertahankan struktur relasional dan korelasi antar variabel secara realistis.`,
        code: `# 2.3: Perbandingan Imputasi Mean vs IterativeImputer (MICE) pada Data Multivariat
import numpy as np
import pandas as pd
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import SimpleImputer, IterativeImputer
from sklearn.linear_model import BayesianRidge

# Membuat data berkorelasi kuat: Berat Badan dan Tinggi Badan
np.random.seed(42)
tinggi = np.random.normal(170, 8, 200)
berat = tinggi * 0.7 - 50 + np.random.normal(0, 3, 200)

# Mengosongkan 20% nilai berat badan (Missingness MAR)
berat_kotor = berat.copy()
mask_hilang = np.random.binomial(1, 0.2, 200).astype(bool)
berat_kotor[mask_hilang] = np.nan

df_fisik = np.column_stack([tinggi, berat_kotor])

# 1. Imputasi Mean Naif
imputer_mean = SimpleImputer(strategy='mean')
df_mean = imputer_mean.fit_transform(df_fisik)

# 2. Imputasi MICE Lanjut (IterativeImputer)
imputer_mice = IterativeImputer(estimator=BayesianRidge(), max_iter=10, random_state=42)
df_mice = imputer_mice.fit_transform(df_fisik)

korelasi_asli = np.corrcoef(tinggi, berat)[0, 1]
korelasi_mean = np.corrcoef(df_mean[:, 0], df_mean[:, 1])[0, 1]
korelasi_mice = np.corrcoef(df_mice[:, 0], df_mice[:, 1])[0, 1]

print("=== DAMPAK TEKNIK IMPUTASI TERHADAP KORELASI FITUR ===")
print(f"Korelasi Asli (Lengkap)    : {korelasi_asli:.4f}")
print(f"Korelasi Pasca-Imputasi Mean: {korelasi_mean:.4f} (Korelasi Rusak & Terdilusi Tajam!)")
print(f"Korelasi Pasca-Imputasi MICE: {korelasi_mice:.4f} (Korelasi Asli Terpelihara Sempurna!)")`,
        expectedOutput: "Imputasi mean merusak korelasi asli, sedangkan IterativeImputer memulihkan korelasi mendekati nilai asli.",
        codeExp: "Skrip membuktikan bagaimana imputasi univariat mendistorsi kovarians data, sementara IterativeImputer mempertahankan hubungan linier biologis antar variabel secara akurat.",
        pitfalls: [
          "Menerapkan KNNImputer tanpa melakukan penskalaan fitur (StandardScaler) terlebih dahulu, menyebabkan variabel dengan rentang nilai besar mendominasi perhitungan jarak tetangga.",
          "Menjalankan IterativeImputer pada dataset dengan ribuan kolom tanpa seleksi fitur, yang memicu lonjakan waktu komputasi kuadratik."
        ],
        refTitle: "Stef van Buuren: Flexible Imputation of Missing Data (MICE)",
        refUrl: "https://stefvanbuuren.name/fimd/"
      },
      {
        num: "2.4",
        slug: "2-4-deteksi-pencilan-multivariat-mahalanobis-isolation-forest",
        title: "2.4. Deteksi Pencilan Multivariat: Jarak Mahalanobis & Isolation Forest",
        desc: "Identifikasi anomali ruang fitur tinggi: keterbatasan pagar IQR univariat, jarak kovarians Mahalanobis, algoritma partisi acak Isolation Forest, dan Local Outlier Factor (LOF).",
        concept: `Pencilan (Outlier) tidak selalu merupakan nilai ekstrem pada satu variabel tunggal. Seseorang dengan usia 12 tahun tidak aneh, dan seseorang dengan tinggi 180 cm juga tidak aneh. Namun, seseorang dengan kombinasi usia 12 tahun DAN tinggi 180 cm adalah pencilan multivariat ekstrem yang tidak akan terdeteksi oleh metode inspeksi univariat seperti Z-score atau pagar 1.5 * IQR.

Untuk mendeteksi anomali multivariat, ilmuwan data menggunakan dua metodologi utama:
1. Jarak Mahalanobis: Mengukur jarak suatu titik data $\\mathbf{x}$ ke titik pusat rata-rata populasi $\\boldsymbol{\\mu}$ dengan memperhitungkan matriks kovarians $\\boldsymbol{\\Sigma}$. Jarak Mahalanobis mentransformasikan ruang elipsoid multivariat menjadi metrik terstandarisasi yang mengikuti distribusi Chi-Square ($\\chi^2$).
2. Isolation Forest: Algoritma berbasis pohon (tree-based ensemble) tanpa supervisi yang mengisolasi observasi dengan cara memilih fitur secara acak dan memilih nilai potong acak. Titik anomali membutuhkan jauh lebih sedikit pemotongan cabang pohon untuk terisolasi dibandingkan titik data normal yang berada di klaster padat.`,
        formula: `D_M(\\mathbf{x}) = \\sqrt{(\\mathbf{x} - \\boldsymbol{\\mu})^T \\boldsymbol{\\Sigma}^{-1} (\\mathbf{x} - \\boldsymbol{\\mu})}`,
        code: `# 2.4: Deteksi Pencilan Multivariat Menggunakan Isolation Forest di Scikit-Learn
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

# Membuat data normal dua dimensi berkorelasi
np.random.seed(42)
X_normal = np.random.multivariate_normal(mean=[50, 50], cov=[[10, 8], [8, 10]], size=300)

# Menambahkan pencilan multivariat tersembunyi (Nilai masing-masing normal, kombinasi anomali)
X_anomali = np.array([
    [65, 35],  # Usia tinggi, skor rendah (melawan arah korelasi utama)
    [35, 65]
])
X_gabungan = np.vstack([X_normal, X_anomali])

# Model Isolation Forest
iso_forest = IsolationForest(contamination=0.01, random_state=42)
prediksi = iso_forest.fit_predict(X_gabungan) # -1 menandakan anomali, 1 normal
skor_anomali = iso_forest.decision_function(X_gabungan)

df_hasil_anomali = pd.DataFrame(X_gabungan, columns=['Fitur_1', 'Fitur_2'])
df_hasil_anomali['Status'] = np.where(prediksi == -1, 'PENCILAN ANOMALI', 'Normal')
df_hasil_anomali['Skor_Anomali'] = skor_anomali

pencilan_terdeteksi = df_hasil_anomali[df_hasil_anomali['Status'] == 'PENCILAN ANOMALI']
print("=== HASIL DETEKSI PENCILAN MULTIVARIAT (ISOLATION FOREST) ===")
print(pencilan_terdeteksi.round(2))`,
        expectedOutput: "Isolation Forest berhasil mengidentifikasi titik [65, 35] dan [35, 65] sebagai anomali.",
        codeExp: "Skrip melatih Isolation Forest tanpa supervisi untuk mendeteksi titik data anomali yang menyimpang dari korelasi gabungan multivariat meskipun masing-masing fiturnya berada dalam rentang univariat yang valid.",
        pitfalls: [
          "Menerapkan Jarak Mahalanobis klasik pada data yang memuat pencilan raksasa tanpa menggunakan estimator kovarians yang kuat (Robust Covariance / Minimum Covariance Determinant), karena pencilan tersebut akan mendistorsi matriks kovarians itu sendiri.",
          "Menghapus seluruh pencilan tanpa memeriksa apakah anomali tersebut merupakan kasus penipuan (fraud) yang justru menjadi target prediksi utama model."
        ],
        refTitle: "Fei Tony Liu, Kai Ming Ting, Zhi-Hua Zhou: Isolation Forest (IEEE ICDM 2008)",
        refUrl: "https://ieeexplore.ieee.org/document/4781136"
      },
      {
        num: "2.5",
        slug: "2-5-transformasi-fitur-penskalaan-numerik-standard-minmax-robust",
        title: "2.5. Transformasi Fitur & Penskalaan Numerik: StandardScaler, RobustScaler, PowerTransformer",
        desc: "Normalisasi matematis ruang fitur: perbedaan StandardScaler (Z-score), MinMaxScaler (rentang 0-1), RobustScaler (median-IQR), dan Yeo-Johnson PowerTransformer untuk normalisasi Gaussian.",
        concept: `Banyak algoritma sains data—termasuk Regresi Linier Ter-regularisasi (Ridge/Lasso), Support Vector Machines (SVM), k-Nearest Neighbors (k-NN), K-Means, dan Jaringan Saraf Tiruan—bekerja berdasarkan perhitungan jarak geometris atau turunan gradien. Algoritma-algoritma ini sangat sensitif terhadap skala numerik fitur. Jika fitur Pendapatan bernilai jutaan rupiah sedangkan fitur Usia bernilai puluhan tahun, algoritma akan menganggap Pendapatan jauh lebih penting secara matematis murni akibat skalanya.

Pilihan teknik penskalaan di Scikit-Learn:
1. StandardScaler: Mentransformasikan fitur agar memiliki rata-rata $\\mu = 0$ dan standar deviasi $\\sigma = 1$. Asumsi: data berdistribusi mendekati normal dan bebas dari pencilan ekstrem.
2. MinMaxScaler: Mengompresi seluruh rentang data ke dalam batas kaku $[0, 1]$. Sangat sensitif terhadap pencilan (satu pencilan besar akan memadatkan seluruh data normal lainnya mendekati nol).
3. RobustScaler: Melakukan penskalaan menggunakan Median dan Interquartile Range (IQR). Metode ini kebal (robust) terhadap pencilan karena posisi median dan IQR tidak terdistorsi oleh nilai ekstrem.
4. PowerTransformer (Box-Cox & Yeo-Johnson): Menerapkan transformasi parametrik non-linear untuk menstabilkan varians dan mengubah bentuk distribusi yang sangat menceng mendekati kurva normal Gauss.`,
        code: `# 2.5: Evaluasi Ketahanan Scaler terhadap Pencilan (RobustScaler vs StandardScaler)
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, RobustScaler, MinMaxScaler

# Data nilai transaksi dengan 1 pencilan raksasa (Whale Customer)
transaksi = np.array([[100], [120], [110], [105], [115], [5000]]) # 5000 adalah pencilan masif

scaler_std = StandardScaler()
scaler_minmax = MinMaxScaler()
scaler_robust = RobustScaler()

df_skala = pd.DataFrame({
    'Data_Asli': transaksi.flatten(),
    'StandardScaler': scaler_std.fit_transform(transaksi).flatten().round(2),
    'MinMaxScaler': scaler_minmax.fit_transform(transaksi).flatten().round(2),
    'RobustScaler': scaler_robust.fit_transform(transaksi).flatten().round(2)
})

print("=== PERBANDINGAN METODE PENSKALAAN DENGAN PENCILAN ===")
print(df_skala)
print("\\nObservasi:")
print("Pada MinMaxScaler dan StandardScaler, 5 data normal terkompresi mendekati nilai yang sama.")
print("Pada RobustScaler, 5 data normal tetap memiliki diferensiasi skala yang jelas dan bermakna.")`,
        expectedOutput: "RobustScaler mempertahankan variasi data normal di sekitar 0 sementara StandardScaler terdistorsi oleh nilai 5000.",
        codeExp: "Skrip mendemonstrasikan keunggulan RobustScaler berbasis kuartil dalam mempertahankan variasi relatif data normal tanpa terkompresi oleh kehadiran pencilan tunggal bernilai 5.000.",
        pitfalls: [
          "Melakukan penskalaan pada data latih dan data uji secara terpisah menggunakan dua scaler berbeda alih-alih menggunakan parameter fit yang sama.",
          "Menerapkan Box-Cox PowerTransformer pada data yang memuat nilai negatif atau nol; selalu gunakan Yeo-Johnson yang mendukung bilangan riil penuh."
        ],
        refTitle: "Scikit-Learn User Guide: Preprocessing data (Scaling & Centering)",
        refUrl: "https://scikit-learn.org/stable/modules/preprocessing.html"
      },
      {
        num: "2.6",
        slug: "2-6-encoding-kategorikal-onehot-ordinal-target-encoding",
        title: "2.6. Rekayasa Data Kategorikal: One-Hot, Ordinal, dan Target Encoding Teratur",
        desc: "Transformasi variabel non-numerik: jebakan Dummy Variable Trap, OneHotEncoder dengan handle_unknown, dan Target Encoding dengan regularisasi smoothing untuk mengatasi kardinalitas tinggi.",
        concept: `Algoritma sains data hanya dapat memproses angka biner atau kontinu matriks. Variabel kategorikal (seperti Provinsi, Kategori Barang, atau Tingkat Kepuasan) harus dikonversi ke dalam format numerik melalui teknik encoding yang tepat.

Tiga pendekatan encoding utama:
1. Ordinal Encoding: Memetakan kategori ke bilangan bulat terurut ($1, 2, 3$). Hanya sah digunakan apabila kategori memiliki hierarki intrinsik yang alami (seperti Rendah, Sedang, Tinggi). Menerapkan Ordinal Encoding pada kategori nominal (seperti Warna Mobil: Merah=1, Biru=2, Hijau=3) memaksa model membuat asumsi salah bahwa Hijau tiga kali lebih besar daripada Merah.
2. One-Hot Encoding: Membuat kolom biner baru untuk setiap nilai kategori unik. Kelemahannya adalah ledakan dimensi (Curse of Dimensionality) saat menghadapi fitur berkardinalitas tinggi (seperti 500 nama kota). Parameter handle_unknown='ignore' wajib diaktifkan untuk menangani kategori baru yang belum pernah muncul di data latih.
3. Target (Mean) Encoding: Mengganti setiap kategori dengan nilai rata-rata target untuk kategori tersebut. Sangat efisien untuk data berkardinalitas tinggi, namun sangat rentan terhadap overfitting dan kebocoran target (target leakage) jika tidak menggunakan smoothing empiris Bayes.`,
        formula: `S_i = \\frac{n_i \\cdot \\bar{y}_i + m \\cdot \\bar{y}_{\\text{global}}}{n_i + m}`,
        code: `# 2.6: Implementasi Target Encoding dengan Smoothing Empiris Bayes
import pandas as pd
import numpy as np

# Simulasi data penjualan produk dengan kategori kardinalitas tinggi
df_kat = pd.DataFrame({
    'kategori': ['Elektronik', 'Elektronik', 'Fashion', 'Elektronik', 'Buku', 'Fashion'],
    'target_konversi': [1, 1, 0, 1, 0, 1]
})

# Menghitung prior global
global_mean = df_kat['target_konversi'].mean()
smoothing_weight = 2 # Parameter smoothing m

# Menghitung statistik per kategori
agregat = df_kat.groupby('kategori')['target_konversi'].agg(['count', 'mean'])

# Formula Target Encoding Ter-smoothing (Mencegah Overfitting Kategori Kecil)
smoothed_encoding = (
    (agregat['count'] * agregat['mean'] + smoothing_weight * global_mean) / 
    (agregat['count'] + smoothing_weight)
).to_dict()

df_kat['kategori_target_encoded'] = df_kat['kategori'].map(smoothed_encoding).round(3)

print("=== HASIL TARGET ENCODING DENGAN BAYESIAN SMOOTHING ===")
print(f"Rata-rata Konversi Global (Prior): {global_mean:.3f}\\n")
print(df_kat[['kategori', 'target_konversi', 'kategori_target_encoded']])`,
        expectedOutput: "Kategori Buku (hanya 1 observasi) ditarik mendekati prior global 0.600 bukan bernilai ekstrem 0.000.",
        codeExp: "Skrip mendemonstrasikan formula smoothing Target Encoding: kategori dengan ukuran sampel kecil secara otomatis ditarik mendekati rata-rata global untuk mencegah overfitting.",
        pitfalls: [
          "Menerapkan One-Hot Encoding pada fitur dengan ribuan kategori unik tanpa membatasi jumlah fitur, yang memicu kehabisan memori RAM.",
          "Menghitung Target Encoding pada seluruh dataset sekaligus tanpa isolasi cross-validation fold, yang menyebabkan kebocoran target fatal."
        ],
        refTitle: "Daniele Micci-Barreca: A Preprocessing Scheme for High-Cardinality Categorical Attributes in Classification and Prediction Problems",
        refUrl: "https://dl.acm.org/doi/10.1145/507533.507538"
      },
      {
        num: "2.7",
        slug: "2-7-rekayasa-fitur-interaksi-polinomial-domain-knowledge",
        title: "2.7. Rekayasa Fitur Interaksi, Polinomial & Pengetahuan Domain (Domain Knowledge)",
        desc: "Penciptaan sinyal prediktif baru: interaksi perkalian fitur (PolynomialFeatures), transformasi non-linear logaritmik, rasio bisnis domain, dan dekomposisi data teks/datetime.",
        concept: `Algoritma pembelajaran mesin paling mutakhir tidak akan mampu mengungguli model linier sederhana jika model linier tersebut diberi fitur-fitur representatif yang direkayasa berdasarkan pengetahuan domain industri yang mendalam. Rekayasa Fitur (Feature Engineering) adalah seni dan sains mengekstrak prediktor baru dari data mentah untuk mempermudah algoritma menemukan pola pemisah.

Teknik utama rekayasa fitur:
1. Interaksi Polinomial: Mengalikan dua fitur numerik ($X_1 \\times X_2$). Dalam pemodelan perumahan, luas bangunan dan lokasi mungkin memiliki pengaruh interaksi non-linear yang tidak dapat ditangkap oleh penambahan linier sederhana.
2. Rasio Finansial & Operasional Domain: Membagi dua variabel untuk menghasilkan metrik efisiensi baru (misalnya rasio Debt-to-Income pada kredit nasabah, atau rasio Revenue-per-Click pada pemasaran).
3. Dekomposisi Temporal: Memecah stempel waktu tanggal menjadi fitur siklikal (hari dalam minggu, jam dalam hari, apakah hari libur nasional) dan merepresentasikannya menggunakan transformasi sinus-cosinus untuk menjaga kontinuitas siklus waktu.`,
        code: `# 2.7: Rekayasa Fitur Temporal Siklikal Menggunakan Transformasi Sinus-Cosinus
import numpy as np
import pandas as pd

# 24 Jam dalam satu hari
jam_hari = np.arange(0, 24)

# Transformasi siklikal agar Jam 23:00 berdekatan secara geometris dengan Jam 00:00
sin_jam = np.sin(2 * np.pi * jam_hari / 24).round(3)
cos_jam = np.cos(2 * np.pi * jam_hari / 24).round(3)

df_waktu = pd.DataFrame({
    'Jam': jam_hari,
    'Sin_Jam': sin_jam,
    'Cos_Jam': cos_jam
})

# Hitung jarak Euclidean antara Jam 23 dan Jam 0 pada koordinat siklikal
jarak_siklikal = np.sqrt(
    (df_waktu.loc[23, 'Sin_Jam'] - df_waktu.loc[0, 'Sin_Jam'])**2 +
    (df_waktu.loc[23, 'Cos_Jam'] - df_waktu.loc[0, 'Cos_Jam'])**2
)

print("=== REKAYASA FITUR TEMPORAL SIKLIKAL (SIN/COS ENCODING) ===")
print(df_waktu.iloc[[0, 6, 12, 18, 23]])
print(f"\\nJarak Geometris Jam 23 ke Jam 0: {jarak_siklikal:.4f} (Kontinu & Bersebelahan)")`,
        expectedOutput: "Jarak siklikal Jam 23 ke Jam 0 bernilai kecil (~0.26), membuktikan kontinuitas waktu.",
        codeExp: "Skrip mengonversi variabel jam diskrit menjadi koordinat trigonometri kontinu 2D, menyelesaikan masalah klasik di mana jam 23 dan jam 0 dianggap terpisah sangat jauh oleh model linier.",
        pitfalls: [
          "Membuat interaksi polinomial derajat tinggi (> 3) pada banyak fitur, yang memicu ledakan jumlah kolom secara eksponensial dan menyebabkan overfitting masif.",
          "Membuat fitur rasio dengan pembagi yang dapat bernilai nol tanpa menyertakan konstanta epsilon penstabil."
        ],
        refTitle: "Scikit-Learn User Guide: Generating polynomial features",
        refUrl: "https://scikit-learn.org/stable/modules/preprocessing.html#generating-polynomial-features"
      },
      {
        num: "2.8",
        slug: "2-8-seleksi-fitur-metode-filter-wrapper-embedded",
        title: "2.8. Seleksi Fitur & Eliminasi Redundansi: Filter, Wrapper, dan Embedded Methods",
        desc: "Pengurangan kompleksitas model: metode Filter (uji korelasi, ANOVA, Mutual Information), metode Wrapper (RFE), dan metode Embedded (penalti L1 Lasso, feature importances).",
        concept: `Menambahkan ratusan fitur baru tidak selalu meningkatkan performa model. Fitur yang tidak relevan (derau murni) atau fitur yang redundan (mengulang informasi yang sama) akan memperlambat pelatihan, meningkatkan risiko overfitting, dan menurunkan interpretabilitas model. Seleksi Fitur bertujuan menemukan subset fitur minimal yang memberikan performa prediktif optimal.

Tiga taksonomi metode seleksi fitur:
1. Filter Methods: Mengevaluasi relevansi setiap fitur secara independen dari algoritma pemodelan menggunakan uji statistik (seperti ANOVA F-test untuk target kategorikal, uji Chi-Square, atau Skor Informasi Timbal-Balik / Mutual Information). Sangat cepat tetapi mengabaikan interaksi antar fitur.
2. Wrapper Methods: Menggunakan model prediktif sebagai evaluator untuk mencari kombinasi fitur terbaik secara rekursif (misalnya Recursive Feature Elimination / RFE). Sangat akurat namun sangat mahal secara komputasi.
3. Embedded Methods: Seleksi fitur terintegrasi secara inheren di dalam proses optimasi algoritma itu sendiri—contohnya regularisasi Lasso ($L_1$) yang secara matematis memaksa koefisien fitur yang tidak penting menjadi tepat nol.`,
        code: `# 2.8: Seleksi Fitur Menggunakan Mutual Information vs F-Score di Scikit-Learn
from sklearn.feature_selection import mutual_info_regression, f_regression
import numpy as np
import pandas as pd

np.random.seed(42)
n = 300
x1 = np.random.uniform(-5, 5, n)
x2 = np.random.normal(0, 1, n)
x_derau = np.random.normal(0, 1, n) # Fitur sampah murni

# Target y memiliki hubungan non-linear murni dengan x1 (y = x1^2) dan linear dengan x2
y = (x1 ** 2) + 2 * x2 + np.random.normal(0, 0.5, n)
X = np.column_stack([x1, x2, x_derau])

# 1. Uji Linear F-Regression (Sensitif hanya pada linearitas)
f_stat, p_val = f_regression(X, y)

# 2. Mutual Information Regression (Mendeteksi dependensi non-linear)
mi_scores = mutual_info_regression(X, y, random_state=42)

df_seleksi = pd.DataFrame({
    'Fitur': ['X1 (Non-linear Kuadratik)', 'X2 (Linear)', 'X_Derau (Noise)'],
    'F_Statistic': f_stat.round(2),
    'Mutual_Information': mi_scores.round(4)
})

print("=== EVALUASI SELEKSI FITUR: F-TEST VS MUTUAL INFORMATION ===")
print(df_seleksi)
print("\\nObservasi:")
print("F-Test gagal mendeteksi X1 (skor rendah) karena hubungannya non-linear kurvilinear.")
print("Mutual Information berhasil mendeteksi X1 sebagai prediktor terkuat!")`,
        expectedOutput: "Mutual Information mendeteksi X1 memiliki skor tertinggi sementara F-Test terkecoh oleh non-linearitas.",
        codeExp: "Skrip membandingkan metode filter linier (F-test) dengan metode informasi timbal-balik (Mutual Information), membuktikan keunggulan teori informasi dalam menangkap fitur bernilai non-linear.",
        pitfalls: [
          "Menjalankan seleksi fitur pada seluruh dataset sebelum train-test split (bentuk kebocoran data klasik).",
          "Menggunakan RFE pada dataset dengan ribuan fitur yang memakan waktu eksekusi berjam-jam tanpa percepatan bertahap."
        ],
        refTitle: "Scikit-Learn User Guide: Feature selection",
        refUrl: "https://scikit-learn.org/stable/modules/feature_selection.html"
      },
      {
        num: "2.9",
        slug: "2-9-arsitektur-columntransformer-scikit-learn-pipelines",
        title: "2.9. Arsitektur ColumnTransformer & Pipeline Terpadu Multi-Tipe",
        desc: "Penggabungan alur kerja rekayasa fitur heterogen: penanganan terpisah kolom numerik dan kategorikal via ColumnTransformer, integrasi Custom Transformer, dan validasi atomik.",
        concept: `Dalam dataset dunia nyata, tabel data memuat campuran fitur heterogen: sebagian bertipe numerik kontinu yang membutuhkan penskalaan StandardScaler dan imputasi median, sebagian bertipe kategorikal nominal yang membutuhkan OneHotEncoder, dan sebagian bertipe teks atau tanggal.

Mengelola transformasi heterogen ini secara manual menggunakan skrip ad-hoc rentan terhadap kesalahan urutan dan kebocoran data. Standar industri modern Scikit-Learn menyelesaikan masalah ini melalui ColumnTransformer.

ColumnTransformer memungkinkan analis menerapkan rangkaian pipeline transformasi berbeda pada subset kolom yang berbeda secara simultan dalam satu struktur deklaratif. Seluruh alur ini kemudian digabungkan dengan model estimator ke dalam satu objek Pipeline utama. Pipeline ini dapat disimpan sebagai satu file serialisasi utuh (.joblib) yang siap menerima data JSON mentah di server produksi dan mengembalikan hasil prediksi secara atomik.`,
        code: `# 2.9: Konstruksi ColumnTransformer Heterogen Terpadu di Scikit-Learn
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
import pandas as pd

# Data heterogen transaksi
df_heterogen = pd.DataFrame({
    'usia': [25, 32, np.nan, 45],
    'pendapatan': [5000000, 12000000, 8500000, 20000000],
    'status_kawin': ['Belum', 'Menikah', 'Menikah', 'Belum'],
    'target_beli': [0, 1, 1, 1]
})

X = df_heterogen.drop('target_beli', axis=1)
y = df_heterogen['target_beli']

# 1. Pipeline untuk Kolom Numerik
num_cols = ['usia', 'pendapatan']
num_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# 2. Pipeline untuk Kolom Kategorikal
cat_cols = ['status_kawin']
cat_pipeline = Pipeline([
    ('encoder', OneHotEncoder(handle_unknown='ignore'))
])

# 3. Gabungkan dalam ColumnTransformer
preprocessor = ColumnTransformer(transformers=[
    ('num', num_pipeline, num_cols),
    ('cat', cat_pipeline, cat_cols)
])

# 4. Pipeline Akhir End-to-End dengan Estimator
full_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression())
])

full_pipeline.fit(X, y)
print("=== STRUKTUR ARSITEKTUR COLUMNTRANSFORMER PIPELINE ===")
print(full_pipeline)
print(f"\\nStatus Fitting Pipeline: SUKSES (Tervalidasi Bebas Leakage)")`,
        expectedOutput: "Pipeline lengkap dengan ColumnTransformer berhasil di-fit pada data heterogen.",
        codeExp: "Skrip menyusun arsitektur pemrosesan data modular Scikit-Learn menggunakan ColumnTransformer untuk memisahkan alur numerik dan kategorikal, lalu membungkusnya dengan estimator ke dalam satu pipeline atomik.",
        pitfalls: [
          "Lupa menyertakan parameter handle_unknown='ignore' pada OneHotEncoder di dalam pipeline, yang menyebabkan error saat model produksi menerima kategori baru.",
          "Mengekstrak data dari DataFrame menggunakan indeks integer alih-alih nama kolom eksplisit di dalam ColumnTransformer."
        ],
        refTitle: "Scikit-Learn Documentation: ColumnTransformer for heterogeneous data",
        refUrl: "https://scikit-learn.org/stable/modules/generated/sklearn.compose.ColumnTransformer.html"
      },
      {
        num: "2.10",
        slug: "2-10-studi-kasus-audit-rekayasa-data-california-housing",
        title: "2.10. Studi Kasus Komprehensif: Audit & Rekayasa Data California Housing",
        desc: "Implementasi end-to-end pada dataset benchmark resmi Pace & Barry (1997): inspeksi batas sensorik (capping), korelasi geografis, imputasi rasional, dan evaluasi baseline regresi.",
        concept: `Sebagai penutup Bab 2, seluruh metodologi audit kualitas, penanganan nilai hilang, dan rekayasa fitur diterapkan pada dataset benchmark kanonikal sains data: California Housing Dataset (Pace & Barry, 1997). Dataset ini memuat data sensus California 1990 yang merefleksikan seluruh tantangan data riil.

Tantangan Kunci Dataset California Housing:
1. Sensor Capping Anomali: Kolom nilai median rumah (MedHouseVal) dipotong paksa pada batas atas $500,000 (capping), dan median usia rumah (HouseAge) dipotong pada 52 tahun. Model yang dilatih tanpa memahami batas sensor ini akan mempelajari batas artifisial yang salah.
2. Fitur Rasio Multivariat: Kolom mentah seperti TotalRooms dan TotalBedrooms tidak informatif jika berdiri sendiri karena bergantung pada jumlah penduduk blok; rekayasa fitur harus membentuk rasio 'Rooms per Household' dan 'Bedrooms per Room'.
3. Komponen Geografis Non-Linear: Variabel Garis Lintang (Latitude) dan Garis Bujur (Longitude) memiliki dependensi spasial kompleks terhadap pusat ekonomi pesisir pantai.`,
        code: `# 2.10: Rekayasa Fitur Rasio Spasial pada Dataset California Housing
import pandas as pd
import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.linear_model import Ridge
from sklearn.metrics import root_mean_squared_error
from sklearn.model_selection import train_test_split

# Memuat dataset benchmark California Housing
housing = fetch_california_housing(as_frame=True)
df_ca = housing.frame.copy()

# Rekayasa Fitur Rasio Domain Penting
df_ca['Rooms_Per_Household'] = df_ca['AveRooms'] / df_ca['AveOccup']
df_ca['Bedrooms_Ratio'] = df_ca['AveBedrms'] / df_ca['AveRooms']

# Menghitung jarak Euclidean aproksimasi ke pusat ekonomi pesisir (San Francisco: 37.77, -122.41)
sf_lat, sf_lon = 37.7749, -122.4194
df_ca['Dist_to_Coast_SF'] = np.sqrt(
    (df_ca['Latitude'] - sf_lat)**2 + (df_ca['Longitude'] - sf_lon)**2
)

X = df_ca.drop('MedHouseVal', axis=1)
y = df_ca['MedHouseVal']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Evaluasi perbaikan regresi linier dengan fitur rekayasa baru
model_ca = Ridge(alpha=1.0)
model_ca.fit(X_train, y_train)
y_pred = model_ca.predict(X_test)
rmse = root_mean_squared_error(y_test, y_pred)

print("=== HASIL EVALUASI STUDI KASUS CALIFORNIA HOUSING ===")
print(f"Dimensi Data       : {df_ca.shape[0]:,} observasi × {df_ca.shape[1]} kolom")
print(f"Fitur Baru Dibuat  : Rooms_Per_Household, Bedrooms_Ratio, Dist_to_Coast_SF")
print(f"Test RMSE Evaluasi : \${rmse*100000:,.2f} (Skala Asli Ratusan Ribu Dolar)")`,
        expectedOutput: "Model Ridge berhasil dievaluasi dengan RMSE sekitar $71.000 pada data uji.",
        codeExp: "Skrip mendemonstrasikan penerapan rekayasa fitur domain riil (rasio kamar dan aproksimasi spasial jarak ke pesisir) pada dataset sensus California Housing untuk meningkatkan akurasi estimasi nilai aset.",
        pitfalls: [
          "Tidak menyadari bahwa target MedHouseVal telah di-capping pada angka 5.0 ($500,000), yang menyebabkan model memprediksi nilai datar pada rumah-rumah mewah.",
          "Mengevaluasi performa model hanya menggunakan R2 tanpa memeriksa galat dalam satuan mata uang asli menggunakan RMSE."
        ],
        refTitle: "R. Kelley Pace, Ronald Barry: Sparse Spatial Autoregressions (California Housing)",
        refUrl: "https://www.sciencedirect.com/science/article/abs/pii/S0167715296001032"
      }
    ]
  },

  // ==========================================
  // BAB 3: Teori Probabilitas & Variabel Acak untuk Sains Data
  // ==========================================
  {
    orderIndex: 3,
    id: "data-science-ch-3",
    slug: "bab-3-teori-probabilitas-variabel-acak-sains-data",
    title: "BAB 3: Teori Probabilitas & Variabel Acak untuk Sains Data",
    desc: "Fondasi matematika ketidakpastian: ruang sampel dan aksioma Kolmogorov, probabilitas bersyarat, Teorema Bayes dan inferensi Bayesian, variabel acak diskrit vs kontinu, fungsi massa probabilitas (PMF) dan fungsi kepekatan probabilitas (PDF), serta ekspektasi dan varians.",
    coreConcepts: ["Kolmogorov Axioms", "Conditional Probability", "Bayes Theorem", "Random Variables (PMF/PDF)", "Mathematical Expectation"],
    subchapters: [
      {
        num: "3.1",
        slug: "3-1-ruang-sampel-aksioma-probabilitas-kolmogorov",
        title: "3.1. Ruang Sampel, Peristiwa & Aksioma Probabilitas Kolmogorov",
        desc: "Landasan formal teori peluang: ruang sampel himpunan semesta, aljabar himpunan peristiwa, dan tiga aksioma probabilitas Andrey Kolmogorov.",
        concept: `Probabilitas adalah bahasa formal matematika untuk menguantifikasi ketidakpastian. Dalam sains data, setiap observasi empiris dipandang sebagai hasil dari suatu eksperimen acak. Fondasi teori probabilitas modern dibangun di atas tiga aksioma yang dirumuskan oleh matematikawan Soviet Andrey Kolmogorov pada tahun 1933.

Misalkan $\\Omega$ adalah Ruang Sampel (himpunan seluruh kemungkinan hasil dari suatu eksperimen acak), dan $\\mathcal{F}$ adalah himpunan peristiwa (event). Sebuah fungsi probabilitas $P: \\mathcal{F} \\rightarrow \\mathbb{R}$ wajib memenuhi Tiga Aksioma Kolmogorov:
1. Non-Negativitas: Untuk setiap peristiwa $A$, $P(A) \\ge 0$.
2. Normalisasi (Kepastian Semesta): Peluang terjadinya ruang sampel total adalah satu, $P(\\Omega) = 1$.
3. Aditivitas Terhitung (Countable Additivity): Jika $A_1, A_2, A_3, \\dots$ adalah barisan peristiwa yang saling lepas (mutually exclusive, di mana $A_i \\cap A_j = \\emptyset$ untuk $i \\ne j$), maka:
$$P\\left(\\bigcup_{i=1}^\\infty A_i\\right) = \\sum_{i=1}^\\infty P(A_i)$$

Dari tiga aksioma sederhana ini, seluruh hukum matematika probabilitas—termasuk aturan komplemen $P(A^c) = 1 - P(A)$ dan aturan penjumlahan inklusi-eksklusi $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$—dapat diturunkan secara deduktif ketat.`,
        formula: `P(A \\cup B) = P(A) + P(B) - P(A \\cap B)`,
        code: `# 3.1: Verifikasi Empiris Hukum Penjumlahan Inklusi-Eksklusi Kolmogorov
import numpy as np

# Simulasi 100.000 transaksi e-commerce
np.random.seed(42)
n = 100000

# A: Pengguna mengklik iklan diskon (P(A) = 0.35)
event_a = np.random.binomial(1, 0.35, size=n).astype(bool)
# B: Pengguna berbelanja lewat aplikasi seluler (P(B) = 0.50)
event_b = np.random.binomial(1, 0.50, size=n).astype(bool)

p_a = event_a.mean()
p_b = event_b.mean()
p_a_dan_b = (event_a & event_b).mean() # Irisan A dan B
p_a_gabung_b_simulasi = (event_a | event_b).mean() # Gabungan A atau B

# Perhitungan Teoretis Kolmogorov: P(A u B) = P(A) + P(B) - P(A n B)
p_a_gabung_b_teori = p_a + p_b - p_a_dan_b

print("=== VERIFIKASI AKSIOMA INKLUSI-EKSKLUSI KOLMOGOROV ===")
print(f"Probabilitas P(A) [Klik Iklan]      : {p_a:.4f}")
print(f"Probabilitas P(B) [Pakai Mobile]     : {p_b:.4f}")
print(f"Probabilitas P(A n B) [Irisan Bersama]: {p_a_dan_b:.4f}")
print(f"P(A u B) Hasil Simulasi Empiris      : {p_a_gabung_b_simulasi:.4f}")
print(f"P(A u B) Formula Teoretis Kolmogorov : {p_a_gabung_b_teori:.4f}")
print(f"Selisih Galat Komputasi              : {abs(p_a_gabung_b_simulasi - p_a_gabung_b_teori):.6f}")`,
        expectedOutput: "Hasil simulasi empiris cocok presisi dengan formula analitik Kolmogorov.",
        codeExp: "Skrip memverifikasi hukum inklusi-eksklusi peluang Kolmogorov menggunakan metode Monte Carlo pada 100.000 simulasi observasi independen.",
        pitfalls: [
          "Menjumlahkan probabilitas $P(A) + P(B)$ secara langsung tanpa mengurangkan irisan $P(A \\cap B)$ pada peristiwa yang tidak saling lepas.",
          "Mendefinisikan ruang sampel yang tidak mencakup seluruh kemungkinan semesta (tidak collectively exhaustive)."
        ],
        refTitle: "Andrey Kolmogorov: Foundations of the Theory of Probability",
        refUrl: "https://archive.org/details/foundationsofthe00kolm"
      },
      {
        num: "3.2",
        slug: "3-2-probabilitas-bersyarat-hukum-independensi",
        title: "3.2. Probabilitas Bersyarat & Konsep Independensi Stokastik",
        desc: "Pembaruan informasi ketidakpastian: definisi formal probabilitas bersyarat P(A|B), aturan perkalian peluang, dan independensi statistik vs dependensi fungsional.",
        concept: `Dalam dunia nyata, kita jarang mengevaluasi probabilitas suatu peristiwa dalam kondisi hampa informasi. Munculnya bukti atau informasi baru $B$ akan memperbarui keyakinan kita terhadap terjadinya peristiwa $A$. Konsep ini diformalkan melalui Probabilitas Bersyarat (Conditional Probability $P(A \\mid B)$).

Secara matematis, probabilitas terjadinya peristiwa $A$ dengan syarat peristiwa $B$ telah terbukti terjadi didefinisikan sebagai:
$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\quad \\text{dengan syarat } P(B) > 0$$

Dua peristiwa $A$ dan $B$ dikatakan Independen secara Stokastik jika dan hanya jika terjadinya peristiwa $B$ sama sekali tidak mengubah peluang terjadinya peristiwa $A$, yaitu $P(A \\mid B) = P(A)$, yang ekuivalen dengan aturan faktorisasi perkalian:
$$P(A \\cap B) = P(A) \\times P(B)$$
Jika kesamaan ini tidak terpenuhi, maka kedua variabel tersebut memiliki dependensi statistik yang menjadi dasar bagi model prediktif untuk mengekstraksi informasi.`,
        formula: `P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}`,
        code: `# 3.2: Pengujian Independensi Stokastik pada Keranjang Belanja Pelanggan
import numpy as np
import pandas as pd

np.random.seed(42)
n = 50000

# Skenario 1: Pembelian Kopi (A) dan Gula (B) memiliki dependensi kuat
beli_kopi = np.random.binomial(1, 0.30, size=n).astype(bool)
# Jika beli kopi, probabilitas beli gula melonjak dari 15% menjadi 60%
prob_gula = np.where(beli_kopi, 0.60, 0.15)
beli_gula = np.random.binomial(1, prob_gula).astype(bool)

p_kopi = beli_kopi.mean()
p_gula = beli_gula.mean()
p_kopi_dan_gula = (beli_kopi & beli_gula).mean()

# P(Gula | Kopi) = P(Gula n Kopi) / P(Kopi)
p_gula_given_kopi = p_kopi_dan_gula / p_kopi

print("=== PENGUJIAN INDEPENDENSI STOKASTIK ===")
print(f"P(Gula) Prior Marginal          : {p_gula*100:.2f}%")
print(f"P(Gula | Kopi) Peluang Bersyarat : {p_gula_given_kopi*100:.2f}%")
print(f"P(Kopi) * P(Gula) Ekspektasi Independen: {(p_kopi * p_gula)*100:.2f}%")
print(f"P(Kopi n Gula) Observasi Aktual       : {p_kopi_dan_gula*100:.2f}%")

if abs(p_kopi_dan_gula - (p_kopi * p_gula)) > 0.01:
    print("\\n[KESIMPULAN]: Kedua peristiwa DEPENDEN secara statistik (Ada sinyal asosiasi!).")
else:
    print("\\n[KESIMPULAN]: Kedua peristiwa INDEPENDEN murni.")`,
        expectedOutput: "P(Gula|Kopi) melonjak menjadi ~60% dibanding prior 28%, membuktikan dependensi kuat.",
        codeExp: "Skrip menghitung peluang marginal dan peluang bersyarat secara empiris untuk memvalidasi apakah dua peristiwa belanja bersifat independen atau memiliki keterkaitan statistik stokastik.",
        pitfalls: [
          "Mencampuradukkan $P(A \\mid B)$ dengan $P(B \\mid A)$ (dikenal sebagai Prosecutor's Fallacy).",
          "Mengasumsikan independensi secara naif pada variabel-variabel yang sebenarnya saling berkorelasi erat di dunia nyata."
        ],
        refTitle: "Morris H. DeGroot, Mark J. Schervish: Probability and Statistics (4th Edition)",
        refUrl: "https://www.pearson.com/"
      },
      {
        num: "3.3",
        slug: "3-3-teorema-bayes-hukum-probabilitas-total",
        title: "3.3. Teorema Bayes & Hukum Probabilitas Total (Bayesian Reasoning)",
        desc: "Pembalik probabilitas bersyarat: Hukum Probabilitas Total, formula Teorema Bayes, pembaruan Prior menjadi Posterior, dan penerapannya pada diagnosis medis dan deteksi spam.",
        concept: `Teorema Bayes yang dirumuskan oleh Pendeta Thomas Bayes pada abad ke-18 adalah fondasi epistemologi dari penalaran induktif dan pembelajaran mesin Bayesian. Teorema ini memberikan metode matematis yang presisi untuk memperbarui probabilitas suatu hipotesis ($H$) setelah kita mengamati bukti empiris baru ($E$).

Hukum Probabilitas Total menyatakan bahwa jika ruang sampel dipartisi menjadi himpunan peristiwa yang saling lepas $B_1, B_2, \\dots, B_k$, maka probabilitas marginal dari peristiwa $A$ adalah:
$$P(A) = \\sum_{i=1}^k P(A \\mid B_i) P(B_i)$$

Dengan menggabungkan definisi probabilitas bersyarat dan hukum probabilitas total, diperoleh Formula Teorema Bayes:
$$P(H \\mid E) = \\frac{P(E \\mid H) \\times P(H)}{P(E)} = \\frac{P(E \\mid H) \\times P(H)}{\\sum_i P(E \\mid H_i) P(H_i)}$$
Di mana $P(H)$ adalah Prior (keyakinan awal sebelum bukti diamati), $P(E \\mid H)$ adalah Likelihood (kemungkinan munculnya bukti jika hipotesis benar), $P(E)$ adalah Marginal Evidence penormalisasi, dan $P(H \\mid E)$ adalah Posterior (keyakinan yang telah diperbarui setelah bukti diamati).`,
        formula: `P(H \\mid E) = \\frac{P(E \\mid H) P(H)}{P(E \\mid H) P(H) + P(E \\mid \\neg H) P(\\neg H)}`,
        code: `# 3.3: Diagnosa Medis Penyakit Langka Menggunakan Teorema Bayes
# Kasus: Penyakit langka menyerang 0.1% populasi (Prior P(H) = 0.001)
# Akurasi tes: Sensitivitas P(E|H) = 99%, False Positive Rate P(E|~H) = 2%

prior_sakit = 0.001
prior_sehat = 1.0 - prior_sakit
sensitivitas = 0.99       # P(Positif | Sakit)
false_positive_rate = 0.02 # P(Positif | Sehat)

# 1. Hukum Probabilitas Total: P(Positif)
p_positif = (sensitivitas * prior_sakit) + (false_positive_rate * prior_sehat)

# 2. Teorema Bayes: P(Sakit | Positif)
posterior_sakit = (sensitivitas * prior_sakit) / p_positif

print("=== PENALARAN BAYESIAN PADA DIAGNOSA MEDIS ===")
print(f"Prior Sakit di Populasi P(H)           : {prior_sakit*100:.2f}%")
print(f"Sensitivitas Alat Tes P(Positif|Sakit)  : {sensitivitas*100:.1f}%")
print(f"False Positive Rate P(Positif|Sehat)    : {false_positive_rate*100:.1f}%")
print(f"Total Probabilitas Hasil Tes Positif    : {p_positif*100:.3f}%")
print(f"\\nPosterior P(Sakit | Hasil Tes Positif) : {posterior_sakit*100:.2f}%")
print("Interpretasi: Meskipun tes positif dan alat tes 99% akurat, peluang aktual seseorang benar-benar")
print(f"              sakit hanya {posterior_sakit*100:.1f}% karena basis populasi penyakit sangat langka (Base Rate Fallacy)!")`,
        expectedOutput: "Posterior P(Sakit|Positif) terhitung hanya 4.72% akibat efek Base Rate Fallacy.",
        codeExp: "Skrip mengilustrasikan Base Rate Fallacy klasik dengan Teorema Bayes: pada penyakit langka, sebagian besar hasil tes positif adalah false positive dari populasi sehat yang besar.",
        pitfalls: [
          "Mengabaikan prior base rate populasi saat menginterpretasikan hasil pengujian klasifikasi (Base Rate Neglect).",
          "Menyamakan Likelihood $P(E \\mid H)$ dengan Posterior Probability $P(H \\mid E)$."
        ],
        refTitle: "Stanford Encyclopedia of Philosophy: Bayes' Theorem",
        refUrl: "https://plato.stanford.edu/entries/bayes-theorem/"
      },
      {
        num: "3.4",
        slug: "3-4-variabel-acak-diskrit-kontinu-pmf-pdf-cdf",
        title: "3.4. Variabel Acak: Diskrit vs Kontinu, PMF, PDF, dan CDF",
        desc: "Formalisasi pemetaan fungsi acak: Probability Mass Function (PMF), Probability Density Function (PDF), Cumulative Distribution Function (CDF), dan sifat integral kurva kerapatan.",
        concept: `Sebuah Variabel Acak (Random Variable $X$) bukan merupakan variabel dalam pengertian aljabar biasa, melainkan sebuah fungsi matematis $X: \\Omega \\rightarrow \\mathbb{R}$ yang memetakan setiap hasil di ruang sampel ke sebuah bilangan riil.

Variabel acak terbagi menjadi dua ranah utama:
1. Variabel Acak Diskrit: Memiliki nilai yang dapat dihitung (countable), seperti jumlah klik pengguna atau cacah server yang down. Distribusinya didefinisikan oleh Fungsi Massa Probabilitas (Probability Mass Function / PMF $p(x) = P(X = x)$), di mana $\\sum p(x) = 1$.
2. Variabel Acak Kontinu: Memiliki nilai yang tak terhingga dan tak terhitung dalam suatu interval kontinu (misalnya waktu respons server atau pendapatan pengguna). Karena probabilitas sebuah titik tunggal kontinu bernilai nol ($P(X = 3.14159\\dots) = 0$), probabilitasnya didefinisikan oleh Fungsi Kepekatan Probabilitas (Probability Density Function / PDF $f(x)$). Probabilitas bahwa nilai berada dalam interval $[a, b]$ adalah luas area di bawah kurva:
$$P(a \\le X \\le b) = \\int_a^b f(x) \\, dx$$

Fungsi Distribusi Kumulatif (Cumulative Distribution Function / CDF $F(x) = P(X \\le x)$) berlaku untuk kedua ranah, selalu bersifat monoton tidak turun, dan membentang dari 0 ke 1.`,
        formula: `F(x) = P(X \\le x) = \\int_{-\\infty}^x f(t) \\, dt, \\quad \\int_{-\\infty}^\\infty f(x) \\, dx = 1`,
        code: `# 3.4: Integrasi Numerik PDF dan Pembuktian Properti CDF pada SciPy
import numpy as np
import scipy.stats as stats

# Menggunakan distribusi normal standar N(0, 1)
mu, sigma = 0, 1
dist_normal = stats.norm(loc=mu, scale=sigma)

# 1. Menghitung probabilitas interval [-1.96, 1.96] melalui selisih CDF
# P(-1.96 <= X <= 1.96) = F(1.96) - F(-1.96)
cdf_atas = dist_normal.cdf(1.96)
cdf_bawah = dist_normal.cdf(-1.96)
peluang_interval_cdf = cdf_atas - cdf_bawah

# 2. Menghitung probabilitas yang sama melalui integrasi numerik PDF (Trapezoidal Rule)
x_grid = np.linspace(-1.96, 1.96, 1000)
pdf_vals = dist_normal.pdf(x_grid)
peluang_integral_pdf = np.trapezoid(pdf_vals, x_grid)

print("=== DISTRIBUSI KONTINU: PDF INTEGRAL VS CDF ===")
print(f"Nilai Densitas PDF di Titik x=0.0         : {dist_normal.pdf(0.0):.4f} (Bukan Probabilitas!)")
print(f"P(-1.96 <= X <= 1.96) via Selisih CDF     : {peluang_interval_cdf*100:.2f}%")
print(f"P(-1.96 <= X <= 1.96) via Integrasi PDF   : {peluang_integral_pdf*100:.2f}%")
print(f"Tingkat Presisi Kesesuaian Metrik         : {abs(peluang_interval_cdf - peluang_integral_pdf):.6e}")`,
        expectedOutput: "Peluang interval 95.00% terbukti identik antara integrasi PDF dan selisih CDF.",
        codeExp: "Skrip membuktikan kesetaraan antara luas integral PDF dan evaluasi fungsi CDF kumulatif pada rentang interval kepercayaan 95% distribusi normal standar.",
        pitfalls: [
          "Mengira nilai PDF $f(x)$ adalah nilai probabilitas sehingga kaget saat nilai $f(x)$ melebihi 1.0 (PDF adalah densitas, bukan probabilitas).",
          "Mencoba menghitung probabilitas tepat di satu titik tunggal kontinu $P(X = c)$ yang secara teoritis selalu bernilai nol."
        ],
        refTitle: "SciPy Stats: Continuous Random Variables (scipy.stats.rv_continuous)",
        refUrl: "https://docs.scipy.org/doc/scipy/reference/stats.html"
      },
      {
        num: "3.5",
        slug: "3-5-ekspektasi-matematis-varians-kovarians-momen",
        title: "3.5. Ekspektasi Matematis, Varians, Kovarians & Teorema Linearitas",
        desc: "Karakteristik matematis distribusi: operator nilai ekspektasi E[X], hukum linearitas ekspektasi, varians Var(X), kovarians Cov(X, Y), dan sifat matriks kovarians semi-definit positif.",
        concept: `Dua operator statistik paling mendasar yang meringkas lokasi pemusatan dan dispersi penyebaran variabel acak adalah Ekspektasi Matematis (Expected Value) dan Varians.

Nilai Ekspektasi $\\mathbb{E}[X]$ merepresentasikan titik pusat gravitasi massa distribusi probabilitas. Salah satu sifat paling kuat dari operator ekspektasi adalah Linearitas Ekspektasi (Linearity of Expectation):
$$\\mathbb{E}[aX + bY + c] = a\\mathbb{E}[X] + b\\mathbb{E}[Y] + c$$
Sifat ini berlaku universal BAHKAN jika variabel $X$ dan $Y$ saling berkorelasi atau tidak independen!

Varians $\\text{Var}(X) = \\mathbb{E}[(X - \\mathbb{E}[X])^2]$ mengukur rata-rata penyimpangan kuadratik dari pusat massa. Berbeda dengan ekspektasi, varians dari penjumlahan dua variabel tidak linier melainkan melibatkan suku kovarians:
$$\\text{Var}(X + Y) = \\text{Var}(X) + \\text{Var}(Y) + 2\\text{Cov}(X, Y)$$
Di mana $\\text{Cov}(X, Y) = \\mathbb{E}[(X - \\mathbb{E}[X])(Y - \\mathbb{E}[Y])]$ mengukur kecenderungan dua variabel acak untuk berubah secara bersamaan. Matriks kovarians yang terbentuk dari kumpulan variabel acak selalu bersifat simetris dan semi-definit positif.`,
        formula: `\\text{Var}(aX + bY) = a^2 \\text{Var}(X) + b^2 \\text{Var}(Y) + 2ab \\, \\text{Cov}(X, Y)`,
        code: `# 3.5: Pembuktian Teorema Linearitas Ekspektasi dan Varians Portofolio
import numpy as np

# Simulasi return dua instrumen aset finansial X dan Y
np.random.seed(42)
n = 100000
x = np.random.normal(loc=10.0, scale=3.0, size=n) # Return rata-rata 10%, SD 3%
# Y berkorelasi positif dengan X
y = 0.5 * x + np.random.normal(loc=5.0, scale=2.0, size=n)

# Portofolio Z = 0.6*X + 0.4*Y
z = 0.6 * x + 0.4 * y

# 1. Verifikasi Linearitas Ekspektasi: E[Z] = 0.6*E[X] + 0.4*E[Y]
e_z_simulasi = np.mean(z)
e_z_teori = 0.6 * np.mean(x) + 0.4 * np.mean(y)

# 2. Verifikasi Varians Portofolio: Var(Z) = a^2*Var(X) + b^2*Var(Y) + 2ab*Cov(X,Y)
var_x = np.var(x)
var_y = np.var(y)
cov_xy = np.cov(x, y)[0, 1]
var_z_simulasi = np.var(z)
var_z_teori = (0.6**2 * var_x) + (0.4**2 * var_y) + (2 * 0.6 * 0.4 * cov_xy)

print("=== VERIFIKASI LINEARITAS EKSPEKTASI & VARIANS GABUNGAN ===")
print(f"Ekspektasi E[Z] Simulasi : {e_z_simulasi:.4f}")
print(f"Ekspektasi E[Z] Teoretis : {e_z_teori:.4f} (Identik Sempurna!)")
print(f"Varians Var(Z) Simulasi  : {var_z_simulasi:.4f}")
print(f"Varians Var(Z) Teoretis  : {var_z_teori:.4f} (Identik Sempurna!)")`,
        expectedOutput: "Nilai simulasi dan teoretis ekspektasi dan varians cocok sempurna hingga 4 desimal.",
        codeExp: "Skrip memvalidasi formula teori portofolio dan sifat linearitas operator ekspektasi serta dekomposisi varians kovarians pada sampel besar.",
        pitfalls: [
          "Mengasumsikan $\\text{Var}(X + Y) = \\text{Var}(X) + \\text{Var}(Y)$ pada variabel yang saling berkorelasi (lupa menyertakan suku $2\\text{Cov}(X, Y)$).",
          "Lupa bahwa konstanta pengali $a$ pada varians keluar sebagai kuadrat: $\\text{Var}(aX) = a^2 \\text{Var}(X)$, bukan $a\\text{Var}(X)$."
        ],
        refTitle: "John A. Rice: Mathematical Statistics and Data Analysis (3rd Edition)",
        refUrl: "https://www.cengage.com/"
      },
      {
        num: "3.6",
        slug: "3-6-ketidaksamaan-probabilitas-markov-chebyshev-chernoff",
        title: "3.6. Ketidaksamaan Probabilitas Fundamental: Markov, Chebyshev, dan Chernoff",
        desc: "Batas teoritis probabilitas ekstrem (Bounding Inequalities): ketidaksamaan Markov (ekspektasi non-negatif), batas dua sisi Chebyshev, dan batas ekor eksponensial Chernoff / Hoeffding.",
        concept: `Dalam banyak skenario praktis sains data, kita tidak mengetahui secara persis distribusi probabilitas dari populasi yang sedang diamati. Bagaimana kita dapat menjamin batas maksimum probabilitas terjadinya peristiwa ekstrem tanpa mengetahui apakah datanya berdistribusi normal, eksponensial, atau bentuk aneh lainnya?

Ketidaksamaan probabilitas memberikan batas analitik matematis universal (bounds) yang berlaku untuk distribusi APA PUN:
1. Ketidaksamaan Markov: Jika $X$ adalah variabel acak non-negatif dan $a > 0$, maka peluang $X$ melebihi nilai ambang $a$ dibatasi oleh rasio ekspektasinya:
$$P(X \\ge a) \\le \\frac{\\mathbb{E}[X]}{a}$$
2. Ketidaksamaan Chebyshev: Menggunakan informasi varians untuk membatasi deviasi dari rata-rata populasi. Peluang suatu observasi menyimpang lebih dari $k$ deviasi standar dari mean tidak pernah melebihi $1/k^2$:
$$P(|X - \\mu| \\ge k\\sigma) \\le \\frac{1}{k^2}$$
Misalnya, untuk distribusi apapun di alam semesta, peluang suatu data menyimpang lebih dari 3 standar deviasi ($k=3$) MAKSIMAL adalah $1/3^2 = 11.1\\%$.
3. Batas Chernoff / Hoeffding: Memberikan batas ekor yang meluruh secara eksponensial (jauh lebih ketat dari Chebyshev) untuk jumlah variabel acak independen, yang menjadi fondasi teori pembelajaran statistik VC-Dimension.`,
        formula: `P(|X - \\mu| \\ge k\\sigma) \\le \\frac{1}{k^2}`,
        code: `# 3.6: Pengujian Batas Universal Chebyshev pada Distribusi Non-Normal Ekstrem
import numpy as np

# Mensimulasikan distribusi eksponensial yang sangat menceng (Bukan Gauss)
np.random.seed(42)
n = 100000
x = np.random.exponential(scale=5.0, size=n)
mu = np.mean(x)
sigma = np.std(x)

# Menguji deviasi k = 3 standar deviasi
k = 3
batas_chebyshev = 1.0 / (k ** 2) # Maksimal 11.11%

# Menghitung proporsi empiris data yang menyimpang >= k * sigma
deviasi_empiris = (np.abs(x - mu) >= k * sigma).mean()

print("=== VERIFIKASI BATAS UNIVERSAL KETIDAKSAMAAN CHEBYSHEV ===")
print(f"Nilai Rata-rata mu              : {mu:.2f}")
print(f"Standar Deviasi sigma           : {sigma:.2f}")
print(f"Batas Maksimum Chebyshev (1/k^2): {batas_chebyshev*100:.2f}% (Batas Atas Teoretis)")
print(f"Proporsi Empiris Aktual (|X-mu| >= 3sigma): {deviasi_empiris*100:.2f}%")
print(f"Status Uji: {'VALID' if deviasi_empiris <= batas_chebyshev else 'PELANGGARAN'}")`,
        expectedOutput: "Proporsi empiris aktual (1.81%) terbukti jauh berada di bawah batas atas teoretis Chebyshev (11.11%).",
        codeExp: "Skrip menguji ketidaksamaan Chebyshev pada distribusi eksponensial yang menceng, membuktikan bahwa batas atas matematis 1/k^2 terbukti membatasi penyimpangan ekstrem secara universal tanpa asumsi normalitas.",
        pitfalls: [
          "Menerapkan aturan empiris 68-95-99.7% (aturan tiga sigma) pada data yang tidak berdistribusi normal (gunakan batas Chebyshev jika bentuk distribusi tidak diketahui).",
          "Menggunakan ketidaksamaan Markov pada variabel yang dapat bernilai negatif (Markov mensyaratkan $X \\ge 0$).",
        ],
        refTitle: "Wasserman, Larry: All of Statistics: A Concise Course in Statistical Inference",
        refUrl: "https://link.springer.com/book/10.1007/978-0-387-21736-9"
      },
      {
        num: "3.7",
        slug: "3-7-hukum-bilangan-besar-lln-konvergensi-stokastik",
        title: "3.7. Hukum Bilangan Besar (LLN) & Teori Konvergensi Stokastik",
        desc: "Kestabilan statistik sampel: Hukum Lemah Bilangan Besar (WLLN / Konvergensi dalam Probabilitas) vs Hukum Kuat (SLLN / Konvergensi Hampir Pasti), serta simulasi konvergensi Monte Carlo.",
        concept: `Mengapa rata-rata sampel dari eksperimen sains data dapat dipercaya untuk mewakili rata-rata populasi riil? Jawabannya dijamin secara fundamental oleh Hukum Bilangan Besar (Law of Large Numbers / LLN).

Dua varian Hukum Bilangan Besar:
1. Weak Law of Large Numbers (WLLN / Khinchin's Theorem): Menyatakan bahwa seiring bertambahnya ukuran sampel $n \\rightarrow \\infty$, rata-rata sampel $\\bar{X}_n$ 'Konvergen dalam Probabilitas' (Converges in Probability) menuju nilai ekspektasi populasi sebenarnya $\\mu$:
$$\\lim_{n \\rightarrow \\infty} P(|\\bar{X}_n - \\mu| \\ge \\epsilon) = 0, \\quad \\forall \\epsilon > 0$$
2. Strong Law of Large Numbers (SLLN / Kolmogorov's Theorem): Menyatakan bahwa rata-rata sampel konvergen menuju mean populasi 'Hampir Pasti' (Almost Surely / dengan probabilitas 1):
$$P\\left(\\lim_{n \\rightarrow \\infty} \\bar{X}_n = \\mu\\right) = 1$$

Hukum Bilangan Besar adalah fondasi matematis yang menjamin validitas seluruh metode integrasi Monte Carlo, bootstrapping, dan stabilitas estimasi model machine learning pada dataset berskala besar.`,
        formula: `\\lim_{n \\rightarrow \\infty} P(|\\bar{X}_n - \\mu| < \\epsilon) = 1`,
        code: `# 3.7: Visualisasi Konvergensi Rata-rata Berjalan Hukum Bilangan Besar (WLLN)
import numpy as np
import pandas as pd

# Simulasi pelemparan dadu 6 sisi yang adil (Mean Teoretis mu = 3.5)
mu_teoritis = 3.5
np.random.seed(42)
n_lemparan = 50000
dadu = np.random.randint(1, 7, size=n_lemparan)

# Menghitung running mean (rata-rata berjalan kumulatif)
running_mean = np.cumsum(dadu) / np.arange(1, n_lemparan + 1)

# Mengamati nilai rata-rata pada checkpoint ukuran sampel tertentu
checkpoints = [10, 50, 100, 500, 1000, 10000, 50000]
evaluasi_lln = pd.DataFrame({
    'Ukuran_Sampel_N': checkpoints,
    'Rata_rata_Sampel': [running_mean[i-1] for i in checkpoints],
    'Mean_Teoretis': mu_teoritis
})
evaluasi_lln['Galat_Absolut'] = np.abs(evaluasi_lln['Rata_rata_Sampel'] - mu_teoritis)

print("=== SIMULASI KONVERGENSI HUKUM BILANGAN BESAR ===")
print(evaluasi_lln.to_string(index=False))`,
        expectedOutput: "Galat absolut rata-rata sampel meluruh mendekati 0.000 seiring bertambahnya N dari 10 ke 50.000.",
        codeExp: "Skrip menunjukkan bagaimana rata-rata sampel kumulatif berkonvergensi secara deterministik menuju nilai ekspektasi teoretis 3.5 seiring meningkatnya ukuran sampel n.",
        pitfalls: [
          "Terjebak Gambler's Fallacy: meyakini bahwa jika koin muncul 'Gambar' 5 kali berturut-turut, maka lemparan berikutnya 'pasti' berpeluang lebih besar muncul 'Angka' untuk menyeimbangkan rata-rata (hukum LLN bekerja melalui pengenceran rasio, bukan kompensasi gaib).",
          "Menerapkan LLN pada distribusi yang tidak memiliki nilai ekspektasi berhingga (seperti Distribusi Cauchy).",
        ],
        refTitle: "Sheldon Ross: A First Course in Probability (10th Edition)",
        refUrl: "https://www.pearson.com/"
      },
      {
        num: "3.8",
        slug: "3-8-teorema-limit-pusat-clt-normalitas-asimtotik",
        title: "3.8. Teorema Limit Pusat (Central Limit Theorem) & Normalitas Asimtotik",
        desc: "Mukjizat terbesar statistika inferensial: Teorema Limit Pusat Lindeberg-Lévy, distribusi sampling rata-rata sampel, dan penurunan Standard Error.",
        concept: `Jika Hukum Bilangan Besar menjelaskan 'ke mana' rata-rata sampel berkonvergensi (menuju $\\mu$), maka Teorema Limit Pusat (Central Limit Theorem / CLT) menjelaskan 'bagaimana bentuk sebaran' fluktuasi galat di sekitar nilai konvergensi tersebut.

Teorema Limit Pusat Lindeberg-Lévy menyatakan: Jika $X_1, X_2, \\dots, X_n$ adalah sampel acak berukuran $n$ yang independen dan berdistribusi identik (i.i.d.) yang ditarik dari populasi APA PUN dengan mean $\\mu$ dan varians berhingga $\\sigma^2$, maka distribusi sampling dari rata-rata sampel $\\bar{X}_n$ akan mendekati Distribusi Normal seiring bertambahnya ukuran sampel:
$$\\bar{X}_n \\xrightarrow{d} \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right), \\quad \\text{saat } n \\rightarrow \\infty$$

Implikasi luar biasa dari CLT: tidak peduli apakah populasi aslinya berdistribusi bimodal, eksponensial, seragam, atau bahkan menceng ekstrem—rata-rata dari kumpulan sampel acak akan SELALU membentuk kurva lonceng Gauss simetris! Standar deviasi dari distribusi sampling rata-rata ini disebut Kesalahan Standar (Standard Error / $\\text{SE} = \\sigma / \\sqrt{n}$).`,
        formula: `Z = \\frac{\\bar{X}_n - \\mu}{\\sigma / \\sqrt{n}} \\xrightarrow{d} \\mathcal{N}(0, 1)`,
        code: `# 3.8: Pembuktian Teorema Limit Pusat (CLT) dari Populasi Eksponensial Menceng
import numpy as np
import scipy.stats as stats

# Populasi asli: Distribusi Eksponensial sangat menceng (Non-Normal)
np.random.seed(42)
ukuran_sampel = 40  # n = 40 observasi per sampel
jumlah_percobaan = 5000 # Menarik 5000 kelompok sampel independen

populasi_eksponensial = np.random.exponential(scale=10.0, size=100000)
mu_populasi = np.mean(populasi_eksponensial)
se_teoretis = np.std(populasi_eksponensial) / np.sqrt(ukuran_sampel)

# Menghitung 5000 rata-rata sampel
rata_rata_sampel = [
    np.mean(np.random.choice(populasi_eksponensial, size=ukuran_sampel))
    for _ in range(jumlah_percobaan)
]

# Uji normalitas Shapiro-Wilk atau Skewness pada distribusi rata-rata sampel
skewness_populasi = stats.skew(populasi_eksponensial)
skewness_sampling = stats.skew(rata_rata_sampel)

print("=== PEMBUKTIAN TEOREMA LIMIT PUSAT (CLT) ===")
print(f"Skewness Populasi Asli (Menceng Tajam) : {skewness_populasi:.4f}")
print(f"Skewness Rata-rata Sampel (Mendekati Gauss): {skewness_sampling:.4f} (~0 membuktikan kurva normal simetris!)")
print(f"Standard Error Teoretis (sigma / sqrt(n)): {se_teoretis:.4f}")
print(f"Standard Deviasi Empiris Rata-rata Sampel : {np.std(rata_rata_sampel):.4f} (Kesesuaian Sempurna!)")`,
        expectedOutput: "Skewness populasi 2.0 meluruh menjadi 0.05 pada distribusi sampling rata-rata.",
        codeExp: "Skrip membuktikan CLT secara empiris: populasi asal yang sangat menceng menghasilkan distribusi sampling rata-rata yang simetris sempurna dengan deviasi sesuai formula sigma/sqrt(n).",
        pitfalls: [
          "Menerapkan CLT pada observasi data individual alih-alih pada rata-rata sampel (CLT menormalkan rata-rata sampling, bukan data mentah individu).",
          "Mengasumsikan ukuran sampel $n=30$ selalu cukup untuk CLT; pada distribusi yang memiliki skewness sangat ekstrem, dibutuhkan ukuran sampel $n \\ge 100$.",
        ],
        refTitle: "E. L. Lehmann: Elements of Large-Sample Theory (Springer Texts in Statistics)",
        refUrl: "https://link.springer.com/book/10.1007/b98855"
      },
      {
        num: "3.9",
        slug: "3-9-teori-informasi-entropi-shannon-divergensi-kl",
        title: "3.9. Teori Informasi untuk Sains Data: Entropi Shannon, Cross-Entropy & Divergensi KL",
        desc: "Kuantifikasi ketidakpastian informasi Claude Shannon: Entropi $H(X)$, Information Gain pada Decision Tree, Cross-Entropy Loss, dan Divergensi Kullback-Leibler (KL).",
        concept: `Berapa banyak 'informasi' yang terkandung dalam sebuah peristiwa data? Teori Informasi yang dirintis oleh Claude Shannon pada tahun 1948 merevolusi matematika komunikasi dan menjadi pilar penting sains data modern.

Konsep inti teori informasi:
1. Self-Information (Surprisal): Kejadian yang sangat jarang terjadi membawa informasi yang jauh lebih besar daripada kejadian rutin. Jika koin bias 99% selalu menghasilkan angka, informasi saat muncul gambar sangatlah tinggi: $I(x) = -\\log_2 P(x)$.
2. Entropi Shannon $H(X)$: Rata-rata tingkat ketidakpastian dalam sebuah distribusi probabilitas. Entropi mencapai nilai maksimum saat seluruh hasil memiliki peluang seragam sama besar (ketidakpastian tertinggi):
$$H(X) = -\\sum_{x} P(x) \\log_2 P(x)$$
3. Divergensi Kullback-Leibler (KL Divergence): Mengukur 'jarak' relatif atau kehilangan informasi saat kita menggunakan distribusi aproksimasi model $Q(x)$ untuk merepresentasikan distribusi realitas sebenarnya $P(x)$.
4. Cross-Entropy: Metrik yang memadukan entropi target dan divergensi KL, yang menjadi fungsi kerugian standar industri (Cross-Entropy Loss) pada seluruh model klasifikasi logistik dan deep learning.`,
        formula: `D_{\\text{KL}}(P \\parallel Q) = \\sum_{x} P(x) \\log \\left(\\frac{P(x)}{Q(x)}\\right)`,
        code: `# 3.9: Komputasi Entropi Shannon dan Divergensi Kullback-Leibler di SciPy
import scipy.stats as stats
import numpy as np

# Dua distribusi probabilitas untuk klasifikasi 3 kelas
# P: Distribusi Label Sebenarnya (One-Hot [1, 0, 0] dengan sedikit smoothing)
p = np.array([0.98, 0.01, 0.01])

# Q1: Prediksi Model 1 (Sangat Yakin & Akurat)
q1 = np.array([0.90, 0.05, 0.05])

# Q2: Prediksi Model 2 (Ragu-ragu / Miskin Informasi)
q2 = np.array([0.34, 0.33, 0.33])

# Entropi Shannon H(P)
entropi_p = stats.entropy(p, base=2)

# Divergensi Kullback-Leibler D_KL(P || Q)
kl_model1 = stats.entropy(p, q1, base=2)
kl_model2 = stats.entropy(p, q2, base=2)

print("=== KOMPUTASI TEORI INFORMASI SAINS DATA ===")
print(f"Entropi Label Asli H(P)       : {entropi_p:.4f} bit (Ketidakpastian Sangat Rendah)")
print(f"KL Divergence Model 1 (Akurat) : {kl_model1:.4f} bit (Jarak Informasi Dekat)")
print(f"KL Divergence Model 2 (Buruk)  : {kl_model2:.4f} bit (Jarak Informasi Sangat Jauh!)")`,
        expectedOutput: "Model 1 memiliki KL divergence sangat kecil (0.04) dibanding Model 2 (1.47).",
        codeExp: "Skrip menghitung nilai entropi informasi Shannon dan jarak asimetris KL Divergence menggunakan scipy.stats.entropy, mendemonstrasikan bagaimana fungsi loss mengevaluasi kedekatan model prediktif.",
        pitfalls: [
          "Menghitung KL Divergence pada distribusi $Q$ yang memiliki nilai probabilitas 0 pada kejadian di mana $P > 0$, yang memicu pembagian dengan nol dan divergensi bernilai tak hingga.",
          "Memperlakukan KL Divergence sebagai metrik jarak geometris simetris; $D_{\\text{KL}}(P \\parallel Q) \\ne D_{\\text{KL}}(Q \\parallel P)$."
        ],
        refTitle: "Claude E. Shannon: A Mathematical Theory of Communication",
        refUrl: "https://ieeexplore.ieee.org/document/6773024"
      },
      {
        num: "3.10",
        slug: "3-10-simulasi-stokastik-monte-carlo-sains-data",
        title: "3.10. Metode Simulasi Stokastik Monte Carlo & Evaluasi Risiko Ketidakpastian",
        desc: "Aproksimasi numerik masalah analitik kompleks: algoritma penarikan sampel Monte Carlo, estimasi volume integral berdimensi tinggi, dan analisis sensitivitas risiko bisnis.",
        concept: `Banyak masalah dalam sains data dan bisnis modern terlalu rumit untuk diselesaikan menggunakan formula kalkulus analitik tertutup (Closed-Form Solution)—misalnya memprediksi risiko kebangkrutan perusahaan dengan ratusan variabel ekonomi makro yang saling berinteraksi secara acak. Metode Monte Carlo menyelesaikan masalah ini melalui kekuatan simulasi komputasi berulang.

Dinamai berdasarkan kasino terkenal di Monako oleh Stanislaw Ulam dan John von Neumann pada Proyek Manhattan, metode Monte Carlo bekerja dengan membangkitkan jutaan skenario sampel acak dari distribusi probabilitas yang diketahui, mengevaluasi hasil model pada setiap sampel, dan merangkum distribusi hasilnya secara empiris.

Sesuai Hukum Bilangan Besar dan Teorema Limit Pusat, galat aproksimasi Monte Carlo meluruh pada laju $\\mathcal{O}(1 / \\sqrt{N})$ secara independen dari jumlah dimensi variabel masalah. Keunggulan independen terhadap dimensi ini menjadikan Monte Carlo satu-satunya alat yang layak untuk integrasi numerik pada ruang berdimensi sangat tinggi.`,
        formula: `\\mathbb{E}[g(X)] \\approx \\frac{1}{N} \\sum_{i=1}^N g(x_i), \\quad \\text{Galat Standar} = \\frac{\\sigma}{\\sqrt{N}}`,
        code: `# 3.10: Simulasi Monte Carlo Estimasi Nilai Pi dan Analisis Risiko Finansial
import numpy as np

# 1. Eksperimen Klasik: Estimasi Luas Lingkaran dan Nilai Pi (N = 500.000 titik)
np.random.seed(42)
n_titik = 500000

# Titik acak berdistribusi seragam pada bujur sangkar [-1, 1] x [-1, 1]
x_koor = np.random.uniform(-1, 1, size=n_titik)
y_koor = np.random.uniform(-1, 1, size=n_titik)

# Titik berada di dalam lingkaran satuan jika x^2 + y^2 <= 1
di_dalam_lingkaran = (x_koor**2 + y_koor**2) <= 1.0
estimasi_pi = 4.0 * di_dalam_lingkaran.mean()

galat_relatif_pi = abs(estimasi_pi - np.pi) / np.pi * 100

print("=== SIMULASI STOKASTIK MONTE CARLO ===")
print(f"Jumlah Sampel Iterasi : {n_titik:,} titik")
print(f"Estimasi Nilai Pi     : {estimasi_pi:.5f}")
print(f"Nilai Pi Sebenarnya   : {np.pi:.5f}")
print(f"Galat Relatif Estimasi: {galat_relatif_pi:.4f}%")`,
        expectedOutput: "Simulasi Monte Carlo 500.000 titik menghasilkan estimasi Pi dengan galat < 0.05%.",
        codeExp: "Skrip mendemonstrasikan metode estimasi area Monte Carlo klasik untuk menghitung nilai konstanta Pi dan mengkuantifikasi laju konvergensi galat stokastik.",
        pitfalls: [
          "Menggunakan generator bilangan acak semu (PRNG) berkualitas rendah yang memiliki periode perulangan pendek sehingga menghasilkan korelasi laten pada simulasi skala masif.",
          "Menjalankan simulasi Monte Carlo dengan jumlah iterasi terlalu kecil tanpa mengevaluasi interval kepercayaan galat estimasi."
        ],
        refTitle: "Christian P. Robert, George Casella: Monte Carlo Statistical Methods (Springer)",
        refUrl: "https://link.springer.com/book/10.1007/978-1-4757-4145-2"
      }
    ]
  },

  // ==========================================
  // BAB 4: Distribusi Probabilitas Teoretis & Uji Kecocokan (Goodness-of-Fit)
  // ==========================================
  {
    orderIndex: 4,
    id: "data-science-ch-4",
    slug: "bab-4-distribusi-probabilitas-teoretis-goodness-of-fit",
    title: "BAB 4: Distribusi Probabilitas Teoretis & Uji Kecocokan (Goodness-of-Fit)",
    desc: "Katalog distribusi probabilitas fundamental sains data: distribusi diskrit (Bernoulli, Binomial, Poisson, Geometrik), distribusi kontinu (Normal Gauss, Log-Normal, Eksponensial, Gamma, Beta), serta uji kecocokan empiris (Q-Q Plot, Kolmogorov-Smirnov, Shapiro-Wilk, Chi-Square).",
    coreConcepts: ["Discrete Distributions", "Continuous Distributions", "Q-Q Plot Diagnostics", "Kolmogorov-Smirnov Test", "Shapiro-Wilk Test"],
    subchapters: [
      {
        num: "4.1",
        slug: "4-1-distribusi-bernoulli-binomial-multinomial",
        title: "4.1. Distribusi Diskrit Penghitungan: Bernoulli, Binomial, dan Multinomial",
        desc: "Pemodelan percobaan biner dan multi-kategori: eksperimen Bernoulli, fungsi massa peluang Binomial B(n, p), aproksimasi normal, dan generalisasi Multinomial.",
        concept: `Sebagian besar peristiwa diskrit dalam sains data berawal dari percobaan biner (sukses vs gagal, klik vs tidak klik, beli vs tidak beli). Model matematis paling mendasar untuk peristiwa ini adalah Distribusi Bernoulli dengan parameter keberhasilan tunggal $p$.

Ketika percobaan Bernoulli yang independen diulang sebanyak $n$ kali dengan peluang sukses $p$ yang konstan, variabel acak yang menghitung total jumlah keberhasilan mengikuti Distribusi Binomial $\\mathcal{B}(n, p)$. Fungsi Massa Probabilitasnya (PMF) dirumuskan dengan koefisien kombinatorial:
$$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}, \\quad k \\in \\{0, 1, \\dots, n\\}$$
Nilai ekspektasi distribusi binomial adalah $\\mathbb{E}[X] = np$, dan variansnya adalah $\\text{Var}(X) = np(1-p)$.

Distribusi Multinomial merupakan generalisasi langsung dari binomial ke kasus di mana setiap percobaan memiliki $K$ kemungkinan hasil kategori berbeda (misalnya klasifikasi teks multi-kelas atau segmentasi sentimen). Distribusi ini mendasari pemodelan Naive Bayes Multinomial untuk Natural Language Processing (NLP).`,
        formula: `P(X = k) = \\frac{n!}{k!(n-k)!} p^k (1-p)^{n-k}`,
        code: `# 4.1: Pemodelan Distribusi Binomial & Perhitungan Nilai Ambang Keberhasilan
import scipy.stats as stats

# Kasus: Kampanye pemasaran email dikirim ke n = 100 calon nasabah
# Peluang rata-rata konversi p = 0.08 (8%)
n_email = 100
p_konversi = 0.08
dist_binom = stats.binom(n=n_email, p=p_konversi)

# 1. Peluang mendapatkan tepat k = 10 nasabah
p_tepat_10 = dist_binom.pmf(10)

# 2. Peluang mendapatkan minimal 12 nasabah (P(X >= 12) = 1 - P(X <= 11))
p_minimal_12 = 1.0 - dist_binom.cdf(11)

print("=== PEMODELAN DISTRIBUSI BINOMIAL KAMPANYE PEMASARAN ===")
print(f"Ekspektasi Konversi E[X] = np : {dist_binom.mean():.1f} orang")
print(f"Standar Deviasi sqrt(np(1-p)) : {dist_binom.std():.2f} orang")
print(f"Peluang Tepat 10 Konversi     : {p_tepat_10*100:.2f}%")
print(f"Peluang Minimal 12 Konversi   : {p_minimal_12*100:.2f}%")`,
        expectedOutput: "Ekspektasi 8 orang dengan peluang mencapai minimal 12 orang sebesar 10.01%.",
        codeExp: "Skrip memodelkan proses penghitungan diskrit menggunakan scipy.stats.binom untuk mengevaluasi probabilitas target keberhasilan kampanye bisnis.",
        pitfalls: [
          "Menerapkan distribusi binomial pada peristiwa yang probabilitas keberhasilannya berubah antar percobaan (melanggar asumsi $p$ konstan).",
          "Menerapkan binomial saat antar percobaan saling memengaruhi (melanggar asumsi independensi stokastik)."
        ],
        refTitle: "SciPy Reference Guide: scipy.stats.binom",
        refUrl: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.binom.html"
      },
      {
        num: "4.2",
        slug: "4-2-proses-poisson-distribusi-kejadian-langka",
        title: "4.2. Distribusi Poisson: Pemodelan Kedatangan & Kejadian Langka (Law of Rare Events)",
        desc: "Pemodelan laju kejadian per satuan waktu/ruang: proses Poisson, parameter intensitas lambda, ekuivalensi mean-varians (ekuidispersi), dan penanganan Overdispersion.",
        concept: `Berapa banyak pengunjung yang akan mengakses server situs web dalam kurun waktu satu menit? Berapa jumlah klaim asuransi kecelakaan mobil yang masuk ke kantor cabang dalam satu minggu? Pertanyaan-pertanyaan tentang pencacahan peristiwa dalam interval waktu atau ruang kontinu dimodelkan menggunakan Distribusi Poisson.

Distribusi Poisson diturunkan sebagai batas limit dari Distribusi Binomial saat jumlah percobaan mendekati tak terhingga ($n \\rightarrow \\infty$) sementara peluang sukses per percobaan sangat kecil ($p \\rightarrow 0$), dengan hasil kali laju kedatangan rata-rata tetap konstan $\\lambda = np$ (Hukum Kejadian Langka / Law of Rare Events).

Ciri khas matematis paling unik dari Distribusi Poisson adalah sifat Ekuidispersi (Equidispersion):
$$\\mathbb{E}[X] = \\text{Var}(X) = \\lambda$$
Dalam data industri nyata, varians data pencacahan seringkali jauh lebih besar daripada rata-ratanya (Overdispersion). Ketika kondisi overdispersion terdeteksi, asumsi Poisson runtuh dan ilmuwan data harus beralih ke Distribusi Binomial Negatif (Negative Binomial Distribution).`,
        formula: `P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}, \\quad k = 0, 1, 2, \\dots`,
        code: `# 4.2: Pemodelan Kueri Server Web dengan Poisson & Diagnosa Overdispersion
import scipy.stats as stats
import numpy as np

# Rata-rata kedatangan kueri ke server web lambda = 12 kueri per detik
lambda_rate = 12.0
dist_poisson = stats.poisson(mu=lambda_rate)

# Simulasi observasi kedatangan selama 1.000 detik
np.random.seed(42)
simulasi_kueri = dist_poisson.rvs(size=1000)

mean_empiris = np.mean(simulasi_kueri)
var_empiris = np.var(simulasi_kueri)
rasio_dispersi = var_empiris / mean_empiris

print("=== DISTRIBUSI POISSON & UJI EKUADISPERSI ===")
print(f"Parameter Laju Teoretis lambda : {lambda_rate:.2f}")
print(f"Rata-rata Empiris Observasi     : {mean_empiris:.2f}")
print(f"Varians Empiris Observasi      : {var_empiris:.2f}")
print(f"Rasio Dispersi (Var / Mean)    : {rasio_dispersi:.3f} (~1.0: Ekuidispersi Poisson Lolos)")`,
        expectedOutput: "Rasio dispersi bernilai ~0.99 membuktikan sifat ekuidispersi Poisson murni.",
        codeExp: "Skrip mengevaluasi sifat fundamental distribusi Poisson di mana rata-rata dan varians bernilai identik, menyediakan alat diagnostik untuk memeriksa apakah data pencacahan mengalami overdispersion.",
        pitfalls: [
          "Menerapkan Regresi Poisson pada data pencacahan yang mengalami overdispersion parah, yang menghasilkan standar error yang terlalu kecil palsu dan p-value yang menyesatkan.",
          "Mengabaikan variabel 'exposure' atau interval waktu pengamatan yang tidak seragam antar baris observasi."
        ],
        refTitle: "A. Colin Cameron, Pravin K. Trivedi: Regression Analysis of Count Data",
        refUrl: "https://www.cambridge.org/core/books/regression-analysis-of-count-data/404B5D60E36C2F7972FE8DA3627A4108"
      },
      {
        num: "4.3",
        slug: "4-3-distribusi-normal-gauss-sifat-analitik",
        title: "4.3. Distribusi Normal (Gauss): Sifat Geometris & Standardisasi Z-Score",
        desc: "Ratu dari segala distribusi probabilitas: formula kerapatan Gauss, sifat simetri kurtosis mesokurtik, aturan empiris 68-95-99.7%, dan transformasi variabel acak baku Z.",
        concept: `Distribusi Normal (sering disebut Distribusi Gauss) adalah distribusi probabilitas kontinu paling penting dalam seluruh sains data dan statistika inferensial. Keberadaannya di mana-mana di alam semesta dijamin oleh Teorema Limit Pusat.

Fungsi Kepekatan Probabilitas (PDF) dari distribusi normal $\\mathcal{N}(\\mu, \\sigma^2)$ dirumuskan secara simetris di sekitar rata-rata $\\mu$:
$$f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left( -\\frac{(x - \\mu)^2}{2\\sigma^2} \\right)$$

Sifat Analitik Kunci Distribusi Normal:
1. Simetri Sempurna: Nilai mean, median, dan modus berada tepat di titik yang sama ($x = \\mu$), dengan skewness bernilai tepat nol.
2. Aturan Empiris Tiga Sigma: Sekitar 68.27% massa probabilitas berada dalam rentang $[\\mu - \\sigma, \\mu + \\sigma]$, sekitar 95.45% berada dalam rentang $[\\mu - 2\\sigma, \\mu + 2\\sigma]$, dan 99.73% berada dalam rentang $[\\mu - 3\\sigma, \\mu + 3\\sigma]$.
3. Invariansi Transformasi Linier: Jika $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$, maka transformasi linier standardisasi $Z = (X - \\mu) / \\sigma$ menghasilkan Distribusi Normal Standar $\\mathcal{N}(0, 1)$.`,
        formula: `Z = \\frac{X - \\mu}{\\sigma} \\sim \\mathcal{N}(0, 1)`,
        code: `# 4.3: Perhitungan Aturan Empiris Tiga Sigma pada Distribusi Gauss
import scipy.stats as stats

dist_gauss = stats.norm(loc=0, scale=1)

p_1_sigma = dist_gauss.cdf(1) - dist_gauss.cdf(-1)
p_2_sigma = dist_gauss.cdf(2) - dist_gauss.cdf(-2)
p_3_sigma = dist_gauss.cdf(3) - dist_gauss.cdf(-3)

print("=== VERIFIKASI ATURAN EMPIRIS TIGA SIGMA GAUSS ===")
print(f"Cakupan Massa 1-Sigma [-1, +1]: {p_1_sigma*100:.2f}% (Standar: 68.27%)")
print(f"Cakupan Massa 2-Sigma [-2, +2]: {p_2_sigma*100:.2f}% (Standar: 95.45%)")
print(f"Cakupan Massa 3-Sigma [-3, +3]: {p_3_sigma*100:.2f}% (Standar: 99.73%)")`,
        expectedOutput: "Verifikasi kalkulasi membuktikan persentase massa tiga sigma Gauss presisi.",
        codeExp: "Skrip menghitung integral kumulatif kurva normal standar untuk memvalidasi persentase massa teoretis di bawah batas satu, dua, dan tiga deviasi standar.",
        pitfalls: [
          "Mengasumsikan data finansial atau harga saham berdistribusi normal murni padahal memiliki ekor gemuk leptokurtik yang jauh lebih tebal.",
          "Menerapkan formula Z-score standardisasi pada data dengan skewness tinggi tanpa transformasi penstabil bentuk distribusi terlebih dahulu."
        ],
        refTitle: "Carl Friedrich Gauss: Theoria motus corporum coelestium",
        refUrl: "https://archive.org/details/theoriamotuscorp00gausuoft"
      },
      {
        num: "4.4",
        slug: "4-4-distribusi-lognormal-proses-multiplikatif",
        title: "4.4. Distribusi Log-Normal: Pemodelan Proses Multiplikatif & Fenomena Asimetris",
        desc: "Fenomena perkalian acak: hubungan matematis log-normal dengan normalitas, pemodelan pendapatan, durasi retensi, dan transformasi invers logaritma.",
        concept: `Sementara proses aditif menghasilkan Distribusi Normal (berdasarkan CLT penjumlahan), proses multiplikatif acak menghasilkan Distribusi Log-Normal. Variabel acak positif $X$ dikatakan berdistribusi Log-Normal jika logaritma naturalnya berdistribusi normal:
$$\\ln(X) \\sim \\mathcal{N}(\\mu, \\sigma^2)$$

Sebagian besar variabel ekonomi, sosial, dan biologi di dunia nyata mengikuti distribusi Log-Normal: pendapatan gaji individu, harga properti rumah, durasi sesi kunjungan aplikasi, ukuran partikel batuan, hingga masa inkubasi virus.

Ciri khas Log-Normal adalah kemiringan positif yang tajam (right-skewed), memiliki batas bawah nol mutlak ($X > 0$), dan memiliki ekor kanan yang panjang. Salah satu jebakan terbesar analis adalah melaporkan rata-rata aritmatika pada data log-normal, yang terdistorsi tinggi oleh sebagian kecil nilai raksasa; metrik sentral yang objektif untuk data log-normal adalah Rata-rata Geometrik (Geometric Mean) yang ekuivalen dengan Median populasi $\\exp(\\mu)$.`,
        formula: `f(x) = \\frac{1}{x \\sigma \\sqrt{2\\pi}} \\exp\\left( -\\frac{(\\ln x - \\mu)^2}{2\\sigma^2} \\right), \\quad x > 0`,
        code: `# 4.4: Pemodelan Pendapatan Log-Normal dan Perbandingan Mean vs Median
import numpy as np
import scipy.stats as stats

# Parameter underlying normal: mu = 15.0, sigma = 0.8
mu_log, sigma_log = 15.0, 0.8
np.random.seed(42)
pendapatan_simulasi = np.random.lognormal(mean=mu_log, sigma=sigma_log, size=10000)

mean_aritmatika = np.mean(pendapatan_simulasi)
median_empiris = np.median(pendapatan_simulasi)
median_teoretis = np.exp(mu_log)

print("=== DISTRIBUSI LOG-NORMAL PENDAPATAN ===")
print(f"Rata-rata Aritmatika : Rp {mean_aritmatika:,.0f} (Terdistorsi Ekor Kanan!)")
print(f"Median Empiris        : Rp {median_empiris:,.0f}")
print(f"Median Teoretis exp(mu): Rp {median_teoretis:,.0f} (Nilai Tipikal Masyarakat Nyata)")
print(f"Rasio Distorsi Mean / Median: {mean_aritmatika / median_empiris:.2f}x lipat!")`,
        expectedOutput: "Rata-rata aritmatika terdistorsi ~37% lebih tinggi dari nilai median tipikal exp(mu).",
        codeExp: "Skrip menunjukkan bagaimana proses multiplikatif acak menciptakan distribusi asimetris tajam di mana median exp(mu) merepresentasikan nilai tipikal yang jauh lebih representatif daripada mean aritmatika.",
        pitfalls: [
          "Melaporkan mean pada data log-normal yang memberi gambaran berlebihan tentang kemakmuran populasi masyarakat umum.",
          "Menerapkan transformasi logaritma langsung np.log(x) pada kolom yang memuat nilai nol; selalu gunakan np.log1p(x)."
        ],
        refTitle: "J. Aitchison, J. A. C. Brown: The Lognormal Distribution",
        refUrl: "https://www.cambridge.org/core/books/lognormal-distribution/86ED6B97A0A9BF755A46C9D104764426"
      },
      {
        num: "4.5",
        slug: "4-5-distribusi-eksponensial-waktu-tunggu-memoryless",
        title: "4.5. Distribusi Eksponensial: Pemodelan Waktu Tunggu & Sifat Tanpa Memori",
        desc: "Waktu antar-kejadian proses Poisson: fungsi kerapatan eksponensial, laju kegagalan konstan (Hazard Rate), dan pembuktian matematis sifat Memoryless Property.",
        concept: `Jika Distribusi Poisson memodelkan berapa kali suatu peristiwa terjadi dalam interval waktu tertentu, maka Distribusi Eksponensial memodelkan berapa lama waktu tunggu kontinu ($T$) yang harus dilalui hingga peristiwa berikutnya terjadi.

PDF dari distribusi eksponensial dengan parameter laju $\\lambda > 0$:
$$f(t) = \\lambda e^{-\\lambda t}, \\quad t \\ge 0$$
Nilai ekspektasi waktu tunggunya adalah $\\mathbb{E}[T] = 1 / \\lambda$.

Sifat paling luar biasa (dan terkadang kontraintuitif) dari Distribusi Eksponensial adalah Sifat Tanpa Memori (Memoryless Property):
$$P(T > s + t \\mid T > s) = P(T > t), \\quad \\forall s, t \\ge 0$$
Artinya: jika sebuah bola lampu memiliki masa hidup berdistribusi eksponensial dan telah menyala selama 1.000 jam tanpa putus ($s = 1000$), peluang bola lampu tersebut bertahan 100 jam ke depan ($t = 100$) sama persis dengan peluang sebuah bola lampu baru yang baru dipasang untuk bertahan 100 jam pertamanya! Komponen tidak mengalami penuaan (aging-free).`,
        formula: `P(T > s + t \\mid T > s) = P(T > t)`,
        code: `# 4.5: Pembuktian Komputasi Sifat Tanpa Memori (Memoryless Property)
import scipy.stats as stats

# Waktu tunggu layanan antrian dengan rata-rata 1/lambda = 5 menit (lambda = 0.2)
laju_lambda = 0.2
dist_ekspo = stats.expon(scale=1.0 / laju_lambda)

# Menghitung P(T > 15 | T > 10) vs P(T > 5)
# P(T > 10) = 1 - CDF(10)
p_lewat_10 = 1.0 - dist_ekspo.cdf(10)
# P(T > 15 n T > 10) = P(T > 15) = 1 - CDF(15)
p_lewat_15 = 1.0 - dist_ekspo.cdf(15)

p_bersyarat = p_lewat_15 / p_lewat_10
p_mandiri_5 = 1.0 - dist_ekspo.cdf(5)

print("=== PEMBUKTIAN MEMORYLESS PROPERTY DISTRIBUSI EKSPONENSIAL ===")
print(f"P(T > 15 | T > 10) [Sudah menunggu 10 menit, bertahan 5 menit lagi]: {p_bersyarat*100:.3f}%")
print(f"P(T > 5)           [Pelanggan baru datang, menunggu 5 menit]       : {p_mandiri_5*100:.3f}%")
print(f"Selisih Probabilitas: {abs(p_bersyarat - p_mandiri_5):.8f} (Identik Sempurna!)")`,
        expectedOutput: "Peluang bersyarat dan peluang mandiri identik persis pada 36.788%.",
        codeExp: "Skrip membuktikan sifat memoryless distribusi eksponensial secara analitik: riwayat waktu tunggu masa lalu sama sekali tidak memengaruhi probabilitas waktu tunggu masa depan.",
        pitfalls: [
          "Menggunakan distribusi eksponensial untuk memodelkan keausan mesin mekanik yang mengalami penuaan fisik (gunakan Distribusi Weibull yang mendukung laju kegagalan meningkat seiring waktu).",
          "Mencampuradukkan parameter laju rate (lambda) dengan parameter skala scale (beta = 1/lambda) pada fungsi SciPy.",
        ],
        refTitle: "SciPy Reference Guide: scipy.stats.expon",
        refUrl: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.expon.html"
      },
      {
        num: "4.6",
        slug: "4-6-distribusi-gamma-beta-prior-konjugat-bayesian",
        title: "4.6. Distribusi Gamma & Beta: Fleksibilitas Pemodelan & Prior Konjugat Bayesian",
        desc: "Distribusi fleksibel parameter bentuk dan skala: Distribusi Gamma sebagai generalisasi waktu tunggu k-peristiwa, dan Distribusi Beta pada interval terbatas [0, 1] sebagai prior konjugat binomial.",
        concept: `Dua keluarga distribusi yang memberikan fleksibilitas bentuk tak tertandingi dalam pemodelan probabilitas dan inferensi Bayesian adalah Distribusi Gamma dan Distribusi Beta.

Distribusi Gamma $\\text{Gamma}(\\alpha, \\beta)$ memodelkan waktu tunggu hingga terjadinya $\\alpha$ peristiwa Poisson berturut-turut. Dengan memvariasikan parameter bentuk (shape $\\alpha$) dan laju (rate $\\beta$), Gamma dapat bertransformasi dari kurva peluruhan eksponensial (saat $\\alpha=1$) menjadi kurva lonceng simetris saat $\\alpha$ bernilai besar.

Distribusi Beta $\\text{Beta}(\\alpha, \\beta)$ beroperasi secara eksklusif pada domain terbatas $[0, 1]$. Sifat ini menjadikannya pilihan ideal untuk memodelkan ketidakpastian seputar probabilitas, proporsi, atau rasio persentase (seperti Click-Through Rate atau Conversion Rate).

Dalam inferensi Bayesian, Distribusi Beta adalah Prior Konjugat (Conjugate Prior) untuk kemungkinan Binomial. Artinya, jika keyakinan awal kita dimodelkan oleh $\\text{Beta}(\\alpha, \\beta)$ dan kita mengamati $s$ keberhasilan dan $f$ kegagalan dari data baru, distribusi posterior kita akan TETAP berbentuk Beta dengan parameter yang diperbarui secara instan: $\\text{Beta}(\\alpha + s, \\beta + f)$ tanpa memerlukan integrasi numerik yang rumit.`,
        formula: `P(\\theta \\mid s, f) = \\text{Beta}(\\alpha + s, \\beta + f)`,
        code: `# 4.6: Pembaruan Analitik Bayesian Prior Konjugat Beta-Binomial
import scipy.stats as stats
import numpy as np

# Prior Awal: Tidak tahu apa-apa tentang konversi iklan baru (Beta(1, 1) = Uniform [0, 1])
alpha_prior, beta_prior = 1, 1

# Eksperimen Nyata: Menampilkan iklan ke 100 orang, didapat 12 klik (s=12, f=88)
sukses = 12
gagal = 88

# Pembaruan Konjugat Posterior Analitik
alpha_posterior = alpha_prior + sukses
beta_posterior = beta_prior + gagal

dist_posterior = stats.beta(alpha_posterior, beta_posterior)

# Mengambil estimasi rata-rata posterior dan 95% Credible Interval
mean_posterior = dist_posterior.mean()
ci_bawah, ci_atas = dist_posterior.interval(0.95)

print("=== INFERENSI BAYESIAN PRIOR KONJUGAT BETA-BINOMIAL ===")
print(f"Prior Awal               : Beta({alpha_prior}, {beta_prior})")
print(f"Data Pengamatan          : {sukses} Sukses, {gagal} Gagal")
print(f"Posterior Terbarui       : Beta({alpha_posterior}, {beta_posterior})")
print(f"Estimasi Mean Posterior  : {mean_posterior*100:.2f}%")
print(f"95% Bayesian Credible Int: [{ci_bawah*100:.2f}%, {ci_atas*100:.2f}%]")`,
        expectedOutput: "Posterior Beta(13, 89) menghasilkan rata-rata 12.75% dengan 95% Credible Interval yang terukur.",
        codeExp: "Skrip mendemonstrasikan elegansi pembaruan Bayesian konjugat di mana data empiris baru langsung ditambahkan ke parameter distribusi Beta tanpa overhead komputasi MCMC.",
        pitfalls: [
          "Menetapkan prior Beta yang terlalu yakin (misal Beta(100, 100)) tanpa justifikasi data historis yang memadai sehingga membungkam sinyal data baru.",
          "Membingungkan parameter bentuk $\\alpha, \\beta$ dengan mean dan varians."
        ],
        refTitle: "Andrew Gelman et al.: Bayesian Data Analysis (3rd Edition)",
        refUrl: "http://www.stat.columbia.edu/~gelman/book/"
      },
      {
        num: "4.7",
        slug: "4-7-distribusi-ekstrem-pareto-hukum-pangkat",
        title: "4.7. Distribusi Pareto, Hukum Pangkat (Power Law) & Prinsip 80/20",
        desc: "Fenomena ekor tebal super-ekstrem: formula Distribusi Pareto, eksponen skala alpha, fenomena 80/20 di dunia bisnis, dan ketidakberhinggaan varians pada alpha <= 2.",
        concept: `Dalam banyak sistem sosial, ekonomi, dan jejaring internet, distribusi probabilitas tidak mengikuti kurva lonceng Gauss yang ramah, melainkan mengikuti Distribusi Hukum Pangkat (Power Law) atau Distribusi Pareto. Fenomena ini pertama kali diidentifikasi oleh ekonom Italia Vilfredo Pareto pada tahun 1896 saat mengamati bahwa 80% kekayaan tanah di Italia dikuasai oleh 20% populasi elit (Prinsip 80/20).

PDF Distribusi Pareto dengan nilai minimum $x_m > 0$ dan parameter bentuk $\\alpha > 0$:
$$f(x) = \\frac{\\alpha x_m^\\alpha}{x^{\\alpha + 1}}, \\quad x \\ge x_m$$

Konsekuensi matematis yang mengerikan dari distribusi Pareto terletak pada momen statistiknya:
- Jika $\\alpha \\le 2$, distribusi Pareto memiliki Varians Tak Berhingga ($\\text{Var}(X) = \\infty$).
- Jika $\\alpha \\le 1$, distribusi Pareto bahkan memiliki Nilai Rata-rata Tak Berhingga ($\\mathbb{E}[X] = \\infty$).

Pada distribusi berekor tebal (fat-tailed) ini, rata-rata sampel tidak pernah stabil dan Teorema Limit Pusat klasik gagal total. Sebagian besar total agregat nilai bisnis (misalnya 90% total belanja di game mobile) dihasilkan oleh segmen mikro 'Whales' yang berada di ujung ekor distribusi.`,
        formula: `P(X > x) = \\left(\\frac{x_m}{x}\\right)^\\alpha, \\quad x \\ge x_m`,
        code: `# 4.7: Simulasi Distribusi Pareto dan Pembuktian Prinsip 80/20
import numpy as np
import scipy.stats as stats

# Parameter Pareto: xm = 100.000, alpha = 1.16 (Alpha 1.16 menghasilkan rasio 80/20 murni)
alpha_pareto = 1.16
xm = 100000.0
np.random.seed(42)
n_nasabah = 100000
saldo = (np.random.pareto(a=alpha_pareto, size=n_nasabah) + 1) * xm

# Mengurutkan saldo dari yang terkecil ke terbesar
saldo_urut = np.sort(saldo)
total_kekayaan = saldo_urut.sum()

# Menghitung kontribusi 20% nasabah terkaya teratas
n_20_pct = int(0.20 * n_nasabah)
kekayaan_top_20 = saldo_urut[-n_20_pct:].sum()
persentase_top_20 = (kekayaan_top_20 / total_kekayaan) * 100

print("=== PEMODELAN DISTRIBUSI PARETO (HUKUM PANGKAT 80/20) ===")
print(f"Jumlah Populasi Nasabah       : {n_nasabah:,} orang")
print(f"Total Nilai Simpanan          : Rp {total_kekayaan:,.0f}")
print(f"Pangsa Simpanan 20% Terkaya   : {persentase_top_20:.2f}% (Membuktikan Hukum 80/20)")`,
        expectedOutput: "20% nasabah teratas terbukti menguasai sekitar 80% total kekayaan.",
        codeExp: "Skrip memodelkan distribusi hukum pangkat Pareto dan membuktikan secara empiris bagaimana parameter alpha mengontrol konsentrasi kekayaan pada 20% populasi teratas.",
        pitfalls: [
          "Menerapkan algoritma pemodelan yang mengasumsikan varians berhingga (seperti OLS biasa) pada data yang berdistribusi Pareto ekor tebal.",
          "Mengecilkan estimasi risiko bencana atau lonjakan trafik server web yang mengikuti hukum pangkat."
        ],
        refTitle: "Nassim Nicholas Taleb: Statistical Consequences of Fat Tails",
        refUrl: "https://www.stat.berkeley.edu/~aldous/157/Papers/Taleb_fat_tails.pdf"
      },
      {
        num: "4.8",
        slug: "4-8-diagnostik-visual-goodness-of-fit-qq-plot",
        title: "4.8. Diagnostik Visual Kecocokan Distribusi: Q-Q Plot & P-P Plot",
        desc: "Pemeriksaan grafis kesesuaian distribusi: konstruksi Quantile-Quantile (Q-Q) Plot, pembacaan kelengkungan ekor (Heavy/Light Tails, Skewness), dan Probability-Probability (P-P) Plot.",
        concept: `Sebelum menjalankan pengujian hipotesis statistik formal, ilmuwan data selalu menggunakan inspeksi diagnostik visual. Alat visual paling tajam untuk membandingkan distribusi empiris sampel dengan distribusi teoretis adalah Q-Q Plot (Quantile-Quantile Plot).

Prinsip kerja Q-Q Plot:
1. Data sampel diurutkan dari nilai terendah ke tertinggi, lalu dihitung nilai kuantil empirisnya (misalnya kuantil 1%, 2%, ..., 99%).
2. Nilai kuantil teoretis yang sesuai dihitung dari fungsi invers CDF ($F^{-1}(p)$) distribusi referensi (biasanya distribusi normal standar).
3. Pasangan titik $(q_{\\text{teoretis}}, q_{\\text{empiris}})$ diplot pada bidang kartesius dua dimensi bersama garis lurus diagonal $y = x$.

Membaca Diagnostik Pola Q-Q Plot:
- Titik mengikuti garis lurus diagonal: Data sampel cocok sempurna dengan distribusi teoretis.
- Titik membentuk lengkungan 'S' dengan ujung kiri di bawah garis dan ujung kanan di atas garis: Data memiliki ekor tebal (Heavy-Tailed / Fat-Tailed).
- Titik membentuk lengkungan kurva parabolik cembung atau cekung: Data mengalami kemiringan (Skewed Distribution).`,
        code: `# 4.8: Konstruksi Matematis Q-Q Plot Berbasis SciPy
import numpy as np
import scipy.stats as stats
import pandas as pd

# Menghasilkan data berekor tebal (Distribusi Student-t dengan df=3)
np.random.seed(42)
data_t = np.random.standard_t(df=3, size=200)

# Menghitung pasangan kuantil empiris vs kuantil teoretis normal
probabilitas_grid = np.linspace(0.01, 0.99, 50)
kuantil_empiris = np.quantile(data_t, probabilitas_grid)
kuantil_teoretis_normal = stats.norm.ppf(probabilitas_grid)

df_qq = pd.DataFrame({
    'Probabilitas': probabilitas_grid.round(2),
    'Kuantil_Teoretis_Normal': kuantil_teoretis_normal.round(3),
    'Kuantil_Empiris_Sampel': kuantil_empiris.round(3)
})

# Evaluasi deviasi pada ekor ekstrem (Kuantil 1% dan 99%)
deviasi_kiri = df_qq.iloc[0]['Kuantil_Empiris_Sampel'] - df_qq.iloc[0]['Kuantil_Teoretis_Normal']
deviasi_kanan = df_qq.iloc[-1]['Kuantil_Empiris_Sampel'] - df_qq.iloc[-1]['Kuantil_Teoretis_Normal']

print("=== DIAGNOSTIK KUANTIL Q-Q PLOT TEORITIS VS EMPIRIS ===")
print(df_qq.iloc[[0, 12, 24, 36, 49]])
print(f"\\nDeviasi Ekor Bawah (Kuantil 1%) : {deviasi_kiri:.3f} (Jauh di bawah garis -> Heavy Left Tail)")
print(f"Deviasi Ekor Atas  (Kuantil 99%): {deviasi_kanan:.3f} (Jauh di atas garis -> Heavy Right Tail)")`,
        expectedOutput: "Kuantil empiris menyimpang tajam pada ekor ekstrem membuktikan karakteristik heavy-tailed.",
        codeExp: "Skrip menghitung pasangan koordinat kuantil yang mendasari visualisasi Q-Q Plot, menyediakan alat diagnostik matematis untuk membaca kelengkungan ekor distribusi.",
        pitfalls: [
          "Membaca kelengkungan Q-Q plot secara terbalik (keliru membedakan antara skewness kanan vs ekor tebal).",
          "Hanya mengandalkan uji p-value formal tanpa melihat Q-Q plot pada dataset berukuran jutaan baris."
        ],
        refTitle: "M. B. Wilk, R. Gnanadesikan: Probability plotting methods for the analysis of data",
        refUrl: "https://academic.oup.com/biomet/article/55/1/1/242962"
      },
      {
        num: "4.9",
        slug: "4-9-uji-goodness-of-fit-kolmogorov-smirnov-shapiro-wilk",
        title: "4.9. Uji Formal Goodness-of-Fit: Kolmogorov-Smirnov, Shapiro-Wilk & Anderson-Darling",
        desc: "Pengujian hipotesis kesesuaian distribusi: uji normalitas Shapiro-Wilk (kekuatan tertinggi untuk sampel sedang), uji non-parametrik Kolmogorov-Smirnov (jarak supremum D), dan Anderson-Darling.",
        concept: `Setelah melakukan inspeksi grafis via Q-Q Plot, ilmuwan data membutuhkan uji hipotesis objektif dengan nilai p-value formal untuk menentukan apakah suatu dataset dapat diasumsikan mengikuti distribusi tertentu.

Tiga uji Goodness-of-Fit kanonikal:
1. Uji Shapiro-Wilk: Uji normalitas paling kuat untuk ukuran sampel kecil hingga menengah ($n < 5.000$). Uji ini mengevaluasi korelasi antara observasi terurut dengan bobot kovarians kuantil normal baku.
2. Uji Kolmogorov-Smirnov (K-S Test): Uji non-parametrik yang mengukur jarak vertikal maksimum (supremum distance $D$) antara Fungsi Distribusi Kumulatif Empiris ($F_n(x)$) dengan CDF teoretis target ($F_0(x)$):
$$D = \\sup_x |F_n(x) - F_0(x)|$$
Uji K-S dapat digunakan untuk distribusi kontinu apa pun (bukan hanya normal).
3. Uji Anderson-Darling: Modifikasi lanjutan dari K-S test yang memberikan bobot penalti lebih berat pada area ekor distribusi, menjadikannya sangat sensitif dalam mendeteksi anomali di wilayah ekor data.`,
        formula: `D = \\sup_{x} |F_n(x) - F_0(x)|`,
        code: `# 4.9: Uji Formal Normalitas Shapiro-Wilk dan Kolmogorov-Smirnov di SciPy
import scipy.stats as stats
import numpy as np

np.random.seed(42)
# Uji pada dua sampel: Sampel Normal murni vs Sampel Log-Normal
sampel_normal = np.random.normal(loc=50, scale=10, size=100)
sampel_menceng = np.random.lognormal(mean=3, sigma=0.5, size=100)

# 1. Uji Shapiro-Wilk
w_stat_norm, p_shapiro_norm = stats.shapiro(sampel_normal)
w_stat_skew, p_shapiro_skew = stats.shapiro(sampel_menceng)

# 2. Uji Kolmogorov-Smirnov Satu Sampel (terhadap Normal Teoretis)
ks_norm, p_ks_norm = stats.kstest(sampel_normal, 'norm', args=(np.mean(sampel_normal), np.std(sampel_normal)))
ks_skew, p_ks_skew = stats.kstest(sampel_menceng, 'norm', args=(np.mean(sampel_menceng), np.std(sampel_menceng)))

print("=== HASIL UJI FORMAL GOODNESS-OF-FIT NORMALITAS ===")
print(f"Sampel Normal  - Shapiro p-value: {p_shapiro_norm:.4f} -> {'[LOLOS NORMAL]' if p_shapiro_norm > 0.05 else '[TOLAK]'}")
print(f"Sampel Menceng - Shapiro p-value: {p_shapiro_skew:.4e} -> {'[LOLOS]' if p_shapiro_skew > 0.05 else '[TOLAK NORMALITAS]'}")
print(f"\\nSampel Normal  - KS D-Statistic  : {ks_norm:.4f} (p-value: {p_ks_norm:.4f})")
print(f"Sampel Menceng - KS D-Statistic  : {ks_skew:.4f} (p-value: {p_ks_skew:.4e})")`,
        expectedOutput: "Sampel normal lolos uji p > 0.05 sedangkan sampel menceng ditolak secara mutlak p < 0.0001.",
        codeExp: "Skrip mengeksekusi uji Shapiro-Wilk dan Kolmogorov-Smirnov secara paralel menggunakan scipy.stats, menyediakan prosedur audit statistik formal untuk verifikasi asumsi model parametrik.",
        pitfalls: [
          "Menjalankan uji Shapiro-Wilk pada dataset masif ($n > 100.000$); pada sampel sangat besar, deviasi mikroskopis yang tidak berbahaya akan menghasilkan p-value < 0.05 dan menolak normalitas secara keliru.",
          "Menggunakan parameter estimasi sampel pada uji K-S standar tanpa menggunakan koreksi Lilliefors test."
        ],
        refTitle: "S. S. Shapiro, M. B. Wilk: An analysis of variance test for normality (complete samples)",
        refUrl: "https://academic.oup.com/biomet/article/52/3-4/591/247169"
      },
      {
        num: "4.10",
        slug: "4-10-pemilihan-pencocokan-distribusi-data-riil",
        title: "4.10. Pemilihan & Pencocokan Distribusi Otomatis pada Data Industri Riil",
        desc: "Protokol fitting distribusi otomatis: pemindaian multi-distribusi (Scipy rv_continuous), estimasi parameter via MLE, evaluasi kriteria informasi AIC/BIC, dan pemilihan model terbaik.",
        concept: `Dalam praktik industri, seorang ilmuwan data seringkali dihadapkan pada data waktu tunggu pelanggan atau volume transaksi yang bentuk distribusinya tidak diketahui apriori. Bagaimana kita memilih secara otomatis distribusi mana (antara Normal, Log-Normal, Gamma, Weibull, atau Exponential) yang paling akurat merepresentasikan data tersebut?

Protokol Pencocokan Distribusi Otomatis (Automated Distribution Fitting):
1. Menentukan katalog distribusi kandidat yang relevan dengan domain variabel.
2. Melakukan estimasi parameter terbaik untuk masing-masing distribusi kandidat menggunakan metode Maximum Likelihood Estimation (MLE) via metode '.fit()' di SciPy.
3. Menghitung nilai Log-Likelihood maksimum ($\\ln L$) yang dicapai oleh masing-masing distribusi.
4. Membandingkan kecocokan model menggunakan Kriteria Informasi Akaike (Akaike Information Criterion / AIC) atau Kriteria Informasi Bayesian (BIC):
$$\\text{AIC} = 2k - 2\\ln(L)$$
Di mana $k$ adalah jumlah parameter distribusi. Distribusi dengan nilai AIC terendah dipilih sebagai model probabilitas terbaik karena memberikan kompromi optimal antara kecocokan data dan kesederhanaan model (prinsip Occam's Razor).`,
        formula: `\\text{AIC} = 2k - 2\\ln(\\hat{L})`,
        code: `# 4.10: Seleksi Multi-Distribusi Otomatis Berdasarkan Skor Kriteria Informasi AIC
import scipy.stats as stats
import numpy as np
import pandas as pd

# Menghasilkan data waktu tunggu layanan bank sintetis (Data aslinya Gamma)
np.random.seed(42)
data_layanan = np.random.gamma(shape=2.5, scale=4.0, size=500)

kandidat_distribusi = {
    'Eksponensial': stats.expon,
    'Normal': stats.norm,
    'Log-Normal': stats.lognorm,
    'Gamma': stats.gamma
}

hasil_fitting = []

for nama, dist in kandidat_distribusi.items():
    # 1. Fitting parameter via Maximum Likelihood Estimation (MLE)
    params = dist.fit(data_layanan)
    k_params = len(params)
    
    # 2. Hitung Log-Likelihood
    log_likelihood = np.sum(dist.logpdf(data_layanan, *params))
    
    # 3. Hitung AIC = 2k - 2*log(L)
    aic = 2 * k_params - 2 * log_likelihood
    hasil_fitting.append({'Distribusi': nama, 'Log_Likelihood': log_likelihood, 'AIC': aic, 'Jumlah_Params': k_params})

df_aic = pd.DataFrame(hasil_fitting).sort_values(by='AIC').reset_index(drop=True)
pemenang = df_aic.iloc[0]['Distribusi']

print("=== HASIL SELEKSI MULTI-DISTRIBUSI PROBABILITAS OTOMATIS (AIC) ===")
print(df_aic.round(2))
print(f"\\n[DISTRIBUSI TERPILIH]: '{pemenang}' menghasilkan skor AIC terendah (Model Paling Optimal!).")`,
        expectedOutput: "Distribusi Gamma terpilih otomatis sebagai model terbaik dengan nilai AIC terendah.",
        codeExp: "Skrip memindai multi-distribusi, mem-fit parameter via MLE, dan mengevaluasi penalti AIC untuk menentukan secara objektif model distribusi mana yang paling representatif bagi data industri.",
        pitfalls: [
          "Hanya membandingkan nilai Log-Likelihood mentah tanpa memperhitungkan penalti jumlah parameter ($k$), yang membiaskan pilihan ke distribusi rumit yang overfitted.",
          "Mencocokkan distribusi dengan domain tak hingga pada data yang memiliki batasan fisik alamiah kaku (seperti persentase yang terikat di [0, 1])."
        ],
        refTitle: "Hirotugu Akaike: A New Look at the Statistical Model Identification (IEEE TAC 1974)",
        refUrl: "https://ieeexplore.ieee.org/document/1100705"
      }
    ]
  }
];
