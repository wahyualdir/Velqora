"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { TechBackground } from "@/components/ui/tech-background";
import { VelqoraMark } from "@/components/ui/logo";
import { DoorSubmitButton } from "@/components/ui/door-submit-button";
import { RetroLoadingDialog } from "@/components/ui/retro-loading-dialog";
import { isOwnerUser } from "@/lib/utils";

/* ============================================================
   OFFICIAL SOCIAL MEDIA & BRAND ICONS
   ============================================================ */

function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        fill="currentColor"
      />
    </svg>
  );
}

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.24v3.15C3.26 21.36 7.36 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.24C.45 8.19 0 9.99 0 12s.45 3.81 1.24 5.39l4.03-3.15z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.24 6.61l4.03 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Micro-interaction states: error shake & positive success pulse
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);

  const triggerErrorState = (message: string) => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 350);
    toast.error(message);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      triggerErrorState("Email wajib diisi");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined,
      });

      if (error) {
        triggerErrorState(error.message);
      } else {
        setResetSent(true);
        toast.success("Link reset password telah dikirim ke email Anda!");
      }
    } catch (err: any) {
      triggerErrorState(err?.message || "Gagal mengirim email reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    toast.loading("Mengarahkan ke Google Sign-In...", { id: "google-login" });
    const supabase = createClient();
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined,
        },
      });

      if (error) {
        triggerErrorState(`Gagal menghubungkan Google: ${error.message}`);
        toast.dismiss("google-login");
      } else if (data?.url) {
        toast.success("Mengarahkan ke Google...", { id: "google-login" });
        window.location.href = data.url;
      }
    } catch (err: any) {
      triggerErrorState(err?.message || "Google Provider belum diaktifkan di Supabase Dashboard");
      toast.dismiss("google-login");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    toast.loading("Mengarahkan ke GitHub Sign-In...", { id: "github-login" });
    const supabase = createClient();
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined,
        },
      });

      if (error) {
        triggerErrorState(`Gagal menghubungkan GitHub: ${error.message}`);
        toast.dismiss("github-login");
      } else if (data?.url) {
        toast.success("Mengarahkan ke GitHub...", { id: "github-login" });
        window.location.href = data.url;
      }
    } catch (err: any) {
      triggerErrorState(err?.message || "GitHub Provider belum diaktifkan di Supabase Dashboard");
      toast.dismiss("github-login");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      triggerErrorState("Email dan password wajib diisi");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const normalizedEmail = email.trim().toLowerCase();
    const isOwner = isOwnerUser(normalizedEmail);

    try {
      let { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error && isOwner) {
        const { error: createOwnerErr } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
        });
        if (!createOwnerErr) {
          const retry = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });
          error = retry.error;
        }
      }

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("email not confirmed")) {
          triggerErrorState("Email belum dikonfirmasi. Silakan periksa inbox email Anda.");
        } else if (msg.includes("invalid login credentials") || msg.includes("invalid_credentials")) {
          triggerErrorState("Email atau password salah. Jika belum punya akun, silakan klik 'Daftar Sekarang'.");
        } else {
          triggerErrorState(error.message);
        }
      } else {
        let role = isOwner ? "owner" : "user";
        if (!isOwner) {
          try {
            const { getUserRoleAction } = await import("@/actions/role-actions");
            role = await getUserRoleAction(normalizedEmail);
          } catch (err) {
            console.error(err);
          }
        }

        if (typeof window !== "undefined") {
          if (role === "owner" || role === "admin") {
            localStorage.setItem("user_role", role);
          } else {
            localStorage.removeItem("user_role");
          }
        }

        // Trigger positive feedback animation before launching retro loading dialog
        setIsSuccess(true);
        toast.success(
          role === "owner"
            ? "Selamat datang kembali, System Owner!"
            : role === "admin"
            ? "Selamat datang kembali, Administrator!"
            : "Selamat datang kembali di Velqora!"
        );

        // Display authentic Retro OS loading dialog with terracotta blocks before entering dashboard
        setShowLoadingDialog(true);
      }
    } catch (err: any) {
      triggerErrorState(err?.message || "Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-dvh flex flex-col justify-between vt-desktop-bg text-[#1C1917] dark:text-[#F5F5F4] overflow-x-hidden selection:bg-[#D4664A]/20 selection:text-[#C2553A] dark:selection:text-[#D4664A]">

      {/* Subtle Ambient Background */}
      <TechBackground />

      {/* Main Single Centered Warm Obsidian Card */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-2.5 sm:py-4 z-10 w-full">
        <div className="w-full max-w-[440px] mx-auto text-left space-y-2.5">

          {/* Primary Auth Surface */}
          <div
            className={`vt-window rounded-2xl overflow-hidden text-left transition-all ${
              isShaking ? "animate-shake" : isSuccess ? "animate-success-pulse" : ""
            }`}
          >
            {/* Clean Header */}
            <div className="px-5 py-3 bg-[#F3EFE9]/60 dark:bg-[#1C1917]/60 border-b border-[#E6E0D6] dark:border-[#24201E] flex items-center justify-between select-none">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <VelqoraMark size={18} />
                <span className="font-sans text-xs font-semibold text-[#1C1917] dark:text-[#F5F5F4] truncate">
                  Velqora
                </span>
              </div>
              <Link
                href="/"
                className="text-xs font-sans font-medium text-[#6B6560] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] transition-colors shrink-0"
              >
                ← Beranda
              </Link>
            </div>

            {/* Inner Content Body */}
            <div className="px-5 py-5 sm:px-6 sm:py-5 bg-[#FFFFFF] dark:bg-[#141210] space-y-4">
              {/* Header Title & Subtitle */}
              <div className="space-y-1 text-center">
                <h1 className="text-xl font-bold text-[#1C1917] dark:text-[#F5F5F4] tracking-tight font-sans">
                  {isForgotPassword
                    ? resetSent
                      ? "Cek Email Anda"
                      : "Reset Password"
                    : "Masuk ke Akun"}
                </h1>
                <p className="text-xs sm:text-sm text-[#6B6560] dark:text-[#A8A29E] leading-snug max-w-sm mx-auto font-sans">
                  {isForgotPassword ? (
                    resetSent ? (
                      `Instruksi pemulihan telah dikirim ke ${email}`
                    ) : (
                      "Masukkan email Anda untuk menerima tautan pemulihan kata sandi"
                    )
                  ) : (
                    "Akses modul AI, lab praktik kode, dan catatan belajar Anda"
                  )}
                </p>
              </div>

              {isForgotPassword ? (
                resetSent ? (
                  <div className="space-y-3 text-center py-2 animate-fade-in-up">
                    <div className="p-3 rounded-xl border border-emerald-600/25 dark:border-[#34D399]/30 bg-emerald-50/70 dark:bg-[#34D399]/10 text-emerald-800 dark:text-[#34D399] text-xs sm:text-sm leading-relaxed flex items-center justify-center gap-2 font-mono">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Tautan pemulihan dikirim ke <strong>{email}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setResetSent(false);
                      }}
                      className="w-full py-2.5 px-4 vt-btn-chrome text-xs font-mono font-semibold"
                    >
                      Kembali ke Halaman Masuk
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-3.5 animate-fade-in-up">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono font-semibold text-[#524B42] dark:text-[#A8A29E] uppercase tracking-wider block">
                        Email Akun
                      </label>
                      <div className="relative flex items-center rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-[#FAF8F5] dark:bg-[#0F0E0D] focus-within:border-[#C2553A] dark:focus-within:border-[#D4664A] focus-within:ring-2 focus-within:ring-[#D4664A]/20 transition-all">
                        <Mail className="absolute left-3.5 w-4 h-4 text-[#8A8378] dark:text-[#8C857F]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nama@email.com"
                          disabled={loading}
                          required
                          autoComplete="email"
                          className="w-full bg-transparent pl-10 pr-3.5 py-2 text-sm font-sans text-[#1C1917] dark:text-[#F5F5F4] placeholder:text-[#8A8378] dark:placeholder:text-[#8C857F] focus:outline-hidden disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 vt-btn-terracotta text-xs font-mono font-semibold"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white shrink-0" />
                          <span>Memproses...</span>
                        </div>
                      ) : (
                        <>
                          <span>KIRIM LINK RESET</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <div className="text-center pt-0.5">
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(false)}
                        className="text-xs font-mono text-[#C2553A] dark:text-[#D4664A] hover:underline cursor-pointer"
                      >
                        ← Kembali ke Halaman Masuk
                      </button>
                    </div>
                  </form>
                )
              ) : (
                <div className="space-y-3">
                  {/* OAuth Buttons (Google & GitHub) */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      id="login-google-btn"
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 py-2 px-3 vt-btn-chrome text-xs font-mono font-semibold disabled:opacity-50 cursor-pointer"
                    >
                      <GoogleIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>Google</span>
                    </button>

                    <button
                      id="login-github-btn"
                      type="button"
                      onClick={handleGithubLogin}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 py-2 px-3 vt-btn-chrome text-xs font-mono font-semibold disabled:opacity-50 cursor-pointer"
                    >
                      <GitHubIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>GitHub</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative py-0.5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#E4DDD4] dark:border-[#292524]" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-mono">
                      <span className="bg-[#FFFFFF] dark:bg-[#141210] px-3 py-0.5 text-[#8A8378] dark:text-[#8C857F] font-semibold">
                        atau masuk via email
                      </span>
                    </div>
                  </div>

                  {/* Form Input Email & Password */}
                  <form onSubmit={handleSubmit} className="space-y-2.5">
                    {/* Email Field */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono font-semibold text-[#524B42] dark:text-[#A8A29E] uppercase tracking-wider block">
                        Email
                      </label>
                      <div className="relative flex items-center rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-[#FAF8F5] dark:bg-[#0F0E0D] focus-within:border-[#C2553A] dark:focus-within:border-[#D4664A] focus-within:ring-2 focus-within:ring-[#D4664A]/20 transition-all">
                        <Mail className="absolute left-3.5 w-4 h-4 text-[#8A8378] dark:text-[#8C857F]" />
                        <input
                          id="login-email-input"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nama@email.com"
                          disabled={loading}
                          required
                          autoComplete="email"
                          className="w-full bg-transparent pl-10 pr-3.5 py-2 text-sm font-sans text-[#1C1917] dark:text-[#F5F5F4] placeholder:text-[#8A8378] dark:placeholder:text-[#8C857F] focus:outline-hidden disabled:opacity-50 font-medium"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono font-semibold text-[#524B42] dark:text-[#A8A29E] uppercase tracking-wider block">
                        Password
                      </label>
                      <div className="relative flex items-center rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-[#FAF8F5] dark:bg-[#0F0E0D] focus-within:border-[#C2553A] dark:focus-within:border-[#D4664A] focus-within:ring-2 focus-within:ring-[#D4664A]/20 transition-all">
                        <Lock className="absolute left-3.5 w-4 h-4 text-[#8A8378] dark:text-[#8C857F]" />
                        <input
                          id="login-password-input"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          disabled={loading}
                          required
                          autoComplete="current-password"
                          className="w-full bg-transparent pl-10 pr-10 py-2 text-sm font-sans text-[#1C1917] dark:text-[#F5F5F4] placeholder:text-[#8A8378] dark:placeholder:text-[#8C857F] focus:outline-hidden disabled:opacity-50 font-medium"
                        />
                        <button
                          id="login-password-toggle"
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 p-1 text-[#8A8378] dark:text-[#8C857F] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] cursor-pointer transition-colors"
                          tabIndex={-1}
                          aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A]" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Remember Me & Forgot Password Row */}
                      <div className="flex items-center justify-between pt-1 text-xs font-mono">
                        <label className="flex items-center gap-2 text-[#524B42] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-3.5 h-3.5 accent-[#C2553A] dark:accent-[#D4664A] cursor-pointer rounded"
                          />
                          <span>Ingat saya</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(true);
                            setResetSent(false);
                          }}
                          className="text-[11px] font-medium text-[#C2553A] dark:text-[#D4664A] hover:underline cursor-pointer"
                        >
                          Lupa password?
                        </button>
                      </div>
                    </div>

                    {/* Primary Submit Button with 3D Door Portal */}
                    <div className="pt-0.5">
                      <DoorSubmitButton
                        id="login-submit-button"
                        loading={loading}
                        isSuccess={isSuccess}
                        disabled={loading || isSuccess}
                        type="submit"
                      />
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Secondary Switcher Box */}
          <div className="rounded-2xl border border-[#E6E0D6] dark:border-[#24201E] bg-[#FFFFFF] dark:bg-[#141210] p-3 text-center text-xs font-sans text-[#6B6560] dark:text-[#A8A29E]">
            Belum memiliki akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#C2553A] dark:text-[#F09A82] hover:underline inline-flex items-center gap-1"
            >
              <span>Daftar Akun Baru →</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="w-full py-3 px-4 border-t border-[#E6E0D6] dark:border-[#24201E] z-10 flex items-center justify-center max-w-4xl mx-auto text-center font-sans text-xs text-[#8A8378] dark:text-[#8C857F]">
        <p>
          &copy; 2026 Velqora Learning Platform. All rights reserved.
        </p>
      </footer>

      {/* Loading Transition Modal Dialog */}
      <RetroLoadingDialog
        isOpen={showLoadingDialog}
        title="Menyiapkan Workspace..."
        subtitle="Membuka ruang belajar dan modul aktif Anda..."
        durationMs={2200}
        totalBlocks={20}
        onComplete={() => {
          router.push("/dashboard");
          router.refresh();
        }}
        onCancel={() => {
          setShowLoadingDialog(false);
          setIsSuccess(false);
          setLoading(false);
        }}
      />
    </div>
  );
}
