"use client";

import React from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RecommendationOutcomeRecord } from "@/lib/schedule-outcomes/types";

interface RecommendationHistoryTableProps {
  history: RecommendationOutcomeRecord[];
  summary?: {
    totalRecommendations: number;
    acceptedCount: number;
    acceptanceRate: number;
    averageOutcomeScore: number;
    effectivenessRating: string;
    summary: string;
  };
}

export function RecommendationHistoryTable({
  history,
  summary,
}: RecommendationHistoryTableProps) {
  if (!history || history.length === 0) {
    return (
      <div className="rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-sm p-6 text-center space-y-2 shadow-2xs">
        <Sparkles className="w-8 h-8 mx-auto text-text-muted" />
        <h3 className="text-sm font-semibold text-text-primary">Belum Ada Riwayat Rekomendasi</h3>
        <p className="text-xs text-text-tertiary max-w-sm mx-auto">
          Riwayat interaksi dan evaluasi efektivitas rekomendasi akan otomatis tercatat saat Anda meninjau usulan jadwal.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-sm p-5 space-y-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-500" />
            <span>Riwayat & Efektivitas Rekomendasi Jadwal</span>
          </h3>
          <p className="text-xs text-text-tertiary">
            Evaluasi empiris terhadap tingkat keberhasilan pelaksanaan usulan optimasi kalender.
          </p>
        </div>

        {summary && (
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-text-secondary">Penerimaan:</span>
            <Badge variant="success" size="sm" isMono>
              {Math.round(summary.acceptanceRate * 100)}% ({summary.acceptedCount}/{summary.totalRecommendations})
            </Badge>
          </div>
        )}
      </div>

      {summary?.summary && (
        <div className="p-3 rounded-xl border border-border/60 bg-surface-secondary/30 text-xs text-text-secondary">
          {summary.summary}
        </div>
      )}

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-xs border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-border/60 text-text-tertiary font-mono text-[11px]">
              <th className="py-2.5 px-3 font-semibold">Usulan Rekomendasi</th>
              <th className="py-2.5 px-3 font-semibold">Tanggal</th>
              <th className="py-2.5 px-3 font-semibold">Status Penerimaan</th>
              <th className="py-2.5 px-3 font-semibold text-right">Skor Efektivitas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {history.map((rec) => {
              const formattedDate = new Date(rec.recordedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <tr key={rec.recommendationId} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-text-primary">
                      {rec.proposalTitle.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-text-tertiary">
                    {formattedDate}
                  </td>
                  <td className="py-3 px-3">
                    {rec.wasAccepted ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Diterapkan</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-text-muted text-xs">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Ditolak</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-text-primary">
                    <Badge
                      variant={rec.outcomeScore >= 80 ? "success" : rec.outcomeScore >= 60 ? "neutral" : "warning"}
                      size="sm"
                      isMono
                    >
                      {rec.outcomeScore} / 100
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
