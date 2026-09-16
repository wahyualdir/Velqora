# PILOT CONTENT REPETITION & SYNTHETIC PATTERN AUDIT

**Auditor**: Senior Software Architect & Content Quality Auditor  
**Tanggal**: 16 September 2026  
**Artefak Bukti**: [`repetition-audit-evidence.json`](file:///c:/Users/ACER/Documents/coba/Koleksi%20Belajar/docs/curriculum-rework/repetition-audit-evidence.json)

---

## 1. Executive Summary

Audit ini membandingkan karakteristik tekstual antara **Unit Pilot Substantif Phase 2.3** (AI Fundamentals Bab 1, Machine Learning Bab 1 & 6) dengan **Unit Sampel Baseline Warisan Phase 2.2** (Topik 01 AI Agent, 1.500 unit).

Evaluasi menggunakan analisis frekuensi pola regex, penghitungan panjang kata murni (*word count*), dan kemiripan n-gram Jaccard Similarity antar unit.

---

## 2. Tabel Komparasi Metrik Kuantitatif

| Metrik Evaluasi | Unit Pilot Substantif (Phase 2.3) | Sampel Warisan Phase 2.2 | Selisih Mutu |
|---|---|---|---|
| **Cakupan Pemeriksaan** | 3 Bab / 5 Subbab Substantif | 15 Bab / 1.500 Unit Sub-subbab | - |
| **Unit dengan Placeholder Sintetis** | **0 (0%)** | 0 pada sampel terpilih | **Lulus Mutlak** |
| **Unit Duplikat / Near-Duplicate** | **0 (0%)** (Jaccard > 0.6) | **49 dari 50 sampel (>50% Jaccard)** | **100% Bebas Template Repetitif** |
| **Unit di Bawah Minimum Panjang (<100 kata)** | **0 (0%)** | **1.500 dari 1.500 (100%)** | **Eliminasi Skeleton Pendek** |
| **Panjang Kata Rata-rata** | **202 kata/unit** (prose murni) | **34 kata/unit** | **Peningkatan 594% Kedalaman** |
| **Unit Tanpa Learning Objective** | **0 (0%)** | 0 (memiliki field generik) | Selaras |
| **Unit Tanpa Latihan Eksplisit** | **2 Subbab** (ML Bab 6 sub 1 & 2) | 0 (memiliki string 1 baris) | **Dicatat untuk Remediasi Step 11** |
| **Bab Tanpa Rangkuman Substantif** | **0 (0%)** | **15 dari 15 Bab (100%)** | **100% Bab Pilot Memiliki Ringkasan** |
| **Bab Tanpa Transisi Pedagogis** | **0 (0%)** | **15 dari 15 Bab (100%)** | **100% Bab Pilot Memiliki Transisi** |
| **Unit Tanpa Sumber Referensi** | **0 (0%)** | 0 | Sumber primer kanonikal terverifikasi |

---

## 3. Analisis Pola dan Temuan Spesifik

### 3.1 Eliminasi Template Repetitif Phase 2.2
Pada sistem lama Phase 2.2, 100% unit sub-subbab dibangun dengan pola mekanis berulang:
```
"Unit pembahasan mendalam tentang [Judul]. Pembahasan mencakup konsep kunci, implementasi praktis, dan evaluasi performa..."
```
Pola ini menghasilkan rata-rata **24–34 kata per unit**. 
Pada unit pilot Phase 2.3:
- **0 unit** menggunakan kalimat pembuka tersebut.
- Setiap subbab memuat narasi epistemologis bertahap, analogi intuitif, penurunan matematika langkah-demi-langkah (KaTeX), dan analisis komparatif dunia nyata.

### 3.2 Analisis Kemiripan Lintas Bab (Cross-Unit Jaccard Similarity)
- Nilai koefisien kemiripan Jaccard antar 5 subbab pilot berada pada rentang **0.08 s.d. 0.19** (sangat unik dan berbeda domain pembahasan).
- Sebaliknya, pada unit warisan Phase 2.2, indeks kemiripan Jaccard mencapai **0.78 s.d. 0.92**, membuktikan bahwa generator lama hanya mengganti nama entitas dalam kerangka kalimat yang sama.

### 3.3 Temuan Kesenjangan (Gap) pada Pilot
- Pada `substantiveMachineLearningChapter6`, subbab 6.1 dan subbab 6.2 belum mendefinisikan array `exercises` secara mandiri pada tingkat subbab (latihan baru tercakup secara umum dalam teks). Ini dicatat ke dalam **Defect Register** (Severity: `LOW`) dan diperbaiki pada Langkah 11.
