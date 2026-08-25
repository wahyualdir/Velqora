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

/* ============================================================
   OFFICIAL SOCIAL MEDIA & BRAND ICONS
   ============================================================ */

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M20.52 3.48A11.93 11.93 0 0 0 12.06 0C5.46 0 .09 5.37.09 11.97c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.63a11.93 11.93 0 0 0 5.86 1.52h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-.125-6.21-3.52-8.44zM12.07 21.9h-.01a9.92 9.92 0 0 1-5.06-1.39l-.36-.21-3.76.99 1-3.66-.23-.38a9.92 9.92 0 0 1-1.52-5.28c0-5.48 4.46-9.94 9.95-9.94 2.65 0 5.15 1.03 7.03 2.91a9.88 9.88 0 0 1 2.91 7.02c0 5.48-4.46 9.94-9.92 9.94zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.89-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.52.07-.8.37s-1.05 1.03-1.05 2.5 1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.77-.73 2.02-1.43.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35z"
        fill="#25D366"
      />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="ig-grad-login" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(6 18) rotate(-45) scale(20.5)">
          <stop offset="0%" stopColor="#FFDD55" />
          <stop offset="0.3" stopColor="#FF543E" />
          <stop offset="0.6" stopColor="#C837AB" />
          <stop offset="1" stopColor="#3771C8" />
        </radialGradient>
      </defs>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="url(#ig-grad-login)" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="4.2" stroke="url(#ig-grad-login)" strokeWidth="2" fill="none" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="url(#ig-grad-login)" />
    </svg>
  );
}

function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.9 2.9 0 1 1-2.9-2.9c.25 0 .48.03.71.09V9.38a6.37 6.37 0 1 0 5.64 6.29V9.01a8.22 8.22 0 0 0 5.02 1.69V7.24a4.82 4.82 0 0 1-1.25-.55z"
        fill="#EE1D52"
      />
      <path
        d="M18.34 6.14a4.83 4.83 0 0 1-3.77-4.25V1.45h-3.45v13.67a2.9 2.9 0 1 1-2.9-2.9c.25 0 .48.03.71.09V8.83a6.37 6.37 0 1 0 5.64 6.29V8.46a8.22 8.22 0 0 0 5.02 1.69V6.69a4.82 4.82 0 0 1-1.25-.55z"
        fill="#69C9D0"
      />
      <path
        d="M18.84 6.42a4.83 4.83 0 0 1-3.77-4.25V1.72h-3.45v13.67a2.9 2.9 0 1 1-2.9-2.9c.25 0 .48.03.71.09V9.1a6.37 6.37 0 1 0 5.64 6.29V8.74a8.22 8.22 0 0 0 5.02 1.69V6.96a4.82 4.82 0 0 1-1.25-.54z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

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
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const socialLinks = {
    whatsapp: "https://wa.me/6283162031942",
    instagram: "https://instagram.com/wahyualdriy",
    tiktok: "https://tiktok.com/@wahyuhengsem",
    github: "https://github.com/WahyuAldiRiyanto",
  };

  const triggerErrorState = (message: string) => {
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
    const isOwner = normalizedEmail === "wahyualdiriyanto80@gmail.com";

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

        toast.success(
          role === "owner"
            ? "Selamat datang kembali, Wahyu!"
            : role === "admin"
            ? "Selamat datang kembali, Administrator!"
            : "Selamat datang kembali di Velqora!"
        );

        // Smooth brief transition before navigating
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 350);
      }
    } catch (err: any) {
      triggerErrorState(err?.message || "Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between text-white overflow-x-hidden selection:bg-[#0071e3] selection:text-white">

      {/* Interactive Tech Canvas Background (Subtle Variant) */}
      <TechBackground variant="subtle" />

      {/* Main Login Card Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10 z-10 w-full">
        <div className="w-full max-w-[400px] text-center space-y-3.5">

          {/* 1. Primary Card: Login Form */}
          <div
            className="relative rounded-2xl border border-white/15 bg-[#030712]/90 backdrop-blur-xl p-5 sm:p-7 shadow-2xl text-left transition-all duration-300 overflow-hidden animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >

            {/* Inner Content Layer (z-10 relative) */}
            <div className="relative z-10 space-y-5">
              {/* Header: Brand Mark (Small & Clean) */}
              <div className="flex flex-col items-center justify-center pt-0.5">
                <VelqoraMark size={28} />
              </div>

            {/* Header Title & Subtitle */}
            <div className="space-y-1 text-center">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight font-display">
                {isForgotPassword
                  ? resetSent
                    ? "Cek Email Anda"
                    : "Reset Password"
                  : "Masuk ke Akun"}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                {isForgotPassword ? (
                  resetSent ? (
                    `Instruksi pemulihan telah dikirim ke ${email}`
                  ) : (
                    "Masukkan email Anda untuk menerima tautan pemulihan kata sandi"
                  )
                ) : (
                  "Akses materi perkuliahan, modul praktik, dan asisten AI Anda"
                )}
              </p>
            </div>

            {isForgotPassword ? (
              resetSent ? (
                <div className="space-y-3 text-center py-1 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md text-emerald-300 text-xs leading-relaxed flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Tautan pemulihan telah dikirim ke <strong>{email}</strong>.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetSent(false);
                    }}
                    className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] transition-all min-h-[38px] cursor-pointer active:scale-98"
                  >
                    Kembali ke Halaman Masuk
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-3.5 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Email Akun
                    </label>
                    <div
                      className={`relative flex items-center rounded-xl border transition-all duration-150 overflow-hidden ${
                        focusedField === "reset-email"
                          ? "border-brand-500 bg-white/[0.08] ring-2 ring-brand-500/30"
                          : "border-white/[0.12] bg-white/[0.03] hover:border-white/[0.22]"
                      }`}
                    >
                      <Mail
                        className={`absolute left-3 w-4 h-4 transition-colors ${
                          focusedField === "reset-email"
                            ? "text-brand-400"
                            : email.length > 0
                            ? "text-slate-200"
                            : "text-slate-400"
                        }`}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField("reset-email")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="nama@email.com"
                        disabled={loading}
                        required
                        autoComplete="email"
                        className="w-full bg-transparent pl-9 pr-3.5 py-2 min-h-[38px] text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-xs transition-all active:scale-98 min-h-[40px] cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span className="text-xs">Memproses...</span>
                      </div>
                    ) : (
                      <>
                        <span>Kirim Link Reset</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="w-full text-center text-xs text-slate-400 hover:text-white transition-colors pt-0.5 cursor-pointer"
                  >
                    Kembali ke Login
                  </button>
                </form>
              )
            ) : (
              <>
                {/* OAuth Buttons (Google / GitHub) */}
                <div className="grid grid-cols-2 gap-2.5 animate-fade-in-up" style={{ animationDelay: "220ms" }}>
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="group flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] hover:border-white/[0.22] shadow-xs transition-all active:scale-98 disabled:opacity-50 min-h-[38px] cursor-pointer"
                  >
                    <GoogleIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGithubLogin}
                    disabled={loading}
                    className="group flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] hover:border-white/[0.22] shadow-xs transition-all active:scale-98 disabled:opacity-50 min-h-[38px] cursor-pointer"
                  >
                    <GitHubIcon className="w-3.5 h-3.5 shrink-0 text-slate-100" />
                    <span>GitHub</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative animate-fade-in-up" style={{ animationDelay: "250ms" }}>
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.08]" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                    <span className="bg-[#030712] px-2.5 py-0.5 text-slate-400 font-medium rounded-md border border-white/[0.08]">
                      atau masuk via email
                    </span>
                  </div>
                </div>

                {/* Form Input Email & Password */}
                <form onSubmit={handleSubmit} className="space-y-3.5 pt-0.5">
                  {/* Email Field */}
                  <div className="space-y-1 animate-fade-in-up" style={{ animationDelay: "280ms" }}>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Email
                    </label>
                    <div
                      className={`relative flex items-center rounded-xl border transition-all duration-150 overflow-hidden ${
                        focusedField === "email"
                          ? "border-brand-500 bg-white/[0.08] ring-2 ring-brand-500/30"
                          : email.length > 0
                          ? "border-white/[0.2] bg-white/[0.05]"
                          : "border-white/[0.12] bg-white/[0.03] hover:border-white/[0.22]"
                      }`}
                    >
                      <Mail
                        className={`absolute left-3 w-4 h-4 transition-colors ${
                          focusedField === "email"
                            ? "text-brand-400"
                            : email.length > 0
                            ? "text-slate-200"
                            : "text-slate-400"
                        }`}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="nama@email.com"
                        disabled={loading}
                        required
                        autoComplete="email"
                        className="w-full bg-transparent pl-9 pr-3.5 py-2 min-h-[38px] text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-50 font-medium"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1 animate-fade-in-up" style={{ animationDelay: "310ms" }}>
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setResetSent(false);
                        }}
                        className="text-[11px] text-slate-400 hover:text-brand-400 hover:underline transition-colors cursor-pointer"
                      >
                        Lupa password?
                      </button>
                    </div>
                    <div
                      className={`relative flex items-center rounded-xl border transition-all duration-150 overflow-hidden ${
                        focusedField === "password"
                          ? "border-brand-500 bg-white/[0.08] ring-2 ring-brand-500/30"
                          : password.length > 0
                          ? "border-white/[0.2] bg-white/[0.05]"
                          : "border-white/[0.12] bg-white/[0.03] hover:border-white/[0.22]"
                      }`}
                    >
                      <Lock
                        className={`absolute left-3 w-4 h-4 transition-colors ${
                          focusedField === "password"
                            ? "text-brand-400"
                            : password.length > 0
                            ? "text-slate-200"
                            : "text-slate-400"
                        }`}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="••••••••"
                        disabled={loading}
                        required
                        autoComplete="current-password"
                        className="w-full bg-transparent pl-9 pr-10 py-2 min-h-[38px] text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-50 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        tabIndex={-1}
                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5 text-cyan-400" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 active:scale-98 transition-all disabled:opacity-50 shadow-xs min-h-[40px] cursor-pointer"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Memproses...</span>
                        </div>
                      ) : (
                        <>
                          <span>Masuk ke Akun</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
            </div>
          </div>

          {/* 2. Secondary Switcher Box */}
          <div
            className="rounded-xl border border-white/[0.12] bg-[#030712]/60 backdrop-blur-md p-3 text-center text-xs text-slate-300 shadow-xs animate-fade-in-up"
            style={{ animationDelay: "370ms" }}
          >
            Belum memiliki akun?{" "}
            <Link
              href="/register"
              className="font-bold text-brand-400 hover:text-brand-300 underline underline-offset-4 transition-colors ml-1 inline-flex items-center gap-1 group"
            >
              <span>Daftar Sekarang</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

        </div>
      </main>

      {/* Social Media & Footer with Enhanced Hover Effects */}
      <footer
        className="w-full py-6 px-4 border-t border-white/[0.08] z-10 flex flex-col items-center justify-center gap-3.5 max-w-4xl mx-auto text-center animate-fade-in-up"
        style={{ animationDelay: "400ms" }}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/[0.12] bg-white/[0.03] hover:bg-emerald-500/15 hover:border-emerald-400/50 flex items-center justify-center text-slate-300 hover:text-emerald-400 transition-all active:scale-95 group shadow-2xs"
          >
            <WhatsAppIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </a>
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/[0.12] bg-white/[0.03] hover:bg-rose-500/15 hover:border-rose-400/50 flex items-center justify-center text-slate-300 hover:text-rose-400 transition-all active:scale-95 group shadow-2xs"
          >
            <InstagramIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </a>
          <a
            href={socialLinks.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            title="TikTok"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/[0.12] bg-white/[0.03] hover:bg-cyan-500/15 hover:border-cyan-400/50 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-all active:scale-95 group shadow-2xs"
          >
            <TikTokIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </a>
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.12] hover:border-white/60 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 group shadow-2xs"
          >
            <GitHubIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </a>
        </div>

        <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
          &copy; 2026 <span className="text-slate-300 font-medium">JOBLIB505 FORUM GROUP</span>. Semua hak dilindungi undang-undang.
        </p>
      </footer>
    </div>
  );
}
