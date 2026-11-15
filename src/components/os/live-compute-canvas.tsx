"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  Lock,
  Network,
  Pause,
  Play,
  RefreshCw,
  Share2,
  Sigma,
  TrendingDown,
  Workflow,
} from "lucide-react";
import { getTopicStatus } from "@/lib/curriculum/status";
import { EASE_SMOOTH } from "./motion-primitives";
import {
  OBSIDIAN_PALETTE,
  type ComputeModeId,
  type ImpulseEvent,
  type ImpulseState,
  type RenderCtx,
} from "./compute-scenes/types";
import { renderLossLandscape } from "./compute-scenes/loss-landscape-scene";
import { renderNeuralFlow } from "./compute-scenes/transformer-scene";
import { renderSimdLanes } from "./compute-scenes/data-pipeline-scene";
import { renderLorenzAttractor } from "./compute-scenes/lorenz-calculus-scene";
import { renderBayesianCurve } from "./compute-scenes/bayesian-mcmc-scene";
import { renderVectorSearch } from "./compute-scenes/hnsw-vector-scene";

export type { ComputeModeId };

export interface ComputeLegendItem {
  label: string;
  color: string;
}

export interface ComputeEngineSpec {
  id: string;
  sceneId: ComputeModeId;
  slug: string;
  moduleCode: string;
  name: string;
  shortLabel: string;
  title: string;
  caption: string;
  formula: string;
  initialMetric: string;
  clickHint: string;
  color: string;
  legend: ComputeLegendItem[];
  statusLabel: string;
  isVerified: boolean;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

const RAW_LAB_MODULES: Omit<ComputeEngineSpec, "statusLabel" | "isVerified">[] = [
  {
    id: "machine-learning",
    sceneId: "python",
    slug: "machine-learning",
    moduleCode: "ML-408",
    name: "Topik 19 · Machine Learning",
    shortLabel: "ML",
    title: "Optimasi Gradien 3D",
    caption: "Medan −∇L, Adam vs SGD, & kurva loss epoch",
    formula: "θₜ₊₁ = θₜ − η∇L(θ)",
    initialMetric: "Adam L=0.018 · SGD=0.064 · ‖∇‖=0.14",
    clickHint: "Klik: kejutan LR",
    color: OBSIDIAN_PALETTE.sand,
    legend: [
      { label: "Adam", color: OBSIDIAN_PALETTE.sand },
      { label: "SGD", color: OBSIDIAN_PALETTE.terracotta },
      { label: "Min θ*", color: OBSIDIAN_PALETTE.emerald },
    ],
    icon: TrendingDown,
  },
  {
    id: "deep-learning",
    sceneId: "pytorch",
    slug: "deep-learning",
    moduleCode: "DL-405",
    name: "Topik 12 · Deep Learning",
    shortLabel: "Deep L",
    title: "Arsitektur Residual & Atensi",
    caption: "Blok Transformer, +Res, FFN, & Atensi 6×6",
    formula: "y = Norm(x + Attn(x))",
    initialMetric: "FWD · 8-Head · α=0.84",
    clickHint: "Klik: denyut gradien",
    color: OBSIDIAN_PALETTE.terracotta,
    legend: [
      { label: "Forward", color: OBSIDIAN_PALETTE.sand },
      { label: "Autograd", color: OBSIDIAN_PALETTE.terracotta },
      { label: "Q·Kᵀ Focus", color: OBSIDIAN_PALETTE.emerald },
    ],
    icon: Network,
  },
  {
    id: "data-engineering-ai",
    sceneId: "rust",
    slug: "data-engineering-ai",
    moduleCode: "DEA-402",
    name: "Topik 10 · Data Engineering AI",
    shortLabel: "Data Eng",
    title: "Pipeline Batch & Feature Stream",
    caption: "Kafka 12P, Schema Φ, DLQ, & Delta Bronze→Gold",
    formula: "Kafka[12P] → Φ → Δ[B→S→G]",
    initialMetric: "42.4k ev/s · Lag 9ms · SLA 99.8%",
    clickHint: "Klik: burst CDC",
    color: "#EA8C6B",
    legend: [
      { label: "Raw Bronze", color: OBSIDIAN_PALETTE.sand },
      { label: "Silver / Lag", color: OBSIDIAN_PALETTE.terracotta },
      { label: "WM & Gold", color: OBSIDIAN_PALETTE.emerald },
    ],
    icon: Workflow,
  },
  {
    id: "matematika-statistika",
    sceneId: "julia",
    slug: "matematika-statistika",
    moduleCode: "MS-404",
    name: "Topik 29 · Matematika & Statistika",
    shortLabel: "Kalkulus",
    title: "Sistem Dinamis & Kalkulus",
    caption: "Lorenz RK4 3D, titik C±, & plot Lyapunov δ(t)",
    formula: "dx/dt = σ(y − x) · RK4",
    initialMetric: "λ₁=+0.91 · ‖δ‖=0.34 · RK4",
    clickHint: "Klik: reset δ₀",
    color: "#D6D3D1",
    legend: [
      { label: "Orbit γ₁", color: OBSIDIAN_PALETTE.terracotta },
      { label: "Orbit γ₂", color: OBSIDIAN_PALETTE.sand },
      { label: "Vektor δ", color: OBSIDIAN_PALETTE.emerald },
    ],
    icon: Sigma,
  },
  {
    id: "data-science",
    sceneId: "r",
    slug: "data-science",
    moduleCode: "DS-404",
    name: "Topik 11 · Data Science",
    shortLabel: "Data Sci",
    title: "Inferensi Bayesian & EDA",
    caption: "Bayes Posterior, 95% HDI, 2-Chain MCMC, & KDE",
    formula: "P(θ|D) ∝ P(D|θ)P(θ)",
    initialMetric: "MAP=0.52 · P=0.88 · R̂=1.00",
    clickHint: "Klik: +observasi",
    color: OBSIDIAN_PALETTE.emerald,
    legend: [
      { label: "Prior", color: OBSIDIAN_PALETTE.stone },
      { label: "Likelihood", color: OBSIDIAN_PALETTE.sand },
      { label: "Posterior", color: OBSIDIAN_PALETTE.terracotta },
    ],
    icon: BarChart3,
  },
  {
    id: "vector-database-retrieval",
    sceneId: "postgres",
    slug: "vector-database-retrieval",
    moduleCode: "VDR-408",
    name: "Topik 28 · Vector DB & Retrieval",
    shortLabel: "Vector",
    title: "Indeks Vektor HNSW L2→L1→L0",
    caption: "HNSW L2→L1→L0, sudut kosinus, & Top-K rerank",
    formula: "HNSW[L2→L1→L0] · cos(q, vᵢ)",
    initialMetric: "L2→L1→L0 · cos=0.942 · 4 hops",
    clickHint: "Klik: query burst",
    color: OBSIDIAN_PALETTE.amber,
    legend: [
      { label: "Query q", color: OBSIDIAN_PALETTE.terracotta },
      { label: "Kandidat", color: OBSIDIAN_PALETTE.sand },
      { label: "Top-1 Hit", color: OBSIDIAN_PALETTE.emerald },
    ],
    icon: Share2,
  },
];

export const COMPUTE_ENGINES: ComputeEngineSpec[] = RAW_LAB_MODULES.map((mod) => {
  const statusMeta = getTopicStatus(mod.slug);
  return {
    ...mod,
    statusLabel: statusMeta.badgeLabel,
    isVerified: statusMeta.isVerified,
  };
});

const CYCLE_DURATION_MS = 7500;

const MODE_RENDERERS: Record<ComputeModeId, (rc: RenderCtx) => string> = {
  python: renderLossLandscape,
  pytorch: renderNeuralFlow,
  rust: renderSimdLanes,
  julia: renderLorenzAttractor,
  r: renderBayesianCurve,
  postgres: renderVectorSearch,
};

export interface LiveComputeCanvasProps {
  onModeChange?: (engine: ComputeEngineSpec) => void;
  className?: string;
}

export function LiveComputeCanvas({
  onModeChange,
  className = "",
}: LiveComputeCanvasProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liveMetricRef = useRef<HTMLSpanElement>(null);

  const prefersReduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [isDockHovered, setIsDockHovered] = useState<boolean>(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState<boolean>(false);
  const [isStageHovered, setIsStageHovered] = useState<boolean>(false);

  const pausedRef = useRef<boolean>(false);
  useEffect(() => {
    pausedRef.current = isManuallyPaused || Boolean(prefersReduced);
  }, [isManuallyPaused, prefersReduced]);

  const activeIdRef = useRef<ComputeModeId>(COMPUTE_ENGINES[0].sceneId);
  const prevIdRef = useRef<ComputeModeId | null>(null);

  // 2nd-order spring physics state for weighted gimbal camera feel
  const targetParallaxRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentParallaxRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const parallaxVelRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const cursorActiveRef = useRef<boolean>(false);
  const cursorPosRef = useRef<{ x: number; y: number }>({ x: 270, y: 214 });
  const smoothCursorRef = useRef<{ x: number; y: number }>({ x: 270, y: 214 });
  const hoverAlphaRef = useRef<number>(0);
  const blendAlphaRef = useRef<number>(1);
  const prevAlphaRef = useRef<number>(0);

  // Multi-impulse queue so rapid clicks cascade cleanly across simulations
  const impulseCounterRef = useRef<number>(1);
  const impulsesRef = useRef<ImpulseEvent[]>([]);
  const legacyImpulseRef = useRef<ImpulseState>({
    active: false,
    x: 0,
    y: 0,
    age: 0,
  });

  const activeEngine = COMPUTE_ENGINES[activeIndex];
  const isCycleFrozen =
    isPinned || isDockHovered || isStageHovered || isManuallyPaused || Boolean(prefersReduced);

  const onModeChangeRef = useRef(onModeChange);
  useEffect(() => {
    onModeChangeRef.current = onModeChange;
  }, [onModeChange]);

  useEffect(() => {
    if (activeIdRef.current !== activeEngine.sceneId) {
      prevIdRef.current = activeIdRef.current;
      prevAlphaRef.current = blendAlphaRef.current;
      activeIdRef.current = activeEngine.sceneId;
      blendAlphaRef.current = 0;
    }
    onModeChangeRef.current?.(activeEngine);
  }, [activeEngine]);

  // Smooth automatic cycle through the 6 compute modes when not hovered, pinned, or paused
  useEffect(() => {
    if (isCycleFrozen) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % COMPUTE_ENGINES.length);
    }, CYCLE_DURATION_MS);
    return () => window.clearInterval(timer);
  }, [isCycleFrozen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = stage.clientWidth || 540;
    let height = stage.clientHeight || 428;
    let dpr = Math.min(3, window.devicePixelRatio || 1);

    const updateSize = () => {
      if (!stage || !canvas) return;
      const rect = stage.getBoundingClientRect();
      width = Math.floor(rect.width) || 540;
      height = Math.floor(rect.height) || 428;
      dpr = Math.min(3, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(stage);

    let lastTime = performance.now();
    let elapsed = 2.1; // Start mid-stride with active topology & trajectories visible on initial paint

    const render = () => {
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) * 0.001));
      lastTime = now;

      if (!pausedRef.current) {
        elapsed += dt;
      }

      // Underdamped 2nd-order spring camera tilt for physical gimbal weight
      const stiffness = 68;
      const damping = 12;
      const ax =
        (targetParallaxRef.current.x - currentParallaxRef.current.x) * stiffness -
        parallaxVelRef.current.x * damping;
      const ay =
        (targetParallaxRef.current.y - currentParallaxRef.current.y) * stiffness -
        parallaxVelRef.current.y * damping;

      parallaxVelRef.current.x += ax * dt;
      parallaxVelRef.current.y += ay * dt;
      currentParallaxRef.current.x += parallaxVelRef.current.x * dt;
      currentParallaxRef.current.y += parallaxVelRef.current.y * dt;

      // Advance active click impulses even if simulation clock is paused
      if (impulsesRef.current.length > 0) {
        for (const imp of impulsesRef.current) {
          imp.age += dt;
        }
        impulsesRef.current = impulsesRef.current.filter((imp) => imp.age <= 5.0);
      }

      const newest = impulsesRef.current[impulsesRef.current.length - 1];
      if (newest) {
        legacyImpulseRef.current = {
          active: newest.age < 2.2,
          x: newest.x,
          y: newest.y,
          age: newest.age,
        };
      } else {
        legacyImpulseRef.current.active = false;
      }

      // Smooth cursor position and hover presence alpha (60fps exponential damping)
      const hoverTarget = cursorActiveRef.current ? 1 : 0;
      hoverAlphaRef.current += (hoverTarget - hoverAlphaRef.current) * (1 - Math.exp(-9 * dt));
      if (hoverAlphaRef.current < 0.002 && !cursorActiveRef.current) {
        hoverAlphaRef.current = 0;
      }
      const cursorEase = 1 - Math.exp(-16 * dt);
      smoothCursorRef.current.x += (cursorPosRef.current.x - smoothCursorRef.current.x) * cursorEase;
      smoothCursorRef.current.y += (cursorPosRef.current.y - smoothCursorRef.current.y) * cursorEase;

      // Smooth dual-layer crossfade weights
      const blendEase = 1 - Math.exp(-7.5 * dt);
      blendAlphaRef.current += (1 - blendAlphaRef.current) * blendEase;
      if (prevAlphaRef.current > 0.004) {
        prevAlphaRef.current *= Math.exp(-8.5 * dt);
      } else {
        prevAlphaRef.current = 0;
        prevIdRef.current = null;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.clearRect(0, 0, width, height);

      // Whisper-quiet parallax dot field (zero busy cross-ticks)
      const gridStep = 28;
      const pxShift = currentParallaxRef.current.x * 2.2;
      const pyShift = currentParallaxRef.current.y * 2.2;
      const offX = ((width % gridStep) / 2) + pxShift;
      const offY = ((height % gridStep) / 2) + pyShift;

      ctx.fillStyle = "rgba(168, 162, 158, 0.055)";
      for (let gx = offX; gx < width; gx += gridStep) {
        for (let gy = offY; gy < height; gy += gridStep) {
          ctx.fillRect(gx, gy, 1.1, 1.1);
        }
      }

      // Soft warm terracotta center atmospheric glow (restrained <= 6.2% per Warm Obsidian spec)
      const amb = ctx.createRadialGradient(
        width * 0.5,
        height * 0.48,
        16,
        width * 0.5,
        height * 0.48,
        Math.max(width, height) * 0.58
      );
      amb.addColorStop(0, "rgba(212, 102, 74, 0.062)");
      amb.addColorStop(1, "rgba(212, 102, 74, 0)");
      ctx.fillStyle = amb;
      ctx.fillRect(0, 0, width, height);

      // Single clean eased shockwave ring for canvas click impulses
      for (const imp of impulsesRef.current) {
        if (imp.age > 0.95) continue;
        const p = imp.age / 0.95;
        const easedP = 1 - Math.pow(1 - p, 3);
        const fade = Math.pow(1 - p, 2);
        ctx.strokeStyle = `rgba(229, 193, 148, ${(fade * 0.34).toFixed(3)})`;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(imp.x, imp.y, 6 + easedP * 68, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Delicate smoothed hover presence dot when inspecting stage
      if (hoverAlphaRef.current > 0.01) {
        const ha = hoverAlphaRef.current;
        const cxP = smoothCursorRef.current.x;
        const cyP = smoothCursorRef.current.y;
        ctx.fillStyle = `rgba(229, 193, 148, ${(0.28 * ha).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(cxP, cyP, 2.0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(212, 102, 74, ${(0.14 * ha).toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(cxP, cyP, 7.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      const compact = width < 440;
      const safeTop = 36;
      const safeBottom = height - 48;

      const renderPayload: RenderCtx = {
        ctx,
        width,
        height,
        compact,
        safeTop,
        safeBottom,
        t: elapsed,
        mx: currentParallaxRef.current.x,
        my: currentParallaxRef.current.y,
        cursorActive: cursorActiveRef.current,
        hoverAlpha: hoverAlphaRef.current,
        cursorPx: smoothCursorRef.current.x,
        cursorPy: smoothCursorRef.current.y,
        impulse: legacyImpulseRef.current,
        impulses: impulsesRef.current,
      };

      // Liquid outgoing dissolve
      if (prevIdRef.current && prevAlphaRef.current > 0.01) {
        ctx.save();
        try {
          ctx.globalAlpha = prevAlphaRef.current;
          ctx.translate(0, -(1 - prevAlphaRef.current) * 4);
          MODE_RENDERERS[prevIdRef.current](renderPayload);
        } finally {
          ctx.restore();
        }
      }

      // Active mathematical scene with subtle vertical settle
      let metricText = "";
      ctx.save();
      try {
        ctx.globalAlpha = blendAlphaRef.current;
        ctx.translate(0, (1 - blendAlphaRef.current) * 4);
        const renderer = MODE_RENDERERS[activeIdRef.current];
        metricText = renderer(renderPayload);
      } finally {
        ctx.restore();
      }

      ctx.restore();

      if (liveMetricRef.current && metricText) {
        liveMetricRef.current.textContent = metricText;
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (!isStageHovered) setIsStageHovered(true);
    if (!cursorActiveRef.current && hoverAlphaRef.current < 0.05) {
      smoothCursorRef.current = { x, y };
    }
    cursorActiveRef.current = true;
    cursorPosRef.current = { x, y };
    targetParallaxRef.current = {
      x: Math.max(-1, Math.min(1, (x - rect.width / 2) / (rect.width / 2))),
      y: Math.max(-1, Math.min(1, (y - rect.height / 2) / (rect.height / 2))),
    };
  };

  const handleStageMouseLeave = () => {
    setIsStageHovered(false);
    cursorActiveRef.current = false;
    targetParallaxRef.current = { x: 0, y: 0 };
  };

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const nextEvent: ImpulseEvent = {
      id: impulseCounterRef.current++,
      x,
      y,
      normX: x / Math.max(1, rect.width),
      normY: y / Math.max(1, rect.height),
      age: 0,
    };
    impulsesRef.current = [...impulsesRef.current.slice(-3), nextEvent];
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Expansive Live Simulation Stage */}
      <div
        ref={stageRef}
        onMouseMove={handleStageMouseMove}
        onMouseLeave={handleStageMouseLeave}
        onClick={handleStageClick}
        title="Gerakkan kursor untuk inspeksi · Klik untuk injeksi impuls dinamik"
        className="relative w-full h-[376px] sm:h-[428px] overflow-hidden select-none cursor-crosshair bg-[#0F0D0C]"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Quiet Top Gradient Scrim + Editorial Module Metadata */}
        <div className="pointer-events-none absolute inset-x-0 top-0 px-3.5 sm:px-4 py-2 flex items-center justify-between gap-2 bg-gradient-to-b from-[#0F0D0C]/92 via-[#0F0D0C]/52 to-transparent">
          <div className="flex items-center gap-2 min-w-0">
            <span className="hidden sm:inline font-mono text-[9.5px] font-medium text-[#78716C] shrink-0">
              {activeEngine.moduleCode}
            </span>
            <span className="hidden sm:inline text-[#44403C] text-[9px] shrink-0">/</span>
            <motion.span
              key={activeEngine.id}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: EASE_SMOOTH }}
              className="font-mono text-[10px] sm:text-[11px] font-medium text-[#E5C194]/92 tracking-tight truncate"
            >
              {activeEngine.formula}
            </motion.span>
          </div>

          <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] sm:text-[10px] font-medium text-[#34D399]/92 tabular-nums shrink-0">
            <span
              className={`w-1.5 h-1.5 rounded-full bg-[#34D399] ${
                isManuallyPaused || prefersReduced ? "opacity-40" : "opacity-90"
              }`}
            />
            <span ref={liveMetricRef}>{activeEngine.initialMetric}</span>
          </span>
        </div>

        {/* Integrated Bottom Scrim: Context Caption, Color Legend, & Subtle Controls */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-3.5 sm:px-4 pt-5 pb-2 bg-gradient-to-t from-[#0F0D0C]/94 via-[#0F0D0C]/68 to-transparent flex items-end justify-between gap-2.5">
          <div className="min-w-0">
            <motion.p
              key={`${activeEngine.id}-cap`}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: EASE_SMOOTH }}
              className="text-[11px] text-[#D6D3D1]/88 leading-snug truncate"
            >
              {activeEngine.caption}
            </motion.p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
              {activeEngine.legend.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 font-mono text-[9.5px] text-[#8C857F]"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.label}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-1 shrink-0">
            <span
              className={`hidden md:inline-block font-mono text-[9.5px] tracking-wide transition-colors duration-200 mr-1 ${
                isStageHovered ? "text-[#D4664A]/90" : "text-[#78716C]/75"
              }`}
            >
              {isStageHovered ? activeEngine.clickHint : "Hover · Klik"}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPinned((prev) => !prev);
              }}
              aria-label={isPinned ? "Aktifkan rotasi otomatis modul" : "Kunci modul simulasi aktif"}
              title={
                isPinned
                  ? "Modul dikunci · Klik untuk lanjutkan rotasi otomatis"
                  : "Rotasi otomatis aktif · Klik untuk kunci modul ini"
              }
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[9.5px] transition-colors cursor-pointer ${
                isPinned
                  ? "bg-[#241B17]/90 border border-[#D4664A]/40 text-[#E5C194]"
                  : "border border-transparent text-[#8C857F] hover:bg-[#1C1917]/80 hover:border-[#292524] hover:text-[#D6D3D1]"
              }`}
            >
              {isPinned ? (
                <>
                  <Lock className="w-2.5 h-2.5 text-[#D4664A]" />
                  <span>Pin</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-2.5 h-2.5 text-[#34D399]/80" />
                  <span>Auto</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsManuallyPaused((prev) => !prev);
              }}
              aria-label={isManuallyPaused ? "Lanjutkan simulasi" : "Jeda simulasi untuk inspeksi"}
              title={isManuallyPaused ? "Lanjutkan simulasi" : "Jeda simulasi untuk inspeksi"}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[9.5px] transition-colors cursor-pointer ${
                isManuallyPaused
                  ? "bg-[#1C1917]/90 border border-[#3A3431] text-[#E7E5E4]"
                  : "border border-transparent text-[#8C857F] hover:bg-[#1C1917]/80 hover:border-[#292524] hover:text-[#D6D3D1]"
              }`}
            >
              {isManuallyPaused ? (
                <>
                  <Play className="w-2.5 h-2.5 text-[#34D399]" />
                  <span>Play</span>
                </>
              ) : (
                <>
                  <Pause className="w-2.5 h-2.5 text-[#E5C194]/80" />
                  <span>Jeda</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Smooth 2px Progress Bar Showing Auto-Showcase Timing */}
      <div className="relative h-[2px] w-full bg-[#24201D] overflow-hidden">
        {!isCycleFrozen ? (
          <motion.div
            key={activeEngine.id}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: CYCLE_DURATION_MS / 1000, ease: "linear" }}
            className="h-full w-full bg-[#D4664A]/85 origin-left"
          />
        ) : (
          <div
            className={`h-full w-full transition-colors duration-200 ${
              isPinned ? "bg-[#D4664A]" : "bg-[#D4664A]/45"
            }`}
          />
        )}
      </div>

      {/* Clean Interactive 6-Topic Lab Dock */}
      <div
        onMouseEnter={() => setIsDockHovered(true)}
        onMouseLeave={() => setIsDockHovered(false)}
        className="px-2.5 sm:px-3.5 py-3 bg-[#110F0D] grid grid-cols-3 sm:grid-cols-6 gap-1.5"
      >
        {COMPUTE_ENGINES.map((engine, idx) => {
          const IconComponent = engine.icon;
          const isActive = activeIndex === idx;

          return (
            <button
              key={engine.id}
              type="button"
              onMouseEnter={() => setActiveIndex(idx)}
              onFocus={() => {
                setIsDockHovered(true);
                setActiveIndex(idx);
              }}
              onBlur={() => setIsDockHovered(false)}
              onClick={() => {
                setActiveIndex(idx);
                setIsPinned(true);
              }}
              aria-pressed={isActive}
              title={`${engine.name} — ${engine.title}`}
              className="relative flex flex-col items-center justify-center gap-1.5 py-2 px-1 rounded-xl transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4664A] group"
            >
              {isActive && (
                <motion.div
                  layoutId="computeDockActive"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-[#1F1B18] border border-[#D4664A]/55 shadow-[inset_0_1px_0_rgba(255,248,240,0.06)]"
                />
              )}
              <IconComponent
                className={`relative z-10 w-4 h-4 transition-all duration-200 ${
                  isActive
                    ? "scale-110 opacity-100"
                    : "opacity-75 group-hover:opacity-100 group-hover:-translate-y-0.5"
                }`}
                style={{ color: isActive ? engine.color : "#C7C0B9" }}
              />
              <span
                className={`relative z-10 text-[10.5px] font-medium leading-none tracking-tight transition-colors duration-150 ${
                  isActive
                    ? "text-[#F5F5F4]"
                    : "text-[#8C857F] group-hover:text-[#D6D3D1]"
                }`}
              >
                {engine.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
