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
        statusText="LINES: 42 · CHARS: 2180 · ANSI / WINDOWS-1252"
        className="shadow-md"
        bodyClassName="p-4 sm:p-6 bg-[#FFFFFF] text-[#1C1917]"
      >
        {/* Windows Notepad Menu Bar: File Edit Format View Help */}
        <div className="flex items-center gap-4 text-xs font-mono text-[#524B42] pb-3 mb-4 border-b border-[#E5DDD5] select-none">
          <span className="hover:text-[#C2553A] cursor-pointer">File</span>
          <span className="hover:text-[#C2553A] cursor-pointer">Edit</span>
          <span className="hover:text-[#C2553A] cursor-pointer">Format</span>
          <span className="hover:text-[#C2553A] cursor-pointer">View</span>
          <span className="hover:text-[#C2553A] cursor-pointer">Help</span>
        </div>

        {/* Section Header Tag (Vintec Exact) */}
        <div className="space-y-3 font-mono">
          <div className="text-xs text-[#C2553A] font-bold tracking-wider uppercase">
            01 — MANIFESTO
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-sans text-[#1C1917] tracking-tight">
            Belajar web bukan menghafal sintaks.
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-[#44403C] leading-relaxed pt-2">
            <p>
              Di era kecerdasan buatan, sintaks dan fungsi bawaan bahasa pemrograman dapat dihasilkan dalam hitungan detik. 
              Yang tidak bisa digantikan oleh AI adalah <strong>intuisi arsitektur</strong>: memahami di mana batas peramban dan server, 
              mengapa autentikasi di <code>localStorage</code> adalah dosa besar keamanan, dan bagaimana mencegah sistem database 
              tumbang akibat <em>connection exhaustion</em> di arsitektur serverless.
            </p>

            <div className="p-4 bg-[#FAF8F5] border-l-4 border-[#C2553A] space-y-2 text-xs">
              <div className="font-bold text-[#C2553A]">PEDOMAN REKAYASA VELQORA:</div>
              <div>• <strong>Kode Nyata, Bukan Cuplikan Klise:</strong> Setiap modul menyajikan implementasi TypeScript lengkap siap produksi.</div>
              <div>• <strong>Studi Kasus Insiden Nyata:</strong> Pelajari investigasi kegagalan Black Friday crash, serangan supply-chain XSS, dan testing mirage.</div>
              <div>• <strong>Evaluasi Berpikir Kritis:</strong> 7 soal skenario analitis di setiap modul untuk menguji kedalaman intuisi Anda.</div>
            </div>

            <p className="text-xs text-[#7A756D] italic pt-1">
              — Diktat Kurikulum Resmi S1 Informatika / Sistem Informasi (10 Tahun Pengalaman Praktisi)
            </p>
          </div>
        </div>
      </OSWindow>
    </div>
  );
}
