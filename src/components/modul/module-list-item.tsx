"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Code2,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
  Pencil,
  Trash2,
  ExternalLink,
  Github,
  Play,
  CheckSquare,
  Square,
  FileCode,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { toggleChapterComplete } from "@/actions/study-actions";
import { ModuleDriveFile, extractModuleDriveFromNotes } from "@/types/module-drive";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";

interface ModuleListItemProps {
  module: any;
  currentUserId?: string | null;
  isAdmin?: boolean;
  isBookmarked: boolean;
  onToggleBookmark: (item: any) => void;
  onEdit: (module: any) => void;
  onDelete: (id: string) => void;
  onFilePreview?: (file: ModuleDriveFile) => void;
}

export function ModuleListItem({
  module,
  currentUserId,
  isAdmin = false,
  isBookmarked,
  onToggleBookmark,
  onEdit,
  onDelete,
  onFilePreview,
}: ModuleListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [chapters, setChapters] = useState<any[]>(module.chapters || []);
  const [togglingChapterId, setTogglingChapterId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isProject = module.kind === "project";
  const canModify = isAdmin || (currentUserId && module.user_id === currentUserId);

  // Extract attached files
  const driveFiles: ModuleDriveFile[] = React.useMemo(() => {
    const driveData = extractModuleDriveFromNotes(module.notes || "");
    return driveData?.files || [];
  }, [module.notes]);

  // Chapter completion stats
  const totalChapters = chapters.length;
  const completedChapters = chapters.filter((c) => c.is_completed).length;

  const handleToggleChapter = async (chapterId: string, currentStatus: boolean) => {
    setTogglingChapterId(chapterId);
    try {
      await toggleChapterComplete(chapterId, module.id, !currentStatus);
      setChapters((prev) =>
        prev.map((ch) =>
          ch.id === chapterId ? { ...ch, is_completed: !currentStatus } : ch
        )
      );
      toast.success(
        !currentStatus ? "Bab diselesaikan!" : "Status bab diperbarui."
      );
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah status bab.");
    } finally {
      setTogglingChapterId(null);
    }
  };

  return (
    <div className="vt-window rounded-none overflow-hidden shadow-xs text-left bg-[#FAF8F5] mb-3">
      {/* Mini Titlebar Header */}
      <div className="px-3 py-1 bg-[#ECE9D8] border-b border-[#7A756D] flex items-center justify-between text-[11px] font-mono text-[#524B42] select-none">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isProject ? "bg-blue-600" : "bg-[#C2553A]"
            }`}
          />
          <span className="font-bold text-[#1C1917] truncate uppercase tracking-wider">
            {isProject ? "PROJ" : "MOD"}_{module.id ? String(module.id).slice(0, 8).toUpperCase() : "ITEM"}
          </span>
          <span className="text-[#8A8378] hidden sm:inline">·</span>
          <span className="text-[#853827] font-bold hidden sm:inline uppercase">
            {module.category?.name || "Umum"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono">
          <span className="px-1.5 py-0.2 bg-[#FAF8F5] border border-[#7A756D]/40 text-[#853827] font-bold">
            {isProject ? "PROYEK KODE" : "MODUL BELAJAR"}
          </span>
        </div>
      </div>

      {/* Main List Item Body */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          {/* Left: Icon, Type, Title & Category */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div
              className={`w-9 h-9 border-t-2 border-l-2 border-[#7A756D] border-b border-r border-[#FFFFFF] flex items-center justify-center shrink-0 mt-0.5 ${
                isProject
                  ? "bg-blue-50 text-blue-700"
                  : "bg-[#FAF3EF] text-[#C2553A]"
              }`}
            >
              {isProject ? <Code2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#ECE9D8] border border-[#7A756D]/40 text-[#1C1917]">
                  {module.category?.name || "Umum"}
                </span>

                {module.level && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#FAF8F5] border border-[#7A756D]/40 text-[#524B42]">
                    {module.level === "pemula"
                      ? "Pemula"
                      : module.level === "menengah"
                      ? "Menengah"
                      : "Lanjutan"}
                  </span>
                )}

                {totalChapters > 0 && (
                  <span className="text-[11px] font-mono text-[#524B42]">
                    {completedChapters}/{totalChapters} Bab Selesai
                  </span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-[#1C1917] tracking-tight font-sans">
                {module.title}
              </h3>

              {module.description && (
                <p className="text-xs sm:text-sm text-[#524B42] leading-relaxed line-clamp-2 max-w-3xl">
                  {module.description}
                </p>
              )}

              {/* Project Meta: GitHub & Live Demo links */}
              {isProject && (module.github_url || module.demo_url) && (
                <div className="flex items-center gap-3 pt-1 flex-wrap text-xs font-mono">
                  {module.github_url && (
                    <a
                      href={module.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-bold text-[#524B42] hover:text-[#C2553A] hover:underline transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  )}
                  {module.demo_url && (
                    <a
                      href={module.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-bold text-emerald-700 hover:underline"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start pt-1 sm:pt-0">
            <button
              type="button"
              onClick={() => onToggleBookmark(module)}
              className={`p-1.5 vt-btn-chrome cursor-pointer ${
                isBookmarked ? "text-amber-600 font-bold" : "text-[#524B42]"
              }`}
              title={isBookmarked ? "Hapus dari Bookmark" : "Simpan ke Bookmark"}
              aria-label={isBookmarked ? "Hapus dari Bookmark" : "Simpan ke Bookmark"}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-amber-600" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {canModify && (
              <>
                <button
                  type="button"
                  onClick={() => onEdit(module)}
                  className="p-1.5 vt-btn-chrome text-[#524B42] hover:text-[#1C1917] cursor-pointer"
                  title="Edit Modul"
                  aria-label={`Edit modul ${module.title}`}
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1.5 vt-btn-chrome text-rose-700 hover:text-rose-800 cursor-pointer"
                  title="Hapus Modul"
                  aria-label={`Hapus modul ${module.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            {(totalChapters > 0 || driveFiles.length > 0) && (
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="vt-btn-chrome text-xs font-mono font-bold flex items-center gap-1 py-1.5 px-2.5 cursor-pointer ml-1"
                aria-expanded={isExpanded}
              >
                <span>{isExpanded ? "Tutup Silabus" : "Lihat Silabus"}</span>
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Syllabus & Files Section */}
      {isExpanded && (
        <div className="border-t-2 border-[#7A756D]/30 bg-[#ECE9D8]/50 p-4 sm:p-5 space-y-4">
          {/* 1. Chapter list */}
          {totalChapters > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#853827] uppercase tracking-wider font-mono flex items-center justify-between">
                <span>Daftar Bab & Silabus Pembelajaran</span>
                <span className="text-[11px] font-normal text-[#524B42] lowercase">
                  centang untuk menandai tuntas
                </span>
              </h4>

              <div className="divide-y divide-[#7A756D]/20 border-t-2 border-l-2 border-[#7A756D] border-b border-r border-[#FFFFFF] bg-[#FFFFFF] overflow-hidden">
                {chapters.map((chapter, index) => (
                  <div
                    key={chapter.id || index}
                    className="flex items-center justify-between p-2.5 sm:px-3 hover:bg-[#FAF8F5] transition-colors text-xs font-mono"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleChapter(chapter.id, chapter.is_completed)
                        }
                        disabled={togglingChapterId === chapter.id}
                        className="text-[#8A8378] hover:text-[#C2553A] cursor-pointer disabled:opacity-50 transition-colors shrink-0"
                        title={
                          chapter.is_completed
                            ? "Tandai belum selesai"
                            : "Tandai selesai"
                        }
                        aria-label={`Ubah status bab ${chapter.title}`}
                      >
                        {chapter.is_completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-[#8A8378]" />
                        )}
                      </button>
                      <span
                        className={`truncate font-medium font-sans text-xs ${
                          chapter.is_completed
                            ? "line-through text-[#8A8378]"
                            : "text-[#1C1917]"
                        }`}
                      >
                        {index + 1}. {chapter.title}
                      </span>
                    </div>

                    {chapter.duration_minutes && (
                      <span className="text-[10.5px] font-mono text-[#8A8378] shrink-0">
                        {chapter.duration_minutes} mnt
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Attached Drive Files */}
          {driveFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#853827] uppercase tracking-wider font-mono">
                Berkas & Lampiran Terkait ({driveFiles.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {driveFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2.5 border-t-2 border-l-2 border-[#7A756D] border-b border-r border-[#FFFFFF] bg-[#FFFFFF] hover:bg-[#FAF8F5] transition-colors text-xs font-mono"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCode className="w-3.5 h-3.5 text-[#C2553A] shrink-0" />
                      <span className="truncate text-[#1C1917] font-medium font-sans">
                        {file.name}
                      </span>
                    </div>
                    {onFilePreview && (
                      <button
                        type="button"
                        onClick={() => onFilePreview(file)}
                        className="text-[11px] font-bold text-[#C2553A] hover:underline shrink-0 ml-2 cursor-pointer"
                      >
                        Pratinjau
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete(module.id);
        }}
        title="Hapus Modul Ini?"
        message={`Apakah Anda yakin ingin menghapus "${module.title}"? Semua bab dan riwayat terkait akan terhapus secara permanen.`}
        confirmText="Hapus Modul"
      />
    </div>
  );
}
