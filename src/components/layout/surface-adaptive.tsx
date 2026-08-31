"use client";

import React from "react";
import { useSurface } from "@/context/surface-context";

export interface SurfaceAdaptiveProps {
  web: React.ReactNode;
  app: React.ReactNode;
}

/**
 * Declarative component that renders distinct presentation branches
 * based on product identity (Surface):
 * - web: Browser workspace (uninstalled, any screen width)
 * - app: Installed PWA (display-mode: standalone)
 */
export function SurfaceAdaptive({ web, app }: SurfaceAdaptiveProps) {
  const { surface, isMounted } = useSurface();

  // If not mounted yet (SSR / initial hydration), render web by default
  if (!isMounted) {
    return <>{web}</>;
  }

  if (surface === "app") {
    return <>{app}</>;
  }

  return <>{web}</>;
}

export function WebOnly({ children }: { children: React.ReactNode }) {
  const { isWeb, isMounted } = useSurface();
  if (!isMounted) return <>{children}</>;
  if (!isWeb) return null;
  return <>{children}</>;
}

export function AppOnly({ children }: { children: React.ReactNode }) {
  const { isApp, isMounted } = useSurface();
  if (!isMounted) return null;
  if (!isApp) return null;
  return <>{children}</>;
}
