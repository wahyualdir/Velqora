"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import {
  SiPython,
  SiRust,
  SiTypescript,
  SiCplusplus,
  SiJulia,
  SiPytorch,
} from "react-icons/si";

export interface LanguageNode {
  id: string;
  name: string;
  version: string;
  role: string;
  tag: string;
  terminalInfo: string;
  color: string;
  accentGlow: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

export const POLYGLOT_LANGUAGES: LanguageNode[] = [
  {
    id: "python",
    name: "Python",
    version: "3.12",
    role: "AI/ML Core",
    tag: "Vectorized NumPy, SciPy & Autograd",
    terminalInfo: "[$ PYTHON 3.12] Vectorized NumPy, SciPy & Autograd READY",
    color: "#387EB8",
    accentGlow: "rgba(56, 126, 184, 0.7)",
    icon: SiPython,
  },
  {
    id: "rust",
    name: "Rust",
    version: "2024",
    role: "WASM Accelerator",
    tag: "WASM SIMD, Memory Safety & Zero-Cost",
    terminalInfo: "[$ RUST 2024] WASM SIMD Memory Accelerator · Zero-Cost Abstraction ACTIVE",
    color: "#DEA584",
    accentGlow: "rgba(222, 165, 132, 0.7)",
    icon: SiRust,
  },
  {
    id: "typescript",
    name: "TypeScript",
    version: "5.7",
    role: "Reactive UI",
    tag: "Strictly Typed AST & Reactive Canvas",
    terminalInfo: "[$ TYPESCRIPT 5.7] Strictly Typed Reactive Canvas & Realtime OS AST READY",
    color: "#3178C6",
    accentGlow: "rgba(49, 120, 198, 0.7)",
    icon: SiTypescript,
  },
  {
    id: "cpp",
    name: "C++",
    version: "20/CUDA",
    role: "High-Speed Engine",
    tag: "Low-Latency Matrix Multiplication & CUDA",
    terminalInfo: "[$ C++20/CUDA] Low-Latency Matrix Multiplication & Tensor Ops LINKED",
    color: "#659AD2",
    accentGlow: "rgba(101, 154, 210, 0.7)",
    icon: SiCplusplus,
  },
  {
    id: "julia",
    name: "Julia",
    version: "1.10",
    role: "Scientific Matrix",
    tag: "Multiple Dispatch & Differential Equations",
    terminalInfo: "[$ JULIA 1.10] Multiple Dispatch Differential Equations & BLAS VERIFIED",
    color: "#A270BD",
    accentGlow: "rgba(162, 112, 189, 0.7)",
    icon: SiJulia,
  },
  {
    id: "pytorch",
    name: "PyTorch",
    version: "2.5",
    role: "Tensor Compiler",
    tag: "TorchDynamo JIT Graph & Triton Backends",
    terminalInfo: "[$ PYTORCH 2.5] TorchDynamo JIT Graph & Inductor Triton Backends ONLINE",
    color: "#EE4C2C",
    accentGlow: "rgba(238, 76, 44, 0.7)",
    icon: SiPytorch,
  },
];

interface RingDef {
  incX: number;
  incY: number;
  incZ: number;
  radiusA: number;
  radiusB: number;
  nodeIndices: [number, number];
  phaseOffsets: [number, number];
}

const ORBIT_RINGS: RingDef[] = [
  // Ring 0: Python (0) & Rust (1)
  {
    incX: 0.52,
    incY: 0.22,
    incZ: -0.32,
    radiusA: 104,
    radiusB: 58,
    nodeIndices: [0, 1],
    phaseOffsets: [0, Math.PI],
  },
  // Ring 1: TypeScript (2) & C++ (3)
  {
    incX: -0.56,
    incY: -0.28,
    incZ: 0.42,
    radiusA: 110,
    radiusB: 62,
    nodeIndices: [2, 3],
    phaseOffsets: [Math.PI / 3, (4 * Math.PI) / 3],
  },
  // Ring 2: Julia (4) & PyTorch (5)
  {
    incX: 0.26,
    incY: 0.65,
    incZ: 0.72,
    radiusA: 100,
    radiusB: 54,
    nodeIndices: [4, 5],
    phaseOffsets: [(2 * Math.PI) / 3, (5 * Math.PI) / 3],
  },
];

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

  // Speed and rotation refs
  const speedRef = useRef<number>(0.011);
  const targetSpeedRef = useRef<number>(0.011);
  const orbitAngleRef = useRef<number>(0);
  const sysAngleXRef = useRef<number>(0.2);
  const sysAngleYRef = useRef<number>(0.4);
  const sysAngleZRef = useRef<number>(0.1);

  // Keep callback fresh in ref
  const onNodeHoverRef = useRef(onNodeHover);
  useEffect(() => {
    onNodeHoverRef.current = onNodeHover;
  }, [onNodeHover]);

  const handleMouseEnter = (node: LanguageNode) => {
    hoveredNodeIdRef.current = node.id;
    setHoveredNode(node);
    targetSpeedRef.current = 0.0022; // Smooth slow-motion deceleration
    onNodeHoverRef.current?.(node);
  };

  const handleMouseLeave = () => {
    hoveredNodeIdRef.current = null;
    setHoveredNode(null);
    targetSpeedRef.current = 0.011; // Restore normal 60fps rotation
    onNodeHoverRef.current?.(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = container.clientWidth || 340;
    let height = container.clientHeight || 185;
    let dpr = window.devicePixelRatio || 1;

    const updateSize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width) || 340;
      height = Math.floor(rect.height) || 185;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    let startTime = performance.now();

    // 3D coordinate rotation helpers
    const rotatePoint = (
      x: number,
      y: number,
      z: number,
      rx: number,
      ry: number,
      rz: number
    ) => {
      // Rotate around X
      const y1 = y * Math.cos(rx) - z * Math.sin(rx);
      const z1 = y * Math.sin(rx) + z * Math.cos(rx);

      // Rotate around Y
      const x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
      const z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);

      // Rotate around Z
      const x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
      const y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

      return { x: x3, y: y3, z: z2 };
    };

    const project3D = (
      x: number,
      y: number,
      z: number,
      cx: number,
      cy: number
    ) => {
      const fov = 270;
      // +z is closer to camera
      const scale = fov / (fov - z);
      return {
        px: cx + x * scale,
        py: cy + y * scale,
        scale,
        z,
      };
    };

    const render = () => {
      const now = performance.now();
      const time = (now - startTime) * 0.001;

      // Smooth lerp speed
      speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.08;
      const currentSpeed = speedRef.current;

      orbitAngleRef.current += currentSpeed;
      sysAngleYRef.current += currentSpeed * 0.55;
      sysAngleXRef.current += currentSpeed * 0.22;
      sysAngleZRef.current += currentSpeed * 0.14;

      const orbitAngle = orbitAngleRef.current;
      const sysX = sysAngleXRef.current;
      const sysY = sysAngleYRef.current;
      const sysZ = sysAngleZRef.current;

      const cx = width / 2;
      const cy = height / 2;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Subtle background grid radar marks for technical aesthetic
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "rgba(61, 51, 42, 0.4)";
      ctx.setLineDash([2, 4]);

      // Crosshair through center
      ctx.beginPath();
      ctx.moveTo(cx - 50, cy);
      ctx.lineTo(cx + 50, cy);
      ctx.moveTo(cx, cy - 35);
      ctx.lineTo(cx, cy + 35);
      ctx.stroke();
      ctx.setLineDash([]);

      // Pre-calculate ring points for 3D drawing
      const ringSampleCount = 48;
      const ringProjectedPoints: { px: number; py: number; z: number }[][] = [];

      for (let r = 0; r < ORBIT_RINGS.length; r++) {
        const ring = ORBIT_RINGS[r];
        const pts: { px: number; py: number; z: number }[] = [];

        for (let s = 0; s < ringSampleCount; s++) {
          const phi = (s / ringSampleCount) * Math.PI * 2;
          const x0 = ring.radiusA * Math.cos(phi);
          const y0 = ring.radiusB * Math.sin(phi);
          const z0 = 0;

          // Local ring inclination
          const ptInc = rotatePoint(x0, y0, z0, ring.incX, ring.incY, ring.incZ);
          // Global system 3D rotation
          const ptWorld = rotatePoint(
            ptInc.x,
            ptInc.y,
            ptInc.z,
            sysX,
            sysY,
            sysZ
          );
          // 3D perspective projection
          const proj = project3D(ptWorld.x, ptWorld.y, ptWorld.z, cx, cy);
          pts.push({ px: proj.px, py: proj.py, z: proj.z });
        }
        ringProjectedPoints.push(pts);
      }

      // Calculate 3D projected positions for the 6 Language Nodes
      const nodeProjected: {
        px: number;
        py: number;
        scale: number;
        z: number;
        index: number;
      }[] = [];

      for (let r = 0; r < ORBIT_RINGS.length; r++) {
        const ring = ORBIT_RINGS[r];
        const ringSpeedFactor = r === 0 ? 1.0 : r === 1 ? 1.06 : 0.94;

        for (let ni = 0; ni < 2; ni++) {
          const nodeIdx = ring.nodeIndices[ni];
          const phi =
            orbitAngle * ringSpeedFactor + ring.phaseOffsets[ni];

          const x0 = ring.radiusA * Math.cos(phi);
          const y0 = ring.radiusB * Math.sin(phi);
          const z0 = 0;

          const ptInc = rotatePoint(x0, y0, z0, ring.incX, ring.incY, ring.incZ);
          const ptWorld = rotatePoint(
            ptInc.x,
            ptInc.y,
            ptInc.z,
            sysX,
            sysY,
            sysZ
          );
          const proj = project3D(ptWorld.x, ptWorld.y, ptWorld.z, cx, cy);

          nodeProjected[nodeIdx] = {
            px: proj.px,
            py: proj.py,
            scale: proj.scale,
            z: proj.z,
            index: nodeIdx,
          };
        }
      }

      // =========================================================================
      // PASS 1: DRAW BACKWARD RING SEGMENTS (z < 0)
      // =========================================================================
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(194, 85, 58, 0.22)"; // Faint Terracotta
      ctx.setLineDash([2, 4]);

      for (let r = 0; r < ringProjectedPoints.length; r++) {
        const pts = ringProjectedPoints[r];
        for (let s = 0; s < ringSampleCount; s++) {
          const p1 = pts[s];
          const p2 = pts[(s + 1) % ringSampleCount];
          if (p1.z < 0 || p2.z < 0) {
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }
      ctx.setLineDash([]);

      // Back node connection lines
      for (let i = 0; i < 6; i++) {
        const np = nodeProjected[i];
        if (!np || np.z >= 0) continue;

        const isHovered = hoveredNodeIdRef.current === POLYGLOT_LANGUAGES[i].id;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(np.px, np.py);

        if (isHovered) {
          ctx.strokeStyle = "rgba(245, 158, 11, 0.85)";
          ctx.lineWidth = 1.8;
          ctx.stroke();
        } else {
          ctx.strokeStyle = "rgba(194, 85, 58, 0.16)";
          ctx.lineWidth = 0.8;
          ctx.setLineDash([2, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // =========================================================================
      // PASS 2: VELQORA COMPUTE CORE (Pulsing Glow - Terracotta #C2553A & Amber #F59E0B)
      // =========================================================================
      const pulsePeriod = Math.sin(time * 3.2);
      const pulseScale = 0.88 + 0.12 * pulsePeriod;

      // 1. Outermost soft pulsing glow aura
      const auraGrad = ctx.createRadialGradient(
        cx,
        cy,
        2,
        cx,
        cy,
        34 * pulseScale
      );
      auraGrad.addColorStop(0, "rgba(245, 158, 11, 0.45)"); // Amber
      auraGrad.addColorStop(0.35, "rgba(194, 85, 58, 0.35)"); // Terracotta
      auraGrad.addColorStop(0.8, "rgba(194, 85, 58, 0.08)");
      auraGrad.addColorStop(1, "rgba(194, 85, 58, 0)");

      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 34 * pulseScale, 0, Math.PI * 2);
      ctx.fill();

      // 2. Concentric beacon radar ripples expanding outward
      for (let w = 0; w < 2; w++) {
        const wave = (time * 18 + w * 16) % 36;
        const waveAlpha = Math.max(0, 1 - wave / 36) * 0.4;
        ctx.strokeStyle = `rgba(245, 158, 11, ${waveAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 10 + wave, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Rotating segmented orbital reticle ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.9);
      ctx.strokeStyle = "rgba(245, 158, 11, 0.55)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 4. Central Solid Terracotta & Amber Micro-Diamond Core
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-time * 0.6);

      const dSize = 7.5 * pulseScale;
      ctx.fillStyle = "#C2553A"; // Terracotta
      ctx.strokeStyle = "#F59E0B"; // Amber
      ctx.lineWidth = 1.5;
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

      // 5. Intense white pinpoint nexus at the absolute center
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fill();

      // =========================================================================
      // PASS 3: FOREWARD RING SEGMENTS (z >= 0)
      // =========================================================================
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = "rgba(245, 158, 11, 0.6)"; // Glowing Amber
      ctx.shadowColor = "rgba(245, 158, 11, 0.45)";
      ctx.shadowBlur = 6;

      for (let r = 0; r < ringProjectedPoints.length; r++) {
        const pts = ringProjectedPoints[r];
        for (let s = 0; s < ringSampleCount; s++) {
          const p1 = pts[s];
          const p2 = pts[(s + 1) % ringSampleCount];
          if (p1.z >= 0 && p2.z >= 0) {
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }
      ctx.shadowBlur = 0;

      // Foreward node connection laser beams & moving data packets
      for (let i = 0; i < 6; i++) {
        const np = nodeProjected[i];
        if (!np || np.z < 0) continue;

        const isHovered = hoveredNodeIdRef.current === POLYGLOT_LANGUAGES[i].id;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(np.px, np.py);

        if (isHovered) {
          ctx.strokeStyle = "rgba(245, 158, 11, 0.95)";
          ctx.lineWidth = 2.2;
          ctx.shadowColor = "#F59E0B";
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Traveling photon packet from core to hovered node
          const packetT = (time * 2.8) % 1;
          const pxT = cx + (np.px - cx) * packetT;
          const pyT = cy + (np.py - cy) * packetT;
          ctx.fillStyle = "#FFFFFF";
          ctx.shadowColor = "#F59E0B";
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(pxT, pyT, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.strokeStyle = "rgba(245, 158, 11, 0.28)";
          ctx.lineWidth = 0.9;
          ctx.setLineDash([2, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      ctx.restore();

      // =========================================================================
      // PASS 4: UPDATE REACT DOM NODES (60 FPS Silky Smooth Direct DOM transform)
      // =========================================================================
      for (let i = 0; i < 6; i++) {
        const el = nodeRefs.current[i];
        const np = nodeProjected[i];
        if (!el || !np) continue;

        const isHovered = hoveredNodeIdRef.current === POLYGLOT_LANGUAGES[i].id;

        // Front nodes are larger and brighter; back nodes smaller and dimmer
        const baseScale = isHovered ? np.scale * 1.25 : np.scale;
        const boundedScale = Math.max(0.68, Math.min(1.35, baseScale));

        const baseOpacity = isHovered
          ? 1
          : Math.max(0.48, Math.min(1, 0.72 + (np.z / 95) * 0.32));

        const zIndex = isHovered ? 150 : Math.round(50 + np.z);

        el.style.transform = `translate3d(${np.px}px, ${np.py}px, 0px) translate(-50%, -50%) scale(${boundedScale})`;
        el.style.opacity = `${baseOpacity}`;
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
      className={`relative w-full h-[190px] bg-[#14110F] rounded-xs border border-[#3D332A] overflow-hidden select-none ${className}`}
    >
      {/* Top Left: Retro CRT HUD badge */}
      <div className="absolute top-2 left-2 font-mono text-[9px] text-[#C2553A] tracking-wider select-none flex items-center gap-1.5 z-30 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C2553A] animate-pulse" />
        <span>ORBIT: 3D_POLYGLOT_CORE</span>
      </div>

      {/* Top Right: Status 60FPS */}
      <div className="absolute top-2 right-2 font-mono text-[9px] text-amber-500/80 tracking-wider select-none z-30 pointer-events-none">
        FPS: 60 [SYNC]
      </div>

      {/* Bottom Left: Architecture Label */}
      <div className="absolute bottom-2 left-2 font-mono text-[9px] text-[#A89F91]/75 tracking-wider select-none z-30 pointer-events-none">
        AXIS: X/Y/Z REALTIME
      </div>

      {/* Bottom Right: Active Engine Lock */}
      <div className="absolute bottom-2 right-2 font-mono text-[9px] tracking-wider select-none z-30 pointer-events-none font-bold">
        {hoveredNode ? (
          <span className="text-amber-400">
            LOCK: {hoveredNode.id.toUpperCase()} · {hoveredNode.version}
          </span>
        ) : (
          <span className="text-emerald-500/80">6 NODES ONLINE</span>
        )}
      </div>

      {/* 3D Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 6 Interactive Language Node DOM Elements */}
      {POLYGLOT_LANGUAGES.map((node, index) => {
        const IconComponent = node.icon;
        const isHovered = hoveredNode?.id === node.id;

        return (
          <div
            key={node.id}
            ref={(el) => {
              nodeRefs.current[index] = el;
            }}
            onMouseEnter={() => handleMouseEnter(node)}
            onMouseLeave={handleMouseLeave}
            className="absolute top-0 left-0 cursor-pointer will-change-transform group"
            style={{
              transform: "translate3d(0px, 0px, 0px) translate(-50%, -50%)",
            }}
            aria-label={`${node.name} ${node.version} - ${node.role}`}
          >
            {/* Outer Glowing Hex/Circle Container */}
            <div
              className={`relative flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xs transition-colors duration-150 backdrop-blur-xs ${
                isHovered
                  ? "bg-[#1F1916] border-2 border-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.7)]"
                  : "bg-[#181412]/90 border border-[#3D332A] hover:border-amber-500/70 shadow-[0_0_8px_rgba(0,0,0,0.8)]"
              }`}
            >
              {/* Corner decorative notch */}
              <div
                className={`absolute -top-0.5 -right-0.5 w-1 h-1 ${
                  isHovered ? "bg-amber-400" : "bg-[#C2553A]/50"
                }`}
              />

              <IconComponent
                className="w-4.5 h-4.5 transition-transform duration-150"
                style={{
                  color: isHovered ? "#F59E0B" : node.color,
                  filter: isHovered
                    ? "drop-shadow(0 0 6px rgba(245, 158, 11, 0.9))"
                    : `drop-shadow(0 0 3px ${node.accentGlow})`,
                }}
              />
            </div>

            {/* Micro Monospace Label under Node */}
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 mt-0.5 whitespace-nowrap font-mono text-[8px] tracking-tight px-1 py-0.2 rounded-2xs border transition-all duration-150 pointer-events-none ${
                isHovered
                  ? "bg-[#1C1917] text-amber-300 border-amber-500/60 font-bold shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                  : "bg-[#14110F]/80 text-[#A89F91] border-[#3D332A]/50 group-hover:text-white"
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
