-- Migration: create users table with role flags and RLS policies

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  bio text,
  role text DEFAULT 'free'::text,
  is_demo boolean DEFAULT false,
  preferences jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Allow authenticated users to insert their profile via RPC or server-side only (service role should insert)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: allow users to select their own record
CREATE POLICY "Users can select own data" ON public.users
  FOR SELECT USING (auth.uid() = id OR auth.role() = 'service_role');

-- Policy: allow users to update their profile fields only for themselves
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: restrict insert to service role (server-side) or admin
CREATE POLICY "Insert by service or admin" ON public.users
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'admin');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
