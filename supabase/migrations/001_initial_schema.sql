-- ==========================================
-- StudyVault — Database Schema
-- Jalankan SQL ini di Supabase SQL Editor
-- ==========================================

-- 1. Tabel Profiles (otomatis terkait auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel Tags
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, name)
);

-- 4. Tabel Materials
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subject TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'lainnya',
  status TEXT NOT NULL DEFAULT 'draft',
  file_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  file_type TEXT,
  external_url TEXT,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabel Material Tags (many-to-many)
CREATE TABLE IF NOT EXISTS material_tags (
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (material_id, tag_id)
);

-- 6. Tabel Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT DEFAULT '',
  lecturer TEXT DEFAULT '',
  description TEXT DEFAULT '',
  deadline TIMESTAMPTZ,
  priority TEXT NOT NULL DEFAULT 'sedang',
  status TEXT NOT NULL DEFAULT 'belum_dikerjakan',
  file_url TEXT,
  file_name TEXT,
  external_url TEXT,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Tabel Modules
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  level TEXT NOT NULL DEFAULT 'pemula',
  progress INTEGER DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Tabel Module Chapters
CREATE TABLE IF NOT EXISTS module_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Tabel Files
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  size BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT '',
  material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Tabel Recent Views
CREATE TABLE IF NOT EXISTS recent_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, material_id)
);

-- ==========================================
-- Trigger: Auto-update updated_at
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk setiap tabel yang punya updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- Trigger: Auto-create profile on signup
-- ==========================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ==========================================
-- Row Level Security (RLS)
-- User hanya bisa akses datanya sendiri
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_views ENABLE ROW LEVEL SECURITY;

-- Profiles: user hanya bisa lihat & edit profile sendiri
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Categories
CREATE POLICY "Users can view own categories" ON categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own categories" ON categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON categories FOR DELETE USING (auth.uid() = user_id);

-- Tags
CREATE POLICY "Users can view own tags" ON tags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tags" ON tags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tags" ON tags FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tags" ON tags FOR DELETE USING (auth.uid() = user_id);

-- Materials
CREATE POLICY "Users can view own materials" ON materials FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own materials" ON materials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own materials" ON materials FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own materials" ON materials FOR DELETE USING (auth.uid() = user_id);

-- Material Tags (akses via material ownership)
CREATE POLICY "Users can view own material_tags" ON material_tags FOR SELECT
  USING (EXISTS (SELECT 1 FROM materials WHERE materials.id = material_tags.material_id AND materials.user_id = auth.uid()));
CREATE POLICY "Users can insert own material_tags" ON material_tags FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM materials WHERE materials.id = material_tags.material_id AND materials.user_id = auth.uid()));
CREATE POLICY "Users can delete own material_tags" ON material_tags FOR DELETE
  USING (EXISTS (SELECT 1 FROM materials WHERE materials.id = material_tags.material_id AND materials.user_id = auth.uid()));

-- Tasks
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- Modules
CREATE POLICY "Users can view own modules" ON modules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own modules" ON modules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own modules" ON modules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own modules" ON modules FOR DELETE USING (auth.uid() = user_id);

-- Module Chapters (akses via module ownership)
CREATE POLICY "Users can view own module_chapters" ON module_chapters FOR SELECT
  USING (EXISTS (SELECT 1 FROM modules WHERE modules.id = module_chapters.module_id AND modules.user_id = auth.uid()));
CREATE POLICY "Users can insert own module_chapters" ON module_chapters FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM modules WHERE modules.id = module_chapters.module_id AND modules.user_id = auth.uid()));
CREATE POLICY "Users can update own module_chapters" ON module_chapters FOR UPDATE
  USING (EXISTS (SELECT 1 FROM modules WHERE modules.id = module_chapters.module_id AND modules.user_id = auth.uid()));
CREATE POLICY "Users can delete own module_chapters" ON module_chapters FOR DELETE
  USING (EXISTS (SELECT 1 FROM modules WHERE modules.id = module_chapters.module_id AND modules.user_id = auth.uid()));

-- Files
CREATE POLICY "Users can view own files" ON files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own files" ON files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own files" ON files FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own files" ON files FOR DELETE USING (auth.uid() = user_id);

-- Recent Views
CREATE POLICY "Users can view own recent_views" ON recent_views FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recent_views" ON recent_views FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own recent_views" ON recent_views FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- Indexes untuk performa
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_materials_user_id ON materials(user_id);
CREATE INDEX IF NOT EXISTS idx_materials_category_id ON materials(category_id);
CREATE INDEX IF NOT EXISTS idx_materials_type ON materials(type);
CREATE INDEX IF NOT EXISTS idx_materials_status ON materials(status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
CREATE INDEX IF NOT EXISTS idx_modules_user_id ON modules(user_id);
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_recent_views_user_id ON recent_views(user_id);
CREATE INDEX IF NOT EXISTS idx_module_chapters_module_id ON module_chapters(module_id);
