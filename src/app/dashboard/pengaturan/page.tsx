"use client";

import { useEffect, useState } from "react";
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
  Flame,
  Stars,
  Eye,
  Sliders,
  Wand2,
  RotateCcw,
  Download,
  Upload,
  Zap,
  Square,
  Activity,
  Palette,
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
  BackgroundIntensity,
  UIContrast,
  UIDensity,
  UIRadius,
  UIMotion,
  THEME_PRESETS,
} from "@/context/theme-accent-context";

export default function PengaturanPage() {
  const { theme, setTheme } = useTheme();
  const {
    settings,
    accent,
    setAccent,
    bgStyle,
    setBgStyle,
    bgIntensity,
    setBgIntensity,
    contrast,
    setContrast,
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
    borderClass: string;
  }[] = [
    {
      id: "platinum",
      name: "Stealth Titanium",
      description: "Slate monokrom minimalis & tenang",
      bgClass: "bg-slate-400",
      borderClass: "border-slate-400/40",
    },
    {
      id: "indigo",
      name: "Cyber Indigo",
      description: "Biru elektrik modern & tajam",
      bgClass: "bg-blue-600",
      borderClass: "border-blue-500/40",
    },
    {
      id: "emerald",
      name: "Emerald Matrix",
      description: "Mint neon segar & konsentrasi",
      bgClass: "bg-emerald-500",
      borderClass: "border-emerald-500/40",
    },
    {
      id: "violet",
      name: "Royal Violet",
      description: "Ungu futuristik & estetika cyber",
      bgClass: "bg-purple-500",
      borderClass: "border-purple-500/40",
    },
    {
      id: "amber",
      name: "Solar Amber",
      description: "Emas hangat berenergi tinggi",
      bgClass: "bg-amber-500",
      borderClass: "border-amber-500/40",
    },
    {
      id: "rose",
      name: "Rose Cyberpunk",
      description: "Magenta tajam & ekspresif",
      bgClass: "bg-pink-500",
      borderClass: "border-pink-500/40",
    },
    {
      id: "cyan",
      name: "Glacier Cyan",
      description: "Biru es jernih & berpresisi",
      bgClass: "bg-cyan-500",
      borderClass: "border-cyan-500/40",
    },
  ];

  // Available Background Styles (7 Choices with visual preview styles)
  const BG_STYLE_OPTIONS: {
    id: BackgroundStyle;
    name: string;
    tagline: string;
    icon: any;
    previewGradient: string;
    patternType: string;
  }[] = [
    {
      id: "super-dark",
      name: "Obsidian Void",
      tagline: "Gelap pekat OLED dengan laser horizon minimalis",
      icon: Moon,
      previewGradient: "from-black via-slate-950 to-black",
      patternType: "matrix-dots",
    },
    {
      id: "tech-canvas",
      name: "Tech Canvas",
      tagline: "Titik koordinat arsitektural dan sirkuit interaktif",
      icon: Compass,
      previewGradient: "from-slate-900 via-blue-950/50 to-slate-900",
      patternType: "circuit-lines",
    },
    {
      id: "cyber-grid",
      name: "Cyber Grid",
      tagline: "Perspektif matriks kode 3D dinamis",
      icon: Layers,
      previewGradient: "from-blue-950 via-slate-900 to-indigo-950",
      patternType: "grid-perspective",
    },
    {
      id: "deep-space",
      name: "Deep Space",
      tagline: "Pendaran nebula kosmik halus & tenang",
      icon: Stars,
      previewGradient: "from-slate-950 via-purple-950/40 to-black",
      patternType: "nebula-glow",
    },
    {
      id: "aurora",
      name: "Aurora Borealis",
      tagline: "Gelombang cahaya spektral lembut dan dinamis",
      icon: Flame,
      previewGradient: "from-emerald-950/40 via-slate-900 to-teal-950/40",
      patternType: "aurora-waves",
    },
    {
      id: "blueprint",
      name: "Blueprint Arsitektur",
      tagline: "Kisi-kisi diagram teknis berpresisi tinggi",
      icon: Wand2,
      previewGradient: "from-cyan-950/50 via-slate-900 to-blue-950/40",
      patternType: "blueprint-grid",
    },
    {
      id: "minimal-dark",
      name: "Minimal Onyx",
      tagline: "Tekstur bersih murni tanpa animasi yang mengganggu",
      icon: Eye,
      previewGradient: "from-slate-950 via-slate-900 to-slate-950",
      patternType: "flat-clean",
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
      toast.success("Profil dan preferensi berhasil diperbarui!");
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
        <p className="text-xs font-mono text-text-tertiary">Memuat pengaturan antarmuka...</p>
      </div>
    );
  }

  return (
    <div className="page-container space-y-6 sm:space-y-8 pb-14 animate-fade-in">
      {/* 1. Page Header */}
      <PageHeader
        eyebrow="~/workspace / settings & theme"
        title="Personalisasi Tema & Tampilan"
        description="Atur tampilan Velqora sesuai cara kamu belajar, sesuaikan aksen warna, gaya latar belakang, dan kelola profil akun."
        technicalMark="< theme // workspace />"
      />

      {/* 2. Informasi Profil Belajar (Comfortable Form Card) */}
      <section className="page-section space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-brand-400" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary font-mono">
              Informasi Profil Belajar
            </h2>
          </div>
          {isOwner && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Crown className="w-3 h-3" /> Pemilik Sistem
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-2xs">
          <div className="form-grid">
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

          <div className="form-grid">
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

          <div className="flex justify-end pt-1">
            <Button type="submit" loading={saving} className="flex items-center gap-2 h-9 sm:h-10 text-xs sm:text-sm font-semibold">
              <Save className="w-4 h-4" />
              <span>Simpan Profil & Preferensi</span>
            </Button>
          </div>
        </form>
      </section>

      {/* 3. Preset Tampilan Siap Pakai (Settings Grid) */}
      <section className="page-section space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-400" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary font-mono">
              Preset Tampilan Siap Pakai
            </h2>
          </div>
          <span className="text-[10px] font-mono text-text-tertiary px-2 py-0.5 rounded bg-surface-secondary border border-border">
            {THEME_PRESETS.length} Pilihan
          </span>
        </div>

        <div className="settings-grid">
          {THEME_PRESETS.map((preset) => {
            const isCurrentMode = settings.mode === preset.settings.mode;
            const isCurrentAccent = settings.accent === preset.settings.accent;
            const isCurrentBg = settings.bgStyle === preset.settings.bgStyle;
            const isMatch = isCurrentMode && isCurrentAccent && isCurrentBg;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between gap-2 cursor-pointer min-h-[96px] ${
                  isMatch
                    ? "border-brand-500/60 bg-brand-500/10 shadow-xs ring-1 ring-brand-500/40"
                    : "border-border hover:border-brand-500/30 bg-surface hover:bg-surface-secondary"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-bold text-text-primary truncate">{preset.name}</span>
                  {isMatch && <Check className="w-3.5 h-3.5 text-brand-400 shrink-0" />}
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2">
                  {preset.tagline}
                </p>
                <div className="flex items-center gap-1.5 pt-0.5 text-[9.5px] font-mono text-text-tertiary">
                  <span className="px-1.5 py-0.5 rounded bg-surface-secondary border border-border capitalize">
                    {preset.settings.mode}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-surface-secondary border border-border capitalize">
                    {preset.settings.accent}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Live Preview Realtime */}
      <section className="page-section space-y-3">
        <div className="flex items-center gap-2 px-0.5">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary font-mono">
            Pratinjau Langsung (Live Preview)
          </h2>
        </div>

        <ThemePreviewBox />
      </section>

      {/* 5. Mode Tampilan Dasar (3-Column Desktop / 1-Column Mobile) */}
      <section className="page-section space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary font-mono">
              Mode Tampilan Dasar
            </h2>
          </div>
          <span className="text-[10px] font-mono text-text-tertiary px-2 py-0.5 rounded bg-surface-secondary border border-border capitalize">
            Aktif: {theme || "dark"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center min-h-[96px] justify-center ${
              theme === "dark"
                ? "border-brand-500 bg-brand-500/15 text-brand-400 shadow-xs ring-1 ring-brand-500/30"
                : "border-border hover:bg-surface-secondary text-text-secondary hover:text-text-primary bg-surface"
            }`}
          >
            <Moon className="w-5 h-5 text-brand-400" />
            <span>Mode Gelap (Dark)</span>
            <span className="text-[10.5px] font-normal text-text-tertiary leading-tight">
              Kenyamanan sesi belajar malam
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center min-h-[96px] justify-center ${
              theme === "light"
                ? "border-brand-500 bg-brand-500/15 text-brand-400 shadow-xs ring-1 ring-brand-500/30"
                : "border-border hover:bg-surface-secondary text-text-secondary hover:text-text-primary bg-surface"
            }`}
          >
            <Sun className="w-5 h-5 text-amber-400" />
            <span>Mode Terang (Light)</span>
            <span className="text-[10.5px] font-normal text-text-tertiary leading-tight">
              Kontras tajam & cerah siang hari
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center min-h-[96px] justify-center ${
              theme === "system"
                ? "border-brand-500 bg-brand-500/15 text-brand-400 shadow-xs ring-1 ring-brand-500/30"
                : "border-border hover:bg-surface-secondary text-text-secondary hover:text-text-primary bg-surface"
            }`}
          >
            <Monitor className="w-5 h-5 text-purple-400" />
            <span>Otomatis Sistem (Auto)</span>
            <span className="text-[10.5px] font-normal text-text-tertiary leading-tight">
              Mengikuti preferensi sistem OS
            </span>
          </button>
        </div>
      </section>

      {/* 6. Warna Aksen Tema (Compact Selectors) */}
      <section className="page-section space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-brand-400" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary font-mono">
              Warna Aksen Tema
            </h2>
          </div>
          <span className="text-[10px] font-mono text-text-tertiary px-2 py-0.5 rounded bg-surface-secondary border border-border capitalize">
            Aktif: {accent}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {ACCENT_OPTIONS.map((item) => {
            const isSelected = accent === item.id || (accent === "titanium" && item.id === "platinum");
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setAccent(item.id);
                  toast.success(`Aksen "${item.name}" diaktifkan!`);
                }}
                className={`p-3 rounded-xl border text-left transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer min-h-[58px] ${
                  isSelected
                    ? "border-brand-500/60 bg-brand-500/10 shadow-xs ring-1 ring-brand-500/40"
                    : "border-border hover:border-brand-500/30 bg-surface hover:bg-surface-secondary"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-4 h-4 rounded-full ${item.bgClass} flex items-center justify-center shadow-xs border border-white/20 shrink-0`}
                  />
                  <div className="truncate">
                    <p className="text-xs sm:text-sm font-bold text-text-primary truncate">
                      {item.name}
                    </p>
                    <p className="text-[10.5px] text-text-tertiary truncate">
                      {item.description}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-brand-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 7. Gaya Aset Latar Belakang & Intensitas */}
      <section className="page-section space-y-3.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-400" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary font-mono">
              Gaya Aset Latar Belakang
            </h2>
          </div>
          <span className="text-[10px] font-mono text-text-tertiary px-2 py-0.5 rounded bg-surface-secondary border border-border capitalize">
            {bgStyle.replace("-", " ")}
          </span>
        </div>

        {/* 7 Background Cards in Settings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {BG_STYLE_OPTIONS.map((bg) => {
            const isSelected = bgStyle === bg.id;
            const Icon = bg.icon;
            return (
              <button
                key={bg.id}
                type="button"
                onClick={() => {
                  setBgStyle(bg.id);
                  toast.success(`Latar belakang "${bg.name}" berhasil diterapkan!`);
                }}
                className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between gap-2.5 cursor-pointer overflow-hidden group min-h-[120px] ${
                  isSelected
                    ? "border-brand-500/60 bg-brand-500/10 shadow-xs ring-1 ring-brand-500/40"
                    : "border-border hover:border-brand-500/30 bg-surface hover:bg-surface-secondary"
                }`}
              >
                {/* Visual Preview Mini Banner */}
                <div
                  className={`w-full h-14 rounded-lg bg-gradient-to-br ${bg.previewGradient} border border-border/80 relative overflow-hidden flex items-center justify-center`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />
                  <Icon className="w-4 h-4 text-text-secondary group-hover:text-brand-400 group-hover:scale-110 transition-all z-10" />
                  {isSelected && (
                    <div className="absolute top-1 right-1 px-1.5 py-0.2 rounded-full text-[8.5px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Aktif
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-400 transition-colors truncate">
                    {bg.name}
                  </h4>
                  <p className="text-[10.5px] text-text-secondary leading-relaxed line-clamp-1">
                    {bg.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Intensitas Visual Latar Belakang (4-Column Desktop / 2x2 Mobile) */}
        <div className="rounded-xl border border-border bg-surface p-3.5 sm:p-4 space-y-2.5 shadow-2xs">
          <label className="text-xs sm:text-sm font-bold text-text-primary flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-400" />
            <span>Intensitas Visual Latar Belakang</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: "subtle", label: "Halus (Subtle)", desc: "Fokus belajar tanpa distraksi" },
              { id: "bold", label: "Sedang (Bold)", desc: "Seimbang dan berkarakter" },
              { id: "vivid", label: "Terang (Vivid)", desc: "Pendaran aksen ekspresif" },
              { id: "minimal", label: "Minimalis (Clean)", desc: "Tekstur bersih murni" },
            ].map((item) => {
              const isSelected = bgIntensity === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setBgIntensity(item.id as BackgroundIntensity);
                    toast.success(`Intensitas "${item.label}" diterapkan!`);
                  }}
                  className={`p-2.5 sm:p-3 rounded-lg border text-center transition-all cursor-pointer min-h-[64px] flex flex-col justify-center ${
                    isSelected
                      ? "border-brand-500 bg-brand-500/15 text-text-primary shadow-xs ring-1 ring-brand-500/30"
                      : "border-border hover:bg-surface-secondary text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <p className="text-xs font-bold">{item.label}</p>
                  <p className="text-[10px] text-text-tertiary mt-0.5 leading-tight">{item.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Kepadatan UI, Gaya Sudut, Animasi & Kontras (2-Column Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Density & Radius */}
        <Card className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-text-primary">
              <Square className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-text-primary">Kepadatan & Gaya Sudut</h3>
              <p className="text-[11px] text-text-secondary">Sesuaikan spasi padding dan kelengkungan sudut komponen</p>
            </div>
          </div>

          {/* Density */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary">Kepadatan Tampilan (Density)</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "compact", label: "Ringkas" },
                { id: "comfortable", label: "Seimbang" },
                { id: "spacious", label: "Lega" },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setDensity(d.id as UIDensity);
                    toast.success(`Kepadatan "${d.label}" diterapkan!`);
                  }}
                  className={`p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
                    density === d.id
                      ? "border-brand-500 bg-brand-500/15 text-brand-400 font-semibold"
                      : "border-border hover:bg-surface-secondary text-text-secondary"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Radius */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-text-secondary">Gaya Sudut (Corner Radius)</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "sharp", label: "Tegas (Sharp)" },
                { id: "balanced", label: "Seimbang" },
                { id: "soft", label: "Halus (Soft)" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setRadius(r.id as UIRadius);
                    toast.success(`Gaya sudut "${r.label}" diterapkan!`);
                  }}
                  className={`p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
                    radius === r.id
                      ? "border-brand-500 bg-brand-500/15 text-brand-400 font-semibold"
                      : "border-border hover:bg-surface-secondary text-text-secondary"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Motion & Contrast */}
        <Card className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-text-primary">
              <Activity className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-text-primary">Animasi & Kontras Visual</h3>
              <p className="text-[11px] text-text-secondary">Kontrol kecepatan transisi dan keterbacaan teks</p>
            </div>
          </div>

          {/* Motion */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary">Tingkat Animasi (Motion)</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "reduced", label: "Minimal" },
                { id: "balanced", label: "Normal" },
                { id: "expressive", label: "Ekspresif" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMotion(m.id as UIMotion);
                    toast.success(`Tingkat animasi "${m.label}" diterapkan!`);
                  }}
                  className={`p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
                    motion === m.id
                      ? "border-brand-500 bg-brand-500/15 text-brand-400 font-semibold"
                      : "border-border hover:bg-surface-secondary text-text-secondary"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contrast */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-text-secondary">Kontras Tampilan</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "balanced", label: "Normal (Balanced)" },
                { id: "high", label: "Kontras Tinggi" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setContrast(c.id as UIContrast);
                    toast.success(`Kontras "${c.label}" diterapkan!`);
                  }}
                  className={`p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
                    contrast === c.id
                      ? "border-brand-500 bg-brand-500/15 text-brand-400 font-semibold"
                      : "border-border hover:bg-surface-secondary text-text-secondary"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 9. Manajemen Konfigurasi Tema (Toolbar Card) */}
      <section className="p-4 sm:p-5 rounded-xl border border-border bg-surface flex items-center justify-between gap-3 flex-wrap shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyExportJson}
            className="flex items-center gap-1.5 text-xs h-9"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Salin Konfigurasi JSON</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setImportModalOpen(true)}
            className="flex items-center gap-1.5 text-xs h-9"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Impor Konfigurasi</span>
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setResetDialogOpen(true)}
          className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 h-9 ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Pulihkan Default</span>
        </Button>
      </section>

      {/* Confirmation Dialog for Reset to Defaults */}
      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={() => {
          resetToDefaults();
          setResetDialogOpen(false);
        }}
        title="Pulihkan Pengaturan Tampilan?"
        message="Semua kustomisasi tema, warna aksen, gaya latar belakang, kepadatan, dan sudut akan dikembalikan ke nilai awal standar Velqora."
        confirmText="Pulihkan Default"
        variant="default"
      />

      {/* Modal Import Configuration */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-xl border border-border bg-surface p-4 sm:p-5 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-sm sm:text-base font-bold text-text-primary">Impor Konfigurasi Tema</h3>
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="text-text-tertiary hover:text-text-primary text-xs"
              >
                Tutup
              </button>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Tempelkan teks JSON konfigurasi tema Velqora:
            </p>

            <textarea
              rows={5}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='{\n  "mode": "dark",\n  "accent": "indigo",\n  "bgStyle": "cyber-grid"\n}'
              className="w-full font-mono text-xs p-2.5 rounded-lg border border-border bg-surface-secondary text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-500"
            />

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={() => setImportModalOpen(false)}>
                Batal
              </Button>
              <Button size="sm" onClick={handleImportSubmit}>
                Terapkan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
