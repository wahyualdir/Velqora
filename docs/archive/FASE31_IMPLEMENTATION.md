# FASE 31 — ADAPTIVE SCHEDULE INTELLIGENCE, REAL-WORLD STRESS TESTING & SELF-CORRECTING WORKFLOW

## 1. Executive Summary & Status
FASE 31 introduces **Adaptive Schedule Intelligence & Self-Correcting Workflows**, allowing Velqora to react intelligently to real-world schedule dynamics:
- **Adaptive Schedule Context Engine** (`adaptive-context.ts`)
- **Schedule Change Detection & Stable Diffing** (`schedule-diff.ts`)
- **Smart Rescheduling Engine 2.0 & Impact Analyzer** (`reschedule-engine.ts` & `impact-analyzer.ts`)
- **Adaptive Planner & Smart Deadline Adaptation** (`adaptive-planner.ts`)
- **Deterministic Recommendation Quality Scoring (0–100)** (`recommendation-quality.ts`)
- **Recommendation Explanation 2.0** (`explanation-engine.ts`)
- **Import Update Mode ("Perbarui Jadwal")** (`schedule-change-review.tsx`)
- **Reschedule Impact Modal** (`reschedule-impact-modal.tsx`)
- **52 Comprehensive Unit & Integration Test Scenarios** (`fase31-suite.test.ts`)

---

## 2. Key Modules & Technical Implementation

### 2.1 Schedule Version Diffing Engine (`schedule-diff.ts`)
* Uses stable identity key (`generateScheduleIdentityKey`): `courseCode + normalizedTitle + day + occurrenceIndex` (never array indices).
* Categorizes changes into `ADDED`, `UNCHANGED`, `TIME_CHANGED`, `ROOM_CHANGED`, `LECTURER_CHANGED`, `DATE_CHANGED`, `TITLE_CHANGED`, `REMOVED`.
* Enables non-destructive, interactive review during schedule document updates.

### 2.2 Smart Rescheduling Engine 2.0 (`reschedule-engine.ts` & `impact-analyzer.ts`)
* Evaluates complete ripple effects when a lecture moves.
* Quantifies `gainedFreeTimeMinutes`, `lostFreeTimeMinutes`, and `deadlineRiskIncreased`.
* Discovers alternative non-conflicting free slots adhering strictly to $\ge 30$-minute break buffers and $\le 240$-minute daily study limits.
* Never alters schedules without explicit user confirmation (*User Confirmation Gate*).

### 2.3 Adaptive Planner & Overload Recovery (`adaptive-planner.ts`)
* **Deadline Adaptation**: Automatically upgrades task priority & urgency to `CRITICAL` when deadlines move closer.
* **Overload Recovery Mode**: If a day is full or overloaded, suggests distributing to lighter upcoming days or shorter focus blocks (45m) instead of fabricating fake slots.

### 2.4 Recommendation Quality Score (`recommendation-quality.ts`)
* Evaluates 6 deterministic factors (0–100):
  1. Deadline Urgency (max 30)
  2. Free-Time Duration Adequacy (max 20)
  3. Zero Conflict Risk (max 15)
  4. Workload Balance (max 15)
  5. Break Compliance (max 10)
  6. Preferred Study Time (max 10)
* Classifies into: `Sangat Cocok` ($\ge 90$), `Optimal` ($75-89$), `Cukup` ($60-74$), `Perlu Penyesuaian` ($<60$).

### 2.5 Recommendation Explanation 2.0 (`explanation-engine.ts`)
* Answers all 7 core transparency questions:
  - *Kenapa waktu ini dipilih?*
  - *Apa yang diprioritaskan?*
  - *Jadwal apa yang dipertimbangkan?*
  - *Apakah ada konflik?*
  - *Apakah deadline memengaruhi pilihan?*
  - *Apakah workload masih aman?*
  - *Apakah terdapat alternatif yang lebih baik?*

---

## 3. Security & Multi-Tenant Isolation
* All Server Actions enforce `supabase.auth.getUser()`.
* User-controlled `user_id` from client payloads is strictly discarded.
* Atomic transaction safety and live conflict re-validation on all DB write operations.
