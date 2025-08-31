-- Migration: create bots and trades tables + RLS policies

-- Bots table
CREATE TABLE IF NOT EXISTS public.bots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  name text,
  type text,
  status text DEFAULT 'paused',
  config jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;

-- Policy: users can select their own bots
CREATE POLICY "Bots: users can select own bots" ON public.bots
  FOR SELECT USING (auth.uid() = user_id::text OR auth.role() = 'service_role');

-- Policy: users can insert bots (server/service role recommended)
CREATE POLICY "Bots: insert by service or owner" ON public.bots
  FOR INSERT USING (auth.role() = 'service_role' OR auth.uid() = user_id::text)
  WITH CHECK (auth.role() = 'service_role' OR auth.uid() = user_id::text);

-- Policy: users can update their own bots
CREATE POLICY "Bots: users can update own bots" ON public.bots
  FOR UPDATE USING (auth.uid() = user_id::text)
  WITH CHECK (auth.uid() = user_id::text);

-- Trades table
CREATE TABLE IF NOT EXISTS public.trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id uuid REFERENCES public.bots(id) ON DELETE CASCADE,
  executed_at timestamptz DEFAULT now(),
  symbol text,
  qty numeric,
  price numeric,
  side text,
  raw jsonb
);

ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- Policy: allow selecting trades if user owns the bot
CREATE POLICY "Trades: select if bot owner" ON public.trades
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bots b WHERE b.id = bot_id AND (auth.uid() = b.user_id::text OR auth.role() = 'service_role')
    )
  );

-- Policy: inserts by service role only (server recorded)
CREATE POLICY "Trades: insert by service role" ON public.trades
  FOR INSERT USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Triggers to update updated_at for bots
CREATE OR REPLACE FUNCTION public.set_updated_at_bots()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_bots_updated_at ON public.bots;
CREATE TRIGGER trg_bots_updated_at
BEFORE UPDATE ON public.bots
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_bots();
