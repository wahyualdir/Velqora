"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MobileAppShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * MobileAppShell: Dedicated Mobile Native App Shell
 * Thumb-friendly, minimal chrome, safe-area padded, no desktop sidebar offset.
 */
export function MobileAppShell({ children, className }: MobileAppShellProps) {
  return (
    <div
      className={cn(
        "flex-1 flex flex-col min-w-0 w-full min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom,0px))] overscroll-y-contain",
        className
      )}
    >
      {children}
    </div>
  );
}
