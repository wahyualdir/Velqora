# VELQORA — PHASE 2: AUDIT KONTEN & VERIFIKASI 28 TOPIK KURIKULUM
**Laporan Perbandingan Status Sebelum (Baseline) dan Sesudah Rekonstruksi (Final)**  
*Tanggal Rilis: 15 September 2026*  
*Status: 100% Terverifikasi (28 dari 28 Topik Lulus Standar Akademik)*

---

## 1. Matriks Transformasi Sebelum vs Sesudah Rekonstruksi

| No | Nama Topik | Status Baseline (Phase 0/1) | Status Akhir (Phase 2 Selesai) | Peningkatan Kualitas Akademik |
|:---|:---|:---|:---|:---|
| 01 | **AI Agent** | Generator sintetis comma-split | Modul TS Otentik (`01-ai-agent.ts`) | Siklus ReAct formal, memori vektor Park et al., Tree-of-Thoughts, Multi-Agent |
| 02 | **AI Ethics & Responsible AI** | Teks umum tanpa formula | Modul TS Otentik (`02-ai-ethics.ts`) | Demographic Parity, Equalized Odds, $(\\epsilon, \\delta)$-Differential Privacy, SHAP |
| 03 | **AI Governance & Regulasi** | Ringkasan naratif singkat | Modul TS Otentik (`03-ai-governance.ts`) | Klasifikasi 4 Tier Risiko EU AI Act, NIST AI RMF 1.0, ISO/IEC 42001, Model Cards |
| 04 | **AI Security & Adversarial ML** | **SALAH RUTE** (Masuk ke Scikit-Learn ML) | Modul TS Otentik (`04-ai-security.ts`) | **Routing Collision Terselesaikan!** Perturbasi FGSM, PGD, Poisoning, MIA, OWASP LLM |
| 05 | **Artificial Intelligence Fundamentals** | Pilot Russell & Norvig | Modul TS Otentik (`05-ai-fundamentals.ts`) | 5 Bab & 26 Subbab komprehensif (AIMA 4th ed., MIT OCW, Stanford) |
| 06 | **AutoML & Neural Architecture Search** | Mock search tanpa bukti | Modul TS Otentik (`06-automl-nas.ts`) | CASH Problem, Bayesian Optimization TPE (Optuna), Hyperband SHA, DARTS Bilevel |
| 07 | **Computational Intelligence** | If-else kabur tiruan | Modul TS Otentik (`07-computational-intelligence.ts`) | Himpunan Kabur Zadeh, Inferensi Mamdani/Sugeno Centroid, GA Rastrigin, Dinamika PSO |
| 08 | **Computer Vision** | Filter OpenCV tiruan | Modul TS Otentik (`08-computer-vision.ts`) | Konvolusi 2D spasial, Sobel/Canny, ResNet Residual, YOLO IoU/mAP, U-Net Dice |
| 09 | **Data Analyst** | Parsed DB / Generator | Modul TS Otentik (`09-data-analyst.ts`) | Pandas 2.0 PyArrow, Window Functions SQL (PARTITION BY), Welch t-test, Kohort & RFM |
| 10 | **Data Engineering & Big Data AI** | Mock loop ETL | Modul TS Otentik (`10-data-engineering-ai.ts`) | Apache Parquet Columnar, Predicate Pushdown, DAG Spark Shuffling, Data Contracts |
| 11 | **Data Science** | Tumpang tindih dengan ML | Modul TS Otentik (`11-data-science.ts`) | CRISP-DM 6 Fase, Isolasi Train-Test Leakage, PCA SVD, SMOTE & PR-AUC vs ROC |
| 12 | **Deep Learning** | Mock neuron tanpa kalkulus | Modul TS Otentik (`12-deep-learning.ts`) | Penurunan Autograd Backprop, AdamW Decoupled Decay, BatchNorm vs LayerNorm |
| 13 | **Edge AI & TinyML** | Mock kompresi | Modul TS Otentik (`13-edge-ai-tinyml.ts`) | Affine INT8 Scale & Zero-Point, Knowledge Distillation Softmax, Ekspor ONNX & C Array |
| 14 | **Expert System** | Percabangan if-else sederhana | Modul TS Otentik (`14-expert-system.ts`) | Match-Resolve-Act, Forward vs Backward Chaining, Certainty Factors (CF) MYCIN |
| 15 | **Generative AI** | Prompting dasar | Modul TS Otentik (`15-generative-ai.ts`) | Evidence Lower Bound (ELBO) VAE, Reparameterization, Minimax GAN, Difusi DDPM |
| 16 | **Graph Neural Network (GNN)** | Mock matriks ketetanggaan | Modul TS Otentik (`16-graph-neural-network.ts`) | Message Passing MPNN, Normalisasi Simetris GCN, Koefisien Atensi GAT, GraphSAGE |
| 17 | **Knowledge Representation** | Asosiasi graf bebas | Modul TS Otentik (`17-knowledge-representation.ts`) | Logika Deskripsi $\\mathcal{ALC}$, TBox & ABox, RDF Triples Turtle, Kueri SPARQL |
| 18 | **Large Language Model** | Mock API call | Modul TS Otentik (`18-large-language-model.ts`) | Scaled Dot-Product $\\sqrt{d_k}$, RoPE rotasional, Low-Rank Adaptation (LoRA), Teori DPO |
| 19 | **Machine Learning** | 22 Bab Scikit-Learn | Modul TS Otentik (`19-machine-learning.ts`) | 22 Bab & 58 Subbab resmi Scikit-Learn 1.9 terintegrasi dalam skema terpadu |
| 20 | **MLOps & AI Deployment** | Mock deployment print | Modul TS Otentik (`20-mlops-deployment.ts`) | MLflow Model Registry, FastAPI Docker Microservice, Uji KS & Indeks PSI Drift |
| 21 | **Multimodal AI** | Penggabungan array buatan | Modul TS Otentik (`21-multimodal-ai.ts`) | Symmetric Contrastive Loss InfoNCE (CLIP), LLaVA Linear Projector, Cross-Attention |
| 22 | **Natural Language Processing** | Split string sederhana | Modul TS Otentik (`22-natural-language-processing.ts`) | Word2Vec Skip-Gram Negative Sampling, LSTM Bahdanau Attention, Metrik BLEU & BP |
| 23 | **Recommendation System** | Cosine similarity mock | Modul TS Otentik (`23-recommendation-system.ts`) | SVD Latent Factor Bias, Two-Stage Pipeline (Candidate Retrieval + Ranking), NDCG@K |
| 24 | **Reinforcement Learning** | Mock Q-table update | Modul TS Otentik (`24-reinforcement-learning.ts`) | Persamaan Bellman MDP, Stabilisasi DQN Experience Replay, PPO Clipped Loss |
| 25 | **Robotics & Embodied AI** | Mock PID satu baris | Modul TS Otentik (`25-robotics-embodied-ai.ts`) | Parameter Denavit-Hartenberg (DH) $4\\times 4$, RRT Path Planning, Kontrol PID |
| 26 | **Speech & Audio AI** | Mock array gelombang | Modul TS Otentik (`26-speech-audio-ai.ts`) | STFT & Filterbank Skala Mel, Connectionist Temporal Classification, Metrik WER |
| 27 | **Time Series Forecasting** | Mock moving average | Modul TS Otentik (`27-time-series-forecasting.ts`) | Stasioneritas Uji ADF, Formulasi Polinomial ARIMA(p,d,q), Skor Isolation Forest |
| 28 | **Vector Database & Retrieval** | Mock list scan | Modul TS Otentik (`28-vector-database-retrieval.ts`) | Konsentrasi Jarak Dimensi Tinggi, Indeks Graf HNSW Multi-Layer, Reciprocal Rank Fusion |

---

## 2. Kriteria Verifikasi yang Dipenuhi

1. **Integritas Rujukan Primer (100%)**:
   Seluruh 28 modul kurikulum menyertakan rujukan primer yang sah dengan URL aktif, nama peneliti/penulis asli, dan relevansi akademik konseptual.
2. **Formulasi Matematis KaTeX (100%)**:
   Setiap subbab menyertakan penurunan rumus matematika formal dengan KaTeX LaTeX yang ter-render secara native di antarmuka `NoteRenderer`.
3. **Kode Python/SQL yang Dapat Dijalankan (100%)**:
   Kode praktikum menggunakan struktur standar tanpa placeholder fiktif, dilengkapi penjelasan algoritma dan output yang terukur.
4. **Proteksi Tabrakan Rute (100%)**:
   Perutean `/dashboard/modul/kategori/[id]` mengutamakan registri kurikulum akademik terpusat sebelum mengevaluasi fallback nama string.
5. **Zero Disruption Database**:
   Tidak ada data pengguna (`profiles`, `modules`, `projects`, `notes`, `user_subscriptions`) yang diubah atau dihapus selama proses rekonstruksi.
