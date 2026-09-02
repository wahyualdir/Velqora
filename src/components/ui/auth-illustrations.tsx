"use client";

import React from "react";

interface IllustrationProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

/**
 * 1. Animated Colorful Calico Scholar Cat Illustration (Login Page)
 * Subject: Playful & smart calico scholar cat (60% terracotta, 30% teal & cream, 10% mustard & sage)
 * Features: Calico patches, sage green eyes, mustard collar & bell, multi-tone tail, round scholar glasses
 * Animations: Eye blink (3.8s), Tail sway (2.6s), Breathing (3.5s), Head glance (9.5s), Ear twitch (6.5s), Floating objects, Steam rise
 */
export function AnimatedCatStudyIllustration({
  className = "w-full h-auto max-w-[340px]",
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
      aria-label="Ilustrasi Kucing Calico Cerdas Belajar dengan Buku dan Laptop"
      className={className}
      {...props}
    >
      <defs>
        {/* Terracotta Primary Gradient */}
        <linearGradient id="cat-terracotta-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0654F" />
          <stop offset="100%" stopColor="#C65D3B" />
        </linearGradient>

        {/* Soft Teal Calico Patch Gradient */}
        <linearGradient id="cat-teal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5FA5B9" />
          <stop offset="100%" stopColor="#4A90A4" />
        </linearGradient>

        {/* Warm Mustard Accent Gradient */}
        <linearGradient id="cat-mustard-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5CD63" />
          <stop offset="100%" stopColor="#E8B84B" />
        </linearGradient>

        {/* Inner Ear Gradient */}
        <linearGradient id="cat-ear-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FAF6F1" />
          <stop offset="100%" stopColor="#F4E4DD" />
        </linearGradient>

        <filter id="cat-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#C65D3B" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Ground Ambient Base */}
      <ellipse cx="250" cy="430" rx="195" ry="16" fill="#EBDDD0" opacity="0.6" />
      <ellipse cx="220" cy="430" rx="145" ry="10" fill="#DFCBB9" opacity="0.5" />

      {/* 1. Floating Graduation Cap (Top Left) */}
      <g className="animate-cat-float-1 motion-reduce:animate-none" transform="translate(65, 80)">
        <path d="M45 12 L82 28 L45 44 L8 28 Z" fill="#1F1B18" stroke="#1F1B18" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M22 35 L22 52 C22 62, 68 62, 68 52 L68 35" fill="#383330" stroke="#1F1B18" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="45" cy="28" r="3.5" fill="#E8B84B" />
        <path d="M45 28 Q30 35 26 48" fill="none" stroke="#E8B84B" strokeWidth="2" strokeLinecap="round" />
        <rect x="23" y="48" width="6" height="9" rx="2" fill="#E8B84B" />
      </g>

      {/* 2. Floating AI Idea Lightbulb (Top Center) */}
      <g className="animate-cat-float-2 motion-reduce:animate-none" transform="translate(235, 50)">
        <circle cx="20" cy="22" r="28" fill="#E8B84B" opacity="0.2" />
        <line x1="20" y1="-2" x2="20" y2="4" stroke="#C65D3B" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="2" y1="10" x2="6" y2="14" stroke="#4A90A4" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="10" x2="34" y2="14" stroke="#4A90A4" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 24 C6 17, 9 6, 20 6 C31 6, 34 17, 30 24 C28 27, 26 29, 26 33 L14 33 C14 29, 12 27, 10 24 Z" fill="#FAF6F1" stroke="#1F1B18" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M17 22 Q20 16 23 22" fill="none" stroke="#E8B84B" strokeWidth="2" strokeLinecap="round" />
        <rect x="15" y="33" width="10" height="4" rx="1.5" fill="#E5DDD5" stroke="#1F1B18" strokeWidth="2" />
        <path d="M17 37 L23 37" stroke="#1F1B18" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* 3. Floating Analytics Bar Chart (Top Right) */}
      <g className="animate-cat-float-3 motion-reduce:animate-none" transform="translate(365, 75)" filter="url(#cat-soft-glow)">
        <rect x="0" y="0" width="76" height="52" rx="12" fill="#FFFFFF" stroke="#1F1B18" strokeWidth="2.5" />
        <rect x="14" y="28" width="9" height="14" rx="3" fill="#E5DDD5" stroke="#1F1B18" strokeWidth="1.8" />
        <rect x="28" y="20" width="9" height="22" rx="3" fill="#E8B84B" stroke="#1F1B18" strokeWidth="1.8" />
        <rect x="42" y="14" width="9" height="28" rx="3" fill="#C65D3B" stroke="#1F1B18" strokeWidth="1.8" />
        <rect x="56" y="22" width="9" height="20" rx="3" fill="#4A90A4" stroke="#1F1B18" strokeWidth="1.8" />
        <circle cx="64" cy="10" r="2.5" fill="#7BA05B" />
      </g>

      {/* 4. Floating Document Note (Right Middle) */}
      <g className="animate-cat-float-4 motion-reduce:animate-none" transform="translate(405, 195)" filter="url(#cat-soft-glow)">
        <rect x="0" y="0" width="56" height="66" rx="8" fill="#FAF6F1" stroke="#1F1B18" strokeWidth="2.5" />
        <path d="M42 0 L56 14 L42 14 Z" fill="#E5DDD5" stroke="#1F1B18" strokeWidth="2" strokeLinejoin="round" />
        <line x1="10" y1="20" x2="34" y2="20" stroke="#C65D3B" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="10" y1="30" x2="44" y2="30" stroke="#6B6560" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="39" x2="40" y2="39" stroke="#6B6560" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="48" x2="28" y2="48" stroke="#6B6560" strokeWidth="2" strokeLinecap="round" />
        <circle cx="44" cy="54" r="5" fill="#7BA05B" stroke="#1F1B18" strokeWidth="1.5" />
        <path d="M42 54 L43.5 55.5 L46.5 52.5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* 5. Scattered Knowledge Sparkles (Multi-tone) */}
      <path d="M140 145 Q145 155 155 160 Q145 165 140 175 Q135 165 125 160 Q135 155 140 145 Z" fill="#C65D3B" opacity="0.85" />
      <path d="M360 220 Q363 226 369 229 Q363 232 360 238 Q357 232 351 229 Q357 226 360 220 Z" fill="#E8B84B" />
      <circle cx="85" cy="270" r="4" fill="#4A90A4" opacity="0.75" />
      <circle cx="105" cy="360" r="3" fill="#7BA05B" opacity="0.8" />
      <circle cx="445" cy="330" r="4" fill="#E0654F" opacity="0.6" />

      {/* Study Desk & Laptop (Right Side) */}
      <g id="cat-study-table">
        <rect x="275" y="345" width="145" height="14" rx="7" fill="#FAF6F1" stroke="#1F1B18" strokeWidth="2.5" />
        <path d="M290 359 L280 428" stroke="#1F1B18" strokeWidth="3" strokeLinecap="round" />
        <path d="M405 359 L415 428" stroke="#1F1B18" strokeWidth="3" strokeLinecap="round" />
        <line x1="285" y1="398" x2="410" y2="398" stroke="#1F1B18" strokeWidth="2" strokeLinecap="round" />

        {/* Small Potted Plant underneath with Sage Green Leaves */}
        <path d="M344 414 L347 428 L357 428 L360 414 Z" fill="#E5DDD5" stroke="#1F1B18" strokeWidth="1.5" />
        <circle cx="349" cy="410" r="4" fill="#7BA05B" stroke="#1F1B18" strokeWidth="1.2" />
        <circle cx="355" cy="410" r="4" fill="#7BA05B" stroke="#1F1B18" strokeWidth="1.2" />
        <circle cx="352" cy="406" r="3.5" fill="#4A90A4" stroke="#1F1B18" strokeWidth="1.2" />

        {/* Laptop on desk */}
        <path d="M295 345 L365 345 L360 341 L300 341 Z" fill="#E5DDD5" stroke="#1F1B18" strokeWidth="2" />
        <rect x="302" y="295" width="56" height="46" rx="4" fill="#FFFFFF" stroke="#1F1B18" strokeWidth="2.5" />
        <rect x="306" y="299" width="48" height="38" rx="2" fill="#FAF6F1" />
        <rect x="309" y="303" width="16" height="4" rx="1" fill="#C65D3B" />
        <line x1="309" y1="312" x2="335" y2="312" stroke="#4A90A4" strokeWidth="2" strokeLinecap="round" />
        <line x1="309" y1="318" x2="348" y2="318" stroke="#E5DDD5" strokeWidth="2" strokeLinecap="round" />
        <line x1="309" y1="324" x2="330" y2="324" stroke="#E5DDD5" strokeWidth="2" strokeLinecap="round" />
        <circle cx="344" cy="328" r="4" fill="#7BA05B" opacity="0.9" />

        {/* Coffee Cup (Teal Body) & Animated Steam */}
        <rect x="382" y="328" width="16" height="17" rx="3" fill="#4A90A4" stroke="#1F1B18" strokeWidth="2" />
        <path d="M398 332 C403 332, 403 341, 398 341" fill="none" stroke="#1F1B18" strokeWidth="2" />
        
        {/* Steam Curls */}
        <g className="animate-cat-steam motion-reduce:animate-none">
          <path d="M387 323 Q384 316 388 310" fill="none" stroke="#A39C94" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M393 321 Q396 314 392 308" fill="none" stroke="#A39C94" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </g>

      {/* Study Cushion for Cat (Dark Charcoal with Sage Green Piping) */}
      <rect x="110" y="414" width="130" height="20" rx="10" fill="#1F1B18" stroke="#1F1B18" strokeWidth="2" />
      <path d="M120 424 Q175 428 230 424" stroke="#7BA05B" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Cat Tail with Sway Animation (Multi-tone Calico Striping) */}
      <g className="animate-cat-tail motion-reduce:animate-none">
        {/* Tail Base (Terracotta) */}
        <path
          d="M138 410 C100 400, 75 345, 95 310 C102 295, 114 298, 108 315 C92 345, 110 385, 142 398 Z"
          fill="url(#cat-terracotta-grad)"
          stroke="#1F1B18"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Tail Middle Calico Patch (Soft Teal) */}
        <path
          d="M102 360 C92 345, 88 330, 95 318 C100 324, 104 338, 112 355 Z"
          fill="url(#cat-teal-grad)"
          stroke="#1F1B18"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Tail Tip (Warm Mustard with Cream Accent) */}
        <path
          d="M95 310 C102 295, 114 298, 108 315 C102 322, 96 318, 95 310 Z"
          fill="url(#cat-mustard-grad)"
          stroke="#1F1B18"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="106" cy="305" r="2.5" fill="#FAF6F1" />
      </g>

      {/* Cat Body with Breathing Animation */}
      <g className="animate-cat-breathe motion-reduce:animate-none">
        {/* Main Body (Terracotta 60%) */}
        <path
          d="M135 415 C128 350, 145 285, 175 285 C205 285, 222 350, 215 415 Z"
          fill="url(#cat-terracotta-grad)"
          stroke="#1F1B18"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Calico Patch on Left Flank (Soft Teal) */}
        <path
          d="M132 355 C138 350, 148 355, 145 375 C138 385, 131 372, 132 355 Z"
          fill="url(#cat-teal-grad)"
          stroke="#1F1B18"
          strokeWidth="1.5"
        />

        {/* Calico Spot on Right Flank (Warm Mustard) */}
        <path
          d="M205 348 C215 348, 220 365, 215 378 C208 375, 202 360, 205 348 Z"
          fill="url(#cat-mustard-grad)"
          stroke="#1F1B18"
          strokeWidth="1.5"
        />

        {/* Soft Cream Chest & Belly Highlight */}
        <path
          d="M155 415 C150 365, 160 315, 175 315 C190 315, 200 365, 195 415 Z"
          fill="#FAF6F1"
          stroke="#E5DDD5"
          strokeWidth="1.5"
        />

        {/* Open Book Resting on Cat's Lap */}
        <g id="cat-study-book">
          <path
            d="M140 385 Q175 393 210 385 L214 410 Q175 418 136 410 Z"
            fill="#FFFFFF"
            stroke="#1F1B18"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line x1="175" y1="391" x2="175" y2="416" stroke="#1F1B18" strokeWidth="2" />
          <path d="M175 400 Q180 408 178 418" stroke="#C65D3B" strokeWidth="2" fill="none" strokeLinecap="round" />
          <line x1="146" y1="395" x2="168" y2="397" stroke="#4A90A4" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="146" y1="401" x2="165" y2="403" stroke="#E5DDD5" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="182" y1="397" x2="204" y2="395" stroke="#E8B84B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="185" y1="403" x2="204" y2="401" stroke="#E5DDD5" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Cat Front Paws (White/Cream Socks) */}
        <ellipse cx="148" cy="386" rx="9" ry="7" fill="#FAF6F1" stroke="#1F1B18" strokeWidth="2" />
        <ellipse cx="202" cy="386" rx="9" ry="7" fill="#FAF6F1" stroke="#1F1B18" strokeWidth="2" />

        {/* Collar & Golden Bell Accent */}
        <g id="cat-collar">
          <path d="M152 284 Q175 293 198 284" stroke="#E8B84B" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M152 284 Q175 293 198 284" stroke="#1F1B18" strokeWidth="1.2" fill="none" />
          {/* Bell Charm */}
          <circle cx="175" cy="292" r="5" fill="#E8B84B" stroke="#1F1B18" strokeWidth="1.5" />
          <circle cx="175" cy="293" r="1.5" fill="#C65D3B" />
        </g>
      </g>

      {/* Cat Head Group with Look / Glance Animation */}
      <g className="animate-cat-head motion-reduce:animate-none">
        {/* Right Ear (Teal Accent Tip) */}
        <path
          d="M208 208 L226 162 L188 196 Z"
          fill="#4A90A4"
          stroke="#1F1B18"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M211 200 L221 172 L196 194 Z" fill="url(#cat-ear-grad)" />

        {/* Left Ear with Twitch Animation (Terracotta) */}
        <g className="animate-cat-ear motion-reduce:animate-none">
          <path
            d="M142 208 L124 162 L162 196 Z"
            fill="#C65D3B"
            stroke="#1F1B18"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M139 200 L129 172 L154 194 Z" fill="url(#cat-ear-grad)" />
        </g>

        {/* Main Head Shape (Terracotta) */}
        <path
          d="M132 245 C125 218, 140 195, 175 195 C210 195, 225 218, 218 245 C212 272, 138 272, 132 245 Z"
          fill="url(#cat-terracotta-grad)"
          stroke="#1F1B18"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Calico Patch on Forehead / Right Eye Area (Soft Teal) */}
        <path
          d="M182 196 C198 196, 218 212, 216 238 C202 240, 192 222, 182 196 Z"
          fill="url(#cat-teal-grad)"
          stroke="#1F1B18"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Calico Spot on Left Cheek (Warm Mustard) */}
        <ellipse cx="140" cy="254" rx="6.5" ry="5.5" fill="url(#cat-mustard-grad)" stroke="#1F1B18" strokeWidth="1.2" />

        {/* Cute Cream Snout Muzzle */}
        <ellipse cx="175" cy="250" rx="16" ry="11" fill="#FAF6F1" stroke="#E5DDD5" strokeWidth="1.2" />

        {/* Tiny Terracotta Nose & Cat Mouth */}
        <polygon points="172,244 178,244 175,248" fill="#C65D3B" />
        <path
          d="M170 250 Q175 254 175 248 Q175 254 180 250"
          fill="none"
          stroke="#1F1B18"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Whiskers (Left & Right) */}
        <g id="cat-whiskers">
          <line x1="138" y1="247" x2="112" y2="242" stroke="#1F1B18" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="138" y1="252" x2="108" y2="252" stroke="#1F1B18" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="138" y1="257" x2="112" y2="262" stroke="#1F1B18" strokeWidth="1.5" strokeLinecap="round" />

          <line x1="212" y1="247" x2="238" y2="242" stroke="#1F1B18" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="212" y1="252" x2="242" y2="252" stroke="#1F1B18" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="212" y1="257" x2="238" y2="262" stroke="#1F1B18" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Cat Eyes with Sage Green Irises & Blink Animation */}
        <g className="animate-cat-blink motion-reduce:animate-none">
          {/* Left Eye */}
          <circle cx="156" cy="233" r="7.5" fill="#7BA05B" stroke="#1F1B18" strokeWidth="1.2" />
          <ellipse cx="156" cy="233" rx="3.5" ry="6" fill="#1F1B18" />
          <circle cx="154" cy="230.5" r="2.2" fill="#FFFFFF" />
          <circle cx="158" cy="234.5" r="1" fill="#FFFFFF" />

          {/* Right Eye */}
          <circle cx="194" cy="233" r="7.5" fill="#7BA05B" stroke="#1F1B18" strokeWidth="1.2" />
          <ellipse cx="194" cy="233" rx="3.5" ry="6" fill="#1F1B18" />
          <circle cx="192" cy="230.5" r="2.2" fill="#FFFFFF" />
          <circle cx="196" cy="234.5" r="1" fill="#FFFFFF" />
        </g>

        {/* Scholar Glasses (Warm Mustard / Gold Frames) */}
        <circle cx="156" cy="233" r="13" fill="none" stroke="#E8B84B" strokeWidth="2.2" />
        <circle cx="156" cy="233" r="13" fill="none" stroke="#1F1B18" strokeWidth="0.8" opacity="0.4" />
        <circle cx="194" cy="233" r="13" fill="none" stroke="#E8B84B" strokeWidth="2.2" />
        <circle cx="194" cy="233" r="13" fill="none" stroke="#1F1B18" strokeWidth="0.8" opacity="0.4" />
        <line x1="169" y1="233" x2="181" y2="233" stroke="#E8B84B" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Alias for backward compatibility
export const LoginStudyIllustration = AnimatedCatStudyIllustration;

/**
 * 2. Register Typing Illustration
 * Subject: Student typing on laptop with checklist and calendar pill
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
      aria-label="Ilustrasi Mahasiswa Mengetik di Meja Belajar"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="rt-terracotta-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0654F" />
          <stop offset="100%" stopColor="#C65D3B" />
        </linearGradient>
        <filter id="rt-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#C65D3B" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Ground Base */}
      <ellipse cx="250" cy="430" rx="195" ry="16" fill="#EBDDD0" opacity="0.6" />
      <ellipse cx="270" cy="430" rx="145" ry="10" fill="#DFCBB9" opacity="0.5" />

      {/* Floating Task Checklist (Top Left) */}
      <g className="animate-cat-float-1 motion-reduce:animate-none" transform="translate(60, 90)">
        <rect x="0" y="0" width="64" height="74" rx="10" fill="#FFFFFF" stroke="#1F1B18" strokeWidth="2.5" />
        <rect x="12" y="14" width="8" height="8" rx="2" fill="#7BA05B" stroke="#1F1B18" strokeWidth="1.5" />
        <line x1="26" y1="18" x2="52" y2="18" stroke="#1F1B18" strokeWidth="2" strokeLinecap="round" />
        <rect x="12" y="30" width="8" height="8" rx="2" fill="#7BA05B" stroke="#1F1B18" strokeWidth="1.5" />
        <line x1="26" y1="34" x2="48" y2="34" stroke="#1F1B18" strokeWidth="2" strokeLinecap="round" />
        <rect x="12" y="46" width="8" height="8" rx="2" fill="#FAF6F1" stroke="#1F1B18" strokeWidth="1.5" />
        <line x1="26" y1="50" x2="42" y2="50" stroke="#6B6560" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Floating Calendar Schedule Pill (Top Right) */}
      <g className="animate-cat-float-3 motion-reduce:animate-none" transform="translate(355, 80)">
        <rect x="0" y="0" width="84" height="46" rx="12" fill="#FFFFFF" stroke="#1F1B18" strokeWidth="2.5" />
        <rect x="10" y="10" width="26" height="26" rx="6" fill="#C65D3B" />
        <text x="23" y="27" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">14</text>
        <line x1="44" y1="18" x2="74" y2="18" stroke="#1F1B18" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="44" y1="28" x2="66" y2="28" stroke="#6B6560" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Main Student Character at Desk */}
      <g id="rt-student-desk">
        {/* Desk */}
        <rect x="120" y="340" width="260" height="16" rx="8" fill="#FAF6F1" stroke="#1F1B18" strokeWidth="2.5" />
        <path d="M145 356 L135 430" stroke="#1F1B18" strokeWidth="3" strokeLinecap="round" />
        <path d="M355 356 L365 430" stroke="#1F1B18" strokeWidth="3" strokeLinecap="round" />

        {/* Chair & Torso */}
        <path d="M210 270 C190 270, 180 340, 180 340 L320 340 C320 340, 310 270, 290 270 Z" fill="url(#rt-terracotta-grad)" stroke="#1F1B18" strokeWidth="2.5" />
        <ellipse cx="250" cy="225" rx="24" ry="26" fill="#F4ECE4" stroke="#1F1B18" strokeWidth="2.5" />
        <path d="M226 215 C232 195, 268 195, 274 215 C260 210, 240 210, 226 215 Z" fill="#1F1B18" />

        {/* Glasses & Smile */}
        <circle cx="242" cy="224" r="5" fill="none" stroke="#1F1B18" strokeWidth="1.8" />
        <circle cx="258" cy="224" r="5" fill="none" stroke="#1F1B18" strokeWidth="1.8" />
        <line x1="247" y1="224" x2="253" y2="224" stroke="#1F1B18" strokeWidth="1.8" />
        <path d="M246 237 Q250 241 254 237" fill="none" stroke="#1F1B18" strokeWidth="1.8" strokeLinecap="round" />

        {/* Laptop */}
        <rect x="222" y="290" width="56" height="42" rx="4" fill="#FFFFFF" stroke="#1F1B18" strokeWidth="2.5" />
        <rect x="226" y="294" width="48" height="34" rx="2" fill="#FAF6F1" />
        <line x1="210" y1="340" x2="290" y2="340" stroke="#1F1B18" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * 3. Empty State Illustration
 * Subject: Relaxed student with warm cup and all-done checkmark badge
 */
export function EmptyStateIllustration({
  className = "w-full h-auto max-w-[320px]",
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
      aria-label="Ilustrasi Status Kosong dan Santai"
      className={className}
      {...props}
    >
      {/* Ground Base */}
      <ellipse cx="250" cy="420" rx="170" ry="14" fill="#EBDDD0" opacity="0.6" />

      {/* Floating Checkmark Badge (Center Top) */}
      <g className="animate-cat-float-2 motion-reduce:animate-none" transform="translate(210, 80)">
        <circle cx="40" cy="40" r="36" fill="#7BA05B" opacity="0.15" />
        <circle cx="40" cy="40" r="28" fill="#7BA05B" stroke="#1F1B18" strokeWidth="2.5" />
        <path d="M30 40 L37 47 L51 33" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Relaxed Student Resting on Armchair */}
      <g id="es-relaxed-student" transform="translate(140, 180)">
        <rect x="20" y="140" width="180" height="90" rx="24" fill="#FAF6F1" stroke="#1F1B18" strokeWidth="2.5" />
        <ellipse cx="110" cy="80" rx="26" ry="28" fill="#F4ECE4" stroke="#1F1B18" strokeWidth="2.5" />
        <path d="M84 70 C92 48, 128 48, 136 70 Z" fill="#1F1B18" />
        {/* Closed Eyes (Peaceful) */}
        <path d="M98 82 Q104 86 110 82" fill="none" stroke="#1F1B18" strokeWidth="2" strokeLinecap="round" />
        <path d="M116 82 Q122 86 128 82" fill="none" stroke="#1F1B18" strokeWidth="2" strokeLinecap="round" />
        <path d="M108 94 Q113 97 118 94" fill="none" stroke="#1F1B18" strokeWidth="2" strokeLinecap="round" />
        {/* Warm Cup */}
        <rect x="145" y="130" width="18" height="20" rx="4" fill="#C65D3B" stroke="#1F1B18" strokeWidth="2" />
        <path d="M163 135 C168 135, 168 145, 163 145" fill="none" stroke="#1F1B18" strokeWidth="2" />
      </g>
    </svg>
  );
}
