"use client";

import React from "react";
import { useExperience } from "@/context/experience-context";
import { useSurface } from "@/context/surface-context";

export { SurfaceAdaptive, WebOnly, AppOnly } from "./surface-adaptive";
export type { SurfaceAdaptiveProps } from "./surface-adaptive";

interface ExperienceAdaptiveProps {
  desktop: React.ReactNode;
  tablet?: React.ReactNode;
  mobile: React.ReactNode;
}

/**
 * Declarative component that renders distinct presentation branches.
 * Reconciled in Phase 3:
 * - App Surface (installed PWA) -> mobile app presentation
 * - Web Surface (browser workspace) -> desktop / responsive web workspace
 */
export function ExperienceAdaptive({
  desktop,
  tablet,
  mobile,
}: ExperienceAdaptiveProps) {
  const { surface, isMounted: surfaceMounted } = useSurface();
  const { experience, isMounted: expMounted } = useExperience();
  const isMounted = surfaceMounted && expMounted;

  // If not mounted yet (SSR), render desktop/web by default to ensure SEO & server markup
  if (!isMounted) {
    return <>{desktop}</>;
  }

  // App surface (PWA standalone) always renders mobile app presentation
  if (surface === "app") {
    return <>{mobile}</>;
  }

  // Web surface (browser) renders desktop workspace (with tablet variant if available)
  if (experience === "tablet" && tablet) {
    return <>{tablet}</>;
  }

  return <>{desktop}</>;
}

export function DesktopOnly({ children }: { children: React.ReactNode }) {
  const { isDesktop, isMounted } = useExperience();
  if (!isMounted) return <>{children}</>;
  if (!isDesktop) return null;
  return <>{children}</>;
}

export function MobileOnly({ children }: { children: React.ReactNode }) {
  const { isMobile, isMounted } = useExperience();
  if (!isMounted) return null;
  if (!isMobile) return null;
  return <>{children}</>;
}

export function TabletOnly({ children }: { children: React.ReactNode }) {
  const { isTablet, isMounted } = useExperience();
  if (!isMounted) return null;
  if (!isTablet) return null;
  return <>{children}</>;
}
