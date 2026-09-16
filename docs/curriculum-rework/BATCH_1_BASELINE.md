# BASELINE & REPOSITORY SNAPSHOT: BATCH 1 (PHASE 2.4)
**Dokumen Referensi**: VELQORA-B1-BASE-2026-01  
**Auditor / Release Engineer**: Senior Release Engineer & QA Specialist  
**Tanggal Snapshot**: 16 September 2026  
**Status Baseline**: VALID & RECORDED

---

## 1. Kondisi Repositori Saat Baseline

Sebelum memulai penulisan ulang konten substantif Batch 1 (`deep-learning` dan `data-science`), kondisi repositori direkam sebagai berikut:

| Parameter | Nilai Tercatat | Status Verifikasi |
|---|---|---|
| **Active Branch** | `main` | Terverifikasi |
| **Commit Baseline** | `154696d9398d8bc9955b97da43f8e5cb6f2a4721` | Terverifikasi (`origin/main`) |
| **Commit Message** | `feat(curriculum): complete Phase 2.3.1 pilot acceptance, negative testing & evidence validation` | Bersih & Terverifikasi |
| **Baseline Tag** | `phase-2.3.1-acceptance` | Tersemat pada HEAD commit |
| **Remote Repository** | `https://github.com/wahyualdir/Velqora.git` (fetch & push) | Terverifikasi |
| **Status Secret / Credential** | 0 secret, 0 API key, 0 token terdeteksi | Bersih (Clean) |
| **Status Working Tree** | Hanya berkas perencanaan Tahap 1–2 Phase 2.4 | Aman |

---

## 2. Batasan Scope File Batch 1

Perubahan berkas pada Batch 1 dibatasi secara ketat hanya pada:

### A. Berkas Konten Kurikulum yang Akan Diremediasi
1. `src/lib/curriculum/topics/12-deep-learning.ts` (Topik 1)
2. `src/lib/curriculum/topics/11-data-science.ts` (Topik 2)
3. `src/lib/curriculum/source-registry.ts` (Registrasi sumber primer baru jika diperlukan)

### B. Berkas Pengujian & Eksekusi Skrip Batch 1
1. `scripts/curriculum-generator/verify-batch1-code.py` (Runner eksekusi kode nyata Python 3.12)
2. `scripts/curriculum-generator/__tests__/batch1-acceptance.test.ts` (Validator gerbang mutu)

### C. Berkas Dokumentasi Bukti Batch 1 di `docs/curriculum-rework/`
1. `BATCH_1_BASELINE.md`
2. `BATCH_1_LEGACY_AUDIT.md`
3. `BATCH_1_SOURCE_MAP.md`
4. `BATCH_1_CODE_EXECUTION_REPORT.md`
5. `BATCH_1_CONTENT_ACCEPTANCE_REPORT.md`
6. `BATCH_1_NEGATIVE_TEST_REPORT.md`
7. `BATCH_1_READER_VALIDATION_REPORT.md`
8. `BATCH_1_DEFECT_REGISTER.md`
9. `BATCH_1_TEST_EVIDENCE.md`
10. `BATCH_1_MIGRATION_STATUS.md`
11. `BATCH_1_FINAL_REPORT.md`

### D. Larangan Pengubahan Scope
- Dilarang memodifikasi 24 file topik kurikulum lainnya di `src/lib/curriculum/topics/`.
- Dilarang memodifikasi sistem routing Next.js (`src/app/`).
- Dilarang mengubah desain antarmuka global.
- Dilarang menaikkan status global dari `VERIFIED_WITH_LIMITATIONS`.

---

## 3. Koreksi Hubungan Ketergantungan (Pedagogical Dependency Re-verification)

Menindaklanjuti arahan arsitek, klaim bahwa `deep-learning` merupakan prasyarat tunggal/langsung bagi seluruh 8 topik spesialisasi telah dikoreksi dengan hubungan keilmuan yang terperinci:

1. **Computer Vision (`computer-vision`)**: Membutuhkan `deep-learning` secara langsung untuk representasi konvolusional (CNNs, vision backbones), namun juga bertumpu pada geometri proyeksi dan transformasi spasial.
2. **Natural Language Processing (`natural-language-processing`)**: Membutuhkan dasar statistik probabilitas, machine learning linier, serta representasi teks dasar (tokenisasi, n-gram, TF-IDF) sebelum memasuki arsitektur neural.
3. **Large Language Model (`large-language-model`)**: Membutuhkan fondasi `deep-learning` DAN `natural-language-processing`, khususnya mekanisme atensi (*Self-Attention*) dan blok Transformer.
4. **Generative AI (`generative-ai`)**: Membutuhkan teori probabilitas lanjut, estimasi densitas, `deep-learning`, dan pemodelan generatif (VAE, DDPM, GAN).
5. **Graph Neural Network (`graph-neural-network`)**: Membutuhkan aljabar linier matriks adjacency/Laplacian, teori graf dasar (*graph theory*), dan mekanisme message passing `deep-learning`.
6. **Speech & Audio AI (`speech-audio-ai`)**: Membutuhkan pemrosesan sinyal digital (*Short-Time Fourier Transform*, Mel-spectrogram), sebelum model neural audio.
7. **Edge AI & TinyML (`edge-ai-tinyml`)**: Membutuhkan arsitektur sistem tertanam (*embedded systems*), teknik kompresi model (kuantisasi INT8, pruning), dan runtime deployment mikro.
8. **MLOps & Deployment (`mlops-deployment`)**: Membutuhkan pemahaman siklus hidup ML (*ML lifecycle*), rekayasa perangkat lunak, orkestrasi kontainer, monitoring data drift, dan reproduktibilitas.

---

## 4. Kesimpulan Tahap 1

Snapshot repositori telah terekam secara aman pada commit `154696d`. Baseline bersih dan siap untuk pelaksanaan audit konten warisan (Tahap 2).
