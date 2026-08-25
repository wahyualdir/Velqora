"use client";

import { useState, useEffect } from "react";
import { Flame, Trophy, Award, Sparkles, ArrowUpRight, Gift } from "lucide-react";
import Link from "next/link";
import { getGamificationState, getLevelInfo } from "@/lib/gamification-service";
import { RewardStoreModal } from "@/components/dashboard/reward-store-modal";
import { Card, Badge } from "@/components/ui/card";

export function LearningStreakCard() {
  const [gamification, setGamification] = useState(() => getGamificationState());
  const [showStoreModal, setShowStoreModal] = useState(false);

  useEffect(() => {
    setGamification(getGamificationState());
  }, []);

  const refreshState = () => {
    setGamification(getGamificationState());
  };

  const levelInfo = getLevelInfo(gamification.exp);
  const currentXP = gamification.exp;
  const nextLevelXP = levelInfo.maxEXP;
  const levelPercentage = Math.min(
    100,
    Math.max(0, Math.round(((currentXP - levelInfo.minEXP) / (nextLevelXP - levelInfo.minEXP)) * 100))
  );

  const badges = [
    {
      id: "b1",
      title: "AI Pioneer",
      desc: "Kumpulkan 100 EXP",
      unlocked: currentXP >= 100,
      icon: Sparkles,
      color: currentXP >= 100
        ? "text-brand-400 bg-brand-500/10 border-brand-500/20"
        : "text-text-tertiary bg-surface-secondary border-border/80 opacity-60",
    },
    {
      id: "b2",
      title: "Quiz Master",
      desc: "Kumpulkan 300 EXP",
      unlocked: currentXP >= 300,
      icon: Trophy,
      color: currentXP >= 300
        ? "text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
        : "text-text-tertiary bg-surface-secondary border-border/80 opacity-60",
    },
    {
      id: "b3",
      title: "Siswa Aktif",
      desc: "5 Hari Beruntun",
      unlocked: gamification.streakDays >= 5,
      icon: Flame,
      color: gamification.streakDays >= 5
        ? "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        : "text-text-tertiary bg-surface-secondary border-border/80 opacity-60",
    },
    {
      id: "b4",
      title: "Master Kode",
      desc: "Kumpulkan 500 EXP",
      unlocked: currentXP >= 500,
      icon: Award,
      color: currentXP >= 500
        ? "text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/20"
        : "text-text-tertiary bg-surface-secondary border-border/80 opacity-60",
    },
  ];

  return (
    <>
      <Card className="p-5 sm:p-6 rounded-2xl bg-surface border-border space-y-4 shadow-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border-b border-border/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 dark:text-amber-400 shrink-0 shadow-2xs">
              <Flame className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-text-primary font-display tracking-tight">
                  Learning Streak
                </h2>
                <Badge variant="warning" isMono>
                  {gamification.streakDays} Hari
                </Badge>
              </div>
              <p className="text-xs text-text-secondary">Pertahankan konsistensi belajar Anda setiap hari</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowStoreModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-amber-600 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all duration-150 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Toko Hadiah</span>
            </button>

            <Link
              href="/dashboard/kuis-ai"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-xs transition-all duration-150 active:scale-95"
            >
              <span>Kuis AI (+100 EXP)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Level & XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-text-primary font-display">
              {levelInfo.title}
            </span>
            <span className="font-mono text-text-secondary text-[11px]">
              <strong className="text-amber-500 dark:text-amber-400 font-semibold">{currentXP}</strong> / {nextLevelXP} EXP
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-surface-secondary border border-border overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500"
              style={{ width: `${levelPercentage}%` }}
            />
          </div>
        </div>

        {/* Unlocked Badges Grid */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-mono font-semibold text-text-tertiary uppercase tracking-wider block">
            Lencana Prestasi
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {badges.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.id}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all duration-150 shadow-2xs ${b.color}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <div className="overflow-hidden min-w-0">
                    <span className="font-semibold text-xs text-text-primary block truncate font-display">{b.title}</span>
                    <span className="text-[10px] text-text-secondary block truncate">{b.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Toko Hadiah Modal */}
      <RewardStoreModal
        isOpen={showStoreModal}
        onClose={() => setShowStoreModal(false)}
        onStateChange={refreshState}
      />
    </>
  );
}

