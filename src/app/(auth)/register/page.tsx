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
import { WalkingCat } from "@/components/ui/walking-cat";
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
    if (!password) return { label: "", score: 0, color: "bg-[#ECE9D8]" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { label: "Lemah", score: 1, color: "bg-rose-500" };
    if (score <= 3) return { label: "Sedang", score: 2, color: "bg-amber-500" };
    return { label: "Kuat", score: 3, color: "bg-emerald-600" };
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
    <div className="relative min-h-screen flex flex-col justify-between vt-desktop-bg text-[#1C1917] overflow-x-hidden selection:bg-[#C2553A]/20 selection:text-[#C2553A]">

      {/* Ambient Background */}
      <TechBackground />

      {/* Main Single Centered Retro OS Window Register Layout */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 z-10 w-full">
        <div className="w-full max-w-[440px] mx-auto text-left space-y-3">

          {/* Primary Window: REGISTER.EXE */}
          <div
            className={`vt-window rounded-none overflow-hidden shadow-md text-left ${
              isShaking ? "animate-shake" : isSuccess ? "animate-success-pulse" : ""
            }`}
          >
            {/* Window Titlebar */}
            <div className="vt-titlebar px-2.5 py-1.5 flex items-center justify-between select-none">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <VelqoraMark size={16} />
                <span className="font-mono text-xs font-bold tracking-wide text-white truncate uppercase">
                  REGISTER.EXE — CREATE NEW VELQORA ACCOUNT
                </span>
              </div>
              {/* Controls */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button type="button" className="vt-window-btn" title="Minimize">_</button>
                <button type="button" className="vt-window-btn font-sans" title="Maximize">□</button>
                <Link href="/" className="vt-window-btn vt-window-btn-close flex items-center justify-center" title="Close">×</Link>
              </div>
            </div>

            {/* Retro Window Menu Bar */}
            <div className="px-3 py-1 bg-[#ECE9D8] border-b border-[#7A756D] flex items-center gap-3 text-[11px] font-mono text-[#1C1917] select-none">
              <span className="cursor-pointer hover:underline">File</span>
              <span className="cursor-pointer hover:underline">Edit</span>
              <span className="cursor-pointer hover:underline">View</span>
              <span className="cursor-pointer hover:underline">Help</span>
            </div>

            {/* Inner Content Body */}
            <div className="p-5 sm:p-6 bg-[#FAF8F5] space-y-4">
              {/* Header Title & Subtitle */}
              <div className="space-y-1.5 text-center">
                <div className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-[#FAF3EF] text-[#C2553A] border border-[#C2553A]/30">
                  WORKSPACE // NEW USER ENROLLMENT
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1C1917] tracking-tight font-sans">
                  Daftar Akun Baru
                </h1>
                <p className="text-xs text-[#524B42] leading-relaxed max-w-xs mx-auto font-sans">
                  Buat akun untuk mulai mengelola modul, jadwal, dan asisten AI Anda
                </p>
              </div>

              {/* OAuth Buttons (Google & GitHub) */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-2 px-3 vt-btn-chrome text-xs font-mono font-bold disabled:opacity-50"
                >
                  <GoogleIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGithubLogin}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-2 px-3 vt-btn-chrome text-xs font-mono font-bold disabled:opacity-50"
                >
                  <GitHubIcon className="w-3.5 h-3.5 shrink-0 text-[#1C1917]" />
                  <span>GitHub</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#7A756D]/30" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-mono">
                  <span className="bg-[#FAF8F5] px-2.5 py-0.5 text-[#853827] font-bold">
                    atau daftar via email
                  </span>
                </div>
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleRegister} className="space-y-3.5 pt-0.5">
                {/* Full Name Field */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-[#853827] uppercase tracking-wider block">
                    Nama Lengkap
                  </label>
                  <div className="relative flex items-center border-t-2 border-l-2 border-[#7A756D] border-b border-r border-[#FFFFFF] bg-[#FFFFFF]">
                    <User className="absolute left-3 w-4 h-4 text-[#8A8378]" />
                    <input
                      id="register-name-input"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={() => setFocusedField("fullName")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Nama lengkap Anda"
                      disabled={loading}
                      required
                      className="w-full bg-transparent pl-9 pr-3 py-2 text-sm font-sans text-[#1C1917] placeholder:text-[#8A8378] focus:outline-hidden disabled:opacity-50 font-medium"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-[#853827] uppercase tracking-wider block">
                    Email
                  </label>
                  <div className="relative flex items-center border-t-2 border-l-2 border-[#7A756D] border-b border-r border-[#FFFFFF] bg-[#FFFFFF]">
                    <Mail className="absolute left-3 w-4 h-4 text-[#8A8378]" />
                    <input
                      id="register-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="nama@email.com"
                      disabled={loading}
                      required
                      autoComplete="email"
                      className="w-full bg-transparent pl-9 pr-3 py-2 text-sm font-sans text-[#1C1917] placeholder:text-[#8A8378] focus:outline-hidden disabled:opacity-50 font-medium"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono font-bold text-[#853827] uppercase tracking-wider block">
                      Password
                    </label>
                    {password && (
                      <span className="text-[10px] font-mono">
                        Kekuatan: <span className="font-bold text-[#1C1917]">{passwordStrength.label}</span>
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center border-t-2 border-l-2 border-[#7A756D] border-b border-r border-[#FFFFFF] bg-[#FFFFFF]">
                    <Lock className="absolute left-3 w-4 h-4 text-[#8A8378]" />
                    <input
                      id="register-password-input"
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
                      className="w-full bg-transparent pl-9 pr-10 py-2 text-sm font-sans text-[#1C1917] placeholder:text-[#8A8378] focus:outline-hidden disabled:opacity-50 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 p-1 text-[#8A8378] hover:text-[#1C1917] cursor-pointer"
                      tabIndex={-1}
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-[#C2553A]" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {password && (
                    <div className="grid grid-cols-3 gap-1 pt-1">
                      <div className={`h-1.5 border border-[#7A756D]/40 ${passwordStrength.score >= 1 ? passwordStrength.color : "bg-[#ECE9D8]"}`} />
                      <div className={`h-1.5 border border-[#7A756D]/40 ${passwordStrength.score >= 2 ? passwordStrength.color : "bg-[#ECE9D8]"}`} />
                      <div className={`h-1.5 border border-[#7A756D]/40 ${passwordStrength.score >= 3 ? passwordStrength.color : "bg-[#ECE9D8]"}`} />
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono font-bold text-[#853827] uppercase tracking-wider block">
                      Konfirmasi Password
                    </label>
                    {confirmPassword && (
                      <span className="text-[10px] font-mono">
                        {password === confirmPassword ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Cocok
                          </span>
                        ) : (
                          <span className="text-rose-600 font-bold">Tidak cocok</span>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center border-t-2 border-l-2 border-[#7A756D] border-b border-r border-[#FFFFFF] bg-[#FFFFFF]">
                    <Lock className="absolute left-3 w-4 h-4 text-[#8A8378]" />
                    <input
                      id="register-confirm-password-input"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Ulangi password"
                      disabled={loading}
                      required
                      autoComplete="new-password"
                      className="w-full bg-transparent pl-9 pr-10 py-2 text-sm font-sans text-[#1C1917] placeholder:text-[#8A8378] focus:outline-hidden disabled:opacity-50 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 p-1 text-[#8A8378] hover:text-[#1C1917] cursor-pointer"
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-[#C2553A]" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms Note */}
                <p className="text-[11px] font-mono text-[#524B42] text-center leading-relaxed pt-0.5">
                  Dengan mendaftar, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi Velqora.
                </p>

                {/* Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading || isSuccess}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 vt-btn-terracotta text-xs font-mono font-bold disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white shrink-0" />
                        <span>Mendaftarkan Akun...</span>
                      </div>
                    ) : isSuccess ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                        <span>Pendaftaran Berhasil!</span>
                      </div>
                    ) : (
                      <>
                        <span>DAFTAR AKUN BARU</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* 🐾 Walking Cat Easter Egg */}
              <WalkingCat />
            </div>

            {/* Retro Inset Status Bar */}
            <div className="px-3 py-1 bg-[#ECE9D8] border-t-2 border-[#FFFFFF] flex items-center justify-between text-[11px] font-mono text-[#524B42] select-none">
              <span className="flex items-center gap-1.5 truncate">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                {loading ? "REGISTERING USER..." : "SYSTEM READY · ENROLLMENT PORTAL"}
              </span>
              <span className="text-[#8A8378] hidden sm:inline">VELQORA_KERNEL · 64-BIT</span>
            </div>
          </div>

          {/* Secondary Switcher Box */}
          <div className="vt-window rounded-none p-3 text-center text-xs font-mono text-[#524B42] bg-[#FAF8F5] shadow-xs">
            Sudah memiliki akun?{" "}
            <Link
              href="/login"
              className="font-bold text-[#C2553A] hover:underline inline-flex items-center gap-1"
            >
              <span>Masuk ke Akun ▸</span>
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
