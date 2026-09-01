import React from "react";
import Link from "next/link";
import {
  Calendar,
  Bot,
  Layers,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Laptop,
  Code2,
  Download,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export const metadata = {
  title: "Velqora — Platform Belajar & Manajemen Kuliah Terpadu Mahasiswa",
  description:
    "Platform ruang kerja akademis untuk mahasiswa Indonesia. Manajemen jadwal kuliah bebas bentrok, modul belajar multi-format, pelacakan tugas, dan bimbingan AI Tutor kontekstual.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-brand-500/20 selection:text-brand-300 font-sans antialiased">
      {/* ─── 1. Navigation Header ─── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="group focus-visible:outline-hidden">
              <Logo variant="sidebar" withTile />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-xs font-medium text-text-secondary">
            <a href="#arsitektur" className="hover:text-text-primary transition-colors whitespace-nowrap">
              Web & Mobile
            </a>
            <a href="#fitur" className="hover:text-text-primary transition-colors whitespace-nowrap">
              Fitur Lengkap
            </a>
            <a href="#alur-kerja" className="hover:text-text-primary transition-colors whitespace-nowrap">
              Cara Kerja
            </a>
            <Link
              href="/download"
              className="hover:text-text-primary transition-colors flex items-center gap-1.5 text-brand-400 font-semibold whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Aplikasi</span>
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs font-medium text-text-secondary hover:text-text-primary">
                Masuk
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="text-xs font-semibold gap-1.5 shadow-xs bg-brand-600 hover:bg-brand-500 text-white">
                <span>Buka Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ─── 2. Hero Section dengan Dual-Surface Live Mockup ─── */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border overflow-hidden">
          {/* Decorative Bookshelf Line-Art Background */}
          <BookshelfHeroBackground />

          {/* Subtle Ambient Depth */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Hero Copywriting */}
            <div className="max-w-3xl mx-auto text-center space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-text-secondary text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Velqora v1.1 — Dual Experience untuk Laptop & Ponsel</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-text-primary leading-[1.18]">
                Semua Urusan Kuliah, Rapi dan Terkendali dalam Satu Ruang Kerja.
              </h1>

              <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
                Bebas jadwal kuliah bentrok, deadline tugas yang terlewat, dan slide materi yang tercecer. Velqora memadukan workspace laptop yang produktif dengan aplikasi ponsel yang siap pakai di saku Anda.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link href="/dashboard">
                  <Button size="lg" className="text-sm font-semibold gap-2 shadow-xs bg-brand-600 hover:bg-brand-500 text-white px-5">
                    <span>Mulai Belajar Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/download">
                  <Button variant="outline" size="lg" className="text-sm font-medium gap-2 border-border hover:bg-surface text-text-primary">
                    <Download className="w-4 h-4 text-brand-400" />
                    <span>Pasang di HP / Laptop (PWA)</span>
                  </Button>
                </Link>
              </div>

              {/* Integrated Trust & Platform Badges */}
              <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 pt-3 text-xs text-text-tertiary">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Isolasi Data Pribadi (RLS)
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Bebas Iklan & Pelacak
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-brand-400" />
                  Bimbingan AI Kontekstual
                </span>
              </div>
            </div>

            {/* ─── Hero Visual Showcase (Dual-Surface Side-by-Side Mockup) ─── */}
            <div className="relative pt-4 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                {/* 1. Desktop Window (Layar Lebar, Dark Theme, 8-col span) */}
                <div className="lg:col-span-8 rounded-xl border border-border bg-surface shadow-2xl overflow-hidden">
                  {/* Browser Window Header */}
                  <div className="h-9 px-4 bg-surface-secondary border-b border-border flex items-center justify-between text-xs text-text-tertiary">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="px-3 py-0.5 rounded-md bg-surface border border-border text-[11px] font-mono text-text-secondary truncate max-w-[200px]">
                      velqora.web.id/dashboard
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Web Desktop
                    </span>
                  </div>

                  {/* Window Content: Real Academic Dashboard Snapshot */}
                  <div className="p-4 sm:p-5 grid grid-cols-12 gap-4 bg-background/50">
                    {/* Mini Sidebar */}
                    <div className="col-span-3 hidden sm:flex flex-col gap-1.5 pr-3 border-r border-border text-xs">
                      <div className="px-2 py-1 rounded-md bg-brand-600/15 text-brand-400 font-semibold flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Jadwal Kuliah</span>
                      </div>
                      <div className="px-2 py-1 rounded-md text-text-secondary hover:bg-surface flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-text-tertiary" />
                        <span>Modul & Slide</span>
                      </div>
                      <div className="px-2 py-1 rounded-md text-text-secondary hover:bg-surface flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-text-tertiary" />
                        <span>Tugas Kuliah</span>
                      </div>
                      <div className="px-2 py-1 rounded-md text-text-secondary hover:bg-surface flex items-center gap-2">
                        <Bot className="w-3.5 h-3.5 text-text-tertiary" />
                        <span>AI Tutor</span>
                      </div>
                    </div>

                    {/* Mini Main Workspace Table */}
                    <div className="col-span-12 sm:col-span-9 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-text-primary">Semester Genap • 21 SKS</p>
                          <p className="text-[11px] text-text-tertiary">Jadwal Kuliah Aktif (Bebas Konflik)</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                          ✓ 0 Bentrok
                        </span>
                      </div>

                      {/* Mini Schedule Items */}
                      <div className="space-y-1.5 text-xs">
                        <div className="p-2 rounded-lg bg-surface border border-border flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-text-primary truncate">Struktur Data & Algoritma</p>
                            <p className="text-[11px] text-text-tertiary">Senin • 08:00 - 10:30 • R. Lab 3</p>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-300 shrink-0">
                            3 SKS
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-surface border border-border flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-text-primary truncate">Sistem Basis Data Terdistribusi</p>
                            <p className="text-[11px] text-text-tertiary">Rabu • 13:00 - 15:30 • Gedung B201</p>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-300 shrink-0">
                            3 SKS
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Mobile Companion Mockup (Layar HP, 4-col span) */}
                <div className="lg:col-span-4 max-w-xs mx-auto lg:max-w-none w-full rounded-2xl border-2 border-border bg-slate-950 p-2 shadow-2xl">
                  {/* Phone Bezel Top */}
                  <div className="w-20 h-3 bg-slate-900 rounded-full mx-auto mb-2" />

                  {/* Phone Screen (Clean Pure Surface) */}
                  <div className="rounded-xl bg-slate-900 border border-border p-3.5 space-y-3 text-text-primary">
                    <div className="flex items-center justify-between text-xs border-b border-border/80 pb-2">
                      <span className="font-bold text-text-primary flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-brand-400" />
                        Velqora App
                      </span>
                      <span className="text-[10px] text-text-tertiary">PWA Standalone</span>
                    </div>

                    {/* Today's Quick Agenda Card */}
                    <div className="p-2.5 rounded-lg bg-surface border border-brand-500/30 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-brand-400 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Hari Ini
                        </span>
                        <span className="text-[10px] text-emerald-400 font-medium">Kuliah Berikutnya</span>
                      </div>
                      <p className="text-xs font-bold text-text-primary">Kalkulus Lanjut & Vektor</p>
                      <p className="text-[10px] text-text-secondary">10:45 WIB • R. 402</p>
                    </div>

                    {/* Task Snapshot */}
                    <div className="p-2 rounded-lg bg-surface-secondary border border-border flex items-center justify-between text-xs">
                      <div>
                        <p className="text-[11px] font-semibold text-text-primary">Tugas 2: ERD Database</p>
                        <p className="text-[10px] text-rose-400">Deadline: Besok 23:59</p>
                      </div>
                      <span className="w-4 h-4 rounded-full border border-border flex items-center justify-center text-[10px] text-text-tertiary">
                        !
                      </span>
                    </div>

                    {/* Phone Bottom Thumb Navigation */}
                    <div className="pt-2 border-t border-border flex items-center justify-around text-[10px] text-text-tertiary">
                      <span className="text-brand-400 font-semibold">Beranda</span>
                      <span>Materi</span>
                      <span>Tugas</span>
                      <span>Jadwal</span>
                      <span>AI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. Dual Product Architecture (Workbench Comparison) ─── */}
        <section id="arsitektur" className="py-16 md:py-24 border-b border-border bg-surface-secondary/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-text-primary">
                Satu Akun Terhubung. Dua Pengalaman yang Disesuaikan.
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Kami tidak memaksakan satu tampilan sempit untuk semua perangkat. Laptop untuk fokus pengerjaan mendalam, ponsel untuk aksi cepat di perjalanan kampus.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product A: Web Desktop */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-display text-text-primary">
                        Velqora Web Desktop
                      </h3>
                      <p className="text-xs text-text-tertiary">
                        Ruang Kerja Layar Lebar & Pengerjaan Tugas
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  Dioptimalkan untuk sesi belajar panjang di laptop atau PC dengan navigasi sidebar lengkap, multi-kolom teratur, tabel data dengan sorting instan, dan editor kode split-pane.
                </p>

                <div className="space-y-2.5 pt-2 border-t border-border text-xs text-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <span>Mode gelap profesional yang tenang, ramah mata untuk belajar larut malam</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <span>Pencarian cepat berkas dan modul dengan pintasan keyboard <kbd className="px-1.5 py-0.5 rounded bg-surface-secondary border border-border font-mono text-[10px]">Ctrl + K</kbd></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <span>Impor jadwal otomatis dari file Excel/CSV/PDF silabus perkuliahan</span>
                  </div>
                </div>
              </div>

              {/* Product B: Mobile Companion */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-display text-text-primary">
                        Velqora Mobile App
                      </h3>
                      <p className="text-xs text-text-tertiary">
                        Pendamping Harian Ringkas di Saku Anda
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  Pengalaman aplikasi mobile native tanpa perlu unduh dari app store. Cukup pasang via PWA, siap memantau jam masuk kelas, ruangan kuliah, dan pengingat deadline tugas.
                </p>

                <div className="space-y-2.5 pt-2 border-t border-border text-xs text-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Navigasi bawah ergonomis yang mudah dijangkau dengan satu ibu jari</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Penyimpanan cache offline (buka jadwal dan materi saat sinyal kampus lemah)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Dialog sheet interaktif yang nyaman dibuka dan ditutup dengan gesekan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4. Fitur Utama (Bento Grid dengan Live Micro-Previews) ─── */}
        <section id="fitur" className="py-16 md:py-24 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-text-primary">
                Peralatan Belajar Lengkap untuk Mahasiswa
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Dirancang berdasarkan tantangan nyata perkuliahan: dari menyusun KRS, merapikan materi slide dosen, hingga tanya konsep rumit ke asisten AI.
              </p>
            </div>

            {/* Bento Grid Hierarchy */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 (Besar - 2 Kolom): Jadwal Cerdas & Deteksi Bentrok */}
              <div className="md:col-span-2 p-6 rounded-2xl border border-border bg-surface flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold font-display text-text-primary">
                      Jadwal Kuliah Cerdas & Deteksi Bentrok Otomatis
                    </h3>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Sistem mendeteksi tumpang-tindih jam perkuliahan secara matematis, mengelompokkan mata kuliah per hari, dan menghitung total beban SKS Anda secara otomatis.
                  </p>
                </div>

                {/* Micro Visual: Schedule Timeline Snippet */}
                <div className="p-3.5 rounded-xl bg-background border border-border space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-text-tertiary">
                    <span className="font-semibold text-text-primary">Hari Selasa • 3 Sesi Kuliah</span>
                    <span className="text-emerald-400 font-medium">Status: Optimal</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-2 rounded-lg bg-surface border border-border">
                      <p className="text-[10px] text-text-tertiary">08:00 - 09:40</p>
                      <p className="font-bold text-text-primary truncate">Pemrograman Web</p>
                    </div>
                    <div className="p-2 rounded-lg bg-surface border border-border">
                      <p className="text-[10px] text-text-tertiary">10:00 - 11:40</p>
                      <p className="font-bold text-text-primary truncate">Jaringan Komputer</p>
                    </div>
                    <div className="p-2 rounded-lg bg-surface border border-border">
                      <p className="text-[10px] text-text-tertiary">13:00 - 15:30</p>
                      <p className="font-bold text-text-primary truncate">Kecerdasan Buatan</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 (1 Kolom): AI Tutor Kontekstual */}
              <div className="p-6 rounded-2xl border border-border bg-surface flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                      <Bot className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold font-display text-text-primary">
                      AI Tutor Kontekstual
                    </h3>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Tanya konsep sulit kapan pun. AI memahami silabus dan konteks materi kuliah Anda.
                  </p>
                </div>

                {/* Micro Visual: Chat Bubble Snippet */}
                <div className="p-3 rounded-xl bg-background border border-border space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-surface border border-border text-[11px] text-text-secondary">
                    <span className="font-semibold text-text-primary">Kamu:</span> Apa beda Dijkstra vs Bellman-Ford?
                  </div>
                  <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20 text-[11px] text-brand-300">
                    <span className="font-semibold text-brand-200">AI Tutor:</span> Dijkstra lebih cepat O(E + V log V), tapi Bellman-Ford bisa menangani bobot negatif...
                  </div>
                </div>
              </div>

              {/* Card 3 (1 Kolom): Arsip Modul & Berkas Kuliah */}
              <div className="p-6 rounded-2xl border border-border bg-surface flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                      <Layers className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold font-display text-text-primary">
                      Arsip Modul Multi-Format
                    </h3>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Satukan slide PDF, rangkuman DOCX, dan catatan kuliah per mata kuliah dalam folder terstruktur.
                  </p>
                </div>

                {/* Micro Visual: File Tags */}
                <div className="p-3 rounded-xl bg-background border border-border grid grid-cols-2 gap-1.5 text-[11px]">
                  <span className="px-2 py-1 rounded bg-surface border border-border text-rose-300 font-mono text-center">.PDF Slides</span>
                  <span className="px-2 py-1 rounded bg-surface border border-border text-blue-300 font-mono text-center">.DOCX Catatan</span>
                  <span className="px-2 py-1 rounded bg-surface border border-border text-amber-300 font-mono text-center">.PPTX Dosen</span>
                  <span className="px-2 py-1 rounded bg-surface border border-border text-emerald-300 font-mono text-center">.PY Code</span>
                </div>
              </div>

              {/* Card 4 (Besar - 2 Kolom): Playground Kode & OCR Catatan */}
              <div className="md:col-span-2 p-6 rounded-2xl border border-border bg-surface flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold font-display text-text-primary">
                      Playground Kode & OCR Catatan Papan Tulis
                    </h3>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Uji snippet kode langsung di editor terintegrasi atau pindai foto papan tulis catatan dosen menjadi teks yang bisa diedit secara otomatis.
                  </p>
                </div>

                {/* Micro Visual: Code Editor Snippet */}
                <div className="p-3 rounded-xl bg-background border border-border space-y-1.5 font-mono text-[11px] text-text-secondary">
                  <div className="flex items-center justify-between text-[10px] text-text-tertiary border-b border-border pb-1">
                    <span>quick_sort.py</span>
                    <span className="text-emerald-400">● Eksekusi Sukses (0.04s)</span>
                  </div>
                  <pre className="text-text-primary overflow-x-auto">
                    <code>{`def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    # Ekstraksi OCR Otomatis`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. Alur Belajar Terstruktur (Connected Step Timeline) ─── */}
        <section id="alur-kerja" className="py-16 md:py-24 border-b border-border bg-surface-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-text-primary">
                Empat Langkah Menuju Kuliah yang Lebih Rapi
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Dari semester baru dimulai hingga persiapan ujian akhir, Velqora mendampingi setiap tahap studi Anda.
              </p>
            </div>

            {/* Connected Horizontal Timeline Track */}
            <div className="relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-6 left-12 right-12 h-0.5 bg-border -z-0" />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                {/* Step 1 */}
                <div className="p-5 rounded-xl border border-border bg-surface space-y-3">
                  <div className="w-10 h-10 rounded-full bg-background border-2 border-brand-500 text-brand-400 font-mono font-bold text-sm flex items-center justify-center">
                    01
                  </div>
                  <h3 className="text-sm font-bold text-text-primary">Unggah Jadwal Kuliah</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Masukkan jadwal atau unggah berkas silabus untuk membentuk kalender semester otomatis.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-xl border border-border bg-surface space-y-3">
                  <div className="w-10 h-10 rounded-full bg-background border-2 border-brand-500 text-brand-400 font-mono font-bold text-sm flex items-center justify-center">
                    02
                  </div>
                  <h3 className="text-sm font-bold text-text-primary">Organisasi Modul Kuliah</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Simpan slide dosen, rangkuman materi, dan dokumen referensi per mata kuliah.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-xl border border-border bg-surface space-y-3">
                  <div className="w-10 h-10 rounded-full bg-background border-2 border-brand-500 text-brand-400 font-mono font-bold text-sm flex items-center justify-center">
                    03
                  </div>
                  <h3 className="text-sm font-bold text-text-primary">Pantau Tugas & Deadline</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Lacak tenggat pengumpulan tugas kuliah dengan indikator prioritas agar tidak ada yang terlewat.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-5 rounded-xl border border-border bg-surface space-y-3">
                  <div className="w-10 h-10 rounded-full bg-background border-2 border-brand-500 text-brand-400 font-mono font-bold text-sm flex items-center justify-center">
                    04
                  </div>
                  <h3 className="text-sm font-bold text-text-primary">Bimbingan AI Kapan Saja</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Tanyakan rumus, kuis latihan, dan pembahasan topik rumit langsung ke AI Tutor 24 jam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 6. Call To Action (Focused Workspace Invitation) ─── */}
        <section className="py-20 md:py-28 border-b border-border bg-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mulai Gratis Tanpa Syarat Rumit</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-text-primary">
              Mulai Semester Anda dengan Ruang Belajar yang Teratur.
            </h2>

            <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
              Bergabunglah dengan Velqora hari ini. Nikmati kemudahan mengelola jadwal, materi, dan bimbingan belajar langsung dari laptop dan ponsel Anda.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <Link href="/dashboard">
                <Button size="lg" className="text-sm font-semibold gap-2 shadow-xs bg-brand-600 hover:bg-brand-500 text-white px-6">
                  <span>Buka Workspace Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-sm font-medium border-border hover:bg-surface-secondary text-text-primary">
                  Masuk ke Akun
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─── 7. Editorial Footer ─── */}
      <footer className="py-12 border-t border-border bg-background text-text-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <Logo variant="sidebar" withTile showSubtitle={false} />
              <p className="text-xs text-text-tertiary">
                Platform Pembelajaran & Manajemen Kuliah Mahasiswa.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs">
              <Link href="/dashboard" className="hover:text-text-primary transition-colors">
                Workspace
              </Link>
              <Link href="/dashboard/materi" className="hover:text-text-primary transition-colors">
                Materi Kuliah
              </Link>
              <Link href="/dashboard/tugas" className="hover:text-text-primary transition-colors">
                Tugas & Deadline
              </Link>
              <Link href="/dashboard/jadwal" className="hover:text-text-primary transition-colors">
                Jadwal Kuliah
              </Link>
              <Link href="/dashboard/ai-tutor" className="hover:text-text-primary transition-colors">
                AI Tutor
              </Link>
              <Link href="/download" className="hover:text-text-primary transition-colors font-medium text-brand-400">
                Unduh PWA
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-text-tertiary">
            <div>
              &copy; {new Date().getFullYear()} Velqora. Seluruh hak cipta dilindungi.
            </div>
            <div className="flex items-center gap-3">
              <span>Aplikasi Web & Mobile PWA</span>
              <span>•</span>
              <span>Data Aman Terisolasi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BookshelfHeroBackground() {
  return (
    <svg
      aria-hidden="true"
      className="absolute top-0 left-0 w-full h-[260px] sm:h-[300px] md:h-[360px] -z-10 pointer-events-none opacity-[0.06] text-text-primary [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)] select-none"
      viewBox="0 0 1440 280"
      fill="none"
      preserveAspectRatio="xMidYMin slice"
    >
      <g strokeLinecap="round" strokeLinejoin="round">
        <line x1="0" y1="75" x2="1440" y2="75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="0" y1="78" x2="1440" y2="78" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" opacity="0.4" />
        <line x1="0" y1="165" x2="1440" y2="165" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="0" y1="168" x2="1440" y2="168" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" opacity="0.4" />
        <line x1="0" y1="255" x2="1440" y2="255" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="0" y1="258" x2="1440" y2="258" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" opacity="0.4" />
        <g transform="rotate(-9 32 75)">
          <rect x="24" y="30" width="15" height="45" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        </g>
        <rect x="58" y="34" width="13" height="41" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="75" y="38" width="10" height="37" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="87" y="40" width="11" height="35" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="102" y="41" width="17" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="104" y1="49" x2="117" y2="49" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="104" y1="52" x2="117" y2="52" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="121" y="36" width="9" height="39" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="134" y="28" width="13" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 140.5 75 L 140.5 81 L 143.5 78" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
        <rect x="151" y="26" width="11" height="49" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="174.0" y="67.0" width="37.0" height="8.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="176.5" y="57.0" width="32.0" height="10.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="178.0" y="49.0" width="29.0" height="8.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="222" y="41" width="10" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="235" y="26" width="10" height="49" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="247" y="40" width="10" height="35" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="259" y="38" width="10" height="37" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="273" y="32" width="11" height="43" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="288" y="31" width="10" height="44" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="302" y="33" width="15" height="42" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <g transform="rotate(-10 333 75)">
          <rect x="325" y="29" width="15" height="46" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        </g>
        <rect x="361.0" y="65.0" width="43.0" height="10.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="363.5" y="54.0" width="38.0" height="11.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="366.0" y="43.0" width="33.0" height="11.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <path d="M 427 75 L 441 75 L 443 63 L 425 63 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M 434 63 Q 430 53 428 55 Q 432 60 434 63" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M 434 63 Q 438 52 440 55 Q 437 61 434 63" stroke="currentColor" strokeWidth="1" fill="none" />
        <rect x="455" y="43" width="12" height="32" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="470" y="28" width="15" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="487" y="42" width="12" height="33" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="501" y="29" width="10" height="46" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="513" y="32" width="15" height="43" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 546 75 L 560 75 L 562 63 L 544 63 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M 553 63 Q 549 53 547 55 Q 551 60 553 63" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M 553 63 Q 557 52 559 55 Q 556 61 553 63" stroke="currentColor" strokeWidth="1" fill="none" />
        <rect x="574" y="39" width="13" height="36" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="590" y="35" width="9" height="40" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="603" y="27" width="17" height="48" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="622" y="41" width="9" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="634" y="36" width="15" height="39" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="636" y1="45" x2="647" y2="45" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="636" y1="49" x2="647" y2="49" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="653" y="41" width="11" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="667" y="37" width="17" height="38" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="694" y="27" width="15" height="48" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="696" y1="39" x2="707" y2="39" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="696" y1="43" x2="707" y2="43" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="712" y="43" width="16" height="32" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="730" y="28" width="15" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="748" y="39" width="17" height="36" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="750" y1="48" x2="763" y2="48" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="750" y1="51" x2="763" y2="51" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="767" y="28" width="14" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="783" y="35" width="9" height="40" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="794" y="41" width="9" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="813" y="33" width="15" height="42" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 820.5 75 L 820.5 81 L 823.5 78" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
        <rect x="830" y="28" width="13" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="845" y="37" width="10" height="38" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="858" y="30" width="17" height="45" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="878" y="27" width="11" height="48" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="899" y="38" width="10" height="37" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="913" y="41" width="13" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="915" y1="49" x2="924" y2="49" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="915" y1="52" x2="924" y2="52" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="929" y="27" width="9" height="48" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="946" y="42" width="11" height="33" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="960" y="39" width="11" height="36" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="974" y="41" width="17" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="993" y="26" width="12" height="49" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1008" y="33" width="16" height="42" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="1010" y1="43" x2="1022" y2="43" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="1010" y1="47" x2="1022" y2="47" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="1027" y="29" width="10" height="46" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1039" y="33" width="15" height="42" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="1041" y1="43" x2="1052" y2="43" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="1041" y1="47" x2="1052" y2="47" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="1064" y="28" width="13" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1081" y="41" width="17" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1101" y="43" width="16" height="32" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="1103" y1="51" x2="1115" y2="51" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="1103" y1="54" x2="1115" y2="54" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="1119" y="34" width="12" height="41" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1133" y="41" width="14" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 1140 75 L 1140 81 L 1143 78" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
        <rect x="1151" y="42" width="15" height="33" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1178" y="31" width="16" height="44" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1196" y="34" width="9" height="41" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1208" y="34" width="12" height="41" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="1210" y1="44" x2="1218" y2="44" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="1210" y1="48" x2="1218" y2="48" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="1224" y="29" width="10" height="46" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1238" y="26" width="9" height="49" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1249" y="24" width="14" height="51" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1266" y="32" width="17" height="43" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1294" y="27" width="17" height="48" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="1296" y1="39" x2="1309" y2="39" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="1296" y1="43" x2="1309" y2="43" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="1313" y="43" width="15" height="32" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="1315" y1="51" x2="1326" y2="51" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="1315" y1="54" x2="1326" y2="54" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="1332" y="42" width="14" height="33" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1354" y="35" width="11" height="40" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1367" y="26" width="17" height="49" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1387" y="38" width="13" height="37" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="1389" y1="47" x2="1398" y2="47" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="1389" y1="50" x2="1398" y2="50" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <path d="M 1418 75 L 1432 75 L 1434 63 L 1416 63 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M 1425 63 Q 1421 53 1419 55 Q 1423 60 1425 63" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M 1425 63 Q 1429 52 1431 55 Q 1428 61 1425 63" stroke="currentColor" strokeWidth="1" fill="none" />
        <rect x="18" y="131" width="18" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="38" y="118" width="17" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="57" y="120" width="18" height="45" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="59" y1="131" x2="73" y2="131" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="59" y1="135" x2="73" y2="135" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="79" y="118" width="15" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="105" y="126" width="17" height="39" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="126" y="131" width="13" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="128" y1="139" x2="137" y2="139" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="128" y1="142" x2="137" y2="142" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="141" y="120" width="18" height="45" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 150 165 L 150 171 L 153 168" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
        <rect x="163" y="127" width="11" height="38" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="177" y="134" width="13" height="31" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="198" y="124" width="18" height="41" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="218" y="126" width="12" height="39" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 224 165 L 224 171 L 227 168" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
        <rect x="234" y="112" width="10" height="53" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="253" y="127" width="18" height="38" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="255" y1="136" x2="269" y2="136" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="255" y1="140" x2="269" y2="140" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="275" y="120" width="18" height="45" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="295" y="134" width="14" height="31" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="311" y="113" width="12" height="52" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="327" y="113" width="11" height="52" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="345" y="127" width="16" height="38" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="347" y1="136" x2="359" y2="136" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="347" y1="140" x2="359" y2="140" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="365" y="119" width="8" height="46" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="377" y="132" width="13" height="33" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 383.5 165 L 383.5 171 L 386.5 168" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
        <rect x="394" y="128" width="11" height="37" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="418" y="128" width="11" height="37" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="433" y="126" width="18" height="39" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 442 165 L 442 171 L 445 168" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
        <rect x="453" y="129" width="17" height="36" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="455" y1="138" x2="468" y2="138" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="455" y1="141" x2="468" y2="141" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="473" y="134" width="17" height="31" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 481.5 165 L 481.5 171 L 484.5 168" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
        <rect x="493" y="120" width="17" height="45" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="514" y="120" width="16" height="45" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="539" y="133" width="11" height="32" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="553" y="128" width="13" height="37" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="555" y1="137" x2="564" y2="137" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="555" y1="140" x2="564" y2="140" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="568" y="112" width="13" height="53" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="585" y="129" width="11" height="36" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="599" y="112" width="16" height="53" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="626" y="133" width="13" height="32" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 632.5 165 L 632.5 171 L 635.5 168" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
        <rect x="641" y="125" width="15" height="40" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="660" y="116" width="11" height="49" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="673" y="129" width="12" height="36" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="689" y="135" width="9" height="30" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="700" y="114" width="8" height="51" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="716" y="129" width="9" height="36" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="729" y="133" width="9" height="32" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="741" y="121" width="10" height="44" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="755" y="115" width="13" height="50" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="757" y1="127" x2="766" y2="127" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="757" y1="132" x2="766" y2="132" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="781.0" y="156.0" width="35.0" height="9.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="783.5" y="145.0" width="30.0" height="11.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="827" y="123" width="13" height="42" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="829" y1="133" x2="838" y2="133" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="829" y1="137" x2="838" y2="137" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="844" y="116" width="11" height="49" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="857" y="125" width="17" height="40" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="859" y1="135" x2="872" y2="135" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="859" y1="139" x2="872" y2="139" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="877" y="123" width="11" height="42" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <g transform="rotate(-11 906 165)">
          <rect x="898" y="126" width="12" height="39" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        </g>
        <rect x="929" y="122" width="14" height="43" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="946" y="125" width="11" height="40" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="960" y="121" width="9" height="44" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="971" y="133" width="12" height="32" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="973" y1="141" x2="981" y2="141" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="973" y1="144" x2="981" y2="144" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="985" y="127" width="15" height="38" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="987" y1="136" x2="998" y2="136" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="987" y1="140" x2="998" y2="140" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="1002" y="131" width="13" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1018" y="113" width="14" height="52" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="1020" y1="126" x2="1030" y2="126" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="1020" y1="131" x2="1030" y2="131" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="1044" y="113" width="15" height="52" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1062" y="114" width="15" height="51" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="1064" y1="126" x2="1075" y2="126" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="1064" y1="131" x2="1075" y2="131" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="1080" y="114" width="15" height="51" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1097" y="128" width="12" height="37" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1119" y="127" width="9" height="38" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1132" y="132" width="18" height="33" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1152" y="128" width="14" height="37" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 1188 165 L 1202 165 L 1204 153 L 1186 153 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M 1195 153 Q 1191 143 1189 145 Q 1193 150 1195 153" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M 1195 153 Q 1199 142 1201 145 Q 1198 151 1195 153" stroke="currentColor" strokeWidth="1" fill="none" />
        <rect x="1216" y="131" width="13" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1233" y="114" width="8" height="51" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1245" y="131" width="13" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 1251.5 165 L 1251.5 171 L 1254.5 168" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
        <rect x="1261" y="133" width="10" height="32" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1275" y="132" width="11" height="33" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <g transform="rotate(-13 1302 165)">
          <rect x="1294" y="123" width="14" height="42" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        </g>
        <rect x="1328" y="125" width="16" height="40" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1346" y="119" width="12" height="46" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1360" y="130" width="9" height="35" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1371" y="112" width="14" height="53" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 1378 165 L 1378 171 L 1381 168" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
        <rect x="1389" y="126" width="9" height="39" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1401" y="117" width="14" height="48" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="1403" y1="129" x2="1413" y2="129" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="1403" y1="133" x2="1413" y2="133" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="19" y="200" width="10" height="55" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="31" y="220" width="14" height="35" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="49" y="206" width="18" height="49" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="73.0" y="245.0" width="37.0" height="10.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="75.5" y="236.0" width="32.0" height="9.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="122.0" y="245.0" width="35.0" height="10.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="124.5" y="234.0" width="30.0" height="11.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="126.0" y="224.0" width="27.0" height="10.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="165.0" y="246.0" width="37.0" height="9.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="167.0" y="236.0" width="33.0" height="10.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="168.0" y="227.0" width="31.0" height="9.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <path d="M 217 255 L 229 255 L 217 233 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <rect x="241" y="208" width="15" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="243" y1="219" x2="254" y2="219" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="243" y1="224" x2="254" y2="224" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="259" y="206" width="11" height="49" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="274" y="204" width="19" height="51" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="297" y="212" width="19" height="43" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="299" y1="222" x2="314" y2="222" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="299" y1="227" x2="314" y2="227" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="318" y="212" width="9" height="43" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="330" y="208" width="19" height="47" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="362" y="205" width="18" height="50" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="384" y="207" width="15" height="48" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 391.5 255 L 391.5 261 L 394.5 258" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
        <rect x="401" y="217" width="10" height="38" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="415" y="200" width="15" height="55" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="417" y1="213" x2="428" y2="213" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="417" y1="219" x2="428" y2="219" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="441" y="211" width="11" height="44" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="455" y="200" width="12" height="55" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="471" y="201" width="18" height="54" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="473" y1="214" x2="487" y2="214" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="473" y1="219" x2="487" y2="219" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="492" y="207" width="17" height="48" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="511" y="207" width="9" height="48" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="524" y="209" width="9" height="46" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="543.0" y="244.0" width="41.0" height="11.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="545.0" y="235.0" width="37.0" height="9.0" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <rect x="596" y="201" width="13" height="54" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="598" y1="214" x2="607" y2="214" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="598" y1="219" x2="607" y2="219" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="612" y="212" width="14" height="43" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="629" y="201" width="15" height="54" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 636.5 255 L 636.5 261 L 639.5 258" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
        <rect x="648" y="221" width="9" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="666" y="203" width="11" height="52" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="679" y="216" width="18" height="39" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="701" y="210" width="12" height="45" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="724" y="211" width="16" height="44" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="726" y1="222" x2="738" y2="222" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="726" y1="226" x2="738" y2="226" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="742" y="213" width="17" height="42" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="744" y1="223" x2="757" y2="223" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="744" y1="227" x2="757" y2="227" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="761" y="221" width="18" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="783" y="219" width="18" height="36" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="805" y="221" width="13" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="821" y="213" width="12" height="42" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="843" y="213" width="17" height="42" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="845" y1="223" x2="858" y2="223" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="845" y1="227" x2="858" y2="227" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="862" y="205" width="16" height="50" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="882" y="209" width="11" height="46" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="897" y="212" width="13" height="43" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="899" y1="222" x2="908" y2="222" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="899" y1="227" x2="908" y2="227" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="920" y="219" width="14" height="36" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="936" y="210" width="10" height="45" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="949" y="219" width="13" height="36" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="964" y="201" width="10" height="54" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="982" y="212" width="11" height="43" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="996" y="209" width="16" height="46" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1014" y="212" width="17" height="43" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 1022.5 255 L 1022.5 261 L 1025.5 258" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
        <rect x="1035" y="221" width="19" height="34" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="1037" y1="229" x2="1052" y2="229" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="1037" y1="232" x2="1052" y2="232" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="1057" y="213" width="12" height="42" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1081" y="213" width="17" height="42" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="1083" y1="223" x2="1096" y2="223" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="1083" y1="227" x2="1096" y2="227" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="1101" y="203" width="16" height="52" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1121" y="205" width="12" height="50" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1137" y="219" width="11" height="36" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1150" y="203" width="18" height="52" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="1152" y1="216" x2="1166" y2="216" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="1152" y1="221" x2="1166" y2="221" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="1170" y="200" width="13" height="55" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="1172" y1="213" x2="1181" y2="213" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="1172" y1="219" x2="1181" y2="219" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="1186" y="204" width="17" height="51" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 1222 255 L 1234 255 L 1222 233 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <rect x="1246" y="201" width="12" height="54" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="1248" y1="214" x2="1256" y2="214" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <line x1="1248" y1="219" x2="1256" y2="219" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <rect x="1262" y="202" width="9" height="53" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1275" y="219" width="9" height="36" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1288" y="206" width="13" height="49" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 1322 255 L 1336 255 L 1338 243 L 1320 243 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M 1329 243 Q 1325 233 1323 235 Q 1327 240 1329 243" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M 1329 243 Q 1333 232 1335 235 Q 1332 241 1329 243" stroke="currentColor" strokeWidth="1" fill="none" />
        <rect x="1350" y="204" width="19" height="51" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1373" y="210" width="17" height="45" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1392" y="220" width="17" height="35" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1411" y="214" width="11" height="41" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      </g>
    </svg>
  );
}
