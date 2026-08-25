"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Sun,
  Moon,
  Monitor,
  CheckCircle2,
  Crown,
  Sparkles,
  Save,
  Loader2,
  Layers,
  Check,
  Compass,
  Sliders,
  RotateCcw,
  Download,
  Upload,
  Zap,
  Shield,
  Palette,
  KeyRound,
  FileCode,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ConfirmDialog } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { ThemePreviewBox } from "@/components/settings/theme-preview-box";
import {
  useThemeAccent,
  AccentColor,
  BackgroundStyle,
  THEME_PRESETS,
} from "@/context/theme-accent-context";

type SettingsTab = "theme" | "profile" | "account" | "data";

export default function PengaturanPage() {
  const { theme, setTheme } = useTheme();
  const {
    settings,
    accent,
    setAccent,
    bgStyle,
    setBgStyle,
    density,
    setDensity,
    radius,
    setRadius,
    motion,
    setMotion,
    applyPreset,
    resetToDefaults,
    exportSettings,
    importSettings,
  } = useThemeAccent();

  const [activeTab, setActiveTab] = useState<SettingsTab>("theme");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [institution, setInstitution] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  // Reset & Import Dialog States
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");

  // Available Accent Palettes (7 Choices)
  const ACCENT_OPTIONS: {
    id: AccentColor;
    name: string;
    description: string;
    bgClass: string;
  }[] = [
    {
      id: "platinum",
      name: "Stealth Titanium",
      description: "Slate monokrom minimalis & tenang",
      bgClass: "bg-slate-400",
    },
    {
      id: "indigo",
      name: "Cyber Indigo",
      description: "Biru modern & tajam",
      bgClass: "bg-blue-600",
    },
    {
      id: "emerald",
      name: "Emerald Mint",
      description: "Mint segar & konsentrasi",
      bgClass: "bg-emerald-500",
    },
    {
      id: "violet",
      name: "Royal Violet",
      description: "Ungu futuristik berkelas",
      bgClass: "bg-purple-500",
    },
    {
      id: "amber",
      name: "Solar Amber",
      description: "Emas hangat berenergi",
      bgClass: "bg-amber-500",
    },
    {
      id: "rose",
      name: "Rose Accent",
      description: "Magenta ekspresif",
      bgClass: "bg-pink-500",
    },
    {
      id: "cyan",
      name: "Glacier Cyan",
      description: "Biru es jernih",
      bgClass: "bg-cyan-500",
    },
  ];

  // Fetch Profile & Preferences on Mount
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUser(user);
          const meta = user.user_metadata || {};
          setFullName(meta.full_name || "");
          setBio(meta.bio || "");
          setInstitution(meta.institution || "");
          setAvatarUrl(meta.avatar_url || "");

          const role = meta.role || "student";
          setIsOwner(role === "owner");
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, []);

  // Save Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          bio,
          institution,
          avatar_url: avatarUrl,
          theme_settings: settings,
        },
      });

      if (error) throw error;
      toast.success("Profil berhasil diperbarui!");
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui profil");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyExportJson = () => {
    const jsonStr = exportSettings();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(jsonStr);
      toast.success("Konfigurasi tema disalin ke clipboard!");
    }
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) {
      toast.error("Silakan tempel teks konfigurasi JSON terlebih dahulu");
      return;
    }
    const success = importSettings(importJsonText);
    if (success) {
      setImportModalOpen(false);
      setImportJsonText("");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
        <p className="text-xs font-mono text-text-tertiary">Memuat preferensi workspace...</p>
      </div>
    );
  }

  return (
    <div className="page-container space-y-6 pb-14 animate-fade-in">
      {/* 1. Header */}
      <PageHeader
        eyebrow="~/workspace / settings"
        title="Pengaturan & Preferensi"
        description="Kelola tampilan workspace, tema warna, profil pengguna, dan konfigurasi akun Velqora kamu."
      />

      {/* 2. Structured Settings Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-border/70 overflow-x-auto py-1">
        <button
          type="button"
          onClick={() => setActiveTab("theme")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
            activeTab === "theme"
              ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Tampilan & Tema</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
            activeTab === "profile"
              ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profil Pengguna</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("account")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
            activeTab === "account"
              ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Keamanan & Akun</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("data")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
            activeTab === "data"
              ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Data & Preferensi</span>
        </button>
      </div>

      {/* ─── TAB 1: TAMPILAN & TEMA ─── */}
      {activeTab === "theme" && (
        <div className="space-y-6 animate-fade-in">
          {/* Live Preview */}
          <section className="space-y-2.5">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Pratinjau Antarmuka</span>
            </h2>
            <ThemePreviewBox />
          </section>

          {/* Mode Tampilan Dasar */}
          <section className="space-y-3">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary font-mono flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Mode Tampilan</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  theme === "dark"
                    ? "border-brand-500/60 bg-brand-500/10 shadow-xs ring-1 ring-brand-500/40"
                    : "border-border hover:border-brand-500/30 bg-surface hover:bg-surface-secondary"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-black text-slate-200 flex items-center justify-center border border-border shrink-0">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-text-primary block">Dark Mode</span>
                  <span className="text-[11px] text-text-secondary">Hitam pekat & fokus</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  theme === "light"
                    ? "border-brand-500/60 bg-brand-500/10 shadow-xs ring-1 ring-brand-500/40"
                    : "border-border hover:border-brand-500/30 bg-surface hover:bg-surface-secondary"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white text-slate-800 flex items-center justify-center border border-border shrink-0">
                  <Sun className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-text-primary block">Light Mode</span>
                  <span className="text-[11px] text-text-secondary">Terang & bersih</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  theme === "system"
                    ? "border-brand-500/60 bg-brand-500/10 shadow-xs ring-1 ring-brand-500/40"
                    : "border-border hover:border-brand-500/30 bg-surface hover:bg-surface-secondary"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-surface-secondary text-text-secondary flex items-center justify-center border border-border shrink-0">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-text-primary block">Sistem OS</span>
                  <span className="text-[11px] text-text-secondary">Otomatis sinkron</span>
                </div>
              </button>
            </div>
          </section>

          {/* Warna Aksen */}
          <section className="space-y-3">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary font-mono flex items-center gap-2">
              <Palette className="w-4 h-4 text-brand-400" />
              <span>Warna Aksen Utama</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {ACCENT_OPTIONS.map((opt) => {
                const isSelected = accent === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAccent(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? "border-brand-500/60 bg-brand-500/10 shadow-xs ring-1 ring-brand-500/40"
                        : "border-border hover:border-brand-500/30 bg-surface hover:bg-surface-secondary"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-4 h-4 rounded-full ${opt.bgClass}`} />
                      {isSelected && <Check className="w-3 h-3 text-brand-400" />}
                    </div>
                    <span className="text-xs font-bold text-text-primary truncate">{opt.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Preset Siap Pakai */}
          <section className="space-y-3">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-400" />
              <span>Preset Workspace</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {THEME_PRESETS.slice(0, 3).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  className="p-3.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary hover:border-brand-500/40 text-left transition-all space-y-1 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-text-primary block">{preset.name}</span>
                  <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2">
                    {preset.tagline}
                  </p>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ─── TAB 2: PROFIL PENGGUNA ─── */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-4 rounded-xl border border-border bg-surface p-5 shadow-2xs animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-border/70">
            <h2 className="text-sm font-bold text-text-primary font-display">
              Informasi Profil Belajar
            </h2>
            {isOwner && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Crown className="w-3 h-3" /> Pemilik Sistem
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap"
              placeholder="Contoh: Alex Pratama"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              label="Institusi / Kampus / Sekolah"
              placeholder="Contoh: Universitas Indonesia"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Alamat Email (Akun)"
              value={user?.email || ""}
              disabled
              className="opacity-70 cursor-not-allowed text-xs"
            />

            <Input
              label="Tautan Foto Avatar (URL)"
              placeholder="https://..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>

          <Textarea
            label="Bio Singkat"
            placeholder="Tuliskan fokus belajar teknologi atau minat rekayasa perangkat lunak..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={saving} className="flex items-center gap-2 h-9 text-xs sm:text-sm font-semibold">
              <Save className="w-4 h-4" />
              <span>Simpan Profil</span>
            </Button>
          </div>
        </form>
      )}

      {/* ─── TAB 3: KEAMANAN & AKUN ─── */}
      {activeTab === "account" && (
        <div className="space-y-4 rounded-xl border border-border bg-surface p-5 shadow-2xs animate-fade-in">
          <h2 className="text-sm font-bold text-text-primary font-display pb-2 border-b border-border/70">
            Keamanan Akun & Sesi
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-secondary border border-border">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-text-primary block">Alamat Email Terverifikasi</span>
                <span className="text-[11px] font-mono text-text-secondary">{user?.email || "Tidak ada email"}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Aktif
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-secondary border border-border">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-text-primary block">Kata Sandi Akun</span>
                <span className="text-[11px] text-text-secondary">Ubah kata sandi login melalui email pemulihan</span>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={async () => {
                  if (!user?.email) return;
                  try {
                    const supabase = createClient();
                    await supabase.auth.resetPasswordForEmail(user.email);
                    toast.success("Tautan reset sandi telah dikirim ke email Anda.");
                  } catch {
                    toast.error("Gagal mengirim email reset sandi.");
                  }
                }}
                className="text-xs"
              >
                Kirim Reset Sandi
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: DATA & PREFERENSI ─── */}
      {activeTab === "data" && (
        <div className="space-y-4 rounded-xl border border-border bg-surface p-5 shadow-2xs animate-fade-in">
          <h2 className="text-sm font-bold text-text-primary font-display pb-2 border-b border-border/70">
            Cadangan & Konfigurasi Workspace
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/dashboard/kategori"
              className="p-3.5 rounded-xl border border-border bg-surface-secondary hover:bg-surface-tertiary text-left transition-all space-y-1 block"
            >
              <div className="flex items-center gap-2 text-text-primary font-semibold text-xs">
                <Sliders className="w-4 h-4 text-brand-400" />
                <span>Kategori Pembelajaran</span>
              </div>
              <p className="text-[11px] text-text-secondary">
                Kelola hierarki subjek dan taksonomi modul materi.
              </p>
            </Link>

            <Link
              href="/dashboard/tag"
              className="p-3.5 rounded-xl border border-border bg-surface-secondary hover:bg-surface-tertiary text-left transition-all space-y-1 block"
            >
              <div className="flex items-center gap-2 text-text-primary font-semibold text-xs">
                <FileCode className="w-4 h-4 text-brand-400" />
                <span>Label & Tag Topik</span>
              </div>
              <p className="text-[11px] text-text-secondary">
                Kelola label penanda topik materi dan tugas kuliah.
              </p>
            </Link>

            <Link
              href="/dashboard/backup"
              className="p-3.5 rounded-xl border border-border bg-surface-secondary hover:bg-surface-tertiary text-left transition-all space-y-1 block"
            >
              <div className="flex items-center gap-2 text-text-primary font-semibold text-xs">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Cadangan Data Lengkap</span>
              </div>
              <p className="text-[11px] text-text-secondary">
                Ekspor seluruh data belajar, materi, dan riwayat ke arsip ZIP/JSON.
              </p>
            </Link>

            <Link
              href="/dashboard/statistik"
              className="p-3.5 rounded-xl border border-border bg-surface-secondary hover:bg-surface-tertiary text-left transition-all space-y-1 block"
            >
              <div className="flex items-center gap-2 text-text-primary font-semibold text-xs">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Statistik & Analitik Belajar</span>
              </div>
              <p className="text-[11px] text-text-secondary">
                Lihat rincian perkembangan jam belajar dan skor kuis.
              </p>
            </Link>

            <button
              type="button"
              onClick={handleCopyExportJson}
              className="p-3.5 rounded-xl border border-border bg-surface-secondary hover:bg-surface-tertiary text-left transition-all space-y-1 cursor-pointer"
            >
              <div className="flex items-center gap-2 text-text-primary font-semibold text-xs">
                <Download className="w-4 h-4 text-brand-400" />
                <span>Salin Konfigurasi Tema (JSON)</span>
              </div>
              <p className="text-[11px] text-text-secondary">
                Salin token preferensi workspace ke clipboard.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setResetDialogOpen(true)}
              className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-left transition-all space-y-1 cursor-pointer"
            >
              <div className="flex items-center gap-2 text-red-400 font-semibold text-xs">
                <RotateCcw className="w-4 h-4" />
                <span>Reset ke Pengaturan Awal</span>
              </div>
              <p className="text-[11px] text-text-secondary">
                Kembalikan semua preferensi ke preset default.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={() => {
          resetToDefaults();
          setResetDialogOpen(false);
          toast.success("Pengaturan berhasil dikembalikan ke default!");
        }}
        title="Reset Pengaturan?"
        message="Semua kustomisasi tema dan preferensi tampilan akan dikembalikan ke setelan awal."
        confirmText="Reset"
      />
    </div>
  );
}
