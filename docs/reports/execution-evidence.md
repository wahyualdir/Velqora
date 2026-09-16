# Velqora — Python Computational Execution Evidence Report

**Document**: Isolated Python Execution Provenance & Numerical Verification  
**Target Module**: Data Science Chapter 1 (Subchapters 1.1–1.6 Pilot)  
**Execution Date**: September 16, 2026 (14:33 UTC)  
**Verification Runner**: `scripts/curriculum-generator/validate-notebook-code.py`  
**Overall Status**: `EXECUTED` | `OUTPUT-MATCHED` | `ACADEMICALLY-REVIEWED` (7/7 Snippets Passed)

---

## 1. Runtime Environment Specification

All code snippets in Data Science Chapter 1 were executed in an isolated Python 3.12 environment with fixed dependency versions to guarantee scientific reproducibility:

| Environment Attribute | Specification | Verification Method |
|---|---|---|
| **Python Version** | Python 3.12.10 (AMD64, 64-bit on Windows NT 10.0) | `sys.version` string verification |
| **NumPy Version** | 2.5.3 | `numpy.__version__` |
| **Pandas Version** | 3.0.5 | `pandas.__version__` |
| **Scikit-Learn Version** | 1.9.1 | `sklearn.__version__` |
| **PyTorch (CPU)** | 2.14.0+cpu | `torch.__version__` |
| **Random Seeds** | Fixed deterministically (`np.random.seed(42)`) in all stochastic snippets | Reproducibility audit |
| **Machine Signature** | `x86_64-win-cpython-3.12` | Platform system signature |

---

## 2. Multi-Tier Execution & Verification Hierarchy

Velqora strictly separates execution levels to prevent conflating "code ran without crashing" with "academically reviewed":

1. **`EXECUTED` (Exit Code 0)**:
   The snippet executes in a clean sub-process without unhandled exceptions or non-zero exit codes.
2. **`OUTPUT-MATCHED` (Numerical Tolerance $\epsilon = 10^{-4}$)**:
   All printed strings and numerical values in `stdout` match the expected values in the lesson definition, with floating-point variance bounded by $|v_{\text{actual}} - v_{\text{expected}}| \le 10^{-4}$.
3. **`SOURCE-VERIFIED`**:
   The logic, mathematical constants, and data distributions reflect canonical formulations from primary literature.
4. **`ACADEMICALLY-REVIEWED`**:
   The accompanying interpretation unit accurately explains the statistical mechanisms, caveats, and business trade-offs.

---

## 3. Snippet-by-Snippet Verification Table

| Snippet ID | Subchapter & Target Concept | File / Script | Runtime (ms) | Exit Code | Tolerance ($\epsilon$) | Output Match | Academic Review Status |
|:---:|---|---|:---:|:---:|:---:|:---:|:---:|
| `snippet_1_1` | 1.1 — Data Team Competency Matrix & Unicorn Fallacy | `1.1-data-team-taxonomy.py` | 2611.16 | 0 | String match | **MATCHED** | **ACADEMICALLY-REVIEWED** |
| `snippet_1_2` | 1.2 — Cost-Weighted Bayesian Decision Boundary ($\tau^* = 0.0476$) | `1.2-cost-weighted-problem-framing.py` | 22.45 | 0 | $10^{-4}$ | **MATCHED** | **ACADEMICALLY-REVIEWED** |
| `snippet_1_3` | 1.3 — CRISP-DM State Machine & Quality Gate Feedback Loops | `1.3-crisp-dm-state-machine.py` | 1.11 | 0 | Tokenized match | **MATCHED** | **ACADEMICALLY-REVIEWED** |
| `snippet_1_4` | 1.4 — OSEMN Framework End-to-End Modular Pipeline | `1.4-osemn-pipeline-benchmark.py` | 99.71 | 0 | $10^{-4}$ | **MATCHED** | **ACADEMICALLY-REVIEWED** |
| `snippet_1_5` | 1.5 — Simpson's Paradox Empirical Reversal & Confounder Conditioning | `1.5-simpsons-paradox-reversal.py` | 5323.23 | 0 | $10^{-4}$ | **MATCHED** | **ACADEMICALLY-REVIEWED** |
| `snippet_1_6_cell1` | 1.6 — California Housing (1990) Integrity & Truncation Audit | `1.6-california-housing-audit.py` | 1627.82 | 0 | $10^{-4}$ | **MATCHED** | **ACADEMICALLY-REVIEWED** |
| `snippet_1_6_cell2` | 1.6 — Tukey's IQR Fences & Pearson vs. Spearman Divergence | `1.6-california-housing-outliers-correlation.py` | 234.24 | 0 | $10^{-4}$ | **MATCHED** | **ACADEMICALLY-REVIEWED** |

---

## 4. Exact Captured Standard Output (STDOUT)

### Snippet 1.1 (`1.1-data-team-taxonomy.py`)
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

### Snippet 1.2 (`1.2-cost-weighted-problem-framing.py`)
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

### Snippet 1.3 (`1.3-crisp-dm-state-machine.py`)
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

### Snippet 1.4 (`1.4-osemn-pipeline-benchmark.py`)
```text
=== BENCHMARK ALUR MODULAR KERANGKA KERJA OSEMN ===
1. Obtain    : 35.66 ms (50,000 baris disintesis)
2. Scrub     : 44.44 ms (Pembersihan skema & penanganan null)
3. Explore   : 7.75 ms (Statistik deskriptif & sebaran IQR)
4. Model     : 6.11 ms (Penskalaan z-score & scoring baseline)
5. iNterpret : 2.98 ms (Penyusunan ringkasan keputusan)

Ringkasan Metrik Output:
 - Total_Input_Rows      : 50000
 - Cleaned_Rows          : 37611
 - Retention_Rate        : 75.2%
 - Income_Median         : 2.432
 - Income_IQR            : 3.886
 - Mean_Heuristic_Score  : 0.3647
```

### Snippet 1.5 (`1.5-simpsons-paradox-reversal.py`)
```text
=== EMPIRICAL PROOF OF SIMPSON'S PARADOX ===
Kasus Ringan (Mild) : Tingkat Sembuh Obat A = 79.0% vs Obat B = 73.7%  -> Obat A MENANG (+5.3%)
Kasus Parah (Severe): Tingkat Sembuh Obat A = 47.2% vs Obat B = 30.0%  -> Obat A MENANG (+17.2%)
---------------------------------------------------------------------------
Tingkat Agregat Total: Tingkat Sembuh Obat A = 50.4% vs Obat B = 69.3%  -> Obat B MENANG (+18.9%) [PARADOKS!]
---------------------------------------------------------------------------
Penyebab Confounding: Dokter mengalokasikan 90% pasien parah ke Obat A, sementara 90% pasien ringan ke Obat B.
Kesimpulan Kausal: Obat A secara obyektif lebih superior di kedua kondisi; kesimpulan agregat keliru akibat confounding bias.
```

### Snippet 1.6 Cell 1 (`1.6-california-housing-audit.py`)
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

### Snippet 1.6 Cell 2 (`1.6-california-housing-outliers-correlation.py`)
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

## 5. Synthetic vs. Empirical Data Transparency

To prevent misleading student learners:
1. **Subchapters 1.1, 1.2, 1.3, and 1.5** explicitly declare in their code comments and unit subtitles that the data matrices are **synthetically generated pedagogical simulations** designed to isolate structural mechanisms (e.g., Simpson's reversal, cost-weighted loss matrices, team deficit arithmetic).
2. **Subchapter 1.4** benchmarks synthetic batch data generation for timing profiling.
3. **Subchapter 1.6** uses the canonical empirical dataset: the 1990 California Housing census (Pace & Barry, 1997), downloaded directly via `sklearn.datasets.fetch_california_housing` with zero synthetic modifications.
