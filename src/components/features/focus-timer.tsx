"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  Sparkles,
  Coffee,
  Brain,
  CheckCircle2,
  X,
  Flame,
  Clock,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { addEXP } from "@/lib/gamification-service";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

const MODE_CONFIG: Record<
  TimerMode,
  { label: string; defaultMinutes: number; exp: number; icon: any }
> = {
  pomodoro: {
    label: "Fokus Belajar",
    defaultMinutes: 25,
    exp: 25,
    icon: Brain,
  },
  shortBreak: {
    label: "Istirahat Singkat",
    defaultMinutes: 5,
    exp: 5,
    icon: Coffee,
  },
  longBreak: {
    label: "Istirahat Panjang",
    defaultMinutes: 15,
    exp: 10,
    icon: Sparkles,
  },
};

export function FocusTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(MODE_CONFIG.pomodoro.defaultMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ambientAudio, setAmbientAudio] = useState<"none" | "rain" | "whitenoise">("none");
  const [completedSessions, setCompletedSessions] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Initialize Web Audio context for bell sound and ambient generator
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Play pleasant completion chime using Web Audio API
  const playCompletionChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3); // A5
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.6); // D6

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch (e) {
      console.warn("Audio chime failed", e);
    }
  }, [soundEnabled, getAudioContext]);

  // Ambient noise generator (Rain / White noise generator)
  useEffect(() => {
    if (ambientAudio === "none" || !isRunning) {
      if (noiseNodeRef.current) {
        try {
          (noiseNodeRef.current as any).stop?.();
          noiseNodeRef.current.disconnect();
        } catch (e) {}
        noiseNodeRef.current = null;
      }
      return;
    }

    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      if (ambientAudio === "rain") {
        // Pink / Brown filtered noise
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
          b6 = white * 0.115926;
        }
      } else {
        // Pure White Noise
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.02;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = ambientAudio === "rain" ? "lowpass" : "bandpass";
      filter.frequency.value = ambientAudio === "rain" ? 800 : 1200;

      const gain = ctx.createGain();
      gain.gain.value = 0.15;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(0);
      noiseNodeRef.current = whiteNoise;

      return () => {
        try {
          whiteNoise.stop();
          whiteNoise.disconnect();
        } catch (e) {}
      };
    } catch (e) {
      console.warn("Ambient audio error", e);
    }
  }, [ambientAudio, isRunning, getAudioContext]);

  // Timer Tick Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playCompletionChime();

      if (mode === "pomodoro") {
        setCompletedSessions((prev) => prev + 1);
        addEXP(MODE_CONFIG.pomodoro.exp);
        toast.success(
          `🎉 Sesi fokus selesai! Anda mendapatkan +${MODE_CONFIG.pomodoro.exp} EXP.`
        );
        // Switch to break automatically
        setMode("shortBreak");
        setTimeLeft(MODE_CONFIG.shortBreak.defaultMinutes * 60);
      } else {
        toast.info("☕ Istirahat selesai! Siap untuk sesi fokus berikutnya?");
        setMode("pomodoro");
        setTimeLeft(MODE_CONFIG.pomodoro.defaultMinutes * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, playCompletionChime]);

  // Switch Mode Handler
  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(MODE_CONFIG[newMode].defaultMinutes * 60);
  };

  // Reset Handler
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_CONFIG[mode].defaultMinutes * 60);
  };

  // Format Time (MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const totalTimeForMode = MODE_CONFIG[mode].defaultMinutes * 60;
  const progressPercentage = Math.round(((totalTimeForMode - timeLeft) / totalTimeForMode) * 100);

  const CurrentModeIcon = MODE_CONFIG[mode].icon;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-surface/90 hover:bg-surface border border-border/90 shadow-xl backdrop-blur-lg text-text-primary transition-all duration-200 hover:scale-105 active:scale-95 group"
        title="Buka Focus Pomodoro Timer"
      >
        <div className="w-6 h-6 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
          <Timer className="w-3.5 h-3.5 animate-pulse" />
        </div>
        <span className="text-xs font-bold font-mono">
          {formatTime(timeLeft)}
        </span>
        {isRunning && (
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        )}
      </button>
    );
  }

  return (
    <div
      className={`fixed z-40 transition-all duration-300 ease-out ${
        isMinimized
          ? "bottom-5 right-5 w-72"
          : "bottom-5 right-5 w-80 sm:w-96"
      } bg-surface/95 border border-border rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-secondary/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <span>Focus Timer</span>
              {completedSessions > 0 && (
                <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded-full bg-brand-500/10 text-brand-400 font-mono">
                  <Flame className="w-2.5 h-2.5" />
                  {completedSessions}
                </span>
              )}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors"
            title={soundEnabled ? "Suara Aktif" : "Suara Senyap"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors"
            title={isMinimized ? "Perbesar" : "Minimalkan"}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors"
            title="Sembunyikan"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      {isMinimized ? (
        /* Compact Minimized View */
        <div className="p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-lg font-bold font-mono text-text-primary">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[11px] text-text-secondary truncate">
              {MODE_CONFIG[mode].label}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`p-2 rounded-xl text-white shadow-sm transition-all active:scale-95 ${
                isRunning
                  ? "bg-amber-600 hover:bg-amber-500"
                  : "bg-brand-600 hover:bg-brand-500"
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={resetTimer}
              className="p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface-secondary border border-border"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Full Expanded View */
        <div className="p-5 space-y-4">
          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-surface-secondary border border-border">
            {(["pomodoro", "shortBreak", "longBreak"] as TimerMode[]).map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all flex items-center justify-center gap-1 ${
                    active
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
                  }`}
                >
                  <span>{MODE_CONFIG[m].label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Center Digital Clock & Circular Progress */}
          <div className="flex flex-col items-center justify-center py-2 space-y-1">
            <div className="relative flex items-center justify-center">
              <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-text-primary">
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-text-tertiary font-medium">
              <CurrentModeIcon className="w-3.5 h-3.5 text-brand-400" />
              <span>{MODE_CONFIG[mode].label} ({MODE_CONFIG[mode].defaultMinutes} Menit)</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-surface-secondary h-1.5 rounded-full overflow-hidden border border-border/60">
            <div
              className="bg-brand-500 h-full transition-all duration-500 ease-linear rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Controls: Play/Pause, Reset, Skip */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={resetTimer}
              className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:bg-surface-tertiary text-text-secondary hover:text-text-primary transition-all active:scale-95"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-xs text-white shadow-lg transition-all active:scale-95 ${
                isRunning
                  ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/25"
                  : "bg-brand-600 hover:bg-brand-500 shadow-brand-500/25"
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Jeda Fokus</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Mulai Fokus</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setTimeLeft(0);
              }}
              className="p-2.5 rounded-xl border border-border bg-surface-secondary hover:bg-surface-tertiary text-text-secondary hover:text-text-primary transition-all active:scale-95"
              title="Lewati Sesi"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>

          {/* Ambient Sound Selector */}
          <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
            <span className="text-text-tertiary text-[11px]">Suara Latar Belakang:</span>
            <div className="flex items-center gap-1">
              {[
                { key: "none", label: "Mati" },
                { key: "rain", label: "🌧️ Hujan" },
                { key: "whitenoise", label: "🌊 White Noise" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setAmbientAudio(opt.key as any)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                    ambientAudio === opt.key
                      ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                      : "text-text-tertiary hover:text-text-primary hover:bg-surface-secondary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
