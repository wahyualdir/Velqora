"use client";

import React, { useState } from "react";
import { OSWindow } from "./os-window";
import { Play, Sparkles, ArrowRight, CornerDownLeft } from "lucide-react";
import Link from "next/link";

export function RunDialogCTA() {
  const [commandInput, setCommandInput] = useState("velqora://start/web-development-101");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/dashboard";
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 my-10">
      <OSWindow
        title="RUN.EXE — Jalankan Perintah Sistem"
        icon={<Play className="w-3.5 h-3.5 text-cyan-400" />}
        statusText="READY TO EXECUTE"
        className="shadow-2xl"
      >
        <form onSubmit={handleSubmit} className="p-5 bg-[#0C1017] font-mono text-xs text-slate-200 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center flex-shrink-0 text-[#00F2FE]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Pelajari Pengembangan Web Modern Sekarang</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Ketik nama workspace atau klik &apos;JALANKAN&apos; untuk memulai akses langsung ke 12 modul lengkap, 
                latihan terstruktur, dan bimbingan AI tutor.
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label htmlFor="run-command-input" className="text-slate-300 font-bold flex items-center justify-between">
              <span>Buka (Open):</span>
              <span className="text-[10px] text-slate-500">URI / Command</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="run-command-input"
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#06080C] border-t border-l border-black border-b border-r border-[#2A364F] rounded-xs text-[#00F2FE] font-bold focus:outline-none focus:border-[#FF2E93] text-xs font-mono"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <Link
              href="/dashboard"
              className="px-4 py-2 vt-btn-pink text-xs flex items-center gap-1.5 font-bold"
            >
              <span>JALANKAN (OK)</span>
              <CornerDownLeft className="w-3 h-3" />
            </Link>
            <Link
              href="#curriculum-section"
              className="px-3 py-2 vt-btn-chrome text-xs text-slate-300"
            >
              TELUSURI MODUL...
            </Link>
          </div>
        </form>
      </OSWindow>
    </div>
  );
}
