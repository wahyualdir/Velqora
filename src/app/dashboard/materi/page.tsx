"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, BookOpen, FileText, Trash2 } from "lucide-react";
import { Card, Skeleton, EmptyState, ConfirmDialog } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import { getMaterials, getCategories, deleteMaterial } from "@/actions/study-actions";
import { MATERIAL_TYPE_LABELS, MaterialType } from "@/types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function MateriPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [matData, catData] = await Promise.all([
        getMaterials(search, selectedCategory, selectedType),
        getCategories(),
      ]);
      setMaterials(matData || []);
      setCategories(catData || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat materi");
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedType]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await deleteMaterial(deleteId);
      toast.success("Materi berhasil dihapus");
      setMaterials((prev) => prev.filter((m) => m.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus materi");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-container space-y-6 sm:space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <PageHeader
        eyebrow="~/library"
        technicalMark="< docs & slides />"
        title="Bahan Ajar & Dokumen"
        description="Bahan ajar, slide perkuliahan, berkas lampiran, dan catatan belajar siap pakai."
        actions={
          <Link href="/dashboard/materi/baru" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto min-h-[40px] gap-2 text-xs sm:text-sm font-semibold shadow-xs">
              <Plus className="w-4 h-4" /> Tambah Materi
            </Button>
          </Link>
        }
      />

      {/* Sub-Navigation Tabs */}
      <SubNavTabs category="documents" />

      {/* Filter Bar */}
      <div className="toolbar bg-surface p-3.5 sm:p-4 rounded-xl border border-border shadow-2xs">
        <Input
          placeholder="Cari materi atau topik perkuliahan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
        />

        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          placeholder="Semua Kategori"
        />

        <Select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          options={Object.entries(MATERIAL_TYPE_LABELS).map(([k, v]) => ({
            value: k,
            label: v,
          }))}
          placeholder="Semua Jenis"
        />
      </div>

      {/* Materials List */}
      {loading ? (
        <div className="card-grid">
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
        </div>
      ) : materials.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-12 h-12" />}
          title="Belum ada materi"
          description="Tambahkan materi pertama Anda untuk mulai mengelola bahan pembelajaran."
          action={
            <Link href="/dashboard/materi/baru">
              <Button size="sm">+ Tambah Materi</Button>
            </Link>
          }
        />
      ) : (
        <div className="card-grid">
          {materials.map((mat) => (
            <Card
              key={mat.id}
              hover
              className="flex flex-col justify-between p-4 sm:p-4.5 lg:p-5 rounded-xl bg-surface border-border hover:border-brand-500/40 hover:bg-surface-secondary/60 transition-all space-y-3 shadow-2xs"
            >
              <div className="space-y-2">
                {/* Header Tag / Category line */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-surface-secondary text-text-secondary border border-border">
                    <FileText className="w-3.5 h-3.5 text-brand-400" />
                    <span>{mat.category?.name || "Umum"}</span>
                  </span>
                  <span className="text-[10.5px] font-mono uppercase tracking-wider text-text-tertiary">
                    {MATERIAL_TYPE_LABELS[mat.type as MaterialType] || mat.type}
                  </span>
                </div>

                {/* Item Title */}
                <Link href={`/dashboard/materi/${mat.id}`} className="block group">
                  <h3 className="text-sm sm:text-base font-bold text-text-primary group-hover:text-brand-400 transition-colors leading-snug line-clamp-2 font-display tracking-tight">
                    {mat.title}
                  </h3>
                </Link>

                {/* Description */}
                {mat.description && (
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>
                )}

                {/* Timestamp */}
                <div className="text-[11px] text-text-tertiary pt-0.5 font-mono">
                  {formatDate(mat.created_at)}
                </div>
              </div>

              <div className="pt-2.5 border-t border-border/50 flex items-center justify-between text-xs text-text-tertiary">
                <Link
                  href={`/dashboard/materi/${mat.id}`}
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 inline-flex items-center gap-1 transition-colors group"
                >
                  <span>Buka Materi</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setDeleteId(mat.id)}
                  className="p-1 rounded-md text-text-tertiary hover:text-danger-400 hover:bg-danger-500/10 transition-colors cursor-pointer"
                  title="Hapus materi"
                  aria-label="Hapus materi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Materi"
        message="Apakah Anda yakin ingin menghapus materi ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}
