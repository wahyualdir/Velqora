"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { TechBackground } from "@/components/ui/tech-background";
import { VelqoraMark } from "@/components/ui/logo";
import { RegisterTypingIllustration } from "@/components/ui/auth-illustrations";
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

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Micro-interaction states: error shake & positive success pulse
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const triggerErrorState = (message: string) => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 350);
    toast.error(message);
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: "", score: 0, color: "bg-border" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { label: "Lemah", score: 1, color: "bg-rose-500" };
    if (score <= 3) return { label: "Sedang", score: 2, color: "bg-amber-500" };
    return { label: "Kuat", score: 3, color: "bg-emerald-500" };
  };

  const passwordStrength = getPasswordStrength();

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      triggerErrorState("Nama lengkap wajib diisi");
      return;
    }

    if (!email.trim()) {
      triggerErrorState("Email wajib diisi");
      return;
    }

    if (password.length < 6) {
      triggerErrorState("Kata sandi minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      triggerErrorState("Konfirmasi kata sandi tidak cocok");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const normalizedEmail = email.trim().toLowerCase();
    const isOwner = isOwnerUser(normalizedEmail);

    try {
      const { error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            display_name: fullName.trim(),
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("user already registered")) {
          triggerErrorState("Email sudah terdaftar. Silakan langsung masuk ke akun Anda.");
          setTimeout(() => router.push("/login"), 1200);
        } else {
          triggerErrorState(error.message);
        }
      } else {
        const { error: autoSignInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (!autoSignInError) {
          const role = isOwner ? "owner" : "user";
          if (typeof window !== "undefined") {
            if (role === "owner") {
              localStorage.setItem("user_role", role);
            }
          }
          setIsSuccess(true);
          toast.success(`Pendaftaran berhasil! Selamat datang di Velqora, ${fullName.trim()}!`);
          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 400);
          return;
        }

        setIsSuccess(true);
        toast.success(
          "Pendaftaran berhasil! Silakan masuk dengan email dan kata sandi Anda."
        );
        setTimeout(() => {
          router.push("/login");
        }, 400);
      }
    } catch (err: any) {
      triggerErrorState(err?.message || "Terjadi kesalahan pada pendaftaran akun");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-surface-subtle text-ink overflow-x-hidden selection:bg-brand/20 selection:text-brand">

      {/* Subtle Background */}
      <TechBackground />

      {/* Main Register Layout (Responsive Split 45/55 on Desktop, Focused on Mobile) */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 z-10 w-full">
        <div className="w-full max-w-[420px] lg:max-w-[920px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Column: Form & Switcher */}
          <div className="lg:col-span-6 w-full max-w-[420px] mx-auto flex flex-col justify-between space-y-4">

            {/* 1. Primary Card: Register Form */}
            <div
              className={`relative rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm text-left overflow-hidden opacity-0 animate-card-entrance motion-reduce:opacity-100 motion-reduce:animate-none ${
                isShaking ? "animate-shake" : isSuccess ? "animate-success-pulse" : ""
              }`}
            >
              {/* Inner Content Layer */}
              <div className="relative z-10 space-y-4">
                {/* Header: Brand Mark Logo with Fade-In + Scale Entrance */}
                <div className="flex flex-col items-center justify-center pt-0.5 animate-logo-entrance motion-reduce:animate-none">
                  <VelqoraMark size={32} />
                </div>

                {/* Header Title & Subtitle */}
                <div className="space-y-1.5 text-center">
                  <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight font-display">
                    Daftar Akun Baru
                  </h1>
                  <p className="text-xs sm:text-[13px] text-ink-muted leading-relaxed max-w-xs mx-auto">
                    Buat akun untuk mulai mengelola modul, jadwal, dan asisten AI Anda
                  </p>
                </div>

                {/* OAuth Buttons (Google & GitHub) */}
                <div className="grid grid-cols-2 gap-3 animate-fade-in-up" style={{ animationDelay: "180ms" }}>
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="group flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-[10px] text-xs sm:text-sm font-medium text-ink bg-surface hover:bg-surface-subtle border border-border hover:border-border-focus shadow-2xs transition-all duration-150 disabled:opacity-50 min-h-[42px] cursor-pointer"
                  >
                    <GoogleIcon className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-105" />
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGithubLogin}
                    disabled={loading}
                    className="group flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-[10px] text-xs sm:text-sm font-medium text-ink bg-surface hover:bg-surface-subtle border border-border hover:border-border-focus shadow-2xs transition-all duration-150 disabled:opacity-50 min-h-[42px] cursor-pointer"
                  >
                    <GitHubIcon className="w-4 h-4 shrink-0 text-ink transition-transform duration-150 group-hover:scale-105" />
                    <span>GitHub</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative animate-fade-in-up py-1" style={{ animationDelay: "210ms" }}>
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                    <span className="bg-surface px-3 py-0.5 text-ink-muted font-medium rounded-full border border-border">
                      atau daftar via email
                    </span>
                  </div>
                </div>

                {/* Form Input Fields */}
                <form onSubmit={handleRegister} className="space-y-3.5 pt-0.5">
                  {/* Full Name Field */}
                  <div className="space-y-1.5 animate-fade-in-up" style={{ animationDelay: "240ms" }}>
                    <label className="text-[11px] font-semibold text-ink uppercase tracking-wider block">
                      Nama Lengkap
                    </label>
                    <div
                      className={`relative flex items-center rounded-[10px] border bg-surface transition-all duration-200 overflow-hidden ${
                        focusedField === "fullName"
                          ? "border-brand ring-4 ring-brand/10 shadow-xs"
                          : "border-border hover:border-border-focus"
                      }`}
                    >
                      <User
                        className={`absolute left-3.5 w-4 h-4 transition-colors duration-200 ${
                          focusedField === "fullName"
                            ? "text-brand"
                            : "text-ink-muted"
                        }`}
                      />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onFocus={() => setFocusedField("fullName")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Nama lengkap Anda"
                        disabled={loading}
                        required
                        className="w-full bg-surface pl-10 pr-4 py-3 min-h-[44px] text-[15px] text-ink placeholder:text-ink-placeholder focus:outline-hidden disabled:opacity-50 font-medium transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1.5 animate-fade-in-up" style={{ animationDelay: "270ms" }}>
                    <label className="text-[11px] font-semibold text-ink uppercase tracking-wider block">
                      Email
                    </label>
                    <div
                      className={`relative flex items-center rounded-[10px] border bg-surface transition-all duration-200 overflow-hidden ${
                        focusedField === "email"
                          ? "border-brand ring-4 ring-brand/10 shadow-xs"
                          : "border-border hover:border-border-focus"
                      }`}
                    >
                      <Mail
                        className={`absolute left-3.5 w-4 h-4 transition-colors duration-200 ${
                          focusedField === "email"
                            ? "text-brand"
                            : "text-ink-muted"
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
                        className="w-full bg-surface pl-10 pr-4 py-3 min-h-[44px] text-[15px] text-ink placeholder:text-ink-placeholder focus:outline-hidden disabled:opacity-50 font-medium transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-ink uppercase tracking-wider block">
                        Password
                      </label>
                      {password && (
                        <span className="text-[10px] text-ink-muted">
                          Kekuatan: <span className="font-semibold text-ink">{passwordStrength.label}</span>
                        </span>
                      )}
                    </div>
                    <div
                      className={`relative flex items-center rounded-[10px] border bg-surface transition-all duration-200 overflow-hidden ${
                        focusedField === "password"
                          ? "border-brand ring-4 ring-brand/10 shadow-xs"
                          : "border-border hover:border-border-focus"
                      }`}
                    >
                      <Lock
                        className={`absolute left-3.5 w-4 h-4 transition-colors duration-200 ${
                          focusedField === "password"
                            ? "text-brand"
                            : "text-ink-muted"
                        }`}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Minimal 6 karakter"
                        disabled={loading}
                        required
                        minLength={6}
                        autoComplete="new-password"
                        className="w-full bg-surface pl-10 pr-11 py-3 min-h-[44px] text-[15px] text-ink placeholder:text-ink-placeholder focus:outline-hidden disabled:opacity-50 font-medium transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 p-1 text-ink-muted hover:text-ink transition-colors cursor-pointer"
                        tabIndex={-1}
                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                      >
                        <span className="inline-flex items-center justify-center transition-transform duration-150 ease-out hover:scale-110 active:scale-90">
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-brand transition-all duration-150" />
                          ) : (
                            <Eye className="w-4 h-4 transition-all duration-150" />
                          )}
                        </span>
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {password && (
                      <div className="grid grid-cols-3 gap-1 pt-0.5 animate-fade-in">
                        <div className={`h-1 rounded-full ${passwordStrength.score >= 1 ? passwordStrength.color : "bg-border"}`} />
                        <div className={`h-1 rounded-full ${passwordStrength.score >= 2 ? passwordStrength.color : "bg-border"}`} />
                        <div className={`h-1 rounded-full ${passwordStrength.score >= 3 ? passwordStrength.color : "bg-border"}`} />
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-1.5 animate-fade-in-up" style={{ animationDelay: "330ms" }}>
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-ink uppercase tracking-wider block">
                        Konfirmasi Password
                      </label>
                      {confirmPassword && (
                        <span className="text-[10px]">
                          {password === confirmPassword ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Cocok
                            </span>
                          ) : (
                            <span className="text-rose-500 font-semibold">Tidak cocok</span>
                          )}
                        </span>
                      )}
                    </div>
                    <div
                      className={`relative flex items-center rounded-[10px] border bg-surface transition-all duration-200 overflow-hidden ${
                        focusedField === "confirmPassword"
                          ? "border-brand ring-4 ring-brand/10 shadow-xs"
                          : "border-border hover:border-border-focus"
                      }`}
                    >
                      <Lock
                        className={`absolute left-3.5 w-4 h-4 transition-colors duration-200 ${
                          focusedField === "confirmPassword"
                            ? "text-brand"
                            : "text-ink-muted"
                        }`}
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedField("confirmPassword")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Ulangi password"
                        disabled={loading}
                        required
                        autoComplete="new-password"
                        className="w-full bg-surface pl-10 pr-11 py-3 min-h-[44px] text-[15px] text-ink placeholder:text-ink-placeholder focus:outline-hidden disabled:opacity-50 font-medium transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 p-1 text-ink-muted hover:text-ink transition-colors cursor-pointer"
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                      >
                        <span className="inline-flex items-center justify-center transition-transform duration-150 ease-out hover:scale-110 active:scale-90">
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4 text-brand transition-all duration-150" />
                          ) : (
                            <Eye className="w-4 h-4 transition-all duration-150" />
                          )}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Terms Note */}
                  <p className="text-[10.5px] text-ink-muted text-center leading-relaxed pt-0.5 animate-fade-in-up" style={{ animationDelay: "350ms" }}>
                    Dengan mendaftar, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi Velqora.
                  </p>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading || isSuccess}
                      aria-live="polite"
                      className="group w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-[10px] text-sm sm:text-base font-semibold text-white bg-brand hover:bg-brand-hover hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99] transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none min-h-[46px]"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-[spin_600ms_linear_infinite] text-white shrink-0" />
                          <span>Mendaftarkan...</span>
                        </div>
                      ) : isSuccess ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-white shrink-0 animate-scale-in" />
                          <span>Pendaftaran Berhasil!</span>
                        </div>
                      ) : (
                        <>
                          <span>Daftar Akun</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Secondary Switcher Box */}
            <div
              className="rounded-xl border border-border bg-surface p-3.5 text-center text-xs sm:text-sm text-ink-muted shadow-2xs animate-fade-in-up"
              style={{ animationDelay: "370ms" }}
            >
              Sudah memiliki akun?{" "}
              <Link
                href="/login"
                className="font-bold text-brand hover:text-brand-hover underline underline-offset-4 transition-colors ml-1 inline-flex items-center gap-1 group"
              >
                <span>Masuk ke Akun</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-150" />
              </Link>
            </div>
          </div>

          {/* Right Column (55% Desktop): Modern SaaS 2D Minimalist Illustration Showcase */}
          <div
            className="lg:col-span-6 hidden lg:flex flex-col items-center justify-between p-8 rounded-2xl border border-border/80 bg-gradient-to-br from-brand-light to-surface-subtle shadow-sm w-full h-full text-center overflow-hidden opacity-0 animate-card-entrance motion-reduce:opacity-100 motion-reduce:animate-none space-y-5"
            style={{ animationDelay: "200ms" }}
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 text-brand border border-brand-light text-xs font-semibold tracking-wide shadow-2xs">
              <span>Mulai Lebih Awal</span>
            </div>

            {/* 2D Vector Illustration */}
            <div className="w-full flex items-center justify-center py-2">
              <RegisterTypingIllustration className="w-full max-w-[310px] h-auto transition-transform duration-500 hover:scale-[1.02]" />
            </div>

            {/* Caption & Feature Tags */}
            <div className="space-y-2.5">
              <h2 className="text-base sm:text-lg font-bold font-display text-ink tracking-tight">
                Bangun Kebiasaan Belajar Rapi
              </h2>
              <p className="text-xs sm:text-[13px] text-ink-muted leading-relaxed max-w-xs mx-auto">
                Satu akun untuk sinkronisasi jadwal, arsip catatan, dan panduan belajar cerdas sepanjang semester.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-semibold">
                <span className="px-2.5 py-1 rounded-lg bg-white border border-border text-ink shadow-2xs">
                  Gratis Selamanya
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-border text-ink shadow-2xs">
                  Data Terisolasi Aman
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-brand/30 text-brand shadow-2xs">
                  Akses Web & Mobile
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Clean Footer */}
      <footer
        className="w-full py-6 px-4 border-t border-border z-10 flex items-center justify-center max-w-4xl mx-auto text-center animate-fade-in-up"
        style={{ animationDelay: "400ms" }}
      >
        <p className="text-xs text-ink-muted leading-relaxed">
          &copy; 2026 <span className="text-ink font-medium">JOBLIB505 FORUM GROUP</span>. Semua hak dilindungi undang-undang.
        </p>
      </footer>
    </div>
  );
}
