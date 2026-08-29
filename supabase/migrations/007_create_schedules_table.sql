-- ============================================================
-- Migration 007: Schedules Table and Multi-Tenant RLS
-- Velqora Intelligent Scheduling Engine
-- ============================================================

-- 1. Create Schedules Table
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT DEFAULT '',
  day TEXT NOT NULL, -- 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'
  start_time TEXT, -- '08:00'
  end_time TEXT, -- '10:00'
  time TEXT NOT NULL DEFAULT '--:--', -- '08:00 - 10:00'
  location TEXT DEFAULT '',
  lecturer TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'jadwal', -- 'jadwal', 'reminder', 'classroom'
  priority TEXT NOT NULL DEFAULT 'sedang', -- 'tinggi', 'sedang', 'rendah'
  is_completed BOOLEAN NOT NULL DEFAULT false,
  source TEXT DEFAULT 'manual', -- 'manual', 'imported', 'auto_generated', 'classroom'
  source_file TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Indexes for high performance querying and conflict detection
CREATE INDEX IF NOT EXISTS idx_schedules_user_day ON schedules(user_id, day);
CREATE INDEX IF NOT EXISTS idx_schedules_user_created ON schedules(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_schedules_user_time ON schedules(user_id, day, start_time, end_time);

-- 3. Trigger for auto-updating updated_at
CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Users can only access their own schedules)
DROP POLICY IF EXISTS "Users can view own schedules" ON schedules;
DROP POLICY IF EXISTS "Users can insert own schedules" ON schedules;
DROP POLICY IF EXISTS "Users can update own schedules" ON schedules;
DROP POLICY IF EXISTS "Users can delete own schedules" ON schedules;

CREATE POLICY "Users can view own schedules"
  ON schedules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedules"
  ON schedules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules"
  ON schedules FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules"
  ON schedules FOR DELETE
  USING (auth.uid() = user_id);
