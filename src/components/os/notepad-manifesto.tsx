"use client";

import React from "react";
import { OSWindow } from "./os-window";
import { FileText } from "lucide-react";

export function NotepadManifesto() {
  return (
    <div id="notepad-section" className="w-full max-w-7xl mx-auto px-2 sm:px-4 my-8">
      <OSWindow
        title="README.TXT — NOTEPAD"
        icon={<FileText className="w-4 h-4 text-amber-600" />}
        statusText="LINES: 48 · CHARS: 2480 · ANSI / WINDOWS-1252"
        className="shadow-md"
        bodyClassName="p-4 sm:p-6 bg-[#FFFFFF] dark:bg-[#141416] text-[#1C1917] dark:text-zinc-100"
      >
        {/* Windows Notepad Menu Bar: File Edit Format View Help */}
        <div className="flex items-center gap-4 text-xs font-mono text-[#524B42] dark:text-zinc-400 pb-3 mb-4 border-b border-[#E5DDD5] dark:border-zinc-800 select-none">
          <span className="hover:text-[#C2553A] dark:hover:text-brand-400 cursor-pointer">File</span>
          <span className="hover:text-[#C2553A] dark:hover:text-brand-400 cursor-pointer">Edit</span>
          <span className="hover:text-[#C2553A] dark:hover:text-brand-400 cursor-pointer">Format</span>
          <span className="hover:text-[#C2553A] dark:hover:text-brand-400 cursor-pointer">View</span>
          <span className="hover:text-[#C2553A] dark:hover:text-brand-400 cursor-pointer">Help</span>
        </div>

        {/* Section Header Tag (Vintec Exact) */}
        <div className="space-y-3 font-mono">
          <div className="text-xs text-[#C2553A] dark:text-brand-400 font-bold tracking-wider uppercase">
            01 — MANIFESTO AKADEMIK
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-sans text-[#1C1917] dark:text-zinc-100 tracking-tight">
            Menguasai AI &amp; Sains Data bukan sekadar memanggil API hitam.
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-[#44403C] dark:text-zinc-300 leading-relaxed pt-2">
            <p>
              Di era kecerdasan buatan generatif, sintaks dan baris kode dasar dapat dihasilkan dalam hitungan detik. 
              Yang tidak bisa digantikan oleh AI adalah <strong>intuisi arsitektur</strong>: memahami di mana batas asumsi inferensial, 
              mengapa mengabaikan biaya asimetris False Negative adalah bencana finansial, dan bagaimana mengisolasi variabel perancu 
              (<em>confounder</em>) agar kesimpulan kausalitas tidak terbalik seperti pada Paradoks Simpson.
            </p>

            <div className="p-4 bg-[#FAF8F5] dark:bg-[#18181B] border-l-4 border-[#C2553A] space-y-2 text-xs">
              <div className="font-bold text-[#C2553A] dark:text-brand-400">PEDOMAN REKAYASA &amp; KURIKULUM VELQORA:</div>
              <div>• <strong>Computational Notebook Terisolasi:</strong> Setiap modul menyajikan formulasi matematis formal LaTeX KaTeX yang dipadukan dengan sel kode Python 3.12 terverifikasi.</div>
              <div>• <strong>Penelusuran 102 Rujukan Pustaka Primer:</strong> Setiap klaim ilmiah dipetakan langsung ke bab dan halaman karya kanonikal (Hastie ESL, Judea Pearl Causality, John Tukey EDA).</div>
              <div>• <strong>Evaluasi Berpikir Kritis 5 Tingkat:</strong> Latihan skenario analitis bertingkat dengan scaffolding petunjuk solusi anti-spoiler untuk melatih ketajaman intuisi.</div>
            </div>

            <p className="text-xs text-[#7A756D] dark:text-zinc-400 italic pt-1">
              — Diktat Kurikulum Resmi 28 Topik Disiplin AI, Machine Learning &amp; Sains Data (Velqora Academic Platform)
            </p>
          </div>
        </div>
      </OSWindow>
    </div>
  );
}
