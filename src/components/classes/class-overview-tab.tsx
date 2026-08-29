"use client";

import React, { useState } from "react";
import { Send, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/dialog";
import { AnnouncementItem } from "@/lib/class-service";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface ClassOverviewTabProps {
  classId?: string;
  announcements: AnnouncementItem[];
  userName: string;
  userEmail: string;
  isAdmin: boolean;
  onPostAnnouncement: (content: string) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export function ClassOverviewTab({
  classId: _classId,
  announcements,
  userName,
  userEmail,
  isAdmin,
  onPostAnnouncement,
  onDeleteAnnouncement,
}: ClassOverviewTabProps) {
  const [content, setContent] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Tuliskan pesan pengumuman terlebih dahulu.");
      return;
    }

    onPostAnnouncement(content.trim());
    setContent("");
    toast.success("Pengumuman berhasil diposting!");
  };

  return (
    <div className="space-y-6">
      {/* Post Announcement Box */}
      <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-text-primary">
              Bagikan Pengumuman ke Kelas
            </h3>
            <p className="text-[11px] text-text-secondary">
              Posting informasi kuliah, perubahan jadwal, atau instruksi umum.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tuliskan pengumuman atau pesan untuk seluruh anggota kelas..."
            rows={3}
            className="text-xs sm:text-sm"
          />

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              size="sm"
              className="gap-1.5 text-xs font-semibold"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Posting Pengumuman</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Announcement Stream */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-text-secondary px-1">
          Aktivitas & Pengumuman Terbaru
        </h3>

        {announcements.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-8 h-8" />}
            title="Belum ada pengumuman"
            description="Belum ada pengumuman yang diposting di ruang kelas ini."
          />
        ) : (
          <div className="space-y-3">
            {announcements.map((item) => {
              const canDelete = item.authorEmail === userEmail || isAdmin;

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-surface-secondary border border-border flex items-center justify-center text-xs font-bold text-text-primary">
                        {item.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                          {item.authorName}
                        </h4>
                        <span className="text-[10px] font-mono text-text-tertiary">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </div>

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => setDeleteId(item.id)}
                        className="p-1.5 rounded-lg border border-border bg-surface hover:bg-rose-500/10 hover:border-rose-500/30 text-text-tertiary hover:text-rose-500 transition-colors cursor-pointer"
                        title="Hapus Pengumuman"
                        aria-label="Hapus pengumuman"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                    {item.content}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            onDeleteAnnouncement(deleteId);
            setDeleteId(null);
            toast.success("Pengumuman berhasil dihapus.");
          }
        }}
        title="Hapus Pengumuman?"
        message="Apakah Anda yakin ingin menghapus postingan pengumuman ini?"
        confirmText="Hapus"
      />
    </div>
  );
}
