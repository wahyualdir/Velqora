/**
 * Single Source of Truth (SSOT) untuk status audit dan jaminan kualitas
 * seluruh 28 topik kurikulum di platform Velqora.
 * 
 * Modul ini memisahkan status verifikasi UI dari konten kurikulum itu sendiri,
 * memberikan sinyal jujur dan transparan bagi pengguna tanpa memodifikasi file data.
 */

export type TopicStatus = "verified" | "under_review" | "in_development" | "in_progress" | "coming_soon";

export interface TopicStatusMeta {
  status: TopicStatus;
  badgeLabel: string;
  badgeDescription: string;
  shortDescription: string;
  isVerified: boolean;
  priorityOrder?: number;
}


// 7 Topik yang telah selesai ditulis ulang 100% dan lulus uji rujukan resmi
const VERIFIED_PATTERNS = [
  "data-analyst",
  "dataanalyst",
  "data-science",
  "datascience",
  "machine-learning",
  "machinelearning",
  "deep-learning",
  "deeplearning",
  "12-deep-learning",
  "ai-fundamentals",
  "aifundamentals",
  "artificialintelligencefundamentals",
  "artificial-intelligence",
  "artificialintelligence",
  "05-ai-fundamentals",
  "computer-vision",
  "computervision",
  "08-computer-vision",
  "natural-language-processing",
  "naturallanguageprocessing",
  "22-natural-language-processing"
];

// Topik dalam pengembangan (Batch 1: LLM 72% / 130 Subbab)
const IN_DEVELOPMENT_PATTERNS: string[] = [
  "large-language-model",
  "large-language-models",
  "largelanguagemodel",
  "largelanguagemodels",
  "18-large-language-model"
];

/**
 * Mengembalikan metadata status audit untuk topik tertentu.
 * @param slugOrName ID, slug, atau judul topik
 */
export function getTopicStatus(slugOrName: string = ""): TopicStatusMeta {
  const norm = slugOrName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();

  // Cek Khusus Topik Fondasi: Python, Matematika, XAI
  if (norm.includes("python")) {
    return {
      status: "in_progress",
      badgeLabel: "Progres",
      badgeDescription: "Kurikulum fondasi komputasi Python dan alat kerja data dalam penulisan aktif.",
      shortDescription: "Fondasi komputasi Python: sintaks, fungsi, OOP, modul NumPy/Pandas, serta alat kerja Git, Linux, dan Docker.",
      isVerified: false,
    };
  }

  if (norm.includes("matematika") || norm.includes("statistika") || norm.includes("mathstat")) {
    return {
      status: "in_progress",
      badgeLabel: "Progres",
      badgeDescription: "Kurikulum matematika analitis dan inferensi statistik AI dalam penulisan aktif.",
      shortDescription: "Landasan matematis AI: Aljabar Linier, Kalkulus Matriks, Probabilitas, dan Optimasi Numerik.",
      isVerified: false,
    };
  }

  if (norm.includes("explainable") || norm.includes("xai")) {
    return {
      status: "in_progress",
      badgeLabel: "Progres",
      badgeDescription: "Kurikulum Explainable AI dan interpretabilitas model dalam penulisan aktif.",
      shortDescription: "Interpretabilitas model: PFI, PDP/ICE curves, LIME, Shapley Values, SHAP (TreeSHAP, KernelSHAP), dan audit kepatuhan EU AI Act.",
      isVerified: false,
    };
  }

  if (norm.includes("prompt")) {
    return {
      status: "coming_soon",
      badgeLabel: "Segera Hadir",
      badgeDescription: "Kurikulum prompt engineering dan optimasi model bahasa segera hadir.",
      shortDescription: "Teknik prompt engineering, in-context learning, CoT, ReAct, evaluasi prompt, dan guardrails keamanan LLM.",
      isVerified: false,
    };
  }

  if (norm.includes("sql") || norm.includes("basisdata")) {
    return {
      status: "in_progress",
      badgeLabel: "Progres 3/12 Bab",
      badgeDescription: "Bab 1-3 sudah diimpor (status imported-unverified). Kode diuji di SQLite 3.45.1, belum diuji di PostgreSQL; rujukan belum diverifikasi.",
      shortDescription: "Sintaks SQL analitik (Window Functions, CTEs), perancangan skema relasional, indeks, dan transaksi ACID.",
      isVerified: false,
    };
  }

  // 1. Cek Topik Terverifikasi (Prioritas 1-7) - Tanpa Label Persentase
  if (
    norm.includes("dataanalyst") ||
    (norm.includes("analyst") && !norm.includes("kpi"))
  ) {
    return {
      status: "verified",
      badgeLabel: "Terverifikasi",
      badgeDescription: "Kurikulum akademik terverifikasi penuh bebas data sintetis (10 Bab).",
      shortDescription: "Kurikulum standar akademik analitik data modern terverifikasi bebas data sintetis.",
      isVerified: true,
      priorityOrder: 1,
    };
  }

  if (
    norm.includes("datascience") ||
    (norm.includes("science") && !norm.includes("computer"))
  ) {
    return {
      status: "verified",
      badgeLabel: "Terverifikasi",
      badgeDescription: "Kurikulum akademik terverifikasi penuh bebas data sintetis.",
      shortDescription: "Kurikulum standar akademik sains data empiris terverifikasi bebas data sintetis.",
      isVerified: true,
      priorityOrder: 2,
    };
  }

  if (
    norm.includes("machinelearning") ||
    (norm.includes("machine") && norm.includes("learning"))
  ) {
    return {
      status: "verified",
      badgeLabel: "Terverifikasi",
      badgeDescription: "Kurikulum akademik terverifikasi penuh bebas data sintetis (32 Bab SOTA).",
      shortDescription: "Kurikulum standar akademik terverifikasi bebas data sintetis berbasis Hastie (ESL), Bishop (PRML), Mitchell, dan scikit-learn SOTA.",
      isVerified: true,
      priorityOrder: 3,
    };
  }

  if (
    norm.includes("deeplearning") ||
    (norm.includes("deep") && norm.includes("learning"))
  ) {
    return {
      status: "verified",
      badgeLabel: "Terverifikasi",
      badgeDescription: "Kurikulum akademik terverifikasi penuh bebas data sintetis (18 Bab).",
      shortDescription: "Kurikulum arsitektur deep learning terverifikasi bebas data sintetis berbasis Goodfellow dan literatur primer.",
      isVerified: true,
      priorityOrder: 4,
    };
  }

  // 2. Cek AI Fundamentals / Artificial Intelligence (Prioritas 5)
  if (
    norm.includes("aifundamentals") ||
    norm.includes("artificialintelligencefundamentals") ||
    norm === "artificialintelligence" ||
    norm === "ai" ||
    (norm.includes("fundamental") && norm.includes("ai")) ||
    norm.includes("05aifundamentals")
  ) {
    return {
      status: "verified",
      badgeLabel: "Terverifikasi",
      badgeDescription: "Kurikulum akademik terverifikasi penuh bebas data sintetis (10 Bab / 100 Subbab).",
      shortDescription: "Kurikulum standar akademik terverifikasi bebas data sintetis berbasis Russell & Norvig (AIMA 4th Ed).",
      isVerified: true,
      priorityOrder: 5,
    };
  }

  // 3. Cek Computer Vision (Prioritas 6)
  if (
    norm.includes("computervision") ||
    norm.includes("08computervision") ||
    (norm.includes("computer") && norm.includes("vision"))
  ) {
    return {
      status: "verified",
      badgeLabel: "Terverifikasi",
      badgeDescription: "Kurikulum akademik terverifikasi penuh bebas data sintetis (18 Bab / 180 Subbab).",
      shortDescription: "Kurikulum standar akademik terverifikasi bebas data sintetis berbasis Szeliski, Forsyth & Ponce, dan literatur primer.",
      isVerified: true,
      priorityOrder: 6,
    };
  }

  // 4. Cek Natural Language Processing (Prioritas 7)
  if (
    norm.includes("naturallanguageprocessing") ||
    norm.includes("22naturallanguageprocessing") ||
    (norm.includes("natural") && norm.includes("language") && norm.includes("processing")) ||
    norm === "nlp"
  ) {
    return {
      status: "verified",
      badgeLabel: "Terverifikasi",
      badgeDescription: "Kurikulum akademik terverifikasi penuh bebas data sintetis (18 Bab / 180 Subbab).",
      shortDescription: "Kurikulum standar akademik terverifikasi bebas data sintetis berbasis Jurafsky & Martin (SLP3) dan literatur primer.",
      isVerified: true,
      priorityOrder: 7,
    };
  }

  // 5. Cek Large Language Models (Satu-satunya yang mempertahankan persentase 72% dari 130 subbab terverifikasi)
  if (
    norm.includes("largelanguagemodel") ||
    norm.includes("18largelanguagemodel") ||
    norm === "llm"
  ) {
    return {
      status: "in_development",
      badgeLabel: "Progres 72%",
      badgeDescription: "Kurikulum akademik tingkat lanjut: 13 Bab / 130 Subbab terverifikasi substantif.",
      shortDescription: "Model Bahasa Besar (LLM) tingkat lanjut: 130 subbab terverifikasi (Alignment, Reasoning, RAG, Long-Context).",
      isVerified: false,
      priorityOrder: 8,
    };
  }

  // 6. Topik yang Kontennya Sudah Ada di Repo Namun Belum Diverifikasi Penuh (Status: Dalam Review)
  if (norm.includes("timeseries") || norm.includes("deretwaktu") || norm.includes("forecasting")) {
    return {
      status: "under_review",
      badgeLabel: "Dalam Review",
      badgeDescription: "Kurikulum analisis deret waktu dan peramalan (15 Bab lengkap di repositori).",
      shortDescription: "Dekomposisi deret waktu, ARIMA/SARIMA, Prophet, Deep Learning (LSTM, PatchTST), dan deteksi anomali.",
      isVerified: false,
      priorityOrder: 12,
    };
  }

  if (norm.includes("recommendation") || norm.includes("rekomendasi")) {
    return {
      status: "under_review",
      badgeLabel: "Dalam Review",
      badgeDescription: "Kurikulum perancangan sistem rekomendasi enterprise (15 Bab lengkap di repositori).",
      shortDescription: "Collaborative filtering, matrix factorization (SVD, ALS), neural recommender, two-tower models, dan ranking.",
      isVerified: false,
      priorityOrder: 13,
    };
  }

  if (norm.includes("mlops") || (norm.includes("deployment") && !norm.includes("robotics"))) {
    return {
      status: "under_review",
      badgeLabel: "Dalam Review",
      badgeDescription: "Kurikulum rekayasa MLOps dan deployment model produksi (18 Bab lengkap + ML Bab 32).",
      shortDescription: "Siklus hidup MLOps: model registry, CI/CD pipeline, inference serving, monitoring drift, dan deployment Edge AI / TinyML.",
      isVerified: false,
      priorityOrder: 14,
    };
  }

  if (norm.includes("reinforcement")) {
    return {
      status: "under_review",
      badgeLabel: "Dalam Review",
      badgeDescription: "Kurikulum pembelajaran penguatan mendalam (15 Bab lengkap di repositori).",
      shortDescription: "Proses Keputusan Markov (MDP), persamaan Bellman, Dynamic Programming, Q-Learning, Policy Gradient, PPO, dan RLHF.",
      isVerified: false,
      priorityOrder: 15,
    };
  }

  if (norm.includes("security") || norm.includes("adversarial")) {
    return {
      status: "under_review",
      badgeLabel: "Dalam Review",
      badgeDescription: "Kurikulum keamanan sistem AI dan pertahanan adversarial (15 Bab lengkap di repositori).",
      shortDescription: "Keamanan AI: adversarial evasion attacks (FGSM/PGD), data poisoning, model stealing, prompt injection, dan pertahanan robust.",
      isVerified: false,
      priorityOrder: 16,
    };
  }

  if (norm.includes("responsibleai") || norm.includes("ethics") || norm.includes("governance")) {
    return {
      status: "under_review",
      badgeLabel: "Dalam Review",
      badgeDescription: "Kurikulum gabungan etika, transparansi, keadilan algoritma, dan tata kelola regulasi AI.",
      shortDescription: "Integrasi etika, fairness algoritma, transparansi, akuntabilitas, tata kelola AI, dan kepatuhan regulasi EU AI Act / NIST.",
      isVerified: false,
      priorityOrder: 17,
    };
  }

  if (norm.includes("aiklasik") || norm.includes("expertsystem") || norm.includes("knowledge") || norm.includes("computational")) {
    return {
      status: "under_review",
      badgeLabel: "Dalam Review",
      badgeDescription: "Kurikulum gabungan paradigma AI klasik simbolik dan komputasi lunak (sistem pakar, ontologi, fuzzy & algoritma genetika).",
      shortDescription: "Paradigma AI klasik: sistem pakar rule-based, logika deskripsi & ontologi knowledge graph, serta komputasi fuzzy dan genetika.",
      isVerified: false,
      priorityOrder: 18,
    };
  }

  if (norm.includes("agent") || norm.includes("autonomous")) {
    return {
      status: "under_review",
      badgeLabel: "Dalam Review",
      badgeDescription: "Kurikulum arsitektur agen otonom dan multi-agent reasoning (15 Bab lengkap).",
      shortDescription: "Arsitektur agen otonom: perencanaan (planning), memori hierarkis, tool execution, dan kolaborasi multi-agent.",
      isVerified: false,
      priorityOrder: 19,
    };
  }

  if (norm.includes("generative") || norm.includes("genai")) {
    return {
      status: "under_review",
      badgeLabel: "Dalam Review",
      badgeDescription: "Kurikulum model generatif modern dan multimodal AI (18 Bab lengkap).",
      shortDescription: "Model generatif modern: VAE, GAN, Model Difusi (DDPM, Stable Diffusion), dan bab lanjutan Multimodal AI.",
      isVerified: false,
      priorityOrder: 20,
    };
  }

  if (norm.includes("vectordatabase") || norm.includes("rag") || norm.includes("retrieval")) {
    return {
      status: "under_review",
      badgeLabel: "Dalam Review",
      badgeDescription: "Kurikulum basis data vektor dan retrieval-augmented generation (15 Bab lengkap).",
      shortDescription: "Retrieval-Augmented Generation: indexing vektor HNSW/IVF, dense & sparse retrieval, reranking, dan hybrid search.",
      isVerified: false,
      priorityOrder: 21,
    };
  }

  if (norm.includes("dataengineering") || norm.includes("bigdata")) {
    return {
      status: "under_review",
      badgeLabel: "Dalam Review",
      badgeDescription: "Kurikulum rekayasa data skala masif untuk kecerdasan buatan (18 Bab lengkap).",
      shortDescription: "Arsitektur data pipeline skala besar: data lakehouse, streaming data (Kafka), Spark terdistribusi, dan Airflow.",
      isVerified: false,
      priorityOrder: 22,
    };
  }

  // 7. Topik Baru Tanpa Konten di Repo (Status: Segera Hadir)
  if (norm.includes("promptengineering") || (norm.includes("prompt") && !norm.includes("sqlite"))) {
    return {
      status: "coming_soon",
      badgeLabel: "Segera Hadir",
      badgeDescription: "Kerangka silabus 10 bab: rekayasa instruksi, CoT, ReAct, output terstruktur, dan mitigasi halusinasi.",
      shortDescription: "Rekayasa instruksi terstruktur: zero/few-shot, Chain-of-Thought (CoT), ReAct framework, structured output, dan mitigasi halusinasi.",
      isVerified: false,
    };
  }

  if (norm.includes("sql") || norm.includes("basisdata") || norm.includes("database")) {
    return {
      status: "in_progress",
      badgeLabel: "Progres 3/12 Bab",
      badgeDescription: "Bab 1-3 sudah diimpor (status imported-unverified). Kode diuji di SQLite 3.45.1, belum diuji di PostgreSQL; rujukan belum diverifikasi.",
      shortDescription: "Sintaks SQL analitik (Window Functions, CTEs), model relasional Codd, kueri praktikum SQLite, dan transaksi ACID.",
      isVerified: false,
    };
  }

  // 8. Default Fallback untuk topik lainnya
  return {
    status: "coming_soon",
    badgeLabel: "Segera Hadir",
    badgeDescription: "Silabus kurikulum berstandar industri siap dipelajari secara bertahap.",
    shortDescription: "Modul kurikulum berstandar industri berbasis studi literatur resmi dan praktikum kode.",
    isVerified: false,
  };
}
