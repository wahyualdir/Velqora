"use client";

import React, { useState } from "react";
import { Sparkles, Maximize2, Minimize2, BarChart2, Activity, Info } from "lucide-react";

export type PlotType = "decision-boundary" | "loss-curve" | "confusion-matrix" | "voronoi";

interface CodePlotVisualizerProps {
  type: PlotType;
  title?: string;
  className?: string;
}

export function CodePlotVisualizer({ type, title, className = "" }: CodePlotVisualizerProps) {
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-b-lg border border-t-0 border-zinc-700/80 bg-[#141416] p-4 text-zinc-200 select-none ${
        expanded ? "fixed inset-4 z-50 overflow-auto bg-[#121214] shadow-2xl p-6" : ""
      } ${className}`}
    >
      {/* Header bar of plot canvas */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="font-mono font-bold text-zinc-200 text-[11px]">
            {title || getPlotTitle(type)}
          </span>
          <span className="px-1.5 py-0.5 rounded font-mono text-[9.5px] font-bold tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
            RENDER: VECTOR_SVG_HD
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hoveredInfo && (
            <span className="font-mono text-[10.5px] text-zinc-400 truncate max-w-[240px] animate-fadeIn">
              {hoveredInfo}
            </span>
          )}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title={expanded ? "Ciutkan Plot" : "Perbesar Grafik Vektor"}
          >
            {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="w-full flex justify-center items-center overflow-x-auto py-1">
        {type === "decision-boundary" && <DecisionBoundarySvg onHover={setHoveredInfo} />}
        {type === "loss-curve" && <LossCurveSvg onHover={setHoveredInfo} />}
        {type === "confusion-matrix" && <ConfusionMatrixSvg onHover={setHoveredInfo} />}
        {type === "voronoi" && <VoronoiSvg onHover={setHoveredInfo} />}
      </div>
    </div>
  );
}

function getPlotTitle(type: PlotType): string {
  switch (type) {
    case "decision-boundary":
      return "Visualisasi Batas Keputusan (Separating Hyperplane)";
    case "loss-curve":
      return "Kurva Konvergensi & Peluruhan Kerugian (Loss Curve)";
    case "confusion-matrix":
      return "Matriks Konfusi & Metrik Evaluasi Kuantitatif";
    case "voronoi":
      return "Partisi Klaster Spasial & Diagram Voronoi";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. DECISION BOUNDARY PLOT (2D Support Vector Machine / Logistic Boundary)
// ─────────────────────────────────────────────────────────────────────────────
function DecisionBoundarySvg({ onHover }: { onHover: (info: string | null) => void }) {
  // Scatter coordinates for Class 0 (Terracotta) and Class 1 (Sky Blue)
  const class0Points = [
    { x: 90, y: 160 }, { x: 120, y: 190 }, { x: 80, y: 220 }, { x: 140, y: 240 },
    { x: 100, y: 270 }, { x: 160, y: 210 }, { x: 130, y: 140 }, { x: 70, y: 180 },
    { x: 150, y: 170 }, { x: 110, y: 230 }
  ];
  const class1Points = [
    { x: 310, y: 70 }, { x: 340, y: 90 }, { x: 280, y: 110 }, { x: 360, y: 130 },
    { x: 300, y: 150 }, { x: 390, y: 80 }, { x: 330, y: 140 }, { x: 270, y: 80 },
    { x: 370, y: 160 }, { x: 320, y: 120 }
  ];
  const supportVectors = [
    { x: 175, y: 155, cls: 0, label: "SV 1: [x₁=0.82, x₂=0.45] wᵀx+b=-1" },
    { x: 190, y: 225, cls: 0, label: "SV 2: [x₁=0.91, x₂=-0.21] wᵀx+b=-1" },
    { x: 255, y: 105, cls: 1, label: "SV 3: [x₁=1.45, x₂=1.12] wᵀx+b=+1" },
    { x: 245, y: 175, cls: 1, label: "SV 4: [x₁=1.38, x₂=0.62] wᵀx+b=+1" }
  ];

  return (
    <svg
      viewBox="0 0 480 320"
      className="w-full max-w-[560px] h-auto font-mono text-[10px]"
      style={{ background: "#131316", borderRadius: "8px" }}
    >
      <defs>
        {/* Glow filter for separating line */}
        <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Gradients for classification regions */}
        <linearGradient id="terracotta-zone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C2553A" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#C2553A" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="skyblue-zone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      {/* Decision Regions (Polygons) */}
      <polygon points="40,30 250,30 180,290 40,290" fill="url(#terracotta-zone)" />
      <polygon points="250,30 440,30 440,290 180,290" fill="url(#skyblue-zone)" />

      {/* Cartesius Grid lines */}
      {[70, 110, 150, 190, 230, 270].map((y) => (
        <line key={`gy-${y}`} x1="40" y1={y} x2="440" y2={y} stroke="#27272A" strokeDasharray="3 3" />
      ))}
      {[80, 140, 200, 260, 320, 380].map((x) => (
        <line key={`gx-${x}`} x1={x} y1="30" x2={x} y2="290" stroke="#27272A" strokeDasharray="3 3" />
      ))}

      {/* Coordinate Axes */}
      <line x1="40" y1="290" x2="440" y2="290" stroke="#52525B" strokeWidth="1.5" />
      <line x1="40" y1="30" x2="40" y2="290" stroke="#52525B" strokeWidth="1.5" />

      {/* Axis Labels */}
      <text x="410" y="306" fill="#A1A1AA" fontWeight="bold">Sumbu x₁</text>
      <text x="14" y="40" fill="#A1A1AA" fontWeight="bold">x₂</text>

      {/* Margin Boundary Lines w^T x + b = -1 and +1 */}
      <line
        x1="220" y1="30" x2="150" y2="290"
        stroke="#C2553A" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7"
      />
      <line
        x1="280" y1="30" x2="210" y2="290"
        stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7"
      />

      {/* Separating Hyperplane w^T x + b = 0 */}
      <line
        x1="250" y1="30" x2="180" y2="290"
        stroke="#F4F4F5" strokeWidth="2.5" filter="url(#glow-line)"
      />

      {/* Annotation Equation Text */}
      <g transform="translate(195, 45) rotate(75)">
        <rect x="-4" y="-12" width="130" height="18" rx="4" fill="#18181B" stroke="#3F3F46" />
        <text x="4" y="0" fill="#F4F4F5" fontSize="9" fontWeight="bold">
          wᵀx + b = 0 (Margin γ=2/||w||)
        </text>
      </g>

      {/* Scatter Points: Class 0 (Terracotta) */}
      {class0Points.map((pt, i) => (
        <circle
          key={`c0-${i}`}
          cx={pt.x}
          cy={pt.y}
          r="4.5"
          fill="#C2553A"
          stroke="#FAF8F5"
          strokeWidth="1.2"
          className="cursor-pointer hover:r-6 transition-all"
          onMouseEnter={() => onHover(`Kelas 0 (y=-1): Titik (#${i + 1}) di koord [${pt.x}, ${pt.y}]`)}
          onMouseLeave={() => onHover(null)}
        />
      ))}

      {/* Scatter Points: Class 1 (Sky Blue) */}
      {class1Points.map((pt, i) => (
        <circle
          key={`c1-${i}`}
          cx={pt.x}
          cy={pt.y}
          r="4.5"
          fill="#38BDF8"
          stroke="#FAF8F5"
          strokeWidth="1.2"
          className="cursor-pointer hover:r-6 transition-all"
          onMouseEnter={() => onHover(`Kelas 1 (y=+1): Titik (#${i + 1}) di koord [${pt.x}, ${pt.y}]`)}
          onMouseLeave={() => onHover(null)}
        />
      ))}

      {/* Support Vectors (Highlighted with outer gold rings) */}
      {supportVectors.map((sv, i) => (
        <g key={`sv-${i}`} className="cursor-pointer" onMouseEnter={() => onHover(sv.label)} onMouseLeave={() => onHover(null)}>
          <circle cx={sv.x} cy={sv.y} r="8.5" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx={sv.x} cy={sv.y} r="4.5" fill={sv.cls === 0 ? "#C2553A" : "#38BDF8"} stroke="#FBBF24" strokeWidth="1.5" />
        </g>
      ))}

      {/* Legend Card */}
      <g transform="translate(50, 42)">
        <rect x="0" y="0" width="130" height="74" rx="6" fill="#18181B" fillOpacity="0.9" stroke="#27272A" />
        <circle cx="12" cy="16" r="4" fill="#C2553A" />
        <text x="24" y="19" fill="#D4D4D8" fontSize="9">Kelas 0 (y = -1)</text>

        <circle cx="12" cy="34" r="4" fill="#38BDF8" />
        <text x="24" y="37" fill="#D4D4D8" fontSize="9">Kelas 1 (y = +1)</text>

        <circle cx="12" cy="52" r="5" fill="none" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="2 1" />
        <circle cx="12" cy="52" r="2.5" fill="#FBBF24" />
        <text x="24" y="55" fill="#FBBF24" fontSize="9" fontWeight="bold">Support Vector (α &gt; 0)</text>
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. LOSS & CONVERGENCE CURVE (Epoch vs Empirical Risk Decay)
// ─────────────────────────────────────────────────────────────────────────────
function LossCurveSvg({ onHover }: { onHover: (info: string | null) => void }) {
  // SVG Path strings for Training Loss and Validation Loss
  // Smooth curve through 10 points
  const trainPath = "M 50,70 Q 100,160 170,210 T 290,248 T 430,265";
  const valPath   = "M 50,85 Q 100,175 170,218 T 290,242 T 430,250";

  return (
    <svg
      viewBox="0 0 480 320"
      className="w-full max-w-[560px] h-auto font-mono text-[10px]"
      style={{ background: "#131316", borderRadius: "8px" }}
    >
      <defs>
        <linearGradient id="train-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Grid Lines */}
      {[60, 110, 160, 210, 260].map((y, idx) => (
        <g key={`gy-${y}`}>
          <line x1="50" y1={y} x2="440" y2={y} stroke="#27272A" strokeDasharray="3 3" />
          <text x="20" y={y + 3} fill="#71717A" fontSize="9">{(1.0 - idx * 0.2).toFixed(1)}</text>
        </g>
      ))}
      {[50, 130, 210, 290, 370, 440].map((x, idx) => (
        <g key={`gx-${x}`}>
          <line x1={x} y1="40" x2={x} y2="270" stroke="#27272A" strokeDasharray="3 3" />
          <text x={x - 8} y="288" fill="#71717A" fontSize="9">{idx * 20}</text>
        </g>
      ))}

      {/* Axes */}
      <line x1="50" y1="270" x2="440" y2="270" stroke="#52525B" strokeWidth="1.5" />
      <line x1="50" y1="40" x2="50" y2="270" stroke="#52525B" strokeWidth="1.5" />

      <text x="390" y="306" fill="#A1A1AA" fontWeight="bold">Epoch (t)</text>
      <text x="14" y="30" fill="#A1A1AA" fontWeight="bold">Loss L(θ)</text>

      {/* Shaded Area under Train Loss */}
      <path d={`${trainPath} L 430,270 L 50,270 Z`} fill="url(#train-gradient)" />

      {/* Validation Loss Curve (Terracotta / Orange) */}
      <path
        d={valPath}
        fill="none"
        stroke="#C2553A"
        strokeWidth="2.5"
        strokeDasharray="4 2"
        className="cursor-pointer"
        onMouseEnter={() => onHover("Validation Loss (Hold-out Test Risk): Terlihat sedikit divergen tanda titik early-stop")}
        onMouseLeave={() => onHover(null)}
      />

      {/* Training Loss Curve (Sky Blue) */}
      <path
        d={trainPath}
        fill="none"
        stroke="#38BDF8"
        strokeWidth="2.5"
        className="cursor-pointer"
        onMouseEnter={() => onHover("Training Loss: Peluruhan eksponensial stabil konvergen mendekati minimum global")}
        onMouseLeave={() => onHover(null)}
      />

      {/* Minimum Point Marker (Epoch 72) */}
      <g
        className="cursor-pointer"
        onMouseEnter={() => onHover("Titik Optimal Early-Stopping: Epoch 72 | Val Loss: 0.048 | Generalization Gap Minimal")}
        onMouseLeave={() => onHover(null)}
      >
        <line x1="290" y1="40" x2="290" y2="270" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="3 2" />
        <circle cx="290" cy="242" r="7" fill="#F59E0B" fillOpacity="0.2" />
        <circle cx="290" cy="242" r="4" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />

        {/* Callout Tag */}
        <g transform="translate(245, 175)">
          <rect x="0" y="0" width="165" height="38" rx="6" fill="#18181B" stroke="#F59E0B" strokeWidth="1.2" />
          <text x="8" y="16" fill="#F59E0B" fontSize="9" fontWeight="bold">★ Titik Konvergensi Optimum</text>
          <text x="8" y="30" fill="#D4D4D8" fontSize="8.5">Epoch 72 | L*(θ) = 0.048</text>
          <path d="M 45,38 L 45,67" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      </g>

      {/* Legend */}
      <g transform="translate(280, 50)">
        <rect x="0" y="0" width="150" height="58" rx="6" fill="#18181B" fillOpacity="0.9" stroke="#27272A" />
        <line x1="12" y1="18" x2="32" y2="18" stroke="#38BDF8" strokeWidth="2.5" />
        <text x="40" y="21" fill="#D4D4D8" fontSize="9">Train Loss (Empiris)</text>

        <line x1="12" y1="36" x2="32" y2="36" stroke="#C2553A" strokeWidth="2.5" strokeDasharray="3 2" />
        <text x="40" y="39" fill="#D4D4D8" fontSize="9">Validation Loss</text>
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CONFUSION MATRIX HEATMAP (2x2 Matrix with SOTA Metrics)
// ─────────────────────────────────────────────────────────────────────────────
function ConfusionMatrixSvg({ onHover }: { onHover: (info: string | null) => void }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className="w-full max-w-[560px] h-auto font-mono text-[10px]"
      style={{ background: "#131316", borderRadius: "8px" }}
    >
      {/* Title & Coordinates */}
      <text x="140" y="26" fill="#A1A1AA" fontSize="10" fontWeight="bold">
        PREDIKSI MODEL (Predicted ŷ)
      </text>
      <text x="80" y="52" fill="#71717A" fontSize="9" fontWeight="bold">Positif (1)</text>
      <text x="190" y="52" fill="#71717A" fontSize="9" fontWeight="bold">Negatif (0)</text>

      {/* Vertical Label */}
      <g transform="translate(18, 175) rotate(-90)">
        <text x="0" y="0" fill="#A1A1AA" fontSize="10" fontWeight="bold" textAnchor="middle">
          AKTUAL (Ground Truth y)
        </text>
      </g>
      <text x="25" y="115" fill="#71717A" fontSize="9" fontWeight="bold">Positif (1)</text>
      <text x="25" y="215" fill="#71717A" fontSize="9" fontWeight="bold">Negatif (0)</text>

      {/* Heatmap Cells */}
      {/* 1. True Positive (TP) */}
      <g
        className="cursor-pointer"
        onMouseEnter={() => onHover("True Positive (TP): 948 sampel benar diklasifikasikan sebagai Positif | Nilai Ternormalisasi: 0.992")}
        onMouseLeave={() => onHover(null)}
      >
        <rect x="60" y="65" width="105" height="95" rx="8" fill="#10B981" fillOpacity="0.32" stroke="#10B981" strokeWidth="1.5" />
        <text x="75" y="88" fill="#34D399" fontSize="9" fontWeight="bold">TRUE POSITIVE</text>
        <text x="86" y="118" fill="#FFFFFF" fontSize="22" fontWeight="bold">948</text>
        <text x="75" y="136" fill="#A7F3D0" fontSize="8.5">TP Rate: 99.16%</text>
        <text x="75" y="150" fill="#6EE7B7" fontSize="8.5" fontWeight="bold">Norm: 0.992</text>
      </g>

      {/* 2. False Positive (FP - Type I Error) */}
      <g
        className="cursor-pointer"
        onMouseEnter={() => onHover("False Positive (FP - Type I Error): 14 sampel negatif keliru diprediksi positif | Nilai Ternormalisasi: 0.015")}
        onMouseLeave={() => onHover(null)}
      >
        <rect x="175" y="65" width="105" height="95" rx="8" fill="#F59E0B" fillOpacity="0.18" stroke="#F59E0B" strokeWidth="1.2" />
        <text x="186" y="88" fill="#FBBF24" fontSize="9" fontWeight="bold">FALSE POSITIVE</text>
        <text x="210" y="118" fill="#FFFFFF" fontSize="22" fontWeight="bold">14</text>
        <text x="188" y="136" fill="#FDE68A" fontSize="8.5">Type I (α Error)</text>
        <text x="188" y="150" fill="#FCD34D" fontSize="8.5" fontWeight="bold">Norm: 0.015</text>
      </g>

      {/* 3. False Negative (FN - Type II Error) */}
      <g
        className="cursor-pointer"
        onMouseEnter={() => onHover("False Negative (FN - Type II Error): 8 sampel positif fatal lolos diprediksi negatif | Nilai Ternormalisasi: 0.008")}
        onMouseLeave={() => onHover(null)}
      >
        <rect x="60" y="170" width="105" height="95" rx="8" fill="#EF4444" fillOpacity="0.22" stroke="#EF4444" strokeWidth="1.2" />
        <text x="72" y="193" fill="#F87171" fontSize="9" fontWeight="bold">FALSE NEGATIVE</text>
        <text x="100" y="223" fill="#FFFFFF" fontSize="22" fontWeight="bold">8</text>
        <text x="75" y="241" fill="#FECACA" fontSize="8.5">Type II (β Error)</text>
        <text x="75" y="255" fill="#FCA5A5" fontSize="8.5" fontWeight="bold">Norm: 0.008</text>
      </g>

      {/* 4. True Negative (TN) */}
      <g
        className="cursor-pointer"
        onMouseEnter={() => onHover("True Negative (TN): 930 sampel negatif benar diklasifikasikan sebagai Negatif | Nilai Ternormalisasi: 0.985")}
        onMouseLeave={() => onHover(null)}
      >
        <rect x="175" y="170" width="105" height="95" rx="8" fill="#10B981" fillOpacity="0.32" stroke="#10B981" strokeWidth="1.5" />
        <text x="187" y="193" fill="#34D399" fontSize="9" fontWeight="bold">TRUE NEGATIVE</text>
        <text x="200" y="223" fill="#FFFFFF" fontSize="22" fontWeight="bold">930</text>
        <text x="190" y="241" fill="#A7F3D0" fontSize="8.5">TN Rate: 98.5%</text>
        <text x="190" y="255" fill="#6EE7B7" fontSize="8.5" fontWeight="bold">Norm: 0.985</text>
      </g>

      {/* Side Summary Diagnostic Card */}
      <g transform="translate(300, 65)">
        <rect x="0" y="0" width="165" height="200" rx="8" fill="#18181B" stroke="#27272A" />
        <text x="14" y="25" fill="#F4F4F5" fontSize="10" fontWeight="bold">
          DIAGNOSTIK METRIK
        </text>
        <line x1="14" y1="35" x2="151" y2="35" stroke="#27272A" />

        <g transform="translate(14, 52)">
          <text x="0" y="0" fill="#A1A1AA" fontSize="9">Akurasi Global</text>
          <text x="135" y="0" fill="#34D399" fontSize="10" fontWeight="bold" textAnchor="end">98.84%</text>
        </g>
        <g transform="translate(14, 82)">
          <text x="0" y="0" fill="#A1A1AA" fontSize="9">Presisi (PPV)</text>
          <text x="135" y="0" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="end">98.54%</text>
        </g>
        <g transform="translate(14, 112)">
          <text x="0" y="0" fill="#A1A1AA" fontSize="9">Recall (Sensitivitas)</text>
          <text x="135" y="0" fill="#FBBF24" fontSize="10" fontWeight="bold" textAnchor="end">99.16%</text>
        </g>
        <g transform="translate(14, 142)">
          <text x="0" y="0" fill="#A1A1AA" fontSize="9">F1-Score Harmonik</text>
          <text x="135" y="0" fill="#A78BFA" fontSize="10" fontWeight="bold" textAnchor="end">98.85%</text>
        </g>

        <rect x="14" y="160" width="137" height="26" rx="4" fill="#27272A" />
        <text x="22" y="177" fill="#E4E4E7" fontSize="8.5" fontWeight="bold">N = 1,900 Sampel Uji</text>
      </g>

      {/* Axis Footer */}
      <text x="60" y="295" fill="#71717A" fontSize="9">
        Matrix Format: ConfusionMatrixDisplay (Scikit-Learn SOTA)
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CLUSTERING VORONOI PLOT (K-Means Centroids & Tessellation)
// ─────────────────────────────────────────────────────────────────────────────
function VoronoiSvg({ onHover }: { onHover: (info: string | null) => void }) {
  // Centroids coordinates
  const centroids = [
    { x: 130, y: 120, label: "Centroid μ₁: [-1.42, 1.15] Cluster Emerald (N=120)", color: "#10B981" },
    { x: 330, y: 100, label: "Centroid μ₂: [1.85, 1.40] Cluster Sky Blue (N=120)", color: "#38BDF8" },
    { x: 230, y: 220, label: "Centroid μ₃: [0.12, -1.25] Cluster Terracotta (N=120)", color: "#C2553A" },
  ];

  return (
    <svg
      viewBox="0 0 480 320"
      className="w-full max-w-[560px] h-auto font-mono text-[10px]"
      style={{ background: "#131316", borderRadius: "8px" }}
    >
      <defs>
        <linearGradient id="voronoi-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="voronoi-g2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="voronoi-g3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C2553A" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#C2553A" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* Voronoi Partition Polygons */}
      <polygon points="30,30 220,30 230,165 30,200" fill="url(#voronoi-g1)" />
      <polygon points="220,30 450,30 450,190 230,165" fill="url(#voronoi-g2)" />
      <polygon points="30,200 230,165 450,190 450,290 30,290" fill="url(#voronoi-g3)" />

      {/* Voronoi Boundary Lines */}
      <line x1="220" y1="30" x2="230" y2="165" stroke="#71717A" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="230" y1="165" x2="30" y2="200" stroke="#71717A" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="230" y1="165" x2="450" y2="190" stroke="#71717A" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* Grid Lines */}
      {[70, 130, 190, 250].map((y) => (
        <line key={`vy-${y}`} x1="30" y1={y} x2="450" y2={y} stroke="#27272A" strokeDasharray="3 3" opacity="0.6" />
      ))}
      {[90, 170, 250, 330, 410].map((x) => (
        <line key={`vx-${x}`} x1={x} y1="30" x2={x} y2="290" stroke="#27272A" strokeDasharray="3 3" opacity="0.6" />
      ))}

      {/* Concentric Gaussian Density Contour Rings around Centroids */}
      {centroids.map((c, i) => (
        <g key={`c-density-${i}`}>
          {/* 3-sigma outer boundary */}
          <circle cx={c.x} cy={c.y} r="54" fill="none" stroke={c.color} strokeWidth="0.8" strokeDasharray="4 4" opacity="0.25" />
          {/* 2-sigma intermediate contour */}
          <circle cx={c.x} cy={c.y} r="36" fill="none" stroke={c.color} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.45" />
          {/* 1-sigma core density contour */}
          <circle cx={c.x} cy={c.y} r="20" fill={c.color} fillOpacity="0.12" stroke={c.color} strokeWidth="1.5" opacity="0.75" />
          <text x={c.x + 22} y={c.y - 24} fill={c.color} fontSize="7" opacity="0.75">Kontur 2σ</text>
        </g>
      ))}

      {/* Cluster 1 Points (Emerald) */}
      {[
        { x: 90, y: 80 }, { x: 140, y: 90 }, { x: 110, y: 140 }, { x: 160, y: 130 },
        { x: 80, y: 130 }, { x: 130, y: 70 }, { x: 160, y: 80 }, { x: 100, y: 160 },
        { x: 70, y: 100 }, { x: 150, y: 150 }
      ].map((p, i) => (
        <circle key={`p1-${i}`} cx={p.x} cy={p.y} r="3.5" fill="#10B981" stroke="#FAF8F5" strokeWidth="1" />
      ))}

      {/* Cluster 2 Points (Sky Blue) */}
      {[
        { x: 300, y: 70 }, { x: 350, y: 60 }, { x: 380, y: 90 }, { x: 320, y: 120 },
        { x: 360, y: 130 }, { x: 290, y: 110 }, { x: 410, y: 80 }, { x: 340, y: 140 },
        { x: 390, y: 120 }, { x: 320, y: 80 }
      ].map((p, i) => (
        <circle key={`p2-${i}`} cx={p.x} cy={p.y} r="3.5" fill="#38BDF8" stroke="#FAF8F5" strokeWidth="1" />
      ))}

      {/* Cluster 3 Points (Terracotta) */}
      {[
        { x: 200, y: 200 }, { x: 250, y: 190 }, { x: 220, y: 250 }, { x: 270, y: 240 },
        { x: 180, y: 230 }, { x: 260, y: 210 }, { x: 210, y: 270 }, { x: 280, y: 260 },
        { x: 160, y: 250 }, { x: 240, y: 260 }
      ].map((p, i) => (
        <circle key={`p3-${i}`} cx={p.x} cy={p.y} r="3.5" fill="#C2553A" stroke="#FAF8F5" strokeWidth="1" />
      ))}


      {/* Centroid Targets */}
      {centroids.map((c, i) => (
        <g
          key={`c-target-${i}`}
          className="cursor-pointer"
          onMouseEnter={() => onHover(c.label)}
          onMouseLeave={() => onHover(null)}
        >
          <circle cx={c.x} cy={c.y} r="8" fill="#18181B" stroke={c.color} strokeWidth="2.5" />
          <line x1={c.x - 5} y1={c.y} x2={c.x + 5} y2={c.y} stroke={c.color} strokeWidth="2" />
          <line x1={c.x} y1={c.y - 5} x2={c.x} y2={c.y + 5} stroke={c.color} strokeWidth="2" />
          <text x={c.x + 10} y={c.y + 4} fill="#FFFFFF" fontSize="10" fontWeight="bold">
            μ_{i + 1}
          </text>
        </g>
      ))}

      {/* Legend */}
      <g transform="translate(45, 42)">
        <rect x="0" y="0" width="135" height="58" rx="6" fill="#18181B" fillOpacity="0.9" stroke="#27272A" />
        <circle cx="12" cy="15" r="4" fill="#10B981" />
        <text x="24" y="18" fill="#D4D4D8" fontSize="8.5">Klaster 1 (μ₁ N=120)</text>

        <circle cx="12" cy="30" r="4" fill="#38BDF8" />
        <text x="24" y="33" fill="#D4D4D8" fontSize="8.5">Klaster 2 (μ₂ N=120)</text>

        <circle cx="12" cy="45" r="4" fill="#C2553A" />
        <text x="24" y="48" fill="#D4D4D8" fontSize="8.5">Klaster 3 (μ₃ N=120)</text>
      </g>
    </svg>
  );
}
