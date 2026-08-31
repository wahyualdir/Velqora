"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2, Sparkles, GraduationCap, Crown } from "lucide-react";
import Link from "next/link";
import { getUrgentClassroomAlerts } from "@/lib/classroom-sync";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "quiz" | "class" | "tier" | "system";
  read: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    title: "Kuis AI Interaktif Siap Digunakan",
    message: "Uji pemahaman Anda tentang Python, Next.js, atau berkas materi modul Anda.",
    time: "Baru saja",
    type: "quiz",
    read: false,
    link: "/dashboard/kuis-ai",
  },
  {
    id: "n2",
    title: "Fitur Ruang Kelas Aktif",
    message: "Anda dapat bergabung dengan kode 6 digit atau membuat kelas sebagai Pengajar.",
    time: "10 menit lalu",
    type: "class",
    read: false,
    link: "/dashboard/kelas",
  },
  {
    id: "n3",
    title: "AI Tutor Multimodal Aktif",
    message: "Nikmati akses Google Gemini Flash untuk obrolan pintar materi kuliah.",
    time: "1 jam lalu",
    type: "tier",
    read: false,
    link: "/dashboard/ai-tutor",
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    // Check urgent classroom alerts
    const alerts = getUrgentClassroomAlerts();
    if (alerts.length > 0) {
      setNotifications((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newItems = alerts.filter((a) => !existingIds.has(a.id));
        return [...newItems, ...prev];
      });
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleItemClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Button with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Lonceng Notifikasi"
        className="relative p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-secondary border border-border transition-all duration-150"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[9px] font-mono font-bold text-white shadow-2xs">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-border bg-surface shadow-xl z-50 overflow-hidden animate-fade-in">
          {/* Popover Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-primary tracking-tight">Notifikasi Sistem</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-500/15 text-brand-500 border border-brand-500/25">
                  {unreadCount} Baru
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  title="Tandai semua dibaca"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  title="Hapus semua"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/[0.06] transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04] scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">Tidak ada notifikasi saat ini.</p>
              </div>
            ) : (
              notifications.map((item) => {
                const content = (
                  <div
                    className={`p-3.5 sm:p-4 transition-colors flex items-start gap-3 hover:bg-white/[0.04] ${
                      !item.read ? "bg-white/[0.02]" : "opacity-75"
                    }`}
                  >
                    {/* Icon container */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border bg-brand-500/10 border-brand-500/30 text-brand-400"
                    >
                      {item.type === "quiz" ? (
                        <Sparkles className="w-4 h-4" />
                      ) : item.type === "class" ? (
                        <GraduationCap className="w-4 h-4" />
                      ) : (
                        <Crown className="w-4 h-4" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                        <span className="text-[10px] text-slate-500 shrink-0 font-mono">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{item.message}</p>
                    </div>

                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1" />
                    )}
                  </div>
                );

                if (item.link) {
                  return (
                    <Link
                      key={item.id}
                      href={item.link}
                      onClick={() => handleItemClick(item.id)}
                      className="block"
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <div key={item.id} onClick={() => handleItemClick(item.id)} className="cursor-pointer">
                    {content}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
