"use client";

import React from "react";
import { useExperience } from "@/context/experience-context";

interface ExperienceAdaptiveProps {
  desktop: React.ReactNode;
  tablet?: React.ReactNode;
  mobile: React.ReactNode;
}

/**
 * Declarative component that renders distinct presentation branches
 * based on the active experience mode (Desktop, Tablet, Mobile).
 */
export function ExperienceAdaptive({
  desktop,
  tablet,
  mobile,
}: ExperienceAdaptiveProps) {
  const { experience, isMounted } = useExperience();

  // If not mounted yet (SSR), render desktop by default to ensure SEO & server markup
  if (!isMounted) {
    return <>{desktop}</>;
  }

  if (experience === "mobile") {
    return <>{mobile}</>;
  }

  if (experience === "tablet") {
    return <>{tablet ?? desktop}</>;
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
