-- ==========================================
-- Migration 003: User Roles & Owner Management
-- ==========================================

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed System Owner
INSERT INTO user_roles (email, role)
VALUES ('wahyualdiriyanto80@gmail.com', 'owner')
ON CONFLICT (email) DO UPDATE SET role = 'owner';
