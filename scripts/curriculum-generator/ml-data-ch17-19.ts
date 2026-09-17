import { ChapterDef } from "./da-data-ch1-3";

export const ML_CHAPTERS_17_TO_19: ChapterDef[] = [
  // ==========================================
  // BAB 17: Pemilihan Model & Penyetelan Hiperparameter (Hyperparameter Tuning)
  // ==========================================
  {
    orderIndex: 17,
    id: "machine-learning-ch-17",
    slug: "bab-17-pemilihan-model-dan-penyetelan-hiperparameter",
    title: "BAB 17: Pemilihan Model & Penyetelan Hiperparameter",
    desc: "Strategi optimasi konfigurasi model pembelajaran mesin: ruang pencarian hiperparameter, K-Fold dan Stratified/Group/TimeSeries cross-validation, GridSearchCV vs RandomizedSearchCV Bergstra & Bengio, turnamen Successive Halving, Optimasi Bayesian via Gaussian Process dan Optuna TPE, Nested Cross-Validation pencegah bias seleksi, kurva diagnostik pembelajaran, serta penyetelan multi-metrik.",
    coreConcepts: ["Search Space Design", "Cross-Validation Schemes", "GridSearchCV vs RandomizedSearchCV", "Successive Halving", "Bayesian Optimization & Optuna", "Nested Cross-Validation", "Learning & Validation Curves", "Multi-Metric Scoring"],
    subchapters: [
      {
        num: "17.1",
        slug: "17-1-ruang-pencarian-hiperparameter-dan-bahaya-overfitting-cv",
        title: "17.1. Perancangan Ruang Pencarian Hiperparameter dan Bahaya Overfitting Validasi Silang",
        desc: "Diferensiasi parameter vs hiperparameter: perancangan ruang pencarian kontinu vs diskrit dan fenomena seleksi bias pada iterasi tuning berulang.",
        concept: `Dalam pembelajaran mesin, kita membedakan secara tegas antara **Parameter Model** dan **Hiperparameter**:
- **Parameter Model (Internal):** Bobot $\\mathbf{w}$ dan bias $b$ yang dipelajari secara otomatis oleh algoritma optimasi dari data latih (misalnya koefisien regresi atau bobot pemisah SVM).
- **Hiperparameter (Eksternal):** Konfigurasi struktural yang mengontrol kapasitas model, regularisasi, dan proses pelatihan itu sendiri (misalnya kedalaman maksimum pohon \` + "\`max_depth\`" + \`, penalti penalti $C$ pada SVM, atau laju pembelajaran \` + "\`learning_rate\`" + \`). Hiperparameter **tidak dapat dipelajari langsung** melalui minimisasi fungsi loss biasa karena model akan selalu memilih regularisasi nol untuk menghafal data latih.

**Bahaya Overfitting pada Validasi Silang (*Overfitting the Validation Set*):**
Ketika praktisi menguji ribuan kombinasi hiperparameter pada himpunan validasi yang sama secara berulang-ulang, model akhirnya akan menemukan kombinasi hiperparameter yang secara kebetulan berkinerja luar biasa pada variasi stokastik lipatan validasi tersebut, namun gagal total saat diterjunkan ke data uji masa depan. Fenomena ini disebut **Kebocoran Informasi Optimasi (*Information Leakage through Optimization*)** atau **Bias Seleksi Model**.`,
        formula: `\\boldsymbol{\\theta}^* = \\arg\\min_{\\boldsymbol{\\theta} \\in \\Theta} \\frac{1}{K} \\sum_{k=1}^K \\mathcal{L}\\left( f_{\\boldsymbol{\\theta}}^{(-k)}, \\mathcal{D}_{\\text{val}}^{(k)} \\right) \\quad (\\text{Fungsi Objektif Tuning})`,
        code: `# 17.1: Demonstrasi Risiko Overfitting Validasi pada Pencarian Ekstensif
import numpy as np
from sklearn.datasets import make_classification
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import cross_val_score, train_test_split

# Bangkitkan data sintetis murni acak tanpa sinyal riil
np.random.seed(42)
X = np.random.randn(200, 30)
y = np.random.choice([0, 1], size=200) # Label murni tebakan acak 50%

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Uji 100 kedalaman acak
best_score = 0
best_seed = 0
for seed in range(100):
    clf = DecisionTreeClassifier(random_state=seed, max_depth=10, min_samples_split=2)
    score = cross_val_score(clf, X_train, y_train, cv=5).mean()
    if score > best_score:
        best_score = score
        best_seed = seed

# Evaluasi model "terbaik" pada data uji independen
final_model = DecisionTreeClassifier(random_state=best_seed, max_depth=10, min_samples_split=2).fit(X_train, y_train)
test_acc = final_model.score(X_test, y_test)

print("=== BAHAYA OVERFITTING VALIDASI SILANG ===")
print(f"Skor CV Tertinggi yang Ditemukan: {best_score*100:.2f}% (Semu / Kebetulan Statistik)")
print(f"Akurasi Data Uji Sebenarnya     : {test_acc*100:.2f}% (Kembali ke Tebakan Acak ~50%)")`,
        expectedOutput: "Validasi silang menghasilkan skor semu tinggi (~62%), namun akurasi uji independen jatuh kembali ke ~50%.",
        codeExp: "Skrip membuktikan bagaimana pencarian hiperparameter berulang pada data acak dapat menghasilkan skor validasi tinggi palsu akibat bias seleksi.",
        pitfalls: [
          "Menggunakan data uji (test set) sebagai acuan untuk memilih hiperparameter terbaik (test set wajib dikunci rapat hingga evaluasi final).",
          "Menjelajahi ruang hiperparameter pada skala linier untuk parameter yang memiliki variasi eksponensial (seperti C dan gamma pada SVM; gunakan skala logaritmik np.logspace)."
        ],
        refTitle: "Cawley, G. C., & Talbot, N. L.: On over-fitting in model selection and subsequent selection bias in performance evaluation (JMLR, 2010)",
        refUrl: "https://www.jmlr.org/papers/v11/cawley10a.html"
      },
      {
        num: "17.2",
        slug: "17-2-skema-validasi-silang-stratified-group-timeseries",
        title: "17.2. Skema Validasi Silang Lanjut: Stratified K-Fold, Group K-Fold, dan TimeSeriesSplit",
        desc: "Kesesuaian topologi data: perumusan pemisahan terstratifikasi untuk ketidakseimbangan kelas, pengelompokan non-IID (Group), dan rolling-window berurutan waktu.",
        concept: `Validasi Silang K-Fold standar mengasumsikan bahwa seluruh observasi data bersifat **IID (Independently and Identically Distributed)**. Ketika asumsi ini dilanggar oleh struktur data dunia nyata, skema K-Fold standar menghasilkan estimasi yang sangat bias dan menyesatkan.

**Tiga Skema Validasi Silang Spesialisasi:**
1. **Stratified K-Fold:**
   Menjamin bahwa proporsi distribusi kelas target ($y$) pada setiap lipatan (*fold*) identik persis dengan proporsi pada populasi dataset penuh. **Wajib digunakan** untuk semua masalah klasifikasi, terutama jika terdapat ketidakseimbangan kelas (*class imbalance*).
2. **Group K-Fold:**
   Digunakan ketika data memuat kelompok observasi dependen yang berasal dari subjek yang sama (misalnya beberapa rekaman medis dari pasien yang sama atau beberapa foto wajah dari orang yang sama). Group K-Fold menjamin bahwa **seluruh sampel dari satu grup/pasien hanya muncul di fold latih ATAU di fold validasi, tidak pernah terpecah di kedua tempat sekaligus**. Ini mencegah model "menghafal wajah pasien" alih-alih mempelajari penyakit.
3. **TimeSeriesSplit (Rolling / Expanding Window):**
   Pada data runtun waktu atau transaksi finansial berurutan, sampel masa depan dilarang digunakan untuk melatih sampel masa lalu (*Temporal Leakage*). TimeSeriesSplit membatasi lipatan validasi selalu berada di masa depan terhadap lipatan latihan: $\\text{Train } [1..t] \\to \\text{Val } [t+1..t+k]$.`,
        formula: `\\text{Fold } k: \\mathcal{D}_{\\text{train}} = \\{x_i \\mid t_i \\le T_k\\}, \\quad \\mathcal{D}_{\\text{val}} = \\{x_i \\mid T_k < t_i \\le T_{k+1}\\} \\quad (\\text{TimeSeriesSplit})`,
        code: `# 17.2: Demonstrasi GroupKFold Mencegah Kebocoran Identitas Pasien Medis
import numpy as np
from sklearn.model_selection import KFold, GroupKFold
from sklearn.ensemble import RandomForestClassifier

# 12 sampel dari 3 pasien berbeda (Pasien A, B, C masing-masing 4 sampel)
groups = np.array([1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3])
X = np.random.randn(12, 5)
y = np.array([0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1])

# Uji GroupKFold (3 Folds)
gkf = GroupKFold(n_splits=3)
print("=== VERIFIKASI ALOKASI GROUP K-FOLD ===")
for fold, (train_idx, val_idx) in enumerate(gkf.split(X, y, groups=groups)):
    val_groups = np.unique(groups[val_idx])
    train_groups = np.unique(groups[train_idx])
    print(f"Fold {fold+1}: Pasien Validasi = {val_groups} | Pasien Latihan = {train_groups} (Saling Lepas Bebas Kebocoran!)")`,
        expectedOutput: "Setiap fold validasi memuat pasien yang sepenuhnya berbeda dari fold latihan.",
        codeExp: "Skrip mendemonstrasikan pembagian GroupKFold untuk memastikan tidak ada kelompok pasien yang tumpang tindih antara data latih dan validasi.",
        pitfalls: [
          "Menggunakan KFold acak biasa pada data runtun waktu saham yang menyebabkan lookahead bias fatal.",
          "Lupa menyertakan argumen groups pada gkf.split() yang menyebabkan pembagian kembali menjadi indeks sekuensial biasa."
        ],
        refTitle: "Scikit-Learn User Guide: Cross-validation: evaluating estimator performance",
        refUrl: "https://scikit-learn.org/stable/modules/cross_validation.html"
      },
      {
        num: "17.3",
        slug: "17-3-gridsearchcv-pencarian-kisi-komprehensif",
        title: "17.3. GridSearchCV: Pencarian Kisi Komprehensif dan Kompleksitas Komputasi Eksponensial",
        desc: "Metodologi exhaustive search: eksplorasi perkalian kartesian seluruh kombinasi hiperparameter dan batas kutukan dimensi tuning.",
        concept: `**GridSearchCV** adalah metode penyetelan hiperparameter paling klasik dan deterministik. Pengguna mendefinisikan sebuah kisi diskrit (*discrete grid*) dari nilai-nilai calon untuk setiap hiperparameter, dan algoritma mengevaluasi **setiap kombinasi perkalian Kartesian yang mungkin** menggunakan validasi silang K-Fold.

**Analisis Kompleksitas Komputasi Eksponensial:**
Jika kita memiliki $M$ buah hiperparameter, dan setiap hiperparameter memiliki $V$ calon nilai pengujian, maka jumlah total model yang harus dilatih adalah:
$$N_{\\text{fit}} = K \\times \\prod_{m=1}^M V_m = K \\times V^M$$
di mana $K$ adalah jumlah lipatan cross-validation.

Kompleksitas ini bertumbuh secara **eksponensial** terhadap jumlah hiperparameter yang diteliti ($V^M$). Sebagai contoh:
- Menguji 4 parameter dengan masing-masing 5 nilai kandidat pada 5-Fold CV memerlukan $5 \\times 5^4 = 3.125$ proses pelatihan model.
- Jika satu model membutuhkan waktu 2 detik untuk fit, total waktu tuning adalah 1,7 jam. Menambah 2 parameter baru akan melipatgandakan waktu menjadi 43 jam!

Oleh karena itu, GridSearchCV hanya realistis untuk ruang pencarian berdimensi sangat kecil ($M \\le 3$) dengan nilai kandidat yang terbatas.`,
        formula: `N_{\\text{evaluasi}} = K \\cdot \\prod_{m=1}^M |\\mathcal{V}_m| \\implies \\mathcal{O}(K \\cdot V^M) \\quad (\\text{Ledakan Kombinatorial})`,
        code: `# 17.3: Implementasi GridSearchCV dengan Ekstraksi cv_results_ Komprehensif
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV

iris = load_iris()
X, y = iris.data, iris.target

param_grid = {
    'C': [0.1, 1, 10],
    'gamma': [0.01, 0.1, 1.0],
    'kernel': ['rbf', 'linear']
}

grid_search = GridSearchCV(SVC(), param_grid, cv=5, scoring='accuracy', n_jobs=-1)
grid_search.fit(X, y)

results_df = pd.DataFrame(grid_search.cv_results_)[['param_C', 'param_gamma', 'param_kernel', 'mean_test_score', 'rank_test_score']]
results_df = results_df.sort_values('rank_test_score')

print("=== HASIL PENELUSURAN KISI GRIDSEARCHCV ===")
print(f"Konfigurasi Terbaik: {grid_search.best_params_}")
print(f"Skor Validasi Terbaik: {grid_search.best_score_*100:.2f}%\n")
print("Top 3 Konfigurasi Teratas:\n", results_df.head(3).to_string(index=False))`,
        expectedOutput: "GridSearchCV menemukan kombinasi C dan gamma optimal dengan akurasi CV mencapai 98%.",
        codeExp: "Skrip menjalankan GridSearchCV pada 18 kombinasi parameter SVC menggunakan 5-fold CV paralel dan menampilkan rangkuman cv_results_.",
        pitfalls: [
          "Menyetel n_jobs=-1 pada mesin dengan RAM terbatas saat melatih model ensemble besar yang memicu kehabisan memori.",
          "Menyertakan nilai parameter yang terlalu rapat di sekitar satu titik alih-alih mencakup berbagai orde magnitudo."
        ],
        refTitle: "Scikit-Learn Official User Guide: Tuning the hyper-parameters of an estimator",
        refUrl: "https://scikit-learn.org/stable/modules/grid_search.html"
      },
      {
        num: "17.4",
        slug: "17-4-randomizedsearchcv-bergstra-bengio-2012",
        title: "17.4. RandomizedSearchCV: Bukti Efisiensi Eksplorasi Stokastik Bergstra & Bengio (2012)",
        desc: "Teorema terobosan James Bergstra & Yoshua Bengio: pembuktian matematis bahwa pencarian acak lebih efisien mengeksplorasi dimensi efektif ruang hiperparameter.",
        concept: `James Bergstra dan Yoshua Bengio (JMLR 2012) dalam paper seminal mereka *"Random Search for Hyper-Parameter Optimization"* membuktikan secara teoretis dan empiris bahwa **Pencarian Acak (Randomized Search) jauh lebih efisien dan unggul dibandingkan Pencarian Kisi (Grid Search)** untuk optimasi model pembelajaran mesin.

**Teorema Dimensi Efektif (*Effective Dimensionality*):**
Dalam sebagian besar algoritma pembelajaran mesin, tidak semua hiperparameter memiliki pengaruh yang setara terhadap performa. Biasanya hanya terdapat 1 atau 2 hiperparameter yang **sangat penting (*important dimension*)**, sementara hiperparameter lainnya hanya memiliki pengaruh marjinal (*unimportant dimension*).

**Mengapa Grid Search Sangat Boros?**
- Jika kita menguji kisi $3 \\times 3$ pada 2 parameter: Grid Search hanya mengevaluasi **3 nilai berbeda** untuk parameter penting (karena 9 uji coba tersebut mengulang 3 nilai yang sama pada koordinat kisi yang sejajar).
- **Randomized Search:** Jika dialokasikan 9 evaluasi acak independen, Randomized Search akan mengevaluasi **9 nilai yang sepenuhnya berbeda dan unik** pada dimensi penting tersebut!

**Jaminan Probabilistik (Batas Chernoff):**
Untuk probabilitas $95\\%$ menemukan wilayah $5\\%$ teratas dari konfigurasi terbaik di ruang parameter mana pun, kita hanya membutuhkan:
$$n = \\frac{\\ln(1 - 0.95)}{\\ln(1 - 0.05)} \\approx 59 \\text{ iterasi}$$
**Jumlah iterasi ini sepenuhnya independen dari dimensi jumlah parameter yang diteliti!**`,
        formula: `P(\\text{Menemukan 5% Terbaik dalam } n \\text{ Uji Coba}) = 1 - (1 - 0.05)^n \\ge 0.95 \\implies n \\ge 59`,
        code: `# 17.4: Implementasi RandomizedSearchCV dengan Distribusi Kontinu Scipy
import numpy as np
from scipy.stats import loguniform, randint
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import RandomizedSearchCV
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
X, y = data.data, data.target

# Definisikan distribusi probabilitas kontinu dan diskrit
param_distributions = {
    'n_estimators': randint(30, 200),
    'max_depth': randint(3, 15),
    'min_samples_split': randint(2, 10),
    'max_features': ['sqrt', 'log2', None]
}

# Jalankan tepat 60 iterasi acak (menurut teorema Bergstra-Bengio)
random_search = RandomizedSearchCV(
    RandomForestClassifier(random_state=42),
    param_distributions=param_distributions,
    n_iter=60,
    cv=5,
    scoring='roc_auc',
    random_state=42,
    n_jobs=-1
)
random_search.fit(X, y)

print("=== RANDOMIZEDSEARCHCV BERBASIS TEOREMA BERGSTRA-BENGIO ===")
print(f"Jumlah Evaluasi Terjadwal: 60 iterasi (Bebas Kutukan Dimensi)")
print(f"ROC-AUC Skor Terbaik     : {random_search.best_score_:.4f}")
print(f"Parameter Optimal        : {random_search.best_params_}")`,
        expectedOutput: "RandomizedSearchCV menemukan konfigurasi optimal mendekati ROC-AUC ~0.99 hanya dalam 60 iterasi acak.",
        codeExp: "Skrip memanfaatkan RandomizedSearchCV dengan distribusi probabilitas scipy.stats untuk mengeksplorasi ruang parameter secara efisien.",
        pitfalls: [
          "Memberikan list diskrit biasa ke RandomizedSearchCV alih-alih objek distribusi kontinu scipy.stats yang membatasi resolusi pencarian.",
          "Lupa menyetel random_state pada RandomizedSearchCV yang membuat hasil eksperimen tidak dapat direproduksi."
        ],
        refTitle: "James Bergstra & Yoshua Bengio: Random Search for Hyper-Parameter Optimization (JMLR, 2012)",
        refUrl: "https://www.jmlr.org/papers/v13/bergstra12a.html"
      },
      {
        num: "17.5",
        slug: "17-5-successive-halving-dan-turnamen-sumber-daya",
        title: "17.5. Successive Halving: Akselerasi Turnamen Sumber Daya Terbatas",
        desc: "Prinsip alokasi dinamis Jamieson & Nowak (2016): eliminasi konfigurasi buruk pada sampel data kecil dan alokasi sumber daya penuh ke kandidat juara.",
        concept: `Kelemahan terbesar GridSearchCV dan RandomizedSearchCV adalah membuang waktu komputasi yang masif untuk melatih konfigurasi hiperparameter yang jelas-jelas buruk hingga selesai pada seluruh dataset penuh.

Kevin Jamieson dan Robert Nowak (AISTATS 2016) merumuskan algoritma **Successive Halving**:
Successive Halving mengadopsi prinsip turnamen bertingkat:
1. Mulai dengan sekumpulan besar kandidat konfigurasi hiperparameter (misal 81 kandidat).
2. Latih seluruh kandidat pada **subset data latihan yang sangat kecil** (misal $10\\%$ data).
3. Evaluasi performa validasi, urutkan seluruh kandidat, dan **eliminasi mayoritas kandidat berkinerja buruk** berdasarkan faktor pemangkasan $\\eta$ (biasanya $\\eta = 3$, hanya sepertiga kandidat terbaik yang lolos).
4. Gandakan sumber daya data latih untuk kandidat yang lolos (menjadi $30\\%$ data) dan latih kembali.
5. Ulangi proses turnamen bertingkat ini hingga tersisa 1 konfigurasi juara yang dilatih pada $100\\%$ data penuh.

Di Scikit-Learn, metode ini diimplementasikan dalam \` + "\`HalvingGridSearchCV\`" + \` dan \` + "\`HalvingRandomSearchCV\`" + \`. Kecepatan komputasinya **10 hingga 50 kali lebih cepat** daripada GridSearch biasa dengan kualitas hasil yang hampir identik.`,
        formula: `r_{i+1} = \\eta \\cdot r_i, \\quad n_{i+1} = \\lfloor n_i / \\eta \\rfloor \\quad (\\text{Aturan Turnamen Successive Halving})`,
        code: `# 17.5: Akselerasi Tuning Menggunakan HalvingRandomSearchCV Scikit-Learn
import time
from sklearn.experimental import enable_halving_search_cv # noqa
from sklearn.model_selection import HalvingRandomSearchCV, RandomizedSearchCV
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=5000, n_features=20, random_state=42)

param_dist = {
    'learning_rate': [0.01, 0.05, 0.1, 0.2],
    'max_leaf_nodes': [15, 31, 63, 127],
    'min_samples_leaf': [10, 20, 50]
}

# 1. Halving Random Search
t0 = time.time()
halving_search = HalvingRandomSearchCV(
    HistGradientBoostingClassifier(random_state=42),
    param_distributions=param_dist,
    resource='n_samples',
    factor=3,
    random_state=42
).fit(X, y)
t_halving = time.time() - t0

print("=== SUCCESIVE HALVING SEARCH COMPARISON ===")
print(f"Waktu HalvingRandomSearch : {t_halving:.4f} detik")
print(f"Skor Validasi Juara       : {halving_search.best_score_*100:.2f}%")
print(f"Jumlah Iterasi / Rencana Turnamen:\n{halving_search.n_resources_}")`,
        expectedOutput: "Halving search mengeksekusi turnamen sumber daya bertahap dengan waktu komputasi sub-detik.",
        codeExp: "Skrip mendemonstrasikan efisiensi turnamen bertingkat HalvingRandomSearchCV dalam mengeliminasi kandidat buruk sejak alokasi sampel kecil.",
        pitfalls: [
          "Lupa mengimpor enable_halving_search_cv terlebih dahulu karena fitur ini masih berada di modul eksperimental Scikit-Learn.",
          "Menyetel min_resources terlalu kecil sehingga model tidak mampu mempelajari pola bermakna pada babak awal turnamen."
        ],
        refTitle: "K. Jamieson & R. Nowak: Non-stochastic Best Arm Identification and Hyperparameter Optimization (AISTATS, 2016)",
        refUrl: "https://proceedings.mlr.press/v51/jamieson16.html"
      },
      {
        num: "17.6",
        slug: "17-6-optimasi-bayesian-gaussian-process-expected-improvement",
        title: "17.6. Optimasi Bayesian: Model Pengganti Gaussian Process dan Expected Improvement",
        desc: "Pendekatan berbasis model probabilitas sequential (SMBO): memanfaatkan riwayat evaluasi untuk memprediksi fungsi objektif dan menyeimbangkan eksplorasi vs eksploitasi.",
        concept: `Kelemahan mendasar dari Grid Search dan Random Search adalah keduanya bersifat **memori-kurang (*memoryless*)**: setiap kali mencoba kombinasi baru, algoritma tidak pernah memanfaatkan informasi dari hasil pengujian sebelumnya untuk memandu pencarian berikutnya ke wilayah yang lebih menjanjikan.

Jasper Snoek, Hugo Larochelle, dan Ryan P. Adams (NeurIPS 2012) mempopulerkan **Optimasi Bayesian (Bayesian Optimization)** untuk tuning pembelajaran mesin menggunakan pendekatan **Sequential Model-Based Optimization (SMBO)**:

**Dua Komponen Kunci Optimasi Bayesian:**
1. **Model Pengganti Probabilistik (*Surrogate Model*):**
   Karena mengevaluasi model pembelajaran mesin asli sangat mahal (memakan waktu menit hingga jam), kita melatih model regresi murah yang memperkirakan fungsi objektif $f(\\boldsymbol{\\theta})$ beserta **ketidakpastiannya (varians $\\sigma^2(\\boldsymbol{\\theta})$)**. Model pengganti standar adalah **Gaussian Process (GP)**:
   $$f(\\boldsymbol{\\theta}) \\sim \\mathcal{GP}\\left( \\mu(\\boldsymbol{\\theta}), k(\\boldsymbol{\\theta}, \\boldsymbol{\\theta}') \\right)$$
2. **Fungsi Akuisisi (*Acquisition Function*):**
   Fungsi matematis murah yang dioptimalkan untuk memutuskan titik hiperparameter mana $\\boldsymbol{\\theta}_{\\text{next}}$ yang harus diuji berikutnya pada model asli. Fungsi paling populer adalah **Expected Improvement (EI)**:
   $$\\text{EI}(\\boldsymbol{\\theta}) = \\mathbb{E}\\left[ \\max(0, f(\\boldsymbol{\\theta}) - f^*) \\right]$$
   di mana $f^*$ adalah skor terbaik yang pernah dicapai sejauh ini.

Fungsi akuisisi secara elegan menyeimbangkan:
- **Eksploitasi (*Exploitation*):** Mencari di dekat wilayah dengan estimasi rata-rata tinggi $\\mu(\\boldsymbol{\\theta})$.
- **Eksplorasi (*Exploration*):** Mencari di wilayah yang belum pernah dikunjungi dengan ketidakpastian tinggi $\\sigma(\\boldsymbol{\\theta})$.`,
        formula: `\\boldsymbol{\\theta}_{t+1} = \\arg\\max_{\\boldsymbol{\\theta}} \\text{EI}(\\boldsymbol{\\theta}) = (\\mu(\\boldsymbol{\\theta}) - f^*) \\Phi(Z) + \\sigma(\\boldsymbol{\\theta}) \\phi(Z) \\quad (\\text{Akuisisi EI})`,
        code: `# 17.6: Optimasi Bayesian Sederhana Menggunakan Scikit-Optimize (gp_minimize analog)
import numpy as np

# Simulasi fungsi objektif black-box mahal (dengan 1 minimum global di x=3.5)
def black_box_objective(x):
    return (x - 3.5)**2 + np.sin(5 * x) + np.random.normal(0, 0.05)

# Riwayat evaluasi (Sequential sampling)
tested_x = [1.0, 5.0, 2.0]
tested_y = [black_box_objective(x) for x in tested_x]

print("=== SIMULASI PRINSIP OPTIMASI BAYESIAN (SMBO) ===")
for step in range(3):
    best_idx = np.argmin(tested_y)
    current_best_x = tested_x[best_idx]
    current_best_y = tested_y[best_idx]
    
    # Pilih kandidat berikutnya di sekitar titik terbaik (eksploitasi + perturbasi acak)
    next_x = current_best_x + np.random.uniform(-0.5, 0.5)
    next_y = black_box_objective(next_x)
    
    tested_x.append(next_x)
    tested_y.append(next_y)
    print(f"Langkah {step+1}: Titik Diuji x={next_x:.3f} -> Skor Loss={next_y:.4f} | Terbaik Sejauh Ini: {min(tested_y):.4f}")`,
        expectedOutput: "Optimasi Bayesian mengarahkan pengujian berurutan ke wilayah minimum fungsi secara cerdas.",
        codeExp: "Skrip mensimulasikan mekanisme sequential model-based optimization di mana riwayat evaluasi memandu pencarian titik berikutnya.",
        pitfalls: [
          "Gaussian Process memiliki kompleksitas komputasi O(t^3) terhadap jumlah iterasi t, sehingga menjadi lambat jika evaluasi melebihi 500 langkah.",
          "Mengevaluasi Optimasi Bayesian pada ruang parameter diskrit kategorikal murni tanpa penanganan kernel jarak yang sesuai."
        ],
        refTitle: "Jasper Snoek, Hugo Larochelle, Ryan P. Adams: Practical Bayesian Optimization of Machine Learning Algorithms (NeurIPS 2012)",
        refUrl: "https://papers.nips.cc/paper/2012/hash/0537fb40a68c18da59a35c2bfe1ca554-Abstract.html"
      },
      {
        num: "17.7",
        slug: "17-7-optimasi-optuna-tpe-dan-pruning-algoritma",
        title: "17.7. Framework Optimasi Hiperparameter Modern: Optuna dan Tree-structured Parzen Estimator (TPE)",
        desc: "Arsitektur Takuya Akiba et al. (KDD 2019): algoritma TPE Bergstra et al., mekanisme define-by-run API, dan pemangkasan uji coba dini (automated pruning).",
        concept: `Dalam ekosistem kecerdasan buatan modern, pustaka **Optuna** (Takuya Akiba et al., KDD 2019) telah menjadi standar industri nomor satu untuk penyetelan hiperparameter, menggantikan pustaka generasi lama.

**Keunggulan Revolusioner Optuna:**
1. **Define-by-Run Dynamic Search Space:**
   Pengguna mendefinisikan ruang pencarian langsung di dalam fungsi objektif Python menggunakan percabangan kondisional biasa (\`if-else\` logis), memungkinkan penyetelan arsitektur yang sangat kompleks dan dinamis.
2. **Tree-structured Parzen Estimator (TPE / Bergstra et al. 2011):**
   Alih-alih memodelkan $p(y \\mid \\mathbf{x})$ menggunakan Gaussian Process yang lambat, TPE membagi riwayat evaluasi menjadi dua kelompok berdasarkan persentil ambang batas $\\gamma$:
   - Kelompok Bagus: $\\ell(\\mathbf{x}) = p(\\mathbf{x} \\mid y < y^*)$
   - Kelompok Buruk: $g(\\mathbf{x}) = p(\\mathbf{x} \\mid y \\ge y^*)$
   TPE memaksimalkan rasio $\\frac{\\ell(\\mathbf{x})}{g(\\mathbf{x})}$, yang secara matematis ekuivalen dengan memaksimalkan Expected Improvement namun dengan kecepatan komputasi linier $\\mathcal{O}(n)$.
3. **Automated Trial Pruning (Asynchronous Successive Halving / Median Pruner):**
   Optuna secara otomatis menghentikan (*prunes*) proses pelatihan yang sedang berjalan di tengah iterasi jika kurva pembelajaran epoch awal terdeteksi berada di bawah rata-rata median uji coba sebelumnya.`,
        formula: `\\arg\\max_\\mathbf{x} \\text{EI}(\\mathbf{x}) \\iff \\arg\\max_\\mathbf{x} \\frac{\\ell(\\mathbf{x})}{g(\\mathbf{x})} \\quad (\\text{Prinsip Dualitas Densitas TPE})`,
        code: `# 17.7: Optimasi Hiperparameter Model Menggunakan Framework Terstruktur Konsep Optuna
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import cross_val_score

data = load_breast_cancer()
X, y = data.data, data.target

# Simulasi loop TPE Optuna sederhana
def objective_trial(lr, max_depth, n_est):
    clf = GradientBoostingClassifier(learning_rate=lr, max_depth=max_depth, n_estimators=n_est, random_state=42)
    score = cross_val_score(clf, X, y, cv=3, scoring='roc_auc').mean()
    return score

# Riwayat trial adaptif
best_auc = 0
best_config = None

trials = [
    (0.01, 3, 50),
    (0.1, 3, 100),
    (0.2, 5, 80),
    (0.05, 4, 120)
]

print("=== PENALAAN HIPERPARAMETER MODEL DENGAN POLA TPE ===")
for i, (lr, md, ne) in enumerate(trials):
    auc = objective_trial(lr, md, ne)
    if auc > best_auc:
        best_auc = auc
        best_config = {'lr': lr, 'max_depth': md, 'n_estimators': ne}
    print(f"Trial {i+1}: lr={lr}, depth={md}, n_est={ne} -> ROC-AUC: {auc:.4f}")

print(f"\nKonfigurasi Terbaik Terpilih: {best_config} dengan Skor AUC: {best_auc:.4f}")`,
        expectedOutput: "Eksperimen trial terstruktur berhasil menemukan konfigurasi boosting optimal dengan ROC-AUC > 0.99.",
        codeExp: "Skrip mensimulasikan alur fungsi objektif modular trial evaluasi parameter Gradient Boosting dengan metrik ROC-AUC.",
        pitfalls: [
          "Menggunakan Optuna tanpa mengaktifkan pruner pada pelatihan iteratif epoch panjang, membuang potensi akselerasi waktu hingga 80%.",
          "Membiarkan database storage Optuna berjalan di SQLite file tunggal saat melakukan parallel worker ratusan GPU (gunakan PostgreSQL)."
        ],
        refTitle: "Takuya Akiba et al.: Optuna: A Next-generation Hyperparameter Optimization Framework (ACM KDD, 2019)",
        refUrl: "https://dl.acm.org/doi/10.1145/3292500.3330701"
      },
      {
        num: "17.8",
        slug: "17-8-nested-cross-validation-estimasi-generalisasi-bebas-bias",
        title: "17.8. Nested Cross-Validation (Double CV): Estimasi Performa Generalisasi Tanpa Bias Optimasi",
        desc: "Prosedur validasi bersarang Stone & Varma (2006): pemisahan ketat lingkaran dalam (Inner Loop untuk tuning) dan lingkaran luar (Outer Loop untuk evaluasi performa).",
        concept: `Ketika kita menjalankan GridSearchCV atau RandomizedSearchCV pada dataset $\\mathcal{D}$ dan melaporkan atribut \` + "\`best_score_\`" + \` sebagai estimasi performa generalisasi model, **estimasi tersebut terbukti secara ilmiah bersifat terlalu optimis (*optimistically biased*)**. Nilai \` + "\`best_score_\`" + \` mencerminkan nilai maksimum dari banyak percobaan statistik pada lipatan validasi yang sama.

Sudhir Varma dan Richard Simon (BMC Bioinformatics, 2006) membuktikan bahwa untuk mengukur performa generalisasi model yang telah dituning secara **benar-benar bebas bias**, kita wajib menerapkan **Nested Cross-Validation (Validasi Silang Bersarang / Double CV)**.

**Arsitektur Dua Lingkaran (*Two Loops*):**
1. **Outer Loop (Lingkaran Luar - Evaluasi Performa):**
   Dataset dibagi menjadi $K_{\\text{outer}}$ lipatan (misalnya 5-Fold). Satu lipatan disisihkan murni sebagai **Outer Test Set**, dan $K_{\\text{outer}} - 1$ lipatan digunakan sebagai **Outer Training Set**.
2. **Inner Loop (Lingkaran Dalam - Penyetelan Hiperparameter):**
   Pada setiap Outer Training Set, kita menjalankan GridSearchCV atau RandomizedSearchCV menggunakan validasi silang internal $K_{\\text{inner}}$ lipatan (misalnya 3-Fold) untuk menemukan kombinasi hiperparameter terbaik $\\boldsymbol{\\theta}^*$.
3. **Evaluasi:**
   Model terbaik yang ditemukan oleh Inner Loop dilatih pada seluruh Outer Training Set, kemudian diuji pada **Outer Test Set yang sama sekali tidak pernah terlibat dalam proses pencarian hiperparameter**.

Rata-rata skor dari ke-$K_{\\text{outer}}$ pengujian luar adalah estimasi performa generalisasi yang **100% bebas bias optimasi**!`,
        formula: `\\text{Generalization Error} = \\frac{1}{K_O} \\sum_{k=1}^{K_O} \\mathcal{L}\\left( f_{\\boldsymbol{\\theta}^*_k}^{(-k)}, \\mathcal{D}_{\\text{test}}^{(k)} \\right) \\quad (\\text{Estimasi Bebas Bias})`,
        code: `# 17.8: Implementasi Nested Cross-Validation Menggunakan Scikit-Learn
from sklearn.datasets import load_iris
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV, cross_val_score, KFold

iris = load_iris()
X, y = iris.data, iris.target

# Konfigurasi parameter grid
param_grid = {'C': [0.1, 1, 10, 100], 'gamma': [0.01, 0.1, 1.0]}

# 1. Inner Loop CV (3-Fold) untuk Penyetelan Hiperparameter
inner_cv = KFold(n_splits=3, shuffle=True, random_state=42)
grid_search = GridSearchCV(SVC(), param_grid, cv=inner_cv)

# 2. Outer Loop CV (5-Fold) untuk Evaluasi Performa Generalisasi
outer_cv = KFold(n_splits=5, shuffle=True, random_state=42)
nested_scores = cross_val_score(grid_search, X, y, cv=outer_cv)

# Bandingkan dengan non-nested CV (Optimistic Bias)
grid_search.fit(X, y)
non_nested_score = grid_search.best_score_

print("=== ANALISIS PERBANDINGAN NESTED VS NON-NESTED CV ===")
print(f"Non-Nested CV Score (best_score_) : {non_nested_score*100:.2f}% (Cenderung Bias Optimis)")
print(f"Nested CV Rata-rata (Outer Scores): {nested_scores.mean()*100:.2f}% (Estimasi Realistis Bebas Bias)")
print(f"Deviasi Standar Skor Outer Loop   : {nested_scores.std()*100:.2f}%")`,
        expectedOutput: "Nested CV menghasilkan skor generalisasi realistis dengan estimasi deviasi standar antar fold.",
        codeExp: "Skrip membungkus GridSearchCV ke dalam fungsi cross_val_score untuk mengeksekusi arsitektur validasi silang bersarang (Nested CV).",
        pitfalls: [
          "Mencoba mengambil 'satu set parameter terbaik tunggal' dari Nested CV (Nested CV menghasilkan K_outer konfigurasi model yang berbeda; tujuannya adalah mengevaluasi prosedur pembelajaran, bukan menghasilkan 1 bobot).",
          "Kompleksitas waktu komputasi yang berlipat ganda K_outer x K_inner kali."
        ],
        refTitle: "Sudhir Varma & Richard Simon: Bias in error estimation when using cross-validation for model selection (BMC Bioinformatics, 2006)",
        refUrl: "https://bmcbioinformatics.biomedcentral.com/articles/10.1186/1471-2105-7-91"
      },
      {
        num: "17.9",
        slug: "17-9-learning-curves-dan-validation-curves-diagnostik",
        title: "17.9. Learning Curves & Validation Curves: Mendiagnosis Bias vs Varians",
        desc: "Instrumen diagnostik Andrew Ng: analisis grafis konvergensi performa terhadap ukuran sampel data dan respons model terhadap spektrum hiperparameter.",
        concept: `Ketika model pembelajaran mesin menghasilkan performa yang mengecewakan pada data pengujian, praktisi sering kali bingung menentukan langkah perbaikan: apakah menambah data latihan, menambah fitur baru, mengurangi regularisasi, atau mengganti model?

Dua grafik diagnostik fundamental Scikit-Learn menyediakan panduan ilmiah:

**1. Kurva Pembelajaran (*Learning Curves*):**
Memplot skor performa latih (*training score*) dan skor validasi (*validation score*) terhadap **peningkatan ukuran sampel data latih ($n$)**:
- **Gejala Underfitting (High Bias):** Skor latih dan skor validasi keduanya bernilai rendah, dan kurva keduanya bertemu (*converge*) sangat cepat pada nilai yang buruk. Menambah data latih baru **tidak akan membantu sama sekali**! Solusi: Tingkatkan kapasitas model atau tambah fitur baru.
- **Gejala Overfitting (High Variance):** Skor latih sangat tinggi (mendekati 100%), namun skor validasi tertinggal jauh di bawah dengan celah (*gap*) yang lebar. **Menambah lebih banyak data latih sangat efektif** untuk menutup celah dan menurunkan varians!

**2. Kurva Validasi (*Validation Curves*):**
Memplot skor latih dan validasi terhadap **rentang nilai tunggal dari sebuah hiperparameter** (misalnya parameter regularisasi $\\gamma$ pada SVM):
- Memperlihatkan secara visual titik batas transisi yang tepat di mana model beralih dari zona Underfitting menuju zona Optimal, sebelum akhirnya masuk ke zona Overfitting.`,
        formula: `\\text{Gap Bias-Varians} = \\left| \\text{Score}_{\\text{train}}(n) - \\text{Score}_{\\text{val}}(n) \\right| \\quad (\\text{Diagnostik Celah Model})`,
        code: `# 17.9: Pembuatan Data Diagnostik Learning Curves Menggunakan Scikit-Learn
import numpy as np
from sklearn.datasets import load_digits
from sklearn.svm import SVC
from sklearn.model_selection import learning_curve

digits = load_digits()
X, y = digits.data, digits.target

train_sizes, train_scores, val_scores = learning_curve(
    SVC(kernel='rbf', gamma=0.001),
    X, y,
    train_sizes=np.linspace(0.1, 1.0, 5),
    cv=5,
    scoring='accuracy',
    n_jobs=-1
)

mean_train = np.mean(train_scores, axis=1)
mean_val = np.mean(val_scores, axis=1)

print("=== HASIL DIAGNOSTIK LEARNING CURVES (SVC) ===")
print("Ukuran Data Latih | Skor Latih | Skor Validasi | Celah (Gap)")
print("-" * 55)
for size, tr, val in zip(train_sizes, mean_train, mean_val):
    print(f"{size:17d} | {tr*100:9.2f}% | {val*100:12.2f}% | {(tr - val)*100:9.2f}%")`,
        expectedOutput: "Seiring bertambahnya data latih, skor validasi meningkat tajam mendekati skor latih (menutup gap varians).",
        codeExp: "Skrip menghitung metrik learning_curve untuk menganalisis konvergensi skor latih dan validasi terhadap peningkatan volume sampel.",
        pitfalls: [
          "Menghitung learning curve tanpa melakukan pengacakan (shuffle) pada data latih yang terurut labelnya.",
          "Mendiagnosis model hanya dari skor latih tanpa membandingkannya secara simultan dengan skor validasi."
        ],
        refTitle: "Scikit-Learn Guide: Plotting Learning Curves and Checking Models' Scalability",
        refUrl: "https://scikit-learn.org/stable/auto_examples/model_selection/plot_learning_curve.html"
      },
      {
        num: "17.10",
        slug: "17-10-penyetelan-multi-metrik-dan-strategi-refit",
        title: "17.10. Penyetelan Hiperparameter Multi-Metrik dan Strategi Refit Produksi",
        desc: "Konfigurasi pencarian multi-objektif Scikit-Learn: pemantauan simultan Precision, Recall, ROC-AUC, dan penentuan kriteria model terbaik final.",
        concept: `Dalam sistem industri nyata, keputusan memilih model terbaik hampir tidak pernah didasarkan pada satu metrik tunggal. Misalnya pada sistem deteksi penipuan: kita ingin memaksimalkan ROC-AUC, namun dengan syarat nilai Recall tidak boleh berada di bawah $85\\%$ dan waktu inferensi tetap rendah.

Scikit-Learn menyediakan dukungan komprehensif untuk **Penyetelan Multi-Metrik (*Multi-Metric Tuning*)**:
Melalui parameter \` + "\`scoring\`" + \` yang diisi dengan dictionary metrik, GridSearchCV dan RandomizedSearchCV akan menghitung seluruh metrik secara simultan di setiap iterasi tanpa perlu melatih ulang model!

**Parameter \`refit\` Berbasis Fungsi Kustom:**
Ketika beberapa metrik dipantau secara bersamaan, algoritma membutuhkan aturan tegas untuk menentukan model mana yang akan dilatih ulang pada seluruh dataset penuh di akhir proses (\`refit=True\`):
1. Menggunakan nama string metrik utama: misal \`refit='roc_auc'\`.
2. Menggunakan **fungsi callback Python kustom**: fungsi yang menerima dictionary \`cv_results_\` dan mengembalikan indeks baris model terpilih berdasarkan kombinasi trade-off bisnis multi-kriteria (misalnya memilih model dengan presisi tertinggi di antara model-model yang memiliki recall $\\ge 0.80$).`,
        formula: `\\text{Model}^* = \\arg\\max_{m} \\text{Precision}(m) \\quad \\text{s.t.} \\quad \\text{Recall}(m) \\ge 0.85 \\quad (\\text{Refit Terikat})`,
        code: `# 17.10: GridSearchCV Multi-Metrik dengan Strategi Callback Refit Kustom
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV

X, y = make_classification(n_samples=1000, n_features=20, weights=[0.85, 0.15], random_state=42)

scoring = {
    'accuracy': 'accuracy',
    'precision': 'precision',
    'recall': 'recall',
    'roc_auc': 'roc_auc'
}

# Strategi refit kustom: Pilih model dengan Precision tertinggi yang memiliki Recall >= 0.70
def custom_refit_strategy(cv_results):
    precisions = cv_results['mean_test_precision']
    recalls = cv_results['mean_test_recall']
    
    # Filter indeks dengan recall >= 0.70
    valid_indices = np.where(recalls >= 0.70)[0]
    if len(valid_indices) == 0:
        return np.argmax(recalls) # Fallback ke recall tertinggi
    best_idx = valid_indices[np.argmax(precisions[valid_indices])]
    return best_idx

param_grid = {'C': [0.01, 0.1, 1, 10], 'penalty': ['l2']}
grid = GridSearchCV(
    LogisticRegression(max_iter=1000),
    param_grid,
    scoring=scoring,
    refit=custom_refit_strategy,
    cv=5
).fit(X, y)

print("=== GRIDSEARCH MULTI-METRIK DENGAN STRATEGI REFIT KUSTOM ===")
print(f"Indeks Model Terbaik Terpilih: {grid.best_index_}")
print(f"Parameter Terpilih           : {grid.best_params_}")
print(f"Hasil Evaluasi Model Pemenang:")
print(f"- ROC-AUC   : {grid.cv_results_['mean_test_roc_auc'][grid.best_index_]:.4f}")
print(f"- Recall    : {grid.cv_results_['mean_test_recall'][grid.best_index_]:.4f} (Memenuhi syarat >= 0.70)")
print(f"- Precision : {grid.cv_results_['mean_test_precision'][grid.best_index_]:.4f}")`,
        expectedOutput: "GridSearchCV multi-metrik sukses memilih konfigurasi yang memenuhi batasan recall dan memaksimalkan presisi.",
        codeExp: "Skrip mengonfigurasi multi-metric scoring pada GridSearchCV dan mengimplementasikan fungsi refit kustom berbasis aturan bisnis.",
        pitfalls: [
          "Lupa menentukan parameter refit saat menggunakan multi-metric scoring (akan menyebabkan GridSearchCV tidak menyimpan estimator akhir yang dilatih ulang).",
          "Menyertakan metrik komputasi lambat yang tidak relevan yang memperlambat waktu evaluasi validasi."
        ],
        refTitle: "Scikit-Learn User Guide: Composite estimators and multimetric scoring",
        refUrl: "https://scikit-learn.org/stable/modules/model_evaluation.html#multimetric-scoring"
      }
    ]
  },

  // ==========================================
  // BAB 18: Metrik Evaluasi Model Lanjut
  // ==========================================
  {
    orderIndex: 18,
    id: "machine-learning-ch-18",
    slug: "bab-18-metrik-evaluasi-model-lanjut",
    title: "BAB 18: Metrik Evaluasi Model Lanjut",
    desc: "Kompilasi komprehensif tolok ukur performa model prediktif: dekomposisi matriks konfusi multikelas (Macro, Micro, Weighted), kurva ROC-AUC, Precision-Recall Curve dan Average Precision, Log-Loss/Cross-Entropy probabilistik, Cohen's Kappa dan Matthew's Correlation Coefficient (MCC), metrik perangkingan (Top-k, MRR, NDCG), metrik regresi tangguh (Huber, MASE, R2 terkoreksi), evaluasi sensitif biaya, uji signifikansi statistik McNemar/Wilcoxon, dan pemantauan degradasi performa.",
    coreConcepts: ["Multiclass Confusion Matrix", "ROC-AUC & PR-Curve", "Log-Loss & Cross-Entropy", "Cohen's Kappa & MCC", "Top-k Accuracy & NDCG", "Robust Regression Metrics", "Cost-Sensitive Evaluation", "Statistical Significance (McNemar & Wilcoxon)"],
    subchapters: [
      {
        num: "18.1",
        slug: "18-1-dekomposisi-matriks-konfusi-multikelas-macro-micro",
        title: "18.1. Dekomposisi Matriks Konfusi Multikelas: Macro, Micro, dan Weighted Averaging",
        desc: "Analisis agregasi metrik klasifikasi multi-kategori: perbedaan matematis penimbangan per-sampel (Micro) vs per-kelas seragam (Macro) vs proporsi populasi (Weighted).",
        concept: `Pada klasifikasi multikelas dengan $K$ kategori ($K > 2$), matriks konfusi berbentuk tabel kontinjensi berukuran $K \\times K$. Untuk mengubah performa matriks ini menjadi metrik ringkas tunggal (seperti Precision, Recall, atau F1-Score), kita harus menerapkan strategi perata-rataan (*averaging strategies*):

**Tiga Strategi Agregasi Utama:**
1. **Macro Averaging (\`average='macro'\`):**
   Menghitung metrik secara independen untuk setiap kelas $k$, lalu menghitung **rata-rata aritmatika sederhana** tanpa mempedulikan jumlah sampel masing-masing kelas:
   $$\\text{F1}_{\\text{macro}} = \\frac{1}{K} \\sum_{k=1}^K \\text{F1}_k$$
   *Karakteristik:* Memperlakukan setiap kelas secara **setara**. Sangat sensitif terhadap kegagalan pada kelas minoritas; jika model gagal pada kelas kecil, skor Macro akan anjlok drastis.
2. **Micro Averaging (\`average='micro'\`):**
   Mengakumulasikan total True Positives ($TP$), False Positives ($FP$), dan False Negatives ($FN$) dari seluruh kelas secara global terlebih dahulu, lalu menghitung metrik:
   $$\\text{Precision}_{\\text{micro}} = \\text{Recall}_{\\text{micro}} = \\text{F1}_{\\text{micro}} = \\frac{\\sum_k TP_k}{\\sum_k TP_k + \\sum_k FP_k} = \\text{Akurasi Global}$$
   *Karakteristik:* Didominasi sepenuhnya oleh performa pada kelas mayoritas yang memiliki volume sampel terbesar.
3. **Weighted Averaging (\`average='weighted'\`):**
   Merata-ratakan metrik per kelas dengan bobot proporsional terhadap frekuensi sampel aktual (*support*) masing-masing kelas:
   $$\\text{F1}_{\\text{weighted}} = \\sum_{k=1}^K \\frac{n_k}{n} \\text{F1}_k$$`,
        formula: `\\text{Macro} = \\frac{1}{K}\\sum_{k=1}^K M_k, \\quad \\text{Weighted} = \\sum_{k=1}^K \\frac{n_k}{n} M_k, \\quad \\text{Micro} = \\frac{\\sum TP_k}{\\sum (TP_k + FP_k)}`,
        code: `# 18.1: Komparasi Macro vs Micro vs Weighted F1-Score pada Data Multikelas Timpang
import numpy as np
from sklearn.metrics import f1_score, classification_report

# Dataset 3 kelas timpang: Kelas 0 (80 sampel), Kelas 1 (15 sampel), Kelas 2 (5 sampel)
y_true = np.array([0]*80 + [1]*15 + [2]*5)
# Model memprediksi kelas mayoritas dengan baik, tapi gagal total di kelas minoritas (kelas 2)
y_pred = np.array([0]*75 + [1]*5 + [0]*15 + [0]*5)

f1_macro = f1_score(y_true, y_pred, average='macro')
f1_micro = f1_score(y_true, y_pred, average='micro')
f1_weighted = f1_score(y_true, y_pred, average='weighted')

print("=== DEKOMPOSISI METRIK AGREGASI MULTIKELAS ===")
print(f"F1-Score Micro    : {f1_micro*100:.2f}% (Menipu! Terlihat Sangat Tinggi)")
print(f"F1-Score Weighted : {f1_weighted*100:.2f}% (Tinggi karena didominasi kelas 0)")
print(f"F1-Score Macro    : {f1_macro*100:.2f}% (Hancur! Menangkap kegagalan di kelas 2)")
print("\nKesimpulan: Gunakan Macro-F1 untuk memastikan kelas minoritas tetap diperhatikan!")`,
        expectedOutput: "Micro F1 bernilai 75%, sedangkan Macro F1 anjlok ke 33% akibat kegagalan total di kelas minoritas.",
        codeExp: "Skrip membandingkan ketiga metode perata-rataan F1-score pada data multikelas tidak seimbang untuk mendemonstrasikan sifat sensitivitas Macro averaging.",
        pitfalls: [
          "Hanya melaporkan Weighted F1 pada masalah klasifikasi tidak seimbang yang menutupi fakta bahwa kelas minoritas memiliki akurasi nol.",
          "Membingungkan Micro F1 dengan akurasi biasa (keduanya identik secara matematis pada klasifikasi multikelas eksklusif)."
        ],
        refTitle: "Sokolova, M., & Lapalme, G.: A systematic analysis of performance measures for classification tasks (Information Processing & Management, 2009)",
        refUrl: "https://www.sciencedirect.com/science/article/pii/S0306457309000259"
      },
      {
        num: "18.2",
        slug: "18-2-kurva-karakteristik-operasi-penerima-roc-dan-auc",
        title: "18.2. Kurva Karakteristik Operasi Penerima (ROC Curve) dan Area Under Curve (ROC-AUC)",
        desc: "Teori deteksi sinyal radar Perang Dunia II: visualisasi True Positive Rate vs False Positive Rate di seluruh spektrum ambang batas keputusan dan interpretasi probabilistik AUC.",
        concept: `**Kurva ROC (Receiver Operating Characteristic)** awalnya dikembangkan pada Perang Dunia II untuk mengevaluasi kemampuan operator radar mendeteksi sinyal pesawat musuh di tengah derau transmisi acak.

Dalam machine learning, kurva ROC memetakan performa pengklasifikasi biner pada **seluruh kemungkinan ambang batas keputusan $\\tau \\in [0, 1]$**:
- **Sumbu Vertikal ($y$):** **True Positive Rate (TPR / Sensitivity / Recall)**:
  $$\\text{TPR} = \\frac{TP}{TP + FN} = P(\\hat{Y}=1 \\mid Y=1)$$
- **Sumbu Horizontal ($x$):** **False Positive Rate (FPR / Fall-out / $1 - \\text{Specificity}$)**:
  $$\\text{FPR} = \\frac{FP}{FP + TN} = P(\\hat{Y}=1 \\mid Y=0)$$

**Interpretasi Probabilistik AUC (Area Under the ROC Curve):**
Nilai AUC tepat sama dengan **probabilitas bahwa model akan memberikan skor probabilitas yang lebih tinggi kepada sampel positif yang dipilih secara acak dibandingkan sampel negatif yang dipilih secara acak**:
$$\\text{AUC} = P\\left( f(\\mathbf{x}^+) > f(\\mathbf{x}^-) \\right)$$
- $\\text{AUC} = 1.0$: Pengklasifikasi sempurna (mampu memisahkan seluruh positif dan negatif).
- $\\text{AUC} = 0.5$: Pengklasifikasi setara tebakan acak (garis diagonal diagonal identitas).
- $\\text{AUC} < 0.5$: Model terbalik (memprediksi kelas berlawanan).

**Sifat Invarian:**
Kurva ROC bersifat **invarian terhadap perubahan proporsi kelas (*class distribution invariant*)** karena TPR dan FPR dihitung pada kolom populasi positif dan negatif secara independen.`,
        formula: `\\text{AUC} = \\int_0^1 \\text{TPR}(\\text{FPR}) \\, d\\text{FPR} = P(f(\\mathbf{x}^+) > f(\\mathbf{x}^-)) \\quad (\\text{Interpretasi Probabilistik})`,
        code: `# 18.2: Perhitungan Kurva ROC dan Skor ROC-AUC Menggunakan Scikit-Learn
import numpy as np
from sklearn.metrics import roc_curve, roc_auc_score
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=1000, n_features=20, weights=[0.7, 0.3], random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

clf = LogisticRegression().fit(X_train, y_train)
y_probs = clf.predict_proba(X_test)[:, 1]

# Hitung kurva ROC
fpr, tpr, thresholds = roc_curve(y_test, y_probs)
auc_val = roc_auc_score(y_test, y_probs)

print("=== EVALUASI KURVA ROC DAN METRIK ROC-AUC ===")
print(f"Nilai ROC-AUC Skor: {auc_val:.4f} (Kapasitas Pemisahan Sangat Baik)")
print(f"Jumlah Ambang Batas Teruji: {len(thresholds)}")
print(f"Contoh Titik Ambang tau={thresholds[10]:.3f} -> FPR={fpr[10]:.3f}, TPR={tpr[10]:.3f}")`,
        expectedOutput: "ROC-AUC terhitung presisi (~0.85-0.90) dengan representasi kurva sensitivitas trade-off.",
        codeExp: "Skrip mengekstrak koordinat FPR, TPR, dan ambang batas thresholds dari roc_curve serta menghitung metrik roc_auc_score.",
        pitfalls: [
          "Memasukkan label prediksi diskrit (0 atau 1) ke dalam roc_auc_score alih-alih skor probabilitas kontinu predict_proba()[:, 1].",
          "Mengandalkan ROC-AUC pada dataset dengan ketidakseimbangan kelas ekstrem (misal 99.9% negatif), di mana lonjakan besar False Positives tidak tercermin secara proporsional pada FPR yang kecil."
        ],
        refTitle: "Tom Fawcett: An introduction to ROC analysis (Pattern Recognition Letters, 2006)",
        refUrl: "https://www.sciencedirect.com/science/article/pii/S016786550500303X"
      },
      {
        num: "18.3",
        slug: "18-3-kurva-presisi-recall-pr-curve-dan-average-precision",
        title: "18.3. Kurva Presisi-Recall (PR-Curve) dan Average Precision: Superioritas pada Ketidakseimbangan Ekstrem",
        desc: "Kajian Saito & Rehmsmeier (PLOS ONE 2015): mengapa PR-Curve jauh lebih informatif daripada ROC-AUC pada deteksi penyakit langka dan kecurangan finansial.",
        concept: `Meskipun ROC-AUC sangat populer, Takaya Saito dan Markus Rehmsmeier (PLOS ONE, 2015) membuktikan bahwa pada dataset dengan **ketidakseimbangan kelas ekstrem** (misalnya 1 kasus fraud di antara 10.000 transaksi normal), **kurva ROC memberikan ilusi performa yang terlalu optimis dan menyesatkan**.

**Mengapa ROC Menyesatkan pada Kasus Langka?**
Penyebut dari False Positive Rate adalah total True Negatives ($TN + FP$). Jika $TN = 1.000.000$ dan terjadi $1.000$ kasus salah vonis ($FP = 1.000$), maka $\\text{FPR} = \\frac{1000}{1001000} \\approx 0.00099$ (kurang dari $0.1\\%$, terlihat sangat kecil pada kurva ROC). Namun bagi nasabah, 1000 orang yang diblokir salah adalah bencana operasional!

**Solusi: Kurva Presisi-Recall (PR-Curve):**
Kurva PR memplot **Precision** terhadap **Recall**:
- **Presisi (Precision):** $\\frac{TP}{TP + FP}$ (fokus langsung pada kebenaran prediksi positif tanpa melibatkan $TN$).
- **Recall:** $\\frac{TP}{TP + FN}$.

Jika terjadi $1000$ kasus $FP$, penyebut Presisi langsung meledak dan nilai Presisi anjlok drastis, memperingatkan kita secara jujur akan buruknya model.

**Average Precision (AP) / PR-AUC:**
Rata-rata tertimbang presisi yang dicapai pada setiap ambang batas, yang mengukur area di bawah kurva PR:
$$\\text{AP} = \\sum_n (R_n - R_{n-1}) P_n$$
Pada tebakan acak, garis dasar (baseline) kurva PR **bukan 0.5**, melainkan tepat sama dengan **proporsi kelas positif asli dalam data** ($P / (P + N)$).`,
        formula: `\\text{AP} = \\sum_n (R_n - R_{n-1}) P_n \\quad \\text{dengan Baseline } = \\frac{P}{P + N} \\ll 0.5 \\quad (\\text{Sensitif terhadap Imbalance})`,
        code: `# 18.3: Demonstrasi Superioritas PR-Curve vs ROC-AUC pada Data Sangat Timpang (1% Positif)
import numpy as np
from sklearn.metrics import roc_auc_score, average_precision_score, precision_recall_curve
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Bangkitkan data 99% negatif dan 1% positif
X, y = make_classification(n_samples=5000, n_features=15, weights=[0.99, 0.01], random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

rf = RandomForestClassifier(random_state=42).fit(X_train, y_train)
y_probs = rf.predict_proba(X_test)[:, 1]

roc_auc = roc_auc_score(y_test, y_probs)
avg_precision = average_precision_score(y_test, y_probs)
baseline_pr = np.mean(y_test)

print("=== PERBANDINGAN ROC-AUC VS PR-AUC PADA KASUS LANGKA (1%) ===")
print(f"Proporsi Kelas Positif Riil : {baseline_pr*100:.2f}% (Baseline PR Acak)")
print(f"Skor ROC-AUC                : {roc_auc:.4f} (Terlihat Sangat Tinggi / Menipu)")
print(f"Skor Average Precision (PR) : {avg_precision:.4f} (Refleksi Kualitas Nyata)")`,
        expectedOutput: "ROC-AUC mencapai skor tinggi (~0.93), namun Average Precision menunjukkan evaluasi realistis (~0.60).",
        codeExp: "Skrip mengomparasikan metrik ROC-AUC dan Average Precision pada dataset dengan 1% sampel minoritas untuk memperlihatkan kontras diagnostik.",
        pitfalls: [
          "Mengira baseline acak PR-Curve adalah 0.5 seperti ROC-AUC (baseline PR-AUC sama dengan rasio prevalensi positif P/N).",
          "Menggunakan integrasi trapesium sederhana (np.trapz) pada kurva PR yang melebih-lebihkan estimasi area; gunakan average_precision_score."
        ],
        refTitle: "Takaya Saito & Markus Rehmsmeier: The Precision-Recall Plot Is More Informative than the ROC Plot When Evaluating Binary Classifiers on Imbalanced Datasets (PLOS ONE, 2015)",
        refUrl: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0118432"
      },
      {
        num: "18.4",
        slug: "18-4-log-loss-cross-entropy-evaluasi-probabilistik",
        title: "18.4. Kerugian Logaritmik (Log-Loss / Cross-Entropy): Evaluasi Probabilistik Penalti Ketidakpastian",
        desc: "Formulasi teori informasi: hukuman eksponensial terhadap prediksi yang salah namun terlalu percaya diri (confident misclassification).",
        concept: `Metrik berbasis klasifikasi diskrit (seperti akurasi atau F1-score) hanya mengevaluasi apakah prediksi berada di sisi batas keputusan yang benar setelah ambang batas dipotong. Metrik tersebut buta terhadap **tingkat keyakinan probabilitas model**.

**Log-Loss (Cross-Entropy Loss):**
Metrik evaluasi formal yang menghukum model secara langsung berdasarkan probabilitas kontinu yang dialokasikannya kepada label target kebenaran riil:
$$\\text{Log-Loss} = -\\frac{1}{n} \\sum_{i=1}^n \\sum_{k=1}^K y_{ik} \\ln(\\hat{p}_{ik})$$
di mana $y_{ik} \\in \\{0, 1\\}$ adalah label aktual biner dan $\\hat{p}_{ik}$ adalah probabilitas prediksi model bahwa sampel $i$ berasal dari kelas $k$.

**Hukuman Asimtotik Tak Terhingga:**
Fungsi logaritma $-\\ln(p)$ memiliki sifat matematis yang sangat keras:
- Jika model memprediksi probabilitas $\\hat{p} = 0.99$ untuk sampel yang benar berlabel $1$: penalti kerugian sangat kecil ($-\\ln(0.99) \\approx 0.01$).
- Jika model memprediksi $\\hat{p} = 0.01$ untuk sampel yang sebenarnya berlabel $1$ (sangat yakin tapi salah total!): penalti kerugian meledak ($-\\ln(0.01) \\approx 4.60$).
- Jika $\\hat{p} \\to 0$ untuk label benar $1$, penalti **menuju tak terhingga ($+\\infty$)**!

Sifat ini memaksa model di kompetisi data (seperti Kaggle) untuk menghindari sifat *overconfident* dan menghasilkan probabilitas yang terkalibrasi secara sangat hati-hati.`,
        formula: `\\text{Loss}_{\\text{binary}} = -\\frac{1}{n} \\sum_{i=1}^n \\left[ y_i \\ln \\hat{p}_i + (1 - y_i) \\ln(1 - \\hat{p}_i) \\right]`,
        code: `# 18.4: Menghitung Log-Loss dan Analisis Penalti Asimtotik pada Prediksi Overconfident
import numpy as np
from sklearn.metrics import log_loss

y_true = [1, 1, 0, 0]

# Model A: Prediksi terkalibrasi moderat
p_model_a = [0.85, 0.80, 0.15, 0.20]

# Model B: Prediksi terlalu yakin ekstrem tapi membuat 1 kesalahan fatal
p_model_b = [0.99, 0.99, 0.01, 0.99] # Sampel terakhir salah total dengan keyakinan 99%!

loss_a = log_loss(y_true, p_model_a)
loss_b = log_loss(y_true, p_model_b)

print("=== EVALUASI PENALTI KERUGIAN LOG-LOSS ===")
print(f"Log-Loss Model A (Konsisten Moderat) : {loss_a:.4f}")
print(f"Log-Loss Model B (1 Kesalahan Fatal) : {loss_b:.4f} (Hancur oleh Penalti -ln(0.01)!)")`,
        expectedOutput: "Model B mencatat log-loss sangat buruk (> 1.15) akibat 1 prediksi overconfident yang salah.",
        codeExp: "Skrip menghitung log_loss Scikit-Learn dan memperlihatkan bagaimana satu kesalahan dengan keyakinan tinggi merusak nilai loss secara masif.",
        pitfalls: [
          "Melewatkan probabilitas yang memuat angka tepat 0.0 atau 1.0 ke formula murni tanpa clipping (akan memicu galat runtime pembagian nol atau log(0)). Scikit-learn secara otomatis melakukan clipping eps=1e-15.",
          "Membandingkan log-loss antar dataset yang memiliki prevalensi kelas yang berbeda."
        ],
        refTitle: "C. M. Bishop: Pattern Recognition and Machine Learning (Cross-Entropy Error Function)",
        refUrl: "https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/"
      },
      {
        num: "18.5",
        slug: "18-5-cohens-kappa-dan-matthews-correlation-coefficient-mcc",
        title: "18.5. Cohen's Kappa & Matthew's Correlation Coefficient (MCC): Metrik Seimbang Berbasis Seluruh Kuadran",
        desc: "Koreksi kebetulan acak statistik: formalisasi Cohen's Kappa terhadap kesepakatan antar-penilai dan keunggulan matematis koefisien korelasi Phi Matthews.",
        concept: `Ketika mengevaluasi klasifikasi biner dengan ketidakseimbangan kelas, metrik F1-score sering kali dikritik karena mengabaikan kuadran True Negatives ($TN$). Dua metrik statistik yang memanfaatkan seluruh empat kuadran matriks konfusi ($TP, TN, FP, FN$) secara simetris adalah:

**1. Cohen's Kappa (Jacob Cohen, 1960):**
Mengukur tingkat kesepakatan antara label prediksi model dan label aktual, dikoreksi terhadap kemungkinan kesepakatan yang terjadi murni karena **faktor kebetulan acak (*agreement by chance*)**:
$$\\kappa = \\frac{p_o - p_e}{1 - p_e}$$
di mana $p_o$ adalah akurasi terobservasi, dan $p_e$ adalah probabilitas ekspektasi kesepakatan jika kedua penilai menebak secara independen sesuai frekuensi marjinal kelas.

**2. Matthew's Correlation Coefficient (MCC / Brian Matthews, 1975):**
Dianggap oleh para ahli biostatistika dan data science sebagai **metrik evaluasi tunggal paling objektif dan informatif untuk klasifikasi biner**:
$$\\text{MCC} = \\frac{TP \\times TN - FP \\times FN}{\\sqrt{(TP + FP)(TP + FN)(TN + FP)(TN + FN)}}$$
MCC adalah koefisien korelasi Pearson diskrit antara dua variabel biner (koefisien Phi):
- Rentang $[-1, +1]$.
- $+1$: Prediksi sempurna.
- $0$: Setara tebakan acak.
- $-1$: Prediksi berlawanan total.
- **Kunci Keunggulan:** Nilai MCC hanya akan tinggi jika dan hanya jika model berkinerja sangat baik di **seluruh empat kuadran konfusi secara seimbang**!`,
        formula: `\\text{MCC} = \\frac{TP \\cdot TN - FP \\cdot FN}{\\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}} \\in [-1, +1]`,
        code: `# 18.5: Perhitungan Komparatif Cohen's Kappa dan Matthew's Correlation Coefficient (MCC)
from sklearn.metrics import cohen_kappa_score, matthews_corrcoef, confusion_matrix

# Kasus klasifikasi tidak seimbang: Model bias menebak mayoritas
y_true = [1]*10 + [0]*90
y_pred = [1]*2  + [0]*8 + [0]*90 # Model menebak kelas 0 pada 98 dari 100 sampel

cm = confusion_matrix(y_true, y_pred)
kappa = cohen_kappa_score(y_true, y_pred)
mcc = matthews_corrcoef(y_true, y_pred)
acc = (cm[0,0] + cm[1,1]) / len(y_true)

print("=== EVALUASI KELENGKAPAN EMPAT KUADRAN (KAPPA & MCC) ===")
print("Matriks Konfusi:\n", cm)
print(f"Akurasi Standar : {acc*100:.1f}% (Menipu! 92% Akurat)")
print(f"Cohen's Kappa   : {kappa:.4f} (Mencerminkan performa buruk)")
print(f"Nilai MCC       : {mcc:.4f} (Koreksi Keras terhadap Bias Mayoritas)")`,
        expectedOutput: "Akurasi standar 92% terkoreksi secara jujur oleh nilai MCC ~0.35 dan Kappa ~0.28.",
        codeExp: "Skrip menghitung cohen_kappa_score dan matthews_corrcoef untuk mengevaluasi model yang mengalami bias kelas mayoritas.",
        pitfalls: [
          "Menggunakan akurasi konvensional saat membandingkan model pada data medis langka; gunakan MCC sebagai kriteria eliminasi utama.",
          "Penyebut MCC dapat bernilai nol jika satu kolom atau satu baris matriks konfusi bernilai tepat nol (Scikit-Learn mengembalikan MCC=0.0 pada kasus ini)."
        ],
        refTitle: "Davide Chicco & Giuseppe Jurman: The advantages of the Matthews correlation coefficient (MCC) over F1 score and accuracy in binary classification evaluation (BMC Genomics, 2020)",
        refUrl: "https://bmcgenomics.biomedcentral.com/articles/10.1186/s12864-019-6413-7"
      },
      {
        num: "18.6",
        slug: "18-6-metrik-perangkingan-top-k-mrr-ndcg",
        title: "18.6. Metrik Perangkingan dan Sistem Rekomendasi: Top-k Accuracy, MRR, dan NDCG",
        desc: "Evaluasi sistem temu balik dan pemeringkatan informasi: formulasi Top-k Accuracy, Mean Reciprocal Rank (MRR), dan Normalized Discounted Cumulative Gain (NDCG).",
        concept: `Dalam banyak aplikasi modern (seperti pencarian e-commerce, sistem rekomendasi film, atau prediksi kata berikutnya pada model bahasa), sistem tidak diminta memberikan 1 jawaban tunggal mutlak, melainkan **daftar berperingkat (*ranked list*) dari $k$ kandidat teratas**.

Tiga metrik evaluasi pemeringkatan standar industri:
1. **Top-k Accuracy (\`top_k_accuracy_score\`):**
   Klasifikasi dianggap berhasil jika label kebenaran target berada di dalam **$k$ kelas teratas** dengan probabilitas prediksi terbesar yang dihasilkan model. Sangat relevan pada klasifikasi dengan ribuan kelas (seperti ImageNet-1k Top-5 Error).
2. **Mean Reciprocal Rank (MRR):**
   Menghitung kebalikan dari peringkat (*rank*) di mana item relevan pertama kali ditemukan:
   $$\\text{MRR} = \\frac{1}{Q} \\sum_{i=1}^Q \\frac{1}{\\text{rank}_i}$$
   Jika item yang dicari berada di peringkat 1, skor bernilai $1.0$; jika di peringkat 2, skor $0.5$; jika di peringkat 5, skor $0.2$.
3. **Normalized Discounted Cumulative Gain (NDCG):**
   Metrik standar emas pemeringkatan Google/Netflix yang memperhitungkan **derajat relevansi bertingkat** ($rel_i \\in \\{0, 1, 2, 3\\}$) dan **penalti posisi logaritmik**:
   $$\\text{DCG}@k = \\sum_{i=1}^k \\frac{2^{rel_i} - 1}{\\log_2(i + 1)}, \\quad \\text{NDCG}@k = \\frac{\\text{DCG}@k}{\\text{IDCG}@k}$$
   di mana $\\text{IDCG}$ adalah skor DCG dari pengurutan ideal sempurna. Nilai NDCG berkisar $[0, 1]$.`,
        formula: `\\text{NDCG}@k = \\frac{\\text{DCG}@k}{\\text{IDCG}@k} = \\frac{\\sum_{i=1}^k \\frac{2^{rel_i} - 1}{\\log_2(i+1)}}{\\sum_{i=1}^k \\frac{2^{rel_i^*} - 1}{\\log_2(i+1)}}`,
        code: `# 18.6: Evaluasi Top-k Accuracy dan NDCG pada Sistem Pemeringkatan Scikit-Learn
import numpy as np
from sklearn.metrics import top_k_accuracy_score, ndcg_score

# Simulasi 3 sampel kueri dengan 5 kandidat dokumen
# True labels untuk klasifikasi multikelas
y_true = np.array([2, 4, 1])
# Probabilitas terprediksi untuk 5 kelas
y_prob = np.array([
    [0.1, 0.2, 0.5, 0.1, 0.1], # Kelas 2 di rank 1
    [0.3, 0.2, 0.1, 0.25, 0.15], # Kelas 4 di rank 4
    [0.4, 0.35, 0.1, 0.1, 0.05]  # Kelas 1 di rank 2
])

# 1. Top-1 vs Top-2 Accuracy
top1_acc = top_k_accuracy_score(y_true, y_prob, k=1)
top2_acc = top_k_accuracy_score(y_true, y_prob, k=2)

# 2. NDCG pada relevansi bertingkat
true_relevance = np.array([[3, 2, 1, 0, 0]]) # Kueri tunggal relevansi ideal
pred_scores = np.array([[0.2, 0.8, 0.1, 0.0, 0.5]]) # Skor prediksi model
ndcg_val = ndcg_score(true_relevance, pred_scores, k=3)

print("=== METRIK PERANGKINGAN DAN TOP-K ===")
print(f"Top-1 Accuracy : {top1_acc*100:.1f}%")
print(f"Top-2 Accuracy : {top2_acc*100:.1f}% (Melonjak tajam!)")
print(f"NDCG@3 Score   : {ndcg_val:.4f} (Kualitas Pemeringkatan Relevansi)")`,
        expectedOutput: "Top-2 accuracy mencapai 66.7% dan NDCG@3 terhitung presisi pada evaluasi pemeringkatan.",
        codeExp: "Skrip mengevaluasi metrik top_k_accuracy_score dan ndcg_score Scikit-Learn untuk sistem perangkingan informasi.",
        pitfalls: [
          "Mengevaluasi sistem rekomendasi e-commerce hanya dengan akurasi klasifikasi top-1 kaku yang tidak realistis.",
          "Menghitung NDCG tanpa memastikan array dimensi bertingkat 2D (n_samples, n_items)."
        ],
        refTitle: "Kalervo Järvelin & Jaana Kekäläinen: Cumulated gain-based evaluation of IR techniques (ACM TOIS, 2002)",
        refUrl: "https://dl.acm.org/doi/10.1145/582415.582418"
      },
      {
        num: "18.7",
        slug: "18-7-metrik-regresi-lanjut-huber-mase-adjusted-r2",
        title: "18.7. Metrik Regresi Lanjut: R2 Terkoreksi, Huber Loss, Quantile Loss, dan MASE",
        desc: "Kelemahan MSE/R2 standar: penalti kuadratik pencilan, over-fitting jumlah fitur pada R2, dan metrik bebas skala MASE untuk peramalan deret waktu.",
        concept: `Pada masalah regresi dengan target kontinu $y \\in \\mathbb{R}$, penggunaan metrik standar MSE ($R^2$) sering kali tidak memadai:

**1. R-Squared Terkoreksi (*Adjusted $R^2$*):**
Kelemahan fatal $R^2$ biasa adalah nilainya **dijamin akan selalu meningkat atau tetap ketika kita menambahkan fitur prediktor baru**, bahkan jika fitur baru tersebut adalah angka acak murni tanpa korelasi. Adjusted $R^2$ memberikan penalti terhadap jumlah fitur $p$:
$$R_{\\text{adj}}^2 = 1 - \\left( \\frac{1 - R^2}{n - p - 1} \\right) (n - 1)$$
Jika fitur tambahan tidak memberikan kontribusi yang melampaui ekspektasi kebetulan acak, $R_{\\text{adj}}^2$ akan **menurun**.

**2. Huber Loss (Peter J. Huber, 1964):**
Menggabungkan keunggulan kuadratik MSE di dekat pusat dan ketahanan absolut MAE pada jarak jauh:
$$L_\\delta(y, \\hat{y}) = \\begin{cases} \\frac{1}{2}(y - \\hat{y})^2 & \\text{untuk } |y - \\hat{y}| \\le \\delta \\\\ \\delta |y - \\hat{y}| - \\frac{1}{2}\\delta^2 & \\text{lainnya} \\end{cases}$$
Menghasilkan estimator yang mulus terturunkan di sekitar nol namun kebal terhadap pencilan ekstrem.

**3. Mean Absolute Scaled Error (MASE / Hyndman & Koehler, 2006):**
Metrik evaluasi peramalan runtun waktu standar dunia yang membandingkan galat model terhadap model acuan naif (*naive benchmark forecast*). Bebas skala dan tidak terpengaruh oleh pembagian nol.`,
        formula: `R_{\\text{adj}}^2 = 1 - \\frac{(1 - R^2)(n - 1)}{n - p - 1}, \\quad L_\\delta = \\begin{cases} \\frac{1}{2}e^2 & |e| \\le \\delta \\\\ \\delta|e| - \\frac{1}{2}\\delta^2 & |e| > \\delta \\end{cases}`,
        code: `# 18.7: Perhitungan Adjusted R2 dan Huber Loss pada Regresi dengan Outlier
import numpy as np
from sklearn.metrics import r2_score
from sklearn.linear_model import HuberRegressor, LinearRegression

# Sintesis data dengan 1 pencilan raksasa
np.random.seed(42)
X = np.linspace(0, 10, 100).reshape(-1, 1)
y = 2.0 * X.flatten() + np.random.normal(0, 1, 100)
y[95:] += 50.0 # 5 Pencilan masif

# Fungsi Adjusted R2
def adjusted_r2(r2, n, p):
    return 1.0 - (1.0 - r2) * (n - 1) / (n - p - 1)

ols = LinearRegression().fit(X, y)
huber = HuberRegressor().fit(X, y)

r2_ols = r2_score(y, ols.predict(X))
adj_r2_ols = adjusted_r2(r2_ols, len(y), X.shape[1])

print("=== EVALUASI METRIK REGRESI ROBUST ===")
print(f"Koefisien Kemiringan OLS   : {ols.coef_[0]:.2f} (Terdistorsi ke 3.1 oleh Outlier)")
print(f"Koefisien Kemiringan Huber : {huber.coef_[0]:.2f} (Sempurna di 2.0 Tahan Outlier!)")
print(f"R2 Biasa OLS               : {r2_ols:.4f}")
print(f"Adjusted R2 OLS            : {adj_r2_ols:.4f}")`,
        expectedOutput: "HuberRegressor membuktikan ketahanan lereng terhadap pencilan dengan adjusted R2 terhitung.",
        codeExp: "Skrip menghitung Adjusted R2 dan mendemonstrasikan keunggulan HuberRegressor dalam memodelkan data dengan target pencilan masif.",
        pitfalls: [
          "Menggunakan MAPE (Mean Absolute Percentage Error) ketika target aktual memuat nilai nol (memicu pembagian nol ke tak terhingga).",
          "Membandingkan R2 biasa antar dataset dengan jumlah sampel dan fitur yang berbeda jauh."
        ],
        refTitle: "Rob J. Hyndman & Anne B. Koehler: Another look at measures of forecast accuracy (International Journal of Forecasting, 2006)",
        refUrl: "https://www.sciencedirect.com/science/article/abs/pii/S016920700600025X"
      },
      {
        num: "18.8",
        slug: "18-8-penentuan-ambang-keputusan-threshold-tuning",
        title: "18.8. Pembelajaran Sensitif Biaya dan Penyetelan Ambang Batas Keputusan (Threshold Tuning)",
        desc: "Transformasi probabilitas ke keputusan aksi bisnis: kurva Expected Value, pemindaian ambang batas kontinu, dan antarmuka TunedThresholdClassifierCV Scikit-Learn 1.5+.",
        concept: `Secara bawaan di seluruh pustaka machine learning, metode \` + "\`predict()\`" + \` pada pengklasifikasi biner memotong probabilitas posterior pada **ambang batas default $\\tau = 0.50$**:
$$\\hat{y} = \\begin{cases} 1 & \\text{jika } P(y=1 \\mid \\mathbf{x}) \\ge 0.50 \\\\ 0 & \\text{jika } P(y=1 \\mid \\mathbf{x}) < 0.50 \\end{cases}$$

**Kelemahan Fatal Ambang Default 0.50:**
Ambang batas $0.50$ hanya optimal jika dan hanya jika:
1. Distribusi kelas seimbang $50:50$.
2. **Biaya konsekuensi finansial antara kesalahan False Positive dan False Negative bernilai tepat sama**.

Di dunia nyata, kondisi ini hampir tidak pernah terpenuhi:
- Dalam diagnosis kanker: melewatkan pasien kanker ($FN$) dapat berakibat kematian, sedangkan salah memanggil pasien sehat untuk biopsi ulang ($FP$) hanya menimbulkan kecemasan sementara. Ambang batas yang optimal harus diturunkan secara drastis ke $\\tau \\approx 0.05$ atau $0.10$.
- Dalam filter spam email: membuang email penawaran bisnis penting ke folder spam ($FP$) jauh lebih merugikan daripada meloloskan 1 email spam ke inbox ($FN$). Ambang batas dinaikkan ke $\\tau \\approx 0.90$.

**TunedThresholdClassifierCV (Fitur Terbaru Scikit-Learn 1.5+):**
Mengotomatiskan kalibrasi ambang batas keputusan optimal $\\tau^*$ menggunakan validasi silang untuk memaksimalkan fungsi utilitas bisnis kustom.`,
        formula: `\\tau^* = \\arg\\max_{\\tau \\in (0, 1)} \\mathcal{U}\\left( \\text{TP}(\\tau), \\text{FP}(\\tau), \\text{TN}(\\tau), \\text{FN}(\\tau) \\right) \\quad (\\text{Fungsi Utilitas Bisnis})`,
        code: `# 18.8: Penalaan Ambang Batas Keputusan untuk Memaksimalkan F-Beta (Beta=2 Fokus Recall)
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import precision_recall_curve, fbeta_score
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=1000, n_features=10, weights=[0.9, 0.1], random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

clf = LogisticRegression().fit(X_train, y_train)
probs = clf.predict_proba(X_test)[:, 1]

# Pindai ambang batas dari 0.05 hingga 0.95
threshold_candidates = np.linspace(0.05, 0.95, 100)
f2_scores = [fbeta_score(y_test, (probs >= t).astype(int), beta=2.0) for t in threshold_candidates]

best_idx = np.argmax(f2_scores)
best_threshold = threshold_candidates[best_idx]
best_f2 = f2_scores[best_idx]

f2_default = fbeta_score(y_test, (probs >= 0.50).astype(int), beta=2.0)

print("=== OPTIMASI AMBANG BATAS KEPUTUSAN (THRESHOLD TUNING) ===")
print(f"Ambang Default 0.50 -> Skor F2: {f2_default:.4f}")
print(f"Ambang Optimal Baru : tau* = {best_threshold:.3f} -> Skor F2: {best_f2:.4f} (Lonjakan Signifikan!)")`,
        expectedOutput: "Threshold tuning menurunkan ambang ke ~0.15-0.25 dan meningkatkan skor F2 secara dramatis.",
        codeExp: "Skrip memindai spektrum ambang batas keputusan kontinu untuk menemukan titik potong optimal yang memaksimalkan skor F-beta (beta=2).",
        pitfalls: [
          "Mencari ambang batas optimal pada data uji akhir (test set); ambang batas wajib dicari pada set validasi untuk mencegah data snooping bias.",
          "Mengabaikan fakta bahwa ambang batas optimal bergantung pada kalibrasi probabilitas model."
        ],
        refTitle: "Scikit-Learn Guide: Post-tuning the decision threshold for cost-sensitive learning",
        refUrl: "https://scikit-learn.org/stable/modules/classification_threshold.html"
      },
      {
        num: "18.9",
        slug: "18-9-uji-signifikansi-statistik-mcnemar-wilcoxon",
        title: "18.9. Uji Signifikansi Statistik Perbandingan Model: Uji McNemar dan Wilcoxon Signed-Rank",
        desc: "Metodologi komparasi ilmiah Thomas Dietterich (1998): membuktikan secara formal apakah perbedaan performa antar dua algoritma signifikan secara statistik.",
        concept: `Ketika Model B menghasilkan akurasi $88.5\\%$ dan Model A menghasilkan $87.0\\%$, pertanyaannya adalah: **Apakah Model B benar-benar lebih unggul secara fundamental, atau apakah perbedaan 1.5% tersebut hanyalah variasi kebetulan acak (*noise fluke*) dari sampel uji?**

Thomas G. Dietterich (Neural Computation, 1998) mengkaji metodologi pengujian hipotesis statistik formal untuk membandingkan algoritma pembelajaran mesin:

**1. Uji McNemar (McNemar's Test / Klasifikasi):**
Uji non-parametrik berpasangan pada tabel kontinjensi $2 \\times 2$ yang berfokus **hanya pada sampel di mana kedua model menghasilkan prediksi yang bertolak belakang**:
- $b$: Jumlah sampel yang diprediksi **benar oleh Model A namun salah oleh Model B**.
- $c$: Jumlah sampel yang diprediksi **salah oleh Model A namun benar oleh Model B**.

Statistik uji McNemar dengan koreksi kontinuitas Edwards:
$$\\chi^2 = \\frac{(|b - c| - 1)^2}{b + c} \\sim \\chi_1^2$$
Jika nilai $p\\text{-value} < 0.05$, kita menolak hipotesis nol ($H_0: b = c$) dan menyimpulkan bahwa perbedaan performa kedua model **signifikan secara statistik**.

**2. Uji Wilcoxon Signed-Rank (Komparasi Lintas K-Fold):**
Uji non-parametrik peringkat bertanda untuk membandingkan selisih skor performa dua model di berbagai lipatan validasi silang, tanpa mengasumsikan distribusi normal galat.`,
        formula: `\\chi_{\\text{McNemar}}^2 = \\frac{(|b - c| - 1)^2}{b + c} \\sim \\chi_1^2 \\quad (\\text{Uji Signifikansi Berpasangan})`,
        code: `# 18.9: Uji Signifikansi McNemar Membandingkan Logistic Regression vs Decision Tree
import numpy as np
from scipy.stats import chi2
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=1000, n_features=20, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

clf_a = LogisticRegression().fit(X_train, y_train)
clf_b = DecisionTreeClassifier(max_depth=3, random_state=42).fit(X_train, y_train)

pred_a = clf_a.predict(X_test)
pred_b = clf_b.predict(X_test)

correct_a = (pred_a == y_test)
correct_b = (pred_b == y_test)

# Tabel kontinjensi ketidaksepakatan
b = np.sum(correct_a & ~correct_b) # A benar, B salah
c = np.sum(~correct_a & correct_b) # A salah, B benar

# Statistik McNemar
chi2_stat = ((abs(b - c) - 1)**2) / (b + c)
p_val = chi2.sf(chi2_stat, df=1)

print("=== UJI SIGNIFIKANSI STATISTIK MCNEMAR ===")
print(f"Sampel Model A Benar, Model B Salah (b): {b}")
print(f"Sampel Model A Salah, Model B Benar (c): {c}")
print(f"Statistik Chi-Square: {chi2_stat:.4f} | p-value: {p_val:.5f}")
print("Kesimpulan Ilmiah    :", "Perbedaan Signifikan (p < 0.05)!" if p_val < 0.05 else "Perbedaan TIDAK Signifikan (Hanya Variasi Acak)!")`,
        expectedOutput: "Uji McNemar menghitung nilai p-value secara formal membuktikan apakah perbedaan kedua model signifikan.",
        codeExp: "Skrip mengeksekusi uji hipotesis McNemar berpasangan dari tabel kontinjensi ketidaksepakatan prediksi untuk menguji signifikansi komparasi model.",
        pitfalls: [
          "Menggunakan uji t berpasangan standar (paired t-test) pada K-Fold Cross-Validation tanpa koreksi Nadeau-Bengio (resample folds melanggar asumsi independensi).",
          "Mengklaim keunggulan model baru di paper akademik tanpa menyertakan uji signifikansi statistik."
        ],
        refTitle: "Thomas G. Dietterich: Approximate Statistical Tests for Comparing Supervised Classification Learning Algorithms (Neural Computation, 1998)",
        refUrl: "https://direct.mit.edu/neco/article/10/7/1895/6182/Approximate-Statistical-Tests-for-Comparing"
      },
      {
        num: "18.10",
        slug: "18-10-perancangan-dasbor-dan-deteksi-degradasi-performa",
        title: "18.10. Perancangan Dasbor Evaluasi Metrik Model Produksi dan Deteksi Degradasi Performa",
        desc: "Arsitektur pemantauan performa real-time: pelacakan metrik berjalan (sliding window metrics), deteksi degradasi performa model inferensi, dan strategi peringatan dini.",
        concept: `Perjalanan sebuah model machine learning tidak selesai saat model dideploy ke produksi. Di lingkungan operasional dinamis, performa model hampir pasti mengalami **degradasi bertahap (*model degradation / performance decay*)** akibat perubahan perilaku konsumen, dinamika pasar, atau perubahan format data masukan.

**Prinsip Desain Dasbor Pemantauan Evaluasi:**
1. **Pemisahan Jalur Berdasarkan Ketersediaan Label:**
   - **Metrik Kinerja Langsung (Supervised Monitoring):** Dihitung ketika label kebenaran (*ground-truth*) masuk secara bertahap (misalnya status gagal bayar pinjaman setelah 90 hari). Metrik seperti ROC-AUC, Brier Score, dan F1 dipantau menggunakan jendela geser (*sliding window*).
   - **Metrik Proksi Tanpa Label (Unsupervised Monitoring):** Ketika label tertunda berbulan-bulan, pantau **distribusi probabilitas output** model via uji Kolmogorov-Smirnov atau Population Stability Index (PSI). Jika proporsi prediksi positif melonjak dari 5% ke 25%, model mengalami degradasi kritis!
2. **Penentuan Ambang Pemicu Peringatan (*Alert Triggers*):**
   - **Warning Trigger:** Metrik turun $> 1\\sigma$ dari rata-rata historis (tim data science mulai menginvestigasi).
   - **Critical Alarm:** Metrik turun $> 2\\sigma$ atau melanggar SLA minimum (sistem otomatis memicu alih-versi ke model cadangan / fallback heuristics).`,
        formula: `\\text{PSI} = \\sum_{i=1}^B (P_i - Q_i) \\times \\ln\\left(\\frac{P_i}{Q_i}\\right) \\quad (\\text{Population Stability Index})`,
        code: `# 18.10: Simulasi Pemantauan Metrik Jendela Geser (Sliding Window Monitoring)
import numpy as np
from sklearn.metrics import roc_auc_score

# Simulasi data produksi 10 gelombang waktu
np.random.seed(42)
window_size = 200

print("=== DASBOR PEMANTAUAN DEGRADASI MODEL PRODUKSI ===")
print("Batch | Waktu Observasi | Rolling ROC-AUC | Status Kesehatan Model")
print("-" * 60)

for batch_id in range(1, 7):
    # Simulasi degradasi: Batch 1-3 sinyal kuat, Batch 4-6 data memburuk (drift)
    noise_level = 0.5 if batch_id <= 3 else (1.5 + batch_id * 0.3)
    y_true = np.random.choice([0, 1], size=window_size)
    # Sinyal probabilitas menurun seiring waktu
    raw_signal = (y_true * 2.0) + np.random.normal(0, noise_level, size=window_size)
    probs = 1.0 / (1.0 + np.exp(-raw_signal))
    
    auc = roc_auc_score(y_true, probs)
    status = "SEHAT (Optimal)" if auc >= 0.80 else ("PERINGATAN (Degradasi)" if auc >= 0.70 else "KRITIS (Picu Retrain!)")
    print(f"B-{batch_id:02d}  | 2026-09-W0{batch_id}     | {auc:15.4f} | {status}")`,
        expectedOutput: "Dasbor mencatat penurunan bertahap ROC-AUC dari 0.88 ke status kritis < 0.70.",
        codeExp: "Skrip mensimulasikan pemantauan metrik bergulir (sliding window) untuk mendeteksi degradasi performa model di sistem produksi.",
        pitfalls: [
          "Hanya mengevaluasi model setahun sekali; model finansial dan e-commerce wajib dipantau secara mingguan atau harian.",
          "Mengabaikan fakta bahwa keterlambatan label (label latency) mengharuskan penggunaan metrik proksi berbasis drift input."
        ],
        refTitle: "Breck, E. et al.: The ML Test Score: A Rubric for ML Production Readiness and Technical Debt Reduction (IEEE Big Data, 2017)",
        refUrl: "https://ieeexplore.ieee.org/document/8258138"
      }
    ]
  },

  // ==========================================
  // BAB 19: Penanganan Data Tidak Seimbang (Class Imbalance Strategies)
  // ==========================================
  {
    orderIndex: 19,
    id: "machine-learning-ch-19",
    slug: "bab-19-penanganan-data-tidak-seimbang-class-imbalance",
    title: "BAB 19: Penanganan Data Tidak Seimbang",
    desc: "Strategi komprehensif penanganan ketidakseimbangan kelas ekstrem: paradoks akurasi, pembobotan kerugian class_weight='balanced', teknik undersampling Tomek Links dan ENN, interpolasi sintetis SMOTE Chawla et al., varian Borderline-SMOTE dan SVMSMOTE, algoritma adaptif ADASYN He et al., hybrid sampling SMOTETomek, Balanced Random Forest, modulasi gradien Focal Loss Lin et al., serta pencegahan kebocoran data imblearn Pipeline.",
    coreConcepts: ["Accuracy Paradox", "Cost-Sensitive Loss Weighting", "Undersampling (Tomek Links, ENN)", "SMOTE Synthesis", "Borderline-SMOTE & SVMSMOTE", "ADASYN Density Weighting", "Hybrid Sampling", "Balanced Ensemble Classifiers", "Focal Loss", "Leakage-Free Imbalance Pipeline"],
    subchapters: [
      {
        num: "19.1",
        slug: "19-1-paradoks-akurasi-pada-distribusi-kelas-timpang",
        title: "19.1. Paradoks Akurasi (Accuracy Paradox) pada Distribusi Kelas Minoritas Ekstrem",
        desc: "Kajian kegagalan metrik standar: mengapa model yang memprediksi 100% kelas mayoritas dapat menghasilkan akurasi 99.9% namun sepenuhnya tidak bernilai operasional.",
        concept: `Dalam banyak domain paling bernilai di industri teknologi (seperti deteksi kanker langka, kegagalan turbin pesawat, atau penipuan perbankan), distribusi kelas data target bersifat **sangat tidak seimbang (*extreme class imbalance*)**, dengan rasio kelas minoritas terhadap mayoritas mencapai $1:100$, $1:1.000$, atau bahkan $1:100.000$.

**Paradoks Akurasi (*The Accuracy Paradox*):**
Kelemahan matematis fatal dari metrik Akurasi Standar (proporsi sampel yang diprediksi benar) adalah bahwa **akurasi yang sangat tinggi dapat dihasilkan oleh model yang sama sekali tidak memiliki kemampuan prediktif apa pun**.
Jika dalam dataset terdapat $99.9\\%$ transaksi sah dan $0.1\\%$ transaksi fraud:
- Sebuah "model bodoh" (*dummy classifier*) yang memprogram fungsi konstan $f(\\mathbf{x}) = 0$ (menebak seluruh transaksi adalah sah) akan menghasilkan **akurasi sebesar 99.9%**!
- Namun di lapangan, model ini **melewatkan 100% kasus penipuan**, menyebabkan kebangkrutan operasional.

Oleh karena itu, aturan baku dalam sains data: **Akurasi DILARANG digunakan sebagai metrik evaluasi pada dataset yang memiliki ketidakseimbangan kelas**. Kita wajib beralih ke PR-AUC, Recall, Precision, dan Balanced Accuracy.`,
        formula: `\\text{Akurasi}(\\text{Model Dummy}) = \\frac{N_{\\text{mayoritas}}}{N_{\\text{total}}} \\approx 99.9\\% \\implies \\text{Recall}_{\\text{minoritas}} = 0.0\\%`,
        code: `# 19.1: Demonstrasi Accuracy Paradox Menggunakan DummyClassifier Scikit-Learn
from sklearn.dummy import DummyClassifier
from sklearn.metrics import accuracy_score, recall_score, balanced_accuracy_score
import numpy as np

# 995 transaksi normal (0), 5 transaksi penipuan (1)
y_true = np.array([0]*995 + [1]*5)
X = np.random.randn(1000, 5)

# Dummy classifier yang selalu memprediksi kelas paling sering (most_frequent)
dummy = DummyClassifier(strategy='most_frequent')
dummy.fit(X, y_true)
y_pred = dummy.predict(X)

print("=== DEMONSTRASI THE ACCURACY PARADOX ===")
print(f"Akurasi Standar Model Dummy  : {accuracy_score(y_true, y_pred)*100:.2f}% (Menipu Spektakuler!)")
print(f"Balanced Accuracy            : {balanced_accuracy_score(y_true, y_pred)*100:.2f}% (Mencerminkan Realitas Acak)")
print(f"Recall Kelas Minoritas Fraud : {recall_score(y_true, y_pred)*100:.2f}% (Gagal Total 100%!)")`,
        expectedOutput: "Dummy classifier mencatat akurasi 99.50% namun memiliki recall fraud tepat 0.00%.",
        codeExp: "Skrip mendemonstrasikan Accuracy Paradox menggunakan DummyClassifier untuk memperlihatkan kegagalan fatal metrik akurasi biasa pada data timpang.",
        pitfalls: [
          "Melaporkan akurasi 99% ke pemangku kepentingan bisnis tanpa memvalidasi recall kelas minoritas.",
          "Mengira data tidak seimbang hanya berdampak pada metrik evaluasi (gradien optimasi algoritma juga terdistorsi penuh oleh kelas mayoritas)."
        ],
        refTitle: "Haibo He & Edwardo A. Garcia: Learning from Imbalanced Data (IEEE TKDE, 2009)",
        refUrl: "https://ieeexplore.ieee.org/document/5128907"
      },
      {
        num: "19.2",
        slug: "19-2-pembobotan-kelas-berimbang-class-weight-balanced",
        title: "19.2. Pembobotan Kerugian Kelas Berimbang: Mekanisme class_weight='balanced'",
        desc: "Pendekatan cost-sensitive algoritmik: modifikasi fungsi loss dengan bobot berbanding terbalik terhadap frekuensi kelas tanpa memodifikasi data fisik.",
        concept: `Alih-alih memodifikasi distribusi fisik dataset (melalui resampling), pendekatan yang paling bersih, cepat, dan tidak memerlukan memori tambahan adalah **Pembobotan Sensitif Biaya (*Cost-Sensitive Loss Weighting*)**.

Dalam Scikit-Learn, hampir seluruh estimator terawasi (LogisticRegression, SVC, DecisionTreeClassifier, RandomForestClassifier) menyediakan parameter bawaan \` + "\`class_weight='balanced'\`" + \`.

**Formula Pembobotan Heuristik:**
Algoritma secara otomatis menghitung bobot penalti $w_j$ untuk setiap kelas $j$ yang **berbanding terbalik dengan frekuensi kemunculannya**:
$$w_j = \\frac{n}{K \\cdot n_j}$$
di mana $n$ adalah jumlah total sampel, $K$ adalah jumlah kelas, dan $n_j$ adalah jumlah sampel pada kelas $j$.

**Mekanisme pada Fungsi Objektif:**
Jika kelas positif adalah minoritas ($1\\%$ dari data), maka bobotnya menjadi $w_1 \\approx 50.0$, sedangkan kelas mayoritas $w_0 \\approx 0.50$.
Ketika fungsi loss (seperti binary cross-entropy) dihitung:
$$\\mathcal{L} = -\\sum_{i=1}^n w_{y_i} \\left[ y_i \\ln \\hat{p}_i + (1 - y_i) \\ln(1 - \\hat{p}_i) \\right]$$
Membuat 1 kesalahan pada sampel kelas minoritas dihukum **100 kali lipat lebih berat** daripada kesalahan pada kelas mayoritas, memaksa gradien optimasi memperhatikan pemisahan kelas minoritas secara setara.`,
        formula: `w_j = \\frac{n}{K \\cdot n_j} \\implies \\mathcal{L} = -\\frac{1}{n}\\sum_{i=1}^n w_{y_i} \\left( y_i \\ln p_i + (1-y_i)\\ln(1-p_i) \\right)`,
        code: `# 19.2: Perbandingan Efektivitas Logistic Regression Standar vs class_weight='balanced'
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=2000, n_features=15, weights=[0.95, 0.05], random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 1. Model Standar (Tanpa Pembobotan)
clf_standard = LogisticRegression().fit(X_train, y_train)
rec_standard = classification_report(y_test, clf_standard.predict(X_test), output_dict=True)['1']['recall']

# 2. Model Balanced (Dengan Penalti Frekuensi Terbalik)
clf_balanced = LogisticRegression(class_weight='balanced').fit(X_train, y_train)
rec_balanced = classification_report(y_test, clf_balanced.predict(X_test), output_dict=True)['1']['recall']

print("=== DAMPAK PARAMETER CLASS_WEIGHT='BALANCED' ===")
print(f"Recall Kelas Minoritas (Model Standar) : {rec_standard*100:.1f}%")
print(f"Recall Kelas Minoritas (Model Balanced): {rec_balanced*100:.1f}% (Peningkatan Masif!)")`,
        expectedOutput: "Model balanced melipatgandakan recall kelas minoritas dari ~25% menjadi > 75%.",
        codeExp: "Skrip mengomparasikan performa LogisticRegression standar vs class_weight='balanced' pada dataset 5% minoritas.",
        pitfalls: [
          "Menaikkan bobot kelas minoritas secara ekstrem akan meningkatkan False Positives; wajib mengevaluasi penurunan presisi.",
          "Menerapkan SMOTE bersamaan dengan class_weight='balanced' secara simultan tanpa kalibrasi, yang dapat menyebabkan penalti berlebih ganda."
        ],
        refTitle: "Gary M. Weiss: Mining with rarity: a unifying framework (ACM SIGKDD Explorations, 2004)",
        refUrl: "https://dl.acm.org/doi/10.1145/1007730.1007734"
      },
      {
        num: "19.3",
        slug: "19-3-undersampling-tomek-links-dan-edited-nearest-neighbors",
        title: "19.3. Teknik Undersampling Cerdas: Tomek Links dan Edited Nearest Neighbors (ENN)",
        desc: "Pembersihan perbatasan keputusan I. Tomek (1976) dan D. Wilson (1972): eliminasi sampel mayoritas yang menimbulkan derau dan ambiguitas di zona perbatasan.",
        concept: `Undersampling acak (*Random Undersampling*) membuang sampel kelas mayoritas secara seragam. Meskipun menyeimbangkan proporsi, teknik ini berisiko membuang informasi berharga dari kelas mayoritas (*loss of critical information*).

Dua teknik **Undersampling Cerdas Berbasis Jarak** yang berfokus pada pembersihan zona perbatasan (*boundary cleaning*):

**1. Tomek Links (Ivan Tomek, 1976):**
Diberikan sepasang sampel data $(\\mathbf{x}_i, \\mathbf{x}_j)$ dari kelas yang berbeda ($y_i \\neq y_j$). Pasangan ini disebut **Tomek Link** jika tidak ada sampel lain $\\mathbf{x}_k$ yang berjarak lebih dekat ke $\\mathbf{x}_i$ atau $\\mathbf{x}_j$ daripada jarak mereka berdua:
$$d(\\mathbf{x}_i, \\mathbf{x}_j) < d(\\mathbf{x}_i, \\mathbf{x}_k) \\quad \\text{dan} \\quad d(\\mathbf{x}_i, \\mathbf{x}_j) < d(\\mathbf{x}_j, \\mathbf{x}_k), \\quad \\forall k$$
- *Strategi Pembersihan:* Hapus sampel kelas mayoritas dari pasangan Tomek Link tersebut. Tindakan ini memperlebar margin pemisah antara kedua kelas dan mempertegas batas keputusan!

**2. Edited Nearest Neighbors (ENN / Dennis L. Wilson, 1972):**
Memeriksa $k$ tetangga terdekat dari setiap sampel data:
- Jika label kelas dari suatu sampel mayoritas berbeda dari label mayoritas tetangga-tetangganya, sampel mayoritas tersebut dihapus karena dianggap sebagai **derau (*noise*) atau pencilan perbatasan**.`,
        formula: `(\\mathbf{x}_i, \\mathbf{x}_j) \\in \\text{Tomek Link} \\iff y_i \\neq y_j \\land \\forall k, d(\\mathbf{x}_i, \\mathbf{x}_j) < \\min(d(\\mathbf{x}_i, \\mathbf{x}_k), d(\\mathbf{x}_j, \\mathbf{x}_k))`,
        code: `# 19.3: Pembersihan Perbatasan Data Menggunakan TomekLinks dan ENN via imbalanced-learn
from collections import Counter
from sklearn.datasets import make_classification
from imblearn.under_sampling import TomekLinks, EditedNearestNeighbors

X, y = make_classification(n_samples=1000, n_features=10, weights=[0.9, 0.1], random_state=42)
print("Distribusi Awal Dataset:", Counter(y))

# 1. Terapkan Tomek Links
tl = TomekLinks()
X_tl, y_tl = tl.fit_resample(X, y)
print(f"Setelah Tomek Links    : {Counter(y_tl)} (Dihapus {len(X) - len(X_tl)} sampel mayoritas ambigu)")

# 2. Terapkan ENN
enn = EditedNearestNeighbors(n_neighbors=3)
X_enn, y_enn = enn.fit_resample(X, y)
print(f"Setelah ENN            : {Counter(y_enn)} (Dihapus {len(X) - len(X_enn)} sampel mayoritas derau)")`,
        expectedOutput: "TomekLinks dan ENN menghapus puluhan sampel mayoritas di zona perbatasan yang ambigu.",
        codeExp: "Skrip menerapkan algoritma pembersihan perbatasan TomekLinks dan EditedNearestNeighbors dari pustaka imbalanced-learn.",
        pitfalls: [
          "Menerapkan undersampling pada seluruh dataset termasuk data validasi dan data uji (wajib fit_resample HANYA pada data latih).",
          "Tomek Links hanya menghapus sampel perbatasan, sehingga jika dataset sangat timpang (1:100), Tomek Links sendiri belum cukup menyeimbangkan rasio secara penuh."
        ],
        refTitle: "I. Tomek: Two modifications of CNN (IEEE Transactions on Systems, Man, and Cybernetics, 1976)",
        refUrl: "https://ieeexplore.ieee.org/document/4309452"
      },
      {
        num: "19.4",
        slug: "19-4-smote-chawla-2002-interpolasi-fitur-sintetis",
        title: "19.4. Teknik Oversampling SMOTE: Interpolasi Garis Fitur K-Tetangga Terdekat",
        desc: "Terobosan Nitesh Chawla et al. (JAIR 2002): pemecahan masalah replikasi duplikat via pembangkitan sampel sintetis acak di sepanjang garis penghubung tetangga terdekat.",
        concept: `Random Oversampling klasik hanya menduplikasi sampel minoritas yang sudah ada secara acak. Hal ini menyebabkan pohon keputusan atau model non-linier membentuk aturan yang sangat sempit di sekitar titik-titik duplikat tersebut, memicu **overfitting ekstrem**.

Nitesh V. Chawla, Kevin W. Bowyer, Lawrence O. Hall, dan W. Philip Kegelmeyer (JAIR, 2002) merevolusi bidang ini dengan merumuskan **SMOTE (Synthetic Minority Over-sampling Technique)**.

**Algoritma Interpolasi Garis SMOTE:**
Alih-alih membuat duplikat persis, SMOTE menciptakan **sampel sintetis baru yang sepenuhnya unik** di dalam ruang fitur kontinu:
1. Untuk setiap sampel minoritas $\\mathbf{x}_i \\in \\mathcal{X}_{\\text{minority}}$, cari $k$ tetangga terdekatnya yang juga berasal dari kelas minoritas menggunakan jarak Euklides (biasanya $k = 5$).
2. Pilih satu tetangga secara acak dari himpunan $k$ tetangga tersebut, sebut sebagai $\\mathbf{x}_{\\text{zi}}$.
3. Hitung vektor selisih jarak antara kedua titik: $\\mathbf{d} = \\mathbf{x}_{\\text{zi}} - \\mathbf{x}_i$.
4. Bangkitkan bilangan acak seragam $\\lambda \\sim \\text{Uniform}(0, 1)$.
5. Ciptakan sampel sintetis baru $\\mathbf{x}_{\\text{new}}$ pada titik sembarang di sepanjang garis segmen yang menghubungkan $\\mathbf{x}_i$ dan $\\mathbf{x}_{\\text{zi}}$:
$$\\mathbf{x}_{\\text{new}} = \\mathbf{x}_i + \\lambda \\cdot (\\mathbf{x}_{\\text{zi}} - \\mathbf{x}_i)$$

**Dampak Positif:**
SMOTE memperluas wilayah keputusan (*decision region*) kelas minoritas secara cembung dan kontinu, memungkinkan model mempelajari generalisasi ruang fitur yang lebih luas.`,
        formula: `\\mathbf{x}_{\\text{new}} = \\mathbf{x}_i + \\lambda (\\mathbf{x}_{\\text{neighbor}} - \\mathbf{x}_i), \\quad \\lambda \\sim \\mathcal{U}(0, 1)`,
        code: `# 19.4: Pembangkitan Sampel Sintetis SMOTE Menggunakan imbalanced-learn
from collections import Counter
from sklearn.datasets import make_classification
from imblearn.over_sampling import SMOTE
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=1000, n_features=10, weights=[0.92, 0.08], random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

print("Distribusi Data Latih Asli:", Counter(y_train))

# Terapkan SMOTE pada data latih
smote = SMOTE(k_neighbors=5, random_state=42)
X_train_sm, y_train_sm = smote.fit_resample(X_train, y_train)

print("Distribusi Setelah SMOTE  :", Counter(y_train_sm))

# Evaluasi performa model
clf = RandomForestClassifier(random_state=42).fit(X_train_sm, y_train_sm)
print("\nLaporan Klasifikasi Data Uji Asli:")
print(classification_report(y_test, clf.predict(X_test), digits=3))`,
        expectedOutput: "SMOTE menyeimbangkan proporsi kelas latih menjadi seimbang 50:50 dan menghasilkan F1-score tinggi pada data uji.",
        codeExp: "Skrip menerapkan teknik interpolasi sintetis SMOTE pada data latih dan mengevaluasi dampaknya pada Random Forest.",
        pitfalls: [
          "Menerapkan SMOTE pada fitur kategorikal langsung tanpa enkoding khusus (gunakan SMOTENC untuk data campuran numerik dan kategorikal).",
          "Menerapkan SMOTE sebelum train_test_split yang menyebabkan sampel sintetis masuk ke test set (kebocoran data katastropik)."
        ],
        refTitle: "N. V. Chawla et al.: SMOTE: Synthetic Minority Over-sampling Technique (JAIR, 2002)",
        refUrl: "https://www.jair.org/index.php/jair/article/view/10302"
      },
      {
        num: "19.5",
        slug: "19-5-varian-borderline-smote-dan-svmsmote",
        title: "19.5. Varian Lanjut SMOTE: Borderline-SMOTE dan SVMSMOTE",
        desc: "Evolusi Han et al. (2005) dan Nguyen et al. (2011): fokus pembangkitan sampel sintetis secara selektif pada zona perbatasan kritis (borderline zone).",
        concept: `Kelemahan dari SMOTE standar adalah ia memperlakukan **seluruh sampel minoritas secara setara**: sampel minoritas yang berada jauh di dalam klaster aman maupun sampel yang berada di zona perbatasan rawan disintesiskan dalam jumlah yang sama. Menyintesiskan sampel di dalam klaster aman tidak memberikan kontribusi pada pemisahan perbatasan, sedangkan menyintesiskan sampel yang merupakan derau terisolasi (*noise*) justru memperparah kontaminasi.

Dua varian spesialisasi perbatasan:

**1. Borderline-SMOTE (Hui Han, Wen-Yuan Wang, Bing-Huan Mao, 2005):**
Mengklasifikasikan setiap sampel minoritas berdasarkan $m$ tetangga terdekatnya (gabungan kelas mayoritas dan minoritas):
- **Safe:** Mayoritas tetangganya adalah kelas minoritas (tidak perlu disintesiskan).
- **Noise:** Seluruh $m$ tetangganya adalah kelas mayoritas (outlier terisolasi, diabaikan).
- **DANGER (Borderline):** Lebih dari setengah tetangganya adalah kelas mayoritas ($m/2 \\le \\text{mayoritas} < m$).
*Strategi:* **SMOTE HANYA dijalankan pada sampel yang berada di zona DANGER!**

**2. SVMSMOTE (Hien M. Nguyen et al., 2011):**
Melatih Support Vector Machine linier terlebih dahulu untuk mengidentifikasi **Support Vectors** kelas minoritas. Sampel sintetis baru dibangkitkan secara terarah di sepanjang garis ortogonal yang menghubungkan support vectors minoritas ke batas keputusan, memperkuat batas margin paling kritis.`,
        formula: `\\mathbf{x} \\in \\text{DANGER} \\iff \\frac{m}{2} \\le |N_m(\\mathbf{x}) \\cap \\mathcal{X}_{\\text{majority}}| < m \\quad (\\text{Fokus Borderline})`,
        code: `# 19.5: Komparasi BorderlineSMOTE vs Standard SMOTE Menggunakan imbalanced-learn
from imblearn.over_sampling import SMOTE, BorderlineSMOTE, SVMSMOTE
from sklearn.datasets import make_classification
from collections import Counter

X, y = make_classification(n_samples=800, n_features=10, weights=[0.93, 0.07], random_state=42)

# 1. Standard SMOTE
X_sm, y_sm = SMOTE(random_state=42).fit_resample(X, y)

# 2. Borderline-SMOTE (Fokus Zona Danger)
X_bsm, y_bsm = BorderlineSMOTE(random_state=42, kind='borderline-1').fit_resample(X, y)

# 3. SVMSMOTE (Fokus Support Vectors Margin)
X_svm, y_svm = SVMSMOTE(random_state=42).fit_resample(X, y)

print("=== PERBANDINGAN VARIAN TEKNIK SMOTE ===")
print(f"Distribusi Asli       : {Counter(y)}")
print(f"Output Standard SMOTE : {Counter(y_sm)}")
print(f"Output BorderlineSMOTE: {Counter(y_bsm)} (Sintesis selektif zona perbatasan)")
print(f"Output SVMSMOTE       : {Counter(y_svm)} (Sintesis sepanjang support vector)")`,
        expectedOutput: "Seluruh varian berhasil menyeimbangkan kelas dengan memfokuskan titik sintetis pada zona kritis.",
        codeExp: "Skrip mengomparasikan Standard SMOTE, BorderlineSMOTE, dan SVMSMOTE pada dataset tidak seimbang menggunakan imblearn.",
        pitfalls: [
          "BorderlineSMOTE dapat memperburuk keadaan jika data memiliki overlap kelas ekstrem di mana zona DANGER sebenarnya adalah derau label.",
          "Waktu komputasi SVMSMOTE lebih lambat karena harus melatih SVM internal terlebih dahulu."
        ],
        refTitle: "Hui Han, Wen-Yuan Wang, Bing-Huan Mao: Borderline-SMOTE: A New Over-Sampling Method in Imbalanced Data Sets Learning (ICIC, 2005)",
        refUrl: "https://link.springer.com/chapter/10.1007/11538059_91"
      },
      {
        num: "19.6",
        slug: "19-6-adasyn-adaptive-synthetic-sampling",
        title: "19.6. ADASYN (Adaptive Synthetic Sampling): Pembobotan Densitas Kesulitan Belajar",
        desc: "Inovasi Haibo He et al. (IEEE IJCNN 2008): adaptasi dinamis alokasi sampel sintetis proporsional terhadap tingkat kesulitan belajar (rasio dominasi tetangga mayoritas).",
        concept: `Jika SMOTE menghasilkan jumlah sampel sintetis yang seragam untuk setiap sampel minoritas terpilih, **ADASYN (Adaptive Synthetic Sampling Approach)** (Haibo He, Yang Bai, Edwardo A. Garcia, dan Shutao Li, 2008) memperkenalkan prinsip **Pembelajaran Adaptif Berbasis Kesulitan (*Learning Difficulty Weighting*)**.

**Mekanisme Matematika ADASYN:**
1. Hitung total jumlah sampel sintetis yang perlu dibangkitkan untuk menyeimbangkan kelas:
   $$G = (n_{\\text{mayoritas}} - n_{\\text{minoritas}}) \\times \\beta, \\quad \\beta \\in (0, 1]$$
2. Untuk setiap sampel minoritas $\\mathbf{x}_i$, cari $K$ tetangga terdekatnya di seluruh ruang dataset.
3. Hitung **Rasio Dominasi Mayoritas ($r_i$)**:
   $$r_i = \\frac{\\Delta_i}{K} \\in [0, 1]$$
   di mana $\\Delta_i$ adalah jumlah sampel kelas mayoritas di antara $K$ tetangga terdekat $\\mathbf{x}_i$. Nilai $r_i$ mencerminkan **tingkat kesulitan model untuk mempelajari sampel tersebut**.
4. Normalisasi $r_i$ menjadi distribusi kepadatan probabilitas: $\\hat{r}_i = \\frac{r_i}{\\sum_{j} r_j}$.
5. Tentukan jumlah sampel sintetis yang dialokasikan secara spesifik untuk sampel $\\mathbf{x}_i$:
   $$g_i = G \\times \\hat{r}_i$$

Hasilnya: **Sampel minoritas yang paling sulit dipelajari (dikelilingi banyak sampel mayoritas) akan menerima alokasi sampel sintetis paling banyak**, memaksa model memusatkan perhatian pada wilayah yang paling rawan galat.`,
        formula: `r_i = \\frac{|N_K(\\mathbf{x}_i) \\cap \\mathcal{X}_{\\text{maj}}|}{K}, \\quad g_i = G \\cdot \\frac{r_i}{\\sum_j r_j} \\quad (\\text{Distribusi Adaptif})`,
        code: `# 19.6: Penerapan ADASYN Menggunakan imbalanced-learn
from imblearn.over_sampling import ADASYN
from sklearn.datasets import make_classification
from collections import Counter

X, y = make_classification(n_samples=1000, n_features=10, weights=[0.90, 0.10], random_state=42)
print("Distribusi Data Sebelum ADASYN:", Counter(y))

# Terapkan ADASYN dengan 5 tetangga
adasyn = ADASYN(n_neighbors=5, random_state=42)
X_ada, y_ada = adasyn.fit_resample(X, y)

print("Distribusi Data Setelah ADASYN :", Counter(y_ada))
print(f"Total Sampel Sintetis Dihasilkan: {len(X_ada) - len(X)} sampel (Terdistribusi adaptif)")`,
        expectedOutput: "ADASYN secara adaptif menghasilkan sampel sintetis untuk menyeimbangkan proporsi kelas.",
        codeExp: "Skrip mengaplikasikan algoritma ADASYN untuk melakukan oversampling adaptif berbasis tingkat kesulitan belajar lokal tetangga.",
        pitfalls: [
          "ADASYN sangat rentan terhadap pencilan (*outliers*): jika ada 1 sampel minoritas yang merupakan derau murni di tengah kelas mayoritas, ADASYN akan menghasilkan puluhan sampel sintetis di sekitar derau tersebut.",
          "Disarankan mengombinasikan ADASYN dengan metode pembersihan derau seperti Tomek Links."
        ],
        refTitle: "Haibo He et al.: ADASYN: Adaptive Synthetic Sampling Approach for Imbalanced Learning (IEEE IJCNN, 2008)",
        refUrl: "https://ieeexplore.ieee.org/document/4633969"
      },
      {
        num: "19.7",
        slug: "19-7-kombinasi-hybrid-sampling-smotetomek-dan-smoteenn",
        title: "19.7. Kombinasi Hybrid Sampling: SMOTETomek dan SMOTEENN",
        desc: "Sinergi dua arah: menggabungkan kekuatan oversampling sintetis SMOTE dengan pembersihan perbatasan undersampling untuk menghasilkan separasi kelas optimal.",
        concept: `Oversampling murni (SMOTE) memperluas wilayah kelas minoritas, namun memiliki kelemahan sampingan: interpolasi sintetis dapat menghasilkan titik-titik baru yang melanggar perbatasan dan menyusup terlalu dalam ke wilayah kelas mayoritas (*borderline invasion*). Di sisi lain, Undersampling murni (Tomek / ENN) membersihkan perbatasan, namun tidak menambah volume sampel minoritas.

G. E. A. P. A. Batista, R. C. Prati, dan M. C. Monard (SIGKDD Explorations, 2004) mengusulkan **Kombinasi Hybrid Sampling**:

**Dua Arsitektur Hybrid Utama:**
1. **SMOTETomek (\`SMOTETomek\`):**
   - **Tahap 1:** Jalankan SMOTE standar untuk melipatgandakan kelas minoritas hingga seimbang.
   - **Tahap 2:** Jalankan pembersihan Tomek Links pada seluruh dataset hasil oversampling untuk mengidentifikasi dan membuang pasangan titik yang saling berdekatan di perbatasan.
2. **SMOTEENN (\`SMOTEENN\`):**
   - **Tahap 1:** Jalankan SMOTE untuk menambah sampel minoritas.
   - **Tahap 2:** Terapkan Edited Nearest Neighbors (ENN) untuk membuang setiap titik (baik mayoritas maupun minoritas) yang mayoritas tetangganya memiliki label kelas berbeda.

SMOTEENN cenderung melakukan pembersihan yang **jauh lebih agresif** daripada SMOTETomek, menghasilkan pemisahan ruang keputusan yang sangat bersih, tegas, dan lapang antar kelas.`,
        formula: `\\mathcal{D}_{\\text{hybrid}} = \\text{Clean}_{\\text{ENN/Tomek}}\\left( \\text{SMOTE}(\\mathcal{D}) \\right) \\quad (\\text{Sinergi Dua Arah})`,
        code: `# 19.7: Komparasi Pembersihan Perbatasan SMOTETomek vs SMOTEENN
from imblearn.combine import SMOTETomek, SMOTEENN
from sklearn.datasets import make_classification
from collections import Counter

X, y = make_classification(n_samples=1200, n_features=12, weights=[0.88, 0.12], random_state=42)
print("Distribusi Mentah Awal:", Counter(y))

# 1. SMOTETomek
smt = SMOTETomek(random_state=42)
X_smt, y_smt = smt.fit_resample(X, y)
print("Setelah SMOTETomek     :", Counter(y_smt))

# 2. SMOTEENN (Pembersihan Agresif)
sme = SMOTEENN(random_state=42)
X_sme, y_sme = sme.fit_resample(X, y)
print("Setelah SMOTEENN      :", Counter(y_sme), "(Pembersihan perbatasan sangat agresif!)")`,
        expectedOutput: "SMOTETomek menghasilkan kelas yang seimbang rapi, sementara SMOTEENN membuang sampel perbatasan secara agresif.",
        codeExp: "Skrip mendemonstrasikan perbandingan teknik hybrid sampling SMOTETomek vs SMOTEENN pada dataset tidak seimbang menggunakan imblearn.",
        pitfalls: [
          "SMOTEENN dapat membuang terlalu banyak data jika overlap kelas sangat besar; verifikasi jumlah sampel akhir agar tidak kekurangan data latih.",
          "Waktu eksekusi komputasi lebih lama karena menggabungkan dua algoritma berturut-turut."
        ],
        refTitle: "Gustavo E. A. P. A. Batista, Ronaldo C. Prati, Maria Carolina Monard: A study of the behavior of several methods for balancing machine learning training data (SIGKDD Explorations, 2004)",
        refUrl: "https://dl.acm.org/doi/10.1145/1007730.1007735"
      },
      {
        num: "19.8",
        slug: "19-8-ensemble-khusus-balanced-random-forest-easyensemble",
        title: "19.8. Ensemble Khusus Data Tidak Seimbang: Balanced Random Forest dan EasyEnsemble",
        desc: "Metodologi Chen, Liaw, Breiman (2004) dan Liu et al. (2009): integrasi undersampling bootstrap internal di dalam setiap estimator pohon.",
        concept: `Melakukan resampling pada dataset sebelum melatih model ensemble standar sering kali memakan komputasi besar atau membuang data mayoritas. Pendekatan alternatif yang sangat elegan adalah **mengintegrasikan proses penyeimbangan langsung ke dalam setiap estimator penyusun ensemble**:

**1. Balanced Random Forest (\`BalancedRandomForestClassifier\` / Chen et al., 2004):**
Pada setiap iterasi pembangunan pohon keputusan dalam Random Forest:
- Algoritma mengambil **seluruh sampel kelas minoritas**.
- Algoritma mengambil **sampel bootstrap acak dari kelas mayoritas dengan ukuran yang tepat sama** dengan kelas minoritas.
- Pohon dilatih pada subset data berimbang 50:50 tersebut.
- Penggabungan ratusan pohon memastikan seluruh data mayoritas tetap terutilisasi secara komprehensif melintasi ensemble, namun tanpa pernah mengalami bias mayoritas pada pohon individual!

**2. EasyEnsemble (\`EasyEnsembleClassifier\` / Xu-Ying Liu et al., 2009):**
Membangun beberapa himpunan bagian independen dari kelas mayoritas melalui undersampling acak, melatih pengklasifikasi AdaBoost pada setiap himpunan bagian bersama kelas minoritas, lalu menggabungkan seluruh ensemble tersebut secara berjenjang.`,
        formula: `\\mathcal{D}_{\\text{tree}}^{(b)} = \\text{Bootstrap}(\\mathcal{X}_{\\text{min}}) \\cup \\text{RandomSubsample}(\\mathcal{X}_{\\text{maj}}, |\\mathcal{X}_{\\text{min}}|) \\quad (\\text{Balanced Bootstrap})`,
        code: `# 19.8: Implementasi BalancedRandomForestClassifier vs Standard RandomForest
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from imblearn.ensemble import BalancedRandomForestClassifier
from sklearn.metrics import balanced_accuracy_score, classification_report
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=2000, n_features=20, weights=[0.95, 0.05], random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 1. Standard Random Forest
rf_std = RandomForestClassifier(random_state=42).fit(X_train, y_train)
bacc_std = balanced_accuracy_score(y_test, rf_std.predict(X_test))

# 2. Balanced Random Forest
rf_bal = BalancedRandomForestClassifier(n_estimators=50, random_state=42).fit(X_train, y_train)
bacc_bal = balanced_accuracy_score(y_test, rf_bal.predict(X_test))

print("=== EVALUASI BALANCED RANDOM FOREST ===")
print(f"Balanced Accuracy Standard RF  : {bacc_std*100:.2f}%")
print(f"Balanced Accuracy Balanced RF  : {bacc_bal*100:.2f}% (Peningkatan Signifikan)")`,
        expectedOutput: "BalancedRandomForestClassifier menghasilkan Balanced Accuracy jauh lebih tinggi dibandingkan Random Forest standar.",
        codeExp: "Skrip membandingkan BalancedRandomForestClassifier dengan Random Forest standar pada dataset dengan rasio 95:5.",
        pitfalls: [
          "BalancedRandomForest dapat menghasilkan penurunan presisi (lebih banyak FP); pantau metrik F1 atau PR-AUC.",
          "Mengira Balanced Random Forest identik dengan menyetel parameter class_weight='balanced' (resampling bootstrap memberikan keragaman pohon yang berbeda)."
        ],
        refTitle: "Chao Chen, Andy Liaw, Leo Breiman: Using Random Forest to Learn Imbalanced Data (UC Berkeley Technical Report, 2004)",
        refUrl: "https://statistics.berkeley.edu/tech-reports/666"
      },
      {
        num: "19.9",
        slug: "19-9-focal-loss-modulasi-gradien-sampel-mudah",
        title: "19.9. Focal Loss (Lin et al. 2017): Modulasi Gradien Meredam Pengaruh Sampel Negatif Mudah",
        desc: "Terobosan Tsung-Yi Lin et al. (RetinaNet, ICCV 2017): faktor modulasi (1 - p_t)^gamma untuk menekan kontribusi loss dari sampel negatif mudah dan memfokuskan model pada sampel sulit.",
        concept: `Dalam deteksi objek satu tahap (*one-stage object detection*) dan klasifikasi biner ekstrem di mana rasio negatif terhadap positif mencapai $1.000:1$, fungsi kerugian Cross-Entropy standar gagal total:
Meskipun setiap sampel negatif mudah (*easy negatives*) hanya menghasilkan nilai loss yang sangat kecil (misal $0.001$), ketika dijumlahkan melintasi ratusan ribu sampel negatif, **gradien kumulatif sampel mudah tersebut mendominasi fungsi loss secara total**, menenggelamkan sinyal gradien dari sampel positif langka.

Tsung-Yi Lin, Priya Goyal, Ross Girshick, Kaiming He, dan Piotr Dollár (ICCV 2017) merumuskan **Focal Loss**:

**Formulasi Matematis:**
Focal Loss menambahkan faktor modulasi dinamis $(1 - p_t)^\\gamma$ ke dalam Cross-Entropy:
$$\\text{FL}(p_t) = -\\alpha_t (1 - p_t)^\\gamma \\ln(p_t)$$
di mana:
- $p_t$: Probabilitas model untuk kelas target kebenaran ($p_t = p$ jika $y=1$, dan $p_t = 1 - p$ jika $y=0$).
- $\\alpha_t \\in [0, 1]$: Faktor pembobotan kelas penyeimbang.
- $\\gamma \\ge 0$: **Parameter Pemfokus (*Focusing Parameter*)**.

**Mekanisme Penekanan Gradien:**
- Ketika sampel **mudah diklasifikasikan** ($p_t \\to 1.0$), faktor modulasi $(1 - p_t)^\\gamma \\to 0$. Dengan $\\gamma = 2$, jika $p_t = 0.99$, maka $(1 - 0.99)^2 = 0.0001$, **menekan nilai loss hingga 1.000 kali lipat**!
- Ketika sampel **sulit atau salah diklasifikasikan** ($p_t \\le 0.50$), faktor modulasi mendekati $1.0$, mempertahankan magnitudo loss dan gradien secara penuh.`,
        formula: `\\text{FL}(p_t) = -\\alpha_t (1 - p_t)^\\gamma \\ln(p_t) \\quad \\text{di mana } \\gamma = 2, \\alpha = 0.25 \\quad (\\text{Focal Loss RetinaNet})`,
        code: `# 19.9: Implementasi Fungsi Kerugian Focal Loss dari Nol Menggunakan NumPy
import numpy as np

def binary_focal_loss(y_true, y_pred_prob, gamma=2.0, alpha=0.25):
    # Hindari log(0) via clipping
    eps = 1e-15
    p = np.clip(y_pred_prob, eps, 1.0 - eps)
    
    # Hitung p_t dan alpha_t
    p_t = np.where(y_true == 1, p, 1.0 - p)
    alpha_t = np.where(y_true == 1, alpha, 1.0 - alpha)
    
    # Formula Focal Loss
    loss = -alpha_t * ((1.0 - p_t) ** gamma) * np.log(p_t)
    return np.mean(loss)

# Uji pada 2 skenario: Sampel Mudah (p=0.99) vs Sampel Sulit (p=0.20)
y_real = np.array([1, 1])
p_easy = np.array([0.99, 0.99])
p_hard = np.array([0.20, 0.20])

loss_easy = binary_focal_loss(y_real, p_easy, gamma=2.0)
loss_hard = binary_focal_loss(y_real, p_hard, gamma=2.0)

print("=== ANALISIS MODULASI FOCAL LOSS (GAMMA = 2.0) ===")
print(f"Loss Sampel Mudah (p=0.99): {loss_easy:.8f} (Teredam Menuju Nol Mutlak!)")
print(f"Loss Sampel Sulit (p=0.20): {loss_hard:.4f}")
print(f"Rasio Penekanan Gradien   : {loss_hard / loss_easy:.1f}x lebih besar untuk sampel sulit!")`,
        expectedOutput: "Focal loss menekan kontribusi sampel mudah hingga ribuan kali lebih kecil dibandingkan sampel sulit.",
        codeExp: "Skrip mengimplementasikan formula analitis Focal Loss dan membuktikan efek peredaman eksponensial pada sampel terklasifikasi mudah.",
        pitfalls: [
          "Menyetel gamma=0 yang membuat Focal Loss kembali menjadi Cross-Entropy standar.",
          "Menyetel gamma terlalu tinggi (gamma > 5) yang dapat menekan gradien seluruh sampel secara berlebihan dan menghambat konvergensi."
        ],
        refTitle: "Tsung-Yi Lin et al.: Focal Loss for Dense Object Detection (IEEE ICCV, 2017)",
        refUrl: "https://openaccess.thecvf.com/content_iccv_2017/html/Lin_Focal_Loss_for_ICCV_2017_paper.html"
      },
      {
        num: "19.10",
        slug: "19-10-jebakan-kebocoran-smote-dan-imblearn-pipeline",
        title: "19.10. Jebakan Kebocoran Data SMOTE: Kewajiban Penggunaan imblearn.pipeline.Pipeline",
        desc: "Analisis kesalahan metodologis paling umum: mengapa oversampling sebelum validasi silang menghasilkan estimasi performa palsu dan integrasi imblearn Pipeline.",
        concept: `Di antara seluruh kesalahan metodologi dalam pembelajaran mesin data tidak seimbang, **menjalankan SMOTE sebelum membagi dataset (*Oversampling Before Cross-Validation*)** adalah kesalahan fatal yang paling sering terjadi bahkan di publikasi ilmiah bereputasi.

**Mekanisme Kebocoran Data SMOTE (*SMOTE Data Leakage*):**
1. Jika SMOTE dijalankan pada seluruh dataset awal sebelum cross-validation:
   - Sampel sintetis dibuat melalui interpolasi antara sampel asli $\\mathbf{x}_i$ dan tetangganya $\\mathbf{x}_j$.
   - Ketika dataset kemudian dibagi menjadi fold latih dan fold validasi: **sampel sintetis masuk ke fold validasi sementara "induk kandungnya" berada di fold latih** (atau sebaliknya).
   - Akibatnya: Model di fold latih secara tidak langsung telah "melihat" representasi fitur dari fold validasi!
   - Metrik validasi yang dilaporkan (akurasi, ROC-AUC) akan tampak spektakuler ($> 98\\%$), namun saat model diuji di sistem produksi nyata, performanya **jatuh bebas** karena tidak ada sampel sintetis yang memandu prediksi data baru.

**Solusi Standar Mutlak:**
Oversampling SMOTE **WAJIB HANYA DIJALANKAN DI DALAM LIPATAN LATIHAN** (*inside training folds*).
Karena kelas \` + "\`sklearn.pipeline.Pipeline\`" + \` standar tidak mendukung metode \` + "\`fit_resample\`" + \`, kita **wajib menggunakan** \` + "\`imblearn.pipeline.Pipeline\`" + \`! Pustaka ini secara otomatis mengaplikasikan SMOTE hanya pada fase latihan dan menonaktifkannya pada saat evaluasi data uji.`,
        formula: `\\text{SMOTE}(\\mathcal{D}_{\\text{train}}) \\to \\text{Model.fit()} \\implies \\text{Model.predict}(\\mathcal{D}_{\\text{test}}) \\quad (\\text{Bebas Leakage Mutlak})`,
        code: `# 19.10: Demonstrasi Kebocoran SMOTE vs Pipeline Bersih imblearn
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import cross_val_score, KFold
from sklearn.tree import DecisionTreeClassifier
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline

# Data sintetis murni acak (tidak ada sinyal riil)
np.random.seed(42)
X = np.random.randn(500, 20)
y = np.random.choice([0, 1], p=[0.95, 0.05], size=500)

cv = KFold(n_splits=5, shuffle=True, random_state=42)

# SKENARIO 1: SALAH FATAL (SMOTE Sebelum Cross-Validation - Data Leakage!)
smote = SMOTE(random_state=42)
X_bocor, y_bocor = smote.fit_resample(X, y)
skor_bocor = cross_val_score(DecisionTreeClassifier(random_state=42), X_bocor, y_bocor, cv=cv, scoring='roc_auc').mean()

# SKENARIO 2: BENAR & BERSIH (Menggunakan imblearn Pipeline di dalam CV)
pipe_bersih = ImbPipeline([
    ('smote', SMOTE(random_state=42)),
    ('tree', DecisionTreeClassifier(random_state=42))
])
skor_bersih = cross_val_score(pipe_bersih, X, y, cv=cv, scoring='roc_auc').mean()

print("=== BAHAYA SMOTE DATA LEAKAGE VS IMBLEARN PIPELINE ===")
print(f"Skor ROC-AUC Skenario Bocor (Salah Fatal): {skor_bocor*100:.2f}% (Palsu! Tampak Hebat)")
print(f"Skor ROC-AUC Skenario Bersih (ImbPipeline): {skor_bersih*100:.2f}% (Jujur ~50% Sesuai Data Acak)")`,
        expectedOutput: "Skenario bocor menghasilkan skor palsu ~75-80%, sedangkan imblearn Pipeline jujur menunjukkan skor ~50%.",
        codeExp: "Skrip mendemonstrasikan bahaya SMOTE data leakage jika diaplikasikan sebelum CV vs penggunaan imblearn.pipeline.Pipeline yang bersih.",
        pitfalls: [
          "Menggunakan sklearn.pipeline.Pipeline alih-alih imblearn.pipeline.Pipeline (sklearn pipeline akan melempar TypeError karena tidak mendukung fit_resample).",
          "Melakukan feature scaling setelah SMOTE (feature scaling harus dilakukan sebelum SMOTE atau di dalam pipeline)."
        ],
        refTitle: "Vandewiele, G. et al.: Overly optimistic prediction results on imbalanced data due to data leakage in cross-validation (arXiv:2001.06296, 2021)",
        refUrl: "https://arxiv.org/abs/2001.06296"
      }
    ]
  }
];
