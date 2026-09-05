"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Folder, Terminal, FileText, Cpu, Layers, LogOut, User, RefreshCw, Activity } from "lucide-react";

export function OSTaskbar() {
  const [startOpen, setStartOpen] = useState(false);
  const [timeString, setTimeString] = useState("");
  const startMenuRef = useRef<HTMLDivElement>(null);

  // Live Clock (HH:MM:SS)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close Start Menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (startMenuRef.current && !startMenuRef.current.contains(e.target as Node)) {
        setStartOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollTo = (id: string) => {
    setStartOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={startMenuRef} className="fixed bottom-0 left-0 right-0 z-50 select-none font-mono">
      {/* Start Menu Pop-up (Exact Vintec Learn 98 Style) */}
      {startOpen && (
        <div className="absolute bottom-10 left-2 w-64 bg-[#ECE9D8] border-2 border-[#FFFFFF] border-r-[#7A756D] border-b-[#7A756D] shadow-2xl overflow-hidden flex z-50 animate-in slide-in-from-bottom-2 duration-75 text-xs">
          {/* Left Vertical Brand Stripe (VELQORA 98) */}
          <div className="w-8 bg-gradient-to-t from-[#853827] via-[#C2553A] to-[#EE7257] flex items-end justify-center pb-3 text-white font-bold select-none">
            <span className="-rotate-90 tracking-widest text-sm whitespace-nowrap drop-shadow-xs">
              VELQORA 98
            </span>
          </div>

          {/* Menu Items (Vintec Exact Menu Options) */}
          <div className="flex-1 p-1 space-y-0.5 text-[#1C1917]">
            <Link
              href="/login"
              onClick={() => setStartOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#C2553A] hover:text-white transition-colors text-left"
            >
              <span className="text-sm">▤</span>
              <span className="font-semibold">Masuk</span>
            </Link>

            <Link
              href="/register"
              onClick={() => setStartOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#C2553A] hover:text-white transition-colors text-left"
            >
              <span className="text-sm font-bold text-[#C2553A] group-hover:text-white">✚</span>
              <span className="font-semibold">Daftar akun baru</span>
            </Link>

            <div className="h-px bg-[#B8B1A5] my-1" />

            <button
              type="button"
              onClick={() => scrollTo("stats-section")}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#C2553A] hover:text-white transition-colors text-left"
            >
              <span className="text-sm text-emerald-600">◉</span>
              <span>Status sistem</span>
            </button>

            <button
              type="button"
              onClick={() => scrollTo("stats-section")}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#C2553A] hover:text-white transition-colors text-left"
            >
              <span className="text-sm">▣</span>
              <span>Velqora Companion</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStartOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#C2553A] hover:text-white transition-colors text-left"
            >
              <span className="text-sm">↻</span>
              <span>Reboot…</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Taskbar (Vintec Exact Layout: Start, Center Copyright, Right Status & Clock) */}
      <footer className="h-9 vt-taskbar flex items-center justify-between px-2 text-xs select-none">
        {/* Left: Start Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStartOpen(!startOpen)}
            className={`px-3 py-1 text-xs font-bold tracking-wider flex items-center gap-1.5 transition-all ${
              startOpen
                ? "bg-[#C2553A] text-white border-t-2 border-l-2 border-[#6B2D20] border-b-2 border-r-2 border-[#EE7257]"
                : "vt-btn-terracotta"
            }`}
          >
            <span className="font-black text-sm">⊞</span>
            <span>Start</span>
          </button>
        </div>

        {/* Center: Copyright Notice (Exact Vintec Learn) */}
        <div className="text-[11px] text-[#6B6560] font-sans font-medium hidden sm:block">
          © Velqora — 2026
        </div>

        {/* Right: Status Pill & Real-time Clock */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollTo("stats-section")}
            className="px-2 py-0.5 bg-[#FAF8F5] border border-[#C5BCB0] text-[#1C1917] text-[11px] flex items-center gap-1.5 hover:bg-[#F0EAE1]"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Status</span>
          </button>

          {/* Clock Inset Box */}
          <div className="px-2.5 py-0.5 bg-[#FAF8F5] border-t border-l border-[#8A857D] border-b border-r border-[#FFFFFF] text-[11px] text-[#1C1917] font-bold">
            {timeString || "12:00:00"}
          </div>
        </div>
      </footer>
    </div>
  );
}
