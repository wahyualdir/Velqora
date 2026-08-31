"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Sparkles,
  Upload,
  BookOpen,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { ContentContainer } from "@/components/ui/section";
import {
  createModule,
  updateModule,
  getCategories,
  addModuleChapters,
} from "@/actions/study-actions";
import { classifyViaLocalNLP } from "@/lib/module-classifier-engine";
import { MODULE_LEVEL_LABELS, ModuleLevel, Module } from "@/types";
import {
  ModuleDriveFile,
  ModuleSection,
  getFileCategory,
  injectModuleDriveIntoNotes,
  extractModuleDriveFromNotes,
  validateContentFile,
} from "@/types/module-drive";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET, SYSTEM_PRIMARY_CATEGORIES } from "@/lib/constants";
import { validateAcademicText } from "@/lib/academic-content-filter";
import { toast } from "sonner";

import {
  DEFAULT_MODULE_CHAPTER_PRESETS,
  DEFAULT_PROJECT_SECTION_PRESETS,
} from "./unified-content-form/constants";
import { ModeSelector } from "./unified-content-form/mode-selector";
import { CurriculumSectionManager } from "./unified-content-form/curriculum-section-manager";
import { AttachedFilesManager } from "./unified-content-form/attached-files-manager";
import { ProjectFields } from "./unified-content-form/project-fields";

export interface UnifiedContentFormProps {
  initialKind?: "module" | "project";
  initialData?: Module | null;
  isEditing?: boolean;
  onSuccess?: (id: string) => void;
}

export function UnifiedContentForm({
  initialKind = "module",
  initialData = null,
  isEditing = false,
  onSuccess,
}: UnifiedContentFormProps) {
  const router = useRouter();

  // Mode Selection: "module" vs "project"
  const [kind, setKind] = useState<"module" | "project">(
    initialData?.kind || initialKind
  );

  const [categories, setCategories] = useState<any[]>([]);
  const [parentCategory, setParentCategory] = useState("");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [level, setLevel] = useState<string>(initialData?.level || "pemula");
  const [loading, setLoading] = useState(false);
  const [autoSorting, setAutoSorting] = useState(false);

  // Core Information
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [authorName, setAuthorName] = useState(initialData?.author_name || "");
  const [coverUrl, setCoverUrl] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);

  // Project Specific Attributes
  const [programmingLanguage, setProgrammingLanguage] = useState("Python");
  const [projectType, setProjectType] = useState("Data Science");
  const [techStackInput, setTechStackInput] = useState("");
  const [techStackList, setTechStackList] = useState<string[]>(
    initialData?.tech_stack || (kind === "project" ? ["Python", "Jupyter"] : [])
  );
  const [repositoryUrl, setRepositoryUrl] = useState(
    initialData?.repository_url || ""
  );
  const [demoUrl, setDemoUrl] = useState(initialData?.demo_url || "");

  // Structured Content Sections / Chapters
  const [sections, setSections] = useState<string[]>([]);
  const [newSectionInput, setNewSectionInput] = useState("");

  // Attached Files State
  const [existingFiles, setExistingFiles] = useState<ModuleDriveFile[]>([]);
  const [newUploadedFiles, setNewUploadedFiles] = useState<{
    file: File;
    relativePath?: string;
  }[]>([]);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Load existing data if editing
  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const [{ data: { user } }, list] = await Promise.all([
          supabase.auth.getUser(),
          getCategories(),
        ]);
        if (user) {
          setCurrentUser(user);
          setAuthorName((prev) =>
            prev ||
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "Pengguna"
          );
        }

        // Merge DB categories with SYSTEM_PRIMARY_CATEGORIES
        const mergedCategories: any[] = [];
        const dbCatMap = new Map<string, any>();
        if (list && list.length > 0) {
          list.forEach((c: any) => {
            dbCatMap.set(c.name.toLowerCase().trim(), c);
          });
        }

        SYSTEM_PRIMARY_CATEGORIES.forEach((primary, pIdx) => {
          const dbParent = dbCatMap.get(primary.name.toLowerCase().trim());
          const parentId = dbParent?.id || `preset_parent_${pIdx}`;

          mergedCategories.push({
            id: parentId,
            name: primary.name,
            icon: dbParent?.icon || primary.icon,
            color: dbParent?.color || primary.color,
            parent_id: null,
          });

          primary.subcategories.forEach((sub, sIdx) => {
            const dbSub = dbCatMap.get(sub.name.toLowerCase().trim());
            mergedCategories.push({
              id: dbSub?.id || `preset_sub_${pIdx}_${sIdx}`,
              name: sub.name,
              icon: dbSub?.icon || sub.icon,
              color: dbSub?.color || primary.color,
              parent_id: parentId,
            });
          });
        });

        // Add any custom categories
        list?.forEach((dbCat: any) => {
          if (!mergedCategories.some((c) => c.name.toLowerCase().trim() === dbCat.name.toLowerCase().trim())) {
            mergedCategories.push(dbCat);
          }
        });

        setCategories(mergedCategories);

        if (initialData) {
          setTitle(initialData.title || "");
          setDescription(initialData.description || "");
          setLevel(initialData.level || "pemula");
          setCategoryId(initialData.category_id || "");

          if (initialData.category_id) {
            const foundCat = mergedCategories.find((c: any) => c.id === initialData.category_id);
            if (foundCat && foundCat.parent_id) {
              setParentCategory(foundCat.parent_id);
            }
          }

          const drive = extractModuleDriveFromNotes(initialData.notes);
          if (drive.kind) setKind(drive.kind);
          if (drive.techStack) setTechStackList(drive.techStack);
          if (drive.programmingLanguage) setProgrammingLanguage(drive.programmingLanguage);
          if (drive.projectType) setProjectType(drive.projectType);
          if (drive.repositoryUrl) setRepositoryUrl(drive.repositoryUrl);
          if (drive.demoUrl) setDemoUrl(drive.demoUrl);
          if (drive.authorName) setAuthorName(drive.authorName);
          if (drive.coverUrl) setCoverUrl(drive.coverUrl);
          if (drive.files) setExistingFiles(drive.files);

          if (initialData.chapters && initialData.chapters.length > 0) {
            setSections(initialData.chapters.map((c) => c.title));
          } else if (drive.sections && drive.sections.length > 0) {
            setSections(drive.sections.map((s) => s.title));
          }
        } else {
          setSections(
            initialKind === "project"
              ? DEFAULT_PROJECT_SECTION_PRESETS
              : DEFAULT_MODULE_CHAPTER_PRESETS
          );
        }
      } catch (err) {
        console.error("Failed to load module categories/data:", err);
      }
    }
    loadData();
  }, [initialData, initialKind]);

  // Derived categories
  const parentCategories = categories.filter((c) => !c.parent_id);
  const childCategories = categories.filter((c) => {
    if (!parentCategory) return true;
    return c.parent_id === parentCategory;
  });

  const handleKindSwitch = (newKind: "module" | "project") => {
    setKind(newKind);
    if (!isEditing && sections.length === 0) {
      setSections(
        newKind === "project"
          ? DEFAULT_PROJECT_SECTION_PRESETS
          : DEFAULT_MODULE_CHAPTER_PRESETS
      );
    }
  };

  const handleAddTechTag = (tag: string) => {
    const clean = tag.trim();
    if (!clean) return;
    if (!techStackList.includes(clean)) {
      setTechStackList((prev) => [...prev, clean]);
    }
    setTechStackInput("");
  };

  const handleRemoveTechTag = (tag: string) => {
    setTechStackList((prev) => prev.filter((t) => t !== tag));
  };

  const handleAddSection = () => {
    const clean = newSectionInput.trim();
    if (!clean) return;
    setSections((prev) => [...prev, clean]);
    setNewSectionInput("");
  };

  const handleRemoveSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApplyDefaultPresets = () => {
    setSections(
      kind === "project"
        ? DEFAULT_PROJECT_SECTION_PRESETS
        : DEFAULT_MODULE_CHAPTER_PRESETS
    );
    toast.success("Preset struktur isi berhasil diterapkan");
  };

  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran cover maksimal 10MB");
      return;
    }

    setCoverUploading(true);
    try {
      const supabase = createClient();
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `covers/${currentUser?.id || "guest"}/${Date.now()}_${cleanFileName}`;

      const { error: uploadErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, file, { upsert: true });

      if (!uploadErr) {
        const { data: publicUrlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(storagePath);
        setCoverUrl(publicUrlData.publicUrl);
        toast.success("Cover berhasil diunggah");
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setCoverUrl(reader.result as string);
          toast.success("Cover berhasil dimuat");
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      toast.error("Gagal mengunggah cover: " + err.message);
    } finally {
      setCoverUploading(false);
    }
  };

  const handleFilesSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    isFolder = false
  ) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    const validNewFiles: { file: File; relativePath?: string }[] = [];

    for (let i = 0; i < selected.length; i++) {
      const f = selected[i];

      if (f.size > 50 * 1024 * 1024) {
        toast.error(`Berkas "${f.name}" melebihi batas maksimum 50MB`);
        continue;
      }

      const validation = validateContentFile(f.name, kind);
      if (!validation.isValid) {
        toast.error(validation.reason);
        continue;
      }

      const relPath = (f as any).webkitRelativePath || f.name;
      validNewFiles.push({ file: f, relativePath: relPath });
    }

    if (validNewFiles.length > 0) {
      setNewUploadedFiles((prev) => [...prev, ...validNewFiles]);
      toast.success(
        `${validNewFiles.length} berkas ${isFolder ? "dari folder " : ""}siap diunggah!`
      );

      if (!title.trim() && validNewFiles[0]) {
        const cleanName = validNewFiles[0].file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setTitle(kind === "project" ? `Project: ${cleanName}` : cleanName);
      }
    }

    if (e.target) {
      e.target.value = "";
    }
  };

  const handleRemoveNewFile = (index: number) => {
    setNewUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingFile = (fileId: string) => {
    setExistingFiles((prev) => prev.filter((f) => f.id !== fileId));
    toast.info("Berkas ditandai untuk dihapus saat disimpan.");
  };

  const handleQuickClassify = async () => {
    const textToClassify = `${title}\n${description}`.trim();
    if (!textToClassify) {
      toast.info("Ketikkan judul atau deskripsi terlebih dahulu untuk auto-sortir.");
      return;
    }

    const textSafety = validateAcademicText(textToClassify, title);
    if (!textSafety.isValid) {
      toast.error(textSafety.reason || "Konten tidak sesuai dengan standar bahan ajar.");
      return;
    }

    setAutoSorting(true);
    try {
      const res = classifyViaLocalNLP(textToClassify, title, categories);
      if (res.categoryId) {
        setCategoryId(res.categoryId);
      }
      if (res.suggestedLevel) {
        setLevel(res.suggestedLevel);
      }
      if (!description && res.suggestedDescription) {
        setDescription(res.suggestedDescription);
      }
      toast.success(
        `Kategori otomatis disortir ke: "${res.categoryName}" (${res.confidenceScore}% Akurasi)`
      );
    } catch (err: any) {
      toast.error(err.message || "Gagal menyortir kategori");
    } finally {
      setAutoSorting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error(kind === "project" ? "Nama project wajib diisi" : "Judul modul wajib diisi");
      return;
    }

    const contentValidation = validateAcademicText(description, title);
    if (!contentValidation.isValid) {
      toast.error(
        contentValidation.reason ||
          "Konten atau judul terdeteksi tidak sesuai dengan bahan ajar akademik."
      );
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const effectiveAuthor =
        authorName.trim() ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split("@")[0] ||
        "Pengguna";

      const uploadedDriveFiles: ModuleDriveFile[] = [...existingFiles];

      // Process and upload new files
      if (newUploadedFiles.length > 0) {
        for (const item of newUploadedFiles) {
          const file = item.file;
          try {
            const catInfo = getFileCategory(file.name);
            const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
            const storagePath = `modules/${user?.id || "guest"}/${Date.now()}_${cleanFileName}`;

            let fileUrl = "";
            let initialTextContent: string | undefined = undefined;

            if (
              catInfo.category === "jupyter" ||
              catInfo.category === "python" ||
              catInfo.category === "code" ||
              catInfo.category === "text" ||
              catInfo.category === "markdown" ||
              file.name.endsWith(".ipynb") ||
              file.name.endsWith(".py") ||
              file.name.endsWith(".csv") ||
              file.name.endsWith(".tsv") ||
              file.name.endsWith(".json") ||
              file.name.endsWith(".sql") ||
              file.name.endsWith(".txt") ||
              file.name.endsWith(".md")
            ) {
              try {
                initialTextContent = await file.text();
              } catch (e) {
                console.warn("Could not extract text preview:", e);
              }
            }

            if (user) {
              try {
                const { error: uploadError } = await supabase.storage
                  .from(STORAGE_BUCKET)
                  .upload(storagePath, file, { upsert: true });

                if (!uploadError) {
                  const { data: publicUrlData } = supabase.storage
                    .from(STORAGE_BUCKET)
                    .getPublicUrl(storagePath);
                  fileUrl = publicUrlData.publicUrl;
                } else {
                  const { error: fallbackErr } = await supabase.storage
                    .from("files")
                    .upload(storagePath, file, { upsert: true });

                  if (!fallbackErr) {
                    const { data: fallbackUrlData } = supabase.storage
                      .from("files")
                      .getPublicUrl(storagePath);
                    fileUrl = fallbackUrlData.publicUrl;
                  }
                }
              } catch (storageErr) {
                console.warn("Storage upload error:", storageErr);
              }
            }

            if (!fileUrl) {
              try {
                fileUrl = await new Promise<string>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result as string);
                  reader.onerror = reject;
                  reader.readAsDataURL(file);
                });
              } catch {
                fileUrl = "";
              }
            }

            const driveFile: ModuleDriveFile = {
              id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              name: file.name,
              path: item.relativePath || file.name,
              folderId: null,
              storagePath,
              url: fileUrl,
              size: file.size,
              fileType: catInfo.label,
              extension: catInfo.extension,
              category: catInfo.category,
              description: `Berkas ${kind === "project" ? "project" : "modul"}`,
              uploadedAt: new Date().toISOString(),
              textContent: initialTextContent,
            };

            uploadedDriveFiles.push(driveFile);
          } catch (fileErr) {
            console.error("Error processing file:", file.name, fileErr);
          }
        }
      }

      // Format sections
      const structuredSections: ModuleSection[] = sections
        .filter((s) => s.trim().length > 0)
        .map((title, idx) => ({
          id: `sec_${idx + 1}`,
          title: title.trim(),
          orderIndex: idx + 1,
          isCompleted: false,
        }));

      // Serialize notes
      const serializedNotes = injectModuleDriveIntoNotes(
        initialData?.notes || "",
        [],
        uploadedDriveFiles,
        undefined,
        undefined,
        {
          kind,
          techStack: kind === "project" ? techStackList : [],
          programmingLanguage: kind === "project" ? programmingLanguage : undefined,
          framework: kind === "project" ? techStackList.join(", ") : undefined,
          projectType: kind === "project" ? projectType : undefined,
          repositoryUrl: kind === "project" ? repositoryUrl : undefined,
          demoUrl: kind === "project" ? demoUrl : undefined,
          authorName: effectiveAuthor,
          coverUrl: coverUrl || undefined,
          sections: structuredSections,
        }
      );

      let targetId = initialData?.id;

      if (isEditing && initialData?.id) {
        await updateModule(initialData.id, {
          title,
          description,
          category_id: categoryId || undefined,
          level: level as ModuleLevel,
          notes: serializedNotes,
        });

        toast.success(
          kind === "project"
            ? "Project berhasil diperbarui!"
            : "Modul berhasil diperbarui!"
        );
      } else {
        const created = await createModule({
          title,
          description,
          category_id: categoryId || undefined,
          level: level as ModuleLevel,
          notes: serializedNotes,
          kind,
          tech_stack: kind === "project" ? techStackList : [],
          repository_url: repositoryUrl || undefined,
          demo_url: demoUrl || undefined,
        });

        if (created?.id) {
          targetId = created.id;
          if (sections.length > 0) {
            await addModuleChapters(created.id, sections);
          }
        }

        toast.success(
          kind === "project"
            ? "Project berhasil dipublikasikan!"
            : "Modul berhasil dipublikasikan!"
        );
      }

      if (onSuccess && targetId) {
        onSuccess(targetId);
      } else {
        router.push(`/dashboard/modul?mode=${kind}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan konten");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentContainer className="space-y-6 sm:space-y-8 pb-16">
      {/* ─── 1. Header & Navigation ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/modul"
            className="w-9 h-9 rounded-xl bg-surface-secondary hover:bg-surface-tertiary border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight font-display">
              {isEditing
                ? kind === "project"
                  ? "Edit Project"
                  : "Edit Modul"
                : kind === "project"
                ? "Tambah Project Baru"
                : "Tambah Modul Pembelajaran"}
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary">
              {kind === "project"
                ? "Kelola source code, notebook Jupyter, dataset, dan alur implementasi proyek."
                : "Kelola materi silabus, dokumen bahan ajar, dan daftar bab pembelajaran."}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ─── 2. Mode Selector (New Content) ─── */}
        {!isEditing && (
          <ModeSelector
            kind={kind}
            onChangeKind={handleKindSwitch}
            disabled={loading}
          />
        )}

        {/* ─── 3. Basic Information ─── */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/70">
            <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-text-primary">
                Informasi Utama {kind === "project" ? "Proyek" : "Modul"}
              </h3>
              <p className="text-[11px] text-text-secondary">
                Judul kurikulum, deskripsi materi, kategori, dan tingkat kesulitan.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <Input
              label={kind === "project" ? "Nama Project *" : "Judul Modul *"}
              placeholder={
                kind === "project"
                  ? "Contoh: Sistem Prediksi Harga Rumah dengan Random Forest"
                  : "Contoh: Mastering Python: Dari Dasar Hingga OOP"
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />

            {/* Description */}
            <Textarea
              label="Deskripsi Ringkas *"
              placeholder={
                kind === "project"
                  ? "Jelaskan latar belakang, tujuan project, metodologi, dan output yang dihasilkan..."
                  : "Jelaskan cakupan topik, tujuan pembelajaran, dan prasyarat bahan ajar ini..."
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={loading}
            />

            {/* Category Hierarchy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-text-secondary">
                  Kategori Utama
                </label>
                <Select
                  value={parentCategory}
                  onChange={(e) => {
                    setParentCategory(e.target.value);
                    setCategoryId(e.target.value);
                  }}
                  disabled={loading}
                  options={[
                    { value: "", label: "Semua Kategori Utama" },
                    ...parentCategories.map((c) => ({
                      value: c.id,
                      label: c.name,
                    })),
                  ]}
                  placeholder="Pilih Kategori Utama..."
                />
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-text-secondary">
                    Subkategori Spesifik
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickClassify}
                    disabled={autoSorting || loading}
                    className="text-[11px] text-brand-500 hover:text-brand-600 inline-flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-Sortir AI
                  </button>
                </div>
                <Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={loading}
                  options={childCategories.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  placeholder="Pilih Subkategori..."
                />
              </div>
            </div>

            {/* Level & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Tingkat Kesulitan"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                disabled={loading}
                options={Object.entries(MODULE_LEVEL_LABELS).map(([k, v]) => ({
                  value: k,
                  label: v,
                }))}
              />

              <Input
                label="Penulis / Pembuat"
                placeholder="Nama penyusun atau author project"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Thumbnail / Cover */}
            <div className="space-y-2 p-3.5 rounded-xl bg-surface-secondary/40 border border-border">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-brand-500" />
                  <span>Thumbnail / Cover (Opsional)</span>
                </label>
                {coverUrl && (
                  <button
                    type="button"
                    onClick={() => setCoverUrl("")}
                    disabled={loading}
                    className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                  >
                    Hapus Cover
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {coverUrl ? (
                  <div className="w-16 h-12 rounded-lg bg-surface border border-border overflow-hidden shrink-0">
                    <Image
                      src={coverUrl}
                      alt="Cover Pratinjau"
                      width={64}
                      height={48}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-12 rounded-lg bg-surface border border-dashed border-border flex items-center justify-center text-text-tertiary shrink-0">
                    <ImageIcon className="w-5 h-5 opacity-50" />
                  </div>
                )}

                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    loading={coverUploading}
                    onClick={() => coverInputRef.current?.click()}
                    disabled={loading}
                    className="text-xs gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" /> Unggah Gambar
                  </Button>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverSelect}
                    className="hidden"
                  />
                  <Input
                    placeholder="Atau tempel URL gambar..."
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    disabled={loading}
                    className="text-xs flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 4. Project Specific Fields (Conditional) ─── */}
        {kind === "project" && (
          <ProjectFields
            programmingLanguage={programmingLanguage}
            onChangeProgrammingLanguage={setProgrammingLanguage}
            projectType={projectType}
            onChangeProjectType={setProjectType}
            repositoryUrl={repositoryUrl}
            onChangeRepositoryUrl={setRepositoryUrl}
            demoUrl={demoUrl}
            onChangeDemoUrl={setDemoUrl}
            techStackList={techStackList}
            techStackInput={techStackInput}
            onChangeTechStackInput={setTechStackInput}
            onAddTechTag={handleAddTechTag}
            onRemoveTechTag={handleRemoveTechTag}
            disabled={loading}
          />
        )}

        {/* ─── 5. Curriculum / Chapters Section Manager ─── */}
        <CurriculumSectionManager
          kind={kind}
          sections={sections}
          newSectionInput={newSectionInput}
          onChangeNewSectionInput={setNewSectionInput}
          onAddSection={handleAddSection}
          onRemoveSection={handleRemoveSection}
          onApplyDefaultPresets={handleApplyDefaultPresets}
          disabled={loading}
        />

        {/* ─── 6. Attached Files & Drive Manager ─── */}
        <AttachedFilesManager
          kind={kind}
          existingFiles={existingFiles}
          newUploadedFiles={newUploadedFiles}
          onFilesSelect={handleFilesSelect}
          onRemoveNewFile={handleRemoveNewFile}
          onRemoveExistingFile={handleRemoveExistingFile}
          disabled={loading}
        />

        {/* ─── 7. Action Submit Buttons ─── */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/dashboard/modul">
            <Button type="button" variant="outline" disabled={loading} className="cursor-pointer">
              Batal
            </Button>
          </Link>
          <Button type="submit" loading={loading} className="gap-2 px-6 cursor-pointer">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isEditing
                ? kind === "project"
                  ? "Simpan Perubahan Project"
                  : "Simpan Perubahan Modul"
                : kind === "project"
                ? "Simpan Project"
                : "Simpan Modul"}
            </span>
          </Button>
        </div>
      </form>
    </ContentContainer>
  );
}
