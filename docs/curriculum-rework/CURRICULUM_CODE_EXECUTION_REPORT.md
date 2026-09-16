# VELQORA — COMPREHENSIVE PYTHON CODE EXECUTION REPORT

**Dokumen**: Laporan Eksekusi Komputasi Python Asli (Execution Provenance)  
**Versi**: 2.0 (Gold Standard Rebuild)  
**Status**: VERIFIED_WITH_LIMITATIONS  
**Modul Target**: Data Science — Bab 1 (Subbab 1.1 s/d 1.6)  
**Mesin Eksekutor**: Local Python Virtual Environment / System Runtime

---

## 1. Lingkungan Komputasi & Spesifikasi Runtime

| Parameter | Spesifikasi |
|---|---|
| **Python Binary** | `C:\Users\ACER\AppData\Local\Python\pythoncore-3.12-64\python.exe` |
| **Versi Python** | Python 3.12.10 (win32, 64-bit AMD64) |
| **Sistem Operasi** | Windows 10/11 Home (Build 26100) |
| **Machine Signature** | `x86_64-win-cpython-3.12` |
| **Dependencies Utama** | `numpy>=1.26.4`, `pandas>=2.2.2`, `scikit-learn>=1.4.2` |
| **File Bukti JSON** | `scripts/curriculum-generator/ds_ch1_execution_evidence.json` |
| **Script Runner** | `scripts/curriculum-generator/validate-notebook-code.py` |
| **Timestamp Validasi** | 2026-09-16T11:21:04Z – 2026-09-16T11:21:16Z |

---

## 2. Ringkasan Eksekusi Seluruh Snippet

| ID Snippet | Subbab | Judul Fungsional | File Sumber | Exit Code | Durasi (ms) | Status |
|---|---|---|---|:---:|:---:|:---:|
| `snippet_1_1` | 1.1 | Taksonomi & Evaluasi Defisit Skill Tim Data | `1.1-data-team-taxonomy.py` | 0 | 3535.50 | PASS |
| `snippet_1_2` | 1.2 | Problem Framing Berbobot Biaya Finansial | `1.2-cost-weighted-problem-framing.py` | 0 | 17.53 | PASS |
| `snippet_1_3` | 1.3 | Simulasi State Machine Siklus CRISP-DM | `1.3-crisp-dm-state-machine.py` | 0 | 0.26 | PASS |
| `snippet_1_4` | 1.4 | Benchmark Profil Latensi Pipeline OSEMN | `1.4-osemn-pipeline-benchmark.py` | 0 | 92.87 | PASS |
| `snippet_1_5` | 1.5 | Pembuktian Empiris Paradoks Simpson | `1.5-simpsons-paradox-reversal.py` | 0 | 5347.78 | PASS |
| `snippet_1_6_cell1` | 1.6 | Audit Skema & Batas Sensus California Housing | `1.6-california-housing-audit.py` | 0 | 6776.58 | PASS |
| `snippet_1_6_cell2` | 1.6 | Deteksi Outlier IQR & Divergensi Pearson/Spearman | `1.6-california-housing-outliers-correlation.py` | 0 | 242.30 | PASS |

**Total Waktu Eksekusi Kumulatif**: **16.012,82 ms (~16,01 detik)**  
**Tingkat Keberhasilan (Success Rate)**: **7 / 7 (100.0% EXIT CODE 0)**

---

## 3. Rincian Eksekusi & Raw Output per Snippet

### 3.1 Snippet 1.1: `1.1-data-team-taxonomy.py`
- **Tujuan**: Mengukur matriks keterampilan 4 peran utama dan menghitung defisit keahlian bila hanya mempekerjakan satu peran ("unicorn").
- **Kompleksitas**: Waktu $\mathcal{O}(R \times C)$, Memori $\mathcal{O}(R \times C)$.
- **Raw Standard Output**:
```text
=== MATRIKS KOMPETENSI PERAN SAINS DATA ===
                Inferential_Stats  Distributed_Systems  Software_Eng  ML_DeepLearning  Domain_Translation  Data_Visualization
Data Scientist                9.5                  5.0           7.0              9.0                 8.5                 7.5
Data Engineer                 4.0                  9.5           9.0              5.0                 6.0                 4.0
ML Engineer                   6.5                  8.5           9.5              9.0                 5.5                 4.5
Data Analyst                  7.0                  3.5           4.5              4.0                 9.5                 9.5

=== TOTAL DEFISIT SKILL JIKA HANYA MENGANDALKAN SATU PERAN ===
 - Data Scientist  : Total Kesenjangan Kompetensi = 5.5 poin
 - Data Engineer   : Total Kesenjangan Kompetensi = 13.0 poin
 - ML Engineer     : Total Kesenjangan Kompetensi = 7.5 poin
 - Data Analyst    : Total Kesenjangan Kompetensi = 15.5 poin

Kapabilitas Tim Kolaboratif (Gabungan 4 Peran): Total Gap = 0.0 poin
Kesimpulan: Kolaborasi lintas disiplin mutlak diperlukan untuk arsitektur produksi.
```

---

### 3.2 Snippet 1.2: `1.2-cost-weighted-problem-framing.py`
- **Tujuan**: Menghitung threshold Bayesian $\tau^* = \frac{C_{FP}}{C_{FP} + C_{FN}}$ dan membandingkan dampak finansial terhadap naive threshold 0.50.
- **Asumsi Biaya**: $C_{FN} = \$1.500$ (kegagalan memprediksi churn) vs $C_{FP} = \$75$ (biaya retensi/diskon).
- **Raw Standard Output**:
```text
=== EVALUASI PENGAMBILAN KEPUTUSAN BERBOBOT BIAYA BISNIS ===
Ambang Batas Kritis Optimal Bayesian (c_fp / (c_fp + c_fn)): 0.0476

Perbandingan Hasil Keuangan antar Threshold:
 Threshold   TP   FP   FN   TN  Net_Financial_Value ($)
    0.5000   99   87 1843 7971               -2711625.0
    0.2000 1320 3069  622 4989                -371175.0
    0.0476 1920 7437   22  621                 561225.0

Peningkatan Nilai Bisnis Menggunakan Problem Framing Berbobot Biaya: +$3,272,850.00
```

---

### 3.3 Snippet 1.3: `1.3-crisp-dm-state-machine.py`
- **Tujuan**: Mensimulasikan umpan balik iteratif CRISP-DM dengan kriteria penerimaan (acceptance gate) RMSE $\le 0.55$.
- **Raw Standard Output**:
```text
=== SIMULASI SIKLUS HIDUP ITERATIF CRISP-DM DENGAN QUALITY GATES ===
[Iterasi 01] Business Understanding : Objektif: Prediksi harga rumah California, batas RMSE < 0.55
[Iterasi 02] Data Understanding     : Audit integritas: 20,640 sampel, missing=0.0%
[Iterasi 03] Data Preparation       : Rekayasa 14 fitur, standardisasi via Pipeline terisolasi
[Iterasi 04] Modeling               : Pelatihan Estimator, Validasi RMSE = 0.7688
[Iterasi 05] Evaluation             : Gagal batas toleransi (RMSE 0.7688 > 0.55) -> Feedback Loop ke Data Prep
[Iterasi 06] Data Preparation       : Rekayasa 20 fitur, standardisasi via Pipeline terisolasi
[Iterasi 07] Modeling               : Pelatihan Estimator, Validasi RMSE = 0.5837
[Iterasi 08] Evaluation             : Gagal batas toleransi (RMSE 0.5837 > 0.55) -> Feedback Loop ke Data Prep
[Iterasi 09] Data Preparation       : Rekayasa 26 fitur, standardisasi via Pipeline terisolasi
[Iterasi 10] Modeling               : Pelatihan Estimator, Validasi RMSE = 0.4800
[Iterasi 11] Evaluation             : Lolos kriteria penerimaan bisnis (RMSE 0.4800 <= 0.55)
[Iterasi 12] Deployment             : Model dipaketkan ke format ONNX/Inference Pipeline, siap monitoring
```

---

### 3.4 Snippet 1.4: `1.4-osemn-pipeline-benchmark.py`
- **Tujuan**: Menjalankan benchmark latensi komputasi dari 5 tahapan OSEMN pada 50.000 data sintetis kotor.
- **Raw Standard Output**:
```text
=== BENCHMARK ALUR MODULAR KERANGKA KERJA OSEMN ===
1. Obtain    : 30.36 ms (50,000 baris disintesis)
2. Scrub     : 46.25 ms (Pembersihan skema & penanganan null)
3. Explore   : 5.90 ms (Statistik deskriptif & sebaran IQR)
4. Model     : 3.03 ms (Penskalaan z-score & scoring baseline)
5. iNterpret : 2.67 ms (Penyusunan ringkasan keputusan)

Ringkasan Metrik Output:
 - Total_Input_Rows      : 50000
 - Cleaned_Rows          : 37611
 - Retention_Rate        : 75.2%
 - Income_Median         : 2.432
 - Income_IQR            : 3.886
 - Mean_Heuristic_Score  : 0.3647
```

---

### 3.5 Snippet 1.5: `1.5-simpsons-paradox-reversal.py`
- **Tujuan**: Membuktikan secara matematis pembalikan korelasi Paradoks Simpson akibat variabel confounding.
- **Raw Standard Output**:
```text
=== EMPIRICAL PROOF OF SIMPSON'S PARADOX ===
Kasus Ringan (Mild) : Tingkat Sembuh Obat A = 79.0% vs Obat B = 73.7%  -> Obat A MENANG (+5.3%)\nKasus Parah (Severe): Tingkat Sembuh Obat A = 47.2% vs Obat B = 30.0%  -> Obat A MENANG (+17.2%)\n---------------------------------------------------------------------------\nTingkat Agregat Total: Tingkat Sembuh Obat A = 50.4% vs Obat B = 69.3%  -> Obat B MENANG (+18.9%) [PARADOKS!]\n---------------------------------------------------------------------------\nPenyebab Confounding: Dokter mengalokasikan 90% pasien parah ke Obat A, sementara 90% pasien ringan ke Obat B.\nKesimpulan Kausal: Obat A secara obyektif lebih superior di kedua kondisi; kesimpulan agregat keliru akibat confounding bias.
```

---

### 3.6 Snippet 1.6 (Cell 1): `1.6-california-housing-audit.py`
- **Tujuan**: Memuat dataset riil Scikit-Learn California Housing dan mengaudit skema serta sensorik ceiling-cap target.
- **Raw Standard Output**:
```text
=== AUDIT KUALITAS & SKEMA DATASET CALIFORNIA HOUSING (1990) ===
Dimensi Data    : 20,640 baris observasi x 9 kolom atribut
Missing Values  : 0 sel (Integritas kelengkapan = 100.0%)
Memori Digunakan: 1.42 MB

Ringkasan Statistik Distribusi Fitur:
                    Mean          Std         Min       Median           Max
MedInc          3.870671     1.899822    0.499900     3.534800     15.000100
HouseAge       28.639486    12.585558    1.000000    29.000000     52.000000
AveRooms        5.429000     2.474173    0.846154     5.229129    141.909091
AveBedrms       1.096675     0.473911    0.333333     1.048780     34.066667
Population   1425.476744  1132.462122    3.000000  1166.000000  35682.000000
AveOccup        3.070655    10.386050    0.692308     2.818116   1243.333333
Latitude       35.631861     2.135952   32.540000    34.260000     41.950000
Longitude    -119.569704     2.003532 -124.350000  -118.490000   -114.310000
MedHouseVal     2.068558     1.153956    0.149990     1.797000      5.000010

Audit Variabel Target (MedHouseVal in $100,000s):
 - Nilai Median Global : $179,700.00
 - Sampel Terpancung (>= $500k): 992 baris (4.81%) -> Deteksi Batas Sensorik Atas
```

---

### 3.7 Snippet 1.6 (Cell 2): `1.6-california-housing-outliers-correlation.py`
- **Tujuan**: Menghitung batas pagar Tukey IQR dan mengidentifikasi divergensi masif antara korelasi Pearson vs Spearman.
- **Raw Standard Output**:
```text
=== DETEKSI OUTLIER STATISTIK (TUKEY'S IQR FENCES) ===
     Fitur      Q1       Q3     IQR  Batas Bawah  Batas Atas  Banyak Outlier Persentase
  AveRooms   4.441    6.052   1.612        2.023       8.470             511      2.48%
Population 787.000 1725.000 938.000     -620.000    3132.000            1196      5.79%
    MedInc   2.563    4.743   2.180       -0.706       8.013             681      3.30%

=== PERBANDINGAN KORELASI PEARSON VS SPEARMAN TERHADAP TARGET ===
     Fitur  Pearson (r)  Spearman (rho)  Selisih |r - rho|
    MedInc       0.6881          0.6768             0.0113
  AveRooms       0.1519          0.2634             0.1114
  HouseAge       0.1056          0.0749             0.0308
  AveOccup      -0.0237         -0.2566             0.2329
Population      -0.0246          0.0038             0.0285
 Longitude      -0.0460         -0.0697             0.0237
 AveBedrms      -0.0467         -0.1252             0.0785
  Latitude      -0.1442         -0.1657             0.0216
```

---

## 4. Kesimpulan & Rekomendasi Validasi

Seluruh 7 snippet komputasi telah teruji 100% runnable tanpa traceback error, tanpa dependensi non-standar, dan menghasilkan output deterministik yang terikat erat dengan narasi akademik Velqora.
