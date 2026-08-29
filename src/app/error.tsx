"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TechBackground } from "@/components/ui/tech-background";
import { Logo } from "@/components/ui/logo";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary caught error:", error);
  }, [error]);

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-hidden">
      <TechBackground variant="subtle" />
      <div className="fixed inset-0 pointer-events-none dark:bg-black/35 bg-transparent -z-[5]" />

      <div className="relative z-10 max-w-md w-full space-y-6 animate-fade-in">
        <div className="flex justify-center mb-1">
          <Logo variant="navbar" />
        </div>

        <Card className="p-6 sm:p-8 rounded-2xl bg-surface/90 backdrop-blur-xl border border-border shadow-xl space-y-5">
          <div className="inline-flex p-3.5 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-500 mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-block px-2 py-0.5 rounded-md bg-surface-secondary border border-border text-[10.5px] font-mono font-semibold text-text-tertiary">
              RUNTIME // ERROR
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-text-primary font-display">
              Terjadi Kendala Teknis
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto">
              {error?.message ||
                "Terjadi kendala saat memproses permintaan ini. Silakan muat ulang halaman atau kembali ke dashboard."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <Button
              onClick={() => reset()}
              className="flex-1 gap-2 text-xs font-semibold py-2.5"
            >
              <RefreshCw className="w-4 h-4" /> Coba Lagi
            </Button>
            <Link href="/dashboard" className="flex-1">
              <Button
                variant="outline"
                className="w-full gap-2 text-xs font-semibold py-2.5 border-border text-text-primary hover:bg-surface-secondary"
              >
                <Home className="w-4 h-4" /> Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
