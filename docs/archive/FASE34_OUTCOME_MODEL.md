# FASE 34 — OUTCOME MODEL & CLOSED-LOOP MATHEMATICAL SPECIFICATION

## 1. Domain Outcome Statuses

Every study session or scheduled academic block possesses an immutable state transition lifecycle:

```text
[ PLANNED ] ───────► [ STARTED ] ───────► [ COMPLETED ] (actualDuration >= 80% planned)
      │                     │
      │                     └───────────► [ PARTIALLY_COMPLETED ] (0 < actualDuration < 80% planned)
      │
      ├─────────────────────────────────► [ SKIPPED ] (explicitly bypassed or 0 duration)
      ├─────────────────────────────────► [ RESCHEDULED ] (moved to alternative day/time)
      └─────────────────────────────────► [ CANCELLED ] (deleted by user)
```

---

## 2. Actual vs Planned Variance Formulation

Given a planned session $P = (t_{\text{start}}, t_{\text{end}}, d_p)$ and an actual execution $A = (t_{\text{act\_start}}, t_{\text{act\_end}}, d_a)$:

1. **Duration Variance ($\Delta d$)**:
   $$\Delta d = d_a - d_p$$
2. **Start Time Variance ($\Delta t_{\text{start}}$)**:
   $$\Delta t_{\text{start}} = t_{\text{act\_start}} - t_{\text{start}} \quad (\text{minutes})$$
3. **Completion Ratio ($R_c$)**:
   $$R_c = \begin{cases} \min\left(1.0, \frac{d_a}{d_p}\right) \times 100\% & \text{if } d_p > 0 \\ 0\% & \text{otherwise} \end{cases}$$
4. **Punctuality Score ($S_p \in [0, 100]$)**:
   $$S_p = \max(0, 100 - 2 \times |\Delta t_{\text{start}}|)$$
5. **Schedule Adherence Index ($S_{\text{adh}} \in [0, 100]$)**:
   $$S_{\text{adh}} = \text{round}\left(0.6 \times R_c + 0.4 \times S_p\right)$$

*Rule*: If actual telemetry is absent, actual metrics evaluate strictly to `UNKNOWN`, never synthesized as `0` or estimated falsely.

---

## 3. Recommendation Outcome Calibration Scoring

For every historical optimization recommendation $R$:

$$S_{\text{outcome}}(R) = w_1 \cdot C_{\text{exec}} + w_2 \cdot C_{\text{compl}} + w_3 \cdot C_{\text{deadl}} + w_4 \cdot C_{\text{workl}} - w_5 \cdot P_{\text{resched}}$$

Where:
- $C_{\text{exec}} \in \{0, 100\}$ (0 if rejected, 100 if accepted and applied)
- $C_{\text{compl}} \in [0, 100]$ (average completion ratio of affected sessions)
- $C_{\text{deadl}} \in [0, 100]$ (100 if urgent deadlines remained covered)
- $C_{\text{workl}} \in [0, 100]$ (100 if daily overload decreased)
- $P_{\text{resched}} \in [0, 50]$ (penalty for subsequent rescheduling)
- Default weights: $w_1 = 0.25, w_2 = 0.35, w_3 = 0.20, w_4 = 0.20, w_5 = 1.0$.

---

## 4. Personalization Feedback Divergence Detection

Let $T_{\text{pref}}$ be user declared study start time window (e.g. 19:00–21:30) and $T_{\text{obs}}$ be the empirically dominant completion window (e.g. 16:00–18:00):

- If $\ge 60\%$ of completed sessions over the last 14 days occur in $T_{\text{obs}}$ and $T_{\text{obs}} \neq T_{\text{pref}}$:
  - Trigger **Personalization Feedback Prompt**.
  - Provide 3 explicit actions:
    1. `PRESERVE_DECLARED`: Keep declared preferences.
    2. `ADAPT_TO_OBSERVED`: Update preferred time window to match empirical habit.
    3. `DISMISS`: Do not prompt again for 30 days.

---

## 5. Health Trend Classification

Comparing current Academic Health Score $H_{\text{curr}}$ against prior rolling baseline $H_{\text{prev}}$:

$$\Delta H = H_{\text{curr}} - H_{\text{prev}}$$

$$\text{Trend} = \begin{cases} \text{INSUFFICIENT\_DATA} & \text{if sample count } < 2 \\ \text{IMPROVING} & \text{if } \Delta H \ge +3 \\ \text{DECLINING} & \text{if } \Delta H \le -3 \\ \text{STABLE} & \text{if } -3 < \Delta H < +3 \end{cases}$$
