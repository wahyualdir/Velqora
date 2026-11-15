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
import { ConfirmDialog } from "@/components/ui/dialog";
import { toggleChapterComplete } from "@/actions/study-actions";
import { ModuleDriveFile, extractModuleDriveFromNotes } from "@/types/module-drive";
import { toast } from "sonner";

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
    <div className="vt-window rounded-2xl overflow-hidden text-left bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] mb-3.5 transition-colors">
      {/* Editorial Top Strip */}
      <div className="px-4 py-2 bg-[#F3EFE9]/75 dark:bg-[#1C1917]/80 border-b border-[#E4DDD4] dark:border-[#292524] flex items-center justify-between text-[11px] font-mono text-[#524B42] dark:text-[#A8A29E] select-none">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isProject ? "bg-sky-600 dark:bg-sky-400" : "bg-[#C2553A] dark:bg-[#D4664A]"
            }`}
          />
          <span className="font-semibold text-[#1C1917] dark:text-[#F5F5F4] truncate uppercase tracking-wider">
            {isProject ? "PROJ" : "MOD"}_{module.id ? String(module.id).slice(0, 8).toUpperCase() : "ITEM"}
          </span>
          <span className="text-[#8A8378] dark:text-[#8C857F] hidden sm:inline">·</span>
          <span className="text-[#C2553A] dark:text-[#D4664A] font-semibold hidden sm:inline uppercase">
            {module.category?.name || "Umum"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded-md bg-[#FFFFFF] dark:bg-[#141210] border border-[#E4DDD4] dark:border-[#292524] text-[#C2553A] dark:text-[#D4664A] font-semibold">
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
              className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${
                isProject
                  ? "bg-sky-50 dark:bg-sky-500/12 border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-400"
                  : "bg-[#FAF3EF] dark:bg-[#D4664A]/12 border-[#C2553A]/20 dark:border-[#D4664A]/30 text-[#C2553A] dark:text-[#D4664A]"
              }`}
            >
              {isProject ? <Code2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono text-[#8A8378] dark:text-[#8C857F]">
                <span className="uppercase tracking-wider font-semibold text-[#524B42] dark:text-[#A8A29E]">
                  {module.category?.name || "Umum"}
                </span>

                {module.level && (
                  <>
                    <span>•</span>
                    <span className="uppercase tracking-wider">
                      {module.level === "pemula"
                        ? "Pemula"
                        : module.level === "menengah"
                        ? "Menengah"
                        : "Lanjutan"}
                    </span>
                  </>
                )}

                {totalChapters > 0 && (
                  <>
                    <span>•</span>
                    <span>
                      {completedChapters}/{totalChapters} Bab Selesai
                    </span>
                  </>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-[#1C1917] dark:text-[#F5F5F4] tracking-tight font-sans">
                {module.title}
              </h3>

              {module.description && (
                <p className="text-xs sm:text-sm text-[#524B42] dark:text-[#A8A29E] leading-relaxed line-clamp-2 max-w-3xl">
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
                      className="flex items-center gap-1 font-semibold text-[#524B42] dark:text-[#A8A29E] hover:text-[#C2553A] dark:hover:text-[#D4664A] hover:underline transition-colors"
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
                      className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-[#34D399] hover:underline"
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
              className={`p-1.5 vt-btn-chrome rounded-lg cursor-pointer ${
                isBookmarked ? "text-amber-600 dark:text-[#E5C194] font-semibold" : "text-[#524B42] dark:text-[#A8A29E]"
              }`}
              title={isBookmarked ? "Hapus dari Bookmark" : "Simpan ke Bookmark"}
              aria-label={isBookmarked ? "Hapus dari Bookmark" : "Simpan ke Bookmark"}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-amber-600 dark:text-[#E5C194]" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {canModify && (
              <>
                <button
                  type="button"
                  onClick={() => onEdit(module)}
                  className="p-1.5 vt-btn-chrome rounded-lg text-[#524B42] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F5F4] cursor-pointer"
                  title="Edit Modul"
                  aria-label={`Edit modul ${module.title}`}
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1.5 vt-btn-chrome rounded-lg text-rose-700 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 cursor-pointer"
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
                className="vt-btn-chrome rounded-lg text-xs font-mono font-semibold flex items-center gap-1 py-1.5 px-3 cursor-pointer ml-1"
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
        <div className="border-t border-[#E4DDD4] dark:border-[#292524] bg-[#FAF8F5] dark:bg-[#100E0D] p-4 sm:p-5 space-y-4">
          {/* 1. Chapter list */}
          {totalChapters > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[#C2553A] dark:text-[#D4664A] uppercase tracking-wider font-mono flex items-center justify-between">
                <span>Daftar Bab &amp; Silabus Pembelajaran</span>
                <span className="text-[11px] font-normal text-[#8A8378] dark:text-[#8C857F] lowercase">
                  centang untuk menandai tuntas
                </span>
              </h4>

              <div className="divide-y divide-[#E4DDD4] dark:divide-[#292524] rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-[#FFFFFF] dark:bg-[#141210] overflow-hidden">
                {chapters.map((chapter, index) => (
                  <div
                    key={chapter.id || index}
                    className="flex items-center justify-between p-3 sm:px-3.5 hover:bg-[#FAF8F5] dark:hover:bg-[#1C1917] transition-colors text-xs font-mono"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleChapter(chapter.id, chapter.is_completed)
                        }
                        disabled={togglingChapterId === chapter.id}
                        className="text-[#8A8378] dark:text-[#8C857F] hover:text-[#C2553A] dark:hover:text-[#D4664A] cursor-pointer disabled:opacity-50 transition-colors shrink-0"
                        title={
                          chapter.is_completed
                            ? "Tandai belum selesai"
                            : "Tandai selesai"
                        }
                        aria-label={`Ubah status bab ${chapter.title}`}
                      >
                        {chapter.is_completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-[#34D399]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#8A8378] dark:text-[#8C857F]" />
                        )}
                      </button>
                      <span
                        className={`truncate font-medium font-sans text-xs ${
                          chapter.is_completed
                            ? "line-through text-[#8A8378] dark:text-[#8C857F]"
                            : "text-[#1C1917] dark:text-[#F5F5F4]"
                        }`}
                      >
                        {index + 1}. {chapter.title}
                      </span>
                    </div>

                    {chapter.duration_minutes && (
                      <span className="text-[10.5px] font-mono text-[#8A8378] dark:text-[#8C857F] shrink-0">
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
              <h4 className="text-xs font-semibold text-[#C2553A] dark:text-[#D4664A] uppercase tracking-wider font-mono">
                Berkas &amp; Lampiran Terkait ({driveFiles.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {driveFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#E4DDD4] dark:border-[#292524] bg-[#FFFFFF] dark:bg-[#141210] hover:bg-[#FAF8F5] dark:hover:bg-[#1C1917] transition-colors text-xs font-mono"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCode className="w-3.5 h-3.5 text-[#C2553A] dark:text-[#D4664A] shrink-0" />
                      <span className="truncate text-[#1C1917] dark:text-[#F5F5F4] font-medium font-sans">
                        {file.name}
                      </span>
                    </div>
                    {onFilePreview && (
                      <button
                        type="button"
                        onClick={() => onFilePreview(file)}
                        className="text-[11px] font-semibold text-[#C2553A] dark:text-[#D4664A] hover:underline shrink-0 ml-2 cursor-pointer"
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
