import { AcademicChapter } from "../../types";
import { chapter01 } from "./chunk1-ch01";
import { chapter02 } from "./chunk1-ch02";
import { chapter03 } from "./chunk1-ch03";
import { chapter04 } from "./chunk1-ch04";
import { chapter05 } from "./chunk1-ch05";

/**
 * CHUNK 1: FONDASI MATEMATIKA, PROBABILITAS, TEORI ESTIMASI & OPTIMASI NUMERIK
 * Cakupan: Bab 01 s/d Bab 05 (Tepat 38 Subbab Asimetris Kanonikal)
 * 
 * - Bab 01: Paradigma Machine Learning & Perumusan Masalah Ilmiah (6 Subbab)
 * - Bab 02: Aljabar Linier Komputasional & Kalkulus Matriks (8 Subbab)
 * - Bab 03: Teori Probabilitas, Estimasi Parameter, & Bayesian Inference (8 Subbab)
 * - Bab 04: Teori Belajar Statistik & Dekomposisi Bias-Variance (7 Subbab)
 * - Bab 05: Optimasi Numerik untuk Machine Learning (9 Subbab)
 * 
 * Rujukan Literatur Primer:
 * - [ESL] Hastie, Tibshirani, Friedman - The Elements of Statistical Learning (Springer)
 * - [ISLR v2] James, Witten, Hastie, Tibshirani - An Introduction to Statistical Learning (Springer)
 * - [PML] Kevin P. Murphy - Probabilistic Machine Learning: An Introduction (MIT Press)
 * - [Boyd] Stephen Boyd, Lieven Vandenberghe - Convex Optimization (Cambridge University Press)
 * - [Mitchell] Tom M. Mitchell - Machine Learning (McGraw-Hill)
 */

export const chunk1Foundations: AcademicChapter[] = [
  chapter01,
  chapter02,
  chapter03,
  chapter04,
  chapter05,
];

export {
  chapter01,
  chapter02,
  chapter03,
  chapter04,
  chapter05,
};
