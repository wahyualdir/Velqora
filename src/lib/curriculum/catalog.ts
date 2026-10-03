/**
 * REGISTRI UTAMA KATALOG 24 TOPIK KECERDASAN BUATAN & DATA VELQORA
 * Dikelompokkan per jalur / trek kurikulum akademik.
 * 
 * Single Source of Truth (SSOT) untuk tampilan katalog modul,
 * penyaringan jalur karier, level keahlian, status kesiapan, dan outline bab.
 */

import { getAcademicCurriculum } from "./registry";
import { getTopicStatus, TopicStatusMeta } from "./status";

export type TopicGroupId = "fondasi" | "data" | "ml" | "genai" | "produksi";

export interface TopicGroup {
  id: TopicGroupId;
  title: string;
  subtitle: string;
  color: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
}

export type CareerPath =
  | "Data Analyst"
  | "Data Scientist"
  | "ML Engineer"
  | "AI Engineer";

export type TopicLevel = "Pemula" | "Menengah" | "Lanjut";

export interface TopicChapterOutline {
  chapterNumber: number;
  title: string;
  description: string;
  sourceNote?: string;
}

export interface CatalogTopic {
  id: string; // URL Slug kanonikal
  name: string; // Nama tampilan resmi
  group: TopicGroupId;
  level: TopicLevel;
  careerPaths: CareerPath[];
  icon: string;
  color: string;
  status: "verified" | "under_review" | "in_development" | "in_progress" | "coming_soon";
  badgeLabel: string;
  shortDescription: string;
  isNew?: boolean;
  hidden?: boolean;
  legacyId?: string;
  curriculumLookup?: string;
  absorbedTopics?: string[];
  mergedFrom?: string[];
  sourceNote?: string;
  outline?: TopicChapterOutline[];
}

export const CATALOG_GROUPS: readonly TopicGroup[] = [
  {
    id: "fondasi",
    title: "Fondasi",
    subtitle: "Pondasi esensial pemrograman, matematika terapan, basis data, dan prinsip dasar AI",
    color: "#10B981",
    borderColor: "#10B981",
    badgeBg: "rgba(16, 185, 129, 0.12)",
    badgeText: "#059669",
  },
  {
    id: "data",
    title: "Data",
    subtitle: "Analitik data modern, sains data, rekayasa big data, deret waktu, dan sistem rekomendasi",
    color: "#06B6D4",
    borderColor: "#06B6D4",
    badgeBg: "rgba(6, 182, 212, 0.12)",
    badgeText: "#0891B2",
  },
  {
    id: "ml",
    title: "Machine Learning",
    subtitle: "Algoritma pembelajaran mesin, deep learning, NLP, computer vision, RL, dan XAI",
    color: "#8B5CF6",
    borderColor: "#8B5CF6",
    badgeBg: "rgba(139, 92, 246, 0.12)",
    badgeText: "#7C3AED",
  },
  {
    id: "genai",
    title: "AI Generatif",
    subtitle: "Model bahasa besar (LLM), prompt engineering, generative AI, RAG, dan agen otonom",
    color: "#F59E0B",
    borderColor: "#F59E0B",
    badgeBg: "rgba(245, 158, 11, 0.12)",
    badgeText: "#D97706",
  },
  {
    id: "produksi",
    title: "Produksi & Tata Kelola",
    subtitle: "MLOps, deployment industri, keamanan siber adversarial, tata kelola, dan AI klasik",
    color: "#6366F1",
    borderColor: "#6366F1",
    badgeBg: "rgba(99, 102, 241, 0.12)",
    badgeText: "#4F46E5",
  },
] as const;

export const CAREER_PATHS: readonly CareerPath[] = [
  "Data Analyst",
  "Data Scientist",
  "ML Engineer",
  "AI Engineer",
] as const;

/**
 * 24 Topik Aktif Katalog (dikelompokkan ke 5 grup) + 2 topik disembunyikan (hidden: true)
 */
export const CATALOG_TOPICS: readonly CatalogTopic[] = [
  // ──────────────────────────────────────────────
  // GRUP 1: FONDASI (4 Topik)
  // ──────────────────────────────────────────────
  {
    id: "python-data-science-ai",
    name: "Python untuk Data Science & AI",
    group: "fondasi",
    level: "Pemula",
    careerPaths: ["Data Analyst", "Data Scientist", "ML Engineer", "AI Engineer"],
    icon: "python",
    color: "#10B981",
    status: "in_progress",
    badgeLabel: "Progres",
    shortDescription: "Fondasi komputasi Python: sintaks, fungsi, OOP, modul NumPy/Pandas, serta alat kerja Git, Linux, dan Docker.",
    isNew: true,
    absorbedTopics: ["Git Version Control", "Linux & Bash", "Docker Container"],
    sourceNote: "Siap diimpor dari modul dasar Python dan materi Data Science",
    outline: [
      { chapterNumber: 1, title: "Bab 1: Pengenalan Python & Lingkungan Pengembangan (VS Code, Jupyter, venv)", description: "Instalasi runtime Python 3, manajemen virtual environment, dan eksekusi skrip interaktif." },
      { chapterNumber: 2, title: "Bab 2: Variabel, Tipe Data Primitif, & Operasi Aritmatika/Logika", description: "Integer, float, string, boolean, type casting, dan operator preseden." },
      { chapterNumber: 3, title: "Bab 3: Kontrol Alur Eksekusi: Kondisional & Perulangan Tingkat Lanjut", description: "If-elif-else, loop for/while, break-continue, dan list/dict comprehension." },
      { chapterNumber: 4, title: "Bab 4: Fungsi, Modularitas Kode, Scope Variabel, & Lambda Expressions", description: "Definisi fungsi, *args, **kwargs, docstrings, pure functions, dan closure." },
      { chapterNumber: 5, title: "Bab 5: Struktur Data Koleksi: List, Tuple, Set, dan Dictionary", description: "Metode bawaan koleksi, mutabilitas, slicing, dan kompleksitas waktu O(1) vs O(n)." },
      { chapterNumber: 6, title: "Bab 6: Pemrograman Berorientasi Objek (OOP) & Penanganan Eksepsi", description: "Class, object, inheritance, encapsulation, polymorphism, dan blok try-except-finally." },
      { chapterNumber: 7, title: "Bab 7: Komputasi Array Numerik Berkecepatan Tinggi dengan NumPy", description: "Array ndarray, operasi tervektorisasi, broadcasting rules, dan aljabar linier numerik." },
      { chapterNumber: 8, title: "Bab 8: Manipulasi & Pembersihan Data Tabular dengan Pandas", description: "Struktur DataFrame/Series, pembersihan missing value, filtering, dan agregasi groupby." },
      { chapterNumber: 9, title: "Bab 9: Visualisasi Data Dasar Ilmiah dengan Matplotlib & Seaborn", description: "Plot distribusi, scatter plot, heatmaps matriks, kustomisasi axis, dan figure canvas." },
      { chapterNumber: 10, title: "Bab 10: Sistem Kontrol Versi dengan Git & Kolaborasi GitHub", description: "Alat kerja esensial: git init, commit, branching, pull request, resolusi konflik, dan .gitignore." },
      { chapterNumber: 11, title: "Bab 11: Lingkungan Terminal Linux & Bash Scripting untuk AI/ML", description: "Alat kerja esensial: navigasi sistem file Linux, manajemen proses, permissions, dan pipe streams." },
      { chapterNumber: 12, title: "Bab 12: Kontainerisasi Aplikasi & Lingkungan Reproduksibel dengan Docker", description: "Alat kerja esensial: Dockerfile, build image, port mapping, volume mounting, dan docker-compose." },
      { chapterNumber: 13, title: "Bab 13: Capstone: Otomatisasi Pipeline Analisis Data & Clean Code PEP 8", description: "Proyek komprehensif mengintegrasikan Python, NumPy, Pandas, Git, dan Docker." },
    ],
  },
  {
    id: "matematika-statistika-ai",
    name: "Matematika & Statistika untuk AI",
    group: "fondasi",
    level: "Pemula",
    careerPaths: ["Data Scientist", "ML Engineer", "AI Engineer"],
    icon: "math",
    color: "#10B981",
    status: "in_progress",
    badgeLabel: "Progres",
    shortDescription: "Landasan matematis AI: Aljabar Linier, Kalkulus Matriks, Probabilitas, dan Optimasi Numerik.",
    isNew: true,
    curriculumLookup: "matematika-statistika-untuk-ai",
    sourceNote: "Disalin mandiri dari Machine Learning Foundations (Chunk 1: Bab 1-5)",
    outline: [
      { chapterNumber: 1, title: "Bab 1: Paradigma Machine Learning & Perumusan Masalah Ilmiah", description: "Ruang hipotesis, bias induktif, perumusan fungsi loss, dan trade-off representasi.", sourceNote: "ML Chunk 1 Bab 1" },
      { chapterNumber: 2, title: "Bab 2: Aljabar Linier Komputasional & Kalkulus Matriks", description: "Operasi vektor, ruang bagian, rank matriks, norm vektor/matriks, dan kalkulus derivatif matriks.", sourceNote: "ML Chunk 1 Bab 2" },
      { chapterNumber: 3, title: "Bab 3: Teori Probabilitas, Estimasi Parameter, & Bayesian Inference", description: "Aksioma Kolmogorov, variabel acak diskrit/kontinu, teorema Bayes, dan estimasi MLE/MAP.", sourceNote: "ML Chunk 1 Bab 3" },
      { chapterNumber: 4, title: "Bab 4: Teori Belajar Statistik & Dekomposisi Bias-Variance", description: "Generalisasi PAC, batas VC-Dimension, dekomposisi bias-varians analitis, dan risiko empiris.", sourceNote: "ML Chunk 1 Bab 4" },
      { chapterNumber: 5, title: "Bab 5: Optimasi Numerik untuk Machine Learning", description: "Kondisi KKT, optimasi konveks, varian Gradient Descent, momentum, RMSprop, dan algoritma Adam.", sourceNote: "ML Chunk 1 Bab 5" },
      { chapterNumber: 6, title: "Bab 6: Dekomposisi Spektral Matriks: Eigendecomposition & SVD", description: "Nilai eigen, vektor eigen, faktorisasi nilai singular (SVD), dan kompresi informasi Principal Component." },
      { chapterNumber: 7, title: "Bab 7: Distribusi Multivariat & Teorema Limit Pusat (CLT)", description: "Distribusi Gauss multivariat, kovariansi, hukum bilangan besar, dan inferensi sampling." },
      { chapterNumber: 8, title: "Bab 8: Uji Hipotesis Statistik & Signifikansi Eksperimen", description: "Uji t-Student, uji Z, ANOVA, uji chi-square, p-value, dan interval kepercayaan parametrik." },
      { chapterNumber: 9, title: "Bab 9: Teori Informasi: Entropi, Cross-Entropy, & Divergensi KL", description: "Entropi Shannon, mutual information, divergensi Kullback-Leibler, dan perumusan loss klasifikasi." },
      { chapterNumber: 10, title: "Bab 10: Capstone: Perhitungan Matematis dari Nol (NumPy Scratch Engine)", description: "Implementasi mandiri seluruh perumusan matematis tanpa menggunakan pustaka tingkat tinggi." },
    ],
  },
  {
    id: "sql-basis-data",
    name: "SQL & Basis Data",
    group: "fondasi",
    level: "Pemula",
    careerPaths: ["Data Analyst", "Data Scientist", "ML Engineer"],
    icon: "database",
    color: "#10B981",
    status: "in_progress",
    badgeLabel: "Progres 4/12 Bab",
    shortDescription: "Sintaks SQL analitik (Window Functions, CTEs), perancangan skema relasional, indeks, dan transaksi ACID.",
    isNew: true,
    curriculumLookup: "sql-basis-data",
    sourceNote: "Bab 1-4 sudah diimpor (status imported-unverified). Kode diuji di SQLite 3.45.1, belum diuji di PostgreSQL; rujukan belum diverifikasi.",
    outline: [
      { chapterNumber: 1, title: "Bab 1: Fondasi Basis Data Relasional & Arsitektur Mesin SQL", description: "Model relasional Codd, RDBMS kontemporer (PostgreSQL, MySQL, SQLite), dan eksekusi kueri." },
      { chapterNumber: 2, title: "Bab 2: Data Definition Language (DDL) & Integritas Data", description: "CREATE TABLE, ALTER, DROP, tipe data skalar, primary key, foreign key, dan check constraints." },
      { chapterNumber: 3, title: "Bab 3: Data Manipulation Language (DML) & Filtering Logis", description: "Kueri SELECT, WHERE, operators AND/OR/NOT, LIKE, BETWEEN, IN, dan penanganan nilai NULL." },
      { chapterNumber: 4, title: "Bab 4: Agregasi Data & Pengelompokan Tingkat Lanjut (GROUP BY & HAVING)", description: "COUNT, SUM, AVG, MIN, MAX, GROUP BY multi-kolom, dan evaluasi kondisi agregat HAVING." },
      { chapterNumber: 5, title: "Bab 5: Penggabungan Relasional: INNER, LEFT, RIGHT, & FULL OUTER JOIN", description: "Kardinalitas relasi, penanganan data hilang pada outer join, self-join, dan cross join." },
      { chapterNumber: 6, title: "Bab 6: Subquery Terkorelasi & Common Table Expressions (CTEs / WITH)", description: "Subquery bersarang, skalar subquery, kueri rekursif WITH RECURSIVE, dan modularitas kueri." },
      { chapterNumber: 7, title: "Bab 7: Window Functions Analitik: ROW_NUMBER, RANK, LEAD, & LAG", description: "Partisi OVER(PARTITION BY ... ORDER BY), sliding window frames, dan running totals." },
      { chapterNumber: 8, title: "Bab 8: Manipulasi String, Fungsi Waktu, & Logika Kondisional CASE WHEN", description: "Ekstraksi string, parsing timestamp, zonasi waktu, dan percabangan logika ekspresi." },
      { chapterNumber: 9, title: "Bab 9: Desain Skema Basis Data & Normalisasi (1NF, 2NF, 3NF, BCNF)", description: "Menghindari anomali insersi/update, pemodelan data OLTP vs OLAP Star/Snowflake Schema." },
      { chapterNumber: 10, title: "Bab 10: Optimasi Kueri, Pengindeksan (B-Tree, Hash), & Analisis EXPLAIN", description: "Rencana eksekusi kueri, indeks gabungan, indeks parsial, dan pencegahan full table scan." },
      { chapterNumber: 11, title: "Bab 11: Manajemen Transaksi, Isolasi Concurrency, & Jaminan ACID", description: "BEGIN, COMMIT, ROLLBACK, level isolasi transaksi, locking mechanism, dan deadlock mitigation." },
      { chapterNumber: 12, title: "Bab 12: Capstone: Gudang Data Analitik Terpadu & Integrasi Python/SQLAlchemy", description: "Membangun skema analitik terintegrasi kueri analitik bisnis dan konektor Python." },
    ],
  },
  {
    id: "artificial-intelligence",
    name: "Artificial Intelligence",
    group: "fondasi",
    level: "Pemula",
    careerPaths: ["AI Engineer", "ML Engineer", "Data Scientist"],
    icon: "machine_learning",
    color: "#10B981",
    status: "verified",
    badgeLabel: "Terverifikasi",
    shortDescription: "Fondasi kecerdasan buatan berbasis Russell & Norvig: agen cerdas, algoritma pencarian, dan logika representasi.",
    legacyId: "ai-fundamentals",
    curriculumLookup: "ai-fundamentals",
  },

  // ──────────────────────────────────────────────
  // GRUP 2: DATA (5 Topik)
  // ──────────────────────────────────────────────
  {
    id: "data-analyst",
    name: "Data Analyst",
    group: "data",
    level: "Menengah",
    careerPaths: ["Data Analyst"],
    icon: "data_analyst",
    color: "#06B6D4",
    status: "verified",
    badgeLabel: "Terverifikasi",
    shortDescription: "Metodologi analitik modern, pembersihan 16 langkah, visualisasi data, BI Dashboard, dan pengujian hipotesis A/B.",
    legacyId: "data-analyst",
    curriculumLookup: "data-analyst",
    absorbedTopics: ["Data Visualization & BI (Power BI, Looker Studio)"],
  },
  {
    id: "data-science",
    name: "Data Science",
    group: "data",
    level: "Menengah",
    careerPaths: ["Data Scientist", "ML Engineer"],
    icon: "data_science",
    color: "#06B6D4",
    status: "verified",
    badgeLabel: "Terverifikasi",
    shortDescription: "Siklus hidup sains data empiris: pemodelan statistik, reduksi dimensi, algoritma prediksi, dan dokumentasi Model Cards.",
    legacyId: "data-science",
    curriculumLookup: "data-science",
  },
  {
    id: "data-engineering-ai",
    name: "Data Engineering & Big Data",
    group: "data",
    level: "Menengah",
    careerPaths: ["Data Scientist", "ML Engineer"],
    icon: "data_engineering",
    color: "#06B6D4",
    status: "under_review",
    badgeLabel: "Dalam Review",
    shortDescription: "Arsitektur data pipeline skala besar: data lakehouse, streaming data (Kafka), Spark terdistribusi, dan Airflow.",
    legacyId: "data-engineering-ai",
    curriculumLookup: "data-engineering-ai",
  },
  {
    id: "time-series-forecasting",
    name: "Time Series Forecasting",
    group: "data",
    level: "Menengah",
    careerPaths: ["Data Analyst", "Data Scientist", "ML Engineer"],
    icon: "time_series",
    color: "#06B6D4",
    status: "under_review",
    badgeLabel: "Dalam Review",
    shortDescription: "Dekomposisi deret waktu, ARIMA/SARIMA, Prophet, Deep Learning (LSTM, PatchTST), dan deteksi anomali.",
    legacyId: "time-series-forecasting",
    curriculumLookup: "time-series-forecasting",
  },
  {
    id: "recommendation-system",
    name: "Recommendation System",
    group: "data",
    level: "Menengah",
    careerPaths: ["Data Scientist", "ML Engineer"],
    icon: "machine_learning",
    color: "#06B6D4",
    status: "under_review",
    badgeLabel: "Dalam Review",
    shortDescription: "Collaborative filtering, matrix factorization (SVD, ALS), neural recommender, two-tower models, dan ranking.",
    legacyId: "recommendation-system",
    curriculumLookup: "recommendation-system",
  },

  // ──────────────────────────────────────────────
  // GRUP 3: MACHINE LEARNING (6 Topik)
  // ──────────────────────────────────────────────
  {
    id: "machine-learning",
    name: "Machine Learning",
    group: "ml",
    level: "Menengah",
    careerPaths: ["ML Engineer", "Data Scientist"],
    icon: "machine_learning",
    color: "#8B5CF6",
    status: "verified",
    badgeLabel: "Terverifikasi",
    shortDescription: "32 Bab lengkap SOTA: model linier, pohon keputusan ensemble (XGBoost, LightGBM), dan bab lanjutan AutoML & NAS.",
    legacyId: "machine-learning",
    curriculumLookup: "machine-learning",
    absorbedTopics: ["AutoML & Neural Architecture Search"],
  },
  {
    id: "deep-learning",
    name: "Deep Learning",
    group: "ml",
    level: "Menengah",
    careerPaths: ["ML Engineer", "AI Engineer"],
    icon: "deep_learning",
    color: "#8B5CF6",
    status: "verified",
    badgeLabel: "Terverifikasi",
    shortDescription: "Arsitektur deep neural network: CNN, RNN/LSTM, mekanisme Attention, Transformer, dan bab lanjutan Graph Neural Network.",
    legacyId: "deep-learning",
    curriculumLookup: "deep-learning",
    absorbedTopics: ["Graph Neural Network (GNN)"],
  },
  {
    id: "natural-language-processing",
    name: "Natural Language Processing",
    group: "ml",
    level: "Menengah",
    careerPaths: ["AI Engineer", "ML Engineer"],
    icon: "nlp",
    color: "#8B5CF6",
    status: "verified",
    badgeLabel: "Terverifikasi",
    shortDescription: "Pemrosesan bahasa alami berbasis Jurafsky & Martin: tokenisasi, embeddings, sequence labeling, dan Transformer NLU.",
    legacyId: "natural-language-processing",
    curriculumLookup: "natural-language-processing",
  },
  {
    id: "computer-vision",
    name: "Computer Vision",
    group: "ml",
    level: "Menengah",
    careerPaths: ["AI Engineer", "ML Engineer"],
    icon: "computer_vision",
    color: "#8B5CF6",
    status: "verified",
    badgeLabel: "Terverifikasi",
    shortDescription: "Pengolahan citra digital, deteksi objek (YOLO, Faster R-CNN), segmentasi semantik, dan Vision Transformer.",
    legacyId: "computer-vision",
    curriculumLookup: "computer-vision",
  },
  {
    id: "reinforcement-learning",
    name: "Reinforcement Learning",
    group: "ml",
    level: "Lanjut",
    careerPaths: ["ML Engineer", "AI Engineer"],
    icon: "reinforcement",
    color: "#8B5CF6",
    status: "under_review",
    badgeLabel: "Dalam Review",
    shortDescription: "Proses Keputusan Markov (MDP), persamaan Bellman, Dynamic Programming, Q-Learning, Policy Gradient, PPO, dan RLHF.",
    legacyId: "reinforcement-learning",
    curriculumLookup: "reinforcement-learning",
  },
  {
    id: "explainable-ai",
    name: "Explainable AI (XAI)",
    group: "ml",
    level: "Menengah",
    careerPaths: ["Data Scientist", "ML Engineer"],
    icon: "ethics",
    color: "#8B5CF6",
    status: "in_progress",
    badgeLabel: "Progres",
    shortDescription: "Interpretabilitas model: PFI, PDP/ICE curves, LIME, Shapley Values, SHAP (TreeSHAP, KernelSHAP), dan audit kepatuhan EU AI Act.",
    isNew: true,
    curriculumLookup: "explainable-ai",
    sourceNote: "Disalin mandiri dari Machine Learning Chunk 7 (Bab 31)",
    outline: [
      { chapterNumber: 1, title: "Bab 1: Krisis Model Kotak Hitam (Black-Box Problem) & Regulasi AI", description: "Trade-off akurasi vs interpretabilitas, hak atas penjelasan (GDPR), dan kepatuhan EU AI Act Article 14.", sourceNote: "ML Chunk 7 Bab 31.1" },
      { chapterNumber: 2, title: "Bab 2: Taksonomi Interpretabilitas Model: Intrinsik vs Post-Hoc", description: "Klasifikasi metode penjelasan global vs lokal, model-agnostic vs model-specific." },
      { chapterNumber: 3, title: "Bab 3: Model Transparan Intrinsik: EBM & Sparse Rule Lists", description: "Explainable Boosting Machines (EBM), generalized additive models (GAMs), dan pohon keputusan terikat." },
      { chapterNumber: 4, title: "Bab 4: Atribusi Fitur Global: Permutation Feature Importance (PFI)", description: "Metodologi Breiman, permuting feature vectors, evaluasi penurunan skor, dan jebakan multikolinieritas." },
      { chapterNumber: 5, title: "Bab 5: Analisis Efek Marginal: Partial Dependence (PDP) & ICE Plots", description: "Perhitungan kurva PDP, Individual Conditional Expectation (ICE), dan pendeteksian efek interaksi fitur." },
      { chapterNumber: 6, title: "Bab 6: Model Pengganti Lokal Terinterpretasi: Kerangka Kerja LIME", description: "Local Interpretable Model-agnostic Explanations, perturbasi sampel berbobot eksponensial, dan model linear lokal." },
      { chapterNumber: 7, title: "Bab 7: Teori Nilai Shapley, Aksioma Keadilan, & Fondasi SHAP", description: "Aksioma efisiensi, simetri, dummy, aditivitas dari teori permainan kooperatif Shapley (1953)." },
      { chapterNumber: 8, title: "Bab 8: Implementasi Praktis TreeSHAP & KernelSHAP pada Model Tabular", description: "Visualisasi Beeswarm plot, waterfall plot, force plots, dan analisis dependensi interaksi SHAP." },
      { chapterNumber: 9, title: "Bab 9: Interpretabilitas Deep Learning: Grad-CAM, Integrated Gradients", description: "Visualisasi peta saliensi konvolusional, path-integral gradients, dan attention rollout visualisasi." },
      { chapterNumber: 10, title: "Bab 10: Capstone: Audit Keadilan Algoritmik & Sistem XAI Produksi", description: "Pipeline diagnostik XAI end-to-end terintegrasi deteksi bias dan kepatuhan audit regulasi." },
    ],
  },

  // ──────────────────────────────────────────────
  // GRUP 4: AI GENERATIF (5 Topik)
  // ──────────────────────────────────────────────
  {
    id: "prompt-engineering",
    name: "Prompt Engineering",
    group: "genai",
    level: "Pemula",
    careerPaths: ["AI Engineer", "Data Analyst", "Data Scientist"],
    icon: "generative_ai",
    color: "#F59E0B",
    status: "coming_soon",
    badgeLabel: "Segera Hadir",
    shortDescription: "Rekayasa instruksi terstruktur: zero/few-shot, Chain-of-Thought (CoT), ReAct framework, structured output, dan mitigasi halusinasi.",
    isNew: true,
    outline: [
      { chapterNumber: 1, title: "Bab 1: Fondasi Prompt Engineering & Cara Kerja Penalaran Model Bahasa", description: "Arsitektur tokenisasi, temperature, top-p, konteks jendela, dan mekanisme pelengkapan teks." },
      { chapterNumber: 2, title: "Bab 2: Anatomi Komponen Prompt Terstruktur: Instruksi, Konteks, & Batasan", description: "Perancangan elemen prompt: system message, user prompt, few-shot examples, dan format guardrails." },
      { chapterNumber: 3, title: "Bab 3: Pembelajaran dalam Konteks: Zero-Shot, One-Shot, & Few-Shot Prompting", description: "Teknik pemilihan contoh kontekstual, format penulisan exemplars, dan pencegahan label bias." },
      { chapterNumber: 4, title: "Bab 4: Penalaran Bertingkat: Chain-of-Thought (CoT) & Tree of Thoughts", description: "Step-by-step reasoning, self-consistency sampling, dan dekomposisi masalah rumit." },
      { chapterNumber: 5, title: "Bab 5: Pengendalian Format Output Terstruktur (JSON, Pydantic, XML)", description: "Enforcing valid schema, JSON mode, function calling parameters, dan validasi parser otomatis." },
      { chapterNumber: 6, title: "Bab 6: Prompt Berbasis Persona, Modulasi Tone, & Gaya Bahasa", description: "Pemberian peran ahli domain (expert persona), adaptasi audiens, dan pembatasan cakupan jawaban." },
      { chapterNumber: 7, title: "Bab 7: Kerangka Kerja Penalaran & Aksi: ReAct (Reason + Act)", description: "Penggabungan rantai penalaran pemikiran dengan eksekusi tindakan pemanggilan alat eksternal." },
      { chapterNumber: 8, title: "Bab 8: Mitigasi Halusinasi, Fact-Checking, & Kalibrasi Keyakinan", description: "Grounding konteks referensi, self-reflection prompt, citation forcing, dan refusal prompting." },
      { chapterNumber: 9, title: "Bab 9: Evaluasi Kualitas Prompt: Benchmarking & LLM-as-a-Judge", description: "Metrik evaluasi otomatis, rubrik scoring semantik, dan optimasi prompt otomatis (APO/DSPy)." },
      { chapterNumber: 10, title: "Bab 10: Keamanan Prompt: Mitigasi Prompt Injection, Jailbreak, & System Hardening", description: "Pertahanan terhadap direct/indirect injection, leak mitigations, dan isolasi instruksi pengguna." },
    ],
  },
  {
    id: "large-language-model",
    name: "Large Language Model",
    group: "genai",
    level: "Lanjut",
    careerPaths: ["AI Engineer", "ML Engineer"],
    icon: "generative_ai",
    color: "#F59E0B",
    status: "in_development",
    badgeLabel: "Progres 72%",
    shortDescription: "Pretraining Transformer, BPE tokenisasi, SFT fine-tuning, LoRA/QLoRA, RLHF, DPO alignment, dan long-context reasoning.",
    legacyId: "large-language-model",
    curriculumLookup: "large-language-model",
  },
  {
    id: "generative-ai",
    name: "Generative AI",
    group: "genai",
    level: "Menengah",
    careerPaths: ["AI Engineer", "ML Engineer"],
    icon: "generative_ai",
    color: "#F59E0B",
    status: "under_review",
    badgeLabel: "Dalam Review",
    shortDescription: "Model generatif modern: VAE, GAN, Model Difusi (DDPM, Stable Diffusion), dan bab lanjutan Multimodal AI.",
    legacyId: "generative-ai",
    curriculumLookup: "generative-ai",
    absorbedTopics: ["Multimodal AI"],
  },
  {
    id: "rag-vector-database",
    name: "RAG & Vector Database",
    group: "genai",
    level: "Menengah",
    careerPaths: ["AI Engineer"],
    icon: "vector_db",
    color: "#F59E0B",
    status: "under_review",
    badgeLabel: "Dalam Review",
    shortDescription: "Retrieval-Augmented Generation: indexing vektor HNSW/IVF, dense & sparse retrieval, reranking, dan hybrid search.",
    legacyId: "vector-database-retrieval",
    curriculumLookup: "vector-database-retrieval",
  },
  {
    id: "ai-agent",
    name: "AI Agent",
    group: "genai",
    level: "Lanjut",
    careerPaths: ["AI Engineer"],
    icon: "robotics",
    color: "#F59E0B",
    status: "under_review",
    badgeLabel: "Dalam Review",
    shortDescription: "Arsitektur agen otonom: perencanaan (planning), memori hierarkis, tool execution, dan kolaborasi multi-agent.",
    legacyId: "ai-agent",
    curriculumLookup: "ai-agent",
  },

  // ──────────────────────────────────────────────
  // GRUP 5: PRODUKSI & TATA KELOLA (4 Topik)
  // ──────────────────────────────────────────────
  {
    id: "mlops-deployment",
    name: "MLOps & AI Deployment",
    group: "produksi",
    level: "Lanjut",
    careerPaths: ["ML Engineer", "AI Engineer"],
    icon: "mlops",
    color: "#6366F1",
    status: "under_review",
    badgeLabel: "Dalam Review",
    shortDescription: "Siklus hidup MLOps: model registry, CI/CD pipeline, inference serving, monitoring data drift, dan deployment Edge AI / TinyML.",
    legacyId: "mlops-deployment",
    curriculumLookup: "mlops-deployment",
    absorbedTopics: ["Edge AI & TinyML"],
  },
  {
    id: "ai-security",
    name: "AI Security & Adversarial",
    group: "produksi",
    level: "Lanjut",
    careerPaths: ["AI Engineer", "ML Engineer"],
    icon: "security",
    color: "#6366F1",
    status: "under_review",
    badgeLabel: "Dalam Review",
    shortDescription: "Keamanan AI: adversarial evasion attacks (FGSM/PGD), data poisoning, model stealing, prompt injection, dan pertahanan robust.",
    legacyId: "ai-security",
    curriculumLookup: "ai-security",
  },
  {
    id: "responsible-ai",
    name: "Responsible AI",
    group: "produksi",
    level: "Menengah",
    careerPaths: ["Data Scientist", "AI Engineer"],
    icon: "ethics",
    color: "#6366F1",
    status: "under_review",
    badgeLabel: "Dalam Review",
    shortDescription: "Integrasi etika, fairness algoritma, transparansi, akuntabilitas, tata kelola AI, dan kepatuhan regulasi EU AI Act / NIST.",
    mergedFrom: ["AI Ethics & Responsible AI", "AI Governance & Regulasi"],
    curriculumLookup: "ai-ethics",
  },
  {
    id: "ai-klasik",
    name: "AI Klasik",
    group: "produksi",
    level: "Menengah",
    careerPaths: ["AI Engineer", "Data Scientist"],
    icon: "expert_systems",
    color: "#6366F1",
    status: "under_review",
    badgeLabel: "Dalam Review",
    shortDescription: "Paradigma AI klasik: sistem pakar rule-based, logika deskripsi & ontologi knowledge graph, serta komputasi fuzzy dan genetika.",
    mergedFrom: ["Expert System", "Knowledge Representation", "Computational Intelligence (Fuzzy Logic, Genetic Algorithm, Swarm Intelligence)"],
    curriculumLookup: "expert-system",
  },

  // ──────────────────────────────────────────────
  // TOPIK DISEMBUNYIKAN (hidden: true, konten tetap ada)
  // ──────────────────────────────────────────────
  {
    id: "robotics-embodied-ai",
    name: "Robotics & Embodied AI",
    group: "produksi",
    level: "Lanjut",
    careerPaths: ["AI Engineer"],
    icon: "robotics",
    color: "#EF4444",
    status: "in_progress",
    badgeLabel: "Progres",
    shortDescription: "Kinematika maju & terbalik, kontrol umpan balik, persepsi sensorik SLAM, simulasi ROS 2, dan model Vision-Language-Action.",
    hidden: true,
    legacyId: "robotics-embodied-ai",
    curriculumLookup: "robotics-embodied-ai",
  },
  {
    id: "speech-audio-ai",
    name: "Speech & Audio AI",
    group: "ml",
    level: "Menengah",
    careerPaths: ["AI Engineer", "ML Engineer"],
    icon: "speech",
    color: "#6366F1",
    status: "in_progress",
    badgeLabel: "Progres",
    shortDescription: "Pemrosesan sinyal audio digital, ekstraksi MFCC, pengenalan wicara (Whisper, Wav2Vec 2.0), dan sintesis suara TTS.",
    hidden: true,
    legacyId: "speech-audio-ai",
    curriculumLookup: "speech-audio-ai",
  },
] as const;

/**
 * Menghitung jumlah bab nyata untuk suatu topik katalog.
 * Prioritas:
 * 1. Kurikulum akademik yang terdaftar di registry
 * 2. Panjang outline terdefinisi untuk topik baru
 * 3. Default fallback 10
 */
export function getCatalogChapterCount(topic: CatalogTopic): number {
  const lookupKey = topic.curriculumLookup || topic.legacyId || topic.id || topic.name;
  const academicCurr = getAcademicCurriculum(lookupKey);

  if (academicCurr && academicCurr.chapters && academicCurr.chapters.length > 0) {
    let count = academicCurr.chapters.length;

    // Untuk topik gabungan Responsible AI: jumlahkan bab AI Ethics (12) + AI Governance (12) = 24 bab
    if (topic.id === "responsible-ai") {
      const ethicsCurr = getAcademicCurriculum("ai-ethics");
      const govCurr = getAcademicCurriculum("ai-governance");
      count = (ethicsCurr?.chapters?.length || 12) + (govCurr?.chapters?.length || 12);
    }

    // Untuk topik gabungan AI Klasik: jumlahkan Expert System (10) + Knowledge Rep (10) + Computational Intelligence (12) = 32 bab
    if (topic.id === "ai-klasik") {
      const expCurr = getAcademicCurriculum("expert-system");
      const krCurr = getAcademicCurriculum("knowledge-representation");
      const ciCurr = getAcademicCurriculum("computational-intelligence");
      count = (expCurr?.chapters?.length || 10) + (krCurr?.chapters?.length || 10) + (ciCurr?.chapters?.length || 12);
    }

    return count;
  }

  // Jika memiliki outline bab terstruktur
  if (topic.outline && topic.outline.length > 0) {
    return topic.outline.length;
  }

  return 10;
}

/**
 * Mengambil daftar 24 topik aktif katalog (tanpa yang disembunyikan).
 */
export function getActiveCatalogTopics(filters?: {
  careerPath?: string;
  level?: string;
  search?: string;
  group?: TopicGroupId;
}): CatalogTopic[] {
  let list = CATALOG_TOPICS.filter((t) => !t.hidden);

  if (filters?.careerPath && filters.careerPath !== "all") {
    list = list.filter((t) =>
      t.careerPaths.includes(filters.careerPath as CareerPath)
    );
  }

  if (filters?.level && filters.level !== "all") {
    list = list.filter(
      (t) => t.level.toLowerCase() === filters.level!.toLowerCase()
    );
  }

  if (filters?.group) {
    list = list.filter((t) => t.group === filters.group);
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.absorbedTopics?.some((a) => a.toLowerCase().includes(q)) ||
        t.mergedFrom?.some((m) => m.toLowerCase().includes(q)) ||
        t.careerPaths.some((p) => p.toLowerCase().includes(q))
    );
  }

  return list;
}

/**
 * Mencari satu topik katalog berdasarkan ID, slug, atau nama.
 */
export function findCatalogTopic(idOrSlugOrName: string): CatalogTopic | undefined {
  if (!idOrSlugOrName) return undefined;
  const q = idOrSlugOrName.toLowerCase().trim();
  const normalized = q.replace(/[^a-z0-9]/g, "");

  return CATALOG_TOPICS.find((t) => {
    if (t.id.toLowerCase() === q) return true;
    if (t.name.toLowerCase() === q) return true;
    if (t.legacyId && t.legacyId.toLowerCase() === q) return true;
    if (t.curriculumLookup && t.curriculumLookup.toLowerCase() === q) return true;
    if (t.id.replace(/[^a-z0-9]/g, "") === normalized) return true;
    if (t.name.replace(/[^a-z0-9]/g, "") === normalized) return true;
    return false;
  });
}
