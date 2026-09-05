"use client";

import React, { useState, useRef, useEffect } from "react";
import { OSWindow } from "./os-window";
import { Terminal, Play, CheckCircle2, AlertCircle } from "lucide-react";

interface CommandLog {
  id: string;
  type: "input" | "output" | "system" | "error" | "success";
  text: string | React.ReactNode;
}

export function InteractiveTerminal() {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: "init-1",
      type: "system",
      text: "VELQORA KERNEL v1.2.0-RELEASE (x86_64-pc-linux-gnu)",
    },
    {
      id: "init-2",
      type: "system",
      text: "Memory: 16384MB | Architecture: React 19 + Next.js 15 App Router | Status: ONLINE",
    },
    {
      id: "init-3",
      type: "output",
      text: "Ketik 'help' untuk daftar perintah, atau 'modules' untuk mengecek 12 modul web modern.",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Append user input to logs
    const newLogs: CommandLog[] = [
      ...logs,
      { id: `cmd-${Date.now()}`, type: "input", text: trimmed },
    ];

    const lower = trimmed.toLowerCase();

    if (lower === "clear") {
      setLogs([]);
      setInput("");
      return;
    }

    if (lower === "help") {
      newLogs.push({
        id: `out-${Date.now()}`,
        type: "output",
        text: (
          <div className="space-y-1 text-slate-300">
            <div className="text-[#00F2FE] font-bold">DAFTAR PERINTAH SISTEM VELQORA:</div>
            <div><span className="text-emerald-400 font-bold">help</span> - Menampilkan bantuan ini</div>
            <div><span className="text-emerald-400 font-bold">modules</span> - Menampilkan daftar 12 modul kurikulum</div>
            <div><span className="text-emerald-400 font-bold">status</span> - Cek status kernel, database, & telemetry</div>
            <div><span className="text-emerald-400 font-bold">about</span> - Informasi arsitektur Velqora OS</div>
            <div><span className="text-emerald-400 font-bold">run &lt;nomor&gt;</span> - Simulasi peluncuran modul (contoh: run 01)</div>
            <div><span className="text-emerald-400 font-bold">clear</span> - Membersihkan layar terminal</div>
          </div>
        ),
      });
    } else if (lower === "modules" || lower === "modul") {
      newLogs.push({
        id: `out-${Date.now()}`,
        type: "output",
        text: (
          <div className="space-y-1 text-slate-300">
            <div className="text-[#FF2E93] font-bold">KURIKULUM RESMI (12 MODUL TERSEDIA):</div>
            <div>[01] Pengantar Web Modern & Runtime Boundary</div>
            <div>[02] HTML5 Semantik & Aksesibilitas WCAG 2.2</div>
            <div>[03] ES6+ & Asynchronous Event Loop</div>
            <div>[04] React Komponen, Props, & State Reconciliation</div>
            <div>[05] Next.js 15 App Router & Async Params</div>
            <div>[06] Data Fetching, Server Actions, & Zod</div>
            <div>[07] Manajemen State Lanjutan (Zustand & Compound)</div>
            <div>[08] Styling Modern (Tailwind CSS, CVA, & Radix UI)</div>
            <div>[09] Autentikasi HttpOnly Cookies & RBAC</div>
            <div>[10] PostgreSQL, Prisma ORM, & Connection Pooling</div>
            <div>[11] Testing Pyramid (Vitest, RTL, & Playwright)</div>
            <div>[12] Deployment Docker Multi-Stage & GitHub Actions CI/CD</div>
            <div className="text-xs text-slate-400 mt-1 italic">
              Scroll ke jendela Curriculum Explorer di bawah untuk membaca isi lengkap.
            </div>
          </div>
        ),
      });
    } else if (lower === "status") {
      newLogs.push({
        id: `out-${Date.now()}`,
        type: "success",
        text: (
          <div className="space-y-1 text-emerald-300">
            <div>✓ KERNEL STATUS: ONLINE (Next.js 15.5)</div>
            <div>✓ DATABASE: PostgreSQL Connected via Prisma Accelerate</div>
            <div>✓ AUTH SERVICE: HttpOnly JWT Sesi Aktif</div>
            <div>✓ CURRICULUM ASSETS: 12 Modules Loaded (100% Complete)</div>
            <div>✓ SYSTEM INTEGRITY: ALL CHECKS PASSED (Zero Defects)</div>
          </div>
        ),
      });
    } else if (lower === "about") {
      newLogs.push({
        id: `out-${Date.now()}`,
        type: "output",
        text: (
          <div className="space-y-1 text-slate-300">
            <div className="text-[#00F2FE] font-bold">VELQORA OS v1.2</div>
            <div>Platform workspace pembelajaran web modern berstandar industri.</div>
            <div>Didesain dengan pendekatan praktis: kode nyata, studi kasus insiden, dan tanpa klise generik.</div>
            <div>Terinspirasi dari paradigma Web-OS Vintec Learn.</div>
          </div>
        ),
      });
    } else if (lower.startsWith("run ")) {
      const num = lower.replace("run ", "").trim();
      newLogs.push({
        id: `out-${Date.now()}`,
        type: "success",
        text: `[OK] Meluncurkan environment lab untuk Modul ${num}... Membuka browser simulator.`,
      });
      // Also scroll to curriculum section
      setTimeout(() => {
        document.getElementById("curriculum-section")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    } else {
      newLogs.push({
        id: `out-${Date.now()}`,
        type: "error",
        text: `Command not recognized: '${trimmed}'. Ketik 'help' untuk daftar perintah yang tersedia.`,
      });
    }

    setLogs(newLogs);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    }
  };

  return (
    <div id="terminal-section" className="w-full max-w-5xl mx-auto px-4 my-8">
      <OSWindow
        title="MONITOR.EXE — Interactive Terminal Console"
        icon={<Terminal className="w-4 h-4 text-emerald-400" />}
        statusText="TERMINAL ACTIVE · TTY0 · UTF-8"
        className="shadow-2xl"
      >
        <div className="p-4 bg-[#070A0F] font-mono text-xs text-slate-200 min-h-[280px] max-h-[420px] flex flex-col justify-between select-text">
          {/* Output Logs */}
          <div className="space-y-2 overflow-y-auto pr-1">
            {logs.map((log) => {
              if (log.type === "input") {
                return (
                  <div key={log.id} className="flex items-center gap-2 text-slate-200">
                    <span className="text-[#00F2FE] font-bold">velqora@os:~$</span>
                    <span className="font-bold">{log.text}</span>
                  </div>
                );
              }
              if (log.type === "system") {
                return (
                  <div key={log.id} className="text-slate-400 text-[11px]">
                    [SYS] {log.text}
                  </div>
                );
              }
              if (log.type === "error") {
                return (
                  <div key={log.id} className="text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{log.text}</span>
                  </div>
                );
              }
              if (log.type === "success") {
                return (
                  <div key={log.id} className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <div>{log.text}</div>
                  </div>
                );
              }
              return (
                <div key={log.id} className="text-slate-300 pl-2 border-l border-slate-700/60 py-0.5">
                  {log.text}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Quick Command Pills */}
          <div className="pt-3 pb-1 border-t border-slate-800/80 mt-3 flex items-center gap-2 flex-wrap text-[11px]">
            <span className="text-slate-500 font-bold">Quick Exec:</span>
            {["help", "modules", "status", "about", "clear"].map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => handleCommand(cmd)}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 hover:border-[#00F2FE] hover:text-[#00F2FE] text-slate-400 transition-colors"
              >
                ${cmd}
              </button>
            ))}
          </div>

          {/* Command Prompt Input */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800">
            <span className="text-[#00F2FE] font-bold select-none">velqora@os:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik perintah di sini (contoh: modules)..."
              className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-white placeholder:text-slate-600 focus:ring-0"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => handleCommand(input)}
              className="px-2 py-1 vt-btn-teal text-[10px] flex items-center gap-1"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>EXEC</span>
            </button>
          </div>
        </div>
      </OSWindow>
    </div>
  );
}
