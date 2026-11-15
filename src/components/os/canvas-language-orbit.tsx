"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    role: "Kernel AI & Sains",
    telemetry: "Komputasi vektor NumPy, SciPy, dan diferensiasi otomatis",
    color: "#FBBF24",
    accentGlow: "rgba(251, 191, 36, 0.75)",
    icon: SiPython,
  },
  {
    id: "pytorch",
    name: "PyTorch",
    version: "2.5",
    role: "Deep Learning",
    telemetry: "Graf tensor dinamis dan akselerasi kompilasi JIT",
    color: "#FB7185",
    accentGlow: "rgba(251, 113, 133, 0.75)",
    icon: SiPytorch,
  },
  {
    id: "rust",
    name: "Rust",
    version: "2024",
    role: "Akselerator WASM",
    telemetry: "Komputasi paralel aman memori tanpa beban runtime",
    color: "#EA7A58",
    accentGlow: "rgba(234, 122, 88, 0.75)",
    icon: SiRust,
  },
  {
    id: "typescript",
    name: "TypeScript",
    version: "5.7",
    role: "Antarmuka Reaktif",
    telemetry: "Visualisasi model interaktif dan notebook web type-safe",
    color: "#38BDF8",
    accentGlow: "rgba(56, 189, 248, 0.75)",
    icon: SiTypescript,
  },
  {
    id: "cpp",
    name: "C++",
    version: "20/CUDA",
    role: "Mesin Matriks GPU",
    telemetry: "Kernel CUDA latensi rendah dan operasi aljabar linear",
    color: "#93C5FD",
    accentGlow: "rgba(147, 197, 253, 0.75)",
    icon: SiCplusplus,
  },
  {
    id: "julia",
    name: "Julia",
    version: "1.10",
    role: "Komputasi Ilmiah",
    telemetry: "Simulasi persamaan diferensial dan numerik berkinerja tinggi",
    color: "#C084FC",
    accentGlow: "rgba(192, 132, 252, 0.75)",
    icon: SiJulia,
  },
  {
    id: "go",
    name: "Go",
    version: "1.23",
    role: "Pipeline MLOps",
    telemetry: "Orkestrasi layanan konkurensi dan streaming gRPC",
    color: "#22D3EE",
    accentGlow: "rgba(34, 211, 238, 0.75)",
    icon: SiGo,
  },
  {
    id: "r",
    name: "R",
    version: "4.4",
    role: "Statistika Formal",
    telemetry: "Inferensi statistik, pemodelan linear, dan ekonometrika",
    color: "#60A5FA",
    accentGlow: "rgba(96, 165, 250, 0.75)",
    icon: SiR,
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    version: "17",
    role: "Basis Data Vektor",
    telemetry: "Indeks vektor pgvector dan pencarian semantik hibrida",
    color: "#7DD3FC",
    accentGlow: "rgba(125, 211, 252, 0.75)",
    icon: SiPostgresql,
  },
  {
    id: "bash",
    name: "Bash",
    version: "5.2",
    role: "Otomasi Cluster",
    telemetry: "Eksekusi skrip UNIX dan penjadwalan job komputasi",
    color: "#4ADE80",
    accentGlow: "rgba(74, 222, 128, 0.75)",
    icon: SiGnubash,
  },
  {
    id: "tensorflow",
    name: "TensorFlow",
    version: "2.18",
    role: "Edge & Mobile AI",
    telemetry: "Kompilasi XLA dan inferensi model terkuantisasi",
    color: "#FB923C",
    accentGlow: "rgba(251, 146, 60, 0.75)",
    icon: SiTensorflow,
  },
  {
    id: "docker",
    name: "Docker",
    version: "27",
    role: "Sandbox Riset",
    telemetry: "Isolasi lingkungan eksekusi kode yang dapat direproduksi",
    color: "#38BDF8",
    accentGlow: "rgba(56, 189, 248, 0.75)",
    icon: SiDocker,
  },
];

// 12 Platonic Regular Icosahedron vertices normalized onto R = 88
// Ensures equal ~63.4 deg separation between every neighboring node (zero polar crowding)
const SPHERE_RADIUS = 88;
const ICOSAHEDRON_POINTS = (() => {
  const phi = (1 + Math.sqrt(5)) / 2;
  const raw: [number, number, number][] = [
    [0, 1, phi],
    [phi, 0, 1],
    [-1, phi, 0],
    [-phi, 0, 1],
    [0, -1, phi],
    [1, phi, 0],
    [0, 1, -phi],
    [1, -phi, 0],
    [-phi, 0, -1],
    [0, -1, -phi],
    [-1, -phi, 0],
    [phi, 0, -1],
  ];
  const invLen = 1 / Math.sqrt(1 + phi * phi);
  return raw.map(([x, y, z]) => ({
    x: x * invLen * SPHERE_RADIUS,
    y: y * invLen * SPHERE_RADIUS,
    z: z * invLen * SPHERE_RADIUS,
  }));
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
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [hoveredNode, setHoveredNode] = useState<LanguageNode | null>(null);
  const [spotlightNode, setSpotlightNode] = useState<LanguageNode>(
    POLYGLOT_LANGUAGES[0]
  );

  const userHoverIdRef = useRef<string | null>(null);
  const spotlightIdRef = useRef<string>(POLYGLOT_LANGUAGES[0].id);
  const lastInteractionAtRef = useRef<number>(0);

  // Physics & drag states (rad and rad/sec)
  const isDraggingRef = useRef<boolean>(false);
  const lastPointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Balanced tilted 3D orientation
  const sphereRotXRef = useRef<number>(0.26);
  const sphereRotYRef = useRef<number>(0.42);
  const sphereRotZRef = useRef<number>(0.12);

  // Subtle camera parallax tilt (±7 deg = ±0.12 rad)
  const targetParallaxXRef = useRef<number>(0);
  const targetParallaxYRef = useRef<number>(0);
  const currentParallaxXRef = useRef<number>(0);
  const currentParallaxYRef = useRef<number>(0);

  // Angular cruise velocity in rad/sec
  const autoCruiseSpeedRef = useRef<number>(0.26);
  const targetCruiseSpeedRef = useRef<number>(0.26);

  // Per-node smooth lerped visual state + radial vector animation
  const nodeScalesRef = useRef<number[]>(POLYGLOT_LANGUAGES.map(() => 0.95));
  const nodeOpacitiesRef = useRef<number[]>(POLYGLOT_LANGUAGES.map(() => 0.85));
  const frontNodesRef = useRef<{ id: string; z: number }[]>([]);
  const beamProgressRef = useRef<number>(0);
  const prevBeamNodeIdRef = useRef<string | null>(null);

  const activeNode = hoveredNode ?? spotlightNode;

  const onNodeHoverRef = useRef(onNodeHover);
  useEffect(() => {
    onNodeHoverRef.current = onNodeHover;
  }, [onNodeHover]);

  // Keep parent inspector in sync with whichever node is active (hovered or spotlit)
  useEffect(() => {
    onNodeHoverRef.current?.(activeNode);
  }, [activeNode]);

  // Smooth idle spotlight cycle restricted to crisp foreground nodes
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (userHoverIdRef.current || isDraggingRef.current) return;
      if (performance.now() - lastInteractionAtRef.current < 1600) return;

      const frontCandidates = frontNodesRef.current.filter(
        (n) => n.id !== spotlightIdRef.current
      );
      let nextNode: LanguageNode | undefined;

      if (frontCandidates.length > 0) {
        // Pick a crisp foreground candidate cleanly cycling through the list order
        const currentIdx = POLYGLOT_LANGUAGES.findIndex(
          (n) => n.id === spotlightIdRef.current
        );
        for (let offset = 1; offset <= POLYGLOT_LANGUAGES.length; offset++) {
          const cand =
            POLYGLOT_LANGUAGES[(currentIdx + offset) % POLYGLOT_LANGUAGES.length];
          if (frontCandidates.some((f) => f.id === cand.id)) {
            nextNode = cand;
            break;
          }
        }
      }

      if (!nextNode) {
        const currentIdx = POLYGLOT_LANGUAGES.findIndex(
          (n) => n.id === spotlightIdRef.current
        );
        nextNode =
          POLYGLOT_LANGUAGES[(currentIdx + 1) % POLYGLOT_LANGUAGES.length];
      }

      spotlightIdRef.current = nextNode.id;
      setSpotlightNode(nextNode);
    }, 3200);

    return () => window.clearInterval(timer);
  }, []);

  const handleNodeMouseEnter = (node: LanguageNode) => {
    userHoverIdRef.current = node.id;
    spotlightIdRef.current = node.id;
    lastInteractionAtRef.current = performance.now();
    setHoveredNode(node);
    setSpotlightNode(node);
    targetCruiseSpeedRef.current = 0.035;
  };

  const handleNodeMouseLeave = () => {
    userHoverIdRef.current = null;
    lastInteractionAtRef.current = performance.now();
    setHoveredNode(null);
    targetCruiseSpeedRef.current = 0.26;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    lastInteractionAtRef.current = performance.now();
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

      targetParallaxYRef.current = Math.max(-1, Math.min(1, normX)) * 0.12;
      targetParallaxXRef.current = -Math.max(-1, Math.min(1, normY)) * 0.12;
    }

    if (!isDraggingRef.current) return;

    const dx = e.clientX - lastPointerPosRef.current.x;
    const dy = e.clientY - lastPointerPosRef.current.y;
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };

    const dragSensitivity = 0.0075;
    const stepX = dx * dragSensitivity;
    const stepY = dy * dragSensitivity;

    sphereRotYRef.current += stepX;
    sphereRotXRef.current -= stepY;

    // Velocity smoothed in rad/sec (~60fps base scaled)
    velocityRef.current = {
      x: velocityRef.current.x * 0.5 + stepX * 52 * 0.5,
      y: velocityRef.current.y * 0.5 + stepY * 52 * 0.5,
    };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    lastInteractionAtRef.current = performance.now();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleContainerMouseLeave = () => {
    targetParallaxXRef.current = 0;
    targetParallaxYRef.current = 0;
    handleNodeMouseLeave();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = container.clientWidth || 380;
    let height = container.clientHeight || 288;
    let dpr = Math.min(3, window.devicePixelRatio || 1);

    const updateSize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width) || 380;
      height = Math.floor(rect.height) || 288;
      dpr = Math.min(3, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    const rotatePoint3D = (
      p: { x: number; y: number; z: number },
      rx: number,
      ry: number,
      rz: number
    ) => {
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y1 = p.y * cosX - p.z * sinX;
      const z1 = p.y * sinX + p.z * cosX;

      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x2 = p.x * cosY + z1 * sinY;
      const z2 = -p.x * sinY + z1 * cosY;

      const cosZ = Math.cos(rz);
      const sinZ = Math.sin(rz);
      const x3 = x2 * cosZ - y1 * sinZ;
      const y3 = x2 * sinZ + y1 * cosZ;

      return { x: x3, y: y3, z: z2 };
    };

    const fov = 340;
    const projectCamera = (
      p: { x: number; y: number; z: number },
      cx: number,
      cy: number
    ) => {
      const scale = fov / (fov - p.z);
      return {
        px: cx + p.x * scale,
        py: cy + p.y * scale,
        scale,
        z: p.z,
      };
    };

    // Generate crisp wireframe rings: Equator, 2 Tropics, 2 Orthogonal Meridians
    const RING_SAMPLES = 64;
    const wireframeRings: { x: number; y: number; z: number }[][] = [];

    const evalRingPoint = (ringIdx: number, angle: number) => {
      const tropicY = SPHERE_RADIUS * 0.5;
      const rTropic = Math.sqrt(
        SPHERE_RADIUS * SPHERE_RADIUS - tropicY * tropicY
      );
      if (ringIdx === 0) {
        return {
          x: Math.cos(angle) * SPHERE_RADIUS,
          y: 0,
          z: Math.sin(angle) * SPHERE_RADIUS,
        };
      }
      if (ringIdx === 1) {
        return {
          x: Math.cos(angle) * rTropic,
          y: -tropicY,
          z: Math.sin(angle) * rTropic,
        };
      }
      if (ringIdx === 2) {
        return {
          x: Math.cos(angle) * rTropic,
          y: tropicY,
          z: Math.sin(angle) * rTropic,
        };
      }
      if (ringIdx === 3) {
        return {
          x: Math.cos(angle) * SPHERE_RADIUS,
          y: Math.sin(angle) * SPHERE_RADIUS,
          z: 0,
        };
      }
      return {
        x: 0,
        y: Math.sin(angle) * SPHERE_RADIUS,
        z: Math.cos(angle) * SPHERE_RADIUS,
      };
    };

    for (let r = 0; r < 5; r++) {
      const ring: { x: number; y: number; z: number }[] = [];
      for (let s = 0; s < RING_SAMPLES; s++) {
        ring.push(evalRingPoint(r, (s / RING_SAMPLES) * Math.PI * 2));
      }
      wireframeRings.push(ring);
    }

    let lastFrameTime = performance.now();
    let elapsed = 0;

    const render = () => {
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastFrameTime) * 0.001));
      lastFrameTime = now;
      elapsed += dt;

      // 1. Frame-rate independent smooth cruise & inertia physics
      if (!isDraggingRef.current) {
        const dragDecay = Math.pow(0.05, dt);
        velocityRef.current.x *= dragDecay;
        velocityRef.current.y *= dragDecay;

        sphereRotYRef.current += velocityRef.current.x * dt;
        sphereRotXRef.current -= velocityRef.current.y * dt;

        const speedEase = 1 - Math.exp(-5.5 * dt);
        autoCruiseSpeedRef.current +=
          (targetCruiseSpeedRef.current - autoCruiseSpeedRef.current) * speedEase;

        sphereRotYRef.current += autoCruiseSpeedRef.current * dt;
        sphereRotXRef.current +=
          Math.cos(elapsed * 0.35) * autoCruiseSpeedRef.current * 0.16 * dt;
      }

      // 2. Parallax camera damping
      const parEase = 1 - Math.exp(-8 * dt);
      currentParallaxXRef.current +=
        (targetParallaxXRef.current - currentParallaxXRef.current) * parEase;
      currentParallaxYRef.current +=
        (targetParallaxYRef.current - currentParallaxYRef.current) * parEase;

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

      // Gentle breathing ambient center warmth
      const glowAlpha = 0.075 + Math.sin(elapsed * 1.8) * 0.018;
      const ambientCore = ctx.createRadialGradient(
        cx,
        cy,
        4,
        cx,
        cy,
        SPHERE_RADIUS * 1.25
      );
      ambientCore.addColorStop(0, `rgba(212, 102, 74, ${glowAlpha.toFixed(3)})`);
      ambientCore.addColorStop(1, "rgba(212, 102, 74, 0)");
      ctx.fillStyle = ambientCore;
      ctx.beginPath();
      ctx.arc(cx, cy, SPHERE_RADIUS * 1.25, 0, Math.PI * 2);
      ctx.fill();

      const transformPoint = (p: { x: number; y: number; z: number }) => {
        const pRot = rotatePoint3D(p, rotX, rotY, rotZ);
        const pCam = rotatePoint3D(pRot, parX, parY, 0);
        return projectCamera(pCam, cx, cy);
      };

      const projectedRings = wireframeRings.map((pts) => pts.map(transformPoint));
      const projectedNodes = ICOSAHEDRON_POINTS.map((pt, index) => ({
        ...transformPoint(pt),
        index,
      }));

      // Track current crisp foreground candidates for idle auto-spotlight
      const currentFront: { id: string; z: number }[] = [];
      for (let i = 0; i < projectedNodes.length; i++) {
        if (projectedNodes[i].z > 14) {
          currentFront.push({
            id: POLYGLOT_LANGUAGES[i].id,
            z: projectedNodes[i].z,
          });
        }
      }
      frontNodesRef.current = currentFront;

      // PASS 1: Back Hemisphere Wireframe (clear legible depth hairlines)
      ctx.lineWidth = 0.95;
      for (let r = 0; r < projectedRings.length; r++) {
        const pts = projectedRings[r];
        ctx.strokeStyle =
          r === 0 ? "rgba(212, 102, 74, 0.16)" : "rgba(168, 162, 158, 0.14)";
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

      // PASS 2: Animated Architectural Center Core
      const reticleAngle = elapsed * 0.45;
      ctx.strokeStyle = "rgba(229, 193, 148, 0.28)";
      ctx.lineWidth = 1;
      for (let seg = 0; seg < 3; seg++) {
        const startA = reticleAngle + (seg * Math.PI * 2) / 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 17, startA, startA + 1.15);
        ctx.stroke();
      }

      const coreRadius = 8.5 + Math.sin(elapsed * 2.2) * 1.1;
      ctx.strokeStyle = "rgba(212, 102, 74, 0.48)";
      ctx.lineWidth = 1.15;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#D4664A";
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#F5F5F4";
      ctx.beginPath();
      ctx.arc(cx, cy, 1.1, 0, Math.PI * 2);
      ctx.fill();

      // PASS 3: Front Hemisphere Wireframe (Equator Terracotta, Meridians/Tropics Sand)
      for (let r = 0; r < projectedRings.length; r++) {
        const pts = projectedRings[r];
        ctx.lineWidth = r === 0 ? 1.3 : 1.0;
        ctx.strokeStyle =
          r === 0 ? "rgba(212, 102, 74, 0.36)" : "rgba(229, 193, 148, 0.22)";
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

      // PASS 4: Smooth 3D Orbital Tracer Beads gliding along Equator & Meridians
      const tracers = [
        { ringIdx: 0, headAngle: elapsed * 0.62, rgb: "212, 102, 74" },
        { ringIdx: 3, headAngle: elapsed * 0.46 + 2.1, rgb: "229, 193, 148" },
        { ringIdx: 4, headAngle: elapsed * 0.38 + 4.3, rgb: "224, 134, 107" },
      ];
      const TRAIL_STEPS = 12;
      const TRAIL_SPAN = 0.48;

      for (const tracer of tracers) {
        const trailPts = [];
        for (let t = 0; t <= TRAIL_STEPS; t++) {
          const a = tracer.headAngle - (t / TRAIL_STEPS) * TRAIL_SPAN;
          trailPts.push(transformPoint(evalRingPoint(tracer.ringIdx, a)));
        }
        ctx.lineWidth = 1.6;
        for (let t = 0; t < TRAIL_STEPS; t++) {
          const p1 = trailPts[t];
          const p2 = trailPts[t + 1];
          const fade = 1 - t / TRAIL_STEPS;
          const depthMod = p1.z >= 0 ? 0.72 : 0.22;
          ctx.strokeStyle = `rgba(${tracer.rgb}, ${(fade * depthMod).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.stroke();
        }
        const head = trailPts[0];
        ctx.fillStyle = `rgba(${tracer.rgb}, ${head.z >= 0 ? 0.95 : 0.38})`;
        ctx.beginPath();
        ctx.arc(head.px, head.py, head.z >= 0 ? 2.5 : 1.7, 0, Math.PI * 2);
        ctx.fill();
      }

      // PASS 5: Animated Radial Guide Vector to Active Node
      const activeId = userHoverIdRef.current ?? spotlightIdRef.current;
      if (activeId !== prevBeamNodeIdRef.current) {
        beamProgressRef.current = 0;
        prevBeamNodeIdRef.current = activeId;
      }
      const beamEase = 1 - Math.exp(-9 * dt);
      beamProgressRef.current += (1 - beamProgressRef.current) * beamEase;

      if (activeId) {
        const activeIdx = POLYGLOT_LANGUAGES.findIndex((n) => n.id === activeId);
        const np = activeIdx >= 0 ? projectedNodes[activeIdx] : undefined;
        if (np) {
          const tipX = cx + (np.px - cx) * beamProgressRef.current;
          const tipY = cy + (np.py - cy) * beamProgressRef.current;

          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(tipX, tipY);
          ctx.strokeStyle = userHoverIdRef.current
            ? "rgba(212, 102, 74, 0.72)"
            : "rgba(212, 102, 74, 0.45)";
          ctx.lineWidth = 1.3;
          ctx.stroke();

          if (beamProgressRef.current > 0.85) {
            ctx.fillStyle = "#E5C194";
            ctx.beginPath();
            ctx.arc(np.px, np.py, 2.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();

      // PASS 6: Lerped DOM Node Projection (silky scale & clarity)
      const isUserHovering = userHoverIdRef.current !== null;
      const nodeLerp = 1 - Math.exp(-12 * dt);

      for (let i = 0; i < projectedNodes.length; i++) {
        const el = nodeRefs.current[i];
        const np = projectedNodes[i];
        if (!el || !np) continue;

        const isNodeActive = activeId === POLYGLOT_LANGUAGES[i].id;
        const depthFactor = Math.max(
          0,
          Math.min(1, (np.z + SPHERE_RADIUS) / (2 * SPHERE_RADIUS))
        );

        const targetScale = isNodeActive ? 1.14 : 0.8 + depthFactor * 0.28;
        const baseOpacity = 0.52 + depthFactor * 0.48;
        const targetOpacity = isNodeActive
          ? 1.0
          : isUserHovering
            ? baseOpacity * 0.62
            : baseOpacity;

        nodeScalesRef.current[i] +=
          (targetScale - nodeScalesRef.current[i]) * nodeLerp;
        nodeOpacitiesRef.current[i] +=
          (targetOpacity - nodeOpacitiesRef.current[i]) * nodeLerp;

        const zIndex = isNodeActive ? 200 : Math.round(50 + np.z);

        el.style.transform = `translate3d(${np.px}px, ${np.py}px, 0px) translate(-50%, -50%) scale(${nodeScalesRef.current[i]})`;
        el.style.opacity = `${nodeOpacitiesRef.current[i]}`;
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
      className={`relative w-full h-[276px] sm:h-[296px] bg-transparent overflow-hidden select-none cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* 3D Animated Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 12 Crisp Obsidian Keycap Nodes */}
      {POLYGLOT_LANGUAGES.map((node, index) => {
        const IconComponent = node.icon;
        const isActive = activeNode?.id === node.id;

        return (
          <button
            type="button"
            key={node.id}
            ref={(el) => {
              nodeRefs.current[index] = el;
            }}
            onMouseEnter={() => handleNodeMouseEnter(node)}
            onMouseLeave={handleNodeMouseLeave}
            onFocus={() => handleNodeMouseEnter(node)}
            onBlur={handleNodeMouseLeave}
            onClick={() => handleNodeMouseEnter(node)}
            className="absolute top-0 left-0 cursor-pointer will-change-transform group pointer-events-auto focus:outline-none"
            style={{
              transform: "translate3d(0px, 0px, 0px) translate(-50%, -50%)",
            }}
            aria-label={`${node.name} ${node.version} - ${node.role}`}
          >
            <div
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ease-out ${
                isActive
                  ? "bg-[#28221D] border border-[#D4664A] shadow-[0_0_0_3px_rgba(212,102,74,0.22),0_12px_26px_rgba(0,0,0,0.62),inset_0_1px_0_rgba(255,248,240,0.12)]"
                  : "bg-[#211C19]/95 border border-[#3B342E] hover:border-[#D4664A]/70 shadow-[0_6px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,248,240,0.08)]"
              }`}
            >
              <IconComponent
                className="w-[18px] h-[18px] transition-transform duration-200 ease-out group-hover:scale-105"
                style={{ color: node.color }}
              />
            </div>

            {/* Smooth Single Active Label Pill (Zero Collision) */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 3, scale: 0.94 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap font-sans text-[11px] font-medium leading-none px-2.5 py-1 rounded-md bg-[#1C1917]/95 text-[#F5F5F4] border border-[#D4664A]/55 shadow-lg pointer-events-none"
                >
                  {node.name}
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}
