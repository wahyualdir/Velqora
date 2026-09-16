# RENCANA BATCH MIGRASI KURIKULUM (PHASE 2.4)
**Dokumen Referensi**: VELQORA-PLAN-PHASE-2.4-01  
**Lead Architect**: Senior Curriculum Architect & QA Engineer  
**Tanggal Penyusunan**: 16 September 2026  
**Status**: ACTIVE & PROPOSED (13 Batch Bertahap, Maksimal 2 Topik per Batch)

---

## 1. Prinsip & Aturan Eksekusi Batch

1. **Prinsip Modularitas Bertahap**: 26 topik warisan dibagi secara ketat ke dalam **13 Batch**, masing-masing terdiri dari tepat **2 topik**.
2. **Ketergantungan Terurut (*Strict Topological Order*)**: Batch berikutnya hanya boleh dimulai setelah batch sebelumnya lulus seluruh 20 kriteria akseptasi, audit kode nyata, pengujian negatif, dan verifikasi antarmuka pembaca.
3. **Pemberian Tag Rilis per Batch**: Setiap batch yang lulus akan ditandai dengan commit terisolasi dan git tag:
   `phase-2.4-batch-<N>-acceptance`
4. **Isolasi Rollback**: Setiap batch memiliki referensi commit snapshot sebelumnya untuk memudahkan rollback instan jika ditemukan regresi mutu.
5. **Kebijakan Flag `legacy-synthetic`**: Flag ini tetap dipertahankan pada topik yang belum dimigrasikan. Penghapusan flag hanya diizinkan untuk topik yang telah lulus seluruh pengujian batch.

---

## 2. Peta Rencana 13 Batch Migrasi

| Batch No | Topik yang Dimigrasikan | Fokus Keilmuan Utama | Rujukan Kanonikal Utama | Target Status |
|:---:|---|---|---|:---:|
| **Batch 1** | `deep-learning` & `data-science` | Arsitektur Jaringan Saraf Tiruan, Autograd, Backprop & Alur Kerja Data Science | Goodfellow MIT Press, PyTorch Docs, Hastie ESL | Prioritas 1 |
| **Batch 2** | `natural-language-processing` & `computer-vision` | Pemrosesan Bahasa Alami (Embedding/RNN) & Visi Komputer (CNN/Transformasi Citra) | Jurafsky & Martin, Szeliski, He et al. ResNet | Prioritas 2 |
| **Batch 3** | `large-language-model` & `generative-ai` | Arsitektur Transformer, Fine-Tuning LLM & Pemodelan Difusi Generatif | Vaswani et al., Devlin BERT, Ho et al. DDPM | Prioritas 3 |
| **Batch 4** | `data-engineering-ai` & `vector-database-retrieval` | Pipeline Data Skala Besar, Indeks Vektor HNSW, dan Arsitektur RAG | Kleppmann, Malkov & Yashunin (HNSW), DuckDB | Prioritas 4 |
| **Batch 5** | `reinforcement-learning` & `ai-agent` | Markov Decision Processes, Q-Learning, dan Agen Otonom ReAct | Sutton & Barto, Russell & Norvig AIMA | Prioritas 5 |
| **Batch 6** | `mlops-deployment` & `edge-ai-tinyml` | CI/CD Model, Serving FastAPI, Kuantisasi Model Int8 & TinyML | Google MLOps Whitepaper, Warden & Situnayake | Prioritas 6 |
| **Batch 7** | `graph-neural-network` & `time-series-forecasting` | Message Passing GNN & Pemodelan Data Temporal Multivariabel | Hamilton GNN, Box & Jenkins, Hyndman FPP | Prioritas 7 |
| **Batch 8** | `recommendation-system` & `multimodal-ai` | Matrix Factorization, Two-Tower Models & Penyelarasan Cross-Modal | Ricci et al., Radford et al. CLIP | Prioritas 8 |
| **Batch 9** | `speech-audio-ai` & `robotics-embodied-ai` | Ekstraksi Fitur Spektrogram & Kinematika Robotik Otonom | Rabiner & Schafer, Craig Robotics, PyBullet | Prioritas 9 |
| **Batch 10** | `automl-nas` & `computational-intelligence` | Optimasi Hiperparameter Bayesian & Algoritma Genetika/Fuzzy | Hutter et al. AutoML, Goldberg Genetic Alg | Prioritas 10 |
| **Batch 11** | `knowledge-representation` & `expert-system` | Logika Proposisi/Predikat, Graf Pengetahuan & Mesin Inferensi Aturan | Brachman & Levesque, Giarratano CLIPS | Prioritas 11 |
| **Batch 12** | `data-analyst` & `ai-security` | Analisis Eksploratif Bisnis & Pertahanan Terhadap Serangan Adversarial | McKinney Python for Data Analysis, Goodfellow FGSM | Prioritas 12 |
| **Batch 13** | `ai-ethics` & `ai-governance` | Keadilan Algoritmik (Fairness), Akuntabilitas & Kerangka Regulasi AI | Barocas et al. Fairness, EU AI Act, NIST AI RMF | Prioritas 13 |

---

## 3. Rencana Detail Eksekusi Batch 1: Deep Learning & Data Science

### 3.1 Profil Topik Batch 1
1. **Topik 1: Deep Learning (`deep-learning`)**:
   - **Tujuan Pembelajaran**: Memahami perseptron multi-lapis (*Multilayer Perceptron*), fungsi aktivasi non-linier (ReLU, GeLU, Sigmoid), penurunan matematis *Backpropagation* via aturan rantai kalkulus multivariabel, optimasi gradien adaptif (Adam, RMSProp), dan implementasi modular `torch.nn.Module`.
   - **Prasyarat**: `machine-learning` (Regresi Linier & OLS), Aljabar Linier (Perkalian Tensor), Kalkulus Gradien.
   - **Sumber Kanonikal**:
     - `src-goodfellow-deep-learning`: *Deep Learning* (Goodfellow, Bengio, Courville, MIT Press 2016).
     - `src-pytorch-nn-module-doc`: *PyTorch Documentation: torch.nn.Module*.
     - `src-pytorch-autograd-doc`: *Autograd mechanics in PyTorch*.
     - `src-kingma-adam-2014`: *Adam: A Method for Stochastic Optimization* (ICLR 2015).
   - **Rencana Kode & Runtime**:
     - Implementasi komputasi mandiri *Forward Pass* & *Automatic Differentiation* PyTorch/Numpy.
     - Perbandingan konvergensi optimizer SGD vs Adam pada fungsi loss non-konveks.
     - Verifikasi eksekusi dengan runtime Python 3.12 (simpan exit code 0 dan output numerik asli).
   - **Pencegahan Data Leakage**: Normalisasi bobot tensor dan isolasi batch data latih vs uji.

2. **Topik 2: Data Science (`data-science`)**:
   - **Tujuan Pembelajaran**: Menguasai siklus hidup ilmu data (CRISP-DM / OSEMN), analisis data eksploratif (*Exploratory Data Analysis*), rekayasa fitur (*Feature Engineering*), uji hipotesis statistik (t-test, ANOVA, Chi-Square), dan evaluasi metrik model end-to-end.
   - **Prasyarat**: Statistika Deskriptif, Dasar Pemrograman Python (Pandas/Numpy).
   - **Sumber Kanonikal**:
     - `src-hastie-elements-statistical-learning`: Hastie, Tibshirani, Friedman (Springer 2009).
     - `src-dataset-california-housing`: Pace & Barry (1997) / Scikit-Learn.
     - `src-scikit-learn-pipeline-doc`: Scikit-learn Pipeline & ColumnTransformer.
   - **Rencana Kode & Runtime**:
     - Pipeline imputasi nilai hilang, encoding kategori, dan scaling fitur terisolasi bebas kebocoran data.
     - Eksekusi nyata pada dataset benchmark California Housing dengan evaluasi RMSE & R².

---

### 3.2 Kriteria Akseptasi Batch 1 (20 Quality Gates)
1. Seluruh bab dan subbab yang dimigrasikan memiliki panjang teks substantif (> 150 kata/subbab, bebas boilerplate).
2. Nol persentase pola skeleton generator lama (`merupakan fondasi krusial...`).
3. Seluruh blok kode Python dieksekusi nyata di Python 3.12 dengan exit code 0 dan output tercatat di JSON evidence.
4. Tidak ada expectedOutput palsu (*synthetic placeholder string*).
5. Tersertifikasi bebas kebocoran data (*Pipeline Anti-Leakage Certified*).
6. Seluruh referensi terhubung ke SSOT kanonikal dengan justifikasi relevansi spesifik.
7. Setiap bab memuat summary substantif, jembatan transisi kognitif, dan pertanyaan evaluasi.
8. Setiap subbab memuat latihan bertingkat analitis dan komputasi.
9. Reader UI dapat merender seluruh hirarki 3 level dengan KaTeX math tanpa cacat tata letak.
10. Lolos kompilasi TypeScript `npx tsc --noEmit` dengan 0 error dan seluruh pengujian negatif `negative-quality-gates.test.ts` tetap 100% lulus.

---

### 3.3 Rencana Mitigasi Risiko & Rollback Batch 1
- **Snapshot Rollback Reference**: Commit `154696d` (Tag: `phase-2.3.1-acceptance`).
- **Penyimpanan Berkas**: Berkas baru disusun secara terisolasi. Jika terjadi kegagalan akseptasi, repositori dapat dikembalikan ke tag `phase-2.3.1-acceptance` dalam satu langkah tanpa merusak histori kerja.

---

## 4. Deliverables Wajib Batch 1
Setelah Batch 1 dieksekusi, dokumen-dokumen berikut akan diterbitkan di `docs/curriculum-rework/`:
1. `BATCH_1_SOURCE_MAP.md`
2. `BATCH_1_CODE_EXECUTION_REPORT.md`
3. `BATCH_1_NEGATIVE_TEST_REPORT.md`
4. `BATCH_1_ACCEPTANCE_REPORT.md`
5. Pembaruan `PHASE_2_4_DEFECT_REGISTER.md`
6. Pembaruan `PHASE_2_4_MIGRATION_STATUS.md`

---

## 5. Kesimpulan Tahap 2

Rencana migrasi Batch 1 telah dirancang secara presisi, terukur, dan aman dari regresi. Pekerjaan migrasi substantif Batch 1 siap dieksekusi setelah rencana ini ditinjau dan disetujui.

**Status Tahap 2**: **PROPOSED & READY FOR USER REVIEW**
