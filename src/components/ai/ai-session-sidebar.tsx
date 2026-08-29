"use client";

import React, { useState } from "react";
import { MessageSquare, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

export interface ChatSessionItem {
  id: string;
  title: string;
  updatedAt: string;
  messages: any[];
}

interface AISessionSidebarProps {
  sessions: ChatSessionItem[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onCloseMobile?: () => void;
}

export function AISessionSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onCloseMobile,
}: AISessionSidebarProps) {
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);

  return (
    <aside className="w-full md:w-64 lg:w-72 rounded-xl border border-border bg-surface flex flex-col shrink-0 h-full max-h-[600px] overflow-hidden shadow-2xs">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary">
            Riwayat Sesi
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={onNewSession}
            className="p-1.5 h-auto text-text-secondary hover:text-brand-500"
            title="Buat Sesi Baru"
            aria-label="Sesi baru"
          >
            <Plus className="w-4 h-4" />
          </Button>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 rounded text-text-tertiary hover:text-text-primary md:hidden cursor-pointer"
              aria-label="Tutup riwayat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {sessions.length === 0 ? (
          <div className="p-4 text-center text-xs text-text-tertiary">
            Belum ada riwayat percakapan.
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = activeSessionId === session.id;

            return (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group flex items-center justify-between gap-2 p-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  isActive
                    ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                }`}
              >
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="truncate text-xs font-medium">
                    {session.title || "Sesi Baru"}
                  </p>
                  <span className="text-[10px] font-mono text-text-tertiary block">
                    {formatDate(session.updatedAt)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteSessionId(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-rose-500 text-text-tertiary transition-opacity cursor-pointer"
                  title="Hapus sesi ini"
                  aria-label="Hapus sesi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteSessionId)}
        onClose={() => setDeleteSessionId(null)}
        onConfirm={() => {
          if (deleteSessionId) {
            onDeleteSession(deleteSessionId);
            setDeleteSessionId(null);
          }
        }}
        title="Hapus Sesi Belajar?"
        message="Apakah Anda yakin ingin menghapus riwayat sesi percakapan ini?"
        confirmText="Hapus Sesi"
      />
    </aside>
  );
}
