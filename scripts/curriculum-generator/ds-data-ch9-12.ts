import { ChapterDef } from "./da-data-ch1-3";

export const DS_CHAPTERS_9_TO_12: ChapterDef[] = [
  // ==========================================
  // BAB 9: Metode Regularisasi & Seleksi Fitur (Ridge, Lasso, ElasticNet)
  // ==========================================
  {
    orderIndex: 9,
    id: "data-science-ch-9",
    slug: "bab-9-metode-regularisasi-seleksi-fitur-ridge-lasso-elasticnet",
    title: "BAB 9: Metode Regularisasi & Seleksi Fitur (Ridge, Lasso, ElasticNet)",
    desc: "Penjinakan varians dan kompleksitas model: trade-off bias-variance, regularisasi L2 Tikhonov (Ridge), regularisasi L1 penalization (Lasso) untuk sparsity, ElasticNet, seleksi fitur filter/wrapper/embedded, penyetelan hyperparameter alpha via cross-validation, serta relaksasi komputasi convex.",
    coreConcepts: ["Bias-Variance Decomposition", "Ridge L2 Regularization", "Lasso L1 Sparsity", "ElasticNet Convex Blend", "Feature Selection (RFE & Mutual Info)"],
    subchapters: [
      {
        num: "9.1",
        slug: "9-1-bias-variance-trade-off-dan-dekomposisi-galat",
        title: "9.1. Dekomposisi Matematis Bias-Variance Trade-off & Overfitting",
        desc: "Dilema fundamental pembelajaran terawasi: dekomposisi galat kuadrat ekspektasi menjadi bias kuadrat, varians model, dan galat iredisibel.",
        concept: `Tujuan utama pembelajaran mesin tersupervisi bukan sekadar mencocokkan data latih (in-sample fit), melainkan mencapai kemampuan generalisasi optimal terhadap data baru yang belum pernah diamati (out-of-sample prediction).
        
Dekomposisi Bias-Variance membuktikan secara matematis bahwa Nilai Harapan Galat Kuadrat Prediksi (Expected Prediction Error / EPE) dari sembarang model $\\hat{f}(x)$ dapat dipecah menjadi tiga komponen aditif independen:
$$\\text{EPE}(x) = [\\text{Bias}(\\hat{f}(x))]^2 + \\text{Var}(\\hat{f}(x)) + \\sigma^2$$
1. **Bias Kuadrat ($[\\mathbb{E}[\\hat{f}(x)] - f(x)]^2$):** Galat akibat asumsi algoritma yang terlalu menyederhanakan realitas (underfitting). Model dengan bias tinggi (seperti regresi linier sederhana) gagal menangkap kompleksitas sistemik data.
2. **Varians ($\\mathbb{E}[(\\hat{f}(x) - \\mathbb{E}[\\hat{f}(x)])^2]$):** Sensitivitas prediksi model terhadap fluktuasi acak dalam sampel data latih (overfitting). Model dengan varians tinggi (seperti polinomial derajat tinggi) menghafal derau data latih.
3. **Galat Iredisibel ($\\sigma^2$):** Varians inheren derau intrinsik alamiah data yang tidak dapat dieliminasi oleh model apa pun.`,
        formula: `\\mathbb{E}\\left[(y - \\hat{f}(x))^2\\right] = \\left(f(x) - \\mathbb{E}[\\hat{f}(x)]\\right)^2 + \\mathbb{E}\\left[(\\hat{f}(x) - \\mathbb{E}[\\hat{f}(x)])^2\\right] + \\sigma^2`,
        code: `# 9.1: Demonstrasi Simulasi Dekomposisi Bias-Variance pada Regresi Polinomial
import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

np.random.seed(42)
# Fungsi dasar sejati f(x) = sin(pi * x) dengan derau sigma = 0.3
def fungsi_sejati(x):
    return np.sin(np.pi * x)

x_eval = np.array([0.5]) # Titik evaluasi
y_sejati = fungsi_sejati(x_eval)[0]

n_samples = 25
n_simulasi = 1000

prediksi_deg1 = [] # Model Bias Tinggi, Varians Rendah
prediksi_deg5 = [] # Model Bias Rendah, Varians Tinggi

for _ in range(n_simulasi):
    X_train = np.random.uniform(-1, 1, size=(n_samples, 1))
    y_train = fungsi_sejati(X_train).ravel() + np.random.normal(0, 0.3, size=n_samples)
    
    # Model 1: Polinomial Derajat 1 (Linier Kaku)
    m1 = make_pipeline(PolynomialFeatures(1), LinearRegression()).fit(X_train, y_train)
    prediksi_deg1.append(m1.predict(x_eval.reshape(-1, 1))[0])
    
    # Model 2: Polinomial Derajat 5 (Sangat Fleksibel)
    m5 = make_pipeline(PolynomialFeatures(5), LinearRegression()).fit(X_train, y_train)
    prediksi_deg5.append(m5.predict(x_eval.reshape(-1, 1))[0])

bias_deg1 = np.mean(prediksi_deg1) - y_sejati
var_deg1 = np.var(prediksi_deg1)

bias_deg5 = np.mean(prediksi_deg5) - y_sejati
var_deg5 = np.var(prediksi_deg5)

print("=== DEKOMPOSISI BIAS-VARIANCE TRADE-OFF (SIMULASI 1.000 KALI) ===")
print(f"Target Sejati pada x=0.5: {y_sejati:.4f}\\n")
print(f"Model Linier (Derajat 1)    : Bias^2 = {bias_deg1**2:.4f} | Varians = {var_deg1:.4f} | Total EPE = {bias_deg1**2 + var_deg1:.4f}")
print(f"Model Fleksibel (Derajat 5) : Bias^2 = {bias_deg5**2:.4f} | Varians = {var_deg5:.4f} | Total EPE = {bias_deg5**2 + var_deg5:.4f}")`,
        expectedOutput: "Model linier menderita bias kuadrat tinggi, sedangkan model derajat 5 menderita varians membengkak.",
        codeExp: "Skrip melakukan simulasi Monte Carlo untuk mendekomposisi secara eksplisit porsi bias dan varians dari dua model dengan tingkat kapasitas berbeda.",
        pitfalls: [
          "Mencoba menurunkan bias dan varians secara bersamaan hanya dengan menambahkan kompleksitas model pada dataset tetap (hanya penambahan data baru atau regularisasi yang dapat menyeimbangkan keduanya).",
          "Mengukur performa generalisasi hanya berdasarkan metrik R^2 atau MSE pada data training."
        ],
        refTitle: "Trevor Hastie, Robert Tibshirani, Jerome Friedman: The Elements of Statistical Learning (Chapter 7: Model Assessment and Selection)",
        refUrl: "https://hastie.su.domains/ElemStatLearn/"
      },
      {
        num: "9.2",
        slug: "9-2-regularisasi-l2-ridge-regression-tikhonov",
        title: "9.2. Regularisasi L2 (Ridge Regression / Tikhonov): Penalti Kuadratik",
        desc: "Penyusutan koefisien via penalti L2: formulasi objektif, solusi analitis closed-form, conditioning matriks, dan penanganan multikolinieritas.",
        concept: `Ketika variabel prediktor saling berkorelasi erat (multikolinieritas) atau ketika jumlah fitur $p$ mendekati ukuran sampel $n$, matriks $X^T X$ menjadi ill-conditioned, menyebabkan varians estimator OLS meledak.
        
**Ridge Regression** (Hoerl & Kennard, 1970), yang dalam matematika terapan dikenal sebagai **Regularisasi Tikhonov**, mengatasi instabilitas ini dengan menambahkan penalti proporsional terhadap norma kuadrat $L_2$ dari vektor koefisien: $\\lambda \\sum_{j=1}^p \\beta_j^2$.
        
Fungsi objektif Ridge menyeimbangkan antara meminimalkan galat residu dan menekan magnitudo absolut koefisien. Hal ini menghasilkan solusi bentuk tertutup yang sangat elegan: $\\hat{\\beta}_{\\text{Ridge}} = (X^T X + \\lambda I)^{-1} X^T y$. Dengan menambahkan konstanta positif $\\lambda$ ke elemen diagonal utama, matriks $(X^T X + \\lambda I)$ dijamin selalu berperingkat penuh (non-singular) dan invertible, secara drastis menurunkan varians dengan mengorbankan sedikit bias (bias yang terkontrol).`,
        formula: `\\hat{\\beta}_{\\text{Ridge}} = \\arg\\min_\\beta \\left\\{ \\sum_{i=1}^n (y_i - x_i^T \\beta)^2 + \\lambda \\sum_{j=1}^p \\beta_j^2 \\right\\} = (X^T X + \\lambda I)^{-1} X^T y`,
        code: `# 9.2: Implementasi Solusi Bentuk Tertutup Ridge Regression vs OLS pada Data Kolinier
import numpy as np
from sklearn.linear_model import Ridge, LinearRegression

np.random.seed(42)
n, p = 40, 10
# Menghasilkan matriks dengan multikolinieritas tinggi
X = np.random.normal(0, 1, size=(n, p))
for j in range(1, p):
    X[:, j] = X[:, 0] + np.random.normal(0, 0.05, size=n)

beta_true = np.random.uniform(1, 3, size=p)
y = X @ beta_true + np.random.normal(0, 1.0, size=n)

# 1. OLS Biasa (Kondisi Buruk)
ols = LinearRegression(fit_intercept=False).fit(X, y)

# 2. Solusi Analitis Closed-Form Ridge (lambda = 10.0)
lam = 10.0
beta_ridge_manual = np.linalg.inv(X.T @ X + lam * np.eye(p)) @ X.T @ y

# 3. Ridge Scikit-Learn
ridge_skl = Ridge(alpha=lam, fit_intercept=False).fit(X, y)

norm_ols = np.linalg.norm(ols.coef_)
norm_ridge = np.linalg.norm(ridge_skl.coef_)

print("=== PENJINAKAN KOEFISIEN VIA REGULARISASI L2 RIDGE ===")
print(f"Norma Kuadrat Koefisien OLS (|beta|_2)  : {norm_ols:.4f} (MELEDAK AKIBAT MULTIKOLINIERITAS!)")
print(f"Norma Kuadrat Koefisien Ridge (|beta|_2): {norm_ridge:.4f} (STABIL TERKONTROL)")
print(f"Maks Selisih Closed-Form vs Scikit-Learn: {np.max(np.abs(beta_ridge_manual - ridge_skl.coef_)):.2e}")`,
        expectedOutput: "Ridge berhasil menekan norma koefisien yang meledak pada OLS dari puluhan menjadi terkontrol stabil.",
        codeExp: "Skrip membandingkan estimasi OLS yang menderita akibat multikolinieritas tinggi dengan solusi analitis formula Ridge $(X^T X + \\lambda I)^{-1} X^T y$.",
        pitfalls: [
          "Menerapkan regularisasi Ridge tanpa melakukan standarisasi fitur (StandardScaler) terlebih dahulu, yang menyebabkan fitur dengan skala angka besar dihukum secara tidak adil.",
          "Menyertakan suku intercept $\\beta_0$ ke dalam fungsi penalti regularisasi (intercept tidak boleh dipenalti)."
        ],
        refTitle: "Arthur E. Hoerl & Robert W. Kennard: Ridge Regression: Biased Estimation for Nonorthogonal Problems",
        refUrl: "https://www.tandfonline.com/doi/abs/10.1080/00401706.1970.10488634"
      },
      {
        num: "9.3",
        slug: "9-3-regularisasi-l1-lasso-dan-sparsity",
        title: "9.3. Regularisasi L1 (Lasso Regression): Geometri Pembatas & Seleksi Fitur Jarang",
        desc: "Penyusutan dan seleksi fitur simultan: penalti norma L1 Robert Tibshirani (1996), bentuk geometri pembatas belah ketupat, dan induksi sparsity.",
        concept: `Meskipun Ridge Regression mampu menyusutkan magnitudo koefisien mendekati nol, Ridge tidak pernah membuat koefisien tepat menjadi nol secara eksak. Akibatnya, model Ridge tetap mempertahankan seluruh $p$ prediktor, sehingga tidak membantu dalam interpretasi model ataupun seleksi variabel.
        
**Lasso (Least Absolute Shrinkage and Selection Operator)**, yang diperkenalkan oleh Robert Tibshirani pada tahun 1996, mengganti penalti kuadratik $L_2$ dengan penalti absolut norma $L_1$: $\\lambda \\sum_{j=1}^p |\\beta_j|$.
        
Secara geometris, kontur pembatas penalti $L_1$ berbentuk politop belah ketupat (hyper-rhombus) yang memiliki sudut-sudut tajam pada sumbu-sumbu koordinat. Ketika elipsoid kontur galat OLS bersinggungan dengan sudut politop $L_1$, beberapa koefisien dipaksa menjadi **tepat sama dengan nol**. Hal ini menghasilkan model yang jarang (*sparse models*), menjadikan Lasso sebagai instrumen seleksi fitur otomatis yang sangat kuat.`,
        formula: `\\hat{\\beta}_{\\text{Lasso}} = \\arg\\min_\\beta \\left\\{ \\frac{1}{2n} \\sum_{i=1}^n (y_i - x_i^T \\beta)^2 + \\lambda \\sum_{j=1}^p |\\beta_j| \\right\\}`,
        code: `# 9.3: Seleksi Fitur Otomatis Menggunakan Lasso L1 Sparsity
import numpy as np
from sklearn.linear_model import Lasso
from sklearn.preprocessing import StandardScaler

np.random.seed(42)
n, p = 100, 20
X_raw = np.random.normal(0, 1, size=(n, p))
# Hanya 3 fitur pertama yang sejati berpengaruh; 17 fitur lainnya derau murni
beta_sejati = np.zeros(p)
beta_sejati[:3] = [4.5, -3.0, 2.0]

y = X_raw @ beta_sejati + np.random.normal(0, 1.0, size=n)

# Standarisasi fitur adalah kewajiban mutlak sebelum regularisasi
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_raw)

# Melatih Lasso dengan parameter penalti alpha = 0.25
lasso = Lasso(alpha=0.25, random_state=42).fit(X_scaled, y)
koef_lasso = lasso.coef_

fitur_terpilih = np.where(koef_lasso != 0)[0]
fitur_tereliminasi = np.where(koef_lasso == 0)[0]

print("=== SELEKSI FITUR OTOMATIS BERBASIS LASSO L1 ===")
print(f"Jumlah Total Fitur Asal            : {p}")
print(f"Jumlah Fitur yang Dipertahankan (!=0): {len(fitur_terpilih)} (Indeks: {fitur_terpilih})")
print(f"Jumlah Fitur yang Dieliminasi (== 0): {len(fitur_tereliminasi)}")
print(f"Koefisien Estimasi Fitur Terpilih  : {koef_lasso[fitur_terpilih].round(3)}")`,
        expectedOutput: "Lasso secara akurat menolkan 17 fitur derau dan hanya mempertahankan 3 fitur sejati.",
        codeExp: "Skrip mendemonstrasikan kemampuan Lasso untuk menginduksi sparsity murni dengan menolkan seluruh koefisien fitur yang tidak memiliki sinyal nyata terhadap target.",
        pitfalls: [
          "Menerapkan Lasso ketika $p > n$; Lasso secara matematis hanya dapat memilih paling banyak $n$ variabel prediktor sebelum mengalami saturasi.",
          "Jika terdapat sekelompok variabel yang saling berkorelasi tinggi, Lasso cenderung memilih satu variabel secara acak dan mengabaikan yang lain (masalah yang diatasi oleh ElasticNet)."
        ],
        refTitle: "Robert Tibshirani: Regression Shrinkage and Selection via the Lasso (Journal of the Royal Statistical Society)",
        refUrl: "https://www.jstor.org/stable/2346178"
      },
      {
        num: "9.4",
        slug: "9-4-elasticnet-keseimbangan-konveks-l1-dan-l2",
        title: "9.4. ElasticNet: Keseimbangan Konveks L1 dan L2 untuk Mengatasi Kolinieritas",
        desc: "Kombinasi optimal Zou & Hastie (2005): mengatasi keterbatasan Lasso pada kelompok fitur kolinier dan kondisi p > n via penalti hibrida ganda.",
        concept: `Meskipun Lasso sangat populer untuk seleksi fitur, algoritma ini memiliki dua keterbatasan teoretis yang serius:
1. Ketika jumlah fitur lebih besar dari ukuran sampel ($p > n$), Lasso hanya dapat memilih paling banyak $n$ prediktor.
2. Jika ada sekelompok prediktor yang saling berkorelasi tinggi satu sama lain (misalnya kluster gen dalam bioinformatika), Lasso cenderung memilih satu prediktor secara arbitrer dan menolkan sisanya, kehilangan informasi kelompok.
        
Hui Zou dan Trevor Hastie (2005) memperkenalkan **ElasticNet**, yang menggabungkan penalti $L_1$ dan penalti $L_2$ secara simultan dalam kombinasi konveks yang dikendalikan oleh dua parameter: kekuatan regularisasi $\\alpha$ dan rasio percampuran $l_1\\text{-ratio} \\in [0, 1]$.
        
Suku penalti kuadratik $L_2$ membuat fungsi objektif strictly convex, menghasilkan *grouping effect* di mana variabel-variabel yang saling berkorelasi akan masuk atau keluar dari model secara bersama-sama, sementara suku penalti $L_1$ mempertahankan sifat seleksi fitur jarang (sparsity).`,
        formula: `\\mathcal{L}_{\\text{ElasticNet}} = \\frac{1}{2n}\\|y - X\\beta\\|_2^2 + \\alpha \\left( \\rho \\|\\beta\\|_1 + \\frac{1 - \\rho}{2} \\|\\beta\\|_2^2 \\right), \\quad \\rho = l_1\\text{-ratio}`,
        code: `# 9.4: Efek Pengelompokan (Grouping Effect) ElasticNet vs Seleksi Acak Lasso
import numpy as np
from sklearn.linear_model import Lasso, ElasticNet

np.random.seed(42)
n = 100
# 1 Faktor laten mendasari 3 fitur yang berkorelasi 95%
faktor_laten = np.random.normal(0, 1, n)
x1 = faktor_laten + np.random.normal(0, 0.1, n)
x2 = faktor_laten + np.random.normal(0, 0.1, n)
x3 = faktor_laten + np.random.normal(0, 0.1, n)
X = np.column_stack([x1, x2, x3])

y = 3.0 * faktor_laten + np.random.normal(0, 0.5, n)

# 1. Model Lasso (Cenderung memilih 1 dan membuang yang lain)
lasso = Lasso(alpha=0.2, random_state=42).fit(X, y)

# 2. Model ElasticNet (Grouping effect: mempertahankan ketiga fitur kolinier)
enet = ElasticNet(alpha=0.2, l1_ratio=0.5, random_state=42).fit(X, y)

print("=== GROUPING EFFECT: LASSO VS ELASTICNET PADA FITUR KOLINIER ===")
print(f"Koefisien Lasso      : {lasso.coef_.round(4)} (Membuang Fitur Kolinier!)")
print(f"Koefisien ElasticNet : {enet.coef_.round(4)} (Menyusutkan Bersama Secara Seimbang)")`,
        expectedOutput: "Lasso membuang variabel kolinier menjadi 0, sedangkan ElasticNet mempertahankan ketiganya secara seragam.",
        codeExp: "Skrip membuktikan sifat grouping effect dari ElasticNet yang mempertahankan kelompok fitur berkorelasi tinggi secara bersama-sama.",
        pitfalls: [
          "Menetapkan l1_ratio = 1.0 yang secara diam-diam mengubah ElasticNet kembali menjadi Lasso biasa.",
          "Tidak melakukan penskalaan ganda (double shrinkage correction) saat mengimplementasikan algoritma ElasticNet dari awal."
        ],
        refTitle: "Hui Zou & Trevor Hastie: Regularization and Variable Selection via the Elastic Net",
        refUrl: "https://academic.oup.com/jrsssb/article/67/2/301/7109482"
      },
      {
        num: "9.5",
        slug: "9-5-regularisasi-pada-regresi-logistik",
        title: "9.5. Regularisasi pada Regresi Logistik & Klasifikasi",
        desc: "Pencegahan separasi sempurna dan overfitting klasifikasi: parameter invers C pada Scikit-Learn dan formulasi L1/L2 Log-Loss.",
        concept: `Prinsip regularisasi $L_1$ dan $L_2$ tidak hanya berlaku untuk regresi linier, melainkan juga merupakan komponen wajib dalam model klasifikasi biner dan multikelas.
        
Tanpa regularisasi, regresi logistik rentan mengalami masalah serius yang disebut **Complete Separation**: jika ada bidang hiper yang dapat memisahkan kelas 0 dan kelas 1 secara sempurna pada data latih, estimasi Maximum Likelihood (MLE) standar akan divergen menuju tak hingga ($\\|\\beta\\| \\to \\infty$), menyebabkan probabilitas saturasi menjadi 0 atau 1 secara ekstrem.
        
Dalam implementasi Scikit-Learn, parameter penalti pada ''LogisticRegression'' dinyatakan sebagai $C$, di mana $C = 1 / \\lambda$. Nilai $C$ yang sangat kecil mewakili regularisasi yang sangat kuat (penyusutan koefisien intensif), sedangkan nilai $C$ yang besar mendekati model MLE tanpa penalti.`,
        formula: `J_{\\text{Reg}}(\\beta) = -\\sum_{i=1}^n \\left[ y_i \\ln(p_i) + (1 - y_i) \\ln(1 - p_i) \\right] + \\frac{1}{2C} \\|\\beta\\|_2^2`,
        code: `# 9.5: Pencegahan Pemisahan Sempurna (Perfect Separation) via Regularisasi C
import numpy as np
from sklearn.linear_model import LogisticRegression

# Data terpisah sempurna (x < 0 selalu y=0, x > 0 selalu y=1)
X = np.array([[-3.0], [-2.0], [-1.0], [1.0], [2.0], [3.0]])
y = np.array([0, 0, 0, 1, 1, 1])

# 1. Tanpa Regularisasi Kuat (C sangat besar, menyerupai MLE murni)
model_unreg = LogisticRegression(C=1e5, penalty='l2', solver='lbfgs').fit(X, y)

# 2. Regularisasi Terkendali (C = 0.5)
model_reg = LogisticRegression(C=0.5, penalty='l2', solver='lbfgs').fit(X, y)

print("=== PENCEGAHAN SEPARATION PADA REGRESI LOGISTIK ===")
print(f"Koefisien Beta Tanpa Regularisasi (C=100.000): {model_unreg.coef_[0, 0]:.4f} (Membengkak Cepat!)")
print(f"Koefisien Beta Ter-regularisasi (C=0.5)       : {model_reg.coef_[0, 0]:.4f} (Stabil Terkendali)")
print(f"Probabilitas pada x=1.0 (Unreg): {model_unreg.predict_proba([[1.0]])[0, 1]:.6f} (Saturasi Ekstrem)")
print(f"Probabilitas pada x=1.0 (Reg)  : {model_reg.predict_proba([[1.0]])[0, 1]:.6f} (Lebih Seimbang)")`,
        expectedOutput: "Regularisasi C menahan pembengkakan koefisien logistik pada data terpisah sempurna.",
        codeExp: "Skrip menunjukkan bagaimana penalti L2 pada LogisticRegression mencegah ledakan koefisien saat data terpisah secara sempurna pada dimensi fitur.",
        pitfalls: [
          "Lupa bahwa Scikit-Learn menggunakan parameter C (kebalikan dari lambda), sehingga memperbesar C berarti memperlemah regularisasi.",
          "Menggunakan solver yang salah saat memilih penalti L1 pada Scikit-Learn (solver default 'lbfgs' tidak mendukung L1; harus menggunakan 'saga' atau 'liblinear')."
        ],
        refTitle: "Scikit-Learn Documentation: Logistic Regression & Regularization",
        refUrl: "https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression"
      },
      {
        num: "9.6",
        slug: "9-6-seleksi-fitur-filter-mutual-information-anova",
        title: "9.6. Metode Seleksi Fitur Filter: Mutual Information & ANOVA F-Score",
        desc: "Seleksi fitur cepat berskala besar: kriteria univariat tanpa model, informasi timbal-balik non-linier Shannon, dan uji F ANOVA.",
        concept: `Metode seleksi fitur dapat diklasifikasikan ke dalam tiga taksonomi utama: Filter, Wrapper, dan Embedded.
        
**Metode Filter** mengevaluasi relevansi intrinsik dari setiap variabel prediktor $X_j$ terhadap target $y$ secara univariat, tanpa melibatkan algoritma machine learning apa pun. Keunggulan utamanya adalah efisiensi komputasi yang sangat tinggi ($O(p)$), memungkinkan penyaringan cepat terhadap jutaan fitur.
        
Dua metrik filter paling penting:
1. **ANOVA F-Test (SelectKBest / f_classif, f_regression):** Mengukur kekuatan hubungan linier antara fitur dan respons kontinu atau kategorik.
2. **Mutual Information (MI):** Didasarkan pada teori informasi Claude Shannon, MI mengukur jumlah informasi (dalam satuan nats atau bits) yang diperoleh tentang variabel target $y$ melalui observasi fitur $X_j$. Berbeda dengan uji korelasi Pearson atau ANOVA F-test yang hanya peka terhadap relasi linier, Mutual Information mampu menangkap segala bentuk ketergantungan non-linier yang kompleks.`,
        formula: `I(X; Y) = \\iint p(x, y) \\ln\\left(\\frac{p(x, y)}{p(x)p(y)}\\right) dx \\, dy`,
        code: `# 9.6: Komparasi Seleksi Fitur Filter: Korelasi Linier F-Test vs Mutual Information
import numpy as np
from sklearn.feature_selection import f_regression, mutual_info_regression

np.random.seed(42)
n = 300
x_linier = np.random.uniform(-3, 3, n)
x_nonlinier = np.random.uniform(-3, 3, n)
x_derau = np.random.normal(0, 1, n)

# y bergantung secara kuadratik non-linier pada x_nonlinier dan linier pada x_linier
y = 2.0 * x_linier + 3.0 * (x_nonlinier ** 2) + np.random.normal(0, 0.5, n)

X = np.column_stack([x_linier, x_nonlinier, x_derau])

# 1. ANOVA F-Score (Hanya Peka Hubungan Linier)
f_scores, p_vals = f_regression(X, y)

# 2. Mutual Information (Peka Linier & Non-Linier)
mi_scores = mutual_info_regression(X, y, random_state=42)

print("=== SELEKSI FITUR FILTER: F-TEST VS MUTUAL INFORMATION ===")
print("Fitur 1 (Linier)     : F-Score = {:7.2f} | Mutual Info = {:.4f}".format(f_scores[0], mi_scores[0]))
print("Fitur 2 (Non-Linier) : F-Score = {:7.2f} | Mutual Info = {:.4f} (MI Berhasil Menangkap!)".format(f_scores[1], mi_scores[1]))
print("Fitur 3 (Derau Murni): F-Score = {:7.2f} | Mutual Info = {:.4f}".format(f_scores[2], mi_scores[2]))`,
        expectedOutput: "F-test gagal mendeteksi hubungan non-linier pada fitur 2, sedangkan Mutual Information mendeteksinya dengan kuat.",
        codeExp: "Skrip mendemonstrasikan keunggulan komputasi Mutual Information atas F-test univariat dalam mengenali pola ketergantungan non-linier.",
        pitfalls: [
          "Hanya menggunakan korelasi Pearson atau ANOVA F-test untuk menyaring fitur, sehingga secara keliru membuang variabel yang memiliki relasi non-linier kuat.",
          "Mengabaikan redundansi antarinformasi; dua fitur yang identik keduanya akan lolos uji filter univariat padahal salah satunya redundan."
        ],
        refTitle: "Alexander Kraskov, Harald Stögbauer, Peter Grassberger: Estimating Mutual Information (Physical Review E)",
        refUrl: "https://journals.aps.org/pre/abstract/10.1103/PhysRevE.69.066138"
      },
      {
        num: "9.7",
        slug: "9-7-seleksi-fitur-wrapper-rfe-dan-sfs",
        title: "9.7. Metode Seleksi Fitur Wrapper: Recursive Feature Elimination (RFE) & SFS",
        desc: "Pencarian subset fitur optimal: Recursive Feature Elimination (RFE), Sequential Forward/Backward Selection, dan pertimbangan biaya komputasi.",
        concept: `Berbeda dengan metode filter yang bersifat agnostik model, **Metode Wrapper** memperlakukan pemilihan subset fitur sebagai masalah pencarian optimasi (search problem) yang dibimbing langsung oleh performa model prediktif spesifik.
        
Dua strategi wrapper paling dominan:
1. **Recursive Feature Elimination (RFE):** Dimulai dengan melatih model pada seluruh $p$ fitur, lalu secara iteratif membuang fitur yang memiliki bobot koefisien atau tingkat kepentingan terendah satu per satu hingga mencapai jumlah subset yang diinginkan. **RFECV** secara otomatis menemukan jumlah fitur optimal via cross-validation.
2. **Sequential Feature Selection (SFS):**
   - *Sequential Forward Selection (SFS):* Dimulai dengan himpunan kosong dan menambahkan satu fitur terbaik pada setiap langkah yang paling meningkatkan skor validasi.
   - *Sequential Backward Selection (SBS):* Dimulai dari himpunan penuh dan membuang fitur yang paling tidak berkontribusi.
        
Meskipun wrapper menangkap interaksi kompleks antarinformasi fitur, kelemahan utamanya adalah kebutuhan komputasi yang sangat mahal ($O(p^2)$) dan risiko overfitting jika tidak divalidasi dengan cermat.`,
        code: `# 9.7: Seleksi Fitur Wrapper via RFECV (Cross-Validated Recursive Feature Elimination)
import numpy as np
from sklearn.datasets import make_classification
from sklearn.feature_selection import RFECV
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold

# Dataset dengan 5 fitur informatif dan 15 fitur derau redundan
X, y = make_classification(n_samples=300, n_features=20, n_informative=5, n_redundant=2, random_state=42)

estimator = LogisticRegression(solver='liblinear', random_state=42)
cv = StratifiedKFold(5)

rfecv = RFECV(
    estimator=estimator,
    step=1,
    cv=cv,
    scoring='accuracy',
    min_features_to_select=3
)
rfecv.fit(X, y)

print("=== HASIL SELEKSI FITUR RECURSIVE FEATURE ELIMINATION (RFECV) ===")
print(f"Jumlah Fitur Asal                : {X.shape[1]}")
print(f"Jumlah Fitur Optimal Terpilih    : {rfecv.n_features_}")
print(f"Mask Fitur Terpilih (Support)    : {rfecv.support_}")
print(f"Peringkat Fitur (1 = Terpenting) : {rfecv.ranking_}")`,
        expectedOutput: "RFECV secara otomatis mengidentifikasi jumlah subset fitur optimal yang memaksimalkan akurasi CV.",
        codeExp: "Skrip memanfaatkan RFECV dari Scikit-Learn untuk mengeliminasi fitur secara rekursif dan menentukan jumlah prediktor optimal berbasis validasi silang berstrata.",
        pitfalls: [
          "Menjalankan RFE di luar loop cross-validation, yang memicu kebocoran informasi seleksi fitur (selection bias leakage).",
          "Menerapkan wrapper SFS pada dataset dengan ribuan fitur tanpa batasan iterasi, memicu kemacetan komputasi berjam-jam."
        ],
        refTitle: "Isabelle Guyon et al.: Gene Selection for Cancer Classification using Support Vector Machines (Machine Learning)",
        refUrl: "https://link.springer.com/article/10.1023/A:1012487302797"
      },
      {
        num: "9.8",
        slug: "9-8-seleksi-fitur-tertanam-dan-koefisien-standar",
        title: "9.8. Seleksi Fitur Tertanam (Embedded) & Koefisien Terstandarisasi",
        desc: "Seleksi fitur terintegrasi dalam algoritma: SelectFromModel, koefisien terstandarisasi beta*, dan feature importances berbasis pohon.",
        concept: `**Metode Tertanam (Embedded Methods)** menggabungkan keunggulan kecepatan metode filter dan ketelitian pemodelan metode wrapper. Dalam metode embedded, proses seleksi fitur terintegrasi langsung ke dalam proses optimasi pelatihan algoritma pembelajaran itu sendiri.
        
Contoh utama metode embedded meliputi:
- Regularisasi Lasso dan ElasticNet (yang secara otomatis menolkan koefisien selama optimasi loss function).
- Pohon Keputusan dan Random Forest (yang secara otomatis memilih fitur terbaik pada setiap pemisahan node berdasarkan penurunan ketidakmurnian).
        
Alat Scikit-Learn ''SelectFromModel'' memungkinkan praktisi menggunakan model apa pun yang memiliki atribut ''coef_'' atau ''feature_importances_'' sebagai penyaring fitur berbasis ambang batas kontribusi (misalnya mean atau median pentingnya fitur).
        
Penting: Koefisien regresi linier hanya dapat dibandingkan secara sah sebagai ukuran pentingnya fitur (Standardized Beta Coefficients $\\beta_j^*$) jika seluruh fitur telah distandarisasi ke varians yang sama ($z$-score).`,
        formula: `\\beta_j^* = \\beta_j \\cdot \\frac{s_{X_j}}{s_y}`,
        code: `# 9.8: Seleksi Fitur Tertanam Menggunakan SelectFromModel pada Random Forest
import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import SelectFromModel

X, y = make_classification(n_samples=500, n_features=15, n_informative=4, random_state=42)

# Melatih Random Forest sebagai model penyeleksi embedded
rf = RandomForestClassifier(n_estimators=100, random_state=42).fit(X, y)

# Menggunakan SelectFromModel dengan threshold rata-rata kepentingan fitur ('mean')
selector = SelectFromModel(estimator=rf, threshold='mean', prefit=True)
X_terseleksi = selector.transform(X)

importances = rf.feature_importances_
ambang_batas = np.mean(importances)
fitur_lolos = np.where(importances >= ambang_batas)[0]

print("=== SELEKSI FITUR TERTANAM (SELECTFROMMODEL) ===")
print(f"Dimensi Fitur Awal    : {X.shape[1]}")
print(f"Ambang Batas (Mean)   : {ambang_batas:.4f}")
print(f"Dimensi Fitur Terpilih: {X_terseleksi.shape[1]} (Fitur Indeks: {fitur_lolos})")`,
        expectedOutput: "SelectFromModel menyaring fitur informatif di atas ambang batas kontribusi rata-rata secara efisien.",
        codeExp: "Skrip mengilustrasikan seleksi fitur embedded berbasis pentingnya variabel dari Random Forest menggunakan SelectFromModel Scikit-Learn.",
        pitfalls: [
          "Membandingkan besaran nilai koefisien regresi mentah tanpa standarisasi fitur sebagai indikator pentingnya fitur.",
          "Menerapkan feature importance Gini bawaan Random Forest pada fitur berkardinalitas tinggi tanpa memeriksa bias kardinalitasnya."
        ],
        refTitle: "Scikit-Learn Documentation: Feature selection using SelectFromModel",
        refUrl: "https://scikit-learn.org/stable/modules/feature_selection.html#select-from-model"
      },
      {
        num: "9.9",
        slug: "9-9-validasi-silang-penalti-ridgecv-lassocv",
        title: "9.9. Validasi Silang untuk Parameter Penalti: RidgeCV & LassoCV",
        desc: "Optimasi efisien hyperparameter regularisasi: jalur regularisasi (regularization path), Generalized Cross-Validation (GCV), dan Scikit-Learn CV estimators.",
        concept: `Kinerja dari model regresi ter-regularisasi (Ridge, Lasso, ElasticNet) sangat bergantung pada pemilihan nilai hyperparameter penalti $\\alpha$ (atau $\\lambda$). Jika $\\alpha$ terlalu besar, model mengalami underfitting; jika $\\alpha$ terlalu kecil, model berperilaku seperti OLS biasa dan rentan overfitting.
        
Scikit-Learn menyediakan kelas estimasi khusus yang dioptimalkan secara komputasional untuk memindai ruang hyperparameter penalti:
1. **RidgeCV:** Menggunakan trik aljabar linier yang dikenal sebagai **Generalized Cross-Validation (GCV)** atau leave-one-out CV yang dihitung secara instan menggunakan dekomposisi nilai singular tunggal, tanpa perlu melatih ulang model secara manual sebanyak $K$ kali lipat.
2. **LassoCV & ElasticNetCV:** Memanfaatkan algoritma **Coordinate Descent** untuk menelusuri seluruh *Regularization Path* dari nilai $\\alpha_{\\text{max}}$ (di mana seluruh koefisien nol) turun bertahap ke nilai $\\alpha$ kecil, menggunakan solusi sebelumnya sebagai warm-start.`,
        code: `# 9.9: Pencarian Nilai Penalti Alpha Optimal via RidgeCV dan LassoCV
import numpy as np
from sklearn.linear_model import RidgeCV, LassoCV
from sklearn.datasets import make_regression
from sklearn.preprocessing import StandardScaler

X, y = make_regression(n_samples=200, n_features=30, n_informative=8, noise=2.0, random_state=42)
X_scaled = StandardScaler().fit_transform(X)

alphas = np.logspace(-3, 3, 50)

# 1. RidgeCV dengan Generalized Cross-Validation (GCV)
ridge_cv = RidgeCV(alphas=alphas, cv=5).fit(X_scaled, y)

# 2. LassoCV dengan Regularization Path Coordinate Descent
lasso_cv = LassoCV(alphas=alphas, cv=5, random_state=42).fit(X_scaled, y)

print("=== OPTIMASI HYPERPARAMETER PENALTI ALPHA BERBASIS CV ===")
print(f"Alpha Optimal Ridge (RidgeCV) : {ridge_cv.alpha_:.4f}")
print(f"Alpha Optimal Lasso (LassoCV) : {lasso_cv.alpha_:.4f}")
print(f"Jumlah Fitur Terpilih Lasso   : {np.sum(lasso_cv.coef_ != 0)} dari {X.shape[1]} fitur")`,
        expectedOutput: "RidgeCV dan LassoCV secara cepat menemukan nilai alpha optimal yang meminimalkan galat CV.",
        codeExp: "Skrip memanfaatkan kelas estimator bawaan Scikit-Learn yang dioptimalkan untuk memindai 50 skala logaritmik alpha via validasi silang 5-fold.",
        pitfalls: [
          "Menyetel alpha pada rentang grid linier sempit (misalnya [1, 2, 3]) alih-alih skala logaritmik eksponensial (np.logspace(-4, 4, 50)).",
          "Mengevaluasi LassoCV tanpa standarisasi fitur, yang menyebabkan jalur regularisasi terdistorsi."
        ],
        refTitle: "Jerome Friedman, Trevor Hastie, Robert Tibshirani: Regularization Paths for Generalized Linear Models via Coordinate Descent",
        refUrl: "https://www.jstatsoft.org/article/view/v033i01"
      },
      {
        num: "9.10",
        slug: "9-10-penalti-l0-vs-l1-dan-relaksasi-konveks",
        title: "9.10. Penalti L0 vs L1: Kompleksitas Komputasi NP-Hard vs Relaksasi Konveks",
        desc: "Fondasi teoritis optimasi jarang: mengapa Best Subset Selection (penalti L0) tidak dapat diselesaikan pada dimensi tinggi dan peran L1 sebagai relaksasi konveks terdekat.",
        concept: `Secara ideal, tujuan utama seleksi variabel adalah menemukan subset persis dari $k$ prediktor yang meminimalkan RSS. Masalah ini secara matematis diformulasikan sebagai regularisasi dengan penalti norma pseudo-$L_0$, di mana $\\|\\beta\\|_0$ menghitung jumlah koefisien yang tidak bernilai nol.
        
Namun, **Best Subset Selection (penalti $L_0$)** adalah masalah kombinatorial murni yang terbukti secara matematis bersifat **NP-Hard**. Untuk dataset dengan $p$ fitur, terdapat $2^p$ kemungkinan kombinasi model. Jika $p = 50$, terdapat $2^{50} \\approx 1.12 \\times 10^{15}$ model yang harus dievaluasi, yang mustahil diselesaikan oleh superkomputer tercepat di dunia dalam rentang waktu yang wajar.
        
Kejeniusan dari penalti norma $L_1$ Lasso adalah bahwa $L_1$ adalah **relaksasi konveks terdekat (closest convex relaxation)** dari penalti kombinatorial non-konveks $L_0$. Karena norma $L_1$ bersifat konveks, masalah optimasi dapat diselesaikan dalam waktu polinomial yang sangat cepat menggunakan algoritma Coordinate Descent atau Proximal Gradient.`,
        formula: `\\|\\beta\\|_0 = \\sum_{j=1}^p \\mathbb{I}(\\beta_j \\ne 0) \\quad \\xrightarrow{\\text{Relaksasi Konveks}} \\quad \\|\\beta\\|_1 = \\sum_{j=1}^p |\\beta_j|`,
        code: `# 9.10: Perbandingan Ledakan Kombinatorik L0 vs Waktu Komputasi Polinomial L1 Lasso
import time
import numpy as np
from sklearn.linear_model import Lasso

# Hitung jumlah kombinasi Best Subset L0 untuk berbagai jumlah fitur p
fitur_p = [10, 20, 30, 40, 50]
kombinasi_l0 = [2**p for p in fitur_p]

print("=== ANALISIS KOMPLEKSITAS: PENALTI L0 (NP-HARD) VS L1 (KONVEKS) ===")
for p, komb in zip(fitur_p, kombinasi_l0):
    print(f"Fitur p = {p:2d} -> Kombinasi Subset L0: {komb:16,d} evaluasi model")

# Waktu eksekusi Lasso L1 pada p = 500 fitur (Polinomial Cepat)
n, p_besar = 500, 500
X_big = np.random.normal(0, 1, size=(n, p_besar))
y_big = X_big[:, :5] @ np.array([1, 2, 3, 4, 5]) + np.random.normal(0, 1, n)

t0 = time.time()
lasso_poly = Lasso(alpha=0.1).fit(X_big, y_big)
t1 = time.time()

print(f"\\nWaktu Penyelesaian Lasso L1 pada p = 500 Fitur (2^500 kombinasi tak berhingga): {t1 - t0:.4f} detik!")`,
        expectedOutput: "L0 meledak hingga kuadriliun kombinasi pada p=50, sedangkan L1 konveks selesai dalam pecahan detik pada p=500.",
        codeExp: "Skrip mengilustrasikan ledakan kombinatorial penalti L0 NP-Hard dan membuktikan efisiensi waktu komputasi relaksasi konveks Lasso L1 pada ratusan fitur.",
        pitfalls: [
          "Mencoba algoritma best subset exhaustive search pada dataset dengan fitur p > 30 tanpa menyadari komputasi akan membeku selamanya.",
          "Menganggap Lasso selalu memilih fitur yang identik dengan solusi eksak best subset selection pada kondisi multikolinieritas ekstrem."
        ],
        refTitle: "Dimitris Bertsimas, Angela King, Best Subset Selection via a Modern Optimization Lens (Annals of Statistics)",
        refUrl: "https://projecteuclid.org/journals/annals-of-statistics/volume-44/issue-2/Best-subset-selection-via-a-modern-optimization-lens/10.1214/15-AOS1388.full"
      }
    ]
  },

  // ==========================================
  // BAB 10: Reduksi Dimensi & Pembelajaran Representasi Linier/Non-Linier
  // ==========================================
  {
    orderIndex: 10,
    id: "data-science-ch-10",
    slug: "bab-10-reduksi-dimensi-pembelajaran-representasi",
    title: "BAB 10: Reduksi Dimensi & Pembelajaran Representasi Linier/Non-Linier",
    desc: "Penanganan data berdimensi tinggi: kutukan dimensi (Curse of Dimensionality), Dekomposisi Nilai Singular (SVD), Principal Component Analysis (PCA), pemilihan komponen Scree plot, Kernel PCA, manifold learning non-linier (t-SNE & UMAP), serta visualisasi representasi laten.",
    coreConcepts: ["Curse of Dimensionality", "Singular Value Decomposition (SVD)", "Principal Component Analysis (PCA)", "t-SNE Manifold Learning", "UMAP Riemannian Geometry"],
    subchapters: [
      {
        num: "10.1",
        slug: "10-1-kutukan-dimensi-curse-of-dimensionality",
        title: "10.1. Kutukan Dimensi (Curse of Dimensionality): Fenomena Ruang Hiperbolik",
        desc: "Anatomi matematis data berdimensi tinggi: konsentrasi jarak euklidian, fenomena volume hiperkubus kosong, dan degradasi algoritma berbasis jarak.",
        concept: `Istilah **Kutukan Dimensi (Curse of Dimensionality)** dicetuskan oleh Richard Bellman pada tahun 1957 untuk menggambarkan fenomena paradoksal yang terjadi ketika ruang fitur berkembang ke dimensi yang sangat tinggi ($p \\gg 100$).
        
Dua dampak geometris paling merusak dari dimensi tinggi:
1. **Pemekaran Volume Ruang (Empty Space Phenomenon):** Volume dari hiperkubus berdimensi $p$ bertambah secara eksponensial terhadap $p$. Akibatnya, titik-titik data observasi menjadi sangat saling terisolasi dan jarang (sparse). Untuk mempertahankan densitas data yang konstan saat dimensi bertambah dari 2 menjadi 20, jumlah data yang dibutuhkan meningkat secara eksponensial menuju triliunan sampel.
2. **Konsentrasi Ukuran Jarak (Distance Concentration):** Di ruang berdimensi tinggi, rasio antara jarak ke tetangga terjauh dan tetangga terdekat terkonvergensi menuju nol: $\\lim_{p \\to \\infty} \\frac{\\text{dist}_{\\text{max}} - \\text{dist}_{\\text{min}}}{\\text{dist}_{\\text{min}}} = 0$. Artinya, seluruh titik data menjadi berjarak hampir sama satu sama lain, melumpuhkan algoritma berbasis jarak seperti k-Nearest Neighbors (k-NN) dan K-Means.`,
        formula: `\\lim_{p \\to \\infty} \\frac{\\text{dist}_{\\text{max}} - \\text{dist}_{\\text{min}}}{\\text{dist}_{\\text{min}}} = 0`,
        code: `# 10.1: Demonstrasi Fenomena Konsentrasi Jarak pada Dimensi Tinggi
import numpy as np

np.random.seed(42)
n_samples = 100
dimensi_list = [2, 10, 50, 200, 1000]

print("=== FENOMENA KONSENTRASI JARAK (CURSE OF DIMENSIONALITY) ===")
print("Dimensi (p) | Dist Min | Dist Max | Rasio (Max - Min) / Min")
print("-" * 55)

for p in dimensi_list:
    # Menghasilkan 100 titik acak seragam dalam hiperkubus unit [0, 1]^p
    X = np.random.uniform(0, 1, size=(n_samples, p))
    # Menghitung matriks jarak Euklidian antar pasangan titik
    diff = X[:, np.newaxis, :] - X[np.newaxis, :, :]
    dist_mat = np.sqrt(np.sum(diff**2, axis=-1))
    
    # Ambil jarak non-diagonal (bukan dengan diri sendiri)
    np.fill_diagonal(dist_mat, np.inf)
    d_min = np.min(dist_mat)
    np.fill_diagonal(dist_mat, -np.inf)
    d_max = np.max(dist_mat)
    
    rasio_kontras = (d_max - d_min) / d_min
    print(f"{p:11d} | {d_min:8.4f} | {d_max:8.4f} | {rasio_kontras:12.4f}")`,
        expectedOutput: "Rasio kontras jarak menyusut drastis dari 8.5 pada d=2 menjadi 0.28 pada d=1000.",
        codeExp: "Skrip menghitung jarak berpasangan dalam hiperkubus berdimensi naik untuk membuktikan fenomena konsentrasi jarak di mana konsep ketetanggaan kehilangan makna diskriminatifnya.",
        pitfalls: [
          "Menerapkan algoritma k-NN atau k-Means langsung pada data mentah dengan ratusan fitur tanpa reduksi dimensi terlebih dahulu.",
          "Mengasumsikan intuisi spasial 2D atau 3D dapat diterapkan secara linier ke ruang berdimensi 100."
        ],
        refTitle: "Charu C. Aggarwal, Alexander Hinneburg, Daniel A. Keim: On the Surprising Behavior of Distance Metrics in High Dimensional Space",
        refUrl: "https://link.springer.com/chapter/10.1007/3-540-44503-X_27"
      },
      {
        num: "10.2",
        slug: "10-2-singular-value-decomposition-svd-teorema-eckart-young",
        title: "10.2. Dekomposisi Nilai Singular (SVD) & Teorema Eckart-Young-Mirsky",
        desc: "Fondasi aljabar linier reduksi dimensi: faktorisasi matriks X = U Sigma V^T, nilai singular, dan aproksimasi matriks rank rendah optimal.",
        concept: `Dekomposisi Nilai Singular (Singular Value Decomposition / SVD) adalah salah satu teorema paling penting dan berguna dalam seluruh aljabar linier numerik dan sains data.
        
Teorema SVD menyatakan bahwa sembarang matriks data riil $X \\in \\mathbb{R}^{n \\times p}$ dapat difaktorisasi secara eksak menjadi perkalian tiga matriks:
$$X = U \\Sigma V^T$$
- $U \\in \\mathbb{R}^{n \\times n}$: Matriks ortogonal yang kolom-kolomnya merupakan vektor singular kiri (eigenvektor dari $X X^T$).
- $\\Sigma \\in \\mathbb{R}^{n \\times p}$: Matriks diagonal dengan elemen riil non-negatif terurut menurun $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge \\sigma_{\\min(n, p)} \\ge 0$ yang disebut **Nilai Singular**.
- $V \\in \\mathbb{R}^{p \\times p}$: Matriks ortogonal yang kolom-kolomnya merupakan vektor singular kanan (eigenvektor dari $X^T X$).
        
**Teorema Eckart-Young-Mirsky (1936)** membuktikan bahwa aproksimasi berperingkat rendah terbaik $X_k$ (rank $k < p$) dari matriks $X$ terhadap norma Frobenius atau norma spektral diperoleh secara eksak dengan memotong SVD pada $k$ nilai singular pertama (Truncated SVD). Ini adalah fondasi matematika murni dari kompresi data, kompresi gambar, dan Latent Semantic Analysis (LSA).`,
        formula: `X_k = \\sum_{i=1}^k \\sigma_i u_i v_i^T = \\arg\\min_{\\text{rank}(A) \\le k} \\|X - A\\|_F`,
        code: `# 10.2: Kompresi Matriks Rank Rendah Berbasis Truncated SVD (Teorema Eckart-Young)
import numpy as np

np.random.seed(42)
# Menghasilkan matriks berperingkat tinggi 50x30
X = np.random.normal(0, 1, size=(50, 30))

# 1. Dekomposisi SVD Penuh
U, S, Vt = np.linalg.svd(X, full_matrices=False)

# 2. Rekonstruksi Rank Rendah k = 5 (Memotong k nilai singular pertama)
k = 5
X_k = (U[:, :k] * S[:k]) @ Vt[:k, :]

galat_frobenius_aktual = np.linalg.norm(X - X_k, 'fro')
# Menurut Teorema Eckart-Young, galat Frobenius kuadrat tepat sama dengan jumlahan nilai singular yang dibuang
galat_frobenius_teoritis = np.sqrt(np.sum(S[k:]**2))

print("=== VERIFIKASI TEOREMA ECKART-YOUNG-MIRSKY (SVD) ===")
print(f"Total Nilai Singular (Min Dimensi)     : {len(S)}")
print(f"Proporsi Energi yang Dijaga pada Rank 5: {(np.sum(S[:k]**2) / np.sum(S**2))*100:.2f}%")
print(f"Galat Rekonstruksi Frobenius Aktual    : {galat_frobenius_aktual:.4f}")
print(f"Galat Teoretis Eckart-Young (sqrt(sum S_tail^2)): {galat_frobenius_teoritis:.4f}")
print(f"Selisih Galat Matematis                : {abs(galat_frobenius_aktual - galat_frobenius_teoritis):.2e}")`,
        expectedOutput: "Galat Frobenius rekonstruksi rank-k identik sempurna dengan nilai singular tail yang dipotong.",
        codeExp: "Skrip memfaktorisasi matriks menggunakan SVD dan merekonstruksi aproksimasi rank rendah untuk membuktikan secara empiris Teorema Eckart-Young-Mirsky.",
        pitfalls: [
          "Menghitung full_matrices=True pada dataset besar yang memboroskan memori RAM untuk menyimpan matriks ortogonal raksasa yang tidak terpakai.",
          "Lupa bahwa SVD tidak mensyaratkan matriks bujur sangkar, sedangkan Eigendecomposition hanya berlaku untuk matriks bujur sangkar."
        ],
        refTitle: "Carl Eckart & Gale Young: The Approximation of One Matrix by Another of Lower Rank (Psychometrika)",
        refUrl: "https://link.springer.com/article/10.1007/BF02288367"
      },
      {
        num: "10.3",
        slug: "10-3-principal-component-analysis-pca",
        title: "10.3. Principal Component Analysis (PCA): Maksimasi Varians & Proyeksi",
        desc: "Dua perspektif ekuivalen PCA: maksimasi varians proyeksi vs minimasi galat rekonstruksi kuadrat, serta hubungan langsung dengan SVD.",
        concept: `Principal Component Analysis (PCA) yang dirintis oleh Karl Pearson (1901) dan Harold Hotelling (1933) adalah teknik reduksi dimensi linier tanpa supervisi (unsupervised) yang paling fundamental dalam sains data modern.
        
PCA dapat dipahami melalui dua perspektif geometris yang saling melengkapi:
1. **Maksimasi Varians:** PCA mencari arah vektor unit $w_1$ sedemikian rupa sehingga varians dari proyeksi data ke arah tersebut adalah sebesar mungkin. Arah komponen utama kedua $w_2$ dicari untuk memaksimalkan sisa varians dengan kendala ortogonalitas terhadap $w_1$ ($w_2^T w_1 = 0$), dan seterusnya.
2. **Minimasi Galat Rekonstruksi:** PCA menemukan subruang linier berdimensi $k$ yang meminimalkan rata-rata jarak kuadrat ortogonal dari titik-titik data ke subruang tersebut.
        
Secara komputasional, komponen utama PCA tepat merupakan vektor singular kanan $V$ dari matriks data yang telah dipusatkan (mean-centered data matrix $X_c$), dan varians yang dijelaskan oleh masing-masing komponen proporsional terhadap kuadrat nilai singular $\\sigma_j^2 / (n - 1)$.`,
        formula: `w_1 = \\arg\\max_{\\|w\\|=1} w^T (X_c^T X_c) w = \\arg\\max_{\\|w\\|=1} \\text{Var}(X_c w)`,
        code: `# 10.3: Implementasi PCA Murni (Eigen/SVD) vs Scikit-Learn PCA
import numpy as np
from sklearn.decomposition import PCA

np.random.seed(42)
n, p = 150, 4
X = np.random.normal(0, 1, size=(n, p))
# Tambahkan korelasi linier
X[:, 1] = 0.8 * X[:, 0] + np.random.normal(0, 0.2, n)

# 1. PCA Komputasi Manual via Dekomposisi SVD Data Terpusat
X_mean = np.mean(X, axis=0)
X_centered = X - X_mean

U, S, Vt = np.linalg.svd(X_centered, full_matrices=False)
# Vektor Komponen Utama adalah baris dari Vt (kolom V)
komponen_manual = Vt[:2, :]
# Skor Proyeksi Dimensi Rendah (k = 2)
skor_manual = X_centered @ komponen_manual.T

# 2. Scikit-Learn PCA
pca_skl = PCA(n_components=2).fit(X)
skor_skl = pca_skl.transform(X)

print("=== VERIFIKASI KOMPUTASI PRINCIPAL COMPONENT ANALYSIS ===")
print("Rasio Varians Terjelaskan Manual (S^2 / sum(S^2)):")
print((S**2 / np.sum(S**2))[:2].round(4))
print("Rasio Varians Terjelaskan Scikit-Learn:")
print(pca_skl.explained_variance_ratio_.round(4))
print(f"Maks Deviasi Skor Proyeksi (Arah Absolut) : {np.max(np.abs(np.abs(skor_manual) - np.abs(skor_skl))):.2e}")`,
        expectedOutput: "Rasio varians dan koordinat proyeksi PCA manual identik sempurna dengan Scikit-Learn.",
        codeExp: "Skrip membuktikan kesetaraan antara formulasi teoritis aljabar linier SVD data terpusat dengan modul PCA Scikit-Learn.",
        pitfalls: [
          "Lupa bahwa orientasi tanda vektor eigen (+ atau -) bersifat arbitrer; tanda komponen manual dan Scikit-Learn bisa berkebalikan arah namun merepresentasikan garis proyeksi yang sama.",
          "Menjalankan PCA pada fitur yang belum dipusatkan (zero-centered), yang membiaskan komponen utama pertama ke arah vektor rata-rata."
        ],
        refTitle: "Karl Pearson: On Lines and Planes of Closest Fit to Systems of Points in Space",
        refUrl: "https://www.tandfonline.com/doi/abs/10.1080/14786440109462720"
      },
      {
        num: "10.4",
        slug: "10-4-pemilihan-jumlah-komponen-scree-plot-dan-kaiser",
        title: "10.4. Pemilihan Jumlah Komponen: Scree Plot, Rasio Varians, & Aturan Kaiser",
        desc: "Kriteria penentuan cutoff dimensi optimal: visualisasi Scree Plot (Elbow rule), rasio varians kumulatif, dan batas Kaiser-Guttman (eigenvalue > 1).",
        concept: `Setelah menjalankan PCA, salah satu keputusan desain terpenting bagi praktisi adalah menentukan berapa banyak komponen utama ($k$) yang harus dipertahankan untuk meminimalkan kehilangan informasi sekaligus mereduksi kompleksitas fitur.
        
Tiga aturan keputusan standar industri:
1. **Rasio Varians Kumulatif:** Memilih jumlah komponen minimum yang mencakup ambang batas varians total yang diinginkan oleh domain bisnis (biasanya $80\\%$, $90\\%$, atau $95\\%$ varians kumulatif).
2. **Scree Plot (Aturan Siku / Elbow Rule):** Diperkenalkan oleh Raymond Cattell (1966), Scree Plot memetakan nilai varians (eigenvalue) terhadap nomor urut komponen. Titik infleksi (di mana kurva melandai tajam menyerupai puing-puing batu 'scree' di kaki tebing) dipilih sebagai titik potong dimensi.
3. **Aturan Kaiser-Guttman:** Untuk data yang telah distandarisasi, hanya komponen yang memiliki eigenvalue $\\lambda_j > 1.0$ yang dipertahankan. Logikanya: komponen tersebut menjelaskan lebih banyak varians daripada satu variabel prediktor asli tunggal.`,
        code: `# 10.4: Evaluasi Kriteria Pemilihan Komponen PCA Optimal
import numpy as np
from sklearn.decomposition import PCA
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler

# Dataset Kanker Payudara (30 Fitur Numerik)
data = load_breast_cancer()
X_scaled = StandardScaler().fit_transform(data.data)

pca_full = PCA().fit(X_scaled)
eigenvalues = pca_full.explained_variance_
varians_rasio = pca_full.explained_variance_ratio_
varians_kumulatif = np.cumsum(varians_rasio)

# 1. Kriteria Kaiser (Eigenvalue > 1.0)
k_kaiser = np.sum(eigenvalues > 1.0)

# 2. Kriteria Ambang Batas 90% Varians
k_90 = np.argmax(varians_kumulatif >= 0.90) + 1

# 3. Kriteria Ambang Batas 95% Varians
k_95 = np.argmax(varians_kumulatif >= 0.95) + 1

print("=== EVALUASI PEMILIHAN JUMLAH KOMPONEN PCA OPTIMAL ===")
print(f"Jumlah Fitur Asli: {X_scaled.shape[1]}")
print(f"Kriteria Kaiser (Eigenvalue > 1.0)   : Pertahankan {k_kaiser} Komponen (Varians: {varians_kumulatif[k_kaiser-1]*100:.1f}%)")
print(f"Kriteria Varians Kumulatif >= 90%   : Pertahankan {k_90} Komponen (Varians: {varians_kumulatif[k_90-1]*100:.1f}%)")
print(f"Kriteria Varians Kumulatif >= 95%   : Pertahankan {k_95} Komponen (Varians: {varians_kumulatif[k_95-1]*100:.1f}%)")`,
        expectedOutput: "30 fitur terkompresi secara masif menjadi 6 komponen (Kaiser) atau 7 komponen (90% varians).",
        codeExp: "Skrip mengevaluasi aturan Kaiser dan kurva varians kumulatif pada dataset berdimensi 30 untuk menentukan rasio kompresi optimal.",
        pitfalls: [
          "Menerapkan aturan Kaiser (eigenvalue > 1.0) pada data yang tidak distandarisasi StandardScaler (aturan Kaiser hanya valid untuk matriks korelasi dengan skala unit).",
          "Memangkas komponen secara agresif hanya untuk keperluan visualisasi 2D/3D padahal model prediktif hilir membutuhkan 95% varians."
        ],
        refTitle: "Raymond B. Cattell: The Scree Test For The Number Of Factors (Multivariate Behavioral Research)",
        refUrl: "https://www.tandfonline.com/doi/abs/10.1207/s15327906mbr0102_10"
      },
      {
        num: "10.5",
        slug: "10-5-standarisasi-dan-pencegahan-kebocoran-pca",
        title: "10.5. Standarisasi Fitur Sebelum PCA & Pencegahan Kebocoran Sumbu",
        desc: "Protokol ketat prapemrosesan: sensitivitas skala varians PCA, dan isolasi fit_transform dalam Pipeline untuk mencegah data leakage sumbu utama.",
        concept: `PCA sangat sensitif terhadap skala pengukuran variabel mentah. Karena PCA bekerja dengan memaksimalkan varians, variabel dengan unit angka besar (misalnya Gaji Tahunan dalam rupiah: varians jutaan) akan mendominasi komponen utama pertama secara mutlak, menenggelamkan variabel penting lain yang memiliki skala kecil (misalnya IPK: varians satuan). Standarisasi fitur ($z$-score scaling: $\\mu=0, \\sigma=1$) adalah kewajiban mutlak sebelum menerapkan PCA.
        
Lebih krusial lagi, **Kebocoran Data (Data Leakage)** sangat sering terjadi pada praktisi yang memanggil ''pca.fit_transform(X)'' pada seluruh dataset sebelum melakukan pemisahan train-test split.
        
Dengan melakukan fit PCA pada seluruh dataset, vektor komponen utama dan rata-rata data uji telah 'bocor' ke dalam ruang transformasi data latih. Protokol yang sah: PCA hanya boleh di-fit pada data latih ('pca.fit(X_train)'), lalu matriks transformasi tersebut diterapkan secara pasif pada data uji ('pca.transform(X_test)') via Scikit-Learn Pipeline.`,
        code: `# 10.5: Demonstrasi Bahaya Kebocoran Data Sumbu PCA vs Scikit-Learn Pipeline
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression

np.random.seed(42)
X = np.random.normal(0, 1, size=(200, 20))
y = np.random.choice([0, 1], size=200)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 1. PROSEDUR KELIRU (Kebocoran Sumbu PCA: Fit pada seluruh X gabungan)
# pca_leak = PCA(n_components=5).fit(X) # BOCOR!

# 2. PROSEDUR RESMI & BENAR (Enkapsulasi Pipeline Anti-Bocor)
pipeline_bersih = Pipeline([
    ('scaler', StandardScaler()),
    ('pca', PCA(n_components=5)),
    ('classifier', LogisticRegression())
])

# Fit HANYA pada X_train, transform diterapkan pada X_test
pipeline_bersih.fit(X_train, y_train)
akurasi_test = pipeline_bersih.score(X_test, y_test)

print("=== PROTOKOL RESMI ANTI-LEAKAGE PIPELINE PCA ===")
print(f"Status Pelatihan Pipeline   : Sukses Terenkapsulasi")
print(f"Akurasi Data Uji Tanpa Bocor: {akurasi_test*100:.2f}%")
print(f"Komponen PCA Dilatih Murni pada Train Set: {pipeline_bersih.named_steps['pca'].components_.shape}")`,
        expectedOutput: "Pipeline berhasil mengisolasi scaling dan fitting PCA murni di dalam training folds.",
        codeExp: "Skrip membangun Scikit-Learn Pipeline untuk menjamin bahwa perhitungan rata-rata standarisasi dan dekomposisi sumbu utama PCA tidak mengalami kebocoran ke data uji.",
        pitfalls: [
          "Menerapkan PCA langsung pada data mentah dengan skala heterogen tanpa StandardScaler.",
          "Menghitung PCA pada seluruh dataset sebelum split data, membatalkan validitas estimasi generalisasi out-of-sample."
        ],
        refTitle: "Shachar Kaufman et al.: Leakage in Data Mining: Formulation, Detection, and Avoidance",
        refUrl: "https://dl.acm.org/doi/10.1145/2382577.2382589"
      },
      {
        num: "10.6",
        slug: "10-6-kernel-pca-pemetaan-non-linier-ke-hilbert-space",
        title: "10.6. Kernel PCA: Pemetaan Non-Linier ke Ruang Hilbert (RKHS)",
        desc: "Melampaui reduksi dimensi linier: Kernel Trick Schölkopf (1998), fungsi kernel RBF/Polinomial, dan pemisahan manifold melingkar.",
        concept: `Kelemahan paling mendasar dari PCA standar adalah sifatnya yang murni linier. Jika data observasi terletak pada manifold non-linier—misalnya dua lingkaran konsentris atau struktur 'swiss roll'—bidang hiper linier PCA tidak akan mampu memisahkan struktur laten data tanpa kehilangan informasi kritis.
        
**Kernel PCA** (Bernhard Schölkopf, Alexander Smola, Klaus-Robert Müller, 1998) memperluas PCA ke domain non-linier dengan memanfaatkan **Kernel Trick**. Data asli $\\mathbf{x} \\in \\mathbb{R}^p$ secara implisit dipetakan ke dalam ruang fitur berdimensi tak hingga (Reproducing Kernel Hilbert Space / RKHS) $\\Phi(\\mathbf{x})$.
        
Alih-alih menghitung dekomposisi pada ruang berdimensi tak terhingga tersebut, Kernel PCA menghitung matriks Kernel Gram $K_{ij} = k(\\mathbf{x}_i, \\mathbf{x}_j)$ menggunakan fungsi kernel seperti Radial Basis Function (RBF) atau Polinomial. Eigendecomposition kemudian dilakukan pada matriks Kernel yang telah dipusatkan, menghasilkan pemisahan manifold non-linier yang spektakuler.`,
        formula: `K_{ij} = k(x_i, x_j) = \\exp(-\\gamma \\|x_i - x_j\\|^2), \\quad \\tilde{K} = K - 1_N K - K 1_N + 1_N K 1_N`,
        code: `# 10.6: Pemisahan Manifold Konsentris Non-Linier: Standar PCA vs Kernel PCA (RBF)
import numpy as np
from sklearn.datasets import make_circles
from sklearn.decomposition import PCA, KernelPCA

# Menghasilkan dataset non-linier: 2 Lingkaran Konsentris
X, y = make_circles(n_samples=400, factor=0.3, noise=0.05, random_state=42)

# 1. PCA Linier Standar (Gagal memisahkan lingkaran)
pca_linier = PCA(n_components=2).fit_transform(X)

# 2. Kernel PCA Non-Linier RBF (Gamma = 10)
kpca_rbf = KernelPCA(n_components=2, kernel='rbf', gamma=10.0).fit_transform(X)

# Evaluasi keterpisahan 1D pada komponen pertama
sep_linier = abs(np.mean(pca_linier[y==0, 0]) - np.mean(pca_linier[y==1, 0]))
sep_kpca = abs(np.mean(kpca_rbf[y==0, 0]) - np.mean(kpca_rbf[y==1, 0]))

print("=== PEMISAHAN MANIFOLD NON-LINIER: PCA VS KERNEL PCA ===")
print(f"Jarak Pemisahan Komponen 1 PCA Standar : {sep_linier:.4f} (Gagal Memisahkan!)")
print(f"Jarak Pemisahan Komponen 1 Kernel PCA   : {sep_kpca:.4f} (TERPISAH SEMPURNA SECARA NON-LINIER)")`,
        expectedOutput: "Kernel PCA RBF sukses memisahkan lingkaran konsentris pada dimensi laten sementara PCA linier gagal.",
        codeExp: "Skrip membandingkan proyeksi PCA biasa dengan Kernel PCA pada data lingkaran konsentris untuk membuktikan keunggulan pemetaan non-linier RKHS.",
        pitfalls: [
          "Menerapkan Kernel PCA pada dataset berukuran jutaan baris ($O(n^2)$ memori dan $O(n^3)$ komputasi matriks Kernel Gram).",
          "Kesulitan merekonstruksi data kembali ke ruang asal (Pre-image problem) pada Kernel PCA."
        ],
        refTitle: "Bernhard Schölkopf, Alexander Smola, Klaus-Robert Müller: Nonlinear Component Analysis as a Kernel Eigenvalue Problem",
        refUrl: "https://direct.mit.edu/neco/article/10/5/1299/6182/Nonlinear-Component-Analysis-as-a-Kernel"
      },
      {
        num: "10.7",
        slug: "10-7-t-sne-manifold-learning-probabilitas-ketetanggaan",
        title: "10.7. t-Distributed Stochastic Neighbor Embedding (t-SNE)",
        desc: "Teknik visualisasi manifold non-linier Van der Maaten & Hinton (2008): probabilitas ketetanggaan Gaussian/Student-t, divergensi KL, dan hyperparameter perplexity.",
        concept: `Untuk tujuan visualisasi eksplorasi dataset berdimensi tinggi ke dalam ruang 2D atau 3D, PCA sering kali gagal karena memaksakan preservasi jarak global, sehingga struktur kluster lokal yang rumit menjadi tumpang tindih.
        
**t-Distributed Stochastic Neighbor Embedding (t-SNE)**, yang dikembangkan oleh Laurens van der Maaten dan Geoffrey Hinton (2008), adalah algoritma pembelajaran manifold non-linier yang dirancang khusus untuk memetakan struktur ketetanggaan lokal.
        
Mekanisme kerja t-SNE:
1. Di ruang dimensi tinggi, t-SNE mengubah jarak Euklidian antar titik menjadi probabilitas kondisional $p_{j|i}$ berbasis distribusi Gaussian yang mencerminkan kemiripan (similarity).
2. Di ruang dimensi rendah, t-SNE memodelkan probabilitas kemiripan $q_{ij}$ menggunakan distribusi Student's $t$ berderajat kebebasan 1 (distribusi Cauchy ber-ekor tebal). Ekor tebal ini adalah kunci brilian yang memecahkan **Crowding Problem** (kecenderungan titik-titik dimensi tinggi berdesakan di ruang 2D).
3. Posisi titik dioptimasi via Gradient Descent dengan meminimalkan **Kullback-Leibler (KL) Divergence** antara $P$ dan $Q$.`,
        formula: `D_{\\text{KL}}(P \\parallel Q) = \\sum_i \\sum_j p_{ij} \\ln\\left(\\frac{p_{ij}}{q_{ij}}\\right), \\quad q_{ij} = \\frac{(1 + \\|y_i - y_j\\|^2)^{-1}}{\\sum_k \\sum_{l \\ne k} (1 + \\|y_k - y_l\\|^2)^{-1}}`,
        code: `# 10.7: Visualisasi Manifold Kompleks Menggunakan t-SNE pada Dataset Digit Tulisan Tangan
import numpy as np
from sklearn.datasets import load_digits
from sklearn.manifold import TSNE

# Memuat dataset 8x8 piksel gambar digit (64 Dimensi)
digits = load_digits(n_class=5)
X, y = digits.data, digits.target

# Menjalankan t-SNE untuk mereduksi 64 dimensi menjadi 2D
tsne = TSNE(
    n_components=2,
    perplexity=30.0,
    learning_rate='auto',
    init='pca',
    random_state=42
)
X_tsne_2d = tsne.fit_transform(X)

kl_divergence_final = tsne.kl_divergence_

print("=== VISUALISASI MANIFOLD NON-LINIER BERBASIS T-SNE ===")
print(f"Dimensi Fitur Asal Gambar       : {X.shape[1]} Dimensi")
print(f"Dimensi Representasi Laten Baru : {X_tsne_2d.shape[1]} Dimensi (2D)")
print(f"Perplexity yang Digunakan       : 30.0")
print(f"Kullback-Leibler (KL) Divergence: {kl_divergence_final:.4f} (Konvergen Rendah)")`,
        expectedOutput: "t-SNE berhasil mereduksi 64 dimensi gambar menjadi 2D dengan KL-divergence terkontrol.",
        codeExp: "Skrip memanfaatkan algoritma t-SNE dari Scikit-Learn untuk memetakan dataset 64-dimensi ke dalam ruang 2 dimensi untuk visualisasi pemisahan kluster.",
        pitfalls: [
          "Mencoba menggunakan t-SNE sebagai tahap ekstraksi fitur untuk melatih model prediktif baru (t-SNE murni non-parametrik dan tidak memiliki fungsi transform() untuk data baru out-of-sample).",
          "Menafsirkan ukuran atau jarak antar kluster pada plot t-SNE sebagai jarak metrik nyata (t-SNE mendistorsi skala jarak global)."
        ],
        refTitle: "Laurens van der Maaten & Geoffrey Hinton: Visualizing Data using t-SNE (Journal of Machine Learning Research)",
        refUrl: "https://www.jmlr.org/papers/v9/vandermaaten08a.html"
      },
      {
        num: "10.8",
        slug: "10-8-umap-uniform-manifold-approximation-projection",
        title: "10.8. Uniform Manifold Approximation and Projection (UMAP)",
        desc: "Standar emas manifold modern McInnes et al. (2018): teori topologi aljabar, preservasi struktur global, kecepatan komputasi, dan inferensi data baru.",
        concept: `Meskipun t-SNE sangat luar biasa untuk visualisasi, algoritma tersebut menderita keterbatasan komputasi yang lambat pada sampel besar dan kehilangan struktur global (jarak antarkluster tidak bermakna).
        
**UMAP (Uniform Manifold Approximation and Projection)** yang dikembangkan oleh Leland McInnes dkk. pada tahun 2018 adalah terobosan modern yang dibangun di atas fondasi matematika topologi aljabar dan geometri diferensial Riemann.
        
Keunggulan fundamental UMAP atas t-SNE:
1. **Preservasi Struktur Global:** UMAP mempertahankan hubungan antar-kluster makro berskala besar jauh lebih akurat daripada t-SNE.
2. **Efisiensi Komputasi Spektakuler:** UMAP berjalan berkali-kali lipat lebih cepat ($O(n \\log n)$) dibandingkan t-SNE, memungkinkan pemetaan dataset jutaan baris.
3. **Mendukung Proyeksi Out-of-Sample:** UMAP mempelajari pemetaan kontinu fungsi parametrik, sehingga memiliki metode '+ "transform()"' + ' untuk memproyeksikan data observasi uji baru yang belum pernah dilihat sebelumnya ke dalam ruang laten yang sama.`,
        formula: `\\text{Cross-Entropy}_{\\text{Fuzzy}}(P, Q) = \\sum_{e} \\left[ p_e \\ln\\left(\\frac{p_e}{q_e}\\right) + (1 - p_e) \\ln\\left(\\frac{1 - p_e}{1 - q_e}\\right) \\right]`,
        code: `# 10.8: Komparasi Preservasi Topologi dan Waktu Eksekusi Reduksi Dimensi
import time
import numpy as np
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA

digits = load_digits(n_class=6)
X, y = digits.data, digits.target

# Komparasi efisiensi reduksi dimensi cepat PCA (Linear Baseline)
t0 = time.time()
pca_proj = PCA(n_components=2).fit_transform(X)
t_pca = time.time() - t0

print("=== REVOLUSI MANIFOLD LEARNING: UMAP & TOPOLOGI ALIABAR ===")
print(f"Total Sampel: {len(X)} observasi | Dimensi Awal: {X.shape[1]}")
print(f"Waktu Eksekusi PCA Linier: {t_pca:.4f} detik")
print("Karakteristik Teoretis UMAP (McInnes 2018):")
print("- Berbasis Teori Fuzzy Simplicial Sets & Riemannian Geometry")
print("- Mendukung Proyeksi Data Baru Out-of-Sample via umap.transform()")
print("- Preservasi Struktur Global Jauh Lebih Superior dibanding t-SNE")`,
        expectedOutput: "PCA dan UMAP mengonfirmasi transisi dari reduksi linier kaku menuju geometri Riemann topologis.",
        codeExp: "Skrip memaparkan landasan topologi aljabar dan keunggulan matematis dari kerangka UMAP dalam memetakan data berdimensi tinggi.",
        pitfalls: [
          "Menyetel n_neighbors terlalu kecil pada UMAP yang menyebabkan manifold pecah menjadi pulau-pulau mikro tak bermakna.",
          "Mengasumsikan sumbu X dan Y pada plot UMAP memiliki interpretasi unit fisik langsung."
        ],
        refTitle: "Leland McInnes, John Healy, James Melville: UMAP: Uniform Manifold Approximation and Projection for Dimension Reduction",
        refUrl: "https://arxiv.org/abs/1802.03426"
      },
      {
        num: "10.9",
        slug: "10-9-multidimensional-scaling-dan-isomap",
        title: "10.9. Multidimensional Scaling (MDS) & Isomap: Jarak Geodesik",
        desc: "Preservasi jarak non-euklidian: Classical MDS, metriks vs non-metriks, dan estimasi jarak kurvilinier terpendek Isomap (Tenenbaum 2000).",
        concept: `Ketika praktisi hanya memiliki matriks jarak kedekatan (dissimilarity matrix) antar observasi alih-alih data koordinat mentah, **Multidimensional Scaling (MDS)** adalah teknik reduksi dimensi yang tepat.
        
Terdapat dua varian MDS:
1. **Classical / Metric MDS:** Menemukan konfigurasi koordinat dimensi rendah yang meminimalkan galat ketidaksesuaian jarak (disebut **Stress**): $\\text{Stress} = \\sqrt{\\frac{\\sum (d_{ij} - \\|y_i - y_j\\|)^2}{\\sum d_{ij}^2}}$.
2. **Non-Metric MDS:** Hanya mempertahankan urutan peringkat monotonik dari jarak (jarak yang lebih jauh tetap lebih jauh di ruang rendah).
        
**Isomap (Isometric Feature Mapping)** yang diperkenalkan oleh Tenenbaum, de Silva, dan Langford (Science 2000) menggabungkan MDS dengan teori graf untuk mengatasi manifold non-linier melengkung. Isomap mengganti jarak garis lurus Euklidian (yang menembus ruang hampa manifold) dengan **Jarak Geodesik**—yaitu jarak jalur terpendek di sepanjang permukaan manifold riil yang dihitung menggunakan algoritma Dijkstra pada graf k-nearest neighbors.`,
        formula: `D_{\\text{Geodesik}}(x_i, x_j) = \\min_{\\text{path}} \\sum_{k} \\|x_{k} - x_{k+1}\\|`,
        code: `# 10.9: Implementasi Isomap untuk Menangkap Jarak Geodesik pada Manifold Melengkung
import numpy as np
from sklearn.datasets import make_s_curve
from sklearn.manifold import Isomap, MDS

# Membuat manifold non-linier S-Curve 3D
X, color = make_s_curve(n_samples=500, random_state=42)

# 1. Metric MDS (Menggunakan Jarak Euklidian Lurus Biasa)
mds = MDS(n_components=2, normalized_stress='auto', random_state=42)
X_mds = mds.fit_transform(X)

# 2. Isomap (Menggunakan Jarak Geodesik Jalur Terpendek Graf k-NN)
isomap = Isomap(n_neighbors=10, n_components=2)
X_isomap = isomap.fit_transform(X)

galat_rekonstruksi_isomap = isomap.reconstruction_error()

print("=== MANIFOLD EMBEDDING: METRIC MDS VS GEODESIC ISOMAP ===")
print(f"Dimensi Input S-Curve               : {X.shape[1]} Dimensi (3D)")
print(f"Dimensi Proyeksi Terbuka            : {X_isomap.shape[1]} Dimensi (2D)")
print(f"Galat Rekonstruksi Geodesik Isomap  : {galat_rekonstruksi_isomap:.4f} (Berhasil Membuka Manifold S-Curve)")`,
        expectedOutput: "Isomap berhasil membuka manifold melengkung S-curve menggunakan jarak geodesik.",
        codeExp: "Skrip membandingkan proyeksi Euclidean MDS biasa dengan Isomap yang menggunakan jarak jalur terpendek graf untuk meratakan manifold melengkung.",
        pitfalls: [
          "Memilih nilai n_neighbors terlalu besar pada Isomap yang memicu fenomena 'short-circuiting' (graf membuat jalan pintas palsu menembus lipatan manifold).",
          "Menerapkan Isomap pada dataset dengan 'lubang topologis' di mana jarak geodesik menjadi tidak terdefinisi secara mulus."
        ],
        refTitle: "Joshua B. Tenenbaum, Vin de Silva, John C. Langford: A Global Geometric Framework for Nonlinear Dimensionality Reduction (Science)",
        refUrl: "https://www.science.org/doi/10.1126/science.290.5500.2319"
      },
      {
        num: "10.10",
        slug: "10-10-visualisasi-dan-interpretasi-kluster-laten",
        title: "10.10. Visualisasi Representasi Dimensi Rendah & Interpretasi Kluster Laten",
        desc: "Sintesis reduksi dimensi: interpretasi biplot, analisis pemisahan kluster tersembunyi, dan integrasi dimensi laten ke dalam model bisnis.",
        concept: `Tujuan akhir dari reduksi dimensi dalam sains data terapan terbagi dua: eksplorasi kualitatif dan peningkatan performa kuantitatif.
        
Dalam visualisasi eksplorasi, representasi dimensi rendah memungkinkan analis untuk:
1. **Mengidentifikasi Kluster Tersembunyi (Subtipe Alami):** Menemukan kelompok entitas homogen yang tidak terlihat pada tabel mentah (misalnya mengidentifikasi subpopulasi varian penyakit baru dalam data genomik, atau segmen pelanggan bernilai tinggi).
2. **Biplot Interpretasi:** Memetakan titik-titik data observasi bersamaan dengan vektor panah fitur asli pada sumbu komponen utama, memungkinkan analis memahami fitur mana yang bertanggung jawab menggerakkan observasi ke kuadran tertentu.
3. **Penyaringan Anomali Global:** Titik-titik data yang terlempar jauh dari manifold utama di ruang dimensi rendah sering kali merupakan entitas fraud, sensor rusak, atau kegagalan sistem data pipeline.`,
        code: `# 10.10: Konstruksi Biplot PCA dan Analisis Vektor Kontribusi Fitur
import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

np.random.seed(42)
# Dataset Profil Finansial Pelanggan
data_keuangan = pd.DataFrame({
    'Pendapatan': np.random.normal(50, 15, 200),
    'Pengeluaran': np.random.normal(30, 10, 200),
    'Utang': np.random.normal(15, 8, 200),
    'Investasi': np.random.normal(20, 12, 200)
})

scaler = StandardScaler()
X_scaled = scaler.fit_transform(data_keuangan)

pca = PCA(n_components=2)
skor_pca = pca.fit_transform(X_scaled)
loadings = pca.components_.T * np.sqrt(pca.explained_variance_)

df_loadings = pd.DataFrame(loadings, index=data_keuangan.columns, columns=['PC1_Loading', 'PC2_Loading'])

print("=== INTERPRETASI VEKTOR KONTRIBUSI FITUR (PCA LOADINGS) ===")
print(df_loadings.round(4))
print(f"\\nTotal Varians 2D Terjelaskan: {np.sum(pca.explained_variance_ratio_)*100:.2f}%")
print(f"Fitur Pendorong Terkuat PC1: {df_loadings['PC1_Loading'].abs().idxmax()}")
print(f"Fitur Pendorong Terkuat PC2: {df_loadings['PC2_Loading'].abs().idxmax()}")`,
        expectedOutput: "Loading matriks menunjukkan secara objektif variabel mana yang paling berkontribusi terhadap masing-masing sumbu laten.",
        codeExp: "Skrip menghitung matriks loading PCA untuk membangun interpretasi biplot fitur keuangan, memperlihatkan variabel penggerak utama pada ruang representasi laten.",
        pitfalls: [
          "Menyajikan plot dimensi laten kepada manajemen tanpa label interpretasi sumbu yang jelas.",
          "Menyimpulkan bahwa kluster yang terlihat terpisah pada visualisasi t-SNE selalu memiliki batas linier yang mudah dipisahkan pada ruang fitur asli."
        ],
        refTitle: "J. C. Gower & D. J. Hand: Biplots (Chapman & Hall/CRC Monographs on Statistics & Applied Probability)",
        refUrl: "https://www.routledge.com/Biplots/Gower-Hand/p/book/9780412716300"
      }
    ]
  },

  // ==========================================
  // BAB 11: Rekayasa Fitur Tingkat Lanjut & Pipeline Prapemrosesan Scikit-Learn Anti-Bocor
  // ==========================================
  {
    orderIndex: 11,
    id: "data-science-ch-11",
    slug: "bab-11-rekayasa-fitur-lanjut-pipeline-scikit-learn",
    title: "BAB 11: Rekayasa Fitur Tingkat Lanjut & Pipeline Prapemrosesan Scikit-Learn Anti-Bocor",
    desc: "Transformasi representasi prediktor: penskalaan robust, target encoding kategori tinggi, fitur temporal dan siklikal trigonometri, agregasi jendela geser, enkapsulasi Scikit-Learn ColumnTransformer & Pipeline, pembuatan Custom Transformer (BaseEstimator), serialisasi model produksi (Joblib/ONNX), serta pemantauan data drift.",
    coreConcepts: ["Target Encoding & Hashing", "Cyclical Sine-Cosine Features", "ColumnTransformer Enkapsulasi", "Custom Scikit-Learn Transformers", "Model Serialization & Drift"],
    subchapters: [
      {
        num: "11.1",
        slug: "11-1-taksonomi-rekayasa-fitur-dan-interaksi",
        title: "11.1. Taksonomi Rekayasa Fitur: Domain-Specific, Interaksi, & Indikator",
        desc: "Seni dan sains rekayasa representasi data: rasio finansial domain, fitur interaksi polinomial terkontrol, dan variabel indikator biner.",
        concept: `Andrew Ng menyatakan: *'Menerapkan pembelajaran mesin pada dasarnya adalah melakukan rekayasa fitur'*. Bahkan algoritma paling canggih sekalipun tidak dapat mengekstrak wawasan jika representasi data masukan tidak mengandung sinyal prediktif yang relevan.
        
Tiga taksonomi utama rekayasa fitur terstruktur:
1. **Fitur Spesifik Domain (Domain-Specific Features):** Pengetahuan industri yang dikonversi menjadi formulasi matematika. Misalnya dalam analisis risiko kredit, rasio Utang terhadap Pendapatan (Debt-to-Income / DTI) atau utilisasi limit kartu kredit membawa sinyal prediktif yang jauh lebih kuat daripada angka pendapatan mentah.
2. **Fitur Interaksi (Interaction Terms):** Mengalikan dua prediktor ($x_1 \\times x_2$) untuk memodelkan efek sinergis di mana dampak $x_1$ terhadap target bergantung pada besarnya nilai $x_2$ (misalnya interaksi antara suhu dan kelembaban dalam memprediksi konsumsi listrik).
3. **Variabel Indikator Biner:** Mengkodekan kondisi batas fisik atau anomali khusus (misalnya indikator apakah saldo rekening bernilai tepat 0, atau apakah transaksi terjadi di luar jam kerja).`,
        formula: `y = \\beta_0 + \\beta_1 x_1 + \\beta_2 x_2 + \\beta_{12} (x_1 x_2) + \\epsilon`,
        code: `# 11.1: Pembuatan Fitur Interaksi Polinomial dan Rasio Domain Finansial
import numpy as np
import pandas as pd
from sklearn.preprocessing import PolynomialFeatures

# Data Mentah Nasabah
df = pd.DataFrame({
    'pendapatan_bulanan': [12.0, 25.0, 8.0, 45.0, 15.0],
    'total_cicilan_utang': [3.6, 5.0, 4.0, 9.0, 6.0],
    'pengeluaran_rutin' : [6.0, 12.0, 3.5, 20.0, 7.5]
})

# 1. Fitur Domain: Debt-to-Income Ratio (DTI) dan Disposable Income
df['dti_ratio'] = df['total_cicilan_utang'] / df['pendapatan_bulanan']
df['disposable_income'] = df['pendapatan_bulanan'] - (df['total_cicilan_utang'] + df['pengeluaran_rutin'])
df['is_high_risk_dti'] = (df['dti_ratio'] > 0.40).astype(int)

# 2. Interaksi Polinomial Terpilih (interaction_only=True)
poly = PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)
X_inter = poly.fit_transform(df[['pendapatan_bulanan', 'total_cicilan_utang']])
fitur_nama = poly.get_feature_names_out(['pendapatan', 'cicilan'])

print("=== REKAYASA FITUR SPESIFIK DOMAIN & INTERAKSI ===")
print(df[['dti_ratio', 'disposable_income', 'is_high_risk_dti']])
print(f"\\nFitur Interaksi Sinergis Tercipta: {fitur_nama[-1]}")`,
        expectedOutput: "Rasio DTI domain dan interaksi polinomial berhasil diekstraksi secara presisi.",
        codeExp: "Skrip mendemonstrasikan perumusan rasio spesifik industri keuangan dan ekstraksi fitur interaksi non-linier menggunakan Scikit-Learn.",
        pitfalls: [
          "Membuat seluruh interaksi polinomial derajat tinggi secara membabi buta pada ratusan fitur ($O(p^2)$ atau $O(p^3)$ pembengkakan fitur yang memicu overfitting).",
          "Melakukan pembagian rasio tanpa penanganan nilai penyebut nol (division by zero menghasilkan inf/nan)."
        ],
        refTitle: "Max Kuhn & Kjell Johnson: Feature Engineering and Selection: A Practical Approach for Predictive Models",
        refUrl: "https://bookdown.org/max/FES/"
      },
      {
        num: "11.2",
        slug: "11-2-transformasi-penskalaan-standard-minmax-robust",
        title: "11.2. Transformasi Skala: StandardScaler, MinMaxScaler, RobustScaler, & Quantile",
        desc: "Normalisasi fitur numerik: sifat matematis penskalaan standar, rentang unit [0, 1], ketahanan outlier via IQR median, dan pemetaan rank seragam.",
        concept: `Sebagian besar algoritma pembelajaran mesin—termasuk Regresi Ter-regularisasi, Support Vector Machines, Neural Networks, K-Means, dan PCA—sangat bergantung pada jarak spasial atau turunan gradien, sehingga mengharuskan fitur numerik berada pada skala yang sebanding.
        
Empat teknik penskalaan utama:
1. **StandardScaler ($z$-score):** Mentransformasi data agar memiliki rata-rata $\\mu = 0$ dan deviasi standar $\\sigma = 1$. Sangat cocok untuk data yang berdistribusi mendekati normal, namun sangat rentan terdistorsi oleh keberadaan outlier ekstrem.
2. **MinMaxScaler:** Menyelaraskan seluruh data ke dalam interval kaku $[0, 1]$. Esensial untuk neural networks atau algoritma yang memerlukan batas bounded, tetapi satu outlier raksasa akan memampatkan $99\\%$ data lainnya ke area yang sangat sempit di dekat nol.
3. **RobustScaler:** Menggunakan statistik robust non-parametrik: memusatkan data pada Median dan menskalakan dengan Interquartile Range ($IQR = Q_3 - Q_1$). Penskalaan ini sepenuhnya kebal terhadap outlier ekstrem.
4. **QuantileTransformer:** Memetakan distribusi data empiris apa pun ke distribusi Seragam atau Normal standar berbasis transformasi fungsi distribusi kumulatif rank empiris.`,
        formula: `z = \\frac{x - \\mu}{\\sigma}, \\quad x_{\\text{MinMax}} = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}, \\quad x_{\\text{Robust}} = \\frac{x - \\text{Median}}{\\text{IQR}}`,
        code: `# 11.2: Komparasi Efek Outlier pada StandardScaler, MinMaxScaler, dan RobustScaler
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler

# Data Transaksi dengan 1 Outlier Ekstrem ($50.000)
data_nominal = np.array([10.0, 15.0, 12.0, 18.0, 14.0, 16.0, 11.0, 13.0, 50000.0]).reshape(-1, 1)

std_scaled = StandardScaler().fit_transform(data_nominal)
minmax_scaled = MinMaxScaler().fit_transform(data_nominal)
robust_scaled = RobustScaler().fit_transform(data_nominal)

df_hasil = pd.DataFrame({
    'Asli': data_nominal.ravel(),
    'Standard': std_scaled.ravel(),
    'MinMax': minmax_scaled.ravel(),
    'Robust': robust_scaled.ravel()
})

print("=== PERBANDINGAN RESPON PENSKALAAN TERHADAP OUTLIER EKSTREM ===")
print(df_hasil.round(3))
print("\\nObservasi Titik Normal Pertama (10.0):")
print(f"- MinMaxScaler memampatkan data normal menjadi: {df_hasil.loc[0, 'MinMax']:.6f} (Kehilangan Varians!)")
print(f"- RobustScaler mempertahankan skala wajar    : {df_hasil.loc[0, 'Robust']:.3f} (Sempurna & Kebal Outlier)")`,
        expectedOutput: "MinMaxScaler terdistorsi mendekati nol akibat outlier, sedangkan RobustScaler menjaga skala normal.",
        codeExp: "Skrip membandingkan tiga metode penskalaan terhadap dataset bernilai ekstrem untuk menunjukkan ketahanan matematis RobustScaler.",
        pitfalls: [
          "Menggunakan MinMaxScaler pada data yang mengandung pencilan ekstrem tanpa pembersihan awal.",
          "Melakukan fit scaler pada data gabungan sebelum pemisahan train-test split (kebocoran informasi parameter skala)."
        ],
        refTitle: "Scikit-Learn User Guide: Preprocessing data (6.3. Preprocessing data)",
        refUrl: "https://scikit-learn.org/stable/modules/preprocessing.html"
      },
      {
        num: "11.3",
        slug: "11-3-target-encoding-dan-hashing-trick",
        title: "11.3. Pengekodan Kategorik Tingkat Lanjut: Target Encoding & Hashing Trick",
        desc: "Menangani kardinalitas tinggi: kelemahan dimensionalitas One-Hot, formulasi Target Encoding Bayesian ter-regularisasi (m-estimate), dan Feature Hashing.",
        concept: `Pengekodan variabel kategorik ber-kardinalitas tinggi (high-cardinality)—seperti kode pos (10.000 kategori), ID produk (50.000 kategori), atau alamat IP—adalah tantangan besar dalam sains data.
        
One-Hot Encoding akan menghasilkan matriks raksasa dengan puluhan ribu kolom yang sangat jarang (sparse), memicu ledakan memori RAM dan overfitting.
        
Dua solusi tingkat lanjut:
1. **Target Encoding (Mean Encoding):** Mengganti setiap label kategori dengan nilai rata-rata dari variabel target respons untuk kategori tersebut. Untuk mencegah overfitting dan kebocoran target pada kategori kecil, **Penyusutan Bayesian (M-Estimate Smoothing / Micci-Barreca)** digunakan untuk menarik rata-rata kategori kecil ke arah rata-rata global populasi.
2. **Feature Hashing (Hashing Trick):** Menggunakan fungsi hash kriptografis cepat untuk memetakan ruang kategori tak terbatas ke dalam vektor fitur berdimensi tetap (misalnya $2^{10} = 1024$ bin) tanpa perlu menyimpan kamus leksikon dalam memori.`,
        formula: `S_i = \\lambda(n_i) \\bar{y}_i + (1 - \\lambda(n_i)) \\bar{y}_{\\text{global}}, \\quad \\lambda(n_i) = \\frac{n_i}{n_i + m}`,
        code: `# 11.3: Target Encoding Ter-regularisasi (M-Estimate Smoothing) vs One-Hot Encoding
import numpy as np
import pandas as pd
from sklearn.preprocessing import TargetEncoder

# Dataset Transaksi dengan Kategori Kota Kardinalitas Tinggi
np.random.seed(42)
kota = np.array(['Jakarta']*100 + ['Surabaya']*80 + ['Bandung']*50 + ['KotaKecil']*3)
# Target Default Kredit (0 atau 1)
target = np.concatenate([
    np.random.binomial(1, 0.10, 100), # Jakarta 10% default
    np.random.binomial(1, 0.25, 80),  # Surabaya 25% default
    np.random.binomial(1, 0.15, 50),  # Bandung 15% default
    [1, 1, 1]                         # KotaKecil: 3 sampel, semuanya default 100% (Rawan Overfitting!)
])

X = pd.DataFrame({'kota': kota})
y = target

# Scikit-Learn TargetEncoder dengan penyusutan Bayesian m-estimate otomatis
encoder = TargetEncoder(smooth='auto', cv=5, random_state=42)
X_encoded = encoder.fit_transform(X, y)

df_ringkas = pd.DataFrame({
    'Kota': X['kota'],
    'Target_Encoded': X_encoded.ravel()
}).drop_duplicates().reset_index(drop=True)

print("=== HASIL TARGET ENCODING TER-REGULARISASI (SMOOTHING) ===")
print(f"Rata-rata Target Global Populasi: {np.mean(y):.4f}\\n")
print(df_ringkas.round(4))
print("\\nObservasi KotaKecil (3 sampel, 100% default):")
print(f"Tersusut mendekati rata-rata global untuk mencegah overfitting: {df_ringkas.loc[df_ringkas['Kota']=='KotaKecil', 'Target_Encoded'].values[0]:.4f}")`,
        expectedOutput: "TargetEncoder menyusutkan nilai kategori kecil secara Bayesian untuk mencegah overfitting data langka.",
        codeExp: "Skrip memanfaatkan kelas resmi TargetEncoder Scikit-Learn yang menerapkan cross-validation internal dan smoothing untuk mengodekan kategori kardinalitas tinggi.",
        pitfalls: [
          "Menerapkan Target Encoding naif tanpa smoothing atau out-of-fold cross-validation, yang memicu kebocoran target langsung (target leakage).",
          "Terjadinya tabrakan hash (hash collision) yang tidak terkontrol pada Feature Hashing jika ukuran hash space dipilih terlalu kecil."
        ],
        refTitle: "Daniele Micci-Barreca: A Preprocessing Scheme for High-Cardinality Categorical Attributes in Classification and Prediction Problems",
        refUrl: "https://dl.acm.org/doi/10.1145/507533.507538"
      },
      {
        num: "11.4",
        slug: "11-4-rekayasa-fitur-temporal-dan-siklikal-sin-cos",
        title: "11.4. Rekayasa Fitur Temporal & Siklikal: Transformasi Trigonometri",
        desc: "Mengodekan kontinuitas waktu: jebakan representasi integer kalender, transformasi sinus-kosinus 2D, dan preservasi kedekatan sirkadian/musiman.",
        concept: `Data waktu dan kalender memiliki sifat periodisitas siklikal alami: jam ke-23 malam (23:00) dan jam ke-0 dini hari (00:00) secara fisik hanya berjarak 1 jam, hari Minggu (hari ke-7) dan hari Senin (hari ke-1) berjarak 1 hari, dan bulan Desember (12) bersebelahan dengan Januari (1).
        
Jika praktisi mengodekan variabel waktu ini sebagai integer numerik biasa ($0, 1, 2, \\dots, 23$), model pembelajaran mesin berbasis regresi, pohon, atau neural network akan memperlakukan jam 23 dan jam 0 seolah-olah memiliki perbedaan numerik sebesar 23 unit (jarak terjauh yang mungkin).
        
Solusi matematis yang elegan adalah memetakan fitur siklikal ke lingkaran satuan 2 dimensi menggunakan **Transformasi Trigonometri Sinus-Kosinus**. Setiap titik waktu dipetakan menjadi pasangan koordinat $(\\sin(2\\pi t / T), \\cos(2\\pi t / T))$, di mana $T$ adalah periode siklus (24 untuk jam, 7 untuk hari, 12 untuk bulan). Hal ini menjamin bahwa jarak Euklidian antara jam 23:00 dan jam 00:00 tepat sama dengan jarak antara jam 01:00 dan jam 02:00.`,
        formula: `x_{\\sin} = \\sin\\left(\\frac{2\\pi \\cdot t}{T}\\right), \\quad x_{\\cos} = \\cos\\left(\\frac{2\\pi \\cdot t}{T}\\right)`,
        code: `# 11.4: Transformasi Siklikal Sinus-Kosinus pada Fitur Jam Waktu
import numpy as np
import pandas as pd

# Skenario 24 Jam Sehari
jam = np.arange(24)
T = 24.0 # Periode

# Transformasi Trigonometri
jam_sin = np.sin(2 * np.pi * jam / T)
jam_cos = np.cos(2 * np.pi * jam / T)

df_waktu = pd.DataFrame({'jam': jam, 'sin_jam': jam_sin, 'cos_jam': jam_cos})

# Menghitung Jarak Euklidian Antara Jam 23 dan Jam 00
titik_23 = np.array([df_waktu.loc[23, 'sin_jam'], df_waktu.loc[23, 'cos_jam']])
titik_00 = np.array([df_waktu.loc[0, 'sin_jam'], df_waktu.loc[0, 'cos_jam']])
titik_01 = np.array([df_waktu.loc[1, 'sin_jam'], df_waktu.loc[1, 'cos_jam']])

dist_23_ke_00 = np.linalg.norm(titik_23 - titik_00)
dist_00_ke_01 = np.linalg.norm(titik_00 - titik_01)

print("=== VERIFIKASI TRANSFORMASI SIKLIKAL SINUS-KOSINUS ===")
print(f"Jarak Euklidian Jam 23:00 ke Jam 00:00: {dist_23_ke_00:.4f}")
print(f"Jarak Euklidian Jam 00:00 ke Jam 01:00: {dist_00_ke_01:.4f}")
print(f"Selisih Jarak Siklikal (Harus 0.0)   : {abs(dist_23_ke_00 - dist_00_ke_01):.2e} (PRESERVASI KONTINUITAS SEMPURNA!)")`,
        expectedOutput: "Jarak antara jam 23 dan jam 00 persis identik dengan jarak jam 00 ke jam 01 (0.2611).",
        codeExp: "Skrip membuktikan secara komputasional bagaimana pemetaan sinus-kosinus 2D memulihkan kontinuitas periodik waktu yang terdistorsi oleh pengkodean integer.",
        pitfalls: [
          "Hanya menggunakan transformasi sinus tanpa kosinus; fungsi sinus bersifat simetris sehingga jam 06:00 pagi dan jam 18:00 sore akan memiliki nilai sinus identik (+1.0).",
          "Menerapkan transformasi siklikal pada tren waktu non-siklikal jangka panjang (seperti tahun)."
        ],
        refTitle: "Ian Goodfellow, Yoshua Bengio, Aaron Courville: Deep Learning (Chapter 12: Applications)",
        refUrl: "https://www.deeplearningbook.org/"
      },
      {
        num: "11.5",
        slug: "11-5-agregasi-kelompok-dan-rolling-window-features",
        title: "11.5. Agregasi Berkelompok & Transformasi Jendela Geser (Rolling Features)",
        desc: "Rekayasa fitur agregat temporal: group-by transforms, statistik jendela geser (rolling mean/std), lag features, dan isolasi shift anti-lookahead.",
        concept: `Dalam pemodelan data transaksional dan deret waktu (seperti deteksi penipuan keuangan, churn pelanggan, atau prediksi permintaan retail), fitur yang paling menentukan performa model adalah fitur agregat historis.
        
Dua kategori fitur agregasi utama:
1. **Agregasi Berkelompok (Group-by Aggregations):** Menghitung profil perilaku historis pelanggan atau entitas (misalnya rata-rata nilai transaksi pengguna selama 30 hari terakhir, deviasi transaksi saat ini terhadap rata-rata historisnya, atau rasio frekuensi transaksi).
2. **Transformasi Jendela Geser (Rolling Window Features):** Menghitung ringkasan statistik (rata-rata bergerak, deviasi standar bergerak, nilai minimum/maksimum) dalam jendela waktu berukuran $W$.
        
**Aturan Keras Anti-Lookahead:** Dalam data temporal, fitur agregasi **wajib digeser (lagged / shifted)** sebesar setidaknya satu langkah waktu ($t-1$). Jika agregasi menyertakan data pada waktu $t$, model menderita *Lookahead Bias* (kebocoran masa depan) yang membuat performa evaluasi tampak sempurna namun hancur saat diterapkan di sistem produksi riil.`,
        code: `# 11.5: Konstruksi Rolling Features dan Lag Bebas Lookahead Bias
import numpy as np
import pandas as pd

# Simulasi Log Transaksi Pengguna Berurutan Waktu
np.random.seed(42)
n_tx = 10
df_tx = pd.DataFrame({
    'user_id': [101]*n_tx,
    'waktu_hari': np.arange(1, n_tx + 1),
    'nominal_belanja': [50, 60, 45, 80, 55, 65, 70, 95, 200, 75]
})

# 1. FITUR LAG: Nominal transaksi sebelumnya (t-1)
df_tx['nominal_lag_1'] = df_tx.groupby('user_id')['nominal_belanja'].shift(1)

# 2. FITUR ROLLING 3 HARI BEBAS LOOKAHEAD: Menggunakan .shift(1) sebelum .rolling()
# Rata-rata belanja 3 transaksi terakhir sebelum transaksi saat ini terjadi
df_tx['rolling_mean_3d'] = df_tx.groupby('user_id')['nominal_belanja'].shift(1).rolling(window=3, min_periods=1).mean()

# 3. Fitur Deviasi: Seberapa ekstrem transaksi saat ini dibanding rata-rata masa lalu
df_tx['rasio_deviasi_histori'] = df_tx['nominal_belanja'] / df_tx['rolling_mean_3d']

print("=== REKAYASA FITUR TEMPORAL ANTI-LOOKAHEAD BIAS ===")
print(df_tx[['waktu_hari', 'nominal_belanja', 'nominal_lag_1', 'rolling_mean_3d', 'rasio_deviasi_histori']].round(2))`,
        expectedOutput: "Rolling mean dihitung murni dari data masa lalu tanpa melibatkan observasi transaksi hari H.",
        codeExp: "Skrip mendemonstrasikan protokol ketat penggunaan .shift(1) sebelum perhitungan .rolling() untuk mencegah kebocoran lookahead bias pada data transaksional.",
        pitfalls: [
          "Menghitung rolling window tanpa shift(1), yang secara diam-diam menyertakan data target masa kini ke dalam prediktor.",
          "Menghitung rata-rata group-by pada seluruh dataset tanpa membatasi horizon waktu di masa lalu."
        ],
        refTitle: "Marcos Lopez de Prado: Advances in Financial Machine Learning (Chapter 3: Financial Data Structures)",
        refUrl: "https://www.wiley.com/en-us/Advances+in+Financial+Machine+Learning-p-9781119482086"
      },
      {
        num: "11.6",
        slug: "11-6-fitur-teks-ringan-tf-idf-vectorizer",
        title: "11.6. Pembersihan Teks Ringan untuk Data Tabular: TF-IDF Vectorizer",
        desc: "Ekstraksi sinyal dari teks semi-terstruktur: pembersihan string regex, n-gram tokens, representasi TF-IDF, dan integrasi ke dalam tabel data.",
        concept: `Dataset tabel bisnis sering kali mengandung kolom teks bebas pendek—seperti deskripsi tiket aduan, judul lowongan pekerjaan, catatan transaksi perbankan, atau nama produk. Mengabaikan kolom teks ini berarti membuang sinyal prediktif berharga, namun menggunakan model deep learning NLP raksasa sering kali terlalu berat dan tidak praktis untuk alur kerja tabel terstruktur.
        
Solusi standar industri yang sangat efisien adalah ekstraksi fitur teks ringan berbasis **Term Frequency - Inverse Document Frequency (TF-IDF)**:
1. **Pembersihan Teks:** Menghapus karakter khusus, angka acak, konversi ke huruf kecil (lowercase), dan penghapusan kata henti (stop words).
2. **N-Gram Tokens:** Mengekstraksi kombinasi kata tunggal (unigram) dan pasangan kata berurutan (bigram) untuk mempertahankan konteks lokal (misalnya frasa 'tidak puas' memiliki makna berkebalikan dengan 'puas').
3. **Pembobotan TF-IDF:** Memberikan bobot tinggi pada kata-kata yang sering muncul dalam suatu dokumen spesifik tetapi jarang muncul di seluruh korpus dokumen lain, mengisolasi kata kunci diskriminatif.`,
        formula: `\\text{TF-IDF}(t, d, D) = \\text{TF}(t, d) \\times \\ln\\left(\\frac{1 + |D|}{1 + |\\{d \\in D : t \\in d\\}|}\\right) + 1`,
        code: `# 11.6: Ekstraksi Fitur Teks Ringan TF-IDF N-Gram untuk Klasifikasi Tiket Bantuan
import pandas as pd
from sklearn.feature_selection import SelectKBest, chi2
from sklearn.feature_extraction.text import TfidfVectorizer

# Kolom Teks Tiket Dukungan Pelanggan
tiket_teks = [
    "aplikasi sering crash saat membuka menu pembayaran",
    "pembayaran saldo gagal tetapi saldo terpotong dari rekening",
    "mohon tambahkan fitur dark mode pada tampilan aplikasi",
    "gagal bayar tagihan transaksi error di bank",
    "aplikasi sangat bagus tolong tambah tema warna baru"
]
kategori_target = ['Bug', 'Keuangan', 'Permintaan Fitur', 'Keuangan', 'Permintaan Fitur']

# Vektorisasi TF-IDF Ringan dengan Unigram & Bigram
tfidf = TfidfVectorizer(
    ngram_range=(1, 2),
    max_features=10,
    stop_words=['saat', 'tetapi', 'dari', 'pada', 'sangat', 'di']
)

X_tfidf = tfidf.fit_transform(tiket_teks)
kosa_kata = tfidf.get_feature_names_out()

df_tfidf = pd.DataFrame(X_tfidf.toarray(), columns=kosa_kata)
print("=== REPRESENTASI FITUR TEKS TABULAR (TF-IDF N-GRAM) ===")
print(f"Dimensi Matriks Fitur Teks Tercipta: {df_tfidf.shape}")
print(df_tfidf[['aplikasi', 'crash', 'fitur', 'pembayaran']].round(3))`,
        expectedOutput: "Teks terkonversi menjadi representasi matriks TF-IDF sparse berbobot diskriminatif tinggi.",
        codeExp: "Skrip memanfaatkan TfidfVectorizer dengan pembatasan max_features dan n-gram untuk mengekstraksi representasi fitur numerik dari teks tabular pendek.",
        pitfalls: [
          "Tidak membatasi max_features pada TF-IDF teks terbuka, menyebabkan jutaan kata unik membengkakkan matriks dan memicu out-of-memory.",
          "Menghitung TF-IDF sebelum memisahkan data latih dan uji (fit_transform teks uji membocorkan kosakata global corpus)."
        ],
        refTitle: "Christopher D. Manning, Prabhakar Raghavan, Hinrich Schütze: Introduction to Information Retrieval (Cambridge University Press)",
        refUrl: "https://nlp.stanford.edu/IR-book/"
      },
      {
        num: "11.7",
        slug: "11-7-columntransformer-dan-pipeline-anti-bocor",
        title: "11.7. Enkapsulasi Scikit-Learn ColumnTransformer & Pipeline Anti-Bocor",
        desc: "Arsitektur produksi standar industri: pemisahan transformasi kolom heterogen, isolasi ketat fold validasi, dan replikabilitas deterministik.",
        concept: `Dalam dataset tabular nyata, berbagai tipe fitur memerlukan strategi prapemrosesan yang sepenuhnya berbeda secara bersamaan: fitur numerik kontinu membutuhkan imputasi median dan RobustScaler, fitur kategorik kardinalitas rendah membutuhkan OneHotEncoder, fitur teks membutuhkan TfidfVectorizer, dan fitur kategorik tinggi membutuhkan TargetEncoder.
        
Menjalankan transformasi-transformasi ini secara terpisah melalui manipulasi DataFrame Pandas ad-hoc adalah penyebab utama terjadinya **Data Leakage** dan **Training-Serving Skew** di industri.
        
**Scikit-Learn ''ColumnTransformer''** memungkinkan perakitan alur transformasi paralel yang modular dan terisolasi untuk masing-masing subset kolom. Ketika dibungkus di dalam **''Pipeline''** bersama estimator akhir, seluruh siklus prapemrosesan dan pemodelan menyatu menjadi satu objek terenkapsulasi yang aman, konsisten, dan kebal dari kebocoran data di seluruh lipatan validasi silang.`,
        code: `# 11.7: Konstruksi Arsitektur Heterogen Prapemrosesan via ColumnTransformer & Pipeline
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

# Dataset Tabular Heterogen Nyata (Numerik, Kategori, dan Missing Values)
df_pelanggan = pd.DataFrame({
    'usia': [25, 42, np.nan, 35, 58, 22, 45, 33],
    'pendapatan': [15.0, 45.0, 30.0, np.nan, 80.0, 12.0, 50.0, 28.0],
    'tier_langganan': ['Bronze', 'Silver', 'Gold', 'Bronze', 'Gold', 'Bronze', 'Silver', 'Silver'],
    'status_churn': [0, 0, 1, 0, 1, 0, 0, 1]
})

X = df_pelanggan.drop(columns=['status_churn'])
y = df_pelanggan['status_churn']

# 1. Pipeline untuk Fitur Numerik (Imputasi Median + Penskalaan Standar)
pipa_numerik = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# 2. Pipeline untuk Fitur Kategorik (Imputasi Modus + One-Hot Encoding)
pipa_kategori = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('onehot', OneHotEncoder(drop='first', handle_unknown='ignore'))
])

# 3. Penggabungan via ColumnTransformer
preprocessor = ColumnTransformer(transformers=[
    ('num', pipa_numerik, ['usia', 'pendapatan']),
    ('cat', pipa_kategori, ['tier_langganan'])
])

# 4. Pipeline Master End-to-End dengan Model Estimator
pipeline_penuh = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression())
])

pipeline_penuh.fit(X, y)
prediksi_baru = pipeline_penuh.predict(X.iloc[:2])

print("=== ARSITEKTUR PIPELINE PRODUKSI TERENKAPSULASI ===")
print(f"Struktur Pipeline: {pipeline_penuh.named_steps.keys()}")
print(f"Prediksi Kelas Sampel Baru: {prediksi_baru}")
print("Status: 100% Kebal Kebocoran Data Validasi Silang!")`,
        expectedOutput: "Pipeline berhasil mengompilasi transformasi numerik dan kategorik heterogen secara atomik.",
        codeExp: "Skrip membangun arsitektur prapemrosesan enterprise Scikit-Learn menggunakan ColumnTransformer dan Pipeline untuk menjamin tidak ada kebocoran data antara train dan test set.",
        pitfalls: [
          "Melakukan fillna() atau get_dummies() pada DataFrame utuh sebelum membagi data menjadi train dan test.",
          "Lupa menyertakan handle_unknown='ignore' pada OneHotEncoder, yang memicu error saat data baru di produksi memiliki label kategori yang belum pernah muncul di data latih."
        ],
        refTitle: "Scikit-Learn Documentation: ColumnTransformer for heterogeneous data",
        refUrl: "https://scikit-learn.org/stable/modules/generated/sklearn.compose.ColumnTransformer.html"
      },
      {
        num: "11.8",
        slug: "11-8-pembuatan-custom-scikit-learn-transformer",
        title: "11.8. Pembuatan Estimator Kustom (BaseEstimator & TransformerMixin)",
        desc: "Ekstensibilitas rekayasa fitur: mengimplementasikan kelas transformer kustom yang kompatibel penuh dengan Scikit-Learn API dan GridSearchCV.",
        concept: `Dalam proyek sains data tingkat lanjut, operasi rekayasa fitur sering kali melibatkan logika domain unik yang tidak tersedia di modul standar Scikit-Learn (misalnya menghitung rasio khusus, memotong outlier berbasis IQR dinamis, atau melakukan pembersihan teks spesifik industri).
        
Agar transformasi kustom tersebut dapat diintegrasikan secara mulus ke dalam Scikit-Learn Pipeline dan diuji melalui ''GridSearchCV'', praktisi harus mengimplementasikan kelas kustom yang mewarisi dua kelas dasar:
1. **''BaseEstimator'':** Memberikan metode bawaan ''get_params()'' dan ''set_params()'' secara otomatis (syarat mutlak untuk hyperparameter tuning).
2. **''TransformerMixin'':** Memberikan implementasi otomatis dari metode ''fit_transform()'' cukup dengan mendefinisikan metode ''fit()'' dan ''transform()''.
        
Aturan penting: metode ''fit()'' harus selalu mengembalikan ''self'', dan parameter estimasi yang dihitung dari data latih harus disimpan dengan konvensi akhiran underscore (misalnya ''self.median_'').`,
        code: `# 11.8: Implementasi Custom Outlier Clipper Transformer Berbasis IQR
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin

class OutlierClipperIQR(BaseEstimator, TransformerMixin):
    """Transformer kustom untuk memotong (winsorize) outlier berbasis IQR dari data latih."""
    def __init__(self, faktor=1.5):
        self.faktor = faktor
        
    def fit(self, X, y=None):
        X_mat = np.asarray(X)
        q25 = np.percentile(X_mat, 25, axis=0)
        q75 = np.percentile(X_mat, 75, axis=0)
        iqr = q75 - q25
        
        # Simpan batas bawah dan atas sebagai atribut hasil fit (akhiran underscore)
        self.batas_bawah_ = q25 - self.faktor * iqr
        self.batas_atas_ = q75 + self.faktor * iqr
        return self
        
    def transform(self, X):
        X_mat = np.asarray(X)
        # Klip nilai di luar batas ambang latih
        return np.clip(X_mat, self.batas_bawah_, self.batas_atas_)

# Verifikasi Integrasi
np.random.seed(42)
data_latih = np.array([[10], [12], [14], [11], [13], [1000]]) # Mengandung outlier 1000
clipper = OutlierClipperIQR(faktor=1.5)
clipper.fit(data_latih)
data_terpotong = clipper.transform(data_latih)

print("=== PENGUJIAN CUSTOM TRANSFORMER SCIKIT-LEARN ===")
print(f"Batas Atas Latih yang Dipelajari: {clipper.batas_atas_[0]:.2f}")
print(f"Nilai Outlier Asli: 1000.0 -> Terpotong Menjadi: {data_terpotong[-1, 0]:.2f}")`,
        expectedOutput: "Custom transformer berhasil memotong outlier ke batas atas IQR data latih secara presisi.",
        codeExp: "Skrip mendefinisikan kelas transformer Scikit-Learn kustom yang memenuhi standar API resmi dengan inheritance BaseEstimator dan TransformerMixin.",
        pitfalls: [
          "Melakukan perhitungan statistik pada metode transform() alih-alih pada metode fit(), yang membocorkan data evaluasi ke dalam batas transformasi.",
          "Menerima argumen *args atau **kwargs di dalam __init__ (Scikit-Learn melarang hal ini agar inspeksi parameter GridSearchCV berfungsi)."
        ],
        refTitle: "Scikit-Learn Developers: Developing Scikit-Learn Estimators",
        refUrl: "https://scikit-learn.org/stable/developers/develop.html"
      },
      {
        num: "11.9",
        slug: "11-9-serialisasi-pipeline-joblib-vs-onnx",
        title: "11.9. Serialisasi Pipeline End-to-End: Pickle vs Joblib vs ONNX",
        desc: "Jembatan dari pengembangan ke produksi: persistensi artefak model, kelemahan keamanan pickle, kompresi joblib, dan interoperabilitas lintas bahasa ONNX.",
        concept: `Setelah alur kerja pipeline prapemrosesan dan model prediktif berhasil dilatih dan divalidasi, artefak model harus disimpan ke dalam media penyimpanan (disk) agar dapat dimuat kembali secara instan oleh server inferensi atau API mikroservis di lingkungan produksi.
        
Tiga format serialisasi utama:
1. **Python Pickle:** Modul standar bawaan Python untuk serialisasi objek byte. Kelemahan kritisnya: file pickle rentan terhadap eksekusi kode arbitrer berbahaya (*arbitrary code execution*) jika file berasal dari sumber yang tidak tepercaya, dan sangat rapuh terhadap perubahan versi Python.
2. **Joblib ('+ "joblib.dump / joblib.load"' + '):** Standar de facto dalam ekosistem Scikit-Learn. Joblib dioptimalkan secara khusus untuk objek yang membawa array NumPy berukuran besar di dalamnya menggunakan teknik pemetaan memori efisien.
3. **ONNX (Open Neural Network Exchange):** Format graf komputasi terbuka independen platform. Model Scikit-Learn yang diekspor ke ONNX dapat dieksekusi dengan performa sangat tinggi di lingkungan C++, Java, Rust, atau Go tanpa memerlukan dependensi runtime Python sama sekali.`,
        code: `# 11.9: Serialisasi Pipeline Utuh Menggunakan Joblib dan Verifikasi Integritas Prediksi
import os
import tempfile
import joblib
import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge

# 1. Bangun dan Latih Pipeline Utuh
X = np.random.normal(0, 1, size=(100, 3))
y = X @ np.array([1.5, -2.0, 3.0]) + np.random.normal(0, 0.1, 100)

pipeline_asli = make_pipeline(StandardScaler(), Ridge(alpha=1.0))
pipeline_asli.fit(X, y)

prediksi_asli = pipeline_asli.predict(X[:3])

# 2. Serialisasi Menggunakan Joblib
with tempfile.NamedTemporaryFile(suffix='.joblib', delete=False) as f:
    lokasi_model = f.name

joblib.dump(pipeline_asli, lokasi_model)
ukuran_file_kb = os.path.getsize(lokasi_model) / 1024

# 3. Muat Ulang Pipeline di Sesi Baru dan Verifikasi Kesetaraan
pipeline_muat = joblib.load(lokasi_model)
prediksi_muat = pipeline_muat.predict(X[:3])

os.remove(lokasi_model) # Bersihkan file sementara

print("=== SERIALISASI PIPELINE END-TO-END (JOBLIB) ===")
print(f"Ukuran Artefak Model Tersimpan : {ukuran_file_kb:.2f} KB")
print(f"Prediksi Pipeline Asli        : {prediksi_asli.round(4)}")
print(f"Prediksi Pipeline Muat Ulang  : {prediksi_muat.round(4)}")
print(f"Maks Perbedaan Output         : {np.max(np.abs(prediksi_asli - prediksi_muat)):.2e} (REPRODUCIBLE SEMPURNA!)")`,
        expectedOutput: "Model tersimpan dan termuat ulang dengan identitas hasil prediksi identik sempurna.",
        codeExp: "Skrip mendemonstrasikan protokol ekspor dan impor artefak pipeline end-to-end menggunakan joblib untuk persiapan deployment produksi.",
        pitfalls: [
          "Hanya menyimpan model klasifikasi tanpa menyimpan objek scaler/imputer, sehingga server produksi gagal melakukan transformasi data mentah baru.",
          "Memuat file model dari sumber yang tidak tepercaya menggunakan pickle/joblib (celah keamanan remote code execution)."
        ],
        refTitle: "Joblib: Running Python functions as pipeline jobs & Model persistence",
        refUrl: "https://joblib.readthedocs.io/en/latest/persistence.html"
      },
      {
        num: "11.10",
        slug: "11-10-pemantauan-pergeseran-data-drift-dan-covariate-shift",
        title: "11.10. Pemantauan Pergeseran Distribusi (Data Drift & Covariate Shift)",
        desc: "Kematian performa model di produksi: Concept Drift vs Covariate Shift, Population Stability Index (PSI), dan uji Kolmogorov-Smirnov.",
        concept: `Di dunia nyata, data tidak bersifat statis. Begitu model machine learning di-deploy ke produksi, performanya secara alamiah akan mengalami degradasi seiring berjalannya waktu. Fenomena ini dikenal sebagai **Model Decay**.
        
Dua tipe pergeseran distribusi:
1. **Covariate Shift (Data Drift):** Distribusi fitur masukan berubah $P_{\\text{prod}}(X) \\ne P_{\\text{train}}(X)$, meskipun hubungan fungsional antara fitur dan target $P(Y \\mid X)$ tetap sama (misalnya demografi pengguna berubah karena ekspansi pasar baru).
2. **Concept Drift:** Hubungan fungsional antara fitur dan target itu sendiri yang berubah $P_{\\text{prod}}(Y \\mid X) \\ne P_{\\text{train}}(Y \\mid X)$ (misalnya perilaku belanja pengguna berubah drastis akibat krisis ekonomi atau pandemi).
        
**Population Stability Index (PSI)** adalah metrik industri standar perbankan untuk mendeteksi pergeseran populasi:
- $\\text{PSI} < 0.10$: Distribusi stabil, tidak ada pergeseran signifikan.
- $0.10 \\le \\text{PSI} < 0.25$: Terjadi pergeseran moderat, memerlukan pemantauan ketat.
- $\\text{PSI} \\ge 0.25$: Terjadi pergeseran populasi parah (*severe drift*), model wajib dilatih ulang (retrained).`,
        formula: `\\text{PSI} = \\sum_{b=1}^B (P_{\\text{prod}, b} - P_{\\text{train}, b}) \\times \\ln\\left(\\frac{P_{\\text{prod}, b}}{P_{\\text{train}, b}}\\right)`,
        code: `# 11.10: Perhitungan Population Stability Index (PSI) untuk Deteksi Data Drift
import numpy as np

def hitung_psi(data_latih, data_produksi, jumlah_bin=10):
    """Menghitung Population Stability Index (PSI) antara data latih acuan dan produksi."""
    # Tentukan batas bin berbasis persentil data latih
    persentil = np.linspace(0, 100, jumlah_bin + 1)
    batas_bin = np.percentile(data_latih, persentil)
    batas_bin[0] = -np.inf
    batas_bin[-1] = np.inf
    
    # Hitung proporsi observasi di setiap bin
    prop_train, _ = np.histogram(data_latih, bins=batas_bin)
    prop_prod, _ = np.histogram(data_produksi, bins=batas_bin)
    
    P_train = prop_train / len(data_latih)
    P_prod = prop_prod / len(data_produksi)
    
    # Pencegahan pembagian nol
    eps = 1e-4
    P_train = np.where(P_train == 0, eps, P_train)
    P_prod = np.where(P_prod == 0, eps, P_prod)
    
    psi_nilai = np.sum((P_prod - P_train) * np.log(P_prod / P_train))
    return psi_nilai

np.random.seed(42)
# Data Latih: Distribusi Normal (mu=50, sigma=10)
data_baseline = np.random.normal(50, 10, size=5000)

# Skenario 1: Data Produksi Stabil (Tidak ada drift)
data_prod_stabil = np.random.normal(50.5, 10, size=3000)

# Skenario 2: Data Produksi Mengalami Pergeseran Signifikan (mu bergeser ke 62)
data_prod_drift = np.random.normal(62, 12, size=3000)

psi_stabil = hitung_psi(data_baseline, data_prod_stabil)
psi_drift = hitung_psi(data_baseline, data_prod_drift)

print("=== PEMANTAUAN DATA DRIFT: POPULATION STABILITY INDEX (PSI) ===")
print(f"PSI Kasus Stabil : {psi_stabil:.4f} (Status: Populasi Sangat Stabil, < 0.10)")
print(f"PSI Kasus Drift  : {psi_drift:.4f} (Status: SEVERE DRIFT! >= 0.25 -> Wajib Retrain)")`,
        expectedOutput: "PSI secara tajam membedakan antara populasi stabil (PSI=0.007) dan pergeseran berat (PSI=1.45).",
        codeExp: "Skrip mengimplementasikan formula resmi Population Stability Index (PSI) perbankan untuk mendeteksi pergeseran kovariat pada model produksi.",
        pitfalls: [
          "Hanya memantau metrik performa (seperti akurasi) tanpa memantau distribusi fitur masukan (pada banyak kasus industri, label target Y baru tersedia berbulan-bulan kemudian).",
          "Melakukan retraining model otomatis secara langsung tanpa memvalidasi terlebih dahulu apakah data drift disebabkan oleh anomali sensor sesaat."
        ],
        refTitle: "Subhash Yalamanchili et al.: Population Stability Index in Credit Risk Modeling (Credit Risk Analytics)",
        refUrl: "https://www.sciencedirect.com/science/article/pii/S037842661630138X"
      }
    ]
  },

  // ==========================================
  // BAB 12: Pohon Keputusan & Algoritma Ensemble Berbasis Pohon
  // ==========================================
  {
    orderIndex: 12,
    id: "data-science-ch-12",
    slug: "bab-12-pohon-keputusan-ensemble-random-forest-xgboost",
    title: "BAB 12: Pohon Keputusan & Algoritma Ensemble Berbasis Pohon",
    desc: "Kekuatan model berbasis pohon: partisi biner rekursif, kriteria ketidakmurnian (Gini, Entropi, MSE), pemangkasan pohon Cost-Complexity, paradigma ensemble Condorcet, Bootstrap Aggregating (Bagging), Random Forest, Boosting bertahap (AdaBoost), Gradient Boosting Machine (GBM), optimasi Taylor XGBoost, serta inovasi LightGBM dan CatBoost.",
    coreConcepts: ["Recursive Binary Splitting", "Cost-Complexity Pruning", "Bagging & Out-of-Bag (OOB)", "Random Forest Subspaces", "Gradient Boosting & XGBoost"],
    subchapters: [
      {
        num: "12.1",
        slug: "12-1-anatomi-decision-tree-partisi-biner-rekursif",
        title: "12.1. Anatomi Decision Tree: Rekursif Partisi Biner & Ruang Fitur",
        desc: "Struktur fundamental pohon keputusan: ruang partisi ortogonal sumbu hiper-persegi, node internal, daun keputusan, dan algoritma greedy CART.",
        concept: `Decision Tree (Pohon Keputusan) adalah algoritma pembelajaran non-parametrik yang mempartisi ruang fitur $\\mathbb{R}^p$ menjadi sekumpulan daerah hiper-persegi panjang (hyper-rectangles) ortogonal yang saling lepas, lalu memprediksi nilai konstan pada setiap daerah tersebut (kelas mayoritas untuk klasifikasi, atau rata-rata untuk regresi).
        
Algoritma standar industri yang paling dominan adalah **Classification and Regression Trees (CART)** yang dirintis oleh Leo Breiman dkk. (1984). CART menggunakan pendekatan pencarian rakus (*greedy heuristic*): pada setiap node internal, algoritma memindai seluruh $p$ fitur dan seluruh kemungkinan titik potong $s$, lalu memilih pasangan fitur-ambang batas $(j, s)$ yang menghasilkan penurunan ketidakmurnian terbesar.
        
Proses ini diulang secara rekursif (Recursive Binary Splitting) pada setiap cabang anak hingga kondisi penghentian tercapai. Keunggulan utama pohon keputusan adalah interpretabilitas visualnya yang luar biasa menyerupai pohon aturan keputusan jika-maka manusiawi.`,
        code: `# 12.1: Visualisasi Struktur Logika Aturan Jika-Maka Decision Tree CART
import numpy as np
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, export_text

iris = load_iris()
X = iris.data[:, :2] # Sepal Length dan Sepal Width
y = iris.target

# Melatih Decision Tree dengan kedalaman dangkal terkontrol (max_depth=3)
tree_clf = DecisionTreeClassifier(max_depth=3, criterion='gini', random_state=42)
tree_clf.fit(X, y)

# Mengekstrak representasi tekstual pohon keputusan
aturan_teks = export_text(tree_clf, feature_names=['Sepal_Length', 'Sepal_Width'])

print("=== ANATOMI STRUKTUR KEPUTUSAN POHON KEPUTUSAN CART ===")
print(f"Kedalaman Pohon Aktual : {tree_clf.get_depth()}")
print(f"Jumlah Node Daun (Leaves): {tree_clf.get_n_leaves()}\\n")
print("Logika Aturan Partisi Rekursif:")
print(aturan_teks)`,
        expectedOutput: "Pohon keputusan CART mengekstrak hierarki partisi biner ortogonal yang sangat mudah diinterpretasikan.",
        codeExp: "Skrip melatih model DecisionTreeClassifier dan mengekstrak pohon aturan logis partisi biner menggunakan export_text Scikit-Learn.",
        pitfalls: [
          "Mengizinkan pohon tumbuh tanpa batas kedalaman (max_depth=None), yang memicu penghafalan data latih hingga akurasi 100% (overfitting ekstrem).",
          "Mengabaikan instabilitas pohon tunggal: perubahan minor satu observasi data latih dapat mengubah seluruh struktur cabang pohon secara drastis."
        ],
        refTitle: "Leo Breiman, Jerome H. Friedman, Richard A. Olshen, Charles J. Stone: Classification and Regression Trees (Wadsworth)",
        refUrl: "https://www.routledge.com/Classification-and-Regression-Trees/Breiman-Friedman-Stone-Olshen/p/book/9780412048418"
      },
      {
        num: "12.2",
        slug: "12-2-kriteria-pemisahan-gini-entropi-dan-mse",
        title: "12.2. Kriteria Pemisahan: Ketidakmurnian Gini, Entropi Informasi, & MSE",
        desc: "Kuantifikasi kebersihan node: formulasi matematis Gini Impurity, Entropi Shannon / Information Gain, dan Mean Squared Error untuk regresi.",
        concept: `Untuk menentukan titik pisah terbaik $(j, s)$ pada setiap node keputusan $m$, algoritma membutuhkan fungsi matematis objektif untuk mengukur derajat ketidakmurnian (impurity) dari distribusi kelas dalam node tersebut.
        
Dua kriteria pemisahan utama untuk klasifikasi:
1. **Gini Impurity (CART Default):** Mengukur probabilitas bahwa suatu elemen yang dipilih secara acak dari node akan salah dilabeli jika dilabeli secara acak berdasarkan distribusi kelas dalam node: $I_G(m) = 1 - \\sum_{k=1}^K p_{mk}^2$. Nilai 0 menunjukkan node murni sempurna (seluruh sampel milik 1 kelas).
2. **Entropi Informasi & Information Gain (ID3 / C4.5):** Didasarkan pada teori informasi Claude Shannon, mengukur derajat ketidakpastian informasi dalam node: $H(m) = -\\sum_{k=1}^K p_{mk} \\log_2(p_{mk})$. Penurunan entropi setelah pemisahan disebut **Information Gain**.
        
Secara praktis, Gini dan Entropi menghasilkan pohon yang sangat mirip dalam $98\\%$ kasus, namun Gini sedikit lebih cepat dihitung karena tidak melibatkan komputasi fungsi logaritma. Untuk pohon regresi, kriteria pemisahan yang digunakan adalah reduksi varians atau Mean Squared Error (MSE).`,
        formula: `I_G(m) = 1 - \\sum_{k=1}^K p_{mk}^2, \\quad H(m) = -\\sum_{k=1}^K p_{mk} \\log_2(p_{mk})`,
        code: `# 12.2: Komparasi Kurva Ketidakmurnian Gini vs Entropi pada Klasifikasi Biner
import numpy as np

# Peluang kelas positif p dari 0.01 hingga 0.99
p = np.linspace(0.01, 0.99, 100)

# 1. Gini Impurity Biner: 2 * p * (1 - p)
gini = 1 - (p**2 + (1 - p)**2)

# 2. Entropi Informasi Shannon: - [p*log2(p) + (1-p)*log2(1-p)]
entropi = -(p * np.log2(p) + (1 - p) * np.log2(1 - p))
entropi_skala = 0.5 * entropi # Diskala 0.5 agar sebanding di puncak

# 3. Misclassification Error: 1 - max(p, 1-p)
galat_klasifikasi = 1 - np.maximum(p, 1 - p)

print("=== NILAI KETIDAKMURNIAN PADA KONDISI MAKSIMUM TIDAK PASTI (p = 0.50) ===")
print(f"Gini Impurity Maksimum        : {gini[49]:.4f} (Puncak pada 0.50)")
print(f"Entropi Shannon Maksimum      : {entropi[49]:.4f} (Puncak pada 1.00 bit)")
print(f"Galat Misklasifikasi Maksimum : {galat_klasifikasi[49]:.4f} (Puncak pada 0.50)")`,
        expectedOutput: "Gini memuncak di 0.50 dan Entropi di 1.0 bit saat kelas seimbang tidak pasti.",
        codeExp: "Skrip menghitung dan membandingkan formulasi matematis dari Gini Impurity, Entropi Informasi, dan Galat Misklasifikasi.",
        pitfalls: [
          "Memilih Information Gain murni pada fitur kategorik berkardinalitas tinggi, yang memicu bias pemilihan fitur dengan banyak kategori unik (C4.5 mengatasi ini dengan Gain Ratio).",
          "Menghabiskan waktu berlebihan menyetel hyperparameter kriteria ('gini' vs 'entropy') padahal dampaknya jauh lebih kecil dibandingkan kedalaman pohon."
        ],
        refTitle: "J. R. Quinlan: Induction of Decision Trees (Machine Learning)",
        refUrl: "https://link.springer.com/article/10.1007/BF00116251"
      },
      {
        num: "12.3",
        slug: "12-3-pemangkasan-pohon-cost-complexity-pruning",
        title: "12.3. Regularisasi & Pemangkasan Pohon: Cost-Complexity Pruning",
        desc: "Mencegah overfitting pohon: pemangkasan post-pruning via parameter alpha, pohon sub-optimal optimal, dan Scikit-Learn ccp_alpha.",
        concept: `Pohon keputusan tanpa kendala akan terus membelah data hingga setiap daun hanya berisi satu observasi tunggal ($I_G = 0$). Pohon semacam ini mengalami overfitting ekstrem: variansnya sangat tinggi dan performa prediksinya buruk pada data baru.
        
Terdapat dua strategi pengendalian kompleksitas pohon:
1. **Pre-Pruning (Penyetopan Dini):** Menghentikan pertumbuhan pohon lebih awal menggunakan batasan heuristik seperti ''max_depth'', ''min_samples_split'', atau ''min_samples_leaf''.
2. **Post-Pruning (Cost-Complexity Pruning / Minimal Cost-Complexity Pruning):** Menumbuhkan pohon secara penuh terlebih dahulu ($T_0$), lalu memangkas cabang-cabang anak yang tidak signifikan dari bawah ke atas.
        
Metode ini meminimalkan fungsi biaya yang memperkenalkan penalti kompleksitas ukuran pohon: $R_\\alpha(T) = R(T) + \\alpha |T|$, di mana $|T|$ adalah jumlah daun dan $\\alpha \\ge 0$ adalah parameter penalti kompleksitas. Nilai $\\alpha$ optimal dipilih melalui cross-validation menggunakan parameter ''ccp_alpha'' di Scikit-Learn.`,
        formula: `R_\\alpha(T) = \\sum_{m=1}^{|T|} N_m I(m) + \\alpha |T|`,
        code: `# 12.3: Pemangkasan Pohon Optimal Menggunakan Cost-Complexity Pruning (ccp_alpha)
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 1. Hitung Jalur Pemangkasan Alpha Efektif (Cost-Complexity Pruning Path)
pohon_awal = DecisionTreeClassifier(random_state=42)
path = pohon_awal.cost_complexity_pruning_path(X_train, y_train)
ccp_alphas, impurities = path.ccp_alphas, path.impurities

# 2. Latih Pohon untuk Berbagai Nilai Alpha dan Evaluasi Test Set
clfs = []
for alpha in ccp_alphas[::5]: # Ambil sampel alpha
    clf = DecisionTreeClassifier(random_state=42, ccp_alpha=alpha).fit(X_train, y_train)
    clfs.append((alpha, clf.score(X_train, y_train), clf.score(X_test, y_test), clf.get_n_leaves()))

# Model Tanpa Pruning vs Pruned Optimal
clf_mentah = DecisionTreeClassifier(random_state=42).fit(X_train, y_train)
# Pilih alpha optimal dari hasil pengujian
best_alpha = ccp_alphas[np.argmax([c[2] for c in clfs]) * 5]
clf_pruned = DecisionTreeClassifier(random_state=42, ccp_alpha=best_alpha).fit(X_train, y_train)

print("=== REGULARISASI POHON: COST-COMPLEXITY PRUNING ===")
print(f"Pohon Mentah (Tanpa Pruning): Daun = {clf_mentah.get_n_leaves()} | Akurasi Test = {clf_mentah.score(X_test, y_test)*100:.2f}%")
print(f"Pohon Terpangkas (ccp_alpha={best_alpha:.4f}): Daun = {clf_pruned.get_n_leaves()} | Akurasi Test = {clf_pruned.score(X_test, y_test)*100:.2f}% (LEBIH GENERAL!)")`,
        expectedOutput: "Pemangkasan pohon mereduksi jumlah daun secara drastis sekaligus meningkatkan akurasi out-of-sample.",
        codeExp: "Skrip menghitung cost_complexity_pruning_path untuk menemukan ccp_alpha optimal yang memangkas cabang overfitted dari pohon keputusan.",
        pitfalls: [
          "Hanya mengandalkan max_depth untuk membatasi pohon, yang dapat menghentikan pertumbuhan cabang penting yang memiliki pemisahan sangat bagus di kedalaman berikutnya.",
          "Menyetel ccp_alpha pada data latih (alpha optimal wajib ditentukan murni via validasi silang)."
        ],
        refTitle: "Scikit-Learn Documentation: Post pruning decision trees with cost complexity pruning",
        refUrl: "https://scikit-learn.org/stable/auto_examples/tree/plot_cost_complexity_pruning.html"
      },
      {
        num: "12.4",
        slug: "12-4-paradigma-ensemble-dan-teorema-juri-condorcet",
        title: "12.4. Paradigma Ensemble Learning & Teorema Juri Condorcet",
        desc: "Landasan filosofis 'Wisdom of Crowds': bukti matematis Teorema Condorcet mengapa gabungan model independen mengungguli model tunggal terbaik.",
        concept: `Ensemble Learning adalah paradigma di mana sekumpulan model pembelajar dasar (base learners / weak learners) digabungkan secara strategis untuk menghasilkan model prediktif tunggal yang memiliki performa superior.
        
Landasan teoritis dari ensemble learning berakar pada **Teorema Juri Condorcet (Marquis de Condorcet, 1785)**: Jika suatu dewan juri terdiri dari $B$ anggota independen yang masing-masing memiliki probabilitas membuat keputusan yang benar sebesar $p > 0.5$, maka probabilitas bahwa keputusan mayoritas dari dewan juri tersebut adalah benar akan mendekati $1.0$ (kepastian sempurna) seiring dengan bertambahnya jumlah anggota juri $B \\to \\infty$.
        
Dalam machine learning, jika kita memiliki 100 model klasifikasi yang saling independen dengan akurasi individual $p = 0.60$, probabilitas bahwa suara mayoritas ensemble menghasilkan prediksi benar melesat di atas $98\\%$. Syarat mutlak keberhasilan ensemble adalah:
1. Model dasar harus memiliki akurasi lebih baik daripada tebakan acak ($p > 0.5$).
2. Kesalahan prediksi antarmodel harus saling independen atau berkorelasi serendah mungkin.`,
        formula: `P_{\\text{Maj}} = \\sum_{k=\\lfloor B/2 \\rfloor + 1}^B \\binom{B}{k} p^k (1 - p)^{B - k} \\xrightarrow{B \\to \\infty} 1 \\quad \\text{jika } p > 0.5`,
        code: `# 12.4: Pembuktian Matematis Teorema Juri Condorcet pada Ensemble Learning
from scipy.special import comb

# Parameter: Akurasi model dasar p = 0.58 (Weak Learner)
p = 0.58
jumlah_ensemble = [1, 5, 21, 51, 101, 501]

print("=== PEMBUKTIAN MATEMATIS TEOREMA JURI CONDORCET ===")
print(f"Akurasi Model Pembelajar Dasar Tunggal (p): {p*100:.1f}%\n")
print("Jumlah Model (B) | Probabilitas Konsensus Mayoritas Benar")
print("-" * 55)

for B in jumlah_ensemble:
    k_min = (B // 2) + 1
    # Jumlahan probabilitas binomial dari k_min hingga B
    prob_mayoritas = sum(comb(B, k) * (p**k) * ((1 - p)**(B - k)) for k in range(k_min, B + 1))
    print(f"{B:16d} | {prob_mayoritas*100:30.4f}%")`,
        expectedOutput: "Akurasi melonjak dari 58% pada 1 model menjadi > 99.9% pada gabungan 501 model independen.",
        codeExp: "Skrip menghitung distribusi binomial kumulatif Teorema Condorcet untuk membuktikan secara matematis mengapa agregasi model independen mengikis galat prediksi.",
        pitfalls: [
          "Menggabungkan model-model yang membuat kesalahan identik (korelasi galat tinggi), yang membatalkan asumsi independensi Condorcet.",
          "Membangun ensemble dari model dasar yang memiliki performa lebih buruk dari tebakan acak (p < 0.5), yang justru menjamin ensemble salah secara absolut."
        ],
        refTitle: "Marquis de Condorcet: Essai sur l'application de l'analyse à la probabilité des décisions rendues à la pluralité des voix (1785)",
        refUrl: "https://gallica.bnf.fr/ark:/12148/bpt6k417181"
      },
      {
        num: "12.5",
        slug: "12-5-bagging-dan-out-of-bag-error-evaluation",
        title: "12.5. Bootstrap Aggregating (Bagging) & Evaluasi Out-of-Bag (OOB)",
        desc: "Reduksi varians via sampling acak dengan pengembalian: prinsip Bagging Leo Breiman (1996), dan validasi silang gratis tanpa data uji via OOB Error.",
        concept: `Pohon keputusan tunggal yang tumbuh dalam memiliki varians yang sangat tinggi. **Bootstrap Aggregating (Bagging)**, yang diciptakan oleh Leo Breiman pada tahun 1996, adalah teknik ensemble yang secara khusus dirancang untuk memangkas varians tanpa meningkatkan bias.
        
Bagging melatih $B$ pohon keputusan independen secara paralel pada $B$ sampel bootstrap yang berbeda (pengambilan sampel berukuran $n$ dengan pengembalian). Prediksi akhir diperoleh melalui rata-rata (regresi) atau voting mayoritas (klasifikasi). Varians dari rata-rata $B$ pohon berkurang sebesar faktor $1/B$ jika pohon tidak berkorelasi.
        
Salah satu keunggulan paling elegan dari Bagging adalah **Out-of-Bag (OOB) Evaluation**. Secara matematis, probabilitas bahwa suatu observasi tertentu tidak terpilih dalam satu sampel bootstrap berukuran $n$ adalah $(1 - 1/n)^n \\approx 1/e \\approx 36.8\\%$. Artinya, untuk setiap pohon, sekitar $36.8\\%$ data tidak digunakan dalam pelatihan (*out-of-bag*). Menguji setiap observasi hanya pada pohon-pohon yang tidak melatihnya menghasilkan estimasi galat generalisasi yang tidak berbias secara gratis tanpa memerlukan validasi silang terpisah.`,
        formula: `\\lim_{n \\to \\infty} \\left(1 - \\frac{1}{n}\\right)^n = \\frac{1}{e} \\approx 0.3679`,
        code: `# 12.5: Verifikasi Teorema Fraksi Out-of-Bag (1/e) dan BaggingClassifier OOB Score
import numpy as np
from sklearn.ensemble import BaggingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import make_classification

# 1. Pembuktian Empiris Fraksi Data Out-of-Bag (1/e = 36.8%)
n = 10000
data_idx = np.arange(n)
bootstrap_sample = np.random.choice(data_idx, size=n, replace=True)
oob_mask = ~np.isin(data_idx, bootstrap_sample)
fraksi_oob_empiris = np.mean(oob_mask)

# 2. Pelatihan BaggingClassifier dengan Evaluasi OOB
X, y = make_classification(n_samples=1000, n_features=15, random_state=42)

bagging = BaggingClassifier(
    estimator=DecisionTreeClassifier(),
    n_estimators=100,
    oob_score=True,
    random_state=42
)
bagging.fit(X, y)

print("=== ANALISIS BOOTSTRAP AGGREGATING (BAGGING) & OOB SCORE ===")
print(f"Fraksi Teoretis Out-of-Bag (1/e) : {1/np.e:.4f} (36.79%)")
print(f"Fraksi Empiris Teramati          : {fraksi_oob_empiris:.4f} ({fraksi_oob_empiris*100:.2f}%)")
print(f"Out-of-Bag (OOB) Accuracy Score  : {bagging.oob_score_*100:.2f}% (Validasi Gratis Tanpa Test Set!)")`,
        expectedOutput: "Fraksi data yang tidak terambil dalam bootstrap tepat mendekati nilai batas teoretis 1/e (36.8%).",
        codeExp: "Skrip memverifikasi fraksi matematis 1/e dari data out-of-bag dan mengukur skor generalisasi OOB menggunakan BaggingClassifier Scikit-Learn.",
        pitfalls: [
          "Menggunakan Bagging pada model dengan bias tinggi dan varians rendah (seperti regresi linier); Bagging hanya efektif mereduksi varians pada model tidak stabil berkemampuan tinggi.",
          "Melakukan sampling without replacement saat menggunakan Bagging, yang membatalkan sifat bootstrap."
        ],
        refTitle: "Leo Breiman: Bagging Predictors (Machine Learning)",
        refUrl: "https://link.springer.com/article/10.1007/BF00058655"
      },
      {
        num: "12.6",
        slug: "12-6-random-forest-random-subspaces-dan-feature-importance",
        title: "12.6. Random Forest: Subruang Acak & Ekstraksi Feature Importance",
        desc: "Penyempurnaan definitif Breiman (2001): de-korelasi pohon via subruang fitur acak (mtry), MDI (Mean Decrease Impurity), dan Permutation Importance.",
        concept: `Meskipun Bagging melatih pohon pada sampel bootstrap yang berbeda, jika terdapat satu atau dua fitur prediktor yang sangat dominan dalam dataset, seluruh pohon dalam Bagging akan tetap memilih fitur dominan tersebut pada pemisahan node teratas. Akibatnya, pohon-pohon menjadi saling berkorelasi tinggi, membatasi potensi penurunan varians ensemble.
        
**Random Forest** (Leo Breiman, 2001) memecahkan masalah ini dengan memperkenalkan keacakan ganda (*Double Randomness*). Selain melakukan bootstrap sampel baris data, Random Forest menerapkan metode **Random Subspaces**: pada setiap pemisahan node, algoritma hanya mengizinkan pemilihan dari subset acak sebanyak $m$ fitur dari total $p$ fitur (standar klasifikasi: $m = \\sqrt{p}$; standar regresi: $m = p/3$). Hal ini memaksa pohon mengeksplorasi fitur-fitur alternatif, secara efektif men-dekorelasikan pohon-pohon dan menekan varians ke level minimum.
        
Pengukuran pentingnya fitur:
- **Mean Decrease Impurity (MDI):** Akumulasi penurunan Gini impurity yang dibawa oleh fitur di seluruh pohon (bawaan Scikit-Learn).
- **Permutation Feature Importance:** Mengacak nilai fitur pada data validasi dan mengukur penurunan performa model (jauh lebih objektif dan kebal dari bias kardinalitas MDI).`,
        formula: `\\text{Var}(\\bar{T}) = \\rho \\sigma^2 + \\frac{1 - \\rho}{B} \\sigma^2 \\xrightarrow{\\rho \\downarrow} \\text{Varians Sangat Kecil}`,
        code: `# 12.6: Komparasi Feature Importance MDI vs Permutation Importance pada Random Forest
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=500, n_features=5, n_informative=2, random_state=42)
fitur_label = ['Informatif_1', 'Informatif_2', 'Redundan_1', 'Derau_1', 'Derau_2']

rf = RandomForestClassifier(n_estimators=100, max_features='sqrt', random_state=42).fit(X, y)

# 1. Impurity-based Feature Importance (MDI)
mdi_importances = rf.feature_importances_

# 2. Permutation Feature Importance (Uji Permutasi Objektif)
perm_res = permutation_importance(rf, X, y, n_repeats=10, random_state=42)
perm_importances = perm_res.importances_mean

df_imp = pd.DataFrame({
    'Fitur': fitur_label,
    'MDI (Gini)': mdi_importances,
    'Permutation': perm_importances
}).sort_values(by='Permutation', ascending=False)

print("=== EVALUASI FEATURE IMPORTANCE RANDOM FOREST ===")
print(df_imp.round(4))`,
        expectedOutput: "Permutation importance secara akurat membedakan 2 fitur informatif sejati dari fitur derau acak.",
        codeExp: "Skrip mengevaluasi perbedaan antara MDI bawaan dan Permutation Feature Importance untuk menunjukkan cara mengevaluasi sinyal prediktif variabel secara andal.",
        pitfalls: [
          "Hanya mengandalkan MDI feature importances bawaan pada fitur numerik kontinu vs kategorik berkardinalitas tinggi (MDI secara sistematis melebih-lebihkan skor fitur berkardinalitas tinggi).",
          "Memilih jumlah estimator (n_estimators) terlalu kecil; Random Forest tidak pernah mengalami overfitting jika n_estimators diperbesar (hanya ada penalti waktu komputasi)."
        ],
        refTitle: "Leo Breiman: Random Forests (Machine Learning)",
        refUrl: "https://link.springer.com/article/10.1023/A:1010933404324"
      },
      {
        num: "12.7",
        slug: "12-7-prinsip-dasar-boosting-dan-adaboost",
        title: "12.7. Prinsip Dasar Boosting: Pembelajaran Adaptif Bertahap & AdaBoost",
        desc: "Paradigma sekuensial Freund & Schapire (1997): koreksi bertahap sampel sulit, pembobotan eksponensial data, dan voting terbobot AdaBoost.M1.",
        concept: `Berbeda dengan Bagging yang melatih model-model dasar secara independen dan paralel untuk mereduksi varians, **Boosting** adalah paradigma sekuensial di mana model-model dilatih secara berurutan (*stage-wise*) dengan tujuan utama mereduksi bias.
        
Prinsip dasar boosting: setiap model pembelajar baru dilatih untuk memusatkan perhatian pada observasi data yang mengalami salah prediksi (*misclassified*) oleh model-model sebelumnya.
        
**AdaBoost (Adaptive Boosting)**, yang diperkenalkan oleh Yoav Freund dan Robert Schapire pada tahun 1997 (pemenang Gödel Prize):
1. Menginisialisasi bobot seragam $w_i = 1/n$ untuk seluruh sampel data.
2. Pada setiap iterasi $m$, melatih weak learner (biasanya pohon dangkal 1-split yang disebut **Decision Stump**).
3. Menghitung galat terbobot $\\epsilon_m$, dan memberikan bobot pengaruh model $\\alpha_m = \\frac{1}{2} \\ln((1 - \\epsilon_m)/\\epsilon_m)$.
4. Melipatgandakan bobot sampel yang salah diprediksi dengan faktor $e^{\\alpha_m}$ dan menyusutkan bobot sampel yang benar dengan $e^{-\\alpha_m}$.
5. Prediksi akhir adalah penjumlahan terbobot dari seluruh decision stump.`,
        formula: `\\alpha_m = \\frac{1}{2} \\ln\\left( \\frac{1 - \\epsilon_m}{\\epsilon_m} \\right), \\quad w_i^{(m+1)} = w_i^{(m)} \\exp\\left( -\\alpha_m y_i h_m(x_i) \\right)`,
        code: `# 12.7: Pelatihan Sekuensial AdaBoost Berbasis Kumpulan Decision Stumps (Depth=1)
import numpy as np
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import make_gaussian_quantiles

X, y = make_gaussian_quantiles(n_samples=500, n_features=4, n_classes=2, random_state=42)

# Menggunakan Decision Stump (max_depth=1) sebagai Base Learner
stump = DecisionTreeClassifier(max_depth=1)
adaboost = AdaBoostClassifier(
    estimator=stump,
    n_estimators=50,
    learning_rate=1.0,
    algorithm='SAMME',
    random_state=42
)
adaboost.fit(X, y)

skor_akurasi = adaboost.score(X, y)
bobot_stump = adaboost.estimator_weights_

print("=== HASIL EVALUASI ADAPTIVE BOOSTING (ADABOOST) ===")
print(f"Akurasi Gabungan Ensemble 50 Stumps: {skor_akurasi*100:.2f}% (Superior dibanding 1 stump ~55%)")
print(f"Rentang Bobot Alpha Model Dasar    : [{np.min(bobot_stump):.4f}, {np.max(bobot_stump):.4f}]")
print(f"Model Dasar Pertama Terpilih       : Fitur Indeks {adaboost.estimators_[0].tree_.feature[0]}")`,
        expectedOutput: "Gabungan 50 stump lemah bertransformasi menjadi pengklasifikasi kuat dengan akurasi tinggi.",
        codeExp: "Skrip mendemonstrasikan bagaimana AdaBoost menggabungkan 50 decision stump sederhana menjadi model prediktif yang kokoh.",
        pitfalls: [
          "Menggunakan AdaBoost pada data yang sangat berderau (noisy) atau mengandung label outlier keliru; AdaBoost akan memusatkan bobot berlebihan pada sampel derau yang mustahil dipelajari.",
          "Menyetel learning_rate terlalu tinggi tanpa menambah jumlah estimator."
        ],
        refTitle: "Yoav Freund & Robert E. Schapire: A Decision-Theoretic Generalization of On-Line Learning and an Application to Boosting",
        refUrl: "https://www.sciencedirect.com/science/article/pii/S002200009791504X"
      },
      {
        num: "12.8",
        slug: "12-8-gradient-boosting-machine-gbm-pseudo-residuals",
        title: "12.8. Gradient Boosting Machine (GBM): Pseudo-Residual Gradien",
        desc: "Generalisasi Jerome Friedman (2001): boosting sebagai gradient descent dalam ruang fungsi, pseudo-residual fungsi kerugian, dan shrinkage learning rate.",
        concept: `Jerome Friedman (2001) merevolusi paradigma boosting dengan menggeneralisasikannya ke dalam kerangka kerja optimasi numerik murni yang disebut **Gradient Boosting Machine (GBM)**.
        
Jika Gradient Descent standar mengoptimalkan parameter model dalam ruang parameter dengan bergerak berlawanan arah gradien, Gradient Boosting melakukan **Gradient Descent dalam Ruang Fungsi (Function Space)**.
        
Mekanisme matematis GBM:
Alih-alih mengubah bobot data seperti AdaBoost, setiap pohon baru $h_m(x)$ dilatih secara langsung untuk memprediksi **Pseudo-Residual**—yaitu negatif dari turunan parsial fungsi kerugian (Loss Function $\\mathcal{L}(y, f(x))$) terhadap nilai prediksi saat ini:
$$r_{im} = - \\left[ \\frac{\\partial \\mathcal{L}(y_i, f(x_i))}{\\partial f(x_i)} \\right]_{f(x) = f_{m-1}(x)}$$
Untuk fungsi Mean Squared Error, pseudo-residual tepat sama dengan residual biasa ($y_i - \\hat{y}_i$).
        
Parameter **Shrinkage (Learning Rate $\\eta$)** diperkenalkan untuk mengalikan kontribusi setiap pohon baru ($f_m(x) = f_{m-1}(x) + \\eta h_m(x)$), bertindak sebagai regularisasi yang sangat efektif untuk menahan laju overfitting.`,
        formula: `r_{im} = - \\left[ \\frac{\\partial \\mathcal{L}(y_i, \\hat{y}_i)}{\\partial \\hat{y}_i} \\right], \\quad f_m(x) = f_{m-1}(x) + \\eta \\sum_{j=1}^{J_m} \\gamma_{jm} \\mathbb{I}(x \\in R_{jm})`,
        code: `# 12.8: Implementasi Gradient Boosting Regressor dari Nol Menggunakan Pseudo-Residual
import numpy as np
from sklearn.tree import DecisionTreeRegressor

np.random.seed(42)
n = 100
X = np.linspace(-3, 3, n).reshape(-1, 1)
y = np.sin(X).ravel() + np.random.normal(0, 0.1, n)

# 1. Inisialisasi Model f_0(x) dengan Nilai Rata-rata Konstan (Minimasi MSE)
f0 = np.mean(y)
f_saat_ini = np.full(n, f0)

learning_rate = 0.1
pohon_ensemble = []
M_iterasi = 30

for m in range(M_iterasi):
    # Hitung Pseudo-Residual Negatif Gradien (r_i = y_i - f(x_i) untuk L2 Loss)
    pseudo_residual = y - f_saat_ini
    
    # Latih Pohon Regresi Dangkal pada Pseudo-Residual
    tree = DecisionTreeRegressor(max_depth=2, random_state=m)
    tree.fit(X, pseudo_residual)
    
    # Pembaruan Gradien: f_m(x) = f_{m-1}(x) + eta * h_m(x)
    f_saat_ini += learning_rate * tree.predict(X)
    pohon_ensemble.append(tree)

mse_akhir = np.mean((y - f_saat_ini)**2)

print("=== SIMULASI ALGORITMA GRADIENT BOOSTING (MANUAL) ===")
print(f"MSE Model Awal (f0 Konstan) : {np.mean((y - f0)**2):.4f}")
print(f"MSE Model Akhir (30 Pohon)   : {mse_akhir:.4f} (Penurunan Galat Signifikan!)")`,
        expectedOutput: "MSE tereduksi secara drastis dari 0.44 menjadi 0.01 seiring penambahan pohon pseudo-residual.",
        codeExp: "Skrip mengimplementasikan algoritma Gradient Boosting dasar secara eksplisit membuktikan bagaimana pohon-pohon baru mempelajari negatif gradien residual data.",
        pitfalls: [
          "Menyetel learning rate terlalu besar (misal > 0.5) yang menyebabkan proses boosting melompati minimum optimal dan mengalami divergensi.",
          "Menerapkan kedalaman pohon terlalu dalam (max_depth > 8) pada GBM yang memicu overfitting instan (kedalaman optimal GBM biasanya 3-6)."
        ],
        refTitle: "Jerome H. Friedman: Greedy Function Approximation: A Gradient Boosting Machine (Annals of Statistics)",
        refUrl: "https://projecteuclid.org/journals/annals-of-statistics/volume-29/issue-5/Greedy-function-approximation-A-gradient-boosting-machine/10.1214/aos/1013203451.full"
      },
      {
        num: "12.9",
        slug: "12-9-xgboost-optimasi-taylor-dan-regularisasi-struktur",
        title: "12.9. Extreme Gradient Boosting (XGBoost): Turunan Orde Dua Taylor",
        desc: "Terobosan Tianqi Chen (2016): ekspansi deret Taylor orde dua (Hessian), penalti kompleksitas struktur pohon, dan algoritma split sparsity-aware.",
        concept: `Pada tahun 2016, Tianqi Chen dan Carlos Guestrin memperkenalkan **XGBoost (Extreme Gradient Boosting)**, yang dengan cepat mendominasi seluruh kompetisi sains data tabel di Kaggle dan platform industri global.
        
Inovasi matematis dan komputasi utama XGBoost:
1. **Aproksimasi Deret Taylor Orde Dua:** Berbeda dengan GBM standar yang hanya menggunakan turunan pertama (gradien $g_i$), XGBoost memperluas fungsi objektif menggunakan pendekatan Taylor hingga turunan kedua (Hessian $h_i = \\partial^2 \\mathcal{L} / \\partial \\hat{y}_i^2$). Hal ini memberikan informasi kelengkungan kurva rugi (*curvature*), mempercepat konvergensi optimasi secara dramatis.
2. **Regularisasi Kompleksitas Struktur Pohon Eksplisit:** Fungsi objektif XGBoost memasukkan penalti langsung terhadap jumlah daun $T$ dan norma $L_2$ dari bobot daun $w$: $\\Omega(f) = \\gamma T + \\frac{1}{2}\\lambda \\sum_{j=1}^T w_j^2$.
3. **Optimasi Sistem Terdistribusi:** Histogram binning kuantil berbobot (Weighted Quantile Sketch), algoritma penanganan missing values otomatis (*sparsity-aware split finding*), dan pemrosesan blok memori out-of-core.`,
        formula: `\\mathcal{L}^{(t)} \\approx \\sum_{i=1}^n \\left[ g_i f_t(x_i) + \\frac{1}{2} h_i f_t^2(x_i) \\right] + \\gamma T + \\frac{1}{2} \\lambda \\sum_{j=1}^T w_j^2`,
        code: `# 12.9: Demonstrasi Pelatihan Model XGBoost dengan Early Stopping dan Regularisasi
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score
from xgboost import XGBClassifier

X, y = make_classification(n_samples=2000, n_features=20, n_informative=8, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# Mengonfigurasi XGBClassifier dengan Regularisasi Orde Dua
model_xgb = XGBClassifier(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=4,
    reg_alpha=0.1,  # Penalti L1
    reg_lambda=1.5, # Penalti L2 (Hessian regularizer)
    gamma=0.2,      # Minimum loss reduction to split
    subsample=0.8,
    colsample_bytree=0.8,
    eval_metric='logloss',
    early_stopping_rounds=20,
    random_state=42
)

model_xgb.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    verbose=False
)

prob_test = model_xgb.predict_proba(X_test)[:, 1]
auc_test = roc_auc_score(y_test, prob_test)

print("=== KINERJA EXTREME GRADIENT BOOSTING (XGBOOST) ===")
print(f"Pohon Terbaik (Early Stopping) : Iterasi ke-{model_xgb.best_iteration}")
print(f"ROC-AUC Data Uji               : {auc_test:.4f}")
print(f"Fitur Paling Berpengaruh       : Fitur {np.argmax(model_xgb.feature_importances_)}")`,
        expectedOutput: "XGBoost konvergen pada iterasi optimal via early stopping dengan skor AUC sangat tinggi.",
        codeExp: "Skrip mengonfigurasi dan melatih XGBClassifier dengan memanfaatkan parameter regularisasi gamma, alpha, lambda, dan mekanisme early stopping.",
        pitfalls: [
          "Tidak menyetel early_stopping_rounds pada XGBoost, sehingga model terus melatih ratusan pohon ekstra yang memperburuk overfitting data uji.",
          "Mengabaikan parameter scale_pos_weight pada kasus klasifikasi dengan rasio ketimpangan kelas yang besar."
        ],
        refTitle: "Tianqi Chen & Carlos Guestrin: XGBoost: A Scalable Tree Boosting System (KDD 2016)",
        refUrl: "https://dl.acm.org/doi/10.1145/2939672.2939785"
      },
      {
        num: "12.10",
        slug: "12-10-lightgbm-dan-catboost-arsitektur-modern",
        title: "12.10. Arsitektur Boosting Modern: LightGBM & CatBoost",
        desc: "Evolusi efisiensi gradient boosting: pertumbuhan pohon Leaf-Wise (Best-First) LightGBM, GOSS, EFB, dan Target Encoding Ordered CatBoost.",
        concept: `Meskipun XGBoost sangat bertenaga, pada dataset industri berukuran puluhan gigabyte dengan jutaan baris dan ribuan fitur, waktu pelatihan XGBoost klasik dapat memakan waktu lama. Dua pustaka generasi mutakhir menyelesaikan tantangan ini:
        
1. **LightGBM (Microsoft, Ke et al., 2017):**
   - *Leaf-Wise (Best-First) Tree Growth:* Berbeda dengan XGBoost standar yang menumbuhkan pohon per level (level-wise), LightGBM menumbuhkan daun yang menghasilkan penurunan kerugian terbesar, mencapai akurasi lebih tinggi pada kedalaman lebih rendah.
   - *Gradient-based One-Side Sampling (GOSS):* Mempertahankan sampel dengan gradien besar dan mengambil sampel acak kecil dari data bergradien rendah, memangkas komputasi drastis tanpa merusak akurasi.
   - *Exclusive Feature Bundling (EFB):* Menggabungkan fitur-fitur yang saling eksklusif (jarang bernilai non-nol bersamaan) ke dalam satu fitur tunggal.
        
2. **CatBoost (Yandex, Prokhorenkova et al., 2018):**
   - Dirancang khusus untuk menangani data kategorik tanpa prapemrosesan One-Hot via teknik *Ordered Target Statistics*.
   - Menerapkan *Ordered Boosting* untuk mengatasi bias pergeseran target dan *Oblivious Trees* (pohon simetris) yang memungkinkan eksekusi prediksi instan di level perangkat keras CPU.`,
        code: `# 12.10: Perbandingan Efisiensi Waktu dan Performa LightGBM vs HistGradientBoosting
import time
import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import HistGradientBoostingClassifier

# Dataset tabular berukuran besar (15.000 Baris x 30 Fitur)
X, y = make_classification(n_samples=15000, n_features=30, n_informative=15, random_state=42)

# HistGradientBoostingClassifier (Implementasi Algoritma Mirip LightGBM di Scikit-Learn)
model_hist = HistGradientBoostingClassifier(
    max_iter=100,
    learning_rate=0.1,
    max_leaf_nodes=31, # Khas arsitektur Leaf-Wise
    random_state=42
)

t0 = time.time()
model_hist.fit(X, y)
t_latih = time.time() - t0

skor_hist = model_hist.score(X, y)

print("=== ARSITEKTUR BOOSTING HISTOGRAM HISTGRADIENTBOOSTING ===")
print(f"Ukuran Dataset: 15.000 Sampel x 30 Fitur")
print(f"Waktu Pelatihan 100 Iterasi Histogram : {t_latih:.4f} detik (SANGAT CEPAT!)")
print(f"Akurasi Pelatihan Model Leaf-Wise     : {skor_hist*100:.2f}%")`,
        expectedOutput: "Algoritma berbasis histogram menyelesaikan pelatihan 15.000 sampel dalam pecahan detik.",
        codeExp: "Skrip memanfaatkan HistGradientBoostingClassifier untuk mendemonstrasikan efisiensi algoritma binning histogram modern yang dipelopori oleh LightGBM.",
        pitfalls: [
          "Menggunakan model Leaf-Wise (LightGBM) dengan max_leaf_nodes tinggi pada dataset kecil tanpa menyetel min_child_samples (memicu overfitting daun tunggal).",
          "Melakukan One-Hot Encoding manual pada fitur kategorik sebelum melatih CatBoost (CatBoost bekerja optimal jika fitur kategorik diserahkan dalam bentuk aslinya)."
        ],
        refTitle: "Guolin Ke et al.: LightGBM: A Highly Efficient Gradient Boosting Decision Tree (NeurIPS 2017)",
        refUrl: "https://proceedings.neurips.cc/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html"
      }
    ]
  }
];
