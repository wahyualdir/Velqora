# VELQORA — ARCHITECTURAL SPECIFICATION: PROTECTED CORE

---

## 1. EXECUTIVE RATIONALE FOR PROTECTED CORE

The **Protected Core** represents the immutable foundations of the Velqora platform. During frontend UI transformations, responsive reorganizations, and visual polish, the following modules, schemas, contracts, and pipelines are **strictly protected from breaking modifications, deletions, or structural rewrites**.

```text
┌────────────────────────────────────────────────────────┐
│                   VELQORA PROTECTED CORE                │
│                                                        │
│  1. DATABASE & SUPABASE   (Schema, RLS, Migrations)    │
│  2. AUTH & SECURITY       (Sessions, RBAC, Middleware) │
│  3. SERVER ACTIONS & API  (CRUD Contracts, Actions)    │
│  4. MULTIMODAL AI & OCR   (Gemini, Claude, OCR Engines)│
│  5. DETERMINISTIC ENGINES (Schedule, Conflict, Cache)  │
│  6. AUTOMATED TEST SUITES (25 Suites / 185+ Scenarios) │
└────────────────────────────────────────────────────────┘
```

---

## 2. PROTECTED SUBSYSTEMS & ASSETS

### A. Database & Supabase Layer
- **Protected Files**:
  - `supabase/migrations/*` (All schema definitions, triggers, and indices)
  - `src/lib/supabase/*` (Supabase browser client, server client, middleware client)
  - `src/types/database.types.ts`
- **Protection Rationale**:
  - Direct database modifications during UI phases risk data loss, RLS security bypasses, and regression in multi-tenant isolation.
- **Rule**: Presentation layer changes must conform to the existing schema and RLS policies.

### B. Authentication & Authorization Layer
- **Protected Files**:
  - `src/middleware.ts`
  - `src/actions/auth-actions.ts`
  - `src/context/auth-context.tsx`
  - `src/app/(auth)/*`
- **Protection Rationale**:
  - Cookie handling, SSR token refreshing, and session validation protect user privacy and access control.
- **Rule**: Form styling may be enhanced, but auth dispatch actions and OAuth redirects must remain untouched.

### C. Server Actions & API Contracts
- **Protected Files**:
  - `src/actions/study-actions.ts`
  - `src/actions/schedule-actions.ts`
  - `src/actions/ai-actions.ts`
  - `src/actions/quiz-actions.ts`
  - `src/app/api/*`
- **Protection Rationale**:
  - 36 application routes rely on these deterministic action signatures.
- **Rule**: Signatures, parameters, and return types must remain 100% backward compatible.

### D. Multimodal AI & OCR Engines
- **Protected Files**:
  - `src/lib/ai/*` (AI engine, fallback orchestrator, memory management)
  - `src/lib/file-converter.ts` (Client & server format conversion)
  - `src/lib/schedule-import/*` (OCR parsers, normalizers, heuristic extractors)
- **Protection Rationale**:
  - Critical academic workflow features rely on multi-tier fallback pipelines.
- **Rule**: UI triggers may be refreshed, but engine logic and heuristics remain intact.

### E. Deterministic Schedule Intelligence & Optimization Engines
- **Protected Files**:
  - `src/lib/schedule-intelligence/*`
  - `src/lib/schedule-orchestration/*`
  - `src/lib/schedule-outcomes/*`
  - `src/lib/schedule-validation/*`
- **Protection Rationale**:
  - Hard mathematical guarantees against schedule clashing, inverted intervals, and telemetry leaks.

### F. Automated Test Suites
- **Protected Files**:
  - `src/lib/**/__tests__/*` (All 25 test suites)
  - `fixtures/*`
- **Protection Rationale**:
  - Continuous regression protection and quality gate verification.
