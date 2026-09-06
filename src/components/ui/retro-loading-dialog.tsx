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
      {/* Retro 3D Beveled Dialog Window Frame */}
      <div
        className={cn(
          "w-full max-w-[480px] bg-[#ECE9D8] dark:bg-[#18181B]",
          "border-t-2 border-l-2 border-[#FFFFFF] dark:border-t-[#3F3F46] dark:border-l-[#3F3F46]",
          "border-r-2 border-b-2 border-[#7A756D] dark:border-r-[#09090B] dark:border-b-[#09090B]",
          "shadow-2xl overflow-hidden font-mono text-left",
          className
        )}
      >
        {/* Titlebar with Velqora Signature Terracotta Gradient */}
        <div className="vt-titlebar px-2.5 py-1 flex items-center justify-between select-none">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="inline-block w-2.5 h-2.5 bg-amber-300 shadow-xs" />
            <span className="font-mono text-xs font-bold tracking-wide text-white uppercase truncate">
              VELQORA_OS // LOADER.EXE
            </span>
          </div>

          {/* Close button [×] */}
          <button
            type="button"
            onClick={onCancel}
            aria-label="Batalkan proses loading"
            className="vt-window-btn vt-window-btn-close flex items-center justify-center cursor-pointer"
            title="Batal"
          >
            ×
          </button>
        </div>

        {/* Dialog Body (Exact Classic Layout Matching Reference Asset) */}
        <div className="p-6 sm:p-8 space-y-6 bg-[#ECE9D8] dark:bg-[#18181B] text-[#1C1917] dark:text-zinc-100">
          
          {/* Centered Large "Loading..." Title */}
          <div className="text-center space-y-1">
            <h2
              id="retro-loading-title"
              className="text-xl sm:text-2xl font-sans font-bold tracking-tight text-[#1C1917] dark:text-zinc-100"
            >
              {title}
            </h2>
            <p className="text-xs font-mono text-[#524B42] dark:text-zinc-400 truncate">
              {subtitle || currentStatus}
            </p>
          </div>

          {/* Segmented Block Progress Bar Track (Classic Inset Groove) */}
          <div className="space-y-1.5">
            <div
              className={cn(
                "w-full h-8 sm:h-9 p-1 flex items-center gap-1 overflow-hidden",
                // Retro 3D Inset Groove Borders
                "border-t-2 border-l-2 border-[#7A756D] dark:border-t-[#09090B] dark:border-l-[#09090B]",
                "border-b-2 border-r-2 border-[#FFFFFF] dark:border-b-[#3F3F46] dark:border-r-[#3F3F46]",
                "bg-[#FAF8F5] dark:bg-[#121214]"
              )}
            >
              {Array.from({ length: totalBlocks }).map((_, idx) => {
                const isFilled = idx < filledCount;
                const isLeadingEdge = idx === filledCount - 1;

                return (
                  <div
                    key={idx}
                    className={cn(
                      "flex-1 h-full transition-all duration-75 relative overflow-hidden",
                      isFilled
                        ? "bg-gradient-to-b from-[#EE7257] via-[#C2553A] to-[#853827] border-t border-l border-[#FFA085]/60 border-r border-b border-[#5C1E12]/80 shadow-xs"
                        : "bg-transparent",
                      isFilled && isLeadingEdge && "animate-pulse"
                    )}
                  >
                    {/* Animated moving shimmer / light sheen over active terracotta blocks */}
                    {isFilled && (
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-80 animate-shimmer"
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

            {/* Inset Sub-info: Percentage Indicator */}
            <div className="flex items-center justify-between text-[11px] font-mono text-[#7A756D] dark:text-zinc-400 px-0.5">
              <span>STATUS: IN_PROGRESS</span>
              <span className="font-bold text-[#C2553A] dark:text-brand-400">
                [ {Math.round(progress)}% ]
              </span>
            </div>
          </div>

          {/* Bottom Control Buttons (Exact Match: [ Done ] [ Cancel ]) */}
          <div className="pt-2 flex items-center justify-center gap-4 select-none">
            {/* "Done" Button (Disabled until 100% reached) */}
            <button
              type="button"
              disabled={progress < 100}
              onClick={onComplete}
              className={cn(
                "min-w-[100px] sm:min-w-[110px] px-4 py-1.5 text-xs font-mono font-bold transition-all",
                progress >= 100
                  ? "vt-btn-terracotta cursor-pointer active:translate-y-0.5"
                  : "bg-[#ECE9D8] dark:bg-[#27272A] text-[#8A8378] dark:text-zinc-500 cursor-not-allowed border border-[#B8B1A5] dark:border-zinc-700"
              )}
            >
              {/* Inner vintage dotted outline when focused/active */}
              <span
                className={cn(
                  "block px-2 py-0.5 border border-dotted",
                  progress >= 100
                    ? "border-amber-200/50"
                    : "border-transparent"
                )}
              >
                Done
              </span>
            </button>

            {/* "Cancel" Button (Classic Vintage Chrome Button with Dotted Inner Border) */}
            <button
              type="button"
              onClick={onCancel}
              className="min-w-[100px] sm:min-w-[110px] px-4 py-1.5 vt-btn-chrome text-xs font-mono font-bold cursor-pointer active:translate-y-0.5 group"
            >
              {/* Inner vintage dotted outline box matching reference image */}
              <span className="block px-2 py-0.5 border border-dotted border-[#7A756D]/50 dark:border-zinc-500/50 group-hover:border-[#1C1917] dark:group-hover:border-zinc-300">
                Cancel
              </span>
            </button>
          </div>

        </div>

        {/* Retro Inset Status Bar */}
        <div className="px-3 py-1 bg-[#ECE9D8] dark:bg-[#18181B] border-t-2 border-[#FFFFFF] dark:border-t-zinc-800 flex items-center justify-between text-[11px] font-mono text-[#524B42] dark:text-zinc-400 select-none">
          <span className="flex items-center gap-1.5 truncate">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0 animate-ping" />
            <span>SESSION_ESTABLISHED · VELQORA_KERNEL</span>
          </span>
          <span className="text-[#8A8378] dark:text-zinc-500 hidden sm:inline shrink-0">
            64-BIT RUNTIME
          </span>
        </div>
      </div>
    </div>
  );
}
