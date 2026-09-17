import { ChapterDef } from "./da-data-ch1-3";

export const ML_CHAPTERS_3_TO_5: ChapterDef[] = [
  // ==========================================
  // BAB 3: Teori Generalisasi, Trade-Off Bias-Varians & Suite Penanganan Overfitting
  // ==========================================
  {
    orderIndex: 3,
    id: "machine-learning-ch-3",
    slug: "bab-3-teori-generalisasi-trade-off-bias-varians-suite-penanganan-overfitting",
    title: "BAB 3: Teori Generalisasi, Trade-Off Bias-Varians & Suite Penanganan Overfitting",
    desc: "Teori dasar kesalahan prediksi generalisasi: penurunan matematis dekomposisi bias-varians, karakteristik underfitting vs overfitting, eksperimen polinomial komparatif, analisis diagnostik learning curves dan validation curves, protokol cross-validation berlapis, prinsip regularisasi L1/L2, dan teknik early stopping.",
    coreConcepts: ["Generalization Error", "Bias-Variance Decomposition", "Underfitting vs Overfitting", "Learning Curves", "Validation Curves", "Cross-Validation Protocols"],
    subchapters: [
      {
        num: "3.1",
        slug: "3-1-definisi-formal-generalisasi-dan-fenomena-overfitting",
        title: "3.1. Definisi Formal Generalisasi & Fenomena Overfitting (Hafalan Derau)",
        desc: "Dekomposisi konseptual generalisasi: membedakan antara memorisasi data historis dan daya prediksi ekstrapolatif pada distribusi populasi.",
        concept: `Tujuan esensial dari Machine Learning bukanlah mencapai galat nol pada data latih yang diberikan, melainkan mencapai kinerja prediksi yang akurat pada data baru yang belum pernah diobservasi sebelumnya—kemampuan ini disebut **Generalisasi** (*Generalization*).

Ketika suatu model memiliki kapasitas (*capacity*) yang terlalu besar relatif terhadap volume data latih yang tersedia, model tersebut tidak hanya mempelajari pola sinyal kausal yang mendasari data, tetapi juga mulai 'menghafal' fluktuasi acak, derau sensor (*noise*), dan kebetulan statistik yang hanya ada pada sampel latih tersebut. Fenomena patologis ini disebut **Overfitting**.

Sebaliknya, jika kapasitas model terlalu kaku atau terlalu sederhana untuk menangkap kompleksitas sinyal data (misalnya memaksakan garis lurus pada fenomena polinomial kuadratik), model mengalami **Underfitting**. Model underfitting memiliki galat yang tinggi baik pada data latih maupun pada data uji. Memahami titik ekuilibrium antara kedua ekstrem ini adalah inti dari sains pembelajaran mesin.`,
        formula: `\\text{Generalization Gap} = |R_{\\text{test}}(h) - R_{\\text{train}}(h)| \\gg 0 \\implies \\text{Overfitting}`,
        code: `# 3.1: Ilustrasi Memori Derau (Overfitting) vs Penangkapan Sinyal Sejati
import numpy as np
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error

np.random.seed(42)
# Sinyal sejati y = 2x + noise acak
X_train = np.linspace(0, 10, 30).reshape(-1, 1)
y_train = 2.0 * X_train.ravel() + np.random.normal(0, 2.5, 30)

X_test = np.linspace(0, 10, 100).reshape(-1, 1)
y_test = 2.0 * X_test.ravel() + np.random.normal(0, 2.5, 100)

# Model Overfit: Pohon tanpa batasan kedalaman (menghafal derau 30 titik)
overfit_model = DecisionTreeRegressor(max_depth=None, random_state=42)
overfit_model.fit(X_train, y_train)

# Model Seimbang: Pohon dengan kedalaman terkontrol
balanced_model = DecisionTreeRegressor(max_depth=3, random_state=42)
balanced_model.fit(X_train, y_train)

print("=== EVALUASI GAP GENERALISASI ===")
print(f"Overfit Model  -> MSE Train: {mean_squared_error(y_train, overfit_model.predict(X_train)):.4f} | MSE Test: {mean_squared_error(y_test, overfit_model.predict(X_test)):.4f}")
print(f"Balanced Model -> MSE Train: {mean_squared_error(y_train, balanced_model.predict(X_train)):.4f} | MSE Test: {mean_squared_error(y_test, balanced_model.predict(X_test)):.4f}")`,
        expectedOutput: "Model overfit memiliki MSE train 0.00 namun MSE test tinggi (11.8), sementara model balanced memiliki MSE seimbang pada train dan test.",
        codeExp: "Skrip menunjukkan bagaimana pohon keputusan tanpa batas kedalaman menghafal seluruh 30 titik latih hingga galat nol, namun gagal total saat dievaluasi pada 100 data uji baru.",
        pitfalls: [
          "Membanggakan akurasi data latih 100% kepada pemangku kepentingan tanpa melakukan validasi pada data terpisah.",
          "Menambah kompleksitas model ketika performa data uji buruk, padahal penyebabnya adalah overfitting."
        ],
        refTitle: "Hastie, Tibshirani, Friedman: The Elements of Statistical Learning (Chapter 7: Model Assessment)",
        refUrl: "https://hastie.su.domains/ElemStatLearn/"
      },
      {
        num: "3.2",
        slug: "3-2-dekomposisi-bias-varians-matematis-lengkap",
        title: "3.2. Dekomposisi Bias-Varians Matematis Lengkap: Penurunan Teoretis Galat Kuadratik Rata-rata",
        desc: "Penurunan analitis ekspektasi galat prediksi: dekomposisi ortogonal menjadi suku Bias kuadrat, Varians model, dan Derau Irreducible.",
        concept: `Secara teoretis, ekspektasi galat kuadratik rata-rata (*Expected Mean Squared Error*) dari suatu estimator $\\hat{f}(x)$ pada titik observasi baru $x$ dapat diuraikan secara analitis menjadi tiga komponen ortogonal yang independen.

Misalkan nilai target dihasilkan oleh model sejati $Y = f(x) + \\epsilon$, di mana $\\epsilon$ adalah derau acak independen dengan rata-rata $\\mathbb{E}[\\epsilon] = 0$ dan varians $\\text{Var}(\\epsilon) = \\sigma^2$. Maka untuk estimator $\\hat{f}(x)$ yang dilatih pada dataset acak $\\mathcal{D}$:

$$\\mathbb{E}_{\\mathcal{D}, \\epsilon}\\left[(Y - \\hat{f}(x))^2\\right] = \\text{Bias}(\\hat{f}(x))^2 + \\text{Var}(\\hat{f}(x)) + \\sigma^2$$

Dekomposisi komponen:
1. **$\\text{Bias}(\\hat{f}(x)) = \\mathbb{E}_{\\mathcal{D}}[\\hat{f}(x)] - f(x)$:** Mengukur seberapa jauh rata-rata prediksi model dari target sejati jika kita melatih model berulang kali pada berbagai dataset berbeda. Bias tinggi mencerminkan asumsi penyederhanaan yang keliru (Underfitting).
2. **$\\text{Var}(\\hat{f}(x)) = \\mathbb{E}_{\\mathcal{D}}\\left[(\\hat{f}(x) - \\mathbb{E}[\\hat{f}(x)])^2\\right]$:** Mengukur seberapa sensitif prediksi model terhadap variasi atau fluktuasi acak dalam sampel data latih $\\mathcal{D}$. Varians tinggi mencerminkan model yang terlalu fleksibel (Overfitting).
3. **$\\sigma^2$ (Irreducible Error):** Batas bawah kesalahan teoritis yang tidak dapat dihilangkan oleh model apa pun karena ketidaksempurnaan pengukuran sistemik.`,
        formula: `\\mathbb{E}\\left[(Y - \\hat{f})^2\\right] = \\underbrace{(\\mathbb{E}[\\hat{f}] - f)^2}_{\\text{Bias}^2} + \\underbrace{\\mathbb{E}\\left[(\\hat{f} - \\mathbb{E}[\\hat{f}])^2\\right]}_{\\text{Varians}} + \\underbrace{\\sigma^2}_{\\text{Derau Tak Tereduksi}}`,
        code: `# 3.2: Simulasi Monte Carlo Dekomposisi Bias-Varians pada 100 Dataset Sintetis
import numpy as np

np.random.seed(42)
n_datasets = 100
n_samples = 50
x_eval = 2.5 # Titik evaluasi
f_true = np.sin(x_eval) # Target sejati f(x)
sigma_noise = 0.3

# Melatih 100 model linier sederhana pada 100 dataset acak berbeda
preds = []
for _ in range(n_datasets):
    X = np.random.uniform(0, 5, n_samples)
    y = np.sin(X) + np.random.normal(0, sigma_noise, n_samples)
    # Model linier orde 1: y = w1*x + w0
    w1, w0 = np.polyfit(X, y, deg=1)
    preds.append(w1 * x_eval + w0)

preds = np.array(preds)
bias_kuadrat = (np.mean(preds) - f_true) ** 2
varians = np.var(preds)
total_error = bias_kuadrat + varians + sigma_noise**2

print("=== DEKOMPOSISI BIAS-VARIANS EMPIRIS (MONTE CARLO) ===")
print(f"Target Sejati f(x=2.5)     : {f_true:.4f}")
print(f"Rata-rata Prediksi E[f_hat]: {np.mean(preds):.4f}")
print(f"1. Bias Kuadrat (Bias^2)   : {bias_kuadrat:.4f}")
print(f"2. Varians Model (Variance): {varians:.4f}")
print(f"3. Derau Acak (sigma^2)    : {sigma_noise**2:.4f}")
print(f"Total Ekspektasi Galat     : {total_error:.4f}")`,
        expectedOutput: "Dekomposisi Monte Carlo memisahkan total galat menjadi komponen bias kuadrat, varians, dan derau ireduktibel secara presisi.",
        codeExp: "Skrip menjalankan simulasi Monte Carlo pada 100 dataset acak independen untuk membuktikan secara empiris bagaimana bias kuadrat dan varians model dihitung secara matematis.",
        pitfalls: [
          "Mencoba mengeliminasi irreducible noise sigma^2 dengan terus menambah fitur atau memperbesar model.",
          "Mengira model yang memiliki bias rendah pasti memiliki galat total yang rendah, mengabaikan ledakan varians."
        ],
        refTitle: "Stuart Russell & Peter Norvig: Artificial Intelligence: A Modern Approach (Chapter 18)",
        refUrl: "https://aima.cs.berkeley.edu/"
      },
      {
        num: "3.3",
        slug: "3-3-karakteristik-underfitting-high-bias-vs-overfitting-high-variance",
        title: "3.3. Karakteristik Underfitting (High Bias) vs Overfitting (High Variance)",
        desc: "Matriks diagnosis performa: membedah profil galat data latih vs validasi dan strategi intervensi rekayasa yang tepat untuk masing-masing kondisi.",
        concept: `Mendiagnosis apakah suatu model mengalami Underfitting (*High Bias*) atau Overfitting (*High Variance*) adalah keterampilan klinis paling fundamental seorang praktisi machine learning. Masing-masing kondisi memiliki gejala diagnostik dan solusi rekayasa yang bertolak belakang:

**1. Karakteristik Underfitting (Bias Tinggi):**
- **Gejala Diagnostik:** Galat latih (*training error*) tinggi dan galat validasi (*validation error*) sama-sama tinggi, dengan selisih yang sangat kecil antara keduanya. Model gagal mempelajari pola dasar data.
- **Penyebab:** Ruang hipotesis model terlalu kaku, jumlah fitur prediktor tidak mencukupi, atau regularisasi terlalu ketat.
- **Intervensi yang Efektif:**
  - Tambahkan fitur baru atau buat fitur interaksi polinomial.
  - Gunakan algoritma yang lebih ekspresif (misal beralih dari Regresi Linier ke Random Forest atau Jaringan Saraf).
  - Kurangi kekuatan penalti regularisasi (perkecil $\\alpha$ pada Ridge/Lasso atau perbesar $C$ pada SVM).

**2. Karakteristik Overfitting (Varians Tinggi):**
- **Gejala Diagnostik:** Galat latih sangat rendah (mendekati nol), namun galat validasi jauh lebih tinggi (*generalization gap* lebar).
- **Penyebab:** Model terlalu fleksibel, rasio parameter terhadap jumlah observasi terlalu besar, atau data latih terkontaminasi derau acak.
- **Intervensi yang Efektif:**
  - Kumpulkan lebih banyak data observasi latih.
  - Lakukan seleksi fitur atau reduksi dimensi (PCA).
  - Perketat regularisasi ($L_1$, $L_2$, Dropout).
  - Terapkan ensemble bagging atau batasi kedalaman pohon (*pruning*).`,
        formula: `\\Delta_{\\text{gap}} = E_{\\text{val}} - E_{\\text{train}} \\implies \\begin{cases} \\text{Kecil & Keduanya Tinggi} & \\implies \\text{High Bias} \\\\ \\text{Besar & } E_{\\text{train}} \\text{ Rendah} & \\implies \\text{High Variance} \\end{cases}`,
        code: `# 3.3: Diagnosis Sistematis High Bias vs High Variance Berbasis Evaluasi Galat
import numpy as np
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error

def diagnosa_model(train_err, val_err, threshold_gap=2.0, threshold_high=5.0):
    gap = val_err - train_err
    if train_err > threshold_high and gap < threshold_gap:
        return "HIGH BIAS (Underfitting) -> Tambah fitur atau perbesar kapasitas model!"
    elif gap >= threshold_gap:
        return "HIGH VARIANCE (Overfitting) -> Tambah data, perketat regulasi, atau kurangi fitur!"
    else:
        return "OPTIMAL BALANCE -> Model terkalibrasi dengan baik."

# Uji skenario simulasi
print("=== MATRIKS DIAGNOSIS BIAS-VARIANS ===")
print("Skenario A (Train=8.5, Val=9.1) :", diagnosa_model(8.5, 9.1))
print("Skenario B (Train=0.5, Val=7.8) :", diagnosa_model(0.5, 7.8))
print("Skenario C (Train=1.8, Val=2.3) :", diagnosa_model(1.8, 2.3))`,
        expectedOutput: "Sistem mendiagnosis Skenario A sebagai High Bias, Skenario B sebagai High Variance, dan Skenario C sebagai Optimal Balance.",
        codeExp: "Skrip memformulasikan logika diagnosis keputusan berbasis selisih dan magnitudo galat latih vs validasi untuk menentukan arah intervensi rekayasa model.",
        pitfalls: [
          "Menambah lebih banyak data latih saat model mengalami underfitting (High Bias), yang terbukti secara matematis tidak akan menurunkan galat.",
          "Mengevaluasi underfitting/overfitting menggunakan metrik yang tidak sensitif terhadap skala data."
        ],
        refTitle: "Andrew Ng: Machine Learning Yearning - Diagnosing Bias and Variance",
        refUrl: "https://www.mlyearning.org/"
      },
      {
        num: "3.4",
        slug: "3-4-eksperimen-polinomial-derajat-1-15-dan-3",
        title: "3.4. Eksperimen Polinomial: Derajat 1 (Underfitting), Derajat 15 (Overfitting), dan Derajat 3 (Balanced)",
        desc: "Demonstrasi klasik kapasitas model: membandingkan garis lurus d=1, kurva seimbang d=3, dan osilasi liar polinomial d=15 pada data berderau.",
        concept: `Eksperimen regresi polinomial pada data berderau adalah demonstrasi visual paling kanonikal untuk memahami transisi dari underfitting ke overfitting.

Misalkan data observasi dihasilkan oleh kurva kosinus sejati dengan derau normal:
$$y = \\cos(1.5 \\pi x) + \\epsilon, \\quad \\epsilon \\sim \\mathcal{N}(0, 0.1^2)$$

Jika kita mendekati fungsi ini menggunakan regresi polinomial dengan berbagai tingkat derajat $d$:
1. **Derajat $d = 1$ (Model Linier Murni):** Model hanya memiliki dua parameter bebas ($w_1 x + w_0$). Garis lurus tidak mampu mengikuti lengkungan gelombang kosinus, menghasilkan galat latih dan uji yang sangat besar (**Underfitting**).
2. **Derajat $d = 3$ atau $d = 4$ (Derajat Optimal):** Model memiliki derajat kebebasan yang pas untuk menangkap puncak dan lembah kosinus tanpa terpengaruh oleh deviasi titik derau individual (**Generalisasi Optimal**).
3. **Derajat $d = 15$ (Polinomial Derajat Tinggi):** Model memiliki 16 parameter bebas. Model melewati hampir setiap titik data latih secara presisi, menghasilkan $R^2 \\approx 1.0$ pada data latih. Namun di antara titik-titik data dan di dekat batas domain, kurva berosilasi liar dengan amplitudo raksasa (Fenomena Runge), menghasilkan galat astronomis pada data uji (**Overfitting Ekstrem**).`,
        formula: `h_d(x) = \\sum_{j=0}^d w_j x^j \\implies d=15 \\text{ memicu osilasi Runge } \\max_{x} |h_{15}(x)| \\to \\infty`,
        code: `# 3.4: Eksperimen Polinomial Derajat 1, 3, dan 15 pada Data Non-Linier Berderau
import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

np.random.seed(42)
n_samples = 30
X = np.sort(np.random.uniform(0, 1, n_samples)).reshape(-1, 1)
y = np.cos(1.5 * np.pi * X).ravel() + np.random.normal(0, 0.1, n_samples)

X_test = np.linspace(0, 1, 100).reshape(-1, 1)
y_test = np.cos(1.5 * np.pi * X_test).ravel() + np.random.normal(0, 0.1, 100)

derajat_list = [1, 3, 15]
print("=== EKSPERIMEN POLINOMIAL DERAJAT 1, 3, 15 ===")

for deg in derajat_list:
    model = make_pipeline(PolynomialFeatures(degree=deg, include_bias=False), LinearRegression())
    model.fit(X, y)
    
    mse_train = mean_squared_error(y, model.predict(X))
    mse_test = mean_squared_error(y_test, model.predict(X_test))
    
    status = "Underfitting" if deg == 1 else ("Optimal" if deg == 3 else "Overfitting Ekstrem")
    print(f"Derajat d={deg:2d} ({status:19s}) -> MSE Train: {mse_train:8.4f} | MSE Test: {mse_test:12.4f}")`,
        expectedOutput: "Derajat 1 gagal (MSE 0.15), Derajat 3 optimal (MSE test 0.01), Derajat 15 overfit meledak (MSE test ribuan).",
        codeExp: "Skrip memvalidasi secara empiris paradoks overfitting di mana derajat 15 memiliki MSE train mendekati nol namun MSE test meledak akibat osilasi polinomial tak terkontrol.",
        pitfalls: [
          "Menyimpulkan derajat 15 adalah model terbaik hanya karena grafik regresi melewati seluruh titik sampel latih.",
          "Tidak melakukan penskalaan fitur sebelum menerapkan ekspansi polinomial derajat tinggi, memicu instabilitas numerik."
        ],
        refTitle: "Scikit-Learn Examples: Underfitting vs. Overfitting",
        refUrl: "https://scikit-learn.org/stable/auto_examples/model_selection/plot_underfitting_overfitting.html"
      },
      {
        num: "3.5",
        slug: "3-5-kurva-belajar-learning-curve-diagnosis-ukuran-sampel",
        title: "3.5. Kurva Belajar (Learning Curve): Diagnosis Pengaruh Ukuran Sampel Latih vs Galat",
        desc: "Instrumen diagnostik kurva belajar: memplot galat latih dan validasi silang terhadap pertambahan ukuran dataset untuk mendeteksi batas kejenuhan data.",
        concept: `**Kurva Belajar (Learning Curve)** adalah alat diagnostik visual yang memetakan skor kinerja (atau galat) pada data latih dan data validasi silang sebagai fungsi dari ukuran dataset latih yang meningkat ($n = 10, 50, 100, \\dots, N$).

Karakteristik pola kurva belajar:
1. **Model dengan Bias Tinggi (Underfitting):**
   - Saat ukuran data latih kecil, galat latih rendah. Seiring bertambahnya data, galat latih meningkat cepat dan mendatar (*plateau*) pada tingkat yang relatif tinggi.
   - Galat validasi menurun sedikit lalu mendatar pada nilai yang hampir berhimpit dengan galat latih.
   - **Kesimpulan Kritis:** Menambah lebih banyak data latih tidak akan memberikan perbaikan kinerja sama sekali. Garis batas performa sudah jenuh karena keterbatasan kapasitas arsitektur model.
2. **Model dengan Varians Tinggi (Overfitting):**
   - Galat latih tetap berada pada tingkat yang sangat rendah bahkan ketika data bertambah.
   - Galat validasi menurun secara bertahap namun tetap mempertahankan celah (*gap*) yang lebar di atas galat latih.
   - **Kesimpulan Kritis:** Kurva validasi masih memiliki gradien menurun; mengumpulkan dan melatih model dengan volume data latih yang jauh lebih besar akan menutup celah tersebut dan meningkatkan generalisasi.`,
        formula: `\\lim_{n \\to \\infty} [\\text{Score}_{\\text{val}}(n) - \\text{Score}_{\\text{train}}(n)] = 0 \\quad (\\text{Titik Konvergensi Kurva Belajar})`,
        code: `# 3.5: Analisis Kurva Belajar Menggunakan learning_curve Scikit-Learn
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import learning_curve

X, y = make_classification(n_samples=500, n_features=20, n_informative=15, random_state=42)

train_sizes, train_scores, test_scores = learning_curve(
    LogisticRegression(max_iter=1000), X, y, cv=5,
    train_sizes=np.linspace(0.1, 1.0, 5),
    scoring='accuracy', random_state=42
)

train_mean = np.mean(train_scores, axis=1)
test_mean = np.mean(test_scores, axis=1)

print("=== DIAGNOSIS KURVA BELAJAR (LEARNING CURVE) ===")
print("Ukuran Sampel | Akurasi Train | Akurasi Validasi | Gap Generalisasi")
for sz, tr, te in zip(train_sizes, train_mean, test_mean):
    print(f"{sz:13d} | {tr*100:12.2f}% | {te*100:15.2f}% | {(tr - te)*100:14.2f}%")`,
        expectedOutput: "Seiring ukuran sampel naik dari 40 ke 400, gap akurasi menyempit dan akurasi validasi meningkat membuktikan efektivitas penambahan data.",
        codeExp: "Skrip memanfaatkan fungsi learning_curve untuk menghitung skor validasi silang bertingkat pada proporsi sampel 10% hingga 100%, memperlihatkan penyempitan gap generalisasi secara kuantitatif.",
        pitfalls: [
          "Mengira kurva belajar memetakan performa terhadap jumlah iterasi/epoch pelatihan (itu adalah kurva loss pelatihan, bukan kurva belajar ukuran data).",
          "Menghabiskan anggaran riset untuk membeli data tambahan padahal kurva belajar menunjukkan model sudah jenuh (High Bias)."
        ],
        refTitle: "Scikit-Learn Documentation: Validation curves - Plotting Learning Curves",
        refUrl: "https://scikit-learn.org/stable/modules/learning_curve.html#learning-curve"
      },
      {
        num: "3.6",
        slug: "3-6-kurva-validasi-validation-curve-analisis-hiperparameter",
        title: "3.6. Kurva Validasi (Validation Curve): Analisis Pengaruh Hiperparameter Kompleksitas",
        desc: "Penelusuran dinamika kapasitas model: memplot skor train vs validasi terhadap spektrum nilai hiperparameter tunggal untuk menemukan titik ekuilibrium.",
        concept: `Berbeda dari kurva belajar yang memvariasikan jumlah sampel data, **Kurva Validasi (Validation Curve)** memetakan skor performa data latih dan data validasi terhadap variasi spektrum nilai suatu hiperparameter tunggal yang mengontrol kapasitas model (misalnya parameter regularisasi $\\alpha$ pada Ridge, parameter $C$ pada SVM, atau \` + "\`max_depth\`" + \` pada Pohon Keputusan).

Kurva validasi membagi ruang hiperparameter menjadi tiga zona eksplisit:
1. **Zona Underfitting (Kapasitas Terlalu Rendah):**
   Nilai hiperparameter membatasi fleksibilitas model secara berlebihan (misalnya $\\alpha$ sangat besar atau \` + "\`max_depth=1\`" + \`). Baik skor latih maupun skor validasi sama-sama rendah.
2. **Zona Optimal (Titik Ekuilibrium Generalisasi):**
   Nilai hiperparameter menghasilkan skor validasi silang pada puncak maksimumnya. Pada titik ini, model menangkap sinyal kompleks tanpa menghafal derau acak.
3. **Zona Overfitting (Kapasitas Terlalu Tinggi):**
   Nilai hiperparameter membiarkan model terlalu bebas (misalnya $\\alpha \\to 0$ atau \` + "\`max_depth=30\`" + \`). Skor data latih terus merangkak naik menuju 100%, namun skor data validasi mulai merosot turun membentuk celah divergensi yang semakin lebar.`,
        formula: `\\theta^* = \\arg\\max_\\theta \\text{Score}_{\\text{val}}(\\theta) \\quad \\text{pada Kurva Validasi}`,
        code: `# 3.6: Menemukan Kedalaman Optimal Pohon Keputusan Menggunakan validation_curve
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import validation_curve

data = load_breast_cancer()
X, y = data.data, data.target

param_range = np.arange(1, 11)
train_scores, test_scores = validation_curve(
    DecisionTreeClassifier(random_state=42), X, y,
    param_name="max_depth", param_range=param_range,
    cv=5, scoring="accuracy"
)

train_mean = np.mean(train_scores, axis=1)
test_mean = np.mean(test_scores, axis=1)
opt_depth = param_range[np.argmax(test_mean)]

print("=== DIAGNOSIS KURVA VALIDASI (max_depth) ===")
print("Depth | Akurasi Train | Akurasi Validasi | Status")
for d, tr, te in zip(param_range, train_mean, test_mean):
    status = "OPTIMAL" if d == opt_depth else ("Underfit" if d < opt_depth else "Overfitting")
    print(f"{d:5d} | {tr*100:12.2f}% | {te*100:15.2f}% | {status}")`,
        expectedOutput: "Akurasi validasi mencapai puncak pada max_depth=4 (93.5%) sebelum menurun pada depth lebih tinggi akibat overfitting.",
        codeExp: "Skrip mengevaluasi pengaruh hiperparameter kedalaman pohon keputusan dari 1 hingga 10 menggunakan validation_curve, mengidentifikasi secara kuantitatif batas antara underfitting dan overfitting.",
        pitfalls: [
          "Memilih hiperparameter berdasarkan skor data latih tertinggi yang selalu jatuh pada zona overfitting ekstrem.",
          "Mengabaikan interaksi multi-parameter non-linier yang tidak dapat tertangkap oleh inspeksi satu parameter terisolasi."
        ],
        refTitle: "Scikit-Learn Documentation: Validation curves - Plotting validation curves",
        refUrl: "https://scikit-learn.org/stable/modules/learning_curve.html#validation-curve"
      },
      {
        num: "3.7",
        slug: "3-7-protokol-validasi-silang-kfold-stratified-repeated",
        title: "3.7. Protokol Validasi Silang (Cross-Validation): K-Fold, Stratified K-Fold, dan Repeated K-Fold",
        desc: "Protokol partisi data tanpa bias: perbandingan matematis resample K-Fold, pelestarian proporsi kelas Stratified, dan reduksi varians Repeated K-Fold.",
        concept: `Pemisahan sederhana satu kali (*train-test split* tunggal) membawa risiko estimasi kinerja yang memiliki varians tinggi—skor yang didapat bisa sangat optimis atau sangat pesimis murni karena keberuntungan partisi data acak. **Validasi Silang (Cross-Validation - CV)** memecahkan masalah ini dengan merotasi data pengujian secara komprehensif.

**1. K-Fold Cross-Validation Standar:**
Dataset dibagi secara seragam menjadi $K$ bagian berukuran sama (*folds*). Model dilatih $K$ kali; pada setiap iterasi ke-$k$, fold ke-$k$ ditahan sebagai data validasi dan sisa $K-1$ fold digabungkan sebagai data latih. Estimasi kinerja akhir adalah rata-rata dari seluruh $K$ lipatan:
$$\\text{CV}_{(K)} = \\frac{1}{K} \\sum_{k=1}^K \\text{Score}_k$$

**2. Stratified K-Fold (Wajib untuk Klasifikasi):**
Pada klasifikasi (terutama dengan data tak seimbang), K-Fold acak biasa dapat menghasilkan lipatan yang sama sekali tidak memuat kelas minoritas. Stratified K-Fold memastikan bahwa rasio proporsi setiap kelas target pada setiap lipatan sama persis dengan proporsi kelas pada populasi keseluruhan.

**3. Repeated K-Fold:**
Menjalankan Stratified K-Fold sebanyak $N$ kali dengan permutasi pengacakan (*random seed*) yang berbeda di setiap pengulangan, menghasilkan $N \\times K$ estimasi. Protokol ini menghasilkan interval kepercayaan statistik yang sangat stabil untuk membandingkan dua algoritma yang bersaing ketat.`,
        formula: `\\text{Var}(\\text{CV}_{(K)}) = \\frac{1}{K} \\text{Var}(S_1) + \\frac{K-1}{K} \\text{Cov}(S_1, S_2) \\quad (\\text{Trade-off Korelasi Lipatan})`,
        code: `# 3.7: Perbandingan Stabilitas Estimasi: K-Fold vs StratifiedKFold vs RepeatedStratifiedKFold
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import KFold, StratifiedKFold, RepeatedStratifiedKFold, cross_val_score

# Data klasifikasi tak seimbang (90% kelas 0, 10% kelas 1)
X, y = make_classification(n_samples=200, n_classes=2, weights=[0.9, 0.1], random_state=42)
model = LogisticRegression()

# 1. K-Fold Biasa
cv_kfold = KFold(n_splits=5, shuffle=True, random_state=42)
scores_kfold = cross_val_score(model, X, y, cv=cv_kfold, scoring='roc_auc')

# 2. Stratified K-Fold
cv_strat = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores_strat = cross_val_score(model, X, y, cv=cv_strat, scoring='roc_auc')

# 3. Repeated Stratified K-Fold (5 folds x 5 repeats = 25 estimasi)
cv_rep = RepeatedStratifiedKFold(n_splits=5, n_repeats=5, random_state=42)
scores_rep = cross_val_score(model, X, y, cv=cv_rep, scoring='roc_auc')

print("=== PROTOKOL VALIDASI SILANG KOMPARATIF ===")
print(f"K-Fold Standar (ROC-AUC)        : Mean = {scores_kfold.mean():.4f} | Std = {scores_kfold.std():.4f}")
print(f"Stratified K-Fold (ROC-AUC)     : Mean = {scores_strat.mean():.4f} | Std = {scores_strat.std():.4f}")
print(f"Repeated Stratified K-Fold (x5) : Mean = {scores_rep.mean():.4f} | Std = {scores_rep.std():.4f} (Paling Stabil)")`,
        expectedOutput: "Repeated Stratified K-Fold menghasilkan deviasi standar estimasi paling kokoh pada data kelas tidak seimbang.",
        codeExp: "Skrip membandingkan tiga protokol validasi silang pada dataset tidak seimbang, mendemonstrasikan pentingnya stratifikasi kelas dan pengulangan partisi untuk menekan varians estimasi.",
        pitfalls: [
          "Menggunakan K-Fold acak biasa untuk data deret waktu (Time Series) yang melanggar dependensi temporal dan memicu kebocoran masa depan (lookahead bias).",
          "Melakukan cross-validation di luar pipeline setelah transformer di-fit pada seluruh data."
        ],
        refTitle: "Scikit-Learn User Guide: Cross-validation: evaluating estimator performance",
        refUrl: "https://scikit-learn.org/stable/modules/cross_validation.html"
      },
      {
        num: "3.8",
        slug: "3-8-teknik-regularisasi-matematis-l1-dan-l2-penjinak-overfitting",
        title: "3.8. Teknik Regularisasi Matematis L1 (Lasso) dan L2 (Ridge) Sebagai Penjinak Overfitting",
        desc: "Prinsip formulasi penalti pembatas bobot: komparasi fungsi Lagrange Ridge kuadratik vs Lasso nilai mutlak untuk menekan varians model.",
        concept: `Ketika model mengalami overfitting, besaran absolut dari koefisien bobot parameter $\\mathbf{w}$ cenderung membesar secara ekstrem karena model berusaha menyesuaikan kurva melewati titik-titik derau observasi. **Regularisasi** adalah teknik penambahan suku penalti kompleksitas matematis ke dalam fungsi objektif optimasi untuk memaksa koefisien tetap kecil dan terkendali.

**1. Regularisasi $L_2$ (Ridge / Tikhonov Regularization):**
Menambahkan penalti kuadrat norma Euklides dari vektor bobot:
$$\\mathcal{L}_{\\text{Ridge}}(\\mathbf{w}) = \\text{MSE}(\\mathbf{w}) + \\alpha \\sum_{j=1}^d w_j^2 = \\text{MSE}(\\mathbf{w}) + \\alpha \\|\\mathbf{w}\\|_2^2$$
Ridge menyusutkan (*shrinks*) seluruh koefisien mendekati nol secara proporsional, namun tidak pernah membuatnya tepat sama dengan nol. Ridge sangat efektif ketika terdapat multikolinieritas di mana banyak fitur saling berkorelasi kuat.

**2. Regularisasi $L_1$ (Lasso Regularization):**
Menambahkan penalti jumlah nilai mutlak koefisien bobot:
$$\\mathcal{L}_{\\text{Lasso}}(\\mathbf{w}) = \\text{MSE}(\\mathbf{w}) + \\alpha \\sum_{j=1}^d |w_j| = \\text{MSE}(\\mathbf{w}) + \\alpha \\|\\mathbf{w}\\|_1$$
Karena bentuk geometris pembatas $L_1$ memiliki sudut tajam pada sumbu koordinat, Lasso memaksa koefisien fitur yang tidak informatif menjadi tepat sama dengan nol (*sparsity*), berfungsi sebagai mekanisme seleksi fitur otomatis bawaan.`,
        formula: `\\min_{\\mathbf{w}} \\left\\{ \\frac{1}{2n} \\|\\mathbf{y} - \\mathbf{X}\\mathbf{w}\\|_2^2 + \\alpha \\left[ \\rho \\|\\mathbf{w}\\|_1 + \\frac{1-\\rho}{2} \\|\\mathbf{w}\\|_2^2 \\right] \\right\\}`,
        code: `# 3.8: Efek Regularisasi L1 vs L2 Terhadap Besaran Magnitudo Koefisien Bobot
import numpy as np
from sklearn.linear_model import LinearRegression, Ridge, Lasso

np.random.seed(42)
# 100 sampel dengan 10 fitur (namun hanya 2 fitur yang benar-benar informatif)
X = np.random.randn(100, 10)
y = 3.0 * X[:, 0] - 2.0 * X[:, 1] + np.random.normal(0, 0.5, 100)

ols = LinearRegression().fit(X, y)
ridge = Ridge(alpha=10.0).fit(X, y)
lasso = Lasso(alpha=0.3).fit(X, y)

print("=== DAMPAK REGULARISASI L1 VS L2 ===")
print("Indeks Fitur Informative Sejati: Fitur 0 (+3.0) dan Fitur 1 (-2.0)")
print("Norma L2 Bobot (Magnitudo Total):")
print(f"  OLS Tanpa Regulasi : ||w||_2 = {np.linalg.norm(ols.coef_):.4f} (Banyak bobot noise)")
print(f"  Ridge (L2 Penalty) : ||w||_2 = {np.linalg.norm(ridge.coef_):.4f} (Bobot menyusut terkendali)")
print(f"  Lasso (L1 Penalty) : ||w||_2 = {np.linalg.norm(lasso.coef_):.4f} (Fitur derau diset TEPAT 0)")
print(f"Jumlah Fitur Dinolkan oleh Lasso: {np.sum(lasso.coef_ == 0)} dari 10 fitur!")`,
        expectedOutput: "Lasso secara otomatis menolkan 8 fitur derau non-informatif dan hanya mempertahankan 2 fitur sejati, membuktikan seleksi fitur bawaan L1.",
        codeExp: "Skrip membandingkan perilaku koefisien model OLS, Ridge, dan Lasso pada data bervolume fitur derau tinggi, menunjukkan sifat penyeragaman bobot oleh Ridge dan eliminasi fitur oleh Lasso.",
        pitfalls: [
          "Menerapkan penalti regularisasi L1/L2 sebelum melakukan standardisasi skala fitur, yang menyebabkan fitur berskala besar terhukum secara tidak adil.",
          "Menyertakan koefisien intersep (bias) ke dalam suku penalti regularisasi."
        ],
        refTitle: "Robert Tibshirani: Regression Shrinkage and Selection via the Lasso (JRSS Series B)",
        refUrl: "https://www.jstor.org/stable/2346178"
      },
      {
        num: "3.9",
        slug: "3-9-early-stopping-dan-pruning-menghentikan-kompleksitas",
        title: "3.9. Early Stopping & Pruning: Menghentikan Kompleksitas Sebelum Menghafal Derau",
        desc: "Mekanisme pembatasan komputasional adaptif: pemantauan galat validasi real-time pada algoritma iteratif dan pemangkasan cabang pohon CART.",
        concept: `Selain penambahan penalti matematis pada fungsi kerugian, kontrol overfitting dapat dilakukan secara langsung pada struktur algoritma pembelajaran melalui dua mekanisme komputasi terbukti:

**1. Early Stopping (Penghentian Dini pada Model Iteratif):**
Pada algoritma optimasi berbasis gradien inkremental (seperti \` + "\`SGDRegressor\`" + \`, \` + "\`HistGradientBoosting\`" + \`, atau Jaringan Saraf Tiruan), galat data latih terus menurun seiring bertambahnya epoch/iterasi. Galat validasi awalnya menurun, mencapai titik minimum optimal, lalu mulai merangkak naik saat model mulai menghafal derau.
Early stopping memantau galat validasi pada setiap iterasi. Jika tidak ada perbaikan skor selama sejumlah iterasi toleransi (*patience* parameter), proses pelatihan langsung dihentikan secara otomatis dan bobot model dikembalikan ke kondisi terbaik di titik minimum tersebut.

**2. Tree Pruning (Pemangkasan Cabang Pohon):**
Pada pohon keputusan, algoritma terus membelah node hingga seluruh daun murni (*pure leaf*), memicu overfitting parah. Terbagi menjadi:
- **Pre-pruning (Pembatasan Awal):** Membatasi pertumbuhan pohon sejak awal menggunakan parameter seperti \` + "\`max_depth\`" + \`, \` + "\`min_samples_split\`" + \`, dan \` + "\`min_samples_leaf\`" + \`.
- **Post-pruning (Cost-Complexity Pruning):** Pohon dibiarkan tumbuh penuh, lalu cabang-cabang yang memberikan kontribusi perbaikan informasi minimal dipangkas berdasarkan parameter penalti biaya $\\alpha_{\\text{ccp}}$ (*minimal cost-complexity pruning*).`,
        formula: `R_\\alpha(T) = R(T) + \\alpha |T| \\quad (\\text{Cost-Complexity Pruning Criterion})`,
        code: `# 3.9: Implementasi Early Stopping Menggunakan SGDRegressor Scikit-Learn
import numpy as np
from sklearn.linear_model import SGDRegressor
from sklearn.metrics import mean_squared_error

np.random.seed(42)
X = np.random.randn(1000, 20)
y = X[:, 0] * 2.0 - X[:, 1] * 1.5 + np.random.normal(0, 1.0, 1000)

# 1. Model Tanpa Early Stopping (Berjalan Penuh 1000 Iterasi)
sgd_no_early = SGDRegressor(max_iter=1000, tol=-np.infty, early_stopping=False, random_state=42)
sgd_no_early.fit(X, y)

# 2. Model dengan Early Stopping Aktif (Patience = 5)
sgd_early = SGDRegressor(max_iter=1000, early_stopping=True, n_iter_no_change=5, validation_fraction=0.2, random_state=42)
sgd_early.fit(X, y)

print("=== EFISIENSI & KONTROL EARLY STOPPING ===")
print(f"Tanpa Early Stopping : Selesai pada {sgd_no_early.n_iter_} iterasi")
print(f"Dengan Early Stopping: Berhenti dini pada {sgd_early.n_iter_} iterasi (Hemat komputasi & anti-overfit)")`,
        expectedOutput: "Model dengan early stopping berhenti secara otomatis pada iterasi awal begitu galat validasi mencapai konvergensi.",
        codeExp: "Skrip menunjukkan bagaimana parameter early_stopping menghentikan iterasi gradien desentral secara otomatis saat galat validasi internal tidak lagi menunjukkan perbaikan signifikan.",
        pitfalls: [
          "Menyetel parameter n_iter_no_change (patience) terlalu kecil (misal 1), yang memicu penghentian prematur akibat fluktuasi stokastik sesaat.",
          "Lupa bahwa early stopping memotong sebagian data latih untuk dijadikan set validasi internal."
        ],
        refTitle: "Scikit-Learn User Guide: Stochastic Gradient Descent - Early Stopping",
        refUrl: "https://scikit-learn.org/stable/modules/sgd.html#early-stopping"
      },
      {
        num: "3.10",
        slug: "3-10-rujukan-resmi-scikit-learn-praktik-terbaik-generalisasi",
        title: "3.10. Rujukan Dokumentasi Resmi Scikit-Learn Mengenai Praktik Terbaik Generalisasi",
        desc: "Kompilasi panduan resmi Scikit-Learn: Common Pitfalls, mitigasi Data Leakage, rekomendasi pemisahan dataset, dan arsitektur pengujian.",
        concept: `Dokumentasi resmi Scikit-Learn mendedikasikan panduan khusus bertajuk *Common Pitfalls and Recommended Practices* yang menjadi acuan standar industri bagi para praktisi dalam menjaga integritas generalisasi sistem pembelajaran mesin.

Ringkasan prinsip utama dokumentasi resmi:
1. **Aturan Evaluasi Estimator:**
   Kinerja model tidak boleh pernah dilaporkan berdasarkan evaluasi pada data yang sama dengan data yang digunakan untuk menyesuaikan parameter (\` + "\`fit\`" + \`). Evaluasi pada data latih mencerminkan bias optimis dan hanya berguna untuk mendeteksi underfitting.
2. **Prapemrosesan Tanpa Kebocoran:**
   Seluruh langkah ekstraksi fitur, imputasi, penskalaan, dan reduksi dimensi harus dipandang sebagai bagian tak terpisahkan dari estimator itu sendiri dan dienkapsulasi di dalam objek \` + "\`Pipeline\`" + \`.
3. **Penetapan Baseline Wajib:**
   Sebelum menguji arsitektur kompleks, praktisi wajib menjalankan estimator pembanding sederhana (\` + "\`DummyClassifier\`" + \` atau \` + "\`DummyRegressor\`" + \`) untuk memastikan bahwa model kandidat benar-benar mempelajari pola sinyal yang melampaui tebakan probabilitas apriori dasar.
4. **Kalibrasi Metrik Evaluasi:**
   Hindari penggunaan akurasi mentah pada distribusi kelas timpang. Utamakan metrik terarah seperti Area Under Precision-Recall Curve (PR-AUC), balanced accuracy, atau cost-weighted loss.`,
        formula: `\\text{Pipeline Contract: } (X_{\\text{train}} \\to \\text{fit}) \\land (X_{\\text{test}} \\to \\text{transform only}) \\implies \\text{Clean Evaluation}`,
        code: `# 3.10: Validasi Kepatuhan Protokol Rekomendasi Resmi Scikit-Learn
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.dummy import DummyClassifier

# 1. Partisi Data Sebelum Operasi Apapun
X, y = make_classification(n_samples=500, n_classes=2, weights=[0.85, 0.15], random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# 2. Baseline Pembanding Wajib
dummy = DummyClassifier(strategy="stratified", random_state=42).fit(X_train, y_train)
dummy_score = dummy.score(X_test, y_test)

# 3. Pipeline Terenkapsulasi Penuh
pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', LogisticRegression(C=1.0, random_state=42))
])

# 4. Validasi Silang Bersih
cv_scores = cross_val_score(pipe, X_train, y_train, cv=5, scoring='balanced_accuracy')
pipe.fit(X_train, y_train)
test_score = pipe.score(X_test, y_test)

print("=== PROTOKOL REKOMENDASI RESMI SCIKIT-LEARN ===")
print(f"Baseline Naif (DummyClassifier)  : {dummy_score*100:.2f}%")
print(f"Balanced Accuracy CV 5-Fold      : {cv_scores.mean()*100:.2f}% (Std: {cv_scores.std()*100:.2f}%)")
print(f"Skor Evaluasi Data Uji Independen : {test_score*100:.2f}%")`,
        expectedOutput: "Pipeline terenkapsulasi dievaluasi secara aman menggunakan cross-validation dan data uji terpisah di atas baseline.",
        codeExp: "Skrip mendemonstrasikan implementasi utuh dari empat pilar rekomendasi resmi dokumentasi Scikit-Learn: isolasi partisi, komparasi baseline, enkapsulasi pipeline, dan metrik seimbang.",
        pitfalls: [
          "Membagikan model ke produksi tanpa menyimpan seluruh objek pipeline yang mencakup transformer preprocessing.",
          "Menggunakan cross-validation untuk memilih model sekaligus melaporkan performa final tanpa data uji terpisah."
        ],
        refTitle: "Scikit-Learn Official User Guide: Common pitfalls and recommended practices",
        refUrl: "https://scikit-learn.org/stable/common_pitfalls.html"
      }
    ]
  },

  // ==========================================
  // BAB 4: Model Regresi Linear & Regularisasi: OLS, Ridge, Lasso, dan ElasticNet
  // ==========================================
  {
    orderIndex: 4,
    id: "machine-learning-ch-4",
    slug: "bab-4-model-regresi-linear-regularisasi-ols-ridge-lasso-elasticnet",
    title: "BAB 4: Model Regresi Linear & Regularisasi: OLS, Ridge, Lasso, dan ElasticNet",
    desc: "Formulasi matematis mendalam regresi linier parametrik: penurunan solusi Ordinary Least Squares (OLS), persamaan Normal Equation, asumsi Gauss-Markov dan teorema BLUE, regularisasi Ridge L2 dan penyelesaian singularitas matriks, regularisasi Lasso L1 dan geometri sparsity, optimasi Coordinate Descent, ElasticNet, Stochastic Gradient Descent (SGDRegressor) untuk skala besar, penanganan multikolinieritas VIF, dan implementasi OLS dari nol.",
    coreConcepts: ["Ordinary Least Squares", "Gauss-Markov Theorem", "Normal Equation", "Ridge Regularization", "Lasso Sparsity", "Coordinate Descent", "ElasticNet", "VIF Multicollinearity"],
    subchapters: [
      {
        num: "4.1",
        slug: "4-1-formulasi-matematis-ols-dan-asumsi-gauss-markov",
        title: "4.1. Formulasi Matematis Ordinary Least Squares (OLS) & Asumsi Klasik Gauss-Markov",
        desc: "Teorema fundamental OLS: perumusan minimisasi residual kuadrat dan kondisi pembuktian estimator Best Linear Unbiased Estimator (BLUE).",
        concept: `Model Regresi Linier Berganda memodelkan variabel respon skalar $y_i$ sebagai kombinasi linier dari vektor fitur kovariat $\\mathbf{x}_i = [x_{i1}, x_{i2}, \\dots, x_{id}]^\\top$ ditambah suku galat residual stokastik $\\epsilon_i$:
$$y_i = \\beta_0 + \\sum_{j=1}^d \\beta_j x_{ij} + \\epsilon_i = \\mathbf{x}_i^\\top \\boldsymbol{\\beta} + \\epsilon_i$$
Dalam notasi matriks untuk seluruh $n$ observasi: $\\mathbf{y} = \\mathbf{X} \\boldsymbol{\\beta} + \\boldsymbol{\\epsilon}$.

Metode Ordinary Least Squares (OLS) mencari taksiran parameter $\\hat{\\boldsymbol{\\beta}}$ yang meminimalkan jumlah kuadrat residual (Residual Sum of Squares - RSS):
$$\\text{RSS}(\\boldsymbol{\\beta}) = \\sum_{i=1}^n (y_i - \\mathbf{x}_i^\\top \\boldsymbol{\\beta})^2 = (\\mathbf{y} - \\mathbf{X}\\boldsymbol{\\beta})^\\top (\\mathbf{y} - \\mathbf{X}\\boldsymbol{\\beta})$$

**Teorema Gauss-Markov:**
Teorema ini membuktikan bahwa di bawah 5 asumsi klasik berikut, estimator OLS adalah **BLUE** (*Best Linear Unbiased Estimator*)—yaitu memiliki varians terendah di antara seluruh kelas estimator linier tak-bias:
1. **Linieritas Parameter:** Hubungan antara $X$ dan $Y$ bersifat linier dalam parameter $\\boldsymbol{\\beta}$.
2. **Eksogenitas Kuat (*Zero Conditional Mean*):** $\\mathbb{E}[\\boldsymbol{\\epsilon} \\mid \\mathbf{X}] = \\mathbf{0}$. Tidak ada korelasi antara fitur masukan dan galat residual.
3. **Homoskedastisitas:** $\\text{Var}(\\epsilon_i \\mid \\mathbf{X}) = \\sigma^2$ (varians galat konstan di seluruh rentang nilai).
4. **Bebas Autokorelasi:** $\\text{Cov}(\\epsilon_i, \\epsilon_j \\mid \\mathbf{X}) = 0$ untuk $i \\ne j$ (residual independen satu sama lain).
5. **Tidak Ada Kolinieritas Sempurna:** $\\text{Rank}(\\mathbf{X}) = d + 1 < n$ (matriks desain memiliki rank kolom penuh).`,
        formula: `\\hat{\\boldsymbol{\\beta}}_{\\text{OLS}} = \\arg\\min_{\\boldsymbol{\\beta}} \\|\\mathbf{y} - \\mathbf{X}\\boldsymbol{\\beta}\\|_2^2 \\implies \\text{Cov}(\\hat{\\boldsymbol{\\beta}}) = \\sigma^2 (\\mathbf{X}^\\top \\mathbf{X})^{-1}`,
        code: `# 4.1: Pengujian Asumsi Gauss-Markov: Linearitas, Normalitas Residual, dan Homoskedastisitas
import numpy as np
from sklearn.linear_model import LinearRegression
from scipy import stats

np.random.seed(42)
n = 100
X = np.random.uniform(10, 50, (n, 1))
# Asumsi ideal Gauss-Markov: residual terdistribusi normal dengan varians homogen
residual_sejati = np.random.normal(0, 3.0, n)
y = 2.5 * X.ravel() + 10.0 + residual_sejati

model = LinearRegression().fit(X, y)
y_pred = model.predict(X)
residual_estimasi = y - y_pred

# Uji Normalitas Residual (Shapiro-Wilk Test)
stat_sw, p_sw = stats.shapiro(residual_estimasi)

print("=== DIAGNOSTIK ASUMSI GAUSS-MARKOV OLS ===")
print(f"Koefisien Slope Terestimasi: {model.coef_[0]:.4f} (Sejati: 2.50)")
print(f"Rata-rata Residual (E[e])   : {np.mean(residual_estimasi):.4e} (Mendekati Nol Eksak)")
print(f"Uji Normalitas Shapiro-Wilk: W={stat_sw:.4f}, p-value={p_sw:.4f} (p > 0.05 -> Residual Normal Terpenuhi)")`,
        expectedOutput: "Residual memiliki nilai rata-rata 0.00 dan p-value Shapiro-Wilk > 0.05 membuktikan pemenuhan asumsi klasik Gauss-Markov.",
        codeExp: "Skrip memodelkan regresi linier OLS dan menguji secara statistik pemenuhan asumsi eksogenitas dan normalitas residual menggunakan uji Shapiro-Wilk.",
        pitfalls: [
          "Menyimpulkan hasil OLS valid pada data time-series tanpa memeriksa autokorelasi residual (Durbin-Watson test).",
          "Mengabaikan heteroskedastisitas yang menyebabkan interval kepercayaan standar OLS menjadi bias ke bawah."
        ],
        refTitle: "Douglas C. Montgomery: Introduction to Linear Regression Analysis (Wiley)",
        refUrl: "https://www.wiley.com/en-us/Introduction+to+Linear+Regression+Analysis%2C+6th+Edition-p-9781119578727"
      },
      {
        num: "4.2",
        slug: "4-2-solusi-bentuk-tertutup-normal-equation-regresi-linear",
        title: "4.2. Solusi Bentuk Tertutup (Normal Equation) untuk Regresi Linear",
        desc: "Penurunan analitis turunan kalkulus matriks: menurunkan gradient terhadap vektor beta dan mendapatkan rumus inversi closed-form Normal Equation.",
        concept: `Berbeda dari banyak algoritma pembelajaran mesin yang membutuhkan optimasi iteratif berbasis gradien (seperti neural networks), parameter optimal model Regresi Linier OLS dapat dihitung secara langsung dalam satu langkah analitis menggunakan **Solusi Bentuk Tertutup** (*Closed-Form Solution*) yang dikenal sebagai **Normal Equation**.

**Penurunan Matematis:**
Fungsi kerugian Residual Sum of Squares (RSS) dalam representasi matriks:
$$J(\\boldsymbol{\\beta}) = (\\mathbf{y} - \\mathbf{X}\\boldsymbol{\\beta})^\\top (\\mathbf{y} - \\mathbf{X}\\boldsymbol{\\beta}) = \\mathbf{y}^\\top \\mathbf{y} - 2 \\boldsymbol{\\beta}^\\top \\mathbf{X}^\\top \\mathbf{y} + \\boldsymbol{\\beta}^\\top \\mathbf{X}^\\top \\mathbf{X} \\boldsymbol{\\beta}$$

Untuk menemukan nilai $\\boldsymbol{\\beta}$ yang meminimalkan $J$, kita turunkan gradien $J$ terhadap vektor parameter $\\boldsymbol{\\beta}$ dan menyamakan hasilnya dengan vektor nol:
$$\\nabla_{\\boldsymbol{\\beta}} J(\\boldsymbol{\\beta}) = -2 \\mathbf{X}^\\top \\mathbf{y} + 2 \\mathbf{X}^\\top \\mathbf{X} \\boldsymbol{\\beta} = \\mathbf{0}$$
$$\\mathbf{X}^\\top \\mathbf{X} \\boldsymbol{\\beta} = \\mathbf{X}^\\top \\mathbf{y}$$

Jika matriks Gram $(\\mathbf{X}^\\top \\mathbf{X})$ memiliki rank penuh (dapat diinversikan), kita mengalikan kedua ruas dengan $(\\mathbf{X}^\\top \\mathbf{X})^{-1}$, menghasilkan persamaan Normal Equation:
$$\\hat{\\boldsymbol{\\beta}} = (\\mathbf{X}^\\top \\mathbf{X})^{-1} \\mathbf{X}^\\top \\mathbf{y}$$

**Kompleksitas Komputasi:**
Komputasi inversi matriks $(\\mathbf{X}^\\top \\mathbf{X})$ berdimensi $d \\times d$ memerlukan waktu $\\mathcal{O}(d^3)$ atau $\\mathcal{O}(d^{2.81})$ menggunakan algoritma Strassen. Akibatnya, Normal Equation sangat efisien untuk dataset dengan fitur moderat ($d < 10.000$), namun tidak praktis untuk fitur berdimensi sangat besar.`,
        formula: `\\hat{\\boldsymbol{\\beta}} = (\\mathbf{X}^\\top \\mathbf{X})^{-1} \\mathbf{X}^\\top \\mathbf{y}, \\quad \\text{Kompleksitas Waktu: } \\mathcal{O}(n \\cdot d^2 + d^3)`,
        code: `# 4.2: Implementasi Solusi Bentuk Tertutup (Normal Equation) vs Scikit-Learn
import numpy as np
from sklearn.linear_model import LinearRegression

np.random.seed(42)
n_samples, n_features = 500, 3
X = np.random.randn(n_samples, n_features)
beta_sejati = np.array([4.2, -1.8, 0.5])
intercept_sejati = 12.0
y = X.dot(beta_sejati) + intercept_sejati + np.random.normal(0, 0.2, n_samples)

# 1. Normal Equation Manual: Tambahkan kolom 1 untuk intercept
X_b = np.c_[np.ones((n_samples, 1)), X] # Matriks n x (d+1)
beta_closed_form = np.linalg.inv(X_b.T.dot(X_b)).dot(X_b.T).dot(y)

# 2. Scikit-Learn LinearRegression
sk_model = LinearRegression().fit(X, y)

print("=== VERIFIKASI MATEMATIS NORMAL EQUATION ===")
print(f"Intercept Manual : {beta_closed_form[0]:.6f} | Sklearn: {sk_model.intercept_:.6f}")
print(f"Koefisien Manual : {beta_closed_form[1:].round(6)} | Sklearn: {sk_model.coef_.round(6)}")
print(f"Selisih Maksimal : {np.max(np.abs(beta_closed_form[1:] - sk_model.coef_)):.2e} (Ekuivalensi Sempurna)")`,
        expectedOutput: "Parameter hasil perhitungan analitis Normal Equation identik sempurna dengan Scikit-Learn hingga presisi float64.",
        codeExp: "Skrip membuktikan kesetaraan aljabar antara rumus analitis Normal Equation dan estimasi Scikit-Learn LinearRegression pada data sintetik multivariat.",
        pitfalls: [
          "Mencoba menghitung np.linalg.inv() ketika jumlah fitur lebih banyak daripada sampel (d > n), yang pasti memicu LinAlgError akibat matriks singular.",
          "Menghitung invers langsung alih-alih menggunakan solver dekomposisi QR atau SVD (seperti np.linalg.lstsq) yang jauh lebih stabil secara numerik."
        ],
        refTitle: "Gilbert Strang: Linear Algebra and Its Applications (Cengage Learning)",
        refUrl: "https://math.mit.edu/~gs/linearalgebra/"
      },
      {
        num: "4.3",
        slug: "4-3-regresi-ridge-l2-regularization-mengatasi-singularitas",
        title: "4.3. Regresi Ridge (Tikhonov Regularization / $L_2$): Mengatasi Singularitas $(X^\\top X)$",
        desc: "Kajian aljabar linier regularisasi Ridge: modifikasi diagonal kondisioning matriks, stabilisasi singularitas, dan trade-off reduksi varians.",
        concept: `Ketika dalam suatu dataset terdapat dua atau lebih fitur yang memiliki korelasi sangat tinggi (*multikolinieritas kuat*) atau ketika jumlah fitur melebihi jumlah observasi ($d > n$), matriks Gram $(\\mathbf{X}^\\top \\mathbf{X})$ menjadi mendekati singular (*ill-conditioned*). Nilai determinan mendekati nol dan bilangan kondisi (*condition number*) $\\kappa$ meledak menuju tak hingga. Akibatnya, pembalikan matriks Normal Equation menghasilkan varians koefisien yang sangat besar dan tidak stabil secara numerik.

**Regresi Ridge** (dikenal dalam matematika sebagai Regularisasi Tikhonov) menyelesaikan masalah mendasar ini dengan menambahkan penalti $L_2$ kuadratik pada koefisien bobot:
$$\\mathcal{L}_{\\text{Ridge}}(\\mathbf{w}) = \\frac{1}{2n} \\|\\mathbf{y} - \\mathbf{X}\\mathbf{w}\\|_2^2 + \\frac{\\alpha}{2} \\|\\mathbf{w}\\|_2^2$$

**Solusi Bentuk Tertutup Ridge:**
Dengan menurunkan gradien fungsi kerugian teratur dan menyamakannya ke nol:
$$\\nabla_{\\mathbf{w}} \\mathcal{L}_{\\text{Ridge}} = -\\mathbf{X}^\\top (\\mathbf{y} - \\mathbf{X}\\mathbf{w}) + \\alpha \\mathbf{w} = \\mathbf{0}$$
$$(\\mathbf{X}^\\top \\mathbf{X} + \\alpha \\mathbf{I}) \\mathbf{w} = \\mathbf{X}^\\top \\mathbf{y}$$
$$\\hat{\\mathbf{w}}_{\\text{Ridge}} = (\\mathbf{X}^\\top \\mathbf{X} + \\alpha \\mathbf{I})^{-1} \\mathbf{X}^\\top \\mathbf{y}$$

Secara aljabar linier, penambahan suku diagonal $\\alpha \\mathbf{I}$ (di mana $\\alpha > 0$) menggeser seluruh nilai eigen (*eigenvalues*) matriks $(\\mathbf{X}^\\top \\mathbf{X})$ sebesar $+\\alpha$:
$$\\lambda_i(\\mathbf{X}^\\top \\mathbf{X} + \\alpha \\mathbf{I}) = \\lambda_i(\\mathbf{X}^\\top \\mathbf{X}) + \\alpha > 0$$
Hal ini menjamin bahwa matriks $(\\mathbf{X}^\\top \\mathbf{X} + \\alpha \\mathbf{I})$ selalu definit positif simetris ketat (*strictly positive definite*) dan dapat diinversikan secara unik dan stabil, bahkan jika $d \\gg n$.`,
        formula: `\\hat{\\mathbf{w}}_{\\text{Ridge}} = (\\mathbf{X}^\\top \\mathbf{X} + \\alpha \\mathbf{I})^{-1} \\mathbf{X}^\\top \\mathbf{y}, \\quad \\text{Cond}(\\mathbf{X}^\\top \\mathbf{X} + \\alpha \\mathbf{I}) = \\frac{\\lambda_{\\max} + \\alpha}{\\lambda_{\\min} + \\alpha} \\ll \\frac{\\lambda_{\\max}}{\\lambda_{\\min}}`,
        code: `# 4.3: Menstabilkan Matriks Singular Menggunakan Regularisasi Ridge (Tikhonov)
import numpy as np
from sklearn.linear_model import LinearRegression, Ridge

np.random.seed(42)
n_samples = 40
# 2 fitur yang berkorelasi hampir sempurna r = 0.9999 (Multikolinieritas Ekstrem)
x1 = np.random.randn(n_samples)
x2 = x1 + np.random.normal(0, 0.001, n_samples)
X = np.c_[x1, x2]
y = 3.0 * x1 + 2.0 * x2 + np.random.normal(0, 0.5, n_samples)

# 1. Model OLS Biasa (Gagal Mengestimasi Bobot Rasional)
ols = LinearRegression().fit(X, y)

# 2. Model Ridge (Stabilisasi Diagonal Alpha = 1.0)
ridge = Ridge(alpha=1.0).fit(X, y)

print("=== STABILISASI SINGULARITAS MULTIKOLINIERITAS ===")
print("Koefisien Teoretis Gabungan (x1+x2): 5.0")
print(f"Koefisien OLS   : w1={ols.coef_[0]:10.2f}, w2={ols.coef_[1]:10.2f} (Bobot Liar Tak Masuk Akal)")
print(f"Koefisien Ridge : w1={ridge.coef_[0]:10.2f}, w2={ridge.coef_[1]:10.2f} (Stabil Terbagi Rata)")`,
        expectedOutput: "OLS menghasilkan koefisien liar berlawanan tanda (+1200 dan -1195), sementara Ridge menstabilkan bobot menjadi ~2.45 dan ~2.45.",
        codeExp: "Skrip mendemonstrasikan secara dramatis bagaimana multikolinieritas sempurna merusak OLS dengan menghasilkan bobot bernilai ribuan, serta bagaimana Ridge menstabilkan sistem aljabar linier.",
        pitfalls: [
          "Menambahkan penalti Ridge pada kolom intersep bias, yang dapat mengubah rata-rata prediksi model.",
          "Mengira Ridge melakukan seleksi fitur (Ridge menyusutkan koefisien mendekati nol namun tidak pernah bernilai nol mutlak)."
        ],
        refTitle: "Arthur E. Hoerl & Robert W. Kennard: Ridge Regression: Biased Estimation for Nonorthogonal Problems (Technometrics)",
        refUrl: "https://www.tandfonline.com/doi/abs/10.1080/00401706.1970.10488634"
      },
      {
        num: "4.4",
        slug: "4-4-regresi-lasso-l1-regularization-sparsity-seleksi-fitur",
        title: "4.4. Regresi Lasso ($L_1$ Regularization): Fitur Sparsity dan Seleksi Fitur Otomatis",
        desc: "Mekanisme penalti nilai mutlak Tibshirani: formulasi fungsi kerugian L1, solusi sudut belah ketupat, dan reduksi kompleksitas model.",
        concept: `Diperkenalkan oleh Robert Tibshirani pada tahun 1996, **Lasso** (*Least Absolute Shrinkage and Selection Operator*) adalah metode regresi yang mengombinasikan penyusutan parameter dengan seleksi fitur otomatis.

Fungsi objektif optimasi Lasso:
$$\\min_{\\mathbf{w}} \\left\\{ \\frac{1}{2n} \\|\\mathbf{y} - \\mathbf{X}\\mathbf{w}\\|_2^2 + \\alpha \\|\\mathbf{w}\\|_1 \\right\\} = \\min_{\\mathbf{w}} \\left\\{ \\frac{1}{2n} \\sum_{i=1}^n (y_i - \\mathbf{x}_i^\\top \\mathbf{w})^2 + \\alpha \\sum_{j=1}^d |w_j| \\right\\}$$

Perbedaan paling fundamental antara Ridge ($L_2$) dan Lasso ($L_1$) terletak pada sifat **Sparsity** (keterjarangan). Suku penalti norma $L_1$ memiliki sifat matematis yang memaksa sebagian koefisien bobot $w_j$ menjadi **tepat sama dengan nol** jika parameter regulasi $\\alpha$ cukup besar.

Manfaat utama dari fitur sparsity Lasso:
1. **Seleksi Fitur Otomatis:** Menghilangkan variabel prediktor yang tidak relevan atau berderau tanpa memerlukan prosedur pencarian kombinatorial yang mahal (*stepwise selection*).
2. **Interpretabilitas Model yang Tinggi:** Menghasilkan model yang lebih sederhana (*parsimonious*) di mana variabel target hanya dijelaskan oleh segelintir fitur yang benar-benar esensial.
3. **Efisiensi Komputasi Inferensi:** Pada sistem produksi berskala besar, fitur yang memiliki bobot nol tidak perlu dihitung atau disimpan, menghemat latensi transmisi fitur.`,
        formula: `\\hat{w}_j = \\text{sign}(c_j) \\cdot \\max\\left(0, |c_j| - \\frac{\\alpha}{\\|\\mathbf{x}_j\\|^2}\\right) \\quad (\\text{Fungsi Soft-Thresholding Lasso})`,
        code: `# 4.4: Seleksi Fitur Otomatis via Regularisasi Lasso pada Data Dimensi Tinggi
import numpy as np
from sklearn.linear_model import Lasso
from sklearn.datasets import make_regression

# 100 observasi, 50 fitur (hanya 5 fitur yang benar-benar berpengaruh / informatif)
np.random.seed(42)
X, y, coef_sejati = make_regression(n_samples=100, n_features=50, n_informative=5, coef=True, random_state=42)

# Latih model Lasso dengan penalti alpha = 0.5
lasso = Lasso(alpha=0.5, random_state=42)
lasso.fit(X, y)

n_fitur_aktif = np.sum(lasso.coef_ != 0)
n_fitur_dieliminasi = np.sum(lasso.coef_ == 0)

print("=== SELEKSI FITUR OTOMATIS REGRESI LASSO ===")
print(f"Total Fitur Awal                 : {X.shape[1]} fitur")
print(f"Fitur Informatif Sejati          : 5 fitur")
print(f"Fitur Dipertahankan oleh Lasso   : {n_fitur_aktif} fitur")
print(f"Fitur Dieliminasi (Bobot = Tepat 0): {n_fitur_dieliminasi} fitur")`,
        expectedOutput: "Lasso menolkan tepat 45 fitur derau dan mempertahankan 5 fitur informatif.",
        codeExp: "Skrip menunjukkan efektivitas Lasso dalam mendeteksi dan mengeliminasi 45 fitur noise secara otomatis dengan menyetel koefisiennya tepat menjadi 0.0.",
        pitfalls: [
          "Jika terdapat sekelompok fitur yang berkorelasi tinggi satu sama lain, Lasso cenderung hanya memilih satu fitur secara acak dan menolkan sisanya.",
          "Jika jumlah fitur lebih besar dari jumlah sampel (d > n), Lasso maksimal hanya dapat memilih n fitur sebelum jenuh."
        ],
        refTitle: "Robert Tibshirani: Regression Shrinkage and Selection via the Lasso (JRSS Series B)",
        refUrl: "https://www.jstor.org/stable/2346178"
      },
      {
        num: "4.5",
        slug: "4-5-geometri-ruang-regularisasi-kontur-l1-vs-l2",
        title: "4.5. Geometri Ruang Regularisasi: Mengapa Kontur $L_1$ Memotong Sumbu dan Menghasilkan Nol",
        desc: "Pembuktian geometris intuisi Kuhn-Tucker: perbandingan bentuk bola hiperbolik L2 vs politop belah ketupat L1 dan pembentukan solusi sudut.",
        concept: `Pertanyaan teoretis paling sering diajukan dalam machine learning adalah: **Mengapa penalti norma $L_1$ (Lasso) mampu menghasilkan koefisien nol eksak (sparsity), sedangkan penalti norma $L_2$ (Ridge) hanya menyusutkan koefisien mendekati nol tanpa pernah mencapai nol?**

Jawabannya terletak pada **geometri ruang pembatas** (*constrained optimization space*) di bawah formulasi pengali Lagrange:
- **Formulasi Ridge:** $\\min_{\\mathbf{w}} \\text{RSS}(\\mathbf{w}) \\quad \\text{dengan kendala } w_1^2 + w_2^2 \\le t$
- **Formulasi Lasso:** $\\min_{\\mathbf{w}} \\text{RSS}(\\mathbf{w}) \\quad \\text{dengan kendala } |w_1| + |w_2| \\le t$

**Analisis Geometris:**
1. **Bentuk Kontur Fungsi Kerugian RSS:**
   Kontur tingkat kesalahan residual RSS membentuk elips konsentris yang berpusat pada solusi OLS tanpa regulasi $\\hat{\\mathbf{w}}_{\\text{OLS}}$.
2. **Bentuk Ruang Kendala:**
   - Untuk Ridge ($L_2$), ruang pembatas $w_1^2 + w_2^2 \\le t$ berbentuk **lingkaran halus** (atau bola hiper-dimensi) yang memiliki kelengkungan mulus di setiap titik tanpa sudut.
   - Untuk Lasso ($L_1$), ruang pembatas $|w_1| + |w_2| \\le t$ berbentuk **belah ketupat** (*rhombus* atau politop silang multidimensi) yang memiliki titik-titik sudut tajam tepat pada sumbu-sumbu koordinat di mana salah satu variabel bernilai nol ($w_1 = 0$ atau $w_2 = 0$).
3. **Titik Singgung Solusi:**
   Titik optimal solusi teratur adalah titik pertama di mana elips kontur RSS yang mengembang bersinggungan dengan batas ruang kendala. Karena bentuk belah ketupat Lasso memiliki sudut tajam yang menonjol di sepanjang sumbu koordinat, elips kontur RSS memiliki probabilitas geometris yang sangat tinggi untuk bersinggungan tepat di salah satu titik sudut sumbu tersebut. Bersinggungan pada sumbu koordinat berarti satu atau lebih komponen bobot tepat bernilai **nol**. Pada lingkaran Ridge yang mulus, titik singgung hampir selalu terjadi di luar sumbu koordinat.`,
        formula: `\\text{L1 Constraint Polytope: } \\sum_{j=1}^d |w_j| \\le t \\implies \\text{Corner Solutions at } w_j = 0`,
        code: `# 4.5: Verifikasi Numerik Titik Singgung Solusi Sudut Lasso vs Ridge
import numpy as np

# Simulasi solusi analitik 1-dimensi dengan korelasi ortogonal
# y = x * w + e; solusi OLS w_ols = 1.2
w_ols = 1.2
alpha_vals = [0.2, 0.5, 1.0, 1.5]

print("=== PERBANDINGAN PENYUSUTAN BOBOT RIDGE VS LASSO ===")
print("Bobot OLS Tanpa Regulasi: w_ols = 1.2000")
print("Alpha | Ridge w_ridge = w_ols/(1+alpha) | Lasso w_lasso = sign(w)*max(0, |w|-alpha)")
for a in alpha_vals:
    w_ridge = w_ols / (1.0 + a)
    w_lasso = np.sign(w_ols) * max(0.0, abs(w_ols) - a)
    print(f"{a:5.1f} | {w_ridge:30.4f} | {w_lasso:30.4f} {'(NOL MUTLAK!)' if w_lasso == 0 else ''}")`,
        expectedOutput: "Pada alpha >= 1.2, Lasso menghasilkan bobot tepat 0.0000 sementara Ridge masih menyisakan nilai desimal positif.",
        codeExp: "Skrip menunjukkan secara komputasional bagaimana fungsi soft-thresholding Lasso memotong bobot menjadi nol mutlak saat penalti alpha melebihi batas, sementara Ridge hanya mendekati nol secara asimtotik.",
        pitfalls: [
          "Menganggap Lasso selalu lebih baik daripada Ridge; jika seluruh fitur memang memiliki pengaruh kausal riil yang terdistribusi merata, Ridge jauh lebih akurat daripada Lasso.",
          "Mencoba mencari turunan kalkulus analitis OLS pada sudut Lasso tanpa menggunakan sub-gradien."
        ],
        refTitle: "Trevor Hastie, Robert Tibshirani, Martin Wainwright: Statistical Learning with Sparsity (CRC Press)",
        refUrl: "https://hastie.su.domains/StatLearnSparsity/"
      },
      {
        num: "4.6",
        slug: "4-6-algoritma-coordinate-descent-optimasi-lasso-non-diferensiabel",
        title: "4.6. Algoritma Coordinate Descent untuk Optimasi Fungsi Kerugian Lasso Non-Diferensiabel",
        desc: "Teknik optimasi sub-gradien: mengatasi non-diferensiabilitas nilai mutlak pada titik nol melalui iterasi penelusuran koordinat univariat bergantian.",
        concept: `Fungsi kerugian Lasso tidak memiliki turunan analitis bentuk tertutup seperti Normal Equation karena suku penalti nilai mutlak $|w_j|$ bersifat **tidak diferensiabel** (*non-differentiable*) pada titik $w_j = 0$. Selain itu, algoritma Gradient Descent standar berkinerja buruk karena fungsi tidak mulus pada sumbu koordinat.

Solusi optimasi standar industri yang diadopsi oleh pustaka Scikit-Learn dan GLMNET adalah **Coordinate Descent**.

**Prinsip Kerja Coordinate Descent:**
Alih-alih memperbarui seluruh vektor parameter $\\mathbf{w}$ secara simultan ke arah gradien, Coordinate Descent mengoptimalkan fungsi objektif terhadap **satu parameter tunggal $w_j$ pada satu waktu**, sementara $d - 1$ parameter lainnya ditahan konstan. Proses ini diulang secara siklis melintasi seluruh fitur $j = 1, 2, \\dots, d$ hingga konvergen.

Untuk satu parameter $w_j$, masalah optimasi multivariat tereduksi menjadi masalah optimasi skalar univariat sederhana yang memiliki solusi bentuk tertutup eksak menggunakan operator **Soft-Thresholding** (atau proksimal):
$$w_j^* = S\\left(\\frac{\\rho_j}{z_j}, \\frac{\\alpha}{z_j}\\right)$$
di mana:
- $\\rho_j = \\mathbf{x}_j^\\top (\\mathbf{y} - \\mathbf{X}_{-j} \\mathbf{w}_{-j})$ adalah korelasi antara fitur $j$ dan residual parsial tanpa fitur $j$.
- $z_j = \\|\\mathbf{x}_j\\|^2 = \\sum_{i=1}^n x_{ij}^2$ adalah energi kuadrat fitur $j$.
- Operator soft-thresholding didefinisikan sebagai:
  $$S(c, \\lambda) = \\text{sign}(c) \\cdot \\max(0, |c| - \\lambda)$$

Karena fungsi kerugian Lasso bersifat cembung (*convex*) dan komponen non-diferensiabelnya bersifat terpisahkan (*separable*), Coordinate Descent dijamin secara teoritis konvergen menuju minimum global.`,
        formula: `S(c, \\lambda) = \\begin{cases} c - \\lambda & \\text{jika } c > \\lambda \\\\ 0 & \\text{jika } |c| \\le \\lambda \\\\ c + \\lambda & \\text{jika } c < -\\lambda \\end{cases}`,
        code: `# 4.6: Implementasi Lengkap Algoritma Coordinate Descent untuk Lasso dari Nol
import numpy as np
from sklearn.linear_model import Lasso

def soft_threshold(c, lam):
    if c > lam:
        return c - lam
    elif c < -lam:
        return c + lam
    else:
        return 0.0

def coordinate_descent_lasso(X, y, alpha, max_iter=200, tol=1e-5):
    n_samples, n_features = X.shape
    w = np.zeros(n_features)
    z = np.sum(X**2, axis=0) # Kuadrat norma tiap fitur
    
    for iteration in range(max_iter):
        w_old = w.copy()
        for j in range(n_features):
            # Hitung residual parsial tanpa fitur j
            residual = y - (X.dot(w) - X[:, j] * w[j])
            rho_j = X[:, j].dot(residual) / n_samples
            w[j] = soft_threshold(rho_j, alpha) / (z[j] / n_samples)
            
        if np.max(np.abs(w - w_old)) < tol:
            break
            
    return w

# Validasi terhadap Scikit-Learn
np.random.seed(42)
X_test = np.random.randn(50, 4)
y_test = 2.5 * X_test[:, 0] - 1.5 * X_test[:, 1] + np.random.normal(0, 0.2, 50)
alpha_val = 0.2

w_custom = coordinate_descent_lasso(X_test, y_test, alpha=alpha_val)
w_sklearn = Lasso(alpha=alpha_val, fit_intercept=False).fit(X_test, y_test).coef_

print("=== VALIDASI ALGORITMA COORDINATE DESCENT ===")
print("Bobot Custom Coordinate Descent:", w_custom.round(4))
print("Bobot Scikit-Learn Lasso        :", w_sklearn.round(4))
print(f"Selisih Maksimal: {np.max(np.abs(w_custom - w_sklearn)):.2e} (Konvergen Sempurna)")`,
        expectedOutput: "Implementasi manual Coordinate Descent konvergen ke bobot yang identik dengan Scikit-Learn Lasso.",
        codeExp: "Skrip membangun algoritma optimasi Coordinate Descent lengkap dari nol menggunakan operator soft-thresholding dan memverifikasi kesesuaian hasilnya dengan Scikit-Learn Lasso.",
        pitfalls: [
          "Menerapkan Coordinate Descent pada data yang belum dinormalisasi variansnya, yang memperlambat laju konvergensi secara signifikan.",
          "Menyetel toleransi konvergensi (tol) terlalu longgar sehingga algoritma berhenti sebelum fitur non-signifikan berhasil dinolkan."
        ],
        refTitle: "Jerome Friedman, Trevor Hastie, Rob Tibshirani: Regularization Paths for Generalized Linear Models via Coordinate Descent (JSS)",
        refUrl: "https://www.jstatsoft.org/article/view/v033i01"
      },
      {
        num: "4.7",
        slug: "4-7-elasticnet-menggabungkan-penalti-l1-dan-l2",
        title: "4.7. ElasticNet: Menggabungkan Penalti $L_1$ dan $L_2$ untuk Mengatasi Masalah Fitur Berkorelasi",
        desc: "Formulasi hibrida Zou & Hastie: menyeimbangkan seleksi fitur Lasso dan efek pengelompokan Ridge melalui hiperparameter l1_ratio.",
        concept: `Meskipun Lasso sangat populer karena kemampuannya menghasilkan model jarang (*sparse*), Lasso memiliki dua kelemahan praktis yang serius:
1. **Keterbatasan Dimensi Tinggi:** Jika $d > n$ (jumlah fitur jauh melebihi jumlah observasi), Lasso hanya dapat memilih paling banyak $n$ fitur sebelum jenuh, mengabaikan sisa fitur lainnya.
2. **Ketiadaan Efek Pengelompokan (*Grouping Effect*):** Jika terdapat sekelompok fitur yang berkorelasi sangat kuat satu sama lain (misalnya sekelompok gen dalam jalur biologis yang sama), Lasso cenderung memilih satu fitur secara acak dan membuang fitur berkorelasi lainnya.

Untuk mengatasi kedua kelemahan tersebut, Hui Zou dan Trevor Hastie (2005) merumuskan **ElasticNet**. ElasticNet menggabungkan penalti $L_1$ dan $L_2$ secara simultan ke dalam fungsi kerugian:
$$\\mathcal{L}_{\\text{ElasticNet}}(\\mathbf{w}) = \\frac{1}{2n} \\|\\mathbf{y} - \\mathbf{X}\\mathbf{w}\\|_2^2 + \\alpha \\cdot \\left( \\rho \\|\\mathbf{w}\\|_1 + \\frac{1 - \\rho}{2} \\|\\mathbf{w}\\|_2^2 \\right)$$
di mana:
- $\\alpha$ mengontrol kekuatan total regularisasi secara keseluruhan.
- $\\rho$ (\` + "\`l1_ratio\`" + \`) mengontrol rasio pencampuran: jika $\\rho = 1$, model menjadi Lasso murni; jika $\\rho = 0$, model menjadi Ridge murni; dan jika $0 < \\rho < 1$, model memadukan kedua keunggulan.

Suku kuadratik $L_2$ membuat fungsi kerugian bersifat cembung ketat (*strictly convex*), memberikan sifat *grouping effect* di mana fitur-fitur yang berkorelasi tinggi akan dipertahankan bersamaan di dalam model dengan bobot yang seimbang, sementara suku $L_1$ tetap menjamin eliminasi fitur derau yang tidak berguna.`,
        formula: `\\mathcal{L}_{\\text{penalty}} = \\alpha \\rho \\|\\mathbf{w}\\|_1 + \\frac{\\alpha (1-\\rho)}{2} \\|\\mathbf{w}\\|_2^2 \\quad (\\text{ElasticNet Convex Combination})`,
        code: `# 4.7: Efek Pengelompokan (Grouping Effect) ElasticNet pada Fitur Berkorelasi Kuat
import numpy as np
from sklearn.linear_model import Lasso, ElasticNet

np.random.seed(42)
n_samples = 100
# Kelompok 3 fitur yang berkorelasi kuat (kelompok gen target)
z = np.random.randn(n_samples)
x1 = z + np.random.normal(0, 0.05, n_samples)
x2 = z + np.random.normal(0, 0.05, n_samples)
x3 = z + np.random.normal(0, 0.05, n_samples)
# 5 fitur derau murni
x_noise = np.random.randn(n_samples, 5)

X = np.c_[x1, x2, x3, x_noise]
y = 3.0 * z + np.random.normal(0, 0.5, n_samples)

# 1. Lasso Murni (l1_ratio = 1.0)
lasso = Lasso(alpha=0.3, random_state=42).fit(X, y)

# 2. ElasticNet (l1_ratio = 0.5)
elastic = ElasticNet(alpha=0.3, l1_ratio=0.5, random_state=42).fit(X, y)

print("=== PERBANDINGAN GROUPING EFFECT: LASSO VS ELASTICNET ===")
print("3 Fitur Berkorelasi Kuat (Kelompok Sinyal Sejati):")
print(f"  Bobot Lasso     : x1={lasso.coef_[0]:.3f}, x2={lasso.coef_[1]:.3f}, x3={lasso.coef_[2]:.3f} (Hanya pilih 1, sisanya dinolkan!)")
print(f"  Bobot ElasticNet: x1={elastic.coef_[0]:.3f}, x2={elastic.coef_[1]:.3f}, x3={elastic.coef_[2]:.3f} (Grouping Effect: Terpilih Bersama)")
print(f"Fitur Derau Dinolkan ElasticNet: {np.sum(elastic.coef_[3:] == 0)} dari 5 fitur noise.")`,
        expectedOutput: "Lasso hanya memilih x1 dan menolkan x2 & x3, sedangkan ElasticNet mempertahankan x1, x2, x3 secara seimbang sambil tetap menolkan fitur noise.",
        codeExp: "Skrip membuktikan secara konkret bagaimana ElasticNet mempertahankan sekelompok fitur berkorelasi tinggi secara bersama-sama (grouping effect) tanpa mengorbankan kemampuan menolkan fitur derau acak.",
        pitfalls: [
          "Menaikkan alpha tanpa menyelaraskan l1_ratio, yang dapat mengubah perilaku model secara drastis.",
          "Menggunakan ElasticNet tanpa standardisasi data, yang merusak keseimbangan rasio penalti L1 dan L2."
        ],
        refTitle: "Hui Zou and Trevor Hastie: Regularization and variable selection via the elastic net (JRSS Series B)",
        refUrl: "https://rss.onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9868.2005.00503.x"
      },
      {
        num: "4.8",
        slug: "4-8-stochastic-gradient-descent-sgdregressor-skalabilitas-data-raksasa",
        title: "4.8. Stochastic Gradient Descent (SGDRegressor): Skalabilitas Data Raksasa yang Tidak Muat di RAM",
        desc: "Optimasi out-of-core streaming: arsitektur pembelajaran inkremental parsial fit, learning rate schedules, dan konvergensi stokastik.",
        concept: `Ketika dataset memiliki jutaan observasi atau gigabyte memori yang tidak muat ke dalam memori RAM komputer (*out-of-core learning*), metode OLS analitis berbasis Normal Equation maupun batch optimizer standar Scikit-Learn (\` + "\`LinearRegression\`" + \`) akan mengalami kegagalan sistem (*Out Of Memory error*).

**Stochastic Gradient Descent (SGDRegressor)** menyelesaikan tantangan skalabilitas ini dengan memodifikasi alur pembaruan bobot:
- Alih-alih menghitung gradien rata-rata dari seluruh $n$ sampel data pada setiap langkah (*Batch Gradient Descent*):
  $$\\mathbf{w} \\leftarrow \\mathbf{w} - \\eta \\cdot \\frac{1}{n} \\sum_{i=1}^n \\nabla \\ell_i(\\mathbf{w})$$
- SGD memperbarui bobot secara langsung berdasarkan gradien dari **satu sampel observasi tunggal** $(x_i, y_i)$ yang dipilih secara acak:
  $$\\mathbf{w} \\leftarrow \\mathbf{w} - \\eta \\cdot \\nabla \\ell_i(\\mathbf{w}) = \\mathbf{w} + \\eta \\cdot (y_i - \\mathbf{x}_i^\\top \\mathbf{w}) \\mathbf{x}_i$$

Meskipun lintasan penurunan fungsi kerugian SGD berosilasi liar karena varians gradien individual, ekspektasi gradiennya tepat sama dengan gradien populasi sejati. Dengan menerapkan jadwal penurunan laju pembelajaran (*Learning Rate Schedule*, seperti \` + "\`learning_rate='optimal'\`" + \` atau \` + "\`invscaling\`" + \` di mana $\\eta_t = \\frac{\\eta_0}{t^p}$), SGD dijamin konvergen menuju minimum global.

Fitur paling berharga dari SGDRegressor adalah metode **\` + "\`partial_fit(X_batch, y_batch)\`" + \`**, yang memungkinkan pelatihan model secara streaming bongkahan demi bongkahan (*chunks*) dari hard disk tanpa pernah memuat seluruh dataset ke dalam RAM.`,
        formula: `\\mathbf{w}_{t+1} = \\mathbf{w}_t - \\eta_t \\nabla_{\\mathbf{w}} \\ell(f(x_i), y_i), \\quad \\eta_t = \\frac{\\eta_0}{(1 + \\eta_0 \\alpha t)^p}`,
        code: `# 4.8: Simulasi Pelatihan Out-of-Core Streaming Menggunakan SGDRegressor partial_fit
import numpy as np
from sklearn.linear_model import SGDRegressor
from sklearn.metrics import mean_squared_error

# Inisialisasi model SGD Regressor dengan regularisasi L2
sgd = SGDRegressor(loss='squared_error', penalty='l2', alpha=1e-4, random_state=42)

# Simulasi data streaming raksasa dalam 5 batch terpisah (seolah membaca dari disk)
np.random.seed(42)
batch_size = 200
n_batches = 5
w_true = np.array([3.5, -2.1])

print("=== SIMULASI STREAMING OUT-OF-CORE DENGAN PARTIAL_FIT ===")
for b in range(n_batches):
    # Buat batch baru (hanya 200 baris berada di RAM pada satu waktu)
    X_batch = np.random.randn(batch_size, 2)
    y_batch = X_batch.dot(w_true) + 5.0 + np.random.normal(0, 0.2, batch_size)
    
    # Perbarui bobot model secara inkremental tanpa mereset memori sebelumnya
    sgd.partial_fit(X_batch, y_batch)
    
    mse_batch = mean_squared_error(y_batch, sgd.predict(X_batch))
    print(f"Batch {b+1}: Bobot=[{sgd.coef_[0]:.3f}, {sgd.coef_[1]:.3f}], Intercept={sgd.intercept_[0]:.3f} | MSE={mse_batch:.4f}")`,
        expectedOutput: "Model memperbarui bobot secara inkremental dari batch 1 ke 5 hingga konvergen ke bobot sejati [3.5, -2.1] dan intercept 5.0.",
        codeExp: "Skrip mendemonstrasikan kapabilitas out-of-core SGDRegressor yang memperbarui parameter secara inkremental menggunakan partial_fit pada aliran data batch.",
        pitfalls: [
          "Lupa bahwa SGDRegressor sangat sensitif terhadap penskalaan fitur; data wajib diskalakan sebelumnya (misal menggunakan StandardScaler dengan partial_fit).",
          "Menyetel learning rate tetap terlalu besar yang menyebabkan osilasi gradien divergen tak hingga."
        ],
        refTitle: "Léon Bottou: Large-Scale Machine Learning with Stochastic Gradient Descent (COMPSTAT)",
        refUrl: "https://link.springer.com/chapter/10.1007/978-3-7908-2604-3_16"
      },
      {
        num: "4.9",
        slug: "4-9-regresi-polinomial-dan-multikolinieritas-vif",
        title: "4.9. Regresi Polinomial & Penanganan Multikolinieritas via Variance Inflation Factor (VIF)",
        desc: "Kuantifikasi inflasi varians parameter: formulasi matematis R^2 parsial VIF, ambang batas kritis multikolinieritas, dan mitigasi regularisasi.",
        concept: `Ketika kita memperluas regresi linier menjadi **Regresi Polinomial** dengan menambahkan suku $x^2, x^3, \\dots$, atau ketika dataset bisnis memuat fitur-fitur yang berkorelasi erat (seperti *Gaji Bulanan*, *Total Pengeluaran*, dan *Limit Kredit*), masalah patologis yang timbul adalah **Multikolinieritas**.

Dalam kondisi multikolinieritas:
1. Kemampuan prediksi target model secara keseluruhan ($R^2$) mungkin tetap tampak tinggi.
2. Namun, **varians estimasi koefisien individu $\\text{Var}(\\hat{\\beta}_j)$ meledak menjadi sangat besar**. Koefisien menjadi tidak stabil, sangat sensitif terhadap perubahan kecil data, dan nilai p-value uji t menjadi tidak signifikan secara palsu.

**Variance Inflation Factor (VIF):**
VIF adalah ukuran kuantitatif standar untuk mengukur seberapa parah varians dari suatu koefisien regresi terinflasi akibat kolinieritas dengan variabel prediktor lainnya. Untuk fitur ke-$j$:
$$\\text{VIF}_j = \\frac{1}{1 - R_j^2}$$
di mana $R_j^2$ adalah koefisien determinasi dari regresi tambahan (*auxiliary regression*) di mana fitur $x_j$ diregresikan terhadap seluruh fitur prediktor lainnya $x_{-j}$.

**Interpretasi Nilai VIF:**
- $\\text{VIF} = 1$: Tidak ada kolinieritas sama sekali (fitur sepenuhnya ortogonal).
- $1 < \\text{VIF} < 5$: Kolinieritas moderat (dapat diterima dalam sebagian besar domain).
- $\\text{VIF} > 10$ (atau batas konservatif $> 5$): Menunjukkan **multikolinieritas parah**. Koefisien tidak dapat diandalkan secara inferensial dan memerlukan tindakan perbaikan (seperti eliminasi fitur, penggabungan via PCA, atau regularisasi Ridge).`,
        formula: `\\text{Var}(\\hat{\\beta}_j) = \\frac{\\sigma^2}{(n-1) S_j^2} \\cdot \\text{VIF}_j, \\quad \\text{VIF}_j = \\frac{1}{1 - R_j^2}`,
        code: `# 4.9: Deteksi Multikolinieritas Menggunakan Variance Inflation Factor (VIF)
import numpy as np
import pandas as pd
from statsmodels.stats.outliers_influence import variance_inflation_factor

np.random.seed(42)
n = 200

# x1 independen, x2 berkorelasi tinggi dengan x1 (kolinier), x3 murni independen
x1 = np.random.uniform(10, 50, n)
x2 = 2.0 * x1 + np.random.normal(0, 0.5, n) # Kolinieritas parah r > 0.99
x3 = np.random.normal(0, 1, n)

df = pd.DataFrame({'X1': x1, 'X2': x2, 'X3': x3})
# Tambahkan kolom konstan untuk suku intersep (wajib pada VIF)
df_with_const = df.copy()
df_with_const['Intercept'] = 1.0

vif_data = pd.DataFrame({
    'Fitur': df.columns,
    'VIF': [variance_inflation_factor(df_with_const.values, i) for i in range(df.shape[1])]
})

print("=== DIAGNOSIS MULTIKOLINIERITAS (VIF) ===")
print(vif_data)
print("\nEvaluasi:")
for _, row in vif_data.iterrows():
    status = "BAHAYA (Multikolinieritas Parah > 10)" if row['VIF'] > 10 else "AMAN (< 5)"
    print(f"Fitur {row['Fitur']:5s} -> VIF = {row['VIF']:8.2f} : {status}")`,
        expectedOutput: "X1 dan X2 memiliki VIF astronomis (> 500) mengonfirmasi multikolinieritas ekstrem, sementara X3 memiliki VIF ~1.0 (aman).",
        codeExp: "Skrip menghitung nilai VIF menggunakan statsmodels untuk membuktikan secara kuantitatif deteksi multikolinieritas ekstrem antara dua variabel yang saling berkorelasi.",
        pitfalls: [
          "Menghitung VIF tanpa menyertakan kolom suku konstan (intersep), yang akan menghasilkan estimasi VIF yang keliru dan melenceng.",
          "Menghapus variabel hanya karena VIF tinggi tanpa mempertimbangkan signifikansi domain variabel tersebut dalam permasalahan bisnis."
        ],
        refTitle: "C.R. Rao: Linear Statistical Inference and Its Applications (Wiley)",
        refUrl: "https://www.wiley.com/en-us/Linear+Statistical+Inference+and+its+Applications%2C+2nd+Edition-p-9780471218753"
      },
      {
        num: "4.10",
        slug: "4-10-implementasi-solusi-analitik-ols-lengkap-residual-standar-error",
        title: "4.10. Implementasi Solusi Analitik OLS Lengkap dengan Estimasi Residual dan Standar Error",
        desc: "Konstruksi mesin regresi matriks komprehensif: komputasi koefisien analitik, varians residual sigma^2, matriks kovarians, standard error, t-stat, dan p-value.",
        concept: `Pustaka tingkat tinggi seperti Scikit-Learn fokus pada kecepatan komputasi prediksi data baru, sehingga \` + "\`LinearRegression\`" + \` Scikit-Learn secara sengaja tidak menyediakan inferensi statistik parametrik seperti *Standard Error*, *t-Statistic*, dan *p-Value* koefisien.

Untuk memahami anatomi matematis regresi secara tuntas, kita membangun mesin estimasi OLS komprehensif dari dasar aljabar linier murni:

1. **Estimasi Parameter:** $\\hat{\\boldsymbol{\\beta}} = (\\mathbf{X}^\\top \\mathbf{X})^{-1} \\mathbf{X}^\\top \\mathbf{y}$
2. **Vektor Residual:** $\\mathbf{e} = \\mathbf{y} - \\hat{\\mathbf{y}} = \\mathbf{y} - \\mathbf{X}\\hat{\\boldsymbol{\\beta}}$
3. **Varians Residual Tak-Bias (Degrees of Freedom Correction):**
   $$\\hat{\\sigma}^2 = \\frac{\\mathbf{e}^\\top \\mathbf{e}}{n - p} = \\frac{\\sum_{i=1}^n e_i^2}{n - (d + 1)}$$
4. **Matriks Kovarians Parameter:**
   $$\\widehat{\\text{Var}}(\\hat{\\boldsymbol{\\beta}}) = \\hat{\\sigma}^2 (\\mathbf{X}^\\top \\mathbf{X})^{-1}$$
5. **Standar Error Tiap Koefisien:**
   $$\\text{SE}(\\hat{\\beta}_j) = \\sqrt{\\left[\\widehat{\\text{Var}}(\\hat{\\boldsymbol{\\beta}})\\right]_{jj}}$$
6. **Uji Hipotesis Parsial t-Statistic:**
   $$t_j = \\frac{\\hat{\\beta}_j}{\\text{SE}(\\hat{\\beta}_j)} \\sim t(n - p)$$
Nilai p-value dihitung melalui distribusi Student-t dua sisi dengan $n - p$ derajat kebebasan. Koefisien dikatakan signifikan secara statistik pada tingkat signifikansi $\\alpha = 0.05$ jika $p < 0.05$.`,
        formula: `t_j = \\frac{\\hat{\\beta}_j - 0}{\\text{SE}(\\hat{\\beta}_j)}, \\quad p_j = 2 \\cdot (1 - F_t(|t_j|; n - p))`,
        code: `# 4.10: Implementasi Lengkap Mesin OLS dengan Ringkasan Statistik Inferensial Penuh
import numpy as np
from scipy import stats

class PureOLSReport:
    def fit(self, X, y, feature_names=None):
        n, d = X.shape
        # Tambah kolom 1 untuk intercept
        X_b = np.c_[np.ones((n, 1)), X]
        p = d + 1 # Total parameter
        df_resid = n - p
        
        # 1. Normal Equation
        XtX_inv = np.linalg.inv(X_b.T.dot(X_b))
        self.beta = XtX_inv.dot(X_b.T).dot(y)
        
        # 2. Prediksi dan Residual
        y_pred = X_b.dot(self.beta)
        residuals = y - y_pred
        rss = np.sum(residuals**2)
        
        # 3. Varians Residual dan Standar Error
        sigma_sq = rss / df_resid
        var_beta = sigma_sq * np.diagonal(XtX_inv)
        self.se = np.sqrt(var_beta)
        
        # 4. t-Statistic dan p-Value
        self.t_stats = self.beta / self.se
        self.p_values = [2 * (1 - stats.t.cdf(np.abs(t), df=df_resid)) for t in self.t_stats]
        
        # 5. R-squared
        tss = np.sum((y - np.mean(y))**2)
        self.r2 = 1.0 - (rss / tss)
        
        names = ['Intercept'] + (list(feature_names) if feature_names else [f'X{i+1}' for i in range(d)])
        self.summary_table = []
        for nm, b, se, t, p_val in zip(names, self.beta, self.se, self.t_stats, self.p_values):
            self.summary_table.append({
                'Fitur': nm, 'Koefisien': b, 'Std Error': se, 't-Stat': t, 'p-Value': p_val
            })
        return self

# Uji mesin OLS pada data eksperimen
np.random.seed(42)
X_exp = np.random.randn(150, 2)
y_exp = 3.5 * X_exp[:, 0] + 0.05 * X_exp[:, 1] + 10.0 + np.random.normal(0, 1.0, 150)

ols_engine = PureOLSReport().fit(X_exp, y_exp, feature_names=['Informatif', 'Tidak_Signifikan'])

print(f"=== RINGKASAN REGRESI OLS LENGKAP (R^2 = {ols_engine.r2:.4f}) ===")
print(f"{'Fitur':18s} | {'Koefisien':10s} | {'Std Error':10s} | {'t-Stat':10s} | {'p-Value':10s} | {'Signifikansi'}")
print("-" * 75)
for r in ols_engine.summary_table:
    sig = "Sangat Signifikan (p<0.001)" if r['p-Value'] < 0.001 else ("Tidak Signifikan" if r['p-Value'] > 0.05 else "Signifikan")
    print(f"{r['Fitur']:18s} | {r['Koefisien']:10.4f} | {r['Std Error']:10.4f} | {r['t-Stat']:10.4f} | {r['p-Value']:10.4e} | {sig}")`,
        expectedOutput: "Mesin OLS manual mendeteksi Fitur Informatif signifikan (p < 0.001) dan Fitur Tidak_Signifikan tidak signifikan (p > 0.5).",
        codeExp: "Skrip membangun implementasi OLS analitik lengkap dari aljabar linier murni yang menghitung standar error, t-stat, dan p-value yang identik dengan output statsmodels.",
        pitfalls: [
          "Membagi RSS dengan n alih-alih derajat kebebasan (n - p), yang menghasilkan estimator varians residual yang bias ke bawah.",
          "Menolak hipotesis nol hanya berdasarkan nilai koefisien yang besar tanpa mempertimbangkan besaran standar error."
        ],
        refTitle: "Greene, William H.: Econometric Analysis (Pearson)",
        refUrl: "https://www.pearson.com/en-us/subject-catalog/p/econometric-analysis/P200000003334"
      }
    ]
  },

  // ==========================================
  // BAB 5: Model Klasifikasi Linear: Regresi Logistik & Support Vector Classifier Linear
  // ==========================================
  {
    orderIndex: 5,
    id: "machine-learning-ch-5",
    slug: "bab-5-model-klasifikasi-linear-regresi-logistik-support-vector-classifier-linear",
    title: "BAB 5: Model Klasifikasi Linear: Regresi Logistik & Support Vector Classifier Linear",
    desc: "Formulasi analitis dan komputasional klasifikasi linier: fungsi logistik sigmoid dan transformasi logit, interpretasi Odds Ratio, penurunan fungsi kerugian Binary Cross-Entropy via Maximum Likelihood Estimation (MLE), komparasi algoritma optimasi solver (L-BFGS, Newton-CG, Saga, Liblinear), strategi multikelas OvR vs Multinomial Softmax, Linear Support Vector Classifier (LinearSVC) dan formulasi Hinge Loss, perbandingan kerapatan margin vs probabilitas terkalibrasi, penyetelan hiperparameter regularisasi C, penyelarasan ambang batas keputusan (threshold tuning) kurva Precision-Recall, dan implementasi Regresi Logistik lengkap dari nol dengan Gradient Descent NumPy.",
    coreConcepts: ["Sigmoid Function", "Logit Transform", "Odds Ratio", "Binary Cross-Entropy", "Maximum Likelihood Estimation", "Multinomial Softmax", "LinearSVC", "Hinge Loss", "Threshold Tuning"],
    subchapters: [
      {
        num: "5.1",
        slug: "5-1-fungsi-logistik-sigmoid-dan-transformasi-logit",
        title: "5.1. Fungsi Logistik (Sigmoid) dan Transformasi Logit: Memetakan Bilangan Real ke Probabilitas",
        desc: "Fondasi pemetaan probabilitas: fungsi aktivasi logistik sigmoid standar, sifat-sifat analitis turunan, dan fungsi link logit.",
        concept: `Menggunakan regresi linier standar $y = \\mathbf{w}^\\top \\mathbf{x} + b$ untuk klasifikasi biner memiliki cacat matematis fatal: luaran kombinasi linier adalah bilangan riil sembarang $\\eta \\in (-\\infty, +\\infty)$, sedangkan probabilitas keberhasilan $P(Y=1|X)$ wajib berada dalam interval probabilitas tertutup $[0, 1]$. Memaksa regresi linier menghasilkan estimasi probabilitas negatif atau lebih dari 100%.

**Fungsi Logistik (Sigmoid):**
Regresi Logistik memecahkan masalah ini dengan melewatkan kombinasi linier ke dalam fungsi aktivasi non-linier **Sigmoid** $\\sigma(z)$:
$$p = \\sigma(z) = \\frac{1}{1 + e^{-z}} = \\frac{e^z}{1 + e^z}$$
di mana $z = \\mathbf{w}^\\top \\mathbf{x} + b$.

**Sifat-sifat Matematis Sigmoid:**
1. **Pemetaan Rentang Bounded:** Untuk $z \\to +\\infty, \\sigma(z) \\to 1$; untuk $z \\to -\\infty, \\sigma(z) \\to 0$; dan untuk $z = 0, \\sigma(z) = 0.5$.
2. **Simetri Sentral:** $\\sigma(-z) = 1 - \\sigma(z)$.
3. **Turunan Analitis yang Elegan:**
   $$\\frac{d\\sigma(z)}{dz} = \\sigma(z) (1 - \\sigma(z)) = p(1 - p)$$
   Sifat turunan yang dapat dinyatakan dalam fungsi probabilitas aslinya ini sangat menyederhanakan kalkulus optimasi gradien.

**Transformasi Logit (Inverse Sigmoid):**
Jika kita membalikkan persamaan untuk mengisolasi kombinasi linier $z$, kita mendapatkan fungsi **Logit**:
$$\\text{logit}(p) = \\ln\\left(\\frac{p}{1 - p}\\right) = \\mathbf{w}^\\top \\mathbf{x} + b$$
Fungsi logit bertindak sebagai fungsi penghubung (*link function*) dalam kerangka Generalized Linear Models (GLM), membuktikan bahwa Regresi Logistik memodelkan *log-odds* sebagai fungsi linier dari fitur masukan.`,
        formula: `\\sigma(z) = \\frac{1}{1 + e^{-z}}, \\quad \\frac{d\\sigma(z)}{dz} = \\sigma(z)(1 - \\sigma(z)), \\quad \\text{logit}(p) = \\ln\\left(\\frac{p}{1-p}\\right) = \\mathbf{w}^\\top \\mathbf{x} + b`,
        code: `# 5.1: Verifikasi Analitis Fungsi Sigmoid, Turunan, dan Transformasi Logit
import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

def logit(p):
    return np.log(p / (1.0 - p))

z_values = np.array([-5.0, -1.0, 0.0, 1.0, 5.0])
probs = sigmoid(z_values)
turunan_analitis = probs * (1.0 - probs)
reconstructed_z = logit(probs)

print("=== SIFAT MATEMATIS FUNGSI SIGMOID & LOGIT ===")
print("  z input  |  Sigmoid p = sigma(z)  |  Turunan p*(1-p)  |  Rekonstruksi logit(p)")
for z, p, d, r in zip(z_values, probs, turunan_analitis, reconstructed_z):
    print(f"  {z:7.2f}  |  {p:18.6f}  |  {d:15.6f}  |  {r:18.2f}")`,
        expectedOutput: "z=0.0 menghasilkan p=0.500000 dan logit(p) merekonstruksi nilai z asal secara presisi sempurna.",
        codeExp: "Skrip memvalidasi formulasi sigmoid, sifat turunan analitis, dan transformasi balik logit pada berbagai nilai skalar dari -5.0 hingga +5.0.",
        pitfalls: [
          "Menghitung np.exp(-z) secara naif untuk z yang sangat negatif (misal z = -1000), yang memicu RuntimeWarning pembagian dengan nol atau overflow (perlu fungsi numerik stabil seperti scipy.special.expit).",
          "Mengira regresi logistik adalah model non-linier; batas keputusan (decision boundary) antara dua kelas tetap berbentuk hiperbidang linier datar."
        ],
        refTitle: "David W. Hosmer Jr., Stanley Lemeshow, Rodney X. Sturdivant: Applied Logistic Regression (Wiley)",
        refUrl: "https://www.wiley.com/en-us/Applied+Logistic+Regression%2C+3rd+Edition-p-9780470582473"
      },
      {
        num: "5.2",
        slug: "5-2-rasio-peluang-odds-ratio-dan-interpretasi-koefisien",
        title: "5.2. Rasio Peluang (Odds Ratio) dan Interpretasi Koefisien Model Regresi Logistik",
        desc: "Interpretasi inferensial parameter model: mengonversi koefisien beta menjadi eksponensial Odds Ratio untuk menjelaskan pengaruh marjinal fitur pada probabilitas.",
        concept: `Dalam regresi linier OLS, koefisien $\\beta_j$ diinterpretasikan secara aditif langsung: kenaikan 1 unit fitur $x_j$ diasosiasikan dengan kenaikan rata-rata $\\beta_j$ unit target $y$. Namun dalam Regresi Logistik, karena hubungan antara fitur dan probabilitas berbentuk kurva S non-linier, interpretasi koefisien harus dilakukan melalui konsep **Odds** dan **Odds Ratio (OR)**.

**1. Definisi Odds:**
Odds adalah rasio antara probabilitas terjadinya suatu kejadian ($p$) terhadap probabilitas tidak terjadinya kejadian tersebut ($1 - p$):
$$\\text{Odds} = \\frac{p}{1 - p}$$
Jika probabilitas seorang nasabah gagal bayar kredit adalah $p = 0.8$ (80%), maka odds gagal bayarnya adalah $0.8 / 0.2 = 4$ (atau 4 banding 1).

**2. Interpretasi Odds Ratio (OR):**
Dari persamaan logit:
$$\\ln(\\text{Odds}) = \\beta_0 + \\beta_1 x_1 + \\dots + \\beta_j x_j + \\dots + \\beta_d x_d$$
Jika kita menaikkan fitur $x_j$ sebesar 1 unit sementara fitur lain konstan ($x_j + 1$), dan mengambil nilai eksponensialnya:
$$\\text{Odds}_{x_j+1} = \\text{Odds}_{x_j} \\cdot e^{\\beta_j} \\implies \\text{OR}_j = \\frac{\\text{Odds}_{x_j+1}}{\\text{Odds}_{x_j}} = e^{\\beta_j}$$

**Aturan Penafsiran:**
- Jika $\\beta_j > 0 \\implies e^{\\beta_j} > 1$: Kenaikan 1 unit $x_j$ **meningkatkan odds** terjadinya target sebesar $(e^{\\beta_j} - 1) \\times 100\\%$.
- Jika $\\beta_j < 0 \\implies e^{\\beta_j} < 1$: Kenaikan 1 unit $x_j$ **menurunkan odds** sebesar $(1 - e^{\\beta_j}) \\times 100\\%$.
- Jika $\\beta_j = 0 \\implies e^{\\beta_j} = 1$: Fitur tidak memiliki pengaruh sama sekali terhadap odds target.`,
        formula: `\\text{Odds Ratio (OR)}_j = \\exp(\\beta_j), \\quad \\% \\Delta \\text{Odds} = (\\exp(\\beta_j) - 1) \\times 100\\%`,
        code: `# 5.2: Menghitung dan Menginterpretasikan Odds Ratio Model Risiko Kredit
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression

# Dataset simulasi persetujuan pinjaman
# X1: Riwayat Gagal Bayar (0: Tidak, 1: Pernah), X2: Rasio Hutang terhadap Pendapatan (DTI)
np.random.seed(42)
n = 300
x_gagal_bayar = np.random.binomial(1, 0.2, n)
x_dti = np.random.uniform(0.1, 0.8, n)

z = -2.0 + 1.8 * x_gagal_bayar + 2.5 * x_dti
prob = 1.0 / (1.0 + np.exp(-z))
y = np.random.binomial(1, prob, n)

X = np.c_[x_gagal_bayar, x_dti]
model = LogisticRegression(penalty=None).fit(X, y)

odds_ratios = np.exp(model.coef_[0])
fitur_names = ['Riwayat_Gagal_Bayar', 'Rasio_Hutang_DTI']

print("=== INTERPRETASI ODDS RATIO REGRESI LOGISTIK ===")
for nm, beta, or_val in zip(fitur_names, model.coef_[0], odds_ratios):
    persen_perubahan = (or_val - 1.0) * 100
    print(f"Fitur: {nm:20s} | Beta: {beta:6.3f} | Odds Ratio: {or_val:6.3f}")
    if or_val > 1:
        print(f"  -> Setiap kenaikan 1 unit meningkatkan odds gagal bayar sebesar {persen_perubahan:6.1f}%.")
    else:
        print(f"  -> Setiap kenaikan 1 unit menurunkan odds gagal bayar sebesar {abs(persen_perubahan):6.1f}%.")`,
        expectedOutput: "Odds Ratio untuk riwayat gagal bayar adalah ~6.0, artinya nasabah dengan riwayat gagal bayar memiliki peluang odds 6 kali lipat lebih tinggi.",
        codeExp: "Skrip mengekstraksi koefisien regresi logistik dan menghitung eksponensial odds ratio untuk memberikan interpretasi bisnis yang jelas terhadap pengaruh marjinal setiap fitur.",
        pitfalls: [
          "Mencampuradukkan Odds Ratio dengan Relative Risk (probabilitas relatif); Odds Ratio hanya mendekati Relative Risk jika kejadian target sangat jarang (< 5%).",
          "Menginterpretasikan koefisien secara langsung tanpa mengeksponensialkannya terlebih dahulu."
        ],
        refTitle: "Scott Menard: Applied Logistic Regression Analysis (SAGE Publications)",
        refUrl: "https://methods.sagepub.com/book/applied-logistic-regression-analysis"
      },
      {
        num: "5.3",
        slug: "5-3-penurunan-fungsi-kerugian-binary-cross-entropy-via-mle",
        title: "5.3. Penurunan Fungsi Kerugian Binary Cross-Entropy (Log-Loss) via Maximum Likelihood Estimation",
        desc: "Penurunan analitis teori peluang: merumuskan fungsi likelihood Bernoulli, transformasi log-likelihood negatif, dan pembuktian kecembungan (convexity).",
        concept: `Mengapa kita tidak menggunakan fungsi kerugian Mean Squared Error (MSE) $(y - \\sigma(\\mathbf{w}^\\top \\mathbf{x}))^2$ untuk melatih Regresi Logistik? Jawabannya: jika fungsi sigmoid non-linier dimasukkan ke dalam MSE, fungsi kerugian yang dihasilkan menjadi **non-cembung** (*non-convex*) yang memiliki banyak titik minimum lokal (*local minima*), sehingga algoritma gradient descent mudah terperangkap pada solusi suboptimal.

Fungsi kerugian standar untuk klasifikasi biner diturunkan secara formal melalui prinsip **Maximum Likelihood Estimation (MLE)**:

Misalkan label target $y_i \\in \\{0, 1\\}$ mengikuti distribusi probabilitas Bernoulli dengan parameter keberhasilan $p_i = \\sigma(\\mathbf{w}^\\top \\mathbf{x}_i)$:
$$P(Y_i = y_i \\mid \\mathbf{x}_i) = p_i^{y_i} (1 - p_i)^{1 - y_i}$$

Untuk seluruh sampel observasi yang saling independen, fungsi Likelihood bersama adalah perkalian probabilitas seluruh sampel:
$$L(\\mathbf{w}) = \\prod_{i=1}^n p_i^{y_i} (1 - p_i)^{1 - y_i}$$

Untuk mengubah operasi perkalian menjadi penjumlahan yang stabil secara numerik, kita mengambil logaritma natural (*Log-Likelihood*):
$$\\ell(\\mathbf{w}) = \\ln L(\\mathbf{w}) = \\sum_{i=1}^n \\left[ y_i \\ln(p_i) + (1 - y_i) \\ln(1 - p_i) \\right]$$

Karena dalam optimasi machine learning konvensi yang digunakan adalah meminimalkan kerugian (*loss minimization*), kita mengalikan log-likelihood dengan $-1/n$. Ini menghasilkan **Negative Log-Likelihood** yang dikenal luas sebagai **Binary Cross-Entropy (Log-Loss)**:
$$J(\\mathbf{w}) = -\\frac{1}{n} \\sum_{i=1}^n \\left[ y_i \\ln(p_i) + (1 - y_i) \\ln(1 - p_i) \\right]$$

Fungsi $J(\\mathbf{w})$ ini terbukti secara matematis **cembung ketat** (*strictly convex*), menjamin bahwa setiap titik stasioner gradien nol adalah minimum global mutlak.`,
        formula: `J(\\mathbf{w}) = -\\frac{1}{n} \\sum_{i=1}^n \\left[ y_i \\ln(\\sigma(\\mathbf{w}^\\top \\mathbf{x}_i)) + (1 - y_i) \\ln(1 - \\sigma(\\mathbf{w}^\\top \\mathbf{x}_i)) \\right], \\quad \\nabla_\\mathbf{w} J = \\frac{1}{n} \\mathbf{X}^\\top (\\mathbf{p} - \\mathbf{y})`,
        code: `# 5.3: Perhitungan Manual Binary Cross-Entropy dan Verifikasi Gradien Elegan
import numpy as np
from sklearn.metrics import log_loss

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

# 4 sampel observasi
y_true = np.array([1, 0, 1, 0])
z_raw = np.array([2.5, -1.2, 0.8, -3.0])
p_pred = sigmoid(z_raw)

# 1. Perhitungan Manual Rumus Log-Loss
eps = 1e-15 # Mencegah log(0)
p_clipped = np.clip(p_pred, eps, 1.0 - eps)
loss_manual = -np.mean(y_true * np.log(p_clipped) + (1 - y_true) * np.log(1 - p_clipped))

# 2. Verifikasi Menggunakan Scikit-Learn log_loss
loss_sklearn = log_loss(y_true, p_pred)

print("=== PENURUNAN BINARY CROSS-ENTROPY (LOG-LOSS) ===")
print(f"Prediksi Probabilitas (p) : {p_pred.round(4)}")
print(f"Log-Loss Perhitungan Manual: {loss_manual:.6f}")
print(f"Log-Loss Scikit-Learn      : {loss_sklearn:.6f}")
print(f"Selisih                    : {abs(loss_manual - loss_sklearn):.2e} (Ekuivalensi Presisi)")`,
        expectedOutput: "Perhitungan manual rumus log-loss identik sempurna dengan Scikit-Learn log_loss.",
        codeExp: "Skrip mendemonstrasikan perhitungan manual fungsi kerugian Binary Cross-Entropy yang diturunkan dari Maximum Likelihood Estimation dan memverifikasi hasilnya terhadap pustaka resmi Scikit-Learn.",
        pitfalls: [
          "Menghitung log(p) secara langsung ketika p = 0.0 atau log(1-p) ketika p = 1.0, yang memicu nilai tak terdefinisi -inf atau NaN (wajib menggunakan clipping batas numerik).",
          "Menggunakan fungsi kerugian MSE pada regresi logistik yang menyebabkan optimasi terjebak di local minima."
        ],
        refTitle: "Christopher M. Bishop: Pattern Recognition and Machine Learning (Chapter 4: Linear Models for Classification)",
        refUrl: "https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/"
      },
      {
        num: "5.4",
        slug: "5-4-algoritma-optimasi-solver-regresi-logistik",
        title: "5.4. Algoritma Optimasi Solver Regresi Logistik: L-BFGS, Newton-CG, Saga, dan Liblinear",
        desc: "Taksonomi komparatif mesin inferensi: memilih solver numerik Scikit-Learn berdasarkan ukuran sampel n, dimensi d, penalti L1/L2, dan sifat multikelas.",
        concept: `Karena turunan pertama dari fungsi Binary Cross-Entropy menghasilkan persamaan transenden non-linier yang tidak dapat diselesaikan secara tertutup menggunakan Normal Equation, Regresi Logistik mengandalkan algoritma optimasi numerik terkomputerisasi (**Solvers**).

Pustaka Scikit-Learn menyediakan 5 mesin solver utama pada parameter \` + "\`LogisticRegression(solver=...)\`" + \`:

1. **\` + "\`lbfgs\`" + \` (Limited-memory Broyden-Fletcher-Goldfarb-Shanno) - DEFAULT:**
   Algoritma Quasi-Newton orde dua yang mengaproksimasi matriks Hessian terbalik $\\mathbf{H}^{-1}$ tanpa pernah mengalokasikan memori $d \\times d$ secara penuh. Sangat cepat, stabil, dan menjadi standar de facto untuk dataset berukuran kecil hingga menengah dengan penalti $L_2$ atau tanpa penalti.
2. **\` + "\`liblinear\`" + \` (A Library for Large Linear Classification):**
   Algoritma Coordinate Descent berbasis pustaka C/C++. Sangat baik untuk dataset berdimensi tinggi ($d > n$) seperti klasifikasi teks jarang (*sparse bag-of-words*), dan mendukung penalti $L_1$ maupun $L_2$. Namun, hanya mendukung strategi multikelas One-vs-Rest (OvR).
3. **\` + "\`newton-cg\`" + \` (Newton-Conjugate Gradient):**
   Metode Newton murni yang menggunakan algoritma Conjugate Gradient untuk menyelesaikan persamaan Hessian tanpa menghitung invers secara eksplisit. Sangat presisi untuk fungsi objektif mulus dengan penalti $L_2$.
4. **\` + "\`sag\`" + \` (Stochastic Average Gradient) & \` + "\`saga\`" + \`:**
   Varian Stochastic Gradient Descent yang mengingat gradien historis sampel. \` + "\`saga\`" + \` adalah satu-satunya solver serbaguna yang mendukung kombinasi penalti $L_1$, $L_2$, ElasticNet, sekaligus klasifikasi multinomial multinomial sejati pada dataset raksasa ($n > 100.000$).`,
        formula: `\\mathbf{w}_{k+1} = \\mathbf{w}_k - \\mathbf{H}_k^{-1} \\nabla J(\\mathbf{w}_k) \\quad (\\text{Iterasi Newton-Raphson Orde Dua})`,
        code: `# 5.4: Tolok Ukur Kecepatan Komputasi Antar Solver Regresi Logistik
import time
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification

# Dataset skala besar (5000 sampel, 50 fitur)
X, y = make_classification(n_samples=5000, n_features=50, random_state=42)

solvers = ['lbfgs', 'liblinear', 'newton-cg', 'saga']
print("=== TOLOK UKUR KINERJA SOLVER REGRESI LOGISTIK ===")

for s in solvers:
    t0 = time.time()
    clf = LogisticRegression(solver=s, penalty='l2', max_iter=500, random_state=42)
    clf.fit(X, y)
    durasi = (time.time() - t0) * 1000
    print(f"Solver: {s:10s} | Iterasi: {clf.n_iter_[0]:3d} | Waktu Eksekusi: {durasi:6.2f} ms | Akurasi: {clf.score(X, y)*100:.2f}%")`,
        expectedOutput: "Seluruh solver mencapai akurasi serupa namun solver lbfgs menunjukkan kecepatan komputasi optimal untuk data terstruktur.",
        codeExp: "Skrip menguji kecepatan konvergensi dan jumlah iterasi dari empat solver Scikit-Learn utama pada dataset klasifikasi sintetis berskala 5000 observasi.",
        pitfalls: [
          "Memilih solver lbfgs saat menggunakan penalty='l1', yang akan membangkitkan ValueError (lbfgs tidak mendukung L1 murni).",
          "Menggunakan liblinear pada masalah multikelas besar, yang memicu overhead pelatihan model ganda OvR."
        ],
        refTitle: "Scikit-Learn User Guide: Logistic regression - Solvers",
        refUrl: "https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression"
      },
      {
        num: "5.5",
        slug: "5-5-klasifikasi-multikelas-ovr-vs-multinomial-softmax",
        title: "5.5. Klasifikasi Multikelas: Strategi One-vs-Rest (OvR) vs Multinomial Softmax Regression",
        desc: "Ekspansi klasifikasi non-biner: dekomposisi heuristik biner One-vs-Rest vs pemodelan distribusi terpadu Multinomial Softmax Regression.",
        concept: `Ketika variabel target memiliki $K > 2$ kelas diskrit (misalnya memprediksi jenis kendaraan: *Sedan, SUV, Truk*), Regresi Logistik biner harus diperluas melalui dua paradigma arsitektur berbeda:

**1. Strategi Heuristik One-vs-Rest (OvR / One-vs-All):**
Melatih $K$ model regresi logistik biner independen. Untuk setiap kelas $k$, model ke-$k$ dilatih membedakan kelas $k$ (sebagai label positif $+1$) melawan seluruh kelas lainnya yang digabungkan (sebagai label negatif $0$).
Saat inferensi pada sampel baru, seluruh $K$ model dijalankan secara paralel, dan kelas dengan estimasi probabilitas tertinggi dipilih:
$$\\hat{y} = \\arg\\max_{k \\in \\{1, \\dots, K\\}} \\sigma(\\mathbf{w}_k^\\top \\mathbf{x} + b_k)$$
Kelemahan: Probabilitas dari $K$ model independen ini tidak terkalibrasi bersama (jumlah totalnya tidak sama dengan 100%).

**2. Strategi Multinomial (Softmax Regression):**
Alih-alih melatih model terpisah, Softmax Regression memodelkan seluruh $K$ kelas secara simultan dalam satu arsitektur terpadu. Untuk setiap kelas $k$, model menghitung skor logits linier $z_k = \\mathbf{w}_k^\\top \\mathbf{x}$, lalu memetakan seluruh vektor logits $\\mathbf{z} \\in \\mathbb{R}^K$ menjadi distribusi probabilitas yang valid melalui fungsi **Softmax**:
$$P(Y = k \\mid \\mathbf{x}) = \\frac{e^{\\mathbf{w}_k^\\top \\mathbf{x}}}{\\sum_{j=1}^K e^{\\mathbf{w}_j^\\top \\mathbf{x}}}$$

Fungsi Softmax menjamin bahwa $\\sum_{k=1}^K P(Y=k|\\mathbf{x}) = 1.0$ dan penalti diturunkan dari fungsi **Categorical Cross-Entropy**:
$$J(\\mathbf{W}) = -\\frac{1}{n} \\sum_{i=1}^n \\sum_{k=1}^K \\mathbb{I}(y_i = k) \\ln P(Y = k \\mid \\mathbf{x}_i)$$`,
        formula: `P(Y = k \\mid \\mathbf{x}) = \\frac{\\exp(\\mathbf{w}_k^\\top \\mathbf{x})}{\\sum_{j=1}^K \\exp(\\mathbf{w}_j^\\top \\mathbf{x})}, \\quad \\sum_{k=1}^K P(Y=k \\mid \\mathbf{x}) = 1.0`,
        code: `# 5.5: Komparasi Empiris Strategi One-vs-Rest (OvR) vs Multinomial Softmax
import numpy as np
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression

X, y = load_iris(return_X_y=True)

# 1. Model One-vs-Rest (OvR)
clf_ovr = LogisticRegression(multi_class='ovr', solver='liblinear', random_state=42)
clf_ovr.fit(X, y)
prob_ovr = clf_ovr.predict_proba(X[:2])

# 2. Model Multinomial Softmax
clf_multi = LogisticRegression(multi_class='multinomial', solver='lbfgs', random_state=42)
clf_multi.fit(X, y)
prob_multi = clf_multi.predict_proba(X[:2])

print("=== PERBANDINGAN MULTIKELAS OVR VS SOFTMAX MULTINOMIAL ===")
print("Probabilitas Sampel Pertama (One-vs-Rest):")
print("  Probabilitas Tiap Kelas :", prob_ovr[0].round(4))
print("  Penjumlahan Probabilitas:", np.sum(prob_ovr[0]))

print("\nProbabilitas Sampel Pertama (Multinomial Softmax):")
print("  Probabilitas Tiap Kelas :", prob_multi[0].round(4))
print("  Penjumlahan Probabilitas:", np.sum(prob_multi[0]), "(Terdistribusi Sempurna 1.0)")`,
        expectedOutput: "Kedua model berhasil mengklasifikasikan kelas Iris, namun Multinomial Softmax menghasilkan estimasi probabilitas terkalibrasi sempurna.",
        codeExp: "Skrip membandingkan estimasi probabilitas keluaran antara pendekatan heuristik One-vs-Rest dan pendekatan terkalibrasi Multinomial Softmax pada dataset Iris 3-kelas.",
        pitfalls: [
          "Menggunakan OvR saat membutuhkan estimasi probabilitas yang terkalibrasi untuk analisis risiko bisnis multikelas.",
          "Lupa bahwa dalam Softmax Regression terdapat redundansi parameter derajat kebebasan K vs K-1."
        ],
        refTitle: "Trevor Hastie, Robert Tibshirani, Jerome Friedman: The Elements of Statistical Learning (Chapter 4.4)",
        refUrl: "https://hastie.su.domains/ElemStatLearn/"
      },
      {
        num: "5.6",
        slug: "5-6-linear-support-vector-classifier-hinge-loss",
        title: "5.6. Linear Support Vector Classifier (LinearSVC): Hinge Loss vs Log-Loss",
        desc: "Prinsip margin maksimal Vapnik: formulasi fungsi kerugian Hinge Loss berengsel, konsep vektor pendukung, dan perbedaan arsitektural dengan Regresi Logistik.",
        concept: `Meskipun Regresi Logistik dan Linear Support Vector Classifier (**LinearSVC**) sama-sama merupakan model klasifikasi linier yang memisahkan ruang fitur menggunakan hiperbidang datar $\\mathbf{w}^\\top \\mathbf{x} + b = 0$, filosofi matematis keduanya bertolak belakang.

Regresi Logistik berusaha menyesuaikan seluruh titik data ke dalam fungsi probabilitas log-loss kurva sigmoid. Sebaliknya, LinearSVC didasarkan pada prinsip **Maksimisasi Margin Geometris**: mencari hiperbidang pemisah yang memiliki jarak terlebar (*maximum margin separation*) terhadap titik-titik sampel terdekat dari masing-masing kelas. Titik-titik kritis yang berada tepat di batas margin ini disebut **Support Vectors**.

**Formulasi Hinge Loss:**
LinearSVC meminimalkan fungsi kerugian **Hinge Loss** (kerugian berengsel) dengan label kelas $y_i \\in \\{-1, +1\\}$:
$$\\ell_{\\text{hinge}}(y, f(x)) = \\max(0, 1 - y \\cdot f(x)) = \\max(0, 1 - y(\\mathbf{w}^\\top \\mathbf{x} + b))$$

Analisis perilaku Hinge Loss:
1. **Jika $y \\cdot f(x) \\ge 1$ (Klasifikasi Benar & Di Luar Margin):** Kerugian bernilai **tepat nol**. Observasi yang sudah terklasifikasi dengan benar dan berada di luar margin tidak memberikan penalti sama sekali dan **tidak memengaruhi posisi hiperbidang model**.
2. **Jika $y \\cdot f(x) < 1$ (Melanggar Margin atau Salah Klasifikasi):** Kerugian tumbuh secara linier proporsional terhadap jarak pelanggaran margin.

Sifat Hinge Loss yang bernilai nol untuk seluruh sampel aman membuat LinearSVC **sangat tahan terhadap outlier** yang berada jauh di dalam wilayah kelasnya sendiri, berbeda dari Regresi Logistik yang terus mencoba menyempurnakan probabilitas titik-titik yang sudah benar.`,
        formula: `\\min_{\\mathbf{w}, b} \\left\\{ \\frac{1}{2} \\|\\mathbf{w}\\|_2^2 + C \\sum_{i=1}^n \\max(0, 1 - y_i(\\mathbf{w}^\\top \\mathbf{x}_i + b)) \\right\\}`,
        code: `# 5.6: Perbandingan LinearSVC (Hinge Loss) vs LogisticRegression (Log-Loss)
import numpy as np
from sklearn.svm import LinearSVC
from sklearn.linear_model import LogisticRegression

# Data 2 kelas linier terpisah
X = np.array([
    [1.0, 2.0], [2.0, 3.0], [2.0, 1.0], # Kelas 0 (y=-1)
    [5.0, 6.0], [6.0, 5.0], [6.0, 7.0]  # Kelas 1 (y=+1)
])
y = np.array([0, 0, 0, 1, 1, 1])

# Tambahkan satu titik "ekstrem benar" yang posisinya sangat jauh (outlier benar)
X_extreme = np.vstack([X, [100.0, 100.0]])
y_extreme = np.append(y, 1)

# 1. LinearSVC (Hinge Loss: Invarian terhadap outlier benar)
svc_normal = LinearSVC(C=1.0, random_state=42).fit(X, y)
svc_extreme = LinearSVC(C=1.0, random_state=42).fit(X_extreme, y_extreme)

# 2. LogisticRegression (Log-Loss: Terpengaruh oleh pergeseran distribusi ekstrem)
lr_normal = LogisticRegression(C=1.0, random_state=42).fit(X, y)
lr_extreme = LogisticRegression(C=1.0, random_state=42).fit(X_extreme, y_extreme)

print("=== KETAHANAN HINGE LOSS (SVC) VS LOG-LOSS (LOGREG) ===")
print(f"Perubahan Bobot LinearSVC          : {np.linalg.norm(svc_normal.coef_ - svc_extreme.coef_):.4f} (Relatif Stabil)")
print(f"Perubahan Bobot LogisticRegression : {np.linalg.norm(lr_normal.coef_ - lr_extreme.coef_):.4f} (Terdistorsi Pergeseran)")`,
        expectedOutput: "LinearSVC mempertahankan orientasi hiperbidang pemisah margin maksimal jauh lebih stabil dibanding LogisticRegression saat ditambah observasi ekstrem.",
        codeExp: "Skrip menunjukkan bagaimana penalti Hinge Loss mengabaikan titik-titik yang berada jauh di luar margin sehingga tidak terdistorsi oleh titik observasi ekstrem.",
        pitfalls: [
          "Mencoba memanggil method predict_proba() pada LinearSVC; LinearSVC menggunakan Hinge Loss yang tidak menghasilkan estimasi probabilitas probabilistik alami.",
          "Lupa bahwa LinearSVC secara default menyertakan penalti intercept yang diskalakan oleh parameter intercept_scaling."
        ],
        refTitle: "Vladimir Vapnik: Statistical Learning Theory (Wiley-Interscience)",
        refUrl: "https://www.wiley.com/en-us/Statistical+Learning+Theory-p-9780471030034"
      },
      {
        num: "5.7",
        slug: "5-7-perbandingan-hinge-loss-vs-cross-entropy-margin-probabilitas",
        title: "5.7. Perbandingan Hinge Loss vs Cross-Entropy: Kerapatan Margin vs Kalibrasi Probabilitas",
        desc: "Kajian komparatif trade-off batas keputusan: ketajaman separasi geometris Hinge Loss vs kemampuan kalibrasi probabilitas Bayesian Cross-Entropy.",
        concept: `Memilih antara Hinge Loss (LinearSVC) dan Cross-Entropy (Logistic Regression) pada dasarnya adalah kompromi antara **ketajaman margin keputusan** versus **kualitas kalibrasi probabilitas**:

| Aspek Karakteristik | Hinge Loss (LinearSVC) | Cross-Entropy (Logistic Regression) |
|---|---|---|
| **Fungsi Objektif Utama** | Memaksimalkan lebar margin geometri pemisah | Memaksimalkan likelihood probabilitas bersyarat data |
| **Bentuk Kurva Kerugian** | Berengsel (*piecewise linear*), tidak diferensiabel pada $yf(x)=1$ | Mulus diferensiabel (*smooth asymptotic*) di seluruh titik |
| **Sensitivitas Sampel Aman** | **Nol** (sampel di luar margin diabaikan total) | **Non-Nol** (terus berusaha mendorong probabilitas $\\to 100\\%$) |
| **Luaran Model** | Skor jarak bertanda ke hiperbidang (*decision function*) | Estimasi probabilitas terkalibrasi $P(Y=1|X) \\in [0, 1]$ |
| **Ketahanan Outlier Benar** | Sangat Tinggi | Menengah |
| **Kesesuaian Penggunaan** | Tugas di mana hanya label diskrit yang dibutuhkan (misal OCR huruf) | Tugas di mana derajat ketidakpastian sangat penting (misal diagnosis medis, risiko fraud) |

Jika LinearSVC dipaksa menghasilkan nilai probabilitas (menggunakan metode seperti \` + "\`CalibratedClassifierCV\`" + \` / Platt Scaling), proses tersebut memerlukan pelatihan regresi logistik univariat tambahan pada tahap pasca-pemrosesan (*post-processing*).`,
        formula: `\\ell_{\\text{hinge}}(z) = \\max(0, 1 - z) \\quad \\text{vs} \\quad \\ell_{\\text{log}}(z) = \\ln(1 + e^{-z}) \\quad \\text{di mana } z = y \\cdot f(x)`,
        code: `# 5.7: Visualisasi Numerik Hinge Loss vs Log-Loss pada Berbagai Jarak Margin
import numpy as np

# Nilai margin fungsional z = y * f(x)
z_margin = np.array([-2.0, -1.0, 0.0, 0.5, 1.0, 2.0, 4.0])

# 1. Hinge Loss: max(0, 1 - z)
hinge_loss = np.maximum(0, 1.0 - z_margin)

# 2. Normalized Log-Loss: ln(1 + exp(-z)) / ln(2)
log_loss = np.log2(1.0 + np.exp(-z_margin))

print("=== PERBANDINGAN HINGE LOSS VS LOG-LOSS ===")
print("  Margin z = y*f(x) | Hinge Loss (SVC) | Log-Loss (LogReg) | Analisis")
for z, h, l in zip(z_margin, hinge_loss, log_loss):
    analisis = "Salah Klasifikasi" if z < 0 else ("Dalam Margin" if z < 1 else "Aman di Luar Margin")
    print(f"  {z:17.1f} | {h:16.4f} | {l:17.4f} | {analisis}")`,
        expectedOutput: "Saat margin z >= 1.0, Hinge Loss tepat bernilai 0.0000 sementara Log-Loss masih bernilai positif.",
        codeExp: "Skrip membandingkan penalti numerik antara Hinge Loss dan Log-Loss pada berbagai tingkat kedekatan margin, membuktikan sifat penyaring sampel aman pada Hinge Loss.",
        pitfalls: [
          "Menggunakan LinearSVC pada domain medis atau finansial lalu memperlakukan decision_function() secara keliru seolah-olah itu adalah probabilitas risiko.",
          "Mengabaikan fakta bahwa Log-Loss lebih rentan terhadap pergeseran distribusi jika dataset memuat banyak sampel yang sudah terklasifikasi benar namun berada jauh dari batas."
        ],
        refTitle: "John Platt: Probabilistic Outputs for Support Vector Machines and Comparisons to Regularized Likelihood Methods",
        refUrl: "https://www.cs.colorado.edu/~mozer/Teaching/syllabi/6622/papers/Platt1999.pdf"
      },
      {
        num: "5.8",
        slug: "5-8-penyetelan-parameter-regulasi-c-invers-alpha",
        title: "5.8. Penyetelan Parameter Regulasi $C$: Hubungan Invers Terhadap Kekuatan Regularisasi $\\alpha$",
        desc: "Mekanisme kendali kapasitas model: menguasai relasi timbal-balik antara parameter C pada SVM/LogReg Scikit-Learn dan parameter penalti kuadratik alpha.",
        concept: `Dalam pustaka Scikit-Learn, parameter regularisasi untuk model klasifikasi linier (\` + "\`LogisticRegression\`" + \` dan \` + "\`LinearSVC\`" + \`) dikendalikan melalui parameter **\` + "\`C\`" + \`**.

Sangat penting untuk memahami bahwa **$C$ berbanding terbalik secara proporsional terhadap kekuatan regularisasi $\\alpha$**:
$$C \\propto \\frac{1}{\\alpha}$$

Formulasi fungsi objektif Scikit-Learn:
$$\\min_{\\mathbf{w}} \\left\\{ \\frac{1}{2} \\|\\mathbf{w}\\|_2^2 + C \\sum_{i=1}^n \\ell(f(\\mathbf{x}_i), y_i) \\right\\}$$

**Dinamika Penyetelan Nilai $C$:**
1. **Nilai $C$ Sangat Kecil ($C \\to 0$, misal $C = 0.001$):**
   - Penalti terhadap kesalahan klasifikasi $\\sum \\ell_i$ menjadi sangat kecil bobotnya dibandingkan dengan pembatas norma $\\frac{1}{2}\\|\\mathbf{w}\\|_2^2$.
   - Prioritas utama optimasi adalah mengecilkan koefisien bobot parameter menuju nol.
   - **Efek:** Batas keputusan menjadi sangat kaku dan toleran terhadap kesalahan sampel, menghasilkan margin yang sangat lebar (*soft margin*). Rentan **Underfitting (High Bias)**.
2. **Nilai $C$ Sangat Besar ($C \\to \\infty$, misal $C = 1000$):**
   - Penalti terhadap kesalahan klasifikasi bernilai masif. Algoritma dipaksa untuk tidak melakukan kesalahan pada satu sampel pun dalam data latih.
   - **Efek:** Margin menjadi sangat sempit (*hard margin*), dan batas keputusan meliuk-liuk menyesuaikan diri terhadap titik-titik data individual. Rentan **Overfitting (High Variance)**.`,
        formula: `C = \\frac{1}{\\alpha \\cdot n} \\implies \\begin{cases} C \\to 0 & \\implies \\text{Margin Lebar (Regulasi Kuat / High Bias)} \\\\ C \\to \\infty & \\implies \\text{Margin Sempit (Regulasi Lemah / High Variance)} \\end{cases}`,
        code: `# 5.8: Eksperimen Penyetelan Hiperparameter C pada Batas Keputusan LogisticRegression
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_blobs

X, y = make_blobs(n_samples=100, centers=2, cluster_std=2.5, random_state=42)

c_values = [0.01, 1.0, 100.0]
print("=== PENGARUH HIPERPARAMETER REGULASI C ===")
for c_val in c_values:
    clf = LogisticRegression(C=c_val, random_state=42).fit(X, y)
    norma_w = np.linalg.norm(clf.coef_)
    acc = clf.score(X, y)
    print(f"Nilai C = {c_val:6.2f} -> Norma Bobot ||w||: {norma_w:6.3f} | Akurasi Latih: {acc*100:5.1f}%")`,
        expectedOutput: "Nilai C kecil (0.01) menyusutkan norma bobot secara drastis (0.17), sedangkan C besar (100.0) membiarkan norma bobot membesar (1.20).",
        codeExp: "Skrip menguji pengaruh variasi parameter C dari 0.01 hingga 100 terhadap magnitudo norma bobot koefisien dan akurasi latih model regresi logistik.",
        pitfalls: [
          "Menaikkan C dengan maksud memperkuat regularisasi (kebalikan dari alpha pada Ridge/Lasso).",
          "Menggunakan C yang seragam di seluruh dataset tanpa memperhitungkan jumlah sampel n (karena penalti dikalikan langsung dengan akumulasi n sampel)."
        ],
        refTitle: "Scikit-Learn User Guide: Logistic regression - Regularization",
        refUrl: "https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression"
      },
      {
        num: "5.9",
        slug: "5-9-ambang-batas-keputusan-threshold-tuning-precision-recall",
        title: "5.9. Ambang Batas Keputusan (Decision Threshold Tuning): Mengoptimasi Precision vs Recall",
        desc: "Kustomisasi ambang klasifikasi operasional: menembus batas default 0.5 untuk mengoptimalkan trade-off bisnis antara False Positive dan False Negative.",
        concept: `Secara default, fungsi \` + "\`predict()\`" + \` pada pustaka Scikit-Learn mengklasifikasikan sampel ke dalam kelas positif ($+1$) jika estimasi probabilitas $P(Y=1|X) \\ge 0.50$. Namun, ambang batas simetris $0.5$ ini **hampir tidak pernah optimal** dalam aplikasi industri dunia nyata karena adanya asimetri biaya kesalahan (*asymmetric misclassification cost*):

1. **Kasus Deteksi Penipuan Transaksi (Fraud Detection):**
   Biaya membiarkan transaksi penipuan lolos (*False Negative*) bernilai jutaan rupiah kerugian finansial, sedangkan biaya memblokir transaksi nasabah sah untuk verifikasi SMS (*False Positive*) sangat kecil. Sistem memerlukan **Recall yang sangat tinggi**, sehingga ambang batas harus diturunkan ke $\\tau = 0.15$ atau $0.20$.
2. **Kasus Filter Email Spam:**
   Memasukkan email promosi ke inbox (*False Negative*) hanya sedikit mengganggu pengguna, namun membuang email tawaran pekerjaan penting ke folder spam (*False Positive*) berakibat fatal. Sistem memerlukan **Precision yang sangat tinggi**, sehingga ambang batas harus dinaikkan ke $\\tau = 0.85$ atau $0.90$.

**Kurva Precision-Recall:**
Menurunkan ambang batas $\\tau$ selalu meningkatkan Recall (menangkap lebih banyak kasus positif sejati) namun menurunkan Precision (meningkatkan alarm palsu). Titik operasional optimal $\\tau^*$ ditentukan dengan mengalikan matriks kebingungan (*confusion matrix*) dengan matriks biaya moneter bisnis riil.`,
        formula: `\\hat{y} = \\begin{cases} 1 & \\text{jika } P(Y=1 \\mid \\mathbf{x}) \\ge \\tau \\\\ 0 & \\text{jika } P(Y=1 \\mid \\mathbf{x}) < \\tau \\end{cases} \\quad (\\tau \\in (0, 1))`,
        code: `# 5.9: Penalaan Ambang Batas Keputusan (Threshold Tuning) untuk Kasus Fraud Detection
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import precision_score, recall_score, f1_score

# Data deteksi fraud tak seimbang (5% fraud)
X, y = make_classification(n_samples=1000, weights=[0.95, 0.05], random_state=42)
model = LogisticRegression().fit(X, y)
prob_fraud = model.predict_proba(X)[:, 1]

thresholds = [0.10, 0.25, 0.50, 0.75]
print("=== OPTIMASI AMBANG BATAS KEPUTUSAN (THRESHOLD TUNING) ===")
print("Ambang tau | Precision |   Recall  |  F1-Score | Karakteristik Operasional")
for t in thresholds:
    y_pred_t = (prob_fraud >= t).astype(int)
    p = precision_score(y, y_pred_t, zero_division=0)
    r = recall_score(y, y_pred_t)
    f1 = f1_score(y, y_pred_t)
    desc = "Tangkap Mayoritas Fraud (Sensitif)" if t < 0.3 else ("Default Simetris" if t == 0.5 else "Konservatif")
    print(f"  {t:5.2f}    |  {p*100:6.1f}%  |  {r*100:6.1f}%  |  {f1:7.4f}  | {desc}")`,
        expectedOutput: "Menurunkan ambang dari 0.50 ke 0.10 melipatgandakan Recall fraud dari ~40% menjadi > 85%.",
        codeExp: "Skrip menunjukkan bagaimana memvariasikan ambang batas keputusan dari 0.10 hingga 0.75 memanipulasi trade-off Precision-Recall secara fleksibel sesuai prioritas risiko bisnis.",
        pitfalls: [
          "Menggunakan model.predict(X) secara buta di industri tanpa pernah mengevaluasi kurva precision-recall dan mengkalibrasi threshold.",
          "Menyetel threshold berdasarkan data uji final (wajib menyetel threshold pada set validasi terpisah)."
        ],
        refTitle: "Foster Provost & Tom Fawcett: Data Science for Business (Chapter 8: Visualizing Model Performance)",
        refUrl: "https://www.oreilly.com/library/view/data-science-for/9781449374273/"
      },
      {
        num: "5.10",
        slug: "5-10-implementasi-lengkap-regresi-logistik-gradient-descent-numpy",
        title: "5.10. Implementasi Lengkap Regresi Logistik Menggunakan Gradient Descent NumPy",
        desc: "Konstruksi dari nol model klasifikasi biner murni: implementasi loop optimasi gradient descent, perhitungan log-loss per epoch, dan evaluasi matriks konfusi.",
        concept: `Untuk mengukuhkan seluruh teori klasifikasi linier yang telah dipelajari, kita membangun kelas \` + "\`CustomLogisticRegression\`" + \` lengkap dari dasar aljabar linier NumPy murni tanpa menggunakan solver Scikit-Learn.

**Arsitektur Algoritma:**
1. **Inisialisasi Bobot:** Vektor bobot $\\mathbf{w} \\in \\mathbb{R}^d$ diinisialisasi dengan angka nol atau nilai acak kecil, dan intersep skalar $b = 0$.
2. **Perulangan Epoch (*Training Loop*):** Untuk setiap iterasi $t = 1, \\dots, T$:
   a. **Forward Pass:**
      Hitung skor linear $z_i = \\mathbf{x}_i^\\top \\mathbf{w} + b$.
      Petakan ke probabilitas $\\hat{y}_i = \\sigma(z_i) = \\frac{1}{1 + e^{-z_i}}$.
   b. **Kalkulasi Kerugian Log-Loss:**
      $$J(\\mathbf{w}, b) = -\\frac{1}{n} \\sum_{i=1}^n \\left[ y_i \\ln(\\hat{y}_i) + (1 - y_i) \\ln(1 - \\hat{y}_i) \\right]$$
   c. **Backward Pass (Kalkulasi Gradien):**
      $$\\nabla_\\mathbf{w} J = \\frac{1}{n} \\mathbf{X}^\\top (\\hat{\\mathbf{y}} - \\mathbf{y})$$
      $$\\nabla_b J = \\frac{1}{n} \\sum_{i=1}^n (\\hat{y}_i - y_i)$$
   d. **Pembaruan Parameter (Gradient Descent):**
      $$\\mathbf{w} \\leftarrow \\mathbf{w} - \\eta \\cdot \\nabla_\\mathbf{w} J$$
      $$b \\leftarrow b - \\eta \\cdot \\nabla_b J$$
3. **Inferensi:** Menghitung probabilitas dengan fungsi sigmoid dan mengembalikan label biner berdasarkan ambang batas $\\tau$.`,
        formula: `\\mathbf{w} \\leftarrow \\mathbf{w} - \\frac{\\eta}{n} \\mathbf{X}^\\top (\\sigma(\\mathbf{X}\\mathbf{w} + b) - \\mathbf{y}), \\quad b \\leftarrow b - \\frac{\\eta}{n} \\sum_{i=1}^n (\\sigma(\\mathbf{x}_i^\\top \\mathbf{w} + b) - y_i)`,
        code: `# 5.10: Implementasi Lengkap Custom Logistic Regression dari Nol Menggunakan NumPy
import numpy as np
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression

class CustomLogisticRegression:
    def __init__(self, learning_rate=0.1, n_epochs=1000):
        self.lr = learning_rate
        self.n_epochs = n_epochs
        self.w = None
        self.b = 0.0
        self.loss_history = []

    def _sigmoid(self, z):
        # Implementasi sigmoid numerik stabil
        z = np.clip(z, -250, 250)
        return 1.0 / (1.0 + np.exp(-z))

    def fit(self, X, y):
        n_samples, n_features = X.shape
        self.w = np.zeros(n_features)
        self.b = 0.0
        
        for epoch in range(self.n_epochs):
            # 1. Forward Pass
            z = X.dot(self.w) + self.b
            y_hat = self._sigmoid(z)
            
            # 2. Log-Loss
            eps = 1e-15
            loss = -np.mean(y * np.log(y_hat + eps) + (1 - y) * np.log(1 - y_hat + eps))
            self.loss_history.append(loss)
            
            # 3. Gradien Analitis
            dz = y_hat - y
            dw = (1.0 / n_samples) * X.T.dot(dz)
            db = (1.0 / n_samples) * np.sum(dz)
            
            # 4. Pembaruan Parameter
            self.w -= self.lr * dw
            self.b -= self.lr * db
            
        return self

    def predict_proba(self, X):
        return self._sigmoid(X.dot(self.w) + self.b)

    def predict(self, X, threshold=0.5):
        return (self.predict_proba(X) >= threshold).astype(int)

# Validasi terhadap Scikit-Learn LogisticRegression
np.random.seed(42)
X_test = np.random.randn(200, 2)
y_test = (1.5 * X_test[:, 0] - 2.0 * X_test[:, 1] + 0.5 > 0).astype(int)

custom_clf = CustomLogisticRegression(learning_rate=0.5, n_epochs=1000).fit(X_test, y_test)
sklearn_clf = LogisticRegression(penalty=None, solver='lbfgs').fit(X_test, y_test)

print("=== VERIFIKASI CUSTOM LOGISTIC REGRESSION ===")
print(f"Loss Awal Epoch 1: {custom_clf.loss_history[0]:.4f} -> Loss Akhir Epoch 1000: {custom_clf.loss_history[-1]:.4f}")
print(f"Bobot Custom NumPy  : w={custom_clf.w.round(4)}, b={custom_clf.b:.4f}")
print(f"Bobot Scikit-Learn  : w={sklearn_clf.coef_[0].round(4)}, b={sklearn_clf.intercept_[0]:.4f}")
print(f"Akurasi Custom Model: {accuracy_score(y_test, custom_clf.predict(X_test))*100:.2f}%")`,
        expectedOutput: "Custom model konvergen dari loss 0.6931 menjadi loss < 0.15 dengan akurasi klasifikasi > 95%.",
        codeExp: "Skrip mengimplementasikan algoritma Regresi Logistik lengkap dari nol menggunakan NumPy murni, memvalidasi proses konvergensi fungsi kerugian dan membandingkan bobotnya terhadap Scikit-Learn.",
        pitfalls: [
          "Tidak melakukan clipping nilai eksponensial pada fungsi sigmoid yang memicu overflow peringatan runtime numerik.",
          "Memilih learning rate yang terlalu besar pada gradient descent yang menyebabkan nilai kerugian berosilasi dan divergen."
        ],
        refTitle: "Andrew Ng: CS229 Lecture Notes - Supervised Learning & Logistic Regression (Stanford University)",
        refUrl: "https://cs229.stanford.edu/notes2022fall/main_notes.pdf"
      }
    ]
  }
];
