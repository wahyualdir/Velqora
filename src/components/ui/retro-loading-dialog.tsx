"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

export interface RetroLoadingDialogProps {
  isOpen: boolean;
  onComplete?: () => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
  durationMs?: number;
  totalBlocks?: number;
  className?: string;
}

const DEFAULT_STAGES = [
  { at: 0, text: "Memverifikasi kredensial akun..." },
  { at: 25, text: "Menginisialisasi sesi akademik 256-bit..." },
  { at: 55, text: "Sinkronisasi repositori modul & kuis..." },
  { at: 80, text: "Menyiapkan workspace Velqora..." },
  { at: 96, text: "Sesi siap. Mengalihkan ke dashboard..." },
];

export function RetroLoadingDialog({
  isOpen,
  onComplete,
  onCancel,
  title = "Loading...",
  subtitle,
  durationMs = 2200,
  totalBlocks = 20,
  className = "",
}: RetroLoadingDialogProps) {
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(DEFAULT_STAGES[0].text);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStatus(DEFAULT_STAGES[0].text);
      hasCompletedRef.current = false;
      startTimeRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const rawProgress = Math.min(100, (elapsed / durationMs) * 100);

      // Micro-fluctuation to give realistic vintage OS processing feel
      const easedProgress = Math.min(
        100,
        rawProgress < 40
          ? rawProgress * 1.15
          : rawProgress < 75
          ? 46 + (rawProgress - 40) * 0.95
          : 79 + (rawProgress - 75) * 0.84
      );

      setProgress(easedProgress);

      // Update stage text based on progress
      for (let i = DEFAULT_STAGES.length - 1; i >= 0; i--) {
        if (easedProgress >= DEFAULT_STAGES[i].at) {
          setCurrentStatus(DEFAULT_STAGES[i].text);
          break;
        }
      }

      if (easedProgress < 100) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        setCurrentStatus(DEFAULT_STAGES[DEFAULT_STAGES.length - 1].text);
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          // Brief pause on 100% before firing completion callback
          setTimeout(() => {
            onComplete?.();
          }, 450);
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, durationMs, onComplete]);

  if (!isOpen) return null;

  // Calculate filled blocks out of totalBlocks
  const filledCount = Math.min(
    totalBlocks,
    Math.floor((progress / 100) * totalBlocks)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="retro-loading-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-150"
    >
      {/* Warm Obsidian Dialog Surface */}
      <div
        className={cn(
          "w-full max-w-[460px] rounded-2xl bg-[#FFFFFF] dark:bg-[#141210]",
          "border border-[#E4DDD4] dark:border-[#292524]",
          "shadow-2xl overflow-hidden font-mono text-left",
          className
        )}
      >
        {/* Editorial Dialog Header */}
        <div className="px-5 py-3 bg-[#F3EFE9]/80 dark:bg-[#1C1917] border-b border-[#E4DDD4] dark:border-[#292524] flex items-center justify-between select-none">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D4664A] shrink-0" />
            <span className="font-mono text-[11px] font-semibold tracking-[0.06em] text-[#1C1917] dark:text-[#F5F5F4] uppercase truncate">
              VELQORA // INITIALIZING WORKSPACE
            </span>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onCancel}
            aria-label="Batalkan proses loading"
            className="w-6 h-6 rounded-md inline-flex items-center justify-center text-[#8A8378] dark:text-[#8C857F] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] hover:bg-[#E4DDD4]/60 dark:hover:bg-[#2C2724] transition-colors cursor-pointer"
            title="Batal"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M3 3l6 6M9 3l-6 6" />
            </svg>
          </button>
        </div>

        {/* Dialog Body */}
        <div className="p-6 sm:p-7 space-y-5 bg-[#FFFFFF] dark:bg-[#141210] text-[#1C1917] dark:text-[#F5F5F4]">
          
          {/* Centered Loading Title */}
          <div className="text-center space-y-1">
            <h2
              id="retro-loading-title"
              className="text-xl sm:text-2xl font-sans font-bold tracking-tight text-[#1C1917] dark:text-[#F5F5F4]"
            >
              {title}
            </h2>
            <p className="text-xs font-mono text-[#524B42] dark:text-[#A8A29E] truncate">
              {subtitle || currentStatus}
            </p>
          </div>

          {/* Segmented Terracotta Progress Track */}
          <div className="space-y-2">
            <div
              className={cn(
                "w-full h-8 p-1 rounded-xl flex items-center gap-1 overflow-hidden",
                "border border-[#E4DDD4] dark:border-[#292524]",
                "bg-[#FAF8F5] dark:bg-[#0B0A09]"
              )}
            >
              {Array.from({ length: totalBlocks }).map((_, idx) => {
                const isFilled = idx < filledCount;

                return (
                  <div
                    key={idx}
                    className={cn(
                      "flex-1 h-full rounded-[4px] transition-all duration-150 relative overflow-hidden",
                      isFilled
                        ? "bg-[#C2553A] dark:bg-[#D4664A]"
                        : "bg-[#EFECE6]/60 dark:bg-[#1C1917]/60"
                    )}
                  >
                    {isFilled && (
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-80 animate-shimmer"
                        style={{
                          animationDuration: "1.4s",
                          animationDelay: `${idx * 40}ms`,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sub-info Percentage Indicator */}
            <div className="flex items-center justify-between text-[11px] font-mono text-[#8A8378] dark:text-[#8C857F] px-0.5">
              <span>STATUS: IN_PROGRESS</span>
              <span className="font-semibold text-[#C2553A] dark:text-[#D4664A]">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Bottom Control Buttons */}
          <div className="pt-1 flex items-center justify-center gap-3 select-none">
            <button
              type="button"
              disabled={progress < 100}
              onClick={onComplete}
              className={cn(
                "min-w-[116px] px-4 py-2 text-xs font-mono font-semibold rounded-lg transition-all",
                progress >= 100
                  ? "vt-btn-terracotta cursor-pointer"
                  : "bg-[#F3EFE9] dark:bg-[#1C1917] text-[#8A8378] dark:text-[#8C857F] cursor-not-allowed border border-[#E4DDD4] dark:border-[#292524]"
              )}
            >
              Masuk Workspace
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="min-w-[100px] px-4 py-2 vt-btn-chrome text-xs font-mono font-semibold cursor-pointer"
            >
              Batal
            </button>
          </div>

        </div>

        {/* Hairline Telemetry Bar */}
        <div className="px-5 py-2.5 bg-[#FAF8F5] dark:bg-[#100E0D] border-t border-[#E4DDD4] dark:border-[#292524] flex items-center justify-between text-[11px] font-mono text-[#524B42] dark:text-[#A8A29E] select-none">
          <span className="flex items-center gap-2 truncate">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#34D399] shrink-0" />
            <span>SESSION_ESTABLISHED · VELQORA</span>
          </span>
          <span className="text-[#8A8378] dark:text-[#8C857F] hidden sm:inline shrink-0">
            WORKSPACE READY
          </span>
        </div>
      </div>
    </div>
  );
}
