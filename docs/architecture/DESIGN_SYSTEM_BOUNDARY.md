# VELQORA — ARCHITECTURAL SPECIFICATION: DESIGN SYSTEM BOUNDARY

---

## 1. SHARED BRAND & DESIGN TOKEN FOUNDATION

### A. Surface Palette Tokens — "Warm Academic Library"

**Design Philosophy**: Velqora's visual identity draws from the warm, structured
atmosphere of a university library — quality paper, organized shelves, warm
lighting. This deliberately separates Velqora from the dark-navy + blue-accent
default of AI-generated SaaS templates. Light-first by design, with warm
neutrals instead of cool grays.

- **Warm Neutral Foundation (70–85% of Viewport)**:
  - Base Background: `#FAFAF8` (`--color-background`) — warm off-white, like quality paper
  - Primary Surface: `#FFFFFF` (`--color-surface`) — clean white card
  - Surface Secondary: `#F5F3EE` — warm cream for alternate sections
  - Surface Tertiary: `#EDEAE3` — subtle warmth
  - Surface Hover: `#E8E5DE`
  - Border / Separators: `#D6D3CB` (hover `#B8B4AB`) — warm gray, not cool slate
  - Text Primary: `#1C1917` — warm charcoal, not pure black
  - Text Secondary: `#57534E` — warm medium gray
  - Text Tertiary: `#A8A29E` — warm light gray

- **App Surface (Mobile PWA — Unchanged)**:
  - Base Background: `#FFFFFF`
  - Primary Surface: `#F8FAFC`
  - Surface Hover: `#E2E8F0`
  - Border / Separators: `#E2E8F0`

### B. Terracotta Accent (5–10% of Viewport)
- **Primary Brand Accent**: `#C2553A` (`brand-500`)
- **Interactive Hover**: `#A34530` (`brand-600`)
- **Deep Active**: `#853827` (`brand-700`)
- **Soft Interactive Fill**: `rgba(194, 85, 58, 0.1)` (`bg-brand-500/10`)
- **Subtle Focus Ring**: `#C2553A` (`focus-visible:ring-brand-500`)

**Why Terracotta?** No major edtech competitor (Notion, Coursera, Google
Classroom, Canva Learn) uses terracotta as primary accent. It evokes warmth,
academic heritage, and intentionality — qualities absent from generic
blue/indigo/teal palettes that dominate AI-generated output.

### C. Anti-Slop Strict Invariants
- Strictly **0 gradient text** (`bg-clip-text`).
- Strictly **0 neon glow drop-shadows** (`shadow-[0_0_...]`).
- Strictly **0 bouncing icons or pulsating lines** (`animate-bounce` / `animate-pulse`).
- Strictly **0 arbitrary multi-nested card containers**.

---

## 2. WEB VS MOBILE DESIGN SYSTEM CALIBRATION

| Dimension | Web Desktop Workspace ($\ge 1024\text{px}$) | Mobile App Companion ($< 768\text{px}$) |
| :--- | :--- | :--- |
| **Typography Scale** | Standard Display (`text-2xl font-bold font-display`) | Compact Display (`text-lg font-bold font-display`) |
| **Container Padding**| Generous (`p-6` to `p-8`, `max-w-7xl` / `80rem`) | Compact (`p-4` with safe area padding) |
| **Component Spacing**| `gap-6`, `space-y-6` | `gap-3.5`, `space-y-3.5` |
| **Button Hierarchy** | 1 Primary (`brand-600`), 1-2 Secondary (`outline`/`ghost`) | 1 Full-width Primary CTA ($\ge 48\text{px}$ height) |
| **Interactive Menus**| Contextual Dropdown (`...`) on table rows | Tap row $\to$ Modal bottom sheet |
| **Touch Boundaries** | Optimized for mouse precision & click | Minimum $48\text{px} \times 48\text{px}$ touch targets |
| **Corners & Borders**| Subtle rounded corners (`rounded-xl` / `12px`) | Ergonomic rounded cards (`rounded-2xl` / `16px`) |
