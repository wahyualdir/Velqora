"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, CheckCircle2 } from "lucide-react";

export function LandingCTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#FAF8F5] dark:from-zinc-900 dark:to-zinc-950 border-b border-zinc-200/60 dark:border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 text-white p-8 sm:p-14 border border-zinc-800 relative overflow-hidden shadow-2xl">
          {/* Subtle Background Radial Glow */}
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#C2553A]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C2553A]/20 border border-[#C2553A]/40 text-xs font-mono text-[#F48E7C] font-semibold mb-6">
              <GraduationCap className="w-4 h-4" />
              <span>MULAI PERJALANAN AKADEMIK ANDA</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
              Siap Menguasai Sains Data &amp; AI Secara Mendalam?
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-8">
              Akses kurikulum akademik komprehensif, jalankan kode komputasi nyata, uji intuisi dengan 
              latihan interaktif, dan kembangkan portofolio riset Anda bersama Velqora.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                href="/dashboard"
                className="px-7 py-3.5 rounded-xl bg-[#C2553A] hover:bg-[#A34530] text-white text-sm font-semibold shadow-lg shadow-[#C2553A]/30 transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Mulai Belajar Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login"
                className="px-6 py-3.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 text-sm font-semibold transition-all"
              >
                Sudah punya akun? Masuk
              </Link>
            </div>

            {/* Checklist */}
            <div className="flex flex-wrap items-center gap-5 text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>28 Topik Lengkap</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>3.680 Subbab Bebas Klise</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tanpa Biaya Tersembunyi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
