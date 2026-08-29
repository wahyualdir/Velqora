"use client";

import React, { useState, useEffect } from "react";
import { CheckSquare, Users, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export function NotificationSettings() {
  const [taskNotifs, setTaskNotifs] = useState(true);
  const [classNotifs, setClassNotifs] = useState(true);
  const [systemNotifs, setSystemNotifs] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("velqora_notif_tasks");
      if (t !== null) setTaskNotifs(t === "true");
      const c = localStorage.getItem("velqora_notif_classes");
      if (c !== null) setClassNotifs(c === "true");
      const s = localStorage.getItem("velqora_notif_system");
      if (s !== null) setSystemNotifs(s === "true");
    }
  }, []);

  const handleToggle = (
    key: "tasks" | "classes" | "system",
    current: boolean,
    setter: (val: boolean) => void,
    label: string
  ) => {
    const nextVal = !current;
    setter(nextVal);
    localStorage.setItem(`velqora_notif_${key}`, String(nextVal));
    toast.success(`Pemberitahuan ${label} ${nextVal ? "diaktifkan" : "dinonaktifkan"}.`);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-border pb-3 space-y-1">
        <h2 className="text-base sm:text-lg font-bold text-text-primary">
          Pengaturan Notifikasi
        </h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          Atur bagaimana Velqora memberi tahu Anda mengenai tenggat waktu tugas, aktivitas kelas, dan sistem.
        </p>
      </div>

      {/* Notification Rows */}
      <div className="space-y-4">
        {/* 1. Tasks & Deadlines */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center shrink-0 border border-border text-brand-600 dark:text-brand-400">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <h3 className="text-xs sm:text-sm font-semibold text-text-primary">
                Tugas & Tenggat Waktu
              </h3>
              <p className="text-xs text-text-secondary">
                Pemberitahuan otomatis ketika tugas akademik mendekati batas waktu pengumpulan.
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={taskNotifs}
            onClick={() => handleToggle("tasks", taskNotifs, setTaskNotifs, "tugas")}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
              taskNotifs ? "bg-brand-500 justify-end" : "bg-surface-secondary border border-border justify-start"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                taskNotifs ? "shadow-2xs" : "bg-text-tertiary"
              }`}
            />
          </button>
        </div>

        {/* 2. Classes & Collaboration */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center shrink-0 border border-border text-sky-500">
              <Users className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <h3 className="text-xs sm:text-sm font-semibold text-text-primary">
                Aktivitas Ruang Kelas
              </h3>
              <p className="text-xs text-text-secondary">
                Pemberitahuan pengumuman penting, modul baru, atau tugas baru dari pengajar kelas.
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={classNotifs}
            onClick={() => handleToggle("classes", classNotifs, setClassNotifs, "kelas")}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
              classNotifs ? "bg-brand-500 justify-end" : "bg-surface-secondary border border-border justify-start"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                classNotifs ? "shadow-2xs" : "bg-text-tertiary"
              }`}
            />
          </button>
        </div>

        {/* 3. System Updates */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center shrink-0 border border-border text-amber-500">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <h3 className="text-xs sm:text-sm font-semibold text-text-primary">
                Pemberitahuan Sistem
              </h3>
              <p className="text-xs text-text-secondary">
                Informasi pembaruan platform, pemeliharaan server, dan keamanan akun.
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={systemNotifs}
            onClick={() => handleToggle("system", systemNotifs, setSystemNotifs, "sistem")}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
              systemNotifs ? "bg-brand-500 justify-end" : "bg-surface-secondary border border-border justify-start"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                systemNotifs ? "shadow-2xs" : "bg-text-tertiary"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
