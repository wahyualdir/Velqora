"use client";

import React from "react";

interface IllustrationProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

/**
 * 1. Login Study Illustration
 * Subject: Student reading open book with laptop and floating academic elements
 */
export function LoginStudyIllustration({
  className = "w-full h-auto max-w-[360px]",
  size = 500,
  ...props
}: IllustrationProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label="Ilustrasi Mahasiswa Belajar dengan Buku dan Laptop"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="ls-terracotta-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0654F" />
          <stop offset="100%" stopColor="#C2553A" />
        </linearGradient>
        <filter id="ls-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#C2553A" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Ground Ambient Base */}
      <ellipse cx="250" cy="430" rx="190" ry="16" fill="#F4ECE4" opacity="0.85" />
      <ellipse cx="230" cy="430" rx="140" ry="10" fill="#E8DCD1" opacity="0.6" />

      {/* 1. Floating Graduation Cap (Top Left) */}
      <g className="transition-transform duration-300 hover:-translate-y-1" transform="translate(65, 85) rotate(-8)">
        <path d="M45 12 L82 28 L45 44 L8 28 Z" fill="#292524" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M22 35 L22 52 C22 62, 68 62, 68 52 L68 35" fill="#3D3835" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="45" cy="28" r="3.5" fill="#C2553A" />
        <path d="M45 28 Q30 35 26 48" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <rect x="23" y="48" width="6" height="9" rx="2" fill="#FBBF24" />
      </g>

      {/* 2. Floating AI Idea Lightbulb (Top Center) */}
      <g className="transition-transform duration-300 hover:-translate-y-1" transform="translate(235, 55)">
        <circle cx="20" cy="22" r="28" fill="#FBBF24" opacity="0.18" />
        <line x1="20" y1="-2" x2="20" y2="4" stroke="#C2553A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="2" y1="10" x2="6" y2="14" stroke="#C2553A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="10" x2="34" y2="14" stroke="#C2553A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 24 C6 17, 9 6, 20 6 C31 6, 34 17, 30 24 C28 27, 26 29, 26 33 L14 33 C14 29, 12 27, 10 24 Z" fill="#FAF6F1" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M17 22 Q20 16 23 22" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <rect x="15" y="33" width="10" height="4" rx="1.5" fill="#E7D8C9" stroke="#292524" strokeWidth="2" />
        <path d="M17 37 L23 37" stroke="#292524" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* 3. Floating Analytics Bar Chart (Top Right) */}
      <g className="transition-transform duration-300 hover:-translate-y-1" transform="translate(365, 80) rotate(6)" filter="url(#ls-soft-glow)">
        <rect x="0" y="0" width="76" height="52" rx="12" fill="#FFFFFF" stroke="#292524" strokeWidth="2.5" />
        <rect x="14" y="28" width="9" height="14" rx="3" fill="#E7D8C9" stroke="#292524" strokeWidth="1.8" />
        <rect x="28" y="20" width="9" height="22" rx="3" fill="#FBBF24" stroke="#292524" strokeWidth="1.8" />
        <rect x="42" y="14" width="9" height="28" rx="3" fill="#C2553A" stroke="#292524" strokeWidth="1.8" />
        <rect x="56" y="22" width="9" height="20" rx="3" fill="#10B981" stroke="#292524" strokeWidth="1.8" />
        <circle cx="64" cy="10" r="2.5" fill="#C2553A" />
      </g>

      {/* 4. Floating Document Note (Right Middle) */}
      <g className="transition-transform duration-300 hover:-translate-y-1" transform="translate(405, 205) rotate(-10)" filter="url(#ls-soft-glow)">
        <rect x="0" y="0" width="56" height="66" rx="8" fill="#FAF6F1" stroke="#292524" strokeWidth="2.5" />
        <path d="M42 0 L56 14 L42 14 Z" fill="#E7D8C9" stroke="#292524" strokeWidth="2" strokeLinejoin="round" />
        <line x1="10" y1="20" x2="34" y2="20" stroke="#C2553A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="10" y1="30" x2="44" y2="30" stroke="#78716C" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="39" x2="40" y2="39" stroke="#78716C" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="48" x2="28" y2="48" stroke="#78716C" strokeWidth="2" strokeLinecap="round" />
        <circle cx="44" cy="54" r="5" fill="#10B981" stroke="#292524" strokeWidth="1.5" />
        <path d="M42 54 L43.5 55.5 L46.5 52.5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* 5. Scattered Knowledge Sparkles */}
      <path d="M140 145 Q145 155 155 160 Q145 165 140 175 Q135 165 125 160 Q135 155 140 145 Z" fill="#C2553A" opacity="0.8" />
      <path d="M360 220 Q363 226 369 229 Q363 232 360 238 Q357 232 351 229 Q357 226 360 220 Z" fill="#FBBF24" />
      <circle cx="85" cy="270" r="4" fill="#C2553A" opacity="0.6" />
      <circle cx="105" cy="360" r="3" fill="#FBBF24" opacity="0.7" />
      <circle cx="445" cy="330" r="4" fill="#E0654F" opacity="0.6" />

      {/* Study Desk & Laptop (Right Side) */}
      <g id="ls-table">
        <rect x="290" y="340" width="135" height="14" rx="7" fill="#FAF6F1" stroke="#292524" strokeWidth="2.5" />
        <path d="M305 354 L295 425" stroke="#292524" strokeWidth="3" strokeLinecap="round" />
        <path d="M410 354 L420 425" stroke="#292524" strokeWidth="3" strokeLinecap="round" />
        <line x1="300" y1="395" x2="415" y2="395" stroke="#292524" strokeWidth="2" strokeLinecap="round" />

        {/* Laptop */}
        <g id="ls-laptop" transform="translate(305, 275)">
          <rect x="0" y="58" width="78" height="7" rx="3.5" fill="#E7D8C9" stroke="#292524" strokeWidth="2.5" />
          <line x1="32" y1="60" x2="46" y2="60" stroke="#78716C" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 0 L66 0 C70 0, 72 3, 71 7 L64 58 L8 58 L1 7 C0 3, 2 0, 6 0 Z" fill="#FFFFFF" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="7" y="6" width="58" height="46" rx="4" fill="#FAF6F1" />
          <rect x="11" y="10" width="14" height="4" rx="2" fill="#C2553A" />
          <rect x="11" y="18" width="22" height="14" rx="2" fill="#E8DCD1" />
          <rect x="36" y="18" width="25" height="14" rx="2" fill="#C2553A" opacity="0.2" />
          <line x1="39" y1="23" x2="56" y2="23" stroke="#C2553A" strokeWidth="2" strokeLinecap="round" />
          <line x1="39" y1="28" x2="50" y2="28" stroke="#C2553A" strokeWidth="2" strokeLinecap="round" />
          <rect x="11" y="36" width="50" height="12" rx="2" fill="#FFFFFF" stroke="#E8DCD1" strokeWidth="1" />
        </g>

        {/* Coffee Mug */}
        <g id="ls-mug" transform="translate(390, 316)">
          <path d="M6 -10 Q10 -5 6 0" fill="none" stroke="#C2553A" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <path d="M11 -8 Q15 -3 11 2" fill="none" stroke="#C2553A" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <rect x="0" y="6" width="18" height="18" rx="4" fill="#C2553A" stroke="#292524" strokeWidth="2.5" />
          <path d="M18 9 C23 9, 23 19, 18 20" fill="none" stroke="#292524" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Potted Plant */}
        <g id="ls-plant" transform="translate(345, 385)">
          <path d="M4 18 L18 18 L20 34 L2 34 Z" fill="#E7D8C9" stroke="#292524" strokeWidth="2" strokeLinejoin="round" />
          <path d="M11 18 C7 10, 3 14, 6 18 Z" fill="#10B981" stroke="#292524" strokeWidth="1.8" />
          <path d="M11 18 C15 10, 19 14, 16 18 Z" fill="#10B981" stroke="#292524" strokeWidth="1.8" />
          <path d="M11 18 C11 8, 14 8, 11 18 Z" fill="#34D399" stroke="#292524" strokeWidth="1.8" />
        </g>
      </g>

      {/* Character: Student Sitting Cross-Legged */}
      <g id="ls-student">
        <ellipse cx="190" cy="415" rx="85" ry="20" fill="#F4ECE4" stroke="#292524" strokeWidth="2.5" />
        <path d="M115 415 C115 428, 265 428, 265 415" fill="none" stroke="#292524" strokeWidth="2.5" />

        {/* Legs */}
        <g id="ls-legs">
          <path d="M165 375 C145 385, 115 395, 125 412 C135 425, 185 415, 205 405" fill="#3D3835" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M215 375 C235 385, 265 395, 255 412 C245 425, 195 415, 175 405" fill="#292524" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
          <ellipse cx="128" cy="412" rx="9" ry="6" fill="#FAF6F1" stroke="#292524" strokeWidth="2" />
          <ellipse cx="252" cy="412" rx="9" ry="6" fill="#FAF6F1" stroke="#292524" strokeWidth="2" />
        </g>

        {/* Torso */}
        <g id="ls-torso">
          <path d="M150 245 C135 270, 140 375, 155 385 L225 385 C240 375, 245 270, 230 245 C215 235, 165 235, 150 245 Z" fill="url(#ls-terracotta-grad)" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M172 242 C172 254, 208 254, 208 242" fill="#FAF6F1" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M160 320 Q190 335 220 320" fill="none" stroke="#A9442C" strokeWidth="2" strokeLinecap="round" />
          <path d="M165 355 Q190 365 215 355" fill="none" stroke="#A9442C" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Head & Hair */}
        <g id="ls-head">
          <rect x="183" y="222" width="14" height="24" rx="4" fill="#FCD9C4" stroke="#292524" strokeWidth="2.5" />
          <circle cx="190" cy="195" r="30" fill="#FCD9C4" stroke="#292524" strokeWidth="2.5" />
          <path d="M160 195 C158 170, 172 155, 190 155 C212 155, 224 168, 222 195 C218 178, 210 172, 195 172 C180 172, 168 182, 160 195 Z" fill="#292524" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M160 192 C162 180, 175 168, 192 168 C205 168, 218 176, 220 190 C212 182, 198 178, 185 182 C175 185, 168 190, 160 192 Z" fill="#3D3835" />

          {/* Glasses & Features */}
          <circle cx="180" cy="195" r="8" fill="#FFFFFF" fillOpacity="0.4" stroke="#292524" strokeWidth="2" />
          <circle cx="202" cy="195" r="8" fill="#FFFFFF" fillOpacity="0.4" stroke="#292524" strokeWidth="2" />
          <line x1="188" y1="195" x2="194" y2="195" stroke="#292524" strokeWidth="2" />
          <circle cx="180" cy="195" r="2" fill="#292524" />
          <circle cx="202" cy="195" r="2" fill="#292524" />
          <path d="M186 210 Q191 214 196 210" fill="none" stroke="#292524" strokeWidth="2" strokeLinecap="round" />
          <circle cx="170" cy="204" r="3.5" fill="#E0654F" opacity="0.4" />
          <circle cx="210" cy="204" r="3.5" fill="#E0654F" opacity="0.4" />
        </g>

        {/* Arms & Open Book */}
        <g id="ls-arms-book">
          <path d="M152 255 C132 285, 142 335, 165 345" fill="none" stroke="url(#ls-terracotta-grad)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M152 255 C132 285, 142 335, 165 345" fill="none" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          <path d="M228 255 C248 285, 238 335, 215 345" fill="none" stroke="url(#ls-terracotta-grad)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M228 255 C248 285, 238 335, 215 345" fill="none" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          <circle cx="160" cy="342" r="7" fill="#FCD9C4" stroke="#292524" strokeWidth="2" />
          <circle cx="220" cy="342" r="7" fill="#FCD9C4" stroke="#292524" strokeWidth="2" />

          {/* Book */}
          <g id="ls-open-book" transform="translate(150, 318)" filter="url(#ls-soft-glow)">
            <path d="M40 32 L5 24 C2 23, 0 20, 0 17 L0 3 C0 0, 3 -2, 6 -1 L40 8 L74 -1 C77 -2, 80 0, 80 3 L80 17 C80 20, 78 23, 75 24 Z" fill="#292524" stroke="#292524" strokeWidth="2" strokeLinejoin="round" />
            <path d="M40 30 C28 26, 12 21, 4 20 L4 6 C12 7, 28 12, 40 16 Z" fill="#FAF6F1" stroke="#292524" strokeWidth="2" strokeLinejoin="round" />
            <path d="M40 30 C52 26, 68 21, 76 20 L76 6 C68 7, 52 12, 40 16 Z" fill="#FFFFFF" stroke="#292524" strokeWidth="2" strokeLinejoin="round" />
            <line x1="40" y1="16" x2="40" y2="30" stroke="#C2553A" strokeWidth="2" />
            <path d="M40 30 Q44 42 40 46 L43 44 L46 47 Q43 38 40 30" fill="#C2553A" stroke="#292524" strokeWidth="1.5" />
            <line x1="9" y1="10" x2="33" y2="15" stroke="#78716C" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="9" y1="14" x2="33" y2="19" stroke="#78716C" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="9" y1="18" x2="26" y2="22" stroke="#78716C" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="47" y1="15" x2="71" y2="10" stroke="#78716C" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="47" y1="19" x2="71" y2="14" stroke="#78716C" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="47" y1="23" x2="64" y2="19" stroke="#C2553A" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </svg>
  );
}

/**
 * 2. Register Typing Illustration
 * Subject: Student focused on typing at desk with checklist & schedule pill
 */
export function RegisterTypingIllustration({
  className = "w-full h-auto max-w-[360px]",
  size = 500,
  ...props
}: IllustrationProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label="Ilustrasi Mahasiswa Mengetik di Laptop"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="rt-terracotta" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0654F" />
          <stop offset="100%" stopColor="#C2553A" />
        </linearGradient>
        <filter id="rt-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#C2553A" floodOpacity="0.12" />
        </filter>
      </defs>

      <ellipse cx="250" cy="430" rx="190" ry="16" fill="#F4ECE4" opacity="0.85" />
      <ellipse cx="270" cy="430" rx="140" ry="10" fill="#E8DCD1" opacity="0.6" />

      {/* Graduation Cap */}
      <g className="transition-transform duration-300 hover:-translate-y-1" transform="translate(365, 80) rotate(8)">
        <path d="M45 12 L82 28 L45 44 L8 28 Z" fill="#292524" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M22 35 L22 52 C22 62, 68 62, 68 52 L68 35" fill="#3D3835" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="45" cy="28" r="3.5" fill="#C2553A" />
        <path d="M45 28 Q30 35 26 48" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <rect x="23" y="48" width="6" height="9" rx="2" fill="#FBBF24" />
      </g>

      {/* Lightbulb */}
      <g className="transition-transform duration-300 hover:-translate-y-1" transform="translate(75, 75) rotate(-6)">
        <circle cx="20" cy="22" r="28" fill="#FBBF24" opacity="0.18" />
        <line x1="20" y1="-2" x2="20" y2="4" stroke="#C2553A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="2" y1="10" x2="6" y2="14" stroke="#C2553A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="10" x2="34" y2="14" stroke="#C2553A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 24 C6 17, 9 6, 20 6 C31 6, 34 17, 30 24 C28 27, 26 29, 26 33 L14 33 C14 29, 12 27, 10 24 Z" fill="#FAF6F1" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M17 22 Q20 16 23 22" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <rect x="15" y="33" width="10" height="4" rx="1.5" fill="#E7D8C9" stroke="#292524" strokeWidth="2" />
        <path d="M17 37 L23 37" stroke="#292524" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Checklist Badge */}
      <g className="transition-transform duration-300 hover:-translate-y-1" transform="translate(55, 195) rotate(6)" filter="url(#rt-glow)">
        <rect x="0" y="0" width="70" height="56" rx="10" fill="#FFFFFF" stroke="#292524" strokeWidth="2.5" />
        <circle cx="14" cy="18" r="4" fill="#10B981" />
        <line x1="24" y1="18" x2="56" y2="18" stroke="#78716C" strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="30" r="4" fill="#10B981" />
        <line x1="24" y1="30" x2="48" y2="30" stroke="#78716C" strokeWidth="2" strokeLinecap="round" />
        <rect x="10" y="42" width="50" height="5" rx="2.5" fill="#FAF6F1" stroke="#292524" strokeWidth="1.5" />
        <rect x="10" y="42" width="38" height="5" rx="2.5" fill="#C2553A" />
      </g>

      {/* Calendar Pill */}
      <g className="transition-transform duration-300 hover:-translate-y-1" transform="translate(395, 200) rotate(-8)" filter="url(#rt-glow)">
        <rect x="0" y="0" width="62" height="60" rx="10" fill="#FAF6F1" stroke="#292524" strokeWidth="2.5" />
        <rect x="0" y="0" width="62" height="18" rx="8" fill="#C2553A" stroke="#292524" strokeWidth="2" />
        <circle cx="18" cy="9" r="2" fill="#FFFFFF" />
        <circle cx="44" cy="9" r="2" fill="#FFFFFF" />
        <circle cx="16" cy="28" r="2.5" fill="#292524" />
        <circle cx="31" cy="28" r="2.5" fill="#292524" />
        <circle cx="46" cy="28" r="2.5" fill="#10B981" />
        <circle cx="16" cy="42" r="2.5" fill="#292524" />
        <circle cx="31" cy="42" r="2.5" fill="#C2553A" />
        <circle cx="46" cy="42" r="2.5" fill="#292524" />
      </g>

      {/* Sparkles */}
      <path d="M165 110 Q168 116 174 119 Q168 122 165 128 Q162 122 156 119 Q162 116 165 110 Z" fill="#C2553A" />
      <path d="M340 180 Q343 186 349 189 Q343 192 340 198 Q337 192 331 189 Q337 186 340 180 Z" fill="#FBBF24" />
      <circle cx="105" cy="320" r="3.5" fill="#C2553A" opacity="0.6" />
      <circle cx="420" cy="330" r="4" fill="#FBBF24" opacity="0.6" />

      {/* Desk & Laptop */}
      <g id="rt-desk">
        <rect x="140" y="325" width="220" height="16" rx="8" fill="#FAF6F1" stroke="#292524" strokeWidth="2.5" />
        <path d="M160 341 L145 425" stroke="#292524" strokeWidth="3" strokeLinecap="round" />
        <path d="M340 341 L355 425" stroke="#292524" strokeWidth="3" strokeLinecap="round" />
        <line x1="150" y1="395" x2="350" y2="395" stroke="#292524" strokeWidth="2" strokeLinecap="round" />

        <g id="rt-laptop" transform="translate(195, 245)">
          <rect x="0" y="74" width="110" height="8" rx="4" fill="#E7D8C9" stroke="#292524" strokeWidth="2.5" />
          <line x1="45" y1="77" x2="65" y2="77" stroke="#78716C" strokeWidth="2" strokeLinecap="round" />
          <rect x="10" y="0" width="90" height="74" rx="6" fill="#FFFFFF" stroke="#292524" strokeWidth="2.5" />
          <rect x="16" y="6" width="78" height="62" rx="4" fill="#FAF6F1" />
          <rect x="22" y="12" width="24" height="4" rx="2" fill="#C2553A" />
          <line x1="22" y1="22" x2="52" y2="22" stroke="#78716C" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="28" x2="68" y2="28" stroke="#292524" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="34" x2="60" y2="34" stroke="#C2553A" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="40" x2="48" y2="40" stroke="#78716C" strokeWidth="2" strokeLinecap="round" />
          <rect x="22" y="48" width="66" height="14" rx="2" fill="#FFFFFF" stroke="#E8DCD1" strokeWidth="1" />
          <circle cx="28" cy="55" r="2.5" fill="#10B981" />
          <line x1="36" y1="55" x2="78" y2="55" stroke="#78716C" strokeWidth="2" strokeLinecap="round" />
        </g>

        <g transform="translate(325, 302)">
          <path d="M4 -8 Q8 -4 4 0" fill="none" stroke="#C2553A" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <rect x="0" y="4" width="16" height="18" rx="4" fill="#C2553A" stroke="#292524" strokeWidth="2.2" />
          <path d="M16 8 C20 8, 20 16, 16 17" fill="none" stroke="#292524" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        <g transform="translate(150, 305)">
          <rect x="0" y="10" width="34" height="10" rx="3" fill="#292524" stroke="#292524" strokeWidth="2" />
          <rect x="4" y="2" width="28" height="8" rx="2.5" fill="#FAF6F1" stroke="#292524" strokeWidth="2" />
        </g>
      </g>

      {/* Student Character */}
      <g id="rt-student">
        <path d="M210 230 C210 200, 290 200, 290 230 L285 360 L215 360 Z" fill="#F4ECE4" stroke="#292524" strokeWidth="2.5" />
        <line x1="250" y1="360" x2="250" y2="425" stroke="#292524" strokeWidth="3" strokeLinecap="round" />
        <path d="M230 425 L270 425" stroke="#292524" strokeWidth="3" strokeLinecap="round" />

        <path d="M220 235 C205 260, 208 340, 218 350 L282 350 C292 340, 295 260, 280 235 C265 225, 235 225, 220 235 Z" fill="url(#rt-terracotta)" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M238 232 C238 244, 262 244, 262 232" fill="#FAF6F1" stroke="#292524" strokeWidth="2" strokeLinejoin="round" />

        <rect x="244" y="210" width="12" height="24" rx="4" fill="#FCD9C4" stroke="#292524" strokeWidth="2" />
        <circle cx="250" cy="185" r="28" fill="#FCD9C4" stroke="#292524" strokeWidth="2.5" />
        
        <path d="M222 185 C220 160, 234 148, 250 148 C270 148, 280 158, 278 185 C274 170, 268 165, 255 165 C242 165, 230 172, 222 185 Z" fill="#292524" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M222 182 C225 172, 238 162, 252 162 C264 162, 274 170, 276 180 C270 174, 258 170, 246 174 C236 177, 230 180, 222 182 Z" fill="#3D3835" />

        <circle cx="240" cy="186" r="7.5" fill="#FFFFFF" fillOpacity="0.4" stroke="#292524" strokeWidth="1.8" />
        <circle cx="260" cy="186" r="7.5" fill="#FFFFFF" fillOpacity="0.4" stroke="#292524" strokeWidth="1.8" />
        <line x1="247.5" y1="186" x2="252.5" y2="186" stroke="#292524" strokeWidth="1.8" />
        <circle cx="240" cy="187" r="1.8" fill="#292524" />
        <circle cx="260" cy="187" r="1.8" fill="#292524" />
        <path d="M246 200 Q250 203 254 200" fill="none" stroke="#292524" strokeWidth="2" strokeLinecap="round" />
        <circle cx="232" cy="195" r="3" fill="#E0654F" opacity="0.4" />
        <circle cx="268" cy="195" r="3" fill="#E0654F" opacity="0.4" />

        {/* Arms on Keyboard */}
        <g id="rt-arms">
          <path d="M222 245 C202 275, 205 315, 228 322" fill="none" stroke="url(#rt-terracotta)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M222 245 C202 275, 205 315, 228 322" fill="none" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M278 245 C298 275, 295 315, 272 322" fill="none" stroke="url(#rt-terracotta)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M278 245 C298 275, 295 315, 272 322" fill="none" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="232" cy="322" r="6.5" fill="#FCD9C4" stroke="#292524" strokeWidth="2" />
          <circle cx="268" cy="322" r="6.5" fill="#FCD9C4" stroke="#292524" strokeWidth="2" />
        </g>
      </g>
    </svg>
  );
}

/**
 * 3. Empty State Illustration
 * Subject: Relaxed student enjoying an organized workspace with green checkmark
 */
export function EmptyStateIllustration({
  className = "w-full h-auto max-w-[360px]",
  size = 500,
  ...props
}: IllustrationProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label="Ilustrasi Jadwal dan Tugas Selesai"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="es-terracotta" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0654F" />
          <stop offset="100%" stopColor="#C2553A" />
        </linearGradient>
        <filter id="es-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#C2553A" floodOpacity="0.12" />
        </filter>
      </defs>

      <ellipse cx="250" cy="430" rx="190" ry="16" fill="#F4ECE4" opacity="0.85" />
      <ellipse cx="240" cy="430" rx="140" ry="10" fill="#E8DCD1" opacity="0.6" />

      {/* Checkmark Badge */}
      <g className="transition-transform duration-300 hover:-translate-y-1" transform="translate(195, 60)" filter="url(#es-glow)">
        <circle cx="55" cy="45" r="38" fill="#FAF6F1" stroke="#292524" strokeWidth="2.5" />
        <circle cx="55" cy="45" r="30" fill="#10B981" stroke="#292524" strokeWidth="2" />
        <path d="M44 45 L52 53 L68 37" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Confetti & Sparkles */}
      <path d="M95 120 Q98 126 104 129 Q98 132 95 138 Q92 132 86 129 Q92 126 95 120 Z" fill="#C2553A" />
      <path d="M395 125 Q398 131 404 134 Q398 137 395 143 Q392 137 386 134 Q392 131 395 125 Z" fill="#FBBF24" />
      <circle cx="120" cy="220" r="4" fill="#10B981" opacity="0.7" />
      <circle cx="380" cy="220" r="3.5" fill="#C2553A" opacity="0.6" />
      <rect x="345" y="85" width="8" height="8" rx="2" transform="rotate(25 345 85)" fill="#C2553A" opacity="0.7" />
      <rect x="145" y="95" width="7" height="7" rx="2" transform="rotate(-15 145 95)" fill="#FBBF24" opacity="0.8" />

      {/* Lounge Chair */}
      <path d="M140 280 C110 320, 115 415, 170 425 L330 425 C385 415, 390 320, 360 280 C330 240, 170 240, 140 280 Z" fill="#F4ECE4" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M150 360 Q250 380 350 360" fill="none" stroke="#292524" strokeWidth="2" />

      {/* Character */}
      <g id="es-character">
        <path d="M170 380 C150 390, 125 405, 145 420 C165 430, 220 420, 250 405" fill="#3D3835" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M330 380 C350 390, 375 405, 355 420 C335 430, 280 420, 250 405" fill="#292524" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
        <ellipse cx="145" cy="420" rx="8" ry="5.5" fill="#FAF6F1" stroke="#292524" strokeWidth="2" />
        <ellipse cx="355" cy="420" rx="8" ry="5.5" fill="#FAF6F1" stroke="#292524" strokeWidth="2" />

        <path d="M195 245 C180 270, 185 375, 195 385 L305 385 C315 375, 320 270, 305 245 C290 235, 210 235, 195 245 Z" fill="url(#es-terracotta)" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M228 242 C228 254, 272 254, 272 242" fill="#FAF6F1" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />

        <rect x="243" y="222" width="14" height="24" rx="4" fill="#FCD9C4" stroke="#292524" strokeWidth="2" />
        <circle cx="250" cy="195" r="30" fill="#FCD9C4" stroke="#292524" strokeWidth="2.5" />
        
        <path d="M220 195 C218 170, 232 155, 250 155 C272 155, 284 168, 282 195 C278 178, 270 172, 255 172 C240 172, 228 182, 220 195 Z" fill="#292524" stroke="#292524" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M220 192 C222 180, 235 168, 252 168 C265 168, 278 176, 280 190 C272 182, 258 178, 245 182 C235 185, 228 190, 220 192 Z" fill="#3D3835" />

        <circle cx="240" cy="195" r="8" fill="#FFFFFF" fillOpacity="0.4" stroke="#292524" strokeWidth="1.8" />
        <circle cx="262" cy="195" r="8" fill="#FFFFFF" fillOpacity="0.4" stroke="#292524" strokeWidth="1.8" />
        <line x1="248" y1="195" x2="254" y2="195" stroke="#292524" strokeWidth="1.8" />
        <path d="M236 195 Q240 191 244 195" fill="none" stroke="#292524" strokeWidth="2" strokeLinecap="round" />
        <path d="M258 195 Q262 191 266 195" fill="none" stroke="#292524" strokeWidth="2" strokeLinecap="round" />
        <path d="M245 208 Q251 214 257 208" fill="none" stroke="#292524" strokeWidth="2" strokeLinecap="round" />
        <circle cx="230" cy="202" r="3.5" fill="#E0654F" opacity="0.4" />
        <circle cx="270" cy="202" r="3.5" fill="#E0654F" opacity="0.4" />

        {/* Arms holding cup */}
        <g id="es-arms">
          <path d="M200 255 C180 285, 195 330, 230 338" fill="none" stroke="url(#es-terracotta)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M200 255 C180 285, 195 330, 230 338" fill="none" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M300 255 C320 285, 305 330, 270 338" fill="none" stroke="url(#es-terracotta)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M300 255 C320 285, 305 330, 270 338" fill="none" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <g transform="translate(241, 320)">
            <path d="M5 -8 Q9 -4 5 0" fill="none" stroke="#C2553A" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            <rect x="0" y="4" width="18" height="20" rx="5" fill="#FAF6F1" stroke="#292524" strokeWidth="2.2" />
            <circle cx="9" cy="14" r="3.5" fill="#C2553A" />
          </g>
          <circle cx="234" cy="336" r="6" fill="#FCD9C4" stroke="#292524" strokeWidth="1.8" />
          <circle cx="266" cy="336" r="6" fill="#FCD9C4" stroke="#292524" strokeWidth="1.8" />
        </g>
      </g>
    </svg>
  );
}
