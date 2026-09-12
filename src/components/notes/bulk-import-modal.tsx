"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Tag,
  Check,
  Edit3,
  Trash2,
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
import { convertUploadedFileToMarkdown } from "@/actions/study/notes-file-convert";
import { getCategories } from "@/actions/study/categories";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = "input" | "metadata" | "preview" | "importing" | "result";
type SupportedExtension = "md" | "ipynb" | "docx" | "pptx" | "pdf";

interface QueueFileItem {
  id: string;
  filename: string;
  ext: SupportedExtension;
  size: number;
  status: "converting" | "need_metadata" | "ready" | "warning";
  suggestedTitle: string;
  category: string;
  tags: string;
  markdownBody: string;
  warning?: string;
  content: string; // Ready markdown with frontmatter
}

/**
 * Helper to convert browser File to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      const base64 = res.includes(",") ? res.split(",")[1] : res;
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Helper to build final markdown with YAML frontmatter
 */
function assembleFrontmatterMarkdown(input: {
  category: string;
  title: string;
  tags: string;
  body: string;
}): string {
  const safeCategory = input.category.trim();
  const safeTitle = input.title.trim();
  const tagList = input.tags
    .split(",")
    .map((t) => t.trim().replace(/^#/, ""))
    .filter(Boolean);

  const tagsYaml = tagList.length > 0
    ? tagList.map((t) => `"${t.replace(/"/g, '\\"')}"`).join(", ")
    : "";

  return `---
kategori: "${safeCategory.replace(/"/g, '\\"')}"
title: "${safeTitle.replace(/"/g, '\\"')}"
tags: [${tagsYaml}]
---

${input.body.trim()}`;
}

export function BulkImportModal({ isOpen, onClose, onSuccess }: BulkImportModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [step, setStep] = useState<Step>("input");
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
  const [queueFiles, setQueueFiles] = useState<QueueFileItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [pasteText, setPasteText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewResult, setPreviewResult] = useState<BulkImportPreviewResult | null>(null);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null);

  // Database categories state
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  // Fetch real categories from database
  useEffect(() => {
    if (isOpen) {
      getCategories()
        .then((cats) => {
          if (Array.isArray(cats)) {
            // Sort categories alphabetically
            const sorted = [...cats].sort((a, b) =>
              (a.name || "").localeCompare(b.name || "")
            );
            setCategories(sorted);
          }
        })
        .catch((err) => {
          console.warn("Could not fetch categories:", err);
        });
    }
  }, [isOpen]);

  // Reset modal state
  const resetForm = () => {
    setStep("input");
    setQueueFiles([]);
    setActiveFileId(null);
    setPasteText("");
    setPreviewResult(null);
    setImportResult(null);
    setPreviewLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Active file for metadata editing
  const activeFile = queueFiles.find((f) => f.id === activeFileId) || queueFiles[0] || null;

  const updateActiveFile = (updates: Partial<QueueFileItem>) => {
    if (!activeFile) return;
    setQueueFiles((prev) =>
      prev.map((f) => (f.id === activeFile.id ? { ...f, ...updates } : f))
    );
  };

  // 1. Process files from file picker or drag & drop
  const processFileList = async (files: FileList | File[]) => {
    const validExtensions = ["md", "ipynb", "docx", "pptx", "pdf"];
    const addedItems: QueueFileItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = (file.name.toLowerCase().split(".").pop() || "") as SupportedExtension;

      if (!validExtensions.includes(ext)) {
        toast.warning(
          `Format berkas '.${ext}' (${file.name}) dilewati. Hanya menerima .md, .ipynb, .docx, .pptx, dan .pdf.`
        );
        continue;
      }

      const itemId = `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      if (ext === "md") {
        try {
          const content = await file.text();
          const hasFrontmatter = /^---\r?\n[\s\S]*?\r?\n---/.test(content.trim());

          if (hasFrontmatter) {
            addedItems.push({
              id: itemId,
              filename: file.name,
              ext: "md",
              size: file.size,
              status: "ready",
              suggestedTitle: file.name.replace(/\.md$/i, ""),
              category: "",
              tags: "",
              markdownBody: content,
              content,
            });
          } else {
            // .md without frontmatter -> needs category assignment
            const headingMatch = content.match(/^#\s+(.+)$/m);
            const title = headingMatch ? headingMatch[1].trim() : file.name.replace(/\.md$/i, "");
            addedItems.push({
              id: itemId,
              filename: file.name,
              ext: "md",
              size: file.size,
              status: "need_metadata",
              suggestedTitle: title,
              category: "",
              tags: "",
              markdownBody: content,
              content: "",
            });
          }
        } catch {
          toast.error(`Gagal membaca berkas: ${file.name}`);
        }
      } else {
        // Non-md file: convert deterministically via server action
        addedItems.push({
          id: itemId,
          filename: file.name,
          ext,
          size: file.size,
          status: "converting",
          suggestedTitle: file.name.replace(/\.[^/.]+$/, ""),
          category: "",
          tags: "",
          markdownBody: "",
          content: "",
        });

        // Trigger conversion in background
        (async () => {
          try {
            const base64 = await fileToBase64(file);
            const res = await convertUploadedFileToMarkdown({
              filename: file.name,
              base64,
            });

            setQueueFiles((prev) =>
              prev.map((f) => {
                if (f.id !== itemId) return f;
                return {
                  ...f,
                  status: res.warning ? "warning" : "need_metadata",
                  suggestedTitle: res.suggestedTitle,
                  markdownBody: res.markdownBody,
                  warning: res.warning,
                };
              })
            );
          } catch (err: any) {
            setQueueFiles((prev) =>
              prev.map((f) => {
                if (f.id !== itemId) return f;
                return {
                  ...f,
                  status: "warning",
                  warning: err.message || "Gagal mengonversi berkas.",
                };
              })
            );
          }
        })();
      }
    }

    if (addedItems.length === 0) return;

    setQueueFiles((prev) => [...prev, ...addedItems]);
    if (!activeFileId && addedItems.length > 0) {
      setActiveFileId(addedItems[0].id);
    }

    toast.success(`${addedItems.length} berkas ditambahkan.`);
  };

  // 2. Parse Paste Text (delimiter: ---FILE: filename.md--- or ===FILE: filename.md===)
  const parsePasteInput = (): BulkImportInputFile[] => {
    if (!pasteText.trim()) return [];

    const fileDelimiterRegex = /(?:^|\n)(?:---|===)\s*FILE:\s*([^\n\r]+?)\s*(?:---|===)\r?\n/g;
    const matches = [...pasteText.matchAll(fileDelimiterRegex)];

    if (matches.length === 0) {
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

  // 3. Mark active file as ready after editing metadata
  const handleSaveActiveFileMetadata = () => {
    if (!activeFile) return;

    if (!activeFile.category.trim()) {
      toast.error("Mohon pilih kategori kurikulum untuk berkas ini.");
      return;
    }

    if (!activeFile.markdownBody.trim()) {
      toast.error("Isi catatan markdown tidak boleh kosong.");
      return;
    }

    if (activeFile.warning && activeFile.markdownBody.trim().length < 40) {
      toast.error(
        "Isi catatan masih minim. Mohon lengkapi teks catatan secara manual sebelum menggunakan berkas ini."
      );
      return;
    }

    const finalMarkdown = assembleFrontmatterMarkdown({
      category: activeFile.category,
      title: activeFile.suggestedTitle || activeFile.filename.replace(/\.[^/.]+$/, ""),
      tags: activeFile.tags,
      body: activeFile.markdownBody,
    });

    setQueueFiles((prev) =>
      prev.map((f) => {
        if (f.id !== activeFile.id) return f;
        return {
          ...f,
          status: "ready",
          content: finalMarkdown,
        };
      })
    );

    toast.success(`Metadata untuk "${activeFile.filename}" disimpan & siap diimpor.`);

    // Auto switch to next item needing metadata
    const nextUnready = queueFiles.find(
      (f) => f.id !== activeFile.id && (f.status === "need_metadata" || f.status === "warning")
    );
    if (nextUnready) {
      setActiveFileId(nextUnready.id);
    }
  };

  // 4. Step 1 / Step 2 -> Step 3: Handle Preview
  const handleProceedToPreview = async () => {
    let filesToPreview: BulkImportInputFile[] = [];

    if (inputMode === "upload") {
      const readyFiles = queueFiles.filter((f) => f.status === "ready" && f.content);
      if (readyFiles.length === 0) {
        toast.error("Belum ada berkas yang siap diimpor. Mohon lengkapi metadata berkas.");
        return;
      }
      filesToPreview = readyFiles.map((f) => ({
        filename: f.filename.endsWith(".md") ? f.filename : `${f.filename.replace(/\.[^/.]+$/, "")}.md`,
        content: f.content,
      }));
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
      setStep("preview");
    } catch (err: any) {
      toast.error(err.message || "Gagal memproses pratinjau catatan.");
    } finally {
      setPreviewLoading(false);
    }
  };

  // 5. Step 3 -> Step 4 & 5: Execute Bulk Import
  const handleConfirmImport = async () => {
    if (!previewResult) return;

    // Filter valid files from preview result
    const validFilenames = new Set(
      previewResult.items.filter((i) => !i.willSkip).map((i) => i.filename)
    );

    let filesToImport: BulkImportInputFile[] = [];

    if (inputMode === "upload") {
      filesToImport = queueFiles
        .filter((f) => f.status === "ready" && f.content)
        .map((f) => ({
          filename: f.filename.endsWith(".md") ? f.filename : `${f.filename.replace(/\.[^/.]+$/, "")}.md`,
          content: f.content,
        }))
        .filter((f) => validFilenames.has(f.filename));
    } else {
      filesToImport = parsePasteInput().filter((f) => validFilenames.has(f.filename));
    }

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

  // Counts
  const readyCount = queueFiles.filter((f) => f.status === "ready").length;
  const convertingCount = queueFiles.filter((f) => f.status === "converting").length;
  const unconfiguredCount = queueFiles.filter(
    (f) => f.status === "need_metadata" || f.status === "warning"
  ).length;

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      title={
        <div className="flex items-center gap-2 font-mono text-sm uppercase">
          <Upload className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Import Massal Catatan Kurikulum (Admin/Owner)</span>
        </div>
      }
      description="Impor berkas Markdown, Jupyter (.ipynb), Word (.docx), PPT (.pptx), atau PDF (.pdf) secara deterministik ke dalam Knowledge Vault."
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
                <span>Upload Dokumen</span>
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
                  className={`p-7 border-2 border-dashed rounded-xl text-center flex flex-col items-center justify-center gap-2.5 transition-colors cursor-pointer ${
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
                      Tarik & lepaskan berkas di sini, atau klik untuk memilih
                    </p>
                    <p className="text-[11px] text-text-tertiary mt-1">
                      Menerima format <span className="text-brand-600 font-semibold">.md</span>,{" "}
                      <span className="text-brand-600 font-semibold">.ipynb</span>,{" "}
                      <span className="text-brand-600 font-semibold">.docx</span>,{" "}
                      <span className="text-brand-600 font-semibold">.pptx</span>, dan{" "}
                      <span className="text-brand-600 font-semibold">.pdf</span>
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".md,.ipynb,.docx,.pptx,.pdf,text/markdown,text/plain,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        processFileList(e.target.files);
                      }
                    }}
                  />
                </div>

                {/* Queue Files Progress & Status List */}
                {queueFiles.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-text-tertiary">
                      <div className="flex items-center gap-2">
                        <span>Berkas Terpilih ({queueFiles.length}):</span>
                        <span className="text-emerald-600 font-bold">{readyCount} siap</span>
                        {unconfiguredCount > 0 && (
                          <span className="text-amber-600 font-bold">
                            • {unconfiguredCount} perlu konfigurasi
                          </span>
                        )}
                        {convertingCount > 0 && (
                          <span className="text-blue-600 font-bold flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            {convertingCount} mengonversi
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setQueueFiles([]);
                          setActiveFileId(null);
                        }}
                        className="text-rose-600 hover:underline cursor-pointer"
                      >
                        Hapus Semua
                      </button>
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1.5 divide-y divide-border/40 border border-border rounded-lg p-2 bg-surface">
                      {queueFiles.map((f) => (
                        <div
                          key={f.id}
                          className="pt-1.5 first:pt-0 flex items-center justify-between gap-2 text-[11px]"
                        >
                          <div className="flex items-center gap-2 truncate min-w-0">
                            <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold bg-surface-secondary border border-border text-text-secondary shrink-0">
                              {f.ext}
                            </span>
                            <span className="text-text-primary font-medium truncate">
                              {f.filename}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {f.status === "converting" && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-blue-600">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Mengonversi...</span>
                              </span>
                            )}
                            {f.status === "need_metadata" && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                                <Edit3 className="w-3 h-3" />
                                <span>Perlu Metadata</span>
                              </span>
                            )}
                            {f.status === "warning" && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 font-bold">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Peringatan</span>
                              </span>
                            )}
                            {f.status === "ready" && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">
                                <Check className="w-3 h-3" />
                                <span>Siap Diimpor</span>
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setQueueFiles((prev) => prev.filter((item) => item.id !== f.id));
                                if (activeFileId === f.id) {
                                  setActiveFileId(null);
                                }
                              }}
                              className="text-text-tertiary hover:text-rose-600 px-1 cursor-pointer"
                              title="Hapus berkas ini"
                            >
                              ✕
                            </button>
                          </div>
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
Isi catatan materi lengkap di sini...`}
                  rows={10}
                  className="w-full p-3 font-mono text-xs bg-surface border border-border rounded-lg text-text-primary focus:outline-hidden focus:border-brand-500 leading-relaxed resize-y"
                />
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
              <Button
                variant="outline"
                type="button"
                onClick={handleClose}
                className="text-xs font-mono cursor-pointer"
              >
                Batal
              </Button>

              <div className="flex items-center gap-2">
                {/* If unconfigured files exist, allow jumping to Metadata review */}
                {inputMode === "upload" && unconfiguredCount > 0 && (
                  <Button
                    type="button"
                    onClick={() => {
                      const firstUnready = queueFiles.find(
                        (f) => f.status === "need_metadata" || f.status === "warning"
                      );
                      if (firstUnready) setActiveFileId(firstUnready.id);
                      setStep("metadata");
                    }}
                    className="gap-1.5 text-xs font-mono font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Lengkapi Metadata ({unconfiguredCount} Berkas)</span>
                  </Button>
                )}

                {/* Direct Preview button if ready */}
                <Button
                  type="button"
                  onClick={handleProceedToPreview}
                  disabled={
                    previewLoading ||
                    convertingCount > 0 ||
                    (inputMode === "upload" && readyCount === 0) ||
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
                      <span>
                        Pratinjau & Validasi {inputMode === "upload" ? `(${readyCount} Berkas)` : ""}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: METADATA & EDITABLE PREVIEW ================= */}
        {step === "metadata" && (
          <div className="space-y-4">
            {/* Header / Subtitle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-3">
              <div>
                <h3 className="font-bold text-text-primary text-xs uppercase tracking-wider">
                  Review Metadata & Pratinjau Catatan
                </h3>
                <p className="text-[11px] text-text-secondary">
                  Konversi deterministik 100% tanpa AI. Tentukan kategori dan rapikan isi sebelum diimpor.
                </p>
              </div>
              <div className="text-[11px] font-mono text-text-tertiary">
                <span className="text-emerald-600 font-bold">{readyCount}</span> dari {queueFiles.length} berkas siap
              </div>
            </div>

            {/* Layout: Left file switcher & Right editable preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Left Column: File Tabs */}
              <div className="space-y-1.5 border border-border rounded-lg p-2 bg-surface max-h-96 overflow-y-auto">
                <span className="text-[10.5px] uppercase font-bold text-text-tertiary px-1 block mb-1">
                  Daftar Berkas ({queueFiles.length})
                </span>
                {queueFiles.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFileId(f.id)}
                    className={`w-full text-left p-2 rounded-md transition-colors text-[11px] font-mono flex items-center justify-between gap-1.5 cursor-pointer ${
                      activeFile?.id === f.id
                        ? "bg-brand-500/10 border border-brand-500/40 text-brand-700 dark:text-brand-300 font-bold"
                        : "hover:bg-surface-secondary/70 text-text-secondary"
                    }`}
                  >
                    <div className="truncate min-w-0 pr-1">
                      <div className="truncate">{f.filename}</div>
                      <div className="text-[10px] text-text-tertiary truncate">
                        {f.category || "Belum ada kategori"}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {f.status === "ready" && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      {f.status === "need_metadata" && (
                        <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      {f.status === "warning" && (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      {f.status === "converting" && (
                        <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Column: Active File Editor */}
              <div className="md:col-span-2 space-y-3">
                {activeFile ? (
                  <div className="space-y-3 border border-border rounded-lg p-3.5 bg-surface">
                    {/* Active File Title & Extension Badge */}
                    <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
                      <div className="flex items-center gap-2 truncate">
                        <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/30">
                          {activeFile.ext}
                        </span>
                        <span className="font-bold text-text-primary text-xs truncate">
                          {activeFile.filename}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setQueueFiles((prev) => prev.filter((f) => f.id !== activeFile.id));
                          setActiveFileId(null);
                        }}
                        className="text-text-tertiary hover:text-rose-600 text-xs flex items-center gap-1 cursor-pointer"
                        title="Hapus berkas ini dari antrean"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>

                    {/* Warning Banner (e.g. Scanned / Empty PDF) */}
                    {activeFile.warning && (
                      <div className="p-2.5 bg-amber-500/10 border-l-2 border-amber-500 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2 font-mono">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold">Peringatan Ekstraksi:</strong>
                          <span>{activeFile.warning}</span>
                        </div>
                      </div>
                    )}

                    {/* Metadata Input: Judul */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-primary">
                        Judul Catatan
                      </label>
                      <input
                        type="text"
                        value={activeFile.suggestedTitle}
                        onChange={(e) =>
                          updateActiveFile({ suggestedTitle: e.target.value })
                        }
                        placeholder="Judul catatan materi..."
                        className="w-full p-2 text-xs font-sans bg-surface-secondary/50 border border-border rounded text-text-primary focus:border-brand-500 focus:outline-hidden"
                      />
                    </div>

                    {/* Metadata Input: Kategori (Dropdown from DB) */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-primary flex items-center justify-between">
                        <span>Kategori Kurikulum (Wajib)</span>
                        <span className="text-[10px] text-text-tertiary font-normal">
                          dari database
                        </span>
                      </label>
                      <select
                        value={activeFile.category}
                        onChange={(e) =>
                          updateActiveFile({ category: e.target.value })
                        }
                        className="w-full p-2 text-xs font-mono bg-surface-secondary/50 border border-border rounded text-text-primary focus:border-brand-500 focus:outline-hidden cursor-pointer"
                      >
                        <option value="">-- Pilih Kategori Kurikulum --</option>
                        {categories.map((c) => (
                          <option key={c.id || c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Metadata Input: Tags */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-primary flex items-center gap-1">
                        <Tag className="w-3 h-3 text-text-tertiary" />
                        <span>Tags (Opsional, pisahkan koma)</span>
                      </label>
                      <input
                        type="text"
                        value={activeFile.tags}
                        onChange={(e) => updateActiveFile({ tags: e.target.value })}
                        placeholder="ai-fundamentals, agent, peas"
                        className="w-full p-2 text-xs font-mono bg-surface-secondary/50 border border-border rounded text-text-primary focus:border-brand-500 focus:outline-hidden"
                      />
                    </div>

                    {/* Editable Markdown Body Textarea */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-text-primary">
                          Isi Catatan Markdown (Dapat Diedit Langsung)
                        </span>
                        <span className="text-text-tertiary text-[10px]">
                          {activeFile.markdownBody.length} karakter
                        </span>
                      </div>
                      <textarea
                        value={activeFile.markdownBody}
                        onChange={(e) =>
                          updateActiveFile({ markdownBody: e.target.value })
                        }
                        rows={9}
                        placeholder="Teks markdown catatan hasil konversi..."
                        className="w-full p-2.5 font-mono text-[11px] bg-surface-secondary/30 border border-border rounded text-text-primary focus:border-brand-500 focus:outline-hidden resize-y leading-relaxed"
                      />
                    </div>

                    {/* Save & Mark Ready Action Button */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[11px] text-text-tertiary">
                        {activeFile.status === "ready" ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Berkas ini sudah siap diimpor</span>
                          </span>
                        ) : (
                          <span>Klik tombol untuk merakit frontmatter</span>
                        )}
                      </div>

                      <Button
                        type="button"
                        onClick={handleSaveActiveFileMetadata}
                        className="gap-1.5 text-xs font-mono font-bold bg-brand-600 hover:bg-brand-700 text-white cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Gunakan & Tandai Siap</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center border border-border rounded-lg text-text-tertiary">
                    Pilih berkas dari daftar di sebelah kiri untuk menyunting metadata.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                type="button"
                onClick={() => setStep("input")}
                className="gap-1.5 text-xs font-mono cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Pilihan Berkas</span>
              </Button>

              <Button
                type="button"
                onClick={handleProceedToPreview}
                disabled={readyCount === 0 || convertingCount > 0 || previewLoading}
                className="gap-1.5 text-xs font-mono font-bold bg-brand-600 hover:bg-brand-700 text-white cursor-pointer"
              >
                {previewLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <span>Lanjut ke Preview ({readyCount} Berkas Siap)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PREVIEW & CONFIRMATION ================= */}
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
                onClick={() => {
                  if (queueFiles.length > 0 && inputMode === "upload") {
                    setStep("metadata");
                  } else {
                    setStep("input");
                  }
                }}
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

        {/* ================= STEP 4: IMPORTING PROGRESS ================= */}
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

        {/* ================= STEP 5: RESULT SUMMARY ================= */}
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
