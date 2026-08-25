"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  GraduationCap,
  Trash2,
  ChevronDown,
  ChevronUp,
  Pencil,
  Tag,
  FolderOpen,
  Sparkles,
  UploadCloud,
  FileText,
  FileCode,
  Folder,
  Download,
  User,
  Eye,
  Globe,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Layers,
  ChevronRight,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  FolderTree,
  X,
  Bookmark,
  BookmarkCheck,
  Code,
  Laptop,
  Terminal,
  ExternalLink,
  Github,
  Play,
  Copy,
  Check,
} from "lucide-react";
import { Card, Badge, Skeleton, EmptyState, ConfirmDialog, Modal } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import {
  getModules,
  toggleChapterComplete,
  addModuleChapter,
  deleteModule,
  getCategories,
  updateModule,
  createCategory,
} from "@/actions/study-actions";
import { batchAutoSortAllModules } from "@/actions/module-classifier";
import { SmartModuleSorterModal } from "@/components/modul/smart-module-sorter-modal";
import { ModuleDriveExplorer } from "@/components/modul/module-drive-explorer";
import { ModuleFilePreviewerModal } from "@/components/modul/module-file-previewer-modal";
import { ModuleInteractionBar } from "@/components/modul/module-interaction-bar";
import {
  extractModuleDriveFromNotes,
  injectModuleDriveIntoNotes,
  ModuleDriveFile,
  getFileCategory,
} from "@/types/module-drive";
import { isBookmarked, toggleBookmark } from "@/lib/bookmark-service";
import { TechIcon, TechIconKey } from "@/components/ui/tech-icon";
import { MODULE_LEVEL_LABELS, ModuleLevel } from "@/types";
import { SYSTEM_PRIMARY_CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { formatFileSize, OWNER_EMAIL, isAdminUser } from "@/lib/utils";
import { toast } from "sonner";

export default function ModulDanProjectPage() {
  const router = useRouter();

  // Mode Selection: "module" (Dokumen Bahan Ajar) vs "project" (Source Code & Proyek)
  const [contentMode, setContentMode] = useState<"module" | "project">("module");

  // Core Data State
  const [modules, setModules] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Progressive Disclosure Navigation State
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [selectedSubcatId, setSelectedSubcatId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  // Contextual Filters & Search
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [scope, setScope] = useState<"all" | "mine">("all");

  // In-App File Preview Modal
  const [selectedQuickPreviewFile, setSelectedQuickPreviewFile] = useState<ModuleDriveFile | null>(null);

  // Chapter Management State
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [addingChapter, setAddingChapter] = useState(false);

  // Deletion State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Edit Module Modal State
  const [editingModule, setEditingModule] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editLevel, setEditLevel] = useState("pemula");
  const [editNotes, setEditNotes] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Smart AI Auto-Sorter State
  const [showSmartModal, setShowSmartModal] = useState(false);
  const [batchSorting, setBatchSorting] = useState(false);

  // Category Creation Modal State
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatColor, setNewCatColor] = useState("#3b82f6");
  const [newCatParentId, setNewCatParentId] = useState("");
  const [newCatIcon, setNewCatIcon] = useState<TechIconKey>("code");
  const [creatingCat, setCreatingCat] = useState(false);
  const hasAttemptedSeedRef = useRef(false);

  // Fetch Current Auth User
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

  // Deep linking URL query parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get("mode");
      const catParam = params.get("category") || params.get("kategori");
      const subcatParam = params.get("subcat") || params.get("subkategori");
      const modParam = params.get("module") || params.get("modul") || params.get("project");

      if (modeParam === "project" || modeParam === "module") setContentMode(modeParam);
      if (catParam) setSelectedParentId(catParam);
      if (subcatParam) setSelectedSubcatId(subcatParam);
      if (modParam) setSelectedModuleId(modParam);
    }
  }, []);

  // Update URL search params when navigation state changes
  const updateUrlParams = useCallback(
    (parentId: string | null, subcatId: string | null, modId: string | null, mode?: "module" | "project") => {
      if (typeof window === "undefined") return;
      const currentMode = mode || contentMode;
      const params = new URLSearchParams();
      if (currentMode) params.set("mode", currentMode);
      if (parentId) params.set("category", parentId);
      if (subcatId) params.set("subcat", subcatId);
      if (modId) params.set("module", modId);

      const queryString = params.toString();
      const newUrl = queryString ? `/dashboard/modul?${queryString}` : "/dashboard/modul";
      window.history.replaceState(null, "", newUrl);
    },
    [contentMode]
  );

  // Navigation handlers
  const handleSelectParent = (parentId: string) => {
    setSelectedParentId(parentId);
    setSelectedSubcatId(null);
    setSelectedModuleId(null);
    setSearch("");
    updateUrlParams(parentId, null, null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectSubcat = (subcatId: string) => {
    setSelectedSubcatId(subcatId);
    setSelectedModuleId(null);
    setSearch("");
    updateUrlParams(selectedParentId, subcatId, null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    updateUrlParams(selectedParentId, selectedSubcatId, moduleId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToParents = () => {
    setSelectedParentId(null);
    setSelectedSubcatId(null);
    setSelectedModuleId(null);
    setSearch("");
    updateUrlParams(null, null, null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToSubcats = () => {
    setSelectedSubcatId(null);
    setSelectedModuleId(null);
    setSearch("");
    updateUrlParams(selectedParentId, null, null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToModuleList = () => {
    setSelectedModuleId(null);
    updateUrlParams(selectedParentId, selectedSubcatId, null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Load modules & categories from DB
  const loadModules = useCallback(async () => {
    setLoading(true);
    try {
      const [initialMList, cList] = await Promise.all([
        getModules(undefined, undefined, undefined, scope, "all"),
        getCategories(),
      ]);

      setModules(initialMList || []);
      setCategories(cList || []);
    } catch (err) {
      console.error("Error loading modules:", err);
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  // Handle Drive Synchronization
  const handleDriveSync = (moduleId: string, newFolders: any[], newFiles: any[]) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === moduleId) {
          const updatedNotes = injectModuleDriveIntoNotes(m.notes, newFolders, newFiles);
          return { ...m, notes: updatedNotes };
        }
        return m;
      })
    );
  };

  // Batch Auto Sort with AI
  const handleBatchAutoSort = async () => {
    setBatchSorting(true);
    try {
      const res = await batchAutoSortAllModules();
      if (res.updatedCount > 0) {
        toast.success(`Berhasil menyortir ${res.updatedCount} modul ke kategori yang sesuai!`);
      } else {
        toast.info("Semua modul Anda sudah terkelompokkan di kategori yang tepat.");
      }
      loadModules();
    } catch (err: any) {
      toast.error(err.message || "Gagal melakukan auto-sortir batch");
    } finally {
      setBatchSorting(false);
    }
  };

  // Toggle Chapter Complete Status
  const handleToggleChapter = async (chapterId: string, moduleId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    setModules((prev) =>
      prev.map((m) => {
        if (m.id === moduleId) {
          const updatedChapters = (m.chapters || []).map((chap: any) =>
            chap.id === chapterId ? { ...chap, is_completed: newStatus } : chap
          );
          const completedCount = updatedChapters.filter((c: any) => c.is_completed).length;
          const newProgress =
            updatedChapters.length > 0
              ? Math.round((completedCount / updatedChapters.length) * 100)
              : 0;
          return { ...m, chapters: updatedChapters, progress: newProgress };
        }
        return m;
      })
    );

    try {
      await toggleChapterComplete(chapterId, moduleId, newStatus);
      toast.success(newStatus ? "Bab ditandai selesai!" : "Bab ditandai belum selesai");
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui status bab");
      loadModules();
    }
  };

  // Add Chapter to Module
  const handleAddChapter = async (moduleId: string) => {
    if (!newChapterTitle.trim()) return;
    const titleToAdd = newChapterTitle.trim();
    setNewChapterTitle("");
    setAddingChapter(true);
    try {
      await addModuleChapter(moduleId, titleToAdd);
      toast.success("Bab baru berhasil ditambahkan!");
      const freshList = await getModules(undefined, undefined, undefined, scope, "all");
      setModules(freshList);
    } catch (err: any) {
      toast.error(err.message || "Gagal menambah bab");
    } finally {
      setAddingChapter(false);
    }
  };

  // Delete Module / Project
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteModule(deleteId);
      toast.success(contentMode === "project" ? "Project berhasil dihapus" : "Modul berhasil dihapus");
      setModules((prev) => prev.filter((m) => m.id !== deleteId));
      if (selectedModuleId === deleteId) {
        setSelectedModuleId(null);
      }
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Edit Module Modal
  const openEditModal = (mod: any) => {
    setEditingModule(mod);
    setEditTitle(mod.title || "");
    setEditDescription(mod.description || "");
    setEditCategoryId(mod.category_id || "");
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
        category_id: editCategoryId,
        level: editLevel as any,
        notes: editNotes,
      });
      toast.success("Konten berhasil diperbarui!");
      setEditingModule(null);
      loadModules();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  // Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setCreatingCat(true);
    try {
      await createCategory({
        name: newCatName,
        color: newCatColor,
        parent_id: newCatParentId || null,
        icon: newCatIcon,
      });
      toast.success("Kategori baru berhasil dibuat!");
      setNewCatName("");
      setNewCatParentId("");
      setNewCatIcon("code");
      setShowCatModal(false);
      const cList = await getCategories();
      setCategories(cList);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCreatingCat(false);
    }
  };

  // Categories Model
  const effectiveCategories = useMemo(() => {
    const list: any[] = [];
    const dbCatMap = new Map<string, any>();
    if (categories && categories.length > 0) {
      categories.forEach((c: any) => {
        dbCatMap.set(c.name.toLowerCase().trim(), c);
      });
    }

    SYSTEM_PRIMARY_CATEGORIES.forEach((primary, pIdx) => {
      const dbParent = dbCatMap.get(primary.name.toLowerCase().trim());
      const parentId = dbParent?.id || `preset_parent_${pIdx}`;

      list.push({
        id: parentId,
        name: primary.name,
        icon: dbParent?.icon || primary.icon,
        color: dbParent?.color || primary.color,
        parent_id: null,
      });

      primary.subcategories.forEach((sub, sIdx) => {
        const dbSub = dbCatMap.get(sub.name.toLowerCase().trim());
        list.push({
          id: dbSub?.id || `preset_child_${pIdx}_${sIdx}`,
          name: sub.name,
          icon: sub.icon || dbSub?.icon || primary.icon,
          color: sub.color || dbSub?.color || primary.color,
          parent_id: parentId,
        });
      });
    });

    if (categories && categories.length > 0) {
      const systemNames = new Set<string>();
      SYSTEM_PRIMARY_CATEGORIES.forEach((p) => {
        systemNames.add(p.name.toLowerCase().trim());
        p.subcategories.forEach((s) => systemNames.add(s.name.toLowerCase().trim()));
      });

      categories.forEach((c: any) => {
        if (!systemNames.has(c.name.toLowerCase().trim())) {
          list.push(c);
        }
      });
    }

    return list;
  }, [categories]);

  const OFFICIAL_PRIMARY_NAMES = useMemo(() => {
    return new Set(SYSTEM_PRIMARY_CATEGORIES.map((p) => p.name.toLowerCase()));
  }, []);

  const parentCategories = useMemo(() => {
    return effectiveCategories.filter(
      (c: any) => !c.parent_id && OFFICIAL_PRIMARY_NAMES.has(c.name.toLowerCase())
    );
  }, [effectiveCategories, OFFICIAL_PRIMARY_NAMES]);

  const childCategories = useMemo(() => {
    return effectiveCategories.filter((c: any) => {
      if (c.parent_id) return true;
      return !OFFICIAL_PRIMARY_NAMES.has(c.name.toLowerCase());
    });
  }, [effectiveCategories, OFFICIAL_PRIMARY_NAMES]);

  // Current Navigation Objects
  const activeParentObj = useMemo(() => {
    if (!selectedParentId) return null;
    return (
      parentCategories.find(
        (p) =>
          p.id === selectedParentId ||
          p.name.toLowerCase() === selectedParentId.toLowerCase()
      ) || null
    );
  }, [selectedParentId, parentCategories]);

  const activeSubcatObj = useMemo(() => {
    if (!selectedSubcatId) return null;
    return (
      childCategories.find(
        (c) =>
          c.id === selectedSubcatId ||
          c.name.toLowerCase() === selectedSubcatId.toLowerCase()
      ) || null
    );
  }, [selectedSubcatId, childCategories]);

  const activeModuleObj = useMemo(() => {
    if (!selectedModuleId) return null;
    return modules.find((m) => m.id === selectedModuleId) || null;
  }, [selectedModuleId, modules]);

  // Filtered by Mode (Module vs Project)
  const currentModeItems = useMemo(() => {
    return modules.filter((m) => {
      if (contentMode === "project") {
        return m.kind === "project";
      }
      return m.kind !== "project";
    });
  }, [modules, contentMode]);

  // Dynamic accurate counts per parent category (Modul & Project)
  const getParentCounts = useCallback(
    (parent: any) => {
      const subcats = childCategories.filter((c) => c.parent_id === parent.id);
      const subcatIds = new Set(subcats.map((s) => s.id));
      const subcatNames = new Set(subcats.map((s) => s.name.toLowerCase().trim()));
      const parentName = parent.name.toLowerCase().trim();

      const matchedItems = modules.filter((m) => {
        if (m.category_id === parent.id) return true;
        if (m.category?.id === parent.id) return true;
        if (m.category_id && subcatIds.has(m.category_id)) return true;
        if (m.category?.name && subcatNames.has(m.category.name.toLowerCase().trim())) return true;
        if (m.category?.name && m.category.name.toLowerCase().trim() === parentName) return true;
        return false;
      });

      const moduleCount = matchedItems.filter((m) => m.kind !== "project").length;
      const projectCount = matchedItems.filter((m) => m.kind === "project").length;

      return {
        subcatCount: subcats.length,
        moduleCount,
        projectCount,
      };
    },
    [modules, childCategories]
  );

  // Dynamic accurate counts per subcategory (Modul & Project)
  const getSubcategoryCounts = useCallback(
    (subcat: any) => {
      const subcatName = subcat.name.toLowerCase().trim();
      const matchedItems = modules.filter((m) => {
        if (m.category_id === subcat.id) return true;
        if (m.category?.id === subcat.id) return true;
        if (m.category?.name?.toLowerCase().trim() === subcatName) return true;
        return false;
      });

      const moduleCount = matchedItems.filter((m) => m.kind !== "project").length;
      const projectCount = matchedItems.filter((m) => m.kind === "project").length;

      return { moduleCount, projectCount };
    },
    [modules]
  );

  // Filtered Parents
  const filteredParents = useMemo(() => {
    let list = parentCategories;
    const q = search.toLowerCase().trim();

    if (q) {
      list = list.filter((p) => {
        const pMatch = p.name.toLowerCase().includes(q);
        const subMatch = childCategories.some(
          (c) => c.parent_id === p.id && c.name.toLowerCase().includes(q)
        );
        const itemMatch = modules.some((m) => {
          const matchCat = m.category_id === p.id || m.category?.id === p.id;
          if (!matchCat) return false;
          return (
            m.title?.toLowerCase().includes(q) ||
            m.description?.toLowerCase().includes(q) ||
            m.tech_stack?.some((t: string) => t.toLowerCase().includes(q))
          );
        });
        return pMatch || subMatch || itemMatch;
      });
    }

    return list;
  }, [parentCategories, childCategories, modules, search]);

  // Filtered Subcats
  const filteredSubcatsForActiveParent = useMemo(() => {
    if (!activeParentObj) return [];
    const subcats = childCategories.filter((c) => c.parent_id === activeParentObj.id);
    if (!search.trim()) return subcats;
    const q = search.toLowerCase().trim();
    return subcats.filter((c) => c.name.toLowerCase().includes(q));
  }, [activeParentObj, childCategories, search]);

  // Filtered Items for active subcategory
  const filteredItemsForActiveSubcat = useMemo(() => {
    if (!activeSubcatObj) return [];
    const subcatName = activeSubcatObj.name.toLowerCase().trim();

    const list = currentModeItems.filter((m) => {
      const matchCat =
        m.category_id === activeSubcatObj.id ||
        m.category?.name?.toLowerCase().trim() === subcatName ||
        m.category?.id === activeSubcatObj.id;

      if (!matchCat) return false;
      if (levelFilter && m.level !== levelFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchTitle = m.title?.toLowerCase().includes(q);
        const matchDesc = m.description?.toLowerCase().includes(q);
        const matchTech = m.tech_stack?.some((t: string) => t.toLowerCase().includes(q));
        const matchAuthor = m.author_name?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchTech && !matchAuthor) return false;
      }
      return true;
    });

    return list.sort((a, b) => {
      const timeA = new Date(a.created_at || 0).getTime();
      const timeB = new Date(b.created_at || 0).getTime();
      return timeB - timeA;
    });
  }, [activeSubcatObj, currentModeItems, levelFilter, search]);

  // Recommendations: Split into Related Projects & Related Modules
  const relatedProjects = useMemo(() => {
    if (!activeModuleObj) return [];
    const currentCatId = activeModuleObj.category_id;
    return modules
      .filter((m) => m.id !== activeModuleObj.id && m.kind === "project")
      .sort((a, b) => {
        const aCat = a.category_id === currentCatId ? 1 : 0;
        const bCat = b.category_id === currentCatId ? 1 : 0;
        return bCat - aCat;
      })
      .slice(0, 3);
  }, [modules, activeModuleObj]);

  const relatedModules = useMemo(() => {
    if (!activeModuleObj) return [];
    const currentCatId = activeModuleObj.category_id;
    return modules
      .filter((m) => m.id !== activeModuleObj.id && m.kind !== "project")
      .sort((a, b) => {
        const aCat = a.category_id === currentCatId ? 1 : 0;
        const bCat = b.category_id === currentCatId ? 1 : 0;
        return bCat - aCat;
      })
      .slice(0, 3);
  }, [modules, activeModuleObj]);

  return (
    <div className="page-container space-y-6 sm:space-y-8 pb-16 animate-fade-in">
      {/* ─── Global Top Header ─── */}
      <PageHeader
        eyebrow="~/curriculum & code"
        technicalMark="< syllabus // repos />"
        title="Modul & Project Repositori"
        description="Akses silabus kurikulum pembelajaran dan repositori source code project secara terstruktur."
        actions={
          <>
            <Button
              type="button"
              onClick={() => setShowSmartModal(true)}
              size="sm"
              className="flex-1 sm:flex-none gap-1.5 text-xs bg-brand-600 hover:bg-brand-500 text-white font-semibold justify-center h-9"
            >
              <Sparkles className="w-3.5 h-3.5" /> Sortir Otomatis
            </Button>

            <Link href={`/dashboard/modul/baru?mode=${contentMode}`} className="flex-1 sm:flex-none">
              <Button size="sm" className="w-full gap-1.5 text-xs font-semibold justify-center h-9">
                <Plus className="w-4 h-4" /> {contentMode === "project" ? "Tambah Project" : "Tambah Modul"}
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleBatchAutoSort}
              loading={batchSorting}
              className="hidden sm:inline-flex gap-1.5 text-xs border-border text-text-secondary hover:text-text-primary hover:bg-surface-secondary justify-center h-9"
              title="Sortir konten ke subkategori yang sesuai"
            >
              <Sparkles className="w-3.5 h-3.5 text-text-tertiary" /> Rapikan
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCatModal(true)}
              className="hidden sm:inline-flex gap-1.5 text-xs border border-border h-9"
            >
              <Tag className="w-3.5 h-3.5 text-text-tertiary" /> + Kategori
            </Button>
          </>
        }
      />

      {/* ─── DUAL-MODE SEGMENTED TABS: [ Modul ] [ Project ] ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 bg-surface rounded-2xl border border-border shadow-sm">
        <div className="grid grid-cols-2 p-1 bg-surface-secondary rounded-xl border border-border/80 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setContentMode("module");
              setSelectedModuleId(null);
              updateUrlParams(selectedParentId, selectedSubcatId, null, "module");
            }}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              contentMode === "module"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Modul</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-black/20 text-white font-mono ml-1">
              {modules.filter((m) => m.kind !== "project").length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setContentMode("project");
              setSelectedModuleId(null);
              updateUrlParams(selectedParentId, selectedSubcatId, null, "project");
            }}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              contentMode === "project"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
            }`}
          >
            <Code className="w-4 h-4 shrink-0" />
            <span>Project</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-black/20 text-white font-mono ml-1">
              {modules.filter((m) => m.kind === "project").length}
            </span>
          </button>
        </div>

        {/* Scope Filter Bar (Community vs Mine) */}
        <div className="flex items-center justify-between sm:justify-end gap-2 px-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-secondary border border-border/80">
            <button
              type="button"
              onClick={() => setScope("all")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
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
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
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
      </div>

      {/* ─── Breadcrumb Navigation ─── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs flex-wrap bg-surface p-2.5 sm:p-3 rounded-2xl border border-border shadow-sm">
        <button
          type="button"
          onClick={handleBackToParents}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-colors ${
            !selectedParentId
              ? "bg-brand-600 text-white font-bold shadow-sm"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>{contentMode === "project" ? "Kategori Project" : "Semua Kategori"}</span>
        </button>

        {activeParentObj && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
            <button
              type="button"
              onClick={handleBackToSubcats}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedParentId && !selectedSubcatId
                  ? "bg-brand-600 text-white font-bold shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
              }`}
            >
              <TechIcon name={activeParentObj.icon || activeParentObj.name} size={14} className="shrink-0" />
              <span>{activeParentObj.name}</span>
            </button>
          </>
        )}

        {activeSubcatObj && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
            <button
              type="button"
              onClick={handleBackToModuleList}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedSubcatId && !selectedModuleId
                  ? "bg-brand-600 text-white font-bold shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
              }`}
            >
              <TechIcon name={activeSubcatObj.icon || activeSubcatObj.name} size={14} className="shrink-0" />
              <span>{activeSubcatObj.name}</span>
            </button>
          </>
        )}

        {activeModuleObj && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
            <span className="px-2.5 py-1 rounded-lg bg-surface-secondary text-text-primary font-bold truncate max-w-[200px]">
              {activeModuleObj.title}
            </span>
          </>
        )}
      </nav>

      {/* ============================================================
          LEVEL 1: KATALOG KATEGORI UTAMA (SHARED ANTARA MODUL & PROJECT)
          ============================================================ */}
      {!selectedParentId && !selectedModuleId && (
        <section className="space-y-6 animate-fade-in">
          {/* Search bar */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                contentMode === "project"
                  ? "Cari project, source code, notebook, atau bahasa (contoh: Python, Next.js, ML)..."
                  : "Cari kategori modul pembelajaran (contoh: Python, AI, Database)..."
              }
              className="w-full pl-10 pr-16 py-2.5 sm:py-3 rounded-2xl bg-surface border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500 shadow-sm transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-secondary hover:text-text-primary px-2 py-1 rounded-lg bg-surface-secondary hover:bg-surface-tertiary border border-border flex items-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span className="font-medium text-[11px]">Reset</span>
              </button>
            )}
          </div>

          {/* Category Grid - SHARED by both MODUL and PROJECT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={idx} className="h-28 rounded-2xl" />
              ))
            ) : filteredParents.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-surface border border-border rounded-2xl p-6">
                <FolderOpen className="w-10 h-10 text-text-tertiary mx-auto mb-2" />
                <h3 className="text-sm font-bold text-text-primary">Kategori Tidak Ditemukan</h3>
                <p className="text-xs text-text-secondary mt-1">
                  Tidak ada kategori yang cocok dengan pencarian &quot;{search}&quot;.
                </p>
              </div>
            ) : (
              filteredParents.map((parent) => {
                const { subcatCount, moduleCount, projectCount } = getParentCounts(parent);

                return (
                  <div
                    key={parent.id}
                    onClick={() => handleSelectParent(parent.id)}
                    className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border bg-surface hover:bg-surface-secondary/60 hover:border-brand-500/40 cursor-pointer shadow-2xs transition-all active:scale-[0.99] touch-manipulation min-h-[72px]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-surface-secondary border border-border/80 flex items-center justify-center shrink-0 text-text-primary group-hover:border-brand-500/40 group-hover:text-brand-400 transition-colors">
                        <TechIcon name={parent.icon || parent.name} size={20} />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <h3 className="text-xs sm:text-sm font-bold text-text-primary truncate tracking-tight group-hover:text-brand-400 transition-colors font-display">
                          {parent.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-text-tertiary">
                          <span>{subcatCount} Subkategori</span>
                          <span>•</span>
                          <span className={moduleCount > 0 ? "text-brand-400 font-semibold" : ""}>
                            {moduleCount} Modul
                          </span>
                          <span>•</span>
                          <span className={projectCount > 0 ? "text-purple-400 font-semibold" : ""}>
                            {projectCount} Project
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-7.5 h-7.5 rounded-lg bg-surface-secondary flex items-center justify-center text-text-tertiary group-hover:text-brand-400 group-hover:bg-brand-500/10 transition-colors shrink-0 ml-2">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* ============================================================
          LEVEL 2: DAFTAR SUBKATEGORI (SHARED)
          ============================================================ */}
      {selectedParentId && !selectedSubcatId && activeParentObj && (
        <section className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-4 sm:p-5 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBackToParents}
                className="w-9 h-9 rounded-xl bg-surface-secondary hover:bg-surface-tertiary border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors shrink-0"
                title="Kembali ke Semua Kategori"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <TechIcon name={activeParentObj.icon || activeParentObj.name} size={18} className="text-brand-400" />
                  <h2 className="text-base sm:text-lg font-bold text-text-primary">
                    {activeParentObj.name}
                  </h2>
                </div>
                <p className="text-xs text-text-secondary">
                  Pilih subkategori bidang untuk melihat {contentMode === "project" ? "project & source code" : "modul pembelajaran"}.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBackToParents}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface-secondary hover:bg-surface-tertiary text-text-secondary border border-border self-start sm:self-auto transition-colors"
            >
              <span>‹ Kembali</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Cari subkategori dalam ${activeParentObj.name}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredSubcatsForActiveParent.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-surface border border-border rounded-2xl p-6">
                <FolderOpen className="w-10 h-10 text-text-tertiary mx-auto mb-2" />
                <h3 className="text-sm font-bold text-text-primary">Subkategori Tidak Ditemukan</h3>
                <p className="text-xs text-text-secondary mt-1">
                  Tidak ada subkategori yang sesuai dengan kata kunci pencarian.
                </p>
              </div>
            ) : (
              filteredSubcatsForActiveParent.map((subcat) => {
                const { moduleCount, projectCount } = getSubcategoryCounts(subcat);

                return (
                  <div
                    key={subcat.id}
                    onClick={() => handleSelectSubcat(subcat.name)}
                    className="group relative flex flex-col justify-between p-4 rounded-2xl border border-border bg-surface hover:bg-surface-secondary/70 hover:border-brand-500/40 cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-[0.99] touch-manipulation min-h-[110px]"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-surface-secondary border border-border flex items-center justify-center shrink-0 text-text-primary group-hover:border-brand-500/40 group-hover:text-brand-400 transition-colors shadow-inner">
                        <TechIcon name={subcat.icon || subcat.name} size={20} />
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                        <span className={`px-2 py-0.5 rounded-full border ${
                          moduleCount > 0
                            ? "bg-brand-500/10 text-brand-400 border-brand-500/30 font-bold"
                            : "bg-surface-secondary text-text-tertiary border-border"
                        }`}>
                          {moduleCount} Modul
                        </span>
                        <span className={`px-2 py-0.5 rounded-full border ${
                          projectCount > 0
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/30 font-bold"
                            : "bg-surface-secondary text-text-tertiary border-border"
                        }`}>
                          {projectCount} Project
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xs sm:text-sm font-bold text-text-primary truncate group-hover:text-brand-400 transition-colors">
                        {subcat.name}
                      </h3>
                      <p className="text-[11px] text-text-tertiary truncate">
                        Subkategori • {activeParentObj.name}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-xs text-text-secondary group-hover:text-brand-400 font-semibold">
                      <span>Buka {contentMode === "project" ? "Project" : "Modul"}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* ============================================================
          LEVEL 3: DAFTAR MODUL / PROJECT DALAM SUBKATEGORI
          ============================================================ */}
      {selectedParentId && selectedSubcatId && !selectedModuleId && (
        <section className="space-y-6 animate-fade-in">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-4 sm:p-5 rounded-2xl border border-border shadow-xs dark:before:pointer-events-none dark:before:absolute dark:before:inset-x-0 dark:before:top-0 dark:before:h-px dark:before:bg-white/[0.08] relative overflow-hidden">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBackToSubcats}
                className="w-9 h-9 rounded-xl bg-surface-secondary hover:bg-surface-tertiary border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors shrink-0 cursor-pointer"
                title="Kembali ke Subkategori"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  {activeSubcatObj && (
                    <TechIcon name={activeSubcatObj.icon || activeSubcatObj.name} size={18} className="text-brand-400" />
                  )}
                  <h2 className="text-base sm:text-lg font-bold text-text-primary font-display tracking-tight">
                    {activeSubcatObj?.name || selectedSubcatId}
                  </h2>
                </div>
                <p className="text-xs text-text-secondary">
                  Daftar {contentMode === "project" ? "project source code & repositori" : "modul pembelajaran terstruktur"} dalam bidang ini.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleBackToSubcats}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface-secondary hover:bg-surface-tertiary text-text-secondary border border-border transition-colors cursor-pointer"
              >
                <span>‹ Subkategori</span>
              </button>

              <Link href={`/dashboard/modul/kategori/baru?parent=${selectedParentId}&subcat=${encodeURIComponent(selectedSubcatId || "")}&mode=${contentMode}`}>
                <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-xs">
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ {contentMode === "project" ? "Project" : "Modul"}</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Module List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredItemsForActiveSubcat.length === 0 ? (
              <EmptyState
                className="col-span-full"
                icon={<FolderOpen className="w-12 h-12 text-text-tertiary" />}
                title={`Belum Ada ${contentMode === "project" ? "Project" : "Modul"}`}
                description={`Belum ada ${contentMode === "project" ? "project atau source code" : "modul pembelajaran"} yang ditambahkan dalam subkategori ini.`}
                action={
                  <Link href={`/dashboard/modul/kategori/baru?parent=${selectedParentId}&subcat=${encodeURIComponent(selectedSubcatId || "")}&mode=${contentMode}`}>
                    <Button size="sm">+ Tambah {contentMode === "project" ? "Project" : "Modul"} Sekarang</Button>
                  </Link>
                }
              />
            ) : (
              filteredItemsForActiveSubcat.map((mod) => {
                const driveData = extractModuleDriveFromNotes(mod.notes);
                const author = mod.author_name || driveData.authorName || "Pengguna";
                const isProj = mod.kind === "project";

                return (
                  <Card
                    key={mod.id}
                    className="p-4 sm:p-4.5 lg:p-5 rounded-xl bg-surface border-border hover:border-brand-500/40 hover:bg-surface-secondary/60 transition-all space-y-3 shadow-2xs w-full flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant={isProj ? "purple" : "brand"}
                          size="sm"
                          isMono
                        >
                          {isProj ? "PROJECT" : "MODUL"}
                        </Badge>
                        <Badge variant="secondary" size="sm">
                          {MODULE_LEVEL_LABELS[mod.level as ModuleLevel] || mod.level}
                        </Badge>
                      </div>

                      <h3
                        onClick={() => handleSelectModule(mod.id)}
                        className="text-sm sm:text-base font-bold text-text-primary hover:text-brand-400 cursor-pointer transition-colors leading-snug font-display tracking-tight"
                      >
                        {mod.title}
                      </h3>

                      {/* Description */}
                      {mod.description && (
                        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                          {mod.description}
                        </p>
                      )}

                      {/* Metadata Hierarchy Line */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-text-tertiary pt-0.5 font-mono">
                        <span>
                          {isProj
                            ? `${driveData.files.length} Berkas`
                            : `${(mod.chapters || []).length} Bab`}
                        </span>
                        <span>·</span>
                        <span className="font-sans">{author}</span>
                        {mod.repository_url && (
                          <>
                            <span>·</span>
                            <a
                              href={mod.repository_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-400 hover:underline inline-flex items-center gap-1 font-sans"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github className="w-3 h-3" /> Repo
                            </a>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-border/50 flex items-center justify-between gap-3">
                      <div className="flex-1 max-w-[120px] bg-surface-secondary rounded-full h-1.5 overflow-hidden border border-border">
                        <div
                          className="bg-brand-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${mod.progress || 0}%` }}
                        />
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleSelectModule(mod.id)}
                        className="gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
                      >
                        <span>{isProj ? "Buka Project" : "Buka Modul"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* ============================================================
          LEVEL 4: DETAIL DOSSIER (PROJECT / MODUL)
          ============================================================ */}
      {selectedModuleId && activeModuleObj && (
        <section className="space-y-6 animate-fade-in">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-4 sm:p-5 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={handleBackToModuleList}
                className="w-9 h-9 rounded-xl bg-surface-secondary hover:bg-surface-tertiary border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors shrink-0 cursor-pointer"
                title="Kembali ke Daftar"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">
                  {activeModuleObj.kind === "project" ? "Repositori Project" : "Ruang Belajar Modul"}
                </span>
                <h2 className="text-base sm:text-xl font-bold text-text-primary truncate">
                  {activeModuleObj.title}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBackToModuleList}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface-secondary hover:bg-surface-tertiary text-text-secondary border border-border self-start sm:self-auto transition-colors cursor-pointer"
            >
              <span>‹ Kembali ke Daftar</span>
            </button>
          </div>

          {(() => {
            const mod = activeModuleObj;
            const chapters = mod.chapters || [];
            const driveData = extractModuleDriveFromNotes(mod.notes);
            const author = mod.author_name || driveData.authorName || "Pengguna";
            const isMyModule = Boolean(currentUser && mod.user_id === currentUser.id);
            const isOwner = currentUser?.email === OWNER_EMAIL || (currentUser?.email && isAdminUser(currentUser.email));
            const canEditOrDelete = isMyModule || isOwner;
            const isProject = mod.kind === "project";

            // Find readme file if any
            const readmeFile = driveData.files.find((f) => f.name.toLowerCase().startsWith("readme"));

            return (
              <div className="space-y-6">
                {/* 1. Overview Dossier Card */}
                <Card className="p-5 sm:p-6 rounded-2xl bg-surface border-border space-y-4 shadow-sm w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {isProject && (
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                            PROJECT REPOSITORY
                          </span>
                        )}
                        <Badge variant="secondary">
                          {MODULE_LEVEL_LABELS[mod.level as ModuleLevel] || mod.level}
                        </Badge>
                        {activeSubcatObj && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface-secondary text-text-secondary border border-border">
                            <TechIcon name={activeSubcatObj.icon || activeSubcatObj.name} size={14} className="shrink-0" />
                            {activeSubcatObj.name}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface-secondary text-text-secondary border border-border">
                          <User className="w-3.5 h-3.5 shrink-0" />
                          <span>Dibuat oleh: <strong className="text-text-primary">{author}</strong></span>
                        </span>
                      </div>

                      {/* Tech Stacks */}
                      {mod.tech_stack && mod.tech_stack.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {mod.tech_stack.map((t: string) => (
                            <span
                              key={t}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {mod.description && (
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pt-1">
                          {mod.description}
                        </p>
                      )}

                      {/* External Repository / Demo links */}
                      {(mod.repository_url || mod.demo_url) && (
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          {mod.repository_url && (
                            <a
                              href={mod.repository_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface-secondary hover:bg-surface-tertiary border border-border text-text-primary transition-colors"
                            >
                              <Github className="w-3.5 h-3.5" />
                              <span>Buka GitHub Repository</span>
                              <ExternalLink className="w-3 h-3 text-text-tertiary" />
                            </a>
                          )}
                          {mod.demo_url && (
                            <a
                              href={mod.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Live Preview Demo</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const isNow = toggleBookmark({
                            id: mod.id,
                            type: "module",
                            title: mod.title,
                            category: activeSubcatObj?.name || "Modul & Project",
                            level: mod.level,
                          });
                          toast.success(
                            isNow ? "Berhasil ditambahkan ke Bookmark!" : "Dihapus dari Bookmark"
                          );
                        }}
                        className="p-2.5 rounded-xl bg-surface-secondary hover:bg-surface-tertiary text-text-secondary hover:text-brand-400 border border-border transition-colors cursor-pointer"
                        title="Simpan ke Bookmark"
                      >
                        {isBookmarked(mod.id) ? (
                          <BookmarkCheck className="w-4 h-4 text-brand-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>

                      {canEditOrDelete && (
                        <>
                          <Link href={`/dashboard/modul/edit/${mod.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-9 px-3 gap-1 border border-border"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Edit
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(mod.id)}
                            className="text-xs h-9 px-3 gap-1 text-danger-400 hover:text-danger-300 hover:bg-danger-500/10 border border-danger-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-xs text-text-secondary">
                      <span>Progres Penyelesaian</span>
                      <span className="font-mono font-bold text-brand-400">{mod.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-surface-secondary rounded-full h-2">
                      <div
                        className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${mod.progress || 0}%` }}
                      />
                    </div>
                  </div>
                </Card>

                {/* 2. Project / Module Drive & Files Explorer */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                      <Folder className="w-4 h-4 text-brand-400" />
                      <span>{isProject ? "Project Files & Repositori" : "File Materi Modul"}</span>
                      <span className="text-xs text-text-tertiary font-mono">({driveData.files.length} berkas)</span>
                    </h3>
                  </div>

                  <ModuleDriveExplorer
                    moduleId={mod.id}
                    moduleTitle={mod.title}
                    initialFolders={driveData.folders}
                    initialFiles={driveData.files}
                    initialNotes={mod.notes}
                    onSync={handleDriveSync}
                    onFilePreview={(file: ModuleDriveFile) => setSelectedQuickPreviewFile(file)}
                  />
                </div>

                {/* 3. Inline README.md Preview (For Projects) */}
                {readmeFile && readmeFile.textContent && (
                  <Card className="p-5 sm:p-6 rounded-2xl bg-surface border-border space-y-3 shadow-sm w-full">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <h4 className="text-xs sm:text-sm font-bold text-text-primary flex items-center gap-2 font-mono">
                        <FileCode className="w-4 h-4 text-brand-400" />
                        <span>README.md — Dokumentasi Proyek</span>
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedQuickPreviewFile(readmeFile)}
                        className="text-xs h-7 gap-1"
                      >
                        <Eye className="w-3 h-3" /> Buka Penuh
                      </Button>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-wrap font-sans bg-surface-secondary/40 p-4 rounded-xl border border-border/60">
                      {readmeFile.textContent}
                    </div>
                  </Card>
                )}

                {/* 4. Structured Syllabus / Sections Checklist */}
                <Card className="p-5 sm:p-6 rounded-2xl bg-surface border-border space-y-4 shadow-sm w-full">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h4 className="text-xs sm:text-sm font-bold text-text-primary flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-brand-400" />
                      <span>
                        {isProject
                          ? `Isi Project (Alur Pembelajaran ${
                              (driveData.sections && driveData.sections.length > 0)
                                ? driveData.sections.length
                                : chapters.length > 0
                                ? chapters.length
                                : 6
                            } Tahap)`
                          : `Isi Modul (${chapters.length} Bab)`}
                      </span>
                    </h4>
                    <span className="text-xs text-text-tertiary font-mono">
                      {chapters.filter((c: any) => c.is_completed).length}/{chapters.length || (driveData.sections?.length || 6)} Selesai
                    </span>
                  </div>

                  {/* Sections List */}
                  {chapters.length > 0 ? (
                    <div className="space-y-2">
                      {chapters.map((chap: any, idx: number) => (
                        <div
                          key={chap.id}
                          onClick={() => handleToggleChapter(chap.id, mod.id, chap.is_completed)}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                            chap.is_completed
                              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                              : "bg-surface-secondary border-border text-text-primary hover:border-brand-500/30"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-surface border border-border flex items-center justify-center text-xs font-mono font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <span className={`text-xs font-medium truncate ${chap.is_completed ? "line-through text-text-tertiary" : ""}`}>
                              {chap.title}
                            </span>
                          </div>
                          <div className="shrink-0">
                            {chap.is_completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <div className="w-4 h-4 rounded-md border border-border" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : driveData.sections && driveData.sections.length > 0 ? (
                    <div className="space-y-2">
                      {driveData.sections.map((sec, idx) => (
                        <div
                          key={sec.id || idx}
                          className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-secondary text-text-primary"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-surface border border-border flex items-center justify-center text-xs font-mono font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-medium truncate">
                              {sec.title}
                            </span>
                          </div>
                          <div className="w-4 h-4 rounded-md border border-border shrink-0" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {[
                        "1. Tujuan & Arsitektur Project",
                        "2. Persiapan Data & Lingkungan Kerja",
                        "3. Pemrosesan Data & Exploratory Analysis",
                        "4. Implementasi Logika / Training Model",
                        "5. Pengujian & Evaluasi Hasil",
                        "6. Kesimpulan & Panduan Menjalankan Kode",
                      ].map((sec, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-secondary text-text-primary"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-surface border border-border flex items-center justify-center text-xs font-mono font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-medium truncate">
                              {sec}
                            </span>
                          </div>
                          <div className="w-4 h-4 rounded-md border border-border shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Chapter / Section Input */}
                  {canEditOrDelete && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddChapter(mod.id);
                      }}
                      className="flex items-center gap-2 pt-2"
                    >
                      <Input
                        placeholder={isProject ? "Tambah tahap project baru..." : "Judul bab baru..."}
                        value={newChapterTitle}
                        onChange={(e) => setNewChapterTitle(e.target.value)}
                        className="text-xs"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        loading={addingChapter}
                        disabled={!newChapterTitle.trim()}
                        className="text-xs font-semibold shrink-0"
                      >
                        {isProject ? "+ Tambah Tahap" : "+ Tambah Bab"}
                      </Button>
                    </form>
                  )}
                </Card>

                {/* 5. Community Comments & Reaction Bar */}
                <ModuleInteractionBar
                  moduleId={mod.id}
                  moduleTitle={mod.title}
                  initialComments={driveData.comments}
                  initialReactions={driveData.reactions}
                  initialNotes={mod.notes}
                  onSync={handleDriveSync}
                />

                {/* 6. RECOMMENDATIONS SECTION (Symmetric & Reusable) */}
                <div className="space-y-6 pt-4 border-t border-border">
                  {isProject ? (
                    <>
                      {/* Related Projects */}
                      {relatedProjects.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                              <Code className="w-4 h-4 text-purple-400" />
                              <span>Project Terkait</span>
                            </h3>
                            <span className="text-xs text-text-tertiary">Repositori dengan topik serupa</span>
                          </div>

                          <div className="space-y-2.5 w-full">
                            {relatedProjects.map((rec) => {
                              const recDrive = extractModuleDriveFromNotes(rec.notes);
                              return (
                                <div
                                  key={rec.id}
                                  onClick={() => handleSelectModule(rec.id)}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border bg-surface-secondary/40 hover:bg-surface-secondary/80 hover:border-brand-500/40 transition-all cursor-pointer gap-2.5 w-full group"
                                >
                                  <div className="space-y-0.5 min-w-0 flex-1">
                                    <h4 className="text-xs sm:text-sm font-semibold text-text-primary group-hover:text-brand-400 truncate">
                                      {rec.title}
                                    </h4>
                                    {rec.description && (
                                      <p className="text-xs text-text-secondary line-clamp-1 leading-relaxed">
                                        {rec.description}
                                      </p>
                                    )}
                                    <div className="text-[11px] text-text-tertiary flex items-center gap-1.5 pt-0.5">
                                      {rec.tech_stack && rec.tech_stack.length > 0 && (
                                        <>
                                          <span className="text-text-secondary font-medium">{rec.tech_stack.slice(0, 2).join(", ")}</span>
                                          <span>·</span>
                                        </>
                                      )}
                                      <span>{MODULE_LEVEL_LABELS[rec.level as ModuleLevel] || rec.level}</span>
                                      <span>·</span>
                                      <span>{recDrive.files.length} Berkas</span>
                                    </div>
                                  </div>

                                  <Button size="sm" variant="outline" className="text-xs h-8 px-3 gap-1 shrink-0 self-start sm:self-center">
                                    <span>Buka</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Related Modules for this Project */}
                      {relatedModules.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-brand-400" />
                              <span>Modul Terkait Project Ini</span>
                            </h3>
                            <span className="text-xs text-text-tertiary">Materi fundamental pendukung</span>
                          </div>

                          <div className="space-y-2.5 w-full">
                            {relatedModules.map((rec) => {
                              const recDrive = extractModuleDriveFromNotes(rec.notes);
                              return (
                                <div
                                  key={rec.id}
                                  onClick={() => handleSelectModule(rec.id)}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border bg-surface-secondary/40 hover:bg-surface-secondary/80 hover:border-brand-500/40 transition-all cursor-pointer gap-2.5 w-full group"
                                >
                                  <div className="space-y-0.5 min-w-0 flex-1">
                                    <h4 className="text-xs sm:text-sm font-semibold text-text-primary group-hover:text-brand-400 truncate">
                                      {rec.title}
                                    </h4>
                                    {rec.description && (
                                      <p className="text-xs text-text-secondary line-clamp-1 leading-relaxed">
                                        {rec.description}
                                      </p>
                                    )}
                                    <div className="text-[11px] text-text-tertiary flex items-center gap-1.5 pt-0.5">
                                      <span>Modul Pembelajaran</span>
                                      <span>·</span>
                                      <span>{MODULE_LEVEL_LABELS[rec.level as ModuleLevel] || rec.level}</span>
                                      <span>·</span>
                                      <span>{(rec.chapters || []).length} Bab</span>
                                    </div>
                                  </div>

                                  <Button size="sm" variant="outline" className="text-xs h-8 px-3 gap-1 shrink-0 self-start sm:self-center">
                                    <span>Buka Modul</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Modul Mode: Rekomendasi Modul */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-brand-400" />
                          <span>Rekomendasi Modul</span>
                        </h3>
                        <span className="text-xs text-text-tertiary">Bahan ajar kurikulum serupa</span>
                      </div>

                      <div className="space-y-2.5 w-full">
                        {relatedModules.map((rec) => {
                          const recDrive = extractModuleDriveFromNotes(rec.notes);
                          return (
                            <div
                              key={rec.id}
                              onClick={() => handleSelectModule(rec.id)}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border bg-surface-secondary/40 hover:bg-surface-secondary/80 hover:border-brand-500/40 transition-all cursor-pointer gap-2.5 w-full group"
                            >
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <h4 className="text-xs sm:text-sm font-semibold text-text-primary group-hover:text-brand-400 truncate">
                                  {rec.title}
                                </h4>
                                {rec.description && (
                                  <p className="text-xs text-text-secondary line-clamp-1 leading-relaxed">
                                    {rec.description}
                                  </p>
                                )}
                                <div className="text-[11px] text-text-tertiary flex items-center gap-1.5 pt-0.5">
                                  <span>Modul</span>
                                  <span>·</span>
                                  <span>{MODULE_LEVEL_LABELS[rec.level as ModuleLevel] || rec.level}</span>
                                  <span>·</span>
                                  <span>{(rec.chapters || []).length} Bab</span>
                                </div>
                              </div>

                              <Button size="sm" variant="outline" className="text-xs h-8 px-3 gap-1 shrink-0 self-start sm:self-center">
                                <span>Buka Modul</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </section>
      )}

      {/* ─── Modal In-App File Previewer (Supports Code, Jupyter Notebook, CSV, PDF) ─── */}
      <ModuleFilePreviewerModal
        file={selectedQuickPreviewFile}
        isOpen={Boolean(selectedQuickPreviewFile)}
        onClose={() => setSelectedQuickPreviewFile(null)}
      />

      {/* ─── Modal Edit Module / Project ─── */}
      <Modal
        isOpen={Boolean(editingModule)}
        onClose={() => setEditingModule(null)}
        title={editingModule?.kind === "project" ? "Edit Project Repositori" : "Edit Modul Pembelajaran"}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Input
            label="Judul"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />

          <Textarea
            label="Deskripsi Ringkas"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={3}
          />

          <Select
            label="Kategori"
            value={editCategoryId}
            onChange={(e) => setEditCategoryId(e.target.value)}
            options={childCategories.map((c: any) => ({
              value: c.id,
              label: c.name,
            }))}
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

      {/* ─── Modal Tambah Kategori ─── */}
      <Modal
        isOpen={showCatModal}
        onClose={() => setShowCatModal(false)}
        title="Tambah Kategori Baru"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <Input
            label="Nama Kategori / Subkategori"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Contoh: Rust, Go, Flutter, Cloud Computing..."
            required
          />

          <Select
            label="Kategori Induk (Opsional untuk Subkategori)"
            value={newCatParentId}
            onChange={(e) => setNewCatParentId(e.target.value)}
            placeholder="Tanpa Induk (Kategori Utama)"
            options={parentCategories.map((p) => ({
              value: p.id,
              label: p.name,
            }))}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCatModal(false)}
            >
              Batal
            </Button>
            <Button type="submit" loading={creatingCat}>
              Buat Kategori
            </Button>
          </div>
        </form>
      </Modal>

      {/* ─── Modal Smart Sorter ─── */}
      <SmartModuleSorterModal
        isOpen={showSmartModal}
        onClose={() => setShowSmartModal(false)}
        onSaved={loadModules}
      />

      {/* ─── Confirm Delete Dialog ─── */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={contentMode === "project" ? "Hapus Project" : "Hapus Modul"}
        description={`Apakah Anda yakin ingin menghapus ${contentMode === "project" ? "project" : "modul"} ini? Berkas terkait di dalamnya akan ikut terhapus.`}
        confirmText="Hapus Sekarang"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
