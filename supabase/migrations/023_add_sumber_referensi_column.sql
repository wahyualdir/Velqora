-- ============================================================
-- Migration 023: Add sumber_referensi Column
-- Menambahkan kolom sumber_referensi pada modules, module_chapters,
-- dan notes untuk menyimpan daftar rujukan kanonikal terverifikasi.
-- Bersifat non-destruktif dan idempotent.
-- ============================================================

-- 1. Tabel modules
ALTER TABLE IF EXISTS public.modules 
ADD COLUMN IF NOT EXISTS sumber_referensi JSONB DEFAULT '[]'::jsonb;

-- 2. Tabel module_chapters
ALTER TABLE IF EXISTS public.module_chapters 
ADD COLUMN IF NOT EXISTS sumber_referensi JSONB DEFAULT '[]'::jsonb;

-- 3. Tabel notes
ALTER TABLE IF EXISTS public.notes 
ADD COLUMN IF NOT EXISTS sumber_referensi JSONB DEFAULT '[]'::jsonb;

-- Komentar dokumentasi kolom
COMMENT ON COLUMN public.modules.sumber_referensi IS 'Daftar URL dan metadata rujukan kanonikal terverifikasi untuk modul pembelajaran.';
COMMENT ON COLUMN public.module_chapters.sumber_referensi IS 'Daftar rujukan kanonikal spesifik untuk bab modul.';
COMMENT ON COLUMN public.notes.sumber_referensi IS 'Daftar rujukan terverifikasi yang ditampilkan sebagai tautan Baca Sumber Asli di UI modul.';
