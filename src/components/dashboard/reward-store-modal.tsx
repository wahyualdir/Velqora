"use client";

import { useState } from "react";
import { Gift, X, Star, CheckCircle2, Crown, Award, Sparkles, Lock } from "lucide-react";
import { toast } from "sonner";
import {
  getGamificationState,
  saveGamificationState,
  REWARD_STORE_ITEMS,
  RewardItem,
} from "@/lib/gamification-service";
import { useThemeAccent, AccentColor } from "@/context/theme-accent-context";

interface RewardStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStateChange?: () => void;
}

export function RewardStoreModal({ isOpen, onClose, onStateChange }: RewardStoreModalProps) {
  const [state, setState] = useState(() => getGamificationState());
  const { accent, setAccent } = useThemeAccent();

  if (!isOpen) return null;

  const handleRedeem = (item: RewardItem) => {
    if (state.exp < item.costEXP) {
      toast.error(`EXP Anda tidak mencukupi. Butuh ${item.costEXP} EXP.`);
      return;
    }

    if (state.unlockedRewards.includes(item.id)) {
      if (item.id === "r4") {
        setAccent("emerald");
        toast.success("Tema Warna Emerald berhasil diaktifkan!");
      } else {
        toast.info("Hadiah ini sudah pernah Anda tukarkan.");
      }
      return;
    }

    const newState = {
      ...state,
      exp: state.exp - item.costEXP,
      unlockedRewards: [...state.unlockedRewards, item.id],
    };

    saveGamificationState(newState);
    setState(newState);
    if (onStateChange) onStateChange();

    if (item.id === "r4") {
      setAccent("emerald");
      toast.success("Selamat! Anda berhasil menukarkan dan mengaktifkan Tema Warna Emerald.");
    } else {
      toast.success(`Selamat! Anda berhasil menukarkan ${item.title}.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#0c1220] p-6 space-y-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Toko Hadiah Belajar</h2>
              <p className="text-xs text-slate-400">Tukarkan akumulasi EXP Anda dengan fitur dan lencana khusus</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Banner */}
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-200">Saldo EXP Anda Saat Ini:</span>
          </div>
          <span className="text-xl font-bold text-amber-300 font-mono">{state.exp} EXP</span>
        </div>

        {/* Rewards List */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
          {REWARD_STORE_ITEMS.map((item) => {
            const isUnlocked = state.unlockedRewards.includes(item.id);
            const canAfford = state.exp >= item.costEXP;

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{item.title}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.costEXP} EXP
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>

                {isUnlocked ? (
                  item.id === "r4" ? (
                    <button
                      onClick={() => {
                        const target = accent === "emerald" ? "indigo" : "emerald";
                        setAccent(target);
                        toast.success(
                          target === "emerald"
                            ? "Tema Warna Emerald diaktifkan."
                            : "Kembali ke Tema Warna Default Indigo."
                        );
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
                        accent === "emerald"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                      }`}
                    >
                      {accent === "emerald" ? "Tema Emerald Aktif" : "Gunakan Tema Emerald"}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                      Terbuka
                    </span>
                  )
                ) : (
                  <button
                    onClick={() => handleRedeem(item)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                      canAfford
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-white shadow-md shadow-amber-500/20 active:scale-95"
                        : "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {canAfford ? "Tukarkan" : "EXP Kurang"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="text-center pt-2 border-t border-white/[0.06]">
          <p className="text-[11px] text-slate-400">
            Dapatkan lebih banyak EXP dengan menyelesaikan kuis AI dan menjaga konsistensi belajar harian.
          </p>
        </div>
      </div>
    </div>
  );
}
