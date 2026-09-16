# PHASE 2.3-D — SINGLE SOURCE REGISTRY (SSOT)

## 1. Executive Summary & Audit Baseline

Audit Phase 2.2.1 mengungkap bahwa sistem lama memiliki **4.151 sitasi yang hanya mengulang ~47 URL unik**, dengan **48.16% di antaranya hanya berupa homepage domain root** (seperti `https://pytorch.org`, `https://scikit-learn.org`, `https://arxiv.org`).

Pada Phase 2.3-D, dibangun **Single Source Registry** terpusat di `src/lib/curriculum/source-registry.ts`. Seluruh entri sumber dipetakan dengan Stable Source ID, klasifikasi relevansi, metadata lisensi, dan konsep yang didukung secara spesifik.

---

## 2. Taksonomi Status Verifikasi Sumber

| Status | Definisi | Tindakan Kurikulum |
|---|---|---|
| `VERIFIED_RELEVANT` | Sumber primer/sekunder spesifik (paper, buku bab tertentu, dokumentasi fungsi/modul) yang langsung membuktikan materi. | Dijadikan referensi utama (*Primary Source*). |
| `VERIFIED_GENERAL` | Dokumentasi umum atau buku teks komprehensif tingkat tinggi. | Dipertahankan sebagai bacaan pengayaan latar belakang. |
| `NEEDS_MANUAL_REVIEW` | Sumber yang memerlukan peninjauan pakar manusia untuk memastikan akurasi klaim. | Ditandai dalam registry, tidak dipakai sebagai klaim mutlak. |
| `PAYWALL` | Sumber akademis di balik jurnal berbayar (misal IEEE/Springer tanpa draft terbuka). | Disediakan link open-access preprint resmi (arXiv/author draft) jika ada. |
| `BROKEN` | URL menghasilkan HTTP 404/500 atau domain kedaluwarsa. | Dicatat dalam log anomali dan diganti dengan link arsip/resmi. |
| `METADATA_MISMATCH` | Judul, penulis, atau tahun pada kutipan berbeda dengan metadata publikasi asli. | Dinormalisasi sesuai DOI atau situs penerbit resmi. |
| `DUPLICATE_SOURCE` | URL yang diulang lebih dari 20 kali secara generik di seluruh modul tanpa bab/sub-path spesifik. | Ditandai untuk dimigrasikan ke deep-link atau registry terpusat. |

---

## 3. Daftar Entri Terverifikasi (Canonical Sources)

### 3.1 Buku Teks Acuan Dunia (Textbooks)

#### 1. `src-russell-norvig-aima`
- **Judul**: *Artificial Intelligence: A Modern Approach (4th Edition)*
- **Penulis**: Stuart Russell & Peter Norvig
- **Tahun**: 2020
- **Penerbit/Domain**: Pearson (`aima.cs.berkeley.edu`)
- **Tipe Sumber**: `academic-book`
- **Lisensi/Akses**: Commercial Textbook / Reference Edition
- **Status**: `VERIFIED_RELEVANT`
- **Konsep yang Didukung**: Intelligent Agents, State Space Search, Heuristic Search, Adversarial Search, MDP, Knowledge Representation.
- **Catatan Relevansi**: Buku rujukan utama kurikulum AI universitas dunia; menjadi dasar struktural Topik AI Fundamentals & AI Agents.

#### 2. `src-goodfellow-deep-learning`
- **Judul**: *Deep Learning*
- **Penulis**: Ian Goodfellow, Yoshua Bengio, Aaron Courville
- **Tahun**: 2016
- **Penerbit/Domain**: MIT Press (`deeplearningbook.org`)
- **Tipe Sumber**: `academic-book`
- **Lisensi/Akses**: Free Official HTML / Commercial Print
- **Status**: `VERIFIED_RELEVANT`
- **Konsep yang Didukung**: Feedforward Networks, Backpropagation, Regularization, Optimization, CNN, Sequence Modeling.
- **Catatan Relevansi**: Rujukan matematis definitif untuk deep neural networks, fungsi aktivasi, dan vanishing gradient.

#### 3. `src-hastie-elements-statistical-learning`
- **Judul**: *The Elements of Statistical Learning: Data Mining, Inference, and Prediction (2nd Edition)*
- **Penulis**: Trevor Hastie, Robert Tibshirani, Jerome Friedman
- **Tahun**: 2009
- **Penerbit/Domain**: Springer Series in Statistics (`hastie.su.domains`)
- **Tipe Sumber**: `academic-book`
- **Lisensi/Akses**: Free Official PDF (Stanford University)
- **Status**: `VERIFIED_RELEVANT`
- **Konsep yang Didukung**: Bias-Variance Decomposition, Ridge Regression (L2), Lasso (L1), Kernel Methods, Cross-Validation.
- **Catatan Relevansi**: Rujukan statistik ketat untuk trade-off bias-variance dan regularisasi pada Topik Machine Learning.

#### 4. `src-bishop-prml`
- **Judul**: *Pattern Recognition and Machine Learning*
- **Penulis**: Christopher M. Bishop
- **Tahun**: 2006
- **Penerbit/Domain**: Springer (`microsoft.com/en-us/research`)
- **Tipe Sumber**: `academic-book`
- **Lisensi/Akses**: Free Official PDF (Microsoft Research)
- **Status**: `VERIFIED_RELEVANT`
- **Konsep yang Didukung**: Polynomial Curve Fitting, Maximum Likelihood Estimation, Bayesian Linear Regression, EM Algorithm.
- **Catatan Relevansi**: Analisis analitis kurva fitting derajat 1, 3, dan 15 yang menjadi dasar kurikulum regresi polinomial.

#### 5. `src-sutton-barto-rl`
- **Judul**: *Reinforcement Learning: An Introduction (2nd Edition)*
- **Penulis**: Richard S. Sutton & Andrew G. Barto
- **Tahun**: 2018
- **Penerbit/Domain**: MIT Press (`incompleteideas.net`)
- **Tipe Sumber**: `academic-book`
- **Lisensi/Akses**: Free Official Online Draft / MIT Press
- **Status**: `VERIFIED_RELEVANT`
- **Konsep yang Didukung**: Bandits, Markov Decision Processes, Temporal-Difference Learning, Q-Learning, Policy Gradients.

---

### 3.2 Paper Ilmiah Tonggak Sejarah (Milestone Research Papers)

#### 1. `src-vaswani-attention-2017`
- **Judul**: *Attention Is All You Need*
- **Penulis**: Ashish Vaswani, Noam Shazeer, Niki Parmar, et al.
- **Tahun**: 2017
- **Penerbit/Venue**: NeurIPS 2017 (`arxiv.org/abs/1706.03762`)
- **DOI**: `10.48550/arXiv.1706.03762`
- **Tipe Sumber**: `paper`
- **Lisensi/Akses**: Open Access (arXiv)
- **Status**: `VERIFIED_RELEVANT`
- **Konsep yang Didukung**: Scaled Dot-Product Attention, Multi-Head Attention, Positional Encoding, Encoder-Decoder.

#### 2. `src-he-resnet-2015`
- **Judul**: *Deep Residual Learning for Image Recognition*
- **Penulis**: Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun
- **Tahun**: 2015
- **Penerbit/Venue**: IEEE CVPR 2016 (`arxiv.org/abs/1512.03385`)
- **DOI**: `10.48550/arXiv.1512.03385`
- **Tipe Sumber**: `paper`
- **Lisensi/Akses**: Open Access (arXiv)
- **Status**: `VERIFIED_RELEVANT`
- **Konsep yang Didukung**: Residual Connections, Skip Connections, Bottleneck Architecture.

#### 3. `src-ho-ddpm-2020`
- **Judul**: *Denoising Diffusion Probabilistic Models*
- **Penulis**: Jonathan Ho, Ajay Jain, Pieter Abbeel
- **Tahun**: 2020
- **Penerbit/Venue**: NeurIPS 2020 (`arxiv.org/abs/2006.11239`)
- **DOI**: `10.48550/arXiv.2006.11239`
- **Tipe Sumber**: `paper`
- **Lisensi/Akses**: Open Access (arXiv)
- **Status**: `VERIFIED_RELEVANT`
- **Konsep yang Didukung**: Forward Noise Schedule, Reverse Denoising Step, Score Matching.

#### 4. `src-kingma-adam-2014`
- **Judul**: *Adam: A Method for Stochastic Optimization*
- **Penulis**: Diederik P. Kingma, Jimmy Ba
- **Tahun**: 2014
- **Penerbit/Venue**: ICLR 2015 (`arxiv.org/abs/1412.6980`)
- **DOI**: `10.48550/arXiv.1412.6980`
- **Tipe Sumber**: `paper`
- **Lisensi/Akses**: Open Access (arXiv)
- **Status**: `VERIFIED_RELEVANT`
- **Konsep yang Didukung**: First Moment Vector, Second Moment Vector, Bias Correction, Adaptive Learning Rate.

---

### 3.3 Dokumentasi Resmi & Dataset (Official Docs & Datasets)

#### 1. `src-scikit-learn-pipeline-doc`
- **Judul**: *Pipelines and composite estimators*
- **Penulis/Org**: Scikit-learn Developers
- **URL**: `https://scikit-learn.org/stable/modules/compose.html#pipeline`
- **Tipe Sumber**: `official-documentation`
- **Lisensi/Akses**: BSD 3-Clause (Open Source)
- **Status**: `VERIFIED_RELEVANT`
- **Konsep yang Didukung**: Pipeline, ColumnTransformer, Prevention of Data Leakage in Cross-Validation.

#### 2. `src-scikit-learn-model-evaluation`
- **Judul**: *Metrics and scoring: quantifying the quality of predictions*
- **Penulis/Org**: Scikit-learn Developers
- **URL**: `https://scikit-learn.org/stable/modules/model_evaluation.html`
- **Tipe Sumber**: `official-documentation`
- **Lisensi/Akses**: BSD 3-Clause
- **Status**: `VERIFIED_RELEVANT`
- **Konsep yang Didukung**: MSE, RMSE, MAE, R², Confusion Matrix, Precision, Recall, F1, ROC-AUC.

#### 3. `src-dataset-california-housing`
- **Judul**: *California Housing Dataset*
- **Penulis**: R. Kelley Pace & Ronald Barry (1997)
- **URL**: `https://scikit-learn.org/stable/modules/generated/sklearn.datasets.fetch_california_housing.html`
- **Tipe Sumber**: `benchmark-dataset`
- **Lisensi/Akses**: Public Domain / Open Data
- **Status**: `VERIFIED_RELEVANT`
- **Konsep yang Didukung**: Real-world regression dataset, Feature distributions, Skewness, Spatial coordinates.

---

## 4. Penanganan Sumber Meragukan & Duplikasi

1. **Aturan Non-Destruktif**: Tidak ada sumber yang dihapus secara otomatis. Sumber-sumber lama tetap ada di data mentah namun ditandai `DUPLICATE_SOURCE` jika mengulang homepage generik.
2. **Migration Path**: Pada pilot penulisan konten substantive (Phase 2.3-F), seluruh sitasi unit pembelajaran wajib menunjuk langsung ke `id` yang terdaftar dalam Single Source Registry ini.
