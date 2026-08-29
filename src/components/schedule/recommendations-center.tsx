"use client";

import React from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TopRecommendationItem {
  id: string;
  sessionId: string;
  title: string;
  fromDay: string;
  fromTime: string;
  toDay: string;
  toTime: string;
  durationMinutes: number;
  qualityScore: number;
  qualityLabel: string;
  impactSummary: string[];
  explanationAnswers: Record<string, string>;
}

interface RecommendationsCenterProps {
  recommendations: TopRecommendationItem[];
  onReviewRecommendation?: (item: TopRecommendationItem) => void;
  onExplainRecommendation?: (item: TopRecommendationItem) => void;
}

export function RecommendationsCenter({
  recommendations,
  onReviewRecommendation,
  onExplainRecommendation,
}: RecommendationsCenterProps) {
  if (recommendations.length === 0) {
    return (
      <div className="rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-sm p-6 text-center space-y-3 shadow-2xs">
        <ShieldCheck className="w-8 h-8 mx-auto text-emerald-500" />
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-text-primary">
            Jadwal Akademik Anda Telah Optimal
          </h3>
          <p className="text-xs text-text-tertiary max-w-md mx-auto">
            Tidak ditemukan titik bentrok jadwal atau kelebihan beban harian yang memerlukan pemindahan sesi saat ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-sm p-5 space-y-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>Rekomendasi Penyesuaian Jadwal Terpilih</span>
          </h3>
          <p className="text-xs text-text-tertiary">
            Usulan cerdas untuk menyeimbangkan beban harian dan menjaga cakupan tenggat tugas tanpa efek samping.
          </p>
        </div>

        <Badge variant="neutral" size="sm" isMono>
          Maks. 3 Usulan Terbaik
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec, idx) => {
          return (
            <div
              key={rec.id}
              className="p-4 rounded-xl border border-border/70 bg-surface hover:border-brand-500/40 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
            >
              {/* Header with Rank and Quality Score */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                    #{idx + 1} Teratas
                  </span>
                  <Badge
                    variant={rec.qualityScore >= 85 ? "success" : rec.qualityScore >= 70 ? "neutral" : "warning"}
                    size="sm"
                    isMono
                  >
                    Kecocokan {rec.qualityScore}% ({rec.qualityLabel})
                  </Badge>
                </div>

                {/* Session Title */}
                <div>
                  <div className="text-[10px] uppercase font-mono font-semibold text-text-tertiary tracking-wider mb-0.5">
                    Rekomendasi Penyesuaian
                  </div>
                  <h4 className="text-sm font-bold text-text-primary">
                    {rec.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs font-mono text-text-secondary">
                    <span className="line-through text-text-muted">{rec.fromDay} ({rec.fromTime})</span>
                    <ArrowRight className="w-3 h-3 text-brand-500 shrink-0" />
                    <span className="font-semibold text-brand-600 dark:text-brand-400">{rec.toDay} ({rec.toTime})</span>
                  </div>
                </div>

                {/* Reason Section */}
                <div className="space-y-1 pt-2 border-t border-border/40">
                  <span className="text-[11px] font-semibold text-text-tertiary uppercase font-mono">
                    Alasan:
                  </span>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {rec.explanationAnswers?.["Mengapa dipilih?"] || "Deadline mendekati dan slot waktu belajar pada hari tujuan bebas bentrok dengan beban seimbang."}
                  </p>
                </div>

                {/* Impact Bullet Points */}
                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <span className="text-[11px] font-semibold text-text-tertiary uppercase font-mono">
                    Dampak Perubahan:
                  </span>
                  <ul className="space-y-1 text-xs text-text-secondary">
                    {rec.impactSummary.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-tight">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                {onExplainRecommendation && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onExplainRecommendation(rec)}
                    className="text-xs h-8 px-2.5 text-text-secondary hover:text-text-primary gap-1 cursor-pointer flex-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Jelaskan</span>
                  </Button>
                )}

                {onReviewRecommendation && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReviewRecommendation(rec)}
                    className="text-xs h-8 px-3 font-semibold text-brand-600 dark:text-brand-400 border-brand-500/30 hover:bg-brand-500/10 cursor-pointer flex-1"
                  >
                    <span>Tinjau</span>
                    <ArrowUpRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
