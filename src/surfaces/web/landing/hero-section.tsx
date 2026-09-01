import React from "react";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookshelfHeroBackground } from "./bookshelf-bg";

export function HeroSection() {
  return (
    <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 border-b border-border overflow-hidden">
      <BookshelfHeroBackground />

      {/* Warm ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Editorial Copy — left-aligned, not centered */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-[13px] font-medium text-brand-500 tracking-wide uppercase">
              Platform Belajar Mahasiswa
            </p>

            <h1 className="text-[2.5rem] lg:text-[3.25rem] xl:text-[3.75rem] font-extrabold tracking-[-0.035em] font-display text-text-primary leading-[1.08]">
              Semua urusan kuliah,{" "}
              <span className="text-brand-500">rapi dan terkendali.</span>
            </h1>

            <p className="text-base lg:text-lg text-text-secondary leading-relaxed max-w-lg">
              Atur jadwal tanpa bentrok, susun materi per mata kuliah, dan
              tanya konsep rumit ke AI tutor — semua dari satu tempat.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="text-sm font-semibold gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 shadow-sm"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/download">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-sm font-medium gap-2 border-border hover:bg-surface-hover text-text-primary"
                >
                  <Download className="w-4 h-4 text-brand-500" />
                  <span>Pasang di HP (PWA)</span>
                </Button>
              </Link>
            </div>

            {/* Inline trust indicators — integrated, not a separate bar */}
            <div className="flex items-center gap-4 pt-1 text-[12px] text-text-tertiary">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Data terisolasi per akun
              </span>
              <span className="w-px h-3 bg-border" />
              <span>Bebas iklan & pelacak</span>
              <span className="w-px h-3 bg-border" />
              <span>AI tutor kontekstual</span>
            </div>
          </div>

          {/* Right: Product Mockup — with perspective depth */}
          <div className="lg:col-span-6 relative">
            {/* Desktop Window Mockup */}
            <div className="rounded-xl border border-border bg-white shadow-lg overflow-hidden transform lg:rotate-1 lg:translate-x-2">
              {/* Window Chrome */}
              <div className="h-9 px-4 bg-surface-secondary border-b border-border flex items-center justify-between text-[11px] text-text-tertiary">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <div className="px-3 py-0.5 rounded-md bg-surface border border-border text-[11px] font-mono text-text-tertiary truncate max-w-[200px]">
                  velqora.web.id/dashboard
                </div>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Web Desktop
                </span>
              </div>

              {/* Dashboard Content Preview */}
              <div className="p-4 sm:p-5 grid grid-cols-12 gap-4 bg-background">
                {/* Mini Sidebar */}
                <div className="col-span-3 hidden sm:flex flex-col gap-1.5 pr-3 border-r border-border text-xs">
                  <div className="px-2 py-1 rounded-md bg-brand-500/10 text-brand-500 font-semibold flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="10" y1="4" x2="10" y2="10"/></svg>
                    <span>Jadwal Kuliah</span>
                  </div>
                  <div className="px-2 py-1 rounded-md text-text-secondary hover:bg-surface-hover flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-text-tertiary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20"/></svg>
                    <span>Modul & Slide</span>
                  </div>
                  <div className="px-2 py-1 rounded-md text-text-secondary hover:bg-surface-hover flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-text-tertiary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span>Tugas Kuliah</span>
                  </div>
                </div>

                {/* Main Workspace */}
                <div className="col-span-12 sm:col-span-9 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-text-primary">Semester Genap • 21 SKS</p>
                      <p className="text-[11px] text-text-tertiary">Jadwal Aktif (Bebas Konflik)</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-semibold">
                      ✓ 0 Bentrok
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded-lg bg-surface border border-border flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-text-primary truncate">Struktur Data & Algoritma</p>
                        <p className="text-[11px] text-text-tertiary">Senin • 08:00 - 10:30 • R. Lab 3</p>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 shrink-0">3 SKS</span>
                    </div>
                    <div className="p-2 rounded-lg bg-surface border border-border flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-text-primary truncate">Sistem Basis Data Terdistribusi</p>
                        <p className="text-[11px] text-text-tertiary">Rabu • 13:00 - 15:30 • Gedung B201</p>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 shrink-0">3 SKS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Companion — overlapping, smaller, offset */}
            <div className="absolute -bottom-6 -left-4 lg:-left-8 w-44 rounded-2xl border-2 border-border bg-white p-1.5 shadow-lg transform -rotate-2 z-10">
              <div className="w-12 h-2 bg-surface-secondary rounded-full mx-auto mb-1.5" />
              <div className="rounded-xl bg-surface border border-border p-2.5 space-y-2 text-text-primary">
                <div className="flex items-center justify-between text-[10px] border-b border-border pb-1.5">
                  <span className="font-bold text-text-primary flex items-center gap-1">
                    <svg className="w-3 h-3 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                    Velqora
                  </span>
                  <span className="text-[9px] text-text-tertiary">PWA</span>
                </div>
                <div className="p-1.5 rounded bg-brand-500/5 border border-brand-500/15 space-y-0.5">
                  <p className="text-[9px] text-brand-600 font-semibold">Kuliah Berikutnya</p>
                  <p className="text-[10px] font-bold text-text-primary">Kalkulus Lanjut</p>
                  <p className="text-[9px] text-text-tertiary">10:45 • R. 402</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
