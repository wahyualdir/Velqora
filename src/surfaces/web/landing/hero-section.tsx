"use client";

import React, { useState, useRef, useEffect } from "react";
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
 * 360° Interactive 3D Lanyard Card with Front/Back Dual Faces
 * - Full 360-degree pointer drag & touch swipe physics
 * - Inertial spring-settle on release
 * - Two-sided 3D card: Front (Class Schedule Widget) | Back (Digital Student Pass & QR)
 * - Dynamic specular light glare
 */
function Interactive360LanyardCard({ isVisible }: { isVisible: boolean }) {
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 4, y: -6 });
  const [isDragging, setIsDragging] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [glare, setGlare] = useState<{ x: number; y: number }>({ x: 50, y: 30 });

  const dragStartRef = useRef<{ x: number; y: number; rotX: number; rotY: number }>({
    x: 0,
    y: 0,
    rotX: 4,
    rotY: -6,
  });

  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Handle pointer drag start (mouse or touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setIsIdle(false);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: rotation.x,
      rotY: rotation.y,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  // Handle pointer drag move
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    // Calculate free 360-degree Y rotation and clamped X pitch
    const nextRotY = dragStartRef.current.rotY + deltaX * 0.85;
    const nextRotX = Math.max(-28, Math.min(28, dragStartRef.current.rotX - deltaY * 0.45));

    setRotation({ x: nextRotX, y: nextRotY });

    if (cardContainerRef.current) {
      const rect = cardContainerRef.current.getBoundingClientRect();
      const normX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const normY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setGlare({ x: normX, y: normY });
    }
  };

  // Handle pointer drag release with spring dampening
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    // Spring settle: snap smoothly to closest face (0° or 180° or 360°)
    const normalizedY = ((rotation.y % 360) + 360) % 360;
    const isCloserToBack = normalizedY > 90 && normalizedY < 270;
    const baseTurns = Math.round((rotation.y - (isCloserToBack ? 180 : 0)) / 360) * 360;
    const targetY = baseTurns + (isCloserToBack ? 180 : -6);

    setRotation({ x: 4, y: targetY });

    // Re-enable idle breathing after settling
    setTimeout(() => {
      setIsIdle(true);
    }, 1200);
  };

  // Quick 360-degree flip trigger button
  const handleQuickFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsIdle(false);
    setRotation((prev) => ({
      x: 6,
      y: prev.y + 180,
    }));
    setTimeout(() => {
      setIsIdle(true);
    }, 1200);
  };

  return (
    <div
      className={`absolute top-0 -left-2 sm:-left-6 bottom-[-42px] z-30 pointer-events-none flex flex-col items-center [perspective:1200px] transition-all duration-1000 ease-[cubic-bezier(0.34,1.4,0.64,1)] ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-48"
      }`}
      style={{ transitionDelay: "450ms" }}
    >
      <div
        className={`flex flex-col items-center origin-top h-full [transform-style:preserve-3d] ${
          isIdle && !isDragging ? "animate-rope-sway" : ""
        }`}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(28px)`,
          transition: isDragging ? "none" : "transform 750ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
        }}
      >
        {/* 1. 3D Polished Metallic Top Window Clamp */}
        <div className="relative z-30 flex flex-col items-center -mt-2.5 [transform-style:preserve-3d]">
          {/* Chrome Metal Clamp with 3D Bevel Highlight */}
          <div className="px-3.5 py-1 rounded-t-sm bg-gradient-to-b from-white via-stone-200 to-stone-400 border border-stone-400 shadow-[0_4px_10px_rgba(0,0,0,0.28)] flex items-center justify-center">
            <div className="w-4 h-1 bg-stone-700 rounded-full shadow-inner" />
          </div>
          {/* 3D Anchor Ring */}
          <div className="w-4.5 h-4.5 rounded-full border-[2.5px] border-stone-400 bg-gradient-to-tr from-stone-300 via-white to-stone-400 shadow-sm -mt-1 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-xs" />
          </div>
        </div>

        {/* 2. 3D Solid Woven Lanyard Ribbon with Depth Shadow */}
        <div className="flex-1 w-7 sm:w-8 relative flex flex-col items-center justify-center -my-0.5 overflow-hidden rounded-xs bg-gradient-to-r from-brand-700 via-brand-500 to-brand-700 border-x-2 border-brand-800/80 shadow-[0_8px_24px_rgba(194,85,58,0.35),0_4px_8px_rgba(0,0,0,0.18)] [transform-style:preserve-3d]">
          {/* Left & Right Crisp Double Stitches */}
          <div className="absolute inset-y-0 left-1 w-px border-l-2 border-dashed border-white/50" />
          <div className="absolute inset-y-0 right-1 w-px border-r-2 border-dashed border-white/50" />

          {/* Woven Fabric Texture Overlay */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)",
            }}
          />

          {/* Solid 3D Woven Monogram */}
          <div className="h-full flex items-center justify-center py-4 select-none pointer-events-none">
            <span className="text-[8.5px] font-mono font-extrabold tracking-[0.3em] text-white uppercase [writing-mode:vertical-lr] rotate-180 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
              VELQORA
            </span>
          </div>
        </div>

        {/* 3. 3D Metallic Lobster Clasp & Swivel Hardware */}
        <div className="relative z-30 flex flex-col items-center -my-0.5 [transform-style:preserve-3d]">
          {/* Chrome Crimp Collar with 3D Bevel */}
          <div className="w-8 h-3 bg-gradient-to-r from-stone-400 via-white to-stone-400 rounded-xs border border-stone-400 shadow-[0_3px_6px_rgba(0,0,0,0.25)] flex items-center justify-around px-1">
            <div className="w-1 h-1.5 bg-stone-700 rounded-full shadow-inner" />
            <div className="w-1 h-1.5 bg-stone-700 rounded-full shadow-inner" />
          </div>

          {/* Swivel D-Ring */}
          <div className="w-4.5 h-4.5 rounded-full border-[2.5px] border-stone-400 bg-gradient-to-tr from-stone-200 via-white to-stone-300 shadow-md -mt-1 flex items-center justify-center">
            {/* Lobster Clasp Spring Hook */}
            <div className="w-2.5 h-4 bg-gradient-to-b from-stone-200 via-white to-stone-400 border border-stone-500 rounded-b-sm -mb-2.5 shadow-sm" />
          </div>
        </div>

        {/* 4. TRUE 360° ROTATABLE 3D CARD (DUAL-SIDED: FRONT & BACK) */}
        <div
          ref={cardContainerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          title="Geser 360° untuk memutar kartu"
          className="w-56 sm:w-64 h-64 sm:h-70 relative mt-1 pointer-events-auto cursor-grab active:cursor-grabbing select-none [touch-action:none] [transform-style:preserve-3d]"
        >
          {/* ── FRONT FACE (rotateY 0deg) ── */}
          <div
            className="absolute inset-0 rounded-3xl bg-white p-2.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35),0_10px_20px_rgba(194,85,58,0.15)] border-[2.5px] border-stone-200 border-b-[5px] border-r-[4px] border-stone-400/80 [backface-visibility:hidden] [transform:rotateY(0deg)] overflow-hidden flex flex-col justify-between"
          >
            {/* Specular Light Reflection Glare Overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl z-40 transition-opacity duration-150"
              style={{
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 45%, transparent 75%)`,
                opacity: isDragging ? 1 : 0.35,
              }}
            />

            {/* Top Badge Loop */}
            <div className="flex justify-center -mt-5 mb-1 relative z-30">
              <div className="px-4 py-1 rounded-full bg-gradient-to-b from-stone-100 to-stone-300 border border-stone-400 shadow-sm flex items-center justify-center">
                <div className="w-4 h-1.5 rounded-full bg-stone-900 border border-stone-700 shadow-inner" />
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
              <div className="flex items-center justify-between text-[9px] text-text-tertiary pt-0.5 font-semibold">
                <span className="flex items-center gap-1">
                  <RotateCw className="w-3 h-3 text-brand-500" />
                  <span>Geser 360°</span>
                </span>
                <button
                  type="button"
                  onClick={handleQuickFlip}
                  className="px-2 py-0.5 rounded bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 border border-brand-500/20 transition-colors cursor-pointer"
                >
                  Balik Kartu ↺
                </button>
              </div>
            </div>
          </div>

          {/* ── BACK FACE (rotateY 180deg) ── */}
          <div
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 p-2.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45)] border-[2.5px] border-stone-700 border-b-[5px] border-r-[4px] border-stone-800 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden flex flex-col justify-between text-white"
          >
            {/* Top Badge Loop */}
            <div className="flex justify-center -mt-5 mb-1 relative z-30">
              <div className="px-4 py-1 rounded-full bg-stone-800 border border-stone-600 shadow-sm flex items-center justify-center">
                <div className="w-4 h-1.5 rounded-full bg-stone-950 border border-stone-800 shadow-inner" />
              </div>
            </div>

            {/* Inner Digital Student Pass */}
            <div className="rounded-2xl bg-stone-800/90 border border-stone-700/80 p-3 space-y-2 flex-1 flex flex-col justify-between relative overflow-hidden">
              {/* Holographic shimmer line */}
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
                  className="px-2 py-0.5 rounded bg-stone-700/80 hover:bg-stone-700 text-stone-200 border border-stone-600 transition-colors cursor-pointer"
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
