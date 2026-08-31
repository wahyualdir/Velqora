"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Download, RefreshCw, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaRegister() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/daftar" ||
    pathname === "/reset-password";

  useEffect(() => {
    // 1. Register Service Worker and listen for background updates
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            // Check for updates periodically when user switches to tab / app
            const checkForUpdate = () => {
              if (document.visibilityState === "visible") {
                reg.update().catch(() => {});
              }
            };
            document.addEventListener("visibilitychange", checkForUpdate);

            // If a worker is already waiting (new version installed in background)
            if (reg.waiting) {
              setWaitingWorker(reg.waiting);
              setShowUpdatePrompt(true);
            }

            reg.addEventListener("updatefound", () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    setWaitingWorker(newWorker);
                    setShowUpdatePrompt(true);
                  }
                });
              }
            });
          })
          .catch(() => {
            // Ignore SW register errors in dev
          });
      });

      // Reload page once new service worker takes control
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    // 2. Persistent dismissal check
    const isDismissed =
      typeof window !== "undefined"
        ? localStorage.getItem("pwa_install_dismissed") === "true"
        : false;

    // 3. Handle PWA Install Prompt for Chromium / Desktop / Android
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!isDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. Handle iOS Safari manual instruction (beforeinstallprompt is not supported on iOS)
    if (typeof window !== "undefined" && !isDismissed) {
      const ua = window.navigator.userAgent.toLowerCase();
      const isIos =
        /iphone|ipad|ipod/.test(ua) ||
        (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        Boolean((window.navigator as unknown as { standalone?: boolean }).standalone);

      if (isIos && !isStandalone) {
        setShowIosPrompt(true);
      }
    }

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

  const handleUpdateClick = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    } else {
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIosPrompt(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("pwa_install_dismissed", "true");
    }
  };

  if (isAuthPage) return null;

  // 1. In-App Update Prompt (Highest priority when a new version/icon update is available)
  if (showUpdatePrompt) {
    return (
      <div
        role="region"
        aria-label="Pembaruan Aplikasi Velqora Tersedia"
        className="fixed bottom-20 md:bottom-6 right-4 z-50 max-w-sm w-[calc(100vw-2rem)] p-3.5 rounded-xl border border-brand-500/40 bg-surface/95 backdrop-blur-md shadow-2xl animate-fade-in flex items-center justify-between gap-3 text-text-primary"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-500 shrink-0">
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold leading-tight font-display truncate">
              Pembaruan Tersedia
            </p>
            <p className="text-[11px] text-text-secondary leading-snug truncate">
              Versi baru siap disinkronkan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="sm"
            onClick={handleUpdateClick}
            className="text-xs font-semibold h-8 px-2.5 shadow-xs bg-brand-600 hover:bg-brand-500 text-white cursor-pointer"
          >
            Perbarui
          </Button>
          <button
            type="button"
            onClick={() => setShowUpdatePrompt(false)}
            aria-label="Tutup pemberitahuan pembaruan"
            className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 2. iOS Safari specific manual installation guidance
  if (showIosPrompt && !showPrompt) {
    return (
      <div
        role="region"
        aria-label="Petunjuk Pemasangan Aplikasi Velqora di iOS"
        className="fixed bottom-20 md:bottom-6 right-4 z-50 max-w-sm w-[calc(100vw-2rem)] p-3.5 rounded-xl border border-brand-500/30 bg-surface/95 backdrop-blur-md shadow-2xl animate-fade-in flex items-center justify-between gap-3 text-text-primary"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shrink-0">
            <Share className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold leading-tight font-display truncate">
              Pasang di iPhone / iPad
            </p>
            <p className="text-[11px] text-text-secondary leading-snug">
              Ketuk tombol <span className="font-semibold text-text-primary">Share</span> lalu pilih <span className="font-semibold text-text-primary">&apos;Add to Home Screen&apos;</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Tutup petunjuk instalasi"
            className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!showPrompt) return null;

  // 3. Chromium / Android / Desktop Install Prompt
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
