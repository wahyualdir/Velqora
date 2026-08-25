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
   TECH BADGE ITEM DEFINITION
   ============================================================ */
interface TechBadge {
  name: TechIconKey;
  label: string;
  color?: string;
}

const LEFT_FLANK_LOGOS: TechBadge[] = [
  { name: "python", label: "Python" },
  { name: "react", label: "React" },
  { name: "typescript", label: "TypeScript" },
  { name: "docker", label: "Docker" },
  { name: "rust", label: "Rust" },
  { name: "golang", label: "GoLang" },
  { name: "php", label: "PHP" },
  { name: "linux", label: "Linux" },
  { name: "vue", label: "Vue.js" },
  { name: "angular", label: "Angular" },
  { name: "laravel", label: "Laravel" },
  { name: "django", label: "Django" },
  { name: "svelte", label: "Svelte" },
  { name: "github", label: "GitHub" },
];

const RIGHT_FLANK_LOGOS: TechBadge[] = [
  { name: "nextjs", label: "Next.js" },
  { name: "node", label: "Node.js" },
  { name: "css", label: "CSS3 / Tailwind" },
  { name: "java", label: "Java" },
  { name: "cpp", label: "C++" },
  { name: "csharp", label: "C#" },
  { name: "postgresql", label: "PostgreSQL" },
  { name: "mysql", label: "MySQL" },
  { name: "mongodb", label: "MongoDB" },
  { name: "redis", label: "Redis" },
  { name: "flutter", label: "Flutter" },
  { name: "swift", label: "Swift" },
  { name: "kotlin", label: "Kotlin" },
  { name: "aws", label: "AWS" },
];

const MOBILE_TOP_LOGOS: TechBadge[] = [
  { name: "python", label: "Python" },
  { name: "react", label: "React" },
  { name: "typescript", label: "TypeScript" },
  { name: "nextjs", label: "Next.js" },
  { name: "docker", label: "Docker" },
  { name: "css", label: "Tailwind" },
  { name: "java", label: "Java" },
];

const MOBILE_BOTTOM_LOGOS: TechBadge[] = [
  { name: "postgresql", label: "PostgreSQL" },
  { name: "golang", label: "GoLang" },
  { name: "rust", label: "Rust" },
  { name: "flutter", label: "Flutter" },
  { name: "linux", label: "Linux" },
  { name: "mongodb", label: "MongoDB" },
  { name: "redis", label: "Redis" },
];

/* ============================================================
   TECH BACKGROUND COMPONENT
   - Device-Adaptive layout for Mobile, Tablet, Laptop, Desktop
   - Clean obsidian black base (#000000)
   - Micro-grid with radial mask
   - Beautiful glass badge chips for each brand vector
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

      {/* 3. DEVICE-ADAPTIVE FLOATING TECH BRAND BADGES (For Login / Register) */}
      {showLogos && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* ── A. DESKTOP & LAPTOP: LEFT FLANK (2 Columns on xl, 1 Column on md/lg) ── */}
          <div className="hidden md:grid grid-cols-1 xl:grid-cols-2 gap-3.5 absolute top-1/2 -translate-y-1/2 left-4 lg:left-8 xl:left-14 w-auto max-w-[280px]">
            {LEFT_FLANK_LOGOS.map((item, idx) => {
              const animClass =
                idx % 4 === 0
                  ? "animate-float-icon-1"
                  : idx % 4 === 1
                  ? "animate-float-icon-2"
                  : idx % 4 === 2
                  ? "animate-float-icon-3"
                  : "animate-float-icon-4";
              const delay = `${(idx * 0.25).toFixed(2)}s`;

              return (
                <div
                  key={`left-${item.name}-${idx}`}
                  className={`${animClass} flex items-center gap-2.5 p-2 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md shadow-md hover:border-brand-500/40 transition-all duration-200`}
                  style={{ animationDelay: delay }}
                >
                  <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/[0.06] flex items-center justify-center shrink-0 p-1.5">
                    <TechIcon name={item.name} size={20} />
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-300 hidden xl:inline truncate max-w-[80px]">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── B. DESKTOP & LAPTOP: RIGHT FLANK (2 Columns on xl, 1 Column on md/lg) ── */}
          <div className="hidden md:grid grid-cols-1 xl:grid-cols-2 gap-3.5 absolute top-1/2 -translate-y-1/2 right-4 lg:right-8 xl:right-14 w-auto max-w-[280px]">
            {RIGHT_FLANK_LOGOS.map((item, idx) => {
              const animClass =
                idx % 4 === 0
                  ? "animate-float-icon-2"
                  : idx % 4 === 1
                  ? "animate-float-icon-3"
                  : idx % 4 === 2
                  ? "animate-float-icon-4"
                  : "animate-float-icon-1";
              const delay = `${(idx * 0.22).toFixed(2)}s`;

              return (
                <div
                  key={`right-${item.name}-${idx}`}
                  className={`${animClass} flex items-center gap-2.5 p-2 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md shadow-md hover:border-brand-500/40 transition-all duration-200`}
                  style={{ animationDelay: delay }}
                >
                  <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/[0.06] flex items-center justify-center shrink-0 p-1.5">
                    <TechIcon name={item.name} size={20} />
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-300 hidden xl:inline truncate max-w-[80px]">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── C. MOBILE & SMALL TABLET: AMBIENT TOP & BOTTOM BANDS (< 768px) ── */}
          <div className="md:hidden flex flex-col justify-between h-full py-4 px-2 pointer-events-none opacity-60">
            {/* Top row */}
            <div className="flex items-center justify-around gap-2 overflow-hidden">
              {MOBILE_TOP_LOGOS.map((item, idx) => (
                <div
                  key={`mob-top-${item.name}`}
                  className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] backdrop-blur-md flex items-center justify-center p-1.5 animate-float-icon-1"
                  style={{ animationDelay: `${idx * 0.3}s` }}
                >
                  <TechIcon name={item.name} size={18} />
                </div>
              ))}
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-around gap-2 overflow-hidden">
              {MOBILE_BOTTOM_LOGOS.map((item, idx) => (
                <div
                  key={`mob-bot-${item.name}`}
                  className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] backdrop-blur-md flex items-center justify-center p-1.5 animate-float-icon-2"
                  style={{ animationDelay: `${idx * 0.35}s` }}
                >
                  <TechIcon name={item.name} size={18} />
                </div>
              ))}
            </div>
          </div>
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
