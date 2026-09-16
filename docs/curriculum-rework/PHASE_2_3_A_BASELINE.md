# VELQORA — PHASE 2.3-A: FREEZE, SNAPSHOT & BASELINE AUDIT

> **Dokumen Deliverable**: `docs/curriculum-rework/PHASE_2_3_A_BASELINE.md`  
> **Status**: COMPLETED & BASELINE LOCKED  
> **Git Snapshot Tag**: `phase-2.3-baseline` (pada commit `f9c000a`)  
> **Branch Aktif**: `main` (sinkron dengan `origin/main`)  
> **Tanggal Pelaksanaan**: 2026-09-16  

---

## 1. Verifikasi Lingkungan & Baseline Git

Pemeriksaan status repositori sebelum memulai Phase 2.3:

```text
$ git remote -v
origin	https://github.com/wahyualdir/Velqora.git (fetch)
origin	https://github.com/wahyualdir/Velqora.git (push)

$ git branch --show-current
main

$ git status
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean

$ git log -1 --oneline
f9c000a feat(audit): complete Phase 2.2.1 independent evidence audit across all 8 dimensions
```

Git tag baseline telah dibuat:
- **Tag Name**: `phase-2.3-baseline`
- **Target Commit**: `f9c000a`
- **Tujuan**: Titik pemulihan (*recovery rollback point*) instan jika terjadi regresi tak terduga selama remediasi.

---

## 2. Kondisi Awal Berdasarkan Audit Phase 2.2.1

Berdasarkan audit independen pada Phase 2.2.1, status kurikulum saat ini adalah **`FAILED_VALIDATION`** dengan rincian baseline:

1. **Struktur**: 28 topik, 405 bab, 4.050 subbab, 40.500 unit sub-subbab terdaftar di AST TypeScript.
2. **Keunikan Konten**:
   - 40.500 unit sub-subbab (100%) terkonfirmasi sebagai *template repetition* (skeleton 25 kata).
   - 4.050 subbab (100%) menggunakan struktur paragraf cetakan sintetis yang sama.
   - 1.610 blok kode (39.75%) berupa pernyataan *print* sepele (*trivial print statements*).
3. **Integritas Rujukan**:
   - 4.151 objek sitasi hanya berasal dari **47 URL unik**.
   - 1.999 sitasi (48.16%) hanya mengarah ke homepage beranda dokumentasi (*root docs*).
   - 151 sitasi berada di balik *paywall* komersial tanpa alternatif terbuka.
4. **Validitas Eksekusi Kode**:
   - 3.716 blok kode (91.75%) memiliki `expectedOutput` sintetis yang tidak cocok dengan output Python nyata (*OUTPUT_MISMATCH*).
   - 251 blok kode melempar galat runtime (*FAILS_RUNTIME*: `NameError`, `TypeError`).
   - 57 blok kode gagal karena pustaka belum terpasang (*FAILS_DEPENDENCY*: `torch`, `cv2`).
5. **Aksesibilitas Antarmuka (Reader)**:
   - Komponen `DocReaderLayout` hanya merender Bab dan Subbab; seluruh 40.500 unit Level 3 tidak pernah tampil di DOM browser.
   - Posisi materi tidak disimpan di query parameter URL, menyebabkan reset saat refresh.
   - Accordion membuka seluruh 22 bab sekaligus pada inisialisasi, membebani memori browser.
6. **Kualitas Pedagogis**:
   - 100% bab tidak memiliki rangkuman bab (`summary: undefined`).
   - 100% bab tidak memiliki narasi jembatan transisi antar bab.

---

## 3. Berkas-Berkas yang Terdampak (Impacted Files Inventory)

| Komponen Arsitektur | Berkas Sumber Sasaran | Peran & Masalah yang Ditemukan |
|---|---|---|
| **Generator Sintetis** | `scripts/curriculum-generator/generate.ts` | Bertanggung jawab memproduksi teks template skeleton, perulangan 4 level latihan, dan injeksi 47 URL berulang. |
| **Konfigurasi Generator** | `scripts/curriculum-generator/topics-config.ts` | Konfigurasi topik yang memaksakan kuota kaku 10 subbab dan 10 unit per subbab. |
| **Registri Sumber Lama** | `scripts/curriculum-generator/sources-registry.ts` | Menyimpan 47 URL berulang yang didominasi oleh root docs (`python-docs`, `pytorch-docs`). |
| **Registri Kurikulum** | `src/lib/curriculum/registry.ts` | Titik tunggal registrasi kurikulum; mengimpor 28 topik secara statis (~30 MB). |
| **Definisi Tipe (Types)** | `src/lib/curriculum/types.ts` | Perlu diperbarui untuk mendukung adaptivitas bab/subbab, metadata provenance, rangkuman, dan transisi. |
| **Berkas Topik Kurikulum** | `src/lib/curriculum/topics/*.ts` (28 berkas) | Memuat konten aktual yang saat ini menderita repetisi template dan output palsu. |
| **Komponen Reader** | `src/components/modul/doc-reader-layout.tsx` | Memotong rendering unit Level 3 dan tidak memiliki persistensi state URL. |
| **Komponen Konten** | `src/app/dashboard/modul/kategori/[id]/page.tsx` | Mengonversi kurikulum ke layout tanpa dukungan deep-linking subbab. |
| **Suite Pengujian** | `src/lib/curriculum/__tests__/all-28-topics.test.ts` | Test lama yang hanya memeriksa panjang array dan keberadaan field statis. |
| **Skrip Validasi** | `scripts/validate-curriculum-content.ts` | Validator lama yang meloloskan kalimat template karena hanya mencari kata "lorem ipsum". |

---

## 4. Analisis Risiko Perubahan & Mitigasi

| Risiko | Dampak Potensial | Strategi Mitigasi Terencana |
|---|---|---|
| **Regresi Build & Type Error** | `npm run build` atau `npx tsc` gagal jika antarmuka `AcademicCurriculum` diubah secara sembarangan. | Terapkan perubahan tipe secara backward-compatible (opsional properties `?`) dan jalankan `tsc --noEmit` di setiap checkpoint. |
| **Kerusakan Navigasi Reader** | Halaman `/dashboard/modul/kategori/[id]` crash jika struktur data kurikulum berubah drastis. | Perbarui helper converter (`curriculumToDocSectionItems`) secara paralel dan uji rendering visual di browser. |
| **Pemuatan DOM Lambat (*Lagging*)** | Jika seluruh unit dirender sekaligus di halaman web, browser ponsel dapat mengalami freeze. | Terapkan *progressive disclosure* dan *lazy accordion expansion* (hanya render materi yang sedang aktif dibuka). |
| **Overwriting Data Asli Tanpa Jejak** | Kehilangan catatan audit Phase 2.2.1 atau data kurikulum lama. | Gunakan skrip migrasi bertahap, kunci baseline dengan git tag, dan simpan catatan perubahan (*migration log*). |

---

## 5. Strategi Migrasi & Rencana Rollback

### Strategi Migrasi Bertahap (Phased Execution)
Remediasi Phase 2.3 dijalankan dalam urutan logis:
1. **Phase 2.3-B**: Penggantian generator sintetis menjadi sistem generator substantif adaptif.
2. **Phase 2.3-C**: Rekayasa data model (tipe data adaptif, provenance sumber, metadata verifikasi kode).
3. **Phase 2.3-D**: Normalisasi sumber tunggal (*single source registry*) dengan penolakan URL root generic.
4. **Phase 2.3-E**: Pipeline eksekusi kode mandiri (eksekusi Python nyata, perekaman output deterministik).
5. **Phase 2.3-F**: Penulisan ulang substantif untuk 2 topik percontohan (*Pilot Topics*): **AI Fundamentals** dan **Machine Learning**.
6. **Phase 2.3-G**: Pemulihan antarmuka pembaca (*Reader Recovery*: rendering unit Level 3, URL state persistence).
7. **Phase 2.3-H**: Penggantian quality gate menjadi pengujian substantif aktif.
8. **Phase 2.3-I**: Penyusunan laporan bukti akhir implementasi.

### Rencana Rollback (Prosedur Darurat)
Jika pada tahap mana pun terjadi kegagalan sistemik yang tidak dapat dipulihkan:
```bash
# 1. Batalkan perubahan yang belum di-commit
git reset --hard phase-2.3-baseline

# 2. Bersihkan file untracked baru jika ada
git clean -fd

# 3. Verifikasi integritas build
npx tsc --noEmit && npm run build
```
Dengan prosedur ini, repositori dijamin dapat kembali ke kondisi stabil dalam waktu kurang dari 30 detik.
