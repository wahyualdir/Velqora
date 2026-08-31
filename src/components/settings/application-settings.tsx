"use client";

import React from "react";
import Link from "next/link";
import { Download, Smartphone, Laptop, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExperience } from "@/context/experience-context";
import { toast } from "sonner";

export function ApplicationSettings() {
  const { isPwaStandalone, canInstallPwa, promptInstallPwa } = useExperience();

  const handleInstall = async () => {
    if (canInstallPwa) {
      const installed = await promptInstallPwa();
      if (installed) {
        toast.success("Aplikasi Velqora berhasil dipasang!");
      }
    } else {
      toast.info("Gunakan opsi 'Tambahkan ke Layar Utama' di menu browser Anda.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border/80 pb-4">
        <h2 className="text-base sm:text-lg font-bold text-text-primary font-display">
          Aplikasi & PWA
        </h2>
        <p className="text-xs text-text-secondary mt-1 leading-relaxed">
          Kelola instalasi aplikasi Velqora di perangkat seluler atau desktop untuk akses instan dan ketersediaan app shell offline.
        </p>
      </div>

      {/* Installation Status Banner */}
      <div className="p-4 rounded-xl border border-border bg-surface-secondary/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-500 flex items-center justify-center shrink-0">
            {isPwaStandalone ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <Download className="w-5 h-5 text-brand-500" />
            )}
          </div>
          <div>
            <h3 className="text-xs font-bold text-text-primary font-display">
              {isPwaStandalone
                ? "Velqora Berjalan dalam Mode Aplikasi (Standalone)"
                : "Aplikasi Web Standar"}
            </h3>
            <p className="text-[11px] text-text-tertiary">
              {isPwaStandalone
                ? "Anda sedang menggunakan versi PWA terpasang dengan pengalaman native."
                : "Pasang aplikasi untuk membuka Velqora langsung dari dock atau layar utama."}
            </p>
          </div>
        </div>

        {!isPwaStandalone && (
          <div className="shrink-0 flex items-center gap-2">
            {canInstallPwa ? (
              <Button
                onClick={handleInstall}
                size="sm"
                className="text-xs gap-1.5 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pasang Sekarang</span>
              </Button>
            ) : (
              <Link href="/download">
                <Button size="sm" variant="outline" className="text-xs gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  <span>Panduan Instalasi</span>
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Platform Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
          <div className="flex items-center gap-2 text-brand-500 font-semibold text-xs font-mono">
            <Smartphone className="w-4 h-4" />
            <span>Mobile App Experience</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Navigasi bawah 5-tujuan, drawer menu geser, ringkasan agenda jadwal harian, dan responsivitas cepat.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
          <div className="flex items-center gap-2 text-brand-500 font-semibold text-xs font-mono">
            <Laptop className="w-4 h-4" />
            <span>Desktop Workspace</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Sidebar 245px, command palette (Ctrl+K), tampilan multi-kolom materi, dan keyboard navigation efisien.
          </p>
        </div>
      </div>

      {/* Security & Offline Policy Note */}
      <div className="p-4 rounded-xl border border-brand-500/20 bg-brand-500/5 flex items-start gap-3">
        <Shield className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-semibold text-text-primary">
            Privasi & Keamanan Data Offline
          </h4>
          <p className="text-text-secondary text-[11px] leading-relaxed">
            Sesuai kebijakan keamanan Velqora, data Supabase pribadi, inferensi AI, dan tindakan server tidak pernah disimpan dalam cache tidak aman.
          </p>
        </div>
      </div>
    </div>
  );
}
