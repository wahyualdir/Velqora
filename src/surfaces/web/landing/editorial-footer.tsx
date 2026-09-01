"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { useScrollReveal } from "./use-landing-animation";

export function EditorialFooter() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.05 });

  return (
    <footer
      ref={ref}
      className={`py-14 border-t border-border bg-surface-secondary/40 text-text-secondary transition-opacity duration-500 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 space-y-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-2 text-left">
            <Logo variant="sidebar" withTile showSubtitle={false} />
            <p className="text-xs text-text-tertiary max-w-sm leading-relaxed">
              Ruang kerja digital dan manajemen perkuliahan terpadu untuk mahasiswa Indonesia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px] font-medium">
            <Link href="/dashboard" className="hover:text-text-primary transition-colors duration-150">
              Workspace
            </Link>
            <Link href="/dashboard/jadwal" className="hover:text-text-primary transition-colors duration-150">
              Jadwal Kuliah
            </Link>
            <Link href="/dashboard/materi" className="hover:text-text-primary transition-colors duration-150">
              Arsip Modul
            </Link>
            <Link href="/dashboard/tugas" className="hover:text-text-primary transition-colors duration-150">
              Tugas & Deadline
            </Link>
            <Link href="/dashboard/ai-tutor" className="hover:text-text-primary transition-colors duration-150">
              AI Tutor
            </Link>
            <Link href="/dashboard/kuis-ai" className="hover:text-text-primary transition-colors duration-150">
              Latihan & Kuis
            </Link>
            <Link href="/download" className="hover:text-brand-600 transition-colors duration-150 text-brand-500 font-semibold">
              Pasang PWA
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-text-tertiary">
          <div>
            &copy; {new Date().getFullYear()} Velqora. Seluruh hak cipta dilindungi undang-undang.
          </div>
          <div className="flex items-center gap-3">
            <span>Aplikasi Web & Mobile PWA</span>
            <span className="w-px h-3 bg-border" />
            <span>Privasi & Keamanan Terjaga</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
