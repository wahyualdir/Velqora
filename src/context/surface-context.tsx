"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export type SurfaceType = "web" | "app";

export interface SurfaceContextValue {
  surface: SurfaceType;
  isWeb: boolean;
  isApp: boolean;
  isMounted: boolean;
  setSurface: (surface: SurfaceType) => void;
  toggleSurface: () => void;
}

export function detectSurface(): SurfaceType {
  if (typeof window === "undefined") return "web";

  const isStandaloneMatch = window.matchMedia("(display-mode: standalone)").matches;
  const isNavigatorStandalone = (window.navigator as unknown as { standalone?: boolean })?.standalone === true;
  const isDocumentReferrerPwa = document.referrer.includes("android-app://");

  return isStandaloneMatch || isNavigatorStandalone || isDocumentReferrerPwa ? "app" : "web";
}

const defaultSurfaceContext: SurfaceContextValue = {
  surface: "web",
  isWeb: true,
  isApp: false,
  isMounted: false,
  setSurface: () => {},
  toggleSurface: () => {},
};

const SurfaceContext = createContext<SurfaceContextValue>(defaultSurfaceContext);

export function SurfaceProvider({ children }: { children: React.ReactNode }) {
  const [surface, setSurfaceState] = useState<SurfaceType>("web");
  const [isMounted, setIsMounted] = useState(false);

  // Synchronize with DOM & system media query
  useEffect(() => {
    setIsMounted(true);

    const initial = detectSurface();
    setSurfaceState(initial);
    document.documentElement.dataset.surface = initial;
    document.documentElement.setAttribute("data-surface", initial);

    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      const nextSurface: SurfaceType = e.matches ? "app" : "web";
      setSurfaceState(nextSurface);
      document.documentElement.dataset.surface = nextSurface;
      document.documentElement.setAttribute("data-surface", nextSurface);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleDisplayModeChange);
    } else {
      mediaQuery.addListener(handleDisplayModeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleDisplayModeChange);
      } else {
        mediaQuery.removeListener(handleDisplayModeChange);
      }
    };
  }, []);

  const setSurface = useCallback((next: SurfaceType) => {
    setSurfaceState(next);
    if (typeof document !== "undefined") {
      document.documentElement.dataset.surface = next;
      document.documentElement.setAttribute("data-surface", next);
    }
  }, []);

  const toggleSurface = useCallback(() => {
    setSurfaceState((prev) => {
      const next = prev === "web" ? "app" : "web";
      if (typeof document !== "undefined") {
        document.documentElement.dataset.surface = next;
        document.documentElement.setAttribute("data-surface", next);
      }
      return next;
    });
  }, []);

  const value = useMemo<SurfaceContextValue>(
    () => ({
      surface,
      isWeb: surface === "web",
      isApp: surface === "app",
      isMounted,
      setSurface,
      toggleSurface,
    }),
    [surface, isMounted, setSurface, toggleSurface]
  );

  return (
    <SurfaceContext.Provider value={value}>{children}</SurfaceContext.Provider>
  );
}

export function useSurface(): SurfaceContextValue {
  return useContext(SurfaceContext);
}
