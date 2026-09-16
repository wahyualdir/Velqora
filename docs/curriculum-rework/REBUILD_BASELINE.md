# VELQORA — REBUILD BASELINE SNAPSHOT
**Arsitektur Rebuild:** Notebook-Style Academic Curriculum System  
**Tanggal Snapshot:** 16 September 2026  
**Commit Baseline:** `85ea99642c864a28e9d7d28858ecbd67192a415e`  
**Tag Baseline:** `phase-2.4-batch-1-acceptance`  
**Branch Aktif:** `main`  
**Status Global Platform:** `VERIFIED_WITH_LIMITATIONS`  

---

## 1. Verifikasi Status Repository

- **Git Status:** Clean working tree (0 untracked files, 0 modified files).
- **Remote Synchronization:** Branch `main` up-to-date with `origin/main`.
- **Integrasi Keamanan:** Tidak ada kredensial, token API, atau secret hardcoded pada kode maupun riwayat commit.

---

## 2. Lingkungan Runtime Terverifikasi

| Pustaka / Komponen | Versi Terverifikasi | Path Eksekusi / Lokasi | Status Kesiapan |
|---|:---:|---|:---:|
| **Python** | 3.12.10 (64-bit AMD64) | `C:\Users\ACER\AppData\Local\Python\pythoncore-3.12-64\python.exe` | `READY` |
| **NumPy** | 2.5.3 | Terpasang di pythoncore-3.12-64 | `READY` |
| **Pandas** | 3.0.5 | Terpasang di pythoncore-3.12-64 | `READY` |
| **Scikit-Learn** | 1.9.1 | Terpasang di pythoncore-3.12-64 | `READY` |
| **PyTorch** | 2.14.0+cpu | Terpasang di pythoncore-3.12-64 | `READY` |
| **Node.js** | v20+ / tsx | Runtime test runner | `READY` |
| **Next.js** | 15.5.25 | Framework web platform Velqora | `READY` |

---

## 3. Scope Rebuild Total (Gold Standard Pilot)

- **Topik Pilot Emas:** `data-science` (`src/lib/curriculum/topics/11-data-science.ts`).
- **Target Bab:** **Bab 1 — Metodologi Sains Data, Problem Framing, dan Siklus Hidup Analisis Data**.
- **Jumlah Subbab Target:** 6 Subbab komprehensif:
  - 1.1 Taksonomi Data Science
  - 1.2 Problem Framing & Formulasi Target
  - 1.3 Siklus Hidup CRISP-DM
  - 1.4 Siklus Hidup OSEMN & Perbandingan
  - 1.5 Causal Thinking, Batasan Korelasi & Simpson's Paradox
  - 1.6 Studi Kasus End-to-End Problem Framing (California Housing)
- **Data Model:** Polimorfik `NotebookUnit` (12 varian unit terstruktur).
- **Isolasi Modul:** 26 topik lainnya tetap mempertahankan fallback *backward compatibility* tanpa regresi visual atau fungsional.
