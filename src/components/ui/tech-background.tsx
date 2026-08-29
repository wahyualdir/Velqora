"use client";

import React from "react";
import { useThemeAccent, BackgroundStyle } from "@/context/theme-accent-context";
import { useTheme } from "next-themes";

function useResolvedTheme() {
  const [mounted, setMounted] = React.useState(false);
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return { resolvedTheme: mounted ? (resolvedTheme || "dark") : "dark" };
}

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
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* Base Solid Surface */}
      <div
        className={`absolute inset-0 transition-colors duration-200 ${
          isLight ? "bg-[#f8fafc]" : "bg-[#000000]"
        }`}
      />

      {/* Subtle Precision Technical Micro-Grid */}
      {!isMinimal && (
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isLight
              ? "bg-tech-grid-light opacity-25 radial-mask-vignette"
              : "bg-tech-grid opacity-15 radial-mask-vignette"
          }`}
        />
      )}

      {/* Subtle Edge Vignette */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isLight
            ? "bg-gradient-to-b from-white/20 via-transparent to-slate-200/30 opacity-20"
            : "bg-gradient-to-b from-black/20 via-transparent to-black/60 opacity-30"
        }`}
      />
    </div>
  );
});

