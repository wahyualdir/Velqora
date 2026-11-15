"use client";

import React, { useState } from "react";
import { Cpu, Globe, Laptop, Plug, PlugZap, X } from "lucide-react";
import type { RuntimeMode } from "@/lib/notebook/types";

interface RuntimeConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  runtimeMode: RuntimeMode;
  remoteUrl: string;
  isRemoteConnected: boolean;
  onSelectWasm: () => void;
  onConnectRemote: (url: string, token: string) => Promise<void>;
  onDisconnectRemote: () => void;
}

export function RuntimeConnectionModal({
  isOpen,
  onClose,
  runtimeMode,
  remoteUrl,
  isRemoteConnected,
  onSelectWasm,
  onConnectRemote,
  onDisconnectRemote,
}: RuntimeConnectionModalProps) {
  const [urlInput, setUrlInput] = useState(
    remoteUrl || "http://localhost:8888"
  );
  const [tokenInput, setTokenInput] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg(null);
    setConnecting(true);
    try {
      await onConnectRemote(urlInput, tokenInput);
      onClose();
    } catch (err: any) {
      setErrMsg(err?.message || "Gagal menghubungkan ke Jupyter Server.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-[#FAF8F5] dark:bg-[#141210] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#C2553A] dark:text-[#D4664A]" />
            <h2 className="text-sm font-bold text-text-primary">
              Pilih Runtime Komputasi
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-secondary cursor-pointer"
            aria-label="Tutup modal runtime"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Option 1: Browser WASM */}
          <button
            type="button"
            onClick={() => {
              onSelectWasm();
              onClose();
            }}
            className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer space-y-1 ${
              runtimeMode === "wasm"
                ? "border-[#C2553A] bg-[#C2553A]/10"
                : "border-border bg-surface hover:bg-surface-secondary"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C2553A]" />
                <span>Browser WebAssembly (Gratis, Zero-Setup, Offline)</span>
              </span>
              {runtimeMode === "wasm" && (
                <span className="px-2 py-0.5 rounded-full bg-[#C2553A] text-white text-[10px] font-mono font-bold">
                  Aktif
                </span>
              )}
            </div>
            <p className="text-[11.5px] text-text-secondary">
              Menjalankan Python 3.12 (NumPy, Pandas, Matplotlib, Scikit-Learn via Pyodide), SQLite persisten, dan JS/TS Worker langsung di perangkat Anda.
            </p>
          </button>

          {/* Option 2: Remote / Local GPU Bridge */}
          <form
            onSubmit={handleConnect}
            className={`p-4 rounded-xl border space-y-3 ${
              runtimeMode === "remote_ws"
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-border bg-surface"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-text-primary">
                  Local Runtime / Cloud GPU Bridge (Jupyter WebSocket)
                </span>
              </div>
              {isRemoteConnected && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-mono font-bold">
                  Terhubung
                </span>
              )}
            </div>

            <p className="text-[11px] text-text-secondary leading-relaxed">
              Hubungkan ke Jupyter Server / Kaggle / PC GPU lokal Anda untuk PyTorch, CUDA, atau training model besar. Jalankan dengan{" "}
              <code className="font-mono text-text-primary bg-surface-secondary px-1 py-0.5 rounded">
                jupyter server --ServerApp.allow_origin=&apos;*&apos;
              </code>
              .
            </p>

            <div className="space-y-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="http://localhost:8888 atau https://gpu-tunnel.trycloudflare.com"
                className="w-full min-h-[38px] px-3 py-1.5 rounded-xl border border-border bg-surface-secondary/40 text-xs font-mono text-text-primary focus:outline-hidden focus:border-[#C2553A]"
              />
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Token Jupyter (opsional jika autentikasi dimatikan)"
                className="w-full min-h-[38px] px-3 py-1.5 rounded-xl border border-border bg-surface-secondary/40 text-xs font-mono text-text-primary focus:outline-hidden focus:border-[#C2553A]"
              />
            </div>

            {errMsg && (
              <p className="text-[11px] font-mono text-rose-600 dark:text-rose-400">
                {errMsg}
              </p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={connecting}
                className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <PlugZap className="w-3.5 h-3.5" />
                <span>{connecting ? "Menghubungkan..." : "Hubungkan Runtime"}</span>
              </button>

              {isRemoteConnected && (
                <button
                  type="button"
                  onClick={onDisconnectRemote}
                  className="min-h-[38px] px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-xs font-mono text-text-secondary inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plug className="w-3.5 h-3.5" />
                  <span>Putuskan</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
