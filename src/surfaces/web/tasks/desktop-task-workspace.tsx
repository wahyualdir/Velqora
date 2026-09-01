"use client";

import React, { useState } from "react";
import {
  MoreHorizontal,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  DesktopTable,
  DesktopTableHeader,
  DesktopTableHead,
  DesktopTableRow,
  DesktopTableCell,
} from "@/surfaces/web/layout/desktop-table";
import { cn, daysUntilDeadline, formatDate } from "@/lib/utils";

interface DesktopTaskWorkspaceProps {
  tasks: any[];
  onUpdateStatus: (taskId: string, newStatus: string) => void;
  onEdit: (task: any) => void;
  onDelete: (id: string) => void;
}

export function DesktopTaskWorkspace({
  tasks,
  onUpdateStatus,
  onEdit,
  onDelete,
}: DesktopTaskWorkspaceProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "tinggi":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Tinggi
          </span>
        );
      case "sedang":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Sedang
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-secondary text-text-secondary border border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary" />
            Rendah
          </span>
        );
    }
  };

  const getStatusBadge = (status: string, deadline?: string) => {
    const days = deadline ? daysUntilDeadline(deadline) : null;
    const isOverdue = days !== null && days < 0 && status !== "selesai";

    if (status === "selesai") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Selesai
        </span>
      );
    }

    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
          <AlertTriangle className="w-3.5 h-3.5" />
          Terlambat
        </span>
      );
    }

    if (status === "sedang_dikerjakan") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
          <Clock className="w-3.5 h-3.5" />
          Dikerjakan
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-secondary text-text-secondary border border-border">
        Belum Mulai
      </span>
    );
  };

  return (
    <div className="w-full">
      <DesktopTable className="min-w-[720px]">
        <DesktopTableHeader>
          <tr>
            <DesktopTableHead className="w-[36%]">Nama Tugas & Deskripsi</DesktopTableHead>
            <DesktopTableHead className="w-[20%]">Mata Kuliah / Dosen</DesktopTableHead>
            <DesktopTableHead className="w-[15%]">Tenggat Waktu</DesktopTableHead>
            <DesktopTableHead className="w-[12%]">Status</DesktopTableHead>
            <DesktopTableHead className="w-[10%]">Prioritas</DesktopTableHead>
            <DesktopTableHead className="w-[7%] text-right pr-4">Aksi</DesktopTableHead>
          </tr>
        </DesktopTableHeader>
        <tbody>
          {tasks.map((task) => {
            const isMenuOpen = activeMenuId === task.id;
            const daysLeft = task.deadline ? daysUntilDeadline(task.deadline) : null;

            return (
              <DesktopTableRow key={task.id} className="hover:bg-surface-secondary/40">
                {/* 1. Task Name */}
                <DesktopTableCell>
                  <div className="space-y-0.5 max-w-sm">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-text-primary text-xs truncate">
                        {task.title}
                      </p>
                      {task.external_url && (
                        <a
                          href={task.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-500 hover:text-brand-600"
                          title="Buka tautan tugas"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-[11px] text-text-secondary truncate leading-snug">
                        {task.description}
                      </p>
                    )}
                  </div>
                </DesktopTableCell>

                {/* 2. Subject & Lecturer */}
                <DesktopTableCell>
                  <div className="space-y-0.5">
                    <span className="font-medium text-text-secondary truncate block">
                      {task.subject || "—"}
                    </span>
                    {task.lecturer && (
                      <span className="text-[10.5px] text-text-tertiary truncate block font-mono">
                        {task.lecturer}
                      </span>
                    )}
                  </div>
                </DesktopTableCell>

                {/* 3. Due Date */}
                <DesktopTableCell>
                  {task.deadline ? (
                    <div className="space-y-0.5 font-mono text-[11px]">
                      <span className="text-text-primary block">
                        {formatDate(task.deadline)}
                      </span>
                      {daysLeft !== null && task.status !== "selesai" && (
                        <span
                          className={cn(
                            "text-[10px] font-semibold block",
                            daysLeft < 0
                              ? "text-rose-600"
                              : daysLeft <= 1
                              ? "text-amber-600"
                              : "text-text-tertiary"
                          )}
                        >
                          {daysLeft < 0
                            ? `Terlambat ${Math.abs(daysLeft)} hari`
                            : daysLeft === 0
                            ? "Hari ini"
                            : daysLeft === 1
                            ? "Besok"
                            : `${daysLeft} hari lagi`}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-text-tertiary text-xs font-mono">—</span>
                  )}
                </DesktopTableCell>

                {/* 4. Status */}
                <DesktopTableCell>
                  {getStatusBadge(task.status, task.deadline)}
                </DesktopTableCell>

                {/* 5. Priority */}
                <DesktopTableCell>
                  {getPriorityBadge(task.priority)}
                </DesktopTableCell>

                {/* 6. Contextual Action Menu (...) */}
                <DesktopTableCell className="text-right pr-4">
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenuId(isMenuOpen ? null : task.id)
                      }
                      className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
                      title="Opsi tugas"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {isMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setActiveMenuId(null)}
                        />
                        <div className="absolute right-0 mt-1 w-44 rounded-xl bg-surface border border-border shadow-xl py-1 z-50 animate-fade-in text-xs">
                          {task.status !== "selesai" ? (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateStatus(task.id, "selesai");
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-emerald-700 hover:bg-emerald-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Tandai Selesai</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateStatus(task.id, "belum_dikerjakan");
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-text-secondary hover:bg-surface-secondary flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Buka Kembali</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              onEdit(task);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-left text-text-primary hover:bg-surface-secondary flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-text-tertiary" />
                            <span>Edit Tugas</span>
                          </button>

                          <div className="border-t border-border/60 my-1" />

                          <button
                            type="button"
                            onClick={() => {
                              onDelete(task.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus Tugas</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </DesktopTableCell>
              </DesktopTableRow>
            );
          })}
        </tbody>
      </DesktopTable>
    </div>
  );
}
