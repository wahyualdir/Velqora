"use client";

import { useState, useMemo, useRef } from "react";
import {
  Folder,
  FolderPlus,
  UploadCloud,
  FileText,
  FileCode,
  Download,
  Trash2,
  Eye,
  Pencil,
  Search,
  Grid,
  List,
  ChevronRight,
  Home,
  X,
  FileSpreadsheet,
} from "lucide-react";
import {
  ModuleDriveFolder,
  ModuleDriveFile,
  getFileCategory,
} from "@/types/module-drive";
import {
  saveModuleDrive,
  createModuleDriveFolder,
  deleteModuleDriveFolder,
  deleteModuleDriveFile,
  renameModuleDriveItem,
} from "@/actions/study-actions";
import { ModuleFilePreviewerModal } from "@/components/modul/module-file-previewer-modal";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET } from "@/lib/constants";
import { formatFileSize } from "@/lib/utils";
import { validateAcademicFile, validateAcademicText } from "@/lib/academic-content-filter";
import { toast } from "sonner";


const FOLDER_COLORS = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Indigo", value: "#6366f1" },
];

interface ModuleDriveExplorerProps {
  moduleId: string;
  moduleTitle: string;
  initialFolders: ModuleDriveFolder[];
  initialFiles: ModuleDriveFile[];
  initialNotes?: string | null;
  canEdit?: boolean;
  onDriveUpdated?: (folders: ModuleDriveFolder[], files: ModuleDriveFile[]) => void;
  onSync?: (moduleId: string, newFolders: any[], newFiles: any[]) => void;
  onFilePreview?: (file: ModuleDriveFile) => void;
}

export function ModuleDriveExplorer({
  moduleId,
  moduleTitle,
  initialFolders,
  initialFiles,
  initialNotes: _initialNotes,
  canEdit = true,
  onDriveUpdated,
  onSync: _onSync,
  onFilePreview: _onFilePreview,
}: ModuleDriveExplorerProps) {
  const [folders, setFolders] = useState<ModuleDriveFolder[]>(initialFolders || []);
  const [files, setFiles] = useState<ModuleDriveFile[]>(initialFiles || []);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // View Mode: grid vs list
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // In-App Previewer
  const [previewFile, setPreviewFile] = useState<ModuleDriveFile | null>(null);

  // Folder Creation Modal
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("#3b82f6");
  const [creatingFolder, setCreatingFolder] = useState(false);

  // Rename Item Modal
  const [renameTarget, setRenameTarget] = useState<{
    id: string;
    name: string;
    isFolder: boolean;
  } | null>(null);
  const [renaming, setRenaming] = useState(false);

  // Uploading state
  const [uploading, setUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync with parent when state changes
  const updateDriveState = (newFolders: ModuleDriveFolder[], newFiles: ModuleDriveFile[]) => {
    setFolders(newFolders);
    setFiles(newFiles);
    if (onDriveUpdated) {
      onDriveUpdated(newFolders, newFiles);
    }
  };

  // Breadcrumbs calculation
  const breadcrumbs = useMemo(() => {
    const crumbs: { id: string | null; name: string }[] = [
      { id: null, name: "Drive Modul" },
    ];
    let curr = currentFolderId;
    const path: { id: string | null; name: string }[] = [];

    while (curr) {
      const folder = folders.find((f) => f.id === curr);
      if (folder) {
        path.unshift({ id: folder.id, name: folder.name });
        curr = folder.parentId;
      } else {
        break;
      }
    }

    return [...crumbs, ...path];
  }, [folders, currentFolderId]);

  // Current folder's children folders (Sorted: oldest first)
  const currentSubfolders = useMemo(() => {
    return folders
      .filter((f) => f.parentId === currentFolderId)
      .sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeA - timeB;
      });
  }, [folders, currentFolderId]);

  // Current folder's files (Sorted: oldest first)
  const currentFiles = useMemo(() => {
    let list = files.filter((file) => file.folderId === currentFolderId);

    // Apply Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = files.filter(
        (file) =>
          file.name.toLowerCase().includes(q) ||
          file.category.toLowerCase().includes(q) ||
          file.extension.toLowerCase().includes(q)
      );
    }

    // Apply Category Filter
    if (categoryFilter !== "all") {
      list = list.filter((file) => {
        if (categoryFilter === "doc") return file.category === "word" || file.category === "pdf" || file.category === "text";
        if (categoryFilter === "code") return file.category === "python" || file.category === "jupyter" || file.category === "code";
        if (categoryFilter === "archive") return file.category === "archive";
        if (categoryFilter === "image") return file.category === "image";
        return file.category === categoryFilter;
      });
    }

    // Sort chronologically ascending: berkas paling lama berada paling atas
    return list.sort((a, b) => {
      const timeA = new Date(a.uploadedAt || 0).getTime();
      const timeB = new Date(b.uploadedAt || 0).getTime();
      return timeA - timeB;
    });
  }, [files, currentFolderId, searchQuery, categoryFilter]);

  // Total Storage Size
  const totalStorageBytes = useMemo(() => {
    return files.reduce((acc, f) => acc + (f.size || 0), 0);
  }, [files]);

  // Handle Create Folder
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    // Academic safety check for folder name
    const nameCheck = validateAcademicText(newFolderName);
    if (!nameCheck.isValid) {
      toast.error(nameCheck.reason || "Nama folder tidak sesuai dengan standar bahan ajar akademik");
      return;
    }

    setCreatingFolder(true);
    try {
      const newFolder = await createModuleDriveFolder(
        moduleId,
        newFolderName.trim(),
        currentFolderId,
        newFolderColor
      );

      const nextFolders = [...folders, newFolder];
      updateDriveState(nextFolders, files);
      toast.success(`Folder "${newFolderName}" berhasil dibuat!`);
      setNewFolderName("");
      setShowFolderModal(false);
    } catch (err: any) {
      toast.error(err.message || "Gagal membuat folder");
    } finally {
      setCreatingFolder(false);
    }
  };

  // Handle Delete Folder
  const handleDeleteFolder = async (folderId: string, folderName: string) => {
    if (!confirm(`Hapus folder "${folderName}"? Berkas di dalamnya akan dipindahkan ke folder induk.`)) {
      return;
    }

    try {
      await deleteModuleDriveFolder(moduleId, folderId);
      const nextFolders = folders.filter((f) => f.id !== folderId && f.parentId !== folderId);
      const nextFiles = files.map((f) => (f.folderId === folderId ? { ...f, folderId: currentFolderId } : f));
      updateDriveState(nextFolders, nextFiles);
      toast.success(`Folder "${folderName}" berhasil dihapus`);
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus folder");
    }
  };

  // Handle Delete File
  const handleDeleteFile = async (file: ModuleDriveFile) => {
    if (!confirm(`Hapus berkas "${file.name}" dari drive modul?`)) return;

    try {
      await deleteModuleDriveFile(moduleId, file.id, file.storagePath);
      const nextFiles = files.filter((f) => f.id !== file.id);
      updateDriveState(folders, nextFiles);
      toast.success(`Berkas "${file.name}" berhasil dihapus`);
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus berkas");
    }
  };

  // Handle Rename
  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameTarget || !renameTarget.name.trim()) return;

    setRenaming(true);
    try {
      await renameModuleDriveItem(
        moduleId,
        renameTarget.id,
        renameTarget.name.trim(),
        renameTarget.isFolder
      );

      if (renameTarget.isFolder) {
        const nextFolders = folders.map((f) =>
          f.id === renameTarget.id ? { ...f, name: renameTarget.name.trim() } : f
        );
        updateDriveState(nextFolders, files);
      } else {
        const nextFiles = files.map((f) =>
          f.id === renameTarget.id ? { ...f, name: renameTarget.name.trim() } : f
        );
        updateDriveState(folders, nextFiles);
      }

      toast.success("Nama berhasil diperbarui!");
      setRenameTarget(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah nama");
    } finally {
      setRenaming(false);
    }
  };

  // Handle Multi-file Upload with resilient storage & data URL fallback
  const handleUploadFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUploading(true);
    const uploadedNewFiles: ModuleDriveFile[] = [];

    try {
      const filesArray = Array.from(fileList);

      for (let i = 0; i < filesArray.length; i++) {
        const currentUploadFile = filesArray[i];

        // Academic safety and relevance validation
        const check = await validateAcademicFile(currentUploadFile);
        if (!check.isValid) {
          toast.error(
            check.reason ||
              `Berkas "${currentUploadFile.name}" terdeteksi tidak sesuai dengan bahan ajar akademik.`
          );
          continue;
        }

        setUploadProgressText(
          `Mengunggah (${i + 1}/${filesArray.length}): ${currentUploadFile.name}`
        );

        const catInfo = getFileCategory(currentUploadFile.name);
        const cleanFileName = currentUploadFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const storagePath = `modules/${user?.id || "guest"}/${Date.now()}_${cleanFileName}`;

        let fileUrl = "";
        let initialTextContent: string | undefined = undefined;

        // Extract text content for instant in-app previews
        if (
          catInfo.category === "jupyter" ||
          catInfo.category === "python" ||
          catInfo.category === "code" ||
          catInfo.category === "text" ||
          catInfo.category === "markdown" ||
          currentUploadFile.name.endsWith(".ipynb") ||
          currentUploadFile.name.endsWith(".py") ||
          currentUploadFile.name.endsWith(".csv") ||
          currentUploadFile.name.endsWith(".tsv") ||
          currentUploadFile.name.endsWith(".json") ||
          currentUploadFile.name.endsWith(".sql") ||
          currentUploadFile.name.endsWith(".txt") ||
          currentUploadFile.name.endsWith(".md")
        ) {
          try {
            initialTextContent = await currentUploadFile.text();
          } catch (e) {
            console.warn("Could not extract text preview:", e);
          }
        }

        // Try primary storage bucket
        if (user) {
          try {
            const { error: uploadError } = await supabase.storage
              .from(STORAGE_BUCKET)
              .upload(storagePath, currentUploadFile, { upsert: true });

            if (!uploadError) {
              const { data: publicUrlData } = supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(storagePath);
              fileUrl = publicUrlData.publicUrl;
            } else {
              // Fallback bucket
              const { error: fallbackErr } = await supabase.storage
                .from("files")
                .upload(storagePath, currentUploadFile, { upsert: true });

              if (!fallbackErr) {
                const { data: fallbackUrlData } = supabase.storage
                  .from("files")
                  .getPublicUrl(storagePath);
                fileUrl = fallbackUrlData.publicUrl;
              }
            }
          } catch (storageErr) {
            console.warn("Storage attempt failed:", storageErr);
          }
        }

        // If storage URL is still empty, create Base64 Data URL fallback
        if (!fileUrl) {
          try {
            fileUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(currentUploadFile);
            });
          } catch {
            fileUrl = "";
          }
        }

        const driveFile: ModuleDriveFile = {
          id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: currentUploadFile.name,
          folderId: currentFolderId,
          storagePath,
          url: fileUrl,
          size: currentUploadFile.size,
          fileType: currentUploadFile.type || catInfo.label,
          extension: catInfo.extension,
          category: catInfo.category,
          uploadedAt: new Date().toISOString(),
          textContent: initialTextContent,
        };

        uploadedNewFiles.push(driveFile);

        // Record in central files table if user is authenticated and storage succeeded
        if (user && fileUrl && !fileUrl.startsWith("data:")) {
          try {
            await supabase.from("files").insert({
              user_id: user.id,
              name: currentUploadFile.name,
              storage_path: storagePath,
              url: fileUrl,
              size: currentUploadFile.size,
              mime_type: currentUploadFile.type,
            });
          } catch (fErr) {
            console.warn("Could not insert central file record:", fErr);
          }
        }
      }

      if (uploadedNewFiles.length > 0) {
        const nextFiles = [...files, ...uploadedNewFiles];
        await saveModuleDrive(moduleId, folders, nextFiles);
        updateDriveState(folders, nextFiles);
        toast.success(`Berhasil mengunggah ${uploadedNewFiles.length} berkas ke drive modul!`);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengunggah berkas");
    } finally {
      setUploading(false);
      setUploadProgressText("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (canEdit && e.dataTransfer.files) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative rounded-3xl border transition-all duration-300 ${
        isDragOver
          ? "border-brand-500 ring-4 ring-brand-500/20 bg-brand-500/5"
          : "border-border bg-surface"
      } shadow-md overflow-hidden`}
    >
      {/* 1. Header Toolbar */}
      <div className="p-4 sm:p-5 border-b border-border bg-surface-secondary/50 space-y-3.5">
        {/* Top Row: Module Name + Storage Stats + Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-surface-secondary border border-border flex items-center justify-center text-brand-500 shadow-sm shrink-0">
              <Folder className="w-5 h-5 fill-current opacity-80" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-text-primary tracking-wide font-display">
                  Drive Modul
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-secondary text-text-secondary border border-border">
                  Penyimpanan Materi
                </span>
              </div>
              <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-1">
                {moduleTitle}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-mono text-text-tertiary mt-0.5">
                <span>{folders.length} Folder</span>
                <span>•</span>
                <span>{files.length} Berkas</span>
                <span>•</span>
                <span className="text-text-primary font-medium">{formatFileSize(totalStorageBytes)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Add Folder, Upload Files, View Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            {!canEdit && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/[0.05] text-slate-300 border border-white/[0.1] shadow-sm">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Mode Baca (Hanya Pembuat & Owner yang Dapat Mengubah)</span>
              </span>
            )}

            {canEdit && (
              <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowFolderModal(true)}
                  className="flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-surface-tertiary border border-border transition-colors"
                >
                  <FolderPlus className="w-4 h-4 text-text-tertiary" />
                  <span>+ Folder Baru</span>
                </button>

                <label className="flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 transition-colors cursor-pointer shadow-sm">
                  <UploadCloud className="w-4 h-4" />
                  <span>{uploading ? "Mengunggah..." : "Unggah Berkas"}</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    disabled={uploading}
                    onChange={(e) => handleUploadFiles(e.target.files)}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xlsx,.xls,.pptx,.ppt,.ipynb,.py,.js,.ts,.tsx,.jsx,.c,.cpp,.java,.go,.rs,.sql,.json,.html,.css,.md,.txt,.zip,.rar,.png,.jpg,.jpeg,.svg"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Second Row: Breadcrumbs & Search & View Switch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-1 text-xs overflow-x-auto custom-scrollbar py-0.5">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <div key={idx} className="flex items-center gap-1 shrink-0">
                  {idx === 0 ? (
                    <button
                      onClick={() => setCurrentFolderId(null)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                        isLast
                          ? "font-bold text-text-primary bg-surface-secondary border border-border"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                      }`}
                    >
                      <Home className="w-3.5 h-3.5 text-brand-500" />
                      <span>{crumb.name}</span>
                    </button>
                  ) : (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                      <button
                        onClick={() => setCurrentFolderId(crumb.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs transition-colors truncate max-w-[130px] ${
                          isLast
                            ? "font-bold text-text-primary bg-surface-secondary border border-border"
                            : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                        }`}
                      >
                        {crumb.name}
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Search Box & View Switch on mobile */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
              <input
                type="text"
                placeholder="Cari file di modul..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-8 text-xs rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-0.5 rounded transition-colors"
                  title="Hapus pencarian file"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Switch */}
            <div className="flex items-center h-9 p-0.5 rounded-lg bg-surface-secondary border border-border shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`h-7 w-7 flex items-center justify-center rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-brand-600 text-white font-bold shadow-2xs"
                    : "text-text-tertiary hover:text-text-primary"
                }`}
                title="Tampilan Kotak (Grid)"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`h-7 w-7 flex items-center justify-center rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-brand-600 text-white font-bold shadow-2xs"
                    : "text-text-tertiary hover:text-text-primary"
                }`}
                title="Tampilan Tabel (List)"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pt-1 text-xs">
          {[
            { id: "all", label: "Semua" },
            { id: "jupyter", label: "Jupyter (.ipynb)" },
            { id: "python", label: "Python (.py)" },
            { id: "pdf", label: "PDF" },
            { id: "word", label: "Word (.docx)" },
            { id: "code", label: "Source Code" },
            { id: "archive", label: "Arsip (ZIP)" },
            { id: "image", label: "Gambar" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap border transition-all ${
                categoryFilter === cat.id
                  ? "bg-brand-600 text-white border-brand-600 font-semibold shadow-2xs"
                  : "bg-surface-secondary text-text-secondary border-border hover:text-text-primary hover:bg-surface-tertiary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Uploading progress notification */}
      {uploading && (
        <div className="px-5 py-3 bg-brand-500/10 border-b border-brand-500/20 flex items-center justify-between animate-fade-in text-xs text-brand-300">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            <span>{uploadProgressText || "Sedang mengunggah berkas..."}</span>
          </div>
          <span className="font-mono text-brand-400 font-bold">Menyinkronkan...</span>
        </div>
      )}

      {/* 2. Main Drive Body */}
      <div className="p-4 sm:p-6 space-y-6 min-h-[350px]">
        {/* A. Folders Section */}
        {currentSubfolders.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-brand-400" />
                <span>Folder</span>
              </h4>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-400 border border-white/[0.08]">
                {currentSubfolders.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {currentSubfolders.map((folder) => {
                const folderColor = folder.color || "#3b82f6";
                const folderFileCount = files.filter(
                  (f) => f.folderId === folder.id
                ).length;

                return (
                  <div
                    key={folder.id}
                    onClick={() => setCurrentFolderId(folder.id)}
                    className="group relative flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface hover:bg-surface-secondary hover:border-brand-500/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-bold shrink-0"
                        style={{
                          backgroundColor: `${folderColor}15`,
                          border: `1px solid ${folderColor}30`,
                          color: folderColor,
                        }}
                      >
                        <Folder className="w-4 h-4 fill-current opacity-80" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-semibold text-text-primary truncate group-hover:text-brand-400 transition-colors">
                          {folder.name}
                        </h5>
                        <span className="text-[10px] text-text-tertiary font-mono">
                          {folderFileCount} berkas
                        </span>
                      </div>
                    </div>

                    {/* Folder Quick Actions */}
                    {canEdit && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <button
                          onClick={() =>
                            setRenameTarget({
                              id: folder.id,
                              name: folder.name,
                              isFolder: true,
                            })
                          }
                          className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary"
                          title="Ubah Nama Folder"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteFolder(folder.id, folder.name)
                          }
                          className="p-1.5 rounded-lg text-text-tertiary hover:text-accent-red hover:bg-surface-secondary"
                          title="Hapus Folder"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* B. Files Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-text-secondary flex items-center gap-1.5 font-display">
              <FileText className="w-3.5 h-3.5 text-brand-500" />
              <span>Berkas Materi</span>
            </h4>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-secondary text-text-tertiary border border-border">
              {currentFiles.length}
            </span>
          </div>

          {currentFiles.length === 0 && currentSubfolders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border rounded-3xl p-6 bg-surface-secondary/20">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 mb-3 shadow-inner">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h5 className="text-sm font-bold text-text-primary mb-1">
                Folder Ini Masih Kosong
              </h5>
              <p className="text-xs text-text-secondary max-w-sm mb-4 leading-relaxed">
                Tarik dan letakkan (*drag & drop*) berkas seperti PDF, Word, skrip Python, atau Jupyter Notebook `.ipynb` ke sini untuk mengunggah.
              </p>
              {canEdit && (
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-500 shadow-sm cursor-pointer transition-all">
                  <UploadCloud className="w-4 h-4" />
                  <span>Pilih Berkas untuk Diunggah</span>
                  <input
                    type="file"
                    multiple
                    disabled={uploading}
                    onChange={(e) => handleUploadFiles(e.target.files)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {currentFiles.map((file) => {
                const fileInfo = getFileCategory(file.name);

                return (
                  <div
                    key={file.id}
                    className="group relative flex flex-col justify-between p-4 rounded-2xl border border-border bg-surface hover:bg-surface-secondary/80 hover:border-brand-500/40 shadow-2xs transition-all space-y-3"
                  >
                    <div>
                      {/* Top: Icon + Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-inner"
                          style={{
                            backgroundColor: `${fileInfo.color}15`,
                            border: `1px solid ${fileInfo.color}30`,
                            color: fileInfo.color,
                          }}
                        >
                          {fileInfo.category === "jupyter" || fileInfo.category === "python" || fileInfo.category === "code" ? (
                            <FileCode className="w-5 h-5" />
                          ) : fileInfo.category === "excel" ? (
                            <FileSpreadsheet className="w-5 h-5" />
                          ) : (
                            <FileText className="w-5 h-5" />
                          )}
                        </div>

                        <span
                          className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${fileInfo.badgeBg} ${fileInfo.badgeBorder} ${fileInfo.badgeText}`}
                        >
                          {fileInfo.extension.toUpperCase()}
                        </span>
                      </div>

                      {/* File Name */}
                      <h5
                        onClick={() => setPreviewFile(file)}
                        className="text-xs font-semibold text-text-primary truncate max-w-full hover:text-brand-500 cursor-pointer transition-colors"
                        title={file.name}
                      >
                        {file.name}
                      </h5>

                      {/* Symmetric File Details */}
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-text-tertiary font-mono">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>
                          {new Date(file.uploadedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Bar (Touch-Friendly & Aligned) */}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
                      {/* Quick Open Preview Button */}
                      <button
                        onClick={() => setPreviewFile(file)}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-surface-secondary hover:bg-surface-tertiary text-text-primary border border-border active:scale-[0.97] transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-500" />
                        <span>Buka</span>
                      </button>

                      {/* Secondary Action Icons */}
                      <div className="flex items-center gap-1">
                        {file.url && (
                          <a
                            href={file.url}
                            download={file.name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary active:scale-[0.95] transition-colors"
                            title="Unduh Berkas"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}

                        {canEdit && (
                          <>
                            <button
                              onClick={() =>
                                setRenameTarget({
                                  id: file.id,
                                  name: file.name,
                                  isFolder: false,
                                })
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary active:scale-[0.95] transition-colors"
                              title="Ubah Nama"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteFile(file)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-text-tertiary hover:text-accent-red hover:bg-surface-secondary active:scale-[0.95] transition-colors"
                              title="Hapus Berkas"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-secondary text-[11px] uppercase tracking-wider text-text-secondary border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Nama Berkas</th>
                    <th className="px-4 py-3 font-semibold">Tipe</th>
                    <th className="px-4 py-3 font-semibold">Ukuran</th>
                    <th className="px-4 py-3 font-semibold">Tanggal Upload</th>
                    <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {currentFiles.map((file) => {
                    const fileInfo = getFileCategory(file.name);

                    return (
                      <tr
                        key={file.id}
                        className="hover:bg-surface-secondary/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-text-primary max-w-xs truncate">
                          <div className="flex items-center gap-2.5">
                            <FileCode className="w-4 h-4 text-brand-500 shrink-0" />
                            <span
                              onClick={() => setPreviewFile(file)}
                              className="truncate hover:text-brand-500 cursor-pointer font-semibold"
                              title={file.name}
                            >
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${fileInfo.badgeBg} ${fileInfo.badgeBorder} ${fileInfo.badgeText}`}
                          >
                            {fileInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-text-tertiary font-mono text-[11px]">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="px-4 py-3 text-text-tertiary text-[11px]">
                          {new Date(file.uploadedAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setPreviewFile(file)}
                              className="p-1.5 rounded-lg text-text-secondary hover:text-brand-500 hover:bg-surface-secondary"
                              title="Buka File"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {file.url && (
                              <a
                                href={file.url}
                                download={file.name}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                                title="Download"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {canEdit && (
                              <>
                                <button
                                  onClick={() =>
                                    setRenameTarget({
                                      id: file.id,
                                      name: file.name,
                                      isFolder: false,
                                    })
                                  }
                                  className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary"
                                  title="Ubah Nama"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteFile(file)}
                                  className="p-1.5 rounded-lg text-text-tertiary hover:text-accent-red hover:bg-surface-secondary"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Folder */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#020409] border border-white/[0.12] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-brand-400" />
                <span>Buat Folder Baru</span>
              </h4>
              <button
                onClick={() => setShowFolderModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nama Folder
                </label>
                <input
                  type="text"
                  placeholder="Misal: Tugas Praktikum, Modul Jupyter, Data..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-white/[0.1] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Warna Folder
                </label>
                <div className="flex items-center gap-2">
                  {FOLDER_COLORS.map((col) => (
                    <button
                      key={col.value}
                      type="button"
                      onClick={() => setNewFolderColor(col.value)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        newFolderColor === col.value
                          ? "ring-2 ring-white scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: col.value }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={creatingFolder}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0071e3] text-white hover:bg-[#0077ED] shadow-sm disabled:opacity-50"
                >
                  {creatingFolder ? "Membuat..." : "Buat Folder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Rename Item */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#020409] border border-white/[0.12] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Pencil className="w-4 h-4 text-brand-400" />
                <span>Ubah Nama {renameTarget.isFolder ? "Folder" : "Berkas"}</span>
              </h4>
              <button
                onClick={() => setRenameTarget(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRename} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={renameTarget.name}
                  onChange={(e) =>
                    setRenameTarget({ ...renameTarget, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-white/[0.1] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRenameTarget(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={renaming}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0071e3] text-white hover:bg-[#0077ED] shadow-sm disabled:opacity-50"
                >
                  {renaming ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Interactive File Previewer Modal */}
      <ModuleFilePreviewerModal
        file={previewFile}
        isOpen={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}
