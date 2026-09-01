"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DesktopWorkspaceProps {
  children: React.ReactNode;
  className?: string;
  isCollapsed?: boolean;
}

/**
 * DesktopWorkspace: Professional SaaS / Productivity Workspace Shell
 * High information density, linear-like clarity, calm spacing, max-width layout.
 */
export function DesktopWorkspace({
  children,
  className,
  isCollapsed = false,
}: DesktopWorkspaceProps) {
  return (
    <div
      className={cn(
        "flex-1 flex flex-col min-w-0 z-10 transition-all duration-200 ease-out",
        isCollapsed ? "lg:pl-[68px]" : "lg:pl-[245px]",
        className
      )}
    >
      {children}
    </div>
  );
}

interface DesktopWorkspaceHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function DesktopWorkspaceHeader({
  title,
  description,
  badge,
  actions,
  breadcrumbs,
}: DesktopWorkspaceHeaderProps) {
  return (
    <div className="border-b border-border/80 bg-surface/50 backdrop-blur-xs py-4 px-4 sm:px-6 mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text-tertiary font-mono mb-2">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-text-tertiary/60">/</span>}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-text-primary transition-colors hover:underline"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-text-secondary font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-text-primary font-display">
            {title}
          </h1>
          {badge}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>

      {description && (
        <p className="text-xs text-text-secondary mt-1 max-w-3xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
