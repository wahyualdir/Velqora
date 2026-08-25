"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Tags as TagsIcon, Trash2, Search, Sparkles, ArrowRight, BookOpen, X } from "lucide-react";
import { Card, Skeleton, EmptyState, ConfirmDialog } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { getTags, createTag, deleteTag } from "@/actions/study-actions";
import { toast } from "sonner";

const POPULAR_ACADEMIC_TAGS = [
  "python",
  "machine-learning",
  "web-dev",
  "react",
  "database-sql",
  "algoritma",
  "tugas-akhir",
  "uas-semester",
  "uts",
  "skripsi",
  "data-science",
  "cyber-security",
];

export default function TagPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadTagsData() {
    setLoading(true);
    try {
      const list = await getTags();
      setTags(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTagsData();
  }, []);

  const handleCreate = async (tagNameToCreate?: string) => {
    const targetName = (tagNameToCreate || name).trim().toLowerCase().replace(/\s+/g, "-");
    if (!targetName) return;

    // Check duplicate
    if (tags.some((t) => t.name.toLowerCase() === targetName)) {
      toast.info(`Tag #${targetName} sudah ada.`);
      return;
    }

    setSubmitting(true);
    try {
      await createTag({ name: targetName });
      toast.success(`Tag #${targetName} berhasil ditambahkan`);
      setName("");
      loadTagsData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteTag(deleteId);
      toast.success("Tag berhasil dihapus");
      setTags(tags.filter((t) => t.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const filteredTags = tags.filter((t) =>
    !search || t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <PageHeader
        eyebrow="~/tags"
        technicalMark="< metadata // cross-topic />"
        title="Kelompokkan materi secara fleksibel"
        description="Buat label tematik untuk menghubungkan materi dan tugas lintas kategori."
      />

      {/* Create Form */}
      <Card className="p-6 rounded-2xl bg-surface border-border space-y-4 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
          className="flex flex-col sm:flex-row gap-3 items-end"
        >
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">
              Nama Label / Tag Baru
            </label>
            <input
              type="text"
              placeholder="Contoh: machine-learning, uas-2026, deep-learning"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500"
              required
            />
          </div>
          <Button type="submit" loading={submitting} className="w-full sm:w-auto text-xs font-bold py-2.5">
            <Plus className="w-4 h-4 mr-1" /> Tambah Tag
          </Button>
        </form>

        {/* Quick Presets */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-[11px] font-semibold text-text-secondary flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Rekomendasi Tag Akademik Cepat:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_ACADEMIC_TAGS.map((pt) => {
              const alreadyExists = tags.some((t) => t.name.toLowerCase() === pt.toLowerCase());
              return (
                <button
                  key={pt}
                  type="button"
                  onClick={() => !alreadyExists && handleCreate(pt)}
                  disabled={alreadyExists}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-full border transition-all ${
                    alreadyExists
                      ? "bg-surface-secondary text-text-tertiary border-border cursor-default"
                      : "bg-brand-500/10 text-brand-400 border-brand-500/25 hover:bg-brand-500/20 hover:scale-105 active:scale-95 cursor-pointer"
                  }`}
                >
                  +{pt} {alreadyExists && "✓"}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Search & Tag Collection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TagsIcon className="w-4 h-4 text-brand-400" />
            <h2 className="text-sm font-bold text-text-primary">
              Daftar Tag Terpasang ({tags.length})
            </h2>
          </div>

          <div className="relative max-w-xs flex items-center">
            <Search className="w-3.5 h-3.5 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-8 py-1.5 rounded-xl bg-surface-secondary border border-border text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500 w-full"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 p-1 rounded-md text-text-tertiary hover:text-text-primary transition-colors"
                title="Hapus pencarian tag"
                aria-label="Hapus tag"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <Skeleton className="h-32 rounded-2xl" />
        ) : filteredTags.length === 0 ? (
          <EmptyState
            icon={<TagsIcon className="w-12 h-12" />}
            title="Belum ada tag"
            description="Tambahkan tag di atas untuk memudahkan pencarian dan pengelompokan materi Anda."
          />
        ) : (
          <div className="flex flex-wrap gap-2.5 p-6 rounded-2xl bg-surface border border-border">
            {filteredTags.map((tag) => (
              <div
                key={tag.id}
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-surface-secondary hover:bg-surface-tertiary hover:border-brand-500/40 text-xs text-text-primary transition-all shadow-xs"
              >
                <Link
                  href={`/dashboard/materi?tag=${encodeURIComponent(tag.name)}`}
                  className="font-mono text-brand-400 hover:text-text-primary font-bold flex items-center gap-1"
                  title={`Lihat semua materi dengan tag #${tag.name}`}
                >
                  <span>#{tag.name}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                <button
                  onClick={() => setDeleteId(tag.id)}
                  className="text-text-tertiary hover:text-rose-400 transition-colors p-0.5 rounded"
                  title="Hapus Tag"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Tag?"
        message="Tag akan dihapus dari daftar tag. Materi yang sudah terikat tidak akan terhapus."
      />
    </div>
  );
}
