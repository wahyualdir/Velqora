"use client";

import React from "react";
import { useThemeAccent, BackgroundStyle } from "@/context/theme-accent-context";
import { useTheme } from "next-themes";
import { TechIcon } from "@/components/ui/tech-icon";

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
   72+ DENSE FLOATING TECH BRAND LOGO MATRIX
   ============================================================ */

interface FloatingItem {
  id: string;
  name: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  anim: string;
  delay: string;
  size: number;
}

const FLOATING_BRAND_LOGOS: FloatingItem[] = [
  // ─── Top Perimeter (Row 1 & 2) ───
  { id: "py-1", name: "python", top: "3%", left: "3%", anim: "animate-float-icon-1", delay: "0s", size: 44 },
  { id: "react-1", name: "react", top: "4%", left: "14%", anim: "animate-float-icon-2", delay: "0.8s", size: 46 },
  { id: "ts-1", name: "typescript", top: "3%", left: "26%", anim: "animate-float-icon-3", delay: "0.3s", size: 42 },
  { id: "next-1", name: "nextjs", top: "4%", left: "38%", anim: "animate-float-icon-1", delay: "1.1s", size: 42 },
  { id: "node-1", name: "node", top: "3%", right: "38%", anim: "animate-float-icon-4", delay: "0.2s", size: 42 },
  { id: "js-1", name: "javascript", top: "4%", right: "26%", anim: "animate-float-icon-2", delay: "0.7s", size: 42 },
  { id: "tail-1", name: "tailwind", top: "3%", right: "14%", anim: "animate-float-icon-3", delay: "0.5s", size: 44 },
  { id: "java-1", name: "java", top: "4%", right: "3%", anim: "animate-float-icon-4", delay: "0.4s", size: 44 },

  // ─── Upper Sub-Perimeter (Row 2 & 3) ───
  { id: "doc-1", name: "docker", top: "12%", left: "7%", anim: "animate-float-icon-3", delay: "1.2s", size: 42 },
  { id: "vue-1", name: "vue", top: "13%", left: "19%", anim: "animate-float-icon-4", delay: "0.6s", size: 40 },
  { id: "fig-1", name: "figma", top: "11%", left: "31%", anim: "animate-float-icon-1", delay: "1.6s", size: 38 },
  { id: "html-1", name: "html", top: "12%", right: "31%", anim: "animate-float-icon-2", delay: "0.9s", size: 40 },
  { id: "css-1", name: "css", top: "13%", right: "19%", anim: "animate-float-icon-4", delay: "1.4s", size: 40 },
  { id: "cpp-1", name: "cpp", top: "12%", right: "7%", anim: "animate-float-icon-1", delay: "1.0s", size: 44 },

  // ─── Left Sector ───
  { id: "php-1", name: "php", top: "22%", left: "2%", anim: "animate-float-icon-1", delay: "0.9s", size: 44 },
  { id: "ang-1", name: "angular", top: "24%", left: "13%", anim: "animate-float-icon-2", delay: "1.4s", size: 40 },
  { id: "git-1", name: "github", top: "33%", left: "4%", anim: "animate-float-icon-3", delay: "0.3s", size: 42 },
  { id: "lar-1", name: "laravel", top: "35%", left: "15%", anim: "animate-float-icon-1", delay: "1.7s", size: 40 },
  { id: "rust-1", name: "rust", top: "44%", left: "3%", anim: "animate-float-icon-2", delay: "1.0s", size: 42 },
  { id: "dj-1", name: "django", top: "46%", left: "14%", anim: "animate-float-icon-4", delay: "0.5s", size: 40 },
  { id: "go-1", name: "golang", top: "55%", left: "4%", anim: "animate-float-icon-1", delay: "0.7s", size: 42 },
  { id: "rub-1", name: "ruby", top: "57%", left: "15%", anim: "animate-float-icon-3", delay: "1.3s", size: 40 },
  { id: "sve-1", name: "svelte", top: "66%", left: "2%", anim: "animate-float-icon-4", delay: "1.5s", size: 42 },
  { id: "dar-1", name: "dart", top: "68%", left: "13%", anim: "animate-float-icon-2", delay: "0.8s", size: 40 },
  { id: "lin-1", name: "linux", top: "77%", left: "4%", anim: "animate-float-icon-1", delay: "1.4s", size: 44 },
  { id: "kot-1", name: "kotlin", top: "79%", left: "15%", anim: "animate-float-icon-3", delay: "0.6s", size: 40 },
  { id: "sqli-1", name: "sqlite", top: "87%", left: "3%", anim: "animate-float-icon-4", delay: "1.1s", size: 40 },
  { id: "and-1", name: "android", top: "89%", left: "14%", anim: "animate-float-icon-2", delay: "0.4s", size: 42 },

  // ─── Right Sector ───
  { id: "flt-1", name: "flutter", top: "22%", right: "3%", anim: "animate-float-icon-2", delay: "0.7s", size: 42 },
  { id: "sw-1", name: "swift", top: "24%", right: "14%", anim: "animate-float-icon-3", delay: "0.2s", size: 42 },
  { id: "cs-1", name: "csharp", top: "33%", right: "4%", anim: "animate-float-icon-4", delay: "1.2s", size: 42 },
  { id: "c-1", name: "c", top: "35%", right: "15%", anim: "animate-float-icon-1", delay: "0.8s", size: 40 },
  { id: "pg-1", name: "postgresql", top: "44%", right: "3%", anim: "animate-float-icon-2", delay: "0.4s", size: 44 },
  { id: "sql-1", name: "mysql", top: "46%", right: "14%", anim: "animate-float-icon-3", delay: "1.5s", size: 42 },
  { id: "red-1", name: "redis", top: "55%", right: "4%", anim: "animate-float-icon-1", delay: "0.8s", size: 40 },
  { id: "mon-1", name: "mongodb", top: "57%", right: "15%", anim: "animate-float-icon-4", delay: "1.1s", size: 42 },
  { id: "aws-1", name: "aws", top: "66%", right: "3%", anim: "animate-float-icon-3", delay: "1.3s", size: 44 },
  { id: "k8s-1", name: "kubernetes", top: "68%", right: "14%", anim: "animate-float-icon-1", delay: "0.5s", size: 44 },
  { id: "gcp-1", name: "gcp", top: "77%", right: "4%", anim: "animate-float-icon-2", delay: "0.9s", size: 42 },
  { id: "azu-1", name: "azure", top: "79%", right: "15%", anim: "animate-float-icon-4", delay: "1.6s", size: 42 },
  { id: "ng-1", name: "nginx", top: "87%", right: "3%", anim: "animate-float-icon-1", delay: "0.7s", size: 40 },
  { id: "app-1", name: "apple", top: "89%", right: "14%", anim: "animate-float-icon-3", delay: "1.2s", size: 40 },

  // ─── Center-Ambient Sector (Surrounding Auth Card) ───
  { id: "gitl-1", name: "git", top: "25%", left: "25%", anim: "animate-float-icon-1", delay: "1.7s", size: 36 },
  { id: "term-1", name: "terminal", top: "25%", right: "25%", anim: "animate-float-icon-3", delay: "0.5s", size: 36 },
  { id: "code-1", name: "code", top: "40%", left: "23%", anim: "animate-float-icon-4", delay: "1.0s", size: 36 },
  { id: "db-1", name: "database", top: "40%", right: "23%", anim: "animate-float-icon-2", delay: "0.8s", size: 36 },
  { id: "srv-1", name: "server", top: "60%", left: "23%", anim: "animate-float-icon-3", delay: "0.4s", size: 36 },
  { id: "sec-1", name: "security", top: "60%", right: "23%", anim: "animate-float-icon-1", delay: "1.3s", size: 36 },
  { id: "cpu-1", name: "cpu", top: "74%", left: "25%", anim: "animate-float-icon-2", delay: "1.1s", size: 36 },
  { id: "brn-1", name: "brain", top: "74%", right: "25%", anim: "animate-float-icon-4", delay: "0.6s", size: 36 },

  // ─── Bottom Perimeter ───
  { id: "ml-1", name: "machine_learning", bottom: "3%", left: "4%", anim: "animate-float-icon-1", delay: "0.5s", size: 42 },
  { id: "dl-1", name: "deep_learning", bottom: "4%", left: "16%", anim: "animate-float-icon-3", delay: "1.2s", size: 42 },
  { id: "gen-1", name: "generative_ai", bottom: "3%", left: "28%", anim: "animate-float-icon-2", delay: "0.8s", size: 42 },
  { id: "nlp-1", name: "nlp", bottom: "4%", left: "40%", anim: "animate-float-icon-4", delay: "0.3s", size: 40 },
  { id: "cv-1", name: "computer_vision", bottom: "4%", right: "40%", anim: "animate-float-icon-1", delay: "1.4s", size: 40 },
  { id: "ds-1", name: "data_science", bottom: "3%", right: "28%", anim: "animate-float-icon-3", delay: "0.7s", size: 42 },
  { id: "alg-1", name: "algorithm", bottom: "4%", right: "16%", anim: "animate-float-icon-2", delay: "1.0s", size: 42 },
  { id: "bin-1", name: "binary", bottom: "3%", right: "4%", anim: "animate-float-icon-4", delay: "0.6s", size: 42 },
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

      {/* 2. Precision Micro-Grid */}
      {!isMinimal && (
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isLight
              ? "bg-tech-grid-light opacity-35 radial-mask-vignette"
              : "bg-tech-grid opacity-25 radial-mask-vignette"
          }`}
        />
      )}

      {/* 3. 72+ Dense Floating Tech Brand Vectors */}
      {showLogos && (
        <div
          className={`block absolute inset-0 overflow-hidden pointer-events-none transform-gpu will-change-transform transition-opacity duration-300 ${
            isLight ? "opacity-65 sm:opacity-75" : "opacity-80 sm:opacity-90"
          }`}
        >
          {FLOATING_BRAND_LOGOS.map((item) => (
            <div
              key={item.id}
              className={`absolute ${item.anim} filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]`}
              style={{
                top: item.top,
                bottom: item.bottom,
                left: item.left,
                right: item.right,
                animationDelay: item.delay,
              }}
            >
              <TechIcon name={item.name} size={item.size} />
            </div>
          ))}
        </div>
      )}

      {/* 4. Edge Vignette */}
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
