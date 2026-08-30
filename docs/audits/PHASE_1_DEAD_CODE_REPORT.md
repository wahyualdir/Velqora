# VELQORA — PHASE 1: DEAD CODE & PRUNING REPORT

---

## 1. FORENSIC DEAD CODE ANALYSIS

All components in `src/components/`, actions in `src/actions/`, and utilities in `src/lib/` were scanned via full codebase reference analysis.

### A. Evaluated Components & Safety Classification

| Component / Utility | Consumers / References | Status | Action Taken | Rationale |
| :--- | :---: | :---: | :--- | :--- |
| `src/components/layout/language-switcher.tsx` | Exported utility | **REVIEW REQUIRED** | **KEPT IN PLACE** | Preserved for internationalization features. |
| `src/components/layout/mobile/mobile-app-shell.tsx` | Mobile Shell wrapper | **ACTIVE** | **KEPT IN PLACE** | Core mobile app container. |
| `src/components/layout/mobile/mobile-list.tsx` | Mobile List row primitive | **ACTIVE** | **KEPT IN PLACE** | Core mobile list presentation primitive. |
| `src/components/modul/module-drive-explorer.tsx` | Module Drive Explorer | **ACTIVE** | **KEPT IN PLACE** | Large active component (1,146 lines). Scheduled for Phase 2 modularization. |
| `src/components/modul/module-interaction-bar.tsx` | Interaction Toolbar | **ACTIVE** | **KEPT IN PLACE** | Scheduled for Phase 2 modularization. |
| `src/components/schedule/missed-session-recovery-modal.tsx` | Schedule Intelligence Modal | **ACTIVE** | **KEPT IN PLACE** | Modal component for academic recovery workflows. |
| `src/components/schedule/reschedule-impact-modal.tsx` | Schedule Intelligence Modal | **ACTIVE** | **KEPT IN PLACE** | Modal component for what-if reschedule impact simulations. |

---

## 2. LEGACY COMPONENTS KEPT FOR PHASE 2 MODULARIZATION

In strict adherence to Phase 1 Rule 8 (*"DO NOT DELETE LEGACY COMPONENTS BLINDLY"*), large active components have been safely retained and cataloged for future non-breaking decomposition:
1. `src/components/modul/unified-content-form.tsx` (1,374 lines)
2. `src/components/schedule/schedule-import-modal.tsx` (1,176 lines)
3. `src/components/modul/module-drive-explorer.tsx` (1,146 lines)
4. `src/lib/file-converter.ts` (1,326 lines)
5. `src/actions/study-actions.ts` (2,755 lines)
6. `src/actions/schedule-actions.ts` (2,273 lines)
