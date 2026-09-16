# VELQORA — PHASE 2.2.1: AUDIT RELEVANSI SUMBER & INTEGRITAS RUJUKAN

> **Dokumen Deliverable**: `docs/curriculum-rework/PHASE_2_2_1_SOURCE_RELEVANCE_AUDIT.md`  
> **Status Audit**: AUDITED (100% CENSUS ACROSS 4,151 CITATIONS & 47 DISTINCT URLS)  
> **Prinsip Utama**: HTTP 200 BUKAN bukti relevansi sumber. Rujukan harus spesifik terhadap konsep yang diajarkan, bukan tautan umum ke homepage dokumentasi.  
> **Tanggal Pelaksanaan**: 2026-09-16  

---

## 1. Ringkasan Klasifikasi Sensus Referensi (4.151 Objek Sitasi)

| Status Klasifikasi | Definisi Operasional | Jumlah Objek | Persentase | Status Penilaian |
|---|---|---|---|---|
| `VERIFIED_RELEVANT` | Tautan spesifik menuju paper akademik, bab buku, RFC/standar, atau halaman API teknis yang tepat sasaran. | **2.001** | **48.21%** | `PASS` |
| `VERIFIED_BUT_GENERAL` | Tautan valid (HTTP 200) namun hanya mengarah ke **halaman beranda umum (root docs/homepage)**, bukan dokumentasi spesifik algoritma yang dibahas. | **1.999** | **48.16%** | `CRITICAL_FINDING` |
| `REQUIRES_LOGIN` | Tautan menuju jurnal/penerbit komersial yang berada di balik *paywall* (memerlukan langganan institusi atau login berbayar). | **151** | **3.64%** | `ACCESS_RESTRICTED` |
| `ACCESSIBLE_NOT_RELEVANT` | Tautan dapat diakses namun sama sekali tidak ada hubungannya dengan topik pembahasan. | **0** | **0.00%** | `PASS` |
| `REDIRECTED` | Tautan mengalami pengalihan domain permanen (301/302). | **0** | **0.00%** | `PASS` |
| `RATE_LIMITED` | Tautan mengalami pemblokiran frekuensi akses (HTTP 429). | **0** | **0.00%** | `PASS` |
| `BROKEN` | URL kosong, malformed, atau mengembalikan galat 404/500. | **0** | **0.00%** | `PASS` |
| `METADATA_MISMATCH` | Penulis, tahun, judul paper, atau DOI tidak cocok dengan metadata publikasi asli. | **0** | **0.00%** | `PASS` |
| `MANUAL_REVIEW_REQUIRED` | Sumber sekunder yang memerlukan pengecekan manual peer-review. | **0** | **0.00%** | `PASS` |
| **TOTAL SITASI** | **Seluruh Objek Referensi Kurikulum Velqora** | **4.151** | **100.00%** | **AUDIT LENGKAP** |

---

## 2. Temuan Kritis: Ilusi "4.151 Referensi Terverifikasi"

Laporan Phase 2.2 sebelumnya menyatakan:
> *"4.151 Sumber Ditemukan, 4.151 Terverifikasi (100%), 0 Broken Link."*

Fakta investigasi forensik membuktikan:
- **Total Objek Sitasi**: 4.151 objek.
- **Jumlah URL Unik yang Sebenarnya**: **HANYA 47 URL UNIK**.
- 4.151 objek sitasi tersebut tercipta karena generator mereplikasi kumpulan 47 URL yang sama secara berulang-ulang di ribuan subbab kurikulum.

### Tabel 15 URL Terbanyak yang Direplikasi

| Peringkat | URL Target | Domain & Tipe | Jumlah Repetisi | Status Klasifikasi | Alasan / Catatan Audit |
|---|---|---|---|---|---|
| 1 | `https://docs.python.org/3/` | Python Software Foundation (Root Docs) | **716 kali** | `VERIFIED_BUT_GENERAL` | Homepage dokumentasi Python generik; tidak menunjuk modul spesifik. |
| 2 | `https://pytorch.org/docs/stable/` | PyTorch Docs (Root Docs) | **491 kali** | `VERIFIED_BUT_GENERAL` | Homepage PyTorch generik; ditautkan bahkan pada subbab non-PyTorch. |
| 3 | `https://arxiv.org/abs/1706.03762` | arXiv (Attention Is All You Need) | **454 kali** | `VERIFIED_RELEVANT` (Transformer) / `OVERUSED` | Paper Transformer orisinal, namun dipakai secara berlebihan di topik lain. |
| 4 | `https://scikit-learn.org/stable/` | scikit-learn (Root Docs) | **225 kali** | `VERIFIED_BUT_GENERAL` | Homepage dokumentasi umum scikit-learn; tidak menunjuk ke modul/estimatormya. |
| 5 | `https://docs.opencv.org/` | OpenCV Documentation (Root Docs) | **182 kali** | `VERIFIED_BUT_GENERAL` | Homepage umum OpenCV untuk seluruh subbab Computer Vision. |
| 6 | `https://spark.apache.org/docs/latest/` | Apache Spark (Root Docs) | **181 kali** | `VERIFIED_BUT_GENERAL` | Homepage umum Apache Spark. |
| 7 | `https://mlflow.org/docs/latest/ml/tracking/` | MLflow Tracking Documentation | **181 kali** | `VERIFIED_RELEVANT` | Dokumentasi spesifik pelacakan eksperimen MLflow. |
| 8 | `https://web.stanford.edu/~jurafsky/slp3/` | Stanford University (SLP3 Book Draft) | **181 kali** | `VERIFIED_RELEVANT` | Buku teks standar Jurafsky & Martin untuk pemrosesan bahasa alami. |
| 9 | `https://owasp.org/www-project-machine-learning-security-top-10/` | OWASP ML Security Top 10 | **152 kali** | `VERIFIED_RELEVANT` | Standar industri kerentanan sistem machine learning. |
| 10 | `https://link.springer.com/book/10.1007/978-1-4899-7637-6` | Springer Nature (Paywalled Textbook) | **151 kali** | `REQUIRES_LOGIN` | Buku teks berbayar di Springer; tidak dapat diakses gratis oleh umum. |
| 11 | `http://incompleteideas.net/book/the-book-2nd.html` | Sutton & Barto (RL Book) | **151 kali** | `VERIFIED_RELEVANT` | Buku teks definitif Reinforcement Learning (Open Access PDF). |
| 12 | `https://docs.ros.org/en/rolling/` | ROS 2 Documentation (Root Docs) | **151 kali** | `VERIFIED_BUT_GENERAL` | Homepage umum Robot Operating System 2. |
| 13 | `https://www.statsmodels.org/stable/` | Statsmodels Documentation (Root Docs) | **151 kali** | `VERIFIED_BUT_GENERAL` | Homepage umum pustaka analisis statistik Python. |
| 14 | `https://github.com/facebookresearch/faiss` | Meta Research GitHub Repository | **151 kali** | `VERIFIED_RELEVANT` | Repositori resmi pustaka similarity search Faiss. |
| 15 | `https://www.openml.org/` | OpenML Benchmark Repository | **125 kali** | `VERIFIED_BUT_GENERAL` | Homepage portal OpenML; tidak menautkan dataset ID spesifik. |

---

## 3. Evaluasi Sumber Primer vs Sekunder

- **Sumber Primer (Paper Akademik, DOI, Standar Resmi)**:
  - Mewakili 1.250 dari 4.151 sitasi (~30.1%).
  - Contoh: Vaswani et al. (Attention Is All You Need), Goodfellow et al. (GAN), Sutton & Barto (RL), OWASP ML Top 10.
- **Dokumentasi Resmi & Buku Terbuka**:
  - Mewakili 2.750 dari 4.151 sitasi (~66.2%).
  - Namun 72.7% di antaranya hanya menunjuk ke direktori root (`/stable/` atau `/docs/`).
- **Sumber Berbayar / Paywall**:
  - 151 sitasi (Springer Handbook of Biometrics / Expert Systems).

---

## 4. Rekomendasi Remediasi Sumber

1. **Deep-Linking Dokumentasi**:
   Gantikan URL root (`https://scikit-learn.org/stable/`) dengan tautan API spesifik untuk setiap modul:
   - Misal: `https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html` untuk Ridge.
   - Misal: `https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.learning_curve.html` untuk Kurva Pembelajaran.
2. **Diversifikasi Paper Akademik**:
   Jangan menempelkan paper `Attention Is All You Need` sebanyak 454 kali ke berbagai materi yang tidak berhubungan langsung. Kurasi paper spesifik untuk setiap bab:
   - Topic 19 (Machine Learning): Breiman (Random Forests, 2001), Cortes & Vapnik (Support-Vector Networks, 1995), Tibshirani (Lasso, 1996).
   - Topic 16 (GNN): Kipf & Welling (GCN, 2016), Veličković et al. (GAT, 2017).
3. **Penyediaan Open-Access Alternative**:
   Untuk 151 sumber di balik paywall Springer, sediakan tautan alternatif open-access seperti arXiv preprint atau versi resmi yang didistribusikan penulis.
