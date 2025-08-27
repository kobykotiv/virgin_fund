-- Migration: add backtests, watchlists, alert_rules, strategies, alert_events, api_keys tables

-- backtests
CREATE TABLE IF NOT EXISTS backtests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text,
  description text,
  parameters jsonb,
  results jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- watchlists
CREATE TABLE IF NOT EXISTS watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  assets jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- alert_rules
CREATE TABLE IF NOT EXISTS alert_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  watchlist_id uuid,
  symbol text NOT NULL,
  source text NOT NULL,
  condition text NOT NULL,
  threshold numeric NOT NULL,
  delivery jsonb DEFAULT '{}'::jsonb,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- strategies
CREATE TABLE IF NOT EXISTS strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  params jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- alert_events (for storing triggered alerts)
CREATE TABLE IF NOT EXISTS alert_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  watchlist_id uuid,
  symbol text,
  condition text,
  threshold numeric,
  price numeric,
  triggered_at timestamptz DEFAULT now(),
  meta jsonb DEFAULT '{}'::jsonb
);

-- api_keys (for storing provider API keys)
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  provider text NOT NULL,
  key text NOT NULL,
  secret text NOT NULL,
  meta jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  is_paper boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- basic indexes
CREATE INDEX IF NOT EXISTS idx_backtests_user ON backtests(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_user ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_rules_watchlist ON alert_rules(watchlist_id);
CREATE INDEX IF NOT EXISTS idx_alert_events_user ON alert_events(user_id);

COMMENT ON TABLE backtests IS 'Backtest run records persisted from UI or server-side runs';
