"use client";

import React from "react";
import { useThemeAccent, BackgroundStyle } from "@/context/theme-accent-context";
import { useTheme } from "next-themes";

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
   QUIET & MODERN WORKSPACE BACKGROUND
   - Pure black & obsidian surfaces for deep focus
   - Whisper-quiet micro-grid pattern for technical elegance
   - Zero distracting floating logos or heavy neon blur orbs
   ============================================================ */

interface TechBackgroundProps {
  variant?: "bold" | "subtle" | "vivid" | "minimal";
  styleOverride?: BackgroundStyle;
}

export const TechBackground = React.memo(function TechBackground({
  variant,
  styleOverride,
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
      {/* 1. Base Solid Workspace Surface */}
      <div
        className={`absolute inset-0 transition-colors duration-200 ${
          isLight
            ? "bg-[#f8fafc]"
            : "bg-[#000000]"
        }`}
      />

      {/* 2. Quiet Precision Micro-Grid (Technical Workspace Depth) */}
      {!isMinimal && (
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isLight
              ? "bg-tech-grid-light opacity-40 radial-mask-vignette"
              : "bg-tech-grid opacity-20 radial-mask-vignette"
          }`}
        />
      )}

      {/* 3. Subtle Edge Vignette for Content Contrast */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isLight
            ? "bg-gradient-to-b from-white/30 via-transparent to-slate-200/40 opacity-40"
            : "bg-gradient-to-b from-black/40 via-transparent to-black/80 opacity-60"
        }`}
      />
    </div>
  );
});
