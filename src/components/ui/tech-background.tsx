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
   36+ FLOATING TECH BRAND VECTORS GRID
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
  // ─── Top Perimeter ───
  { id: "py-1", name: "python", top: "5%", left: "4%", anim: "animate-float-icon-1", delay: "0s", size: 44 },
  { id: "react-1", name: "react", top: "6%", left: "18%", anim: "animate-float-icon-2", delay: "0.8s", size: 46 },
  { id: "next-1", name: "nextjs", top: "4%", left: "34%", anim: "animate-float-icon-3", delay: "0.2s", size: 42 },
  { id: "node-1", name: "node", top: "4%", right: "34%", anim: "animate-float-icon-1", delay: "1.2s", size: 42 },
  { id: "tail-1", name: "tailwind", top: "6%", right: "18%", anim: "animate-float-icon-2", delay: "0.5s", size: 44 },
  { id: "java-1", name: "java", top: "5%", right: "4%", anim: "animate-float-icon-4", delay: "0.4s", size: 44 },

  // ─── Left Perimeter ───
  { id: "doc-1", name: "docker", top: "18%", left: "5%", anim: "animate-float-icon-3", delay: "1.2s", size: 42 },
  { id: "vue-1", name: "vue", top: "28%", left: "12%", anim: "animate-float-icon-4", delay: "0.6s", size: 40 },
  { id: "php-1", name: "php", top: "38%", left: "3%", anim: "animate-float-icon-1", delay: "0.9s", size: 44 },
  { id: "ang-1", name: "angular", top: "48%", left: "11%", anim: "animate-float-icon-2", delay: "1.4s", size: 40 },
  { id: "git-1", name: "github", top: "58%", left: "4%", anim: "animate-float-icon-3", delay: "0.3s", size: 42 },
  { id: "rust-1", name: "rust", top: "68%", left: "11%", anim: "animate-float-icon-1", delay: "1.0s", size: 42 },
  { id: "go-1", name: "golang", top: "78%", left: "4%", anim: "animate-float-icon-2", delay: "0.7s", size: 42 },
  { id: "sve-1", name: "svelte", top: "86%", left: "12%", anim: "animate-float-icon-4", delay: "1.5s", size: 40 },
  { id: "lin-1", name: "linux", top: "92%", left: "3%", anim: "animate-float-icon-1", delay: "1.4s", size: 44 },

  // ─── Right Perimeter ───
  { id: "cpp-1", name: "cpp", top: "18%", right: "5%", anim: "animate-float-icon-1", delay: "1.0s", size: 44 },
  { id: "flt-1", name: "flutter", top: "28%", right: "12%", anim: "animate-float-icon-2", delay: "0.7s", size: 40 },
  { id: "ts-1", name: "typescript", top: "38%", right: "3%", anim: "animate-float-icon-3", delay: "0.5s", size: 42 },
  { id: "kot-1", name: "kotlin", top: "48%", right: "11%", anim: "animate-float-icon-4", delay: "1.3s", size: 40 },
  { id: "js-1", name: "javascript", top: "58%", right: "4%", anim: "animate-float-icon-2", delay: "0.9s", size: 42 },
  { id: "sw-1", name: "swift", top: "68%", right: "11%", anim: "animate-float-icon-3", delay: "0.2s", size: 42 },
  { id: "cs-1", name: "csharp", top: "78%", right: "4%", anim: "animate-float-icon-4", delay: "1.2s", size: 42 },
  { id: "red-1", name: "redis", top: "86%", right: "12%", anim: "animate-float-icon-1", delay: "0.8s", size: 40 },
  { id: "pg-1", name: "postgresql", top: "92%", right: "3%", anim: "animate-float-icon-2", delay: "0.4s", size: 44 },

  // ─── Bottom Perimeter ───
  { id: "aws-1", name: "aws", bottom: "4%", left: "22%", anim: "animate-float-icon-2", delay: "1.3s", size: 42 },
  { id: "k8s-1", name: "kubernetes", bottom: "3%", left: "35%", anim: "animate-float-icon-4", delay: "0.5s", size: 44 },
  { id: "sql-1", name: "mysql", bottom: "3%", right: "35%", anim: "animate-float-icon-3", delay: "0.4s", size: 44 },
  { id: "mongo-1", name: "mongodb", bottom: "4%", right: "22%", anim: "animate-float-icon-1", delay: "1.1s", size: 42 },

  // ─── Ambient Corner & Filler Accents ───
  { id: "fig-1", name: "figma", top: "14%", left: "26%", anim: "animate-float-icon-3", delay: "1.6s", size: 36 },
  { id: "dart-1", name: "dart", top: "14%", right: "26%", anim: "animate-float-icon-1", delay: "0.8s", size: 36 },
  { id: "html-1", name: "html", bottom: "14%", left: "28%", anim: "animate-float-icon-4", delay: "1.0s", size: 38 },
  { id: "css-1", name: "css", bottom: "14%", right: "28%", anim: "animate-float-icon-2", delay: "0.6s", size: 38 },
  { id: "gitl-1", name: "git", top: "50%", left: "20%", anim: "animate-float-icon-1", delay: "1.7s", size: 36 },
  { id: "dj-1", name: "django", top: "50%", right: "20%", anim: "animate-float-icon-3", delay: "1.5s", size: 36 },
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

      {/* 3. 36+ Floating Tech Brand Vectors (Enabled on Auth / Login pages) */}
      {showLogos && (
        <div
          className={`block absolute inset-0 overflow-hidden pointer-events-none transform-gpu will-change-transform transition-opacity duration-300 ${
            isLight ? "opacity-60 sm:opacity-70" : "opacity-75 sm:opacity-85"
          }`}
        >
          {FLOATING_BRAND_LOGOS.map((item) => (
            <div
              key={item.id}
              className={`absolute ${item.anim} filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] hover:scale-110 transition-transform`}
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
            : "bg-gradient-to-b from-black/30 via-transparent to-black/70 opacity-50"
        }`}
      />
    </div>
  );
});
