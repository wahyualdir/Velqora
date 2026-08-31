"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { TechBackground } from "@/components/ui/tech-background";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Semua kolom password wajib diisi");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast.error(`Gagal memperbarui password: ${error.message}`);
      } else {
        setIsSuccess(true);
        toast.success("Password Anda telah berhasil diperbarui!");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err: any) {
      toast.error(err?.message || "Terjadi kesalahan saat memperbarui password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-3.5 sm:p-6">
      {/* Background (Bold Variant) */}
      <TechBackground variant="bold" />

      {/* Reset Card */}
      <div className="relative z-10 w-full max-w-[400px] space-y-6">
        <div className="rounded-2xl border border-border bg-surface shadow-xl p-5 sm:p-7 space-y-6 transition-all duration-200">
          
          {/* Header */}
          <div className="space-y-1 text-center">
            <h1 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight font-display">
              {isSuccess ? "Password Diperbarui!" : "Buat Password Baru"}
            </h1>
            <p className="text-xs text-text-secondary leading-relaxed">
              {isSuccess
                ? "Password Anda berhasil diubah. Mengalihkan ke halaman login..."
                : "Masukkan password baru Anda di bawah ini"}
            </p>
          </div>

          {isSuccess ? (
            <div className="space-y-4 text-center py-2 animate-fade-in">
              <div className="flex justify-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
              <p className="text-xs text-text-secondary">
                Silakan masuk dengan password baru Anda.
              </p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-xs transition-all active:scale-[0.98] min-h-[40px] cursor-pointer"
              >
                Masuk Sekarang
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {/* Password Baru */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-text-tertiary uppercase tracking-widest">
                  Password Baru
                </label>
                <div
                  className={`relative flex items-center rounded-xl border transition-all duration-150 overflow-hidden ${
                    focusedField === "password"
                      ? "border-brand-500 bg-surface-secondary/70 ring-2 ring-brand-500/20"
                      : "border-border bg-surface-secondary/40 hover:border-border/80"
                  }`}
                >
                  <Lock className="absolute left-3.5 w-4 h-4 text-text-tertiary" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Minimal 6 karakter"
                    disabled={loading}
                    required
                    className="w-full bg-transparent pl-10 pr-11 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1 text-text-tertiary hover:text-text-primary transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-text-tertiary uppercase tracking-widest">
                  Konfirmasi Password
                </label>
                <div
                  className={`relative flex items-center rounded-xl border transition-all duration-150 overflow-hidden ${
                    focusedField === "confirmPassword"
                      ? "border-brand-500 bg-surface-secondary/70 ring-2 ring-brand-500/20"
                      : "border-border bg-surface-secondary/40 hover:border-border/80"
                  }`}
                >
                  <Lock className="absolute left-3.5 w-4 h-4 text-text-tertiary" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Ulangi password baru"
                    disabled={loading}
                    required
                    className="w-full bg-transparent pl-10 pr-11 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-xs transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] min-h-[42px] cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>Simpan Password Baru</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
