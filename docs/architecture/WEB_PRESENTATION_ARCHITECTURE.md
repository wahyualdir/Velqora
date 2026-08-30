# VELQORA — WEB PRESENTATION ARCHITECTURE SPECIFICATION

---

## 1. PRESENTATION PATTERNS & PRINCIPLES

1. **Content-First Hierarchy**:
   - Page Shell $\to$ Context Header $\to$ Primary Data (Tables/Lists) $\to$ Secondary Actions.
2. **Surface Elevation Levels**:
   - `Level 0`: Page surface (no card, transparent/base background).
   - `Level 1`: Subtle panel (`bg-surface/50 border border-border/80 rounded-xl p-4`).
   - `Level 2`: Actionable card (`bg-surface border border-border rounded-xl p-5 hover:border-brand-500/30`).
   - `Level 3`: Hero/featured workspace card (`bg-surface border border-border/90 rounded-2xl p-6`).
3. **Motion Grammar**:
   - Page transitions: 180ms cubic-bezier fade-in.
   - Micro-interactions: 100ms hover translations ($translateY(-1\text{px})$) and 150ms surface transitions.
   - Reduced motion: Immediate 0.01ms collapse.
4. **Spacing Token Standards**:
   - Micro: 4px, 8px, 12px
   - Normal: 16px, 20px, 24px
   - Major: 32px, 40px, 48px, 64px
