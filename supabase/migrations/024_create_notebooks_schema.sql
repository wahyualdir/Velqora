-- ============================================================
-- Migration 024: Velqora Computational Notebook ("Colab++")
-- Menambahkan tabel notebooks, notebook_versions (Time-Travel),
-- dan notebook_datasets secara aditif tanpa mengubah tabel core.
-- ============================================================

CREATE TABLE IF NOT EXISTS notebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Notebook Tanpa Judul',
  description TEXT,
  default_kernel TEXT NOT NULL DEFAULT 'python' CHECK (
    default_kernel IN ('python', 'sql', 'javascript', 'typescript')
  ),
  runtime_mode TEXT NOT NULL DEFAULT 'wasm' CHECK (
    runtime_mode IN ('wasm', 'remote_ws')
  ),
  source_topic_id TEXT,
  source_chapter_id TEXT,
  source_subchapter_id TEXT,
  source_code_id TEXT,
  cells_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  reactive_mode BOOLEAN NOT NULL DEFAULT FALSE,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  share_slug TEXT UNIQUE,
  last_executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notebooks_user_updated
  ON notebooks(user_id, updated_at DESC)
  WHERE is_archived = FALSE;

CREATE INDEX IF NOT EXISTS idx_notebooks_share_slug
  ON notebooks(share_slug)
  WHERE is_public = TRUE;

CREATE TABLE IF NOT EXISTS notebook_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notebook_id UUID NOT NULL REFERENCES notebooks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Autosave Checkpoint',
  cells_snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notebook_versions_nb_created
  ON notebook_versions(notebook_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notebook_versions_user_id
  ON notebook_versions(user_id);

CREATE TABLE IF NOT EXISTS notebook_datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notebook_id UUID NOT NULL REFERENCES notebooks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  columns_json JSONB DEFAULT '[]'::jsonb,
  row_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notebook_datasets_nb
  ON notebook_datasets(notebook_id);

CREATE INDEX IF NOT EXISTS idx_notebook_datasets_user_id
  ON notebook_datasets(user_id);

-- Explicit Data API privileges (alongside strict RLS below)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE notebooks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE notebook_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE notebook_datasets TO authenticated;
GRANT SELECT ON TABLE notebooks TO anon;

-- RLS Policies (scoped TO role with cached (SELECT auth.uid()) initplan)
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebook_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebook_datasets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own notebooks" ON notebooks;
CREATE POLICY "Users manage own notebooks"
  ON notebooks FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Public notebooks readable by authenticated or anon" ON notebooks;
CREATE POLICY "Public notebooks readable by authenticated or anon"
  ON notebooks FOR SELECT
  TO anon, authenticated
  USING (is_public = TRUE AND is_archived = FALSE);

DROP POLICY IF EXISTS "Users manage own notebook versions" ON notebook_versions;
CREATE POLICY "Users manage own notebook versions"
  ON notebook_versions FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users manage own notebook datasets" ON notebook_datasets;
CREATE POLICY "Users manage own notebook datasets"
  ON notebook_datasets FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);
