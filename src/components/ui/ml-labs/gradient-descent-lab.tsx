"use client";

import React, { useMemo, useState } from "react";

// Ill-conditioned anisotropic quadratic bowl: f(x, y) = 0.5*x^2 + 4.5*y^2 (condition number kappa = 9)
function lossFn(x: number, y: number): number {
  return 0.5 * x * x + 4.5 * y * y;
}

export function GradientDescentLab({ resetSignal }: { resetSignal?: number }) {
  const [lr, setLr] = useState(0.16);
  const [momentum, setMomentum] = useState(0.65);
  const [steps, setSteps] = useState(24);

  React.useEffect(() => {
    if (resetSignal) {
      setLr(0.16);
      setMomentum(0.65);
      setSteps(24);
    }
  }, [resetSignal]);

  const { gdPath, momPath, gdFinal, momFinal, diverged } = useMemo(() => {
    const startX = -3.3;
    const startY = 1.25;

    // Pure GD
    const gdPts: Array<{ x: number; y: number; loss: number }> = [{ x: startX, y: startY, loss: lossFn(startX, startY) }];
    let gx = startX;
    let gy = startY;
    let isDiv = false;

    for (let t = 0; t < steps; t++) {
      const dx = gx;
      const dy = 9.0 * gy;
      gx = gx - lr * dx;
      gy = gy - lr * dy;
      if (Math.abs(gx) > 8 || Math.abs(gy) > 8 || !Number.isFinite(gx)) {
        isDiv = true;
        break;
      }
      gdPts.push({ x: gx, y: gy, loss: lossFn(gx, gy) });
    }

    // Momentum GD
    const mPts: Array<{ x: number; y: number; loss: number }> = [{ x: startX, y: startY, loss: lossFn(startX, startY) }];
    let mx = startX;
    let my = startY;
    let vx = 0;
    let vy = 0;
    for (let t = 0; t < steps; t++) {
      const dx = mx;
      const dy = 9.0 * my;
      vx = momentum * vx + dx;
      vy = momentum * vy + dy;
      mx = mx - lr * vx;
      my = my - lr * vy;
      if (Math.abs(mx) > 8 || Math.abs(my) > 8 || !Number.isFinite(mx)) break;
      mPts.push({ x: mx, y: my, loss: lossFn(mx, my) });
    }

    return {
      gdPath: gdPts,
      momPath: mPts,
      gdFinal: gdPts[gdPts.length - 1],
      momFinal: mPts[mPts.length - 1],
      diverged: isDiv,
    };
  }, [lr, momentum, steps]);

  const sx = (x: number) => 240 + x * 58;
  const sy = (y: number) => 130 - y * 68;

  const toPolyline = (pts: Array<{ x: number; y: number }>) =>
    pts.map((p) => `${sx(Math.max(-3.9, Math.min(3.9, p.x))).toFixed(1)},${sy(Math.max(-1.8, Math.min(1.8, p.y))).toFixed(1)}`).join(" ");

  const contourLevels = [0.4, 1.4, 3.2, 6.0, 9.8];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-secondary">Learning Rate (η)</span>
            <span className="font-bold text-brand-500 dark:text-[#D4664A]">{lr.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.02}
            max={0.25}
            step={0.01}
            value={lr}
            onChange={(e) => setLr(Number(e.target.value))}
            className="w-full accent-[#C2553A] cursor-pointer"
          />
          <span className="text-[10px] font-mono text-text-tertiary block">Batas stabil GD: η &lt; 2/λ_max = 0.222</span>
        </label>

        <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-secondary">Momentum (β)</span>
            <span className="font-bold text-emerald-600 dark:text-[#34D399]">{momentum.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={0.92}
            step={0.04}
            value={momentum}
            onChange={(e) => setMomentum(Number(e.target.value))}
            className="w-full accent-[#34D399] cursor-pointer"
          />
        </label>

        <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-text-secondary">Iterasi (T)</span>
            <span className="font-bold text-text-primary">{steps}</span>
          </div>
          <input
            type="range"
            min={5}
            max={40}
            step={1}
            value={steps}
            onChange={(e) => setSteps(Number(e.target.value))}
            className="w-full accent-[#C2553A] cursor-pointer"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
            Loss GD Murni: <strong className="text-brand-600 dark:text-[#D4664A]">{diverged ? "DIVERGEN (∞)" : gdFinal.loss.toFixed(4)}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
            Loss + Momentum: <strong className="text-emerald-600 dark:text-[#34D399]">{momFinal.loss.toFixed(4)}</strong>
          </span>
        </div>
        <span className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold ${
          diverged
            ? "text-rose-600 dark:text-[#F87171] bg-rose-500/10 border-rose-500/30"
            : "text-emerald-700 dark:text-[#34D399] bg-emerald-500/10 border-emerald-500/30"
        }`}>
          {diverged ? "Divergensi (η > 2/L)" : "Konvergensi Terkendali"}
        </span>
      </div>

      <div className="rounded-xl border border-border bg-[#FAF8F5] dark:bg-[#0F0E0D] p-3 overflow-x-auto">
        <svg viewBox="0 0 480 260" className="w-full max-w-[600px] mx-auto h-auto font-mono text-[10px]">
          {/* Elliptical Loss Contours */}
          {contourLevels.map((lvl, idx) => (
            <ellipse
              key={lvl}
              cx={sx(0)}
              cy={sy(0)}
              rx={Math.sqrt(2 * lvl) * 58}
              ry={Math.sqrt((2 * lvl) / 9) * 68}
              fill="none"
              stroke="currentColor"
              className="text-border"
              strokeWidth={idx === 0 ? 1.4 : 1}
              strokeDasharray={idx % 2 === 0 ? undefined : "3 3"}
            />
          ))}

          {/* Global Minimum Star */}
          <circle cx={sx(0)} cy={sy(0)} r="4.5" fill="#E5C194" />
          <text x={sx(0) + 8} y={sy(0) + 3} fill="#E5C194" fontWeight="bold">θ* (0, 0)</text>

          {/* Pure GD Trajectory */}
          <polyline fill="none" stroke="#D4664A" strokeWidth="2.2" points={toPolyline(gdPath)} />
          {gdPath.slice(0, 15).map((p, idx) => (
            <circle key={`gd-${idx}`} cx={sx(Math.max(-3.9, Math.min(3.9, p.x)))} cy={sy(Math.max(-1.8, Math.min(1.8, p.y)))} r="2.6" fill="#D4664A" />
          ))}

          {/* Momentum Trajectory */}
          <polyline fill="none" stroke="#34D399" strokeWidth="2.2" points={toPolyline(momPath)} />
          {momPath.slice(0, 15).map((p, idx) => (
            <circle key={`m-${idx}`} cx={sx(Math.max(-3.9, Math.min(3.9, p.x)))} cy={sy(Math.max(-1.8, Math.min(1.8, p.y)))} r="2.6" fill="#34D399" />
          ))}

          {/* Start Point */}
          <circle cx={sx(-3.3)} cy={sy(1.25)} r="4.5" fill="#F5F5F4" stroke="#141210" strokeWidth="1.2" />
          <text x={sx(-3.3) - 10} y={sy(1.25) - 9} fill="currentColor" className="text-text-secondary">Start</text>

          {/* Legend */}
          <g transform="translate(18, 240)">
            <line x1="0" y1="0" x2="18" y2="0" stroke="#D4664A" strokeWidth="2.2" />
            <text x="24" y="3" fill="currentColor" className="text-text-secondary">GD Murni (zig-zag)</text>
            <line x1="168" y1="0" x2="186" y2="0" stroke="#34D399" strokeWidth="2.2" />
            <text x="192" y="3" fill="currentColor" className="text-text-primary">GD + Momentum (β={momentum.toFixed(2)})</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
