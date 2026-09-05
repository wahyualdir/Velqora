"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Terminal, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Monitor, 
  ShieldCheck, 
  ChevronDown,
  Sparkles,
  ExternalLink
} from "lucide-react";

export function OSTopBar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [systemTime, setSystemTime] = useState<string>("");
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update clock
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setSystemTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const scrollToSection = (id: string) => {
    setActiveMenu(null);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header 
      ref={menuRef}
      className="sticky top-0 z-50 w-full bg-[#0B0E14]/95 backdrop-blur-md border-b border-[#1E293B] text-slate-200 select-none shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 h-9 flex items-center justify-between text-xs font-mono">
        {/* Left Side: Brand & Menu Items */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* OS Logo */}
          <Link 
            href="/"
            className="flex items-center gap-1.5 px-2 py-0.5 rounded text-white font-bold tracking-wider hover:bg-slate-800/60 transition-colors"
          >
            <span className="w-2.5 h-2.5 bg-gradient-to-tr from-[#FF2E93] to-[#00F2FE] rounded-xs shadow-[0_0_8px_rgba(255,46,147,0.8)]" />
            <span className="font-sans font-black tracking-tight text-sm text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              VELQORA<span className="text-[#00F2FE]">_OS</span>
            </span>
          </Link>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Desktop Pulldown Menus */}
          <div className="hidden md:flex items-center gap-0.5">
            {/* File Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => handleMenuClick("file")}
                className={`px-2 py-1 rounded-xs transition-colors flex items-center gap-1 ${
                  activeMenu === "file" ? "bg-slate-800 text-white" : "hover:bg-slate-800/60 text-slate-300"
                }`}
              >
                File <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {activeMenu === "file" && (
                <div className="absolute left-0 top-full mt-1 w-48 bg-[#0F141C] border border-[#2A364F] shadow-2xl rounded-xs py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button 
                    type="button"
                    onClick={() => scrollToSection("curriculum-section")}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#1E293B] flex items-center justify-between text-slate-200"
                  >
                    <span>Buka Modul...</span>
                    <span className="text-[10px] text-slate-500">Ctrl+O</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => scrollToSection("terminal-section")}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#1E293B] flex items-center justify-between text-slate-200"
                  >
                    <span>Jalankan Terminal</span>
                    <span className="text-[10px] text-slate-500">Ctrl+`</span>
                  </button>
                  <div className="h-px bg-slate-800 my-1" />
                  <Link 
                    href="/dashboard"
                    className="w-full text-left px-3 py-1.5 hover:bg-[#1E293B] flex items-center justify-between text-[#00F2FE]"
                  >
                    <span>Launch Dashboard</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <Link 
                    href="/login"
                    className="w-full text-left px-3 py-1.5 hover:bg-[#1E293B] flex items-center justify-between text-[#FF2E93]"
                  >
                    <span>Sign In to System</span>
                    <span className="text-[10px]">AUTH</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Modules Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => handleMenuClick("modules")}
                className={`px-2 py-1 rounded-xs transition-colors flex items-center gap-1 ${
                  activeMenu === "modules" ? "bg-slate-800 text-white" : "hover:bg-slate-800/60 text-slate-300"
                }`}
              >
                Modules <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {activeMenu === "modules" && (
                <div className="absolute left-0 top-full mt-1 w-64 bg-[#0F141C] border border-[#2A364F] shadow-2xl rounded-xs py-1 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1 text-[10px] text-[#00F2FE] font-bold uppercase tracking-wider border-b border-slate-800">
                    12 Modul Web Modern
                  </div>
                  {[
                    { id: "01", title: "Pengantar Web Modern" },
                    { id: "02", title: "HTML5 & CSS3 Modern" },
                    { id: "03", title: "ES6+ & Asynchronous JS" },
                    { id: "04", title: "React Komponen & State" },
                    { id: "05", title: "Next.js App Router" },
                    { id: "06", title: "Server Actions & Mutasi" },
                    { id: "07", title: "Zustand & State Lanjutan" },
                    { id: "08", title: "Tailwind CSS & CVA" },
                    { id: "09", title: "Autentikasi & RBAC" },
                    { id: "10", title: "Database & Prisma ORM" },
                    { id: "11", title: "Testing Vitest & Playwright" },
                    { id: "12", title: "Docker & CI/CD Pipeline" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => scrollToSection("curriculum-section")}
                      className="w-full text-left px-3 py-1 hover:bg-[#1E293B] text-[11px] text-slate-300 flex items-center gap-2"
                    >
                      <span className="text-[#FF2E93] font-bold">{m.id}.</span>
                      <span className="truncate">{m.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => handleMenuClick("view")}
                className={`px-2 py-1 rounded-xs transition-colors flex items-center gap-1 ${
                  activeMenu === "view" ? "bg-slate-800 text-white" : "hover:bg-slate-800/60 text-slate-300"
                }`}
              >
                View <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {activeMenu === "view" && (
                <div className="absolute left-0 top-full mt-1 w-48 bg-[#0F141C] border border-[#2A364F] shadow-2xl rounded-xs py-1 z-50">
                  <button 
                    type="button"
                    onClick={() => scrollToSection("hero-window")}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#1E293B] text-slate-200"
                  >
                    Hero Window
                  </button>
                  <button 
                    type="button"
                    onClick={() => scrollToSection("terminal-section")}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#1E293B] text-slate-200"
                  >
                    Interactive Terminal
                  </button>
                  <button 
                    type="button"
                    onClick={() => scrollToSection("curriculum-section")}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#1E293B] text-slate-200"
                  >
                    Curriculum Explorer
                  </button>
                  <button 
                    type="button"
                    onClick={() => scrollToSection("notepad-section")}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#1E293B] text-slate-200"
                  >
                    Notepad Manifesto
                  </button>
                  <button 
                    type="button"
                    onClick={() => scrollToSection("companion-section")}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#1E293B] text-slate-200"
                  >
                    Companion App
                  </button>
                </div>
              )}
            </div>

            {/* Help Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => handleMenuClick("help")}
                className={`px-2 py-1 rounded-xs transition-colors flex items-center gap-1 ${
                  activeMenu === "help" ? "bg-slate-800 text-white" : "hover:bg-slate-800/60 text-slate-300"
                }`}
              >
                Help <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {activeMenu === "help" && (
                <div className="absolute left-0 top-full mt-1 w-52 bg-[#0F141C] border border-[#2A364F] shadow-2xl rounded-xs py-1 z-50">
                  <div className="px-3 py-1.5 text-slate-400 border-b border-slate-800 text-[11px]">
                    Velqora OS v1.2 (Next 15)
                  </div>
                  <button 
                    type="button"
                    onClick={() => scrollToSection("notepad-section")}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#1E293B] text-slate-200"
                  >
                    Baca README.txt
                  </button>
                  <a
                    href="https://vinteclearning.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-left px-3 py-1.5 hover:bg-[#1E293B] text-[#00F2FE] flex items-center justify-between"
                  >
                    <span>Vintec Learn Inspo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Status Metrics & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title={soundEnabled ? "Mute audio" : "Unmute audio"}
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* System Online Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 bg-[#090D14] border border-[#1E293B] rounded text-[10px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>SYS_ONLINE</span>
          </div>

          {/* Clock */}
          {systemTime && (
            <div className="hidden sm:block text-[11px] text-slate-400 px-2 py-0.5 bg-[#090D14] border border-[#1E293B] rounded font-mono">
              {systemTime}
            </div>
          )}

          {/* Auth Button */}
          <Link
            href="/login"
            className="px-2.5 py-1 text-[11px] vt-btn-chrome hover:text-white transition-all flex items-center gap-1"
          >
            <span>SIGN IN</span>
          </Link>

          {/* Launch OS / Register CTA */}
          <Link
            href="/dashboard"
            className="px-3 py-1 text-[11px] vt-btn-pink flex items-center gap-1.5 text-white"
          >
            <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
            <span>LAUNCH OS</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
