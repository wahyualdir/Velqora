import { OptimizationProposal } from "./types";

export interface ExplanationAnswerItem {
  questionNumber: number;
  question: string;
  answer: string;
}

export interface ComprehensiveExplanationReport {
  title: string;
  summary: string;
  answers: ExplanationAnswerItem[];
}

/**
 * Generates transparent, verifiable answers to the 10 core academic schedule orchestration questions.
 * Adheres strictly to Calm Academic tone with zero AI marketing hype.
 */
export function generateComprehensiveExplanation(
  proposal: OptimizationProposal
): ComprehensiveExplanationReport {
  const answers: ExplanationAnswerItem[] = [
    {
      questionNumber: 1,
      question: "Apa yang berubah?",
      answer:
        proposal.affectedSessions.length > 0
          ? `${proposal.affectedSessions.length} sesi belajar mandiri diusulkan untuk dipindahkan antar-hari demi penyeimbangan beban.`
          : "Tidak ada pemindahan jadwal yang diusulkan saat ini.",
    },
    {
      questionNumber: 2,
      question: "Mengapa sistem menyarankan perubahan?",
      answer:
        proposal.explanation ||
        "Untuk mencegah penumpukan waktu belajar pada satu hari yang dapat menurunkan efektivitas dan memicu kelelahan belajar.",
    },
    {
      questionNumber: 3,
      question: "Apa data yang dipertimbangkan?",
      answer:
        "Jadwal kuliah tetap, durasi sesi belajar, batas beban harian maksimal, tenggat tugas terdekat, dan jeda istirahat minimal 30 menit.",
    },
    {
      questionNumber: 4,
      question: "Apa manfaatnya?",
      answer: `Meningkatkan skor distribusi beban sebesar ${proposal.improvementScore} poin dan meratakan waktu belajar ke hari yang lebih lengang.`,
    },
    {
      questionNumber: 5,
      question: "Apa risikonya?",
      answer:
        proposal.risks.length > 0
          ? proposal.risks.join(" ")
          : "Risiko minimal; usulan telah lolos filter keselamatan tanpa memicu bentrok atau mengurangi jeda istirahat.",
    },
    {
      questionNumber: 6,
      question: "Apa yang dikorbankan?",
      answer:
        "Pengguna perlu menyesuaikan rutinitas belajar pada hari yang baru dialokasikan.",
    },
    {
      questionNumber: 7,
      question: "Apakah ada konflik?",
      answer:
        proposal.conflictsIntroduced === 0
          ? "Tidak ada bentrok jadwal baru yang ditimbulkan oleh usulan ini (Zero-Conflict Invariant terpenuhi)."
          : `Peringatan: terdapat ${proposal.conflictsIntroduced} potensi tumpang tindih waktu.`,
    },
    {
      questionNumber: 8,
      question: "Bagaimana deadline terpengaruh?",
      answer: `Cakupan waktu belajar sebelum tenggat tugas berada pada tingkat ${proposal.deadlineCoverageAfter}%.`,
    },
    {
      questionNumber: 9,
      question: "Bagaimana workload terpengaruh?",
      answer:
        "Beban harian pada hari sibuk berkurang dan dialihkan ke slot bebas di hari lain tanpa melampaui batas maksimal harian.",
    },
    {
      questionNumber: 10,
      question: "Apa alternatif berikutnya?",
      answer:
        proposal.alternatives.length > 0
          ? proposal.alternatives.join(" ")
          : "Pengguna dapat mempertahankan jadwal lama atau memindahkan sesi belajar secara manual sesuai kebutuhan.",
    },
  ];

  return {
    title: "Transparansi Usulan Optimasi Jadwal (10 Faktor Evaluasi)",
    summary: proposal.explanation,
    answers,
  };
}
