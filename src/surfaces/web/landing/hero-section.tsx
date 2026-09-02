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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookshelfHeroBackground } from "./bookshelf-bg";
import { useScrollReveal } from "./use-landing-animation";

/**
 * 3D Physical Grommet & Interlocking Clasp Aperture
 * Features a real 3D metallic torus eyelet with directional top-left specular lighting,
 * hollow inner aperture depth, and an interlocking lobster carabiner hook latch.
 */
function Physical3DGrommet({ isBack = false }: { isBack?: boolean }) {
  return (
    <div className="flex justify-center -mt-6 mb-1 relative z-30 [transform-style:preserve-3d] pointer-events-none">
      {/* 3D Tab Base extending smoothly from Card */}
      <div
        className={`px-5 py-1.5 rounded-full border flex items-center justify-center relative shadow-[0_4px_10px_rgba(0,0,0,0.3)] ${
          isBack
            ? "bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900 border-stone-600"
            : "bg-gradient-to-b from-stone-100 via-stone-200 to-stone-300 border-stone-300"
        }`}
      >
        {/* 3D Metallic Donut / Torus Grommet Ring with Top-Left Directional Lighting */}
        <div
          className="w-8 h-4 rounded-full flex items-center justify-center relative shadow-[0_3px_6px_rgba(0,0,0,0.45)]"
          style={{
            background:
              "conic-gradient(from 315deg at 50% 50%, #ffffff 0%, #e4e4e7 25%, #71717a 50%, #3f3f46 75%, #ffffff 100%)",
            boxShadow:
              "inset 1.5px 1.5px 2px rgba(255,255,255,0.9), inset -1.5px -1.5px 3px rgba(0,0,0,0.6), 0 2px 5px rgba(0,0,0,0.35)",
          }}
        >
          {/* Deep Hollow Inner Eyelet Hole (Aperture with Inset Void Shadow) */}
          <div
            className="w-4 h-2 rounded-full bg-stone-950 flex items-center justify-center relative overflow-hidden"
            style={{
              boxShadow: "inset 0 3px 5px rgba(0,0,0,0.95), inset 0 -1px 2px rgba(255,255,255,0.25)",
            }}
          >
            {/* Interlocking Lobster Hook Front Latch (Physically threads through the aperture) */}
            <div className="w-2 h-3 bg-gradient-to-b from-stone-300 via-stone-100 to-stone-500 rounded-b-xs shadow-xs -mt-1 opacity-90" />
          </div>
        </div>

        {/* Ambient Occlusion Shadow Under Grommet on Card Surface */}
        <div className="absolute -bottom-1 inset-x-2 h-1.5 bg-black/40 blur-xs rounded-full pointer-events-none" />
      </div>
    </div>
  );
}

/**
 * World-Class 360° Interactive 3D Lanyard Card with Elastic Stretch & Physics
 *
 * Physical & Structural Guarantees:
 * 1. Strict DOM Hierarchy: Clip -> Strap -> Crimp Collar / Swivel Clasp -> Card Chassis (Nested Child).
 * 2. Exact Pivot: Card rotation transform-origin is placed precisely at the top grommet/D-ring joint (50% 0px).
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
  const baseStrapHeight = 105;
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
      className={`absolute top-0 -left-2 sm:-left-6 z-30 pointer-events-none flex flex-col items-center [perspective:1200px] transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.34,1.4,0.64,1)] overflow-visible ${
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
        {/* ── 1. TOP WINDOW MOUNT BRACKET / CHROME CLIP (Fixed Anchor) ── */}
        <div className="relative z-30 flex flex-col items-center -mt-3.5 [transform-style:preserve-3d]">
          {/* Chrome Metal Clamp with Inset Screws & Specular Highlight */}
          <div
            className="w-10 sm:w-11 px-2.5 py-1.5 rounded-t-sm border border-stone-400/90 shadow-[0_4px_10px_rgba(0,0,0,0.35),inset_0_-2px_4px_rgba(0,0,0,0.3)] flex items-center justify-between"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, #e2e8f0 35%, #94a3b8 70%, #475569 100%)",
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-stone-700 shadow-inner" />
            <div className="w-3.5 h-0.5 bg-stone-800 rounded-full opacity-60" />
            <div className="w-1.5 h-1.5 rounded-full bg-stone-700 shadow-inner" />
          </div>

          {/* Swivel Top Ring */}
          <div
            className="w-5 h-4.5 rounded-full border-[2.5px] border-stone-400 shadow-sm -mt-1 flex items-center justify-center"
            style={{
              background:
                "conic-gradient(from 315deg at 50% 50%, #ffffff 0%, #cbd5e1 25%, #64748b 50%, #334155 75%, #ffffff 100%)",
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-xs" />
          </div>
        </div>

        {/* ── 2. CLASSIC WOVEN FABRIC LANYARD STRAP (Stretches & Narrows with Physics) ── */}
        <div
          className="w-[34px] sm:w-[36px] relative flex flex-col items-center justify-center -mt-1.5 rounded-xs border-x border-brand-950/70 [transform-style:preserve-3d]"
          style={{
            height: `${currentStrapHeight}px`,
            background:
              "linear-gradient(90deg, #853827 0%, #a34530 14%, #c2553a 42%, #e0654f 50%, #c2553a 58%, #a34530 86%, #853827 100%)",
            transform: `scaleX(${strapWidthScale}) skewX(${strapSkew}deg) rotateZ(${strapRotate}deg)`,
            transformOrigin: "top center",
            filter: `brightness(${strapBrightness})`,
            boxShadow:
              "2.5px 0 6px rgba(0,0,0,0.22), -1px 0 2px rgba(0,0,0,0.1), inset 0 3px 6px rgba(0,0,0,0.4), inset 0 -3px 6px rgba(0,0,0,0.4)",
            transition: isDragging ? "none" : "transform 180ms ease-out, filter 180ms ease-out",
            willChange: "transform, height, filter",
          }}
        >
          {/* Top & Bottom Tuck-in Connection Shadows */}
          <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-20" />
          <div className="absolute bottom-0 inset-x-0 h-2.5 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-20" />

          {/* Left & Right Fine Double Dashed Stitch Lines */}
          <div className="absolute inset-y-0 left-1 w-px border-l border-dashed border-white/50" />
          <div className="absolute inset-y-0 right-1 w-px border-r border-dashed border-white/50" />

          {/* High-Density Tactile Woven Webbing Texture */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px, rgba(0,0,0,0.25) 3px, rgba(0,0,0,0.25) 4px)",
            }}
          />

          {/* Tension Glow Highlight — flares when pulled taut */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(180deg, transparent 10%, rgba(255,210,170,0.22) 50%, transparent 90%)",
              opacity: stretchFactor,
              transition: isDragging ? "none" : "opacity 180ms ease-out",
            }}
          />

          {/* Solid 3D Woven Jacquard Monogram */}
          <div className="h-full flex items-center justify-center py-2 select-none pointer-events-none z-10">
            <span className="text-[9px] font-mono font-extrabold tracking-[0.32em] text-white/95 uppercase [writing-mode:vertical-lr] rotate-180 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
              VELQORA
            </span>
          </div>

          {/* ── 3. METALLIC CRIMP COLLAR & SWIVEL LOBSTER CLASP (Child of Strap) ── */}
          <div className="absolute -bottom-5 z-30 flex flex-col items-center [transform-style:preserve-3d]">
            {/* Brushed Silver Crimp Collar */}
            <div className="w-9 h-3.5 bg-gradient-to-r from-stone-400 via-white to-stone-400 rounded-xs border border-stone-400 shadow-[0_3px_8px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.8)] flex items-center justify-around px-1.5">
              <div className="w-1 h-1.5 bg-stone-800 rounded-full shadow-inner" />
              <div className="w-2.5 h-0.5 bg-stone-600 rounded-full opacity-70" />
              <div className="w-1 h-1.5 bg-stone-800 rounded-full shadow-inner" />
            </div>

            {/* Swivel D-Ring Housing */}
            <div
              className="w-5 h-5 rounded-full border-[2.5px] border-stone-400 shadow-md -mt-1 flex items-center justify-center"
              style={{
                background:
                  "conic-gradient(from 315deg at 50% 50%, #ffffff 0%, #e2e8f0 25%, #64748b 50%, #334155 75%, #ffffff 100%)",
              }}
            >
              {/* Lobster Clasp Spring Hook Latch (Extends directly into card eyelet grommet) */}
              <div className="w-3 h-5 bg-gradient-to-b from-stone-200 via-white to-stone-400 border border-stone-500 rounded-b-md -mb-3 shadow-md flex items-end justify-center pb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-stone-700" />
              </div>
            </div>

            {/* ── 4. TRUE 360° ROTATABLE 3D CARD (Child with transformOrigin at Top Grommet) ── */}
            <div
              onPointerEnter={() => setIsHovered(true)}
              onPointerLeave={() => setIsHovered(false)}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              title="Geser horizontal 360° · Tarik ke bawah untuk stretch elastis"
              className="w-56 sm:w-64 h-64 sm:h-70 relative -mt-1 pointer-events-auto cursor-grab active:cursor-grabbing select-none [touch-action:none] [transform-style:preserve-3d]"
              style={{
                transform: `rotateX(${safeRotX}deg) rotateY(${safeRotY}deg) scale3d(${cardScale}, ${cardScale}, 1)`,
                transformOrigin: "50% 0px", // PIVOTS EXACTLY AT THE GROMMET CONNECTION POINT
                willChange: "transform",
              }}
            >
              {/* ── FRONT FACE (rotateY 0deg) WITH 3D CHASSIS THICKNESS RIM ── */}
              <div
                className="absolute inset-0 rounded-3xl bg-white p-2.5 border-[2px] border-stone-200 [backface-visibility:hidden] [transform:rotateY(0deg)] overflow-hidden flex flex-col justify-between transition-shadow duration-300"
                style={{
                  boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha}), 0 1px 0 1px #e7e5e4, 0 2.5px 0 1.5px #d6d3d1, 0 4px 0 2px #a8a29e, 0 5.5px 0 2.5px #78716c, 0 10px 24px rgba(194,85,58,0.12)`,
                }}
              >
                {/* Dynamic Specular Light Glare Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-3xl z-40 transition-opacity duration-150"
                  style={{
                    background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.15) 45%, transparent 75%)`,
                    opacity: glare.opacity,
                  }}
                />

                {/* 3D Physical Torus Grommet Ring */}
                <Physical3DGrommet isBack={false} />

                {/* Inner Phone Screen Content */}
                <div className="rounded-2xl bg-surface-secondary/80 border border-border/80 p-3 space-y-2.5 text-text-primary shadow-inner flex-1 flex flex-col justify-between">
                  {/* Speaker / Camera Bezel */}
                  <div className="w-14 h-1 bg-stone-300 rounded-full mx-auto" />

                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[11px] border-b border-border/80 pb-1.5">
                    <span className="font-bold text-text-primary flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse shadow-xs" />
                      Velqora Mobile
                    </span>
                    <span className="text-[9.5px] font-mono font-semibold bg-brand-500/10 text-brand-600 px-2 py-0.5 rounded-md border border-brand-500/20">
                      PWA Active
                    </span>
                  </div>

                  {/* Live Schedule Widget */}
                  <div className="p-2.5 rounded-xl bg-white border border-brand-500/25 space-y-1 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between">
                      <p className="text-[9.5px] text-brand-600 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkle className="w-2.5 h-2.5" />
                        Kelas Berikutnya
                      </p>
                      <span className="text-[9.5px] text-emerald-600 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        10 Menit Lagi
                      </span>
                    </div>
                    <p className="text-xs sm:text-[13px] font-bold text-text-primary leading-tight">
                      Kalkulus Lanjut
                    </p>
                    <p className="text-[10px] text-text-secondary font-medium">
                      10:45 • Ruang 402 Gedung C
                    </p>
                  </div>

                  {/* Interactive Rotate Hint & Flip Trigger */}
                  <div
                    className={`flex items-center justify-between text-[9px] text-text-tertiary pt-0.5 font-semibold transition-opacity duration-300 ${
                      hasInteracted ? "opacity-60 hover:opacity-100" : "opacity-100"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <RotateCw className="w-3 h-3 text-brand-500" />
                      <span>Geser 360°</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleQuickFlip}
                      className="px-2 py-0.5 rounded bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 border border-brand-500/20 transition-colors cursor-pointer active:scale-95"
                    >
                      Balik Kartu ↺
                    </button>
                  </div>
                </div>
              </div>

              {/* ── BACK FACE (rotateY 180deg) WITH 3D CHASSIS THICKNESS RIM ── */}
              <div
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 p-2.5 border-[2px] border-stone-700 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden flex flex-col justify-between text-white transition-shadow duration-300"
                style={{
                  boxShadow: `${-shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha + 0.12}), 0 1px 0 1px #44403c, 0 2.5px 0 1.5px #292524, 0 4px 0 2px #1c1917, 0 5.5px 0 2.5px #0c0a09`,
                }}
              >
                {/* 3D Physical Torus Grommet Ring (Back Face View) */}
                <Physical3DGrommet isBack={true} />

                {/* Inner Digital Student Pass */}
                <div className="rounded-2xl bg-stone-800/90 border border-stone-700/80 p-3 space-y-2 flex-1 flex flex-col justify-between relative overflow-hidden">
                  {/* Holographic shimmer glow */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/15 rounded-full blur-xl pointer-events-none" />

                  {/* Pass Header */}
                  <div className="flex items-center justify-between border-b border-stone-700/80 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-sm bg-brand-500 flex items-center justify-center font-bold text-[8px] text-white">
                        V
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-wider text-stone-200">
                        ACADEMIC PASS
                      </span>
                    </div>
                    <Wifi className="w-3.5 h-3.5 text-brand-400" />
                  </div>

                  {/* QR Code Scanner Box */}
                  <div className="flex items-center gap-3 bg-stone-900/90 p-2 rounded-xl border border-stone-700/70">
                    <div className="p-1.5 bg-white rounded-lg shrink-0">
                      <QrCode className="w-8 h-8 text-stone-900" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-[10px] font-mono font-bold text-brand-400 truncate">
                        NIM: 22/498210/TK
                      </p>
                      <p className="text-[9px] text-stone-300 truncate">Teknik Informatika</p>
                      <p className="text-[8px] text-stone-400 font-mono">Sem. Genap 2026</p>
                    </div>
                  </div>

                  {/* NFC Sync Tag */}
                  <div className="flex items-center justify-between text-[9px] font-mono text-stone-400 pt-0.5">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Synced PWA
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
      </div>
    </div>
  );
}

export function HeroSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="relative pt-14 pb-20 lg:pt-20 lg:pb-28 border-b border-border overflow-x-hidden">
      <BookshelfHeroBackground />

      {/* Warm subtle ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div
        ref={ref}
        className="max-w-[1200px] mx-auto px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Editorial Human Copy with Staggered Transitions */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* 1. Kicker Badge */}
            <div
              className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "0ms" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 text-xs font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                Workspace Akademis Mahasiswa
              </div>
            </div>

            {/* 2. Headline */}
            <h1
              className={`text-[2.4rem] sm:text-[3rem] lg:text-[3.25rem] xl:text-[3.65rem] font-extrabold tracking-[-0.035em] font-display text-text-primary leading-[1.1] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "80ms" }}
            >
              Kuliah lebih tenang saat jadwal, materi, dan tugas{" "}
              <span className="text-brand-500 underline decoration-brand-500/30 decoration-wavy decoration-1 underline-offset-4">
                tidak berceceran.
              </span>
            </h1>

            {/* 3. Subheadline */}
            <p
              className={`text-base lg:text-[17px] text-text-secondary leading-relaxed max-w-lg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "160ms" }}
            >
              Susun jadwal semester tanpa drama bentrok jam, arsipkan slide dosen per mata kuliah, dan bedah konsep rumit bareng AI tutor yang paham silabus perkuliahanmu.
            </p>

            {/* 4. CTA Group */}
            <div
              className={`flex flex-wrap items-center gap-3 pt-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "240ms" }}
            >
              <Link href="/dashboard" className="focus-visible:outline-hidden">
                <Button
                  size="lg"
                  className="text-sm font-semibold gap-2 bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white px-6 shadow-sm hover:shadow-md transition-all duration-150"
                >
                  <span>Masuk ke Workspace — Gratis</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/download" className="focus-visible:outline-hidden">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-sm font-medium gap-2 border-border hover:bg-surface-hover hover:border-border-hover text-text-primary active:scale-[0.98] transition-all duration-150"
                >
                  <Download className="w-4 h-4 text-brand-500" />
                  <span>Pasang di HP (PWA)</span>
                </Button>
              </Link>
            </div>

            {/* 5. Trust Indicators */}
            <div
              className={`pt-4 border-t border-border/80 flex flex-wrap items-center gap-y-2 gap-x-5 text-[12px] text-text-tertiary transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "320ms" }}
            >
              <span className="flex items-center gap-1.5 text-text-secondary font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                Data terisolasi per akun
              </span>
              <span className="w-px h-3 bg-border hidden sm:inline-block" />
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                100% Bebas Iklan & Pelacak
              </span>
              <span className="w-px h-3 bg-border hidden sm:inline-block" />
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                Sinkron Web & HP Instan
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
            {/* Desktop Window Mockup with Glassmorphism Foundation */}
            <div className="rounded-2xl border border-border bg-white/95 backdrop-blur-md shadow-2xl overflow-hidden transform lg:rotate-1 lg:translate-x-2 transition-transform duration-300 hover:rotate-0">
              {/* Window Chrome Header Bar with Consistent Padding & Alignment */}
              <div className="h-10 px-4 bg-surface-secondary/90 border-b border-border flex items-center justify-between text-[11px] text-text-tertiary select-none">
                {/* Traffic Light Dots */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400 border border-rose-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-500/40" />
                </div>

                {/* Center Address Bar */}
                <div className="px-3 py-1 rounded-md bg-white border border-border text-[11px] font-mono text-text-secondary truncate max-w-[240px] shadow-2xs text-center">
                  velqora.web.id/dashboard/jadwal
                </div>

                {/* Right Status Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[10px] font-semibold shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Web Workspace</span>
                </div>
              </div>

              {/* Dashboard Content Grid View */}
              <div className="p-4 sm:p-5 grid grid-cols-12 gap-4 bg-background/95">
                {/* Mini Sidebar with Consistent Alignment */}
                <div className="col-span-3 hidden sm:flex flex-col gap-1.5 pr-3 border-r border-border text-xs select-none">
                  <div className="px-2.5 py-1.5 rounded-lg bg-brand-500/10 text-brand-600 font-semibold flex items-center gap-2 shadow-2xs border border-brand-500/20">
                    <Layers className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Jadwal Kuliah</span>
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg text-text-secondary hover:bg-surface-secondary flex items-center gap-2 transition-colors">
                    <BookOpen className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                    <span className="truncate">Modul & Slide</span>
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg text-text-secondary hover:bg-surface-secondary flex items-center gap-2 transition-colors">
                    <CheckSquare className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                    <span className="truncate">Tugas Kuliah</span>
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg text-text-secondary hover:bg-surface-secondary flex items-center gap-2 transition-colors">
                    <Bot className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                    <span className="truncate">AI Tutor</span>
                  </div>
                </div>

                {/* Main Workspace Area (Protected Left Padding against Lanyard Card Overlap) */}
                <div className="col-span-12 sm:col-span-9 space-y-3 pl-1 sm:pl-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-border/70">
                    <div>
                      <p className="text-xs font-bold text-text-primary font-display">
                        Semester Genap • 21 SKS
                      </p>
                      <p className="text-[11px] text-text-tertiary font-mono">
                        Kalender Mingguan Aktif
                      </p>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-semibold flex items-center gap-1">
                      <span>✓</span> 0 Jadwal Bentrok
                    </span>
                  </div>

                  {/* Schedule Cards with Perfect High-Contrast Typography & SKS Alignment */}
                  <div className="space-y-2.5 text-xs">
                    {/* Item 1: Struktur Data */}
                    <div className="p-3 rounded-xl bg-white border border-border shadow-2xs hover:border-brand-500/40 transition-colors flex items-center justify-between gap-3">
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                          <p className="font-bold text-text-primary text-xs truncate">
                            Struktur Data & Algoritma
                          </p>
                        </div>
                        <p className="text-[11px] text-text-secondary font-medium pl-4">
                          Senin • 08:00 – 10:30 • Lab Komputer 3
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-brand-500/10 text-brand-700 font-semibold border border-brand-500/20 shrink-0">
                        3 SKS
                      </span>
                    </div>

                    {/* Item 2: Sistem Basis Data */}
                    <div className="p-3 rounded-xl bg-white border border-border shadow-2xs hover:border-brand-500/40 transition-colors flex items-center justify-between gap-3">
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                          <p className="font-bold text-text-primary text-xs truncate">
                            Sistem Basis Data Terdistribusi
                          </p>
                        </div>
                        <p className="text-[11px] text-text-secondary font-medium pl-4">
                          Rabu • 13:00 – 15:30 • Gedung Kuliah B201
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-brand-500/10 text-brand-700 font-semibold border border-brand-500/20 shrink-0">
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
