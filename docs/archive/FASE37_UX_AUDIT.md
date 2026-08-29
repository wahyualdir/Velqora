# FASE 37 — UX AUDIT, "NO AI SLOP" & CARD REFINEMENT

## 1. Principles of Academic UX in Velqora
1. **Calm, Fact-Based Voice**: Avoid hyperbolic AI buzzwords ("magic", "superintelligent", "neural reasoning", "generative wizardry").
2. **Clear Cause and Effect**: Every suggestion explicitly shows:
   - **Alasan**: Why this slot was chosen.
   - **Dampak**: Workload delta, deadline coverage change, conflict status.
   - **Skor**: Deterministic match score (e.g. 87/100).
3. **User Autonomy**: All mutations require user confirmation (`[Tinjau]`, `[Jelaskan]`, `[Terapkan]`). The system never modifies database schedules without explicit user approval.
4. **Transparency On Demand**: Interactive 12 Transparency Questions modal answering exact data sources and alternative options explored.

---

## 2. Recommendation Card Format

```text
REKOMENDASI PENYESUAIAN

Belajar Basis Data
Selasa, 19:00–20:30

Alasan:
Deadline mendekati dan slot waktu belajar pada hari tujuan bebas bentrok dengan beban seimbang.

Dampak Perubahan:
✓ Beban hari +90 menit
✓ Deadline coverage meningkat
✓ Tidak ada konflik

Skor:
Kecocokan 87% (Sangat Baik)

[ Jelaskan ] [ Tinjau ]
```

---

## 3. UI Component Integrity
- Removed excessive glowing animations and heavy decorative gradients.
- Added strict type checks and accessible color contrasts (WCAG AAA/AA).
- Preserved desktop and mobile responsiveness.
