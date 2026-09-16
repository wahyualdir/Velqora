# VELQORA — CURRICULUM MIGRATION STATUS & INVENTORY MATRIX

**Dokumen**: Status Migrasi Kurikulum Menuju Arsitektur Notebook  
**Versi**: 2.0 (Gold Standard Rebuild)  
**Status**: VERIFIED_WITH_LIMITATIONS (1 Bab Gold Standard Diterima, 26 Topik Legacy Fallback Terlindungi)  
**Tanggal Audit**: 16 September 2026  

---

## 1. Ringkasan Eksekutif Migrasi

Rekonstruksi sistem kurikulum Velqora mentransformasikan format artikel statis markdown lama menjadi struktur unit semantik **Notebook Komputasional Interaktif** (`NotebookUnit`).

| Kategori Modul | Total Topik / Bab | Status Mutu | Arsitektur Runtime |
|---|:---:|:---:|:---:|
| **Topik 11: Data Science (Bab 1)** | 1 Bab (6 Subbab) | `ACCEPTED (GOLD STANDARD)` | `NotebookUnit` Semantik + Python 3.12 Actual Evidence |
| **Topik 01 s/d 10 (Legacy)** | 10 Topik (60 Bab) | `LEGACY_SYNTHETIC` | Dual-Mode Fallback (`content_markdown`) |
| **Topik 11: Data Science (Bab 2-6)** | 5 Bab | `LEGACY_SYNTHETIC` | Dual-Mode Fallback (`content_markdown`) |
| **Topik 12 s/d 26 (Legacy)** | 15 Topik (90 Bab) | `LEGACY_SYNTHETIC` | Dual-Mode Fallback (`content_markdown`) |
| **Total Ekosistem Kurikulum** | **26 Topik (156 Bab)** | **1 Bab Gold Standard + 155 Bab Fallback Aman** | **Zero Runtime Crash Terverifikasi** |

---

## 2. Inventaris Rinci Modul Acuan Baku (Gold Standard: Data Science Bab 1)

Modul **Data Science Bab 1: Metodologi Sains Data, Problem Framing & Siklus Hidup Analisis Data** telah selesai dimigrasikan secara penuh ke format `NotebookUnit` dengan rincian unit semantik per subbab:

| Kode Subbab | Judul Subbab Akademik | Jumlah Unit | Variasi Unit Semantik | Status Eksekusi Kode | Status Mutu |
|---|---|:---:|---|:---:|:---:|
| `1.1` | **Taksonomi Sains Data, Komparasi Disiplin & Peran Analitik** | 9 Unit | Markdown, Definition, Table, Formula, Code, Output, Interpretation, Exercise | `Python 3.12 (Exit 0)` | `ACCEPTED` |
| `1.2` | **Problem Framing & Formulasi Target Analitik** | 8 Unit | Markdown, Definition, Table, Warning, Code, Output, Interpretation, Exercise | `Python 3.12 (Exit 0)` | `ACCEPTED` |
| `1.3` | **Siklus Hidup Analisis Data: Metodologi CRISP-DM** | 8 Unit | Markdown, Definition, Table, Code, Output, Interpretation, Warning, Exercise | `Python 3.12 (Exit 0)` | `ACCEPTED` |
| `1.4` | **Siklus Hidup OSEMN & Perbandingan Metodologi Alternatif** | 8 Unit | Markdown, Table, Code, Output, Interpretation, Formula, Exercise | `Python 3.12 (Exit 0)` | `ACCEPTED` |
| `1.5` | **Causal Thinking, Batasan Korelasi & Simpson's Paradox** | 9 Unit | Markdown, Definition, Formula, Code, Output, Interpretation, Warning, Exercise | `Python 3.12 (Exit 0)` | `ACCEPTED` |
| `1.6` | **Studi Kasus End-to-End: Problem Framing California Housing** | 10 Unit | Markdown, Table, Code, Output, Interpretation, Formula, Warning, Project | `Python 3.12 (Exit 0)` | `ACCEPTED` |
| **Total** | **Data Science Bab 1 (6 Subbab)** | **52 Unit** | **11 Varian Semantik Lengkap** | **6/6 Runnable (100%)** | **ACCEPTED** |

---

## 3. Matriks 26 Topik Kurikulum & Jadwal Migrasi Bertahap

| ID | Nama Topik Kurikulum | Sub-disiplin | Format Saat Ini | Rencana Batch Migrasi |
|:---:|---|---|:---:|:---:|
| **11** | **Data Science** | Metodologi, Statistik & Analisis | `NotebookUnit (Bab 1) / Fallback (Bab 2-6)` | **Batch 1 (Gold Standard Selesai)** |
| 01 | Artificial Intelligence Fundamentals | Fondasi Komputasi & Logika | `Legacy Fallback (Markdown)` | Batch 2 |
| 02 | Machine Learning Foundations | Regresi, Klasifikasi, Teori Belajar | `Legacy Fallback (Markdown)` | Batch 2 |
| 03 | Deep Learning & Neural Architectures | Jaringan Saraf Tiruan, Backprop | `Legacy Fallback (Markdown)` | Batch 2 |
| 04 | Computer Vision | Pengolahan Citra, Konvolusi, Deteksi | `Legacy Fallback (Markdown)` | Batch 3 |
| 05 | Natural Language Processing | Pemrosesan Bahasa Alami, Sintaksis | `Legacy Fallback (Markdown)` | Batch 3 |
| 06 | Large Language Models | Transformer, Pretraining, Fine-tuning | `Legacy Fallback (Markdown)` | Batch 3 |
| 07 | Generative AI & Diffusion Models | VAE, GAN, Model Difusi | `Legacy Fallback (Markdown)` | Batch 3 |
| 08 | Reinforcement Learning | MDP, Bellman, Q-Learning, PPO | `Legacy Fallback (Markdown)` | Batch 4 |
| 09 | Graph Neural Networks | Teori Graf, Message Passing, Node Embed | `Legacy Fallback (Markdown)` | Batch 4 |
| 10 | MLOps & Production AI | Pipeline, Monitoring, CI/CD Model | `Legacy Fallback (Markdown)` | Batch 4 |
| 12 | Data Engineering & Big Data | Data Warehousing, Streaming, DAG | `Legacy Fallback (Markdown)` | Batch 4 |
| 13 | Data Analysis & Visualization | Exploratory Data Analysis, Storytelling | `Legacy Fallback (Markdown)` | Batch 5 |
| 14 | Time Series Analysis & Forecasting | ARIMA, Prophet, RNN Temporal | `Legacy Fallback (Markdown)` | Batch 5 |
| 15 | Recommender Systems | Collaborative Filtering, Matrix Fact | `Legacy Fallback (Markdown)` | Batch 5 |
| 16 | Robotics & Autonomous Systems | Kinematika, SLAM, Kontrol Optimal | `Legacy Fallback (Markdown)` | Batch 5 |
| 17 | Edge AI & Embedded Systems | Kuantisasi, Pruning, On-device Model | `Legacy Fallback (Markdown)` | Batch 5 |
| 18 | Speech & Audio Processing | Spektrogram, ASR, TTS | `Legacy Fallback (Markdown)` | Batch 6 |
| 19 | Vector Databases & Semantic Search | HNSW, Cosine Sim, Rag Systems | `Legacy Fallback (Markdown)` | Batch 6 |
| 20 | Knowledge Graphs & Semantic Web | Ontologi, RDF, SPARQL | `Legacy Fallback (Markdown)` | Batch 6 |
| 21 | AI Ethics, Safety & Governance | Bias, Transparansi, Fair ML | `Legacy Fallback (Markdown)` | Batch 6 |
| 22 | Quantum Machine Learning | Qubit, Sirkuit Variasional, QNN | `Legacy Fallback (Markdown)` | Batch 7 |
| 23 | Multimodal AI | VLM, Audio-Visual, Cross-attention | `Legacy Fallback (Markdown)` | Batch 7 |
| 24 | Computational Intelligence | Algoritma Genetika, Swarm, Fuzzy | `Legacy Fallback (Markdown)` | Batch 7 |
| 25 | Expert Systems & Symbolic AI | Sistem Pakar, Mesin Inferensi | `Legacy Fallback (Markdown)` | Batch 7 |
| 26 | Cognitive AI & Brain Modeling | Komputasi Kognitif, Neuromorfik | `Legacy Fallback (Markdown)` | Batch 7 |

---

## 4. Mekanisme Jaminan Kompatibilitas (*Backward-Compatibility*)
Seluruh 25 topik legacy dan Bab 2–6 Data Science tetap dapat dibuka, dibaca, dan dijelajahi secara mulus di antarmuka web Velqora.
1. **Fallback Otomatis**: Jika field `units` pada subbab bernilai `undefined` atau berpanjang 0, komponen `DocReaderLayout` dan adapter kurikulum otomatis merender string `content_markdown`.
2. **Zero Breaking Changes**: Navigasi sidebar, Breadcrumb, URL query params (`?section=...`), dan pencarian modul tidak mengalami regresi.
3. **Audit Bebas Crash**: Verifikasi typecheck TypeScript (`npx tsc --noEmit`) dan test runner membuktikan bahwa tidak ada error tipe antara model baru dan modul legacy.
