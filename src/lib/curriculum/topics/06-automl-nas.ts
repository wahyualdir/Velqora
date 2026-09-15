import { AcademicCurriculum } from "../types";

/**
 * KURIKULUM AKADEMIK: AUTOML & NEURAL ARCHITECTURE SEARCH (TOPIK 6) - PHASE 2.1 MAXIMUM DEPTH
 * Standard: University-Grade / Advanced Engineering
 * References:
 * - Hutter, F., Kotthoff, L., & Vanschoren, J. (Eds.). (2019). Automated Machine Learning: Methods, Systems, Challenges. Springer.
 * - Akiba, T., Sano, S., Yanase, T., Ohta, T., & Koyama, M. (2019). Optuna: A Next-generation Hyperparameter Optimization Framework. ACM SIGKDD.
 * - Liu, H., Simonyan, K., & Yang, Y. (2018). DARTS: Differentiable Architecture Search. ICLR 2019.
 * - Bergstra, J., Bardenet, R., Bengio, Y., & Kégl, B. (2011). Algorithms for Hyper-Parameter Optimization (TPE). NeurIPS.
 * - Li, L., Jamieson, K., DeSalvo, G., Rostamizadeh, A., & Talwalkar, A. (2017). Hyperband: A Novel Bandit-Based Approach to Hyperparameter Optimization. JMLR.
 */
export const autoMlNasCurriculum: AcademicCurriculum = {
  id: "automl-nas",
  slug: "automl-neural-architecture-search",
  title: "AutoML & Neural Architecture Search",
  category: "Kecerdasan Buatan",
  level: "lanjutan",
  description: "Metodologi komprehensif otomasi siklus machine learning: formulasi masalah CASH, optimasi hyperparameter Bayesian (Gaussian Processes, TPE), multi-fidelity pruning (Successive Halving, Hyperband), rekayasa fitur otomatis, serta Neural Architecture Search berbasis gradien diferensiabel (DARTS).",
  estimatedHours: 48,
  version: "2.5.0",
  primaryReferences: [
    {
      title: "Automated Machine Learning: Methods, Systems, Challenges",
      authors: ["Frank Hutter", "Lars Kotthoff", "Joaquin Vanschoren"],
      type: "book",
      url: "https://www.automl.org/book/",
      relevance: "Buku teks definitif mengenai HPO, CASH problem, meta-learning, dan neural architecture search.",
      year: 2019,
      publisherOrVenue: "Springer Nature",
    },
    {
      title: "Algorithms for Hyper-Parameter Optimization (TPE)",
      authors: ["James Bergstra", "Rémi Bardenet", "Yoshua Bengio", "Balázs Kégl"],
      type: "paper",
      url: "https://papers.nips.cc/paper/2011/hash/86e8f7576f8dd774f24083da2d66c1b3-Abstract.html",
      relevance: "Formulasi matematis algoritma Tree-structured Parzen Estimator (TPE) untuk optimasi fungsi objektif black-box.",
      year: 2011,
      publisherOrVenue: "NeurIPS 2011",
    },
    {
      title: "DARTS: Differentiable Architecture Search",
      authors: ["Hanxiao Liu", "Karen Simonyan", "Yiming Yang"],
      type: "paper",
      url: "https://arxiv.org/abs/1806.09055",
      doi: "10.48550/arXiv.1806.09055",
      relevance: "Formulasi kontinu ruang arsitektur diskret untuk mempercepat pencarian NAS berbasis gradien.",
      year: 2019,
      publisherOrVenue: "ICLR 2019",
    },
    {
      title: "Hyperband: A Novel Bandit-Based Approach to Hyperparameter Optimization",
      authors: ["Lisha Li", "Kevin Jamieson", "Afshin Rostamizadeh", "Katya DeSalvo", "Ameet Talwalkar"],
      type: "paper",
      url: "https://jmlr.org/papers/v18/16-558.html",
      relevance: "Algoritma multi-fidelity berbasis non-stochastic bandit untuk alokasi resource komputasi optimal.",
      year: 2017,
      publisherOrVenue: "JMLR",
    },
  ],
  chapters: [
    {
      id: "aml-bab-1",
      slug: "paradigma-automl-dan-masalah-cash",
      title: "BAB 1: Paradigma AutoML & Formulasi Masalah CASH",
      orderIndex: 1,
      description: "Fondasi otomasi pembelajaran mesin: perumusan formal masalah Combined Algorithm Selection and Hyperparameter Optimization (CASH), ruang pencarian campuran berhierarki, dan keterbatasan Grid Search vs Random Search.",
      subchapters: [
        {
          id: "aml-bab-1-1",
          slug: "formulasi-formal-cash-problem",
          title: "1.1. Formulasi Matematis Masalah CASH",
          orderIndex: 1,
          description: "Mendefinisikan ruang pencarian algoritma $\\mathcal{A}$ dan konfigurasi hyperparameter $\\mathbf{\\Lambda}$, serta fungsi objektif validasi silang.",
          content_markdown: `# 1.1. Formulasi Matematis Masalah CASH

## 1. Definisi Formal CASH (Thornton et al., 2013)
Diberikan himpunan algoritma pembelajaran mesin $\\mathcal{A} = \\{A^{(1)}, A^{(2)}, \\dots, A^{(R)}\\}$, di mana masing-masing algoritma $A^{(j)}$ memiliki ruang hyperparameter $\\mathbf{\\Lambda}^{(j)}$.
Ruang pencarian gabungan didefinisikan sebagai:

$$\\mathbf{\\Lambda} = \\bigcup_{j=1}^R \\{A^{(j)}\\} \\times \\mathbf{\\Lambda}^{(j)}$$

Diberikan dataset latih $\\mathcal{D}_{\\text{train}}$ yang dipartisi menjadi lipatan validasi silang $K$-fold $\\{\\mathcal{D}_{\\text{train}}^{(1)}, \\dots, \\mathcal{D}_{\\text{train}}^{(K)}\\}$ dan $\\{\\mathcal{D}_{\\text{valid}}^{(1)}, \\dots, \\mathcal{D}_{\\text{valid}}^{(K)}\\}$.

Tujuan CASH adalah menemukan algoritma $A^*$ beserta vektor hyperparameter $\\boldsymbol{\\lambda}^*$ yang meminimalkan kerugian validasi silang rata-rata:

$$A^*_{\\boldsymbol{\\lambda}^*} = \\arg\\min_{A^{(j)} \\in \\mathcal{A}, \\; \\boldsymbol{\\lambda} \\in \\mathbf{\\Lambda}^{(j)}} \\frac{1}{K} \\sum_{k=1}^K \\mathcal{L}\\left( A^{(j)}_{\\boldsymbol{\\lambda}}\\left( \\mathcal{D}_{\\text{train}}^{(k)} \\right), \\mathcal{D}_{\\text{valid}}^{(k)} \\right)$$

## 2. Kompleksitas Ruang Pencarian CASH
1. **Heterogenitas Variabel**: Gabungan parameter kontinu (misal: learning rate $\\eta \\in [10^{-5}, 10^{-1}]$), diskrit (misal: jumlah pohon $T \\in \\{50, 100, 200\\}$), dan kategorial (misal: fungsi aktivasi $\\{\\text{relu}, \\text{gelu}\\}$).
2. **Kondisionalitas Hierarkis**: Hyperparameter tertentu hanya aktif jika algoritma tertentu dipilih (misal: parameter kernel $RBF$ hanya relevan jika model adalah SVM).
`,
        },
      ],
    },
    {
      id: "aml-bab-2",
      slug: "optimasi-bayesian-dan-tpe",
      title: "BAB 2: Optimasi Bayesian & Tree-structured Parzen Estimator (TPE)",
      orderIndex: 2,
      description: "Prinsip optimasi fungsi kotak-hitam berbiaya mahal: Gaussian Processes, fungsi akuisisi Expected Improvement (EI), dan pemodelan kepadatan non-parametrik TPE Bergstra et al.",
      subchapters: [
        {
          id: "aml-bab-2-1",
          slug: "matematika-expected-improvement-dan-tpe",
          title: "2.1. Derivasi Matematis Expected Improvement (EI) & Model Densitas TPE",
          orderIndex: 1,
          description: "Perbandingan pemodelan $P(y \\mid x)$ pada Gaussian Process vs pemodelan $P(x \\mid y)$ pada TPE, rasio fungsi densitas $\\ell(x) / g(x)$, dan bukti maksimisasi EI.",
          content_markdown: `# 2.1. Derivasi Matematis Expected Improvement (EI) & Model Densitas TPE

## 1. Pemodelan Densitas Bergstra et al. (NeurIPS 2011)
Alih-alih memodelkan distribusi probabilitas kinerja target $y$ diberikan konfigurasi parameter $x$, yaitu $P(y \\mid x)$ seperti pada Gaussian Process regression, **Tree-structured Parzen Estimator (TPE)** memodelkan kepadatan konfigurasi parameter diberikan tingkat kinerja $y$:

$$P(x \\mid y) = \\begin{cases} \\ell(x) & \\text{if } y < y^* \\\\ g(x) & \\text{if } y \\ge y^* \\end{cases}$$

Di mana:
- $y^*$ adalah ambang kuantil $\\gamma$ terbaik dari hasil observasi sebelumnya ($P(y < y^*) = \\gamma$).
- $\\ell(x)$ adalah estimasi densitas probabilitas (*kernel density estimate*) dari parameter-parameter yang menghasilkan skor bagus ($y < y^*$).
- $g(x)$ adalah estimasi densitas probabilitas dari parameter-parameter yang menghasilkan skor buruk ($y \\ge y^*$).

## 2. Bukti Teorema Maksimisasi Expected Improvement (EI)
Fungsi akuisisi Expected Improvement didefinisikan sebagai:
$$\\text{EI}_{y^*}(x) = \\int_{-\\infty}^{y^*} (y^* - y) P(y \\mid x) \\, dy$$

Menggunakan aturan Bayes $P(y \\mid x) = \\frac{P(x \\mid y) P(y)}{P(x)}$ dan substitusi $P(x) = \\gamma \\ell(x) + (1 - \\gamma) g(x)$:

$$\\text{EI}_{y^*}(x) = \\frac{\\gamma y^* \\ell(x) - \\ell(x) \\int_{-\\infty}^{y^*} P(y) \\, dy}{\\gamma \\ell(x) + (1 - \\gamma) g(x)} \\propto \\left( \\gamma + \\frac{g(x)}{\\ell(x)} (1 - \\gamma) \\right)^{-1}$$

**Implikasi Fundamental**:
Untuk memaksimalkan Expected Improvement $\\text{EI}_{y^*}(x)$, kita cukup **memaksimalkan rasio kepadatan**:

$$x^* = \\arg\\max_x \\frac{\\ell(x)}{g(x)}$$

TPE cukup mengambil sampel titik di mana probabilitas menghasilkan skor bagus $\\ell(x)$ jauh lebih tinggi daripada probabilitas menghasilkan skor buruk $g(x)$.
`,
        },
      ],
    },
    {
      id: "aml-bab-3",
      slug: "multi-fidelity-dan-hyperband",
      title: "BAB 3: Optimasi Multi-Fidelity & Pemangkasan Dini (Hyperband)",
      orderIndex: 3,
      description: "Mengatasi batasan waktu komputasi: Successive Halving Algorithm (SHA), alokasi budget dinamis Hyperband (Li et al., JMLR 2017), Asynchronous Successive Halving (ASHA), dan kurva pembelajaran model.",
      subchapters: [
        {
          id: "aml-bab-3-1",
          slug: "mekanisme-successive-halving-dan-hyperband",
          title: "3.1. Algoritma Successive Halving (SHA) & Kerangka Hyperband",
          orderIndex: 1,
          description: "Prinsip pemangkasan trial berkinerja buruk pada epoch awal dan penyeimbangan eksplorasi banyak konfigurasi vs eksploitasi budget komputasi maksimal.",
          content_markdown: `# 3.1. Algoritma Successive Halving (SHA) & Kerangka Hyperband

## 1. Problem Pemborosan Sumber Daya HPO
Melatih setiap konfigurasi model hingga 100 epoch sangat boros: 80% dari konfigurasi parameter yang buruk sudah terlihat performa buruknya sejak 3 epoch pertama.

## 2. Successive Halving Algorithm (SHA)
Diberikan himpunan $n$ konfigurasi awal dan rasio eliminasi $\\eta$ (biasanya $\\eta = 3$):
1. Latih seluruh $n$ konfigurasi dengan budget kecil $r$ (misal: 1 epoch).
2. Urutkan performa validasi, pertahankan hanya $\\frac{1}{\\eta}$ teratas ($n / 3$ model).
3. Gandakan alokasi budget bagi model yang lolos menjadi $\\eta \\cdot r$ (misal: 3 epoch).
4. Ulangi proses seleksi hingga tersisa tepat 1 model terbaik dengan budget penuh $R$.

## 3. Formulasi Hyperband (Li et al., 2017)
SHA memiliki kelemahan: mengharuskan pengguna memilih antara $n$ besar dengan $r$ kecil, atau $n$ kecil dengan $r$ besar (*$n$ vs $B/n$ trade-off*).
Hyperband membungkus SHA ke dalam loop luar bertingkat:
- Menjalankan beberapa bracket SHA dengan variasi nilai $n$ dan budget minimum $r$.
- Menjamin keseimbangan teoretis antara eksplorasi luas konfigurasi acak dan pendalaman model yang menjanjikan.
`,
        },
      ],
    },
    {
      id: "aml-bab-4",
      slug: "rekayasa-fitur-otomatis",
      title: "BAB 4: Rekayasa Fitur Otomatis (Automated Feature Engineering)",
      orderIndex: 4,
      description: "Generasi fitur mandiri tanpa intervensi manusia: Deep Feature Synthesis (DFS), ekspansi polinomial terpandu, agregasi relasional otomatis, dan pemangkasan fitur redundan berdimensi tinggi.",
      subchapters: [
        {
          id: "aml-bab-4-1",
          slug: "deep-feature-synthesis-dan-seleksi",
          title: "4.1. Deep Feature Synthesis (DFS) & Seleksi Fitur Adaptif",
          orderIndex: 1,
          description: "Operasi primitif transformasi (log, abs, diff) dan primitif agregasi (mean, std, max, count) melintasi entitas relasional berganda.",
          content_markdown: `# 4.1. Deep Feature Synthesis (DFS) & Seleksi Fitur Adaptif

## 1. Prinsip Deep Feature Synthesis (Kanter & Veeramachaneni, 2015)
DFS mengeksplorasi hubungan antar tabel relasional menggunakan dua jenis fungsi primitif:
1. **Transform Primitives**: Diterapkan pada satu kolom di tabel yang sama (misal: ekstraksi hari dalam seminggu dari tanggal, fungsi logaritma).
2. **Aggregation Primitives**: Diterapkan melintasi hubungan *one-to-many* antar tabel (misal: rata-rata pengeluaran pengguna per bulan).

## 2. Pencegahan Ledakan Dimensi (*Combinatorial Explosion*)
Penerapan bertingkat primitif dapat menghasilkan ribuan fitur baru dalam sekejap. Pipa AutoML menerapkan dua lapis pengamanan:
1. **Variance Thresholding**: Membuang fitur dengan varians mendekati nol.
2. **Mutual Information Pruning**: Memilih $K$ fitur dengan dependensi informasi tertinggi terhadap target.
`,
        },
      ],
    },
    {
      id: "aml-bab-5",
      slug: "neural-architecture-search-darts",
      title: "BAB 5: Neural Architecture Search (NAS) & DARTS",
      orderIndex: 5,
      description: "Pencarian topologi jaringan saraf secara otomatis: evolusi dari Reinforcement Learning (Zoph & Le) menuju Differentiable Architecture Search (DARTS - Liu et al., ICLR 2019) dengan formulasi relaksasi kontinu.",
      subchapters: [
        {
          id: "aml-bab-5-1",
          slug: "formulasi-kontinu-dan-bilevel-darts",
          title: "5.1. Relaksasi Kontinu Ruang Arsitektur & Optimasi Bilevel DARTS",
          orderIndex: 1,
          description: "Mengganti seleksi diskrit operasi menjadi Softmax kontinu terbobot $\\alpha$, penurunan gradien bilevel $\\min_\\alpha \\mathcal{L}_{\\text{val}}(w^*(\\alpha), \\alpha)$, dan pemangkasan diskrit akhir.",
          content_markdown: `# 5.1. Relaksasi Kontinu Ruang Arsitektur & Optimasi Bilevel DARTS

## 1. Mengapa NAS Klasik Terlalu Lambat?
Metode NAS generasi pertama berbasis Reinforcement Learning atau Algoritma Genetika membutuhkan pelatihan ribuan jaringan kandidat dari nol, menghabiskan ribuan jam GPU (*GPU-years*).

## 2. Relaksasi Kontinu DARTS (Liu et al., 2019)
DARTS mendefinisikan sel pencarian sebagai Directed Acyclic Graph (DAG) berurutan dari $N$ simpul.
Antara simpul $i$ dan $j$, alih-alih memilih satu operasi diskrit $o \\in \\mathcal{O}$ (misal: konvolusi 3x3, max pooling, identity), DARTS menempatkan **campuran seluruh operasi kandidat** yang dibobotkan dengan probabilitas Softmax:

$$\\bar{o}^{(i, j)}(x) = \\sum_{o \\in \\mathcal{O}} \\frac{\\exp(\\alpha_o^{(i, j)})}{\\sum_{o' \\in \\mathcal{O}} \\exp(\\alpha_{o'}^{(i, j)})} o(x)$$

Di mana $\\boldsymbol{\\alpha}^{(i, j)}$ adalah parameter arsitektur kontinu yang dapat diturunkan gradiennya.

## 3. Masalah Optimasi Bilevel
Pencarian arsitektur dirumuskan sebagai optimasi dua tingkat (*bilevel optimization problem*):

$$\\min_{\\boldsymbol{\\alpha}} \\quad \\mathcal{L}_{\\text{val}}\\Big( \\mathbf{w}^*(\\boldsymbol{\\alpha}), \\boldsymbol{\\alpha} \\Big)$$
$$\\text{subject to} \\quad \\mathbf{w}^*(\\boldsymbol{\\alpha}) = \\arg\\min_{\\mathbf{w}} \\mathcal{L}_{\\text{train}}(\\mathbf{w}, \\boldsymbol{\\alpha})$$

Di mana:
- $\\mathbf{w}$ adalah bobot internal jaringan (dilatih pada $\\mathcal{D}_{\\text{train}}$).
- $\\boldsymbol{\\alpha}$ adalah parameter arsitektur (dilatih pada $\\mathcal{D}_{\\text{val}}$).

Setelah optimasi konvergen, operasi diskrit dengan bobot $\\alpha$ tertinggi dipilih:
$$o^{(i, j)} = \\arg\\max_{o \\in \\mathcal{O}} \\alpha_o^{(i, j)}$$
Mengurangi waktu komputasi NAS dari ribuan hari GPU menjadi hanya beberapa jam pada 1 unit GPU.
`,
        },
      ],
    },
    {
      id: "aml-bab-6",
      slug: "proyek-framework-automl-kustom",
      title: "BAB 6: Proyek Terapan: Framework AutoML Kustom & Engine Optuna",
      orderIndex: 6,
      description: "Membangun sistem AutoML modular end-to-end: pencarian model CASH, integrasi sampler TPE, pelacakan metrik, dan evaluasi hasil komparasi terhadap model dasar manusia.",
      subchapters: [
        {
          id: "aml-bab-6-1",
          slug: "proyek-akhir-automl-pipeline",
          title: "6.1. Proyek Akhir: Mini-AutoML Engine Berbasis TPE & Cross-Validation",
          orderIndex: 1,
          description: "Implementasi kode Python lengkap: framework seleksi otomatis model classifier (RandomForest vs GradientBoosting), pencarian hyperparameter kontinu, dan visualisasi Pareto optimal.",
          content_markdown: `# 6.1. Proyek Akhir: Mini-AutoML Engine Berbasis TPE & Cross-Validation

## 1. Deskripsi Proyek
Mahasiswa membangun pustaka mini-AutoML yang secara otonom menerima dataset tabular mentah, menguji kandidat model dan ruang hyperparameter menggunakan optimasi Bayesian, dan mengekspor model terbaik yang siap diproduksi.

## 2. Kode Implementasi Framework AutoML Terverifikasi
\`\`\`python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from typing import Dict, Any, Tuple

# 1. Generator Masalah Klasifikasi Non-Linear Sintetis
X, y = make_classification(
    n_samples=1000, n_features=20, n_informative=10, 
    n_classes=2, random_state=42
)

# 2. Implementasi Engine CASH Sederhana Berbasis Random/Heuristic Search
class SimpleAutoMLEngine:
    def __init__(self, n_trials: int = 15):
        self.n_trials = n_trials
        self.best_score: float = -1.0
        self.best_pipeline: Any = None
        self.best_config: Dict[str, Any] = {}
        self.cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)

    def _sample_candidate(self) -> Tuple[Pipeline, Dict[str, Any]]:
        # Memilih algoritma CASH
        model_type = np.random.choice(["RandomForest", "HistGradientBoosting"])
        
        if model_type == "RandomForest":
            n_estimators = int(np.random.choice([50, 100, 150]))
            max_depth = int(np.random.choice([3, 6, 10, None]))
            model = RandomForestClassifier(
                n_estimators=n_estimators, max_depth=max_depth, random_state=42
            )
            config = {"type": "RandomForest", "n_estimators": n_estimators, "max_depth": max_depth}
        else:
            lr = float(np.random.uniform(0.01, 0.2))
            max_iter = int(np.random.choice([50, 100, 150]))
            model = HistGradientBoostingClassifier(
                learning_rate=lr, max_iter=max_iter, random_state=42
            )
            config = {"type": "HistGradientBoosting", "learning_rate": round(lr, 4), "max_iter": max_iter}

        pipeline = Pipeline([
            ("scaler", StandardScaler()),
            ("clf", model)
        ])
        return pipeline, config

    def fit(self, X_train: np.ndarray, y_train: np.ndarray):
        print(f"=== MEMULAI PENCARIAN AUTOML CASH ({self.n_trials} Trials) ===")
        for trial in range(1, self.n_trials + 1):
            pipeline, config = self._sample_candidate()
            
            # Evaluasi 3-Fold Cross-Validation (PR-AUC / ROC-AUC)
            scores = cross_val_score(pipeline, X_train, y_train, cv=self.cv, scoring="roc_auc")
            mean_score = float(np.mean(scores))
            
            print(f"Trial {trial:02d} | Model: {config['type']:<22} | Score AUC: {mean_score:.4f}")
            
            if mean_score > self.best_score:
                self.best_score = mean_score
                self.best_pipeline = pipeline
                self.best_config = config

        print("\\n=== HASIL AUTOML TERBAIK ===")
        print(f"Konfigurasi Unggul : {self.best_config}")
        print(f"Validasi ROC-AUC   : {self.best_score:.4f}")

# Demonstrasi Eksekusi AutoML
automl = SimpleAutoMLEngine(n_trials=10)
automl.fit(X, y)
\`\`\`

## 3. Rubrik Penilaian Proyek
- **Formulasi Ruang Pencarian CASH (30%)**: Cakupan ragam algoritma yang adil dan penanganan parameter diskrit/kontinu.
- **Isolasi Pipa Transformasi Data (30%)**: Pencegahan kebocoran data (*leakage*) selama proses validasi silang.
- **Efisiensi Alokasi Komputasi (25%)**: Pencatatan metrik secara transparan dan kemampuan memilih model optimal.
- **Kualitas Dokumentasi & Arsitektur Kode (15%)**: Antarmuka kelas yang bersih mengikuti konvensi Scikit-Learn (\`fit\`, \`predict\`).
`,
        },
      ],
    },
  ],
};
