"use client";

import React, { useMemo, useState } from "react";

const BOOST_X = Array.from({ length: 48 }, (_, i) => i / 47);
const BOOST_Y = BOOST_X.map((x, idx) => {
  const signal = x < 0.32 ? 0.8 * Math.sin(6 * x) : x < 0.68 ? 1.15 - 0.5 * (x - 0.32) : -0.75 + 0.9 * (x - 0.68);
  const detNoise = Math.sin(idx * 17.3) * 0.14;
  return signal + detNoise;
});

function fitStump(xs: number[], residuals: number[]): { threshold: number; leftVal: number; rightVal: number } {
  let bestLoss = Infinity;
  let bestT = 0.5;
  let bestL = 0;
  let bestR = 0;

  for (let i = 1; i < xs.length - 1; i++) {
    const t = 0.5 * (xs[i - 1] + xs[i]);
    let sumL = 0, cntL = 0, sumR = 0, cntR = 0;
    for (let j = 0; j < xs.length; j++) {
      if (xs[j] <= t) {
        sumL += residuals[j];
        cntL++;
      } else {
        sumR += residuals[j];
        cntR++;
      }
    }
    const meanL = cntL ? sumL / cntL : 0;
    const meanR = cntR ? sumR / cntR : 0;
    let loss = 0;
    for (let j = 0; j < xs.length; j++) {
      const pred = xs[j] <= t ? meanL : meanR;
      loss += (residuals[j] - pred) ** 2;
    }
    if (loss < bestLoss) {
      bestLoss = loss;
      bestT = t;
      bestL = meanL;
      bestR = meanR;
    }
  }
  return { threshold: bestT, leftVal: bestL, rightVal: bestR };
}

export function BoostingLab({ resetSignal }: { resetSignal?: number }) {
  const [nTrees, setNTrees] = useState(8);
  const [lr, setLr] = useState(0.25);

  React.useEffect(() => {
    if (resetSignal) {
      setNTrees(8);
      setLr(0.25);
    }
  }, [resetSignal]);

  const { preds, residuals, rmse, rmseHistory } = useMemo(() => {
    const meanY = BOOST_Y.reduce((a, b) => a + b, 0) / BOOST_Y.length;
    const f = BOOST_X.map(() => meanY);
    const hist: number[] = [];

    for (let m = 0; m < nTrees; m++) {
      const res = BOOST_Y.map((y, i) => y - f[i]);
      const stump = fitStump(BOOST_X, res);
      for (let i = 0; i < BOOST_X.length; i++) {
        const delta = BOOST_X[i] <= stump.threshold ? stump.leftVal : stump.rightVal;
        f[i] += lr * delta;
      }
      const mse = BOOST_Y.reduce((acc, y, i) => acc + (y - f[i]) ** 2, 0) / BOOST_Y.length;
      hist.push(Math.sqrt(mse));
    }

    const finalRes = BOOST_Y.map((y, i) => y - f[i]);
    const finalRmse = hist[hist.length - 1] ?? 0;
    return { preds: f, residuals: finalRes, rmse: finalRmse, rmseHistory: hist };
  }, [nTrees, lr]);

  const sx = (x: number) => 40 + x * 416;
  const sy = (y: number) => 130 - y * 68;

  const stepPath = preds
    .map((p, i) => `${i === 0 ? "M" : "L"}${sx(BOOST_X[i]).toFixed(1)},${sy(p).toFixed(1)}`)
    .join(" ");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-secondary">Jumlah Pohon Boosting (M)</span>
            <span className="font-bold text-brand-500 dark:text-[#D4664A]">{nTrees}</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={nTrees}
            onChange={(e) => setNTrees(Number(e.target.value))}
            className="w-full accent-[#C2553A] cursor-pointer"
          />
        </label>

        <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-secondary">Shrinkage / Learning Rate (η)</span>
            <span className="font-bold text-brand-500 dark:text-[#E5C194]">{lr.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.05}
            max={0.85}
            step={0.05}
            value={lr}
            onChange={(e) => setLr(Number(e.target.value))}
            className="w-full accent-[#C2553A] cursor-pointer"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-mono">
        <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
          Ensemble RMSE (M={nTrees}): <strong className="text-emerald-600 dark:text-[#34D399]">{rmse.toFixed(4)}</strong>
        </span>
        <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
          Max |Residual|: <strong className="text-brand-600 dark:text-[#E5C194]">{Math.max(...residuals.map(Math.abs)).toFixed(3)}</strong>
        </span>
        <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
          RMSE Awal (M=1): <strong className="text-text-primary">{(rmseHistory[0] ?? 0).toFixed(4)}</strong>
        </span>
      </div>

      <div className="rounded-xl border border-border bg-[#FAF8F5] dark:bg-[#0F0E0D] p-3 overflow-x-auto">
        <svg viewBox="0 0 480 250" className="w-full max-w-[600px] mx-auto h-auto font-mono text-[10px]">
          <line x1="40" y1="130" x2="456" y2="130" stroke="currentColor" className="text-border" strokeDasharray="3 3" />
          <line x1="40" y1="22" x2="40" y2="230" stroke="currentColor" className="text-text-tertiary" />

          {/* Residual Vertical Stems */}
          {BOOST_X.map((x, i) => (
            <line
              key={`r-${i}`}
              x1={sx(x)}
              y1={sy(BOOST_Y[i])}
              x2={sx(x)}
              y2={sy(preds[i])}
              stroke="#E5C194"
              strokeWidth="1.1"
              opacity="0.6"
            />
          ))}

          {/* Observed points */}
          {BOOST_X.map((x, i) => (
            <circle key={`p-${i}`} cx={sx(x)} cy={sy(BOOST_Y[i])} r="3.2" fill="#34D399" />
          ))}

          {/* Boosted ensemble prediction */}
          <path d={stepPath} fill="none" stroke="#D4664A" strokeWidth="2.6" />

          <text x="48" y="242" fill="currentColor" className="text-text-tertiary">
            Titik hijau = target y • Garis terracotta = F_M(x) • Batang emas = residual (y − F_M(x))
          </text>
        </svg>
      </div>
    </div>
  );
}
