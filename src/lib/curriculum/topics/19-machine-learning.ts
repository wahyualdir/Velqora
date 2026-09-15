import { AcademicCurriculum } from "../types";
import { SCIKIT_LEARN_USER_GUIDE_SECTIONS } from "@/lib/scikit-learn-curriculum";

/**
 * KURIKULUM AKADEMIK: MACHINE LEARNING (TOPIK 19)
 * Rujukan Utama:
 * - Scikit-Learn 1.9 User Guide & API Reference (Pedregosa et al., 2011).
 * - Hastie, T., Tibshirani, R., & Friedman, J. (2009). The Elements of Statistical Learning. Springer.
 * - Bishop, C. M. (2006). Pattern Recognition and Machine Learning. Springer.
 */
export const machineLearningCurriculum: AcademicCurriculum = {
  id: "machine-learning",
  slug: "machine-learning",
  title: "Machine Learning",
  category: "Kecerdasan Buatan",
  level: "menengah",
  description: "Kurikulum komprehensif pembelajaran mesin berbasis Scikit-Learn 1.9 User Guide resmi: 22 BAB kurikulum dengan subbab hierarkis, formulasi matematis formal (LaTeX KaTeX), analisis kompleksitas komputasi, tabel parameter, dan kode Python runnable.",
  estimatedHours: 68,
  version: "2.4.0",
  primaryReferences: [
    {
      title: "Scikit-learn: Machine Learning in Python",
      authors: ["Fabian Pedregosa", "Gaël Varoquaux", "Alexandre Gramfort", "Vincent Michel", "Bertrand Thirion", "Olivier Grisel", "Mathieu Blondel", "Peter Prettenhofer", "Ron Weiss", "Vincent Dubourg"],
      type: "paper",
      url: "https://jmlr.csail.mit.edu/papers/v12/pedregosa11a.html",
      relevance: "Dokumentasi dan arsitektur estimator, transformer, dan pipeline Scikit-Learn standar industri.",
      year: 2011,
      publisherOrVenue: "Journal of Machine Learning Research (JMLR)",
    },
    {
      title: "The Elements of Statistical Learning: Data Mining, Inference, and Prediction",
      authors: ["Trevor Hastie", "Robert Tibshirani", "Jerome Friedman"],
      type: "book",
      url: "https://hastie.su.domains/ElemStatLearn/",
      relevance: "Teori matematika regresi linear/logistik berregularisasi, Support Vector Machines, dan ensemble trees.",
      year: 2009,
      publisherOrVenue: "Springer",
    },
  ],
  chapters: SCIKIT_LEARN_USER_GUIDE_SECTIONS.map((ch) => ({
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
        expectedOutput: "Hasil evaluasi model Scikit-Learn",
        explanation: "Implementasi algoritma Scikit-Learn resmi sesuai dengan perumusan teori subbab.",
      })),
    })),
  })),
};
