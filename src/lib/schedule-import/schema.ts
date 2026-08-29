import { z } from "zod";

export const rawScheduleItemSchema = z.object({
  title: z.string().min(1, "Nama kegiatan/mata kuliah wajib diisi").max(250),
  subject: z.string().max(200).optional().default(""),
  day: z.string().optional().default("Senin"),
  date: z.string().optional().default(""),
  startTime: z.string().optional().default(""),
  endTime: z.string().optional().default(""),
  time: z.string().optional().default(""),
  location: z.string().max(200).optional().default(""),
  instructor: z.string().max(200).optional().default(""),
  lecturer: z.string().max(200).optional().default(""),
  description: z.string().max(1000).optional().default(""),
  category: z.string().max(100).optional().default(""),
  priority: z.enum(["tinggi", "sedang", "rendah"]).optional().default("sedang"),
  type: z.enum(["jadwal", "reminder"]).optional().default("jadwal"),
  sourceText: z.string().optional().default(""),
  sourceTrace: z.string().optional().default(""),
});

export const aiStructuringOutputSchema = z.object({
  items: z.array(rawScheduleItemSchema).default([]),
  documentSummary: z.string().optional(),
  detectedSemester: z.string().optional(),
  detectedInstitution: z.string().optional(),
});

export const scheduleBatchSaveItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Nama kegiatan wajib diisi").max(250),
  subject: z.string().max(200).optional().default(""),
  day: z.enum(["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]),
  start_time: z.string().nullable().optional(),
  end_time: z.string().nullable().optional(),
  time: z.string().min(1, "Waktu kegiatan wajib diisi"),
  location: z.string().max(200).optional().default(""),
  lecturer: z.string().max(200).optional().default(""),
  type: z.enum(["jadwal", "reminder", "classroom"]).default("jadwal"),
  priority: z.enum(["tinggi", "sedang", "rendah"]).default("sedang"),
  is_completed: z.boolean().default(false),
  source: z.enum(["manual", "imported", "auto_generated", "classroom"]).default("imported"),
  source_file: z.string().nullable().optional(),
});

export const scheduleBatchSaveRequestSchema = z.object({
  items: z.array(scheduleBatchSaveItemSchema).min(1, "Pilih minimal 1 agenda untuk disimpan"),
});

export type RawScheduleItemInput = z.input<typeof rawScheduleItemSchema>;
export type RawScheduleItemOutput = z.infer<typeof rawScheduleItemSchema>;
export type AIStructuringOutput = z.infer<typeof aiStructuringOutputSchema>;
export type ScheduleBatchSaveItem = z.infer<typeof scheduleBatchSaveItemSchema>;
export type ScheduleBatchSaveRequest = z.infer<typeof scheduleBatchSaveRequestSchema>;

