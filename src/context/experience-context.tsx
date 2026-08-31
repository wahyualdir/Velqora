"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  ExperienceType,
  ExperienceState,
  resolveExperienceType,
  checkIsPwaStandalone,
  checkIsTouchDevice,
} from "@/lib/experience";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface ExperienceContextValue extends ExperienceState {
  canInstallPwa: boolean;
  promptInstallPwa: () => Promise<boolean>;
  setManualExperienceOverride?: (exp: ExperienceType | null) => void;
}

const defaultExperienceState: ExperienceState = {
  experience: "desktop",
  isDesktop: true,
  isTablet: false,
  isMobile: false,
  isTouchDevice: false,
  isPwaStandalone: false,
  isMounted: false,
  screenWidth: 1280,
  screenHeight: 800,
};

const ExperienceContext = createContext<ExperienceContextValue>({
  ...defaultExperienceState,
  canInstallPwa: false,
  promptInstallPwa: async () => false,
});

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 1280,
    height: 800,
  });
  const [isTouch, setIsTouch] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    null
  );

  useEffect(() => {
    setMounted(true);

    const updateDimensions = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setDimensions({ width: w, height: h });
      setIsTouch(checkIsTouchDevice());
      setIsStandalone(checkIsPwaStandalone());
    };

    updateDimensions();

    window.addEventListener("resize", updateDimensions, { passive: true });
    window.addEventListener("orientationchange", updateDimensions, { passive: true });

    // PWA BeforeInstallPrompt listener
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // App installed listener
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("orientationchange", updateDimensions);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const experienceType = useMemo<ExperienceType>(() => {
    if (!mounted) return "desktop";
    return resolveExperienceType(dimensions.width);
  }, [mounted, dimensions.width]);

  const promptInstallPwa = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error triggering install prompt:", err);
      return false;
    }
  }, [deferredPrompt]);

  const value = useMemo<ExperienceContextValue>(
    () => ({
      experience: experienceType,
      isDesktop: experienceType === "desktop",
      isTablet: experienceType === "tablet",
      isMobile: experienceType === "mobile",
      isTouchDevice: isTouch,
      isPwaStandalone: isStandalone,
      isMounted: mounted,
      screenWidth: dimensions.width,
      screenHeight: dimensions.height,
      canInstallPwa: Boolean(deferredPrompt),
      promptInstallPwa,
    }),
    [
      experienceType,
      isTouch,
      isStandalone,
      mounted,
      dimensions.width,
      dimensions.height,
      deferredPrompt,
      promptInstallPwa,
    ]
  );

  return (
    <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>
  );
}

export function useExperience(): ExperienceContextValue {
  return useContext(ExperienceContext);
}
