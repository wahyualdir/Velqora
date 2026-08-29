"use client";

import React from "react";
import { History, FileText, CheckCircle2, Calendar } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScheduleImportHistoryItem } from "@/types/schedule";

interface ScheduleImportHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyItems: ScheduleImportHistoryItem[];
  onClearHistory?: () => void;
}

export function ScheduleImportHistoryModal({
  isOpen,
  onClose,
  historyItems,
  onClearHistory,
}: ScheduleImportHistoryModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Riwayat Import Jadwal Akademik"
      className="max-w-2xl"
    >
      <div className="space-y-4">
        <p className="text-xs text-text-secondary">
          Daftar dokumen akademik yang telah diproses dan disimpan ke jadwal Anda. Isi dokumen asli tidak disimpan untuk menjaga privasi akademik Anda.
        </p>

        {historyItems.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-3 rounded-2xl border border-dashed border-border bg-surface-secondary/40">
            <div className="inline-flex p-3 rounded-xl bg-brand-500/10 text-brand-500 mx-auto">
              <History className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-text-primary">Belum Ada Riwayat Import</p>
              <p className="text-xs text-text-tertiary max-w-xs mx-auto">
                Unggah dokumen PDF, Excel, Word, atau CSV Anda untuk mulai mencatat riwayat import jadwal.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary/50 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-xs font-bold text-text-primary truncate">
                      {item.sourceFileName}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-text-tertiary font-mono">
                      <span>{item.fileSizeFormatted}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.importedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="success" className="gap-1 font-mono text-[11px]">
                    <CheckCircle2 className="w-3 h-3" /> {item.eventCount} Jadwal
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border">
          {historyItems.length > 0 && onClearHistory ? (
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs font-mono text-text-tertiary hover:text-rose-500 transition-colors"
            >
              Bersihkan Riwayat
            </button>
          ) : (
            <div />
          )}

          <Button variant="outline" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
}
