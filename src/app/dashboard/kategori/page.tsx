"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FolderOpen, Trash2, FolderTree, Sparkles, ArrowRight, Search } from "lucide-react";
import { Card, Skeleton, EmptyState, ConfirmDialog } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { PageContainer, PageSection } from "@/components/ui/section";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import { getCategories, createCategory, deleteCategory } from "@/actions/study-actions";
import { TechIcon, TechIconPicker, TECH_ICONS, TechIconKey } from "@/components/ui/tech-icon";
import { SYSTEM_PRIMARY_CATEGORIES } from "@/lib/constants";
import { toast } from "sonner";

export default function KategoriPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [parentId, setParentId] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<TechIconKey>("code");
  const [submitting, setSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  async function loadCats() {
    setLoading(true);
    try {
      const list = await getCategories();
      setCategories(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCats();
  }, []);

  const parentOptions = categories
    .filter((c) => !c.parent_id)
    .map((c) => ({ value: c.id, label: c.name }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await createCategory({
        name,
        color,
        parent_id: parentId || null,
        icon: selectedIcon,
      });
      toast.success("Kategori berhasil ditambahkan");
      setName("");
      setParentId("");
      setSelectedIcon("code");
      loadCats();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePresets = async () => {
    setSubmitting(true);
    try {
      const existingCats = await getCategories();
      const existingNames = new Set(existingCats.map((c: any) => c.name.toLowerCase()));

      for (const primary of SYSTEM_PRIMARY_CATEGORIES) {
        let parentCat = existingCats.find((c: any) => c.name.toLowerCase() === primary.name.toLowerCase());
        
        if (!parentCat && !existingNames.has(primary.name.toLowerCase())) {
          parentCat = await createCategory({
            name: primary.name,
            color: primary.color,
            icon: primary.icon as any,
          });
          if (parentCat) existingNames.add(primary.name.toLowerCase());
        }

        if (parentCat?.id && primary.subcategories) {
          for (const sub of primary.subcategories) {
            if (!existingNames.has(sub.name.toLowerCase())) {
              await createCategory({
                name: sub.name,
                color: sub.color || primary.color,
                parent_id: parentCat.id,
                icon: (sub.icon || primary.icon) as any,
              });
              existingNames.add(sub.name.toLowerCase());
            }
          }
        }
      }

      toast.success("17 Kategori Utama beserta Subkategori berhasil disinkronisasi!");
      loadCats();
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
      await deleteCategory(deleteId);
      toast.success("Kategori berhasil dihapus");
      setCategories(categories.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Group categories by parent
  const topParents = categories.filter((c) => {
    if (c.parent_id) return false;
    if (!search.trim()) return true;
    const matchParent = c.name.toLowerCase().includes(search.toLowerCase());
    const matchChildren = categories.some(
      (sub) => sub.parent_id === c.id && sub.name.toLowerCase().includes(search.toLowerCase())
    );
    return matchParent || matchChildren;
  });

  const getChildren = (parentId: string) =>
    categories.filter((c) => {
      if (c.parent_id !== parentId) return false;
      if (!search.trim()) return true;
      return c.name.toLowerCase().includes(search.toLowerCase());
    });

  return (
    <PageContainer className="space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        eyebrow="Taksonomi"
        title="Kategori Pembelajaran"
        description="Atur kategori modul dan materi berdasarkan topik keahlian dan bahasa pemrograman."
        actions={
          categories.length === 0 ? (
            <Button
              onClick={handleCreatePresets}
              loading={submitting}
              variant="outline"
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4 text-brand-500" />}
            >
              Kategori Bawaan
            </Button>
          ) : undefined
        }
      />

      {/* Sub-Navigation Tabs */}
      <SubNavTabs category="settings" />

      {/* Form Tambah Kategori / Sub-Kategori */}
      <PageSection>
        <Card className="p-4 sm:p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 font-display">
            <Plus className="w-4 h-4 text-brand-500" /> Tambah Kategori atau Subkategori
          </h3>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <Input
                label="Nama Kategori / Bahasa *"
                placeholder="Contoh: Python, C++, Machine Learning..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  // Auto match icon if possible
                  const matched = TECH_ICONS.find(
                    (i) => i.label.toLowerCase() === e.target.value.toLowerCase() || i.key === e.target.value.toLowerCase()
                  );
                  if (matched) {
                    setSelectedIcon(matched.key);
                    setColor(matched.color);
                  }
                }}
                required
              />

              <Select
                label="Kategori Induk (Opsional)"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                placeholder="Tidak ada (Kategori Utama)"
                options={parentOptions}
              />

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Warna Label
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    aria-label="Pilih warna penanda kategori"
                    className="h-10 w-14 p-1 rounded-xl border border-border bg-surface cursor-pointer"
                  />
                  <span className="text-xs text-text-tertiary">Warna penanda</span>
                </div>
              </div>
            </div>

            {/* Tech Icon Selector */}
            <TechIconPicker selectedKey={selectedIcon} onSelect={(iconKey) => setSelectedIcon(iconKey)} />

            <div className="flex justify-end pt-2 border-t border-border">
              <Button type="submit" loading={submitting} leftIcon={<Plus className="w-4 h-4" />}>
                Simpan Kategori
              </Button>
            </div>
          </form>
        </Card>
      </PageSection>

      {/* List Kategori Visual & Hierarki */}
      {loading ? (
        <Skeleton className="h-48 rounded-xl" />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="w-12 h-12 text-text-tertiary" />}
          title="Belum ada kategori"
          description="Buat kategori pertama Anda di atas atau klik 'Auto Presets Kategori'."
          action={
            <Button onClick={handleCreatePresets} leftIcon={<Sparkles className="w-4 h-4" />}>
              Buat Preset Kategori Otomatis
            </Button>
          }
        />
      ) : (
        <PageSection>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-base font-bold text-text-primary flex items-center gap-2 font-display">
                <FolderTree className="w-5 h-5 text-brand-500" /> Daftar Kategori & Logo Bahasa
              </h2>

              <div className="w-full sm:w-72">
                <Input
                  placeholder="Cari kategori..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  startIcon={<Search className="w-3.5 h-3.5 text-text-tertiary" />}
                  onClear={search ? () => setSearch("") : undefined}
                />
              </div>
            </div>

            <div className="space-y-4">
              {topParents.map((parent) => {
                const children = getChildren(parent.id);

                return (
                  <Card key={parent.id} className="p-4 sm:p-5 space-y-3.5 border-l-4" style={{ borderLeftColor: parent.color }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${parent.color}20` }}
                        >
                          <TechIcon name={parent.icon || parent.name} size={16} />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-text-primary font-display">{parent.name}</h3>
                          <span className="text-[11px] text-text-tertiary">
                            Kategori Utama • {children.length} Sub-Kategori
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDeleteId(parent.id)}
                        className="p-1.5 rounded-lg text-text-tertiary hover:text-red-400 hover:bg-surface-secondary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
                        title="Hapus Kategori Utama"
                        aria-label={`Hapus kategori ${parent.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Sub-categories Grid */}
                    {children.length > 0 && (
                      <div className="pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {children.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex flex-col justify-between p-3 rounded-xl border border-border bg-surface-secondary/60 hover:border-brand-500/40 hover:bg-surface-secondary transition-all shadow-2xs group"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <TechIcon name={sub.icon || sub.name} size={18} />
                                <span className="text-xs font-bold text-text-primary truncate">
                                  {sub.name}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => setDeleteId(sub.id)}
                                className="p-1 rounded text-text-tertiary hover:text-red-400 hover:bg-surface transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
                                title="Hapus Subkategori"
                                aria-label={`Hapus subkategori ${sub.name}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <Link
                              href={`/dashboard/modul?subcat=${encodeURIComponent(sub.name || sub.id)}`}
                              className="mt-2.5 flex items-center justify-between text-xs font-medium text-text-secondary hover:text-text-primary px-2.5 py-1.5 rounded-lg bg-surface hover:bg-surface-secondary border border-border transition-all"
                            >
                              <span>Buka Modul</span>
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}

              {/* Standalone subcategories or non-parented categories */}
              {categories.filter((c) => c.parent_id && !topParents.some((p) => p.id === c.parent_id)).length > 0 && (
                <Card className="p-4 sm:p-5 space-y-3">
                  <h4 className="text-xs font-semibold text-text-tertiary uppercase">Lainnya</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {categories
                      .filter((c) => c.parent_id && !topParents.some((p) => p.id === c.parent_id))
                      .map((cat) => (
                        <div
                          key={cat.id}
                          className="flex flex-col justify-between p-3 rounded-xl border border-border bg-surface hover:border-brand-500/40 transition-all shadow-2xs group"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <TechIcon name={cat.icon || cat.name} size={18} />
                              <span className="text-xs font-bold text-text-primary truncate">{cat.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setDeleteId(cat.id)}
                              className="p-1 rounded text-text-tertiary hover:text-red-400 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
                              title="Hapus Kategori"
                              aria-label={`Hapus kategori ${cat.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <Link
                            href={`/dashboard/modul?subcat=${encodeURIComponent(cat.name || cat.id)}`}
                            className="mt-2.5 flex items-center justify-between text-xs font-medium text-text-secondary hover:text-text-primary px-2.5 py-1.5 rounded-lg bg-surface hover:bg-surface-secondary border border-border transition-all"
                          >
                            <span>Lihat Modul</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </PageSection>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Kategori?"
        message="Materi dan modul yang menggunakan kategori ini akan di-set menjadi tanpa kategori."
      />
    </PageContainer>
  );
}

