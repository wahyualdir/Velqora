"use client";

import React, { useState } from "react";
import {
  Brain,
  KeyRound,
  Save,
  Loader2,
  Lock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { MemoryManagementModal } from "@/components/ai/memory-management-modal";
import { toast } from "sonner";

export function PrivacySecuritySettings() {
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Kata sandi baru minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      toast.success("Kata sandi akun berhasil diperbarui!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.message || "Gagal memperbarui kata sandi.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-border pb-3 space-y-1">
        <h2 className="text-base sm:text-lg font-bold text-text-primary">
          Privasi & Keamanan
        </h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          Kelola memori kecerdasan buatan, pembaruan kata sandi autentikasi, dan perlindungan privasi data akademik Anda.
        </p>
      </div>

      {/* 1. AI Memory & Learning Profile */}
      <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0 border border-brand-500/20 text-brand-600 dark:text-brand-400">
              <Brain className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <h3 className="text-xs sm:text-sm font-semibold text-text-primary">
                Memori Belajar AI Tutor
              </h3>
              <p className="text-xs text-text-secondary">
                Kelola fakta preferensi akademik, gaya belajar, dan topik fokus yang diingat oleh AI Tutor.
              </p>
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsMemoryModalOpen(true)}
            className="text-xs font-semibold gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>Kelola Memori AI</span>
          </Button>
        </div>
      </div>

      {/* 2. Password Update Form */}
      <form onSubmit={handleUpdatePassword} className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-4">
        <div className="flex items-start gap-3 border-b border-border pb-3">
          <div className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center shrink-0 border border-border text-text-secondary">
            <Lock className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-xs sm:text-sm font-semibold text-text-primary">
              Perbarui Kata Sandi
            </h3>
            <p className="text-xs text-text-secondary">
              Gunakan kombinasi minimal 6 karakter dengan huruf dan angka untuk keamanan optimal.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              Kata Sandi Baru
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter..."
              className="text-xs sm:text-sm"
              minLength={6}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold font-mono uppercase tracking-wider text-text-secondary">
              Konfirmasi Kata Sandi
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ketik ulang kata sandi..."
              className="text-xs sm:text-sm"
              minLength={6}
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            disabled={updatingPassword || !newPassword || !confirmPassword}
            className="gap-2 text-xs font-semibold px-4 min-h-[38px] cursor-pointer shadow-2xs"
          >
            {updatingPassword ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Kata Sandi</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* AI Memory Management Modal Integration */}
      <MemoryManagementModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
      />
    </div>
  );
}
