-- Moved from 20250814_add_performance_to_bots.sql
-- Add performance column to bots if the table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'bots'
  ) THEN
    -- Only add column if table exists (and column not present)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'bots' AND column_name = 'performance'
    ) THEN
      ALTER TABLE public.bots ADD COLUMN performance numeric DEFAULT 0;
    END IF;
  END IF;
END$$;
