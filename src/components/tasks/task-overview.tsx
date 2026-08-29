"use client";

import React from "react";
import { CheckCircle2, Clock, AlertTriangle, AlertCircle, Layers } from "lucide-react";

interface TaskOverviewProps {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  activeStatusFilter: string;
  onSelectStatus: (status: string) => void;
}

export function TaskOverview({
  total,
  pending,
  inProgress,
  completed,
  overdue,
  activeStatusFilter,
  onSelectStatus,
}: TaskOverviewProps) {
  const metrics = [
    {
      id: "",
      label: "Semua",
      count: total,
      icon: Layers,
      color: "text-text-primary",
      activeBg: "bg-surface border-border shadow-xs",
    },
    {
      id: "belum_dikerjakan",
      label: "Belum Mulai",
      count: pending,
      icon: Clock,
      color: "text-amber-500",
      activeBg: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
    },
    {
      id: "sedang_dikerjakan",
      label: "Sedang Dikerjakan",
      count: inProgress,
      icon: AlertCircle,
      color: "text-blue-500",
      activeBg: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
    },
    {
      id: "selesai",
      label: "Selesai",
      count: completed,
      icon: CheckCircle2,
      color: "text-emerald-500",
      activeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "terlambat",
      label: "Terlambat",
      count: overdue,
      icon: AlertTriangle,
      color: "text-rose-500",
      activeBg: "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
      {metrics.map((m) => {
        const Icon = m.icon;
        const isActive = activeStatusFilter === m.id;

        return (
          <button
            key={m.label}
            type="button"
            onClick={() => onSelectStatus(m.id)}
            className={`p-3 rounded-xl border transition-all text-left flex items-center justify-between gap-2 cursor-pointer ${
              isActive
                ? `${m.activeBg} font-semibold`
                : "bg-surface border-border hover:bg-surface-secondary/70 text-text-secondary hover:text-text-primary"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Icon className={`w-4 h-4 shrink-0 ${m.color}`} />
              <span className="text-xs truncate">{m.label}</span>
            </div>
            <span className="text-xs sm:text-sm font-bold font-mono text-text-primary shrink-0">
              {m.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
