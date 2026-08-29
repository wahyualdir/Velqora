"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

export function TableContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-x-auto rounded-xl border border-border bg-surface scrollbar-thin",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Table({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn("w-full caption-bottom text-xs sm:text-sm text-left border-collapse", className)}
      {...props}
    >
      {children}
    </table>
  );
}

export function TableHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "border-b border-border bg-surface-secondary/70 text-text-secondary text-xs uppercase tracking-wider font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("divide-y divide-border/60 text-text-primary", className)}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn("border-t border-border bg-surface-secondary/40 font-medium text-text-secondary", className)}
      {...props}
    >
      {children}
    </tfoot>
  );
}

export function TableRow({
  className,
  children,
  clickable = false,
  selected = false,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & {
  clickable?: boolean;
  selected?: boolean;
}) {
  return (
    <tr
      className={cn(
        "transition-colors duration-100",
        clickable && "cursor-pointer hover:bg-surface-hover/60",
        selected && "bg-brand-500/10",
        !clickable && !selected && "hover:bg-surface-hover/30",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  className,
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left align-middle font-medium text-text-secondary text-xs whitespace-nowrap",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({
  className,
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("px-4 py-3 align-middle text-xs sm:text-sm text-text-primary", className)}
      {...props}
    >
      {children}
    </td>
  );
}

export function TableCaption({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={cn("mt-3 text-xs text-text-tertiary", className)}
      {...props}
    >
      {children}
    </caption>
  );
}

export function TableEmpty({
  colSpan,
  message = "Tidak ada data yang ditemukan",
  description,
  icon,
}: {
  colSpan: number;
  message?: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center text-text-tertiary">
        <div className="flex flex-col items-center justify-center space-y-2">
          {icon && <div className="text-text-tertiary">{icon}</div>}
          <p className="text-sm font-medium text-text-secondary">{message}</p>
          {description && <p className="text-xs text-text-tertiary max-w-sm">{description}</p>}
        </div>
      </td>
    </tr>
  );
}

export function TableLoading({
  colSpan,
  rows = 4,
}: {
  colSpan: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-border/40">
          {Array.from({ length: colSpan }).map((_, j) => (
            <td key={j} className="px-4 py-3.5">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
