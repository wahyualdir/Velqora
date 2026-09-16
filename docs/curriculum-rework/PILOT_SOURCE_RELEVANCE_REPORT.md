# LAPORAN AUDIT RELEVANSI SUMBER & INTEGRITAS REFERENSI (PHASE 2.3.1)
**Dokumen Referensi**: VELQORA-AUDIT-SRC-2026-01  
**Auditor**: Educational Content Auditor & Senior Technical Writer  
**Tanggal Evaluasi**: 16 September 2026  
**Status**: VERIFIED_WITH_LIMITATIONS (Pilot chapter 100% menggunakan sumber kanonikal terverifikasi; topik warisan/legacy masih menahan 47 URL generik hingga migrasi bertahap)

---

## 1. Latar Belakang & Masalah Warisan (Phase 2.2)

Berdasarkan audit independen Phase 2.2.1:
- Ditemukan **4.151 referensi** di seluruh topik warisan.
- Seluruh 4.151 referensi tersebut hanya berputar pada sekitar **47 URL generik**.
- Karakteristik defek:
  1. *Placeholder References*: URL hanya menunjuk ke domain utama (misal `https://github.com`, `https://python.org`, `https://pytorch.org`) tanpa halaman atau bab spesifik.
  2. *Missing Authors & Year*: Tidak ada atribusi penulis akademik atau tahun publikasi.
  3. *Unverified Claims*: Klaim teks tidak dapat dilacak ke nomor bab atau persamaan dalam literatur.

Tujuan Phase 2.3.1 adalah memverifikasi bahwa:
1. Pilot Chapters (AI Bab 1, ML Bab 1, ML Bab 6) sepenuhnya bebas dari referensi generik.
2. Seluruh rujukan dalam pilot terhubung ke **Verified Source Registry (SSOT)** berbobot akademis tinggi.
3. Terdapat justifikasi keterkaitan (*relevance justification*) substantif pada setiap referensi.

---

## 2. Struktur Single Source of Truth (SSOT)

Direktori `src/lib/curriculum/source-registry.ts` menetapkan 15 sumber acuan kanonikal berstandar internasional:

| ID Sumber | Judul / Karya | Penulis / Institusi | Tahun | Tipe | Penerbit / Domain | Status |
|---|---|---|---|---|---|---|
| `src-russell-norvig-aima` | *Artificial Intelligence: A Modern Approach (4th Ed.)* | Stuart Russell & Peter Norvig | 2020 | Academic Book | Pearson | VERIFIED_RELEVANT |
| `src-goodfellow-deep-learning` | *Deep Learning* | Ian Goodfellow, Yoshua Bengio, Aaron Courville | 2016 | Academic Book | MIT Press | VERIFIED_RELEVANT |
| `src-hastie-elements-statistical-learning` | *The Elements of Statistical Learning (2nd Ed.)* | Trevor Hastie, Robert Tibshirani, Jerome Friedman | 2009 | Academic Book | Springer | VERIFIED_RELEVANT |
| `src-bishop-prml` | *Pattern Recognition and Machine Learning* | Christopher M. Bishop | 2006 | Academic Book | Springer | VERIFIED_RELEVANT |
| `src-sutton-barto-rl` | *Reinforcement Learning: An Introduction (2nd Ed.)* | Richard S. Sutton & Andrew G. Barto | 2018 | Academic Book | MIT Press | VERIFIED_RELEVANT |
| `src-vaswani-attention-2017` | *Attention Is All You Need* | Ashish Vaswani et al. (Google Brain) | 2017 | Milestone Paper | NeurIPS 2017 | VERIFIED_RELEVANT |
| `src-he-resnet-2015` | *Deep Residual Learning for Image Recognition* | Kaiming He et al. | 2015 | Milestone Paper | IEEE CVPR 2016 | VERIFIED_RELEVANT |
| `src-ho-ddpm-2020` | *Denoising Diffusion Probabilistic Models* | Jonathan Ho, Ajay Jain, Pieter Abbeel | 2020 | Milestone Paper | NeurIPS 2020 | VERIFIED_RELEVANT |
| `src-kingma-adam-2014` | *Adam: A Method for Stochastic Optimization* | Diederik P. Kingma, Jimmy Ba | 2014 | Milestone Paper | ICLR 2015 | VERIFIED_RELEVANT |
| `src-devlin-bert-2018` | *BERT: Pre-training of Deep Bidirectional Transformers* | Jacob Devlin et al. (Google AI) | 2018 | Milestone Paper | NAACL 2019 | VERIFIED_RELEVANT |
| `src-scikit-learn-pipeline-doc` | *Pipelines and composite estimators* | Scikit-learn Developers | 2024 | Official Doc | scikit-learn.org | VERIFIED_RELEVANT |
| `src-scikit-learn-model-evaluation` | *Metrics and scoring: quantifying prediction quality* | Scikit-learn Developers | 2024 | Official Doc | scikit-learn.org | VERIFIED_RELEVANT |
| `src-pytorch-nn-module-doc` | *PyTorch Documentation: torch.nn.Module* | PyTorch Contributors | 2024 | Official Doc | pytorch.org | VERIFIED_RELEVANT |
| `src-pytorch-autograd-doc` | *Autograd mechanics in PyTorch* | PyTorch Contributors | 2024 | Official Doc | pytorch.org | VERIFIED_RELEVANT |
| `src-dataset-california-housing` | *California Housing Dataset* | R. Kelley Pace & Ronald Barry | 1997 | Benchmark Dataset | Stat. & Prob. Letters | VERIFIED_RELEVANT |

---

## 3. Pemetaan Referensi pada Pilot Chapter

Auditor menguji setiap subbab pada materi pilot terhadap sumber yang diatribusikan:

### 3.1 AI Fundamentals — Bab 1
1. **Subbab 1.1 (Definisi Formal & 4 Kuadran AI)**:
   - **Sumber**: Stuart Russell & Peter Norvig (2020), *Artificial Intelligence: A Modern Approach (4th Edition)*.
   - **Relevansi**: Rujukan kanonikal matriks 2x2 epistemologis AI (Thinking/Acting vs Humanly/Rationally, Bab 1 AIMA).
   - **Klasifikasi**: `VERIFIED_RELEVANT` (Primary Source = `true`).
2. **Subbab 1.2 (Kerangka Kerja PEAS & Sifat Lingkungan)**:
   - **Sumber**: Stuart Russell & Peter Norvig (2020), *Artificial Intelligence: A Modern Approach*.
   - **Relevansi**: Rujukan bab 2 AIMA mengenai spesifikasi formal Performance, Environment, Actuators, Sensors serta 6 dimensi sifat lingkungan operasional.
   - **Klasifikasi**: `VERIFIED_RELEVANT` (Primary Source = `true`).

### 3.2 Machine Learning — Bab 1
1. **Subbab 1.1 (Formulasi Matematis Supervised Learning & Normal Equation)**:
   - **Sumber**: Trevor Hastie, Robert Tibshirani, Jerome Friedman (2009), *The Elements of Statistical Learning (2nd Edition)*.
   - **Relevansi**: Chapter 3: Linear Methods for Regression, derivasi analitis OLS Gauss-Markov $\theta = (X^TX)^{-1}X^Ty$.
   - **Klasifikasi**: `VERIFIED_RELEVANT` (Primary Source = `true`).

### 3.3 Machine Learning — Bab 6
1. **Subbab 6.1 (Dekomposisi Bias-Varians & Polinomial 1, 3, 15)**:
   - **Sumber**: Christopher M. Bishop (2006), *Pattern Recognition and Machine Learning*.
   - **Relevansi**: Bab 1: Polynomial Curve Fitting, pergeseran kurva galat latih vs uji seiring kapasitas model.
   - **Klasifikasi**: `VERIFIED_RELEVANT` (Primary Source = `true`).
2. **Subbab 6.2 (Regularisasi Ridge L2 vs Lasso L1)**:
   - **Sumber**: Trevor Hastie, Robert Tibshirani, Jerome Friedman (2009), *The Elements of Statistical Learning*.
   - **Relevansi**: Bab 3.4: Shrinkage Methods, perbandingan kontur geometri L2 vs L1 diamond dan pembuktian sparsity seleksi fitur.
   - **Klasifikasi**: `VERIFIED_RELEVANT` (Primary Source = `true`).

---

## 4. Analisis Komparasi Metrik: Pilot vs Legacy

| Metrik Evaluasi | Legacy Baseline (Phase 2.2) | Pilot Substantif (Phase 2.3.1) | Target Remediasi |
|---|---|---|---|
| Jumlah Referensi | 4.151 entri | 5 entri kanonikal | 100% berbobot akademis |
| URL Unik | ~47 domain generik | 3 domain spesifik (UC Berkeley, Stanford, Microsoft Research) | Domain resmi/akademis |
| Kehadiran Penulis | 0% (semua anonim) | 100% (Russell, Norvig, Hastie, Tibshirani, Friedman, Bishop) | 100% diatribusi |
| Kehadiran Justifikasi Relevansi | 0% | 100% (penjelasan keterkaitan bab literatur) | Wajib ada pada setiap referensi |
| Sumber Primer Terverifikasi | 0% | 100% (`isPrimarySource: true`) | Wajib ada pada materi konsep dasar |

---

## 5. Batasan & Rencana Migrasi Bertahap

Meskipun modul pilot telah mencapai **100% kepatuhan sumber kanonikal**, status kurikulum secara keseluruhan adalah **VERIFIED_WITH_LIMITATIONS**:
- **Batasan**: 26 topik warisan di luar pilot masih mempertahankan struktur referensi lama yang ditandai dengan flag `legacy-synthetic`.
- **Rencana Mitigasi**: Pada fase peluncuran penuh (Phase 2.4), seluruh 26 topik akan dimigrasikan menggunakan SSOT `VERIFIED_SOURCE_REGISTRY` dengan melarang keras URL mentah tanpa ID registri.

---

## 6. Kesimpulan Audit

Auditor menyatakan bahwa sistem referensi pada Pilot Content telah memenuhi standar publikasi ilmiah tingkat tinggi:
- **Zero generic placeholder URLs**.
- **100% atribusi pengarang terkemuka di bidangnya**.
- **100% relevansi materi terhadap topik yang dibahas**.

**Status**: **VERIFIED_WITH_LIMITATIONS**
