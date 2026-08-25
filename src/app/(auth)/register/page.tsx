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
import { VelqoraMark, Logo } from "@/components/ui/logo";

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
        <radialGradient id="ig-grad-reg" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(6 18) rotate(-45) scale(20.5)">
          <stop offset="0" stopColor="#FFDD55" />
          <stop offset="0.3" stopColor="#FF543E" />
          <stop offset="0.6" stopColor="#C837AB" />
          <stop offset="1" stopColor="#3771C8" />
        </radialGradient>
      </defs>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="url(#ig-grad-reg)" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="4.2" stroke="url(#ig-grad-reg)" strokeWidth="2" fill="none" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="url(#ig-grad-reg)" />
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

  const socialLinks = {
    whatsapp: "https://wa.me/6283162031942",
    instagram: "https://instagram.com/wahyualdriy",
    tiktok: "https://tiktok.com/@wahyuhengsem",
    github: "https://github.com/WahyuAldiRiyanto",
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: "", score: 0, color: "bg-slate-700" };
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
        toast.error(`Gagal menghubungkan Google: ${error.message}`, { id: "google-login" });
      } else if (data?.url) {
        toast.success("Mengarahkan ke Google...", { id: "google-login" });
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast.error(err?.message || "Google Provider belum diaktifkan di Supabase Dashboard", { id: "google-login" });
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
        toast.error(`Gagal menghubungkan GitHub: ${error.message}`, { id: "github-login" });
      } else if (data?.url) {
        toast.success("Mengarahkan ke GitHub...", { id: "github-login" });
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast.error(err?.message || "GitHub Provider belum diaktifkan di Supabase Dashboard", { id: "github-login" });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Nama lengkap wajib diisi");
      return;
    }

    if (!email) {
      toast.error("Email wajib diisi");
      return;
    }

    if (password.length < 6) {
      toast.error("Kata sandi minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const normalizedEmail = email.trim().toLowerCase();
    const isOwner = normalizedEmail === "wahyualdiriyanto80@gmail.com";

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
          toast.error("Email sudah terdaftar. Silakan langsung masuk ke akun Anda.");
          router.push("/login");
        } else {
          toast.error(error.message);
        }
      } else {
        // Coba auto sign in
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
          toast.success(`Pendaftaran berhasil! Selamat datang di Velqora, ${fullName.trim()}!`);
          router.push("/dashboard");
          router.refresh();
          return;
        }

        toast.success(
          "Pendaftaran berhasil! Silakan masuk dengan email dan kata sandi Anda."
        );
        router.push("/login");
      }
    } catch (err: any) {
      toast.error(err?.message || "Terjadi kesalahan pada pendaftaran akun");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between text-white overflow-x-hidden selection:bg-[#0071e3] selection:text-white">

      {/* Interactive Tech Canvas Background (Subtle Variant) */}
      <TechBackground variant="subtle" />

      {/* Floating Header */}
      <header className="sticky top-0 z-40 w-full pt-4 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto rounded-2xl border border-white/[0.1] bg-[#0c1322]/60 backdrop-blur-xl px-4 py-2.5 flex items-center justify-between shadow-md">
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <Logo variant="sidebar" />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
            >
              <span>Masuk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Register Card Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 z-10">
        <div className="w-full max-w-[440px] text-center space-y-4">

          {/* 1. Primary Card: Register Form with Doodle Wallpaper Inside */}
          <div className="relative rounded-3xl border border-white/[0.18] bg-[#070b14]/80 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-left transition-all duration-300 hover:border-blue-500/40 hover:shadow-[0_24px_70px_rgba(0,113,227,0.22)] overflow-hidden animate-fade-in-up">

            {/* ─── DOODLE ART WALLPAPER INSIDE REGISTER BOX ─── */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-3xl select-none">
              {/* Doodle Artwork with Invert & Dark Ambient Blending */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-[0.20] invert mix-blend-screen transition-opacity duration-300"
                style={{
                  backgroundImage: `url('/images/auth/login-doodle-wallpaper.png')`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              {/* Dark Gradient Veil for 100% Crisp Legibility & Contrast */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/85 via-[#070b14]/75 to-[#070b14]/90" />
              {/* Top edge glass specular reflection */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
            </div>

            {/* Inner Content Layer (z-10 relative) */}
            <div className="relative z-10 space-y-6">

              {/* Velqora Brand Mark Header */}
              <div className="flex flex-col items-center justify-center pt-2">
                  <VelqoraMark size={36} />
              </div>

            {/* Header Form */}
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Daftar Akun Baru
              </h1>
              <p className="text-xs text-text-secondary min-h-[20px] flex items-center justify-center">
                Buat akun untuk mulai mengelola modul dan materi belajar Anda
              </p>
            </div>

            {/* OAuth Buttons (Google / GitHub) */}
            <div className="grid grid-cols-2 gap-3 animate-fade-in-up" style={{ animationDelay: "180ms" }}>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="group flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.1] backdrop-blur-md border border-white/[0.12] hover:border-blue-400/40 shadow-md hover:shadow-[0_0_20px_rgba(66,133,244,0.25)] transition-all duration-200 active:scale-[0.97] disabled:opacity-50"
              >
                <GoogleIcon className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span className="group-hover:text-white transition-colors">Google</span>
              </button>

              <button
                type="button"
                onClick={handleGithubLogin}
                disabled={loading}
                className="group flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.1] backdrop-blur-md border border-white/[0.12] hover:border-slate-400/50 shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-200 active:scale-[0.97] disabled:opacity-50"
              >
                <GitHubIcon className="w-4 h-4 shrink-0 text-slate-100 group-hover:scale-110 transition-transform duration-200" />
                <span className="group-hover:text-white transition-colors">GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: "210ms" }}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.08]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-[#0b101c]/90 backdrop-blur-md px-3 py-0.5 text-slate-400 font-medium rounded-full border border-white/[0.08] shadow-sm">
                  atau daftar via email
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Full Name Field */}
              <div className="space-y-1.5 animate-fade-in-up" style={{ animationDelay: "240ms" }}>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  Nama Lengkap
                </label>
                <div
                  className={`relative flex items-center rounded-xl border backdrop-blur-md transition-all duration-200 overflow-hidden ${
                    focusedField === "fullName"
                      ? "border-[#0071e3] bg-white/[0.08] ring-2 ring-[#0071e3]/40 shadow-[0_0_20px_rgba(0,113,227,0.3)]"
                      : fullName.length > 0
                      ? "border-white/[0.2] bg-white/[0.05]"
                      : "border-white/[0.1] bg-white/[0.03] hover:border-white/[0.2]"
                  }`}
                >
                  <User
                    className={`absolute left-3.5 w-4 h-4 transition-all duration-200 ${
                      focusedField === "fullName"
                        ? "text-[#2997ff] scale-110 drop-shadow-[0_0_8px_rgba(0,113,227,0.8)]"
                        : fullName.length > 0
                        ? "text-slate-200"
                        : "text-slate-400"
                    }`}
                  />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onFocus={() => setFocusedField("fullName")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Contoh: Budi Santoso"
                    disabled={loading}
                    required
                    className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-50 font-medium"
                  />
                  {focusedField === "fullName" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2997ff] to-transparent animate-pulse" />
                  )}
                </div>
              </div>

              {/* Email Field with Dynamic Typing & Glow Animation */}
              <div className="space-y-1.5 animate-fade-in-up" style={{ animationDelay: "270ms" }}>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">
                    Alamat Email
                  </label>
                </div>
                <div
                  className={`relative flex items-center rounded-xl border backdrop-blur-md transition-all duration-200 overflow-hidden ${
                    focusedField === "email"
                      ? "border-[#0071e3] bg-white/[0.08] ring-2 ring-[#0071e3]/40 shadow-[0_0_20px_rgba(0,113,227,0.3)]"
                      : email.length > 0
                      ? "border-white/[0.2] bg-white/[0.05]"
                      : "border-white/[0.1] bg-white/[0.03] hover:border-white/[0.2]"
                  }`}
                >
                  <Mail
                    className={`absolute left-3.5 w-4 h-4 transition-all duration-200 ${
                      focusedField === "email"
                        ? "text-[#2997ff] scale-110 drop-shadow-[0_0_8px_rgba(0,113,227,0.8)]"
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
                    className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-50 font-medium"
                  />
                  {focusedField === "email" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2997ff] to-transparent animate-pulse" />
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Kata Sandi
                  </label>
                  {password && (
                    <span className="text-[10px] font-mono text-slate-400">
                      Kekuatan: <span className="font-semibold text-slate-200">{passwordStrength.label}</span>
                    </span>
                  )}
                </div>
                <div
                  className={`relative flex items-center rounded-xl border backdrop-blur-md transition-all duration-200 overflow-hidden ${
                    focusedField === "password"
                      ? "border-[#0071e3] bg-white/[0.08] ring-2 ring-[#0071e3]/40 shadow-[0_0_20px_rgba(0,113,227,0.3)]"
                      : password.length > 0
                      ? "border-white/[0.2] bg-white/[0.05]"
                      : "border-white/[0.1] bg-white/[0.03] hover:border-white/[0.2]"
                  }`}
                >
                  <Lock
                    className={`absolute left-3.5 w-4 h-4 transition-all duration-200 ${
                      focusedField === "password"
                        ? "text-[#2997ff] scale-110 drop-shadow-[0_0_8px_rgba(0,113,227,0.8)]"
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
                    placeholder="Minimal 6 karakter"
                    disabled={loading}
                    required
                    minLength={6}
                    className="w-full bg-transparent pl-10 pr-11 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-50 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-white transition-all duration-200 hover:scale-110 active:scale-90"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-cyan-400" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {focusedField === "password" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2997ff] to-transparent animate-pulse" />
                  )}
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="grid grid-cols-3 gap-1.5 pt-1 animate-fade-in">
                    <div className={`h-1 rounded-full ${passwordStrength.score >= 1 ? passwordStrength.color : "bg-white/[0.08]"}`} />
                    <div className={`h-1 rounded-full ${passwordStrength.score >= 2 ? passwordStrength.color : "bg-white/[0.08]"}`} />
                    <div className={`h-1 rounded-full ${passwordStrength.score >= 3 ? passwordStrength.color : "bg-white/[0.08]"}`} />
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5 animate-fade-in-up" style={{ animationDelay: "330ms" }}>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Konfirmasi Kata Sandi
                  </label>
                  {confirmPassword && (
                    <span className="text-[10px] font-mono">
                      {password === confirmPassword ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Cocok
                        </span>
                      ) : (
                        <span className="text-rose-400 font-semibold">Tidak cocok</span>
                      )}
                    </span>
                  )}
                </div>
                <div
                  className={`relative flex items-center rounded-xl border backdrop-blur-md transition-all duration-200 overflow-hidden ${
                    focusedField === "confirmPassword"
                      ? "border-[#0071e3] bg-white/[0.08] ring-2 ring-[#0071e3]/40 shadow-[0_0_20px_rgba(0,113,227,0.3)]"
                      : confirmPassword.length > 0
                      ? "border-white/[0.2] bg-white/[0.05]"
                      : "border-white/[0.1] bg-white/[0.03] hover:border-white/[0.2]"
                  }`}
                >
                  <Lock
                    className={`absolute left-3.5 w-4 h-4 transition-all duration-200 ${
                      focusedField === "confirmPassword"
                        ? "text-[#2997ff] scale-110 drop-shadow-[0_0_8px_rgba(0,113,227,0.8)]"
                        : confirmPassword.length > 0
                        ? "text-slate-200"
                        : "text-slate-400"
                    }`}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Ulangi kata sandi"
                    disabled={loading}
                    required
                    className="w-full bg-transparent pl-10 pr-11 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-50 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-white transition-all duration-200 hover:scale-110 active:scale-90"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-cyan-400" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {focusedField === "confirmPassword" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2997ff] to-transparent animate-pulse" />
                  )}
                </div>
              </div>

              {/* Terms and Privacy Policy Note */}
              <p className="text-[11px] text-slate-400 text-center leading-relaxed px-1 animate-fade-in-up" style={{ animationDelay: "360ms" }}>
                Dengan mendaftar, Anda menyetujui <span className="text-slate-300 underline">Ketentuan Layanan</span> dan <span className="text-slate-300 underline">Kebijakan Privasi</span> Velqora.
              </p>

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 active:scale-[0.98] transition-colors disabled:opacity-50 min-h-[42px]"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Mendaftarkan...</span>
                    </div>
                  ) : (
                    <>
                      <span>Daftar Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
            </div>
          </div>

          {/* 2. Secondary Switcher Box with Floating Border & Glow */}
          <div className="rounded-2xl border border-white/[0.16] bg-[#070b14]/35 backdrop-blur-md p-4 sm:p-5 text-center text-xs sm:text-sm text-slate-200 shadow-lg shadow-black/30 hover:border-white/[0.25] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "420ms" }}>
            Sudah memiliki akun?{" "}
            <Link
              href="/login"
              className="font-bold text-[#2997ff] hover:text-blue-300 underline underline-offset-4 transition-all duration-200 ml-1 inline-flex items-center gap-1 group"
            >
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </main>

      {/* Social Media & Footer with Enhanced Hover Effects */}
      <footer className="w-full py-8 px-4 border-t border-white/[0.08] z-10 flex flex-col items-center justify-center gap-4 max-w-5xl mx-auto text-center animate-fade-in-up" style={{ animationDelay: "450ms" }}>
        <div className="flex items-center justify-center gap-3.5 sm:gap-5">
          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp"
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl border border-white/[0.12] bg-white/[0.03] hover:bg-emerald-500/15 hover:border-emerald-400/60 hover:shadow-[0_0_25px_rgba(37,211,102,0.4)] flex items-center justify-center text-slate-300 hover:text-emerald-400 transition-all duration-300 hover:scale-110 active:scale-95 group backdrop-blur-md"
          >
            <WhatsAppIcon className="w-6 h-6 sm:w-6.5 sm:h-6.5 group-hover:scale-115 group-hover:rotate-6 transition-transform duration-300" />
          </a>
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl border border-white/[0.12] bg-white/[0.03] hover:bg-rose-500/15 hover:border-rose-400/60 hover:shadow-[0_0_25px_rgba(200,55,171,0.4)] flex items-center justify-center text-slate-300 hover:text-rose-400 transition-all duration-300 hover:scale-110 active:scale-95 group backdrop-blur-md"
          >
            <InstagramIcon className="w-6 h-6 sm:w-6.5 sm:h-6.5 group-hover:scale-115 group-hover:-rotate-6 transition-transform duration-300" />
          </a>
          <a
            href={socialLinks.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            title="TikTok"
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl border border-white/[0.12] bg-white/[0.03] hover:bg-cyan-500/15 hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(105,201,208,0.4)] flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-all duration-300 hover:scale-110 active:scale-95 group backdrop-blur-md"
          >
            <TikTokIcon className="w-6 h-6 sm:w-6.5 sm:h-6.5 group-hover:scale-115 group-hover:rotate-6 transition-transform duration-300" />
          </a>
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl border border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.15] hover:border-white/70 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 group backdrop-blur-md"
          >
            <GitHubIcon className="w-6 h-6 sm:w-6.5 sm:h-6.5 group-hover:scale-115 group-hover:-rotate-6 transition-transform duration-300" />
          </a>
        </div>

        <p className="text-xs text-text-secondary">
          &copy; {new Date().getFullYear()} JOBLIB505 FORUM GROUP. Semua hak dilindungi undang-undang.
        </p>
      </footer>
    </div>
  );
}
