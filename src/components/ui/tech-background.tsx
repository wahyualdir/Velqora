"use client";

import React from "react";
import { useThemeAccent, BackgroundStyle } from "@/context/theme-accent-context";
import { useTheme } from "next-themes";
import { TechIcon, TechIconKey } from "@/components/ui/tech-icon";

/* ============================================================
   Hook to safely resolve theme on client side
   ============================================================ */
function useResolvedTheme() {
  const [mounted, setMounted] = React.useState(false);
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return { resolvedTheme: mounted ? (resolvedTheme || "dark") : "dark" };
}

/* ============================================================
   LARGE & IMPACTFUL SCATTERED TECH BRAND LOGOS (BESAR & BERTABURAN)
   - Extra Large Sizes: 58px – 80px (Impactful & clearly visible)
   - Rich brand neon radiance with dual drop-shadows
   - Staggered multi-axis floating animations
   ============================================================ */

interface FloatingIcon {
  id: string;
  name: TechIconKey;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  anim: string;
  delay: string;
  size: number;
  glowColor: string;
}

const SCATTERED_TECH_LOGOS: FloatingIcon[] = [
  // ─── Top & Upper-Left Sector ───
  { id: "py-1", name: "python", top: "4%", left: "4%", anim: "animate-float-icon-1", delay: "0s", size: 76, glowColor: "rgba(56,126,184,0.85)" },
  { id: "react-1", name: "react", top: "6%", left: "16%", anim: "animate-float-icon-2", delay: "0.8s", size: 78, glowColor: "rgba(97,218,251,0.9)" },
  { id: "ts-1", name: "typescript", top: "3%", left: "28%", anim: "animate-float-icon-3", delay: "0.3s", size: 66, glowColor: "rgba(49,120,198,0.85)" },
  { id: "doc-1", name: "docker", top: "16%", left: "8%", anim: "animate-float-icon-4", delay: "1.2s", size: 72, glowColor: "rgba(36,150,237,0.85)" },
  { id: "vue-1", name: "vue", top: "18%", left: "22%", anim: "animate-float-icon-1", delay: "0.5s", size: 62, glowColor: "rgba(79,192,141,0.85)" },
  { id: "fig-1", name: "figma", top: "25%", left: "3%", anim: "animate-float-icon-2", delay: "1.5s", size: 58, glowColor: "rgba(162,89,255,0.8)" },

  // ─── Top & Upper-Right Sector ───
  { id: "next-1", name: "nextjs", top: "3%", right: "28%", anim: "animate-float-icon-1", delay: "0.2s", size: 68, glowColor: "rgba(255,255,255,0.75)" },
  { id: "node-1", name: "node", top: "6%", right: "16%", anim: "animate-float-icon-4", delay: "1.0s", size: 74, glowColor: "rgba(83,205,41,0.85)" },
  { id: "java-1", name: "java", top: "4%", right: "4%", anim: "animate-float-icon-3", delay: "0.4s", size: 78, glowColor: "rgba(231,111,0,0.85)" },
  { id: "cpp-1", name: "cpp", top: "16%", right: "8%", anim: "animate-float-icon-2", delay: "0.7s", size: 72, glowColor: "rgba(0,89,156,0.85)" },
  { id: "tail-1", name: "css", top: "18%", right: "22%", anim: "animate-float-icon-1", delay: "1.3s", size: 64, glowColor: "rgba(56,189,248,0.9)" },
  { id: "flt-1", name: "flutter", top: "25%", right: "3%", anim: "animate-float-icon-4", delay: "0.6s", size: 62, glowColor: "rgba(71,197,251,0.85)" },

  // ─── Middle-Left Sector (Far Left to Mid-Left) ───
  { id: "php-1", name: "php", top: "36%", left: "2%", anim: "animate-float-icon-3", delay: "0.9s", size: 74, glowColor: "rgba(119,123,180,0.85)" },
  { id: "ang-1", name: "angular", top: "38%", left: "14%", anim: "animate-float-icon-1", delay: "1.4s", size: 64, glowColor: "rgba(221,0,49,0.85)" },
  { id: "git-1", name: "github", top: "49%", left: "5%", anim: "animate-float-icon-2", delay: "0.3s", size: 72, glowColor: "rgba(255,255,255,0.85)" },
  { id: "lar-1", name: "laravel", top: "51%", left: "17%", anim: "animate-float-icon-4", delay: "1.7s", size: 60, glowColor: "rgba(255,45,32,0.85)" },
  { id: "rust-1", name: "rust", top: "62%", left: "2%", anim: "animate-float-icon-1", delay: "1.0s", size: 74, glowColor: "rgba(222,165,132,0.85)" },
  { id: "dj-1", name: "django", top: "64%", left: "14%", anim: "animate-float-icon-3", delay: "0.5s", size: 60, glowColor: "rgba(68,185,133,0.85)" },
  { id: "go-1", name: "golang", top: "74%", left: "4%", anim: "animate-float-icon-2", delay: "0.7s", size: 72, glowColor: "rgba(0,173,216,0.9)" },
  { id: "rub-1", name: "ruby", top: "76%", left: "16%", anim: "animate-float-icon-4", delay: "1.3s", size: 60, glowColor: "rgba(204,52,45,0.85)" },
  { id: "sve-1", name: "svelte", top: "85%", left: "2%", anim: "animate-float-icon-1", delay: "1.5s", size: 66, glowColor: "rgba(255,62,0,0.85)" },
  { id: "dar-1", name: "dart", top: "87%", left: "13%", anim: "animate-float-icon-3", delay: "0.8s", size: 58, glowColor: "rgba(0,180,255,0.85)" },
  { id: "lin-1", name: "linux", top: "93%", left: "5%", anim: "animate-float-icon-2", delay: "1.4s", size: 76, glowColor: "rgba(255,165,0,0.85)" },

  // ─── Middle-Right Sector (Far Right to Mid-Right) ───
  { id: "cs-1", name: "csharp", top: "36%", right: "2%", anim: "animate-float-icon-2", delay: "1.1s", size: 72, glowColor: "rgba(104,33,122,0.85)" },
  { id: "sw-1", name: "swift", top: "38%", right: "14%", anim: "animate-float-icon-4", delay: "0.2s", size: 64, glowColor: "rgba(240,81,56,0.9)" },
  { id: "pg-1", name: "postgresql", top: "49%", right: "5%", anim: "animate-float-icon-1", delay: "0.4s", size: 76, glowColor: "rgba(51,103,145,0.85)" },
  { id: "sql-1", name: "mysql", top: "51%", right: "17%", anim: "animate-float-icon-3", delay: "1.5s", size: 64, glowColor: "rgba(0,117,143,0.85)" },
  { id: "red-1", name: "redis", top: "62%", right: "2%", anim: "animate-float-icon-2", delay: "0.8s", size: 68, glowColor: "rgba(220,56,45,0.85)" },
  { id: "mon-1", name: "mongodb", top: "64%", right: "14%", anim: "animate-float-icon-4", delay: "1.1s", size: 68, glowColor: "rgba(71,162,72,0.85)" },
  { id: "aws-1", name: "aws", top: "74%", right: "4%", anim: "animate-float-icon-1", delay: "1.3s", size: 74, glowColor: "rgba(255,153,0,0.85)" },
  { id: "k8s-1", name: "kubernetes", top: "76%", right: "16%", anim: "animate-float-icon-3", delay: "0.5s", size: 72, glowColor: "rgba(50,108,229,0.9)" },
  { id: "gcp-1", name: "gcp", top: "85%", right: "2%", anim: "animate-float-icon-2", delay: "0.9s", size: 66, glowColor: "rgba(66,133,244,0.85)" },
  { id: "kot-1", name: "kotlin", top: "87%", right: "13%", anim: "animate-float-icon-4", delay: "1.6s", size: 62, glowColor: "rgba(127,82,255,0.85)" },
  { id: "azu-1", name: "azure", top: "93%", right: "5%", anim: "animate-float-icon-1", delay: "0.7s", size: 72, glowColor: "rgba(0,137,214,0.85)" },

  // ─── Bottom Sector ───
  { id: "js-1", name: "javascript", bottom: "4%", left: "19%", anim: "animate-float-icon-2", delay: "0.6s", size: 70, glowColor: "rgba(247,223,30,0.9)" },
  { id: "html-1", name: "html", bottom: "3%", left: "32%", anim: "animate-float-icon-4", delay: "1.2s", size: 66, glowColor: "rgba(227,79,38,0.85)" },
  { id: "c-1", name: "c", bottom: "3%", right: "32%", anim: "animate-float-icon-1", delay: "0.8s", size: 66, glowColor: "rgba(0,89,156,0.85)" },
  { id: "and-1", name: "android", bottom: "4%", right: "19%", anim: "animate-float-icon-3", delay: "0.4s", size: 70, glowColor: "rgba(61,220,132,0.9)" },

  // ─── Ambient Subtle Floaters ───
  { id: "gitl-1", name: "git", top: "28%", left: "25%", anim: "animate-float-icon-3", delay: "1.7s", size: 54, glowColor: "rgba(240,80,50,0.75)" },
  { id: "sqli-1", name: "sqlite", top: "28%", right: "25%", anim: "animate-float-icon-1", delay: "0.5s", size: 54, glowColor: "rgba(0,59,87,0.75)" },
  { id: "code-1", name: "code", bottom: "16%", left: "26%", anim: "animate-float-icon-4", delay: "1.0s", size: 54, glowColor: "rgba(59,130,246,0.75)" },
  { id: "db-1", name: "database", bottom: "16%", right: "26%", anim: "animate-float-icon-2", delay: "0.8s", size: 54, glowColor: "rgba(168,85,247,0.75)" },
];

/* ============================================================
   TECH BACKGROUND COMPONENT
   ============================================================ */

interface TechBackgroundProps {
  variant?: "bold" | "subtle" | "vivid" | "minimal";
  styleOverride?: BackgroundStyle;
  showLogos?: boolean;
}

export const TechBackground = React.memo(function TechBackground({
  variant,
  styleOverride,
  showLogos = false,
}: TechBackgroundProps) {
  const { bgStyle: contextBgStyle, bgIntensity: contextIntensity } = useThemeAccent();
  const { resolvedTheme } = useResolvedTheme();
  const activeStyle = styleOverride || contextBgStyle || "tech-canvas";
  const activeIntensity = variant || contextIntensity || "subtle";

  const isLight = resolvedTheme === "light";
  const isMinimal = activeIntensity === "minimal" || activeStyle === "minimal-dark";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none transform-gpu [contain:paint]"
    >
      {/* 1. Base Solid Surface (Pitch Black) */}
      <div
        className={`absolute inset-0 transition-colors duration-200 ${
          isLight ? "bg-[#f8fafc]" : "bg-[#000000]"
        }`}
      />

      {/* 2. Precision Technical Micro-Grid */}
      {!isMinimal && (
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isLight
              ? "bg-tech-grid-light opacity-35 radial-mask-vignette"
              : "bg-tech-grid opacity-25 radial-mask-vignette"
          }`}
        />
      )}

      {/* 3. SCATTERED FLOATING TECH BRAND VECTORS (EXTRA LARGE & VIBRANT) */}
      {showLogos && (
        <div
          className={`block absolute inset-0 overflow-hidden pointer-events-none transform-gpu will-change-transform transition-opacity duration-300 ${
            isLight ? "opacity-75 sm:opacity-85" : "opacity-90 sm:opacity-100"
          }`}
        >
          {SCATTERED_TECH_LOGOS.map((item) => (
            <div
              key={item.id}
              className={`absolute ${item.anim} transition-all duration-300 hover:scale-125 cursor-default`}
              style={{
                top: item.top,
                bottom: item.bottom,
                left: item.left,
                right: item.right,
                animationDelay: item.delay,
                filter: `drop-shadow(0 0 18px ${item.glowColor}) drop-shadow(0 4px 12px rgba(0,0,0,0.9))`,
              }}
            >
              <TechIcon name={item.name} size={item.size} />
            </div>
          ))}
        </div>
      )}

      {/* 4. Subtle Edge Vignette */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isLight
            ? "bg-gradient-to-b from-white/30 via-transparent to-slate-200/40 opacity-30"
            : "bg-gradient-to-b from-black/30 via-transparent to-black/70 opacity-40"
        }`}
      />
    </div>
  );
});
