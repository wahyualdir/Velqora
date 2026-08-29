"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  Users,
  Trash2,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { ClassItem } from "@/lib/class-service";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface ClassDetailHeaderProps {
  classData: ClassItem;
  userEmail: string;
  isAdmin: boolean;
  onDeleteClass: () => void;
}

export function ClassDetailHeader({
  classData,
  userEmail,
  isAdmin,
  onDeleteClass,
}: ClassDetailHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = classData.teacherEmail === userEmail;
  const canDelete = isOwner || isAdmin;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classData.code);
    setCopied(true);
    toast.success(`Kode kelas "${classData.code}" disalin ke clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="space-y-4 border-b border-border/70 pb-5">
      {/* Top Navigation Back Link */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/dashboard/kelas"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Ruang Kelas</span>
        </Link>

        {canDelete && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Kelas</span>
          </Button>
        )}
      </div>

      {/* Class Title & Info */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              {classData.subject}
            </span>

            {isOwner && (
              <Badge variant="default" className="text-[10px]">
                Pengajar
              </Badge>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight font-display">
            {classData.name}
          </h1>

          {classData.description && (
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-3xl">
              {classData.description}
            </p>
          )}

          {/* Meta Badges */}
          <div className="flex items-center gap-4 text-xs font-mono text-text-tertiary flex-wrap pt-1">
            <span className="font-sans text-text-secondary">
              Pengajar: <strong className="text-text-primary font-medium">{classData.teacherName}</strong>
            </span>

            <span className="flex items-center gap-1 font-sans">
              <Users className="w-3.5 h-3.5 text-text-tertiary" />
              <span>{classData.membersCount || 1} anggota</span>
            </span>

            {classData.createdAt && (
              <span className="flex items-center gap-1 font-sans">
                <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
                <span>Dibuat: {formatDate(classData.createdAt)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Invite Code Card */}
        <div className="p-3.5 rounded-xl border border-border bg-surface shrink-0 min-w-[200px] space-y-1.5 shadow-2xs">
          <span className="text-[11px] font-mono text-text-tertiary uppercase block">
            Kode Akses Mahasiswa
          </span>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-lg font-bold tracking-widest text-text-primary">
              {classData.code}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyCode}
              className="gap-1 text-xs px-2.5 py-1"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Tersalin" : "Salin"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDeleteClass();
        }}
        title="Hapus Ruang Kelas Ini?"
        message={`Apakah Anda yakin ingin menghapus kelas "${classData.name}"? Seluruh aktivitas, materi, dan tugas terkait akan dihapus secara permanen.`}
        confirmText="Hapus Kelas"
      />
    </header>
  );
}
