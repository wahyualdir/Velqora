"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  FileCode,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  previewBulkImportNotes,
  bulkImportNotesFromMarkdown,
  type BulkImportInputFile,
  type BulkImportPreviewResult,
  type BulkImportResult,
} from "@/actions/study/notes-bulk-import";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = "input" | "preview" | "importing" | "result";

export function BulkImportModal({ isOpen, onClose, onSuccess }: BulkImportModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [step, setStep] = useState<Step>("input");
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
  const [selectedFiles, setSelectedFiles] = useState<BulkImportInputFile[]>([]);
  const [pasteText, setPasteText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewResult, setPreviewResult] = useState<BulkImportPreviewResult | null>(null);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null);

  // Reset modal state
  const resetForm = () => {
    setStep("input");
    setSelectedFiles([]);
    setPasteText("");
    setPreviewResult(null);
    setImportResult(null);
    setPreviewLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 1. Read files from FileList
  const processFileList = async (files: FileList | File[]) => {
    const mdFiles: BulkImportInputFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name.endsWith(".md") || file.type === "text/markdown" || file.type === "text/plain") {
        try {
          const content = await file.text();
          mdFiles.push({
            filename: file.name,
            content,
          });
        } catch {
          toast.error(`Gagal membaca berkas: ${file.name}`);
        }
      }
    }

    if (mdFiles.length === 0) {
      toast.error("Tidak ditemukan berkas .md yang valid.");
      return;
    }

    // Merge or set
    setSelectedFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.filename));
      const newItems = mdFiles.filter((f) => !existingNames.has(f.filename));
      return [...prev, ...newItems];
    });

    toast.success(`${mdFiles.length} berkas .md siap dipratinjau.`);
  };

  // 2. Parse Paste Text (delimiter: ---FILE: filename.md--- or ===FILE: filename.md===)
  const parsePasteInput = (): BulkImportInputFile[] => {
    if (!pasteText.trim()) return [];

    const fileDelimiterRegex = /(?:^|\n)(?:---|===)\s*FILE:\s*([^\n\r]+?)\s*(?:---|===)\r?\n/g;
    const matches = [...pasteText.matchAll(fileDelimiterRegex)];

    if (matches.length === 0) {
      // Single file fallback
      return [
        {
          filename: "catatan-import.md",
          content: pasteText.trim(),
        },
      ];
    }

    const result: BulkImportInputFile[] = [];
    for (let i = 0; i < matches.length; i++) {
      const currentMatch = matches[i];
      const filename = currentMatch[1].trim() || `catatan-${i + 1}.md`;
      const startIndex = currentMatch.index + currentMatch[0].length;
      const endIndex = i + 1 < matches.length ? matches[i + 1].index : pasteText.length;
      const content = pasteText.slice(startIndex, endIndex).trim();

      if (content) {
        result.push({
          filename: filename.endsWith(".md") ? filename : `${filename}.md`,
          content,
        });
      }
    }

    return result;
  };

  // 3. Step 1 -> Step 2: Handle Preview
  const handleProceedToPreview = async () => {
    let filesToPreview: BulkImportInputFile[] = [];

    if (inputMode === "upload") {
      filesToPreview = selectedFiles;
    } else {
      filesToPreview = parsePasteInput();
    }

    if (filesToPreview.length === 0) {
      toast.error("Mohon pilih atau tempel berkas markdown terlebih dahulu.");
      return;
    }

    try {
      setPreviewLoading(true);
      const preview = await previewBulkImportNotes(filesToPreview);
      setPreviewResult(preview);
      setSelectedFiles(filesToPreview);
      setStep("preview");
    } catch (err: any) {
      toast.error(err.message || "Gagal memproses pratinjau catatan.");
    } finally {
      setPreviewLoading(false);
    }
  };

  // 4. Step 2 -> Step 3 & 4: Execute Bulk Import
  const handleConfirmImport = async () => {
    if (!previewResult || selectedFiles.length === 0) return;

    // Filter file yang tidak akan di-skip
    const validFilenames = new Set(
      previewResult.items.filter((i) => !i.willSkip).map((i) => i.filename)
    );

    const filesToImport = selectedFiles.filter((f) => validFilenames.has(f.filename));

    if (filesToImport.length === 0) {
      toast.error("Tidak ada catatan yang memenuhi syarat untuk diimpor.");
      return;
    }

    try {
      setStep("importing");
      const result = await bulkImportNotesFromMarkdown(filesToImport);
      setImportResult(result);
      setStep("result");

      if (result.imported.length > 0) {
        toast.success(
          `Berhasil mengimpor ${result.imported.length} catatan ke dalam Vault!`
        );
        router.refresh();
        if (onSuccess) onSuccess();
      } else {
        toast.warning("Tidak ada catatan yang berhasil diimpor.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat mengimpor catatan.");
      setStep("preview");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      title={
        <div className="flex items-center gap-2 font-mono text-sm uppercase">
          <Upload className="w-4 h-4 text-brand-600" />
          <span>Import Massal Catatan Kurikulum (Admin/Owner)</span>
        </div>
      }
      description="Impor banyak modul atau berkas markdown sekaligus ke dalam Knowledge Vault tanpa ketik ulang."
    >
      <div className="space-y-6 pt-2 font-mono text-xs">
        {/* ================= STEP 1: INPUT FILES ================= */}
        {step === "input" && (
          <div className="space-y-5">
            {/* Input Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-surface-secondary/70 border border-border rounded-lg max-w-xs">
              <button
                type="button"
                onClick={() => setInputMode("upload")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-mono text-xs transition-colors cursor-pointer ${
                  inputMode === "upload"
                    ? "bg-surface text-brand-600 dark:text-brand-400 font-bold shadow-2xs border border-border/80"
                    : "text-text-tertiary hover:text-text-primary"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload .md</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode("paste")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-mono text-xs transition-colors cursor-pointer ${
                  inputMode === "paste"
                    ? "bg-surface text-brand-600 dark:text-brand-400 font-bold shadow-2xs border border-border/80"
                    : "text-text-tertiary hover:text-text-primary"
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Tempel Teks</span>
              </button>
            </div>

            {/* Mode A: Drag & Drop Multi-file */}
            {inputMode === "upload" ? (
              <div className="space-y-3">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files) {
                      processFileList(e.dataTransfer.files);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-8 border-2 border-dashed rounded-xl text-center flex flex-col items-center justify-center gap-2.5 transition-colors cursor-pointer ${
                    isDragging
                      ? "border-brand-500 bg-brand-50/20 dark:bg-brand-950/20"
                      : "border-border hover:border-brand-500/60 hover:bg-surface-secondary/40"
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary text-xs sm:text-sm">
                      Tarik & lepaskan berkas <span className="text-brand-600">.md</span> di sini, atau klik untuk memilih
                    </p>
                    <p className="text-[11px] text-text-tertiary mt-1">
                      Mendukung multi-select (banyak berkas markdown sekaligus)
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".md,text/markdown,text/plain"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        processFileList(e.target.files);
                      }
                    }}
                  />
                </div>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-text-tertiary">
                      <span>Berkas Dipilih ({selectedFiles.length})</span>
                      <button
                        type="button"
                        onClick={() => setSelectedFiles([])}
                        className="text-amber-600 hover:underline cursor-pointer"
                      >
                        Hapus Semua
                      </button>
                    </div>
                    <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 divide-y divide-border/40 border border-border rounded-lg p-2 bg-surface">
                      {selectedFiles.map((f, idx) => (
                        <div
                          key={idx}
                          className="pt-1.5 first:pt-0 flex items-center justify-between gap-2 text-[11px]"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                            <span className="text-text-primary font-medium truncate">
                              {f.filename}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedFiles((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="text-text-tertiary hover:text-red-500 shrink-0 px-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Mode B: Paste Multiple Markdown */
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-text-tertiary">
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-brand-500" />
                    Pisahkan tiap berkas dengan <code className="text-brand-600 font-bold">---FILE: nama_catatan.md---</code>
                  </span>
                </div>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={`---FILE: agen-cerdas.md---
---
kategori: "Artificial Intelligence Fundamentals"
title: "Rational Agents & Lingkungan PEAS"
tags: [ai-fundamentals, agent]
---

# Rational Agents & Lingkungan PEAS
Isi catatan materi lengkap di sini...

---FILE: confusion-matrix.md---
---
kategori: "Artificial Intelligence Fundamentals"
title: "Evaluasi Model & Metrik Performa AI"
tags: [evaluasi, metric]
---

# Evaluasi Model
Penjelasan Confusion Matrix dan F1-Score...`}
                  rows={10}
                  className="w-full p-3 font-mono text-xs bg-surface border border-border rounded-lg text-text-primary focus:outline-hidden focus:border-brand-500 leading-relaxed resize-y"
                />
              </div>
            )}

            {/* Frontmatter Format Guidance Card */}
            <div className="p-3.5 rounded-lg border border-border bg-surface-secondary/30 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-text-primary text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Format Wajib Frontmatter YAML</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Tiap berkas wajib memiliki blok metadata di bagian atas berkas:
              </p>
              <pre className="p-2 rounded bg-surface border border-border/80 text-[10px] text-text-secondary overflow-x-auto">
{`---
kategori: "Artificial Intelligence Fundamentals"   # Wajib: nama subkategori di database
title: "Rational Agents & Lingkungan PEAS"          # Opsional: jika kosong diambil dari heading #
tags: [ai-fundamentals, agent, peas]               # Opsional: tag otomatis disinkronkan
---`}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                type="button"
                onClick={handleClose}
                className="text-xs font-mono cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleProceedToPreview}
                disabled={
                  previewLoading ||
                  (inputMode === "upload" && selectedFiles.length === 0) ||
                  (inputMode === "paste" && !pasteText.trim())
                }
                className="gap-1.5 text-xs font-mono font-bold bg-brand-600 hover:bg-brand-700 text-white cursor-pointer"
              >
                {previewLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <span>Pratinjau & Validasi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: PREVIEW & CONFIRMATION ================= */}
        {step === "preview" && previewResult && (
          <div className="space-y-4">
            {/* Stats Summary Bar */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 bg-surface border border-border rounded-lg">
                <div className="text-[10px] text-text-tertiary">Total Berkas</div>
                <div className="text-lg font-bold text-text-primary mt-0.5">
                  {previewResult.totalFiles}
                </div>
              </div>
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/30 rounded-lg">
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  Siap Diimpor
                </div>
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {previewResult.validCount}
                </div>
              </div>
              <div className="p-3 bg-amber-500/5 border border-amber-500/30 rounded-lg">
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                  Dilewati (Skip)
                </div>
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  {previewResult.skipCount}
                </div>
              </div>
            </div>

            {/* File Verification Table */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-text-primary">
                Daftar Analisis Kelayakan Import:
              </div>
              <div className="max-h-60 overflow-y-auto border border-border rounded-lg divide-y divide-border bg-surface">
                {previewResult.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors ${
                      item.willSkip
                        ? "bg-amber-500/5 dark:bg-amber-950/10"
                        : "hover:bg-surface-secondary/40"
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {item.willSkip ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                        <span className="font-bold text-text-primary truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-text-tertiary font-mono">
                          ({item.filename})
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-secondary pl-5.5">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-text-tertiary" />
                          Kategori:{" "}
                          <strong className="text-text-primary">
                            {item.resolvedCategoryName || item.categoryInput || "(Kosong)"}
                          </strong>
                        </span>

                        {item.tags.length > 0 && (
                          <span className="text-text-tertiary">
                            • Tag: {item.tags.map((t) => `#${t}`).join(" ")}
                          </span>
                        )}
                      </div>

                      {item.willSkip && item.skipReason && (
                        <div className="text-[10px] text-amber-700 dark:text-amber-400 pl-5.5 font-medium">
                          Alasan dilewati: {item.skipReason}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 pl-5.5 sm:pl-0">
                      {item.willSkip ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 uppercase">
                          Dilewati
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                          Siap Diimpor
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {previewResult.validCount === 0 && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-700 dark:text-amber-400 text-[11px]">
                Semua berkas akan dilewati karena kategori tidak cocok atau catatan sudah ada di database. Silakan sesuaikan kembali berkas Anda.
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                type="button"
                onClick={() => setStep("input")}
                className="gap-1.5 text-xs font-mono cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali & Ubah</span>
              </Button>

              <Button
                type="button"
                onClick={handleConfirmImport}
                disabled={previewResult.validCount === 0}
                className="gap-1.5 text-xs font-mono font-bold bg-brand-600 hover:bg-brand-700 text-white cursor-pointer"
              >
                <span>Konfirmasi Import ({previewResult.validCount} Catatan)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: IMPORTING PROGRESS ================= */}
        {step === "importing" && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-brand-600 animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-text-primary">
                Mengimpor Catatan ke Knowledge Vault...
              </h4>
              <p className="text-[11px] text-text-secondary max-w-sm mx-auto">
                Memproses penulisan ke database, sinkronisasi tautan dua arah [[Wiki-Link]], dan pendaftaran tag kurikulum.
              </p>
            </div>
          </div>
        )}

        {/* ================= STEP 4: RESULT SUMMARY ================= */}
        {step === "result" && importResult && (
          <div className="space-y-5">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-xs">
                  Proses Import Selesai
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  {importResult.imported.length} catatan baru berhasil diimpor ke dalam database.
                  {importResult.skipped.length > 0 &&
                    ` (${importResult.skipped.length} catatan dilewati).`}
                </p>
              </div>
            </div>

            {/* Imported List */}
            {importResult.imported.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-text-primary">
                  Catatan yang Berhasil Dibuat ({importResult.imported.length}):
                </div>
                <div className="max-h-36 overflow-y-auto border border-border rounded-lg divide-y divide-border bg-surface p-2 space-y-1">
                  {importResult.imported.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-center justify-between gap-2 text-[11px] py-1"
                    >
                      <span className="font-medium text-text-primary truncate">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-brand-600 dark:text-brand-400 font-mono">
                        /catatan/{n.slug}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skipped List */}
            {importResult.skipped.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-amber-600">
                  Catatan yang Dilewati ({importResult.skipped.length}):
                </div>
                <div className="max-h-32 overflow-y-auto border border-border rounded-lg divide-y divide-border bg-surface p-2 space-y-1">
                  {importResult.skipped.map((s, idx) => (
                    <div key={idx} className="text-[11px] py-1 text-text-secondary">
                      <strong className="text-text-primary">{s.filename}</strong>: {s.reason}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                type="button"
                onClick={resetForm}
                className="gap-1.5 text-xs font-mono cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Import File Lain</span>
              </Button>
              <Button
                type="button"
                onClick={handleClose}
                className="text-xs font-mono font-bold bg-brand-600 hover:bg-brand-700 text-white cursor-pointer"
              >
                Selesai & Buka Vault
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
