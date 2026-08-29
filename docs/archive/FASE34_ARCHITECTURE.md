# FASE 34 — CLOSED-LOOP ACADEMIC INTELLIGENCE ARCHITECTURE

## 1. Executive Summary & Design Vision

FASE 34 completes the transition of Velqora's Intelligent Schedule Automation into a **Closed-Loop Academic Intelligence & Outcome Learning System**.

### The Closed-Loop Cycle
```
┌─────────────────────────────────────────────────────────────────────────┐
│                     VELQORA CLOSED-LOOP ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────────────────┘
        │
        ▼
   1. OBSERVE      ─── Kalender aktif, tugas, deadline, preferensi profil
        │
        ▼
   2. ANALYZE      ─── Deteksi bentrok, beban harian, coverage deadline, realisme
        │
        ▼
   3. RECOMMEND    ─── Proposal Continuous Optimizer 3.0 & Perankingan Terkalibrasi
        │
        ▼
   4. APPROVE      ─── Risk-Based Gatekeeper & Snapshot Invariant Verifier
        │
        ▼
   5. EXECUTE      ─── Atomic Multi-Table Mutation & Proposal Versioning Rollback
        │
        ▼
   6. MEASURE      ─── Session Outcome Recorder (Punctuality, Duration Variance)
        │
        ▼
   7. LEARN        ─── Empirical Calibration Multiplier [0.70, 1.30] & Behavior Signals 2.0
        │
        ▼
   8. EVALUATE     ─── Historical Recommendation Effectiveness (0–100 Score)
        │
        ▼
   9. IMPROVE      ─── Ranker & Optimizer 3.0 Weight Adjustments (Deterministic)
        │
        └─── (Kembali ke Tahap 1: OBSERVE)
```

---

## 2. Core Subsystems

### 2.1 Session Outcome Lifecycle Engine (`src/lib/schedule-outcomes/`)
- **Canonical Lifecycle**: `PLANNED` $\rightarrow$ `STARTED` $\rightarrow$ `COMPLETED` | `PARTIALLY_COMPLETED` | `SKIPPED` | `RESCHEDULED` | `CANCELLED`.
- **Telemetry Invariant**: Nilai aktual yang tidak tersedia dinyatakan sebagai `"UNKNOWN"`, tidak pernah diasumsikan 0 secara gegabah.

### 2.2 Actual vs Planned Variance Analyzer (`actual-vs-planned.ts`)
- **Punctuality**: $|\text{actualStartTime} - \text{plannedStartTime}| \le 15\text{ menit}$.
- **Duration Variance**: $\text{actualDurationMinutes} - \text{plannedDurationMinutes}$.
- **Completion Ratio**: $(\text{actualDuration} / \text{plannedDuration}) \times 100\%$, dijaga dalam batas $[0, 100]$.
- **Adherence Index**: $0.6 \times \text{avgCompletionRatio} + 0.4 \times \text{avgPunctualityScore}$.

### 2.3 Behavior Signals 2.0 (`src/lib/schedule-intelligence/behavior-signals.ts`)
- Menganalisis waktu belajar aktual dominan (PAGI, SIANG, SORE, MALAM).
- Menghitung durasi efektif rata-rata pengguna berdasarkan sesi yang benar-benar diselesaikan.
- Mengidentifikasi hari paling konsisten dan completion rate category (`HIGH`, `MEDIUM`, `LOW`).
- **Privacy Guarantees**: Hanya mengekstrak metrik aktivitas jadwal; tidak melakukan profiling psikologis atau menyimpulkan data sensitif.

### 2.4 Non-Invasive Personalization Feedback Loop (`personalization-feedback.ts`)
- Mendeteksi divergensi saat kebiasaan aktual ($\ge 60\%$ sesi selesai di luar jendela yang dideklarasikan) berbeda dengan preferensi profil.
- **Strict User Agency**: Sistem **tidak pernah** mengubah preferensi pengguna secara sepihak. Selalu menyajikan 3 opsi eksplisit:
  1. `PRESERVE_DECLARED` (Pertahankan preferensi profil saat ini)
  2. `ADAPT_TO_OBSERVED` (Sesuaikan profil dengan kebiasaan aktual)
  3. `DISMISS` (Jangan tampilkan rekomendasi ini lagi)

### 2.5 Recommendation Calibration & Outcome Scoring (`recommendation-calibration.ts`, `recommendation-outcome.ts`)
- Menilai rekomendasi historis secara deterministik berdasarkan tingkat penyelesaian sesi dan pencegahan bentrok ($0–100$).
- Mengalkulasi multiplier bobot perankingan yang dijaga ketat dalam rentang aman $[0.70, 1.30]$.
- Mengintegrasikan hasil kalibrasi ke Continuous Weekly Optimizer 3.0.

### 2.6 Academic Health Multi-Period Trends (`health-trends.ts`)
- Menghitung perubahan skor kesehatan akademik antar snapshot:
  - $\Delta \ge +3 \implies \text{IMPROVING}$
  - $\Delta \le -3 \implies \text{DECLINING}$
  - $-2 \le \Delta \le +2 \implies \text{STABLE}$
- Memberikan penjelasan yang transparan dalam Bahasa Indonesia yang tenang dan objektif.

### 2.7 Early Warning System 2.0 (`early-warning-2.ts`)
- Mendeteksi 5 pola risiko:
  1. `REPEATED_SKIPPING`: $\ge 3$ sesi terlewat dalam 7 hari terakhir.
  2. `REPEATED_RESCHEDULING`: $\ge 3$ kali penundaan pada satu sesi yang sama.
  3. `DEADLINE_COVERAGE_DECLINE`: Beberapa tugas mendesak tanpa alokasi waktu belajar.
  4. `WORKLOAD_ACCUMULATION`: $\ge 3$ hari dalam sepekan dengan beban melebihi batas aman ($>300$ menit).
  5. `RECOMMENDATION_REJECTION_PATTERN`: $\ge 3$ penolakan berturut-turut terhadap tipe rekomendasi serupa.

### 2.8 3-Way Side-Effect-Free What-If Simulator (`what-if-outcome-simulator.ts`)
- Melakukan perbandingan simultan 3 skenario tanpa menyentuh database:
  - **Skenario A (Current)**: Jadwal dan baseline kesehatan kalender saat ini.
  - **Skenario B (Proposed Modification)**: Simulasi penambahan/pemindahan sesi.
  - **Skenario C (Recovery Alternative)**: Rencana pemulihan otomatis jika skenario B menimbulkan risiko.
- Memberikan ringkasan trade-off komparatif dan menentukan skenario terbaik secara objektif.

### 2.9 Transparent 12-Question Explainability Engine (`explanation-engine-4.ts`)
- Menjawab 12 pertanyaan krusial mahasiswa secara transparan tanpa istilah teknis AI yang kabur:
  1. *Mengapa waktu ini dipilih?*
  2. *Tenggat waktu apa yang diprioritaskan?*
  3. *Jadwal kuliah apa saja yang dipertimbangkan?*
  4. *Bagaimana status bentrok jadwal?*
  5. *Berapa beban belajar harian setelah rekomendasi ini diterapkan?*
  6. *Mengapa durasi sesi ini disarankan sekian menit?*
  7. *Apakah rekomendasi ini sesuai preferensi belajar saya?*
  8. *Bagaimana riwayat kebiasaan belajar saya memengaruhi saran ini?*
  9. *Apa risiko jika rekomendasi ini diterapkan?*
  10. *Apa alternatif waktu lain yang tersedia?*
  11. *Apa konsekuensinya jika saya menolak rekomendasi ini?*
  12. *Mengapa rekomendasi ini menempati peringkat #1?*

---

## 3. Strict Safety & Determinism Invariants

| # | Invariant | Enforcement Mechanism |
|---|-----------|-----------------------|
| 1 | **Safety Overrules Behavior** | Bentrok jadwal ($\text{clash} > 0$) mutlak menggugurkan preferensi/kebiasaan historis. |
| 2 | **No Hidden Mutations** | Profil preferensi pengguna hanya berubah atas persetujuan eksplisit. |
| 3 | **Unknown vs Zero** | Data telemetri aktual yang tidak terisi dipetakan ke `"UNKNOWN"`. |
| 4 | **Clamped Multipliers** | Bobot kalibrasi empiris dibatasi strictly pada rentang $[0.70, 1.30]$. |
| 5 | **Side-Effect-Free Simulation** | Clone array in-memory, tidak ada mutasi state database pada pengujian what-if. |
| 6 | **Authenticated Session Isolation** | Isolasi multi-tenant via `supabase.auth.getUser()`, payload client user_id diabaikan. |
