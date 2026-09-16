# VELQORA — BATCH 1 MIGRATION STATUS
**Status Global Platform:** `VERIFIED_WITH_LIMITATIONS`  
*(Status ini tidak dinaikkan menjadi VERIFIED karena 24 topik spesialisasi lainnya masih berstatus legacy-synthetic)*  
**Batch Scope:** `deep-learning` & `data-science`  
**Tanggal Evaluasi:** 16 September 2026  
**Otoritas Evaluasi:** Curriculum Migration Steering Committee  

---

## 1. Status Migrasi Individual Topik

| Topik ID | Slug | Status Sebelumnya (Phase 2.3.1) | Status Baru (Batch 1) | Flag `legacy-synthetic` | Justifikasi / Evidence |
|---|---|:---:|:---:|:---:|---|
| **11-data-science** | `data-science` | `legacy-synthetic` | `MIGRATED / SUBSTANTIVE_VERIFIED` | **DIHAPUS** (Lulus 100%) | Lulus 20 aspek acceptance, anti-leakage pipeline tervalidasi di Python 3.12, bebas boilerplate skeleton, 12 referensi terverifikasi, California Housing dataset. |
| **12-deep-learning** | `deep-learning` | `legacy-synthetic` | `MIGRATED / SUBSTANTIVE_VERIFIED` | **DIHAPUS** (Lulus 100%) | Lulus 20 aspek acceptance, PyTorch OOP autograd tervalidasi di Python 3.12 (torch 2.14.0+cpu), bebas boilerplate skeleton, 11 referensi terverifikasi, derivasi analitis chain rule. |

---

## 2. Status Topik di Luar Batch 1 (24 Topik Lain)

Sesuai aturan ketat isolasi Batch 1:
- Topik 01 s/d 10 dan 13 s/d 28 **TIDAK DIUBAH**.
- Seluruh 24 topik tersebut **TETAP MEMPERTAHANKAN FLAG `legacy-synthetic`**.
- Jadwal migrasi topik-topik tersebut mengikuti `docs/curriculum-rework/PHASE_2_4_BATCH_PLAN.md` (Batch 2 s/d Batch 13).

---

## 3. Koreksi Rencana Dependensi (Dependency Map Review)

Klaim historis bahwa *Deep Learning merupakan prasyarat langsung bagi seluruh 8 topik spesialisasi* telah diaudit ulang secara substantif:

| Topik Spesialisasi | Hubungan terhadap Deep Learning | Prasyarat Fundamental Sesungguhnya | Status Validasi Dependensi |
|---|---|---|:---:|
| **Computer Vision** | **Prasyarat Langsung** | Aljabar linear matriks, konvolusi 2D, representasi spasial citra, dan arsitektur Deep Learning (CNN). | `TERVALIDASI` |
| **Natural Language Processing (NLP)** | **Prasyarat Parsial** | Statistika korpus, representasi leksikal/n-gram, tokenisasi teks, serta konsep embedding Deep Learning. | `TERVALIDASI` |
| **Large Language Models (LLM)** | **Prasyarat Tidak Langsung** | Membutuhkan dasar NLP, Transformer self-attention, aljabar tensor, serta optimasi Deep Learning skala besar. | `TERVALIDASI` |
| **Generative AI** | **Prasyarat Parsial** | Teori probabilitas lanjut (Bayesian, Markov Chain), pemodelan laten, serta arsitektur Deep Learning (VAE, GAN, Diffusion). | `TERVALIDASI` |
| **Graph Neural Networks (GNN)** | **Prasyarat Gabungan** | Teori graf diskrit (*graph theory*), aljabar matriks laplacian/spektral, serta mekanisme message-passing Deep Learning. | `TERVALIDASI` |
| **Speech AI** | **Prasyarat Gabungan** | Pemrosesan sinyal digital (DSP), transformasi Fourier (STFT), ekstraksi spektrogram/MFCC, serta model sekuensial Deep Learning. | `TERVALIDASI` |
| **TinyML** | **Prasyarat Terbalik** | Rekayasa sistem tertanam (*embedded systems*), komputasi integer berpresisi rendah (quantization INT8), serta model compression. | `TERVALIDASI` |
| **MLOps** | **Prasyarat Sekunder** | Rekayasa perangkat lunak, containerization (Docker/K8s), CI/CD pipeline, monitoring data drift, dan siklus hidup ML. | `TERVALIDASI` |

**Kesimpulan:** Deep Learning bukanlah "super-prasyarat" tunggal bagi seluruh AI. Setiap domain memiliki fondasi matematika dan rekayasa spesifik yang mandiri.

---

## 4. Keputusan Akhir Batch 1

1. Topik `deep-learning` dinyatakan **MIGRATED**.
2. Topik `data-science` dinyatakan **MIGRATED**.
3. Status platform tetap: **`VERIFIED_WITH_LIMITATIONS`**.
