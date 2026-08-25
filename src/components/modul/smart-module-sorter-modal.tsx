"use client";

import React, { useState, useRef } from "react";
import {
  Sparkles,
  UploadCloud,
  FileText,
  CheckCircle2,
  Layers,
  ArrowRight,
  Loader2,
  Trash2,
  Plus,
  RefreshCw,
  Tag,
  GraduationCap,
  FolderTree,
} from "lucide-react";
import { Modal, Card, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { TechIcon, TechIconKey } from "@/components/ui/tech-icon";
import { classifyViaLocalNLP, ClassificationResult } from "@/lib/module-classifier-engine";
import { createModule, addModuleChapters } from "@/actions/study-actions";
import { ModuleLevel, MODULE_LEVEL_LABELS } from "@/types";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET } from "@/lib/constants";
import { formatFileSize } from "@/lib/utils";
import { validateAcademicFile, validateAcademicText } from "@/lib/academic-content-filter";

interface SmartModuleSorterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: any[];
  onModuleCreated?: () => void;
  onSorted?: () => void;
  onSaved?: () => void;
}

export function SmartModuleSorterModal({
  isOpen,
  onClose,
  categories = [],
  onModuleCreated,
  onSorted,
}: SmartModuleSorterModalProps) {
  const [content, setContent] = useState("");
  const [titleHint, setTitleHint] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  // Editable result fields
  const [finalTitle, setFinalTitle] = useState("");
  const [finalCategoryId, setFinalCategoryId] = useState("");
  const [finalLevel, setFinalLevel] = useState<ModuleLevel>("menengah");
  const [finalDescription, setFinalDescription] = useState("");
  const [finalChapters, setFinalChapters] = useState<string[]>([]);
  const [newChapterInput, setNewChapterInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle text or document file upload with academic safety filter
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Academic safety check
    const check = await validateAcademicFile(file);
    if (!check.isValid) {
      toast.error(
        check.reason ||
          `Berkas "${file.name}" terdeteksi tidak sesuai dengan bahan ajar akademik.`
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploadedFile(file);

    // Use filename as hint title
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setTitleHint(nameWithoutExt);

    const reader = new FileReader();
    reader.onload = async (event) => {
      let text = (event.target?.result as string) || "";
      // Strip non-printable / binary characters if any
      text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ").trim();
      if (text.length > 0) {
        setContent(text.slice(0, 15000));
        toast.success(`Berkas "${file.name}" berhasil dimuat!`);
        runAnalysis(text, nameWithoutExt);
      } else {
        toast.info(`Berkas "${file.name}" dimuat.`);
        runAnalysis(nameWithoutExt, nameWithoutExt);
      }
    };
    reader.onerror = () => {
      toast.error("Gagal membaca berkas. Silakan coba tempel teks langsung.");
    };
    reader.readAsText(file);
  };

  const runAnalysis = async (textToAnalyze?: string, titleHintToUse?: string) => {
    const targetText = textToAnalyze || content;
    const targetTitle = titleHintToUse !== undefined ? titleHintToUse : titleHint;

    if (!targetText.trim() && !uploadedFile) {
      toast.error("Silakan masukkan teks atau unggah berkas modul terlebih dahulu.");
      return;
    }

    // Academic safety check
    const textCheck = validateAcademicText(targetText, targetTitle);
    if (!textCheck.isValid) {
      toast.error(
        textCheck.reason ||
          "Konten terdeteksi tidak sesuai dengan standar bahan ajar akademik."
      );
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      // Instant Client-side Local NLP Analysis (0ms latency, sat-set!)
      const classification = classifyViaLocalNLP(targetText || targetTitle, targetTitle, categories);
      setResult(classification);
      setFinalTitle(classification.suggestedTitle);
      setFinalCategoryId(classification.categoryId || categories[0]?.id || "");
      setFinalLevel(classification.suggestedLevel);
      setFinalDescription(classification.suggestedDescription);
      setFinalChapters([...classification.extractedChapters]);
      toast.success(`Kategori terdeteksi: "${classification.categoryName}" (${classification.confidenceScore}% Akurasi)`);
    } catch (err: any) {
      toast.error(err.message || "Gagal menganalisis modul");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddChapter = () => {
    if (!newChapterInput.trim()) return;
    const chCheck = validateAcademicText(newChapterInput.trim());
    if (!chCheck.isValid) {
      toast.error(chCheck.reason || "Nama bab tidak sesuai dengan materi akademik.");
      return;
    }
    setFinalChapters([...finalChapters, newChapterInput.trim()]);
    setNewChapterInput("");
  };

  const handleRemoveChapter = (index: number) => {
    setFinalChapters(finalChapters.filter((_, i) => i !== index));
  };

  const handleSaveAndCreate = async () => {
    if (!finalTitle.trim()) {
      toast.error("Judul modul wajib diisi");
      return;
    }

    const titleCheck = validateAcademicText(finalDescription, finalTitle);
    if (!titleCheck.isValid) {
      toast.error(
        titleCheck.reason ||
          "Judul atau deskripsi modul tidak sesuai dengan bahan ajar akademik."
      );
      return;
    }

    setSaving(true);
    try {
      // 1. Determine safe category ID
      let chosenCatId = finalCategoryId;
      if (!chosenCatId || !categories.some((c) => c.id === chosenCatId)) {
        chosenCatId = categories[0]?.id || "";
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const authorName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Pengguna";

      const notesPayload = content ? `Rangkuman materi:\n${content.slice(0, 1500)}` : "";
      let fileAttachmentText = "";

      // 2. Upload the actual file to Supabase Storage if present
      if (uploadedFile && user) {
        try {
          const fileExt = uploadedFile.name.split(".").pop();
          const cleanFileName = uploadedFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const fileName = `modules/${user.id}/${Date.now()}_${cleanFileName}`;

          const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(fileName, uploadedFile, { upsert: true });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from(STORAGE_BUCKET)
              .getPublicUrl(fileName);

            // Record in files table
            await supabase.from("files").insert({
              user_id: user.id,
              name: uploadedFile.name,
              storage_path: fileName,
              url: publicUrlData.publicUrl,
              size: uploadedFile.size,
              mime_type: uploadedFile.type,
            });

            // Embed structured file link into notes
            fileAttachmentText = `📎 **Berkas Modul:** [${uploadedFile.name}](${publicUrlData.publicUrl})\n📦 **Ukuran:** ${formatFileSize(uploadedFile.size)}\n📄 **Tipe:** ${uploadedFile.type || fileExt?.toUpperCase()}`;
          }
        } catch (fileErr) {
          console.warn("Could not save original file to storage:", fileErr);
        }
      }

      // Build structured notes with author attribution
      const authorMetadata = `👤 **Diposting oleh:** ${authorName}`;
      const combinedNotes = [authorMetadata, fileAttachmentText, notesPayload]
        .filter(Boolean)
        .join("\n\n");

      // 3. Create Module record
      const created = await createModule({
        title: finalTitle.trim(),
        description: finalDescription.trim(),
        category_id: chosenCatId,
        level: finalLevel,
        notes: combinedNotes || "",
      });

      if (!created || !created.id) {
        throw new Error("Gagal membuat modul di database. Silakan coba lagi.");
      }

      // 4. Create Chapters atomically using bulk single query
      if (finalChapters.length > 0) {
        try {
          await addModuleChapters(created.id, finalChapters);
        } catch (chapErr) {
          console.warn("Failed to add some chapters:", chapErr);
        }
      }

      toast.success(`Modul "${finalTitle}" berhasil dibuat dan berkas tersimpan!`);
      (onModuleCreated || onSorted)?.();
      handleClose();
    } catch (err: any) {
      console.error("Error saving module:", err);
      toast.error(err.message || "Gagal menerapkan & membuat modul");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setContent("");
    setTitleHint("");
    setUploadedFile(null);
    setResult(null);
    setFinalChapters([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Auto-Sortir Modul"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5 pt-1">
        {/* Banner Intro */}
        <div className="p-4 rounded-xl bg-surface-secondary border border-border flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-brand-400 shrink-0 mt-0.5">
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-semibold text-text-primary">
              Klasifikasi Kategori & Ekstraksi Bab
            </h4>
            <p className="text-text-secondary leading-relaxed">
              Tempelkan teks silabus, ringkasan materi, atau unggah dokumen untuk menentukan kategori bidang keilmuan dan mengekstrak daftar bab secara otomatis.
            </p>
          </div>
        </div>

        {/* Input Area: Upload & Textarea */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Petunjuk Judul / Topik (Opsional)"
                placeholder="Contoh: Belajar REST API & Next.js Server Actions"
                value={titleHint}
                onChange={(e) => setTitleHint(e.target.value)}
                disabled={analyzing || saving}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Unggah Berkas Modul
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.json,.pdf,.docx,.py,.js,.ts,.html,.css,.sql,.cpp,.java"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center gap-2 text-xs border-dashed border-white/20 hover:border-[#0071e3]"
                onClick={() => fileInputRef.current?.click()}
                disabled={analyzing || saving}
              >
                <UploadCloud className="w-4 h-4 text-[#2997ff]" />
                <span>Pilih Berkas</span>
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary flex items-center justify-between">
              <span>Isi / Konten Materi Modul (Tempel teks di sini)</span>
              <span className="text-[11px] font-mono text-slate-500">{content.length} karakter</span>
            </label>
            <Textarea
              rows={5}
              placeholder="Tempelkan silabus, materi pertemuan, catatan kuliah, atau kode sumber modul di sini..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={analyzing || saving}
              className="text-xs font-mono"
            />
          </div>

          {/* Action Analyze Button */}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              onClick={() => runAnalysis()}
              disabled={analyzing || !content.trim()}
              className="bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs gap-2 px-4 py-2 rounded-lg"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menganalisis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Sortir Modul</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* AI Analysis Result Panel */}
        {result && (
          <div className="p-5 rounded-2xl border border-white/[0.12] bg-[#0c1322]/80 backdrop-blur-xl space-y-5 animate-fade-in shadow-xl shadow-black/40">
            {/* Header Result */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                  style={{ backgroundColor: `${result.categoryColor}25`, borderColor: `${result.categoryColor}50`, borderWidth: 1 }}
                >
                  <TechIcon name={result.categoryIcon as TechIconKey} className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Kategori Terpilih:</span>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: result.categoryColor }}
                    >
                      {result.categoryName}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{result.reasoning}</p>
                </div>
              </div>

              {/* Confidence Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{result.confidenceScore}% Akurasi</span>
              </div>
            </div>

            {/* Editable Form Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Judul Modul yang Disarankan"
                  value={finalTitle}
                  onChange={(e) => setFinalTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Select
                  label="Kategori"
                  value={finalCategoryId}
                  onChange={(e) => setFinalCategoryId(e.target.value)}
                  options={
                    categories.length > 0
                      ? categories.map((c) => ({ value: c.id, label: c.name }))
                      : [{ value: "", label: "Umum / Tanpa Kategori" }]
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Select
                  label="Tingkat Kesulitan"
                  value={finalLevel}
                  onChange={(e) => setFinalLevel(e.target.value as ModuleLevel)}
                  options={[
                    { value: "pemula", label: "Pemula (Beginner)" },
                    { value: "menengah", label: "Menengah (Intermediate)" },
                    { value: "lanjutan", label: "Lanjutan (Advanced)" },
                  ]}
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Deskripsi Singkat"
                  value={finalDescription}
                  onChange={(e) => setFinalDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Extracted Chapters Section */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-text-secondary flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#2997ff]" />
                  <span>Bab & Silabus Pembelajaran Terdeteksi ({finalChapters.length})</span>
                </span>
                <span className="text-[11px] text-slate-500">Dapat diedit / ditambah</span>
              </label>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {finalChapters.map((chap, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-200"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 h-5 rounded-full bg-[#0071e3]/20 text-[#2997ff] text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate">{chap}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveChapter(idx)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                      title="Hapus bab"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Chapter */}
              <div className="flex gap-2 pt-1">
                <Input
                  placeholder="Tambahkan bab/topik manual..."
                  value={newChapterInput}
                  onChange={(e) => setNewChapterInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddChapter();
                    }
                  }}
                  className="text-xs py-1.5"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddChapter}
                  className="shrink-0 gap-1 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Bab
                </Button>
              </div>
            </div>

            {/* Extracted Tags */}
            {result.suggestedTags && result.suggestedTags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-[11px] text-slate-400 font-medium">Tag Terkait:</span>
                {result.suggestedTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] border border-white/[0.08] text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Final Save Button */}
            <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setResult(null)}
                disabled={saving}
              >
                Reset
              </Button>
              <Button
                type="button"
                onClick={handleSaveAndCreate}
                disabled={saving}
                className="bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs gap-2 px-4 py-2 rounded-lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan & Buat Modul</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
