# VELQORA — PHASE 0: REWORK ROADMAP & PHASE 1–6 BACKLOG

---

## 1. PHASE-BY-PHASE EXECUTION ROADMAP

```text
┌─────────────────────────────────────────────────────────────┐
│ PHASE 0: REAL CODEBASE FORENSIC AUDIT (Completed & Proven)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: REPOSITORY REWORK, DEAD CODE & HYGIENE            │
│ • Move root documentation to docs/archive/                  │
│ • Establish protected core & architecture boundaries        │
│ • Clean legacy unreferenced assets                          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: PRODUCT ARCHITECTURE FOUNDATION                    │
│ • Web (>=1024px) != Mobile (<768px) boundary               │
│ • Dark base for Web / Light mode default for Mobile App     │
│ • Level 0–3 Card discipline & 1 Primary CTA button rule     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 3: DESKTOP WEB EXPERIENCE REWORK                      │
│ • 2-Column Command Hub for /dashboard                       │
│ • DesktopTable with '...' menu for Tasks & Curriculum       │
│ • Spotlight search (Ctrl + K) & persistent 245px sidebar    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 4: WEB MOTION, INTERACTION & EDITORIAL EXPERIENCE     │
│ • 150ms–250ms subtle CSS transitions                        │
│ • 40–64px section whitespace & editorial rhythm             │
│ • Strict anti-slop enforcement (0 gradient text, 0 neon)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 5: TRUE PROFESSIONAL WEBSITE EXPERIENCE               │
│ • Editorial academic technology identity                    │
│ • Wide horizontal canvas (1280px–1600px)                    │
│ • Split-pane workspaces for AI Tutor and Playground         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 6: TRUE MOBILE APPLICATION EXPERIENCE                 │
│ • Light-first clean white surfaces (#FFFFFF, #F8FAFC)       │
│ • Persistent 5-destination bottom nav with safe-area insets │
│ • Touch list rows + modal bottom sheets                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. BACKLOG ITEMS & TARGET AREAS

1. **Large Component Decomposition**:
   - `unified-content-form.tsx`: Separate metadata, text editor, and upload dropzones into subcomponents.
   - `schedule-import-modal.tsx`: Separate parsing progress from schedule verification tables.
2. **ESLint Cleanliness**:
   - Clean up remaining unused imports in test suites to ensure `next lint` executes with 0 warnings.
3. **Public Asset Optimization**:
   - Compress `favicon.jpg` and `logo-banner.png` into next-gen WebP/AVIF formats where appropriate.
