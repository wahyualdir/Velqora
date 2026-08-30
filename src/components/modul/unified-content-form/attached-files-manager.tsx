"use client";

import React, { useRef } from "react";
import { Upload, FolderOpen, File as FileIcon, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";
import { ModuleDriveFile } from "@/types/module-drive";

interface AttachedFilesManagerProps {
  kind: "module" | "project";
  existingFiles: ModuleDriveFile[];
  newUploadedFiles: { file: File; relativePath?: string }[];
  onFilesSelect: (e: React.ChangeEvent<HTMLInputElement>, isFolder?: boolean) => void;
  onRemoveNewFile: (index: number) => void;
  onRemoveExistingFile: (fileId: string) => void;
  disabled?: boolean;
}

export function AttachedFilesManager({
  kind,
  existingFiles,
  newUploadedFiles,
  onFilesSelect,
  onRemoveNewFile,
  onRemoveExistingFile,
  disabled = false,
}: AttachedFilesManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const isProject = kind === "project";

  const totalFiles = existingFiles.length + newUploadedFiles.length;

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
            <Upload className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-text-primary">
                {isProject ? "Berkas Proyek & Repositori Drive" : "Lampiran Berkas Modul"}
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-secondary border border-border text-text-secondary">
                {totalFiles} file
              </span>
            </div>
            <p className="text-[11px] text-text-secondary">
              {isProject
                ? "Unggah berkas kode (.py, .ipynb, .sql), dataset (.csv, .json), atau seluruh folder proyek."
                : "Unggah dokumen pendukung (.pdf, .docx, .xlsx, .pptx, .zip) untuk modul ini."}
            </p>
          </div>
        </div>

        {/* Upload Action Triggers */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => onFilesSelect(e, false)}
            disabled={disabled}
          />
          <input
            ref={folderInputRef}
            type="file"
            // @ts-ignore
            webkitdirectory="true"
            directory="true"
            className="hidden"
            onChange={(e) => onFilesSelect(e, true)}
            disabled={disabled}
          />

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <FileIcon className="w-3.5 h-3.5" />
            <span>Pilih Berkas</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => folderInputRef.current?.click()}
            disabled={disabled}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Pilih Folder</span>
          </Button>
        </div>
      </div>

      {/* Files List Container */}
      {totalFiles === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-8 rounded-xl border border-dashed border-border/80 hover:border-brand-500/50 bg-surface-secondary/20 hover:bg-brand-500/5 text-center cursor-pointer transition-all space-y-2 select-none"
        >
          <div className="w-10 h-10 mx-auto rounded-xl bg-surface border border-border flex items-center justify-center text-text-tertiary">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-primary">
              Klik untuk memilih berkas atau folder
            </p>
            <p className="text-[11px] text-text-tertiary">
              Maksimum 50MB per berkas. Mendukung semua format akademik dan coding standar.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1 sidebar-nav-scroll">
          {/* Existing Files */}
          {existingFiles.map((file) => (
            <div
              key={file.id}
              className="p-2.5 rounded-xl border border-border/80 bg-surface-secondary/40 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-surface border border-border flex items-center justify-center text-text-tertiary shrink-0">
                  <FileIcon className="w-3 h-3" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="font-medium text-text-primary truncate">{file.name}</p>
                  <p className="text-[10px] text-text-tertiary">
                    {formatFileSize(file.size)} • {file.fileType || "Berkas Tersimpan"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRemoveExistingFile(file.id)}
                disabled={disabled}
                className="p-1.5 rounded-lg text-text-tertiary hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                title="Hapus berkas"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* New Uploaded Files */}
          {newUploadedFiles.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="font-medium text-text-primary truncate">{item.file.name}</p>
                  <p className="text-[10px] text-text-tertiary">
                    {formatFileSize(item.file.size)} • Siap diunggah
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRemoveNewFile(idx)}
                disabled={disabled}
                className="p-1.5 rounded-lg text-text-tertiary hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                title="Batalkan unggahan"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
