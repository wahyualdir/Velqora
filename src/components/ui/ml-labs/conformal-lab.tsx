"use client";

import React, { useMemo, useState } from "react";

// Heteroskedastic calibration (60) + test (60) points
function makeHeteroData(seed: number, n: number) {
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  const randn = () => Math.sqrt(-2 * Math.log(Math.max(1e-7, rnd()))) * Math.cos(2 * Math.PI * rnd());
  const out: Array<{ x: number; y: number; pred: number; localScale: number }> = [];
  for (let i = 0; i < n; i++) {
    const x = (i + 0.5) / n;
    const pred = 0.5 + 1.3 * x + 0.35 * Math.sin(4.5 * x);
    const localScale = 0.12 + 0.55 * x * x; // Heteroskedastic variance grows with x!
    const y = pred + randn() * localScale;
    out.push({ x, y, pred, localScale });
  }
  return out;
}

const CAL_SET = makeHeteroData(2025, 60);
const TEST_SET = makeHeteroData(2026, 60);

export function ConformalLab({ resetSignal }: { resetSignal?: number }) {
  const [alpha, setAlpha] = useState(0.1);
  const [mode, setMode] = useState<"split" | "cqr">("cqr");

  React.useEffect(() => {
    if (resetSignal) {
      setAlpha(0.1);
      setMode("cqr");
    }
  }, [resetSignal]);

  const { qHat, coveredCount, avgWidth, upperPath, lowerPath, meanPath, testStatus } = useMemo(() => {
    const nCal = CAL_SET.length;
    // Finite-sample conformal quantile level: ceil((n+1)(1-alpha))/n
    const qLevel = Math.min(1, Math.ceil((nCal + 1) * (1 - alpha)) / nCal);

    // Nonconformity scores: |y - f(x)| for Split, or normalized |y - f(x)| / sigma_hat(x) for Adaptive CQR
    const scores = CAL_SET.map((pt) => {
      const absErr = Math.abs(pt.y - pt.pred);
      return mode === "split" ? absErr : absErr / pt.localScale;
    }).sort((a, b) => a - b);

    const qIdx = Math.min(scores.length - 1, Math.max(0, Math.floor(qLevel * scores.length) - 1));
    const q = scores[qIdx];

    let covered = 0;
    let widthSum = 0;
    const statuses = TEST_SET.map((pt) => {
      const halfWidth = mode === "split" ? q : q * pt.localScale;
      const lo = pt.pred - halfWidth;
      const hi = pt.pred + halfWidth;
      const ok = pt.y >= lo && pt.y <= hi;
      if (ok) covered++;
      widthSum += 2 * halfWidth;
      return { ...pt, lo, hi, ok };
    });

    const sx = (x: number) => 42 + x * 412;
    const sy = (y: number) => 210 - (y + 0.6) * 56;

    const up = statuses.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(1)},${sy(p.hi).toFixed(1)}`).join(" ");
    const lo = statuses.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(1)},${sy(p.lo).toFixed(1)}`).join(" ");
    const mn = statuses.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(1)},${sy(p.pred).toFixed(1)}`).join(" ");

    return {
      qHat: q,
      coveredCount: covered,
      avgWidth: widthSum / TEST_SET.length,
      upperPath: up,
      lowerPath: lo,
      meanPath: mn,
      testStatus: statuses,
    };
  }, [alpha, mode]);

  const empiricalCoverage = (coveredCount / TEST_SET.length) * 100;
  const targetCoverage = (1 - alpha) * 100;
  const sx = (x: number) => 42 + x * 412;
  const sy = (y: number) => 210 - (y + 0.6) * 56;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded-xl border border-border bg-surface space-y-1.5">
          <span className="text-xs font-mono text-text-secondary block">Metode Conformal Prediction</span>
          <div className="grid grid-cols-2 gap-1.5">
            {(["split", "cqr"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                  mode === m
                    ? "bg-[#C2553A] text-white border-[#D4664A]"
                    : "bg-surface-secondary text-text-secondary border-border hover:text-text-primary"
                }`}
              >
                {m === "split" ? "Split Conformal" : "Adaptive CQR"}
              </button>
            ))}
          </div>
        </div>

        <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-secondary">Target Miscoverage (α)</span>
            <span className="font-bold text-brand-500 dark:text-[#D4664A]">
              α = {alpha.toFixed(2)} (Jaminan ≥ {targetCoverage.toFixed(0)}%)
            </span>
          </div>
          <input
            type="range"
            min={0.02}
            max={0.3}
            step={0.02}
            value={alpha}
            onChange={(e) => setAlpha(Number(e.target.value))}
            className="w-full accent-[#C2553A] cursor-pointer"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-mono">
        <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
          Target Cakupan (1−α): <strong className="text-text-primary">{targetCoverage.toFixed(1)}%</strong>
        </span>
        <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
          Cakupan Empiris Uji: <strong className="text-emerald-600 dark:text-[#34D399]">{empiricalCoverage.toFixed(1)}% ({coveredCount}/{TEST_SET.length})</strong>
        </span>
        <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
          Rata-rata Lebar Pita: <strong className="text-brand-600 dark:text-[#E5C194]">{avgWidth.toFixed(3)}</strong>
        </span>
        <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
          q̂: <strong className="text-text-primary">{qHat.toFixed(3)}</strong>
        </span>
      </div>

      <div className="rounded-xl border border-border bg-[#FAF8F5] dark:bg-[#0F0E0D] p-3 overflow-x-auto">
        <svg viewBox="0 0 480 250" className="w-full max-w-[600px] mx-auto h-auto font-mono text-[10px]">
          <line x1="42" y1="224" x2="454" y2="224" stroke="currentColor" className="text-border" />
          <line x1="42" y1="16" x2="42" y2="224" stroke="currentColor" className="text-border" />

          {/* Upper and Lower Prediction Band */}
          <path d={upperPath} fill="none" stroke="#E5C194" strokeWidth="1.6" strokeDasharray="4 3" />
          <path d={lowerPath} fill="none" stroke="#E5C194" strokeWidth="1.6" strokeDasharray="4 3" />
          <path d={meanPath} fill="none" stroke="#D4664A" strokeWidth="2.2" />

          {/* Test observations */}
          {testStatus.map((pt, i) => (
            <circle
              key={i}
              cx={sx(pt.x)}
              cy={sy(pt.y)}
              r="3.2"
              fill={pt.ok ? "#34D399" : "#F87171"}
              stroke="#141210"
              strokeWidth="0.8"
            />
          ))}

          <text x="44" y="242" fill="currentColor" className="text-text-tertiary">
            Hijau = tercakup dalam pita C(x) • Merah = miscovered • Bandingkan efisiensi Split vs Adaptive CQR
          </text>
        </svg>
      </div>
    </div>
  );
}
