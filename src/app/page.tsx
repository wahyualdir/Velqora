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
