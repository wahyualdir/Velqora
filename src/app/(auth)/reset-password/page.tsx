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
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background (Bold Variant) */}
      <TechBackground variant="bold" />

      {/* Reset Card */}
      <div className="relative z-10 w-full max-w-[400px] space-y-7">
        <div className="rounded-3xl border border-white/[0.12] bg-white/[0.03] backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-7 space-y-6 transition-all duration-300 hover:border-white/[0.18]">
          
          {/* Header */}
          <div className="space-y-1 text-center">
            <h1 className="text-xl font-semibold text-white tracking-tight">
              {isSuccess ? "Password Diperbarui!" : "Buat Password Baru"}
            </h1>
            <p className="text-xs text-slate-300">
              {isSuccess
                ? "Password Anda berhasil diubah. Mengalihkan ke halaman login..."
                : "Masukkan password baru Anda di bawah ini"}
            </p>
          </div>

          {isSuccess ? (
            <div className="space-y-4 text-center py-4">
              <div className="flex justify-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
              </div>
              <p className="text-xs text-slate-300">
                Silakan masuk dengan password baru Anda.
              </p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600/90 to-blue-600/90 hover:from-indigo-500 hover:to-blue-500 backdrop-blur-sm border border-indigo-400/30 shadow-lg shadow-indigo-600/25 transition-all duration-200"
              >
                Masuk Sekarang
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {/* Password Baru */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  Password Baru
                </label>
                <div
                  className={`relative flex items-center rounded-xl border backdrop-blur-sm transition-all duration-200 ${
                    focusedField === "password"
                      ? "border-indigo-500/60 bg-white/[0.08] ring-1 ring-indigo-500/20"
                      : "border-white/[0.1] bg-white/[0.03] hover:border-white/[0.2] hover:bg-white/[0.05]"
                  }`}
                >
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Minimal 6 karakter"
                    disabled={loading}
                    required
                    className="w-full bg-transparent pl-10 pr-11 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  Konfirmasi Password
                </label>
                <div
                  className={`relative flex items-center rounded-xl border backdrop-blur-sm transition-all duration-200 ${
                    focusedField === "confirmPassword"
                      ? "border-indigo-500/60 bg-white/[0.08] ring-1 ring-indigo-500/20"
                      : "border-white/[0.1] bg-white/[0.03] hover:border-white/[0.2] hover:bg-white/[0.05]"
                  }`}
                >
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Ulangi password baru"
                    disabled={loading}
                    required
                    className="w-full bg-transparent pl-10 pr-11 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600/90 to-blue-600/90 hover:from-indigo-500 hover:to-blue-500 backdrop-blur-sm border border-indigo-400/30 shadow-lg shadow-indigo-600/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Simpan Password Baru
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
