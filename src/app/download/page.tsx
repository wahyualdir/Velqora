"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Download,
  Smartphone,
  Laptop,
  Apple,
  Chrome,
  CheckCircle2,
  Share2,
  PlusSquare,
  ArrowLeft,
  Sparkles,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useExperience } from "@/context/experience-context";
import { toast } from "sonner";

export default function DownloadAppPage() {
  const { isPwaStandalone, canInstallPwa, promptInstallPwa, isMobile } = useExperience();
  const [activePlatform, setActivePlatform] = useState<"android" | "ios" | "desktop">(
    isMobile ? "android" : "desktop"
  );

  const handleInstallClick = async () => {
    if (canInstallPwa) {
      const installed = await promptInstallPwa();
      if (installed) {
        toast.success("Velqora berhasil dipasang ke perangkat Anda!");
      }
    } else {
      toast.info("Gunakan menu browser untuk memasang aplikasi ke layar utama.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-border/80 bg-surface/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo variant="sidebar" />
          </Link>

          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-xs gap-1.5 text-text-secondary">
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Workspace</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full flex-1 space-y-12">
        {/* Title Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 text-brand-500 dark:text-brand-400 border border-brand-500/25">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Progressive Web Application (PWA)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-text-primary">
            Dapatkan Velqora di Semua Perangkat
          </h1>

          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Bawa ruang kerja pembelajaran dan asisten AI Anda ke mana saja dengan pengalaman aplikasi native yang cepat, ringan, dan selalu tersinkronisasi.
          </p>

          {/* Standalone Active Banner */}
          {isPwaStandalone ? (
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Aplikasi Velqora sudah terpasang dan aktif di perangkat ini.</span>
            </div>
          ) : (
            canInstallPwa && (
              <div className="pt-2">
                <Button
                  size="lg"
                  onClick={handleInstallClick}
                  className="h-12 px-6 rounded-xl font-bold text-sm shadow-2xs bg-brand-600 hover:bg-brand-700 text-white gap-2 active:scale-98 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Pasang Aplikasi Velqora Sekarang</span>
                </Button>
              </div>
            )
          )}
        </div>

        {/* Platform Selection Tabs */}
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-surface border border-border max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setActivePlatform("android")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePlatform === "android"
                  ? "bg-brand-600 text-white shadow-2xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Android</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePlatform("ios")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePlatform === "ios"
                  ? "bg-brand-600 text-white shadow-2xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Apple className="w-4 h-4" />
              <span>iPhone / iPad</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePlatform("desktop")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePlatform === "desktop"
                  ? "bg-brand-600 text-white shadow-2xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>Desktop</span>
            </button>
          </div>

          {/* Platform Specific Guidance Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-surface shadow-xs space-y-6">
            {activePlatform === "android" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                    <Chrome className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-primary">
                      Panduan Instalasi Android (Google Chrome)
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Pasang Velqora sebagai Progressive Web App langsung dari browser.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border/80 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-500 font-bold font-mono flex items-center justify-center text-xs">
                      1
                    </span>
                    <h4 className="font-semibold text-text-primary">Buka Menu Browser</h4>
                    <p className="text-text-secondary leading-relaxed">
                      Ketuk ikon titik tiga (⋮) di pojok kanan atas browser Google Chrome.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border/80 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-500 font-bold font-mono flex items-center justify-center text-xs">
                      2
                    </span>
                    <h4 className="font-semibold text-text-primary">Pilih "Instal Aplikasi"</h4>
                    <p className="text-text-secondary leading-relaxed">
                      Pilih menu "Instal aplikasi" atau "Tambahkan ke Layar Utama".
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border/80 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-500 font-bold font-mono flex items-center justify-center text-xs">
                      3
                    </span>
                    <h4 className="font-semibold text-text-primary">Buka dari Layar Utama</h4>
                    <p className="text-text-secondary leading-relaxed">
                      Ikon Velqora akan muncul di beranda ponsel Anda dan siap digunakan.
                    </p>
                  </div>
                </div>

                {canInstallPwa && (
                  <Button
                    onClick={handleInstallClick}
                    className="w-full h-11 rounded-xl text-xs font-semibold gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Luncurkan Prompt Pemasangan</span>
                  </Button>
                )}
              </div>
            )}

            {activePlatform === "ios" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                    <Apple className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-primary">
                      Panduan Instalasi iOS (Safari di iPhone & iPad)
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Tambahkan ke Layar Utama untuk tampilan layar penuh tanpa bilah alamat.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border/80 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-500 font-bold font-mono flex items-center justify-center text-xs">
                      1
                    </span>
                    <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                      <Share2 className="w-4 h-4 text-brand-500" />
                      <h4>Ketuk Tombol Share</h4>
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                      Buka Safari, lalu ketuk tombol Bagikan (Share) di bilah navigasi bawah.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border/80 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-500 font-bold font-mono flex items-center justify-center text-xs">
                      2
                    </span>
                    <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                      <PlusSquare className="w-4 h-4 text-brand-500" />
                      <h4>Add to Home Screen</h4>
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                      Gulir ke bawah dan pilih opsi "Tambah ke Layar Utama" (Add to Home Screen).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border/80 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-500 font-bold font-mono flex items-center justify-center text-xs">
                      3
                    </span>
                    <h4 className="font-semibold text-text-primary">Konfirmasi & Pasang</h4>
                    <p className="text-text-secondary leading-relaxed">
                      Ketuk "Tambah" di pojok kanan atas. Velqora siap dibuka sebagai aplikasi.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activePlatform === "desktop" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-primary">
                      Panduan Desktop App (Chrome / Edge / Windows / Mac)
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Jalankan Velqora dalam jendela mandiri dengan pintasan keyboard dan performa optimal.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border/80 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-500 font-bold font-mono flex items-center justify-center text-xs">
                      1
                    </span>
                    <h4 className="font-semibold text-text-primary">Ikon Instal di Address Bar</h4>
                    <p className="text-text-secondary leading-relaxed">
                      Klik ikon instal (⊕ / komputer) di sebelah kanan bilah alamat browser.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border/80 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-500 font-bold font-mono flex items-center justify-center text-xs">
                      2
                    </span>
                    <h4 className="font-semibold text-text-primary">Konfirmasi Pemasangan</h4>
                    <p className="text-text-secondary leading-relaxed">
                      Klik "Instal" pada jendela konfirmasi yang muncul.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border/80 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-500 font-bold font-mono flex items-center justify-center text-xs">
                      3
                    </span>
                    <h4 className="font-semibold text-text-primary">Akses via Taskbar / Dock</h4>
                    <p className="text-text-secondary leading-relaxed">
                      Velqora akan terbuka di jendela tersendiri dan dapat disematkan ke taskbar/dock.
                    </p>
                  </div>
                </div>

                {canInstallPwa && (
                  <Button
                    onClick={handleInstallClick}
                    className="w-full h-11 rounded-xl text-xs font-semibold gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Pasang Velqora Desktop Sekarang</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl border border-border/80 bg-surface/60 space-y-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h4 className="text-xs font-bold text-text-primary font-display">
              Performa Ringan & Caching Cerdas
            </h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              App shell dan aset statis terpilih tetap tersedia saat offline. Data dinamis dan fitur AI memerlukan koneksi internet aktif.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-border/80 bg-surface/60 space-y-2">
            <Globe className="w-5 h-5 text-brand-500" />
            <h4 className="text-xs font-bold text-text-primary font-display">
              Sinkronisasi Real-Time
            </h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Data tugas, jadwal, dan modul otomatis tersinkron antara ponsel dan desktop.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-border/80 bg-surface/60 space-y-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            <h4 className="text-xs font-bold text-text-primary font-display">
              Aman & Terenkripsi
            </h4>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Autentikasi tingkat enterprise via Supabase SSL dan kebijakan data ketat.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6 text-center text-xs text-text-tertiary">
        <p>© {new Date().getFullYear()} Velqora Learning Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
