/**
 * Single Source of Truth (SSOT) untuk status audit dan jaminan kualitas
 * seluruh 28 topik kurikulum di platform Velqora.
 * 
 * Modul ini memisahkan status verifikasi UI dari konten kurikulum itu sendiri,
 * memberikan sinyal jujur dan transparan bagi pengguna tanpa memodifikasi file data.
 */

export type TopicStatus = "verified" | "under_review" | "in_development";

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
  "05-ai-fundamentals",
  "computer-vision",
  "computervision",
  "08-computer-vision",
  "natural-language-processing",
  "naturallanguageprocessing",
  "22-natural-language-processing"
];

// Topik dalam pengembangan berikutnya (Batch 1: LLM 72% / 130 Subbab)
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

  // 1. Cek Topik Terverifikasi (Prioritas 1-4)
  if (
    norm.includes("dataanalyst") ||
    (norm.includes("analyst") && !norm.includes("kpi"))
  ) {
    return {
      status: "verified",
      badgeLabel: "Terverifikasi 100%",
      badgeDescription: "Kurikulum akademik terverifikasi penuh bebas data sintetis (10 Bab).",
      shortDescription: "Kurikulum standar akademik terverifikasi bebas data sintetis.",
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
      badgeLabel: "Terverifikasi 100%",
      badgeDescription: "Kurikulum akademik terverifikasi penuh bebas data sintetis (16 Bab).",
      shortDescription: "Kurikulum standar akademik terverifikasi bebas data sintetis.",
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
      badgeLabel: "Terverifikasi 100%",
      badgeDescription: "Kurikulum akademik terverifikasi penuh bebas data sintetis (22 Bab / 200 Subbab SOTA).",
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
      badgeLabel: "Terverifikasi 100%",
      badgeDescription: "Kurikulum akademik terverifikasi penuh bebas data sintetis (18 Bab).",
      shortDescription: "Kurikulum standar akademik terverifikasi bebas data sintetis.",
      isVerified: true,
      priorityOrder: 4,
    };
  }

  // 2. Cek AI Fundamentals (Prioritas 5: Terverifikasi Penuh 10 Bab / 100 Subbab)
  if (
    norm.includes("aifundamentals") ||
    norm.includes("artificialintelligencefundamentals") ||
    (norm.includes("fundamental") && norm.includes("ai")) ||
    norm.includes("05aifundamentals")
  ) {
    return {
      status: "verified",
      badgeLabel: "Terverifikasi 100%",
      badgeDescription: "Kurikulum akademik terverifikasi penuh bebas data sintetis (10 Bab / 100 Subbab).",
      shortDescription: "Kurikulum standar akademik terverifikasi bebas data sintetis berbasis Russell & Norvig (AIMA 4th Ed).",
      isVerified: true,
      priorityOrder: 5,
    };
  }

  // 3. Cek Computer Vision (Prioritas 6: Terverifikasi Penuh 18 Bab / 180 Subbab)
  if (
    norm.includes("computervision") ||
    norm.includes("08computervision") ||
    (norm.includes("computer") && norm.includes("vision"))
  ) {
    return {
      status: "verified",
      badgeLabel: "Terverifikasi 100%",
      badgeDescription: "Kurikulum akademik terverifikasi penuh bebas data sintetis (18 Bab / 180 Subbab).",
      shortDescription: "Kurikulum standar akademik terverifikasi bebas data sintetis berbasis Szeliski, Forsyth & Ponce, dan literatur primer.",
      isVerified: true,
      priorityOrder: 6,
    };
  }

  // 4. Cek Natural Language Processing (Prioritas 7: Terverifikasi Penuh 18 Bab / 180 Subbab)
  if (
    norm.includes("naturallanguageprocessing") ||
    norm.includes("22naturallanguageprocessing") ||
    (norm.includes("natural") && norm.includes("language") && norm.includes("processing")) ||
    norm === "nlp"
  ) {
    return {
      status: "verified",
      badgeLabel: "Terverifikasi 100%",
      badgeDescription: "Kurikulum akademik terverifikasi penuh bebas data sintetis (18 Bab / 180 Subbab).",
      shortDescription: "Kurikulum standar akademik terverifikasi bebas data sintetis berbasis Jurafsky & Martin (SLP3) dan literatur primer.",
      isVerified: true,
      priorityOrder: 7,
    };
  }

  // 5. Cek Large Language Models (Prioritas 8: Progres 130 / 180 Subbab Terverifikasi)
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

  // 6. Seluruh 20 Topik Cangkang Draf Lainnya
  return {
    status: "under_review",
    badgeLabel: "Sedang Ditinjau Ulang",
    badgeDescription: "Draf kurikulum sedang dalam proses peninjauan ulang & perombakan materi ke standar industri.",
    shortDescription: "Draf materi sedang ditinjau ulang & direvisi ke standar industri.",
    isVerified: false,
  };
}
