"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Folder, 
  Terminal, 
  FileText, 
  Cpu, 
  Layers, 
  LogOut, 
  User, 
  Wifi, 
  Volume2, 
  Search,
  Sparkles
} from "lucide-react";

export function OSTaskbar() {
  const [startOpen, setStartOpen] = useState(false);
  const [timeString, setTimeString] = useState("");
  const [dateString, setDateString] = useState("");
  const startMenuRef = useRef<HTMLDivElement>(null);

  // Live Clock
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
      setDateString(
        now.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
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
    <div ref={startMenuRef} className="fixed bottom-0 left-0 right-0 z-50 select-none">
      {/* Start Menu Pop-up */}
      {startOpen && (
        <div className="absolute bottom-11 left-2 w-72 sm:w-80 bg-[#0F141C] border-2 border-[#2A364F] shadow-2xl rounded-xs overflow-hidden flex flex-col z-50 animate-in slide-in-from-bottom-2 duration-150">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#FF2E93] to-[#7928CA] p-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xs bg-black/40 flex items-center justify-center font-bold text-base border border-white/20">
                VQ
              </div>
              <div>
                <div className="font-bold font-mono text-sm tracking-wide">VELQORA_OS</div>
                <div className="text-[10px] text-white/80 font-mono">v1.2 · Learning Kernel</div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-black/30 rounded border border-white/20">
              SYS_READY
            </span>
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-1 font-mono text-xs text-slate-200">
            <button
              type="button"
              onClick={() => scrollTo("curriculum-section")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded hover:bg-[#1E293B] transition-colors text-left group"
            >
              <Folder className="w-4 h-4 text-[#00F2FE] group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold text-slate-100">Curriculum Explorer</div>
                <div className="text-[10px] text-slate-400">12 Modul Web Modern Lengkap</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => scrollTo("terminal-section")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded hover:bg-[#1E293B] transition-colors text-left group"
            >
              <Terminal className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold text-slate-100">MONITOR.EXE</div>
                <div className="text-[10px] text-slate-400">Interactive Terminal Console</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => scrollTo("notepad-section")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded hover:bg-[#1E293B] transition-colors text-left group"
            >
              <FileText className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold text-slate-100">README.txt</div>
                <div className="text-[10px] text-slate-400">Notepad & Manifesto Kuliah</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => scrollTo("companion-section")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded hover:bg-[#1E293B] transition-colors text-left group"
            >
              <Cpu className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold text-slate-100">Companion.exe</div>
                <div className="text-[10px] text-slate-400">Local Dev Agent & Terminal Sync</div>
              </div>
            </button>

            <div className="h-px bg-slate-800 my-1" />

            <Link
              href="/dashboard"
              onClick={() => setStartOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded hover:bg-[#1E293B] transition-colors text-left group text-[#00F2FE]"
            >
              <Layers className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold">Masuk Dashboard Web</div>
                <div className="text-[10px] text-slate-400">Akses LMS & Manajemen Kelas</div>
              </div>
            </Link>

            <Link
              href="/login"
              onClick={() => setStartOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded hover:bg-[#1E293B] transition-colors text-left group text-[#FF2E93]"
            >
              <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold">Sign In Mahasiswa / Dosen</div>
                <div className="text-[10px] text-slate-400">Autentikasi Akun Kampus</div>
              </div>
            </Link>
          </div>

          {/* Footer of Start Menu */}
          <div className="bg-[#090D14] p-2 border-t border-[#1E293B] flex items-center justify-between font-mono text-[11px] text-slate-400">
            <span>VELQORA_KERNEL_READY</span>
            <button
              type="button"
              onClick={() => {
                setStartOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Top</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Taskbar */}
      <footer className="h-10 vt-taskbar flex items-center justify-between px-2 text-xs font-mono select-none">
        {/* Left Side: Start Button & Active Windows */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {/* Start Button */}
          <button
            type="button"
            onClick={() => setStartOpen(!startOpen)}
            className={`px-3 py-1 text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 rounded-xs transition-all ${
              startOpen
                ? "bg-[#FF2E93] text-white border-t-2 border-l-2 border-[#A80054] border-b-2 border-r-2 border-[#FF77B8]"
                : "vt-btn-pink"
            }`}
          >
            <span className="font-black text-sm">⊞</span>
            <span>START</span>
          </button>

          <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Active Window Tabs */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => scrollTo("hero-window")}
              className="px-2.5 py-1 vt-btn-chrome text-[11px] flex items-center gap-1.5 text-slate-300 hover:text-white"
            >
              <span className="w-2 h-2 rounded-full bg-[#FF2E93]" />
              <span className="truncate max-w-[100px]">VELQORA.EXE</span>
            </button>

            <button
              type="button"
              onClick={() => scrollTo("curriculum-section")}
              className="px-2.5 py-1 vt-btn-chrome text-[11px] flex items-center gap-1.5 text-slate-300 hover:text-white"
            >
              <span className="w-2 h-2 rounded-full bg-[#00F2FE]" />
              <span className="truncate max-w-[120px]">EXPLORER (12 MODUL)</span>
            </button>

            <button
              type="button"
              onClick={() => scrollTo("terminal-section")}
              className="px-2.5 py-1 vt-btn-chrome text-[11px] flex items-center gap-1.5 text-slate-300 hover:text-white"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="truncate max-w-[90px]">MONITOR.EXE</span>
            </button>
          </div>
        </div>

        {/* Right Side: Tray with Indicators & Clock */}
        <div className="flex items-center gap-2 pl-2">
          <div className="hidden md:flex items-center gap-2 px-2 py-0.5 bg-[#07090E] border-t border-l border-[#000000] border-b border-r border-[#2A364F] rounded-xs text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-cyan-400">
              <Wifi className="w-3 h-3" />
              <span className="text-[10px]">100%</span>
            </span>
            <span className="h-3 w-px bg-slate-800" />
            <span className="flex items-center gap-1 text-slate-300">
              <Volume2 className="w-3 h-3" />
            </span>
          </div>

          {/* Clock Inset Box */}
          <div className="px-2.5 py-1 bg-[#07090E] border-t border-l border-[#000000] border-b border-r border-[#2A364F] rounded-xs text-[11px] font-mono text-slate-200 flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">{timeString || "12:00:00"}</span>
            <span className="text-slate-500 hidden lg:inline">{dateString}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
