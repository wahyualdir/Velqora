"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FolderCode,
  Github,
  Play,
  Save,
  Plus,
  X,
  Code2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { ContentContainer } from "@/components/ui/section";
import { getCategories } from "@/actions/study-actions";
import { createProject, updateProject, ProjectFormData } from "@/actions/study/projects";
import { Project } from "@/types";
import { toast } from "sonner";

interface ProjectFormProps {
  initialData?: Project | null;
  isEditing?: boolean;
}

export function ProjectForm({ initialData, isEditing = false }: ProjectFormProps) {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [level, setLevel] = useState<"pemula" | "menengah" | "lanjutan">(
    (initialData?.level as any) || "pemula"
  );
  const [repositoryUrl, setRepositoryUrl] = useState(initialData?.repository_url || "");
  const [demoUrl, setDemoUrl] = useState(initialData?.demo_url || "");
  const [authorName, setAuthorName] = useState(initialData?.author_name || "");
  const [notes, setNotes] = useState(initialData?.notes || "");

  // Tech Stack state
  const [techStack, setTechStack] = useState<string[]>(
    initialData?.tech_stack && initialData.tech_stack.length > 0
      ? initialData.tech_stack
      : ["Python"]
  );
  const [newTechInput, setNewTechInput] = useState("");

  // Categories
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await getCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error("Gagal memuat kategori:", err);
      }
    }
    loadCategories();
  }, []);

  const handleAddTech = () => {
    const trimmed = newTechInput.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack([...techStack, trimmed]);
      setNewTechInput("");
    }
  };

  const handleRemoveTech = (indexToRemove: number) => {
    setTechStack(techStack.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Judul proyek wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const payload: ProjectFormData = {
        title: title.trim(),
        description: description.trim(),
        category_id: categoryId || undefined,
        level,
        repository_url: repositoryUrl.trim() || undefined,
        demo_url: demoUrl.trim() || undefined,
        tech_stack: techStack,
        author_name: authorName.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      if (isEditing && initialData) {
        const res = await updateProject(initialData.id, payload);
        if (!res.success) throw new Error(res.error || "Gagal memperbarui proyek.");
        toast.success("Proyek berhasil diperbarui!");
        router.push(`/dashboard/project`);
      } else {
        const res = await createProject(payload);
        if (!res.success) throw new Error(res.error || "Gagal menambahkan proyek.");
        toast.success("Proyek baru berhasil disimpan!");
        router.push(`/dashboard/project`);
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat menyimpan proyek.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentContainer className="max-w-4xl py-6 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/dashboard/project"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-text-tertiary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Repositori Project</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary font-display flex items-center gap-2">
          <FolderCode className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          <span>{isEditing ? "Edit Repositori Project" : "Tambah Repositori Project Baru"}</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Kelola entitas portofolio proyek, source code, dependensi teknologi, serta tautan repositori secara mandiri.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-5 sm:p-6 rounded-xl border border-border/80 bg-surface space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-text-secondary border-b border-border/60 pb-2">
            Informasi Dasar Proyek
          </h2>

          {/* Title */}
          <div>
            <label className="block text-xs font-mono font-bold text-text-primary mb-1.5">
              Judul Proyek <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Weather Prediction ML Pipeline & API"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono font-bold text-text-primary mb-1.5">
              Deskripsi Singkat
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan gambaran umum, latar belakang masalah, dan hasil luaran proyek..."
              rows={3}
            />
          </div>

          {/* Category & Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-text-primary mb-1.5">
                Kategori Proyek
              </label>
              <Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-text-primary mb-1.5">
                Tingkat Kesulitan
              </label>
              <Select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
              >
                <option value="pemula">Pemula (Beginner)</option>
                <option value="menengah">Menengah (Intermediate)</option>
                <option value="lanjutan">Lanjutan (Advanced)</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Repositories & Tech Stack */}
        <div className="p-5 sm:p-6 rounded-xl border border-border/80 bg-surface space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-text-secondary border-b border-border/60 pb-2">
            Tautan Kode & Stack Teknologi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Repository URL */}
            <div>
              <label className="block text-xs font-mono font-bold text-text-primary mb-1.5 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-text-tertiary" />
                <span>URL Repositori GitHub / GitLab</span>
              </label>
              <Input
                type="url"
                value={repositoryUrl}
                onChange={(e) => setRepositoryUrl(e.target.value)}
                placeholder="https://github.com/username/project-repo"
              />
            </div>

            {/* Live Demo URL */}
            <div>
              <label className="block text-xs font-mono font-bold text-text-primary mb-1.5 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-emerald-500" />
                <span>URL Live Demo / Aplikasi Berjalan</span>
              </label>
              <Input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://my-project-demo.vercel.app"
              />
            </div>
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-xs font-mono font-bold text-text-primary mb-1.5">
              Nama Pengembang / Kontributor
            </label>
            <Input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Contoh: Wahyu Aldi Riyanto / Tim AI"
            />
          </div>

          {/* Tech Stack Chips */}
          <div>
            <label className="block text-xs font-mono font-bold text-text-primary mb-1.5 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-brand-500" />
              <span>Stack Teknologi Digunakan</span>
            </label>
            <div className="flex items-center gap-2 mb-2">
              <Input
                type="text"
                value={newTechInput}
                onChange={(e) => setNewTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
                placeholder="Ketik teknologi (e.g. PyTorch, Next.js, Scikit-Learn) lalu tekan Tambah"
                className="max-w-md"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTech}
                className="text-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Tambah
              </Button>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap min-h-8">
              {techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-surface-secondary border border-border flex items-center gap-1.5"
                >
                  <span>#{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(idx)}
                    className="text-text-tertiary hover:text-rose-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Documentation / README Notes */}
        <div className="p-5 sm:p-6 rounded-xl border border-border/80 bg-surface space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-text-secondary border-b border-border/60 pb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-brand-500" />
            <span>Dokumentasi README (Markdown)</span>
          </h2>

          <p className="text-xs text-text-tertiary">
            Anda dapat menuliskan langkah instalasi, panduan menjalankan proyek, arsitektur data, atau dokumentasi endpoint.
          </p>

          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={`# Judul Proyek\n\n## 🚀 Panduan Instalasi\n\`\`\`bash\npip install -r requirements.txt\npython main.py\n\`\`\``}
            rows={10}
            className="font-mono text-xs"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/project")}
            disabled={loading}
          >
            Batal
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="gap-2 bg-brand-600 hover:bg-brand-700 text-white"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Menyimpan..." : isEditing ? "Perbarui Proyek" : "Simpan Proyek"}</span>
          </Button>
        </div>
      </form>
    </ContentContainer>
  );
}
