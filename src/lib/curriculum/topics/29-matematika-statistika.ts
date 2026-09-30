import { AcademicCurriculum, AcademicChapter } from "../types";
import {
  chapter01,
  chapter02,
  chapter03,
  chapter04,
  chapter05,
} from "./machine-learning/chunk1-foundations";

/**
 * KURIKULUM AKADEMIK RESMI: MATEMATIKA & STATISTIKA UNTUK AI
 * Standar: University-Grade / Advanced Engineering Curriculum
 * Rujukan Kanonikal: Hastie, Tibshirani, Friedman (ESL); Kevin P. Murphy (PML);
 * Stephen Boyd & Lieven Vandenberghe (Convex Optimization); Tom M. Mitchell (ML).
 * 
 * Materi disalin dari Fondasi chunk1-foundations.ts (Bab 1 - 5, 38 Subbab Asimetris Kanonikal)
 * tanpa menghapus berkas sumber aslinya.
 */

// Adaptasi bab dengan ID dan Slug unik untuk mencegah tabrakan rute dengan modul Machine Learning
export const mathStatChapters: AcademicChapter[] = [
  {
    ...chapter01,
    id: "math-stat-ch-01",
    slug: "bab-01-paradigma-komputasi-perumusan-masalah-ilmiah",
    title: "Bab 1: Paradigma Komputasi & Perumusan Masalah Ilmiah",
    orderIndex: 1,
    subchapters: chapter01.subchapters.map((sub, idx) => ({
      ...sub,
      id: `math-01-${idx + 1}`,
      slug: `math-01-${idx + 1}-${sub.slug.replace(/^\d+-\d+-?/, "")}`,
    })),
  },
  {
    ...chapter02,
    id: "math-stat-ch-02",
    slug: "bab-02-aljabar-linier-komputasional-kalkulus-matriks",
    title: "Bab 2: Aljabar Linier Komputasional & Kalkulus Matriks",
    orderIndex: 2,
    subchapters: chapter02.subchapters.map((sub, idx) => ({
      ...sub,
      id: `math-02-${idx + 1}`,
      slug: `math-02-${idx + 1}-${sub.slug.replace(/^\d+-\d+-?/, "")}`,
    })),
  },
  {
    ...chapter03,
    id: "math-stat-ch-03",
    slug: "bab-03-teori-probabilitas-estimasi-parameter-bayesian-inference",
    title: "Bab 3: Teori Probabilitas, Estimasi Parameter, & Bayesian Inference",
    orderIndex: 3,
    subchapters: chapter03.subchapters.map((sub, idx) => ({
      ...sub,
      id: `math-03-${idx + 1}`,
      slug: `math-03-${idx + 1}-${sub.slug.replace(/^\d+-\d+-?/, "")}`,
    })),
  },
  {
    ...chapter04,
    id: "math-stat-ch-04",
    slug: "bab-04-teori-belajar-statistik-dekomposisi-bias-variance",
    title: "Bab 4: Teori Belajar Statistik & Dekomposisi Bias-Variance",
    orderIndex: 4,
    subchapters: chapter04.subchapters.map((sub, idx) => ({
      ...sub,
      id: `math-04-${idx + 1}`,
      slug: `math-04-${idx + 1}-${sub.slug.replace(/^\d+-\d+-?/, "")}`,
    })),
  },
  {
    ...chapter05,
    id: "math-stat-ch-05",
    slug: "bab-05-optimasi-numerik-untuk-machine-learning",
    title: "Bab 5: Optimasi Numerik untuk Machine Learning & AI",
    orderIndex: 5,
    subchapters: chapter05.subchapters.map((sub, idx) => ({
      ...sub,
      id: `math-05-${idx + 1}`,
      slug: `math-05-${idx + 1}-${sub.slug.replace(/^\d+-\d+-?/, "")}`,
    })),
  },
];

export const matematikaStatistikaCurriculum: AcademicCurriculum = {
  id: "matematika-statistika-untuk-ai",
  slug: "matematika-statistika-untuk-ai",
  title: "Matematika & Statistika untuk AI",
  category: "Kecerdasan Buatan",
  level: "pemula",
  description: "Fondasi matematika analitis, aljabar linier komputasional, kalkulus multivariat matriks, teori probabilitas aksiomatik, estimasi parameter MLE & MAP, dekomposisi bias-variance teori belajar statistik, serta optimasi numerik cembung (Convex Optimization) untuk machine learning dan AI.",
  estimatedHours: 85,
  version: "1.0.0",
  auditStatus: "VERIFIED",
  primaryReferences: [
    {
      id: "src-math-esl",
      title: "The Elements of Statistical Learning: Data Mining, Inference, and Prediction (2nd Edition)",
      authors: ["Trevor Hastie", "Robert Tibshirani", "Jerome Friedman"],
      type: "book",
      url: "https://hastie.su.domains/ElemStatLearn/",
      sourceType: "academic-book",
      provider: "Springer",
      relevance: "Rujukan kanonikal dekomposisi bias-variance, teori belajar statistik VC-dimension, dan inferensi keteraturan data.",
      verified: true,
      lastChecked: "2026-09-20",
    },
    {
      id: "src-math-boyd",
      title: "Convex Optimization",
      authors: ["Stephen Boyd", "Lieven Vandenberghe"],
      type: "book",
      url: "https://web.stanford.edu/~boyd/cvxbook/",
      sourceType: "academic-book",
      provider: "Cambridge University Press",
      relevance: "Buku standar dunia untuk optimasi cembung, kondisi Karush-Kuhn-Tucker (KKT), metode gradien terkonjugasi, dan dualitas Lagrange.",
      verified: true,
      lastChecked: "2026-09-20",
    },
    {
      id: "src-math-murphy",
      title: "Probabilistic Machine Learning: An Introduction",
      authors: ["Kevin P. Murphy"],
      type: "book",
      url: "https://probml.github.io/pml-book/book1.html",
      sourceType: "academic-book",
      provider: "MIT Press",
      relevance: "Landasan komprehensif teori probabilitas multivariat, inferensi Bayesian, estimasi parameter MLE/MAP, dan teori informasi.",
      verified: true,
      lastChecked: "2026-09-20",
    },
  ],
  chapters: mathStatChapters,
};
