"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { TechBackground } from "@/components/ui/tech-background";
import { VelqoraMark } from "@/components/ui/logo";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    <div className="relative min-h-screen flex flex-col justify-between vt-desktop-bg text-[#1C1917] dark:text-[#F5F5F4] overflow-x-hidden selection:bg-[#D4664A]/20 selection:text-[#C2553A] dark:selection:text-[#D4664A]">
      {/* Background */}
      <TechBackground />

      {/* Main Single Centered Warm Obsidian Card */}
      <main className="flex-1 flex flex-col items-center justify-center px-3.5 sm:px-6 py-8 sm:py-12 z-10 w-full">
        <div className="w-full max-w-[440px] mx-auto text-left space-y-3.5">
          {/* Primary Auth Surface */}
          <div className="vt-window rounded-2xl overflow-hidden text-left">
            {/* Editorial Card Header */}
            <div className="px-5 py-3.5 bg-[#F3EFE9]/75 dark:bg-[#1C1917]/85 border-b border-[#E4DDD4] dark:border-[#292524] flex items-center justify-between select-none">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <VelqoraMark size={18} />
                <span className="font-mono text-[11px] font-semibold tracking-[0.08em] text-[#524B42] dark:text-[#A8A29E] truncate uppercase">
                  VELQORA // PASSWORD RECOVERY
                </span>
              </div>
              <Link
                href="/login"
                className="text-[11px] font-mono font-medium text-[#8A8378] dark:text-[#8C857F] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] transition-colors shrink-0"
              >
                ← Masuk
              </Link>
            </div>

            {/* Inner Content Body */}
            <div className="p-3.5 sm:p-6 bg-[#FFFFFF] dark:bg-[#141210] space-y-5">
              {/* Header Title & Subtitle */}
              <div className="space-y-1.5 text-center">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase bg-[#FAF3EF] dark:bg-[#D4664A]/12 text-[#C2553A] dark:text-[#D4664A] border border-[#C2553A]/20 dark:border-[#D4664A]/30">
                  SECURITY // PASSWORD RECOVERY
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1C1917] dark:text-[#F5F5F4] tracking-tight font-sans">
                  {isSuccess ? "Password Diperbarui!" : "Buat Password Baru"}
                </h1>
                <p className="text-xs text-[#524B42] dark:text-[#A8A29E] leading-relaxed max-w-xs mx-auto font-sans">
                  {isSuccess
                    ? "Password Anda berhasil diubah. Mengalihkan ke halaman login..."
                    : "Masukkan password baru akun Anda di bawah ini"}
                </p>
              </div>

              {isSuccess ? (
                <div className="space-y-3.5 text-center py-2 animate-fade-in">
                  <div className="p-3.5 rounded-xl border border-emerald-600/25 dark:border-[#34D399]/30 bg-emerald-50/70 dark:bg-[#34D399]/10 text-emerald-800 dark:text-[#34D399] text-xs sm:text-sm leading-relaxed flex items-center justify-center gap-2 font-mono">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>Kata sandi akun Anda telah diperbarui dengan aman.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="w-full py-2.5 px-4 vt-btn-terracotta text-xs font-mono font-semibold cursor-pointer"
                  >
                    Masuk Sekarang →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdatePassword} className="space-y-4 pt-1">
                  {/* Password Baru */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono font-semibold text-[#524B42] dark:text-[#A8A29E] uppercase tracking-wider block">
                      Password Baru
                    </label>
                    <div className="relative flex items-center rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-[#FAF8F5] dark:bg-[#0F0E0D] focus-within:border-[#C2553A] dark:focus-within:border-[#D4664A] focus-within:ring-2 focus-within:ring-[#D4664A]/20 transition-all">
                      <Lock className="absolute left-3.5 w-4 h-4 text-[#8A8378] dark:text-[#8C857F]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        disabled={loading}
                        required
                        className="w-full bg-transparent pl-10 pr-10 py-2.5 text-sm font-sans text-[#1C1917] dark:text-[#F5F5F4] placeholder:text-[#8A8378] dark:placeholder:text-[#8C857F] focus:outline-hidden disabled:opacity-50 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 p-1 text-[#8A8378] dark:text-[#8C857F] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] cursor-pointer transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A]" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Konfirmasi Password */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono font-semibold text-[#524B42] dark:text-[#A8A29E] uppercase tracking-wider block">
                      Konfirmasi Password
                    </label>
                    <div className="relative flex items-center rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-[#FAF8F5] dark:bg-[#0F0E0D] focus-within:border-[#C2553A] dark:focus-within:border-[#D4664A] focus-within:ring-2 focus-within:ring-[#D4664A]/20 transition-all">
                      <Lock className="absolute left-3.5 w-4 h-4 text-[#8A8378] dark:text-[#8C857F]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi password baru"
                        disabled={loading}
                        required
                        className="w-full bg-transparent pl-10 pr-10 py-2.5 text-sm font-sans text-[#1C1917] dark:text-[#F5F5F4] placeholder:text-[#8A8378] dark:placeholder:text-[#8C857F] focus:outline-hidden disabled:opacity-50 font-medium"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 vt-btn-terracotta text-xs font-mono font-semibold disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white shrink-0" />
                          <span>Menyimpan...</span>
                        </div>
                      ) : (
                        <>
                          <span>SIMPAN PASSWORD BARU</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Hairline Telemetry Bar */}
            <div className="px-5 py-2.5 bg-[#FAF8F5] dark:bg-[#100E0D] border-t border-[#E4DDD4] dark:border-[#292524] flex items-center justify-between text-[11px] font-mono text-[#524B42] dark:text-[#A8A29E] select-none">
              <span className="flex items-center gap-2 truncate">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#34D399]" />
                {loading ? "UPDATING CREDENTIALS..." : "SYSTEM READY · RECOVERY SECURE"}
              </span>
              <span className="text-[#8A8378] dark:text-[#8C857F] hidden sm:inline">VELQORA // TLS 1.3</span>
            </div>
          </div>

          {/* Secondary Switcher Box */}
          <div className="vt-window rounded-xl p-3.5 text-center text-xs font-mono text-[#524B42] dark:text-[#A8A29E]">
            Batal pemulihan?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#C2553A] dark:text-[#D4664A] hover:underline inline-flex items-center gap-1"
            >
              <span>Kembali ke Halaman Masuk →</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="w-full py-4 px-4 border-t border-[#E4DDD4] dark:border-[#292524] z-10 flex items-center justify-center max-w-4xl mx-auto text-center font-mono text-xs text-[#8A8378] dark:text-[#8C857F]">
        <p>
          &copy; 2026 VELQORA ACADEMIC PLATFORM. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
