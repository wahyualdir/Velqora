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
   AUTHENTIC BRAND SVG ICONS FOR FLOATING LOGO CANVAS
   ============================================================ */

function PythonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path
        d="M63.5 4C31.5 4 33.5 17.9 33.5 17.9l.1 14.3h32.6v4.6H20.5S1.5 34.5 1.5 66.7c0 32.1 16.3 31 16.3 31h9.7V84.3s-.6-16.3 16.3-16.3h32.4v-4.8s14.4.4 14.4-16.1V17.9S93.1 4 63.5 4zm-11.5 9.7c3.6 0 6.5 2.9 6.5 6.5s-2.9 6.5-6.5 6.5-6.5-2.9-6.5-6.5 2.9-6.5 6.5-6.5z"
        fill="url(#py-blue-grad-auth)"
      />
      <path
        d="M64.5 124c32 0 30-13.9 30-13.9l-.1-14.3H61.8v-4.6h45.7s19 2.3 19-29.9c0-32.1-16.3-31-16.3-31h-9.7v13.4s.6 16.3-16.3 16.3H52v4.8s-14.4-.4-14.4 16.1v26.3s-2.5 13.9 26.9 13.9zm11.5-9.7c-3.6 0-6.5-2.9-6.5-6.5s2.9-6.5 6.5-6.5 6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5z"
        fill="url(#py-yellow-grad-auth)"
      />
      <defs>
        <linearGradient id="py-blue-grad-auth" x1="1.5" y1="4" x2="88.7" y2="84.3" gradientUnits="userSpaceOnUse">
          <stop stopColor="#387EB8" />
          <stop offset="1" stopColor="#366994" />
        </linearGradient>
        <linearGradient id="py-yellow-grad-auth" x1="126.5" y1="124" x2="37.6" y2="43.7" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE873" />
          <stop offset="1" stopColor="#FFD43B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function JavaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M47.6 98.1s-4.8 2.8 3.4 3.7c9.9 1.1 14.9 1 25.8-1.1 0 0 2.9 1.8 6.9 3.4-24.4 10.5-55.3-.6-36.1-6zm-3-13.7s-5.3 4 2.8 4.8c10.6 1.1 18.9 1.2 33.4-1.6 0 0 2 2 5.1 3.1-29.5 8.6-62.4.7-41.3-6.3z" fill="#5382A1" />
      <path d="M69.8 61.3c6 6.9-1.6 13.2-1.6 13.2s15.3-7.9 8.3-17.8c-6.6-9.2-11.6-13.8 15.6-29.6 0 0-42.7 10.7-22.3 34.2z" fill="#E76F00" />
      <path d="M102.1 108.2s3.5 2.9-3.9 5.2c-14.1 4.3-58.7 5.6-71.1.2-4.5-1.9 3.9-4.6 6.5-5.2 2.7-.6 4.3-.5 4.3-.5-5-3.5-32 6.9-13.7 9.8 49.8 8.1 90.8-3.6 77.9-9.5zM49.9 70.3s-22.7 5.4-8 7.3c6.2.8 18.5.6 30-.3 9.4-.8 18.8-2.5 18.8-2.5s-3.3 1.4-5.7 3.1c-23 6.1-67.5 3.2-54.7-3 10.8-5.2 19.6-4.6 19.6-4.6zm40.7 22.7c23.4-12.2 12.6-23.9 5-22.3-1.8.4-2.7.7-2.7.7s.7-1.1 2-1.5c15-5.3 26.5 15.5-4.8 23.7 0 0 .4-.3.5-.6z" fill="#5382A1" />
      <path d="M76.5 1.6S89.5 14.6 64.2 33.5C43.9 48.7 59.6 57.4 64.2 67.3c-11.9-10.7-20.6-20.1-14.7-28.9 7.5-13.1 30.5-19.5 27-36.8z" fill="#E76F00" />
      <path d="M52.2 126c22.5 1.4 57-.8 57.8-11.4 0 0-1.6 4-18.6 7.2-19.2 3.6-42.9 3.2-56.9.9 0 0 2.9 2.4 17.7 3.3z" fill="#5382A1" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M64 4C28.7 4 0 32.7 0 68c0 28.3 18.3 52.3 43.8 60.8 3.2.6 4.4-1.4 4.4-3.1 0-1.5-.1-5.5-.1-10.9-17.8 3.9-21.6-8.6-21.6-8.6-2.9-7.4-7.1-9.4-7.1-9.4-5.8-4 .4-3.9.4-3.9 6.4.5 9.8 6.6 9.8 6.6 5.7 9.8 15 7 18.6 5.3.6-4.1 2.2-7 4.1-8.6-14.2-1.6-29.2-7.1-29.2-31.7 0-7 2.5-12.7 6.6-17.2-.7-1.6-2.9-8.1.6-17 0 0 5.4-1.7 17.6 6.6 5.1-1.4 10.6-2.1 16-2.2 5.4 0 10.9.7 16 2.2 12.2-8.3 17.6-6.6 17.6-6.6 3.5 8.9 1.3 15.4.6 17 4.1 4.5 6.6 10.2 6.6 17.2 0 24.6-15 30-29.3 31.6 2.3 2 4.3 5.9 4.3 11.9 0 8.6-.1 15.5-.1 17.6 0 1.7 1.2 3.7 4.4 3.1 25.4-8.6 43.7-32.5 43.7-60.8C128 32.7 99.3 4 64 4z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function NvidiaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path
        d="M62.6 22c-23.8 0-43.2 19.4-43.2 43.2 0 23.8 19.4 43.2 43.2 43.2 16.5 0 31.1-9.4 38.3-23.1V74.1C94 83.7 82.8 90.7 70 90.7c-14.2 0-25.7-11.5-25.7-25.7S55.8 39.3 70 39.3c10.4 0 19.4 6.2 23.6 15.2h17.9C105.8 35.2 85.9 22 62.6 22zm0 25.5c-9.8 0-17.7 7.9-17.7 17.7s7.9 17.7 17.7 17.7c7.2 0 13.4-4.3 16.2-10.4V57.9c-2.8-6.1-9-10.4-16.2-10.4zm0 10.6c3.9 0 7.1 3.2 7.1 7.1s-3.2 7.1-7.1 7.1-7.1-3.2-7.1-7.1 3.2-7.1 7.1-7.1z"
        fill="#76B900"
      />
      <path
        d="M109.8 65.2c0-1.8-.2-3.6-.6-5.3H95.4c.5 1.7.8 3.5.8 5.3 0 14.2-11.5 25.7-25.7 25.7-8.1 0-15.3-3.8-20-9.6l-11.8 11.8C46.8 101.4 57.6 107 70.5 107c23.2 0 42-18.8 42-42-.1.1-.7.2-2.7.2z"
        fill="#76B900"
        opacity="0.8"
      />
    </svg>
  );
}

function ReactIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-11.5 -10.23 23 20.46" fill="none">
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1.1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

function DockerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path
        d="M118.4 47.9c-2.3-1.6-7.4-2.4-11.9-.9-1.2.4-2.3 1-3.3 1.8-.8-4.5-3.3-8.5-7.1-11.3l-2.4-1.7-1.7 2.4c-3.1 4.4-4.5 9.7-4.1 15-4.2.1-13.4 1.2-19.1 7.2h-63v30.4c0 14.9 11.4 27.2 26 28.2 24.3 1.7 49-.2 71.9-8.4 10.3-3.7 17.5-12.7 18.9-23.7.8-6.1 1.7-18.3-4.2-39zm-86.8 4.2h10.4v9.6H31.6v-9.6zm13.6 0h10.4v9.6H45.2v-9.6zm13.6 0h10.4v9.6H58.8v-9.6zm-27.2-13.6h10.4v9.6H31.6v-9.6zm13.6 0h10.4v9.6H45.2v-9.6zm13.6 0h10.4v9.6H58.8v-9.6zm13.6 0h10.4v9.6H72.4v-9.6z"
        fill="#2496ED"
      />
    </svg>
  );
}

function CPPIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M64 4L12 34v60l52 30 52-30V34L64 4z" fill="#00599C" />
      <path d="M64 14.8L21.4 39.4v49.2L64 113.2l42.6-24.6V39.4L64 14.8z" fill="#004482" />
      <path d="M64 32.7c-17.3 0-31.3 14-31.3 31.3s14 31.3 31.3 31.3c12.7 0 23.7-7.6 28.5-18.5H76.2C73.3 80.7 68.9 83 64 83c-10.5 0-19-8.5-19-19s8.5-19 19-19c4.9 0 9.3 2.3 12.2 6.2h16.3c-4.8-10.9-15.8-18.5-28.5-18.5z" fill="#FFFFFF" />
      <path d="M89.7 54.7h5.2v6.2h6.2v5.2h-6.2v6.2h-5.2v-6.2h-6.2v-5.2h6.2v-6.2zm17.5 0h5.2v6.2h6.2v5.2h-6.2v6.2h-5.2v-6.2h-6.2v-5.2h6.2v-6.2z" fill="#659AD2" />
    </svg>
  );
}

function JSIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <rect width="128" height="128" rx="16" fill="#F7DF1E" />
      <path d="M38.4 104.8c5.4 3.1 11.8 5 18.2 5 11.2 0 18.6-5.6 18.6-17.5V47.5H62.7v44.6c0 6.6-3.7 9.8-9.4 9.8-3.9 0-7.3-1.4-9.8-3.1l-5.1 6zm49.9-1.3c6.3 3.6 14.6 6.3 23.6 6.3 13.5 0 22.3-6.8 22.3-17.2 0-9.8-6.1-14.7-17.2-19.5l-5.1-2.2c-7.3-3.1-10.8-5.9-10.8-10.5 0-4.4 3.7-7.7 10-7.7 5.7 0 10.6 1.8 14.7 4.5l4.5-8.2c-4.7-3.1-11.4-5.2-19.2-5.2-13.1 0-21.7 7.4-21.7 17.5 0 9.7 6.4 15.2 16.5 19.5l5.2 2.3c8.1 3.5 11.7 6.6 11.7 11.2 0 5-4.4 8.4-11.7 8.4-7.4 0-13.5-2.8-18-6.6l-4.8 7.3z" fill="#000000" />
    </svg>
  );
}

function TSIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <rect width="128" height="128" rx="16" fill="#3178C6" />
      <path d="M38.6 54.4H17.8V44h54.8v10.4H51.8v56.8H38.6V54.4zm39.1 49.1c6.3 3.6 14.6 6.3 23.6 6.3 13.5 0 22.3-6.8 22.3-17.2 0-9.8-6.1-14.7-17.2-19.5l-5.1-2.2c-7.3-3.1-10.8-5.9-10.8-10.5 0-4.4 3.7-7.7 10-7.7 5.7 0 10.6 1.8 14.7 4.5l4.5-8.2c-4.7-3.1-11.4-5.2-19.2-5.2-13.1 0-21.7 7.4-21.7 17.5 0 9.7 6.4 15.2 16.5 19.5l5.2 2.3c8.1 3.5 11.7 6.6 11.7 11.2 0 5-4.4 8.4-11.7 8.4-7.4 0-13.5-2.8-18-6.6l-4.8 7.3z" fill="#FFFFFF" />
    </svg>
  );
}

function LinuxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M64 6C46.8 6 39.7 22.4 41.2 41c.8 10 3.7 20 2.2 28.5-2.3 12.8-17.2 22.2-17.2 33.5 0 10.8 14.8 19 37.8 19s37.8-8.2 37.8-19c0-11.3-14.9-20.7-17.2-33.5-1.5-8.5 1.4-18.5 2.2-28.5C88.3 22.4 81.2 6 64 6z" fill="#000000" />
      <path d="M64 16c-13.2 0-18.4 12.8-17.2 28 .8 10 3.2 18.5 2 26-1.8 11.5-14.8 18-14.8 28 0 7.8 12 14 30 14s30-6.2 30-14c0-10-13-16.5-14.8-28-1.2-7.5 1.2-16 2-26 1.2-15.2-4-28-17.2-28z" fill="#FFFFFF" />
      <ellipse cx="53" cy="36" rx="4" ry="7" fill="#000000" />
      <ellipse cx="75" cy="36" rx="4" ry="7" fill="#000000" />
      <path d="M50 48s4 12 14 12 14-12 14-12H50z" fill="#FFA500" />
    </svg>
  );
}

function NextJSIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <circle cx="64" cy="64" r="60" fill="#000000" stroke="#333333" strokeWidth="4" />
      <path d="M85.3 93.3L46.7 44h-8v40h7.3V54.7l34.7 44.6c1.6-1.9 3.2-3.9 4.6-6z" fill="#FFFFFF" />
      <rect x="74" y="44" width="7.3" height="40" fill="#FFFFFF" />
    </svg>
  );
}

function TailwindIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M32 44c5.3-10.7 13.3-16 24-16 16 0 20 12 28 14 5.3 1.3 10.7-.7 16-6-5.3 10.7-13.3 16-24 16-16 0-20-12-28-14-5.3-1.3-10.7.7-16 6zm-16 32c5.3-10.7 13.3-16 24-16 16 0 20 12 28 14 5.3 1.3 10.7-.7 16-6-5.3 10.7-13.3 16-24 16-16 0-20-12-28-14-5.3-1.3-10.7.7-16 6z" fill="#38BDF8" />
    </svg>
  );
}

function PHPIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <ellipse cx="64" cy="64" rx="60" ry="34" fill="#777BB4" />
      <path d="M38 48h14c6 0 10 3 9 8s-5 8-11 8h-6l-3 16h-9l6-32zm8 10l-2 9h5c3 0 5-1 5-4s-1-5-4-5h-4zM68 48h9l-6 32h-9l6-32zm18 0h14c6 0 10 3 9 8s-5 8-11 8h-6l-3 16h-9l6-32zm8 10l-2 9h5c3 0 5-1 5-4s-1-5-4-5h-4z" fill="#FFFFFF" />
    </svg>
  );
}

function RustIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <circle cx="64" cy="64" r="54" stroke="#DEA584" strokeWidth="8" strokeDasharray="14 6" fill="none" />
      <path d="M44 42h22c8 0 14 4 14 11s-6 11-14 11H52l-2 22h-8l2-44zm10 8l-1 10h11c4 0 7-2 7-5s-3-5-7-5H54zm24 14l10 22h9L86 64h-8z" fill="#DEA584" />
    </svg>
  );
}

function GoLangIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M22 68c0-14 10-24 24-24 12 0 20 7 23 16h-11c-2-4-6-7-12-7-8 0-13 6-13 15s5 15 13 15c6 0 10-3 12-7H46v-9h24v22c-6 5-14 8-24 8-14 0-24-10-24-24zm62 0c0-14 10-24 24-24s24 10 24 24-10 24-24 24-24-10-24-24zm37 0c0-9-5-15-13-15s-13 6-13 15 5 15 13 15 13-6 13-15z" fill="#00ADD8" />
    </svg>
  );
}

function PostgresIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M64 12c-26 0-42 18-42 40 0 16 8 28 20 34v16l14-8c3 1 5 1 8 1 26 0 42-18 42-43S90 12 64 12z" fill="#336791" />
      <path d="M50 42c0-8 6-14 14-14s14 6 14 14-6 14-14 14-14-6-14-14z" fill="#FFFFFF" />
    </svg>
  );
}

/* ============================================================
   TECH BACKGROUND COMPONENT
   - showLogos={true} for Auth / Login / Register pages
   - showLogos={false} (default) for Clean Focused Workspace
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

  const iconSize = "w-9 h-9 sm:w-11 sm:h-11";
  const iconSizeSmall = "w-7 h-7 sm:w-8 sm:h-8";

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
              : "bg-tech-grid opacity-20 radial-mask-vignette"
          }`}
        />
      )}

      {/* 3. Floating Tech Brand Vectors (Enabled for Login / Auth screens) */}
      {showLogos && (
        <div
          className={`block absolute inset-0 overflow-hidden pointer-events-none transform-gpu will-change-transform transition-all duration-500 ${
            isLight
              ? "opacity-25 sm:opacity-30"
              : "opacity-30 sm:opacity-35"
          }`}
        >
          {/* Python */}
          <div className="absolute top-[8%] left-[6%] animate-float-icon-1" style={{ animationDelay: "0s" }}>
            <PythonIcon className={iconSize} />
          </div>
          {/* Java */}
          <div className="absolute top-[10%] right-[8%] animate-float-icon-2" style={{ animationDelay: "0.4s" }}>
            <JavaIcon className={iconSize} />
          </div>
          {/* Github */}
          <div className="absolute top-[38%] left-[4%] animate-float-icon-3" style={{ animationDelay: "0.8s" }}>
            <GithubIcon className={iconSizeSmall} />
          </div>
          {/* Nvidia */}
          <div className="absolute top-[42%] right-[5%] animate-float-icon-4" style={{ animationDelay: "0.2s" }}>
            <NvidiaIcon className={iconSize} />
          </div>
          {/* React */}
          <div className="absolute top-[20%] left-[22%] animate-float-icon-2" style={{ animationDelay: "1.2s" }}>
            <ReactIcon className={iconSize} />
          </div>
          {/* Docker */}
          <div className="absolute bottom-[15%] left-[8%] animate-float-icon-1" style={{ animationDelay: "0.6s" }}>
            <DockerIcon className={iconSize} />
          </div>
          {/* CPP */}
          <div className="absolute top-[18%] right-[22%] animate-float-icon-3" style={{ animationDelay: "1.0s" }}>
            <CPPIcon className={iconSize} />
          </div>
          {/* JavaScript */}
          <div className="absolute bottom-[20%] right-[12%] animate-float-icon-2" style={{ animationDelay: "0.3s" }}>
            <JSIcon className={iconSize} />
          </div>
          {/* TypeScript */}
          <div className="absolute bottom-[12%] right-[22%] animate-float-icon-4" style={{ animationDelay: "1.5s" }}>
            <TSIcon className={iconSize} />
          </div>
          {/* Linux */}
          <div className="absolute bottom-[6%] left-[30%] animate-float-icon-4" style={{ animationDelay: "0.7s" }}>
            <LinuxIcon className={iconSize} />
          </div>
          {/* Next.js */}
          <div className="absolute top-[4%] left-[48%] animate-float-icon-3" style={{ animationDelay: "0.2s" }}>
            <NextJSIcon className={iconSize} />
          </div>
          {/* Tailwind */}
          <div className="absolute top-[5%] right-[28%] animate-float-icon-2" style={{ animationDelay: "0.5s" }}>
            <TailwindIcon className={iconSize} />
          </div>
          {/* PHP */}
          <div className="absolute top-[26%] left-[10%] animate-float-icon-4" style={{ animationDelay: "0.9s" }}>
            <PHPIcon className={iconSize} />
          </div>
          {/* Rust */}
          <div className="absolute bottom-[28%] left-[18%] animate-float-icon-2" style={{ animationDelay: "1.3s" }}>
            <RustIcon className={iconSize} />
          </div>
          {/* GoLang */}
          <div className="absolute top-[32%] left-[44%] animate-float-icon-1" style={{ animationDelay: "1.1s" }}>
            <GoLangIcon className={iconSize} />
          </div>
          {/* Postgres */}
          <div className="absolute top-[52%] left-[48%] animate-float-icon-4" style={{ animationDelay: "0.6s" }}>
            <PostgresIcon className={iconSize} />
          </div>
        </div>
      )}

      {/* 4. Subtle Edge Vignette */}
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
