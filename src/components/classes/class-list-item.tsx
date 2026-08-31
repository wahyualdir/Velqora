"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Copy,
  Check,
  Trash2,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { ClassItem } from "@/lib/class-service";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface ClassListItemProps {
  item: ClassItem;
  userEmail: string;
  isAdmin: boolean;
  onDelete: (classId: string, className: string, teacherEmail: string) => void;
}

export function ClassListItem({
  item,
  userEmail,
  isAdmin,
  onDelete,
}: ClassListItemProps) {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = item.teacherEmail === userEmail;
  const canDelete = isOwner || isAdmin;

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(item.code);
    setCopied(true);
    toast.success(`Kode kelas "${item.code}" disalin ke clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Card padding="none" hover className="overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          {/* Left: Class Icon & Details */}
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            {/* Class Academic Icon Box */}
            <div className="w-10 h-10 rounded-xl bg-surface-secondary border border-border flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0 mt-0.5">
              <GraduationCap className="w-5 h-5" />
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Subject Badge */}
                <Badge variant="secondary" className="font-semibold text-[11px]">
                  {item.subject}
                </Badge>

                {/* Owner / Member Status Badge */}
                {isOwner ? (
                  <Badge variant="default" className="text-[10px]">
                    Pengajar (Pemilik)
                  </Badge>
                ) : (
                  <Badge variant="neutral" className="text-[10px]">
                    Mahasiswa
                  </Badge>
                )}

                {/* Invite Code Pill */}
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-surface-secondary border border-border text-text-secondary hover:text-text-primary hover:border-brand-500/40 transition-colors cursor-pointer"
                  title="Klik untuk menyalin kode kelas"
                  aria-label={`Salin kode kelas ${item.code}`}
                >
                  <span>Kode: {item.code}</span>
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3 text-text-tertiary" />
                  )}
                </button>
              </div>

              {/* Class Title */}
              <Link
                href={`/dashboard/kelas/${item.id}`}
                className="block group"
              >
                <h3 className="text-sm sm:text-base font-bold font-display text-text-primary group-hover:text-brand-500 transition-colors tracking-tight leading-snug">
                  {item.name}
                </h3>
              </Link>

              {/* Description */}
              {item.description && (
                <p className="text-xs text-text-secondary line-clamp-1 leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* Metadata Footer */}
              <div className="flex items-center gap-3 text-[11px] font-mono text-text-tertiary flex-wrap pt-0.5">
                <span className="font-sans text-text-secondary">
                  Pengajar: <strong className="text-text-primary font-medium">{item.teacherName}</strong>
                </span>

                <span className="flex items-center gap-1 font-sans">
                  <Users className="w-3 h-3 text-text-tertiary" />
                  <span>{item.membersCount || 1} anggota</span>
                </span>

                {item.createdAt && (
                  <span className="flex items-center gap-1 font-sans">
                    <Calendar className="w-3 h-3 text-text-tertiary" />
                    <span>{formatDate(item.createdAt)}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60 w-full sm:w-auto justify-end">
            {canDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-lg border border-border bg-surface hover:bg-rose-500/10 hover:border-rose-500/30 text-text-tertiary hover:text-rose-500 transition-colors cursor-pointer"
                title="Hapus Kelas"
                aria-label={`Hapus kelas ${item.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <Link href={`/dashboard/kelas/${item.id}`}>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs text-text-secondary hover:text-text-primary hover:border-brand-500/40"
              >
                <span>Buka Kelas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete(item.id, item.name, item.teacherEmail);
        }}
        title="Hapus Ruang Kelas Ini?"
        message={`Apakah Anda yakin ingin menghapus kelas "${item.name}"? Seluruh data materi dan tugas terkait di ruang kelas ini akan dihapus.`}
        confirmText="Hapus Kelas"
      />
    </>
  );
}
