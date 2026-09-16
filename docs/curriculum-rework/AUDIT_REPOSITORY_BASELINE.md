# AUDIT REPOSITORY BASELINE — PHASE 2.3.1

**Tanggal & Waktu Audit**: 16 September 2026, 01:36 WIB / 08:36 UTC  
**Branch Aktif**: `main`  
**Commit Aktif**: `cbaf669 feat(curriculum): implement Phase 2.3 substantive remediation, verified sources, and reader recovery`  
**Head Origin**: `https://github.com/wahyualdir/Velqora.git`  
**Snapshot Baseline Tag**: `phase-2.3-baseline` (commit `f9c000a`)  
**Auditor**: Senior Software Architect & Technical Quality Auditor

---

## 1. Lingkungan Komputasi & Runtime

| Komponen | Versi Terdeteksi | Jalur / Executable | Status Integritas |
|---|---|---|---|
| **Node.js** | `v24.19.0` | `C:\Program Files\nodejs\node.exe` | Terverifikasi |
| **NPM** | `11.17.0` | `C:\Program Files\nodejs\npm.cmd` | Terverifikasi |
| **Next.js** | `15.5.25` | `node_modules/next` | App Router (SSR + Client Components) |
| **React** | `19.0.0` | `node_modules/react` | Terverifikasi |
| **TypeScript** | `5.7.3` | `node_modules/typescript` | Strict typecheck active |
| **Python** | `3.12.10 (AMD64)` | `C:\Users\ACER\AppData\Local\Python\pythoncore-3.12-64\python.exe` | Terverifikasi |
| **Scikit-Learn** | `1.9.1` | Python 3.12 `site-packages` | Terverifikasi |
| **NumPy** | `2.5.3` | Python 3.12 `site-packages` | Terverifikasi |
| **Pandas** | `3.0.5` | Python 3.12 `site-packages` | Terverifikasi |
| **Scipy** | `1.18.1` | Python 3.12 `site-packages` | Terverifikasi |

---

## 2. Struktur Direktori Utama yang Diperiksa

- `src/lib/curriculum/`:
  - `types.ts`: Arsitektur model data 6-layer (Source, Code, Dataset, Pedagogical, Transition, Navigation).
  - `registry.ts`: Single Source of Truth (SSOT) 28 topik AI & Data Science.
  - `source-registry.ts`: Single Source Registry 15 sumber primer kanonikal.
  - `pilot-content.ts`: Pilot modul substantif multi-layer (AI Fundamentals Bab 1, ML Bab 1 & 6).
  - `topics/`: 28 berkas topik lama (`01-ai-agent.ts` s.d. `28-vector-database-retrieval.ts`).
- `src/components/modul/`:
  - `doc-reader-layout.tsx`: Reader UI dengan flattening Level 3, lazy accordion, dan persistensi URL `?section=...`.
- `src/app/dashboard/modul/kategori/[id]/page.tsx`: Halaman kategori utama yang merender reader.
- `scripts/curriculum-generator/`:
  - `adaptive-schema.ts`: Skema kurikulum adaptif tanpa pembatasan 10x10.
  - `verified_ml_suite.py`: Skrip eksekusi riil dataset California Housing, Pipeline, Polinomial 1/3/15, Lasso/Ridge, K-Fold.
  - `ml_execution_evidence.json`: Bukti empiris tangkapan output eksekusi Python.
  - `migrate-data-model.ts`: Migrasi tagging non-destruktif.
  - `substantive-quality-gates.ts`: Evaluator 19 gerbang kualitas substantif.
  - `__tests__/substantive-generator.test.ts`: Guardrail unit test.

---

## 3. Perintah Verifikasi yang Dijalankan & Hasilnya

| No | Perintah Command | Exit Code | Output Ringkas | Status |
|---|---|---|---|---|
| 1 | `git status` | `0` | Working tree clean, up to date with origin/main | **CLEAN** |
| 2 | `git log -3 --oneline` | `0` | `cbaf669`, `f9c000a`, `2ff8ad5` | **VERIFIED** |
| 3 | `node -v; npm -v` | `0` | Node `v24.19.0`, NPM `11.17.0` | **VERIFIED** |
| 4 | `python check_env.py` | `0` | Python 3.12, scikit-learn 1.9.1, numpy 2.5.3, pandas 3.0.5 | **VERIFIED** |
| 5 | `node --import tsx --test substantive-generator.test.ts` | `0` | 3 suites, 3 passed, 0 failed | **PASSED** |
| 6 | `node --import tsx --test all-28-topics.test.ts` | `0` | 8 tests, 8 passed, 0 failed | **PASSED** |
| 7 | `npx tsc --noEmit` | `0` | 0 Error | **PASSED** |
| 8 | `npm run build` | `0` | 40/40 static pages generated | **PASSED** |

---

## 4. Risiko & Anomali yang Diidentifikasi

1. **Volume Berkas Topik Warisan (Legacy)**: 28 file di `src/lib/curriculum/topics/` berukuran total ~45 MB. Berkas-berkas ini memuat 40.500 unit yang sebagian besar (~28.182 unit) merupakan teks template berulang dari Phase 2.2.
2. **Keterbatasan Cakupan Remediasi**: Baru 3 bab yang ditulis ulang secara substantif (AI Fundamentals Bab 1, Machine Learning Bab 1 & 6). 26 topik lainnya masih berstatus `legacy-synthetic` dan memerlukan gelombang penulisan bertahap.
3. **Pustaka Tambahan**: Pustaka `torch` (PyTorch), `cv2` (OpenCV), dan `matplotlib` belum terpasang di environment lokal Python 3.12 (kode yang mengimpornya harus diklasifikasikan sebagai `FAILS_DEPENDENCY` atau membutuhkan environment cloud/GPU).

---

## 5. Berkas yang Tidak Dapat Diverifikasi & Batasan Audit

- **Berkas Database Supabase Eksternal**: File autentikasi dan database daring Supabase diuji secara lokal menggunakan mock client; koneksi jaringan aktual bergantung pada kredensial lingkungan.
- **Batasan Audit**: Audit Phase 2.3.1 ini dibatasi secara ketat pada **pembuktian pilot, pengujian negatif, dan validasi bukti substantif**, bukan mengekspansi materi baru ke 26 topik lainnya sebelum pilot benar-benar diterima.
