import { AcademicChapter } from "../../types";
import { chapter06 } from "./chunk2-ch06";
import { chapter07 } from "./chunk2-ch07";
import { chapter08 } from "./chunk2-ch08";
import { chapter09 } from "./chunk2-ch09";

/**
 * CHUNK 2: MODEL LINIER, REGULARISASI, KLASIFIKASI & GLM
 * Cakupan: Bab 06 s/d Bab 09 (Tepat 23 Subbab Kanonikal)
 * - Bab 06: Regresi Linier OLS, Teorema Gauss-Markov, & Diagnostik Residual (6 Subbab)
 * - Bab 07: Regularisasi Linier Lanjut: Ridge, Lasso, ElasticNet, LARS, & SCAD (6 Subbab)
 * - Bab 08: Model Klasifikasi Linier: Regresi Logistik, Softmax, & IRLS (6 Subbab)
 * - Bab 09: Generalized Linear Models (GLM) & Exponential Family (5 Subbab)
 */
export const chunk2LinearModels: AcademicChapter[] = [
  chapter06,
  chapter07,
  chapter08,
  chapter09,
];

export {
  chapter06,
  chapter07,
  chapter08,
  chapter09,
};
