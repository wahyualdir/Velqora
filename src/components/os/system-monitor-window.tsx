"use client";

import React from "react";
import { OSWindow } from "./os-window";
import { Cpu, CheckCircle, ArrowRight, ShieldCheck, Download, Layers } from "lucide-react";
import Link from "next/link";

export function SystemMonitorWindow() {
  return (
    <div id="stats-section" className="w-full max-w-7xl mx-auto px-2 sm:px-4 my-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* =========================================================================
            WINDOW 1: SYSTEM_MONITOR.EXE (Stats & Numbers) - 7 cols
            ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col">
          <OSWindow
            title="SYSTEM_MONITOR.EXE"
            statusText="TELEMETRY 100% HEALTHY"
            className="flex-1 shadow-md"
            bodyClassName="p-4 sm:p-6 bg-[#FFFFFF] text-[#1C1917] flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Tag: 03 — ANGKA (Exact Vintec Learn) */}
              <div className="text-xs font-mono text-[#C2553A] font-bold tracking-wider uppercase">
                03 — ANGKA
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-sans text-[#1C1917] tracking-tight">
                Dibangun untuk kejelasan.
              </h2>

              <p className="text-xs sm:text-sm text-[#524B42] font-sans leading-relaxed">
                Bukan sekadar video tutorial yang ditonton sambil lalu. Diktat kurikulum mandiri dengan 
                standar evaluasi komprehensif, latihan terstruktur, dan pembongkaran studi kasus nyata.
              </p>

              {/* 3 Stat Progress Cards */}
              <div className="space-y-3 pt-2 font-mono">
                {/* Stat 1 */}
                <div className="p-3 bg-[#FAF8F5] border border-[#E5DDD5] rounded-xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1C1917]">12 MODUL TERSTANDARISASI</span>
                    <span className="text-[#C2553A] font-bold">12 / 12 (100%)</span>
                  </div>
                  <div className="w-full h-2 bg-[#E5DDD5] rounded-none overflow-hidden">
                    <div className="h-full bg-[#C2553A] w-full" />
                  </div>
                  <div className="text-[10px] text-[#7A756D]">
                    Dari Client-Server HTTP hingga Containerization Docker &amp; CI/CD.
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="p-3 bg-[#FAF8F5] border border-[#E5DDD5] rounded-xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1C1917]">84 SOAL KUIS SIAP DIJALANKAN</span>
                    <span className="text-[#10B981] font-bold">84 / 84 (100%)</span>
                  </div>
                  <div className="w-full h-2 bg-[#E5DDD5] rounded-none overflow-hidden">
                    <div className="h-full bg-[#10B981] w-full" />
                  </div>
                  <div className="text-[10px] text-[#7A756D]">
                    7 soal skenario analitis lengkap dengan kunci jawaban &amp; pembahasan rasional per modul.
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="p-3 bg-[#FAF8F5] border border-[#E5DDD5] rounded-xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1C1917]">100% AKSES SEUMUR HIDUP</span>
                    <span className="text-[#F59E0B] font-bold">LIFETIME</span>
                  </div>
                  <div className="w-full h-2 bg-[#E5DDD5] rounded-none overflow-hidden">
                    <div className="h-full bg-[#F59E0B] w-full" />
                  </div>
                  <div className="text-[10px] text-[#7A756D]">
                    Bebas diakses kapan pun untuk bahan referensi skripsi, magang, dan proyek industri.
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Chips: SYSTEM_FEATURES.DLL */}
            <div className="pt-4 mt-4 border-t border-[#E5DDD5] flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#FAF8F5] border border-[#D6CEC4] text-[#1C1917]">
                  ▦ Curated Paths
                </span>
                <span className="px-2 py-0.5 bg-[#FAF8F5] border border-[#D6CEC4] text-[#1C1917]">
                  ▤ Premium Diktat
                </span>
                <span className="px-2 py-0.5 bg-[#FAF8F5] border border-[#D6CEC4] text-[#1C1917]">
                  ◨ Zero Klise
                </span>
              </div>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>◆ Verified Quality</span>
              </span>
            </div>
          </OSWindow>
        </div>

        {/* =========================================================================
            WINDOW 2: VELQORA_COMPANION.EXE (Desktop App Showcase) - 5 cols
            ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col">
          <OSWindow
            title="VELQORA_COMPANION.EXE"
            statusText="APPLICATION · DESKTOP"
            className="flex-1 shadow-md"
            bodyClassName="p-4 sm:p-6 bg-[#FFFFFF] text-[#1C1917] flex flex-col justify-between"
          >
            <div className="space-y-4 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#C2553A] font-bold uppercase">
                  COMPANION AGENT
                </span>
                <span className="text-[10px] text-[#7A756D] bg-[#FAF8F5] px-2 py-0.5 border border-[#E5DDD5]">
                  v1.0.0
                </span>
              </div>

              <h3 className="text-xl font-bold font-sans text-[#1C1917] tracking-tight leading-snug">
                Sinkronkan Latihan ke Terminal Lokal Anda.
              </h3>

              <p className="text-xs text-[#524B42] font-sans leading-relaxed">
                Jalankan tugas mandiri dan unit test Vitest langsung dari VS Code Anda. 
                Velqora Companion mendeteksi eksekusi tes lokal dan mengirimkan skor kelulusan secara otomatis.
              </p>

              {/* Supported Platforms */}
              <div className="p-3 bg-[#FAF8F5] border border-[#E5DDD5] space-y-2 text-xs">
                <div className="text-[#1C1917] font-bold text-[11px]">Kompatibilitas Sistem:</div>
                <div className="flex items-center gap-3 text-[#524B42] text-[11px]">
                  <span>Windows x64</span>
                  <span>•</span>
                  <span>macOS Apple Silicon</span>
                  <span>•</span>
                  <span>Linux</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#524B42]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Auto-sync berkas tugas mahasiswa</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Vitest &amp; Playwright runner watcher</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 mt-4 border-t border-[#E5DDD5] flex items-center justify-between gap-2 font-mono">
              <Link
                href="/download"
                className="px-4 py-2 vt-btn-terracotta text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>Open Companion</span>
                <span>▸</span>
              </Link>
              <span className="text-[11px] text-emerald-700 font-bold">
                • Available soon
              </span>
            </div>
          </OSWindow>
        </div>
      </div>
    </div>
  );
}
