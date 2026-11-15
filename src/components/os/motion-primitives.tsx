"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

export const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

export const SPRING_GENTLE = {
  type: "spring",
  stiffness: 280,
  damping: 28,
  mass: 0.85,
} as const;

export const SPRING_SNAPPY = {
  type: "spring",
  stiffness: 420,
  damping: 32,
} as const;

export const VIEWPORT_ONCE = {
  once: true,
  amount: 0.12,
} as const;

export function VelqoraMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function ScrollProgressBar({ className = "" }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className={`h-[2.5px] bg-gradient-to-r from-[#C2553A] to-[#D4664A] origin-left ${className}`}
    />
  );
}

export function EditorialEyebrow({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <span className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase text-[#C2553A] dark:text-[#D4664A]">
        {index}
      </span>
      <span className="w-5 h-px bg-[#D4664A]/55 shrink-0" aria-hidden="true" />
      <span className="font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-[#6B6560] dark:text-[#8C857F]">
        {label}
      </span>
    </div>
  );
}

interface CountUpNumberProps {
  value: number;
  formatLocale?: boolean;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function CountUpNumber({
  value,
  formatLocale = false,
  suffix = "",
  duration = 0.9,
  className = "",
}: CountUpNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const prefersReduced = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<number>(value);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayValue(value);
      return;
    }
    if (!isInView || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const startValue = value > 20 ? Math.floor(value * 0.35) : 0;
    const controls = animate(startValue, value, {
      duration,
      ease: EASE_SMOOTH,
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, value, duration, prefersReduced]);

  const formatted = formatLocale
    ? displayValue.toLocaleString("id-ID")
    : String(displayValue);

  return (
    <span ref={ref} className={className}>
      {formatted}
      {suffix}
    </span>
  );
}

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export function RevealSection({
  children,
  className = "",
  delay = 0,
  yOffset = 18,
}: RevealSectionProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.55, delay, ease: EASE_SMOOTH }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.06,
  delayChildren = 0.04,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: prefersReduced ? 0 : 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: EASE_SMOOTH },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedProgressBarProps {
  percent: number;
  barClassName?: string;
  trackClassName?: string;
  delay?: number;
}

export function AnimatedProgressBar({
  percent,
  barClassName = "bg-[#C2553A]",
  trackClassName = "bg-[#E8E0D7] dark:bg-zinc-800",
  delay = 0.15,
}: AnimatedProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className={`w-full h-2 rounded-full overflow-hidden ${trackClassName}`}>
      <motion.div
        initial={{ width: "0%" }}
        whileInView={{ width: `${clamped}%` }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay, ease: EASE_SMOOTH }}
        className={`h-full rounded-full ${barClassName}`}
      />
    </div>
  );
}
