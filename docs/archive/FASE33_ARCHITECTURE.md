# FASE 33 — AUTONOMOUS ACADEMIC SCHEDULE ORCHESTRATION ARCHITECTURE

## Executive Summary

FASE 33 transforms Velqora's Intelligent Schedule Automation into a **Production-Grade Autonomous Academic Schedule Orchestrator**. 

The system continuously perceives the schedule state, generates immutable canonical snapshots, checks for context staleness, simulates what-if scenarios without side effects, evaluates deterministic Academic Health (0–100), guards against schedule regressions, and applies safety-gated atomic modifications with full rollback capability.

---

## 1. Core Principles & Strict Invariant Hierarchy

```
Safety > Data Integrity > No Conflict > Deadline Coverage > Recovery > Workload Balance > User Preference > Optimization
```

1. **Safety & Zero Destructive Actions**: The orchestrator NEVER silently deletes or shifts fixed lectures.
2. **Canonical State Stability**: All snapshots and hash values are 100% deterministic and invariant to array ordering.
3. **Optimistic Concurrency & Freshness**: Proposals are bound to their parent snapshot hash. If calendar state changes in the interim, proposals automatically transition to `STALE` or `INVALIDATED`.
4. **Side-Effect Free Simulations**: What-If simulations calculate in-memory deltas and never touch persistent database tables.
5. **Multi-Factor Regression Detection**: Any optimization that creates a conflict, breaks deadline coverage, or violates the 360-minute daily ceiling is classified as `CRITICAL_REGRESSION` and instantly `BLOCKED`.
6. **Transparent Explainability**: 10 distinct transparency questions answered in Calm Academic Indonesian.

---

## 2. System Architecture & Component Interactions

```mermaid
graph TD
    A[Database Schedules & Tasks] --> B[Schedule Snapshot Engine]
    B -->|SHA-256 Hash & Metrics| C[Snapshot State]
    
    C --> D[Staleness & Freshness Engine]
    C --> E[Academic Health Engine (0-100)]
    C --> F[Proactive Early Warning System]
    
    C --> G[Continuous Optimizer 2.0]
    G --> H[Regression Detector]
    H --> I[Approval Gatekeeper]
    
    I -->|SAFE_AUTOMATIC / USER_CONFIRMATION| J[Optimization Proposal]
    I -->|BLOCKED| K[Rejected Proposal]
    
    J --> L[Atomic Apply & Rollback Manager]
    L -->|Rollback Backup| A
    
    C --> M[Side-Effect-Free What-If Simulator]
```

---

## 3. Subsystem Detailed Design

### 3.1 Point-in-Time Snapshot Engine (`schedule-snapshot.ts`)
- **Canonical Sorting**: Courses and study sessions sorted by `id`, `day`, `start_time`, and `title`.
- **Stable Hashing**: SHA-256 hash representing the exact academic context (courses, sessions, deadlines, preferences).
- **Snapshot Diffing**: Detects `NO_CHANGE`, `SCHEDULE_CHANGED`, `DEADLINE_CHANGED`, `CONFLICT_INTRODUCED`, `CONFLICT_RESOLVED`, `USER_PREFERENCE_CHANGED`.

### 3.2 Context Staleness Engine (`staleness-engine.ts`)
- Evaluates if an existing proposal is still valid against the latest calendar snapshot:
  - `FRESH`: Hash matches, actionable.
  - `STALE`: Schedule has moved, re-calculation recommended.
  - `REVALIDATION_REQUIRED`: Task deadline or user preference changed.
  - `INVALIDATED`: A new conflict was introduced in the base schedule.

### 3.3 Multi-Factor Regression Detector (`regression-detector.ts`)
- Inspects proposed modifications across 5 invariant dimensions:
  1. Conflict Invariant (cannot increase conflicts).
  2. Deadline Coverage (cannot drop coverage for critical tasks).
  3. Workload Ceiling (cannot exceed 360 min/day).
  4. Overloaded Days count.
  5. Schedule Realism Score.
- Severity levels: `IMPROVEMENT`, `NEUTRAL`, `REGRESSION`, `CRITICAL_REGRESSION`.

### 3.4 Continuous Weekly Optimizer 2.0 (`continuous-optimizer.ts`)
- Formulates weekly redistribution proposals moving study sessions from overloaded days to lighter days.
- Preserves total study minutes and guarantees a minimum 30-minute rest buffer.

### 3.5 Side-Effect-Free What-If Simulator (`what-if-engine.ts`)
- Simulates `MOVE_ITEM`, `ADD_ITEM`, and `DELETE_ITEM` in memory.
- Outputs before-and-after comparison of conflicts, workload, free time, and deadline risks.

### 3.6 Approval Gatekeeper (`approval-gate.ts`)
- Risk-based gating:
  - `SAFE_AUTOMATIC`: Reading recommendations, non-destructive queries.
  - `USER_CONFIRMATION`: Relocating flexible self-study sessions.
  - `EXPLICIT_CONFIRMATION`: Modifying fixed lecture times or high-impact changes.
  - `BLOCKED`: Any change causing critical regressions, stale proposals, or cross-user access attempts.

### 3.7 Deterministic Academic Health Engine (`academic-health.ts`)
- Computes an aggregate score between 0 and 100 based on:
  - Conflict Freedom (Max: 25 pts)
  - Workload Balance (Max: 20 pts)
  - Deadline Coverage (Max: 20 pts)
  - Realism & Rest (Max: 20 pts)
  - Study Execution (Max: 15 pts)

### 3.8 Early Warning System (`early-warning.ts`)
- Proactively generates alerts across 8 categories: `CONFLICT_RISK`, `WORKLOAD_ACCUMULATION`, `CONSECUTIVE_OVERLOAD`, `DECLINING_COVERAGE`, `UNREALISTIC_EXPECTATION`, `INSUFFICIENT_RECOVERY`, `DEADLINE_APPROACHING`, `STALE_RECOMMENDATIONS`.
