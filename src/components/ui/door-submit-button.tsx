"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

interface DoorSubmitButtonProps {
  loading: boolean;
  isSuccess: boolean;
  disabled?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
  className?: string;
  id?: string;
}

export function DoorSubmitButton({
  loading,
  isSuccess,
  disabled = false,
  type = "submit",
  onClick,
  className = "",
  id,
}: DoorSubmitButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // States:
  // - default: door closed
  // - hover: door cracks open slightly (22deg), gentle glow
  // - loading / isSuccess: door wide open (74deg), radiant warm golden glow, person walks through!
  const isDoorOpen = loading || isSuccess || isHovered;
  const isWalking = loading || isSuccess;

  return (
    <button
      id={id}
      type={type}
      disabled={disabled || loading || isSuccess}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-live="polite"
      className={`group relative w-full flex items-center justify-between py-3 px-5 sm:px-6 rounded-[10px] text-sm sm:text-base font-semibold text-white bg-brand hover:bg-brand-hover active:bg-brand-600 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none min-h-[48px] overflow-hidden ${className}`}
    >
      {/* Left / Center: Button Label */}
      <div className="flex items-center gap-2.5 z-10">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-[spin_600ms_linear_infinite] text-white shrink-0" />
            <span>Memproses Masuk...</span>
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0 animate-scale-in" />
            <span>Berhasil Masuk!</span>
          </>
        ) : (
          <span>Masuk ke Akun</span>
        )}
      </div>

      {/* Right: Interactive 3D Door Portal */}
      <div
        className="relative flex items-center justify-center shrink-0 ml-3 select-none"
        style={{ width: 42, height: 34, perspective: 450 }}
        aria-hidden="true"
      >
        {/* Door Outer Frame */}
        <div className="relative w-[28px] h-[32px] rounded-t-[4px] rounded-b-[1px] border border-white/40 bg-black/25 overflow-hidden flex items-end justify-center shadow-inner">
          {/* Glowing Light Room behind Door */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 transition-opacity duration-300 pointer-events-none"
            style={{
              opacity: isDoorOpen ? (isWalking ? 0.95 : 0.65) : 0,
              boxShadow: isDoorOpen
                ? "0 0 16px rgba(251, 191, 36, 0.9), inset 0 0 6px rgba(245, 158, 11, 0.8)"
                : "none",
            }}
          />

          {/* Silhouette Figure Walking Through Door */}
          <div
            className="absolute bottom-0 z-10 pointer-events-none flex flex-col items-center"
            style={{
              transition: isWalking
                ? "transform 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.85s ease"
                : "transform 0.2s ease, opacity 0.2s ease",
              transform: isWalking
                ? "translateX(14px) scale(0.85)"
                : isHovered
                ? "translateX(-3px)"
                : "translateX(-12px)",
              opacity: isWalking ? 0.2 : isDoorOpen ? 0.95 : 0,
            }}
          >
            {/* Person Head */}
            <div className="w-[5px] h-[5px] rounded-full bg-slate-900 shadow-xs" />
            {/* Person Torso & Arms */}
            <div className="w-[4px] h-[8px] rounded-[1px] bg-slate-900 mt-[1px]" />
            {/* Person Legs (Animated walk cycle) */}
            <div className="flex gap-[2px] mt-[-1px]">
              <div
                className={`w-[2px] h-[7px] bg-slate-900 rounded-[1px] origin-top ${
                  isWalking ? "animate-[doorLegFront_0.42s_ease-in-out_infinite_alternate]" : ""
                }`}
              />
              <div
                className={`w-[2px] h-[7px] bg-slate-900 rounded-[1px] origin-top ${
                  isWalking ? "animate-[doorLegBack_0.42s_ease-in-out_infinite_alternate]" : ""
                }`}
              />
            </div>
          </div>

          {/* 3D Door Panel with Handle */}
          <div
            className="absolute inset-0 rounded-t-[3px] bg-gradient-to-br from-amber-100 to-amber-200 border-l border-white/60 shadow-md flex items-center justify-end pr-[3px]"
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              transition: "transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1)",
              transform: isWalking
                ? "rotateY(-76deg)"
                : isHovered
                ? "rotateY(-36deg)"
                : "rotateY(0deg)",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Door Panel Inset Detail */}
            <div className="w-[18px] h-[24px] border border-amber-300/70 rounded-[2px] bg-amber-50/50 flex flex-col justify-around py-1 px-0.5">
              <div className="w-full h-[6px] border-b border-amber-300/40" />
              <div className="w-full h-[6px] border-t border-amber-300/40" />
            </div>

            {/* Door Knob */}
            <div className="absolute right-[3px] top-[14px] w-[3px] h-[3px] rounded-full bg-amber-800 shadow-xs border border-amber-900/30" />
          </div>
        </div>
      </div>
    </button>
  );
}
