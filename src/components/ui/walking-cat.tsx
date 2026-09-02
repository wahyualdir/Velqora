"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface WalkingCatProps {
  className?: string;
  speed?: number; // duration in seconds for one full cross
}

/**
 * Walking Cat Component (Google Colab Easter Egg Style)
 * Walks smoothly back and forth horizontally at the bottom of the auth card with 60fps walk cycle.
 */
export function WalkingCat({ className = "", speed = 7 }: WalkingCatProps) {
  const [direction, setDirection] = useState<"right" | "left">("right");
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`relative w-full h-11 overflow-hidden pointer-events-none select-none ${className}`}>
        <div className="absolute bottom-1 left-4 opacity-0">
          <CatSprite walking={false} />
        </div>
      </div>
    );
  }

  if (shouldReduceMotion) {
    // Static accessible fallback: Resting cat centered
    return (
      <div className={`flex justify-center items-center py-1.5 pointer-events-none select-none ${className}`}>
        <CatSprite walking={false} />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-11 overflow-hidden pointer-events-none select-none border-t border-border/40 pt-1.5 mt-2 ${className}`}>
      {/* Walking Cat Track */}
      <motion.div
        className="absolute bottom-0.5 will-change-transform"
        initial={{ x: "0%" }}
        animate={{
          x: direction === "right" ? ["0%", "calc(100% - 56px)"] : ["calc(100% - 56px)", "0%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
        }}
        onAnimationComplete={() => {
          setDirection((prev) => (prev === "right" ? "left" : "right"));
        }}
        style={{
          scaleX: direction === "left" ? -1 : 1,
          transformOrigin: "center center",
        }}
      >
        <CatSprite walking={true} />
      </motion.div>
    </div>
  );
}

/**
 * Cat Vector Sprite with gait walk cycle, tail sway, bobbing head, and blinking eyes
 */
function CatSprite({ walking }: { walking: boolean }) {
  return (
    <svg
      width="56"
      height="38"
      viewBox="0 0 56 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id="walk-cat-terracotta" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0654F" />
          <stop offset="100%" stopColor="#C65D3B" />
        </linearGradient>
        <linearGradient id="walk-cat-teal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5FA5B9" />
          <stop offset="100%" stopColor="#4A90A4" />
        </linearGradient>
        <linearGradient id="walk-cat-mustard" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5CD63" />
          <stop offset="100%" stopColor="#E8B84B" />
        </linearGradient>
      </defs>

      {/* Subtle Ground Shadow beneath cat */}
      <ellipse cx="26" cy="36" rx="18" ry="2" fill="#1F1B18" opacity="0.08" />

      {/* 1. Tail with Natural Swaying Motion */}
      <motion.g
        animate={
          walking
            ? {
                rotate: [-8, 12, -8],
                y: [0, -1, 0],
              }
            : {}
        }
        transition={{
          duration: 0.7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "8px 22px" }}
      >
        {/* Tail Base (Terracotta) */}
        <path
          d="M8 22 C4 20, 2 12, 5 7 C6.5 4, 9 5, 8.5 8 C7.5 12, 9 17, 12 21 Z"
          fill="url(#walk-cat-terracotta)"
          stroke="#1F1B18"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Tail Teal Calico Stripe */}
        <path
          d="M5 14 C4 11, 4.5 9, 6 8 C6.8 9.5, 6.5 12, 7.5 13.5 Z"
          fill="url(#walk-cat-teal)"
        />
        {/* Tail Mustard Tip */}
        <path
          d="M5 7 C6.5 4, 9 5, 8.5 8 C7.5 9, 6 8.5, 5 7 Z"
          fill="url(#walk-cat-mustard)"
        />
      </motion.g>

      {/* 2. Back Left Leg (Far Side) */}
      <motion.g
        animate={
          walking
            ? {
                rotate: [-24, 24, -24],
              }
            : {}
        }
        transition={{
          duration: 0.45,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "14px 25px" }}
      >
        <path
          d="M13 25 C12 29, 11 32, 11 35 C11 36.5, 14 36.5, 14.5 35 C15.5 32, 16 29, 16 26 Z"
          fill="#A34530"
          stroke="#1F1B18"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Paws white sock */}
        <path d="M11 34 C11 36.5, 14 36.5, 14.5 35 L14.5 33 L11.5 33 Z" fill="#FAF6F1" />
      </motion.g>

      {/* 3. Front Left Leg (Far Side) */}
      <motion.g
        animate={
          walking
            ? {
                rotate: [24, -24, 24],
              }
            : {}
        }
        transition={{
          duration: 0.45,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "33px 25px" }}
      >
        <path
          d="M32 25 C31 29, 30 32, 30 35 C30 36.5, 33 36.5, 33.5 35 C34.5 32, 35 29, 35 26 Z"
          fill="#A34530"
          stroke="#1F1B18"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Paws white sock */}
        <path d="M30 34 C30 36.5, 33 36.5, 33.5 35 L33.5 33 L30.5 33 Z" fill="#FAF6F1" />
      </motion.g>

      {/* 4. Main Body with Subtle Bobbing Motion */}
      <motion.g
        animate={
          walking
            ? {
                y: [0, -1.2, 0],
              }
            : {}
        }
        transition={{
          duration: 0.225,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Body Torso */}
        <path
          d="M11 22 C10 16, 17 14, 26 14 C35 14, 40 18, 38 24 C36 28, 28 29, 19 28 C14 27, 11 25, 11 22 Z"
          fill="url(#walk-cat-terracotta)"
          stroke="#1F1B18"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Calico Back Spot (Teal) */}
        <path
          d="M18 14 C21 14, 23 17, 21 20 C18 20, 16 17, 18 14 Z"
          fill="url(#walk-cat-teal)"
        />

        {/* Calico Back Spot (Mustard) */}
        <ellipse cx="27" cy="17" rx="3" ry="2" fill="url(#walk-cat-mustard)" />

        {/* Cream Belly Patch */}
        <path
          d="M16 27 C20 28, 28 28, 32 26 C30 24, 22 23, 17 25 Z"
          fill="#FAF6F1"
        />

        {/* 5. Back Right Leg (Near Side) */}
        <motion.g
          animate={
            walking
              ? {
                  rotate: [24, -24, 24],
                }
              : {}
          }
          transition={{
            duration: 0.45,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "17px 25px" }}
        >
          <path
            d="M15 24 C14 28, 13 32, 13 35.5 C13 37, 16.5 37, 17 35.5 C18 32, 19 28, 19 25 Z"
            fill="url(#walk-cat-terracotta)"
            stroke="#1F1B18"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Paw White Sock */}
          <path d="M13 34.5 C13 37, 16.5 37, 17 35.5 L17 33.5 L13 33.5 Z" fill="#FAF6F1" stroke="#1F1B18" strokeWidth="0.8" />
        </motion.g>

        {/* 6. Front Right Leg (Near Side) */}
        <motion.g
          animate={
            walking
              ? {
                  rotate: [-24, 24, -24],
                }
              : {}
          }
          transition={{
            duration: 0.45,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "36px 25px" }}
        >
          <path
            d="M34 24 C33 28, 32 32, 32 35.5 C32 37, 35.5 37, 36 35.5 C37 32, 38 28, 38 25 Z"
            fill="url(#walk-cat-terracotta)"
            stroke="#1F1B18"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Paw White Sock */}
          <path d="M32 34.5 C32 37, 35.5 37, 36 35.5 L36 33.5 L32 33.5 Z" fill="#FAF6F1" stroke="#1F1B18" strokeWidth="0.8" />
        </motion.g>

        {/* 7. Cute Round Head with Bobbing & Blinking */}
        <g id="walk-cat-head">
          {/* Left Ear */}
          <path
            d="M34 11 L32 3 L39 7 Z"
            fill="url(#walk-cat-terracotta)"
            stroke="#1F1B18"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M34 9 L33.5 5 L37 7.5 Z" fill="#F4E4DD" />

          {/* Right Ear (Teal Accent) */}
          <path
            d="M44 11 L48 3 L43 7 Z"
            fill="url(#walk-cat-teal)"
            stroke="#1F1B18"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M44 9 L46.5 5 L43.5 7.5 Z" fill="#F4E4DD" />

          {/* Head Contour */}
          <circle
            cx="40"
            cy="15"
            r="10"
            fill="url(#walk-cat-terracotta)"
            stroke="#1F1B18"
            strokeWidth="1.2"
          />

          {/* Calico Forehead Spot (Teal) */}
          <path
            d="M41 5.5 C45 6.5, 48 9, 48 13 C45 13, 43 9, 41 5.5 Z"
            fill="url(#walk-cat-teal)"
          />

          {/* Calico Cheek Spot (Mustard) */}
          <circle cx="34" cy="18" r="2.5" fill="url(#walk-cat-mustard)" />

          {/* Cream Snout */}
          <ellipse cx="43" cy="18" rx="4.5" ry="3.2" fill="#FAF6F1" />

          {/* Tiny Terracotta Nose & Cat Mouth */}
          <polygon points="43.5,16.8 45,16.8 44.2,17.6" fill="#C65D3B" />
          <path
            d="M43 18.2 Q44.2 19 44.2 17.8 Q44.2 19 45.4 18.2"
            fill="none"
            stroke="#1F1B18"
            strokeWidth="0.8"
            strokeLinecap="round"
          />

          {/* Cute Whiskers */}
          <line x1="46" y1="17.5" x2="52" y2="16.5" stroke="#1F1B18" strokeWidth="0.7" strokeLinecap="round" />
          <line x1="46" y1="19" x2="52" y2="19.5" stroke="#1F1B18" strokeWidth="0.7" strokeLinecap="round" />
          <line x1="36" y1="17.5" x2="31" y2="16.5" stroke="#1F1B18" strokeWidth="0.7" strokeLinecap="round" />
          <line x1="36" y1="19" x2="31" y2="19.5" stroke="#1F1B18" strokeWidth="0.7" strokeLinecap="round" />

          {/* Cute Cat Eyes with Blink Animation */}
          <motion.g
            animate={
              walking
                ? {
                    scaleY: [1, 1, 0.1, 1, 1],
                  }
                : {}
            }
            transition={{
              duration: 3.5,
              repeat: Infinity,
              times: [0, 0.9, 0.94, 0.98, 1],
            }}
            style={{ transformOrigin: "41px 14px" }}
          >
            {/* Left Eye */}
            <circle cx="37.5" cy="14" r="1.8" fill="#1F1B18" />
            <circle cx="37" cy="13.5" r="0.6" fill="#FFFFFF" />

            {/* Right Eye */}
            <circle cx="44.5" cy="14" r="1.8" fill="#1F1B18" />
            <circle cx="44" cy="13.5" r="0.6" fill="#FFFFFF" />
          </motion.g>

          {/* Yellow Mustard Collar & Golden Charm */}
          <path d="M33 22 Q39 25 46 22" stroke="#E8B84B" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="39.5" cy="24" r="1.6" fill="#E8B84B" stroke="#1F1B18" strokeWidth="0.6" />
        </g>
      </motion.g>
    </svg>
  );
}

export default WalkingCat;
