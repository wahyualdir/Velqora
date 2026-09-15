import { AcademicCurriculum } from "../types";
import { AI_FUNDAMENTALS_CHAPTERS } from "@/lib/ai-fundamentals-curriculum";

/**
 * KURIKULUM AKADEMIK: ARTIFICIAL INTELLIGENCE FUNDAMENTALS (TOPIK 5)
 * Rujukan Utama:
 * - Russell, S., & Norvig, P. (2020). Artificial Intelligence: A Modern Approach (4th ed.). Pearson.
 * - MIT OpenCourseWare 6.034: Artificial Intelligence (Patrick Winston).
 * - Stanford CS221: Artificial Intelligence: Principles and Techniques.
 */
export const aiFundamentalsCurriculum: AcademicCurriculum = {
  id: "ai-fundamentals",
  slug: "artificial-intelligence-fundamentals",
  title: "Artificial Intelligence Fundamentals",
  category: "Kecerdasan Buatan",
  level: "pemula",
  description: "Fondasi komprehensif kecerdasan buatan: agen cerdas, pemecahan masalah berbasis ruang pencarian (BFS, DFS, A*), representasi pengetahuan dan logika proposisional/predikat, hingga pengantar model keputusan dan machine learning.",
  estimatedHours: 48,
  version: "2.4.0",
  primaryReferences: [
    {
      title: "Artificial Intelligence: A Modern Approach (4th Edition)",
      authors: ["Stuart Russell", "Peter Norvig"],
      type: "book",
      url: "https://aima.cs.berkeley.edu/",
      relevance: "Buku teks rujukan utama agen rasional, pencarian graf, logika inferensi, dan teori keputusan.",
      year: 2020,
      publisherOrVenue: "Pearson",
    },
    {
      title: "MIT OpenCourseWare 6.034: Artificial Intelligence",
      authors: ["Patrick Winston"],
      type: "course",
      url: "https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/",
      relevance: "Silabus perkuliahan problem solving, search heuristics, dan rule-based systems.",
      year: 2010,
      publisherOrVenue: "MIT",
    },
    {
      title: "Stanford CS221: Artificial Intelligence: Principles and Techniques",
      authors: ["Percy Liang", "Dorsa Sadigh"],
      type: "course",
      url: "https://web.stanford.edu/class/archive/cs/cs221/cs221.1196/",
      relevance: "Struktur state-space models, constraint satisfaction, dan Markov decision processes.",
      year: 2023,
      publisherOrVenue: "Stanford University",
    },
  ],
  chapters: AI_FUNDAMENTALS_CHAPTERS.map((ch) => ({
    id: ch.id,
    slug: ch.slug || ch.id,
    title: ch.title,
    orderIndex: typeof ch.orderIndex === "number" ? ch.orderIndex : 1,
    description: ch.description || "",
    subchapters: (ch.subsections || []).map((sub) => ({
      id: sub.id,
      slug: sub.slug || sub.id,
      title: sub.title,
      orderIndex: typeof sub.orderIndex === "number" ? sub.orderIndex : 1,
      description: sub.description || "",
      content_markdown: sub.content_markdown || "",
      codeExamples: (sub.codeSnippets || []).map((snip) => ({
        id: snip.id,
        title: snip.caption || sub.title,
        language: (snip.language as any) || "python",
        filename: snip.caption || "example.py",
        code: snip.code,
        expectedOutput: "Lihat hasil eksekusi pada terminal",
        explanation: "Implementasi algoritma sesuai dengan perumusan teori pada materi subbab.",
      })),
    })),
  })),
};
