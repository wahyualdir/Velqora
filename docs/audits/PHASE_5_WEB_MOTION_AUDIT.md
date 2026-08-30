# VELQORA — PHASE 5: WEB MOTION & INTERACTION AUDIT

---

## 1. PURPOSEFUL MOTION MATRIX

| UI Context | Motion Pattern | Timing & Easing | Purpose |
| :--- | :--- | :--- | :--- |
| **Page Entrance** | `fade-in` | 180ms, `cubic-bezier(0.16, 1, 0.3, 1)` | Smooth content load without layout shift |
| **Section Entrance**| `fade-in-up` | 220ms, `cubic-bezier(0.16, 1, 0.3, 1)` | Natural upward arrival of dashboard sections |
| **Desktop Sidebar** | Width transition | 200ms, `ease-out` | Smooth width adjustment ($245\text{px} \leftrightarrow 68\text{px}$) |
| **Search Palette** | Scale + Opacity | 150ms, `scale(0.98 \to 1.0)` | Instant spotlight command feedback |
| **Table Row** | Background surface | 150ms, ease | Focus and visual row alignment |
| **Button States** | `translateY(-1px) \to 0` | 100ms, ease-out | Tactile press feedback |
| **Bottom Sheet** | `translateY(100% \to 0)` | 250ms, ease-out | Ergonomic touch slide-up on mobile |

---

## 2. ACCESSIBILITY COMPLIANCE (`prefers-reduced-motion`)

- All CSS animations, keyframes, and transitions honor the user's OS reduced motion settings by collapsing to `0.01ms !important`.
