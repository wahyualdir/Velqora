"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export type HuskyState = "idle" | "look-down" | "cover-eyes" | "peek" | "happy";

interface HuskyWatcherProps {
  state?: HuskyState;
  className?: string;
}

export function HuskyWatcher({ state = "idle", className = "" }: HuskyWatcherProps) {
  const [blink, setBlink] = useState(false);

  // Natural periodic blinking when eyes are open and not covered
  useEffect(() => {
    if (state === "cover-eyes") return;

    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3600 + Math.random() * 2400);

    return () => clearInterval(interval);
  }, [state]);

  const isCovering = state === "cover-eyes";
  const isPeeking = state === "peek";
  const isLookingDown = state === "look-down";
  const isHappy = state === "happy";

  return (
    <div
      className={`relative flex flex-col items-center justify-end select-none pointer-events-none ${className}`}
      style={{ width: 190, height: 155 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 190 155"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Soft cast drop shadow */}
          <filter id="husky-drop-shadow" x="-20%" y="-15%" width="140%" height="135%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.14" />
          </filter>
          <filter id="husky-paw-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.25" />
          </filter>

          {/* Eye Gradient (Iconic Husky Ice Blue) */}
          <linearGradient id="husky-blue-eye" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="55%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#075985" />
          </linearGradient>

          {/* Charcoal Fur Gradient */}
          <linearGradient id="husky-fur" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="60%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Inner Ear Soft Pastel Pink */}
          <linearGradient id="husky-ear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE4E6" />
            <stop offset="100%" stopColor="#FDA4AF" />
          </linearGradient>

          {/* Cute Rosy Cheek Blush */}
          <radialGradient id="husky-blush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FB7185" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ============================================================
            1. BODY & CHEST (Hangs slightly over the card rim)
            ============================================================ */}
        <path
          d="M60 134 C60 112, 130 112, 130 134 C130 148, 142 155, 142 155 L48 155 C48 155, 60 148, 60 134 Z"
          fill="#1E293B"
        />
        {/* Fluffy Snow-White Chest Bib */}
        <path
          d="M74 128 C74 128, 95 146, 116 128 C120 138, 108 155, 95 155 C82 155, 70 138, 74 128 Z"
          fill="#FFFFFF"
        />

        {/* ============================================================
            2. POINTED EARS (With energetic cute reactions)
            ============================================================ */}
        {/* Left Ear */}
        <motion.g
          animate={
            isHappy
              ? { rotate: [-5, 5, -5], y: [-2, 1, -2] }
              : { rotate: 0, y: 0 }
          }
          transition={{ repeat: isHappy ? Infinity : 0, duration: 0.55 }}
          style={{ originX: "52px", originY: "55px" }}
        >
          {/* Outer Ear Hood */}
          <path
            d="M48 60 L36 15 C36 15, 60 20, 72 48 Z"
            fill="url(#husky-fur)"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Inner Pink Ear */}
          <path
            d="M48 52 L42 24 C42 24, 58 28, 65 45 Z"
            fill="url(#husky-ear)"
          />
        </motion.g>

        {/* Right Ear */}
        <motion.g
          animate={
            isHappy
              ? { rotate: [5, -5, 5], y: [-2, 1, -2] }
              : { rotate: 0, y: 0 }
          }
          transition={{ repeat: isHappy ? Infinity : 0, duration: 0.55 }}
          style={{ originX: "138px", originY: "55px" }}
        >
          {/* Outer Ear Hood */}
          <path
            d="M142 60 L154 15 C154 15, 130 20, 118 48 Z"
            fill="url(#husky-fur)"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Inner Pink Ear */}
          <path
            d="M142 52 L148 24 C148 24, 132 28, 125 45 Z"
            fill="url(#husky-ear)"
          />
        </motion.g>

        {/* ============================================================
            3. HEAD (Chubby Cute Husky Head)
            ============================================================ */}
        <motion.g
          animate={
            isHappy
              ? { y: [-2, 2, -2] }
              : isLookingDown
              ? { y: 2.5 }
              : { y: 0 }
          }
          transition={{ duration: 0.25 }}
        >
          {/* Dark Charcoal Head Silhouette */}
          <ellipse
            cx="95"
            cy="78"
            rx="52"
            ry="50"
            fill="url(#husky-fur)"
            filter="url(#husky-drop-shadow)"
          />

          {/* ============================================================
              4. WHITE HUSKY FACE MASK
              ============================================================ */}
          <path
            d="M95 44 
               C72 44, 56 62, 56 87 
               C56 109, 72 122, 95 122 
               C118 122, 134 109, 134 87 
               C134 62, 118 44, 95 44 Z"
            fill="#FFFFFF"
          />

          {/* Forehead V-mask peak */}
          <path
            d="M95 38 
               L84 66 
               L95 72 
               L106 66 Z"
            fill="#1E293B"
          />

          {/* Husky Eyebrow Spots (Iconic dual markings above eyes) */}
          <ellipse cx="76" cy="58" rx="5.2" ry="3.6" fill="#1E293B" />
          <ellipse cx="114" cy="58" rx="5.2" ry="3.6" fill="#1E293B" />

          {/* Rosy Cheeks */}
          <circle cx="64" cy="94" r="8.5" fill="url(#husky-blush)" />
          <circle cx="126" cy="94" r="8.5" fill="url(#husky-blush)" />

          {/* ============================================================
              5. EYES & PUPILS (Interactive tracking & reactions)
                 - Left Eye Center: (76, 81)
                 - Right Eye Center: (114, 81)
              ============================================================ */}
          {isHappy ? (
            /* Happy Closed Arches (^ ^) */
            <g>
              <path
                d="M68 82 Q76 70 84 82"
                stroke="#1E293B"
                strokeWidth="3.6"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M106 82 Q114 70 122 82"
                stroke="#1E293B"
                strokeWidth="3.6"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          ) : (
            /* Expressive Blue Eyes */
            <g>
              {/* Left Eye Sclera */}
              <ellipse
                cx="76"
                cy="81"
                rx={blink ? 9.5 : 10}
                ry={blink ? 1 : 10.5}
                fill="#FFFFFF"
                stroke="#1E293B"
                strokeWidth="1.8"
              />
              {/* Right Eye Sclera */}
              <ellipse
                cx="114"
                cy="81"
                rx={blink ? 9.5 : 10}
                ry={blink ? 1 : 10.5}
                fill="#FFFFFF"
                stroke="#1E293B"
                strokeWidth="1.8"
              />

              {!blink && (
                <>
                  {/* Left Pupil + Iris */}
                  <motion.g
                    animate={{
                      y: isLookingDown ? 4 : isPeeking ? -1 : 0,
                      x: isLookingDown ? 0.5 : isPeeking ? 1.5 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  >
                    <circle cx="76" cy="81" r="6.8" fill="url(#husky-blue-eye)" />
                    <circle cx="76" cy="81" r="3.8" fill="#0F172A" />
                    {/* Catchlight sparkles */}
                    <circle cx="73.8" cy="78.5" r="2" fill="#FFFFFF" />
                    <circle cx="78.5" cy="82.8" r="1" fill="#FFFFFF" />
                  </motion.g>

                  {/* Right Pupil + Iris */}
                  <motion.g
                    animate={{
                      y: isLookingDown ? 4 : isPeeking ? -1 : 0,
                      x: isLookingDown ? -0.5 : isPeeking ? 1.5 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  >
                    <circle cx="114" cy="81" r="6.8" fill="url(#husky-blue-eye)" />
                    <circle cx="114" cy="81" r="3.8" fill="#0F172A" />
                    {/* Catchlight sparkles */}
                    <circle cx="111.8" cy="78.5" r="2" fill="#FFFFFF" />
                    <circle cx="116.5" cy="82.8" r="1" fill="#FFFFFF" />
                  </motion.g>
                </>
              )}
            </g>
          )}

          {/* ============================================================
              6. SNOUT, NOSE & MOUTH
              ============================================================ */}
          <ellipse cx="95" cy="98" rx="16" ry="12.5" fill="#FFFFFF" />

          {/* Black Triangular Rounded Nose */}
          <path
            d="M91 91 C91 91, 95 89.2, 99 91 C100.2 93, 97.5 96.8, 95 97.2 C92.5 96.8, 89.8 93, 91 91 Z"
            fill="#0F172A"
          />
          <ellipse cx="93.8" cy="91.5" rx="1.6" ry="0.9" fill="#FFFFFF" opacity="0.8" />

          {/* Smiling Dog W-Mouth */}
          <path
            d="M95 97.2 L95 101.5 M91 100.5 C93 103.2, 95 102, 95 102 C95 102, 97 103.2, 99 100.5"
            stroke="#0F172A"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* ============================================================
            7. CHUBBY HUSKY PAWS (Clean Relative Positioning)
               - Left Paw centered at (76, 142) -> delta to eye (76, 81) is dy: -61
               - Right Paw centered at (114, 142) -> delta to eye (114, 81) is dy: -61
            ============================================================ */}
        {/* Left Paw */}
        <g transform="translate(76, 142)">
          <motion.g
            animate={{
              x: 0,
              y: isCovering ? -61 : isPeeking ? -61 : 0,
              rotate: isCovering ? 6 : isPeeking ? 6 : 0,
              scale: isCovering || isPeeking ? 1.15 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 24,
            }}
            filter="url(#husky-paw-shadow)"
          >
            {/* Main Paw Mitt Shape centered at (0, 0) */}
            <ellipse
              cx="0"
              cy="0"
              rx="15"
              ry="14"
              fill="#FFFFFF"
              stroke="#94A3B8"
              strokeWidth="1.6"
            />
            {/* 3 Cute Paw Beans */}
            <ellipse cx="-8" cy="-7" rx="3" ry="4" fill="#E2E8F0" />
            <ellipse cx="0" cy="-10" rx="3" ry="4.2" fill="#E2E8F0" />
            <ellipse cx="8" cy="-7" rx="3" ry="4" fill="#E2E8F0" />
            {/* Center Palm Pad */}
            <ellipse cx="0" cy="2" rx="5.5" ry="4.5" fill="#CBD5E1" />
          </motion.g>
        </g>

        {/* Right Paw */}
        <g transform="translate(114, 142)">
          <motion.g
            animate={{
              x: isCovering ? 0 : isPeeking ? 6 : 0,
              y: isCovering ? -61 : isPeeking ? -18 : 0,
              rotate: isCovering ? -6 : isPeeking ? 16 : 0,
              scale: isCovering ? 1.15 : isPeeking ? 1.05 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 24,
            }}
            filter="url(#husky-paw-shadow)"
          >
            {/* Main Paw Mitt Shape centered at (0, 0) */}
            <ellipse
              cx="0"
              cy="0"
              rx="15"
              ry="14"
              fill="#FFFFFF"
              stroke="#94A3B8"
              strokeWidth="1.6"
            />
            {/* 3 Cute Paw Beans */}
            <ellipse cx="-8" cy="-7" rx="3" ry="4" fill="#E2E8F0" />
            <ellipse cx="0" cy="-10" rx="3" ry="4.2" fill="#E2E8F0" />
            <ellipse cx="8" cy="-7" rx="3" ry="4" fill="#E2E8F0" />
            {/* Center Palm Pad */}
            <ellipse cx="0" cy="2" rx="5.5" ry="4.5" fill="#CBD5E1" />
          </motion.g>
        </g>
      </svg>
    </div>
  );
}
