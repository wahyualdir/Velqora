"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
}

export function ListItem({
  interactive = true,
  className,
  children,
  ...props
}: ListItemProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-border bg-surface shadow-2xs",
        interactive &&
          "transition-all duration-150 hover:bg-surface-hover hover:border-border-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Icon slot
export function ListItemIcon({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "p-2.5 rounded-xl bg-surface-secondary text-brand-500 border border-border/60 shrink-0 flex items-center justify-center min-w-[40px] min-h-[40px]",
        className
      )}
    >
      {children}
    </div>
  );
}

// Main content container
export function ListItemContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("space-y-1 min-w-0 flex-1", className)}>{children}</div>;
}

// Title
export function ListItemTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      className={cn(
        "text-sm font-semibold text-text-primary tracking-tight truncate",
        className
      )}
    >
      {children}
    </h3>
  );
}

// Description / Subtitle
export function ListItemDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "text-xs text-text-secondary line-clamp-1 sm:line-clamp-2 leading-relaxed",
        className
      )}
    >
      {children}
    </p>
  );
}

// Meta Row / Badge tags
export function ListItemMeta({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 text-xs text-text-tertiary pt-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}

// Actions slot
export function ListItemActions({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 shrink-0 self-end sm:self-center pt-2 sm:pt-0",
        className
      )}
    >
      {children}
    </div>
  );
}

// Compound assignments
ListItem.Icon = ListItemIcon;
ListItem.Content = ListItemContent;
ListItem.Title = ListItemTitle;
ListItem.Description = ListItemDescription;
ListItem.Meta = ListItemMeta;
ListItem.Actions = ListItemActions;
