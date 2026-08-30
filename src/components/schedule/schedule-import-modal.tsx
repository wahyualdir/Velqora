"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  MapPin,
  Pencil,
  Trash2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Check,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  Eye,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import {
  processScheduleFileAction,
  saveImportedSchedulesAction,
  getUserSchedules,
} from "@/actions/schedule-actions";
import { ExtractedScheduleItem } from "@/lib/schedule-import/types";
import {
  normalizeExtractedScheduleItem,
} from "@/lib/schedule-import/normalizer";
import { detectAllScheduleConflicts } from "@/lib/schedule-import/conflict-engine";
import { DAYS } from "./schedule-navigation";
import { ScheduleImportHistoryItem } from "@/types/schedule";
import { ScheduleItem } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { diffScheduleCollections } from "@/lib/schedule-intelligence/schedule-diff";
import { ScheduleDiffResult } from "@/lib/schedule-intelligence/types";
import { ScheduleChangeReview } from "./schedule-change-review";

interface ScheduleImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedItems: any[]) => void;
}

type ImportStep =
  | "upload"
  | "uploading"
  | "extracting"
  | "structuring"
  | "validating"
  | "detecting_conflicts"
  | "review"
  | "diff_review"
  | "confirm"
  | "saving";

export function ScheduleImportModal({
  isOpen,
  onClose,
  onSuccess,
}: ScheduleImportModalProps) {
  const [step, setStep] = useState<ImportStep>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [items, setItems] = useState<ExtractedScheduleItem[]>([]);
  const [existingSchedules, setExistingSchedules] = useState<ScheduleItem[]>([]);
  const [filterTab, setFilterTab] = useState<"all" | "valid" | "review" | "conflict">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ExtractedScheduleItem>>({});
  const [evidenceModalItem, setEvidenceModalItem] = useState<ExtractedScheduleItem | null>(null);
  const [diffResult, setDiffResult] = useState<ScheduleDiffResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingDurationMs, setProcessingDurationMs] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setErrorMessage(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleProcessFile = async () => {
    if (!selectedFile || isSubmitting) return;

    const startTime = Date.now();
    setErrorMessage(null);
    setIsSubmitting(true);
    setStep("uploading");

    try {
      // Fetch user's existing schedules for conflict detection and diffing
      const existing = await getUserSchedules();
      setExistingSchedules(existing);

      setStep("extracting");

      const formData = new FormData();
      formData.append("file", selectedFile);

      const result = await processScheduleFileAction(formData);

      if (!result.success) {
        setErrorMessage(result.error || "Gagal memproses dokumen.");
        setStep("upload");
        return;
      }

      if (result.isScannedDocument) {
        setErrorMessage(result.error || "PDF ini berupa hasil scan. Teks jadwal belum dapat dibaca secara langsung.");
        setStep("upload");
        return;
      }

      if (result.classification && !result.classification.isSchedule) {
        setErrorMessage(`Dokumen ini belum dapat dikenali sebagai jadwal akademik: ${result.classification.reason}`);
        setStep("upload");
        return;
      }

      if (!result.items || result.items.length === 0) {
        setErrorMessage(result.warnings?.[0] || "Tidak ditemukan informasi jadwal yang dapat dikenali.");
        setStep("upload");
        return;
      }

      setProcessingDurationMs(Date.now() - startTime);
      setItems(result.items);

      if (existing.length > 0) {
        const diff = diffScheduleCollections(existing, result.items);
        setDiffResult(diff);
        if (diff.changedCount > 0 || diff.removedCount > 0) {
          setStep("diff_review");
          toast.info(`Terdeteksi ${diff.changedCount} perubahan dari jadwal sebelumnya.`);
          return;
        }
      }

      setStep("review");
      toast.success(`${result.items.length} agenda ditemukan dan siap diperiksa.`);
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan saat memproses berkas.");
      setStep("upload");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  // Select all or deselect all
  const handleSelectAll = (select: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: select })));
  };

  // Select only verified/valid items without conflicts
  const handleSelectOnlyValid = () => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        selected:
          item.confidence === "verified" &&
          !item.hasConflict &&
          !item.isDuplicate &&
          !item.dayDateMismatch &&
          !item.timeIncomplete,
      }))
    );
    toast.success("Hanya agenda yang siap dan terverifikasi yang dipilih.");
  };

  // Delete item from draft
  const handleDeleteItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    const reAnalyzed = detectAllScheduleConflicts(updated, existingSchedules);
    setItems(reAnalyzed);
    toast.info("Agenda dihapus dari daftar draft.");
  };

  // Start inline editing
  const handleStartEdit = (item: ExtractedScheduleItem) => {
    setEditingId(item.id);
    setEditForm({
      title: item.title,
      subject: item.subject,
      day: item.day,
      date: item.date,
      startTime: item.startTime,
      endTime: item.endTime,
      time: item.time,
      location: item.location,
      instructor: item.instructor || item.lecturer,
      priority: item.priority || "sedang",
    });
  };

  // Cancel inline editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Save inline edit with immediate full revalidation
  const handleSaveEdit = (id: string) => {
    if (!editForm.title || !editForm.title.trim()) {
      toast.error("Nama agenda / mata kuliah tidak boleh kosong.");
      return;
    }

    const updatedStart = editForm.startTime?.trim();
    const updatedEnd = editForm.endTime?.trim();
    let updatedTime = editForm.time?.trim();

    if (updatedStart && updatedEnd) {
      updatedTime = `${updatedStart} - ${updatedEnd}`;
    }

    // 1. Re-normalize edited item with full deterministic pipeline
    const rawUpdatedInput = {
      title: editForm.title?.trim(),
      subject: editForm.subject?.trim(),
      day: editForm.day,
      date: editForm.date?.trim(),
      startTime: updatedStart,
      endTime: updatedEnd,
      time: updatedTime,
      location: editForm.location?.trim(),
      instructor: editForm.instructor?.trim(),
      priority: editForm.priority,
    };

    const revalidatedItem = normalizeExtractedScheduleItem(rawUpdatedInput, 0);

    // 2. Replace item in the list while preserving ID
    const updatedList = items.map((item) =>
      item.id === id
        ? {
            ...revalidatedItem,
            id: item.id,
            sourceTrace: item.sourceTrace || "Manual Koreksi",
            selected: true,
          }
        : item
    );

    // 3. Re-run conflict engine across the updated list and existing schedules
    const reAnalyzedList = detectAllScheduleConflicts(updatedList, existingSchedules);

    setItems(reAnalyzedList);
    setEditingId(null);
    setEditForm({});

    const savedItem = reAnalyzedList.find((i) => i.id === id);
    if (savedItem?.hasConflict) {
      toast.warning("Agenda berhasil disimpan, tetapi terdeteksi bentrok waktu.");
    } else {
      toast.success("Perubahan agenda berhasil disimpan dan divalidasi ulang.");
    }
  };

  // Quick Resolve Day-Date Mismatch
  const handleResolveDayDateMismatch = (
    itemId: string,
    choice: "use_actual_day" | "clear_date"
  ) => {
    const target = items.find((i) => i.id === itemId);
    if (!target) return;

    const rawUpdatedInput = {
      title: target.title,
      subject: target.subject,
      day: choice === "use_actual_day" && target.expectedDayFromDate ? target.expectedDayFromDate : target.day,
      date: choice === "clear_date" ? undefined : target.date,
      startTime: target.startTime,
      endTime: target.endTime,
      time: target.time,
      location: target.location,
      instructor: target.instructor || target.lecturer,
      priority: target.priority,
    };

    const revalidated = normalizeExtractedScheduleItem(rawUpdatedInput, 0);
    const updatedList = items.map((i) =>
      i.id === itemId ? { ...revalidated, id: i.id, selected: true } : i
    );
    const reAnalyzed = detectAllScheduleConflicts(updatedList, existingSchedules);

    setItems(reAnalyzed);
    toast.success(
      choice === "use_actual_day"
        ? `Hari disesuaikan menjadi ${target.expectedDayFromDate}.`
        : "Tanggal dilepas, hari tetap dipertahankan."
    );
  };

  // Proceed to Confirmation Step
  const handleGoToConfirmation = () => {
    const selectedItems = items.filter((i) => i.selected);
    if (selectedItems.length === 0) {
      toast.error("Pilih minimal 1 agenda untuk ditambahkan ke jadwal.");
      return;
    }
    setStep("confirm");
  };

  // Commit selected items to database
  const handleSaveSelectedToSchedule = async () => {
    const selectedItems = items.filter((i) => i.selected);
    if (selectedItems.length === 0 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setStep("saving");

    try {
      const payload = selectedItems.map((item) => ({
        title: item.title,
        subject: item.subject || "",
        day: item.day || "Senin",
        start_time: item.startTime || null,
        end_time: item.endTime || null,
        time: item.time || "--:--",
        location: item.location || "",
        lecturer: item.lecturer || item.instructor || "",
        type: item.type || "jadwal",
        priority: item.priority || "sedang",
        is_completed: false,
        source: "imported",
        source_file: selectedFile?.name || "import_document",
      }));

      const res = await saveImportedSchedulesAction(payload);
      if (!res.success) {
        setStep("confirm");
        toast.error(res.error || "Gagal menyimpan jadwal ke database.");
        return;
      }

      // Record in local import history
      if (selectedFile) {
        try {
          const historyRaw = localStorage.getItem("velqora_schedule_import_history");
          const existingHistory: ScheduleImportHistoryItem[] = historyRaw ? JSON.parse(historyRaw) : [];
          const newHistoryItem: ScheduleImportHistoryItem = {
            id: `hist_${Date.now()}`,
            sourceFileName: selectedFile.name,
            fileType: selectedFile.type || selectedFile.name.split(".").pop()?.toUpperCase() || "FILE",
            fileSizeFormatted: `${(selectedFile.size / 1024).toFixed(1)} KB`,
            eventCount: res.insertedCount,
            status: "berhasil",
            importedAt: new Date().toISOString(),
            correlationId: `imp_${Date.now()}`,
          };
          localStorage.setItem(
            "velqora_schedule_import_history",
            JSON.stringify([newHistoryItem, ...existingHistory].slice(0, 30))
          );
        } catch {
          // ignore history write error
        }
      }

      toast.success(`${res.insertedCount} agenda berhasil ditambahkan ke jadwal Anda!`);
      onSuccess(res.savedItems);
      handleReset();
      onClose();
    } catch (err: any) {
      setStep("confirm");
      toast.error(err.message || "Gagal menyimpan jadwal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setSelectedFile(null);
    setItems([]);
    setErrorMessage(null);
    setEditingId(null);
    setIsSubmitting(false);
    setProcessingDurationMs(null);
    setEvidenceModalItem(null);
  };

  // Filtered items in review step
  const displayedItems = items.filter((item) => {
    if (filterTab === "valid") {
      return item.confidence === "verified" && !item.hasConflict && !item.isDuplicate && !item.dayDateMismatch;
    }
    if (filterTab === "review") {
      return item.confidence === "needs_review" || item.dayDateMismatch;
    }
    if (filterTab === "conflict") {
      return item.hasConflict || item.isDuplicate;
    }
    return true;
  });

  const selectedCount = items.filter((i) => i.selected).length;
  const verifiedCount = items.filter((i) => i.confidence === "verified" && !i.hasConflict && !i.dayDateMismatch).length;
  const reviewCount = items.filter((i) => i.confidence === "needs_review" || i.dayDateMismatch).length;
  const conflictCount = items.filter((i) => i.hasConflict || i.isDuplicate).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title={
        step === "upload" || step === "uploading"
          ? "Import Jadwal dari Dokumen"
          : step === "review"
          ? "Periksa & Validasi Hasil Ekstraksi"
          : "Konfirmasi Import Jadwal"
      }
      className="max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* ================= STEP: UPLOAD ================= */}
        {(step === "upload" || step === "uploading" || step === "extracting") && (
          <div className="space-y-6">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200",
                dragOver
                  ? "border-primary bg-primary/5 scale-[0.99]"
                  : selectedFile
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.tsv,.txt,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              {selectedFile ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-base sm:text-lg">
                      {selectedFile.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Klik untuk ganti berkas
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                    Berkas siap diproses
                  </Badge>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-base sm:text-lg">
                      Tarik & lepas dokumen jadwal ke sini
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      atau klik untuk memilih dari perangkat Anda
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-[11px]">PDF</Badge>
                    <Badge variant="secondary" className="text-[11px]">DOCX</Badge>
                    <Badge variant="secondary" className="text-[11px]">XLSX</Badge>
                    <Badge variant="secondary" className="text-[11px]">CSV / TSV</Badge>
                    <Badge variant="secondary" className="text-[11px]">TXT</Badge>
                    <Badge variant="secondary" className="text-[11px]">Maks. 15 MB</Badge>
                  </div>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Proses Ekstraksi Belum Berhasil</p>
                  <p className="text-xs mt-1 text-destructive/90">{errorMessage}</p>
                </div>
              </div>
            )}

            {isSubmitting && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <div className="flex items-center gap-3 text-sm font-medium text-primary">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>
                    {step === "uploading" && "Membaca berkas dokumen..."}
                    {step === "extracting" && "Mengekstrak dan menstrukturkan jadwal akademik..."}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground pl-7">
                  Mesin menganalisis tabel, mendeteksi jam, ruang, dosen, dan memeriksa potensi bentrok waktu.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP: DIFF REVIEW (IMPORT UPDATE MODE) ================= */}
        {step === "diff_review" && diffResult && (
          <ScheduleChangeReview
            diffResult={diffResult}
            onSuccess={(saved) => {
              onSuccess(saved);
              handleReset();
              onClose();
            }}
            onCancel={() => setStep("review")}
          />
        )}

        {/* ================= STEP: REVIEW ================= */}
        {step === "review" && (
          <div className="space-y-6">
            {/* Header Metrics */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-muted/40 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm sm:text-base">
                    {items.length} Agenda Berhasil Diekstrak
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {selectedCount} dari {items.length} dipilih • {selectedFile?.name}{" "}
                    {processingDurationMs && `(${processingDurationMs}ms)`}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSelectOnlyValid}
                  className="text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Pilih yang Siap ({verifiedCount})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSelectAll(selectedCount !== items.length)}
                  className="text-xs"
                >
                  {selectedCount === items.length ? "Batal Pilih Semua" : "Pilih Semua"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleReset}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Unggah Ulang
                </Button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
              <button
                type="button"
                onClick={() => setFilterTab("all")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                  filterTab === "all"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                Semua ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("valid")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer",
                  filterTab === "valid"
                    ? "bg-emerald-600 text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Siap ({verifiedCount})
              </button>
              {reviewCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilterTab("review")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer",
                    filterTab === "review"
                      ? "bg-amber-500 text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Perlu Review ({reviewCount})
                </button>
              )}
              {conflictCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilterTab("conflict")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer",
                    filterTab === "conflict"
                      ? "bg-rose-500 text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Bentrok / Duplikat ({conflictCount})
                </button>
              )}
            </div>

            {/* Item List */}
            <div className="space-y-3">
              {displayedItems.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm border rounded-xl">
                  Tidak ada agenda pada kategori ini.
                </div>
              ) : (
                displayedItems.map((item) => {
                  const isEditing = editingId === item.id;

                  if (isEditing) {
                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border-2 border-primary/50 bg-primary/5 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            Edit Agenda
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Sumber: {item.sourceTrace || "Dokumen"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="sm:col-span-2">
                            <label className="text-xs font-medium text-foreground block mb-1">
                              Nama Mata Kuliah / Agenda *
                            </label>
                            <Input
                              value={editForm.title || ""}
                              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                              placeholder="contoh: Pemrograman Web"
                              className="text-sm"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium text-foreground block mb-1">
                              Kode MK (Opsional)
                            </label>
                            <Input
                              value={editForm.subject || ""}
                              onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                              placeholder="contoh: IF3101"
                              className="text-sm"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium text-foreground block mb-1">
                              Hari
                            </label>
                            <Select
                              value={editForm.day || "Senin"}
                              onChange={(e) => setEditForm({ ...editForm, day: e.target.value })}
                              className="text-sm"
                            >
                              {DAYS.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </Select>
                          </div>

                          <div>
                            <label className="text-xs font-medium text-foreground block mb-1">
                              Jam Mulai (HH:mm)
                            </label>
                            <Input
                              type="time"
                              value={editForm.startTime || ""}
                              onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                              className="text-sm"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium text-foreground block mb-1">
                              Jam Selesai (HH:mm)
                            </label>
                            <Input
                              type="time"
                              value={editForm.endTime || ""}
                              onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                              className="text-sm"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium text-foreground block mb-1">
                              Ruangan / Lokasi
                            </label>
                            <Input
                              value={editForm.location || ""}
                              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                              placeholder="contoh: Lab 1 / Ruang 402"
                              className="text-sm"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium text-foreground block mb-1">
                              Dosen Pengampu
                            </label>
                            <Input
                              value={editForm.instructor || ""}
                              onChange={(e) => setEditForm({ ...editForm, instructor: e.target.value })}
                              placeholder="contoh: Dr. Budi Santoso, M.T."
                              className="text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            Batal
                          </Button>
                          <Button size="sm" onClick={() => handleSaveEdit(item.id)}>
                            Simpan Perubahan
                          </Button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "p-4 rounded-xl border transition-all",
                        item.selected
                          ? "bg-card border-border shadow-xs"
                          : "bg-muted/20 border-border/40 opacity-70"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(item.id)}
                          className={cn(
                            "mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 cursor-pointer",
                            item.selected
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-input bg-background hover:bg-accent"
                          )}
                        >
                          {item.selected && <Check className="w-3.5 h-3.5" />}
                        </button>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-semibold text-sm text-foreground truncate max-w-[280px] sm:max-w-md">
                                {item.title}
                              </h4>
                              {item.subject && (
                                <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                                  {item.subject}
                                </Badge>
                              )}
                            </div>

                            {/* Status Badges */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {item.confidence === "verified" && !item.hasConflict && !item.dayDateMismatch && (
                                <Badge variant="outline" className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Siap
                                </Badge>
                              )}

                              {item.confidence === "needs_review" && !item.hasConflict && (
                                <Badge variant="outline" className="text-[11px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Perlu Pemeriksaan
                                </Badge>
                              )}

                              {item.dayDateMismatch && (
                                <Badge variant="outline" className="text-[11px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Hari & Tanggal Mismatch
                                </Badge>
                              )}

                              {item.hasConflict && (
                                <Badge variant="outline" className="text-[11px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 flex items-center gap-1">
                                  <ShieldAlert className="w-3 h-3" />
                                  Bentrok Waktu
                                </Badge>
                              )}

                              {item.isDuplicate && (
                                <Badge variant="outline" className="text-[11px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30">
                                  Duplikat
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Secondary attributes */}
                          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-primary/70" />
                              {item.day || "Hari belum ditentukan"}
                              {item.date && ` (${item.date})`}
                            </span>

                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-primary/70" />
                              {item.startTime ? `${item.startTime} - ${item.endTime || ""}` : item.time || "--:--"}
                              {item.isEstimatedEndTime && (
                                <span className="text-[10px] text-amber-600 dark:text-amber-400 italic">
                                  (estimasi 90m)
                                </span>
                              )}
                            </span>

                            {item.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-primary/70" />
                                {item.location}
                              </span>
                            )}

                            {(item.instructor || item.lecturer) && (
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-primary/70" />
                                {item.instructor || item.lecturer}
                              </span>
                            )}
                          </div>

                          {/* Day-Date Mismatch Quick Resolution Panel */}
                          {item.dayDateMismatch && (
                            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs space-y-2">
                              <p className="text-rose-700 dark:text-rose-300 font-medium">
                                ⚠ {item.dayDateMismatchReason}
                              </p>
                              <div className="flex flex-wrap items-center gap-2">
                                {item.expectedDayFromDate && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleResolveDayDateMismatch(item.id, "use_actual_day")}
                                    className="h-7 text-xs bg-background hover:bg-rose-500/10"
                                  >
                                    Gunakan Hari {item.expectedDayFromDate}
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleResolveDayDateMismatch(item.id, "clear_date")}
                                  className="h-7 text-xs bg-background hover:bg-rose-500/10"
                                >
                                  Pertahankan Hari {item.day} (Hapus Tanggal)
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Conflict Details */}
                          {item.hasConflict && item.conflictDetails && (
                            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 space-y-1">
                              {item.conflictDetails.map((msg, i) => (
                                <p key={i} className="flex items-start gap-1.5">
                                  <span className="font-bold">•</span>
                                  <span>{msg}</span>
                                </p>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => setEvidenceModalItem(item)}
                            title="Lihat Sumber Ekstraksi"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => handleStartEdit(item)}
                            title="Edit Data"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => handleDeleteItem(item.id)}
                            title="Hapus dari Draft"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================= STEP: CONFIRM ================= */}
        {step === "confirm" && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold text-foreground">
                Siap Menambahkan {selectedCount} Agenda ke Jadwal?
              </h4>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Seluruh agenda terpilih akan otomatis ditambahkan ke kalender Velqora Anda secara aman.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/50 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Berkas Sumber:</span>
                <span className="font-semibold text-foreground">{selectedFile?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Jumlah Agenda Terpilih:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedCount} Agenda</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Agenda Dilewati:</span>
                <span className="font-semibold text-muted-foreground">{items.length - selectedCount} Agenda</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-4 sm:p-6 border-t border-border bg-muted/20 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
        {step === "upload" || step === "uploading" || step === "extracting" ? (
          <>
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting} className="w-full sm:w-auto">
              Batal
            </Button>
            <Button
              onClick={handleProcessFile}
              disabled={!selectedFile || isSubmitting}
              className="w-full sm:w-auto gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Mengekstrak Dokumen...
                </>
              ) : (
                <>
                  Proses Dokumen
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </>
        ) : step === "review" ? (
          <>
            <div className="text-xs text-muted-foreground text-center sm:text-left">
              {selectedCount === 0 ? "Pilih minimal 1 agenda untuk melanjutkan." : `${selectedCount} agenda terpilih untuk di-import.`}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
                Batal
              </Button>
              <Button
                onClick={handleGoToConfirmation}
                disabled={selectedCount === 0}
                className="w-full sm:w-auto gap-2"
              >
                Lanjutkan ({selectedCount})
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => setStep("review")}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Kembali ke Review
            </Button>
            <Button
              onClick={handleSaveSelectedToSchedule}
              disabled={isSubmitting}
              className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Menyimpan ke Kalender...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Import ke Jadwal Saya
                </>
              )}
            </Button>
          </>
        )}
      </div>

      {/* ================= EVIDENCE PREVIEW MODAL ================= */}
      {evidenceModalItem && (
        <Modal
          isOpen={!!evidenceModalItem}
          onClose={() => setEvidenceModalItem(null)}
          title="Bukti Sumber Ekstraksi (Evidence Trace)"
          className="max-w-lg"
        >
          <div className="space-y-4 p-4">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mata Kuliah:</span>
                <span className="font-semibold text-foreground">{evidenceModalItem.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lokasi Dokumen:</span>
                <span className="font-semibold text-primary">{evidenceModalItem.sourceTrace || "Baris Dokumen"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metode Ekstraksi:</span>
                <span className="font-semibold text-foreground">
                  {evidenceModalItem.extractionMethod === "deterministic_table"
                    ? "Tabel Terstruktur Deterministic"
                    : evidenceModalItem.extractionMethod === "ai_gemini"
                    ? "Model AI Velqora"
                    : "Ekstraksi Heuristik Deterministic"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confidence Score:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {((evidenceModalItem.confidenceScore ?? 0.9) * 100).toFixed(0)}% ({evidenceModalItem.confidenceLevel || "Terverifikasi"})
                </span>
              </div>
            </div>

            {/* Confidence Reasons List */}
            {evidenceModalItem.confidenceReasons && evidenceModalItem.confidenceReasons.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Faktor Penilaian Keyakinan (Confidence Breakdown):
                </label>
                <div className="p-2.5 rounded-lg bg-muted/20 border border-border/40 space-y-1">
                  {evidenceModalItem.confidenceReasons.map((reason, idx) => (
                    <div key={idx} className="text-xs text-foreground flex items-center gap-1.5">
                      <span className="text-xs">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Source Snippet */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Teks Asli Dokumen:
              </label>
              <div className="p-3 rounded-lg bg-card border font-mono text-xs text-muted-foreground break-all whitespace-pre-wrap">
                {evidenceModalItem.sourceText || "Teks baris dokumen asli."}
              </div>
            </div>

            {/* Field Breakdown */}
            {evidenceModalItem.fieldEvidence && evidenceModalItem.fieldEvidence.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-foreground block mb-2">
                  Rincian Bukti Per Field:
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {evidenceModalItem.fieldEvidence.map((ev, i) => (
                    <div key={i} className="p-2 rounded-lg bg-muted/30 border border-border/30 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-semibold uppercase text-[10px] text-muted-foreground block">
                          {ev.field}
                        </span>
                        <span className="text-foreground">{ev.value}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {(ev.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-border flex justify-end">
              <Button size="sm" onClick={() => setEvidenceModalItem(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
}
