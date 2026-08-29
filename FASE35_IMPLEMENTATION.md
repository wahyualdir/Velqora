# FASE 35: Implementation & Refactoring Details

## 1. Summary of Changes

### 1.1 Canonical Domain Constants Centralization
* Created `src/lib/schedule/academic-constants.ts` declaring `ACADEMIC_CONSTANTS`.
* Exported `ACADEMIC_CONSTANTS` across:
  - `src/lib/schedule/index.ts`
  - `src/lib/schedule-intelligence/index.ts`
  - `src/lib/schedule-orchestration/index.ts`
  - `src/lib/schedule-outcomes/index.ts`

### 1.2 Subsystem Hardening & Invariant Alignment
* **`personal-profile.ts`**:
  - `DEFAULT_SCHEDULE_PREFERENCE` now directly references `ACADEMIC_CONSTANTS`.
  - Preference clamping: `maximumDailyStudyMinutes` clamped safely in $[60, 360]$.
* **`workload-analyzer.ts`**:
  - Hard cap overload condition: `dayStat.isOverloaded = dayStat.totalMinutes > ACADEMIC_CONSTANTS.DAILY_WORKLOAD_HARD_CAP_MINUTES`.
* **`regression-detector.ts`**:
  - Daily hard cap regression check: `propMaxDay > ACADEMIC_CONSTANTS.DAILY_WORKLOAD_HARD_CAP_MINUTES && propMaxDay > origMaxDay` triggers `CRITICAL_REGRESSION`.
* **`adaptive-planner.ts`**:
  - Max single session clamped to `ACADEMIC_CONSTANTS.ADAPTIVE_MAX_SINGLE_SESSION_MINUTES` (90 minutes).
  - Break buffer defaults to `ACADEMIC_CONSTANTS.DEFAULT_BREAK_DURATION_MINUTES` (30 minutes).
* **`safety-rules.ts`**:
  - Linked daily study and break limits to `ACADEMIC_CONSTANTS`.
* **`recommendation-calibration.ts`**:
  - Calibration multiplier clamped to `[ACADEMIC_CONSTANTS.CALIBRATION_MULTIPLIER_MIN, ACADEMIC_CONSTANTS.CALIBRATION_MULTIPLIER_MAX]` ($[0.70, 1.30]$).
* **`conflict-engine.ts`**:
  - Time parsing supports both colon (`08:30`) and dot (`08.30`) formats seamlessly via `/[:.]/`.
* **`normalizer.ts`**:
  - Enhanced `extractLocationFromTitle` to strip trailing Indonesian prepositions (`di`, `pada`, `at`) when disambiguating classroom location from course title.
* **`observability.ts`**:
  - Exported `sanitizeMetadata` to enable direct sanitization validation and nested redaction of tokens and keys.

### 1.3 Comprehensive Test Suite
* Created `src/lib/schedule-outcomes/__tests__/fase35-system-audit.test.ts` featuring 105 exhaustive scenarios divided into 10 structured groups (Group A to Group J).
