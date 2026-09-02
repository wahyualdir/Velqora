"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const WALK_FRAMES = [
  "/cat/walk-frame-1.png",
  "/cat/walk-frame-2.png",
  "/cat/walk-frame-3.png",
  "/cat/walk-frame-4.png",
];

const SPRITE_WIDTH = 48;

interface WalkingCatProps {
  className?: string;
  speed?: number; // Duration in seconds for one full horizontal pass
}

/**
 * Walking Cat Component (Google Colab Easter Egg Style)
 * Walks back and forth across the bottom of the card using PNG walk-cycle frames.
 */
export function WalkingCat({ className = "", speed = 7 }: WalkingCatProps) {
  const [direction, setDirection] = useState<"right" | "left">("right");
  const [mounted, setMounted] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Measure the actual container width in pixels so the cat travels
  // the full distance instead of being stuck near its own size.
  // Depends on `mounted` because the ref is only attached after mount.
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

  if (!mounted) {
    return (
      <div className={`relative w-full h-11 overflow-hidden pointer-events-none select-none ${className}`}>
        <div className="absolute bottom-1 left-4 opacity-0">
          <CatSpriteImage walking={false} />
        </div>
      </div>
    );
  }

  if (shouldReduceMotion) {
    // Accessible fallback: Static cat at center
    return (
      <div className={`flex justify-center items-center py-1.5 pointer-events-none select-none ${className}`}>
        <CatSpriteImage walking={false} />
      </div>
    );
  }

  const maxTravel = Math.max(trackWidth - SPRITE_WIDTH, 0);

  return (
    <div
      ref={trackRef}
      className={`relative w-full h-11 overflow-hidden pointer-events-none select-none border-t border-border/40 pt-1.5 mt-2 ${className}`}
    >
      {/* Horizontal Walking Track with Ping-Pong (pixel-based, relative to container width) */}
      {trackWidth > 0 && (
        <motion.div
          className="absolute bottom-0.5 will-change-transform"
          initial={{ x: 0 }}
          animate={{
            x: direction === "right" ? [0, maxTravel] : [maxTravel, 0],
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
          <CatSpriteImage walking={true} />
        </motion.div>
      )}
    </div>
  );
}

/**
 * Animated Cat Sprite using 4-frame PNG walk cycle
 */
function CatSpriteImage({ walking }: { walking: boolean }) {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    if (!walking) {
      setCurrentFrame(0);
      return;
    }

    // 130ms per frame for smooth, natural walk gait
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % WALK_FRAMES.length);
    }, 130);

    return () => clearInterval(interval);
  }, [walking]);

  return (
    <div className="relative w-[48px] h-[38px] flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={WALK_FRAMES[currentFrame]}
        alt="Walking Cat"
        width={48}
        height={38}
        className="w-[48px] h-[38px] object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)] pointer-events-none select-none"
        draggable={false}
      />
    </div>
  );
}

export default WalkingCat;
