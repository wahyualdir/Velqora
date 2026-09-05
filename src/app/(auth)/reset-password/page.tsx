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
    <div className="relative min-h-screen flex flex-col justify-between vt-desktop-bg text-[#1C1917] overflow-x-hidden selection:bg-[#C2553A]/20 selection:text-[#C2553A]">
      {/* Background */}
      <TechBackground />

      {/* Main Single Centered Retro OS Window Reset Password Layout */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 z-10 w-full">
        <div className="w-full max-w-[420px] mx-auto text-left space-y-3">
          {/* Primary Window: RESETPWD.EXE */}
          <div className="vt-window rounded-none overflow-hidden shadow-md text-left">
            {/* Window Titlebar */}
            <div className="vt-titlebar px-2.5 py-1.5 flex items-center justify-between select-none">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <VelqoraMark size={16} />
                <span className="font-mono text-xs font-bold tracking-wide text-white truncate uppercase">
                  RESETPWD.EXE — PEMULIHAN KATA SANDI
                </span>
              </div>
              {/* Controls */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button type="button" className="vt-window-btn" title="Minimize">_</button>
                <button type="button" className="vt-window-btn font-sans" title="Maximize">□</button>
                <Link href="/login" className="vt-window-btn vt-window-btn-close flex items-center justify-center" title="Close">×</Link>
              </div>
            </div>

            {/* Retro Window Menu Bar */}
            <div className="px-3 py-1 bg-[#ECE9D8] border-b border-[#7A756D] flex items-center gap-3 text-[11px] font-mono text-[#1C1917] select-none">
              <span className="cursor-pointer hover:underline">File</span>
              <span className="cursor-pointer hover:underline">Security</span>
              <span className="cursor-pointer hover:underline">Help</span>
            </div>

            {/* Inner Content Body */}
            <div className="p-5 sm:p-6 bg-[#FAF8F5] space-y-4">
              {/* Header Title & Subtitle */}
              <div className="space-y-1.5 text-center">
                <div className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-[#FAF3EF] text-[#C2553A] border border-[#C2553A]/30">
                  SECURITY // PASSWORD RECOVERY
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1C1917] tracking-tight font-sans">
                  {isSuccess ? "Password Diperbarui!" : "Buat Password Baru"}
                </h1>
                <p className="text-xs text-[#524B42] leading-relaxed max-w-xs mx-auto font-sans">
                  {isSuccess
                    ? "Password Anda berhasil diubah. Mengalihkan ke halaman login..."
                    : "Masukkan password baru akun Anda di bawah ini"}
                </p>
              </div>

              {isSuccess ? (
                <div className="space-y-3.5 text-center py-2 animate-fade-in">
                  <div className="p-3.5 border-t-2 border-l-2 border-[#7A756D] border-b border-r border-[#FFFFFF] bg-[#FFFFFF] text-emerald-800 text-xs sm:text-sm leading-relaxed flex items-center justify-center gap-2 font-mono">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Kata sandi akun Anda telah diperbarui dengan aman.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="w-full py-2.5 px-4 vt-btn-terracotta text-xs font-mono font-bold cursor-pointer"
                  >
                    Masuk Sekarang ▸
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdatePassword} className="space-y-3.5 pt-1">
                  {/* Password Baru */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-[#853827] uppercase tracking-wider block">
                      Password Baru
                    </label>
                    <div className="relative flex items-center border-t-2 border-l-2 border-[#7A756D] border-b border-r border-[#FFFFFF] bg-[#FFFFFF]">
                      <Lock className="absolute left-3 w-4 h-4 text-[#8A8378]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Minimal 6 karakter"
                        disabled={loading}
                        required
                        className="w-full bg-transparent pl-9 pr-10 py-2 text-sm font-sans text-[#1C1917] placeholder:text-[#8A8378] focus:outline-hidden disabled:opacity-50 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 p-1 text-[#8A8378] hover:text-[#1C1917] cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-[#C2553A]" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Konfirmasi Password */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-[#853827] uppercase tracking-wider block">
                      Konfirmasi Password
                    </label>
                    <div className="relative flex items-center border-t-2 border-l-2 border-[#7A756D] border-b border-r border-[#FFFFFF] bg-[#FFFFFF]">
                      <Lock className="absolute left-3 w-4 h-4 text-[#8A8378]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedField("confirmPassword")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Ulangi password baru"
                        disabled={loading}
                        required
                        className="w-full bg-transparent pl-9 pr-10 py-2 text-sm font-sans text-[#1C1917] placeholder:text-[#8A8378] focus:outline-hidden disabled:opacity-50 font-medium"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 vt-btn-terracotta text-xs font-mono font-bold disabled:opacity-50 cursor-pointer"
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

            {/* Retro Inset Status Bar */}
            <div className="px-3 py-1 bg-[#ECE9D8] border-t-2 border-[#FFFFFF] flex items-center justify-between text-[11px] font-mono text-[#524B42] select-none">
              <span className="flex items-center gap-1.5 truncate">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                {loading ? "UPDATING CREDENTIALS..." : "SYSTEM READY · RECOVERY SECURE"}
              </span>
              <span className="text-[#8A8378] hidden sm:inline">VELQORA_KERNEL · 64-BIT</span>
            </div>
          </div>

          {/* Secondary Switcher Box */}
          <div className="vt-window rounded-none p-3 text-center text-xs font-mono text-[#524B42] bg-[#FAF8F5] shadow-xs">
            Batal pemulihan?{" "}
            <Link
              href="/login"
              className="font-bold text-[#C2553A] hover:underline inline-flex items-center gap-1"
            >
              <span>Kembali ke Halaman Masuk ▸</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="w-full py-4 px-4 border-t border-[#7A756D]/30 z-10 flex items-center justify-center max-w-4xl mx-auto text-center font-mono text-xs text-[#8A8378]">
        <p>
          &copy; 2026 VELQORA ACADEMIC OS. SEMUA HAK DILINDUNGI UNDANG-UNDANG.
        </p>
      </footer>
    </div>
  );
}
