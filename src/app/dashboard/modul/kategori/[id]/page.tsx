"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  GraduationCap,
  CheckSquare,
  Square,
  Trash2,
  ChevronDown,
  ChevronUp,
  Pencil,
  FileText,
  Download,
  User,
  Eye,
  Globe,
  ArrowLeft,
  ArrowRight,
  Plus,
  Layers,
  Sparkles,
  Search,
  Code,
  BookOpen,
  Github,
  Play,
  FileCode,
} from "lucide-react";
import { Card, Badge, Skeleton, EmptyState, ConfirmDialog, Modal } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import {
  getModules,
  toggleChapterComplete,
  addModuleChapter,
  deleteModule,
  updateModule,
  getCategoryDetails,
  getCategories,
} from "@/actions/study-actions";
import { TechIcon } from "@/components/ui/tech-icon";
import { MODULE_LEVEL_LABELS, ModuleLevel } from "@/types";
import { SYSTEM_PRIMARY_CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { ModuleInteractionBar } from "@/components/modul/module-interaction-bar";
import { ModuleFilePreviewerModal } from "@/components/modul/module-file-previewer-modal";
import {
  extractModuleDriveFromNotes,
  injectModuleDriveIntoNotes,
  ModuleDriveFile,
} from "@/types/module-drive";
import { OWNER_EMAIL, isAdminUser } from "@/lib/utils";
import { toast } from "sonner";

export default function DedicatedCategoryModulesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const categoryParamId = resolvedParams.id;

  const [contentMode, setContentMode] = useState<"module" | "project">("module");
  const [category, setCategory] = useState<any>(null);
  const [parentCategory, setParentCategory] = useState<any>(null);
  const [siblingCategories, setSiblingCategories] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [scope, setScope] = useState<"all" | "mine">("all");
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [addingChapter, setAddingChapter] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Edit Module State
  const [editingModule, setEditingModule] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLevel, setEditLevel] = useState("pemula");
  const [editNotes, setEditNotes] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Quick In-App File Preview Modal
  const [previewFile, setPreviewFile] = useState<ModuleDriveFile | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) setCurrentUser(user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }
    fetchUser();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const allCats = await getCategories();
      const decodedParam = decodeURIComponent(categoryParamId).trim();

      // 1. Fetch category information
      let catDetails = allCats.find(
        (c: any) =>
          c.id === decodedParam ||
          c.name.toLowerCase() === decodedParam.toLowerCase() ||
          c.name.toLowerCase().replace(/[^a-z0-9]/g, "-") === decodedParam.toLowerCase()
      );

      if (!catDetails) {
        catDetails = await getCategoryDetails(categoryParamId);
      }

      setCategory(catDetails);

      const catIdToQuery = catDetails?.id || categoryParamId;

      // 2. Fetch modules for this category
      const modList = await getModules(search, catIdToQuery, levelFilter, scope, "all");
      setModules(modList);

      // 3. Resolve parent & sibling categories
      if (catDetails?.parent_id) {
        const parent = allCats.find((c: any) => c.id === catDetails.parent_id);
        setParentCategory(parent || catDetails.parent);
        const siblings = allCats.filter(
          (c: any) => c.parent_id === catDetails.parent_id && c.id !== catDetails.id
        );
        setSiblingCategories(siblings);
      } else if (catDetails?.parent) {
        setParentCategory(catDetails.parent);
      } else {
        for (const primary of SYSTEM_PRIMARY_CATEGORIES) {
          const matchedSub = primary.subcategories.find(
            (s) => s.name.toLowerCase() === (catDetails?.name || categoryParamId).toLowerCase()
          );
          if (matchedSub) {
            setParentCategory(primary);
            setSiblingCategories(
              primary.subcategories.filter((s) => s.name.toLowerCase() !== matchedSub.name.toLowerCase())
            );
            break;
          }
        }
      }
    } catch (err) {
      console.error("Error loading category modules:", err);
      toast.error("Gagal memuat modul kategori");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [categoryParamId, search, levelFilter, scope]);

  const handleToggleChapter = async (chapId: string, modId: string, currentStatus: boolean) => {
    try {
      await toggleChapterComplete(chapId, modId, !currentStatus);
      setModules((prev) =>
        prev.map((mod) => {
          if (mod.id !== modId) return mod;
          const updatedChapters = (mod.chapters || []).map((ch: any) =>
            ch.id === chapId ? { ...ch, is_completed: !currentStatus } : ch
          );
          const completedCount = updatedChapters.filter((c: any) => c.is_completed).length;
          const newProgress = Math.round((completedCount / updatedChapters.length) * 100);
          return { ...mod, chapters: updatedChapters, progress: newProgress };
        })
      );
      toast.success(!currentStatus ? "Bab ditandai selesai!" : "Bab ditandai belum selesai");
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah status bab");
    }
  };

  const handleAddChapter = async (modId: string) => {
    if (!newChapterTitle.trim()) return;
    setAddingChapter(true);
    try {
      const added = await addModuleChapter(modId, newChapterTitle.trim());
      setModules((prev) =>
        prev.map((mod) => {
          if (mod.id !== modId) return mod;
          const updatedChapters = [...(mod.chapters || []), added];
          const completedCount = updatedChapters.filter((c: any) => c.is_completed).length;
          const newProgress = Math.round((completedCount / updatedChapters.length) * 100);
          return { ...mod, chapters: updatedChapters, progress: newProgress };
        })
      );
      setNewChapterTitle("");
      toast.success("Bab baru berhasil ditambahkan!");
    } catch (err: any) {
      toast.error(err.message || "Gagal menambah bab");
    } finally {
      setAddingChapter(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteModule(deleteId);
      setModules((prev) => prev.filter((m) => m.id !== deleteId));
      setDeleteId(null);
      toast.success("Konten berhasil dihapus");
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus konten");
    } finally {
      setDeleting(false);
    }
  };

  const openEditModal = (mod: any) => {
    setEditingModule(mod);
    setEditTitle(mod.title || "");
    setEditDescription(mod.description || "");
    setEditLevel(mod.level || "pemula");
    setEditNotes(mod.notes || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;

    setSavingEdit(true);
    try {
      await updateModule(editingModule.id, {
        title: editTitle,
        description: editDescription,
        level: editLevel as any,
        notes: editNotes,
      });

      setModules((prev) =>
        prev.map((m) =>
          m.id === editingModule.id
            ? {
                ...m,
                title: editTitle,
                description: editDescription,
                level: editLevel,
                notes: editNotes,
              }
            : m
        )
      );

      toast.success("Konten berhasil diperbarui!");
      setEditingModule(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui konten");
    } finally {
      setSavingEdit(false);
    }
  };

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryParamId);
  const categoryName = category?.name || (isUuid ? "Memuat Kategori..." : decodeURIComponent(categoryParamId));
  const categoryColor = category?.color || "#3b82f6";
  const categoryIcon = category?.icon || category?.name || (isUuid ? "code" : decodeURIComponent(categoryParamId));

  const filteredItems = modules.filter((m) => {
    if (contentMode === "project") return m.kind === "project";
    return m.kind !== "project";
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-16 px-1 sm:px-0 animate-fade-in">
      {/* Top Back Navigation & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-tertiary">
        <Link
          href="/dashboard/modul"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-secondary hover:bg-surface-tertiary text-text-secondary hover:text-text-primary border border-border transition-all font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Semua Modul & Project</span>
        </Link>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Link href="/dashboard" className="hover:text-text-primary transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/dashboard/modul" className="hover:text-text-primary transition-colors">
            Modul & Project
          </Link>
          {parentCategory && (
            <>
              <span>/</span>
              <span className="text-text-secondary font-medium">{parentCategory.name}</span>
            </>
          )}
          <span>/</span>
          <span className="text-brand-400 font-bold">{categoryName}</span>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl border border-border bg-surface shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-surface-secondary border border-border flex items-center justify-center shrink-0 shadow-inner text-text-primary">
              <TechIcon name={categoryIcon} size={32} />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  <Layers className="w-3 h-3 mr-1" />
                  {parentCategory ? `Kategori: ${parentCategory.name}` : "Kategori Bidang"}
                </span>

                <span className="text-xs text-text-tertiary font-mono">
                  {filteredItems.length} {contentMode === "project" ? "Project" : "Modul"}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight font-display">
                {categoryName}
              </h1>

              <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">
                Kumpulan silabus materi dan repositori kode untuk mendalami topik{" "}
                <strong className="text-text-primary">{categoryName}</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link href={`/dashboard/modul/baru?mode=${contentMode}&category=${encodeURIComponent(category?.id || categoryName)}`}>
              <Button className="gap-2 font-bold shadow-sm">
                <Plus className="w-4 h-4" /> Tambah {contentMode === "project" ? "Project" : "Modul"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mode Switcher [ MODUL ] [ PROJECT ] */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 bg-surface rounded-2xl border border-border shadow-sm">
        <div className="grid grid-cols-2 p-1 bg-surface-secondary rounded-xl border border-border/80 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setContentMode("module")}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              contentMode === "module"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Modul ({modules.filter((m) => m.kind !== "project").length})</span>
          </button>

          <button
            type="button"
            onClick={() => setContentMode("project")}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              contentMode === "project"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Project ({modules.filter((m) => m.kind === "project").length})</span>
          </button>
        </div>

        {/* Scope tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-secondary border border-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setScope("all")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              scope === "all"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Semua</span>
          </button>

          <button
            type="button"
            onClick={() => setScope("mine")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              scope === "mine"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Milik Saya</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface p-3.5 rounded-2xl border border-border shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder={`Cari dalam ${categoryName}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-surface-secondary border border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500"
          />
        </div>

        <Select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          placeholder="Semua Level"
          options={Object.entries(MODULE_LEVEL_LABELS).map(([k, v]) => ({
            value: k,
            label: v,
          }))}
        />
      </div>

      {/* Content List */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="p-8 text-center space-y-4 border-dashed border-2 border-border/80 w-full">
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-surface-secondary border border-border text-brand-400"
          >
            <TechIcon name={categoryIcon} size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-text-primary">
              Belum Ada {contentMode === "project" ? "Project" : "Modul"} untuk {categoryName}
            </h3>
            <p className="text-xs text-text-secondary max-w-md mx-auto">
              Jadilah yang pertama membagikan materi atau repositori kode untuk subkategori ini!
            </p>
          </div>
          <Link href={`/dashboard/modul/baru?category=${encodeURIComponent(category?.id || categoryName)}`}>
            <Button className="gap-2 font-bold">
              <Plus className="w-4 h-4" /> Upload {contentMode === "project" ? "Project" : "Modul"} Pertama
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((mod) => {
            const isExpanded = expandedModuleId === mod.id;
            const chapters = mod.chapters || [];
            const driveData = extractModuleDriveFromNotes(mod.notes);
            const author = mod.author_name || driveData.authorName || "Pengguna";

            const isMyModule = Boolean(currentUser && mod.user_id === currentUser.id);
            const isOwner = currentUser?.email === OWNER_EMAIL || (currentUser?.email && isAdminUser(currentUser.email));
            const canEditOrDelete = isMyModule || isOwner;

            return (
              <Card
                key={mod.id}
                className="p-4 sm:p-5 rounded-2xl bg-surface border-border hover:border-brand-500/40 transition-all space-y-2.5 shadow-sm w-full"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Item Title */}
                    <h3 className="text-sm sm:text-base font-semibold text-text-primary leading-snug">
                      {mod.title}
                    </h3>

                    {/* Description */}
                    {mod.description && (
                      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                        {mod.description}
                      </p>
                    )}

                    {/* Metadata Hierarchy Line */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-text-tertiary pt-0.5">
                      {mod.tech_stack && mod.tech_stack.length > 0 && (
                        <>
                          <span className="text-text-secondary font-medium">{mod.tech_stack.slice(0, 3).join(", ")}</span>
                          <span>·</span>
                        </>
                      )}
                      <span>{MODULE_LEVEL_LABELS[mod.level as ModuleLevel] || mod.level}</span>
                      <span>·</span>
                      <span>
                        {mod.kind === "project"
                          ? `${driveData.files.length} Berkas`
                          : `${(mod.chapters || []).length} Bab`}
                      </span>
                      <span>·</span>
                      <span>{author}</span>
                      {mod.repository_url && (
                        <>
                          <span>·</span>
                          <a
                            href={mod.repository_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-400 hover:underline inline-flex items-center gap-1 font-sans"
                          >
                            <Github className="w-3 h-3" /> Repo
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {canEditOrDelete && (
                      <>
                        <Link href={`/dashboard/modul/edit/${mod.id}`}>
                          <button
                            type="button"
                            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteId(mod.id)}
                          className="p-1.5 rounded-lg text-text-tertiary hover:text-danger-400 hover:bg-surface-secondary transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    <Link href={`/dashboard/modul?category=${encodeURIComponent(category?.id || categoryName)}&subcat=${encodeURIComponent(categoryName)}&module=${mod.id}&mode=${mod.kind || "module"}`}>
                      <Button size="sm" className="gap-1.5 text-xs font-semibold">
                        <span>Buka {mod.kind === "project" ? "Project" : "Modul"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-surface-secondary rounded-full h-1.5">
                  <div
                    className="bg-brand-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${mod.progress || 0}%` }}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* File Previewer Modal */}
      <ModuleFilePreviewerModal
        file={previewFile}
        isOpen={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
      />

      {/* Edit Modal */}
      <Modal
        isOpen={Boolean(editingModule)}
        onClose={() => setEditingModule(null)}
        title={editingModule?.kind === "project" ? "Edit Project" : "Edit Modul"}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Input
            label="Judul"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />

          <Textarea
            label="Deskripsi"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={3}
          />

          <Select
            label="Tingkat Kesulitan"
            value={editLevel}
            onChange={(e) => setEditLevel(e.target.value)}
            options={Object.entries(MODULE_LEVEL_LABELS).map(([k, v]) => ({
              value: k,
              label: v,
            }))}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingModule(null)}
            >
              Batal
            </Button>
            <Button type="submit" loading={savingEdit}>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Hapus Konten"
        description="Apakah Anda yakin ingin menghapus konten ini beserta seluruh berkasnya?"
        confirmText="Hapus Sekarang"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
