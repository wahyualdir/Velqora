# VELQORA — PHASE 2.2.1: AUDIT EKSEKUSI KODE RUNNABLE & INTEGRITAS KOMPUTASI

> **Dokumen Deliverable**: `docs/curriculum-rework/PHASE_2_2_1_CODE_EXECUTION_AUDIT.md`  
> **Status Audit**: AUDITED (100% FULL CENSUS ACROSS ALL 4,050 CODE BLOCKS)  
> **Lingkungan Pengujian**: Python 3.14.5 (Headless Execution, In-Process Scope Isolation, Redirected Stdout/Stderr)  
> **Pustaka Terpasang**: NumPy 2.4.6, SciPy 1.17.1, Scikit-Learn 1.9.0, Pandas 3.0.3, Matplotlib 3.11.1, LightGBM 4.7.0, XGBoost 3.4.0  
> **Tanggal Pelaksanaan**: 2026-09-16  

---

## 1. Hasil Sensus Eksekusi Kode (4.050 Blok Kode)

Pemeriksaan independen dijalankan terhadap seluruh 4.050 blok kode Python yang terdapat di seluruh subbab 28 topik kurikulum. Hasil klasifikasi berdasarkan 9 kategori standar adalah sebagai berikut:

| Status Klasifikasi | Definisi Operasional | Jumlah Blok | Persentase | Status Penilaian |
|---|---|---|---|---|
| `OUTPUT_MISMATCH` | Kode berhasil dieksekusi tanpa galat, namun **keluaran aktual berbeda total dari `expectedOutput`** karena generator menyematkan string placeholder sintetis: `"Status eksekusi: Komputasi berhasil dan output metrik valid."` | **3.716** | **91.75%** | `CRITICAL_FINDING` |
| `FAILS_RUNTIME` | Kode gagal dieksekusi dan melempar eksepsi runtime (`NameError`, `TypeError`, `AttributeError`, variabel tidak terdefinisi). | **251** | **6.20%** | `CRITICAL_DEFECT` |
| `FAILS_DEPENDENCY` | Kode mengimpor pustaka pihak ketiga yang tidak terpasang di runtime standar (`import torch`, `import tensorflow`, `import cv2`). | **57** | **1.41%** | `DEPENDENCY_MISSING` |
| `RUNNABLE_WITH_ENVIRONMENT_NOTES` | Kode memerlukan kredensial khusus, API key, atau variabel lingkungan tertentu. | **25** | **0.62%** | `ENV_REQUIRED` |
| `INVALID_INPUT` | Kode mencoba membaca file lokal `.csv` atau resource eksternal yang tidak tersedia di repositori. | **1** | **0.02%** | `RESOURCE_MISSING` |
| `RUNNABLE_VERIFIED` | Kode berhasil dieksekusi mandiri dan keluaran stdout persis cocok dengan `expectedOutput` yang terdokumentasi. | **0** | **0.00%** | `FAILED` |
| `DATA_LEAKAGE_RISK` | Terdeteksi kebocoran data (misal: pemanggilan `.fit()` sebelum `train_test_split()`). | **0** | **0.00%** | `PASS` |
| `PSEUDOCODE_MISLABELED` | Kode semu/pseudocode yang salah dilabeli sebagai kode Python runnable. | **0** | **0.00%** | `PASS` |
| `MANUAL_REVIEW_REQUIRED` | Kode yang memerlukan verifikasi manual tambahan. | **0** | **0.00%** | `PASS` |
| **TOTAL BLOK KODE** | **Sensus Penuh 100% Seluruh Subbab Kurikulum** | **4.050** | **100.00%** | **AUDIT LENGKAP** |

---

## 2. Analisis Temuan Utama

### A. Anomali Sintetis `OUTPUT_MISMATCH` (91.75%)
Temuan paling mencolok adalah bahwa **3.716 blok kode (91.75%)** memiliki `expectedOutput` yang berbunyi:
```text
"Status eksekusi: Komputasi berhasil dan output metrik valid."
```
Namun saat kode dijalankan di Python:
- Ada kode yang mencetak kamus dictionary: `{'Supervised': 'Data berpasangan...'}`.
- Ada kode yang mencetak kalimat: `'Program dikatakan belajar jika kinerjanya pada tugas T...'`.
- Ada kode yang mencetak nilai float, dimensi array NumPy, atau matriks.

Karena generator sintetis pada Phase 2.2 tidak benar-benar mengeksekusi kode sebelum mencatat `expectedOutput`, generator menyematkan kalimat boilerplate generik yang sama pada ribuan modul. Hal ini secara formal melanggar prinsip verifikasi ilmiah.

### B. Kegagalan Runtime Eksekusi (`FAILS_RUNTIME`: 251 Blok)
Sebanyak 251 blok kode melempar *fatal error* saat dieksekusi:
- **`NameError`**: Variabel atau fungsi dipanggil tanpa definisi awal (misal: `X_train`, `y_test` digunakan tanpa pemanggilan dataset atau inisialisasi).
- **`TypeError`**: Pemanggilan argumen fungsi yang tidak cocok dengan versi pustaka terkini.
- **`AttributeError`**: Pemanggilan method usang atau tidak ada pada objek.

### C. Dependensi yang Tidak Terpenuhi (`FAILS_DEPENDENCY`: 57 Blok)
Topik-topik lanjutan seperti `Deep Learning Architecture`, `Computer Vision`, dan `Reinforcement Learning` memiliki kode yang mengimpor pustaka berat:
- `import torch` (PyTorch) — 38 blok
- `import cv2` (OpenCV) — 14 blok
- `import tensorflow as tf` (TensorFlow) — 5 blok

Blok-blok kode ini gagal dijalankan pada lingkungan yang hanya menyediakan pustaka Scikit-Learn dan NumPy.

---

## 3. Sampel Representatif Temuan Eksekusi Kode

| Topic ID | Bab & Subbab | Kode ID | Status | Cuplikan Kode | Keluaran Aktual vs Expected |
|---|---|---|---|---|---|
| `machine-learning` | Bab 1, Subbab 1.1 | `machine-learning-ch1-sub1-code` | `OUTPUT_MISMATCH` | `print('Program dikatakan belajar jika kinerjanya...')` | Actual: Teks Tom Mitchell<br>Expected: `"Status eksekusi: Komputasi berhasil..."` |
| `machine-learning` | Bab 1, Subbab 1.2 | `machine-learning-ch1-sub2-code` | `OUTPUT_MISMATCH` | `paradigms = {'Supervised': ...}; print(paradigms)` | Actual: Kamus dict<br>Expected: `"Status eksekusi: Komputasi berhasil..."` |
| `deep-learning` | Bab 2, Subbab 2.1 | `deep-learning-ch2-sub1-code` | `FAILS_DEPENDENCY` | `import torch; x = torch.randn(10, 5)` | Error: `ModuleNotFoundError: No module named 'torch'` |
| `computer-vision` | Bab 1, Subbab 1.2 | `computer-vision-ch1-sub2-code` | `FAILS_DEPENDENCY` | `import cv2; img = cv2.imread('sample.jpg')` | Error: `ModuleNotFoundError: No module named 'cv2'` |
| `reinforcement-learning` | Bab 3, Subbab 3.4 | `reinforcement-learning-ch3-sub4-code` | `FAILS_RUNTIME` | `q_table[state, action] = ...` | Error: `NameError: name 'q_table' is not defined` |

---

## 4. Rekomendasi Perbaikan

1. **Rekam Output Aktual Secara Deterministik**:
   Seluruh field `expectedOutput` harus diperbarui dengan keluaran *stdout* sesungguhnya yang dihasilkan dari eksekusi Python nyata, bukan kalimat placeholder sintetis.
2. **Perbaiki Kode yang Gagal Runtime**:
   Pastikan setiap snippet bersifat *self-contained*: sertakan impor yang diperlukan dan inisialisasi data sampel mini (misal menggunakan `np.random.default_rng(42)`) sehingga dapat dijalankan tanpa dependensi variabel luar.
3. **Dokumentasikan Prasyarat Instalasi**:
   Untuk 57 modul yang memerlukan PyTorch atau OpenCV, tambahkan komentar instruksi instalasi di baris pertama kode (misal `# pip install torch` atau `# pip install opencv-python`).
