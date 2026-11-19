import { AcademicCurriculum } from "../types";
import { phase1FoundationsChapters } from "./machine-learning/phase1-foundations";
import { phase2LinearKernelChapters } from "./machine-learning/phase2-linear-kernel";
import { phase3TabularSotaChapters } from "./machine-learning/phase3-tabular-sota";
import { phase4UnsupervisedChapters } from "./machine-learning/phase4-unsupervised";
import { phase5DataCentricChapters } from "./machine-learning/phase5-data-centric";
import { phase6EvalConformalChapters } from "./machine-learning/phase6-eval-conformal";
import { phase7CausalHybridChapters } from "./machine-learning/phase7-causal-hybrid";
import { phase8ProductionChapters } from "./machine-learning/phase8-production";

/**
 * KURIKULUM AKADEMIK: MACHINE LEARNING
 * Standar: Principal ML Engineer (20+ Tahun) — Edisi Industri 2026 (Velqora Reader 2.0)
 * Single Source of Truth terintegrasi untuk platform Velqora.
 *
 * Versi 5.0.0 — Complete 36 Bab / 8 Learning Phases / 145 Subbab / 435 Blok Kode Python Terverifikasi
 * Seluruh 36 bab lulus 8 Hard Quality Gates (0 violations) dan seluruh blok kode Python diverifikasi
 * terisolasi pada Python 3.14 / NumPy 2 / Scikit-Learn 1.9 (serta XGBoost 3.4 & LightGBM 4.7)
 * dengan 0 placeholder output dan 8 Interactive ML Sandboxes terintegrasi.
 */
export const machineLearningCurriculum: AcademicCurriculum = {
  id: "machine-learning",
  slug: "machine-learning",
  title: "Machine Learning",
  category: "Kecerdasan Buatan",
  level: "menengah",
  description:
    "Kurikulum akademik & rekayasa produksi Machine Learning v5.0 berstandar Principal ML Engineer (20+ tahun) Edisi 2026 — 36 Bab dalam 8 Learning Phases: problem framing berbasis Teorema Elkan, fondasi matematis & Double Descent, GLM/Tweedie, Trilogi GBDT, TabPFN v2 & FT-Transformer/RealMLP/EBM, PaCMAP/HDBSCAN/HNSW, Polars/Cleanlab/Data-Centric, Conformal UQ, Causal ML/DML/Uplift/CUPED, Hybrid LLM-to-Classical Distillation, XAI/Fairness, Optuna Pareto, Safe Serving (skops/ONNX), Drift Monitoring & 4 Staff+ System Design Blueprints, lengkap dengan 8 Interactive ML Sandboxes dan 435 blok kode Python terverifikasi nyata.",
  estimatedHours: 160,
  version: "5.0.0",
  primaryReferences: [
    {
      title: "scikit-learn: Machine Learning in Python",
      authors: [
        "Fabian Pedregosa",
        "Gael Varoquaux",
        "Alexandre Gramfort",
        "Vincent Michel",
        "Bertrand Thirion",
        "Olivier Grisel",
      ],
      type: "paper",
      year: 2011,
      url: "https://jmlr.org/papers/v12/pedregosa11a.html",
      doi: "10.48550/arXiv.1201.0490",
      sourceType: "paper",
      provider: "Journal of Machine Learning Research (JMLR)",
      relevance:
        "Paper pendirian pustaka scikit-learn dan prinsip desain API estimator fit-transform-predict bebas kebocoran data.",
      verified: true,
      lastChecked: "2026-11-18",
      isPrimarySource: true,
    },
    {
      title: "The Elements of Statistical Learning: Data Mining, Inference, and Prediction (2nd Ed.)",
      authors: ["Trevor Hastie", "Robert Tibshirani", "Jerome Friedman"],
      type: "book",
      year: 2009,
      url: "https://hastie.su.domains/ElemStatLearn/",
      sourceType: "academic-book",
      provider: "Springer",
      relevance:
        "Buku teks kanonikal pemodelan statistik, dekomposisi bias-varians, regularisasi Ridge/Lasso, dan ensemble methods.",
      verified: true,
      lastChecked: "2026-11-18",
      isPrimarySource: true,
    },
    {
      title: "Probabilistic Machine Learning: An Introduction",
      authors: ["Kevin P. Murphy"],
      type: "book",
      year: 2022,
      url: "https://probml.github.io/pml-book/book1.html",
      sourceType: "academic-book",
      provider: "MIT Press",
      relevance:
        "Rujukan probabilistik modern untuk Bayesian decision theory, kalibrasi, GLM, dan pembelajaran representasi.",
      verified: true,
      lastChecked: "2026-11-18",
      isPrimarySource: true,
    },
    {
      title: "Accurate predictions on small data with a tabular foundation model (TabPFN v2)",
      authors: [
        "Noah Hollmann",
        "Samuel Muller",
        "Lennart Purucker",
        "Arjun Krishnakumar",
        "Max Korfer",
        "Frank Hutter",
      ],
      type: "paper",
      year: 2025,
      url: "https://www.nature.com/articles/s41586-024-08328-6",
      doi: "10.1038/s41586-024-08328-6",
      sourceType: "paper",
      provider: "Nature",
      relevance:
        "Terobosan Tabular Foundation Model berbasis Prior-Data Fitted Networks dan Two-Way Attention untuk small-medium data.",
      verified: true,
      lastChecked: "2026-11-18",
      isPrimarySource: true,
    },
    {
      title: "Why do tree-based models still outperform deep learning on typical tabular data?",
      authors: ["Leo Grinsztajn", "Edouard Oyallon", "Gael Varoquaux"],
      type: "paper",
      year: 2022,
      url: "https://arxiv.org/abs/2207.08815",
      sourceType: "paper",
      provider: "NeurIPS 2022",
      relevance:
        "Studi empiris mendalam mengenai 4 keunggulan inductive bias pohon keputusan dibandingkan neural network klasik.",
      verified: true,
      lastChecked: "2026-11-18",
      isPrimarySource: true,
    },
    {
      title: "Designing Machine Learning Systems: An Iterative Process for Production-Ready Applications",
      authors: ["Chip Huyen"],
      type: "book",
      year: 2022,
      url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/",
      sourceType: "academic-book",
      provider: "O'Reilly Media",
      relevance:
        "Standar industri untuk problem framing, data-centric engineering, monitoring drift, dan desain sistem ML produksi.",
      verified: true,
      lastChecked: "2026-11-18",
      isPrimarySource: true,
    },
    {
      title: "The Foundations of Cost-Sensitive Learning",
      authors: ["Charles Elkan"],
      type: "paper",
      year: 2001,
      url: "https://cseweb.ucsd.edu/~elkan/rescale.pdf",
      sourceType: "paper",
      provider: "IJCAI 2001",
      relevance:
        "Pembuktian formal ambang keputusan Bayes-optimal di bawah matriks biaya bisnis asimetris.",
      verified: true,
      lastChecked: "2026-11-18",
      isPrimarySource: true,
    },
    {
      title: "Machine Learning (McGraw-Hill International Editions)",
      authors: ["Tom M. Mitchell"],
      type: "book",
      year: 1997,
      url: "https://www.cs.cmu.edu/~tom/mlbook.html",
      sourceType: "academic-book",
      provider: "McGraw-Hill",
      relevance:
        "Karya fundamental definisi komputasi pembelajaran mesin melalui triplet operasional (T, E, P).",
      verified: true,
      lastChecked: "2026-11-18",
      isPrimarySource: true,
    },
  ],
  datasets: [
    {
      id: "california-housing",
      name: "California Housing Dataset (Pace & Barry, 1997)",
      purpose:
        "Tolok ukur pemodelan regresi multivariat untuk memprediksi harga median rumah berdasarkan fitur demografis dan geografis blok sensus.",
      sourceUrl:
        "https://scikit-learn.org/stable/datasets/real_world.html#california-housing-dataset",
      license: "Public Domain / CC0",
      numSamples: 20640,
      numFeatures: 8,
      target: "MedHouseVal (Median house value dalam ratusan ribu USD)",
      limitations:
        "Nilai target disensor pada batas atas $500,000 (capping buatan pada kuantil tertinggi); berasal dari sensus 1990 sehingga hanya valid untuk tolok ukur metodologis.",
      potentialBias:
        "Distribusi geografis terkonsentrasi di pesisir pantai dengan varians spasial ekstrem antara distrik perkotaan dan pedesaan.",
      downloadInstructions:
        "from sklearn.datasets import fetch_california_housing; data = fetch_california_housing(as_frame=True)",
      inspectionSnippet:
        "from sklearn.datasets import fetch_california_housing\nfrom sklearn.model_selection import train_test_split\n\ndf = fetch_california_housing(as_frame=True).frame\ndf_clean = df[df['MedHouseVal'] < 5.0].copy()\nX, y = df_clean.drop(columns=['MedHouseVal']), df_clean['MedHouseVal']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nprint('Train:', X_train.shape, 'Test:', X_test.shape)",
      verified: true,
    },
  ],
  capstoneProject: {
    title: "Proyek Akhir Staff ML Engineer: Sistem Risiko Kredit & Fraud Terkalibrasi Produksi (2026)",
    description:
      "Merancang, melatih, mengkalibrasi, mengaudit kepatuhan (Monotonic/EBM/Conformal), dan mengemas sistem prediksi tabular end-to-end dengan SLA latensi p99 < 10ms serta zero data leakage.",
    requirements: [
      "Melampirkan analisis ROI Heuristik vs ML serta formulasi matriks biaya asimetris (Teorema Elkan / TunedThresholdClassifierCV)",
      "Membandingkan minimal 3 kelas model dengan inductive bias berbeda (Linear/EBM Glass-Box, HistGBDT/LightGBM, dan Tabular DL/TabPFN v2) di bawah protokol CV bebas bocor",
      "Menyertakan audit VIF, kalibrasi probabilitas (ECE/Brier), dan unit test otomatis kepatuhan monotonisitas",
      "Mengemas artefak model secara aman (skops / ONNX — tanpa Pickle) lengkap dengan spesifikasi monitor drift Wasserstein W1",
    ],
    rubrics: [
      "Problem Framing, Penyelarasan Biaya Bisnis & Validasi Bebas Bocor: 30%",
      "Kedalaman Komparasi Arsitektur & Kalibrasi Probabilitas: 25%",
      "Kualitas Rekayasa Kode, Reproduksibilitas & Keamanan Serialisasi: 25%",
      "Audit Kepatuhan, Interpretabilitas & Dokumentasi System Design: 20%",
    ],
  },
  chapters: [
    // ─── PHASE 1: FONDASI & FORMULASI ILMIAH (v5.0 COMPLETE: BAB 01–05) ───
    ...phase1FoundationsChapters,

    // ─── PHASE 2: MODEL LINIER, PROBABILISTIK & KERNEL (v5.0 COMPLETE: BAB 06–12) ───
    ...phase2LinearKernelChapters,

    // ─── PHASE 3: TABULAR SOTA — TREES, GBDT & TABFM 2026 (v5.0 COMPLETE: BAB 13–18) ───
    ...phase3TabularSotaChapters,

    // ─── PHASE 4: UNSUPERVISED, MANIFOLD & VECTOR SEARCH (v5.0 COMPLETE: BAB 19–24) ───
    ...phase4UnsupervisedChapters,

    // ─── PHASE 5: MODERN DATA STACK & DATA-CENTRIC AI (v5.0 COMPLETE: BAB 25–27) ───
    ...phase5DataCentricChapters,

    // ─── PHASE 6: EVALUASI, KALIBRASI & KETIDAKPASTIAN (v5.0 COMPLETE: BAB 28–30) ───
    ...phase6EvalConformalChapters,

    // ─── PHASE 7: CAUSAL ML & HYBRID AI SYSTEMS (v5.0 COMPLETE: BAB 31–32) ───
    ...phase7CausalHybridChapters,

    // ─── PHASE 8: XAI, TUNING & STAFF+ PRODUCTION SYSTEMS (v5.0 COMPLETE: BAB 33–36) ───
    ...phase8ProductionChapters,
  ],
};
