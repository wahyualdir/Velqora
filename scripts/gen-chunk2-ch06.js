const fs = require('fs');
const path = require('path');
const { createSubchapter, exportChapterTs } = require('./curriculum-builder-helper');

const outDir = path.join(__dirname, '../src/lib/curriculum/topics/machine-learning');

// ============================================================================
// BAB 06: Regresi Linier OLS, Teorema Gauss-Markov, & Diagnostik Residual (6 Subbab)
// ============================================================================
const ch06Subs = [
  createSubchapter({
    id: "ml-06-1-formulasi-matematis-ols",
    slug: "06-1-formulasi-matematis-ols",
    title: "06.1 Formulasi Matematis Ordinary Least Squares (OLS) & Penurunan Normal Equations",
    orderIndex: 1,
    description: "Penurunan analitis Ordinary Least Squares (OLS): minimisasi fungsi kerugian kuadrat terkecil, gradien matriks, dan sistem persamaan normal X^T X beta = X^T y.",
    learningObjectives: [
      "Menurunkan fungsi objektif kuadrat terkecil matriks S(beta) = (y - X beta)^T (y - X beta).",
      "Menghitung turunan matriks terhadap vektor parameter beta dan menyusun Persamaan Normal.",
      "Menganalisis kondisi keterbalikan (invertibility) matriks Grammian X^T X."
    ],
    theoryMarkdown: `Ordinary Least Squares (OLS) adalah metode dasar estimasi parameter dalam model regresi linier. Diberikan matriks desain $\\mathbf{X} \\in \\mathbb{R}^{n \\times p}$ dan vektor respons $\\mathbf{y} \\in \\mathbb{R}^n$, model linier dirumuskan sebagai:
$$\\mathbf{y} = \\mathbf{X}\\boldsymbol{\\beta} + \\boldsymbol{\\varepsilon}$$

Fungsi kerugian jumlah kuadrat residual (Sum of Squared Residuals - SSR) didefinisikan sebagai:
$$S(\\boldsymbol{\\beta}) = \\|\\mathbf{y} - \\mathbf{X}\\boldsymbol{\\beta}\\|_2^2 = (\\mathbf{y} - \\mathbf{X}\\boldsymbol{\\beta})^T (\\mathbf{y} - \\mathbf{X}\\boldsymbol{\\beta}) = \\mathbf{y}^T\\mathbf{y} - 2\\boldsymbol{\\beta}^T\\mathbf{X}^T\\mathbf{y} + \\boldsymbol{\\beta}^T\\mathbf{X}^T\\mathbf{X}\\boldsymbol{\\beta}$$

Mengambil gradien terhadap $\\boldsymbol{\\beta}$ dan menyamakannya ke nol:
$$\\nabla_{\\boldsymbol{\\beta}} S(\\boldsymbol{\\beta}) = -2\\mathbf{X}^T\\mathbf{y} + 2\\mathbf{X}^T\\mathbf{X}\\boldsymbol{\\beta} = \\mathbf{0} \\implies \\mathbf{X}^T\\mathbf{X}\\boldsymbol{\\beta} = \\mathbf{X}^T\\mathbf{y}$$

Jika $\\mathbf{X}$ memiliki full column rank ($\\text{rank}(\\mathbf{X}) = p$), maka $\\mathbf{X}^T\\mathbf{X}$ invertibel dan solusi analitis eksak adalah:
$$\\hat{\\boldsymbol{\\beta}} = (\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T\\mathbf{y}$$`,
    mermaidDiagram: `graph TD
    A["Matriks Desain X (n x p) & Respons y (n x 1)"] --> B["Hitung Matriks Grammian: G = X^T X"]
    B --> C["Hitung Vektor Proyeksi: c = X^T y"]
    C --> D{"Apakah G Invertibel? (det(G) != 0)"}
    D -- Ya --> E["Solusi Normal: beta_hat = G^(-1) c"]
    D -- Tidak --> F["Solusi Pseudoinverse via SVD: beta_hat = X^+ y"]
    E --> G["Prediksi: y_hat = X beta_hat"]
    F --> G
    G --> H["Residual: e = y - y_hat"]`,
    scratchCode: `import numpy as np

def ols_normal_equations(X: np.ndarray, y: np.ndarray) -> np.ndarray:
    """Menyelesaikan OLS menggunakan Persamaan Normal analitis (X^T X)^(-1) X^T y."""
    XtX = np.dot(X.T, X)
    Xty = np.dot(X.T, y)
    beta = np.linalg.solve(XtX, Xty)  # Lebih stabil daripada np.linalg.inv
    return beta

# Verifikasi numerik
np.random.seed(42)
n, p = 100, 3
X = np.hstack([np.ones((n, 1)), np.random.randn(n, p)])
true_beta = np.array([2.5, -1.8, 3.2, 0.5])
y = X @ true_beta + np.random.randn(n) * 0.1

beta_hat = ols_normal_equations(X, y)
print("True beta:", true_beta)
print("OLS estimated beta:", np.round(beta_hat, 4))`,
    sotaCode: `from sklearn.linear_model import LinearRegression
import numpy as np

# Menggunakan Scikit-Learn LinearRegression
model = LinearRegression(fit_intercept=False)
model.fit(X, y)
print("Scikit-learn coefficients:", np.round(model.coef_, 4))`,
    diagCode: `residuals = y - X @ beta_hat
rss = np.sum(residuals**2)
tss = np.sum((y - np.mean(y))**2)
r_squared = 1 - (rss / tss)
print(f"Residual Sum of Squares (RSS): {rss:.4f}")
print(f"R-squared: {r_squared:.4f}")`,
    caseStudy: "Analisis harga properti pada Kaggle Ames Housing Dataset menggunakan OLS: Normal equations mampu merekonstruksi bobot fitur fisik seperti square footage dan jumlah kamar dengan R^2 > 0.85.",
    commonPitfalls: [
      "Menginversi matriks X^T X secara langsung menggunakan inv() alih-alih solver solve() atau dekomposisi QR, yang memperparah pembulatan numerik.",
      "Lupa menambahkan kolom bias/intersep (vektor 1) pada matriks desain X."
    ],
    groundingLinks: [
      { title: "ISLR v2 - Linear Regression (Ch. 3)", url: "https://www.statlearning.com/", note: "Buku teks standar regresi linier dan inferensi statistik" },
      { title: "Scikit-Learn Linear Regression Documentation", url: "https://scikit-learn.org/stable/modules/linear_model.html#ordinary-least-squares", note: "Dokumentasi resmi implementasi Scikit-Learn" },
      { title: "Kaggle House Prices Advanced Regression Techniques", url: "https://www.kaggle.com/c/house-prices-advanced-regression-techniques", note: "Benchmark kompetisi regresi linier dunia nyata" }
    ]
  }),

  createSubchapter({
    id: "ml-06-2-geometri-kuadrat-terkecil",
    slug: "06-2-geometri-kuadrat-terkecil",
    title: "06.2 Geometri Kuadrat Terkecil: Matriks Proyeksi Kolom (Hat Matrix) & Matriks Annihilator",
    orderIndex: 2,
    description: "Perspektif geometris OLS pada ruang dimensi n: operator proyeksi ortogonal Hat Matrix H, sifat idempoten dan simetris, serta residual orthogonal annihilator M = I - H.",
    learningObjectives: [
      "Memahami representasi geometris bahwa y_hat adalah proyeksi ortogonal dari y ke ruang kolom Col(X).",
      "Membuktikan sifat aljabar Hat Matrix: H = H^T (simetris) dan H^2 = H (idempoten).",
      "Menghitung trace dari Hat Matrix dan menghubungkannya dengan derajat kebebasan p."
    ],
    theoryMarkdown: `Dalam ruang observasi $\\mathbb{R}^n$, vektor target $\\mathbf{y}$ diproyeksikan secara ortogonal ke subruang $\\text{Col}(\\mathbf{X}) = \\{\\mathbf{X}\\boldsymbol{\\beta} \\mid \\boldsymbol{\\beta} \\in \\mathbb{R}^p\\}$. Vektor proyeksi adalah:
$$\\hat{\\mathbf{y}} = \\mathbf{X}\\hat{\\boldsymbol{\\beta}} = \\mathbf{X}(\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T\\mathbf{y} = \\mathbf{H}\\mathbf{y}$$

Matriks $\\mathbf{H} = \\mathbf{X}(\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T$ disebut **Hat Matrix** (karena menaruh "topi" di atas $y$).

Sifat-sifat fundamental $\\mathbf{H}$:
1. **Simetris**: $\\mathbf{H}^T = (\\mathbf{X}(\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T)^T = \\mathbf{H}$
2. **Idempoten**: $\\mathbf{H}^2 = \\mathbf{H}\\mathbf{H} = \\mathbf{H}$
3. **Trace**: $\\text{tr}(\\mathbf{H}) = \\text{tr}(\\mathbf{X}(\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T) = \\text{tr}((\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T\\mathbf{X}) = \\text{tr}(\\mathbf{I}_p) = p$

Vektor residual adalah $\\mathbf{e} = \\mathbf{y} - \\hat{\\mathbf{y}} = (\\mathbf{I}_n - \\mathbf{H})\\mathbf{y} = \\mathbf{M}\\mathbf{y}$, di mana $\\mathbf{M}$ adalah **Annihilator Matrix** yang juga simetris dan idempoten dengan $\\text{tr}(\\mathbf{M}) = n - p$.`,
    mermaidDiagram: `graph LR
    Y["Vektor Target y in R^n"] --> H["Hat Matrix H = X(X^TX)^(-1)X^T"]
    H --> Yhat["y_hat in Col(X)"]
    Y --> M["Annihilator M = I - H"]
    M --> E["e in Col(X)^perp"]
    Yhat -. Ortogonal .-> E`,
    scratchCode: `import numpy as np

def compute_projection_matrices(X: np.ndarray):
    """Menghitung Hat Matrix H dan Annihilator Matrix M."""
    XtX_inv = np.linalg.pinv(X.T @ X)
    H = X @ XtX_inv @ X.T
    n = X.shape[0]
    M = np.eye(n) - H
    return H, M

# Verifikasi sifat idempoten & ortogonalitas
H, M = compute_projection_matrices(X)
print("H is idempotent:", np.allclose(H @ H, H))
print("H is symmetric:", np.allclose(H.T, H))
print("Trace of H equals rank p:", np.isclose(np.trace(H), X.shape[1]))
e = M @ y
print("Residual e is orthogonal to Col(X):", np.allclose(X.T @ e, 0, atol=1e-8))`,
    sotaCode: `import scipy.linalg as la

# Solusi via QR Decomposition (basis ortonormal Q merentang Col(X))
Q, R = la.qr(X, mode='economic')
y_hat_qr = Q @ (Q.T @ y)
print("y_hat QR matches direct projection:", np.allclose(y_hat_qr, H @ y))`,
    diagCode: `leverages = np.diag(H)
print("Nilai leverage rata-rata p/n:", X.shape[1] / X.shape[0])
print("Leverage maksimum sampel:", np.max(leverages))`,
    caseStudy: "Deteksi titik leverage tinggi pada data finansial kuantitatif: Titik data dengan nilai h_ii > 2p/n memiliki potensi pengaruh sangat besar terhadap rotasi bidang regresi.",
    commonPitfalls: [
      "Menyimpan matriks Hat H berukuran n x n secara eksplisit pada dataset besar (n > 50,000) yang akan menghabiskan memori RAM secara masif O(n^2)."
    ],
    groundingLinks: [
      { title: "Matrix Cookbook (Petersen & Pedersen)", url: "https://www.math.uwaterloo.ca/~hwolkowi/matrixcookbook.pdf", note: "Turunan dan identitas proyeksi matriks ortogonal" }
    ]
  }),

  createSubchapter({
    id: "ml-06-3-teorema-gauss-markov",
    slug: "06-3-teorema-gauss-markov",
    title: "06.3 Teorema Gauss-Markov: Pembuktian Sifat Best Linear Unbiased Estimator (BLUE)",
    orderIndex: 3,
    description: "Pembuktian analitis formal Teorema Gauss-Markov: kondisi eksogenitas, homoskedastisitas, dan non-autokorelasi yang menjamin estimator OLS memiliki varians minimum di antara seluruh estimator linier tak-bias.",
    learningObjectives: [
      "Menguraikan 5 asumsi klasik Gauss-Markov (Linieritas, Eksogenitas Tegas, Rank Penuh, Homoskedastisitas, Tanpa Autokorelasi).",
      "Membuktikan ketak-biasan estimator OLS: E[beta_hat] = beta.",
      "Membuktikan bahwa Var(tilde_beta) - Var(beta_hat) adalah matriks semi-definit positif untuk sembarang estimator linier tak-bias."
    ],
    theoryMarkdown: `**Teorema Gauss-Markov**: Di bawah asumsi-asumsi klasik:
1. Model linier: $\\mathbf{y} = \\mathbf{X}\\boldsymbol{\\beta} + \\boldsymbol{\\varepsilon}$
2. Eksogenitas tegas: $\\mathbb{E}[\\boldsymbol{\\varepsilon} \\mid \\mathbf{X}] = \\mathbf{0}$
3. Kovarians sferis: $\\text{Var}(\\boldsymbol{\\varepsilon} \\mid \\mathbf{X}) = \\sigma^2 \\mathbf{I}_n$ (homoskedastik dan tanpa korelasi serial)
4. $\\text{rank}(\\mathbf{X}) = p$

Estimator OLS $\\hat{\\boldsymbol{\\beta}} = (\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T\\mathbf{y}$ adalah **BLUE** (*Best Linear Unbiased Estimator*).

### Pembuktian Varians Minimum:
Misalkan estimator linier tak-bias lain adalah $\\tilde{\\boldsymbol{\\beta}} = \\mathbf{C}\\mathbf{y}$, di mana $\\mathbf{C} = (\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T + \\mathbf{D}$.
Agar $\\tilde{\\boldsymbol{\\beta}}$ tak-bias, $\\mathbb{E}[\\tilde{\\boldsymbol{\\beta}}] = \\mathbf{C}\\mathbf{X}\\boldsymbol{\\beta} = \\boldsymbol{\\beta} \\implies \\mathbf{D}\\mathbf{X} = \\mathbf{0}$.

Maka varians $\\tilde{\\boldsymbol{\\beta}}$ adalah:
$$\\text{Var}(\\tilde{\\boldsymbol{\\beta}}) = \\mathbf{C}(\\sigma^2 \\mathbf{I})\\mathbf{C}^T = \\sigma^2 \\mathbf{C}\\mathbf{C}^T = \\sigma^2 [(\\mathbf{X}^T\\mathbf{X})^{-1} + \\mathbf{D}\\mathbf{D}^T] = \\text{Var}(\\hat{\\boldsymbol{\\beta}}) + \\sigma^2 \\mathbf{D}\\mathbf{D}^T$$

Karena $\\mathbf{D}\\mathbf{D}^T$ adalah matriks semi-definit positif, $\\text{Var}(\\tilde{\\boldsymbol{\\beta}}) \\succeq \\text{Var}(\\hat{\\boldsymbol{\\beta}})$. Terbukti OLS memiliki varians terkecil!`,
    mermaidDiagram: `graph TD
    A["Asumsi Gauss-Markov: E[eps|X]=0, Var(eps)=sigma^2 I"] --> B["Estimator Linier Tak-Bias: beta_tilde = Cy"]
    B --> C["Kondisi Tak-Bias: DX = 0"]
    C --> D["Var(beta_tilde) = Var(beta_hat_OLS) + sigma^2 DD^T"]
    D --> E["Karena DD^T >= 0 (PSD): Var(beta_tilde) >= Var(beta_hat_OLS)"]
    E --> F["Kesimpulan: OLS adalah BLUE"]`,
    scratchCode: `import numpy as np

def simulate_gauss_markov_efficiency(n_trials=1000, n=50, p=2):
    """Simulasi empiris efisiensi varians OLS vs estimator linier alternatif."""
    X = np.random.randn(n, p)
    beta_true = np.array([2.0, -1.0])
    
    ols_estimates = []
    alt_estimates = []
    
    # Estimator alternatif: pembobotan acak D yang memenuhi DX = 0
    D = np.random.randn(p, n)
    D = D - D @ X @ np.linalg.pinv(X.T @ X) @ X.T  # Proyeksikan agar DX = 0
    C_alt = np.linalg.pinv(X.T @ X) @ X.T + 0.5 * D
    
    for _ in range(n_trials):
        eps = np.random.randn(n) * 1.5
        y = X @ beta_true + eps
        
        # OLS
        b_ols = np.linalg.solve(X.T @ X, X.T @ y)
        # Alt
        b_alt = C_alt @ y
        
        ols_estimates.append(b_ols)
        alt_estimates.append(b_alt)
        
    var_ols = np.var(ols_estimates, axis=0)
    var_alt = np.var(alt_estimates, axis=0)
    print("Varians Parameter OLS:", np.round(var_ols, 5))
    print("Varians Parameter Alternatif:", np.round(var_alt, 5))
    print("Efisiensi (Var(Alt) >= Var(OLS)):", np.all(var_alt >= var_ols))

simulate_gauss_markov_efficiency()`,
    sotaCode: `import statsmodels.api as sm

# Pembuktian OLS dengan Statsmodels
ols_model = sm.OLS(y, X).fit()
print("Standar Error OLS Parameter:\\n", ols_model.bse)`,
    diagCode: `residuals = ols_model.resid
sigma_squared_hat = np.sum(residuals**2) / (X.shape[0] - X.shape[1])
cov_beta_hat = sigma_squared_hat * np.linalg.inv(X.T @ X)
print("Standard Error OLS Manual:", np.sqrt(np.diag(cov_beta_hat)))`,
    caseStudy: "Ekonometrika penetapan tarif asuransi: Penggunaan estimator non-BLUE yang bias atau memiliki varians tinggi mengakibatkan premi yang tidak adil atau ketidakmampuan solvabilitas dana cadangan.",
    commonPitfalls: [
      "Mengasumsikan Gauss-Markov membutuhkan distribusi normal pada gangguan epsilon. Teorema ini berlaku untuk SEMBARANG distribusi dengan mean nol dan varians konstan!"
    ],
    groundingLinks: [
      { title: "Greene Econometric Analysis (Ch. 4)", url: "https://www.statlearning.com/", note: "Bab klasik pembuktian Teorema Gauss-Markov" }
    ]
  }),

  createSubchapter({
    id: "ml-06-4-distribusi-sampling-parameter",
    slug: "06-4-distribusi-sampling-parameter",
    title: "06.4 Distribusi Sampling Parameter, Standard Error, Uji t-Student, & Uji F Parsial",
    orderIndex: 4,
    description: "Inferensi hipotesis regresi: distribusi sampling parameter di bawah asumsi normalitas, komputasi matriks kovarians parameter, uji signifikansi individual t-test, dan uji simultan F-test ANOVA.",
    learningObjectives: [
      "Menghitung matriks varians-kovarians parameter Var(beta_hat) = s^2 (X^T X)^(-1).",
      "Melakukan uji hipotesis H_0: beta_j = 0 menggunakan statistik t-Student.",
      "Menurunkan statistik F untuk pengujian signifikansi regresi simultan dan parsial."
    ],
    theoryMarkdown: `Jika diasumsikan residual berdistribusi normal $\\boldsymbol{\\varepsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\sigma^2 \\mathbf{I}_n)$, maka estimator parameter juga berdistribusi normal multivariat:
$$\\hat{\\boldsymbol{\\beta}} \\sim \\mathcal{N}\\left(\\boldsymbol{\\beta}, \\sigma^2 (\\mathbf{X}^T\\mathbf{X})^{-1}\\right)$$

Estimator tak-bias untuk varians residual $\\sigma^2$ adalah:
$$s^2 = \\frac{\\mathbf{e}^T\\mathbf{e}}{n - p} = \\frac{\\text{SSR}}{n - p}$$

Standard Error untuk parameter ke-$j$ adalah $\\text{SE}(\\hat{\\beta}_j) = s \\sqrt{[(\\mathbf{X}^T\\mathbf{X})^{-1}]_{jj}}$.

Uji signifikansi parsial $H_0: \\beta_j = 0$ menggunakan statistik uji-$t$:
$$t = \\frac{\\hat{\\beta}_j}{\\text{SE}(\\hat{\\beta}_j)} \\sim t_{n - p}$$

Uji signifikansi simultan seluruh koefisien slope menggunakan uji-$F$:
$$F = \\frac{(\\text{TSS} - \\text{SSR}) / (p - 1)}{\\text{SSR} / (n - p)} \\sim F_{p-1, n-p}$$`,
    mermaidDiagram: `graph TD
    A["Estimasi Parameter beta_hat & Residual e"] --> B["Hitung Estimator Varians: s^2 = e^T e / (n - p)"]
    B --> C["Matriks Kovarians: Cov(beta) = s^2 (X^T X)^(-1)"]
    C --> D["Standard Error SE(beta_j) = sqrt(Cov_jj)"]
    D --> E["Statistik t: t_j = beta_j / SE(beta_j)"]
    E --> F["p-value dari Distribusi t_(n-p)"]
    B --> G["Statistik F: (TSS - SSR)/(p-1) / s^2"]
    G --> H["p-value dari Distribusi F_(p-1, n-p)"]`,
    scratchCode: `import scipy.stats as stats
import numpy as np

def regression_inference_manual(X: np.ndarray, y: np.ndarray):
    n, p = X.shape
    beta = np.linalg.solve(X.T @ X, X.T @ y)
    residuals = y - X @ beta
    s2 = np.sum(residuals**2) / (n - p)
    cov_beta = s2 * np.linalg.inv(X.T @ X)
    se = np.sqrt(np.diag(cov_beta))
    t_stats = beta / se
    p_values = 2 * (1 - stats.t.cdf(np.abs(t_stats), df=n - p))
    return beta, se, t_stats, p_values

beta, se, t_vals, p_vals = regression_inference_manual(X, y)
for i in range(len(beta)):
    print(f"Beta_{i}: {beta[i]:.4f} | SE: {se[i]:.4f} | t: {t_vals[i]:.3f} | p-val: {p_vals[i]:.4e}")`,
    sotaCode: `import statsmodels.api as sm

model = sm.OLS(y, X).fit()
print(model.summary().tables[1])`,
    diagCode: `f_stat = model.fvalue
f_pval = model.f_pvalue
print(f"Overall Model F-statistic: {f_stat:.3f}, p-value: {f_pval:.4e}")`,
    caseStudy: "Uji signifikansi faktor risiko klinis (tekanan darah, indeks massa tubuh, gula darah puasa) terhadap risiko stroke dalam studi kohort medis.",
    commonPitfalls: [
      "Mengabaikan masalah pengujian hipotesis berganda (multiple testing problem). Ketika p sangat besar, beberapa variabel akan signifikan secara semu hanya karena kebetulan acak (p < 0.05)."
    ],
    groundingLinks: [
      { title: "Statsmodels OLS Regression Documentation", url: "https://www.statsmodels.org/stable/regression.html", note: "Dokumentasi modul OLS dan tabel ANOVA" }
    ]
  }),

  createSubchapter({
    id: "ml-06-5-diagnostik-residual",
    slug: "06-5-diagnostik-residual",
    title: "06.5 Diagnostik Residual: Uji Normalitas (Jarque-Bera), Homoskedastisitas (Breusch-Pagan), & Autokorelasi",
    orderIndex: 5,
    description: "Baterai uji diagnostik residual ekonometrika: uji normalitas Jarque-Bera, uji homoskedastisitas Breusch-Pagan / White, dan uji autokorelasi serial Durbin-Watson.",
    learningObjectives: [
      "Mendeteksi heteroskedastisitas menggunakan Breusch-Pagan test dan memahami koreksi White Huber-White SE.",
      "Menguji korelasi serial residual pada data sekuensial menggunakan statistik Durbin-Watson.",
      "Mengevaluasi kecondongan (skewness) dan kurtosis residual melalui uji Jarque-Bera."
    ],
    theoryMarkdown: `Pelanggaran terhadap asumsi Gauss-Markov menyebabkan estimator OLS kehilangan efisiensinya atau menghasilkan interval kepercayaan yang tidak valid.

### 1. Uji Normalitas Jarque-Bera:
$$JB = \\frac{n}{6} \\left( S^2 + \\frac{(K - 3)^2}{4} \\right) \\sim \\chi^2_2$$
di mana $S$ adalah skewness dan $K$ adalah kurtosis sampel residual.

### 2. Uji Homoskedastisitas Breusch-Pagan:
Meregresikan kuadrat residual $e_i^2$ terhadap variabel prediktor $\\mathbf{X}$:
$$e_i^2 = \\gamma_0 + \\gamma_1 X_{i1} + \\dots + \\gamma_p X_{ip} + u_i$$
Statistik uji $LM = n R_{e^2}^2 \\sim \\chi^2_{p-1}$. Jika $p < 0.05$, homoskedastisitas ditolak.

### 3. Uji Autokorelasi Durbin-Watson:
$$d = \\frac{\\sum_{i=2}^n (e_i - e_{i-1})^2}{\\sum_{i=1}^n e_i^2} \\approx 2(1 - \\hat{\\rho})$$
Nilai $d \\approx 2$ mengindikasikan tidak adanya autokorelasi, $d < 1$ menunjukkan autokorelasi positif kuat.`,
    mermaidDiagram: `graph TD
    R["Residual e = y - X beta_hat"] --> T1["Uji Normalitas: Jarque-Bera & Shapiro-Wilk"]
    R --> T2["Uji Homoskedastisitas: Breusch-Pagan / White"]
    R --> T3["Uji Autokorelasi: Durbin-Watson & Ljung-Box"]
    T2 -- "Tolak H_0 (Heteroskedastik)" --> S1["Solusi: Robust SE (Huber-White HC3) atau WLS"]
    T3 -- "Tolak H_0 (Autokorelasi)" --> S2["Solusi: Newey-West HAC SE atau GLS"]`,
    scratchCode: `def jarque_bera_manual(e: np.ndarray):
    n = len(e)
    mean_e = np.mean(e)
    m2 = np.mean((e - mean_e)**2)
    m3 = np.mean((e - mean_e)**3)
    m4 = np.mean((e - mean_e)**4)
    skew = m3 / (m2**1.5)
    kurt = m4 / (m2**2)
    jb = (n / 6.0) * (skew**2 + ((kurt - 3.0)**2) / 4.0)
    p_val = 1 - stats.chi2.cdf(jb, df=2)
    return jb, p_val

def durbin_watson_manual(e: np.ndarray):
    diff = np.diff(e)
    return np.sum(diff**2) / np.sum(e**2)

e = y - X @ beta_hat
jb, jb_p = jarque_bera_manual(e)
dw = durbin_watson_manual(e)
print(f"Jarque-Bera: {jb:.3f} (p={jb_p:.4f})")
print(f"Durbin-Watson: {dw:.3f}")`,
    sotaCode: `from statsmodels.stats.diagnostic import het_breuschpagan
import statsmodels.api as sm

model = sm.OLS(y, X).fit()
bp_test = het_breuschpagan(model.resid, model.model.exog)
print(f"Breusch-Pagan LM Stat: {bp_test[0]:.3f}, p-val: {bp_test[1]:.4e}")`,
    diagCode: `robust_model = sm.OLS(y, X).fit(cov_type='HC3')
print("Perbandingan SE Biasa vs Robust HC3:")
print("Biasa :", np.round(model.bse, 4))
print("Robust:", np.round(robust_model.bse, 4))`,
    caseStudy: "Deteksi heteroskedastisitas pada data pengeluaran rumah tangga vs pendapatan: Keluarga kaya memiliki variabilitas konsumsi jauh lebih besar daripada keluarga berpendapatan rendah.",
    commonPitfalls: [
      "Mengandalkan p-value OLS standar ketika terjadi heteroskedastisitas: Standard error OLS akan *underestimate*, menghasilkan kesimpulan statistik yang terlalu optimis semu (*spurious significance*)."
    ],
    groundingLinks: [
      { title: "Statsmodels Diagnostic Tests", url: "https://www.statsmodels.org/stable/diagnostic.html", note: "Dokumentasi uji heteroskedastisitas dan autokorelasi" }
    ]
  }),

  createSubchapter({
    id: "ml-06-6-titik-pengungkit-leverage",
    slug: "06-6-titik-pengungkit-leverage",
    title: "06.6 Titik Pengungkit Tinggi (Leverage), Residual Terstandarisasi, & Jarak Cook (Cook's Distance)",
    orderIndex: 6,
    description: "Analisis diagnostik pengaruh observasi ekstrem: diagonal matriks Hat h_ii, residual studentized terhapus (deleted studentized residuals), dan jarak Cook D_i untuk mendeteksi outlier berpengaruh.",
    learningObjectives: [
      "Membedakan antara outlier (titik dengan residual y ekstrem) dan high leverage point (titik dengan fitur X ekstrem).",
      "Menghitung Jarak Cook D_i untuk mengukur pergeseran seluruh vektor parameter saat observasi ke-i dihilangkan.",
      "Menerapkan aturan ambang batas D_i > 4/n untuk mendeteksi data yang merusak model regresi."
    ],
    theoryMarkdown: `Tidak semua outlier memiliki pengaruh yang sama terhadap estimasi model. Pengaruh suatu titik merupakan fungsi gabungan dari keanehan pada ruang prediktor (leverage) dan keanehan pada ruang target (residual).

### Leverage ($h_{ii}$):
$$h_{ii} = [\\mathbf{X}(\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T]_{ii}$$
Ambang batas perhatian: $h_{ii} > \\frac{2p}{n}$.

### Studentized Residuals ($r_i$):
$$r_i = \\frac{e_i}{s \\sqrt{1 - h_{ii}}}$$

### Jarak Cook ($D_i$):
Mengukur perubahan kuadrat pada vektor estimasi $\\hat{\\boldsymbol{\\beta}}$ ketika titik ke-$i$ diabaikan:
$$D_i = \\frac{\\|\\hat{\\mathbf{y}} - \\hat{\\mathbf{y}}_{(i)}\\|_2^2}{p s^2} = \\frac{r_i^2}{p} \\left( \\frac{h_{ii}}{1 - h_{ii}} \\right)$$

Ambang batas pengaruh kritis: $D_i > 1$ atau $D_i > \\frac{4}{n}$.`,
    mermaidDiagram: `graph TD
    Obs["Observasi (x_i, y_i)"] --> Lev["Hitung Leverage: h_ii = [X(X^TX)^(-1)X^T]_ii"]
    Obs --> Res["Hitung Residual: e_i = y_i - y_hat_i"]
    Lev & Res --> Stud["Studentized Residual: r_i = e_i / (s * sqrt(1 - h_ii))"]
    Lev & Stud --> Cook["Jarak Cook: D_i = (r_i^2 / p) * (h_ii / (1 - h_ii))"]
    Cook --> Check{"D_i > 4/n ?"}
    Check -- Ya --> Inf["Influential Point! Lakukan audit forensik data"]
    Check -- Tidak --> Normal["Observasi Aman"]`,
    scratchCode: `def cooks_distance_manual(X: np.ndarray, y: np.ndarray):
    n, p = X.shape
    beta = np.linalg.solve(X.T @ X, X.T @ y)
    y_hat = X @ beta
    e = y - y_hat
    s2 = np.sum(e**2) / (n - p)
    H = X @ np.linalg.pinv(X.T @ X) @ X.T
    h = np.diag(H)
    
    # Cook's Distance
    r_student = e / (np.sqrt(s2 * (1 - h)))
    D = (r_student**2 / p) * (h / (1 - h))
    return h, D

h, D = cooks_distance_manual(X, y)
influential_indices = np.where(D > 4 / len(y))[0]
print(f"Ditemukan {len(influential_indices)} titik berpengaruh tinggi (Cook's D > 4/n).")
print("Top 3 Jarak Cook tertinggi:", np.sort(D)[-3:])`,
    sotaCode: `import statsmodels.api as sm

model = sm.OLS(y, X).fit()
influence = model.get_influence()
cooks_d = influence.cooks_distance[0]
print("Max Cook's Distance via Statsmodels:", np.max(cooks_d))`,
    diagCode: `import matplotlib.pyplot as plt

# Skrip verifikasi diagnostik 4-panel
print("Statistik Leverage: Mean =", np.mean(h), "Max =", np.max(h))
print("Korelasi Jarak Cook dengan Nilai Absolut Residual:", np.corrcoef(D, np.abs(e))[0, 1])`,
    caseStudy: "Pendeteksian manipulasi pelaporan keuangan: Perusahaan yang memalsukan angka pendapatan dan laba bersih akan muncul sebagai titik leverage dan Cook's distance ekstrem dalam model valuasi saham.",
    commonPitfalls: [
      "Menghapus titik berpengaruh secara otomatis tanpa investigasi domain bisnis. Titik berpengaruh sering kali merupakan data paling berharga yang mewakili fenomena langka atau anomali penting!"
    ],
    groundingLinks: [
      { title: "Statsmodels OLS Influence Documentation", url: "https://www.statsmodels.org/stable/generated/statsmodels.stats.outliers_influence.OLSInfluence.html", note: "Dokumentasi OLS Influence diagnostics" }
    ]
  })
];

const chapter06 = {
  id: "machine-learning-ch-06",
  slug: "bab-06-regresi-linier-ols-teorema-gauss-markov-diagnostik",
  title: "BAB 06: Regresi Linier OLS, Teorema Gauss-Markov, & Diagnostik Residual",
  orderIndex: 6,
  description: "Landasan analitis regresi linier Ordinary Least Squares (OLS): proyeksi ortogonal, penurunan Persamaan Normal, pembuktian ketat Teorema Gauss-Markov (BLUE), inferensi statistik t dan F test, baterai diagnostik residual, serta metrologi titik pengaruh Cook's Distance.",
  coreConcepts: [
    "Persamaan Normal OLS",
    "Hat Matrix & Annihilator Matrix",
    "Teorema Gauss-Markov & Estimator BLUE",
    "Standard Error & Uji Hipotesis t / F",
    "Diagnostik Breusch-Pagan, Durbin-Watson, Jarque-Bera",
    "Leverage & Jarak Cook (Cook's Distance)"
  ],
  subchapters: ch06Subs
};

fs.writeFileSync(path.join(outDir, 'chunk2-ch06.ts'), exportChapterTs(chapter06, 'chapter06'), 'utf-8');
console.log('Successfully generated chunk2-ch06.ts (6 subchapters)');
