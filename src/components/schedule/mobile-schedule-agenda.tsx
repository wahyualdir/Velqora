"use client";

import React, { useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileBottomSheet } from "@/components/layout/mobile/mobile-bottom-sheet";
import { ScheduleItem } from "@/types";
import { cn } from "@/lib/utils";

interface MobileScheduleAgendaProps {
  items: ScheduleItem[];
  onAdd: () => void;
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
  onFeedback: (item: ScheduleItem) => void;
}

export function MobileScheduleAgenda({
  items,
  onAdd,
  onEdit,
  onDelete,
  onFeedback,
}: MobileScheduleAgendaProps) {
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);

  // Group items by Day
  const groupedDays = useMemo(() => {
    const daysOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    const groups: { day: string; items: ScheduleItem[] }[] = [];

    daysOrder.forEach((day) => {
      const dayItems = items.filter(
        (it) => it.day.toLowerCase() === day.toLowerCase()
      );
      if (dayItems.length > 0) {
        // sort by startTime
        dayItems.sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));
        groups.push({ day, items: dayItems });
      }
    });

    // Capture items with other days
    const otherItems = items.filter(
      (it) => !daysOrder.some((d) => d.toLowerCase() === it.day.toLowerCase())
    );
    if (otherItems.length > 0) {
      groups.push({ day: "Lainnya", items: otherItems });
    }

    return groups;
  }, [items]);

  return (
    <div className="space-y-4 pb-8">
      {groupedDays.length === 0 ? (
        <div className="p-6 rounded-2xl border border-border bg-surface text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">
            Belum ada jadwal perkuliahan
          </h3>
          <p className="text-xs text-text-secondary max-w-xs mx-auto">
            Tambahkan jadwal mata kuliah atau sesi belajar mandiri Anda.
          </p>
          <Button size="sm" onClick={onAdd} className="text-xs gap-1.5 rounded-lg">
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Jadwal</span>
          </Button>
        </div>
      ) : (
        groupedDays.map((group) => (
          <div key={group.day} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono">
                {group.day}
              </h3>
              <span className="text-[10px] font-mono text-text-tertiary">
                ({group.items.length} sesi)
              </span>
            </div>

            <div className="rounded-2xl border border-border/80 bg-surface divide-y divide-border/60 overflow-hidden shadow-2xs">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="p-3.5 hover:bg-surface-secondary/40 active:bg-surface-secondary/70 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary truncate">
                        {item.title}
                      </span>
                      {item.type && (
                        <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-surface-secondary text-text-tertiary uppercase">
                          {item.type}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-text-tertiary flex-wrap font-mono">
                      <div className="flex items-center gap-1 text-brand-500 font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>
                          {item.start_time} - {item.end_time}
                        </span>
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-1 text-text-secondary">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-[100px]">{item.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      className="p-1 rounded-lg text-text-tertiary hover:text-text-primary"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Floating Add CTA on Mobile */}
      <div className="fixed bottom-20 right-4 z-30 md:hidden">
        <Button
          size="lg"
          onClick={onAdd}
          className="h-12 px-4 rounded-full shadow-xl bg-brand-500 hover:bg-brand-600 text-white gap-2 font-semibold text-xs active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal</span>
        </Button>
      </div>

      {/* Mobile Schedule Detail Sheet */}
      {selectedItem && (
        <MobileBottomSheet
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.title}
        >
          <div className="space-y-4 pt-1">
            <div className="p-3.5 rounded-xl bg-surface-secondary/50 border border-border/80 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary">Hari & Waktu</span>
                <span className="font-mono font-semibold text-text-primary">
                  {selectedItem.day}, {selectedItem.start_time} - {selectedItem.end_time}
                </span>
              </div>

              {selectedItem.location && (
                <div className="flex items-center justify-between">
                  <span className="text-text-tertiary">Ruangan / Lokasi</span>
                  <span className="font-medium text-text-primary">
                    {selectedItem.location}
                  </span>
                </div>
              )}

              {selectedItem.lecturer && (
                <div className="flex items-center justify-between">
                  <span className="text-text-tertiary">Dosen Pengampu</span>
                  <span className="text-text-secondary">
                    {selectedItem.lecturer}
                  </span>
                </div>
              )}

              {selectedItem.subject && (
                <div className="pt-2 border-t border-border/60">
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Mata Kuliah: {selectedItem.subject}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-1">
              <Button
                variant="outline"
                onClick={() => {
                  onFeedback(selectedItem);
                  setSelectedItem(null);
                }}
                className="w-full h-11 rounded-xl font-semibold text-xs gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Catat Hasil & Kehadiran Sesi</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  onEdit(selectedItem);
                  setSelectedItem(null);
                }}
                className="w-full h-11 rounded-xl font-semibold text-xs gap-2"
              >
                <Edit2 className="w-4 h-4 text-text-tertiary" />
                <span>Ubah Jadwal</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  onDelete(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="w-full h-11 rounded-xl text-rose-500 hover:bg-rose-500/10 font-semibold text-xs gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Jadwal</span>
              </Button>
            </div>
          </div>
        </MobileBottomSheet>
      )}
    </div>
  );
}
