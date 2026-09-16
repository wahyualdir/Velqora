"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Github, BookOpen, Shield, Terminal } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-white dark:bg-zinc-950 py-14 text-xs text-zinc-500 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-zinc-200/80 dark:border-zinc-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#C2553A] flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-black text-lg tracking-tight text-zinc-900 dark:text-white uppercase font-sans">
                VELQORA
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Platform workspace perkuliahan &amp; computational notebook akademik berstandar industri. 
              Mencakup 28 disiplin keilmuan AI, Machine Learning, dan Sains Data.
            </p>
            <div className="text-[11px] font-mono text-zinc-400">
              © {new Date().getFullYear()} Velqora. All rights reserved.
            </div>
          </div>

          {/* Column 1: Kurikulum Unggulan */}
          <div className="space-y-2.5">
            <div className="font-bold text-zinc-900 dark:text-white font-mono text-xs uppercase tracking-wider">
              Kurikulum Unggulan
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard/modul/kategori/data-science" className="hover:text-[#C2553A] transition-colors">
                  Sains Data &amp; Analitika Lanjutan
                </Link>
              </li>
              <li>
                <Link href="/dashboard/modul/kategori/ai-fundamentals" className="hover:text-[#C2553A] transition-colors">
                  Fondasi Kecerdasan Buatan (AI)
                </Link>
              </li>
              <li>
                <Link href="/dashboard/modul/kategori/machine-learning" className="hover:text-[#C2553A] transition-colors">
                  Machine Learning Terapan
                </Link>
              </li>
              <li>
                <Link href="/dashboard/modul/kategori/deep-learning" className="hover:text-[#C2553A] transition-colors">
                  Deep Learning &amp; Computer Vision
                </Link>
              </li>
              <li>
                <Link href="/dashboard/modul/kategori/large-language-model" className="hover:text-[#C2553A] transition-colors">
                  Large Language Model &amp; Prompting
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Ekosistem Workspace */}
          <div className="space-y-2.5">
            <div className="font-bold text-zinc-900 dark:text-white font-mono text-xs uppercase tracking-wider">
              Ekosistem Platform
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard/modul" className="hover:text-[#C2553A] transition-colors">
                  Koleksi Modul Perkuliahan
                </Link>
              </li>
              <li>
                <Link href="/dashboard/catatan" className="hover:text-[#C2553A] transition-colors">
                  Catatan Graph Knowledge Vault
                </Link>
              </li>
              <li>
                <Link href="/dashboard/ai-tutor" className="hover:text-[#C2553A] transition-colors">
                  AI Tutor Akademik
                </Link>
              </li>
              <li>
                <Link href="/dashboard/jadwal" className="hover:text-[#C2553A] transition-colors">
                  Jadwal &amp; Workload Intelligence
                </Link>
              </li>
              <li>
                <Link href="/dashboard/konversi" className="hover:text-[#C2553A] transition-colors">
                  Konversi Dokumen Akademik
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Standar Akademik */}
          <div className="space-y-2.5">
            <div className="font-bold text-zinc-900 dark:text-white font-mono text-xs uppercase tracking-wider">
              Integritas &amp; Mutu
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>102 Sumber Primer Ber-DOI</span>
              </li>
              <li className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span>Eksekusi Python 3.12 Terisolasi</span>
              </li>
              <li className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                <span>Bebas Placeholder &amp; Klise</span>
              </li>
              <li className="pt-2">
                <span className="inline-block px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-900 font-mono text-[10px] text-zinc-500">
                  Status: 28 Topik Active
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div>
            Velqora dirancang khusus untuk mahasiswa, peneliti, dan praktisi data sains &amp; komputasi cerdas.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/daftar" className="hover:underline">
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
