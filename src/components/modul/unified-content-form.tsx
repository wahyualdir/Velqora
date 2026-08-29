"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Sparkles,
  Upload,
  X,
  Code,
  BookOpen,
  Trash2,
  Layers,
  Image as ImageIcon,
  FolderOpen,
  CheckCircle2,
  File,
} from "lucide-react";
import { Card } from "@/components/ui/card";
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
import { formatFileSize } from "@/lib/utils";
import { validateAcademicText } from "@/lib/academic-content-filter";
import { toast } from "sonner";

const COMMON_TECH_SUGGESTIONS = [
  "Python",
  "Jupyter",
  "TypeScript",
  "JavaScript",
  "Next.js",
  "React",
  "Machine Learning",
  "PyTorch",
  "Scikit-Learn",
  "Pandas",
  "FastAPI",
  "SQL",
  "PostgreSQL",
  "Node.js",
  "Docker",
  "Tailwind CSS",
  "C++",
  "Java",
];

const PROGRAMMING_LANGUAGES = [
  { value: "Python", label: "Python" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "SQL", label: "SQL" },
  { value: "C++", label: "C++" },
  { value: "Java", label: "Java" },
  { value: "HTML/CSS", label: "HTML & CSS" },
  { value: "Rust", label: "Rust" },
  { value: "Go", label: "Go (Golang)" },
  { value: "PHP", label: "PHP" },
  { value: "R", label: "R (Statistics)" },
  { value: "Lainnya", label: "Lainnya / Multi-Bahasa" },
];

const PROJECT_TYPES = [
  { value: "Data Science", label: "Data Science & Analisis" },
  { value: "AI / Machine Learning", label: "AI & Machine Learning" },
  { value: "Web Application", label: "Aplikasi Web (Fullstack / Frontend)" },
  { value: "Backend API", label: "Backend API & Microservices" },
  { value: "Mobile App", label: "Aplikasi Mobile" },
  { value: "Desktop App", label: "Aplikasi Desktop" },
  { value: "Automation / Script", label: "Automasi & Scripting" },
  { value: "Academic Research", label: "Riset & Eksperimen Akademik" },
  { value: "Other", label: "Lainnya" },
];

const DEFAULT_MODULE_CHAPTER_PRESETS = [
  "Pengenalan & Konsep Dasar",
  "Sintaks & Struktur Fundamental",
  "Logika Pemrograman & Kondisional",
  "Pengulangan & Struktur Data",
  "Fungsi, Modul, dan Reusable Code",
  "Studi Kasus & Latihan Terapan",
];

const DEFAULT_PROJECT_SECTION_PRESETS = [
  "1. Tujuan & Arsitektur Project",
  "2. Persiapan Data & Lingkungan Kerja",
  "3. Pemrosesan Data & Exploratory Analysis",
  "4. Implementasi Logika / Training Model",
  "5. Pengujian & Evaluasi Hasil",
  "6. Kesimpulan & Panduan Menjalankan Kode",
];

interface UnifiedContentFormProps {
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
  const [authorName, setAuthorName] = useState(
    initialData?.author_name || ""
  );
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
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
          if (!authorName) {
            setAuthorName(
              user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email?.split("@")[0] ||
                "Pengguna"
            );
          }
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

        // Also add any custom user-created categories not in system presets
        list.forEach((dbCat: any) => {
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

          // Find parent category if category has parent_id
          if (initialData.category_id) {
            const foundCat = mergedCategories.find((c: any) => c.id === initialData.category_id);
            if (foundCat && foundCat.parent_id) {
              setParentCategory(foundCat.parent_id);
            }
          }

          // Extract drive metadata from notes
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

          // Extract chapters or sections
          if (initialData.chapters && initialData.chapters.length > 0) {
            setSections(initialData.chapters.map((c) => c.title));
          } else if (drive.sections && drive.sections.length > 0) {
            setSections(drive.sections.map((s) => s.title));
          }
        } else {
          // Initialize default preset sections for new content
          setSections(
            initialKind === "project"
              ? DEFAULT_PROJECT_SECTION_PRESETS
              : DEFAULT_MODULE_CHAPTER_PRESETS
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [initialData, initialKind]);

  // Derived subcategories based on selected parent category
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

  // Section / Chapter management
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

  // Cover Image Upload Handler
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
        // Fallback to data URL
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

  // Multiple File Selection & Directory Upload Handler
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

      // Check validation against current mode (Module vs Project)
      const validation = validateContentFile(f.name, kind);
      if (!validation.isValid) {
        toast.error(validation.reason);
        continue;
      }

      // Preserve relative path if dropped from folder
      const relPath = (f as any).webkitRelativePath || f.name;
      validNewFiles.push({ file: f, relativePath: relPath });
    }

    if (validNewFiles.length > 0) {
      setNewUploadedFiles((prev) => [...prev, ...validNewFiles]);
      toast.success(
        `${validNewFiles.length} berkas ${
          isFolder ? "dari folder " : ""
        }siap diunggah!`
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

  // Quick Auto-Sort NLP
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

  // Form Submit (Create or Update)
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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const effectiveAuthor =
        authorName.trim() ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split("@")[0] ||
        "Pengguna";

      const uploadedDriveFiles: ModuleDriveFile[] = [...existingFiles];

      // 1. Process and upload all new files
      if (newUploadedFiles.length > 0) {
        for (const item of newUploadedFiles) {
          const file = item.file;
          try {
            const catInfo = getFileCategory(file.name);
            const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
            const storagePath = `modules/${user?.id || "guest"}/${Date.now()}_${cleanFileName}`;

            let fileUrl = "";
            let initialTextContent: string | undefined = undefined;

            // Extract text/preview content for code/notebook/csv/markdown
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

      // 2. Format Structured Sections
      const structuredSections: ModuleSection[] = sections
        .filter((s) => s.trim().length > 0)
        .map((title, idx) => ({
          id: `sec_${idx + 1}`,
          title: title.trim(),
          orderIndex: idx + 1,
          isCompleted: false,
        }));

      // 3. Serialize Drive Notes & Metadata
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
        // UPDATE Existing Content
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
        // CREATE New Content
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
          // Seed chapter checklist rows in database if present
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
            className="w-9 h-9 rounded-xl bg-surface-secondary hover:bg-surface-tertiary border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
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

        {/* Mode Switcher (only when creating new) */}
        {!isEditing && (
          <div className="flex p-1 bg-surface-secondary rounded-xl border border-border self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleKindSwitch("module")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                kind === "module"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Modul</span>
            </button>

            <button
              type="button"
              onClick={() => handleKindSwitch("project")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                kind === "project"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Project</span>
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ─── 2. Informasi Dasar (Informasi Utama) ─── */}
        <Card className="p-5 sm:p-6 rounded-2xl bg-surface border-border space-y-4 shadow-sm w-full">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            {kind === "project" ? (
              <Code className="w-4 h-4 text-brand-400" />
            ) : (
              <BookOpen className="w-4 h-4 text-brand-400" />
            )}
            <span>
              Informasi {kind === "project" ? "Project" : "Modul"}
            </span>
          </h3>

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
            />

            {/* Kategori & Subkategori (Hierarchy) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">
                  Kategori Utama
                </label>
                <Select
                  value={parentCategory}
                  onChange={(e) => {
                    setParentCategory(e.target.value);
                    setCategoryId(e.target.value);
                  }}
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

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-text-secondary">
                    Subkategori Spesifik
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickClassify}
                    disabled={autoSorting}
                    className="text-[11px] text-brand-400 hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-Sortir AI
                  </button>
                </div>
                <Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
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
              />
            </div>

            {/* Thumbnail / Cover */}
            <div className="space-y-2 p-4 rounded-xl bg-surface-secondary/40 border border-border">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-brand-400" />
                  <span>Thumbnail / Cover (Opsional)</span>
                </label>
                {coverUrl && (
                  <button
                    type="button"
                    onClick={() => setCoverUrl("")}
                    className="text-[11px] text-danger-400 hover:underline"
                  >
                    Hapus Cover
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {coverUrl ? (
                  <div className="w-16 h-12 rounded-lg bg-surface border border-border overflow-hidden shrink-0">
                    <img
                      src={coverUrl}
                      alt="Cover Pratinjau"
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
                    className="text-xs gap-1.5"
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
                    className="text-xs flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ─── 3. Metadata Khusus Project (Only if kind === "project") ─── */}
        {kind === "project" && (
          <Card className="p-5 sm:p-6 rounded-2xl bg-surface border-border space-y-4 shadow-sm w-full animate-fade-in">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Code className="w-4 h-4 text-purple-400" />
              <span>Metadata & Teknologi Proyek</span>
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Bahasa Pemrograman Utama"
                  value={programmingLanguage}
                  onChange={(e) => setProgrammingLanguage(e.target.value)}
                  options={PROGRAMMING_LANGUAGES}
                />

                <Select
                  label="Tipe Project"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  options={PROJECT_TYPES}
                />
              </div>

              {/* Tech Stack Chips */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary block">
                  Framework & Library (Tech Stack)
                </label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {techStackList.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-500/15 text-brand-400 border border-brand-500/30"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTechTag(t)}
                        className="hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Ketik nama teknologi (contoh: FastAPI, PyTorch, Docker)..."
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTechTag(techStackInput);
                      }
                    }}
                    className="text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddTechTag(techStackInput)}
                    className="text-xs shrink-0"
                  >
                    + Tambah Tag
                  </Button>
                </div>

                {/* Suggestions */}
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <span className="text-[10px] text-text-tertiary mr-1">
                    Rekomendasi:
                  </span>
                  {COMMON_TECH_SUGGESTIONS.slice(0, 8).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddTechTag(s)}
                      className="text-[10px] px-2 py-0.5 rounded bg-surface hover:bg-surface-secondary text-text-tertiary hover:text-text-primary border border-border/80 transition-colors"
                    >
                      +{s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Repositories & Demo Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Input
                  label="GitHub / Git Repository URL"
                  placeholder="https://github.com/username/project-repo"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                />
                <Input
                  label="Live Preview / Demo URL"
                  placeholder="https://demo-project.app"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                />
              </div>
            </div>
          </Card>
        )}

        {/* ─── 4. Struktur Isi Pembelajaran (Chapters / Sections) ─── */}
        <Card className="p-5 sm:p-6 rounded-2xl bg-surface border-border space-y-4 shadow-sm w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-400" />
                <span>
                  {kind === "project"
                    ? "Isi Project (Alur Pembelajaran Proyek)"
                    : "Isi Modul (Daftar Bab Silabus)"}
                </span>
              </h3>
              <p className="text-xs text-text-secondary">
                {kind === "project"
                  ? "Tentukan langkah-langkah pembelajaran project (Tujuan, Dataset, Preprocessing, Model, Evaluasi)."
                  : "Tentukan bab atau silabus pembelajaran modul akademik."}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleApplyDefaultPresets}
              className="text-xs gap-1 self-start sm:self-auto"
            >
              <Sparkles className="w-3 h-3 text-brand-400" /> Gunakan Preset Standar
            </Button>
          </div>

          {/* Section Items List */}
          <div className="space-y-2">
            {sections.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-text-tertiary">
                Belum ada bab/tahap pembelajaran. Tambahkan bab atau gunakan preset standar di atas.
              </div>
            ) : (
              sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-secondary/40 hover:bg-surface-secondary transition-all gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-surface border border-border flex items-center justify-center text-[10px] font-mono font-bold text-text-tertiary shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-text-primary truncate">
                      {sec}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSection(idx)}
                    className="p-1 text-text-tertiary hover:text-danger-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add Section Input */}
          <div className="flex items-center gap-2 pt-2">
            <Input
              placeholder={
                kind === "project"
                  ? "Tambah tahap project (contoh: 4. Hyperparameter Tuning)..."
                  : "Tambah bab modul (contoh: Bab 5: Pemrograman Berorientasi Objek)..."
              }
              value={newSectionInput}
              onChange={(e) => setNewSectionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSection();
                }
              }}
              className="text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSection}
              className="text-xs shrink-0"
            >
              + Tambah Bab / Tahap
            </Button>
          </div>
        </Card>

        {/* ─── 5. Berkas Lampiran (File Modul / Project Files) ─── */}
        <Card className="p-5 sm:p-6 rounded-2xl bg-surface border-border space-y-4 shadow-sm w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                  <Upload className="w-4 h-4 text-brand-400" />
                  <span>
                    {kind === "project"
                      ? `Berkas Proyek & Source Code (${existingFiles.length + newUploadedFiles.length})`
                      : `Berkas Materi Modul (${existingFiles.length + newUploadedFiles.length})`}
                  </span>
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    kind === "project"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                  }`}
                >
                  {kind === "project" ? "MODE PROJECT" : "MODE MODUL"}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {kind === "project"
                  ? "Khusus file kode & proyek: Jupyter Notebook (.ipynb), Python (.py), Web (.tsx/.js/.html), Dataset (.csv/.json), Arsip (.zip/.tar.gz), dsb."
                  : "Khusus dokumen bahan ajar: PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx), E-Book (.epub), dan Teks (.txt)."}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Add Files */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> + Tambah File {kind === "project" ? "Project" : "Dokumen"}
              </Button>

              {/* Upload Folder (for Project mode) */}
              {kind === "project" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => folderInputRef.current?.click()}
                  className="text-xs gap-1.5"
                  title="Unggah seluruh folder project dengan struktur foldernya"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-text-tertiary" /> Folder Project
                </Button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={
                  kind === "project"
                    ? "*/*"
                    : ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.epub,.odt,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,application/epub+zip"
                }
                onChange={(e) => handleFilesSelect(e, false)}
                className="hidden"
              />
              <input
                ref={folderInputRef}
                type="file"
                // @ts-expect-error - webkitdirectory is a non-standard browser attribute
                webkitdirectory=""
                directory=""
                multiple
                onChange={(e) => handleFilesSelect(e, true)}
                className="hidden"
              />
            </div>
          </div>

          {/* Type Guidance Pill Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-text-tertiary mr-1">Format Didukung:</span>
            {kind === "project" ? (
              <>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  🪐 Jupyter (.ipynb)
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  🐍 Python (.py)
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  ⚛️ Web (.tsx / .js / .html)
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  🗄️ Dataset (.csv / .json)
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  📦 Arsip ZIP (.zip / .rar)
                </span>
              </>
            ) : (
              <>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  📄 PDF (.pdf)
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  📝 Word (.docx / .doc)
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  📊 PowerPoint (.pptx / .ppt)
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  📑 Excel (.xlsx / .xls)
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-500/10 text-slate-300 border border-slate-500/20">
                  📖 E-Book & Text (.epub / .txt)
                </span>
              </>
            )}
          </div>

          {/* File Cards (Vertical Stack, No Wide Overflow) */}
          {existingFiles.length === 0 && newUploadedFiles.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-8 rounded-2xl border-2 border-dashed border-border hover:border-brand-500/50 bg-surface-secondary/30 text-center cursor-pointer transition-all space-y-2"
            >
              <Upload className="w-8 h-8 text-text-tertiary mx-auto" />
              <p className="text-xs font-semibold text-text-primary">
                {kind === "project"
                  ? "Klik untuk memilih file source code, notebook Jupyter, atau arsip ZIP project"
                  : "Klik untuk memilih dokumen bahan ajar (PDF, Word, PPT, Excel, TXT)"}
              </p>
              <p className="text-[11px] text-text-tertiary">
                {kind === "project"
                  ? "Mendukung multi-file & folder project. Kode dan notebook otomatis diekstrak pratinjaunya."
                  : "Mendukung upload banyak dokumen sekaligus. Teks materi otomatis diproses ke viewer."}
              </p>
            </div>
          ) : (
            <div className="space-y-2 w-full">
              {/* Existing Stored Files */}
              {existingFiles.map((file) => {
                const info = getFileCategory(file.name);
                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-secondary/60 hover:bg-surface-secondary transition-all gap-3 w-full"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-brand-400 shrink-0 font-mono text-[10px] font-bold uppercase">
                        {file.extension || "FILE"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-text-primary truncate">
                          {file.path || file.name}
                        </p>
                        <p className="text-[10px] text-text-tertiary font-mono">
                          {formatFileSize(file.size)} • {info.label} (Tersimpan)
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveExistingFile(file.id)}
                      className="p-1.5 rounded-lg text-text-tertiary hover:text-danger-400 hover:bg-danger-500/10 transition-colors"
                      title="Hapus berkas ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {/* Newly Uploaded Files */}
              {newUploadedFiles.map((item, idx) => {
                const file = item.file;
                const info = getFileCategory(file.name);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-brand-500/30 bg-brand-500/5 hover:bg-brand-500/10 transition-all gap-3 w-full"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-surface border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0 font-mono text-[10px] font-bold uppercase">
                        {info.extension || "FILE"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-text-primary truncate">
                          {item.relativePath || file.name}
                        </p>
                        <p className="text-[10px] text-text-tertiary font-mono">
                          {formatFileSize(file.size)} • {info.label} (Siap diunggah)
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveNewFile(idx)}
                      className="p-1.5 rounded-lg text-text-tertiary hover:text-danger-400 hover:bg-danger-500/10 transition-colors"
                      title="Batalkan berkas ini"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* ─── 6. Action Submit Buttons ─── */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/dashboard/modul">
            <Button type="button" variant="outline">
              Batal
            </Button>
          </Link>
          <Button type="submit" loading={loading} className="gap-2 px-6">
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
