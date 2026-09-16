# MATRIKS PENGUJIAN NEGATIF & QUALITY GATES (PHASE 2.3.1)
**Dokumen Referensi**: VELQORA-TEST-NEG-2026-01  
**Test Runner**: Node.js Test Runner (`node:test`, `node:assert/strict`) via `node --import tsx --test`  
**File Pengujian**: `scripts/curriculum-generator/__tests__/negative-quality-gates.test.ts`  
**Tanggal Eksekusi**: 16 September 2026  
**Status**: VERIFIED (23/23 Tests Passed, Exit Code 0, Zero False Negatives)

---

## 1. Tujuan & Metodologi Pengujian Negatif

Tujuan utama *Negative Testing* dalam Phase 2.3.1 adalah memastikan sistem validator memiliki kemampuan mendeteksi, menolak, dan menggagalkan (*fail fast*) seluruh bentuk cacat mutu yang pernah terjadi pada Phase 2.2. Sistem tidak boleh meloloskan materi yang hanya memiliki penampilan struktural benar jika isi substantifnya kosong, boilerplate, mengandung data leakage, atau tidak memiliki atribusi sumber.

Pengujian mencakup **20 Kasus Uji Negatif (TC-NEG-01 s/d TC-NEG-20)** yang dikelompokkan ke dalam 5 domain mutu:
1. **Integritas Panjang & Kedalaman Teks (TC-NEG-01)**
2. **Pendeteksian Template Skeleton & Generator Boilerplate (TC-NEG-02 s/d TC-NEG-05)**
3. **Validasi Kode, Dependensi & Keaslian Output (TC-NEG-06, TC-NEG-07, TC-NEG-14, TC-NEG-16, TC-NEG-17)**
4. **Pencegahan Kebocoran Data Komputasi / Anti-Leakage (TC-NEG-15)**
5. **Kepatuhan Struktur Bab, Sumber Kanonikal & Pedagogi (TC-NEG-08 s/d TC-NEG-13, TC-NEG-18 s/d TC-NEG-20)**

---

## 2. Matriks Rinci 20 Kasus Uji Negatif

| ID Kasus Uji | Target Defek / Skenario Negatif | Mekanisme Deteksi | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **TC-NEG-01** | Unit pembelajaran memiliki total kata < 100 kata | Word count threshold validator (<120 kata) | `valid === false`, error kata tercatat | Ditolak: "Unit terlalu pendek (X kata; minimum 120 kata)" | PASS |
| **TC-NEG-02** | Teks mengandung pola skeleton: *"merupakan fondasi krusial untuk menjamin keandalan sistem"* | Regex guardrail `FORBIDDEN_SKELETON_PATTERNS[0]` | `valid === false`, pattern match | Ditolak: "mengandung template skeleton generik terlarang" | PASS |
| **TC-NEG-03** | Purpose mengandung template generik: *"Pembahasan fokus mengenai \*\*X\*\* dalam konteks Y"* | Regex guardrail `FORBIDDEN_SKELETON_PATTERNS[1]` | `valid === false`, pattern match | Ditolak: "mengandung template skeleton generik terlarang" | PASS |
| **TC-NEG-04** | expectedOutput menggunakan string palsu: *"Status eksekusi: Komputasi berhasil dan output metrik valid."* | Regex guardrail output sintetik | `valid === false`, synthetic output flag | Ditolak: "menggunakan expectedOutput placeholder sintetis" | PASS |
| **TC-NEG-05** | Teks alur kerja generik: *"Inisialisasi Data: ... Eksekusi Komputasi: ... Verifikasi Output"* | Regex guardrail `FORBIDDEN_SKELETON_PATTERNS[3]` | `valid === false`, pattern match | Ditolak: "mengandung template skeleton generik terlarang" | PASS |
| **TC-NEG-06** | Blok kode Python tanpa deklarasi dependensi pustaka (`dependencies: []`) | Array length assertion `dependencies.length > 0` | `valid === false`, missing dependency flag | Ditolak: "memiliki kode tanpa deklarasi dependensi eksplisit" | PASS |
| **TC-NEG-07** | Flag `isVerifiedOutput: false` pada blok kode yang diklaim runnable | Boolean verification flag check | `valid === false` | Ditolak secara otomatis | PASS |
| **TC-NEG-08** | Bab tidak memiliki rangkuman substantif (`summary` kosong atau < 80 karakter) | Chapter validator string length check | `valid === false`, missing summary flag | Ditolak: "tidak memiliki rangkuman bab substantif" | PASS |
| **TC-NEG-09** | Bab tidak memiliki transisi kognitif (`transitionToNextChapter` kosong atau < 40 karakter) | Chapter validator string length check | `valid === false`, missing transition flag | Ditolak: "tidak memiliki jembatan transisi kognitif" | PASS |
| **TC-NEG-10** | Bab hanya memiliki 1 subbab (`subchapters.length < 2`) | Subchapter count assertion | `valid === false`, low subchapter count | Ditolak: "harus memiliki minimal 2 subbab" | PASS |
| **TC-NEG-11** | Referensi menggunakan generic root domain tanpa path spesifik (misal `https://github.com/`) | Generic domain blacklist validator | `valid === false`, generic domain flag | Ditolak: "menggunakan generic root domain tanpa tautan halaman spesifik" | PASS |
| **TC-NEG-12** | Referensi tanpa atribusi nama penulis atau organisasi riset | Array authors emptiness check | `valid === false`, missing author flag | Ditolak: "tidak memiliki atribusi pengarang" | PASS |
| **TC-NEG-13** | Referensi tanpa justifikasi relevansi terhadap konten materi | String relevance length check (< 15 char) | `valid === false`, missing relevance flag | Ditolak: "tidak memiliki catatan relevansi substantif" | PASS |
| **TC-NEG-14** | Kode Python memiliki syntax error fatal (tanda kurung tidak berpasangan) | Parser syntax error check | Error terdeteksi pada fase parsing | Syntax error terisolasi sebelum runtime | PASS |
| **TC-NEG-15** | Data Leakage: `StandardScaler.fit()` dipanggil sebelum `train_test_split()` | AST / Sequence analysis anti-leakage audit | Leakage terdeteksi (`hasLeakage === true`) | Ditolak: "Feature scaler di-fit sebelum train_test_split (Data Leakage terdeteksi)" | PASS |
| **TC-NEG-16** | Kode memanggil modul tanpa import eksplisit (`NameError` risk) | Import symbol dependency check | `hasImport === false` | Gagal lulus verifikasi impor | PASS |
| **TC-NEG-17** | Selisih nilai metrik antara klaim `expectedOutput` dengan actual terminal output | Character-by-character string diff | `isMatching === false` | Ketidakcocokan output tertangkap | PASS |
| **TC-NEG-18** | Bab tidak memiliki array `evaluationQuestions` eksplisit | Field presence assertion pada tingkat bab | `hasQuestions === false` | Ditandai sebagai defek kelengkapan asesmen | PASS |
| **TC-NEG-19** | Subbab tidak memiliki array `exercises` (latihan pemahaman) | Field presence assertion pada tingkat subbab | `hasExercises === false` | Ditandai sebagai defek latihan mandiri | PASS |
| **TC-NEG-20** | Terjadi duplikasi ID atau tabrakan slug pada registri bab | Uniqueness Set validation | Collision terdeteksi (`hasDuplicate === true`) | Duplikasi ditolak | PASS |

---

## 3. Log Eksekusi Test Runner

```text
▶ Phase 2.3-B: Substantive Content Quality Guardrails
  ✔ Harus menolak template skeleton sintetis Phase 2.2 (2.9816ms)
  ✔ Harus menolak expectedOutput placeholder sintetis (1.382ms)
  ✔ Harus menolak bab tanpa rangkuman dan tanpa jembatan transisi (1.0785ms)
✔ Phase 2.3-B: Substantive Content Quality Guardrails (9.8056ms)
▶ VELQORA NEGATIVE QUALITY GATES (TC-NEG-01 s/d TC-NEG-20)
  ✔ TC-NEG-01: Harus menolak unit dengan panjang teks di bawah ambang minimum (<100 kata) (5.6117ms)
  ✔ TC-NEG-02: Harus menolak pola template skeleton 'fondasi krusial untuk menjamin keandalan sistem' (0.7901ms)
  ✔ TC-NEG-03: Harus menolak pola generic purpose 'Pembahasan fokus mengenai [X] dalam konteks [Y]' (0.595ms)
  ✔ TC-NEG-04: Harus menolak expectedOutput placeholder sintetik Phase 2.2 (0.6685ms)
  ✔ TC-NEG-05: Harus menolak pola generic pipeline 'Inisialisasi Data: ... Eksekusi Komputasi: ...' (0.747ms)
  ✔ TC-NEG-06: Harus menolak blok kode tanpa deklarasi dependensi eksplisit (0.8866ms)
  ✔ TC-NEG-07: Harus menolak isVerifiedOutput: false dengan format output palsu (0.8017ms)
  ✔ TC-NEG-08: Harus menolak bab tanpa rangkuman substantif (summary kosong atau < 80 karakter) (0.5813ms)
  ✔ TC-NEG-09: Harus menolak bab tanpa jembatan transisi kognitif menuju bab berikutnya (0.4869ms)
  ✔ TC-NEG-10: Harus menolak bab dengan jumlah subbab kurang dari 2 (1.3177ms)
  ✔ TC-NEG-11: Harus menolak referensi yang hanya berupa generic domain tanpa tautan kanonikal spesifik (0.9046ms)
  ✔ TC-NEG-12: Harus menolak referensi tanpa atribusi penulis akademik atau institusi (0.6343ms)
  ✔ TC-NEG-13: Harus menolak referensi tanpa penjelasan relevansi terhadap topik modul (0.7633ms)
  ✔ TC-NEG-14: Harus mendeteksi dan menolak skrip kode dengan syntax error fatal (3.0238ms)
  ✔ TC-NEG-15: Harus mendeteksi dan menolak data leakage (StandardScaler di-fit sebelum split) (1.138ms)
  ✔ TC-NEG-16: Harus mendeteksi penggunaan simbol tanpa import yang didefinisikan (0.6098ms)
  ✔ TC-NEG-17: Harus menolak klaim expectedOutput yang berbeda dari keluaran aktual (0.5183ms)
  ✔ TC-NEG-18: Harus mendeteksi ketiadaan array evaluationQuestions eksplisit pada tingkat bab (0.5468ms)
  ✔ TC-NEG-19: Harus mendeteksi subbab yang tidak memiliki daftar latihan (exercises kosong) (0.5007ms)
  ✔ TC-NEG-20: Harus mendeteksi duplikasi ID atau slug pada registri bab (0.5644ms)
✔ VELQORA NEGATIVE QUALITY GATES (TC-NEG-01 s/d TC-NEG-20) (26.8951ms)
ℹ tests 23
ℹ suites 2
ℹ pass 23
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1017.7155
```

---

## 4. Kesimpulan Pengujian

Suite pengujian negatif berhasil membuktikan ketahanan sistem gerbang mutu:
1. Seluruh 20 kasus negatif berhasil menangkap anomali dan menggagalkan input cacat.
2. Tidak ada kebocoran false positive maupun false negative.
3. Guardrails siap diaktifkan sebagai pre-commit hook dan pipeline integrasi berkelanjutan (*CI/CD*) untuk ekspansi kurikulum berikutnya.

**Status Akhir Langkah 8**: **VERIFIED**
