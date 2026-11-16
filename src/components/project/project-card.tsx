"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Github,
  Play,
  Pencil,
  Trash2,
  Bookmark,
  BookmarkCheck,
  User,
  ArrowRight,
} from "lucide-react";
import { Project } from "@/types";
import { ConfirmDialog } from "@/components/ui/dialog";

interface ProjectCardProps {
  project: Project;
  currentUserId?: string | null;
  isAdmin?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

export function ProjectCard({
  project,
  currentUserId,
  isAdmin = false,
  isBookmarked = false,
  onToggleBookmark,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const canModify = Boolean(isAdmin || (currentUserId && project.user_id === currentUserId));

  const levelLabel =
    project.level === "pemula"
      ? "Pemula"
      : project.level === "menengah"
      ? "Menengah"
      : project.level === "lanjutan"
      ? "Lanjutan"
      : project.level;

  const levelColor =
    project.level === "pemula"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
      : project.level === "menengah"
      ? "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20"
      : "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";

  return (
    <div className="group relative rounded-2xl border border-[#E6E0D6] dark:border-[#24201E] bg-[#FFFFFF] dark:bg-[#141210] hover:border-[#C2553A]/35 dark:hover:border-[#D4664A]/40 shadow-2xs transition-colors flex flex-col justify-between overflow-hidden font-sans">
      {/* Top Header Card */}
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        {/* Category, Level, & Bookmark */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F3EFE9] dark:bg-[#1C1917] text-text-secondary">
              {project.category?.name || "Proyek AI"}
            </span>

            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${levelColor}`}>
              {levelLabel}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {onToggleBookmark && (
              <button
                type="button"
                onClick={() => onToggleBookmark(project)}
                className="p-1 text-text-tertiary hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
                title={isBookmarked ? "Hapus dari Bookmark" : "Simpan ke Bookmark"}
                aria-label="Toggle Bookmark"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4 text-brand-600 dark:text-brand-400 fill-brand-600/20" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            )}

            {canModify && (
              <>
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(project)}
                    className="p-1 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                    title="Edit Proyek"
                    aria-label="Edit Proyek"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-1 text-text-tertiary hover:text-rose-600 transition-colors cursor-pointer"
                    title="Hapus Proyek"
                    aria-label="Hapus Proyek"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Project Title */}
        <div>
          <Link
            href={`/dashboard/project/${project.id}`}
            className="font-bold font-display text-base text-text-primary hover:text-[#C2553A] dark:hover:text-[#F09A82] transition-colors line-clamp-2 inline-flex items-center gap-1 leading-snug"
          >
            <span>{project.title}</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-[13px] text-text-secondary leading-relaxed line-clamp-3 flex-1">
          {project.description || "Tidak ada deskripsi rinci untuk proyek ini."}
        </p>

        {/* Tech Stack Badges (Clean Pill, capped at 4 for uncluttered look) */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="pt-1 flex items-center gap-1.5 flex-wrap">
            {project.tech_stack.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FAF8F5] dark:bg-[#1C1917] text-text-secondary"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="text-[11px] text-text-tertiary font-medium">
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Card */}
      <div className="px-5 py-3 bg-[#FAF8F5]/70 dark:bg-[#1C1917]/60 border-t border-[#E6E0D6]/70 dark:border-[#24201E] flex items-center justify-between gap-2 text-xs text-text-secondary">
        <div className="flex items-center gap-1.5 truncate">
          <User className="w-3.5 h-3.5 shrink-0 text-text-tertiary" />
          <span className="truncate font-medium">{project.author_name || "Kontributor"}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {project.repository_url && (
            <a
              href={project.repository_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
              title="Kunjungi Repository GitHub"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Repo</span>
            </a>
          )}

          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-surface-secondary text-emerald-600 dark:text-emerald-400 hover:underline transition-colors flex items-center gap-1"
              title="Lihat Live Demo"
            >
              <Play className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Demo</span>
            </a>
          )}

          <Link
            href={`/dashboard/project/${project.id}`}
            className="px-3 py-1 rounded-lg bg-surface border border-border hover:bg-surface-secondary text-text-primary text-xs font-semibold transition-colors"
          >
            Detail
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          if (onDelete) onDelete(project.id);
          setShowDeleteConfirm(false);
        }}
        title="Hapus Proyek Ini?"
        message={`Apakah Anda yakin ingin menghapus proyek "${project.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Proyek"
        variant="danger"
      />
    </div>
  );
}
