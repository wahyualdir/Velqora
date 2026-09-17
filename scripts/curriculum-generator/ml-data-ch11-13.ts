import { ChapterDef } from "./da-data-ch1-3";

export const ML_CHAPTERS_11_TO_13: ChapterDef[] = [
  // ==========================================
  // BAB 11: Metode Ensemble Stacking, Voting, dan Kalibrasi Probabilitas
  // ==========================================
  {
    orderIndex: 11,
    id: "machine-learning-ch-11",
    slug: "bab-11-ensemble-stacking-voting-dan-kalibrasi-probabilitas",
    title: "BAB 11: Metode Ensemble Stacking, Voting, dan Kalibrasi Probabilitas",
    desc: "Arsitektur ensemble heterogen dan kalibrasi ketidakpastian: Voting classifier (hard vs soft), generalisasi bertumpuk (Stacked Generalization / Stacking) David Wolpert, out-of-fold cross-validation pencegah kebocoran meta-fitur, meta-learner linier vs non-linier, miskalibrasi probabilitas model modern, Reliability Curve, Brier Score, Platt Scaling, dan Isotonic Regression.",
    coreConcepts: ["Hard vs Soft Voting", "Stacked Generalization (Stacking)", "Out-of-Fold (OOF) Prediction", "Meta-Learner Architecture", "Probability Miscalibration", "Reliability Diagram", "Brier Score", "Platt Scaling", "Isotonic Regression"],
    subchapters: [
      {
        num: "11.1",
        slug: "11-1-voting-classifier-hard-vs-soft-dan-weighted-voting",
        title: "11.1. Voting Classifier: Hard Voting, Soft Voting, dan Pembobotan Model (Weighted Voting)",
        desc: "Kombinasi model heterogen: agregasi keputusan diskrit mayoritas (hard) vs perata-rataan probabilitas terkalibrasi (soft) dengan pembobotan performa.",
        concept: `Ensemble Voting adalah teknik agregasi paling langsung untuk menggabungkan prediksi dari sekumpulan estimator heterogen (misalnya menggabungkan Regresi Logistik, Random Forest, dan Support Vector Machine). Berbeda dengan Bagging yang melatih algoritma homogen pada sampel bootstrap yang berbeda, Voting melatih algoritma-algoritma dengan induktif bias yang sepenuhnya berbeda pada dataset yang sama.

**Dua Paradigma Utama Voting:**
1. **Hard Voting (Majority Rule):** Kelas prediksi akhir adalah kelas yang dipilih oleh mayoritas estimator individual ($y = \\text{mode}\\{C_1(\\mathbf{x}), C_2(\\mathbf{x}), \\dots, C_M(\\mathbf{x})\\}$). Paradigma ini hanya memanfaatkan label diskrit tanpa memperhitungkan tingkat keyakinan (confidence) masing-masing model.
2. **Soft Voting (Argmax of Average Probabilities):** Kelas prediksi akhir dihitung dari rata-rata probabilitas terprediksi untuk setiap kelas:
$$\\hat{y} = \\arg\\max_k \\frac{1}{M} \\sum_{m=1}^M P_m(y=k \\mid \\mathbf{x})$$
Soft voting hampir selalu menghasilkan akurasi yang lebih unggul dibandingkan hard voting karena memberikan bobot lebih besar pada model yang memiliki keyakinan sangat tinggi pada prediksi tertentu.

**Pembobotan Model (Weighted Voting):**
Kita dapat menetapkan vektor bobot $\\mathbf{w} = [w_1, \\dots, w_M]$ yang mencerminkan reliabilitas atau performa validasi masing-masing model, sehingga $\\hat{y} = \\arg\\max_k \\sum_{m=1}^M w_m P_m(y=k \\mid \\mathbf{x})$.`,
        formula: `\\hat{y}_{\\text{soft}} = \\arg\\max_k \\sum_{m=1}^M w_m P_m(y=k \\mid \\mathbf{x}) \\quad \\text{dengan } \\sum_{m=1}^M w_m = 1`,
        code: `# 11.1: Komparasi Performa Hard Voting vs Soft Voting pada Model Heterogen
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

X, y = make_classification(n_samples=1000, n_features=20, n_informative=15, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

clf1 = LogisticRegression(random_state=42)
clf2 = RandomForestClassifier(n_estimators=50, random_state=42)
clf3 = SVC(probability=True, random_state=42)

# Latih individual models
for clf, name in [(clf1, 'LogReg'), (clf2, 'RandomForest'), (clf3, 'SVC')]:
    clf.fit(X_train, y_train)
    acc = accuracy_score(y_test, clf.predict(X_test))
    print(f"Model Individual {name:12s}: Akurasi = {acc*100:.2f}%")

# Voting Ensembles
hard_voter = VotingClassifier(estimators=[('lr', clf1), ('rf', clf2), ('svc', clf3)], voting='hard')
soft_voter = VotingClassifier(estimators=[('lr', clf1), ('rf', clf2), ('svc', clf3)], voting='soft', weights=[1, 2, 1])

hard_voter.fit(X_train, y_train)
soft_voter.fit(X_train, y_train)

print("=== HASIL ENSEMBLE VOTING ===")
print(f"Hard Voting Accuracy: {accuracy_score(y_test, hard_voter.predict(X_test))*100:.2f}%")
print(f"Soft Voting Accuracy: {accuracy_score(y_test, soft_voter.predict(X_test))*100:.2f}% (Tertimbang)")`,
        expectedOutput: "Soft Voting menghasilkan akurasi tertinggi (~89-91%) melampaui seluruh model penyusunnya dan hard voting.",
        codeExp: "Skrip menggabungkan tiga algoritma heterogen (Linear, Bagging Trees, Kernel SVM) dan mendemonstrasikan keunggulan agregasi probabilitas soft voting dengan pembobotan.",
        pitfalls: [
          "Menjalankan soft voting pada SVC tanpa menyetel probability=True; SVC standar hanya menghitung jarak ke margin dan tidak menghasilkan probabilitas terkalibrasi.",
          "Menyertakan estimator yang berkinerja sangat buruk ke dalam voting tanpa bobot penalti, yang justru menurunkan akurasi total."
        ],
        refTitle: "Scikit-Learn Official User Guide: Voting Classifier",
        refUrl: "https://scikit-learn.org/stable/modules/ensemble.html#voting-classifier"
      },
      {
        num: "11.2",
        slug: "11-2-formulasi-matematika-stacking-wolpert-1992",
        title: "11.2. Formulasi Matematika Stacking (Stacked Generalization, Wolpert 1992)",
        desc: "Konsep generalisasi bertumpuk: mempelajari meta-learner optimal untuk menggabungkan prediksi dari sekumpulan base learners.",
        concept: `Alih-alih menggunakan aturan agregasi tetap seperti perata-rataan atau pemungutan suara mayoritas, David H. Wolpert (1992) merumuskan **Stacked Generalization (Stacking)**: melatih sebuah model pembelajaran mesin tingkat tinggi (**Meta-Learner** atau Blending Model) untuk mempelajari cara optimal mengombinasikan prediksi dari sekumpulan model dasar (**Base Learners / Level-0 Models**).

**Arsitektur Dua Tingkat Stacking:**
1. **Level-0 (Base Estimators):** Terdiri dari $M$ model dasar heterogen $f_1(\\mathbf{x}), f_2(\\mathbf{x}), \\dots, f_M(\\mathbf{x})$ yang dilatih langsung pada data fitur asli $\\mathcal{D} = \\{(\\mathbf{x}_i, y_i)\\}_{i=1}^n$.
2. **Level-1 (Meta-Learner):** Sebuah model tunggal $g(\\mathbf{z})$ yang menerima vektor fitur baru $\\mathbf{z}_i = [f_1(\\mathbf{x}_i), f_2(\\mathbf{x}_i), \\dots, f_M(\\mathbf{x}_i)]^\\top$ dan menghasilkan prediksi akhir:
$$\\hat{y}_i = g\\left( f_1(\\mathbf{x}_i), f_2(\\mathbf{x}_i), \\dots, f_M(\\mathbf{x}_i) \\right)$$

Pada klasifikasi biner atau multi-kelas, $\\mathbf{z}_i$ biasanya disusun dari vektor probabilitas prediksi kelas $\\hat{P}_m(y=k \\mid \\mathbf{x}_i)$, memberikan informasi ketidakpastian yang kaya bagi meta-learner.`,
        formula: `\\hat{y} = g\\left( \\mathbf{z} \\right) = g\\left( [\\hat{y}_1, \\hat{y}_2, \\dots, \\hat{y}_M]^\\top \\right) \\quad (\\text{Fungsi Meta-Learner Tingkat 1})`,
        code: `# 11.2: Konsep Dasar Stacking Menggunakan StackingClassifier Scikit-Learn
from sklearn.ensemble import StackingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split

data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(data.data, data.target, test_size=0.25, random_state=42)

# Definisikan base estimators Level-0
base_estimators = [
    ('rf', RandomForestClassifier(n_estimators=40, random_state=42)),
    ('knn', KNeighborsClassifier(n_neighbors=5)),
    ('dt', DecisionTreeClassifier(max_depth=4, random_state=42))
]

# Definisikan Level-1 Meta-Learner (Logistic Regression sederhana)
meta_learner = LogisticRegression(max_iter=1000, random_state=42)

stacking = StackingClassifier(estimators=base_estimators, final_estimator=meta_learner, cv=5)
stacking.fit(X_train, y_train)

acc = stacking.score(X_test, y_test)
print(f"Akurasi Stacking Classifier pada Data Uji: {acc*100:.2f}%")
print(f"Koefisien Meta-Learner terhadap Base Estimators:\n{stacking.final_estimator_.coef_}")`,
        expectedOutput: "Akurasi Stacking mencapai ~96-98% dengan meta-learner menetapkan bobot optimal untuk masing-masing base model.",
        codeExp: "Skrip mengonfigurasi arsitektur stacking dua tingkat dengan tiga model dasar heterogen dan regresi logistik sebagai meta-learner penalaran.",
        pitfalls: [
          "Menggunakan meta-learner yang terlalu kompleks (seperti Deep Neural Net atau Random Forest dalam) pada Level-1, yang sangat memicu overfitting meta-features.",
          "Melatih Level-1 langsung pada prediksi data latih Level-0 tanpa out-of-fold validation, yang menyebabkan kebocoran data katastropik."
        ],
        refTitle: "David H. Wolpert: Stacked Generalization (Neural Networks, 1992)",
        refUrl: "https://www.sciencedirect.com/science/article/abs/pii/S0893608005800231"
      },
      {
        num: "11.3",
        slug: "11-3-meta-learner-dan-out-of-fold-cross-validation-leakage",
        title: "11.3. Meta-Learner dan Strategi Out-of-Fold (OOF) Cross-Validation Mencegah Kebocoran",
        desc: "Prosedur konstruksi meta-fitur bebas bias: pembagian K-Fold internal untuk menghasilkan prediksi out-of-sample bagi dataset latihan meta-learner.",
        concept: `Tantangan terbesar dan paling kritis dalam melatih arsitektur Stacking adalah **Kebocoran Informasi Target (*Target Leakage*)**. Jika model Level-0 dilatih pada dataset $\\mathcal{D}$ lalu langsung digunakan untuk memprediksi dataset $\\mathcal{D}$ yang sama guna menghasilkan meta-fitur $\\mathbf{Z}$, maka $\\mathbf{Z}$ akan mencerminkan fitting data latih yang terlalu optimis (*overfitted*). Akibatnya, meta-learner Level-1 hanya akan belajar mempercayai model dasar yang paling parah menghafal data latih, menghancurkan performa generalisasi pada data uji baru.

**Mekanisme Out-of-Fold (OOF) Cross-Validation:**
Untuk mengatasi kebocoran ini, meta-fitur latih $\\mathbf{Z}_{\\text{train}}$ **wajib** dihasilkan melalui prosedur validasi silang K-Fold ketat:
1. Dataset latih $\\mathcal{D}_{\\text{train}}$ dibagi menjadi $K$ bagian (*folds*), misalnya $K = 5$.
2. Untuk setiap fold $k \\in \\{1, \\dots, K\\}$:
   - Model Level-0 dilatih pada gabungan $K-1$ fold sisa (data latihan fold).
   - Model Level-0 tersebut memprediksi fold ke-$k$ (yang belum pernah dilihat sama sekali oleh model).
3. Gabungan seluruh prediksi out-of-fold dari ke-$K$ iterasi disusun menjadi matriks meta-fitur $\\mathbf{Z}_{\\text{train}}$ berukuran $n \\times M$.
4. Setelah $\\mathbf{Z}_{\\text{train}}$ lengkap, model Level-0 dilatih ulang sekali lagi menggunakan **100% data latih** untuk persiapan inferensi data uji masa depan.
5. Meta-learner Level-1 dilatih pada pasangan $(\\mathbf{Z}_{\\text{train}}, \\mathbf{y}_{\\text{train}})$.`,
        formula: `\\mathbf{z}_i^{(m)} = f_m^{(-k)}(\\mathbf{x}_i) \\quad \\text{untuk } \\mathbf{x}_i \\in \\text{Fold } k \\quad (\\text{Prediksi Bebas Kebocoran})`,
        code: `# 11.3: Implementasi Manual Out-of-Fold (OOF) Prediction Generator dari Nol
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import KFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

X, y = make_classification(n_samples=500, n_features=10, random_state=42)
n_samples = len(y)
kf = KFold(n_splits=5, shuffle=True, random_state=42)

base_model = RandomForestClassifier(n_estimators=30, random_state=42)
oof_predictions = np.zeros(n_samples)

print("=== PEMBUATAN META-FITUR OUT-OF-FOLD (OOF) ===")
for fold, (train_idx, val_idx) in enumerate(kf.split(X, y)):
    X_f_train, y_f_train = X[train_idx], y[train_idx]
    X_f_val, y_f_val = X[val_idx], y[val_idx]
    
    # Latih hanya pada fold latih
    base_model.fit(X_f_train, y_f_train)
    # Prediksi fold validasi yang tidak terlihat
    oof_predictions[val_idx] = base_model.predict_proba(X_f_val)[:, 1]
    acc_fold = (np.round(oof_predictions[val_idx]) == y_f_val).mean()
    print(f"Fold {fold+1}: Sampel Validasi={len(val_idx)} | Akurasi OOF Fold={acc_fold*100:.2f}%")

print(f"\nTotal Meta-Fitur OOF Siap: {len(oof_predictions)} observasi (100% Bebas Data Leakage)")`,
        expectedOutput: "Seluruh sampel terprediksi tepat 1 kali pada fase validasi tanpa kebocoran data latih.",
        codeExp: "Skrip mendemonstrasikan algoritma K-Fold loop untuk menghasilkan vektor prediksi out-of-fold yang menjadi masukan bersih bagi Level-1 meta-learner.",
        pitfalls: [
          "Membagi fold secara acak tanpa memperhatikan stratifikasi label pada klasifikasi tidak seimbang (wajib gunakan StratifiedKFold).",
          "Melakukan feature scaling pada seluruh dataset sebelum membagi fold OOF, yang memicu data leakage pada Level-0 itu sendiri."
        ],
        refTitle: "Scikit-Learn User Guide: StackingClassifier & Cross-Validation",
        refUrl: "https://scikit-learn.org/stable/modules/ensemble.html#stacking"
      },
      {
        num: "11.4",
        slug: "11-4-arsitektur-stacking-multi-tingkat-dan-passthrough",
        title: "11.4. Arsitektur Stacking Multi-Tingkat dan Konsep Passthrough Features",
        desc: "Eksplorasi topologi stacking bertingkat (Multi-Level Stacking) dan penggabungan fitur masukan asli ke lapisan meta-learner (passthrough=True).",
        concept: `Dalam kompetisi sains data tingkat lanjut (seperti Kaggle Grandmaster pipelines) dan sistem rekomendasi skala besar, arsitektur stacking sering kali diperluas melampaui dua tingkat sederhana:

**1. Passthrough Features (\\\\`passthrough=True\\\\`):**
Secara default, meta-learner Level-1 hanya menerima vektor prediksi $\\mathbf{z} = [f_1(\\mathbf{x}), \\dots, f_M(\\mathbf{x})]$. Namun, dalam banyak kasus, meta-learner akan jauh lebih efektif jika dapat melihat **konteks fitur masukan asli** $\\mathbf{x}$.
Dengan menyetel parameter \\\\`passthrough=True\\\\`, matriks fitur masukan meta-learner menjadi gabungan konkatenasi:
$$\\mathbf{Z}_{\\text{meta}} = [\\mathbf{X}_{\\text{original}} \\mid \\mathbf{Z}_{\\text{predictions}}]$$
Hal ini memungkinkan meta-learner mempelajari aturan kondisional seperti: *"Jika Fitur Umur > 60, lebih percayai Model A daripada Model B"*.

**2. Multi-Level Stacking:**
Menyusun hierarki tiga tingkat atau lebih (Level-0 $\\to$ Level-1 $\\to$ Level-2). Di Level-1, beberapa meta-learner heterogen (misalnya XGBoost dan LightGBM) dilatih di atas Level-0, kemudian prediksi Level-1 tersebut digabungkan kembali oleh meta-learner akhir Level-2 (misal ElasticNet atau Logistic Regression).`,
        formula: `\\mathbf{Z}_{\\text{meta}} = [\\mathbf{x}_1, \\dots, \\mathbf{x}_d, f_1(\\mathbf{x}), \\dots, f_M(\\mathbf{x})] \\quad (\\text{Vektor Passthrough})`,
        code: `# 11.4: Uji Efektivitas Stacking dengan passthrough=True vs passthrough=False
from sklearn.ensemble import StackingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=1200, n_features=25, n_informative=18, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

base_models = [
    ('rf', RandomForestClassifier(n_estimators=50, random_state=42)),
    ('svc', SVC(probability=True, random_state=42))
]

# Stacking Tanpa Passthrough
st_standard = StackingClassifier(estimators=base_models, final_estimator=LogisticRegression(), passthrough=False, cv=5)
st_standard.fit(X_train, y_train)

# Stacking Dengan Passthrough
st_passthrough = StackingClassifier(estimators=base_models, final_estimator=LogisticRegression(max_iter=1000), passthrough=True, cv=5)
st_passthrough.fit(X_train, y_train)

print("=== KOMPARASI ARSITEKTUR PASSTHROUGH ===")
print(f"Stacking Standar (Hanya Prediksi Base)    : Akurasi = {st_standard.score(X_test, y_test)*100:.2f}%")
print(f"Stacking Passthrough (Prediksi + Fitur Asli): Akurasi = {st_passthrough.score(X_test, y_test)*100:.2f}%")`,
        expectedOutput: "Stacking passthrough menunjukkan peningkatan akurasi karena meta-learner memiliki akses ke fitur penjelas asli.",
        codeExp: "Skrip membandingkan performa Stacking standar vs Stacking dengan konkatenasi fitur asli (passthrough=True) pada dataset sintetis berdimensi 25 fitur.",
        pitfalls: [
          "Mengaktifkan passthrough=True pada dataset dengan ratusan ribu fitur yang menyebabkan ledakan dimensi dan perlambatan komputasi meta-learner.",
          "Membangun hierarki multi-level lebih dari 3 tingkat tanpa peningkatan metrik signifikan, yang hanya menambah kompleksitas latensi inferensi produksi."
        ],
        refTitle: "Scikit-Learn API: StackingClassifier Parameter passthrough",
        refUrl: "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.StackingClassifier.html"
      },
      {
        num: "11.5",
        slug: "11-5-stacking-regresi-stackingregressor-vs-klasifikasi",
        title: "11.5. Stacking Regresi (StackingRegressor): Optimal Linear Combination dan Regularisasi",
        desc: "Implementasi generalisasi bertumpuk pada target kontinu: perumusan kombinasi linier non-negatif dan penalti Ridge/Lasso pada meta-regressor.",
        concept: `Stacking pada masalah regresi (**StackingRegressor**) beroperasi dengan target kontinu $y \\in \\mathbb{R}$. Model Level-0 menghasilkan prediksi nilai kontinu $\\hat{y}_1, \\dots, \\hat{y}_M$.

**Perumusan Masalah Meta-Regresi:**
Model Level-1 mencari bobot optimal $\\mathbf{w} = [w_1, \\dots, w_M]^\\top$ untuk meminimalkan galat kuadrat terkecil:
$$\\min_{\\mathbf{w}, b} \\sum_{i=1}^n \\left( y_i - \\left( b + \\sum_{m=1}^M w_m \\hat{y}_{i, \\text{OOF}}^{(m)} \\right) \\right)^2 + \\alpha \\|\\mathbf{w}\\|_2^2$$

**Mengapa Ridge Regression Menjadi Default Meta-Regressor?**
1. **Multikolinieritas Kuat:** Prediksi dari model-model dasar yang sama-sama berkinerja tinggi pasti memiliki korelasi yang sangat kuat satu sama lain ($\\text{Corr}(\\hat{y}_1, \\hat{y}_2) \\approx 0.95$). Jika OLS standar digunakan, matriks $\\mathbf{Z}^\\top \\mathbf{Z}$ menjadi hampir singular dan menghasilkan bobot yang tidak stabil (misal bobot negatif besar atau positif ekstrem).
2. **Penalti L2 Tikhonov:** Ridge regression menstabilkan invers matriks kovarians meta-fitur, mendistribusikan bobot secara seimbang dan mencegah model tertentu mendominasi kombinasi secara tidak wajar.`,
        formula: `\\hat{y} = b + \\sum_{m=1}^M w_m \\hat{y}^{(m)} \\quad \\text{s.t. Penalti Ridge } \\alpha \\sum_{m=1}^M w_m^2`,
        code: `# 11.5: Implementasi StackingRegressor dengan Meta-Estimator Ridge
import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.ensemble import StackingRegressor, RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import Ridge, RidgeCV
from sklearn.metrics import mean_squared_error, r2_score

housing = fetch_california_housing()
X_train, X_test, y_train, y_test = train_test_split(housing.data[:2000], housing.target[:2000], test_size=0.25, random_state=42)

base_regressors = [
    ('rf', RandomForestRegressor(n_estimators=40, random_state=42)),
    ('gbr', GradientBoostingRegressor(n_estimators=50, random_state=42)),
    ('ridge', Ridge(alpha=1.0))
]

stacking_reg = StackingRegressor(estimators=base_regressors, final_estimator=RidgeCV(), cv=5)
stacking_reg.fit(X_train, y_train)

y_pred = stacking_reg.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print("=== HASIL EVALUASI STACKING REGRESSOR ===")
print(f"Test RMSE: {rmse:.4f}")
print(f"Test R2  : {r2:.4f}")
print("Bobot Meta-Learner (Ridge):", stacking_reg.final_estimator_.coef_)`,
        expectedOutput: "R2 StackingRegressor mencapai >0.78, mengungguli masing-masing regressor individual dengan pembobotan stabil.",
        codeExp: "Skrip menerapkan StackingRegressor pada dataset California Housing dengan kombinasi Random Forest, GBDT, dan Ridge yang diagregasi oleh RidgeCV.",
        pitfalls: [
          "Menggunakan OLS tanpa regularisasi sebagai final estimator regresi yang memicu koefisien meledak akibat multikolinieritas prediksi.",
          "Lupa menstandarisasi fitur pada base learner linier sebelum masuk ke stacking."
        ],
        refTitle: "Breiman, Leo: Stacked Regressions (Machine Learning, Springer 1996)",
        refUrl: "https://link.springer.com/article/10.1007/BF00117832"
      },
      {
        num: "11.6",
        slug: "11-6-kalibrasi-probabilitas-miskalibrasi-model-modern",
        title: "11.6. Fenomena Miskalibrasi Probabilitas pada Model Machine Learning Modern",
        desc: "Kajian empiris Guo et al. (2017): mengapa model berakurasi tinggi (SVM, Random Forest, Deep Nets) sering menghasilkan estimasi probabilitas yang bias dan overconfident.",
        concept: `Dalam aplikasi kritis berisiko tinggi (misalnya diagnosis medis, persetujuan pinjaman finansial, atau kendaraan otonom), nilai probabilitas yang dihasilkan model ($P(Y=1 \\mid X)$) harus merepresentasikan **tingkat kepastian frekuensi nyata di alam**. Model dikatakan **terkalibrasi sempurna** (*well-calibrated*) jika dari 100 sampel yang diprediksi memiliki probabilitas kelas positif sebesar 0.80, tepat 80 sampel di antaranya benar-benar berlabel positif.

**Mengapa Model Modern Miskalibrasi?**
Chuan Guo et al. (ICML 2017) dalam penelitian seminalnya *"On Calibration of Modern Neural Networks and Classifiers"* menemukan paradoks modern: seiring meningkatnya kapasitas dan akurasi model, kualitas kalibrasi probabilitasnya justru merosot tajam.
1. **Support Vector Machines (SVM):** Memaksimalkan margin geometris, bukan fungsi kemungkinan (likelihood). Konversi jarak margin ke probabilitas via Sigmoid sering kali tidak realistis di dekat batas keputusan.
2. **Random Forest:** Merata-ratakan prediksi probabilitas daun. Karena daun pohon sering kali dihentikan sebelum mencapai kemurnian ekstrem untuk mencegah varians, probabilitas rata-rata ensemble cenderung terdorong ke arah tengah (antara 0.2 dan 0.8), sangat jarang mendekati 0.0 atau 1.0 (*underconfident* pada kelas ekstrem).
3. **Gradient Boosted Trees (XGBoost / GBDT):** Mengoptimalkan fungsi loss eksponensial atau log-loss dengan residual bertahap. Estimasi probabilitasnya sering kali terdorong ke arah ekstrem 0 atau 1 (*overconfident*).`,
        formula: `P(Y = 1 \\mid \\hat{P} = p) = p, \\quad \\forall p \\in [0, 1] \\quad (\\text{Definisi Kalibrasi Probabilitas Ideal})`,
        code: `# 11.6: Mengamati Miskalibrasi Output Random Forest vs Logistic Regression
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import calibration_curve

X, y = make_classification(n_samples=2000, n_features=20, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.4, random_state=42)

rf = RandomForestClassifier(n_estimators=100, random_state=42).fit(X_train, y_train)
lr = LogisticRegression().fit(X_train, y_train)

prob_rf = rf.predict_proba(X_test)[:, 1]
prob_lr = lr.predict_proba(X_test)[:, 1]

# Hitung kurva kalibrasi (10 bin)
frac_pos_rf, mean_pred_rf = calibration_curve(y_test, prob_rf, n_bins=10)
frac_pos_lr, mean_pred_lr = calibration_curve(y_test, prob_lr, n_bins=10)

print("=== EVALUASI KALIBRASI PROBABILITAS (BINNED) ===")
print(f"LogReg Mean Preds: {np.round(mean_pred_lr[:3], 3)} -> Frekuensi Aktual: {np.round(frac_pos_lr[:3], 3)}")
print(f"RF Mean Preds    : {np.round(mean_pred_rf[:3], 3)} -> Frekuensi Aktual: {np.round(frac_pos_rf[:3], 3)}")
print("Kesimpulan: LogReg terkalibrasi alami (mendekati diagonal), sedangkan RF terkompresi di tengah.")`,
        expectedOutput: "LogReg menunjukkan kesesuaian kuat antara prediksi dan proporsi aktual, sementara Random Forest terdeviasi membentuk kurva sigmoidal.",
        codeExp: "Skrip menghitung calibration curve untuk membandingkan sifat kalibrasi probabilistik intrinsik Logistic Regression vs Random Forest.",
        pitfalls: [
          "Mengasumsikan bahwa model dengan akurasi 95% otomatis menghasilkan probabilitas yang valid untuk kalkulasi nilai ekspektasi moneter (Expected Monetary Value).",
          "Mengabaikan kalibrasi pada model klasifikasi multi-kelas dengan ketidakseimbangan kelas ekstrem."
        ],
        refTitle: "Chuan Guo et al.: On Calibration of Modern Neural Networks (ICML 2017)",
        refUrl: "https://proceedings.mlr.press/v70/guo17a.html"
      },
      {
        num: "11.7",
        slug: "11-7-reliability-diagrams-dan-brier-score",
        title: "11.7. Reliability Diagrams dan Brier Score sebagai Metrik Evaluasi Kalibrasi Formal",
        desc: "Kuantifikasi deviasi kalibrasi: konstruksi diagram keandalan binned dan dekomposisi matematis Brier Score (Reliability, Resolution, Uncertainty).",
        concept: `Untuk mengukur kualitas kalibrasi secara kuantitatif dan visual, kita menggunakan dua instrumen analitis standar industri:

**1. Reliability Diagram (Calibration Curve):**
Grafik plot sebaran probabilitas terprediksi (sumbu horizontal $x$) terhadap proporsi aktual kelas positif (sumbu vertikal $y$). Sampel uji dikelompokkan ke dalam $B$ bin interval (misalnya 10 bin seragam $[0, 0.1), [0.1, 0.2), \\dots, [0.9, 1.0]$).
Model yang terkalibrasi sempurna akan jatuh tepat pada garis diagonal identitas $y = x$.
- Jika titik berada **di bawah diagonal**, model bersifat **Overconfident** (probabilitas terprediksi lebih tinggi daripada kenyataan).
- Jika titik berada **di atas diagonal**, model bersifat **Underconfident** (kejadian aktual lebih sering terjadi daripada perkiraan model).

**2. Brier Score (Glenn W. Brier, 1950):**
Metrik evaluasi formal yang menghitung galat kuadrat rata-rata antara probabilitas terprediksi $\\hat{p}_i$ dan label biner aktual $y_i \\in \\{0, 1\\}$:
$$\\text{BS} = \\frac{1}{n} \\sum_{i=1}^n (\\hat{p}_i - y_i)^2$$
Nilai Brier Score berkisar antara 0.0 (sempurna terkalibrasi dan 100% akurat) hingga 1.0. Pada tebakan acak pada kelas seimbang, $\\text{BS} = 0.25$.

**Dekomposisi Murphy Brier Score:**
$$\\text{BS} = \\text{Reliability} - \\text{Resolution} + \\text{Uncertainty}$$
- **Reliability:** Mengukur deviasi langsung terhadap kalibrasi (semakin kecil mendekati 0 semakin baik).
- **Resolution:** Mengukur kemampuan model memisahkan sampel kelas positif dan negatif.`,
        formula: `\\text{BS} = \\frac{1}{n} \\sum_{i=1}^n (\\hat{p}_i - y_i)^2 \\quad (\\text{Brier Score Minimization})`,
        code: `# 11.7: Menghitung Brier Score Loss dan Expected Calibration Error (ECE)
import numpy as np
from sklearn.metrics import brier_score_loss
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=1500, n_features=15, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

rf = RandomForestClassifier(random_state=42).fit(X_train, y_train)
lr = LogisticRegression().fit(X_train, y_train)

p_rf = rf.predict_proba(X_test)[:, 1]
p_lr = lr.predict_proba(X_test)[:, 1]

bs_rf = brier_score_loss(y_test, p_rf)
bs_lr = brier_score_loss(y_test, p_lr)

print("=== EVALUASI KUANTITATIF BRIER SCORE ===")
print(f"Brier Score Logistic Regression: {bs_lr:.4f} (Model Terkalibrasi Kuat)")
print(f"Brier Score Random Forest      : {bs_rf:.4f}")`,
        expectedOutput: "Brier score terhitung presisi membuktikan perbandingan galat probabilitas antar-model.",
        codeExp: "Skrip menghitung metrik Brier Score untuk mengukur presisi probabilitas terkalibrasi pada dua arsitektur berbeda.",
        pitfalls: [
          "Hanya mengandalkan akurasi atau ROC-AUC untuk memilih model prediksi risiko tanpa mengevaluasi Brier Score.",
          "Menghitung Brier Score pada data latihan yang selalu menghasilkan skor optimis semu."
        ],
        refTitle: "Glenn W. Brier: Verification of Forecasts Expressed in Terms of Probability (Monthly Weather Review, 1950)",
        refUrl: "https://journals.ametsoc.org/view/journals/mwre/78/1/1520-0493_1950_078_0001_vofeit_2_0_co_2.xml"
      },
      {
        num: "11.8",
        slug: "11-8-metode-kalibrasi-platt-scaling-sigmoid",
        title: "11.8. Metode Kalibrasi Platt Scaling: Transformasi Logistik Skor Keputusan",
        desc: "Algoritma kalibrasi parametrik John Platt (1999): memetakan skor margin linier menjadi probabilitas posterior terkalibrasi via optimasi fungsi Sigmoid dua parameter.",
        concept: `**Platt Scaling** (John C. Platt, 1999) adalah metode kalibrasi pasca-pemrosesan parametrik (*parametric post-processing*) yang awalnya dirancang untuk mengubah skor margin biner Support Vector Machine $f(\\mathbf{x}) = \\mathbf{w}^\\top \\mathbf{x} + b$ menjadi estimasi probabilitas posterior $P(y=1 \\mid \\mathbf{x})$.

**Formulasi Matematis:**
Platt Scaling melatih fungsi logistik Sigmoid univariat dua parameter ($A$ dan $B$) di atas skor output model $f_i$:
$$P(y_i = 1 \\mid f_i) = \\frac{1}{1 + \\exp(A f_i + B)}$$
di mana parameter $A$ dan $B$ dioptimalkan menggunakan estimasi Maximum Likelihood (MLE) pada himpunan data validasi yang terpisah (*hold-out calibration set*).

**Target Out-of-Fold Lembut (*Soft Targets*):**
Untuk mencegah overfitting pada sampel ekstrem, Platt mengusulkan penggunaan target probabilitas yang dihaluskan (*smoothed targets*) daripada label keras $0$ atau $1$:
$$t_+ = \\frac{N_+ + 1}{N_+ + 2}, \\quad t_- = \\frac{1}{N_- + 2}$$
di mana $N_+$ dan $N_-$ adalah jumlah sampel positif dan negatif pada set kalibrasi.

**Kapan Menggunakan Platt Scaling?**
- Efektif ketika kurva kalibrasi model asli berbentuk **S-shaped (Sigmoidal)** (misalnya pada Support Vector Machines atau AdaBoost).
- Sangat efisien dan tahan overfitting pada ukuran sampel dataset kalibrasi yang kecil ($n < 1000$).`,
        formula: `P(y = 1 \\mid f) = \\frac{1}{1 + \\exp(A \\cdot f + B)} \\quad (\\text{Fungsi Kalibrasi Platt})`,
        code: `# 11.8: Kalibrasi Platt Scaling Menggunakan CalibratedClassifierCV(method='sigmoid')
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import brier_score_loss

X, y = make_classification(n_samples=1000, n_features=20, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# LinearSVC dasar tanpa probabilitas
svc = LinearSVC(random_state=42)

# Bungkus dengan Platt Scaling (method='sigmoid')
platt_svc = CalibratedClassifierCV(estimator=svc, method='sigmoid', cv=5)
platt_svc.fit(X_train, y_train)

# Prediksi probabilitas terkalibrasi
probs = platt_svc.predict_proba(X_test)[:, 1]
bs = brier_score_loss(y_test, probs)

print("=== KALIBRASI PLATT SCALING LINEARSVC ===")
print(f"Brier Score Terkalibrasi Platt: {bs:.4f}")
print(f"Contoh 5 Probabilitas Sampel Pertama: {probs[:5].round(3)}")`,
        expectedOutput: "LinearSVC berhasil menghasilkan probabilitas halus dengan Brier Score yang rendah.",
        codeExp: "Skrip menerapkan metode Platt Scaling (Sigmoid) via CalibratedClassifierCV untuk memberikan kemampuan prediksi probabilitas pada model non-probabilistik LinearSVC.",
        pitfalls: [
          "Menerapkan Platt Scaling pada model yang kurva miskalibrasinya tidak berbentuk sigmoidal (dapat memperburuk kalibrasi).",
          "Melatih parameter Platt Scaling pada dataset latihan yang sama dengan model utama tanpa cross-validation."
        ],
        refTitle: "John C. Platt: Probabilistic Outputs for Support Vector Machines and Comparisons to Regularized Likelihood Methods (1999)",
        refUrl: "https://www.cs.colorado.edu/~mozer/Teaching/syllabi/6622/papers/Platt1999.pdf"
      },
      {
        num: "11.9",
        slug: "11-9-metode-kalibrasi-isotonic-regression-non-parametrik",
        title: "11.9. Metode Kalibrasi Isotonic Regression: Regresi Non-Parametrik Monotonik",
        desc: "Koreksi kalibrasi fleksibel: algoritma Pair-Adjacent Violators (PAV) untuk memasang fungsi tangga monotonik bertingkat tanpa asumsi bentuk parametrik.",
        concept: `Jika kurva kalibrasi model tidak mengikuti bentuk fungsi Sigmoid (misalnya memiliki banyak distorsi lokal tak beraturan seperti pada Random Forest atau Pohon Keputusan), asumsi parametrik Platt Scaling menjadi tidak valid. Solusi yang lebih fleksibel adalah **Isotonic Regression** (Zadrozny & Elkan, 2002).

**Prinsip Kerja Isotonic Regression:**
Isotonic regression adalah teknik **non-parametrik** yang memetakan skor prediksi $\\hat{p}_i$ ke probabilitas terkalibrasi $y_i^*$ dengan satu-satunya batasan: fungsi pemetaan harus **monotonik naik tak-turun** (*non-decreasing isotonic function*):
$$\\min_{m_1, \\dots, m_n} \\sum_{i=1}^n (y_i - m_i)^2 \\quad \\text{dengan kendala } m_1 \\le m_2 \\le \\dots \\le m_n$$
di mana data diurutkan berdasarkan skor awal $\\hat{p}_1 \\le \\hat{p}_2 \\le \\dots \\le \\hat{p}_n$.

**Algoritma Pair-Adjacent Violators (PAV):**
Algoritma PAV menyelesaikan masalah optimasi kuadratik terikat ini dalam kompleksitas waktu linier $\\mathcal{O}(n)$:
- Algoritma menelusuri titik-titik berurutan; jika ditemukan pasangan yang melanggar urutan monotonik ($m_i > m_{i+1}$), kedua titik tersebut digabungkan (*pooled*) dan diganti dengan nilai rata-ratanya.
- Proses penggabungan mundur terus berulang hingga seluruh rangkaian bernilai monoton naik.

Hasil akhir Isotonic Regression adalah **fungsi tangga bertingkat (*piecewise constant step function*)**.`,
        formula: `\\min_{\\mathbf{m}} \\sum_{i=1}^n (y_i - m_i)^2 \\quad \\text{s.t.} \\quad m_1 \\le m_2 \\le \\dots \\le m_n \\quad (\\text{Algoritma PAV})`,
        code: `# 11.9: Perbandingan Kalibrasi Platt vs Isotonic Regression pada Random Forest
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import brier_score_loss

X, y = make_classification(n_samples=2500, n_features=20, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

rf = RandomForestClassifier(n_estimators=50, random_state=42)

# 1. Tanpa Kalibrasi
rf.fit(X_train, y_train)
p_raw = rf.predict_proba(X_test)[:, 1]

# 2. Platt Scaling (Sigmoid)
cal_sig = CalibratedClassifierCV(estimator=rf, method='sigmoid', cv=5).fit(X_train, y_train)
p_sig = cal_sig.predict_proba(X_test)[:, 1]

# 3. Isotonic Regression
cal_iso = CalibratedClassifierCV(estimator=rf, method='isotonic', cv=5).fit(X_train, y_train)
p_iso = cal_iso.predict_proba(X_test)[:, 1]

print("=== EVALUASI PERBANDINGAN METODE KALIBRASI ===")
print(f"1. Raw Random Forest      Brier Score: {brier_score_loss(y_test, p_raw):.4f}")
print(f"2. Platt (Sigmoid) Cal.   Brier Score: {brier_score_loss(y_test, p_sig):.4f}")
print(f"3. Isotonic Regression    Brier Score: {brier_score_loss(y_test, p_iso):.4f} (Optimal)")`,
        expectedOutput: "Isotonic Regression menghasilkan Brier Score terendah pada dataset berukuran besar.",
        codeExp: "Skrip membandingkan performa kalibrasi probabilistik mentah vs Sigmoid vs Isotonic Regression pada estimator Random Forest.",
        pitfalls: [
          "Menerapkan Isotonic Regression pada dataset kalibrasi kecil (< 1000 sampel); sifat non-parametriknya sangat rentan terhadap overfitting tangga pada data minim.",
          "Mengira kalibrasi probabilitas mengubah urutan perankingan AUC-ROC (pada isotonic yang monotonik sempurna, perankingan relatif sebagian besar tidak berubah)."
        ],
        refTitle: "Bianca Zadrozny & Charles Elkan: Transforming Classifier Scores into Accurate Multiclass Probability Estimates (KDD 2002)",
        refUrl: "https://dl.acm.org/doi/10.1145/775047.775151"
      },
      {
        num: "11.10",
        slug: "11-10-implementasi-pipelining-dan-evaluasi-kalibrasi-end-to-end",
        title: "11.10. Implementasi Pipeline Terintegrasi Kalibrasi Probabilitas Produksi",
        desc: "Alur kerja end-to-end: merangkai estimator ke dalam pipeline kalibrasi produksi, validasi silang bersarang (nested CV), dan pelaporan Expected Calibration Error (ECE).",
        concept: `Dalam arsitektur sistem pembelajaran mesin produksi standar enterprise, kalibrasi probabilitas bukan sekadar langkah terisolasi, melainkan komponen tetap dari **Pipeline Komposisi Model**.

**Prinsip Desain Pipeline Kalibrasi:**
1. **Pemisahan Pra-pemrosesan:** Penskalaan fitur dan imputasi nilai kosong harus dipelajari hanya dari data latih internal fold dan diterapkan secara otomatis ke estimator dasar maupun set kalibrasi.
2. **Kesesuaian Ukuran Data:**
   - Jika data latih melimpah ($N > 10.000$), gunakan \\\\`method='isotonic'\\\\`.
   - Jika data terbatas ($N < 2.000$), gunakan \\\\`method='sigmoid'\\\\`.
3. **Validasi Silang Terintegrasi (\\\\`cv=5\\\\` atau \\\\`cv='prefit'\\\\`):**
   - Jika estimator belum dilatih, gunakan \\\\`cv=5\\\\` agar Scikit-Learn melatih model dasar sekaligus model kalibrasi menggunakan out-of-fold splits.
   - Jika estimator sudah dilatih sebelumnya pada dataset terpisah, gunakan \\\\`cv='prefit'\\\\` dan pasangkan dengan set kalibrasi independen.`,
        formula: `\\text{ECE} = \\sum_{b=1}^B \\frac{|B_b|}{n} \\left| \\text{acc}(B_b) - \\text{conf}(B_b) \\right| \\quad (\\text{Expected Calibration Error})`,
        code: `# 11.10: Pipeline End-to-End Kalibrasi Model dengan Validasi Silang
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.datasets import make_classification
from sklearn.metrics import classification_report, brier_score_loss

X, y = make_classification(n_samples=2000, n_features=20, random_state=42)

# Buat pipeline dasar
base_pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('gbdt', GradientBoostingClassifier(n_estimators=60, random_state=42))
])

# Bungkus pipeline ke dalam CalibratedClassifierCV
calibrated_system = CalibratedClassifierCV(estimator=base_pipe, method='isotonic', cv=5)
calibrated_system.fit(X, y)

# Evaluasi pada data baru
X_new, y_new = make_classification(n_samples=500, n_features=20, random_state=123)
probs = calibrated_system.predict_proba(X_new)[:, 1]
preds = calibrated_system.predict(X_new)

print("=== PIPELINE PRODUKSI TERKALIBRASI BERHASIL ===")
print(f"Brier Score pada Data Baru: {brier_score_loss(y_new, probs):.4f}")
print(f"Akurasi Sistem Terkalibrasi: {(preds == y_new).mean()*100:.2f}%")`,
        expectedOutput: "Pipeline komposit berhasil melatih GBDT dengan penskalaan dan kalibrasi Isotonic, menghasilkan estimasi probabilitas stabil.",
        codeExp: "Skrip merangkai StandardScaler, GBDT, dan CalibratedClassifierCV ke dalam pipeline produksi terpadu dengan evaluasi Brier Score pada data out-of-sample.",
        pitfalls: [
          "Menyetel cv='prefit' namun memberikan data latih yang sama dengan data pembuatan estimator awal, yang menghasilkan under-estimation galat kalibrasi.",
          "Mengevaluasi performa hanya dengan akurasi pada ambang default 0.5 padahal probabilitas terkalibrasi ditujukan untuk pemilihan ambang keputusan berbasis biaya."
        ],
        refTitle: "Scikit-Learn Official Guide: Probability Calibration Pipelines",
        refUrl: "https://scikit-learn.org/stable/modules/calibration.html"
      }
    ]
  },

  // ==========================================
  // BAB 12: Pengurangan Dimensi Linier: PCA, SVD, dan Keragaman Spektral
  // ==========================================
  {
    orderIndex: 12,
    id: "machine-learning-ch-12",
    slug: "bab-12-pengurangan-dimensi-linier-pca-svd-spektral",
    title: "BAB 12: Pengurangan Dimensi Linier: PCA, SVD, dan Keragaman Spektral",
    desc: "Fondasi aljabar linier reduksi dimensi: geometri proyeksi ortogonal, dekomposisi nilai eigen matriks kovarians, Singular Value Decomposition (SVD), Explained Variance Ratio, Scree Plot, kelemahan sensitivitas skala, Incremental PCA (IPCA), Randomized PCA Halko et al., Kernel PCA (kPCA), TruncatedSVD untuk teks dan matriks jarang, serta analisis galat rekonstruksi data.",
    coreConcepts: ["Orthogonal Projection", "Covariance Eigen-decomposition", "Singular Value Decomposition (SVD)", "Explained Variance Ratio & Scree Plot", "Scale Sensitivity", "Incremental PCA (IPCA)", "Randomized PCA", "Kernel PCA (kPCA)", "TruncatedSVD", "Reconstruction Error Loss"],
    subchapters: [
      {
        num: "12.1",
        slug: "12-1-geometri-proyeksi-ortogonal-dan-maksimisasi-varians",
        title: "12.1. Geometri Proyeksi Ortogonal: Maksimisasi Varians vs Minimisasi Galat Rekonstruksi",
        desc: "Dua perspektif fundamental reduksi dimensi: mencari sumbu ortogonal dengan sebaran informasi maksimum vs meminimalkan jarak proyeksi kuadrat.",
        concept: `Pengurangan Dimensi (*Dimensionality Reduction*) bertujuan memetakan data dari ruang berdimensi tinggi $\\mathbb{R}^d$ ke subruang berdimensi lebih rendah $\\mathbb{R}^k$ ($k \\ll d$) dengan meminimalkan kehilangan informasi. Dalam metode linier, pemetaan ini dilakukan melalui **proyeksi ortogonal**.

Terdapat dua sudut pandang matematis yang ekuivalen dalam merumuskan tujuan Principal Component Analysis (PCA):
1. **Perspektif Maksimisasi Varians (Karl Pearson, 1901):**
   Mencari arah sumbu proyeksi unit vektor $\\mathbf{u}_1$ (dengan $\\|\\mathbf{u}_1\\|_2 = 1$) sedemikian rupa sehingga varians dari titik-titik data yang diproyeksikan ke sumbu tersebut mencapai nilai **maksimal**:
   $$\\max_{\\|\\mathbf{u}_1\\|=1} \\frac{1}{n} \\sum_{i=1}^n (\\mathbf{x}_i^\\top \\mathbf{u}_1)^2 = \\max_{\\|\\mathbf{u}_1\\|=1} \\mathbf{u}_1^\\top \\mathbf{\\Sigma} \\mathbf{u}_1$$
   di mana $\\mathbf{\\Sigma}$ adalah matriks kovarians sampel data yang telah dinormalisasi ke rata-rata nol.
2. **Perspektif Minimisasi Galat Rekonstruksi (Reconstruction Error):**
   Mencari hiperbidang berdimensi-$k$ yang meminimalkan jumlah kuadrat jarak tegak lurus Euklides dari setiap titik data asli ke proyeksi titik tersebut pada hiperbidang:
   $$\\min \\sum_{i=1}^n \\|\\mathbf{x}_i - \\tilde{\\mathbf{x}}_i\\|_2^2$$

Teorema Aljabar Linier membuktikan bahwa **arah yang memaksimalkan varians proyeksi adalah tepat arah yang meminimalkan galat rekonstruksi kuadrat**.`,
        formula: `\\max_{\\mathbf{u}} \\mathbf{u}^\\top \\mathbf{\\Sigma} \\mathbf{u} \\quad \\text{s.t.} \\quad \\mathbf{u}^\\top \\mathbf{u} = 1 \\iff \\min \\sum_{i=1}^n \\|\\mathbf{x}_i - \\tilde{\\mathbf{x}}_i\\|^2`,
        code: `# 12.1: Visualisasi Geometris Maksimisasi Varians Proyeksi pada Data 2D
import numpy as np

# Sintesis data berkorelasi tinggi
np.random.seed(42)
x1 = np.random.normal(0, 2, 200)
x2 = 0.8 * x1 + np.random.normal(0, 0.5, 200)
X = np.column_stack([x1, x2])
X_centered = X - np.mean(X, axis=0)

# Matriks kovarians
cov_matrix = np.cov(X_centered, rowvar=False)

# Hitung varians proyeksi untuk berbagai sudut rotasi theta (0 hingga pi)
thetas = np.linspace(0, np.pi, 100)
variances = []
for th in thetas:
    u = np.array([np.cos(th), np.sin(th)])
    var_proj = np.var(X_centered.dot(u))
    variances.append(var_proj)

best_idx = np.argmax(variances)
best_theta = thetas[best_idx]
print("=== ANALISIS GEOMETRI PROYEKSI PCA ===")
print(f"Sudut Proyeksi Maksimal: {np.degrees(best_theta):.2f} derajat")
print(f"Varians Maksimum       : {variances[best_idx]:.4f}")
print(f"Varians Minimum (Ortogonal): {np.min(variances):.4f}")`,
        expectedOutput: "Varians maksimum teridentifikasi sepanjang sumbu elips sebaran data (~38-40 derajat).",
        codeExp: "Skrip menghitung varians proyeksi pada seluruh sudut vektor unit 2D, membuktikan keberadaan arah unik yang memaksimalkan varians.",
        pitfalls: [
          "Menerapkan proyeksi PCA tanpa melakukan centering (pengurangan rata-rata menjadi nol), yang menyebabkan sumbu pertama menunjuk ke vektor rata-rata populasi, bukan arah varians terbesar.",
          "Menganggap varians kecil selalu identik dengan derau; dalam beberapa domain (seperti deteksi anomali), komponen dengan varians terkecil justru memuat sinyal anomali terpenting."
        ],
        refTitle: "Karl Pearson: On Lines and Planes of Closest Fit to Systems of Points in Space (Philosophical Magazine, 1901)",
        refUrl: "https://www.tandfonline.com/doi/abs/10.1080/14786440109462720"
      },
      {
        num: "12.2",
        slug: "12-2-penurunan-matematis-pca-dekomposisi-nilai-eigen",
        title: "12.2. Penurunan Matematis PCA: Dekomposisi Nilai Eigen Matriks Kovarians",
        desc: "Formulasi analitis pengali Lagrange: pembuktian bahwa komponen utama pertama adalah vektor eigen dari matriks kovarians dengan nilai eigen terbesar.",
        concept: `Untuk membuktikan secara analitis solusi dari masalah optimasi maksimisasi varians proyeksi:
$$\\max_{\\mathbf{u}} \\mathbf{u}^\\top \\mathbf{\\Sigma} \\mathbf{u} \\quad \\text{dengan kendala } \\mathbf{u}^\\top \\mathbf{u} = 1$$

Kita konstruksikan fungsi **Lagrangian**:
$$\\mathcal{L}(\\mathbf{u}, \\lambda) = \\mathbf{u}^\\top \\mathbf{\\Sigma} \\mathbf{u} - \\lambda (\\mathbf{u}^\\top \\mathbf{u} - 1)$$
di mana $\\lambda$ adalah pengali Lagrange (*Lagrange multiplier*).

**Mencari Titik Stasioner:**
Ambil turunan parsial terhadap vektor $\\mathbf{u}$ dan samakan dengan nol:
$$\\nabla_{\\mathbf{u}} \\mathcal{L} = 2 \\mathbf{\\Sigma} \\mathbf{u} - 2 \\lambda \\mathbf{u} = \\mathbf{0}$$
$$\\mathbf{\\Sigma} \\mathbf{u} = \\lambda \\mathbf{u}$$

Persamaan di atas adalah persamaan karakteristik klasik **Nilai Eigen dan Vektor Eigen (*Eigenvalue Problem*)**!
- $\\mathbf{u}$ harus merupakan **vektor eigen** dari matriks kovarians $\\mathbf{\\Sigma}$.
- $\\lambda$ adalah **nilai eigen** yang berkorespondensi.

Varians proyeksi itu sendiri adalah:
$$\\sigma_{\\text{proj}}^2 = \\mathbf{u}^\\top \\mathbf{\\Sigma} \\mathbf{u} = \\mathbf{u}^\\top (\\lambda \\mathbf{u}) = \\lambda (\\mathbf{u}^\\top \\mathbf{u}) = \\lambda$$
Untuk memaksimalkan varians proyeksi, kita harus memilih **vektor eigen $\\mathbf{u}_1$ yang berkorespondensi dengan nilai eigen terbesar $\\lambda_1$**!`,
        formula: `\\mathbf{\\Sigma} \\mathbf{u}_k = \\lambda_k \\mathbf{u}_k \\implies \\text{Varians Komponen } k = \\lambda_k`,
        code: `# 12.2: Penurunan PCA dari Nol via Dekomposisi Eigen (np.linalg.eig) vs Scikit-Learn
import numpy as np
from sklearn.decomposition import PCA

np.random.seed(42)
X = np.random.randn(100, 4).dot(np.array([[2, 1, 0, 0], [1, 3, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0.5]]))
X_centered = X - np.mean(X, axis=0)

# 1. Hitung Matriks Kovarians
cov_mat = np.cov(X_centered, rowvar=False)

# 2. Dekomposisi Nilai Eigen
eigenvalues, eigenvectors = np.linalg.eig(cov_mat)

# 3. Urutkan berdasarkan nilai eigen terbesar
idx = np.argsort(eigenvalues)[::-1]
sorted_eigenvalues = eigenvalues[idx]
sorted_eigenvectors = eigenvectors[:, idx]

# 4. Bandingkan dengan Scikit-Learn PCA
pca = PCA(n_components=4).fit(X)

print("=== VERIFIKASI PENURUNAN MATEMATIS PCA ===")
print("Nilai Eigen Manual  :", np.round(sorted_eigenvalues, 4))
print("Explained Var Sklearn:", np.round(pca.explained_variance_, 4))
print("Apakah Nilai Identik?:", np.allclose(sorted_eigenvalues, pca.explained_variance_))`,
        expectedOutput: "Nilai eigen manual terbukti identik presisi 100% dengan explained_variance_ Scikit-Learn.",
        codeExp: "Skrip menyelesaikan masalah eigen matriks kovarians secara manual menggunakan NumPy dan membuktikan kesetaraannya dengan modul PCA Scikit-Learn.",
        pitfalls: [
          "Vektor eigen memiliki ketidakpastian tanda arah (+/-), orientasi sumbu proyeksi dapat terbalik 180 derajat namun garis subruang yang dibentuk tetap sama.",
          "Menggunakan np.linalg.eig pada matriks non-simetris; matriks kovarians selalu simetris semi-positif definit sehingga np.linalg.eigh lebih stabil secara numerik."
        ],
        refTitle: "Gilbert Strang: Linear Algebra and Its Applications (Singular Values and Principal Components)",
        refUrl: "https://math.mit.edu/~gs/linearalgebra/"
      },
      {
        num: "12.3",
        slug: "12-3-singular-value-decomposition-svd-hubungan-eksak-pca",
        title: "12.3. Singular Value Decomposition (SVD): Hubungan Matematis Eksak SVD dengan PCA",
        desc: "Faktorisasi matriks universal: membuktikan dekomposisi matriks data X = U Sigma V^T dan mengapa Scikit-Learn menggunakan SVD tanpa membentuk matriks kovarians.",
        concept: `Dalam pustaka komputasi numerik modern (termasuk Scikit-Learn dan LAPACK), PCA **hampir tidak pernah** dihitung dengan membentuk matriks kovarians $\\mathbf{\\Sigma} = \\frac{1}{n} \\mathbf{X}^\\top \\mathbf{X}$ lalu mendekomposisi nilai eigennya. Menghitung $\\mathbf{X}^\\top \\mathbf{X}$ memerlukan komputasi $\\mathcal{O}(n d^2)$ dan dapat memicu pembulatan galat numerik (*loss of precision*) karena kuadrat dari nilai singular.

Sebagai gantinya, pustaka standar menggunakan **Singular Value Decomposition (SVD)** langsung pada matriks data terpusat $\\mathbf{X} \\in \\mathbb{R}^{n \\times d}$:
$$\\mathbf{X} = \\mathbf{U} \\mathbf{\\Sigma}_{\\text{svd}} \\mathbf{V}^\\top$$
di mana:
- $\\mathbf{U} \\in \\mathbb{R}^{n \\times n}$: Matriks ortogonal vektor singular kiri.
- $\\mathbf{\\Sigma}_{\\text{svd}} \\in \\mathbb{R}^{n \\times d}$: Matriks diagonal nilai singular $s_1 \\ge s_2 \\ge \\dots \\ge s_r \\ge 0$.
- $\\mathbf{V} \\in \\mathbb{R}^{d \\times d}$: Matriks ortogonal vektor singular kanan.

**Hubungan Eksak SVD dengan PCA:**
Matriks kovarians adalah:
$$\\mathbf{X}^\\top \\mathbf{X} = (\\mathbf{U} \\mathbf{\\Sigma}_{\\text{svd}} \\mathbf{V}^\\top)^\\top (\\mathbf{U} \\mathbf{\\Sigma}_{\\text{svd}} \\mathbf{V}^\\top) = \\mathbf{V} \\mathbf{\\Sigma}_{\\text{svd}}^\\top \\mathbf{U}^\\top \\mathbf{U} \\mathbf{\\Sigma}_{\\text{svd}} \\mathbf{V}^\\top = \\mathbf{V} \\mathbf{\\Sigma}_{\\text{svd}}^2 \\mathbf{V}^\\top$$
Karena $\\mathbf{X}^\\top \\mathbf{X} = (n-1) \\mathbf{\\Sigma}_{\\text{cov}} = \\mathbf{V} \\mathbf{\\Lambda} \\mathbf{V}^\\top$, kita simpulkan:
1. **Kolom-kolom $\\mathbf{V}$ adalah tepat Komponen Utama (Principal Components / Vektor Eigen) dari $\\mathbf{\\Sigma}_{\\text{cov}}$!**
2. **Nilai eigen terhubung langsung dengan nilai singular:** $\\lambda_k = \\frac{s_k^2}{n - 1}$.
3. Proyeksi data tereduksi langsung dihitung via $\\mathbf{X}_{\\text{proj}} = \\mathbf{X} \\mathbf{V}_k = \\mathbf{U}_k \\mathbf{\\Sigma}_k$.`,
        formula: `\\mathbf{X} = \\mathbf{U} \\mathbf{\\Sigma} \\mathbf{V}^\\top \\implies \\lambda_k = \\frac{s_k^2}{n - 1} \\quad \\text{dan Vektor Komponen } = \\mathbf{V}`,
        code: `# 12.3: Eksekusi PCA Menggunakan SVD (np.linalg.svd) dan Verifikasi Hubungan Eksak
import numpy as np
from sklearn.decomposition import PCA

np.random.seed(42)
X = np.random.randn(80, 5)
n = len(X)
X_centered = X - np.mean(X, axis=0)

# SVD langsung pada matriks data terpusat
U, s, Vt = np.linalg.svd(X_centered, full_matrices=False)
V = Vt.T

# Hitung varians dari nilai singular s
variansi_svd = (s ** 2) / (n - 1)

# Komparasi dengan PCA Scikit-Learn
pca = PCA().fit(X)

print("=== HUBUNGAN EKSAK SVD DENGAN PCA ===")
print("Varians dari Nilai Singular (s^2 / (n-1)):", np.round(variansi_svd, 4))
print("Explained Variance dari Scikit-Learn     :", np.round(pca.explained_variance_, 4))
print("Komponen Vektor V[:, 0] Identik (Abaikan Tanda)?:", np.allclose(np.abs(V[:, 0]), np.abs(pca.components_[0])))`,
        expectedOutput: "Varians dari nilai singular identik sempurna dengan Scikit-Learn PCA.",
        codeExp: "Skrip membuktikan kesetaraan aljabar antara faktorisasi SVD dan PCA, menunjukkan bahwa kolom V adalah komponen utama PCA.",
        pitfalls: [
          "Menerapkan SVD pada data mentah tanpa mengurangkan nilai mean (centering); SVD standar tidak melakukan centering secara otomatis.",
          "Lupa bahwa baris Vt dari np.linalg.svd adalah transpos dari matriks V, sehingga V = Vt.T."
        ],
        refTitle: "Gene H. Golub & Charles F. Van Loan: Matrix Computations (Johns Hopkins University Press)",
        refUrl: "https://jhupbooks.press.jhu.edu/title/matrix-computations"
      },
      {
        num: "12.4",
        slug: "12-4-rasio-varians-terjelaskan-scree-plot-dan-pemilihan-k",
        title: "12.4. Rasio Varians Terjelaskan (Explained Variance Ratio) dan Scree Plot",
        desc: "Metodologi pemilihan dimensi optimal: kriteria siku (elbow method) Scree Plot, batas kumulatif 95%, dan parameter n_components mengambang pada Scikit-Learn.",
        concept: `Pertanyaan mendasar dalam aplikasi reduksi dimensi adalah: **Berapa banyak komponen utama ($k$) yang harus dipertahankan?** Jika $k$ terlalu kecil, banyak informasi berharga hilang; jika $k$ terlalu besar, dimensi tidak tereduksi secara efektif dan derau tetap terbawa.

**Rasio Varians Terjelaskan (Explained Variance Ratio):**
Proporsi varians yang ditangkap oleh komponen ke-$j$ terhadap total varians seluruh dataset dirumuskan sebagai:
$$\\text{EVR}_j = \\frac{\\lambda_j}{\\sum_{m=1}^d \\lambda_m} = \\frac{s_j^2}{\\sum_{m=1}^d s_m^2}$$

**Strategi Pemilihan $k$:**
1. **Ambang Batas Varians Kumulatif (Cumulative Variance Threshold):**
   Memilih $k$ terkecil yang mampu menjelaskan setidaknya $90\\%$ atau $95\\%$ dari total varians data:
   $$k^* = \\arg\\min_k \\left( \\sum_{j=1}^k \\text{EVR}_j \\ge 0.95 \\right)$$
   Dalam Scikit-Learn, kita cukup menyetel parameter float: \\\\`PCA(n_components=0.95)\\\\`.
2. **Kriteria Siku Scree Plot (Elbow Method / Cattell, 1966):**
   Membuat grafik batang atau kurva nilai eigen $\\lambda_j$ terhadap indeks komponen $j$. Titik di mana kurva mengalami penurunan tajam lalu mendatar seperti tebing (*cliff and scree*) dipilih sebagai batas dimensi intrinsik.
3. **Kaiser-Guttman Rule:** Mempertahankan komponen yang memiliki nilai eigen $\\lambda_j > 1.0$ (pada data yang telah distandarisasi).`,
        formula: `\\text{Cumulative EVR}(k) = \\sum_{j=1}^k \\frac{\\lambda_j}{\\sum_{m=1}^d \\lambda_m} \\ge \\alpha \\quad (\\text{misal } \\alpha = 0.95)`,
        code: `# 12.4: Pemilihan Komponen Optimal Otomatis dan Visualisasi Scree Plot
import numpy as np
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA

digits = load_digits()
X = digits.data # 64 fitur (gambar 8x8 piksel)

# Latih PCA penuh 64 komponen
pca_full = PCA().fit(X)
cum_var = np.cumsum(pca_full.explained_variance_ratio_)

# Cari k untuk 90% dan 95% varians
k_90 = np.argmax(cum_var >= 0.90) + 1
k_95 = np.argmax(cum_var >= 0.95) + 1

print("=== PEMILIHAN DIMENSI INTRINSIK DATASET DIGITS (64 FITUR) ===")
print(f"Jumlah Komponen untuk 90% Varians: {k_90} dari 64 fitur (Kompresi {((1 - k_90/64)*100):.1f}%)")
print(f"Jumlah Komponen untuk 95% Varians: {k_95} dari 64 fitur (Kompresi {((1 - k_95/64)*100):.1f}%)")

# Scikit-learn otomatis via float n_components
pca_auto = PCA(n_components=0.95).fit(X)
print(f"Verifikasi Otomatis PCA(n_components=0.95): {pca_auto.n_components_} komponen terpilih.")`,
        expectedOutput: "PCA berhasil mereduksi 64 fitur piksel menjadi ~28-29 komponen untuk mempertahankan 95% varians.",
        codeExp: "Skrip menghitung explained variance ratio kumulatif dan menunjukkan cara Scikit-Learn memilih n_components secara otomatis.",
        pitfalls: [
          "Memilih n_components=2 atau 3 hanya untuk keperluan visualisasi pada data riil yang sebenarnya membutuhkan puluhan komponen untuk mempertahankan sinyal prediktif.",
          "Lupa bahwa explained_variance_ratio_ hanya mencerminkan variabilitas fitur tanpa jaminan korelasi terhadap label target (supervised task)."
        ],
        refTitle: "Raymond B. Cattell: The Scree Test For The Number Of Factors (Multivariate Behavioral Research, 1966)",
        refUrl: "https://www.tandfonline.com/doi/abs/10.1207/s15327906mbr0102_10"
      },
      {
        num: "12.5",
        slug: "12-5-sensitivitas-skala-fitur-dan-outlier-pada-pca",
        title: "12.5. Sensitivitas Ekstrem PCA terhadap Skala Fitur dan Keberadaan Pencilan (Outliers)",
        desc: "Analisis kelemahan struktural: mengapa penskalaan StandardScaler adalah pra-syarat mutlak dan dampak pergeseran vektor eigen oleh pencilan ekstrem.",
        concept: `Meskipun PCA sangat kuat, ia memiliki dua kelemahan struktural kritis yang sering menjebak praktisi:

**1. Sensitivitas Ekstrem terhadap Skala Fitur:**
Karena fungsi objektif PCA adalah memaksimalkan varians absolut $\\mathbf{u}^\\top \\mathbf{\\Sigma} \\mathbf{u}$, fitur yang memiliki rentang nilai atau satuan numerik yang jauh lebih besar (misalnya fitur Pendapatan Tahunan dalam jutaan rupiah vs fitur Umur dalam puluhan tahun) akan mendominasi nilai varians total.
Akibatnya, **Komponen Utama Pertama ($PC_1$) hanya akan sejajar dengan fitur berbobot skala terbesar tersebut**, mengabaikan seluruh fitur lainnya meskipun fitur lain tersebut memuat pola struktural yang lebih penting.
Oleh karena itu, **Standarisasi Fitur (\\\\`StandardScaler\\\\`) ke $\\mu=0, \\sigma^2=1$ adalah kewajiban mutlak sebelum menjalankan PCA**, kecuali seluruh fitur sudah memiliki satuan dan skala varians yang identik secara intrinsik.

**2. Kerentanan terhadap Outlier (Pencilan):**
Matriks kovarians sampel dihitung berdasarkan kuadrat deviasi $(\\mathbf{x}_i - \\bar{\\mathbf{x}})^2$. Satu atau dua titik outlier ekstrem yang berjarak jauh dari pusat massa data akan memberikan kontribusi kuadratik yang masif terhadap matriks kovarians, **menarik dan membelokkan orientasi vektor komponen utama** ke arah pencilan tersebut. Solusinya meliputi pembersihan outlier atau penggunaan teknik Robust PCA.`,
        formula: `\\text{Jika } \\text{Var}(X_1) \\gg \\text{Var}(X_2) \\implies \\mathbf{u}_1 \\approx [1, 0]^\\top \\quad (\\text{Distorsi Skala Tanpa Standarisasi})`,
        code: `# 12.5: Demonstrasi Malapetaka PCA Tanpa Standarisasi Fitur
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# Sintesis 2 fitur: Fitur 1 bernilai kecil tapi berpola, Fitur 2 bernilai raksasa acak
np.random.seed(42)
fitur_penting = np.random.normal(0, 1, 500)
fitur_skala_besar = np.random.normal(1000, 100, 500) # Varians 10.000!

X = np.column_stack([fitur_penting, fitur_skala_besar])

# 1. PCA Tanpa Standarisasi
pca_mentah = PCA(n_components=2).fit(X)

# 2. PCA Dengan Standarisasi
X_scaled = StandardScaler().fit_transform(X)
pca_scaled = PCA(n_components=2).fit(X_scaled)

print("=== DAMPAK STANDARISASI FITUR PADA PCA ===")
print("Tanpa Standarisasi - EVR Component 1:", f"{pca_mentah.explained_variance_ratio_[0]*100:.2f}% (Didominasi 100% oleh Fitur 2)")
print("Komponen Bobot 1 (Tanpa Scaling)    :", np.round(pca_mentah.components_[0], 4))
print("Dengan Standarisasi - EVR Component 1 :", f"{pca_scaled.explained_variance_ratio_[0]*100:.2f}%")
print("Komponen Bobot 1 (Dengan Scaling)   :", np.round(pca_scaled.components_[0], 4))`,
        expectedOutput: "Tanpa penskalaan, komponen 1 didominasi 99.9% oleh fitur berdimensi besar, sedangkan penskalaan membagi bobot secara adil.",
        codeExp: "Skrip menunjukkan bagaimana fitur berbobot besar mendominasi PCA secara artifisial jika StandardScaler tidak diterapkan.",
        pitfalls: [
          "Menerapkan StandardScaler pada seluruh dataset sebelum train-test split (wajib fit hanya pada train set untuk menghindari data leakage).",
          "Mengabaikan outlier sebelum PCA yang menyebabkan orientasi komponen utama terdistorsi puluhan derajat."
        ],
        refTitle: "Scikit-Learn Common Pitfalls: Importance of Feature Scaling for PCA",
        refUrl: "https://scikit-learn.org/stable/auto_examples/preprocessing/plot_scaling_importance.html"
      },
      {
        num: "12.6",
        slug: "12-6-incremental-pca-ipca-out-of-core-skala-besar",
        title: "12.6. Incremental PCA (IPCA): Reduksi Dimensi Out-of-Core untuk Dataset Raksasa",
        desc: "Strategi komputasi mini-batch Ross et al. (2008): pembaruan ruang eigen inkremental tanpa memuat seluruh dataset ke dalam memori RAM.",
        concept: `Standar PCA Scikit-Learn mengharuskan seluruh matriks data $\\mathbf{X} \\in \\mathbb{R}^{n \\times d}$ dimuat ke dalam memori kerja (RAM) secara simultan untuk melakukan faktorisasi SVD. Ketika ukuran dataset mencapai jutaan baris atau puluhan ribu fitur (skala Gigabyte hingga Terabyte), pendekatan ini memicu galat kehabisan memori (*MemoryError* atau Out-of-Memory OOM).

David Ross et al. (IJCV 2008) mengembangkan **Incremental PCA (IPCA)**:
IPCA memproses data dalam **potongan-potongan kecil (mini-batches)** berukuran $b \\ll n$ secara sekuensial atau out-of-core dari media penyimpanan disk:
1. Pada setiap mini-batch baru $\\mathbf{X}_{\\text{batch}} \\in \\mathbb{R}^{b \\times d}$, algoritma memperbarui estimasi rata-rata dan ruang eigen terpotong (*truncated eigenspace*) sebelumnya.
2. Pembaruan dilakukan melalui SVD modifikasi berukuran $(k + b) \\times d$, bukan $n \\times d$.
3. Kompleksitas memori RAM menjadi $\\mathcal{O}(b \\cdot d)$, sepenuhnya independen dari jumlah total sampel $n$.

Hasil transformasi IPCA terbukti mendekati hasil PCA standar secara presisi, menjadikannya standar industri untuk pemrosesan citra satelit dan genomika skala besar.`,
        formula: `\\mathcal{O}(\\text{Memori}) = \\mathcal{O}(b \\cdot d) \\quad \\text{di mana } b \\ll n \\quad (\\text{Kompleksitas Memori Out-of-Core})`,
        code: `# 12.6: Pemrosesan Data Out-of-Core Menggunakan IncrementalPCA (IPCA)
import numpy as np
from sklearn.decomposition import IncrementalPCA, PCA

# Sintesis dataset besar (misal 5000 sampel, 50 fitur)
np.random.seed(42)
X = np.random.randn(5000, 50)
batch_size = 500
n_components = 10

# Inisialisasi IPCA
ipca = IncrementalPCA(n_components=n_components, batch_size=batch_size)

# Latih bertahap menggunakan potongan mini-batch
for i in range(0, len(X), batch_size):
    batch = X[i:i + batch_size]
    ipca.partial_fit(batch)

# Komparasi dengan PCA batch penuh
pca = PCA(n_components=n_components).fit(X)

cos_sim = np.abs(np.sum(ipca.components_[0] * pca.components_[0]))
print("=== EVALUASI INCREMENTAL PCA (OUT-OF-CORE) ===")
print(f"Cosine Similarity Komponen 1 (IPCA vs Full PCA): {cos_sim:.5f}")
print("Apakah Hasil Dekat Identik (>= 0.999)?:", cos_sim >= 0.999)`,
        expectedOutput: "Cosine similarity mendekati 1.00000 membuktikan presisi tinggi IPCA terhadap PCA standar.",
        codeExp: "Skrip mendemonstrasikan metode partial_fit pada IncrementalPCA dengan mini-batch dan memvalidasi kesamaan hasilnya dengan PCA standar.",
        pitfalls: [
          "Menyetel batch_size lebih kecil daripada n_components; batch_size wajib bernilai lebih besar atau sama dengan n_components.",
          "Mengira IPCA dapat digunakan jika data memiliki missing values (NaN harus diimputasi sebelum streaming)."
        ],
        refTitle: "David A. Ross et al.: Incremental Learning for Robust Visual Tracking (IJCV 2008)",
        refUrl: "https://link.springer.com/article/10.1007/s11263-007-0075-7"
      },
      {
        num: "12.7",
        slug: "12-7-randomized-pca-aproksimasi-acak-cepat-halko",
        title: "12.7. Randomized PCA: Algoritma Proyeksi Acak Cepat Halko et al. (2011)",
        desc: "Aproksimasi stokastik berkinerja tinggi: mereduksi kompleksitas SVD matriks raksasa melalui proyeksi acak matriks Gaussian.",
        concept: `Ketika dataset memiliki dimensi fitur yang sangat besar ($d \\gg 1000$) dan kita hanya ingin mengekstraksi sejumlah kecil komponen utama ($k \\ll d$), menjalankan SVD penuh deterministik sangat memakan waktu (kompleksitas $\\mathcal{O}(n d \\min(n, d))$).

Nathan Halko, Per-Gunnar Martinsson, dan Joel A. Tropp (SIAM Review 2011) merevolusi komputasi spektral dengan merumuskan **Randomized SVD / Randomized PCA**:
Algoritma ini menggunakan **proyeksi acak Gaussian (*randomized projections*)** untuk mengompresi rentang matriks data ke subruang berdimensi rendah:
1. Bangkitkan matriks acak Gaussian $\\mathbf{\\Omega} \\in \\mathbb{R}^{d \\times (k + p)}$ di mana $p$ adalah parameter *oversampling* (biasanya $p = 5$ atau $10$).
2. Bentuk matriks sampel tereduksi $\\mathbf{Y} = \\mathbf{X} \\mathbf{\\Omega}$.
3. Lakukan faktorisasi QR pada $\\mathbf{Y}$ untuk memperoleh basis ortonormal $\\mathbf{Q}$ ($\\|\\mathbf{X} - \\mathbf{Q}\\mathbf{Q}^\\top \\mathbf{X}\\| \\approx 0$).
4. Proyeksikan data ke basis kecil: $\\mathbf{B} = \\mathbf{Q}^\\top \\mathbf{X} \\in \\mathbb{R}^{(k+p) \\times d}$.
5. Lakukan SVD standar pada matriks kecil $\\mathbf{B}$ yang jauh lebih cepat: $\\mathbf{B} = \\tilde{\\mathbf{U}} \\mathbf{\\Sigma} \\mathbf{V}^\\top$.

Dalam Scikit-Learn, metode ini diaktifkan secara default saat kita menyetel \\\\`svd_solver='randomized'\\\\`. Kecepatan komputasinya meningkat puluhan kali lipat dengan galat aproksimasi yang secara teoretis terbukti sangat kecil.`,
        formula: `\\mathbf{Y} = \\mathbf{X} \\mathbf{\\Omega}, \\quad \\mathbf{Y} = \\mathbf{Q} \\mathbf{R} \\implies \\mathbf{B} = \\mathbf{Q}^\\top \\mathbf{X} \\quad (\\text{Kompresi Stokastik})`,
        code: `# 12.7: Perbandingan Kecepatan Komputasi PCA Standar (Full) vs Randomized PCA
import time
import numpy as np
from sklearn.decomposition import PCA

np.random.seed(42)
X_large = np.random.randn(3000, 1000) # 3000 sampel, 1000 fitur
k = 20

# 1. Full SVD
t0 = time.time()
pca_full = PCA(n_components=k, svd_solver='full').fit(X_large)
t_full = time.time() - t0

# 2. Randomized SVD
t0 = time.time()
pca_rand = PCA(n_components=k, svd_solver='randomized', random_state=42).fit(X_large)
t_rand = time.time() - t0

print("=== BENCHMARK: FULL SVD VS RANDOMIZED SVD ===")
print(f"Waktu Eksekusi Full SVD      : {t_full:.4f} detik")
print(f"Waktu Eksekusi Randomized SVD: {t_rand:.4f} detik (Speedup: {t_full/t_rand:.2f}x)")
cos_sim = np.abs(np.sum(pca_full.components_[0] * pca_rand.components_[0]))
print(f"Akurasi Komponen 1 (Cosine Similarity): {cos_sim:.6f}")`,
        expectedOutput: "Randomized PCA mencatat waktu komputasi jauh lebih cepat dengan akurasi kosinus > 0.99999.",
        codeExp: "Skrip membandingkan runtime SVD penuh vs acak pada matriks 3000x1000, membuktikan efisiensi algoritma Halko et al.",
        pitfalls: [
          "Mengabaikan parameter random_state pada Randomized PCA yang menyebabkan sedikit perbedaan non-deterministik antar eksekusi.",
          "Menyetel oversampling parameter yang terlalu kecil pada matriks dengan spektrum nilai singular yang meluruh lambat."
        ],
        refTitle: "N. Halko, P. G. Martinsson, J. A. Tropp: Finding Structure with Randomness (SIAM Review, 2011)",
        refUrl: "https://epubs.siam.org/doi/10.1137/090771806"
      },
      {
        num: "12.8",
        slug: "12-8-kernel-pca-kpca-dan-pemetaan-manifold-non-linier",
        title: "12.8. Kernel PCA (kPCA): Mengatasi Non-Linieritas dengan Kernel Trick",
        desc: "Eksplorasi reduksi dimensi non-linier: Schölkopf et al. (1998) mengintegrasikan Teorema Mercer untuk mengekstrak manifold melingkar dan struktur non-linier.",
        concept: `PCA linier standar mengasumsikan bahwa data terkonsentrasi di sekitar subruang hiperbidang datar linier. Namun, jika data terdistribusi di sepanjang manifold yang sangat non-linier (misalnya struktur lingkaran konsentris, spiral, atau Swiss Roll), proyeksi linier PCA akan menumpuk titik-titik data dan menghancurkan struktur pemisahan kelas.

Bernhard Schölkopf, Alexander Smola, dan Klaus-Robert Müller (Neural Computation, 1998) memperkenalkan **Kernel PCA (kPCA)**:
Menggunakan filosofi **Kernel Trick** yang sama dengan SVM, data dipetakan secara implisit ke ruang fitur berdimensi tinggi $\\mathcal{H}$ melalui fungsi $\\Phi(\\mathbf{x})$, lalu PCA linier dijalankan di dalam ruang $\\mathcal{H}$ tersebut tanpa pernah menghitung koordinat $\\Phi(\\mathbf{x})$ secara eksplisit.

**Matriks Kernel Terpusat (Centered Kernel Matrix):**
Diberikan matriks Gram $K_{ij} = k(\\mathbf{x}_i, \\mathbf{x}_j)$, matriks kernel terpusat $\\tilde{\\mathbf{K}}$ dihitung via:
$$\\tilde{\\mathbf{K}} = \\mathbf{K} - \\mathbf{1}_n \\mathbf{K} - \\mathbf{K} \\mathbf{1}_n + \\mathbf{1}_n \\mathbf{K} \\mathbf{1}_n$$
di mana $\\mathbf{1}_n$ adalah matriks berukuran $n \\times n$ dengan seluruh elemen bernilai $\\frac{1}{n}$.

Nilai eigen dari $\\tilde{\\mathbf{K}}$ menghasilkan vektor proyeksi non-linier yang mampu "membuka" lilitan manifold non-linier menjadi ruang linier terpisah sempurna.`,
        formula: `\\tilde{\\mathbf{K}} \\mathbf{a}_k = \\lambda_k \\mathbf{a}_k \\implies \\mathbf{y}_k(\\mathbf{x}) = \\sum_{i=1}^n a_{k, i} k(\\mathbf{x}_i, \\mathbf{x})`,
        code: `# 12.8: Pemisahan Data Lingkaran Konsentris: Linear PCA vs Kernel PCA (RBF)
import numpy as np
from sklearn.datasets import make_circles
from sklearn.decomposition import PCA, KernelPCA
from sklearn.linear_model import LogisticRegression

X, y = make_circles(n_samples=600, factor=0.3, noise=0.05, random_state=42)

# 1. Reduksi dengan Linear PCA ke 2D
pca = PCA(n_components=2).fit_transform(X)
acc_linear = LogisticRegression().fit(pca, y).score(pca, y)

# 2. Reduksi dengan Kernel PCA (RBF) ke 2D
kpca = KernelPCA(n_components=2, kernel='rbf', gamma=10, random_state=42).fit_transform(X)
acc_kpca = LogisticRegression().fit(kpca, y).score(kpca, y)

print("=== PEMISAHAN DATA LINGKARAN KONSENTRIS NON-LINIER ===")
print(f"Akurasi Klasifikasi Linear PCA : {acc_linear*100:.2f}% (Gagal Memisahkan)")
print(f"Akurasi Klasifikasi Kernel PCA : {acc_kpca*100:.2f}% (Pemisahan Sempurna!)")`,
        expectedOutput: "Linear PCA gagal (akurasi ~50%), sedangkan Kernel PCA RBF mencapai akurasi 100% pada data lingkaran konsentris.",
        codeExp: "Skrip menunjukkan superioritas KernelPCA dengan RBF kernel dalam memisahkan dataset non-linier make_circles yang gagal dipisahkan oleh Linear PCA.",
        pitfalls: [
          "Kernel PCA tidak memiliki pemetaan balik langsung (pre-image problem); merekonstruksi titik asli dari ruang kernel memerlukan estimasi numerik rumit.",
          "Kompleksitas memori matriks kernel $\\mathcal{O}(n^2)$ yang membuatnya tidak dapat diskalakan pada dataset dengan ratusan ribu baris."
        ],
        refTitle: "Bernhard Schölkopf, Alexander Smola, Klaus-Robert Müller: Nonlinear Component Analysis as a Kernel Eigenvalue Problem (Neural Computation, 1998)",
        refUrl: "https://direct.mit.edu/neco/article/10/5/1299/6158/Nonlinear-Component-Analysis-as-a-Kernel"
      },
      {
        num: "12.9",
        slug: "12-9-truncated-svd-dan-pemrosesan-matriks-sparse-lsa",
        title: "12.9. TruncatedSVD: Pengurangan Dimensi Matriks Tersebar (Sparse) dan Latent Semantic Analysis",
        desc: "Optimalisasi matriks sparse Scikit-Learn: aplikasi TruncatedSVD pada representasi teks TF-IDF tanpa memicu konversi dense pembakar memori.",
        concept: `Dalam pemrosesan bahasa alami (NLP) dan sistem temu balik informasi (*Information Retrieval*), data teks direpresentasikan menggunakan matriks frekuensi istilah dokumen (*Term-Document Matrix*) atau TF-IDF. Matriks ini memiliki karakteristik ekstrem:
1. **Sangat Tersebar (*Highly Sparse*):** Lebih dari 99% elemen bernilai tepat nol.
2. **Dimensi Sangat Besar:** Kosakata teks dapat memuat $100.000+$ kata unik ($d = 100.000$).

**Mengapa PCA Standar Gagal pada Matriks Sparse?**
PCA standar memerlukan langkah **Centering Data** (mengurangkan nilai rata-rata dari setiap kolom $\\mathbf{x} - \\bar{\\mathbf{x}}$). Karena rata-rata kolom frekuensi kata bernilai positif kecil (misal $0.001$), mengurangkan nilai rata-rata ini dari elemen nol akan mengubah seluruh elemen nol menjadi $-0.001$. Matriks sparse seketika berubah menjadi **matriks padat (*dense matrix*)**, melipatgandakan kebutuhan memori ribuan kali lipat dan memicu kehabisan RAM.

**Solusi: TruncatedSVD:**
\\\\` + "\\\\`TruncatedSVD\\\\`" + \\\\` Scikit-Learn mengeksekusi faktorisasi SVD terpotong langsung pada matriks sparse Scipy (\\\\` + "\\\\`scipy.sparse.csr_matrix\\\\`" + \\\\`) **tanpa pernah melakukan centering**.
Dalam pemrosesan teks, teknik reduksi dimensi TruncatedSVD ini dikenal sebagai **Latent Semantic Analysis (LSA)** atau **Latent Semantic Indexing (LSI)**: mentransformasikan ruang kata individual menjadi ruang konsep semantik laten.`,
        formula: `\\mathbf{X}_{\\text{sparse}} \\approx \\mathbf{U}_k \\mathbf{\\Sigma}_k \\mathbf{V}_k^\\top \\quad (\\text{Faktorisasi Langsung Tanpa Centering})`,
        code: `# 12.9: Aplikasi TruncatedSVD (LSA) pada Matriks Teks TF-IDF Sparse
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD

corpus = [
    "Machine learning algorithms build a mathematical model based on sample data.",
    "Deep learning neural networks require backpropagation and gradient descent.",
    "Statistical models and probability theory provide foundations for regression.",
    "Artificial intelligence systems and autonomous agents interact with environments.",
    "Linear algebra matrices and eigenvalues are central to PCA dimensionality reduction."
]

# Ekstraksi fitur TF-IDF (menghasilkan CSR matrix sparse)
vectorizer = TfidfVectorizer()
X_sparse = vectorizer.fit_transform(corpus)
print(f"Format Matriks TF-IDF: {type(X_sparse)} | Dimensi: {X_sparse.shape}")

# Terapkan TruncatedSVD (2 Komponen Laten)
svd = TruncatedSVD(n_components=2, random_state=42)
X_lsa = svd.fit_transform(X_sparse)

print("=== LATENT SEMANTIC ANALYSIS (TRUNCATED SVD) ===")
print("Explained Variance Ratio Kumulatif:", np.round(svd.explained_variance_ratio_.sum(), 4))
print("Representasi Vektor Dokumen Laten (2D):\n", np.round(X_lsa, 3))`,
        expectedOutput: "TruncatedSVD sukses memproses matriks CSR sparse secara langsung menjadi 2 komponen laten.",
        codeExp: "Skrip mendemonstrasikan aplikasi TruncatedSVD pada matriks teks TF-IDF sparse tanpa memicu konversi dense memory.",
        pitfalls: [
          "Mencoba melewatkan scipy.sparse matrix ke kelas PCA reguler (akan melemparkan TypeError eksplisit).",
          "Menginterpretasikan komponen TruncatedSVD persis sama dengan PCA; karena data tidak di-center, komponen pertama TruncatedSVD sering kali mencerminkan korelasi rata-rata dokumen."
        ],
        refTitle: "Scott Deerwester et al.: Indexing by Latent Semantic Analysis (Journal of the American Society for Information Science, 1990)",
        refUrl: "https://asistdl.onlinelibrary.wiley.com/doi/10.1002/%28SICI%291097-4571%28199009%2941%3A6%3C391%3A%3AAID-ASI1%3E3.0.CO%3B2-9"
      },
      {
        num: "12.10",
        slug: "12-10-rekonstruksi-data-dan-analisis-galat-kompresi",
        title: "12.10. Rekonstruksi Data dan Analisis Galat Kompresi (Reconstruction Error Loss)",
        desc: "Proses pemetaan terbalik (inverse_transform): mengukur hilangnya informasi kompresi data via Mean Squared Reconstruction Error (MSRE).",
        concept: `Setelah data diproyeksikan ke ruang berdimensi rendah $\\mathbf{Z} = \\mathbf{X}_{\\text{centered}} \\mathbf{V}_k \\in \\mathbb{R}^{n \\times k}$, data tersebut dapat diproyeksikan kembali ke ruang fitur asli $\\mathbb{R}^d$ menggunakan operasi invers:
$$\\tilde{\\mathbf{X}} = \\mathbf{Z} \\mathbf{V}_k^\\top + \\bar{\\mathbf{x}}$$
di mana $\\tilde{\\mathbf{X}}$ adalah **matriks data terekonstruksi**.

**Galat Rekonstruksi (Reconstruction Error):**
Karena $k < d$, proyeksi balik $\\tilde{\\mathbf{X}}$ tidak akan pernah identik sempurna dengan data asli $\\mathbf{X}$. Selisih antara data asli dan data terekonstruksi disebut **Residu Rekonstruksi**:
$$\\mathbf{E} = \\mathbf{X} - \\tilde{\\mathbf{X}}$$
Mean Squared Reconstruction Error (MSRE) dirumuskan sebagai:
$$\\text{MSRE} = \\frac{1}{n} \\|\\mathbf{X} - \\tilde{\\mathbf{X}}\\|_F^2 = \\frac{1}{n} \\sum_{i=1}^n \\sum_{j=1}^d (x_{ij} - \\tilde{x}_{ij})^2$$

**Hubungan Matematis Galat Rekonstruksi dengan Nilai Eigen:**
Teorema aljabar linier menyatakan bahwa galat rekonstruksi kuadrat rata-rata tepat sama dengan jumlah nilai eigen dari komponen-komponen yang **dibuang**:
$$\\text{MSRE} = \\sum_{m=k+1}^d \\lambda_m$$

Aplikasi rekonstruksi ini sangat vital pada:
1. **Denoising Citra:** Membuang komponen dengan nilai eigen kecil yang didominasi derau acak frekuensi tinggi.
2. **Deteksi Anomali Berbasis Rekonstruksi:** Sampel anomali yang polanya melanggar korelasi normal akan memiliki galat rekonstruksi $\\|\\mathbf{x}_i - \\tilde{\\mathbf{x}}_i\\|^2$ yang sangat besar.`,
        formula: `\\tilde{\\mathbf{X}} = (\\mathbf{X}_{\\text{centered}} \\mathbf{V}_k) \\mathbf{V}_k^\\top + \\bar{\\mathbf{x}} \\implies \\text{MSRE} = \\sum_{m=k+1}^d \\lambda_m`,
        code: `# 12.10: Rekonstruksi Citra Angka (Digits) dan Verifikasi Teorema Galat Rekonstruksi
import numpy as np
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA

digits = load_digits()
X = digits.data # 64 dimensi
k = 15

pca = PCA(n_components=k).fit(X)
X_reduced = pca.transform(X)
X_reconstructed = pca.inverse_transform(X_reduced)

# Hitung galat rekonstruksi empiris (MSRE)
msre_empiris = np.mean(np.sum((X - X_reconstructed)**2, axis=1))

# Hitung galat rekonstruksi teoretis (jumlah nilai eigen yang dibuang)
nilai_eigen_dibuang = np.sum(pca.explained_variance_[k:])

print("=== VERIFIKASI TEOREMA GALAT REKONSTRUKSI PCA ===")
print(f"Dimensi Asli: 64 -> Terkompresi: {k} Komponen")
print(f"Galat Rekonstruksi Empiris (MSRE): {msre_empiris:.4f}")
print(f"Jumlah Nilai Eigen yang Dibuang  : {nilai_eigen_dibuang:.4f}")
print("Apakah Galat Sesuai Prediksi Teoretis?:", np.isclose(msre_empiris, nilai_eigen_dibuang, rtol=1e-2))`,
        expectedOutput: "Galat rekonstruksi empiris terbukti cocok dengan jumlah nilai eigen yang dibuang.",
        codeExp: "Skrip melakukan kompresi citra dan inverse_transform untuk membuktikan teorema bahwa galat rekonstruksi sama dengan jumlah nilai eigen komponen yang dibuang.",
        pitfalls: [
          "Mengira inverse_transform mengembalikan data asli tanpa kehilangan informasi (informasi yang dibuang bersifat ireversibel).",
          "Menghitung galat rekonstruksi pada data yang belum pernah di-fit oleh PCA."
        ],
        refTitle: "Christopher M. Bishop: Pattern Recognition and Machine Learning (Chapter 12: Continuous Latent Variables)",
        refUrl: "https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/"
      }
    ]
  },

  // ==========================================
  // BAB 13: Pengurangan Dimensi Non-Linier dan Pembelajaran Manifold (Manifold Learning)
  // ==========================================
  {
    orderIndex: 13,
    id: "machine-learning-ch-13",
    slug: "bab-13-pengurangan-dimensi-non-linier-manifold-learning",
    title: "BAB 13: Pengurangan Dimensi Non-Linier dan Pembelajaran Manifold (Manifold Learning)",
    desc: "Eksplorasi representasi geometri subruang non-linier: hipotesis manifold, Multidimensional Scaling (MDS) metric vs non-metric, Isomap dan jarak geodesik graf Dijkstra, Locally Linear Embedding (LLE), t-SNE Van der Maaten & Hinton, probabilitas afinitas Gaussian vs Student-t, fenomena Crowding Problem, penalaan Perplexity, Uniform Manifold Approximation and Projection (UMAP) McInnes et al., serta larangan penggunaan manifold projections sebagai fitur model prediksi.",
    coreConcepts: ["Manifold Hypothesis", "Multidimensional Scaling (MDS)", "Isomap & Geodesic Distance", "Locally Linear Embedding (LLE)", "t-SNE Gaussian Affinity", "Crowding Problem & Student-t", "t-SNE Perplexity", "UMAP Fuzzy Simplicial Sets", "Global vs Local Topology Preservation", "Manifold Projection Pitfalls"],
    subchapters: [
      {
        num: "13.1",
        slug: "13-1-hipotesis-manifold-dan-keterbatasan-metode-linier",
        title: "13.1. Hipotesis Manifold: Mengapa Data Berdimensi Tinggi Terkonsentrasi pada Sub-Ruang Non-Linier",
        desc: "Konsep topologi dasar: merumuskan manifold d-dimensi terbenam dalam ruang D-dimensi dan kegagalan jarak Euklides global.",
        concept: `Dalam banyak domain nyata (seperti pengenalan wajah, pemrosesan suara, dan ekspresi genetik sel tunggal), data direpresentasikan dalam vektor berdimensi sangat tinggi (misalnya citra digital berukuran $1000 \\times 1000$ piksel menghasilkan ruang $\\mathbb{R}^{1.000.000}$). Jika ruang ini diisi secara seragam, kita akan menghadapi kutukan dimensi (*Curse of Dimensionality*).

Namun, **Hipotesis Manifold (Manifold Hypothesis)** menyatakan bahwa:
Dataset dunia nyata berdimensi tinggi sebenarnya terkonsentrasi pada atau sangat dekat dengan **Manifold berdimensi rendah non-linier $\\mathcal{M}$ ($d \\ll D$)** yang terbenam (*embedded*) di dalam ruang berdimensi tinggi $\\mathbb{R}^D$.
Sebagai contoh, seluruh variasi ekspresi wajah manusia sebenarnya dikontrol oleh beberapa derajat kebebasan otot wajah dan sudut pencahayaan ($d \\approx 10-20$), bukan $1.000.000$ piksel bebas.

**Mengapa Metode Linier (PCA) Gagal pada Manifold?**
PCA hanya mampu memproyeksikan data ke hiperbidang linier datar. Jika manifold memiliki lengkungan, lilitan, atau lipatan (seperti permukaan Swiss Roll atau pita Möbius), jarak Euklides garis lurus menembus ruang hampa di luar manifold, menghasilkan representasi yang terdistorsi parah (*short-circuiting*). Pembelajaran Manifold (*Manifold Learning*) bertujuan merekonstruksi geometri intrinsik permukaan lengkung tersebut.`,
        formula: `\\mathcal{M} \\subset \\mathbb{R}^D, \\quad \\dim(\\mathcal{M}) = d \\ll D \\quad (\\text{Definisi Formal Manifold})`,
        code: `# 13.1: Visualisasi Kegagalan PCA Linier pada Manifold Swiss Roll 3D
import numpy as np
from sklearn.datasets import make_swiss_roll
from sklearn.decomposition import PCA

# Bangkitkan 1500 sampel Swiss Roll 3D
X, color = make_swiss_roll(n_samples=1500, noise=0.1, random_state=42)

# Reduksi linier menggunakan PCA 2D
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

print("=== EVALUASI PROYEKSI MANIFOLD SWISS ROLL ===")
print("Dimensi Asli:", X.shape)
print("Dimensi PCA :", X_pca.shape)
print("Explained Variance Ratio PCA:", np.round(pca.explained_variance_ratio_, 3))
print("Catatan: PCA menumpuk lapisan gulungan Swiss Roll karena memotong ruang 3D secara datar.")`,
        expectedOutput: "PCA mereduksi Swiss roll 3D ke 2D namun menumpuk gulungan-gulungan non-linier menjadi satu lapisan.",
        codeExp: "Skrip mendemonstrasikan batasan PCA linier saat dihadapkan pada manifold non-linier klasik Swiss Roll.",
        pitfalls: [
          "Mengasumsikan bahwa seluruh data berdimensi tinggi membentuk manifold tunggal yang kontinu (data riil sering kali terpecah menjadi beberapa manifold terputus).",
          "Mengira manifold learning dapat langsung mengekstrapolasi data di luar rentang latihan (out-of-sample mapping sangat sulit pada manifold non-parametrik)."
        ],
        refTitle: "Christopher de Silva & Joshua B. Tenenbaum: Global Versus Local Methods in Nonlinear Dimensionality Reduction (NeurIPS 2002)",
        refUrl: "https://papers.nips.cc/paper/2002/hash/6810a905a3e14ec5a60e0a54e938da64-Abstract.html"
      },
      {
        num: "13.2",
        slug: "13-2-multidimensional-scaling-mds-preservasi-jarak",
        title: "13.2. Multidimensional Scaling (MDS): Preservasi Matriks Kedekatan Antar-Titik",
        desc: "Transformasi geometris berbasis jarak: merumuskan Metric MDS vs Non-Metric MDS dan minimisasi fungsi Stress Kruskal.",
        concept: `**Multidimensional Scaling (MDS)** (Warren Torgerson, 1952; Joseph Kruskal, 1964) adalah keluarga algoritma reduksi dimensi yang bertujuan merepresentasikan data dalam ruang berdimensi rendah $\\mathbf{z}_1, \\dots, \\mathbf{z}_n \\in \\mathbb{R}^k$ sedemikian rupa sehingga **jarak berpasangan antar-titik dalam ruang baru $\\|\\mathbf{z}_i - \\mathbf{z}_j\\|$ sedekat mungkin dengan jarak asli $\\delta_{ij}$**.

**Fungsi Objektif: Kruskal's Stress:**
MDS mencari konfigurasi koordinat titik rendah $\\mathbf{Z}$ yang meminimalkan fungsi ketidaksesuaian yang disebut **Stress**:
$$\\text{Stress}(\\mathbf{z}_1, \\dots, \\mathbf{z}_n) = \\sqrt{\\frac{\\sum_{i < j} (\\delta_{ij} - \\|\\mathbf{z}_i - \\mathbf{z}_j\\|_2)^2}{\\sum_{i < j} \\delta_{ij}^2}}$$

**Dua Varian MDS:**
1. **Metric MDS:** Berusaha mempertahankan nilai numerik eksak dari jarak berpasangan Euklides asli $\\delta_{ij} \\approx \\|\\mathbf{z}_i - \\mathbf{z}_j\\|$.
2. **Non-Metric MDS:** Hanya mempertahankan **urutan peringkat monotonik** dari jarak antar-titik (jika $\\delta_{ij} < \\delta_{kl}$, maka $\\|\\mathbf{z}_i - \\mathbf{z}_j\\| < \\|\\mathbf{z}_k - \\mathbf{z}_l\\|$). Varian ini sangat berguna pada data survei preferensi manusia kualitatif.`,
        formula: `\\text{Stress} = \\sqrt{ \\sum_{i < j} (\\delta_{ij} - \\|\\mathbf{z}_i - \\mathbf{z}_j\\|)^2 } \\quad (\\text{Fungsi Biaya Stress Kruskal})`,
        code: `# 13.2: Reduksi Dimensi dengan Metric MDS Scikit-Learn
import numpy as np
from sklearn.manifold import MDS
from sklearn.metrics import pairwise_distances

# Sintesis matriks jarak 10 kota fiktif
np.random.seed(42)
X_coords = np.random.uniform(-50, 50, (10, 5)) # 10 objek dalam ruang 5D
true_distances = pairwise_distances(X_coords)

# Terapkan Metric MDS ke ruang 2D
mds = MDS(n_components=2, dissimilarity='precomputed', random_state=42)
X_2d = mds.fit_transform(true_distances)
reconstructed_distances = pairwise_distances(X_2d)

# Hitung korelasi preservasi jarak
corr = np.corrcoef(true_distances.flatten(), reconstructed_distances.flatten())[0, 1]
print("=== HASIL MULTIDIMENSIONAL SCALING (MDS) ===")
print(f"Stress Nilai Akhir           : {mds.stress_:.4f}")
print(f"Korelasi Preservasi Jarak (r): {corr:.4f} (Mendekati 1.0 = Preservasi Sempurna)")`,
        expectedOutput: "MDS berhasil merekonstruksi konfigurasi 2D dengan korelasi preservasi jarak > 0.95.",
        codeExp: "Skrip menghitung embedding 2D menggunakan MDS berbasis matriks jarak pra-hitung dan memverifikasi nilai Stress Kruskal.",
        pitfalls: [
          "Menjalankan MDS pada dataset sangat besar ($N > 5000$); kompleksitas memorinya $\\mathcal{O}(N^2)$ dan waktu optimasinya sangat lambat.",
          "Terjebak pada minimum lokal fungsi Stress; disarankan menjalankan algoritma dengan beberapa inisialisasi acak berbeda (`n_init > 1`)."
        ],
        refTitle: "J. B. Kruskal: Multidimensional Scaling by Optimizing Goodness of Fit to a Nonmetric Hypothesis (Psychometrika, 1964)",
        refUrl: "https://link.springer.com/article/10.1007/BF02289565"
      },
      {
        num: "13.3",
        slug: "13-3-isomap-jarak-geodesik-dan-algoritma-dijkstra",
        title: "13.3. Isomap: Menghitung Jarak Geodesik via Graf Tetangga Terpendek (Dijkstra)",
        desc: "Inovasi Tenenbaum et al. (Science 2000): menggabungkan graf k-tetangga terdekat, algoritma lintasan terpendek Dijkstra, dan Classical MDS untuk membuka lipatan manifold.",
        concept: `Joshua Tenenbaum, Vin de Silva, dan John Langford (Science, 2000) memecahkan masalah lengkungan non-linier dengan merumuskan **Isometric Feature Mapping (Isomap)**.

Kelemahan fatal MDS standar adalah mengukur jarak antar dua titik menggunakan garis lurus Euklides yang "memotong jalan pintas" menembus ruang kosong di luar manifold. Isomap menggantikan jarak Euklides dengan **Jarak Geodesik (*Geodesic Distance*)**: jarak terpendek yang diukur **sepanjang permukaan melengkung manifold**.

**Tiga Tahap Algoritma Isomap:**
1. **Konstruksi Graf Tetangga Terdekat ($k$-NN Graph):**
   Hubungkan setiap titik data $\\mathbf{x}_i$ dengan $k$ tetangga terdekatnya. Berikan bobot pada setiap sisi graf sebesar jarak Euklides lokal $d_X(i, j)$.
2. **Hitung Jarak Terpendek Semua Pasangan (Shortest Paths):**
   Jarak geodesik antar dua titik mana pun $\\mathbf{x}_i$ dan $\\mathbf{x}_j$ didekati dengan mencari panjang lintasan terpendek (*shortest path*) pada graf menggunakan **Algoritma Dijkstra** atau **Floyd-Warshall**:
   $$D_G(i, j) = \\min_{p} \\sum_{e \\in p} d_X(e)$$
3. **Penerapan Classical MDS:**
   Terapkan algoritma MDS pada matriks jarak geodesik $D_G$ untuk menghasilkan koordinat berdimensi rendah $\\mathbf{Z} \\in \\mathbb{R}^d$.

Hasilnya: Isomap mampu secara efektif "membentangkan" gulungan Swiss Roll menjadi lembaran datar 2D tanpa distorsi lipatan!`,
        formula: `D_G(i, j) = \\min_{\\text{path } p} \\sum_{k=1}^{|p|-1} \\|\\mathbf{x}_{p_k} - \\mathbf{x}_{p_{k+1}}\\| \\quad (\\text{Aproksimasi Geodesik Dijkstra})`,
        code: `# 13.3: Membuka Lipatan Manifold Swiss Roll Menggunakan Isomap
from sklearn.datasets import make_swiss_roll
from sklearn.manifold import Isomap
from sklearn.metrics import pairwise_distances
import numpy as np

X, color = make_swiss_roll(n_samples=1000, noise=0.05, random_state=42)

# Terapkan Isomap dengan k=10 tetangga
isomap = Isomap(n_neighbors=10, n_components=2)
X_isomap = isomap.fit_transform(X)

print("=== MEMBUKA LIPATAN SWISS ROLL VIA ISOMAP ===")
print("Dimensi Input Asli   :", X.shape)
print("Dimensi Terbuka 2D   :", X_isomap.shape)
print("Rentang Koordinat Isomap Dim 1:", np.ptp(X_isomap[:, 0]).round(2))
print("Rentang Koordinat Isomap Dim 2:", np.ptp(X_isomap[:, 1]).round(2))
print("Status: Manifold berhasil dibuka menjadi koordinat planar 2D kontinu.")`,
        expectedOutput: "Isomap sukses membuka gulungan 3D Swiss Roll menjadi koordinat 2D teratur.",
        codeExp: "Skrip menerapkan algoritma Isomap dengan 10 tetangga untuk mengestimasi jarak geodesik dan memetakan Swiss Roll ke bidang datar 2D.",
        pitfalls: [
          "Memilih nilai k-neighbors terlalu kecil yang menyebabkan graf terpecah menjadi beberapa komponen terputus (disconnected components).",
          "Memilih nilai k terlalu besar atau adanya noise tinggi yang menciptakan jalan pintas palsu (*short-circuit edges*) antar lipatan yang merusak topologi geodesik."
        ],
        refTitle: "J. B. Tenenbaum, V. de Silva, J. C. Langford: A Global Geometric Framework for Nonlinear Dimensionality Reduction (Science, 2000)",
        refUrl: "https://www.science.org/doi/10.1126/science.290.5500.2319"
      },
      {
        num: "13.4",
        slug: "13-4-locally-linear-embedding-lle-geometri-patch-lokal",
        title: "13.4. Locally Linear Embedding (LLE): Rekonstruksi Geometri Patch Lokal",
        desc: "Pendekatan berbasis simetri lokal Roweis & Saul (Science 2000): rekonstruksi titik sebagai kombinasi linier tetangga terdekat dan preservasi bobot rotasi-translasi.",
        concept: `Berbeda dengan Isomap yang berusaha mempertahankan jarak geodesik global antar seluruh pasangan titik, Sam T. Roweis dan Lawrence K. Saul (Science, 2000) mengusulkan **Locally Linear Embedding (LLE)** yang hanya berfokus pada **preservasi geometri patch lokal**.

**Dua Tahap Optimasi LLE:**
1. **Karakterisasi Geometri Lokal (Weight Step):**
   Asumsikan setiap titik data $\\mathbf{x}_i$ dan tetangga-tetangga terdekatnya berada pada atau mendekati patch linier datar dari manifold. Setiap titik direkonstruksi sebagai kombinasi linier terbobot dari $k$ tetangga terdekatnya:
   $$\\min_{\\mathbf{W}} \\sum_{i=1}^n \\left\\| \\mathbf{x}_i - \\sum_{j \\in N(i)} W_{ij} \\mathbf{x}_j \\right\\|^2 \\quad \\text{dengan kendala } \\sum_{j} W_{ij} = 1$$
   Bobot $W_{ij}$ ini memiliki sifat luar biasa: mereka **invarian terhadap transformasi translasi, rotasi, dan penskalaan lokal**.
2. **Pemetaan ke Ruang Berdimensi Rendah (Embedding Step):**
   Kunci dari LLE adalah mempertahankan bobot rekonstruksi $W_{ij}$ yang sama pada ruang berdimensi rendah $\\mathbf{z}_i \\in \\mathbb{R}^d$. Kita mencari koordinat $\\mathbf{Z}$ yang meminimalkan:
   $$\\min_{\\mathbf{Z}} \\sum_{i=1}^n \\left\\| \\mathbf{z}_i - \\sum_{j} W_{ij} \\mathbf{z}_j \\right\\|^2 \\quad \\text{dengan kendala } \\frac{1}{n} \\mathbf{Z}^\\top \\mathbf{Z} = \\mathbf{I}$$

Langkah kedua diselesaikan secara elegan melalui dekomposisi nilai eigen dari matriks sparse $\\mathbf{M} = (\\mathbf{I} - \\mathbf{W})^\\top (\\mathbf{I} - \\mathbf{W})$.`,
        formula: `\\min_{\\mathbf{Z}} \\operatorname{Tr}(\\mathbf{Z}^\\top \\mathbf{M} \\mathbf{Z}) \\quad \\text{di mana } \\mathbf{M} = (\\mathbf{I} - \\mathbf{W})^\\top (\\mathbf{I} - \\mathbf{W})`,
        code: `# 13.4: Reduksi Dimensi Menggunakan LocallyLinearEmbedding (LLE)
from sklearn.datasets import make_s_curve
from sklearn.manifold import LocallyLinearEmbedding
import numpy as np

# Bangkitkan manifold S-Curve 3D
X, color = make_s_curve(n_samples=1000, noise=0.05, random_state=42)

# LLE dengan 12 tetangga
lle = LocallyLinearEmbedding(n_neighbors=12, n_components=2, method='standard', random_state=42)
X_lle = lle.fit_transform(X)

print("=== LOCALLY LINEAR EMBEDDING (LLE) ===")
print("Dimensi S-Curve Asli:", X.shape)
print("Dimensi Output LLE   :", X_lle.shape)
print("Rekonstruksi Galat   :", f"{lle.reconstruction_error_:.6f}")`,
        expectedOutput: "LLE sukses memetakan S-curve 3D ke koordinat 2D dengan galat rekonstruksi sangat rendah.",
        codeExp: "Skrip mengaplikasikan LocallyLinearEmbedding untuk membentangkan manifold S-Curve 3D ke ruang 2D melalui preservasi bobot patch lokal.",
        pitfalls: [
          "Regulasi numerik LLE rentan jika n_neighbors > n_features; varian Modified LLE (MLLE) atau Hessian LLE lebih disarankan untuk stabilitas kurvatur tinggi.",
          "LLE sangat sensitif terhadap lubang (*holes*) atau kepadatan sampel yang tidak seragam pada permukaan manifold."
        ],
        refTitle: "Sam T. Roweis & Lawrence K. Saul: Nonlinear Dimensionality Reduction by Locally Linear Embedding (Science, 2000)",
        refUrl: "https://www.science.org/doi/10.1126/science.290.5500.2323"
      },
      {
        num: "13.5",
        slug: "13-5-t-sne-probabilitas-kemiripan-gaussian",
        title: "13.5. t-Distributed Stochastic Neighbor Embedding (t-SNE): Teori Probabilitas Kemiripan Gaussian",
        desc: "Pondasi algoritma Laurens van der Maaten & Geoffrey Hinton (2008): konversi jarak Euklides menjadi distribusi probabilitas kondisional Gaussian berpasangan.",
        concept: `Laurens van der Maaten dan Geoffrey Hinton (JMLR, 2008) merumuskan **t-Distributed Stochastic Neighbor Embedding (t-SNE)**, yang hingga kini menjadi algoritma standar emas de facto dunia untuk visualisasi data berdimensi tinggi dalam 2D atau 3D.

Alih-alih mempertahankan jarak geometris deterministik, t-SNE mengubah jarak Euklides antar titik menjadi **probabilitas bersyarat (*conditional probabilities*)** yang mencerminkan derajat kemiripan (*similarity*).

**Probabilitas Kemiripan di Ruang Berdimensi Tinggi:**
Probabilitas bahwa titik data $\\mathbf{x}_i$ akan memilih titik $\\mathbf{x}_j$ sebagai tetangganya di bawah distribusi Gaussian yang berpusat di $\\mathbf{x}_i$ dirumuskan sebagai:
$$p_{j \\mid i} = \\frac{\\exp\\left( -\\frac{\\|\\mathbf{x}_i - \\mathbf{x}_j\\|_2^2}{2\\sigma_i^2} \\right)}{\\sum_{k \\neq i} \\exp\\left( -\\frac{\\|\\mathbf{x}_i - \\mathbf{x}_k\\|_2^2}{2\\sigma_i^2} \\right)}, \\quad p_{i \\mid i} = 0$$
di mana varians Gaussian $\\sigma_i^2$ ditentukan secara adaptif untuk setiap titik berdasarkan nilai **Perplexity** yang ditetapkan pengguna.

Untuk menghindari distorsi asimetris terhadap outlier, t-SNE merumuskan **probabilitas simetris gabungan (*joint probability*)**:
$$p_{ij} = \\frac{p_{j \\mid i} + p_{i \\mid j}}{2n}$$
Titik-titik yang berjarak sangat dekat memiliki nilai $p_{ij}$ tinggi, sedangkan titik-titik yang berjauhan memiliki $p_{ij} \\approx 0$.`,
        formula: `p_{j \\mid i} = \\frac{\\exp(-\\|\\mathbf{x}_i - \\mathbf{x}_j\\|^2 / 2\\sigma_i^2)}{\\sum_{k \\neq i} \\exp(-\\|\\mathbf{x}_i - \\mathbf{x}_k\\|^2 / 2\\sigma_i^2)}, \\quad p_{ij} = \\frac{p_{j|i} + p_{i|j}}{2n}`,
        code: `# 13.5: Perhitungan Matriks Probabilitas Kemiripan Gaussian t-SNE dari Nol
import numpy as np

def compute_pairwise_affinities(X, sigma=1.0):
    # Hitung matriks jarak kuadrat
    sum_X = np.sum(np.square(X), 1)
    D = np.add(np.add(-2 * np.dot(X, X.T), sum_X).T, sum_X)
    np.fill_diagonal(D, np.inf) # Jangan pilih diri sendiri
    
    # Eksponensial Gaussian
    P = np.exp(-D / (2 * sigma**2))
    # Normalisasi baris
    P = P / np.sum(P, axis=1, keepdims=True)
    # Simetrisasi
    P_sym = (P + P.T) / (2 * len(X))
    return P_sym

X_toy = np.array([[0.0, 0.0], [0.1, 0.2], [10.0, 10.0], [10.1, 9.9]])
P_mat = compute_pairwise_affinities(X_toy, sigma=1.0)

print("=== MATRIKS PROBABILITAS KEMIRIPAN t-SNE (P_ij) ===")
print("Kemiripan Titik Dekat (0 dan 1):", f"{P_mat[0, 1]:.5f} (Sangat Tinggi)")
print("Kemiripan Titik Jauh  (0 dan 2):", f"{P_mat[0, 2]:.8f} (Mendekati Nol Mutlak)")`,
        expectedOutput: "Probabilitas pasangan dekat bernilai tinggi sementara pasangan antar klaster jauh bernilai mendekati nol mutlak.",
        codeExp: "Skrip mengimplementasikan formulasi analitis probabilitas kemiripan Gaussian simetris P_ij yang menjadi masukan ruang tinggi t-SNE.",
        pitfalls: [
          "Menggunakan nilai sigma seragam untuk seluruh titik; kepadatan titik di dunia nyata bervariasi drastis sehingga sigma_i wajib dihitung per-titik via bisection search perplexity.",
          "Mengira p_ij mencerminkan jarak absolut metrik; p_ij murni probabilitas tetangga lokal."
        ],
        refTitle: "Laurens van der Maaten & Geoffrey Hinton: Visualizing Data using t-SNE (JMLR, 2008)",
        refUrl: "https://www.jmlr.org/papers/v9/vandermaaten08a.html"
      },
      {
        num: "13.6",
        slug: "13-6-crowding-problem-dan-distribusi-t-student",
        title: "13.6. Pemecahan Crowding Problem melalui Distribusi Berat Ekor (Student-t Distribution)",
        desc: "Kelemahan esensial SNE standar: paradoks volume ruang berdimensi rendah vs tinggi dan bagaimana distribusi Cauchy 1-derajat kebebasan memecahkan penumpukan klaster.",
        concept: `Sebelum t-SNE dirumuskan, algoritma pendahulunya adalah **SNE (Stochastic Neighbor Embedding, Hinton & Roweis 2002)** yang menggunakan distribusi Gaussian di ruang tinggi MAUPUN di ruang rendah. SNE mengalami kegagalan sistematis yang disebut **The Crowding Problem (Masalah Penumpukan)**.

**Mengapa Crowding Problem Terjadi?**
Dalam ruang berdimensi tinggi (misal $D = 100$), "volume" ruang pada jarak sedang bertumbuh secara eksponensial terhadap radius ($V(r) \\propto r^D$). Sebuah titik dapat memiliki ratusan tetangga yang semuanya berjarak sama dari dirinya.
Namun, ketika diproyeksikan ke ruang 2D, luas area hanya bertumbuh kuadratik ($V(r) \\propto r^2$). **Tidak ada ruang fisik yang cukup dalam 2D untuk menampung seluruh titik pada jarak sedang tersebut tanpa menumpuknya satu sama lain di pusat proyeksi!**

**Solusi Brilian van der Maaten & Hinton:**
Gunakan **Distribusi t-Student dengan 1 derajat kebebasan (Distribusi Cauchy)** di ruang berdimensi rendah, bukan Gaussian:
$$q_{ij} = \\frac{(1 + \\|\\mathbf{z}_i - \\mathbf{z}_j\\|_2^2)^{-1}}{\\sum_{k} \\sum_{l \\neq k} (1 + \\|\\mathbf{z}_k - \\mathbf{z}_l\\|_2^2)^{-1}}$$

**Karakteristik Ekor Berat (*Heavy Tails*):**
Karena fungsi $(1 + d^2)^{-1}$ meluruh jauh lebih lambat daripada Gaussian $\\exp(-d^2)$ pada jarak jauh:
- Pasangan titik yang memiliki kemiripan moderat di ruang tinggi dipaksa terdorong **jauh terpisah** di ruang 2D untuk menghasilkan probabilitas $q_{ij}$ yang sama.
- Hal ini secara otomatis menciptakan ruang pemisah yang sangat lebar antar klaster, mencegah penumpukan dan menghasilkan visualisasi kepulauan klaster yang terpisah tajam dan spektakuler.`,
        formula: `q_{ij} = \\frac{(1 + \\|\\mathbf{z}_i - \\mathbf{z}_j\\|^2)^{-1}}{\\sum_k \\sum_{l \\neq k} (1 + \\|\\mathbf{z}_k - \\mathbf{z}_l\\|^2)^{-1}} \\quad (\\text{Distribusi t-Student Ekor Berat})`,
        code: `# 13.6: Komparasi Peluruhan Probabilitas: Gaussian (SNE) vs Student-t (t-SNE)
import numpy as np

# Rentang jarak proyeksi dari 0 hingga 5 satuan
distances = np.linspace(0, 5, 100)

# 1. Peluruhan Gaussian SNE: exp(-d^2)
prob_gaussian = np.exp(-distances**2)

# 2. Peluruhan Student-t t-SNE: (1 + d^2)^(-1)
prob_student_t = 1.0 / (1.0 + distances**2)

print("=== ANALISIS PELURUHAN PROBABILITAS: GAUSSIAN VS STUDENT-t ===")
for d_eval in [0.5, 1.0, 2.0, 3.0, 4.0]:
    g_val = np.exp(-d_eval**2)
    t_val = 1.0 / (1.0 + d_eval**2)
    print(f"Jarak d={d_eval:3.1f} -> Gaussian={g_val:.6f} | Student-t={t_val:.6f} (Rasio t/g = {t_val/g_val:6.1f}x)")
print("\nKesimpulan: Ekor Student-t ratusan kali lebih tebal pada jarak jauh, mengusir klaster lain.")`,
        expectedOutput: "Pada jarak d=3.0, Student-t memiliki nilai probabilitas 810 kali lebih besar daripada Gaussian, mengonfirmasi sifat heavy-tail.",
        codeExp: "Skrip menghitung dan membandingkan laju peluruhan probabilitas Gaussian vs Student-t, membuktikan secara matematis solusi t-SNE terhadap crowding problem.",
        pitfalls: [
          "Mencoba menyetel derajat kebebasan t-distribution menjadi sangat tinggi; jika df mendekati tak hingga, t-SNE kembali menjadi SNE standar dan crowding problem muncul kembali.",
          "Mengira jarak antar klaster di visualisasi t-SNE mencerminkan jarak absolut (jarak antar klaster t-SNE tidak bermakna metrik kuantitatif)."
        ],
        refTitle: "Geoffrey E. Hinton & Sam T. Roweis: Stochastic Neighbor Embedding (NeurIPS 2002)",
        refUrl: "https://papers.nips.cc/paper/2002/hash/6150a7018016ef4a32e18db41a384f59-Abstract.html"
      },
      {
        num: "13.7",
        slug: "13-7-penalaan-hiperparameter-tsne-perplexity-learning-rate",
        title: "13.7. Penalaan Hiperparameter t-SNE: Perplexity, Learning Rate, dan Jumlah Iterasi",
        desc: "Kajian mendalam panduan Wattenberg et al. (Distill 2016): pengaruh dramatis Perplexity terhadap topologi, penalaan learning_rate adaptif, dan early exaggeration.",
        concept: `Hasil visualisasi t-SNE sangat sensitif terhadap penyetelan hiperparameter. Martin Wattenberg, Fernanda Viégas, dan Ian Johnson dalam publikasi terkenal mereka *"How to Use t-SNE Effectively"* (Distill, 2016) mendemonstrasikan bahwa salah menyetel parameter t-SNE dapat menghasilkan visualisasi yang menyesatkan (*misleading artifacts*).

**Tiga Hiperparameter Paling Kritis:**
1. **Perplexity:**
   Didefinisikan sebagai $2^{H(P_i)}$ di mana $H(P_i)$ adalah entropi Shannon dari distribusi probabilitas kondisional. Secara intuitif, **Perplexity dapat diartikan sebagai jumlah tetangga efektif yang dipertimbangkan oleh setiap titik**:
   - **Perplexity Terlalu Rendah ($< 5$):** Model hanya memperhatikan tetangga terdekat ekstrem, menghasilkan visualisasi seperti benang kusut atau serpihan kecil tak bermakna (*fragmented local noise*).
   - **Perplexity Optimal ($30 - 50$):** Menyeimbangkan struktur lokal dan pengelompokan global secara harmonis.
   - **Perplexity Terlalu Tinggi ($> 100$):** Model mencoba memperlakukan seluruh titik sebagai tetangga, meratakan perbedaan klaster dan mendekati hasil PCA biasa.
2. **Learning Rate (Epsilon):**
   Laju penurunan gradien Kullback-Leibler:
   - Jika terlalu tinggi: titik-titik akan membentuk lingkaran bola kosong tanpa klaster (*ball artifact*).
   - Jika terlalu rendah: optimasi terjebak pada kompresi titik padat.
3. **Early Exaggeration:**
   Faktor pengali matriks $p_{ij}$ (biasanya bernilai 12 selama 250 iterasi pertama) untuk memaksa klaster-klaster alami terpisah jauh sejak awal optimasi gradien.`,
        formula: `\\text{Perp}(P_i) = 2^{H(P_i)} = 2^{-\\sum_j p_{j|i} \\log_2 p_{j|i}} \\quad (\\text{Definisi Entropi Perplexity})`,
        code: `# 13.7: Eksperimen Pengaruh Hiperparameter Perplexity pada Dataset Digits
from sklearn.datasets import load_digits
from sklearn.manifold import TSNE
import numpy as np

digits = load_digits()
X = digits.data[:500] # Subsample 500 titik
y = digits.target[:500]

print("=== EKSPERIMEN PENALAAN PERPLEXITY t-SNE ===")
for perp in [5, 30, 100]:
    tsne = TSNE(n_components=2, perplexity=perp, random_state=42, n_iter=1000)
    X_emb = tsne.fit_transform(X)
    kl_div = tsne.kl_divergence_
    status = "Klaster Terfragmentasi" if perp == 5 else ("Keseimbangan Optimal" if perp == 30 else "Cenderung Global Terlalu Rata")
    print(f"Perplexity = {perp:3d} -> KL Divergence Akhir: {kl_div:.4f} | {status}")`,
        expectedOutput: "Perbedaan nilai KL-divergence dan kerapatan klaster teramati jelas seiring perubahan perplexity.",
        codeExp: "Skrip mengevaluasi t-SNE dengan berbagai variasi nilai perplexity dan mencatat KL divergence hasil konvergensi.",
        pitfalls: [
          "Mengambil kesimpulan ukuran kepadatan klaster dari visualisasi t-SNE; t-SNE secara alami meratakan ukuran klaster (klaster jarang diperluas, klaster padat dikompresi).",
          "Menghentikan proses optimasi sebelum konvergensi (n_iter < 500) yang menghasilkan bentuk klaster acak yang belum stabil."
        ],
        refTitle: "Martin Wattenberg, Fernanda Viégas, Ian Johnson: How to Use t-SNE Effectively (Distill, 2016)",
        refUrl: "https://distill.pub/2016/misread-tsne/"
      },
      {
        num: "13.8",
        slug: "13-8-umap-fondasi-topologi-aljabar-fuzzy-simplicial-set",
        title: "13.8. Uniform Manifold Approximation and Projection (UMAP): Teori Topologi Aljabar",
        desc: "Terobosan Leland McInnes et al. (2018): pemodelan manifold melalui kompleks simplisial fuzzy (Fuzzy Simplicial Sets) dan optimasi Cross-Entropy.",
        concept: `Leland McInnes, John Healy, dan James Melville (arXiv 2018) memperkenalkan **Uniform Manifold Approximation and Projection (UMAP)**, yang menjadi penantang terkuat t-SNE dengan keunggulan komputasi masif dan preservasi struktur global yang jauh lebih superior.

**Tiga Asumsi Teoretis Fundamental UMAP:**
1. Data terdistribusi pada manifold Riemannian terhubung secara lokal.
2. Metrik Riemannian bersifat konstan (atau seragam) secara lokal.
3. Manifold bersifat terhubung secara lokal (*locally connected*).

**Mekanisme Matematika Dua Tahap:**
1. **Konstruksi Topologi Kompleks Simplisial Fuzzy (Fuzzy Simplicial Set):**
   Alih-alih probabilitas normalisasi global seperti t-SNE, UMAP mengukur kemiripan lokal menggunakan jarak Euklides yang diskalakan secara adaptif ke jarak tetangga terdekat $\\rho_i$:
   $$p_{i \\mid j} = \\exp\\left( -\\frac{\\max(0, d(\\mathbf{x}_i, \\mathbf{x}_j) - \\rho_i)}{\\sigma_i} \\right)$$
   di mana $\\rho_i$ menjamin bahwa manifold tetap terhubung secara lokal pada titik terdekatnya. Gabungan fuzzy dihitung via norma-T probabilistik: $p_{ij} = p_{i|j} + p_{j|i} - p_{i|j} p_{j|i}$.
2. **Fungsi Biaya Cross-Entropy Fuzzy (Bukan KL-Divergence):**
   UMAP meminimalkan **Fuzzy Cross-Entropy** antara representasi ruang tinggi $P$ dan ruang rendah $Q$:
   $$C(P, Q) = \\sum_{i \\neq j} \\left[ p_{ij} \\log\\frac{p_{ij}}{q_{ij}} + (1 - p_{ij}) \\log\\frac{1 - p_{ij}}{1 - q_{ij}} \\right]$$
   Bagian kedua $(1 - p_{ij}) \\log(1 - q_{ij})$ bertindak sebagai **gaya tolak global (repulsive force)** yang mempertahankan jarak dan relasi antar-klaster global, keunggulan yang tidak dimiliki t-SNE!`,
        formula: `C(P, Q) = \\sum_{i \\neq j} \\left[ p_{ij} \\log \\frac{p_{ij}}{q_{ij}} + (1 - p_{ij}) \\log \\frac{1 - p_{ij}}{1 - q_{ij}} \\right] \\quad (\\text{Cross-Entropy UMAP})`,
        code: `# 13.8: Reduksi Dimensi Manifold Menggunakan UMAP / Analogi Sklearn Spectral Manifold
import numpy as np
from sklearn.datasets import load_digits
from sklearn.manifold import SpectralEmbedding

digits = load_digits()
X, y = digits.data[:800], digits.target[:800]

# Simulasi representasi embedding Laplacian Graph (pondasi topologi UMAP)
spec = SpectralEmbedding(n_components=2, n_neighbors=15, random_state=42)
X_spec = spec.fit_transform(X)

print("=== PONDASI TOPOLOGI GRAF MANIFOLD UMAP ===")
print("Dimensi Data Asli       :", X.shape)
print("Dimensi Embedding Graf  :", X_spec.shape)
print("Karakteristik Topologi  : Mempertahankan struktur klaster global via Laplacian Eigenmaps.")`,
        expectedOutput: "Embedding spektral berbasis graf berhasil memetakan dataset multi-kelas ke ruang 2D secara stabil.",
        codeExp: "Skrip mengilustrasikan pembentukan representasi embedding berbasis graf tetangga (komponen topologi kunci UMAP) pada dataset digits.",
        pitfalls: [
          "Menyetel n_neighbors terlalu besar pada UMAP yang menghilangkan detail struktur klaster lokal yang halus.",
          "Mengabaikan parameter min_dist yang mengontrol seberapa rapat titik-titik dikelompokkan bersama di ruang visualisasi."
        ],
        refTitle: "Leland McInnes, John Healy, James Melville: UMAP: Uniform Manifold Approximation and Projection for Dimension Reduction (arXiv:1802.03426, 2018)",
        refUrl: "https://arxiv.org/abs/1802.03426"
      },
      {
        num: "13.9",
        slug: "13-9-komparasi-mendalam-tsne-vs-umap",
        title: "13.9. Komparasi Mendalam t-SNE vs UMAP: Kecepatan Komputasi dan Preservasi Topologi",
        desc: "Analisis perbandingan komprehensif: kompleksitas waktu O(N log N) vs O(N), pemetaan data baru (transform), dan integritas struktur global.",
        concept: `Dalam riset akademis dan industri modern, perdebatan antara memilih t-SNE atau UMAP sangat umum. Berikut adalah perbandingan mendalam berdasarkan kriteria teknis objektif:

| Kriteria Analisis | t-SNE (van der Maaten & Hinton, 2008) | UMAP (McInnes et al., 2018) |
| :--- | :--- | :--- |
| **Landasan Teoretis** | Teori Probabilitas & Informasi (KL-Divergence) | Topologi Aljabar & Geometri Riemannian |
| **Fungsi Biaya** | Kullback-Leibler Divergence (Hanya gaya tarik lokal) | Fuzzy Set Cross-Entropy (Gaya tarik lokal + gaya tolak global) |
| **Preservasi Global** | **Lemah / Buruk:** Jarak antar klaster di ruang 2D tidak bermakna | **Kuat:** Relasi makro dan kontinuitas trajektori antar klaster dipertahankan |
| **Kecepatan Komputasi**| Lebih lambat (Barnes-Hut $\\mathcal{O}(N \\log N)$, FFT $\\mathcal{O}(N)$) | Sangat cepat (Nearest Neighbor Descent, efisien pada $N > 1.000.000$) |
| **Out-of-Sample Mapping**| **Tidak Mendukung:** Tidak ada fungsi \\\\` + "\\\\`transform()\\\\`" + \\\\` (harus re-fit dari awal) | **Mendukung Penuh:** Memiliki metode \\\\` + "\\\\`transform()\\\\`" + \\\\` untuk memproyeksikan data baru |
| **Ukuran Memori** | Moderat hingga tinggi | Efisien (matriks ketetanggaan sparse) |

**Rekomendasi Praktisi:**
- Jika tujuan utama adalah **eksplorasi visualisasi klaster murni** dengan batas kelompok yang sangat tegas: t-SNE sangat handal.
- Jika dataset berskala **sangat besar ($N > 100.000$)**, membutuhkan kecepatan tinggi, ingin memetakan data uji baru, atau menganalisis **lintasan kontinu (*trajectory inference*)**: **UMAP adalah pilihan superior mutlak**.`,
        formula: `\\text{Speedup UMAP vs t-SNE: } \\mathcal{O}(N) \\text{ via NN-Descent vs } \\mathcal{O}(N \\log N) \\text{ Barnes-Hut}`,
        code: `# 13.9: Benchmark Kuantitatif Preservasi Struktur: t-SNE vs PCA
import numpy as np
from sklearn.datasets import load_digits
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
from sklearn.neighbors import NearestNeighbors

digits = load_digits()
X, y = digits.data[:600], digits.target[:600]

# 1. Evaluasi PCA (Preservasi Global)
X_pca = PCA(n_components=2).fit_transform(X)

# 2. Evaluasi t-SNE (Preservasi Lokal)
X_tsne = TSNE(n_components=2, perplexity=30, random_state=42).fit_transform(X)

# Metrik Preservasi Tetangga Terdekat (k=5)
def knn_preservation_score(X_orig, X_low, k=5):
    nn_orig = NearestNeighbors(n_neighbors=k+1).fit(X_orig).kneighbors(return_distance=False)[:, 1:]
    nn_low = NearestNeighbors(n_neighbors=k+1).fit(X_low).kneighbors(return_distance=False)[:, 1:]
    matches = [len(set(nn_orig[i]).intersection(set(nn_low[i]))) for i in range(len(X_orig))]
    return np.mean(matches) / k

score_pca = knn_preservation_score(X, X_pca, k=5)
score_tsne = knn_preservation_score(X, X_tsne, k=5)

print("=== HASIL BENCHMARK PRESERVASI TETANGGA LOKAL (k=5) ===")
print(f"Preservasi Tetangga Lokal PCA  : {score_pca*100:.2f}% (Rendah)")
print(f"Preservasi Tetangga Lokal t-SNE: {score_tsne*100:.2f}% (Tinggi - Unggul)")`,
        expectedOutput: "t-SNE mempertahankan persentase tetangga lokal jauh lebih tinggi daripada PCA linier.",
        codeExp: "Skrip menghitung persentase tetangga lokal 5-NN yang dipertahankan dalam ruang 2D oleh t-SNE dibandingkan PCA.",
        pitfalls: [
          "Menyimpulkan bahwa satu klaster lebih padat daripada klaster lain pada plot t-SNE tanpa mengecek varians data asli.",
          "Membandingkan posisi rotasi t-SNE antar eksekusi berbeda tanpa menyetel random_state tetap."
        ],
        refTitle: "Dmitry Kobak & Philipp Berens: The art of using t-SNE for single-cell transcriptomics (Nature Communications, 2019)",
        refUrl: "https://www.nature.com/articles/s41467-019-13056-x"
      },
      {
        num: "13.10",
        slug: "13-10-jebakan-larangan-penggunaan-manifold-fitur-prediksi",
        title: "13.10. Jebakan Umum Manifold Learning: Mengapa t-SNE Dilarang Dijadikan Fitur Prediksi",
        desc: "Aturan keras metodologi machine learning: instabilitas stokastik, ketiadaan pemetaan analitis out-of-sample, dan risiko overfitting kebocoran informasi pada model inferensi.",
        concept: `Salah satu kesalahan paling fatal yang sering dilakukan oleh praktisi machine learning pemula adalah **menggunakan koordinat 2D output t-SNE sebagai fitur masukan (*input features*) untuk melatih model klasifikasi atau regresi terawasi (supervised learning)**.

**Mengapa t-SNE DILARANG Digunakan Sebagai Fitur Model Prediktif?**
1. **Tidak Ada Pemetaan Analitis (*No Out-of-Sample Transform*):**
   t-SNE adalah algoritma optimasi non-parametrik langsung pada koordinat titik. t-SNE **tidak mempelajari fungsi pemetaan matematis $f(\\mathbf{x}) = \\mathbf{z}$**. Ketika ada 1 sampel data uji baru di masa depan ($x_{\\text{test}}$), Anda tidak dapat memproyeksikannya ke ruang t-SNE yang ada tanpa menyertakan sampel tersebut dan **menjalankan ulang optimasi t-SNE dari awal untuk seluruh dataset**!
2. **Ketidakstabilan Stokastik (*Stochastic Non-Determinism*):**
   Optimasi t-SNE berbasis penurunan gradien non-cembung dengan inisialisasi acak. Menjalankan t-SNE dua kali dengan seed berbeda dapat menghasilkan rotasi dan pembalikan posisi klaster yang sama sekali berbeda, merusak konsistensi fitur model produksi.
3. **Penyimpangan Kepadatan dan Jarak Semu:**
   t-SNE secara artifisial mengembang dan mengompresi jarak untuk menghasilkan probabilitas lokal yang seragam. Fitur ini menipu algoritma klasifikasi (seperti regresi logistik atau k-NN) dengan jarak-jarak semu yang tidak ada di data asli.
4. **Kebocoran Informasi Target:**
   Jika t-SNE dijalankan pada gabungan data latih dan uji untuk visualisasi lalu dimasukkan ke model, model mengalami kebocoran data (*data leakage*) parah.

**Alternatif yang Sah:**
Jika reduksi dimensi diperlukan sebagai fitur model prediksi:
- Gunakan **PCA** atau **TruncatedSVD** (linier, deterministik, memiliki metode \\\\` + "\\\\`transform()\\\\`" + \\\\` stabil).
- Gunakan **Autoencoders** (Neural Network dengan bobot deterministik).
- Gunakan **UMAP** (hanya jika modul UMAP resmi dengan metode \\\\` + "\\\\`transform()\\\\`" + \\\\` tersedia dan teruji stabil).`,
        formula: `f(\\mathbf{x}_{\\text{new}}) = \\text{Undefined pada t-SNE Standar} \\implies \\text{Dilarang untuk Pipeline Produksi}`,
        code: `# 13.10: Uji Validitas Transformasi: PCA vs t-SNE pada Data Uji Baru
import numpy as np
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

X_train = np.random.randn(200, 10)
X_test = np.random.randn(50, 10)

# 1. Uji pada PCA
pca = PCA(n_components=2).fit(X_train)
try:
    X_test_pca = pca.transform(X_test)
    print("PCA transform(X_test): SUKSES! (Memiliki fungsi proyeksi analitis deterministik)")
except Exception as e:
    print(f"PCA Gagal: {e}")

# 2. Uji pada t-SNE
tsne = TSNE(n_components=2, random_state=42)
tsne.fit(X_train)
has_transform = hasattr(tsne, "transform")
print(f"Apakah t-SNE memiliki metode .transform()? : {has_transform}")
if not has_transform:
    print("KESIMPULAN METODOLOGI RESMI:")
    print("- t-SNE murni alat eksplorasi/visualisasi (Exploratory Data Analysis).")
    print("- JANGAN PERNAH gunakan t-SNE sebagai tahap ekstraksi fitur di dalam Pipeline produksi!")`,
        expectedOutput: "PCA berhasil melakukan transform data baru, sementara t-SNE tidak memiliki metode transform.",
        codeExp: "Skrip membuktikan secara teknis bahwa t-SNE tidak memiliki metode transform(), menegaskan aturan larangan penggunaannya sebagai rekayasa fitur produksi.",
        pitfalls: [
          "Memasukkan output koordinat t-SNE ke dalam cross-validation loop yang memicu data leakage.",
          "Menghapus fitur asli dan hanya menyimpan koordinat 2D t-SNE untuk model inferensi masa depan."
        ],
        refTitle: "Scikit-Learn User Guide: Manifold Learning FAQ and Limitations",
        refUrl: "https://scikit-learn.org/stable/modules/manifold.html#manifold"
      }
    ]
  }
];
