import { ChapterDef } from "./da-data-ch1-3";

export const DS_CHAPTERS_5_TO_8: ChapterDef[] = [
  // ==========================================
  // BAB 5: Teori Estimasi Parameter, Sampling, & Teorema Limit Pusat (CLT)
  // ==========================================
  {
    orderIndex: 5,
    id: "data-science-ch-5",
    slug: "bab-5-teori-estimasi-parameter-sampling-teorema-limit-pusat",
    title: "BAB 5: Teori Estimasi Parameter, Sampling, & Teorema Limit Pusat (CLT)",
    desc: "Landasan inferensi statistik modern: teknik sampling representatif, distribusi sampling rata-rata, teorema limit pusat (CLT), sifat-sifat estimator ideal (unbiased, consistent, efficient), Maximum Likelihood Estimation (MLE), interval kepercayaan, dan resampling bootstrap.",
    coreConcepts: ["Sampling Distributions", "Central Limit Theorem", "Point Estimation & MLE", "Confidence Intervals", "Non-Parametric Bootstrap"],
    subchapters: [
      {
        num: "5.1",
        slug: "5-1-populasi-sampel-dan-metode-sampling-representatif",
        title: "5.1. Populasi vs Sampel & Metode Sampling Representatif",
        desc: "Prinsip dasar generalisasi empiris: sampling acak sederhana (SRS), sampling terstratifikasi (stratified sampling), dan sampling kluster.",
        concept: `Tujuan fundamental dari sains data inferensial adalah menarik kesimpulan valid tentang karakteristik populasi yang sangat besar atau tak berhingga berdasarkan subset observasi terbatas yang disebut sampel. Galat sampling (sampling error) dan bias seleksi adalah dua ancaman paling kritis yang dapat merusak validitas eksternal dari model prediktif apa pun.
        
Dalam Simple Random Sampling (SRS), setiap elemen populasi memiliki peluang inklusi identik dan independen. Namun, pada dataset dengan heterogenitas kelompok tinggi atau distribusi kelas yang timpang (imbalance), SRS rentan menghasilkan sampel yang tidak merepresentasikan strata minoritas penting.
        
Stratified Random Sampling membagi populasi menjadi subpopulasi homogen (strata) berdasarkan fitur kritis (seperti demografi atau riwayat transaksi) sebelum melakukan sampling acak di setiap stratum. Hal ini menjamin varians estimasi antar kelompok diminimalkan dan representasi proporsional terjaga sempurna.`,
        code: `# 5.1: Perbandingan Simple Random Sampling vs Stratified Sampling pada Data Pelanggan
import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedShuffleSplit

np.random.seed(42)
N = 10000
# Populasi dengan distribusi tier pelanggan timpang: 80% Bronze, 15% Silver, 5% Gold
tier = np.random.choice(['Bronze', 'Silver', 'Gold'], size=N, p=[0.80, 0.15, 0.05])
pengeluaran = np.where(tier == 'Bronze', np.random.normal(100, 20, N),
              np.where(tier == 'Silver', np.random.normal(400, 50, N),
                                         np.random.normal(1200, 150, N)))

populasi = pd.DataFrame({'tier': tier, 'pengeluaran': pengeluaran})

# 1. Simple Random Sample (n = 200)
srs_sample = populasi.sample(n=200, random_state=42)

# 2. Stratified Random Sample (n = 200)
sss = StratifiedShuffleSplit(n_splits=1, test_size=200/N, random_state=42)
for _, sample_idx in sss.split(populasi, populasi['tier']):
    strat_sample = populasi.iloc[sample_idx]

prop_pop = populasi['tier'].value_counts(normalize=True)
prop_srs = srs_sample['tier'].value_counts(normalize=True)
prop_strat = strat_sample['tier'].value_counts(normalize=True)

df_eval = pd.DataFrame({'Populasi': prop_pop, 'SRS': prop_srs, 'Stratified': prop_strat})
print("=== PERBANDINGAN DISTRIBUSI KELAS METODE SAMPLING ===")
print(df_eval.round(4))`,
        expectedOutput: "Stratified sampling merefleksikan proporsi populasi secara presisi dibandingkan SRS.",
        codeExp: "Skrip mendemonstrasikan bagaimana StratifiedShuffleSplit menjaga rasio kelas minoritas (Gold 5%) secara proporsional persis dengan populasi, mencegah deviasi bias estimasi yang terjadi pada sampling acak sederhana.",
        pitfalls: [
          "Melakukan sampling acak sederhana pada dataset berstrata tanpa memeriksa varians intra-strata.",
          "Memilih variabel stratifikasi yang tidak berkorelasi dengan target analisis sehingga menambah kompleksitas sampling tanpa menurunkan varians estimasi."
        ],
        refTitle: "William G. Cochran: Sampling Techniques (3rd Edition)",
        refUrl: "https://www.wiley.com/en-us/Sampling+Techniques%2C+3rd+Edition-p-9780471162407"
      },
      {
        num: "5.2",
        slug: "5-2-distribusi-sampling-dan-standard-error",
        title: "5.2. Distribusi Sampling & Standard Error of the Mean (SE)",
        desc: "Karakteristik sebaran statistik sampel: perbedaan fundamental antara deviasi standar populasi (sigma) dan galat standar rata-rata (SE).",
        concept: `Distribusi sampling adalah distribusi probabilitas teoretis dari suatu statistik (misalnya rata-rata sampel $\\bar{X}$) yang dihasilkan dari pengambilan sampel berulang-ulang secara independen dengan ukuran $n$ yang sama dari populasi yang diberikan.
        
Sering terjadi kebingungan antara Deviasi Standar ($s$ atau $\\sigma$) dan Galat Standar (Standard Error / $SE$). Deviasi standar mengukur sebaran atau variabilitas data individual di sekitar nilai rata-rata, sedangkan Galat Standar mengukur presisi atau variabilitas dari estimator statistik itu sendiri antar replikasi sampel.
        
Semakin besar ukuran sampel $n$, semakin kecil nilai $SE$ dengan laju proporsional terhadap $1/\\sqrt{n}$. Ini adalah prinsip fundamental hukum bilangan besar (Law of Large Numbers) yang menjamin konvergensi statistik sampel menuju parameter populasi riil.`,
        formula: `\\text{SE}(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}} \\approx \\frac{s}{\\sqrt{n}}`,
        code: `# 5.2: Simulasi Empiris Distribusi Sampling Rata-rata dan Verifikasi Formula SE
import numpy as np

np.random.seed(42)
# Populasi non-normal (Distribusi Eksponensial dengan rata-rata = 50, sigma = 50)
populasi = np.random.exponential(scale=50.0, size=1000000)
mu_pop = np.mean(populasi)
sigma_pop = np.std(populasi)

n = 100 # Ukuran tiap sampel
B = 5000 # Jumlah pengulangan sampling

# Mengambil B sampel berukuran n dan menghitung rata-rata masing-masing
rata_rata_sampel = [np.mean(np.random.choice(populasi, size=n, replace=False)) for _ in range(B)]

se_teoritis = sigma_pop / np.sqrt(n)
se_empiris = np.std(rata_rata_sampel)

print("=== VERIFIKASI DISTRIBUSI SAMPLING & STANDARD ERROR ===")
print(f"Rata-rata Populasi (mu)         : {mu_pop:.4f}")
print(f"Rata-rata Distribusi Sampling   : {np.mean(rata_rata_sampel):.4f}")
print(f"Standard Error Teoretis (sigma/sqrt(n)): {se_teoritis:.4f}")
print(f"Standard Error Empiris (std(X_bar))    : {se_empiris:.4f}")
print(f"Selisih Galat Relatif           : {abs(se_empiris - se_teoritis)/se_teoritis*100:.2f}%")`,
        expectedOutput: "Standard Error empiris cocok dengan formula teoretis sigma / sqrt(n) dengan galat < 1%.",
        codeExp: "Skrip melakukan simulasi Monte Carlo 5.000 kali pengambilan sampel dari populasi eksponensial untuk membuktikan bahwa variabilitas rata-rata sampel tereduksi sebesar akar kuadrat ukuran sampel.",
        pitfalls: [
          "Melaporkan deviasi standar data (SD) ketika yang dimaksud adalah ketidakpastian estimasi parameter (SE), yang dapat menyesatkan interpretasi presisi.",
          "Mengabaikan koreksi finite population correction (FPC) saat ukuran sampel melebihi 5% dari total populasi terbatas."
        ],
        refTitle: "Larry Wasserman: All of Statistics — A Concise Course in Statistical Inference",
        refUrl: "https://link.springer.com/book/10.1007/978-0-387-21736-9"
      },
      {
        num: "5.3",
        slug: "5-3-teorema-limit-pusat-dan-konvergensi-stokastik",
        title: "5.3. Teorema Limit Pusat (Central Limit Theorem) & Konvergensi Stokastik",
        desc: "Teorema terpenting dalam statistika: konvergensi asimtotik distribusi jumlah atau rata-rata variabel acak independen menuju distribusi normal.",
        concept: `Teorema Limit Pusat (Central Limit Theorem / CLT) menyatakan bahwa jika $X_1, X_2, \\dots, X_n$ adalah barisan variabel acak independen dan terdistribusi identik (i.i.d.) dengan rata-rata berhingga $\\mu$ dan varians berhingga $\\sigma^2 > 0$, maka seiring dengan $n \\to \\infty$, distribusi dari rata-rata sampel standar terkonvergensi dalam distribusi menuju distribusi normal standar $\\mathcal{N}(0, 1)$.
        
Penting untuk dipahami bahwa CLT tidak menyatakan bahwa data mentah dalam populasi menjadi terdistribusi normal ketika jumlah sampel bertambah. CLT menjamin bahwa *distribusi sampling dari rata-rata* (atau jumlahan) sampel yang akan mendekati normal, terlepas dari apakah bentuk distribusi populasi asalnya seragam, eksponensial, multimodal, atau sangat miring.
        
Dalam konteks sains data, CLT adalah fondasi dari sebagian besar uji signifikansi hipotesis klasik (seperti Z-test dan t-test) dan konstruksi interval kepercayaan parametrik. Ukuran sampel acak $n \\ge 30$ sering dijadikan pedoman praktis, meskipun untuk distribusi dengan skewness ekstrem diperlukan $n$ yang lebih besar.`,
        formula: `Z_n = \\frac{\\bar{X}_n - \\mu}{\\sigma / \\sqrt{n}} \\xrightarrow{d} \\mathcal{N}(0, 1) \\quad \\text{saat } n \\to \\infty`,
        code: `# 5.3: Demonstrasi Teorema Limit Pusat dari Populasi Miring Ekstrem (Log-Normal)
import numpy as np
from scipy import stats

np.random.seed(42)
# Populasi Log-Normal miring ekstrem (skewness > 5)
populasi_miring = np.random.lognormal(mean=0.0, sigma=1.5, size=500000)
skew_pop = stats.skew(populasi_miring)

ukuran_sampel = [5, 30, 150]
B = 3000

print(f"Skewness Populasi Awal: {skew_pop:.4f} (Miring Sangat Kuat)")
print("=== UJI NORMALITAS DISTRIBUSI SAMPLING (SHAPIRO-WILK / D'AGOSTINO) ===")

for n in ukuran_sampel:
    rata_rata = [np.mean(np.random.choice(populasi_miring, size=n, replace=False)) for _ in range(B)]
    skew_sampling = stats.skew(rata_rata)
    # Uji normalitas D'Agostino-Pearson
    stat, p_val = stats.normaltest(rata_rata)
    status = "Mendekati Normal (Gagal Tolak H0)" if p_val > 0.05 else "Belum Normal Sempurna"
    print(f"n = {n:3d} | Skewness: {skew_sampling:7.4f} | p-value: {p_val:.4e} | Status: {status}")`,
        expectedOutput: "Skewness distribusi rata-rata mendekati 0 seiring bertambahnya n, membuktikan CLT.",
        codeExp: "Skrip menunjukkan bagaimana skewness distribusi sampling menyusut drastis dari populasi awal (>5) mendekati 0 saat n diperbesar, mengonfirmasi konvergensi asimtotik ke distribusi normal.",
        pitfalls: [
          "Mengklaim data mentah berubah menjadi normal karena ukuran sampel besar (kesalahan epistemologi fatal).",
          "Menerapkan CLT pada distribusi dengan varians tak hingga (heavy-tailed distributions seperti Pareto dengan alpha < 2 atau distribusi Cauchy)."
        ],
        refTitle: "George Casella & Roger L. Berger: Statistical Inference (2nd Edition)",
        refUrl: "https://www.cengage.com/c/statistical-inference-2e-casella-berger/9780534243128/"
      },
      {
        num: "5.4",
        slug: "5-4-point-estimation-dan-sifat-estimator-ideal",
        title: "5.4. Point Estimation & Sifat-sifat Estimator Ideal",
        desc: "Kriteria matematis penilai kualitas estimator titik: ketiadaan bias (unbiasedness), konsistensi (consistency), dan efisiensi (efficiency).",
        concept: `Estimasi titik (point estimation) adalah prosedur penggunaan data sampel untuk menghitung suatu nilai numerik tunggal yang berfungsi sebagai tebakan terbaik bagi parameter populasi yang tidak diketahui $\\theta$. Suatu fungsi dari data sampel $\\hat{\\theta} = g(X_1, \\dots, X_n)$ disebut sebagai estimator.
        
Kualitas suatu estimator dievaluasi berdasarkan tiga kriteria matematis utama:
1. **Unbiasedness (Ketakbiasan):** Nilai ekspektasi estimator sama dengan parameter riil, yaitu $\\mathbb{E}[\\hat{\\theta}] = \\theta$. Jika $\\mathbb{E}[\\hat{\\theta}] - \\theta = \\text{Bias}(\\hat{\\theta}) \\ne 0$, estimator dikatakan berbias.
2. **Consistency (Konsistensi):** Seiring dengan membesarnya ukuran sampel $n \\to \\infty$, estimator terkonvergensi dalam probabilitas menuju nilai parameter sesungguhnya (yaitu $\\lim_{n \\to \\infty} P(|\\hat{\\theta}_n - \\theta| > \\epsilon) = 0$).
3. **Efficiency (Efisiensi):** Di antara seluruh estimator yang tidak berbias, estimator yang paling efisien adalah yang memiliki varians terkecil.
        
Contoh klasik bias estimator adalah varians sampel: pembagian dengan $n$ menghasilkan estimator yang berbias ke bawah, sehingga koreksi Bessel (pembagian dengan $n - 1$) diterapkan untuk menjamin ketakbiasan.`,
        formula: `\\text{MSE}(\\hat{\\theta}) = \\mathbb{E}[(\\hat{\\theta} - \\theta)^2] = \\text{Var}(\\hat{\\theta}) + [\\text{Bias}(\\hat{\\theta})]^2`,
        code: `# 5.4: Pembuktian Empiris Bias Varians Sampel (Pembagi N vs Bessel N-1)
import numpy as np

np.random.seed(42)
mu_true = 100.0
sigma_sq_true = 25.0 # Varians populasi riil = 25

n = 5 # Sampel kecil mempertegas bias
B = 100000

var_biased_list = []
var_unbiased_list = []

for _ in range(B):
    sample = np.random.normal(mu_true, np.sqrt(sigma_sq_true), size=n)
    # Pembagi n (Berbias)
    var_biased_list.append(np.var(sample, ddof=0))
    # Pembagi n - 1 (Bessel Unbiased)
    var_unbiased_list.append(np.var(sample, ddof=1))

mean_biased = np.mean(var_biased_list)
mean_unbiased = np.mean(var_unbiased_list)

print("=== PEMBUKTIAN BIAS ESTIMATOR VARIANS SAMPEL ===")
print(f"Varians Populasi Sesungguhnya (sigma^2): {sigma_sq_true:.4f}")
print(f"Ekspektasi Var Sampel Pembagi N (ddof=0) : {mean_biased:.4f} (Bias: {mean_biased - sigma_sq_true:.4f})")
print(f"Ekspektasi Var Sampel Pembagi N-1 (ddof=1): {mean_unbiased:.4f} (Bias: {mean_unbiased - sigma_sq_true:.4f})")`,
        expectedOutput: "ddof=0 menghasilkan estimasi varians di bawah 25, sedangkan ddof=1 tepat menghasilkan 25.",
        codeExp: "Skrip menunjukkan secara komputasional mengapa koreksi Bessel (ddof=1) diperlukan untuk menghasilkan estimator varians tak berbias pada sampel berhingga.",
        pitfalls: [
          "Menggunakan NumPy np.var default (ddof=0) untuk mengestimasi varians populasi dari sampel, padahal standar statistika mengharuskan ddof=1.",
          "Hanya mengejar ketakbiasan (unbiasedness) dan mengabaikan total MSE; kadang estimator sedikit berbias dengan varians jauh lebih kecil lebih unggul."
        ],
        refTitle: "Alexander M. Mood, Franklin A. Graybill, Duane C. Boes: Introduction to the Theory of Statistics",
        refUrl: "https://www.mheducation.com/highered/product/introduction-theory-statistics-mood-graybill/M9780070428645.html"
      },
      {
        num: "5.5",
        slug: "5-5-mvue-dan-cramer-rao-lower-bound",
        title: "5.5. Minimum Variance Unbiased Estimator (MVUE) & Batas Bawah Cramér-Rao",
        desc: "Batas teoritis varians estimator statistik: informasi Fisher dan pencapaian efisiensi optimal melalui Cramér-Rao Lower Bound (CRLB).",
        concept: `Dalam perancangan algoritma inferensial, praktisi sering kali dihadapkan pada beberapa estimator tak berbias yang bersaing. Teori statistik inferensial menyediakan kerangka kerja untuk mengidentifikasi apakah suatu estimator telah mencapai batas varians teoritis terendah yang mungkin dicapai oleh estimator tak berbias mana pun—estimator semacam ini disebut Minimum Variance Unbiased Estimator (MVUE).
        
Teorema Cramér-Rao menyatakan bahwa varians dari setiap estimator tak berbias $\\hat{\\theta}$ selalu dibatasi dari bawah oleh invers dari Informasi Fisher $I_n(\\theta)$. Informasi Fisher mengukur jumlah informasi yang dibawa oleh variabel acak sampel mengenai parameter populasi yang tidak diketahui.
        
Jika varians dari suatu estimator tak berbias tepat sama dengan batas bawah Cramér-Rao ($1 / I_n(\\theta)$), estimator tersebut disebut efisien (efficient estimator). Contohnya, rata-rata sampel $\\bar{X}$ adalah estimator efisien dan MVUE untuk rata-rata populasi berdistribusi normal.`,
        formula: `\\text{Var}(\\hat{\\theta}) \\ge \\frac{1}{I_n(\\theta)} = \\frac{1}{n \\, \\mathbb{E}\\left[ \\left( \\frac{\\partial}{\\partial \\theta} \\ln f(X; \\theta) \\right)^2 \\right]}`,
        code: `# 5.5: Verifikasi Batas Bawah Cramér-Rao (CRLB) untuk Estimator Rata-rata Normal
import numpy as np

np.random.seed(42)
mu_true = 50.0
sigma_true = 10.0
n = 25
B = 50000

# Untuk populasi normal, Fisher Information I_n(mu) = n / sigma^2
# Sehingga CRLB untuk varians estimator mu adalah sigma^2 / n
crlb_teoritis = (sigma_true ** 2) / n

# Evaluasi 2 kandidat estimator tak berbias:
# 1. Rata-rata Sampel (Mean)
# 2. Median Sampel
means = []
medians = []

for _ in range(B):
    sample = np.random.normal(mu_true, sigma_true, size=n)
    means.append(np.mean(sample))
    medians.append(np.median(sample))

var_mean = np.var(means, ddof=1)
var_median = np.var(medians, ddof=1)

print("=== EVALUASI EFISIENSI ESTIMATOR & CRAMÉR-RAO BOUND ===")
print(f"CRLB Batas Bawah Teoretis     : {crlb_teoritis:.4f}")
print(f"Varians Rata-rata Sampel (Mean): {var_mean:.4f} (Efisiensi Relatif: {crlb_teoritis/var_mean:.4f})")
print(f"Varians Median Sampel (Median) : {var_median:.4f} (Efisiensi Relatif: {crlb_teoritis/var_median:.4f})")`,
        expectedOutput: "Varians rata-rata sampel tepat mencapai batas CRLB (4.0), membuktikan rata-rata adalah MVUE.",
        codeExp: "Skrip mengomparasi varians empiris mean vs median pada data normal, membuktikan bahwa rata-rata sampel mencapai efisiensi 100% tepat pada batas teoritis Cramér-Rao.",
        pitfalls: [
          "Mengasumsikan rata-rata selalu merupakan MVUE untuk segala jenis distribusi; untuk distribusi Laplace atau Cauchy, median jauh lebih efisien.",
          "Menerapkan CRLB pada distribusi yang kondisi regularitasnya dilanggar (misalnya distribusi Uniform $U(0, \\theta)$ di mana domain bergantung pada parameter)."
        ],
        refTitle: "E. L. Lehmann & George Casella: Theory of Point Estimation (Springer)",
        refUrl: "https://link.springer.com/book/10.1007/b98854"
      },
      {
        num: "5.6",
        slug: "5-6-maximum-likelihood-estimation-mle",
        title: "5.6. Maximum Likelihood Estimation (MLE): Formulasi & Optimasi Numerik",
        desc: "Metode estimasi parameter paling dominan dalam sains data dan machine learning: prinsip fungsi likelihood, log-likelihood, dan optimasi scipy.optimize.",
        concept: `Maximum Likelihood Estimation (MLE) adalah metode estimasi parameter yang mencari nilai parameter $\\hat{\\theta}_{\\text{MLE}}$ yang memaksimalkan probabilitas (atau densitas probabilitas bersama) dari data observasi yang teramati secara nyata.
        
Diberikan sampel data independen $x_1, \\dots, x_n$, fungsi likelihood didefinisikan sebagai perkalian dari densitas individual: $L(\\theta) = \\prod_{i=1}^n f(x_i; \\theta)$. Karena perkalian densitas probabilitas kecil rentan memicu numerical underflow pada komputer, secara praktis para ilmuwan data selalu mengoptimalkan fungsi Log-Likelihood $\\ell(\\theta) = \\ln L(\\theta) = \\sum_{i=1}^n \\ln f(x_i; \\theta)$.
        
MLE memiliki sifat-sifat asimtotik yang luar biasa: konsisten, efisien secara asimtotik (mencapai CRLB saat $n \\to \\infty$), dan memiliki distribusi sampling asimtotik normal. Sebagian besar loss function modern dalam deep learning dan machine learning (seperti Cross-Entropy dan Mean Squared Error) diturunkan secara langsung dari prinsip MLE.`,
        formula: `\\hat{\\theta}_{\\text{MLE}} = \\arg\\max_{\\theta} \\sum_{i=1}^n \\ln f(x_i; \\theta)`,
        code: `# 5.6: Estimasi Parameter Distribusi Gamma via Maximum Likelihood Numerik (SciPy)
import numpy as np
from scipy import stats
from scipy.optimize import minimize

np.random.seed(42)
# Data observasi nyata: Waktu tunggu transaksi (Distribusi Gamma sejati: k=2.5, theta=4.0)
k_true, theta_true = 2.5, 4.0
data_waktu = np.random.gamma(shape=k_true, scale=theta_true, size=1500)

# Mendefinisikan Fungsi Negatif Log-Likelihood untuk diminimalkan
def neg_log_likelihood(params, data):
    k, theta = params
    if k <= 0 or theta <= 0:
        return np.inf # Batasan parameter strictly positive
    # Menghitung sum of log pdf
    return -np.sum(stats.gamma.logpdf(data, a=k, scale=theta))

# Optimasi Numerik L-BFGS-B
initial_guess = [1.0, 1.0]
bounds = [(1e-4, None), (1e-4, None)]
res = minimize(neg_log_likelihood, initial_guess, args=(data_waktu,), method='L-BFGS-B', bounds=bounds)

k_mle, theta_mle = res.x

print("=== HASIL MAXIMUM LIKELIHOOD ESTIMATION (MLE) ===")
print(f"Bentuk Sejati (Shape k)  : {k_true:.4f} | Estimasi MLE: {k_mle:.4f}")
print(f"Skala Sejati (Scale theta): {theta_true:.4f} | Estimasi MLE: {theta_mle:.4f}")
print(f"Konvergensi Optimizer    : {res.success} (Iterasi: {res.nit})")`,
        expectedOutput: "Estimasi MLE konvergen mendekati nilai parameter sejati k=2.5 dan theta=4.0.",
        codeExp: "Skrip memformulasikan fungsi negatif log-likelihood untuk distribusi Gamma kontinu dan menggunakan algoritma optimasi quasi-Newton (L-BFGS-B) untuk mengekstraksi parameter MLE secara numerik.",
        pitfalls: [
          "Memaksimalkan likelihood langsung alih-alih log-likelihood, memicu floating-point underflow menuju 0.",
          "Mengabaikan sensitivitas optimizer terhadap nilai tebakan awal (initial guess) pada permukaan likelihood non-konveks multimodal."
        ],
        refTitle: "Trevor Hastie, Robert Tibshirani, Jerome Friedman: The Elements of Statistical Learning",
        refUrl: "https://hastie.su.domains/ElemStatLearn/"
      },
      {
        num: "5.7",
        slug: "5-7-metode-momen-vs-maximum-likelihood",
        title: "5.7. Metode Momen (Method of Moments / MoM) vs MLE",
        desc: "Komparasi estimator parametrik: kemudahan analitis Metode Momen vs efisiensi optimal Maximum Likelihood pada sampel terbatas.",
        concept: `Sebelum penemuan MLE oleh Ronald Fisher, metode estimasi parameter yang paling luas digunakan adalah Metode Momen (Method of Moments / MoM) yang diperkenalkan oleh Karl Pearson. Prinsip MoM sangat sederhana dan intuitif: menyamakan momen teoritis populasi $\\mu_k = \\mathbb{E}[X^k]$ dengan momen sampel empiris $m_k = \\frac{1}{n} \\sum_{i=1}^n X_i^k$, lalu menyelesaikan sistem persamaan aljabar yang dihasilkan.
        
Keunggulan utama MoM adalah kesederhanaan komputasinya: sering kali estimator MoM memiliki solusi bentuk tertutup (closed-form solution) yang dapat dihitung langsung tanpa optimasi numerik iteratif.
        
Namun, kelemahan mendasar MoM adalah efisiensi statistiknya yang inferior dibandingkan MLE. Pada ukuran sampel terbatas, estimator MoM sering memiliki varians yang jauh lebih besar dan terkadang dapat menghasilkan estimasi parameter yang berada di luar ruang parameter matematis yang valid.`,
        formula: `m_1 = \\frac{1}{n}\\sum_{i=1}^n X_i = \\mathbb{E}[X; \\theta], \\quad m_2 = \\frac{1}{n}\\sum_{i=1}^n X_i^2 = \\mathbb{E}[X^2; \\theta]`,
        code: `# 5.7: Komparasi Empiris Metode Momen (MoM) vs MLE pada Distribusi Beta
import numpy as np
from scipy import stats

np.random.seed(42)
alpha_true, beta_true = 2.0, 5.0
n = 40 # Sampel berukuran sedang
B = 2000

mom_estimates = []
mle_estimates = []

for _ in range(B):
    sample = stats.beta.rvs(alpha_true, beta_true, size=n)
    
    # 1. Method of Moments (MoM)
    m1 = np.mean(sample)
    m2 = np.var(sample, ddof=0)
    # Solusi aljabar closed-form MoM Beta:
    common = (m1 * (1 - m1) / m2) - 1
    alpha_mom = m1 * common
    beta_mom = (1 - m1) * common
    mom_estimates.append((alpha_mom, beta_mom))
    
    # 2. Maximum Likelihood Estimation (MLE)
    a_mle, b_mle, _, _ = stats.beta.fit(sample, floc=0, fscale=1)
    mle_estimates.append((a_mle, b_mle))

mom_arr = np.array(mom_estimates)
mle_arr = np.array(mle_estimates)

mse_mom = np.mean((mom_arr[:, 0] - alpha_true)**2)
mse_mle = np.mean((mle_arr[:, 0] - alpha_true)**2)

print("=== PERBANDINGAN MSE: METODE MOMEN (MoM) VS MLE ===")
print(f"Alpha Sejati: {alpha_true:.2f}")
print(f"Mean Squared Error (MSE) MoM: {mse_mom:.4f}")
print(f"Mean Squared Error (MSE) MLE: {mse_mle:.4f}")
print(f"Efisiensi Relatif (MSE MLE / MSE MoM): {mse_mle / mse_mom:.4f}")`,
        expectedOutput: "MSE dari MLE secara konsisten lebih rendah dibandingkan MoM, mengonfirmasi efisiensi MLE.",
        codeExp: "Skrip melakukan simulasi Monte Carlo 2.000 iterasi untuk mengukur Mean Squared Error dari estimator MoM dan MLE pada distribusi Beta, membuktikan superioritas efisiensi MLE.",
        pitfalls: [
          "Menggunakan Metode Momen saat presisi tinggi dibutuhkan pada sampel terbatas.",
          "Lupa bahwa penyelesaian MoM pada distribusi kompleks dapat menghasilkan estimasi parameter negatif pada parameter yang didefinisikan positif murni."
        ],
        refTitle: "David Freedman, Robert Pisani, Roger Purves: Statistics (4th Edition)",
        refUrl: "https://wwnorton.com/books/9780393929720"
      },
      {
        num: "5.8",
        slug: "5-8-estimasi-interval-dan-confidence-interval-mean",
        title: "5.8. Estimasi Interval & Confidence Interval untuk Rata-Rata",
        desc: "Kuantifikasi ketidakpastian inferensi: formulasi interval kepercayaan parametrik berbasis distribusi Z dan Student's t, serta interpretasi frekuentis yang benar.",
        concept: `Estimasi titik memberikan tebakan tunggal tanpa menyatakan tingkat ketidakpastian di dalamnya. Estimasi interval (Confidence Interval / CI) mengatasi keterbatasan ini dengan menghasilkan rentang nilai $[L, U]$ yang dihitung dari data sampel sedemikian rupa sehingga probabilitas bahwa interval tersebut mencakup parameter populasi sesungguhnya $\\mu$ adalah sebesar $(1 - \\alpha)$ (misalnya 95%).
        
Interpretasi frekuentis dari Confidence Interval 95% sering disalahpahami. CI 95% **tidak berarti** bahwa ada peluang 95% parameter populasi berada di dalam interval numerik spesifik yang baru saja dihitung. Parameter populasi $\\mu$ adalah konstanta tetap (bukan variabel acak). Interpretasi yang benar: jika eksperimen sampling diulang 100 kali secara independen, maka diharapkan 95 dari interval yang dihasilkan akan mencakup nilai $\\mu$ yang sesungguhnya.
        
Ketika varians populasi $\\sigma$ tidak diketahui dan ukuran sampel terbatas, kita menggunakan distribusi Student's $t$ dengan derajat kebebasan $df = n - 1$, yang menghasilkan interval yang lebih lebar untuk mengakomodasi ketidakpastian estimasi standar deviasi sampel.`,
        formula: `\\text{CI}_{1-\\alpha}(\\mu) = \\bar{X} \\pm t_{\\alpha/2, \\, n-1} \\cdot \\frac{s}{\\sqrt{n}}`,
        code: `# 5.8: Konstruksi Confidence Interval t-Student dan Verifikasi Rasio Cakupan Frekuentis
import numpy as np
from scipy import stats

np.random.seed(42)
mu_true = 75.0
sigma_true = 12.0
n = 20 # Sampel berukuran kecil (t-distribution)
alpha = 0.05 # 95% Confidence Level
B = 10000

mencakup_parameter = 0

for _ in range(B):
    sample = np.random.normal(mu_true, sigma_true, size=n)
    x_bar = np.mean(sample)
    s = np.std(sample, ddof=1)
    se = s / np.sqrt(n)
    
    # Kritis t untuk 95% CI dengan df = n - 1
    t_crit = stats.t.ppf(1 - alpha/2, df=n-1)
    ci_lower = x_bar - t_crit * se
    ci_upper = x_bar + t_crit * se
    
    if ci_lower <= mu_true <= ci_upper:
        mencakup_parameter += 1

rasio_cakupan = (mencakup_parameter / B) * 100

print("=== VERIFIKASI CAKUPAN EMPIRIS 95% CONFIDENCE INTERVAL ===")
print(f"Tingkat Kepercayaan Teoretis: 95.00%")
print(f"Rasio Cakupan Teramati (B = 10.000): {rasio_cakupan:.2f}%")
print(f"Deviasi dari Tingkat Teoretis : {abs(rasio_cakupan - 95.0):.2f}%")`,
        expectedOutput: "Rasio cakupan empiris dari 10.000 interval mendekati persis 95.0%.",
        codeExp: "Skrip melakukan simulasi Monte Carlo 10.000 replikasi untuk membuktikan secara empiris definisi frekuentis dari interval kepercayaan Student's t 95%.",
        pitfalls: [
          "Menyatakan: 'Ada peluang 95% bahwa rata-rata populasi berada di antara 71.2 dan 78.4' (kesalahan fatal definisi frekuentis).",
          "Menggunakan tabel normal standar Z saat varians populasi tidak diketahui pada ukuran sampel kecil."
        ],
        refTitle: "Morris H. DeGroot & Mark J. Schervish: Probability and Statistics (4th Edition)",
        refUrl: "https://www.pearson.com/en-us/subject-catalog/p/probability-and-statistics/P200000003409/9780321500465"
      },
      {
        num: "5.9",
        slug: "5-9-confidence-interval-proporsi-dan-wilson-score",
        title: "5.9. Confidence Interval untuk Proporsi & Rentang Wilson Score",
        desc: "Inferensi parameter data biner: kelemahan aproksimasi normal Wald pada proporsi ekstrem dan keunggulan Wilson Score Interval.",
        concept: `Estimasi proporsi keberhasilan $p$ dari data biner Bernoulli (seperti click-through rate, conversion rate, atau default rate) adalah salah satu tugas analitik paling lazim di industri digital.
        
Interval standar Wald mengasumsikan aproksimasi normal: $\\hat{p} \\pm z_{\\alpha/2} \\sqrt{\\hat{p}(1-\\hat{p})/n}$. Meskipun mudah dihitung, interval Wald memiliki cacat fatal: ketika $p$ sangat mendekati 0 atau 1, atau ketika ukuran sampel $n$ kecil, batas interval Wald dapat melampaui rentang logis $[0, 1]$ (misalnya menghasilkan batas bawah negatif) dan memiliki rasio cakupan aktual yang jauh di bawah 95%.
        
Edwin B. Wilson (1927) memperkenalkan Wilson Score Interval, yang diperoleh dengan membalikkan pengujian skor untuk parameter binomial. Interval Wilson secara inheren terikat dalam domain $[0, 1]$, asimetris di dekat batas ekstrem, dan mempertahankan cakupan aktual yang sangat stabil bahkan untuk $n$ kecil atau ketika tidak ada kejadian sukses teramati ($x = 0$).`,
        formula: `\\text{CI}_{\\text{Wilson}} = \\frac{\\hat{p} + \\frac{z^2}{2n} \\pm z \\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n} + \\frac{z^2}{4n^2}}}{1 + \\frac{z^2}{n}}`,
        code: `# 5.9: Komparasi Interval Wald vs Wilson Score pada Kasus Konversi Ekstrem Rendah
import numpy as np
from statsmodels.stats.proportion import proportion_confint

# Skenario Kasus: 3 konversi dari 500 impresi iklan (p_topi = 0.006 atau 0.6%)
count = 3
nobs = 500
alpha = 0.05

# 1. Interval Wald Standar
ci_wald_low, ci_wald_upp = proportion_confint(count, nobs, alpha=alpha, method='normal')

# 2. Wilson Score Interval
ci_wilson_low, ci_wilson_upp = proportion_confint(count, nobs, alpha=alpha, method='wilson')

# 3. Agresti-Coull Interval (Alternatif Populer Lainnya)
ci_ac_low, ci_ac_upp = proportion_confint(count, nobs, alpha=alpha, method='agresti_coull')

print("=== PERBANDINGAN ESTIMASI INTERVAL PROPORSI EKSTREM (3/500) ===")
print(f"Proporsi Sampel (p_hat): {count/nobs:.4f}")
print(f"Wald (Normal Approx)  : [{ci_wald_low:.6f}, {ci_wald_upp:.6f}] (Rawan Batas Negatif)")
print(f"Wilson Score          : [{ci_wilson_low:.6f}, {ci_wilson_upp:.6f}] (Direkomendasikan)")
print(f"Agresti-Coull         : [{ci_ac_low:.6f}, {ci_ac_upp:.6f}]")`,
        expectedOutput: "Wilson score menghasilkan interval asimetris positif yang strictly valid di dalam [0, 1].",
        codeExp: "Skrip membandingkan konstruksi interval proporsi menggunakan statsmodels untuk membuktikan kestabilan matematis Wilson Score pada konversi langka.",
        pitfalls: [
          "Menerapkan interval Wald normal pada rasio klik atau kecurangan (fraud) di mana $n \\hat{p} < 5$, yang merusak asumsi normalitas.",
          "Membulatkan batas bawah negatif hasil Wald menjadi 0 tanpa menyadari bahwa panjang interval menjadi terdistorsi secara statistik."
        ],
        refTitle: "Alan Agresti & Brent A. Coull: Approximate is Better than 'Exact' for Interval Estimation of Binomial Proportions",
        refUrl: "https://www.tandfonline.com/doi/abs/10.1080/00031305.1998.10480550"
      },
      {
        num: "5.10",
        slug: "5-10-resampling-dan-non-parametric-bootstrap",
        title: "5.10. Resampling & Non-Parametric Bootstrap Confidence Intervals",
        desc: "Metode komputasi modern tanpa asumsi distribusi: prinsip bootstrap Bradley Efron (1979), sampling with replacement, dan konstruksi interval persentil / BCa.",
        concept: `Dalam banyak aplikasi sains data modern, data empiris memiliki distribusi yang rumit, multimodal, atau kita ingin mengestimasi parameter statistik yang tidak memiliki rumus varians analitis tertutup (misalnya rasio persentil, koefisien Gini, atau korelasi non-linier).
        
Metode Bootstrap yang dirintis oleh Bradley Efron pada tahun 1979 adalah terobosan komputasi yang memanfaatkan kekuatan komputasi modern. Prinsip dasar bootstrap memperlakukan sampel empiris $x_1, \\dots, x_n$ sebagai representasi terbaik dari populasi, lalu melakukan pengambilan sampel ulang (resampling) secara berulang-ulang dengan pengembalian (with replacement) sebanyak $B$ kali, dengan ukuran sampel yang identik $n$.
        
Dengan menghitung statistik $\\hat{\\theta}^{*b}$ pada setiap sampel bootstrap, kita memperoleh distribusi empiris dari estimator tanpa perlu membuat asumsi distribusi apriori apa pun. Interval kepercayaan bootstrap persentil atau bias-corrected and accelerated (BCa) memberikan estimasi ketidakpastian yang kokoh untuk statistik apa pun.`,
        formula: `\\text{CI}_{\\text{Percentile}} = [\\hat{\\theta}^*_{(\\alpha/2)}, \\; \\hat{\\theta}^*_{(1 - \\alpha/2)}]`,
        code: `# 5.10: Estimasi Ketidakpastian Rasio Sharpe Keuangan via Non-Parametric Bootstrap
import numpy as np
from scipy import stats

np.random.seed(42)
# Data empiris: Return harian portofolio investasi berderau non-normal
return_harian = np.random.standard_t(df=4, size=250) * 0.015 + 0.0008

def sharpe_ratio(r, rf=0.0001):
    return (np.mean(r) - rf) / np.std(r, ddof=1) * np.sqrt(252)

sharpe_titik = sharpe_ratio(return_harian)

# Resampling Bootstrap (B = 2500)
B = 2500
n = len(return_harian)
boot_sharpe = np.empty(B)

for b in range(B):
    boot_sample = np.random.choice(return_harian, size=n, replace=True)
    boot_sharpe[b] = sharpe_ratio(boot_sample)

# Bootstrap 95% Percentile Confidence Interval
ci_lower = np.percentile(boot_sharpe, 2.5)
ci_upper = np.percentile(boot_sharpe, 97.5)
se_boot = np.std(boot_sharpe, ddof=1)

print("=== INFERENSI PARAMETER NON-PARAMETRIK BOOTSTRAP ===")
print(f"Estimasi Titik Sharpe Ratio : {sharpe_titik:.4f}")
print(f"Bootstrap Standard Error     : {se_boot:.4f}")
print(f"95% Bootstrap CI (Percentile): [{ci_lower:.4f}, {ci_upper:.4f}]")`,
        expectedOutput: "Bootstrap menghasilkan rentang CI non-parametrik yang akurat tanpa asumsi normalitas return.",
        codeExp: "Skrip mengimplementasikan algoritma bootstrap non-parametrik murni untuk mengukur ketidakpastian parameter rasio Sharpe portofolio keuangan tanpa rumus analitis distribusi.",
        pitfalls: [
          "Melakukan resampling tanpa pengembalian (without replacement), yang hanya merombak urutan data tanpa menghasilkan variasi sampling.",
          "Menerapkan bootstrap standar independen pada data deret waktu yang memiliki dependensi temporal tinggi (seharusnya menggunakan Block Bootstrap)."
        ],
        refTitle: "Bradley Efron & Robert J. Tibshirani: An Introduction to the Bootstrap",
        refUrl: "https://www.routledge.com/An-Introduction-to-the-Bootstrap/Efron-Tibshirani/p/book/9780412042317"
      }
    ]
  },

  // ==========================================
  // BAB 6: Inferensi Statistik Klasik & Pengujian Hipotesis Parametrik/Non-Parametrik
  // ==========================================
  {
    orderIndex: 6,
    id: "data-science-ch-6",
    slug: "bab-6-inferensi-statistik-uji-hipotesis-parametrik-non-parametrik",
    title: "BAB 6: Inferensi Statistik Klasik & Pengujian Hipotesis Parametrik/Non-Parametrik",
    desc: "Metodologi pengujian ilmiah data: filosofi Neyman-Pearson vs Fisher, galat Tipe I dan II, p-value dan bahaya p-hacking, uji t (Student's t-test), ANOVA, uji Chi-Square, uji non-parametrik (Mann-Whitney, Kruskal-Wallis), koreksi pengujian berganda (Bonferroni & Benjamini-Hochberg), serta pengukuran effect size.",
    coreConcepts: ["Neyman-Pearson Hypothesis Testing", "p-value & Statistical Power", "ANOVA & Chi-Square", "Non-Parametric Tests", "Multiple Testing Correction"],
    subchapters: [
      {
        num: "6.1",
        slug: "6-1-filosofi-uji-hipotesis-neyman-pearson-vs-fisher",
        title: "6.1. Filosofi Uji Signifikansi Neyman-Pearson vs Fisher",
        desc: "Dua tradisi intelektual pengujian hipotesis: signifikansi induktif Fisher versus kerangka pengambilan keputusan aksioma Neyman-Pearson.",
        concept: `Praktik pengujian hipotesis modern yang diajarkan saat ini sebenarnya adalah hasil hibrida (sering kali membingungkan) antara dua mazhab filosofis yang bersaing: pendekatan Uji Signifikansi Sir Ronald Fisher dan pendekatan Uji Hipotesis Jerzy Neyman & Egon Pearson.
        
Fisher memandang pengujian sebagai alat induktif bagi saintis untuk mengukur bobot bukti terhadap hipotesis nol tunggal ($H_0$). Dalam pandangan Fisher, tidak ada hipotesis alternatif spesifik; $p$-value dihitung sebagai indeks kontinu yang mencerminkan seberapa jarang observasi empiris terjadi di bawah asumsi $H_0$.
        
Sebaliknya, Neyman dan Pearson menolak interpretasi subyektif dari bukti induktif. Mereka merumuskan pengujian sebagai aturan keputusan biner (decision rule) untuk memilih antara dua tindakan yang bersaing berdasarkan dua hipotesis matematis eksplisit: $H_0$ dan $H_1$. Mereka menetapkan laju kesalahan jangka panjang yang dapat ditoleransi (Tingkat Signifikansi $\\alpha$ dan Kekuatan Statistik $1 - \\beta$) sebelum eksperimen dijalankan.`,
        code: `# 6.1: Demonstrasi Kerangka Keputusan Neyman-Pearson vs Fisher p-value
import numpy as np
from scipy import stats

np.random.seed(42)
# Uji A/B: Efektivitas Algoritma Rekomendasi Baru (Metrik: Nilai Transaksi per User)
# H0: mu_A = mu_B ($50) vs H1: mu_B > mu_A (mu_B = $53)
mu_A, sigma = 50.0, 10.0
n = 100
alpha = 0.05

# Data observasi kelompok uji B
data_B = np.random.normal(52.8, sigma, size=n)
x_bar_B = np.mean(data_B)
se = sigma / np.sqrt(n)

# 1. Sudut Pandang Fisher: Menghitung p-value sebagai bobot bukti empiris
z_stat = (x_bar_B - mu_A) / se
p_value_fisher = 1 - stats.norm.cdf(z_stat)

# 2. Sudut Pandang Neyman-Pearson: Menetapkan daerah penolakan kritis apriori
z_kritis_np = stats.norm.ppf(1 - alpha)
ambang_batas_x_bar = mu_A + z_kritis_np * se
keputusan_np = "Tolak H0 (Adopsi Algoritma B)" if x_bar_B > ambang_batas_x_bar else "Gagal Tolak H0"

print("=== KOMPARASI FILOSOFI INFERENSI FISHER VS NEYMAN-PEARSON ===")
print(f"Rata-rata Sampel Teramati (x_bar): \${x_bar_B:.2f}")
print(f"[FISHER] p-value kontinu          : {p_value_fisher:.4f} (Bukti Signifikan jika < 0.05)")
print(f"[NEYMAN-PEARSON] Ambang Kritis   : \${ambang_batas_x_bar:.2f} (z_crit = {z_kritis_np:.2f})")
print(f"[NEYMAN-PEARSON] Keputusan Resmi : {keputusan_np}")`,
        expectedOutput: "Fisher menghasilkan p-value kontinu sementara Neyman-Pearson menghasilkan keputusan biner formal.",
        codeExp: "Skrip membedakan implementasi kalkulasi p-value murni Fisher dengan penentuan ambang batas keputusan apriori berbasis kerangka keputusan Neyman-Pearson.",
        pitfalls: [
          "Mencampuradukkan p-value sebagai probabilitas bahwa hipotesis nol itu benar ($P(H_0 | \\text{Data})$).",
          "Mengubah nilai alpha setelah melihat data (merusak integritas pengendalian laju kesalahan Neyman-Pearson)."
        ],
        refTitle: "E. L. Lehmann: The Fisher, Neyman-Pearson Theories of Testing Hypotheses: One Theory or Two?",
        refUrl: "https://projecteuclid.org/journals/journal-of-the-american-statistical-association/volume-88/issue-424/The-Fisher-Neyman-Pearson-Theories-of-Testing-Hypotheses-One/10.1080/01621459.1993.10476404.short"
      },
      {
        num: "6.2",
        slug: "6-2-tipe-kesalahan-inferensi-dan-statistical-power",
        title: "6.2. Tipe Kesalahan Inferensi: Galat Tipe I, Galat Tipe II, & Statistical Power",
        desc: "Matriks risiko keputusan statistik: trade-off antara false positive (alpha), false negative (beta), dan optimasi kekuatan uji statistik.",
        concept: `Dalam setiap pengujian hipotesis biner, ada dua jenis kesalahan keputusan yang dapat terjadi:
1. **Galat Tipe I (Type I Error / $\\alpha$):** Menolak $H_0$ padahal $H_0$ sesungguhnya benar (False Positive). Laju toleransi maksimum kesalahan ini disebut Tingkat Signifikansi (biasanya ditetapkan 5%).
2. **Galat Tipe II (Type II Error / $\\beta$):** Gagal menolak $H_0$ padahal $H_0$ sesungguhnya salah dan ada efek nyata (False Negative).
        
**Statistical Power (Kekuatan Statistik / $1 - \\beta$)** adalah probabilitas bahwa pengujian akan menolak $H_0$ secara tepat ketika ada efek riil dengan ukuran tertentu. Dalam sains data industri, eksperimen dengan kekuatan rendah (underpowered experiments) adalah pemborosan besar karena gagal mendeteksi peningkatan metrik bisnis yang sebenarnya bernilai jutaan dolar.
        
Kekuatan statistik ditentukan oleh empat faktor yang saling terikat: ukuran sampel $n$, besarnya efek minimum yang ingin dideteksi (Minimum Detectable Effect / MDE), tingkat signifikansi $\\alpha$, dan variabilitas inheren data $\\sigma$.`,
        formula: `\\text{Power} = 1 - \\beta = \\Phi\\left( \\frac{|\\mu_1 - \\mu_0| \\sqrt{n}}{\\sigma} - z_{1-\\alpha/2} \\right)`,
        code: `# 6.2: Perhitungan Ukuran Sampel dan Analisis Kekuatan Uji (Statistical Power)
from statsmodels.stats.power import TTestIndPower

# Parameter Desain Eksperimen Sains Data
effect_size_cohen_d = 0.20 # Efek kecil yang ingin dideteksi (Cohen's d)
alpha_toleransi = 0.05     # Galat Tipe I
power_target = 0.80        # Target Kekuatan Statistik 80% (Galat Tipe II = 20%)

analysis = TTestIndPower()
sample_size_per_group = analysis.solve_power(
    effect_size=effect_size_cohen_d,
    alpha=alpha_toleransi,
    power=power_target,
    ratio=1.0,
    alternative='two-sided'
)

# Kurva sensitivitas kekuatan terhadap ukuran sampel aktual
sample_test_range = [100, 250, 400, int(sample_size_per_group)]
powers = [analysis.power(effect_size=effect_size_cohen_d, nobs1=n, alpha=alpha_toleransi) for n in sample_test_range]

print("=== ANALISIS POWER & SAMPLE SIZE PLANNING ===")
print(f"Target Power: {power_target*100:.0f}% | Cohen's d: {effect_size_cohen_d} | Alpha: {alpha_toleransi}")
print(f"Jumlah Sampel Minimum yang Diperlukan per Grup: {int(np.ceil(sample_size_per_group))} pengguna\\n")
print("Sensitivitas Power terhadap Ukuran Sampel:")
for n_eval, p_eval in zip(sample_test_range, powers):
    print(f"- n = {n_eval:4d} per grup -> Statistical Power: {p_eval*100:5.2f}%")`,
        expectedOutput: "Diperlukan ~393 sampel per grup untuk mencapai 80% statistical power pada efek Cohen's d = 0.2.",
        codeExp: "Skrip menggunakan modul statsmodels.stats.power untuk menghitung kebutuhan sampel minimum sebelum meluncurkan eksperimen A/B demi mencegah uji yang underpowered.",
        pitfalls: [
          "Menjalankan uji A/B tanpa analisis daya awal, lalu menyimpulkan 'fitur baru tidak berpengaruh' padahal sampel terlalu kecil untuk mendeteksi perbedaannya.",
          "Mengecek hasil uji setiap hari dan menghentikan pengujian begitu p < 0.05 tercapai (peeking problem yang melipatgandakan Galat Tipe I)."
        ],
        refTitle: "Jacob Cohen: Statistical Power Analysis for the Behavioral Sciences (2nd Edition)",
        refUrl: "https://www.routledge.com/Statistical-Power-Analysis-for-the-Behavioral-Sciences/Cohen/p/book/9780805802832"
      },
      {
        num: "6.3",
        slug: "6-3-p-value-dan-bahaya-p-hacking",
        title: "6.3. p-Value: Definisi Matematis, Misinterpretasi, & Bahaya p-Hacking",
        desc: "Dekonstruksi metrik paling kontroversial: pernyataan resmi American Statistical Association (ASA) dan demonstrasi replikasi krisis p-hacking.",
        concept: `Secara matematis ketat, $p$-value adalah probabilitas, di bawah asumsi bahwa hipotesis nol ($H_0$) benar, untuk memperoleh statistik uji yang sama ekstremnya atau lebih ekstrem daripada nilai yang benar-benar teramati dalam sampel data.
        
Pada tahun 2016, American Statistical Association (ASA) menerbitkan pernyataan resmi darurat untuk memperingatkan komunitas sains global tentang kesalahpahaman luas terhadap $p$-value:
1. $p$-value **bukan** probabilitas bahwa hipotesis nol itu benar, dan bukan probabilitas bahwa data terjadi secara kebetulan semata.
2. Keputusan bisnis atau saintifik tidak boleh didasarkan semata-mata pada apakah $p$-value berada di bawah ambang batas arbitrer (seperti 0.05).
3. $p$-value tidak mengukur besarnya efek (effect size) atau signifikansi praktis suatu temuan.
        
Bahaya paling merusak dalam analitik data adalah *p-hacking* (data dredging): mencoba puluhan kombinasi subkelompok, menghapus outlier secara subjektif, atau menguji puluhan metrik secara bersamaan hingga menemukan $p < 0.05$, yang menghasilkan temuan palsu yang tidak dapat direplikasi di dunia nyata.`,
        formula: `p\\text{-value} = P(T(X) \\ge t_{\\text{obs}} \\mid H_0)`,
        code: `# 6.3: Simulasi Bahaya p-Hacking: Menemukan Korelasi Semu Signifikan dari Data Acak Murni
import numpy as np
import pandas as pd
from scipy import stats

np.random.seed(42)
# Menghasilkan 50 variabel acak murni yang sama sekali tidak berkorelasi (H0 sejati)
N = 100
jumlah_fitur = 50
X_acak = np.random.normal(0, 1, size=(N, jumlah_fitur))
target_acak = np.random.normal(0, 1, size=N)

# p-hacking: Menguji korelasi setiap variabel dengan target secara naif
korelasi_signifikan = []

for i in range(jumlah_fitur):
    r, p_val = stats.pearsonr(X_acak[:, i], target_acak)
    if p_val < 0.05: # Memilih hanya yang "lolos signifikansi"
        korelasi_signifikan.append((f"Fitur_Acak_{i+1}", r, p_val))

print("=== DEMONSTRASI BAHAYA P-HACKING DARI DATA ACAK MURNI ===")
print(f"Total Uji Korelasi yang Dijalankan: {jumlah_fitur}")
print(f"Jumlah Korelasi 'Signifikan' (p < 0.05) yang Ditemukan: {len(korelasi_signifikan)}")
print("\\nTemuan Palsu Hasil p-Hacking:")
for nama, r, p in korelasi_signifikan:
    print(f"- {nama:15s} | Korelasi r: {r:6.3f} | p-value: {p:.4f} (TEMUAN SEMU!)")`,
        expectedOutput: "Ditemukan beberapa korelasi yang 'signifikan secara statistik' murni karena kebetulan acak.",
        codeExp: "Skrip menunjukkan bahwa menjalankan banyak pengujian statistik independen pada derau acak murni pasti akan menghasilkan beberapa 'temuan signifikan' secara keliru jika tidak dikoreksi.",
        pitfalls: [
          "Mencoba berbagai subset data hingga memperoleh p < 0.05 lalu menyembunyikan percobaan-percobaan sebelumnya (selective reporting).",
          "Menyimpulkan bahwa korelasi dengan p < 0.0001 memiliki dampak bisnis besar tanpa mengevaluasi nilai koefisien r riilnya."
        ],
        refTitle: "Ronald L. Wasserstein & Nicole A. Lazar: The ASA Statement on p-Values: Context, Process, and Purpose",
        refUrl: "https://www.tandfonline.com/doi/full/10.1080/00031305.2016.1154108"
      },
      {
        num: "6.4",
        slug: "6-4-student-t-test-independen-dan-berpasangan",
        title: "6.4. One-Sample, Independent Two-Sample, & Paired Student's t-Test",
        desc: "Uji parametrik komparasi rata-rata: uji t satu sampel, uji t independen (Welch vs Student klasik), dan uji t sampel berpasangan.",
        concept: `Uji $t$ Student adalah salah satu pilar inferensi parametrik yang paling sering digunakan untuk menguji hipotesis perbedaan rata-rata ketika varians populasi tidak diketahui.
        
Terdapat tiga varian utama uji $t$:
1. **One-Sample $t$-Test:** Menguji apakah rata-rata suatu sampel tunggal berbeda secara signifikan dari nilai konstan acuan teoretis $\\mu_0$.
2. **Two-Sample Independent $t$-Test:** Menguji apakah rata-rata dua kelompok independen (misalnya kelompok kontrol vs perlakuan pada uji A/B) berbeda secara signifikan. Jika varians kedua populasi tidak dapat diasumsikan sama (asumsi homoskedastisitas dilanggar), **Welch's $t$-test** wajib digunakan untuk menghindari inflasi Galat Tipe I.
3. **Paired-Samples $t$-Test:** Menguji perbedaan rata-rata dari subjek yang sama yang diukur dua kali dalam kondisi sebelum dan sesudah perlakuan (within-subjects design), yang mengisolasi variabilitas antar-individu.`,
        formula: `t_{\\text{Welch}} = \\frac{\\bar{X}_1 - \\bar{X}_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}}, \\quad df \\approx \\frac{\\left(\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}\\right)^2}{\\frac{(s_1^2/n_1)^2}{n_1-1} + \\frac{(s_2^2/n_2)^2}{n_2-1}}`,
        code: `# 6.4: Uji t Dua Sampel Independen (Student vs Welch) dan Paired t-Test
import numpy as np
from scipy import stats

np.random.seed(42)
# Skenario 1: Dua kelompok dengan varians berbeda nyata (Heteroskedastisitas)
kontrol = np.random.normal(loc=120, scale=15, size=40)
perlakuan = np.random.normal(loc=132, scale=35, size=35) # Varians jauh lebih besar

# Uji t Klasik (equal_var=True) vs Welch's t-test (equal_var=False)
t_stat_stud, p_stud = stats.ttest_ind(perlakuan, kontrol, equal_var=True)
t_stat_welch, p_welch = stats.ttest_ind(perlakuan, kontrol, equal_var=False)

# Skenario 2: Sampel Berpasangan (Waktu respons aplikasi sebelum & sesudah indexing DB)
sebelum = np.random.normal(250, 30, size=50)
sesudah = sebelum - np.random.normal(45, 10, size=50) # Penurunan nyata 45ms

t_paired, p_paired = stats.ttest_rel(sesudah, sebelum)

print("=== HASIL UJI T DUA SAMPEL (INDEPENDEN & BERPASANGAN) ===")
print(f"Student t (Asumsi Var Sama): t = {t_stat_stud:.4f}, p = {p_stud:.4e}")
print(f"Welch's t (Koreksi Welch)  : t = {t_stat_welch:.4f}, p = {p_welch:.4e} (DIREKOMENDASIKAN)")
print(f"Paired t-Test (Sebelum vs Sesudah): t = {t_paired:.4f}, p = {p_paired:.4e}")`,
        expectedOutput: "Welch's t-test berhasil mengakomodasi heteroskedastisitas varians dengan derajat kebebasan yang disesuaikan.",
        codeExp: "Skrip membandingkan implementasi t-test klasik dengan Welch's t-test pada data heteroskedastis serta mendemonstrasikan efisiensi uji berpasangan untuk mengisolasi efek perlakuan.",
        pitfalls: [
          "Menggunakan Student's t-test klasik secara default tanpa memeriksa asumsi kesamaan varians (homoskedastisitas). Welch's t-test harus menjadi default universal.",
          "Menerapkan independent t-test pada data pengukuran berulang (repeated measures) sebelum-sesudah yang seharusnya menggunakan paired t-test."
        ],
        refTitle: "B. L. Welch: The Generalization of 'Student's' Problem when Several Different Population Variances are Involved",
        refUrl: "https://academic.oup.com/biomet/article/34/1-2/28/223789"
      },
      {
        num: "6.5",
        slug: "6-5-one-way-anova-dan-post-hoc-tukey-hsd",
        title: "6.5. Analisis Varians Satu Arah (One-Way ANOVA) & Post-Hoc Tukey HSD",
        desc: "Komparasi rata-rata multi-kelompok: dekomposisi varians total, rasio F Fisher-Snedecor, dan koreksi perbandingan berpasangan Tukey HSD.",
        concept: `Ketika analis perlu membandingkan rata-rata dari tiga atau lebih kelompok eksperimen (misalnya menguji 4 variasi landing page A, B, C, dan D), melakukan serangkaian uji $t$ dua sampel secara berulang adalah kesalahan metodologis serius yang dikenal sebagai inflasi galat perbandingan berpasangan (family-wise error rate).
        
Analisis Varians Satu Arah (One-Way ANOVA) mengatasi masalah ini dengan menguji hipotesis nol global bahwa semua rata-rata kelompok adalah identik ($H_0: \\mu_1 = \\mu_2 = \\dots = \\mu_k$). ANOVA mendekomposisi variabilitas total data menjadi dua komponen: variabilitas antar kelompok (Between-Group Variance / $MS_B$) dan variabilitas di dalam kelompok (Within-Group Error Variance / $MS_W$). Rasio keduanya menghasilkan statistik $F$.
        
Jika statistik $F$ signifikan ($p < 0.05$), ANOVA hanya memberi tahu bahwa *setidaknya ada satu* pasangan kelompok yang berbeda secara signifikan, namun tidak memberi tahu pasangan mana. Untuk mengidentifikasi pasangan yang berbeda secara spesifik tanpa melipatgandakan Galat Tipe I, prosedur post-hoc **Tukey Honestly Significant Difference (HSD)** wajib dijalankan.`,
        formula: `F = \\frac{\\text{MS}_{\\text{Between}}}{\\text{MS}_{\\text{Within}}} = \\frac{\\sum_{i=1}^k n_i (\\bar{X}_i - \\bar{X})^2 / (k - 1)}{\\sum_{i=1}^k \\sum_{j=1}^{n_i} (X_{ij} - \\bar{X}_i)^2 / (N - k)}`,
        code: `# 6.5: One-Way ANOVA dan Post-Hoc Test Tukey HSD pada Eksperimen 4 Variasi UI
import numpy as np
import pandas as pd
from scipy import stats
from statsmodels.stats.multicomp import pairwise_tukeyhsd

np.random.seed(42)
# 4 Varian Desain Halaman: Rata-rata durasi engagement pengguna (detik)
ui_A = np.random.normal(loc=45, scale=8, size=50)
ui_B = np.random.normal(loc=46, scale=8, size=50) # Hampir sama dengan A
ui_C = np.random.normal(loc=54, scale=8, size=50) # Lebih tinggi nyata
ui_D = np.random.normal(loc=44, scale=8, size=50)

# 1. Uji ANOVA Global (F-test)
f_stat, p_val_anova = stats.f_oneway(ui_A, ui_B, ui_C, ui_D)

# 2. Post-Hoc Tukey HSD untuk Menemukan Pasangan Berbeda Nyata
df_exp = pd.DataFrame({
    'Durasi': np.concatenate([ui_A, ui_B, ui_C, ui_D]),
    'Varian': ['UI_A']*50 + ['UI_B']*50 + ['UI_C']*50 + ['UI_D']*50
})

tukey = pairwise_tukeyhsd(endog=df_exp['Durasi'], groups=df_exp['Varian'], alpha=0.05)

print("=== HASIL ONE-WAY ANOVA & TUKEY HSD ===")
print(f"Statistik F ANOVA: {f_stat:.4f} | p-value: {p_val_anova:.4e}")
print("\\nRingkasan Post-Hoc Tukey HSD:")
print(tukey.summary())`,
        expectedOutput: "ANOVA signifikan (p < 0.001) dan Tukey HSD menunjukkan UI_C berbeda signifikan terhadap seluruh UI lain.",
        codeExp: "Skrip mengeksekusi uji ANOVA omnibus untuk memverifikasi perbedaan antarkelompok secara simultan, diikuti pengujian post-hoc Tukey HSD untuk menentukan pasangan yang berbeda dengan pengontrolan FWER.",
        pitfalls: [
          "Melakukan 6 kali t-test independen pada 4 kelompok alih-alih ANOVA, yang melipatgandakan risiko kesalahan palsu hingga 1 - (0.95)^6 ≈ 26.5%.",
          "Menjalankan uji post-hoc ketika uji ANOVA omnibus global tidak menghasilkan nilai signifikansi (p > 0.05)."
        ],
        refTitle: "Douglas C. Montgomery: Design and Analysis of Experiments (10th Edition)",
        refUrl: "https://www.wiley.com/en-us/Design+and+Analysis+of+Experiments%2C+10th+Edition-p-9781119492443"
      },
      {
        num: "6.6",
        slug: "6-6-uji-independensi-chi-square-dan-kontingensi",
        title: "6.6. Uji Independensi Chi-Square (Chi^2) & Tabel Kontingensi",
        desc: "Inferensi data frekuensi kategorik: perbandingan frekuensi observasi vs ekspektasi, statistik Pearson Chi-Square, dan koreksi kontinuitas Yates.",
        concept: `Ketika kedua variabel yang diteliti bersifat kategorik diskret (misalnya jenis industri pelanggan vs pilihan paket langganan SaaS), uji rata-rata numerik seperti uji $t$ atau ANOVA tidak dapat diterapkan.
        
Uji Independensi Chi-Square ($\\chi^2$) Karl Pearson mengevaluasi apakah terdapat asosiasi statistik yang signifikan antara dua variabel kategorik dalam tabel kontingensi baris $\\times$ kolom ($r \\times c$). Hipotesis nol menyatakan bahwa kedua variabel tersebut saling independen: $P(A \\cap B) = P(A) P(B)$.
        
Statistik $\\chi^2$ dihitung dengan mengukur deviasi kuadrat terbobot antara frekuensi yang teramati secara nyata ($O_{ij}$) dan frekuensi yang diharapkan secara teoretis ($E_{ij}$) jika $H_0$ benar. Asumsi krusial uji ini adalah bahwa tidak boleh ada sel tabel kontingensi dengan frekuensi harapan $E_{ij} < 1$, dan tidak lebih dari 20% sel yang memiliki $E_{ij} < 5$. Jika asumsi ini dilanggar, **Fisher's Exact Test** harus digunakan.`,
        formula: `\\chi^2 = \\sum_{i=1}^r \\sum_{j=1}^c \\frac{(O_{ij} - E_{ij})^2}{E_{ij}}, \\quad E_{ij} = \\frac{(\\sum_k O_{ik})(\\sum_k O_{kj})}{N}`,
        code: `# 6.6: Uji Independensi Chi-Square dan Perhitungan Effect Size (Cramer's V)
import numpy as np
import pandas as pd
from scipy import stats

# Tabel Kontingensi: Segmen Pelanggan vs Status Churn
# Kolom: [Aktif, Churn]
tabel_kontingensi = np.array([
    [450, 50],   # Segmen Enterprise
    [320, 80],   # Segmen Mid-Market
    [180, 120]   # Segmen SMB
])

chi2_stat, p_val, dof, expected = stats.chi2_contingency(tabel_kontingensi)

# Menghitung Cramer's V sebagai ukuran kekuatan asosiasi kategorik
n_total = np.sum(tabel_kontingensi)
r, k = tabel_kontingensi.shape
cramers_v = np.sqrt(chi2_stat / (n_total * (min(r, k) - 1)))

print("=== HASIL UJI INDEPENDENSI CHI-SQUARE ===")
print(f"Statistik Chi-Square: {chi2_stat:.4f}")
print(f"Derajat Kebebasan (df): {dof}")
print(f"p-value               : {p_val:.4e}")
print(f"Ukuran Efek (Cramer's V): {cramers_v:.4f} (Asosiasi Moderat)\\n")
print("Tabel Frekuensi Harapan Teoretis (E_ij):")
df_exp = pd.DataFrame(expected, index=['Enterprise', 'Mid-Market', 'SMB'], columns=['Aktif', 'Churn'])
print(df_exp.round(2))`,
        expectedOutput: "Chi-square sangat signifikan (p < 0.001) dengan Cramer's V ~ 0.23 menunjukkan asosiasi nyata.",
        codeExp: "Skrip mengeksekusi uji chi-square kontingensi menggunakan scipy.stats, memverifikasi matriks ekspektasi, dan menghitung koefisien Cramer's V untuk menilai kekuatan asosiasi praktis.",
        pitfalls: [
          "Menerapkan uji Chi-Square pada data observasi berpasangan atau berulang (seharusnya menggunakan Uji McNemar).",
          "Mengabaikan peringatan frekuensi harapan rendah ($E_{ij} < 5$) pada tabel kontingensi kecil yang membuat aproksimasi Chi-Square bias."
        ],
        refTitle: "Alan Agresti: Categorical Data Analysis (3rd Edition)",
        refUrl: "https://www.wiley.com/en-us/Categorical+Data+Analysis%2C+3rd+Edition-p-9780470583005"
      },
      {
        num: "6.7",
        slug: "6-7-uji-non-parametrik-mann-whitney-u",
        title: "6.7. Uji Non-Parametrik: Mann-Whitney U Test (Wilcoxon Rank-Sum)",
        desc: "Alternatif bebas distribusi untuk dua kelompok independen: transformasi peringkat data, statistik U, dan robustness terhadap pencilan ekstrem.",
        concept: `Ketika data empiris memiliki skewness tinggi, mengandung pencilan (outlier) ekstrem yang tidak dapat dihapus, atau skala pengukuran bersifat ordinal, asumsi normalitas yang mendasari uji $t$ Student dilanggar secara fatal. Dalam situasi ini, pengujian hipotesis non-parametrik adalah solusi yang sah.
        
Uji Mann-Whitney $U$ (dikenal juga sebagai Wilcoxon Rank-Sum Test) adalah ekuivalen non-parametrik dari independent two-sample $t$-test. Alih-alih membandingkan rata-rata aritmatika mentah, uji ini menggabungkan seluruh observasi dari kedua kelompok, mengurutkannya dari terkecil ke terbesar, dan mengganti setiap nilai data mentah dengan nilai peringkatnya (ranks $1, 2, \\dots, N$).
        
Uji Mann-Whitney menguji hipotesis nol kesetaraan stokastik: bahwa probabilitas suatu observasi acak dari populasi $X$ lebih besar daripada observasi acak dari populasi $Y$ adalah tepat 0.5 ($P(X > Y) = 0.5$). Uji ini sepenuhnya kebal terhadap transformasi monotonik dan pencilan ekstrem.`,
        formula: `U_1 = R_1 - \\frac{n_1(n_1 + 1)}{2}, \\quad U_2 = n_1 n_2 - U_1`,
        code: `# 6.7: Uji Mann-Whitney U pada Data Waktu Penanganan Tiket dengan Outlier Ekstrem
import numpy as np
from scipy import stats

np.random.seed(42)
# Waktu penyelesaian tiket customer support (menit)
# Kelompok Tradisional: Log-normal dengan beberapa outlier tiket macet ekstrem
kelompok_tradisional = np.concatenate([
    np.random.lognormal(mean=2.5, sigma=0.5, size=45),
    [1200.0, 2400.0, 3100.0] # 3 Outlier ekstrem
])

# Kelompok Sistem Otomasi Baru: Waktu lebih stabil
kelompok_otomasi = np.random.lognormal(mean=2.2, sigma=0.4, size=50)

# Komparasi Uji t (Sensitif Outlier) vs Mann-Whitney U (Robust Peringkat)
t_stat, p_t = stats.ttest_ind(kelompok_tradisional, kelompok_otomasi, equal_var=False)
u_stat, p_u = stats.mannwhitneyu(kelompok_tradisional, kelompok_otomasi, alternative='two-sided')

print("=== PERBANDINGAN PARAMETRIK VS NON-PARAMETRIK DENGAN OUTLIER ===")
print(f"Rata-rata Tradisional: {np.mean(kelompok_tradisional):.2f} menit | Median: {np.median(kelompok_tradisional):.2f}")
print(f"Rata-rata Otomasi    : {np.mean(kelompok_otomasi):.2f} menit | Median: {np.median(kelompok_otomasi):.2f}\\n")
print(f"Uji t Welch (Parametrik)    : t = {t_stat:.4f} | p-value = {p_t:.4f} (Gagal Signifikan karena Outlier)")
print(f"Mann-Whitney U (Non-Parametrik): U = {u_stat:.1f} | p-value = {p_u:.4f} (BERHASIL MENDETEKSI PERBEDAAN)")`,
        expectedOutput: "Uji t terdistorsi oleh outlier (p > 0.05), sedangkan Mann-Whitney U sukses mendeteksi signifikansi.",
        codeExp: "Skrip menunjukkan bagaimana transformasi peringkat pada uji Mann-Whitney U melindungi analis dari kegagalan inferensi yang disebabkan oleh pencilan ekstrem.",
        pitfalls: [
          "Menyatakan bahwa Mann-Whitney U selalu menguji perbedaan median populasi; hal itu hanya benar jika kedua distribusi memiliki bentuk sebaran identik.",
          "Menerapkan Mann-Whitney U pada data sampel yang saling berpasangan (seharusnya menggunakan Wilcoxon Signed-Rank Test)."
        ],
        refTitle: "Myles Hollander, Douglas A. Wolfe, Eric Chicken: Nonparametric Statistical Methods (3rd Edition)",
        refUrl: "https://www.wiley.com/en-us/Nonparametric+Statistical+Methods%2C+3rd+Edition-p-9780470387375"
      },
      {
        num: "6.8",
        slug: "6-8-wilcoxon-signed-rank-dan-kruskal-wallis",
        title: "6.8. Uji Non-Parametrik: Wilcoxon Signed-Rank & Kruskal-Wallis H",
        desc: "Alternatif non-parametrik untuk data berpasangan dan multi-kelompok: uji peringkat bertanda Wilcoxon dan One-Way ANOVA non-parametrik Kruskal-Wallis.",
        concept: `Dua alat non-parametrik penting lainnya dalam kotak peralatan ilmuwan data adalah Wilcoxon Signed-Rank Test dan Kruskal-Wallis $H$ Test.
        
**Wilcoxon Signed-Rank Test** adalah padanan non-parametrik dari paired $t$-test. Uji ini menghitung selisih antara pasangan observasi sebelum dan sesudah ($D_i = Y_i - X_i$), membuang selisih yang bernilai nol, memberi peringkat pada nilai absolut selisih $|D_i|$, dan kemudian menjumlahkan peringkat dari selisih yang bertanda positif versus negatif. Uji ini sangat efektif untuk mengukur kepuasan pengguna (skala Likert) sebelum dan sesudah intervensi.
        
**Kruskal-Wallis $H$ Test** adalah generalisasi non-parametrik dari One-Way ANOVA untuk membandingkan tiga kelompok independen atau lebih. Uji ini menggabungkan seluruh observasi dari semua kelompok ke dalam satu peringkat gabungan, lalu menguji apakah peringkat rata-rata antarkelompok berbeda secara signifikan dari apa yang diharapkan di bawah hipotesis nol.`,
        formula: `H = \\frac{12}{N(N+1)} \\sum_{i=1}^k \\frac{R_i^2}{n_i} - 3(N + 1)`,
        code: `# 6.8: Demonstrasi Wilcoxon Signed-Rank & Kruskal-Wallis H pada Data Non-Normal
import numpy as np
from scipy import stats

np.random.seed(42)
# 1. Wilcoxon Signed-Rank: Skor Kepuasan Pengguna (Skala Ordinal 1-10) Sebelum & Sesudah
skor_sebelum = np.random.choice(np.arange(1, 11), size=40, p=[0.1, 0.1, 0.2, 0.3, 0.15, 0.05, 0.05, 0.03, 0.01, 0.01])
skor_sesudah = np.clip(skor_sebelum + np.random.choice([-1, 0, 1, 2], size=40, p=[0.05, 0.2, 0.45, 0.3]), 1, 10)

res_wilcoxon = stats.wilcoxon(skor_sesudah, skor_sebelum)

# 2. Kruskal-Wallis: Evaluasi Algoritma Search Engine (3 Kelompok Algoritma: A, B, C)
waktu_A = stats.expon.rvs(scale=10, size=30)
waktu_B = stats.expon.rvs(scale=11, size=30)
waktu_C = stats.expon.rvs(scale=6, size=30) # Jauh lebih cepat

res_kruskal = stats.kruskal(waktu_A, waktu_B, waktu_C)

print("=== HASIL UJI WILCOXON SIGNED-RANK & KRUSKAL-WALLIS H ===")
print(f"Wilcoxon Signed-Rank (Sebelum vs Sesudah): Stat = {res_wilcoxon.statistic:.1f}, p = {res_wilcoxon.pvalue:.4e}")
print(f"Kruskal-Wallis H (Multi-Kelompok Eksponensial): H = {res_kruskal.statistic:.4f}, p = {res_kruskal.pvalue:.4e}")`,
        expectedOutput: "Kedua uji non-parametrik berhasil mengonfirmasi perbedaan signifikan pada data ordinal dan eksponensial.",
        codeExp: "Skrip mengilustrasikan penerapan Wilcoxon Signed-Rank untuk data ordinal terikat dan Kruskal-Wallis H untuk data waktu respons multi-grup dengan distribusi eksponensial miring.",
        pitfalls: [
          "Menggunakan ANOVA parametrik biasa pada data berskala Likert 1-5 yang jelas-jelas tidak memenuhi asumsi interval metrik kontinu.",
          "Lupa bahwa jika Kruskal-Wallis signifikan, uji post-hoc non-parametrik yang tepat adalah Dunn's Test dengan koreksi p-value."
        ],
        refTitle: "William H. Kruskal & W. Allen Wallis: Use of Ranks in One-Criterion Variance Analysis",
        refUrl: "https://www.tandfonline.com/doi/abs/10.1080/01621459.1952.10483441"
      },
      {
        num: "6.9",
        slug: "6-9-koreksi-pengujian-berganda-bonferroni-fdr",
        title: "6.9. Koreksi Uji Hipotesis Berganda: Bonferroni vs False Discovery Rate (FDR)",
        desc: "Pengendalian kesalahan simultan: pengendalian Family-Wise Error Rate (FWER) versus False Discovery Rate Benjamini-Hochberg pada pengujian masif.",
        concept: `Dalam era sains data modern, praktisi sering kali menguji ratusan atau ribuan hipotesis secara simultan—misalnya menguji ribuan kata kunci iklan, ratusan segmen audiens, atau puluhan ribu fitur genomik.
        
Jika 1.000 uji independen dijalankan pada tingkat signifikansi individual $\\alpha = 0.05$, maka di bawah hipotesis nol sejati kita mengharapkan sekitar $1.000 \\times 0.05 = 50$ temuan positif palsu murni karena fluktuasi acak.
        
Terdapat dua pendekatan utama untuk mengendalikan inflasi kesalahan ini:
1. **Family-Wise Error Rate (FWER):** Mengendalikan probabilitas terjadinya *setidaknya satu* kesalahan Tipe I di antara seluruh keluarga pengujian. Prosedur **Bonferroni** membagi $\\alpha$ dengan jumlah pengujian $m$ ($\\alpha_{\\text{adj}} = \\alpha / m$). Bonferroni sangat konservatif dan sering kali menghilangkan efek nyata (daya statistik anjlok drastis).
2. **False Discovery Rate (FDR):** Diperkenalkan oleh Yoav Benjamini dan Yosef Hochberg (1995), FDR mengendalikan *proporsi yang diharapkan dari penolakan yang keliru* di antara seluruh hipotesis yang ditolak. Prosedur Benjamini-Hochberg (BH) jauh lebih bertenaga (powerful) dan menjadi standar de facto dalam sains data berskala besar.`,
        formula: `P_{(i)} \\le \\frac{i}{m} Q \\implies \\text{Tolak } H_{(1)}, \\dots, H_{(k)}`,
        code: `# 6.9: Demonstrasi Koreksi Uji Berganda: Bonferroni vs Benjamini-Hochberg (FDR)
import numpy as np
import pandas as pd
from statsmodels.stats.multitest import multipletests

np.random.seed(42)
# Simulasi 100 fitur yang diuji (90 tidak ada efek / H0 benar, 10 ada efek nyata / H1 benar)
p_h0 = np.random.uniform(0.0, 1.0, size=90) # p-value acak seragam
p_h1 = np.random.beta(0.5, 20.0, size=10)   # p-value efek nyata sangat kecil
p_values = np.concatenate([p_h0, p_h1])

alpha_global = 0.05

# 1. Tanpa Koreksi (Uncorrected Naive)
tolak_naive = p_values < alpha_global

# 2. Koreksi Bonferroni (FWER)
reject_bonf, p_bonf, _, _ = multipletests(p_values, alpha=alpha_global, method='bonferroni')

# 3. Koreksi Benjamini-Hochberg (FDR)
reject_fdr, p_fdr, _, _ = multipletests(p_values, alpha=alpha_global, method='fdr_bh')

print("=== HASIL PENGUJIAN HIPOTESIS BERGANDA (100 HIPOTESIS) ===")
print(f"Fitur dengan Efek Nyata Sesungguhnya : 10")
print(f"Penolakan Tanpa Koreksi (Banyak Palsu): {np.sum(tolak_naive)} (Inflasi False Positives!)")
print(f"Penolakan Bonferroni (Terlalu Ketat) : {np.sum(reject_bonf)} (Banyak False Negatives)")
print(f"Penolakan Benjamini-Hochberg (FDR)   : {np.sum(reject_fdr)} (Optimal & Berimbang)")`,
        expectedOutput: "FDR Benjamini-Hochberg mengontrol false discovery tanpa kehilangan kekuatan statistik seperti Bonferroni.",
        codeExp: "Skrip membandingkan metode penyesuaian p-value multipletests untuk menunjukkan bagaimana prosedur FDR mempertahankan daya deteksi efek riil sambil menekan penemuan palsu.",
        pitfalls: [
          "Menerapkan koreksi Bonferroni pada ribuan metrik analitik yang menyebabkan hampir tidak ada satu pun eksperimen yang dapat dinyatakan berhasil.",
          "Tidak melakukan koreksi pengujian berganda sama sekali saat menguji 20 variasi segmen promosi secara paralel."
        ],
        refTitle: "Yoav Benjamini & Yosef Hochberg: Controlling the False Discovery Rate: A Practical and Powerful Approach to Multiple Testing",
        refUrl: "https://www.jstor.org/stable/2346101"
      },
      {
        num: "6.10",
        slug: "6-10-ukuran-efek-dan-signifikansi-praktis",
        title: "6.10. Ukuran Efek (Effect Size): Cohen's d, Eta-Squared, & Odds Ratio",
        desc: "Melampaui signifikansi statistik: mengapa effect size esensial untuk menilai dampak bisnis nyata, Cohen's d, rasio odds, dan interval kepercayaan effect size.",
        concept: `Salah satu kelemahan paling fundamental dari $p$-value adalah ketergantungannya yang ekstrem pada ukuran sampel $n$. Dengan ukuran sampel yang sangat besar (misalnya $n = 1.000.000$ pengguna di platform e-commerce), perbedaan rata-rata waktu loading sebesar 0.001 milidetik dapat menghasilkan nilai $p < 0.00001$, padahal perbedaan tersebut sama sekali tidak memiliki signifikansi praktis maupun finansial bagi pengguna.
        
Ukuran Efek (Effect Size) mengukur besarnya magnitudo dampak independen dari ukuran sampel. Effect size menjawab pertanyaan bisnis yang sesungguhnya: *'Seberapa besar perbedaan atau hubungan yang terjadi di dunia nyata?'*.
        
Tiga metrik effect size paling standar:
1. **Cohen's $d$:** Standarisasi perbedaan rata-rata antara dua kelompok (dibagi deviasi standar gabungan). Pedoman umum Cohen: $d = 0.2$ (kecil), $d = 0.5$ (sedang), $d = 0.8$ (besar).
2. **Eta Squared ($\\eta^2$) / Partial $\\eta^2$:** Proporsi varians total variabel respons yang dijelaskan oleh faktor perlakuan dalam ANOVA.
3. **Odds Ratio (OR):** Rasio probabilitas terjadinya suatu kejadian dalam kelompok terpapar dibandingkan kelompok tidak terpapar pada tabel kontingensi.`,
        formula: `d = \\frac{\\bar{X}_1 - \\bar{X}_2}{s_{\\text{pooled}}}, \\quad s_{\\text{pooled}} = \\sqrt{\\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}}`,
        code: `# 6.10: Perhitungan Cohen's d, Odds Ratio, dan Komparasi Signifikansi Statistik vs Praktis
import numpy as np

# Skenario Big Data: n = 500.000 pengguna
n = 500000
# Peningkatan checkout conversion dari 3.00% menjadi 3.01% (perbedaan 0.01%)
p_A, p_B = 0.0300, 0.0301

# Cohen's h untuk proporsi
cohens_h = 2 * (np.arcsin(np.sqrt(p_B)) - np.arcsin(np.sqrt(p_A)))

# Standardized Mean Difference (Cohen's d) untuk data numerik belanja
np.random.seed(42)
belanja_A = np.random.normal(100.0, 20.0, size=100)
belanja_B = np.random.normal(112.0, 20.0, size=100)

s_pooled = np.sqrt(((len(belanja_A)-1)*np.var(belanja_A, ddof=1) + (len(belanja_B)-1)*np.var(belanja_B, ddof=1)) / (len(belanja_A)+len(belanja_B)-2))
cohens_d = (np.mean(belanja_B) - np.mean(belanja_A)) / s_pooled

# Odds Ratio
odds_A = p_A / (1 - p_A)
odds_B = p_B / (1 - p_B)
odds_ratio = odds_B / odds_A

print("=== KUANTIFIKASI EFFECT SIZE & SIGNIFIKANSI PRAKTIS ===")
print(f"Cohen's d Pengeluaran Belanja: {cohens_d:.4f} (Dampak Signifikan Sedang-ke-Besar)")
print(f"Cohen's h Proporsi Big Data  : {cohens_h:.6f} (Efek Praktis Dapat Diabaikan)")
print(f"Odds Ratio Konversi          : {odds_ratio:.4f}")`,
        expectedOutput: "Cohen's d ~ 0.60 menunjukkan dampak nyata, sementara Cohen's h sangat kecil membuktikan efek semu pada big data.",
        codeExp: "Skrip menghitung Cohen's d dan Odds Ratio untuk mengilustrasikan bagaimana effect size membedakan antara temuan yang bermakna praktis dengan temuan yang sekadar signifikan akibat ukuran sampel masif.",
        pitfalls: [
          "Melaporkan keberhasilan produk hanya berdasarkan 'p < 0.001' tanpa menyertakan effect size dan interval kepercayaan besaran dampaknya.",
          "Menggunakan aturan batas Cohen (0.2, 0.5, 0.8) secara kaku tanpa mempertimbangkan konteks ekonomi domain industri spesifik."
        ],
        refTitle: "Robert J. Grissom & John J. Kim: Effect Sizes for Research: Univariate and Multivariate Applications",
        refUrl: "https://www.routledge.com/Effect-Sizes-for-Research-Univariate-and-Multivariate-Applications/Grissom-Kim/p/book/9780415877695"
      }
    ]
  },

  // ==========================================
  // BAB 7: Regresi Linier Klasik, Asumsi Gauss-Markov, & Diagnostik Residual OLS
  // ==========================================
  {
    orderIndex: 7,
    id: "data-science-ch-7",
    slug: "bab-7-regresi-linier-klasik-gauss-markov-diagnostik-ols",
    title: "BAB 7: Regresi Linier Klasik, Asumsi Gauss-Markov, & Diagnostik Residual OLS",
    desc: "Fondasi pemodelan parametrik penjelas: aljabar linier Ordinary Least Squares (OLS), dekomposisi varians R-squared, teorema Gauss-Markov dan sifat BLUE, pengujian asumsi residual (homoskedastisitas, autokorelasi, normalitas), deteksi multikolinieritas VIF, identifikasi titik pengaruh ekstrem Cook's distance, serta transformasi Box-Cox.",
    coreConcepts: ["OLS Matrix Formulation", "Gauss-Markov Theorem & BLUE", "Residual Diagnostics (Heteroscedasticity, Normality)", "Multicollinearity & VIF", "Influential Points & Cook's Distance"],
    subchapters: [
      {
        num: "7.1",
        slug: "7-1-formulasi-matriks-ols-dan-normal-equations",
        title: "7.1. Formulasi Matriks OLS: Normal Equations & Solusi Proyeksi Ortogonal",
        desc: "Penurunan analitis regresi linier berganda: representasi matriks, minimasi jumlah kuadrat galat, dan solusi tertutup normal equations.",
        concept: `Regresi Linier Berganda adalah salah satu instrumen analitik paling fundamental dalam sains data untuk memodelkan hubungan kuantitatif antara satu variabel dependen skalar $y \\in \\mathbb{R}^n$ dengan $p$ variabel prediktor independen $X \\in \\mathbb{R}^{n \\times (p+1)}$ (termasuk kolom intercept).
        
Model linier dinyatakan dalam bentuk matriks sebagai $y = X\\beta + \\epsilon$. Metode Ordinary Least Squares (OLS) bertujuan mencari vektor koefisien $\\hat{\\beta}$ yang meminimalkan Jumlah Kuadrat Residual (Residual Sum of Squares / $RSS$): $RSS(\\beta) = (y - X\\beta)^T (y - X\\beta)$.
        
Dengan menurunkan fungsi kuadratik terhadap vektor $\\beta$ dan menyamakannya dengan nol vektor, kita memperoleh sistem persamaan aljabar linier yang dikenal sebagai **Normal Equations**: $X^T X \\hat{\\beta} = X^T y$. Jika matriks $X^T X$ berperingkat penuh (full column rank, tidak ada multikolinieritas sempurna), solusinya adalah proyeksi ortogonal dari vektor $y$ ke subruang kolom $X$.`,
        formula: `\\hat{\\beta} = (X^T X)^{-1} X^T y, \\quad \\hat{y} = X\\hat{\\beta} = X(X^T X)^{-1}X^T y = H y`,
        code: `# 7.1: Implementasi Formulasi Matriks OLS Murni (Normal Equations) vs Scikit-Learn
import numpy as np
from sklearn.linear_model import LinearRegression

np.random.seed(42)
N, p = 150, 3
X_raw = np.random.normal(0, 1, size=(N, p))
beta_true = np.array([3.5, -2.0, 1.8]) # Koefisien sebenarnya
intercept_true = 5.0
y = intercept_true + X_raw @ beta_true + np.random.normal(0, 0.5, size=N)

# 1. Solusi Matriks Normal Equations Murni
X_mat = np.column_stack([np.ones(N), X_raw]) # Menambahkan kolom intercept 1
beta_ols = np.linalg.inv(X_mat.T @ X_mat) @ X_mat.T @ y

# Matriks Hat H = X (X^T X)^-1 X^T
H = X_mat @ np.linalg.inv(X_mat.T @ X_mat) @ X_mat.T
y_pred_ols = H @ y

# 2. Scikit-Learn LinearRegression
model_skl = LinearRegression().fit(X_raw, y)

print("=== VERIFIKASI SOLUSI NORMAL EQUATIONS OLS ===")
print(f"Intercept OLS Matriks : {beta_ols[0]:.4f} | Scikit-Learn: {model_skl.intercept_:.4f}")
print(f"Koefisien OLS Matriks : {beta_ols[1:].round(4)} | Scikit-Learn: {model_skl.coef_.round(4)}")
print(f"Max Perbedaan Prediksi: {np.max(np.abs(y_pred_ols - model_skl.predict(X_raw))):.2e}")`,
        expectedOutput: "Hasil penurunan matriks normal equations identik sempurna dengan Scikit-Learn (selisih < 1e-14).",
        codeExp: "Skrip membuktikan kesetaraan antara formulasi matriks aljabar linier closed-form OLS dan implementasi pustaka Scikit-Learn modern.",
        pitfalls: [
          "Menghitung invers matriks secara langsung inv(X.T @ X) pada dataset berskala raksasa alih-alih menggunakan faktorisasi QR atau Cholesky/SVD.",
          "Lupa menyertakan kolom konstanta bernilai 1 pada matriks X, yang memaksa bidang regresi melewati titik asal (origin intercept = 0)."
        ],
        refTitle: "Gilbert Strang: Linear Algebra and Its Applications (4th Edition)",
        refUrl: "https://math.mit.edu/~gs/linearalgebra/"
      },
      {
        num: "7.2",
        slug: "7-2-dekomposisi-varians-dan-r-squared-vs-adjusted",
        title: "7.2. Dekomposisi Total Sum of Squares: R-Squared vs Adjusted R-Squared",
        desc: "Evaluasi proporsi variabilitas OLS: dekomposisi varians TSS = ESS + RSS, kelemahan mendasar R^2, dan penalti Adjusted R^2.",
        concept: `Untuk mengevaluasi seberapa baik bidang regresi OLS mencocokkan data observasi, variabilitas total data respons didekomposisi menjadi dua komponen ortogonal:
$$\\text{TSS} = \\text{ESS} + \\text{RSS}$$
di mana $\\text{TSS} = \\sum (y_i - \\bar{y})^2$ adalah Total Sum of Squares, $\\text{ESS} = \\sum (\\hat{y}_i - \\bar{y})^2$ adalah Explained Sum of Squares, dan $\\text{RSS} = \\sum (y_i - \\hat{y}_i)^2$ adalah Residual Sum of Squares.
        
Koefisien determinasi $R^2 = 1 - (\\text{RSS}/\\text{TSS})$ merepresentasikan proporsi variabilitas dalam variabel target $y$ yang berhasil dijelaskan oleh prediktor dalam model.
        
Namun, $R^2$ memiliki kelemahan matematis kritis: nilainya **secara monotonik tidak akan pernah menurun** setiap kali prediktor baru ditambahkan ke dalam model, bahkan jika variabel baru tersebut adalah derau acak murni yang tidak memiliki relevansi apa pun. Untuk mengatasi inflasi semu ini, **Adjusted $R^2$** memperkenalkan penalti terhadap derajat kebebasan model ($p$).`,
        formula: `R^2 = 1 - \\frac{\\text{RSS}}{\\text{TSS}}, \\quad R^2_{\\text{adj}} = 1 - \\left( \\frac{\\text{RSS} / (n - p - 1)}{\\text{TSS} / (n - 1)} \\right)`,
        code: `# 7.2: Demonstrasi Bahaya Inflasi R^2 dan Koreksi Adjusted R^2 pada Variabel Derau
import numpy as np
import statsmodels.api as sm

np.random.seed(42)
n = 100
# Target y murni hanya bergantung pada x1
x1 = np.random.normal(0, 1, n)
y = 4.0 + 3.0 * x1 + np.random.normal(0, 1.5, n)

# Menambahkan 15 prediktor derau acak murni yang tidak relevan
X_derau = np.random.normal(0, 1, size=(n, 15))
X_gabung = np.column_stack([x1, X_derau])

# Model 1: Hanya x1 sejati
model_1 = sm.OLS(y, sm.add_constant(x1)).fit()
# Model 2: x1 + 15 Variabel Derau
model_2 = sm.OLS(y, sm.add_constant(X_gabung)).fit()

print("=== PERBANDINGAN R-SQUARED VS ADJUSTED R-SQUARED ===")
print(f"Model 1 (Hanya Fitur Sejati)   : R^2 = {model_1.rsquared:.4f} | Adj R^2 = {model_1.rsquared_adj:.4f}")
print(f"Model 2 (+ 15 Fitur Derau Acak): R^2 = {model_2.rsquared:.4f} | Adj R^2 = {model_2.rsquared_adj:.4f}")
print(f"Delta R^2 Mentah: +{model_2.rsquared - model_1.rsquared:.4f} (NAIK SEMU!)")
print(f"Delta Adj R^2   : {model_2.rsquared_adj - model_1.rsquared_adj:.4f} (TURUN SEHAT!)")`,
        expectedOutput: "R^2 naik semu saat derau ditambahkan, tetapi Adjusted R^2 turun menghukum prediktor tak relevan.",
        codeExp: "Skrip menunjukkan bagaimana penambahan 15 fitur sampah memperdaya metrik R^2 biasa namun berhasil dideteksi dan dihukum oleh Adjusted R^2.",
        pitfalls: [
          "Mengejar nilai R^2 setinggi mungkin sebagai indikator tunggal kualitas model, yang memicu overfitting ekstrem pada data latih.",
          "Membandingkan nilai R^2 antara model regresi dengan transformasi log(y) vs variabel target mentah y (TSS keduanya berbeda, perbandingan menjadi tidak sah)."
        ],
        refTitle: "Douglas C. Montgomery, Elizabeth A. Peck, G. Geoffrey Vining: Introduction to Linear Regression Analysis (6th Edition)",
        refUrl: "https://www.wiley.com/en-us/Introduction+to+Linear+Regression+Analysis%2C+6th+Edition-p-9781119578727"
      },
      {
        num: "7.3",
        slug: "7-3-teorema-gauss-markov-dan-sifat-blue",
        title: "7.3. Teorema Gauss-Markov & Sifat BLUE (Best Linear Unbiased Estimator)",
        desc: "Kondisi optimalitas estimator OLS: 5 asumsi klasik Gauss-Markov dan pembuktian matematis mengapa OLS adalah estimator linier dengan varians minimum.",
        concept: `Teorema Gauss-Markov adalah pilar teoretis utama yang membenarkan mengapa metode Ordinary Least Squares (OLS) menjadi teknik estimasi standar dalam analisis regresi linier.
        
Teorema ini menyatakan bahwa di bawah lima asumsi klasik Gauss-Markov:
1. **Linearitas dalam Parameter:** $y = X\\beta + \\epsilon$.
2. **Eksogenitas Kuat:** Nilai ekspektasi bersyarat dari galat adalah nol, $\\mathbb{E}[\\epsilon \\mid X] = 0$.
3. **Homoskedastisitas:** Varians galat konstan di seluruh observasi, $\\text{Var}(\\epsilon_i \\mid X) = \\sigma^2$.
4. **Tanpa Autokorelasi:** Galat antar observasi tidak saling berkorelasi, $\\text{Cov}(\\epsilon_i, \\epsilon_j \\mid X) = 0$ untuk $i \\ne j$.
5. **Tanpa Multikolinieritas Sempurna:** Matriks $X$ memiliki full column rank.
        
Estimator OLS $\\hat{\\beta}$ dijamin merupakan **BLUE (Best Linear Unbiased Estimator)**—yaitu estimator yang memiliki varians terkecil di antara seluruh estimator linier yang tidak berbias. Perhatikan bahwa teorema Gauss-Markov **tidak mensyaratkan normalitas galat**; asumsi normalitas hanya diperlukan untuk uji hipotesis eksak pada sampel kecil.`,
        formula: `\\text{Var}(\\hat{\\beta}_{\\text{OLS}}) \\le \\text{Var}(\\tilde{\\beta}) \\quad \\forall \\tilde{\\beta} \\in \\{ \\text{Linear Unbiased Estimators} \\}`,
        code: `# 7.3: Demonstrasi Sifat BLUE: Varians OLS vs Estimator Linier Tak Berbias Alternatif
import numpy as np

np.random.seed(42)
N = 30
beta_sejati = 4.0
B = 10000

# Simulasi X tetap
X = np.linspace(1, 10, N)
X_mean = np.mean(X)
penyebut_ols = np.sum((X - X_mean)**2)

beta_ols_list = []
beta_alt_list = [] # Estimator linier tak berbias alternatif: hanya menghubungkan titik ujung

for _ in range(B):
    epsilon = np.random.normal(0, 2.0, size=N)
    y = beta_sejati * X + epsilon
    
    # 1. Estimator OLS (BLUE)
    beta_ols = np.sum((X - X_mean) * (y - np.mean(y))) / penyebut_ols
    beta_ols_list.append(beta_ols)
    
    # 2. Estimator Alternatif Tak Berbias Sub-optimal: (y_akhir - y_awal) / (x_akhir - x_awal)
    beta_alt = (y[-1] - y[0]) / (X[-1] - X[0])
    beta_alt_list.append(beta_alt)

print("=== PEMBUKTIAN TEOREMA GAUSS-MARKOV (BLUE) ===")
print(f"Koefisien Sejati (Beta): {beta_sejati:.4f}")
print(f"Rata-rata OLS (Unbiased) : {np.mean(beta_ols_list):.4f} | Varians OLS: {np.var(beta_ols_list):.4f}")
print(f"Rata-rata Alt (Unbiased) : {np.mean(beta_alt_list):.4f} | Varians Alt: {np.var(beta_alt_list):.4f}")
print(f"Efisiensi Relatif (Var OLS / Var Alt): {np.var(beta_ols_list) / np.var(beta_alt_list):.4f} (OLS Varians Terkecil!)")`,
        expectedOutput: "Kedua estimator tak berbias, namun OLS memiliki varians jauh lebih kecil, membuktikan BLUE.",
        codeExp: "Skrip membandingkan OLS dengan estimator linier tak berbias lain dalam 10.000 simulasi Monte Carlo untuk membuktikan secara empiris bahwa varians OLS selalu paling minimal.",
        pitfalls: [
          "Mengklaim bahwa OLS adalah estimator terbaik dari *semua* estimator yang mungkin; OLS hanya terbaik di antara kelas estimator *linier dan tak berbias* (Ridge Regression yang berbias bisa memiliki MSE lebih rendah).",
          "Mengasumsikan OLS tetap BLUE ketika terjadi heteroskedastisitas atau autokorelasi galat."
        ],
        refTitle: "Jeffrey M. Wooldridge: Introductory Econometrics: A Modern Approach (7th Edition)",
        refUrl: "https://www.cengage.com/c/introductory-econometrics-a-modern-approach-7e-wooldridge/9781337558860/"
      },
      {
        num: "7.4",
        slug: "7-4-diagnostik-linearitas-dan-eksogenitas-lemah",
        title: "7.4. Diagnostik Linearitas & Asumsi Eksogenitas Lemah",
        desc: "Verifikasi spesifikasi model: residual vs fitted plots, uji Ramsey RESET untuk omitted non-linearities, dan konsekuensi endogenitas.",
        concept: `Dua asumsi paling kritis yang menentukan apakah estimasi koefisien regresi OLS memiliki interpretasi kausal yang sah adalah Linearitas Spesifikasi dan Eksogenitas Lemah ($E[\\epsilon \\mid X] = 0$).
        
Linearitas mensyaratkan bahwa hubungan struktural antara nilai harapan bersyarat dari target $\\mathbb{E}[y \\mid X]$ dan parameter $\\beta$ bersifat linier. Cara paling efektif untuk mendiagnosis pelanggaran linearitas adalah dengan memeriksa plot Residual versus Nilai Prediksi (Fitted Values). Jika plot residual menunjukkan pola melengkung (kurvilinier), ini adalah bukti visual kuat bahwa model gagal menangkap dinamika non-linier atau interaksi.
        
**Ramsey RESET Test (Regression Equation Specification Error Test)** adalah uji statistik formal yang menguji apakah transformasi non-linier dari nilai fitted (seperti $\\hat{y}^2$ dan $\\hat{y}^3$) dapat menjelaskan varians target secara signifikan. Jika RESET signifikan, model menderita misspecification.`,
        code: `# 7.4: Diagnostik Linearitas Visual dan Ramsey RESET Test
import numpy as np
import statsmodels.api as sm
from statsmodels.stats.diagnostic import linear_reset

np.random.seed(42)
n = 150
x = np.linspace(-3, 3, n)
# Hubungan non-linier sejati (kuadratik)
y = 2.0 + 1.5 * x + 0.8 * (x ** 2) + np.random.normal(0, 1.0, n)

# Model 1: Spesifikasi Linier Keliru (Mengabaikan suku kuadratik)
X_salah = sm.add_constant(x)
model_salah = sm.OLS(y, X_salah).fit()

# Uji Formal Ramsey RESET (power=2 dan 3)
reset_res = linear_reset(model_salah, power=2, use_f=True)

# Model 2: Spesifikasi Benar (Menyertakan polinomial derajat 2)
X_benar = sm.add_constant(np.column_stack([x, x**2]))
model_benar = sm.OLS(y, X_benar).fit()
reset_res_benar = linear_reset(model_benar, power=2, use_f=True)

print("=== HASIL UJI RAMSEY RESET MISSPECIFICATION ===")
print(f"Model Linier Salah : F-stat = {reset_res.statistic:.4f} | p-value = {reset_res.pvalue:.4e} (MISSPECIFIED NYATA!)")
print(f"Model Polinomial Benar: F-stat = {reset_res_benar.statistic:.4f} | p-value = {reset_res_benar.pvalue:.4f} (LOLOS UJI)")`,
        expectedOutput: "Ramsey RESET secara tajam menolak model linier salah (p < 0.0001) dan menerima model kuadratik.",
        codeExp: "Skrip menerapkan linear_reset dari statsmodels untuk memvalidasi secara objektif apakah spesifikasi fungsional model telah menangkap seluruh bentuk non-linearitas data.",
        pitfalls: [
          "Mengandalkan p-value koefisien regresi tanpa memeriksa plot residual vs fitted, sehingga model yang misspecified dianggap valid.",
          "Memaksakan regresi linier pada data dengan saturasi batas (misalnya batas fisik kapasitas) tanpa transformasi logaritmik atau logistik."
        ],
        refTitle: "J. B. Ramsey: Tests for Specification Errors in Classical Linear Least-Squares Regression Analysis",
        refUrl: "https://www.jstor.org/stable/2984689"
      },
      {
        num: "7.5",
        slug: "7-5-diagnostik-heteroskedastisitas-breusch-pagan-white",
        title: "7.5. Diagnostik Homoskedastisitas vs Heteroskedastisitas: Uji Breusch-Pagan & White",
        desc: "Pemeriksaan varians residual: bahaya varians tidak konstan pada standar error koefisien, uji formal Breusch-Pagan, dan koreksi Robust Standard Errors Huber-White.",
        concept: `Asumsi homoskedastisitas menyatakan bahwa varians dari galat $\\epsilon_i$ adalah konstan untuk setiap level prediktor $X$. Pelanggaran asumsi ini disebut **Heteroskedastisitas** (varians membesar atau mengecil seiring perubahan nilai prediktor). Heteroskedastisitas sangat sering ditemui pada data ekonomi dan bisnis (misalnya variabilitas pengeluaran hiburan keluarga berpendapatan tinggi jauh lebih besar daripada keluarga berpendapatan rendah).
        
Dampak utama heteroskedastisitas: estimator koefisien OLS $\\hat{\\beta}$ tetap tidak berbias, namun **standar error OLS standar menjadi bias dan tidak valid**. Akibatnya, interval kepercayaan dan uji signifikansi ($t$-test dan $F$-test) menjadi tidak dapat dipercaya (biasanya menghasilkan $p$-value yang terlalu kecil secara palsu).
        
Uji **Breusch-Pagan** dan **White Test** adalah dua uji statistik formal untuk mendeteksi heteroskedastisitas. Jika terdeteksi, analis wajib menggunakan **Heteroskedasticity-Consistent Standard Errors (HCSE / Huber-White Sandwich Estimator)** atau melakukan transformasi variabel.`,
        formula: `\\text{Var}_{\\text{White}}(\\hat{\\beta}) = (X^T X)^{-1} \\left( \\sum_{i=1}^n e_i^2 x_i x_i^T \\right) (X^T X)^{-1}`,
        code: `# 7.5: Deteksi Heteroskedastisitas (Breusch-Pagan) dan Koreksi Huber-White Robust SE
import numpy as np
import statsmodels.api as sm
from statsmodels.stats.diagnostic import het_breuschpagan

np.random.seed(42)
n = 200
X = np.linspace(10, 100, n)
# Varians galat membesar proporsional terhadap X (Heteroskedastisitas corong)
sigma_i = 0.5 * X
galat = np.random.normal(0, sigma_i)
y = 25.0 + 1.8 * X + galat

X_const = sm.add_constant(X)
model_ols = sm.OLS(y, X_const).fit()

# 1. Uji Formal Breusch-Pagan
lm_stat, p_val_bp, f_stat, f_pval = het_breuschpagan(model_ols.resid, model_ols.model.exog)

# 2. Koreksi Standar Error Robust (HC3 - Huber-White)
model_robust = sm.OLS(y, X_const).fit(cov_type='HC3')

print("=== HASIL DIAGNOSTIK HETEROSKEDASTISITAS ===")
print(f"Uji Breusch-Pagan LM Stat: {lm_stat:.4f} | p-value: {p_val_bp:.4e} (HETEROSKEDASTIK!)")
print(f"SE Koefisien OLS Standar (Salah) : {model_ols.bse[1]:.4f} | 95% CI: [{model_ols.conf_int()[1][0]:.3f}, {model_ols.conf_int()[1][1]:.3f}]")
print(f"SE Robust Huber-White HC3 (Koreksi): {model_robust.bse[1]:.4f} | 95% CI: [{model_robust.conf_int()[1][0]:.3f}, {model_robust.conf_int()[1][1]:.3f}]")`,
        expectedOutput: "Breusch-Pagan menolak homoskedastisitas (p < 0.001) dan Robust SE mengoreksi estimasi varians koefisien.",
        codeExp: "Skrip mengeksekusi uji Breusch-Pagan untuk mendeteksi varians residual non-konstan dan mengoreksi ketidakvalidan inferensi dengan cov_type='HC3'.",
        pitfalls: [
          "Menyimpulkan bahwa heteroskedastisitas membuat estimasi koefisien beta berbias (koefisien tetap tidak berbias, yang rusak adalah standar error-nya).",
          "Mengabaikan heteroskedastisitas pada pengujian kebijakan bisnis penting sehingga mengambil keputusan berdasarkan p-value palsu."
        ],
        refTitle: "Halbert White: A Heteroskedasticity-Consistent Covariance Matrix Estimator and a Direct Test for Heteroskedasticity",
        refUrl: "https://www.jstor.org/stable/1912934"
      },
      {
        num: "7.6",
        slug: "7-6-diagnostik-autokorelasi-residual-durbin-watson",
        title: "7.6. Diagnostik Autokorelasi Residual: Statistik Durbin-Watson & Model AR(1)",
        desc: "Pemeriksaan independensi galat berurutan: statistik Durbin-Watson, uji Breusch-Godfrey, dan bahaya regresi lancung (spurious regression).",
        concept: `Asumsi keempat Gauss-Markov menyatakan bahwa residual tidak boleh saling berkorelasi antar observasi. Pelanggaran asumsi ini disebut **Autokorelasi** (atau korelasi serial). Masalah ini hampir selalu muncul ketika data memiliki dimensi urutan temporal (data deret waktu) atau spasial.
        
Jika autokorelasi serial positif terjadi (galat positif cenderung diikuti galat positif), standar error OLS biasa akan mengestimasi varians terlalu rendah (underestimated). Akibatnya, statistik $t$ menjadi sangat tinggi secara palsu dan analis dapat terjebak dalam fenomena *Spurious Regression* (menemukan hubungan yang tampaknya sangat signifikan pada variabel yang sebenarnya sama sekali tidak berhubungan).
        
Statistik **Durbin-Watson ($d$)** adalah metrik standar untuk mendeteksi autokorelasi orde pertama $AR(1)$. Nilai $d$ berada dalam rentang $[0, 4]$:
- $d \\approx 2$: Tidak ada autokorelasi.
- $d < 2$ (khususnya $< 1.5$): Terindikasi autokorelasi serial positif kuat.
- $d > 2$: Terindikasi autokorelasi serial negatif.`,
        formula: `d = \\frac{\\sum_{t=2}^T (e_t - e_{t-1})^2}{\\sum_{t=1}^T e_t^2} \\approx 2(1 - \\hat{\\rho})`,
        code: `# 7.6: Diagnostik Autokorelasi Residual Durbin-Watson dan Uji Breusch-Godfrey
import numpy as np
import statsmodels.api as sm
from statsmodels.stats.stattools import durbin_watson
from statsmodels.stats.diagnostic import acorr_breusch_godfrey

np.random.seed(42)
T = 150
# Simulasi Residual Autokorelasi AR(1) rho = 0.75
rho = 0.75
galat_ar = np.zeros(T)
for t in range(1, T):
    galat_ar[t] = rho * galat_ar[t-1] + np.random.normal(0, 1.0)

t_steps = np.arange(T)
y = 10.0 + 0.5 * t_steps + galat_ar

X_model = sm.add_constant(t_steps)
model = sm.OLS(y, X_model).fit()

# 1. Hitung Statistik Durbin-Watson
dw_stat = durbin_watson(model.resid)

# 2. Uji Breusch-Godfrey Orde Tinggi (Order = 2)
bg_lm, bg_pval, _, _ = acorr_breusch_godfrey(model, nlags=2)

print("=== HASIL DIAGNOSTIK AUTOKORELASI RESIDUAL ===")
print(f"Statistik Durbin-Watson: {dw_stat:.4f} (Mendekati 0 -> Autokorelasi Positif Berat!)")
print(f"Uji Breusch-Godfrey LM : {bg_lm:.4f} | p-value: {bg_pval:.4e} (Korelasi Serial Kuat)")
print(f"Estimasi Autokorelasi rho: {1 - dw_stat/2:.4f}")`,
        expectedOutput: "Durbin-Watson ~ 0.56 mengonfirmasi autokorelasi serial positif kuat pada data deret waktu.",
        codeExp: "Skrip menghitung statistik Durbin-Watson dan uji Breusch-Godfrey untuk membuktikan keberadaan dependensi temporal pada residual OLS.",
        pitfalls: [
          "Menerapkan OLS standar pada data deret waktu tanpa stasionaritas, yang memicu spurious regression dengan R^2 tinggi dan DW sangat rendah.",
          "Menggunakan Durbin-Watson pada model yang menyertakan lagged dependent variable ($y_{t-1}$) sebagai prediktor (DW menjadi bias ke arah 2)."
        ],
        refTitle: "J. Durbin & G. S. Watson: Testing for Serial Correlation in Least Squares Regression",
        refUrl: "https://academic.oup.com/biomet/article/38/1-2/159/224213"
      },
      {
        num: "7.7",
        slug: "7-7-diagnostik-normalitas-residual-shapiro-wilk-qq",
        title: "7.7. Diagnostik Normalitas Residual: Shapiro-Wilk & Q-Q Plot",
        desc: "Verifikasi distribusi galat: visualisasi Quantile-Quantile (Q-Q) plot, uji formal Jarque-Bera dan Shapiro-Wilk, serta batas relevansi pada sampel besar.",
        concept: `Asumsi kelima dalam pemodelan regresi OLS klasik adalah bahwa residual berdistribusi normal, $\\epsilon \\sim \\mathcal{N}(0, \\sigma^2 I)$. Asumsi ini sering disalahpahami oleh praktisi pemula: yang disyaratkan berdistribusi normal adalah **residual galat model**, **bukan variabel respons mentah ($y$) ataupun fitur prediktor ($X$)**.
        
Normalitas residual esensial untuk validitas uji signifikansi inferensial ($t$-test koefisien dan $F$-test omnibus) pada ukuran sampel berhingga ($n < 100$). Jika galat tidak normal, estimasi interval kepercayaan menjadi tidak presisi. Namun, berkat Teorema Limit Pusat, pada sampel yang cukup besar ($n > 500$), estimator OLS tetap memiliki distribusi sampling asimtotik normal meskipun residualnya tidak normal.
        
Diagnostik visual dilakukan dengan **Quantile-Quantile (Q-Q) Plot**, yang memetakan kuantil residual empiris terhadap kuantil teoretis distribusi normal standar. Uji statistik formal meliputi uji **Shapiro-Wilk** (sangat bertenaga pada sampel kecil) dan uji **Jarque-Bera** (berbasis skewness dan kurtosis).`,
        code: `# 7.7: Evaluasi Normalitas Residual: Q-Q Plot Metrics, Shapiro-Wilk, & Jarque-Bera
import numpy as np
from scipy import stats
import statsmodels.api as sm

np.random.seed(42)
n = 80
X = np.random.normal(0, 1, size=(n, 2))
# Galat non-normal: Distribusi Chi-Square berderajat 3 miring positif
galat_miring = np.random.chisquare(df=3, size=n) - 3.0
y = 1.0 + 2.0 * X[:, 0] - 1.5 * X[:, 1] + galat_miring

model = sm.OLS(y, sm.add_constant(X)).fit()
residual = model.resid

# 1. Uji Shapiro-Wilk
stat_sw, p_val_sw = stats.shapiro(residual)

# 2. Uji Jarque-Bera (statsmodels)
jb_stat, p_val_jb, skew, kurt = sm.stats.stattools.jarque_bera(residual)

print("=== DIAGNOSTIK NORMALITAS RESIDUAL ===")
print(f"Skewness Residual: {skew:.4f} | Kurtosis: {kurt:.4f}")
print(f"Uji Shapiro-Wilk : Stat = {stat_sw:.4f} | p-value = {p_val_sw:.4e} (Tolak Normalitas!)")
print(f"Uji Jarque-Bera  : Stat = {jb_stat:.4f} | p-value = {p_val_jb:.4e}")`,
        expectedOutput: "Shapiro-Wilk dan Jarque-Bera secara konsisten menolak hipotesis normalitas residual (p < 0.01).",
        codeExp: "Skrip mendiagnosis non-normalitas residual model OLS secara objektif menggunakan metrik skewness-kurtosis, uji Shapiro-Wilk, dan Jarque-Bera.",
        pitfalls: [
          "Menguji normalitas variabel target y secara terisolasi sebelum melatih regresi; distribusi marginal y bisa sangat multimodal padahal residual kondisionalnya normal sempurna.",
          "Panik saat uji normalitas formal menolak H0 pada dataset jutaan baris, padahal deviasi mikroskopis dari normalitas tidak berdampak pada inferensi OLS sampel masif."
        ],
        refTitle: "S. S. Shapiro & M. B. Wilk: An Analysis of Variance Test for Normality (Complete Samples)",
        refUrl: "https://academic.oup.com/biomet/article/52/3-4/591/249964"
      },
      {
        num: "7.8",
        slug: "7-8-multikolinieritas-vif-dan-condition-number",
        title: "7.8. Multikolinieritas Sempurna & Imperfek: Variance Inflation Factor (VIF)",
        desc: "Korelasi antar prediktor: instabilitas matriks normal equations, pembengkakan varians koefisien, dan deteksi via VIF serta Condition Number.",
        concept: `Multikolinieritas terjadi ketika dua atau lebih variabel prediktor dalam model regresi linier memiliki korelasi linier yang sangat tinggi satu sama lain.
        
Terdapat dua jenis multikolinieritas:
1. **Multikolinieritas Sempurna:** Satu variabel prediktor adalah kombinasi linier eksak dari variabel lain (misalnya memasukkan fitur usia dalam tahun dan usia dalam bulan secara bersamaan). Hal ini menyebabkan matriks $X^T X$ singular (determinannya nol) sehingga solusi OLS tidak terdefinisi secara unik.
2. **Multikolinieritas Imperfek:** Prediktor saling berkorelasi sangat kuat tetapi tidak eksak. OLS masih dapat dihitung, namun matriks $X^T X$ mendekati singular (ill-conditioned). Akibatnya, varians koefisien regresi membengkak drastis (standar error meledak), tanda koefisien dapat terbalik secara aneh, dan model menjadi sangat sensitif terhadap perubahan kecil pada data.
        
**Variance Inflation Factor (VIF)** mengukur seberapa banyak varians dari suatu koefisien regresi terinflasi akibat multikolinieritas dibandingkan jika prediktor tersebut ortogonal. Nilai $\\text{VIF} > 5$ mengindikasikan multikolinieritas moderat, dan $\\text{VIF} > 10$ adalah tanda bahaya serius.`,
        formula: `\\text{VIF}_j = \\frac{1}{1 - R_j^2}`,
        code: `# 7.8: Deteksi Multikolinieritas: Variance Inflation Factor (VIF) & Condition Number
import numpy as np
import pandas as pd
from statsmodels.stats.outliers_influence import variance_inflation_factor

np.random.seed(42)
n = 200
# Fitur x1 dan x2 berkorelasi 98% (Multikolinieritas Kuat)
x1 = np.random.normal(10, 2, n)
x2 = 0.98 * x1 + np.random.normal(0, 0.3, n)
x3 = np.random.normal(5, 1, n) # Fitur independen

X_df = pd.DataFrame({'const': 1.0, 'x1': x1, 'x2': x2, 'x3': x3})

# Menghitung VIF untuk masing-masing prediktor
vif_data = pd.DataFrame()
vif_data["Fitur"] = X_df.columns
vif_data["VIF"] = [variance_inflation_factor(X_df.values, i) for i in range(X_df.shape[1])]

# Condition Number Matriks Desain X
mat_X = X_df.drop(columns=['const']).values
cond_number = np.linalg.cond(mat_X)

print("=== HASIL DETEKSI MULTIKOLINIERITAS ===")
print(vif_data.round(2))
print(f"\\nCondition Number Matriks X: {cond_number:.2f} (> 30 mengindikasikan kolinieritas berat)")`,
        expectedOutput: "VIF untuk x1 dan x2 meledak di atas 20, mendeteksi multikolinieritas kuat secara presisi.",
        codeExp: "Skrip menghitung nilai Variance Inflation Factor untuk setiap kolom matriks desain menggunakan statsmodels untuk mendiagnosis pembengkakan varians koefisien.",
        pitfalls: [
          "Menghapus variabel penting hanya karena VIF tinggi tanpa mempertimbangkan tujuan analisis kausalitas domain.",
          "Mencoba mengatasi multikolinieritas dengan menambah sampel data mentah padahal struktur korelasi antar fitur tidak berubah."
        ],
        refTitle: "David A. Belsley, Edwin Kuh, Roy E. Welsch: Regression Diagnostics: Identifying Influential Data and Sources of Collinearity",
        refUrl: "https://www.wiley.com/en-us/Regression+Diagnostics%3A+Identifying+Influential+Data+and+Sources+of+Collinearity-p-9780471691174"
      },
      {
        num: "7.9",
        slug: "7-9-titik-pengaruh-ekstrem-leverage-cooks-distance",
        title: "7.9. Titik Pengaruh Ekstrem: Leverage Score & Cook's Distance",
        desc: "Diagnostik observasi berpengaruh: pembedaan antara pencilan respons (outlier), titik leverage tinggi (hat matrix), dan ukuran pengaruh gabungan Cook's Distance.",
        concept: `Tidak semua titik data memiliki dampak yang setara terhadap estimasi koefisien regresi OLS. Beberapa observasi ekstrem dapat menarik bidang regresi ke arahnya secara tidak proporsional.
        
Penting untuk membedakan tiga konsep berikut:
1. **Outlier Residual:** Observasi yang memiliki nilai target $y$ jauh dari prediksi model (memiliki residual studentized $|r_i| > 3$).
2. **High Leverage Point:** Observasi yang memiliki kombinasi nilai prediktor $X$ yang sangat ekstrem atau terisolasi jauh dari pusat data. Nilai leverage diukur oleh elemen diagonal dari matriks Hat $H$, yaitu $h_{ii}$. Ambang batas leverage tinggi umumnya $h_{ii} > 2(p+1)/n$.
3. **Influential Point:** Titik yang menggabungkan residual besar dan leverage tinggi. Jika titik ini dihapus dari dataset, estimasi koefisien $\\hat{\\beta}$ akan berubah secara drastis.
        
**Cook's Distance ($D_i$)** adalah ukuran komprehensif pengaruh observasi $i$. Titik dengan $D_i > 4/n$ atau $D_i > 1$ memerlukan investigasi mendalam karena mendistorsi model.`,
        formula: `D_i = \\frac{e_i^2}{p \\cdot \\text{MSE}} \\left[ \\frac{h_{ii}}{(1 - h_{ii})^2} \\right] = \\frac{(\\hat{y} - \\hat{y}_{(i)})^T (\\hat{y} - \\hat{y}_{(i)})}{p \\cdot \\text{MSE}}`,
        code: `# 7.9: Deteksi Titik Pengaruh Ekstrem Menggunakan Cook's Distance dan Leverage
import numpy as np
import statsmodels.api as sm

np.random.seed(42)
n = 100
x = np.random.normal(10, 2, n)
y = 5.0 + 2.0 * x + np.random.normal(0, 1.5, n)

# Menyuntikkan 1 Titik Pengaruh Ekstrem (High Leverage + Bad Residual)
x[0] = 35.0  # Sangat jauh dari rata-rata x (~10) -> High Leverage
y[0] = 10.0  # Seharusnya ~75 -> Residual Negatif Raksasa

X_mat = sm.add_constant(x)
model = sm.OLS(y, X_mat).fit()

# Menghitung Diagnostik Pengaruh OLS
influence = model.get_influence()
cooks_d = influence.cooks_distance[0]
leverage_h = influence.hat_matrix_diag

ambang_cooks = 4.0 / n
titik_berpengaruh = np.where(cooks_d > ambang_cooks)[0]

print("=== DETEKSI INFLUENTIAL POINTS (COOK'S DISTANCE) ===")
print(f"Ambang Batas Kritis Cook's Distance (4/n): {ambang_cooks:.4f}")
print(f"Cook's Distance Titik Observasi 0        : {cooks_d[0]:.4f} (PENGARUH EKSTREM!)")
print(f"Leverage Score (h_ii) Titik Observasi 0  : {leverage_h[0]:.4f} (Rata-rata: {2/n:.4f})")
print(f"Indeks Observasi yang Melewati Ambang   : {titik_berpengaruh}")`,
        expectedOutput: "Titik observasi indeks 0 terdeteksi memiliki Cook's distance masif yang mendistorsi regresi.",
        codeExp: "Skrip memanfaatkan get_influence() dari statsmodels untuk menghitung Cook's Distance dan leverage score guna mengidentifikasi data perusak kemiringan garis regresi.",
        pitfalls: [
          "Menghapus titik berpengaruh secara membabi buta tanpa memahami alasan domain bisnisnya (sering kali titik berpengaruh justru menyimpan wawasan transaksi paling berharga).",
          "Hanya mencari outlier pada sumbu y tanpa memeriksa leverage pada ruang fitur multivariat X."
        ],
        refTitle: "R. Dennis Cook: Detection of Influential Observation in Linear Regression",
        refUrl: "https://www.tandfonline.com/doi/abs/10.1080/00401706.1977.10489493"
      },
      {
        num: "7.10",
        slug: "7-10-transformasi-variabel-box-cox-dan-interpretasi-elastisitas",
        title: "7.10. Transformasi Variabel: Box-Cox & Interpretasi Elastisitas",
        desc: "Solusi non-linearitas dan non-normalitas: transformasi daya Box-Cox, estimasi parameter lambda via MLE, dan interpretasi elastisitas model log-log.",
        concept: `Ketika model regresi linier melanggar asumsi homoskedastisitas, normalitas residual, atau linearitas hubungan, solusi statistik yang paling elegan sering kali bukan beralih ke model black-box rumit, melainkan melakukan transformasi variabel yang terarah secara matematis.
        
**Transformasi Daya Box-Cox** (George Box & David Cox, 1964) adalah transformasi parametrik kontinu untuk variabel respons yang strictly positive ($y > 0$). Transformasi ini memetakan variabel respons $y$ ke skala baru menggunakan parameter $\\lambda$:
- $\\lambda = 1$: Tidak ada transformasi (linier).
- $\\lambda = 0$: Transformasi logaritmik natural $\\ln(y)$.
- $\\lambda = 0.5$: Transformasi akar kuadrat $\\sqrt{y}$.
- $\\lambda = -1$: Transformasi resiprokal $1/y$.
Nilai $\\lambda$ optimal diestimasi secara otomatis via Maximum Likelihood Estimation.
        
Dalam model Log-Log ($\\,\\ln(y) = \\beta_0 + \\beta_1 \\ln(x)\\,$, koefisien $\\beta_1$ memiliki interpretasi ekonomi yang sangat berharga sebagai **Elastisitas Konstan**: peningkatan $1\\%$ pada $x$ diasosiasikan dengan peningkatan $\\beta_1\\%$ pada $y$.`,
        formula: `y^{(\\lambda)} = \\begin{cases} \\frac{y^\\lambda - 1}{\\lambda} & \\text{jika } \\lambda \\ne 0 \\\\ \\ln(y) & \\text{jika } \\lambda = 0 \\end{cases}`,
        code: `# 7.10: Transformasi Box-Cox via MLE dan Interpretasi Elastisitas Regresi Log-Log
import numpy as np
from scipy import stats
import statsmodels.api as sm

np.random.seed(42)
n = 200
# Hubungan ekonomi: Permintaan produk y terhadap harga x (Elastisitas = -1.5)
harga = np.random.uniform(10, 100, n)
# y = 50000 * (harga ^ -1.5) * multiplicative error
permintaan = 50000.0 * (harga ** (-1.5)) * np.random.lognormal(0, 0.2, n)

# 1. Transformasi Daya Box-Cox Otomatis via SciPy
permintaan_boxcox, lambda_opt = stats.boxcox(permintaan)

# 2. Pemodelan Log-Log untuk Mengestimasi Elastisitas
ln_harga = np.log(harga)
ln_permintaan = np.log(permintaan)

model_loglog = sm.OLS(ln_permintaan, sm.add_constant(ln_harga)).fit()
elastisitas_taksiran = model_loglog.params[1]

print("=== TRANSFORMASI BOX-COX & MODEL ELASTISITAS ===")
print(f"Optimal Lambda Box-Cox (MLE) : {lambda_opt:.4f} (Mendekati 0 -> Log-Transformasi Tepat!)")
print(f"Koefisien Regresi Log-Log    : {elastisitas_taksiran:.4f}")
print(f"Interpretasi Elastisitas     : Kenaikan harga 1% menurunkan permintaan sebesar {abs(elastisitas_taksiran):.2f}%")
print(f"R-Squared Model Log-Log      : {model_loglog.rsquared:.4f}")`,
        expectedOutput: "Lambda Box-Cox optimal mendekati 0 mengonfirmasi transformasi logaritmik untuk elastisitas.",
        codeExp: "Skrip memanfaatkan stats.boxcox untuk mengestimasi parameter lambda MLE secara otomatis dan membangun model regresi log-log untuk mengekstraksi koefisien elastisitas ekonomi.",
        pitfalls: [
          "Menerapkan transformasi Box-Cox pada data yang memiliki nilai nol atau negatif tanpa penambahan konstanta pergeseran.",
          "Menafsirkan koefisien regresi bertransformasi seolah-olah masih berada pada unit data asli (kesalahan interpretasi skala)."
        ],
        refTitle: "G. E. P. Box & D. R. Cox: An Analysis of Transformations",
        refUrl: "https://www.jstor.org/stable/2984418"
      }
    ]
  },

  // ==========================================
  // BAB 8: Model Klasifikasi Biner & Multikelas: Regresi Logistik & Analisis Diskriminan
  // ==========================================
  {
    orderIndex: 8,
    id: "data-science-ch-8",
    slug: "bab-8-klasifikasi-regresi-logistik-analisis-diskriminan",
    title: "BAB 8: Model Klasifikasi Biner & Multikelas: Regresi Logistik & Analisis Diskriminan",
    desc: "Pemodelan variabel respons kategorik: probabilitas logistik dan fungsi sigmoid, optimasi fungsi Cross-Entropy Loss, interpretasi Odds Ratio, regresi Softmax multikelas, penyesuaian decision threshold, evaluasi komprehensif Confusion Matrix (Precision, Recall, F1, PR-AUC), kurva ROC-AUC, kalibrasi probabilitas Brier score, serta Linear/Quadratic Discriminant Analysis (LDA/QDA).",
    coreConcepts: ["Logistic Regression & Odds Ratio", "Cross-Entropy Loss & Softmax", "Confusion Matrix & Threshold Tuning", "ROC-AUC & PR-AUC", "Probability Calibration & LDA/QDA"],
    subchapters: [
      {
        num: "8.1",
        slug: "8-1-probabilitas-logit-dan-fungsi-sigmoid",
        title: "8.1. Dari Linear Probability Model ke Transformasi Logit & Sigmoid",
        desc: "Kelemahan fatal Linear Probability Model (LPM): probabilitas di luar [0, 1], heteroskedastisitas bawaan, dan fondasi matematis fungsi sigmoid.",
        concept: `Ketika variabel target bersifat biner ($y \\in \\{0, 1\\}$), menerapkan Ordinary Least Squares secara langsung dikenal sebagai Linear Probability Model (LPM): $P(y = 1 \\mid X) = X\\beta$.
        
Meskipun koefisien LPM mudah diinterpretasikan, LPM memiliki dua kelemahan matematis fatal:
1. Model dapat memprediksi nilai probabilitas yang nonsensikal, yaitu $P(y=1) < 0$ atau $P(y=1) > 1$ untuk nilai $X$ ekstrem.
2. Galat residual biner secara inheren menderita heteroskedastisitas (variansnya adalah $X\\beta(1 - X\\beta)$ yang bergantung pada $X$), merusak inferensi standar OLS.
        
Regresi Logistik mengatasi masalah ini dengan memetakan ruang skor linier tak terbatas $\\eta = X\\beta \\in (-\\infty, +\\infty)$ ke dalam interval probabilitas yang strictly valid $(0, 1)$ menggunakan **Fungsi Sigmoid (Fungsi Logistik Standar)** $\\sigma(\\eta) = \\frac{1}{1 + e^{-\\eta}}$. Invers dari fungsi sigmoid adalah fungsi **Logit**, yang merupakan logaritma natural dari rasio odds.`,
        formula: `\\sigma(z) = \\frac{1}{1 + e^{-z}}, \\quad \\text{logit}(p) = \\ln\\left(\\frac{p}{1 - p}\\right) = X\\beta`,
        code: `# 8.1: Perbandingan Linear Probability Model (OLS) vs Regresi Logistik Sigmoid
import numpy as np
from sklearn.linear_model import LinearRegression, LogisticRegression

np.random.seed(42)
n = 150
# Fitur durasi browsing pengguna (menit)
durasi = np.random.uniform(1, 60, n)
# Probabilitas konversi sejati mengikuti kurva logistik
prob_true = 1 / (1 + np.exp(-(0.15 * durasi - 4.5)))
konversi = (np.random.rand(n) < prob_true).astype(int)

X = durasi.reshape(-1, 1)

# 1. Linear Probability Model (OLS)
lpm = LinearRegression().fit(X, konversi)

# 2. Regresi Logistik
logit = LogisticRegression().fit(X, konversi)

# Prediksi pada nilai ekstrem (durasi = 85 menit)
durasi_ekstrem = np.array([[85.0]])
pred_lpm = lpm.predict(durasi_ekstrem)[0]
pred_logit = logit.predict_proba(durasi_ekstrem)[0, 1]

print("=== KELEMAHAN LINEAR PROBABILITY MODEL VS REGRESI LOGISTIK ===")
print(f"Prediksi LPM pada durasi 85 menit   : {pred_lpm:.4f} (PELANGGARAN HUKUM PROBABILITAS: > 1.0!)")
print(f"Prediksi Logistik pada durasi 85 mnt: {pred_logit:.4f} (Valid di dalam [0, 1])")`,
        expectedOutput: "LPM menghasilkan probabilitas > 1.0 sementara Regresi Logistik menjamin probabilitas strictly valid.",
        codeExp: "Skrip mendemonstrasikan kegagalan OLS LPM pada titik data ekstrem dan bagaimana fungsi sigmoid membatasi probabilitas dalam rentang [0, 1].",
        pitfalls: [
          "Menggunakan regresi linier OLS untuk memprediksi probabilitas default kredit, menghasilkan estimasi probabilitas negatif pada profil risiko sangat rendah.",
          "Menafsirkan koefisien regresi logistik beta secara langsung sebagai perubahan linier probabilitas (koefisien beta adalah perubahan pada skala log-odds)."
        ],
        refTitle: "David W. Hosmer Jr., Stanley Lemeshow, Rodney X. Sturdivant: Applied Logistic Regression (3rd Edition)",
        refUrl: "https://www.wiley.com/en-us/Applied+Logistic+Regression%2C+3rd+Edition-p-9780470582473"
      },
      {
        num: "8.2",
        slug: "8-2-log-loss-dan-optimasi-newton-raphson",
        title: "8.2. Formulasi Matematis Log-Loss & Optimasi Numerik Newton-Raphson",
        desc: "Fungsi objektif klasifikasi: derivasi Binary Cross-Entropy dari prinsip Maximum Likelihood dan algoritma optimasi Iteratively Reweighted Least Squares (IRLS).",
        concept: `Berbeda dengan regresi linier OLS yang memiliki solusi matriks bentuk tertutup (closed-form normal equations), regresi logistik tidak memiliki solusi analitis langsung. Estimasi parameter $\\beta$ harus diselesaikan melalui optimasi numerik iteratif.
        
Diberikan variabel target biner $y_i \\in \\{0, 1\\}$ dan probabilitas model $p_i = \\sigma(x_i^T \\beta)$, fungsi likelihood bersama adalah perkalian Bernoulli: $L(\\beta) = \\prod_{i=1}^n p_i^{y_i} (1 - p_i)^{1 - y_i}$.
        
Dengan mengambil negatif dari log-likelihood, kita memperoleh fungsi biaya yang paling universal dalam klasifikasi modern: **Log-Loss (Binary Cross-Entropy Loss)**. Fungsi ini strictly convex, menjamin bahwa minimum global tunggal selalu ada. Algoritma optimasi standar untuk meminimalkan Log-Loss adalah **Newton-Raphson**, yang dalam statistika dikenal sebagai **Iteratively Reweighted Least Squares (IRLS)**.`,
        formula: `J(\\beta) = -\\frac{1}{n} \\sum_{i=1}^n \\left[ y_i \\ln(p_i) + (1 - y_i) \\ln(1 - p_i) \\right]`,
        code: `# 8.2: Implementasi Algoritma Newton-Raphson (IRLS) Murni untuk Regresi Logistik
import numpy as np

np.random.seed(42)
n, p = 200, 2
X_raw = np.random.normal(0, 1, size=(n, p))
X = np.column_stack([np.ones(n), X_raw]) # Tambah bias
beta_sejati = np.array([0.5, 1.8, -1.2])
prob_sejati = 1 / (1 + np.exp(-X @ beta_sejati))
y = (np.random.rand(n) < prob_sejati).astype(float)

# Inisialisasi koefisien beta = 0
beta = np.zeros(X.shape[1])
max_iter = 20
toleransi = 1e-6

for iterasi in range(max_iter):
    # 1. Hitung probabilitas saat ini
    p_hat = 1 / (1 + np.exp(-X @ beta))
    
    # 2. Gradient (Turunan Pertama)
    grad = X.T @ (p_hat - y)
    
    # 3. Matriks Pembobotan W dan Hessian (Turunan Kedua)
    W = np.diag(p_hat * (1 - p_hat))
    Hessian = X.T @ W @ X
    
    # 4. Pembaruan Newton-Raphson: beta_new = beta - H^-1 * grad
    delta = np.linalg.inv(Hessian) @ grad
    beta = beta - delta
    
    if np.linalg.norm(delta) < toleransi:
        break

print("=== KONVERGENSI OPTIMASI NEWTON-RAPHSON (IRLS) ===")
print(f"Konvergen pada Iterasi : {iterasi + 1}")
print(f"Koefisien Sejati       : {beta_sejati}")
print(f"Estimasi Beta via IRLS : {beta.round(4)}")`,
        expectedOutput: "Algoritma IRLS konvergen dalam < 10 iterasi mendekati parameter beta sejati.",
        codeExp: "Skrip mengimplementasikan algoritma optimasi Newton-Raphson murni menggunakan matriks Hessian dan pembobotan W untuk mendemonstrasikan bagaimana parameter regresi logistik diestimasi di balik layar Scikit-Learn.",
        pitfalls: [
          "Terjadinya fenomena Quasi-Complete Separation (data terpisah sempurna) di mana optimizer Newton-Raphson gagal konvergen dan koefisien beta meledak menuju tak hingga.",
          "Menghitung log-loss tanpa clipping nilai probabilitas [1e-15, 1 - 1e-15], memicu runtime warning log(0) = -inf."
        ],
        refTitle: "C. M. Bishop: Pattern Recognition and Machine Learning (Springer)",
        refUrl: "https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/"
      },
      {
        num: "8.3",
        slug: "8-3-interpretasi-koefisien-odds-ratio-dan-efek-marjinal",
        title: "8.3. Interpretasi Koefisien Logistik sebagai Odds Ratio & Efek Marjinal",
        desc: "Komunikasi hasil kepada pemangku kepentingan bisnis: transformasi eksponensial exp(beta) sebagai Odds Ratio dan perhitungan Average Marginal Effects (AME).",
        concept: `Tantangan terbesar bagi ilmuwan data setelah melatih regresi logistik adalah mengomunikasikan makna koefisien kepada pengambil keputusan bisnis. Menyatakan bahwa 'peningkatan skor kredit 1 poin menurunkan log-odds default sebesar 0.04' sering kali tidak dipahami oleh manajemen.
        
Dua pendekatan standar untuk menginterpretasikan koefisien logistik:
1. **Odds Ratio (OR = $\\exp(\\beta_j)$):** Eksponensial dari koefisien regresi logistik merepresentasikan rasio perubahan odds keberhasilan untuk setiap kenaikan satu unit prediktor $x_j$, dengan asumsi prediktor lain konstan. Jika $\\exp(\\beta_j) = 1.35$, artinya setiap kenaikan 1 unit $x_j$ melipatgandakan odds kejadian sebesar $35\\%$. Jika $\\exp(\\beta_j) = 0.80$, odds berkurang sebesar $20\\%$.
2. **Average Marginal Effects (AME):** Menghitung rata-rata perubahan absolut probabilitas $P(y=1)$ untuk perubahan marjinal satu unit pada prediktor, mengembalikan interpretasi ke skala persentase probabilitas intuitif.`,
        formula: `\\text{OR} = \\exp(\\beta_j), \\quad \\text{AME}_j = \\frac{1}{n} \\sum_{i=1}^n \\beta_j p_i(1 - p_i)`,
        code: `# 8.3: Ekstraksi Odds Ratio dan Average Marginal Effects (AME) dari Statsmodels Logit
import numpy as np
import statsmodels.api as sm

np.random.seed(42)
n = 300
pendapatan_juta = np.random.uniform(5, 50, n)
usia = np.random.uniform(20, 60, n)

# Model Logit Persetujuan KPR
X = np.column_stack([pendapatan_juta, usia])
X_const = sm.add_constant(X)
beta_model = np.array([-2.5, 0.08, 0.03])
prob = 1 / (1 + np.exp(-X_const @ beta_model))
disetujui = (np.random.rand(n) < prob).astype(int)

model_logit = sm.Logit(disetujui, X_const).fit(disp=False)

# 1. Odds Ratio dan 95% Confidence Interval
odds_ratios = np.exp(model_logit.params)
conf_int_or = np.exp(model_logit.conf_int())

# 2. Marginal Effects (AME)
margeff = model_logit.get_margeff(at='overall')

print("=== INTERPRETASI BISNIS: ODDS RATIO & MARGINAL EFFECTS ===")
print(f"Koefisien Pendapatan (beta) : {model_logit.params[1]:.4f}")
print(f"Odds Ratio Pendapatan (exp): {odds_ratios[1]:.4f} (CI 95%: [{conf_int_or[1][0]:.3f}, {conf_int_or[1][1]:.3f}])")
print(f"Interpretasi Odds Ratio    : Setiap kenaikan 1 juta pendapatan melipatgandakan odds persetujuan sebesar {(odds_ratios[1]-1)*100:.2f}%\\n")
print("Average Marginal Effects (Skala Persentase Probabilitas):")
print(margeff.summary())`,
        expectedOutput: "Odds ratio diekstraksi secara presisi dengan interval kepercayaan dan marginal effect probabilitas intuitif.",
        codeExp: "Skrip mendemonstrasikan cara mentransformasikan koefisien logit menjadi Odds Ratio dan Marginal Effects menggunakan statsmodels untuk pelaporan bisnis profesional.",
        pitfalls: [
          "Menafsirkan Odds Ratio sebagai Relative Risk (RR); jika probabilitas dasar tinggi, OR membesar-besarkan dampak risiko relatif secara signifikan.",
          "Lupa mengeksponensialkan koefisien beta saat menjelaskan persentase perubahan kepada audiens non-teknis."
        ],
        refTitle: "Scott Menard: Applied Logistic Regression Analysis (2nd Edition)",
        refUrl: "https://methods.sagepub.com/book/applied-logistic-regression-analysis-second-edition"
      },
      {
        num: "8.4",
        slug: "8-4-klasifikasi-multikelas-ovr-vs-softmax-multinomial",
        title: "8.4. Klasifikasi Multikelas: One-vs-Rest (OvR) vs Multinomial Softmax",
        desc: "Ekspansi klasifikasi di luar biner: heuristik One-vs-Rest (OvR) versus pemodelan simultan Multinomial Logit berbasis fungsi Softmax.",
        concept: `Ketika variabel target memiliki $K > 2$ kelas kategorik saling lepas (misalnya mengklasifikasikan jenis tiket bantuan teknis menjadi: Bug, Fitur Baru, Penagihan, atau Akun), terdapat dua strategi utama:
        
1. **One-vs-Rest (OvR / One-vs-All):** Memecah masalah multikelas menjadi $K$ model klasifikasi biner independen. Pada model ke-$k$, kelas $k$ diperlakukan sebagai kelas positif (1) dan seluruh kelas lainnya digabung menjadi kelas negatif (0). Prediksi akhir memilih kelas dengan skor probabilitas tertinggi. Meskipun sederhana, kelemahannya adalah probabilitas tidak terkalibrasi bersama dan rentan bias jika ukuran antarkelas timpang.
2. **Multinomial Logistic Regression (Softmax Regression):** Memodelkan seluruh $K$ kelas secara simultan menggunakan fungsi **Softmax**, yang menormalisasi eksponensial skor linier seluruh kelas sehingga jumlah probabilitasnya dijamin tepat sama dengan 1.0. Model ini mengoptimalkan fungsi objektif Categorical Cross-Entropy secara global.`,
        formula: `P(y = k \\mid x) = \\frac{e^{w_k^T x}}{\\sum_{j=1}^K e^{w_j^T x}}`,
        code: `# 8.4: Komparasi Strategi One-vs-Rest (OvR) vs Multinomial Softmax pada Dataset Multikelas
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import log_loss

X, y = make_classification(n_samples=500, n_features=4, n_classes=3, n_informative=3, n_redundant=0, random_state=42)

# 1. Pendekatan One-vs-Rest (OvR)
model_ovr = LogisticRegression(multi_class='ovr', solver='liblinear', random_state=42).fit(X, y)
prob_ovr = model_ovr.predict_proba(X)

# 2. Pendekatan Multinomial Softmax
model_softmax = LogisticRegression(multi_class='multinomial', solver='lbfgs', random_state=42).fit(X, y)
prob_softmax = model_softmax.predict_proba(X)

loss_ovr = log_loss(y, prob_ovr)
loss_softmax = log_loss(y, prob_softmax)

print("=== EVALUASI STRATEGI KLASIFIKASI MULTIKELAS ===")
print(f"Log-Loss Model One-vs-Rest (OvR)   : {loss_ovr:.4f}")
print(f"Log-Loss Model Multinomial Softmax : {loss_softmax:.4f} (Lebih Optimal!)")
print(f"Contoh Prediksi Softmax (Prob Normal Terikat 1.0): {prob_softmax[0].round(4)} (Sum = {np.sum(prob_softmax[0]):.2f})")`,
        expectedOutput: "Multinomial Softmax menghasilkan Log-Loss terendah karena mengoptimalkan distribusi probabilitas bersama.",
        codeExp: "Skrip membandingkan performa pendekatan heuristik OvR dengan pemodelan teoritis simultan Softmax Regression pada dataset 3 kelas menggunakan Scikit-Learn.",
        pitfalls: [
          "Menggunakan One-vs-Rest ketika hubungan probabilitas antar kelas memiliki keterikatan kompetitif langsung.",
          "Lupa bahwa pada Multinomial Logit, satu kelas harus diperlakukan sebagai kelas referensi (base category) jika mengestimasi model statistik inferensial non-regularized."
        ],
        refTitle: "Trevor Hastie, Robert Tibshirani, Jerome Friedman: The Elements of Statistical Learning",
        refUrl: "https://hastie.su.domains/ElemStatLearn/"
      },
      {
        num: "8.5",
        slug: "8-5-threshold-tuning-dan-trade-off-precision-recall",
        title: "8.5. Penyetelan Ambang Batas Klasifikasi (Decision Threshold Tuning)",
        desc: "Melampaui ambang batas default 0.5: kurva trade-off Precision-Recall, kalibrasi matriks biaya ekonomi (cost matrix), dan optimasi utilitas bisnis.",
        concept: `Secara default, hampir seluruh pustaka machine learning (termasuk Scikit-Learn) menggunakan ambang batas keputusan (decision threshold) tetap $\\tau = 0.50$: jika $\\hat{p} \\ge 0.50$, observasi diprediksi sebagai kelas 1, dan jika tidak diprediksi kelas 0.
        
Namun, dalam aplikasi industri nyata, ambang batas 0.50 hampir selalu merupakan pilihan yang keliru karena biaya dari dua jenis kesalahan tidak pernah simetris:
- Pada deteksi penipuan perbankan (fraud detection) atau diagnosis medis kanker, biaya dari False Negative (gagal mendeteksi penipuan atau tumor) jauh lebih fatal daripada biaya dari False Positive (pemberitahuan verifikasi tambahan). Ambang batas harus diturunkan secara drastis (misalnya $\\tau = 0.15$).
- Pada penyaringan spam email atau deteksi klaim palsu berisiko hukum, False Positive dapat memicu tuntutan pengguna. Ambang batas harus dinaikkan (misalnya $\\tau = 0.85$).
        
Analis data wajib melakukan penyetelan threshold berbasis analisis kurva Precision-Recall atau dengan meminimalkan fungsi matriks biaya finansial total (Total Cost Function).`,
        formula: `\\text{Total Cost}(\\tau) = C_{\\text{FP}} \\cdot \\text{FP}(\\tau) + C_{\\text{FN}} \\cdot \\text{FN}(\\tau)`,
        code: `# 8.5: Optimasi Threshold Klasifikasi Berbasis Matriks Biaya Finansial Bisnis
import numpy as np
from sklearn.metrics import confusion_matrix

np.random.seed(42)
n = 1000
# Probabilitas terprediksi fraud
y_prob = np.random.beta(0.5, 5.0, size=n)
# Status fraud riil (rasio 5% fraud)
y_true = (y_prob + np.random.normal(0, 0.15, size=n) > 0.4).astype(int)

# Matriks Biaya Finansial Industri
# Biaya FN (Fraud lolos): Kerugian rata-rata $500
# Biaya FP (Investigasi manual akun bersih): Kerugian biaya operasional $25
cost_fn = 500.0
cost_fp = 25.0

thresholds = np.linspace(0.05, 0.95, 50)
biaya_total = []

for t in thresholds:
    y_pred = (y_prob >= t).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
    biaya = fp * cost_fp + fn * cost_fn
    biaya_total.append(biaya)

idx_opt = np.argmin(biaya_total)
t_optimal = thresholds[idx_opt]
biaya_min = biaya_total[idx_opt]

# Bandingkan dengan threshold default 0.50
y_pred_def = (y_prob >= 0.50).astype(int)
tn_d, fp_d, fn_d, tp_d = confusion_matrix(y_true, y_pred_def).ravel()
biaya_default = fp_d * cost_fp + fn_d * cost_fn

print("=== OPTIMASI THRESHOLD KEPUTUSAN BISNIS ===")
print(f"Biaya Finansial pada Threshold Default (0.50): \${biaya_default:,.2f}")
print(f"Threshold Optimal Berbasis Biaya Finansial : {t_optimal:.2f}")
print(f"Biaya Finansial pada Threshold Optimal       : \${biaya_min:,.2f}")
print(f"Penghematan Biaya Finansial yang Dihasilkan  : \${biaya_default - biaya_min:,.2f} ({((biaya_default - biaya_min)/biaya_default)*100:.1f}%)")`,
        expectedOutput: "Threshold optimal ~0.15 menurunkan total biaya finansial secara substansial dibanding default 0.5.",
        codeExp: "Skrip memformulasikan fungsi biaya asimetris finansial untuk mendemonstrasikan proses penentuan threshold optimal yang meminimalkan kerugian moneter riil perusahaan.",
        pitfalls: [
          "Mempertahankan threshold default 0.5 pada dataset berdistribusi kelas timpang (imbalance), yang membuat model hampir tidak pernah memprediksi kelas minoritas.",
          "Menyetel threshold pada data uji (test set), yang memicu kebocoran data (threshold harus dioptimasi murni pada data validasi)."
        ],
        refTitle: "Charles Elkan: The Foundations of Cost-Sensitive Learning (IJCAI 2001)",
        refUrl: "https://www.ijcai.org/Proceedings/01-1/Papers/136.pdf"
      },
      {
        num: "8.6",
        slug: "8-6-matriks-konfusi-precision-recall-dan-f-beta",
        title: "8.6. Matriks Konfusi Komprehensif: Precision, Recall, & F-Beta Score",
        desc: "Dekomposisi metrik evaluasi klasifikasi: jebakan akurasi, True/False Positives/Negatives, Sensitivity, Specificity, dan skor F_beta terbobot.",
        concept: `Akurasi (Accuracy = rasio prediksi benar terhadap total sampel) adalah metrik evaluasi yang paling banyak disalahgunakan dalam sains data. Pada dataset dengan ketimpangan kelas ekstrem—misalnya deteksi transaksi kartu kredit di mana hanya $0.1\\%$ transaksi yang merupakan fraud—model naif yang selalu memprediksi 'Bukan Fraud' akan memperoleh akurasi $99.9\\%$, namun model tersebut sama sekali tidak berguna secara fungsional.
        
Untuk mengevaluasi performa klasifikasi secara komprehensif, analis membedah Matriks Konfusi menjadi empat kuadran:
- **Precision (Positive Predictive Value):** Di antara seluruh observasi yang diprediksi positif, berapa persen yang benar-benar positif? $\\text{Precision} = TP / (TP + FP)$.
- **Recall (Sensitivity / True Positive Rate):** Di antara seluruh observasi yang sesungguhnya positif, berapa persen yang berhasil ditangkap model? $\\text{Recall} = TP / (TP + FN)$.
- **Specificity (True Negative Rate):** Di antara seluruh observasi negatif, berapa persen yang diidentifikasi benar? $TN / (TN + FP)$.
        
Skor $F_1$ adalah rata-rata harmonik antara Precision dan Recall. Jika bisnis lebih mengutamakan Recall daripada Precision (atau sebaliknya), skor umum $F_\\beta$ digunakan, di mana parameter $\\beta$ menentukan seberapa besar bobot Recall relatif terhadap Precision.`,
        formula: `F_\\beta = (1 + \\beta^2) \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\beta^2 \\cdot \\text{Precision} + \\text{Recall}}`,
        code: `# 8.6: Evaluasi Matriks Konfusi Komprehensif dan Perhitungan Skor F-Beta
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix, fbeta_score

# Data target riil dan prediksi model klasifikasi
y_true = np.array([1]*15 + [0]*85) # 15 Positif, 85 Negatif
np.random.seed(42)
y_pred = np.array([1]*12 + [0]*3 + [1]*10 + [0]*75) # TP=12, FN=3, FP=10, TN=75

# 1. Ekstraksi Matriks Konfusi
tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()

precision = tp / (tp + fp)
recall = tp / (tp + fn)
specificity = tn / (tn + fp)
f1 = 2 * (precision * recall) / (precision + recall)
f2 = fbeta_score(y_true, y_pred, beta=2.0) # Bobot Recall 2x lebih penting

print("=== DEKOMPOSISI METRIK EVALUASI MATRIKS KONFUSI ===")
print(f"True Positives (TP): {tp} | False Positives (FP): {fp}")
print(f"False Negatives(FN): {fn} | True Negatives (TN) : {tn}\\n")
print(f"Akurasi Sederhana  : {(tp + tn) / len(y_true):.4f}")
print(f"Precision          : {precision:.4f} (Ketepatan Alarm Positif)")
print(f"Recall (Sensitivity): {recall:.4f} (Cakupan Deteksi)")
print(f"Specificity        : {specificity:.4f}")
print(f"F1-Score Seimbang  : {f1:.4f}")
print(f"F2-Score (Bobot Recall Tinggi): {f2:.4f}")`,
        expectedOutput: "Decompose metrik menunjukkan Precision 54.5%, Recall 80.0%, dan F2-score 73.2%.",
        codeExp: "Skrip membedah seluruh komponen matriks konfusi dan menghitung F_beta score untuk mendemonstrasikan evaluasi performa model yang kebal terhadap jebakan akurasi semu.",
        pitfalls: [
          "Hanya melaporkan skor akurasi pada dataset tidak seimbang tanpa menyertakan Precision, Recall, dan F1.",
          "Menggunakan F1-score biasa ketika domain bisnis jelas-jelas menganggap False Negative 10 kali lebih mahal daripada False Positive (seharusnya menggunakan F2 atau cost matrix)."
        ],
        refTitle: "Powers, David M. W.: Evaluation: From Precision, Recall and F-Measure to ROC, Informedness, Markedness & Correlation",
        refUrl: "https://dl.acm.org/doi/10.5555/2014022.2014028"
      },
      {
        num: "8.7",
        slug: "8-7-roc-dan-auc-interpretasi-probabilistik",
        title: "8.7. Receiver Operating Characteristic (ROC) & Area Under the Curve (AUC)",
        desc: "Metrik invarian ambang batas: kurva ROC (TPR vs FPR), interpretasi probabilistik AUC sebagai probabilitas perangkingan Wilcoxon-Mann-Whitney.",
        concept: `Kurva **Receiver Operating Characteristic (ROC)** adalah visualisasi performa model klasifikasi biner di seluruh kemungkinan rentang ambang batas keputusan ($0 \\le \\tau \\le 1$). Kurva ini memetakan True Positive Rate (Recall / Sensitivity) pada sumbu Y terhadap False Positive Rate ($1 - \\text{Specificity}$) pada sumbu X.
        
Metrik kuantitatif ringkasan dari kurva ini adalah **Area Under the ROC Curve (AUC-ROC)**:
- $\\text{AUC} = 1.0$: Klasifikator sempurna yang memisahkan seluruh observasi positif dan negatif tanpa tumpang tindih sama sekali.
- $\\text{AUC} = 0.5$: Klasifikator acak (garis diagonal), tidak memiliki kemampuan diskriminasi sama sekali.
- $\\text{AUC} < 0.5$: Model memprediksi secara terbalik dari kenyataan.
        
Penting untuk dipahami bahwa AUC-ROC memiliki interpretasi probabilistik formal yang elegan: AUC setara dengan probabilitas bahwa model akan memberikan skor probabilitas lebih tinggi kepada observasi positif yang dipilih secara acak dibandingkan observasi negatif yang dipilih secara acak: $\\text{AUC} = P(\\hat{p}_+ > \\hat{p}_-)$.`,
        formula: `\\text{AUC} = \\int_0^1 \\text{TPR}(\\tau) \\, d(\\text{FPR}(\\tau)) = P(\\hat{p}(X^+) > \\hat{p}(X^-))`,
        code: `# 8.7: Perhitungan AUC-ROC dan Pembuktian Kesetaraan Probabilistik Mann-Whitney
import numpy as np
from sklearn.metrics import roc_auc_score, roc_curve

np.random.seed(42)
# Skor prediksi model klasifikasi
y_prob = np.array([0.95, 0.85, 0.70, 0.65, 0.55, 0.40, 0.35, 0.20, 0.15, 0.10])
# Label sebenarnya (5 Positif, 5 Negatif)
y_true = np.array([1, 1, 0, 1, 0, 1, 0, 0, 1, 0])

# 1. Hitung AUC-ROC via Scikit-Learn
auc_skl = roc_auc_score(y_true, y_prob)

# 2. Pembuktian Teorema Probabilistik: P(Skor_Positif > Skor_Negatif)
skor_positif = y_prob[y_true == 1]
skor_negatif = y_prob[y_true == 0]

pasangan_benar = 0
total_pasangan = len(skor_positif) * len(skor_negatif)

for p_pos in skor_positif:
    for p_neg in skor_negatif:
        if p_pos > p_neg:
            pasangan_benar += 1.0
        elif p_pos == p_neg:
            pasangan_benar += 0.5

prob_ranking_empiris = pasangan_benar / total_pasangan

print("=== PEMBUKTIAN INTERPRETASI PROBABILISTIK ROC-AUC ===")
print(f"Skor AUC-ROC Scikit-Learn               : {auc_skl:.4f}")
print(f"Probabilitas Perangkingan Acak P(S+ > S-): {prob_ranking_empiris:.4f}")
print(f"Selisih Matematis                       : {abs(auc_skl - prob_ranking_empiris):.1e} (IDENTIK SEMPURNA!)")`,
        expectedOutput: "AUC-ROC Scikit-Learn identik sempurna dengan probabilitas perangkingan acak Wilcoxon.",
        codeExp: "Skrip membuktikan secara komputasional interpretasi statistik formal dari AUC-ROC sebagai probabilitas urutan skor pasangan acak positif-negatif.",
        pitfalls: [
          "Mengandalkan AUC-ROC pada dataset dengan ketimpangan kelas ekstrem (imbalance > 1:100), di mana AUC-ROC dapat tampak tinggi (>0.90) padahal model menghasilkan banyak sekali alarm palsu.",
          "Mengasumsikan model dengan AUC-ROC lebih tinggi selalu lebih baik untuk implementasi bisnis operasional pada threshold tetap tertentu."
        ],
        refTitle: "Tom Fawcett: An Introduction to ROC Analysis (Pattern Recognition Letters)",
        refUrl: "https://www.sciencedirect.com/science/article/pii/S016786550500303X"
      },
      {
        num: "8.8",
        slug: "8-8-precision-recall-auc-untuk-imbalanced-data",
        title: "8.8. Precision-Recall Curve (PR-AUC / Average Precision)",
        desc: "Evaluasi definitif data timpang ekstrem: kurva Precision vs Recall, baseline prevalensi, dan keunggulan Average Precision atas ROC.",
        concept: `Pada dataset dengan rasio ketimpangan kelas yang parah (imbalance)—seperti deteksi penipuan keuangan, klik iklan digital, atau deteksi intrusi jaringan—kurva ROC dapat memberikan ilusi performa yang menyesatkan karena sumbu False Positive Rate ($FPR = FP / (FP + TN)$) didominasi oleh jumlah True Negatives ($TN$) yang sangat besar di penyebut. Peningkatan ratusan False Positives hampir tidak menggeser nilai FPR sama sekali.
        
**Kurva Precision-Recall (PR Curve)** memetakan Precision pada sumbu Y terhadap Recall pada sumbu X. Kurva ini sepenuhnya mengabaikan True Negatives dan memusatkan evaluasi murni pada kelas minoritas positif yang menjadi fokus bisnis.
        
Metrik ringkasan untuk kurva ini adalah **Area Under the Precision-Recall Curve (PR-AUC)** atau **Average Precision (AP)**. Baseline acak untuk PR-AUC bukanlah 0.50 seperti pada ROC, melainkan tepat sama dengan prevalensi proporsi kelas positif dalam dataset ($P(y=1)$). Jika proporsi positif hanya $1\\%$, model acak memiliki PR-AUC sebesar 0.01.`,
        formula: `\\text{AP} = \\sum_n (R_n - R_{n-1}) P_n`,
        code: `# 8.8: Komparasi ROC-AUC vs PR-AUC pada Kasus Deteksi Fraud Timpang Ekstrem (1:100)
import numpy as np
from sklearn.metrics import roc_auc_score, average_precision_score

np.random.seed(42)
n = 10000
# Prevalensi Positif 1% (100 Fraud dari 10.000 transaksi)
y_true = np.zeros(n, dtype=int)
y_true[:100] = 1

# Model yang menghasilkan banyak False Positive pada kelas mayoritas
# Skor fraud terdeteksi, namun menghasilkan 500 alarm palsu
skor_pred = np.random.beta(0.5, 20.0, size=n)
skor_pred[:100] += np.random.normal(0.4, 0.1, size=100) # Sinyal positif

auc_roc = roc_auc_score(y_true, skor_pred)
auc_pr = average_precision_score(y_true, skor_pred)
baseline_pr = np.mean(y_true)

print("=== EVALUASI PADA KETIMPANGAN KELAS EKSTREM (1% FRAUD) ===")
print(f"Baseline Teoritis Model Acak PR-AUC: {baseline_pr:.4f} (1.00%)")
print(f"ROC-AUC Score                     : {auc_roc:.4f} (Tampak Sangat Bagus, Ilusi!)")
print(f"PR-AUC (Average Precision) Score  : {auc_pr:.4f} (Refleksi Akurat Kinerja Sinyal)")`,
        expectedOutput: "ROC-AUC tampak sangat optimis (~0.98), sedangkan PR-AUC secara jujur mengukur presisi riil.",
        codeExp: "Skrip menunjukkan bagaimana PR-AUC memberikan gambaran objektif performa deteksi pada data timpang ekstrem di saat ROC-AUC terdistorsi oleh tingginya jumlah true negative.",
        pitfalls: [
          "Menyimpulkan model sangat hebat hanya karena ROC-AUC = 0.95 pada data langka tanpa memeriksa Precision-Recall curve.",
          "Menghitung PR-AUC menggunakan integrasi trapesium sederhana (np.trapz) yang menghasilkan overestimasi linier pada interpolasi PR curve (harus menggunakan step-wise average_precision_score)."
        ],
        refTitle: "Takaya Saito & Marc Rehmsmeier: The Precision-Recall Plot Is More Informative than the ROC Plot When Evaluating Imbalanced Datasets",
        refUrl: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0118432"
      },
      {
        num: "8.9",
        slug: "8-9-kalibrasi-probabilitas-brier-score-platt-scaling",
        title: "8.9. Kalibrasi Probabilitas: Brier Score, Reliability Diagram, & Platt Scaling",
        desc: "Keandalan probabilitas output: perbedaan akurasi diskriminasi vs kalibrasi probabilitas, Brier Score, Reliability Curve, dan Isotonic Regression.",
        concept: `Suatu model klasifikasi dapat memiliki nilai AUC-ROC yang sangat tinggi (mampu meranking sampel positif lebih tinggi daripada sampel negatif secara akurat), namun probabilitas absolut yang dihasilkannya sangat melenceng dan tidak terkalibrasi.
        
Definisi **Probabilitas Terkalibrasi (Calibrated Probability)**: dari 100 pasien yang diprediksi memiliki risiko kanker sebesar $70\\%$, secara empiris harus ada sekitar 70 pasien yang benar-benar mengidap kanker. Jika dari 100 pasien tersebut ternyata hanya ada 20 yang mengidap kanker, probabilitas model mengalami *overconfidence* yang membahayakan.
        
Dua instrumen utama untuk mengukur kalibrasi:
1. **Brier Score:** Mean Squared Error antara probabilitas yang diprediksi $\\hat{p}_i$ dan label biner aktual $y_i \\in \\{0, 1\\}$. Skor 0 adalah kalibrasi sempurna.
2. **Reliability Diagram:** Plot visual frekuensi observasi empiris terhadap rata-rata probabilitas terprediksi dalam 10 bin.
Metode kalibrasi pasca-latih yang paling populer adalah **Platt Scaling** (regresi logistik univariat) dan **Isotonic Regression** (regresi non-parametrik monotonik).`,
        formula: `\\text{Brier Score} = \\frac{1}{n} \\sum_{i=1}^n (\\hat{p}_i - y_i)^2`,
        code: `# 8.9: Evaluasi Kalibrasi Probabilitas dan Perbaikan via CalibratedClassifierCV
import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV, calibration_curve
from sklearn.metrics import brier_score_loss

X, y = make_classification(n_samples=2000, n_features=10, random_state=42)
X_train, X_test = X[:1000], X[1000:]
y_train, y_test = y[:1000], y[1000:]

# Random Forest mentah sering kali uncalibrated (probabilitas condong ke tengah / menjauhi 0 dan 1)
rf_mentah = RandomForestClassifier(n_estimators=50, random_state=42).fit(X_train, y_train)
prob_mentah = rf_mentah.predict_proba(X_test)[:, 1]

# Kalibrasi Probabilitas via Isotonic Regression
rf_kalibrasi = CalibratedClassifierCV(estimator=rf_mentah, method='isotonic', cv='prefit')
rf_kalibrasi.fit(X_test, y_test)
prob_kalibrasi = rf_kalibrasi.predict_proba(X_test)[:, 1]

brier_mentah = brier_score_loss(y_test, prob_mentah)
brier_kalibrasi = brier_score_loss(y_test, prob_kalibrasi)

print("=== EVALUASI & PENINGKATAN KALIBRASI PROBABILITAS ===")
print(f"Brier Score Random Forest Mentah    : {brier_mentah:.4f}")
print(f"Brier Score Model Terkalibrasi (Iso): {brier_kalibrasi:.4f} (LEBIH PRESISI & ANDAL)")
print(f"Penurunan Galat Kalibrasi           : {((brier_mentah - brier_kalibrasi)/brier_mentah)*100:.2f}%")`,
        expectedOutput: "Kalibrasi Isotonic menurunkan Brier Score membuktikan probabilitas output lebih terpercaya.",
        codeExp: "Skrip mengukur Brier Score dari Random Forest dan menerapkan CalibratedClassifierCV untuk mengoreksi bias probabilitas model.",
        pitfalls: [
          "Menggunakan output predict_proba() mentah dari model boosting atau SVM langsung ke sistem penetapan harga asuransi tanpa kalibrasi probabilitas.",
          "Melakukan kalibrasi model pada data latih (training set) yang menyebabkan overconfidence ekstrem."
        ],
        refTitle: "Alexandru Niculescu-Mizil & Rich Caruana: Predicting Good Probabilities With Supervised Learning (ICML 2005)",
        refUrl: "https://dl.acm.org/doi/10.1145/1102351.1102430"
      },
      {
        num: "8.10",
        slug: "8-10-linear-dan-quadratic-discriminant-analysis",
        title: "8.10. Linear & Quadratic Discriminant Analysis (LDA & QDA)",
        desc: "Pendekatan generatif klasifikasi: teorema Bayes multivariat, proyeksi pemisah Fisher, asumsi matriks kovarians bersama (LDA) vs terpisah (QDA).",
        concept: `Berbeda dengan Regresi Logistik yang merupakan model diskriminatif (memodelkan probabilitas kondisional $P(Y \\mid X)$ secara langsung), **Linear Discriminant Analysis (LDA)** dan **Quadratic Discriminant Analysis (QDA)** adalah model generatif. Model generatif memodelkan distribusi fitur untuk setiap kelas secara terpisah $P(X \\mid Y = k)$ diasumsikan sebagai distribusi Normal Multivariat $\\mathcal{N}(\\mu_k, \\Sigma_k)$, lalu menerapkan Teorema Bayes untuk menghitung probabilitas posterior $P(Y = k \\mid X)$.
        
Perbedaan mendasar antara LDA dan QDA:
1. **LDA (Linear Discriminant Analysis):** Mengasumsikan bahwa seluruh kelas memiliki matriks kovarians yang identik (homoskedastisitas multivariat: $\\Sigma_k = \\Sigma$). Asumsi ini menghasilkan batas keputusan (decision boundary) yang linier sempurna. Sir Ronald Fisher juga menurunkan LDA sebagai metode proyeksi reduksi dimensi yang memaksimalkan rasio varians antar-kelas terhadap varians intra-kelas.
2. **QDA (Quadratic Discriminant Analysis):** Mengizinkan setiap kelas memiliki matriks kovarians uniknya sendiri $\\Sigma_k$. Hal ini menghasilkan batas keputusan kuadratik non-linier yang jauh lebih fleksibel, namun membutuhkan estimasi parameter yang jauh lebih banyak ($K \\times p(p+1)/2$).`,
        formula: `\\delta_k(x) = x^T \\Sigma^{-1} \\mu_k - \\frac{1}{2} \\mu_k^T \\Sigma^{-1} \\mu_k + \\ln(\\pi_k)`,
        code: `# 8.10: Komparasi Batas Keputusan Linear Discriminant Analysis (LDA) vs QDA
import numpy as np
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis, QuadraticDiscriminantAnalysis
from sklearn.metrics import accuracy_score

np.random.seed(42)
n_samples = 300
# Kelas 0: Kovarians melingkar
X0 = np.random.multivariate_normal(mean=[0, 0], cov=[[1.0, 0.0], [0.0, 1.0]], size=n_samples)
# Kelas 1: Kovarians elips miring dengan varians berbeda (Melanggar asumsi homoskedastisitas LDA)
X1 = np.random.multivariate_normal(mean=[2, 2], cov=[[3.0, 1.8], [1.8, 1.5]], size=n_samples)

X = np.vstack([X0, X1])
y = np.array([0]*n_samples + [1]*n_samples)

# Melatih LDA vs QDA
lda = LinearDiscriminantAnalysis().fit(X, y)
qda = QuadraticDiscriminantAnalysis().fit(X, y)

acc_lda = accuracy_score(y, lda.predict(X))
acc_qda = accuracy_score(y, qda.predict(X))

print("=== EVALUASI KLASIFIKASI GENERATIF: LDA VS QDA ===")
print(f"Akurasi Linear Discriminant Analysis (LDA)   : {acc_lda*100:.2f}% (Batas Linier Terbatas)")
print(f"Akurasi Quadratic Discriminant Analysis (QDA): {acc_qda*100:.2f}% (Batas Kuadratik Fleksibel)")
print(f"Keunggulan Fleksibilitas Kovarians QDA       : +{(acc_qda - acc_lda)*100:.2f}%")`,
        expectedOutput: "QDA mengungguli LDA ketika matriks kovarians antarkelas berbeda nyata.",
        codeExp: "Skrip membandingkan performa batas keputusan linier LDA dengan batas kuadratik QDA pada data multivariat dengan struktur kovarians heterogen.",
        pitfalls: [
          "Menerapkan QDA pada dataset dengan ukuran sampel kecil dan jumlah fitur banyak, yang memicu singular matrix error pada estimasi matriks kovarians per kelas.",
          "Mengasumsikan LDA hanya algoritma klasifikasi; LDA juga merupakan teknik reduksi dimensi tersupervisi yang sangat efektif sebelum pemodelan lain."
        ],
        refTitle: "R. A. Fisher: The Use of Multiple Measurements in Taxonomic Problems (Annals of Eugenics)",
        refUrl: "https://onlinelibrary.wiley.com/doi/10.1111/j.1469-1809.1936.tb02137.x"
      }
    ]
  }
];
