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
      description: "Definisi dan tanggung jawab Data Analyst (mengubah data mentah menjadi actionable insight), perbandingan komprehensif peran Data Analyst vs Data Scientist vs Data Engineer (fokus, pertanyaan inti, tools, horizon waktu), hard skills vs soft skills, ekosistem tools modern (Data Warehouse, SQL, dbt, Spreadsheet, Python, BI, AI-augmented), serta 8 tahapan siklus kerja analisis data end-to-end.",
      codeSnippets: [
        {
          id: "da-snip-1-1",
          language: "sql",
          caption: "daily_sales_health_check.sql",
          code: "-- Query dasar yang umum dikerjakan Data Analyst:\n-- Menghitung jumlah order dan total revenue per bulan\nSELECT\n    DATE_TRUNC('month', order_date) AS bulan,\n    COUNT(DISTINCT order_id) AS jumlah_order,\n    SUM(total_amount) AS total_revenue\nFROM sales.orders\nWHERE order_status = 'completed'\nGROUP BY 1\nORDER BY 1;\n\n-- Dialek SQL:\n-- PostgreSQL/Snowflake: DATE_TRUNC('month', order_date)\n-- BigQuery: DATE_TRUNC(order_date, MONTH) -- tanpa tanda kutip unit",
        },
        {
          id: "da-snip-1-2",
          language: "python",
          caption: "sales_quick_healthcheck.py",
          code: "import pandas as pd\n\n# Quick health-check data penjualan (hasil export dari data warehouse)\ndf = pd.read_csv('sales_data.csv', parse_dates=['order_date'])\n\n# Ringkasan cepat: tipe data, statistik dasar, dan missing value\nprint('Info Struktur Dataset:')\nprint(df.info())\nprint('\\nStatistik Deskriptif:\\n', df.describe(include='all'))\nprint('\\nMissing Values per Kolom:\\n', df.isna().sum())\n\n# Trend revenue bulanan\nmonthly_revenue = (\n    df.groupby(df['order_date'].dt.to_period('M'))['total_amount']\n    .sum()\n    .reset_index(name='total_revenue')\n)\nprint('\\nTrend Revenue Bulanan:\\n', monthly_revenue)",
        },
        {
          id: "da-snip-1-3",
          language: "python",
          caption: "three_roles_case_comparison.py",
          code: "# Kasus: 'Kenapa Revenue Maret Turun?' didekati dari 3 peran data:\n\n# 1. Sudut pandang Data Analyst (Apa yang terjadi?)\n# SELECT region, SUM(total_amount) AS revenue_maret FROM sales.orders\n# WHERE order_date BETWEEN '2026-03-01' AND '2026-03-31' GROUP BY region ORDER BY revenue_maret ASC;\n\n# 2. Sudut pandang Data Scientist (Apakah penurunan signifikan secara statistik atau fluktuasi normal?)\nfrom scipy import stats\nimport pandas as pd\n\n# feb = df[df['order_date'].dt.month == 2]['total_amount']\n# mar = df[df['order_date'].dt.month == 3]['total_amount']\n# t_stat, p_val = stats.ttest_ind(feb, mar, equal_var=False) # Welch's t-test\n# print(f't-stat={t_stat:.3f}, p-value={p_val:.4f}')\n\n# 3. Sudut pandang Data Engineer (Pastikan data lengkap dan reliable via pipeline ETL)\ndef extract_transform_load(source_path: str, target_table: str, engine):\n    df = pd.read_csv(source_path)\n    df = df.dropna(subset=['order_id', 'order_date'])\n    df['order_date'] = pd.to_datetime(df['order_date'])\n    df.to_sql(target_table, con=engine, if_exists='append', index=False)\nprint('Ketiga peran saling melengkapi: DA menganalisis bisnis, DS memodelkan statistik, DE menjamin pipeline data.')",
        },
        {
          id: "da-snip-1-4",
          language: "python",
          caption: "mini_analytics_lifecycle.py",
          code: "import pandas as pd\nimport matplotlib.pyplot as plt\n\n# Siklus Mini Analisis Data End-to-End:\n# 1. Pertanyaan Bisnis: Kategori produk apa yang penjualannya menurun >10% dalam 3 bulan terakhir?\n# 2. Pengumpulan Data\ndf = pd.read_csv('sales_data.csv', parse_dates=['order_date'])\n\n# 3. Pembersihan Data\ndf = df.drop_duplicates()\ndf = df.dropna(subset=['category', 'total_amount'])\ndf = df[df['total_amount'] > 0] # buang anomali negatif/nol\n\n# 4. EDA - trend penjualan per kategori per bulan\ncategory_trend = (\n    df.groupby([df['order_date'].dt.to_period('M'), 'category'])['total_amount']\n    .sum()\n    .unstack(fill_value=0)\n)\n\n# 5. Analisis - persentase perubahan 3 bulan terakhir\npct_change_3m = category_trend.pct_change(periods=3).iloc[-1]\nkategori_menurun = pct_change_3m[pct_change_3m < -0.1].sort_values()\n\n# 6. Storytelling & Rekomendasi\nprint('Kategori dengan penurunan signifikan (>10% dalam 3 bulan terakhir):')\nprint(kategori_menurun)",
        },
      ],
    },
    {
      id: "da-sec-2",
      title: "BAB 2: Fondasi Statistika untuk Analisis Data",
      orderIndex: 2,
      isCompleted: false,
      description: "Fondasi statistik deskriptif dan inferensial: Ukuran pemusatan (Mean, Median yang robust terhadap outlier/skewed data, Modus), ukuran penyebaran (Variance, Standard Deviation, Interquartile Range IQR), konsep Populasi vs Sampel, Sampling Error, Standard Error, Confidence Interval (CI 95%), Central Limit Theorem (CLT), distribusi data (Normal, Binomial, Poisson), uji normalitas Shapiro-Wilk, serta kerangka Uji Hipotesis (H0, H1, p-value, alpha, Independent t-test Welch, Chi-Square test, ANOVA, dan pencegahan P-hacking).",
      codeSnippets: [
        {
          id: "da-snip-2-1",
          language: "python",
          caption: "descriptive_and_skewness.py",
          code: "import pandas as pd\nimport numpy as np\n\ndf = pd.read_csv('sales_data.csv')\n\n# 1. Ringkasan statistik cepat\nprint(df['total_amount'].describe())\n\n# 2. Perhitungan manual & pemahaman sebaran\nmean_val = df['total_amount'].mean()\nmedian_val = df['total_amount'].median()\nstd_val = df['total_amount'].std()\nq1, q3 = df['total_amount'].quantile([0.25, 0.75])\niqr = q3 - q1\n\nprint(f'Mean: {mean_val:,.0f} | Median: {median_val:,.0f}')\nprint(f'Std Dev: {std_val:,.0f} | IQR: {iqr:,.0f}')\n\n# Cek indikasi kemiringan distribusi (skewness)\nif mean_val > median_val * 1.2:\n    print('Distribusi data right-skewed (ada transaksi besar ekstrem). Gunakan median untuk representasi tipikal!')",
        },
        {
          id: "da-snip-2-2",
          language: "python",
          caption: "confidence_interval_calc.py",
          code: "from scipy import stats\nimport numpy as np\nimport pandas as pd\n\ndf = pd.read_csv('sales_data.csv')\nsample = df['total_amount'].sample(200, random_state=42)\n\nmean = sample.mean()\nsem = stats.sem(sample) # Standard Error of the Mean\nci_low, ci_high = stats.t.interval(\n    confidence=0.95, df=len(sample) - 1, loc=mean, scale=sem\n)\n\nprint(f'Mean Sampel: Rp {mean:,.0f}')\nprint(f'95% Confidence Interval: (Rp {ci_low:,.0f} s/d Rp {ci_high:,.0f})')\nprint('Catatan Praktisi: Sampaikan rentang estimasi ke stakeholder untuk ekspektasi yang jujur dan terukur.')",
        },
        {
          id: "da-snip-2-3",
          language: "python",
          caption: "shapiro_normality_and_hypothesis.py",
          code: "from scipy import stats\nimport pandas as pd\n\ndf = pd.read_csv('sales_data.csv')\ndata = df['total_amount'].dropna()\n\n# 1. Uji Normalitas Shapiro-Wilk (sampel 500 baris)\nstat, p_val = stats.shapiro(data.sample(min(len(data), 500), random_state=42))\nprint(f'Shapiro-Wilk p-value: {p_val:.4f}')\nif p_val < 0.05:\n    print('Data kemungkinan TIDAK berdistribusi normal (umum pada data revenue/transaksi).')\n\n# 2. Independent t-test (Welch): Apakah revenue Region A beda signifikan dari Region B?\nreg_a = df[df['region'] == 'A']['total_amount']\nreg_b = df[df['region'] == 'B']['total_amount']\nt_stat, p_ttest = stats.ttest_ind(reg_a, reg_b, equal_var=False) # Welch's t-test\nprint(f'Welch t-stat: {t_stat:.3f}, p-value: {p_ttest:.4f}')\n\n# 3. Chi-Square Test: Asosiasi antara channel marketing dan konversi\ncontingency = pd.crosstab(df['marketing_channel'], df['converted'])\nchi2, p_chi, dof, _ = stats.chi2_contingency(contingency)\nprint(f'Chi-Square: {chi2:.3f}, p-value: {p_chi:.4f}')",
        },
      ],
    },
    {
      id: "da-sec-3",
      title: "BAB 3: Pengumpulan & Pembersihan Data",
      orderIndex: 3,
      isCompleted: false,
      description: "Teknik akuisisi dan wrangling data profesional: Mengambil data dari Database (SQLAlchemy, pd.read_sql), API pihak ketiga (requests, timeout, error handling raise_for_status), dan format file (CSV, Excel multi-sheet, Parquet columnar). Pembersihan data sistematis (identifikasi null, duplikat, format teks tidak konsisten, salah tipe), 5 strategi penanganan missing value (deletion, imputasi median/modus, forward-fill time series, interpolasi, model-based), serta operasi data wrangling (merge/join, pivot long-to-wide, melt wide-to-long, dan feature engineering binning dengan pd.cut/pd.qcut).",
      codeSnippets: [
        {
          id: "da-snip-3-1",
          language: "python",
          caption: "data_ingestion_multi_sources.py",
          code: "import pandas as pd\nfrom sqlalchemy import create_engine\nimport requests\n\n# 1. Database Relasional\nengine = create_engine('postgresql://user:password@host:5432/dbname')\ndf_db = pd.read_sql(\"SELECT * FROM sales.orders WHERE order_date >= '2026-01-01'\", engine)\n\n# 2. API Pihak Ketiga (wajib sertakan timeout & exception check)\nresponse = requests.get('https://api.exchangerate.host/latest', params={'base': 'USD'}, timeout=10)\nresponse.raise_for_status()\ndata_api = response.json()\ndf_api = pd.DataFrame(list(data_api['rates'].items()), columns=['currency', 'rate'])\n\n# 3. Format File (Parquet jauh lebih cepat untuk data besar dibanding CSV)\ndf_csv = pd.read_csv('customer_data.csv')\ndf_parquet = pd.read_parquet('events.parquet')",
        },
        {
          id: "da-snip-3-2",
          language: "python",
          caption: "data_cleaning_and_imputation.py",
          code: "import pandas as pd\nimport numpy as np\n\ndf = pd.read_csv('customer_data.csv')\n\n# Deteksi missing value & persentase\nprint('Persentase NaN per Kolom:\\n', df.isna().mean() * 100)\n\n# Strategi 1: Hapus baris dengan missing value pada kolom kunci identitas\ndf_clean = df.dropna(subset=['customer_id', 'order_date']).copy()\n\n# Strategi 2: Imputasi dengan median (untuk kolom numerik yang skewed)\ndf_clean['income'] = df_clean['income'].fillna(df_clean['income'].median())\n\n# Strategi 3: Imputasi dengan modus (untuk kategorikal)\ndf_clean['city'] = df_clean['city'].fillna(df_clean['city'].mode()[0])\n\n# Strategi 4: Forward fill untuk data berurutan waktu (time-series)\ndf_clean = df_clean.sort_values('order_date')\ndf_clean['stock_level'] = df_clean['stock_level'].ffill()\n\n# Normalisasi teks & hapus duplikasi\ndf_clean['city'] = df_clean['city'].str.strip().str.title()\ndf_clean = df_clean.drop_duplicates(subset=['customer_id', 'order_date'])",
        },
        {
          id: "da-snip-3-3",
          language: "python",
          caption: "wrangling_merge_pivot_melt.py",
          code: "import pandas as pd\n\norders = pd.read_csv('orders.csv')\ncustomers = pd.read_csv('customers.csv')\n\n# 1. Merge: gabungkan data order dengan data pelanggan (selalu cek len sebelum & sesudah)\nprint(f'Baris orders: {len(orders)}')\ndf_merged = orders.merge(customers, on='customer_id', how='left')\nprint(f'Baris hasil merge: {len(df_merged)}')\n\n# 2. Pivot: ringkas total penjualan per pelanggan per bulan (format long -> wide)\ndf_merged['month'] = pd.to_datetime(df_merged['order_date']).dt.to_period('M')\npivot_table = df_merged.pivot_table(\n    index='customer_id', columns='month', values='total_amount', aggfunc='sum', fill_value=0\n)\n\n# 3. Melt: kembalikan dari wide -> long (berguna sebelum plotting)\nlong_format = pivot_table.reset_index().melt(\n    id_vars='customer_id', var_name='month', value_name='total_amount'\n)\n\n# 4. Feature Engineering: kategorisasi nilai pesanan\ndf_merged['order_category'] = pd.cut(\n    df_merged['total_amount'],\n    bins=[0, 100_000, 500_000, float('inf')],\n    labels=['Kecil', 'Menengah', 'Besar']\n)",
        },
      ],
    },
    {
      id: "da-sec-4",
      title: "BAB 4: SQL untuk Analisis Data",
      orderIndex: 4,
      isCompleted: false,
      description: "Keterampilan inti SQL yang wajib dikuasai Data Analyst: Query dasar SELECT, WHERE, ORDER BY, LIMIT, DISTINCT, dan urutan eksekusi logis (FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY). Menggabungkan tabel dengan 4 jenis JOIN (INNER, LEFT, RIGHT, FULL OUTER) dan jebakan filter WHERE pada LEFT JOIN. Agregasi data dengan GROUP BY, agregat fungsi, dan pemfilteran hasil pasca-agregasi menggunakan HAVING. Subquery dan Window Functions tingkat lanjut (RANK, DENSE_RANK, ROW_NUMBER, PARTITION BY, LAG/LEAD untuk analisis MoM/YoY), serta dasar optimasi performa query (Indexing, EXPLAIN ANALYZE, menghindari SELECT *).",
      codeSnippets: [
        {
          id: "da-snip-4-1",
          language: "sql",
          caption: "sql_joins_and_aggregation.sql",
          code: "-- 1. Contoh INNER JOIN vs LEFT JOIN\n-- INNER: hanya order yang customer-nya terdaftar di tabel customers\nSELECT o.order_id, c.customer_name, o.total_amount\nFROM sales.orders o\nINNER JOIN sales.customers c ON o.customer_id = c.customer_id;\n\n-- LEFT: semua customer, termasuk yang belum pernah transaksi (audit retention)\nSELECT c.customer_name, o.order_id, COALESCE(o.total_amount, 0) AS total_amount\nFROM sales.customers c\nLEFT JOIN sales.orders o ON c.customer_id = o.customer_id;\n\n-- 2. Agregasi dengan GROUP BY dan HAVING\nSELECT\n    category,\n    COUNT(*) AS jumlah_order,\n    SUM(total_amount) AS total_revenue,\n    AVG(total_amount) AS rata_rata_order\nFROM sales.orders\nGROUP BY category\nHAVING SUM(total_amount) > 10000000 -- filter setelah agregasi\nORDER BY total_revenue DESC;",
        },
        {
          id: "da-snip-4-2",
          language: "sql",
          caption: "sql_window_functions_and_opt.sql",
          code: "-- Window Function: Ranking customer & Running Total per customer\nSELECT\n    customer_id,\n    order_date,\n    total_amount,\n    RANK() OVER (ORDER BY total_amount DESC) AS ranking_transaksi,\n    SUM(total_amount) OVER (\n        PARTITION BY customer_id ORDER BY order_date\n    ) AS running_total_customer,\n    LAG(total_amount) OVER (\n        PARTITION BY customer_id ORDER BY order_date\n    ) AS transaksi_sebelumnya\nFROM sales.orders;\n\n-- Dasar Optimasi Query: Cek Query Execution Plan dengan EXPLAIN ANALYZE\nEXPLAIN ANALYZE\nSELECT customer_id, SUM(total_amount)\nFROM sales.orders\nWHERE order_date >= '2026-01-01'\nGROUP BY customer_id;",
        },
      ],
    },
    {
      id: "da-sec-5",
      title: "BAB 5: Spreadsheet & Tools Analisis",
      orderIndex: 5,
      isCompleted: false,
      description: "Pemanfaatan Excel dan Google Sheets untuk analisis bisnis ad-hoc dan kolaborasi tim: Kapan memilih spreadsheet vs SQL/Python (batasan ukuran, kecepatan komunikasi), fungsi esensial formula (XLOOKUP modern, INDEX+MATCH fleksibel dua arah, SUMIFS dan COUNTIFS multi-kriteria, IFS logika kondisional), pembuatan Pivot Table interaktif (Rows, Columns, Values, Filters), formula Google Sheets QUERY bergaya SQL, fungsi Dynamic Array modern (FILTER, UNIQUE, SORT), serta pengantar otomasi menggunakan Google Apps Script dan Excel VBA.",
      codeSnippets: [
        {
          id: "da-snip-5-1",
          language: "python",
          caption: "spreadsheet_formulas_reference.txt",
          code: "# Formula Kunci Spreadsheet Modern:\n\n# 1. Mencari harga produk berdasarkan ID (XLOOKUP - Excel 365 & Google Sheets)\n# =XLOOKUP(A2, ProdukID_Range, Harga_Range, \"Tidak ditemukan\")\n\n# 2. Alternatif Universal INDEX+MATCH (kompatibel semua versi Excel & bisa lookup ke kiri)\n# =INDEX(Harga_Range, MATCH(A2, ProdukID_Range, 0))\n\n# 3. Agregasi multi-kondisi (Penjualan Elektronik di Region Jawa)\n# =SUMIFS(TotalPenjualan_Range, Kategori_Range, \"Elektronik\", Region_Range, \"Jawa\")\n\n# 4. Logika Kondisional Bertingkat\n# =IFS(B2>=5000000, \"VIP\", B2>=1000000, \"Reguler\", TRUE, \"Baru\")\n\n# 5. Dynamic Array Filter & Sort (Google Sheets & Excel Modern)\n# =SORT(UNIQUE(FILTER(NamaPelanggan_Range, TotalBelanja_Range > 1000000)), 1, FALSE)\n\n# 6. Google Sheets QUERY sebagai Pivot via Formula:\n# =QUERY(DataPenjualan, \"SELECT Region, SUM(TotalAmount) WHERE Kategori = 'Elektronik' GROUP BY Region ORDER BY SUM(TotalAmount) DESC\", 1)",
        },
      ],
    },
    {
      id: "da-sec-6",
      title: "BAB 6: Pemrograman untuk Data Analyst",
      orderIndex: 6,
      isCompleted: false,
      description: "Bahasa pemrograman utama Data Analyst: Python (Pandas dan NumPy) vs R (Tidyverse dan dplyr). Pemahaman komputasi numerik vectorized NumPy (menghindari perulangan for lambat), manipulasi data tabular Pandas dengan method chaining (.query, .groupby, .agg, .sort_values), penulisan transformasi efisien dengan np.where dibanding apply/lambda, serta tata bahasa manipulasi data naratif di R (operator pipe %>%, filter, select, mutate, summarise, group_by). Kriteria pemilihan Python vs R dalam industri.",
      codeSnippets: [
        {
          id: "da-snip-6-1",
          language: "python",
          caption: "python_numpy_pandas_vectorized.py",
          code: "import numpy as np\nimport pandas as pd\n\n# 1. NumPy Vectorized - jauh lebih cepat dibanding for loop\nharga = np.array([15000, 25000, 120000, 45000])\ndiskon = np.array([0.1, 0.05, 0.2, 0.0])\nharga_final = harga * (1 - diskon)\nprint(f'Total: Rp {harga_final.sum():,.0f} | Rata-rata: Rp {harga_final.mean():,.0f}')\n\n# 2. Pandas Method Chaining Modern (Rapi & Mudah Ditelusuri)\ndf = pd.read_csv('sales_data.csv')\nsummary = (\n    df.query(\"order_status == 'completed'\")\n    .groupby('category', as_index=False)\n    .agg(\n        total_revenue=('total_amount', 'sum'),\n        jumlah_order=('order_id', 'count')\n    )\n    .sort_values('total_revenue', ascending=False)\n)\nprint(summary)\n\n# Transformasi cepat vectorized dengan np.where (hindari df.iterrows()!)\ndf['kategori_nilai'] = np.where(df['total_amount'] > 500000, 'Besar', 'Kecil')",
        },
        {
          id: "da-snip-6-2",
          language: "r",
          caption: "r_tidyverse_pipeline.R",
          code: "# Pipeline R Gaya Tidyverse - Dibaca dari atas ke bawah seperti cerita naratif\n# library(dplyr)\n# library(readr)\n# df <- read_csv('sales_data.csv')\n# summary <- df %>%\n#   filter(order_status == 'completed') %>%\n#   group_by(category) %>%\n#   summarise(\n#     total_revenue = sum(total_amount, na.rm = TRUE),\n#     jumlah_order = n()\n#   ) %>%\n#   arrange(desc(total_revenue))\n# print(summary)",
        },
      ],
    },
    {
      id: "da-sec-7",
      title: "BAB 7: Exploratory Data Analysis (EDA)",
      orderIndex: 7,
      isCompleted: false,
      description: "Metodologi Exploratory Data Analysis sistematis: Analisis Univariate (distribusi, mean, median, skewness, frekuensi kategorikal), Bivariate & Multivariate (pivot table multi-dimensi, crosstab proporsional). Teknik deteksi dan penanganan outlier matematis: Interquartile Range (IQR 1.5x rule) vs Z-Score (|z| > 3), pertimbangan bisnis kapan menghapus outlier vs mempertahankannya sebagai sinyal anomali bernilai tinggi. Analisis korelasi variabel numerik (Pearson linear vs Spearman rank-monotonic), visualisasi correlation heatmap, serta pemahaman jebakan korelasi vs kausalitas.",
      codeSnippets: [
        {
          id: "da-snip-7-1",
          language: "python",
          caption: "eda_univariate_multivariate.py",
          code: "import pandas as pd\nimport seaborn as sns\nimport matplotlib.pyplot as plt\nfrom scipy import stats\n\ndf = pd.read_csv('sales_data.csv')\n\n# 1. Univariate numerik & kategorikal\nprint(df['total_amount'].describe())\nprint(df['category'].value_counts(normalize=True) * 100)\n\n# 2. Multivariate: Rata-rata per Kategori DAN Region sekaligus\npivot = df.pivot_table(index='category', columns='region', values='total_amount', aggfunc='mean')\nprint('\\nMatrix Rata-rata per Kategori x Region:\\n', pivot)\n\n# 3. Deteksi Outlier Metode IQR\nQ1 = df['total_amount'].quantile(0.25)\nQ3 = df['total_amount'].quantile(0.75)\nIQR = Q3 - Q1\nbatas_bawah = Q1 - 1.5 * IQR\nbatas_atas = Q3 + 1.5 * IQR\noutliers = df[(df['total_amount'] < batas_bawah) | (df['total_amount'] > batas_atas)]\nprint(f'Jumlah Outlier IQR: {len(outliers)} ({len(outliers)/len(df)*100:.1f}%)')\n\n# 4. Correlation Matrix & Heatmap\nnumeric_cols = df.select_dtypes(include='number')\ncorr_matrix = numeric_cols.corr(method='pearson')\nsns.heatmap(corr_matrix, annot=True, cmap='coolwarm', center=0)",
        },
      ],
    },
    {
      id: "da-sec-8",
      title: "BAB 8: Visualisasi Data",
      orderIndex: 8,
      isCompleted: false,
      description: "Prinsip desain visualisasi data efektif: Panduan memilih chart yang tepat (Bar untuk perbandingan kategori, Line untuk tren waktu, Histogram/Box plot untuk sebaran, Scatter untuk relasi dua variabel, Stacked Bar untuk komposisi proporsi). Menghindari kesalahan visualisasi umum (efek 3D menyesatkan, chart terlalu penuh warna, sumbu Y tidak dimulai dari 0, pie chart > 5 kategori). Perbandingan ekosistem tools: Matplotlib untuk kontrol penuh, Seaborn untuk statistik cepat, Tableau dan Power BI untuk dashboard interaktif non-teknis. Seni Storytelling with Data: Menyusun alur narasi (Konteks, Temuan, Implikasi, Rekomendasi), merumuskan judul chart berbasis insight, dan memberikan anotasi penunjuk poin krusial.",
      codeSnippets: [
        {
          id: "da-snip-8-1",
          language: "python",
          caption: "matplotlib_seaborn_storytelling.py",
          code: "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\n\ndf = pd.read_csv('sales_data.csv')\nmonthly_rev = df.groupby(pd.to_datetime(df['order_date']).dt.to_period('M'))['total_amount'].sum()\n\n# Visualisasi dengan Judul Insight & Anotasi\nfig, ax = plt.subplots(figsize=(10, 5))\nax.plot(monthly_rev.index.astype(str), monthly_rev.values, marker='o', color='#d62728', lw=2)\n\n# Judul menyatakan insight, bukan sekadar deskripsi teknis chart\nax.set_title('Revenue Turun 18% dalam 3 Bulan Terakhir — Didorong Kategori Elektronik',\n             fontsize=12, fontweight='bold')\n\n# Anotasi penunjuk titik perubahan tren\npeak_idx = 3\nax.annotate('Mulai tren penurunan di sini',\n            xy=(peak_idx, monthly_rev.values[peak_idx]),\n            xytext=(peak_idx - 1.5, monthly_rev.values[peak_idx] * 1.15),\n            arrowprops=dict(arrowstyle='->', color='gray', lw=1.5))\nplt.xticks(rotation=45); plt.ylabel('Total Revenue (Rp)'); plt.tight_layout()",
        },
      ],
    },
    {
      id: "da-sec-9",
      title: "BAB 9: Dashboard & Reporting",
      orderIndex: 9,
      isCompleted: false,
      description: "Prinsip desain dashboard bisnis profesional: Visual Hierarchy (pola baca mata Z-Pattern dan F-Pattern dari kiri atas), Aturan 5 Detik dalam membaca dashboard eksekutif, penempatan KPI Cards di baris atas, konsistensi grid alignment dengan GridSpec, serta prinsip Progressive Disclosure. Teori warna dalam visualisasi: Sequential (skala intensitas bertingkat), Diverging (titik nol bermakna, RdBu/coolwarm), Qualitative (tanpa urutan), dan aksesibilitas untuk pengguna buta warna. Studi kasus dashboard operasional nyata: Executive Dashboard, Financial Dashboard Laba-Rugi (Waterfall Chart), dan Sales & Marketing Funnel Dashboard.",
      codeSnippets: [
        {
          id: "da-snip-9-1",
          language: "python",
          caption: "executive_dashboard_framework.py",
          code: "import matplotlib.pyplot as plt\nimport matplotlib.gridspec as gridspec\nimport pandas as pd\n\n# Kerangka Dashboard Profesional dengan GridSpec (3 baris x 4 kolom)\nfig = plt.figure(figsize=(14, 8))\ngs = gridspec.GridSpec(3, 4, figure=fig, hspace=0.5, wspace=0.4)\n\n# Baris 1: Tiga KPI Card Utama (Kiri Atas sesuai F-Pattern)\nkpi_data = [('Total Revenue', 'Rp 1.2 M', '+8.2%'),\n            ('Total Orders', '4,582', '+3.1%'),\n            ('Conversion Rate', '3.4%', '-0.5%')]\n\nfor i, (label, val, delta) in enumerate(kpi_data):\n    ax = fig.add_subplot(gs[0, i])\n    c_delta = 'green' if delta.startswith('+') else 'red'\n    ax.text(0.5, 0.6, val, ha='center', va='center', fontsize=20, fontweight='bold')\n    ax.text(0.5, 0.3, label, ha='center', va='center', fontsize=11, color='gray')\n    ax.text(0.5, 0.1, delta, ha='center', va='center', fontsize=10, color=c_delta)\n    ax.axis('off'); ax.set_facecolor('#F5F7FA')\n\n# Baris 2-3: Tren 30 Hari (Lebar) & Kontribusi Kategori (Kanan)\nax_tren = fig.add_subplot(gs[1:, :3])\nax_tren.plot(range(30), [1000 + x*20 for x in range(30)], color='steelblue', lw=2)\nax_tren.set_title('Tren Revenue 30 Hari Terakhir', loc='left', fontweight='bold')\n\nax_kat = fig.add_subplot(gs[1:, 3])\nax_kat.barh(['Elektronik', 'Fashion', 'Makanan'], [45, 30, 25], color='coral')\nax_kat.set_title('Kontribusi Kategori', loc='left', fontweight='bold')\nplt.suptitle('Executive Summary Dashboard', fontsize=16, fontweight='bold')",
        },
        {
          id: "da-snip-9-2",
          language: "python",
          caption: "financial_waterfall_pl.py",
          code: "# Waterfall Chart: Dari Revenue hingga Net Profit\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nkategori = ['Revenue', 'COGS', 'Opex', 'Marketing', 'Pajak', 'Net Profit']\nnilai = [1000, -400, -200, -150, -60, 190] # Juta Rupiah\n\nkumulatif = pd.Series(nilai).cumsum()\nmulai = kumulatif.shift(1).fillna(0)\nmulai.iloc[-1] = 0 # bar akhir net profit dari sumbu nol\n\nwarna = ['steelblue'] + ['indianred' if v < 0 else 'seagreen' for v in nilai[1:-1]] + ['steelblue']\n\nfig, ax = plt.subplots(figsize=(9, 4))\nfor i, (kat, v, m, w) in enumerate(zip(kategori, nilai, mulai, warna)):\n    ax.bar(kat, v, bottom=m, color=w, edgecolor='white')\n    ax.text(i, m + v/2, f'{v:+,}', ha='center', va='center', color='white', fontweight='bold')\nax.set_title('Waterfall: Dari Revenue ke Net Profit (Rp Juta)', loc='left', fontweight='bold')\nax.axhline(0, color='black', linewidth=0.8); plt.tight_layout()",
        },
      ],
    },
    {
      id: "da-sec-10",
      title: "BAB 10: AI-Augmented Analytics & Advanced Pandas",
      orderIndex: 10,
      isCompleted: false,
      description: "Modernisasi workflow analitik: Text-to-SQL dengan LLM, AI Assistant untuk drafting query, dan fitur lanjutan Pandas: Method Chaining dengan fungsi kustom .pipe(), penggunaan .assign(), .query(), dan .eval() (komputasi cepat via numexpr), manipulasi kolom bersarang dengan .explode(). Optimasi memori DataFrame skala produksi: Tipe data Categorical (menghemat >90% memori), Nullable Integer (Int64 dengan pd.NA), Sparse Array untuk data dominan nol, fungsi reduksi memori otomatis reduce_memory_usage(), komparasi performa Vectorization vs apply vs loop (100x-500x percepatan), serta strategi Chunk Processing (>20GB) dan multiprocessing dengan Pandarallel.",
      codeSnippets: [
        {
          id: "da-snip-10-1",
          language: "python",
          caption: "method_chaining_and_pipe.py",
          code: "import pandas as pd\n\ndef hapus_outlier_iqr(data, kolom):\n    q1, q3 = data[kolom].quantile([0.25, 0.75])\n    iqr = q3 - q1\n    return data[data[kolom].between(q1 - 1.5*iqr, q3 + 1.5*iqr)]\n\ndef tambah_margin(data):\n    return data.assign(margin=data['revenue'] - data['cost'])\n\n# Alur kerja pipa modular (Chainable & Clean)\n# hasil = (\n#     df.pipe(hapus_outlier_iqr, kolom='revenue')\n#     .pipe(tambah_margin)\n#     .query('margin > 0')\n#     .groupby('kategori')['margin'].mean()\n# )\n\n# Contoh pemecahan data bertipe list dengan .explode()\ndf_produk = pd.DataFrame({'produk': ['Sepatu A', 'Tas B'], 'tags': [['diskon', 'flash-sale'], ['baru', 'diskon']]})\nprint('Exploded Data:\\n', df_produk.explode('tags'))",
        },
        {
          id: "da-snip-10-2",
          language: "python",
          caption: "dataframe_memory_optimization.py",
          code: "import pandas as pd\nimport numpy as np\n\ndef reduce_memory_usage(df: pd.DataFrame) -> pd.DataFrame:\n    \"\"\"Downcast numerik dan konversi teks berulang ke categorical untuk menghemat memori.\"\"\"\n    mem_awal = df.memory_usage(deep=True).sum() / 1024**2\n    for col in df.columns:\n        col_type = df[col].dtype\n        if pd.api.types.is_integer_dtype(col_type):\n            df[col] = pd.to_numeric(df[col], downcast='integer')\n        elif pd.api.types.is_float_dtype(col_type):\n            df[col] = pd.to_numeric(df[col], downcast='float')\n        elif col_type == object:\n            if df[col].nunique() / len(df[col]) < 0.5: # nilai unik < 50%\n                df[col] = df[col].astype('category')\n    mem_akhir = df.memory_usage(deep=True).sum() / 1024**2\n    print(f'Memori: {mem_awal:.2f} MB -> {mem_akhir:.2f} MB (Hemat {(1 - mem_akhir/mem_awal)*100:.1f}%)')\n    return df",
        },
      ],
    },
    {
      id: "da-sec-11",
      title: "BAB 11: Analisis Lanjutan & Komputasi Numerik",
      orderIndex: 11,
      isCompleted: false,
      description: "Teknik komputasi numerik tingkat lanjut dengan NumPy untuk Data Analyst: Fancy indexing 1D & 2D, kondisional vectorized multi-cabang dengan np.where dan np.select (menggantikan percabangan bersarang), arsitektur Generator API modern (np.random.default_rng) untuk keacakan yang reproducible dan thread-safe. Pemahaman mendalam konsep View vs Copy dan dampak Memory Layout (C-order row-major vs Fortran-order column-major pada cache locality). Operasi Universal Functions (ufunc: reduce, accumulate, outer), serta benchmark performa nyata Python murni vs NumPy vs Numba JIT-compiled (@njit). Penerapan Aljabar Linear (Sistem Persamaan Linear Ax=b, Least Squares, SVD) dan studi kasus Image Processing manipulasi matriks 3D.",
      codeSnippets: [
        {
          id: "da-snip-11-1",
          language: "python",
          caption: "numpy_advanced_indexing_generator.py",
          code: "import numpy as np\n\n# 1. np.select untuk kondisional multi-cabang (jauh lebih bersih dari nested if/where)\nrevenue = np.array([120000, 45000, 300000, 8000, 75000])\nkondisi = [revenue >= 200000, revenue >= 100000, revenue >= 50000]\npilihan = ['Sangat Tinggi', 'Tinggi', 'Sedang']\nlabels = np.select(kondisi, pilihan, default='Rendah')\nprint('Label Revenue Multi-Cabang:', labels)\n\n# 2. Generator API modern (NumPy 1.17+)\nrng = np.random.default_rng(seed=42)\nsampel_normal = rng.normal(loc=100, scale=15, size=10)\nsampel_bobot = rng.choice(['Online', 'Toko', 'Reseller'], size=5, p=[0.6, 0.3, 0.1])\nprint('Sampel Berbobot:', sampel_bobot)\n\n# 3. ufunc methods: reduce, accumulate, outer\narr = np.array([1, 4, 9, 16, 25])\nprint('Akumulasi Perkalian:', np.multiply.accumulate(arr))\nprint('Matriks Perbandingan Outer:\\n', np.greater.outer(arr[:3], arr[:3]))",
        },
        {
          id: "da-snip-11-2",
          language: "python",
          caption: "linear_algebra_and_numba_benchmark.py",
          code: "import numpy as np\n\n# Sistem Persamaan Linear: Ax = b\n# 2x + y - z = 1\n# x + 3y + 2z = 8\n# 3x + 2y + 4z = 10\nA = np.array([[2, 1, -1], [1, 3, 2], [3, 2, 4]], dtype=float)\nb = np.array([1, 8, 10], dtype=float)\nx = np.linalg.solve(A, b)\nprint('Solusi Persamaan (x, y, z):', x)\nprint('Verifikasi (A @ x == b):', np.allclose(A @ x, b))\n\n# Catatan Numba (@njit): Mengompilasi loop Python menjadi kode mesin C\n# Untuk komputasi berat 1 juta iterasi, Numba bisa memangkas waktu dari 0.5s menjadi 0.005s (100x lipat)!",
        },
      ],
    },
    {
      id: "da-sec-12",
      title: "BAB 12: Business Acumen, Problem Solving & Decision Making",
      orderIndex: 12,
      isCompleted: false,
      description: "Fondasi konseptual bisnis Data Analytics: Pola pikir Analytical Thinking & Data Thinking (4 tahap berulang: Klarifikasi masalah bisnis, Dekomposisi, Validasi asumsi, Sintesis rekomendasi). 4 Tingkatan Business Analytics (Descriptive, Diagnostic, Predictive, Prescriptive) dan alur Data-Driven Decision Making (Data -> Informasi -> Insight -> Keputusan -> Aksi -> Dampak). Hirarki metrik bisnis: Metric mentah vs Key Performance Indicator (KPI) vs Objective & Key Results (OKR) vs North Star Metric. Model Kematangan Analitik (5 level Analytics Maturity Model). Kerangka kerja proyek: CRISP-DM vs OSEMN (Obtain, Scrub, Explore, Model, iNterpret). Tata kelola data (Data Governance, Privacy UU PDP, Data Ethics, Security), 6 Dimensi Data Quality Framework, teknik Root Cause Analysis (5 Whys, Diagram Fishbone/Ishikawa, Analisis Pareto 80/20), SMART Goal kuantitatif, rumus ROI Analytics, serta jebakan bias berpikir analitis (Survivorship Bias, Cherry Picking, Simpson's Paradox, Analysis Paralysis).",
      codeSnippets: [
        {
          id: "da-snip-12-1",
          language: "python",
          caption: "pareto_80_20_customer_revenue.py",
          code: "import pandas as pd\nimport matplotlib.pyplot as plt\n\n# Simulasi Pareto Analysis (Prinsip 80/20): Mengukur kontribusi pelanggan terhadap revenue\n# revenue_per_customer = df.groupby('customer_id')['revenue'].sum().sort_values(ascending=False)\n# cumulative_pct = revenue_per_customer.cumsum() / revenue_per_customer.sum() * 100\n# n_80 = (cumulative_pct <= 80).sum()\n# print(f'{n_80} dari {len(revenue_per_customer)} customer ({n_80/len(revenue_per_customer)*100:.1f}%) menyumbang 80% revenue!')\n\n# Rumus ROI Inisiatif Analytics:\n# ROI (%) = (Manfaat Finansial - Biaya Inisiatif) / Biaya Inisiatif * 100%\nbiaya_dashboard = 50_000_000   # Rp 50 juta biaya dev\nmanfaat_retensi = 200_000_000  # Rp 200 juta pelanggan diselamatkan\nroi = ((manfaat_retensi - biaya_dashboard) / biaya_dashboard) * 100\nprint(f'Estimasi ROI Inisiatif Dashboard Retensi: {roi:.1f}%')",
        },
      ],
    },
    {
      id: "da-sec-13",
      title: "BAB 13: SQL Lanjutan, CTE & Cohort Analysis",
      orderIndex: 13,
      isCompleted: false,
      description: "Teknik SQL tingkat lanjut untuk analisis bisnis: Komparasi eksekusi RDBMS vs Pandas, logika kondisional langsung di query dengan CASE WHEN untuk segmentasi transaksi pelanggan. Subquery vs Common Table Expressions (CTE klausa WITH) untuk mempermudah pembacaan query modular bertingkat. Window Functions komprehensif: Peringkat data dengan RANK vs DENSE_RANK vs ROW_NUMBER, komparasi antar-periode waktu dengan LAG/LEAD (perubahan MoM/YoY), dan penghitungan Rolling Average (ROWS BETWEEN 2 PRECEDING AND CURRENT ROW). Optimasi query skala besar: Indeks database relasional, analisis query execution plan dengan EXPLAIN ANALYZE. Serta studi kasus bisnis end-to-end: Analisis Kohort (Cohort Retention Analysis) untuk melacak retensi generasi pelanggan lintas bulan transaksi pertama.",
      codeSnippets: [
        {
          id: "da-snip-13-1",
          language: "sql",
          caption: "sql_cte_and_rolling_metrics.sql",
          code: "-- 1. Segmentasi Pelanggan dengan CASE WHEN langsung di SQL\nSELECT\n    customer_id,\n    SUM(revenue) AS total_belanja,\n    CASE\n        WHEN SUM(revenue) >= 10000000 THEN 'Platinum'\n        WHEN SUM(revenue) >= 5000000  THEN 'Gold'\n        WHEN SUM(revenue) >= 1000000  THEN 'Silver'\n        ELSE 'Regular'\n    END AS tingkat_pelanggan\nFROM transaksi\nGROUP BY customer_id;\n\n-- 2. Analisis Perubahan MoM dan Rolling Average 3 Bulan dengan Window Function\nSELECT\n    bulan,\n    revenue,\n    LAG(revenue, 1) OVER (ORDER BY bulan) AS revenue_bulan_lalu,\n    revenue - LAG(revenue, 1) OVER (ORDER BY bulan) AS perubahan_mom,\n    AVG(revenue) OVER (\n        ORDER BY bulan ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n    ) AS rolling_avg_3_bulan\nFROM revenue_bulanan\nORDER BY bulan;",
        },
        {
          id: "da-snip-13-2",
          language: "sql",
          caption: "sql_cohort_retention_analysis.sql",
          code: "-- Cohort Analysis: Retensi Pelanggan per Bulan Akuisisi Pertama Kali\nWITH cohort_pelanggan AS (\n    SELECT\n        customer_id,\n        DATE_TRUNC('month', MIN(tanggal_transaksi)) AS bulan_cohort\n    FROM transaksi\n    GROUP BY customer_id\n),\naktivitas_bulanan AS (\n    SELECT\n        c.bulan_cohort,\n        DATE_TRUNC('month', t.tanggal_transaksi) AS bulan_aktivitas,\n        COUNT(DISTINCT t.customer_id) AS jumlah_pelanggan_aktif\n    FROM transaksi t\n    JOIN cohort_pelanggan c ON t.customer_id = c.customer_id\n    GROUP BY c.bulan_cohort, DATE_TRUNC('month', t.tanggal_transaksi)\n)\nSELECT\n    bulan_cohort,\n    bulan_aktivitas,\n    jumlah_pelanggan_aktif,\n    EXTRACT(MONTH FROM AGE(bulan_aktivitas, bulan_cohort)) AS bulan_ke\nFROM aktivitas_bulanan\nORDER BY bulan_cohort, bulan_aktivitas;\n-- Baris hasil query di atas selanjutnya dapat di-pivot menjadi segitiga retensi (retention triangle)",
        },
      ],
    },
    {
      id: "da-sec-14",
      title: "BAB 14: Studi Kasus End-to-End E-Commerce & Pelanggan",
      orderIndex: 14,
      isCompleted: false,
      description: "Implementasi dua proyek analitik terpadu dunia kerja nyata: (1) E-Commerce Analytics Dashboard End-to-End: simulasi 5.000 transaksi pesanan, feature engineering revenue/diskon/margin/datetime, ringkasan eksekutif KPI (Total Revenue, Total Orders, Average Order Value AOV, Total Profit, Profit Margin), visualisasi 7-panel GridSpec (tren bulanan twinx bar+line, per kategori horizontal bar, pie chart kota, kuartal, tingkat diskon, perbandingan weekday vs weekend, serta heatmap korelasi kota x kategori) beserta rekomendasi strategi aksi bisnis. (2) Segmentasi Pelanggan RFM (Recency, Frequency, Monetary): kalkulasi hari sejak order terakhir, frekuensi belanja, nilai transaksi, scoring quintile 1-5 dengan pd.qcut, klasifikasi segmen pelanggan (Champions, Loyal Customers, New Customers, At Risk, Lost), dan visualisasi sebaran segmen. Dilengkapi Appendix Cheat Sheet lengkap (Pandas, NumPy, Matplotlib, Seaborn), troubleshooting error umum, serta panduan jenjang karir Data Analyst.",
      codeSnippets: [
        {
          id: "da-snip-14-1",
          language: "python",
          caption: "ecommerce_analytics_dashboard_case.py",
          code: "import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport matplotlib.gridspec as gridspec\n\n# Simulasi Data E-Commerce 5.000 Transaksi\nnp.random.seed(42)\nn = 5000\ntanggal = pd.date_range('2024-01-01', '2024-12-31', periods=n)\ndf = pd.DataFrame({\n    'order_id': [f'ORD-{i:05d}' for i in range(n)],\n    'tanggal': tanggal,\n    'kategori': np.random.choice(['Elektronik', 'Fashion', 'Makanan', 'Olahraga'], n),\n    'kota': np.random.choice(['Jakarta', 'Surabaya', 'Bandung', 'Medan'], n),\n    'qty': np.random.randint(1, 10, n),\n    'harga': np.random.lognormal(mean=13, sigma=1.2, size=n).round(-3),\n    'diskon_pct': np.random.choice([0, 5, 10, 15, 20], n)\n})\n\n# Feature Engineering\ndf['revenue'] = df['qty'] * df['harga']\ndf['net_revenue'] = df['revenue'] * (1 - df['diskon_pct']/100)\ndf['profit'] = df['net_revenue'] * np.random.uniform(0.1, 0.35, n)\n\n# Ringkasan Eksekutif KPI\ntotal_rev = df['net_revenue'].sum()\ntotal_order = df['order_id'].nunique()\naov = total_rev / total_order # Average Order Value\nprofit_margin = (df['profit'].sum() / total_rev) * 100\n\nprint('=== KPI EKSEKUTIF E-COMMERCE 2024 ===')\nprint(f'Total Net Revenue: Rp {total_rev:,.0f}')\nprint(f'Total Order      : {total_order:,}')\nprint(f'Average Order Val: Rp {aov:,.0f}')\nprint(f'Profit Margin    : {profit_margin:.1f}%')",
        },
        {
          id: "da-snip-14-2",
          language: "python",
          caption: "rfm_segmentation_case_study.py",
          code: "import pandas as pd\nimport numpy as np\n\n# Menghitung Metrik RFM Pelanggan\n# rfm = transactions.groupby('cust_id').agg(\n#     recency=('order_date', lambda x: (today - x.max()).days),\n#     frequency=('order_id', 'nunique'),\n#     monetary=('revenue', 'sum')\n# ).reset_index()\n\n# Scoring Quintile 1-5\n# rfm['R'] = pd.qcut(rfm['recency'], 5, labels=[5,4,3,2,1]).astype(int)\n# rfm['F'] = pd.qcut(rfm['frequency'].rank(method='first'), 5, labels=[1,2,3,4,5]).astype(int)\n# rfm['M'] = pd.qcut(rfm['monetary'], 5, labels=[1,2,3,4,5]).astype(int)\n\ndef segment_customer(r, f, m):\n    if r >= 4 and f >= 4 and m >= 4: return 'Champions'\n    if r >= 3 and f >= 3 and m >= 3: return 'Loyal Customers'\n    if r >= 4 and f <= 2: return 'New Customers'\n    if r <= 2 and f >= 3: return 'At Risk'\n    if r == 1 and f == 1: return 'Lost'\n    return 'Regular'\n\nprint('Rule Segmentasi RFM Siap Diterapkan untuk Personalisasi Penawaran Bisnis!')",
        },
      ],
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
