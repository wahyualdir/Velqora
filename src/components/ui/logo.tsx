"use client";

import React from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   VELQORA BRAND IDENTITY SYSTEM
   Concept: "The Structured Knowledge Vertex"
   - Architectural Monogram 'V' built with geometric precision
   - Left Pillar: Structural Knowledge Foundation
   - Right Wing: Synthesis & Upward Learning Progression
   - Zero AI tropes, Zero fake gradients, 100% Vector Scalable
   ============================================================ */

export interface VelqoraMarkProps {
  size?: number;
  className?: string;
  variant?: "primary" | "monochrome" | "white" | "dark" | "outline" | "tile";
  withTile?: boolean;
}

/**
 * Pure Vector Scalable Geometric Brand Mark for Velqora
 * Works flawlessly from 16x16px (favicon) to 512x512px (billboard)
 */
export function VelqoraMark({
  size = 32,
  className = "",
  variant = "primary",
  withTile = false,
}: VelqoraMarkProps) {
  const showTile = withTile || variant === "tile";

  // Theme & variant color mapping
  const getColors = () => {
    switch (variant) {
      case "monochrome":
        return {
          left: "fill-current text-text-primary",
          right: "fill-current text-text-secondary",
          node: "fill-current text-text-tertiary",
        };
      case "white":
        return {
          left: "fill-white",
          right: "fill-white/80",
          node: "fill-white/60",
        };
      case "dark":
        return {
          left: "fill-slate-900",
          right: "fill-slate-700",
          node: "fill-slate-500",
        };
      case "outline":
        return {
          left: "stroke-current text-brand-400 fill-none stroke-[2]",
          right: "stroke-current text-brand-300 fill-none stroke-[2]",
          node: "fill-brand-400",
        };
      case "tile":
      case "primary":
      default:
        return {
          left: "fill-[#a34530] dark:fill-[#c2553a]",
          right: "fill-[#c2553a] dark:fill-[#e0654f]",
          node: "fill-[#e0654f] dark:fill-[#f48e7c]",
        };
    }
  };

  const colors = getColors();

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 transition-transform duration-200 select-none", className)}
      style={{ width: size, height: size }}
      shapeRendering="geometricPrecision"
      aria-label="Velqora Brand Mark"
      role="img"
    >
      {/* Optional Obsidian Squircle Tile Background */}
      {showTile && (
        <>
          <rect width="32" height="32" rx="8" fill="#1c1917" />
          <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" stroke="#44403c" strokeWidth="1" />
        </>
      )}

      {/* Left Foundation Pillar */}
      <path
        d="M6 6.5C6 5.67 6.67 5 7.5 5H12.2C12.87 5 13.46 5.43 13.65 6.07L18.45 22.07C18.74 23.03 18.02 24 17.02 24H12.8C12.13 24 11.54 23.57 11.35 22.93L6.15 7.43C6.05 7.14 6 6.83 6 6.5Z"
        className={colors.left}
      />

      {/* Right Ascending Wing */}
      <path
        d="M26 6.5C26 5.67 25.33 5 24.5 5H19.8C19.13 5 18.54 5.43 18.35 6.07L13.55 22.07C13.26 23.03 13.98 24 14.98 24H19.2C19.87 24 20.46 23.57 20.65 22.93L25.85 7.43C25.95 7.14 26 6.83 26 6.5Z"
        className={colors.right}
      />

      {/* Central Keystone / Base Vertex Anchor */}
      <polygon
        points="16,21.5 18.5,26 13.5,26"
        className={colors.node}
      />
    </svg>
  );
}

/* ============================================================
   RESPONSIVE LOGO SYSTEM (Mark + Wordmark)
   ============================================================ */

export interface LogoProps {
  className?: string;
  variant?: "full" | "sidebar" | "navbar" | "icon" | "stacked" | "monochrome";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  markVariant?: "primary" | "monochrome" | "white" | "dark" | "outline" | "tile";
  withTile?: boolean;
  showSubtitle?: boolean;
  hideText?: boolean;
}

export function Logo({
  className = "",
  variant = "full",
  size = "md",
  markVariant = "primary",
  withTile = false,
  showSubtitle = true,
  hideText = false,
}: LogoProps) {
  // Size tokens
  const markSizes: Record<string, number> = {
    xs: 20,
    sm: 26,
    md: 32,
    lg: 40,
    xl: 48,
  };

  const titleSizes: Record<string, string> = {
    xs: "text-xs tracking-tight",
    sm: "text-sm tracking-tight",
    md: "text-base tracking-tight",
    lg: "text-xl tracking-tight",
    xl: "text-2xl sm:text-3xl tracking-tight",
  };

  const subtitleSizes: Record<string, string> = {
    xs: "text-[9px] tracking-wider",
    sm: "text-[10px] tracking-wider",
    md: "text-[11px] tracking-wider",
    lg: "text-xs tracking-wider",
    xl: "text-xs tracking-widest",
  };

  const currentMarkSize = markSizes[size] || 32;

  // Icon only or hideText
  if (variant === "icon" || hideText) {
    return (
      <div className={cn("inline-flex items-center justify-center", className)}>
        <VelqoraMark size={currentMarkSize} variant={markVariant} withTile={withTile} />
      </div>
    );
  }

  // Sidebar Header Variant (Calm, confident, perfectly proportioned 38-42px)
  if (variant === "sidebar") {
    return (
      <div className={cn("flex items-center gap-2.5 min-w-0 select-none", className)}>
        <VelqoraMark size={24} variant={markVariant} withTile={withTile} className="shrink-0" />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-text-primary leading-tight font-display tracking-tight">
            Vel<span className="text-brand-500">qora</span>
          </span>
          {showSubtitle && (
            <span className="text-[8.5px] font-mono text-text-tertiary leading-none mt-0.5 uppercase tracking-[0.15em] font-semibold">
              LEARNING PLATFORM
            </span>
          )}
        </div>
      </div>
    );
  }

  // Navbar Compact Variant
  if (variant === "navbar") {
    return (
      <div className={cn("flex items-center gap-2 select-none", className)}>
        <VelqoraMark size={24} variant={markVariant} />
        <span className="text-sm font-bold text-text-primary leading-none font-display tracking-tight">
          Vel<span className="text-brand-400">qora</span>
        </span>
      </div>
    );
  }

  // Stacked Center Variant (for Auth / Landing Hero)
  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col items-center text-center gap-3 select-none", className)}>
        <VelqoraMark size={40} variant={markVariant} />
        <div className="flex flex-col items-center">
          <span className={cn("font-bold text-text-primary font-display leading-tight", titleSizes[size])}>
            Vel<span className="text-brand-400">qora</span>
          </span>
          {showSubtitle && (
            <span className={cn("font-mono text-text-tertiary uppercase font-medium mt-0.5", subtitleSizes[size])}>
              Learning Platform
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full Horizontal Variant (Default)
  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      <VelqoraMark size={28} variant={markVariant} className="shrink-0" />
      <div className="flex flex-col">
        <span className={cn("font-bold text-text-primary font-display leading-tight", titleSizes[size])}>
          Vel<span className="text-brand-400">qora</span>
        </span>
        {showSubtitle && (
          <span className={cn("font-mono text-text-tertiary uppercase font-medium", subtitleSizes[size])}>
            Learning Platform
          </span>
        )}
      </div>
    </div>
  );
}
