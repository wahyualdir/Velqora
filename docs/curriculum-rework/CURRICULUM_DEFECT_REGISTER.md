# VELQORA — REBUILD DEFECT REGISTER & REMEDIATION LOG

**Dokumen**: Registri Defek & Log Remediasi Rekonstruksi Notebook  
**Versi**: 2.0 (Gold Standard Rebuild)  
**Status**: VERIFIED & RESOLVED  
**Modul Target**: `src/lib/curriculum/`, `src/components/modul/notebook/`, `scripts/curriculum-generator/`  

---

## 1. Ringkasan Status Defek

| Kategori Keparahan (Severity) | Jumlah Ditemukan | Status Teratasi (Resolved) | Sisa Defek Terbuka (Open) |
|---|:---:|:---:|:---:|
| **Critical (Blocker)** | 2 | 2 | 0 |
| **High (Major Quality)** | 4 | 4 | 0 |
| **Medium (Edge Case / Schema)** | 3 | 3 | 0 |
| **Low (Cosmetic / Typo)** | 2 | 2 | 0 |
| **Total** | **11** | **11 (100%)** | **0** |

---

## 2. Rincian Defek & Tindakan Remediasi

### DEF-01 [CRITICAL]: Subbab Model Lama Kehilangan Tipe Data Saat Dibaca Reader Notebook
- **Deskripsi**: Ketika reader beralih ke `units: NotebookUnit[]`, subbab legacy dari 26 topik lain yang hanya memiliki `content_markdown` memicu error *undefined property reading 'length'* pada fungsi render.
- **Akar Masalah**: Fungsi converter `curriculumToDocSectionItems` mengasumsikan setiap subbab memiliki array `units`.
- **Tindakan Remediasi**: Mengimplementasikan dual-mode adapter di `src/lib/curriculum/types.ts` dan `doc-reader-layout.tsx`. Jika `subchapter.units` tidak terdefinisi atau kosong, sistem fallback otomatis mengekstrak `subchapter.content_markdown`.
- **Status**: `RESOLVED & TESTED`

### DEF-02 [CRITICAL]: Floating Point Non-Determinism pada Validasi Output Terminal Python
- **Deskripsi**: Nilai MSE analitis pada Python 3.12 AMD64 menghasilkan `1.2588102` sedangkan string output yang dicocokkan memiliki pembulatan `1.2588`. Script runner menganggap output tidak cocok (*mismatch*).
- **Akar Masalah**: Exact string equality pada floating point output tanpa tokenisasi numerik toleran epsilon.
- **Tindakan Remediasi**: Script runner Python `validate-notebook-code.py` diperbarui dengan normalisasi whitespace dan perbandingan numerik toleran ($\epsilon = 10^{-4}$) untuk token angka desimal.
- **Status**: `RESOLVED & VERIFIED`

### DEF-03 [HIGH]: Simbol KaTeX Terbentur Karakter Escape pada String TypeScript
- **Deskripsi**: Rumus KaTeX dengan backslash ganda (`\\mathbb{E}`, `\\mathcal{L}`) pada beberapa editor ter-unescape menjadi karakter kontrol literal sehingga KaTeX gagal me-render di sisi klien.
- **Akar Masalah**: Pola escaping string template literal yang tidak konsisten.
- **Tindakan Remediasi**: Menstandarisasi seluruh string LaTeX di unit `formula` menggunakan raw string literal yang lolos validasi regex KaTeX parser.
- **Status**: `RESOLVED & TESTED`

### DEF-04 [HIGH]: Missing Variable Dictionary pada Formula Matematis
- **Deskripsi**: Formula matematika di modul lama tidak menyertakan daftar definisi simbol dan domain variabel, melanggar standar pedagogis universitas.
- **Akar Masalah**: Format lama berupa string markdown murni `$$...$$` tanpa struktur metadata kamus variabel.
- **Tindakan Remediasi**: Menetapkan skema `variables: Array<{ symbol, meaning, domain }>` wajib pada tipe `NotebookFormulaUnit` dan divalidasi oleh Negative Quality Gate (TC-NEG-01).
- **Status**: `RESOLVED`

### DEF-05 [HIGH]: Accordion Solusi Latihan Bocor (Spoiler) Sebelum Mahasiswa Berpikir
- **Deskripsi**: Pada rancangan awal reader, kunci jawaban latihan Level 1–5 langsung ditampilkan di bawah instruksi.
- **Akar Masalah**: Ketiadaan mekanisme scaffolding penahan jawaban (*spoiler prevention*).
- **Tindakan Remediasi**: Membangun komponen `NotebookExerciseCard` dengan tombol accordion interaktif: Petunjuk (*Hints*) dan Solusi Model disembunyikan secara default, lengkap dengan rubrik penilaian bertingkat.
- **Status**: `RESOLVED`

### DEF-06 [HIGH]: Runtime Metadata Tidak Konsisten pada Output Komputasi
- **Deskripsi**: Beberapa sel output tidak mencantumkan versi library dan durasi eksekusi, merusak prinsip *Provenance Accountability*.
- **Akar Masalah**: Desain sel output lama hanya berupa teks blok statis.
- **Tindakan Remediasi**: Menghubungkan setiap unit kode dan output melalui relasi `evidenceId` dan `connectedCodeId` yang divalidasi oleh `ds_ch1_execution_evidence.json` (mencatat versi Python 3.12, numpy 2.5.3, pandas 3.0.5, scikit-learn 1.9.1, exitCode 0).
- **Status**: `RESOLVED`

### DEF-07 [MEDIUM]: Button Copy Code Mengalami Clipboard Permission Rejection
- **Deskripsi**: Di lingkungan browser tertentu atau iframe tanpa permission, pemanggilan `navigator.clipboard.writeText` melempar error unhandled rejection.
- **Akar Masalah**: Tidak ada fallback copy mechanism menggunakan `document.execCommand('copy')`.
- **Tindakan Remediasi**: Menambahkan try-catch block dengan graceful fallback pada `notebook-code-cell.tsx` dan indikator status visual "Tersalin" selama 2 detik.
- **Status**: `RESOLVED`

### DEF-08 [MEDIUM]: Responsivitas Sel Kode pada Layar Ponsel (< 375px)
- **Deskripsi**: Gutter nomor baris dan kode horizontal menyebabkan layout break pada layar smartphone kecil.
- **Akar Masalah**: Kurangnya deklarasi `overflow-x-auto` pada container kode monospace.
- **Tindakan Remediasi**: Menata ulang styling responsive pada `notebook-code-cell.tsx` dan `notebook-output-cell.tsx` dengan `overflow-x-auto` dan padding fleksibel.
- **Status**: `RESOLVED`

### DEF-09 [MEDIUM]: Ketiadaan Penanda Skala Kompleksitas Big-O pada Sel Kode
- **Deskripsi**: Kode komputasi ilmiah belum menyertakan estimasi Time dan Space Complexity untuk pemahaman efisiensi algoritma.
- **Akar Masalah**: Tipe kode belum memiliki field `complexity`.
- **Tindakan Remediasi**: Menambahkan badge kompleksitas waktu dan memori opsional di header `NotebookCodeCell` untuk algoritma linier algebra dan iterasi data.
- **Status**: `RESOLVED`

### DEF-10 [LOW]: Typo pada Istilah Latin "Ceteris Paribus"
- **Deskripsi**: Penulisan "caeteris paribus" pada penjelasan Simpson's Paradox di subbab 1.5.
- **Akar Masalah**: Variasi ejaan lama.
- **Tindakan Remediasi**: Mengoreksi menjadi standar ortografi modern "ceteris paribus".
- **Status**: `RESOLVED`

### DEF-11 [LOW]: Warna Monospace Kontras Rendah pada Mode Terang
- **Deskripsi**: Teks output terminal pada mode terang menggunakan warna abu-abu yang kurang kontras dengan background putih.
- **Akar Masalah**: Token warna `text-zinc-600` terlalu pudar.
- **Tindakan Remediasi**: Mengubah token warna menjadi `text-zinc-900 dark:text-zinc-200` dengan kontras rasio > 7:1 (WCAG AAA).
- **Status**: `RESOLVED`

---

## 3. Kesimpulan Audit Defek
Semua 11 defek yang terdeteksi telah berhasil diremediasi, diverifikasi melalui unit test otomatis, typecheck TypeScript, dan audit visual reader. Tidak ada defek berstatus `OPEN` yang menghalangi fase perilisan modul acuan baku.
