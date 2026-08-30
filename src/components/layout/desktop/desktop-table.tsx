"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DesktopTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  className?: string;
}

export function DesktopTable({ children, className, ...props }: DesktopTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border bg-surface shadow-2xs">
      <table
        className={cn("w-full text-left border-collapse text-xs", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function DesktopTableHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <thead
      className={cn(
        "bg-surface-secondary/70 border-b border-border text-text-secondary text-[11px] font-semibold uppercase tracking-wider font-mono select-none",
        className
      )}
    >
      {children}
    </thead>
  );
}

export function DesktopTableRow({
  children,
  className,
  onClick,
  isInteractive = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isInteractive?: boolean;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-b border-border/60 transition-colors",
        isInteractive && "cursor-pointer hover:bg-surface-secondary/50 active:bg-surface-secondary/70",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function DesktopTableHead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("py-2.5 px-3.5 font-semibold text-text-tertiary", className)}>
      {children}
    </th>
  );
}

export function DesktopTableCell({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("py-2.5 px-3.5 text-text-primary align-middle", className)}>
      {children}
    </td>
  );
}
