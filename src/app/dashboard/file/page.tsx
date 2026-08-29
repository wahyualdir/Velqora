"use client";

import React, { useEffect, useState, useRef } from "react";
import { getFiles, deleteFile, uploadDirectFileAction } from "@/actions/study-actions";
import { isBookmarked, toggleBookmark } from "@/lib/bookmark-service";
import { validateFileForUpload } from "@/lib/academic-content-filter";
import { ModuleFilePreviewerModal } from "@/components/modul/module-file-previewer-modal";
import { ModuleDriveFile, getFileCategory } from "@/types/module-drive";
import { toast } from "sonner";
import { PageContainer } from "@/components/ui/section";
import { SubNavTabs } from "@/components/layout/sub-nav-tabs";
import { FileHeader } from "@/components/files/file-header";
import { FileToolbar } from "@/components/files/file-toolbar";
import { FileListItem } from "@/components/files/file-list-item";
import { FileBox } from "lucide-react";
import { Skeleton } from "@/components/ui/card";

export default function FilePage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<ModuleDriveFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadFiles() {
    setLoading(true);
    try {
      const list = await getFiles();
      setFiles(list || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat daftar berkas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFiles();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const check = await validateFileForUpload(file);
      if (!check.isValid) {
        toast.error(`${file.name}: ${check.reason}`);
        continue;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        const inserted = await uploadDirectFileAction(formData);
        if (inserted) {
          successCount++;
        }
      } catch (err: any) {
        toast.error(`Gagal mengunggah ${file.name}: ${err.message}`);
      }
    }

    if (successCount > 0) {
      toast.success(`Berhasil mengunggah ${successCount} berkas ke cloud storage!`);
      loadFiles();
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (id: string, path: string) => {
    try {
      await deleteFile(id, path);
      toast.success("Berkas berhasil dihapus.");
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus berkas.");
    }
  };

  const handleCopyUrl = (file: any) => {
    if (!file.url) {
      toast.error("Tautan berkas tidak tersedia.");
      return;
    }
    navigator.clipboard.writeText(file.url);
    setCopiedId(file.id);
    toast.success("Tautan unduhan disalin.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleBookmarkFile = (file: any) => {
    toggleBookmark({
      id: file.id,
      title: file.name,
      type: "file",
      subtitle: file.mime_type,
      url: file.url,
      category: "Berkas",
    });
    setFiles([...files]);
    toast.success("Status simpan berkas diperbarui.");
  };

  const handlePreviewFile = (file: any) => {
    const ext = file.name?.split(".").pop() || "";
    const driveFile: ModuleDriveFile = {
      id: file.id,
      name: file.name,
      folderId: null,
      storagePath: file.file_path || file.path || "",
      url: file.url || "",
      size: file.size || 0,
      fileType: file.mime_type || "application/octet-stream",
      extension: ext,
      category: getFileCategory(file.name || "").category,
      uploadedAt: file.created_at || new Date().toISOString(),
    };
    setPreviewFile(driveFile);
  };

  // Filtering
  const filteredFiles = files.filter((f) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = f.name?.toLowerCase().includes(q);
      const matchExt = f.mime_type?.toLowerCase().includes(q);
      if (!matchName && !matchExt) return false;
    }

    if (typeFilter !== "all") {
      const name = (f.name || "").toLowerCase();
      const mime = (f.mime_type || "").toLowerCase();

      if (typeFilter === "document") {
        return (
          mime.includes("pdf") ||
          mime.includes("word") ||
          name.endsWith(".pdf") ||
          name.endsWith(".doc") ||
          name.endsWith(".docx") ||
          name.endsWith(".txt")
        );
      }
      if (typeFilter === "image") {
        return (
          mime.includes("image") ||
          name.endsWith(".jpg") ||
          name.endsWith(".jpeg") ||
          name.endsWith(".png") ||
          name.endsWith(".webp")
        );
      }
      if (typeFilter === "code") {
        return (
          name.endsWith(".py") ||
          name.endsWith(".js") ||
          name.endsWith(".ts") ||
          name.endsWith(".tsx") ||
          name.endsWith(".json") ||
          name.endsWith(".sql") ||
          name.endsWith(".csv") ||
          name.endsWith(".html") ||
          name.endsWith(".css")
        );
      }
      if (typeFilter === "archive") {
        return (
          mime.includes("zip") ||
          name.endsWith(".zip") ||
          name.endsWith(".rar") ||
          name.endsWith(".7z") ||
          name.endsWith(".tar")
        );
      }
    }

    return true;
  });

  const hasActiveFilter = search.trim() !== "" || typeFilter !== "all";

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <SubNavTabs category="documents" />

        {/* Workspace Header */}
        <FileHeader
          onUploadClick={() => fileInputRef.current?.click()}
          uploading={uploading}
          fileCount={files.length}
        />

        {/* Hidden File Upload Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Search & Filter Toolbar */}
        <FileToolbar
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          onResetFilter={() => {
            setSearch("");
            setTypeFilter("all");
          }}
          hasActiveFilter={hasActiveFilter}
        />

        {/* File Collection List */}
        <div className="space-y-2">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-border bg-surface flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 flex-1">
                    <Skeleton className="w-9 h-9 rounded-lg" />
                    <div className="space-y-2 flex-1 max-w-sm">
                      <Skeleton className="h-4 w-3/4 rounded" />
                      <Skeleton className="h-3 w-1/2 rounded" />
                    </div>
                  </div>
                  <Skeleton className="w-24 h-8 rounded-lg" />
                </div>
              ))}
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="p-8 sm:p-12 text-center rounded-xl border border-dashed border-border bg-surface space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
                <FileBox className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-sm sm:text-base font-semibold text-text-primary">
                  {hasActiveFilter ? "Berkas tidak ditemukan" : "Belum ada berkas"}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {hasActiveFilter
                    ? "Tidak ada berkas yang sesuai dengan kata kunci pencarian atau filter yang dipilih."
                    : "Unggah berkas dokumen, kode program, atau gambar perkuliahan Anda untuk mulai mengelola berkas studi."}
                </p>
              </div>
              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setTypeFilter("all");
                  }}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                >
                  Reset filter pencarian
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <FileListItem
                  key={file.id}
                  file={file}
                  onPreview={handlePreviewFile}
                  onCopyUrl={handleCopyUrl}
                  isCopied={copiedId === file.id}
                  onDelete={handleDelete}
                  isBookmarked={isBookmarked(file.id)}
                  onToggleBookmark={handleToggleBookmarkFile}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Module File Previewer Modal */}
      <ModuleFilePreviewerModal
        file={previewFile}
        isOpen={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
      />
    </PageContainer>
  );
}
