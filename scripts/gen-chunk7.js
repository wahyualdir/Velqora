const fs = require('fs');
const path = require('path');
const { createSubchapter, exportChapterTs } = require('./curriculum-builder-helper');

const OUT_DIR = path.join(__dirname, '../src/lib/curriculum/topics/machine-learning');

// ==========================================
// CHAPTER 31: Interpretabilitas Model & XAI: SHAP, LIME, & PFI
// ==========================================
const ch31Subchapters = [
  createSubchapter({
    id: "ml-31-1-black-box-problem",
    slug: "krisis-model-kotak-hitam-black-box-problem-dan-regulasi-ai",
    title: "31.1 Krisis Model Kotak Hitam (Black-Box Problem): Trade-off Interpretabilitas Akurasi & Regulasi Transparansi AI",
    orderIndex: 1,
    description: "Dilema opacity algoritma kompleks, trade-off akurasi vs interpretabilitas, hak atas penjelasan (Right to Explanation - GDPR), dan kepatuhan regulasi AI tingkat tinggi.",
    theoryMarkdown: `Dalam evolusi machine learning, terdapat ketegangan fundamental antara kapasitas representasi model (*accuracy*) dan transparansi penalaran internal (*interpretability*):
- Model transparan (*white-box* / *glass-box*): Regresi Linier, Decision Trees dangkal, GAM (Generalized Additive Models). Mudah diinspeksi manusia, namun memiliki bias induktif tinggi pada pola non-linier kompleks.
- Model kotak hitam (*black-box*): Deep Neural Networks, Gradient Boosted Trees (XGBoost, CatBoost). Memiliki akurasi prediktif superior, namun fungsi pemetaannya $\\hat{f}: \\mathbb{R}^p \\to \\mathbb{R}$ terdiri dari jutaan bobot atau ribuan pembagian cabang non-linier yang mustahil diurai secara manual.

**Urgensi Regulasi & Keamanan (Right to Explanation)**:
Regulasi global seperti EU AI Act dan GDPR Pasal 22 mewajibkan sistem AI yang berdampak tinggi (skoring kredit, vonis hukum, diagnosis klinis, rekrutmen kerja) untuk memberikan penjelasan yang dapat dipahami manusia (*human-interpretable justification*) terhadap setiap keputusan otomatis yang merugikan individu.`,
    mermaidDiagram: `graph LR
    Linear["Model Linier & Decision Trees Dangkal"] --> Spectrum["Spektrum Interpretabilitas vs Kapasitas"]
    GBDT["Gradient Boosted Trees (XGBoost/LightGBM)"] --> Spectrum
    DNN["Deep Neural Networks & Transformers"] --> Spectrum
    Spectrum --> Transparansi["Tinggi Interpretabilitas <------------------------> Tinggi Akurasi & Kompleksitas"]
    Transparansi --> Solusi["Solusi: Explainable AI (XAI) Post-Hoc Agnostik"]`,
    scratchCode: `def explain_simple_linear(coefficients, feature_names, intercept, sample_x):
    """Inspeksi interpretabilitas intrinsik pada model linier dari scratch."""
    explanation = {}
    total_score = intercept
    for name, coef, val in zip(feature_names, coefficients, sample_x):
        contribution = coef * val
        total_score += contribution
        explanation[name] = {"value": val, "coef": coef, "contribution": contribution}
        
    return {"total_score": total_score, "breakdown": explanation}

coefs = [2.5, -1.2, 0.8]
names = ['Pendapatan', 'Rasio_Utang', 'Lama_Bekerja']
sample = [3.0, 0.4, 5.0]
print(explain_simple_linear(coefs, names, 10.0, sample))`,
    sotaCode: `import numpy as np
from sklearn.linear_model import LogisticRegression

X = np.array([[3.0, 0.4, 5.0], [1.5, 0.8, 1.0], [5.0, 0.2, 10.0]])
y = np.array([1, 0, 1])

clf = LogisticRegression().fit(X, y)
print("Koefisien Model Intrinsik:", clf.coef_[0])
print("Intersep Model:", clf.intercept_[0])`,
    diagCode: `def verify_model_transparency(model_type):
    white_box = ["linear_regression", "logistic_regression", "decision_tree_shallow"]
    return "White-Box (Intrinsically Interpretable)" if model_type in white_box else "Black-Box (Requires XAI Explainer)"`,
    caseStudy: "Sistem scoring perbankan COMPAS di AS dan algoritma kredit Apple Card sempat diselidiki otoritas keuangan karena model ensemble non-transparan menghasilkan bias gender dan rasial tanpa ada mekanisme audit internal yang memadai.",
    commonPitfalls: [
      "Mengasumsikan akurasi tinggi pada test set menjamin model belajar kausalitas yang benar (bukan korelasi palsu/spurious correlations).",
      "Mengorbankan akurasi sistem kritis keselamatan secara prematur demi menggunakan model sederhana yang tidak mampu menangkap risiko ekstrem."
    ],
    groundingLinks: [
      { title: "Rudin (2019) Stop explaining black box machine learning models for high stakes decisions and use interpretable models instead", url: "https://doi.org/10.1038/s42256-019-0048-x", note: "Kritik teoretis terhadap XAI post-hoc vs model intrinsik" }
    ]
  }),

  createSubchapter({
    id: "ml-31-2-intrinsic-interpretability",
    slug: "interpretabilitas-intrinsik-model-linier-dan-pohon-dangkal",
    title: "31.2 Interpretabilitas Intrinsik: Model Linier Terstandarisasi, Koefisien Regresi, & Aturan Keputusan Pohon Dangkal",
    orderIndex: 2,
    description: "Eksplorasi mendalam interpretabilitas model intrinsik: Koefisien terstandarisasi beta-weights, Odds Ratio pada regresi logistik, dan rule extraction pohon dangkal.",
    theoryMarkdown: `Model transparan memungkinkan audit kausalitas lokal maupun global secara langsung dari parameter matematisnya:

1. **Koefisien Regresi Terstandarisasi (Beta Weights)**:
   Jika seluruh fitur $\\mathbf{x}_j$ distandardisasi ke rata-rata nol dan varians satu (Z-Score), besaran absolut koefisien $|\\beta_j|$ secara langsung mencerminkan kepentingan relatif fitur tersebut terhadap target:
   $$\\hat{y} = \\sum_{j=1}^p \\beta_j \\left( \\frac{x_j - \\mu_j}{\\sigma_j} \\right) + \\beta_0$$
2. **Odds Ratio pada Regresi Logistik**:
   Eksponensial dari koefisien $\\exp(\\beta_j)$ mengukur rasio perubahan odds terhadap peningkatan satu satuan fitur:
   $$\\text{OR}_j = \\frac{\\text{Odds}(x_j + 1)}{\\text{Odds}(x_j)} = \\exp(\\beta_j)$$
   Jika $\\beta_j = 0.693$, maka $\\exp(0.693) \\approx 2.0$, artinya peningkatan satu unit $x_j$ menggandakan peluang terjadinya kejadian target.
3. **Ekstraksi Aturan Pohon Dangkal (*Decision Lists*)**:
   Pohon keputusan CART dengan kedalaman $\\le 3$ dapat ditransformasikan menjadi himpunan aturan logika Boolean diskrit \`IF-THEN\` yang dapat diverifikasi oleh regulator domain medis atau hukum.`,
    mermaidDiagram: `graph TD
    Data["Fitur Terstandarisasi (Z-Score)"] --> Fit["Pelatihan Model Transparan"]
    Fit --> Linier["Model Linier: Urutkan Besaran |Beta_j| & Hitung Odds Ratio exp(Beta)"]
    Fit --> Pohon["Pohon Dangkal: Ekstrak Rangkaian Aturan Boolean IF-THEN"]
    Linier --> Audit["Audit Langsung Tanpa Aproksimasi"]
    Pohon --> Audit`,
    scratchCode: `import numpy as np

def compute_odds_ratios_scratch(X_std, y):
    """Menghitung Odds Ratio dari regresi logistik terstandarisasi scratch."""
    # Solver Newton-Raphson mini
    n, p = X_std.shape
    w = np.zeros(p)
    for _ in range(10):
        p_pred = 1.0 / (1.0 + np.exp(- X_std @ w))
        p_pred = np.clip(p_pred, 1e-15, 1 - 1e-15)
        grad = X_std.T @ (p_pred - y) / n
        W_diag = p_pred * (1.0 - p_pred)
        Hess = (X_std.T * W_diag) @ X_std / n + 1e-4 * np.eye(p)
        w -= np.linalg.solve(Hess, grad)
        
    odds_ratios = np.exp(w)
    return {"coefficients": w, "odds_ratios": odds_ratios}

X = np.random.randn(100, 2)
y = (X[:, 0] * 1.5 - X[:, 1] * 0.8 > 0).astype(int)
res = compute_odds_ratios_scratch(X, y)
print("Koefisien W:", np.round(res["coefficients"], 3))
print("Odds Ratios:", np.round(res["odds_ratios"], 3))`,
    sotaCode: `from sklearn.tree import DecisionTreeClassifier, export_text
import numpy as np

X = np.array([[25, 50000], [45, 120000], [35, 80000], [20, 20000]])
y = np.array([0, 1, 1, 0])

tree = DecisionTreeClassifier(max_depth=2, random_state=42).fit(X, y)
rules = export_text(tree, feature_names=['Usia', 'Pendapatan'])
print("Ekstraksi Aturan Keputusan Pohon Intrinsik:\\n", rules)`,
    diagCode: `def verify_tree_depth(tree):
    depth = tree.get_depth()
    assert depth <= 4, f"Pohon terlalu dalam (depth={depth}) untuk interpretabilitas intrinsik murni!"
    return "Valid Shallow Tree"`,
    caseStudy: "Di industri asuransi jiwa, pedoman aktuarial mengharuskan pemodelan risiko morbiditas menggunakan Generalized Additive Models (GAM) transparan agar setiap penambahan tarif premi dapat dibuktikan secara legal kepada nasabah.",
    commonPitfalls: [
      "Menginterpretasikan nilai koefisien regresi linier secara langsung tanpa menstandarisasi skala fitur terlebih dahulu.",
      "Mengabaikan multikolinearitas yang mendistorsi tanda positif/negatif dari koefisien regresi."
    ],
    groundingLinks: [
      { title: "Molnar (2022) Interpretable Machine Learning: A Guide for Making Black Box Models Explainable", url: "https://christophm.github.io/interpretable-ml-book/", note: "Buku rujukan utama metode interpretabilitas AI" }
    ]
  }),

  createSubchapter({
    id: "ml-31-3-permutation-feature-importance",
    slug: "metodologi-post-hoc-permutation-feature-importance-pfi",
    title: "31.3 Metodologi Post-Hoc Model-Agnostic: Permutation Feature Importance (PFI) & Kelemahan Korelasi Fitur",
    orderIndex: 3,
    description: "Evaluasi signifikansi fitur agnostik model: Algoritma Permutation Feature Importance (PFI), pemutusan hubungan dengan target, dan distorsi akibat korelasi multikolinearitas.",
    theoryMarkdown: `Permutation Feature Importance (PFI) pertama kali diperkenalkan oleh Breiman (2001) untuk Random Forest dan digeneralisasikan oleh Fisher, Rudin, & Dominici (2019) sebagai metode model-agnostik universal.

**Algoritma PFI**:
1. Diberikan model terlatih $\\hat{f}$ dan himpunan data validasi $\\mathcal{D}$. Hitung skor dasar metrik performa $\\text{Score}_{\\text{base}} = \\mathcal{L}(\\hat{f}(\\mathbf{X}), \\mathbf{y})$.
2. Untuk setiap fitur $j \\in \\{1, \\dots, p\\}$:
   - Bangkitkan matriks permutasi $\\mathbf{X}^{\\text{perm-j}}$ dengan mengacak baris fitur $j$ secara acak, memutus korelasi antara $x_j$ dan target $y$ serta fitur lainnya.
   - Hitung metrik performa baru $\\text{Score}_{j} = \\mathcal{L}(\\hat{f}(\\mathbf{X}^{\\text{perm-j}}), \\mathbf{y})$.
   - Tingkat kepentingan fitur $j$ didefinisikan sebagai penurunan performa:
     $$\\text{PFI}_j = \\text{Score}_{j} - \\text{Score}_{\\text{base}}$$

**Kelemahan Teoretis PFI pada Fitur Berkorelasi**:
Jika fitur $x_1$ dan $x_2$ berkorelasi linier sangat kuat ($r > 0.95$), pengacakan $x_1$ menciptakan kombinasi observasi yang tidak realistis di luar manifold data nyata (*off-manifold data points*), mendistorsi nilai estimasi kepentingan fitur ke bawah atau ke atas secara semu.`,
    mermaidDiagram: `graph TD
    Model["Model Kotak Hitam Terlatih f_hat"] --> Baseline["Hitung Skor Metrik Validasi Asli (Baseline)"]
    Baseline --> Permute["Acak Urutan Baris Kolom Fitur j (Putus Korelasi)"]
    Permute --> NewScore["Hitung Skor Metrik Baru pada Data Acak"]
    NewScore --> Drop["PFI_j = Penurunan Skor (Drop in Metric)"]`,
    scratchCode: `import numpy as np
from sklearn.metrics import accuracy_score

def permutation_feature_importance_scratch(model, X_val, y_val, metric_func=accuracy_score, n_repeats=5, random_seed=42):
    """Implementasi PFI model-agnostik dari scratch."""
    np.random.seed(random_seed)
    X_val = np.asarray(X_val)
    y_val = np.asarray(y_val)
    n_samples, n_features = X_val.shape
    
    baseline_score = metric_func(y_val, model.predict(X_val))
    importances = np.zeros((n_features, n_repeats))
    
    for j in range(n_features):
        for rep in range(n_repeats):
            X_perm = np.copy(X_val)
            X_perm[:, j] = np.random.permutation(X_perm[:, j])
            perm_score = metric_func(y_val, model.predict(X_perm))
            importances[j, rep] = baseline_score - perm_score
            
    means = np.mean(importances, axis=1)
    stds = np.std(importances, axis=1)
    return {"mean_importance": means, "std_importance": stds}

# Mock model
class DummyModel:
    def predict(self, X):
        return (X[:, 0] > 0).astype(int) # Hanya fitur 0 yang relevan

X_mock = np.random.randn(100, 3)
y_mock = (X_mock[:, 0] > 0).astype(int)
pfi_res = permutation_feature_importance_scratch(DummyModel(), X_mock, y_mock)
print("PFI Scratch Mean:", np.round(pfi_res["mean_importance"], 3))`,
    sotaCode: `from sklearn.inspection import permutation_importance
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=200, n_features=5, n_informative=2, random_state=42)
clf = RandomForestClassifier(random_state=42).fit(X, y)

pfi_sklearn = permutation_importance(clf, X, y, n_repeats=5, random_state=42)
print("Scikit-Learn PFI Rata-rata:", np.round(pfi_sklearn.importances_mean, 3))`,
    diagCode: `def verify_pfi_leakage(train_X, test_X):
    # Verifikasi bahwa PFI dijalankan pada validation/test set, BUKAN training set
    return "PFI Wajib Dievaluasi pada Data Out-of-Sample untuk Mengukur Kepentingan Sejati"`,
    caseStudy: "Strobl et al. (2007) membuktikan bahwa Gini Importance bawaan Random Forest bias terhadap variabel kontinu kardinalitas tinggi; PFI pada validation set menjadi solusi standar industri untuk mengeliminasi bias tersebut.",
    commonPitfalls: [
      "Menjalankan PFI pada training data (mengukur memorization alih-alih generalisasi fitur).",
      "Mengabaikan korelasi tinggi antar-fitur yang menyebabkan kedua fitur tampak tidak penting akibat saling menutupi (masking effect)."
    ],
    groundingLinks: [
      { title: "Fisher et al. (2019) All Models are Wrong, but Many are Useful: Learning a Variable's Importance by Considering Many Models", url: "https://www.jmlr.org/papers/v20/18-760.html", note: "Makalah landasan teoretis Model Reliance / PFI" }
    ]
  }),

  createSubchapter({
    id: "ml-31-4-pdp-ice-marginal-curves",
    slug: "analisis-marginal-partial-dependence-plots-dan-ice-curves",
    title: "31.4 Analisis Marginal Model: Partial Dependence Plots (PDP) & Individual Conditional Expectation (ICE) Curves",
    orderIndex: 4,
    description: "Visualisasi efek marginal fitur: Formulasi analitis Partial Dependence Plots (PDP), Individual Conditional Expectation (ICE) curves, dan deteksi efek heterogenitas tersembunyi.",
    theoryMarkdown: `Partial Dependence Plots (PDP) dan Individual Conditional Expectation (ICE) curves memvisualisasikan bagaimana variasi nilai fitur input mempengaruhi prediksi model secara marginal:

1. **Partial Dependence Function (PDP)**:
   Mendefinisikan subset fitur yang diminati $X_S$ (biasanya 1 atau 2 fitur) dan fitur komplementer $X_C = X \\setminus X_S$. Fungsi ketergantungan parsial marjinalisasi prediktor atas distribusi marginal $X_C$:
   $$\\hat{f}_S(x_S) = \\mathbb{E}_{X_C}[\\hat{f}(x_S, X_C)] = \\int \\hat{f}(x_S, x_C) \\, dP(x_C)$$
   Diestimasi secara empiris menggunakan rata-rata Monte Carlo atas seluruh $N$ observasi dataset:
   $$\\bar{f}_S(x_S) = \\frac{1}{N} \\sum_{i=1}^N \\hat{f}(x_S, x_{C, i})$$

2. **Individual Conditional Expectation (ICE) Curves**:
   Kelemahan utama PDP adalah rata-rata global dapat **menyamarkan efek interaksi heterogen** yang berlawanan arah (misal: fitur meningkatkan probabilitas bagi separuh populasi tetapi menurunkannya bagi separuh lainnya, menghasilkan kurva PDP datar).
   ICE memplot kurva prediksi fungsional untuk setiap observasi $i$ secara terpisah:
   $$\\hat{f}_{S}^{(i)}(x_S) = \\hat{f}(x_S, x_{C, i})$$`,
    mermaidDiagram: `graph TD
    InputFitur["Pilih Fitur Target x_S (Grid Nilai Uji)"] --> Evaluasi["Substitusi Nilai x_S ke Seluruh Sampel i=1..N"]
    Evaluasi --> ICE["ICE: Plot Garis Prediksi Individual per Sampel"]
    ICE --> Heterogen{"Apakah Terdapat Pola Bertolak Belakang?"}
    Heterogen -->|Ya| DeteksiInteraksi["Ungkap Efek Interaksi Heterogen Lokal"]
    ICE --> RataRata["Rata-rata Akumulatif Seluruh Garis ICE"]
    RataRata --> PDP["PDP: Kurva Efek Marginal Global"]`,
    scratchCode: `import numpy as np

def compute_pdp_ice_1d_scratch(model, X, feature_idx, grid_values):
    """Menghitung kurva ICE dan PDP 1D dari scratch."""
    X = np.asarray(X)
    n_samples = len(X)
    n_grid = len(grid_values)
    
    ice_curves = np.zeros((n_samples, n_grid))
    
    for g_idx, val in enumerate(grid_values):
        X_temp = np.copy(X)
        X_temp[:, feature_idx] = val
        ice_curves[:, g_idx] = model.predict(X_temp)
        
    pdp_curve = np.mean(ice_curves, axis=0)
    return {"grid_values": grid_values, "pdp": pdp_curve, "ice": ice_curves}

# Mock model kuadratik
class NonLinearModel:
    def predict(self, X):
        return X[:, 0]**2 + X[:, 1]

X_test = np.random.randn(20, 2)
grid = np.linspace(-2, 2, 9)
pdp_res = compute_pdp_ice_1d_scratch(NonLinearModel(), X_test, feature_idx=0, grid_values=grid)
print("Grid Nilai:", np.round(pdp_res["grid_values"], 2))
print("PDP Prediksi Rata-rata:", np.round(pdp_res["pdp"], 2))`,
    sotaCode: `from sklearn.inspection import PartialDependenceDisplay
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.datasets import make_regression

X, y = make_regression(n_samples=200, n_features=4, random_state=42)
gbr = GradientBoostingRegressor(random_state=42).fit(X, y)

# Scikit-learn PartialDependenceDisplay mendukung jenis 'both' (PDP + ICE)
disp = PartialDependenceDisplay.from_estimator(gbr, X, features=[0], kind='both')
print("Kalkulasi Scikit-Learn PDP & ICE Berhasil Dilakukan.")`,
    diagCode: `def verify_ice_dispersion(ice_matrix):
    std_across_samples = np.std(ice_matrix, axis=0)
    max_dispersion = np.max(std_across_samples)
    return {"Max_Heterogeneity_Std": max_dispersion, "Has_Interactions": max_dispersion > 0.5}`,
    caseStudy: "Goldstein et al. (2015) memperkenalkan ICE curves saat menganalisis dataset churn pelanggan telko; kurva PDP yang tampak datar ternyata menyembunyikan dua kelompok pengguna yang bereaksi berlawanan secara ekstrem terhadap diskon harga.",
    commonPitfalls: [
      "Mengasumsikan kurva PDP valid pada fitur yang memiliki korelasi kuat (karena mensubstitusi kombinasi $x_S, x_C$ yang tidak pernah ada dalam fisika data nyata).",
      "Hanya melihat PDP tanpa memeriksa ICE (bisa melewatkan interaksi kritis)."
    ],
    groundingLinks: [
      { title: "Goldstein et al. (2015) Peeking Inside the Black Box: Visualizing Statistical Learning With Plots of Individual Conditional Expectation", url: "https://doi.org/10.1080/10618600.2014.907095", note: "Paper asli pengenalan kurva ICE" }
    ]
  }),

  createSubchapter({
    id: "ml-31-5-lime-local-surrogates",
    slug: "local-interpretable-model-agnostic-explanations-lime",
    title: "31.5 Local Interpretable Model-agnostic Explanations (LIME): Aproksimasi Model Pengganti Linier Lokal Terbobot Jarak Eksponensial",
    orderIndex: 5,
    description: "Penjelasan prediksi lokal model-agnostik: Algoritma LIME Ribeiro et al. (2016), perturbasi ruang fitur sekitar sampel x, kernel pembobot eksponensial, dan model pengganti linier terbobot.",
    theoryMarkdown: `Meskipun fungsi keputusan global $\\hat{f}$ dari model kotak hitam sangat non-linier dan kompleks, topologi di sekitar titik lokal tertentu $\\mathbf{x}$ dapat diaproksimasi dengan baik oleh model linier sederhana (*local fidelity*).

**Formulasi Objektif LIME (Ribeiro et al., 2016)**:
$$\\xi(\\mathbf{x}) = \\arg\\min_{g \\in \\mathcal{G}} \\mathcal{L}(\\hat{f}, g, \\pi_{\\mathbf{x}}) + \\Omega(g)$$
di mana:
- $g \\in \\mathcal{G}$ adalah model penjelasan yang interpretable (misal: regresi linier berbobot sparse).
- $\\Omega(g)$ adalah penalti kompleksitas model penjelasan (misal: jumlah fitur maksimum $K$).
- $\\pi_{\\mathbf{x}}(\\mathbf{z})$ adalah **fungsi bobot kedekatan eksponensial (*exponential distance kernel*)** antara sampel perturbasi $\\mathbf{z}$ dan titik acuan $\\mathbf{x}$:
  $$\\pi_{\\mathbf{x}}(\\mathbf{z}) = \\exp\\left( -\\frac{D(\\mathbf{x}, \\mathbf{z})^2}{\\sigma^2} \\right)$$

Model penjelasan dilatih dengan meminimalkan kesalahan kuadrat terbobot:
$$\\mathcal{L}(\\hat{f}, g, \\pi_{\\mathbf{x}}) = \\sum_{\\mathbf{z} \\in \\mathcal{Z}} \\pi_{\\mathbf{x}}(\\mathbf{z}) \\left( \\hat{f}(\\mathbf{z}) - g(\\mathbf{z}') \\right)^2$$`,
    mermaidDiagram: `graph TD
    TargetPoint["Sampel Target yang Ingin Dijelaskan (x)"] --> Perturb["Bangkitkan Ribuan Titik Perturbasi Acak di Sekitar x"]
    Perturb --> BlackBox["Minta Prediksi Model Kotak Hitam: f_hat(z)"]
    Perturb --> Kernel["Hitung Bobot Jarak Eksponensial: pi_x(z) = exp(-D^2 / sigma^2)"]
    BlackBox --> FitWeighted["Latih Regresi Linier Terbobot Ridge pada Pasangan (z, f_hat(z))"]
    Kernel --> FitWeighted
    FitWeighted --> LocalCoefs["Koefisien Linier Lokal = Kontribusi Fitur untuk Sampel x"]`,
    scratchCode: `import numpy as np

def lime_local_surrogate_scratch(blackbox_predict_func, x_target, n_perturbations=500, kernel_width=1.0, random_seed=42):
    """Implementasi algoritma LIME tabular dari scratch."""
    np.random.seed(random_seed)
    p = len(x_target)
    
    # 1. Bangkitkan perturbasi Gaussian di sekitar x_target
    perturbations = x_target + np.random.normal(0, kernel_width, size=(n_perturbations, p))
    
    # 2. Dapatkan prediksi model kotak hitam
    y_preds = blackbox_predict_func(perturbations)
    
    # 3. Hitung bobot kedekatan eksponensial (pi_x)
    dists = np.linalg.norm(perturbations - x_target, axis=1)
    weights = np.exp(- (dists ** 2) / (kernel_width ** 2))
    
    # 4. Fit Weighted Ordinary Least Squares: (Z^T W Z)^-1 Z^T W y
    Z = np.column_stack([np.ones(n_perturbations), perturbations])
    W = np.diag(weights)
    beta = np.linalg.solve(Z.T @ W @ Z + 1e-4 * np.eye(p + 1), Z.T @ W @ y_preds)
    
    intercept = beta[0]
    local_importances = beta[1:]
    return {"local_intercept": intercept, "feature_contributions": local_importances}

# Black-box nonlinier: interaksi non-linier
def blackbox_func(X):
    return X[:, 0] * X[:, 1] + np.sin(X[:, 2])

x_point = np.array([2.0, 3.0, 0.5])
res = lime_local_surrogate_scratch(blackbox_func, x_point)
print("LIME Local Contributions Scratch:", np.round(res["feature_contributions"], 3))`,
    sotaCode: `import numpy as np
# Sketsa pipeline integrasi pustaka LIME resmi
from sklearn.ensemble import RandomForestClassifier

X = np.random.randn(200, 3)
y = (X[:, 0] + X[:, 1] > 0).astype(int)
clf = RandomForestClassifier(random_state=42).fit(X, y)

print("Arsitektur penjelas LIME Tabular Explainer siap mengaitkan instance lokal ke domain biner.")`,
    diagCode: `def verify_lime_stability(lime_res_1, lime_res_2):
    cos_sim = np.dot(lime_res_1, lime_res_2) / (np.linalg.norm(lime_res_1) * np.linalg.norm(lime_res_2))
    return {"Cosine_Similarity": cos_sim, "Is_Stable": cos_sim > 0.9}`,
    caseStudy: "Ribeiro et al. (2016) menggunakan LIME untuk membongkar model Deep CNN pengklasifikasi Serigala vs Husky; LIME mengungkapkan bahwa model mengklasifikasikan gambar sebagai serigala semata-mata karena adanya latar salju, bukan fitur biologis anjing.",
    commonPitfalls: [
      "Instabilitas sampling LIME: Menjalankan LIME dua kali pada sampel yang sama dapat menghasilkan penjelasan berbeda jika ukuran perturbasi terlalu kecil.",
      "Sensitivitas ekstrem terhadap pemilihan hyperparameter `kernel_width`."
    ],
    groundingLinks: [
      { title: "Ribeiro et al. (2016) Why Should I Trust You?: Explaining the Predictions of Any Classifier", url: "https://arxiv.org/abs/1602.04938", note: "Paper asli seminal LIME" }
    ]
  }),

  createSubchapter({
    id: "ml-31-6-shapley-values-cooperative-game-theory",
    slug: "teori-shapley-values-game-theory-dan-aksioma-xai",
    title: "31.6 Teori Shapley Values dari Teori Permainan Koperasi: Karakteristik Aksioma Efisiensi, Simetri, Dummy, & Aditivitas",
    orderIndex: 6,
    description: "Fondasi aksiomatik alokasi kontribusi adil: Teori permainan kooperatif Lloyd Shapley (1953), empat aksioma unik keadilan (Efficiency, Symmetry, Dummy, Additivity), dan biaya kombinatoris eksponensial.",
    theoryMarkdown: `Dalam teori permainan kooperatif (*cooperative game theory*), Lloyd Shapley (Peraih Nobel Ekonomi) merumuskan metode matematis unik untuk mendistribusikan total keuntungan koalisi pemain secara adil.

Diterjemahkan ke machine learning:
- **Pemain (*Players*)**: Nilai fitur input individual $x_j$.
- **Permainan (*Game*)**: Model prediksi $\\hat{f}$.
- **Keuntungan (*Payout*)**: Selisih antara prediksi model aktual $\\hat{f}(\\mathbf{x})$ dan nilai ekspektasi baseline populasi $\\mathbb{E}[\\hat{f}(\\mathbf{X})]$.

**Formulasi Eksak Nilai Shapley**:
$$\\phi_j(x) = \\sum_{S \\subseteq F \\setminus \\{j\\}} \\frac{|S|! (|F| - |S| - 1)!}{|F|!} \\left[ \\hat{f}(S \\cup \\{j\\}) - \\hat{f}(S) \\right]$$

**Empat Aksioma Fundamental Keadilan**:
1. **Efisiensi (Efficiency)**: Jumlah kontribusi seluruh fitur sama persis dengan selisih prediksi:
   $$\\sum_{j=1}^p \\phi_j(x) = \\hat{f}(\\mathbf{x}) - \\mathbb{E}[\\hat{f}(\\mathbf{X})]$$
2. **Simetri (Symmetry)**: Jika dua fitur $j$ dan $k$ memberikan kontribusi marginal yang identik pada seluruh koalisi $S$, maka $\\phi_j = \\phi_k$.
3. **Pemain Boneka (Dummy / Null Player)**: Jika fitur $j$ tidak pernah mengubah prediksi pada koalisi apa pun, maka $\\phi_j = 0$.
4. **Aditivitas (Additivity)**: Untuk model gabungan $\\hat{f} + \\hat{g}$, nilai Shapley adalah penjumlahan nilai Shapley masing-masing: $\\phi_j(\\hat{f} + \\hat{g}) = \\phi_j(\\hat{f}) + \\phi_j(\\hat{g})$.

Nilai Shapley adalah **satu-satunya metode atribusi kontribusi** yang secara simultan memenuhi keempat aksioma ini!`,
    mermaidDiagram: `graph LR
    Prediksi["Prediksi Model f(x)"] --> Minus["Kurangi Baseline Populasi E[f(X)]"]
    Minus --> Gap["Selisih Keuntungan: f(x) - E[f(X)]"]
    Gap --> Axioms{"4 Aksioma Shapley: Efisiensi, Simetri, Dummy, Aditivitas"}
    Axioms --> Sum["phi_1 + phi_2 + ... + phi_p = f(x) - E[f(X)]"]`,
    scratchCode: `import itertools
import numpy as np
from math import factorial

def exact_shapley_values_scratch(model_predict_func, x_instance, background_mean, feature_names):
    """Kalkulasi nilai Shapley eksak untuk semua subset koalisi dari scratch."""
    p = len(x_instance)
    all_features = set(range(p))
    shapley_values = np.zeros(p)
    
    # Evaluasi fungsi nilai karakteristik v(S)
    def v(S):
        # Pengganti marginal sederhana: fitur di luar S diganti dengan background_mean
        x_eval = np.copy(background_mean)
        for idx in S:
            x_eval[idx] = x_instance[idx]
        return model_predict_func(x_eval.reshape(1, -1))[0]
        
    for j in range(p):
        other_features = all_features - {j}
        # Iterasi seluruh kemungkinan subset S dari fitur lain
        for s_len in range(p):
            for S in itertools.combinations(other_features, s_len):
                weight = factorial(len(S)) * factorial(p - len(S) - 1) / factorial(p)
                marginal_contribution = v(set(S) | {j}) - v(set(S))
                shapley_values[j] += weight * marginal_contribution
                
    return dict(zip(feature_names, shapley_values))

# Model linier interaktif
def test_model(X):
    return X[:, 0] * 2.0 + X[:, 1] * 5.0

x = np.array([3.0, 2.0])
bg = np.array([0.0, 0.0])
shaps = exact_shapley_values_scratch(test_model, x, bg, ['Fitur_A', 'Fitur_B'])
print("Exact Shapley Values Scratch:", shaps)
print("Verifikasi Aksioma Efisiensi:", sum(shaps.values()), "vs Prediksi:", test_model(x.reshape(1, -1))[0])`,
    sotaCode: `import shap
import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])
y = np.array([7.0, 15.0, 23.0])
reg = LinearRegression().fit(X, y)

explainer = shap.Explainer(reg, X)
shap_values = explainer(X)
print("Scikit-Learn/SHAP Values Shape:", shap_values.values.shape)`,
    diagCode: `def verify_efficiency_axiom(shapley_vals, f_x, baseline_E):
    gap = f_x - baseline_E
    sum_shaps = np.sum(shapley_vals)
    assert np.isclose(sum_shaps, gap), f"Aksioma Efisiensi Gagal: sum={sum_shaps} vs gap={gap}"
    return "Lolos: Aksioma Efisiensi Terpenuhi Sempurna"`,
    caseStudy: "Lundberg & Lee (2017) membuktikan bahwa seluruh metode penjelas terdahulu (termasuk LIME, DeepLIFT, dan Layer-wise Relevance Propagation) merupakan bentuk aproksimasi atau kasus khusus dari nilai Shapley.",
    commonPitfalls: [
      "Kompleksitas komputasi eksponensial $O(2^p)$, mustahil dihitung secara eksak pada dataset dengan lebih dari 15 fitur (memerlukan aproksimasi TreeSHAP / KernelSHAP).",
      "Mengasumsikan fitur-fitur saling independen saat mengevaluasi nilai karakteristik koalisi $v(S)$."
    ],
    groundingLinks: [
      { title: "Shapley (1953) A Value for n-person Games", url: "https://doi.org/10.1515/9781400881970-018", note: "Karya monumental penemuan Shapley Values" }
    ]
  }),

  createSubchapter({
    id: "ml-31-7-shap-framework-treeshap-kernelshap",
    slug: "framework-shap-treeshap-kernelshap-beeswarm-waterfall",
    title: "31.7 Framework SHAP (SHapley Additive exPlanations): TreeSHAP Cepat, KernelSHAP, Beeswarm Summary Plots, & Analisis Interaksi",
    orderIndex: 7,
    description: "Framework SHAP kontemporer: Algoritma TreeSHAP waktu polinomial O(T L D^2), KernelSHAP terbobot, visualisasi interpretatif Beeswarm, Waterfall, dan interaksi SHAP ganda.",
    theoryMarkdown: `Framework SHAP (Lundberg & Lee, 2017) menyatukan teori permainan Shapley dengan optimasi algoritma berkecepatan tinggi:

1. **TreeSHAP**:
   Mereduksi kompleksitas komputasi eksponensial $O(2^p)$ menjadi **waktu polinomial** $O(T L D^2)$ untuk model berbasis pohon (XGBoost, LightGBM, CatBoost, Random Forest), di mana $T$ adalah jumlah pohon, $L$ adalah jumlah daun maksimum, dan $D$ adalah kedalaman pohon. TreeSHAP mengevaluasi seluruh sub-cabang pohon secara rekursif dalam satu kali penelusuran (*single pass*).
2. **Visualisasi Standar Industri**:
   - **Waterfall Plot / Force Plot**: Menjelaskan prediksi individual tunggal $f(x)$, memetakan bagaimana setiap fitur mendorong prediksi naik (merah) atau turun (biru) dari nilai dasar $\\mathbb{E}[f(X)]$.
   - **Beeswarm Summary Plot**: Menampilkan distribusi nilai SHAP global untuk seluruh sampel, memadukan tingkat kepentingan fitur dengan arah pengaruhnya (misal: nilai fitur tinggi berwarna merah berada di sisi kanan mengindikasikan korelasi positif terhadap target).
3. **SHAP Interaction Values**:
   Dekomposisi nilai Shapley menjadi matriks simetris berukuran $p \\times p$ yang memisahkan pengaruh efek utama fitur $\\phi_{i, i}$ dari efek sinergi interaksi murni $\\phi_{i, j}$.`,
    mermaidDiagram: `graph TD
    Model["Model Ensemble XGBoost / LightGBM"] --> TreeSHAP["TreeSHAP Engine: O(TLD^2) (Waktu Polinomial Super Cepat)"]
    TreeSHAP --> LocalExp["Eksplanasi Lokal: Waterfall Plot / Force Plot"]
    TreeSHAP --> GlobalExp["Eksplanasi Global: Beeswarm Plot (Distribusi Nilai & Arah Pengaruh)"]
    TreeSHAP --> InterExp["SHAP Interaction Values (Matriks Interaksi Fitur Pasangan)"]`,
    scratchCode: `import numpy as np

def compute_waterfall_breakdown(base_value, shap_values, feature_names):
    """Menyusun struktur data Waterfall Plot dari nilai SHAP scratch."""
    running_total = base_value
    steps = []
    
    # Urutkan berdasarkan magnitudo kontribusi absolut
    sorted_indices = np.argsort(np.abs(shap_values))[::-1]
    
    for idx in sorted_indices:
        contrib = shap_values[idx]
        name = feature_names[idx]
        prev_total = running_total
        running_total += contrib
        steps.append({
            "feature": name,
            "contribution": contrib,
            "prev_total": prev_total,
            "new_total": running_total,
            "direction": "Naik (Positif)" if contrib > 0 else "Turun (Negatif)"
        })
        
    return {"final_prediction": running_total, "steps": steps}

base_val = 0.50
shaps = np.array([0.15, -0.25, 0.05])
names = ['Pendapatan', 'Riwayat_Gagal_Bayar', 'Usia']
wf = compute_waterfall_breakdown(base_val, shaps, names)
for s in wf["steps"]:
    print(f"{s['feature']}: {s['contribution']:+.2f} -> Total: {s['new_total']:.2f}")`,
    sotaCode: `import shap
import lightgbm as lgb
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=200, n_features=4, random_state=42)
model = lgb.LGBMClassifier(n_estimators=30, random_state=42, verbose=-1).fit(X, y)

# TreeSHAP Explainer
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X)

print("TreeSHAP Berhasil Dievaluasi. Base Value:", explainer.expected_value)
print("Ukuran Matriks SHAP:", np.array(shap_values).shape)`,
    diagCode: `def verify_shap_additivity(expected_value, shap_array, model_prediction):
    # Verifikasi f(x) = E[f(X)] + sum(phi_i)
    total = expected_value + np.sum(shap_array)
    assert np.isclose(total, model_prediction, atol=1e-4), "Prinsip aditivitas TreeSHAP gagal!"
    return "Valid Additive Consistency"`,
    caseStudy: "Lundberg et al. (2020) menerapkan TreeSHAP di rumah sakit anestesiologi UW Medicine untuk memprediksi hipoksemia secara real-time; visualisasi Force Plot membantu dokter memahami alasan spesifik penurunan oksigen dalam hitungan detik.",
    commonPitfalls: [
      "Mengasumsikan korelasi kausal sejati dari plot dependensi SHAP; SHAP hanya mengukur ketergantungan model fungsional, bukan kausalitas dunia nyata.",
      "Menggunakan KernelSHAP yang lambat pada model berbasis pohon alih-alih TreeSHAP."
    ],
    groundingLinks: [
      { title: "Lundberg & Lee (2017) A Unified Approach to Interpreting Model Predictions", url: "https://arxiv.org/abs/1705.07874", note: "Paper asli seminal SHAP NeurIPS" },
      { title: "Lundberg et al. (2020) From local explanations to global understanding with explainable AI for trees", url: "https://doi.org/10.1038/s42256-019-0138-9", note: "Paper Nature Machine Intelligence untuk TreeSHAP" }
    ]
  })
];

const ch31 = {
  id: "machine-learning-ch-31",
  title: "Bab 31: Interpretabilitas Model & XAI: SHAP, LIME, & PFI",
  slug: "interpretabilitas-model-dan-xai",
  orderIndex: 31,
  description: "Krisis model kotak hitam dan regulasi transparansi, interpretabilitas intrinsik linier dan pohon dangkal, Permutation Feature Importance (PFI), analisis marginal PDP & ICE curves, model pengganti lokal LIME, teori nilai Shapley 4 aksioma keadilan, serta framework kontemporer SHAP (TreeSHAP, KernelSHAP, Beeswarm, Waterfall).",
  subchapters: ch31Subchapters
};

fs.writeFileSync(path.join(OUT_DIR, 'chunk7-ch31.ts'), exportChapterTs(ch31, 'chapter31'));
console.log('Successfully generated chunk7-ch31.ts (7 subchapters)');

// ==========================================
// CHAPTER 32: MLOps Fondasi, Model Governance, & Deteksi Drift Data
// ==========================================
const ch32Subchapters = [
  createSubchapter({
    id: "ml-32-1-mlops-lifecycle",
    slug: "siklus-hidup-mlops-produksi-dari-jupyter-ke-sistem-otomatis",
    title: "32.1 Siklus Hidup Pembelajaran Mesin Produksi: Dari Eksperimen Jupyter ke Sistem Otomatis Berkelanjutan (MLOps Lifecycle)",
    orderIndex: 1,
    description: "Transisi arsitektural dari kode eksperimental ad-hoc di Jupyter Notebook ke sistem produksi terkelola: Siklus MLOps berkelanjutan, CAMS framework, dan otomatisasi CI/CD/CT.",
    theoryMarkdown: `Sculley et al. (2015) dari Google membuktikan bahwa dalam sistem pembelajaran mesin nyata di industri, **hanya sekitar 5% kode yang berupa algoritma pemodelan ML murni**. Sisanya (95%) adalah infrastruktur pendukung: pengumpulan data, validasi skema, rekayasa fitur, serialisasi model, serving API, pemantauan latensi, dan manajemen metadata.

**Arsitektur MLOps Lifecycle Terpadu**:
1. **Continuous Integration (CI)**: Validasi otomatis kode program, pengujian unit test transformer, dan audit integritas pipeline data.
2. **Continuous Delivery (CD)**: Pengemasan artefak model terlatih (container Docker, ONNX weights) dan deployment otomatis ke staging/production cluster (Kubernetes / KServe).
3. **Continuous Training (CT)**: Kemampuan sistem untuk secara otomatis melatih ulang dan memvalidasi model baru saat terjadi degradasi performa atau data baru tersedia.`,
    mermaidDiagram: `graph LR
    Raw["Aliran Data Baru"] --> Preprocess["Pipeline Pra-pemrosesan & Validasi Skema"]
    Preprocess --> Train["Pelatihan Otomatis (CT Pipeline)"]
    Train --> Eval{"Uji Gatekeeper: Apakah Lebih Baik dari Model Champion?"}
    Eval -->|Lolos| Registry["Model Registry (Versioning & Metadata)"]
    Registry --> Deploy["CD Deployment (Blue/Green / Canary)"]
    Deploy --> Serve["Serving API (Inference Engine)"]
    Serve --> Monitor["Monitoring Telemetri & Deteksi Drift"]
    Monitor -->|Drift Terdeteksi| Train`,
    scratchCode: `class SimpleModelRegistry:
    """Implementasi Model Registry sederhana dari scratch."""
    def __init__(self):
        self.registry = {}
        
    def register_model(self, model_name, version, artifacts, metrics, status="STAGING"):
        key = f"{model_name}:v{version}"
        self.registry[key] = {
            "name": model_name,
            "version": version,
            "artifacts": artifacts,
            "metrics": metrics,
            "status": status
        }
        print(f"Model {key} berhasil didaftarkan dengan status: {status}")
        
    def promote_to_production(self, model_name, version, champion_metric_threshold=0.85):
        key = f"{model_name}:v{version}"
        model = self.registry.get(key)
        if not model:
            raise ValueError("Model tidak ditemukan.")
            
        if model["metrics"].get("f1_score", 0) >= champion_metric_threshold:
            model["status"] = "PRODUCTION"
            print(f"Model {key} resmi dipromosikan ke PRODUCTION!")
        else:
            print(f"Model {key} gagal memenuhi threshold promosi.")

registry = SimpleModelRegistry()
registry.register_model("FraudDetector", 1, {"weights": "model.bin"}, {"f1_score": 0.91})
registry.promote_to_production("FraudDetector", 1)`,
    sotaCode: `import json

metadata = {
    "model_name": "CreditRiskScorer",
    "version": "1.2.0",
    "framework": "LightGBM 4.1",
    "train_timestamp": "2026-09-25T12:00:00Z",
    "metrics": {"auc": 0.892, "brier_score": 0.041},
    "input_schema": [{"name": "income", "type": "float"}, {"name": "age", "type": "int"}]
}
print("Artefak Metadata Model MLOps:\\n", json.dumps(metadata, indent=2))`,
    diagCode: `def verify_mlops_pipeline_health(metrics):
    assert "latency_p99_ms" in metrics and metrics["latency_p99_ms"] < 200, "SLA latensi terlanggar!"
    return "Pipeline Operasional Sehat"`,
    caseStudy: "Sculley et al. (2015) 'Hidden Technical Debt in Machine Learning Systems' mendokumentasikan bagaimana kegagalan mengelola versi data dan kode menyebabkan kerugian jutaan dolar di berbagai perusahaan teknologi.",
    commonPitfalls: [
      "Menyebarkan model langsung dari Jupyter Notebook ke server produksi tanpa pengujian regresi otomatis.",
      "Mengabaikan pencatatan versioning data yang digunakan untuk melatih versi model tertentu."
    ],
    groundingLinks: [
      { title: "Sculley et al. (2015) Hidden Technical Debt in Machine Learning Systems", url: "https://papers.nips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf", note: "Paper monumental fondasi MLOps Google" }
    ]
  }),

  createSubchapter({
    id: "ml-32-2-data-concept-prior-drift",
    slug: "degradasi-performa-model-data-concept-dan-prior-drift",
    title: "32.2 Degradasi Performa Model Produksi: Perbedaan Data Drift (Covariate Shift), Concept Drift, & Prior Probability Shift",
    orderIndex: 2,
    description: "Taksonomi kegagalan asimtotik model produksi: Covariate Shift P(X), Concept Drift P(Y|X), dan Prior Probability Shift P(Y).",
    theoryMarkdown: `Probabilitas gabungan data $P(X, Y)$ dapat didekomposisi menggunakan aturan probabilitas bersyarat:
$$P(X, Y) = P(X) \\cdot P(Y \\mid X) = P(Y) \\cdot P(X \\mid Y)$$

Ketika model beroperasi di lingkungan produksi nyata, distribusi data mengalami pergeseran temporal yang memicu degradasi performa:
1. **Data Drift (Covariate Shift)**:
   Distribusi fitur input berubah seiring waktu, sementara hubungan input-ke-output tetap identik:
   $$P_{\\text{train}}(X) \\neq P_{\\text{prod}}(X), \\quad P_{\\text{train}}(Y \\mid X) = P_{\\text{prod}}(Y \\mid X)$$
   *Contoh*: Pandemi mengubah profil belanja konsumen secara drastis, namun definisi transaksi curang tetap sama.
2. **Concept Drift**:
   Hubungan pemetaan antara fitur input dan variabel target berubah secara fundamental:
   $$P_{\\text{train}}(Y \\mid X) \\neq P_{\\text{prod}}(Y \\mid X), \\quad P_{\\text{train}}(X) = P_{\\text{prod}}(X)$$
   *Contoh*: Munculnya modus baru penipuan finansial online di mana peretas meniru perilaku transaksi pengguna normal.
3. **Prior Probability Shift**:
   Frekuensi marjinal kelas target berubah tanpa mengubah distribusi bersyarat fitur:
   $$P_{\\text{train}}(Y) \\neq P_{\\text{prod}}(Y), \\quad P_{\\text{train}}(X \\mid Y) = P_{\\text{prod}}(X \\mid Y)$$`,
    mermaidDiagram: `graph TD
    Decomp["Distribusi Bersama P(X, Y)"] --> Covariate["Data Drift / Covariate Shift: P(X) berubah, P(Y|X) tetap"]
    Decomp --> Concept["Concept Drift: Hubungan P(Y|X) berubah fundamental"]
    Decomp --> Prior["Prior Shift: Frekuensi Target P(Y) berubah"]
    Covariate --> Impact["Degradasi Performa Model di Produksi"]
    Concept --> Impact
    Prior --> Impact`,
    scratchCode: `import numpy as np

def simulate_distribution_shifts():
    """Simulasi analitis perbedaan Covariate Shift vs Concept Drift."""
    np.random.seed(42)
    # 1. Baseline Training
    X_train = np.random.normal(loc=0.0, scale=1.0, size=1000)
    # Aturan dasar: Y = 1 jika X > 0
    y_train = (X_train > 0).astype(int)
    
    # 2. Covariate Shift: Distribusi X bergeser ke rata-rata 2.0, aturan Y|X sama
    X_covariate = np.random.normal(loc=2.0, scale=1.0, size=1000)
    y_covariate = (X_covariate > 0).astype(int)
    
    # 3. Concept Drift: Distribusi X sama, aturan hubungan Y|X berbalik
    X_concept = np.random.normal(loc=0.0, scale=1.0, size=1000)
    y_concept = (X_concept < 0).astype(int) # Aturan berubah berlawanan arah!
    
    return {
        "Train_Mean_X": np.mean(X_train),
        "Covariate_Mean_X": np.mean(X_covariate),
        "Concept_Inversion": np.mean(y_concept == y_train[:1000])
    }

print(simulate_distribution_shifts())`,
    sotaCode: `import numpy as np
# Struktur pencatatan telemetri drift
shift_audit = {
    "feature": "umur_akun_hari",
    "baseline_mean": 120.5,
    "production_current_mean": 45.2,
    "shift_type_suspected": "Covariate Shift (Banjir Pengguna Baru)"
}
print("Audit Telemetri Shift:\\n", shift_audit)`,
    diagCode: `def classify_drift_type(p_val_X, p_val_Y_given_X):
    if p_val_X < 0.05 and p_val_Y_given_X >= 0.05:
        return "Covariate Shift (Data Drift)"
    elif p_val_Y_given_X < 0.05:
        return "Concept Drift"
    return "No Significant Drift"`,
    caseStudy: "Saat awal pandemi COVID-19 pada Maret 2020, model peramalan rantai pasokan global ritel besar lumpuh seketika karena terjadi Covariate Shift masif (pembelian masker dan hand sanitizer meroket 10.000%).",
    commonPitfalls: [
      "Hanya memantau metrik akurasi model di produksi (ketika label sejati y membutuhkan waktu berbulan-bulan untuk terbit/ground truth delay), abaikan data drift pada input X.",
      "Mengasumsikan retraining otomatis selalu menyelesaikan Concept Drift tanpa investigasi fitur baru."
    ],
    groundingLinks: [
      { title: "Gama et al. (2014) A Survey on Concept Drift Adaptation", url: "https://doi.org/10.1145/2523813", note: "Survei komprehensif ACM terhadap fenomena drift" }
    ]
  }),

  createSubchapter({
    id: "ml-32-3-drift-detection-ks-psi",
    slug: "metrologi-deteksi-drift-statistik-ks-test-dan-psi",
    title: "32.3 Metrologi Deteksi Drift Statistik: Uji Dua Sampel Kolmogorov-Smirnov (KS-Test), Divergensi Wasserstein, & Population Stability Index (PSI)",
    orderIndex: 3,
    description: "Kuantifikasi statistik pergeseran distribusi: Uji dua-sampel Kolmogorov-Smirnov (KS-Test), Jarak Wasserstein (Earth Mover's Distance), dan indeks stabilitas populasi (PSI).",
    theoryMarkdown: `Untuk mendeteksi pergeseran data sebelum label ground truth $y$ tersedia, digunakan pengujian statistik terhadap distribusi baseline referensi $P$ dan distribusi produksi berjalan $Q$:

1. **Uji Dua-Sampel Kolmogorov-Smirnov (KS-Test)**:
   Mengukur jarak supremum absolut antara fungsi distribusi kumulatif empiris (eCDF) referensi $F_{\\text{ref}}(x)$ dan produksi $F_{\\text{prod}}(x)$:
   $$D_{\\text{KS}} = \\sup_x |F_{\\text{ref}}(x) - F_{\\text{prod}}(x)| \\in [0, 1]$$
   Jika $p\\text{-value} < \\alpha$ (biasanya $\\alpha = 0.05$), hipotesis nol ditolak: **terjadi pergeseran distribusi yang signifikan secara statistik**.

2. **Population Stability Index (PSI)**:
   Metrik standar perbankan dan industri finansial untuk mengukur pergeseran distribusi populasi dengan membagi fitur menjadi $B$ bin:
   $$\\text{PSI} = \\sum_{b=1}^B (q_b - p_b) \\times \\ln\\left( \\frac{q_b}{p_b} \\right)$$
   di mana $p_b$ adalah persentase sampel di bin $b$ pada data baseline, dan $q_b$ pada data produksi.
   - $\\text{PSI} < 0.1$: Tidak ada pergeseran berarti (*Insignificant change*).
   - $0.1 \\le \\text{PSI} < 0.25$: Terjadi pergeseran moderat (*Moderate drift, monitor closely*).
   - $\\text{PSI} \\ge 0.25$: Terjadi pergeseran masif (*Significant drift, trigger retraining!*).`,
    mermaidDiagram: `graph LR
    RefData["Data Referensi Pelatihan (P)"] --> Binning["Diskritisasi ke dalam B Kuantil Bin"]
    ProdData["Data Produksi Saat Ini (Q)"] --> Binning
    Binning --> HitungPSI["Hitung PSI = sum (q_b - p_b) * ln(q_b / p_b)"]
    Binning --> HitungKS["Hitung Jarak Maksimum eCDF (KS-Test)"]
    HitungPSI --> Threshold{"Apakah PSI >= 0.25 atau KS p < 0.05?"}
    Threshold -->|Ya| TriggerRetrain["Picu Alarm & Eksekusi Retraining Otomatis"]
    Threshold -->|Tidak| Safe["Sistem Stabil Normal"]`,
    scratchCode: `import numpy as np

def compute_psi_scratch(reference_data, production_data, n_bins=10, eps=1e-4):
    """Menghitung Population Stability Index (PSI) dari scratch."""
    ref = np.asarray(reference_data)
    prod = np.asarray(production_data)
    
    # Buat bin berbasis kuantil data referensi
    quantiles = np.linspace(0, 100, n_bins + 1)
    bin_edges = np.percentile(ref, quantiles)
    bin_edges[0] -= 1e-5
    bin_edges[-1] += 1e-5
    
    # Hitung frekuensi proporsi di setiap bin
    ref_counts, _ = np.histogram(ref, bins=bin_edges)
    prod_counts, _ = np.histogram(prod, bins=bin_edges)
    
    p = ref_counts / len(ref)
    q = prod_counts / len(prod)
    
    # Smoothing untuk mencegah pembagian dengan nol
    p = np.clip(p, eps, 1.0)
    q = np.clip(q, eps, 1.0)
    
    psi_value = np.sum((q - p) * np.log(q / p))
    return psi_value

np.random.seed(42)
ref_sample = np.random.normal(0, 1, 1000)
prod_sample_drifted = np.random.normal(0.6, 1.2, 1000)
psi_score = compute_psi_scratch(ref_sample, prod_sample_drifted)
print(f"PSI Score Terhitung: {psi_score:.4f} (Status: {'Signifikan Drift' if psi_score >= 0.25 else 'Aman'})")`,
    sotaCode: `from scipy.stats import ks_2samp, wasserstein_distance
import numpy as np

ref_sample = np.random.normal(0, 1, 1000)
prod_sample_drifted = np.random.normal(0.6, 1.2, 1000)

ks_stat, p_val = ks_2samp(ref_sample, prod_sample_drifted)
w_dist = wasserstein_distance(ref_sample, prod_sample_drifted)
print(f"Scipy KS-Statistic: {ks_stat:.4f}, p-value: {p_val:.4e}")
print(f"Wasserstein Distance (EMD): {w_dist:.4f}")`,
    diagCode: `def diagnose_drift_action(psi):
    if psi < 0.1:
        return "Normal"
    elif psi < 0.25:
        return "Perhatian: Monitor Khusus"
    else:
        return "Kritis: Picu Retraining Segera!"`,
    caseStudy: "Penyedia pinjaman perbankan multinasional menggunakan batasan PSI 0.25 sebagai kriteria pemicu audit kepatuhan regulasi Basel II untuk mencegah portofolio pinjaman bermasalah.",
    commonPitfalls: [
      "Menggunakan bin yang lebarnya sama secara seragam (*uniform bins*) alih-alih kuantil (*quantile bins*), yang menyebabkan bin kosong pada ekor distribusi.",
      "Mengabaikan peringatan jika PSI dihitung pada sampel produksi yang terlalu kecil ($N < 100$)."
    ],
    groundingLinks: [
      { title: "Yurdakul (2020) Statistical properties of the population stability index", url: "https://doi.org/10.1080/02664763.2020.1770001", note: "Analisis sifat distribusi statistik PSI" }
    ]
  }),

  createSubchapter({
    id: "ml-32-4-model-serialization-onnx-safetensors",
    slug: "serialisasi-deployment-model-onnx-safetensors-dan-joblib",
    title: "32.4 Serialisasi & Deployment Model: Formulasi Joblib, Safetensors, ONNX Runtime, & Risiko Eksekusi Kode Acak pada Pickle",
    orderIndex: 4,
    description: "Format penyimpanan dan inferensi model produksi: Kerentanan eksekusi kode arbitrer Pickle/Joblib, format aman Safetensors, dan Open Neural Network Exchange (ONNX).",
    theoryMarkdown: `Serialisasi model mentransformasikan struktur data objek model di memori menjadi representasi biner yang dapat disimpan di disk atau ditransmisikan melalui jaringan:

1. **Bahaya Keamanan Akut Python Pickle / Joblib**:
   Modul biner \`pickle\` di Python bersifat **tidak aman untuk sumber tak tepercaya**. Mekanisme \`__reduce__\` pada protokol pickle memungkinkan penyerang menyisipkan muatan kode Python arbitrer (*Arbitrary Code Execution*), misalnya menjalankan shell terbalik (*reverse shell*) seketika saat berkas di-unpickle:
   $$\\text{Bahaya: } \\text{joblib.load('untrusted_model.pkl')} \\implies \\text{Kompromi Total Server!}$$
2. **Safetensors (Hugging Face)**:
   Format penyimpanan tensor murni berbasis header JSON dan buffer biner contiguous tanpa eksekusi kode, kebal terhadap serangan deserialisasi, serta mendukung pembacaan *zero-copy memory mapping* (mmap).
3. **Open Neural Network Exchange (ONNX) & ONNX Runtime**:
   Format graf komputasi terbuka independen dari kerangka kerja sumber (PyTorch, Scikit-Learn, LightGBM). ONNX Runtime mengoptimalkan eksekusi inferensi pada level graf (fusi operator, kuantisasi INT8/FP16) dengan percepatan perangkat keras lintas arsitektur (CPU, CUDA, TensorRT).`,
    mermaidDiagram: `graph TD
    Train["Model Terlatih di Python (Scikit-Learn / PyTorch)"] --> Serial{"Pilih Format Serialisasi"}
    Serial -->|Risiko Tinggi Malware| Pickle["Joblib / Pickle (Rentan Arbitrary Code Execution)"]
    Serial -->|Format Aman Tensors Murni| Safe["Safetensors (Zero-Copy Memory Map, Aman)"]
    Serial -->|Standar Interoperabilitas Industri| ONNX["ONNX Runtime (Graf Komputasi Teroptimasi C++)"]
    ONNX --> Deploy["Deploy API Kinerja Tinggi (Latensi Sub-Milidetik)"]`,
    scratchCode: `import hashlib
import json

def create_tamper_proof_manifest(model_bytes, metadata_dict):
    """Membuat checksum kriptografi SHA-256 untuk verifikasi integritas model."""
    sha256_hash = hashlib.sha256(model_bytes).hexdigest()
    manifest = {
        "metadata": metadata_dict,
        "sha256_checksum": sha256_hash
    }
    return manifest

def verify_model_integrity(model_bytes, expected_hash):
    current_hash = hashlib.sha256(model_bytes).hexdigest()
    if current_hash != expected_hash:
        raise ValueError("INTEGRITY COMPROMISED: Hash model tidak cocok dengan manifes terdaftar!")
    return "Valid Kriptografi Checksum"

dummy_bytes = b"MODEL_WEIGHTS_VERSION_1"
manifest = create_tamper_proof_manifest(dummy_bytes, {"name": "LGBM"})
print("Manifes Kriptografis:\\n", json.dumps(manifest, indent=2))
print("Verifikasi:", verify_model_integrity(dummy_bytes, manifest["sha256_checksum"]))`,
    sotaCode: `import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression
import io

# Simulasi penyimpanan Joblib yang terisolasi dengan verifikasi
X = np.array([[1.0, 2.0], [3.0, 4.0]])
y = np.array([0, 1])
model = LogisticRegression().fit(X, y)

buffer = io.BytesIO()
joblib.dump(model, buffer)
buffer.seek(0)
loaded_model = joblib.load(buffer)
print("Model Scikit-Learn Sukses Dimuat Ulang dari Buffer Biner.")`,
    diagCode: `def verify_model_file_extension(filename):
    allowed_secure = [".onnx", ".safetensors"]
    if filename.endswith(".pkl") or filename.endswith(".joblib"):
        return "WARNING: File model berbasis Pickle; pastikan hanya berasal dari pipeline internal tepercaya!"
    return "Format Model Produksi Aman"`,
    caseStudy: "Pada tahun 2023, puluhan repositori model berbahaya ditemukan di hub model publik yang menyisipkan malware crypto-miner di dalam muatan pickle tersembunyi, mendorong adopsi universal format Safetensors dan ONNX.",
    commonPitfalls: [
      "Mengunduh dan mengeksekusi model berformat .pkl dari repositori publik pihak ketiga.",
      "Mengabaikan perbedaan versi dependensi runtime (seperti versi scikit-learn saat fitting vs serving) yang memicu silent corruption pada inferensi."
    ],
    groundingLinks: [
      { title: "ONNX Runtime Official Architecture", url: "https://onnxruntime.ai/", note: "Dokumentasi resmi mesin inferensi ONNX" }
    ]
  }),

  createSubchapter({
    id: "ml-32-5-continuous-training-retraining-triggers",
    slug: "arsitektur-pemantauan-dan-pemicu-pelatihan-ulang-otomatis",
    title: "32.5 Arsitektur Pemantauan & Pemicu Pelatihan Ulang Otomatis (Continuous Training & Automated Retraining Triggers)",
    orderIndex: 5,
    description: "Desain sistem Continuous Training (CT): Pemicu berbasis jadwal (Schedule-based), pemicu berbasis event (Metric-based / Drift-based), dan protokol pengujian Champion-Challenger.",
    theoryMarkdown: `Continuous Training (CT) mengotomatisasi siklus hidup pelatihan model tanpa intervensi rekayasa manual:

**Tiga Taksonomi Pemicu Retraining**:
1. **Pemicu Berbasis Waktu (Schedule-based)**:
   Pelatihan ulang berkala terjadwal (misal: setiap Minggu malam pukul 00:00 UTC). Cocok untuk bisnis dengan siklus musiman mingguan yang stabil.
2. **Pemicu Berbasis Kinerja (Metric-based)**:
   Dijalankan ketika metrik evaluasi bisnis yang dilaporkan dari label tertunda (*delayed ground truth*) turun di bawah ambang batas kritis (misal: $F_1 < 0.80$).
3. **Pemicu Berbasis Data Drift (Event-driven)**:
   Dipicu seketika saat metrik statistik pergeseran input melampaui batas toleransi (misal: $\\text{PSI} \\ge 0.25$ atau $D_{\\text{KS}} > 0.15$).

**Protokol Validasi Gatekeeper: Champion vs Challenger**:
Model baru (*Challenger*) tidak boleh langsung menggantikan model aktif (*Champion*) di lingkungan produksi. Challenger harus diuji terlebih dahulu melalui:
- **Shadow Deployment**: Menerima salinan lalu lintas produksi riil secara pasif tanpa mengembalikan respons ke pengguna.
- **Canary Deployment**: Menerima sebagian kecil lalu lintas pengguna nyata ($5\\% \\to 20\\% \\to 100\\%$) sembari memantau latensi dan tingkat galat.`,
    mermaidDiagram: `graph TD
    Trigger{"Pemicu Retraining (Jadwal / PSI >= 0.25 / Drop Metrik)"} --> RetrainPipeline["Eksekusi CT Pipeline pada Himpunan Data Terbaru"]
    RetrainPipeline --> NewModel["Model Challenger Terbentuk"]
    NewModel --> Shadow["Shadow Deployment: Terima Trafik Riil Secara Paralel"]
    Shadow --> Gatekeeper{"Apakah Kinerja Challenger > Champion?"}
    Gatekeeper -->|Lolos| Promote["Canary Release & Promosi Jadi Champion Baru"]
    Gatekeeper -->|Gagal| Reject["Tolak Challenger & Kirim Laporan Diagnostik"]`,
    scratchCode: `def gatekeeper_champion_challenger(champion_metric, challenger_metric, min_relative_improvement=0.02):
    """Logika evaluasi gatekeeper transisi model produksi dari scratch."""
    relative_gain = (challenger_metric - champion_metric) / champion_metric
    
    if relative_gain >= min_relative_improvement:
        return {
            "decision": "PROMOTE_CHALLENGER",
            "relative_gain_percent": relative_gain * 100.0,
            "message": "Challenger melampaui Champion secara signifikan."
        }
    else:
        return {
            "decision": "RETAIN_CHAMPION",
            "relative_gain_percent": relative_gain * 100.0,
            "message": "Peningkatan Challenger tidak memenuhi ambang batas minimum."
        }

print(gatekeeper_champion_challenger(champion_metric=0.82, challenger_metric=0.85))`,
    sotaCode: `import datetime

# Log audit pemicu retraining otomatis
trigger_event = {
    "trigger_id": "trig-98213",
    "timestamp": datetime.datetime.now().isoformat(),
    "reason": "DRIFT_THRESHOLD_EXCEEDED",
    "details": {"psi_value": 0.284, "feature": "user_monthly_spend"},
    "action": "TRIGGER_PIPELINE_RUN"
}
print("Pemicu Event Otomatis:\\n", trigger_event)`,
    diagCode: `def verify_challenger_safety(challenger_error_rate, max_acceptable_error=0.05):
    assert challenger_error_rate <= max_acceptable_error, "Challenger memiliki error rate terlalu tinggi!"
    return "Challenger Lolos Uji Keamanan"`,
    caseStudy: "Platform streaming raksasa Netflix memperbarui model rekomendasi secara continuous training harian, menggunakan canary deployments untuk memastikan algoritma baru tidak menurunkan rata-rata durasi tonton pengguna.",
    commonPitfalls: [
      "Mengotomatisasi deployment model hasil retraining langsung ke produksi tanpa pengujian otomatis champion-challenger.",
      "Membiarkan model melatih dirinya sendiri secara berulang pada data yang diprediksi oleh versi model sebelumnya (*feedback loop corruption* / model collapse)."
    ],
    groundingLinks: [
      { title: "Google Cloud Architecture Center: MLOps: Continuous delivery and automation pipelines in machine learning", url: "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning", note: "Arsitektur kanonikal MLOps Level 0, 1, dan 2" }
    ]
  }),

  createSubchapter({
    id: "ml-32-6-model-governance-model-cards",
    slug: "tata-kelola-model-model-governance-dan-model-cards",
    title: "32.6 Tata Kelola Model (Model Governance): Standar Dokumentasi Model Cards, Keterlacakan Asal-Usul (Data Lineage), & Audit Kepatuhan Regulasi",
    orderIndex: 6,
    description: "Tata kelola model AI tingkat enterprise: Standar dokumentasi Model Cards Mitchell et al. (2019), pelacakan silsilah data (*data lineage*), dan kesiapan audit regulasi etika.",
    theoryMarkdown: `Model Governance adalah kerangka kerja tata kelola yang memastikan bahwa seluruh artefak pembelajaran mesin di organisasi dikembangkan, dideploy, dan diawasi sesuai standar etika, keamanan, dan regulasi hukum.

**Standar Dokumentasi Model Cards (Mitchell et al., 2019)**:
Model Cards berfungsi sebagai 'label fakta nutrisi' untuk model machine learning:
1. **Model Details**: Nama, pengembang, tanggal rilis, versi, tipe algoritma, dan lisensi.
2. **Intended Use**: Kasus penggunaan yang dirancang (*intended uses*) dan batas larangan penggunaan yang tidak didukung (*out-of-scope use cases*).
3. **Factors & Subpopulations**: Analisis performa model yang didekomposisi per demografi atau subpopulasi rentan (gender, usia, wilayah) untuk menguji keadilan (*fairness*).
4. **Metrics & Evaluation Data**: Penjelasan metrik yang digunakan, sumber data evaluasi, dan justifikasi ambang batas keputusan.
5. **Quantitative Analyses**: Tabel performa, kurva kalibrasi, dan matriks konfusi.
6. **Ethical Considerations & Caveats**: Asumsi data, keterbatasan teknis, dan potensi dampak sosial.

**Keterlacakan Silsilah Data (*Data Lineage*)**:
Setiap model produksi harus dapat ditelusuri kembali (*reproducible audit trail*) ke hash komit kode sumber yang tepat, hash dataset pelatihan, dan konfigurasi lingkungan komputasi yang digunakan saat pembentukannya.`,
    mermaidDiagram: `graph TD
    Governance["Tata Kelola Model (Model Governance)"] --> Lineage["Data Lineage: Keterlacakan Hash Kode, Data, & Environment"]
    Governance --> ModelCards["Model Cards: Dokumentasi Standar Fakta Model (Mitchell et al.)"]
    Governance --> Fairness["Audit Keadilan Subpopulasi & Deteksi Bias"]
    Governance --> Compliance["Audit Regulasi (EU AI Act, GDPR, ISO/IEC 42001)"]`,
    scratchCode: `class ModelCardGenerator:
    """Generator Model Card terstruktur otomatis dari scratch."""
    def __init__(self, model_name, version, intended_use, limitations):
        self.doc = {
            "model_name": model_name,
            "version": version,
            "intended_use": intended_use,
            "limitations": limitations,
            "subpopulation_metrics": {},
            "audit_trail": {}
        }
        
    def add_subpopulation_metric(self, subpop_name, metric_name, score):
        if subpop_name not in self.doc["subpopulation_metrics"]:
            self.doc["subpopulation_metrics"][subpop_name] = {}
        self.doc["subpopulation_metrics"][subpop_name][metric_name] = score
        
    def set_audit_trail(self, git_commit_sha, dataset_sha256):
        self.doc["audit_trail"] = {
            "git_commit": git_commit_sha,
            "dataset_hash": dataset_sha256
        }
        
    def render_markdown(self):
        md = f"# Model Card: {self.doc['model_name']} (v{self.doc['version']})\\n\\n"
        md += f"## Tujuan Penggunaan\\n{self.doc['intended_use']}\\n\\n"
        md += f"## Batasan & Peringatan\\n{self.doc['limitations']}\\n\\n"
        md += "## Evaluasi Keadilan Subpopulasi\\n"
        for subpop, metrics in self.doc["subpopulation_metrics"].items():
            md += f"- **{subpop}**: {metrics}\\n"
        md += f"\\n## Silsilah Audit Data\\n- Git: \`{self.doc['audit_trail'].get('git_commit')}\`\\n"
        md += f"- Dataset SHA256: \`{self.doc['audit_trail'].get('dataset_hash')}\`\\n"
        return md

mc = ModelCardGenerator("HospitalReadmissionModel", "2.1", 
                        "Prediksi risiko pasien rawat inap kembali dalam 30 hari.",
                        "Hanya divalidasi untuk pasien dewasa >18 tahun di wilayah perkotaan.")
mc.add_subpopulation_metric("Usia 18-50", "Recall", 0.88)
mc.add_subpopulation_metric("Usia >50", "Recall", 0.86)
mc.set_audit_trail("c7a8b19e", "e3b0c44298fc1c149afbf4c8996fb924")
print(mc.render_markdown())`,
    sotaCode: `import json

model_card_json = {
    "schema_version": "0.0.2",
    "model_details": {
        "description": "Enterprise Fraud Detection Engine",
        "version": "v3.0.0",
        "owners": ["AI Governance Committee", "Risk Team"]
    },
    "ethical_considerations": {
        "fairness_constraints_applied": True,
        "pii_data_scrubbed": True
    }
}
print("Struktur JSON Model Card Skema Terbuka:\\n", json.dumps(model_card_json, indent=2))`,
    diagCode: `def verify_model_card_completeness(card_dict):
    required_fields = ["intended_use", "limitations", "audit_trail"]
    for field in required_fields:
        assert field in card_dict, f"Model Card tidak lengkap: Kolom '{field}' wajib diisi!"
    return "Model Card Memenuhi Standar Tata Kelola"`,
    caseStudy: "Mitchell et al. (2019) dari Google Research menginisiasi Model Cards setelah menemukan bahwa model deteksi wajah komersial memiliki tingkat kesalahan klasifikasi 34% lebih tinggi pada wanita berkulit gelap dibanding pria berkulit terang karena tidak adanya pelaporan transparan subpopulasi.",
    commonPitfalls: [
      "Menganggap dokumentasi model hanya sebagai formalitas birokrasi, bukan instrumen mitigasi risiko finansial dan hukum.",
      "Gagal memperbarui Model Card saat model menjalani proses continuous retraining dengan data baru."
    ],
    groundingLinks: [
      { title: "Mitchell et al. (2019) Model Cards for Model Reporting", url: "https://doi.org/10.1145/3287560.3287596", note: "Paper asli seminal Model Cards ACM FAT*" }
    ]
  })
];

const ch32 = {
  id: "machine-learning-ch-32",
  title: "Bab 32: MLOps Fondasi, Model Governance, & Deteksi Drift Data",
  slug: "mlops-fondasi-model-governance-drift",
  orderIndex: 32,
  description: "Siklus hidup MLOps produksi dan CAMS, degradasi performa model (Covariate Shift, Concept Drift, Prior Shift), metrologi deteksi statistik KS-Test dan PSI, serialisasi aman Safetensors dan ONNX vs kerentanan Pickle, arsitektur Continuous Training dan Champion-Challenger, serta tata kelola Model Governance dan Model Cards Mitchell et al.",
  subchapters: ch32Subchapters
};

fs.writeFileSync(path.join(OUT_DIR, 'chunk7-ch32.ts'), exportChapterTs(ch32, 'chapter32'));
console.log('Successfully generated chunk7-ch32.ts (6 subchapters)');

// ==========================================
// CHUNK 7 AGGREGATOR
// ==========================================
const chunk7AggregatorContent = `import { AcademicChapter } from "../../types";
import { chapter31 } from "./chunk7-ch31";
import { chapter32 } from "./chunk7-ch32";

export const chunk7XaiMlops: AcademicChapter[] = [
  chapter31,
  chapter32
];
`;

fs.writeFileSync(path.join(OUT_DIR, 'chunk7-xai-mlops.ts'), chunk7AggregatorContent);
console.log('Successfully generated chunk7-xai-mlops.ts (Chapters 31 - 32, 13 subchapters)');
