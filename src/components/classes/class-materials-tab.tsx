"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  FileText,
  FileCode,
  FileSpreadsheet,
  Layers,
  Trash2,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Select } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export interface ClassMaterial {
  id: string;
  title: string;
  type: string;
  size: string;
  url: string;
  createdAt: string;
}

interface ClassMaterialsTabProps {
  materials: ClassMaterial[];
  canManage: boolean;
  onAddMaterial: (mat: ClassMaterial) => void;
  onDeleteMaterial: (id: string) => void;
}

export function ClassMaterialsTab({
  materials,
  canManage,
  onAddMaterial,
  onDeleteMaterial,
}: ClassMaterialsTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Dokumen PDF");
  const [url, setUrl] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Judul materi wajib diisi.");
      return;
    }

    const newMat: ClassMaterial = {
      id: "mat-" + Date.now(),
      title: title.trim(),
      type,
      size: "1.2 MB",
      url: url.trim() || "#",
      createdAt: new Date().toISOString(),
    };

    onAddMaterial(newMat);
    toast.success(`Bahan ajar "${newMat.title}" berhasil ditambahkan!`);
    setTitle("");
    setUrl("");
    setShowAddModal(false);
  };

  const getDocIcon = (matType: string) => {
    const t = matType.toLowerCase();
    if (t.includes("code") || t.includes("python") || t.includes("ipynb")) {
      return <FileCode className="w-4 h-4 text-emerald-500" />;
    }
    if (t.includes("spreadsheet") || t.includes("excel") || t.includes("csv")) {
      return <FileSpreadsheet className="w-4 h-4 text-teal-500" />;
    }
    if (t.includes("slide") || t.includes("pptx")) {
      return <Layers className="w-4 h-4 text-amber-500" />;
    }
    return <FileText className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-text-secondary">
          Bahan Ajar & Dokumen Perkuliahan
        </h3>

        {canManage && (
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="gap-1.5 text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Materi</span>
          </Button>
        )}
      </div>

      {materials.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title="Belum ada materi"
          description="Belum ada bahan ajar yang tersedia untuk kelas ini."
          action={
            canManage ? (
              <Button
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="gap-1.5 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Materi Pertama</span>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="p-4 sm:p-5 rounded-xl border border-border bg-surface hover:border-brand-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-surface-secondary border border-border flex items-center justify-center shrink-0 mt-0.5">
                  {getDocIcon(mat.type)}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-[10px]">
                      {mat.type}
                    </Badge>
                    <span className="text-[11px] font-mono text-text-tertiary">
                      {mat.size}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-text-primary tracking-tight">
                    {mat.title}
                  </h4>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-text-tertiary">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(mat.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {canManage && (
                  <button
                    type="button"
                    onClick={() => setDeleteId(mat.id)}
                    className="p-2 rounded-lg border border-border bg-surface hover:bg-rose-500/10 hover:border-rose-500/30 text-text-tertiary hover:text-rose-500 transition-colors cursor-pointer"
                    title="Hapus Materi"
                    aria-label={`Hapus ${mat.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {mat.url && mat.url !== "#" ? (
                  <a
                    href={mat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <span>Buka Berkas</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <Button size="sm" variant="outline" className="text-xs">
                    Unduh Dokumen
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Material Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Tambah Bahan Ajar Baru"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Judul Bahan Ajar *"
            placeholder="Contoh: Pertemuan 3 - Arsitektur REST API"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Select
            label="Tipe Dokumen"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: "Dokumen PDF", label: "Dokumen PDF" },
              { value: "Slide Presentasi", label: "Slide Presentasi (PPTX)" },
              { value: "Jupyter Notebook", label: "Jupyter Notebook (IPYNB)" },
              { value: "Source Code", label: "Source Code (PY/JS/TS)" },
              { value: "Spreadsheet", label: "Spreadsheet (CSV/XLSX)" },
              { value: "Catatan Kuliah", label: "Catatan Kuliah" },
            ]}
          />

          <Input
            label="Tautan Berkas / Google Drive (Opsional)"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddModal(false)}
            >
              Batal
            </Button>
            <Button type="submit" size="sm" className="font-semibold">
              Simpan Bahan Ajar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            onDeleteMaterial(deleteId);
            setDeleteId(null);
            toast.success("Bahan ajar berhasil dihapus.");
          }
        }}
        title="Hapus Bahan Ajar?"
        message="Apakah Anda yakin ingin menghapus materi ini dari ruang kelas?"
        confirmText="Hapus"
      />
    </div>
  );
}
