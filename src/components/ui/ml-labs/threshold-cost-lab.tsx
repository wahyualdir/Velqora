"use client";

import React, { useMemo, useState } from "react";

// Deterministic calibrated probability scores for 200 imbalanced transactions (10% positive fraud)
const SAMPLE_DATA: Array<{ y: 0 | 1; p: number }> = (() => {
  const arr: Array<{ y: 0 | 1; p: number }> = [];
  let s = 1337;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  // 180 negatives (low score skew)
  for (let i = 0; i < 180; i++) {
    const raw = Math.pow(rnd(), 2.6) * 0.72;
    arr.push({ y: 0, p: Math.min(0.98, Math.max(0.01, raw)) });
  }
  // 20 positives (higher score skew, overlapping)
  for (let i = 0; i < 20; i++) {
    const raw = 0.22 + Math.pow(rnd(), 0.55) * 0.75;
    arr.push({ y: 1, p: Math.min(0.99, Math.max(0.05, raw)) });
  }
  return arr;
})();

export function ThresholdCostLab({ resetSignal }: { resetSignal?: number }) {
  const [threshold, setThreshold] = useState(0.5);
  const [costFN, setCostFN] = useState(500); // Missed fraud cost ($)
  const [costFP, setCostFP] = useState(25); // False block friction cost ($)

  React.useEffect(() => {
    if (resetSignal) {
      setThreshold(0.5);
      setCostFN(500);
      setCostFP(25);
    }
  }, [resetSignal]);

  const metrics = useMemo(() => {
    const evalAt = (tau: number) => {
      let tp = 0, fp = 0, tn = 0, fn = 0;
      for (const d of SAMPLE_DATA) {
        const pred = d.p >= tau ? 1 : 0;
        if (pred === 1 && d.y === 1) tp++;
        else if (pred === 1 && d.y === 0) fp++;
        else if (pred === 0 && d.y === 0) tn++;
        else fn++;
      }
      const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
      const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
      const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
      const totalCost = fn * costFN + fp * costFP;
      return { tp, fp, tn, fn, precision, recall, f1, totalCost };
    };

    const current = evalAt(threshold);

    // Sweep thresholds for cost curve & optimal tau*
    const curve: Array<{ tau: number; cost: number }> = [];
    let bestTau = 0.5;
    let minCost = Infinity;
    for (let i = 5; i <= 95; i += 2) {
      const tau = i / 100;
      const c = evalAt(tau).totalCost;
      curve.push({ tau, cost: c });
      if (c < minCost) {
        minCost = c;
        bestTau = tau;
      }
    }

    const theoreticalTau = costFP / (costFP + costFN);
    const maxCost = Math.max(...curve.map((c) => c.cost), 1);

    return { current, curve, bestTau, minCost, theoreticalTau, maxCost };
  }, [threshold, costFN, costFP]);

  const { current, curve, bestTau, minCost, theoreticalTau, maxCost } = metrics;
  const sx = (tau: number) => 42 + ((tau - 0.05) / 0.9) * 396;
  const sy = (c: number) => 175 - (c / maxCost) * 145;
  const costPath = curve
    .map((pt, i) => `${i === 0 ? "M" : "L"}${sx(pt.tau).toFixed(1)},${sy(pt.cost).toFixed(1)}`)
    .join(" ");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-secondary">Threshold (τ)</span>
            <span className="font-bold text-brand-500 dark:text-[#D4664A]">{threshold.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.05}
            max={0.95}
            step={0.01}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full accent-[#C2553A] cursor-pointer"
          />
        </label>

        <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-secondary">Biaya FN (Lolos)</span>
            <span className="font-bold text-rose-600 dark:text-[#F87171]">${costFN}</span>
          </div>
          <input
            type="range"
            min={100}
            max={1500}
            step={50}
            value={costFN}
            onChange={(e) => setCostFN(Number(e.target.value))}
            className="w-full accent-[#C2553A] cursor-pointer"
          />
        </label>

        <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-secondary">Biaya FP (Salah Blokir)</span>
            <span className="font-bold text-amber-600 dark:text-[#E5B567]">${costFP}</span>
          </div>
          <input
            type="range"
            min={5}
            max={200}
            step={5}
            value={costFP}
            onChange={(e) => setCostFP(Number(e.target.value))}
            className="w-full accent-[#C2553A] cursor-pointer"
          />
        </label>
      </div>

      {/* Live Confusion Matrix + Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-surface p-3.5 space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold">
            Confusion Matrix (N = 200, Prevalensi = 10%)
          </div>
          <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
              <div className="text-[10px] text-text-tertiary">TP (Tertangkap)</div>
              <div className="text-lg font-bold text-emerald-700 dark:text-[#34D399]">{current.tp}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25">
              <div className="text-[10px] text-text-tertiary">FP (Salah Blokir)</div>
              <div className="text-lg font-bold text-amber-700 dark:text-[#E5B567]">{current.fp}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/25">
              <div className="text-[10px] text-text-tertiary">FN (Fraud Lolos)</div>
              <div className="text-lg font-bold text-rose-700 dark:text-[#F87171]">{current.fn}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-secondary border border-border">
              <div className="text-[10px] text-text-tertiary">TN (Aman)</div>
              <div className="text-lg font-bold text-text-primary">{current.tn}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono text-text-secondary">
            <span>Precision: <strong className="text-text-primary">{(current.precision * 100).toFixed(1)}%</strong></span>
            <span>•</span>
            <span>Recall: <strong className="text-text-primary">{(current.recall * 100).toFixed(1)}%</strong></span>
            <span>•</span>
            <span>F1: <strong className="text-text-primary">{current.f1.toFixed(3)}</strong></span>
          </div>
        </div>

        {/* Cost Curve */}
        <div className="rounded-xl border border-border bg-[#FAF8F5] dark:bg-[#0F0E0D] p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className="text-text-secondary">Total Kerugian Bisnis</span>
            <span className="font-bold text-brand-600 dark:text-[#E5C194]">
              Saat ini: ${current.totalCost.toLocaleString()} | Optimal (τ*={bestTau.toFixed(2)}): ${minCost.toLocaleString()}
            </span>
          </div>
          <svg viewBox="0 0 460 198" className="w-full h-auto font-mono text-[10px]">
            <line x1="42" y1="175" x2="438" y2="175" stroke="currentColor" className="text-border" />
            <line x1="42" y1="22" x2="42" y2="175" stroke="currentColor" className="text-border" />

            {/* Cost Curve */}
            <path d={costPath} fill="none" stroke="#D4664A" strokeWidth="2.4" />

            {/* Optimal marker */}
            <line x1={sx(bestTau)} y1="22" x2={sx(bestTau)} y2="175" stroke="#34D399" strokeDasharray="4 3" strokeWidth="1.4" />
            <circle cx={sx(bestTau)} cy={sy(minCost)} r="4.5" fill="#34D399" />

            {/* Current threshold marker */}
            <line x1={sx(threshold)} y1="22" x2={sx(threshold)} y2="175" stroke="#E5C194" strokeWidth="1.6" />
            <circle cx={sx(threshold)} cy={sy(current.totalCost)} r="4.5" fill="#E5C194" />

            <text x="42" y="191" fill="currentColor" className="text-text-tertiary">τ=0.05</text>
            <text x="225" y="191" fill="currentColor" className="text-text-tertiary">τ=0.50</text>
            <text x="408" y="191" fill="currentColor" className="text-text-tertiary">τ=0.95</text>
          </svg>
          <div className="text-[10.5px] font-mono text-text-tertiary mt-1">
            Teorema Elkan Bayes-Optimal τ* = C_FP / (C_FP + C_FN) = <strong className="text-emerald-600 dark:text-[#34D399]">{theoreticalTau.toFixed(3)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
