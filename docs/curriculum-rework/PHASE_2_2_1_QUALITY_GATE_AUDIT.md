# VELQORA — PHASE 2.2.1: AUDIT SUITE TEST & QUALITY GATE

> **Dokumen Deliverable**: `docs/curriculum-rework/PHASE_2_2_1_QUALITY_GATE_AUDIT.md`  
> **Status Audit**: COMPLETED (Analisis Forensic Rigor atas Seluruh Pengujian Kurikulum)  
> **Sasaran Audit**: `src/lib/curriculum/__tests__/all-28-topics.test.ts`, `scripts/validate-curriculum-content.ts`, `scripts/verify-curriculum-sources.ts`  
> **Tanggal Pelaksanaan**: 2026-09-16  

---

## 1. Ringkasan Diagnostik Sistem Pengujian

Penyelidikan independen terhadap automated quality gate Velqora Phase 2.2 menunjukkan bahwa seluruh rangkaian pengujian yang sebelumnya menghasilkan status **"PASS (100%)"** menderita fenomena **Shallow Assertion / Structural Bias**:
- Pengujian hanya memeriksa keberadaan properti (*field existence*), panjang array minimum (*array length count*), dan nilai boolean statis.
- Pengujian sama sekali tidak memvalidasi semantik isi, keunikan narasi, eksekusi kode riil, relevansi sitasi, atau pengalaman antarmuka pengguna.

---

## 2. Matriks Pengujian: Apa yang Diuji vs Apa yang Terlewat

| Berkas Pengujian / Skrip | Apa yang Sebenarnya Diuji | Apa yang TIDAK Diuji | Risiko False Positive | Bukti / Mekanisme Kegagalan Deteksi |
|---|---|---|---|---|
| **`all-28-topics.test.ts`**<br>(Test 1: Jumlah Topik) | `ALL_ACADEMIC_CURRICULA.length === 28` | Kualitas isi, bobot materi, dan diferensiasi antar topik. | **TINGGI** | 28 topik kosong pun akan lulus asalkan array memiliki 28 elemen. |
| **`all-28-topics.test.ts`**<br>(Test 2: Keunikan ID & Slug) | Keunikan ID dan Slug di level topik. | Duplikasi judul bab, subbab, unit, dan konten markdown. | **SEDANG** | Meloloskan 40.500 unit yang menggunakan teks template yang sama persis. |
| **`all-28-topics.test.ts`**<br>(Test 3: Referensi Akademik) | `primaryReferences.length >= 1`, format regex URL `^https?://`, dan string penulis tidak kosong. | Keaktifan URL, relevansi konten terhadap topik, kedalaman dokumen (bukan homepage umum), status paywall. | **EKSTREM** | Meloloskan 1 URL homepage yang diulang 716 kali sebagai rujukan akademik valid. |
| **`all-28-topics.test.ts`**<br>(Test 4: Struktur Bab & Subbab)| `chapters.length >= 4`, `subchapters.length >= 1`, dan `content_markdown.length > 100`. | Kualitas pedagogis, kedalaman akademik, dan orisinalitas kalimat. | **EKSTREM** | String teks template 101 karakter berisi omong kosong otomatis dinyatakan LULUS (PASS). |
| **`all-28-topics.test.ts`**<br>(Test 5: KaTeX Formula) | `fullMarkdown.includes("$")` atau `fullMarkdown.includes("$$")`. | Validitas sintaks KaTeX, kebenaran matematika, dan kesesuaian formula dengan algoritma. | **TINGGI** | Simbol dollar harga seperti `$50` atau satu rumus tunggal meloloskan seluruh topik. |
| **`all-28-topics.test.ts`**<br>(Test 6-7: Routing & Lookup) | Resolusi ID topik dari query string alias. | Rendering halaman, layout responsif, dan persistensi URL. | **RENDAH** | Logika pemetaan alias bekerja dengan benar. |
| **`all-28-topics.test.ts`**<br>(Test 8: Converter Helper) | Integritas transformasi objek ke `DocSectionItem[]`. | Apakah UI reader benar-benar merender Level 3 sub-subbab. | **TINGGI** | Mengabaikan kenyataan bahwa UI memotong level 3 sub-subbab dari DOM. |
| **`validate-curriculum-content.ts`** | String literal: `"lorem ipsum"`, `"coming soon"`, `"TODO:"`, `"akan ditambahkan kemudian"`. | Repetisi kerangka template (*boilerplate skeleton*), konten dangkal < 50 kata, dan eksekusi kode. | **EKSTREM** | Melaporkan "0 Placeholder Ditemukan" padahal 40.500 unit berisi template berulang. |
| **`verify-curriculum-sources.ts`** | Pengecekan statis: `if (ref.verified === true) verifiedCount++`. | Aksesibilitas live HTTP, relevansi kontekstual, keunikan URL (hanya 47 URL unik dari 4.151 sitasi). | **EKSTREM** | Melaporkan "4.151 Sumber Terverifikasi (100%)" murni karena membaca field boolean statis generator. |

---

## 3. Rekomendasi Penguatan Quality Gate Menuju Standar Institusional

Untuk mencegah laporan kelulusan semu di masa depan, suite pengujian wajib direkayasa ulang dengan menyertakan gerbang kualitas aktif:

1. **Assertion Kedalaman Konten Semantik**:
   Gantikan `content_markdown.length > 100` dengan pengecekan statistik:
   - Jumlah kata minimum ($\ge 300$ kata per subbab).
   - Ambang batas keunikan Levenshtein/Jaccard ($\le 30\%$ kemiripan n-gram dengan subbab lain).
2. **Uji Eksekusi Kode Mandiri (*Automated Code Runner*)**:
   Uji seluruh blok kode Python melalui runner otomatis dalam proses pengujian CI/CD: jika ada kode yang melempar eksepsi runtime atau tidak sesuai output, build wajib **GAGAL (FAIL)**.
3. **Audit Otentisitas Referensi**:
   Uji bahwa rasio URL unik terhadap total sitasi berada pada batas wajar ($\ge 50\%$ URL unik), serta melarang penautan URL homepage/root dokumen sebagai pengganti spesifikasi API teknis.
4. **End-to-End Visual / DOM Assertion**:
   Uji menggunakan browser subagent / Playwright bahwa setiap unit yang terdaftar di JSON benar-benar muncul di elemen `<nav>` dan `<article>` antarmuka pengguna web.
