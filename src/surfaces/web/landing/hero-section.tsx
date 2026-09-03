"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Download,
  ShieldCheck,
  Sparkles,
  Smartphone,
  RotateCw,
  QrCode,
  Wifi,
  Sparkle,
  Layers,
  BookOpen,
  CheckSquare,
  Bot,
  Lock,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookshelfHeroBackground } from "./bookshelf-bg";
import { useScrollReveal } from "./use-landing-animation";

/**
 * 3D Physical Grommet & Interlocking Clasp Aperture Tab
 * Precision-milled metallic ring tab cleanly integrated into the card header.
 */
function Physical3DGrommetTab({ isBack = false }: { isBack?: boolean }) {
  return (
    <div className="flex justify-center -mt-3.5 mb-1.5 relative z-30 [transform-style:preserve-3d] pointer-events-none">
      {/* Precision Metallic Donut Grommet Ring */}
      <div
        className={`px-3 py-0.5 rounded-full border flex items-center justify-center relative shadow-[0_2px_6px_rgba(0,0,0,0.18)] ${
          isBack
            ? "bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900 border-stone-600"
            : "bg-gradient-to-b from-stone-100 via-stone-200 to-stone-300 border-stone-300/80"
        }`}
      >
        {/* Precision Torus Ring with specular highlight */}
        <div
          className="w-6 h-3.5 rounded-full flex items-center justify-center relative"
          style={{
            background:
              "conic-gradient(from 315deg at 50% 50%, #ffffff 0%, #cbd5e1 25%, #64748b 50%, #334155 75%, #ffffff 100%)",
            boxShadow:
              "inset 1px 1px 1.5px rgba(255,255,255,0.9), inset -1px -1px 2px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.25)",
          }}
        >
          {/* Smooth Aperture Void */}
          <div
            className="w-3.5 h-2 rounded-full bg-stone-900/90 flex items-center justify-center relative shadow-inner overflow-hidden"
          >
            {/* Front Carabiner Hook Latch Loop */}
            <div className="w-1.5 h-2.5 bg-gradient-to-b from-stone-300 via-white to-stone-400 rounded-b-xs shadow-xs -mt-1 opacity-90" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * World-Class 360° Interactive 3D Lanyard Card with Elastic Stretch & Physics
 *
 * Physical & Structural Guarantees:
 * 1. Strict DOM Hierarchy: Clip -> Strap -> Crimp Collar / Swivel Clasp -> Card Chassis (Seamless Chain).
 * 2. Exact Pivot: Card rotation transform-origin is placed precisely at the top grommet/D-ring joint (50% 10px).
 * 3. Continuous 360° Drag + Modulo 360 Normalization on release to eliminate edge-on blade lock.
 * 4. Elastic Stretch Physics: downward drag stretches the strap up to 90px with rubber-band resistance & snap bounce.
 * 5. Viewport-Aware Idle Sway: subtle organic pendulum oscillation paused when off-screen.
 * 6. Authentic Woven Webbing Strap: double dashed edge stitching, ribbed webbing texture, and fabric thickness side shadow.
 */
function Interactive360LanyardCard({ isVisible }: { isVisible: boolean }) {
  const [rotX, setRotX] = useState(4);
  const [rotY, setRotY] = useState(-6);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 30,
    opacity: 0.35,
  });

  // ── Elastic stretch state ──
  const [stretchY, setStretchY] = useState(0);
  const MAX_STRETCH = 76; // comfortable max stretch (px) before rubber-band resistance
  const HARD_MAX = 92; // absolute hard limit

  // Physics animation loop refs
  const animFrameRef = useRef<number | null>(null);
  const idleFrameRef = useRef<number | null>(null);
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastPointerRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const rotRef = useRef<{ x: number; y: number }>({ x: 4, y: -6 });
  const isDraggingRef = useRef(false);
  const stretchRef = useRef(0);
  const stretchVelRef = useRef(0);
  const isSettledRef = useRef(true);

  // Sync refs with state
  useEffect(() => {
    rotRef.current = { x: rotX, y: rotY };
  }, [rotX, rotY]);
  useEffect(() => {
    stretchRef.current = stretchY;
  }, [stretchY]);

  // Combined spring physics decay (rotation + elastic stretch snap-back)
  const startSpringDecay = useCallback((targetFaceY: number, initialVelY: number) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    isSettledRef.current = false;

    let currentY = Number.isFinite(rotRef.current.y) ? rotRef.current.y : 0;
    let currentX = Number.isFinite(rotRef.current.x) ? rotRef.current.x : 4;
    let velY = Number.isFinite(initialVelY) ? initialVelY : 0;
    let velX = (4 - currentX) * 0.12;

    // Rotation spring constants
    const stiffness = 0.082;
    const damping = 0.81;

    // Elastic stretch spring constants — snappy with authentic fabric overshoot bounce
    let currentStretch = Number.isFinite(stretchRef.current) ? stretchRef.current : 0;
    let sVel = Number.isFinite(stretchVelRef.current) ? stretchVelRef.current : 0;
    const sStiffness = 0.15; // fast snap
    const sDamping = 0.72; // slight underdamped for 1-2 visible bounce oscillations

    const step = () => {
      if (isDraggingRef.current) return;

      // ── Rotation spring ──
      const forceY = (targetFaceY - currentY) * stiffness;
      velY = (velY + forceY) * damping;
      currentY += velY;

      const forceX = (4 - currentX) * stiffness;
      velX = (velX + forceX) * damping;
      currentX += velX;

      // Safeguard against NaN / Infinity
      const safeX = Number.isFinite(currentX) ? currentX : 4;
      const safeY = Number.isFinite(currentY) ? currentY : 0;

      setRotX(safeX);
      setRotY(safeY);

      // ── Elastic stretch spring (snap to 0 with compression bounce) ──
      const sForce = (0 - currentStretch) * sStiffness;
      sVel = (sVel + sForce) * sDamping;
      currentStretch += sVel;

      // Allow slight negative overshoot (-6px) for realistic strap recoil
      const safeStretch = Number.isFinite(currentStretch) ? Math.max(-6, currentStretch) : 0;
      setStretchY(safeStretch);

      // Settle condition check
      const rotSettled =
        Math.abs(velY) < 0.04 &&
        Math.abs(targetFaceY - safeY) < 0.08 &&
        Math.abs(velX) < 0.04;
      const stretchSettled =
        Math.abs(safeStretch) < 0.25 && Math.abs(sVel) < 0.06;

      if (!rotSettled || !stretchSettled) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        // Fully settled: normalize angles modulo 360 to prevent numerical growth
        const normalizedSettledY = ((targetFaceY % 360) + 360) % 360;
        setRotX(4);
        setRotY(normalizedSettledY === 360 ? 0 : normalizedSettledY);
        setStretchY(0);
        isSettledRef.current = true;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  // Handle pointer down (mouse or touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (idleFrameRef.current) cancelAnimationFrame(idleFrameRef.current);

    setIsDragging(true);
    isDraggingRef.current = true;
    isSettledRef.current = false;
    setHasInteracted(true);

    lastPointerRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
    };
    velocityRef.current = { x: 0, y: 0 };
    stretchVelRef.current = 0;

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  // Handle pointer move — horizontal 360° rotation + vertical elastic stretch
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const now = performance.now();
    const dt = Math.max(1, now - lastPointerRef.current.time);
    const deltaX = e.clientX - lastPointerRef.current.x;
    const deltaY = e.clientY - lastPointerRef.current.y;

    // Calculate smoothed instantaneous velocity
    const instVelY = (deltaX / dt) * 16;
    const instVelX = (deltaY / dt) * 16;
    velocityRef.current = {
      x: instVelX * 0.4 + velocityRef.current.x * 0.6,
      y: instVelY * 0.4 + velocityRef.current.y * 0.6,
    };

    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: now };

    // ── Horizontal drag -> continuous yaw rotation ──
    const nextRotY = rotRef.current.y + deltaX * 0.75;

    // ── Vertical drag -> split between pitch tilt & elastic downward stretch ──
    const curStretch = stretchRef.current;
    const stretchRatio = Math.min(1, Math.max(0, curStretch) / MAX_STRETCH);

    // Pitch sensitivity decreases as strap stretches taut
    const pitchSensitivity = 0.38 * (1 - stretchRatio * 0.65);
    const nextRotX = Math.max(-25, Math.min(25, rotRef.current.x - deltaY * pitchSensitivity));

    // Vertical delta contributes to strap elongation
    let newStretch = curStretch + deltaY * 0.55;

    // Rubber-band resistance when stretching beyond MAX_STRETCH
    if (newStretch > MAX_STRETCH) {
      const excess = newStretch - MAX_STRETCH;
      newStretch = MAX_STRETCH + excess * 0.12;
    }
    newStretch = Math.max(0, Math.min(HARD_MAX, newStretch));

    // Safeguards for safe numerical values
    const safeRotY = Number.isFinite(nextRotY) ? nextRotY : 0;
    const safeRotX = Number.isFinite(nextRotX) ? nextRotX : 4;
    const safeStretch = Number.isFinite(newStretch) ? newStretch : 0;

    stretchRef.current = safeStretch;
    setStretchY(safeStretch);
    setRotX(safeRotX);
    setRotY(safeRotY);

    // Calculate dynamic specular glare coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const normY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setGlare({ x: normX, y: normY, opacity: 0.65 });
  };

  // Handle pointer up — calculate nearest clean face and launch bounce spring
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    setIsDragging(false);
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    stretchVelRef.current = 0;

    // Projected landing angle based on release flick velocity
    const safeVelY = Number.isFinite(velocityRef.current.y) ? velocityRef.current.y : 0;
    const currentY = Number.isFinite(rotRef.current.y) ? rotRef.current.y : 0;
    const projectedY = currentY + safeVelY * 7.5;

    // Modulo 360 normalization to find nearest resting face (Front 0° or Back 180°)
    const normalizedY = ((projectedY % 360) + 360) % 360;
    const isCloserToBack = normalizedY > 90 && normalizedY < 270;

    // Nearest clean multiple target (never stopping at edge-on 90°/270°)
    const baseTurns = Math.round((projectedY - (isCloserToBack ? 180 : 0)) / 360) * 360;
    const targetY = baseTurns + (isCloserToBack ? 180 : 0);

    startSpringDecay(targetY, safeVelY * 1.35);
    setGlare((prev) => ({ ...prev, opacity: 0.35 }));
  };

  // Quick button flip trigger (smooth 180° turn)
  const handleQuickFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasInteracted(true);
    const currentY = Number.isFinite(rotRef.current.y) ? rotRef.current.y : 0;
    const nextTargetY = currentY + 180;
    startSpringDecay(nextTargetY, 14);
  };

  // ── Viewport-Aware Subtle Idle Pendulum Sway ──
  useEffect(() => {
    if (!isVisible) return;

    let startTime = performance.now();

    const idleStep = (time: number) => {
      // Only apply idle sway if settled, not dragging, and not hovered
      if (!isDraggingRef.current && isSettledRef.current) {
        const elapsed = time - startTime;
        // Gentle organic pendulum micro-sway (±2.2° yaw, ±1.0° pitch)
        const swayY = Math.sin(elapsed * 0.0016) * 2.2;
        const swayX = 4 + Math.cos(elapsed * 0.0013) * 0.9;

        const baseFaceY = rotRef.current.y;
        // Modulo normalized base
        const cleanBaseY = Math.round(baseFaceY / 180) * 180;
        setRotY(cleanBaseY + swayY);
        setRotX(swayX);
      } else {
        startTime = time;
      }

      idleFrameRef.current = requestAnimationFrame(idleStep);
    };

    idleFrameRef.current = requestAnimationFrame(idleStep);

    return () => {
      if (idleFrameRef.current) cancelAnimationFrame(idleFrameRef.current);
    };
  }, [isVisible]);

  // ── 3D Visual & Lighting Calculations ──
  const safeRotY = Number.isFinite(rotY) ? rotY : 0;
  const safeRotX = Number.isFinite(rotX) ? rotX : 4;
  const radY = (safeRotY * Math.PI) / 180;
  const cosY = Math.cos(radY);
  const sinY = Math.sin(radY);

  // 1. Strap dynamic skew & twist (follows card yaw)
  const strapSkew = sinY * 7;
  const strapRotate = safeRotX * 0.2;

  // 2. Physical edge perspective compression
  const cardScale = 0.95 + 0.05 * Math.abs(cosY);

  // 3. Directional ambient drop shadow & 3D bevel thickness
  const shadowOffsetX = -sinY * 22;
  const shadowOffsetY = 24 + Math.abs(cosY) * 12;
  const shadowBlur = 34 + Math.abs(cosY) * 16;
  const shadowAlpha = 0.16 + Math.abs(cosY) * 0.14;

  // 4. Elastic stretch visual metrics
  const clampedStretch = Math.max(0, stretchY);
  const stretchFactor = Math.min(1, clampedStretch / MAX_STRETCH);
  const strapWidthScale = 1 - stretchFactor * 0.08; // narrows slightly under tension
  const strapBrightness = 1 + stretchFactor * 0.14; // tension brightening

  // Base strap length (px) that expands physically with stretchY
  const baseStrapHeight = 100;
  const currentStrapHeight = baseStrapHeight + clampedStretch;

  // Cleanup all animation frames on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (idleFrameRef.current) cancelAnimationFrame(idleFrameRef.current);
    };
  }, []);

  return (
    <div
      className={`absolute top-2 -left-10 sm:-left-16 lg:-left-20 z-30 pointer-events-none flex flex-col items-center [perspective:1200px] transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.34,1.4,0.64,1)] overflow-visible ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-48"
      }`}
      style={{
        transitionDelay: "450ms",
      }}
    >
      {/* ── UNIFIED PHYSICAL RIG CONTAINER (Preserve 3D, GPU Accelerated) ── */}
      <div
        className="flex flex-col items-center origin-top [transform-style:preserve-3d]"
        style={{
          transform: `translate3d(0, ${isHovered && !isDragging ? -4 : 0}px, 24px)`,
          transition: isDragging ? "none" : "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
        }}
      >
        {/* ── 1. TOP ANCHOR BRACKET / BRUSHED TITANIUM CLIP ── */}
        <div className="relative z-30 flex flex-col items-center -mt-3.5 [transform-style:preserve-3d]">
          {/* Precision Milled Metal Bracket */}
          <div
            className="w-11 sm:w-12 px-2.5 py-1.5 rounded-md border border-stone-300 shadow-[0_4px_12px_rgba(0,0,0,0.22),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-between"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, #f1f5f9 35%, #94a3b8 70%, #475569 100%)",
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-stone-600 ring-1 ring-stone-400/60 shadow-inner" />
            <div className="w-4 h-1 bg-stone-700/60 rounded-full" />
            <div className="w-1.5 h-1.5 rounded-full bg-stone-600 ring-1 ring-stone-400/60 shadow-inner" />
          </div>

          {/* Precision Swivel Ring */}
          <div
            className="w-5.5 h-4.5 rounded-full border-[2.5px] border-stone-300 shadow-sm -mt-1 flex items-center justify-center"
            style={{
              background:
                "conic-gradient(from 315deg at 50% 50%, #ffffff 0%, #cbd5e1 25%, #64748b 50%, #334155 75%, #ffffff 100%)",
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#B84A2B] shadow-xs" />
          </div>
        </div>

        {/* ── 2. CLASSIC WOVEN JACQUARD LANYARD STRAP (Stretches & Narrows with Physics) ── */}
        <div
          className="w-[36px] sm:w-[38px] relative flex flex-col items-center justify-between -mt-1 rounded-xs border-x border-[#5A1F10]/70 [transform-style:preserve-3d]"
          style={{
            height: `${currentStrapHeight}px`,
            background:
              "linear-gradient(90deg, #7A2E19 0%, #9E3B1E 15%, #B84A2B 45%, #D46B42 50%, #B84A2B 55%, #9E3B1E 85%, #7A2E19 100%)",
            transform: `scaleX(${strapWidthScale}) skewX(${strapSkew}deg) rotateZ(${strapRotate}deg)`,
            transformOrigin: "top center",
            filter: `brightness(${strapBrightness})`,
            boxShadow:
              "2px 0 6px rgba(0,0,0,0.18), -1px 0 2px rgba(0,0,0,0.1), inset 0 3px 6px rgba(0,0,0,0.35), inset 0 -3px 6px rgba(0,0,0,0.35)",
            transition: isDragging ? "none" : "transform 180ms ease-out, filter 180ms ease-out",
            willChange: "transform, height, filter",
          }}
        >
          {/* Top & Bottom Connection Shadows */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-20" />
          <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-20" />

          {/* Left & Right Fine Double Dashed Stitch Lines */}
          <div className="absolute inset-y-0 left-1 w-px border-l border-dashed border-white/60" />
          <div className="absolute inset-y-0 right-1 w-px border-r border-dashed border-white/60" />

          {/* High-Density Tactile Herringbone/Rib Texture */}
          <div
            className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 3px)",
            }}
          />

          {/* Tension Glow Highlight */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(180deg, transparent 10%, rgba(255,220,190,0.25) 50%, transparent 90%)",
              opacity: stretchFactor,
              transition: isDragging ? "none" : "opacity 180ms ease-out",
            }}
          />

          {/* Solid 3D Woven Monogram */}
          <div className="h-full flex items-center justify-center py-2 select-none pointer-events-none z-10">
            <span className="text-[9.5px] font-mono font-black tracking-[0.35em] text-white/95 uppercase [writing-mode:vertical-lr] rotate-180 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
              VELQORA
            </span>
          </div>
        </div>

        {/* ── 3. METALLIC SWIVEL CLASP & CARABINER ── */}
        <div className="relative z-30 flex flex-col items-center -mt-1.5 [transform-style:preserve-3d]">
          {/* Brushed Steel Crimp Collar */}
          <div className="w-9.5 h-3.5 bg-gradient-to-r from-stone-400 via-stone-100 to-stone-400 rounded-xs border border-stone-400 shadow-[0_2px_6px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-around px-1.5">
            <div className="w-1 h-1.5 bg-stone-700 rounded-full shadow-inner" />
            <div className="w-3 h-0.5 bg-stone-600 rounded-full opacity-60" />
            <div className="w-1 h-1.5 bg-stone-700 rounded-full shadow-inner" />
          </div>

          {/* Swivel D-Ring Housing */}
          <div
            className="w-5.5 h-5 rounded-full border-[2.5px] border-stone-300 shadow-md -mt-1 flex items-center justify-center relative"
            style={{
              background:
                "conic-gradient(from 315deg at 50% 50%, #ffffff 0%, #e2e8f0 25%, #64748b 50%, #334155 75%, #ffffff 100%)",
            }}
          >
            {/* Lobster Clasp Spring Hook Latch */}
            <div className="w-3 h-5.5 bg-gradient-to-b from-stone-100 via-stone-200 to-stone-400 border border-stone-400 rounded-b-md shadow-md flex items-end justify-center pb-0.5 absolute -bottom-3 z-40">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-600" />
            </div>
          </div>
        </div>

        {/* ── 4. TRUE 360° ROTATABLE 3D SOLID CARD ── */}
        <div
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          title="Geser horizontal 360° · Tarik ke bawah untuk stretch elastis"
          className="w-52 sm:w-56 relative -mt-0.5 pointer-events-auto cursor-grab active:cursor-grabbing select-none [touch-action:none] [transform-style:preserve-3d]"
          style={{
            transform: `rotateX(${safeRotX}deg) rotateY(${safeRotY}deg) scale3d(${cardScale}, ${cardScale}, 1)`,
            transformOrigin: "50% 8px", // PIVOTS EXACTLY AT THE GROMMET CONNECTION POINT
            willChange: "transform",
          }}
        >
          {/* ── FRONT FACE (rotateY 0deg) WITH CRISP SOLID CHASSIS ── */}
          <div
            className="relative w-full rounded-2xl bg-white p-3 pt-2 border border-[#E7E2DA] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(0,0,0,0.04)] [backface-visibility:hidden] [transform:rotateY(0deg)] flex flex-col justify-between transition-shadow duration-300"
            style={{
              boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px rgba(28,25,23,${shadowAlpha}), 0 20px 40px -10px rgba(184,74,43,0.18), 0 2px 6px rgba(0,0,0,0.06)`,
            }}
          >
            {/* Dynamic Specular Light Glare */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl z-40 transition-opacity duration-150"
              style={{
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 45%, transparent 75%)`,
                opacity: glare.opacity,
              }}
            />

            {/* 3D Physical Grommet Tab */}
            <Physical3DGrommetTab isBack={false} />

            {/* Smart Companion Screen Content */}
            <div className="rounded-xl bg-gradient-to-b from-[#FAF8F5] to-white border border-[#E7E2DA] p-3 space-y-2.5 text-[#1C1917] shadow-xs flex-1 flex flex-col justify-between overflow-hidden">
              {/* Status Bar */}
              <div className="flex items-center justify-between text-[11px] border-b border-[#E7E2DA] pb-2">
                <span className="font-bold text-[#1C1917] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-xs" />
                  Velqora Mobile
                </span>
                <span className="text-[9px] font-mono font-bold bg-[#B84A2B]/10 text-[#B84A2B] px-2 py-0.5 rounded-full border border-[#B84A2B]/20">
                  PWA Active
                </span>
              </div>

              {/* Live Schedule Widget */}
              <div className="p-2.5 rounded-xl bg-white border border-[#B84A2B]/25 space-y-1.5 shadow-[0_2px_10px_rgba(184,74,43,0.06)]">
                <div className="flex items-center justify-between">
                  <p className="text-[9.5px] text-[#B84A2B] font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <Sparkle className="w-2.5 h-2.5 fill-[#B84A2B] text-[#B84A2B]" />
                    Kelas Berikutnya
                  </p>
                  <span className="text-[9.5px] text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-md">
                    10 Menit Lagi
                  </span>
                </div>
                <div>
                  <p className="text-xs sm:text-[13px] font-semibold font-editorial text-[#1C1917] leading-tight">
                    Kalkulus Lanjut
                  </p>
                  <p className="text-[10px] text-[#57534E] font-medium flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5 text-[#78716C] shrink-0" />
                    <span>10:45 • Ruang 402 Gedung C</span>
                  </p>
                </div>
                <div className="pt-1 border-t border-[#E7E2DA]/60 flex items-center justify-between text-[9px] text-[#57534E] font-medium">
                  <span>Dr. Ir. Hendra S., M.T.</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Presensi Siap
                  </span>
                </div>
              </div>

              {/* Interactive Rotate Hint & Flip Trigger */}
              <div
                className={`flex items-center justify-between text-[9px] text-[#57534E] pt-0.5 font-semibold transition-opacity duration-300 ${
                  hasInteracted ? "opacity-60 hover:opacity-100" : "opacity-100"
                }`}
              >
                <span className="flex items-center gap-1">
                  <RotateCw className="w-3 h-3 text-[#B84A2B] animate-spin-slow" />
                  <span>Geser 360°</span>
                </span>
                <button
                  type="button"
                  onClick={handleQuickFlip}
                  className="px-2.5 py-1 rounded-md bg-[#FAF8F5] hover:bg-white active:bg-stone-100 text-[#44403C] font-medium border border-[#E7E2DA] transition-all cursor-pointer active:scale-95 shadow-2xs"
                >
                  Balik Kartu ↺
                </button>
              </div>
            </div>
          </div>

          {/* ── BACK FACE (rotateY 180deg) DIGITAL ACADEMIC PASS ── */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 p-3 pt-2 border border-stone-700/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between text-white transition-shadow duration-300"
            style={{
              boxShadow: `${-shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha + 0.15}), 0 16px 36px -8px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.2)`,
            }}
          >
            {/* 3D Physical Grommet Tab (Back Face View) */}
            <Physical3DGrommetTab isBack={true} />

            {/* Inner Digital Student Pass */}
            <div className="rounded-xl bg-stone-800/90 border border-stone-700/70 p-3 space-y-2 flex-1 flex flex-col justify-between relative overflow-hidden">
              {/* Holographic shimmer glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#B84A2B]/20 rounded-full blur-xl pointer-events-none" />

              {/* Pass Header */}
              <div className="flex items-center justify-between border-b border-stone-700/80 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-[#B84A2B] flex items-center justify-center font-bold text-[9px] text-white shadow-xs">
                    V
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-stone-200">
                    ACADEMIC PASS
                  </span>
                </div>
                <Wifi className="w-3.5 h-3.5 text-[#D46B42]" />
              </div>

              {/* QR Code Scanner Box */}
              <div className="flex items-center gap-2.5 bg-stone-900/95 p-2 rounded-xl border border-stone-700/60">
                <div className="p-1.5 bg-white rounded-lg shrink-0 shadow-xs">
                  <QrCode className="w-8 h-8 text-stone-900" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[10.5px] font-bold text-white truncate">
                    Wahyu Aldi Riyanto
                  </p>
                  <p className="text-[9.5px] font-mono font-bold text-[#D46B42] truncate">
                    22/498210/TK
                  </p>
                  <p className="text-[8.5px] text-stone-400">Teknik Informatika • 2026</p>
                </div>
              </div>

              {/* NFC Sync Tag */}
              <div className="flex items-center justify-between text-[9px] font-mono text-stone-400 pt-0.5">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  NFC Synced
                </span>
                <button
                  type="button"
                  onClick={handleQuickFlip}
                  className="px-2 py-0.5 rounded bg-stone-700/80 hover:bg-stone-700 text-stone-200 border border-stone-600 transition-colors cursor-pointer active:scale-95"
                >
                  Sisi Depan ↻
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export function HeroSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-[#E7E2DA]/80 bg-[#FAF8F5] overflow-x-hidden">
      <BookshelfHeroBackground />

      {/* Subtle Warm Ambient Mesh & Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(184,74,43,0.07),transparent_70%)] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/[0.025] rounded-full blur-3xl pointer-events-none -z-10" />

      <div
        ref={ref}
        className="max-w-[1200px] mx-auto px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Editorial Human Copy with Staggered Transitions */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* 1. Glass Pill Badge with Glowing Pulse Ring */}
            <div
              className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "0ms" }}
            >
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-[#E7E2DA] shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B84A2B] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B84A2B]" />
                </span>
                <span className="text-xs font-medium tracking-wide text-[#44403C]">
                  Workspace Akademis Mahasiswa
                </span>
              </div>
            </div>

            {/* 2. Headline — High-Character Editorial Serif with Breathing Room */}
            <h1
              className={`text-[2.65rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4.2rem] font-semibold tracking-[-0.025em] font-editorial text-[#1C1917] leading-[1.14] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "80ms" }}
            >
              Kuliah lebih tenang saat jadwal, materi, dan tugas{" "}
              <span className="relative inline-block bg-gradient-to-r from-[#B84A2B] via-[#C85A32] to-[#D46B42] bg-clip-text text-transparent">
                tidak berceceran.
                <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-[#B84A2B]/80 via-[#C85A32]/80 to-[#D46B42]/80 rounded-full" />
              </span>
            </h1>

            {/* 3. Subheadline with Relaxed Contrast */}
            <p
              className={`text-base sm:text-lg text-[#44403C]/90 font-sans leading-relaxed max-w-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "160ms" }}
            >
              Susun jadwal semester tanpa drama bentrok jam, arsipkan slide dosen per mata kuliah, dan bedah konsep rumit bareng AI tutor yang paham silabus perkuliahanmu.
            </p>

            {/* 4. Premium CTA Button Group */}
            <div
              className={`flex flex-wrap items-center gap-3 pt-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "240ms" }}
            >
              <Link href="/login" className="focus-visible:outline-hidden">
                <Button
                  size="lg"
                  className="h-12 px-7 rounded-lg text-[13.5px] font-semibold gap-2 bg-gradient-to-b from-[#C85A32] to-[#B84A2B] hover:from-[#D46B42] hover:to-[#C85A32] active:scale-[0.98] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_16px_rgba(184,74,43,0.32)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_22px_rgba(184,74,43,0.42)] hover:scale-[1.01] transition-all duration-200 cursor-pointer group"
                >
                  <span>Masuk ke Workspace — Gratis</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <Link href="/login" className="focus-visible:outline-hidden">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-6 rounded-lg text-[13.5px] font-medium gap-2 border border-[#E7E2DA] bg-white/70 hover:bg-white hover:border-[#D4CCC0] hover:text-[#1C1917] text-[#44403C] active:scale-[0.98] transition-all duration-150 cursor-pointer"
                >
                  <span>Masuk / Login</span>
                </Button>
              </Link>
              <Link href="/download" className="focus-visible:outline-hidden">
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-12 px-5 rounded-lg text-[13.5px] font-medium gap-2 text-[#57534E] hover:text-[#1C1917] hover:bg-white/60 active:scale-[0.98] transition-all duration-150 cursor-pointer group"
                >
                  <Download className="w-4 h-4 text-[#B84A2B] group-hover:translate-y-0.5 transition-transform duration-150" />
                  <span>Pasang di HP (PWA)</span>
                </Button>
              </Link>
            </div>

            {/* 5. Refined Trust Indicators with Dot Separators */}
            <div
              className={`pt-6 border-t border-[#E7E2DA]/70 flex flex-wrap items-center gap-y-2 gap-x-4 text-[13px] text-[#57534E] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "320ms" }}
            >
              <span className="flex items-center gap-1.5 font-medium text-[#44403C]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 stroke-[1.75]" />
                <span>Data terisolasi per akun</span>
              </span>
              <span className="text-[#A8A29E] select-none text-xs hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 font-medium text-[#44403C]">
                <Sparkles className="w-4 h-4 text-[#B84A2B] shrink-0 stroke-[1.75]" />
                <span>100% Bebas Iklan & Pelacak</span>
              </span>
              <span className="text-[#A8A29E] select-none text-xs hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 font-medium text-[#44403C]">
                <Smartphone className="w-4 h-4 text-[#B84A2B] shrink-0 stroke-[1.75]" />
                <span>Sinkron Web & HP Instan</span>
              </span>
            </div>
          </div>

          {/* Right: Refined Interactive Browser Window Mockup */}
          <div
            className={`lg:col-span-6 relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-[0.98]"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            {/* Floating Micro-Element: Semester Status Badge with Organic Ambient Float */}
            <div
              className="absolute -top-3.5 right-4 sm:right-8 z-30 animate-hero-float select-none pointer-events-none"
            >
              <div className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E7E2DA] shadow-[0_8px_20px_-4px_rgba(28,25,23,0.12),0_2px_6px_rgba(28,25,23,0.06)] flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                </span>
                <span className="text-[11.5px] font-semibold text-[#1C1917] font-sans">
                  0 Jadwal Bentrok
                </span>
                <span className="text-[#A8A29E] text-[10px]">•</span>
                <span className="text-[10.5px] font-mono font-medium text-emerald-700 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  21 SKS Valid
                </span>
              </div>
            </div>

            {/* Desktop Window Mockup with 3D Depth & Clean Perspective Elevation */}
            <div className="relative [perspective:1200px]">
              <div className="rounded-2xl border border-[#E7E2DA] bg-white shadow-[0_25px_60px_-15px_rgba(28,25,23,0.12),0_12px_24px_-8px_rgba(28,25,23,0.06),0_0_0_1px_rgba(231,226,218,0.7)] overflow-hidden transform lg:[transform:rotateY(-1.5deg)_rotateX(1.5deg)] transition-all duration-500 hover:[transform:rotateY(0deg)_rotateX(0deg)]">
                {/* Window Chrome Header Bar with Elegant Neutral Controls */}
                <div className="h-10 px-4 bg-[#FAF8F5]/90 border-b border-[#E7E2DA] flex items-center justify-between text-[11px] text-[#78716C] select-none">
                  {/* Subtle Traffic Light Dots */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-300 hover:bg-rose-400 transition-colors" />
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-300 hover:bg-amber-400 transition-colors" />
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-300 hover:bg-emerald-400 transition-colors" />
                  </div>

                  {/* Center Address Bar with Secure SSL Lock */}
                  <div className="px-3.5 py-1 rounded-full bg-white border border-[#E7E2DA] text-[11px] font-mono text-[#57534E] truncate max-w-[250px] shadow-2xs text-center flex items-center gap-1.5 justify-center">
                    <Lock className="w-2.5 h-2.5 text-[#78716C]" />
                    <span className="font-semibold text-[#1C1917]">velqora.web.id</span>
                    <span className="text-[#78716C]">/dashboard/jadwal</span>
                  </div>

                  {/* Right Status Badge */}
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#E7E2DA] text-[#44403C] text-[10px] font-medium shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Web Workspace</span>
                  </div>
                </div>

                {/* Modern Horizontal Workspace Navigation Bar */}
                <div className="px-4 sm:px-5 py-2 border-b border-[#E7E2DA]/80 bg-[#FAF8F5]/50 flex items-center justify-between text-xs select-none">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="px-2.5 py-1 rounded-md bg-white text-[#B84A2B] font-bold flex items-center gap-1.5 text-[11px] border border-[#B84A2B]/20 shadow-2xs">
                      <Layers className="w-3 h-3 text-[#B84A2B]" />
                      <span>Jadwal Kuliah</span>
                    </div>
                    <div className="px-2 py-1 rounded-md text-[#57534E] hover:text-[#1C1917] hover:bg-white flex items-center gap-1 text-[11px] transition-colors">
                      <BookOpen className="w-3 h-3 text-[#78716C]" />
                      <span>Modul & Slide</span>
                    </div>
                    <div className="px-2 py-1 rounded-md text-[#57534E] hover:text-[#1C1917] hover:bg-white flex items-center gap-1 text-[11px] transition-colors hidden sm:flex">
                      <CheckSquare className="w-3 h-3 text-[#78716C]" />
                      <span>Tugas</span>
                    </div>
                    <div className="px-2 py-1 rounded-md text-[#57534E] hover:text-[#1C1917] hover:bg-white flex items-center gap-1 text-[11px] transition-colors hidden sm:flex">
                      <Bot className="w-3 h-3 text-[#78716C]" />
                      <span>AI Tutor</span>
                    </div>
                  </div>

                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-semibold flex items-center gap-1">
                    <span>✓</span> Sesi Terjadwal
                  </span>
                </div>

                {/* Main Workspace Area (Generous Left Padding: zero clipping from foreground card) */}
                <div className="p-4 sm:p-5 pl-14 sm:pl-16 lg:pl-20 bg-[#FAF8F5]/35 space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#E7E2DA]">
                    <div>
                      <p className="text-xs font-semibold text-[#1C1917] font-editorial">
                        Semester Genap • 21 SKS
                      </p>
                      <p className="text-[11px] text-[#78716C] font-mono">
                        Kalender Mingguan Aktif
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-[#57534E] bg-white border border-[#E7E2DA] px-2 py-0.5 rounded">
                      Sesi Pagi & Siang
                    </span>
                  </div>

                  {/* Schedule Cards with Pristine Contrast & Alignment */}
                  <div className="space-y-2.5 text-xs">
                    {/* Item 1: Struktur Data */}
                    <div className="p-3 rounded-xl bg-white border border-[#E7E2DA] shadow-2xs hover:border-[#B84A2B]/40 transition-colors flex items-center justify-between gap-3">
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#B84A2B] shrink-0" />
                          <p className="font-semibold text-[#1C1917] font-editorial text-xs truncate">
                            Struktur Data & Algoritma
                          </p>
                        </div>
                        <p className="text-[11px] text-[#57534E] font-medium pl-4">
                          Senin • 08:00 – 10:30 • Lab Komputer 3
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-[#B84A2B]/10 text-[#B84A2B] font-semibold border border-[#B84A2B]/20 shrink-0">
                        3 SKS
                      </span>
                    </div>

                    {/* Item 2: Sistem Basis Data */}
                    <div className="p-3 rounded-xl bg-white border border-[#E7E2DA] shadow-2xs hover:border-amber-500/40 transition-colors flex items-center justify-between gap-3">
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                          <p className="font-semibold text-[#1C1917] font-editorial text-xs truncate">
                            Sistem Basis Data Terdistribusi
                          </p>
                        </div>
                        <p className="text-[11px] text-[#57534E] font-medium pl-4">
                          Rabu • 13:00 – 15:30 • Gedung Kuliah B201
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-semibold border border-amber-200/60 shrink-0">
                        3 SKS
                      </span>
                    </div>

                    {/* Item 3: Kecerdasan Buatan & ML */}
                    <div className="p-3 rounded-xl bg-white border border-[#E7E2DA] shadow-2xs hover:border-purple-500/40 transition-colors flex items-center justify-between gap-3">
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                          <p className="font-semibold text-[#1C1917] font-editorial text-xs truncate">
                            Kecerdasan Buatan & ML
                          </p>
                        </div>
                        <p className="text-[11px] text-[#57534E] font-medium pl-4">
                          Kamis • 10:00 – 12:30 • Lab Riset AI
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold border border-purple-200/60 shrink-0">
                        3 SKS
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 360° INTERACTIVE 3D LANYARD COMPANION CARD */}
            <Interactive360LanyardCard isVisible={isVisible} />
          </div>
        </div>
      </div>
    </section>
  );
}
