"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  Video,
  Link2,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Download,
  Share2,
  Trash2,
  Eye,
} from "lucide-react";
import { MobileBottomSheet } from "@/surfaces/app/layout/mobile-bottom-sheet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatFileSize, cn } from "@/lib/utils";
import { toast } from "sonner";

interface MobileMaterialListProps {
  materials: any[];
  bookmarkMap: { [id: string]: boolean };
  onToggleBookmark: (mat: any) => void;
  onDelete: (id: string) => void;
}

export function MobileMaterialList({
  materials,
  bookmarkMap,
  onToggleBookmark,
  onDelete,
}: MobileMaterialListProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);

  const getFileTypeIcon = (type: string, url?: string) => {
    const ext = url ? url.split(".").pop()?.toLowerCase() : "";
    if (type === "video" || ext === "mp4" || ext === "webm") {
      return {
        icon: Video,
        color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        label: "Video",
      };
    }
    if (ext === "pdf" || type === "pdf") {
      return {
        icon: FileText,
        color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
        label: "PDF",
      };
    }
    if (ext === "xlsx" || ext === "xls" || ext === "csv") {
      return {
        icon: FileSpreadsheet,
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        label: "Spreadsheet",
      };
    }
    if (ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "webp") {
      return {
        icon: FileImage,
        color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        label: "Gambar",
      };
    }
    if (type === "link") {
      return {
        icon: Link2,
        color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        label: "Tautan",
      };
    }
    return {
      icon: FileText,
      color: "text-brand-400 bg-brand-500/10 border-brand-500/20",
      label: "Dokumen",
    };
  };

  const handleShare = async (mat: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: mat.title,
          text: mat.description || "Materi Velqora",
          url: window.location.origin + `/dashboard/materi/${mat.id}`,
        });
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(
        window.location.origin + `/dashboard/materi/${mat.id}`
      );
      toast.success("Tautan materi disalin ke papan klip!");
    }
  };

  return (
    <div className="space-y-3 pb-8">
      <Card padding="none" className="divide-y divide-border/60">
        {materials.map((mat) => {
          const typeInfo = getFileTypeIcon(mat.type, mat.file_url);
          const Icon = typeInfo.icon;
          const isBookmarked = Boolean(bookmarkMap[mat.id]);

          return (
            <div
              key={mat.id}
              onClick={() => setSelectedMaterial(mat)}
              className="p-3.5 hover:bg-surface-secondary/40 active:bg-surface-secondary/70 transition-colors flex items-center justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl border flex items-center justify-center shrink-0",
                    typeInfo.color
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface-secondary text-text-secondary border border-border/60">
                      {typeInfo.label}
                    </span>
                    {mat.category?.name && (
                      <span className="text-[10px] font-mono font-medium text-text-secondary">
                        · {mat.category.name}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-text-primary truncate">
                    {mat.title}
                  </h3>

                  {mat.description && (
                    <p className="text-[11.5px] text-text-secondary truncate leading-snug">
                      {mat.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(mat);
                  }}
                  className="p-1 rounded-lg text-text-secondary hover:text-brand-600 active:scale-95"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 text-brand-600 fill-brand-500/20" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
                <ChevronRight className="w-4 h-4 text-text-secondary" />
              </div>
            </div>
          );
        })}
      </Card>

      {/* Mobile Material Action Sheet */}
      {selectedMaterial && (
        <MobileBottomSheet
          isOpen={Boolean(selectedMaterial)}
          onClose={() => setSelectedMaterial(null)}
          title={selectedMaterial.title}
        >
          <div className="space-y-4 pt-1">
            <div className="p-3.5 rounded-xl bg-surface-secondary/50 border border-border/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-tertiary">Kategori</span>
                <span className="font-semibold text-text-primary">
                  {selectedMaterial.category?.name || "Umum"}
                </span>
              </div>
              {selectedMaterial.subject && (
                <div className="flex items-center justify-between">
                  <span className="text-text-tertiary">Mata Kuliah</span>
                  <span className="text-text-secondary">
                    {selectedMaterial.subject}
                  </span>
                </div>
              )}
              {selectedMaterial.file_size && (
                <div className="flex items-center justify-between">
                  <span className="text-text-tertiary">Ukuran File</span>
                  <span className="font-mono text-text-primary">
                    {formatFileSize(selectedMaterial.file_size)}
                  </span>
                </div>
              )}
              {selectedMaterial.description && (
                <div className="pt-2 border-t border-border/60">
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    {selectedMaterial.description}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-1">
              <Link
                href={`/dashboard/materi/${selectedMaterial.id}`}
                className="block"
              >
                <Button className="w-full h-11 rounded-xl font-semibold text-xs gap-2">
                  <Eye className="w-4 h-4" />
                  <span>Buka Penampil Materi (Fullscreen)</span>
                </Button>
              </Link>

              {selectedMaterial.file_url && (
                <a
                  href={selectedMaterial.file_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl font-semibold text-xs gap-2"
                  >
                    <Download className="w-4 h-4 text-brand-400" />
                    <span>Unduh Berkas Materi</span>
                  </Button>
                </a>
              )}

              <Button
                variant="outline"
                onClick={() => handleShare(selectedMaterial)}
                className="w-full h-11 rounded-xl font-semibold text-xs gap-2"
              >
                <Share2 className="w-4 h-4 text-text-tertiary" />
                <span>Bagikan Materi</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  onDelete(selectedMaterial.id);
                  setSelectedMaterial(null);
                }}
                className="w-full h-11 rounded-xl text-rose-500 hover:bg-rose-500/10 font-semibold text-xs gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Materi</span>
              </Button>
            </div>
          </div>
        </MobileBottomSheet>
      )}
    </div>
  );
}
