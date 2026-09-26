import { AcademicChapter } from "../../types";
import { chapter10 } from "./chunk3-ch10";
import { chapter11 } from "./chunk3-ch11";
import { chapter12 } from "./chunk3-ch12";
import { chapter13 } from "./chunk3-ch13";

/**
 * CHUNK 3: MODEL GENERATIF, SUPPORT VECTOR MACHINES, METODE KERNEL, & k-NN
 * Cakupan: Bab 10 s/d Bab 13 (Tepat 23 Subbab Kanonikal)
 * - Bab 10: Generative Classifiers: LDA, QDA, & Naive Bayes (6 Subbab)
 * - Bab 11: Support Vector Machines: Hard/Soft Margin & Dualitas Wolfe (5 Subbab)
 * - Bab 12: Kernel Methods & Teorema Mercer (RKHS, RBF, & Kernel Ridge) (6 Subbab)
 * - Bab 13: k-Nearest Neighbors, Metrik Jarak, & Indeks Spasial HNSW (6 Subbab)
 */
export const chunk3GenerativeSvmKnn: AcademicChapter[] = [
  chapter10,
  chapter11,
  chapter12,
  chapter13,
];

export {
  chapter10,
  chapter11,
  chapter12,
  chapter13,
};
