"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Download, ShieldCheck, Sparkles, Smartphone, Hand, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookshelfHeroBackground } from "./bookshelf-bg";
import { useScrollReveal } from "./use-landing-animation";

/**
 * 3D Interactive Lanyard Hanging Companion Card
 * Features true CSS 3D perspective, interactive pointer/touch 3D tilt, specular glare lighting, and spring physics.
 */
function Interactive3DLanyardCard({ isVisible }: { isVisible: boolean }) {
  const [tilt, setTilt] = useState<{
    rotX: number;
    rotY: number;
    rotZ: number;
    transZ: number;
    glareX: number;
    glareY: number;
  }>({
    rotX: 6,
    rotY: -6,
    rotZ: -2,
    transZ: 20,
    glareX: 50,
    glareY: 30,
  });

  const [isInteracting, setIsInteracting] = useState(false);
  const [isNudged, setIsNudged] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
    const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));

    setIsInteracting(true);
    setTilt({
      rotX: -normY * 18, // 3D Pitch
      rotY: normX * 22,  // 3D Yaw
      rotZ: normX * 8,   // 3D Roll
      transZ: 38,        // 3D Pop Out
      glareX: (normX + 1) * 50,
      glareY: (normY + 1) * 50,
    });
  };

  const handlePointerLeave = () => {
    setIsInteracting(false);
    setTilt({
      rotX: 6,
      rotY: -6,
      rotZ: -2,
      transZ: 20,
      glareX: 50,
      glareY: 30,
    });
  };

  const handleTriggerNudge = () => {
    setIsNudged(true);
    setTilt({ rotX: -20, rotY: 24, rotZ: 14, transZ: 50, glareX: 80, glareY: 20 });
    setTimeout(() => setTilt({ rotX: 16, rotY: -18, rotZ: -12, transZ: 35, glareX: 20, glareY: 80 }), 160);
    setTimeout(() => setTilt({ rotX: -10, rotY: 12, rotZ: 8, transZ: 28, glareX: 70, glareY: 40 }), 320);
    setTimeout(() => setTilt({ rotX: 6, rotY: -6, rotZ: -4, transZ: 22, glareX: 40, glareY: 60 }), 480);
    setTimeout(() => {
      setTilt({ rotX: 6, rotY: -6, rotZ: -2, transZ: 20, glareX: 50, glareY: 30 });
      setIsNudged(false);
    }, 640);
  };

  return (
    <div
      className={`absolute top-0 -left-2 sm:-left-6 bottom-[-40px] z-30 pointer-events-none flex flex-col items-center [perspective:1200px] transition-all duration-1000 ease-[cubic-bezier(0.34,1.4,0.64,1)] ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-48"
      }`}
      style={{ transitionDelay: "450ms" }}
    >
      <div
        className={`flex flex-col items-center origin-top h-full [transform-style:preserve-3d] ${
          !isInteracting && !isNudged ? "animate-rope-sway" : ""
        }`}
        style={{
          transform: isInteracting || isNudged
            ? `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) rotateZ(${tilt.rotZ}deg) translateZ(${tilt.transZ}px)`
            : "rotateX(6deg) rotateY(-6deg) rotateZ(-2deg) translateZ(20px)",
          transition: isInteracting
            ? "transform 80ms ease-out"
            : isNudged
            ? "transform 160ms cubic-bezier(0.16, 1, 0.3, 1)"
            : "transform 500ms ease-out",
        }}
      >
        {/* 1. 3D Metal Top Window Clamp */}
        <div className="relative z-30 flex flex-col items-center -mt-2.5 [transform-style:preserve-3d]">
          {/* Chrome Metal Clamp with 3D Bevel & Specular Highlight */}
          <div className="px-3 py-1 rounded-t-sm bg-gradient-to-b from-white via-stone-200 to-stone-400 border border-stone-400 shadow-[0_4px_8px_rgba(0,0,0,0.25)] flex items-center justify-center">
            <div className="w-3.5 h-1 bg-stone-700 rounded-full shadow-inner" />
          </div>
          {/* 3D Anchor Ring */}
          <div className="w-4 h-4 rounded-full border-[2.5px] border-stone-400 bg-gradient-to-tr from-stone-300 via-white to-stone-400 shadow-sm -mt-1 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-xs" />
          </div>
        </div>

        {/* 2. 3D Solid Woven Lanyard Ribbon with Depth Cast Shadow */}
        <div className="flex-1 w-7 sm:w-8 relative flex flex-col items-center justify-center -my-0.5 overflow-hidden rounded-xs bg-gradient-to-r from-brand-700 via-brand-500 to-brand-700 border-x-2 border-brand-800/70 shadow-[0_8px_20px_rgba(194,85,58,0.35),0_4px_8px_rgba(0,0,0,0.15)] [transform-style:preserve-3d]">
          {/* Left & Right Double Stitches */}
          <div className="absolute inset-y-0 left-1 w-px border-l-2 border-dashed border-white/50" />
          <div className="absolute inset-y-0 right-1 w-px border-r-2 border-dashed border-white/50" />
          
          {/* 3D Woven Ribbon Texture */}
          <div
            className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)",
            }}
          />

          {/* Solid 3D Monogram */}
          <div className="h-full flex items-center justify-center py-4 select-none pointer-events-none">
            <span className="text-[8.5px] font-mono font-extrabold tracking-[0.3em] text-white uppercase [writing-mode:vertical-lr] rotate-180 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              VELQORA
            </span>
          </div>
        </div>

        {/* 3. 3D Metallic Lobster Clasp Hardware */}
        <div className="relative z-30 flex flex-col items-center -my-0.5 [transform-style:preserve-3d]">
          {/* Silver Crimp Collar with 3D Bevel */}
          <div className="w-8 h-3 bg-gradient-to-r from-stone-400 via-white to-stone-400 rounded-xs border border-stone-400 shadow-[0_3px_6px_rgba(0,0,0,0.2)] flex items-center justify-around px-1">
            <div className="w-1 h-1.5 bg-stone-700 rounded-full shadow-inner" />
            <div className="w-1 h-1.5 bg-stone-700 rounded-full shadow-inner" />
          </div>

          {/* Chrome Swivel D-Ring */}
          <div className="w-4.5 h-4.5 rounded-full border-[2.5px] border-stone-400 bg-gradient-to-tr from-stone-200 via-white to-stone-300 shadow-md -mt-1 flex items-center justify-center">
            {/* 3D Lobster Clasp Spring Hook */}
            <div className="w-2.5 h-4 bg-gradient-to-b from-stone-200 via-white to-stone-400 border border-stone-500 rounded-b-sm -mb-2.5 shadow-sm" />
          </div>
        </div>

        {/* 4. 3D INTERACTIVE SMARTPHONE COMPANION BADGE */}
        <div
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={handleTriggerNudge}
          title="Sentuh atau geser untuk mengayunkan kartu dalam 3D"
          className="w-54 sm:w-60 rounded-3xl bg-white p-2.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35),0_10px_20px_rgba(194,85,58,0.15)] group pointer-events-auto mt-1 cursor-grab active:cursor-grabbing select-none relative overflow-hidden transition-all duration-300 border-[2.5px] border-stone-200 border-b-[5px] border-r-[4px] border-stone-400/80 [transform-style:preserve-3d]"
          style={{
            transform: `translateZ(${tilt.transZ}px)`,
          }}
        >
          {/* Dynamic 3D Specular Light Glare Overlay */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl z-40 transition-opacity duration-150"
            style={{
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)`,
              opacity: isInteracting ? 1 : 0.4,
            }}
          />

          {/* 3D Top Badge Eyelet Loop */}
          <div className="flex justify-center -mt-5 mb-2 relative z-30">
            <div className="px-4 py-1 rounded-full bg-gradient-to-b from-stone-100 to-stone-300 border border-stone-400 shadow-sm flex items-center justify-center">
              <div className="w-4 h-1.5 rounded-full bg-stone-900 border border-stone-700 shadow-inner" />
            </div>
          </div>

          {/* 3D Phone Screen Chassis View */}
          <div className="rounded-2xl bg-surface-secondary/80 border border-border/80 p-3 space-y-2.5 text-text-primary relative overflow-hidden shadow-inner">
            {/* Phone Screen Top Speaker/Camera Bezel */}
            <div className="w-14 h-1 bg-stone-300 rounded-full mx-auto mb-1.5" />

            {/* Header Status Bar */}
            <div className="flex items-center justify-between text-[11px] border-b border-border/80 pb-2">
              <span className="font-bold text-text-primary flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse shadow-xs" />
                Velqora Mobile
              </span>
              <span className="text-[9.5px] font-mono font-semibold bg-brand-500/10 text-brand-600 px-2 py-0.5 rounded-md border border-brand-500/20">
                PWA Active
              </span>
            </div>

            {/* Live Class Schedule Widget */}
            <div className="p-2.5 rounded-xl bg-white border border-brand-500/25 space-y-1 shadow-[0_2px_8px_rgba(0,0,0,0.06)] group-hover:border-brand-500/60 transition-colors">
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

            {/* 3D Interactive Touch Indicator */}
            <div className="flex items-center justify-center gap-1.5 text-[9.5px] text-text-tertiary pt-0.5 font-semibold">
              <Hand className="w-3 h-3 text-brand-500 animate-bounce" />
              <span>Sentuh atau geser untuk gerak 3D</span>
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

          {/* Right: Interactive Product Mockup with Smooth Entrance */}
          <div
            className={`lg:col-span-6 relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-[0.98]"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            {/* Desktop Window Mockup */}
            <div className="rounded-2xl border border-border bg-white shadow-xl overflow-hidden transform lg:rotate-1 lg:translate-x-2 transition-transform duration-300 hover:rotate-0">
              {/* Window Chrome */}
              <div className="h-10 px-4 bg-surface-secondary border-b border-border flex items-center justify-between text-[11px] text-text-tertiary select-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="px-3 py-1 rounded-md bg-white border border-border text-[11px] font-mono text-text-secondary truncate max-w-[220px] shadow-2xs">
                  velqora.web.id/dashboard/jadwal
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Web Workspace
                </span>
              </div>

              {/* Dashboard Content Preview */}
              <div className="p-4 sm:p-5 grid grid-cols-12 gap-4 bg-background">
                {/* Mini Sidebar */}
                <div className="col-span-3 hidden sm:flex flex-col gap-1.5 pr-3 border-r border-border text-xs">
                  <div className="px-2.5 py-1.5 rounded-lg bg-brand-500/10 text-brand-600 font-semibold flex items-center gap-2 shadow-2xs">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="10" y1="4" x2="10" y2="10"/></svg>
                    <span className="truncate">Jadwal Kuliah</span>
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg text-text-secondary hover:bg-surface-hover flex items-center gap-2 transition-colors">
                    <svg className="w-3.5 h-3.5 text-text-tertiary shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20"/></svg>
                    <span className="truncate">Modul & Slide</span>
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg text-text-secondary hover:bg-surface-hover flex items-center gap-2 transition-colors">
                    <svg className="w-3.5 h-3.5 text-text-tertiary shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span className="truncate">Tugas Kuliah</span>
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg text-text-secondary hover:bg-surface-hover flex items-center gap-2 transition-colors">
                    <svg className="w-3.5 h-3.5 text-text-tertiary shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span className="truncate">AI Tutor</span>
                  </div>
                </div>

                {/* Main Workspace Area */}
                <div className="col-span-12 sm:col-span-9 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-border/60">
                    <div>
                      <p className="text-xs font-bold text-text-primary">Semester Genap • 21 SKS</p>
                      <p className="text-[11px] text-text-tertiary">Kalender Mingguan Aktif</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-semibold flex items-center gap-1">
                      <span>✓</span> 0 Jadwal Bentrok
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-border hover:border-brand-500/30 transition-colors flex items-center justify-between gap-2 shadow-2xs">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-brand-500" />
                          <p className="font-bold text-text-primary truncate">Struktur Data & Algoritma</p>
                        </div>
                        <p className="text-[11px] text-text-tertiary pl-3.5 mt-0.5">Senin • 08:00 – 10:30 • Lab Komputer 3</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-700 font-semibold shrink-0">3 SKS</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-border hover:border-brand-500/30 transition-colors flex items-center justify-between gap-2 shadow-2xs">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <p className="font-bold text-text-primary truncate">Sistem Basis Data Terdistribusi</p>
                        </div>
                        <p className="text-[11px] text-text-tertiary pl-3.5 mt-0.5">Rabu • 13:00 – 15:30 • Gedung Kuliah B201</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-700 font-semibold shrink-0">3 SKS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TRUE 3D INTERACTIVE LANYARD COMPANION CARD */}
            <Interactive3DLanyardCard isVisible={isVisible} />
          </div>
        </div>
      </div>
    </section>
  );
}
