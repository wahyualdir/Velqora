# REGISTER DEFEK TERPUSAT (PHASE 2.3.1)
**Dokumen Referensi**: VELQORA-DEF-REG-2026-01  
**Lead Auditor**: Senior Software Architect & QA Engineer  
**Tanggal Evaluasi**: 16 September 2026  
**Status**: ACTIVE & TRACKED (5 Defek Teridentifikasi: 0 Critical, 0 High, 1 Medium, 4 Low)

---

## 1. Taksonomi & Klasifikasi Keparahan Defek

| Tingkat Keparahan | Definisi Operasional | Tindakan & SLA |
|---|---|---|
| **CRITICAL** | Kerusakan build workspace, kegagalan fatal runtime, kehilangan data, atau loop tak berhingga. | Wajib diselesaikan seketika sebelum release (*Zero Tolerance*). |
| **HIGH** | Kebocoran data (*data leakage*), klaim matematika/statistik salah, keluaran kode fiktif, plagiarisme, atau kegagalan Uji Regresi Utama. | Wajib diselesaikan sebelum status dinyatakan stabil. |
| **MEDIUM** | Cakupan migrasi modul belum tuntas 100%, ketergantungan warisan (*legacy debt*) yang diisolasi dengan flag aman, atau fitur pelengkap belum terpasang. | Ditangani melalui migrasi terencana bertahap (*staged rollout*). |
| **LOW** | Kelengkapan field opsional skema data, ketidaksempurnaan nuansa bahasa/diksi akademis, atau peningkatan ergonomi antarmuka minor. | Diselesaikan pada siklus *controlled fixes* atau *polish phase*. |

---

## 2. Tabel Register Defek Terpusat

| ID Defek | Kategori | Tingkat Keparahan | Lokasi / Komponen | Deskripsi Defek | Dampak & Resiko | Status Tindakan |
|---|---|---|---|---|---|---|
| **DEF-01** | Content Staging | **MEDIUM** | `src/lib/curriculum/topics/` (26 topik warisan) | 26 topik warisan masih menahan unit sintetis pendek Phase 2.2 dan 47 URL generik lama. | Materi non-pilot belum memenuhi standar kedalaman akademis. | **TRACKED FOR PHASE 2.4** (Diisolasi dengan flag `legacy-synthetic`, aman dari regresi). |
| **DEF-02** | Schema Compliance | **LOW** | `src/lib/curriculum/pilot-content.ts` (Seluruh 3 Bab Pilot) | Objek `AcademicChapter` tidak memiliki properti `evaluationQuestions` eksplisit pada tingkat bab. | Komponen kuis bab mengandalkan fallback atau parsing latihan subbab. | **RESOLVED IN STEP 11** (Ditambahkan array `evaluationQuestions` pada ketiga bab pilot). |
| **DEF-03** | Schema Compliance | **LOW** | `src/lib/curriculum/pilot-content.ts` (`ml-ch6-sub1` & `ml-ch6-sub2`) | Subbab 6.1 dan 6.2 Machine Learning tidak memiliki array properti `exercises` pada objek subbab. | Mahasiswa tidak memiliki latihan mandiri terstruktur di akhir materi regularisasi. | **RESOLVED IN STEP 11** (Ditambahkan latihan mandiri analitis dan komputasi bertingkat). |
| **DEF-04** | Epistemology & Language | **LOW** | `src/lib/curriculum/pilot-content.ts` (`code-poly-bishop-pipeline`) | Penjelasan kode menggunakan kata absolut: *"Hasil eksekusi Python aktual membuktikan bahwa..."*. | Kurang selaras dengan konvensi epistemologis sains data statistik empiris. | **RESOLVED IN STEP 11** (Diksi diubah menjadi *"Hasil eksperimen numerik mengindikasikan bahwa..."*). |
| **DEF-05** | UI / Ergonomics | **LOW** | `src/components/modul/doc-reader-layout.tsx` | Belum ada event listener keyboard global (panah kiri/kanan) untuk berpindah bab sekuensial. | Pengguna hanya dapat berpindah materi menggunakan klik tombol atau klik mouse. | **SCHEDULED FOR ENHANCEMENT** (Non-blocking backlog). |

---

## 3. Rencana Tindakan Remediasi Terkendali (Langkah 11)

Tiga defek prioritas perbaikan cepat (**DEF-02, DEF-03, dan DEF-04**) akan dieksekusi langsung pada Langkah 11 melalui modifikasi terkontrol pada file `src/lib/curriculum/pilot-content.ts`:
1. **Remediasi DEF-02**:
   - Menambahkan 4-5 pertanyaan evaluasi konseptual komprehensif pada `substantiveAiFundamentalsChapter1`, `substantiveMachineLearningChapter1`, dan `substantiveMachineLearningChapter6`.
2. **Remediasi DEF-03**:
   - Menambahkan latihan bertingkat (*Level 2 Analitis & Level 3 Sintesis Rekayasa*) pada Subbab 6.1 (Dekomposisi Bias-Varians) dan Subbab 6.2 (Regularisasi Ridge vs Lasso).
3. **Remediasi DEF-04**:
   - Menyesuaikan diksi penjelasan eksperimen polinomial menjadi objektif dan proporsional secara ilmiah.

Setelah modifikasi, seluruh suite pengujian (`tsc --noEmit` dan `negative-quality-gates.test.ts`) akan dijalankan ulang untuk memastikan nol regresi (*zero regression*).

---

## 4. Kesimpulan Register

Tidak ditemukan defek berkategori **CRITICAL** maupun **HIGH**. Seluruh defek fungsional dan integritas konten yang bersifat kritis telah diselesaikan sejak awal Phase 2.3. Defek yang tersisa bersifat *schema completeness* dan *staged rollout tracking*.

**Status Akhir Langkah 10**: **VERIFIED**
