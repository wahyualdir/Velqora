"use client";

import React from "react";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EarlyWarning2Item } from "@/lib/schedule-outcomes/types";

interface EarlyWarningBannerProps {
  warnings: EarlyWarning2Item[];
  onActionClick?: (warning: EarlyWarning2Item) => void;
}

export function EarlyWarningBanner({
  warnings,
  onActionClick,
}: EarlyWarningBannerProps) {
  if (warnings.length === 0) {
    return null;
  }

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return {
          border: "border-rose-500/30 bg-rose-500/5",
          icon: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />,
          badgeVariant: "danger" as const,
        };
      case "WARNING":
        return {
          border: "border-amber-500/30 bg-amber-500/5",
          icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
          badgeVariant: "warning" as const,
        };
      default:
        return {
          border: "border-sky-500/30 bg-sky-500/5",
          icon: <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />,
          badgeVariant: "neutral" as const,
        };
    }
  };

  return (
    <div className="space-y-3">
      {warnings.map((warn) => {
        const style = getSeverityStyle(warn.severity);
        return (
          <div
            key={warn.id}
            className={`p-4 rounded-xl border ${style.border} flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs`}
          >
            <div className="flex items-start gap-2.5 min-w-0">
              {style.icon}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-text-primary">
                    {warn.title}
                  </span>
                  <Badge variant={style.badgeVariant} size="sm" isMono>
                    {warn.severity}
                  </Badge>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  {warn.explanation}
                </p>
                {warn.evidence && warn.evidence.length > 0 && (
                  <ul className="text-[11px] text-text-tertiary list-disc list-inside space-y-0.5 pt-0.5">
                    {warn.evidence.map((ev, idx) => (
                      <li key={idx}>{ev}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {warn.suggestedAction && (
              <div className="self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => onActionClick?.(warn)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-text-primary text-xs font-semibold transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-text-secondary" />
                  <span>Lihat Solusi</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
