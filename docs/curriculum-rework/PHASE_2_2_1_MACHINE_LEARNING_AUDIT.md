# VELQORA — PHASE 2.2.1: AUDIT MENDALAM TOPIK MACHINE LEARNING (TOPIK 19)

> **Dokumen Deliverable**: `docs/curriculum-rework/PHASE_2_2_1_MACHINE_LEARNING_AUDIT.md`  
> **Status Audit**: AUDITED (Pemeriksaan Garis-per-Garis atas 22 Bab, 220 Subbab, 2.200 Unit)  
> **File Sasaran**: `src/lib/curriculum/topics/19-machine-learning.ts` (23.569 baris, 2,43 MB)  
> **Standar Rujukan**: Scikit-Learn 1.9 User Guide & Textbook Standar (Hastie et al., Bishop, Mitchell)  
> **Tanggal Pelaksanaan**: 2026-09-16  

---

## 1. Ringkasan Kepatuhan Kurikulum Machine Learning

Pemeriksaan komparatif antara klaim deskripsi topik dan isi implementasi aktual:

| Komponen Wajib | Klaim Deskripsi | Bukti Aktual dalam File | Evaluasi & Status | Catatan Forensik |
|---|---|---|---|---|
| **Struktur 22 Bab Lengkap** | 22 Bab | **22 Bab Terstruktur** | `VERIFIED` | Bab 1 s.d. Bab 22 lengkap dengan 10 subbab per bab |
| **Dataset California Housing** | Benchmark Riil | **Tersedia di `topic.datasets`** | `VERIFIED_WITH_LIMITATIONS` | Metadata lengkap (20.640 baris, 8 fitur), namun **tidak dipanggil dalam subbab kode praktikum** |
| **Inspeksi Dataset 16-Langkah** | 16-langkah | **Ada di `inspectionSnippet` dataset** | `VERIFIED_WITH_LIMITATIONS` | Kode 16-langkah ada di metadata dataset, namun absen dari alur latihan subbab |
| **Suite Overfitting (Degree 1, 3, 15)** | Regresi Polinomial 1, 3, 15 | **Tidak ditemukan di blok kode subbab** | `DISCREPANCY_FOUND` | Konsep dibahas di narasi teks, namun implementasi kode `PolynomialFeatures(degree=[1,3,15])` belum ada di kode subbab |
| **Tradeoff Bias-Varians** | Formulasi Matematis | **Tersedia Formulasi KaTeX** | `VERIFIED` | Rumus analitis: $\text{MSE} = \text{Bias}^2 + \text{Variance} + \sigma^2$ hadir |
| **Regresi Ridge & Lasso** | Penalti $L_2$ dan $L_1$ | **Tersedia KaTeX & Referensi** | `VERIFIED` | Formulasi minimisasi fungsi rugi objektif tersedia |
| **Kurva Pembelajaran & Validasi** | Evaluasi Generalisasi | **Tersedia Referensi Scikit-Learn** | `VERIFIED` | Rujukan resmi `learning_curve.html` hadir |
| **Data Leakage Mitigation** | Pencegahan Kebocoran | **0 Kasus Kebocoran Terdeteksi** | `PASS` | Tidak ada pola `.fit()` sebelum split yang membocorkan data uji |
| **Integrasi Scikit-Learn Pipeline** | Pemodelan Standar | **Disebutkan di Konsep & Rujukan** | `VERIFIED_WITH_LIMITATIONS` | Narasi konseptual ada, namun kode praktikum belum mendemonstrasikan `Pipeline` lengkap |

---

## 2. Audit Alur Kerja Inspeksi Data 16-Langkah

Pada metadata dataset `California Housing` (`topic.datasets[0]`), skrip 16-langkah telah didefinisikan secara komprehensif:
1. `df.shape` (Dimensi baris & kolom)
2. `df.head()` (Inspeksi 5 baris pertama)
3. `df.dtypes` (Verifikasi tipe data kolom)
4. `df.info()` (Ringkasan memori dan nullitas)
5. `df.describe().T` (Statistik deskriptif 5-serangkai)
6. `df.isna().sum()` (Kuantifikasi missing values)
7. `df.nunique()` (Kardinalitas fitur kategori/kontinu)
8. `df.corr()` (Matriks korelasi Pearson antar fitur)
9. Skewness & Kurtosis distribusi fitur
10. Deteksi Outlier menggunakan metode IQR & Z-score
11. Verifikasi duplikasi baris (`df.duplicated().sum()`)
12. Analisis batas sensorik target (`capping at 5.0`)
13. Deteksi multikolinieritas via Variance Inflation Factor (VIF)
14. Analisis relasi spasial (`Latitude` vs `Longitude`)
15. Pemisahan stratifikasi fitur berdasarkan blok sensus
16. Verifikasi integritas pipeline pemuatan data

**Kritik Temuan**:
Skrip inspeksi 16-langkah ini berada di dalam objek metadata dataset topik, tetapi **tidak terurai ke dalam bab-bab praktikum awal (Bab 2: Data Preprocessing)**. Mahasiswa yang membuka Bab 2 hanya menemui kode print singkat alih-alih mengeksekusi 16 langkah inspeksi ini secara bertahap.

---

## 3. Audit Suite Penanganan Overfitting & Underfitting

### A. Formulasi Matematis yang Terverifikasi
Formulasi analitis dekomposisi galat telah termuat dengan sintaks KaTeX yang valid:
$$\mathbb{E}[(y - \hat{f}(x))^2] = \text{Bias}[\hat{f}(x)]^2 + \text{Var}[\hat{f}(x)] + \sigma^2$$
Penalti regularisasi $L_2$ (Ridge) dan $L_1$ (Lasso):
$$\mathcal{L}_{\text{Ridge}} = \frac{1}{2n} \|y - Xw\|_2^2 + \frac{\alpha}{2} \|w\|_2^2$$
$$\mathcal{L}_{\text{Lasso}} = \frac{1}{2n} \|y - Xw\|_2^2 + \alpha \|w\|_1$$

### B. Kesenjangan Kode Implementasi
Meskipun formula matematika dan teori bias-varians lengkap:
- Di Bab 6 (Overfitting & Regularization), kode praktikum subbab `sub.codeExamples` hanya memuat print penjelasan atau dictionary kecil.
- Kode pemodelan perbandingan:
  ```python
  from sklearn.preprocessing import PolynomialFeatures
  from sklearn.linear_model import LinearRegression
  # perbandingan degree=1 (underfitting), degree=3 (optimal), degree=15 (overfitting)
  ```
  belum disertakan secara runnable dalam subbab terkait.

---

## 4. Evaluasi Kebocoran Data (Data Leakage) & Evaluasi Model

- **Data Leakage**: Tidak ditemukan insiden kebocoran data aktif. Hal ini sebagian disebabkan karena kode subbab belum menjalankan preprocessing berat berbasis `fit_transform`.
- **Protokol Validasi**: Bab 5 secara teoritis menjelaskan pemisahan `train`, `validation`, dan `test` serta K-Fold Cross-Validation, namun implementasi praktis perlu diperkaya dengan kode evaluasi metrik (Precision, Recall, F1, ROC-AUC, PR-AUC).

---

## 5. Rekomendasi Khusus untuk Topik 19 (Machine Learning)

1. **Suntikkan Kode Inspeksi 16-Langkah**:
   Pindahkan kode inspeksi dari metadata dataset langsung ke Bab 2 Subbab 2.1–2.5 sehingga siswa dapat menjalankannya langsung di browser.
2. **Implementasikan Skrip Polinomial Derajat 1, 3, 15**:
   Gantikan kode print di Bab 6 dengan skrip Scikit-Learn runnable yang menghitung MSE latih vs uji pada derajat 1, 3, dan 15.
3. **Praktikum End-to-End `Pipeline`**:
   Tambahkan contoh Scikit-Learn `Pipeline([('scaler', StandardScaler()), ('model', Ridge(alpha=1.0))])` pada subbab integrasi pemodelan.
