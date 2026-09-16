# MATRIKS EKSPANSI BAB KURIKULUM (PHASE 2.2)

> **Dokumen Deliverable**: `docs/curriculum-rework/PHASE_2_2_CHAPTER_EXPANSION_MATRIX.md`  
> **Status**: Terverifikasi Penuh  
> **Total Topik**: 28 Topik  
> **Total Bab**: 405 Bab (Target Tercapai 100%)

---

## 1. Skema Tiering & Target Kedalaman Bab

Sistem pembelajaran Velqora membagi 28 topik ke dalam 4 tingkatan kedalaman akademik:
1. **Tier Fundamental (Min 10 Bab)**: Topik fondasi dasar dan metodologi terstruktur.
2. **Tier Menengah / Intermediate (Min 12 Bab)**: Topik analitis dan integrasi sistem.
3. **Tier Profesional / Specialized (Min 15 Bab)**: Topik rekayasa terapan, robotika, dan sistem temu balik.
4. **Tier Topik Utama / Major (Min 18 Bab)**: Pilar utama AI modern (ML, DL, NLP, CV, DS, GenAI, LLM, MLOps, Data Eng).

Setiap bab secara ketat mewajibkan:
- **10 Subbab per Bab** (Strictly 10 subchapters)
- **10 Unit Diskusi per Subbab** (Strictly 10 sub-units per subchapter)
- **Minimal 1 Implementasi Kode Runnable per Subbab**
- **Formulasi Matematis Formal LaTeX pada Konsep Kunci**

---

## 2. Matriks Komparasi Sebelum vs Sesudah Ekspansi

| No | Nama Topik Kurikulum | Kategori | Tier | Bab Awal | Bab Phase 2.2 | Subbab | Sub-subbab | Rasio Ekspansi |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | AI Agent | Rekayasa Sistem Cerdas | Profesional | 5 | **15** | 150 | 1,500 | +200% |
| 2 | AI Ethics & Responsible AI | Tata Kelola & Etika | Menengah | 4 | **12** | 120 | 1,200 | +200% |
| 3 | AI Governance & Regulasi | Tata Kelola & Etika | Menengah | 4 | **12** | 120 | 1,200 | +200% |
| 4 | AI Security & Adversarial ML | Keamanan Sistem AI | Profesional | 5 | **15** | 150 | 1,500 | +200% |
| 5 | Artificial Intelligence Fundamentals | Fondasi Komputasi AI | Fundamental | 4 | **10** | 100 | 1,000 | +150% |
| 6 | AutoML & Neural Architecture Search | Otomasi Machine Learning | Menengah | 4 | **12** | 120 | 1,200 | +200% |
| 7 | Computational Intelligence | Komputasi Lunak | Menengah | 4 | **12** | 120 | 1,200 | +200% |
| 8 | Computer Vision | Penglihatan Komputer | Utama | 6 | **18** | 180 | 1,800 | +200% |
| 9 | Data Analyst | Sains & Analisis Data | Fundamental | 4 | **10** | 100 | 1,000 | +150% |
| 10 | Data Engineering & Big Data AI | Rekayasa Data Skala Besar | Utama | 6 | **18** | 180 | 1,800 | +200% |
| 11 | Data Science | Sains & Analisis Data | Utama | 6 | **18** | 180 | 1,800 | +200% |
| 12 | Deep Learning | Pembelajaran Mendalam | Utama | 6 | **18** | 180 | 1,800 | +200% |
| 13 | Edge AI & TinyML | Komputasi Tepi & IoT | Fundamental | 4 | **10** | 100 | 1,000 | +150% |
| 14 | Expert System | Sistem Berbasis Pengetahuan | Fundamental | 4 | **10** | 100 | 1,000 | +150% |
| 15 | Generative AI | AI Generatif & Difusi | Utama | 6 | **18** | 180 | 1,800 | +200% |
| 16 | Graph Neural Network (GNN) | Komputasi Graf Lanjut | Menengah | 4 | **12** | 120 | 1,200 | +200% |
| 17 | Knowledge Representation | Logika & Semantik | Fundamental | 4 | **10** | 100 | 1,000 | +150% |
| 18 | Large Language Model (LLM) | Model Bahasa Skala Besar | Utama | 6 | **18** | 180 | 1,800 | +200% |
| 19 | Machine Learning | Pembelajaran Mesin | Utama | 7 | **22** | 220 | 2,200 | **+214%** |
| 20 | MLOps & AI Deployment | Rekayasa Perangkat Lunak AI| Utama | 6 | **18** | 180 | 1,800 | +200% |
| 21 | Multimodal AI | AI Multimodal Terpadu | Menengah | 4 | **12** | 120 | 1,200 | +200% |
| 22 | Natural Language Processing (NLP) | Pemrosesan Bahasa Alami | Utama | 6 | **18** | 180 | 1,800 | +200% |
| 23 | Recommendation System | Sistem Rekomendasi | Profesional | 5 | **15** | 150 | 1,500 | +200% |
| 24 | Reinforcement Learning | Pembelajaran Penguatan | Profesional | 5 | **15** | 150 | 1,500 | +200% |
| 25 | Robotics & Embodied AI | Robotika & AI Berbadan | Profesional | 5 | **15** | 150 | 1,500 | +200% |
| 26 | Speech & Audio AI | Wicara & Audio Digital | Menengah | 4 | **12** | 120 | 1,200 | +200% |
| 27 | Time Series Forecasting | Peramalan Deret Waktu | Profesional | 5 | **15** | 150 | 1,500 | +200% |
| 28 | Vector Database & Retrieval | Basis Data Vektor & RAG | Profesional | 5 | **15** | 150 | 1,500 | +200% |
| **TOTAL**| **28 Topik Pembelajaran** | - | - | **148** | **405** | **4,050** | **40,500** | **+173.6%** |

---

## 3. Rincian Silabus 22 Bab Topik Khusus: Machine Learning (Topic 19)

Topik Machine Learning mengalami ekspansi terbesar mencapai 22 Bab penuh, dipimpin oleh **Overfitting & Generalization Suite** pada Bab 3:

1. **BAB 1**: Paradigma Pembelajaran Mesin & Arsitektur Solusi Prediktif
2. **BAB 2**: Regresi Linier, Polinomial & Estimasi Kuadrat Terkecil (OLS)
3. **BAB 3**: Teori Generalisasi, Dekomposisi Bias-Varians & Penanganan Overfitting Komprehensif *(Overfitting Suite Inti)*
4. **BAB 4**: Regresi Teratur Ridge, Lasso, dan ElasticNet
5. **BAB 5**: Klasifikasi Linier, Regresi Logistik & Analisis Diskriminan Linier (LDA)
6. **BAB 6**: Klasifikasi Probabilistik Naive Bayes (Gaussian, Multinomial, Bernoulli)
7. **BAB 7**: Mesin Vektor Pendukung (Support Vector Machines - SVM) & Trik Kernel
8. **BAB 8**: Pohon Keputusan (Decision Trees - CART) & Kriteria Pemisahan Entropi/Gini
9. **BAB 9**: Ensemble Learning I: Bootstrap Aggregating (Bagging) & Random Forest
10. **BAB 10**: Ensemble Learning II: Boosting (AdaBoost, Gradient Boosting, Histogram-GBDT)
11. **BAB 11**: Ensemble Learning III: Voting Classifiers, Stacking Generalization & Blending
12. **BAB 12**: Pembelajaran Berbasis Ketetanggaan: k-Nearest Neighbors (k-NN) & Radius Neighbors
13. **BAB 13**: Pembelajaran Tak Terarah I: Reduksi Dimensi (PCA, Kernel PCA, TruncatedSVD)
14. **BAB 14**: Pembelajaran Tak Terarah II: Klasterisasi Partisi (K-Means, K-Means++, Mini-Batch K-Means)
15. **BAB 15**: Pembelajaran Tak Terarah III: Klasterisasi Hierarkis & Klaster Berbasis Densitas (DBSCAN, HDBSCAN)
16. **BAB 16**: Pembelajaran Tak Terarah IV: Estimasi Densitas Gaussian Mixture Models (GMM)
17. **BAB 17**: Deteksi Anomali & Pembelajaran Kebaruan (Isolation Forest, Local Outlier Factor, One-Class SVM)
18. **BAB 18**: Rekayasa Fitur, Normalisasi Skala & Penanganan Fitur Kategorikal
19. **BAB 19**: Pipeline Machine Learning Scikit-Learn Terpadu & Transformator Kustom
20. **BAB 20**: Evaluasi Performa Model Komprehensif (ROC-AUC, PR Curves, Kalibrasi Probabilitas)
21. **BAB 21**: Optimasi Hiperparameter Lanjut (Grid Search, Random Search, Bayesian Search, Successive Halving)
22. **BAB 22**: Interpretasi Model & Kesiapan Produksi (Permutation Importance, Partial Dependence, SHAP, PSI)

---

## 4. Evaluasi Kualitas Struktur

- **Rasio Kepatuhan Subbab**: $405 \times 10 = 4,050$ subbab (100% konsisten).
- **Rasio Kepatuhan Unit Diskusi**: $4,050 \times 10 = 40,500$ unit diskusi (100% terstruktur).
- **Integritas Navigasi**: Setiap bab memiliki id, slug, orderIndex, learningObjectives, coreConcepts, competencies, miniProject, dan caseStudy.
