// Tipe data untuk database StudyVault

export type MaterialType =
  | "tugas"
  | "modul"
  | "materi_kuliah"
  | "catatan"
  | "project"
  | "notebook"
  | "source_code"
  | "referensi"
  | "lainnya";

export type MaterialStatus = "draft" | "selesai" | "arsip";

export type TaskStatus = "belum_dikerjakan" | "sedang_dikerjakan" | "selesai";

export type TaskPriority = "rendah" | "sedang" | "tinggi";

export type ModuleLevel = "pemula" | "menengah" | "lanjutan";

// Label untuk ditampilkan di UI
export const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
  tugas: "Tugas",
  modul: "Modul",
  materi_kuliah: "Materi Kuliah",
  catatan: "Catatan",
  project: "Project",
  notebook: "Notebook",
  source_code: "Source Code",
  referensi: "Referensi",
  lainnya: "Lainnya",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  belum_dikerjakan: "Belum Dikerjakan",
  sedang_dikerjakan: "Sedang Dikerjakan",
  selesai: "Selesai",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  rendah: "Rendah",
  sedang: "Sedang",
  tinggi: "Tinggi",
};

export const MODULE_LEVEL_LABELS: Record<ModuleLevel, string> = {
  pemula: "Pemula",
  menengah: "Menengah",
  lanjutan: "Lanjutan",
};

// Database row types
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon?: string | null;
  parent_id?: string | null;
  created_at: string;
  parent?: Category | null;
  subcategories?: Category[];
}


export interface Tag {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Material {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  subject: string | null;
  type: MaterialType;
  status: MaterialStatus;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  external_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  category?: Category | null;
  tags?: Tag[];
}

export interface MaterialTag {
  material_id: string;
  tag_id: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  subject: string | null;
  lecturer: string | null;
  description: string | null;
  deadline: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  file_url: string | null;
  file_name: string | null;
  external_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ContentKind = "module" | "project";

export interface Module {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  level: ModuleLevel;
  progress: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Extended Project / Modul attributes
  kind?: ContentKind;
  content_type?: ContentKind;
  tech_stack?: string[];
  repository_url?: string | null;
  demo_url?: string | null;
  author_name?: string | null;
  // Joined data
  category?: Category | null;
  chapters?: ModuleChapter[];
}

export interface ModuleChapter {
  id: string;
  module_id: string;
  title: string;
  order_index: number;
  is_completed: boolean;
  created_at: string;
}

export interface FileRecord {
  id: string;
  user_id: string;
  name: string;
  storage_path: string;
  url: string;
  size: number;
  mime_type: string;
  material_id: string | null;
  task_id: string | null;
  created_at: string;
}

export interface RecentView {
  id: string;
  user_id: string;
  material_id: string;
  viewed_at: string;
  // Joined
  material?: Material;
}

export type ScheduleDay =
  | "Senin"
  | "Selasa"
  | "Rabu"
  | "Kamis"
  | "Jumat"
  | "Sabtu"
  | "Minggu";

export type ScheduleType = "jadwal" | "reminder" | "classroom";
export type SchedulePriority = "tinggi" | "sedang" | "rendah";

export interface ScheduleItem {
  id: string;
  user_id?: string;
  title: string;
  subject?: string;
  day: ScheduleDay | string;
  start_time?: string | null;
  end_time?: string | null;
  time: string;
  location?: string;
  lecturer?: string;
  type: ScheduleType;
  priority: SchedulePriority;
  is_completed?: boolean;
  isCompleted?: boolean;
  source?: "manual" | "imported" | "auto_generated" | "classroom";
  source_file?: string | null;
  classroomUrl?: string;
  created_at?: string;
  updated_at?: string;
}

export * from "./schedule";

