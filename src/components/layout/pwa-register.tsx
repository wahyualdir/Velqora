"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaRegister() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/daftar" ||
    pathname === "/reset-password";

  useEffect(() => {
    // 1. Register Service Worker safely
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then(() => {
            // Service worker successfully registered
          })
          .catch(() => {
            // Ignore SW register errors in dev
          });
      });
    }

    // 2. Handle PWA Install Prompt with persistent dismiss state
    const isDismissed =
      typeof window !== "undefined"
        ? localStorage.getItem("pwa_install_dismissed") === "true"
        : false;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!isDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    setShowPrompt(false);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("pwa_install_dismissed", "true");
    }
  };

  if (!showPrompt || isAuthPage) return null;

  return (
    <div
      role="region"
      aria-label="Instalasi Aplikasi Velqora"
      className="fixed bottom-20 md:bottom-6 right-4 z-50 max-w-sm w-[calc(100vw-2rem)] p-3.5 rounded-xl border border-brand-500/30 bg-surface/95 backdrop-blur-md shadow-2xl animate-fade-in flex items-center justify-between gap-3 text-text-primary"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shrink-0">
          <Download className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold leading-tight font-display truncate">
            Pasang Aplikasi Velqora
          </p>
          <p className="text-[11px] text-text-secondary leading-snug truncate">
            Akses cepat langsung dari layar utama.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          size="sm"
          onClick={handleInstallClick}
          className="text-xs font-semibold h-8 px-2.5 shadow-xs"
        >
          Instal
        </Button>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Tutup pemberitahuan instalasi"
          className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
