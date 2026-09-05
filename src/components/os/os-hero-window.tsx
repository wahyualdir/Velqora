"use client";

import React, { useState } from "react";
import { OSWindow } from "./os-window";
import { CanvasWireframeCube } from "./canvas-wireframe-cube";
import { 
  Folder, 
  FileText, 
  Users, 
  Edit3, 
  Cpu, 
  ArrowRight, 
  RotateCw, 
  Layers, 
  ExternalLink 
} from "lucide-react";
import Link from "next/link";

export function OSHeroWindow() {
  const [selectedIcon, setSelectedIcon] = useState<string>("koleksi");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const desktopShortcuts = [
    { id: "koleksi", label: "Koleksi", icon: "▦", target: "curriculum-section" },
    { id: "modul", label: "Modul.md", icon: "▤", target: "curriculum-section" },
    { id: "komunitas", label: "Komunitas", icon: "◈", href: "/dashboard" },
    { id: "catatan", label: "Catatan.txt", icon: "✎", target: "notepad-section" },
    { id: "companion", label: "Companion.exe", icon: "▣", target: "stats-section" },
  ];

  return (
    <div id="hero-window" className="w-full max-w-7xl mx-auto px-2 sm:px-4 pt-4 pb-4">
      {/* 3-Column Desktop Grid Layout (Exact Vintec Learn) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* =========================================================================
            COLUMN 1: Left Window (NEURALQUEST — VELQORA.EXE) - 6 cols
            ========================================================================= */}
        <div className="lg:col-span-6 flex flex-col">
          <OSWindow
            title="NEURALQUEST — VELQORA LEARNING PLATFORM.EXE"
            statusText="READY · 12 MODUL TERSEDIA"
            className="flex-1 shadow-md"
            bodyClassName="p-5 sm:p-7 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Status Pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FAF3EF] border border-[#C2553A]/30 rounded-full text-xs font-mono text-[#C2553A] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#C2553A] animate-pulse" />
                <span>• SYSTEM ONLINE · 12 MODUL TERSTANDARISASI</span>
              </div>

              {/* Big Vintec-Style Headline */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#1C1917] uppercase font-sans">
                  VELQORA
                </h1>
                <div className="text-base sm:text-lg font-mono font-bold text-[#C2553A] tracking-wider">
                  learn. build. deploy.
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#524B42] leading-relaxed font-sans max-w-lg">
                Workspace perkuliahan dan kurikulum rekayasa web modern berstandar industri: 
                Next.js 15 App Router, React 19 Server Components, arsitektur database relasional, 
                dan pipeline CI/CD produksi tanpa tutorial klise.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection("curriculum-section")}
                  className="px-5 py-2.5 vt-btn-terracotta text-xs flex items-center gap-1.5 font-mono font-bold shadow-sm"
                >
                  <span>Start Learning</span>
                  <span>▸</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("curriculum-section")}
                  className="px-4 py-2.5 vt-btn-chrome text-xs font-mono font-semibold"
                >
                  Explore Catalog
                </button>
              </div>
            </div>

            {/* Stats Row (3 Columns Separated by Bevel Border) */}
            <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t-2 border-[#E5DDD5] font-mono text-center">
              <div className="p-2 bg-[#F9F7F4] border border-[#E5DDD5] rounded-xs">
                <div className="text-lg font-black text-[#C2553A]">12</div>
                <div className="text-[11px] text-[#6B6560]">modul</div>
              </div>
              <div className="p-2 bg-[#F9F7F4] border border-[#E5DDD5] rounded-xs">
                <div className="text-lg font-black text-[#1C1917]">84</div>
                <div className="text-[11px] text-[#6B6560]">kuis evaluasi</div>
              </div>
              <div className="p-2 bg-[#F9F7F4] border border-[#E5DDD5] rounded-xs">
                <div className="text-lg font-black text-[#10B981]">100%</div>
                <div className="text-[11px] text-[#6B6560]">lifetime access</div>
              </div>
            </div>
          </OSWindow>
        </div>

        {/* =========================================================================
            COLUMN 2: Center Vertical Desktop Icons - 1 col on lg
            ========================================================================= */}
        <div className="lg:col-span-1 hidden lg:flex flex-col items-center justify-center gap-3 py-2 select-none font-mono">
          {desktopShortcuts.map((item) => {
            const isSelected = selectedIcon === item.id;
            const content = (
              <div
                onClick={() => {
                  setSelectedIcon(item.id);
                  if (item.target) scrollToSection(item.target);
                }}
                className={`flex flex-col items-center justify-center p-1.5 w-16 text-center cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#C2553A]/15 border border-dashed border-[#C2553A]"
                    : "hover:bg-[#E8E0D7]/40 border border-transparent"
                }`}
              >
                <div className="w-10 h-10 bg-[#FFFFFF] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#7A756D] border-b-[#7A756D] flex items-center justify-center text-lg text-[#C2553A] shadow-xs">
                  {item.icon}
                </div>
                <span className="text-[10px] text-[#1C1917] font-bold mt-1 tracking-tight truncate w-full">
                  {item.label}
                </span>
              </div>
            );

            if (item.href) {
              return (
                <Link key={item.id} href={item.href}>
                  {content}
                </Link>
              );
            }

            return <div key={item.id}>{content}</div>;
          })}
        </div>

        {/* =========================================================================
            COLUMN 3: Right Window (MONITOR.EXE with 3D Canvas) - 5 cols
            ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col">
          <OSWindow
            title="MONITOR.EXE"
            statusText="RENDER: 60FPS · 3D ENGINE ACTIVE"
            className="flex-1 shadow-md"
            bodyClassName="p-3.5 bg-[#1C1917] text-[#FAF8F5] flex flex-col justify-between"
          >
            {/* Subheader: VELQORA AI // LEARNING OS */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#38312A] font-mono text-xs">
              <span className="text-amber-400 font-bold tracking-wider">
                VELQORA AI // LEARNING OS
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#A89F91]">
                <button type="button" title="Rotate" className="hover:text-white">
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button type="button" title="Layers" className="hover:text-white">
                  <Layers className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3D Animated Wireframe Cube Canvas */}
            <CanvasWireframeCube />

            {/* Telemetry Progress Bars & Metrics */}
            <div className="mt-3 space-y-2 font-mono text-[11px]">
              {/* Metric 1: Collections */}
              <div>
                <div className="flex justify-between text-slate-300 pb-0.5">
                  <span>collections</span>
                  <span className="text-amber-400 font-bold">12/12</span>
                </div>
                <div className="w-full h-1.5 bg-[#2E2822] rounded-none overflow-hidden">
                  <div className="h-full bg-[#C2553A] w-full" />
                </div>
              </div>

              {/* Metric 2: Lessons */}
              <div>
                <div className="flex justify-between text-slate-300 pb-0.5">
                  <span>eval.questions</span>
                  <span className="text-emerald-400 font-bold">84/84 READY</span>
                </div>
                <div className="w-full h-1.5 bg-[#2E2822] rounded-none overflow-hidden">
                  <div className="h-full bg-[#10B981] w-full" />
                </div>
              </div>

              {/* Metric 3: System status flags */}
              <div className="pt-2 border-t border-[#38312A] grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>runtime.next15: OK</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>prisma.db: IDLE</span>
                </div>
              </div>

              {/* Terminal log snippet */}
              <div className="p-2 bg-[#120F0D] rounded-none border border-[#38312A] text-[10px] text-[#C2553A] font-mono leading-tight">
                $ velqora status --curriculum: OK<br />
                &gt; Listening for dev events on port 3000...
              </div>
            </div>
          </OSWindow>
        </div>
      </div>
    </div>
  );
}
