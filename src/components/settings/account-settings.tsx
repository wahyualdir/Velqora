"use client";

import React, { useState } from "react";
import { LogOut, RotateCcw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AccountSettingsProps {
  email: string;
  onExportSettings: () => string;
  onResetSettings: () => void;
}

export function AccountSettings({
  email,
  onExportSettings,
  onResetSettings,
}: AccountSettingsProps) {
  const router = useRouter();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Berhasil keluar dari akun.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.message || "Gagal keluar dari sesi.");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleCopyExportJson = () => {
    const jsonStr = onExportSettings();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(jsonStr);
      setCopiedExport(true);
      toast.success("Konfigurasi tema disalin ke clipboard!");
      setTimeout(() => setCopiedExport(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-border pb-3 space-y-1">
        <h2 className="text-base sm:text-lg font-bold text-text-primary">
          Akun & Sesi
        </h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          Kelola sesi login perangkat, pencadangan konfigurasi workspace, dan keluar dari akun Velqora.
        </p>
      </div>

      {/* 1. Account Summary & Export */}
      <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div className="space-y-0.5">
            <h3 className="text-xs sm:text-sm font-semibold text-text-primary">
              Akun Aktif
            </h3>
            <p className="text-xs font-mono text-text-secondary">
              {email || "Pengguna Terautentikasi"}
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCopyExportJson}
            className="text-xs gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            {copiedExport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Cadangan Konfigurasi (JSON)</span>
              </>
            )}
          </Button>
        </div>

        {/* 2. Sign Out Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="space-y-0.5">
            <h4 className="text-xs font-semibold text-text-primary">
              Keluar dari Sesi
            </h4>
            <p className="text-xs text-text-secondary">
              Keluar dari akun Velqora pada peramban web ini.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setLogoutDialogOpen(true)}
            className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border-rose-500/30 gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </Button>
        </div>
      </div>

      {/* 3. Danger Zone: Reset Settings */}
      <div className="p-4 sm:p-5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400">
              Reset Semua Pengaturan
            </h3>
            <p className="text-xs text-text-secondary">
              Kembalikan seluruh preferensi tema, tampilan, dan bahasa ke pengaturan bawaan awal.
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setResetDialogOpen(true)}
            className="text-xs text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/10 gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Bawaan</span>
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        title="Keluar dari Akun?"
        message="Apakah Anda yakin ingin keluar dari sesi akun Velqora pada perangkat ini?"
        confirmText={loggingOut ? "Memproses..." : "Keluar"}
      />

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={() => {
          onResetSettings();
          setResetDialogOpen(false);
        }}
        title="Reset Semua Preferensi?"
        message="Semua pengaturan tema antarmuka dan preferensi workspace akan dikembalikan ke setelan awal pabrik."
        confirmText="Reset Sekarang"
      />
    </div>
  );
}
