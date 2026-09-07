"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

// 4-frame walk cycle for Sulley (stride, pass, stride, pass)
const SULLEY_WALK_FRAMES = [
  "/sprites/monsters/sulley_walk_1.png",
  "/sprites/monsters/sulley_walk_2.png",
  "/sprites/monsters/sulley_walk_3.png",
  "/sprites/monsters/sulley_walk_4.png",
];

// Eye blinking frames for Mike
const MIKE_FRAMES = {
  open: "/sprites/monsters/mike_open.png",
  half: "/sprites/monsters/mike_half.png",
  closed: "/sprites/monsters/mike_closed.png",
};

// Welcoming academic & Monsters Inc. greetings
const ROTATING_GREETINGS = [
  "Halo! Selamat datang di Velqora 👋",
  "Siap belajar & jelajahi materi? ✨",
  "Sulley lagi patroli, ayo masuk! 🏢",
  "Semangat belajarnya hari ini! 🎓",
  "Akses modul & kuis AI-mu di sini 📚",
];

interface MonsterCompanionProps {
  className?: string;
  focusedField?: string | null;
  loading?: boolean;
}

export function MonsterCompanion({
  className = "",
  focusedField = null,
  loading = false,
}: MonsterCompanionProps) {
  const [mounted, setMounted] = useState(false);
  const [direction, setDirection] = useState<"right" | "left">("right");
  const [trackWidth, setTrackWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Mike's state (Stationary greeting monster)
  const [mikeBlinkState, setMikeBlinkState] = useState<"open" | "half" | "closed">("open");
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isMikeCheering, setIsMikeCheering] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Measure track container width
  useEffect(() => {
    if (!mounted || !trackRef.current) return;

    const measure = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.offsetWidth);
      }
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(trackRef.current);

    return () => resizeObserver.disconnect();
  }, [mounted]);

  // Mike's periodic natural eye blinking effect (every 2.5 - 4.5 seconds)
  useEffect(() => {
    // If user is typing password, Mike covers/closes his eye!
    if (focusedField === "password") {
      setMikeBlinkState("closed");
      return;
    }

    let blinkTimeout: NodeJS.Timeout;
    let blinkTimer: NodeJS.Timeout;

    const triggerBlink = () => {
      // Half -> Closed -> Half -> Open
      setMikeBlinkState("half");
      blinkTimeout = setTimeout(() => {
        setMikeBlinkState("closed");
        blinkTimeout = setTimeout(() => {
          setMikeBlinkState("half");
          blinkTimeout = setTimeout(() => {
            setMikeBlinkState("open");
            // Schedule next blink
            const nextInterval = 2400 + Math.random() * 2600;
            blinkTimer = setTimeout(triggerBlink, nextInterval);
          }, 60);
        }, 130);
      }, 60);
    };

    blinkTimer = setTimeout(triggerBlink, 2200);

    return () => {
      clearTimeout(blinkTimer);
      clearTimeout(blinkTimeout);
    };
  }, [focusedField]);

  // Rotate greeting messages periodically
  useEffect(() => {
    if (focusedField || loading) return;

    const interval = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % ROTATING_GREETINGS.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [focusedField, loading]);

  // Interactive click on Mike
  const handleMikeClick = () => {
    setIsMikeCheering(true);
    setGreetingIndex((prev) => (prev + 1) % ROTATING_GREETINGS.length);
    setTimeout(() => setIsMikeCheering(false), 500);
  };

  // Determine speech bubble text based on interaction state
  let currentSpeech = ROTATING_GREETINGS[greetingIndex];
  if (loading) {
    currentSpeech = "Memverifikasi akunmu... ⚙️";
  } else if (focusedField === "email") {
    currentSpeech = "Ketik email akunmu di sini ✉️";
  } else if (focusedField === "password") {
    currentSpeech = "Ssst! Mataku tertutup, aman 🙈";
  }

  // Sulley width ~42px, Mike zone ~56px, safety buffer ~16px
  const sulleyWidth = 42;
  const mikeZoneWidth = 56;
  const maxTravel = Math.max(trackWidth - sulleyWidth - mikeZoneWidth - 16, 0);

  return (
    <div
      ref={trackRef}
      className={`relative w-full h-[88px] overflow-hidden select-none border-t border-[#7A756D]/20 dark:border-zinc-800/60 mt-2 bg-gradient-to-b from-transparent to-[#000000]/[0.03] dark:to-[#FFFFFF]/[0.02] ${className}`}
    >
      {/* 💬 RETRO SPEECH BUBBLE (Above Mike, completely clear of Sulley's lane) */}
      <div className="absolute top-1.5 right-2 z-20 flex flex-col items-end pointer-events-none">
        <div className="relative bg-[#FFFFFF] dark:bg-[#18181B] text-[#1C1917] dark:text-zinc-200 border border-[#7A756D]/40 dark:border-zinc-700 px-2.5 py-0.5 rounded shadow-xs text-[10.5px] font-mono leading-tight max-w-[210px] truncate animate-fade-in">
          <span>{currentSpeech}</span>
          {/* Arrow pointer facing down towards Mike */}
          <div className="absolute -bottom-1 right-3.5 w-1.5 h-1.5 bg-[#FFFFFF] dark:bg-[#18181B] border-r border-b border-[#7A756D]/40 dark:border-zinc-700 transform rotate-45" />
        </div>
      </div>

      {/* 🐾 WALKING SULLEY (Effect Jalan Maju & Langkah Luwes) */}
      {mounted && !shouldReduceMotion && trackWidth > 0 && maxTravel > 0 && (
        <motion.div
          className="absolute bottom-1.5 left-2 will-change-transform z-10 cursor-pointer"
          initial={{ x: 0 }}
          animate={{
            x: direction === "right" ? [0, maxTravel] : [maxTravel, 0],
          }}
          transition={{
            duration: 4.8, // Fluid walking speed across floor
            ease: "linear",
          }}
          onAnimationComplete={() => {
            setDirection((prev) => (prev === "right" ? "left" : "right"));
          }}
          style={{
            // Sulley's base sprite faces LEFT (tail on right).
            // When walking RIGHT: flip to -1 so he leads with his face & eyes!
            // When walking LEFT: normal 1 so he leads with his face & eyes!
            scaleX: direction === "right" ? -1 : 1,
            transformOrigin: "center center",
          }}
          title="Sulley sedang berpatroli!"
        >
          <WalkingSulleySprite walking={true} />
        </motion.div>
      )}

      {/* Accessible fallback: Static Sulley */}
      {(!mounted || shouldReduceMotion || trackWidth === 0 || maxTravel === 0) && (
        <div className="absolute bottom-1.5 left-4 z-10">
          <WalkingSulleySprite walking={false} />
        </div>
      )}

      {/* 👁️ STATIONARY MIKE WAZOWSKI (Menyapa & Mata Berkedip - Diam Bukan Berjalan) */}
      <div className="absolute bottom-1.5 right-2.5 z-20">
        <motion.button
          type="button"
          onClick={handleMikeClick}
          animate={isMikeCheering ? { y: [-6, 0, -3, 0] } : { y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative group cursor-pointer focus:outline-hidden block"
          title="Klik Mike untuk menyapa!"
          aria-label="Mike Wazowski Greeting"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={MIKE_FRAMES[mikeBlinkState]}
            alt="Mike Wazowski"
            width={44}
            height={48}
            className="w-[40px] h-[44px] object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] pointer-events-none transition-transform group-hover:scale-105"
            style={{ imageRendering: "pixelated" }}
            draggable={false}
          />

          {/* Greeting wave sparkle on hover */}
          <span className="absolute -top-1 -right-1 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">
            👋
          </span>
        </motion.button>
      </div>

      {/* Ground floor line */}
      <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-[#7A756D]/20 dark:bg-zinc-800" />
    </div>
  );
}

/**
 * Animated Walking Sulley Sprite
 * Adds step bobbing, weight shift swaying, and synchronized frame cycling
 */
function WalkingSulleySprite({ walking }: { walking: boolean }) {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    if (!walking) {
      setCurrentFrame(0);
      return;
    }

    // 130ms per step pose for a lively, rhythmic stride
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % SULLEY_WALK_FRAMES.length);
    }, 130);

    return () => clearInterval(interval);
  }, [walking]);

  return (
    <motion.div
      animate={
        walking
          ? {
              // Rhythmic monster step bobbing (up & down with footfalls)
              y: [0, -3.5, 0, -3.5, 0],
              // Subtle weight sway between left and right foot
              rotate: [-2, 2, -2, 2, -2],
            }
          : { y: 0, rotate: 0 }
      }
      transition={{
        duration: 0.52, // 4 frames * 130ms = 520ms full stride cycle
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative w-[40px] h-[52px] flex items-center justify-center"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SULLEY_WALK_FRAMES[currentFrame]}
        alt="Walking Sulley"
        width={40}
        height={52}
        className="w-[38px] h-[50px] object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)] pointer-events-none select-none"
        style={{ imageRendering: "pixelated" }}
        draggable={false}
      />
    </motion.div>
  );
}

export default MonsterCompanion;
