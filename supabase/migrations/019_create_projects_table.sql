-- ============================================================
-- Migration 019: Separate Projects Table & Entity
-- Memisahkan entitas Project dari tabel modules menjadi tabel mandiri.
-- ============================================================

-- 1. Buat tabel projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  level TEXT NOT NULL DEFAULT 'pemula',
  repository_url TEXT,
  demo_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  author_name TEXT,
  cover_url TEXT,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Index untuk performa query pencarian dan kategori
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_category_id ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_level ON public.projects(level);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- 3. Trigger auto-update updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Projects viewable by everyone" ON public.projects;
CREATE POLICY "Projects viewable by everyone"
  ON public.projects FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Projects insertable by authenticated users" ON public.projects;
CREATE POLICY "Projects insertable by authenticated users"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Projects updatable by author or admin" ON public.projects;
CREATE POLICY "Projects updatable by author or admin"
  ON public.projects FOR UPDATE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('admin', 'owner')
    )
  );

DROP POLICY IF EXISTS "Projects deletable by author or admin" ON public.projects;
CREATE POLICY "Projects deletable by author or admin"
  ON public.projects FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('admin', 'owner')
    )
  );

-- 6. Migrasi data yang bertipe 'project' dari tabel modules ke tabel projects (jika ada)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'modules' AND column_name = 'content_type'
  ) THEN
    INSERT INTO public.projects (
      id,
      user_id,
      title,
      description,
      category_id,
      level,
      repository_url,
      demo_url,
      tech_stack,
      author_name,
      notes,
      created_at,
      updated_at
    )
    SELECT
      m.id,
      m.user_id,
      m.title,
      COALESCE(m.description, ''),
      m.category_id,
      COALESCE(m.level, 'pemula'),
      m.repository_url,
      m.demo_url,
      COALESCE(m.tech_stack, '{}'),
      m.author_name,
      COALESCE(m.notes, ''),
      m.created_at,
      m.updated_at
    FROM public.modules m
    WHERE m.content_type = 'project'
    ON CONFLICT (id) DO NOTHING;

    -- Bersihkan data project dari tabel modules agar modules murni berisi modul pembelajaran
    DELETE FROM public.modules WHERE content_type = 'project';
  END IF;
END $$;
