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
 * Physically Unified 360° Interactive 3D Lanyard Card Assembly
 * - Real structural tuck-in connections at top clamp & bottom clasp (zero floating gaps)
 * - Metallic grommet ring (eyelet) anchored to phone card loop
 * - Thick, solid woven fabric webbing with cylindrical volume lighting & edge stitches
 * - Momentum velocity drag with spring-damper settling physics
 * - Dual-sided 3D faces: Front (Schedule Widget) | Back (Academic ID & QR Pass)
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

  // Physics animation loop refs
  const animFrameRef = useRef<number | null>(null);
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastPointerRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const rotRef = useRef<{ x: number; y: number }>({ x: 4, y: -6 });
  const isDraggingRef = useRef(false);

  // Sync ref with state
  useEffect(() => {
    rotRef.current = { x: rotX, y: rotY };
  }, [rotX, rotY]);

  // Spring physics decay loop on pointer release
  const startSpringDecay = useCallback((targetFaceY: number, initialVelY: number) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    let currentY = rotRef.current.y;
    let currentX = rotRef.current.x;
    let velY = initialVelY;
    let velX = (4 - currentX) * 0.1;

    const stiffness = 0.075; // Spring tension
    const damping = 0.82;    // Damping friction (allows 2-3 smooth oscillations)

    const step = () => {
      if (isDraggingRef.current) return;

      const forceY = (targetFaceY - currentY) * stiffness;
      velY = (velY + forceY) * damping;
      currentY += velY;

      const forceX = (4 - currentX) * stiffness;
      velX = (velX + forceX) * damping;
      currentX += velX;

      setRotX(currentX);
      setRotY(currentY);

      // Continue until settled
      if (Math.abs(velY) > 0.05 || Math.abs(targetFaceY - currentY) > 0.1 || Math.abs(velX) > 0.05) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setRotX(4);
        setRotY(targetFaceY);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  // Handle pointer down (mouse or touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    setIsDragging(true);
    isDraggingRef.current = true;
    setHasInteracted(true);

    lastPointerRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
    };
    velocityRef.current = { x: 0, y: 0 };

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  // Handle pointer move
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const now = performance.now();
    const dt = Math.max(1, now - lastPointerRef.current.time);
    const deltaX = e.clientX - lastPointerRef.current.x;
    const deltaY = e.clientY - lastPointerRef.current.y;

    // Calculate instantaneous velocity (deg/frame equivalent)
    const instVelY = (deltaX / dt) * 16;
    const instVelX = (deltaY / dt) * 16;
    velocityRef.current = {
      x: instVelX * 0.4 + velocityRef.current.x * 0.6,
      y: instVelY * 0.4 + velocityRef.current.y * 0.6,
    };

    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: now };

    const nextRotY = rotRef.current.y + deltaX * 0.75;
    const nextRotX = Math.max(-26, Math.min(26, rotRef.current.x - deltaY * 0.4));

    setRotX(nextRotX);
    setRotY(nextRotY);

    // Calculate light glare coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const normY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setGlare({ x: normX, y: normY, opacity: 0.65 });
  };

  // Handle pointer up with momentum & spring physics
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    setIsDragging(false);
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    // Projected landing angle based on release velocity
    const projectedY = rotRef.current.y + velocityRef.current.y * 8;
    const normalizedY = ((projectedY % 360) + 360) % 360;
    const isCloserToBack = normalizedY > 90 && normalizedY < 270;

    // Find nearest target face (0°, 180°, 360°, etc.)
    const baseTurns = Math.round((projectedY - (isCloserToBack ? 180 : 0)) / 360) * 360;
    const targetY = baseTurns + (isCloserToBack ? 180 : -6);

    // Launch spring-decay loop
    startSpringDecay(targetY, velocityRef.current.y * 1.4);
    setGlare((prev) => ({ ...prev, opacity: 0.35 }));
  };

  // Quick button flip trigger
  const handleQuickFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasInteracted(true);
    const nextTargetY = rotRef.current.y + 180;
    startSpringDecay(nextTargetY, 14);
  };

  // Calculate dynamic 3D visual metrics
  const radY = (rotY * Math.PI) / 180;
  const cosY = Math.cos(radY);
  const sinY = Math.sin(radY);

  // 1. Strap skew flex (simulates flexible ribbon bending with card)
  const strapSkew = sinY * 8;
  const strapRotate = rotX * 0.25;

  // 2. Physical scale dip at 90 degrees (thin card turning edge-on)
  const cardScale = 0.94 + 0.06 * Math.abs(cosY);

  // 3. Dynamic directional ambient drop shadow
  const shadowOffsetX = -sinY * 24;
  const shadowOffsetY = 24 + Math.abs(cosY) * 12;
  const shadowBlur = 35 + Math.abs(cosY) * 18;
  const shadowAlpha = 0.16 + Math.abs(cosY) * 0.16;

  // Cleanup animation frame
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      className={`absolute top-0 -left-2 sm:-left-6 bottom-[-44px] z-30 pointer-events-none flex flex-col items-center [perspective:1300px] transition-all duration-1000 ease-[cubic-bezier(0.34,1.4,0.64,1)] ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-48"
      }`}
      style={{ transitionDelay: "450ms" }}
    >
      <div
        className="flex flex-col items-center origin-top h-full [transform-style:preserve-3d]"
        style={{
          transform: `translate3d(0, ${isHovered && !isDragging ? -4 : 0}px, 28px)`,
          transition: isDragging ? "none" : "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
        }}
      >
        {/* ── 1. SOLID CHROME TOP WINDOW CLAMP (Anchored firmly to window frame) ── */}
        <div className="relative z-30 flex flex-col items-center -mt-3 [transform-style:preserve-3d]">
          {/* Chrome Metal Clamp Bracket (Firmly gripping frame & tucking fabric strap inside) */}
          <div className="w-9 sm:w-10 px-2 py-1 rounded-t-sm bg-gradient-to-b from-white via-stone-200 to-stone-400 border border-stone-400 shadow-[0_4px_10px_rgba(0,0,0,0.35),inset_0_-2px_4px_rgba(0,0,0,0.3)] flex items-center justify-between">
            <div className="w-1.5 h-1.5 rounded-full bg-stone-700 shadow-inner" />
            <div className="w-3 h-0.5 bg-stone-800 rounded-full opacity-60" />
            <div className="w-1.5 h-1.5 rounded-full bg-stone-700 shadow-inner" />
          </div>
          {/* Swivel Top Ring */}
          <div className="w-4.5 h-4.5 rounded-full border-[2.5px] border-stone-400 bg-gradient-to-tr from-stone-300 via-white to-stone-400 shadow-sm -mt-1 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-xs" />
          </div>
        </div>

        {/* ── 2. SOLID WOVEN FABRIC LANYARD STRAP (Tucked seamlessly into top & bottom clamps) ── */}
        <div
          className="flex-1 w-8 sm:w-9 relative flex flex-col items-center justify-center -my-1 overflow-hidden rounded-xs border-x-2 border-brand-900/80 shadow-[0_8px_24px_rgba(194,85,58,0.38),0_4px_10px_rgba(0,0,0,0.22)] [transform-style:preserve-3d]"
          style={{
            background:
              "linear-gradient(90deg, #993822 0%, #ba462b 12%, #d95e3f 45%, #ea6f50 55%, #ba462b 88%, #993822 100%)",
            transform: `skewX(${strapSkew}deg) rotateZ(${strapRotate}deg)`,
            transformOrigin: "top center",
            transition: isDragging ? "none" : "transform 200ms ease-out",
            willChange: "transform",
          }}
        >
          {/* Top & Bottom Deep Inset Connection Shadows (Proves physical tuck-in) */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-20" />
          <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-20" />

          {/* Left & Right Double Stitches (Full Length) */}
          <div className="absolute inset-y-0 left-1 w-px border-l-2 border-dashed border-white/60" />
          <div className="absolute inset-y-0 right-1 w-px border-r-2 border-dashed border-white/60" />

          {/* High-Density Tactile Woven Webbing Texture */}
          <div
            className="absolute inset-0 opacity-35 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px)",
            }}
          />

          {/* Solid 3D Woven Monogram */}
          <div className="h-full flex items-center justify-center py-4 select-none pointer-events-none z-10">
            <span className="text-[9px] font-mono font-extrabold tracking-[0.32em] text-white uppercase [writing-mode:vertical-lr] rotate-180 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              VELQORA
            </span>
          </div>
        </div>

        {/* ── 3. METALLIC CRIMP COLLAR & LOBSTER CLASP HARDWARE (Directly locking into Card Grommet) ── */}
        <div className="relative z-30 flex flex-col items-center -my-1 [transform-style:preserve-3d]">
          {/* Silver Crimp Collar (Clamping down on strap bottom) */}
          <div className="w-8.5 h-3.5 bg-gradient-to-r from-stone-400 via-white to-stone-400 rounded-xs border border-stone-400 shadow-[0_3px_8px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.8)] flex items-center justify-around px-1.5">
            <div className="w-1 h-1.5 bg-stone-800 rounded-full shadow-inner" />
            <div className="w-2.5 h-0.5 bg-stone-600 rounded-full opacity-70" />
            <div className="w-1 h-1.5 bg-stone-800 rounded-full shadow-inner" />
          </div>

          {/* Swivel D-Ring */}
          <div className="w-5 h-5 rounded-full border-[2.5px] border-stone-400 bg-gradient-to-tr from-stone-200 via-white to-stone-300 shadow-md -mt-1 flex items-center justify-center">
            {/* Lobster Clasp Spring Hook (Descends directly into the card grommet) */}
            <div className="w-3 h-5 bg-gradient-to-b from-stone-200 via-white to-stone-400 border border-stone-500 rounded-b-md -mb-3 shadow-md flex items-end justify-center pb-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-700" />
            </div>
          </div>
        </div>

        {/* ── 4. TRUE 360° ROTATABLE 3D CARD WITH INTEGRATED GROMMET RING ── */}
        <div
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          title="Geser 360° untuk memutar kartu"
          className="w-56 sm:w-64 h-64 sm:h-70 relative mt-0.5 pointer-events-auto cursor-grab active:cursor-grabbing select-none [touch-action:none] [transform-style:preserve-3d]"
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${cardScale}, ${cardScale}, 1)`,
            willChange: "transform",
          }}
        >
          {/* ── FRONT FACE (rotateY 0deg) ── */}
          <div
            className="absolute inset-0 rounded-3xl bg-white p-2.5 border-[2.5px] border-stone-200 border-b-[5px] border-r-[4px] border-stone-400/80 [backface-visibility:hidden] [transform:rotateY(0deg)] overflow-hidden flex flex-col justify-between transition-shadow duration-300"
            style={{
              boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha}), 0 10px 20px rgba(194,85,58,0.12)`,
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

            {/* Top Physical Metallic Grommet Ring (Eyelet) */}
            <div className="flex justify-center -mt-5 mb-1 relative z-30">
              <div className="px-4 py-1 rounded-full bg-gradient-to-b from-stone-200 via-white to-stone-300 border border-stone-400 shadow-[0_2px_6px_rgba(0,0,0,0.25)] flex items-center justify-center">
                {/* Hollow Grommet Eyelet (Through which the lobster clasp hooks) */}
                <div className="w-5 h-2 rounded-full bg-stone-900 border-[1.5px] border-stone-600 shadow-inner flex items-center justify-center">
                  <div className="w-2 h-1 rounded-full bg-stone-950" />
                </div>
              </div>
            </div>

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

          {/* ── BACK FACE (rotateY 180deg) ── */}
          <div
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 p-2.5 border-[2.5px] border-stone-700 border-b-[5px] border-r-[4px] border-stone-800 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden flex flex-col justify-between text-white transition-shadow duration-300"
            style={{
              boxShadow: `${-shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha + 0.1})`,
            }}
          >
            {/* Top Physical Metallic Grommet Ring (Eyelet Back View) */}
            <div className="flex justify-center -mt-5 mb-1 relative z-30">
              <div className="px-4 py-1 rounded-full bg-stone-800 border border-stone-600 shadow-[0_2px_6px_rgba(0,0,0,0.35)] flex items-center justify-center">
                <div className="w-5 h-2 rounded-full bg-stone-950 border-[1.5px] border-stone-700 shadow-inner flex items-center justify-center">
                  <div className="w-2 h-1 rounded-full bg-black" />
                </div>
              </div>
            </div>

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
  );
}

export function HeroSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="relative pt-14 pb-20 lg:pt-20 lg:pb-28 border-b border-border overflow-hidden">
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
