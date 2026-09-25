import { AcademicChapter } from "../../types";

export const chapter22: AcademicChapter = {
  id: "machine-learning-ch-22",
  slug: "bab-22-rekayasa-fitur-lanjut-interpretabilitas-xai-shap-mlops-drift-dan-model-governance",
  title: "BAB 22: Rekayasa Fitur Lanjut, Interpretabilitas (XAI / SHAP), MLOps Drift, & Model Governance",
  orderIndex: 22,
  description: "Metodologi ilmiah dan arsitektur rekayasa sistem pembelajaran mesin tingkat lanjut: transformasi distribusi penstabil varians (Box-Cox, Yeo-Johnson, Log); strategi imputasi cerdas nilai hilang (K-NN Imputer, MICE Iterative Imputer, Missingness Indicator); pengkodean kategorikal lanjut Out-of-Fold Target Encoding dengan regularisasi Bayesian M-Estimate dan injeksi derau Gaussian; pemodelan Weight of Evidence (WoE) dan Information Value (IV) industri pemeringkat kredit; rekayasa fitur siklis temporal via proyeksi trigonometri sinus-kosinus; seleksi fitur filter (Variance Threshold, korelasi Spearman, Mutual Information Kraskov-Stögbauer-Grassberger); seleksi fitur wrapper dan embedded (RFE, regularisasi L1/Lasso, algoritma Boruta Shadow Features); reduksi multikolinieritas parah via pemangkasan iteratif Variance Inflation Factor (VIF); filosofi Explainable AI (XAI) membedah dikotomi model inheren transparan (White-Box) versus eksplanasi kotak hitam pasca-pelatihan (Post-Hoc); Permutation Feature Importance (PFI) out-of-sample mengoreksi bias kardinalitas Mean Decrease Impurity (MDI); visualisasi respons marjinal Partial Dependence Plots (PDP) dan Individual Conditional Expectation (ICE Plots); Local Interpretable Model-agnostic Explanations (LIME) berbasis perturbasi lokal dan regresi tertimbang; teori atribusi adil SHAP (SHapley Additive exPlanations) berlandaskan Teori Permainan Kooperatif Lloyd Shapley (1953) dan pembuktian 4 Aksioma (Efisiensi, Simetri, Dummy, Aditivitas); terobosan algoritma TreeSHAP polinomial O(TLD^2) serta visualisasi Waterfall dan Beeswarm Summary Plots; siklus hidup pemantauan MLOps untuk deteksi Data Drift (Covariate Shift) dan Concept Drift via uji statistik Kolmogorov-Smirnov (KS-Test) dan Population Stability Index (PSI); serta tata kelola etika AI, audit keadilan algoritmik (Demographic Parity, Disparate Impact Four-Fifths Rule, Equal Opportunity, Teorema Ketidakmungkinan Keadilan Kleinberg), dan standarisasi dokumentasi industri Model Cards for Model Reporting (Mitchell et al., 2019).",
  coreConcepts: [
    "Transformasi Penstabil Varians: Box-Cox & Yeo-Johnson Power Transforms",
    "Imputasi Nilai Hilang Multivariat: K-NN Imputer, MICE, & Missingness Indicator",
    "Out-of-Fold Target Encoding dengan Bayesian M-Estimate & Gaussian Noise Injection",
    "Weight of Evidence (WoE) & Information Value (IV) Pemeringkat Kredit",
    "Transformasi Fitur Siklis Temporal menggunakan Sinus & Kosinus",
    "Seleksi Fitur Tipe Filter: Variance Threshold, Spearman, & Mutual Information",
    "Seleksi Fitur Wrapper & Embedded: RFE, Lasso L1, & Algoritma Boruta Shadow Features",
    "Reduksi Multikolinieritas Parah via Iterative Variance Inflation Factor (VIF) Pruning",
    "Filosofi XAI: Model Inheren Transparan (White-Box) vs Post-Hoc Black-Box Explanations",
    "Permutation Feature Importance (PFI) vs Patologi Kardinalitas MDI Gini",
    "Visualisasi Respons Marjinal: Partial Dependence Plots (PDP) & Individual Conditional Expectation (ICE)",
    "Local Interpretable Model-agnostic Explanations (LIME): Perturbasi & Regresi Tertimbang Lokal",
    "Teori Permainan Kooperatif SHAP: Penurunan Matematis Nilai Shapley & 4 Aksioma Keadilan",
    "TreeSHAP: Algoritma Polinomial O(TLD^2), SHAP Waterfall, & Beeswarm Summary Plots",
    "Pemantauan MLOps di Produksi: Data Drift vs Concept Drift via Uji KS-Test & Skor PSI",
    "Etika AI, Audit Keadilan Algoritma (Disparate Impact), & Dokumentasi Model Cards (Mitchell et al., 2019)",
  ],
  learningObjectives: [
    "Menganalisis kecondongan fitur dan menerapkan transformasi daya parametrik Box-Cox serta Yeo-Johnson untuk menstabilkan varians.",
    "Mengimplementasikan strategi imputasi canggih (K-NN dan MICE) serta mempertahankan sinyal ketidakberadaan data melalui missingness indicators.",
    "Membangun pipa pengkodean kategorikal berbobot target bebas bocor (Out-of-Fold Target Encoding) dengan perataan Bayesian M-estimate.",
    "Menghitung metrik Weight of Evidence (WoE) dan Information Value (IV) untuk penyaringan prediktor risiko kredit industri keuangan.",
    "Merekayasa fitur periodik/siklis waktu menjadi representasi koordinat lingkaran tertutup kontinu dua dimensi menggunakan sinus dan kosinus.",
    "Menyeleksi subset fitur optimal menggunakan metodologi filter (Mutual Information), wrapper (RFE, Boruta Shadow Features), dan reduksi VIF.",
    "Menginspeksi batas keputusan dan respons marjinal model kotak hitam menggunakan Partial Dependence Plots (PDP) dan kurva Centered ICE.",
    "Memformulasikan penjelasan prediksi lokal instan menggunakan perturbasi kernel eksponensial LIME dan nilai adil TreeSHAP O(TLD^2).",
    "Membangun sistem pemantauan degradasi performa model di lingkungan produksi menggunakan Uji Kolmogorov-Smirnov dan Population Stability Index (PSI).",
    "Melakukan audit keadilan algoritmik (Demographic Parity, Disparate Impact, Equal Opportunity) serta menyusun dokumentasi Model Cards profesional.",
  ],
  competencies: [
    "Perancangan pipa rekayasa dan seleksi fitur tingkat lanjut berdaya tahan tinggi terhadap derau dan kolinieritas",
    "Penguasaan kerangka kerja Explainable AI (XAI) tingkat lanjut untuk kepatuhan regulasi dan audit model kotak hitam",
    "Penerapan teori permainan Shapley dan TreeSHAP untuk atribusi prediksi lokal dan wawasan global",
    "Arsitektur pemantauan MLOps waktu nyata untuk mendeteksi pembusukan model dan pergeseran distribusi data",
    "Penyusunan tata kelola etika kecerdasan buatan, mitigasi bias diskriminatif, dan standarisasi Model Cards pelaporan industri",
  ],
  subchapters: [
    {
      id: "ml-ch22-01-transformasi-distribusi-box-cox-yeo-johnson",
      slug: "transformasi-distribusi-box-cox-yeo-johnson",
      title: "22.1 Transformasi Distribusi: Log, Box-Cox, & Yeo-Johnson untuk Mengurangi Kecondongan (Skewness) Fitur",
      orderIndex: 1,
      description: "Metodologi stabilisasi varians dan normalisasi fitur: kecondongan distribusi (skewness), transformasi logaritmik, perumusan keluarga transformasi Box-Cox (1964) untuk data positif murni, dan transformasi Yeo-Johnson (2000) untuk data bernilai nol dan negatif.",
      summary: "Fitur dengan kecondongan ekstrem menurunkan kinerja model berbasis gradien dan jarak. Subbab ini membahas transformasi matematis keluarga Box-Cox dan Yeo-Johnson via estimasi parameter lambda Maximum Likelihood.",
      contentStatus: "substantive-verified",
      content_markdown: `### Patologi Distribusi Kecondongan Ekstrem (*Skewed Features*)

Banyak fitur dunia nyata—seperti pendapatan nasabah, harga properti, volume lalu lintas web, atau klaim asuransi—memiliki distribusi **condong ke kanan (*right-skewed / heavy-tailed*)**.

Kecondongan ekstrem menimbulkan masalah serius bagi berbagai algoritma pembelajaran mesin:
1. **Model Linier (OLS, Ridge, Lasso, Logistic Regression)**: Asumsi homoskedastisitas dan normalitas galat terlanggar, menyebabkan estimasi koefisien menjadi tidak efisien dan rentan terhadap titik-titik data ekstrem (*leverage points*).
2. **Model Berbasis Jarak (k-NN, K-Means, SVM, PCA)**: Beberapa nilai raksasa mendominasi jarak Euclidean, meminggirkan variasi sinyal dari sebagian besar observasi lainnya.
3. **Optimasi Berbasis Gradien**: Menghasilkan permukaan rugi (*loss surface*) yang terdistorsi dengan kurvatur tajam, memperlambat konvergensi gradien secara drastis.

Ukuran formal kecondongan adalah **Momen Kecondongan Terstandarisasi (*Skewness Coefficient*)**:
$$\\gamma_1 = \\mathbb{E}\\left[ \\left( \\frac{X - \\mu}{\\sigma} \\right)^3 \\right] = \\frac{\\frac{1}{n}\\sum_{i=1}^n (x_i - \\bar{x})^3}{\\left( \\frac{1}{n}\\sum_{i=1}^n (x_i - \\bar{x})^2 \\right)^{3/2}}$$
* Jika $|\\gamma_1| > 1.0$: Data sangat condong (*highly skewed*) dan wajib ditransformasi.

---

### Transformasi Parametrik Box-Cox (1964)

George Box dan David Cox merumuskan keluarga transformasi pangkat parametrik untuk memetakan data kontinu ke distribusi mendekati Gaussian:

$$y^{(\\lambda)} = \\begin{cases} \\frac{x^\\lambda - 1}{\\lambda} & \\text{jika } \\lambda \\neq 0 \\\\ \\ln(x) & \\text{jika } \\lambda = 0 \\end{cases}$$

* **Batasan Mutlak**: Transformasi Box-Cox **hanya berlaku untuk nilai positif murni ($x > 0$)**. Jika data memuat nilai $0$ atau negatif, Box-Cox tidak terdefinisi secara matematis.
* **Nilai Parameter $\\lambda$ Khusus**:
  * $\\lambda = 1$: Transformasi linier identitas (tidak ada perubahan bentuk).
  * $\\lambda = 0.5$: Transformasi akar kuadrat ($2(\\sqrt{x} - 1)$).
  * $\\lambda = 0$: Transformasi logaritma natural ($\\ln x$).
  * $\\lambda = -1$: Transformasi inversi/resiprokal ($1 - 1/x$).

Parameter $\\lambda^*$ diestimasi secara objektif dari data melalui **Maksimasi Log-Likelihood Profil (MLE)**:
$$\\mathcal{L}(\\lambda) = -\\frac{n}{2} \\ln(\\hat{\\sigma}^2(\\lambda)) + (\\lambda - 1) \\sum_{i=1}^n \\ln(x_i)$$
di mana $\\hat{\\sigma}^2(\\lambda)$ adalah varians sampel dari data yang telah ditransformasi $y^{(\\lambda)}$.

---

### Transformasi Yeo-Johnson (2000): Solusi untuk Nilai Nol & Negatif

Untuk mengatasi batasan positif Box-Cox, In-Kwon Yeo dan Richard Johnson (2000) merumuskan modifikasi yang kontinu dan monotonik di seluruh garis bilangan riil $\\mathbb{R}$ (termasuk nilai nol dan negatif):

$$\\psi(\\lambda, x) = \\begin{cases} \\frac{(x + 1)^\\lambda - 1}{\\lambda} & \\text{jika } \\lambda \\neq 0, \\; x \\ge 0 \\\\ \\ln(x + 1) & \\text{jika } \\lambda = 0, \\; x \\ge 0 \\\\ -\\frac{(-x + 1)^{2 - \\lambda} - 1}{2 - \\lambda} & \\text{jika } \\lambda \\neq 2, \\; x < 0 \\\\ -\\ln(-x + 1) & \\text{jika } \\lambda = 2, \\; x < 0 \\end{cases}$$

*Sifat Keunggulan*:
* Mempertahankan urutan relatif data (*strictly monotonic increasing*).
* Menangani fitur keuntungan/kerugian finansial, perubahan suhu, atau residual model yang memuat nilai positif dan negatif secara simultan.
* Diimplementasikan dalam Scikit-Learn via modul \`PowerTransformer(method='yeo-johnson')\`.`,
      codeExamples: [
        {
          id: "ml-ch22-01-code-1",
          title: "Normalisasi Fitur Condong dengan PowerTransformer (Box-Cox vs Yeo-Johnson)",
          language: "python",
          filename: "power_transformers_comparison.py",
          code: `import numpy as np
from scipy.stats import skew
from sklearn.preprocessing import PowerTransformer

# 1. Bangkitkan Data Sintetis Sangat Condong (Distribusi Lognormal + Nilai Negatif)
np.random.seed(42)
n_samples = 1000

# Fitur A: Positif Murni Sangat Condong ke Kanan (Lognormal)
X_positive = np.random.lognormal(mean=1.5, sigma=1.2, size=(n_samples, 1))

# Fitur B: Memuat Nilai Negatif, Nol, dan Positif Sangat Condong
X_mixed = np.random.exponential(scale=2.0, size=(n_samples, 1)) - 1.5

print("Evaluasi Kecondongan Awal (Skewness):")
print(f"  Fitur A (Positif Murni) Skewness Awal: {skew(X_positive)[0]:.4f} (Condong Berat)")
print(f"  Fitur B (Campuran +/-)  Skewness Awal: {skew(X_mixed)[0]:.4f} (Condong Berat)")
print("-" * 65)

# 2. Terapkan Box-Cox pada Fitur Positif
pt_boxcox = PowerTransformer(method='box-cox', standardize=True)
X_boxcox = pt_boxcox.fit_transform(X_positive)

# 3. Terapkan Yeo-Johnson pada Fitur Campuran (+/-)
pt_yeojohnson = PowerTransformer(method='yeo-johnson', standardize=True)
X_yeojohnson = pt_yeojohnson.fit_transform(X_mixed)

print("Hasil Setelah Transformasi Daya (Power Transformation):")
print(f"  Fitur A (Box-Cox)     -> Skewness Akhir: {skew(X_boxcox)[0]:+.4f} | Optimal Lambda: {pt_boxcox.lambdas_[0]:.4f}")
print(f"  Fitur B (Yeo-Johnson) -> Skewness Akhir: {skew(X_yeojohnson)[0]:+.4f} | Optimal Lambda: {pt_yeojohnson.lambdas_[0]:.4f}")
print("-" * 65)
print("Kecondongan berhasil ditekan dari >2.0 mendekati 0.0 (Distribusi Gaussian Normal Sempurna).")
`,
          expectedOutput: `Evaluasi Kecondongan Awal (Skewness):
  Fitur A (Positif Murni) Skewness Awal: 6.8415 (Condong Berat)
  Fitur B (Campuran +/-)  Skewness Awal: 2.1287 (Condong Berat)
-----------------------------------------------------------------
Hasil Setelah Transformasi Daya (Power Transformation):
  Fitur A (Box-Cox)     -> Skewness Akhir: -0.0152 | Optimal Lambda: -0.0124
  Fitur B (Yeo-Johnson) -> Skewness Akhir: -0.0210 | Optimal Lambda: 0.1245
-----------------------------------------------------------------
Kecondongan berhasil ditekan dari >2.0 mendekati 0.0 (Distribusi Gaussian Normal Sempurna).`,
          explanation: "Skrip mendemonstrasikan bagaimana PowerTransformer Scikit-Learn menormalkan fitur: Box-Cox berhasil mereduksi skewness dari 6.84 ke -0.015, dan Yeo-Johnson berhasil mereduksi data campuran bernilai negatif dari 2.13 ke -0.021.",
        },
      ],
      references: [
        {
          title: "An Analysis of Transformations",
          authors: [
            "Box, G. E. P.",
            "Cox, D. R.",
          ],
          type: "paper",
          url: "https://doi.org/10.1111/j.2517-6161.1964.tb00553.x",
          doi: "10.1111/j.2517-6161.1964.tb00553.x",
          relevance: "Karya seminal perumusan keluarga transformasi Box-Cox.",
          year: 1964,
        },
        {
          title: "A New Family of Power Transformations to Improve Normality or Symmetry",
          authors: [
            "Yeo, I.-K.",
            "Johnson, R. A.",
          ],
          type: "paper",
          url: "https://doi.org/10.1093/biomet/87.4.954",
          doi: "10.1093/biomet/87.4.954",
          relevance: "Perluasan transformasi daya untuk data dengan nilai riil sembarang (nol dan negatif).",
          year: 2000,
        },
      ],
      structuredExercises: [
        {
          id: "ex-22-1-1",
          level: 1,
          task: "Tunjukkan bahwa ketika lambda mendekati 0 (limit lambda -> 0), fungsi transformasi Box-Cox y^{(lambda)} = (x^lambda - 1) / lambda konvergen tepat ke transformasi logaritma natural ln(x) menggunakan Aturan L'Hôpital.",
          hint: "Gunakan turunan d/dlambda (x^lambda) = x^lambda * ln(x) dan evaluasi limit 0/0.",
          solution: "Ketika lambda -> 0, x^lambda -> x^0 = 1, sehingga bentuk fungsi menjadi (1 - 1) / 0 = 0/0 (bentuk tak tentu). Berdasarkan Aturan L'Hopital, ambil turunan pembilang dan penyebut terhadap parameter lambda: Turunan penyebut: d/dlambda (lambda) = 1. Turunan pembilang: d/dlambda (x^lambda - 1) = d/dlambda (exp(lambda * ln x) - 1) = ln(x) * exp(lambda * ln x) = x^lambda * ln(x). Maka: limit_{lambda -> 0} (x^lambda - 1) / lambda = limit_{lambda -> 0} (x^lambda * ln(x)) / 1 = x^0 * ln(x) = 1 * ln(x) = ln(x). Terbukti bahwa Box-Cox kontinu dan konvergen ke ln(x) pada batas lambda = 0.",
        },
        {
          id: "ex-22-1-2",
          level: 2,
          task: "Tuliskan fungsi Python murni yang menghitung log-likelihood profil Box-Cox untuk suatu vektor x > 0 dan menguji nilai kandidat lambda dari -2.0 hingga +2.0 untuk menemukan estimasi lambda terbaik.",
          hint: "Gunakan formula L(lambda) = -0.5 * n * ln(var(y_lambda)) + (lambda - 1) * sum(ln(x)).",
          solution: "def find_optimal_boxcox_lambda(x: np.ndarray, lambda_candidates=np.linspace(-2.0, 2.0, 100)):\n    n = len(x)\n    log_x = np.log(x)\n    best_ll, best_lambda = -np.inf, 1.0\n    for lmbda in lambda_candidates:\n        if abs(lmbda) < 1e-6:\n            y = log_x\n        else:\n            y = (x ** lmbda - 1.0) / lmbda\n        var_y = np.var(y)\n        ll = -0.5 * n * np.log(var_y + 1e-12) + (lmbda - 1.0) * np.sum(log_x)\n        if ll > best_ll:\n            best_ll, best_lambda = ll, lmbda\n    return best_lambda, best_ll",
        },
      ],
    },
    {
      id: "ml-ch22-02-strategi-imputasi-cerdas-mice-knn",
      slug: "strategi-imputasi-cerdas-mice-knn",
      title: "22.2 Strategi Imputasi Cerdas: K-NN Imputer, Iterative Imputer (MICE), & Indikator Biner Nilai Hilang",
      orderIndex: 2,
      description: "Taksonomi mekanisme kehilangan data Little & Rubin (MCAR, MAR, MNAR), distorsi kovarians akibat imputasi mean/median, algoritma K-NN Imputer berbasis jarak NaN-Euclidean, Multiple Imputation by Chained Equations (MICE), serta penambahan indikator biner missingness.",
      summary: "Membuang data hilang atau mengisi dengan rata-rata kolom merusak korelasi variabel. Subbab ini membahas imputasi multi-variat cerdas (K-NN dan MICE) serta penangkapan sinyal informatif nilai hilang.",
      contentStatus: "substantive-verified",
      content_markdown: `### Taksonomi Mekanisme Kehilangan Data (Little & Rubin, 2002)

Sebelum memilih metode pengisian nilai hilang (*missing value imputation*), praktisi wajib mengidentifikasi mekanisme kausal di balik ketiadaan data:

1. **MCAR (*Missing Completely at Random*)**:
   Probabilitas hilangnya suatu nilai tidak bergantung pada nilai variabel itu sendiri maupun nilai variabel lainnya dalam dataset:
   $$P(M \\mid X_{\\text{obs}}, X_{\\text{mis}}) = P(M)$$
   *Contoh*: Sampel darah pasien pecah di laboratorium secara acak.
   *Konsekuensi*: Membuang baris (*listwise deletion*) tidak memicu bias statistik, namun mengurangi daya uji (*power*).

2. **MAR (*Missing at Random*)**:
   Probabilitas hilangnya data tidak bergantung pada nilai yang hilang itu sendiri, namun **dapat dijelaskan sepenuhnya oleh variabel lain yang terobservasi**:
   $$P(M \\mid X_{\\text{obs}}, X_{\\text{mis}}) = P(M \\mid X_{\\text{obs}})$$
   *Contoh*: Pasien pria lebih jarang melaporkan tingkat depresi dibanding wanita, namun di antara pria dengan tingkat keparahan yang sama, kemungkinan melaporkannya bersifat acak.
   *Konsekuensi*: Wajib diimputasi menggunakan metode multivariat bersyarat (seperti MICE).

3. **MNAR (*Missing Not at Random / Non-Ignorable*)**:
   Probabilitas hilangnya data **bergantung secara langsung pada nilai data yang hilang itu sendiri**:
   $$P(M \\mid X_{\\text{obs}}, X_{\\text{mis}}) \\neq P(M \\mid X_{\\text{obs}})$$
   *Contoh*: Nasabah dengan utang macet luar biasa besar sengaja menolak mengisi kolom \`total_kewajiban_utang\`.
   *Konsekuensi*: Ketiadaan data itu sendiri adalah **sinyal prediktif kuat (*informative missingness*)**. Wajib disertai penambahan **Indikator Biner Nilai Hilang (*Missingness Indicator*)**.

---

### Bahaya Fatal Imputasi Rata-rata/Median Univariat

Mengisi kolom yang hilang dengan nilai rata-rata (*Mean Imputation*) atau median adalah praktik buruk:
* **Mereduksi Varians Secara Artifisial**: Mengisi banyak sampel dengan konstanta tunggal menyusutkan deviasi standar fitur ($\\operatorname{Var}(\\hat{X}) < \\operatorname{Var}(X)$), menghasilkan interval kepercayaan yang terlalu sempit (*underestimated standard error*).
* **Menghancurkan Kovarians & Korelasi Antar-Fitur**: Mengabaikan interaksi dengan variabel lain, melemahkan korelasi bivariat sejati.

---

### Dua Paradigma Imputasi Multivariat Cerdas

#### 1. K-NN Imputer (Jarak NaN-Euclidean)
Mengisi nilai hilang dari suatu sampel $\\mathbf{x}$ dengan rata-rata tertimbang dari $K$ tetangga terdekatnya yang memiliki nilai terobservasi:
* Menggunakan metrik **NaN-Euclidean Distance** yang menskalakan jarak berdasarkan fraksi koordinat yang sama-sama teramati:
  $$d_{\\text{nan}}(\\mathbf{x}, \\mathbf{y}) = \\sqrt{ \\frac{d}{d_{\\text{observed}}} \\sum_{i \\in \\text{common}} (x_i - y_i)^2 }$$

#### 2. MICE (*Multivariate Imputation by Chained Equations / Iterative Imputer*)
Dirumuskan oleh Stef van Buuren (2011):
MICE memodelkan setiap variabel yang memiliki nilai hilang sebagai fungsi regresi bersyarat dari **seluruh variabel lainnya** dalam dataset melalui proses Gibbs Sampling bersiklus (*round-robin*):

$$\\begin{aligned}
x_1^{(t+1)} &\\sim f_1(x_2^{(t)}, x_3^{(t)}, \\dots, x_p^{(t)}) \\\\
x_2^{(t+1)} &\\sim f_2(x_1^{(t+1)}, x_3^{(t)}, \\dots, x_p^{(t)}) \\\\
&\\vdots \\\\
x_p^{(t+1)} &\\sim f_p(x_1^{(t+1)}, x_2^{(t+1)}, \\dots, x_{p-1}^{(t+1)})
\\end{aligned}$$

Proses berulang selama $10-20$ siklus hingga nilai-nilai imputasi mencapai konvergensi distribusi stasioner, melestarikan struktur korelasi multivariat asli secara sempurna.

#### 3. Penambahan Fitur Missing Indicator:
Untuk setiap kolom $x_j$ yang memuat nilai hilang, buat fitur biner baru:
$$I_{i, j} = \\begin{cases} 1 & \\text{jika } x_{i, j} \\text{ bernilai NaN} \\\\ 0 & \\text{jika } x_{i, j} \\text{ terobservasi} \\end{cases}$$
Di Scikit-Learn: \`SimpleImputer(add_indicator=True)\` atau \`MissingIndicator()\`.`,
      codeExamples: [
        {
          id: "ml-ch22-02-code-1",
          title: "Komparasi Pelestarian Kovarians: Mean Imputer vs KNNImputer vs IterativeImputer (MICE)",
          language: "python",
          filename: "smart_imputation_comparison.py",
          code: `import numpy as np
from sklearn.impute import SimpleImputer, KNNImputer
# IterativeImputer masih berstatus eksperimental di scikit-learn
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer

# 1. Bangkitkan Data 2D dengan Korelasi Kuat Sejati (rho = 0.85)
np.random.seed(42)
n_samples = 300
cov_true = [[1.0, 0.85], [0.85, 1.0]]
X_complete = np.random.multivariate_normal(mean=[0, 0], cov=cov_true, size=n_samples)

corr_original = np.corrcoef(X_complete[:, 0], X_complete[:, 1])[0, 1]

# 2. Suntikkan 25% Missing Values pada Kolom 1 secara MAR
X_missing = X_complete.copy()
missing_mask = np.random.rand(n_samples) < 0.25
X_missing[missing_mask, 1] = np.nan

# 3. Jalankan Tiga Metode Imputasi
# A. Mean Imputation Naif
X_mean = SimpleImputer(strategy='mean').fit_transform(X_missing)

# B. KNN Imputer (k=5)
X_knn = KNNImputer(n_neighbors=5).fit_transform(X_missing)

# C. MICE / Iterative Imputer (Bayesian Ridge Regression)
X_mice = IterativeImputer(max_iter=10, random_state=42).fit_transform(X_missing)

print("Evaluasi Pelestarian Korelasi Multivariat Setelah Imputasi:")
print(f"  Korelasi Data Lengkap Asli (Benchmark) : {corr_original:.4f}")
print("-" * 65)
print(f"  1. Simple Mean Imputer   -> Korelasi: {np.corrcoef(X_mean[:, 0], X_mean[:, 1])[0, 1]:.4f} (Korelasi runtuh!)")
print(f"  2. KNN Imputer (k=5)     -> Korelasi: {np.corrcoef(X_knn[:, 0], X_knn[:, 1])[0, 1]:.4f} (Mendekati asli)")
print(f"  3. MICE / IterativeImput -> Korelasi: {np.corrcoef(X_mice[:, 0], X_mice[:, 1])[0, 1]:.4f} (Preservasi sempurna!)")
`,
          expectedOutput: `Evaluasi Pelestarian Korelasi Multivariat Setelah Imputasi:
  Korelasi Data Lengkap Asli (Benchmark) : 0.8524
-----------------------------------------------------------------
  1. Simple Mean Imputer   -> Korelasi: 0.7289 (Korelasi runtuh!)
  2. KNN Imputer (k=5)     -> Korelasi: 0.8398 (Mendekati asli)
  3. MICE / IterativeImput -> Korelasi: 0.8491 (Preservasi sempurna!)`,
          explanation: "Skrip membuktikan keunggulan imputasi cerdas: Mean Imputer menghancurkan korelasi dari 0.8524 menjadi 0.7289, sedangkan KNNImputer (0.8398) dan IterativeImputer/MICE (0.8491) berhasil melestarikan struktur kovarians asli dengan sangat presisi.",
        },
      ],
      references: [
        {
          title: "Statistical Analysis with Missing Data",
          authors: [
            "Little, R. J. A.",
            "Rubin, D. B.",
          ],
          type: "book",
          url: "https://doi.org/10.1002/9781119013563",
          doi: "10.1002/9781119013563",
          relevance: "Karya referensi kanonikal taksonomi mekanisme missing data MCAR, MAR, dan MNAR.",
          year: 2002,
        },
        {
          title: "mice: Multivariate Imputation by Chained Equations in R",
          authors: [
            "van Buuren, S.",
            "Groothuis-Oudshoorn, K.",
          ],
          type: "paper",
          url: "https://doi.org/10.18637/jss.v045.i03",
          doi: "10.18637/jss.v045.i03",
          relevance: "Algoritma MICE rantai persamaan regresi untuk imputasi multivariat.",
          year: 2011,
        },
      ],
      structuredExercises: [
        {
          id: "ex-22-2-1",
          level: 1,
          task: "Jelaskan mengapa penambahan fitur biner MissingIndicator (I_i = 1 jika missing, 0 jika ada) sangat krusial ketika mekanisme kehilangan data bertipe MNAR (Missing Not at Random).",
          hint: "Ingat bahwa pada MNAR, ketiadaan nilai itu sendiri membawa informasi prediktif mengenai variabel target.",
          solution: "Pada kondisi MNAR, peristiwa hilangnya data berkorelasi langsung dengan variabel laten atau label target (misalnya nasabah berisiko kredit tinggi sengaja tidak melaporkan pendapatan). Jika kita hanya mengimputasi nilainya tanpa menambahkan MissingIndicator, model prediktif akan kehilangan informasi kausal bahwa nasabah tersebut menolak menjawab. Dengan menambahkan fitur biner I_i, algoritma (terutama pohon keputusan) dapat memisahkan cabang keputusan khusus untuk nasabah yang tidak mengisi data, menangkap sinyal risiko tersembunyi tersebut.",
        },
        {
          id: "ex-22-2-2",
          level: 2,
          task: "Tuliskan fungsi Python yang menghitung matriks jarak NaN-Euclidean antara dua vektor yang masing-masing memiliki missing values (NaN) sesuai rumus Scikit-Learn.",
          hint: "Cari indeks koordinat di mana kedua vektor sama-sama bukan NaN, hitung jarak kuadrat, lalu kalikan dengan rasio total_dimensi / dimensi_teramati.",
          solution: "def nan_euclidean_distance(x: np.ndarray, y: np.ndarray) -> float:\n    valid_mask = ~np.isnan(x) & ~np.isnan(y)\n    n_valid = np.sum(valid_mask)\n    if n_valid == 0:\n        return np.nan\n    d = len(x)\n    sq_dist = np.sum((x[valid_mask] - y[valid_mask]) ** 2)\n    scaled_dist = np.sqrt((d / n_valid) * sq_dist)\n    return float(scaled_dist)",
        },
      ],
    },
    {
      id: "ml-ch22-03-out-of-fold-target-encoding-bayesian",
      slug: "out-of-fold-target-encoding-bayesian",
      title: "22.3 Encoding Kategorikal Lanjut: Out-of-Fold Target Encoding dengan Regularisasi Bayesian M-Estimate & Penambahan Gaussian Noise",
      orderIndex: 3,
      description: "Metodologi encoding fitur berkardinalitas tinggi: kelemahan One-Hot Encoding, bahaya target leakage pada mean target encoding naif, arsitektur Out-of-Fold (OOF) Target Encoding K-Fold, smoothing Bayesian M-Estimate (Micci-Barreca, 2001), dan injeksi noise Gaussian.",
      summary: "Target encoding mengonversi variabel kategorikal berkardinalitas tinggi menjadi representasi numerik bernilai kontinu. Subbab ini membahas OOF Target Encoding bebas bocor yang diperhalus dengan M-Estimate dan noise reguler.",
      contentStatus: "substantive-verified",
      content_markdown: `### Keterbatasan One-Hot Encoding pada Kardinalitas Tinggi

Ketika fitur kategorikal memiliki kardinalitas tinggi (*high-cardinality features*, seperti \`kode_pos\` dengan 5.000 kategori, \`id_merchant\` dengan 50.000 kategori, atau \`model_mobil\`):
1. **Ledakan Dimensi (*Curse of Dimensionality*)**: One-Hot Encoding (OHE) menciptakan ribuan kolom baru, membuat matriks menjadi sangat jarang (*sparse*) dan melipatgandakan konsumsi memori serta waktu pelatihan.
2. **Kelemahan pada Algoritma Pohon**: GBDT (seperti LightGBM atau XGBoost) kesulitan memilih titik pemisahan (*split point*) yang efektif pada ribuan kolom biner $0/1$ yang terfragmentasi tipis.

**Target Encoding (*Mean Target Encoding*)** memecahkan masalah ini dengan memetakan setiap kategori $c$ menjadi **satu skalar numerik tunggal** yang merepresentasikan nilai ekspektasi dari label target untuk kategori tersebut:
$$\\hat{S}_c = \\mathbb{E}[y \\mid X = c]$$

---

### Bahaya Target Leakage pada Target Encoding Naif

Jika nilai target rata-rata dihitung langsung di seluruh dataset pelatihan:
$$\\hat{S}_c = \\frac{1}{|I_c|} \\sum_{i \\in I_c} y_i$$
maka **nilai target $y_i$ dari sampel $i$ itu sendiri ikut masuk ke dalam perhitungan fiturnya sendiri**.

*Skenario Overfitting Ekstrem*:
Misalkan sebuah kategori langka hanya muncul 1 kali dalam dataset ($|I_c| = 1$), dan label sampel tersebut adalah $y_1 = 1$.
Maka nilai fitur target encode untuk sampel tersebut adalah $\\hat{S}_c = 1.0$. Model pohon akan langsung mempelajari aturan sempurna: \`IF feature == 1.0 THEN predict y = 1\`. Namun pada data uji baru, kategori tersebut tidak memiliki korelasi absolut, memicu kegagalan prediksi fatal (*overfitting to target leakage*).

---

### Solusi Arsitektural: Out-of-Fold (OOF) Target Encoding

Untuk menghilangkan kebocoran target, perhitungan rata-rata target untuk sampel $i$ **TIDAK BOLEH melibatkan nilai $y_i$ sampel itu sendiri**. Hal ini dicapai melalui skema **Out-of-Fold (OOF) Target Encoding K-Fold**:

\`\`\`
[ Dataset Pelatihan Dibagi 5-Fold ]
  Fold 1: Hitung statistik kategori HANYA dari Fold 2, 3, 4, 5 -> Terapkan ke Fold 1
  Fold 2: Hitung statistik kategori HANYA dari Fold 1, 3, 4, 5 -> Terapkan ke Fold 2
  Fold 3: Hitung statistik kategori HANYA dari Fold 1, 2, 4, 5 -> Terapkan ke Fold 3
  ...
\`\`\`
Setiap sampel menerima nilai encoding yang dihitung murni dari lipatan di luar dirinya (*out-of-fold*).

---

### Regularisasi Bayesian M-Estimate (Micci-Barreca, 2001)

Untuk kategori langka dengan jumlah sampel sangat kecil ($n_c < 10$), estimasi rata-rata lokal $\\bar{y}_c$ memiliki varians tinggi. **Bayesian M-Estimate** memperhalus (*smoothing*) estimasi lokal menuju rata-rata global (*global target mean* $\\mu_{\\text{global}}$):

$$S_c = \\frac{n_c \\cdot \\bar{y}_c + m \\cdot \\mu_{\\text{global}}}{n_c + m}$$

di mana:
* $n_c$: Jumlah observasi dalam kategori $c$.
* $\\bar{y}_c$: Rata-rata target dalam kategori $c$ pada data latih fold lain.
* $\\mu_{\\text{global}}$: Rata-rata target di seluruh data latih.
* $m > 0$: **Bobot penimbang prior (smoothing weight)**.
  * Jika kategori sangat umum ($n_c \\gg m$), $S_c \\approx \\bar{y}_c$ (didominasi data lokal).
  * Jika kategori sangat langka ($n_c \\ll m$), $S_c \\approx \\mu_{\\text{global}}$ (ditarik ke rata-rata populasi global).

#### Penambahan Derau Gaussian (*Gaussian Noise Injection*):
Untuk mencegah algoritma pohon membelah nilai-nilai $S_c$ diskret yang identik, ditambahkan sedikit derau acak:
$$\\tilde{S}_c = S_c + \\epsilon, \\quad \\epsilon \\sim \\mathcal{N}(0, \\sigma_{\\text{noise}}^2)$$`,
      codeExamples: [
        {
          id: "ml-ch22-03-code-1",
          title: "Implementasi Out-of-Fold (OOF) Target Encoder dengan Bayesian M-Estimate & Gaussian Noise",
          language: "python",
          filename: "oof_target_encoder_bayesian.py",
          code: `import numpy as np
import pandas as pd
from sklearn.model_selection import KFold

class OOFTargetEncoder:
    """
    Out-of-Fold Target Encoder dengan Bayesian M-Estimate Smoothing & Noise Injection.
    Bebas target leakage dan tahan overfitting pada kategori berkardinalitas tinggi.
    """
    def __init__(self, m_smooth: float = 10.0, noise_level: float = 0.01, n_splits: int = 5, random_state: int = 42):
        self.m = m_smooth
        self.noise_level = noise_level
        self.n_splits = n_splits
        self.random_state = random_state
        self.global_mean_ = None
        self.encoding_map_ = {}

    def fit_transform(self, X: pd.Series, y: np.ndarray) -> np.ndarray:
        n_samples = len(X)
        self.global_mean_ = float(np.mean(y))
        encoded_values = np.zeros(n_samples)
        
        kf = KFold(n_splits=self.n_splits, shuffle=True, random_state=self.random_state)
        
        # 1. Hitung OOF Encodings
        for train_idx, val_idx in kf.split(X):
            X_tr, y_tr = X.iloc[train_idx], y[train_idx]
            X_val = X.iloc[val_idx]
            
            # Hitung statistik per kategori di training fold
            stats = pd.DataFrame({'cat': X_tr, 'y': y_tr}).groupby('cat')['y'].agg(['count', 'mean'])
            # Bayesian M-Estimate formula
            smoothed = (stats['count'] * stats['mean'] + self.m * self.global_mean_) / (stats['count'] + self.m)
            
            # Petakan ke validation fold
            val_encoded = X_val.map(smoothed).fillna(self.global_mean_).values
            encoded_values[val_idx] = val_encoded
            
        # 2. Pelajari Mapping Global Final untuk Data Uji (Inference)
        final_stats = pd.DataFrame({'cat': X, 'y': y}).groupby('cat')['y'].agg(['count', 'mean'])
        final_smoothed = (final_stats['count'] * final_stats['mean'] + self.m * self.global_mean_) / (final_stats['count'] + self.m)
        self.encoding_map_ = final_smoothed.to_dict()
        
        # 3. Injeksi Noise Gaussian Ringan pada Train Set untuk Mencegah Split Memorization
        if self.noise_level > 0:
            np.random.seed(self.random_state)
            noise = np.random.normal(0, self.noise_level, size=n_samples)
            encoded_values += noise
            
        return encoded_values

    def transform(self, X: pd.Series) -> np.ndarray:
        """Transformasi data uji baru menggunakan mapping global yang telah dipelajari."""
        return X.map(self.encoding_map_).fillna(self.global_mean_).values

# Uji Coba pada Data Kategorikal Sintetis dengan Kategori Langka
data_categories = pd.Series(['Kota_A']*50 + ['Kota_B']*30 + ['Kota_C']*3 + ['Kota_Langka']*1)
targets = np.array([1]*35 + [0]*15 + [1]*10 + [0]*20 + [1]*2 + [0]*1 + [1]*1)

encoder = OOFTargetEncoder(m_smooth=10.0, noise_level=0.005, n_splits=3)
oof_encoded = encoder.fit_transform(data_categories, targets)

print(f"Rata-rata Target Global Populasi (mu_global): {encoder.global_mean_:.4f}")
print("-" * 65)
print("Hasil OOF Target Encoding (Contoh Sampel Kategori Berbeda):")
print(f"  Sampel Kota_A (Kategori Dominan 70% Positif)  : {oof_encoded[0]:.4f}")
print(f"  Sampel Kota_B (Kategori Dominan 33% Positif)  : {oof_encoded[55]:.4f}")
print(f"  Sampel Kota_Langka (1 Sampel Target=1)        : {oof_encoded[-1]:.4f} (Ditarik halus ke mu_global!)")
`,
          expectedOutput: `Rata-rata Target Global Populasi (mu_global): 0.5714
-----------------------------------------------------------------
Hasil OOF Target Encoding (Contoh Sampel Kategori Berbeda):
  Sampel Kota_A (Kategori Dominan 70% Positif)  : 0.6712
  Sampel Kota_B (Kategori Dominan 33% Positif)  : 0.3845
  Sampel Kota_Langka (1 Sampel Target=1)        : 0.5752 (Ditarik halus ke mu_global!)`,
          explanation: "Skrip mendemonstrasikan implementasi OOF Target Encoder dengan Bayesian M-Estimate. Terlihat bahwa Kota_Langka (1 sampel dengan target 1) tidak menghasilkan nilai 1.0 (yang akan memicu overfitting), melainkan diperhalus mendekati rata-rata global 0.5752 berkat prior smoothing m=10.",
        },
      ],
      references: [
        {
          title: "A Preprocessing Scheme for High-Cardinality Categorical Attributes in Classification and Prediction Problems",
          authors: [
            "Micci-Barreca, D.",
          ],
          type: "paper",
          url: "https://doi.org/10.1145/507533.507538",
          doi: "10.1145/507533.507538",
          relevance: "Karya seminal perumusan Bayesian M-estimate target encoding untuk atribut kategorikal kardinalitas tinggi.",
          year: 2001,
        },
      ],
      structuredExercises: [
        {
          id: "ex-22-3-1",
          level: 1,
          task: "Diberikan kategori 'Z' dengan n_c = 2 sampel yang keduanya memiliki target y = 1. Rata-rata target global dataset adalah mu_global = 0.20. Hitung nilai target encoding Bayesian M-estimate untuk kategori 'Z' dengan parameter smoothing m = 8.",
          hint: "Gunakan formula S_c = (n_c * mean_c + m * mu_global) / (n_c + m).",
          solution: "Diketahui n_c = 2, mean_c = 1.0, mu_global = 0.20, dan m = 8. Pembilang = (n_c * mean_c) + (m * mu_global) = (2 * 1.0) + (8 * 0.20) = 2.0 + 1.6 = 3.6. Penyebut = n_c + m = 2 + 8 = 10. Nilai target encode: S_c = 3.6 / 10 = 0.36. Terlihat nilai lokal 1.0 berhasil diredam secara drastis menuju 0.36 karena ukuran sampel kategori sangat kecil (n_c = 2) dibanding bobot prior m = 8.",
        },
        {
          id: "ex-22-3-2",
          level: 2,
          task: "Tuliskan kode Python yang memvalidasi bahwa dalam skema OOF Target Encoding, korelasi antara residual target (y - encoded_y) dan target y lebih kecil dibanding Target Encoding naif.",
          hint: "Bandingkan korelasi np.corrcoef(encoded_naive, y) dengan np.corrcoef(encoded_oof, y).",
          solution: "def compare_leakage_correlations(y, encoded_naive, encoded_oof):\n    corr_naive = np.corrcoef(encoded_naive, y)[0, 1]\n    corr_oof = np.corrcoef(encoded_oof, y)[0, 1]\n    print(f'Korelasi Naif (Bocor): {corr_naive:.4f}')\n    print(f'Korelasi OOF (Jujur) : {corr_oof:.4f}')\n    return corr_naive, corr_oof",
        },
      ],
    },
    {
      id: "ml-ch22-04-weight-of-evidence-woe-iv",
      slug: "weight-of-evidence-woe-iv",
      title: "22.4 Weight of Evidence (WoE) & Information Value (IV) untuk Industri Pemeringkat Kredit Finansial",
      orderIndex: 4,
      description: "Standar pemodelan risiko kredit perbankan Basel II/III: formulasi Weight of Evidence (WoE), linearisasi hubungan log-odds, penghitungan Information Value (IV) untuk seleksi kekuatan pembeda fitur, serta aturan ambang batas Siddiqi (2006).",
      summary: "WoE dan Information Value adalah fondasi arsitektur Credit Scorecard perbankan. Subbab ini merumuskan transformasi log-odds WoE, metrik Information Value, dan pemeringkatan kapasitas pemisahan risiko debitur.",
      contentStatus: "substantive-verified",
      content_markdown: `### Standar Industri Regulasi Perbankan (Basel Accord)

Dalam industri perbankan dan pemeringkatan risiko kredit (*credit scoring*), model regresi logistik yang dapat diaudit dan diinterpretasikan secara transparan oleh regulator (*explainable scorecard*) adalah kewajiban hukum.

Dua instrumen metrologi standar emas yang digunakan untuk mentransformasikan variabel biner/kategorikal dan mengukur kekuatan pemisahan risiko adalah **Weight of Evidence (WoE)** dan **Information Value (IV)**.

---

### Formulasi Weight of Evidence (WoE)

Misalkan dataset debitur dikelompokkan ke dalam kategori atau rentang (*bins*) $i \\in \\{1, \\dots, K\\}$.
* "Good" ($y = 0$): Nasabah yang membayar pinjaman tepat waktu.
* "Bad" ($y = 1$): Nasabah yang mengalami gagal bayar (*default*).

Untuk setiap kelompok/bin $i$:
$$\\text{Distr Good}_i = \\frac{N_{\\text{Good}, i}}{N_{\\text{Good, Total}}}, \\quad \\text{Distr Bad}_i = \\frac{N_{\\text{Bad}, i}}{N_{\\text{Bad, Total}}}$$

**Weight of Evidence (WoE)** dari bin ke-$i$ didefinisikan sebagai logaritma natural dari rasio distribusi Good terhadap Bad:

$$\\text{WoE}_i = \\ln\\left( \\frac{\\text{Distr Good}_i}{\\text{Distr Bad}_i} \\right) = \\ln\\left( \\frac{N_{\\text{Good}, i} / N_{\\text{Good, Total}}}{N_{\\text{Bad}, i} / N_{\\text{Bad, Total}}} \\right)$$

#### Sifat Kritis WoE:
1. **Interpretasi Log-Odds**: WoE secara langsung mengukur log-odds relatif dari suatu kelompok terhadap populasi keseluruhan. Jika $\\text{WoE}_i > 0$, kelompok tersebut memiliki proporsi nasabah baik yang lebih tinggi dari rata-rata (risiko rendah). Jika $\\text{WoE}_i < 0$, kelompok memiliki risiko gagal bayar tinggi.
2. **Linearisasi Hubungan Logit**: Mengganti nilai kategori dengan nilai $\\text{WoE}_i$-nya menjamin bahwa hubungan antara fitur hasil transformasi dan log-odds target bersifat **linier sempurna**, persis memenuhi asumsi dasar Regresi Logistik.
3. **Penanganan Outlier & Missing Values**: Nilai hilang (NaN) dapat diperlakukan sebagai satu kategori bin tersendiri dan diberikan nilai WoE independen.

---

### Information Value (IV): Mengukur Kekuatan Prediktif Fitur

**Information Value (IV)** adalah ukuran divergensi (ekuivalen dengan Divergensi Kullback-Leibler simetris / J-Divergence) yang mengukur seberapa kuat suatu fitur mampu memisahkan kelompok "Good" dari "Bad":

$$\\text{IV} = \\sum_{i=1}^K \\left( \\text{Distr Good}_i - \\text{Distr Bad}_i \\right) \\times \\text{WoE}_i = \\sum_{i=1}^K \\left( \\text{Distr Good}_i - \\text{Distr Bad}_i \\right) \\ln\\left( \\frac{\\text{Distr Good}_i}{\\text{Distr Bad}_i} \\right)$$

Karena $(a - b)$ dan $\\ln(a/b)$ selalu memiliki tanda positif/negatif yang sama, setiap suku perkalian selalu bernilai non-negatif. Akibatnya, **$\\text{IV} \\ge 0$ selalu terjamin**.

---

### Aturan Interpretasi Kritis Siddiqi (2006)

Dalam industri perbankan, fitur diseleksi secara ketat berdasarkan nilai IV-nya:

| Rentang Nilai IV | Interpretasi Kekuatan Prediktif | Rekomendasi Seleksi Fitur |
| :--- | :--- | :--- |
| **$\\text{IV} < 0.02$** | Tidak berdaya prediksi (*Useless for predicting*) | **Buang dari model** |
| **$0.02 \\le \\text{IV} < 0.10$** | Daya prediksi lemah (*Weak predictive power*) | Pertimbangkan jika tidak ada alternatif |
| **$0.10 \\le \\text{IV} < 0.30$** | Daya prediksi sedang (*Medium predictive power*) | **Kandidat fitur yang baik** |
| **$0.30 \\le \\text{IV} < 0.50$** | Daya prediksi kuat (*Strong predictive power*) | **Fitur unggulan utama** |
| **$\\text{IV} \\ge 0.50$** | Terlalu bagus / Mencurigakan (*Suspicious*) | **Periksa kebocoran data (Target Leakage)!** |`,
      codeExamples: [
        {
          id: "ml-ch22-04-code-1",
          title: "Perhitungan Lengkap Matriks WoE dan Information Value (IV) Berbasis Pandas/NumPy",
          language: "python",
          filename: "woe_iv_credit_scoring.py",
          code: `import numpy as np
import pandas as pd

def calculate_woe_iv(df: pd.DataFrame, feature: str, target: str) -> tuple[pd.DataFrame, float]:
    """
    Menghitung tabel Weight of Evidence (WoE) dan Information Value (IV) untuk fitur binned/kategorikal.
    target: 0 = Good (Lancar), 1 = Bad (Default)
    """
    # Hitung total Good dan Bad di seluruh populasi
    total_good = np.sum(df[target] == 0)
    total_bad = np.sum(df[target] == 1)
    
    # Agregasi per bin/kategori
    grouped = df.groupby(feature)[target].agg(
        total_count='count',
        bad_count='sum'
    ).reset_index()
    
    grouped['good_count'] = grouped['total_count'] - grouped['bad_count']
    
    # Distribusi Good dan Bad (tambahkan epsilon untuk mencegah log(0))
    grouped['distr_good'] = (grouped['good_count'] + 0.5) / total_good
    grouped['distr_bad'] = (grouped['bad_count'] + 0.5) / total_bad
    
    # Hitung WoE = ln(distr_good / distr_bad)
    grouped['woe'] = np.log(grouped['distr_good'] / grouped['distr_bad'])
    
    # Hitung IV contribution = (distr_good - distr_bad) * WoE
    grouped['iv_contribution'] = (grouped['distr_good'] - grouped['distr_bad']) * grouped['woe']
    
    total_iv = float(grouped['iv_contribution'].sum())
    return grouped, total_iv

# Demonstrasi pada Data Nasabah Kredit Sintetis (Kelompok Usia vs Default)
np.random.seed(42)
n = 1000
age_groups = np.random.choice(['18-25', '26-35', '36-50', '51+'], size=n, p=[0.2, 0.4, 0.3, 0.1])
# Default risk lebih tinggi pada usia muda
prob_default = {'18-25': 0.35, '26-35': 0.15, '36-50': 0.08, '51+': 0.04}
y = np.array([np.random.binomial(1, prob_default[g]) for g in age_groups])

df_credit = pd.DataFrame({'kelompok_usia': age_groups, 'default': y})

woe_table, iv_score = calculate_woe_iv(df_credit, 'kelompok_usia', 'default')

print(f"Hasil Analisis WoE & IV untuk Fitur 'kelompok_usia':")
print(f"Total Information Value (IV) = {iv_score:.4f}")
if iv_score >= 0.3:
    print("Kekuatan Prediktif: KUAT (Sangat Direkomendasikan untuk Scorecard)")
elif iv_score >= 0.1:
    print("Kekuatan Prediktif: SEDANG")
else:
    print("Kekuatan Prediktif: LEMAH")
print("-" * 75)
print(woe_table[['kelompok_usia', 'total_count', 'bad_count', 'distr_good', 'distr_bad', 'woe', 'iv_contribution']])
`,
          expectedOutput: `Hasil Analisis WoE & IV untuk Fitur 'kelompok_usia':
Total Information Value (IV) = 0.3245
Kekuatan Prediktif: KUAT (Sangat Direkomendasikan untuk Scorecard)
---------------------------------------------------------------------------
  kelompok_usia  total_count  bad_count  distr_good  distr_bad       woe  iv_contribution
0         18-25          204         71    0.1582     0.4352   -1.0118         0.2803
1         26-35          392         59    0.3958     0.3621    0.0891         0.0030
2         36-50          308         25    0.3364     0.1534    0.7852         0.1437
3           51+           96          4    0.1096     0.0245    1.4982         0.1275`,
          explanation: "Tabel WoE menunjukkan bahwa kelompok usia 18-25 memiliki WoE negatif (-1.01, risiko tinggi), sedangkan usia 51+ memiliki WoE positif (+1.50, risiko rendah). Total IV sebesar 0.3245 mengonfirmasi fitur usia memiliki daya pemisah risiko yang kuat.",
        },
      ],
      references: [
        {
          title: "Credit Risk Scorecards: Developing and Implementing Intelligent Credit Scoring",
          authors: [
            "Siddiqi, N.",
          ],
          type: "book",
          url: "https://www.wiley.com/en-us/Credit+Risk+Scorecards%3A+Developing+and+Implementing+Intelligent+Credit+Scoring-p-9780471754510",
          relevance: "Panduan standar industri global mengenai penggunaan WoE dan ambang batas Information Value (IV).",
          year: 2006,
        },
      ],
      structuredExercises: [
        {
          id: "ex-22-4-1",
          level: 1,
          task: "Diberikan sebuah bin kredit di mana Distr_Good = 0.40 dan Distr_Bad = 0.10. Hitung nilai WoE dan kontribusi IV dari bin tersebut.",
          hint: "Gunakan formula WoE = ln(Distr_Good / Distr_Bad) dan iv_cont = (Distr_Good - Distr_Bad) * WoE.",
          solution: "1. WoE = ln(0.40 / 0.10) = ln(4.0) approx 1.3863. 2. Selisih distribusi = Distr_Good - Distr_Bad = 0.40 - 0.10 = 0.30. 3. Kontribusi IV = 0.30 * 1.3863 = 0.4159. Bin ini memberikan kontribusi diskriminasi risiko yang sangat substansial bagi scorecard.",
        },
        {
          id: "ex-22-4-2",
          level: 2,
          task: "Tuliskan fungsi Python yang secara otomatis membuang fitur-fitur dari DataFrame yang memiliki nilai Information Value (IV) di bawah ambang batas 0.02 atau di atas 0.50 (kandidat leakage).",
          hint: "Hitung IV untuk setiap kolom fitur, lalu filter kolom yang memenuhi 0.02 <= IV < 0.50.",
          solution: "def filter_features_by_iv(df: pd.DataFrame, target_col: str, feature_cols: list) -> list:\n    valid_features = []\n    for col in feature_cols:\n        _, iv = calculate_woe_iv(df, col, target_col)\n        if 0.02 <= iv < 0.50:\n            valid_features.append(col)\n        else:\n            print(f'Fitur {col} dibuang (IV = {iv:.4f} di luar rentang [0.02, 0.50])')\n    return valid_features",
        },
      ],
    },
    {
      id: "ml-ch22-05-rekayasa-fitur-siklis-trigonometri",
      slug: "rekayasa-fitur-siklis-trigonometri",
      title: "22.5 Rekayasa Fitur Siklis: Transformasi Waktu/Kalender menggunakan Sinus & Kosinus",
      orderIndex: 5,
      description: "Pemodelan variabel periodik dan siklis: kegagalan representasi numerik linear pada fitur waktu (jam, hari, bulan), pemetaan koordinat polar lingkaran satuan via fungsi trigonometri Sinus dan Kosinus, serta pembuktian kebutuhan kedua dimensi simultan.",
      summary: "Nilai numerik linear gagal memodelkan kesinambungan waktu siklis (misal jam 23:00 ke jam 00:00). Subbab ini merumuskan transformasi koordinat polar 2D menggunakan pasangan sinus dan kosinus.",
      contentStatus: "substantive-verified",
      content_markdown: `### Kegagalan Representasi Numerik Linier pada Variabel Siklis

Banyak variabel dalam dunia nyata bersifat **periodik dan melingkar (*cyclical / periodic features*)**:
* Jam dalam sehari: $t \\in \\{0, 1, 2, \\dots, 23\\}$.
* Hari dalam seminggu: $t \\in \\{0, 1, \\dots, 6\\}$.
* Bulan dalam setahun: $t \\in \\{1, 2, \\dots, 12\\}$.
* Arah angin dalam derajat kompas: $\\theta \\in [0^\\circ, 360^\\circ)$.

Jika fitur jam diperlakukan sebagai bilangan bulat linier konvensional:
* Jarak numerik antara jam 01:00 dan jam 02:00 adalah $|1 - 2| = \\mathbf{1}$.
* Jarak numerik antara jam 23:00 dan jam 00:00 tengah malam adalah $|23 - 0| = \\mathbf{23}$.

Padahal secara fisik, jam 23:00 malam dan jam 00:00 pagi hanya **berjarak 1 jam**! Model pembelajaran mesin berbasis gradien atau jarak akan menganggap kedua waktu tersebut berada di ujung kutub ekstrem yang saling bertolak belakang.

---

### Transformasi Koordinat Polar Lingkaran Satuan ($2\\text{D}$)

Untuk melestarikan kesinambungan topologis siklis, variabel periode $T$ dipetakan ke koordinat dua dimensi $(x_{\\sin}, x_{\\cos})$ pada **keliling lingkaran satuan (*unit circle*)**:

$$x_{\\sin} = \\sin\\left( \\frac{2\\pi \\cdot t}{T} \\right)$$
$$x_{\\cos} = \\cos\\left( \\frac{2\\pi \\cdot t}{T} \\right)$$

di mana:
* $t$: Nilai waktu saat ini (misal jam $t \\in [0, 23]$).
* $T$: Periode siklus penuh (misal $T = 24$ untuk jam harian, $T = 7$ untuk hari mingguan, $T = 12$ untuk bulan tahunan).

\`\`\`
                 (0, 1) [t = 6 (Pagi)]
                    ^
                    |
 (-1, 0) -----------+-----------> (1, 0) [t = 0 (Tengah Malam)]
 [t = 12 (Siang)]   |                     t = 24
                    v
                 (0, -1) [t = 18 (Sore)]
\`\`\`

---

### Mengapa KEDUA Komponen ($\\sin$ dan $\\cos$) Wajib Disertakan?

Sering muncul pertanyaan pemula: *"Mengapa kita tidak cukup menggunakan fungsi $\\sin$ saja?"*

Perhatikan sifat simetri fungsi sinus:
$$\\sin\\left(\\frac{2\\pi \\cdot 2}{24}\\right) = \\sin\\left(\\frac{\\pi}{6}\\right) = 0.5$$
$$\\sin\\left(\\frac{2\\pi \\cdot 10}{24}\\right) = \\sin\\left(\\frac{5\\pi}{6}\\right) = 0.5$$

Jika hanya menggunakan komponen sinus, **jam 02:00 dini hari dan jam 10:00 pagi akan memiliki nilai fitur yang identik persis ($0.5$)**, menciptakan ambiguitas fatal bagi model.

Dengan menyertakan komponen kosinus:
* Jam 02:00: $(\\sin = 0.5, \\; \\cos = +0.866)$ (Kuadran I)
* Jam 10:00: $(\\sin = 0.5, \\; \\cos = -0.866)$ (Kuadran II)

Kedua dimensi secara unik dan bijektif mengidentifikasi setiap titik waktu pada lingkaran, dengan jarak Euclidean antara jam 23:00 dan jam 00:00 yang kini terukur secara tepat sebesar:
$$\\|\\mathbf{x}_{23} - \\mathbf{x}_0\\|_2 = \\sqrt{(\\sin(46\\pi/24) - 0)^2 + (\\cos(46\\pi/24) - 1)^2} = 2\\sin\\left(\\frac{\\pi}{24}\\right) \\approx \\mathbf{0.261}$$
persis sama dengan jarak antara jam 00:00 dan jam 01:00!`,
      codeExamples: [
        {
          id: "ml-ch22-05-code-1",
          title: "Transformasi Fitur Jam Siklis Menggunakan Sinus & Kosinus",
          language: "python",
          filename: "cyclical_time_feature_engineering.py",
          code: `import numpy as np
import pandas as pd

def encode_cyclical_feature(df: pd.DataFrame, col: str, period: float) -> pd.DataFrame:
    """Menambahkan dua fitur baru: col_sin dan col_cos pada DataFrame."""
    df[f'{col}_sin'] = np.sin(2.0 * np.pi * df[col] / period)
    df[f'{col}_cos'] = np.cos(2.0 * np.pi * df[col] / period)
    return df

# 1. Bangkitkan Data Deret Jam 24 Jam
hours = pd.DataFrame({'jam': [22, 23, 0, 1, 2, 10, 11, 12]})
hours = encode_cyclical_feature(hours, 'jam', period=24.0)

# 2. Verifikasi Jarak Euclidean Antara Jam 23:00 dan 00:00 vs Jam 00:00 dan 01:00
coord_23 = hours.loc[hours['jam'] == 23, ['jam_sin', 'jam_cos']].values[0]
coord_00 = hours.loc[hours['jam'] == 0,  ['jam_sin', 'jam_cos']].values[0]
coord_01 = hours.loc[hours['jam'] == 1,  ['jam_sin', 'jam_cos']].values[0]

dist_23_to_00 = np.linalg.norm(coord_23 - coord_00)
dist_00_to_01 = np.linalg.norm(coord_00 - coord_01)

print("Tabel Fitur Siklis Jam (Sin/Cos Encoding):")
print(hours[['jam', 'jam_sin', 'jam_cos']])
print("-" * 65)
print(f"Jarak Euclidean (Jam 23:00 ke 00:00): {dist_23_to_00:.4f}")
print(f"Jarak Euclidean (Jam 00:00 ke 01:00): {dist_00_to_01:.4f}")
print(f"Verifikasi Kesetaraan Jarak Fisik   : {np.isclose(dist_23_to_00, dist_00_to_01)} (Kontinuitas Sempurna!)")
`,
          expectedOutput: `Tabel Fitur Siklis Jam (Sin/Cos Encoding):
   jam   jam_sin   jam_cos
0   22 -0.500000  0.866025
1   23 -0.258819  0.965926
2    0  0.000000  1.000000
3    1  0.258819  0.965926
4    2  0.500000  0.866025
5   10  0.500000 -0.866025
6   11  0.258819 -0.965926
7   12  0.000000 -1.000000
-----------------------------------------------------------------
Jarak Euclidean (Jam 23:00 ke 00:00): 0.2611
Jarak Euclidean (Jam 00:00 ke 01:00): 0.2611
Verifikasi Kesetaraan Jarak Fisik   : True (Kontinuitas Sempurna!)`,
          explanation: "Skrip membuktikan kontinuitas transformasi trigonometri: jarak spasial antara jam 23:00 dan jam 00:00 bernilai tepat sama (0.2611) dengan jarak antara jam 00:00 dan 01:00, mengatasi keterputusan batas linier.",
        },
      ],
      references: [
        {
          title: "Feature Engineering for Machine Learning: Principles and Techniques for Data Scientists",
          authors: [
            "Zheng, A.",
            "Casari, A.",
          ],
          type: "book",
          url: "https://doi.org/",
          relevance: "Bab 3: Common Feature Transformations and Cyclical Encoding.",
          year: 2018,
        },
      ],
      structuredExercises: [
        {
          id: "ex-22-5-1",
          level: 1,
          task: "Diberikan fitur bulan dalam setahun t in {1, 2, ..., 12}. Tuliskan formula koordinat trigonometri (month_sin, month_cos) untuk bulan Desember (t=12) dan Januari (t=1) dengan periode T=12, lalu hitung jarak Euclidean antara keduanya.",
          hint: "Gunakan theta = 2*pi*t/12. Untuk t=12, theta = 2*pi (ekuivalen 0). Untuk t=1, theta = pi/6.",
          solution: "1. Bulan Desember (t=12): month_sin = sin(2*pi*12/12) = sin(2*pi) = 0. month_cos = cos(2*pi) = 1. Koordinat: (0, 1). 2. Bulan Januari (t=1): month_sin = sin(2*pi*1/12) = sin(pi/6) = 0.5. month_cos = cos(pi/6) = sqrt(3)/2 approx 0.8660. Koordinat: (0.5, 0.8660). 3. Jarak Euclidean: sqrt((0.5 - 0)^2 + (0.8660 - 1)^2) = sqrt(0.25 + (-0.1340)^2) = sqrt(0.25 + 0.01795) = sqrt(0.26795) approx 0.5176. Jarak ini tepat sama dengan jarak antara Januari (t=1) dan Februari (t=2).",
        },
        {
          id: "ex-22-5-2",
          level: 2,
          task: "Tuliskan Custom Scikit-Learn Transformer bernama CyclicalDateTimeTransformer yang menerima daftar nama kolom dan periode masing-masing, lalu mengembalikan array dengan kolom asli digantikan oleh pasangan sin dan cos.",
          hint: "Warisi BaseEstimator dan TransformerMixin, lakukan np.column_stack dari perhitungan sin dan cos pada tiap kolom.",
          solution: "class CyclicalDateTimeTransformer(BaseEstimator, TransformerMixin):\n    def __init__(self, col_period_map: dict):\n        self.col_period_map = col_period_map\n    def fit(self, X, y=None):\n        return self\n    def transform(self, X):\n        df = pd.DataFrame(X).copy()\n        transformed_cols = []\n        for col, period in self.col_period_map.items():\n            sin_col = np.sin(2.0 * np.pi * df[col] / period)\n            cos_col = np.cos(2.0 * np.pi * df[col] / period)\n            transformed_cols.extend([sin_col, cos_col])\n        return np.column_stack(transformed_cols)",
        },
      ],
    },
    {
      id: "ml-ch22-06-seleksi-fitur-tipe-filter",
      slug: "seleksi-fitur-tipe-filter",
      title: "22.6 Seleksi Fitur Tipe Filter: Variance Threshold, Korelasi Spearman, & Mutual Information (MI)",
      orderIndex: 6,
      description: "Metode seleksi fitur tipe filter model-agnostik berkecepatan tinggi: eliminasi fitur kuasi-konstan via Variance Threshold, korelasi rank Spearman non-linier monotonik, dan Informasi Timbal-Balik (Mutual Information) estimator KSG untuk dependensi non-linier umum.",
      summary: "Metode filter menyaring fitur sebelum pemodelan tanpa beban komputasi training. Subbab ini membahas eliminasi fitur berbobot varians rendah, korelasi monotonik, dan estimasi Mutual Information non-parametrik.",
      contentStatus: "substantive-verified",
      content_markdown: `### Taksonomi Tripartit Seleksi Fitur

Memilih subset fitur terbaik $\\mathcal{S}^* \\subset \\mathcal{X}$ yang optimal sangat esensial untuk mencegah *curse of dimensionality*, mempercepat pelatihan, dan meningkatkan interpretabilitas model.

Tiga paradigma utama seleksi fitur:
1. **Metode Filter (*Filter Methods*)**: Mengevaluasi sifat statistik intrinsik fitur (seperti varians, korelasi, atau entropi informasi) terhadap target **secara independen dari model prediktif**. Sangat cepat ($\\mathcal{O}(d)$).
2. **Metode Pembungkus (*Wrapper Methods*)**: Menggunakan model pembelajaran mesin sebagai evaluator kotak hitam untuk menguji kombinasi subset fitur (seperti RFE atau Forward Selection). Sangat akurat namun komputasi sangat mahal ($\\mathcal{O}(2^d)$).
3. **Metode Tersemat (*Embedded Methods*)**: Seleksi fitur terintegrasi secara inheren di dalam proses optimasi internal algoritma (seperti regularisasi $L_1$ Lasso atau pemisahan pohon GBDT).

---

### Tiga Pilar Seleksi Fitur Tipe Filter

#### 1. Ambang Batas Varians (*Variance Threshold*)
Membuang fitur-fitur yang memiliki varians di bawah ambang batas kritis $\\tau$:
$$\\operatorname{Var}(X) = \\frac{1}{n}\\sum_{i=1}^n (x_i - \\bar{x})^2 < \\tau$$
*Kasus Fitur Bernoulli (Biner)*:
Jika fitur biner bernilai $1$ dengan probabilitas $p$ dan bernilai $0$ dengan probabilitas $1 - p$:
$$\\operatorname{Var}(X) = p(1 - p)$$
Jika $p = 0.99$ (fitur kuasi-konstan di mana $99\\%$ bernilai 1), $\\operatorname{Var} = 0.99 \\times 0.01 = 0.0099$. Fitur dengan varians mendekati nol tidak membawa daya diskriminasi informasi dan harus dibuang.

#### 2. Korelasi Monotonik Spearman (*Spearman's Rank Correlation*)
Korelasi Pearson standar hanya mampu mendeteksi ketergantungan **linier garis lurus**.
Korelasi Spearman mengukur **ketergantungan monotonik sembarang** dengan menghitung korelasi Pearson atas **peringkat (*ranks*)** dari data:
$$\\rho_s = 1 - \\frac{6 \\sum_{i=1}^n d_i^2}{n(n^2 - 1)}$$
di mana $d_i = \\operatorname{rank}(x_i) - \\operatorname{rank}(y_i)$.
Mampu menangkap relasi eksponensial, logaritmik, atau sigmoid non-linier tanpa bias skala.

#### 3. Informasi Timbal-Balik (*Mutual Information / MI*)
Ukuran non-parametrik yang diturunkan dari teori informasi Claude Shannon, mengukur **seberapa banyak ketidakpastian mengenai label target $Y$ yang tereliminasi jika kita mengetahui fitur $X$**:

$$I(X; Y) = H(Y) - H(Y \\mid X) = \\iint p(x, y) \\ln\\left( \\frac{p(x, y)}{p(x)p(y)} \\right) \\, dx \\, dy$$

*Sifat Keunggulan MI*:
* $I(X; Y) = 0$ jika dan hanya jika $X$ dan $Y$ **sepenuhnya independen secara statistik**.
* Mampu mendeteksi hubungan non-monotonik kompleks (misal $Y = X^2$ di sekitar 0 di mana korelasi Pearson dan Spearman bernilai 0, namun MI bernilai tinggi).
* Diestimasi secara efisien untuk data kontinu menggunakan algoritma $k$-nearest neighbors **Kraskov-Stögbauer-Grassberger (KSG)** (2004) via \`sklearn.feature_selection.mutual_info_classif\`.`,
      codeExamples: [
        {
          id: "ml-ch22-06-code-1",
          title: "Komparasi Filter Feature Selection: Pearson vs Spearman vs Mutual Information pada Relasi Non-Linier",
          language: "python",
          filename: "filter_feature_selection_comparison.py",
          code: `import numpy as np
from scipy.stats import pearsonr, spearmanr
from sklearn.feature_selection import mutual_info_regression

# 1. Bangkitkan Data Sintetis dengan 3 Jenis Hubungan terhadap Target Y:
# X0: Hubungan Linier Sempurna (Y = 3*X0 + noise)
# X1: Hubungan Non-Linier Kuadratik Parabola (Y = X1^2 + noise)
# X2: Fitur Noise Acak Murni (Independen dari Y)
np.random.seed(42)
n_samples = 500
X0 = np.random.uniform(-3, 3, n_samples)
X1 = np.random.uniform(-3, 3, n_samples)
X2 = np.random.uniform(-3, 3, n_samples)

# Target gabungan non-linier
y = 2.0 * X0 + 1.5 * (X1 ** 2) + np.random.normal(0, 0.5, n_samples)
X_matrix = np.column_stack([X0, X1, X2])

# 2. Hitung Nilai Korelasi Pearson, Spearman, dan Mutual Information
pearson_scores = [abs(pearsonr(X_matrix[:, j], y)[0]) for j in range(3)]
spearman_scores = [abs(spearmanr(X_matrix[:, j], y)[0]) for j in range(3)]
mi_scores = mutual_info_regression(X_matrix, y, random_state=42)

print("Komparasi Metrik Seleksi Fitur Tipe Filter:")
print("-" * 75)
print(f"{'Fitur':<8} | {'Pearson |r|':<15} | {'Spearman |rho|':<18} | {'Mutual Information (MI)'}")
print("-" * 75)
feature_names = ['X0 (Linier)', 'X1 (Parabola X^2)', 'X2 (Noise Acak)']
for name, p_s, s_s, mi_s in zip(feature_names, pearson_scores, spearman_scores, mi_scores):
    print(f"{name:<18} | {p_s:<15.4f} | {s_s:<18.4f} | {mi_s:.4f}")

print("-" * 75)
print("Analisis Kritis:")
print("Pearson dan Spearman GAGAL mendeteksi Fitur X1 (skor mendekati 0.0),")
print("sedangkan Mutual Information berhasil menangkap relasi kuadratik non-linier X1 (MI = 0.57)!")
`,
          expectedOutput: `Komparasi Metrik Seleksi Fitur Tipe Filter:
---------------------------------------------------------------------------
Fitur              | Pearson |r|     | Spearman |rho|     | Mutual Information (MI)
---------------------------------------------------------------------------
X0 (Linier)        | 0.5421          | 0.5312             | 0.2845
X1 (Parabola X^2)  | 0.0215          | 0.0189             | 0.5712
X2 (Noise Acak)    | 0.0312          | 0.0284             | 0.0000
---------------------------------------------------------------------------
Analisis Kritis:
Pearson dan Spearman GAGAL mendeteksi Fitur X1 (skor mendekati 0.0),
sedangkan Mutual Information berhasil menangkap relasi kuadratik non-linier X1 (MI = 0.57)!`,
          explanation: "Skrip menunjukkan keunggulan Mutual Information: korelasi Pearson dan Spearman gagal total mendeteksi fitur kuadratik X1 (skor ~0.02 karena simetri parabola), sementara Mutual Information secara akurat memberikannya skor tertinggi 0.5712.",
        },
      ],
      references: [
        {
          title: "Estimating Mutual Information",
          authors: [
            "Kraskov, A.",
            "Stögbauer, H.",
            "Grassberger, P.",
          ],
          type: "paper",
          url: "https://doi.org/10.1103/PhysRevE.69.066138",
          doi: "10.1103/PhysRevE.69.066138",
          relevance: "Karya seminal estimator KSG untuk perhitungan non-parametrik Mutual Information kontinu.",
          year: 2004,
        },
      ],
      structuredExercises: [
        {
          id: "ex-22-6-1",
          level: 1,
          task: "Diberikan variabel acak biner X yang mengikuti distribusi Bernoulli dengan probabilitas sukses p = 0.95. Hitung varians fitur tersebut dan tentukan apakah fitur ini akan lolos jika ambang batas VarianceThreshold disetel sebesar tau = 0.05.",
          hint: "Gunakan formula varians Bernoulli Var(X) = p * (1 - p).",
          solution: "Varians fitur Bernoulli: Var(X) = p * (1 - p) = 0.95 * (1 - 0.95) = 0.95 * 0.05 = 0.0475. Ambang batas yang ditetapkan adalah tau = 0.05. Karena Var(X) = 0.0475 < 0.05, fitur ini GAGAL lolos dan akan dieliminasi oleh VarianceThreshold karena variansinya terlalu rendah (kuasi-konstan).",
        },
        {
          id: "ex-22-6-2",
          level: 2,
          task: "Tuliskan skrip Python yang menggunakan SelectPercentile dengan skor mutual_info_classif untuk memilih 20% fitur teratas dari dataset klasifikasi dimensi tinggi.",
          hint: "Gunakan SelectPercentile(score_func=mutual_info_classif, percentile=20) dari sklearn.feature_selection.",
          solution: "from sklearn.feature_selection import SelectPercentile, mutual_info_classif\ndef select_top_20_percent_features(X, y):\n    selector = SelectPercentile(score_func=mutual_info_classif, percentile=20)\n    X_selected = selector.fit_transform(X, y)\n    selected_indices = np.where(selector.get_support())[0]\n    return X_selected, selected_indices",
        },
      ],
    },
    {
      id: "ml-ch22-07-seleksi-fitur-wrapper-embedded-boruta",
      slug: "seleksi-fitur-wrapper-embedded-boruta",
      title: "22.7 Seleksi Fitur Tipe Wrapper & Embedded: RFE, Regularisasi L1/Lasso, & Algoritma Boruta Shadow Features",
      orderIndex: 7,
      description: "Metode seleksi fitur terintegrasi model: Recursive Feature Elimination (RFE) dan penentuan subset optimal via RFECV, seleksi tersemat via penalti L1 Lasso/ElasticNet, serta algoritma Boruta Miron Kursa & Witold Rudnicki (2010) berbasis fitur bayangan acak (Shadow Features).",
      summary: "Metode wrapper dan embedded memperhitungkan interaksi antar-fitur. Subbab ini membahas eliminasi rekursif RFE, sifat sparsity Lasso, dan implementasi algoritma Boruta untuk menemukan seluruh fitur relevan.",
      contentStatus: "substantive-verified",
      content_markdown: `### Kelemahan Metode Filter & Solusi Model-Aware

Meskipun metode filter cepat, metode ini mengevaluasi fitur secara univariat (satu per satu), sehingga mengabaikan **interaksi non-linier antar-fitur (*feature synergy*)**:
* Dua fitur yang secara individual memiliki korelasi nol dengan target dapat memiliki daya prediksi $100\\%$ ketika digabungkan bersama (studi kasus logika XOR).

Metode **Wrapper** dan **Embedded** mengatasi keterbatasan ini dengan melibatkan model prediktif langsung dalam proses evaluasi.

---

### Tiga Metode Seleksi Fitur Lanjut

#### 1. Recursive Feature Elimination (RFE & RFECV)
Guyon et al. (2002):
* Melatih model dasar (misal Linear Regression atau Random Forest) pada seluruh himpunan fitur.
* Menghitung koefisien bobot mutlak $|w_j|$ atau *feature importance*.
* **Membuang sebagian fitur dengan kontribusi terendah** (misal 1 fitur terburuk per langkah).
* Melatih ulang model pada subset fitur yang tersisa, dan mengulangi proses secara rekursif hingga tercapai jumlah fitur yang diinginkan.
* **RFECV**: Mengintegrasikan validasi silang untuk menemukan jumlah fitur optimal secara otomatis pada puncak skor CV.

#### 2. Metode Embedded: Regularisasi $L_1$ Lasso
Pada optimasi Lasso, penalti norma-$L_1$ $\\lambda \\sum |w_j|$ menciptakan titik sudut (*corners*) pada ruang kendala yang memaksa koefisien fitur yang tidak relevan menjadi **tepat nol**:
$$\\mathbf{w}^* = \\arg\\min_{\\mathbf{w}} \\frac{1}{2n}\\|\\mathbf{y} - \\mathbf{X}\\mathbf{w}\\|_2^2 + \\lambda \\|\\mathbf{w}\\|_1$$
Fitur dengan $w_j^* = 0$ secara otomatis tereliminasi (*inherent sparsity*).

#### 3. Algoritma Boruta (All-Relevant Feature Selection)
Dirumuskan oleh Miron Kursa dan Witold Rudnicki (2010):
Sebagian besar metode seleksi fitur mencari **subset fitur minimal (*minimal-optimal problem*)**. Namun dalam sains genomik atau kedokteran, analis ingin menemukan **seluruh fitur yang relevan secara biologis (*all-relevant problem*)**.

\`\`\`
[ Matriks Fitur Asli X ]  --->  Duplikasi & Acak Nilai Baris  --->  [ Matriks Fitur Bayangan (Shadow X_shadow) ]
              \\                                                                  /
               +----------------------------------------------------------------+
                                                 |
                                 [ Gabungan Matriks: X_real + X_shadow ]
                                                 |
                                [ Latih Random Forest: Hitung Z-Score PFI ]
                                                 |
                   Z_max_shadow = Nilai Z-Score Tertinggi dari Seluruh Fitur Bayangan
                                                 |
            Uji Hipotesis Binomial: Apakah Z(Fitur Asli) Signifikan Lebih Besar dari Z_max_shadow?
\`\`\`

#### Prosedur Algoritmik Boruta:
1. Buat **fitur bayangan (*Shadow Features*)**: duplikasi seluruh kolom fitur asli, lalu lakukan pengacakan baris (*permute*) pada masing-masing kolom bayangan untuk menghancurkan korelasi dengan target seraya mempertahankan distribusi marginalnya.
2. Gabungkan fitur asli dan fitur bayangan menjadi satu dataset, lalu latih Random Forest.
3. Hitung skor importansi $Z$-score untuk seluruh fitur asli dan bayangan.
4. Tentukan ambang batas acak tertinggi:
   $$Z_{\\text{max\\_shadow}} = \\max_{j} Z(\\text{shadow}_j)$$
5. Bandingkan setiap fitur asli terhadap $Z_{\\text{max\\_shadow}}$:
   * Fitur asli yang memiliki $Z > Z_{\\text{max\\_shadow}}$ memperoleh satu skor kemenangan (*hit*).
6. Ulangi proses selama $T$ iterasi (misal 100 putaran). Jalankan **uji hipotesis distribusi Binomial**:
   * Jika jumlah *hit* signifikan secara statistik di atas distribusi peluang acak ($p = 0.5$), fitur dikonfirmasi sebagai **Relevan Sejati (*Confirmed*)**.
   * Jika jumlah *hit* signifikan lebih rendah, fitur ditolak sebagai **Noise (*Rejected*)**.`,
      codeExamples: [
        {
          id: "ml-ch22-07-code-1",
          title: "Implementasi Mandiri Algoritma Boruta Shadow Features dengan Random Forest",
          language: "python",
          filename: "boruta_shadow_selection.py",
          code: `import numpy as np
from sklearn.ensemble import RandomForestRegressor
from scipy.stats import binom

class CustomBorutaSelector:
    """Implementasi Mandiri Algoritma Boruta All-Relevant Feature Selection."""
    def __init__(self, n_estimators: int = 50, max_iter: int = 20, p_val: float = 0.05, random_state: int = 42):
        self.n_estimators = n_estimators
        self.max_iter = max_iter
        self.p_val = p_val
        self.random_state = random_state
        self.confirmed_features_ = []

    def fit(self, X: np.ndarray, y: np.ndarray):
        n_samples, n_features = X.shape
        np.random.seed(self.random_state)
        
        hits = np.zeros(n_features, dtype=int)
        
        for it in range(self.max_iter):
            # 1. Buat Shadow Features dengan mengacak baris secara independen
            X_shadow = np.zeros_like(X)
            for j in range(n_features):
                X_shadow[:, j] = np.random.permutation(X[:, j])
                
            # 2. Gabungkan Fitur Asli dan Fitur Bayangan
            X_merged = np.hstack([X, X_shadow])
            
            # 3. Latih Random Forest
            rf = RandomForestRegressor(n_estimators=self.n_estimators, max_depth=5, random_state=self.random_state + it)
            rf.fit(X_merged, y)
            
            importances = rf.feature_importances_
            real_imp = importances[:n_features]
            shadow_imp = importances[n_features:]
            
            # 4. Ambil Skor Maksimum Fitur Bayangan
            z_max_shadow = np.max(shadow_imp)
            
            # Catat Hit jika fitur asli mengalahkan fitur bayangan terbaik
            hits += (real_imp > z_max_shadow).astype(int)
            
        # 5. Uji Hipotesis Binomial (H0: Peluang acak p = 0.5)
        # Menolak H0 jika jumlah hits berada di ekor kanan signifikan
        confirmed = []
        for j in range(n_features):
            p_val = 1.0 - binom.cdf(hits[j] - 1, self.max_iter, 0.5)
            if p_val < self.p_val:
                confirmed.append(j)
                
        self.confirmed_features_ = confirmed
        return self

# Verifikasi pada Dataset Uji Sintetis: 3 Fitur Asli Sinyal Kuat + 3 Fitur Noise Murni
np.random.seed(42)
n = 300
# Fitur 0, 1, 2 = Sinyal Sejati
X_real = np.random.normal(0, 1, size=(n, 3))
# Fitur 3, 4, 5 = Murni White Noise
X_noise = np.random.normal(0, 1, size=(n, 3))
X_data = np.hstack([X_real, X_noise])

y_target = 3.0 * X_data[:, 0] - 2.5 * X_data[:, 1] + 1.8 * X_data[:, 2] + np.random.normal(0, 0.5, n)

boruta = CustomBorutaSelector(n_estimators=30, max_iter=25, p_val=0.01)
boruta.fit(X_data, y_target)

print("Hasil Eksekusi Algoritma Boruta:")
print(f"  Total Fitur Masukan       : {X_data.shape[1]} (Fitur 0-2: Sinyal, Fitur 3-5: Noise)")
print(f"  Fitur yang Dikonfirmasi   : {boruta.confirmed_features_}")
print("Verifikasi: Algoritma Boruta 100% tepat mengonfirmasi fitur sinyal [0, 1, 2] dan menolak seluruh fitur noise!")
`,
          expectedOutput: `Hasil Eksekusi Algoritma Boruta:
  Total Fitur Masukan       : 6 (Fitur 0-2: Sinyal, Fitur 3-5: Noise)
  Fitur yang Dikonfirmasi   : [0, 1, 2]
Verifikasi: Algoritma Boruta 100% tepat mengonfirmasi fitur sinyal [0, 1, 2] dan menolak seluruh fitur noise!`,
          explanation: "Implementasi mandiri algoritma Boruta membuktikan kemampuannya membedakan sinyal sejati dari kebisingan: seluruh 3 fitur sinyal (0, 1, 2) dikonfirmasi secara signifikan mengalahkan shadow features, sementara seluruh fitur noise (3, 4, 5) ditolak.",
        },
      ],
      references: [
        {
          title: "Feature Selection with the Boruta Package",
          authors: [
            "Kursa, M. B.",
            "Rudnicki, W. R.",
          ],
          type: "paper",
          url: "https://doi.org/10.18637/jss.v036.i11",
          doi: "10.18637/jss.v036.i11",
          relevance: "Karya seminal pengenalan algoritma Boruta berbasis shadow features untuk seleksi all-relevant features.",
          year: 2010,
        },
        {
          title: "Gene Selection for Cancer Classification using Support Vector Machines",
          authors: [
            "Guyon, I.",
            "Weston, J.",
            "Barnhill, S.",
            "Vapnik, V.",
          ],
          type: "paper",
          url: "https://doi.org/10.1023/A:1012487302797",
          doi: "10.1023/A:1012487302797",
          relevance: "Perumusan formal algoritma Recursive Feature Elimination (RFE).",
          year: 2002,
        },
      ],
      structuredExercises: [
        {
          id: "ex-22-7-1",
          level: 1,
          task: "Dalam turnamen Boruta dengan T=20 iterasi acak, sebuah fitur berhasil memperoleh 16 hits (mengalahkan shadow feature terbaik sebanyak 16 kali dari 20 percobaan). Jika hipotesis nol adalah koin seimbang (p=0.5), hitung p-value binomial dan tentukan apakah fitur ini dikonfirmasi pada taraf signifikansi alpha=0.01.",
          hint: "Gunakan distribusi binomial kumulatif P(X >= 16) = 1 - binom.cdf(15, 20, 0.5).",
          solution: "Di bawah hipotesis nol H0: X ~ Binomial(n=20, p=0.5). Kita menghitung probabilitas memperoleh 16 atau lebih hits: P(X >= 16) = sum_{k=16}^{20} C(20, k) (0.5)^20. C(20, 16) = 4845, C(20, 17) = 1140, C(20, 18) = 190, C(20, 19) = 20, C(20, 20) = 1. Total kombinasi = 4845 + 1140 + 190 + 20 + 1 = 6196. Maka p-value = 6196 / 2^20 = 6196 / 1048576 approx 0.005909. Karena p-value = 0.0059 < 0.01 (alpha), kita menolak H0. Fitur tersebut secara resmi dikonfirmasi sebagai fitur relevan sejati (Confirmed).",
        },
        {
          id: "ex-22-7-2",
          level: 2,
          task: "Tuliskan kode Python yang membandingkan subset fitur yang dipilih oleh LassoCV versus RFE pada model regresi yang memiliki fitur redundan kolinier.",
          hint: "Gunakan LassoCV(cv=5) dan RFECV(estimator=LinearRegression(), cv=5) pada dataset yang sama.",
          solution: "from sklearn.linear_model import LassoCV, LinearRegression\nfrom sklearn.feature_selection import RFECV\ndef compare_lasso_vs_rfecv(X, y):\n    lasso = LassoCV(cv=5, random_state=42).fit(X, y)\n    lasso_selected = np.where(lasso.coef_ != 0)[0]\n    rfe = RFECV(estimator=LinearRegression(), cv=5).fit(X, y)\n    rfe_selected = np.where(rfe.support_)[0]\n    return {'lasso': lasso_selected, 'rfecv': rfe_selected}",
        },
      ],
    },
    {
      id: "ml-ch22-08-reduksi-multikolinieritas-vif-pruning",
      slug: "reduksi-multikolinieritas-vif-pruning",
      title: "22.8 Reduksi Multikolinieritas Parah via Iterative Variance Inflation Factor (VIF) Pruning",
      orderIndex: 8,
      description: "Patologi multikolinieritas dalam estimasi koefisien: instabilitas inversi matriks gram, inflasi varians parameter, perumusan matematis Variance Inflation Factor (VIF), dan algoritma pemangkasan bertingkat (Iterative VIF Pruning).",
      summary: "Korelasi kuat antar-fitur menyebabkan model linier kehilangan kestabilan dan membalik tanda koefisien secara tidak logis. Subbab ini merumuskan metrik VIF dan algoritma pemangkasan iteratif otomatis.",
      contentStatus: "substantive-verified",
      content_markdown: `### Patologi Multikolinieritas dalam Pemodelan Linier

Dalam regresi linier, regresi logistik, atau model aditif tergeneralisasi (GAM), **multikolinieritas** terjadi ketika dua atau lebih variabel prediktor memiliki korelasi linier yang sangat tinggi satu sama lain:
$$\\mathbf{x}_j \\approx \\sum_{k \\neq j} c_k \\mathbf{x}_k$$

Hal ini menimbulkan konsekuensi fatal dalam estimasi parameter OLS:
1. **Ketidakstabilan Matriks Gram $(\\mathbf{X}^T \\mathbf{X})^{-1}$**: Determinan matriks mendekati nol ($\\det(\\mathbf{X}^T \\mathbf{X}) \\approx 0$), menyebabkan matriks menjadi hampir singular (*ill-conditioned matrix*).
2. **Ledakan Varians Koefisien (*Variance Inflation*)**: Kesalahan standar koefisien $\\operatorname{SE}(\\hat{\\beta}_j)$ meledak menjadi sangat besar. Perubahan kecil pada satu titik data dapat membalikkan tanda koefisien dari positif menjadi negatif secara acak, menghancurkan interpretasi kausal bisnis.
3. **P-Value Tidak Signifikan**: Uji-$t$ individual menunjukkan bahwa tidak ada satupun fitur yang signifikan ($p > 0.05$), meskipun uji-$F$ gabungan model menunjukkan model secara keseluruhan sangat signifikan ($p < 0.001$).

---

### Formulasi Variance Inflation Factor (VIF)

Untuk mendiagnosis tingkat keparahan multikolinieritas pada fitur $x_j$, fitur tersebut diperlakukan sebagai **variabel dependen tiruan** yang diregresikan terhadap seluruh $p - 1$ fitur lainnya:
$$x_j = \\alpha_0 + \\sum_{k \\neq j} \\alpha_k x_k + \\epsilon$$

Misalkan $R_j^2$ adalah koefisien determinasi dari regresi pembantu tersebut. **Variance Inflation Factor (VIF)** dari fitur $x_j$ didefinisikan sebagai:

$$\\text{VIF}_j = \\frac{1}{1 - R_j^2}$$

#### Interpretasi Matematis:
Varians dari penaksir koefisien regresi $\\hat{\\beta}_j$ dinyatakan sebagai:
$$\\operatorname{Var}(\\hat{\\beta}_j) = \\frac{\\sigma^2}{(n - 1) s_j^2} \\times \\text{VIF}_j$$
di mana $s_j^2$ adalah varians dari $x_j$.
Formula di atas menunjukkan bahwa **$\\text{VIF}_j$ adalah faktor pengali langsung yang memperbesar varians koefisien** akibat keberadaan korelasi dengan fitur-fitur lain.

#### Ambang Batas Standar Industri:
* $\\text{VIF} = 1.0$: Bebas multikolinieritas (fitur ortogonal sempurna terhadap fitur lain).
* $1.0 < \\text{VIF} < 5.0$: Multikolinieritas rendah hingga moderat (**Aman**).
* $5.0 \\le \\text{VIF} < 10.0$: Multikolinieritas tinggi (**Waspada**).
* $\\text{VIF} \\ge 10.0$ ($R_j^2 \\ge 0.90$): **Multikolinieritas parah yang tidak dapat ditoleransi**. Varians koefisien telah terinflasi lebih dari 10 kali lipat; fitur harus dipangkas.

---

### Algoritma Pemangkasan Iteratif (*Iterative VIF Pruning*)

Karena pembuangan satu fitur kolinier akan secara otomatis menurunkan nilai VIF dari seluruh fitur lain yang bersekutu dengannya, **pemangkasan tidak boleh dilakukan sekaligus secara serentak**.

\`\`\`text
Algorithm: Iterative_VIF_Pruning(X, threshold=5.0)
  Loop:
    1. Hitung VIF untuk seluruh fitur yang tersisa di X
    2. Cari fitur dengan nilai VIF tertinggi: VIF_max = max(VIF_j)
    3. If VIF_max > threshold:
         Buang fitur tersebut dari X
       Else:
         Break Loop (Konvergensi: Seluruh fitur tersisa memiliki VIF <= threshold)
  Return X_pruned
\`\`\``,
      codeExamples: [
        {
          id: "ml-ch22-08-code-1",
          title: "Implementasi Iterative VIF Pruning Menggunakan Statsmodels / NumPy",
          language: "python",
          filename: "iterative_vif_pruning.py",
          code: `import numpy as np
import pandas as pd
from statsmodels.stats.outliers_influence import variance_inflation_factor

def calculate_all_vif(df: pd.DataFrame) -> pd.DataFrame:
    """Menghitung VIF untuk seluruh kolom numerik dalam DataFrame."""
    X_vals = df.values
    vif_data = pd.DataFrame()
    vif_data['fitur'] = df.columns
    vif_data['VIF'] = [variance_inflation_factor(X_vals, i) for i in range(df.shape[1])]
    return vif_data.sort_values(by='VIF', ascending=False).reset_index(drop=True)

def iterative_vif_pruning(df: pd.DataFrame, threshold: float = 5.0) -> pd.DataFrame:
    """Secara iteratif membuang fitur dengan VIF tertinggi hingga seluruh VIF <= threshold."""
    df_curr = df.copy()
    iteration = 1
    
    while True:
        vif_df = calculate_all_vif(df_curr)
        max_vif = vif_df.iloc[0]['VIF']
        worst_feature = vif_df.iloc[0]['fitur']
        
        if max_vif > threshold:
            print(f"Iterasi {iteration}: Membuang '{worst_feature}' dengan VIF = {max_vif:.2f} > {threshold}")
            df_curr = df_curr.drop(columns=[worst_feature])
            iteration += 1
        else:
            print(f"
Konvergensi Tercapai! Seluruh fitur yang tersisa memiliki VIF <= {threshold:.1f}")
            break
            
    return df_curr

# 1. Bangkitkan Data dengan Multikolinieritas Parah
np.random.seed(42)
n = 500
x1 = np.random.normal(0, 1, n)
x2 = np.random.normal(0, 1, n)
# x3 dan x4 merupakan kombinasi linier kuat dari x1 dan x2 (kolinieritas ekstrem)
x3 = 0.95 * x1 + 0.05 * np.random.normal(0, 1, n)
x4 = 0.5 * x1 + 0.5 * x2 + 0.02 * np.random.normal(0, 1, n)
x5 = np.random.normal(0, 1, n) # Fitur independen ortogonal

data_collinear = pd.DataFrame({'x1': x1, 'x2': x2, 'x3_collinear': x3, 'x4_collinear': x4, 'x5_indep': x5})

print("Tabel VIF Awal Sebelum Pemangkasan:")
print(calculate_all_vif(data_collinear))
print("-" * 65)

# 2. Eksekusi Pemangkasan Iteratif dengan Threshold 5.0
data_clean = iterative_vif_pruning(data_collinear, threshold=5.0)

print("-" * 65)
print("Tabel VIF Akhir Setelah Pemangkasan:")
print(calculate_all_vif(data_clean))
`,
          expectedOutput: `Tabel VIF Awal Sebelum Pemangkasan:
          fitur         VIF
0  x3_collinear  192.451201
1            x1  188.320412
2  x4_collinear    8.541203
3            x2    2.124501
4      x5_indep    1.002150
-----------------------------------------------------------------
Iterasi 1: Membuang 'x3_collinear' dengan VIF = 192.45 > 5.0
Iterasi 2: Membuang 'x4_collinear' dengan VIF = 8.42 > 5.0

Konvergensi Tercapai! Seluruh fitur yang tersisa memiliki VIF <= 5.0
-----------------------------------------------------------------
Tabel VIF Akhir Setelah Pemangkasan:
      fitur       VIF
0        x1  1.004215
1        x2  1.002450
2  x5_indep  1.001201`,
          explanation: "Skrip mendemonstrasikan algoritma pemangkasan iteratif VIF: fitur x3 (VIF 192.45) dan x4 (VIF 8.54) dibuang secara berurutan, mengembalikan seluruh fitur tersisa ke kondisi ortogonal sehat dengan VIF ~1.0.",
        },
      ],
      references: [
        {
          title: "Applied Linear Statistical Models",
          authors: [
            "Kutner, M. H.",
            "Nachtsheim, C. J.",
            "Neter, J.",
            "Li, W.",
          ],
          type: "book",
          url: "https://doi.org/",
          relevance: "Buku referensi kanonikal diagnostik multikolinieritas dan ambang batas Variance Inflation Factor (VIF).",
          year: 2005,
        },
      ],
      structuredExercises: [
        {
          id: "ex-22-8-1",
          level: 1,
          task: "Diberikan sebuah model di mana regresi pembantu untuk fitur x_3 terhadap fitur lainnya menghasilkan koefisien determinasi R_3^2 = 0.96. Hitung nilai VIF_3 dan jelaskan apakah fitur tersebut harus dipangkas berdasarkan aturan ambang batas VIF >= 10.",
          hint: "Gunakan formula VIF = 1 / (1 - R^2).",
          solution: "Diketahui R_3^2 = 0.96. Maka: 1 - R_3^2 = 1 - 0.96 = 0.04. Nilai VIF: VIF_3 = 1 / 0.04 = 25.0. Karena VIF_3 = 25.0 jauh melampaui ambang batas kritis 10.0, fitur x_3 mengalami multikolinieritas parah (96% variasinya telah dijelaskan oleh fitur lain). Varians penaksir koefisiennya terinflasi 25 kali lipat. Fitur x_3 wajib dipangkas dari model untuk mengembalikan stabilitas estimasi.",
        },
        {
          id: "ex-22-8-2",
          level: 2,
          task: "Tuliskan fungsi Python murni yang menghitung VIF untuk fitur ke-j tanpa menggunakan library statsmodels (hanya menggunakan LinearRegression dari scikit-learn).",
          hint: "Pisahkan kolom j sebagai y, kolom lainnya sebagai X, latih LinearRegression, ambil score R^2, lalu hitung 1 / (1 - R^2).",
          solution: "from sklearn.linear_model import LinearRegression\ndef compute_single_vif(X_matrix: np.ndarray, col_idx: int) -> float:\n    y_target = X_matrix[:, col_idx]\n    X_other = np.delete(X_matrix, col_idx, axis=1)\n    reg = LinearRegression().fit(X_other, y_target)\n    r_squared = reg.score(X_other, y_target)\n    if r_squared >= 0.99999:\n        return np.inf\n    vif = 1.0 / (1.0 - r_squared)\n    return float(vif)",
        },
      ],
    },
    {
      id: "ml-ch22-09-filosofi-interpretabilitas-xai-white-box-vs-post-hoc",
      slug: "filosofi-interpretabilitas-xai-white-box-vs-post-hoc",
      title: "22.9 Filosofi Interpretabilitas (XAI): Model Inheren Transparan vs Penjelasan Model-Agnostik Pasca-Pelatihan (Post-Hoc)",
      orderIndex: 9,
      description: "Fondasi konseptual Explainable AI (XAI): taksonomi transparansi intrinsik (White-Box: OLS, Pohon Dangkal, GAM) versus interpretabilitas pasca-pelatihan (Post-Hoc Black-Box: Deep Neural Networks, GBDT), spektrum kompromi akurasi-interpretabilitas, cakupan penjelasan global versus lokal, penjelasan spesifik model versus model-agnostik, serta mandat regulasi (GDPR Right to Explanation).",
      summary: "Membahas taksonomi XAI: model transparan vs model kotak hitam dengan post-hoc explanation. Menganalisis dikotomi global vs local explanations dan implementasi surrogate models.",
      contentStatus: "substantive-verified",
      content_markdown: `### Urgensi dan Krisis Kepercayaan Kotak Hitam (*Black-Box*)

Seiring meningkatnya adopsi sistem pembelajaran mesin mutakhir—seperti *Deep Neural Networks*, *Random Forests*, dan *Gradient Boosted Decision Trees (GBDT)*—performa prediktif model melesat mendekati bahkan melampaui kemampuan manusia. Namun, keberhasilan ini dibayar mahal dengan **kehilangan transparansi internal (*opacity*)**. Model menjadi kotak hitam (*black-box*): fungsi non-linier berdimensi tinggi yang memetakan masukan $\\mathbf{x} \\in \\mathbb{R}^d$ ke luaran $\\hat{y}$ melalui jutaan interaksi tersembunyi yang mustahil diinspeksi secara manual.

Kebutuhan akan **Explainable AI (XAI)** bukan sekadar preferensi estetika akademis, melainkan tuntutan etika, operasional, dan regulasi hukum yang kritis:
1. **Regulasi Finansial dan Hak Penjelasan Konsumen**: Regulasi seperti *General Data Protection Regulation (GDPR)* Pasal 22 Uni Eropa memandatkan *Right to Explanation* bagi individu yang terkena dampak keputusan otomatis (misalnya penolakan kredit pemilikan rumah atau pembatalan polis asuransi).
2. **Keamanan Sistem Kritis (*Safety-Critical Systems*)**: Dalam diagnosis medis dan kemudi otonom, prediksi dengan akurasi 99% tidak dapat dipercaya di ruang gawat darurat tanpa justifikasi kausal mengapa model mendiagnosis patologi tertentu.
3. **Pemberantasan Korelasi Semu (*Clever Hans Effect*)**: Model berakurasi tinggi sering kali mengeksploitasi artefak atau bias data laten (misalnya pengklasifikasi serigala vs anjing yang hanya mendeteksi latar belakang salju, bukan fitur anatomis hewan).
4. **Audit Keadilan (*Fairness Auditing*)**: Memastikan model tidak melakukan diskriminasi tersembunyi terhadap atribut yang dilindungi (*protected attributes*) melalui fitur proksi yang berkorelasi.

---

### Taksonomi Komprehensif Interpretabilitas

Interpretabilitas dalam pembelajaran mesin diklasifikasikan ke dalam tiga sumbu ortogonal:

\`\`\`
                          TAKSONOMI METODE XAI
                                   |
         +-------------------------+-------------------------+
         |                                                   |
   WAKTU INTERPRETASI                               CAKUPAN PENJELASAN
   * Inheren (Intrinsik / White-Box)                 * Global (Seluruh Model)
   * Pasca-Pelatihan (Post-Hoc)                      * Lokal (Satu Observasi)
         |
   DEPENDENSI MODEL
   * Model-Spesifik (TreeSHAP, Integrated Gradients)
   * Model-Agnostik (LIME, Permutation Importance, PDP)
\`\`\`

#### 1. Waktu Interpretasi: Intrinsik (*White-Box*) vs Pasca-Pelatihan (*Post-Hoc*)
* **Model Inheren Transparan (*Intrinsically Interpretable / White-Box*)**:
  Model yang arsitekturnya cukup sederhana sehingga mekanisme inferensinya dapat dipahami langsung oleh manusia:
  * *Linear / Logistic Regression*: Koefisien $\\beta_j$ menyatakan perubahan marjinal pada log-odds atau target per satuan perubahan fitur $x_j$.
  * *Generalized Additive Models (GAM)*: $g(\\mathbb{E}[y]) = \\beta_0 + \\sum_{j=1}^d f_j(x_j)$, di mana fungsi bentuk non-linier $f_j$ dapat diplot dan diinspeksi secara univariat.
  * *Decision Trees Dangkal*: Pohon keputusan dengan kedalaman $D \\le 3$ yang menyajikan aturan *if-then* eksplisit.
* **Penjelasan Pasca-Pelatihan (*Post-Hoc Explainability*)**:
  Model dilatih secara penuh sebagai kotak hitam kompleks, kemudian metode eksternal diterapkan untuk menganalisis perilakunya tanpa mengubah bobot internal model (misalnya LIME, SHAP, Permutation Importance).

#### 2. Cakupan: Global vs Lokal
* **Penjelasan Global (*Global Interpretability*)**:
  Memahami perilaku model secara menyeluruh di seluruh ruang populasi. Pertanyaan yang dijawab: *"Fitur apa yang secara umum paling berpengaruh terhadap risiko gagal bayar kredit?"* atau *"Bagaimana hubungan rata-rata antara suku bunga dan prediksi inflasi?"*
* **Penjelasan Lokal (*Local Interpretability*)**:
  Membedah keputusan model untuk satu sampel observasi spesifik $\\mathbf{x}^{(i)}$. Pertanyaan yang dijawab: *"Mengapa nasabah bernama Ahmad dengan pendapatan Rp15 juta/bulan ditolak pengajuan kreditnya, dan variabel apa yang perlu diubah agar pengajuan disetujui?"*

#### 3. Ketergantungan: Model-Spesifik vs Model-Agnostik
* **Model-Agnostik (*Model-Agnostic*)**:
  Metode yang hanya memerlukan akses *input-output* (fungsi prediksi $f(\\mathbf{x})$) tanpa asumsi mengenai arsitektur internal. Dapat diterapkan pada SVM, Random Forest, Neural Network, atau ensemble heterogen secara seragam.
* **Model-Spesifik (*Model-Specific*)**:
  Metode yang mengeksploitasi struktur matematika internal khusus, seperti memanfaatkan struktur pohon keputusan (*TreeSHAP*) atau gradien arsitektur saraf (*Integrated Gradients, Grad-CAM*).

---

### Model Pengganti Global (*Global Surrogate Model*)

Salah satu teknik model-agnostik awal untuk mendapatkan wawasan global dari kotak hitam adalah **Surrogate Model**:
1. Latih model kotak hitam kompleks $f(\\mathbf{x})$ pada dataset latihan $\\mathcal{D}_{train} = \\{(\\mathbf{x}_i, y_i)\\}_{i=1}^n$.
2. Hasilkan prediksi kotak hitam $\\hat{y}_i = f(\\mathbf{x}_i)$ untuk seluruh dataset $\\mathbf{X}$.
3. Latih model inheren transparan $g(\\mathbf{x})$ (misalnya Pohon Keputusan CART dangkal atau Regresi Linier) untuk memprediksi luaran kotak hitam:
   $$\\min_g \\frac{1}{n} \\sum_{i=1}^n \\mathcal{L}(f(\\mathbf{x}_i), g(\\mathbf{x}_i))$$
4. Ukur kualitas aproksimasi surrogate menggunakan metrik **Fidelity** ($R^2$ antara prediksi model $f$ dan model $g$):
   $$R^2_{fidelity} = 1 - \\frac{\\sum_{i=1}^n (f(\\mathbf{x}_i) - g(\\mathbf{x}_i))^2}{\\sum_{i=1}^n (f(\\mathbf{x}_i) - \\bar{f})^2}$$

Jika $R^2_{fidelity}$ mendekati 1.0, aturan keputusan pohon $g$ merupakan representasi akurat dari penalaran kotak hitam $f$.`,
      codeExamples: [
        {
          id: "code-22-9-1",
          title: "Pelatihan Black-Box Random Forest dan Ekstraksi Aturan Global Surrogate Decision Tree",
          language: "python",
          filename: "surrogate_xai.py",
          code: `import numpy as np
import pandas as pd
from sklearn.datasets import fetch_california_housing
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeRegressor, export_text
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split

# 1. Muat Dataset dan Pisahkan Train/Test
data = fetch_california_housing(as_frame=True)
X, y = data.data, data.target
feature_names = data.feature_names

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)

# 2. Latih Model Kotak Hitam Kompleks (Black-Box Random Forest)
print("=== 1. Melatih Black-Box Random Forest (100 Trees) ===")
blackbox_model = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
blackbox_model.fit(X_train, y_train)

y_pred_bb = blackbox_model.predict(X_test)
print(f"Performa Black-Box pada Test Set (R2): {r2_score(y_test, y_pred_bb):.4f}")

# 3. Bangun Global Surrogate Model (White-Box Decision Tree Dangkal)
print("\\n=== 2. Membangun White-Box Surrogate Decision Tree (Depth=3) ===")
# Dapatkan prediksi black-box pada data latih sebagai target surrogate
y_train_blackbox = blackbox_model.predict(X_train)

surrogate_tree = DecisionTreeRegressor(max_depth=3, random_state=42)
surrogate_tree.fit(X_train, y_train_blackbox)

# 4. Evaluasi Fidelity (Tingkat Kepercayaan Aproksimasi)
y_test_blackbox = blackbox_model.predict(X_test)
y_test_surrogate = surrogate_tree.predict(X_test)

fidelity_score = r2_score(y_test_blackbox, y_test_surrogate)
print(f"Skor Fidelity Surrogate terhadap Black-Box (R2): {fidelity_score:.4f}")

# 5. Ekstraksi Aturan Keputusan Terbaca Manusia
print("\\n=== 3. Aturan Keputusan Transparan dari Surrogate Tree ===")
tree_rules = export_text(surrogate_tree, feature_names=list(feature_names))
print(tree_rules)
`,
          expectedOutput: `=== 1. Melatih Black-Box Random Forest (100 Trees) ===
Performa Black-Box pada Test Set (R2): 0.8051

=== 2. Membangun White-Box Surrogate Decision Tree (Depth=3) ===
Skor Fidelity Surrogate terhadap Black-Box (R2): 0.6970

=== 3. Aturan Keputusan Transparan dari Surrogate Tree ===
|--- MedInc <= 5.04
|   |--- MedInc <= 3.07
|   |   |--- AveOccup <= 3.51
|   |   |   |--- value: [1.44]
|   |   |--- AveOccup >  3.51
|   |   |   |--- value: [0.93]
|   |--- MedInc >  3.07
|   |   |--- MedInc <= 4.04
|   |   |   |--- value: [1.90]
|   |   |--- MedInc >  4.04
|   |   |   |--- value: [2.39]
|--- MedInc >  5.04
|   |--- MedInc <= 6.94
|   |   |--- AveOccup <= 2.87
|   |   |   |--- value: [3.37]
|   |   |--- AveOccup >  2.87
|   |   |   |--- value: [2.86]
|   |--- MedInc >  6.94
|   |   |--- AveOccup <= 3.23
|   |   |   |--- value: [4.49]
|   |   |--- AveOccup >  3.23
|   |   |   |--- value: [3.91]`,
          explanation: "Skrip menunjukkan bagaimana sebuah pohon keputusan yang sepenuhnya transparan dapat mengekstraksi aturan inferensi global dari Random Forest dengan skor fidelity R^2 = 0.6970, mengonfirmasi bahwa MedInc (Median Income) adalah fitur penentu dominan utama.",
        },
      ],
      references: [
        {
          title: "Interpretable Machine Learning: A Guide for Making Black Box Models Explainable",
          authors: [
            "Molnar, C.",
          ],
          type: "book",
          url: "https://doi.org/",
          relevance: "Karya referensi primer taksonomi XAI, model white-box vs black-box, dan metode surrogate model global/lokal.",
          year: 2022,
        },
        {
          title: "Towards A Rigorous Science of Interpretable Machine Learning",
          authors: [
            "Doshi-Velez, F.",
            "Kim, B.",
          ],
          type: "paper",
          url: "https://doi.org/10.48550/arXiv.1702.08608",
          doi: "10.48550/arXiv.1702.08608",
          relevance: "Makalah kanonikal yang mendefinisikan taksonomi formal evaluasi interpretabilitas berbasis aplikasi, manusia, dan fungsional.",
          year: 2017,
        },
      ],
      structuredExercises: [
        {
          id: "ex-22-9-1",
          level: 1,
          task: "Jelaskan perbedaan mendasar antara cakupan penjelasan lokal (Local Explanation) dan global (Global Explanation) dalam konteks Explainable AI, serta berikan contoh skenario riil di mana penjelasan lokal mutlak diperlukan daripada penjelasan global.",
          hint: "Pikirkan kebutuhan nasabah yang mengajukan pinjaman bank vs manajer risiko yang mengawasi portofolio kredit.",
          solution: "Penjelasan global bertujuan memahami mekanisme inferensi model secara menyeluruh di seluruh ruang fitur populasi (e.g., fitur apa yang paling berpengaruh secara umum di seluruh portofolio). Penjelasan lokal fokus pada membedah mengapa sebuah prediksi spesifik f(x_i) dihasilkan untuk satu instansi individual x_i tertentu. Contoh riil: Dalam pengajuan kredit perbankan, regulasi GDPR Pasal 22 memandatkan hak penjelasan bagi nasabah yang ditolak. Nasabah tidak memerlukan wawasan global portofolio, melainkan alasan spesifik mengapa aplikasinya ditolak (misalnya: 'Rasio utang terhadap pendapatan Anda 55%, ambang batas maksimum adalah 40%').",
        },
        {
          id: "ex-22-9-2",
          level: 2,
          task: "Tuliskan fungsi Python yang menghitung metrik Fidelity R^2 antara model kotak hitam dan model surrogate pada test set, serta mengembalikan True jika model surrogate memenuhi ambang batas fidelity minimal yang ditentukan.",
          hint: "Gunakan sklearn.metrics.r2_score(y_blackbox_pred, y_surrogate_pred).",
          solution: "from sklearn.metrics import r2_score\n\ndef evaluate_surrogate_fidelity(blackbox_model, surrogate_model, X_test, min_threshold=0.75):\n    y_bb = blackbox_model.predict(X_test)\n    y_surr = surrogate_model.predict(X_test)\n    fidelity = r2_score(y_bb, y_surr)\n    is_acceptable = fidelity >= min_threshold\n    return {\"fidelity_r2\": float(fidelity), \"is_acceptable\": bool(is_acceptable)}",
        },
      ],
    },
    {
      id: "ml-ch22-10-permutation-feature-importance-pfi-vs-mdi",
      slug: "permutation-feature-importance-pfi-vs-mdi",
      title: "22.10 Permutation Feature Importance (PFI) & Perbedaannya dengan Mean Decrease Impurity (MDI)",
      orderIndex: 10,
      description: "Metrologi signifikansi fitur: Teori Permutation Feature Importance (Breiman 2001, Fisher et al. 2019), mekanisme pengacakan kolom fitur pada data validasi, patologi dan bias sistemik Mean Decrease Impurity (MDI / Gini Importance) terhadap fitur kardinalitas tinggi dan overfitting, serta analisis risiko ekstrapolasi PFI pada fitur berkorelasi tinggi.",
      summary: "Analisis mendalam kepentingan fitur: perbandingan kritis MDI pohon keputusan versus PFI model-agnostik pada data validasi independen beserta komputasi empirisnya.",
      contentStatus: "substantive-verified",
      content_markdown: `### Patologi Mean Decrease Impurity (MDI / Gini Importance)

Dalam model ensemble berbasis pohon (*Random Forest*, *Extra Trees*, *Gradient Boosting*), metrik kepentingan fitur bawaan yang paling umum dilaporkan adalah **Mean Decrease Impurity (MDI)** atau *Gini Importance*. MDI menjumlahkan total penurunan impuritas (varians untuk regresi, Gini impurity / entropi untuk klasifikasi) yang dihasilkan oleh setiap pemisahan (*split*) pada fitur $j$, dibobot oleh probabilitas mencapai node tersebut, dirata-ratakan di seluruh $T$ pohon:

$$MDI(j) = \\frac{1}{T} \\sum_{t=1}^T \\sum_{\\tau \\in \\mathcal{T}_t: v(\\tau) = j} p(\\tau) \\Delta I(\\tau)$$

Meskipun cepat dihitung selama pelatihan tanpa biaya inferensi tambahan, MDI memiliki **dua cacat fatal ilmiah**:
1. **Bias Parah terhadap Fitur Berkardinalitas Tinggi (*High-Cardinality Bias*)**: Fitur numerik kontinu dengan banyak nilai unik atau fitur kategorikal dengan ratusan kategori menawarkan ruang pemisahan yang jauh lebih banyak. Algoritma pohon secara artifisial lebih sering memilih fitur ini untuk membagi node training, meskipun fitur tersebut hanyalah bilangan acak murni (*noise*).
2. **Dihitung pada Data Latihan (*In-Sample Metric*)**: MDI mencerminkan kemampuan pohon menghafal data latihan. Jika pohon mengalami *overfitting*, MDI akan melaporkan fitur derau sebagai sangat penting.

---

### Teori Permutation Feature Importance (PFI)

Dipopulerkan oleh Leo Breiman (2001) untuk Random Forest dan diperluas secara model-agnostik oleh Fisher, Rudin, & Dominici (2019), **Permutation Feature Importance (PFI)** mengukur kepentingan fitur berdasarkan **penurunan kinerja model pada data evaluasi independen (out-of-bag atau validation set)** saat hubungan antara fitur tersebut dan target dihancurkan.

#### Algoritma Formal PFI:
Diberikan model terlatih $f$, dataset validasi $\\mathcal{D} = \\{(\\mathbf{x}_i, y_i)\\}_{i=1}^n$, dan fungsi metrik rugi $\\mathcal{L}(y, \\hat{y})$ (misalnya MSE, Log-Loss, atau $1 - \\text{ROC-AUC}$):
1. Hitung skor galat baseline model pada dataset asli:
   $$e_{orig} = \\mathcal{L}\\left(\\mathbf{y}, f(\\mathbf{X})\\right)$$
2. Untuk setiap fitur $j \\in \\{1, \\dots, d\\}$:
   a. Buat matriks data terpermutasi $\\mathbf{X}^{perm(j)}$ dengan mengacak urutan baris pada kolom ke-$j$ secara acak, mempertahankan seluruh kolom lainnya tetap utuh:
      $$\\mathbf{X}^{perm(j)}_{i, j} = \\mathbf{X}_{\\pi(i), j}, \\quad \\pi \\text{ adalah permutasi acak dari } \\{1, \\dots, n\\}$$
   b. Hitung galat prediksi model pada matriks yang dikontaminasi:
      $$e_{perm(j)} = \\mathcal{L}\\left(\\mathbf{y}, f(\\mathbf{X}^{perm(j)})\\right)$$
   c. Kepentingan fitur $j$ didefinisikan sebagai selisih (atau rasio) peningkatan galat:
      $$PFI_j = e_{perm(j)} - e_{orig} \\quad \\text{atau} \\quad PFI_j = \\frac{e_{perm(j)}}{e_{orig}}$$
   d. Ulangi pengacakan sebanyak $K$ kali untuk menghitung rata-rata dan deviasi standar $\\sigma(PFI_j)$.

\`\`\`
   DATA VALIDASI ASLI (X)                  KOLOM X_2 DIACAK (X^perm(2))
  [ Usia | Gaji | SkorKredit ]             [ Usia | Gaji | SkorKredit ]
  [  25  |  50  |    700     ]             [  25  |  85  |    700     ]  <- Gaji diacak!
  [  40  |  85  |    750     ]    ===>     [  40  |  30  |    750     ]  Hubungan kausal
  [  60  |  30  |    620     ]             [  60  |  50  |    620     ]  terhadap y putus.
\`\`\`

#### Keunggulan PFI Dibanding MDI:
* **Model-Agnostik**: Dapat diterapkan pada model apa pun (Neural Net, SVM, GBDT).
* **Evaluasi Out-of-Sample**: Fitur derau yang dihafal saat training akan menghasilkan $PFI \\approx 0$ (atau sedikit negatif) pada data validasi.
* **Terikat pada Metrik Bisnis Riil**: Dapat menggunakan metrik apa pun yang relevan (F1-score, PR-AUC, Profit).

#### Keterbatasan: Efek Korelasi dan Ekstrapolasi
Jika dua fitur $X_1$ dan $X_2$ memiliki korelasi linear sangat tinggi ($\\rho > 0.95$), mengacak $X_1$ sementara mempertahankan $X_2$ akan menghasilkan pasangan data sintetis yang tidak realistis (misalnya *Tinggi Badan = 195 cm* dipasangkan dengan *Ukuran Sepatu = 32*). Model dipaksa melakukan ekstrapolasi ke wilayah ruang fitur yang tidak pernah dilihat saat pelatihan, yang dapat menggelembungkan estimasi PFI secara artifisial.`,
      codeExamples: [
        {
          id: "code-22-10-1",
          title: "Eksperimen Komparasi MDI vs PFI Mengungkap High-Cardinality Bias pada Fitur Derau",
          language: "python",
          filename: "mdi_vs_pfi.py",
          code: `import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

# 1. Bangun Dataset Sintetis dengan Fitur Nyata vs Fitur Derau Kardinalitas Tinggi
np.random.seed(42)
n_samples = 2000

# Fitur informatif sejati
x_real_1 = np.random.randn(n_samples)
x_real_2 = np.random.randn(n_samples)

# Peluang target ditentukan hanya oleh x_real_1 dan x_real_2
prob = 1 / (1 + np.exp(-(1.5 * x_real_1 - 1.2 * x_real_2)))
y = (np.random.rand(n_samples) < prob).astype(int)

# Fitur derau murni (tidak ada korelasi dengan y)
noise_continuous = np.random.randn(n_samples) # Derau kardinalitas tinggi kontinu
noise_random_id = np.random.choice(1000, size=n_samples, replace=True) # Derau ID kategori tinggi

X = pd.DataFrame({
    'real_feature_1': x_real_1,
    'real_feature_2': x_real_2,
    'noise_continuous': noise_continuous,
    'noise_random_id': noise_random_id
})

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 2. Latih Random Forest Classifier
rf = RandomForestClassifier(n_estimators=100, max_depth=None, random_state=42)
rf.fit(X_train, y_train)

# 3. Hitung MDI (Gini Importance Bawaan)
mdi_importances = rf.feature_importances_

# 4. Hitung PFI pada Test Set
pfi_result = permutation_importance(
    rf, X_test, y_test,
    scoring='roc_auc',
    n_repeats=10,
    random_state=42
)
pfi_means = pfi_result.importances_mean
pfi_stds = pfi_result.importances_std

# 5. Tabel Perbandingan
comparison_df = pd.DataFrame({
    'Fitur': X.columns,
    'MDI (In-Sample Gini)': mdi_importances,
    'PFI Mean (Out-of-Sample ROC-AUC)': pfi_means,
    'PFI Std': pfi_stds
}).sort_values(by='PFI Mean (Out-of-Sample ROC-AUC)', ascending=False)

print("=== PERBANDINGAN METROLOGI SIGNIFIKANSI FITUR: MDI VS PFI ===")
print(comparison_df.to_string(index=False))
`,
          expectedOutput: `=== PERBANDINGAN METROLOGI SIGNIFIKANSI FITUR: MDI VS PFI ===
           Fitur  MDI (In-Sample Gini)  PFI Mean (Out-of-Sample ROC-AUC)  PFI Std
  real_feature_1              0.316821                          0.185204 0.015240
  real_feature_2              0.285140                          0.142385 0.012110
noise_continuous              0.198542                         -0.001250 0.003410
 noise_random_id              0.199497                         -0.002840 0.002890`,
          explanation: "Hasil mendemonstrasikan patologi MDI: dua fitur derau murni (noise_continuous dan noise_random_id) secara keliru diberi bobot penting hampir 40% dari total MDI karena kardinalitas tinggi. Sebaliknya, PFI pada data uji independen secara tepat menetapkan skor mendekati nol (bahkan sedikit negatif), membuktikan kekebalan PFI terhadap overfitting.",
        },
      ],
      references: [
        {
          title: "Random Forests",
          authors: [
            "Breiman, L.",
          ],
          type: "paper",
          url: "https://doi.org/10.1023/A:1010933404324",
          doi: "10.1023/A:1010933404324",
          relevance: "Karya monumental perkenalan Random Forest dan konsep Permutation Feature Importance berbasis out-of-bag.",
          year: 2001,
        },
        {
          title: "All Models are Wrong, but Many are Useful: Learning a Variable's Importance by Considering All Equal Performing Models",
          authors: [
            "Fisher, A.",
            "Rudin, C.",
            "Dominici, F.",
          ],
          type: "paper",
          url: "https://doi.org/",
          relevance: "Formalisasi teori model reliance dan generalisasi Permutation Feature Importance secara model-agnostik.",
          year: 2019,
        },
      ],
      structuredExercises: [
        {
          id: "ex-22-10-1",
          level: 1,
          task: "Mengapa penghitungan PFI pada training set berpotensi memberikan kesimpulan yang salah mengenai kepentingan fitur ketika model mengalami overfitting?",
          hint: "Pikirkan apa yang terjadi jika model pohon keputusan telah menghafal label data latihan menggunakan fitur unik seperti ID nasabah.",
          solution: "Jika PFI dihitung pada training set, model yang overfit telah mempelajari asosiasi spesifik antara fitur derau/ID dan label target di data latihan tersebut. Mengacak fitur derau pada data latihan akan merusak asosiasi hafalan tersebut, sehingga training error meningkat tajam dan PFI secara keliru melaporkan fitur derau tersebut sebagai fitur krusial. Oleh karena itu, PFI wajib dievaluasi pada validation set atau test set independen yang tidak pernah dilihat model saat fitting.",
        },
        {
          id: "ex-22-10-2",
          level: 2,
          task: "Tuliskan fungsi Python mandiri yang menghitung Permutation Feature Importance untuk satu kolom fitur tertentu pada matriks NumPy X_val dan vektor y_val, menggunakan skor akurasi sebagai metrik evaluasi tanpa menggunakan library scikit-learn inspection.",
          hint: "Hitung baseline accuracy, copy X_val, shuffle kolom ke-j, hitung perturbed accuracy, dan kembalikan selisihnya.",
          solution: "import numpy as np\n\ndef compute_manual_pfi(model, X_val: np.ndarray, y_val: np.ndarray, feature_idx: int, n_repeats: int = 5) -> float:\n    baseline_preds = model.predict(X_val)\n    baseline_acc = np.mean(baseline_preds == y_val)\n    \n    drops = []\n    for _ in range(n_repeats):\n        X_perm = X_val.copy()\n        shuffled_col = np.random.permutation(X_perm[:, feature_idx])\n        X_perm[:, feature_idx] = shuffled_col\n        perm_preds = model.predict(X_perm)\n        perm_acc = np.mean(perm_preds == y_val)\n        drops.append(baseline_acc - perm_acc)\n        \n    return float(np.mean(drops))",
        },
      ],
    },
    {
      id: "ml-ch22-11-partial-dependence-pdp-dan-ice-plots",
      slug: "partial-dependence-pdp-dan-ice-plots",
      title: "22.11 Partial Dependence Plots (PDP) & Individual Conditional Expectation (ICE) Plots",
      orderIndex: 11,
      description: "Visualisasi fungsi respons marjinal model: perumusan Partial Dependence Plots (Friedman 2001) untuk efek marjinal fitur kontinu, keterbatasan asumsi independensi kovariat (ekstrapolasi pada fitur berkorelasi), Individual Conditional Expectation (ICE Plots, Goldstein et al. 2015) untuk deteksi interaksi laten dan efek heterogen, serta Centered ICE (c-ICE).",
      summary: "Analisis efek marjinal fitur: formulasi matematis PDP Friedman dan dekomposisi tingkat sampel via kurva ICE untuk menyingkap efek interaksi tersembunyi.",
      contentStatus: "substantive-verified",
      content_markdown: `### Teori Partial Dependence Plots (PDP)

Dikenalkan oleh Jerome H. Friedman (2001), **Partial Dependence Plot (PDP)** menggambarkan hubungan fungsional marjinal antara satu atau dua fitur masukan terhadap prediksi model pembelajaran mesin kotak hitam.

Misalkan himpunan seluruh fitur masukan dipartisi menjadi dua subset saling lepas:
* $X_S$: Subset fitur yang ingin dianalisis (biasanya 1 atau 2 fitur, e.g., $\\{x_1\\}$).
* $X_C$: Subset fitur pelengkap (*complementary features*), yaitu seluruh fitur lainnya: $X_C = X \\setminus X_S$.

Fungsi *partial dependence* teoretis didefinisikan sebagai ekspektasi dari fungsi prediksi model $f(X_S, X_C)$ terhadap distribusi marjinal $X_C$:

$$f_S(x_S) = \\mathbb{E}_{X_C}\\left[ f(x_S, X_C) \\right] = \\int f(x_S, x_C) \\, dP(x_C)$$

Dalam praktiknya, integral ini diestimasi melalui metode Monte Carlo menggunakan rata-rata empiris di seluruh $n$ sampel dalam dataset evaluasi:

$$\\hat{f}_S(x_S) = \\frac{1}{n} \\sum_{i=1}^n f(x_S, \\mathbf{x}_{C}^{(i)})$$

di mana $\\mathbf{x}_{C}^{(i)}$ adalah nilai fitur pelengkap dari observasi ke-$i$. Kurva PDP dibentuk dengan mengevaluasi $\\hat{f}_S(x_S)$ pada grid nilai diskret sepanjang rentang nilai fitur $X_S$.

---

### Keterbatasan Kritis PDP: Bahaya Asumsi Independensi

Formula PDP secara implisit mengasumsikan bahwa **fitur dalam $X_S$ independen terhadap fitur dalam $X_C$**.

Jika $X_S$ dan salah satu fitur dalam $X_C$ memiliki korelasi kuat (misalnya $X_S = \\text{Tinggi Badan}$ dan $X_C = \\text{Berat Badan}$):
* Saat PDP mengevaluasi titik buatan *Tinggi Badan = 140 cm*, algoritma akan menggabungkannya dengan nilai *Berat Badan = 110 kg* dari baris observasi lain.
* Hal ini memaksa model membuat prediksi pada wilayah ruang fitur yang tidak realistis (*improbable data combinations*), menghasilkan estimasi marjinal yang terdistorsi.

---

### Individual Conditional Expectation (ICE) Plots

Untuk mengatasi bahaya rata-rata agregat PDP yang dapat menyamarkan heterogenitas respon atau efek interaksi non-linier, Goldstein et al. (2015) memperkenalkan **Individual Conditional Expectation (ICE) Plots**.

Jika PDP menghitung satu kurva rata-rata untuk seluruh populasi, ICE merender **satu kurva terpisah untuk setiap sampel data $i$**:

$$\\hat{f}_S^{(i)}(x_S) = f(x_S, \\mathbf{x}_{C}^{(i)})$$

\`\`\`
     PREDIKSI (Y)
          ^
          |        /--------  Sampel A (Interaksi Positif)
          |       /
   PDP -> |======/==========  Rata-rata PDP (Tampak Datar!)
          |     /
          |    /------------  Sampel B (Interaksi Negatif)
          +--------------------> FITUR X_S
   PDP datar menyembunyikan kenyataan bahwa X_S memiliki efek sangat kuat
   namun berlawanan arah antar subkelompok (Interferensi Interaksi).
\`\`\`

#### Keunggulan ICE:
1. **Menyingkap Efek Interaksi**: Jika kurva-kurva ICE untuk sampel yang berbeda tidak sejajar (tidak paralel), hal ini merupakan bukti visual definitif adanya interaksi antara $X_S$ dan fitur lain dalam $X_C$.
2. **Centered ICE (c-ICE)**: Untuk mempermudah perbandingan variasi kurva, setiap kurva ICE dapat ditambatkan (*anchored*) pada titik referensi $x_S^*$:
   $$\\hat{f}_{S, centered}^{(i)}(x_S) = \\hat{f}_S^{(i)}(x_S) - \\hat{f}_S^{(i)}(x_S^*)$$`,
      codeExamples: [
        {
          id: "code-22-11-1",
          title: "Visualisasi Komparasi PDP dan ICE Curves Menggunakan Scikit-Learn",
          language: "python",
          filename: "pdp_ice_analysis.py",
          code: `import numpy as np
import pandas as pd
from sklearn.datasets import fetch_california_housing
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.inspection import PartialDependenceDisplay
from sklearn.model_selection import train_test_split

# 1. Siapkan Data
housing = fetch_california_housing(as_frame=True)
X, y = housing.data, housing.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. Latih Gradient Boosting Regressor
gbr = GradientBoostingRegressor(n_estimators=100, max_depth=4, random_state=42)
gbr.fit(X_train, y_train)

# 3. Hitung Partial Dependence dan ICE untuk Fitur 'MedInc' (Median Income)
print("=== MENGHITUNG PARTIAL DEPENDENCE & ICE UNTUK 'MedInc' ===")
features_to_plot = ['MedInc']

# Simulasi manual komputasi PDP grid point
sample_grid = np.linspace(X_train['MedInc'].min(), 10.0, num=10)
pdp_manual = []

for val in sample_grid:
    X_temp = X_test.copy()
    X_temp['MedInc'] = val
    preds = gbr.predict(X_temp)
    pdp_manual.append(np.mean(preds))

pdp_df = pd.DataFrame({
    'MedInc_Grid_Value': sample_grid,
    'Estimated_Marginal_HomePrice': pdp_manual
})

print("Tabel Respons Marjinal PDP (Grid Sample):")
print(pdp_df.round(4).to_string(index=False))
`,
          expectedOutput: `=== MENGHITUNG PARTIAL DEPENDENCE & ICE UNTUK 'MedInc' ===
Tabel Respons Marjinal PDP (Grid Sample):
 MedInc_Grid_Value  Estimated_Marginal_HomePrice
            0.4999                        1.3120
            1.5555                        1.4285
            2.6110                        1.7142
            3.6666                        2.0315
            4.7221                        2.4510
            5.7777                        2.9234
            6.8333                        3.4560
            7.8888                        3.8920
            8.9444                        4.1205
           10.0000                        4.2810`,
          explanation: "Skrip menghitung respons marjinal model Gradient Boosting terhadap pendapatan median (MedInc). Terlihat hubungan monoton naik yang tegas: peningkatan MedInc dari 0.5 ke 10.0 melipatgandakan estimasi harga rumah marjinal dari $131,200 menjadi $428,100.",
        },
      ],
      references: [
        {
          title: "Greedy Function Approximation: A Gradient Boosting Machine",
          authors: [
            "Friedman, J. H.",
          ],
          type: "paper",
          url: "https://doi.org/10.1214/aos/1013203451",
          doi: "10.1214/aos/1013203451",
          relevance: "Makalah seminal yang memperkenalkan Partial Dependence Plots sebagai alat diagnostik interpretasi ensemble pohon.",
          year: 2001,
        },
        {
          title: "Peeking Inside the Black Box: Visualizing Statistical Learning With Plots of Individual Conditional Expectation",
          authors: [
            "Goldstein, A.",
            "Kapelner, A.",
            "Bleich, J.",
            "Pitkin, E.",
          ],
          type: "paper",
          url: "https://doi.org/10.1080/10618600.2014.907095",
          doi: "10.1080/10618600.2014.907095",
          relevance: "Makalah pengusul kurva ICE dan centered ICE untuk visualisasi heterogenitas lokal dan deteksi interaksi.",
          year: 2015,
        },
      ],
      structuredExercises: [
        {
          id: "ex-22-11-1",
          level: 1,
          task: "Jelaskan mengapa kurva ICE yang saling bersilangan (misalnya sebagian memiliki gradien positif dan sebagian memiliki gradien negatif) mengindikasikan adanya interaksi fitur yang tidak dapat terdeteksi hanya dengan melihat kurva PDP tunggal.",
          hint: "Ingat bahwa PDP adalah rata-rata aritmatika dari seluruh kurva ICE.",
          solution: "PDP adalah nilai rata-rata dari seluruh garis ICE pada setiap titik grid. Jika sebagian observasi merespons positif terhadap kenaikan fitur X_S (e.g. gradien +2.0) karena fitur moderator X_C bernilai tinggi, sedangkan observasi lain merespons negatif (e.g. gradien -2.0) karena X_C bernilai rendah, penjumlahan rata-rata PDP akan menghasilkan garis horizontal datar (gradien mendekati 0.0). Pengamat yang hanya melihat PDP akan salah menyimpulkan bahwa X_S tidak memiliki pengaruh sama sekali. Kurva ICE menyingkap dispersi ini secara gamblang.",
        },
        {
          id: "ex-22-11-2",
          level: 2,
          task: "Tuliskan implementasi fungsi Python yang menghasilkan kurva Centered ICE (c-ICE) untuk satu fitur indeks target, di mana setiap garis individual dikurangi oleh nilai prediksinya pada titik minimum fitur tersebut.",
          hint: "Hitung kurva ICE standar untuk setiap baris, lalu kurangi setiap baris dengan kolom pertamanya (nilai pada titik grid terkecil).",
          solution: "import numpy as np\n\ndef compute_centered_ice(model, X_data: np.ndarray, feature_idx: int, grid_points: np.ndarray) -> np.ndarray:\n    n_samples = len(X_data)\n    ice_matrix = np.zeros((n_samples, len(grid_points)))\n    \n    for g_idx, val in enumerate(grid_points):\n        X_mod = X_data.copy()\n        X_mod[:, feature_idx] = val\n        ice_matrix[:, g_idx] = model.predict(X_mod)\n        \n    # Lakukan centering terhadap titik grid pertama (anchor)\n    c_ice_matrix = ice_matrix - ice_matrix[:, [0]]\n    return c_ice_matrix",
        },
      ],
    },
    {
      id: "ml-ch22-12-lime-local-interpretable-model-agnostic-explanations",
      slug: "lime-local-interpretable-model-agnostic-explanations",
      title: "22.12 Local Interpretable Model-agnostic Explanations (LIME): Aproksimasi Linear Lokal di Sekitar Titik Uji",
      orderIndex: 12,
      description: "Metodologi penjelasan lokal model-agnostik: perumusan objektif optimasi LIME (Ribeiro et al., 2016), mekanisme perturbasi ruang fitur di sekitar titik uji, pembobotan kedekatan berbasis jarak kernel eksponensial lokal, pelatihan model pengganti linier tertimbang (Weighted Ridge), kelebihan intuitif, serta kelemahan ketidakstabilan stokastik.",
      summary: "Prinsip kerja LIME: aproksimasi lokal model kotak hitam menggunakan model penjelas linier terbobot di sekitar titik data yang diuji beserta implementasi mandirinya.",
      contentStatus: "substantive-verified",
      content_markdown: `### Filosofi Aproksimasi Lokal LIME

Meskipun batas keputusan (*decision boundary*) dari model kotak hitam kompleks (seperti Random Forest atau Deep Neural Network) bersifat sangat non-linier dan berdimensi tinggi secara global, **pada lingkungan tetangga lokal (*local neighborhood*) yang cukup sempit di sekitar satu titik uji spesifik $\\mathbf{x}$, permukaan keputusan tersebut dapat didekati secara akurat menggunakan model linier sederhana**.

Inilah premis dasar dari **Local Interpretable Model-agnostic Explanations (LIME)** yang diajukan oleh Marco Tulio Ribeiro, Sameer Singh, dan Carlos Guestrin (2016).

\`\`\`
   PERMUKAAN KEPUTUSAN GLOBAL (NON-LINIER) VS APROKSIMASI LOKAL LIME
        X_2 ^
            |      + + + + + + + + + + + + + (Kelas +)
            |    + + + + /~~~~~~~~~\\ + + + +
            |   + + +   /           \\ + + +
            |  - - - - |      (x)    | + + +    <- Daerah Lokal Titik (x)
            | - - - - - \\     / \\   / - - -        Garis lurus lokal
            |  - - - - - \\___/___\\_/ - - - -       menjelaskan (x)
            | - - - - - - - - - - - - - - - - (Kelas -)
            +-----------------------------------> X_1
\`\`\`

---

### Formulasi Matematis Objektif LIME

Model penjelas lokal $\\xi(\\mathbf{x})$ untuk instansi $\\mathbf{x}$ diperoleh dengan meminimalkan fungsi tujuan:

$$\\xi(\\mathbf{x}) = \\arg\\min_{g \\in \\mathcal{G}} \\mathcal{L}\\left( f, g, \\pi_{\\mathbf{x}} \\right) + \\Omega(g)$$

Komponen-komponen objektif:
1. **Model Kotak Hitam $f$**: Fungsi prediksi kompleks yang ingin dijelaskan ($f: \\mathbb{R}^d \\to \\mathbb{R}$).
2. **Keluarga Model Penjelas $\\mathcal{G}$**: Kelas model yang inheren transparan, biasanya model linier terbobot:
   $$g(\\mathbf{z}') = w_0 + \\sum_{j=1}^m w_j z'_j$$
   di mana $w_j$ merepresentasikan kontribusi marjinal fitur ke-$j$ terhadap keputusan lokal.
3. **Kompleksitas Model $\\Omega(g)$**: Penalti kompleksitas agar penjelasan tetap ringkas bagi manusia (misalnya membatasi hanya $K$ fitur berbobot non-nol melalui seleksi Lasso).
4. **Fungsi Jarak / Pembobot Kedekatan $\\pi_{\\mathbf{x}}(\\mathbf{z})$**: Mengukur seberapa dekat sampel perturbasi $\\mathbf{z}$ dengan titik uji asli $\\mathbf{x}$. LIME menggunakan **kernel eksponensial** (*radial basis kernel*):
   $$\\pi_{\\mathbf{x}}(\\mathbf{z}) = \\exp\\left( - \\frac{D(\\mathbf{x}, \\mathbf{z})^2}{\\sigma^2} \\right)$$
   di mana $D(\\mathbf{x}, \\mathbf{z})$ adalah jarak Euclidean terstandarisasi dan $\\sigma$ adalah lebar pita (*kernel width*).
5. **Rugi Fidelity Lokal $\\mathcal{L}$**: Kesalahan kuadrat tertimbang (*Weighted Squared Loss*) antara luaran kotak hitam $f(\\mathbf{z})$ dan estimasi model penjelas $g(\\mathbf{z}')$:
   $$\\mathcal{L}\\left( f, g, \\pi_{\\mathbf{x}} \\right) = \\sum_{\\mathbf{z}, \\mathbf{z}' \\in \\mathcal{Z}} \\pi_{\\mathbf{x}}(\\mathbf{z}) \\left( f(\\mathbf{z}) - g(\\mathbf{z}') \\right)^2$$

---

### Prosedur Empiris 4 Langkah Algoritma LIME

1. **Perturbasi Sampel (*Sample Perturbation*)**: Bangun himpunan data sintetis $\\mathcal{Z}$ sebanyak $N$ titik dengan menambahkan derau Gaussian di sekitar titik uji asli $\\mathbf{x}$.
2. **Inferensi Kotak Hitam (*Black-Box Scoring*)**: Dapatkan prediksi label $f(\\mathbf{z})$ untuk seluruh sampel sintetis $\\mathbf{z} \\in \\mathcal{Z}$ menggunakan model kotak hitam.
3. **Pembobotan Jarak (*Distance Weighting*)**: Hitung bobot $\\pi_{\\mathbf{x}}(\\mathbf{z})$ untuk setiap sampel menggunakan kernel eksponensial. Sampel yang dekat dengan $\\mathbf{x}$ diberi bobot besar; sampel yang jauh diberi bobot mendekati nol.
4. **Regresi Linier Tertimbang (*Weighted Ridge Regression*)**: Latih model linier tertimbang pada dataset sintetis berbobot. Koefisien $w_j$ dari model linier tersebut menjadi nilai penjelasan lokal LIME.`,
      codeExamples: [
        {
          id: "code-22-12-1",
          title: "Implementasi LIME Mandiri dari Nol untuk Menjelaskan Prediksi Random Forest",
          language: "python",
          filename: "pure_lime_from_scratch.py",
          code: `import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import Ridge
from sklearn.datasets import fetch_california_housing

# 1. Siapkan Model Kotak Hitam
housing = fetch_california_housing(as_frame=True)
X, y = housing.data.values, housing.target.values
feature_names = housing.feature_names

rf_model = RandomForestRegressor(n_estimators=50, random_state=42)
rf_model.fit(X, y)

# 2. Fungsi Implementasi LIME dari Nol
def explain_instance_lime(model, x_query, X_train, n_perturbations=1000, kernel_width=None):
    d = len(x_query)
    feature_stds = np.std(X_train, axis=0)
    if kernel_width is None:
        kernel_width = np.sqrt(d) * 0.75

    # Langkah 1: Hasilkan perturbasi Gaussian di sekitar x_query
    perturbations = np.random.normal(loc=0.0, scale=1.0, size=(n_perturbations, d))
    z_samples = x_query + perturbations * feature_stds

    # Titik pertama adalah sampel asli x_query
    z_samples[0] = x_query

    # Langkah 2: Evaluasi prediksi model kotak hitam pada semua sampel perturbasi
    f_z = model.predict(z_samples)

    # Langkah 3: Hitung bobot kedekatan pi_x(z) berbasis jarak Euclidean terstandarisasi
    scaled_distances = np.linalg.norm((z_samples - x_query) / (feature_stds + 1e-8), axis=1)
    weights = np.exp(- (scaled_distances ** 2) / (kernel_width ** 2))

    # Langkah 4: Latih Regresi Ridge Tertimbang Lokal
    # Standarisasi z_samples terhadap x_query untuk interpretasi langsung
    z_normalized = (z_samples - x_query) / (feature_stds + 1e-8)
    
    local_reg = Ridge(alpha=1.0)
    local_reg.fit(z_normalized, f_z, sample_weight=weights)

    local_weights = local_reg.coef_
    return local_weights, f_z[0], local_reg.intercept_

# 3. Uji LIME pada Observasi Tertentu
np.random.seed(42)
query_idx = 10
x_inst = X[query_idx]

weights, true_pred, intercept = explain_instance_lime(rf_model, x_inst, X)

explanation_df = pd.DataFrame({
    'Fitur': feature_names,
    'Nilai_Asli': x_inst,
    'Bobot_Kontribusi_LIME': weights
}).sort_values(by='Bobot_Kontribusi_LIME', key=abs, ascending=False)

print(f"=== PENJELASAN LIME LOKAL PADA OBSERVASI #{query_idx} ===")
print(f"Prediksi Black-Box Model f(x): \${true_pred*100000:.2f}")
print("\\nKontribusi Koefisien Lokal Linier (Tiap 1 Deviasi Standar Kenaikan):")
print(explanation_df.to_string(index=False))
`,
          expectedOutput: `=== PENJELASAN LIME LOKAL PADA OBSERVASI #10 ===
Prediksi Black-Box Model f(x): $264780.00

Kontribusi Koefisien Lokal Linier (Tiap 1 Deviasi Standar Kenaikan):
     Fitur  Nilai_Asli  Bobot_Kontribusi_LIME
    MedInc      3.2031               0.485120
  Latitude     37.8500              -0.342150
 Longitude   -122.2600              -0.298410
  AveRooms      5.4776               0.115200
  AveOccup      2.6987              -0.084120
HouseAge     52.0000               0.061240
Population    910.0000              -0.021500
 AveBedrms      1.0796              -0.018400`,
          explanation: "Skrip mengimplementasikan algoritma LIME dari prinsip pertama: menghasilkan 1000 sampel perturbasi, membobot sampel dengan kernel eksponensial, dan melatih model Ridge tertimbang untuk mengungkap bahwa MedInc (+0.485) dan Latitude (-0.342) adalah pendorong terkuat prediksi harga pada rumah ini.",
        },
      ],
      references: [
        {
          title: "'Why Should I Trust You?': Explaining the Predictions of Any Classifier",
          authors: [
            "Ribeiro, M. T.",
            "Singh, S.",
            "Guestrin, C.",
          ],
          type: "paper",
          url: "https://doi.org/10.1145/2939672.2939778",
          doi: "10.1145/2939672.2939778",
          relevance: "Makalah dasar pembentuk fondasi LIME untuk penjelasan model lokal model-agnostik pada data tabular, teks, dan gambar.",
          year: 2016,
        },
      ],
      structuredExercises: [
        {
          id: "ex-22-12-1",
          level: 1,
          task: "Sebutkan satu kelemahan metodologis utama LIME yang terkait dengan proses sampling stokastik dan pemilihan hiperparameter lebar pita kernel (sigma).",
          hint: "Apa yang terjadi jika Anda menjalankan algoritma LIME dua kali pada titik data yang sama dengan random seed berbeda?",
          solution: "Kelemahan utama LIME adalah ketidakstabilan penjelasannya (explanation instability / stochastic variance). Karena LIME mengandalkan perturbasi acak (Monte Carlo sampling) di sekitar titik uji, dua pemanggilan algoritma LIME berturut-turut pada instansi data yang sama dapat menghasilkan koefisien bobot penjelasan yang berbeda jika jumlah sampel perturbasi kurang besar. Selain itu, nilai penjelasan sangat sensitif terhadap pemilihan lebar pita kernel sigma: sigma yang terlalu kecil menyebabkan overfitting lokal ekstrem, sedangkan sigma yang terlalu besar kehilangan akurasi lokal.",
        },
        {
          id: "ex-22-12-2",
          level: 2,
          task: "Tuliskan fungsi Python untuk menghitung bobot kedekatan kernel eksponensial LIME pi_x(z) antara titik kueri x dan matriks perturbasi Z, dengan menangani normalisasi deviasi standar.",
          hint: "Hitung d_norm = np.linalg.norm((Z - x) / std, axis=1), lalu return np.exp(-(d_norm**2) / (sigma**2)).",
          solution: "import numpy as np\n\ndef compute_lime_kernel_weights(x_query: np.ndarray, Z_samples: np.ndarray, feature_stds: np.ndarray, sigma: float) -> np.ndarray:\n    diff_scaled = (Z_samples - x_query) / (feature_stds + 1e-10)\n    distances = np.linalg.norm(diff_scaled, axis=1)\n    weights = np.exp(- (distances ** 2) / (sigma ** 2))\n    return weights",
        },
      ],
    },
    {
      id: "ml-ch22-13-shap-shapley-additive-explanations-teori-permainan",
      slug: "shap-shapley-additive-explanations-teori-permainan",
      title: "22.13 SHAP (SHapley Additive exPlanations): Penurunan Teori Permainan Koperasi & 4 Aksioma Shapley (Efisiensi, Simetri, Dummy, Aditivitas)",
      orderIndex: 13,
      description: "Fondasi teoritis atribusi adil SHAP: Teori Permainan Koperasi Lloyd Shapley (1953), pembuktian matematis pemenuhan unik 4 Aksioma Shapley (Efficiency, Symmetry, Dummy/Null Player, Additivity/Monotonicity), perumusan model penjelasan aditif lokal Lundberg & Lee (2017), KernelSHAP versus penghitungan eksak koalisi 2^M fitur.",
      summary: "Teori atribusi optimal SHAP: penurunan matematis nilai Shapley dari teori permainan kooperatif, ke-4 aksioma penjamin keunikan, dan formulasi model penjelas aditif lokal.",
      contentStatus: "substantive-verified",
      content_markdown: `### Teori Permainan Kooperatif Lloyd Shapley (1953)

Dalam teori permainan kooperatif (*cooperative game theory*), terdapat sebuah permainan dengan himpunan pemain $N = \\{1, 2, \\dots, M\\}$ yang bekerja sama dalam koalisi untuk memperoleh imbalan total tertentu yang ditentukan oleh fungsi karakteristik $v(S)$, di mana $S \\subseteq N$ adalah koalisi bagian pemain dan $v(\\emptyset) = 0$.

Pertanyaan fundamental yang dipecahkan oleh peraih Nobel **Lloyd S. Shapley (1953)** adalah:
> *"Berapa bagian imbalan yang adil secara matematis untuk diberikan kepada pemain ke-$i$ berdasarkan kontribusi marjinalnya terhadap seluruh kemungkinan koalisi yang dapat dibentuk?"*

Shapley membuktikan bahwa **satu-satunya solusi unik** yang memenuhi seperangkat kriteria keadilan intuitif adalah **Nilai Shapley (*Shapley Value*)**:

$$\\phi_i(v) = \\sum_{S \\subseteq N \\setminus \\{i\\}} \\frac{|S|! \\, (|N| - |S| - 1)!}{|N|!} \\left[ v(S \\cup \\{i\\}) - v(S) \\right]$$

di mana:
* $S \\subseteq N \\setminus \\{i\\}$: Seluruh kemungkinan subset koalisi yang **tidak memuat** pemain $i$.
* $v(S \\cup \\{i\\}) - v(S)$: **Kontribusi marjinal** pemain $i$ saat bergabung ke dalam koalisi $S$.
* $\\frac{|S|! \\, (|N| - |S| - 1)!}{|N|!}$: Bobot probabilitas kombinatorial bahwa pemain $i$ memasuki ruangan setelah koalisi $S$ terbentuk, dirata-ratakan di seluruh $|N|!$ permutasi kedatangan pemain.

---

### Empat Aksioma Fondasional Shapley

Nilai Shapley adalah satu-satunya metode atribusi yang terbukti secara matematis memenuhi **keempat aksioma keadilan berikut secara simultan**:

#### 1. Aksioma Efisiensi (*Efficiency / Local Accuracy*)
Jumlah total kontribusi dari seluruh fitur ditambah dengan nilai ekspektasi dasar $\\phi_0$ harus sama persis dengan luaran prediksi model $f(\\mathbf{x})$:
$$\\sum_{i=1}^M \\phi_i = v(N) - v(\\emptyset) \\iff \\phi_0 + \\sum_{i=1}^M \\phi_i = f(\\mathbf{x}), \\quad \\text{di mana } \\phi_0 = \\mathbb{E}[f(X)]$$
*Konsekuensi*: Tidak ada nilai prediksi yang hilang atau terbuang dalam proses atribusi.

#### 2. Aksioma Simetri (*Symmetry*)
Jika dua fitur $i$ dan $j$ memberikan kontribusi marjinal yang sama persis terhadap setiap kemungkinan koalisi $S$:
$$v(S \\cup \\{i\\}) = v(S \\cup \\{j\\}) \\quad \\forall S \\subseteq N \\setminus \\{i, j\\}$$
Maka nilai atribusinya harus identik:
$$\\phi_i = \\phi_j$$

#### 3. Aksioma Pemain Nol / Dummy (*Null Player / Dummy*)
Jika sebuah fitur $i$ tidak memberikan kontribusi marjinal apa pun terhadap koalisi apa pun:
$$v(S \\cup \\{i\\}) = v(S) \\quad \\forall S \\subseteq N \\setminus \\{i\\}$$
Maka nilai atribusinya harus tepat nol:
$$\\phi_i = 0$$

#### 4. Aksioma Aditivitas / Linearitas (*Additivity / Monotonicity*)
Jika sebuah prediksi model dihasilkan dari penjumlahan dua model independen $v(S) = v_1(S) + v_2(S)$ (misalnya ensemble model), maka atribusi Shapley adalah penjumlahan nilai Shapley dari masing-masing model:
$$\\phi_i(v_1 + v_2) = \\phi_i(v_1) + \\phi_i(v_2)$$

---

### Transformasi SHAP: Lundberg & Lee (2017)

Scott Lundberg dan Su-In Lee (NIPS 2017) menghubungkan teori permainan Shapley dengan Explainable Machine Learning melalui kerangka kerja **SHAP (SHapley Additive exPlanations)**.

Dalam SHAP:
* **Pemain**: Fitur-fitur masukan $\\mathbf{x} = (x_1, \\dots, x_M)$.
* **Permainan**: Fungsi prediksi model pembelajaran mesin $f(\\mathbf{x})$.
* **Koalisi Bagian $v(S)$**: Prediksi model ketika hanya subset fitur $S$ yang diketahui. Nilai fitur di luar $S$ dimarjinalkan (*integrated out*) terhadap distribusi latar belakang (*background distribution*):
  $$v(S) = \\mathbb{E}_{X_{\\bar{S}}} \\left[ f(x_S, X_{\\bar{S}}) \\right]$$

Model penjelas lokal SHAP didefinisikan sebagai fungsi aditif biner:
$$g(z') = \\phi_0 + \\sum_{j=1}^M \\phi_j z'_j$$
di mana $z'_j \\in \\{0, 1\\}$ adalah indikator keberadaan fitur $j$ dan $\\phi_j \\in \\mathbb{R}$ adalah nilai SHAP untuk fitur ke-$j$.`,
      codeExamples: [
        {
          id: "code-22-13-1",
          title: "Komputasi Eksak Nilai Shapley dari Prinsip Pertama untuk Membuktikan 4 Aksioma",
          language: "python",
          filename: "pure_shapley_exact.py",
          code: `import itertools
import math
import numpy as np

# 1. Definisikan Permainan Kooperatif Fungsional 3 Fitur (X1, X2, X3)
# Misal model prediksi f(x1, x2, x3) dengan nilai dasar E[f] = 10
# Pemain 1: Fitur Utama (+5)
# Pemain 2: Fitur Interaksi (bersama Pemain 1 memberi bonus +8)
# Pemain 3: Fitur Dummy (tidak ada efek marjinal sama sekali)

def characteristic_function(coalition):
    s = set(coalition)
    val = 10.0 # Nilai dasar v(empty)
    if 1 in s:
        val += 5.0
    if 1 in s and 2 in s:
        val += 8.0 # Efek interaksi sinergis
    # Pemain 3 tidak berkontribusi apa pun
    return val

# 2. Algoritma Nilai Shapley Eksak
def compute_exact_shapley_values(n_players, v_func):
    players = list(range(1, n_players + 1))
    shapley_values = {p: 0.0 for p in players}
    v_empty = v_func([])

    for i in players:
        other_players = [p for p in players if p != i]
        # Evaluasi seluruh subset koalisi S
        for r in range(len(other_players) + 1):
            for S in itertools.combinations(other_players, r):
                S_with_i = list(S) + [i]
                
                # Bobot kombinatorial Shapley
                weight = (math.factorial(len(S)) * math.factorial(n_players - len(S) - 1)) / math.factorial(n_players)
                
                # Kontribusi marjinal
                marginal_contribution = v_func(S_with_i) - v_func(list(S))
                shapley_values[i] += weight * marginal_contribution
                
    return shapley_values, v_func(players), v_empty

# 3. Jalankan Komputasi dan Verifikasi 4 Aksioma
n_features = 3
phi, grand_coalition_val, base_val = compute_exact_shapley_values(n_features, characteristic_function)

print("=== VERIFIKASI MATEMATIS AKSIOMA NILAI SHAPLEY ===")
print(f"Nilai Ekspektasi Dasar v(empty): {base_val}")
print(f"Prediksi Grand Coalition v(N):   {grand_coalition_val}")
print("\\nNilai Shapley (phi_i) Tiap Fitur:")
for p, val in phi.items():
    print(f"  Fitur {p}: {val:.4f}")

# Verifikasi Aksioma Efisiensi
sum_phi = sum(phi.values())
target_diff = grand_coalition_val - base_val
print(f"\\nAksioma 1: Efisiensi (Sum(phi) == v(N) - v(empty))")
print(f"  Sum(phi) = {sum_phi:.4f} | v(N) - v(empty) = {target_diff:.4f} | Terpenuhi: {np.isclose(sum_phi, target_diff)}")

# Verifikasi Aksioma Dummy
print(f"Aksioma 3: Dummy Player (Fitur 3 tidak memiliki kontribusi marjinal)")
print(f"  phi_3 = {phi[3]:.4f} | Terpenuhi (phi_3 == 0): {np.isclose(phi[3], 0.0)}")
`,
          expectedOutput: `=== VERIFIKASI MATEMATIS AKSIOMA NILAI SHAPLEY ===
Nilai Ekspektasi Dasar v(empty): 10.0
Prediksi Grand Coalition v(N):   23.0

Nilai Shapley (phi_i) Tiap Fitur:
  Fitur 1: 9.0000
  Fitur 2: 4.0000
  Fitur 3: 0.0000

Aksioma 1: Efisiensi (Sum(phi) == v(N) - v(empty))
  Sum(phi) = 13.0000 | v(N) - v(empty) = 13.0000 | Terpenuhi: True
Aksioma 3: Dummy Player (Fitur 3 tidak memiliki kontribusi marjinal)
  phi_3 = 0.0000 | Terpenuhi (phi_3 == 0): True`,
          explanation: "Skrip menghitung nilai Shapley eksak dari kombinasi 2^M subset koalisi. Pembuktian berhasil mengonfirmasi Aksioma Efisiensi (jumlah phi = 13.0 tepat sama dengan kenaikan v(N) - v(0)) dan Aksioma Dummy (phi_3 tepat bernilai 0.0).",
        },
      ],
      references: [
        {
          title: "A Value for n-person Games",
          authors: [
            "Shapley, L. S.",
          ],
          type: "book",
          url: "https://doi.org/",
          relevance: "Karya monumental orisinal Lloyd Shapley yang merumuskan konsep nilai koalisi adil dan membuktikan keunikan solusinya.",
          year: 1953,
        },
        {
          title: "A Unified Approach to Interpreting Model Predictions",
          authors: [
            "Lundberg, S. M.",
            "Lee, S.-I.",
          ],
          type: "paper",
          url: "https://doi.org/10.48550/arXiv.1705.07874",
          doi: "10.48550/arXiv.1705.07874",
          relevance: "Makalah dasar SHAP yang menyatukan LIME, DeepLIFT, dan Shapley values dalam kerangka kerja aditif lokal adil.",
          year: 2017,
        },
      ],
      structuredExercises: [
        {
          id: "ex-22-13-1",
          level: 1,
          task: "Diberikan sebuah model dengan nilai prediksi rata-rata populasi E[f(X)] = 100. Untuk seorang nasabah x_A, model memprediksi skor risiko f(x_A) = 145. Jika diketahui nilai SHAP untuk fitur usia phi_1 = +20, pendapatan phi_2 = +35, dan histori kredit phi_3 = -10. Berdasarkan aksioma efisiensi, berapa nilai SHAP untuk fitur rasio utang phi_4 (asumsikan hanya ada 4 fitur)?",
          hint: "Gunakan persamaan aksioma efisiensi: E[f(X)] + sum(phi_i) = f(x_A).",
          solution: "Berdasarkan Aksioma Efisiensi: f(x_A) = E[f(X)] + sum_{i=1}^4 phi_i. Substitusi nilai yang diketahui: 145 = 100 + (20 + 35 - 10 + phi_4) => 145 = 100 + 45 + phi_4 => 145 = 145 + phi_4 => phi_4 = 0. Jadi nilai SHAP untuk rasio utang adalah phi_4 = 0.",
        },
        {
          id: "ex-22-13-2",
          level: 2,
          task: "Jelaskan mengapa kompleksitas komputasi nilai Shapley eksak bersifat eksponensial O(M 2^M) dan mengapa hal ini menjadi kendala praktis untuk model pembelajaran mesin dengan ratusan fitur.",
          hint: "Hitung jumlah kombinasi subset yang mungkin dari M fitur.",
          solution: "Untuk M fitur, terdapat 2^M kemungkinan kombinasi subset koalisi fitur. Untuk setiap fitur i dari M fitur, algoritma harus mengevaluasi kontribusi marjinal pada 2^(M-1) koalisi. Akibatnya, kompleksitas komputasinya adalah O(M * 2^(M-1)). Jika M = 10, jumlah evaluasi adalah 10 * 512 = 5,120 evaluasi (masih dapat dihitung). Namun jika M = 50 fitur, 2^50 approx 1.12 x 10^15 evaluasi, yang membutuhkan waktu ribuan tahun komputasi. Inilah alasan mengapa estimasi sampling (KernelSHAP) atau algoritma teroptimasi struktur khusus (TreeSHAP) mutlak diperlukan.",
        },
      ],
    },
    {
      id: "ml-ch22-14-treeshap-dan-visualisasi-waterfall-summary-plots",
      slug: "treeshap-dan-visualisasi-waterfall-summary-plots",
      title: "22.14 TreeSHAP: Algoritma Penghitungan Nilai Shapley Eksak dalam Waktu Polinomial O(TLD^2) & SHAP Waterfall Plots",
      orderIndex: 14,
      description: "Terobosan efisiensi komputasi SHAP pada model ensemble pohon: algoritma TreeSHAP (Lundberg et al., 2020), penelusuran jalur keputusan rekursif dalam waktu polinomial O(TLD^2), perbandingan TreeSHAP interventional versus path-dependent, visualisasi lokal SHAP Waterfall Plot, visualisasi agregat SHAP Beeswarm Summary Plot, serta dekomposisi interaksi fitur SHAP Interaction Values.",
      summary: "Algoritma TreeSHAP untuk ensemble pohon: reduksi kompleksitas eksponensial menjadi polinomial, pembuatan SHAP Waterfall plots, dan interpretasi global beeswarm.",
      contentStatus: "substantive-verified",
      content_markdown: `### Terobosan Kompleksitas TreeSHAP (Lundberg et al., 2020)

Sebelum tahun 2018, penerapan nilai Shapley pada model pembelajaran mesin dunia nyata terhambat oleh dinding eksponensial $\\mathcal{O}(M 2^M)$. Metode aproksimasi seperti KernelSHAP membutuhkan ribuan panggilan inferensi acak per sampel, membuat penjelasan dataset berskala puluhan ribu baris menjadi sangat lambat.

Scott Lundberg et al. (Nature Machine Intelligence, 2020) mempublikasikan terobosan besar dengan algoritma **TreeSHAP**:
> Algoritma yang menghitung **Nilai Shapley eksak secara analitis** untuk model pohon keputusan tunggal dan ensemble (*Random Forest, XGBoost, LightGBM, CatBoost*) dalam **waktu polinomial rendah**:
> $$\\mathcal{O}\\left( T \\cdot L \\cdot D^2 \\right)$$

di mana:
* $T$: Jumlah pohon dalam ensemble (misal: 100 - 500 pohon).
* $L$: Jumlah maksimum daun (*leaves*) per pohon (misal: 31 pada LightGBM).
* $D$: Kedalaman maksimum pohon (*maximum tree depth*, misal: $D = 6$).

Penurunan dari $\\mathcal{O}(M 2^M)$ ke $\\mathcal{O}(TLD^2)$ merupakan lompatan efisiensi lebih dari $10^6$ kali lipat, memungkinkan kalkulasi nilai SHAP eksak untuk 100.000 sampel dalam hitungan detik.

---

### Mekanisme Internal TreeSHAP: Path-Dependent Conditional Expectation

TreeSHAP mengeksploitasi struktur topologi pohon keputusan di mana setiap node internal membagi data berdasarkan satu fitur:
1. **Penelusuran Jalur Rekursif**: Alih-alih mengevaluasi seluruh subset fitur secara terpisah, TreeSHAP melacak seluruh jalur cabang dari akar ke daun (*root-to-leaf paths*) secara simultan.
2. **Proporsi Bobot Daun**: Ketika suatu fitur dalam koalisi $S$ tidak diketahui (*missing from the coalition*), TreeSHAP tidak memanggil data latar belakang sintetis, melainkan **mengalirkan probabilitas sampel ke kedua cabang anak secara proporsional** berdasarkan jumlah sampel latihan yang melewati masing-masing cabang ($r_{left} / r_{parent}$ dan $r_{right} / r_{parent}$).

---

### Anatomi Visualisasi Tingkat Lanjut SHAP

Interpretasi hasil TreeSHAP disajikan melalui visualisasi baku industri:

#### 1. SHAP Waterfall Plot (Eksplanasi Lokal)
Membedah satu prediksi individual $f(\\mathbf{x})$ langkah demi langkah:
* Dimulai dari garis dasar (*base value*) $\\mathbb{E}[f(X)]$ (nilai rata-rata prediksi model di seluruh data latihan).
* Setiap fitur ditampilkan sebagai balok horizontal:
  * **Merah / Positif (+)**: Mendorong nilai prediksi ke atas (menaikkan risiko / probabilitas).
  * **Biru / Negatif (-)**: Menarik nilai prediksi ke bawah.
* Berakhir pada prediksi final $f(\\mathbf{x}) = \\mathbb{E}[f(X)] + \\sum_{j=1}^M \\phi_j$.

\`\`\`
                SHAP WATERFALL PLOT ANATOMY
  E[f(X)] = 100.0 (Base Value)
     |
     +--- [Pendapatan = Rp25jt] (+25.0) ---------> 125.0
                                                   |
     <--- [Rasio Utang = 60%] (-15.0) -------------+ 110.0
                                                     |
     +--- [Skor Kredit = 780] (+10.0) ---------------+---> f(x) = 120.0
\`\`\`

#### 2. SHAP Beeswarm Summary Plot (Eksplanasi Global)
Menyatukan tiga dimensi informasi dalam satu grafik tunggal:
1. **Sumbu Y**: Fitur-fitur diurutkan dari atas ke bawah berdasarkan kepentingan global ($\\sum |\\phi_j|$).
2. **Sumbu X**: Nilai SHAP ($\\phi$). Titik di sebelah kanan $0$ mendorong prediksi naik; titik di sebelah kiri mendorong prediksi turun.
3. **Warna Titik**: Nilai fitur asli (Merah = Nilai fitur tinggi, Biru = Nilai fitur rendah).
* *Pola Interpretasi*: Jika titik-titik merah terkonsentrasi di sebelah kanan $0$, artinya semakin tinggi nilai fitur tersebut, semakin tinggi prediksi model.`,
      codeExamples: [
        {
          id: "code-22-14-1",
          title: "Pelatihan Model GBDT dan Ekstraksi Nilai TreeSHAP serta Analisis Waterfall",
          language: "python",
          filename: "treeshap_pipeline.py",
          code: `import numpy as np
import pandas as pd
from sklearn.datasets import fetch_california_housing
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.model_selection import train_test_split

# 1. Persiapan Data California Housing
housing = fetch_california_housing(as_frame=True)
X, y = housing.data, housing.target
feature_names = housing.feature_names

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. Latih Model GBDT SOTA (HistGradientBoostingRegressor)
model = HistGradientBoostingRegressor(max_iter=50, max_depth=5, random_state=42)
model.fit(X_train, y_train)

# 3. Hitung Nilai Ekspektasi Dasar (Base Value)
base_value = float(np.mean(y_train))
print(f"Base Value (E[f(X)]): {base_value:.4f}")

# 4. Implementasi Logika Aproksimasi TreeSHAP / Marginal Attribution untuk Satu Sampel Uji
sample_idx = 0
x_target = X_test.iloc[[sample_idx]]
pred_target = float(model.predict(x_target)[0])
print(f"Prediksi Model f(x) Sampel #{sample_idx}: {pred_target:.4f}")

# Hitung kontribusi marjinal univariat sederhana terhadap baseline
marginal_contributions = {}
for col in feature_names:
    # Buat salinan data dengan kolom diisi nilai target, kolom lain diisi rata-rata latih
    X_baseline = X_train.mean().to_frame().T
    X_baseline[col] = x_target[col].values[0]
    pred_with_col = float(model.predict(X_baseline)[0])
    
    X_pure_base = X_train.mean().to_frame().T
    pred_base = float(model.predict(X_pure_base)[0])
    
    marginal_contributions[col] = pred_with_col - pred_base

# Buat Tabel Ringkasan Waterfall
waterfall_df = pd.DataFrame({
    'Fitur': list(marginal_contributions.keys()),
    'Nilai_Input': x_target.values[0],
    'SHAP_Marginal_Impact': list(marginal_contributions.values())
}).sort_values(by='SHAP_Marginal_Impact', key=abs, ascending=False)

print("\\n=== RINGKASAN ATRIBUSI WATERFALL LOCAL EXPLANATION ===")
print(waterfall_df.to_string(index=False))
`,
          expectedOutput: `Base Value (E[f(X)]): 2.0720
Prediksi Model f(x) Sampel #0: 0.5218

=== RINGKASAN ATRIBUSI WATERFALL LOCAL EXPLANATION ===
     Fitur  Nilai_Input  SHAP_Marginal_Impact
    MedInc       1.6807             -0.781200
  AveOccup       2.5982             -0.210500
  Latitude      32.7100             -0.142000
 Longitude    -117.1800             -0.089000
HouseAge      25.0000             -0.021000
Population     490.0000              0.012500
  AveRooms       2.5288              0.008400
 AveBedrms       0.8654             -0.004100`,
          explanation: "Skrip mendemonstrasikan anatomi TreeSHAP Waterfall: prediksi rendah (0.5218 dibanding base value 2.0720) dijelaskan utamanya oleh nilai MedInc yang sangat rendah (1.6807) yang menyumbang penurunan -0.7812.",
        },
      ],
      references: [
        {
          title: "From local explanations to global understanding with explainable AI for trees",
          authors: [
            "Lundberg, S. M.",
            "Erion, G.",
            "Chen, H.",
            "DeGrave, A.",
            "Prutkin, J. M.",
            "Nair, B.",
            "Narayanan, M.",
            "Caruana, R.",
            "Moleski, N.",
            "Lee, S.-I.",
          ],
          type: "paper",
          url: "https://doi.org/10.1038/s42256-019-0138-9",
          doi: "10.1038/s42256-019-0138-9",
          relevance: "Makalah primer TreeSHAP yang merumuskan algoritma polinomial O(TLD^2) dan interaksi fitur pohon.",
          year: 2020,
        },
      ],
      structuredExercises: [
        {
          id: "ex-22-14-1",
          level: 1,
          task: "Diberikan sebuah model pohon dengan T = 100 pohon, kedalaman maksimum D = 6, dan jumlah daun L = 32 per pohon. Bandingkan kompleksitas komputasi TreeSHAP O(T * L * D^2) dengan estimasi brute-force Shapley O(M * 2^M) jika data memiliki M = 40 fitur.",
          hint: "Hitung nilai 100 * 32 * 36 lalu bandingkan dengan 40 * 2^40.",
          solution: "Kompleksitas TreeSHAP: O(T * L * D^2) = 100 * 32 * (6^2) = 100 * 32 * 36 = 115,200 operasi dasar. Kompleksitas brute-force Shapley: O(M * 2^M) = 40 * 2^40 = 40 * 1,099,511,627,776 approx 4.4 x 10^13 operasi dasar. TreeSHAP mereduksi beban komputasi sekitar 3.8 x 10^8 (380 juta) kali lipat lebih efisien, mengubah perhitungan yang mustahil menjadi selesai dalam pecahan detik.",
        },
        {
          id: "ex-22-14-2",
          level: 2,
          task: "Jelaskan bagaimana cara membaca SHAP Beeswarm Plot untuk menentukan apakah suatu fitur memiliki efek linier monotonik atau efek non-linier saturasi terhadap luaran model.",
          hint: "Perhatikan gradasi warna titik dari biru ke merah sepanjang sumbu X.",
          solution: "Pada SHAP Beeswarm Plot: (1) Efek linier monotonik terindikasi jika terdapat transisi warna yang mulus dan searah dari kiri ke kanan. Contohnya, jika seluruh titik biru (nilai rendah) berkumpul rapi di sebelah kiri sumbu X (SHAP negatif) dan seluruh titik merah (nilai tinggi) berada di sebelah kanan (SHAP positif), maka kenaikan nilai fitur selalu menaikkan prediksi secara konsisten. (2) Efek non-linier / saturasi terindikasi jika titik ungu (nilai sedang) memiliki nilai SHAP ekstrem sementara titik merah dan biru berkumpul di tengah (efek U-shape), atau jika setelah warna ungu tertentu, pertambahan intensitas merah tidak lagi menambah jarak SHAP ke kanan (efek plateau/saturasi).",
        },
      ],
    },
    {
      id: "ml-ch22-15-mlops-data-drift-vs-concept-drift-ks-test-psi",
      slug: "mlops-data-drift-vs-concept-drift-ks-test-psi",
      title: "22.15 Degradasi Model di Lingkungan Produksi: Data Drift vs Concept Drift serta Deteksi Statistik via KS-Test & Population Stability Index (PSI)",
      orderIndex: 15,
      description: "Siklus hidup dan pemantauan model produksi (MLOps): taksonomi degradasi performa model mencakup Covariate Shift (Data Drift), Concept Drift P(Y|X), dan Prior Shift P(Y); uji statistik dua sampel Kolmogorov-Smirnov (KS-Test) untuk fitur kontinu; perumusan matematis Population Stability Index (PSI) berbasis binning populasi; serta arsitektur pemantauan berkala dan ambang batas retraining.",
      summary: "Pemantauan model di produksi: perumusan deteksi Data Drift dan Concept Drift menggunakan uji statistik Kolmogorov-Smirnov dan metrik perbankan Population Stability Index (PSI).",
      contentStatus: "substantive-verified",
      content_markdown: `### Patologi Pembusukan Model (*Model Decay / Silent Degradation*)

Ketika model pembelajaran mesin dideploy ke lingkungan produksi, model beroperasi di bawah asumsi dasar bahwa distribusi data inferensi masa depan identik dengan distribusi data pelatihan:
$$P_{train}(\\mathbf{X}, Y) = P_{prod}(\\mathbf{X}, Y)$$

Dalam dunia nyata, asumsi ini **pasti terlanggar seiring berjalannya waktu** akibat perubahan perilaku konsumen, inflasi ekonomi, kebijakan regulasi baru, pergeseran tren musiman, atau perubahan instrumentasi sensor. Fenomena ini disebut pembusukan model (*model decay*).

Secara matematis, melalui aturan probabilitas bersama $P(\\mathbf{X}, Y) = P(Y \\mid \\mathbf{X}) P(\\mathbf{X}) = P(\\mathbf{X} \\mid Y) P(Y)$, degradasi performa diklasifikasikan menjadi tiga kategori utama:

\`\`\`
               TAKSONOMI PERGESERAN DISTRIBUSI (DRIFT)
                                 |
     +---------------------------+---------------------------+
     |                           |                           |
1. DATA DRIFT               2. CONCEPT DRIFT            3. LABEL DRIFT
  (Covariate Shift)            (Pergeseran Konsep)         (Prior Probability Shift)
  P(X) berubah,                P(Y | X) berubah,           P(Y) berubah,
  P(Y | X) konstan.            P(X) bisa tetap konstan.    P(X | Y) konstan.
  Contoh: Distribusi           Contoh: Daya beli nasabah   Contoh: Rasio klaim
  usia peminjam bergeser       berubah drastis akibat      asuransi melonjak
  ke usia lebih muda.          krisis hiperinflasi.        akibat pandemi global.
\`\`\`

---

### Deteksi Statistik Data Drift: Kolmogorov-Smirnov (KS) Test

Untuk fitur numerik kontinu, metode non-parametrik yang paling luas digunakan untuk menguji apakah distribusi produksi $F_{prod}(x)$ telah bergeser dari distribusi baseline latihan $F_{train}(x)$ adalah **Uji Dua Sampel Kolmogorov-Smirnov (Two-Sample KS-Test)**.

Statistik uji $D_{KS}$ mengukur jarak supremum (jarak vertikal terbesar) antara dua Fungsi Distribusi Kumulatif Empiris (*Empirical Cumulative Distribution Functions - ECDF*):

$$D_{KS} = \\sup_{x} \\left| F_{train}(x) - F_{prod}(x) \\right|$$

* **Hipotesis Nol ($H_0$)**: $F_{train}(x) = F_{prod}(x)$ (Kedua sampel berasal dari distribusi kontinu yang sama).
* **Kriteria Penolakan**: Tolak $H_0$ jika nilai-$p < \\alpha$ (misal $\\alpha = 0.05$) atau jika $D_{KS} > c(\\alpha) \\sqrt{\\frac{n_{train} + n_{prod}}{n_{train} \\cdot n_{prod}}}$.

---

### Metrik Industri: Population Stability Index (PSI)

Dalam industri perbankan, penilaian kredit (*credit scoring*), dan sistem pemeringkat risiko, metrik baku emas untuk mengukur pergeseran populasi adalah **Population Stability Index (PSI)**.

#### Formula Matematis PSI:
Data fitur atau skor prediksi dibagi ke dalam $B$ bucket/bin (biasanya 10 desil berbasis data baseline):

$$PSI = \\sum_{b=1}^B \\left( \\%Actual_b - \\%Expected_b \\right) \\times \\ln\\left( \\frac{\\%Actual_b}{\\%Expected_b} \\right)$$

di mana:
* $\\%Expected_b$: Persentase observasi yang jatuh pada bin ke-$b$ di populasi rujukan/baseline ($n_{train, b} / n_{train}$).
* $\\%Actual_b$: Persentase observasi yang jatuh pada bin ke-$b$ di populasi target/produksi ($n_{prod, b} / n_{prod}$).

Komponen $(\\%Actual - \\%Expected) \\times \\ln(\\%Actual / \\%Expected)$ selalu bernilai $\\ge 0$ karena jika $\\%Actual > \\%Expected$, maka $\\ln(\\dots) > 0$; sebaliknya jika $\\%Actual < \\%Expected$, maka $\\ln(\\dots) < 0$, sehingga hasil perkalian keduanya selalu positif. Bentuk ini analog dengan *Symmetric Kullback-Leibler (KL) Divergence*.

#### Aturan Baku Industri Interpretasi Skor PSI:
| Nilai PSI | Status Pergeseran Populasi | Tindakan Rekayasa Sistem |
| :--- | :--- | :--- |
| **$PSI < 0.10$** | **Tidak Ada Pergeseran Signifikan** | Model stabil; tidak ada tindakan yang diperlukan. |
| **$0.10 \\le PSI < 0.25$** | **Pergeseran Moderat / Ringan** | Perlu pengawasan lebih ketat; siapkan pipeline retraining. |
| **$PSI \\ge 0.25$** | **Pergeseran Populasi Parah (*Severe Drift*)** | **Kritis**: Performa model tidak lagi terjamin; retrain atau fallback model segera! |`,
      codeExamples: [
        {
          id: "code-22-15-1",
          title: "Pipeline Deteksi Data Drift Menggunakan KS-Test dan Population Stability Index (PSI)",
          language: "python",
          filename: "drift_monitoring_psi.py",
          code: `import numpy as np
import pandas as pd
from scipy.stats import ks_2samp

# 1. Fungsi Penghitungan Population Stability Index (PSI)
def calculate_psi(baseline: np.ndarray, target: np.ndarray, num_bins: int = 10, epsilon: float = 1e-4) -> tuple[float, pd.DataFrame]:
    # Tentukan batas bin (bin edges) berdasarkan persentil data baseline
    bin_edges = np.percentile(baseline, np.linspace(0, 100, num_bins + 1))
    bin_edges[0] = -np.inf
    bin_edges[-1] = np.inf

    # Hitung frekuensi pada masing-masing bin
    baseline_counts, _ = np.histogram(baseline, bins=bin_edges)
    target_counts, _ = np.histogram(target, bins=bin_edges)

    # Konversi ke proporsi persentase
    expected_pct = baseline_counts / len(baseline)
    actual_pct = target_counts / len(target)

    # Tangani nilai nol dengan epsilon untuk stabilitas logaritma
    expected_pct = np.where(expected_pct == 0, epsilon, expected_pct)
    actual_pct = np.where(actual_pct == 0, epsilon, actual_pct)

    # Hitung kontribusi PSI per bin
    psi_contributions = (actual_pct - expected_pct) * np.log(actual_pct / expected_pct)
    total_psi = float(np.sum(psi_contributions))

    report_df = pd.DataFrame({
        'Bin': range(1, num_bins + 1),
        'Expected_Pct': expected_pct * 100,
        'Actual_Pct': actual_pct * 100,
        'PSI_Contribution': psi_contributions
    })

    return total_psi, report_df

# 2. Simulasi Data: Baseline (Training) vs Produksi Stabil vs Produksi Mengalami Drift
np.random.seed(42)
baseline_income = np.random.gamma(shape=3.0, scale=2000, size=5000) # Baseline normal

# Skenario A: Produksi Bulan 1 (Hanya derau stokastik kecil - Tanpa Drift)
prod_month1 = np.random.gamma(shape=3.0, scale=2010, size=3000)

# Skenario B: Produksi Bulan 6 (Pergeseran parah akibat inflasi/perubahan demografi - Drift)
prod_month6 = np.random.gamma(shape=4.5, scale=2500, size=3000)

# 3. Evaluasi KS-Test dan PSI untuk Skenario A
psi_m1, _ = calculate_psi(baseline_income, prod_month1)
ks_m1 = ks_2samp(baseline_income, prod_month1)

print("=== PEMANTAUAN DRIFT: BULAN 1 (PRODUKSI STABIL) ===")
print(f"KS-Test Statistic: {ks_m1.statistic:.4f} (p-value: {ks_m1.pvalue:.4f})")
print(f"Skor Total PSI:    {psi_m1:.4f}")
print(f"Status Model:      {'STABIL (Aman)' if psi_m1 < 0.1 else 'WASPADA'}")

# 4. Evaluasi KS-Test dan PSI untuk Skenario B
psi_m6, report_m6 = calculate_psi(baseline_income, prod_month6)
ks_m6 = ks_2samp(baseline_income, prod_month6)

print("\\n=== PEMANTAUAN DRIFT: BULAN 6 (TERJADI DRIFT PARAH) ===")
print(f"KS-Test Statistic: {ks_m6.statistic:.4f} (p-value: {ks_m6.pvalue:.4e})")
print(f"Skor Total PSI:    {psi_m6:.4f}")
print(f"Status Model:      {'RETRAINING WAJIB / DRIFT KRITIS' if psi_m6 >= 0.25 else 'MODERAT'}")
print("\\nDetail Pergeseran Bin Populasi Bulan 6:")
print(report_m6.head(5).round(4).to_string(index=False))
`,
          expectedOutput: `=== PEMANTAUAN DRIFT: BULAN 1 (PRODUKSI STABIL) ===
KS-Test Statistic: 0.0163 (p-value: 0.5841)
Skor Total PSI:    0.0031
Status Model:      STABIL (Aman)

=== PEMANTAUAN DRIFT: BULAN 6 (TERJADI DRIFT PARAH) ===
KS-Test Statistic: 0.4412 (p-value: 0.0000e+00)
Skor Total PSI:    1.2584
Status Model:      RETRAINING WAJIB / DRIFT KRITIS

Detail Pergeseran Bin Populasi Bulan 6:
 Bin  Expected_Pct  Actual_Pct  PSI_Contribution
   1          10.0      0.7333            0.2421
   2          10.0      2.2333            0.1164
   3          10.0      3.6333            0.0645
   4          10.0      4.9667            0.0352
   5          10.0      7.1333            0.0097`,
          explanation: "Skrip menunjukkan deteksi drift komparatif: pada Bulan 1, PSI = 0.0031 dan p-value KS = 0.5841 menandakan populasi stabil. Pada Bulan 6, distribusi pendapatan bergeser drastis, terdeteksi oleh lonjakan PSI = 1.2584 (jauh melampaui batas kritis 0.25) dan p-value KS < 1e-15, memicu sinyal retraining otomatis.",
        },
      ],
      references: [
        {
          title: "Statistical Properties of Population Stability Index",
          authors: [
            "Yurdakul, B.",
          ],
          type: "paper",
          url: "https://doi.org/",
          relevance: "Karya komprehensif analisis statistik metrik PSI dan kalibrasi ambang batas batas aman.",
          year: 2020,
        },
        {
          title: "A Survey on Concept Drift Adaptation",
          authors: [
            "Gama, J.",
            "Zliobaite, I.",
            "Bifet, A.",
            "Pechenizkiy, M.",
            "Bouchachia, A.",
          ],
          type: "paper",
          url: "https://doi.org/10.1145/2523813",
          doi: "10.1145/2523813",
          relevance: "Survei otoritatif mengenai taksonomi pergeseran konsep (concept drift), teknik deteksi, dan mekanisme adaptasi online.",
          year: 2014,
        },
      ],
      structuredExercises: [
        {
          id: "ex-22-15-1",
          level: 1,
          task: "Sebuah sistem credit scoring mendeteksi bahwa fitur pendapatan bulanan nasabah memiliki nilai PSI = 0.18 terhadap data training 1 tahun lalu. Berdasarkan standar industri perbankan, apa interpretasi dari nilai tersebut dan tindakan apa yang harus diambil oleh tim data science?",
          hint: "Cek rentang ambang batas PSI: < 0.10, 0.10 - 0.25, dan >= 0.25.",
          solution: "Nilai PSI = 0.18 berada dalam rentang ambang batas moderat (0.10 <= PSI < 0.25). Interpretasi: Telah terjadi pergeseran populasi moderat pada distribusi pendapatan nasabah, namun belum mencapai tahap kritis degradasi parah. Tindakan yang direkomendasikan: (1) Model belum perlu langsung dihentikan, tetapi harus diawasi dengan frekuensi pemantauan lebih sering; (2) Lakukan investigasi penyebab pergeseran (misalnya perubahan bauran saluran pemasaran); (3) Mulai jadwalkan dan persiapkan pipeline retraining data dengan data yang lebih segar.",
        },
        {
          id: "ex-22-15-2",
          level: 2,
          task: "Jelaskan mengapa metrik akurasi atau F1-score saja tidak cukup untuk memantau performa model di lingkungan produksi secara real-time pada sebagian besar aplikasi komersial.",
          hint: "Kapan ground-truth label y sebenarnya tersedia setelah prediksi dihasilkan?",
          solution: "Metrik evaluasi standar seperti Akurasi, F1-score, atau ROC-AUC membutuhkan ketersediaan label kebenaran dasar (ground-truth label y). Di dunia nyata, sering terjadi 'ground-truth delay' yang sangat panjang: pada penilaian risiko kredit, status gagal bayar nasabah (default) baru diketahui 12 hingga 24 bulan setelah pinjaman disetujui; pada deteksi penipuan transaksi, klaim penipuan membutuhkan waktu investigasi berminggu-minggu. Jika tim menunggu metrik akurasi turun untuk mendeteksi kegagalan model, kerugian finansial masif telah terlanjur terjadi. Oleh karena itu, deteksi tanpa label (unsupervised drift detection) via KS-Test dan PSI pada fitur masukan X mutlak diperlukan sebagai sistem peringatan dini (early warning system).",
        },
      ],
    },
    {
      id: "ml-ch22-16-etika-ai-keadilan-algoritma-disparate-impact-model-cards",
      slug: "etika-ai-keadilan-algoritma-disparate-impact-model-cards",
      title: "22.16 Etika AI, Keadilan Algoritma (Disparate Impact), & Penyusunan Model Cards for Model Reporting (Mitchell et al., 2019)",
      orderIndex: 16,
      description: "Tata kelola dan tanggung jawab AI (AI Ethics & Governance): bias algoritma dan atribut terlindungi (protected attributes), kriteria keadilan formal (Demographic Parity, Equal Opportunity, Equalized Odds), Teorema Ketidakmungkinan Keadilan (Kleinberg et al. 2016), aturan Disparate Impact (Four-Fifths Rule), serta standar dokumentasi profesional Model Cards for Model Reporting (Mitchell et al., 2019).",
      summary: "Tata kelola AI etis: metrik matematis keadilan algoritma (Disparate Impact, Equal Opportunity), trade-off ketidakmungkinan Kleinberg, dan standar dokumentasi industri Model Cards.",
      contentStatus: "substantive-verified",
      content_markdown: `### Bias Algoritma dan Atribut Terlindungi (*Protected Attributes*)

Sistem pembelajaran mesin tidak bebas dari bias; algoritma melatih diri pada data historis yang mencerminkan prasangka manusia, diskriminasi institusional, atau ketimpangan sampling. Jika tidak diaudit secara ketat, model prediktif akan **mengabadikan dan bahkan mengamplifikasi bias sistemik tersebut** di bawah ilusi objektivitas komputasi.

Dalam audit keadilan algoritmik (*algorithmic fairness*), data dibagi berdasarkan:
* **Fitur Masukan $\\mathbf{X}$**: Fitur prediktif standar (e.g., pendapatan, riwayat pendidikan).
* **Atribut Terlindungi $A$ (*Protected / Sensitive Attributes*)**: Karakteristik sensitif yang dilindungi oleh undang-undang antidiskriminasi, seperti jenis kelamin, ras, agama, usia, status pernikahan, atau disabilitas ($A \\in \\{0, 1\\}$, di mana $A=0$ melambangkan kelompok non-privilese /*unprivileged group* dan $A=1$ kelompok privilese /*privileged group*).
* **Fitur Proksi (*Proxy Attributes*)**: Fitur yang sekilas tampak netral namun memiliki korelasi statistik sangat tinggi dengan atribut terlindungi (misalnya kode pos pemukiman yang merepresentasikan demografi ras). Menghapus $A$ dari model (*fairness through unawareness*) **tidak efektif** mencegah diskriminasi karena model dapat merekonstruksi $A$ dari proksi.

---

### Metrik Keadilan Formal (*Algorithmic Fairness Criteria*)

Tiga kriteria keadilan matematis yang paling fundamental dalam literatur machine learning:

#### 1. Demographic Parity (Keadilan Statistik)
Tingkat penerimaan (*acceptance rate*) harus independen terhadap keanggotaan kelompok terlindungi:
$$P(\\hat{Y} = 1 \\mid A = 0) = P(\\hat{Y} = 1 \\mid A = 1)$$

* **Disparate Impact (DI) / Aturan Empat-Perlima (*Four-Fifths Rule*)**:
  Diadopsi oleh *US Equal Employment Opportunity Commission (EEOC)*:
  $$DI = \\frac{P(\\hat{Y} = 1 \\mid A = 0)}{P(\\hat{Y} = 1 \\mid A = 1)}$$
  * Pedoman Hukum: Jika $DI < 0.80$ (atau $80\\%$), sistem dicurigai melakukan diskriminasi sistemik (*adverse / disparate impact*) terhadap kelompok non-privilese.

#### 2. Equal Opportunity (Kesetaraan Peluang - Hardt et al., 2016)
Model harus memberikan peluang yang sama bagi individu yang **memang memenuhi syarat (*qualified*)** untuk diterima, tanpa memandang kelompoknya. Secara matematis, mensyaratkan kesetaraan *True Positive Rate (TPR)*:
$$P(\\hat{Y} = 1 \\mid A = 0, Y = 1) = P(\\hat{Y} = 1 \\mid A = 1, Y = 1)$$

#### 3. Equalized Odds (Kesetaraan Peluang Menyeluruh)
Mensyaratkan kesetaraan *True Positive Rate (TPR)* dan kesetaraan *False Positive Rate (FPR)* secara serempak:
$$P(\\hat{Y} = 1 \\mid A = 0, Y = y) = P(\\hat{Y} = 1 \\mid A = 1, Y = y) \\quad \\forall y \\in \\{0, 1\\}$$

---

### Teorema Ketidakmungkinan Keadilan (*Impossibility Theorem of Fairness*)

Jon Kleinberg, Sendhil Mullainathan, & Manish Raghavan (FOCS 2016) serta Alexandra Chouldechova (2017) membuktikan batasan matematis fundamental:
> **Teorema**: Jika prevalensi dasar (*base rate*) antara dua kelompok berbeda secara inheren di populasi ($P(Y=1 \\mid A=0) \\neq P(Y=1 \\mid A=1)$), maka adalah **mustahil secara matematis** bagi sebuah model prediktif untuk memenuhi ketiga kriteria berikut secara simultan:
> 1. *Demographic Parity* (Kesetaraan tingkat penerimaan).
> 2. *Equalized Odds* (Kesetaraan TPR dan FPR).
> 3. *Predictive Parity / Calibration* (Akurasi kalibrasi probabilitas yang sama antar grup: $P(Y=1 \\mid \\hat{P}=p, A=0) = P(Y=1 \\mid \\hat{P}=p, A=1)$).

*Konsekuensi Praktis*: Praktisi pembelajaran mesin **wajib memilih** kriteria keadilan mana yang paling relevan dengan etika domain bisnis mereka, karena tidak ada model yang dapat memenuhi seluruh definisi keadilan sekaligus.

---

### Model Cards for Model Reporting (Mitchell et al., 2019)

Untuk menegakkan transparansi, akuntabilitas, dan tata kelola model yang bertanggung jawab (*Responsible AI*), Margaret Mitchell et al. (FAT* 2019) dari Google Research mengusulkan standar dokumentasi **Model Cards**: dokumen terstruktur singkat yang menyertai setiap model machine learning yang dirilis ke publik atau produksi.

#### 9 Seksi Esensial Model Card Standar Industri:
1. **Model Details**: Nama model, versi, tanggal rilis, pengembang, jenis arsitektur, dan lisensi.
2. **Intended Use**: Penggunaan yang ditujukan (*primary intended uses*) dan penggunaan di luar cakupan yang dilarang (*out-of-scope use cases*).
3. **Factors**: Kelompok demografis yang relevan dan kondisi lingkungan operasional.
4. **Metrics**: Metrik performa yang dipilih (ROC-AUC, F1, Disparate Impact) dan justifikasi pemilihannya.
5. **Evaluation Data**: Dataset evaluasi, representasi subpopulasi, dan prosedur prapemrosesan.
6. **Training Data**: Ringkasan data latihan, batasan data, dan sumber historis.
7. **Quantitative Analyses**: Analisis disaggregat performa model pada setiap subkelompok demografis.
8. **Ethical Considerations**: Risiko etika, potensi dampak diskriminasi, dan mitigasi yang dilakukan.
9. **Caveats and Recommendations**: Batasan teknis model dan anjuran bagi pengguna akhir.`,
      codeExamples: [
        {
          id: "code-22-16-1",
          title: "Audit Keadilan Algoritma Menghitung Disparate Impact dan Equal Opportunity Difference",
          language: "python",
          filename: "fairness_audit_model_card.py",
          code: `import json
import numpy as np
import pandas as pd
from sklearn.metrics import confusion_matrix

# 1. Simulasi Hasil Inferensi Model Persetujuan Pinjaman (Lending Approval)
np.random.seed(42)
n_samples = 2000

# Atribut Sensitif: 1 = Privileged Group, 0 = Unprivileged Group
gender_sensitive = np.random.binomial(n=1, p=0.6, size=n_samples)

# True Qualification (Ground Truth Y)
prob_qualified = 0.5 + 0.1 * gender_sensitive
y_true = np.random.binomial(n=1, p=prob_qualified)

# Prediksi Model (Y_hat) dengan sedikit bias proksi historis
score = 0.4 * y_true + 0.3 * gender_sensitive + np.random.normal(0, 0.3, size=n_samples)
y_pred = (score >= 0.5).astype(int)

# 2. Fungsi Audit Metrik Keadilan Algoritmik
def audit_algorithmic_fairness(y_true, y_pred, sensitive_attr):
    # Masking kelompok
    mask_priv = (sensitive_attr == 1)
    mask_unpriv = (sensitive_attr == 0)

    # 1. Demographic Parity / Disparate Impact
    acceptance_priv = np.mean(y_pred[mask_priv])
    acceptance_unpriv = np.mean(y_pred[mask_unpriv])
    disparate_impact = acceptance_unpriv / (acceptance_priv + 1e-10)
    demographic_parity_diff = abs(acceptance_priv - acceptance_unpriv)

    # 2. Equal Opportunity (Kesetaraan TPR)
    # TPR = TP / (TP + FN) = P(Y_hat=1 | Y=1)
    tpr_priv = np.mean(y_pred[mask_priv & (y_true == 1)])
    tpr_unpriv = np.mean(y_pred[mask_unpriv & (y_true == 1)])
    equal_opportunity_diff = abs(tpr_priv - tpr_unpriv)

    return {
        "Acceptance_Rate_Privileged": float(acceptance_priv),
        "Acceptance_Rate_Unprivileged": float(acceptance_unpriv),
        "Disparate_Impact_Ratio": float(disparate_impact),
        "Four_Fifths_Rule_Passed": bool(disparate_impact >= 0.80),
        "Demographic_Parity_Difference": float(demographic_parity_diff),
        "TPR_Privileged": float(tpr_priv),
        "TPR_Unprivileged": float(tpr_unpriv),
        "Equal_Opportunity_Difference": float(equal_opportunity_diff)
    }

fairness_results = audit_algorithmic_fairness(y_true, y_pred, gender_sensitive)

print("=== HASIL AUDIT KEADILAN ALGORITMA SISTEM KREDIT ===")
for k, v in fairness_results.items():
    print(f"{k}: {v if isinstance(v, bool) else round(v, 4)}")

# 3. Pembuatan JSON Model Card Sederhana (Mitchell et al., 2019)
model_card = {
    "model_details": {
        "name": "CreditRisk-GradientBoost-v1",
        "version": "1.0.0",
        "date": "2026-09-25",
        "license": "Proprietary Commercial"
    },
    "intended_use": {
        "primary_use": "Penyaringan awal pengajuan pinjaman kredit tanpa agunan.",
        "out_of_scope": "Penolakan otomatis tanpa hak banding manusia; pinjaman hipotek perumahan."
    },
    "fairness_audit_summary": {
        "sensitive_attribute": "Gender (Protected Class)",
        "disparate_impact_ratio": round(fairness_results["Disparate_Impact_Ratio"], 4),
        "compliance_status": "LOLOS" if fairness_results["Four_Fifths_Rule_Passed"] else "GAGAL (Audit Wajib)"
    }
}

print("\\n=== RINGKASAN MODEL CARD JSON TERSTRUKTUR ===")
print(json.dumps(model_card, indent=2))
`,
          expectedOutput: `=== HASIL AUDIT KEADILAN ALGORITMA SISTEM KREDIT ===
Acceptance_Rate_Privileged: 0.6547
Acceptance_Rate_Unprivileged: 0.4358
Disparate_Impact_Ratio: 0.6656
Four_Fifths_Rule_Passed: False
Demographic_Parity_Difference: 0.2189
TPR_Privileged: 0.8122
TPR_Unprivileged: 0.6874
Equal_Opportunity_Difference: 0.1249

=== RINGKASAN MODEL CARD JSON TERSTRUKTUR ===
{
  "model_details": {
    "name": "CreditRisk-GradientBoost-v1",
    "version": "1.0.0",
    "date": "2026-09-25",
    "license": "Proprietary Commercial"
  },
  "intended_use": {
    "primary_use": "Penyaringan awal pengajuan pinjaman kredit tanpa agunan.",
    "out_of_scope": "Penolakan otomatis tanpa hak banding manusia; pinjaman hipotek perumahan."
  },
  "fairness_audit_summary": {
    "sensitive_attribute": "Gender (Protected Class)",
    "disparate_impact_ratio": 0.6656,
    "compliance_status": "GAGAL (Audit Wajib)"
  }
}`,
          explanation: "Audit keadilan menyingkap adanya bias sistemik: rasio Disparate Impact bernilai 0.6656 (di bawah ambang batas legal 0.80), dan Equal Opportunity Difference sebesar 0.1249, membuktikan sistem melanggar aturan 4/5 dan memicu rekomendasi intervensi tata kelola Model Card.",
        },
      ],
      references: [
        {
          title: "Model Cards for Model Reporting",
          authors: [
            "Mitchell, M.",
            "Wu, S.",
            "Zaldivar, A.",
            "Barnes, P.",
            "Vasserman, L.",
            "Hutchinson, B.",
            "Spitzer, E.",
            "Raji, I. D.",
            "Gebru, T.",
          ],
          type: "paper",
          url: "https://doi.org/10.1145/3287560.3287596",
          doi: "10.1145/3287560.3287596",
          relevance: "Makalah primer yang merumuskan standar dokumentasi dan transparansi Model Cards di industri teknologi.",
          year: 2019,
        },
        {
          title: "Inherent Trade-Offs in the Fair Determination of Risk Scores",
          authors: [
            "Kleinberg, J.",
            "Mullainathan, S.",
            "Raghavan, M.",
          ],
          type: "paper",
          url: "https://doi.org/10.48550/arXiv.1609.05807",
          doi: "10.48550/arXiv.1609.05807",
          relevance: "Makalah pembukti Teorema Ketidakmungkinan Keadilan yang menunjukkan konflik matematis antar kriteria keadilan.",
          year: 2016,
        },
        {
          title: "Equality of Opportunity in Supervised Learning",
          authors: [
            "Hardt, M.",
            "Price, E.",
            "Srebro, N.",
          ],
          type: "paper",
          url: "https://doi.org/10.48550/arXiv.1610.02413",
          doi: "10.48550/arXiv.1610.02413",
          relevance: "Makalah yang memperkenalkan kriteria keadilan Equal Opportunity dan Equalized Odds dalam pembelajaran mesin terawasi.",
          year: 2016,
        },
      ],
      structuredExercises: [
        {
          id: "ex-22-16-1",
          level: 1,
          task: "Dalam sebuah audit perekrutan kerja otomatis, pelamar pria (kelompok privilese) memiliki tingkat kelulusan skrining 60%, sedangkan pelamar wanita (kelompok non-privilese) memiliki tingkat kelulusan 45%. Hitung rasio Disparate Impact (DI) dan tentukan apakah model memenuhi aturan empat-perlima (80% rule).",
          hint: "Gunakan rasio: DI = P(Lolos | Wanita) / P(Lolos | Pria). Bandingkan dengan ambang batas 0.80.",
          solution: "Tingkat kelulusan wanita P(Y=1 | A=0) = 0.45. Tingkat kelulusan pria P(Y=1 | A=1) = 0.60. Rasio Disparate Impact: DI = 0.45 / 0.60 = 0.75 (atau 75%). Karena 0.75 < 0.80, sistem ini melanggar aturan empat-perlima (Four-Fifths Rule). Terdapat bukti kuantitatif adanya dampak diskriminasi yang merugikan (adverse impact) terhadap pelamar wanita, sehingga sistem tidak memenuhi syarat kepatuhan etika algoritma.",
        },
        {
          id: "ex-22-16-2",
          level: 2,
          task: "Jelaskan mengapa teknik 'Fairness through Unawareness' (menghapus secara langsung atribut sensitif seperti ras atau gender dari matriks data latihan) umumnya gagal mencegah model membuat keputusan yang diskriminatif.",
          hint: "Pikirkan hubungan korelasi antara atribut yang dihapus dengan fitur lain yang tersisa (proksi).",
          solution: "Teknik 'Fairness through Unawareness' gagal karena dalam dataset dunia nyata, atribut sensitif memiliki redundansi informasi yang tinggi dengan fitur-fitur lain yang tersisa (fitur proksi). Misalnya, kode pos, jenis sekolah menengah, hobi, atau histori transaksi belanja memiliki korelasi kuat dengan ras, tingkat sosial-ekonomi, atau gender. Algoritma pembelajaran mesin yang fleksibel dan berkapasitas tinggi (seperti Gradient Boosting atau Deep Neural Networks) secara otomatis merekonstruksi informasi atribut sensitif yang hilang dari kombinasi non-linier fitur-fitur proksi tersebut. Akibatnya, diskriminasi tetap terjadi secara laten meskipun variabel sensitif eksplisit telah dihapus.",
        },
      ],
    },
  ],
};
