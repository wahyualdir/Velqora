# PETA SUMBER KANONIKAL BATCH 1: DEEP LEARNING & DATA SCIENCE (PHASE 2.4)
**Dokumen Referensi**: VELQORA-B1-SRC-2026-01  
**Source Verification Specialist**: Senior Curriculum Architect & Technical Writer  
**Tanggal Verifikasi**: 16 September 2026  
**Status**: VERIFIED_RELEVANT (100% Sumber Terhubung ke SSOT Kanonikal & Mendukung Klaim Materi)

---

## 1. Standar Penjaminan Mutu Sumber

Sesuai aturan Phase 2.4:
- Setiap klaim matematis, algoritma, dan arsitektur wajib dipetakan ke sumber kanonikal spesifik (bukan sekadar daftar pustaka umum di akhir file).
- Sumber harus berbobot akademis (buku teks universitas rujukan dunia, paper penemu algoritma/arsitektur terindeks, dan dokumentasi resmi framework).
- URL generik root domain tanpa halaman spesifik dilarang keras.

---

## 2. Pemetaan Sumber Topik 1: Deep Learning (`deep-learning`)

| ID Sumber SSOT | Karya / Dokumen Kanonikal | Pengarang / Organisasi | Tahun | Tipe Sumber | Konsep yang Didukung | Bagian Materi yang Menggunakan | Status Relevansi |
|---|---|---|---|---|---|---|---|
| `src-goodfellow-deep-learning` | *Deep Learning* (MIT Press) | Ian Goodfellow, Yoshua Bengio, Aaron Courville | 2016 | Academic Book | Fondasi Jaringan Saraf Tiruan, Aljabar Linier, Perseptron Multi-Lapis (MLP), Fungsi Aktivasi (ReLU, Sigmoid, Tanh), Penurunan Matematis Backpropagation, Fungsi Kerugian (Cross-Entropy, MSE), dan Regularisasi (L2, Dropout). | Bab 1: Fondasi Deep Learning, Arsitektur Jaringan Saraf Tiruan & Backpropagation | **VERIFIED_RELEVANT** (Sumber Primer Konseptual) |
| `src-kingma-adam-2014` | *Adam: A Method for Stochastic Optimization* (ICLR 2015) | Diederik P. Kingma & Jimmy Ba | 2014 | Milestone Paper | Algoritma optimasi gradien stokastik adaptif: estimasi momen pertama ($m_t$), estimasi momen kedua ($v_t$), koreksi bias ($\hat{m}_t, \hat{v}_t$), serta perbandingan konvergensi terhadap SGD konvensional. | Bab 1 Subbab 1.3: Algoritma Optimasi Gradien Stokastik & Adam | **VERIFIED_RELEVANT** (Sumber Primer Algoritma) |
| `src-pytorch-nn-module-doc` | *PyTorch Documentation: torch.nn.Module* | PyTorch Contributors | 2024 | Official Documentation | Arsitektur OOP modular pembelajaran mendalam, pewarisan kelas `nn.Module`, registrasi bobot dan bias (`Parameter`), deklarasi `forward()` pass, dan state dictionary (`state_dict`). | Bab 1 Subbab 1.4: Implementasi Modular Jaringan Saraf dengan PyTorch | **VERIFIED_RELEVANT** (Dokumentasi Resmi Pustaka) |
| `src-pytorch-autograd-doc` | *Autograd mechanics in PyTorch* | PyTorch Contributors | 2024 | Official Documentation | Mekanisme *Dynamic Computation Graph*, pelacakan gradien otomatis (`requires_grad=True`), eksekusi `backward()`, isolasi evaluasi (`torch.no_grad()`), dan akumulasi gradien. | Bab 1 Subbab 1.2: Komputasi Aliran Maju & Autograd | **VERIFIED_RELEVANT** (Dokumentasi Resmi Pustaka) |

---

## 3. Pemetaan Sumber Topik 2: Data Science (`data-science`)

| ID Sumber SSOT | Karya / Dokumen Kanonikal | Pengarang / Organisasi | Tahun | Tipe Sumber | Konsep yang Didukung | Bagian Materi yang Menggunakan | Status Relevansi |
|---|---|---|---|---|---|---|---|
| `src-hastie-elements-statistical-learning` | *The Elements of Statistical Learning* (Springer) | Trevor Hastie, Robert Tibshirani, Jerome Friedman | 2009 | Academic Book | Siklus pemodelan data terawasi dan tak terawasi, dekomposisi galat prediksi kuadrat, validasi silang (Cross-Validation), penaksiran risiko empiris, dan prinsip penilaian model statistik. | Bab 1: Metodologi Sains Data, Siklus Hidup Proyek & Uji Statistik | **VERIFIED_RELEVANT** (Sumber Primer Statistik) |
| `src-dataset-california-housing` | *California Housing Dataset* | R. Kelley Pace & Ronald Barry | 1997 | Benchmark Dataset | Dataset benchmark 20.640 sampel blok sensus dengan 8 fitur kontinu; standar industri untuk demonstrasi inspeksi schema, eksplorasi data (EDA), rekayasa fitur, dan pemodelan prediktif. | Bab 1 Subbab 1.2 & 1.4: Praktikum Analisis Eksploratif & Pemodelan Data Riil | **VERIFIED_RELEVANT** (Dataset Provenance) |
| `src-scikit-learn-pipeline-doc` | *Pipelines and Composite Estimators* | Scikit-learn Developers | 2024 | Official Documentation | Arsitektur `Pipeline` dan `ColumnTransformer` untuk mencegah kebocoran data (*data leakage*); menjamin fit transformer (scaler, imputer) hanya dieksekusi pada data pelatihan. | Bab 1 Subbab 1.3: Rekayasa Fitur & Pencegahan Kebocoran Data | **VERIFIED_RELEVANT** (Dokumentasi Resmi Pustaka) |
| `src-scikit-learn-model-evaluation` | *Metrics and Scoring: Quantifying Prediction Quality* | Scikit-learn Developers | 2024 | Official Documentation | Formulasi metrik evaluasi ilmiah (RMSE, MAE, R², Confusion Matrix, Precision-Recall, F1) serta interpretasi kuantitatif performa model pada data uji independen. | Bab 1 Subbab 1.4: Evaluasi Statistik & Validasi Model | **VERIFIED_RELEVANT** (Dokumentasi Resmi Pustaka) |

---

## 4. Evaluasi Ketepatan Konsep vs Rujukan

Auditor telah memeriksa kesesuaian klaim materi terhadap teks rujukan kanonikal:
1. **Aturan Rantai Backprop**: Diturunkan secara presisi sesuai formulasi matriks Bab 6 Goodfellow et al. (2016):
   $$\frac{\partial J}{\partial W^{[l]}} = \frac{\partial J}{\partial Z^{[l]}} (A^{[l-1]})^T$$
2. **Koreksi Bias Adam**: Mengikuti secara identik rumus Kingma & Ba (2014):
   $$\hat{m}_t = \frac{m_t}{1 - \beta_1^t}, \quad \hat{v}_t = \frac{v_t}{1 - \beta_2^t}$$
3. **Pencegahan Data Leakage**: Sesuai rekomendasi teknis Scikit-Learn Developers (2024), di mana `StandardScaler.fit()` hanya boleh menerima partisi latih ($X_{\text{train}}$).
4. **Metodologi Siklus Hidup Data Science**: Mengkaji kerangka kerja CRISP-DM (*Cross-Industry Standard Process for Data Mining*) dan OSEMN sebagai panduan praktis fleksibel, bukan aturan dogmatis kaku.

---

## 5. Kesimpulan Tahap 5

Seluruh materi Batch 1 bertumpu 100% pada literatur akademik bereputasi tinggi dan dokumentasi resmi industri. Tidak ada referensi fiktif atau URL generik yang tidak relevan.

**Status Tahap 5**: **VERIFIED_RELEVANT**
