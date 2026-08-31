"use client";

import React, { useState } from "react";
import {
  Sparkles,
  PlusCircle,
  RefreshCw,
  MinusCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScheduleDiffItem, ScheduleDiffResult } from "@/lib/schedule-intelligence/types";
import { importScheduleWithUpdateModeAction } from "@/actions/schedule-actions";
import { toast } from "sonner";

interface ScheduleChangeReviewProps {
  diffResult: ScheduleDiffResult;
  onSuccess: (savedSchedules: any[]) => void;
  onCancel: () => void;
}

export function ScheduleChangeReview({
  diffResult,
  onSuccess,
  onCancel,
}: ScheduleChangeReviewProps) {
  const [activeTab, setActiveTab] = useState<"added" | "changed" | "unchanged" | "removed">("changed");
  const [diffItems, setDiffItems] = useState<ScheduleDiffItem[]>(diffResult.items);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setItemAction = (identityKey: string, action: ScheduleDiffItem["selectedAction"]) => {
    setDiffItems((prev) =>
      prev.map((item) => (item.identityKey === identityKey ? { ...item, selectedAction: action } : item))
    );
  };

  const addedItems = diffItems.filter((i) => i.diffType === "ADDED");
  const changedItems = diffItems.filter(
    (i) =>
      i.diffType === "TIME_CHANGED" ||
      i.diffType === "ROOM_CHANGED" ||
      i.diffType === "LECTURER_CHANGED" ||
      i.diffType === "DATE_CHANGED" ||
      i.diffType === "TITLE_CHANGED"
  );
  const unchangedItems = diffItems.filter((i) => i.diffType === "UNCHANGED");
  const removedItems = diffItems.filter((i) => i.diffType === "REMOVED");

  const currentList =
    activeTab === "added"
      ? addedItems
      : activeTab === "changed"
      ? changedItems
      : activeTab === "unchanged"
      ? unchangedItems
      : removedItems;

  const handleApplyChanges = async () => {
    setIsSubmitting(true);
    try {
      const res = await importScheduleWithUpdateModeAction({
        selectedDiffItems: diffItems,
      });

      if (!res.success && res.errors.length > 0) {
        toast.error(`Beberapa jadwal gagal diperbarui: ${res.errors[0]}`);
      } else {
        toast.success(
          `Pembaruan selesai: ${res.addedCount} ditambahkan, ${res.updatedCount} diperbarui, ${res.removedCount} dihapus.`
        );
        onSuccess(res.savedSchedules);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menerapkan pembaruan jadwal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Summary */}
      <div className="p-4 rounded-xl border border-brand-500/30 bg-brand-500/10 space-y-1">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-700 dark:text-brand-300">
          <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
          <span>Mode Perbarui Jadwal Terdeteksi</span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          {diffResult.summary} Pilih aksi yang ingin diterapkan untuk setiap perubahan jadwal.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-surface-secondary/70 rounded-xl border border-border/80 text-xs overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("changed")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === "changed"
              ? "bg-surface text-amber-600 dark:text-amber-400 shadow-2xs"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Berubah ({changedItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("added")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === "added"
              ? "bg-surface text-emerald-600 dark:text-emerald-400 shadow-2xs"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Baru ({addedItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("unchanged")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === "unchanged"
              ? "bg-surface text-text-primary shadow-2xs"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Tetap ({unchangedItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("removed")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === "removed"
              ? "bg-surface text-rose-600 dark:text-rose-400 shadow-2xs"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <MinusCircle className="w-3.5 h-3.5" />
          <span>Hilang ({removedItems.length})</span>
        </button>
      </div>

      {/* Items List */}
      <div className="max-h-[340px] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
        {currentList.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-tertiary">
            Tidak ada jadwal dalam kategori ini.
          </div>
        ) : (
          currentList.map((item) => (
            <div
              key={item.identityKey}
              className="p-3.5 rounded-xl border border-border/80 bg-surface/70 space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-surface-secondary border border-border text-brand-600 dark:text-brand-400">
                      {item.incomingItem?.day || item.previousItem?.day}
                    </span>
                    <Badge
                      variant={
                        item.diffType === "ADDED"
                          ? "success"
                          : item.diffType === "UNCHANGED"
                          ? "neutral"
                          : item.diffType === "REMOVED"
                          ? "danger"
                          : "warning"
                      }
                      size="sm"
                    >
                      {item.diffType}
                    </Badge>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-text-primary truncate">
                    {item.incomingItem?.title || item.previousItem?.title}
                  </h4>
                </div>

                {/* Action Selector Buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  {item.diffType === "ADDED" && (
                    <>
                      <Button
                        size="sm"
                        variant={item.selectedAction === "ADD" ? "primary" : "outline"}
                        onClick={() => setItemAction(item.identityKey, "ADD")}
                        className="text-xs h-7 px-2.5"
                      >
                        Tambahkan
                      </Button>
                      <Button
                        size="sm"
                        variant={item.selectedAction === "IGNORE" ? "primary" : "outline"}
                        onClick={() => setItemAction(item.identityKey, "IGNORE")}
                        className="text-xs h-7 px-2.5"
                      >
                        Abaikan
                      </Button>
                    </>
                  )}

                  {item.diffType !== "ADDED" && item.diffType !== "REMOVED" && (
                    <>
                      <Button
                        size="sm"
                        variant={item.selectedAction === "UPDATE" ? "primary" : "outline"}
                        onClick={() => setItemAction(item.identityKey, "UPDATE")}
                        className="text-xs h-7 px-2.5"
                      >
                        Perbarui
                      </Button>
                      <Button
                        size="sm"
                        variant={item.selectedAction === "KEEP_OLD" ? "primary" : "outline"}
                        onClick={() => setItemAction(item.identityKey, "KEEP_OLD")}
                        className="text-xs h-7 px-2.5"
                      >
                        Pertahankan
                      </Button>
                    </>
                  )}

                  {item.diffType === "REMOVED" && (
                    <>
                      <Button
                        size="sm"
                        variant={item.selectedAction === "KEEP_OLD" ? "primary" : "outline"}
                        onClick={() => setItemAction(item.identityKey, "KEEP_OLD")}
                        className="text-xs h-7 px-2.5"
                      >
                        Tetap Simpan
                      </Button>
                      <Button
                        size="sm"
                        variant={item.selectedAction === "REMOVE" ? "danger" : "outline"}
                        onClick={() => setItemAction(item.identityKey, "REMOVE")}
                        className="text-xs h-7 px-2.5"
                      >
                        Hapus
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Field Comparison Box */}
              {item.changes.length > 0 && (
                <div className="p-2.5 rounded-lg bg-surface-secondary/40 border border-border/50 text-[11px] space-y-1">
                  {item.changes.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2 flex-wrap text-text-secondary">
                      <span className="font-semibold text-text-primary capitalize">{c.field}:</span>
                      {c.previousValue && (
                        <span className="line-through text-rose-500 font-mono">{String(c.previousValue)}</span>
                      )}
                      <ArrowRight className="w-3 h-3 text-text-tertiary" />
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {String(c.newValue)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={isSubmitting}>
          Batal
        </Button>

        <Button
          size="sm"
          onClick={handleApplyChanges}
          disabled={isSubmitting}
          className="gap-1.5 font-semibold"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isSubmitting ? "Menyimpan..." : "Terapkan Perubahan"}</span>
        </Button>
      </div>
    </div>
  );
}
