import { AcademicChapter } from "../../types";
import { chapter06 } from "./chunk2-ch06";
import { chapter07 } from "./chunk2-ch07";
import { chapter08 } from "./chunk2-ch08";
import { chapter09 } from "./chunk2-ch09";
import { chapter10 } from "./chunk2-ch10";

/**
 * CHUNK 2: REGRESI, REGULARISASI, KLASIFIKASI LINIER, GLM & SVM
 * Cakupan: Bab 06 s/d Bab 10 (Tepat 47 Subbab Asimetris Kanonikal)
 * 
 * - Bab 06: Regresi Linier OLS, Teorema Gauss-Markov, & Diagnostik (10 Subbab)
 * - Bab 07: Regularisasi Linier Lanjut: Ridge, Lasso, ElasticNet, LARS, & SCAD (11 Subbab)
 * - Bab 08: Model Klasifikasi Linier: Regresi Logistik, Softmax, & Pemisahan Hyperplane (9 Subbab)
 * - Bab 09: Generalized Linear Models (GLM) & Regresi Robust: Huber, RANSAC, Theil-Sen (8 Subbab)
 * - Bab 10: Support Vector Machines (SVM) & Kernel Methods: KKT, Dual, RBF (9 Subbab)
 * 
 * Total Subbab CHUNK 2: 10 + 11 + 9 + 8 + 9 = 47 Subbab.
 * 
 * Rujukan Literatur Primer:
 * - [ESL] Hastie, Tibshirani, Friedman - The Elements of Statistical Learning (Springer)
 * - [ISLR v2] James, Witten, Hastie, Tibshirani - An Introduction to Statistical Learning (Springer)
 * - [PML1] Kevin P. Murphy - Probabilistic Machine Learning: An Introduction (MIT Press)
 * - [PRML] Christopher M. Bishop - Pattern Recognition and Machine Learning (Springer)
 * - [Boyd] Stephen Boyd, Lieven Vandenberghe - Convex Optimization (Cambridge University Press)
 * - [Scholkopf] Bernhard Schölkopf, Alexander J. Smola - Learning with Kernels (MIT Press)
 */

export const chunk2LinearModels: AcademicChapter[] = [
  chapter06,
  chapter07,
  chapter08,
  chapter09,
  chapter10,
];

export {
  chapter06,
  chapter07,
  chapter08,
  chapter09,
  chapter10,
};
