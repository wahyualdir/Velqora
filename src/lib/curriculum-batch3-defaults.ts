import { ModuleSection } from "@/types/module-drive";

/**
 * Kurikulum Lengkap: Data Science (16 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getDataScienceSections(): ModuleSection[] {
  return [
    {
      id: "ds-sec-1",
      title: "BAB 1: Pengantar Data Science",
      orderIndex: 1,
      isCompleted: false,
      description: "Definisi & ruang lingkup Data Science, peran Data Scientist dalam organisasi, dan Data Science Life Cycle (CRISP-DM).",
      codeSnippets: [{
        id: "ds-snip-1",
        language: "python",
        caption: "crisp_dm_cycle.py",
        code: "CRISP_DM_PHASES = [\n    \"1. Business Understanding (Memahami objektif & KPI bisnis)\",\n    \"2. Data Understanding (Eksplorasi data mentah & verifikasi kualitas)\",\n    \"3. Data Preparation (Pembersihan, transformasi, & rekayasa fitur)\",\n    \"4. Modeling (Pemilihan & pelatihan algoritma prediktif)\",\n    \"5. Evaluation (Validasi model terhadap metrik keberhasilan bisnis)\",\n    \"6. Deployment (Integrasi model ke lingkungan produksi)\"\n]\nfor phase in CRISP_DM_PHASES:\n    print(f\"[CRISP-DM] {phase}\")",
      }],
    },
    {
      id: "ds-sec-2",
      title: "BAB 2: Fondasi Matematika & Statistika",
      orderIndex: 2,
      isCompleted: false,
      description: "Aljabar linear (vektor, matriks, eigenvalue), kalkulus diferensial untuk gradien, serta probabilitas & statistik inferensial.",
      codeSnippets: [{
        id: "ds-snip-2",
        language: "python",
        caption: "linear_algebra_stats.py",
        code: "import numpy as np\n\n# Perkalian matriks kovariansi dan dekomposisi nilai eigen (PCA dasar)\nX = np.array([[2.5, 2.4], [0.5, 0.7], [2.2, 2.9], [1.9, 2.2], [3.1, 3.0]])\nX_centered = X - np.mean(X, axis=0)\ncov_matrix = np.cov(X_centered, rowvar=False)\neigenvalues, eigenvectors = np.linalg.eig(cov_matrix)\n\nprint(\"Matriks Kovariansi:\\n\", cov_matrix)\nprint(\"Eigenvalues (Varian Terjelaskan):\", eigenvalues)",
      }],
    },
    {
      id: "ds-sec-3",
      title: "BAB 3: Pemrograman untuk Data Science",
      orderIndex: 3,
      isCompleted: false,
      description: "Python analitis (Pandas, NumPy, SciPy), komputasi statistik dengan R, dan version control data science menggunakan Git.",
      codeSnippets: [{
        id: "ds-snip-3",
        language: "python",
        caption: "scientific_stack_demo.py",
        code: "import pandas as pd\nimport numpy as np\nfrom scipy import optimize\n\n# Menemukan minimum fungsi loss numerik\ndef loss_func(w):\n    return (w - 3.5)**2 + 10\n\nres = optimize.minimize(loss_func, x0=[0.0])\nprint(f\"Bobot Optimal w: {res.x[0]:.4f} dengan Minimum Loss: {res.fun:.4f}\")",
      }],
    },
    {
      id: "ds-sec-4",
      title: "BAB 4: Pengumpulan & Pengolahan Data",
      orderIndex: 4,
      isCompleted: false,
      description: "Data wrangling, web scraping etis (BeautifulSoup/Playwright), dan integrasi data heterogen dari API serta database relasional.",
      codeSnippets: [{
        id: "ds-snip-4",
        language: "python",
        caption: "web_scraping_wrangling.py",
        code: "import pandas as pd\n\nraw_records = [\n    {\"source\": \"API_Sales\", \"user\": \"U101\", \"val\": \"150.50\", \"region\": \"ID\"},\n    {\"source\": \"DB_Legacy\", \"user\": \"U102\", \"val\": \"230.00\", \"region\": \"SG\"},\n    {\"source\": \"Web_Scrape\", \"user\": \"U103\", \"val\": \"95.20\", \"region\": \"MY\"}\n]\n\ndf = pd.DataFrame(raw_records)\ndf['val'] = pd.to_numeric(df['val'])\nprint(\"Dataset Gabungan Terpadu:\\n\", df.groupby('region')['val'].sum())",
      }],
    },
    {
      id: "ds-sec-5",
      title: "BAB 5: Exploratory Data Analysis (EDA)",
      orderIndex: 5,
      isCompleted: false,
      description: "Analisis univariat & multivariat, visualisasi data untuk eksplorasi pola tersembunyi, dan deteksi anomali/outlier statistik.",
      codeSnippets: [{
        id: "ds-snip-5",
        language: "python",
        caption: "automated_eda_summary.py",
        code: "import pandas as pd\nimport numpy as np\n\ndef generate_eda_profile(df):\n    summary = {}\n    for col in df.columns:\n        summary[col] = {\n            \"dtype\": str(df[col].dtype),\n            \"missing_pct\": round(df[col].isnull().mean() * 100, 2),\n            \"unique_count\": df[col].nunique()\n        }\n    return pd.DataFrame(summary).T\n\nsample_df = pd.DataFrame({'age': [25, 30, np.nan, 45], 'salary': [5000, 7000, 8000, 150000]})\nprint(\"Profil EDA Dataset:\\n\", generate_eda_profile(sample_df))",
      }],
    },
    {
      id: "ds-sec-6",
      title: "BAB 6: Feature Engineering & Preprocessing",
      orderIndex: 6,
      isCompleted: false,
      description: "Feature selection & extraction, encoding data kategorikal (One-Hot, Target, Binary), serta scaling & normalisasi data.",
      codeSnippets: [{
        id: "ds-snip-6",
        language: "python",
        caption: "feature_preprocessing_pipeline.py",
        code: "from sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.compose import ColumnTransformer\nimport pandas as pd\n\ndata = pd.DataFrame({\n    'umur': [22, 45, 33],\n    'gaji': [6000000, 15000000, 9500000],\n    'kota': ['Jakarta', 'Bandung', 'Surabaya']\n})\n\npreprocessor = ColumnTransformer(transformers=[\n    ('num', StandardScaler(), ['umur', 'gaji']),\n    ('cat', OneHotEncoder(sparse_output=False), ['kota'])\n])\n\ntransformed = preprocessor.fit_transform(data)\nprint(\"Bentuk Matriks Fitur Siap Model:\", transformed.shape)",
      }],
    },
    {
      id: "ds-sec-7",
      title: "BAB 7: Statistical Modeling",
      orderIndex: 7,
      isCompleted: false,
      description: "Regresi linear & logistik, uji hipotesis dalam pemodelan prediktif, dan analisis data runtun waktu (Time Series ARIMA).",
      codeSnippets: [{
        id: "ds-snip-7",
        language: "python",
        caption: "logistic_regression_stats.py",
        code: "import numpy as np\nfrom sklearn.linear_model import LogisticRegression\n\n# Fitur: [Skor_Kredit, Rasio_Hutang], Label: [0: Ditolak, 1: Disetujui]\nX = np.array([[700, 0.2], [580, 0.6], [750, 0.15], [520, 0.8]])\ny = np.array([1, 0, 1, 0])\n\nmodel = LogisticRegression().fit(X, y)\npemohon_baru = np.array([[680, 0.25]])\nprob = model.predict_proba(pemohon_baru)[0][1]\nprint(f\"Probabilitas Kelayakan Kredit: {prob:.2%}\")",
      }],
    },
    {
      id: "ds-sec-8",
      title: "BAB 8: Machine Learning untuk Data Science",
      orderIndex: 8,
      isCompleted: false,
      description: "Supervised & unsupervised learning, model evaluation & validation (ROC-AUC, F1-Score), serta teknik Ensemble Learning (Bagging, Boosting).",
      codeSnippets: [{
        id: "ds-snip-8",
        language: "python",
        caption: "ensemble_xgboost_lightgbm.py",
        code: "from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier\nimport numpy as np\n\nX = np.random.randn(100, 4)\ny = np.random.randint(0, 2, 100)\n\nrf = RandomForestClassifier(n_estimators=50, random_state=42).fit(X, y)\ngb = GradientBoostingClassifier(n_estimators=50, random_state=42).fit(X, y)\n\nprint(\"Akurasi Random Forest:\", round(rf.score(X, y), 3))\nprint(\"Akurasi Gradient Boosting:\", round(gb.score(X, y), 3))",
      }],
    },
    {
      id: "ds-sec-9",
      title: "BAB 9: Deep Learning Dasar untuk Data Science",
      orderIndex: 9,
      isCompleted: false,
      description: "Arsitektur Neural Network dasar (MLP), fungsi aktivasi, dan kapan harus menggunakan Deep Learning vs Machine Learning klasik.",
      codeSnippets: [{
        id: "ds-snip-9",
        language: "python",
        caption: "dl_vs_classical_ml.py",
        code: "def model_selection_heuristic(num_samples, num_features, data_type):\n    if data_type in ['image', 'audio', 'raw_text']:\n        return \"Gunakan Deep Learning (CNN / Transformer) - efektif untuk ekstraksi hierarki fitur non-linear kompleks.\"\n    elif num_samples < 50000 and data_type == 'tabular':\n        return \"Gunakan ML Klasik (XGBoost / LightGBM) - lebih cepat, interpretable, dan hemat sumber daya.\"\n    else:\n        return \"Bandingkan Gradient Boosted Trees dengan TabNet / Deep MLP.\"\n\nprint(model_selection_heuristic(15000, 30, 'tabular'))",
      }],
    },
    {
      id: "ds-sec-10",
      title: "BAB 10: Big Data & Data Engineering Dasar",
      orderIndex: 10,
      isCompleted: false,
      description: "Pengantar ekosistem Big Data, perbandingan SQL vs NoSQL untuk data science, dan komputasi terdistribusi dengan Apache Spark.",
      codeSnippets: [{
        id: "ds-snip-10",
        language: "python",
        caption: "pyspark_ds_pipeline.py",
        code: "print(\"Pipeline Big Data untuk Data Science:\")\nprint(\"1. Data Lake Ingestion (Parquet terkompresi Snappy)\")\nprint(\"2. Pemrosesan Paralel dengan Apache Spark (PySpark DataFrame API)\")\nprint(\"3. Feature Store Ingestion untuk Training & Serving\")\nprint(\"4. Penulisan Output Bersih ke Cloud Data Warehouse (BigQuery/Snowflake)\")",
      }],
    },
    {
      id: "ds-sec-11",
      title: "BAB 11: Generative AI & LLM untuk Data Science",
      orderIndex: 11,
      isCompleted: false,
      description: "Pemanfaatan LLM untuk augmentasi analisis data, text-to-code, automated insight generation, dan integrasi GenAI pada alur kerja data.",
      codeSnippets: [{
        id: "ds-snip-11",
        language: "python",
        caption: "llm_insight_generation.py",
        code: "def generate_ai_insight(metric_name, change_pct):\n    trend = \"peningkatan\" if change_pct > 0 else \"penurunan\"\n    prompt = f\"Metrik {metric_name} mengalami {trend} sebesar {abs(change_pct):.1f}% minggu ini.\"\n    ai_summary = f\"[AI Analisis Insight] {prompt} Perlu investigasi faktor kampanye pemasaran dan retensi pengguna.\"\n    return ai_summary\n\nprint(generate_ai_insight(\"Churn Pelanggan\", -12.4))",
      }],
    },
    {
      id: "ds-sec-12",
      title: "BAB 12: Visualisasi & Komunikasi Data",
      orderIndex: 12,
      isCompleted: false,
      description: "Data storytelling, perancangan dashboard analitik interaktif, dan teknik komunikasi hasil temuan data kepada stakeholder non-teknis.",
      codeSnippets: [{
        id: "ds-snip-12",
        language: "python",
        caption: "data_storytelling_report.py",
        code: "def executive_data_story(kpi_data):\n    return f\"\"\"=== EXECUTIVE DATA STORYTELLING ===\n1. Konteks: Pertumbuhan kuartal ini didorong oleh ekspansi segmen enterprise.\n2. Temuan Kritis: Nilai rata-rata pesanan (AOV) naik 28%, namun waktu konversi melambat 4 hari.\n3. Tindakan Terarah: Optimalkan alur onboarding mandiri untuk memangkas siklus penjualan.\"\"\"\n\nprint(executive_data_story(None))",
      }],
    },
    {
      id: "ds-sec-13",
      title: "BAB 13: Deployment & MLOps Dasar",
      orderIndex: 13,
      isCompleted: false,
      description: "Dasar deployment model machine learning (FastAPI / Docker), monitoring performa model di produksi, dan deteksi model drift.",
      codeSnippets: [{
        id: "ds-snip-13",
        language: "python",
        caption: "fastapi_ml_serving.py",
        code: "# Contoh Endpoint REST API untuk Prediksi Model\n# from fastapi import FastAPI\n# app = FastAPI()\n# @app.post(\"/predict\")\n# def predict(features: list):\n#     prediction = model.predict([features])[0]\n#     return {\"prediction\": int(prediction), \"status\": \"success\"}\n\nprint(\"[MLOps] Model dikemas ke dalam kontainer Docker dan di-deploy via REST/gRPC endpoint.\")",
      }],
    },
    {
      id: "ds-sec-14",
      title: "BAB 14: Ethical Considerations dalam Data Science",
      orderIndex: 14,
      isCompleted: false,
      description: "Etika penggunaan data, kepatuhan privasi pengguna (GDPR / UU PDP), mitigasi bias algoritma, dan prinsip AI fairness.",
      codeSnippets: [{
        id: "ds-snip-14",
        language: "python",
        caption: "fairness_audit_metric.py",
        code: "def check_demographic_parity(acceptance_rate_A, acceptance_rate_B):\n    disparate_impact = acceptance_rate_A / acceptance_rate_B\n    is_fair = 0.8 <= disparate_impact <= 1.25 # Kaidah 80% Four-Fifths Rule\n    return f\"Rasio Dampak Disparate: {disparate_impact:.3f} | Kepatuhan Fairness: {'LULUS' if is_fair else 'TERDETEKSI BIAS'}\"\n\nprint(check_demographic_parity(0.42, 0.48))",
      }],
    },
    {
      id: "ds-sec-15",
      title: "BAB 15: Topik Lanjutan Data Science",
      orderIndex: 15,
      isCompleted: false,
      description: "Causal Inference (menentukan sebab-akibat vs korelasi), desain eksperimen tingkat lanjut (Quasi-Experiments), dan NLP analitik dasar.",
      codeSnippets: [{
        id: "ds-snip-15",
        language: "python",
        caption: "causal_inference_intro.py",
        code: "print(\"Causal Inference vs Korelasi:\")\nprint(\"- Korelasi: 'Pengguna yang membuka fitur X memiliki retensi lebih tinggi.'\")\nprint(\"- Sebab-Akibat (Kausal): 'Apakah fitur X yang menyebabkan kenaikan retensi, ataukah pengguna setia memang lebih aktif mencoba fitur baru?'\")\nprint(\"- Metode: Difference-in-Differences (DiD), Propensity Score Matching (PSM).\")",
      }],
    },
    {
      id: "ds-sec-16",
      title: "BAB 16: Studi Kasus & Proyek",
      orderIndex: 16,
      isCompleted: false,
      description: "Proyek end-to-end: Prediksi churn bisnis, segmentasi perilaku pelanggan bernilai tinggi, dan strategi memenangkan kompetisi Kaggle.",
      codeSnippets: [{
        id: "ds-snip-16",
        language: "python",
        caption: "kaggle_pipeline_template.py",
        code: "def kaggle_workflow_strategy():\n    steps = [\n        \"1. K-Fold Cross Validation Stratified yang kokoh\",\n        \"2. Rekayasa Fitur Agresif (Domain-specific aggregations)\",\n        \"3. Training Model Beragam (LightGBM, CatBoost, XGBoost, Neural Net)\",\n        \"4. Ensembling & Blending Berbobot (Out-of-Fold Stacking)\",\n        \"5. Post-Processing & Threshold Tuning\"\n    ]\n    return \"\\n\".join(steps)\n\nprint(kaggle_workflow_strategy())",
      }],
    },
  ];
}

/**
 * Kurikulum Lengkap: Deep Learning (15 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getDeepLearningSections(): ModuleSection[] {
  return [
    {
      id: "dl-sec-1",
      title: "BAB 1: Fondasi Deep Learning",
      orderIndex: 1,
      isCompleted: false,
      description: "Perbedaan Deep Learning dengan Machine Learning klasik, sejarah perkembangan arsitektur, dan Hierarchical Feature Learning.",
      codeSnippets: [{
        id: "dl-snip-1",
        language: "python",
        caption: "deep_vs_shallow_learning.py",
        code: "print(\"Hierarchical Feature Learning:\")\nprint(\"Layer 1 (Rendah) : Piksel tepi, sudut, tekstur lokal\")\nprint(\"Layer 2 (Menengah): Motif bentuk, komponen objek (mata, roda)\")\nprint(\"Layer 3 (Tinggi)  : Representasi semantik utuh (wajah, mobil, pemandangan)\")",
      }],
    },
    {
      id: "dl-sec-2",
      title: "BAB 2: Neural Network Dasar",
      orderIndex: 2,
      isCompleted: false,
      description: "Perceptron & Multi-Layer Perceptron (MLP), propagasi maju & mundur (Backpropagation), fungsi aktivasi (ReLU, GELU, Sigmoid), dan Computational Graph.",
      codeSnippets: [{
        id: "dl-snip-2",
        language: "python",
        caption: "mlp_backprop_numpy.py",
        code: "import numpy as np\n\n# Perceptron Forward Step dengan Aktivasi ReLU\nX = np.array([[1.0, 2.0]])\nW = np.array([[0.5, -0.6], [0.8, 0.4]])\nb = np.array([0.1, -0.2])\n\nz = np.dot(X, W) + b\na = np.maximum(0, z) # Aktivasi ReLU\nprint(\"Logit (z):\", z)\nprint(\"Aktivasi ReLU (a):\", a)",
      }],
    },
    {
      id: "dl-sec-3",
      title: "BAB 3: Optimisasi Deep Learning",
      orderIndex: 3,
      isCompleted: false,
      description: "Algoritma Gradient Descent (SGD dengan Momentum, AdamW, RMSprop), penyesuaian laju belajar (Learning Rate Scheduling), dan Batch/Layer Normalization.",
      codeSnippets: [{
        id: "dl-snip-3",
        language: "python",
        caption: "adamw_optimizer_step.py",
        code: "import torch\nimport torch.nn as nn\nimport torch.optim as optim\n\nmodel = nn.Linear(10, 2)\noptimizer = optim.AdamW(model.parameters(), lr=0.001, weight_decay=0.01)\nscheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=100)\n\nprint(f\"Optimizer: {type(optimizer).__name__}, Lr Awal: {optimizer.param_groups[0]['lr']}\")",
      }],
    },
    {
      id: "dl-sec-4",
      title: "BAB 4: Regularisasi & Generalisasi",
      orderIndex: 4,
      isCompleted: false,
      description: "Mencegah overfitting: Dropout, Weight Decay (L2 Regularization), Early Stopping, Data Augmentation, dan Label Smoothing.",
      codeSnippets: [{
        id: "dl-snip-4",
        language: "python",
        caption: "regularization_techniques.py",
        code: "import torch\nimport torch.nn as nn\n\nclass RegularizedNet(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.fc1 = nn.Linear(128, 64)\n        self.bn = nn.BatchNorm1d(64)\n        self.dropout = nn.Dropout(p=0.3)\n        self.fc2 = nn.Linear(64, 10)\n\n    def forward(self, x):\n        x = torch.relu(self.bn(self.fc1(x)))\n        x = self.dropout(x)\n        return self.fc2(x)\n\nprint(\"Arsitektur Jaringan dengan Dropout & Batch Normalization:\", RegularizedNet())",
      }],
    },
    {
      id: "dl-sec-5",
      title: "BAB 5: Convolutional Neural Network (CNN)",
      orderIndex: 5,
      isCompleted: false,
      description: "Operasi konvolusi, pooling, receptive field, arsitektur CNN klasik hingga modern (VGG, ResNet, EfficientNet), dan Depthwise Separable Convolution.",
      codeSnippets: [{
        id: "dl-snip-5",
        language: "python",
        caption: "depthwise_separable_conv.py",
        code: "import torch\nimport torch.nn as nn\n\nclass DepthwiseSeparableConv(nn.Module):\n    \"\"\"Blok efisien MobileNet: Memisahkan filtering spasial dan kombinasi kanal\"\"\"\n    def __init__(self, in_c, out_c):\n        super().__init__()\n        self.depthwise = nn.Conv2d(in_c, in_c, kernel_size=3, padding=1, groups=in_c)\n        self.pointwise = nn.Conv2d(in_c, out_c, kernel_size=1)\n\n    def forward(self, x):\n        return self.pointwise(self.depthwise(x))",
      }],
    },
    {
      id: "dl-sec-6",
      title: "BAB 6: Recurrent Neural Network (RNN)",
      orderIndex: 6,
      isCompleted: false,
      description: "Pemodelan data sekuensial: Vanilla RNN, gating mechanism LSTM (Long Short-Term Memory), GRU, dan pemrosesan dua arah (Bidirectional RNN).",
      codeSnippets: [{
        id: "dl-snip-6",
        language: "python",
        caption: "lstm_cell_mechanics.py",
        code: "import torch\nimport torch.nn as nn\n\nlstm = nn.LSTM(input_size=64, hidden_size=128, num_layers=2, batch_first=True, bidirectional=True)\ndummy_input = torch.randn(32, 20, 64) # (batch, seq_len, feature_dim)\noutput, (h_n, c_n) = lstm(dummy_input)\n\nprint(f\"Output Bi-LSTM Shape: {output.shape} (Dimensi fitur x2 arah)\")",
      }],
    },
    {
      id: "dl-sec-7",
      title: "BAB 7: Transformer & Attention",
      orderIndex: 7,
      isCompleted: false,
      description: "Mekanisme Scaled Dot-Product Self-Attention, Multi-Head Attention, arsitektur Transformer Encoder-Decoder, Positional Encoding, dan FlashAttention.",
      codeSnippets: [{
        id: "dl-snip-7",
        language: "python",
        caption: "self_attention_calculation.py",
        code: "import torch\nimport torch.nn.functional as F\n\ndef scaled_dot_product_attention(Q, K, V):\n    d_k = Q.size(-1)\n    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)\n    weights = F.softmax(scores, dim=-1)\n    output = torch.matmul(weights, V)\n    return output, weights\n\nq = torch.randn(1, 4, 16)\noutput, w = scaled_dot_product_attention(q, q, q)\nprint(\"Output Attention Shape:\", output.shape)",
      }],
    },
    {
      id: "dl-sec-8",
      title: "BAB 8: Generative Deep Learning",
      orderIndex: 8,
      isCompleted: false,
      description: "Pemodelan generatif probabilistik: Variational Autoencoder (VAE), Generative Adversarial Network (GAN), Diffusion Model (DDPM), dan Normalizing Flow.",
      codeSnippets: [{
        id: "dl-snip-8",
        language: "python",
        caption: "vae_reparameterization.py",
        code: "import torch\n\ndef reparameterize(mu, logvar):\n    \"\"\"Trik Reparameterisasi VAE agar gradient dapat mengalir mundur\"\"\"\n    std = torch.exp(0.5 * logvar)\n    eps = torch.randn_like(std)\n    return mu + eps * std\n\nmu = torch.zeros(1, 10)\nlogvar = torch.zeros(1, 10)\nz = reparameterize(mu, logvar)\nprint(\"Sampel Vektor Laten z Shape:\", z.shape)",
      }],
    },
    {
      id: "dl-sec-9",
      title: "BAB 9: Self-Supervised & Contrastive Learning",
      orderIndex: 9,
      isCompleted: false,
      description: "Pembelajaran tanpa label: Pretext Tasks, Contrastive Learning (SimCLR, MoCo), Masked Autoencoders (MAE), dan fondasi representasi BERT-style.",
      codeSnippets: [{
        id: "dl-snip-9",
        language: "python",
        caption: "contrastive_loss_simclr.py",
        code: "import torch\nimport torch.nn.functional as F\n\ndef simclr_nt_xent_loss(z_i, z_j, temperature=0.5):\n    # z_i dan z_j adalah representasi dari 2 augmentasi gambar yang sama\n    z_i_norm = F.normalize(z_i, dim=-1)\n    z_j_norm = F.normalize(z_j, dim=-1)\n    sim = torch.sum(z_i_norm * z_j_norm, dim=-1) / temperature\n    loss = -torch.log(torch.exp(sim) / (torch.exp(sim) + 1e-6))\n    return loss.mean()\n\nprint(\"SimCLR Loss Formula siap dieksekusi.\")",
      }],
    },
    {
      id: "dl-sec-10",
      title: "BAB 10: Graph & Geometric Deep Learning",
      orderIndex: 10,
      isCompleted: false,
      description: "Pembelajaran representasi non-Euclidean: Graph Neural Network (GCN, GAT, GraphSAGE), Message Passing Neural Networks, dan Geometric Deep Learning.",
      codeSnippets: [{
        id: "dl-snip-10",
        language: "python",
        caption: "gcn_message_passing.py",
        code: "import numpy as np\n\n# Perkalian Normalized Adjacency Matrix pada GCN\nA = np.array([[1, 1, 0], [1, 1, 1], [0, 1, 1]]) # Matriks ketetanggaan dengan self-loop\nH = np.array([[0.5, 0.2], [0.8, 0.1], [0.3, 0.9]]) # Fitur node\nW = np.array([[0.4, 0.6], [0.7, 0.3]]) # Bobot\n\nH_next = np.maximum(0, np.dot(np.dot(A, H), W))\nprint(\"Fitur Node Layer Berikutnya (GCN):\\n\", H_next)",
      }],
    },
    {
      id: "dl-sec-11",
      title: "BAB 11: Efisiensi Model Deep Learning",
      orderIndex: 11,
      isCompleted: false,
      description: "Kompresi dan optimasi model: Weight Pruning (Struktural vs Tidak Terstruktur), Post-Training Quantization (INT8), dan Knowledge Distillation (Teacher-Student).",
      codeSnippets: [{
        id: "dl-snip-11",
        language: "python",
        caption: "knowledge_distillation_loss.py",
        code: "import torch\nimport torch.nn as nn\nimport torch.nn.functional as F\n\ndef distillation_loss(student_logits, teacher_logits, labels, T=3.0, alpha=0.7):\n    soft_loss = nn.KLDivLoss(reduction=\"batchmean\")(\n        F.log_softmax(student_logits / T, dim=-1),\n        F.softmax(teacher_logits / T, dim=-1)\n    ) * (T * T)\n    hard_loss = F.cross_entropy(student_logits, labels)\n    return alpha * soft_loss + (1.0 - alpha) * hard_loss\n\nprint(\"Fungsi Loss Distilasi Pengetahuan (Teacher -> Student) siap.\")",
      }],
    },
    {
      id: "dl-sec-12",
      title: "BAB 12: Interpretability Deep Learning",
      orderIndex: 12,
      isCompleted: false,
      description: "Transparansi model kotak hitam (Black Box): Saliency Maps, Gradient-weighted Class Activation Mapping (Grad-CAM), dan visualisasi aktivasi fitur.",
      codeSnippets: [{
        id: "dl-snip-12",
        language: "python",
        caption: "gradcam_concept.py",
        code: "def grad_cam_weights(gradients):\n    # Global average pooling atas gradien terhadap feature map\n    weights = gradients.mean(dim=(2, 3), keepdim=True)\n    return weights\n\nprint(\"Grad-CAM: Mengukur kontribusi spasial konvolusi terhadap prediksi kelas tertentu.\")",
      }],
    },
    {
      id: "dl-sec-13",
      title: "BAB 13: Multimodal Deep Learning",
      orderIndex: 13,
      isCompleted: false,
      description: "Penggabungan lintas modalitas (Gambar, Teks, Suara): Early Fusion, Late Fusion, Cross-Attention Fusion, dan arsitektur model visi-bahasa (VLM).",
      codeSnippets: [{
        id: "dl-snip-13",
        language: "python",
        caption: "cross_attention_fusion.py",
        code: "import torch\nimport torch.nn as nn\n\nclass CrossAttentionFusion(nn.Module):\n    def __init__(self, dim):\n        super().__init__()\n        self.mha = nn.MultiheadAttention(embed_dim=dim, num_heads=4, batch_first=True)\n\n    def forward(self, visual_features, text_features):\n        # Teks menjadi Query, Visual menjadi Key & Value\n        fused, _ = self.mha(query=text_features, key=visual_features, value=visual_features)\n        return fused",
      }],
    },
    {
      id: "dl-sec-14",
      title: "BAB 14: Infrastruktur & Framework",
      orderIndex: 14,
      isCompleted: false,
      description: "Ekosistem framework (PyTorch vs TensorFlow), pelatihan terdistribusi (DistributedDataParallel - DDP, FSDP), dan akselerator komputasi GPU/TPU.",
      codeSnippets: [{
        id: "dl-snip-14",
        language: "python",
        caption: "pytorch_ddp_setup.py",
        code: "# Contoh Inisialisasi PyTorch Distributed Data Parallel (DDP)\n# import torch.distributed as dist\n# dist.init_process_group(backend=\"nccl\")\n# model = nn.parallel.DistributedDataParallel(model.to(local_rank), device_ids=[local_rank])\n\nprint(\"Infrastruktur Pelatihan Paralel Skala Multi-GPU (DDP & FSDP) terkonfigurasi.\")",
      }],
    },
    {
      id: "dl-sec-15",
      title: "BAB 15: Proyek & Studi Kasus Deep Learning",
      orderIndex: 15,
      isCompleted: false,
      description: "Implementasi proyek komprehensif: Klasifikasi citra medis, pemodelan sekuens deret waktu, deteksi anomali multi-dimensi, dan model generatif.",
      codeSnippets: [{
        id: "dl-snip-15",
        language: "python",
        caption: "end_to_end_dl_project.py",
        code: "def end_to_end_dl_pipeline():\n    print(\"1. Data Ingestion & Torch Dataset DataLoader dengan augmentasi Albumentations\")\n    print(\"2. Pemilihan Backbone Pretrained (ResNet50 / ConvNeXt) via timm\")\n    print(\"3. Pelatihan Mixed-Precision (FP16/BF16) menggunakan PyTorch AMP\")\n    print(\"4. Early stopping & Checkpoint model dengan bobot loss validasi terbaik\")\n    print(\"5. Ekspor format TorchScript / TensorRT untuk inferensi latensi ultra-rendah\")\n\nend_to_end_dl_pipeline()",
      }],
    },
  ];
}

/**
 * Kurikulum Lengkap: Edge AI & TinyML (12 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getEdgeAiSections(): ModuleSection[] {
  return [
    {
      id: "edge-sec-1",
      title: "BAB 1: Konsep Dasar Edge AI",
      orderIndex: 1,
      isCompleted: false,
      description: "Definisi Edge AI vs Cloud AI, keunggulan privasi data, latensi nol (Zero Latency), ketergantungan konektivitas, dan tantangan sumber daya.",
      codeSnippets: [{
        id: "edge-snip-1",
        language: "python",
        caption: "edge_vs_cloud_latency.py",
        code: "def compare_architecture(edge_proc_ms=8.5, network_rtt_ms=120.0, cloud_proc_ms=5.0):\n    total_cloud = network_rtt_ms + cloud_proc_ms\n    print(f\"Latensi Cloud AI : {total_cloud:.1f} ms (Tergantung koneksi internet)\")\n    print(f\"Latensi Edge AI  : {edge_proc_ms:.1f} ms (Inferensi lokal instan & privat)\")\n\ncompare_architecture()",
      }],
    },
    {
      id: "edge-sec-2",
      title: "BAB 2: Perangkat Keras untuk Edge AI",
      orderIndex: 2,
      isCompleted: false,
      description: "Arsitektur perangkat keras: Mikrokontroler (ARM Cortex-M, ESP32), Single Board Computers (Raspberry Pi), Neural Processing Units (NPU), dan ASIC khusus AI.",
      codeSnippets: [{
        id: "edge-snip-2",
        language: "python",
        caption: "hardware_spec_check.py",
        code: "EDGE_HARDWARE_SPECS = {\n    \"Microcontroller (Cortex-M4)\": {\"RAM\": \"256 KB\", \"Flash\": \"1 MB\", \"Power\": \"mW\"},\n    \"Edge SoC (Raspberry Pi 5)\": {\"RAM\": \"8 GB\", \"Storage\": \"MicroSD/NVMe\", \"Power\": \"15W\"},\n    \"Dedicated NPU (Google Coral)\": {\"Performance\": \"4 TOPS\", \"Power\": \"2W\", \"Interface\": \"USB/M.2\"}\n}\nfor hw, spec in EDGE_HARDWARE_SPECS.items():\n    print(f\"[{hw}] -> {spec}\")",
      }],
    },
    {
      id: "edge-sec-3",
      title: "BAB 3: Optimisasi Model untuk Edge",
      orderIndex: 3,
      isCompleted: false,
      description: "Teknik kompresi model untuk perangkat terbatas: Post-Training Quantization (PTQ vs QAT), structured pruning, dan Knowledge Distillation.",
      codeSnippets: [{
        id: "edge-snip-3",
        language: "python",
        caption: "int8_quantization_concept.py",
        code: "import numpy as np\n\ndef quantize_float_to_int8(weights_float32):\n    # Mapping float32 [-max, max] ke int8 [-128, 127]\n    scale = np.max(np.abs(weights_float32)) / 127.0\n    weights_int8 = np.round(weights_float32 / scale).astype(np.int8)\n    return weights_int8, scale\n\nweights = np.array([-0.85, 0.12, 0.45, -0.10, 0.99], dtype=np.float32)\nq_weights, s = quantize_float_to_int8(weights)\nprint(\"Bobot Asli (Float32):\", weights)\nprint(\"Bobot Kuantisasi (Int8):\", q_weights, f\"Scale: {s:.4f}\")",
      }],
    },
    {
      id: "edge-sec-4",
      title: "BAB 4: Framework TinyML",
      orderIndex: 4,
      isCompleted: false,
      description: "Framework inferensi perangkat mikro: TensorFlow Lite (TFLite), TensorFlow Lite for Microcontrollers (TFLM), Edge Impulse, dan ONNX Runtime Mobile.",
      codeSnippets: [{
        id: "edge-snip-4",
        language: "python",
        caption: "tflite_converter_flow.py",
        code: "# Contoh konversi model Keras ke format TFLite terkuantisasi\n# converter = tf.lite.TFLiteConverter.from_keras_model(model)\n# converter.optimizations = [tf.lite.Optimize.DEFAULT]\n# tflite_quant_model = converter.convert()\n\nprint(\"[TinyML] Model berhasil dikonversi ke format flatbuffer .tflite untuk mikroprosesor.\")",
      }],
    },
    {
      id: "edge-sec-5",
      title: "BAB 5: Deployment Model di Edge Device",
      orderIndex: 5,
      isCompleted: false,
      description: "Konversi model ke format biner edge, pengelolaan memori SRAM yang ketat, dan manajemen konsumsi daya komputasi.",
      codeSnippets: [{
        id: "edge-snip-5",
        language: "python",
        caption: "tflm_tensor_arena.c",
        code: "/* Contoh C++ Tensor Arena untuk TensorFlow Lite Micro */\n// constexpr int kTensorArenaSize = 30 * 1024; // 30 KB SRAM\n// uint8_t tensor_arena[kTensorArenaSize];\n// tflite::MicroInterpreter interpreter(model, resolver, tensor_arena, kTensorArenaSize);",
      }],
    },
    {
      id: "edge-sec-6",
      title: "BAB 6: TinyML untuk IoT",
      orderIndex: 6,
      isCompleted: false,
      description: "Integrasi TinyML dengan sensor IoT: Akselerometer untuk deteksi getaran mesin, mikrofon untuk keyword spotting (wake-word), dan inferensi real-time.",
      codeSnippets: [{
        id: "edge-snip-6",
        language: "python",
        caption: "sensor_sampling_inference.py",
        code: "def process_accelerometer_stream(sensor_buffer):\n    # Buffer 3-axis accelerometer (x, y, z) 50 Hz\n    rms_vibration = sum([x**2 for x in sensor_buffer]) / len(sensor_buffer)\n    if rms_vibration > 15.0:\n        return \"ANOMALI: Kerusakan bearing mekanik terdeteksi!\"\n    return \"STATUS: Normal\"\n\nprint(process_accelerometer_stream([2.1, 1.9, 2.0, 2.4, 18.2, 19.5]))",
      }],
    },
    {
      id: "edge-sec-7",
      title: "BAB 7: Federated Learning di Edge",
      orderIndex: 7,
      isCompleted: false,
      description: "Pembelajaran mesin terdesentralisasi: Pelatihan model lokal pada perangkat pengguna, pertukaran bobot terenkripsi, dan FedAvg (Federated Averaging).",
      codeSnippets: [{
        id: "edge-snip-7",
        language: "python",
        caption: "fedavg_aggregation.py",
        code: "import numpy as np\n\ndef federated_averaging(client_weights, sample_sizes):\n    total_samples = sum(sample_sizes)\n    global_weights = np.zeros_like(client_weights[0])\n    for w, n in zip(client_weights, sample_sizes):\n        global_weights += w * (n / total_samples)\n    return global_weights\n\nc1 = np.array([1.2, 0.8])\nc2 = np.array([1.4, 0.9])\nprint(\"Bobot Agregasi Global Federated Learning:\", federated_averaging([c1, c2], [100, 200]))",
      }],
    },
    {
      id: "edge-sec-8",
      title: "BAB 8: On-Device LLM & Small Language Model",
      orderIndex: 8,
      isCompleted: false,
      description: "Penerapan Small Language Model (SLM: Phi-3, Gemma-2B, Llama-3-1B), teknik 4-bit quantization (GGUF/AWQ), dan inferensi lokal pada smartphone/PC.",
      codeSnippets: [{
        id: "edge-snip-8",
        language: "python",
        caption: "llm_edge_quant_gguf.py",
        code: "print(\"Arsitektur On-Device SLM:\")\nprint(\"- Model Base     : Phi-3 Mini (3.8B) / Llama-3.2 (1B/3B)\")\nprint(\"- Format Runtime : GGUF via llama.cpp / MLC-LLM\")\nprint(\"- Kuantisasi     : Q4_K_M (Bobot 4-bit, memori RAM < 2.5 GB)\")\nprint(\"- Akselerator    : Apple Metal / Qualcomm NPU / Vulkan GPU\")",
      }],
    },
    {
      id: "edge-sec-9",
      title: "BAB 9: Evaluasi Model Edge AI",
      orderIndex: 9,
      isCompleted: false,
      description: "Trade-off multidimensi: Akurasi vs Latensi Inferensi (ms) vs Konsumsi Daya Baterai (milliwatt) vs Ukuran Memori Flash/SRAM.",
      codeSnippets: [{
        id: "edge-snip-9",
        language: "python",
        caption: "edge_benchmark_metrics.py",
        code: "def calculate_edge_efficiency(accuracy, latency_ms, power_mw, memory_kb):\n    score = (accuracy * 1000) / (latency_ms * (power_mw / 100) * (memory_kb / 1024))\n    return round(score, 3)\n\nprint(\"Skor Efisiensi Edge Model:\", calculate_edge_efficiency(0.92, 15.0, 350.0, 250))",
      }],
    },
    {
      id: "edge-sec-10",
      title: "BAB 10: Keamanan Edge AI",
      orderIndex: 10,
      isCompleted: false,
      description: "Proteksi model di perangkat fisik: Anti-tampering, enkripsi bobot model, pencegahan reverse engineering, dan pengamanan antarmuka JTAG/UART.",
      codeSnippets: [{
        id: "edge-snip-10",
        language: "python",
        caption: "model_integrity_hash.py",
        code: "import hashlib\n\ndef verify_model_firmware(model_binary, expected_sha256):\n    actual_hash = hashlib.sha256(model_binary).hexdigest()\n    if actual_hash == expected_sha256:\n        return \"VALID: Integritas model terverifikasi aman dieksekusi di NPU.\"\n    return \"PERINGATAN: Integritas model rusak atau telah dimodifikasi (Tampered)!\"\n\nprint(verify_model_firmware(b\"model_weights_dummy\", \"3f...\"))",
      }],
    },
    {
      id: "edge-sec-11",
      title: "BAB 11: Manajemen Daya & Efisiensi Energi",
      orderIndex: 11,
      isCompleted: false,
      description: "Teknik hemat daya komputasi: Duty Cycling (Deep Sleep), Event-driven Wakeup (Interupsi sensor), dan Dynamic Voltage and Frequency Scaling (DVFS).",
      codeSnippets: [{
        id: "edge-snip-11",
        language: "python",
        caption: "duty_cycling_strategy.py",
        code: "def calculate_battery_life_days(sleep_current_ua=5.0, active_current_ma=25.0, active_time_sec_per_hour=10.0, batt_capacity_mah=1200):\n    avg_current_ma = ((active_current_ma * active_time_sec_per_hour) + (sleep_current_ua / 1000 * (3600 - active_time_sec_per_hour))) / 3600\n    hours = batt_capacity_mah / avg_current_ma\n    return round(hours / 24, 1)\n\nprint(f\"Estimasi Masa Hidup Baterai Sensor IoT: {calculate_battery_life_days()} hari\")",
      }],
    },
    {
      id: "edge-sec-12",
      title: "BAB 12: Aplikasi Edge AI & TinyML",
      orderIndex: 12,
      isCompleted: false,
      description: "Studi kasus industri: Wearable health monitor (deteksi aritmia ECG), Smart City kamera pengawas cerdas, dan Predictive Maintenance pabrik.",
      codeSnippets: [{
        id: "edge-snip-12",
        language: "python",
        caption: "predictive_maintenance_edge.py",
        code: "def edge_motor_health_monitor(temp_celsius, vibration_g):\n    if temp_celsius > 85.0 and vibration_g > 3.5:\n        return \"KRITIS: Segera matikan motor induksi untuk mencegah breakdown!\"\n    elif vibration_g > 2.0:\n        return \"WASPADAI: Jadwalkan pelumasan bearing rutin.\"\n    return \"NORMAL: Motor beroperasi dalam batas aman.\"\n\nprint(\"Status Mesin Pabrik:\", edge_motor_health_monitor(88.0, 4.1))",
      }],
    },
  ];
}

/**
 * Kurikulum Lengkap: Expert System (9 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getExpertSystemSections(): ModuleSection[] {
  return [
    {
      id: "es-sec-1",
      title: "BAB 1: Konsep Dasar Expert System",
      orderIndex: 1,
      isCompleted: false,
      description: "Definisi & karakteristik Expert System, perbandingan dengan sistem konvensional prosedural, dan arsitektur komponen utama.",
      codeSnippets: [{
        id: "es-snip-1",
        language: "python",
        caption: "expert_system_architecture.py",
        code: "EXPERT_SYSTEM_COMPONENTS = {\n    \"Knowledge Base\": \"Repositori fakta dan aturan (IF-THEN rules) dari pakar domain\",\n    \"Inference Engine\": \"Mekanisme penalaran deduktif (Forward/Backward Chaining)\",\n    \"Working Memory\": \"Basis data dinamis menyimpan fakta kondisi saat ini\",\n    \"Explanation Facility\": \"Modul transparansi yang menjelaskan 'Mengapa' dan 'Bagaimana' keputusan diambil\",\n    \"User Interface\": \"Antarmuka konsultasi interaktif dengan pengguna\"\n}\nfor comp, desc in EXPERT_SYSTEM_COMPONENTS.items():\n    print(f\"[{comp}] : {desc}\")",
      }],
    },
    {
      id: "es-sec-2",
      title: "BAB 2: Knowledge Base",
      orderIndex: 2,
      isCompleted: false,
      description: "Akuisisi pengetahuan dari pakar (Knowledge Acquisition), representasi pengetahuan (Semantic Network, Frame, Rule Base), dan ontologi (OWL).",
      codeSnippets: [{
        id: "es-snip-2",
        language: "python",
        caption: "rule_base_representation.py",
        code: "rules = [\n    {\"id\": \"R1\", \"if\": [\"demam\", \"batuk\"], \"then\": \"infeksi_saluran_napas\"},\n    {\"id\": \"R2\", \"if\": [\"infeksi_saluran_napas\", \"sesak_napas\"], \"then\": \"rujuk_ke_rumah_sakit\"},\n    {\"id\": \"R3\", \"if\": [\"infeksi_saluran_napas\", \"tanpa_sesak\"], \"then\": \"istirahat_dan_obat_gejala\"}\n]\nprint(f\"Jumlah Aturan dalam Knowledge Base: {len(rules)}\")",
      }],
    },
    {
      id: "es-sec-3",
      title: "BAB 3: Inference Engine",
      orderIndex: 3,
      isCompleted: false,
      description: "Mekanisme inferensi: Forward Chaining (Data-Driven), Backward Chaining (Goal-Driven), Hybrid Chaining, dan Conflict Resolution Strategy.",
      codeSnippets: [{
        id: "es-snip-3",
        language: "python",
        caption: "forward_chaining_engine.py",
        code: "def forward_chaining(known_facts, rules):\n    facts = set(known_facts)\n    added_new = True\n    while added_new:\n        added_new = False\n        for r in rules:\n            if r[\"then\"] not in facts:\n                if all(cond in facts for cond in r[\"if\"]):\n                    facts.add(r[\"then\"])\n                    print(f\"Aturan {r['id']} FIRED! Fakta baru ditambahkan: {r['then']}\")\n                    added_new = True\n    return facts\n\ninitial_facts = [\"demam\", \"batuk\", \"sesak_napas\"]\nfinal_facts = forward_chaining(initial_facts, [\n    {\"id\": \"R1\", \"if\": [\"demam\", \"batuk\"], \"then\": \"infeksi_saluran_napas\"},\n    {\"id\": \"R2\", \"if\": [\"infeksi_saluran_napas\", \"sesak_napas\"], \"then\": \"rujuk_ke_rumah_sakit\"}\n])\nprint(\"Fakta Akhir Terbukti:\", final_facts)",
      }],
    },
    {
      id: "es-sec-4",
      title: "BAB 4: Ketidakpastian dalam Expert System",
      orderIndex: 4,
      isCompleted: false,
      description: "Menangani ketidakpastian: Teori Certainty Factor (CF = MB - MD), Teori Dempster-Shafer, Fuzzy Expert System, dan Bayesian Belief Networks.",
      codeSnippets: [{
        id: "es-snip-4",
        language: "python",
        caption: "certainty_factor_calc.py",
        code: "def combine_cf(cf1, cf2):\n    \"\"\"Kombinasi 2 bukti independen untuk hipotesis yang sama\"\"\"\n    if cf1 >= 0 and cf2 >= 0:\n        return cf1 + cf2 * (1.0 - cf1)\n    elif cf1 <= 0 and cf2 <= 0:\n        return cf1 + cf2 * (1.0 + cf1)\n    else:\n        return (cf1 + cf2) / (1.0 - min(abs(cf1), abs(cf2)))\n\ncf_pakar1 = 0.60\ncf_pakar2 = 0.50\ncf_kombinasi = combine_cf(cf_pakar1, cf_pakar2)\nprint(f\"Certainty Factor Gabungan: {cf_kombinasi:.2f} ({cf_kombinasi*100:.0f}% keyakinan)\")",
      }],
    },
    {
      id: "es-sec-5",
      title: "BAB 5: Metode Penalaran",
      orderIndex: 5,
      isCompleted: false,
      description: "Metode penalaran: Rule-Based Reasoning (RBR), Case-Based Reasoning (CBR: Retrieve, Reuse, Revise, Retain), dan Model-Based Reasoning.",
      codeSnippets: [{
        id: "es-snip-5",
        language: "python",
        caption: "case_based_reasoning.py",
        code: "cases_db = [\n    {\"id\": 1, \"symptoms\": [\"baterai_cepat_habis\", \"panas\"], \"solution\": \"ganti_baterai\"},\n    {\"id\": 2, \"symptoms\": [\"layar_gelap\", \"suara_ada\"], \"solution\": \"ganti_lcd_backlight\"}\n]\n\ndef cbr_retrieve(current_symptoms):\n    best_case = max(cases_db, key=lambda c: len(set(current_symptoms).intersection(set(c[\"symptoms\"]))))\n    return best_case\n\nprint(\"Solusi Kasus Paling Mirip:\", cbr_retrieve([\"baterai_cepat_habis\", \"panas\"]))",
      }],
    },
    {
      id: "es-sec-6",
      title: "BAB 6: Perancangan Expert System",
      orderIndex: 6,
      isCompleted: false,
      description: "Tahapan rekayasa pengetahuan (Knowledge Engineering), perancangan fasilitas penjelasan (Explanation Facility), serta validasi & verifikasi sistem.",
      codeSnippets: [{
        id: "es-snip-6",
        language: "python",
        caption: "explanation_facility.py",
        code: "class ExplanationFacility:\n    def __init__(self):\n        self.reasoning_trace = []\n\n    def log_rule(self, rule_id, rationale):\n        self.reasoning_trace.append(f\"Aturan {rule_id}: {rationale}\")\n\n    def explain(self):\n        return \"\\n\".join(self.reasoning_trace)\n\nexp = ExplanationFacility()\nexp.log_rule(\"R12\", \"Karena tekanan oli < 10 psi, pompa oli dimatikan.\")\nprint(\"Fasilitas Penjelasan (Mengapa Sistem Mengambil Keputusan):\\n\", exp.explain())",
      }],
    },
    {
      id: "es-sec-7",
      title: "BAB 7: Tools & Shell Expert System",
      orderIndex: 7,
      isCompleted: false,
      description: "Ekosistem pengembangan: Expert System Shell (CLIPS, Drools), bahasa pemrograman deklaratif Prolog, dan rule engine Python (Experta/pyknow).",
      codeSnippets: [{
        id: "es-snip-7",
        language: "python",
        caption: "clips_prolog_syntax.pl",
        code: "% Contoh Sintaks Deklaratif Bahasa Prolog\n% Fakta:\ngejala(pasien1, pusing).\ngejala(pasien1, mual).\n\n% Aturan Inferensi:\nterdiagnosis(Pasien, migrain) :- \n    gejala(Pasien, pusing), \n    gejala(Pasien, mual).",
      }],
    },
    {
      id: "es-sec-8",
      title: "BAB 8: Integrasi dengan AI Modern",
      orderIndex: 8,
      isCompleted: false,
      description: "Sistem pakar hibrida: Menggabungkan Rule-Based Expert System dengan model Machine Learning dan LLM sebagai Knowledge Extractor otomatis.",
      codeSnippets: [{
        id: "es-snip-8",
        language: "python",
        caption: "neuro_symbolic_expert.py",
        code: "def neuro_symbolic_decision(sensor_raw, ml_model, rule_engine):\n    # 1. Neural Net: Deteksi pola data persepsi mentah\n    detected_class = ml_model.predict(sensor_raw)\n    # 2. Symbolic Rules: Verifikasi batas regulasi dan logika bisnis mutlak\n    decision = rule_engine.enforce_policy(detected_class)\n    return decision\n\nprint(\"Arsitektur Neuro-Symbolic: Keakuratan representasi persepsi + kepatuhan aturan hukum.\")",
      }],
    },
    {
      id: "es-sec-9",
      title: "BAB 9: Studi Kasus & Aplikasi",
      orderIndex: 9,
      isCompleted: false,
      description: "Aplikasi nyata: Diagnosis medis klinis (MYCIN style), troubleshooting kerusakan perangkat keras, analisis kepatuhan pajak, dan sistem rekomendasi bisnis.",
      codeSnippets: [{
        id: "es-snip-9",
        language: "python",
        caption: "fault_diagnosis_system.py",
        code: "def troubleshoot_network(ping_gateway, dns_resolved):\n    if not ping_gateway:\n        return \"Diagnosa: Kabel fisik LAN terputus atau Router gateway down.\"\n    elif not dns_resolved:\n        return \"Diagnosa: Koneksi lokal normal, namun Server DNS mengalami kendala.\"\n    return \"Diagnosa: Jaringan internet beroperasi optimal.\"\n\nprint(troubleshoot_network(True, False))",
      }],
    },
  ];
}

/**
 * Kurikulum Lengkap: Generative AI (14 Bab)
 * Kurikulum & Praktikum AI — Edisi Diperluas
 */
export function getGenerativeAiSections(): ModuleSection[] {
  return [
    {
      id: "genai-sec-1",
      title: "BAB 1: Konsep Dasar Generative AI",
      orderIndex: 1,
      isCompleted: false,
      description: "Generative vs Discriminative Model, pemodelan distribusi probabilitas data p(x) vs p(y|x), dan evolusi Generative AI.",
      codeSnippets: [{
        id: "genai-snip-1",
        language: "python",
        caption: "generative_vs_discriminative.py",
        code: "print(\"Perbedaan Model Generatif vs Diskriminatif:\")\nprint(\"- Model Diskriminatif (Klasifikasi): Mempelajari p(Y|X) - 'Apakah gambar ini anjing atau kucing?'\")\nprint(\"- Model Generatif (Sintesis)      : Mempelajari p(X) atau p(X|Y) - 'Buatkan gambar anjing baru yang belum pernah ada!'\")",
      }],
    },
    {
      id: "genai-sec-2",
      title: "BAB 2: Variational Autoencoder (VAE)",
      orderIndex: 2,
      isCompleted: false,
      description: "Arsitektur Encoder-Decoder probabilistik, manifold ruang laten kontinu (Latent Space), dan fungsi loss kombinasi Rekonstruksi + KL Divergence.",
      codeSnippets: [{
        id: "genai-snip-2",
        language: "python",
        caption: "vae_loss_formulation.py",
        code: "import torch\nimport torch.nn.functional as F\n\ndef vae_loss(recon_x, x, mu, logvar):\n    # Reconstruction loss (BCE atau MSE)\n    recon_loss = F.binary_cross_entropy(recon_x, x, reduction=\"sum\")\n    # KL Divergence: Mengatur ruang laten agar mengikuti distribusi Gaussian N(0, 1)\n    kld_loss = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())\n    return recon_loss + kld_loss",
      }],
    },
    {
      id: "genai-sec-3",
      title: "BAB 3: Generative Adversarial Network (GAN)",
      orderIndex: 3,
      isCompleted: false,
      description: "Paradigma Zero-Sum Game Generator vs Discriminator, variasi arsitektur (DCGAN, StyleGAN, CycleGAN), dan tantangan training (Mode Collapse).",
      codeSnippets: [{
        id: "genai-snip-3",
        language: "python",
        caption: "dcgan_generator_pytorch.py",
        code: "import torch\nimport torch.nn as nn\n\nclass DCGANGenerator(nn.Module):\n    def __init__(self, nz=100, ngf=64, nc=3):\n        super().__init__()\n        self.main = nn.Sequential(\n            nn.ConvTranspose2d(nz, ngf * 8, 4, 1, 0, bias=False),\n            nn.BatchNorm2d(ngf * 8),\n            nn.ReLU(True),\n            nn.ConvTranspose2d(ngf * 8, nc, 4, 2, 1, bias=False),\n            nn.Tanh()\n        )\n    def forward(self, x):\n        return self.main(x)",
      }],
    },
    {
      id: "genai-sec-4",
      title: "BAB 4: Diffusion Model",
      orderIndex: 4,
      isCompleted: false,
      description: "Proses difusi maju (Forward Markov Chain) & mundur (Reverse Denoising), Denoising Diffusion Probabilistic Model (DDPM), dan Latent Diffusion (Stable Diffusion).",
      codeSnippets: [{
        id: "genai-snip-4",
        language: "python",
        caption: "forward_diffusion_noise.py",
        code: "import torch\n\ndef add_noise_forward_diffusion(x_0, t, alpha_cumprod):\n    # Menambahkan noise gaussian pada citra x_0 pada timestep t\n    noise = torch.randn_like(x_0)\n    sqrt_alpha = torch.sqrt(alpha_cumprod[t])\n    sqrt_one_minus_alpha = torch.sqrt(1.0 - alpha_cumprod[t])\n    return sqrt_alpha * x_0 + sqrt_one_minus_alpha * noise, noise",
      }],
    },
    {
      id: "genai-sec-5",
      title: "BAB 5: Consistency Model & Percepatan Sampling",
      orderIndex: 5,
      isCompleted: false,
      description: "Akselerasi inferensi model difusi: Consistency Models, Distilled Diffusion (LCM - Latent Consistency Models), dan sampling 1-4 step.",
      codeSnippets: [{
        id: "genai-snip-5",
        language: "python",
        caption: "consistency_sampling_steps.py",
        code: "print(\"Evolusi Waktu Sampling Difusi:\")\nprint(\"- DDPM Standar      : 1000 sampling steps\")\nprint(\"- DDIM / DPM-Solver : 25 - 50 sampling steps\")\nprint(\"- Latent Consistency: 2 - 4 sampling steps (Real-time generation!)\")",
      }],
    },
    {
      id: "genai-sec-6",
      title: "BAB 6: Text-to-Image Generation",
      orderIndex: 6,
      isCompleted: false,
      description: "Sintesis gambar dari teks (DALL-E, Midjourney, Stable Diffusion XL), teknik Prompt Engineering visual, dan kontrol spasial dengan ControlNet.",
      codeSnippets: [{
        id: "genai-snip-6",
        language: "python",
        caption: "prompt_controlnet_pipeline.py",
        code: "print(\"Pipeline Text-to-Image Modern:\")\nprint(\"1. Text Conditioning: Text Encoder (CLIP/T5) mengubah prompt ke vektor embedding\")\nprint(\"2. Spatial Conditioning: ControlNet menginjeksi panduan pose/canny edge\")\nprint(\"3. Latent Denoising: UNet / Diffusion Transformer (DiT) membersihkan laten\")\nprint(\"4. VAE Decoder: Merekonstruksi matriks piksel RGB resolusi tinggi\")",
      }],
    },
    {
      id: "genai-sec-7",
      title: "BAB 7: Text-to-Video Generation & World Model",
      orderIndex: 7,
      isCompleted: false,
      description: "Generasi video (Sora, Runway Gen-3, Pika), konsistensi koherensi temporal, 3D Spatio-Temporal Patches, dan konsep World Model simulasi fisika.",
      codeSnippets: [{
        id: "genai-snip-7",
        language: "python",
        caption: "temporal_coherence_check.py",
        code: "def evaluate_temporal_consistency(frame_t, frame_t_next):\n    # Evaluasi perbedaan flow optik antar frame agar video tidak flicker\n    return \"Konsistensi Temporal: Stabil (Motion Flow terhubung mulus)\"\n\nprint(evaluate_temporal_consistency(None, None))",
      }],
    },
    {
      id: "genai-sec-8",
      title: "BAB 8: Text-to-3D & Avatar Generation",
      orderIndex: 8,
      isCompleted: false,
      description: "Sintesis aset 3D (Point-E, Shap-E, Gaussian Splatting), representasi Neural Avatar, dan pembuatan aset digital untuk game serta metaverse.",
      codeSnippets: [{
        id: "genai-snip-8",
        language: "python",
        caption: "text_to_3d_nerf_guidance.py",
        code: "print(\"Score Distillation Sampling (SDS) untuk Text-to-3D:\")\nprint(\"Menggunakan model difusi 2D sebagai 'pemandu' gradien loss\")\nprint(\"untuk mengoptimalkan representasi 3D NeRF atau Gaussian Splatting.\")",
      }],
    },
    {
      id: "genai-sec-9",
      title: "BAB 9: Generative Model untuk Teks",
      orderIndex: 9,
      isCompleted: false,
      description: "Model bahasa generatif Autoregressive (GPT), strategi sampling decoding: Greedy, Temperature, Top-K, Top-P (Nucleus Sampling), dan Repetition Penalty.",
      codeSnippets: [{
        id: "genai-snip-9",
        language: "python",
        caption: "text_sampling_strategies.py",
        code: "import torch\nimport torch.nn.functional as F\n\ndef sample_with_temperature_and_top_p(logits, temperature=0.7, top_p=0.9):\n    logits = logits / temperature\n    probs = F.softmax(logits, dim=-1)\n    sorted_probs, indices = torch.sort(probs, descending=True)\n    cumulative_probs = torch.cumsum(sorted_probs, dim=-1)\n    # Masking token di luar ambang batas top_p\n    mask = cumulative_probs > top_p\n    mask[..., 1:] = mask[..., :-1].clone()\n    mask[..., 0] = False\n    sorted_probs[mask] = 0.0\n    return torch.multinomial(sorted_probs / sorted_probs.sum(), num_samples=1)",
      }],
    },
    {
      id: "genai-sec-10",
      title: "BAB 10: Generative Model untuk Audio & Musik",
      orderIndex: 10,
      isCompleted: false,
      description: "Sintesis suara dan audio: Text-to-Speech berbasis neural (VITS, ElevenLabs), voice cloning, dan text-to-music generation (MusicLM, Suno).",
      codeSnippets: [{
        id: "genai-snip-10",
        language: "python",
        caption: "neural_tts_audio_synthesis.py",
        code: "print(\"Pipeline Neural Audio Synthesis:\")\nprint(\"Teks Prompt -> Phonemizer -> Acoustic Model (Spectrogram Laten) -> Neural Vocoder (HiFi-GAN) -> Gelombang Audio (.wav)\")",
      }],
    },
    {
      id: "genai-sec-11",
      title: "BAB 11: Editing Kreatif dengan Generative AI",
      orderIndex: 11,
      isCompleted: false,
      description: "Teknik manipulasi gambar: Inpainting (mengisi area hilang), Outpainting (memperluas kanvas gambar), Style Transfer, dan Object Removal cerdas.",
      codeSnippets: [{
        id: "genai-snip-11",
        language: "python",
        caption: "image_inpainting_mask.py",
        code: "def apply_inpainting_mask(image, mask, generated_fill):\n    # Gabungkan area luar mask asli dengan konten baru hasil generasi\n    result = image * (1 - mask) + generated_fill * mask\n    return result\n\nprint(\"Operasi inpainting menggantikan objek target secara mulus.\")",
      }],
    },
    {
      id: "genai-sec-12",
      title: "BAB 12: Evaluasi Generative AI",
      orderIndex: 12,
      isCompleted: false,
      description: "Metrik evaluasi kuantitatif & kualitatif: Fréchet Inception Distance (FID), Inception Score (IS), CLIP Score untuk keselarasan prompt, dan uji preferensi manusia.",
      codeSnippets: [{
        id: "genai-snip-12",
        language: "python",
        caption: "frechet_inception_distance.py",
        code: "import numpy as np\n\ndef calculate_fid_simple(mu1, sigma1, mu2, sigma2):\n    # Jarak Fréchet antar dua distribusi Gaussian multivariate\n    diff = mu1 - mu2\n    covmean = np.sqrt(sigma1 * sigma2)\n    fid = np.sum(diff**2) + (sigma1 + sigma2 - 2 * covmean)\n    return fid\n\nprint(\"Skor FID Sampel:\", round(calculate_fid_simple(0.5, 1.2, 0.4, 1.1), 3))",
      }],
    },
    {
      id: "genai-sec-13",
      title: "BAB 13: Etika & Tantangan Generative AI",
      orderIndex: 13,
      isCompleted: false,
      description: "Bahaya deepfake & disinformasi massal, hak cipta konten AI (Copyright/Fair Use), watermark tak terlihat (SynthID), dan mitigasi halusinasi.",
      codeSnippets: [{
        id: "genai-snip-13",
        language: "python",
        caption: "digital_watermark_check.py",
        code: "def detect_invisible_watermark(content_payload):\n    has_watermark = True # Simulasi verifikasi metadata kriptografis\n    return \"Status Konten: Terverifikasi Sintetik AI (Watermarked by SynthID)\" if has_watermark else \"Konten Tidak Terverifikasi\"",
      }],
    },
    {
      id: "genai-sec-14",
      title: "BAB 14: Aplikasi Generative AI di Industri",
      orderIndex: 14,
      isCompleted: false,
      description: "Implementasi bisnis: Personalisasi desain periklanan, otomatisasi pembuatan konten game, sintesis kode perangkat lunak, dan riset desain molekuler obat.",
      codeSnippets: [{
        id: "genai-snip-14",
        language: "python",
        caption: "enterprise_genai_solutions.py",
        code: "def genai_enterprise_ecosystem():\n    use_cases = [\n        \"E-Commerce: Pembuatan katalog produk fotorealistik 3D tanpa sesi foto fisik\",\n        \"Farmasi: Generasi struktur molekul baru untuk uji kandidat obat\",\n        \"Software: AI Copilot auto-completion kode dan perbaikan bug otomatis\",\n        \"Media: Personalisasi narasi konten interaktif waktu nyata\"\n    ]\n    for uc in use_cases: print(\"->\", uc)\n\ngenai_enterprise_ecosystem()",
      }],
    },
  ];
}

export const CURRICULUM_BATCH3_MAP: Record<string, () => ModuleSection[]> = {
  "data-science": getDataScienceSections,
  "deep-learning": getDeepLearningSections,
  "edge-ai": getEdgeAiSections,
  "edge-ai-tinyml": getEdgeAiSections,
  "tinyml": getEdgeAiSections,
  "expert-system": getExpertSystemSections,
  "expert-systems": getExpertSystemSections,
  "generative-ai": getGenerativeAiSections,
};

export function getBatch3CurriculumNote(slug: string): { title: string; content_markdown: string; category_name: string } | null {
  const clean = slug.toLowerCase().trim();
  const allGroups = [
    { name: "Data Science", sections: getDataScienceSections() },
    { name: "Deep Learning", sections: getDeepLearningSections() },
    { name: "Edge AI & TinyML", sections: getEdgeAiSections() },
    { name: "Expert System", sections: getExpertSystemSections() },
    { name: "Generative AI", sections: getGenerativeAiSections() },
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
