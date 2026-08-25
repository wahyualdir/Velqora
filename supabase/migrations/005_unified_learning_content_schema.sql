-- ============================================================
-- Migration 005: Unified Learning Content (Module & Project)
-- Menjadikan Modul dan Project sebagai dua content_type dalam
-- satu sistem taksonomi kategori pembelajaran bersama.
-- ============================================================

-- 1. Tambahkan kolom pendukung tipe konten pada tabel modules
ALTER TABLE modules
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'module',
ADD COLUMN IF NOT EXISTS tech_stack TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS repository_url TEXT,
ADD COLUMN IF NOT EXISTS demo_url TEXT,
ADD COLUMN IF NOT EXISTS author_name TEXT;

-- 2. Index untuk query performa tinggi berdasarkan tipe konten & kategori
CREATE INDEX IF NOT EXISTS idx_modules_content_type ON modules(content_type);
CREATE INDEX IF NOT EXISTS idx_modules_category_content_type ON modules(category_id, content_type);

-- 3. Update data lama jika belum memiliki content_type
UPDATE modules
SET content_type = 'module'
WHERE content_type IS NULL;
