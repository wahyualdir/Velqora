"use client";

import React from "react";
import { OSWindow } from "./os-window";
import { Play } from "lucide-react";
import Link from "next/link";

export function RunDialogCTA() {
  return (
    <div id="run-section" className="w-full max-w-7xl mx-auto px-2 sm:px-4 my-8 pb-12">
      <OSWindow
        title="RUN.EXE — JALANKAN"
        icon={<Play className="w-3.5 h-3.5 text-amber-200 fill-current" />}
        statusText="SYSTEM PROMPT ACTIVE"
        className="shadow-md"
        bodyClassName="p-6 sm:p-8 bg-[#FFFFFF] text-[#1C1917] font-mono space-y-4"
      >
        <div className="space-y-2">
          {/* Tag: 04 — MULAI (Exact Vintec Learn) */}
          <div className="text-xs text-[#C2553A] font-bold tracking-wider uppercase">
            04 — MULAI
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-sans text-[#1C1917] tracking-tight">
            Siap belajar serius?
          </h2>

          <p className="text-xs sm:text-sm text-[#524B42] font-sans max-w-2xl leading-relaxed">
            Akses 12 modul lengkap, uji kemampuan dengan 84 soal kuis terarah, dan bangun 
            pemahaman rekayasa web modern tingkat lanjut bersama Velqora.
          </p>
        </div>

        {/* Action Buttons (Exact Vintec Buttons) */}
        <div className="pt-4 flex flex-wrap items-center gap-3">
          <Link
            href="/register"
            className="px-6 py-2.5 vt-btn-terracotta text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <span>Buat akun</span>
            <span>▸</span>
          </Link>

          <Link
            href="/login"
            className="px-5 py-2.5 vt-btn-chrome text-xs font-semibold"
          >
            Sudah punya akun? Masuk
          </Link>
        </div>
      </OSWindow>
    </div>
  );
}
