"use client";

import { useEffect, useState, useRef } from "react";
import {
  FileBox,
  Download,
  Trash2,
  HardDrive,
  UploadCloud,
  Search,
  Eye,
  Copy,
  Check,
  FileCode,
  FileText,
  Sparkles,
  Filter,
  X,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { Card, Skeleton, EmptyState, ConfirmDialog } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { getFiles, deleteFile, uploadDirectFileAction } from "@/actions/study-actions";
import { formatDate, formatFileSize } from "@/lib/utils";
import { isBookmarked, toggleBookmark } from "@/lib/bookmark-service";
import { validateFileForUpload } from "@/lib/academic-content-filter";
import { ModuleFilePreviewerModal } from "@/components/modul/module-file-previewer-modal";
import { ModuleDriveFile, getFileCategory } from "@/types/module-drive";
import { toast } from "sonner";

export default function FilePage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; path: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<ModuleDriveFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadFiles() {
    setLoading(true);
    try {
      const list = await getFiles();
      setFiles(list);
    } catch (err) {
      console.error(err);
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteFile(deleteTarget.id, deleteTarget.path);
      toast.success("File berhasil dihapus dari cloud storage");
      setFiles(files.filter((f) => f.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleCopyUrl = (file: any) => {
    if (!file.url) return;
    navigator.clipboard.writeText(file.url);
    setCopiedId(file.id);
    toast.success("Tautan file disalin ke papan klip!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFiles = files.filter((f) => {
    const matchesSearch =
      !search ||
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.mime_type?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (typeFilter === "all") return true;
    if (typeFilter === "pdf") return f.name?.toLowerCase().endsWith(".pdf");
    if (typeFilter === "code") {
      const name = f.name?.toLowerCase() || "";
      return name.endsWith(".py") || name.endsWith(".js") || name.endsWith(".ts") || name.endsWith(".ipynb") || name.endsWith(".html") || name.endsWith(".cpp");
    }
    if (typeFilter === "image") {
      const name = f.name?.toLowerCase() || "";
      return name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") || name.endsWith(".webp");
    }
    if (typeFilter === "archive") {
      const name = f.name?.toLowerCase() || "";
      return name.endsWith(".zip") || name.endsWith(".rar") || name.endsWith(".tar.gz");
    }
    return true;
  });

  const totalStorageBytes = files.reduce((acc, f) => acc + (Number(f.size) || 0), 0);

  return (
    <div className="page-container space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <PageHeader
        eyebrow="~/storage"
        technicalMark="< cloud // assets />"
        title="Semua berkas pembelajaran"
        description="Arsip dokumen, slide, dan lampiran belajar yang tersimpan rapi."
        actions={
          <>
            <div className="flex items-center gap-2 py-1.5 px-3 bg-surface-secondary border border-border rounded-xl text-xs h-9">
              <HardDrive className="w-4 h-4 text-brand-400" />
              <span className="text-text-secondary">Kapasitas:</span>
              <strong className="text-text-primary font-mono font-bold">{formatFileSize(totalStorageBytes)}</strong>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              loading={uploading}
              className="gap-2 text-xs font-semibold h-9"
            >
              <UploadCloud className="w-4 h-4" /> Unggah Berkas
            </Button>
          </>
        }
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-surface p-3.5 rounded-xl border border-border">
        <div className="relative flex-1 w-full flex items-center">
          <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari berkas berdasarkan nama atau ekstensi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-lg bg-surface-secondary border border-border text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface transition-colors"
              title="Hapus pencarian"
              aria-label="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: "Semua" },
            { id: "pdf", label: "PDF" },
            { id: "code", label: "Code & Jupyter" },
            { id: "image", label: "Gambar" },
            { id: "archive", label: "ZIP/Arsip" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                typeFilter === t.id
                  ? "bg-brand-600 text-white font-semibold"
                  : "bg-surface-secondary text-text-secondary hover:text-text-primary border border-border"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* File List Table */}
      {loading ? (
        <Skeleton className="h-48 rounded-xl" />
      ) : filteredFiles.length === 0 ? (
        <EmptyState
          icon={<FileBox className="w-12 h-12 text-text-tertiary" />}
          title="Belum Ada Berkas"
          description={
            search
              ? "Tidak ada berkas yang cocok dengan kata kunci pencarian Anda."
              : "Unggah berkas bahan ajar atau modul perkuliahan untuk menyimpannya ke cloud storage."
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-xs">
          <table className="w-full min-w-[600px] text-left text-xs">
            <thead className="bg-surface-secondary/70 text-text-tertiary font-mono uppercase border-b border-border">
              <tr>
                <th className="px-4 py-3 font-semibold">Nama File</th>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 font-semibold">Ukuran</th>
                <th className="px-4 py-3 font-semibold">Tanggal Upload</th>
                <th className="px-4 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredFiles.map((file) => {
                const fileInfo = getFileCategory(file.name);
                const mockDriveFile: ModuleDriveFile = {
                  id: file.id,
                  name: file.name,
                  folderId: null,
                  storagePath: file.path || "",
                  url: file.url,
                  size: Number(file.size) || 0,
                  fileType: file.mime_type || "file",
                  extension: fileInfo.extension,
                  category: fileInfo.category,
                  uploadedAt: file.created_at || new Date().toISOString(),
                };

                return (
                  <tr key={file.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-medium text-white max-w-xs truncate">
                      <div className="flex items-center gap-2.5">
                        <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span
                          onClick={() => setPreviewFile(mockDriveFile)}
                          className="truncate hover:text-[#2997ff] cursor-pointer font-bold"
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
                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-[11px]">
                      {formatDate(file.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Preview */}
                        <button
                          onClick={() => setPreviewFile(mockDriveFile)}
                          className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                          title="Buka Pratinjau Dokumen"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Bookmark */}
                        <button
                          type="button"
                          onClick={() => {
                            const isNow = toggleBookmark({
                              id: file.id,
                              type: "file",
                              title: file.name,
                              subtitle: `${formatFileSize(file.size)} • ${fileInfo.label}`,
                              url: file.url,
                              savedAt: new Date().toISOString(),
                            });
                            toast.success(isNow ? "Berkas disimpan ke Bookmark." : "Berkas dihapus dari Bookmark.");
                            setFiles((prev) => [...prev]);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors cursor-pointer"
                          title="Tandai / Bookmark Berkas"
                        >
                          {isBookmarked(file.id) ? (
                            <BookmarkCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Copy Link */}
                        <button
                          onClick={() => handleCopyUrl(file)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Salin Tautan Publik"
                        >
                          {copiedId === file.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Download */}
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={file.name}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Unduh Berkas"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget({ id: file.id, path: file.storage_path })}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Hapus File Permanen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* In-App File Previewer Modal */}
      {previewFile && (
        <ModuleFilePreviewerModal
          file={previewFile}
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus File Ini?"
        message="File akan dihapus secara permanen dari Supabase Cloud Storage."
      />
    </div>
  );
}
