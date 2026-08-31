/**
 * Velqora Experience Detection & Abstraction Layer
 * Defines contracts for Desktop Workspace (>=1024px), Tablet (768-1023px), and Mobile App (<768px).
 */

export type ExperienceType = "desktop" | "tablet" | "mobile";

export interface ExperienceState {
  experience: ExperienceType;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
  isTouchDevice: boolean;
  isPwaStandalone: boolean;
  isMounted: boolean;
  screenWidth: number;
  screenHeight: number;
}

export const BREAKPOINTS = {
  MOBILE_MAX: 767,
  TABLET_MIN: 768,
  TABLET_MAX: 1023,
  DESKTOP_MIN: 1024,
} as const;

/**
 * Pure function to determine experience type based on viewport width
 */
export function resolveExperienceType(width: number): ExperienceType {
  if (width < BREAKPOINTS.TABLET_MIN) {
    return "mobile";
  }
  if (width <= BREAKPOINTS.TABLET_MAX) {
    return "tablet";
  }
  return "desktop";
}

import { detectSurface } from "@/context/surface-context";

/**
 * Checks if running inside PWA standalone mode (delegates to detectSurface as single source of truth)
 */
export function checkIsPwaStandalone(): boolean {
  return detectSurface() === "app";
}

/**
 * Checks if the device has primary touch input
 */
export function checkIsTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
}
