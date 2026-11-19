"use client";

import React, { useMemo, useState } from "react";

interface DataPt {
  x: number;
  y: number;
  cls: -1 | 1;
}

const SVM_POINTS: DataPt[] = [
  // Class -1 (inner cluster + 1 mild outlier)
  { x: -1.4, y: -0.9, cls: -1 },
  { x: -1.1, y: 0.4, cls: -1 },
  { x: -0.8, y: -1.2, cls: -1 },
  { x: -0.6, y: -0.3, cls: -1 },
  { x: -0.5, y: 0.7, cls: -1 },
  { x: -0.2, y: -0.8, cls: -1 },
  { x: -0.1, y: 0.1, cls: -1 },
  { x: 0.25, y: -0.15, cls: -1 },
  // Class +1 (surrounding arc)
  { x: 0.8, y: 1.1, cls: 1 },
  { x: 1.2, y: 0.5, cls: 1 },
  { x: 1.35, y: -0.4, cls: 1 },
  { x: 0.9, y: -1.15, cls: 1 },
  { x: 0.4, y: 1.25, cls: 1 },
  { x: -0.35, y: 1.35, cls: 1 },
  { x: 1.55, y: 0.9, cls: 1 },
  { x: 0.65, y: 0.25, cls: 1 },
];

export function SvmKernelLab({ resetSignal }: { resetSignal?: number }) {
  const [kernel, setKernel] = useState<"rbf" | "linear">("rbf");
  const [cParam, setCParam] = useState(2.0);
  const [gamma, setGamma] = useState(0.8);

  React.useEffect(() => {
    if (resetSignal) {
      setKernel("rbf");
      setCParam(2.0);
      setGamma(0.8);
    }
  }, [resetSignal]);

  const { alphas, bias, gridCells, svIndices, acc } = useMemo(() => {
    const n = SVM_POINTS.length;
    const K = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      if (kernel === "linear") return a.x * b.x + a.y * b.y;
      const d2 = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
      return Math.exp(-gamma * d2);
    };

    // Lightweight deterministic projected dual ascent (SMO-style coordinate updates)
    const a = new Array(n).fill(0);
    let b = 0;
    const gram: number[][] = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => K(SVM_POINTS[i], SVM_POINTS[j]))
    );

    const lr = 0.08;
    for (let epoch = 0; epoch < 90; epoch++) {
      for (let i = 0; i < n; i++) {
        let f = b;
        for (let j = 0; j < n; j++) f += a[j] * SVM_POINTS[j].cls * gram[j][i];
        const margin = SVM_POINTS[i].cls * f;
        if (margin < 1) {
          a[i] = Math.min(cParam, a[i] + lr * (1 - margin));
          b += lr * 0.25 * SVM_POINTS[i].cls;
        } else {
          a[i] = Math.max(0, a[i] * 0.985);
        }
      }
    }

    const decision = (x: number, y: number) => {
      let f = b;
      for (let j = 0; j < n; j++) {
        if (a[j] > 1e-4) f += a[j] * SVM_POINTS[j].cls * K(SVM_POINTS[j], { x, y });
      }
      return f;
    };

    const sv: number[] = [];
    let correct = 0;
    for (let i = 0; i < n; i++) {
      const score = decision(SVM_POINTS[i].x, SVM_POINTS[i].y);
      if (score * SVM_POINTS[i].cls > 0) correct++;
      if (a[i] > 0.08) sv.push(i);
    }

    const cols = 26;
    const rows = 16;
    const cells: Array<{ gx: number; gy: number; score: number }> = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = -2.0 + ((c + 0.5) / cols) * 4.0;
        const y = 1.7 - ((r + 0.5) / rows) * 3.4;
        cells.push({ gx: c, gy: r, score: decision(x, y) });
      }
    }

    return {
      alphas: a,
      bias: b,
      gridCells: cells,
      svIndices: new Set(sv),
      acc: (correct / n) * 100,
    };
  }, [kernel, cParam, gamma]);

  const sx = (x: number) => 24 + ((x + 2.0) / 4.0) * 432;
  const sy = (y: number) => 16 + ((1.7 - y) / 3.4) * 238;
  const cw = 432 / 26;
  const ch = 238 / 16;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl border border-border bg-surface space-y-1.5">
          <span className="text-xs font-mono text-text-secondary block">Fungsi Kernel</span>
          <div className="grid grid-cols-2 gap-1.5">
            {(["linear", "rbf"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKernel(k)}
                className={`py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                  kernel === k
                    ? "bg-[#C2553A] text-white border-[#D4664A]"
                    : "bg-surface-secondary text-text-secondary border-border hover:text-text-primary"
                }`}
              >
                {k === "linear" ? "Linear" : "RBF (Gaussian)"}
              </button>
            ))}
          </div>
        </div>

        <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-secondary">Regularisasi (C)</span>
            <span className="font-bold text-brand-500 dark:text-[#D4664A]">{cParam.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={10}
            step={0.2}
            value={cParam}
            onChange={(e) => setCParam(Number(e.target.value))}
            className="w-full accent-[#C2553A] cursor-pointer"
          />
        </label>

        <label className={`p-3 rounded-xl border border-border bg-surface space-y-1.5 block ${kernel === "linear" ? "opacity-50" : ""}`}>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-secondary">RBF Bandwidth (γ)</span>
            <span className="font-bold text-brand-500 dark:text-[#E5C194]">{gamma.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={4.0}
            step={0.1}
            disabled={kernel === "linear"}
            value={gamma}
            onChange={(e) => setGamma(Number(e.target.value))}
            className="w-full accent-[#C2553A] cursor-pointer"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-mono">
        <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
          Support Vectors: <strong className="text-brand-600 dark:text-[#E5C194]">{svIndices.size} / {SVM_POINTS.length}</strong>
        </span>
        <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
          Akurasi Latih: <strong className="text-emerald-600 dark:text-[#34D399]">{acc.toFixed(1)}%</strong>
        </span>
        <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
          Bias b: <strong className="text-text-primary">{bias.toFixed(2)}</strong>
        </span>
        <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
          ∑αᵢ: <strong className="text-text-primary">{alphas.reduce((a, b) => a + b, 0).toFixed(2)}</strong>
        </span>
      </div>

      <div className="rounded-xl border border-border bg-[#FAF8F5] dark:bg-[#0F0E0D] p-3 overflow-x-auto">
        <svg viewBox="0 0 480 272" className="w-full max-w-[600px] mx-auto h-auto font-mono text-[10px]">
          {gridCells.map((cell, idx) => {
            const absS = Math.min(1, Math.abs(cell.score));
            const isMargin = Math.abs(cell.score) < 0.25;
            const fill = isMargin
              ? "rgba(229, 193, 148, 0.24)"
              : cell.score > 0
              ? `rgba(52, 211, 153, ${0.08 + absS * 0.24})`
              : `rgba(212, 102, 74, ${0.08 + absS * 0.24})`;
            return (
              <rect
                key={idx}
                x={24 + cell.gx * cw}
                y={16 + cell.gy * ch}
                width={cw + 0.5}
                height={ch + 0.5}
                fill={fill}
              />
            );
          })}

          {SVM_POINTS.map((pt, i) => {
            const isSV = svIndices.has(i);
            return (
              <g key={i}>
                {isSV && (
                  <circle
                    cx={sx(pt.x)}
                    cy={sy(pt.y)}
                    r="8.5"
                    fill="none"
                    stroke="#E5C194"
                    strokeWidth="1.6"
                    strokeDasharray="2 2"
                  />
                )}
                <circle
                  cx={sx(pt.x)}
                  cy={sy(pt.y)}
                  r="4.8"
                  fill={pt.cls === 1 ? "#34D399" : "#D4664A"}
                  stroke="#141210"
                  strokeWidth="1.2"
                />
              </g>
            );
          })}

          <text x="26" y="266" fill="currentColor" className="text-text-tertiary">
            Lingkaran putus-putus emas = Support Vectors (αᵢ &gt; 0) • Pita terang = zona batas margin
          </text>
        </svg>
      </div>
    </div>
  );
}
