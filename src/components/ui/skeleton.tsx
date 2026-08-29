"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
}

export function Skeleton({
  className,
  variant = "rectangular",
  ...props
}: SkeletonProps) {
  const variantStyles = {
    rectangular: "rounded-lg",
    circular: "rounded-full",
    text: "rounded-md h-4 w-full",
  };

  return (
    <div
      className={cn("skeleton", variantStyles[variant], className)}
      aria-hidden="true"
      {...props}
    />
  );
}
