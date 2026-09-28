"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  SiPython,
  SiRust,
  SiTypescript,
  SiCplusplus,
  SiPytorch,
  SiJulia,
  SiGo,
  SiR,
  SiPostgresql,
  SiGnubash,
  SiTensorflow,
  SiDocker,
} from "react-icons/si";

export interface LanguageNode {
  id: string;
  name: string;
  version: string;
  role: string;
  telemetry: string;
  color: string;
  accentGlow: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

export const POLYGLOT_LANGUAGES: LanguageNode[] = [
  {
    id: "python",
    name: "Python",
    version: "3.12",
    role: "AI/ML & Scientific Kernel",
    telemetry: "Vectorized NumPy 2.0, SciPy 1.14 & Autograd JIT READY",
    color: "#F59E0B",
    accentGlow: "rgba(245, 158, 11, 0.75)",
    icon: SiPython,
  },
  {
    id: "rust",
    name: "Rust",
    version: "2024",
    role: "WASM & Memory-Safe Accelerator",
    telemetry: "WASM SIMD AVX-512 · Zero-Cost Memory Safety ACTIVE",
    color: "#C2553A",
    accentGlow: "rgba(194, 85, 58, 0.75)",
    icon: SiRust,
  },
  {
    id: "typescript",
    name: "TypeScript",
    version: "5.7",
    role: "Reactive UI & Type-Safe Client",
    telemetry: "Strictly Typed Reactive Canvas & Realtime OS AST READY",
    color: "#38BDF8",
    accentGlow: "rgba(56, 189, 248, 0.75)",
    icon: SiTypescript,
  },
  {
    id: "cpp",
    name: "C++",
    version: "20/CUDA",
    role: "Low-Latency GPU & BLAS Engine",
    telemetry: "CUDA 12.6 Kernels · Low-Latency cuBLAS Matrix LINKED",
    color: "#60A5FA",
    accentGlow: "rgba(96, 165, 250, 0.75)",
    icon: SiCplusplus,
  },
  {
    id: "pytorch",
    name: "PyTorch",
    version: "2.5",
    role: "Deep Learning & TorchDynamo Compiler",
    telemetry: "TorchDynamo JIT Graph & Inductor Triton Backends ONLINE",
    color: "#F87171",
    accentGlow: "rgba(248, 113, 113, 0.75)",
    icon: SiPytorch,
  },
  {
    id: "julia",
    name: "Julia",
    version: "1.10",
    role: "High-Throughput Matrix Science",
    telemetry: "Multiple Dispatch Differential Equations & BLAS VERIFIED",
    color: "#C084FC",
    accentGlow: "rgba(192, 132, 252, 0.75)",
    icon: SiJulia,
  },
  {
    id: "go",
    name: "Go",
    version: "1.23",
    role: "Distributed MLOps & High-Concurrency Pipelines",
    telemetry: "Goroutines Pipeline Orchestrator & gRPC Streams SYNCED",
    color: "#00ADD8",
    accentGlow: "rgba(0, 173, 216, 0.75)",
    icon: SiGo,
  },
  {
    id: "r",
    name: "R",
    version: "4.4",
    role: "Advanced Econometrics & Statistical Inference",
    telemetry: "CRAN Bioconductor Matrix · Linear Mixed-Effects VERIFIED",
    color: "#276DC3",
    accentGlow: "rgba(39, 109, 195, 0.75)",
    icon: SiR,
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    version: "17",
    role: "Vector Embeddings & pgvector Database",
    telemetry: "HNSW Cosine Vector Indexing · Hybrid Search OK",
    color: "#336791",
    accentGlow: "rgba(51, 103, 145, 0.75)",
    icon: SiPostgresql,
  },
  {
    id: "bash",
    name: "Bash",
    version: "5.2",
    role: "Unix Shell & Cloud AI Automation",
    telemetry: "POSIX Pipelines · Slurm Cluster Dispatcher READY",
    color: "#4EAA25",
    accentGlow: "rgba(78, 170, 37, 0.75)",
    icon: SiGnubash,
  },
  {
    id: "tensorflow",
    name: "TensorFlow",
    version: "2.18",
    role: "Edge AI & Mobile TFLite Inference",
    telemetry: "XLA Ahead-Of-Time Compiler & Quantized INT8 Models OK",
    color: "#FF6F00",
    accentGlow: "rgba(255, 111, 0, 0.75)",
    icon: SiTensorflow,
  },
  {
    id: "docker",
    name: "Docker",
    version: "27",
    role: "Scientific Reproducibility Containers",
    telemetry: "OCI Multi-Stage Sandbox · Reproducible Environment LOCKED",
    color: "#2496ED",
    accentGlow: "rgba(36, 150, 237, 0.75)",
    icon: SiDocker,
  },
];

// Pre-calculate 12 Fibonacci Sphere Unit Coordinates (Radius R = 72)
const SPHERE_RADIUS = 72;
const FIBONACCI_SPHERE_POINTS = (() => {
  const points: { x: number; y: number; z: number }[] = [];
  const N = POLYGLOT_LANGUAGES.length; // 12
  const phiGolden = 1.618033988749895;

  for (let i = 0; i < N; i++) {
    const yUnit = 1 - (i / (N - 1)) * 2; // from 1 to -1
    const radiusAtY = Math.sqrt(Math.max(0, 1 - yUnit * yUnit));
    const theta = (2 * Math.PI * i) / phiGolden;

    const xUnit = Math.cos(theta) * radiusAtY;
    const zUnit = Math.sin(theta) * radiusAtY;

    points.push({
      x: xUnit * SPHERE_RADIUS,
      y: yUnit * SPHERE_RADIUS,
      z: zUnit * SPHERE_RADIUS,
    });
  }
  return points;
})();

export interface CanvasLanguageOrbitProps {
  onNodeHover?: (node: LanguageNode | null) => void;
  className?: string;
}

export function CanvasLanguageOrbit({
  onNodeHover,
  className = "",
}: CanvasLanguageOrbitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredNode, setHoveredNode] = useState<LanguageNode | null>(null);
  const hoveredNodeIdRef = useRef<string | null>(null);

  // Mouse Drag & Physics Inertia States
  const isDraggingRef = useRef<boolean>(false);
  const lastPointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 3D Angles
  const sphereRotXRef = useRef<number>(0.25);
  const sphereRotYRef = useRef<number>(0.55);
  const sphereRotZRef = useRef<number>(0.08);

  // Parallax Tilt States (±12 deg = ±0.209 rad)
  const targetParallaxXRef = useRef<number>(0);
  const targetParallaxYRef = useRef<number>(0);
  const currentParallaxXRef = useRef<number>(0);
  const currentParallaxYRef = useRef<number>(0);

  // Speed regulation
  const autoCruiseSpeedRef = useRef<number>(0.0075);
  const targetCruiseSpeedRef = useRef<number>(0.0075);

  // Callback ref
  const onNodeHoverRef = useRef(onNodeHover);
  useEffect(() => {
    onNodeHoverRef.current = onNodeHover;
  }, [onNodeHover]);

  const handleNodeMouseEnter = (node: LanguageNode) => {
    hoveredNodeIdRef.current = node.id;
    setHoveredNode(node);
    targetCruiseSpeedRef.current = 0.0015; // Smooth slow motion on hover
    onNodeHoverRef.current?.(node);
  };

  const handleNodeMouseLeave = () => {
    hoveredNodeIdRef.current = null;
    setHoveredNode(null);
    targetCruiseSpeedRef.current = 0.0075; // Restore normal cruise
    onNodeHoverRef.current?.(null);
  };

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, y: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const normX = (mouseX - rect.width / 2) / (rect.width / 2);
      const normY = (mouseY - rect.height / 2) / (rect.height / 2);

      // Parallax Tilt target (±12 deg = ~0.209 rad)
      targetParallaxYRef.current = Math.max(-1, Math.min(1, normX)) * 0.209;
      targetParallaxXRef.current = -Math.max(-1, Math.min(1, normY)) * 0.209;
    }

    if (!isDraggingRef.current) return;

    const dx = e.clientX - lastPointerPosRef.current.x;
    const dy = e.clientY - lastPointerPosRef.current.y;
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };

    // Fluid sensitivity
    const dragSensitivity = 0.008;
    velocityRef.current = {
      x: dx * dragSensitivity,
      y: dy * dragSensitivity,
    };

    sphereRotYRef.current += dx * dragSensitivity;
    sphereRotXRef.current -= dy * dragSensitivity;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleContainerMouseLeave = () => {
    targetParallaxXRef.current = 0;
    targetParallaxYRef.current = 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = container.clientWidth || 340;
    let height = container.clientHeight || 195;
    let dpr = Math.min(3, window.devicePixelRatio || 1);

    const updateSize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width) || 340;
      height = Math.floor(rect.height) || 195;
      dpr = Math.min(3, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    const startTime = performance.now();

    // 3D rotation mathematical transforms
    const rotatePoint3D = (
      p: { x: number; y: number; z: number },
      rx: number,
      ry: number,
      rz: number
    ) => {
      // Rotate X
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y1 = p.y * cosX - p.z * sinX;
      const z1 = p.y * sinX + p.z * cosX;

      // Rotate Y
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x2 = p.x * cosY + z1 * sinY;
      const z2 = -p.x * sinY + z1 * cosY;

      // Rotate Z
      const cosZ = Math.cos(rz);
      const sinZ = Math.sin(rz);
      const x3 = x2 * cosZ - y1 * sinZ;
      const y3 = x2 * sinZ + y1 * cosZ;

      return { x: x3, y: y3, z: z2 };
    };

    // Camera Perspective projection (Focal Length fov = 220)
    const fov = 220;
    const projectCamera = (
      p: { x: number; y: number; z: number },
      cx: number,
      cy: number
    ) => {
      // p.z > 0 is closer to camera (Front), p.z < 0 is farther (Back)
      const scale = fov / (fov - p.z);
      return {
        px: cx + p.x * scale,
        py: cy + p.y * scale,
        scale,
        z: p.z,
      };
    };

    // Generate Celestial Sphere Rings (Equator, Tropics, and Longitude Meridians)
    const RING_SAMPLES = 40;
    const wireframeRings: { x: number; y: number; z: number }[][] = [];

    // Ring 0: Equator (y = 0, R = 72)
    const equator: { x: number; y: number; z: number }[] = [];
    for (let s = 0; s < RING_SAMPLES; s++) {
      const a = (s / RING_SAMPLES) * Math.PI * 2;
      equator.push({ x: Math.cos(a) * SPHERE_RADIUS, y: 0, z: Math.sin(a) * SPHERE_RADIUS });
    }
    wireframeRings.push(equator);

    // Ring 1: Tropic of Cancer (y = 36, r = sqrt(72^2 - 36^2) ≈ 62.35)
    const rTropic = Math.sqrt(SPHERE_RADIUS * SPHERE_RADIUS - 36 * 36);
    const tropicN: { x: number; y: number; z: number }[] = [];
    for (let s = 0; s < RING_SAMPLES; s++) {
      const a = (s / RING_SAMPLES) * Math.PI * 2;
      tropicN.push({ x: Math.cos(a) * rTropic, y: -36, z: Math.sin(a) * rTropic });
    }
    wireframeRings.push(tropicN);

    // Ring 2: Tropic of Capricorn (y = -36)
    const tropicS: { x: number; y: number; z: number }[] = [];
    for (let s = 0; s < RING_SAMPLES; s++) {
      const a = (s / RING_SAMPLES) * Math.PI * 2;
      tropicS.push({ x: Math.cos(a) * rTropic, y: 36, z: Math.sin(a) * rTropic });
    }
    wireframeRings.push(tropicS);

    // Longitude Meridians at 0, 60, and 120 degrees
    for (const mDeg of [0, 60, 120]) {
      const mRad = (mDeg * Math.PI) / 180;
      const meridian: { x: number; y: number; z: number }[] = [];
      for (let s = 0; s < RING_SAMPLES; s++) {
        const a = (s / RING_SAMPLES) * Math.PI * 2;
        // In local X-Y, circle around Z, then rotated by mRad around Y
        const lx = Math.cos(a) * SPHERE_RADIUS;
        const ly = Math.sin(a) * SPHERE_RADIUS;
        meridian.push({
          x: lx * Math.cos(mRad),
          y: ly,
          z: lx * Math.sin(mRad),
        });
      }
      wireframeRings.push(meridian);
    }

    const render = () => {
      const now = performance.now();
      const time = (now - startTime) * 0.001;

      // 1. Friction & Auto Cruise Physics
      if (!isDraggingRef.current) {
        // Friction damping 0.93
        velocityRef.current.x *= 0.93;
        velocityRef.current.y *= 0.93;
        sphereRotYRef.current += velocityRef.current.x;
        sphereRotXRef.current -= velocityRef.current.y;

        // Auto cruise rotation
        autoCruiseSpeedRef.current +=
          (targetCruiseSpeedRef.current - autoCruiseSpeedRef.current) * 0.06;
        sphereRotYRef.current += autoCruiseSpeedRef.current;
        sphereRotXRef.current += autoCruiseSpeedRef.current * 0.22;
        sphereRotZRef.current += autoCruiseSpeedRef.current * 0.12;
      }

      // 2. Parallax Lerp Damping
      currentParallaxXRef.current +=
        (targetParallaxXRef.current - currentParallaxXRef.current) * 0.08;
      currentParallaxYRef.current +=
        (targetParallaxYRef.current - currentParallaxYRef.current) * 0.08;

      const rotX = sphereRotXRef.current;
      const rotY = sphereRotYRef.current;
      const rotZ = sphereRotZRef.current;

      const parX = currentParallaxXRef.current;
      const parY = currentParallaxYRef.current;

      const cx = width / 2;
      const cy = height / 2;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // =========================================================================
      // VANISHING-POINT FLOOR GRID (Perspective Floor with Terracotta #C2553A/10)
      // =========================================================================
      const vpY = cy + 20;
      const floorBottom = height;
      ctx.strokeStyle = "rgba(194, 85, 58, 0.10)";
      ctx.lineWidth = 0.8;

      // Radial grid rays fanning out from vanishing point to floor
      const numRays = 9;
      for (let r = 0; r < numRays; r++) {
        const rayX = (width / (numRays - 1)) * r;
        ctx.beginPath();
        ctx.moveTo(cx, vpY);
        ctx.lineTo(rayX, floorBottom);
        ctx.stroke();
      }

      // Horizontal cross-lines with exponential depth perspective
      const numLines = 5;
      for (let l = 1; l <= numLines; l++) {
        const factor = Math.pow(l / numLines, 1.8);
        const lineY = vpY + factor * (floorBottom - vpY);
        const lineHalfWidth = (width / 2) * factor * 1.05;
        ctx.beginPath();
        ctx.moveTo(cx - lineHalfWidth, lineY);
        ctx.lineTo(cx + lineHalfWidth, lineY);
        ctx.stroke();
      }

      // Background subtle crosshair reticle
      ctx.strokeStyle = "rgba(61, 51, 42, 0.35)";
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.moveTo(cx - 55, cy);
      ctx.lineTo(cx + 55, cy);
      ctx.moveTo(cx, cy - 40);
      ctx.lineTo(cx, cy + 40);
      ctx.stroke();
      ctx.setLineDash([]);

      // Transform Helper: Sphere rotation -> Camera Parallax Tilt
      const transformPoint = (p: { x: number; y: number; z: number }) => {
        const pRot = rotatePoint3D(p, rotX, rotY, rotZ);
        // Apply camera parallax
        const pCam = rotatePoint3D(pRot, parX, parY, 0);
        return projectCamera(pCam, cx, cy);
      };

      // Transform all Wireframe Globe Rings
      const projectedRings: { px: number; py: number; z: number }[][] = [];
      for (let r = 0; r < wireframeRings.length; r++) {
        const pts = wireframeRings[r];
        const projPts: { px: number; py: number; z: number }[] = [];
        for (let s = 0; s < pts.length; s++) {
          projPts.push(transformPoint(pts[s]));
        }
        projectedRings.push(projPts);
      }

      // Transform 12 Fibonacci Nodes
      const projectedNodes: {
        px: number;
        py: number;
        scale: number;
        z: number;
        index: number;
      }[] = [];
      for (let i = 0; i < FIBONACCI_SPHERE_POINTS.length; i++) {
        const proj = transformPoint(FIBONACCI_SPHERE_POINTS[i]);
        projectedNodes.push({ ...proj, index: i });
      }

      // =========================================================================
      // PASS 1: DRAW BACKWARD GLOBE RINGS & LINES (Z < 0 - Atmospheric Depth)
      // =========================================================================
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = "rgba(194, 85, 58, 0.16)"; // Faint Terracotta
      ctx.setLineDash([2, 4]);

      for (let r = 0; r < projectedRings.length; r++) {
        const pts = projectedRings[r];
        for (let s = 0; s < pts.length; s++) {
          const p1 = pts[s];
          const p2 = pts[(s + 1) % pts.length];
          if (p1.z < 0 || p2.z < 0) {
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }
      ctx.setLineDash([]);

      // Faint radial guide beams to backward nodes
      for (let i = 0; i < projectedNodes.length; i++) {
        const np = projectedNodes[i];
        if (np.z >= 0) continue;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(np.px, np.py);
        ctx.strokeStyle = "rgba(194, 85, 58, 0.12)";
        ctx.lineWidth = 0.7;
        ctx.setLineDash([2, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // =========================================================================
      // PASS 2: VELQORA CENTRAL CORE (Pulsing Glow - Amber #F59E0B & Terracotta #C2553A)
      // =========================================================================
      const pulse1 = Math.sin(time * 3.4);
      const pulse2 = Math.cos(time * 2.8);
      const rAura1 = 28 + pulse1 * 5;
      const rAura2 = 42 + pulse2 * 6;

      // Dual radiation pulse auras
      // Aura 1: Amber radiation
      const amberAura = ctx.createRadialGradient(cx, cy, 2, cx, cy, rAura1);
      amberAura.addColorStop(0, "rgba(245, 158, 11, 0.50)");
      amberAura.addColorStop(0.5, "rgba(245, 158, 11, 0.15)");
      amberAura.addColorStop(1, "rgba(245, 158, 11, 0)");
      ctx.fillStyle = amberAura;
      ctx.beginPath();
      ctx.arc(cx, cy, rAura1, 0, Math.PI * 2);
      ctx.fill();

      // Aura 2: Terracotta expanding ripple
      const terraAura = ctx.createRadialGradient(cx, cy, 5, cx, cy, rAura2);
      terraAura.addColorStop(0, "rgba(194, 85, 58, 0.35)");
      terraAura.addColorStop(0.6, "rgba(194, 85, 58, 0.08)");
      terraAura.addColorStop(1, "rgba(194, 85, 58, 0)");
      ctx.fillStyle = terraAura;
      ctx.beginPath();
      ctx.arc(cx, cy, rAura2, 0, Math.PI * 2);
      ctx.fill();

      // Sonar ripple rings propagating outward
      for (let w = 0; w < 2; w++) {
        const wave = (time * 19 + w * 18) % 40;
        const waveAlpha = Math.max(0, 1 - wave / 40) * 0.35;
        ctx.strokeStyle = `rgba(245, 158, 11, ${waveAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 8 + wave, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Central rotating micro-diamond crystal core
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.85);

      const dSize = 7 + pulse1 * 1.2;
      ctx.fillStyle = "#C2553A"; // Terracotta
      ctx.strokeStyle = "#F59E0B"; // Amber
      ctx.lineWidth = 1.4;
      ctx.shadowColor = "#F59E0B";
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(0, -dSize);
      ctx.lineTo(dSize, 0);
      ctx.lineTo(0, dSize);
      ctx.lineTo(-dSize, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.restore();

      // Pure white central nexus point
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fill();

      // =========================================================================
      // PASS 3: FOREWARD GLOBE RINGS & LINES (Z >= 0 - Glowing Amber Front)
      // =========================================================================
      ctx.lineWidth = 1.3;
      ctx.strokeStyle = "rgba(245, 158, 11, 0.50)"; // Luminous Amber
      ctx.shadowColor = "rgba(245, 158, 11, 0.40)";
      ctx.shadowBlur = 5;

      for (let r = 0; r < projectedRings.length; r++) {
        const pts = projectedRings[r];
        for (let s = 0; s < pts.length; s++) {
          const p1 = pts[s];
          const p2 = pts[(s + 1) % pts.length];
          if (p1.z >= 0 && p2.z >= 0) {
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }
      ctx.shadowBlur = 0;

      // Foreward radial laser beams & energy transmission
      for (let i = 0; i < projectedNodes.length; i++) {
        const np = projectedNodes[i];
        if (np.z < 0) continue;

        const isHovered = hoveredNodeIdRef.current === POLYGLOT_LANGUAGES[i].id;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(np.px, np.py);

        if (isHovered) {
          // Intense Laser Beam with Traveling Photons
          ctx.strokeStyle = "rgba(245, 158, 11, 0.95)";
          ctx.lineWidth = 2.2;
          ctx.shadowColor = "#F59E0B";
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.shadowBlur = 0;

          const packetT = (time * 3.0) % 1;
          const pxT = cx + (np.px - cx) * packetT;
          const pyT = cy + (np.py - cy) * packetT;
          ctx.fillStyle = "#FFFFFF";
          ctx.shadowColor = "#F59E0B";
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(pxT, pyT, 2.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.strokeStyle = "rgba(245, 158, 11, 0.22)";
          ctx.lineWidth = 0.8;
          ctx.setLineDash([2, 5]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      ctx.restore();

      // =========================================================================
      // PASS 4: UPDATE REACT DOM NODES (True 3D Camera Perspective & DoF Scale)
      // =========================================================================
      for (let i = 0; i < projectedNodes.length; i++) {
        const el = nodeRefs.current[i];
        const np = projectedNodes[i];
        if (!el || !np) continue;

        const isHovered = hoveredNodeIdRef.current === POLYGLOT_LANGUAGES[i].id;

        // Front (Z > 0): scale up to 1.35x, opacity 1.0, high z-index
        // Back (Z < 0): scale down to 0.55x, atmospheric depth fade (opacity down to 0.35)
        const depthFactor = (np.z + SPHERE_RADIUS) / (2 * SPHERE_RADIUS); // 0 at back, 1 at front

        const targetScale = isHovered
          ? Math.max(0.9, np.scale * 1.25)
          : Math.max(0.55, Math.min(1.35, np.scale));

        const targetOpacity = isHovered
          ? 1.0
          : Math.max(0.35, Math.min(1.0, 0.35 + depthFactor * 0.65));

        const zIndex = isHovered ? 200 : Math.round(50 + np.z);

        el.style.transform = `translate3d(${np.px}px, ${np.py}px, 0px) translate(-50%, -50%) scale(${targetScale})`;
        el.style.opacity = `${targetOpacity}`;
        el.style.zIndex = `${zIndex}`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseLeave={handleContainerMouseLeave}
      className={`relative w-full h-[195px] sm:h-[205px] bg-[#14110F] rounded-xs border border-[#3D332A] overflow-hidden select-none cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* Top Left: Holographic Sphere Header */}
      <div className="absolute top-2 left-2 font-mono text-[9px] text-[#C2553A] tracking-wider select-none flex items-center gap-1.5 z-30 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C2553A] animate-pulse" />
        <span>SPHERE: CELESTIAL_3D_PERSPECTIVE</span>
      </div>

      {/* Top Right: Status Badge */}
      <div className="absolute top-2 right-2 font-mono text-[9px] text-amber-500/80 tracking-wider select-none z-30 pointer-events-none">
        FOV: 220 · 60FPS [HD]
      </div>

      {/* Bottom Left: Interactive Hint */}
      <div className="absolute bottom-2 left-2 font-mono text-[9px] text-[#A89F91]/70 tracking-wider select-none z-30 pointer-events-none flex items-center gap-1">
        <span>DRAG TO ROTATE · PARALLAX 3D</span>
      </div>

      {/* Bottom Right: Active Engine Lock Telemetry */}
      <div className="absolute bottom-2 right-2 font-mono text-[9px] tracking-wider select-none z-30 pointer-events-none font-bold">
        {hoveredNode ? (
          <span className="text-amber-400">
            LOCK: {hoveredNode.name.toUpperCase()} · {hoveredNode.version}
          </span>
        ) : (
          <span className="text-emerald-500/80">12 ENGINES ONLINE</span>
        )}
      </div>

      {/* 3D Canvas Layer with DPR HD Calibration */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 12 Interactive Language Node DOM Elements */}
      {POLYGLOT_LANGUAGES.map((node, index) => {
        const IconComponent = node.icon;
        const isHovered = hoveredNode?.id === node.id;

        return (
          <div
            key={node.id}
            ref={(el) => {
              nodeRefs.current[index] = el;
            }}
            onMouseEnter={() => handleNodeMouseEnter(node)}
            onMouseLeave={handleNodeMouseLeave}
            className="absolute top-0 left-0 cursor-pointer will-change-transform group pointer-events-auto"
            style={{
              transform: "translate3d(0px, 0px, 0px) translate(-50%, -50%)",
            }}
            aria-label={`${node.name} ${node.version} - ${node.role}`}
          >
            {/* Hex / Square Icon Container */}
            <div
              className={`relative flex items-center justify-center w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xs transition-colors duration-150 backdrop-blur-xs ${
                isHovered
                  ? "bg-[#1F1916] border-2 border-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.8)]"
                  : "bg-[#181412]/90 border border-[#3D332A] hover:border-amber-500/70 shadow-[0_0_8px_rgba(0,0,0,0.85)]"
              }`}
            >
              {/* Corner decorative notch */}
              <div
                className={`absolute -top-0.5 -right-0.5 w-1 h-1 ${
                  isHovered ? "bg-amber-400" : "bg-[#C2553A]/50"
                }`}
              />

              <IconComponent
                className="w-4 h-4 transition-transform duration-150"
                style={{
                  color: isHovered ? "#F59E0B" : node.color,
                  filter: isHovered
                    ? "drop-shadow(0 0 6px rgba(245, 158, 11, 0.95))"
                    : `drop-shadow(0 0 3px ${node.accentGlow})`,
                }}
              />
            </div>

            {/* Micro Monospace Label under Node */}
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 mt-0.5 whitespace-nowrap font-mono text-[7.5px] tracking-tight px-1 py-0.2 rounded-2xs border transition-all duration-150 pointer-events-none ${
                isHovered
                  ? "bg-[#1C1917] text-amber-300 border-amber-500/70 font-bold shadow-[0_0_8px_rgba(245,158,11,0.5)] opacity-100"
                  : "bg-[#14110F]/85 text-[#A89F91] border-[#3D332A]/50 group-hover:text-white"
              }`}
            >
              {node.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
