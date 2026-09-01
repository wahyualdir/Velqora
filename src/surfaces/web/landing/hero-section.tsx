"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Download, ShieldCheck, Sparkles, Smartphone, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookshelfHeroBackground } from "./bookshelf-bg";
import { useScrollReveal } from "./use-landing-animation";

/**
 * Interactive Lanyard Hanging Companion Card
 * Supports touch, drag, pointer hover tilt, and click spring physics
 */
function InteractiveLanyardCard({ isVisible }: { isVisible: boolean }) {
  const [tilt, setTilt] = useState<{ x: number; y: number; rotate: number }>({
    x: 0,
    y: 0,
    rotate: -2,
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
      x: normX * 14,
      y: normY * 8,
      rotate: normX * 12,
    });
  };

  const handlePointerLeave = () => {
    setIsInteracting(false);
    setTilt({ x: 0, y: 0, rotate: -2 });
  };

  const handleTriggerNudge = () => {
    setIsNudged(true);
    setTilt({ x: 18, y: 6, rotate: 14 });
    setTimeout(() => setTilt({ x: -14, y: 3, rotate: -10 }), 150);
    setTimeout(() => setTilt({ x: 10, y: 2, rotate: 7 }), 300);
    setTimeout(() => setTilt({ x: -5, y: 1, rotate: -4 }), 450);
    setTimeout(() => {
      setTilt({ x: 0, y: 0, rotate: -2 });
      setIsNudged(false);
    }, 600);
  };

  return (
    <div
      className={`absolute top-0 -left-2 sm:-left-6 bottom-[-36px] z-20 pointer-events-none flex flex-col items-center transition-all duration-1000 ease-[cubic-bezier(0.34,1.4,0.64,1)] ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-48"
      }`}
      style={{ transitionDelay: "450ms" }}
    >
      <div
        className={`flex flex-col items-center origin-top h-full ${
          !isInteracting && !isNudged ? "animate-rope-sway" : ""
        }`}
        style={{
          transform: isInteracting || isNudged
            ? `translate(${tilt.x}px, ${tilt.y}px) rotate(${tilt.rotate}deg)`
            : undefined,
          transition: isInteracting
            ? "transform 80ms ease-out"
            : isNudged
            ? "transform 150ms ease-in-out"
            : "transform 500ms ease-out",
        }}
      >
        {/* 1. Top Window Chrome Clip (Firmly gripping the top browser frame) */}
        <div className="relative z-30 flex flex-col items-center -mt-2">
          {/* Polished Silver Chrome Clip */}
          <div className="px-3 py-1 rounded-t-sm bg-gradient-to-b from-stone-200 via-stone-100 to-stone-400 border border-stone-400 shadow-md flex items-center justify-center">
            <div className="w-3 h-0.5 bg-stone-600 rounded-full shadow-inner" />
          </div>
          {/* Top Anchor Ring */}
          <div className="w-3.5 h-3.5 rounded-full border-2 border-stone-400 bg-stone-100 shadow-xs -mt-1 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          </div>
        </div>

        {/* 2. Solid & Premium Woven Fabric Lanyard Strap */}
        <div className="flex-1 w-7 sm:w-8 relative flex flex-col items-center justify-center shadow-lg -my-0.5 overflow-hidden rounded-xs bg-gradient-to-r from-brand-700 via-brand-500 to-brand-700 border-x-2 border-brand-800/60">
          {/* Left & Right Crisp Stitches */}
          <div className="absolute inset-y-0 left-1 w-px border-l-2 border-dashed border-white/40" />
          <div className="absolute inset-y-0 right-1 w-px border-r-2 border-dashed border-white/40" />
          
          {/* Woven Fabric Texture Overlay */}
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)",
            }}
          />

          {/* Clean Solid Monogram */}
          <div className="h-full flex items-center justify-center py-4 select-none pointer-events-none">
            <span className="text-[8px] font-mono font-extrabold tracking-[0.28em] text-white/90 uppercase [writing-mode:vertical-lr] rotate-180 drop-shadow-xs">
              VELQORA
            </span>
          </div>
        </div>

        {/* 3. Solid Metal Swivel Lobster Clasp & Crimp Hardware */}
        <div className="relative z-30 flex flex-col items-center -my-0.5">
          {/* Silver Crimp Collar */}
          <div className="w-7 h-2.5 bg-gradient-to-r from-stone-400 via-stone-100 to-stone-400 rounded-xs border border-stone-400 shadow-xs flex items-center justify-around px-1">
            <div className="w-1 h-1 bg-stone-600 rounded-full" />
            <div className="w-1 h-1 bg-stone-600 rounded-full" />
          </div>

          {/* Chrome Swivel D-Ring */}
          <div className="w-4 h-4 rounded-full border-2 border-stone-400 bg-stone-100 shadow-xs -mt-1 flex items-center justify-center">
            {/* Lobster Clasp Hook */}
            <div className="w-2.5 h-3.5 bg-gradient-to-b from-stone-200 to-stone-400 border border-stone-500 rounded-b-sm -mb-2 shadow-xs" />
          </div>
        </div>

        {/* 4. Interactive Companion Badge Card (Touch / Move to Swing) */}
        <div
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={handleTriggerNudge}
          title="Sentuh atau geser untuk mengayunkan lanyard"
          className="w-52 sm:w-56 rounded-2xl border-2 border-border/90 bg-white p-2 shadow-2xl transition-shadow duration-300 hover:shadow-brand-500/25 group pointer-events-auto mt-1 cursor-grab active:cursor-grabbing select-none"
        >
          {/* Top Badge Slot Tab with Metal Eyelet */}
          <div className="flex justify-center -mt-4.5 mb-2">
            <div className="px-3.5 py-1 rounded-full bg-surface-secondary border border-border shadow-xs flex items-center justify-center">
              <div className="w-4 h-1.5 rounded-full bg-stone-800 border border-stone-600 shadow-inner" />
            </div>
          </div>

          {/* Smartphone Companion View */}
          <div className="rounded-xl bg-surface-secondary/70 border border-border/80 p-2.5 space-y-2 text-text-primary">
            <div className="flex items-center justify-between text-[10px] border-b border-border/80 pb-1.5">
              <span className="font-bold text-text-primary flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                Velqora Mobile
              </span>
              <span className="text-[9px] text-text-tertiary font-mono bg-white px-1.5 py-0.5 rounded border border-border">PWA</span>
            </div>

            <div className="p-2 rounded-lg bg-white border border-brand-500/25 space-y-0.5 shadow-2xs group-hover:border-brand-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-[9px] text-brand-600 font-bold uppercase tracking-wider">Kelas Berikutnya</p>
                <span className="text-[9px] text-emerald-600 font-bold">10 Menit Lagi</span>
              </div>
              <p className="text-xs font-bold text-text-primary">Kalkulus Lanjut</p>
              <p className="text-[9.5px] text-text-secondary">10:45 • R. 402 Gedung C</p>
            </div>

            {/* Interactive hint */}
            <div className="flex items-center justify-center gap-1 text-[9px] text-text-tertiary pt-0.5 font-medium">
              <Hand className="w-2.5 h-2.5 text-brand-500" />
              <span>Sentuh atau geser kartu</span>
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

            {/* REALISTIC INTERACTIVE LANYARD COMPANION CARD */}
            <InteractiveLanyardCard isVisible={isVisible} />
          </div>
        </div>
      </div>
    </section>
  );
}
