"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: ReactNode;
  className?: string;
}

export function Divider({
  orientation = "horizontal",
  label,
  className,
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("w-[1px] h-full min-h-[1rem] bg-border mx-2 self-stretch shrink-0", className)}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn("relative flex items-center justify-center my-4 w-full", className)}
        {...props}
      >
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative bg-surface px-3 text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
          {label}
        </div>
      </div>
    );
  }

  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      className={cn("w-full border-0 border-t border-border my-4 shrink-0", className)}
      {...props}
    />
  );
}
