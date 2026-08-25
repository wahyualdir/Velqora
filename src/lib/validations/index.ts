import { z } from "zod";

// Schema untuk login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter"),
});

// Schema untuk materi
export const materialSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(200, "Judul terlalu panjang"),
  description: z.string().optional(),
  category_id: z.string().optional(),
  subject: z.string().optional(),
  type: z.enum([
    "tugas", "modul", "materi_kuliah", "catatan", "project",
    "notebook", "source_code", "referensi", "lainnya",
  ]),
  status: z.enum(["draft", "selesai", "arsip"]).optional().default("draft"),
  external_url: z.string().url("URL tidak valid").optional().or(z.literal("")),
  notes: z.string().optional(),
  tag_ids: z.array(z.string()).optional().default([]),
});

// Schema untuk tugas
export const taskSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(200, "Judul terlalu panjang"),
  subject: z.string().optional(),
  lecturer: z.string().optional(),
  description: z.string().optional(),
  deadline: z.string().optional(),
  priority: z.enum(["rendah", "sedang", "tinggi"]).optional().default("sedang"),
  status: z.enum(["belum_dikerjakan", "sedang_dikerjakan", "selesai"]).optional().default("belum_dikerjakan"),
  external_url: z.string().url("URL tidak valid").optional().or(z.literal("")),
  notes: z.string().optional(),
});

// Schema untuk modul & project
export const moduleSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(200, "Judul terlalu panjang"),
  description: z.string().optional(),
  category_id: z.string().optional(),
  level: z.enum(["pemula", "menengah", "lanjutan"]).optional(),
  notes: z.string().optional(),
  kind: z.enum(["module", "project"]).optional(),
  tech_stack: z.array(z.string()).optional(),
  repository_url: z.string().optional(),
  demo_url: z.string().optional(),
});

// Schema untuk chapter modul
export const chapterSchema = z.object({
  title: z.string().min(1, "Judul bab wajib diisi").max(200, "Judul terlalu panjang"),
});

// Schema untuk kategori
export const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi").max(50, "Nama terlalu panjang"),
  color: z.string().default("#3b82f6"),
  parent_id: z.string().nullable().optional(),
  icon: z.string().nullable().optional().default("code"),
});


// Schema untuk tag
export const tagSchema = z.object({
  name: z
    .string()
    .min(1, "Nama tag wajib diisi")
    .max(30, "Nama tag terlalu panjang")
    .transform((val) => val.toLowerCase().replace(/\s+/g, "-")),
});

// Types dari schema
export type LoginFormData = z.infer<typeof loginSchema>;
export type MaterialFormData = z.infer<typeof materialSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
export type ModuleFormData = z.infer<typeof moduleSchema>;
export type ChapterFormData = z.infer<typeof chapterSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type TagFormData = z.infer<typeof tagSchema>;
