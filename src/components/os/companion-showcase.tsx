"use client";

import React from "react";
import { OSWindow } from "./os-window";
import { Cpu, Terminal, CheckCircle, ArrowRight, Download, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function CompanionShowcase() {
  return (
    <div id="companion-section" className="w-full max-w-5xl mx-auto px-4 my-10">
      <OSWindow
        title="VELQORA_COMPANION.EXE — Local Dev Agent & Sync Daemon"
        icon={<Cpu className="w-4 h-4 text-[#FF2E93]" />}
        statusText="SOCKET: ws://localhost:4040 · LOCAL DAEMON ONLINE"
        className="shadow-2xl"
      >
        <div className="p-5 sm:p-8 bg-[#0B0E15] grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left Column: Information */}
          <div className="space-y-4 font-mono">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#FF2E93]/10 border border-[#FF2E93]/30 rounded text-xs text-[#FF2E93] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#FF2E93] animate-ping" />
              <span>DESKTOP COMPANION V1.2</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              Jembatani Browser dengan Local Terminal &amp; Docker Environment Anda
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Belajar di browser tidak boleh terisolasi dari lingkungan kerja developer yang sebenarnya. 
              <strong> Velqora Companion</strong> menyinkronkan tugas kuliah dan latihan modul langsung ke VS Code, 
              menjalankan pengujian otomatis lokal Vitest, dan mengirim skor kelulusan ke dashboard kampus secara aman.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Sync Otomatis Latihan Modul ke Repositori Git Lokal</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Eksekusi Unit Test Vitest &amp; Playwright Seketika</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Docker Sandbox Terisolasi untuk Lab Database PostgreSQL</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Link
                href="/download"
                className="px-4 py-2 vt-btn-pink text-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD COMPANION (CLI)</span>
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 vt-btn-chrome text-xs flex items-center gap-2 text-slate-200"
              >
                <span>DOKUMENTASI SETUP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Simulated Terminal & Status Box */}
          <div className="bg-[#06080C] p-4 rounded border-2 border-[#1E293B] font-mono text-xs text-slate-300 space-y-3 shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-[#00F2FE]">
                <Terminal className="w-3.5 h-3.5" />
                <span>velqora-companion-agent</span>
              </span>
              <span className="text-emerald-400">STATUS: LISTENING</span>
            </div>

            <div className="space-y-1 text-[11px] text-slate-400">
              <div>[DAEMON] Initializing Local WebSocket Listener on port 4040...</div>
              <div className="text-slate-200 font-bold">[SYNC] Linked to Workspace: c:\Users\ACER\Documents\Velqora</div>
              <div className="text-emerald-400">[READY] 12 Modules loaded into local cache</div>
              <div>[WATCH] Watching for test executions in src/**/*.test.ts</div>
              <div className="text-[#FF2E93]">[ACTIVE] Auto-grader connected to Academic Portal</div>
            </div>

            <div className="p-3 bg-slate-900/80 rounded border border-slate-800 text-[11px] space-y-1">
              <div className="text-slate-400">Perintah Instalasi Cepat:</div>
              <code className="text-[#00F2FE] block font-bold">
                npx velqora-cli@latest init
              </code>
            </div>
          </div>
        </div>
      </OSWindow>
    </div>
  );
}
