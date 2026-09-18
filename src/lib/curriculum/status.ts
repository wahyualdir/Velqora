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

// 5 Topik yang telah selesai ditulis ulang 100% dan lulus uji rujukan resmi
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
  "05-ai-fundamentals"
];

// Topik dalam pengembangan berikutnya (Batch 1: Computer Vision, NLP, LLM)
const IN_DEVELOPMENT_PATTERNS: string[] = [
  "computer-vision",
  "natural-language-processing",
  "large-language-models"
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
      badgeDescription: "Kurikulum akademik terverifikasi penuh bebas data sintetis (22 Bab).",
      shortDescription: "Kurikulum standar akademik terverifikasi bebas data sintetis.",
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

  // 3. Seluruh 23 Topik Cangkang Boilerplate Lainnya
  return {
    status: "under_review",
    badgeLabel: "Sedang Ditinjau Ulang",
    badgeDescription: "Draf kurikulum sedang dalam proses peninjauan ulang & perombakan materi ke standar industri.",
    shortDescription: "Draf materi sedang ditinjau ulang & direvisi ke standar industri.",
    isVerified: false,
  };
}
