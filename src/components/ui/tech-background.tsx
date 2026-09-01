"use client";

import React from "react";
import { useThemeAccent, BackgroundStyle } from "@/context/theme-accent-context";
import { useTheme } from "next-themes";
import { useSurface } from "@/context/surface-context";
import { cn } from "@/lib/utils";

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
  const { isApp } = useSurface();
  const { bgStyle: contextBgStyle, bgIntensity: contextIntensity } = useThemeAccent();
  const { resolvedTheme } = useResolvedTheme();
  const activeStyle = styleOverride || contextBgStyle || "tech-canvas";
  const activeIntensity = variant || contextIntensity || "subtle";

  if (isApp) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-white select-none"
      />
    );
  }

  const isLight = resolvedTheme === "light";
  const isMinimal = activeIntensity === "minimal" || activeStyle === "minimal-dark";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* Base Solid Surface */}
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-200",
          isLight ? "bg-[#fafaf8]" : "bg-[#fafaf8]"
        )}
      />

      {/* Subtle Precision Technical Micro-Grid */}
      {!isMinimal && (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            isLight
              ? "bg-tech-grid-light opacity-25 radial-mask-vignette"
              : "bg-tech-grid opacity-15 radial-mask-vignette"
          )}
        />
      )}

      {/* Subtle Edge Vignette */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-300",
          isLight
            ? "bg-gradient-to-b from-white/20 via-transparent to-stone-200/20 opacity-15"
            : "bg-gradient-to-b from-white/10 via-transparent to-stone-300/20 opacity-15"
        )}
      />
    </div>
  );
});

