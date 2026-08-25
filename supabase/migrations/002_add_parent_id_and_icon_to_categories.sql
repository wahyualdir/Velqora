-- ==========================================
-- Migration 002: Add parent_id and icon to categories
-- ==========================================

ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'code';
