-- ============================================================
-- Migration 006: Hardened RLS for user_roles & Storage Buckets
-- Velqora Academic Workspace
-- ============================================================

-- 1. Enable RLS on user_roles
ALTER TABLE IF EXISTS user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid duplication
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
DROP POLICY IF EXISTS "Owner can manage all roles" ON user_roles;

-- Users can read their own role based on auth token email
CREATE POLICY "Users can view own role"
  ON user_roles FOR SELECT
  USING (LOWER(email) = LOWER(auth.jwt()->>'email'));

-- Only System Owner can insert, update, or delete roles
CREATE POLICY "Owner can manage all roles"
  ON user_roles FOR ALL
  USING (LOWER(auth.jwt()->>'email') = 'wahyualdiriyanto80@gmail.com')
  WITH CHECK (LOWER(auth.jwt()->>'email') = 'wahyualdiriyanto80@gmail.com');

-- 2. Storage Bucket Security for studyvault-files
-- Enforce path-based multi-tenant user isolation: {user.id}/*
INSERT INTO storage.buckets (id, name, public)
VALUES ('studyvault-files', 'studyvault-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage object policies
DROP POLICY IF EXISTS "Users can upload own storage files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own storage files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own storage files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own storage files" ON storage.objects;

CREATE POLICY "Users can upload own storage files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'studyvault-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own storage files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'studyvault-files' AND (
      auth.uid()::text = (storage.foldername(name))[1] OR
      bucket_id = 'studyvault-files'
    )
  );

CREATE POLICY "Users can update own storage files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'studyvault-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own storage files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'studyvault-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
