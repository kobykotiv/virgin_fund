-- Migration: add watchlists and alerts tables
-- Date: 2025-08-24
-- Purpose: store user watchlists and alert definitions for in-app notifications, email, or webhooks

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Watchlists
CREATE TABLE IF NOT EXISTS public.watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_public boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON public.watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_created_at ON public.watchlists(created_at);

-- Alerts
CREATE TABLE IF NOT EXISTS public.alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  watchlist_id uuid REFERENCES public.watchlists(id),
  name text,
  condition jsonb NOT NULL,
  method text NOT NULL DEFAULT 'in_app',
  payload jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  last_triggered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_watchlist_id ON public.alerts(watchlist_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON public.alerts(created_at);

-- set_updated_at helper and triggers
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_updated_at_watchlists ON public.watchlists;
CREATE TRIGGER trg_set_updated_at_watchlists
  BEFORE UPDATE ON public.watchlists
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();

DROP TRIGGER IF EXISTS trg_set_updated_at_alerts ON public.alerts;
CREATE TRIGGER trg_set_updated_at_alerts
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();

-- Notifications: records generated when alerts trigger or system events occur
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid REFERENCES public.alerts(id),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  payload jsonb DEFAULT '{}'::jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_alert_id ON public.notifications(alert_id);
