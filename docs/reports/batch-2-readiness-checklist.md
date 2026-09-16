# Velqora — Batch 2 Controlled Migration Readiness Checklist

**Dokumen**: Lembar Kesiapan Migrasi Terkontrol Batch 2  
**Target Rencana**: Topik 01 (AI Fundamentals) & Topik 02 (Machine Learning Foundations)  
**Status Evaluasi**: READY FOR REVIEW (DO NOT PROCEED TO IMPLEMENTATION YET)  
**Tanggal Evaluasi**: 16 September 2026  

---

## 1. Prasyarat Gerbang Mutu Pilot (*Prerequisites Quality Gate*)

Sebelum migrasi materi Batch 2 dapat dimulai, seluruh 8 prasyarat di bawah ini wajib berstatus **MEMENUHI**:

| No | Kriteria Prasyarat | Status Audit | Lokasi Bukti Dokumen |
|:---:|---|:---:|---|
| 1 | Laporan penyelesaian modul pilot telah dikoreksi dari klaim berlebihan (*overclaims* dihapus). | **MEMENUHI** | `docs/reports/rebuild-gold-standard-ds-ch1-audit.md` |
| 2 | Matriks defek teknis telah disusun lengkap dengan bukti before-after dan status individual. | **MEMENUHI** | `docs/reports/rebuild-gold-standard-ds-ch1-defect-matrix.md` |
| 3 | Matriks penelusuran klaim ke sumber primer (*source traceability*) telah terdokumentasi rapi. | **MEMENUHI** | `docs/reports/rebuild-gold-standard-ds-ch1-source-traceability.md` |
| 4 | Audit perilaku antarmuka pembaca (*reader behavior*) divalidasi pada 21 aspek interaksi. | **MEMENUHI** | `docs/reports/rebuild-gold-standard-ds-ch1-reader-validation.md` |
| 5 | Bukti eksekusi runtime kode Python asli terekam lengkap ke log mentah dan JSON evidence. | **MEMENUHI** | `docs/evidence/rebuild-gold-standard-ds-ch1/` & `ds_ch1_execution_evidence.json` |
| 6 | Seluruh 21 pengujian otomatis Negative Quality Gates lulus 100% tanpa kompromi. | **MEMENUHI** | `docs/evidence/rebuild-gold-standard-ds-ch1/03-negative-tests.log` |
| 7 | Baseline Git, commit hash audit, dan tag rollback terdefinisi secara presisi. | **MEMENUHI** | Commit `ef211c0` $\to$ tag `rebuild-gold-standard-ds-ch1` |
| 8 | Laporan resmi akhir menetapkan status rilis *Accepted as Gold Standard Pilot / Verified with Limitations*. | **MEMENUHI** | `docs/reports/rebuild-gold-standard-ds-ch1-final-audit.md` |

---

## 2. Batasan Ruang Lingkup Ketat Batch 2

Sesuai prinsip kehati-hatian kurikulum, Batch 2 **dibatasi secara ketat maksimal pada 2 topik**:

### Topik 1: Artificial Intelligence Fundamentals (Topik 01)
- **Fokus Substantif**: Epistemologi AI, paradigma agen rasional, spesifikasi arsitektur PEAS, taksonomi lingkungan tugas, algoritma pencarian ruang keadaan (Uninformed: BFS/DFS/UCS vs Informed: A*, Heuristik Konsisten), dan kepuasan kendala (CSP).
- **Rujukan Primer**: Russell & Norvig, *Artificial Intelligence: A Modern Approach* (AIMA, 4th ed. Pearson 2020).
- **Larangan Desain**: Dilarang menggunakan template kode Data Science Chapter 1; wajib menggunakan representasi agen otonom dan struktur graf state-space.

### Topik 2: Machine Learning Foundations (Topik 02)
- **Fokus Substantif**: Teori inferensi statistik, kerangka PAC Learning, dekomposisi bias-varians analitis, regresi linear OLS dengan derivasi Normal Equation, optimasi gradien (GD, SGD, Adam), regularisasi L1/L2, dan estimasi risiko empiris.
- **Rujukan Primer**: Hastie, Tibshirani & Friedman, *The Elements of Statistical Learning* (Springer 2009); Bishop, *Pattern Recognition and Machine Learning* (Springer 2006).
- **Larangan Desain**: Tidak boleh menggunakan dataset toy tanpa pelabelan batasan generalisasi; seluruh sel kode komputasi wajib menyertakan bukti eksekusi terminal nyata di Python 3.12.

---

## 3. Dependency DAG (Directed Acyclic Graph) Antar-Topik

```
[Topik 01: AI Fundamentals]
  ├── Bab 1: Paradigma Agen Rasional & Kerangka PEAS
  │     ↓
  ├── Bab 2: Problem Solving via State-Space Search (A*, Heuristik)
  │     ↓
  └── Bab 3: Logika Simbolik, Inferensi Proposisional & CSP
        │
        └── (Transisi Kognitif: Dari Logika Deterministik ke Penalaran Stokastik)
              ↓
[Topik 02: Machine Learning Foundations]
  ├── Bab 1: Epistemologi Supervised Learning & Normal Equation OLS
  │     ↓
  ├── Bab 2: Optimasi Gradien Numerik (Gradient Descent & SGD)
  │     ↓
  ├── Bab 3: Teori Belajar Statistik, Bias-Varians & PAC Learnability
  │     ↓
  └── Bab 4: Regularisasi L1/L2 (Sparsity vs Shrinkage) & Pipeline Anti-Leakage
```

---

## 4. Larangan Mutlak Selama Eksekusi Batch 2
1. **Dilarang Copy-Paste Buta**: Tidak boleh menduplikasi struktur unit Data Science Bab 1 secara mekanis tanpa menyesuaikan kekhasan pedagogis domain AI dan ML.
2. **Dilarang Menggunakan Placeholder Sintetik**: Teks seperti "akan dibahas pada bab selanjutnya", ringkasan satu kalimat, atau kode stub pass dilarang keras.
3. **Dilarang Rujukan Palsu / Generik**: Semua URL rujukan wajib mengarah ke buku teks, paper ber-DOI, atau dokumentasi resmi yang aktif.
4. **Dilarang Fabrikasi Output**: Seluruh sel kode komputasi wajib dieksekusi melalui runner Python nyata dan menghasilkan exit code 0.

---

## 5. Keputusan Kesiapan Gerbang Batch 2
> **STATUS**: **PRASYARAT AUDIT TERPENUHI (READY FOR REVIEW)**.  
> *Implementasi teknis Batch 2 TIDAK BOLEH dimulai sebelum dependency DAG di atas ditinjau dan disetujui secara eksplisit oleh tim kurikulum / pengguna.*
