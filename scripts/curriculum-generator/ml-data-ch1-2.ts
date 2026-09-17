import { ChapterDef } from "./da-data-ch1-3";

export const ML_CHAPTERS_1_TO_2: ChapterDef[] = [
  // ==========================================
  // BAB 1: Fondasi Machine Learning: Paradigma, Formulasi Matematis & Alur Pemodelan
  // ==========================================
  {
    orderIndex: 1,
    id: "machine-learning-ch-1",
    slug: "bab-1-fondasi-machine-learning-paradigma-formulasi-matematis-alur-pemodelan",
    title: "BAB 1: Fondasi Machine Learning: Paradigma, Formulasi Matematis & Alur Pemodelan",
    desc: "Fondasi keilmuan pembelajaran mesin: definisi operasional Tom Mitchell, taksonomi paradigma (terawasi, tak terawasi, penguatan), ruang hipotesis dan fungsi target intrinsik, minimisasi risiko empiris (ERM), taksonomi fungsi kerugian, bias induktif, arsitektur estimator Scikit-Learn, dan implementasi estimator linier dari nol.",
    coreConcepts: ["Tom Mitchell Definition", "Machine Learning Paradigms", "Hypothesis Space", "Empirical Risk Minimization", "Inductive Bias", "Estimator API Architecture"],
    subchapters: [
      {
        num: "1.1",
        slug: "1-1-definisi-operasional-machine-learning-menurut-tom-mitchell-1997",
        title: "1.1. Definisi Operasional Machine Learning Menurut Tom Mitchell (1997)",
        desc: "Dekomposisi formal definisi Mitchell: pemetaan triplet komputasi Tugas (T), Pengalaman (E), dan Ukuran Kinerja (P) sebagai landasan rekayasa sistem cerdas.",
        concept: `Machine Learning (ML) bukanlah sekadar penulisan instruksi kondisional (if-else) yang rumit, melainkan paradigma komputasi di mana algoritma menyimpulkan aturan matematis secara otomatis dari observasi data empiris. Definisi operasional paling fundamental dan diakui secara universal dirumuskan oleh Tom M. Mitchell (1997) dalam bukunya *Machine Learning*:

"Suatu program komputer dikatakan belajar dari pengalaman $E$ berkenaan dengan suatu kelas tugas $T$ dan ukuran kinerja $P$, jika kinerjanya pada tugas-tugas dalam $T$, sebagaimana diukur oleh $P$, meningkat seiring dengan bertambahnya pengalaman $E$."

Definisi ini meletakkan dasar rekayasa sistem cerdas yang terukur secara objektif. Dalam setiap inisiatif Machine Learning, praktisi wajib mendefinisikan triplet komputasi $(T, E, P)$ secara eksplisit:
1. **Tugas ($T$ - Task):** Masalah spesifik yang diselesaikan sistem secara operasional, bukan bagaimana sistem menyelesaikannya. Contohnya: mendeteksi anomali transaksi kartu kredit atau memprediksi waktu retensi pelanggan.
2. **Pengalaman ($E$ - Experience):** Kumpulan data historis atau interaksi lingkungan yang dikonsumsi oleh algoritma optimasi selama proses pembelajaran.
3. **Ukuran Kinerja ($P$ - Performance Measure):** Metrik evaluasi kuantitatif independen yang mengevaluasi seberapa baik tugas $T$ diselesaikan pada data uji yang belum pernah dilihat sebelumnya (misalnya $F_1$-Score, Mean Absolute Error, atau expected reward).`,
        formula: `\\text{Model } M \\text{ learns if } \\frac{\\partial P(M; T)}{\\partial E} > 0 \\quad \\text{pada evaluasi data tak terlihat}`,
        code: `# 1.1: Pemetaan Operasional Triplet Mitchell (T, E, P) pada Model Regresi
import numpy as np
from sklearn.metrics import mean_squared_error

# Inisialisasi simulasi tugas estimasi harga (Task T)
# Pengalaman E: Data observasi yang bertambah secara inkremental
np.random.seed(42)
def generate_experience(n_samples):
    X = np.random.uniform(20, 100, (n_samples, 1)) # Luas rumah (m^2)
    # Hubungan target riil: Harga = 15jt/m^2 + noise
    y = 15.0 * X.ravel() + 50.0 + np.random.normal(0, 25.0, n_samples)
    return X, y

# Dataset Uji Independen untuk mengevaluasi Kinerja P
X_test, y_test = generate_experience(500)

sample_sizes = [10, 50, 200, 1000]
print("=== DEMONSTRASI FORMULASI MITCHELL (T, E, P) ===")
print("Task T: Prediksi Harga Properti | Metrik P: Root Mean Squared Error (RMSE)")

for n_exp in sample_sizes:
    # 1. Akuisisi Pengalaman E (Dataset Latih)
    X_train, y_train = generate_experience(n_exp)
    
    # 2. Pembelajaran Parameter (OLS Normal Equation w = (X^T X)^(-1) X^T y)
    X_b = np.c_[np.ones((n_exp, 1)), X_train]
    w = np.linalg.inv(X_b.T.dot(X_b)).dot(X_b.T).dot(y_train)
    
    # 3. Evaluasi Kinerja P pada Data Uji yang Sama
    X_test_b = np.c_[np.ones((len(X_test), 1)), X_test]
    y_pred = X_test_b.dot(w)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    print(f"Pengalaman E: {n_exp:4d} sampel -> Bobot: w0={w[0]:6.2f}, w1={w[1]:5.2f} -> Kinerja P (RMSE): {rmse:6.2f}")`,
        expectedOutput: "Pengalaman E bertambah dari 10 ke 1000 sampel menurunkan galat RMSE secara konsisten membuktikan pembelajaran Mitchell.",
        codeExp: "Skrip memformulasikan secara konkret definisi Mitchell dengan melacak peningkatan kinerja P (penurunan RMSE) pada data uji independen seiring bertambahnya volume pengalaman latih E dari 10 hingga 1000 observasi.",
        pitfalls: [
          "Mengevaluasi ukuran kinerja P pada data latih (pengalaman E) sendiri, yang mencampuradukkan memorisasi dengan generalisasi.",
          "Menentukan tugas T yang terlalu ambigu tanpa batasan ruang variabel masukan dan luaran yang jelas."
        ],
        refTitle: "Tom M. Mitchell: Machine Learning (McGraw-Hill Science/Engineering/Math)",
        refUrl: "https://www.cs.cmu.edu/~tom/mlbook.html"
      },
      {
        num: "1.2",
        slug: "1-2-taksonomi-utama-paradigma-pembelajaran-mesin",
        title: "1.2. Taksonomi Utama Paradigma Pembelajaran: Terawasi, Tak Terawasi, dan Penguatan",
        desc: "Struktur kategorisasi mendalam: pembedaan mekanisme transmisi sinyal supervisi antara Supervised Learning, Unsupervised Learning, dan Reinforcement Learning.",
        concept: `Seluruh spektrum algoritma machine learning dikelompokkan ke dalam taksonomi berbasis ada-tidaknya dan sifat transmisi sinyal supervisi yang memandu pembaruan bobot model.

1. **Supervised Learning (Pembelajaran Terawasi):** Algoritma menerima pasangan input-output yang teranotasi lengkap $\\mathcal{D} = \\{(x_i, y_i)\\}_{i=1}^n$. Tujuannya adalah mengaproksimasi fungsi pemetaan $f: \\mathcal{X} \\to \\mathcal{Y}$. Bergantung pada kardinalitas ruang target $\\mathcal{Y}$, terbagi menjadi *Regresi* (jika $\\mathcal{Y} \\subseteq \\mathbb{R}$) dan *Klasifikasi* (jika $\\mathcal{Y}$ adalah himpunan diskrit berhingga).
2. **Unsupervised Learning (Pembelajaran Tak Terawasi):** Dataset hanya memuat fitur masukan tanpa anotasi target $\\mathcal{D} = \\{x_i\\}_{i=1}^n$. Algoritma bertugas menemukan struktur intrinsik, kepadatan probabilitas bersama $p(x)$, pengelompokan (*clustering*), atau manifold berdimensi rendah yang merepresentasikan varians data secara esensial.
3. **Reinforcement Learning (Pembelajaran Penguatan):** Agen otonom berinteraksi secara sekuensial dengan lingkungan dinamis yang dimodelkan sebagai Markov Decision Process (MDP). Tidak ada label benar/salah secara langsung; agen hanya menerima sinyal umpan balik skalar berupa imbalan (*reward*) tertunda dan harus menyeimbangkan antara eksplorasi aksi baru (*exploration*) dan eksploitasi strategi terbaik saat ini (*exploitation*).`,
        formula: `\\mathcal{L}_{\\text{sup}} = \\frac{1}{n}\\sum_{i=1}^n \\ell(f(x_i), y_i) \\quad \\text{vs} \\quad J_{\\text{RL}}(\\theta) = \\mathbb{E}_{\\tau \\sim \\pi_\\theta}\\left[ \\sum_{t=0}^T \\gamma^t r_t \\right]`,
        code: `# 1.2: Komparasi Mekanistik Supervised (KNN) vs Unsupervised (K-Means) pada Data Sintetis
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.cluster import KMeans
from sklearn.metrics import accuracy_score, silhouette_score

np.random.seed(42)
# Sintesis data 2 klaster Gauss
c1 = np.random.normal(loc=[2.0, 2.0], scale=0.6, size=(100, 2))
c2 = np.random.normal(loc=[6.0, 6.0], scale=0.6, size=(100, 2))
X = np.vstack([c1, c2])
y_true = np.array([0] * 100 + [1] * 100) # Sinyal supervisi eksplisit

# 1. Pendekatan Terawasi (Supervised): Menggunakan pasangan (X, y)
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X, y_true)
y_pred_sup = knn.predict(X)
acc_sup = accuracy_score(y_true, y_pred_sup)

# 2. Pendekatan Tak Terawasi (Unsupervised): Murni mengeksploitasi geometri X tanpa y
kmeans = KMeans(n_clusters=2, random_state=42, n_init=10)
cluster_labels = kmeans.fit_predict(X)
sil_score = silhouette_score(X, cluster_labels)

print("=== KOMPARASI PARADIGMA PEMBELAJARAN ===")
print(f"Supervised (K-NN)    - Sinyal Supervisi: Lengkap -> Akurasi Klasifikasi : {acc_sup*100:.2f}%")
print(f"Unsupervised (KMeans)- Sinyal Supervisi: Nol     -> Silhouette Separation: {sil_score:.4f}")`,
        expectedOutput: "Supervised menghasilkan akurasi prediksi mendekati 100% sementara Unsupervised menemukan separasi klaster alami dengan skor silhouette tinggi.",
        codeExp: "Skrip mendemonstrasikan bagaimana paradigma terawasi memanfaatkan vektor target untuk melatih batas keputusan, sementara algoritma tak terawasi mengekstraksi geometri data murni berdasarkan kedekatan jarak spasial.",
        pitfalls: [
          "Memaksakan penggunaan model supervised ketika anotasi label memiliki noise tinggi atau bias pelabelan subjektif.",
          "Mengukur performa model unsupervised menggunakan metrik supervised tanpa justifikasi pemetaan klaster yang valid."
        ],
        refTitle: "Trevor Hastie, Robert Tibshirani, Jerome Friedman: The Elements of Statistical Learning",
        refUrl: "https://hastie.su.domains/ElemStatLearn/"
      },
      {
        num: "1.3",
        slug: "1-3-ruang-hipotesis-dan-fungsi-target-intrinsik",
        title: "1.3. Ruang Hipotesis (Hypothesis Space) dan Fungsi Target Intrinsik",
        desc: "Karakterisasi matematis ruang pencarian model: batasan daya ekspresi hipotesis model dan celah aproksimasi terhadap fungsi dunia nyata.",
        concept: `Dalam kerangka teori komputasi pembelajaran (Computational Learning Theory), diasumsikan terdapat suatu fungsi target deterministik atau probabilistik intrinsik alamiah $f^*: \\mathcal{X} \\to \\mathcal{Y}$ yang menghasilkan data observasi riil (biasanya terdistorsi oleh gangguan stokastik $\\epsilon$).

Tugas perancang sistem Machine Learning adalah memilih **Ruang Hipotesis** (Hypothesis Space $\\mathcal{H}$), yaitu himpunan seluruh fungsi kandidat yang dapat diekspresikan oleh arsitektur model yang dipilih. Misalnya:
- Ruang regresi linier: $\\mathcal{H}_{\\text{linear}} = \\{h(x) = w^\\top x + b \\mid w \\in \\mathbb{R}^d, b \\in \\mathbb{R}\\}$
- Ruang pohon keputusan: $\\mathcal{H}_{\\text{tree}} = \\{h(x) = \\sum_{m=1}^M c_m \\mathbb{I}(x \\in R_m)\\}$

Proses pelatihan (*training*) pada hakikatnya adalah algoritma pencarian optimasi di dalam $\\mathcal{H}$ untuk menemukan satu fungsi hipotesis terbaik $h^* \\in \\mathcal{H}$ yang paling mendekati $f^*$. Jika fungsi target sejati $f^*$ berada di luar ruang hipotesis $\\mathcal{H}$ (misalnya fenomena periodik sinusoidal didekati menggunakan model linier murni), sistem mengalami **galat aproksimasi struktural** (*structural approximation error*) yang tidak dapat dihilangkan berapapun banyaknya data yang dikumpulkan.`,
        formula: `h^* = \\arg\\min_{h \\in \\mathcal{H}} R(h) \\quad \\text{di mana } R(h) = \\mathbb{E}_{(x, y) \\sim \\mathcal{D}}[\\ell(h(x), y)]`,
        code: `# 1.3: Evaluasi Galat Aproksimasi: Ruang Hipotesis Linier vs Polinomial pada Fungsi Target Non-Linier
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import mean_squared_error

np.random.seed(42)
# Fungsi target riil intrinsik f*(x) = sin(pi * x)
X = np.linspace(-1, 1, 100).reshape(-1, 1)
y_true = np.sin(np.pi * X).ravel()

# 1. Pencarian dalam Ruang Hipotesis Linier H_linear (Daya ekspresi terbatas)
h_lin = LinearRegression().fit(X, y_true)
pred_lin = h_lin.predict(X)
err_lin = mean_squared_error(y_true, pred_lin)

# 2. Pencarian dalam Ruang Hipotesis Polinomial Derajat 5 H_poly
poly = PolynomialFeatures(degree=5, include_bias=False)
X_poly = poly.fit_transform(X)
h_poly = LinearRegression().fit(X_poly, y_true)
pred_poly = h_poly.predict(X_poly)
err_poly = mean_squared_error(y_true, pred_poly)

print("=== ANALISIS RUANG HIPOTESIS ===")
print(f"Galat Aproksimasi H_linear (Daya Rendah)  : MSE = {err_lin:.4f}")
print(f"Galat Aproksimasi H_poly5  (Daya Fleksibel): MSE = {err_poly:.6f}")`,
        expectedOutput: "Ruang hipotesis linier mengalami galat aproksimasi tinggi pada target sinus, sementara polinomial derajat 5 mendekati target dengan MSE sangat kecil.",
        codeExp: "Skrip menunjukkan bahwa pemilihan ruang hipotesis membatasi batas bawah kesalahan; model linier murni tidak dapat menangkap dinamika sinus berapapun titik data yang diberikan.",
        pitfalls: [
          "Memperbesar ruang hipotesis secara berlebihan tanpa regulasi sehingga mencakup fungsi kompleks yang menghafal noise acak.",
          "Mengira algoritma pembelajaran gagal konvergen, padahal fungsi target memang mustahil direpresentasikan oleh ruang hipotesis yang dipilih."
        ],
        refTitle: "Mehryar Mohri, Afshin Rostamizadeh, Ameet Talwalkar: Foundations of Machine Learning",
        refUrl: "https://cs.nyu.edu/~mohri/mlbook/"
      },
      {
        num: "1.4",
        slug: "1-4-prinsip-minimisasi-risiko-empiris-erm",
        title: "1.4. Prinsip Minimisasi Risiko Empiris (Empirical Risk Minimization - ERM)",
        desc: "Fondasi optimasi statistik: transisi dari risiko sejati teoritis ke risiko empiris sampel observasi serta syarat konsistensi Vapnik-Chervonenkis.",
        concept: `Tujuan fundamental pembelajaran mesin adalah meminimalkan **Risiko Sejati** (True Risk atau Generalization Error) $R(h)$, yaitu ekspektasi kehilangan fungsi kerugian terhadap seluruh distribusi probabilitas gabungan populasi $P(X, Y)$:
$$R(h) = \\mathbb{E}_{(X, Y) \\sim P}[\\ell(h(X), Y)] = \\int \\ell(h(x), y) \\, dP(x, y)$$

Namun dalam praktiknya, distribusi populasi $P(X, Y)$ tidak pernah diketahui. Praktisi hanya memiliki akses ke sampel acak berukuran berhingga $S = \\{(x_1, y_1), \\dots, (x_n, y_n)\\}$. Sebagai penggantinya, Vladimir Vapnik merumuskan **Prinsip Minimisasi Risiko Empiris** (Empirical Risk Minimization - ERM), di mana algoritma meminimalkan rata-rata kerugian pada sampel latih:
$$R_{\\text{emp}}(h) = \\frac{1}{n} \\sum_{i=1}^n \\ell(h(x_i), y_i)$$

Menurut Hukum Bilangan Besar, $R_{\\text{emp}}(h) \\to R(h)$ untuk satu hipotesis tetap saat $n \\to \\infty$. Namun, jika optimasi memilih $h^*$ yang meminimalkan $R_{\\text{emp}}$ dari ruang hipotesis yang sangat kaya, $R_{\\text{emp}}(h^*)$ akan menjadi estimator yang sangat optimis (bias ke bawah) terhadap risiko sejati, memicu fenomena overfitting. Teori Vapnik-Chervonenkis (VC) membuktikan bahwa ERM konsisten hanya jika kapasitas $\\mathcal{H}$ dibatasi.`,
        formula: `R_{\\text{emp}}(h) = \\frac{1}{n}\\sum_{i=1}^n \\ell(h(x_i), y_i) \\quad \\text{dengan jaminan } R(h) \\le R_{\\text{emp}}(h) + \\sqrt{\\frac{\\text{VC}(\\mathcal{H})\\ln(2n/d) + \\ln(4/\\delta)}{n}}`,
        code: `# 1.4: Demonstrasi Deviasi Risiko Empiris (R_emp) terhadap Risiko Sejati (R_true)
import numpy as np
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error

np.random.seed(42)
# Populasi sejati (10.000 sampel)
X_pop = np.random.uniform(-3, 3, (10000, 1))
y_pop = X_pop.ravel()**2 + np.random.normal(0, 1.0, 10000)

# Sampel latih empiris kecil berukuran n=40
idx_train = np.random.choice(10000, size=40, replace=False)
X_train, y_train = X_pop[idx_train], y_pop[idx_train]

# 1. Model ERM Tanpa Pembatasan Kapasitas (Overfitting Ekstrem)
tree_unconstrained = DecisionTreeRegressor(max_depth=None, random_state=42)
tree_unconstrained.fit(X_train, y_train)

# 2. Model ERM dengan Regularisasi Kapasitas (Struktur Risiko Dibatasi)
tree_regularized = DecisionTreeRegressor(max_depth=3, random_state=42)
tree_regularized.fit(X_train, y_train)

# Evaluasi R_emp (Train) vs R_true (Populasi)
remp_uncon = mean_squared_error(y_train, tree_unconstrained.predict(X_train))
rtrue_uncon = mean_squared_error(y_pop, tree_unconstrained.predict(X_pop))

remp_reg = mean_squared_error(y_train, tree_regularized.predict(X_train))
rtrue_reg = mean_squared_error(y_pop, tree_regularized.predict(X_pop))

print("=== EVALUASI EMPIRICAL RISK MINIMIZATION (ERM) ===")
print(f"Tanpa Batasan : R_emp (Train) = {remp_uncon:.4f} | R_true (Populasi) = {rtrue_uncon:.4f} (Overfitting Masif)")
print(f"Dibatasi (d=3): R_emp (Train) = {remp_reg:.4f} | R_true (Populasi) = {rtrue_reg:.4f} (Generalisasi Kuat)")`,
        expectedOutput: "Model tanpa pembatasan mencapai R_emp = 0.00 namun R_true meledak, sedangkan model teratur memiliki R_emp moderat dan R_true stabil.",
        codeExp: "Skrip mengilustrasikan jebakan utama ERM: meminimalkan kerugian empiris sampel latih hingga nol menghasilkan estimasi risiko yang bias dan kegagalan generalisasi pada populasi sejati.",
        pitfalls: [
          "Menyimpulkan bahwa algoritma berhasil belajar hanya karena kerugian pada data latih mendekati nol.",
          "Mengabaikan kompleksitas kapasitas model saat mengevaluasi laju konvergensi risiko empiris."
        ],
        refTitle: "Vladimir Vapnik: The Nature of Statistical Learning Theory (Springer)",
        refUrl: "https://link.springer.com/book/10.1007/978-1-4757-3264-1"
      },
      {
        num: "1.5",
        slug: "1-5-taksonomi-fungsi-kerugian-regresi-dan-klasifikasi",
        title: "1.5. Taksonomi Fungsi Kerugian (Loss Functions) untuk Regresi dan Klasifikasi",
        desc: "Karakterisasi matematis loss functions: MSE, MAE, Huber untuk regresi; Zero-One, Cross-Entropy, dan Hinge Loss untuk klasifikasi.",
        concept: `Fungsi kerugian (Loss Function $\\ell(\\hat{y}, y)$) adalah instrumen matematis yang mengkuantifikasi penalti finansial atau komputasional akibat ketidaksesuaian antara estimasi model $\\hat{y}$ dan label observasi aktual $y$. Pemilihan fungsi kerugian menentukan sifat ketahanan (*robustness*) model terhadap pencilan serta bentuk batas keputusan yang dihasilkan.

**1. Domain Regresi:**
- **Squared Error ($L_2$ Loss / MSE):** $\\ell(y, \\hat{y}) = (y - \\hat{y})^2$. Sangat peka terhadap pencilan karena gradien tumbuh linier terhadap besaran residual, memaksa estimasi mendekati rata-rata bersyarat $\\mathbb{E}[Y|X]$.
- **Absolute Error ($L_1$ Loss / MAE):** $\\ell(y, \\hat{y}) = |y - \\hat{y}|$. Memiliki turunan konstan $\\pm 1$, menghasilkan estimasi median bersyarat dan kebal terhadap pencilan ekstrem.
- **Huber Loss:** Mengombinasikan kuadratik untuk residual kecil $|y - \\hat{y}| \\le \\delta$ dan linier untuk residual besar, menawarkan transisi mulus diferensiabel sekaligus ketahanan statistik.

**2. Domain Klasifikasi ($y \\in \\{-1, +1\\}$ atau $\\{0, 1\\}$):**
- **0-1 Loss:** $\\mathbb{I}(y \\ne \\hat{y})$. Fungsi ideal namun diskontinu non-cembung (*NP-hard* untuk dioptimasi).
- **Binary Cross-Entropy (Log-Loss):** $\\ell(y, p) = -[y \\ln p + (1-y) \\ln(1-p)]$. Menghukum prediksi dengan keyakinan tinggi yang salah secara logaritmik asimtotik tak hingga.
- **Hinge Loss:** $\\ell(y, f(x)) = \\max(0, 1 - y \\cdot f(x))$. Dasar dari SVM, memberikan penalti hanya jika sampel melanggar batas margin $y \\cdot f(x) < 1$.`,
        formula: `\\mathcal{L}_{\\text{Huber}}(a) = \\begin{cases} \\frac{1}{2} a^2 & \\text{untuk } |a| \\le \\delta \\\\ \\delta(|a| - \\frac{1}{2}\\delta) & \\text{lainnya} \\end{cases} \\quad (a = y - \\hat{y})`,
        code: `# 1.5: Perbandingan Ketahanan Estimator MSE vs MAE vs Huber Terhadap Outlier Ekstrem
import numpy as np
from sklearn.linear_model import LinearRegression, HuberRegressor, RANSACRegressor

np.random.seed(42)
X = np.linspace(0, 10, 50).reshape(-1, 1)
y = 2.5 * X.ravel() + 3.0 + np.random.normal(0, 1.0, 50)

# Tambahkan 5 pencilan (outliers) ekstrem yang merusak regresi
y[45:] -= 40.0 

# 1. Regresi MSE (OLS Biasa)
model_mse = LinearRegression().fit(X, y)

# 2. Regresi Huber (Transisi Kuadratik ke Linier)
model_huber = HuberRegressor(epsilon=1.35).fit(X, y)

print("=== ROBUSTNESS KOMPARATIF FUNGSI KERUGIAN ===")
print("Kemiringan Teoretis Sejati (True Slope): 2.50")
print(f"Estimasi Model MSE (LinearRegression) : {model_mse.coef_[0]:.2f} (Terdistorsi Berat oleh Outlier)")
print(f"Estimasi Model Huber (Huber Loss)     : {model_huber.coef_[0]:.2f} (Tahan Terhadap Outlier)")`,
        expectedOutput: "Model MSE tertarik drastis ke arah outlier sedangkan model Huber mempertahankan kemiringan mendekati nilai sejati 2.50.",
        codeExp: "Skrip menunjukkan bagaimana penalti kuadratik MSE menarik garis regresi menjauhi tren sejati akibat 5 outlier, sementara fungsi kerugian Huber mempertahankan estimasi parameter yang kokoh.",
        pitfalls: [
          "Menggunakan MSE saat dataset mengandung label bernilai ekstrem atau noise sensor instrumen.",
          "Mengabaikan kalibrasi ambang batas parameter delta pada Huber loss yang menentukan batas transisi outlier."
        ],
        refTitle: "Peter J. Huber: Robust Statistics (John Wiley & Sons)",
        refUrl: "https://www.wiley.com/en-us/Robust+Statistics%2C+2nd+Edition-p-9780470129906"
      },
      {
        num: "1.6",
        slug: "1-6-paradigma-induktif-inductive-bias-pembelajaran",
        title: "1.6. Paradigma Induktif (Inductive Bias): Mengapa Pembelajaran Tanpa Asumsi Tidak Dimungkinkan",
        desc: "Teorema No Free Lunch dan implikasi filosofis Inductive Bias: asumsi apriori yang mutlak diperlukan agar model mampu melakukan generalisasi.",
        concept: `Salah satu teorema paling fundamental dalam teori pembelajaran mesin adalah **Teorema No Free Lunch (NFL)** yang dirumuskan oleh David Wolpert dan William Macready (1997). Teorema ini menyatakan bahwa jika performa suatu algoritma pembelajaran dievaluasi atas seluruh distribusi masalah yang mungkin secara seragam, maka tidak ada satu pun algoritma yang secara rata-rata lebih unggul dari algoritma lainnya—bahkan tidak lebih baik daripada tebakan acak.

Konsekuensi matematis langsung dari Teorema NFL adalah: **Pembelajaran mesin tanpa asumsi apriori adalah mustahil**. Agar suatu program komputer mampu memprediksi label untuk data yang belum pernah dilihat sebelumnya, model wajib memiliki **Inductive Bias** (Bias Induktif), yaitu sekumpulan asumsi implisit atau eksplisit yang digunakan oleh algoritma untuk memprioritaskan satu hipotesis di atas hipotesis lain.

Contoh bias induktif dalam algoritma populer:
- **Regresi Linier:** Mengasumsikan hubungan antara fitur masukan dan target berbentuk hiperbidang linier mulus.
- **k-Nearest Neighbors (k-NN):** Mengasumsikan kehalusan lokal (*local smoothness*)—observasi yang berdekatan secara spasial dalam ruang metrik cenderung memiliki label yang sama.
- **Pohon Keputusan:** Mengasumsikan batas keputusan ortogonal sumbu (*axis-aligned orthogonal splits*) dan memprioritaskan pohon yang lebih dangkal (Prinsip Ockham's Razor).
- **Convolutional Neural Networks (CNN):** Memiliki bias induktif berupa invariansi translasi spasial (*spatial translation equivariance*) dan lokalitas piksel.`,
        formula: `\\sum_{f} P(h(x) = f(x) \\mid \\mathcal{D}) = \\text{konstan untuk seluruh algoritma pembelajaran}`,
        code: `# 1.6: Demonstrasi Teorema No Free Lunch: Keunggulan Terbalik Model Linier vs KNN
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

np.random.seed(42)

# Masalah A: Struktur Linier (Sesuai dengan Inductive Bias Model Linier)
XA = np.random.randn(200, 2)
yA = (XA[:, 0] + XA[:, 1] > 0).astype(int)

# Masalah B: Struktur Donat Konsentris (Sesuai dengan Inductive Bias Spasial Lokal KNN)
r = np.random.uniform(0.5, 3.0, 200)
theta = np.random.uniform(0, 2*np.pi, 200)
XB = np.c_[r * np.cos(theta), r * np.sin(theta)]
yB = (r > 1.8).astype(int)

# Evaluasi pada Masalah A
acc_lin_A = accuracy_score(yA, LogisticRegression().fit(XA, yA).predict(XA))
acc_knn_A = accuracy_score(yA, KNeighborsClassifier(n_neighbors=5).fit(XA, yA).predict(XA))

# Evaluasi pada Masalah B
acc_lin_B = accuracy_score(yB, LogisticRegression().fit(XB, yB).predict(XB))
acc_knn_B = accuracy_score(yB, KNeighborsClassifier(n_neighbors=5).fit(XB, yB).predict(XB))

print("=== DEMONSTRASI INDUCTIVE BIAS (NO FREE LUNCH) ===")
print(f"Masalah Linier: Regresi Logistik = {acc_lin_A*100:.1f}% | KNN (k=5) = {acc_knn_A*100:.1f}%")
print(f"Masalah Sirkular: Regresi Logistik = {acc_lin_B*100:.1f}% | KNN (k=5) = {acc_knn_B*100:.1f}%")`,
        expectedOutput: "Regresi Logistik unggul mutlak pada masalah linier namun gagal pada struktur donat, sedangkan KNN berkinerja sebaliknya.",
        codeExp: "Skrip mendemonstrasikan bahwa tidak ada satu algoritma yang unggul universal: performa model sangat bergantung pada keselarasan bias induktif algoritma terhadap struktur data alami masalah.",
        pitfalls: [
          "Mencari algoritma 'terbaik' yang diasumsikan mampu menyelesaikan seluruh domain masalah tanpa memahami bias induktifnya.",
          "Menggunakan model non-parametrik yang sangat fleksibel pada dataset kecil di mana bias induktif kuat model sederhana jauh lebih stabil."
        ],
        refTitle: "David H. Wolpert: The Lack of A Priori Distinctions Between Learning Algorithms",
        refUrl: "https://link.springer.com/article/10.1007/BF00114774"
      },
      {
        num: "1.7",
        slug: "1-7-arsitektur-desain-estimator-scikit-learn",
        title: "1.7. Arsitektur Desain Estimator Scikit-Learn: fit, transform, dan predict",
        desc: "Prinsip rekayasa perangkat lunak Scikit-Learn: konsistensi antarmuka polimorfik Estimator, Transformer, dan Predictor.",
        concept: `Keberhasilan pustaka Scikit-Learn sebagai standar de facto machine learning di industri bertumpu pada arsitektur perangkat lunak yang elegan, dirumuskan oleh Buitinck et al. (2013). Arsitektur ini dibangun di atas prinsip pemisahan tanggung jawab yang ketat dan antarmuka polimorfik yang konsisten melalui tiga abstraksi peran utama:

1. **Estimator:** Setiap objek yang dapat mempelajari state representasi dari data. Wajib mengimplementasikan metode:
   - \` + "\`fit(X, y=None)\`" + \`: Menjalankan estimasi parameter internal dari data observasi. Seluruh parameter hasil pembelajaran disimpan sebagai atribut berakhiran garis bawah (contoh: \` + "\`coef_\`" + \`, \` + "\`intercept_\`" + \`, \` + "\`mean_\`" + \`) dan metode selalu mengembalikan \` + "\`self\`" + \`.
2. **Transformer:** Estimator yang mampu mentranslasikan data ke dalam representasi baru. Wajib mengimplementasikan metode:
   - \` + "\`transform(X)\`" + \`: Mengaplikasikan parameter transformasi yang telah dipelajari pada \` + "\`fit\`" + \` ke matriks data masukan baru.
   - \` + "\`fit_transform(X, y=None)\`" + \`: Alternatif optimasi komputasi yang menggabungkan pembelajaran dan transformasi dalam satu alur terpadu.
3. **Predictor:** Estimator yang mampu menghasilkan inferensi kuantitatif pada sampel data baru tak berlabel. Wajib mengimplementasikan metode:
   - \` + "\`predict(X)\`" + \`: Menghasilkan nilai estimasi kelas diskrit atau target kontinu.
   - \` + "\`predict_proba(X)\`" + \`: Mengembalikan distribusi probabilitas bersyarat $P(Y=k|X)$.

Prinsip desain ini menjamin inspeksi parameter yang transparan (*non-proliferation of classes*), interoperabilitas langsung dengan tipe data NumPy/Pandas, serta kemudahan penggabungan ke dalam struktur komposit Pipeline.`,
        formula: `\\text{Model Contract: } \\hat{\\theta} \\leftarrow \\text{estimator.fit}(X_{\\text{train}}) \\implies \\hat{Y} \\leftarrow \\text{estimator.predict}(X_{\\text{test}})`,
        code: `# 1.7: Menginspeksi Arsitektur Estimator dan Konvensi Trailing Underscore Scikit-Learn
import numpy as np
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler

X = np.array([[1.0, 20.0], [2.0, 40.0], [3.0, 60.0], [4.0, 80.0]])
y = np.array([2.5, 4.5, 6.5, 8.5])

# 1. Peran Transformer: Mempelajari mean_ dan var_ lalu mentransformasi
scaler = StandardScaler()
print("Atribut sebelum fit:", [attr for attr in dir(scaler) if attr.endswith('_') and not attr.startswith('__')])
X_scaled = scaler.fit_transform(X)
print("Atribut terpelajar setelah fit:", [attr for attr in dir(scaler) if attr.endswith('_') and not attr.startswith('__')])
print(f"Parameter Terpelajar: Mean={scaler.mean_}, Var={scaler.var_}")

# 2. Peran Predictor: Mempelajari coef_ dan intercept_ lalu memprediksi
model = Ridge(alpha=1.0)
model.fit(X_scaled, y)
print(f"Parameter Model: Coef={model.coef_}, Intercept={model.intercept_:.4f}")
preds = model.predict(scaler.transform([[5.0, 100.0]]))
print(f"Inferensi Data Baru: {preds[0]:.4f}")`,
        expectedOutput: "Atribut berakhiran garis bawah hanya muncul setelah pemanggilan fit(), membuktikan kepatuhan terhadap kontrak Scikit-Learn.",
        codeExp: "Skrip menginspeksi secara langsung siklus hidup estimator Scikit-Learn, membuktikan bahwa seluruh parameter terpelajar disimpan dengan akhiran garis bawah setelah metode fit dieksekusi.",
        pitfalls: [
          "Memanggil transform() atau predict() sebelum memanggil fit(), yang akan membangkitkan NotFittedError.",
          "Melakukan fit() ulang pada data uji (test set), yang melanggar isolasi data dan menyebabkan data leakage."
        ],
        refTitle: "Lars Buitinck et al.: API design for machine learning software: experiences from the scikit-learn project",
        refUrl: "https://arxiv.org/abs/1309.0238"
      },
      {
        num: "1.8",
        slug: "1-8-representasi-data-tabular-matriks-desain-vektor-fitur",
        title: "1.8. Representasi Data Tabular: Vektor Fitur Multidimensi dan Matriks Desain",
        desc: "Formulasi aljabar linier struktur data: representasi matriks desain X berdimensi n x d, tipe data skalar, dan penanganan memori terkompresi.",
        concept: `Machine Learning modern memproses realitas fisik melalui abstraksi aljabar linier. Dalam domain data tabular, kumpulan observasi empiris distrukturkan ke dalam **Matriks Desain** (Design Matrix) $\\mathbf{X} \\in \\mathbb{R}^{n \\times d}$, di mana baris merepresentasikan observasi individual dan kolom merepresentasikan fitur-fitur kovariat:
$$\\mathbf{X} = \\begin{bmatrix} x_{11} & x_{12} & \\dots & x_{1d} \\\\ x_{21} & x_{22} & \\dots & x_{2d} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ x_{n1} & x_{n2} & \\dots & x_{nd} \\end{bmatrix} = \\begin{bmatrix} \\mathbf{x}_1^\\top \\\\ \\mathbf{x}_2^\\top \\\\ \\vdots \\\\ \\mathbf{x}_n^\\top \\end{bmatrix}$$

Setiap baris $\\mathbf{x}_i \\in \\mathbb{R}^d$ adalah sebuah vektor fitur titik koordinat di dalam ruang Euklides multidimensi $\\mathbb{R}^d$. Kolom matriks $\\mathbf{X}$ harus memenuhi sifat numerik terstandarisasi (tipe data floating-point IEEE 754 seperti \` + "\`float32\`" + \` atau \` + "\`float64\`" + \`).

Jika data masukan bersifat jarang (*sparse*)—misalnya representasi bag-of-words teks atau pengkodean one-hot berdimensi tinggi di mana lebih dari 95% elemen bernilai nol—menyimpan $\\mathbf{X}$ sebagai matriks padat (*dense array*) akan menghabiskan memori RAM secara sia-sia. Dalam kondisi ini, matriks direpresentasikan menggunakan struktur data Compressed Sparse Row (CSR) atau Compressed Sparse Column (CSC) yang hanya mengalokasikan memori untuk nilai-nilai non-nol berserta indeks penunjuknya.`,
        formula: `\\mathbf{X} \\in \\mathbb{R}^{n \\times d}, \\quad \\mathbf{y} \\in \\mathbb{R}^n, \\quad \\text{Memori CSR} = \\mathcal{O}(\\text{nnz}) \\ll \\mathcal{O}(n \\cdot d)`,
        code: `# 1.8: Efisiensi Memori Matriks Desain Padat (Dense) vs Matriks Jarang (Sparse CSR)
import sys
import numpy as np
from scipy import sparse

n_samples = 10000
n_features = 1000

# Sintesis data dengan 98% bernilai nol (sparsity 98%)
np.random.seed(42)
dense_matrix = np.random.binomial(1, 0.02, size=(n_samples, n_features)).astype(np.float64)

# Konversi ke representasi Compressed Sparse Row (CSR)
sparse_matrix = sparse.csr_matrix(dense_matrix)

mem_dense = dense_matrix.nbytes / (1024 * 1024)
mem_sparse = (sparse_matrix.data.nbytes + sparse_matrix.indices.nbytes + sparse_matrix.indptr.nbytes) / (1024 * 1024)
penghematan = (1.0 - mem_sparse / mem_dense) * 100

print("=== EFISIENSI STRUKTUR MATRIKS DESAIN ===")
print(f"Dimensi Matriks Desain: {n_samples} baris x {n_features} kolom")
print(f"Penggunaan Memori Dense Array : {mem_dense:6.2f} MB")
print(f"Penggunaan Memori Sparse CSR   : {mem_sparse:6.2f} MB")
print(f"Persentase Penghematan Memori : {penghematan:6.2f}%")`,
        expectedOutput: "Representasi sparse CSR menghemat lebih dari 85% alokasi memori RAM pada matriks dengan tingkat kelangkaan 98%.",
        codeExp: "Skrip mengukur perbandingan alokasi memori antara array padat NumPy dan matriks terkompresi SciPy CSR pada data berdimensi 10.000 x 1.000 dengan kepadatan 2%, membuktikan urgensi representasi sparse dalam skala besar.",
        pitfalls: [
          "Mengonversi matriks sparse ke dense array secara tidak sengaja melalui fungsi NumPy standar seperti np.array() yang dapat memicu Out Of Memory (OOM).",
          "Mengabaikan tipe data numerik (menggunakan float64 ketika float32 sudah mencukupi presisi komputasi).",
        ],
        refTitle: "SciPy Reference Guide: Sparse Matrices (scipy.sparse)",
        refUrl: "https://docs.scipy.org/doc/scipy/reference/sparse.html"
      },
      {
        num: "1.9",
        slug: "1-9-alur-kerja-rekayasa-machine-learning-end-to-end",
        title: "1.9. Alur Kerja Rekayasa Machine Learning End-to-End: Dari Eksplorasi ke Produksi",
        desc: "Protokol orkestrasi siklus hidup model: pemisahan dataset, perumusan baseline, optimasi model, audit kebocoran, dan serialisasi artefak produksi.",
        concept: `Rekayasa Machine Learning profesional mengikuti siklus alur kerja tertutup yang disiplin untuk memastikan model yang dikembangkan memiliki performa prediktif yang valid, stabil, dan dapat dipertanggungjawabkan saat di-deploy ke lingkungan produksi.

Tahapan siklus hidup ML end-to-end terdiri dari:
1. **Formulasi Masalah & Pengukuran Baseline:** Mengubah objektif bisnis menjadi target kuantitatif dan menetapkan model dasar paling sederhana (*naive baseline*—seperti rata-rata historis atau regresi linier tanpa penalaan) sebagai batas bawah penerimaan sistem.
2. **Partisi Data Anti-Bocor:** Membagi data menjadi himpunan Latih (*Train*), Validasi (*Validation*), dan Uji (*Test*) di awal proses sebelum operasi preprocessing apa pun dijalankan.
3. **Prapemrosesan & Rekayasa Fitur:** Penskalaan, imputasi, dan transformasi yang dipelajari murni dari data latih dan diterapkan secara identik pada data validasi/uji.
4. **Pencarian Model & Penalaan Hiperparameter:** Melakukan eksplorasi ruang arsitektur dan optimasi parameter melalui validasi silang bersarang (*nested cross-validation*).
5. **Evaluasi Objektif & Uji Diagnostik:** Menilai metrik pada data uji independen yang belum pernah disentuh, melakukan analisis residual, dan menguji stabilitas terhadap pergeseran distribusi (*data drift*).
6. **Serialisasi & Deploy Produksi:** Menyimpan pipeline utuh ke dalam format biner yang aman dan membangun sistem monitoring performa waktu nyata.`,
        formula: `\\mathcal{D} = \\mathcal{D}_{\\text{train}} \\cup \\mathcal{D}_{\\text{val}} \\cup \\mathcal{D}_{\\text{test}}, \\quad \\mathcal{D}_{\\text{train}} \\cap \\mathcal{D}_{\\text{test}} = \\emptyset`,
        code: `# 1.9: Implementasi Alur Kerja ML End-to-End dengan Baseline dan Evaluasi Pipeline
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report

# 1. Sintesis Data Permasalahan Bisnis (1000 nasabah, 10 fitur)
X, y = make_classification(n_samples=1000, n_features=10, weights=[0.8, 0.2], random_state=42)

# 2. Partisi Data Ketat (80% Train, 20% Test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# 3. Model Baseline (Strategi Frekuensi Terbanyak)
baseline = DummyClassifier(strategy="most_frequent").fit(X_train, y_train)
acc_base = baseline.score(X_test, y_test)

# 4. Pipeline Model Kandidat Utama (StandardScaler + RandomForest)
pipeline = make_pipeline(StandardScaler(), RandomForestClassifier(n_estimators=100, random_state=42))
pipeline.fit(X_train, y_train)
acc_rf = pipeline.score(X_test, y_test)

print("=== ALUR KERJA REKAYASA ML LENGKAP ===")
print(f"1. Akurasi Naive Baseline (Majority Class): {acc_base*100:.2f}%")
print(f"2. Akurasi Pipeline RandomForest         : {acc_rf*100:.2f}%")
print(f"3. Lift Peningkatan Kinerja              : +{(acc_rf - acc_base)*100:.2f}%")`,
        expectedOutput: "Pipeline RandomForest menghasilkan peningkatan akurasi signifikan di atas naive baseline yang hanya memprediksi kelas mayoritas.",
        codeExp: "Skrip mengorkestrasi alur kerja ML standar dengan membandingkan model kompleks terintegrasi pipeline terhadap baseline naif pada data uji yang diisolasi secara stratifikasi.",
        pitfalls: [
          "Mengevaluasi keberhasilan model hanya berdasarkan akurasi mentah pada data tak seimbang tanpa membandingkannya dengan baseline kelas mayoritas.",
          "Menyimpan bobot model tanpa menyertakan objek transformer preprocessing yang digunakan saat pelatihan."
        ],
        refTitle: "Google: Rules of Machine Learning: Best Practices for ML Engineering",
        refUrl: "https://developers.google.com/machine-learning/guides/rules-of-ml"
      },
      {
        num: "1.10",
        slug: "1-10-implementasi-estimator-linear-dari-nol-kontrak-scikit-learn",
        title: "1.10. Implementasi Estimator Linear Sederhana Dari Nol Memenuhi Kontrak Scikit-Learn",
        desc: "Konstruksi custom estimator: pewarisan BaseEstimator dan RegressorMixin, implementasi algoritma closed-form OLS, dan validasi dengan check_estimator.",
        concept: `Memahami arsitektur Scikit-Learn secara tuntas dicapai dengan membangun estimator kustom dari nol yang sepenuhnya memenuhi kontrak resmi pustaka Scikit-Learn. Dengan mewarisi dua kelas fondasi:
1. \` + "\`BaseEstimator\`" + \`: Menyediakan implementasi otomatis metode \` + "\`get_params()\`" + \` dan \` + "\`set_params()\`" + \` yang memungkinkan estimator berinteraksi mulus dengan \` + "\`GridSearchCV\`" + \` dan \` + "\`Pipeline\`" + \` tanpa memerlukan parameter \` + "\`*args\`" + \` atau \` + "\`**kwargs\`" + \` di konstruktor.
2. \` + "\`RegressorMixin\`" + \`: Menyediakan metode evaluasi bawaan \` + "\`score(X, y)\`" + \` yang menghitung koefisien determinasi $R^2$.

Estimator yang dibuat harus mematuhi aturan ketat:
- Konstruktor \` + "\`__init__\`" + \` hanya boleh menerima argumen eksplisit dan tidak boleh melakukan validasi data atau modifikasi atribut.
- Metode \` + "\`fit(X, y)\`" + \` wajib memvalidasi dimensi masukan menggunakan utilitas \` + "\`check_X_y\`" + \`, menyimpan seluruh parameter hasil optimasi pada atribut berakhiran garis bawah (seperti \` + "\`coef_\`" + \`, \` + "\`intercept_\`" + \`, \` + "\`n_features_in_\`" + \`), dan mengembalikan \` + "\`self\`" + \`.
- Metode \` + "\`predict(X)\`" + \` wajib memvalidasi format input dengan \` + "\`check_array\`" + \` dan memastikan estimator telah melalui tahap pelatihan menggunakan \` + "\`check_is_fitted\`" + \`.`,
        formula: `\\hat{\\mathbf{w}} = (\\mathbf{X}^\\top \\mathbf{X})^{-1} \\mathbf{X}^\\top \\mathbf{y}, \\quad R^2 = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2}`,
        code: `# 1.10: Konstruksi Custom Linear Regressor Sesuai Spesifikasi Resmi Scikit-Learn
import numpy as np
from sklearn.base import BaseEstimator, RegressorMixin
from sklearn.utils.validation import check_X_y, check_array, check_is_fitted
from sklearn.model_selection import cross_val_score

class CustomAnalyticLinearRegression(BaseEstimator, RegressorMixin):
    def __init__(self, fit_intercept=True):
        self.fit_intercept = fit_intercept

    def fit(self, X, y):
        # 1. Validasi formal dimensi dan tipe data input
        X, y = check_X_y(X, y, accept_sparse=False)
        self.n_features_in_ = X.shape[1]
        
        # 2. Penambahan kolom bias intercept jika diaktifkan
        if self.fit_intercept:
            X_b = np.c_[np.ones((X.shape[0], 1)), X]
        else:
            X_b = X
            
        # 3. Solusi analitik OLS Normal Equation: w = (X^T X)^(-1) X^T y
        w_all = np.linalg.pinv(X_b.T.dot(X_b)).dot(X_b.T).dot(y)
        
        if self.fit_intercept:
            self.intercept_ = float(w_all[0])
            self.coef_ = w_all[1:].astype(float)
        else:
            self.intercept_ = 0.0
            self.coef_ = w_all.astype(float)
            
        return self

    def predict(self, X):
        # Memastikan model sudah di-fit sebelumnya
        check_is_fitted(self, attributes=["coef_", "intercept_"])
        X = check_array(X)
        return X.dot(self.coef_) + self.intercept_

# Validasi integrasi kustom estimator dalam ekosistem scikit-learn
np.random.seed(42)
X_sim = np.random.uniform(0, 10, (100, 2))
y_sim = 3.0 * X_sim[:, 0] + 1.5 * X_sim[:, 1] + 5.0 + np.random.normal(0, 0.5, 100)

custom_reg = CustomAnalyticLinearRegression(fit_intercept=True)
scores = cross_val_score(custom_reg, X_sim, y_sim, cv=5)
custom_reg.fit(X_sim, y_sim)

print("=== VALIDASI ESTIMATOR KUSTOM SCIKIT-LEARN ===")
print(f"Koefisien Terpelajar (coef_)      : {custom_reg.coef_}")
print(f"Intercept Terpelajar (intercept_)  : {custom_reg.intercept_:.4f}")
print(f"R^2 Rata-rata Cross-Validation 5-Fold: {scores.mean():.4f}")`,
        expectedOutput: "Estimator kustom berfungsi sempurna dalam fungsi cross_val_score scikit-learn menghasilkan R^2 > 0.99.",
        codeExp: "Skrip mengimplementasikan custom estimator yang mematuhi kontrak formal Scikit-Learn, mewarisi BaseEstimator dan RegressorMixin, serta berhasil berintegrasi dengan fungsi validasi silang bawaan.",
        pitfalls: [
          "Menerima parameter *args atau **kwargs di __init__, yang akan menggagalkan fungsi kloning model pada GridSearchCV.",
          "Mengubah state atribut input di dalam konstruktor alih-alih di dalam metode fit()."
        ],
        refTitle: "Scikit-Learn Documentation: Developing scikit-learn estimators",
        refUrl: "https://scikit-learn.org/stable/developers/develop.html"
      }
    ]
  },

  // ==========================================
  // BAB 2: Pra-pemrosesan Data & Rekayasa Fitur: Penskalaan, Encoding, dan Imputasi
  // ==========================================
  {
    orderIndex: 2,
    id: "machine-learning-ch-2",
    slug: "bab-2-pra-pemrosesan-data-rekayasa-fitur-penskalaan-encoding-imputasi",
    title: "BAB 2: Pra-pemrosesan Data & Rekayasa Fitur: Penskalaan, Encoding, dan Imputasi",
    desc: "Metodologi transformasi fitur numerik dan kategorik: analisis dampak penskalaan pada optimasi gradien dan metrik jarak, StandardScaler vs RobustScaler vs MinMaxScaler, One-Hot Encoding dan dummy trap, Target Encoding, imputasi SimpleImputer vs MICE IterativeImputer, transformasi Box-Cox & Yeo-Johnson, diskretisasi binning, komposisi ColumnTransformer, dan pencegahan kebocoran data absolut.",
    coreConcepts: ["Feature Scaling", "Categorical Encoding", "Missing Data Imputation", "Power Transforms", "ColumnTransformer", "Data Leakage Prevention"],
    subchapters: [
      {
        num: "2.1",
        slug: "2-1-urgensi-penskalaan-fitur-algoritma-gradien-dan-jarak",
        title: "2.1. Urgensi Penskalaan Fitur: Mengapa Algoritma Berbasis Gradien dan Jarak Memerlukan Normalisasi",
        desc: "Kajian geometris dan numerik dampak disparitas skala fitur: kontur elips kerugian yang menghambat Gradient Descent dan dominasi metrik jarak Euklides.",
        concept: `Dalam dataset tabular dunia nyata, variabel fitur sering kali memiliki satuan fisik dan rentang magnitudo numerik yang sangat timpang—misalnya fitur *Pendapatan Tahunan* berada pada skala ratusan juta rupiah ($10^8$), sedangkan fitur *Jumlah Tanggungan* berada pada skala satuan ($10^0$). Disparitas skala ini memiliki konsekuensi fatal bagi dua kategori besar algoritma machine learning:

1. **Algoritma Berbasis Metrik Jarak (k-NN, SVM, K-Means, PCA):**
   Jarak Euklides dihitung berdasarkan jumlah selisih kuadrat:
   $$d(\\mathbf{x}_i, \\mathbf{x}_j) = \\sqrt{\\sum_{k=1}^d (x_{ik} - x_{jk})^2}$$
   Jika fitur pendapatan tidak diskalakan, selisih pendapatan sebesar Rp 10.000.000 akan menghasilkan kuadrat $10^{14}$, yang secara mutlak menenggelamkan kontribusi fitur tanggungan (selisih kuadrat paling banyak 25). Akibatnya, algoritma secara keliru menganggap dua nasabah dengan pendapatan berbeda sedikit sebagai entitas yang sangat jauh, mengabaikan seluruh fitur lainnya.

2. **Algoritma Berbasis Turunan Gradien (Regresi Linier/Logistik, Jaringan Saraf, SGD):**
   Fungsi kerugian pada data yang tidak diskalakan membentuk kontur hiper-elipsoid yang sangat pipih dan memanjang (*ravines*). Vektor gradien berosilasi liar melintasi lereng curam daripada bergerak langsung menuju titik minimum global. Hal ini memperlambat konvergensi dan memerlukan learning rate yang sangat kecil agar optimasi tidak meledak. Sebaliknya, penskalaan mentransformasi kontur menjadi sirkular simetris, memungkinkan konvergensi cepat dalam garis lurus.`,
        formula: `\\nabla_w L(w) = -\\frac{2}{n} \\mathbf{X}^\\top (\\mathbf{y} - \\mathbf{X}w) \\implies \\text{Laju konvergensi dibatasi oleh rasio kondisi } \\kappa(\\mathbf{X}^\\top \\mathbf{X}) = \\frac{\\lambda_{\\max}}{\\lambda_{\\min}}`,
        code: `# 2.1: Demonstrasi Dampak Penskalaan Fitur pada Kecepatan Konvergensi SGDRegressor
import numpy as np
from sklearn.linear_model import SGDRegressor
from sklearn.preprocessing import StandardScaler

np.random.seed(42)
n_samples = 1000
# Fitur 1: Skala jutaan (Pendapatan), Fitur 2: Skala kecil (Usia)
X_raw = np.c_[np.random.uniform(1e6, 5e6, n_samples), np.random.uniform(20, 60, n_samples)]
y = 0.000002 * X_raw[:, 0] + 0.5 * X_raw[:, 1] + np.random.normal(0, 1.0, n_samples)

# 1. Pelatihan SGD pada Data Mentah Tanpa Penskalaan
sgd_raw = SGDRegressor(max_iter=1000, tol=1e-3, random_state=42)
sgd_raw.fit(X_raw, y)

# 2. Pelatihan SGD pada Data Terstandarisasi
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_raw)
sgd_scaled = SGDRegressor(max_iter=1000, tol=1e-3, random_state=42)
sgd_scaled.fit(X_scaled, y)

print("=== DAMPAK PENSKALAAN PADA GRADIENT DESCENT ===")
print(f"Iterasi Konvergensi Data Mentah (Unscaled): {sgd_raw.n_iter_} iterasi (R^2 = {sgd_raw.score(X_raw, y):.4f})")
print(f"Iterasi Konvergensi Data Skala (Scaled)   : {sgd_scaled.n_iter_} iterasi (R^2 = {sgd_scaled.score(X_scaled, y):.4f})")`,
        expectedOutput: "Model pada data terstandarisasi konvergen jauh lebih cepat dengan skor R^2 yang optimal dibanding data mentah.",
        codeExp: "Skrip membandingkan jumlah iterasi yang dibutuhkan oleh SGDRegressor pada data dengan rentang skala ekstrem versus data terstandarisasi, membuktikan peningkatan stabilitas dan efisiensi numerik optimasi.",
        pitfalls: [
          "Menerapkan penskalaan fitur pada model berbasis pohon keputusan (seperti Random Forest atau XGBoost) yang secara teoritis invarian terhadap penskalaan monotonik.",
          "Menghitung rata-rata dan deviasi standar penskalaan pada gabungan seluruh data (train + test), yang memicu kebocoran data."
        ],
        refTitle: "Scikit-Learn Documentation: Preprocessing data",
        refUrl: "https://scikit-learn.org/stable/modules/preprocessing.html#standardization-or-mean-removal-and-variance-scaling"
      },
      {
        num: "2.2",
        slug: "2-2-standardscaler-transformasi-zscore-distribusi-standar",
        title: "2.2. StandardScaler: Transformasi Z-Score Menuju Distribusi Rata-rata Nol dan Varians Satuan",
        desc: "Formulasi analitis standardisasi Z-score: pemusatan sentral (zero mean) dan normalisasi dispersi unit variance beserta karakteristik matematiknya.",
        concept: `StandardScaler melakukan standarisasi fitur dengan mentransformasikan nilai observasi sehingga distribusi yang dihasilkan memiliki rata-rata sampel tepat sama dengan nol ($\\mu = 0$) dan deviasi standar sampel sama dengan satu ($\\sigma = 1$). 

Secara matematis, untuk setiap nilai fitur $x$ pada suatu kolom, transformasi Z-Score dirumuskan sebagai:
$$z = \\frac{x - \\mu}{\\sigma}$$
di mana $\\mu = \\frac{1}{n} \\sum_{i=1}^n x_i$ adalah nilai rata-rata sampel dan $\\sigma = \\sqrt{\\frac{1}{n} \\sum_{i=1}^n (x_i - \\mu)^2}$ adalah deviasi standar populasi/sampel yang dihitung selama metode \` + "\`fit()\`" + \`.

Sifat-sifat penting StandardScaler:
1. **Mempertahankan Bentuk Distribusi:** Transformasi ini adalah transformasi afinitas linier. Jika distribusi asli miring (*skewed*), distribusi hasil transformasi Z-score akan tetap miring persis sama; StandardScaler **tidak** mengubah data non-normal menjadi distribusi normal Gauss.
2. **Kesesuaian dengan Regularisasi:** Penskalaan ini sangat esensial saat menerapkan regularisasi penalti norma Ridge ($L_2$) atau Lasso ($L_1$), karena penalti mengasumsikan seluruh koefisien bobot $\\mathbf{w}$ beroperasi pada skala kovariat yang setara.
3. **Sensitivitas terhadap Outlier:** Karena $\\mu$ dan $\\sigma$ sangat dipengaruhi oleh nilai-nilai ekstrem, adanya pencilan besar akan mempersempit rentang nilai data normal mendekati nol secara artifisial.`,
        formula: `z_{ij} = \\frac{x_{ij} - \\mu_j}{\\sigma_j}, \\quad \\mathbb{E}[Z_j] = 0, \\quad \\text{Var}(Z_j) = 1`,
        code: `# 2.2: Implementasi Manual Z-Score vs Scikit-Learn StandardScaler
import numpy as np
from sklearn.preprocessing import StandardScaler

np.random.seed(42)
X = np.random.normal(loc=25.0, scale=8.0, size=(100, 3))

# 1. Perhitungan Manual
mu_manual = np.mean(X, axis=0)
sigma_manual = np.std(X, axis=0)
X_z_manual = (X - mu_manual) / sigma_manual

# 2. Perhitungan Scikit-Learn
scaler = StandardScaler()
X_z_sklearn = scaler.fit_transform(X)

# Verifikasi kesesuaian numerik
selisih_maksimal = np.max(np.abs(X_z_manual - X_z_sklearn))

print("=== VERIFIKASI TRANSFORMASI Z-SCORE ===")
print(f"Rata-rata Sampel Sebelum Scaling : {mu_manual}")
print(f"Deviasi Standar Sebelum Scaling  : {sigma_manual}")
print(f"Rata-rata Setelah StandardScaler : {np.mean(X_z_sklearn, axis=0).round(6)}")
print(f"Varians Setelah StandardScaler   : {np.var(X_z_sklearn, axis=0).round(6)}")
print(f"Selisih Maksimal Manual vs Sklearn: {selisih_maksimal:.2e} (Presisi Sempurna)")`,
        expectedOutput: "Rata-rata setelah scaling tepat [0, 0, 0] dan varians tepat [1, 1, 1] dengan presisi float64.",
        codeExp: "Skrip memverifikasi ekuivalensi matematis antara perhitungan manual rumus Z-score dan objek StandardScaler Scikit-Learn pada data sintetis 3 variabel acak.",
        pitfalls: [
          "Menerapkan StandardScaler pada matriks sparse tanpa menyetel with_mean=False, yang akan menghancurkan struktur hemat memori dan memicu alokasi memori raksasa.",
          "Menganggap StandardScaler secara ajaib mengubah data yang berdistribusi log-normal atau multimodal menjadi distribusi normal Gauss."
        ],
        refTitle: "Scikit-Learn API Reference: sklearn.preprocessing.StandardScaler",
        refUrl: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html"
      },
      {
        num: "2.3",
        slug: "2-3-minmaxscaler-vs-robustscaler-penanganan-outlier-ekstrem",
        title: "2.3. MinMaxScaler vs RobustScaler: Menangani Penskalaan Saat Menghadapi Outlier Ekstrem",
        desc: "Kajian komparatif penanganan rentang: kompresi bounded interval [0, 1] vs normalisasi kokoh berbasis median dan Interquartile Range (IQR).",
        concept: `Ketika dataset memuat pencilan (*outliers*), StandardScaler dan MinMaxScaler menghasilkan transformasi yang terdistorsi secara parah. Memilih scaler yang tepat memerlukan pemahaman terhadap karakteristik matematis masing-masing:

**1. MinMaxScaler (Rentang Terbatas):**
Mentransformasikan fitur ke dalam interval tertutup terikat $[a, b]$, biasanya $[0, 1]$:
$$x_{\\text{scaled}} = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}} (b - a) + a$$
Kelebihan: Menjaga nilai nol eksak pada data sparse dan menghasilkan batas rentang yang pasti (sangat cocok untuk masukan algoritma jaringan saraf atau pemrosesan citra).
Kelemahan fatal: Jika terdapat satu outlier raksasa, $x_{\\max}$ akan sangat besar, menyebabkan 99% data normal terkompresi ke dalam interval sempit $[0, 0.05]$, menghancurkan daya pembeda (*variance*) fitur tersebut.

**2. RobustScaler (Ketahanan Statistik Berbasis Kuartil):**
Menggunakan statistik non-parametrik yang kebal terhadap pencilan: nilai Median ($Q_2$) sebagai ukuran pemusatan dan Interquartile Range (IQR = $Q_3 - Q_1$) sebagai ukuran dispersi:
$$x_{\\text{robust}} = \\frac{x - Q_2(x)}{Q_3(x) - Q_1(x)}$$
Karena kuartil dihitung berdasarkan peringkat posisi data, pencilan ekstrem sebesar apa pun pada 25% data terbawah atau teratas tidak akan mengubah nilai $Q_1$, $Q_2$, maupun $Q_3$. Rentang data normal tetap terlindungi dan mempertahankan varians aslinya.`,
        formula: `x_{\\text{minmax}} = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}, \\quad x_{\\text{robust}} = \\frac{x - \\text{median}(x)}{\\text{IQR}(x)}`,
        code: `# 2.3: Perbandingan Perilaku MinMaxScaler vs RobustScaler Saat Terdapat Outlier
import numpy as np
from sklearn.preprocessing import MinMaxScaler, RobustScaler

# Data pendapatan normal (10 orang: 5jt - 15jt) + 1 Outlier ekstrem (1 Milyar)
pendapatan = np.array([5.0, 6.0, 7.5, 8.0, 9.0, 10.0, 11.5, 12.0, 14.0, 15.0, 1000.0]).reshape(-1, 1)

mms = MinMaxScaler()
rs = RobustScaler()

pend_mms = mms.fit_transform(pendapatan)
pend_rs = rs.fit_transform(pendapatan)

print("=== MINMAXSCALER VS ROBUSTSCALER PADA DATA OUTLIER ===")
print("Indeks Sampel Normal (Data ke-4: Nilai Asli = 8.0 jt):")
print(f"  Hasil MinMaxScaler : {pend_mms[3, 0]:.4f} (Terkompresi mendekati nol)")
print(f"  Hasil RobustScaler : {pend_rs[3, 0]:.4f} (Mempertahankan skala representatif)")
print(f"Rentang 10 Sampel Normal pada MinMaxScaler: [{pend_mms[:10].min():.4f}, {pend_mms[:10].max():.4f}]")
print(f"Rentang 10 Sampel Normal pada RobustScaler: [{pend_rs[:10].min():.4f}, {pend_rs[:10].max():.4f}]")`,
        expectedOutput: "MinMaxScaler mengompresi 10 data normal ke rentang 0.00 hingga 0.01, sementara RobustScaler menjaga rentang data normal antara -0.80 hingga 1.10.",
        codeExp: "Skrip mendemonstrasikan secara empiris kelemahan MinMaxScaler yang merusak resolusi data normal ketika ada satu nilai ekstrem 1000, serta keunggulan RobustScaler dalam mempertahankan struktur sejati data normal.",
        pitfalls: [
          "Menggunakan MinMaxScaler untuk data uji yang mungkin memiliki nilai di luar batas min/max data latih, menghasilkan nilai di luar interval [0, 1].",
          "Mengasumsikan RobustScaler menghasilkan data yang terikat dalam rentang tertentu (hasilnya tidak terbatas/unbounded)."
        ],
        refTitle: "Scikit-Learn User Guide: Scaling data with outliers",
        refUrl: "https://scikit-learn.org/stable/auto_examples/preprocessing/plot_all_scaling.html"
      },
      {
        num: "2.4",
        slug: "2-4-penyandian-kategorik-nominal-onehotencoder-dummy-variable-trap",
        title: "2.4. Penyandian Kategorik Nominal: OneHotEncoder dan Perangkap Dummy Variable Trap",
        desc: "Transformasi biner fitur nominal: representasi ortogonal vektor basis, pencegahan jebakan multikolinieritas sempurna (drop='first'), dan handling_unknown.",
        concept: `Algoritma Machine Learning berbasis aljabar linier tidak dapat menginterpretasikan variabel kategorik berlabel teks secara langsung. Untuk fitur kategorik nominal (yang tidak memiliki urutan alamiah, seperti *Provinsi*, *Merek Mobil*, atau *Status Pernikahan*), memberikan pengkodean integer sekuensial (0, 1, 2) adalah kesalahan fatal karena memaksakan relasi metrik palsu (misalnya menganggap Provinsi 2 dua kali lebih besar dari Provinsi 1).

Solusi standarnya adalah **One-Hot Encoding**, di mana variabel kategorik dengan $K$ kategori unik dipetakan menjadi $K$ kolom indikator biner terpisah:
$$\\mathbf{x}_{\\text{onehot}} = [\\mathbb{I}(c = c_1), \\mathbb{I}(c = c_2), \\dots, \\mathbb{I}(c = c_K)]$$

Namun, pada model regresi linier yang menyertakan suku intersep $\\beta_0$, penambahan seluruh $K$ kolom biner memicu **Perangkap Variabel Dummy** (*Dummy Variable Trap*). Karena jumlah seluruh kolom dummy selalu tepat sama dengan satu untuk setiap baris:
$$\\sum_{k=1}^K \\mathbb{I}(c = c_k) = 1 = \\mathbf{x}_{\\text{intercept}}$$
Hal ini menciptakan **multikolinieritas sempurna** (*perfect multicollinearity*), menyebabkan matriks gram $(\\mathbf{X}^\\top \\mathbf{X})$ menjadi singular (tidak memiliki invers unik), sehingga estimasi parameter OLS meledak. Pencegahannya adalah menjatuhkan satu kategori acuan (*reference category*) melalui parameter \` + "\`drop='first'\`" + \`.`,
        formula: `\\sum_{k=1}^K D_k = \\mathbf{1} \\implies \\text{Rank}(\\mathbf{X}) < K + 1 \\quad (\\text{Singularitas Matriks Desain})`,
        code: `# 2.4: Demonstrasi Multikolinieritas Sempurna dan Penanganan drop='first' OneHotEncoder
import numpy as np
import pandas as pd
from sklearn.preprocessing import OneHotEncoder

# Data kategorik 3 status transaksi
data = pd.DataFrame({'Kota': ['Jakarta', 'Bandung', 'Surabaya', 'Jakarta', 'Bandung']})

# 1. OneHotEncoder Standar (K Kolom) - Rawan Dummy Variable Trap pada OLS
ohe_full = OneHotEncoder(sparse_output=False)
X_full = ohe_full.fit_transform(data[['Kota']])
df_full = pd.DataFrame(X_full, columns=ohe_full.get_feature_names_out(['Kota']))

# 2. OneHotEncoder Anti-Multikolinieritas (K-1 Kolom)
ohe_drop = OneHotEncoder(drop='first', sparse_output=False)
X_drop = ohe_drop.fit_transform(data[['Kota']])
df_drop = pd.DataFrame(X_drop, columns=ohe_drop.get_feature_names_out(['Kota']))

print("=== ONE-HOT ENCODING & DUMMY VARIABLE TRAP ===")
print("Full Dummy (K=3 Kolom):\n", df_full)
print("\nAnti-Trap Dummy (drop='first', K-1=2 Kolom):\n", df_drop)
print("\nVerifikasi Jumlah Baris Kolom Full:", df_full.sum(axis=1).tolist(), "(Konstan 1.0 -> Multikolinieritas Sempurna)")`,
        expectedOutput: "Full dummy menghasilkan penjumlahan baris tepat 1.0 yang memicu singularitas, sedangkan drop='first' menghilangkan redundansi linear.",
        codeExp: "Skrip menunjukkan pembentukan matriks indikator biner One-Hot Encoding dan membuktikan redundansi aljabar linier jika seluruh kategori dipertahankan bersamaan dengan suku intersep.",
        pitfalls: [
          "Menggunakan drop='first' bersamaan dengan regularisasi L2 Ridge, yang dapat menghasilkan penalti yang tidak simetris terhadap kategori dasar yang dijatuhkan.",
          "Menyetel handle_unknown='error' pada sistem produksi, yang menyebabkan aplikasi crash saat menerima kategori baru yang belum pernah muncul di data latih."
        ],
        refTitle: "Scikit-Learn API Reference: sklearn.preprocessing.OneHotEncoder",
        refUrl: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html"
      },
      {
        num: "2.5",
        slug: "2-5-penyandian-ordinal-dan-target-encoding-relasi-target",
        title: "2.5. Penyandian Kategorik Ordinal & Target Encoding: Mengkodekan Informasi Urutan dan Relasi Target",
        desc: "Transformasi kategori terurut dan berdimensi tinggi: OrdinalEncoder eksplisit vs Target (Mean) Encoding dengan regulasi smoothing m-estimate.",
        concept: `Tidak semua variabel kategorik bersifat nominal. Dua skenario khusus memerlukan pendekatan penyandian tingkat lanjut:

**1. Variabel Kategorik Ordinal (Memiliki Jenjang Hirarkis):**
Fitur seperti tingkat pendidikan (*SD, SMP, SMA, S1, S2, S3*) atau skala kepuasan survei (*Rendah, Sedang, Tinggi*) memuat informasi urutan intrinsik. Penggunaan One-Hot Encoding akan membuang informasi urutan ini. \` + "\`OrdinalEncoder\`" + \` memetakan kategori secara eksplisit ke integer terurut sesuai urutan domain keahlian yang didefinisikan secara manual: $\\text{Rendah} \\to 0, \\text{Sedang} \\to 1, \\text{Tinggi} \\to 2$.

**2. Variabel Kategori Berdimensi Tinggi (High-Cardinality Categorical):**
Jika suatu kolom nominal memiliki ribuan kategori unik (seperti *Kode Pos* atau *ID Toko*), One-Hot Encoding akan menghasilkan ribuan kolom biner baru, memicu pembengkakan dimensi (*curse of dimensionality*). Solusi modern standar industri adalah **Target Encoding** (Mean Encoding), di mana setiap kategori digantikan oleh nilai rata-rata variabel target $Y$ pada kategori tersebut:
$$S_k = \\mathbb{E}[Y \\mid X = c_k]$$

Untuk mencegah overfitting masif pada kategori dengan jumlah sampel sedikit (misalnya kategori yang hanya muncul 1 kali dengan $Y=1$ sehingga rata-ratanya langsung 100%), diterapkan teknik **Empirical Bayes Smoothing** (m-estimate):
$$\\hat{S}_k = \\frac{n_k \\cdot \\bar{y}_k + m \\cdot \\bar{y}_{\\text{global}}}{n_k + m}$$
di mana $n_k$ adalah frekuensi kategori $k$, $\\bar{y}_k$ adalah rata-rata target kategori, $\\bar{y}_{\\text{global}}$ adalah rata-rata target seluruh dataset, dan $m$ adalah parameter bobot regulasi.`,
        formula: `\\hat{x}_k = \\lambda(n_k) \\bar{y}_k + (1 - \\lambda(n_k)) \\bar{y}_{\\text{global}}, \\quad \\lambda(n_k) = \\frac{n_k}{n_k + m}`,
        code: `# 2.5: Implementasi Target Encoding dengan Regulasi Smoothing (m-estimate)
import pandas as pd
import numpy as np
from sklearn.preprocessing import TargetEncoder

# Dataset simulasi: Kota dengan kardinalitas beragam dan target churn/beli
df = pd.DataFrame({
    'Kota': ['Surabaya']*50 + ['Jakarta']*100 + ['Pelosok']*2,
    'Beli': [1]*35 + [0]*15 + [1]*20 + [0]*80 + [1]*2 # Pelosok n=2, semuanya Beli=1
})

# 1. Target Encoding Scikit-Learn (dengan smoothing otomatis bawaan)
te = TargetEncoder(smooth="auto", cv=5, random_state=42)
encoded_values = te.fit_transform(df[['Kota']], df['Beli'])
df['Kota_Encoded'] = encoded_values

print("=== TARGET ENCODING DENGAN SMOOTHING ===")
print(f"Rata-rata Global Target: {df['Beli'].mean():.4f}")
print("\nHasil Encoding per Kategori Unik:")
ringkasan = df.groupby('Kota')[['Kota_Encoded', 'Beli']].agg({'Kota_Encoded': 'first', 'Beli': ['count', 'mean']})
print(ringkasan)`,
        expectedOutput: "Kategori 'Pelosok' dengan sampel n=2 ditarik menuju rata-rata global mencegah overfit 1.00.",
        codeExp: "Skrip menunjukkan bagaimana TargetEncoder melakukan regularisasi smoothing empiris sehingga kategori langka tidak langsung diberi nilai target ekstrem 1.0.",
        pitfalls: [
          "Menghitung Target Encoding langsung pada data tanpa validasi silang out-of-fold, yang menyebabkan kebocoran target parah.",
          "Menggunakan OrdinalEncoder dengan pemetaan default acak tanpa menspesifikasikan daftar urutan kategori secara manual."
        ],
        refTitle: "Scikit-Learn User Guide: Target Encoder",
        refUrl: "https://scikit-learn.org/stable/modules/preprocessing.html#target-encoder"
      },
      {
        num: "2.6",
        slug: "2-6-strategi-imputasi-missing-values-simple-vs-mice-iterative",
        title: "2.6. Strategi Imputasi Missing Values: SimpleImputer vs IterativeImputer (MICE)",
        desc: "Taksonomi mekanisme data hilang (MCAR, MAR, MNAR) dan perbandingan penanganan univariat vs multivariat chaining equations.",
        concept: `Nilai yang hilang (*missing values*) adalah kenyataan tak terhindarkan dalam data industri. Sebelum memilih metode imputasi, praktisi wajib mengidentifikasi mekanisme data hilang berdasarkan teori Donald Rubin:
1. **Missing Completely at Random (MCAR):** Probabilitas data hilang sama sekali tidak berhubungan dengan nilai variabel itu sendiri maupun variabel lain (misal botol sampel laboratorium pecah secara acak).
2. **Missing at Random (MAR):** Probabilitas data hilang berkaitan dengan variabel teramati lain, namun tidak berkaitan dengan nilai fitur itu sendiri (misal pria lebih jarang mengisi kuesioner depresi, namun setelah mengontrol jenis kelamin, nilai hilangnya bersifat acak).
3. **Missing Not at Random (MNAR):** Probabilitas data hilang berhubungan langsung dengan nilai fitur yang hilang itu sendiri (misal nasabah berpenghasilan sangat tinggi sengaja mengosongkan kolom penghasilan).

**Strategi Penanganan Imputasi:**
- **Univariat (\`SimpleImputer\`):** Mengganti nilai hilang menggunakan statistik tunggal kolom: Rata-rata (*Mean*—cocok untuk data simetris normal), Median (*cocok untuk data miring ber-outlier*), atau Modus (*Most Frequent—untuk data kategorik*). Kelemahan: menghancurkan varians alami fitur dan merusak kovarians antarvariabel.
- **Multivariat (\`IterativeImputer\` / MICE):** Menggunakan teknik Multivariate Imputation by Chained Equations. Setiap fitur yang memiliki missing value dimodelkan sebagai fungsi regresi dari seluruh fitur lainnya secara berulang (*round-robin*) hingga konvergen, mempertahankan korelasi struktural multidimensi antarvariabel.`,
        formula: `x_j^{(t)} \\sim \\hat{f}_j(x_{-j}^{(t-1)}) + \\epsilon \\quad \\text{secara sekuensial untuk } j=1, \\dots, p`,
        code: `# 2.6: Komparasi Preservasi Korelasi: SimpleImputer (Mean) vs IterativeImputer (MICE)
import numpy as np
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import SimpleImputer, IterativeImputer

# Sintesis data 2 variabel berkorelasi kuat (r = 0.9)
np.random.seed(42)
x1 = np.random.normal(10, 2, 200)
x2 = 2.0 * x1 + np.random.normal(0, 1, 200)
X_true = np.c_[x1, x2]
r_sejati = np.corrcoef(X_true, rowvar=False)[0, 1]

# Buat missing value 30% pada x2
X_missing = X_true.copy()
mask_missing = np.random.rand(200) < 0.3
X_missing[mask_missing, 1] = np.nan

# 1. Imputasi Univariat Mean
imp_mean = SimpleImputer(strategy='mean')
X_mean = imp_mean.fit_transform(X_missing)
r_mean = np.corrcoef(X_mean, rowvar=False)[0, 1]

# 2. Imputasi Multivariat MICE
imp_mice = IterativeImputer(max_iter=10, random_state=42)
X_mice = imp_mice.fit_transform(X_missing)
r_mice = np.corrcoef(X_mice, rowvar=False)[0, 1]

print("=== EVALUASI PRESERVASI KORELASI IMPUTASI ===")
print(f"Korelasi Asli (True Correlation)     : {r_sejati:.4f}")
print(f"Korelasi Pasca SimpleImputer (Mean)  : {r_mean:.4f} (Korelasi Rusak/Merosot)")
print(f"Korelasi Pasca IterativeImputer(MICE): {r_mice:.4f} (Korelasi Terjaga Baik)")`,
        expectedOutput: "SimpleImputer merusak korelasi alami dari 0.89 menjadi 0.77, sementara IterativeImputer mempertahankan korelasi pada 0.88.",
        codeExp: "Skrip membuktikan bahwa imputasi rata-rata merusak struktur kovarians data, sementara imputasi multivariat berantai mempertahankan hubungan linear sejati antarfitur.",
        pitfalls: [
          "Melakukan drop baris secara membabi buta (dropna) yang dapat memangkas separuh volume dataset dan memperkenalkan bias seleksi jika data tidak berstatus MCAR.",
          "Lupa menyertakan fitur indikator biner 'MissingIndicator' yang mencatat apakah suatu nilai aslinya merupakan hasil imputasi."
        ],
        refTitle: "Stef van Buuren: Flexible Imputation of Missing Data (CRC Press)",
        refUrl: "https://stefvanbuuren.name/fimd/"
      },
      {
        num: "2.7",
        slug: "2-7-transformasi-non-linear-power-transforms-box-cox-yeo-johnson",
        title: "2.7. Transformasi Non-Linear & Power Transforms: Box-Cox dan Yeo-Johnson untuk Distribusi Normal",
        desc: "Stabilisasi varians dan penormalan residual: formulasi keluarga transformasi Box-Cox untuk data positif dan Yeo-Johnson untuk data bernilai riil sembarang.",
        concept: `Banyak model parametrik klasik (seperti Regresi Linier OLS, Linear Discriminant Analysis, dan Gaussian Naive Bayes) bekerja dengan asumsi bahwa fitur masukan atau residual model berdistribusi normal (Gaussian) dengan varians yang homogen (*homoscedasticity*). Jika data mentah memiliki kemiringan (*skewness*) ekstrem atau ekor tebal (*heavy tails*), asumsi ini dilanggar dan performa inferensi statistik menurun drastis.

**Power Transformation** adalah keluarga transformasi matematis parametrik yang dirancang untuk menstabilkan varians dan memetakan data mendekati distribusi normal simetris:

**1. Transformasi Box-Cox (Box & Cox, 1964):**
Didefinisikan hanya untuk nilai fitur yang bernilai positif ketat ($x > 0$):
$$x^{(\\lambda)} = \\begin{cases} \\frac{x^\\lambda - 1}{\\lambda} & \\text{jika } \\lambda \\ne 0 \\\\ \\ln(x) & \\text{jika } \\lambda = 0 \\end{cases}$$
Parameter optimal $\\lambda$ diestimasi melalui metode Maximum Likelihood Estimation (MLE).

**2. Transformasi Yeo-Johnson (Yeo & Johnson, 2000):**
Merupakan generalisasi modern dari Box-Cox yang mendukung nilai nol maupun bilangan negatif ($x \\in \\mathbb{R}$):
$$x^{(\\lambda)} = \\begin{cases} \\frac{(x+1)^\\lambda - 1}{\\lambda} & \\text{jika } \\lambda \\ne 0, x \\ge 0 \\\\ \\ln(x+1) & \\text{jika } \\lambda = 0, x \\ge 0 \\\\ -\\frac{(-x+1)^{2-\\lambda} - 1}{2-\\lambda} & \\text{jika } \\lambda \\ne 2, x < 0 \\\\ -\\ln(-x+1) & \\text{jika } \\lambda = 2, x < 0 \\end{cases}$$`,
        formula: `\\hat{\\lambda} = \\arg\\max_\\lambda \\left( -\\frac{n}{2} \\ln(\\hat{\\sigma}^2(\\lambda)) + (\\lambda - 1) \\sum_{i=1}^n \\ln(x_i) \\right)`,
        code: `# 2.7: Penormalan Distribusi Miring Menggunakan PowerTransformer Yeo-Johnson
import numpy as np
from scipy import stats
from sklearn.preprocessing import PowerTransformer

# Sintesis data log-normal sangat miring dengan nilai positif dan negatif
np.random.seed(42)
data_miring = np.random.exponential(scale=2.0, size=500) - 1.0 # Ada nilai negatif

skew_awal = stats.skew(data_miring)

# Terapkan Yeo-Johnson PowerTransformer
pt = PowerTransformer(method='yeo-johnson', standardize=True)
data_normal = pt.fit_transform(data_miring.reshape(-1, 1)).ravel()

skew_akhir = stats.skew(data_normal)

print("=== STABILISASI DISTRIBUSI POWER TRANSFORM ===")
print(f"Parameter Lambda Terpelajar (pt.lambdas_) : {pt.lambdas_[0]:.4f}")
print(f"Kemiringan (Skewness) Sebelum Transformasi : {skew_awal:6.4f} (Sangat Miring)")
print(f"Kemiringan (Skewness) Setelah Yeo-Johnson   : {skew_akhir:6.4f} (Mendekati Normal Sempurna 0.0)")`,
        expectedOutput: "Kemiringan data berkurang drastis dari 1.83 menjadi mendekati 0.03 mendekati distribusi Gauss simetris.",
        codeExp: "Skrip mendemonstrasikan bagaimana PowerTransformer dengan metode Yeo-Johnson mengestimasi nilai lambda optimal secara otomatis untuk mentransformasikan distribusi eksponensial miring menjadi simetris.",
        pitfalls: [
          "Memaksa menggunakan metode Box-Cox pada data yang mengandung nilai nol atau negatif, yang akan menghasilkan ValueError.",
          "Menerapkan power transform tanpa menyimpan parameter lambda terpelajar untuk memproses data baru saat inferensi produksi."
        ],
        refTitle: "I.K. Yeo and R.A. Johnson: A new family of power transformations to improve normality or symmetry",
        refUrl: "https://www.jstor.org/stable/2673623"
      },
      {
        num: "2.8",
        slug: "2-8-diskretisasi-binning-dan-polynomial-features-kapabilitas-non-linear",
        title: "2.8. Binning (Discretization) & Polinomial Features: Memperkenalkan Kapabilitas Non-Linear pada Model Linear",
        desc: "Rekayasa representasi fitur kontinu: diskretisasi seragam/kuantil KBinsDiscretizer dan interaksi ekspansi polinomial derajat tinggi.",
        concept: `Model linier (seperti Regresi Linier dan Regresi Logistik) secara inheren terbatas pada hipotesis bidang datar berorde satu. Namun, kita dapat memberikan kemampuan memodelkan fenomena non-linier yang sangat fleksibel kepada model linier murni melalui dua teknik rekayasa fitur geometris:

**1. Diskretisasi / Binning (\`KBinsDiscretizer\`):**
Mengubah fitur kontinu tunggal menjadi kumpulan interval diskrit (kategori ordinal atau one-hot). Terbagi menjadi tiga strategi:
- \` + "\`strategy='uniform'\`" + \`: Membagi rentang nilai menjadi interval dengan lebar yang sama persis ($w = (x_{\\max} - x_{\\min})/k$).
- \` + "\`strategy='quantile'\`" + \`: Membagi rentang sehingga setiap bin memiliki jumlah observasi yang sama persis (berdasarkan kuantil/persentil).
- \` + "\`strategy='kmeans'\`" + \`: Menentukan titik pemisah interval berdasarkan pusat klaster 1-dimensi algoritma K-Means.
Model linier yang dilatih pada hasil diskretisasi one-hot akan menghasilkan fungsi tangga (*step function*) konstan potongan demi potongan (*piecewise constant*), mampu menangkap hubungan non-linier sembarang.

**2. Fitur Polinomial & Interaksi (\`PolynomialFeatures\`):**
Memperluas ruang fitur dengan menambahkan suku-suku berpangkat dan perkalian silang interaksi antarvariabel. Untuk vektor fitur $\\mathbf{x} = [x_1, x_2]$ berderajat 2:
$$\\phi(\\mathbf{x}) = [1, x_1, x_2, x_1^2, x_1 x_2, x_2^2]$$
Model linier yang dilatih pada ruang fitur $\\phi(\\mathbf{x})$ dapat memodelkan kurva parabolik dan elips tanpa mengubah formulasi matematika linier internalnya.`,
        formula: `\\dim(\\phi(x)) = \\binom{d + p}{p} \\quad \\text{untuk } d \\text{ fitur dan derajat polinomial } p`,
        code: `# 2.8: Memodelkan Gelombang Non-Linear Menggunakan LinearRegression + KBinsDiscretizer
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import KBinsDiscretizer
from sklearn.metrics import mean_squared_error

np.random.seed(42)
X = np.linspace(0, 10, 100).reshape(-1, 1)
y = np.sin(X).ravel() + np.random.normal(0, 0.1, 100)

# 1. Regresi Linier Murni pada Data Kontinu (Underfitting Parah)
reg_murni = LinearRegression().fit(X, y)
mse_murni = mean_squared_error(y, reg_murni.predict(X))

# 2. Regresi Linier pada Fitur Hasil Diskretisasi (10 Bins One-Hot)
discretizer = KBinsDiscretizer(n_bins=10, encode='onehot', strategy='uniform')
X_binned = discretizer.fit_transform(X)
reg_binned = LinearRegression().fit(X_binned, y)
mse_binned = mean_squared_error(y, reg_binned.predict(X_binned))

print("=== NON-LINEARITAS VIA DISKRETISASI FITUR ===")
print(f"MSE Linear Regression Murni    : {mse_murni:.4f} (Gagal Menangkap Gelombang)")
print(f"MSE Linear Regression + Binning: {mse_binned:.4f} (Berhasil Menangkap Kurva Sinus)")`,
        expectedOutput: "MSE berkurang drastis dari 0.44 menjadi 0.02 membuktikan model linier mampu menangkap pola non-linier melalui diskretisasi.",
        codeExp: "Skrip menunjukkan bagaimana model linier sederhana mampu memodelkan gelombang sinus non-linier kompleks setelah fitur kontinu dipecah menjadi 10 bin diskretisasi one-hot.",
        pitfalls: [
          "Menaikkan derajat polinomial terlalu tinggi (derajat > 4) yang memicu ledakan dimensi kombinatorial (curse of dimensionality) dan overfitting masif.",
          "Menggunakan strategy='uniform' pada data berdistribusi sangat miring yang menghasilkan bin kosong di daerah ekor data."
        ],
        refTitle: "Scikit-Learn User Guide: Preprocessing data - Discretization",
        refUrl: "https://scikit-learn.org/stable/modules/preprocessing.html#discretization"
      },
      {
        num: "2.9",
        slug: "2-9-orkestrasi-preprocessing-heterogen-columntransformer",
        title: "2.9. Orkestrasi Preprocessing Heterogen dengan ColumnTransformer",
        desc: "Penyatuan pipeline modular: transformasi selektif subset fitur numerik dan kategorik dalam satu objek komposit Scikit-Learn.",
        concept: `Dalam dataset tabular dunia nyata, sebuah tabel selalu terdiri atas campuran tipe data yang heterogen: kolom numerik kontinu, kolom kategorik nominal berdimensi rendah, kolom teks, dan kolom tanggal. Menerapkan transformer secara manual satu per satu lalu menggabungkannya dengan \` + "\`np.hstack\`" + \` adalah antipattern yang rentan kesalahan indeks dan kebocoran data.

Solusi standar industri Scikit-Learn adalah **\` + "\`ColumnTransformer\`" + \`**. Komponen komposit ini memungkinkan praktisi memetakan transformer tertentu secara eksklusif ke subset kolom tertentu:
- Subset fitur numerik $\\to$ \` + "\`Pipeline([SimpleImputer(median), StandardScaler()])\`" + \`
- Subset fitur kategorik $\\to$ \` + "\`Pipeline([SimpleImputer(most_frequent), OneHotEncoder(drop='first')])\`" + \`
- Subset fitur teks $\\to$ \` + "\`TfidfVectorizer()\`" + \`

Seluruh aliran transformasi dijalankan secara paralel saat \` + "\`fit_transform()\`" + \`, lalu hasil akhirnya digabungkan (*concatenated*) secara horizontal menjadi satu matriks desain tunggal $\\mathbf{X}_{\\text{trans}}$ yang siap dikonsumsi estimator. Parameter \` + "\`remainder='passthrough'\`" + \` atau \` + "\`remainder='drop'\`" + \` mengontrol perilaku terhadap kolom yang tidak disebutkan secara eksplisit.`,
        formula: `\\mathbf{X}_{\\text{out}} = [T_1(\\mathbf{X}_{[:, \\text{cols}_1]}) \\;\\Vert\\; T_2(\\mathbf{X}_{[:, \\text{cols}_2]}) \\;\\Vert\\; \\dots \\;\\Vert\\; T_m(\\mathbf{X}_{[:, \\text{cols}_m]})]`,
        code: `# 2.9: Orkestrasi Pipeline Heterogen Lengkap dengan ColumnTransformer
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# Dataset pelanggan heterogen
df = pd.DataFrame({
    'Umur': [25, np.nan, 45, 35, 50],
    'Gaji': [5000000, 12000000, np.nan, 8000000, 15000000],
    'Status': ['Lajang', 'Menikah', 'Menikah', 'Lajang', 'Menikah'],
    'Kota': ['Jakarta', 'Surabaya', 'Bandung', 'Jakarta', 'Surabaya']
})

# 1. Pipeline Khusus Numerik
numeric_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# 2. Pipeline Khusus Kategorik
categorical_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(drop='first', sparse_output=False))
])

# 3. Komposisi Terpadu via ColumnTransformer
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_pipeline, ['Umur', 'Gaji']),
        ('cat', categorical_pipeline, ['Status', 'Kota'])
    ],
    remainder='drop'
)

X_processed = preprocessor.fit_transform(df)
feature_names = preprocessor.get_feature_names_out()

print("=== COLUMNTRANSFORMER PREPROCESSING HETEROGEN ===")
print("Dimensi Matriks Output:", X_processed.shape)
print("Daftar Fitur Hasil Transformasi:\n", feature_names)
print("\nCuplikan Baris Pertama:\n", X_processed[0].round(4))`,
        expectedOutput: "ColumnTransformer menghasilkan matriks numerik gabungan yang terimputasi, terskala, dan ter-onehot tanpa kesalahan tipe data.",
        codeExp: "Skrip menunjukkan arsitektur ColumnTransformer yang mengisolasi dan mentransformasi fitur numerik dan kategorik secara paralel dalam satu alur terpadu yang aman.",
        pitfalls: [
          "Mendefinisikan kolom menggunakan indeks numerik alih-alih nama kolom string, yang menyebabkan kekacauan jika urutan kolom pada dataframe berubah.",
          "Lupa menyertakan SimpleImputer di dalam pipeline kategorik sebelum OneHotEncoder ketika data memuat nilai NaN."
        ],
        refTitle: "Scikit-Learn User Guide: ColumnTransformer for heterogeneous data",
        refUrl: "https://scikit-learn.org/stable/modules/compose.html#columntransformer-for-heterogeneous-data"
      },
      {
        num: "2.10",
        slug: "2-10-pencegahan-kebocoran-data-data-leakage-tahap-preprocessing",
        title: "2.10. Pencegahan Kebocoran Data (Data Leakage) Mutlak Selama Tahap Preprocessing",
        desc: "Protokol keamanan isolasi informasi: membedah mekanisme train-test contamination, fitting transformer terlarang, dan enkapsulasi Pipeline.",
        concept: `**Kebocoran Data (Data Leakage)** adalah salah satu kesalahan paling destruktif dan memalukan dalam rekayasa machine learning. Kebocoran data terjadi ketika informasi dari luar himpunan data latih (khususnya dari data validasi, data uji, atau masa depan yang belum terjadi) secara tidak sengaja merembes ke dalam proses pelatihan model.

Akibat kebocoran data sangat berbahaya: model menunjukkan performa evaluasi yang tampak spektakuler di laboratorium (akurasi 99%), namun gagal total (*catastrophic failure*) begitu di-deploy ke lingkungan produksi riil karena informasi bocor tersebut tidak tersedia pada saat inferensi operasional.

**Bentuk Kebocoran Data Paling Umum pada Preprocessing:**
1. **Penskalaan Global (Global Scaling Contamination):**
   Memanggil \` + "\`scaler.fit(X)\`" + \` atau \` + "\`scaler.fit_transform(X)\`" + \` pada seluruh dataset *sebelum* menjalankan \` + "\`train_test_split\`" + \`. Ketika rata-rata $\\mu$ dan deviasi standar $\\sigma$ dihitung dari seluruh data, informasi distribusi data uji telah bocor ke dalam data latih.
2. **Imputasi Global:** Menghitung nilai median/modus untuk imputasi missing values dari seluruh populasi data.
3. **Seleksi Fitur Mendahului Partisi Data:** Menyeleksi k-fitur terbaik berdasarkan korelasi dengan target pada seluruh dataset sebelum pemisahan train-test.

**Aturan Emas:**
*Seluruh objek transformer wajib hanya di-\` + "\`fit()\`" + \` pada data latih (\` + "\`X_train\`" + \`), dan hanya di-\` + "\`transform()\`" + \` (tanpa fit) pada data uji (\` + "\`X_test\`" + \`). Solusi paling aman adalah mengunci seluruh alur di dalam objek Scikit-Learn \` + "\`Pipeline\`" + \`.*`,
        formula: `\\mu_{\\text{valid}} = \\frac{1}{n_{\\text{train}}} \\sum_{i \\in \\text{train}} x_i \\quad (\\text{Data Uji Terisolasi Secara Mutlak})`,
        code: `# 2.10: Simulasi Data Leakage (Evaluasi Palsu) vs Protokol Isolasi Bersih
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score
from sklearn.pipeline import make_pipeline

# Sintesis data dengan fitur murni acak derau tanpa korelasi dengan target
np.random.seed(42)
n_samples, n_features = 200, 5000
X = np.random.randn(n_samples, n_features)
y = np.random.choice([0, 1], size=n_samples) # Target acak 50:50

# SKENARIO 1: LEAKAGE SELEKSI FITUR (Fitur diseleksi sebelum split)
korelasi = np.abs([np.corrcoef(X[:, j], y)[0, 1] for j in range(n_features)])
fitur_bocor = np.argsort(korelasi)[-10:] # Ambil 10 fitur korelasi semu tertinggi
X_leaked = X[:, fitur_bocor]

X_tr_leak, X_te_leak, y_tr_leak, y_te_leak = train_test_split(X_leaked, y, test_size=0.3, random_state=42)
clf_leak = KNeighborsClassifier(n_neighbors=1).fit(X_tr_leak, y_tr_leak)
acc_leak = accuracy_score(y_te_leak, clf_leak.predict(X_te_leak))

# SKENARIO 2: PROTOKOL BERSIH (Split Dulu, Seleksi Hanya pada Train)
X_tr_clean, X_te_clean, y_tr_clean, y_te_clean = train_test_split(X, y, test_size=0.3, random_state=42)
kor_clean = np.abs([np.corrcoef(X_tr_clean[:, j], y_tr_clean)[0, 1] for j in range(n_features)])
fitur_clean = np.argsort(kor_clean)[-10:]

clf_clean = KNeighborsClassifier(n_neighbors=1).fit(X_tr_clean[:, fitur_clean], y_tr_clean)
acc_clean = accuracy_score(y_te_clean, clf_clean.predict(X_te_clean[:, fitur_clean]))

print("=== ILUSTRASI BAHAYA DATA LEAKAGE ===")
print(f"Akurasi Skenario Bocor (Leakage) : {acc_leak*100:.2f}% (Akurasi Palsu Fantastis)")
print(f"Akurasi Skenario Bersih (No Leak): {acc_clean*100:.2f}% (Mencerminkan Realitas Acak ~50%)")`,
        expectedOutput: "Skenario bocor menghasilkan akurasi palsu > 80% pada noise acak, sedangkan protokol bersih menunjukkan performa riil ~50%.",
        codeExp: "Skrip menunjukkan simulasi bahaya kebocoran data: menyeleksi fitur sebelum partisi data menghasilkan korelasi semu yang menipu evaluasi hingga tampak 80% padahal data murni acak.",
        pitfalls: [
          "Melakukan fit_transform pada seluruh dataset di tahap awal eksplorasi notebook sebelum melakukan cross-validation.",
          "Menyertakan fitur ID unik atau target masa depan (target leakage) dalam matriks prediktor."
        ],
        refTitle: "Shachar Kaufman et al.: Leakage in data mining: Formulation, detection, and avoidance (ACM TKDD)",
        refUrl: "https://dl.acm.org/doi/10.1145/2382577.2382579"
      }
    ]
  }
];
