# Velqora — Academic Reader Rebuild Baseline Report

**Document ID**: `BASE-ARR-2026-09`  
**Status**: `STAGE 1 COMPLETE — VERIFIED BASELINE`  
**Execution Stage**: `Stage 1 of 10`  
**Auditor**: Senior Software Architect & Academic Curriculum Designer  
**Timestamp**: September 2026  

---

## 1. Status Repositori Aktual

Berdasarkan inspeksi langsung tanpa data rekaan pada lingkungan lokal:

- **Initial Commit Hash**: `7a158401cb86b08b55644d8a2b9b04a4a9415c46`
- **Active Git Branch**: `main`
- **Remote Origin**: `https://github.com/wahyualdir/Velqora.git` (synchronized)
- **Active Git Tag**: `rebuild-gold-standard-ds-ch1-audited-v2`
- **Working Tree**: Bersih terhadap seluruh file terlacak (`docs/reports/module-reader-rebuild-audit.md` untracked sebagai artefak audit).
- **TypeScript Static Verification**: `npx tsc --noEmit` -> **0 Error**
- **Test Suites Lulus**: **30 / 30 Suites Passed** (237 test assertions passed)
- **Negative Quality Gates**: **21 / 21 Gates Passed**
- **Python Execution Environment**:
  - Python Runtime: `3.12.10 (64-bit AMD64)`
  - NumPy: `2.5.3`
  - Pandas: `3.0.5`
  - Scikit-Learn: `1.9.1`
  - PyTorch: `2.14.0+cpu`

---

## 2. Metrik Kurikulum Aktual (Dihitung dari AST & Registry Nyata)

| Parameter Metrik | Nilai Terhitung Nyata | Keterangan Sumber Kebenaran |
|---|:---:|---|
| **Jumlah Topik Kurikulum** | **28** | Registri `ALL_ACADEMIC_CURRICULA` di `src/lib/curriculum/registry.ts` |
| **Jumlah Bab (Chapters)** | **373** | Akumulasi chapter di seluruh 28 topik |
| **Jumlah Subbab (Subchapters)** | **3,680** | Akumulasi subbab di seluruh 373 chapter |
| **Jumlah Unit Semantik Notebook** | **49** | Tepat 49 unit, terkonsentrasi di Data Science Bab 1 |
| **Subbab Data Science Bab 1** | **6** | Subbab 1.1 (8 unit), 1.2 (8 unit), 1.3 (8 unit), 1.4 (8 unit), 1.5 (7 unit), 1.6 (10 unit) |
| **Jumlah Konten Legacy (Tanpa Unit)** | **3,674** | 3,680 total subbab dikurangi 6 subbab pilot Data Science Bab 1 |
| **Jumlah Test Suites Aktual** | **30** | Divalidasi via eksekusi Jest runner (`npm test`) |
| **Jumlah Rute Next.js (Pages)** | **41** | Dihitung dari seluruh file `page.tsx` di direktori `src/app/` |

---

## 3. Peta Penggunaan Komponen Utama yang Akan Dirombak

1. `src/components/modul/doc-reader-layout.tsx`:
   - Layout utama pembaca modul. Saat ini memaksakan 3 kolom kaku (Sidebar 288–336px + Konten Tengah + Outline Kanan 256px), membuat area baca sempit pada laptop/tablet.
2. `src/lib/curriculum/types.ts`:
   - Penampung tipe data `DocSectionItem`, `AcademicCurriculum`, `NotebookUnit`. Memerlukan penguatan model `AcademicLesson`, `LessonFlow`, dan `NotebookExecutionGroup`.
3. `src/components/modul/notebook/notebook-unit-renderer.tsx`:
   - Renderer kartu terisolasi yang memicu "card fatigue". Memerlukan transformasi menjadi kanvas akademik terpadu.
4. `src/components/modul/notebook/notebook-code-cell.tsx` & `notebook-output-cell.tsx`:
   - Sel kode dan sel output yang saat ini terpisah. Memerlukan penyatuan blok eksekusi dengan *progressive disclosure*.
5. `src/components/modul/notebook/notebook-formula-card.tsx` & `notebook-definition-card.tsx`:
   - Kartu rumus dan definisi yang memerlukan tipografi akademik bersih alih-alih nested borders.
6. `src/lib/curriculum/topics/11-data-science.ts`:
   - Modul acuan baku Data Science Bab 1 yang akan dihubungkan ke model `AcademicLesson` baru.

---

## 4. Risiko Regresi & Strategi Mitigasi

- **Risiko Kritis 1: Regresi pada 3,674 Subbab Legacy**
  - *Dampak*: Jika pembaca baru hanya menerima format `AcademicLesson` atau `NotebookUnit`, 3,674 subbab lainnya akan mengalami crash atau layar kosong.
  - *Mitigasi Wajib*: Membangun branching adaptor yang secara mulus merender materi legacy via `NoteRenderer` jika `lesson` atau `units` tidak didefinisikan.
- **Risiko Kritis 2: Kerusakan pada 30 Test Suites yang Ada**
  - *Dampak*: Kegagalan CI/CD atau tes regresi.
  - *Mitigasi*: Menjaga signature fungsi publik dan tipe data eksisting tetap *backward-compatible* tanpa breaking changes.
- **Strategi Rollback**:
  - Baseline telah diamankan pada commit `7a15840` dan tag `rebuild-gold-standard-ds-ch1-audited-v2`. Pemulihan instan dapat dilakukan melalui:
    ```bash
    git checkout 7a15840 -- src/
    ```
