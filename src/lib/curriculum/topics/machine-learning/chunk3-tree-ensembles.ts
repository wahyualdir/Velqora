import { AcademicChapter } from "../../types";
import { chapter11 } from "./chunk3-ch11";
import { chapter12 } from "./chunk3-ch12";
import { chapter13 } from "./chunk3-ch13";
import { chapter14 } from "./chunk3-ch14";
import { chapter15 } from "./chunk3-ch15";

/**
 * CHUNK 3: NON-PARAMETRIK SPASIAL, POHON KEPUTUSAN, & SOTA ENSEMBLE LEARNING
 * Cakupan: Bab 11 s/d Bab 15 (Tepat 45 Subbab Asimetris Kanonikal)
 * 
 * - Bab 11: k-NN, Metrik Jarak, & Struktur Spasial: KD-Tree, Ball-Tree, HNSW (6 Subbab - Padat)
 * - Bab 12: Pohon Keputusan (CART): Kriteria Impuritas, Pruning, & Surrogate Splits (8 Subbab - Sedang)
 * - Bab 13: Bagging & Random Forest: OOB Error, Dekorelasi, & Feature Importance (MDI vs MDA) (9 Subbab - Sedang)
 * - Bab 14: SOTA Gradient Boosting: AdaBoost, Friedman GBM, XGBoost, LightGBM, & CatBoost (14 Subbab - Sangat Berat & Lengkap)
 * - Bab 15: Ensemble Lanjut: Stacking, Blending, Voting, & Kalibrasi Model Gabungan (8 Subbab - Sedang)
 * 
 * Total Subbab CHUNK 3: 6 + 8 + 9 + 14 + 8 = 45 Subbab.
 * Akumulasi Kumulatif (Chunk 1 + Chunk 2 + Chunk 3): 38 + 47 + 45 = 130 Subbab.
 * 
 * Rujukan Literatur Primer:
 * - [ESL] Hastie, Tibshirani, Friedman - The Elements of Statistical Learning (Springer)
 * - [ISLR v2] James, Witten, Hastie, Tibshirani - An Introduction to Statistical Learning (Springer)
 * - [Breiman 2001] Leo Breiman - Random Forests (Machine Learning)
 * - [Friedman 2001] Jerome H. Friedman - Greedy Function Approximation: A Gradient Boosting Machine (Annals of Statistics)
 * - [Chen & Guestrin 2016] Tianqi Chen, Carlos Guestrin - XGBoost: A Scalable Tree Boosting System (KDD '16)
 * - [Ke et al. 2017] Guolin Ke et al. - LightGBM: A Highly Efficient Gradient Boosting Decision Tree (NeurIPS 2017)
 * - [Prokhorenkova et al. 2018] Liudmila Prokhorenkova et al. - CatBoost: unbiased boosting with categorical features (NeurIPS 2018)
 * - [Wolpert 1992] David H. Wolpert - Stacked Generalization (Neural Networks)
 */

export const chunk3TreeEnsembles: AcademicChapter[] = [
  chapter11,
  chapter12,
  chapter13,
  chapter14,
  chapter15,
];

export {
  chapter11,
  chapter12,
  chapter13,
  chapter14,
  chapter15,
};
