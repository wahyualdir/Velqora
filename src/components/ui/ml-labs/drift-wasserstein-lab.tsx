"use client";

import React, { useMemo, useState } from "react";

// Standard normal PDF & CDF approximation (Abramowitz & Stegun 7.1.26)
function normPdf(x: number, mu: number, sd: number): number {
  const z = (x - mu) / sd;
  return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
}

function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t) * Math.exp(-ax * ax);
  return sign * y;
}

function normCdf(x: number, mu: number, sd: number): number {
  return 0.5 * (1 + erf((x - mu) / (sd * Math.SQRT2)));
}

export function DriftWassersteinLab({ resetSignal }: { resetSignal?: number }) {
  const [meanShift, setMeanShift] = useState(0.1);
  const [stdScale, setStdScale] = useState(1.0);
  const [sampleN, setSampleN] = useState(25000);

  React.useEffect(() => {
    if (resetSignal) {
      setMeanShift(0.1);
      setStdScale(1.0);
      setSampleN(25000);
    }
  }, [resetSignal]);

  const { ksStat, ksPVal, wasserstein1, psi, trainPath, prodPath } = useMemo(() => {
    const minX = -4.5;
    const maxX = 6.0;
    const steps = 210;
    const dx = (maxX - minX) / steps;

    let maxDiff = 0;
    let w1 = 0;
    for (let i = 0; i <= steps; i++) {
      const x = minX + i * dx;
      const fp = normCdf(x, 0, 1);
      const fq = normCdf(x, meanShift, stdScale);
      const diff = Math.abs(fp - fq);
      if (diff > maxDiff) maxDiff = diff;
      w1 += diff * dx;
    }

    // Two-sample asymptotic Kolmogorov p-value approximation: 2 * exp(-2 * N_eff * D^2)
    const nEff = sampleN / 2;
    const lambdaKs = Math.sqrt(nEff) * maxDiff;
    const pVal = Math.min(1, 2 * Math.exp(-2 * lambdaKs * lambdaKs));

    // PSI across 10 quantile bins of reference N(0,1)
    const edges = [-4.5, -1.28, -0.84, -0.52, -0.25, 0, 0.25, 0.52, 0.84, 1.28, 6.0];
    let psiAcc = 0;
    for (let b = 0; b < edges.length - 1; b++) {
      const p = Math.max(1e-5, normCdf(edges[b + 1], 0, 1) - normCdf(edges[b], 0, 1));
      const q = Math.max(1e-5, normCdf(edges[b + 1], meanShift, stdScale) - normCdf(edges[b], meanShift, stdScale));
      psiAcc += (q - p) * Math.log(q / p);
    }

    const sx = (x: number) => 34 + ((x - minX) / (maxX - minX)) * 422;
    const sy = (pdf: number) => 205 - pdf * 380;

    const tPts: string[] = [];
    const pPts: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const x = minX + (i / 120) * (maxX - minX);
      tPts.push(`${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${sy(normPdf(x, 0, 1)).toFixed(1)}`);
      pPts.push(`${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${sy(normPdf(x, meanShift, stdScale)).toFixed(1)}`);
    }

    return {
      ksStat: maxDiff,
      ksPVal: pVal,
      wasserstein1: w1,
      psi: psiAcc,
      trainPath: tPts.join(" "),
      prodPath: pPts.join(" "),
    };
  }, [meanShift, stdScale, sampleN]);

  const ksAlert = ksPVal < 0.01;
  const w1Alert = wasserstein1 > 0.25;
  const psiAlert = psi > 0.2;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-secondary">Mean Shift (Δμ)</span>
            <span className="font-bold text-brand-500 dark:text-[#D4664A]">{meanShift.toFixed(2)}σ</span>
          </div>
          <input
            type="range"
            min={-1.5}
            max={2.0}
            step={0.05}
            value={meanShift}
            onChange={(e) => setMeanShift(Number(e.target.value))}
            className="w-full accent-[#C2553A] cursor-pointer"
          />
        </label>

        <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-secondary">Skala Varians (σ_prod)</span>
            <span className="font-bold text-brand-500 dark:text-[#E5C194]">{stdScale.toFixed(2)}×</span>
          </div>
          <input
            type="range"
            min={0.6}
            max={2.2}
            step={0.1}
            value={stdScale}
            onChange={(e) => setStdScale(Number(e.target.value))}
            className="w-full accent-[#C2553A] cursor-pointer"
          />
        </label>

        <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-secondary">Ukuran Sampel (N)</span>
            <span className="font-bold text-text-primary">{sampleN.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={200}
            max={50000}
            step={200}
            value={sampleN}
            onChange={(e) => setSampleN(Number(e.target.value))}
            className="w-full accent-[#C2553A] cursor-pointer"
          />
        </label>
      </div>

      {/* 3 Metric Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
        <div className={`p-3 rounded-xl border ${ksAlert ? "border-rose-500/40 bg-rose-500/10" : "border-border bg-surface"}`}>
          <div className="text-[10px] uppercase text-text-tertiary">KS-Test (p &lt; 0.01)</div>
          <div className="text-sm font-bold text-text-primary mt-0.5">
            D = {ksStat.toFixed(3)} • p = {ksPVal < 0.0001 ? "<1e-4" : ksPVal.toFixed(4)}
          </div>
          <div className={`text-[10.5px] font-semibold mt-1 ${ksAlert ? "text-rose-600 dark:text-[#F87171]" : "text-emerald-600 dark:text-[#34D399]"}`}>
            {ksAlert ? "⚠ ALERT (Sensitif N Besar!)" : "✓ Normal"}
          </div>
        </div>

        <div className={`p-3 rounded-xl border ${w1Alert ? "border-amber-500/40 bg-amber-500/10" : "border-border bg-surface"}`}>
          <div className="text-[10px] uppercase text-text-tertiary">Wasserstein W₁ (&gt; 0.25)</div>
          <div className="text-sm font-bold text-brand-600 dark:text-[#E5C194] mt-0.5">W₁ = {wasserstein1.toFixed(3)} unit</div>
          <div className={`text-[10.5px] font-semibold mt-1 ${w1Alert ? "text-amber-600 dark:text-[#E5B567]" : "text-emerald-600 dark:text-[#34D399]"}`}>
            {w1Alert ? "⚠ Drift Signifikan Fisik" : "✓ Stabil & Invarian N"}
          </div>
        </div>

        <div className={`p-3 rounded-xl border ${psiAlert ? "border-amber-500/40 bg-amber-500/10" : "border-border bg-surface"}`}>
          <div className="text-[10px] uppercase text-text-tertiary">PSI (&gt; 0.20)</div>
          <div className="text-sm font-bold text-text-primary mt-0.5">PSI = {psi.toFixed(3)}</div>
          <div className={`text-[10.5px] font-semibold mt-1 ${psiAlert ? "text-amber-600 dark:text-[#E5B567]" : "text-emerald-600 dark:text-[#34D399]"}`}>
            {psiAlert ? "⚠ Pergeseran Besar" : psi > 0.1 ? "• Moderat (0.1–0.2)" : "✓ Stabil (<0.1)"}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-[#FAF8F5] dark:bg-[#0F0E0D] p-3 overflow-x-auto">
        <svg viewBox="0 0 480 232" className="w-full max-w-[600px] mx-auto h-auto font-mono text-[10px]">
          <line x1="34" y1="205" x2="456" y2="205" stroke="currentColor" className="text-border" />
          <path d={trainPath} fill="rgba(52, 211, 153, 0.14)" stroke="#34D399" strokeWidth="2.2" />
          <path d={prodPath} fill="rgba(212, 102, 74, 0.16)" stroke="#D4664A" strokeWidth="2.4" />

          <g transform="translate(36, 20)">
            <line x1="0" y1="0" x2="16" y2="0" stroke="#34D399" strokeWidth="2.2" />
            <text x="22" y="3" fill="currentColor" className="text-text-secondary">Referensi Latih N(0, 1)</text>
            <line x1="186" y1="0" x2="202" y2="0" stroke="#D4664A" strokeWidth="2.4" />
            <text x="208" y="3" fill="currentColor" className="text-text-primary">Produksi N({meanShift.toFixed(2)}, {stdScale.toFixed(1)}²)</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
