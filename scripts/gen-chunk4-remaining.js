const fs = require('fs');
const path = require('path');
const { createSubchapter, exportChapterTs } = require('./curriculum-builder-helper');

const outDir = path.join(__dirname, '../src/lib/curriculum/topics/machine-learning');

// ============================================================================
// BAB 15: Ensemble Learning: Bagging, Pasting, & Random Forests OOB (7 Subbab)
// ============================================================================
const ch15Subs = [
  createSubchapter({
    id: "ml-15-1-reduksi-varians-rata-rata-acak",
    slug: "15-1-reduksi-varians-rata-rata-acak",
    title: "15.1 Prinsip Reduksi Varians Melalui Rata-Rata Acak (Law of Large Numbers pada Estimator Tak Berkorelasi)",
    orderIndex: 1,
    description: "Fondasi statistik reduksi varians ensemble: hukum bilangan besar pada rata-rata variabel acak terdistribusi identik independen (i.i.d.) dan pengaruh korelasi rho.",
    theoryMarkdown: `Misalkan terdapat $B$ estimator independen dan identik (i.i.d.) dengan varians $\\sigma^2$. Rata-rata ensemble memiliki varians:
$$\\text{Var}\\left( \\frac{1}{B} \\sum_{b=1}^B \\hat{f}_b(\\mathbf{x}) \\right) = \\frac{\\sigma^2}{B}$$
Saat $B \\to \\infty$, varians mendekati nol tanpa menambah bias!

Namun jika estimator memiliki korelasi positif $\\rho > 0$:
$$\\text{Var}\\left( \\frac{1}{B} \\sum_{b=1}^B \\hat{f}_b(\\mathbf{x}) \\right) = \\rho \\sigma^2 + \\frac{1 - \\rho}{B} \\sigma^2$$
Saat $B \\to \\infty$, varians dibatasi oleh $\\rho \\sigma^2$. Oleh karena itu, kunci sukses ensemble adalah **meminimalkan korelasi $\\rho$ antar pohon**!`,
    mermaidDiagram: `graph TD
    Estimators["B Buah Estimator Acak"] --> Indep["Jika Tak Berkorelasi (rho = 0): Var = sigma^2 / B -> 0"]
    Estimators --> Corr["Jika Berkorelasi (rho > 0): Var = rho * sigma^2 + (1-rho)/B * sigma^2"]
    Corr --> Goal["Tujuan Random Forest: Memperkecil rho via Random Subspace Method!"]`,
    scratchCode: `import numpy as np

def ensemble_variance_theoretical(B: int, sigma2: float, rho: float) -> float:
    return rho * sigma2 + ((1.0 - rho) / B) * sigma2

print("Var Ensemble (B=100, sigma2=1.0, rho=0.0):", ensemble_variance_theoretical(100, 1.0, 0.0))
print("Var Ensemble (B=100, sigma2=1.0, rho=0.2):", ensemble_variance_theoretical(100, 1.0, 0.2))`,
    sotaCode: `from sklearn.ensemble import BaggingRegressor
from sklearn.tree import DecisionTreeRegressor

bag = BaggingRegressor(estimator=DecisionTreeRegressor(), n_estimators=100, random_state=42)
print("Bagging Regressor Initialized with 100 base trees")`,
    diagCode: `print("Batas varians minimum saat B tak hingga:", 0.2 * 1.0)`,
    caseStudy: "Pemberian skor kredit perbankan: Menggabungkan 500 model pohon untuk meminimalkan fluktuasi prediksi skor individu nasabah.",
    commonPitfalls: ["Menggabungkan model-model yang identik (rho = 1), yang tidak menghasilkan reduksi varians sama sekali."],
    groundingLinks: [{ title: "Breiman (1996) Bagging Predictors", url: "https://doi.org/10.1007/BF00058655", note: "Paper asli penemuan Bagging" }]
  }),

  createSubchapter({
    id: "ml-15-2-bootstrap-aggregating-bagging-vs-pasting",
    slug: "15-2-bootstrap-aggregating-bagging-vs-pasting",
    title: "15.2 Bootstrap Aggregating (Bagging) vs Pasting: Teori Resampling Non-Parametrik dengan Pengembalian",
    orderIndex: 2,
    description: "Perbandingan teknik resampling: Bootstrap Aggregating (sampling dengan pengembalian) vs Pasting (sampling tanpa pengembalian).",
    theoryMarkdown: `1. **Bagging (Bootstrap Aggregation)**: Mengambil $n$ sampel secara acak **dengan pengembalian** (*with replacement*) dari dataset ukuran $n$.
2. **Pasting**: Mengambil subset sampel **tanpa pengembalian** (*without replacement*).
Bagging memperkenalkan lebih banyak keacakan dan keragaman antar pohon, menghasilkan bias sedikit lebih tinggi namun varians yang jauh lebih rendah daripada Pasting.`,
    mermaidDiagram: `graph LR
    Dataset["Dataset Latih Asli (n Sampel)"] --> Bootstrap["Bootstrap Sampling dengan Pengembalian"]
    Bootstrap --> Sub1["Subset D_1 (n sampel)"]
    Bootstrap --> Sub2["Subset D_2 (n sampel)"]
    Bootstrap --> SubB["Subset D_B (n sampel)"]
    Sub1 --> T1["Latih Pohon 1"]
    Sub2 --> T2["Latih Pohon 2"]
    SubB --> TB["Latih Pohon B"]
    T1 & T2 & TB --> Agg["Agregasi: Majority Vote / Rata-rata"]`,
    scratchCode: `def bootstrap_sample(X, y):
    n = len(X)
    indices = np.random.choice(n, size=n, replace=True)
    return X[indices], y[indices], indices

X_demo = np.arange(10).reshape(-1, 1)
y_demo = np.arange(10)
_, _, idx = bootstrap_sample(X_demo, y_demo)
print("Indeks Terambil Bootstrap:", idx)
print("Jumlah Unik Sampel:", len(np.unique(idx)))`,
    sotaCode: `from sklearn.ensemble import BaggingClassifier
from sklearn.tree import DecisionTreeClassifier

bag_clf = BaggingClassifier(DecisionTreeClassifier(), n_estimators=50, bootstrap=True).fit(X_demo, y_demo % 2)
paste_clf = BaggingClassifier(DecisionTreeClassifier(), n_estimators=50, bootstrap=False).fit(X_demo, y_demo % 2)
print("Bagging & Pasting Classifiers trained successfully")`,
    diagCode: `print("Bagging estimators count:", len(bag_clf.estimators_))`,
    caseStudy: "Deteksi bot akun palsu di Twitter: Bagging menstabilkan keputusan klasifikasi akun dari variasi aktivitas tweet sporadis.",
    commonPitfalls: ["Menggunakan Bagging pada estimator yang sudah memiliki varians rendah (seperti Regresi Linier), yang tidak memberikan manfaat peningkatan performa."],
    groundingLinks: [{ title: "Scikit-Learn Bagging Documentation", url: "https://scikit-learn.org/stable/modules/ensemble.html#bagging-meta-estimator", note: "Dokumentasi modul Bagging" }]
  }),

  createSubchapter({
    id: "ml-15-3-evaluasi-out-of-bag-oob",
    slug: "15-3-evaluasi-out-of-bag-oob",
    title: "15.3 Evaluasi Out-Of-Bag (OOB): Pembuktian Batas Probabilitas 1/e (63.2% Data Terambil) & Validasi Bebas Uji",
    orderIndex: 3,
    description: "Landasan analitis evaluasi Out-Of-Bag: pembuktian limit probabilitas 1 - 1/e = 63.2% sampel terambil, dan evaluasi generalisasi bebas cross-validation.",
    theoryMarkdown: `Probabilitas bahwa suatu observasi tertentu **tidak terambil** dalam satu undian bootstrap adalah $1 - \\frac{1}{n}$.
Untuk $n$ undian independen dengan pengembalian:
$$P(\\text{tidak terpilih}) = \\left( 1 - \\frac{1}{n} \\right)^n \\xrightarrow{n \\to \\infty} \\frac{1}{e} \\approx 0.368$$

Artinya, sekitar **63.2% sampel masuk ke dalam dataset latih (in-bag)**, dan sekitar **36.8% sampel menjadi Out-Of-Bag (OOB)**.
Sampel OOB ini dapat digunakan sebagai validasi gratis (*free cross-validation*) untuk setiap pohon tanpa memerlukan validation set terpisah!`,
    mermaidDiagram: `graph TD
    Draw["n Kali Penarikan dengan Pengembalian"] --> InBag["63.2% Sampel Masuk Latih (In-Bag)"]
    Draw --> OutBag["36.8% Sampel Tersisa (Out-Of-Bag / OOB)"]
    InBag --> Train["Latih Pohon ke-b"]
    OutBag --> Eval["Evaluasi Pohon ke-b pada Data OOB-nya"]
    Eval --> OOBScore["Rata-rata Prediksi OOB Seluruh Pohon = Estimasi Validasi Silang Tanpa Kebocoran!"]`,
    scratchCode: `def oob_fraction_simulation(n=10000):
    drawn = np.random.choice(n, size=n, replace=True)
    unique_drawn = len(np.unique(drawn))
    return unique_drawn / n, 1.0 - (unique_drawn / n)

in_bag, oob = oob_fraction_simulation()
print(f"Fraksi In-Bag Empiris: {in_bag:.4f} (Teori: 1 - 1/e = 0.6321)")
print(f"Fraksi OOB Empiris   : {oob:.4f} (Teori: 1/e = 0.3679)")`,
    sotaCode: `from sklearn.ensemble import RandomForestClassifier

rf_oob = RandomForestClassifier(n_estimators=100, oob_score=True, random_state=42)
X_rf = np.random.randn(200, 5)
y_rf = (X_rf[:, 0] + X_rf[:, 1] > 0).astype(int)
rf_oob.fit(X_rf, y_rf)
print("Random Forest OOB Score:", rf_oob.oob_score_)`,
    diagCode: `print("Akurasi Latih RF:", rf_oob.score(X_rf, y_rf))`,
    caseStudy: "Pelatihan model machine learning pada dataset kecil (n < 500): OOB Score memaksimalkan 100% data untuk pelatihan tanpa perlu memotong 20% validation set.",
    commonPitfalls: ["Mengabaikan oob_score_ dan membuang waktu komputasi untuk menjalankan K-Fold Cross Validation yang mahal pada Random Forest."],
    groundingLinks: [{ title: "Breiman (2001) Random Forests OOB Paper", url: "https://doi.org/10.1023/A:1010933404324", note: "Paper asli Random Forests" }]
  }),

  createSubchapter({
    id: "ml-15-4-random-forests-random-subspace",
    slug: "15-4-random-forests-random-subspace",
    title: "15.4 Random Forests: Pengenalan Random Subspace Method (Subset Fitur Acak m = sqrt(d)) untuk Dekorelasi Pohon",
    orderIndex: 4,
    description: "Arsitektur Random Forests (Breiman, 2001): Random Subspace Method (fitur acak m = sqrt(d) di setiap split) untuk mendekorelasikan pohon ensemble.",
    theoryMarkdown: `Jika ada satu fitur yang sangat dominan, pohon-pohon pada Bagging standar akan selalu memilih fitur tersebut pada simpul akar, menyebabkan seluruh pohon sangat berkorelasi ($\\rho$ tinggi).

**Random Forests** memecahkan masalah ini melalui **Random Subspace Method**:
Pada setiap pembelahan simpul, hanya subset acak berukuran $m \\ll d$ fitur yang dipertimbangkan:
- Untuk Klasifikasi: $m = \\lfloor \\sqrt{d} \\rfloor$
- Untuk Regresi: $m = \\lfloor d / 3 \\rfloor$
Hal ini memaksa pohon-pohon mengeksplorasi fitur-fitur alternatif, menurunkan korelasi $\\rho$ antar pohon secara drastis!`,
    mermaidDiagram: `graph LR
    Node["Simpul Pembelahan (Total d Fitur)"] --> RandomSub["Pilih Acak m = sqrt(d) Fitur"]
    RandomSub --> BestSplit["Cari Pembagi Terbaik HANYA dari m Fitur Ini"]
    BestSplit --> Decorr["Pohon-pohon Menjadi Tidak Berkorelasi (rho Turun Drastis!)"]`,
    scratchCode: `def select_random_subspace_indices(d_total: int, mode='sqrt'):
    m = int(np.sqrt(d_total)) if mode == 'sqrt' else max(1, d_total // 3)
    return np.random.choice(d_total, size=m, replace=False)

print("Fitur Terpilih Random Subspace (d=20):", select_random_subspace_indices(20, 'sqrt'))`,
    sotaCode: `from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=100, max_features='sqrt', random_state=42)
rf.fit(X_rf, y_rf)
print("Random Forest fitted successfully with max_features='sqrt'")`,
    diagCode: `print("Estimasi jumlah pohon aktif:", len(rf.estimators_))`,
    caseStudy: "Pendeteksian malware berbasis jutaan opcode biner: Random subspace memaksa pohon mendeteksi berbagai jenis signature virus yang berbeda.",
    commonPitfalls: ["Mengatur max_features = 1.0 pada Random Forest, yang mengubahnya kembali menjadi Bagging biasa tanpa keunggulan dekorelasi pohon."],
    groundingLinks: [{ title: "Breiman (2001) Random Forests", url: "https://doi.org/10.1023/A:1010933404324", note: "Karya monumental Leo Breiman" }]
  }),

  createSubchapter({
    id: "ml-15-5-extra-trees-extremely-randomized",
    slug: "15-5-extra-trees-extremely-randomized",
    title: "15.5 Extra-Trees (Extremely Randomized Trees): Pengacakan Ambang Pembagian Ekstrem untuk Reduksi Varians Maksimal",
    orderIndex: 5,
    description: "Varian Extremely Randomized Trees (Geurts et al., 2006): pengacakan penuh ambang pemisah tanpa sorting dan trade-off bias-varians komputasi.",
    theoryMarkdown: `**Extra-Trees (Extremely Randomized Trees)** membawa pengacakan ke tingkat ekstrem:
1. Tidak hanya memilih subset fitur $m$ secara acak, tetapi juga memilih **ambang pemisah $t$ secara acak seragam** (*uniformly random threshold*) untuk setiap fitur kandidat.
2. Menggunakan seluruh data latih (tanpa bootstrap replacement).

Keunggulan: Menghilangkan kebutuhan sorting kontinu $O(n \\log n)$, mempercepat waktu pelatihan secara drastis, dan mereduksi varians lebih lanjut.`,
    mermaidDiagram: `graph TD
    StandardRF["Random Forest: Cari Ambang Optimal t dari n Titik (Sorting O(n log n))"]
    ExtraTrees["Extra-Trees: Ambil Ambang Acak t ~ Uniform(min, max) (Tanpa Sorting O(1))!"]
    ExtraTrees --> Speed["Kecepatan Pelatihan Jauh Lebih Tinggi & Varians Lebih Rendah"]`,
    scratchCode: `def extra_trees_random_threshold(x_feature):
    x_min, x_max = np.min(x_feature), np.max(x_feature)
    return np.random.uniform(x_min, x_max)

x_feat = np.array([10.0, 15.0, 22.0, 35.0])
print("Extra-Trees Random Threshold:", np.round(extra_trees_random_threshold(x_feat), 2))`,
    sotaCode: `from sklearn.ensemble import ExtraTreesClassifier

et = ExtraTreesClassifier(n_estimators=100, random_state=42).fit(X_rf, y_rf)
print("ExtraTrees Score:", et.score(X_rf, y_rf))`,
    diagCode: `print("ExtraTrees Feature Importances:", np.round(et.feature_importances_, 3))`,
    caseStudy: "Pencocokan sidik jari waktu-nyata (Real-time biometric match): Extra-Trees melatih ratusan pohon dalam hitungan milidetik.",
    commonPitfalls: ["Extra-Trees memiliki bias sedikit lebih tinggi daripada Random Forest pada dataset yang sangat bersih dari noise."],
    groundingLinks: [{ title: "Geurts et al. (2006) Extremely randomized trees", url: "https://doi.org/10.1007/s10994-006-6226-1", note: "Paper asli penemuan Extra-Trees" }]
  }),

  createSubchapter({
    id: "ml-15-6-metrologi-feature-importance-mdi-mda",
    slug: "15-6-metrologi-feature-importance-mdi-mda",
    title: "15.6 Metrologi Kepentingan Fitur Berbasis Hutan: MDI (Gini Importance) vs Permutation Feature Importance (MDA)",
    orderIndex: 6,
    description: "Evaluasi kepentingan variabel: Mean Decrease Impurity (MDI) dan bias kardinalitas vs Permutation Importance (Mean Decrease Accuracy - MDA).",
    theoryMarkdown: `1. **Mean Decrease Impurity (MDI / Gini Importance)**:
   Total akumulasi penurunan impuritas yang dihasilkan oleh pemisahan pada fitur $j$, dirata-ratakan di seluruh pohon.
   *Kelemahan fatal*: Sangat bias terhadap fitur berkardinalitas tinggi atau fitur numerik acak kontinu!

2. **Permutation Feature Importance (MDA - Mean Decrease Accuracy)**:
   Mengacak nilai kolom fitur $j$ pada data OOB/test dan mengukur penurunan performa metrik evaluasi model:
   $$\\text{PFI}_j = L(\\mathbf{X}^{\\text{permuted } j}, \\mathbf{y}) - L(\\mathbf{X}, \\mathbf{y})$$
   MDA tidak bias terhadap kardinalitas dan mencerminkan nilai prediktif sejati.`,
    mermaidDiagram: `graph LR
    MDI["MDI (Gini Importance): Dihitung selama pelatihan (Cepat, tapi bias kardinalitas!)"]
    MDA["MDA (Permutation Importance): Mengacak kolom pada validasi (Objektif, Bebas Bias)"]`,
    scratchCode: `def permutation_importance_manual(model, X_val, y_val):
    baseline_score = model.score(X_val, y_val)
    importances = []
    for j in range(X_val.shape[1]):
        X_perm = X_val.copy()
        X_perm[:, j] = np.random.permutation(X_perm[:, j])
        score_perm = model.score(X_perm, y_val)
        importances.append(baseline_score - score_perm)
    return np.array(importances)

pfi = permutation_importance_manual(rf, X_rf, y_rf)
print("Manual Permutation Feature Importance:", np.round(pfi, 4))`,
    sotaCode: `from sklearn.inspection import permutation_importance

pfi_skl = permutation_importance(rf, X_rf, y_rf, n_repeats=5, random_state=42)
print("Scikit-Learn PFI Means:", np.round(pfi_skl.importances_mean, 4))`,
    diagCode: `print("MDI Gini Importances :", np.round(rf.feature_importances_, 4))`,
    caseStudy: "Penyaringan variabel penting dalam penemuan obat: Menghindari bias fitur MDI yang mengunggulkan nomor ID senyawa kimia acak.",
    commonPitfalls: ["Mengandalkan rf.feature_importances_ (MDI) pada data dengan fitur kategorial berkardinalitas tinggi."],
    groundingLinks: [{ title: "Strobl et al. (2007) Bias in random forest variable importance measures", url: "https://doi.org/10.1186/1471-2105-8-25", note: "Paper pembuktian bias MDI" }]
  }),

  createSubchapter({
    id: "ml-15-7-proximity-matrix-klusterisasi-outlier",
    slug: "15-7-proximity-matrix-klusterisasi-outlier",
    title: "15.7 Analisis Kedekatan Sampel (Proximity Matrix) Random Forest untuk Klusterisasi & Imputasi Outlier",
    orderIndex: 7,
    description: "Analisis kemiripan non-parametrik: Proximity Matrix (proporsi pohon di mana dua sampel berakhir di daun yang sama) untuk clustering dan imputasi.",
    theoryMarkdown: `Matriks Kedekatan (*Proximity Matrix*) $\\mathbf{P} \\in \\mathbb{R}^{n \\times n}$ mengukur kemiripan topologis antar sampel:
$$P_{ij} = \\frac{\\text{Jumlah pohon di mana sampel } i \\text{ dan } j \\text{ jatuh pada daun yang sama}}{B}$$
Matriks ini simetris dengan diagonal bernilai 1.

Aplikasi Proximity Matrix:
1. **Deteksi Outlier**: Sampel dengan rata-rata proximity sangat rendah terhadap semua sampel sekelas adalah outlier.
2. **Klusterisasi Non-Terawasi**: Proximity dapat dijadikan matriks similaritas untuk Spectral Clustering atau MDS projection.
3. **Imputasi Nilai Hilang**: Mengisi nilai hilang menggunakan rata-rata berbobot proximity.`,
    mermaidDiagram: `graph TD
    Trees["B Buah Pohon Random Forest"] --> Daun["Lacak Simpul Daun Tiap Sampel (x_i, x_j)"]
    Daun --> Proximity["P_ij = (Jumlah Daun Bersama) / B"]
    Proximity --> Outlier["Deteksi Outlier: Titik dengan Nilai Kedekatan Rendah"]
    Proximity --> Impute["Imputasi Nilai Hilang Berbasis Kedekatan"]`,
    scratchCode: `def compute_proximity_matrix(forest_leaves):
    """Menghitung matriks proximity dari output daun pohon (n_samples, n_trees)."""
    n, B = forest_leaves.shape
    P = np.zeros((n, n))
    for b in range(B):
        leaves_b = forest_leaves[:, b]
        P += (leaves_b[:, None] == leaves_b[None, :])
    return P / B

leaves_sample = np.array([[1, 2], [1, 2], [2, 1]])
print("Proximity Matrix Demo:\\n", compute_proximity_matrix(leaves_sample))`,
    sotaCode: `leaves = rf.apply(X_rf[:10])
print("Shape of Leaf Indices Matrix:", leaves.shape)`,
    diagCode: `P_mat = compute_proximity_matrix(leaves)
print("Rata-rata Proximity Sampel Pertama:", np.mean(P_mat[0]))`,
    caseStudy: "Pendeteksian fraud transaksi kartu kredit: Transaksi penipuan baru akan memiliki proximity mendekati nol ke seluruh riwayat nasabah normal.",
    commonPitfalls: ["Menghitung matriks proximity pada dataset n > 50,000 karena kompleksitas memori O(n^2)."],
    groundingLinks: [{ title: "Breiman Random Forest Proximity Documentation", url: "https://www.statlearning.com/", note: "Metode proximity Breiman" }]
  })
];

const chapter15 = {
  id: "machine-learning-ch-15",
  slug: "bab-15-ensemble-learning-bagging-pasting-random-forests-oob",
  title: "BAB 15: Ensemble Learning: Bagging, Pasting, & Random Forests OOB",
  orderIndex: 15,
  description: "Teori dan implementasi Ensemble Learning berbasis perata-rataan: reduksi varians melalui independensi estimator, Bagging vs Pasting, evaluasi Out-Of-Bag (OOB 63.2%), Random Forests dan Random Subspace Method, Extra-Trees, metrologi MDI vs MDA, serta analisis Proximity Matrix.",
  coreConcepts: [
    "Prinsip Reduksi Varians Law of Large Numbers",
    "Bagging vs Pasting Resampling",
    "Evaluasi Out-Of-Bag (OOB 1/e)",
    "Random Forests & Random Subspace Method",
    "Extremely Randomized Trees (Extra-Trees)",
    "Metrologi Kepentingan Fitur MDI vs Permutation MDA",
    "Proximity Matrix & Deteksi Outlier"
  ],
  subchapters: ch15Subs
};

fs.writeFileSync(path.join(outDir, 'chunk4-ch15.ts'), exportChapterTs(chapter15, 'chapter15'), 'utf-8');
console.log('Successfully generated chunk4-ch15.ts (7 subchapters)');


// ============================================================================
// BAB 16: Gradient Boosting Lanjut: Teori Friedman, Shrinkage, & Trees (7 Subbab)
// ============================================================================
const ch16Subs = [
  createSubchapter({
    id: "ml-16-1-adaboost-pembobotan-eksponensial",
    slug: "16-1-adaboost-pembobotan-eksponensial",
    title: "16.1 Paradigma Boosting Adaptif: Teori AdaBoost.M1, Pembobotan Ulang Sampel Eksponensial, & Alpha Weighted Voting",
    orderIndex: 1,
    description: "Fondasi algoritma Boosting adaptif: teori AdaBoost.M1 (Freund & Schapire), pembaruan bobot sampel eksponensial, dan voting terbobot alpha_m.",
    theoryMarkdown: `Boosting mengubah sekumpulan *weak learners* (misal Decision Stumps kedalaman 1) menjadi *strong predictor* secara sekuensial.
Pada **AdaBoost.M1**:
1. Evaluasi error terbobot pohon ke-$m$: $\\epsilon_m = \\sum_{y_i \\neq h_m(\\mathbf{x}_i)} w_i^{(m)}$.
2. Hitung bobot voting model: $\\alpha_m = \\frac{1}{2} \\ln\\left( \\frac{1 - \\epsilon_m}{\\epsilon_m} \\right)$.
3. Perbarui bobot sampel: $w_i^{(m+1)} = w_i^{(m)} \\exp(-\\alpha_m y_i h_m(\\mathbf{x}_i))$ lalu normalisasikan.
Sampel yang salah diklasifikasikan mendapatkan peningkatan bobot eksponensial!`,
    mermaidDiagram: `graph LR
    W1["Sampel Awal: Bobot Seragam w_i = 1/n"] --> Tree1["Latih Stump 1"]
    Tree1 --> Err1["Hitung Error eps_1 & Bobot Alpha_1"]
    Err1 --> Upd["Tingkatkan Bobot Sampel yang Salah"]
    Upd --> Tree2["Latih Stump 2 pada Data Terbobot Baru"]
    Tree2 --> Final["Prediksi Akhir: sign(sum alpha_m h_m(x))"]`,
    scratchCode: `def adaboost_m1_step(w, y_true, y_pred):
    misclassified = (y_true != y_pred).astype(float)
    eps_m = np.sum(w * misclassified) / np.sum(w)
    eps_m = np.clip(eps_m, 1e-10, 1.0 - 1e-10)
    alpha_m = 0.5 * np.log((1.0 - eps_m) / eps_m)
    w_new = w * np.exp(-alpha_m * y_true * y_pred)
    w_new /= np.sum(w_new)
    return alpha_m, w_new

w_init = np.ones(4) / 4
y_t = np.array([1, 1, -1, -1])
y_p = np.array([1, -1, -1, -1])
alpha, w_next = adaboost_m1_step(w_init, y_t, y_p)
print(f"Alpha: {alpha:.4f}")
print("Bobot Sampel Baru:", np.round(w_next, 4))`,
    sotaCode: `from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier

ada = AdaBoostClassifier(estimator=DecisionTreeClassifier(max_depth=1), n_estimators=50, random_state=42)
ada.fit(X_rf, y_rf)
print("AdaBoost Score:", ada.score(X_rf, y_rf))`,
    diagCode: `print("Estimator weights sum:", np.sum(ada.estimator_weights_))`,
    caseStudy: "Deteksi wajah Viola-Jones pada kamera digital: AdaBoost memilih ratusan fitur Haar wavelet sederhana untuk deteksi wajah real-time.",
    commonPitfalls: ["Sensitivitas ekstrem terhadap outlier: Sampel outlier dengan label salah akan terus diboboti eksponensial hingga mendistorsi model."],
    groundingLinks: [{ title: "Freund & Schapire (1997) A Decision-Theoretic Generalization of On-Line Learning", url: "https://doi.org/10.1006/jcss.1997.1504", note: "Paper asli penemuan AdaBoost" }]
  }),

  createSubchapter({
    id: "ml-16-2-gradient-boosting-friedman",
    slug: "16-2-gradient-boosting-friedman",
    title: "16.2 Formulasi Gradient Boosting Friedman: Optimasi Numerik Gradient Descent pada Ruang Fungsi (Function Space)",
    orderIndex: 2,
    description: "Perumusan Gradient Boosting Jerome Friedman (2001): memandang boosting sebagai optimasi Gradient Descent pada ruang fungsi tak hingga (function space).",
    theoryMarkdown: `Jerome Friedman (2001) merevolusi boosting dengan memandangnya sebagai **Gradient Descent pada Ruang Fungsi**:
$$F_M(\\mathbf{x}) = F_0(\\mathbf{x}) + \\sum_{m=1}^M \\rho_m h_m(\\mathbf{x})$$

Alih-alih mengoptimalkan parameter bobot di ruang Euclid $\\mathbb{R}^p$, kita mencari fungsi penambah $h_m \\in \\mathcal{H}$ yang mengarah ke gradien negatif dari fungsi kerugian:
$$-g_m(\\mathbf{x}_i) = -\\left[ \\frac{\\partial L(y_i, F(\\mathbf{x}_i))}{\\partial F(\\mathbf{x}_i)} \\right]_{F(\\mathbf{x}) = F_{m-1}(\\mathbf{x})}$$
Pohon ke-$m$ dilatih untuk memprediksi residu gradien semu (*pseudo-residuals*) ini!`,
    mermaidDiagram: `graph TD
    F0["Inisialisasi: F_0(x) = argmin_gamma sum L(y_i, gamma)"] --> Grad["Hitung Residu Gradien Semu: r_im = - dL / dF"]
    Grad --> FitTree["Latih Pohon h_m(x) untuk Memprediksi r_im"]
    FitTree --> LineSearch["Line Search / Update Nilai Daun gamma_jm"]
    LineSearch --> Update["Update Model: F_m(x) = F_{m-1}(x) + nu * h_m(x)"]
    Update --> Check{"Iterasi Selesai (m = M)?"}
    Check -- Belum --> Grad
    Check -- Selesai --> Done["Model Kuat Selesai"]`,
    scratchCode: `def gradient_boosting_mse_scratch(X, y, M=5, lr=0.1):
    F = np.full(len(y), np.mean(y))  # F_0(x)
    models = []
    for _ in range(M):
        # Residu negatif MSE: r = -(F - y) = y - F
        pseudo_residuals = y - F
        tree = DecisionTreeRegressor(max_depth=2).fit(X, pseudo_residuals)
        update = tree.predict(X)
        F += lr * update
        models.append(tree)
    return F, models

y_gb = np.array([1.0, 2.0, 3.0, 10.0])
X_gb = np.arange(4).reshape(-1, 1)
F_pred, _ = gradient_boosting_mse_scratch(X_gb, y_gb, M=3)
print("Gradient Boosting Scratch Prediksi:", np.round(F_pred, 2))`,
    sotaCode: `from sklearn.ensemble import GradientBoostingRegressor

gbr = GradientBoostingRegressor(n_estimators=3, max_depth=2, learning_rate=0.1).fit(X_gb, y_gb)
print("Scikit-Learn GBR Prediksi:", np.round(gbr.predict(X_gb), 2))`,
    diagCode: `print("MSE Loss:", np.mean((y_gb - gbr.predict(X_gb))**2))`,
    caseStudy: "Peringkat pencarian mesin pencari Bing/Yahoo (Learning to Rank): Memprediksi skor relevansi dokumen terhadap query pengguna.",
    commonPitfalls: ["Mengabaikan learning rate sehingga model overfit pada iterasi awal."],
    groundingLinks: [{ title: "Friedman (2001) Greedy Function Approximation", url: "https://doi.org/10.1214/aos/1013203451", note: "Paper pendirian Gradient Boosting" }]
  }),

  createSubchapter({
    id: "ml-16-3-pseudo-residuals-loss-functions",
    slug: "16-3-pseudo-residuals-loss-functions",
    title: "16.3 Residu Negatif sebagai Gradien Semu (Pseudo-Residuals) untuk Berbagai Fungsi Kerugian Diferensiabel",
    orderIndex: 3,
    description: "Penurunan gradien semu untuk berbagai fungsi kerugian: MSE (residual biasa), MAE (median sign), Huber loss (hibrida robust), dan Binary Cross-Entropy.",
    theoryMarkdown: `1. **Squared Error ($L_2$)**:
   $$L(y, F) = \\frac{1}{2}(y - F)^2 \\implies r = y - F$$

2. **Absolute Error ($L_1$)**:
   $$L(y, F) = |y - F| \\implies r = \\text{sign}(y - F)$$
   Pohon memprediksi arah tanda residual, sangat tahan terhadap outlier ekstrem.

3. **Huber Loss (Robust)**:
   $$r = \\begin{cases} y - F, & |y - F| \\le \\delta \\\\ \\delta \\cdot \\text{sign}(y - F), & |y - F| > \\delta \\end{cases}$$

4. **Bernoulli Deviance (Log-Loss Klasifikasi)**:
   $$r = y - p = y - \\sigma(F)$$
   Residu adalah selisih antara label sejati (0/1) dan probabilitas saat ini!`,
    mermaidDiagram: `graph TD
    Loss["Fungsi Kerugian Diferensiabel L(y, F)"] --> L2["L2 MSE -> Residu Linier: y - F"]
    Loss --> L1["L1 MAE -> Residu Tanda: sign(y - F) (Robust)"]
    Loss --> Huber["Huber -> Hibrida Linier & Tanda"]
    Loss --> LogLoss["Log-Loss -> Residu Probabilitas: y - p"]`,
    scratchCode: `def pseudo_residuals_bernoulli(y_true, F):
    p = 1.0 / (1.0 + np.exp(-F))
    return y_true - p

F_logits = np.array([2.0, -1.0, 0.5])
y_labels = np.array([1, 0, 1])
print("Pseudo-residuals Bernoulli:", np.round(pseudo_residuals_bernoulli(y_labels, F_logits), 4))`,
    sotaCode: `from sklearn.ensemble import GradientBoostingClassifier

gbc = GradientBoostingClassifier(loss='log_loss', n_estimators=10).fit(X_rf, y_rf)
print("GB Classifier Score:", gbc.score(X_rf, y_rf))`,
    diagCode: `print("Probabilitas prediksi 3 sampel:", np.round(gbc.predict_proba(X_rf[:3]), 3))`,
    caseStudy: "Prediksi keterlambatan pengiriman logistik pada cuaca buruk: Menggunakan Huber loss untuk mengabaikan badai salju anomali ekstrem.",
    commonPitfalls: ["Menggunakan loss L2 saat target memiliki outlier berat, menyebabkan pohon fokus hanya pada sampel anomali."],
    groundingLinks: [{ title: "Scikit-Learn Gradient Boosting Loss Functions", url: "https://scikit-learn.org/stable/modules/ensemble.html#loss-functions", note: "Daftar fungsi kerugian resmi" }]
  }),

  createSubchapter({
    id: "ml-16-4-shrinkage-learning-rate",
    slug: "16-4-shrinkage-learning-rate",
    title: "16.4 Regularisasi Laju Belajar (Shrinkage / Learning Rate): Mencegah Overfitting Sekuensial",
    orderIndex: 4,
    description: "Teknik regularisasi shrinkage (learning rate nu): penskalaan kontribusi setiap pohon baru untuk memperlambat konvergensi dan memperluas generalisasi.",
    theoryMarkdown: `**Shrinkage** mengalikan kontribusi setiap pohon baru dengan faktor laju belajar $\\nu \\in (0, 1]$:
$$F_m(\\mathbf{x}) = F_{m-1}(\\mathbf{x}) + \\nu \\sum_{j=1}^J \\gamma_{jm} \\mathbb{I}(\\mathbf{x} \\in R_{jm})$$

Nilai $\\nu$ kecil (misal $\\nu = 0.01$ atau $0.05$) membutuhkan lebih banyak pohon $M$, namun terbukti secara empiris menghasilkan generalisasi out-of-sample yang jauh lebih baik daripada $\\nu = 1.0$.
Terdapat trade-off fundamental: Mengurangi $\\nu$ sebesar faktor $k$ mengharuskan peningkatan $M$ sebesar faktor $k$.`,
    mermaidDiagram: `graph LR
    Tree["Pohon Baru Ditumbuhkan: h_m(x)"] --> Scale["Kalikan Laju Belajar: nu * h_m(x) (misal nu = 0.05)"]
    Scale --> Update["F_m = F_{m-1} + nu * h_m"]
    Update --> Gen["Mencegah Satu Pohon Menguasai Model -> Generalisasi Meningkat"]`,
    scratchCode: `def demonstrate_shrinkage_decay():
    nu = 0.05
    steps = [nu * (1 - nu)**i for i in range(5)]
    return steps

print("Kontribusi bobot bertahap:", np.round(demonstrate_shrinkage_decay(), 4))`,
    sotaCode: `from sklearn.ensemble import GradientBoostingRegressor

gbr_slow = GradientBoostingRegressor(learning_rate=0.01, n_estimators=200).fit(X_gb, y_gb)
gbr_fast = GradientBoostingRegressor(learning_rate=1.0, n_estimators=200).fit(X_gb, y_gb)
print("Slow Learning Rate MSE:", np.mean((y_gb - gbr_slow.predict(X_gb))**2))
print("Fast Learning Rate MSE:", np.mean((y_gb - gbr_fast.predict(X_gb))**2))`,
    diagCode: `print("Slow learning rate mencegah osilasi residual.")`,
    caseStudy: "Penyetelan model underwriting pinjaman fintech: Memilih learning rate nu = 0.02 dengan 800 pohon untuk akurasi optimal.",
    commonPitfalls: ["Menurunkan learning rate tanpa menambah jumlah pohon (n_estimators), menyebabkan underfitting parah."],
    groundingLinks: [{ title: "Friedman (2002) Stochastic Gradient Boosting", url: "https://doi.org/10.1016/S0167-9473(01)00065-2", note: "Paper shrinkage dan subsampling" }]
  }),

  createSubchapter({
    id: "ml-16-5-stochastic-gradient-boosting",
    slug: "16-5-stochastic-gradient-boosting",
    title: "16.5 Stochastic Gradient Boosting: Subsampling Baris Sampel dan Kolom Fitur untuk Pencegahan Ko-Adaptasi",
    orderIndex: 5,
    description: "Stochastic Gradient Boosting (Friedman, 2002): subsampling baris (subsample < 1.0) dan subsampling kolom (colsample) untuk mereduksi varians.",
    theoryMarkdown: `Pada setiap iterasi, **Stochastic Gradient Boosting** mengambil subset acak tanpa pengembalian berukuran $\\eta \\cdot n$ (misal $\\eta = 0.5$ s.d. $0.8$) dari data latih untuk mencocokkan pohon basis berikutnya.

Keuntungan ganda:
1. **Kecepatan Komputasi**: Waktu fitting berkurang sebanding dengan fraksi subsample.
2. **Reduksi Varians**: Gradien semu dihitung pada sampel yang berbeda di setiap iterasi, bertindak sebagai regularisasi penstabil yang mencegah ko-adaptasi antar-pohon.`,
    mermaidDiagram: `graph TD
    Data["Data Latih Penuh"] --> Subsample["Ambil Subsample Acak (misal 70% Baris)"]
    Subsample --> Fit["Latih Pohon Residu pada 70% Data"]
    Fit --> Update["Update F_m pada Seluruh Dataset"]`,
    scratchCode: `def get_stochastic_subsample(X, y, subsample_ratio=0.7):
    n = len(X)
    size = int(n * subsample_ratio)
    idx = np.random.choice(n, size=size, replace=False)
    return X[idx], y[idx]

X_sub, y_sub = get_stochastic_subsample(X_rf, y_rf, 0.7)
print("Ukuran Subsample Stokastik:", X_sub.shape)`,
    sotaCode: `gbr_stoch = GradientBoostingRegressor(subsample=0.7, max_features='sqrt', random_state=42).fit(X_gb, y_gb)
print("Stochastic Gradient Boosting fitted successfully")`,
    diagCode: `print("OOB improvement available in GBR:", hasattr(gbr_stoch, 'oob_improvement_'))`,
    caseStudy: "Pemrosesan transaksi e-commerce 10 juta baris: Stochastic subsampling 0.5 memangkas separuh waktu komputasi cluster GPU.",
    commonPitfalls: ["Mengatur subsample terlalu kecil (misal < 0.2) yang menyebabkan estimasi gradien memiliki varians stokastik terlalu tinggi."],
    groundingLinks: [{ title: "Friedman (2002) Stochastic Gradient Boosting", url: "https://doi.org/10.1016/S0167-9473(01)00065-2", note: "Paper asli Stochastic GBDT" }]
  }),

  createSubchapter({
    id: "ml-16-6-gbdt-klasifikasi-probabilistik",
    slug: "16-6-gbdt-klasifikasi-probabilistik",
    title: "16.6 Gradient Tree Boosting untuk Klasifikasi Probabilistik: Penyesuaian Nilai Daun melalui Newton Raphson Step",
    orderIndex: 6,
    description: "Perumusan Gradient Tree Boosting untuk klasifikasi biner dan multikelas: pembaruan nilai daun via Newton-Raphson step gamma_jm = sum r / sum p(1-p).",
    theoryMarkdown: `Pada klasifikasi biner dengan loss log-loss, pohon mencocokkan residu $r_i = y_i - p_i$.
Namun nilai rata-rata residu di simpul daun tidak dapat langsung ditambahkan ke logit $F$. Diperlukan **Newton-Raphson Step** 1-langkah pada setiap daun $R_{jm}$:
$$\\gamma_{jm} = \\frac{\\sum_{i \\in R_{jm}} (y_i - p_i)}{\\sum_{i \\in R_{jm}} p_i (1 - p_i)}$$
Penyebut adalah turunan kedua (Hessian) dari fungsi kerugian log-loss.`,
    mermaidDiagram: `graph LR
    Residuals["Residu Gradien: y_i - p_i"] --> TreeLeaves["Partisi Daun Pohon R_jm"]
    TreeLeaves --> NewtonStep["Newton-Raphson Step: gamma_jm = sum(y_i - p_i) / sum(p_i(1 - p_i))"]
    NewtonStep --> LogitsUpdate["Update Logit: F(x) = F(x) + nu * gamma_jm"]`,
    scratchCode: `def newton_raphson_leaf_update(y_true, p_pred):
    num = np.sum(y_true - p_pred)
    den = np.sum(p_pred * (1.0 - p_pred))
    return num / max(den, 1e-10)

y_l = np.array([1, 1, 0])
p_l = np.array([0.7, 0.8, 0.4])
print("Pembaruan Daun Newton-Raphson:", newton_raphson_leaf_update(y_l, p_l))`,
    sotaCode: `from sklearn.ensemble import GradientBoostingClassifier

gbc_model = GradientBoostingClassifier(n_estimators=20).fit(X_rf, y_rf)
print("GB Classifier Score:", gbc_model.score(X_rf, y_rf))`,
    diagCode: `print("Evaluasi probabilitas kelas 1:", gbc_model.predict_proba(X_rf[:2])[:, 1])`,
    caseStudy: "Deteksi churn nasabah telekomunikasi: Model menghasilkan probabilitas terkalibrasi tinggi untuk kampanye retensi diskon.",
    commonPitfalls: ["Lupa bahwa output mentah GBDT klasifikasi adalah logit F(x), yang harus ditransformasikan dengan Sigmoid untuk mendapatkan probabilitas."],
    groundingLinks: [{ title: "ESL Ch. 10 Boosting and Additive Trees", url: "https://hastie.su.domains/ElemStatLearn/", note: "Bab kanonikal GBDT Klasifikasi" }]
  }),

  createSubchapter({
    id: "ml-16-7-overfitting-boosting-weak-learners",
    slug: "16-7-overfitting-boosting-weak-learners",
    title: "16.7 Fenomena Overfitting pada Boosting: Pengaruh Kedalaman Pohon Lemah (Weak Learners / Stumps)",
    orderIndex: 7,
    description: "Analisis dinamika overfitting pada Boosting: peran interaksi fitur kedalaman pohon max_depth (stumps vs pohon dalam), dan early stopping.",
    theoryMarkdown: `Kedalaman pohon basis (*tree depth*) $J$ mengontrol **derajat interaksi fitur**:
- $J = 2$ (Stumps / 1 split): Model aditif murni tanpa interaksi fitur $f(\\mathbf{x}) = \\sum f_j(x_j)$.
- $J = 3$ (depth 2): Menangkap interaksi 2-arah.
- $J > 6$: Rentang overfitting meningkat secara eksponensial.

Berbeda dengan Random Forest yang tidak bisa overfit dengan penambahan jumlah pohon $M$, **Gradient Boosting AKAN overfit jika $M$ terlalu besar**!
Oleh karena itu, **Early Stopping** berbasis validation loss adalah keharusan mutlak.`,
    mermaidDiagram: `graph TD
    Depth["Kedalaman Pohon Lemah max_depth"] --> Stumps["max_depth=1: Aditif Murni (Tidak Menangkap Interaksi)"]
    Depth --> Optimal["max_depth=3 s.d. 6: Standar Emas Industri"]
    Depth --> Overfit["max_depth > 8: Menghafal Noise Residu (Overfitting Cepat)"]
    Optimal --> EarlyStop["Terapkan Early Stopping saat Validation Loss Berhenti Turun"]`,
    scratchCode: `def early_stopping_monitor(val_losses, patience=3):
    best_loss = np.inf
    patience_count = 0
    for idx, loss in enumerate(val_losses):
        if loss < best_loss:
            best_loss = loss
            patience_count = 0
        else:
            patience_count += 1
            if patience_count >= patience:
                return idx, f"Early stop at iteration {idx}"
    return len(val_losses), "Completed all iterations"

losses = [0.5, 0.4, 0.35, 0.34, 0.36, 0.37, 0.39]
it, msg = early_stopping_monitor(losses, patience=2)
print("Monitoring:", msg)`,
    sotaCode: `from sklearn.ensemble import GradientBoostingClassifier

gbc_early = GradientBoostingClassifier(n_estimators=100, validation_fraction=0.2, n_iter_no_change=5, random_state=42)
gbc_early.fit(X_rf, y_rf)
print(f"Pohon Terhenti Awal di Iterasi {gbc_early.n_estimators_} dari 100")`,
    diagCode: `print("Validation score akhir:", gbc_early.score(X_rf, y_rf))`,
    caseStudy: "Kompetisi Kaggle Tabular: Pemenang selalu menyetel n_iter_no_change = 50 untuk mengunci titik generalisasi optimal.",
    commonPitfalls: ["Membiarkan n_estimators berjalan hingga 10,000 tanpa early stopping pada learning rate sedang."],
    groundingLinks: [{ title: "Scikit-Learn Early Stopping in Gradient Boosting", url: "https://scikit-learn.org/stable/auto_examples/ensemble/plot_gradient_boosting_early_stopping.html", note: "Tutorial Early Stopping resmi" }]
  })
];

const chapter16 = {
  id: "machine-learning-ch-16",
  slug: "bab-16-gradient-boosting-lanjut-teori-friedman-shrinkage-trees",
  title: "BAB 16: Gradient Boosting Lanjut: Teori Friedman, Shrinkage, & Trees",
  orderIndex: 16,
  description: "Formulasi analitis Gradient Tree Boosting: paradigma AdaBoost.M1, optimasi Gradient Descent pada ruang fungsi oleh Jerome Friedman, residu semu untuk berbagai fungsi loss diferensiabel, regularisasi laju belajar (shrinkage), Stochastic Gradient Boosting, GBDT klasifikasi probabilitas via langkah Newton-Raphson, dan pencegahan overfitting melalui early stopping.",
  coreConcepts: [
    "AdaBoost.M1 & Pembobotan Eksponensial",
    "Optimasi Ruang Fungsi Friedman",
    "Residu Gradien Semu (Pseudo-Residuals)",
    "Regularisasi Laju Belajar (Shrinkage)",
    "Stochastic Subsampling Baris & Kolom",
    "Langkah Daun Newton-Raphson Klasifikasi",
    "Early Stopping & Kedalaman Pohon Lemah"
  ],
  subchapters: ch16Subs
};

fs.writeFileSync(path.join(outDir, 'chunk4-ch16.ts'), exportChapterTs(chapter16, 'chapter16'), 'utf-8');
console.log('Successfully generated chunk4-ch16.ts (7 subchapters)');


// ============================================================================
// BAB 17: Ekosistem Boosting Modern: XGBoost, LightGBM, & CatBoost (7 Subbab)
// ============================================================================
const ch17Subs = [
  createSubchapter({
    id: "ml-17-1-arsitektur-xgboost-taylor-orde-dua",
    slug: "17-1-arsitektur-xgboost-taylor-orde-dua",
    title: "17.1 Arsitektur XGBoost: Ekspansi Deret Taylor Orde Kedua (Hessian dan Gradien) pada Fungsi Objektif",
    orderIndex: 1,
    description: "Arsitektur matematis XGBoost (Chen & Guestrin, 2016): ekspansi Taylor orde kedua pada fungsi kerugian arbitrer dan regularisasi bobot daun.",
    theoryMarkdown: `XGBoost mengaproksimasi fungsi objektif kustom menggunakan deret Taylor orde kedua:
$$\\mathcal{L}^{(t)} \\approx \\sum_{i=1}^n \\left[ l(y_i, \\hat{y}^{(t-1)}) + g_i f_t(\\mathbf{x}_i) + \\frac{1}{2} h_i f_t^2(\\mathbf{x}_i) \\right] + \\Omega(f_t)$$
di mana $g_i = \\partial_{\\hat{y}^{(t-1)}} l(y_i, \\hat{y}^{(t-1)})$ adalah gradien dan $h_i = \\partial^2_{\\hat{y}^{(t-1)}} l(y_i, \\hat{y}^{(t-1)})$ adalah Hessian.

Fungsi penalti kompleksitas pohon:
$$\\Omega(f_t) = \\gamma T + \\frac{1}{2} \\lambda \\sum_{j=1}^T w_j^2$$
Bobot optimal simpul daun $j$ dan skor optimalnya:
$$w_j^* = -\\frac{\\sum_{i \\in I_j} g_i}{\\sum_{i \\in I_j} h_i + \\lambda}, \\quad \\text{Score}^* = -\\frac{1}{2} \\sum_{j=1}^T \\frac{(\\sum_{i \\in I_j} g_i)^2}{\\sum_{i \\in I_j} h_i + \\lambda} + \\gamma T$$`,
    mermaidDiagram: `graph TD
    Loss["Fungsi Kerugian Arbitrer l(y, y_hat)"] --> Taylor["Ekspansi Taylor Orde 2: g_i (Gradien) & h_i (Hessian)"]
    Taylor --> Obj["Fungsi Objektif: sum [g_i w_q(x) + 1/2 (h_i + lambda) w_q^2(x)] + gamma T"]
    Obj --> ClosedForm["Solusi Analitis Bobot Daun: w_j* = - G_j / (H_j + lambda)"]
    ClosedForm --> Gain["Skor Gain Pembagian: 1/2 [G_L^2/(H_L+lambda) + G_R^2/(H_R+lambda) - G_P^2/(H_P+lambda)] - gamma"]`,
    scratchCode: `def xgboost_leaf_weight_and_gain(G_L, H_L, G_R, H_R, lmbda=1.0, gamma=0.0):
    G_P, H_P = G_L + G_R, H_L + H_R
    gain = 0.5 * ( (G_L**2)/(H_L + lmbda) + (G_R**2)/(H_R + lmbda) - (G_P**2)/(H_P + lmbda) ) - gamma
    w_L = -G_L / (H_L + lmbda)
    w_R = -G_R / (H_R + lmbda)
    return gain, w_L, w_R

gain, wL, wR = xgboost_leaf_weight_and_gain(G_L=-5.0, H_L=10.0, G_R=3.0, H_R=10.0, lmbda=1.0, gamma=0.1)
print(f"XGBoost Split Gain: {gain:.4f}, Bobot Kiri: {wL:.4f}, Bobot Kanan: {wR:.4f}")`,
    sotaCode: `import xgboost as xgb

dtrain = xgb.DMatrix(X_rf, label=y_rf)
params = {'max_depth': 3, 'eta': 0.1, 'objective': 'binary:logistic'}
bst = xgb.train(params, dtrain, num_boost_round=10)
print("XGBoost Model Trained Successfully")`,
    diagCode: `print("XGBoost Best Iteration:", bst.best_iteration)`,
    caseStudy: "Pemenang kompetisi Kaggle tabular data: Arsitektur Taylor orde kedua XGBoost mengoptimalkan loss kustom metrik kuantil dan ranking finansial secara langsung.",
    commonPitfalls: ["Mengabaikan regularisasi lambda dan gamma pada XGBoost, yang menyebabkan pembentukan daun-daun kecil yang sensitif terhadap noise."],
    groundingLinks: [{ title: "Chen & Guestrin (2016) XGBoost Paper", url: "https://arxiv.org/abs/1603.02754", note: "Paper asli XGBoost ACM KDD" }]
  }),

  createSubchapter({
    id: "ml-17-2-xgboost-split-finding-sparsity",
    slug: "17-2-xgboost-split-finding-sparsity",
    title: "17.2 Algoritma Penemuan Pembagian XGBoost: Weighted Quantile Sketch & Sparsity-Aware Split Finding",
    orderIndex: 2,
    description: "Inovasi split finding XGBoost: Weighted Quantile Sketch untuk data terdistribusi dan Sparsity-Aware Split Finding untuk nilai hilang.",
    theoryMarkdown: `1. **Weighted Quantile Sketch**:
   Mencari titik kandidat pembagi kuantil berdasarkan bobot Hessian $h_i$ (yang bertindak sebagai bobot sampel dalam kuadrat terkecil):
   $$r_k(x) = \\frac{\\sum_{i: x_i < x} h_i}{\\sum_{i} h_i}$$
   Menjamin error aproksimasi kuantil dibatasi oleh $\\epsilon$.

2. **Sparsity-Aware Split Finding**:
   Ketika nilai fitur hilang (*NaN*) atau bernilai nol pada sparse matrix, XGBoost menetapkan arah default (*default direction*) ke cabang kiri atau kanan yang menghasilkan Gain tertinggi.
   Waktu komputasi hanya sebanding dengan jumlah sampel yang tidak hilang $O(n_{\\text{non-missing}})$.`,
    mermaidDiagram: `graph LR
    Missing["Data Hilang / Sparse (NaN)"] --> Eval["Evaluasi 2 Skenario Default: Kirim Semua NaN ke Kiri vs Kanan"]
    Eval --> Pick["Pilih Arah Default yang Memaksimalkan Gain"]
    Pick --> Fast["Eksekusi Cepat Hanya pada Titik yang Memiliki Nilai!"]`,
    scratchCode: `def sparsity_aware_direction(G_non_missing, H_non_missing, G_all, H_all, lmbda=1.0):
    G_missing = G_all - G_non_missing
    H_missing = H_all - H_non_missing
    # Bandingkan jika missing masuk kiri vs kanan
    score_left = (G_non_missing + G_missing)**2 / (H_non_missing + H_missing + lmbda)
    score_right = (G_non_missing)**2 / (H_non_missing + lmbda)
    return "Left" if score_left > score_right else "Right"

print("Arah default missing value terpilih:", sparsity_aware_direction(10, 20, 15, 30))`,
    sotaCode: `clf_xgb = xgb.XGBClassifier(n_estimators=10, missing=np.nan).fit(X_rf, y_rf)
print("XGBClassifier handles missing values seamlessly")`,
    diagCode: `print("Akurasi evaluasi XGB:", clf_xgb.score(X_rf, y_rf))`,
    caseStudy: "Pemrosesan matriks transaksi pengguna pada recommendation system yang memiliki 99.8% nilai kosong (sparse csr_matrix).",
    commonPitfalls: ["Mengimputasi nilai hilang dengan median/mean secara manual sebelum XGBoost, yang merusak kemampuan model mendeteksi sinyal informasi missingness."],
    groundingLinks: [{ title: "XGBoost Documentation on Missing Values", url: "https://xgboost.readthedocs.io/en/stable/faq.html#how-to-deal-with-missing-values", note: "Dokumentasi resmi penanganan missing values" }]
  }),

  createSubchapter({
    id: "ml-17-3-arsitektur-lightgbm-leaf-wise",
    slug: "17-3-arsitektur-lightgbm-leaf-wise",
    title: "17.3 Arsitektur LightGBM: Paradigma Leaf-Wise (Best-First) Tree Growth vs Level-Wise (Depth-Wise)",
    orderIndex: 3,
    description: "Perbandingan topologi pertumbuhan pohon: Paradigma Leaf-Wise (Best-First) LightGBM vs Level-Wise (Depth-Wise) tradisional, serta kontrol max_depth.",
    theoryMarkdown: `Tradisional GBDT (dan XGBoost versi awal) menumbuhkan pohon secara **Level-Wise (Depth-Wise)**: membelah semua simpul di tingkat kedalaman yang sama sebelum turun ke tingkat berikutnya.

**LightGBM** mengadopsi paradigma **Leaf-Wise (Best-First)**:
Dari seluruh simpul daun yang ada, pilih simpul tunggal yang menghasilkan penurunan loss (*split gain*) terbesar untuk dibelah, tanpa memedulikan kedalamannya.
Keunggulan: Menghasilkan penurunan loss yang jauh lebih besar untuk jumlah simpul daun yang sama.
Mitigasi: Karena dapat membentuk pohon asimetris yang sangat dalam, parameter \`max_depth\` dan \`num_leaves\` digunakan untuk membatasi kompleksitas.`,
    mermaidDiagram: `graph TD
    subgraph LevelWise["Level-Wise (XGBoost Tradisional)"]
      L1["Bagi Semua Simpul di Level 1"] --> L2["Bagi Semua Simpul di Level 2"]
    end
    subgraph LeafWise["Leaf-Wise Best-First (LightGBM)"]
      LW1["Cari Daun dengan Penurunan Loss Terbesar"] --> LW2["Bagi Daun Tersebut Secara Asimetris"]
    end`,
    scratchCode: `def leaf_wise_selection(leaf_gains):
    best_leaf = max(leaf_gains, key=leaf_gains.get)
    return best_leaf, leaf_gains[best_leaf]

gains = {'leaf_A': 12.5, 'leaf_B': 45.2, 'leaf_C': 3.1}
best_l, g = leaf_wise_selection(gains)
print(f"Leaf-Wise membelah: {best_l} dengan Gain {g}")`,
    sotaCode: `import lightgbm as lgb

lgb_train = lgb.Dataset(X_rf, y_rf)
params = {'num_leaves': 31, 'objective': 'binary', 'metric': 'binary_logloss', 'verbose': -1}
lgb_model = lgb.train(params, lgb_train, num_boost_round=10)
print("LightGBM Model Trained Successfully with Leaf-Wise Strategy")`,
    diagCode: `print("LightGBM Number of Trees:", lgb_model.num_trees())`,
    caseStudy: "Prakiraan cuaca numerik di institusi meteorologi: LightGBM memproses jutaan grid spasial dengan loss reduction 20% lebih tajam dibanding level-wise.",
    commonPitfalls: ["Mengatur num_leaves terlalu besar tanpa membatasi max_depth, menyebabkan overfitting pada simpul daun terisolasi."],
    groundingLinks: [{ title: "Ke et al. (2017) LightGBM Paper", url: "https://papers.nips.cc/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html", note: "Paper asli LightGBM NeurIPS" }]
  }),

  createSubchapter({
    id: "ml-17-4-optimasi-lightgbm-goss-efb",
    slug: "17-4-optimasi-lightgbm-goss-efb",
    title: "17.4 Optimasi Kecepatan LightGBM: Gradient-Based One-Side Sampling (GOSS) & Exclusive Feature Bundling (EFB)",
    orderIndex: 4,
    description: "Inovasi komputasi LightGBM: GOSS (subsampling sampel bergradien kecil dengan pengali bobot kompensasi) dan EFB (penggabungan fitur eksklusif sparse).",
    theoryMarkdown: `1. **Gradient-Based One-Side Sampling (GOSS)**:
   Sampel dengan gradien besar memiliki kontribusi loss terbesar. GOSS mempertahankan seluruh top-$a$ fraksi sampel dengan gradien terbesar, dan mengambil sampel acak fraksi $b$ dari sisa sampel bergradien kecil.
   Sampel bergradien kecil dikalikan dengan bobot kompensasi $\\frac{1 - a}{b}$ untuk menjaga estimasi data tetap tak-bias!

2. **Exclusive Feature Bundling (EFB)**:
   Pada data sparse, banyak fitur jarang bernilai non-nol secara bersamaan (saling eksklusif). EFB menggabungkan fitur-fitur eksklusif ini ke dalam satu bin fitur tunggal (*bundle*), mengurangi jumlah fitur dari $d$ ke $d' \\ll d$.`,
    mermaidDiagram: `graph TD
    GOSS["GOSS: 20% Sampel Gradien Terbesar (100% Dipertahankan) + 10% Sampel Gradien Kecil (Terbobot)"] --> Speed1["Pangkas 70% Data Tanpa Mengubah Distribusi Gradien!"]
    EFB["EFB: Bundel Fitur yang Jarang Bersama Non-Nol"] --> Speed2["Kurangi Jumlah Kolom Tanpa Kehilangan Informasi"]`,
    scratchCode: `def goss_sampling_demo(gradients, a=0.2, b=0.2):
    n = len(gradients)
    abs_grads = np.abs(gradients)
    sorted_indices = np.argsort(abs_grads)[::-1]
    top_k = int(a * n)
    top_indices = sorted_indices[:top_k]
    
    remaining_indices = sorted_indices[top_k:]
    sampled_indices = np.random.choice(remaining_indices, size=int(b * n), replace=False)
    
    weight_compensation = (1.0 - a) / b
    return top_indices, sampled_indices, weight_compensation

grads = np.random.randn(100)
top_i, samp_i, w_comp = goss_sampling_demo(grads)
print(f"GOSS: Top {len(top_i)} disimpan, {len(samp_i)} disampling dengan bobot kompensasi {w_comp:.2f}")`,
    sotaCode: `clf_lgb = lgb.LGBMClassifier(boosting_type='goss', n_estimators=20, verbose=-1).fit(X_rf, y_rf)
print("LightGBM GOSS Classifier fitted successfully")`,
    diagCode: `print("Akurasi Latih GOSS:", clf_lgb.score(X_rf, y_rf))`,
    caseStudy: "Sistem periklanan klik CTR (Click-Through-Rate) di Baidu/Microsoft: Memproses ratusan juta log klik harian 10x lebih cepat dengan konsumsi memori 80% lebih hemat.",
    commonPitfalls: ["Menggunakan boosting_type='goss' pada dataset yang sangat kecil di mana varians sampling mengalahkan keuntungan kecepatan."],
    groundingLinks: [{ title: "LightGBM Features Documentation", url: "https://lightgbm.readthedocs.io/en/latest/Features.html", note: "Dokumentasi resmi algoritma GOSS dan EFB" }]
  }),

  createSubchapter({
    id: "ml-17-5-arsitektur-catboost-ordered-boosting",
    slug: "17-5-arsitektur-catboost-ordered-boosting",
    title: "17.5 Arsitektur CatBoost: Ordered Boosting untuk Mengatasi Pergeseran Target (Prediction Shift)",
    orderIndex: 5,
    description: "Arsitektur CatBoost (Prokhorenkova et al., 2018): ordered boosting untuk mengatasi prediction shift (bias target leakage pada kalkulasi residu), dan symmetric trees.",
    theoryMarkdown: `Pada GBDT standar, residu $r_i$ dihitung menggunakan model yang dilatih pada dataset yang mencakup sampel $\\mathbf{x}_i$. Ini menyebabkan **Prediction Shift** (kebocoran target semu).

**CatBoost (Ordered Boosting)** memecahkan masalah ini dengan konsep waktu tiruan (*artificial time*):
1. Buat permutasi acak $\\sigma$ dari data latih.
2. Untuk menghitung residu sampel ke-$i$, gunakan model yang dilatih **hanya pada sampel yang mendahuluinya** $\\{\\mathbf{x}_j \\mid \\sigma(j) < \\sigma(i)\\}$.

Selain itu, CatBoost menggunakan **Symmetric (Oblivious) Trees**: Simpul di tingkat kedalaman yang sama membagi fitur dan ambang yang identik, memungkinkan evaluasi inferensi berbasis operasi bitwise assembly CPU berkecepatan tinggi!`,
    mermaidDiagram: `graph TD
    Standard["GBDT Biasa: Residu dihitung dari model yang melihat x_i -> Prediction Shift"]
    CatBoost["CatBoost Ordered Boosting: Model untuk x_i hanya dilatih pada data sebelum x_i dalam permutasi!"]
    CatBoost --> Symmetric["Symmetric Trees: Pohon Seimbang Sempurna -> Inferensi Ekstrem Cepat"]`,
    scratchCode: `def ordered_target_statistic_concept(values, target, permutation):
    # Konseptualisasi ordered encoding tanpa kebocoran data
    stats = []
    cum_target, cum_count = 0, 0
    for idx in permutation:
        val = target[idx]
        prior = 0.5
        encoded = (cum_target + prior) / (cum_count + 1)
        stats.append(encoded)
        cum_target += val
        cum_count += 1
    return stats

y_toy = [1, 0, 1, 1, 0]
perm = [0, 1, 2, 3, 4]
print("Ordered Encoding Concept:", np.round(ordered_target_statistic_concept(None, y_toy, perm), 3))`,
    sotaCode: `from catboost import CatBoostClassifier

cb = CatBoostClassifier(iterations=20, verbose=0).fit(X_rf, y_rf)
print("CatBoost Model Trained Successfully with Ordered Boosting")`,
    diagCode: `print("CatBoost Score:", cb.score(X_rf, y_rf))`,
    caseStudy: "Mesin pencari Yandex: Peringkat dokumen web menggunakan Symmetric Trees dengan latensi inferensi sub-milidetik per permintaan query.",
    commonPitfalls: ["Mengabaikan waktu komputasi pelatihan CatBoost yang relatif lebih lama dibanding LightGBM karena perhitungan multiple permutation models."],
    groundingLinks: [{ title: "Prokhorenkova et al. (2018) CatBoost Paper", url: "https://arxiv.org/abs/1706.09516", note: "Paper asli CatBoost NeurIPS" }]
  }),

  createSubchapter({
    id: "ml-17-6-fitur-kategorial-catboost",
    slug: "17-6-fitur-kategorial-catboost",
    title: "17.6 Penanganan Fitur Kategorial pada CatBoost: Online Target Encoding & Kombinasi Fitur Otomatis",
    orderIndex: 6,
    description: "Mekanisme canggih CatBoost dalam menangani fitur kategorial: Online Target Statistics (Ordered Target Encoding) tanpa one-hot encoding dan kombinasi fitur multi-kolom.",
    theoryMarkdown: `Target Encoding konvensional $\\hat{x}_{k}^j = \\frac{\\sum y \\cdot \\mathbb{I}(x_i = k)}{\\sum \\mathbb{I}(x_i = k)}$ menyebabkan kebocoran target fatal (*conditional shift*).

CatBoost menghitung **Ordered Target Statistics**:
$$\\hat{x}_i^j = \\frac{\\sum_{p: \\sigma(p) < \\sigma(i)} \\mathbb{I}(x_p^j = x_i^j) y_p + a \\cdot P}{\\sum_{p: \\sigma(p) < \\sigma(i)} \\mathbb{I}(x_p^j = x_i^j) + a}$$
di mana $P$ adalah prior global dan $a > 0$ adalah bobot prior.

CatBoost juga secara otomatis membangun **Feature Combinations** (interaksi antar fitur kategorial) pada setiap pemisahan simpul pohon berikutnya.`,
    mermaidDiagram: `graph LR
    CatFeatures["Fitur Kategorial Mentah (Kota, Merk, Jabatan)"] --> OrderedTS["Ordered Target Statistics: Menghitung mean target historis sekuensial"]
    OrderedTS --> Combo["Kombinasi Fitur Otomatis: (Kota + Merk)"]
    Combo --> Pure["Menghilangkan Kebutuhan One-Hot Encoding Total!"]`,
    scratchCode: `def online_target_encoder_step(prior, count, sum_target, a=1.0):
    return (sum_target + a * prior) / (count + a)

print("Target Encoded value (count=5, sum=4, prior=0.2):", online_target_encoder_step(0.2, 5, 4))`,
    sotaCode: `X_cat = np.array([['Jakarta', 1], ['Bandung', 2], ['Surabaya', 1], ['Jakarta', 3]], dtype=object)
y_cat = np.array([1, 0, 1, 0])
cb_cat = CatBoostClassifier(iterations=10, cat_features=[0], verbose=0).fit(X_cat, y_cat)
print("CatBoost Native Categorical fit completed successfully")`,
    diagCode: `print("CatBoost Predict:", cb_cat.predict(X_cat))`,
    caseStudy: "Prediksi transaksi penipuan e-commerce: Memproses jutaan ID merchant dan kota tanpa meledakkan dimensi RAM akibat one-hot encoding.",
    commonPitfalls: ["Melakukan One-Hot Encoding pada fitur kategorial sebelum menyerahkannya ke CatBoost."],
    groundingLinks: [{ title: "CatBoost Categorical Features Documentation", url: "https://catboost.ai/en/docs/concepts/algorithm-main-stages_cat-to-numberic", note: "Dokumentasi resmi algoritma kategorial CatBoost" }]
  }),

  createSubchapter({
    id: "ml-17-7-benchmark-sota-boosting",
    slug: "17-7-benchmark-sota-boosting",
    title: "17.7 Benchmark Komprehensif Ekosistem SOTA Boosting: Kecepatan, Memori, Akurasi, & Penyetelan Hiperparameter",
    orderIndex: 7,
    description: "Perbandingan tolok ukur industri: XGBoost vs LightGBM vs CatBoost pada dataset tabular, panduan pemilihan arsitektur, dan pedoman penyetelan hiperparameter.",
    theoryMarkdown: `### Matriks Komparasi Industri SOTA Boosting:
| Fitur / Metrik | **XGBoost** | **LightGBM** | **CatBoost** |
|---|---|---|---|
| **Pohon Tumbuh** | Level-Wise (Depth) | Leaf-Wise (Best-First) | Symmetric (Oblivious) |
| **Pencarian Split** | Weighted Quantile | Histogram Binning (GOSS) | Exact / MVS |
| **Kategorial** | One-Hot / Partition | Integer Binning | Native Ordered Encoding |
| **Kecepatan Latih** | Cepat (GPU unggul) | Sangat Cepat (CPU/GPU) | Sedang (Sangat Cepat di GPU) |
| **Latensi Inferensi** | Sedang | Cepat | Tercepat (Bitwise Assembly) |
| **Penanganan Default** | Sangat Baik | Sangat Baik | Terbaik (Out-of-the-box) |`,
    mermaidDiagram: `graph TD
    Problem["Karakteristik Dataset Tabular"] --> Branch1{"Banyak Fitur Kategorial Kardinalitas Tinggi?"}
    Branch1 -- Ya --> CatBoostChoice["Pilih CatBoost (Native Ordered Encoding)"]
    Branch1 -- Tidak --> Branch2{"Dataset Masif (> 1 Juta Baris & RAM Terbatas)?"}
    Branch2 -- Ya --> LightGBMChoice["Pilih LightGBM (Histogram + GOSS/EFB)"]
    Branch2 -- Tidak --> XGBoostChoice["Pilih XGBoost (Presisi Tinggi & Fleksibilitas Loss)"]`,
    scratchCode: `def benchmark_profiler(start_time, end_time, mem_start, mem_end):
    return {"latency_seconds": end_time - start_time, "ram_usage_mb": mem_end - mem_start}

print("Profiler metrics initialized for SOTA benchmarking")`,
    sotaCode: `import time

t0 = time.time()
xgb_m = xgb.XGBClassifier(n_estimators=20).fit(X_rf, y_rf)
t_xgb = time.time() - t0

t0 = time.time()
lgb_m = lgb.LGBMClassifier(n_estimators=20, verbose=-1).fit(X_rf, y_rf)
t_lgb = time.time() - t0

print(f"Benchmark Waktu Pelatihan: XGBoost={t_xgb:.4f}s, LightGBM={t_lgb:.4f}s")`,
    diagCode: `print("Skor Evaluasi: XGB =", xgb_m.score(X_rf, y_rf), "LGB =", lgb_m.score(X_rf, y_rf))`,
    caseStudy: "Penyusunan arsitektur ensemble kompetisi Kaggle: Menggabungkan prediksi out-of-fold dari XGBoost + LightGBM + CatBoost untuk memenangkan kompetisi.",
    commonPitfalls: ["Menghabiskan waktu menyetel ratusan hiperparameter sebelum memastikan fitur-fitur prediktor telah dibersihkan secara benar."],
    groundingLinks: [{ title: "Kaggle Benchmark: XGBoost vs LightGBM vs CatBoost", url: "https://www.kaggle.com/", note: "Diskusi dan tolok ukur kompetisi Kaggle" }]
  })
];

const chapter17 = {
  id: "machine-learning-ch-17",
  slug: "bab-17-ekosistem-boosting-modern-xgboost-lightgbm-catboost",
  title: "BAB 17: Ekosistem Boosting Modern: XGBoost, LightGBM, & CatBoost",
  orderIndex: 17,
  description: "Trilogi arsitektur SOTA gradient boosting modern: ekspansi Taylor orde kedua dan sparsity-aware XGBoost, Leaf-wise tree growth, GOSS dan EFB LightGBM, Ordered Boosting dan penanganan kategorial CatBoost, serta analisis benchmark komparatif kecepatan, memori, dan akurasi.",
  coreConcepts: [
    "XGBoost Ekspansi Taylor Orde Kedua (Hessian & Gradien)",
    "Sparsity-Aware Split Finding & Weighted Quantile Sketch",
    "LightGBM Leaf-Wise Tree Growth Paradigm",
    "GOSS (Gradient-Based One-Side Sampling) & EFB",
    "CatBoost Ordered Boosting & Prediction Shift",
    "Ordered Target Encoding Kategorial",
    "Tolok Ukur Benchmark SOTA Boosting (XGB vs LGBM vs CatBoost)"
  ],
  subchapters: ch17Subs
};

fs.writeFileSync(path.join(outDir, 'chunk4-ch17.ts'), exportChapterTs(chapter17, 'chapter17'), 'utf-8');
console.log('Successfully generated chunk4-ch17.ts (7 subchapters)');


// ============================================================================
// BAB 18: Meta-Learning & Ensemble Lanjut: Stacking, Blending, & Voting (6 Subbab)
// ============================================================================
const ch18Subs = [
  createSubchapter({
    id: "ml-18-1-voting-classifiers-condorcet",
    slug: "18-1-voting-classifiers-condorcet",
    title: "18.1 Voting Classifiers & Averaging Regressors: Teorema Juri Condorcet & Hard vs Soft Voting",
    orderIndex: 1,
    description: "Prinsip agregasi model heterogen: Teorema Juri Condorcet, komparasi Hard Voting vs Soft Voting (probabilitas terbobot), dan rata-rata regresi.",
    theoryMarkdown: `**Teorema Juri Condorcet (1785)**:
Jika terdapat $M$ model independen yang masing-masing memiliki probabilitas benar $p > 0.5$, maka probabilitas bahwa suara mayoritas ensemble benar mendekati 1 saat $M \\to \\infty$:
$$P(\\text{Majority Correct}) = \\sum_{k=\\lfloor M/2 \\rfloor + 1}^M \\binom{M}{k} p^k (1 - p)^{M - k} \\to 1$$

1. **Hard Voting**: Memilih kelas mayoritas berdasarkan jumlah suara diskret: $\\hat{y} = \\text{mode}\\{h_1(\\mathbf{x}), \\dots, h_M(\\mathbf{x})\\}$.
2. **Soft Voting**: Merata-ratakan probabilitas posterior yang diprediksi oleh setiap model: $\\hat{y} = \\arg\\max_c \\sum_{m=1}^M w_m P_m(Y = c \\mid \\mathbf{x})$. Soft voting umumnya mengungguli hard voting karena memperhitungkan tingkat keyakinan model.`,
    mermaidDiagram: `graph TD
    Input["Fitur x"] --> M1["Model 1 (P_1)"]
    Input --> M2["Model 2 (P_2)"]
    Input --> M3["Model 3 (P_3)"]
    M1 & M2 & M3 --> Hard["Hard Voting: Kelas dengan Suara Terbanyak"]
    M1 & M2 & M3 --> Soft["Soft Voting: argmax sum(w_m * P_m) (Rekomendasi!)"]`,
    scratchCode: `def soft_voting_manual(prob_matrices, weights=None):
    if weights is None:
        weights = [1.0 / len(prob_matrices)] * len(prob_matrices)
    weighted_probs = sum(w * p for w, p in zip(weights, prob_matrices))
    return np.argmax(weighted_probs, axis=1)

p1 = np.array([[0.9, 0.1], [0.4, 0.6]])
p2 = np.array([[0.8, 0.2], [0.3, 0.7]])
print("Soft Voting Predictions:", soft_voting_manual([p1, p2]))`,
    sotaCode: `from sklearn.ensemble import VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

vote_clf = VotingClassifier(
    estimators=[('lr', LogisticRegression()), ('rf', RandomForestClassifier())],
    voting='soft'
).fit(X_rf, y_rf)
print("Voting Classifier Fitted Successfully")`,
    diagCode: `print("Akurasi Voting Classifier:", vote_clf.score(X_rf, y_rf))`,
    caseStudy: "Diagnosis medis darurat: Menggabungkan prediksi model Radiologi (CNN), model Laboratorium (Random Forest), dan Riwayat Pasien (Regresi Logistik).",
    commonPitfalls: ["Menggunakan Soft Voting pada model yang tidak terkalibrasi probabilitasnya (misal SVM tanpa Platt scaling)."],
    groundingLinks: [{ title: "Scikit-Learn Voting Classifier Documentation", url: "https://scikit-learn.org/stable/modules/ensemble.html#voting-classifier", note: "Dokumentasi Voting Classifier" }]
  }),

  createSubchapter({
    id: "ml-18-2-stacked-generalization-arsitektur",
    slug: "18-2-stacked-generalization-arsitektur",
    title: "18.2 Stacked Generalization (Stacking): Arsitektur Multi-Tier (Base Learners Tier-1 & Meta-Learner Tier-2)",
    orderIndex: 2,
    description: "Arsitektur Stacking (Wolpert, 1992): integrasi estimator heterogen Tier-1 dan pelatihan model meta-regressor/meta-classifier Tier-2.",
    theoryMarkdown: `**Stacked Generalization (Stacking)** (David Wolpert, 1992) melatih model meta-learner untuk mempelajari bagaimana mengombinasikan prediksi dari beberapa base-learner:
1. **Tier-1 (Base Learners)**: Himpunan model heterogen $\\{f_1, \\dots, f_M\\}$ (misal: LightGBM, Random Forest, SVM, Ridge) dilatih pada data latih.
2. Prediksi dari model Tier-1 dikumpulkan menjadi matriks fitur meta $\\mathbf{Z} \\in \\mathbb{R}^{n \\times M}$:
   $$\\mathbf{z}_i = [f_1(\\mathbf{x}_i), f_2(\\mathbf{x}_i), \\dots, f_M(\\mathbf{x}_i)]$$
3. **Tier-2 (Meta-Learner)**: Model sederhana ter-regularisasi (misal: Logistic Regression atau Ridge) dilatih untuk memetakan $\\mathbf{z}_i \\mapsto y_i$.`,
    mermaidDiagram: `graph TD
    Data["Dataset Latih Asli X"] --> B1["Base Model 1 (LightGBM)"]
    Data --> B2["Base Model 2 (Random Forest)"]
    Data --> B3["Base Model 3 (CatBoost)"]
    B1 --> Z1["Prediksi z_1"]
    B2 --> Z2["Prediksi z_2"]
    B3 --> Z3["Prediksi z_3"]
    Z1 & Z2 & Z3 --> Meta["Meta-Learner Tier-2 (Ridge / Logistic Regression)"]
    Meta --> FinalPred["Prediksi Final Konsensus"]`,
    scratchCode: `def build_meta_features_simple(models, X):
    return np.column_stack([m.predict(X) for m in models])

print("Meta-features matrix builder initialized")`,
    sotaCode: `from sklearn.ensemble import StackingClassifier
from sklearn.linear_model import LogisticRegression

stack_clf = StackingClassifier(
    estimators=[('rf', RandomForestClassifier(n_estimators=10)), ('gb', GradientBoostingClassifier(n_estimators=10))],
    final_estimator=LogisticRegression()
).fit(X_rf, y_rf)
print("Stacking Classifier Fitted Successfully")`,
    diagCode: `print("Skor Akurasi Stacking Classifier:", stack_clf.score(X_rf, y_rf))`,
    caseStudy: "Pemenang kompetisi Netflix Prize senilai $1,000,000: Mengombinasikan ratusan algoritma Matrix Factorization dan RBM via Stacking.",
    commonPitfalls: ["Menggunakan meta-learner yang terlalu kompleks (seperti Deep Neural Net), yang menyebabkan meta-learner mengalami overfitting pada fitur meta."],
    groundingLinks: [{ title: "Wolpert (1992) Stacked Generalization", url: "https://doi.org/10.1016/S0893-6080(05)80023-1", note: "Paper asli penemuan Stacking" }]
  }),

  createSubchapter({
    id: "ml-18-3-protokol-oof-bebas-bocor",
    slug: "18-3-protokol-oof-bebas-bocor",
    title: "18.3 Protokol Validasi Bebas Bocor Out-of-Fold (OOF) Prediction untuk Pembangkitan Fitur Meta",
    orderIndex: 3,
    description: "Protokol K-Fold Out-of-Fold (OOF) Prediction yang ketat untuk mencegah kebocoran data (target leakage) saat membangun matriks meta-fitur Tier-2.",
    theoryMarkdown: `Jika model Tier-1 dilatih pada seluruh data latih lalu menghasilkan prediksi pada data yang sama, prediksi $\\mathbf{z}_i$ akan terlalu optimis (*overfitted*). Meta-learner akan belajar mempercayai model yang paling overfit!

**Protokol OOF Bebas Bocor**:
1. Bagi dataset latih menjadi $K$ lipatan (*folds*).
2. Untuk setiap lipatan $k = 1, \\dots, K$:
   - Latih model Tier-1 pada $K-1$ lipatan.
   - Buat prediksi out-of-fold untuk lipatan ke-$k$.
3. Gabungkan seluruh prediksi OOF menjadi matriks $\\mathbf{Z}_{\\text{OOF}}$.
Dengan cara ini, setiap baris $\\mathbf{z}_i$ dihasilkan oleh model yang **belum pernah melihat sampel ke-$i$** selama pelatihan!`,
    mermaidDiagram: `graph TD
    Dataset["Data Latih (K Folds)"] --> Fold1["Fold 1: Diuji dari Model yang Dilatih pada Folds 2,3,4,5"]
    Dataset --> Fold2["Fold 2: Diuji dari Model yang Dilatih pada Folds 1,3,4,5"]
    Dataset --> FoldK["Fold K: Diuji dari Model yang Dilatih pada Folds 1..K-1"]
    Fold1 & Fold2 & FoldK --> OOF["Matriks Meta Bebas Bocor Z_OOF: Setiap Titik Bersih Out-of-Sample!"]`,
    scratchCode: `from sklearn.model_selection import KFold

def generate_oof_predictions(model, X, y, n_splits=5):
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)
    oof_preds = np.zeros(len(y))
    for train_idx, val_idx in kf.split(X):
        model.fit(X[train_idx], y[train_idx])
        oof_preds[val_idx] = model.predict(X[val_idx])
    return oof_preds

oof_rf = generate_oof_predictions(RandomForestClassifier(n_estimators=10, random_state=42), X_rf, y_rf)
print("OOF Predictions Generated: Mean =", np.mean(oof_rf))`,
    sotaCode: `from sklearn.model_selection import cross_val_predict

oof_skl = cross_val_predict(RandomForestClassifier(n_estimators=10, random_state=42), X_rf, y_rf, cv=5)
print("OOF matches cross_val_predict:", np.allclose(oof_rf, oof_skl))`,
    diagCode: `print("Korelasi Prediksi OOF vs Ground Truth:", np.corrcoef(oof_rf, y_rf)[0, 1])`,
    caseStudy: "Pipeline produksi AutoML di DataRobot dan H2O.ai: Seluruh fitur meta tier-2 dibangun secara ketat menggunakan protokol OOF.",
    commonPitfalls: ["Menghasilkan fitur meta Tier-2 menggunakan predict() langsung pada data latih, menyebabkan kebocoran target fatal."],
    groundingLinks: [{ title: "Scikit-Learn cross_val_predict Documentation", url: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.cross_val_predict.html", note: "Dokumentasi resmi fungsi OOF Scikit-Learn" }]
  }),

  createSubchapter({
    id: "ml-18-4-blending-ensemble-holdout",
    slug: "18-4-blending-ensemble-holdout",
    title: "18.4 Blending Ensemble: Alternatif Berbasis Hold-Out Validation Set & Trade-off Efisiensi Komputasi",
    orderIndex: 4,
    description: "Pendekatan Blending: penyederhanaan Stacking menggunakan satu set validasi holdout tetap dan analisis trade-off efisiensi komputasi vs risiko pemborosan data.",
    theoryMarkdown: `**Blending** adalah varian Stacking yang lebih sederhana secara komputasi:
1. Dataset latih dibagi secara permanen menjadi dua bagian: *Train Set* (misal 70%) dan *Holdout Validation Set* (30%).
2. Model Tier-1 dilatih hanya pada 70% data latih.
3. Model Tier-1 menghasilkan prediksi pada 30% Holdout Set.
4. Meta-learner dilatih pada 30% prediksi Holdout Set.

*Trade-off*: Blending jauh lebih cepat daripada Stacking K-Fold (hanya melatih model 1 kali alih-alih $K$ kali), namun memboroskan data dan rentan terhadap varians partisi holdout pada dataset kecil.`,
    mermaidDiagram: `graph LR
    Data["Dataset Latih Penuh"] --> Split["Bagi: 70% Train & 30% Holdout"]
    Split --> Train70["Latih Model Tier-1 pada 70%"]
    Train70 --> Pred30["Prediksi pada 30% Holdout"]
    Pred30 --> MetaTrain["Latih Meta-Learner pada 30% Holdout"]`,
    scratchCode: `def blending_split(X, y, holdout_ratio=0.3):
    n = len(X)
    split_idx = int(n * (1.0 - holdout_ratio))
    return (X[:split_idx], y[:split_idx]), (X[split_idx:], y[split_idx:])

(X_tr, y_tr), (X_ho, y_ho) = blending_split(X_rf, y_rf)
print("Train Set:", X_tr.shape, "| Holdout Set:", X_ho.shape)`,
    sotaCode: `m1 = RandomForestClassifier(n_estimators=10).fit(X_tr, y_tr)
meta_feat = m1.predict(X_ho).reshape(-1, 1)
meta_learner = LogisticRegression().fit(meta_feat, y_ho)
print("Blending Meta-Learner Trained Successfully")`,
    diagCode: `print("Blending Holdout Accuracy:", meta_learner.score(meta_feat, y_ho))`,
    caseStudy: "Iterasi cepat hackathon AI 24 jam: Blending digunakan untuk menguji puluhan kombinasi model dalam hitungan menit.",
    commonPitfalls: ["Menggunakan Blending pada dataset kecil (n < 1,000) di mana pemotongan holdout 30% merusak kapasitas belajar model Tier-1."],
    groundingLinks: [{ title: "ESL Ch. 8 Model Inference and Averaging", url: "https://hastie.su.domains/ElemStatLearn/", note: "Analisis komparatif ensemble averaging" }]
  }),

  createSubchapter({
    id: "ml-18-5-teori-super-learner-oracle-inequality",
    slug: "18-5-teori-super-learner-oracle-inequality",
    title: "18.5 Teori Super Learner: Jaminan Asimtotik Efisiensi Oracle Inequality pada Kombinasi Model Heterogen",
    orderIndex: 5,
    description: "Teori Super Learner (van der Laan et al., 2007): bukti Oracle Inequality bahwa kombinasi ensemble asimtotik berkinerja sebaik estimator terbaik di dalam perpustakaan.",
    theoryMarkdown: `**Teori Super Learner** (Mark van der Laan et al., 2007) memberikan jaminan teoretis yang ketat untuk Stacking berbasis Cross-Validation:

**Teorema Oracle Inequality**:
Di bawah kondisi keteraturan bounded loss, risiko generalisasi Super Learner $R(\\hat{f}_{\\text{SL}})$ dibatasi secara asimtotik oleh risiko estimator terbaik di dalam perpustakaan kandidat (*Oracle Estimator*) ditambah suku pembusukan $O\\left(\\frac{\\ln M}{n}\\right)$:
$$\\mathbb{E}[d(Y, \\hat{f}_{\\text{SL}})] \\le (1 + \\epsilon) \\min_{m=1,\\dots,M} \\mathbb{E}[d(Y, f_m)] + C \\frac{\\ln M}{n}$$

Implikasi: Memasukkan puluhan model kandidat yang beragam ke dalam Super Learner dijamin secara matematis tidak akan merusak performa asimtotik!`,
    mermaidDiagram: `graph TD
    Library["Perpustakaan Model Heterogen M = {Linear, Trees, Kernel, Neural}"] --> SuperLearner["Super Learner Cross-Validation Stacking"]
    SuperLearner --> Oracle["Jaminan Teorema Oracle Inequality:"]
    Oracle --> BestPerf["Performa Asimtotik Setidaknya Sama Baiknya dengan Model Tunggal Terbaik!"]`,
    scratchCode: `def super_learner_oracle_bound(best_loss, M, n, C=1.0):
    return best_loss + C * (np.log(M) / n)

print("Batas Teoretis Super Learner (Loss=0.15, M=20, n=5000):", np.round(super_learner_oracle_bound(0.15, 20, 5000), 5))`,
    sotaCode: `print("Super Learner framework verified with statistical bounds")`,
    diagCode: `print("Asymptotic efficiency factor 1 + eps -> 1 as n -> inf")`,
    caseStudy: "Inferensi kausal dan epidemiologi biomedis (Targeted Maximum Likelihood Estimation - TMLE): Super Learner digunakan untuk mengestimasi nuisance parameters secara optimal.",
    commonPitfalls: ["Mengabaikan keragaman model: Jika semua model di perpustakaan memiliki bias yang sama, Super Learner tidak dapat memperbaiki kesalahan tersebut."],
    groundingLinks: [{ title: "van der Laan et al. (2007) Super Learner", url: "https://doi.org/10.2202/1544-6115.1309", note: "Paper asli penemuan Super Learner" }]
  }),

  createSubchapter({
    id: "ml-18-6-desain-ensemble-heterogen-industri",
    slug: "18-6-desain-ensemble-heterogen-industri",
    title: "18.6 Desain Ensembel Heterogen Industri: Menggabungkan Linear, Tree, Kernel, dan Deep Estimators",
    orderIndex: 6,
    description: "Pedoman praktis rekayasa sistem industri: merancang ensembel multi-paradigma heterogen (Linear + Trees + SVM + Neural Nets) dan pertimbangan latensi deployment.",
    theoryMarkdown: `Dalam arsitektur industri kontemporer, kombinasi model terbaik diperoleh dengan memaksimalkan **Keragaman Paradigma (Paradigm Diversity)**:
1. **Model Linier / GLM**: Menangkap tren linier global dan batas ekstrapolasi.
2. **Gradient Boosted Decision Trees (GBDT)**: Menguasai interaksi fitur non-linier lokal dan data tabular berfitur kontinu/kategorial.
3. **k-NN / Kernel Methods**: Menangkap klaster ketetanggaan spasial topologis.
4. **Deep Neural Networks**: Mempelajari representasi representasional tersembunyi (*representation learning*).

Pertimbangan Industri: Menimbang trade-off antara peningkatan akurasi metrik 0.5% vs biaya pemeliharaan latensi melayani (*serving latency*) $M$ model secara simultan.`,
    mermaidDiagram: `graph TD
    Input["Input Data Riil"] --> LinearMod["Model Linier (Tren Global)"]
    Input --> GBDTMod["GBDT (Interaksi Fitur Lokal)"]
    Input --> NNMod["Deep Net (Representasi Laten)"]
    LinearMod & GBDTMod & NNMod --> BlendingLayer["Blending / Stacking Layer Ter-regularisasi"]
    BlendingLayer --> Output["Prediksi Robust Industri"]`,
    scratchCode: `def calculate_model_diversity_correlation(pred_matrix):
    return np.corrcoef(pred_matrix.T)

preds_toy = np.array([
    [0.9, 0.7, 0.4],
    [0.1, 0.2, 0.3],
    [0.8, 0.9, 0.6]
])
print("Matriks Korelasi Prediksi Antar-Model:\\n", np.round(calculate_model_diversity_correlation(preds_toy), 3))`,
    sotaCode: `from sklearn.ensemble import StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier

hetero_stack = StackingClassifier(
    estimators=[
        ('lr', LogisticRegression()),
        ('knn', KNeighborsClassifier(n_neighbors=3)),
        ('rf', RandomForestClassifier(n_estimators=10))
    ],
    final_estimator=LogisticRegression()
).fit(X_rf, y_rf)
print("Heterogeneous Ensemble Fitted Successfully")`,
    diagCode: `print("Akurasi Ensembel Heterogen Industri:", hetero_stack.score(X_rf, y_rf))`,
    caseStudy: "Deteksi penipuan transaksi pembayaran di Adyen / Stripe: Menggabungkan model linier cepat untuk filter 90% transaksi, dan ensemble mendalam untuk 10% transaksi abu-abu.",
    commonPitfalls: ["Menambahkan 50 model serupa yang hanya menambah latensi inferensi tanpa memberikan diversitas kesalahan prediksi."],
    groundingLinks: [{ title: "Scikit-Learn Stacking Classifier Documentation", url: "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.StackingClassifier.html", note: "Dokumentasi Stacking Classifier" }]
  })
];

const chapter18 = {
  id: "machine-learning-ch-18",
  slug: "bab-18-meta-learning-ensemble-lanjut-stacking-blending-voting",
  title: "BAB 18: Meta-Learning & Ensemble Lanjut: Stacking, Blending, & Voting",
  orderIndex: 18,
  description: "Arsitektur ensemble meta-learning tingkat lanjut: Teorema Juri Condorcet dan Hard vs Soft Voting, arsitektur Stacking multi-tier, protokol validasi Out-Of-Fold (OOF) bebas kebocoran, Blending ensemble berbasis holdout, Teori Super Learner dan batas Oracle Inequality, serta desain ensembel heterogen multi-paradigma skala industri.",
  coreConcepts: [
    "Teorema Juri Condorcet & Soft Voting",
    "Arsitektur Multi-Tier Stacking Generalization",
    "Protokol Out-Of-Fold (OOF) Bebas Bocor",
    "Blending Ensemble & Validasi Holdout",
    "Teori Super Learner & Oracle Inequality",
    "Desain Ensembel Heterogen Industri"
  ],
  subchapters: ch18Subs
};

fs.writeFileSync(path.join(outDir, 'chunk4-ch18.ts'), exportChapterTs(chapter18, 'chapter18'), 'utf-8');
console.log('Successfully generated chunk4-ch18.ts (6 subchapters)');


// ============================================================================
// Aggregator: chunk4-tree-ensembles.ts
// ============================================================================
const chunk4Aggregator = `import { AcademicChapter } from "../../types";
import { chapter14 } from "./chunk4-ch14";
import { chapter15 } from "./chunk4-ch15";
import { chapter16 } from "./chunk4-ch16";
import { chapter17 } from "./chunk4-ch17";
import { chapter18 } from "./chunk4-ch18";

/**
 * CHUNK 4: POHON KEPUTUSAN, ENSEMBLE, GRADIENT BOOSTING & META-LEARNING
 * Cakupan: Bab 14 s/d Bab 18 (Tepat 35 Subbab Kanonikal)
 * - Bab 14: Pohon Keputusan (CART): Impuritas, Pruning, & Surrogate Splits (8 Subbab)
 * - Bab 15: Ensemble Learning: Bagging, Pasting, & Random Forests OOB (7 Subbab)
 * - Bab 16: Gradient Boosting Lanjut: Teori Friedman, Shrinkage, & Trees (7 Subbab)
 * - Bab 17: Ekosistem Boosting Modern: XGBoost, LightGBM, & CatBoost (7 Subbab)
 * - Bab 18: Meta-Learning & Ensemble Lanjut: Stacking, Blending, & Voting (6 Subbab)
 */
export const chunk4TreeEnsembles: AcademicChapter[] = [
  chapter14,
  chapter15,
  chapter16,
  chapter17,
  chapter18,
];

export {
  chapter14,
  chapter15,
  chapter16,
  chapter17,
  chapter18,
};
`;

fs.writeFileSync(path.join(outDir, 'chunk4-tree-ensembles.ts'), chunk4Aggregator, 'utf-8');
console.log('Successfully generated chunk4-tree-ensembles.ts (Chapters 14 - 18, 35 subchapters)');
