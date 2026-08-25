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
   52+ SCATTERED FLOATING TECH BRAND ICONS (BERTABURAN TANPA TEKS)
   - Varied sizes for depth of field (28px to 48px)
   - Distinct brand neon drop-shadows
   - Multi-speed staggered organic floating animations
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
  { id: "py-1", name: "python", top: "5%", left: "5%", anim: "animate-float-icon-1", delay: "0s", size: 44, glowColor: "rgba(56,126,184,0.7)" },
  { id: "react-1", name: "react", top: "7%", left: "17%", anim: "animate-float-icon-2", delay: "0.8s", size: 46, glowColor: "rgba(97,218,251,0.75)" },
  { id: "ts-1", name: "typescript", top: "4%", left: "30%", anim: "animate-float-icon-3", delay: "0.3s", size: 38, glowColor: "rgba(49,120,198,0.7)" },
  { id: "doc-1", name: "docker", top: "14%", left: "9%", anim: "animate-float-icon-4", delay: "1.2s", size: 42, glowColor: "rgba(36,150,237,0.7)" },
  { id: "vue-1", name: "vue", top: "16%", left: "23%", anim: "animate-float-icon-1", delay: "0.5s", size: 36, glowColor: "rgba(79,192,141,0.7)" },
  { id: "fig-1", name: "figma", top: "22%", left: "4%", anim: "animate-float-icon-2", delay: "1.5s", size: 34, glowColor: "rgba(162,89,255,0.65)" },

  // ─── Top & Upper-Right Sector ───
  { id: "next-1", name: "nextjs", top: "4%", right: "30%", anim: "animate-float-icon-1", delay: "0.2s", size: 40, glowColor: "rgba(255,255,255,0.6)" },
  { id: "node-1", name: "node", top: "6%", right: "17%", anim: "animate-float-icon-4", delay: "1.0s", size: 44, glowColor: "rgba(83,205,41,0.7)" },
  { id: "java-1", name: "java", top: "5%", right: "5%", anim: "animate-float-icon-3", delay: "0.4s", size: 46, glowColor: "rgba(231,111,0,0.7)" },
  { id: "cpp-1", name: "cpp", top: "15%", right: "9%", anim: "animate-float-icon-2", delay: "0.7s", size: 42, glowColor: "rgba(0,89,156,0.7)" },
  { id: "tail-1", name: "css", top: "16%", right: "23%", anim: "animate-float-icon-1", delay: "1.3s", size: 38, glowColor: "rgba(56,189,248,0.75)" },
  { id: "flt-1", name: "flutter", top: "22%", right: "4%", anim: "animate-float-icon-4", delay: "0.6s", size: 36, glowColor: "rgba(71,197,251,0.7)" },

  // ─── Middle-Left Sector (Far Left to Mid-Left) ───
  { id: "php-1", name: "php", top: "32%", left: "3%", anim: "animate-float-icon-3", delay: "0.9s", size: 44, glowColor: "rgba(119,123,180,0.7)" },
  { id: "ang-1", name: "angular", top: "34%", left: "14%", anim: "animate-float-icon-1", delay: "1.4s", size: 38, glowColor: "rgba(221,0,49,0.7)" },
  { id: "git-1", name: "github", top: "44%", left: "6%", anim: "animate-float-icon-2", delay: "0.3s", size: 42, glowColor: "rgba(255,255,255,0.7)" },
  { id: "lar-1", name: "laravel", top: "46%", left: "18%", anim: "animate-float-icon-4", delay: "1.7s", size: 36, glowColor: "rgba(255,45,32,0.7)" },
  { id: "rust-1", name: "rust", top: "56%", left: "3%", anim: "animate-float-icon-1", delay: "1.0s", size: 44, glowColor: "rgba(222,165,132,0.75)" },
  { id: "dj-1", name: "django", top: "58%", left: "15%", anim: "animate-float-icon-3", delay: "0.5s", size: 36, glowColor: "rgba(68,185,133,0.7)" },
  { id: "go-1", name: "golang", top: "68%", left: "5%", anim: "animate-float-icon-2", delay: "0.7s", size: 42, glowColor: "rgba(0,173,216,0.75)" },
  { id: "rub-1", name: "ruby", top: "70%", left: "17%", anim: "animate-float-icon-4", delay: "1.3s", size: 36, glowColor: "rgba(204,52,45,0.7)" },
  { id: "sve-1", name: "svelte", top: "80%", left: "3%", anim: "animate-float-icon-1", delay: "1.5s", size: 40, glowColor: "rgba(255,62,0,0.75)" },
  { id: "dar-1", name: "dart", top: "82%", left: "14%", anim: "animate-float-icon-3", delay: "0.8s", size: 34, glowColor: "rgba(0,180,255,0.7)" },
  { id: "lin-1", name: "linux", top: "90%", left: "6%", anim: "animate-float-icon-2", delay: "1.4s", size: 44, glowColor: "rgba(255,165,0,0.75)" },

  // ─── Middle-Right Sector (Far Right to Mid-Right) ───
  { id: "cs-1", name: "csharp", top: "32%", right: "3%", anim: "animate-float-icon-2", delay: "1.1s", size: 42, glowColor: "rgba(104,33,122,0.7)" },
  { id: "sw-1", name: "swift", top: "34%", right: "14%", anim: "animate-float-icon-4", delay: "0.2s", size: 38, glowColor: "rgba(240,81,56,0.75)" },
  { id: "pg-1", name: "postgresql", top: "44%", right: "6%", anim: "animate-float-icon-1", delay: "0.4s", size: 44, glowColor: "rgba(51,103,145,0.75)" },
  { id: "sql-1", name: "mysql", top: "46%", right: "18%", anim: "animate-float-icon-3", delay: "1.5s", size: 38, glowColor: "rgba(0,117,143,0.7)" },
  { id: "red-1", name: "redis", top: "56%", right: "3%", anim: "animate-float-icon-2", delay: "0.8s", size: 40, glowColor: "rgba(220,56,45,0.75)" },
  { id: "mon-1", name: "mongodb", top: "58%", right: "15%", anim: "animate-float-icon-4", delay: "1.1s", size: 40, glowColor: "rgba(71,162,72,0.75)" },
  { id: "aws-1", name: "aws", top: "68%", right: "5%", anim: "animate-float-icon-1", delay: "1.3s", size: 42, glowColor: "rgba(255,153,0,0.75)" },
  { id: "k8s-1", name: "kubernetes", top: "70%", right: "17%", anim: "animate-float-icon-3", delay: "0.5s", size: 42, glowColor: "rgba(50,108,229,0.75)" },
  { id: "gcp-1", name: "gcp", top: "80%", right: "3%", anim: "animate-float-icon-2", delay: "0.9s", size: 40, glowColor: "rgba(66,133,244,0.7)" },
  { id: "kot-1", name: "kotlin", top: "82%", right: "14%", anim: "animate-float-icon-4", delay: "1.6s", size: 38, glowColor: "rgba(127,82,255,0.75)" },
  { id: "azu-1", name: "azure", top: "90%", right: "6%", anim: "animate-float-icon-1", delay: "0.7s", size: 42, glowColor: "rgba(0,137,214,0.75)" },

  // ─── Bottom Sector ───
  { id: "js-1", name: "javascript", bottom: "5%", left: "20%", anim: "animate-float-icon-2", delay: "0.6s", size: 42, glowColor: "rgba(247,223,30,0.75)" },
  { id: "html-1", name: "html", bottom: "4%", left: "34%", anim: "animate-float-icon-4", delay: "1.2s", size: 40, glowColor: "rgba(227,79,38,0.7)" },
  { id: "c-1", name: "c", bottom: "4%", right: "34%", anim: "animate-float-icon-1", delay: "0.8s", size: 40, glowColor: "rgba(0,89,156,0.7)" },
  { id: "and-1", name: "android", bottom: "5%", right: "20%", anim: "animate-float-icon-3", delay: "0.4s", size: 42, glowColor: "rgba(61,220,132,0.75)" },

  // ─── Ambient Subtle Floaters ───
  { id: "gitl-1", name: "git", top: "25%", left: "26%", anim: "animate-float-icon-3", delay: "1.7s", size: 32, glowColor: "rgba(240,80,50,0.6)" },
  { id: "sqli-1", name: "sqlite", top: "25%", right: "26%", anim: "animate-float-icon-1", delay: "0.5s", size: 32, glowColor: "rgba(0,59,87,0.6)" },
  { id: "code-1", name: "code", bottom: "16%", left: "27%", anim: "animate-float-icon-4", delay: "1.0s", size: 32, glowColor: "rgba(59,130,246,0.6)" },
  { id: "db-1", name: "database", bottom: "16%", right: "27%", anim: "animate-float-icon-2", delay: "0.8s", size: 32, glowColor: "rgba(168,85,247,0.6)" },
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

      {/* 3. SCATTERED FLOATING TECH BRAND VECTORS (BERTABURAN TANPA TEKS) */}
      {showLogos && (
        <div
          className={`block absolute inset-0 overflow-hidden pointer-events-none transform-gpu will-change-transform transition-opacity duration-300 ${
            isLight ? "opacity-70 sm:opacity-80" : "opacity-85 sm:opacity-95"
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
                filter: `drop-shadow(0 0 14px ${item.glowColor}) drop-shadow(0 2px 8px rgba(0,0,0,0.8))`,
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
