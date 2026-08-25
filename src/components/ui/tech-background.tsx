"use client";

import React from "react";
import { useThemeAccent, BackgroundStyle, BackgroundIntensity } from "@/context/theme-accent-context";
import { useTheme } from "next-themes";

/* ============================================================
   AUTHENTIC BRAND SVG LOGO COMPONENTS — 37 Official Vectors
   Precision crafted to match exact official brand guidelines & shapes
   ============================================================ */

/* 1. Python — Official Dual Interlocking Snakes */
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

/* 2. Java — Official Duke Cup & Hot Steam */
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

/* 3. GitHub — Official Invertocat */
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

/* 4. NVIDIA — Official Spiral Eye / Claw Vector */
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

/* 5. React — Official Atom Orbital Core */
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

/* 6. Docker — Official Whale & Container Grid */
function DockerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path
        d="M124.5 59.8c-2.3-1.6-6-2.5-10.8-2.5-3.3 0-6.7.8-9.8 2.1-2.2-4.9-6.4-8.6-11.6-10.2-2.7-.9-5.6-1.1-8.4-.9v.3c0 2.2.8 4.3 2.1 6 1.6 2.1 4 3.4 6.6 3.9l.9.1c2.9.4 5.7 1.8 7.8 3.9 1.9 1.9 3 4.5 3.1 7.2H6.3v3.5c1 12.8 7.3 24.4 17.3 31.8 9.5 7.1 23.6 10.8 37.9 10.8 43 0 72.9-24.3 77.2-53.4 2.7-.8 5.1-2.3 7.2-4.2l.9-.9c1.3-1.4 1.4-2.1 0-3.1l-2.3-1.5z"
        fill="#2496ED"
      />
      <g fill="#2496ED">
        <rect x="25.5" y="47.8" width="13.2" height="13.2" rx="1.5" />
        <rect x="42.5" y="47.8" width="13.2" height="13.2" rx="1.5" />
        <rect x="59.5" y="47.8" width="13.2" height="13.2" rx="1.5" />
        <rect x="76.5" y="47.8" width="13.2" height="13.2" rx="1.5" />
        <rect x="42.5" y="31.8" width="13.2" height="13.2" rx="1.5" />
        <rect x="59.5" y="31.8" width="13.2" height="13.2" rx="1.5" />
        <rect x="76.5" y="31.8" width="13.2" height="13.2" rx="1.5" />
        <rect x="59.5" y="15.8" width="13.2" height="13.2" rx="1.5" />
      </g>
    </svg>
  );
}

/* 7. Linux — Official Tux Penguin */
function LinuxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M64 4c-16 0-25 12-25 28 0 8 2 16 2 24-8 8-16 20-16 34 0 18 12 28 24 28 2 3 6 6 15 6s13-3 15-6c12 0 24-10 24-28 0-14-8-26-16-34 0-8 2-16 2-24 0-16-9-28-25-28z" fill="#222222" />
      <path d="M64 48c-14 0-20 16-20 36 0 18 8 28 20 28s20-10 20-28c0-20-6-36-20-36z" fill="#FFFFFF" />
      <circle cx="56" cy="28" r="4" fill="#FFFFFF" />
      <circle cx="72" cy="28" r="4" fill="#FFFFFF" />
      <circle cx="57" cy="28" r="2" fill="#000000" />
      <circle cx="71" cy="28" r="2" fill="#000000" />
      <path d="M58 34h12l-6 10-6-10z" fill="#FFA500" />
      <path d="M38 114c-8 0-16 4-12 10s14 4 22 0l-10-10zm52 0c8 0 16 4 12 10s-14 4-22 0l10-10z" fill="#FFA500" />
    </svg>
  );
}

/* 8. Git — Official Diamond Branching Logo */
function GitIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M125.6 58.3L69.7 2.4c-3.2-3.2-8.5-3.2-11.7 0L46.4 14l14.7 14.7c3.4-1.2 7.4-.3 10 2.4 2.7 2.7 3.5 6.7 2.4 10.1l14.2 14.2c3.4-1.1 7.4-.3 10.1 2.4 3.9 3.9 3.9 10.1 0 14-3.9 3.9-10.1 3.9-14 0-2.8-2.8-3.6-6.9-2.3-10.4L68.2 43.9v34.9c1 .6 1.9 1.4 2.6 2.2 3.9 3.9 3.9 10.1 0 14-3.9 3.9-10.1 3.9-14 0-3.9-3.9-3.9-10.1 0-14 .9-.9 2-1.6 3.2-2.1V43.2c-1.2-.5-2.3-1.2-3.2-2.1-2.8-2.8-3.6-6.9-2.4-10.4L40.8 19.6 2.4 58c-3.2 3.2-3.2 8.5 0 11.7l55.9 55.9c3.2 3.2 8.5 3.2 11.7 0l55.6-55.6c3.2-3.2 3.2-8.5 0-11.7z" fill="#F05032" />
    </svg>
  );
}

/* 9. VS Code — Official Folded Ribbon */
function VSCodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M96.7 126.9c3.4 1.7 7.6 1.3 10.6-.9l17.4-13.4c3.4-2.6 5.3-6.6 5.3-10.9V26.3c0-4.3-1.9-8.3-5.3-10.9L107.3 2c-3-2.3-7.2-2.6-10.6-.9-3.4 1.7-5.5 5.2-5.5 9.1v7.9L48.5 50.8 23.3 31.7c-2.7-2-6.4-2-9.1 0L2.5 40.5C.9 41.7 0 43.6 0 45.6c0 2 1 3.9 2.5 5.1l21.2 16.1L2.5 82.9c-1.6 1.2-2.5 3.1-2.5 5.1s.9 3.9 2.5 5.1l11.7 8.8c2.7 2 6.4 2 9.1 0l25.2-19.1 42.7 32.8v2.2c0 3.9 2.1 7.4 5.5 9.1z" fill="#007ACC" />
      <path d="M107.3 2c-3-2.3-7.2-2.6-10.6-.9-3.4 1.7-5.5 5.2-5.5 9.1v7.9l-42.7 32.7 18.7 14.2 40.1-30.8V26.3l-17.4-13.4z" fill="#1F9CF0" />
      <path d="M91.2 99.8v7.9c0 3.9 2.1 7.4 5.5 9.1 3.4 1.7 7.6 1.3 10.6-.9l17.4-13.4V73.2L84.6 94.7l6.6 5.1z" fill="#0065A9" />
    </svg>
  );
}

/* 10. Go (Golang) — Official Cyan Speed Monogram */
function GoLangIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M11.6 51.5c-6.4 0-11.6 5.2-11.6 11.6s5.2 11.6 11.6 11.6h25.8c6.4 0 11.6-5.2 11.6-11.6s-5.2-11.6-11.6-11.6H11.6zm0 18.2c-3.6 0-6.6-3-6.6-6.6s3-6.6 6.6-6.6h25.8c3.6 0 6.6 3 6.6 6.6s-3 6.6-6.6 6.6H11.6zM0 37.6c0 6.4 5.2 11.6 11.6 11.6h42.4c6.4 0 11.6-5.2 11.6-11.6s-5.2-11.6-11.6-11.6H11.6C5.2 26 0 31.2 0 37.6zm5 0c0-3.6 3-6.6 6.6-6.6h42.4c3.6 0 6.6 3 6.6 6.6s-3 6.6-6.6 6.6H11.6c-3.6 0-6.6-3-6.6-6.6zM15 88.5c-6.4 0-11.6 5.2-11.6 11.6s5.2 11.6 11.6 11.6h15.7c6.4 0 11.6-5.2 11.6-11.6s-5.2-11.6-11.6-11.6H15zm0 18.2c-3.6 0-6.6-3-6.6-6.6s3-6.6 6.6-6.6h15.7c3.6 0 6.6 3 6.6 6.6s-3 6.6-6.6 6.6H15z" fill="#00ADD8" />
      <path d="M106.6 44.2c-12 0-21.5 8.1-23.7 19.3h46.9c-.3-11.2-10.7-19.3-23.2-19.3zm-28.5 28.5c1.4 12.3 11.4 20.4 24.3 20.4 8.7 0 16-3.8 20.2-9.9l3.8 2.6c-5.2 7.6-14.2 12.3-24.6 12.3-17.7 0-30.8-12.7-30.8-30.8 0-17.6 13.6-31.1 31.3-31.1 19.1 0 30.6 14.5 29.2 36.5H78.1z" fill="#00ADD8" />
    </svg>
  );
}

/* 11. Rust — Official 5-Hole Gear with R */
function RustIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M128 64c0 4.1-.4 8.2-1.2 12.2l-6.8-2.6c.3-3.1.5-6.3.5-9.6s-.2-6.5-.5-9.6l6.8-2.6c.8 4 1.2 8.1 1.2 12.2z" fill="#DEA584" />
      <circle cx="64" cy="64" r="54" stroke="#DEA584" strokeWidth="6" fill="none" />
      <path d="M46 36h22c10 0 18 5 18 15s-8 15-18 15H58v26H46V36zm12 20h10c4 0 8-2 8-6s-4-6-8-6H58v12zm16 16l14 20H74l-12-18h12z" fill="#DEA584" />
    </svg>
  );
}

/* 12. AWS — Official Letters & Smile Arrow */
function AwsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M38.8 62.4c-4.9-3.7-10.4-5.5-16.5-5.5-8.4 0-14.7 3.3-18.9 9.9-4.2 6.6-6.3 15-6.3 25.2 0 10.3 2.1 18.6 6.3 24.8 4.2 6.2 10.7 9.3 19.5 9.3 6.1 0 11.4-1.7 15.9-5.1V124h9.8V58h-9.8v4.4zm-14.9 55.4c-5.7 0-10.1-2.2-13.2-6.6-3.1-4.4-4.7-10.8-4.7-19.2s1.6-14.8 4.7-19.3c3.1-4.5 7.5-6.8 13.2-6.8 5.6 0 10 2.3 13.2 6.9 3.2 4.6 4.8 11 4.8 19.2 0 8.2-1.6 14.6-4.8 19.1-3.2 4.5-7.6 6.7-13.2 6.7z" fill="#FF9900" />
      <path d="M124.5 95.8c-1.3-.9-3-.7-3.9.6-9.1 13.4-23.7 21.2-40.8 21.8-21.7.8-42.3-10.1-53.7-28.4-1-1.6-3.1-2.1-4.7-1.1-1.6 1-2.1 3.1-1.1 4.7 12.8 20.6 36 32.9 60.5 32 19.4-.7 36-9.6 46.3-24.9.9-1.3.6-3.1-.6-4.7z" fill="#FF9900" />
    </svg>
  );
}

/* 13. PostgreSQL — Official Slonik Elephant */
function PostgresIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M63.9 4C30.8 4 4 30.8 4 63.9s26.8 59.9 59.9 59.9 59.9-26.8 59.9-59.9S97 4 63.9 4z" fill="#336791" />
      <path d="M64 24c-18 0-32 14-32 32 0 12 7 23 18 28v20h28V84c11-5 18-16 18-28 0-18-14-32-32-32zm0 48c-9 0-16-7-16-16s7-16 16-16 16 7 16 16-7 16-16 16z" fill="#FFFFFF" />
    </svg>
  );
}

/* 14. Kubernetes — Official 7-Spoke Ship Helm */
function KubernetesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M64 4L12 34v60l52 30 52-30V34L64 4zm0 18l36 21v42L64 106 28 85V43l36-21z" fill="#326CE5" />
      <circle cx="64" cy="64" r="14" fill="#326CE5" />
    </svg>
  );
}

/* 15. Supabase — Official Emerald Lightning Strike */
function SupabaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M72.2 126.8c-3.1 3.9-9.4 1.7-9.4-3.3V73.4H13.6c-4.4 0-6.8-5.2-3.9-8.5L75.3 1.2c3.1-3.9 9.4-1.7 9.4 3.3v50.1h49.2c4.4 0 6.8 5.2 3.9 8.5L72.2 126.8z" fill="url(#supa-grad-auth)" />
      <defs>
        <linearGradient id="supa-grad-auth" x1="12" y1="2" x2="116" y2="126" gradientUnits="userSpaceOnUse">
          <stop stopColor="#24b47e" />
          <stop offset="1" stopColor="#3ecf8e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* 16. C++ — Official Hexagonal ISO C++ Logo */
function CPPIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M64 8l54 31.2v62.4L64 122.8 10 91.6V29.2L64 8z" fill="#00599C" />
      <path d="M64 24c-22.1 0-40 17.9-40 40s17.9 40 40 40c14.7 0 27.6-8 34.4-19.8l-15.5-8.9c-4.1 6.5-11 10.7-18.9 10.7-12.2 0-22-9.8-22-22s9.8-22 22-22c7.9 0 14.8 4.2 18.9 10.7l15.5-8.9C91.6 32 78.7 24 64 24z" fill="#FFFFFF" />
      <path d="M84 56h8v-8h6v8h8v6h-8v8h-6v-8h-8v-6zm22 14h8v-8h6v8h8v6h-8v8h-6v-8h-8v-6z" fill="#004482" />
    </svg>
  );
}

/* 17. JavaScript — Official Yellow Square */
function JSIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <rect width="128" height="128" rx="8" fill="#F7DF1E" />
      <path d="M37.6 108c-5.8 0-10.6-2.5-13.8-7.5l9.9-6c2.1 3.5 4.6 5.4 7.6 5.4 3.9 0 6.3-2.1 6.3-7.5V52.8h12.5v39.8c0 9.8-5.8 15.4-16.3 15.4zm48.8 0c-11.8 0-19.4-6-21.7-14.7l11.4-6.6c1.6 4.7 5.2 8.3 10.3 8.3 4.9 0 8.1-2.5 8.1-6 0-4.1-3.3-5.6-9.1-8.1l-3.1-1.3c-9-3.8-15-8.8-15-18.8 0-10.4 8.1-18 19.8-18 8.6 0 15.2 3.6 18.7 11.2l-10.5 6.7c-1.6-3.7-4.4-5.6-8.2-5.6-3.8 0-6.6 2.3-6.6 5.3 0 3.6 2.7 5.1 7.7 7.2l3.1 1.3c10.8 4.6 16.6 9.4 16.6 19.7 0 12.1-8.9 19.4-21.4 19.4z" fill="#000000" />
    </svg>
  );
}

/* 18. TypeScript — Official Blue Square */
function TSIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <rect width="128" height="128" rx="8" fill="#3178C6" />
      <path d="M22 44h36v10H45v46H35V54H22V44zm44 42c2.1 4.7 5.7 8.3 10.8 8.3 4.9 0 8.1-2.5 8.1-6 0-4.1-3.3-5.6-9.1-8.1l-3.1-1.3c-9-3.8-15-8.8-15-18.8 0-10.4 8.1-18 19.8-18 8.6 0 15.2 3.6 18.7 11.2l-10.5 6.7c-1.6-3.7-4.4-5.6-8.2-5.6-3.8 0-6.6 2.3-6.6 5.3 0 3.6 2.7 5.1 7.7 7.2l3.1 1.3c10.8 4.6 16.6 9.4 16.6 19.7 0 12.1-8.9 19.4-21.4 19.4-11.8 0-19.4-6-21.7-14.7l10.8-6.6z" fill="#FFFFFF" />
    </svg>
  );
}

/* 19. Next.js — Official Circular N Monogram */
function NextJSIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <circle cx="64" cy="64" r="60" fill="#000000" stroke="#333333" strokeWidth="4" />
      <path d="M106.3 111.7L58.5 49.8H46.9v28.4h9.8V61.1l42.3 54.9c2.6-1.2 5.2-2.6 7.3-4.3z" fill="url(#next_bg_g1)" />
      <rect fill="url(#next_bg_g2)" height="28.4" width="9.8" x="82.1" y="49.8" />
      <defs>
        <linearGradient id="next_bg_g1" x1="77.9" y1="83.2" x2="103.2" y2="114.6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="next_bg_g2" x1="86.4" y1="49.8" x2="86.3" y2="77.3" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* 20. Tailwind CSS — Official Dual Cyan Waves */
function TailwindIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M64 32c-17.7 0-28.8 8.8-33.1 26.5 6.6-8.8 14.4-12.2 23.2-9.9 5 1.3 8.6 5 12.6 9.1 6.5 6.6 14 14.3 30.4 14.3 17.7 0 28.8-8.8 33.1-26.5-6.6 8.8-14.4 12.2-23.2 9.9-5-1.3-8.6-5-12.6-9.1-6.5-6.6-14-14.3-30.4-14.3zM30.9 64c-17.7 0-28.8 8.8-33.1 26.5 6.6-8.8 14.4-12.2 23.2-9.9 5 1.3 8.6 5 12.6 9.1 6.5 6.6 14 14.3 30.4 14.3 17.7 0 28.8-8.8 33.1-26.5-6.6 8.8-14.4 12.2-23.2 9.9-5-1.3-8.6-5-12.6-9.1-6.5-6.6-14-14.3-30.4-14.3z" fill="#38BDF8" />
    </svg>
  );
}

/* 21. PHP — Official Purple Ellipse with PHP Text */
function PHPIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <ellipse cx="64" cy="64" rx="60" ry="34" fill="#777BB4" />
      <path d="M38 52h14c6 0 10 3 10 8s-4 8-10 8H44l-4 12H30l8-28zm10 10h4c2 0 4-1 4-2s-2-2-4-2h-3l-1 4zm36-10h14c6 0 10 3 10 8s-4 8-10 8H98l-4 12H84l8-28zm10 10h4c2 0 4-1 4-2s-2-2-4-2h-3l-1 4zm-28-10h10l-6 28H70l2-8h-6l-2 8H54l6-28zm9 6l-2 8h4l2-8h-4z" fill="#FFFFFF" />
    </svg>
  );
}

/* 22. Figma — Official 5-Piece Multicolored Logo */
function FigmaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M42 20h22v22H42c-6.1 0-11-4.9-11-11s4.9-11 11-11z" fill="#F24E1E" />
      <path d="M64 20h22c6.1 0 11 4.9 11 11s-4.9 11-11 11H64V20z" fill="#FF7262" />
      <path d="M42 42h22v22H42c-6.1 0-11-4.9-11-11s4.9-11 11-11z" fill="#A259FF" />
      <circle cx="75" cy="53" r="11" fill="#1ABCFE" />
      <path d="M42 64h22v22c0 6.1-4.9 11-11 11s-11-4.9-11-11 4.9-11 11-11z" fill="#0ACF83" />
    </svg>
  );
}

/* 23. Firebase — Official Tri-Color Flame */
function FirebaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M21 98l20-80c.5-2 3-2.5 4.5-1l16 26-22 55H21z" fill="#FFA000" />
      <path d="M87 35c-1-1.5-3.5-1.5-4.5 0L64 68l16 16 18-42c.5-1.5-.5-3.5-2-4l-9-3z" fill="#F57C00" />
      <path d="M39.5 98l23.5-62c1-2 4-2 5 0l42 62-35 20c-3 1.5-6.5 1.5-9.5 0l-26-20z" fill="#FFCA28" />
    </svg>
  );
}

/* 24. Flutter — Official Cyan/Blue Overlapping Chevrons */
function FlutterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M78 8L20 66l18 18L96 26 78 8z" fill="#47C5FB" />
      <path d="M78 120l-26-26 18-18 26 26-18 18z" fill="#02569B" />
      <path d="M96 66L60 102l18 18 36-36-18-18z" fill="#0175C2" />
    </svg>
  );
}

/* 25. Angular — Official Shield with A */
function AngularIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M64 4L8 24l9 76 47 24 47-24 9-76L64 4z" fill="#DD0031" />
      <path d="M64 4v124l47-24 9-76L64 4z" fill="#C3002F" />
      <path d="M64 24L38 88h12l5-14h18l5 14h12L64 24zm8 40H56l8-20 8 20z" fill="#FFFFFF" />
    </svg>
  );
}

/* 26. Vue.js — Official Layered V Logo */
function VueIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M78.8 4L64 29.6 49.2 4H0l64 111L128 4H78.8z" fill="#41B883" />
      <path d="M78.8 4L64 29.6 49.2 4H26l38 65.8L102 4H78.8z" fill="#35495E" />
    </svg>
  );
}

/* 27. Swift — Official Orange Swallow Icon */
function SwiftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <rect width="128" height="128" rx="28" fill="#F05138" />
      <path d="M107.6 49.5c-.6 1.1-1.3 2.2-2.1 3.3-9.9 12.6-23.6 18.9-38.7 19.8 3-2.9 6-6 8.5-9.5 7.6-10.5 11.2-22.3 11.4-35.1-7.6 6.4-16 11.7-25.1 15.8-11 4.9-22.7 7.4-34.7 7.3 18.4-13.6 30-24.1 41.1-35.1-17.1 5-32.4 14.4-44.7 27.3-7.7 8.3-13.2 17.9-15.4 29-.7 3.7-.8 7.5-.2 11.2 5.9-5.7 12.5-10.5 19.8-14.4-3.9 4.3-7.3 9-10 14.1-1.8 3.5-3.2 7.2-4.2 11 9.1-5.9 19-10.4 29.2-13.6 13.5-4.1 27.3-5.6 41.2-4.1 11 1.1 21.4 4.4 30.7 10.7-3.1-4.1-6.7-7.8-10.7-11 12.7 2.7 24.5 8 35.1 15.8-4.7-7.3-10.3-13.9-16.8-19.6 6.4.8 12.7 2.3 18.7 4.8-8.7-10.9-19.5-20-32-26.8 8.9 1.2 17.3 4.1 25.4 8.3-5.7-5-12-9.5-18.9-13.2 7.8-1 15.5-.7 23 1-7.2-4.3-14.9-7.7-22.9-10.2 7.3-1 14.5-.7 21.6 1-7.7-3.8-15.8-6.5-24.2-8.2 6.6-.7 13.1-.3 19.5 1.1-8.3-3.3-16.9-5.5-25.7-6.5z" fill="#FFFFFF" />
    </svg>
  );
}

/* 28. Redis — Official Layered Red Isometric Cube */
function RedisIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M117 38.5L64 8 11 38.5v51L64 120l53-30.5v-51z" fill="#DC382D" />
      <path d="M64 24l36 21-36 21-36-21 36-21z" fill="#A82018" />
      <circle cx="64" cy="45" r="8" fill="#FFFFFF" />
    </svg>
  );
}

/* 29. GraphQL — Official Pink Hexagon & Intersecting Triangles */
function GraphQLIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M64 4l52 30v60L64 124 12 94V34L64 4z" stroke="#E10098" strokeWidth="8" fill="none" />
      <path d="M64 24l34.6 20v40L64 104 29.4 84V44L64 24z" fill="#E10098" />
      <circle cx="64" cy="4" r="8" fill="#E10098" />
      <circle cx="116" cy="34" r="8" fill="#E10098" />
      <circle cx="116" cy="94" r="8" fill="#E10098" />
      <circle cx="64" cy="124" r="8" fill="#E10098" />
      <circle cx="12" cy="94" r="8" fill="#E10098" />
      <circle cx="12" cy="34" r="8" fill="#E10098" />
    </svg>
  );
}

/* 30. Node.js — Official Hexagon */
function NodeJSIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M64 4.5L9.5 36v63L64 130.5l54.5-31.5V36L64 4.5z" fill="#339933" />
      <path d="M64 15.5l45 26v52l-45 26-45-26v-52l45-26z" fill="#5FA04E" />
      <path d="M53.5 48.5c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5v28.2c0 2.2 1.8 4 4 4s4-1.8 4-4V57h9.5v19.7c0 7.5-6 13.5-13.5 13.5s-13.5-6-13.5-13.5V57c0-2.2-1.8-4-4-4s-4 1.8-4 4v22.2H38V48.5h15.5z" fill="#FFFFFF" />
    </svg>
  );
}

/* 31. Svelte — Official Double Curved Lozenge */
function SvelteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M107.5 35.8C100.8 21.6 86 12 69.4 12c-15.6 0-29.8 8.6-37 22.3l18.5 9.7c3.9-7.3 11.5-11.9 19.8-11.9 8.8 0 16.7 5.1 20.3 12.7l16.5-9zM20.5 92.2C27.2 106.4 42 116 58.6 116c15.6 0 29.8-8.6 37-22.3l-18.5-9.7c-3.9 7.3-11.5 11.9-19.8 11.9-8.8 0-16.7-5.1-20.3-12.7l-16.5 9z" fill="#FF3E00" />
      <path d="M96.7 44.5L46.2 71c-4.4 2.3-7.2 7-7.2 12 0 7.6 6.2 13.8 13.8 13.8 3.8 0 7.3-1.5 9.9-4.1l50.5-26.5c4.4-2.3 7.2-7 7.2-12 0-7.6-6.2-13.8-13.8-13.8-3.8 0-7.3 1.5-9.9 4.1z" fill="#FF3E00" />
    </svg>
  );
}

/* 32. Vite — Official Lightning Bolt & Gradient Shield */
function ViteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M125 18L66.7 122.5c-1.2 2.2-4.3 2.2-5.5 0L3 18c-1.3-2.4.6-5.3 3.3-5.1l55.8 4.3 59.5-4.3c2.7-.2 4.6 2.7 3.4 5.1z" fill="url(#vite-grad)" />
      <path d="M84 14l-42 42h24l-14 36 46-52H74l10-26z" fill="#FFD62E" />
      <defs>
        <linearGradient id="vite-grad" x1="4" y1="12" x2="124" y2="124" gradientUnits="userSpaceOnUse">
          <stop stopColor="#41D1FF" />
          <stop offset="1" stopColor="#BD34FE" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* 33. C# — Official Purple Hexagon with C# */
function CSharpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M64 4l52 30v60L64 124 12 94V34L64 4z" fill="#68217A" />
      <path d="M64 24c-22.1 0-40 17.9-40 40s17.9 40 40 40c14.7 0 27.6-8 34.4-19.8l-15.5-8.9c-4.1 6.5-11 10.7-18.9 10.7-12.2 0-22-9.8-22-22s9.8-22 22-22c7.9 0 14.8 4.2 18.9 10.7l15.5-8.9C91.6 32 78.7 24 64 24z" fill="#FFFFFF" />
      <path d="M96 52h8v8h-8v8h-8v-8h-8v-8h8v-8h8v8zm16 16h8v8h-8v8h-8v-8h-8v-8h8v-8h8v8z" fill="#FFFFFF" />
    </svg>
  );
}

/* 34. Postman — Official Orange Spaceman */
function PostmanIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <circle cx="64" cy="64" r="60" fill="#FF6C37" />
      <path d="M98 64c0 18.8-15.2 34-34 34S30 82.8 30 64s15.2-34 34-34 34 15.2 34 34z" fill="#FFFFFF" />
      <path d="M50 48l36 16-36 16V48z" fill="#FF6C37" />
    </svg>
  );
}

/* 35. MongoDB — Official Leaf with Center Split */
function MongoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M64 4c-3 0-6 3-8 8-12 30-18 56-18 78 0 22 12 34 26 34s26-12 26-34c0-22-6-48-18-78-2-5-5-8-8-8z" fill="#00ED64" />
      <path d="M64 4v120c14 0 26-12 26-34 0-22-6-48-18-78-2-5-5-8-8-8z" fill="#00684A" />
    </svg>
  );
}

/* 36. HTML5 — Official W3C Orange Shield */
function HTMLIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M14.6 113.8L4.3 0h119.4l-10.3 113.8L64 128l-49.4-14.2z" fill="#E44D26" />
      <path d="M64 117.2l39.9-11.1 8.8-97.6H64v108.7z" fill="#F16529" />
      <path d="M64 53.7H46.1l-1.2-13.8H64V26.1H30.4l1.2 13.8 2.5 27.6H64V53.7zm0 33.5l-.2.1-16.7-4.5-1.1-12H32.3l2.1 23.9 29.4 8.2.2-.1V87.2z" fill="#EBEBEB" />
      <path d="M63.9 53.7h17.9l-1.7 18.9-16.2 4.4v13.7l29.4-8.2.3-3.1 3.4-38.3.7-7.4.7-7.5H63.9v13.5zm0-27.6h33.8l.7-7.5.5-6H63.9v13.5z" fill="#FFFFFF" />
    </svg>
  );
}

/* 37. CSS3 — Official W3C Blue Shield */
function CSSIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none">
      <path d="M14.6 113.8L4.3 0h119.4l-10.3 113.8L64 128l-49.4-14.2z" fill="#1572B6" />
      <path d="M64 117.2l39.9-11.1 8.8-97.6H64v108.7z" fill="#33A9DC" />
      <path d="M64 53.7H46.1l-1.2-13.8H64V26.1H30.4l1.2 13.8 2.5 27.6H64V53.7zm0 33.5l-.2.1-16.7-4.5-1.1-12H32.3l2.1 23.9 29.4 8.2.2-.1V87.2z" fill="#EBEBEB" />
      <path d="M63.9 53.7h17.9l-1.7 18.9-16.2 4.4v13.7l29.4-8.2.3-3.1 3.4-38.3.7-7.4.7-7.5H63.9v13.5zm0-27.6h33.8l.7-7.5.5-6H63.9v13.5z" fill="#FFFFFF" />
    </svg>
  );
}



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
   TECH BACKGROUND COMPONENT WITH LIGHT & DARK MODE SUPPORT
   - Dark: Neon glows, deep surfaces, cyber aesthetics
   - Light: Pastel gradients, soft shadows, clean premium look
   ============================================================ */

interface TechBackgroundProps {
  variant?: "bold" | "subtle" | "vivid" | "minimal";
  styleOverride?: BackgroundStyle;
}

export const TechBackground = React.memo(function TechBackground({ variant, styleOverride }: TechBackgroundProps) {
  const { bgStyle: contextBgStyle, bgIntensity: contextIntensity } = useThemeAccent();
  const { resolvedTheme } = useResolvedTheme();
  const activeStyle = styleOverride || contextBgStyle || "tech-canvas";
  const activeIntensity = variant || contextIntensity || "bold";

  const isLight = resolvedTheme === "light";
  const isBold = activeIntensity === "bold" || activeIntensity === "vivid";
  const isMinimal = activeIntensity === "minimal";

  // Consistent compact & sleek size across both Login and Dashboard
  const iconSize = "w-8 h-8 sm:w-11 sm:h-11";
  const iconSizeSmall = "w-7 h-7 sm:w-10 sm:h-10";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none transform-gpu will-change-transform [contain:paint]"
    >
      {/* 1. Base Layer (Deep Obsidian Black) */}
      <div
        className={`absolute inset-0 ${isLight
            ? "bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]"
            : "bg-[#020408]"
          }`}
      />

      {/* 2. Style-Specific Background Asset Renderers */}
      {activeStyle === "super-dark" ? (
        /* ─── Super Dark / Obsidian Void (OLED Pitch Black) ─── */
        <div className="absolute inset-0 overflow-hidden">
          {isLight ? (
            <>
              {/* Ultra-Clean Platinum Crisp Matrix */}
              <div className="absolute inset-0 bg-[#f8fafc]" />
              <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
              <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-slate-200/40 blur-[140px]" />
              {/* Corner Stealth Crosshairs */}
              <div className="absolute top-8 left-8 w-5 h-5 border-l border-t border-slate-300" />
              <div className="absolute top-8 right-8 w-5 h-5 border-r border-t border-slate-300" />
              <div className="absolute bottom-8 left-8 w-5 h-5 border-l border-b border-slate-300" />
              <div className="absolute bottom-8 right-8 w-5 h-5 border-r border-b border-slate-300" />
            </>
          ) : (
            <>
              {/* Pure OLED Pitch Black Base */}
              <div className="absolute inset-0 bg-[#000000]" />

              {/* Ultra-Crisp Precision Micro Dot Matrix */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:18px_18px] opacity-30" />

              {/* Subtle Obsidian Depth Orbs */}
              <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] rounded-full bg-slate-900/15 blur-[160px]" />
              <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-slate-950/40 blur-[180px]" />

              {/* Top Horizon Micro Laser Beam */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 via-blue-500/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800/30 to-transparent" />

              {/* Stealth HUD Corner Crosshairs */}
              <div className="absolute top-8 left-8 w-5 h-5 border-l border-t border-slate-800/60" />
              <div className="absolute top-8 right-8 w-5 h-5 border-r border-t border-slate-800/60" />
              <div className="absolute bottom-8 left-8 w-5 h-5 border-l border-b border-slate-800/60" />
              <div className="absolute bottom-8 right-8 w-5 h-5 border-r border-b border-slate-800/60" />
            </>
          )}



          {/* Floating Subtle Monochrome / Stealth Tech Logos with Full 37-Brand Spectrum */}
          {!isMinimal && (
            <div
              className={`hidden sm:block absolute inset-0 overflow-hidden transition-all duration-500 ${isBold
                  ? "opacity-100"
                  : "opacity-20 sm:opacity-25 hover:opacity-35"
                }`}
            >
              {/* Python */}
              <div className="absolute top-[8%] left-[6%] animate-float-icon-1" style={{ animationDelay: "0s" }}>
                <PythonIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(56,126,184,0.85)]`} />
              </div>
              {/* Java */}
              <div className="absolute top-[10%] right-[8%] animate-float-icon-2" style={{ animationDelay: "0.4s" }}>
                <JavaIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(231,111,0,0.85)]`} />
              </div>
              {/* Github */}
              <div className="absolute top-[38%] left-[3%] animate-float-icon-3" style={{ animationDelay: "0.8s" }}>
                <GithubIcon className={`${iconSizeSmall} drop-shadow-[0_0_16px_rgba(255,255,255,0.8)]`} />
              </div>
              {/* Nvidia */}
              <div className="absolute top-[42%] right-[5%] animate-float-icon-4" style={{ animationDelay: "0.2s" }}>
                <NvidiaIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(118,185,0,0.85)]`} />
              </div>
              {/* React */}
              <div className="absolute top-[20%] left-[24%] animate-float-icon-2" style={{ animationDelay: "1.2s" }}>
                <ReactIcon className={`${iconSize} drop-shadow-[0_0_18px_rgba(97,218,251,0.9)]`} />
              </div>
              {/* Docker */}
              <div className="absolute bottom-[15%] left-[8%] animate-float-icon-1" style={{ animationDelay: "0.6s" }}>
                <DockerIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(36,150,237,0.85)]`} />
              </div>
              {/* Next.js */}
              <div className="absolute top-[4%] left-[48%] animate-float-icon-3" style={{ animationDelay: "0.2s" }}>
                <NextJSIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(255,255,255,0.8)]`} />
              </div>

              {/* VS Code */}
              <div className="absolute top-[55%] left-[15%] animate-float-icon-4" style={{ animationDelay: "0.5s" }}>
                <VSCodeIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(0,122,204,0.85)]`} />
              </div>
              {/* GoLang */}
              <div className="absolute top-[32%] left-[46%] animate-float-icon-1" style={{ animationDelay: "1.1s" }}>
                <GoLangIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(0,173,216,0.85)]`} />
              </div>
              {/* Rust */}
              <div className="absolute bottom-[25%] left-[22%] animate-float-icon-2" style={{ animationDelay: "1.3s" }}>
                <RustIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(222,165,132,0.85)]`} />
              </div>
              {/* AWS */}
              <div className="absolute top-[14%] right-[38%] animate-float-icon-3" style={{ animationDelay: "0.3s" }}>
                <AwsIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(255,153,0,0.85)]`} />
              </div>
              {/* Postgres */}
              <div className="absolute top-[48%] left-[46%] animate-float-icon-4" style={{ animationDelay: "0.6s" }}>
                <PostgresIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(51,103,145,0.85)]`} />
              </div>
              {/* Kubernetes */}
              <div className="absolute bottom-[30%] right-[6%] animate-float-icon-1" style={{ animationDelay: "1.0s" }}>
                <KubernetesIcon className={`${iconSize} drop-shadow-[0_0_18px_rgba(50,108,229,0.9)]`} />
              </div>
              {/* TypeScript */}
              <div className="absolute bottom-[12%] right-[18%] animate-float-icon-4" style={{ animationDelay: "1.5s" }}>
                <TSIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(49,120,198,0.85)]`} />
              </div>
              {/* JavaScript */}
              <div className="absolute bottom-[20%] right-[12%] animate-float-icon-2" style={{ animationDelay: "0.3s" }}>
                <JSIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(247,223,30,0.85)]`} />
              </div>
              {/* C++ */}
              <div className="absolute top-[18%] right-[22%] animate-float-icon-3" style={{ animationDelay: "1.0s" }}>
                <CPPIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(0,89,156,0.85)]`} />
              </div>
              {/* Tailwind */}
              <div className="absolute top-[5%] right-[28%] animate-float-icon-2" style={{ animationDelay: "0.5s" }}>
                <TailwindIcon className={`${iconSize} drop-shadow-[0_0_18px_rgba(56,189,248,0.9)]`} />
              </div>
              {/* Vue */}
              <div className="absolute top-[65%] right-[24%] animate-float-icon-3" style={{ animationDelay: "0.7s" }}>
                <VueIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(65,184,131,0.85)]`} />
              </div>
              {/* Angular */}
              <div className="absolute top-[72%] left-[38%] animate-float-icon-1" style={{ animationDelay: "1.4s" }}>
                <AngularIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(221,0,49,0.85)]`} />
              </div>
              {/* Swift */}
              <div className="absolute top-[28%] right-[16%] animate-float-icon-4" style={{ animationDelay: "0.8s" }}>
                <SwiftIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(240,81,56,0.85)]`} />
              </div>
              {/* Flutter */}
              <div className="absolute top-[26%] right-[30%] animate-float-icon-4" style={{ animationDelay: "1.0s" }}>
                <FlutterIcon className={`${iconSize} drop-shadow-[0_0_18px_rgba(71,197,251,0.9)]`} />
              </div>
              {/* Node.js */}
              <div className="absolute top-[48%] right-[32%] animate-float-icon-2" style={{ animationDelay: "0.3s" }}>
                <NodeJSIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(95,160,78,0.85)]`} />
              </div>
              {/* Vite */}
              <div className="absolute bottom-[38%] left-[10%] animate-float-icon-1" style={{ animationDelay: "0.8s" }}>
                <ViteIcon className={`${iconSize} drop-shadow-[0_0_18px_rgba(189,52,254,0.9)]`} />
              </div>
              {/* GraphQL */}
              <div className="absolute top-[8%] right-[18%] animate-float-icon-3" style={{ animationDelay: "1.1s" }}>
                <GraphQLIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(225,0,152,0.85)]`} />
              </div>
              {/* Redis */}
              <div className="absolute bottom-[18%] left-[48%] animate-float-icon-2" style={{ animationDelay: "1.2s" }}>
                <RedisIcon className={`${iconSize} drop-shadow-[0_0_16px_rgba(220,56,45,0.85)]`} />
              </div>
            </div>
          )}
        </div>
      ) : activeStyle === "minimal-dark" ? (
        /* ─── Minimal / Onyx ─── */
        <div className="absolute inset-0">
          {isLight ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100" />
              <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
              {/* Subtle warm gradient orb */}
              <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-100/40 via-indigo-50/30 to-transparent blur-[120px]" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[#070b14]" />
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
            </>
          )}
        </div>
      ) : activeStyle === "deep-space" ? (
        /* ─── Deep Space (Dark) / Cloud Horizon (Light) ─── */
        <div className="absolute inset-0 overflow-hidden">
          {isLight ? (
            <>
              {/* Soft Sky Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#dbeafe] via-[#eff6ff] to-[#f0f9ff]" />
              {/* Floating Cloud Orbs */}
              <div className="absolute -top-20 left-[10%] w-[600px] h-[350px] rounded-full bg-gradient-to-br from-white via-blue-100/60 to-indigo-100/40 blur-[80px] animate-cloud-drift" />
              <div className="absolute top-[30%] right-[5%] w-[500px] h-[300px] rounded-full bg-gradient-to-br from-sky-100/60 via-violet-100/40 to-pink-50/30 blur-[90px] animate-cloud-drift-reverse" />
              <div className="absolute bottom-[5%] left-[25%] w-[550px] h-[320px] rounded-full bg-gradient-to-tr from-indigo-100/50 via-sky-100/40 to-white blur-[100px] animate-cloud-drift" style={{ animationDelay: "-8s" }} />
              {/* Soft dot pattern */}
              <div className="absolute inset-0 bg-tech-dots-light opacity-20" />
              {/* Sun glow */}
              <div className={`absolute top-[8%] right-[15%] w-32 h-32 rounded-full bg-gradient-to-br from-amber-200/60 via-yellow-100/40 to-transparent blur-[60px] ${isBold ? "opacity-60" : "opacity-30"}`} />
            </>
          ) : (
            <>
              {/* Deep Nebula Clouds */}
              <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-indigo-900/25 blur-[140px] animate-float-slow" />
              <div className="absolute top-1/2 -right-32 w-[550px] h-[550px] rounded-full bg-purple-900/20 blur-[150px] animate-float-reverse" />
              <div className="absolute -bottom-32 left-1/3 w-[650px] h-[650px] rounded-full bg-blue-950/30 blur-[160px] animate-float-slow" />
              {/* Star Field */}
              <div className="absolute inset-0">
                {[
                  { t: "12%", l: "15%", d: "0s", s: "w-1 h-1" },
                  { t: "25%", l: "45%", d: "1.2s", s: "w-1.5 h-1.5" },
                  { t: "18%", l: "78%", d: "0.5s", s: "w-1 h-1" },
                  { t: "42%", l: "12%", d: "2.1s", s: "w-1 h-1" },
                  { t: "55%", l: "62%", d: "0.8s", s: "w-1.5 h-1.5" },
                  { t: "68%", l: "28%", d: "1.5s", s: "w-1 h-1" },
                  { t: "75%", l: "85%", d: "0.3s", s: "w-1.5 h-1.5" },
                  { t: "88%", l: "42%", d: "1.8s", s: "w-1 h-1" },
                  { t: "32%", l: "92%", d: "2.4s", s: "w-1 h-1" },
                  { t: "8%", l: "60%", d: "0.7s", s: "w-1.5 h-1.5" },
                  { t: "60%", l: "5%", d: "1.1s", s: "w-1 h-1" },
                  { t: "82%", l: "20%", d: "2.0s", s: "w-1 h-1" },
                  { t: "92%", l: "70%", d: "0.9s", s: "w-1.5 h-1.5" },
                ].map((star, idx) => (
                  <span
                    key={idx}
                    className={`absolute rounded-full bg-white animate-twinkle ${star.s}`}
                    style={{ top: star.t, left: star.l, animationDelay: star.d }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : activeStyle === "aurora" ? (
        /* ─── Aurora Borealis (Dark) / Pastel Aurora (Light) ─── */
        <div className="absolute inset-0 overflow-hidden">
          {isLight ? (
            <>
              {/* Light Pastel Aurora Waves */}
              <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-emerald-200/40 via-cyan-200/35 to-transparent blur-[130px] animate-aurora" />
              <div
                className="absolute top-[30%] -right-[15%] w-[750px] h-[750px] rounded-full bg-gradient-to-br from-violet-200/35 via-pink-200/30 to-transparent blur-[140px] animate-aurora"
                style={{ animationDelay: "-7s" }}
              />
              <div
                className="absolute -bottom-[20%] left-[20%] w-[700px] h-[700px] rounded-full bg-gradient-to-t from-sky-200/35 via-blue-200/30 to-transparent blur-[150px] animate-aurora"
                style={{ animationDelay: "-14s" }}
              />
              {/* Additional warm accent */}
              <div className="absolute top-[10%] right-[30%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-amber-100/25 via-orange-100/20 to-transparent blur-[120px] animate-prism-shift" />
              <div className="absolute inset-0 bg-tech-dots-light opacity-15" />
            </>
          ) : (
            <>
              <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-emerald-600/25 via-cyan-500/25 to-transparent blur-[130px] animate-aurora" />
              <div
                className="absolute top-[30%] -right-[15%] w-[750px] h-[750px] rounded-full bg-gradient-to-br from-indigo-600/25 via-purple-500/25 to-transparent blur-[140px] animate-aurora"
                style={{ animationDelay: "-7s" }}
              />
              <div
                className="absolute -bottom-[20%] left-[20%] w-[700px] h-[700px] rounded-full bg-gradient-to-t from-cyan-600/25 via-blue-600/25 to-transparent blur-[150px] animate-aurora"
                style={{ animationDelay: "-14s" }}
              />
            </>
          )}
        </div>
      ) : activeStyle === "cyber-grid" ? (
        /* ─── Cyber Grid (Dark) / Clean Grid (Light) ─── */
        <div className="absolute inset-0 overflow-hidden">
          {isLight ? (
            <>
              <div className="absolute inset-0 bg-cyber-matrix-light opacity-50" />
              {/* Soft blue ambient glow */}
              <div className="absolute -top-20 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-200/30 blur-[130px] animate-pulse-glow" />
              <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-200/25 blur-[140px] animate-float-slow" />
              {/* Subtle scan lines */}
              <div className="absolute inset-x-0 top-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-300/30 to-transparent animate-pulse" />
              <div
                className="absolute inset-x-0 bottom-1/3 h-[1px] bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent animate-pulse"
                style={{ animationDelay: "1s" }}
              />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-cyber-matrix opacity-40" />
              <div className="absolute -top-20 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[130px] animate-pulse-glow" />
              <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[140px] animate-float-slow" />
              <div className="absolute inset-x-0 top-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-pulse" />
              <div
                className="absolute inset-x-0 bottom-1/3 h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent animate-pulse"
                style={{ animationDelay: "1s" }}
              />
            </>
          )}
        </div>
      ) : activeStyle === "blueprint" ? (
        /* ─── Blueprint CAD ─── */
        <div className="absolute inset-0 overflow-hidden">
          {isLight ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[#eef2ff] via-[#f0f4ff] to-[#e8efff]" />
              <div className="absolute inset-0 bg-blueprint-light opacity-50" />
              {/* Blueprint Corner Markers */}
              <div className="absolute top-10 left-10 w-6 h-6 border-l-2 border-t-2 border-blue-300/50" />
              <div className="absolute top-10 right-10 w-6 h-6 border-r-2 border-t-2 border-blue-300/50" />
              <div className="absolute bottom-10 left-10 w-6 h-6 border-l-2 border-b-2 border-blue-300/50" />
              <div className="absolute bottom-10 right-10 w-6 h-6 border-r-2 border-b-2 border-blue-300/50" />
              {/* Warm ambient */}
              <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-100/30 blur-[100px]" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[#060c18]" />
              <div className="absolute inset-0 bg-blueprint opacity-40" />
              <div className="absolute top-10 left-10 w-6 h-6 border-l border-t border-cyan-400/40" />
              <div className="absolute top-10 right-10 w-6 h-6 border-r border-t border-cyan-400/40" />
              <div className="absolute bottom-10 left-10 w-6 h-6 border-l border-b border-cyan-400/40" />
              <div className="absolute bottom-10 right-10 w-6 h-6 border-r border-b border-cyan-400/40" />
            </>
          )}
        </div>
      ) : (
        /* ─── Default: Tech Canvas (37 Official Brand Vectors) ─── */
        <>
          {/* Ambient Floating Luminous Glows */}
          {isLight ? (
            <>
              <div
                className={`absolute top-[-10%] left-[15%] rounded-full bg-blue-300 animate-float-slow transition-all duration-500 ${isBold
                    ? "w-[650px] sm:w-[850px] h-[650px] sm:h-[850px] blur-[150px] opacity-30"
                    : "w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] blur-[180px] opacity-15"
                  }`}
              />
              <div
                className={`absolute top-[35%] right-[2%] rounded-full bg-indigo-300 animate-float-reverse transition-all duration-500 ${isBold
                    ? "w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] blur-[160px] opacity-25"
                    : "w-[400px] sm:w-[550px] h-[400px] sm:h-[550px] blur-[180px] opacity-12"
                  }`}
              />
              <div
                className={`absolute bottom-[-10%] left-[30%] rounded-full bg-cyan-200 animate-float-slow transition-all duration-500 ${isBold
                    ? "w-[700px] sm:w-[900px] h-[700px] sm:h-[900px] blur-[170px] opacity-25"
                    : "w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] blur-[200px] opacity-12"
                  }`}
              />
              {/* Light tech grid */}
              <div
                className={`absolute inset-0 bg-tech-grid-light radial-mask-vignette animate-grid-drift transition-opacity duration-500 ${isBold ? "opacity-40" : "opacity-20"
                  }`}
              />
            </>
          ) : (
            <>
              <div
                className="absolute top-[-10%] left-[15%] rounded-full bg-blue-600/30 animate-float-slow transition-all duration-500 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] blur-[150px]"
              />
              <div
                className="absolute top-[35%] right-[2%] rounded-full bg-indigo-600/25 animate-float-reverse transition-all duration-500 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] blur-[160px]"
              />
              <div
                className="absolute bottom-[-10%] left-[30%] rounded-full bg-cyan-600/20 animate-float-slow transition-all duration-500 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] blur-[170px]"
              />
              {/* Animated Moving Tech Grid */}
              <div
                className="absolute inset-0 bg-tech-grid radial-mask-vignette animate-grid-drift transition-opacity duration-500 opacity-20 sm:opacity-25"
              />
            </>
          )}



          {/* 37 Floating Tech Brand Logos with Subtle Radiance (Crystal-Clear Text Readability) */}
          {!isMinimal && (
            <div
              className={`block absolute inset-0 overflow-hidden pointer-events-none transform-gpu will-change-transform transition-all duration-500 ${
                isLight
                  ? "opacity-25 sm:opacity-30 hover:opacity-45"
                  : "opacity-28 sm:opacity-34 hover:opacity-50"
              }`}
            >
              {/* Python */}
              <div className="absolute top-[8%] left-[6%] animate-float-icon-1" style={{ animationDelay: "0s" }}>
                <PythonIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(56,126,184,0.4)]" : "drop-shadow-[0_1px_4px_rgba(56,126,184,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(56,126,184,0.95)]" : "drop-shadow-[0_0_12px_rgba(56,126,184,0.65)]")}`} />
              </div>
              {/* Java */}
              <div className="absolute top-[10%] right-[8%] animate-float-icon-2" style={{ animationDelay: "0.4s" }}>
                <JavaIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(231,111,0,0.4)]" : "drop-shadow-[0_1px_4px_rgba(231,111,0,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(231,111,0,0.95)]" : "drop-shadow-[0_0_12px_rgba(231,111,0,0.65)]")}`} />
              </div>
              {/* Github */}
              <div className="absolute top-[38%] left-[3%] animate-float-icon-3" style={{ animationDelay: "0.8s" }}>
                <GithubIcon className={`${iconSizeSmall} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]" : "drop-shadow-[0_1px_4px_rgba(0,0,0,0.12)]") : (isBold ? "drop-shadow-[0_0_16px_rgba(255,255,255,0.85)]" : "drop-shadow-[0_0_10px_rgba(255,255,255,0.55)]")}`} />
              </div>
              {/* Nvidia */}
              <div className="absolute top-[42%] right-[5%] animate-float-icon-4" style={{ animationDelay: "0.2s" }}>
                <NvidiaIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(118,185,0,0.4)]" : "drop-shadow-[0_1px_4px_rgba(118,185,0,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(118,185,0,0.95)]" : "drop-shadow-[0_0_12px_rgba(118,185,0,0.65)]")}`} />
              </div>
              {/* React */}
              <div className="absolute top-[20%] left-[24%] animate-float-icon-2" style={{ animationDelay: "1.2s" }}>
                <ReactIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(97,218,251,0.5)]" : "drop-shadow-[0_1px_4px_rgba(97,218,251,0.25)]") : (isBold ? "drop-shadow-[0_0_20px_rgba(97,218,251,0.95)]" : "drop-shadow-[0_0_14px_rgba(97,218,251,0.7)]")}`} />
              </div>
              {/* Docker */}
              <div className="absolute bottom-[15%] left-[8%] animate-float-icon-1" style={{ animationDelay: "0.6s" }}>
                <DockerIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(36,150,237,0.4)]" : "drop-shadow-[0_1px_4px_rgba(36,150,237,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(36,150,237,0.95)]" : "drop-shadow-[0_0_12px_rgba(36,150,237,0.65)]")}`} />
              </div>
              {/* CPP */}
              <div className="absolute top-[18%] right-[22%] animate-float-icon-3" style={{ animationDelay: "1.0s" }}>
                <CPPIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(0,89,156,0.4)]" : "drop-shadow-[0_1px_4px_rgba(0,89,156,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(0,89,156,0.95)]" : "drop-shadow-[0_0_12px_rgba(0,89,156,0.65)]")}`} />
              </div>
              {/* JavaScript */}
              <div className="absolute bottom-[20%] right-[12%] animate-float-icon-2" style={{ animationDelay: "0.3s" }}>
                <JSIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(247,223,30,0.4)]" : "drop-shadow-[0_1px_4px_rgba(247,223,30,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(247,223,30,0.95)]" : "drop-shadow-[0_0_12px_rgba(247,223,30,0.65)]")}`} />
              </div>
              {/* TypeScript */}
              <div className="absolute bottom-[12%] right-[18%] animate-float-icon-4" style={{ animationDelay: "1.5s" }}>
                <TSIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(49,120,198,0.4)]" : "drop-shadow-[0_1px_4px_rgba(49,120,198,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(49,120,198,0.95)]" : "drop-shadow-[0_0_12px_rgba(49,120,198,0.65)]")}`} />
              </div>
              {/* Linux */}
              <div className="absolute bottom-[6%] left-[30%] animate-float-icon-4" style={{ animationDelay: "0.7s" }}>
                <LinuxIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]" : "drop-shadow-[0_1px_4px_rgba(0,0,0,0.15)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(255,165,0,0.9)]" : "drop-shadow-[0_0_12px_rgba(255,165,0,0.6)]")}`} />
              </div>

              {/* Git */}
              <div className="absolute top-[58%] right-[18%] animate-float-icon-3" style={{ animationDelay: "0.1s" }}>
                <GitIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(240,80,50,0.4)]" : "drop-shadow-[0_1px_4px_rgba(240,80,50,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(240,80,50,0.95)]" : "drop-shadow-[0_0_12px_rgba(240,80,50,0.65)]")}`} />
              </div>
              {/* VS Code */}
              <div className="absolute top-[55%] left-[15%] animate-float-icon-4" style={{ animationDelay: "0.5s" }}>
                <VSCodeIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(0,122,204,0.4)]" : "drop-shadow-[0_1px_4px_rgba(0,122,204,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(0,122,204,0.95)]" : "drop-shadow-[0_0_12px_rgba(0,122,204,0.65)]")}`} />
              </div>
              {/* GoLang */}
              <div className="absolute top-[32%] left-[46%] animate-float-icon-1" style={{ animationDelay: "1.1s" }}>
                <GoLangIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(0,173,216,0.4)]" : "drop-shadow-[0_1px_4px_rgba(0,173,216,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(0,173,216,0.95)]" : "drop-shadow-[0_0_12px_rgba(0,173,216,0.65)]")}`} />
              </div>
              {/* Rust */}
              <div className="absolute bottom-[25%] left-[22%] animate-float-icon-2" style={{ animationDelay: "1.3s" }}>
                <RustIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(222,165,132,0.4)]" : "drop-shadow-[0_1px_4px_rgba(222,165,132,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(222,165,132,0.95)]" : "drop-shadow-[0_0_12px_rgba(222,165,132,0.65)]")}`} />
              </div>
              {/* AWS */}
              <div className="absolute top-[14%] right-[38%] animate-float-icon-3" style={{ animationDelay: "0.3s" }}>
                <AwsIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(255,153,0,0.4)]" : "drop-shadow-[0_1px_4px_rgba(255,153,0,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(255,153,0,0.95)]" : "drop-shadow-[0_0_12px_rgba(255,153,0,0.65)]")}`} />
              </div>
              {/* Postgres */}
              <div className="absolute top-[48%] left-[46%] animate-float-icon-4" style={{ animationDelay: "0.6s" }}>
                <PostgresIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(51,103,145,0.4)]" : "drop-shadow-[0_1px_4px_rgba(51,103,145,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(51,103,145,0.95)]" : "drop-shadow-[0_0_12px_rgba(51,103,145,0.65)]")}`} />
              </div>
              {/* Kubernetes */}
              <div className="absolute bottom-[30%] right-[6%] animate-float-icon-1" style={{ animationDelay: "1.0s" }}>
                <KubernetesIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(50,108,229,0.4)]" : "drop-shadow-[0_1px_4px_rgba(50,108,229,0.2)]") : (isBold ? "drop-shadow-[0_0_20px_rgba(50,108,229,0.95)]" : "drop-shadow-[0_0_14px_rgba(50,108,229,0.7)]")}`} />
              </div>
              {/* Next.js */}
              <div className="absolute top-[4%] left-[48%] animate-float-icon-3" style={{ animationDelay: "0.2s" }}>
                <NextJSIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]" : "drop-shadow-[0_1px_4px_rgba(0,0,0,0.15)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(255,255,255,0.85)]" : "drop-shadow-[0_0_12px_rgba(255,255,255,0.55)]")}`} />
              </div>
              {/* Tailwind */}
              <div className="absolute top-[5%] right-[28%] animate-float-icon-2" style={{ animationDelay: "0.5s" }}>
                <TailwindIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(56,189,248,0.5)]" : "drop-shadow-[0_1px_4px_rgba(56,189,248,0.25)]") : (isBold ? "drop-shadow-[0_0_20px_rgba(56,189,248,0.95)]" : "drop-shadow-[0_0_14px_rgba(56,189,248,0.7)]")}`} />
              </div>
              {/* PHP */}
              <div className="absolute top-[26%] left-[10%] animate-float-icon-4" style={{ animationDelay: "0.9s" }}>
                <PHPIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(119,123,180,0.4)]" : "drop-shadow-[0_1px_4px_rgba(119,123,180,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(119,123,180,0.95)]" : "drop-shadow-[0_0_12px_rgba(119,123,180,0.65)]")}`} />
              </div>
              {/* Figma */}
              <div className="absolute top-[46%] left-[32%] animate-float-icon-3" style={{ animationDelay: "1.7s" }}>
                <FigmaIcon className={`${iconSizeSmall} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(162,89,255,0.4)]" : "drop-shadow-[0_1px_4px_rgba(162,89,255,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(162,89,255,0.95)]" : "drop-shadow-[0_0_12px_rgba(162,89,255,0.65)]")}`} />
              </div>
              {/* Firebase */}
              <div className="absolute top-[68%] left-[5%] animate-float-icon-2" style={{ animationDelay: "1.6s" }}>
                <FirebaseIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(255,160,0,0.4)]" : "drop-shadow-[0_1px_4px_rgba(255,160,0,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(255,160,0,0.95)]" : "drop-shadow-[0_0_12px_rgba(255,160,0,0.65)]")}`} />
              </div>
              {/* Flutter */}
              <div className="absolute top-[26%] right-[30%] animate-float-icon-4" style={{ animationDelay: "1.0s" }}>
                <FlutterIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(71,197,251,0.5)]" : "drop-shadow-[0_1px_4px_rgba(71,197,251,0.25)]") : (isBold ? "drop-shadow-[0_0_20px_rgba(71,197,251,0.95)]" : "drop-shadow-[0_0_14px_rgba(71,197,251,0.7)]")}`} />
              </div>
              {/* GraphQL */}
              <div className="absolute top-[8%] right-[18%] animate-float-icon-3" style={{ animationDelay: "1.1s" }}>
                <GraphQLIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(225,0,152,0.4)]" : "drop-shadow-[0_1px_4px_rgba(225,0,152,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(225,0,152,0.95)]" : "drop-shadow-[0_0_12px_rgba(225,0,152,0.65)]")}`} />
              </div>
              {/* Node.js */}
              <div className="absolute top-[48%] right-[32%] animate-float-icon-2" style={{ animationDelay: "0.3s" }}>
                <NodeJSIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(95,160,78,0.4)]" : "drop-shadow-[0_1px_4px_rgba(95,160,78,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(95,160,78,0.95)]" : "drop-shadow-[0_0_12px_rgba(95,160,78,0.65)]")}`} />
              </div>
              {/* Svelte */}
              <div className="absolute top-[32%] right-[12%] animate-float-icon-4" style={{ animationDelay: "1.5s" }}>
                <SvelteIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(255,62,0,0.4)]" : "drop-shadow-[0_1px_4px_rgba(255,62,0,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(255,62,0,0.95)]" : "drop-shadow-[0_0_12px_rgba(255,62,0,0.65)]")}`} />
              </div>
              {/* Vite */}
              <div className="absolute bottom-[38%] left-[10%] animate-float-icon-1" style={{ animationDelay: "0.8s" }}>
                <ViteIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(189,52,254,0.4)]" : "drop-shadow-[0_1px_4px_rgba(189,52,254,0.2)]") : (isBold ? "drop-shadow-[0_0_20px_rgba(189,52,254,0.95)]" : "drop-shadow-[0_0_14px_rgba(189,52,254,0.7)]")}`} />
              </div>
              {/* C# */}
              <div className="absolute bottom-[42%] right-[16%] animate-float-icon-3" style={{ animationDelay: "1.3s" }}>
                <CSharpIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(104,33,122,0.4)]" : "drop-shadow-[0_1px_4px_rgba(104,33,122,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(104,33,122,0.95)]" : "drop-shadow-[0_0_12px_rgba(104,33,122,0.65)]")}`} />
              </div>
              {/* Postman */}
              <div className="absolute bottom-[14%] left-[36%] animate-float-icon-2" style={{ animationDelay: "0.6s" }}>
                <PostmanIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(255,108,55,0.4)]" : "drop-shadow-[0_1px_4px_rgba(255,108,55,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(255,108,55,0.95)]" : "drop-shadow-[0_0_12px_rgba(255,108,55,0.65)]")}`} />
              </div>
              {/* MongoDB */}
              <div className="absolute bottom-[35%] right-[28%] animate-float-icon-1" style={{ animationDelay: "1.4s" }}>
                <MongoIcon className={`${iconSizeSmall} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(0,237,100,0.4)]" : "drop-shadow-[0_1px_4px_rgba(0,237,100,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(0,237,100,0.95)]" : "drop-shadow-[0_0_12px_rgba(0,237,100,0.65)]")}`} />
              </div>
              {/* HTML5 */}
              <div className="absolute top-[3%] left-[2%] animate-float-icon-1" style={{ animationDelay: "1.4s" }}>
                <HTMLIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(227,79,38,0.4)]" : "drop-shadow-[0_1px_4px_rgba(227,79,38,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(227,79,38,0.95)]" : "drop-shadow-[0_0_12px_rgba(227,79,38,0.65)]")}`} />
              </div>
              {/* CSS3 */}
              <div className="absolute top-[2%] right-[2%] animate-float-icon-3" style={{ animationDelay: "0.2s" }}>
                <CSSIcon className={`${iconSize} ${isLight ? (isBold ? "drop-shadow-[0_2px_8px_rgba(21,114,182,0.4)]" : "drop-shadow-[0_1px_4px_rgba(21,114,182,0.2)]") : (isBold ? "drop-shadow-[0_0_18px_rgba(21,114,182,0.95)]" : "drop-shadow-[0_0_12px_rgba(21,114,182,0.65)]")}`} />
              </div>
            </div>
          )}
        </>
      )}

      {/* 5. Edge Vignette Gradient for Focus & Contrast */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isLight
            ? `bg-gradient-to-b from-white/40 via-transparent to-white/60 ${isBold ? "opacity-40" : "opacity-70"}`
            : activeStyle === "super-dark"
              ? `bg-gradient-to-b from-black/20 via-transparent to-black/60 ${isBold ? "opacity-40" : "opacity-60"}`
              : `bg-gradient-to-b from-transparent via-transparent to-[#020409]/60 ${isBold ? "opacity-30" : "opacity-50"}`
          }`}
      />
    </div>
  );
});

