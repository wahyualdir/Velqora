import { ModuleSection } from "@/types/module-drive";

/**
 * Kurikulum Lengkap: AutoML & Neural Architecture Search (10 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getAutoMlSections(): ModuleSection[] {
  return [
    {
      id: "automl-sec-1",
      title: "BAB 1: Konsep Dasar AutoML",
      orderIndex: 1,
      isCompleted: false,
      description: "Definisi, tujuan otomasi machine learning, siklus kerja end-to-end, dan komponen inti AutoML pipeline.",
      codeSnippets: [{
        id: "automl-snip-1",
        language: "python",
        caption: "automl_pipeline_concept.py",
        code: "class SimpleAutoMLPipeline:\n    def __init__(self, models):\n        self.models = models\n        self.best_model = None\n        self.best_score = -float('inf')\n\n    def fit(self, X_train, y_train, X_val, y_val, metric_fn):\n        for name, model in self.models.items():\n            model.fit(X_train, y_train)\n            score = metric_fn(y_val, model.predict(X_val))\n            print(f\"[AutoML] Evaluasi model {name}: Score = {score:.4f}\")\n            if score > self.best_score:\n                self.best_score = score\n                self.best_model = model\n        print(f\"--> Pemenang Model Terbaik: {type(self.best_model).__name__} ({self.best_score:.4f})\")\n        return self.best_model",
      }],
    },
    {
      id: "automl-sec-2",
      title: "BAB 2: Automated Data Preparation",
      orderIndex: 2,
      isCompleted: false,
      description: "Automated data cleaning, imputasi cerdas, deteksi anomali otomatis, dan automated data labeling.",
      codeSnippets: [{
        id: "automl-snip-2",
        language: "python",
        caption: "automated_data_prep.py",
        code: "import pandas as pd\nimport numpy as np\n\ndef automated_data_cleaner(df):\n    df_clean = df.copy()\n    # 1. Otomasi imputasi nilai hilang berdasarkan tipe data\n    for col in df_clean.columns:\n        if df_clean[col].isnull().sum() > 0:\n            if np.issubdtype(df_clean[col].dtype, np.number):\n                df_clean[col] = df_clean[col].fillna(df_clean[col].median())\n            else:\n                df_clean[col] = df_clean[col].fillna(df_clean[col].mode()[0])\n    # 2. Otomasi deteksi duplikasi baris\n    df_clean = df_clean.drop_duplicates()\n    return df_clean\n\ndata = pd.DataFrame({'umur': [25, np.nan, 30, 25], 'status': ['aktif', 'aktif', np.nan, 'aktif']})\nprint(\"Data Bersih:\\n\", automated_data_cleaner(data))",
      }],
    },
    {
      id: "automl-sec-3",
      title: "BAB 3: Automated Feature Engineering",
      orderIndex: 3,
      isCompleted: false,
      description: "Feature selection otomatis, ranking dependensi mutual information, dan automated feature generation via transformasi polinomial.",
      codeSnippets: [{
        id: "automl-snip-3",
        language: "python",
        caption: "auto_feature_engineering.py",
        code: "from sklearn.feature_selection import SelectKBest, f_classif\nfrom sklearn.preprocessing import PolynomialFeatures\nimport numpy as np\n\nX = np.array([[1, 2], [3, 4], [5, 6], [7, 8]])\ny = np.array([0, 0, 1, 1])\n\n# 1. Feature Generation Otomatis\npoly = PolynomialFeatures(degree=2, include_bias=False)\nX_poly = poly.fit_transform(X)\n\n# 2. Feature Selection Otomatis (Pilih K fitur terbaik)\nselector = SelectKBest(score_func=f_classif, k=3)\nX_selected = selector.fit_transform(X_poly, y)\nprint(f\"Dimensi Awal: {X.shape[1]} -> Polinomial: {X_poly.shape[1]} -> Terpilih: {X_selected.shape[1]}\")",
      }],
    },
    {
      id: "automl-sec-4",
      title: "BAB 4: Hyperparameter Optimization",
      orderIndex: 4,
      isCompleted: false,
      description: "Metode pencarian hyperparameter: Grid Search, Random Search, Bayesian Optimization (TPE), dan Hyperband bandit-based pruning.",
      codeSnippets: [{
        id: "automl-snip-4",
        language: "python",
        caption: "bayesian_opt_optuna.py",
        code: "def objective_dummy(trial):\n    # Simulasi Bayesian Optimization ruang parameter\n    lr = trial.suggest_float(\"learning_rate\", 1e-4, 1e-1, log=True)\n    depth = trial.suggest_int(\"max_depth\", 3, 10)\n    # Fungsi penalti simulasi (ingin meminimalkan loss)\n    simulated_loss = (lr - 0.01)**2 + (depth - 5)**2\n    return simulated_loss\n\nprint(\"Konsep Bayesian Optimization: Membangun model probabilistik (Gaussian Process/TPE)\")\nprint(\"untuk memilih kombinasi hyperparameter berikutnya yang paling menjanjikan.\")",
      }],
    },
    {
      id: "automl-sec-5",
      title: "BAB 5: Neural Architecture Search (NAS)",
      orderIndex: 5,
      isCompleted: false,
      description: "Konsep dasar NAS, Search Space sel vs makro, strategi pencarian Reinforcement Learning, dan Differentiable NAS (DARTS).",
      codeSnippets: [{
        id: "automl-snip-5",
        language: "python",
        caption: "darts_cell_concept.py",
        code: "import torch\nimport torch.nn as nn\nimport torch.nn.functional as F\n\nclass DartsMixedOp(nn.Module):\n    \"\"\"Konsep Differentiable Architecture Search: Relaksasi continuous operasi\"\"\"\n    def __init__(self, in_features, out_features):\n        super().__init__()\n        self.ops = nn.ModuleList([\n            nn.Linear(in_features, out_features),\n            nn.Sequential(nn.Linear(in_features, out_features), nn.ReLU()),\n            nn.Identity() if in_features == out_features else nn.Linear(in_features, out_features)\n        ])\n        self.alpha_arch = nn.Parameter(torch.zeros(len(self.ops)))\n\n    def forward(self, x):\n        weights = F.softmax(self.alpha_arch, dim=0)\n        return sum(w * op(x) for w, op in zip(weights, self.ops))",
      }],
    },
    {
      id: "automl-sec-6",
      title: "BAB 6: Meta-Learning untuk AutoML",
      orderIndex: 6,
      isCompleted: false,
      description: "Paradigma Learning to Learn, Transfer Learning antar-dataset (Warm Starting), dan Model-Agnostic Meta-Learning (MAML).",
      codeSnippets: [{
        id: "automl-snip-6",
        language: "python",
        caption: "meta_learning_maml.py",
        code: "# Konsep MAML (Model-Agnostic Meta-Learning)\ndef maml_inner_outer_loop(model, tasks, inner_lr=0.01, outer_lr=0.001):\n    meta_gradients = []\n    for task in tasks:\n        # 1. Inner Loop: Adaptasi cepat pada support set beberapa sampel (k-shot)\n        fast_weights = model.adapt(task.support_set, lr=inner_lr)\n        # 2. Outer Loop: Evaluasi performa adaptasi pada query set\n        task_loss = model.evaluate(fast_weights, task.query_set)\n        meta_gradients.append(task_loss.grad)\n    # 3. Meta-Update bobot inisialisasi dasar\n    model.update_meta_weights(meta_gradients, lr=outer_lr)\n    return \"Bobot inisialisasi meta berhasil diperbarui.\"",
      }],
    },
    {
      id: "automl-sec-7",
      title: "BAB 7: AutoML untuk Deep Learning & LLM",
      orderIndex: 7,
      isCompleted: false,
      description: "Automated Deep Learning (AutoDL), Automated Model Selection untuk LLM, dan Automated Prompt Optimization (DSPy & OPRO).",
      codeSnippets: [{
        id: "automl-snip-7",
        language: "python",
        caption: "auto_prompt_optimization.py",
        code: "class PromptOptimizer:\n    def __init__(self, eval_metric):\n        self.metric = eval_metric\n        self.best_prompt = None\n\n    def optimize(self, candidates, validation_data):\n        best_acc = 0.0\n        for p in candidates:\n            score = self.metric(p, validation_data)\n            print(f\"Prompt: '{p}' -> Akurasi: {score:.2%}\")\n            if score > best_acc:\n                best_acc = score\n                self.best_prompt = p\n        return self.best_prompt, best_acc\n\ncandidates = [\"Jawab singkat:\", \"Berikan analisis komprehensif:\", \"Pikirkan langkah demi langkah:\"]\nprint(\"Prompt Terpilih:\", candidates[2])",
      }],
    },
    {
      id: "automl-sec-8",
      title: "BAB 8: Tools & Platform AutoML",
      orderIndex: 8,
      isCompleted: false,
      description: "Eksplorasi ekosistem tools AutoML modern: Auto-sklearn, FLAML, TPOT, Google Vertex AI AutoML, dan H2O AutoML.",
      codeSnippets: [{
        id: "automl-snip-8",
        language: "python",
        caption: "auto_sklearn_demo.py",
        code: "# Contoh integrasi pipeline AutoML berbasis FLAML / Auto-sklearn\n# from flaml import AutoML\n# automl = AutoML()\n# automl.fit(X_train, y_train, task=\"classification\", time_budget=60)\n# print(\"Model Pilihan:\", automl.best_estimator)\n\nclass H2OAutoMLSimulator:\n    def train(self, data, time_budget=30):\n        leaderboard = [\n            {\"model_id\": \"StackedEnsemble_AllModels\", \"auc\": 0.942},\n            {\"model_id\": \"XGBoost_1\", \"auc\": 0.938},\n            {\"model_id\": \"GBM_grid_1\", \"auc\": 0.925}\n        ]\n        return leaderboard\n\nleader = H2OAutoMLSimulator().train(None)\nprint(\"Top Leaderboard Model AutoML:\", leader[0])",
      }],
    },
    {
      id: "automl-sec-9",
      title: "BAB 9: Evaluasi & Efisiensi AutoML",
      orderIndex: 9,
      isCompleted: false,
      description: "Trade-off waktu komputasi vs performa akurasi, early stopping, dan Multi-Objective Optimization (Pareto Frontier untuk Akurasi vs Latensi).",
      codeSnippets: [{
        id: "automl-snip-9",
        language: "python",
        caption: "pareto_frontier_eval.py",
        code: "import numpy as np\n\ndef calculate_pareto_frontier(latency_ms, accuracy):\n    \"\"\"Menemukan model yang berada di kurva Pareto (efisiensi optimal)\"\"\"\n    pareto_indices = []\n    for i in range(len(latency_ms)):\n        is_pareto = True\n        for j in range(len(latency_ms)):\n            if latency_ms[j] <= latency_ms[i] and accuracy[j] >= accuracy[i] and (latency_ms[j] < latency_ms[i] or accuracy[j] > accuracy[i]):\n                is_pareto = False\n                break\n        if is_pareto:\n            pareto_indices.append(i)\n    return pareto_indices\n\nmodels = [\"Model A\", \"Model B\", \"Model C\", \"Model D\"]\nlat = [15, 30, 8, 45]\nacc = [0.89, 0.93, 0.82, 0.94]\np_idx = calculate_pareto_frontier(lat, acc)\nprint(\"Model Terbaik di Garis Pareto:\", [models[i] for i in p_idx])",
      }],
    },
    {
      id: "automl-sec-10",
      title: "BAB 10: Aplikasi AutoML",
      orderIndex: 10,
      isCompleted: false,
      description: "Automasi pipeline data science di industri perbankan, e-commerce, dan pemberdayaan Citizen Data Scientist.",
      codeSnippets: [{
        id: "automl-snip-10",
        language: "python",
        caption: "automl_business_app.py",
        code: "def business_automl_pipeline(churn_dataset):\n    print(\"1. [Ingestion] Mengambil data transaksi dan log interaksi pelanggan\")\n    print(\"2. [Feature Eng] Otomasi agregasi RFM dan windowing time-series\")\n    print(\"3. [AutoML Search] Menemukan konfigurasi ensemble LightGBM + CatBoost\")\n    print(\"4. [Explainability] Otomasi pembuatan SHAP summary plot untuk tim bisnis\")\n    print(\"5. [Export] Serialisasi model ke format ONNX untuk inferensi real-time\")\n    return {\"status\": \"deployed\", \"business_impact\": \"Deteksi churn 24% lebih awal\"}\n\nresult = business_automl_pipeline(None)\nprint(\"Status Pipeline Bisnis:\", result)",
      }],
    },
  ];
}

/**
 * Kurikulum Lengkap: Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence) (10 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getComputationalIntelligenceSections(): ModuleSection[] {
  return [
    {
      id: "ci-sec-1",
      title: "BAB 1: Konsep Dasar Computational Intelligence",
      orderIndex: 1,
      isCompleted: false,
      description: "Definisi Soft Computing vs Hard Computing, toleransi ketidakpastian, dan cabang-cabang utama Computational Intelligence.",
      codeSnippets: [{
        id: "ci-snip-1",
        language: "python",
        caption: "ci_vs_symbolic_ai.py",
        code: "# Perbedaan Paradigma: Hard AI (Exact Logic) vs Soft Computing (Toleran Ketidakpastian)\ndef hard_boolean_logic(suhu):\n    return \"PANAS\" if suhu > 30.0 else \"DINGIN\"\n\ndef soft_fuzzy_membership(suhu):\n    # Derajat keanggotaan kontinu antara 0.0 sampai 1.0\n    if suhu <= 20: return {\"dingin\": 1.0, \"panas\": 0.0}\n    elif suhu >= 35: return {\"dingin\": 0.0, \"panas\": 1.0}\n    else:\n        u_panas = (suhu - 20) / (35 - 20)\n        return {\"dingin\": round(1.0 - u_panas, 2), \"panas\": round(u_panas, 2)}\n\nprint(\"Logika Kaku:\", hard_boolean_logic(29.9))\nprint(\"Soft Computing (Fuzzy):\", soft_fuzzy_membership(29.9))",
      }],
    },
    {
      id: "ci-sec-2",
      title: "BAB 2: Fuzzy Logic",
      orderIndex: 2,
      isCompleted: false,
      description: "Himpunan fuzzy, fungsi keanggotaan (segitiga, trapesium), dan sistem inferensi fuzzy (Mamdani & Sugeno).",
      codeSnippets: [{
        id: "ci-snip-2",
        language: "python",
        caption: "mamdani_fuzzy_inference.py",
        code: "def triangular_mf(x, a, b, c):\n    if x <= a or x >= c: return 0.0\n    elif a < x <= b: return (x - a) / (b - a)\n    else: return (c - x) / (c - b)\n\n# Contoh inferensi sederhana: Kontrol Kecepatan Kipas berdasarkan Suhu\nsuhu_input = 28.0\nu_hangat = triangular_mf(suhu_input, 20, 27, 34)\nu_panas = triangular_mf(suhu_input, 26, 35, 45)\n\n# Defuzzifikasi sederhana rata-rata berbobot\nkecepatan_kipas = (u_hangat * 50 + u_panas * 100) / (u_hangat + u_panas + 1e-6)\nprint(f\"Suhu {suhu_input}°C -> Kecepatan Kipas Target: {kecepatan_kipas:.1f}%\")",
      }],
    },
    {
      id: "ci-sec-3",
      title: "BAB 3: Algoritma Genetika (Genetic Algorithm)",
      orderIndex: 3,
      isCompleted: false,
      description: "Konsep populasi, kromosom biner/real, fitness function, seleksi (Roulette Wheel, Tournament), crossover, dan mutasi.",
      codeSnippets: [{
        id: "ci-snip-3",
        language: "python",
        caption: "genetic_algorithm_basic.py",
        code: "import random\n\ndef fitness(chromosome):\n    # Masalah OneMax: Memaksimalkan jumlah angka 1\n    return sum(chromosome)\n\ndef crossover(parent1, parent2):\n    point = random.randint(1, len(parent1) - 1)\n    return parent1[:point] + parent2[point:]\n\ndef mutate(chromosome, rate=0.05):\n    return [1 - bit if random.random() < rate else bit for bit in chromosome]\n\n# Populasi awal\npopulation = [[random.randint(0, 1) for _ in range(10)] for _ in range(6)]\nbest = max(population, key=fitness)\nprint(f\"Kromosom Terbaik Awal: {best} (Fitness: {fitness(best)})\")",
      }],
    },
    {
      id: "ci-sec-4",
      title: "BAB 4: Evolutionary Computation Lanjutan",
      orderIndex: 4,
      isCompleted: false,
      description: "Evolution Strategy (ES), Genetic Programming (GP sintesis pohon sintaks), dan Differential Evolution (DE) untuk optimasi kontinu.",
      codeSnippets: [{
        id: "ci-snip-4",
        language: "python",
        caption: "differential_evolution_step.py",
        code: "import numpy as np\n\ndef de_mutation(population, F=0.8):\n    # Vektor donor: v = x_r1 + F * (x_r2 - x_r3)\n    idx = np.random.choice(len(population), 3, replace=False)\n    x1, x2, x3 = population[idx[0]], population[idx[1]], population[idx[2]]\n    mutant = x1 + F * (x2 - x3)\n    return mutant\n\npop = np.array([[1.0, 2.0], [3.0, 1.5], [2.0, 4.0], [0.5, 3.0]])\nprint(\"Vektor Mutan DE:\", de_mutation(pop))",
      }],
    },
    {
      id: "ci-sec-5",
      title: "BAB 5: Swarm Intelligence",
      orderIndex: 5,
      isCompleted: false,
      description: "Perilaku kolektif organisme sosial: Particle Swarm Optimization (PSO), Ant Colony Optimization (ACO), dan Artificial Bee Colony (ABC).",
      codeSnippets: [{
        id: "ci-snip-5",
        language: "python",
        caption: "particle_swarm_optimization.py",
        code: "import numpy as np\n\nclass Particle:\n    def __init__(self, dim):\n        self.pos = np.random.uniform(-5, 5, dim)\n        self.vel = np.random.uniform(-1, 1, dim)\n        self.best_pos = self.pos.copy()\n        self.best_score = float('inf')\n\ndef sphere_loss(x): return np.sum(x**2)\n\np = Particle(2)\nscore = sphere_loss(p.pos)\np.best_score = score\nprint(f\"Partikel Posisi: {p.pos}, Nilai Fungsi: {score:.4f}\")",
      }],
    },
    {
      id: "ci-sec-6",
      title: "BAB 6: Artificial Immune System",
      orderIndex: 6,
      isCompleted: false,
      description: "Prinsip sistem imun biologis (antibodi, antigen), seleksi klonal (Clonal Selection), dan Algoritma Negative Selection untuk deteksi anomali.",
      codeSnippets: [{
        id: "ci-snip-6",
        language: "python",
        caption: "negative_selection_anomaly.py",
        code: "class NegativeSelectionDetector:\n    def __init__(self, normal_samples, threshold=1.0):\n        self.normal = normal_samples\n        self.threshold = threshold\n\n    def is_anomaly(self, sample):\n        # Jika sampel berbeda dari semua data normal di atas threshold\n        min_dist = min([abs(sample - n) for n in self.normal])\n        return min_dist > self.threshold\n\ndetector = NegativeSelectionDetector([10.0, 10.5, 9.8, 10.2])\nprint(\"Uji 10.1 (Normal):\", \"Anomali\" if detector.is_anomaly(10.1) else \"Normal\")\nprint(\"Uji 14.5 (Outlier):\", \"Anomali\" if detector.is_anomaly(14.5) else \"Normal\")",
      }],
    },
    {
      id: "ci-sec-7",
      title: "BAB 7: Hybrid Computational Intelligence",
      orderIndex: 7,
      isCompleted: false,
      description: "Integrasi arsitektur hibrida: Adaptive Neuro-Fuzzy Inference System (ANFIS) dan Neuro-Evolution (NEAT) untuk optimasi topologi neural.",
      codeSnippets: [{
        id: "ci-snip-7",
        language: "python",
        caption: "anfis_hybrid_architecture.py",
        code: "print(\"Arsitektur ANFIS (Adaptive Neuro-Fuzzy Inference System):\")\nprint(\"Layer 1: Fuzzifikasi input ke derajat keanggotaan\")\nprint(\"Layer 2: Evaluasi bobot firing rule (T-Norm Product)\")\nprint(\"Layer 3: Normalisasi firing strength\")\nprint(\"Layer 4: Konsekuen polinomial orde-satu (Takagi-Sugeno)\")\nprint(\"Layer 5: Output agregasi defuzzifikasi keseluruhan\")",
      }],
    },
    {
      id: "ci-sec-8",
      title: "BAB 8: Optimasi Metaheuristik Lainnya",
      orderIndex: 8,
      isCompleted: false,
      description: "Algoritma Simulated Annealing berbasis pendinginan termodinamika dan Tabu Search dengan memori jangka pendek untuk keluar dari lokal optimum.",
      codeSnippets: [{
        id: "ci-snip-8",
        language: "python",
        caption: "simulated_annealing.py",
        code: "import math, random\n\ndef simulated_annealing(cost_fn, init_state, temp=100.0, cooling=0.95):\n    current = init_state\n    best = current\n    while temp > 1.0:\n        neighbor = current + random.uniform(-1, 1)\n        delta = cost_fn(neighbor) - cost_fn(current)\n        # Terima jika lebih baik, atau terima dengan probabilitas Boltzmann jika lebih buruk\n        if delta < 0 or random.random() < math.exp(-delta / temp):\n            current = neighbor\n            if cost_fn(current) < cost_fn(best):\n                best = current\n        temp *= cooling\n    return best\n\nf = lambda x: (x - 3)**2 + 2\nprint(\"Solusi Minimum Terpilih:\", round(simulated_annealing(f, 10.0), 3))",
      }],
    },
    {
      id: "ci-sec-9",
      title: "BAB 9: Computational Intelligence untuk Optimasi Modern",
      orderIndex: 9,
      isCompleted: false,
      description: "Penerapan algoritma metaheuristik untuk hyperparameter tuning model Machine Learning, penyeimbangan beban, dan arsitektur pruning.",
      codeSnippets: [{
        id: "ci-snip-9",
        language: "python",
        caption: "ga_hyperparameter_tuning.py",
        code: "# Contoh integrasi GA untuk pemilihan subset fitur data tabular\ndef evaluate_feature_subset(mask, X, y):\n    selected_cols = [i for i, bit in enumerate(mask) if bit == 1]\n    if not selected_cols: return 0.0\n    # Simulasi evaluasi akurasi cross-validation\n    return len(selected_cols) * 0.15 # Skor penalti kompleksitas\n\nmask_contoh = [1, 0, 1, 1, 0, 1]\nprint(\"Fitness Subset Fitur:\", evaluate_feature_subset(mask_contoh, None, None))",
      }],
    },
    {
      id: "ci-sec-10",
      title: "BAB 10: Aplikasi Computational Intelligence",
      orderIndex: 10,
      isCompleted: false,
      description: "Studi kasus industri: optimasi sistem kontrol robotik, penjadwalan otomatis (Job Shop), dan optimasi rute logistik multi-kendaraan (VRP).",
      codeSnippets: [{
        id: "ci-snip-10",
        language: "python",
        caption: "vrp_tsp_routing.py",
        code: "def tsp_nearest_neighbor(distance_matrix):\n    n = len(distance_matrix)\n    visited = [0]\n    while len(visited) < n:\n        curr = visited[-1]\n        next_city = min([c for c in range(n) if c not in visited], key=lambda c: distance_matrix[curr][c])\n        visited.append(next_city)\n    visited.append(0) # Kembali ke depo\n    return visited\n\ndist = [\n    [0, 10, 15, 20],\n    [10, 0, 35, 25],\n    [15, 35, 0, 30],\n    [20, 25, 30, 0]\n]\nprint(\"Rute Logistik Terpilih:\", tsp_nearest_neighbor(dist))",
      }],
    },
  ];
}

/**
 * Kurikulum Lengkap: Computer Vision (14 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getComputerVisionSections(): ModuleSection[] {
  return [
    {
      id: "cv-sec-1",
      title: "BAB 1: Dasar Computer Vision",
      orderIndex: 1,
      isCompleted: false,
      description: "Representasi citra digital sebagai matriks piksel, ruang warna (RGB, HSV, Grayscale), dan operasi morfologi dasar.",
      codeSnippets: [{
        id: "cv-snip-1",
        language: "python",
        caption: "image_representation.py",
        code: "import numpy as np\n\n# Citra grayscale resolusi 4x4 sebagai array 2D integer 0-255\ncitra_gray = np.array([\n    [50,  120, 200, 255],\n    [40,  110, 190, 240],\n    [20,   80, 160, 220],\n    [10,   50, 120, 180]\n], dtype=np.uint8)\n\n# Operasi Binarization (Thresholding sederhana)\nthreshold = 128\ncitra_biner = (citra_gray > threshold).astype(np.uint8) * 255\nprint(\"Citra Biner:\\n\", citra_biner)",
      }],
    },
    {
      id: "cv-sec-2",
      title: "BAB 2: Ekstraksi Fitur Citra Klasik",
      orderIndex: 2,
      isCompleted: false,
      description: "Edge Detection (Sobel, Canny), Corner Detection (Harris), Scale-Invariant Feature Transform (SIFT), dan Histogram of Oriented Gradients (HOG).",
      codeSnippets: [{
        id: "cv-snip-2",
        language: "python",
        caption: "canny_sobel_edges.py",
        code: "import numpy as np\n\ndef sobel_horizontal_kernel():\n    return np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]])\n\ndef sobel_vertical_kernel():\n    return np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])\n\nprint(\"Sobel Horizontal (Deteksi Tepi Horizontal):\\n\", sobel_horizontal_kernel())\nprint(\"Sobel Vertical (Deteksi Tepi Vertikal):\\n\", sobel_vertical_kernel())",
      }],
    },
    {
      id: "cv-sec-3",
      title: "BAB 3: CNN untuk Vision",
      orderIndex: 3,
      isCompleted: false,
      description: "Konsep konvolusi, pooling, feature maps, serta evolusi arsitektur CNN klasik (LeNet, AlexNet, VGG) hingga modern (ResNet, ConvNeXt).",
      codeSnippets: [{
        id: "cv-snip-3",
        language: "python",
        caption: "resnet_residual_block.py",
        code: "import torch\nimport torch.nn as nn\n\nclass ResidualBlock(nn.Module):\n    \"\"\"Blok ResNet dengan Skip Connection untuk mengatasi Vanishing Gradient\"\"\"\n    def __init__(self, channels):\n        super().__init__()\n        self.conv1 = nn.Conv2d(channels, channels, kernel_size=3, padding=1)\n        self.bn1 = nn.BatchNorm2d(channels)\n        self.relu = nn.ReLU(inplace=True)\n        self.conv2 = nn.Conv2d(channels, channels, kernel_size=3, padding=1)\n        self.bn2 = nn.BatchNorm2d(channels)\n\n    def forward(self, x):\n        identity = x\n        out = self.relu(self.bn1(self.conv1(x)))\n        out = self.bn2(self.conv2(out))\n        out += identity  # Skip Connection!\n        return self.relu(out)",
      }],
    },
    {
      id: "cv-sec-4",
      title: "BAB 4: Klasifikasi & Deteksi Objek",
      orderIndex: 4,
      isCompleted: false,
      description: "Image classification multi-kelas, paradigma Object Detection (Two-Stage: Faster R-CNN vs One-Stage: YOLO, SSD), dan Anchor-Free DETR.",
      codeSnippets: [{
        id: "cv-snip-4",
        language: "python",
        caption: "iou_nms_detector.py",
        code: "def calculate_iou(boxA, boxB):\n    # [x1, y1, x2, y2]\n    xA = max(boxA[0], boxB[0])\n    yA = max(boxA[1], boxB[1])\n    xB = min(boxA[2], boxB[2])\n    yB = min(boxA[3], boxB[3])\n    interArea = max(0, xB - xA) * max(0, yB - yA)\n    boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])\n    boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])\n    return interArea / float(boxAArea + boxBArea - interArea)\n\nb1 = [50, 50, 150, 150]\nb2 = [70, 70, 160, 160]\nprint(f\"Intersection over Union (IoU): {calculate_iou(b1, b2):.3f}\")",
      }],
    },
    {
      id: "cv-sec-5",
      title: "BAB 5: Segmentasi Citra",
      orderIndex: 5,
      isCompleted: false,
      description: "Semantic segmentation (per-piksel label), Instance segmentation (identifikasi objek unik), Panoptic segmentation, dan arsitektur U-Net.",
      codeSnippets: [{
        id: "cv-snip-5",
        language: "python",
        caption: "unet_architecture_concept.py",
        code: "import torch\nimport torch.nn as nn\n\nclass UNetContractingBlock(nn.Module):\n    def __init__(self, in_c, out_c):\n        super().__init__()\n        self.conv = nn.Sequential(\n            nn.Conv2d(in_c, out_c, 3, padding=1),\n            nn.ReLU(inplace=True),\n            nn.Conv2d(out_c, out_c, 3, padding=1),\n            nn.ReLU(inplace=True)\n        )\n        self.pool = nn.MaxPool2d(2)\n\n    def forward(self, x):\n        skip = self.conv(x)\n        down = self.pool(skip)\n        return down, skip\n\nprint(\"U-Net: Menyimpan representasi spasial resolusi tinggi melalui Skip Connections.\")",
      }],
    },
    {
      id: "cv-sec-6",
      title: "BAB 6: Vision Transformer & Model Modern",
      orderIndex: 6,
      isCompleted: false,
      description: "Penerapan arsitektur Transformer pada citra (ViT), Patch Embedding, Positional Encoding 2D, Swin Transformer, dan Self-Supervised DINO.",
      codeSnippets: [{
        id: "cv-snip-6",
        language: "python",
        caption: "vision_transformer_patching.py",
        code: "import torch\nimport torch.nn as nn\n\ndef extract_image_patches(image_tensor, patch_size=16):\n    # image_tensor: (B, C, H, W)\n    B, C, H, W = image_tensor.shape\n    patches = image_tensor.unfold(2, patch_size, patch_size).unfold(3, patch_size, patch_size)\n    # Ubah format ke (B, Num_Patches, Patch_Dim)\n    patches = patches.contiguous().view(B, C, -1, patch_size, patch_size)\n    patches = patches.permute(0, 2, 1, 3, 4).contiguous().view(B, -1, C * patch_size * patch_size)\n    return patches\n\ndummy_img = torch.randn(1, 3, 224, 224)\np = extract_image_patches(dummy_img, 16)\nprint(f\"Gambar 224x224 -> {p.shape[1]} Patches dengan dimensi {p.shape[2]}\")",
      }],
    },
    {
      id: "cv-sec-7",
      title: "BAB 7: Foundation Model untuk Vision",
      orderIndex: 7,
      isCompleted: false,
      description: "Segment Anything Model (SAM) berbasis promptable segmentation, zero-shot image-text alignment (CLIP), dan Vision Encoder untuk Multimodal LLM.",
      codeSnippets: [{
        id: "cv-snip-7",
        language: "python",
        caption: "clip_zero_shot_concept.py",
        code: "# Konsep Zero-Shot Classification menggunakan CLIP\ndef zero_shot_classification_concept(image_features, text_embeddings):\n    # Cosine similarity antara visual representation dan textual prompt\n    logits = image_features @ text_embeddings.T\n    probabilities = logits.softmax(dim=-1)\n    return probabilities\n\nprint(\"Foundation Model: Model dilatih pada miliaran pasangan (gambar, teks)\")\nprint(\"sehingga mampu mengenali konsep baru tanpa finetuning spesifik.\")",
      }],
    },
    {
      id: "cv-sec-8",
      title: "BAB 8: Video & Pengenalan Aksi",
      orderIndex: 8,
      isCompleted: false,
      description: "Dimensi temporal citra, Video Classification, Action Recognition (3D-CNN, TimeSformer), dan algoritma pelacakan objek (DeepSORT/ByteTrack).",
      codeSnippets: [{
        id: "cv-snip-8",
        language: "python",
        caption: "video_optical_flow.py",
        code: "print(\"Pemrosesan Video:\")\nprint(\"1. Ekstraksi frame beruntun (T frame, BxCxTxHxW)\")\nprint(\"2. Analisis pergerakan temporal menggunakan Optical Flow\")\nprint(\"3. Multi-Object Tracking (MOT): Asosiasi bounding box via Kalman Filter & Hungarian Algorithm\")",
      }],
    },
    {
      id: "cv-sec-9",
      title: "BAB 9: 3D Computer Vision & Neural Rendering",
      orderIndex: 9,
      isCompleted: false,
      description: "Estimasi kedalaman (Depth Estimation), Point Cloud, Neural Radiance Fields (NeRF) sintesis novel view, dan 3D Gaussian Splatting.",
      codeSnippets: [{
        id: "cv-snip-9",
        language: "python",
        caption: "nerf_ray_casting.py",
        code: "def compute_ray_direction(pixel_x, pixel_y, focal_length, camera_pose):\n    # Arah sinar cahaya dari kamera ke ruang 3D dunia\n    x = (pixel_x - 320) / focal_length\n    y = -(pixel_y - 240) / focal_length\n    ray_dir = [x, y, -1.0]\n    return f\"Sinar dari kamera: {ray_dir}\"\n\nprint(compute_ray_direction(100, 150, 500, None))",
      }],
    },
    {
      id: "cv-sec-10",
      title: "BAB 10: Generative Vision",
      orderIndex: 10,
      isCompleted: false,
      description: "Sintesis citra dengan GAN (Generator vs Discriminator), Denoising Diffusion Probabilistic Models (DDPM), dan Image Inpainting.",
      codeSnippets: [{
        id: "cv-snip-10",
        language: "python",
        caption: "diffusion_denoising_loop.py",
        code: "def reverse_diffusion_step(noisy_latents, predicted_noise, alpha_t, beta_t):\n    \"\"\"Langkah tunggal denoise pada model difusi laten\"\"\"\n    denoised = (noisy_latents - (beta_t / (1.0 - alpha_t)**0.5) * predicted_noise) / (alpha_t**0.5)\n    return denoised\n\nprint(\"Generative Vision: Merekonstruksi citra bersih dari gaussian noise secara iteratif.\")",
      }],
    },
    {
      id: "cv-sec-11",
      title: "BAB 11: Evaluasi & Optimasi Computer Vision",
      orderIndex: 11,
      isCompleted: false,
      description: "Metrik evaluasi deteksi objek (Precision, Recall, mAP50, mAP50-95), optimasi model real-time (TensorRT), dan kompresi model (Pruning, INT8).",
      codeSnippets: [{
        id: "cv-snip-11",
        language: "python",
        caption: "evaluate_map_iou.py",
        code: "def calculate_ap(precisions, recalls):\n    # Menghitung Area Under Precision-Recall Curve (AUC-PR)\n    precisions = [1.0] + precisions + [0.0]\n    recalls = [0.0] + recalls + [1.0]\n    ap = sum((recalls[i] - recalls[i-1]) * precisions[i] for i in range(1, len(recalls)))\n    return round(ap, 4)\n\nprint(\"Average Precision (AP) Sampel:\", calculate_ap([0.9, 0.85, 0.7], [0.3, 0.6, 0.9]))",
      }],
    },
    {
      id: "cv-sec-12",
      title: "BAB 12: Deployment Computer Vision",
      orderIndex: 12,
      isCompleted: false,
      description: "Deployment model visi di Edge Devices (Raspberry Pi, Jetson) vs Cloud Server, video streaming pipeline (RTSP/WebRTC), dan ONNX runtime.",
      codeSnippets: [{
        id: "cv-snip-12",
        language: "python",
        caption: "edge_inference_pipeline.py",
        code: "class VisionEdgeRunner:\n    def __init__(self, model_path):\n        self.model_path = model_path\n        print(f\"[Edge Device] Inisialisasi model engine: {model_path}\")\n\n    def process_frame(self, frame_raw):\n        # Preprocessing -> Inference -> Postprocessing NMS\n        return {\"detected_objects\": [\"person\", \"car\"], \"latency_ms\": 12.4}\n\nrunner = VisionEdgeRunner(\"yolov8n_int8.onnx\")\nprint(\"Hasil Stream Frame:\", runner.process_frame(None))",
      }],
    },
    {
      id: "cv-sec-13",
      title: "BAB 13: Aplikasi Computer Vision",
      orderIndex: 13,
      isCompleted: false,
      description: "Implementasi industri: Face Recognition, Optical Character Recognition (OCR), persepsi mobil otonom (Autonomous Vehicles), dan analisis citra medis.",
      codeSnippets: [{
        id: "cv-snip-13",
        language: "python",
        caption: "medical_ocr_application.py",
        code: "def autonomous_driving_perception(camera_feed, lidar_depth):\n    lanes = \"Garis marka jalan terdeteksi (Tengah)\"\n    obstacles = [\"Pejalan Kaki (Jarak 14 meter)\", \"Kendaraan Depan (Jarak 28 meter)\"]\n    return {\"status\": \"AMBIL_KENDALI\", \"lanes\": lanes, \"obstacles\": obstacles}\n\nprint(\"Status Sistem Persepsi Otomasi:\", autonomous_driving_perception(None, None))",
      }],
    },
    {
      id: "cv-sec-14",
      title: "BAB 14: Etika & Privasi dalam Computer Vision",
      orderIndex: 14,
      isCompleted: false,
      description: "Tantangan privasi biometric, bias rasial/gender dalam sistem pengenalan wajah, deepfake detection, dan regulasi etika pengawasan massal.",
      codeSnippets: [{
        id: "cv-snip-14",
        language: "python",
        caption: "face_blur_privacy.py",
        code: "import numpy as np\n\ndef anonymize_face(image_matrix, bbox):\n    # bbox: [ymin, xmin, ymax, xmax]\n    anonymized = image_matrix.copy()\n    y1, x1, y2, x2 = bbox\n    # Mengaburkan area wajah (Pixelation / Gaussian Blur)\n    anonymized[y1:y2, x1:x2] = np.mean(anonymized[y1:y2, x1:x2])\n    return anonymized\n\nprint(\"Kebijakan Privasi: Wajib melakukan redaksi identitas visual pada rekaman publik.\")",
      }],
    },
  ];
}

/**
 * Kurikulum Lengkap: Data Analyst (14 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getDataAnalystSections(): ModuleSection[] {
  return [
    {
      id: "da-sec-1",
      title: "BAB 1: Dasar Peran Data Analyst",
      orderIndex: 1,
      isCompleted: false,
      description: "Definisi dan tanggung jawab Data Analyst, komparasi peran (Analyst vs Data Scientist vs Data Engineer), dan siklus kerja analisis data.",
      codeSnippets: [{
        id: "da-snip-1",
        language: "python",
        caption: "data_analytics_lifecycle.py",
        code: "DATA_ANALYTICS_LIFECYCLE = [\n    \"1. Business Understanding (Definisi Masalah & KPI)\",\n    \"2. Data Acquisition (Pengumpulan dari DB, API, File)\",\n    \"3. Data Cleaning & Wrangling (Pembersihan anomali)\",\n    \"4. Exploratory Data Analysis (Eksplorasi pola & korelasi)\",\n    \"5. Visualization & Dashboarding (Pelaporan interaktif)\",\n    \"6. Business Recommendations (Keputusan strategis)\"\n]\nfor step in DATA_ANALYTICS_LIFECYCLE: print(step)",
      }],
    },
    {
      id: "da-sec-2",
      title: "BAB 2: Fondasi Statistika untuk Analisis Data",
      orderIndex: 2,
      isCompleted: false,
      description: "Statistik deskriptif (Mean, Median, Modus, IQR, Standar Deviasi), statistik inferensial, distribusi normal, dan uji hipotesis (p-value, t-test).",
      codeSnippets: [{
        id: "da-snip-2",
        language: "python",
        caption: "statistical_testing.py",
        code: "import numpy as np\nfrom scipy import stats\n\ngrup_A = [120, 135, 110, 140, 125, 130] # Penjualan strategi lama\ngrup_B = [145, 150, 138, 160, 142, 155] # Penjualan strategi baru\n\nt_stat, p_val = stats.ttest_ind(grup_A, grup_B)\nprint(f\"Rata-rata Grup A: {np.mean(grup_A):.1f} | Grup B: {np.mean(grup_B):.1f}\")\nprint(f\"T-Statistic: {t_stat:.3f}, P-Value: {p_val:.4f}\")\nprint(\"Signifikan secara statistik (p < 0.05)?\" , \"YA\" if p_val < 0.05 else \"TIDAK\")",
      }],
    },
    {
      id: "da-sec-3",
      title: "BAB 3: Pengumpulan & Pembersihan Data",
      orderIndex: 3,
      isCompleted: false,
      description: "Strategi penanganan missing values (imputasi vs drop), parsing format tanggal, handling string kotor, dan validasi tipe data.",
      codeSnippets: [{
        id: "da-snip-3",
        language: "python",
        caption: "pandas_cleaning_pipeline.py",
        code: "import pandas as pd\n\nraw_data = {\n    'transaksi_id': ['TX01', 'TX02', 'TX03', 'TX04'],\n    'nilai': ['Rp 150.000', 'Rp 250.000', None, 'Rp 100.000'],\n    'tanggal': ['2024-01-15', '2024-01-16', '2024-01-16', 'invalid_date']\n}\ndf = pd.DataFrame(raw_data)\n\n# Pembersihan format mata uang menjadi numerik murni\ndf['nilai_bersih'] = df['nilai'].str.replace('Rp ', '').str.replace('.', '').astype(float)\ndf['nilai_bersih'] = df['nilai_bersih'].fillna(df['nilai_bersih'].median())\nprint(df[['transaksi_id', 'nilai_bersih']])",
      }],
    },
    {
      id: "da-sec-4",
      title: "BAB 4: SQL untuk Analisis Data",
      orderIndex: 4,
      isCompleted: false,
      description: "Sintaks SQL analitik lanjutan: Common Table Expressions (CTE), Window Functions (ROW_NUMBER, DENSE_RANK, LAG, LEAD), dan optimasi agregasi.",
      codeSnippets: [{
        id: "da-snip-4",
        language: "python",
        caption: "advanced_sql_analytics.sql",
        code: "-- Query Analitik Window Function: Menghitung Running Total & Ranking Penjualan\nWITH PenjualanBulanan AS (\n    SELECT \n        customer_id,\n        DATE_TRUNC('month', order_date) AS bulan,\n        SUM(total_amount) AS total_belanja\n    FROM orders\n    GROUP BY customer_id, DATE_TRUNC('month', order_date)\n)\nSELECT \n    customer_id,\n    bulan,\n    total_belanja,\n    DENSE_RANK() OVER (PARTITION BY bulan ORDER BY total_belanja DESC) AS ranking_pelanggan,\n    SUM(total_belanja) OVER (PARTITION BY customer_id ORDER BY bulan) AS running_total\nFROM PenjualanBulanan;",
      }],
    },
    {
      id: "da-sec-5",
      title: "BAB 5: Spreadsheet & Tools Analisis",
      orderIndex: 5,
      isCompleted: false,
      description: "Formula penting Excel & Google Sheets untuk analisis bisnis: XLOOKUP, INDEX-MATCH, SUMIFS, Pivot Table, dan visualisasi cepat.",
      codeSnippets: [{
        id: "da-snip-5",
        language: "python",
        caption: "excel_pivot_simulation.py",
        code: "import pandas as pd\n\n# Simulasi operasi Pivot Table spreadsheet menggunakan Pandas\ndf = pd.DataFrame({\n    'Regional': ['Jakarta', 'Jakarta', 'Surabaya', 'Surabaya', 'Bandung'],\n    'Produk': ['Laptop', 'Mouse', 'Laptop', 'Keyboard', 'Laptop'],\n    'Revenue': [15000, 250, 15000, 450, 15000]\n})\n\npivot = df.pivot_table(index='Regional', columns='Produk', values='Revenue', aggfunc='sum', fill_value=0)\nprint(\"Tabel Pivot Revenue Regional x Produk:\\n\", pivot)",
      }],
    },
    {
      id: "da-sec-6",
      title: "BAB 6: Pemrograman untuk Data Analyst",
      orderIndex: 6,
      isCompleted: false,
      description: "Fondasi Python analitis dengan Pandas dan NumPy, operasi vektorisasi cepat, manipulasi time-series, dan pengenalan sintaks R.",
      codeSnippets: [{
        id: "da-snip-6",
        language: "python",
        caption: "vectorized_analytics.py",
        code: "import numpy as np\n\n# Perhitungan komparatif vektorisasi cepat tanpa looping\nharga_produk = np.array([50000, 120000, 35000, 80000, 200000])\ndiskon_persen = np.array([0.10, 0.15, 0.05, 0.20, 0.25])\n\nharga_akhir = harga_produk * (1.0 - diskon_persen)\nprint(\"Harga Akhir Setelah Diskon:\", harga_akhir)",
      }],
    },
    {
      id: "da-sec-7",
      title: "BAB 7: Exploratory Data Analysis (EDA)",
      orderIndex: 7,
      isCompleted: false,
      description: "Univariate & multivariate analysis, deteksi outlier menggunakan Z-Score dan IQR, matriks korelasi Pearson/Spearman, serta interpretasi sebaran.",
      codeSnippets: [{
        id: "da-snip-7",
        language: "python",
        caption: "iqr_outlier_detection.py",
        code: "import numpy as np\n\ndef detect_outliers_iqr(data):\n    q25, q75 = np.percentile(data, [25, 75])\n    iqr = q75 - q25\n    lower_bound = q25 - (1.5 * iqr)\n    upper_bound = q75 + (1.5 * iqr)\n    outliers = [x for x in data if x < lower_bound or x > upper_bound]\n    return outliers, (lower_bound, upper_bound)\n\npenjualan = [10, 12, 11, 14, 13, 15, 12, 100, 11] # 100 adalah outlier\noutliers, bounds = detect_outliers_iqr(penjualan)\nprint(f\"Batas Normal: {bounds[0]} s/d {bounds[1]}\")\nprint(f\"Outlier Ditemukan: {outliers}\")",
      }],
    },
    {
      id: "da-sec-8",
      title: "BAB 8: Visualisasi Data",
      orderIndex: 8,
      isCompleted: false,
      description: "Prinsip desain visualisasi data (Gestalt Principles, rasio data-ink), pemilihan chart yang tepat (Bar, Line, Scatter, Heatmap), dan data storytelling.",
      codeSnippets: [{
        id: "da-snip-8",
        language: "python",
        caption: "data_visualization_principles.py",
        code: "print(\"Pedoman Pemilihan Chart:\")\nprint(\"- Tren Waktu: Line Chart / Area Chart\")\nprint(\"- Perbandingan Kategori: Horizontal / Vertical Bar Chart\")\nprint(\"- Komposisi Proporsi: Stacked Bar Chart (Hindari Pie Chart > 5 slice)\")\nprint(\"- Hubungan Dua Variabel: Scatter Plot / Bubble Plot\")\nprint(\"- Distribusi Sebaran: Histogram / Box Plot\")",
      }],
    },
    {
      id: "da-sec-9",
      title: "BAB 9: Dashboard & Reporting",
      orderIndex: 9,
      isCompleted: false,
      description: "Perancangan dashboard eksekutif interaktif, pemilihan Key Performance Indicators (KPI), dan otomasi pembuatan laporan terjadwal.",
      codeSnippets: [{
        id: "da-snip-9",
        language: "python",
        caption: "kpi_reporting_engine.py",
        code: "def generate_executive_kpis(revenue, cost, active_users, churned_users):\n    profit_margin = ((revenue - cost) / revenue) * 100\n    churn_rate = (churned_users / active_users) * 100\n    arpu = revenue / active_users\n    return {\n        \"MRR\": f\"Rp {revenue:,.0f}\",\n        \"Profit Margin\": f\"{profit_margin:.1f}%\",\n        \"Churn Rate\": f\"{churn_rate:.2f}%\",\n        \"ARPU\": f\"Rp {arpu:,.0f}\"\n    }\n\nkpi = generate_executive_kpis(500000000, 320000000, 12500, 180)\nfor k, v in kpi.items(): print(f\"{k}: {v}\")",
      }],
    },
    {
      id: "da-sec-10",
      title: "BAB 10: AI-Augmented Analytics",
      orderIndex: 10,
      isCompleted: false,
      description: "Meningkatkan produktivitas analisis menggunakan AI Copilot, Text-to-SQL dengan LLM, dan otomasi sintesis narasi insight berbasis GenAI.",
      codeSnippets: [{
        id: "da-snip-10",
        language: "python",
        caption: "text_to_sql_pipeline.py",
        code: "def simulate_text_to_sql(user_question):\n    schema_context = \"Tabel: sales(id, customer_id, product_name, amount, date)\"\n    # Logika LLM menerjemahkan bahasa manusia menjadi query SQL\n    if \"produk terlaris\" in user_question.lower():\n        sql = \"SELECT product_name, SUM(amount) FROM sales GROUP BY product_name ORDER BY 2 DESC LIMIT 5;\"\n    else:\n        sql = \"SELECT COUNT(*) FROM sales;\"\n    return f\"-- Pertanyaan: {user_question}\\n{sql}\"\n\nprint(simulate_text_to_sql(\"Tampilkan 5 produk terlaris bulan ini\"))",
      }],
    },
    {
      id: "da-sec-11",
      title: "BAB 11: Analisis Lanjutan",
      orderIndex: 11,
      isCompleted: false,
      description: "Metodologi eksperimen A/B testing (ukuran sampel, signifikansi), cohort analysis retensi pelanggan, dan dasar peramalan tren bisnis.",
      codeSnippets: [{
        id: "da-snip-11",
        language: "python",
        caption: "cohort_retention_matrix.py",
        code: "import pandas as pd\n\n# Matriks retensi kohort pengguna\ncohort_data = {\n    'Bulan_Daftar': ['Jan 2024', 'Feb 2024', 'Mar 2024'],\n    'M0': [100.0, 100.0, 100.0],\n    'M1': [45.2, 48.0, None],\n    'M2': [32.1, None, None]\n}\ndf_cohort = pd.DataFrame(cohort_data).set_index('Bulan_Daftar')\nprint(\"Tabel Retensi Pengguna (%):\\n\", df_cohort)",
      }],
    },
    {
      id: "da-sec-12",
      title: "BAB 12: Business Acumen & Komunikasi Stakeholder",
      orderIndex: 12,
      isCompleted: false,
      description: "Menerjemahkan temuan data teknis menjadi keputusan bisnis yang dapat ditindaklanjuti (actionable insights), dan teknik presentasi eksekutif.",
      codeSnippets: [{
        id: "da-snip-12",
        language: "python",
        caption: "executive_insight_summary.py",
        code: "def craft_business_insight(drop_rate, root_cause, recommendation):\n    return f\"\"\"=== EXECUTIVE BRIEF ===\nTemuan Utama : Terjadi penurunan konversi sebesar {drop_rate}% pada halaman pembayaran.\nAkar Masalah : {root_cause}\nRekomendasi  : {recommendation}\nEstimasi Dampak: Pemulihan potensi omzet Rp 85.000.000 per bulan.\"\"\"\n\nprint(craft_business_insight(18.5, \"Gateway pembayaran e-wallet sering mengalami timeout\", \"Integrasikan redundant gateway alternatif\"))",
      }],
    },
    {
      id: "da-sec-13",
      title: "BAB 13: Cloud Analytics Platform",
      orderIndex: 13,
      isCompleted: false,
      description: "Eksplorasi platform analitik cloud modern: Google BigQuery, Snowflake, arsitektur data warehouse berbasis cloud, dan query skala petabyte.",
      codeSnippets: [{
        id: "da-snip-13",
        language: "python",
        caption: "bigquery_partition_query.sql",
        code: "-- Query Teroptimasi di Cloud Data Warehouse (Partitioned & Clustered Table)\nSELECT \n    country_code,\n    device_category,\n    COUNT(DISTINCT session_id) AS total_sessions,\n    ROUND(SUM(transaction_revenue), 2) AS total_revenue\nFROM `velqora-analytics.prod_dw.analytics_events_partitioned`\nWHERE _PARTITIONDATE >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)\nGROUP BY 1, 2\nORDER BY total_revenue DESC;",
      }],
    },
    {
      id: "da-sec-14",
      title: "BAB 14: Studi Kasus & Proyek",
      orderIndex: 14,
      isCompleted: false,
      description: "Proyek analitik end-to-end: Analisis Data Penjualan Ritel, Analisis Segmentasi Pelanggan RFM (Recency, Frequency, Monetary), dan Dashboard Eksekutif.",
      codeSnippets: [{
        id: "da-snip-14",
        language: "python",
        caption: "rfm_segmentation_project.py",
        code: "import pandas as pd\n\ndef calculate_rfm(df_orders):\n    # R: Recency (hari sejak order terakhir), F: Frequency (jumlah order), M: Monetary (total belanja)\n    rfm = pd.DataFrame({\n        'customer': ['Cust_A', 'Cust_B', 'Cust_C'],\n        'recency_days': [5, 45, 120],\n        'frequency': [12, 4, 1],\n        'monetary': [5400000, 1200000, 250000]\n    })\n    # Kategori pelanggan sederhana\n    rfm['segment'] = rfm['recency_days'].apply(lambda r: 'Juara/Aktif' if r <= 10 else ('Perlu Perhatian' if r <= 60 else 'Dormant'))\n    return rfm\n\nprint(calculate_rfm(None))",
      }],
    },
  ];
}

/**
 * Kurikulum Lengkap: Data Engineering & Big Data untuk AI (12 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getDataEngineeringAiSections(): ModuleSection[] {
  return [
    {
      id: "de-sec-1",
      title: "BAB 1: Konsep Dasar Data Engineering",
      orderIndex: 1,
      isCompleted: false,
      description: "Peran Data Engineer dalam ekosistem AI modern, arsitektur data lifecycle, dan fondasi infrastruktur data terdistribusi.",
      codeSnippets: [{
        id: "de-snip-1",
        language: "python",
        caption: "data_lifecycle_flow.py",
        code: "DATA_ENGINEERING_LIFECYCLE = {\n    \"Generation\": \"IoT Sensors, Web Logs, Microservices DB\",\n    \"Ingestion\": \"Kafka, Kinesis, Debezium (CDC)\",\n    \"Storage\": \"Data Lake (S3/GCS), Parquet columnar storage\",\n    \"Processing\": \"Apache Spark, Flink, dbt transformasi\",\n    \"Serving\": \"Feature Store (Feast), Vector DB, Data Warehouse\"\n}\nfor stage, tech in DATA_ENGINEERING_LIFECYCLE.items():\n    print(f\"[{stage}] -> {tech}\")",
      }],
    },
    {
      id: "de-sec-2",
      title: "BAB 2: Arsitektur Data",
      orderIndex: 2,
      isCompleted: false,
      description: "Evolusi arsitektur data: Data Warehouse (OLAP), Data Lake (Unstructured Storage), hingga Data Lakehouse (Delta Lake, Apache Iceberg).",
      codeSnippets: [{
        id: "de-snip-2",
        language: "python",
        caption: "lakehouse_delta_format.py",
        code: "print(\"Kelebihan Arsitektur Data Lakehouse (misal: Apache Iceberg / Delta Lake):\")\nprint(\"- Transaksi ACID pada penyimpanan objek cloud (S3/GCS)\")\nprint(\"- Time Travel (melihat snapshot data historis)\")\nprint(\"- Skema enforcement dan evolusi skema tanpa migrasi tabel berat\")\nprint(\"- Format penyimpanan terbuka berbasis Apache Parquet\")",
      }],
    },
    {
      id: "de-sec-3",
      title: "BAB 3: ETL & ELT",
      orderIndex: 3,
      isCompleted: false,
      description: "Perbedaan paradigma Extract-Transform-Load (ETL) vs Extract-Load-Transform (ELT), serta orkestrasi pipeline data menggunakan Apache Airflow dan dbt.",
      codeSnippets: [{
        id: "de-snip-3",
        language: "python",
        caption: "airflow_dag_sample.py",
        code: "from datetime import datetime\n\n# Definisi konseptual DAG Apache Airflow\ndef extract_task(): return \"Ekstraksi data dari PostgreSQL produksi\"\ndef transform_task(): return \"Pembersihan dan kalkulasi agregasi fitur AI\"\ndef load_task(): return \"Pemuatan data mart ke Snowflake / BigQuery\"\n\nprint(\"Alur Eksekusi DAG: extract_task >> transform_task >> load_task\")",
      }],
    },
    {
      id: "de-sec-4",
      title: "BAB 4: Big Data Processing",
      orderIndex: 4,
      isCompleted: false,
      description: "Pemrosesan data skala besar: ekosistem Apache Hadoop (HDFS), Apache Spark (RDD, DataFrame API, Catalyst Optimizer), dan komputasi memori terdistribusi.",
      codeSnippets: [{
        id: "de-snip-4",
        language: "python",
        caption: "pyspark_wordcount_df.py",
        code: "# Contoh sintaks PySpark DataFrame API untuk pengolahan terdistribusi\n# df = spark.read.parquet(\"s3://velqora-lake/raw-events/\")\n# agg_df = df.groupBy(\"event_type\").count().filter(\"count > 1000\")\n# agg_df.write.mode(\"overwrite\").parquet(\"s3://velqora-lake/curated/\")\n\nprint(\"Apache Spark: Memproses data skala Terabyte secara terdistribusi di memori RAM klaster.\")",
      }],
    },
    {
      id: "de-sec-5",
      title: "BAB 5: Data Pipeline untuk Machine Learning",
      orderIndex: 5,
      isCompleted: false,
      description: "Rancang bangun pipeline data: Batch Processing Pipeline vs Real-Time Streaming Pipeline (Apache Kafka & Apache Flink) untuk model AI.",
      codeSnippets: [{
        id: "de-snip-5",
        language: "python",
        caption: "kafka_streaming_pipeline.py",
        code: "class KafkaStreamEventSimulator:\n    def __init__(self):\n        self.queue = []\n\n    def produce(self, event):\n        self.queue.append(event)\n        print(f\"[Kafka Producer] Mengirim event: {event['type']} untuk ID: {event['user_id']}\")\n\n    def consume(self):\n        while self.queue:\n            e = self.queue.pop(0)\n            print(f\"[Flink Consumer] Memproses streaming event real-time: {e['user_id']}\")\n\nstream = KafkaStreamEventSimulator()\nstream.produce({\"type\": \"KLIK_PRODUK\", \"user_id\": \"usr_9981\"})\nstream.consume()",
      }],
    },
    {
      id: "de-sec-6",
      title: "BAB 6: Data Quality & Governance",
      orderIndex: 6,
      isCompleted: false,
      description: "Otomasi data validation (Great Expectations, Soda), pelacakan silsilah data (Data Lineage / OpenLineage), dan kepatuhan regulasi data (GDPR/UU PDP).",
      codeSnippets: [{
        id: "de-snip-6",
        language: "python",
        caption: "data_quality_contract.py",
        code: "def validate_dataset_schema(records):\n    errors = []\n    for idx, r in enumerate(records):\n        if r.get('id') is None:\n            errors.append(f\"Baris {idx}: Field 'id' wajib ada!\")\n        if r.get('email') and '@' not in r.get('email'):\n            errors.append(f\"Baris {idx}: Format email tidak valid!\")\n    return errors\n\nsample = [{'id': 1, 'email': 'user@velqora.app'}, {'id': 2, 'email': 'bad_email'}]\nprint(\"Validasi Kualitas Data:\", validate_dataset_schema(sample))",
      }],
    },
    {
      id: "de-sec-7",
      title: "BAB 7: Database untuk AI",
      orderIndex: 7,
      isCompleted: false,
      description: "Perbandingan basis data: Relational SQL, NoSQL Document (MongoDB), Vector Database (pgvector, Milvus, Qdrant) untuk RAG, dan Graph Database (Neo4j).",
      codeSnippets: [{
        id: "de-snip-7",
        language: "python",
        caption: "vector_db_similarity.py",
        code: "import numpy as np\n\ndef cosine_similarity(v1, v2):\n    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))\n\nembedding_query = np.array([0.15, 0.82, -0.45, 0.33])\nembedding_doc1  = np.array([0.14, 0.80, -0.41, 0.35]) # Sangat relevan\nembedding_doc2  = np.array([-0.80, 0.10, 0.50, -0.20]) # Tidak relevan\n\nprint(f\"Kemiripan Dokumen 1: {cosine_similarity(embedding_query, embedding_doc1):.4f}\")\nprint(f\"Kemiripan Dokumen 2: {cosine_similarity(embedding_query, embedding_doc2):.4f}\")",
      }],
    },
    {
      id: "de-sec-8",
      title: "BAB 8: Data Mesh & Data Contract",
      orderIndex: 8,
      isCompleted: false,
      description: "Paradigma desentralisasi Data Mesh (Domain-oriented data ownership, Data as a Product), dan implementasi Data Contract antar-tim.",
      codeSnippets: [{
        id: "de-snip-8",
        language: "python",
        caption: "data_contract_schema.json",
        code: "DATA_CONTRACT = {\n    \"version\": \"1.0.0\",\n    \"dataset\": \"orders_checkout\",\n    \"owner\": \"tim-pembayaran\",\n    \"schema\": {\n        \"order_id\": {\"type\": \"string\", \"nullable\": False},\n        \"amount\": {\"type\": \"number\", \"minimum\": 0},\n        \"currency\": {\"type\": \"string\", \"enum\": [\"IDR\", \"USD\"]}\n    },\n    \"sla\": {\"freshness_minutes\": 5, \"availability_pct\": 99.9}\n}\nprint(\"Data Contract Standar:\", DATA_CONTRACT[\"dataset\"], \"SLA:\", DATA_CONTRACT[\"sla\"])",
      }],
    },
    {
      id: "de-sec-9",
      title: "BAB 9: Real-Time & Streaming Feature Engineering",
      orderIndex: 9,
      isCompleted: false,
      description: "Fitur waktu-nyata untuk model ML: Feature Store (Feast/Hopsworks), windowing agregasi streaming, dan low-latency feature serving.",
      codeSnippets: [{
        id: "de-snip-9",
        language: "python",
        caption: "feature_store_concept.py",
        code: "class SimpleFeatureStore:\n    def __init__(self):\n        self.online_store = {}\n\n    def push_features(self, entity_id, features_dict):\n        self.online_store[entity_id] = features_dict\n\n    def get_online_features(self, entity_id):\n        # Latensi sangat rendah (< 10 ms) dari Redis/Memory\n        return self.online_store.get(entity_id, {})\n\nfs = SimpleFeatureStore()\nfs.push_features(\"user_102\", {\"transaksi_1_jam_terakhir\": 4, \"total_nilai_1_jam\": 850000})\nprint(\"Fitur Online Siap Inferensi:\", fs.get_online_features(\"user_102\"))",
      }],
    },
    {
      id: "de-sec-10",
      title: "BAB 10: Data Curation untuk Training Model Besar",
      orderIndex: 10,
      isCompleted: false,
      description: "Kurasi dataset pre-training LLM: Web scraping etis, text extraction, deduplikasi skala besar (MinHash LSH), filtering toksisitas, dan data synthetic.",
      codeSnippets: [{
        id: "de-snip-10",
        language: "python",
        caption: "minhash_lsh_dedup.py",
        code: "def get_jaccard_similarity(text1, text2):\n    # Set of shingles (n-gram kata)\n    set1 = set(text1.lower().split())\n    set2 = set(text2.lower().split())\n    inter = len(set1.intersection(set2))\n    union = len(set1.union(set2))\n    return inter / union if union > 0 else 0.0\n\nt1 = \"Belajar kecerdasan buatan dan data engineering di Velqora\"\nt2 = \"Belajar kecerdasan buatan serta data engineering di platform Velqora\"\nprint(f\"Tingkat Kemiripan Dokumen: {get_jaccard_similarity(t1, t2):.2%}\")",
      }],
    },
    {
      id: "de-sec-11",
      title: "BAB 11: Skalabilitas & Cloud Data Infrastructure",
      orderIndex: 11,
      isCompleted: false,
      description: "Infrastruktur cloud data modern (AWS EMR/Athena, GCP Dataproc/BigQuery, Azure Synapse), object storage skala petabyte, dan multi-node checkpointing.",
      codeSnippets: [{
        id: "de-snip-11",
        language: "python",
        caption: "cloud_data_architecture.py",
        code: "print(\"Infrastruktur Data Cloud untuk AI:\")\nprint(\"- Storage Layer  : AWS S3 / Google Cloud Storage (Data Lake)\")\nprint(\"- Compute Layer  : Kubernetes (EKS/GKE) + Ray Clusters / Spark\")\nprint(\"- Orchestration  : Managed Airflow (MWAA / Cloud Composer)\")\nprint(\"- Observability  : Datadog / Prometheus monitoring pipeline health\")",
      }],
    },
    {
      id: "de-sec-12",
      title: "BAB 12: Keamanan & Privasi Data dalam Pipeline",
      orderIndex: 12,
      isCompleted: false,
      description: "Enkripsi data at rest & in transit (AES-256, TLS 1.3), masking/anonymization data sensitif PII (Personally Identifiable Information), dan role-based access control (RBAC).",
      codeSnippets: [{
        id: "de-snip-12",
        language: "python",
        caption: "pii_masking_pipeline.py",
        code: "def mask_pii_data(user_record):\n    masked = user_record.copy()\n    if 'nomor_telepon' in masked:\n        phone = str(masked['nomor_telepon'])\n        masked['nomor_telepon'] = phone[:3] + '****' + phone[-3:]\n    if 'email' in masked:\n        email = masked['email']\n        parts = email.split('@')\n        masked['email'] = parts[0][:2] + '***@' + parts[1]\n    return masked\n\nsample_user = {'id': 101, 'nama': 'Budi Santoso', 'nomor_telepon': '081234567890', 'email': 'budi.santoso@gmail.com'}\nprint(\"Data Sebelum Masking:\", sample_user)\nprint(\"Data Setelah Masking (Aman untuk Training/Analytics):\", mask_pii_data(sample_user))",
      }],
    },
  ];
}

export const CURRICULUM_BATCH2_MAP: Record<string, () => ModuleSection[]> = {
  "automl": getAutoMlSections,
  "automl-neural-architecture-search": getAutoMlSections,
  "computational-intelligence": getComputationalIntelligenceSections,
  "computational-intelligence-fuzzy-logic-genetic-algorithm-swarm-intelligence": getComputationalIntelligenceSections,
  "computer-vision": getComputerVisionSections,
  "data-analyst": getDataAnalystSections,
  "data-engineering": getDataEngineeringAiSections,
  "data-engineering-big-data-untuk-ai": getDataEngineeringAiSections,
};

export function getBatch2CurriculumNote(slug: string): { title: string; content_markdown: string; category_name: string } | null {
  const clean = slug.toLowerCase().trim();
  const allGroups = [
    { name: "AutoML & Neural Architecture Search", sections: getAutoMlSections() },
    { name: "Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence)", sections: getComputationalIntelligenceSections() },
    { name: "Computer Vision", sections: getComputerVisionSections() },
    { name: "Data Analyst", sections: getDataAnalystSections() },
    { name: "Data Engineering & Big Data untuk AI", sections: getDataEngineeringAiSections() },
  ];

  for (const group of allGroups) {
    for (const sec of group.sections) {
      const sSlug = sec.title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
      if (sSlug === clean || clean.includes(sSlug) || sSlug.includes(clean)) {
        const code = sec.codeSnippets?.[0]?.code || '# Contoh kode materi';
        const caption = sec.codeSnippets?.[0]?.caption || 'script.py';
        const codeBlock = String.fromCharCode(96, 96, 96) + 'python\n# ' + caption + '\n' + code + '\n' + String.fromCharCode(96, 96, 96);
        const content = '# ' + sec.title + '\n\n' + sec.description + '\n\n## Konsep Utama\n- Memahami teori dan metodologi fundamental terkait ' + sec.title + '.\n- Penerapan praktis dengan arsitektur modern dan standar industri AI.\n- Analisis performa, kelebihan, dan limitasi teknis implementasi.\n\n## Implementasi Kode Praktikum\n\n' + codeBlock + '\n\n## Rangkuman Materi\nTopik ini memberikan dasar komprehensif bagi praktisi data dan AI dalam menguasai kompetensi sesuai kurikulum standar industri Velqora.';
        return {
          title: sec.title,
          content_markdown: content,
          category_name: group.name,
        };
      }
    }
  }
  return null;
}
