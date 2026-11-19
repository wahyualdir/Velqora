"use client";

import React, { useMemo, useState } from "react";

interface Pt2D {
  x: number;
  y: number;
}

// Deterministic two-moons + 4 outliers dataset
const MOON_POINTS: Pt2D[] = (() => {
  const pts: Pt2D[] = [];
  for (let i = 0; i < 26; i++) {
    const t = (Math.PI * i) / 25;
    const jitter = Math.sin(i * 11.7) * 0.08;
    pts.push({ x: Math.cos(t) + jitter, y: Math.sin(t) + Math.cos(i * 7.3) * 0.08 });
  }
  for (let i = 0; i < 26; i++) {
    const t = (Math.PI * i) / 25;
    const jitter = Math.cos(i * 13.1) * 0.08;
    pts.push({ x: 1.0 - Math.cos(t) + jitter, y: 0.45 - Math.sin(t) + Math.sin(i * 9.1) * 0.08 });
  }
  // 4 outliers
  pts.push({ x: -1.15, y: -0.65 }, { x: 2.15, y: 1.05 }, { x: 0.5, y: 1.48 }, { x: 1.85, y: -0.9 });
  return pts;
})();

const CLUSTER_COLORS = ["#D4664A", "#34D399", "#E5C194", "#60A5FA", "#C084FC", "#F472B6"];

export function ClusteringLab({ resetSignal }: { resetSignal?: number }) {
  const [algo, setAlgo] = useState<"dbscan" | "kmeans">("dbscan");
  const [kClusters, setKClusters] = useState(2);
  const [eps, setEps] = useState(0.42);
  const [minPts, setMinPts] = useState(3);

  React.useEffect(() => {
    if (resetSignal) {
      setAlgo("dbscan");
      setKClusters(2);
      setEps(0.42);
      setMinPts(3);
    }
  }, [resetSignal]);

  const { labels, numClusters, noiseCount } = useMemo(() => {
    const n = MOON_POINTS.length;
    const dist = (a: Pt2D, b: Pt2D) => Math.hypot(a.x - b.x, a.y - b.y);

    if (algo === "kmeans") {
      const centroids: Pt2D[] = [];
      for (let k = 0; k < kClusters; k++) {
        centroids.push({ ...MOON_POINTS[(k * 11) % n] });
      }
      const lbl = new Array(n).fill(0);
      for (let iter = 0; iter < 15; iter++) {
        for (let i = 0; i < n; i++) {
          let best = 0;
          let bestD = Infinity;
          for (let k = 0; k < kClusters; k++) {
            const d = dist(MOON_POINTS[i], centroids[k]);
            if (d < bestD) {
              bestD = d;
              best = k;
            }
          }
          lbl[i] = best;
        }
        for (let k = 0; k < kClusters; k++) {
          let sx = 0, sy = 0, cnt = 0;
          for (let i = 0; i < n; i++) {
            if (lbl[i] === k) {
              sx += MOON_POINTS[i].x;
              sy += MOON_POINTS[i].y;
              cnt++;
            }
          }
          if (cnt > 0) centroids[k] = { x: sx / cnt, y: sy / cnt };
        }
      }
      return { labels: lbl, numClusters: kClusters, noiseCount: 0 };
    }

    // Real DBSCAN BFS
    const lbl = new Array(n).fill(-2); // -2 unvisited, -1 noise
    const regionQuery = (idx: number) => {
      const res: number[] = [];
      for (let j = 0; j < n; j++) {
        if (dist(MOON_POINTS[idx], MOON_POINTS[j]) <= eps) res.push(j);
      }
      return res;
    };

    let clusterId = 0;
    for (let i = 0; i < n; i++) {
      if (lbl[i] !== -2) continue;
      const neighbors = regionQuery(i);
      if (neighbors.length < minPts) {
        lbl[i] = -1;
        continue;
      }
      lbl[i] = clusterId;
      const queue = [...neighbors];
      for (let q = 0; q < queue.length; q++) {
        const ptIdx = queue[q];
        if (lbl[ptIdx] === -1) lbl[ptIdx] = clusterId;
        if (lbl[ptIdx] !== -2) continue;
        lbl[ptIdx] = clusterId;
        const n2 = regionQuery(ptIdx);
        if (n2.length >= minPts) {
          for (const nb of n2) {
            if (lbl[nb] === -2 || lbl[nb] === -1) queue.push(nb);
          }
        }
      }
      clusterId++;
    }

    return {
      labels: lbl,
      numClusters: clusterId,
      noiseCount: lbl.filter((v) => v === -1).length,
    };
  }, [algo, kClusters, eps, minPts]);

  const sx = (x: number) => 52 + ((x + 1.4) / 3.9) * 380;
  const sy = (y: number) => 222 - ((y + 1.1) / 2.75) * 196;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl border border-border bg-surface space-y-1.5">
          <span className="text-xs font-mono text-text-secondary block">Algoritma Kluster</span>
          <div className="grid grid-cols-2 gap-1.5">
            {(["kmeans", "dbscan"] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAlgo(a)}
                className={`py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                  algo === a
                    ? "bg-[#C2553A] text-white border-[#D4664A]"
                    : "bg-surface-secondary text-text-secondary border-border hover:text-text-primary"
                }`}
              >
                {a === "kmeans" ? "K-Means" : "DBSCAN"}
              </button>
            ))}
          </div>
        </div>

        {algo === "kmeans" ? (
          <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block sm:col-span-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-text-secondary">Jumlah Klaster (K)</span>
              <span className="font-bold text-brand-500 dark:text-[#D4664A]">{kClusters}</span>
            </div>
            <input
              type="range"
              min={2}
              max={6}
              step={1}
              value={kClusters}
              onChange={(e) => setKClusters(Number(e.target.value))}
              className="w-full accent-[#C2553A] cursor-pointer"
            />
          </label>
        ) : (
          <>
            <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-text-secondary">Radius Densitas (ε)</span>
                <span className="font-bold text-brand-500 dark:text-[#D4664A]">{eps.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.18}
                max={0.85}
                step={0.03}
                value={eps}
                onChange={(e) => setEps(Number(e.target.value))}
                className="w-full accent-[#C2553A] cursor-pointer"
              />
            </label>
            <label className="p-3 rounded-xl border border-border bg-surface space-y-1.5 block">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-text-secondary">Minimum Titik (minPts)</span>
                <span className="font-bold text-brand-500 dark:text-[#E5C194]">{minPts}</span>
              </div>
              <input
                type="range"
                min={2}
                max={8}
                step={1}
                value={minPts}
                onChange={(e) => setMinPts(Number(e.target.value))}
                className="w-full accent-[#C2553A] cursor-pointer"
              />
            </label>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-mono">
        <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
          Klaster Ditemukan: <strong className="text-emerald-600 dark:text-[#34D399]">{numClusters}</strong>
        </span>
        <span className="px-2.5 py-1 rounded-lg border border-border bg-surface text-text-secondary">
          Titik Noise / Outlier: <strong className="text-rose-600 dark:text-[#F87171]">{noiseCount}</strong>
        </span>
      </div>

      <div className="rounded-xl border border-border bg-[#FAF8F5] dark:bg-[#0F0E0D] p-3 overflow-x-auto">
        <svg viewBox="0 0 480 250" className="w-full max-w-[600px] mx-auto h-auto font-mono text-[10px]">
          {MOON_POINTS.map((pt, i) => {
            const c = labels[i];
            const isNoise = c < 0;
            return isNoise ? (
              <g key={i} transform={`translate(${sx(pt.x)}, ${sy(pt.y)})`}>
                <line x1="-4" y1="-4" x2="4" y2="4" stroke="#F87171" strokeWidth="2" />
                <line x1="4" y1="-4" x2="-4" y2="4" stroke="#F87171" strokeWidth="2" />
              </g>
            ) : (
              <circle
                key={i}
                cx={sx(pt.x)}
                cy={sy(pt.y)}
                r="4.6"
                fill={CLUSTER_COLORS[c % CLUSTER_COLORS.length]}
                stroke="#141210"
                strokeWidth="1"
              />
            );
          })}
          <text x="20" y="242" fill="currentColor" className="text-text-tertiary">
            Dataset Two-Moons + 4 Outlier • Tanda silang merah (×) = outlier terdeteksi sebagai noise
          </text>
        </svg>
      </div>
    </div>
  );
}
