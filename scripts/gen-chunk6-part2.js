const fs = require('fs');
const path = require('path');
const { createSubchapter, exportChapterTs } = require('./curriculum-builder-helper');

const OUT_DIR = path.join(__dirname, '../src/lib/curriculum/topics/machine-learning');

// ==========================================
// CHAPTER 28: Penyetelan Hiperparameter Lanjut: Bayesian Optimization & Hyperband
// ==========================================
const ch28Subchapters = [
  createSubchapter({
    id: "ml-28-1-grid-search-curse",
    slug: "batas-komputasi-grid-search-kutukan-dimensi-pencarian",
    title: "28.1 Batas Komputasi Grid Search Exhaustif pada Ruang Pencarian Dimensi Tinggi (Kutukan Dimensi Pencarian)",
    orderIndex: 1,
    description: "Analisis kompleksitas komputasi eksponensial Grid Search O(G^d), inefisiensi pencarian pada dimensi parameter yang tidak penting, dan pemborosan evaluasi cross-validation.",
    theoryMarkdown: `Grid Search melakukan diskritisasi ruang konfigurasi hiperparameter $\\Lambda = \\Lambda_1 \\times \\dots \\times \\Lambda_d$ menjadi $G$ nilai per dimensi. Total kombinasi model yang harus dilatih dan divalidasi silang adalah:
$$N_{\\text{eval}} = K \\times \\prod_{j=1}^d |\\Lambda_j| = K \\times G^d$$
di mana $K$ adalah jumlah lipatan cross-validation.

**Kutukan Dimensi Pencarian (*Curse of Dimensionality*)**:
Ketika jumlah hiperparameter $d$ bertambah (misalnya 10 hiperparameter pada LightGBM atau XGBoost) dengan $G=5$ nilai uji per hiperparameter, jumlah evaluasi mencapai $5^{10} \\approx 9.76 \\times 10^6$. Dengan waktu evaluasi 10 detik per model, Grid Search memerlukan lebih dari 3 tahun komputasi. Selain itu, jika hanya 2 dari $d$ hiperparameter yang benar-benar berpengaruh signifikan terhadap performa (*low effective dimensionality*), Grid Search hanya menguji $G$ nilai unik pada dimensi penting tersebut, membuang $G^d - G^2$ komputasi secara sia-sia.`,
    mermaidDiagram: `graph LR
    Dim["Ruang Hiperparameter Dimensi d"] --> Grid["Grid Search: O(G^d) Titik Kisi"]
    Grid --> Waste["Hanya Sedikit Titik Unik pada Dimensi Berpengaruh"]
    Waste --> Bottleneck["Ledakan Komputasi Eksponensial"]`,
    scratchCode: `import itertools
import numpy as np

def grid_search_scratch(estimator_func, param_grid, X, y, cv=3):
    """Implementasi Grid Search dari scratch dengan kombinatorika itertools."""
    keys = list(param_grid.keys())
    values = list(param_grid.values())
    combinations = list(itertools.product(*values))
    
    best_score = -np.inf
    best_params = None
    results = []
    
    for combo in combinations:
        params = dict(zip(keys, combo))
        # Evaluasi dummy CV
        score = estimator_func(params, X, y, cv)
        results.append((params, score))
        if score > best_score:
            best_score = score
            best_params = params
            
    return {"best_params": best_params, "best_score": best_score, "total_evals": len(combinations)}

# Mock estimator
def mock_eval(params, X, y, cv):
    return - (params['lr'] - 0.05)**2 - (params['depth'] - 6)**2

param_grid = {'lr': [0.01, 0.05, 0.1], 'depth': [4, 6, 8]}
print(grid_search_scratch(mock_eval, param_grid, None, None))`,
    sotaCode: `from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=200, n_features=5, random_state=42)
param_grid = {'n_estimators': [20, 50], 'max_depth': [3, 5]}

grid = GridSearchCV(RandomForestClassifier(random_state=42), param_grid, cv=3)
grid.fit(X, y)
print("Scikit-Learn Best Params:", grid.best_params_)
print("Best CV Score:", grid.best_score_)`,
    diagCode: `def calculate_grid_cost(n_params, grid_points_per_param, sec_per_fit, k_folds=5):
    total_fits = (grid_points_per_param ** n_params) * k_folds
    total_hours = (total_fits * sec_per_fit) / 3600.0
    return {"Total_Fits": total_fits, "Estimated_Hours": total_hours}`,
    caseStudy: "Bergstra & Bengio (2012) mendokumentasikan bahwa pada penyetelan Neural Network, Grid Search menghabiskan 90% waktu menguji titik kisi redundan pada hiperparameter yang memiliki gradien sensitivitas mendekati nol.",
    commonPitfalls: [
      "Menggunakan Grid Search berbutir halus (*fine grid*) langsung pada iterasi pertama tanpa penjelajahan kasar (*coarse grid*).",
      "Menyetel parameter berpasangan yang memiliki interaksi kuat secara terpisah."
    ],
    groundingLinks: [
      { title: "Bergstra & Bengio (2012) Random Search for Hyper-Parameter Optimization", url: "https://www.jmlr.org/papers/v13/bergstra12a.html", note: "Paper pembuktian kelemahan teoretis Grid Search" }
    ]
  }),

  createSubchapter({
    id: "ml-28-2-random-search-bergstra",
    slug: "random-search-keunggulan-teoretis-bergstra-bengio",
    title: "28.2 Random Search: Keunggulan Teoretis Bergstra-Bengio pada Dimensi Efektif Rendah",
    orderIndex: 2,
    description: "Analisis teoretis mengapa Random Search mendominasi Grid Search: Peluang penemuan optimum $\\ge 95\\%$ dalam $N=60$ evaluasi, eksplorasi kontinu dimensi efektif.",
    theoryMarkdown: `Bergstra & Bengio (2012) membuktikan bahwa pada hampir semua model pembelajaran mesin, hanya sebagian kecil hiperparameter yang mendominasi varians performa (*low effective dimensionality*, $d_{\\text{eff}} \\ll d$).

**Teorema Peluang Penemuan Optimum**:
Misalkan daerah optimum berada dalam persentil teratas $5\\%$ ($p = 0.05$) dari ruang konfigurasi hiperparameter. Probabilitas bahwa setidaknya satu dari $n$ sampel acak independen jatuh ke dalam wilayah optimal $5\\%$ ini adalah:
$$P(\\text{menemukan optimum}) = 1 - (1 - p)^n$$
Untuk memastikan tingkat keyakinan $95\\%$ ($P \\ge 0.95$):
$$1 - (0.95)^n \\ge 0.95 \\implies 0.05 \\ge (0.95)^n \\implies n \\ge \\frac{\\ln(0.05)}{\\ln(0.95)} \\approx 58.4$$

Artinya, dengan **hanya 60 percobaan evaluasi acak**, kita memiliki probabilitas $95\\%$ untuk menemukan konfigurasi dalam persentil 5% teratas, **terlepas dari berapa pun jumlah total dimensi hiperparameter $d$**!`,
    mermaidDiagram: `graph LR
    Grid["Grid Search (9 Titik, 3 Nilai Berbeda per Dimensi)"] --> Comp["Perbandingan Eksplorasi"]
    Random["Random Search (9 Titik, 9 Nilai Berbeda per Dimensi)"] --> Comp
    Comp --> Efficiency["Random Search Mengeksplorasi Ruang Dimensi Efektif Jauh Lebih Rapat"]`,
    scratchCode: `import numpy as np

def random_search_scratch(estimator_func, param_distributions, X, y, n_iter=60, cv=3, random_seed=42):
    """Implementasi Random Search dengan sampling distribusi kontinu dan diskrit."""
    np.random.seed(random_seed)
    best_score = -np.inf
    best_params = None
    
    for _ in range(n_iter):
        params = {}
        for k, dist in param_distributions.items():
            if isinstance(dist, list):
                params[k] = np.random.choice(dist)
            elif callable(dist):
                params[k] = dist()
                
        score = estimator_func(params, X, y, cv)
        if score > best_score:
            best_score = score
            best_params = params
            
    return {"best_params": best_params, "best_score": best_score, "n_iter": n_iter}

# Mock test
def mock_objective(params, X, y, cv):
    return - (params['alpha'] - 0.03)**2

param_dists = {
    'alpha': lambda: 10 ** np.random.uniform(-4, 0) # Log-uniform distribution
}
print(random_search_scratch(mock_objective, param_dists, None, None, n_iter=60))`,
    sotaCode: `from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import loguniform, randint
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=200, n_features=5, random_state=42)
param_distributions = {
    'n_estimators': randint(20, 100),
    'max_depth': randint(2, 10)
}

rand_search = RandomizedSearchCV(RandomForestClassifier(random_state=42), 
                                 param_distributions, n_iter=30, cv=3, random_state=42)
rand_search.fit(X, y)
print("Scikit-Learn Best Params:", rand_search.best_params_)
print("Best CV Score:", rand_search.best_score_)`,
    diagCode: `def probability_of_optimum(n_samples, top_fraction=0.05):
    prob = 1.0 - (1.0 - top_fraction) ** n_samples
    return {"N_Evaluations": n_samples, "Confidence_Percentage": prob * 100.0}`,
    caseStudy: "Penyetelan Deep Residual Networks (ResNet) dengan 25 hiperparameter arsitektur dan optimasi membuktikan Random Search mencapai loss validasi 15% lebih rendah dibandingkan Grid Search dengan alokasi waktu GPU yang identik.",
    commonPitfalls: [
      "Menggunakan distribusi uniform linier untuk parameter skala magnitudo (seperti learning rate atau regresi L2); seharusnya menggunakan distribusi log-uniform.",
      "Menghentikan Random Search terlalu dini sebelum mencapai batas 60 evaluasi."
    ],
    groundingLinks: [
      { title: "Bergstra & Bengio (2012) Random Search Paper", url: "https://www.jmlr.org/papers/v13/bergstra12a.html", note: "Teorema fundamental penemuan optimum acak" }
    ]
  }),

  createSubchapter({
    id: "ml-28-3-bayesian-optimization-gp-tpe",
    slug: "bayesian-optimization-surrogate-model-gp-dan-tpe",
    title: "28.3 Bayesian Optimization: Model Pengganti (Surrogate Model) Gaussian Process & Tree-structured Parzen Estimators (TPE)",
    orderIndex: 3,
    description: "Optimasi fungsi kotak hitam mahal: Model pengganti probabilistik Gaussian Process (GP) vs Tree-structured Parzen Estimators (TPE) dan pembaruan posterior Bayesian.",
    theoryMarkdown: `Bayesian Optimization memandang evaluasi model validasi silang sebagai fungsi objektif kotak hitam yang mahal $f(\\mathbf{\\lambda})$ dengan observasi derau $y = f(\\mathbf{\\lambda}) + \\epsilon$.

Untuk memandu pencarian secara efisien, metode ini mempertahankan **model pengganti (*surrogate model*)**:
1. **Gaussian Process (GP)**:
   Mengasumsikan distribusi probabilitas bersama atas ruang fungsi $f(\\mathbf{\\lambda}) \\sim \\mathcal{GP}(m(\\mathbf{\\lambda}), k(\\mathbf{\\lambda}, \\mathbf{\\lambda}'))$. Memprediksi nilai rata-rata $\\mu(\\mathbf{\\lambda})$ dan ketidakpastian varians $\\sigma^2(\\mathbf{\\lambda})$ pada setiap titik yang belum diuji. Namun, memiliki kompleksitas komputasi invers matriks $O(N^3)$.
2. **Tree-structured Parzen Estimator (TPE)**:
   Pendekatan Bayesian terbalik via Teorema Bayes: Alih-alih memodelkan $P(y|\\mathbf{\\lambda})$, TPE memodelkan kepadatan probabilitas konfigurasi hiperparameter yang dipisahkan oleh ambang batas kuantil $\\gamma$:
   $$P(\\mathbf{\\lambda}|y) = \\begin{cases} \\ell(\\mathbf{\\lambda}) & \\text{jika } y < y^* \\\\ g(\\mathbf{\\lambda}) & \\text{jika } y \\ge y^* \\end{cases}$$
   di mana $\\ell(\\mathbf{\\lambda})$ adalah kepadatan parameter berkinerja unggul dan $g(\\mathbf{\\lambda})$ adalah parameter berkinerja buruk. Rasio $\\frac{\\ell(\\mathbf{\\lambda})}{g(\\mathbf{\\lambda})}$ sebanding dengan fungsi akuisisi Expected Improvement!`,
    mermaidDiagram: `graph TD
    History["Histori Evaluasi Hiperparameter (lambda, score)"] --> Surrogate{"Pilih Model Pengganti"}
    Surrogate -->|GP| GaussianProcess["Gaussian Process: mu(lambda), sigma(lambda)"]
    Surrogate -->|TPE| ParzenEstimator["TPE: Kepadatan l(lambda) / g(lambda)"]
    GaussianProcess --> Acquisition["Maksimalkan Fungsi Akuisisi (EI / UCB)"]
    ParzenEstimator --> Acquisition
    Acquisition --> NextPoint["Evaluasi Titik Hiperparameter Baru Terbaik"]
    NextPoint --> History`,
    scratchCode: `import numpy as np

class Simple1DGP:
    """Implementasi Gaussian Process 1D sederhana untuk ilustrasi Bayesian Optimization."""
    def __init__(self, l=1.0, sigma_f=1.0, noise=1e-4):
        self.l = l
        self.sigma_f = sigma_f
        self.noise = noise
        self.X_train = None
        self.y_train = None
        
    def kernel(self, x1, x2):
        dist = (x1[:, None] - x2[None, :]) ** 2
        return (self.sigma_f**2) * np.exp(-0.5 * dist / (self.l**2))
        
    def fit(self, X, y):
        self.X_train = np.asarray(X).reshape(-1)
        self.y_train = np.asarray(y).reshape(-1)
        K = self.kernel(self.X_train, self.X_train) + (self.noise**2) * np.eye(len(self.X_train))
        self.K_inv = np.linalg.inv(K)
        
    def predict(self, X_test):
        X_test = np.asarray(X_test).reshape(-1)
        K_s = self.kernel(self.X_train, X_test)
        K_ss = self.kernel(X_test, X_test) + 1e-8 * np.eye(len(X_test))
        
        mu = K_s.T @ self.K_inv @ self.y_train
        sigma2 = np.diag(K_ss - K_s.T @ self.K_inv @ K_s)
        return mu, np.sqrt(np.maximum(sigma2, 1e-8))

gp = Simple1DGP()
gp.fit([1.0, 3.0, 5.0], [2.0, 1.0, 4.0])
mu, std = gp.predict([2.0, 4.0])
print("Prediksi GP Mean:", np.round(mu, 3), "Std Deviasi:", np.round(std, 3))`,
    sotaCode: `from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import Matern
import numpy as np

X_train = np.array([[1.0], [3.0], [5.0]])
y_train = np.array([2.0, 1.0, 4.0])

gp_sota = GaussianProcessRegressor(kernel=Matern(nu=2.5), alpha=1e-4, random_state=42)
gp_sota.fit(X_train, y_train)

X_test = np.array([[2.0], [4.0]])
mean, std = gp_sota.predict(X_test, return_std=True)
print("Scikit-Learn GP Mean:", mean, "Std:", std)`,
    diagCode: `def verify_gp_interpolator(gp, X_train, y_train):
    mu, _ = gp.predict(X_train)
    residual = np.max(np.abs(mu - y_train))
    assert residual < 1e-2, "GP gagal menginterpolasi titik data observasi"
    return "Valid GP Interpolation"`,
    caseStudy: "Google Vizier dan Optuna menggunakan TPE sebagai algoritma sampling default karena kemampuannya menangani variabel kontinu, integer, kategorial bersyarat, dan penskalaan hingga ribuan uji coba tanpa degradasi $O(N^3)$.",
    commonPitfalls: [
      "Menggunakan Gaussian Process pada ruang pencarian berdimensi tinggi ($d > 20$) atau dengan ribuan observasi riwayat.",
      "Mengabaikan kernel prior yang sesuai dengan kontinuitas ruang hiperparameter."
    ],
    groundingLinks: [
      { title: "Bergstra et al. (2011) Algorithms for Hyper-Parameter Optimization (TPE)", url: "https://papers.nips.cc/paper/2011/file/86e8f7d990d9d00d22e69f539f92ac9e-Paper.pdf", note: "Paper asli pengenalan algoritma TPE" }
    ]
  }),

  createSubchapter({
    id: "ml-28-4-acquisition-functions-ei-ucb",
    slug: "fungsi-akuisisi-expected-improvement-dan-ucb",
    title: "28.4 Fungsi Akuisisi Eksplorasi-Eksploitasi: Expected Improvement (EI), Probability of Improvement (PI), & Upper Confidence Bound (UCB)",
    orderIndex: 4,
    description: "Keseimbangan dilema eksplorasi-eksploitasi dalam Bayesian Optimization: Penurunan analitis Expected Improvement (EI), Probability of Improvement (PI), dan Gaussian Process UCB.",
    theoryMarkdown: `Fungsi akuisisi $\\alpha(\\mathbf{\\lambda})$ mengkuantifikasi utilitas pengambilan sampel pada titik kandidat $\\mathbf{\\lambda}$ berdasarkan distribusi posterior model pengganti.

1. **Upper Confidence Bound (GP-UCB)**:
   $$\\alpha_{\\text{UCB}}(\\mathbf{\\lambda}) = \\mu(\\mathbf{\\lambda}) + \\kappa \\sigma(\\mathbf{\\lambda})$$
   Parameter $\\kappa > 0$ mengontrol trade-off: $\\mu$ mendorong **eksploitasi** (wilayah dengan estimasi rata-rata tinggi), sedangkan $\\kappa \\sigma$ mendorong **eksplorasi** (wilayah dengan ketidakpastian tinggi).

2. **Probability of Improvement (PI)**:
   Probabilitas bahwa $\\mathbf{\\lambda}$ baru akan melampaui skor terbaik saat ini $y^* = \\max y_i$:
   $$\\text{PI}(\\mathbf{\\lambda}) = P(f(\\mathbf{\\lambda}) \\ge y^* + \\xi) = \\Phi\\left( \\frac{\\mu(\\mathbf{\\lambda}) - y^* - \\xi}{\\sigma(\\mathbf{\\lambda})} \\right)$$

3. **Expected Improvement (EI)**:
   Ekspektasi besaran peningkatan relatif terhadap $y^*$:
   $$\\text{EI}(\\mathbf{\\lambda}) = \\mathbb{E}[\\max(0, f(\\mathbf{\\lambda}) - y^*)] = (\\mu(\\mathbf{\\lambda}) - y^* - \\xi) \\Phi(Z) + \\sigma(\\mathbf{\\lambda}) \\phi(Z)$$
   di mana $Z = \\frac{\\mu(\\mathbf{\\lambda}) - y^* - \\xi}{\\sigma(\\mathbf{\\lambda})}$, $\\Phi$ adalah CDF Gaussian standar, dan $\\phi$ adalah PDF Gaussian standar.`,
    mermaidDiagram: `graph LR
    Posterior["Posterior GP: Rata-rata mu(x) & Ketidakpastian sigma(x)"] --> Dilema{"Trade-off Eksplorasi vs Eksploitasi"}
    Dilema --> UCB["GP-UCB: mu(x) + kappa * sigma(x)"]
    Dilema --> EI["Expected Improvement: Ekspektasi Besaran Peningkatan"]
    UCB --> MaxAcq["Maksimisasi Numerik via L-BFGS / Random Sample"]
    EI --> MaxAcq
    MaxAcq --> Sample["Titik Evaluasi Model Berikutnya"]`,
    scratchCode: `import numpy as np
from scipy.stats import norm

def compute_expected_improvement(mu, sigma, y_best, xi=0.01):
    """Menghitung Expected Improvement (EI) secara analitis."""
    mu = np.asarray(mu)
    sigma = np.asarray(sigma)
    
    with np.errstate(divide='warn'):
        improvement = mu - y_best - xi
        Z = np.zeros_like(improvement)
        mask = sigma > 0
        Z[mask] = improvement[mask] / sigma[mask]
        
        ei = np.zeros_like(improvement)
        ei[mask] = improvement[mask] * norm.cdf(Z[mask]) + sigma[mask] * norm.pdf(Z[mask])
        
    return ei

def compute_ucb(mu, sigma, kappa=2.576):
    """Menghitung Upper Confidence Bound (UCB)."""
    return mu + kappa * sigma

mu = np.array([2.5, 3.2, 2.0])
sigma = np.array([0.8, 0.1, 1.5])
y_best = 3.0
print("Expected Improvement:", np.round(compute_expected_improvement(mu, sigma, y_best), 4))
print("GP-UCB (kappa=2.5):", np.round(compute_ucb(mu, sigma, kappa=2.5), 4))`,
    sotaCode: `from scipy.optimize import minimize
import numpy as np

# Optimasi numerik fungsi akuisisi untuk memilih titik x berikutnya
def negative_ei_objective(x, gp, y_best):
    mu, std = gp.predict(np.array([[x]]), return_std=True)
    ei = compute_expected_improvement(mu, std, y_best)
    return -ei

print("Optimasi fungsi akuisisi menggunakan solver Scipy L-BFGS-B selesai terdefinisi.")`,
    diagCode: `def verify_acquisition_positivity(ei_scores):
    assert np.all(ei_scores >= 0.0), "Expected Improvement tidak boleh bernilai negatif!"
    return "Valid Non-Negative EI"`,
    caseStudy: "Snoek, Larochelle, & Adams (2012) menunjukkan bahwa penggunaan fungsi akuisisi Expected Improvement pada penyetelan Convolutional Neural Networks mampu melampaui keahlian tuning manual para insinyur AI berpengalaman.",
    commonPitfalls: [
      "Menyetel nilai eksplorasi xi terlalu kecil, menyebabkan algoritma terjebak secara prematur di sekitar optimum lokal yang sudah diketahui.",
      "Mengasumsikan fungsi akuisisi mudah dioptimalkan; fungsi akuisisi sering kali memiliki banyak puncak lokal tajam."
    ],
    groundingLinks: [
      { title: "Snoek et al. (2012) Practical Bayesian Optimization of Machine Learning Algorithms", url: "https://papers.nips.cc/paper/2012/file/05311655a15b75fab86956663e1819ce-Paper.pdf", note: "Paper klasik penerapan Bayesian Opt pada deep learning" }
    ]
  }),

  createSubchapter({
    id: "ml-28-5-successive-halving-hyperband",
    slug: "alokasi-multi-fidelity-successive-halving-dan-hyperband",
    title: "28.5 Alokasi Sumber Daya Multi-Fidelity: Teori Successive Halving & Algoritma Hyperband (Bandit-Based Search)",
    orderIndex: 5,
    description: "Optimasi multi-fidelity berbasis bandit: Algoritma Successive Halving (SHA), eliminasi konfigurasi buruk secara dini, dan algoritma Hyperband.",
    theoryMarkdown: `Metode konvensional mengevaluasi setiap konfigurasi hiperparameter pada anggaran penuh ($R$ epoch atau $N$ baris sampel). Sebaliknya, **optimasi multi-fidelity** memanfaatkan aproksimasi cepat berbiaya murah untuk menyaring konfigurasi potensial.

1. **Successive Halving Algorithm (SHA)**:
   - Mulai dengan $n$ konfigurasi acak yang dievaluasi dengan alokasi sumber daya minimal $r$.
   - Urutkan konfigurasi berdasarkan performa awal.
   - Pangkas konfigurasi terburuk: hanya pertahankan fraksi teratas $\\frac{1}{\\eta}$ (biasanya $\\eta = 3$).
   - Tingkatkan alokasi sumber daya sebesar faktor $\\eta$ bagi konfigurasi yang bertahan.
   - Ulangi hingga iterasi terakhir di mana segelintir konfigurasi terbaik menerima alokasi sumber daya penuh $R$.

2. **Hyperband**:
   Menyelesaikan dilema 'konfigurasi awal vs alokasi sumber daya' (*$n$ versus $B/n$ trade-off*) dengan menjalankan Successive Halving secara berlapis pada berbagai tingkat agresivitas bracket $s \\in \\{0, 1, \\dots, s_{\\max}\\}$. Hyperband secara teoretis menjamin kecepatan hingga $30\\times$ lebih cepat dibanding Bayesian Optimization konvensional.`,
    mermaidDiagram: `graph TD
    SHA["Successive Halving (Iterasi 0: 27 Konfigurasi @ 1 Epoch)"] --> Round1["Pangkas 2/3 Terburuk -> 9 Konfigurasi @ 3 Epoch"]
    Round1 --> Round2["Pangkas 2/3 Terburuk -> 3 Konfigurasi @ 9 Epoch"]
    Round2 --> Winner["Pemenang: 1 Konfigurasi Terbaik @ 27 Epoch"]`,
    scratchCode: `import numpy as np

def successive_halving_scratch(eval_func, configs, max_resource=27, eta=3):
    """Implementasi Successive Halving dari scratch."""
    current_configs = list(configs)
    n = len(current_configs)
    s_max = int(np.floor(np.log(max_resource) / np.log(eta)))
    min_resource = max_resource / (eta ** s_max)
    
    current_resource = min_resource
    while len(current_configs) > 1 and current_resource <= max_resource:
        scores = []
        for cfg in current_configs:
            score = eval_func(cfg, int(current_resource))
            scores.append(score)
            
        # Urutkan dan ambil top 1/eta
        n_survivors = max(1, int(len(current_configs) / eta))
        top_indices = np.argsort(scores)[-n_survivors:]
        current_configs = [current_configs[i] for i in top_indices]
        print(f"Resource {int(current_resource)} Epoch: {len(current_configs)} konfigurasi bertahan.")
        current_resource *= eta
        
    return current_configs[0]

# Mock test
configs = [{'id': i, 'quality': np.random.uniform(0, 1)} for i in range(27)]
def mock_trainer(cfg, epochs):
    return cfg['quality'] + np.random.normal(0, 0.05 / np.sqrt(epochs))

winner = successive_halving_scratch(mock_trainer, configs)
print("Konfigurasi Pemenang:", winner)`,
    sotaCode: `from sklearn.experimental import enable_halving_search_cv
from sklearn.model_selection import HalvingRandomSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=500, n_features=10, random_state=42)
param_distributions = {'max_depth': [2, 4, 6, 8, 10, None], 'min_samples_split': [2, 5, 10]}

halving_search = HalvingRandomSearchCV(RandomForestClassifier(random_state=42),
                                       param_distributions, resource='n_estimators',
                                       max_resources=50, factor=3, random_state=42)
halving_search.fit(X, y)
print("Halving Search Best Params:", halving_search.best_params_)`,
    diagCode: `def verify_hyperband_budget(max_resource, eta):
    s_max = int(np.floor(np.log(max_resource) / np.log(eta)))
    total_brackets = s_max + 1
    return {"s_max": s_max, "total_brackets": total_brackets}`,
    caseStudy: "Li et al. (2017) membuktikan pada benchmark dataset CIFAR-10 dan ImageNet bahwa Hyperband menemukan model dengan akurasi setara Bayesian Optimization konvensional dalam waktu komputasi 1/5 hingga 1/30 kali lebih singkat.",
    commonPitfalls: [
      "Mengasumsikan peringkat performa model pada sedikit sampel/epoch selalu berkorelasi positif sempurna dengan performa akhir (masalah ranking instability).",
      "Memilih alokasi minimum resource terlalu rendah sehingga performa model setara noise acak."
    ],
    groundingLinks: [
      { title: "Li et al. (2017) Hyperband: A Novel Bandit-Based Approach to Hyperparameter Optimization", url: "https://arxiv.org/abs/1603.06560", note: "Paper asli penemu Hyperband" }
    ]
  }),

  createSubchapter({
    id: "ml-28-6-optuna-framework-pruning",
    slug: "framework-optuna-kontemporer-tpe-dan-pruning-asinkron",
    title: "28.6 Framework Optuna Kontemporer: Arsitektur Sampling TPE, Pruning Otomatis Asinkron, & Visualisasi Sensitivitas Hiperparameter",
    orderIndex: 6,
    description: "Desain sistem penyetelan modern dengan Optuna: Paradigma Define-by-Run, pruning otomatis berbasis ASHA, integrasi LightGBM, dan visualisasi sensitivitas hiperparameter.",
    theoryMarkdown: `Optuna merupakan framework otomatisasi hiperparameter kontemporer yang merevolusi paradigma penyetelan melalui pendekatan **Define-by-Run**:
1. **Dynamic Parameter Search Space**: Ruang pencarian didefinisikan secara imperatif melalui metode \`trial.suggest_*\`, memungkinkan hiperparameter bersyarat (*conditional hyperparameters*) yang kompleks tanpa konfigurasi statis.
2. **Asynchronous Successive Halving (ASHA Pruner)**:
   Mekanisme pruning otomatis yang menghentikan uji coba (*trial*) yang tidak menjanjikan secara real-time pada epoch awal, menghemat sumber daya GPU/CPU tanpa sinkronisasi antar-thread.
3. **Analisis Sensitivitas Post-Hoc**:
   Visualisasi interaktif berbasis fungsi ANOVA atau kontribusi Shapley (*fANOVA*) untuk mengukur persentase pengaruh masing-masing hiperparameter terhadap varians metrik objektif.`,
    mermaidDiagram: `graph TD
    Trial["Trial Baru Dimulai"] --> Suggest["trial.suggest_float / int (TPE Sampler)"]
    Suggest --> TrainEpoch["Latih 1 Epoch"]
    TrainEpoch --> Report["trial.report(score, step)"]
    Report --> ShouldPrune{"trial.should_prune() (ASHA Pruner)"}
    ShouldPrune -->|Ya| Stop["Hentikan Trial Seketika (Hemat Waktu)"]
    ShouldPrune -->|Tidak| NextStep["Lanjut Epoch Berikutnya"]`,
    scratchCode: `class MockOptunaTrial:
    """Simulasi struktur logika Trial Optuna Define-by-Run dari scratch."""
    def __init__(self, trial_id):
        self.trial_id = trial_id
        self.params = {}
        
    def suggest_float(self, name, low, high, log=False):
        val = np.exp(np.random.uniform(np.log(low), np.log(high))) if log else np.random.uniform(low, high)
        self.params[name] = val
        return val
        
    def should_prune(self, step, intermediate_val, threshold=0.3):
        # Pruning deterministik sederhana
        return step >= 2 and intermediate_val < threshold

trial = MockOptunaTrial(1)
lr = trial.suggest_float('lr', 1e-4, 1e-1, log=True)
print(f"Trial Disarankan Learning Rate: {lr:.5f}")
print("Apakah di-prune pada epoch 2:", trial.should_prune(2, 0.15))`,
    sotaCode: `import optuna
import lightgbm as lgb
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X, y = make_classification(n_samples=500, n_features=10, random_state=42)
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

def objective(trial):
    params = {
        'objective': 'binary',
        'metric': 'binary_error',
        'learning_rate': trial.suggest_float('learning_rate', 1e-3, 0.2, log=True),
        'num_leaves': trial.suggest_int('num_leaves', 8, 64),
        'max_depth': trial.suggest_int('max_depth', 3, 8),
        'verbose': -1
    }
    
    dtrain = lgb.Dataset(X_train, label=y_train)
    dval = lgb.Dataset(X_val, label=y_val)
    
    model = lgb.train(params, dtrain, valid_sets=[dval], num_boost_round=50,
                      callbacks=[optuna.integration.LightGBMPruningCallback(trial, 'binary_error')])
    
    preds = (model.predict(X_val) >= 0.5).astype(int)
    return accuracy_score(y_val, preds)

study = optuna.create_study(direction='maximize', pruner=optuna.pruners.HyperbandPruner())
optuna.logging.set_verbosity(optuna.logging.WARNING)
study.optimize(objective, n_trials=10)
print("Optuna Best Parameters:", study.best_params)
print("Optuna Best Accuracy:", study.best_value)`,
    diagCode: `def verify_optuna_trials(study):
    completed = [t for t in study.trials if t.state == optuna.trial.TrialState.COMPLETE]
    pruned = [t for t in study.trials if t.state == optuna.trial.TrialState.PRUNED]
    return {"Total": len(study.trials), "Completed": len(completed), "Pruned": len(pruned)}`,
    caseStudy: "Akiba et al. (2019) mendemonstrasikan bahwa implementasi Optuna pada distributed cluster memungkinkan pemrosesan 10.000 uji coba dalam hitungan jam untuk kompetisi KDD Cup dan Kaggle Grandmaster pipelines.",
    commonPitfalls: [
      "Menggunakan pruner pada model yang objektifnya berfluktuasi liar antar epoch tanpa smoothing.",
      "Lupa menangani TrialPruned exception secara eksplisit saat mengintegrasikan pustaka custom."
    ],
    groundingLinks: [
      { title: "Akiba et al. (2019) Optuna: A Next-generation Hyperparameter Optimization Framework", url: "https://arxiv.org/abs/1907.10902", note: "Paper resmi framework Optuna" },
      { title: "Optuna Official Documentation", url: "https://optuna.org/", note: "Dokumentasi API dan integrasi" }
    ]
  })
];

const ch28 = {
  id: "machine-learning-ch-28",
  title: "Bab 28: Penyetelan Hiperparameter Lanjut: Bayesian Optimization & Hyperband",
  slug: "penyetelan-hiperparameter-bayesian-opt-hyperband",
  orderIndex: 28,
  description: "Batas komputasi Grid Search, keunggulan teoretis Random Search Bergstra-Bengio, Bayesian Optimization dengan model pengganti Gaussian Process dan TPE, fungsi akuisisi Expected Improvement dan UCB, alokasi multi-fidelity Successive Halving dan Hyperband, serta framework kontemporer Optuna.",
  subchapters: ch28Subchapters
};

fs.writeFileSync(path.join(OUT_DIR, 'chunk6-ch28.ts'), exportChapterTs(ch28, 'chapter28'));
console.log('Successfully generated chunk6-ch28.ts (6 subchapters)');

// ==========================================
// CHAPTER 29: Rekayasa Fitur Lanjut: Encoding Kategorial & Imputasi Statistik
// ==========================================
const ch29Subchapters = [
  createSubchapter({
    id: "ml-29-1-numerical-scaling-power-transform",
    slug: "skalabilitas-fitur-numerik-standardisasi-robust-yeo-johnson",
    title: "29.1 Skalabilitas Fitur Numerik: Standardisasi Z-Score, Min-Max Scaling, Robust Scaling (IQR), & Transformasi Daya (Yeo-Johnson)",
    orderIndex: 1,
    description: "Matematika penyesuaian skala fitur numerik: Standardisasi Z-Score, Min-Max, Robust Scaler berbasis rentang interkuartil (IQR), dan transformasi daya Box-Cox / Yeo-Johnson.",
    theoryMarkdown: `Algoritma yang sensitif terhadap jarak (k-NN, SVM, K-Means) dan regularisasi linier (Ridge, Lasso) memerlukan penskalaan fitur numerik $\\mathbf{x} \\in \\mathbb{R}^N$:

1. **Standardisasi Z-Score**:
   $$z_i = \\frac{x_i - \\mu}{\\sigma}, \\quad \\mu = \\mathbb{E}[x], \\quad \\sigma = \\sqrt{\\text{Var}(x)}$$
2. **Min-Max Scaling**:
   $$x'_i = \\frac{x_i - x_{\\min}}{x_{\\max} - x_{\\min}} \\in [0, 1]$$
   Sangat rentan terhadap distorsi jika terdapat nilai pencilan eksternal.
3. **Robust Scaling (IQR)**:
   Menggunakan statistik median dan rentang interkuartil yang kebal terhadap outlier:
   $$x_{\\text{robust}} = \\frac{x_i - Q_2(x)}{Q_3(x) - Q_1(x)}$$
4. **Transformasi Daya Yeo-Johnson**:
   Menstabilkan varians dan mendekatkan distribusi miring ke distribusi Gaussian (berlaku untuk nilai positif maupun negatif):
   $$\\psi(\\lambda, x) = \\begin{cases} ((x + 1)^\\lambda - 1) / \\lambda & \\text{jika } \\lambda \\neq 0, x \\ge 0 \\\\ \\ln(x + 1) & \\text{jika } \\lambda = 0, x \\ge 0 \\\\ -((-x + 1)^{2 - \\lambda} - 1) / (2 - \\lambda) & \\text{jika } \\lambda \\neq 2, x < 0 \\\\ -\\ln(-x + 1) & \\text{jika } \\lambda = 2, x < 0 \\end{cases}$$`,
    mermaidDiagram: `graph TD
    RawData["Fitur Kontinu Mentah"] --> CheckDist{"Apakah Memiliki Outlier atau Distribusi Miring?"}
    CheckDist -->|Tidak Ada Outlier| ZScore["StandardScaler (Z-Score)"]
    CheckDist -->|Ada Outlier Ekstrem| Robust["RobustScaler (Median & IQR)"]
    CheckDist -->|Distribusi Miring Parah| Power["PowerTransformer (Yeo-Johnson / Box-Cox)"]`,
    scratchCode: `import numpy as np

def compute_scalers_scratch(x):
    """Menghitung Z-Score, MinMax, dan Robust Scaler dari scratch."""
    x = np.asarray(x, dtype=float)
    
    # 1. Z-Score
    mu = np.mean(x)
    std = np.std(x)
    z_score = (x - mu) / std if std > 0 else np.zeros_like(x)
    
    # 2. MinMax
    x_min, x_max = np.min(x), np.max(x)
    min_max = (x - x_min) / (x_max - x_min) if (x_max - x_min) > 0 else np.zeros_like(x)
    
    # 3. Robust (IQR)
    q1, median, q3 = np.percentile(x, [25, 50, 75])
    iqr = q3 - q1
    robust = (x - median) / iqr if iqr > 0 else np.zeros_like(x)
    
    return {"Z_Score": z_score, "MinMax": min_max, "Robust": robust}

data = np.array([1.0, 2.0, 2.5, 3.0, 100.0]) # Outlier 100
res = compute_scalers_scratch(data)
print("Robust Scaled:", np.round(res["Robust"], 2))`,
    sotaCode: `from sklearn.preprocessing import StandardScaler, RobustScaler, PowerTransformer
import numpy as np

data = np.array([[1.0], [2.0], [2.5], [3.0], [100.0]])

scaler_robust = RobustScaler().fit_transform(data)
scaler_pt = PowerTransformer(method='yeo-johnson').fit_transform(data)
print("Scikit-Learn RobustScaler:\\n", np.round(scaler_robust.flatten(), 2))
print("Scikit-Learn Yeo-Johnson:\\n", np.round(scaler_pt.flatten(), 2))`,
    diagCode: `def check_normality_skewness(x):
    from scipy.stats import skew
    sk = skew(x)
    return {"Skewness": sk, "Is_Approx_Normal": abs(sk) < 0.5}`,
    caseStudy: "Pada model deteksi transaksi pencucian uang, fitur nilai transfer memiliki rentang $10 s.d. $100.000.000; transformasi Yeo-Johnson terbukti krusial untuk mencegah bobot neural network meledak.",
    commonPitfalls: [
      "Menggunakan Box-Cox pada data yang memiliki nilai nol atau negatif (Box-Cox mensyaratkan $x > 0$, gunakan Yeo-Johnson).",
      "Memanggil .fit() scaler pada data uji (test set)."
    ],
    groundingLinks: [
      { title: "Yeo & Johnson (2000) A new family of power transformations to improve normality or symmetry", url: "https://doi.org/10.1093/biomet/87.4.954", note: "Paper asli transformasi Yeo-Johnson" }
    ]
  }),

  createSubchapter({
    id: "ml-29-2-categorical-low-cardinality",
    slug: "encoding-kategorial-bernilai-rendah-one-hot-dummy-trap",
    title: "29.2 Encoding Kategorial Bernilai Rendah: One-Hot Encoding, Dummy Variable Trap, & Ordinal Mapping",
    orderIndex: 2,
    description: "Encoding fitur kategorial diskrit: Pemetaan Ordinal, One-Hot Encoding, jebakan multikolinearitas eksak (Dummy Variable Trap), dan matriks tereduksi.",
    theoryMarkdown: `Variabel kategorial $C \\in \\{c_1, \\dots, c_K\\}$ harus dikonversikan ke dalam representasi numerik:
1. **Ordinal Encoding**:
   Memetakan kategori ke bilangan bulat terurut $c_k \\mapsto k$. Hanya valid jika terdapat relasi tingkatan alami ($c_1 < c_2 < \\dots < c_K$, seperti: Rendah, Sedang, Tinggi). Jika diterapkan pada data nominal acak (misal: Warna), menginduksi jarak buatan yang salah.
2. **One-Hot Encoding (OHE)**:
   Memetakan kategori menjadi vektor biner berdimensi $K$: $\\mathbf{x} = [\\mathbb{I}(C=c_1), \\dots, \\mathbb{I}(C=c_K)]^T$.
3. **Dummy Variable Trap**:
   Jumlah kolom biner $K$ menghasilkan multikolinearitas sempurna karena:
   $$\\sum_{k=1}^K x_{i, k} = 1 \\quad (\\text{kolom identitas linier terhadap vektor intersep})$$
   Hal ini menyebabkan matriks desain $\\mathbf{X}^T\\mathbf{X}$ menjadi singular (tidak dapat diinverskan) pada regresi linier OLS. Solusinya: Jatuhkan satu kategori acuan (*drop first column*), menyisakan $K-1$ kolom biner.`,
    mermaidDiagram: `graph LR
    Kategori["Fitur Kategorial"] --> CekTingkat{"Memiliki Hierarki Terurut?"}
    CekTingkat -->|Ya| Ordinal["Ordinal Encoding: [0, 1, 2, ...]"]
    CekTingkat -->|Tidak (Nominal)| CheckModel{"Model Linier vs Model Pohon?"}
    CheckModel -->|Linier / Jaringan Saraf| OHE_Drop["One-Hot (Drop First: K-1 Kolom Bebas Multikolinearitas)"]
    CheckModel -->|Tree Ensembles| OHE_Full["One-Hot Penuh (K Kolom)"]`,
    scratchCode: `import numpy as np

def one_hot_encode_scratch(categories, drop_first=True):
    """Implementasi One-Hot Encoding dari scratch dengan penanganan dummy variable trap."""
    categories = np.asarray(categories)
    unique_cats = np.unique(categories)
    
    mapping = {c: i for i, c in enumerate(unique_cats)}
    n_samples = len(categories)
    n_classes = len(unique_cats)
    
    ohe_matrix = np.zeros((n_samples, n_classes), dtype=int)
    for i, c in enumerate(categories):
        ohe_matrix[i, mapping[c]] = 1
        
    if drop_first:
        ohe_matrix = ohe_matrix[:, 1:]
        unique_cats = unique_cats[1:]
        
    return ohe_matrix, unique_cats

cats = ['Merah', 'Biru', 'Hijau', 'Biru', 'Merah']
mat, colnames = one_hot_encode_scratch(cats, drop_first=True)
print("Kolom Tersisa (Bebas Trap):", colnames)
print("Matriks Desain OHE:\\n", mat)`,
    sotaCode: `from sklearn.preprocessing import OneHotEncoder
import numpy as np

cats = np.array([['Merah'], ['Biru'], ['Hijau'], ['Biru'], ['Merah']])
ohe = OneHotEncoder(drop='first', sparse_output=False)
res = ohe.fit_transform(cats)
print("Scikit-Learn OHE (drop='first'):\\n", res)`,
    diagCode: `def verify_design_matrix_rank(X):
    rank = np.linalg.matrix_rank(X)
    n_cols = X.shape[1]
    return {"Matrix_Rank": rank, "Full_Rank": rank == n_cols}`,
    caseStudy: "Pada model penetapan polis asuransi jiwa berbasis GLM, pengembang lupa menyetel drop='first' pada fitur 'Wilayah Domisili', menyebabkan solver Hessian gagal konvergen karena singularitas matriks kovarians.",
    commonPitfalls: [
      "Menggunakan One-Hot Encoding pada fitur dengan ribuan kardinalitas kategori (seperti Kode Pos), meledakkan dimensi dan memori komputasi.",
      "Menggunakan Ordinal Encoding pada kategori nominal murni untuk model linier."
    ],
    groundingLinks: [
      { title: "Scikit-Learn Preprocessing Encoders", url: "https://scikit-learn.org/stable/modules/preprocessing.html#encoding-categorical-features", note: "Dokumentasi resmi pemrosesan kategorial" }
    ]
  }),

  createSubchapter({
    id: "ml-29-3-target-encoding-bayesian-smoothing",
    slug: "encoding-kategorial-kardinalitas-tinggi-target-encoding-m-estimate",
    title: "29.3 Encoding Kategorial Kardinalitas Tinggi: Target Encoding dengan Bayesian Smoothing (m-estimate) & Out-of-Fold Encoding",
    orderIndex: 3,
    description: "Encoding fitur kategorial berkardinalitas tinggi ($K > 1000$): Target Encoding, smoothing Bayesian m-estimate terhadap prior global, dan pencegahan target leakage via K-Fold Out-of-Fold.",
    theoryMarkdown: `Pada variabel dengan kardinalitas sangat tinggi (seperti ID Toko, Kode Pos, IP Address), One-Hot Encoding menghasilkan matriks yang sangat jarang (*sparse*) dan mengalami kutukan dimensi.

**Target Encoding (Mean Target Encoding)** memetakan setiap kategori $c$ ke nilai rata-rata variabel target $y$:
$$\\hat{S}_c = \\mathbb{E}[y \\mid C = c] = \\frac{\\sum_{i \\in C=c} y_i}{n_c}$$

**Masalah & Solusi Arsitektural**:
1. **Overfitting pada Kategori Frekuensi Rendah**:
   Jika suatu toko hanya memiliki 1 transaksi dan terjadi penipuan ($y=1$), $\\hat{S}_c = 1.0$ (estimasi varians sangat tinggi).
   **Bayesian Smoothing ($m$-estimate)** menghaluskan estimasi lokal dengan prior rata-rata global $\\bar{y}$:
   $$S_c^{\\text{smooth}} = \\frac{n_c \\hat{S}_c + m \\bar{y}}{n_c + m}$$
   di mana $m > 0$ adalah bobot smoothing (parameter pseudo-counts).
2. **Target Leakage**:
   Menghitung target encoding pada baris yang sama menyebabkan model 'melihat' labelnya sendiri. Solusi wajib: **K-Fold Out-of-Fold (OOF) Target Encoding**.`,
    mermaidDiagram: `graph TD
    Kategori["Kategori Frekuensi n_c"] --> Smoothing{"Bandingkan n_c dengan Ambang Bobot m"}
    Smoothing --> Formula["S_c = (n_c * mean_c + m * global_mean) / (n_c + m)"]
    Formula --> OOF["Hitung Hanya Menggunakan Lipatan Out-of-Fold (Anti Bocor)"]`,
    scratchCode: `import numpy as np

def target_encode_oof_scratch(categories, targets, n_splits=5, m_smoothing=10.0, seed=42):
    """Target Encoding Out-of-Fold dengan Bayesian Smoothing dari scratch."""
    np.random.seed(seed)
    categories = np.asarray(categories)
    targets = np.asarray(targets, dtype=float)
    n = len(categories)
    
    global_mean = np.mean(targets)
    encoded = np.zeros(n)
    
    # Acak indeks untuk split K-Fold
    indices = np.random.permutation(n)
    folds = np.array_split(indices, n_splits)
    
    for val_idx in folds:
        train_idx = np.setdiff1d(indices, val_idx)
        
        # Hitung statistik hanya dari fold train
        cat_train = categories[train_idx]
        y_train = targets[train_idx]
        
        # Mapping mean dan counts
        unique_c = np.unique(cat_train)
        smoothed_map = {}
        for c in unique_c:
            mask = (cat_train == c)
            n_c = np.sum(mask)
            mean_c = np.mean(y_train[mask])
            smoothed_map[c] = (n_c * mean_c + m_smoothing * global_mean) / (n_c + m_smoothing)
            
        # Terapkan ke fold val
        for i in val_idx:
            c_val = categories[i]
            encoded[i] = smoothed_map.get(c_val, global_mean)
            
    return encoded

cats = ['KOTA_A', 'KOTA_A', 'KOTA_B', 'KOTA_C', 'KOTA_A', 'KOTA_B']
targets = [1, 1, 0, 1, 0, 0]
enc = target_encode_oof_scratch(cats, targets, n_splits=2, m_smoothing=5.0)
print("OOF Target Encoded Values:", np.round(enc, 3))`,
    sotaCode: `from sklearn.preprocessing import TargetEncoder
import numpy as np

cats = np.array([['KOTA_A'], ['KOTA_A'], ['KOTA_B'], ['KOTA_C'], ['KOTA_A'], ['KOTA_B']])
targets = np.array([1, 1, 0, 1, 0, 0])

# Scikit-Learn 1.3+ Native Target Encoder dengan internal smooth & CV
te = TargetEncoder(smooth='auto', cv=2, random_state=42)
encoded = te.fit_transform(cats, targets)
print("Scikit-Learn TargetEncoder Output:\\n", np.round(encoded, 3))`,
    diagCode: `def verify_no_single_sample_leak(encoded_col, target_col):
    corr = np.corrcoef(encoded_col, target_col)[0, 1]
    assert corr < 0.999, "Peringatan: Korelasi ekstrem mengindikasikan kebocoran target langsung!"
    return "Valid OOF Encoding"`,
    caseStudy: "Micci-Barreca (2001) memelopori target encoding untuk sistem scoring risiko kredit perbankan, memungkinkan pemanfaatan variabel kode pos dengan 40.000 kategori tanpa degradasi akurasi.",
    commonPitfalls: [
      "Menghitung target encoding secara global tanpa validasi silang Out-of-Fold, menyebabkan over-optimisme ekstrem pada training set.",
      "Mengabaikan penanganan kategori baru (*unseen categories*) saat proses inferensi data uji."
    ],
    groundingLinks: [
      { title: "Micci-Barreca (2001) A preprocessing scheme for high-cardinality categorical attributes", url: "https://doi.org/10.1145/507533.507538", note: "Paper pendiri formulasi Target Encoding" }
    ]
  }),

  createSubchapter({
    id: "ml-29-4-missing-imputation-strategies",
    slug: "strategi-imputasi-nilai-hilang-univariat-knn-mice",
    title: "29.4 Strategi Imputasi Nilai Hilang (Missing Values): Imputasi Univariat, KNN Imputation, & Iterative Imputer (MICE)",
    orderIndex: 4,
    description: "Mekanisme hilangnya data (MCAR, MAR, MNAR), strategi imputasi statistik univariat, pendekatan topologis KNN Imputer, dan Multivariat Imputation by Chained Equations (MICE).",
    theoryMarkdown: `Rubin (1976) mengklasifikasikan mekanisme data hilang ke dalam tiga kategori:
1. **Missing Completely at Random (MCAR)**: Peluang hilang tidak bergantung pada data teramati maupun tidak teramati.
2. **Missing at Random (MAR)**: Peluang hilang bergantung pada fitur teramati lain.
3. **Missing Not at Random (MNAR)**: Peluang hilang berkaitan langsung dengan nilai yang hilang itu sendiri.

**Taksonomi Metode Imputasi**:
- **Univariat**: Mengganti $NaN$ dengan Mean, Median, atau Modus kolom. Mengabaikan korelasi antar-fitur dan mendistorsi varians ke bawah.
- **KNN Imputer**: Mengganti $NaN$ pada baris $i$ dengan rata-rata terbobot dari $k$-tetangga terdekat yang memiliki fitur lengkap pada koordinat tersebut.
- **Multivariate Imputation by Chained Equations (MICE / Iterative Imputer)**:
  Memodelkan setiap fitur yang memiliki nilai hilang sebagai fungsi regresi terhadap seluruh fitur lain secara bergantian:
  $$\\mathbf{x}_j \\sim f(\\mathbf{X}_{-j}; \\mathbf{w}_j)$$
  Siklus diulang selama beberapa iterasi hingga parameter terimputasi stabil.`,
    mermaidDiagram: `graph TD
    DataNaN["Data Mengandung Missing Values (NaN)"] --> Mekanisme{"Identifikasi Mekanisme & Korelasi"}
    Mekanisme -->|Sederhana / Cepat| Simple["SimpleImputer (Median / Modus)"]
    Mekanisme -->|Topologis Lokal| KNN["KNNImputer (Rata-rata K-Tetangga Terdekat)"]
    Mekanisme -->|Korelasi Multivariat Kompleks| MICE["IterativeImputer / MICE (Chained Regressions)"]`,
    scratchCode: `import numpy as np

def simple_mean_imputer_scratch(X):
    """Imputasi rata-rata kolom univariat dari scratch."""
    X_imputed = np.copy(X)
    n_features = X.shape[1]
    
    for j in range(n_features):
        col = X_imputed[:, j]
        nan_mask = np.isnan(col)
        if np.any(nan_mask):
            mean_val = np.nanmean(col)
            col[nan_mask] = mean_val
            
    return X_imputed

X = np.array([[1.0, 2.0], [np.nan, 4.0], [5.0, np.nan], [7.0, 8.0]])
print("Imputasi Univariat Scratch:\\n", simple_mean_imputer_scratch(X))`,
    sotaCode: `from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer, KNNImputer
import numpy as np

X = np.array([[1.0, 2.0], [np.nan, 4.0], [5.0, np.nan], [7.0, 8.0]])

knn_imp = KNNImputer(n_neighbors=2).fit_transform(X)
mice_imp = IterativeImputer(max_iter=10, random_state=42).fit_transform(X)
print("KNN Imputed:\\n", np.round(knn_imp, 2))
print("MICE Imputed:\\n", np.round(mice_imp, 2))`,
    diagCode: `def verify_no_nans(X):
    nan_count = np.sum(np.isnan(X))
    assert nan_count == 0, f"Masih tersisa {nan_count} nilai NaN!"
    return "Lolos Bebas Nilai Hilang"`,
    caseStudy: "Dalam analisis rekam medis ICU (MIMIC database), lebih dari 40% hasil uji lab bernilai hilang; penggunaan MICE berbasis Bayesian Ridge terbukti menjaga struktur korelasi fisiologis pasien jauh lebih baik dibanding imputasi mean.",
    commonPitfalls: [
      "Mengganti nilai hilang dengan angka nol secara sembarangan (dapat disalahartikan sebagai kuantitas fisiologis normal).",
      "Tidak menyertakan fitur indikator biner `MissingIndicator` yang menandai apakah data sebelumnya hilang (kehilangan itu sendiri sering mengandung sinyal prediktif kuat).",
    ],
    groundingLinks: [
      { title: "van Buuren & Groothuis-Oudshoorn (2011) mice: Multivariate Imputation by Chained Equations in R", url: "https://doi.org/10.18637/jss.v045.i03", note: "Makalah fundamental algoritma MICE" }
    ]
  }),

  createSubchapter({
    id: "ml-29-5-synthetic-feature-construction",
    slug: "konstruksi-fitur-sintetis-polinomial-dan-interaksi-multi-kolom",
    title: "29.5 Konstruksi Fitur Sintetis: Transformasi Polinomial, Rasio Non-Linier, & Interaksi Fitur Multi-Kolom",
    orderIndex: 5,
    description: "Pembentukan representasi fitur baru: Ekspansi polinomial, fitur interaksi perkalian silang, rasio fisik domain spesifik, dan pencegahan ledakan kombinatorial.",
    theoryMarkdown: `Model linier tidak mampu menangkap hubungan non-linier dan efek interaksi antar-variabel secara intrinsik tanpa augmentasi ruang fitur:

1. **Ekspansi Polinomial & Interaksi Silang**:
   Diberikan fitur $x_1$ dan $x_2$, ekspansi polinomial derajat $d=2$ menghasilkan:
   $$\\phi(x_1, x_2) = [1, x_1, x_2, x_1^2, x_2^2, x_1 x_2]^T$$
   Fitur interaksi $x_1 x_2$ merepresentasikan efek sinergis di mana dampak $x_1$ terhadap target bergantung pada besaran $x_2$.
2. **Kombinatorika Ledakan Fitur**:
   Jumlah total fitur hasil ekspansi derajat $d$ dari $p$ variabel adalah kombinasi dengan pengulangan:
   $$N_{\\text{fitur}} = \\binom{p + d}{d}$$
   Untuk $p=100$ dan $d=3$, jumlah fitur meledak menjadi $\\approx 176.851$, memicu *overfitting* parah.
3. **Rasio Non-Linier Spesifik Domain**:
   Menciptakan fitur baru berbasis hukum fisika atau ekonomi:
   $$\\text{Debt-to-Income} = \\frac{\\text{Total Utang}}{\\text{Pendapatan}}, \\quad \\text{BMI} = \\frac{\\text{Berat (kg)}}{\\text{Tinggi (m)}^2}$$`,
    mermaidDiagram: `graph LR
    FiturA["Fitur x1"] --> Kombinasi["Operator Interaksi / Rasio"]
    FiturB["Fitur x2"] --> Kombinasi
    Kombinasi --> Interaksi["x1 * x2 (Sinergi Multiplikatif)"]
    Kombinasi --> Rasio["x1 / (x2 + eps) (Rasio Domain Spesifik)"]
    Kombinasi --> Kuadrat["x1^2, x2^2 (Kurvatur Non-Linier)"]`,
    scratchCode: `import numpy as np

def polynomial_features_2d_scratch(X):
    """Menghasilkan fitur polinomial derajat 2 dan interaksi dari scratch untuk 2 fitur."""
    X = np.asarray(X, dtype=float)
    x1 = X[:, 0]
    x2 = X[:, 1]
    
    # [1, x1, x2, x1^2, x1*x2, x2^2]
    bias = np.ones_like(x1)
    x1_sq = x1 ** 2
    x1_x2 = x1 * x2
    x2_sq = x2 ** 2
    
    return np.column_stack([bias, x1, x2, x1_sq, x1_x2, x2_sq])

data = np.array([[2.0, 3.0], [4.0, 5.0]])
print("Polinomial 2D Scratch:\\n", polynomial_features_2d_scratch(data))`,
    sotaCode: `from sklearn.preprocessing import PolynomialFeatures
import numpy as np

data = np.array([[2.0, 3.0], [4.0, 5.0]])
poly = PolynomialFeatures(degree=2, include_bias=True)
print("Scikit-Learn PolynomialFeatures:\\n", poly.fit_transform(data))`,
    diagCode: `def verify_poly_shape(n_samples, n_original_features, degree):
    from math import comb
    expected_cols = comb(n_original_features + degree, degree)
    return {"Expected_Features": expected_cols}`,
    caseStudy: "Pada prediksi konsumsi bahan bakar kendaraan, penambahan fitur interaksi `Horsepower * Weight` secara dramatis meningkatkan $R^2$ model linier dari 0.70 menjadi 0.86.",
    commonPitfalls: [
      "Menggunakan degree >= 3 pada dataset berdimensi sedang tanpa seleksi fitur atau regularisasi ketat.",
      "Melakukan ekspansi polinomial sebelum standardisasi skala fitur, menghasilkan perbedaan magnitudo ekstrem ($x^3$ vs $x$)."
    ],
    groundingLinks: [
      { title: "ISLR Ch. 7 Moving Beyond Linearity", url: "https://www.statlearning.com/", note: "Pondasi matematis regresi polinomial" }
    ]
  }),

  createSubchapter({
    id: "ml-29-6-automatic-feature-selection",
    slug: "seleksi-fitur-otomatis-variance-threshold-mutual-info-rfe",
    title: "29.6 Seleksi Fitur Otomatis: Variance Threshold, Uji Statistik Univariat (Chi2, ANOVA F-value), Mutual Information, & RFE",
    orderIndex: 6,
    description: "Taksonomi metode seleksi fitur: Filter methods (Variance, Chi2, ANOVA, Mutual Information), Wrapper methods (Recursive Feature Elimination - RFE), dan Embedded methods.",
    theoryMarkdown: `Seleksi fitur bertujuan mereduksi dimensi dengan menghilangkan fitur irelevan dan redundan:

1. **Filter Methods**:
   - **Variance Threshold**: Membuang fitur konstan atau kuasi-konstan: $\\text{Var}(x) \\le \\tau$.
   - **ANOVA F-value**: Mengukur rasio varians antar-kelompok terhadap dalam-kelompok (linier).
   - **Mutual Information (MI)**: Mengukur ketergantungan non-linier umum berbasis teori informasi:
     $$I(X; Y) = \\iint p(x, y) \\log \\frac{p(x, y)}{p(x)p(y)} \\, dx \\, dy \\ge 0$$
     $I(X; Y) = 0$ jika dan hanya jika $X$ dan $Y$ independen secara sempurna.

2. **Wrapper Methods (Recursive Feature Elimination - RFE)**:
   Melatih model secara berulang, menghitung bobot koefisien atau feature importance, memangkas $k$ fitur terlemah pada setiap iterasi, hingga tersisa $n$ fitur terbaik.
3. **Embedded Methods**:
   Seleksi fitur intrinsik yang terjadi selama proses pelatihan (L1 Lasso, Random Forest MDI/MDA).`,
    mermaidDiagram: `graph TD
    AllFeatures["Himpunan Seluruh Fitur X"] --> Filter["Filter: Variance Threshold & Mutual Information (Cepat)"]
    Filter --> Filtered["Fitur Tersaring"]
    Filtered --> Wrapper["Wrapper: Recursive Feature Elimination - RFE (Akurat)"]
    Wrapper --> BestSubset["Subset Fitur Optimal Terpilih"]`,
    scratchCode: `import numpy as np

def variance_threshold_scratch(X, threshold=0.0):
    """Menghilangkan fitur dengan varians di bawah ambang batas dari scratch."""
    X = np.asarray(X, dtype=float)
    variances = np.var(X, axis=0)
    selected_mask = variances > threshold
    return X[:, selected_mask], selected_mask, variances

data = np.array([[1.0, 5.0, 10.0],
                 [1.0, 6.0, 10.0],
                 [1.0, 7.0, 10.0]]) # Kolom 0 dan 2 konstan
X_filtered, mask, vars = variance_threshold_scratch(data, threshold=0.0)
print("Fitur Lolos Varians:", mask)
print("Data Tersaring:\\n", X_filtered)`,
    sotaCode: `from sklearn.feature_selection import SelectKBest, mutual_info_classif, RFE
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=200, n_features=10, n_informative=4, random_state=42)

# 1. Mutual Information
selector_mi = SelectKBest(score_func=mutual_info_classif, k=4)
X_mi = selector_mi.fit_transform(X, y)

# 2. RFE Wrapper
rfe = RFE(estimator=LogisticRegression(), n_features_to_select=4)
X_rfe = rfe.fit_transform(X, y)
print("Indeks Fitur Terpilih RFE:", np.where(rfe.support_)[0])`,
    diagCode: `def verify_feature_reduction(original_dim, selected_dim):
    assert selected_dim < original_dim, "Tidak ada fitur yang berhasil dipangkas!"
    return f"Reduksi dimensi: {original_dim} -> {selected_dim} fitur"`,
    caseStudy: "Dalam klasifikasi ekspresi gen micro-array ($N=100, P=20.000$), kombinasi filter Mutual Information dan RFE berhasil memangkas 99% gen noise tanpa menurunkan akurasi deteksi tumor.",
    commonPitfalls: [
      "Menggunakan uji linier (ANOVA/Pearson) untuk menyeleksi fitur yang memiliki hubungan kuadratik kuat dengan target (hubungan non-linier terlewatkan; gunakan Mutual Information).",
      "Menjalankan RFE di luar lipatan K-Fold cross-validation (menyebabkan seleksi fitur bocor)."
    ],
    groundingLinks: [
      { title: "Guyon & Elisseeff (2003) An Introduction to Variable and Feature Selection", url: "https://www.jmlr.org/papers/v3/guyon03a.html", note: "Paper kanonikal metodologi seleksi fitur" }
    ]
  })
];

const ch29 = {
  id: "machine-learning-ch-29",
  title: "Bab 29: Rekayasa Fitur Lanjut: Encoding Kategorial & Imputasi Statistik",
  slug: "rekayasa-fitur-lanjut-encoding-imputasi",
  orderIndex: 29,
  description: "Skalabilitas numerik (Z-score, MinMax, Robust, Yeo-Johnson), encoding kategorial rendah dan dummy trap, target encoding dengan Bayesian smoothing m-estimate out-of-fold, strategi imputasi univariat, KNN, dan MICE, konstruksi fitur sintetis dan interaksi, serta seleksi fitur otomatis Variance, Mutual Information, dan RFE.",
  subchapters: ch29Subchapters
};

fs.writeFileSync(path.join(OUT_DIR, 'chunk6-ch29.ts'), exportChapterTs(ch29, 'chapter29'));
console.log('Successfully generated chunk6-ch29.ts (6 subchapters)');

// ==========================================
// CHAPTER 30: Penanganan Ketimpangan Kelas Ekstrem: SMOTE, ADASYN, & Cost-Matrix
// ==========================================
const ch30Subchapters = [
  createSubchapter({
    id: "ml-30-1-extreme-imbalance-phenomenon",
    slug: "fenomena-imbalance-ekstrem-kegagalan-fungsi-loss",
    title: "30.1 Fenomena Imbalance Ekstrem pada Dunia Riil (Fraud, Medis, Anomali Siber) & Kegagalan Fungsi Loss Standar",
    orderIndex: 1,
    description: "Karakteristik matematis distribusi kelas asimetris ekstrem (1:100 s.d. 1:10.000), degradasi gradien pada Cross-Entropy standar, dan dominasi kerugian kelas mayoritas.",
    theoryMarkdown: `Pada sistem dunia nyata seperti deteksi penipuan transaksi perbankan, diagnosis keganasan langka, dan intrusi siber, rasio prevalensi kelas positif bernilai sangat kecil:
$$\\pi = P(y=1) \\in [10^{-4}, 10^{-2}]$$

**Kegagalan Fungsi Kerugian Standar**:
Fungsi kerugian Binary Cross-Entropy (Log-Loss) menghitung rata-rata tak terbobot:
$$\\mathcal{L}_{\\text{BCE}}(\\mathbf{w}) = -\\frac{1}{N} \\left[ \\sum_{i \\in \\mathcal{D}_1} \\log(p_i) + \\sum_{j \\in \\mathcal{D}_0} \\log(1 - p_j) \\right]$$
Karena $|\\mathcal{D}_0| \\gg |\\mathcal{D}_1|$, komponen gradien akumulatif didominasi secara mutlak oleh kelas mayoritas:
$$\\nabla_{\\mathbf{w}} \\mathcal{L} \\approx \\frac{1}{N} \\sum_{j \\in \\mathcal{D}_0} \\nabla_{\\mathbf{w}} \\log(1 - p_j)$$
Akibatnya, model konvergen ke prediktor trivial yang memprediksi seluruh sampel sebagai kelas mayoritas (negatif), mengabaikan sinyal penting dari kelas minoritas.`,
    mermaidDiagram: `graph TD
    Data["Dataset Rasio Ekstrem 99.9% Negatif : 0.1% Positif"] --> BCE["Fungsi Loss Standar BCE"]
    BCE --> Grad["Gradien Didominasi 99.9% Oleh Kelas Negatif"]
    Grad --> Collapse["Keruntuhan Model: Prediksi Selalu Negatif"]
    Collapse --> NeedSol["Kebutuhan: Resampling Sintetis & Cost-Sensitive Loss"]`,
    scratchCode: `import numpy as np

def simulate_gradient_dominance():
    """Simulasi analitis dominasi gradien kelas mayoritas pada log-loss."""
    n_neg = 999
    n_pos = 1
    
    # Misalkan model memprediksi p = 0.01 untuk semua sampel
    p_pred = 0.01
    
    # Gradien terhadap logit z: (p - y)
    grad_neg = (p_pred - 0) * n_neg  # 0.01 * 999 = 9.99 (mendorong bobot turun)
    grad_pos = (p_pred - 1) * n_pos  # -0.99 * 1 = -0.99 (mendorong bobot naik)
    
    total_grad = grad_neg + grad_pos
    ratio = grad_neg / abs(grad_pos)
    return {"Grad_Neg": grad_neg, "Grad_Pos": grad_pos, "Dominance_Ratio": ratio}

print(simulate_gradient_dominance())`,
    sotaCode: `from sklearn.metrics import log_loss
import numpy as np

y_true = np.array([0]*999 + [1]*1)
y_pred_trivial = np.full_like(y_true, 0.001, dtype=float)
loss_trivial = log_loss(y_true, y_pred_trivial)
print(f"Log-Loss Model Trivial Negatif: {loss_trivial:.5f} (Sangat Rendah Meski Model Gagal!)")`,
    diagCode: `def verify_imbalance_ratio(y):
    counts = np.bincount(y)
    ratio = np.max(counts) / np.min(counts)
    return {"Imbalance_Ratio": f"1:{ratio:.1f}", "Is_Extreme": ratio >= 100}`,
    caseStudy: "Pada sistem monitoring radar antariksa untuk deteksi sampah orbit mikro, algoritma pendeteksi awal gagal mengidentifikasi 100% objek berbahaya karena fungsi loss unweighted menganggap memprediksi 'tidak ada objek' sudah meminimalkan galat global.",
    commonPitfalls: [
      "Menggunakan metrik default MSE atau BCE tanpa pembobotan pada data dengan rasio di atas 1:50.",
      "Mengabaikan kalibrasi probabilitas pasca-penanganan imbalanced data."
    ],
    groundingLinks: [
      { title: "He & Garcia (2009) Learning from Imbalanced Data", url: "https://doi.org/10.1109/TKDE.2008.239", note: "Survei komprehensif masalah pembelajaran data miring" }
    ]
  }),

  createSubchapter({
    id: "ml-30-2-undersampling-enn-tomek",
    slug: "strategi-undersampling-random-enn-tomek-links",
    title: "30.2 Strategi Undersampling Terarah: Random Undersampling, Edited Nearest Neighbors (ENN), & Tomek Links",
    orderIndex: 2,
    description: "Metodologi undersampling cerdas: Random Undersampling, pembersihan perbatasan via Tomek Links, dan filtering derau menggunakan Edited Nearest Neighbors (ENN).",
    theoryMarkdown: `Undersampling mereduksi jumlah observasi kelas mayoritas untuk menyeimbangkan rasio kelas:

1. **Random Undersampling (RUS)**:
   Mengambil subset acak dari kelas mayoritas hingga ukurannya sama dengan kelas minoritas. Cepat, tetapi berisiko membuang informasi berharga (*information loss*).
2. **Tomek Links**:
   Pasangan sampel $(x_i, x_j)$ disebut sebagai Tomek Link jika:
   - $y_i \\neq y_j$ (berbeda kelas).
   - $d(x_i, x_j) < d(x_i, x_k)$ dan $d(x_i, x_j) < d(x_j, x_k)$ untuk setiap sampel $x_k$ lainnya.
   Dengan menghapus observasi kelas mayoritas yang terlibat dalam Tomek Links, batas keputusan (*decision boundary*) menjadi lebih bersih dan tegas.
3. **Edited Nearest Neighbors (ENN)**:
   Menghapus sampel kelas mayoritas yang labelnya berbeda dengan mayoritas dari $k$-tetangga terdekatnya ($k=3$), secara efektif membersihkan derau perbatasan yang merusak generalisasi.`,
    mermaidDiagram: `graph TD
    Raw["Distribusi Campuran Tumpang Tindih di Perbatasan"] --> Method{"Pilih Metode Undersampling"}
    Method -->|Acak Cepat| RUS["Random Undersampling (Hapus Sampel Acak)"]
    Method -->|Bersihkan Margin| Tomek["Tomek Links (Hapus Sampel Mayoritas Paling Dekat Minoritas)"]
    Method -->|Eliminasi Derau| ENN["Edited Nearest Neighbors (Hapus Sampel Ambigu)"]`,
    scratchCode: `import numpy as np
from scipy.spatial.distance import cdist

def find_tomek_links_scratch(X, y):
    """Mendeteksi pasangan Tomek Links dari scratch."""
    X = np.asarray(X)
    y = np.asarray(y)
    n = len(X)
    
    dist_matrix = cdist(X, X)
    np.fill_diagonal(dist_matrix, np.inf)
    
    tomek_links_majority = []
    
    for i in range(n):
        nn_idx = np.argmin(dist_matrix[i])
        # Cek apakah saling menjadi tetangga terdekat terdekat dan beda kelas
        if y[i] != y[nn_idx] and np.argmin(dist_matrix[nn_idx]) == i:
            # Identifikasi sampel mayoritas (y=0) untuk dihapus
            if y[i] == 0:
                tomek_links_majority.append(i)
                
    return np.unique(tomek_links_majority)

X = np.array([[1.0, 1.0], [1.1, 1.0], [1.05, 1.0], [5.0, 5.0]])
y = np.array([0, 1, 0, 0]) # Titik index 2 sangat dekat dengan minoritas index 1
tomek_idx = find_tomek_links_scratch(X, y)
print("Indeks Sampel Mayoritas Dihapus (Tomek):", tomek_idx)`,
    sotaCode: `from imblearn.under_sampling import RandomUnderSampler, TomekLinks, EditedNearestNeighbors
import numpy as np

X = np.array([[1.0, 1.0], [1.1, 1.0], [1.05, 1.0], [5.0, 5.0]])
y = np.array([0, 1, 0, 0])

tl = TomekLinks()
X_res, y_res = tl.fit_resample(X, y)
print("Bentuk Data Pasca-Tomek Links:", X_res.shape)`,
    diagCode: `def verify_undersample_balance(y_resampled):
    counts = np.bincount(y_resampled)
    return {"Class_Counts": counts, "Balance_Ratio": counts[0] / counts[1] if len(counts) > 1 else 0}`,
    caseStudy: "Pada pengenalan tulisan tangan optik (OCR), kombinasi SMOTE + Tomek Links berhasil mengeliminasi goresan ambigu di perbatasan huruf tanpa mengorbankan variasi bentuk huruf.",
    commonPitfalls: [
      "Menggunakan Random Undersampling ekstrem (1:1) saat data minoritas hanya berjumlah puluhan baris (membuang 99% data pelatihan).",
      "Menerapkan undersampling pada validation/test set."
    ],
    groundingLinks: [
      { title: "Tomek (1976) Two Modifications of CNN", url: "https://ieeexplore.ieee.org/document/4309452", note: "Paper asli penemu Tomek Links" }
    ]
  }),

  createSubchapter({
    id: "ml-30-3-smote-borderline-smote",
    slug: "strategi-oversampling-sintetis-smote-dan-borderline-smote",
    title: "30.3 Strategi Oversampling Sintetis: Algoritma SMOTE (Interpolasi Vektor K-NN) & Borderline-SMOTE",
    orderIndex: 3,
    description: "Sintesis data minoritas baru: Geometri interpolasi konveks SMOTE pada segmen garis k-NN, dan Borderline-SMOTE pada wilayah perbatasan bahaya (DANGER).",
    theoryMarkdown: `Alih-alih menduplikasi sampel minoritas secara eksak (yang memicu *overfitting*), **SMOTE (Synthetic Minority Over-sampling Technique)** mensintesis sampel buatan baru melalui interpolasi linier pada ruang fitur:

**Algoritma SMOTE**:
1. Untuk setiap sampel minoritas $\\mathbf{x}_i \\in \\mathcal{D}_{\\text{min}}$, temukan $k$-tetangga terdekatnya di antara sampel kelas minoritas lainnya menggunakan jarak Euclidean.
2. Pilih satu tetangga $\\mathbf{x}_{zi}$ secara acak.
3. Bangkitkan sampel baru $\\mathbf{x}_{\\text{new}}$ pada segmen garis yang menghubungkan $\\mathbf{x}_i$ dan $\\mathbf{x}_{zi}$:
   $$\\mathbf{x}_{\\text{new}} = \\mathbf{x}_i + \\lambda (\\mathbf{x}_{zi} - \\mathbf{x}_i), \\quad \\lambda \\sim \\mathcal{U}(0, 1)$$

**Borderline-SMOTE**:
Memperbaiki kelemahan SMOTE standar yang mensintesis data di wilayah interior aman. Borderline-SMOTE mengidentifikasi sampel minoritas yang berada dalam zona **DANGER** (di mana separuh tetangganya adalah kelas mayoritas) dan hanya mensintesis sampel di sekitar perbatasan tersebut untuk memperkuat diskriminasi model.`,
    mermaidDiagram: `graph LR
    Minoritas["Titik Minoritas x_i"] --> KNN["Cari k-Tetangga Minoritas Terdekat"]
    KNN --> Pick["Pilih Acak Tetangga x_zi"]
    Pick --> Interp["Interpolasi Acak: x_new = x_i + lambda * (x_zi - x_i)"]
    Interp --> Synthetic["Sampel Minoritas Sintetis Baru"]`,
    scratchCode: `import numpy as np
from sklearn.neighbors import NearestNeighbors

def smote_scratch(X_minority, n_samples_to_generate, k_neighbors=5, random_seed=42):
    """Implementasi algoritma SMOTE dari scratch."""
    np.random.seed(random_seed)
    n_minority, n_features = X_minority.shape
    
    # Fit k-NN pada himpunan kelas minoritas
    knn = NearestNeighbors(n_neighbors=k_neighbors + 1).fit(X_minority)
    _, indices = knn.kneighbors(X_minority)
    
    synthetic_samples = np.zeros((n_samples_to_generate, n_features))
    
    for i in range(n_samples_to_generate):
        # Pilih satu sampel minoritas secara acak
        idx = np.random.randint(0, n_minority)
        # Pilih satu tetangga acak (abaikan indeks 0 karena itu titik itu sendiri)
        nn_idx = indices[idx, np.random.randint(1, k_neighbors + 1)]
        
        diff = X_minority[nn_idx] - X_minority[idx]
        gap = np.random.uniform(0, 1)
        synthetic_samples[i] = X_minority[idx] + gap * diff
        
    return synthetic_samples

X_min = np.array([[1.0, 1.0], [1.2, 1.1], [0.9, 1.2], [1.1, 0.9]])
synth = smote_scratch(X_min, n_samples_to_generate=3, k_neighbors=2)
print("Sampel Sintetis SMOTE Baru:\\n", np.round(synth, 2))`,
    sotaCode: `from imblearn.over_sampling import SMOTE, BorderlineSMOTE
import numpy as np

X = np.array([[1.0, 1.0], [1.2, 1.1], [0.9, 1.2], [1.1, 0.9], [5.0, 5.0], [5.2, 5.1], [5.3, 4.9]])
y = np.array([1, 1, 1, 1, 0, 0, 0])

smote = SMOTE(k_neighbors=2, random_state=42)
X_res, y_res = smote.fit_resample(X, y)
print("Distribusi Kelas Pasca-SMOTE:", np.bincount(y_res))`,
    diagCode: `def verify_synthetic_convex_hull(X_min, synthetic_samples):
    # Verifikasi bahwa sampel sintetis berada di dalam bounding box minoritas
    min_bounds = np.min(X_min, axis=0)
    max_bounds = np.max(X_min, axis=0)
    inside = np.all((synthetic_samples >= min_bounds) & (synthetic_samples <= max_bounds))
    return {"Inside_Bounding_Box": inside}`,
    caseStudy: "Chawla et al. (2002) mendemonstrasikan bahwa SMOTE yang digabungkan dengan C4.5 Decision Trees meningkatkan luas area ROC (AUC) secara signifikan dibanding duplikasi acak pada ribuan dataset biomedis.",
    commonPitfalls: [
      "Menerapkan SMOTE sebelum melakukan partisi cross-validation (kebocoran sintetis fatal!).",
      "Menerapkan SMOTE pada variabel kategorial berdimensi tinggi tanpa transformasi khusus (gunakan SMOTENC).",
    ],
    groundingLinks: [
      { title: "Chawla et al. (2002) SMOTE: Synthetic Minority Over-sampling Technique", url: "https://doi.org/10.1613/jair.953", note: "Paper asli pengenalan algoritma SMOTE" }
    ]
  }),

  createSubchapter({
    id: "ml-30-4-adasyn-adaptive-sampling",
    slug: "adaptive-synthetic-sampling-adasyn-pembobotan-densitas",
    title: "30.4 Adaptive Synthetic Sampling (ADASYN): Pembobotan Densitas Minoritas Berdasarkan Distribusi Kesulitan Sampel",
    orderIndex: 4,
    description: "Sintesis adaptif terbobot kesulitan: Algoritma ADASYN, perhitungan rasio tetangga mayoritas r_i, dan alokasi sampel sintetis proporsional.",
    theoryMarkdown: `Kelemahan SMOTE standar adalah memberikan bobot sintesis yang sama rata untuk setiap sampel minoritas, terlepas dari seberapa sulit sampel tersebut dipelajari oleh model.

**Algoritma ADASYN (Adaptive Synthetic)**:
1. Hitung rasio kesulitan $r_i$ untuk setiap sampel minoritas $\\mathbf{x}_i$:
   $$r_i = \\frac{\\Delta_i}{K} \\in [0, 1]$$
   di mana $\\Delta_i$ adalah jumlah sampel kelas mayoritas di antara $K$-tetangga terdekat $\\mathbf{x}_i$.
2. Normalisasikan rasio menjadi distribusi probabilitas $\\hat{r}_i$:
   $$\\hat{r}_i = \\frac{r_i}{\\sum_{i=1}^{n_{\\text{min}}} r_i}$$
3. Jumlah sampel sintetis yang dibangkitkan untuk masing-masing $\\mathbf{x}_i$ sebanding dengan tingkat kesulitannya:
   $$g_i = \\text{round}(\\hat{r}_i \\times G)$$
   di mana $G$ adalah total sampel sintetis yang dibutuhkan untuk menyeimbangkan kelas.

Dengan demikian, ADASYN memfokuskan kapasitas belajar model pada sampel minoritas yang paling rentan mengalami salah klasifikasi.`,
    mermaidDiagram: `graph TD
    Minoritas["Sampel Minoritas x_i"] --> CekKNN["Cari K-Tetangga Terdekat"]
    CekKNN --> HitungMayoritas["Hitung Berapa Tetangga yang Berasal dari Kelas Mayoritas (r_i)"]
    HitungMayoritas --> Proporsi["Sampel dengan Mayoritas Banyak (Sulit) Mendapat Bobot Sintesis Lebih Tinggi"]
    Proporsi --> Gen["Bangkitkan Sampel Sintetis Berbasis Distribusi r_i"]`,
    scratchCode: `import numpy as np
from sklearn.neighbors import NearestNeighbors

def adasyn_scratch(X, y, k_neighbors=5, random_seed=42):
    """Implementasi ADASYN dari scratch."""
    np.random.seed(random_seed)
    X_min = X[y == 1]
    X_maj = X[y == 0]
    n_min = len(X_min)
    n_maj = len(X_maj)
    G = n_maj - n_min
    
    if G <= 0:
        return X, y
        
    # Cari k-NN pada seluruh dataset X
    knn_all = NearestNeighbors(n_neighbors=k_neighbors + 1).fit(X)
    _, indices_all = knn_all.kneighbors(X_min)
    
    # Hitung r_i
    r = np.zeros(n_min)
    for i in range(n_min):
        neighbors_y = y[indices_all[i, 1:]]
        r[i] = np.sum(neighbors_y == 0) / k_neighbors
        
    r_norm = r / np.sum(r) if np.sum(r) > 0 else np.full(n_min, 1.0 / n_min)
    
    # Cari k-NN hanya di dalam kelas minoritas untuk interpolasi
    knn_min = NearestNeighbors(n_neighbors=k_neighbors + 1).fit(X_min)
    _, indices_min = knn_min.kneighbors(X_min)
    
    synthetic_list = []
    for i in range(n_min):
        g_i = int(np.round(r_norm[i] * G))
        for _ in range(g_i):
            nn_idx = indices_min[i, np.random.randint(1, k_neighbors + 1)]
            diff = X_min[nn_idx] - X_min[i]
            synthetic_list.append(X_min[i] + np.random.uniform(0, 1) * diff)
            
    if len(synthetic_list) > 0:
        X_synth = np.array(synthetic_list)
        return np.vstack([X, X_synth]), np.concatenate([y, np.ones(len(X_synth), dtype=int)])
    return X, y

X = np.array([[1.0, 1.0], [1.1, 1.0], [5.0, 5.0], [5.1, 5.0], [5.2, 5.0], [5.3, 5.0]])
y = np.array([1, 1, 0, 0, 0, 0])
X_res, y_res = adasyn_scratch(X, y, k_neighbors=2)
print("Total Sampel Pasca-ADASYN:", len(y_res))`,
    sotaCode: `from imblearn.over_sampling import ADASYN
import numpy as np

X = np.array([[1.0, 1.0], [1.1, 1.0], [5.0, 5.0], [5.1, 5.0], [5.2, 5.0], [5.3, 5.0]])
y = np.array([1, 1, 0, 0, 0, 0])

adasyn = ADASYN(n_neighbors=1, random_state=42)
X_res, y_res = adasyn.fit_resample(X, y)
print("Distribusi Hasil ADASYN Resmi:", np.bincount(y_res))`,
    diagCode: `def verify_adasyn_adaptiveness(r_norm):
    max_r = np.max(r_norm)
    min_r = np.min(r_norm)
    return {"Max_Weight": max_r, "Min_Weight": min_r, "Has_Variance": max_r > min_r}`,
    caseStudy: "He et al. (2008) membuktikan bahwa ADASYN melampaui SMOTE standar pada data citra satelit di mana objek minoritas (misal: bangunan) kerap tertutup bayangan awan (wilayah berdensitas mayoritas tinggi).",
    commonPitfalls: [
      "Sensitif terhadap outlier kelas minoritas; jika terdapat satu outlier minoritas di tengah laut kelas mayoritas, ADASYN akan membangkitkan banyak sampel sintetis palsu di sekitar outlier tersebut.",
      "Kebutuhan pembersihan derau (misal via ENN) sebelum menerapkan ADASYN."
    ],
    groundingLinks: [
      { title: "He et al. (2008) ADASYN: Adaptive Synthetic Sampling Approach for Imbalanced Learning", url: "https://doi.org/10.1109/IJCNN.2008.4633969", note: "Paper pengenalan algoritma ADASYN" }
    ]
  }),

  createSubchapter({
    id: "ml-30-5-cost-sensitive-learning-class-weights",
    slug: "cost-sensitive-learning-matriks-biaya-dan-class-weighting",
    title: "30.5 Cost-Sensitive Learning: Matriks Biaya Finansial Riil, Penyesuaian Bobot Sampel (Class Weighting), & Modifikasi Gradien",
    orderIndex: 5,
    description: "Pendekatan algoritmik tanpa manipulasi data: Matriks biaya asimetris, pembobotan kerugian sampel (Class Weighting), dan formulasi balanced class weight.",
    theoryMarkdown: `Alih-alih memanipulasi distribusi data melalui resampling, **Cost-Sensitive Learning** secara langsung mengintegrasikan matriks biaya finansial riil $C(i, j)$ ke dalam optimasi fungsi loss:
- $C(0, 1)$: Biaya False Positive (misal: memblokir kartu pengguna sah = $5).
- $C(1, 0)$: Biaya False Negative (misal: meloloskan transaksi penipuan = $500).

**Penyesuaian Bobot Kelas (*Class Weighting*)**:
Fungsi kerugian Binary Cross-Entropy termodifikasi menjadi:
$$\\mathcal{L}_{\\text{CS}}(\\mathbf{w}) = - \\frac{1}{N} \\sum_{i=1}^N w_{y_i} \\left[ y_i \\log(p_i) + (1 - y_i) \\log(1 - p_i) \\right]$$

**Formulasi Bobot Seimbang Heuristik (*Balanced Heuristic*)**:
$$w_c = \\frac{N}{|\\mathcal{C}| \\times n_c}$$
di mana $N$ adalah total sampel, $|\\mathcal{C}|=2$ adalah jumlah kelas, dan $n_c$ adalah frekuensi kelas $c$. Dengan pembobotan ini, total kontribusi gradien dari kelas minoritas seimbang secara matematis dengan kelas mayoritas tanpa mengubah ukuran memori dataset.`,
    mermaidDiagram: `graph LR
    Loss["Fungsi Kerugian Standar Loss(y, p)"] --> Weight{"Terapkan Bobot Kelas w_c"}
    Weight --> Formula["w_c = N / (2 * n_c)"]
    Formula --> CostSensitiveLoss["Loss Berbobot: w_1 * Loss_Pos + w_0 * Loss_Neg"]
    CostSensitiveLoss --> EqualGradients["Gradien Positif & Negatif Seimbang Sempurna"]`,
    scratchCode: `import numpy as np

def compute_balanced_class_weights(y):
    """Menghitung bobot kelas seimbang secara analitis dari scratch."""
    y = np.asarray(y)
    n_samples = len(y)
    classes, counts = np.unique(y, return_counts=True)
    n_classes = len(classes)
    
    weights = {}
    for c, cnt in zip(classes, counts):
        weights[c] = n_samples / (n_classes * cnt)
        
    return weights

def weighted_binary_cross_entropy_scratch(y_true, y_prob, weights):
    """Kalkulasi BCE terbobot dari scratch."""
    eps = 1e-15
    y_prob = np.clip(y_prob, eps, 1.0 - eps)
    
    w_vec = np.array([weights[yi] for yi in y_true])
    losses = w_vec * (y_true * np.log(y_prob) + (1 - y_true) * np.log(1 - y_prob))
    return -np.mean(losses)

y_true = np.array([0]*90 + [1]*10) # 90% neg, 10% pos
weights = compute_balanced_class_weights(y_true)
print("Bobot Kelas Seimbang:", weights)
print("Weighted Loss:", weighted_binary_cross_entropy_scratch(y_true, np.full(100, 0.5), weights))`,
    sotaCode: `from sklearn.linear_model import LogisticRegression
from sklearn.utils.class_weight import compute_class_weight
import numpy as np

y_true = np.array([0]*90 + [1]*10)
classes = np.unique(y_true)

w_sklearn = compute_class_weight(class_weight='balanced', classes=classes, y=y_true)
print("Scikit-Learn Balanced Weights:", dict(zip(classes, w_sklearn)))

clf = LogisticRegression(class_weight='balanced', random_state=42)
# clf.fit(X, y_true) siap dilatih dengan penyeimbangan gradien otomatis`,
    diagCode: `def verify_weight_gradient_balance(weights, class_counts):
    total_w0 = weights[0] * class_counts[0]
    total_w1 = weights[1] * class_counts[1]
    assert np.isclose(total_w0, total_w1), "Gradien belum seimbang sempurna!"
    return "Lolos: Kontribusi Gradien Kelas Setara"`,
    caseStudy: "Elkan (2001) membuktikan bahwa pada penargetan direct marketing perbankan, kalibrasi threshold berbasis biaya riil meningkatkan profitabilitas bersih hingga 40% dibanding metode klasifikasi berbasis akurasi.",
    commonPitfalls: [
      "Mengasumsikan class_weight='balanced' secara otomatis mengkalibrasi probabilitas prediksi ke frekuensi populasi nyata (probabilitas output menjadi terdistorsi ke atas, memerlukan kalibrasi ulang).",
      "Mengabaikan biaya operasional penanganan False Alarm."
    ],
    groundingLinks: [
      { title: "Elkan (2001) The Foundations of Cost-Sensitive Learning", url: "https://www.ijcai.org/Proceedings/01-2/Papers/017.pdf", note: "Paper klasik fondasi cost-sensitive learning" }
    ]
  }),

  createSubchapter({
    id: "ml-30-6-focal-loss-dense-detection",
    slug: "focal-loss-modifikasi-faktor-modulasi-gamma",
    title: "30.6 Focal Loss: Modifikasi Faktor Modulasi (1 - p_t)^gamma untuk Menekan Gradien Sampel Negatif Mudah",
    orderIndex: 6,
    description: "Formulasi analitis Focal Loss Lin et al. (2017): Faktor modulasi dinamis, penekanan gradien sampel mudah (easy negatives), dan hiperparameter fokus gamma.",
    theoryMarkdown: `Pada deteksi objek padat (seperti RetinaNet) dan klasifikasi tabular rasio 1:1000, sebagian besar sampel negatif dapat diklasifikasikan dengan sangat mudah ($p_t \\gg 0.5$). Meskipun galat individualnya kecil, akumulasi jutaan sampel negatif mudah mendominasi total gradien dan menenggelamkan sampel minoritas yang sulit.

**Formulasi Focal Loss (Lin et al., 2017)**:
Mendefinisikan probabilitas kelas sejati $p_t$:
$$p_t = \\begin{cases} p & \\text{jika } y = 1 \\\\ 1 - p & \\text{jika } y = 0 \\end{cases}$$
Focal Loss menambahkan **faktor modulasi dinamis** $(1 - p_t)^\\gamma$:
$$\\text{FL}(p_t) = -\\alpha_t (1 - p_t)^\\gamma \\log(p_t)$$
di mana:
- $\\gamma \\ge 0$ adalah parameter fokus (*focusing parameter*).
- Ketika sampel mudah diprediksi ($p_t \\to 1$), faktor $(1 - p_t)^\\gamma \\to 0$, **menekan kontribusi gradien sampel tersebut hingga mendekati nol**.
- Ketika sampel sulit diprediksi ($p_t \\le 0.5$), faktor $(1 - p_t)^\\gamma \\approx 1$, mempertahankan penalti penuh.
- Bila $\\gamma = 0$, Focal Loss tereduksi kembali menjadi Cross-Entropy standar. Nilai standar industri adalah $\\gamma = 2.0, \\alpha_t = 0.25$.`,
    mermaidDiagram: `graph LR
    InputP["Probabilitas Prediksi p_t"] --> Factor["Faktor Modulasi: (1 - p_t)^gamma"]
    Factor --> Easy["Sampel Mudah (p_t = 0.99): Faktor = (0.01)^2 = 0.0001 (Gradien Ditekan 10000x!)"]
    Factor --> Hard["Sampel Sulit (p_t = 0.20): Faktor = (0.80)^2 = 0.64 (Gradien Tetap Aktif)"]
    Easy --> FocalLoss["Total Focal Loss: Terfokus Eksklusif Pada Sampel Sulit"]
    Hard --> FocalLoss`,
    scratchCode: `import numpy as np

def focal_loss_scratch(y_true, y_prob, alpha=0.25, gamma=2.0):
    """Implementasi analitis Focal Loss dari scratch."""
    eps = 1e-15
    y_prob = np.clip(y_prob, eps, 1.0 - eps)
    y_true = np.asarray(y_true, dtype=float)
    
    # p_t
    p_t = y_true * y_prob + (1.0 - y_true) * (1.0 - y_prob)
    alpha_t = y_true * alpha + (1.0 - y_true) * (1.0 - alpha)
    
    modulating_factor = (1.0 - p_t) ** gamma
    focal_loss_vec = -alpha_t * modulating_factor * np.log(p_t)
    return np.mean(focal_loss_vec)

y_true = np.array([0, 0, 0, 1])
y_prob_easy_neg = np.array([0.01, 0.01, 0.01, 0.2]) # 3 sampel mudah, 1 positif sulit

bce = -np.mean(y_true * np.log(y_prob_easy_neg) + (1 - y_true) * np.log(1 - y_prob_easy_neg))
fl = focal_loss_scratch(y_true, y_prob_easy_neg, gamma=2.0)
print(f"Standard BCE Loss: {bce:.4f}")
print(f"Focal Loss (gamma=2.0): {fl:.4f} (Kerugian Terfokus Pada Sampel Sulit)")`,
    sotaCode: `import lightgbm as lgb
import numpy as np

# Implementasi custom objective Focal Loss untuk LightGBM
def focal_loss_lgb(preds, train_data, gamma=2.0, alpha=0.25):
    labels = train_data.get_label()
    p = 1.0 / (1.0 + np.exp(-preds))
    p = np.clip(p, 1e-15, 1 - 1e-15)
    
    # Gradien orde 1 dan 2 analitis terhadap logit
    p_t = labels * p + (1 - labels) * (1 - p)
    alpha_t = labels * alpha + (1 - labels) * (1 - alpha)
    
    grad = alpha_t * (1 - p_t)**gamma * (p - labels)
    hess = alpha_t * (1 - p_t)**gamma * p * (1 - p)
    return grad, hess

print("Custom Focal Loss Objective untuk LightGBM / XGBoost siap digunakan.")`,
    diagCode: `def verify_focal_suppression(gamma=2.0):
    p_easy = 0.99
    suppression = (1.0 - p_easy) ** gamma
    return {"Easy_Sample_Suppression_Factor": suppression, "Percent_Reduction": (1.0 - suppression) * 100}`,
    caseStudy: "Lin et al. (2017) memecahkan kebuntuan detektor 1-tahap (RetinaNet) menggunakan Focal Loss, melampaui akurasi detektor 2-tahap (Faster R-CNN) yang sebelumnya mendominasi industri.",
    commonPitfalls: [
      "Menggunakan nilai gamma terlalu tinggi (> 5.0), menyebabkan konvergensi model terhenti total karena gradien menjadi terlalu kecil.",
      "Lupa menyesuaikan nilai inisialisasi bias output awal saat melatih jaringan saraf dengan Focal Loss."
    ],
    groundingLinks: [
      { title: "Lin et al. (2017) Focal Loss for Dense Object Detection", url: "https://arxiv.org/abs/1708.02002", note: "Paper asli penemu Focal Loss" }
    ]
  })
];

const ch30 = {
  id: "machine-learning-ch-30",
  title: "Bab 30: Penanganan Ketimpangan Kelas Ekstrem: SMOTE, ADASYN, & Cost-Matrix",
  slug: "penanganan-ketimpangan-kelas-ekstrem",
  orderIndex: 30,
  description: "Fenomena ketimpangan kelas ekstrem dan dominasi gradien, strategi undersampling terarah (Tomek Links, ENN), oversampling sintetis SMOTE dan Borderline-SMOTE, pembobotan densitas kesulitan adaptif ADASYN, Cost-Sensitive Learning dan matriks biaya riil, serta modifikasi faktor modulasi Focal Loss Lin et al.",
  subchapters: ch30Subchapters
};

fs.writeFileSync(path.join(OUT_DIR, 'chunk6-ch30.ts'), exportChapterTs(ch30, 'chapter30'));
console.log('Successfully generated chunk6-ch30.ts (6 subchapters)');

// ==========================================
// CHUNK 6 AGGREGATOR
// ==========================================
const chunk6AggregatorContent = `import { AcademicChapter } from "../../types";
import { chapter25 } from "./chunk6-ch25";
import { chapter26 } from "./chunk6-ch26";
import { chapter27 } from "./chunk6-ch27";
import { chapter28 } from "./chunk6-ch28";
import { chapter29 } from "./chunk6-ch29";
import { chapter30 } from "./chunk6-ch30";

export const chunk6EvaluationEngineering: AcademicChapter[] = [
  chapter25,
  chapter26,
  chapter27,
  chapter28,
  chapter29,
  chapter30
];
`;

fs.writeFileSync(path.join(OUT_DIR, 'chunk6-evaluation-engineering.ts'), chunk6AggregatorContent);
console.log('Successfully generated chunk6-evaluation-engineering.ts (Chapters 25 - 30, 34 subchapters)');
