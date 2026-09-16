# VELQORA — BATCH 1 NEGATIVE TEST REPORT
**Status:** `PASS` (23 Test Cases Lolos Sempurna)  
**Test Suite:** `scripts/curriculum-generator/__tests__/negative-quality-gates.test.ts`  
**Runtime:** Node.js v20+ / Node Test Runner dengan `tsx`  
**Waktu Eksekusi:** 16 September 2026  

---

## 1. Tujuan Pengujian Negatif

Negative Quality Gates dirancang untuk menguji **ketahanan sistem validasi** dalam mendeteksi dan secara proaktif **menolak** materi kurikulum yang cacat, mengandung teks sintetis/boilerplate, mengandung data leakage, atau memuat klaim palsu sebelum dapat masuk ke lingkungan produksi.

---

## 2. Bukti Eksekusi Test Suite (Execution Log)

```text
node --import tsx --test scripts/curriculum-generator/__tests__/negative-quality-gates.test.ts

▶ Phase 2.3-B: Substantive Content Quality Guardrails
  ✔ Harus menolak template skeleton sintetis Phase 2.2 (7.8296ms)
  ✔ Harus menolak expectedOutput placeholder sintetis (11.0396ms)
  ✔ Harus menolak bab tanpa rangkuman dan tanpa jembatan transisi (1.5672ms)
✔ Phase 2.3-B: Substantive Content Quality Guardrails (45.2204ms)

▶ VELQORA NEGATIVE QUALITY GATES (TC-NEG-01 s/d TC-NEG-20)
  ✔ TC-NEG-01: Harus menolak unit dengan panjang teks di bawah ambang minimum (<100 kata) (65.1063ms)
  ✔ TC-NEG-02: Harus menolak pola template skeleton 'fondasi krusial untuk menjamin keandalan sistem' (2.0133ms)
  ✔ TC-NEG-03: Harus menolak pola generic purpose 'Pembahasan fokus mengenai [X] dalam konteks [Y]' (2.526ms)
  ✔ TC-NEG-04: Harus menolak expectedOutput placeholder sintetik Phase 2.2 (3.8409ms)
  ✔ TC-NEG-05: Harus menolak pola generic pipeline 'Inisialisasi Data: ... Eksekusi Komputasi: ...' (7.4369ms)
  ✔ TC-NEG-06: Harus menolak blok kode tanpa deklarasi dependensi eksplisit (4.1737ms)
  ✔ TC-NEG-07: Harus menolak isVerifiedOutput: false dengan format output palsu (2.2512ms)
  ✔ TC-NEG-08: Harus menolak bab tanpa rangkuman substantif (summary kosong atau < 80 karakter) (3.7332ms)
  ✔ TC-NEG-09: Harus menolak bab tanpa jembatan transisi kognitif menuju bab berikutnya (2.7911ms)
  ✔ TC-NEG-10: Harus menolak bab dengan jumlah subbab kurang dari 2 (1.4646ms)
  ✔ TC-NEG-11: Harus menolak referensi yang hanya berupa generic domain tanpa tautan kanonikal spesifik (1.2829ms)
  ✔ TC-NEG-12: Harus menolak referensi tanpa atribusi penulis akademik atau institusi (5.4275ms)
  ✔ TC-NEG-13: Harus menolak referensi tanpa penjelasan relevansi terhadap topik modul (2.1714ms)
  ✔ TC-NEG-14: Harus mendeteksi dan menolak skrip kode dengan syntax error fatal (1.2447ms)
  ✔ TC-NEG-15: Harus mendeteksi dan menolak data leakage (StandardScaler di-fit sebelum split) (0.9017ms)
  ✔ TC-NEG-16: Harus mendeteksi penggunaan simbol tanpa import yang didefinisikan (1.0619ms)
  ✔ TC-NEG-17: Harus menolak klaim expectedOutput yang berbeda dari keluaran aktual (1.1567ms)
  ✔ TC-NEG-18: Harus mendeteksi ketiadaan array evaluationQuestions eksplisit pada tingkat bab (1.2319ms)
  ✔ TC-NEG-19: Harus mendeteksi subbab yang tidak memiliki daftar latihan (exercises kosong) (1.3964ms)
  ✔ TC-NEG-20: Harus mendeteksi duplikasi ID atau slug pada registri bab (2.6015ms)
✔ VELQORA NEGATIVE QUALITY GATES (TC-NEG-01 s/d TC-NEG-20) (139.7177ms)

ℹ tests 23
ℹ suites 2
ℹ pass 23
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1834.5606
```

---

## 3. Rincian Penolakan Kategori Kritis

### 3.1 Penolakan Data Leakage (TC-NEG-15)
- **Kondisi Uji**: Kode melakukan pemanggilan `StandardScaler().fit(X)` sebelum `train_test_split()`.
- **Perilaku Validator**: Mendeteksi pola regex `(StandardScaler().fit|scaler.fit)` yang mendahului pemanggilan partisi.
- **Hasil**: Validator sukses menggagalkan kode dengan pesan eror: `Feature scaler di-fit sebelum train_test_split (Data Leakage terdeteksi)`.

### 3.2 Penolakan Expected Output Palsu / Sintetis (TC-NEG-04 & TC-NEG-17)
- **Kondisi Uji**: Kode mencantumkan teks generik seperti `"Output komputasi simulasi"` atau hasil kalkulasi yang sengaja diselisihkan dari nilai aktual.
- **Hasil**: Validator mendeteksi ketidaksesuaian string dan menolak klaim verifikasi (`isVerifiedOutput: false`).

### 3.3 Penolakan Template Repetition & Unit Terlalu Pendek (TC-NEG-01 & TC-NEG-02)
- **Kondisi Uji**: Teks unit dengan panjang < 100 kata atau mengandung frasa skeleton `"fondasi krusial untuk menjamin keandalan sistem"`.
- **Hasil**: Validasi langsung `FAIL` dan memblokir persistensi kurikulum.

---

## 4. Audit Terhadap Modul Batch 1 yang Telah Dimigrasikan

Skrip `scripts/curriculum-generator/verify-batch1-substantive.ts` dioperasikan secara langsung terhadap modul baru `deep-learning` dan `data-science`:

| Kriteria Negatif | `deep-learning` | `data-science` | Hasil Pengujian |
|---|:---:|:---:|:---:|
| Terdeteksi Placeholder / Teks Sintetis | 0 temuan | 0 temuan | `PASS` (Bebas) |
| Terdeteksi Frasa Template Skeleton | 0 temuan | 0 temuan | `PASS` (Bebas) |
| Terdeteksi Data Leakage pada Kode | Tidak Ada | Tidak Ada (Pipeline) | `PASS` (Bebas) |
| Terdeteksi Expected Output Palsu | Tidak Ada (PyTorch nyata) | Tidak Ada (Sklearn nyata) | `PASS` (Sesuai) |
| Unit Kurang dari Ambang Minimum | 2.383 kata (> 1500) | 2.765 kata (> 1500) | `PASS` (Substantif) |
| Bab Tanpa Summary & Transition | Seluruh bab lengkap | Seluruh bab lengkap | `PASS` (Lengkap) |
| Subbab Tanpa Latihan / Pitfalls | 6 latihan, 6 pitfalls | 6 latihan, 6 pitfalls | `PASS` (Lengkap) |

**Kesimpulan:** Seluruh kriteria negative testing lolos 100% tanpa kompromi.
