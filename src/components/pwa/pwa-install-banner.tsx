"use client";

import React, { useState, useEffect } from "react";
import { usePwa } from "./pwa-provider";
import {
  Download,
  Smartphone,
  Share2,
  PlusSquare,
  X,
  Sparkles,
  CheckCircle2,
  Laptop,
  QrCode,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export function PwaInstallBanner() {
  const { canInstall, isInstalled, isIos, promptInstall, showIosModal, closeIosModal } = usePwa();
  const [dismissed, setDismissed] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileUrl, setMobileUrl] = useState("http://192.168.1.4:3000");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : "";
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        setMobileUrl(`http://192.168.1.4${port}`);
      } else {
        setMobileUrl(window.location.origin);
      }
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("velqora_pwa_dismissed", "true");
  };

  const handleInstallClick = async () => {
    await promptInstall();
  };

  const handleCopyMobileUrl = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    toast.success("Alamat link HP disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  // QR Code URL using high-quality clean SVG/PNG QR generator
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    mobileUrl
  )}&bgcolor=000000&color=2997ff&margin=10`;

  return (
    <>
      {/* 1. Floating Installation Banner */}
      {!dismissed && !isInstalled && (
        <div className="fixed bottom-5 left-3 right-3 sm:left-auto sm:right-5 z-40 max-w-sm sm:w-96 bg-surface/95 border border-brand-500/40 rounded-3xl p-4 shadow-2xl backdrop-blur-xl animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-black border border-border p-2 flex items-center justify-center shrink-0 shadow-inner">
                <div className="relative w-full h-full">
                  <Image
                    src="/logo.svg"
                    alt="Velqora Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-text-primary truncate">
                    Instal Aplikasi Velqora
                  </h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-400">
                    PWA
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary mt-0.5 leading-tight">
                  Akses langsung dari layar utama HP / Laptop tanpa ribet.
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-border">
            <button
              onClick={handleInstallClick}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instal Sekarang</span>
            </button>

            <button
              onClick={() => setShowQrModal(true)}
              className="px-2.5 py-2 rounded-xl text-xs font-medium bg-surface-secondary hover:bg-surface-tertiary text-text-primary border border-border transition-colors flex items-center gap-1"
              title="Buka di HP via QR Code"
            >
              <QrCode className="w-3.5 h-3.5 text-brand-400" />
              <span className="hidden sm:inline">Di HP</span>
            </button>

            <button
              onClick={handleDismiss}
              className="px-2.5 py-2 rounded-xl text-xs font-medium text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors"
            >
              Nanti
            </button>
          </div>
        </div>
      )}

      {/* 2. QR Code Scanner Modal (Instal Langsung di HP) */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface border border-border rounded-3xl p-6 shadow-2xl space-y-5 animate-scale-up text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">
                    Buka & Instal di HP Anda
                  </h3>
                  <p className="text-[11px] text-text-tertiary">
                    Scan QR Code dengan kamera HP
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowQrModal(false)}
                className="p-1.5 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-black border border-white/[0.1] shadow-inner space-y-3">
              <div className="p-3 bg-white rounded-2xl shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeUrl}
                  alt="QR Code Buka di HP"
                  className="w-48 h-48 rounded-lg"
                />
              </div>

              <p className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                <span>Alamat HP:</span>
                <strong className="text-brand-400">{mobileUrl}</strong>
              </p>
            </div>

            {/* Step by step */}
            <div className="text-left text-xs space-y-2 p-3.5 rounded-2xl bg-surface-secondary border border-border">
              <p className="font-bold text-text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Petunjuk 3 Detik:</span>
              </p>
              <ol className="text-text-secondary text-[11px] space-y-1 list-decimal list-inside">
                <li>Pastikan HP terhubung ke Wi-Fi yang sama.</li>
                <li>Arahkan kamera HP ke QR Code di atas.</li>
                <li>Ketuk link yang muncul, lalu tekan <strong>&quot;Instal Aplikasi&quot;</strong>.</li>
              </ol>
            </div>

            {/* Copy Link Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMobileUrl}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-surface-secondary hover:bg-surface-tertiary border border-border text-xs font-semibold text-text-primary transition-all active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>Salin Link HP</span>
              </button>

              <button
                onClick={() => setShowQrModal(false)}
                className="py-2.5 px-5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. iOS Add to Home Screen Instructional Modal */}
      {showIosModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={closeIosModal}
        >
          <div
            className="w-full max-w-sm bg-surface border border-border rounded-3xl p-6 shadow-2xl space-y-4 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">
                    Instal di iPhone / iPad
                  </h3>
                  <p className="text-[11px] text-text-tertiary">
                    Tambahkan Velqora ke Layar Utama
                  </p>
                </div>
              </div>

              <button
                onClick={closeIosModal}
                className="p-1.5 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 pt-2 text-xs text-text-secondary">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-secondary border border-border">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-text-primary flex items-center gap-1.5">
                    <span>Tekan tombol Bagikan</span>
                    <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  </p>
                  <p className="text-[11px] text-text-tertiary">
                    Ketuk ikon bagikan di bilah menu bawah browser Safari Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-secondary border border-border">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-text-primary flex items-center gap-1.5">
                    <span>Pilih &quot;Tambah ke Layar Utama&quot;</span>
                    <PlusSquare className="w-3.5 h-3.5 text-emerald-400" />
                  </p>
                  <p className="text-[11px] text-text-tertiary">
                    Gulir ke bawah dan ketuk &quot;Add to Home Screen&quot;.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={closeIosModal}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-all"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
