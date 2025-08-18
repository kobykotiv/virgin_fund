-- Enable email auth provider for Supabase Auth
-- Run only if auth schema/tables exist (guard against ordering during local reset)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'auth' AND table_name = 'providers'
  ) THEN
    INSERT INTO auth.providers (id, name, enabled)
    VALUES ('email', 'Email', true)
    ON CONFLICT (id) DO UPDATE SET enabled = true;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'auth' AND table_name = 'settings'
  ) THEN
    -- Remove domain restrictions (allow all)
    UPDATE auth.settings SET allowed_email_domains = null;
  END IF;
END$$;
