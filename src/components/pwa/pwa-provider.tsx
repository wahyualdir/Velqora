"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

interface PwaContextType {
  canInstall: boolean;
  isInstalled: boolean;
  isIos: boolean;
  promptInstall: () => Promise<boolean>;
  openIosModal: () => void;
  closeIosModal: () => void;
  showIosModal: boolean;
}

const PwaContext = createContext<PwaContextType>({
  canInstall: false,
  isInstalled: false,
  isIos: false,
  promptInstall: async () => false,
  openIosModal: () => {},
  closeIosModal: () => {},
  showIosModal: false,
});

export function usePwa() {
  return useContext(PwaContext);
}

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("PWA: ServiceWorker registered successfully:", registration.scope);
          })
          .catch((err) => {
            console.warn("PWA: ServiceWorker registration failed:", err);
          });
      });
    }

    // 2. Check if already installed / standalone mode
    if (typeof window !== "undefined") {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone);

      // Check if iOS
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIos(isIosDevice);
    }

    // 3. Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast.success("Aplikasi Velqora berhasil diinstal di perangkat Anda!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Trigger Native Install Prompt
  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } else if (isIos) {
      setShowIosModal(true);
      return false;
    } else {
      toast.info(
        "Gunakan menu browser Anda (titik tiga ⋮) dan pilih 'Instal Aplikasi' atau 'Tambahkan ke Layar Utama'."
      );
      return false;
    }
  }, [deferredPrompt, isIos]);

  return (
    <PwaContext.Provider
      value={{
        canInstall: Boolean(deferredPrompt) || isIos,
        isInstalled,
        isIos,
        promptInstall,
        openIosModal: () => setShowIosModal(true),
        closeIosModal: () => setShowIosModal(false),
        showIosModal,
      }}
    >
      {children}
    </PwaContext.Provider>
  );
}
