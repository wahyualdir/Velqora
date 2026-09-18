"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  Crown,
  BookOpen,
  FolderPlus,
  Layers,
  Check,
  X,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  previewModuleFromFileAction,
  importModuleFromFileAction,
  type ParsedModuleStructure,
  type ImportModuleFileResult,
} from "@/actions/study/module-file-import";
import { getCategories } from "@/actions/study/categories";
import type { ModuleLevel } from "@/types";

interface OwnerModuleImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (result: ImportModuleFileResult) => void;
  defaultCategoryId?: string;
}

type Step = "upload" | "preview" | "submitting" | "success";
type SupportedExt = "pdf" | "docx" | "pptx" | "ipynb" | "md";

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

export function OwnerModuleImportModal({
  isOpen,
  onClose,
  onSuccess,
  defaultCategoryId,
}: OwnerModuleImportModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("upload");
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64Content, setBase64Content] = useState<string>("");
  const [extracting, setExtracting] = useState(false);
  const [extractionWarning, setExtractionWarning] = useState<string | null>(null);

  // Form Fields (editable by owner)
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(defaultCategoryId || "");
  const [isCreatingNewTopic, setIsCreatingNewTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicColor, setNewTopicColor] = useState("#3b82f6");
  const [moduleLevel, setModuleLevel] = useState<ModuleLevel>("pemula");
  const [chapters, setChapters] = useState<string[]>([]);
  const [newChapterInput, setNewChapterInput] = useState("");
  const [createLinkedNote, setCreateLinkedNote] = useState(true);

  // Success result
  const [importResult, setImportResult] = useState<ImportModuleFileResult | null>(null);

  // Load existing categories on open
  useEffect(() => {
    if (isOpen) {
      setLoadingCategories(true);
      getCategories()
        .then((cats) => {
          setCategories(cats || []);
          if (defaultCategoryId) {
            setSelectedCategoryId(defaultCategoryId);
          }
        })
        .catch((err) => console.error("Gagal memuat kategori:", err))
        .finally(() => setLoadingCategories(false));
    } else {
      // Reset state on close
      setTimeout(() => {
        setStep("upload");
        setSelectedFile(null);
        setBase64Content("");
        setExtractionWarning(null);
        setModuleTitle("");
        setModuleDescription("");
        setIsCreatingNewTopic(false);
        setNewTopicName("");
        setChapters([]);
        setImportResult(null);
      }, 300);
    }
  }, [isOpen, defaultCategoryId]);

  // Handle file selection
  const handleFileChange = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const validExts: SupportedExt[] = ["pdf", "docx", "pptx", "ipynb", "md"];

    if (!ext || !validExts.includes(ext as SupportedExt)) {
      toast.error("Format berkas tidak didukung. Harap unggah .pdf, .docx, .pptx, .ipynb, atau .md.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error("Ukuran berkas melebihi batas 25MB.");
      return;
    }

    setSelectedFile(file);
    setExtracting(true);
    setExtractionWarning(null);

    try {
      const base64 = await fileToBase64(file);
      setBase64Content(base64);

      // Jalankan pratinjau ekstraksi server
      const parsed: ParsedModuleStructure = await previewModuleFromFileAction({
        filename: file.name,
        base64,
      });

      setModuleTitle(parsed.suggestedTitle);
      setModuleDescription(parsed.suggestedDescription);
      setChapters(parsed.detectedChapters);
      setModuleLevel(parsed.suggestedLevel);

      if (parsed.warning) {
        setExtractionWarning(parsed.warning);
      }

      // Pasang kategori terdeteksi jika belum diset dari default
      if (!selectedCategoryId && parsed.suggestedCategoryId) {
        setSelectedCategoryId(parsed.suggestedCategoryId);
      }

      setStep("preview");
      toast.success("Berkas berhasil diekstrak dan struktur bab terdeteksi!");
    } catch (err: any) {
      toast.error(err.message || "Gagal mengekstrak berkas.");
      setSelectedFile(null);
    } finally {
      setExtracting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Chapter management in preview
  const handleAddChapter = () => {
    const trimmed = newChapterInput.trim();
    if (!trimmed) return;
    if (chapters.includes(trimmed)) {
      toast.error("Bab dengan judul ini sudah ada di daftar.");
      return;
    }
    setChapters([...chapters, trimmed]);
    setNewChapterInput("");
  };

  const handleRemoveChapter = (indexToRemove: number) => {
    setChapters(chapters.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit to DB
  const handleSaveModule = async () => {
    if (!moduleTitle.trim()) {
      toast.error("Judul modul tidak boleh kosong.");
      return;
    }

    if (isCreatingNewTopic && !newTopicName.trim()) {
      toast.error("Nama topik baru tidak boleh kosong.");
      return;
    }

    setStep("submitting");

    try {
      const res = await importModuleFromFileAction({
        filename: selectedFile?.name || "modul.md",
        base64: base64Content,
        title: moduleTitle.trim(),
        description: moduleDescription.trim(),
        categoryId: isCreatingNewTopic ? null : selectedCategoryId || null,
        newCategoryName: isCreatingNewTopic ? newTopicName.trim() : undefined,
        newCategoryColor: isCreatingNewTopic ? newTopicColor : undefined,
        level: moduleLevel,
        chapters,
        createLinkedNote,
      });

      setImportResult(res);
      setStep("success");
      toast.success(`Modul "${res.moduleTitle}" berhasil dibuat dengan ${res.chapterCount} bab materi!`);
      if (onSuccess) {
        onSuccess(res);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan modul ke database.");
      setStep("preview");
    }
  };

  const categoryOptions = categories
    .filter((c) => !c.parent_id)
    .map((c) => ({ value: c.id, label: c.name }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-primary text-base">
                Import Berkas ke Materi Modul
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/15 text-amber-500 border border-amber-500/30">
                Owner Only
              </span>
            </div>
            <p className="text-xs text-text-tertiary">
              Unggah dokumen (.pdf, .docx, .pptx, .ipynb, .md) untuk otomatis dijadikan Modul & Bab Pembelajaran.
            </p>
          </div>
        </div>
      }
    >
      <div className="mt-4 space-y-5">
        {/* Step 1: Upload */}
        {step === "upload" && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-brand-500 hover:bg-surface-secondary/60 transition-all rounded-2xl p-8 sm:p-12 text-center cursor-pointer group flex flex-col items-center justify-center space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.pptx,.ipynb,.md"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              {extracting ? (
                <div className="flex flex-col items-center space-y-2 py-4">
                  <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
                  <p className="text-sm font-medium text-text-primary">
                    Mengekstrak berkas & membedah bab materi...
                  </p>
                  <p className="text-xs text-text-tertiary">
                    Sedang mengonversi dan memetakan struktur secara deterministik
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-500 border border-brand-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Klik untuk memilih berkas atau seret berkas ke sini
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">
                      Mendukung PDF, Word (.docx), PowerPoint (.pptx), Jupyter Notebook (.ipynb), dan Markdown (.md)
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                    {["PDF", "DOCX", "PPTX", "IPYNB", "MD"].map((fmt) => (
                      <span
                        key={fmt}
                        className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-surface-secondary text-text-secondary border border-border"
                      >
                        .{fmt.toLowerCase()}
                      </span>
                    ))}
                    <span className="text-[11px] text-text-tertiary ml-1">Maks. 25MB</span>
                  </div>
                </>
              )}
            </div>

            {/* Info Box */}
            <div className="p-3.5 rounded-xl bg-surface-secondary/70 border border-border/80 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
              <div className="text-xs text-text-secondary space-y-1">
                <p className="font-semibold text-text-primary">
                  Otomasi Cerdas Modul:
                </p>
                <p>
                  Sistem akan otomatis mendeteksi judul, ringkasan, dan memecah sub-heading menjadi daftar bab modul. Anda dapat meninjau dan menyesuaikan hasilnya sebelum disimpan ke database.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Preview & Customize */}
        {step === "preview" && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {extractionWarning && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-500">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{extractionWarning}</span>
              </div>
            )}

            {/* Berkas Sumber */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary border border-border text-xs">
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-4 h-4 text-brand-500 shrink-0" />
                <span className="font-medium text-text-primary truncate">
                  {selectedFile?.name}
                </span>
                <span className="text-text-tertiary">
                  ({(selectedFile?.size ? selectedFile.size / 1024 : 0).toFixed(1)} KB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2 text-text-tertiary hover:text-text-primary"
                onClick={() => {
                  setStep("upload");
                  setSelectedFile(null);
                }}
              >
                Ganti Berkas
              </Button>
            </div>

            {/* Judul & Level */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <Input
                  label="Judul Modul *"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  placeholder="Masukkan judul modul..."
                  required
                />
              </div>
              <div>
                <Select
                  label="Tingkat Kesulitan"
                  value={moduleLevel}
                  onChange={(e) => setModuleLevel(e.target.value as any)}
                  options={[
                    { value: "pemula", label: "Pemula (Beginner)" },
                    { value: "menengah", label: "Menengah (Intermediate)" },
                    { value: "lanjutan", label: "Lanjutan (Advanced)" },
                  ]}
                />
              </div>
            </div>

            {/* Topik / Kategori Section (Tambah Topik Baru Inline) */}
            <div className="p-3.5 rounded-xl border border-border bg-surface space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-brand-500" />
                  Topik / Kategori Modul
                </label>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewTopic(!isCreatingNewTopic)}
                  className="text-xs font-semibold text-brand-500 hover:text-brand-400 flex items-center gap-1 transition-colors"
                >
                  {isCreatingNewTopic ? (
                    <span>Pilih Topik yang Ada</span>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Buat Topik Baru</span>
                    </>
                  )}
                </button>
              </div>

              {isCreatingNewTopic ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="sm:col-span-2">
                    <Input
                      label="Nama Topik Baru *"
                      placeholder="Misal: Quantum Computing, MLOps, AI Agent..."
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                      Warna Label
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newTopicColor}
                        onChange={(e) => setNewTopicColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                      />
                      <span className="text-xs font-mono text-text-secondary">
                        {newTopicColor}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <Select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    placeholder="-- Pilih Topik Modul (Atau buat baru) --"
                    options={categoryOptions}
                  />
                </div>
              )}
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                Ringkasan / Deskripsi Modul
              </label>
              <textarea
                rows={2}
                value={moduleDescription}
                onChange={(e) => setModuleDescription(e.target.value)}
                placeholder="Deskripsi ringkas mengenai materi modul..."
                className="w-full text-xs px-3 py-2 rounded-xl bg-surface border border-border focus:border-brand-500 focus:outline-none text-text-primary resize-y"
              />
            </div>

            {/* Bab-Bab Materi Modul yang Terdeteksi */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-brand-500" />
                  Bab-Bab Materi Modul ({chapters.length} Bab Terdeteksi)
                </label>
                <span className="text-[11px] text-text-tertiary">
                  Dapat disesuaikan sebelum disimpan
                </span>
              </div>

              {/* Daftar Bab */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {chapters.map((chap, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface-secondary/70 border border-border text-xs group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 h-5 rounded-md bg-brand-500/10 text-brand-500 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-text-primary truncate">
                        {chap}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveChapter(idx)}
                      className="text-text-tertiary hover:text-red-500 p-1 transition-colors"
                      title="Hapus bab ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Input Tambah Bab Baru */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Tambah judul bab baru..."
                  value={newChapterInput}
                  onChange={(e) => setNewChapterInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddChapter();
                    }
                  }}
                  className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-surface border border-border focus:border-brand-500 focus:outline-none text-text-primary"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddChapter}
                  className="h-8 text-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Bab
                </Button>
              </div>
            </div>

            {/* Checkbox Sinkronisasi ke Notes */}
            <div className="pt-2 border-t border-border">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createLinkedNote}
                  onChange={(e) => setCreateLinkedNote(e.target.checked)}
                  className="rounded text-brand-500 focus:ring-brand-500 w-4 h-4"
                />
                <span className="text-xs text-text-secondary">
                  Sinkronisasikan juga ke <strong>Catatan Topik</strong> (agar otomatis muncul di Documentation Reader & Knowledge Base).
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("upload")}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Kembali
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveModule}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Simpan Langsung ke Materi Modul
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Submitting */}
        {step === "submitting" && (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-text-primary">
              Menyimpan Modul & Menyusun Bab Pembelajaran...
            </p>
            <p className="text-xs text-text-tertiary">
              Menyinkronkan materi ke tabel modules, module_chapters, dan catatan sistem
            </p>
          </div>
        )}

        {/* Step 4: Success */}
        {step === "success" && importResult && (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-text-primary">
                Modul Berhasil Dibuat!
              </h4>
              <p className="text-xs text-text-secondary mt-1 max-w-md mx-auto">
                Modul <strong>{importResult.moduleTitle}</strong> telah disimpan dengan{" "}
                <strong>{importResult.chapterCount} bab materi</strong> di topik{" "}
                <strong>{importResult.categoryName}</strong>.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                Tutup
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  router.push(`/dashboard/modul?module=${importResult.moduleId}`);
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Buka Modul Sekarang
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
