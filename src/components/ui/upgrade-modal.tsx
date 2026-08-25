"use client";

import { X, Crown, Image, Paperclip, Brain, Infinity, MessageSquare, Sparkles } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: "limit" | "feature";
}

export function UpgradeModal({ isOpen, onClose, reason = "feature" }: UpgradeModalProps) {
  if (!isOpen) return null;

  const features = [
    {
      label: "Pesan per hari",
      free: "15 pesan",
      premium: "Unlimited",
      freeIcon: MessageSquare,
      premiumIcon: Infinity,
    },
    {
      label: "Model AI",
      free: "Gemini Flash (Basic)",
      premium: "Gemini 2.0 Flash (Powerful)",
      freeIcon: Sparkles,
      premiumIcon: Brain,
    },
    {
      label: "Upload Gambar",
      free: "Tidak tersedia",
      premium: "Tersedia",
      freeIcon: X,
      premiumIcon: Image,
    },
    {
      label: "Upload File/Dokumen",
      free: "Tidak tersedia",
      premium: "Tersedia",
      freeIcon: X,
      premiumIcon: Paperclip,
    },
    {
      label: "Kualitas Jawaban",
      free: "Singkat & dasar",
      premium: "Mendalam & komprehensif",
      freeIcon: MessageSquare,
      premiumIcon: Sparkles,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#0f1629] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 animate-fade-in overflow-hidden">
        {/* Gold accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />

        {/* Header */}
        <div className="p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Upgrade ke Premium
              </h2>
              <p className="text-xs text-slate-400">
                {reason === "limit"
                  ? "Batas pesan harian Anda telah habis"
                  : "Fitur ini hanya tersedia untuk pengguna Premium"}
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="px-6 pb-4">
          <div className="rounded-xl border border-white/[0.08] overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-0 bg-white/[0.03]">
              <div className="p-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Fitur
              </div>
              <div className="p-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center border-x border-white/[0.06]">
                Free
              </div>
              <div className="p-3 text-[10px] font-semibold text-amber-400 uppercase tracking-wider text-center">
                Premium
              </div>
            </div>

            {/* Rows */}
            {features.map((f, i) => (
              <div
                key={f.label}
                className={`grid grid-cols-3 gap-0 ${
                  i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                } border-t border-white/[0.06]`}
              >
                <div className="p-3 text-xs text-slate-300 font-medium">
                  {f.label}
                </div>
                <div className="p-3 text-xs text-slate-500 text-center border-x border-white/[0.06]">
                  {f.free}
                </div>
                <div className="p-3 text-xs text-amber-300 text-center font-medium">
                  {f.premium}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-6 pt-2 space-y-3">
          <a
            href="https://wa.me/6283162031942?text=Halo%2C%20saya%20ingin%20upgrade%20ke%20Velqora%20Premium!"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 shadow-lg shadow-amber-600/25 transition-all duration-200 active:scale-[0.98]"
          >
            <Crown className="w-4 h-4" />
            Hubungi Admin untuk Upgrade
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] transition-all duration-200"
          >
            Nanti saja
          </button>
        </div>
      </div>
    </div>
  );
}
