"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightweight, zero-dependency scroll-reveal hook using IntersectionObserver.
 * Automatically respects `prefers-reduced-motion`.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options: {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
} = {}) {
  const { threshold = 0.15, rootMargin = "0px 0px -50px 0px", delay = 0 } = options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Accessibility: instant reveal if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            const timer = setTimeout(() => setIsVisible(true), delay);
            return () => clearTimeout(timer);
          }
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, delay]);

  return { ref, isVisible };
}

/**
 * Smooth count-up hook for numbers when scrolled into view.
 */
export function useCountUp(target: number, durationMs = 1200, isVisible = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }

    let start = 0;
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Natural ease-out quad curve
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(easedProgress * target);

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    const frameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(frameId);
  }, [target, durationMs, isVisible]);

  return count;
}
