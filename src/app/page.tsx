import React from "react";
import Link from "next/link";
import {
  Calendar,
  Bot,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Laptop,
  Code2,
  Download,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Velqora — Academic Technology Platform & Learning Workspace",
  description:
    "Platform workspace akademis profesional untuk mahasiswa dan pelajar. Pengorganisasian jadwal pintar, kurikulum modul, manajemen materi multi-format, dan AI Tutor kontekstual.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-brand-500/20 selection:text-brand-300 font-sans">
      {/* ─── Top Editorial Navigation ─── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-mono font-bold text-sm shadow-xs">
                V
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base tracking-tight text-text-primary">
                  VELQORA
                </span>
                <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider hidden sm:inline">
                  Academic Platform
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-text-secondary">
            <a href="#fitur" className="hover:text-text-primary transition-colors">
              Fitur Utama
            </a>
            <a href="#alur-kerja" className="hover:text-text-primary transition-colors">
              Alur Kerja
            </a>
            <a href="#arsitektur" className="hover:text-text-primary transition-colors">
              Arsitektur Web & App
            </a>
            <Link href="/download" className="hover:text-text-primary transition-colors flex items-center gap-1">
              <Download className="w-3.5 h-3.5 text-brand-400" />
              <span>Pasang Aplikasi</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs font-medium">
                Masuk
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="text-xs font-semibold gap-1.5 shadow-xs">
                <span>Buka Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ─── 1. Hero Section ─── */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-border overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface-secondary text-text-secondary text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Velqora Academic Release 2.0 — Dual-Experience Edition</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-text-primary leading-[1.15]">
                Platform Ruang Kerja Akademis Terstruktur untuk Pembelajar Modern.
              </h1>

              <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
                Satukan kurikulum modul, arsip materi multi-format, kalender perkuliahan pintar bebas bentrok, serta bimbingan AI Tutor kontekstual dalam satu ekosistem akademis profesional.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/dashboard">
                  <Button size="lg" className="text-sm font-semibold gap-2 shadow-xs">
                    <span>Masuk ke Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/download">
                  <Button variant="outline" size="lg" className="text-sm font-medium gap-2">
                    <Download className="w-4 h-4 text-text-tertiary" />
                    <span>Pasang di Perangkat (PWA)</span>
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/80 max-w-lg">
                <div>
                  <div className="text-lg font-bold font-mono text-text-primary">100%</div>
                  <div className="text-xs text-text-tertiary">Bebas Iklan & Pelacak</div>
                </div>
                <div>
                  <div className="text-lg font-bold font-mono text-text-primary">RLS</div>
                  <div className="text-xs text-text-tertiary">Isolasi Data Aman</div>
                </div>
                <div>
                  <div className="text-lg font-bold font-mono text-text-primary">&lt; 150ms</div>
                  <div className="text-xs text-text-tertiary">Latensi Responsif</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 2. Product Value & Architecture Separation ─── */}
        <section id="arsitektur" className="py-16 md:py-24 border-b border-border bg-surface-secondary/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono text-brand-400 uppercase tracking-wider font-semibold">
                Dual Product Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-text-primary">
                Satu Backend Terpadu. Dua Pengalaman Khusus.
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Kami merancang Velqora agar tidak memaksakan satu tampilan untuk semua perangkat. Desktop adalah ruang kerja profesional, sedangkan mobile adalah aplikasi pendamping belajar harian.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product A: Web Desktop */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface space-y-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                  <Laptop className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-display text-text-primary">
                    Velqora Web Desktop
                  </h3>
                  <p className="text-xs font-mono text-text-tertiary">
                    Professional Academic Technology Workspace
                  </p>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Dirancang untuk produktivitas layar lebar dengan navigasi sidebar 245px, density data tinggi, multi-column workflow, pintasan keyboard spotlight, dan editor kode split-pane.
                </p>
                <ul className="space-y-2 pt-2 border-t border-border text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <span>Workspace gelap yang tenang dan ramah mata</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <span>Tabel data terstruktur dengan sorting dan filtering cepat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <span>Multi-pane IDE Playground & OCR extraction</span>
                  </li>
                </ul>
              </div>

              {/* Product B: Mobile Companion */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-display text-text-primary">
                    Velqora Mobile App
                  </h3>
                  <p className="text-xs font-mono text-text-tertiary">
                    Personal Learning Companion (PWA)
                  </p>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Pengalaman native-like aplikasi mobile dengan tema terang bersih, navigasi bawah 5 destinasi ergonomis, gesture-friendly sheets, dan pemantauan agenda kuliah dalam genggaman.
                </p>
                <ul className="space-y-2 pt-2 border-t border-border text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Navigasi bawah jempol 5 destinasi dengan safe-area padding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Bottom Sheet dialog interaktif dan transisi halus</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Feed personal: Lanjutkan Belajar, Agenda Sesi, & Tugas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. Core Capabilities ─── */}
        <section id="fitur" className="py-16 md:py-24 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono text-brand-400 uppercase tracking-wider font-semibold">
                Fitur Unggulan
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-text-primary">
                Peralatan Lengkap untuk Keunggulan Akademis
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Setiap modul dirancang secara modular dan terintegrasi untuk mendukung siklus belajar dari perencanaan awal hingga pengerjaan tugas akhir.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="p-5 rounded-2xl border border-border bg-surface space-y-3">
                <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold font-display text-text-primary">
                  Jadwal Kuliah Pintar
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Impor silabus otomatis melalui dokumen atau teks, deteksi interval bentrok secara matematis, dan optimasi jadwal belajar mandiri.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-5 rounded-2xl border border-border bg-surface space-y-3">
                <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold font-display text-text-primary">
                  AI Tutor Kontekstual
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Asisten belajar berbasis AI yang memahami konteks kurikulum dan materi perkuliahan Anda untuk penjelasan materi yang akurat.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-5 rounded-2xl border border-border bg-surface space-y-3">
                <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold font-display text-text-primary">
                  Kurikulum & Modul
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Struktur silabus bertingkat per topik, bab, dan sub-bab dengan pelacakan persentase progres belajar yang jelas.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-5 rounded-2xl border border-border bg-surface space-y-3">
                <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold font-display text-text-primary">
                  Playground & OCR Kode
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Uji algoritma langsung di editor kode terintegrasi dan ekstrak snippet kode dari foto catatan kuliah menggunakan OCR.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4. Learning Workflow ─── */}
        <section id="alur-kerja" className="py-16 md:py-24 border-b border-border bg-surface-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono text-brand-400 uppercase tracking-wider font-semibold">
                Alur Belajar Terstruktur
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-text-primary">
                Dari Rencana Kuliah Menjadi Penguasaan Materi
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              <div className="p-5 rounded-2xl border border-border bg-surface space-y-2">
                <span className="text-xs font-mono text-brand-400 font-bold">01. IMPOR</span>
                <h3 className="text-sm font-bold text-text-primary">Unggah Jadwal Kuliah</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Masukkan jadwal mata kuliah Anda untuk membentuk kalender semester terstruktur.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-surface space-y-2">
                <span className="text-xs font-mono text-brand-400 font-bold">02. ORGANISASI</span>
                <h3 className="text-sm font-bold text-text-primary">Kelola Materi & Modul</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Arsipkan slide presentasi, dokumen PDF, dan catatan penting per mata kuliah.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-surface space-y-2">
                <span className="text-xs font-mono text-brand-400 font-bold">03. PANTAU</span>
                <h3 className="text-sm font-bold text-text-primary">Lacak Tugas & Deadline</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Monitor tenggat waktu pengumpulan tugas dengan indikator prioritas dan status.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-surface space-y-2">
                <span className="text-xs font-mono text-brand-400 font-bold">04. BIMBINGAN</span>
                <h3 className="text-sm font-bold text-text-primary">Tanya Jawab AI Tutor</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Klarifikasi topik sulit kapan pun menggunakan asisten tutor cerdas 24/7.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. Call To Action (CTA) ─── */}
        <section className="py-20 md:py-28 border-b border-border bg-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto shadow-xs">
              <Compass className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-text-primary">
              Mulai Pengalaman Belajar yang Lebih Terstruktur Hari Ini.
            </h2>

            <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
              Bergabunglah dengan ekosistem Velqora untuk merapikan kurikulum, mengamankan jadwal kuliah, dan mempercepat pemahaman materi akademis Anda.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="text-sm font-semibold gap-2 shadow-xs">
                  <span>Buka Workspace Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-sm font-medium">
                  Masuk ke Akun
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Editorial Footer ─── */}
      <footer className="py-12 border-t border-border bg-background text-text-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-brand-500 flex items-center justify-center text-white font-mono font-bold text-xs">
                  V
                </div>
                <span className="font-display font-bold text-sm text-text-primary">
                  VELQORA
                </span>
              </div>
              <p className="text-xs text-text-tertiary">
                Autonomous Academic Workspace & Technology Platform.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs">
              <Link href="/dashboard" className="hover:text-text-primary transition-colors">
                Workspace
              </Link>
              <Link href="/dashboard/materi" className="hover:text-text-primary transition-colors">
                Materi
              </Link>
              <Link href="/dashboard/tugas" className="hover:text-text-primary transition-colors">
                Tugas
              </Link>
              <Link href="/dashboard/jadwal" className="hover:text-text-primary transition-colors">
                Jadwal
              </Link>
              <Link href="/dashboard/ai-tutor" className="hover:text-text-primary transition-colors">
                AI Tutor
              </Link>
              <Link href="/download" className="hover:text-text-primary transition-colors">
                Pasang PWA
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-text-tertiary">
            <div>
              &copy; {new Date().getFullYear()} Velqora Platform. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>TypeScript Strict</span>
              <span>•</span>
              <span>Supabase SSR</span>
              <span>•</span>
              <span>Tailwind CSS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
