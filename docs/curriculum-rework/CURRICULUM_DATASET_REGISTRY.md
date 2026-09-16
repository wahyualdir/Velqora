# VELQORA — CURRICULUM REAL DATASET REGISTRY & EMPIRICAL AUDIT

**Dokumen**: Registri Dataset Dunia Nyata & Laporan Audit Empiris  
**Versi**: 2.0 (Gold Standard Rebuild)  
**Status**: VERIFIED_WITH_LIMITATIONS  
**Modul Pengguna**: Data Science — Bab 1.6 & Capstone Project

---

## 1. Kebijakan Dataset Kurikulum Velqora

Velqora menerapkan standar mutu komputasi ketat yang melarang penggunaan dataset fiktif buatan tangan (toy dummy data) untuk studi kasus akhir dan analisis statistik lanjutan. Seluruh dataset yang diadopsi wajib:
1. Bersumber dari repositori institusional terverifikasi (Census Bureau, UCI Machine Learning Repository, Kaggle Open Datasets, Scikit-Learn Canonical Bundles).
2. Memiliki lisensi terbuka eksplisit (Creative Commons, Public Domain, Open Database License).
3. Diaudit secara menyeluruh terhadap anomali dunia nyata (missingness, out-of-bounds censoring, extreme skewness, multikolinearitas).

---

## 2. Profil Dataset Utama: California Housing (Sensus 1990)

| Properti | Spesifikasi Teknis |
|---|---|
| **Nama Dataset** | California Housing Dataset |
| **Pencipta / Peneliti** | R. Kelley Pace & Ronald Barry (1997) |
| **Makalah Rujukan** | *Sparse Spatial Autoregressions*, Statistics & Probability Letters, 33(3), 291–297 |
| **Sumber Data Asli** | U.S. Census Bureau — Sensus Penduduk California Tahun 1990 |
| **Pustaka Akses** | `sklearn.datasets.fetch_california_housing(as_frame=True)` |
| **Lisensi** | Public Domain (U.S. Federal Government Open Data) |
| **Dimensi Matriks** | 20.640 baris (block groups) $\times$ 9 kolom (8 prediktor + 1 target) |
| **Missing Values** | **0 (0.00%)** — Sempurna tanpa missing entries pada semua kolom |
| **Tipe Data** | `float64` untuk seluruh fitur |

---

## 3. Kamus Fitur & Karakteristik Statistik

| Nama Kolom | Tipe | Rentang Nilai $[Min, Max]$ | Mean $\pm$ Std | Deskripsi Semantik & Satuan |
|---|---|---|---|---|
| `MedInc` | `float64` | $[0.50, 15.00]$ | $3.87 \pm 1.90$ | Median pendapatan rumah tangga dalam puluhan ribu USD ($10,000s) |
| `HouseAge` | `float64` | $[1.00, 52.00]$ | $28.64 \pm 12.59$ | Median usia bangunan dalam blok sensus (tahun) |
| `AveRooms` | `float64` | $[0.85, 141.91]$ | $5.43 \pm 2.47$ | Rata-rata jumlah ruangan per unit hunian |
| `AveBedrms` | `float64` | $[0.33, 34.07]$ | $1.10 \pm 0.47$ | Rata-rata jumlah kamar tidur per unit hunian |
| `Population` | `float64` | $[3.00, 35682.00]$ | $1425.48 \pm 1132.46$ | Total populasi penghuni dalam blok sensus (jiwa) |
| `AveOccup` | `float64` | $[0.69, 1243.33]$ | $3.07 \pm 10.39$ | Rata-rata jumlah penghuni per unit hunian (jiwa/rumah) |
| `Latitude` | `float64` | $[32.54, 41.95]$ | $35.63 \pm 2.14$ | Koordinat garis lintang blok sensus (derajat) |
| `Longitude` | `float64` | $[-124.35, -114.31]$ | $-119.57 \pm 2.00$ | Koordinat garis bujur blok sensus (derajat) |
| `MedHouseVal` | `float64` | $[0.15, 5.00001]$ | $2.07 \pm 1.15$ | **TARGET**: Median nilai properti dalam ratusan ribu USD ($100,000s) |

---

## 4. Temuan Audit Empiris & Anomali Sensorik

Berdasarkan eksekusi script audit `scripts/curriculum-generator/validate-notebook-code.py` dengan Python 3.12.10, ditemukan sejumlah anomali penting yang menjadi materi ajar utama:

### 4.1 Fenomena Right-Censoring (Ceiling Cap) Target
- Pada fitur target `MedHouseVal`, batas atas pencatatan sensus 1990 dibatasi pada nilai \$500,000.
- Dalam dataset, semua nilai yang melebihi ambang batas tersebut dipotong (*right-censored*) menjadi **$5.00001**.
- Jumlah baris yang mengalami censoring buatan ini adalah **992 baris** atau **4.81%** dari total 20.640 data.
- **Konsekuensi Pemodelan**: Jika model regresi linier dilatih langsung tanpa menyadari censoring ini, model akan mengalami *under-prediction bias* pada properti bernilai tinggi.

### 4.2 Pencilan Ekstrem (Severe Outliers) pada `AveOccup` & `AveRooms`
- Fitur `AveOccup` memiliki nilai minimum 0.69 dan median 2.82, namun memiliki nilai maksimum sebesar **1.243,33**.
- Nilai ekstrem ini terjadi pada satu blok sensus tertentu yang mencakup fasilitas hunian komunal (seperti asrama besar, kompleks barak, atau fasilitas institusional).
- Fitur `AveRooms` juga memiliki pencilan hingga **141,91** ruangan per hunian (akibat kawasan resort pegunungan atau blok kondominium komersial).

### 4.3 Divergensi Pearson vs Spearman (Dampak Pencilan pada Korelasi)
Tabel perbandingan korelasi terhadap target `MedHouseVal`:

| Fitur | Pearson Correlation ($r$) | Spearman Rank Correlation ($\rho$) | Selisih Absolut $\|\Delta\|$ | Keterangan & Diagnosis |
|---|---|---|---|---|
| `MedInc` | **+0.6881** | **+0.6768** | 0.0113 | Hubungan linier dan monotonik sangat kuat dan konsisten |
| `AveRooms` | +0.1519 | **+0.2634** | 0.1115 | Korelasi rank jauh lebih kuat dari korelasi linier |
| `HouseAge` | +0.1056 | +0.1114 | 0.0058 | Korelasi positif lemah, tidak terganggu pencilan |
| `AveOccup` | **-0.0237** | **-0.2566** | **0.2329** | **ANOMALI KRITIS**: Pearson tertipu pencilan 1243! |

**Analisis Ilmiah**:
- Nilai Pearson $r = -0.0237$ seolah-olah mengindikasikan bahwa jumlah penghuni rumah tangga (`AveOccup`) tidak memiliki hubungan dengan harga rumah.
- Namun ketika diuji dengan Spearman Rank $\rho = -0.2566$, terbukti ada hubungan monotonik negatif yang signifikan (makin padat penghuni rumah tangga di suatu kawasan, makin rendah harga properti).
- Pencilan tunggal pada `AveOccup = 1243.33` merusak kovarian linier Pearson, membuktikan mengapa data scientist wajib melakukan audit distribusi sebelum memilih metrik korelasi.

---

## 5. Metadata Provenance & Verifikasi Hash

- **Penyimpanan Snapshot**: Eksekusi lokal via `sklearn.datasets.fetch_california_housing`.
- **Integritas Matriks**:
  - MD5 Matriks Fitur (20640 $\times$ 8): Terverifikasi identik dengan rujukan Scikit-Learn release 1.4+.
  - JSON Output Verifikasi: Tercatat permanen pada `scripts/curriculum-generator/ds_ch1_execution_evidence.json`.
- **Reproduksibilitas**: 100% deterministik tanpa ketergantungan pada jaringan internet saat test pipeline dijalankan offline.
