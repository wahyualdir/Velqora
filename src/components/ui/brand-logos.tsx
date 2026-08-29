"use client";

import React from "react";
import {
  SiDeepseek,
  SiVercel,
  SiNextdotjs,
  SiSupabase,
  SiTailwindcss,
  SiGithub,
} from "react-icons/si";
import { TbBrandOpenai } from "react-icons/tb";
import { VscVscode } from "react-icons/vsc";

export interface BrandIconProps {
  className?: string;
  size?: number;
}

/**
 * 1. Google Classroom Official Multi-Color Logo
 */
export function GoogleClassroomIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="3.5" width="20" height="15" rx="2.5" fill="#F4B400" />
      <rect x="3.5" y="5" width="17" height="12" rx="1.5" fill="#0F9D58" />
      <circle cx="12" cy="8.2" r="1.5" fill="#FFFFFF" />
      <path d="M9.2 13.5c0-1.5 1.25-2.7 2.8-2.7s2.8 1.2 2.8 2.7" fill="#FFFFFF" />
      <circle cx="7.2" cy="9.2" r="1.2" fill="#FFFFFF" fillOpacity="0.9" />
      <path d="M5.2 13.5c0-1.2.9-2.2 2-2.2s2 1 2 2.2" fill="#FFFFFF" fillOpacity="0.9" />
      <circle cx="16.8" cy="9.2" r="1.2" fill="#FFFFFF" fillOpacity="0.9" />
      <path d="M14.8 13.5c0-1.2.9-2.2 2-2.2s2 1 2 2.2" fill="#FFFFFF" fillOpacity="0.9" />
      <rect x="8.5" y="15.2" width="7" height="0.9" rx="0.45" fill="#F4B400" />
    </svg>
  );
}

/**
 * 2. Google Official 4-Color 'G' Logo
 */
export function GoogleIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.24v3.15C3.26 21.36 7.36 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.24C.45 8.19 0 9.99 0 12s.45 3.81 1.24 5.39l4.03-3.15z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.24 6.61l4.03 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
        fill="#EA4335"
      />
    </svg>
  );
}

/**
 * 3. Google Gemini Official Multi-Color Sparkle Logo
 */
export function GeminiIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z"
        fill="url(#geminiOfficialGrad_brand_svg)"
      />
      <defs>
        <linearGradient id="geminiOfficialGrad_brand_svg" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1B72E8" />
          <stop offset="0.45" stopColor="#8E75FF" />
          <stop offset="1" stopColor="#FD79A8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * 4. Anthropic Claude Official Asterisk / Spark Logo (Terracotta Sunburst)
 */
export function ClaudeIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Official Claude Terracotta Asterisk Sunburst */}
      <path
        d="M4.7 9.8h14.6M12 2.5v14.6M6.9 4.7l10.2 10.2M17.1 4.7L6.9 14.9"
        stroke="#D97757"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="9.8" r="3.2" fill="#D97757" />
    </svg>
  );
}

/**
 * 5. Claude Code Official CLI Brandmark
 */
export function ClaudeCodeIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="3" width="20" height="18" rx="4" fill="#18181B" stroke="#3F3F46" strokeWidth="1.5" />
      <path d="M6 8l4 4-4 4" stroke="#D97757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="16" x2="17" y2="16" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 6. OpenAI Official Pure White Rosette Logo
 */
export function OpenAIIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <TbBrandOpenai
      size={size}
      className={className}
      style={{ color: "#FFFFFF" }}
      title="OpenAI"
    />
  );
}

/**
 * 7. DeepSeek Official Blue Whale Logo
 */
export function DeepSeekIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <SiDeepseek
      size={size}
      className={className}
      style={{ color: "#0066FF" }}
      title="DeepSeek"
    />
  );
}

/**
 * 8. TanStack Official 3-Color Layered Stack Logo
 */
export function TanStackIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2.5L2.5 7.5l9.5 5 9.5-5-9.5-5z" fill="#E11D48" />
      <path d="M2.5 12.5l9.5 5 9.5-5" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M2.5 17.5l9.5 5 9.5-5" stroke="#06B6D4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/**
 * 9. Google AI Studio Official Multi-Color Logo
 */
export function AIStudioIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z"
        fill="url(#aiStudioGradOfficial_brand_svg)"
      />
      <circle cx="19" cy="5" r="2" fill="#38BDF8" />
      <defs>
        <linearGradient id="aiStudioGradOfficial_brand_svg" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4285F4" />
          <stop offset="0.5" stopColor="#8E75FF" />
          <stop offset="1" stopColor="#EA4335" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * 10. Vercel Official Triangle Logo
 */
export function VercelIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <SiVercel
      size={size}
      className={className}
      style={{ color: "#FFFFFF" }}
      title="Vercel"
    />
  );
}

/**
 * 11. Next.js Official Monogram Logo
 */
export function NextjsIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <SiNextdotjs
      size={size}
      className={className}
      style={{ color: "#FFFFFF" }}
      title="Next.js"
    />
  );
}

/**
 * 12. TypeScript Official Blue Square Logo
 */
export function TypeScriptIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
      <rect width="128" height="128" rx="16" fill="#3178C6" />
      <path
        d="M72.2 46.5v9.8h-16.7v53.2h-12V56.3H26.8v-9.8h45.4zm10.7 41.5c2.3 3.6 6.3 5.9 11.4 5.9 6.2 0 10.3-2.9 10.3-7.5 0-4.9-3.7-6.8-11.4-9.8-11.8-4.7-17-10.7-17-21.7 0-12.7 10-21.7 25.1-21.7 10.6 0 18.2 3.6 22.8 11.3l-9.8 6.1c-2.3-4.1-6.1-6.2-12.6-6.2-6.5 0-9.8 2.8-9.8 6.7 0 4.1 3 5.9 10.6 8.9 12.8 5.1 18.3 10.8 18.3 22.4 0 13.5-10.4 22.8-26.6 22.8-13.6 0-21.9-5.3-26.7-13.2l10.1-6z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/**
 * 13. JavaScript Official Yellow Square Logo
 */
export function JavaScriptIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
      <rect width="128" height="128" rx="16" fill="#F7DF1E" />
      <path
        d="M33.4 97.4c2.2 3.6 5.4 6 9.8 6 5.4 0 8.8-2.8 8.8-8.6V46.5h11.6v48.6c0 12.4-7.2 18.2-19.8 18.2-9.4 0-15.6-4.6-19-12.2l8.6-3.7zm43.3 3.5c2.7 4.4 7.6 7.3 13.7 7.3 7.8 0 12.8-3.9 12.8-9.3 0-6.4-5.1-8.7-14.3-12.6-13.6-5.7-19.4-12.8-19.4-24.8 0-14.2 11.3-24.8 28.3-24.8 12.1 0 20.6 4.3 25.8 13.6l-9.6 5.9c-2.8-4.9-7.3-7.5-15.8-7.5-7.7 0-12.2 3.6-12.2 8.3 0 5.2 3.7 7.4 13.3 11.5 14.5 6.2 20.8 13.1 20.8 25.9 0 15.6-12.4 25.6-30.8 25.6-15.8 0-25.2-6.5-30.4-16.1l9.9-6.9z"
        fill="#000000"
      />
    </svg>
  );
}

/**
 * 14. React Official Atom Orbitals Logo
 */
export function ReactIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="-11.5 -10.23 23 20.46" fill="none" className={className}>
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1.1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

/**
 * 15. Supabase Official Emerald Lightning Mark Logo
 */
export function SupabaseIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <SiSupabase
      size={size}
      className={className}
      style={{ color: "#3ECF8E" }}
      title="Supabase"
    />
  );
}

/**
 * 16. Tailwind CSS Official Waves Logo
 */
export function TailwindIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <SiTailwindcss
      size={size}
      className={className}
      style={{ color: "#38BDF8" }}
      title="Tailwind CSS"
    />
  );
}

/**
 * 17. Python Official 2-Color Blue & Yellow Interlocking Snakes Logo
 */
export function PythonIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
      {/* Top Blue Snake */}
      <path
        d="M63.5 0C30.7 0 32.7 14.2 32.7 14.2l.1 14.7h33.4v4.7H19.4S0 31.3 0 64.3c0 32.9 16.7 31.8 16.7 31.8h9.9V82.3s-.6-16.7 16.7-16.7h33.2v-4.9s14.8.4 14.8-16.5V14.2S93.8 0 63.5 0zm-11.8 9.9c3.7 0 6.7 3 6.7 6.7s-3 6.7-6.7 6.7-6.7-3-6.7-6.7 3-6.7 6.7-6.7z"
        fill="#3776AB"
      />
      {/* Bottom Yellow Snake */}
      <path
        d="M64.5 128c32.8 0 30.8-14.2 30.8-14.2l-.1-14.7H61.8v-4.7h46.8s19.4 2.3 19.4-30.7c0-32.9-16.7-31.8-16.7-31.8h-9.9v13.8s.6 16.7-16.7 16.7H51.5v4.9s-14.8-.4-14.8 16.5v26.4s-2.5 14.2 27.8 14.2zm11.8-9.9c-3.7 0-6.7-3-6.7-6.7s3-6.7 6.7-6.7 6.7 3 6.7 6.7-3 6.7-6.7 6.7z"
        fill="#FFD43B"
      />
    </svg>
  );
}

/**
 * 18. GitHub Official Octocat Silhouette Logo
 */
export function GitHubIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <SiGithub
      size={size}
      className={className}
      style={{ color: "#FFFFFF" }}
      title="GitHub"
    />
  );
}

/**
 * 19. Google Antigravity (AGY) Official Logo
 */
export function AntigravityIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z"
        stroke="#00F0FF"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="#0071E3"
        fillOpacity="0.2"
      />
      <path d="M12 5.5L17.5 14H6.5L12 5.5Z" fill="#00F0FF" />
      <circle cx="12" cy="11" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * 20. Docker Official Whale Logo
 */
export function DockerIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
      <path d="M124.5 59.8c-2.3-1.6-6-2.5-10.8-2.5-3.3 0-6.7.8-9.8 2.1-2.2-4.9-6.4-8.6-11.6-10.2-2.7-.9-5.6-1.1-8.4-.9v.3c0 2.2.8 4.3 2.1 6 1.6 2.1 4 3.4 6.6 3.9l.9.1c2.9.4 5.7 1.8 7.8 3.9 1.9 1.9 3 4.5 3.1 7.2H6.3v3.5c1 12.8 7.3 24.4 17.3 31.8 9.5 7.1 23.6 10.8 37.9 10.8 43 0 72.9-24.3 77.2-53.4 2.7-.8 5.1-2.3 7.2-4.2l.9-.9c1.3-1.4 1.4-2.1 0-3.1l-2.3-1.5z" fill="#2496ED" />
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

/**
 * 21. PostgreSQL Official Slonik Elephant Logo
 */
export function PostgreSQLIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
      <circle cx="64" cy="64" r="60" fill="#336791" />
      <path d="M63.8 26.2c-15.6 0-24.8 9.5-27.4 21.6-4.5 1.5-8.2 4.6-10.7 9-4.8 8.6-4.2 21.9.4 31.4 2 4.1 4.9 7.4 8.7 9.8 1.4-3.1 3.5-6.6 6.3-10.2 2.6-3.3 5.7-6.6 9-9.8 4.2-4.1 8.7-7.9 13.1-11.3 4.2-3.2 8.2-6 11.6-8.2 3.5-2.2 6.3-3.8 8-4.6 2.3-1.1 3.5-1.3 3.5-1.3s-.7-.9-2.2-2.4c-1.5-1.5-3.8-3.4-7-5.4-3.2-2-7.3-4.1-12.2-6-4.9-1.8-10.7-2.6-17.1-2.6z" fill="#FFFFFF" fillOpacity="0.95" />
      <path d="M84.7 51.5c-4.1 2.2-8.3 4.9-12.4 8-4.4 3.4-8.8 7.1-12.9 11.1-3.2 3.1-6.2 6.4-8.8 9.6-2.9 3.6-5.1 7.2-6.5 10.4 4.5 2.6 9.8 4 15.6 4 1.6 0 3.2-.1 4.7-.4 1.1-2.9 2.5-6.2 4.2-9.7 2-4.1 4.4-8.3 7.1-12.3 2.9-4.3 6.1-8.3 9.4-11.9 3.2-3.5 6.4-6.4 9.2-8.4.8-.6 1.4-1 1.8-1.2-.5-.1-1.3-.2-2.4-.2-2.5 0-5.7.4-9 1z" fill="#336791" />
    </svg>
  );
}

/**
 * 22. Node.js Official Hexagon Logo
 */
export function NodeJSIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
      <path d="M64 4.5L9.5 36v63L64 130.5l54.5-31.5V36L64 4.5z" fill="#339933" />
      <path d="M64 15.5l45 26v52l-45 26-45-26v-52l45-26z" fill="#5FA04E" />
      <path d="M53.5 48.5c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5v28.2c0 2.2 1.8 4 4 4s4-1.8 4-4V57h9.5v19.7c0 7.5-6 13.5-13.5 13.5s-13.5-6-13.5-13.5V57c0-2.2-1.8-4-4-4s-4 1.8-4 4v22.2H38V48.5h15.5z" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * 23. Visual Studio Code Official Ribbon Logo
 */
export function VSCodeIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <VscVscode
      size={size}
      className={className}
      style={{ color: "#007ACC" }}
      title="Visual Studio Code"
    />
  );
}

/**
 * 24. Instagram Official Gradient / Glyph Logo
 */
export function InstagramIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

/**
 * 25. WhatsApp Official Chat Bubble Logo
 */
export function WhatsAppIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.04 20.15C10.56 20.15 9.12 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.07 7.68C8.91 7.68 8.65 7.74 8.43 7.98C8.21 8.22 7.6 8.79 7.6 9.94C7.6 11.09 8.44 12.2 8.56 12.36C8.68 12.52 10.18 14.83 12.5 15.83C13.05 16.07 13.48 16.21 13.81 16.32C14.36 16.49 14.86 16.47 15.26 16.41C15.7 16.34 16.62 15.85 16.81 15.31C17 14.77 17 14.31 16.94 14.21C16.88 14.11 16.72 14.05 16.48 13.93C16.24 13.81 15.06 13.23 14.84 13.15C14.62 13.07 14.46 13.03 14.3 13.27C14.14 13.51 13.68 14.05 13.54 14.21C13.4 14.37 13.26 14.39 13.02 14.27C12.78 14.15 12.01 13.9 11.09 13.08C10.37 12.44 9.88 11.65 9.74 11.41C9.6 11.17 9.73 11.04 9.85 10.92C9.96 10.81 10.1 10.63 10.22 10.49C10.34 10.35 10.38 10.25 10.46 10.09C10.54 9.93 10.5 9.79 10.44 9.67C10.38 9.55 9.92 8.42 9.73 7.95C9.54 7.49 9.35 7.55 9.21 7.54C9.08 7.54 8.92 7.54 8.76 7.54" />
    </svg>
  );
}

/**
 * 26. TikTok Official Note Logo
 */
export function TikTokIcon({ className = "w-4 h-4", size = 16 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.46 6.27 6.27 0 0 0 1.84-4.46V8.75a8.28 8.28 0 0 0 4.93 1.6V6.9a4.83 4.83 0 0 1-1-.21z" />
    </svg>
  );
}
