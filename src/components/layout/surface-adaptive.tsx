"use client";

import React from "react";
import { useSurface } from "@/context/surface-context";

export interface SurfaceAdaptiveProps {
  web: React.ReactNode;
  app: React.ReactNode;
}

/**
 * Declarative component that renders distinct presentation branches:
 * - app: Installed PWA (display-mode: standalone) OR mobile/tablet viewports (< 1024px)
 * - web: Desktop workspace viewports (>= 1024px)
 */
export function SurfaceAdaptive({ web, app }: SurfaceAdaptiveProps) {
  const { surface } = useSurface();

  if (surface === "app") {
    return <>{app}</>;
  }

  return (
    <>
      <div className="block lg:hidden w-full">{app}</div>
      <div className="hidden lg:block w-full">{web}</div>
    </>
  );
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
