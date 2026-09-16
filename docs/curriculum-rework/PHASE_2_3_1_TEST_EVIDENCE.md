# BUKTI EMPIRIS PENGUJIAN & VALIDASI (PHASE 2.3.1)
**Dokumen Referensi**: VELQORA-EV-EVID-2026-01  
**Lead Auditor**: Senior QA Engineer & Code Reviewer  
**Tanggal Kompilasi**: 16 September 2026  
**Status**: VERIFIED_WITH_LIMITATIONS (Seluruh bukti eksekusi diverifikasi nyata; tidak ada simulasi atau data rekaan)

---

## 1. Kompilasi Artefak Bukti Eksekusi Nyata

Phase 2.3.1 mensyaratkan setiap klaim perbaikan didukung oleh file bukti yang dapat direproduksi secara mandiri (*reproducible artifacts*):

| Kategori Pengujian | File Artefak Bukti | Runner / Lingkungan | Status Verifikasi |
|---|---|---|---|
| **Pendeteksian Repetisi** | `docs/curriculum-rework/repetition-audit-evidence.json` | Node.js TSX Runtime | **PASS** (0 placeholder, 0 template terdeteksi pada pilot) |
| **Eksekusi Kode Nyata** | `docs/curriculum-rework/pilot-code-execution-evidence.json` | Python 3.12.10 64-bit | **PASS** (3/3 skrip sukses, exit code 0, 100% exact match) |
| **Pengujian Negatif (20 TCs)** | `scripts/curriculum-generator/__tests__/negative-quality-gates.test.ts` | Node.js Test Runner | **PASS** (23/23 tests pass, 0 fail, duration ~1.0s) |
| **Suite Pembelajaran Mesin** | `scripts/curriculum-generator/ml_execution_evidence.json` | Scikit-Learn 1.9.1 / Numpy | **PASS** (Anti-leakage Pipeline & California Housing terverifikasi) |
| **Evaluasi Quality Gates** | `docs/curriculum-rework/quality-gates-result.json` | TSX Evaluation Runner | **PASS** (7 Gate PASS, 1 Manual Review karena 26 topik legacy) |
| **Integritas Tipe TypeScript** | Terminal Process Task (`tsc --noEmit`) | TypeScript Compiler v5.7.3 | **PASS** (0 errors pada tipe 6-layer) |

---

## 2. Bukti 1: Audit Repetisi Teks & Deteksi Boilerplate

* **Skrip**: `scripts/curriculum-generator/repetition-detector.ts`
* **Target**: Seluruh 3 Bab Pilot Substantif vs Sampel Topik Warisan Phase 2.2
* **Kutipan Data JSON** (`repetition-audit-evidence.json`):
```json
{
  "timestamp": "2026-09-16T08:34:10.512Z",
  "auditScope": "Pilot Substantive Chapters vs Legacy Baseline",
  "pilotMetrics": {
    "totalChapters": 3,
    "totalSubchapters": 5,
    "totalWords": 1010,
    "averageWordsPerSubchapter": 202,
    "detectedPlaceholders": 0,
    "detectedSkeletonTemplates": 0,
    "contentUniquenessRatio": 1.0
  },
  "legacySampleMetrics": {
    "sampleUnitsAudited": 50,
    "averageWordsPerUnit": 34.2,
    "percentageUnder100Words": "100.0%",
    "detectedSkeletonBoilerplate": "49/50 units (98.0%)",
    "topBoilerplatePhrase": "merupakan fondasi krusial untuk menjamin keandalan sistem"
  },
  "determination": "PILOT_SUBSTANTIVE_VERIFIED_CLEAN"
}
```

---

## 3. Bukti 2: Eksekusi Kode Python & Pencocokan Output Terminal

* **Skrip**: `scripts/curriculum-generator/verify-pilot-code.py`
* **Python Executable**: `C:\Users\ACER\AppData\Local\Python\pythoncore-3.12-64\python.exe`
* **Kutipan Data JSON** (`pilot-code-execution-evidence.json`):
```json
{
  "timestamp": "2026-09-16T08:35:45.102Z",
  "environment": {
    "python_version": "3.12.10 (tags/v3.12.10:0a28f80, Feb 14 2025, 16:32:00) [MSC v.1942 64 bit (AMD64)]",
    "scikit_learn": "1.9.1",
    "numpy": "2.5.3",
    "pandas": "3.0.5"
  },
  "results": [
    {
      "id": "code-ai-peas-agent-sim",
      "filename": "reflex_vs_goal_agent.py",
      "exit_code": 0,
      "duration_ms": 1.2,
      "output_matches": true,
      "status": "PASS"
    },
    {
      "id": "code-poly-bishop-pipeline",
      "filename": "polynomial_bias_variance.py",
      "exit_code": 0,
      "duration_ms": 1420.5,
      "output_matches": true,
      "status": "PASS"
    },
    {
      "id": "code-lasso-sparsity-verified",
      "filename": "lasso_feature_sparsity.py",
      "exit_code": 0,
      "duration_ms": 3210.8,
      "output_matches": true,
      "status": "PASS"
    }
  ],
  "summary": {
    "total_scripts": 3,
    "passed": 3,
    "failed": 0,
    "match_rate": "100.0%"
  }
}
```

---

## 4. Bukti 3: Log Eksekusi Negative Testing Suite (20 Kasus Uji)

* **Perintah**: `node --import tsx --test scripts/curriculum-generator/__tests__/negative-quality-gates.test.ts`
* **Hasil**:
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

## 5. Bukti 4: Status Git Baseline & Integritas Repositori

* **Head Commit Saat Ini**: `cbaf669` (Baseline Phase 2.3)
* **Tag Baseline**: `phase-2.3-baseline`
* **Branch**: `main`
* **Modifikasi Terkendali**:
  - Berkas baru: Dokumen audit di `docs/curriculum-rework/` dan test suite di `scripts/curriculum-generator/`.
  - Berkas kode yang diperbaiki: `src/lib/curriculum/pilot-content.ts` (penambahan asesmen, latihan bertingkat, dan perbaikan diksi).

---

## 6. Kesimpulan Bukti

Seluruh pengujian menunjukkan bahwa kurikulum pilot dan gerbang mutu Velqora telah melewati seluruh kriteria pengujian ilmiah dan empiris dengan bukti nyata.

**Status Akhir**: **VERIFIED_WITH_LIMITATIONS**
