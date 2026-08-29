"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export type AccentColor =
  | "platinum"
  | "titanium"
  | "indigo"
  | "emerald"
  | "violet"
  | "amber"
  | "rose"
  | "cyan";

export type BackgroundStyle =
  | "super-dark"
  | "tech-canvas"
  | "cyber-grid"
  | "deep-space"
  | "aurora"
  | "blueprint"
  | "minimal-dark";

export type BackgroundIntensity = "subtle" | "bold" | "vivid" | "minimal";
export type UIContrast = "balanced" | "high";
export type UIDensity = "compact" | "comfortable" | "spacious";
export type UIRadius = "sharp" | "balanced" | "soft";
export type UIMotion = "reduced" | "balanced" | "expressive";
export type UIFontSize = "compact" | "normal" | "large";
export type ThemeMode = "dark" | "light" | "system";

export interface ThemeSettings {
  mode: ThemeMode;
  accent: AccentColor;
  bgStyle: BackgroundStyle;
  bgIntensity: BackgroundIntensity;
  contrast: UIContrast;
  density: UIDensity;
  radius: UIRadius;
  motion: UIMotion;
  fontSize: UIFontSize;
}

export type ThemePresetId =
  | "developer-dark"
  | "clean-light"
  | "focus-mode"
  | "cyber-workspace"
  | "emerald-matrix"
  | "royal-violet"
  | "solar-amber"
  | "glacier-cyan";

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  tagline: string;
  settings: ThemeSettings;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "developer-dark",
    name: "Developer Dark (Default)",
    tagline: "Estetika terminal & kode minimalis berkelas tinggi",
    settings: {
      mode: "dark",
      accent: "platinum",
      bgStyle: "tech-canvas",
      bgIntensity: "bold",
      contrast: "balanced",
      density: "comfortable",
      radius: "balanced",
      motion: "balanced",
      fontSize: "normal",
    },
  },
  {
    id: "clean-light",
    name: "Clean Light",
    tagline: "Terang, tajam, dan kontras sempurna untuk siang hari",
    settings: {
      mode: "light",
      accent: "indigo",
      bgStyle: "tech-canvas",
      bgIntensity: "subtle",
      contrast: "balanced",
      density: "comfortable",
      radius: "balanced",
      motion: "balanced",
      fontSize: "normal",
    },
  },
  {
    id: "focus-mode",
    name: "Focus Mode (Bebas Distraksi)",
    tagline: "Minimalis murni, minim animasi, kontras tinggi untuk konsentrasi penuh",
    settings: {
      mode: "dark",
      accent: "platinum",
      bgStyle: "minimal-dark",
      bgIntensity: "minimal",
      contrast: "high",
      density: "compact",
      radius: "sharp",
      motion: "reduced",
      fontSize: "normal",
    },
  },
  {
    id: "cyber-workspace",
    name: "Cyber Workspace",
    tagline: "Nuansa biru elektrik dengan grid teknikal modern",
    settings: {
      mode: "dark",
      accent: "indigo",
      bgStyle: "cyber-grid",
      bgIntensity: "bold",
      contrast: "balanced",
      density: "comfortable",
      radius: "balanced",
      motion: "expressive",
      fontSize: "normal",
    },
  },
  {
    id: "emerald-matrix",
    name: "Emerald Matrix",
    tagline: "Aksen mint neon segar untuk sesi coding panjang",
    settings: {
      mode: "dark",
      accent: "emerald",
      bgStyle: "tech-canvas",
      bgIntensity: "bold",
      contrast: "balanced",
      density: "comfortable",
      radius: "balanced",
      motion: "expressive",
      fontSize: "normal",
    },
  },
  {
    id: "royal-violet",
    name: "Royal Violet",
    tagline: "Nuansa ungu futuristik dengan latar kosmik mendalam",
    settings: {
      mode: "dark",
      accent: "violet",
      bgStyle: "deep-space",
      bgIntensity: "bold",
      contrast: "balanced",
      density: "comfortable",
      radius: "soft",
      motion: "balanced",
      fontSize: "normal",
    },
  },
  {
    id: "solar-amber",
    name: "Solar Amber",
    tagline: "Hangat, energetik, dan mudah dibaca di segala kondisi",
    settings: {
      mode: "dark",
      accent: "amber",
      bgStyle: "tech-canvas",
      bgIntensity: "bold",
      contrast: "balanced",
      density: "comfortable",
      radius: "balanced",
      motion: "balanced",
      fontSize: "normal",
    },
  },
  {
    id: "glacier-cyan",
    name: "Glacier Cyan",
    tagline: "Biru es jernih dengan blueprint arsitektur rapi",
    settings: {
      mode: "dark",
      accent: "cyan",
      bgStyle: "blueprint",
      bgIntensity: "subtle",
      contrast: "balanced",
      density: "comfortable",
      radius: "soft",
      motion: "expressive",
      fontSize: "normal",
    },
  },
];

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  mode: "dark",
  accent: "indigo",
  bgStyle: "tech-canvas",
  bgIntensity: "bold",
  contrast: "balanced",
  density: "comfortable",
  radius: "balanced",
  motion: "balanced",
  fontSize: "normal",
};

interface ThemeAccentContextType {
  // Direct state access
  settings: ThemeSettings;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  bgStyle: BackgroundStyle;
  setBgStyle: (bgStyle: BackgroundStyle) => void;
  bgIntensity: BackgroundIntensity;
  setBgIntensity: (intensity: BackgroundIntensity) => void;
  contrast: UIContrast;
  setContrast: (contrast: UIContrast) => void;
  density: UIDensity;
  setDensity: (density: UIDensity) => void;
  radius: UIRadius;
  setRadius: (radius: UIRadius) => void;
  motion: UIMotion;
  setMotion: (motion: UIMotion) => void;
  fontSize: UIFontSize;
  setFontSize: (fontSize: UIFontSize) => void;
  
  // Batch & preset methods
  applyPreset: (presetId: ThemePresetId) => void;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
  resetToDefaults: () => void;
  exportSettings: () => string;
  importSettings: (jsonString: string) => boolean;
}

const ThemeAccentContext = createContext<ThemeAccentContextType>({
  settings: DEFAULT_THEME_SETTINGS,
  accent: "indigo",
  setAccent: () => {},
  bgStyle: "tech-canvas",
  setBgStyle: () => {},
  bgIntensity: "bold",
  setBgIntensity: () => {},
  contrast: "balanced",
  setContrast: () => {},
  density: "comfortable",
  setDensity: () => {},
  radius: "balanced",
  setRadius: () => {},
  motion: "balanced",
  setMotion: () => {},
  fontSize: "normal",
  setFontSize: () => {},
  applyPreset: () => {},
  updateSettings: () => {},
  resetToDefaults: () => {},
  exportSettings: () => "",
  importSettings: () => false,
});

const VALID_ACCENTS: AccentColor[] = [
  "platinum",
  "titanium",
  "indigo",
  "emerald",
  "violet",
  "amber",
  "rose",
  "cyan",
];

const VALID_BG_STYLES: BackgroundStyle[] = [
  "super-dark",
  "tech-canvas",
  "cyber-grid",
  "deep-space",
  "aurora",
  "blueprint",
  "minimal-dark",
];

const VALID_INTENSITIES: BackgroundIntensity[] = [
  "subtle",
  "bold",
  "vivid",
  "minimal",
];

const VALID_CONTRASTS: UIContrast[] = ["balanced", "high"];
const VALID_DENSITIES: UIDensity[] = ["compact", "comfortable", "spacious"];
const VALID_RADII: UIRadius[] = ["sharp", "balanced", "soft"];
const VALID_MOTIONS: UIMotion[] = ["reduced", "balanced", "expressive"];
const VALID_FONT_SIZES: UIFontSize[] = ["compact", "normal", "large"];

const STORAGE_KEY = "velqora_theme_settings";

export function ThemeAccentProvider({ children }: { children: React.ReactNode }) {
  const { setTheme: setNextTheme } = useTheme();
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_THEME_SETTINGS);

  // Apply DOM attributes to <html>
  const applyAttributesToDOM = useCallback((s: ThemeSettings) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    root.setAttribute("data-accent", s.accent === "titanium" ? "platinum" : s.accent);
    root.setAttribute("data-bg-style", s.bgStyle);
    root.setAttribute("data-bg-intensity", s.bgIntensity);
    root.setAttribute("data-contrast", s.contrast);
    root.setAttribute("data-density", s.density);
    root.setAttribute("data-radius", s.radius);
    root.setAttribute("data-motion", s.motion);
    root.setAttribute("data-font-size", s.fontSize);
  }, []);

  // Save to localStorage & sync
  const saveAndApply = useCallback(
    (newSettings: ThemeSettings) => {
      setSettings(newSettings);
      applyAttributesToDOM(newSettings);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
          // Backwards compatibility legacy keys
          localStorage.setItem("velqora_accent_color", newSettings.accent);
          localStorage.setItem("velqora_bg_style", newSettings.bgStyle);
          localStorage.setItem("velqora_bg_intensity", newSettings.bgIntensity);
        } catch (e) {
          console.error("Failed to save theme settings to localStorage", e);
        }
      }
    },
    [applyAttributesToDOM]
  );

  // Initialize from localStorage or fallback
  useEffect(() => {
    if (typeof window === "undefined") return;

    let loadedSettings = { ...DEFAULT_THEME_SETTINGS };

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          loadedSettings = {
            mode: parsed.mode || "dark",
            accent: VALID_ACCENTS.includes(parsed.accent) ? parsed.accent : "platinum",
            bgStyle: VALID_BG_STYLES.includes(parsed.bgStyle) ? parsed.bgStyle : "super-dark",
            bgIntensity: VALID_INTENSITIES.includes(parsed.bgIntensity) ? parsed.bgIntensity : "subtle",
            contrast: VALID_CONTRASTS.includes(parsed.contrast) ? parsed.contrast : "balanced",
            density: VALID_DENSITIES.includes(parsed.density) ? parsed.density : "comfortable",
            radius: VALID_RADII.includes(parsed.radius) ? parsed.radius : "balanced",
            motion: VALID_MOTIONS.includes(parsed.motion) ? parsed.motion : "balanced",
            fontSize: VALID_FONT_SIZES.includes(parsed.fontSize) ? parsed.fontSize : "normal",
          };
        }
      } else {
        // Check legacy keys
        const legacyAccent = (localStorage.getItem("velqora_accent_color") ||
          localStorage.getItem("wahyustudy_accent_color")) as AccentColor;
        if (legacyAccent && VALID_ACCENTS.includes(legacyAccent)) {
          loadedSettings.accent = legacyAccent;
        }

        const legacyBg = (localStorage.getItem("velqora_bg_style") ||
          localStorage.getItem("wahyustudy_bg_style")) as BackgroundStyle;
        if (legacyBg && VALID_BG_STYLES.includes(legacyBg)) {
          loadedSettings.bgStyle = legacyBg;
        }

        const legacyIntensity = (localStorage.getItem("velqora_bg_intensity") ||
          localStorage.getItem("wahyustudy_bg_intensity")) as BackgroundIntensity;
        if (legacyIntensity && VALID_INTENSITIES.includes(legacyIntensity)) {
          loadedSettings.bgIntensity = legacyIntensity;
        }
      }
    } catch (e) {
      console.warn("Could not read theme settings from localStorage", e);
    }

    setSettings(loadedSettings);
    applyAttributesToDOM(loadedSettings);
  }, [applyAttributesToDOM]);

  // Specific setters
  const setAccent = (accent: AccentColor) => {
    saveAndApply({ ...settings, accent });
  };

  const setBgStyle = (bgStyle: BackgroundStyle) => {
    saveAndApply({ ...settings, bgStyle });
  };

  const setBgIntensity = (bgIntensity: BackgroundIntensity) => {
    saveAndApply({ ...settings, bgIntensity });
  };

  const setContrast = (contrast: UIContrast) => {
    saveAndApply({ ...settings, contrast });
  };

  const setDensity = (density: UIDensity) => {
    saveAndApply({ ...settings, density });
  };

  const setRadius = (radius: UIRadius) => {
    saveAndApply({ ...settings, radius });
  };

  const setMotion = (motion: UIMotion) => {
    saveAndApply({ ...settings, motion });
  };

  const setFontSize = (fontSize: UIFontSize) => {
    saveAndApply({ ...settings, fontSize });
  };

  const updateSettings = (newPartial: Partial<ThemeSettings>) => {
    const merged: ThemeSettings = { ...settings, ...newPartial };
    saveAndApply(merged);
  };

  const applyPreset = (presetId: ThemePresetId) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    saveAndApply(preset.settings);
    setNextTheme(preset.settings.mode);
    toast.success(`Preset "${preset.name}" berhasil diterapkan!`);
  };

  const resetToDefaults = () => {
    saveAndApply(DEFAULT_THEME_SETTINGS);
    setNextTheme("dark");
    toast.success("Pengaturan tampilan berhasil dipulihkan ke default Velqora.");
  };

  const exportSettings = (): string => {
    return JSON.stringify(settings, null, 2);
  };

  const importSettings = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== "object") throw new Error("Invalid format");

      const validated: ThemeSettings = {
        mode: ["dark", "light", "system"].includes(parsed.mode) ? parsed.mode : settings.mode,
        accent: VALID_ACCENTS.includes(parsed.accent) ? parsed.accent : settings.accent,
        bgStyle: VALID_BG_STYLES.includes(parsed.bgStyle) ? parsed.bgStyle : settings.bgStyle,
        bgIntensity: VALID_INTENSITIES.includes(parsed.bgIntensity)
          ? parsed.bgIntensity
          : settings.bgIntensity,
        contrast: VALID_CONTRASTS.includes(parsed.contrast) ? parsed.contrast : settings.contrast,
        density: VALID_DENSITIES.includes(parsed.density) ? parsed.density : settings.density,
        radius: VALID_RADII.includes(parsed.radius) ? parsed.radius : settings.radius,
        motion: VALID_MOTIONS.includes(parsed.motion) ? parsed.motion : settings.motion,
        fontSize: VALID_FONT_SIZES.includes(parsed.fontSize) ? parsed.fontSize : settings.fontSize,
      };

      saveAndApply(validated);
      setNextTheme(validated.mode);
      toast.success("Konfigurasi tema berhasil diimpor!");
      return true;
    } catch {
      toast.error("Format file konfigurasi JSON tidak valid!");
      return false;
    }
  };

  return (
    <ThemeAccentContext.Provider
      value={{
        settings,
        accent: settings.accent,
        setAccent,
        bgStyle: settings.bgStyle,
        setBgStyle,
        bgIntensity: settings.bgIntensity,
        setBgIntensity,
        contrast: settings.contrast,
        setContrast,
        density: settings.density,
        setDensity,
        radius: settings.radius,
        setRadius,
        motion: settings.motion,
        setMotion,
        fontSize: settings.fontSize,
        setFontSize,
        applyPreset,
        updateSettings,
        resetToDefaults,
        exportSettings,
        importSettings,
      }}
    >
      {children}
    </ThemeAccentContext.Provider>
  );
}

export function useThemeAccent() {
  return useContext(ThemeAccentContext);
}
