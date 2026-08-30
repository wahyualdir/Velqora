# VELQORA — PHASE 0: REWORK ROADMAP & ARCHITECTURAL BLUEPRINT

---

## 1. TARGET PRODUCT ARCHITECTURE

```text
VELQORA PLATFORM
│
├── 1. SHARED CORE (100% Shared Logic & Safety Invariants)
│   ├── Database Schema (Supabase PostgreSQL & RLS Policies)
│   ├── Authentication & Role Authorization (SSR Session Cookies)
│   ├── Server Actions & API Contracts
│   ├── AI & OCR Multimodal Engines
│   ├── Deterministic Intelligence & Validation Pipelines
│   └── Shared TypeScript Types & Domain Models
│
├── 2. VELQORA WEB (Professional Learning Workspace >= 1024px)
│   ├── High Information Density & Multi-Column Layouts
│   ├── Persistent Collapsible Sidebar (245px expanded / 68px collapsed)
│   ├── Top Context Bar with Spotlight Command Search (Ctrl + K)
│   ├── Structured Desktop Tables (DesktopTable) with Contextual Menus (...)
│   ├── Split-Pane Workbench & File Previews
│   └── Keyboard Shortcut Navigation & Hover Ergonomics
│
├── 3. VELQORA MOBILE APP (Personal Learning Companion < 768px)
│   ├── Touch-First, Thumb-Friendly Interface
│   ├── Fixed 5-Destination Bottom Navigation (Beranda, Materi, Tugas, Modul, Menu)
│   ├── Slide-Over Menu Drawer for Secondary Utilities
│   ├── Modal Bottom Sheets for In-Place Status Updates
│   ├── Single-Column Personal Home (Greeting, Continue Learning, Upcoming Tasks)
│   └── Safe Area Inset Protection (env(safe-area-inset-bottom))
│
├── 4. TABLET HYBRID EXPERIENCE (768px - 1023px)
│   ├── Adaptive 2-Column Content Flow
│   ├── Compact Navigation Sidebar / Drawer
│   └── Touch-Optimized Data Controls
│
└── 5. PRODUCT DISTRIBUTION & DOWNLOAD HUB (/download)
    ├── Official Platform Hub (Android WebAPK, iOS Safari, Desktop Window)
    ├── Real-Time PWA Installation Prompt Integration
    └── Honest Offline Caching Transparency
```

---

## 2. SYSTEM REWORK PHASE BLUEPRINT

- **Phase 0**: Forensic Product Audit, Architecture Discovery & Baseline (**COMPLETED**).
- **Phase 1**: Repository Hygiene, Protected Core Verification & Dead Code Pruning.
- **Phase 2**: Design System & Global Token Normalization (Precision Blue, Neutral Surfaces).
- **Phase 3**: Desktop Workspace Experience Architecture & Information Density.
- **Phase 4**: Mobile App Shell, Bottom Navigation & Bottom Sheet Interactions.
- **Phase 5**: Tablet Hybrid Responsive Calibration.
- **Phase 6**: Official Download Hub & PWA Experience Hardening.
- **Phase 7**: End-to-End Verification, Visual Quality Gate & Final Product Sign-Off.
