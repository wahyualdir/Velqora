# VELQORA — PHASE 0: PROTECTED CORE DEFINITION & SAFETY BOUNDARIES

---

## 1. PROTECTED SUBSYSTEMS & INVARIANTS

The following subsystems are designated as **PROTECTED CORE**. Modifications must not alter their behavior, security contracts, data structures, or public APIs:

1. **Supabase Database & Migrations**:
   - `supabase/migrations/001_initial_schema.sql` through `007_*.sql`.
   - Tables: `profiles`, `modules`, `materials`, `tasks`, `schedules`, `classrooms`, `ai_memories`, `optimization_outcomes`.
   - Row Level Security (RLS) policies and security triggers.
2. **Supabase Authentication & Authorization**:
   - SSR Cookie management (`src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`).
   - Role-based access control (Admin, Teacher, Student).
3. **Server Actions & Public Contracts**:
   - `src/actions/study-actions.ts`
   - `src/actions/schedule-actions.ts`
   - `src/actions/ai-memory-actions.ts`
   - Signatures and return types must remain 100% backward-compatible.
4. **AI & Multimodal Intelligence Pipeline**:
   - `src/lib/ai/engine.ts`, `src/lib/ai/context-resolver.ts`.
   - Gemini API multimodal parsing and contextual prompts.
5. **Multiformat Document Parsers & OCR Heuristics**:
   - `src/lib/schedule-import/parsers.ts` (PDF, DOCX, XLSX, CSV, TXT).
   - Heuristic fallback and interval clash detection engines.
6. **Automated Test Suites**:
   - All 25 test suites in `src/lib/**/__tests__/*` must pass with 100% success.
