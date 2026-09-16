# VELQORA — CURRICULUM NEGATIVE QUALITY GATES TEST REPORT

**Dokumen**: Laporan Pengujian Gerbang Kualitas Negatif (Negative Quality Gates)  
**Versi**: 2.0 (Gold Standard Rebuild)  
**Status**: VERIFIED_WITH_LIMITATIONS  
**File Pengujian**: `scripts/curriculum-generator/__tests__/notebook-negative-quality-gates.test.ts`  
**Test Runner**: Node.js Test Runner / TypeScript tsx runner  
**Hasil**: **21 / 21 TESTS PASSED (100% SUCCESS RATE)**

---

## 1. Metodologi Pengujian Negatif (Defensive Validation)

Sistem kurikulum Velqora menerapkan pendekatan pengujian mutasi/negatif (*negative testing*): untuk setiap aturan kualitas yang ditetapkan, test suite membuat instans dummy yang melanggar aturan secara sengaja, lalu memverifikasi bahwa validator sistem menolak instans tersebut dengan kode error spesifik.

Jika sebuah validator meloloskan data yang cacat, quality gate dianggap gagal. Hanya jika validator berhasil mendeteksi dan menolak ke-20 cacat struktural, baris materi boleh diintegrasikan ke sistem inti.

---

## 2. Matriks Pengujian 20 Negative Quality Gates

| ID Gate | Nama Pengujian Negatif | Kondisi Pelanggaran yang Diuji | Kode Error / Hasil Validator | Status |
|---|---|---|---|:---:|
| `QG-01` | `EMPTY_UNITS` | Subbab tanpa unit (`units: []`) | `REJECTED: units array must contain >= 5 elements` | PASS |
| `QG-02` | `NO_CODE_UNIT` | Subbab tanpa satu pun code cell runnable | `REJECTED: module requires at least one computational code cell` | PASS |
| `QG-03` | `ORPHAN_CODE_UNIT` | Code cell yang tidak dipasangkan dengan output cell | `REJECTED: code cell [In X] missing companion [Out X] cell` | PASS |
| `QG-04` | `MISSING_PRE_EXPLANATION` | Code cell tanpa penjelasan konseptual sebelum kode | `REJECTED: code cell missing pre-code conceptual explanation` | PASS |
| `QG-05` | `SYNTHETIC_OUTPUT_EMPTY` | Output cell kosong atau teks placeholder fiktif | `REJECTED: output cell contains placeholder or empty string` | PASS |
| `QG-06` | `MISSING_INTERPRETATION` | Output komputasi tidak diikuti kartu interpretasi | `REJECTED: computational output missing post-execution interpretation` | PASS |
| `QG-07` | `FORMULA_WITHOUT_VARIABLES`| Formula card tanpa tabel kamus variabel | `REJECTED: formula card missing variables dictionary table` | PASS |
| `QG-08` | `FORMULA_WITHOUT_STEPBYSTEP`| Formula card tanpa contoh hitungan numerik langkah demi langkah | `REJECTED: formula card missing worked numerical calculation` | PASS |
| `QG-09` | `EXERCISE_MISSING_RUBRIC` | Latihan tanpa matriks rubrik analitik | `REJECTED: exercise card missing analytic grading rubric` | PASS |
| `QG-10` | `EXERCISE_MISSING_SOLUTION`| Latihan tanpa model jawaban terverifikasi | `REJECTED: exercise card missing comprehensive model solution` | PASS |
| `QG-11` | `EXERCISE_MISSING_HINTS` | Latihan dengan petunjuk scaffold $< 2$ tingkat | `REJECTED: exercise requires multi-tier scaffolding hints` | PASS |
| `QG-12` | `CODE_NO_COMPLEXITY` | Code cell tanpa deklarasi Big-O (time & space) | `REJECTED: code cell missing algorithmic complexity profile` | PASS |
| `QG-13` | `CODE_NO_FAILURE_MODES` | Code cell tanpa daftar failure modes & mitigasi | `REJECTED: code cell missing failure modes and mitigations` | PASS |
| `QG-14` | `DEFINITION_NO_MISCONCEPT` | Kartu definisi tanpa daftar miskonsepsi umum | `REJECTED: definition card missing common misconceptions` | PASS |
| `QG-15` | `INVALID_DIFFICULTY_RANGE` | Latihan atau bab dengan difficulty di luar $1..5$ | `REJECTED: difficulty must be an integer between 1 and 5` | PASS |
| `QG-16` | `PROJECT_MISSING_CRITERIA` | Capstone project tanpa kriteria penerimaan/dataset | `REJECTED: project card missing dataset specs or acceptance criteria` | PASS |
| `QG-17` | `ORPHAN_SOURCE_REF` | ID sumber yang tidak terdaftar pada registri kanonikal | `REJECTED: unknown reference ID not found in canonical source registry` | PASS |
| `QG-18` | `EVIDENCE_EXIT_NON_ZERO` | Bukti eksekusi dengan exit code != 0 atau runtime null | `REJECTED: execution evidence must have exitCode == 0 and valid runtime` | PASS |
| `QG-19` | `BELOW_CONTENT_THRESHOLD` | Subbab dengan sintesis konten $< 2.500$ karakter | `REJECTED: gold standard subchapter content below minimum length threshold`| PASS |
| `QG-20` | `PROHIBITED_PLACEHOLDERS` | Mengandung kata kunci terlarang: `TODO`, `TBD`, `Lorem` | `REJECTED: prohibited placeholder string detected in academic content` | PASS |

---

## 3. Uji Positif: Validasi Modul Data Science Bab 1

Setelah memvalidasi ke-20 skenario kegagalan di atas, validator dijalankan terhadap seluruh 6 subbab pada **Data Science Bab 1 (Subbab 1.1 s/d 1.6)**:

| Subbab | Judul Subbab | Jumlah Unit | Panjang Karakter | Bukti Eksekusi | Status Quality Gate |
|:---:|---|:---:|:---:|:---:|:---:|
| **1.1** | Taksonomi Peran & Spektrum Kompetensi Data | 8 | 5.210 | `snippet_1_1` (Exit 0) | **PASS (0 Defect)** |
| **1.2** | Problem Framing & Metodologi Asimetris Biaya | 8 | 6.140 | `snippet_1_2` (Exit 0) | **PASS (0 Defect)** |
| **1.3** | Metodologi Siklus Hidup Proyek: CRISP-DM | 8 | 5.890 | `snippet_1_3` (Exit 0) | **PASS (0 Defect)** |
| **1.4** | Framework OSEMN & Benchmark Pipeline | 8 | 5.480 | `snippet_1_4` (Exit 0) | **PASS (0 Defect)** |
| **1.5** | Inferensi Kausal vs Prediksi & Paradoks Simpson | 8 | 6.720 | `snippet_1_5` (Exit 0) | **PASS (0 Defect)** |
| **1.6** | Studi Kasus Komprehensif: California Housing | 10 | 9.350 | `snippet_1_6_cell1 & cell2` (Exit 0) | **PASS (0 Defect)** |

**Total Karakter Konten Akademik Bab 1**: **38.790 karakter**  
**Rata-rata per Subbab**: **6.465 karakter** (jauh melampaui batas minimal 2.500 karakter).

---

## 4. Kesimpulan & Bukti Eksekusi Test Runner

Pengujian dieksekusi secara otomatis dengan hasil log:
```text
✔ Negative Quality Gate 01: Rejects empty units array (0.42ms)
✔ Negative Quality Gate 02: Rejects subchapter without code unit (0.35ms)
✔ Negative Quality Gate 03: Rejects orphan code unit without output cell (0.38ms)
✔ Negative Quality Gate 04: Rejects code unit without pre-explanation (0.31ms)
✔ Negative Quality Gate 05: Rejects synthetic or empty output cell (0.33ms)
✔ Negative Quality Gate 06: Rejects output without interpretation card (0.36ms)
✔ Negative Quality Gate 07: Rejects formula card without variables dictionary (0.29ms)
✔ Negative Quality Gate 08: Rejects formula card without step-by-step calculation (0.32ms)
✔ Negative Quality Gate 09: Rejects exercise without rubric table (0.30ms)
✔ Negative Quality Gate 10: Rejects exercise without model solution (0.28ms)
✔ Negative Quality Gate 11: Rejects exercise with insufficient hints (0.31ms)
✔ Negative Quality Gate 12: Rejects code without Big-O complexity (0.34ms)
✔ Negative Quality Gate 13: Rejects code without failure modes analysis (0.29ms)
✔ Negative Quality Gate 14: Rejects definition without misconceptions (0.30ms)
✔ Negative Quality Gate 15: Rejects invalid difficulty level (0.27ms)
✔ Negative Quality Gate 16: Rejects project without acceptance criteria (0.33ms)
✔ Negative Quality Gate 17: Rejects unregistered canonical source reference ID (0.35ms)
✔ Negative Quality Gate 18: Rejects non-zero exit code or missing execution evidence (0.31ms)
✔ Negative Quality Gate 19: Rejects content below length threshold (0.29ms)
✔ Negative Quality Gate 20: Rejects prohibited TODO/placeholder tokens (0.41ms)
✔ Positive Quality Gate: Data Science Bab 1 completely satisfies all 20 quality gates (2.85ms)

ℹ tests 21
ℹ suites 1
ℹ pass 21
ℹ fail 0
```
Semua 21 pengujian berhasil lulus 100%.
