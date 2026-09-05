"use client";

import React from "react";
import { OSWindow } from "./os-window";
import { FileText, Check } from "lucide-react";

export function NotepadManifesto() {
  return (
    <div id="notepad-section" className="w-full max-w-4xl mx-auto px-4 my-10">
      <OSWindow
        title="README.txt — Notepad (Manifesto Dosen & Pedoman Belajar)"
        icon={<FileText className="w-4 h-4 text-amber-400" />}
        statusText="LINES: 48 · CHARS: 2840 · ENCODING: UTF-8 · DOS/WINDOWS"
        className="shadow-2xl"
      >
        <div className="p-4 sm:p-6 bg-[#0B0E14] font-mono text-xs text-slate-300 leading-relaxed space-y-4 select-text">
          {/* Notepad Header Bar */}
          <div className="flex items-center gap-4 text-[11px] text-slate-500 border-b border-slate-800 pb-2">
            <span>File</span>
            <span>Edit</span>
            <span>Search</span>
            <span>Help</span>
          </div>

          <div className="text-amber-300 font-bold text-sm">
            ================================================================================<br />
            VELQORA OS :: MANIFESTO REKAYASA WEB LEVEL PRODUKSI<br />
            ================================================================================
          </div>

          <p>
            Kepada Mahasiswa dan Calon Engineer:
          </p>

          <p>
            Di industri teknologi hari ini, batas antara &quot;bisa bikin website sederhana&quot; dan &quot;mampu merancang sistem produksi yang tidak tumbang di jam 3 pagi&quot; sangatlah jauh.
          </p>

          <div className="bg-[#070A0F] p-4 rounded border border-slate-800 space-y-2 text-slate-300">
            <div className="text-[#00F2FE] font-bold">3 HUKUM BESI VELQORA:</div>
            <div className="flex items-start gap-2">
              <span className="text-[#FF2E93] font-bold">1.</span>
              <span><strong>Bukan Hafalan Sintaks:</strong> Sintaks bisa dicari di dokumentasi dalam 5 detik. Yang Anda butuhkan adalah intuisi arsitektur, pemahaman boundary runtime, dan kemampuan threat modeling.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#FF2E93] font-bold">2.</span>
              <span><strong>Keamanan Bukan Aksesori:</strong> Jangan pernah simpan auth token di localStorage. Jangan pernah percayai user ID dari client. Defense-in-depth dimulai dari baris kode pertama.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#FF2E93] font-bold">3.</span>
              <span><strong>Bebas dari Klise &amp; Tutorial Neraka:</strong> Seluruh modul dilengkapi studi kasus kegagalan nyata di lapangan: dari insiden crash Black Friday hingga kebocoran kredensial kontainer.</span>
            </div>
          </div>

          <p>
            Gunakan 12 modul yang telah kami sediakan di dalam <strong>Curriculum Explorer</strong> sebagai pegangan diktat kuliah Anda. Kerjakan latihan dasar, selesaikan tugas mandiri dengan acceptance criteria ketat, dan uji pemahaman Anda pada evaluasi 7 soal di setiap modul.
          </p>

          <div className="pt-2 text-slate-500 text-[11px] border-t border-slate-800 flex items-center justify-between">
            <span>Disusun oleh: Senior Full-stack Engineer &amp; Dosen Praktisi (10 Thn Pengalaman)</span>
            <span className="text-emerald-400">STATUS: APPROVED FOR SEMESTER 3</span>
          </div>
        </div>
      </OSWindow>
    </div>
  );
}
