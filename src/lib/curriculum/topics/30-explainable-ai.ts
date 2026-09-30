import { AcademicCurriculum, AcademicChapter } from "../types";
import { chapter31 } from "./machine-learning/chunk7-ch31";

/**
 * KURIKULUM AKADEMIK RESMI: EXPLAINABLE AI (XAI)
 * Standar: University-Grade / Advanced Engineering Curriculum
 * Rujukan Kanonikal: Cynthia Rudin (Nature MI 2019), Scott M. Lundberg & Su-In Lee (NeurIPS 2017),
 * Marco Tulio Ribeiro, Sameer Singh, Carlos Guestrin (KDD 2016), Mukund Sundararajan (2017).
 * 
 * Materi disalin dari bab interpretabilitas chunk7-ch31.ts
 * tanpa menghapus berkas sumber aslinya di modul Machine Learning.
 */

const chapterTitles = [
  "Bab 1: Krisis Model Kotak Hitam (Black-Box Problem) & Regulasi Transparansi AI",
  "Bab 2: Interpretabilitas Intrinsik: Model Linier Terstandarisasi & Aturan Keputusan Pohon Dangkal",
  "Bab 3: Metodologi Post-Hoc Model-Agnostic: Permutation Feature Importance (PFI)",
  "Bab 4: Analisis Marginal Model: Partial Dependence Plots (PDP) & ICE Curves",
  "Bab 5: Local Interpretable Model-agnostic Explanations (LIME)",
  "Bab 6: Teori Shapley Values dari Teori Permainan Koperasi: 4 Aksioma Keadilan",
  "Bab 7: Framework SHAP & Atribusi Aksiomatik: TreeSHAP, KernelSHAP, & Integrated Gradients",
];

export const xaiChapters: AcademicChapter[] = chapter31.subchapters.map((sub, idx) => ({
  id: `xai-ch-0${idx + 1}`,
  slug: sub.slug.replace(/^\d+-\d+-?/, ""),
  title: chapterTitles[idx] || `Bab ${idx + 1}: ${sub.title.replace(/^31\.\d+\s*/, "")}`,
  orderIndex: idx + 1,
  description: sub.description,
  coreConcepts: sub.learningObjectives || [],
  subchapters: [
    {
      ...sub,
      id: `xai-sub-0${idx + 1}-1`,
      slug: `0${idx + 1}-1-${sub.slug.replace(/^\d+-\d+-?/, "")}`,
      title: `${idx + 1}.1 ${sub.title.replace(/^31\.\d+\s*/, "")}`,
      orderIndex: 1,
    },
  ],
}));

export const explainableAiCurriculum: AcademicCurriculum = {
  id: "explainable-ai",
  slug: "explainable-ai",
  title: "Explainable AI (XAI)",
  category: "Kecerdasan Buatan",
  level: "menengah",
  description: "Kurikulum komprehensif interpretabilitas model dan Explainable AI: krisis model kotak hitam (Black-Box Problem), regulasi kepatuhan GDPR & EU AI Act Article 14, model transparan intrinsik glass-box (EBM, linear, tree lists), Permutation Feature Importance (PFI), analisis marginal PDP & ICE curves, model aproksimasi lokal LIME, teori nilai Shapley 4 aksioma keadilan, framework SHAP (TreeSHAP, KernelSHAP), serta atribusi aksiomatik jaringan dalam (Integrated Gradients).",
  estimatedHours: 60,
  version: "1.0.0",
  auditStatus: "VERIFIED",
  primaryReferences: [
    {
      id: "src-xai-rudin",
      title: "Stop explaining black box machine learning models for high stakes decisions and use interpretable models instead",
      authors: ["Cynthia Rudin"],
      type: "paper",
      url: "https://doi.org/10.1038/s42256-019-0048-x",
      sourceType: "paper",
      provider: "Nature Machine Intelligence (2019)",
      relevance: "Kritik ilmiah fundamental terhadap metode post-hoc dan advokasi model transparan inheren pada domain kritis.",
      verified: true,
      lastChecked: "2026-09-20",
    },
    {
      id: "src-xai-shap",
      title: "A Unified Approach to Interpreting Model Predictions",
      authors: ["Scott M. Lundberg", "Su-In Lee"],
      type: "paper",
      url: "https://proceedings.neurips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html",
      sourceType: "paper",
      provider: "NeurIPS 2017",
      relevance: "Paper seminal yang menyatukan enam metode atribusi fitur sebelumnya di bawah teori Shapley Values.",
      verified: true,
      lastChecked: "2026-09-20",
    },
    {
      id: "src-xai-lime",
      title: "\"Why Should I Trust You?\": Explaining the Predictions of Any Classifier",
      authors: ["Marco Tulio Ribeiro", "Sameer Singh", "Carlos Guestrin"],
      type: "paper",
      url: "https://doi.org/10.1145/2939672.2939778",
      sourceType: "paper",
      provider: "ACM KDD 2016",
      relevance: "Perumusan formal model pengganti lokal (local surrogate models) terbobot eksponensial.",
      verified: true,
      lastChecked: "2026-09-20",
    },
    {
      id: "src-xai-intgrad",
      title: "Axiomatic Attribution for Deep Networks",
      authors: ["Mukund Sundararajan", "Ankur Taly", "Qiqi Yan"],
      type: "paper",
      url: "https://arxiv.org/abs/1703.01365",
      sourceType: "paper",
      provider: "ICML 2017",
      relevance: "Landasan aksiomatik atribusi gradien terintegrasi untuk jaringan saraf tiruan dalam (Deep Neural Networks).",
      verified: true,
      lastChecked: "2026-09-20",
    },
  ],
  chapters: xaiChapters,
};
