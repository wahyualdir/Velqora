"use client";

import React, { useMemo, useState } from "react";

interface Point {
  x: number;
  y: number;
}

// Deterministic seeded pseudo-random generator (LCG) for reproducible lab data
function createRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function trueFn(x: number): number {
  return Math.sin(1.7 * Math.PI * x) + 0.25 * Math.cos(3.0 * Math.PI * x);
}

// Solve linear system A w = b using Gaussian elimination with partial pivoting
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let pivotRow = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivotRow][col])) {
        pivotRow = r;
      }
    }
    if (pivotRow !== col) {
      [M[col], M[pivotRow]] = [M[pivotRow], M[col]];
    }
    const pivot = Math.abs(M[col][col]) < 1e-12 ? 1e-12 : M[col][col];
    for (let j = col; j <= n; j++) M[col][j] /= pivot;
    for (let r = 0; r < n; r++) {
      if (r !== col) {
        const factor = M[r][col];
        for (let j = col; j <= n; j++) M[r][j] -= factor * M[col][j];
      }
    }
  }
  return M.map((row) => row[n]);
}

function fitPolyRidge(points: Point[], degree: number, lambda: number): number[] {
  const p = degree + 1;
  const XtX: number[][] = Array.from({ length: p }, () => Array(p).fill(0));
  const Xty: number[] = Array(p).fill(0);

  for (const pt of points) {
    // Map x in [0, 1] -> [-1, 1] for numerical conditioning
    const z = 2 * pt.x - 1;
    const powers: number[] = [1];
    for (let k = 1; k < p; k++) powers.push(powers[k - 1] * z);

    for (let i = 0; i < p; i++) {
      Xty[i] += powers[i] * pt.y;
      for (let j = 0; j < p; j++) {
        XtX[i][j] += powers[i] * powers[j];
      }
    }
  }
  // Do not penalize intercept (i = 0)
  for (let i = 1; i < p; i++) {
    XtX[i][i] += lambda;
  }
  XtX[0][0] += 1e-9;

  return solveLinearSystem(XtX, Xty);
}

function predictPoly(weights: number[], x: number): number {
  const z = 2 * x - 1;
  let acc = 0;
  let zp = 1;
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i] * zp;
    zp *= z;
  }
  return Math.max(-4, Math.min(4, acc));
}

export function BiasVarianceLab({ resetSignal }: { resetSignal?: number }) {
  const [degree, setDegree] = useState(4);
  const [logLambda, setLogLambda] = useState(-4); // 10^-4
  const [noiseStd, setNoiseStd] = useState(0.25);

  React.useEffect(() => {
    if (resetSignal) {
      setDegree(4);
      setLogLambda(-4);
      setNoiseStd(0.25);
    }
  }, [resetSignal]);

  const lambda = useMemo(() => (logLambda <= -7 ? 0 : Math.pow(10, logLambda)), [logLambda]);

  const { trainPts, testPts, weights, trainMse, testMse, l2Norm, curvePath, truthPath } = useMemo(() => {
    const rng = createRng(42);
    const randn = () => {
      const u1 = Math.max(1e-7, rng());
      const u2 = rng();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    };

    const train: Point[] = [];
    for (let i = 0; i < 18; i++) {
      const x = (i + 0.35 + (rng() - 0.5) * 0.35) / 18;
      const xc = Math.max(0.02, Math.min(0.98, x));
      train.push({ x: xc, y: trueFn(xc) + randn() * noiseStd });
    }

    const test: Point[] = [];
    for (let i = 0; i < 40; i++) {
      const x = 0.02 + (0.96 * i) / 39;
      test.push({ x, y: trueFn(x) + randn() * noiseStd });
    }

    const w = fitPolyRidge(train, degree, lambda);
    const trErr = train.reduce((acc, pt) => acc + Math.pow(pt.y - predictPoly(w, pt.x), 2), 0) / train.length;
    const teErr = test.reduce((acc, pt) => acc + Math.pow(pt.y - predictPoly(w, pt.x), 2), 0) / test.length;
    const norm = Math.sqrt(w.slice(1).reduce((s, v) => s + v * v, 0));

    const sx = (x: number) => 44 + x * 412;
    const sy = (y: number) => 145 - y * 62;

    const samples = 100;
    const cPts: string[] = [];
    const tPts: string[] = [];
    for (let i = 0; i <= samples; i++) {
      const x = i / samples;
      const yp = predictPoly(w, x);
      const yt = trueFn(x);
      cPts.push(`${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${sy(yp).toFixed(1)}`);
      tPts.push(`${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${sy(yt).toFixed(1)}`);
    }

    return {
      trainPts: train,
      testPts: test,
      weights: w,
      trainMse: trErr,
      testMse: teErr,
      l2Norm: norm,
      curvePath: cPts.join(" "),
      truthPath: tPts.join(" "),
    };
  }, [degree, lambda, noiseStd]);

  const regime =
    degree <= 2
      ? { label: "Underfitting (High Bias)", color: "text-amber-600 dark:text-[#E5B567] bg-amber-500/10 border-amber-500/30" }
      : testMse > trainMse * 2.3 && testMse > 0.22
      ? { label: "Overfitting (High Variance)", color: "text-rose-600 dark:text-[#F87171] bg-rose-500/10 border-rose-500/30" }
      : { label: "Generalisasi Seimbang", color: "text-emerald-700 dark:text-[#34D399] bg-emerald-500/10 border-emerald-500/30" };

  const sx = (x: number) => 44 + x * 412;
  const sy = (y: number) => 145 - Math.max(-2.1, Math.min(2.1, y)) * 62;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-secondary">Derajat Polinomial (d)</span>
            <span className="font-bold text-brand-500 dark:text-[#D4664A]">{degree}</span>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={degree}
            onChange={(e) => setDegree(Number(e.target.value))}
            className="w-full accent-[#C2553A] cursor-pointer"
          />
        </label>

        <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-secondary">Penalti Ridge (λ)</span>
            <span className="font-bold text-brand-500 dark:text-[#E5C194]">
              {lambda === 0 ? "0 (OLS)" : `10^${logLambda}`}
            </span>
          </div>
          <input
            type="range"
            min={-7}
            max={1}
            step={0.5}
            value={logLambda}
            onChange={(e) => setLogLambda(Number(e.target.value))}
            className="w-full accent-[#C2553A] cursor-pointer"
          />
        </label>

        <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-secondary">Noise Observasi (σ)</span>
            <span className="font-bold text-text-primary">{noiseStd.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.05}
            max={0.6}
            step={0.05}
            value={noiseStd}
            onChange={(e) => setNoiseStd(Number(e.target.value))}
            className="w-full accent-[#C2553A] cursor-pointer"
          />
        </label>
      </div>

      {/* Telemetry Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
            Train MSE: <strong className="text-text-primary">{trainMse.toFixed(4)}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
            Test MSE: <strong className="text-brand-600 dark:text-[#E5C194]">{testMse.toFixed(4)}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
            ‖w‖₂: <strong className="text-text-primary">{l2Norm > 999 ? ">999" : l2Norm.toFixed(2)}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
            Params: <strong className="text-text-primary">{weights.length}</strong>
          </span>
        </div>
        <span className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold ${regime.color}`}>
          {regime.label}
        </span>
      </div>

      {/* SVG Plot */}
      <div className="rounded-xl border border-border bg-[#FAF8F5] dark:bg-[#0F0E0D] p-3 overflow-x-auto">
        <svg viewBox="0 0 480 280" className="w-full max-w-[600px] mx-auto h-auto font-mono text-[10px]">
          {/* Grid */}
          {[45, 95, 145, 195, 245].map((y) => (
            <line key={y} x1="44" y1={y} x2="456" y2={y} stroke="currentColor" className="text-border" strokeDasharray="3 3" />
          ))}
          {[44, 147, 250, 353, 456].map((x) => (
            <line key={x} x1={x} y1="22" x2={x} y2="255" stroke="currentColor" className="text-border" strokeDasharray="3 3" />
          ))}

          {/* Axes */}
          <line x1="44" y1="255" x2="456" y2="255" stroke="currentColor" className="text-text-tertiary" strokeWidth="1.2" />
          <line x1="44" y1="22" x2="44" y2="255" stroke="currentColor" className="text-text-tertiary" strokeWidth="1.2" />

          {/* Ground Truth Curve */}
          <path d={truthPath} fill="none" stroke="#8C857F" strokeWidth="1.8" strokeDasharray="5 4" />

          {/* Held-out Test Points (subtle) */}
          {testPts.map((pt, i) => (
            <circle key={`te-${i}`} cx={sx(pt.x)} cy={sy(pt.y)} r="2.3" fill="#E5C194" opacity="0.45" />
          ))}

          {/* Training Points */}
          {trainPts.map((pt, i) => (
            <circle key={`tr-${i}`} cx={sx(pt.x)} cy={sy(pt.y)} r="4" fill="#34D399" stroke="#141210" strokeWidth="1" />
          ))}

          {/* Fitted Curve */}
          <path d={curvePath} fill="none" stroke="#D4664A" strokeWidth="2.6" strokeLinecap="round" />

          {/* Legend */}
          <g transform="translate(56, 30)">
            <line x1="0" y1="0" x2="16" y2="0" stroke="#8C857F" strokeWidth="1.8" strokeDasharray="4 3" />
            <text x="22" y="3" fill="currentColor" className="text-text-secondary">True f*(x)</text>
            <line x1="92" y1="0" x2="108" y2="0" stroke="#D4664A" strokeWidth="2.6" />
            <text x="114" y="3" fill="currentColor" className="text-text-primary">Fit f̂(x)</text>
            <circle cx="174" cy="0" r="3.5" fill="#34D399" />
            <text x="182" y="3" fill="currentColor" className="text-text-secondary">Train (18)</text>
            <circle cx="256" cy="0" r="2.5" fill="#E5C194" opacity="0.7" />
            <text x="264" y="3" fill="currentColor" className="text-text-secondary">Test (40)</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
