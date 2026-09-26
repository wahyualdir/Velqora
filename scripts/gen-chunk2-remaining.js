const fs = require('fs');
const path = require('path');
const { createSubchapter, exportChapterTs } = require('./curriculum-builder-helper');

const outDir = path.join(__dirname, '../src/lib/curriculum/topics/machine-learning');

// ============================================================================
// BAB 07
// ============================================================================
const ch07Subs = [
  createSubchapter({
    id: "ml-07-1-multikolinearitas-ekstrem-vif",
    slug: "07-1-multikolinearitas-ekstrem-vif",
    title: "07.1 Masalah Multikolinearitas Ekstrem, Il-Conditioning Matriks, & Inflasi Varians Parameter (VIF)",
    orderIndex: 1,
    description: "Analisis patologi multikolinearitas: matriks Grammian X^T X ill-conditioned, ledakan varians estimator OLS, dan metrik Variance Inflation Factor (VIF).",
    theoryMarkdown: `Ketika terdapat ketergantungan linier mendekati sempurna antar-kolom matriks $\\mathbf{X}$, matriks $\\mathbf{X}^T\\mathbf{X}$ memiliki determinan mendekati nol dan condition number $\\kappa(\\mathbf{X}^T\\mathbf{X}) = \\lambda_{\\max} / \\lambda_{\\min} \\gg 1000$.

Varians parameter OLS membengkak secara eksponensial:
$$\\text{Var}(\\hat{\\beta}_j) = \\frac{\\sigma^2}{\\sum_{i=1}^n (X_{ij} - \\bar{X}_j)^2} \\times \\text{VIF}_j$$
di mana $\\text{VIF}_j = \\frac{1}{1 - R_j^2}$, dan $R_j^2$ adalah koefisien determinasi regresi fitur $X_j$ terhadap semua fitur prediktor lainnya. Nilai $\\text{VIF} > 10$ mengindikasikan multikolinearitas parah.`,
    mermaidDiagram: `graph TD
    Corr["Fitur-fitur Saling Berkorelasi Tinggi"] --> Det["det(X^T X) -> 0 & Condition Number -> inf"]
    Det --> Inf["VIF_j = 1 / (1 - R_j^2) > 10"]
    Inf --> Var["Var(beta_j) Meledak"]
    Var --> Instab["Koefisien Menjadi Sangat Tidak Stabil & Berlawanan Tanda"]
    Instab --> Reg["Solusi: Regularisasi Penalti (Ridge / Lasso / ElasticNet)"]`,
    scratchCode: `import numpy as np

def calculate_vif_manual(X_features: np.ndarray) -> np.ndarray:
    p = X_features.shape[1]
    vifs = np.zeros(p)
    for j in range(p):
        y_j = X_features[:, j]
        X_others = np.delete(X_features, j, axis=1)
        X_others_bias = np.hstack([np.ones((len(y_j), 1)), X_others])
        beta = np.linalg.solve(X_others_bias.T @ X_others_bias, X_others_bias.T @ y_j)
        y_pred = X_others_bias @ beta
        r2 = 1 - np.sum((y_j - y_pred)**2) / np.sum((y_j - np.mean(y_j))**2)
        vifs[j] = 1.0 / (1.0 - r2) if (1.0 - r2) > 1e-10 else 1e10
    return vifs

np.random.seed(42)
x1 = np.random.randn(100)
x2 = x1 + np.random.randn(100) * 0.05
x3 = np.random.randn(100)
X_test = np.column_stack([x1, x2, x3])
print("VIF Values:", np.round(calculate_vif_manual(X_test), 2))`,
    sotaCode: `from statsmodels.stats.outliers_influence import variance_inflation_factor

vifs_sm = [variance_inflation_factor(X_test, i) for i in range(X_test.shape[1])]
print("Statsmodels VIF:", np.round(vifs_sm, 2))`,
    diagCode: `cond_number = np.linalg.cond(X_test.T @ X_test)
print(f"Condition Number Matriks Grammian: {cond_number:.2e} (>1000 = Ill-conditioned)")`,
    caseStudy: "Pemodelan risiko kredit perbankan: Fitur pendapatan tahunan, gaji bulanan, dan total tabungan sering kali memiliki VIF > 50, merusak interpretasi bobot risiko jika tidak diregularisasi.",
    commonPitfalls: [
      "Mengasumsikan p-value tinggi berarti variabel tidak berguna. Pada multikolinearitas, dua variabel penting dapat memiliki p-value > 0.5 secara bersamaan karena saling membatalkan varians!"
    ],
    groundingLinks: [
      { title: "Tibshirani (1996) Regression Shrinkage via Lasso", url: "https://doi.org/10.1111/j.2517-6161.1996.tb02080.x", note: "Paper pendirian regularisasi L1 dan penanganan kolinearitas" }
    ]
  }),

  createSubchapter({
    id: "ml-07-2-ridge-regression-l2",
    slug: "07-2-ridge-regression-l2",
    title: "07.2 Ridge Regression (Tikhonov L2): Penurunan Bias Terkendali & Reduksi Varians Analitis",
    orderIndex: 2,
    description: "Penurunan analitis Ridge Regression (regularisasi Tikhonov L2): modifikasi matriks normal via (X^T X + lambda I)^(-1), analisis penyusutan SVD, dan trade-off bias-varians.",
    theoryMarkdown: `Ridge Regression menambahkan penalti norma $L_2$ kuadrat pada fungsi kerugian OLS:
$$J_{\\text{Ridge}}(\\boldsymbol{\\beta}) = \\|\\mathbf{y} - \\mathbf{X}\\boldsymbol{\\beta}\\|_2^2 + \\lambda \\|\\boldsymbol{\\beta}\\|_2^2$$

Solusi analitis tertutup diperoleh dengan menyamakan gradien ke nol:
$$\\nabla_{\\boldsymbol{\\beta}} J = -2\\mathbf{X}^T\\mathbf{y} + 2\\mathbf{X}^T\\mathbf{X}\\boldsymbol{\\beta} + 2\\lambda\\boldsymbol{\\beta} = \\mathbf{0} \\implies \\hat{\\boldsymbol{\\beta}}_{\\text{Ridge}} = (\\mathbf{X}^T\\mathbf{X} + \\lambda \\mathbf{I}_p)^{-1}\\mathbf{X}^T\\mathbf{y}$$`,
    mermaidDiagram: `graph LR
    Lambda["Hiperparameter Regularisasi lambda"] --> Invert["Matriks (X^T X + lambda I) selalu Invertibel"]
    Lambda --> Bias["Bias Estimator Meningkat: E[beta_hat] != beta"]
    Lambda --> Var["Varians Turun Drastis: Var(beta_hat) << Var(OLS)"]
    Bias & Var --> Opt["MSE Total = Bias^2 + Varians Mencapai Minimum Global"]`,
    scratchCode: `import numpy as np

def ridge_regression_manual(X: np.ndarray, y: np.ndarray, lmbda: float = 1.0) -> np.ndarray:
    p = X.shape[1]
    I = np.eye(p)
    return np.linalg.solve(X.T @ X + lmbda * I, X.T @ y)

np.random.seed(42)
X_ill = np.random.randn(50, 10)
X_ill[:, 1] = X_ill[:, 0] + np.random.randn(50) * 1e-4
y_ill = X_ill @ np.ones(10) + np.random.randn(50)

b_ridge = ridge_regression_manual(X_ill, y_ill, lmbda=10.0)
print("Norm Bobot Ridge :", np.linalg.norm(b_ridge))`,
    sotaCode: `from sklearn.linear_model import Ridge

ridge_model = Ridge(alpha=10.0, fit_intercept=False)
ridge_model.fit(X_ill, y_ill)
print("Scikit-learn Ridge coefs norm:", np.linalg.norm(ridge_model.coef_))`,
    diagCode: `print("Matriks (X^T X + lambda I) Condition Number:", np.linalg.cond(X_ill.T @ X_ill + 10.0 * np.eye(10)))`,
    caseStudy: "Regresi genomika ekspresi gen: p = 20,000 jauh melebihi jumlah pasien n = 100. Ridge regression mencegah overfitting.",
    commonPitfalls: [
      "Menerapkan penalti L2 pada kolom intersep bias beta_0. Intersep tidak boleh diregularisasi."
    ],
    groundingLinks: [
      { title: "Scikit-Learn Ridge Documentation", url: "https://scikit-learn.org/stable/modules/linear_model.html#ridge-regression", note: "Dokumentasi resmi modul Ridge" }
    ]
  }),

  createSubchapter({
    id: "ml-07-3-lasso-regression-l1",
    slug: "07-3-lasso-regression-l1",
    title: "07.3 Lasso Regression (L1 Penalty): Geometri Subgradient, Sparsitas Parameter, & Soft-Thresholding",
    orderIndex: 3,
    description: "Analisis matematis Lasso: penalti L1, geometri belah ketupat, subgradient non-smooth, dan operator soft-thresholding.",
    theoryMarkdown: `Lasso Regression menggunakan penalti norma $L_1$:
$$J_{\\text{Lasso}}(\\boldsymbol{\\beta}) = \\frac{1}{2n} \\|\\mathbf{y} - \\mathbf{X}\\boldsymbol{\\beta}\\|_2^2 + \\lambda \\|\\boldsymbol{\\beta}\\|_1$$
Kontur belah ketupat $L_1$ menghasilkan solusi jarang (*sparse solution*) di mana parameter fitur tidak penting bernilai nol tepat.`,
    mermaidDiagram: `graph TD
    OLS["OLS Unconstrained Minimum"] --> Contour["Kontur Elips Fungsi Kerugian SSR"]
    Contour --> L1["Penalti L1: Batas Belah Ketupat"]
    L1 --> Cut["Kontak Pertama pada Sumbu Koordinat"]
    Cut --> Sparsity["Fitur Tidak Penting Dipaksa Tepat Nol (beta_j = 0)"]`,
    scratchCode: `def soft_thresholding(rho: float, lmbda: float) -> float:
    if rho > lmbda:
        return rho - lmbda
    elif rho < -lmbda:
        return rho + lmbda
    return 0.0

print("Soft-threshold(2.5, 1.0) =", soft_thresholding(2.5, 1.0))`,
    sotaCode: `from sklearn.linear_model import Lasso

lasso = Lasso(alpha=0.5, fit_intercept=False)
lasso.fit(X_ill, y_ill)
print("Jumlah Fitur Tepat Nol:", np.sum(lasso.coef_ == 0))`,
    diagCode: `print("Indeks Fitur Non-Zero Terpilih:", np.where(lasso.coef_ != 0)[0])`,
    caseStudy: "Deteksi biomarker biologis pada sekuensing DNA: Memilih 15 gen kunci dari 20,000 varian kandidat.",
    commonPitfalls: ["Menggunakan Lasso pada data yang belum distandarisasi."],
    groundingLinks: [{ title: "Tibshirani (1996) Lasso Paper", url: "https://doi.org/10.1111/j.2517-6161.1996.tb02080.x", note: "Paper asli penemuan Lasso" }]
  }),

  createSubchapter({
    id: "ml-07-4-coordinate-descent-lasso",
    slug: "07-4-coordinate-descent-lasso",
    title: "07.4 Algoritma Siklik Coordinate Descent untuk Solusi Eksak Lasso & Waktu Konvergensi",
    orderIndex: 4,
    description: "Implementasi Coordinate Descent untuk Lasso: optimasi sekuensial 1-D, pembaruan soft-thresholding, dan jaminan konvergensi.",
    theoryMarkdown: `Pembaruan koordinat ke-$j$ pada Coordinate Descent Lasso:
$$\\beta_j \\leftarrow \\frac{\\mathcal{S}_{n\\lambda}(\\mathbf{x}_j^T (\\mathbf{y} - \\mathbf{X}_{(-j)}\\boldsymbol{\\beta}_{(-j)}))}{\\|\\mathbf{x}_j\\|_2^2}$$`,
    mermaidDiagram: `graph LR
    Iter["Iterasi Fitur j = 1..p"] --> Part["Residu Parsial r^(j)"]
    Part --> Upd["Soft-Thresholding Pembaruan beta_j"]
    Upd --> Conv{"Konvergen?"}
    Conv -- Ya --> End["Solusi Optimal"]
    Conv -- Tidak --> Iter`,
    scratchCode: `def lasso_coordinate_descent(X, y, lmbda, max_iter=500):
    n, p = X.shape
    beta = np.zeros(p)
    norm_x2 = np.sum(X**2, axis=0)
    for _ in range(max_iter):
        for j in range(p):
            res_j = y - (X @ beta) + X[:, j] * beta[j]
            rho_j = np.dot(X[:, j], res_j)
            beta[j] = soft_thresholding(rho_j, n * lmbda) / norm_x2[j]
    return beta

b_cd = lasso_coordinate_descent(X_ill, y_ill, lmbda=0.5)
print("Manual Coordinate Descent Coefs:", np.round(b_cd[:5], 4))`,
    sotaCode: `from sklearn.linear_model import Lasso

lasso_skl = Lasso(alpha=0.5, fit_intercept=False).fit(X_ill, y_ill)
print("Scikit-learn Coefs             :", np.round(lasso_skl.coef_[:5], 4))`,
    diagCode: `print("Maksimum deviasi manual vs skl:", np.max(np.abs(b_cd - lasso_skl.coef_)))`,
    caseStudy: "Pelatihan model periklanan online berdimensi jutaan fitur sparse.",
    commonPitfalls: ["Inisialisasi yang tidak stabil pada fitur dengan multikolinearitas ekstrem."],
    groundingLinks: [{ title: "Friedman et al. Coordinate Descent", url: "https://doi.org/10.18637/jss.v033.i01", note: "Paper glmnet" }]
  }),

  createSubchapter({
    id: "ml-07-5-elasticnet-regression",
    slug: "07-5-elasticnet-regression",
    title: "07.5 ElasticNet Regression: Menggabungkan L1 dan L2 untuk Mengatasi Pengelompokan Fitur Kolinier",
    orderIndex: 5,
    description: "Kombinasi konveks penalti L1 dan L2 pada ElasticNet: penyelesaian kelemahan Lasso pada multikolinearitas dan grouping effect.",
    theoryMarkdown: `Fungsi kerugian ElasticNet:
$$J(\\boldsymbol{\\beta}) = \\frac{1}{2n}\\|\\mathbf{y} - \\mathbf{X}\\boldsymbol{\\beta}\\|_2^2 + \\lambda \\left[ \\alpha \\|\\boldsymbol{\\beta}\\|_1 + \\frac{1 - \\alpha}{2} \\|\\boldsymbol{\\beta}\\|_2^2 \\right]$$`,
    mermaidDiagram: `graph TD
    ElasticNet["ElasticNet"] --> L1["Komponen L1 (alpha): Sparsitas"]
    ElasticNet --> L2["Komponen L2 (1-alpha): Grouping Effect & Stabilitas"]`,
    scratchCode: `def elasticnet_cd(X, y, lmbda, alpha=0.5, max_iter=500):
    n, p = X.shape
    beta = np.zeros(p)
    norm_x2 = np.sum(X**2, axis=0)
    for _ in range(max_iter):
        for j in range(p):
            res_j = y - (X @ beta) + X[:, j] * beta[j]
            rho_j = np.dot(X[:, j], res_j)
            beta[j] = soft_thresholding(rho_j, n * lmbda * alpha) / (norm_x2[j] + n * lmbda * (1 - alpha))
    return beta

b_enet = elasticnet_cd(X_ill, y_ill, lmbda=0.5, alpha=0.5)
print("Manual ElasticNet Coefs:", np.round(b_enet[:5], 4))`,
    sotaCode: `from sklearn.linear_model import ElasticNet

enet = ElasticNet(alpha=0.5, l1_ratio=0.5, fit_intercept=False).fit(X_ill, y_ill)
print("Scikit-Learn ElasticNet :", np.round(enet.coef_[:5], 4))`,
    diagCode: `print("Jumlah Fitur Non-Zero ElasticNet:", np.sum(enet.coef_ != 0))`,
    caseStudy: "Analisis jalur ekspresi genetik mikroRNA di mana gen-gen terkait bekerja secara sinergis.",
    commonPitfalls: ["Lupa menyetel parameter l1_ratio secara sistematis via GridSearchCV."],
    groundingLinks: [{ title: "Zou & Hastie (2005) Elastic Net", url: "https://doi.org/10.1111/j.1467-9868.2005.00503.x", note: "Paper pendirian ElasticNet" }]
  }),

  createSubchapter({
    id: "ml-07-6-lars-dan-scad",
    slug: "07-6-lars-dan-scad",
    title: "07.6 Least Angle Regression (LARS) & Regularisasi Non-Konveks Modern (SCAD & MCP)",
    orderIndex: 6,
    description: "Algoritma LARS untuk penelusuran jalur regularisasi piecewise-linear dan penalti non-konveks SCAD/MCP dengan Oracle Property.",
    theoryMarkdown: `LARS bergerak di sepanjang vektor pembagi sudut (equiangular vector) fitur-fitur aktif. Penalti non-konveks SCAD meratakan penalti pada nilai parameter besar sehingga meminimalkan bias estimasi.`,
    mermaidDiagram: `graph LR
    LARS["LARS"] --> Equi["Equiangular Direction"] --> Path["Exact Regularization Path"]
    SCAD["SCAD & MCP"] --> NonConvex["Non-Convex Penalty"] --> Oracle["Oracle Property (Unbiased for Large Beta)"]`,
    scratchCode: `def lars_top_corr(X, y):
    corr = X.T @ y / np.linalg.norm(X, axis=0)
    best = np.argmax(np.abs(corr))
    return best, corr[best]

feat, corr = lars_top_corr(X_ill, y_ill)
print(f"Top LARS feature: {feat}, corr: {corr:.4f}")`,
    sotaCode: `from sklearn.linear_model import lars_path

alphas, active, coef_path = lars_path(X_ill, y_ill, method='lasso')
print("Active features sequence:", active)`,
    diagCode: `print("Total LARS Path Steps:", len(alphas))`,
    caseStudy: "Pencitraan MRI Beresolusi Tinggi berbasis Compressed Sensing.",
    commonPitfalls: ["Sensitivitas tinggi terhadap derau pada matriks fitur yang sangat kolinier."],
    groundingLinks: [{ title: "Efron et al. (2004) LARS", url: "https://doi.org/10.1214/009053604000000067", note: "Paper LARS Annals of Statistics" }]
  })
];

const chapter07 = {
  id: "machine-learning-ch-07",
  slug: "bab-07-regularisasi-linier-lanjut-ridge-lasso-elasticnet-lars-scad",
  title: "BAB 07: Regularisasi Linier Lanjut: Ridge, Lasso, ElasticNet, LARS, & SCAD",
  orderIndex: 7,
  description: "Teori dan implementasi komprehensif regularisasi linier: patologi multikolinearitas dan VIF, Ridge regression (Tikhonov L2), Lasso regression (L1) dan Coordinate Descent, ElasticNet grouping effect, LARS, serta penalti non-konveks SCAD dan MCP.",
  coreConcepts: [
    "Multikolinearitas & Variance Inflation Factor (VIF)",
    "Ridge Regression & SVD Shrinkage Factor",
    "Lasso Regression, Sparsitas, & Soft-Thresholding",
    "Algoritma Siklik Coordinate Descent",
    "ElasticNet & Grouping Effect",
    "LARS & Regularisasi Non-Konveks (SCAD & MCP)"
  ],
  subchapters: ch07Subs
};

fs.writeFileSync(path.join(outDir, 'chunk2-ch07.ts'), exportChapterTs(chapter07, 'chapter07'), 'utf-8');
console.log('Successfully generated chunk2-ch07.ts (6 subchapters)');


// ============================================================================
// BAB 08: Model Klasifikasi Linier: Regresi Logistik, Softmax, & IRLS (6 Subbab)
// ============================================================================
const ch08Subs = [
  createSubchapter({
    id: "ml-08-1-model-peluang-klasifikasi-biner",
    slug: "08-1-model-peluang-klasifikasi-biner",
    title: "08.1 Model Peluang Klasifikasi Biner, Odds Ratio, Log-Odds, & Fungsi Sigmoid Terstabilkan",
    orderIndex: 1,
    description: "Pemodelan peluang biner melalui link logit: Odds Ratio, Log-Odds, dan fungsi Sigmoid logistik terstabilkan numerik.",
    theoryMarkdown: `Model Regresi Logistik memetakan kombinasi linier $z = \\mathbf{w}^T\\mathbf{x} + b$ ke peluang posterior $p \\in (0, 1)$ menggunakan fungsi Sigmoid:
$$\\sigma(z) = \\frac{1}{1 + e^{-z}} = \\frac{e^z}{1 + e^z}$$

Odds Ratio didefinisikan sebagai rasio peluang sukses terhadap gagal:
$$\\text{Odds} = \\frac{p}{1 - p} = e^{\\mathbf{w}^T\\mathbf{x} + b} \\implies \\ln(\\text{Odds}) = \\mathbf{w}^T\\mathbf{x} + b = \\text{logit}(p)$$`,
    mermaidDiagram: `graph LR
    Input["Fitur x in R^d"] --> Linear["Skor Linier: z = w^T x + b"]
    Linear --> Sigmoid["Sigmoid: sigma(z) = 1 / (1 + e^(-z))"]
    Sigmoid --> Prob["Peluang: P(y=1|x) in (0, 1)"]
    Prob --> Decision{"P >= 0.5 ?"}
    Decision -- Ya --> Y1["Kelas 1"]
    Decision -- Tidak --> Y0["Kelas 0"]`,
    scratchCode: `import numpy as np

def sigmoid_stable(z: np.ndarray) -> np.ndarray:
    """Fungsi Sigmoid yang stabil secara numerik terhadap overflow/underflow."""
    return np.where(z >= 0, 1.0 / (1.0 + np.exp(-z)), np.exp(z) / (1.0 + np.exp(z)))

z_test = np.array([-1000.0, -1.0, 0.0, 1.0, 1000.0])
print("Sigmoid values:", sigmoid_stable(z_test))`,
    sotaCode: `from scipy.special import expit

print("SciPy expit values:", expit(z_test))`,
    diagCode: `print("Verifikasi numerik max diff:", np.max(np.abs(sigmoid_stable(z_test) - expit(z_test))))`,
    caseStudy: "Estimasi probabilitas gagal bayar (Probability of Default - PD) pada sistem scoring perbankan regulasi Basel II.",
    commonPitfalls: ["Menghitung 1 / (1 + np.exp(-z)) tanpa clipping saat z bernilai negatif ekstrem, menyebabkan RuntimeWarning overflow."],
    groundingLinks: [{ title: "Bishop PRML (Ch. 4 Linear Models for Classification)", url: "https://www.microsoft.com/en-us/research/people/cmbishop/prml-book/", note: "Buku standar PRML" }]
  }),

  createSubchapter({
    id: "ml-08-2-penurunan-binary-cross-entropy",
    slug: "08-2-penurunan-binary-cross-entropy",
    title: "08.2 Penurunan Fungsi Biaya Binary Cross-Entropy (Log-Loss) dari Prinsip Likelihood Bernoulli",
    orderIndex: 2,
    description: "Penurunan fungsi kerugian Log-Loss dari prinsip Maximum Likelihood Estimation pada variabel acak Bernoulli dan sifat konveksitasnya.",
    theoryMarkdown: `Untuk pasangan sampel $\\{(\\mathbf{x}_i, y_i)\\}_{i=1}^n$ dengan $y_i \\in \\{0, 1\\}$, likelihood Bernoulli adalah:
$$L(\\mathbf{w}) = \\prod_{i=1}^n p_i^{y_i} (1 - p_i)^{1 - y_i}$$

Log-likelihood adalah:
$$\\ell(\\mathbf{w}) = \\sum_{i=1}^n [y_i \\ln(p_i) + (1 - y_i) \\ln(1 - p_i)]$$

Meminimalkan negatif log-likelihood menghasilkan Binary Cross-Entropy (Log-Loss):
$$J(\\mathbf{w}) = -\\frac{1}{n} \\sum_{i=1}^n [y_i \\ln(p_i) + (1 - y_i) \\ln(1 - p_i)]$$
Gradien fungsi ini adalah:
$$\\nabla_{\\mathbf{w}} J(\\mathbf{w}) = \\frac{1}{n} \\mathbf{X}^T (\\mathbf{p} - \\mathbf{y})$$`,
    mermaidDiagram: `graph TD
    Bernoulli["Asumsi Likelihood Bernoulli P(Y=y|x)"] --> LogL["Log-Likelihood: sum [y ln p + (1-y) ln(1-p)]"]
    LogL --> NegLogL["Fungsi Kerugian: J(w) = -ell(w) / n (Cross-Entropy)"]
    NegLogL --> Grad["Gradien Elegan: nabla J = (1/n) X^T (p - y)"]`,
    scratchCode: `def binary_cross_entropy(y_true: np.ndarray, y_pred: np.ndarray, eps: float = 1e-15) -> float:
    y_pred = np.clip(y_pred, eps, 1.0 - eps)
    return -np.mean(y_true * np.log(y_pred) + (1.0 - y_true) * np.log(1.0 - y_pred))

y_t = np.array([1, 0, 1, 1])
y_p = np.array([0.9, 0.1, 0.8, 0.4])
print("Manual Log-Loss:", binary_cross_entropy(y_t, y_p))`,
    sotaCode: `from sklearn.metrics import log_loss

print("Scikit-Learn Log-Loss:", log_loss(y_t, y_p))`,
    diagCode: `print("Verifikasi log-loss cocok:", np.isclose(binary_cross_entropy(y_t, y_p), log_loss(y_t, y_p)))`,
    caseStudy: "Kaggle IEEE-CIS Fraud Detection: Evaluasi model klasifikasi fraud berbasis ROC-AUC dan Log-Loss.",
    commonPitfalls: ["Lupa melakukan clipping pada y_pred sebelum komputasi logaritma (menghasilkan log(0) = -inf)."],
    groundingLinks: [{ title: "Scikit-Learn Log Loss Documentation", url: "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.log_loss.html", note: "Dokumentasi metrik log-loss" }]
  }),

  createSubchapter({
    id: "ml-08-3-algoritma-irls",
    slug: "08-3-algoritma-irls",
    title: "08.3 Algoritma Iteratively Reweighted Least Squares (IRLS) & Komputasi Hessian Berbobot",
    orderIndex: 3,
    description: "Metode optimasi orde kedua Newton-Raphson untuk Regresi Logistik: komputasi matriks Hessian berbobot X^T W X dan algoritma IRLS.",
    theoryMarkdown: `Matriks Hessian dari Binary Cross-Entropy adalah:
$$\\mathbf{H} = \\nabla_{\\mathbf{w}}^2 J(\\mathbf{w}) = \\frac{1}{n} \\mathbf{X}^T \\mathbf{W} \\mathbf{X}$$
di mana $\\mathbf{W} = \\text{diag}(p_1(1 - p_1), \\dots, p_n(1 - p_n))$.

Pembaruan Newton-Raphson:
$$\\mathbf{w}^{(t+1)} = \\mathbf{w}^{(t)} - \\mathbf{H}^{-1} \\nabla J = (\\mathbf{X}^T\\mathbf{W}\\mathbf{X})^{-1} \\mathbf{X}^T\\mathbf{W}\\mathbf{z}$$
di mana $\\mathbf{z} = \\mathbf{X}\\mathbf{w}^{(t)} + \\mathbf{W}^{-1}(\\mathbf{y} - \\mathbf{p})$ adalah variabel respons yang disesuaikan (*adjusted response*). Setiap iterasi ekuivalen dengan memecahkan Weighted Least Squares (IRLS)!`,
    mermaidDiagram: `graph TD
    Init["Inisialisasi w"] --> Prob["Hitung Peluang: p_i = sigma(w^T x_i)"]
    Prob --> Weight["Matriks Bobot W_ii = p_i (1 - p_i)"]
    Weight --> Adj["Hitung Respons Disesuaikan z = Xw + W^(-1)(y - p)"]
    Adj --> WLS["Weighted Least Squares: w = (X^T W X)^(-1) X^T W z"]
    WLS --> Conv{"Konvergen?"}
    Conv -- Ya --> Done["Bobot Optimal Ditemukan dalam 5-10 Iterasi"]
    Conv -- Tidak --> Prob`,
    scratchCode: `def irls_logistic_regression(X: np.ndarray, y: np.ndarray, max_iter: int = 20, tol: float = 1e-6):
    n, p = X.shape
    w = np.zeros(p)
    for _ in range(max_iter):
        p_hat = sigmoid_stable(X @ w)
        w_diag = p_hat * (1.0 - p_hat)
        W = np.diag(np.clip(w_diag, 1e-6, 1.0))
        grad = X.T @ (p_hat - y)
        Hessian = X.T @ W @ X
        delta_w = np.linalg.solve(Hessian, grad)
        w -= delta_w
        if np.linalg.norm(delta_w) < tol:
            break
    return w

np.random.seed(42)
X_log = np.hstack([np.ones((100, 1)), np.random.randn(100, 2)])
w_true = np.array([0.5, -1.2, 2.0])
y_log = (sigmoid_stable(X_log @ w_true) > np.random.rand(100)).astype(float)
w_est = irls_logistic_regression(X_log, y_log)
print("IRLS Estimated weights:", np.round(w_est, 4))`,
    sotaCode: `from sklearn.linear_model import LogisticRegression

clf = LogisticRegression(fit_intercept=False, solver='newton-cg', penalty=None)
clf.fit(X_log, y_log)
print("Scikit-Learn Logistic Weights:", np.round(clf.coef_[0], 4))`,
    diagCode: `print("Maksimum perbedaan IRLS vs Scikit-Learn:", np.max(np.abs(w_est - clf.coef_[0])))`,
    caseStudy: "Konvergensi kuadratik pada pemodelan risiko aktuarial: IRLS konvergen dalam kurang dari 6 iterasi saat gradien descent membutuhkan ribuan langkah.",
    commonPitfalls: ["Inversi matriks Hessian X^T W X mengalami kegagalan saat ada prediksi yang mendekati probabilitas 0 atau 1."],
    groundingLinks: [{ title: "McCullagh & Nelder Generalized Linear Models", url: "https://www.statlearning.com/", note: "Buku standar penurunan IRLS" }]
  }),

  createSubchapter({
    id: "ml-08-4-klasifikasi-multikelas-softmax",
    slug: "08-4-klasifikasi-multikelas-softmax",
    title: "08.4 Klasifikasi Multikelas: Multinomial Logistic Regression (Softmax Regression) & Fungsi Cross-Entropy",
    orderIndex: 4,
    description: "Generalisasi multikelas menggunakan fungsi Softmax: fungsi partisi normalisasi eksponensial, cross-entropy kategorikal, dan matriks parameter W.",
    theoryMarkdown: `Untuk klasifikasi dengan $K$ kelas ($y_i \\in \\{1, \\dots, K\\}$), probabilitas posterior dihitung menggunakan fungsi **Softmax**:
$$P(Y = k \\mid \\mathbf{x}) = \\frac{e^{\\mathbf{w}_k^T\\mathbf{x}}}{\\sum_{j=1}^K e^{\\mathbf{w}_j^T\\mathbf{x}}}$$

Fungsi kerugian Categorical Cross-Entropy:
$$J(\\mathbf{W}) = -\\frac{1}{n} \\sum_{i=1}^n \\sum_{k=1}^K y_{ik} \\ln(p_{ik})$$
di mana $y_{ik} = 1$ jika sampel ke-$i$ termasuk kelas $k$ (one-hot encoding).`,
    mermaidDiagram: `graph LR
    Input["Input x in R^d"] --> Logits["Logits z_k = w_k^T x untuk k = 1..K"]
    Logits --> Softmax["Softmax: exp(z_k) / sum_j exp(z_j)"]
    Softmax --> Dist["Distribusi Probabilitas [p_1, ..., p_K]"]
    Dist --> Loss["Cross-Entropy Loss: -sum y_k ln(p_k)"]`,
    scratchCode: `def softmax_stable(Z: np.ndarray) -> np.ndarray:
    """Softmax stabil numerik dengan pengurangan nilai maksimum."""
    exp_Z = np.exp(Z - np.max(Z, axis=1, keepdims=True))
    return exp_Z / np.sum(exp_Z, axis=1, keepdims=True)

Z_test = np.array([[2.0, 1.0, 0.1], [1000.0, 1001.0, 999.0]])
print("Softmax Output:\\n", np.round(softmax_stable(Z_test), 4))`,
    sotaCode: `from sklearn.linear_model import LogisticRegression

X_multi = np.random.randn(150, 4)
y_multi = np.random.choice([0, 1, 2], size=150)
softmax_reg = LogisticRegression(multi_class='multinomial', solver='lbfgs')
softmax_reg.fit(X_multi, y_multi)
print("Softmax Model Classes:", softmax_reg.classes_)`,
    diagCode: `print("Probabilitas sampel pertama:", np.round(softmax_reg.predict_proba(X_multi[:1]), 3))`,
    caseStudy: "Klasifikasi dokumen teks multi-kategori (Berita: Olahraga, Politik, Finansial, Teknologi) berbasis representasi TF-IDF.",
    commonPitfalls: ["Menghitung np.exp(Z) secara langsung tanpa log-sum-exp stabilization, menyebabkan overflow ke NaN."],
    groundingLinks: [{ title: "Scikit-Learn Logistic Regression Multi-class", url: "https://scikit-learn.org/stable/modules/linear_model.html#multinomial-logistic-regression", note: "Dokumentasi multinomial softmax" }]
  }),

  createSubchapter({
    id: "ml-08-5-geometri-batas-keputusan",
    slug: "08-5-geometri-batas-keputusan",
    title: "08.5 Geometri Batas Keputusan Linier, Jarak Margin Terhadap Hyperplane, & Ketertelusuran Data",
    orderIndex: 5,
    description: "Analisis geometris batas keputusan: hyperplane w^T x + b = 0, jarak ortogonal titik ke bidang pemisah, dan ketertelusuran data.",
    theoryMarkdown: `Batas keputusan (*decision boundary*) terjadi ketika peluang kedua kelas seimbang:
$$P(Y=1 \\mid \\mathbf{x}) = P(Y=0 \\mid \\mathbf{x}) = 0.5 \\iff \\mathbf{w}^T\\mathbf{x} + b = 0$$

Persamaan $\\mathbf{w}^T\\mathbf{x} + b = 0$ mendefinisikan sebuah hyperplane berdimensi $(d-1)$ di dalam $\\mathbb{R}^d$.
Vektor $\\mathbf{w}$ tegak lurus (normal) terhadap bidang batas keputusan.

Jarak bertanda (*signed distance*) dari sembarang titik $\\mathbf{x}_0$ ke bidang keputusan adalah:
$$d(\\mathbf{x}_0) = \\frac{\\mathbf{w}^T\\mathbf{x}_0 + b}{\\|\\mathbf{w}\\|_2}$$`,
    mermaidDiagram: `graph TD
    Data["Ruang Fitur R^d"] --> Hyperplane["Bidang Pemisah w^T x + b = 0"]
    Hyperplane --> Pos["w^T x + b > 0 (P > 0.5) -> Wilayah Kelas 1"]
    Hyperplane --> Neg["w^T x + b < 0 (P < 0.5) -> Wilayah Kelas 0"]
    Hyperplane --> Dist["Jarak ke Bidang: d = (w^T x + b) / ||w||"]`,
    scratchCode: `def signed_distance_to_boundary(X: np.ndarray, w: np.ndarray, b: float) -> np.ndarray:
    return (X @ w + b) / np.linalg.norm(w)

w_geom = np.array([2.0, -1.0])
b_geom = 0.5
pts = np.array([[1.0, 1.0], [0.0, 0.5], [-1.0, 0.0]])
print("Jarak ortogonal ke hyperplane pemisah:", np.round(signed_distance_to_boundary(pts, w_geom, b_geom), 3))`,
    sotaCode: `from sklearn.linear_model import LogisticRegression

clf_geom = LogisticRegression().fit(pts, [1, 0, 0])
print("Decision Function (Scikit-Learn):", clf_geom.decision_function(pts))`,
    diagCode: `print("Normalitas vektor bobot ||w||:", np.linalg.norm(clf_geom.coef_))`,
    caseStudy: "Deteksi kualitas semikonduktor: Menentukan batas margin aman antara chip lolos sensor vs cacat fisik.",
    commonPitfalls: ["Mengabaikan normalisasi ||w|| saat membandingkan margin keyakinan model."],
    groundingLinks: [{ title: "ESL Stanford Ch. 4 (Linear Methods for Classification)", url: "https://hastie.su.domains/ElemStatLearn/", note: "Buku rujukan geometri klasifikasi" }]
  }),

  createSubchapter({
    id: "ml-08-6-separasi-sempurna-regresi-firth",
    slug: "08-6-separasi-sempurna-regresi-firth",
    title: "08.6 Masalah Separasi Sempurna (Quasi-Complete Separation) & Koreksi Regularisasi Firth",
    orderIndex: 6,
    description: "Patologi keterpisahan sempurna (separation): divergennya parameter ||w|| -> tak hingga, kegagalan uji Wald, dan solusi Firth's Penalized Likelihood.",
    theoryMarkdown: `Jika terdapat hyperplane yang memisahkan kelas $y=0$ dan $y=1$ secara sempurna, maka $\\hat{\\mathbf{w}}$ optimal adalah tak hingga ($\\lim \\|\\mathbf{w}\\| \\to \\infty$) agar $\\sigma(z) \\to 1$ dan loss mendekati nol.
Hal ini mengakibatkan:
1. Standard Error membengkak hingga puluhan ribu (*inflated SE*).
2. Uji Wald $t = \\hat{w} / \\text{SE}$ gagal total (p-value mendekati 1 meskipun variabel prediktor sempurna).

**Koreksi Firth (1993)** memodifikasi log-likelihood menggunakan akar determinan informasi Fisher:
$$\\ell_{\\text{Firth}}(\\mathbf{w}) = \\ell(\\mathbf{w}) + \\frac{1}{2} \\ln |\\mathbf{I}(\\mathbf{w})|$$
Penalti Jeffrey's Prior ini menjamin parameter selalu berhingga dan stabil!`,
    mermaidDiagram: `graph TD
    Sep["Data Terpisah Sempurna (Perfect Separation)"] --> Div["Likelihood Maksimum di ||w|| -> inf"]
    Div --> Fail["Standard Error Meledak & Uji Wald Gagal"]
    Div --> Sol1["Solusi 1: Regularisasi L2 (C < 1.0)"]
    Div --> Sol2["Solusi 2: Firth's Penalized Likelihood (Jeffrey's Prior)"]`,
    scratchCode: `def detect_separation_warning(y_pred_probs):
    near_zeros = np.sum(y_pred_probs < 1e-6)
    near_ones = np.sum(y_pred_probs > 1.0 - 1e-6)
    return near_zeros > 0 or near_ones > 0

probs = np.array([0.00000001, 0.9999999, 0.45])
print("Separasi terdeteksi:", detect_separation_warning(probs))`,
    sotaCode: `from sklearn.linear_model import LogisticRegression

# Solusi Scikit-Learn: L2 Regularization (C=1.0 secara default mencegah divergen)
clf_firth = LogisticRegression(penalty='l2', C=1.0)
clf_firth.fit(X_log, y_log)
print("Bobot dengan regularisasi L2 pelindung separasi:", np.round(clf_firth.coef_[0], 4))`,
    diagCode: `print("Kondisi stabilitas parameter terjamin berhingga.")`,
    caseStudy: "Studi uji klinis penyakit langka: Ketika seluruh pasien dalam grup perlakuan sembuh total, regresi logistik standar gagal estimasi tanpa koreksi Firth.",
    commonPitfalls: ["Mematikan regularisasi (penalty=None) pada regresi logistik scikit-learn saat dataset berukuran kecil atau terpisah sempurna."],
    groundingLinks: [{ title: "Firth (1993) Bias reduction of maximum likelihood estimates", url: "https://doi.org/10.1093/biomet/80.1.27", note: "Paper asli koreksi Firth" }]
  })
];

const chapter08 = {
  id: "machine-learning-ch-08",
  slug: "bab-08-model-klasifikasi-linier-regresi-logistik-softmax-irls",
  title: "BAB 08: Model Klasifikasi Linier: Regresi Logistik, Softmax, & IRLS",
  orderIndex: 8,
  description: "Landasan analitis klasifikasi linier: peluang logit dan Sigmoid, penurunan fungsi biaya Log-Loss, optimasi orde kedua IRLS, klasifikasi multikelas Softmax, geometri batas keputusan, dan penanganan separasi sempurna via regularisasi Firth.",
  coreConcepts: [
    "Fungsi Sigmoid & Log-Odds",
    "Binary Cross-Entropy (Log-Loss)",
    "Algoritma IRLS & Matriks Hessian Berbobot",
    "Softmax Regression Multikelas",
    "Geometri Hyperplane Pemisah",
    "Separasi Sempurna & Regularisasi Firth"
  ],
  subchapters: ch08Subs
};

fs.writeFileSync(path.join(outDir, 'chunk2-ch08.ts'), exportChapterTs(chapter08, 'chapter08'), 'utf-8');
console.log('Successfully generated chunk2-ch08.ts (6 subchapters)');


// ============================================================================
// BAB 09: Generalized Linear Models (GLM) & Exponential Family (5 Subbab)
// ============================================================================
const ch09Subs = [
  createSubchapter({
    id: "ml-09-1-keluarga-eksponensial-terparameterisasi",
    slug: "09-1-keluarga-eksponensial-terparameterisasi",
    title: "09.1 Keluarga Eksponensial Terparameterisasi (Exponential Dispersion Family): Sifat Dasar & Momen",
    orderIndex: 1,
    description: "Fondasi Keluarga Dispersi Eksponensial (EDF): fungsi densitas kanonikal, fungsi kumulan b(theta), dan penurunan momen mean serta varians.",
    theoryMarkdown: `Keluarga Dispersi Eksponensial (*Exponential Dispersion Family*) mencakup Gaussian, Bernoulli, Poisson, Gamma, dan Tweedie:
$$f(y; \\theta, \\phi) = \\exp\\left( \\frac{y\\theta - b(\\theta)}{a(\\phi)} + c(y, \\phi) \\right)$$
di mana $\\theta$ adalah parameter alami (*natural parameter*), $\\phi$ adalah parameter dispersi, dan $b(\\theta)$ adalah fungsi kumulan (*log-partition function*).

Sifat momen elegan:
1. Mean: $\\mathbb{E}[Y] = \\mu = b'(\\theta)$
2. Varians: $\\text{Var}(Y) = b''(\\theta) a(\\phi) = V(\\mu) a(\\phi)$
di mana $V(\\mu)$ adalah fungsi varians (*variance function*) yang mencirikan keluarga distribusi.`,
    mermaidDiagram: `graph TD
    EDF["Exponential Dispersion Family f(y; theta, phi)"] --> Cumulant["Fungsi Kumulan b(theta)"]
    Cumulant --> Mean["Mean: mu = b'(theta)"]
    Cumulant --> Var["Varians: Var(Y) = b''(theta) * phi = V(mu) * phi"]
    Var --> Examples["Contoh: Gaussian V(mu)=1, Poisson V(mu)=mu, Gamma V(mu)=mu^2"]`,
    scratchCode: `def edf_poisson_moments(theta: float):
    # Untuk Poisson: b(theta) = exp(theta), mu = exp(theta), V(mu) = mu
    mu = np.exp(theta)
    var = mu
    return mu, var

print("Momen Poisson (theta=1.5): Mean =", edf_poisson_moments(1.5)[0], "Var =", edf_poisson_moments(1.5)[1])`,
    sotaCode: `from scipy.stats import poisson

p_dist = poisson(mu=np.exp(1.5))
print("SciPy Poisson moments:", p_dist.stats(moments='mv'))`,
    diagCode: `print("Verifikasi kesamaan mean dan varians Poisson:", np.isclose(p_dist.mean(), p_dist.var()))`,
    caseStudy: "Pemodelan klaim asuransi properti: Variansi klaim sebanding dengan kuadrat nilai ekspektasi (Gamma distribution).",
    commonPitfalls: ["Mengabaikan hubungan antara mean dan varians pada keluarga non-Gaussian."],
    groundingLinks: [{ title: "McCullagh & Nelder Generalized Linear Models", url: "https://www.statlearning.com/", note: "Buku standar GLM" }]
  }),

  createSubchapter({
    id: "ml-09-2-tiga-komponen-glm",
    slug: "09-2-tiga-komponen-glm",
    title: "09.2 Anatomi Tiga Komponen GLM: Komponen Acak, Komponen Sistematis, & Fungsi Penghubung (Link Function)",
    orderIndex: 2,
    description: "Struktur arsitektur GLM: komponen acak Y ~ EDF, prediktor linier eta = X beta, dan fungsi penghubung monotonik g(mu).",
    theoryMarkdown: `Setiap GLM terdiri dari 3 pilar:
1. **Random Component**: Variabel target $Y$ berdistribusi keluarga eksponensial dengan $\\mathbb{E}[Y] = \\mu$.
2. **Systematic Component**: Kombinasi prediktor linier $\\eta = \\mathbf{x}^T\\boldsymbol{\\beta}$.
3. **Link Function**: Fungsi monotonik diferensiabel $g(\\cdot)$ yang menghubungkan mean dengan prediktor linier:
$$\\eta = g(\\mu) \\iff \\mu = g^{-1}(\\eta)$$

Link kanonikal tercapai ketika $\\eta = \\theta$ (misal: logit untuk Bernoulli, log untuk Poisson, resiprokal untuk Gamma).`,
    mermaidDiagram: `graph LR
    X["Fitur x"] --> Systematic["Komponen Sistematis: eta = X beta"]
    Systematic --> Link["Fungsi Penghubung: g(mu) = eta <=> mu = g^(-1)(eta)"]
    Link --> Random["Komponen Acak: Y ~ EDF(mu, phi)"]`,
    scratchCode: `def glm_predict(X: np.ndarray, beta: np.ndarray, link_inv_fn) -> np.ndarray:
    eta = X @ beta
    return link_inv_fn(eta)

# Log link: g(mu) = ln(mu) => g^(-1)(eta) = exp(eta)
beta_pois = np.array([0.5, 0.2])
X_p = np.array([[1.0, 2.0], [1.0, 3.0]])
print("GLM Log-Link Predict Mean:", glm_predict(X_p, beta_pois, np.exp))`,
    sotaCode: `import statsmodels.api as sm

glm_gauss = sm.GLM(y, X, family=sm.families.Gaussian(sm.families.links.Identity())).fit()
print("GLM Gaussian coefs:", np.round(glm_gauss.params[:3], 4))`,
    diagCode: `print("Deviance Residuals Mean:", np.mean(glm_gauss.resid_deviance))`,
    caseStudy: "Sistem scoring perbankan: Menggunakan GLM Binomial Logit untuk memodelkan probabilitas default.",
    commonPitfalls: ["Memilih fungsi link yang memungkinkan mean negatif pada data yang strictly positive (misal: identity link pada data count)."],
    groundingLinks: [{ title: "Statsmodels GLM Families Documentation", url: "https://www.statsmodels.org/stable/glm.html", note: "Dokumentasi modul GLM" }]
  }),

  createSubchapter({
    id: "ml-09-3-regresi-poisson-overdispersi",
    slug: "09-3-regresi-poisson-overdispersi",
    title: "09.3 Regresi Poisson untuk Data Cacah (Count Data), Masalah Overdispersi, & Regresi Binomial Negatif",
    orderIndex: 3,
    description: "Pemodelan data cacah non-negatif: Regresi Poisson log-linear, patologi overdispersi (Var > Mean), dan solusi Regresi Binomial Negatif.",
    theoryMarkdown: `Pada regresi Poisson, $Y \\sim \\text{Poisson}(\\mu)$ dengan link log:
$$\\ln(\\mu) = \\mathbf{X}\\boldsymbol{\\beta} \\implies \\mu = \\exp(\\mathbf{X}\\boldsymbol{\\beta})$$
Asumsi ekuidispersi Poisson mensyaratkan $\\text{Var}(Y) = \\mu$. Namun pada data nyata, sering terjadi **Overdispersi** ($\\text{Var}(Y) > \\mu$) akibat heterogenitas tak teramati atau inflasi nol.

Solusinya adalah **Negative Binomial Regression**, yang menambahkan parameter dispersi $\\alpha$:
$$\\text{Var}(Y) = \\mu + \\alpha \\mu^2$$`,
    mermaidDiagram: `graph TD
    Count["Data Cacah Y in {0, 1, 2, ...}"] --> Pois["Regresi Poisson: Var(Y) = mu"]
    Pois --> Test["Uji Overdispersi: Pearson Chi2 / df > 1.5?"]
    Test -- Ya --> NegBin["Beralih ke Negative Binomial: Var(Y) = mu + alpha * mu^2"]
    Test -- Tidak --> Keep["Pertahankan Model Poisson"]`,
    scratchCode: `def poisson_log_likelihood(y: np.ndarray, mu: np.ndarray) -> float:
    return np.sum(y * np.log(mu) - mu - [np.sum(np.log(np.arange(1, val + 1))) for val in y])

y_cnt = np.array([2, 5, 0, 1, 8])
mu_cnt = np.array([2.1, 4.8, 0.5, 1.2, 7.5])
print("Poisson Log-Likelihood:", np.round(poisson_log_likelihood(y_cnt, mu_cnt), 4))`,
    sotaCode: `from sklearn.linear_model import PoissonRegressor

pois_reg = PoissonRegressor(alpha=0.1).fit(X[:, 1:], np.abs(y).astype(int))
print("Poisson Regressor Coefs:", np.round(pois_reg.coef_, 4))`,
    diagCode: `print("Rasio Deviance / df:", pois_reg.score(X[:, 1:], np.abs(y).astype(int)))`,
    caseStudy: "Pemodelan panggilan masuk call-center per jam atau frekuensi kecelakaan pengendara motor dalam setahun.",
    commonPitfalls: ["Menggunakan OLS kuadrat terkecil standar untuk data cacah bernilai kecil (0, 1, 2), menghasilkan prediksi jumlah negatif yang tidak masuk akal."],
    groundingLinks: [{ title: "Scikit-Learn Poisson Regressor", url: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.PoissonRegressor.html", note: "Dokumentasi Poisson Regressor" }]
  }),

  createSubchapter({
    id: "ml-09-4-regresi-gamma-tweedie",
    slug: "09-4-regresi-gamma-tweedie",
    title: "09.4 Regresi Gamma & Tweedie Compound Poisson untuk Klaim Asuransi dan Data Kontinu Positif",
    orderIndex: 4,
    description: "Pemodelan klaim finansial kontinu positif: Regresi Gamma untuk keparahan klaim (severity) dan Tweedie Compound Poisson untuk biaya klaim murni.",
    theoryMarkdown: `Distribusi Gamma cocok untuk data kontinu positif $y > 0$ dengan varians meningkat sebanding kuadrat rata-rata: $\\text{Var}(Y) = \\phi \\mu^2$.

Distribusi **Tweedie** dengan indeks varians $p \\in (1, 2)$ adalah proses majemuk Poisson-Gamma (*Compound Poisson-Gamma*):
$$\\text{Var}(Y) = \\phi \\mu^p$$
Distribusi ini memiliki probabilitas massa diskret di $y = 0$ (tidak ada klaim) dan kerapatan kontinu untuk $y > 0$ (besar klaim positif), menjadikannya standar industri aktuaria untuk *Pure Premium Modeling*.`,
    mermaidDiagram: `graph LR
    PurePremium["Biaya Klaim Murni (Banyak Nol + Nilai Positif Panjang)"] --> Tweedie["Distribusi Tweedie (1 < p < 2)"]
    Tweedie --> Freq["Komponen Poisson: Frekuensi Klaim N ~ Poisson(lambda)"]
    Tweedie --> Sev["Komponen Gamma: Besaran Tiap Klaim Z_i ~ Gamma(alpha, beta)"]
    Freq & Sev --> Sum["Total Klaim Y = sum_{i=1}^N Z_i"]`,
    scratchCode: `def tweedie_variance_function(mu: np.ndarray, p: float, phi: float = 1.0) -> np.ndarray:
    return phi * (mu ** p)

print("Tweedie Var (p=1.5, mu=10):", tweedie_variance_function(np.array([10.0]), 1.5)[0])`,
    sotaCode: `from sklearn.linear_model import TweedieRegressor

tweedie = TweedieRegressor(power=1.5, alpha=0.1)
y_claims = np.array([0, 0, 1500.0, 0, 3200.0, 0, 450.0])
X_demo = np.random.randn(7, 3)
tweedie.fit(X_demo, y_claims)
print("Tweedie Pure Premium Predictions:", np.round(tweedie.predict(X_demo), 2))`,
    diagCode: `print("Mean D^2 Deviance Explained:", tweedie.score(X_demo, y_claims))`,
    caseStudy: "Penetapan tarif asuransi kendaraan bermotor di AXA/Allianz: Tweedie Regression memodelkan premi murni dalam satu model terpadu tanpa memecah frekuensi dan severity.",
    commonPitfalls: ["Memaksa transformasi log(y + 1) pada data klaim alih-alih menggunakan Tweedie GLM."],
    groundingLinks: [{ title: "Scikit-Learn Tweedie Regressor Documentation", url: "https://scikit-learn.org/stable/modules/linear_model.html#generalized-linear-regression", note: "Dokumentasi Tweedie Regressor" }]
  }),

  createSubchapter({
    id: "ml-09-5-evaluasi-kecocokan-glm-deviance",
    slug: "09-5-evaluasi-kecocokan-glm-deviance",
    title: "09.5 Evaluasi Kecocokan Model: Deviance Statistik, Residual Pearson, & Skor AIC/BIC Asimtotik",
    orderIndex: 5,
    description: "Evaluasi goodness-of-fit model GLM: deviance saturasi D, Pearson Chi-Square, residual terstandarisasi, dan seleksi model berbasis AIC/BIC.",
    theoryMarkdown: `**Deviance** mengukur penyimpangan model dari model jenuh (*saturated model*):
$$D = 2 \\left[ \\ell(\\hat{\\boldsymbol{\\beta}}_{\\text{sat}}) - \\ell(\\hat{\\boldsymbol{\\beta}}) \\right]$$
Untuk model yang baik, deviance berskala $D / \\phi$ mengikuti distribusi $\\chi^2_{n - p}$.

Skor kriteria informasi untuk perbandingan model:
$$\\text{AIC} = -2\\ell + 2p$$
$$\\text{BIC} = -2\\ell + p \\ln(n)$$`,
    mermaidDiagram: `graph TD
    Fit["Model GLM Terlatih"] --> Dev["Hitung Deviance D = 2 (ell_sat - ell_model)"]
    Fit --> Pearson["Hitung Pearson Chi2 = sum (y_i - mu_i)^2 / V(mu_i)"]
    Dev & Pearson --> Ratio["Cek Rasio Dispersi: D / df"]
    Ratio --> AICBIC["Hitung AIC = -2ell + 2p & BIC = -2ell + p ln(n)"]`,
    scratchCode: `def compute_deviance_gaussian(y: np.ndarray, y_pred: np.ndarray) -> float:
    return np.sum((y - y_pred)**2)

print("Gaussian Deviance (RSS):", compute_deviance_gaussian(y[:10], X[:10] @ beta_hat))`,
    sotaCode: `import statsmodels.api as sm

model_glm = sm.GLM(y, X, family=sm.families.Gaussian()).fit()
print(f"Deviance: {model_glm.deviance:.4f}")
print(f"Pearson Chi2: {model_glm.pearson_chi2:.4f}")
print(f"AIC: {model_glm.aic:.4f}")`,
    diagCode: `print(f"BIC: {model_glm.bic:.4f}")`,
    caseStudy: "Seleksi model epidemiologi penyebaran virus: Membandingkan Poisson vs Negative Binomial vs Zero-Inflated Poisson menggunakan skor AIC/BIC.",
    commonPitfalls: ["Membandingkan nilai AIC antara model dengan fungsi link atau keluarga distribusi target yang ditransformasi berbeda."],
    groundingLinks: [{ title: "Statsmodels GLM Goodness of Fit", url: "https://www.statsmodels.org/stable/glm.html", note: "Dokumentasi Goodness of Fit GLM" }]
  })
];

const chapter09 = {
  id: "machine-learning-ch-09",
  slug: "bab-09-generalized-linear-models-glm-exponential-family",
  title: "BAB 09: Generalized Linear Models (GLM) & Exponential Family",
  orderIndex: 9,
  description: "Landasan matematis Generalized Linear Models: keluarga dispersi eksponensial (EDF), anatomi tiga komponen GLM, regresi Poisson dan penanganan overdispersi via Negative Binomial, regresi Gamma dan Tweedie untuk aktuaria, serta evaluasi deviance dan AIC/BIC.",
  coreConcepts: [
    "Exponential Dispersion Family & Log-Partition Function",
    "Tiga Komponen GLM (Random, Systematic, Link)",
    "Regresi Poisson & Overdispersi",
    "Negative Binomial Regression",
    "Tweedie Compound Poisson Regression",
    "Deviance & Statistik Kebaikan Suai (Goodness-of-Fit)"
  ],
  subchapters: ch09Subs
};

fs.writeFileSync(path.join(outDir, 'chunk2-ch09.ts'), exportChapterTs(chapter09, 'chapter09'), 'utf-8');
console.log('Successfully generated chunk2-ch09.ts (5 subchapters)');

// ============================================================================
// Aggregator: chunk2-linear-models.ts
// ============================================================================
const chunk2Aggregator = `import { AcademicChapter } from "../../types";
import { chapter06 } from "./chunk2-ch06";
import { chapter07 } from "./chunk2-ch07";
import { chapter08 } from "./chunk2-ch08";
import { chapter09 } from "./chunk2-ch09";

/**
 * CHUNK 2: MODEL LINIER, REGULARISASI, KLASIFIKASI & GLM
 * Cakupan: Bab 06 s/d Bab 09 (Tepat 23 Subbab Kanonikal)
 * - Bab 06: Regresi Linier OLS, Teorema Gauss-Markov, & Diagnostik Residual (6 Subbab)
 * - Bab 07: Regularisasi Linier Lanjut: Ridge, Lasso, ElasticNet, LARS, & SCAD (6 Subbab)
 * - Bab 08: Model Klasifikasi Linier: Regresi Logistik, Softmax, & IRLS (6 Subbab)
 * - Bab 09: Generalized Linear Models (GLM) & Exponential Family (5 Subbab)
 */
export const chunk2LinearModels: AcademicChapter[] = [
  chapter06,
  chapter07,
  chapter08,
  chapter09,
];

export {
  chapter06,
  chapter07,
  chapter08,
  chapter09,
};
`;

fs.writeFileSync(path.join(outDir, 'chunk2-linear-models.ts'), chunk2Aggregator, 'utf-8');
console.log('Successfully generated chunk2-linear-models.ts (Chapters 06 - 09, 23 subchapters)');
