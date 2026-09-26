const fs = require('fs');
const path = require('path');
const { createSubchapter, exportChapterTs } = require('./curriculum-builder-helper');

const outDir = path.join(__dirname, '../src/lib/curriculum/topics/machine-learning');

// ============================================================================
// BAB 14: Pohon Keputusan (CART): Impuritas, Pruning, & Surrogate Splits (8 Subbab)
// ============================================================================
const ch14Subs = [
  createSubchapter({
    id: "ml-14-1-topologi-pohon-biner-partisi-ortogonal",
    slug: "14-1-topologi-pohon-biner-partisi-ortogonal",
    title: "14.1 Topologi Pohon Biner & Partisi Ruang Fitur Rekursif Sumbu Ortogonal (Orthogonal Hyperplanes)",
    orderIndex: 1,
    description: "Topologi dasar pohon keputusan biner CART: partisi ruang fitur rekursif sumbu ortogonal membentuk blok hiperkubus.",
    theoryMarkdown: `Pohon keputusan CART mempartisi ruang fitur $\\mathbb{R}^d$ secara rekursif menjadi himpunan wilayah hiper-persegi panjang (*hyper-rectangles*) yang saling lepas $\\{R_1, \\dots, R_M\\}$.
Setiap simpul internal (*internal node*) membagi ruang menggunakan hyperplane ortogonal sumbu:
$$X_j \\le t \\quad \\text{vs} \\quad X_j > t$$
Prediksi model adalah nilai konstan di dalam setiap wilayah daun $R_m$: $\\hat{y} = c_m$.`,
    mermaidDiagram: `graph TD
    Root["Simpul Akar: X_1 <= 3.5?"] --> Left["Kiri: X_2 <= 1.2?"]
    Root --> Right["Kanan: Daun R_3 (y=10.5)"]
    Left --> L1["Daun R_1 (y=2.1)"]
    Left --> L2["Daun R_2 (y=5.8)"]`,
    scratchCode: `class TreeNode:
    def __init__(self, feature=None, threshold=None, left=None, right=None, value=None):
        self.feature = feature
        self.threshold = threshold
        self.left = left
        self.right = right
        self.value = value

    def is_leaf(self):
        return self.value is not None

node = TreeNode(feature=0, threshold=2.5, left=TreeNode(value=0), right=TreeNode(value=1))
print("Pohon Biner Terbentuk: Leaf Value Kanan =", node.right.value)`,
    sotaCode: `from sklearn.tree import DecisionTreeClassifier

dt = DecisionTreeClassifier(max_depth=2).fit([[1, 2], [3, 4], [5, 6]], [0, 1, 1])
print("Kedalaman Pohon:", dt.get_depth())`,
    diagCode: `print("Jumlah Simpul Daun:", dt.get_n_leaves())`,
    caseStudy: "Penyusunan aturan triage IGD rumah sakit: Dokter mengikuti pohon keputusan terstruktur (Suhu > 38.5C & O2 < 92% -> Ruang Resusitasi).",
    commonPitfalls: ["Pohon CART hanya dapat membuat pemisah horizontal/vertikal (ortogonal), sehingga sangat boros simpul saat menghadapi batas diagonal."],
    groundingLinks: [{ title: "Breiman et al. (1984) CART Book", url: "https://www.statlearning.com/", note: "Buku klasik pendirian algoritma CART" }]
  }),

  createSubchapter({
    id: "ml-14-2-kriteria-impuritas-klasifikasi",
    slug: "14-2-kriteria-impuritas-klasifikasi",
    title: "14.2 Kriteria Impuritas Klasifikasi: Penurunan Matematis Gini Impurity, Entropi Informasi, & Misclassification Error",
    orderIndex: 2,
    description: "Perbandingan matematis metrik impuritas klasifikasi: Gini Impurity, Entropi Shannon / Information Gain, dan Misclassification Error.",
    theoryMarkdown: `Misalkan $p_{mk}$ adalah proporsi sampel kelas $k$ di simpul $m$:
1. **Misclassification Error**: $I_E(m) = 1 - \\max_k(p_{mk})$
2. **Gini Impurity (CART Standar)**:
   $$I_G(m) = \\sum_{k=1}^K p_{mk} (1 - p_{mk}) = 1 - \\sum_{k=1}^K p_{mk}^2$$
3. **Entropi Informasi (C4.5 / ID3)**:
   $$I_H(m) = -\\sum_{k=1}^K p_{mk} \\log_2(p_{mk})$$
Gini dan Entropi bersifat diferensiabel dan sangat sensitif terhadap perubahan probabilitas kelas di simpul murni.`,
    mermaidDiagram: `graph LR
    Node["Distribusi Probabilitas Kelas [p_1, ..., p_K]"] --> Gini["Gini: 1 - sum p_k^2 (Efisien tanpa logaritma)"]
    Node --> Entropy["Entropi: -sum p_k log_2(p_k) (Teori Informasi)"]
    Node --> Error["Misclassification Error: 1 - max p_k"]`,
    scratchCode: `def gini_impurity(y: np.ndarray) -> float:
    _, counts = np.unique(y, return_counts=True)
    probs = counts / len(y)
    return 1.0 - np.sum(probs**2)

def entropy_shannon(y: np.ndarray) -> float:
    _, counts = np.unique(y, return_counts=True)
    probs = counts / len(y)
    return -np.sum(probs * np.log2(probs + 1e-12))

y_demo = np.array([0, 0, 0, 1, 1])
print("Gini Impurity :", np.round(gini_impurity(y_demo), 4))
print("Entropi       :", np.round(entropy_shannon(y_demo), 4))`,
    sotaCode: `from sklearn.tree import DecisionTreeClassifier

dt_gini = DecisionTreeClassifier(criterion='gini').fit([[0], [1], [2]], [0, 0, 1])
dt_ent = DecisionTreeClassifier(criterion='entropy').fit([[0], [1], [2]], [0, 0, 1])
print("Gini vs Entropy criteria loaded successfully")`,
    diagCode: `print("Gini node 0:", dt_gini.tree_.impurity[0])`,
    caseStudy: "Penyaringan transaksi mencurigakan di bank: Memaksimalkan Information Gain untuk memilih fitur pemisah terbaik.",
    commonPitfalls: ["Mengira Gini dan Entropi menghasilkan pohon yang sangat berbeda; dalam 98% kasus praktis, kedua kriteria menghasilkan akurasi yang identik."],
    groundingLinks: [{ title: "Scikit-Learn Decision Trees Mathematical Formulation", url: "https://scikit-learn.org/stable/modules/tree.html#mathematical-formulation", note: "Dokumentasi formulasi matematika CART" }]
  }),

  createSubchapter({
    id: "ml-14-3-kriteria-pembagian-regresi",
    slug: "14-3-kriteria-pembagian-regresi",
    title: "14.3 Kriteria Pembagian Regresi: Reduksi Varians (MSE), Mean Absolute Deviation (MAE), & Kriteria Poisson",
    orderIndex: 3,
    description: "Kriteria pembagian simpul pada Decision Tree Regressor: minimisasi Mean Squared Error (reduksi varians), Median/MAE, dan deviance Poisson.",
    theoryMarkdown: `Pada regresi, nilai prediksi pada simpul daun $R_m$ adalah rata-rata target $\\bar{y}_m = \\frac{1}{N_m} \\sum_{i \\in R_m} y_i$.

Kriteria pembagian **Reduksi Varians (MSE)**:
$$I_{\\text{MSE}}(m) = \\frac{1}{N_m} \\sum_{i \\in R_m} (y_i - \\bar{y}_m)^2$$
Pemisahan $(j, t)$ dipilih untuk memaksimalkan penurunan varians:
$$\\Delta I = I(m) - \\left( \\frac{N_L}{N_m} I(L) + \\frac{N_R}{N_m} I(R) \\right)$$`,
    mermaidDiagram: `graph TD
    Parent["Simpul Induk: Varians MSE Induk"] --> Split["Bagi Data menjadi Kiri (y_L) & Kanan (y_R)"]
    Split --> VarianceDrop["Hitung Penurunan Varians: Var(Induk) - [N_L/N Var(L) + N_R/N Var(R)]"]
    VarianceDrop --> Maximize["Pilih (Fitur j, Ambang t) yang Memaksimalkan Penurunan Varians"]`,
    scratchCode: `def variance_reduction_split(y_parent, y_left, y_right):
    n = len(y_parent)
    var_parent = np.var(y_parent)
    var_split = (len(y_left) / n) * np.var(y_left) + (len(y_right) / n) * np.var(y_right)
    return var_parent - var_split

y_p = np.array([1.0, 2.0, 10.0, 11.0])
print("Reduksi Varians:", variance_reduction_split(y_p, [1.0, 2.0], [10.0, 11.0]))`,
    sotaCode: `from sklearn.tree import DecisionTreeRegressor

dtr = DecisionTreeRegressor(criterion='squared_error', max_depth=2)
dtr.fit([[1], [2], [3], [4]], y_p)
print("DecisionTreeRegressor MSE Split Score:", dtr.score([[1], [2], [3], [4]], y_p))`,
    diagCode: `print("Nilai Daun Terprediksi:", dtr.predict([[1.5], [3.5]]))`,
    caseStudy: "Prediksi durasi sewa mobil: Regresi CART membagi kelompok pelanggan berdasarkan usia dan tipe kendaraan.",
    commonPitfalls: ["Menggunakan kriteria squared_error saat dataset memiliki outlier ekstrem; gunakan criterion='absolute_error' yang berbasis median."],
    groundingLinks: [{ title: "Scikit-Learn DecisionTreeRegressor Documentation", url: "https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html", note: "Dokumentasi pohon regresi" }]
  }),

  createSubchapter({
    id: "ml-14-4-algoritma-greedy-split-finding",
    slug: "14-4-algoritma-greedy-split-finding",
    title: "14.4 Algoritma Greedy Split-Finding pada Fitur Kontinu & Kategorial: Binning Histogram & Nilai Ambang Optimal",
    orderIndex: 4,
    description: "Mekanisme pencarian ambang pemisah terbaik secara greedy: sorting kontinu O(n log n), binning histogram O(B), dan partisi subset kategorial 2^(K-1).",
    theoryMarkdown: `Untuk fitur kontinu dengan $n$ sampel, algoritma standar menyortir nilai fitur dalam waktu $O(n \\log n)$ dan mengevaluasi $n-1$ ambang batas potensial $t_i = \\frac{x_{(i)} + x_{(i+1)}}{2}$.

Pada pohon modern (seperti LightGBM/XGBoost), pencarian dipercepat menggunakan **Histogram Binning**:
Fitur kontinu didiskretisasi ke dalam $B \\ll n$ bin integer (misal $B=256$). Kompleksitas pencarian ambang pemisah turun drastis menjadi $O(B)$!`,
    mermaidDiagram: `graph LR
    Continuous["Fitur Kontinu (n Titik)"] --> Sort["Urutkan Nilai O(n log n) atau Binning Histogram O(B)"]
    Sort --> Eval["Evaluasi Impuritas Tiap Ambang Kandidat"]
    Eval --> Best["Pilih Ambang Optimal dengan Gain Tertinggi"]`,
    scratchCode: `def find_best_split_1d(x: np.ndarray, y: np.ndarray):
    best_gain, best_thresh = -1, None
    sorted_idx = np.argsort(x)
    x_s, y_s = x[sorted_idx], y[sorted_idx]
    
    for i in range(len(x) - 1):
        thresh = (x_s[i] + x_s[i+1]) / 2.0
        left_mask = x_s <= thresh
        gain = np.var(y_s) - (np.sum(left_mask)/len(x) * np.var(y_s[left_mask]) + np.sum(~left_mask)/len(x) * np.var(y_s[~left_mask]))
        if gain > best_gain:
            best_gain, best_thresh = gain, thresh
    return best_thresh, best_gain

x_arr = np.array([1.0, 2.0, 5.0, 6.0])
y_arr = np.array([10.0, 11.0, 50.0, 51.0])
t_opt, g_opt = find_best_split_1d(x_arr, y_arr)
print(f"Ambang Pemisah Terbaik: {t_opt} dengan Gain: {g_opt:.4f}")`,
    sotaCode: `from sklearn.tree import DecisionTreeRegressor

tree_split = DecisionTreeRegressor(max_leaf_nodes=2).fit(x_arr.reshape(-1, 1), y_arr)
print("Ambang Scikit-Learn:", tree_split.tree_.threshold[0])`,
    diagCode: `print("Verifikasi ambang batas:", np.isclose(t_opt, tree_split.tree_.threshold[0]))`,
    caseStudy: "Optimasi split finding pada dataset tabular 50 juta baris di industri perbankan menggunakan algoritma histogram.",
    commonPitfalls: ["Fitur kategorial berkardinalitas tinggi (misal kode pos dengan 500 kategori) memiliki 2^499 kemungkinan partisi biner yang mustahil dieksplorasi secara brute force."],
    groundingLinks: [{ title: "Breiman CART Ch. 9 Categorical Splits", url: "https://www.statlearning.com/", note: "Teknik partisi kategorial biner" }]
  }),

  createSubchapter({
    id: "ml-14-5-strategi-pre-pruning",
    slug: "14-5-strategi-pre-pruning",
    title: "14.5 Strategi Penghentian Awal (Pre-Pruning): Kedalaman Maksimum, Sampel Minimum Daun, & Toleransi Impuritas",
    orderIndex: 5,
    description: "Metode regularisasi pohon melalui penghentian awal (early stopping): parameter max_depth, min_samples_split, min_samples_leaf, dan min_impurity_decrease.",
    theoryMarkdown: `Pohon keputusan tanpa batasan akan terus tumbuh hingga seluruh daun murni (impuritas nol), menghafal noise data latih secara fatal (overfitting).
**Pre-pruning** menghentikan pertumbuhan simpul sebelum pohon menjadi terlalu kompleks:
1. \`max_depth\`: Membatasi kedalaman maksimum pohon hierarki.
2. \`min_samples_split\`: Jumlah sampel minimum yang harus ada di simpul agar diperbolehkan membelah.
3. \`min_samples_leaf\`: Jumlah sampel minimum yang harus ada di setiap simpul daun akhir.
4. \`min_impurity_decrease\`: Pemisahan hanya dieksekusi jika penurunan impuritas melampaui ambang batas toleransi $\\Delta I > \\tau$.`,
    mermaidDiagram: `graph TD
    Node["Simpul Kandidat Pembelahan"] --> Check1{"Depth >= max_depth?"}
    Check1 -- Ya --> Stop["Hentikan: Jadikan Daun (Pre-pruning)"]
    Check1 -- Tidak --> Check2{"N < min_samples_split?"}
    Check2 -- Ya --> Stop
    Check2 -- Tidak --> Check3{"Gain < min_impurity_decrease?"}
    Check3 -- Ya --> Stop
    Check3 -- Tidak --> Split["Lanjutkan Pembelahan Rekursif"]`,
    scratchCode: `def should_stop_tree_growth(depth, max_depth, n_samples, min_samples_leaf):
    if depth >= max_depth:
        return True
    if n_samples < 2 * min_samples_leaf:
        return True
    return False

print("Stop at depth 5 (max=4):", should_stop_tree_growth(5, 4, 100, 5))
print("Stop at n=8 (min_leaf=5):", should_stop_tree_growth(2, 4, 8, 5))`,
    sotaCode: `from sklearn.tree import DecisionTreeClassifier

dt_pruned = DecisionTreeClassifier(max_depth=3, min_samples_leaf=10)
dt_pruned.fit(X_knn, y_knn)
print("Tinggi pohon terbatasi:", dt_pruned.get_depth())`,
    diagCode: `print("Jumlah daun terkendali:", dt_pruned.get_n_leaves())`,
    caseStudy: "Pencegahan memorisasi pada dataset medis langka: Memastikan setiap daun memiliki minimal 10 pasien untuk mencegah diagnosa berbasis kebetulan.",
    commonPitfalls: ["Pre-pruning agresif dapat menyebabkan underfitting prematur karena melewatkan interaksi fitur multi-langkah (XOR problem)."],
    groundingLinks: [{ title: "Scikit-Learn Decision Trees Hyperparameters", url: "https://scikit-learn.org/stable/modules/tree.html#tips-on-practical-use", note: "Tips praktis penyetelan pre-pruning" }]
  }),

  createSubchapter({
    id: "ml-14-6-pemangkasan-cost-complexity-pruning",
    slug: "14-6-pemangkasan-cost-complexity-pruning",
    title: "14.6 Pemangkasan Pasca-Pelatihan (Post-Pruning): Teori Cost-Complexity Pruning & Penelusuran Jalur Alfa Minimal",
    orderIndex: 6,
    description: "Teori formal Cost-Complexity Pruning (Breiman et al.): fungsi biaya ter-regularisasi R_alpha(T) = R(T) + alpha |T| dan penelusuran jalur alfa minimal.",
    theoryMarkdown: `**Cost-Complexity Pruning** (atau Minimal Cost-Complexity Pruning) menumbuhkan pohon penuh $T_0$ terlebih dahulu, kemudian memangkasnya secara sistematis dari bawah ke atas (*bottom-up*).

Fungsi objektif ter-regularisasi:
$$R_\\alpha(T) = R(T) + \\alpha |T|$$
di mana $R(T)$ adalah total impuritas/error daun, $|T|$ adalah jumlah simpul daun, dan $\\alpha \\ge 0$ adalah parameter kompleksitas penalti.

Untuk setiap simpul internal $t$:
$$\\alpha_{\\text{effective}}(t) = \\frac{R(t) - R(T_t)}{|T_t| - 1}$$
Simpul dengan $\\alpha_{\\text{effective}}$ terkecil dipangkas terlebih dahulu untuk menghasilkan urutan subpohon bersarang optimal.`,
    mermaidDiagram: `graph TD
    FullTree["Tumbuhkan Pohon Penuh T_0 (Overfitting)"] --> Alpha["Hitung Effective Alpha Tiap Simpul Internal: g(t) = [R(t) - R(T_t)] / (|T_t| - 1)"]
    Alpha --> PruneMin["Pangkas Subpohon dengan g(t) Terkecil"]
    PruneMin --> Path["Dapatkan Urutan Subpohon Bersarang T_0 supset T_1 supset ... supset Root"]
    Path --> CV["Pilih Nilai Alpha Optimal via Cross-Validation"]`,
    scratchCode: `def effective_alpha_node(r_t, r_sub_t, n_leaves_sub):
    if n_leaves_sub <= 1:
        return np.inf
    return (r_t - r_sub_t) / (n_leaves_sub - 1)

print("Effective Alpha (R(t)=0.4, R(Tt)=0.1, Leaves=4):", effective_alpha_node(0.4, 0.1, 4))`,
    sotaCode: `from sklearn.tree import DecisionTreeClassifier

clf_full = DecisionTreeClassifier(random_state=42).fit(X_knn, y_knn)
path = clf_full.cost_complexity_pruning_path(X_knn, y_knn)
ccp_alphas = path.ccp_alphas
print(f"Ditemukan {len(ccp_alphas)} nilai ambang ccp_alpha unik.")`,
    diagCode: `best_tree = DecisionTreeClassifier(ccp_alpha=ccp_alphas[len(ccp_alphas)//2]).fit(X_knn, y_knn)
print("Kedalaman Pohon Pasca-Pruning:", best_tree.get_depth())`,
    caseStudy: "Penyusunan pohon diagnosa klaim garansi otomotif: Post-pruning menghasilkan pohon yang ringkas dan mudah diaudit oleh inspektur pabrik.",
    commonPitfalls: ["Memangkas pohon tanpa validasi silang (cross-validation) untuk memilih parameter alpha optimal."],
    groundingLinks: [{ title: "Scikit-Learn Post-pruning with cost complexity", url: "https://scikit-learn.org/stable/auto_examples/tree/plot_cost_complexity_pruning.html", note: "Tutorial resmi implementasi CCP Scikit-Learn" }]
  }),

  createSubchapter({
    id: "ml-14-7-surrogate-splits-imbalance",
    slug: "14-7-surrogate-splits-imbalance",
    title: "14.7 Penanganan Data Hilang melalui Pembagian Pengganti (Surrogate Splits) & Pengaruh Ketidakseimbangan Fitur",
    orderIndex: 7,
    description: "Mekanisme canggih CART dalam menangani missing values tanpa imputasi: Surrogate Splits (aturan pemisah cadangan berkorelasi) dan ketahanan class imbalance.",
    theoryMarkdown: `Jika observasi memiliki nilai hilang (*missing value*) pada fitur pemisah utama $X_j^*$, CART menggunakan **Surrogate Splits** (pembagi cadangan).

Pembagi pengganti $X_k$ dipilih dari fitur lain yang paling berkorelasi dan meniru hasil partisi pembagi utama secara optimal:
$$\\lambda(j^*, k) = \\frac{\\text{Jumlah kesamaan penugasan kiri-kanan}}{N}$$
Jika fitur pengganti pertama juga hilang, model beralih ke pengganti kedua, atau mengirimkan sampel ke cabang mayoritas (*majority branch*).`,
    mermaidDiagram: `graph TD
    Sample["Sampel dengan Fitur X_1 Hilang"] --> CheckPrimary["Evaluasi Pemisah Utama X_1 <= t1 (Hilang!)"]
    CheckPrimary --> Surrogate1["Beralih ke Surrogate 1: X_3 <= t3 (Korelasi 95%)"]
    Surrogate1 -- "Tersedia" --> Branch["Kirim ke Cabang Sesuai X_3"]
    Surrogate1 -- "Hilang Juga" --> Majority["Kirim ke Cabang Mayoritas"]`,
    scratchCode: `def surrogate_agreement_score(primary_mask, surrogate_mask):
    return np.mean(primary_mask == surrogate_mask)

m_prim = np.array([True, True, False, False, True])
m_surr = np.array([True, True, False, True, True])
print("Skor Kesepakatan Surrogate Split:", surrogate_agreement_score(m_prim, m_surr))`,
    sotaCode: `from sklearn.tree import DecisionTreeClassifier

# Catatan: Scikit-learn v1.3+ mendukung missing values asli (NaN) pada HistGradientBoosting & DecisionTree
dt_nan = DecisionTreeClassifier().fit([[1, 2], [np.nan, 3], [4, 5]], [0, 1, 1])
print("Decision Tree fit dengan native missing values berhasil!")`,
    diagCode: `print("Prediksi data missing:", dt_nan.predict([[np.nan, 4]]))`,
    caseStudy: "Sensus demografi sosial: Kuisioner dengan pertanyaan opsional (pendapatan) ditangani secara mulus via surrogate splits tanpa membuang baris responden.",
    commonPitfalls: ["Mengabaikan surrogate splits dan langsung membuang baris yang memiliki nilai hilang (*complete case analysis*), membuang 50%+ dataset."],
    groundingLinks: [{ title: "Breiman CART Ch. 5 Missing Value Handling", url: "https://www.statlearning.com/", note: "Bab kanonikal surrogate splits" }]
  }),

  createSubchapter({
    id: "ml-14-8-varians-tinggi-kebutuhan-ensemble",
    slug: "14-8-varians-tinggi-kebutuhan-ensemble",
    title: "14.8 Ketidakstabilan Varians Tinggi CART, Pergeseran Aksis Rotasi Fitur, & Kebutuhan Paradigma Ensemble",
    orderIndex: 8,
    description: "Analisis kelemahan fundamental pohon tunggal: varians estimasi yang sangat tinggi, ketidakstabilan hierarkis terhadap perturbasi kecil, dan urgensi paradigma Ensemble.",
    theoryMarkdown: `Pohon keputusan tunggal menderita **Varians Ekstrem (High Variance)**:
1. **Sensitivitas Hierarki**: Perubahan kecil pada beberapa sampel data latih dapat mengubah pembagian di simpul akar, merombak seluruh topologi cabang di bawahnya secara radikal.
2. **Sensitivitas Rotasi Aksis**: Karena batas pembagian bersifat ortogonal, memutar sumbu data sebesar 45 derajat akan mengubah pohon sederhana 1-split menjadi pohon tangga tangga (*staircase*) bertingkat 20 simpul.

Kelemahan varians tinggi inilah yang memicu lahirnya paradigma **Ensemble Learning** (Bagging, Random Forests, Boosting) untuk mereduksi varians melalui rata-rata statistik.`,
    mermaidDiagram: `graph LR
    Instability["Pohon Tunggal: Varians Sangat Tinggi & Sensitif Perturbasi"] --> Solution["Solusi: Ensemble Learning"]
    Solution --> Bagging["Bagging & Random Forest: Reduksi Varians via Resampling"]
    Solution --> Boosting["Boosting: Reduksi Bias Sekuensial"]`,
    scratchCode: `def demonstrate_tree_instability():
    np.random.seed(42)
    X_orig = np.random.randn(50, 2)
    y_orig = (X_orig[:, 0] > 0).astype(int)
    
    # Perturbasi 1 titik data saja
    X_perturbed = X_orig.copy()
    X_perturbed[0] += [0.5, 0.5]
    return X_orig, X_perturbed, y_orig

X_o, X_p, y_o = demonstrate_tree_instability()
print("Dataset perturbasi siap untuk uji ketidakstabilan.")`,
    sotaCode: `from sklearn.tree import DecisionTreeClassifier

tree_1 = DecisionTreeClassifier(random_state=42).fit(X_o, y_o)
tree_2 = DecisionTreeClassifier(random_state=42).fit(X_p, y_o)
print("Fitur simpul akar pohon 1:", tree_1.tree_.feature[0])
print("Fitur simpul akar pohon 2:", tree_2.tree_.feature[0])`,
    diagCode: `print("Kedalaman pohon 1:", tree_1.get_depth(), "| Pohon 2:", tree_2.get_depth())`,
    caseStudy: "Sistem scoring persetujuan KPR bank: Bank tidak dapat menggunakan pohon tunggal yang mudah berubah hanya karena penambahan 5 nasabah baru.",
    commonPitfalls: ["Mengandalkan pohon keputusan tunggal yang dalam untuk sistem produksi mission-critical."],
    groundingLinks: [{ title: "ESL Ch. 9.2 Tree-Based Methods", url: "https://hastie.su.domains/ElemStatLearn/", note: "Analisis stabilitas pohon ESL" }]
  })
];

const chapter14 = {
  id: "machine-learning-ch-14",
  slug: "bab-14-pohon-keputusan-cart-impuritas-pruning-surrogate-splits",
  title: "BAB 14: Pohon Keputusan (CART): Impuritas, Pruning, & Surrogate Splits",
  orderIndex: 14,
  description: "Landasan analitis algoritma pohon keputusan CART: topologi partisi ortogonal, kriteria impuritas Gini dan Entropi, kriteria pembagian regresi MSE, algoritma greedy split-finding, strategi pre-pruning dan post-pruning Cost-Complexity, penanganan data hilang via surrogate splits, serta analisis varians tinggi pendorong ensemble.",
  coreConcepts: [
    "Partisi Ruang Fitur Ortogonal Rekursif",
    "Gini Impurity, Entropi Informasi, & MSE Split",
    "Algoritma Greedy Split-Finding & Histogram Binning",
    "Pre-Pruning Early Stopping",
    "Cost-Complexity Post-Pruning (ccp_alpha)",
    "Surrogate Splits & Varians Tinggi CART"
  ],
  subchapters: ch14Subs
};

fs.writeFileSync(path.join(outDir, 'chunk4-ch14.ts'), exportChapterTs(chapter14, 'chapter14'), 'utf-8');
console.log('Successfully generated chunk4-ch14.ts (8 subchapters)');
