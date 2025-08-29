-- Refactor schema to be bot-centered: bots -> positions[] -> orders[] -> trades[]
-- This migration restructures the portfolio system to be comprehensive and bot-focused

-- Drop existing foreign key constraints that will be changed
ALTER TABLE "public"."positions" DROP CONSTRAINT IF EXISTS "positions_portfolio_id_fkey";
ALTER TABLE "public"."trades" DROP CONSTRAINT IF EXISTS "trades_position_id_fkey";

-- Drop portfolios table as we're moving to bot-centered approach
DROP TABLE IF EXISTS "public"."portfolios";

-- Modify bots table to include more comprehensive bot management
ALTER TABLE "public"."bots" 
ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS "strategy_type" text DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS "capital_allocated" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "max_position_size" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "risk_tolerance" text DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS "auto_trade" boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS "last_trade_at" timestamp with time zone,
ADD COLUMN IF NOT EXISTS "total_pnl" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "win_rate" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "description" text,
ADD COLUMN IF NOT EXISTS "active_orders_count" integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS "positions_count" integer DEFAULT 0;

-- Update existing columns for consistency
ALTER TABLE "public"."bots" 
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'manual',
ALTER COLUMN "risk" SET DEFAULT 'medium';

-- Recreate positions table with bot relationship (not portfolio)
ALTER TABLE "public"."positions"
DROP COLUMN IF EXISTS "portfolio_id",
ADD COLUMN IF NOT EXISTS "bot_id" uuid,
ADD COLUMN IF NOT EXISTS "symbol" text NOT NULL,
ADD COLUMN IF NOT EXISTS "side" text DEFAULT 'long', -- 'long' or 'short'
ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'open', -- 'open', 'closed', 'partial'
ADD COLUMN IF NOT EXISTS "entry_price" numeric,
ADD COLUMN IF NOT EXISTS "exit_price" numeric,
ADD COLUMN IF NOT EXISTS "stop_loss" numeric,
ADD COLUMN IF NOT EXISTS "take_profit" numeric,
ADD COLUMN IF NOT EXISTS "unrealized_pnl" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "realized_pnl" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "total_cost" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "market_value" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "opened_at" timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS "closed_at" timestamp with time zone,
ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS "notes" text;

-- Ensure positions table consistency
ALTER TABLE "public"."positions"
ALTER COLUMN "ticker" DROP NOT NULL,
ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "avg_price" SET DEFAULT 0;

-- Create orders table (new) - orders that may or may not be filled
CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "bot_id" uuid NOT NULL,
    "position_id" uuid, -- null for opening orders, filled when position is created
    "symbol" text NOT NULL,
    "order_type" text NOT NULL DEFAULT 'market', -- 'market', 'limit', 'stop', 'stop_limit'
    "side" text NOT NULL, -- 'buy', 'sell'
    "quantity" numeric NOT NULL,
    "price" numeric, -- null for market orders
    "stop_price" numeric, -- for stop orders
    "time_in_force" text DEFAULT 'day', -- 'day', 'gtc', 'ioc', 'fok'
    "status" text DEFAULT 'pending', -- 'pending', 'submitted', 'filled', 'partially_filled', 'cancelled', 'rejected'
    "filled_quantity" numeric DEFAULT 0,
    "filled_avg_price" numeric DEFAULT 0,
    "submitted_at" timestamp with time zone DEFAULT now(),
    "filled_at" timestamp with time zone,
    "cancelled_at" timestamp with time zone,
    "client_order_id" text,
    "broker_order_id" text,
    "notes" text,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Update trades table to reference orders (trades are executions of orders)
ALTER TABLE "public"."trades"
ADD COLUMN IF NOT EXISTS "order_id" uuid,
ADD COLUMN IF NOT EXISTS "bot_id" uuid,
ADD COLUMN IF NOT EXISTS "symbol" text,
ADD COLUMN IF NOT EXISTS "commission" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "fees" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "net_amount" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "trade_type" text DEFAULT 'execution', -- 'execution', 'dividend', 'split', 'merger'
ADD COLUMN IF NOT EXISTS "broker_trade_id" text,
ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now();

-- Update existing trade columns
ALTER TABLE "public"."trades"
ALTER COLUMN "action" SET DEFAULT 'buy',
ALTER COLUMN "side" SET DEFAULT 'buy',
ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "datetime" SET DEFAULT now();

-- Create primary keys and constraints
CREATE UNIQUE INDEX IF NOT EXISTS orders_pkey ON public.orders USING btree (id);
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_pkey" PRIMARY KEY USING INDEX "orders_pkey";

-- Add foreign key constraints
ALTER TABLE "public"."positions" 
ADD CONSTRAINT "positions_bot_id_fkey" FOREIGN KEY (bot_id) REFERENCES bots(id) ON DELETE CASCADE;

ALTER TABLE "public"."orders" 
ADD CONSTRAINT "orders_bot_id_fkey" FOREIGN KEY (bot_id) REFERENCES bots(id) ON DELETE CASCADE,
ADD CONSTRAINT "orders_position_id_fkey" FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE SET NULL;

ALTER TABLE "public"."trades" 
ADD CONSTRAINT "trades_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
ADD CONSTRAINT "trades_bot_id_fkey" FOREIGN KEY (bot_id) REFERENCES bots(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_positions_bot_id ON public.positions (bot_id);
CREATE INDEX IF NOT EXISTS idx_positions_symbol ON public.positions (symbol);
CREATE INDEX IF NOT EXISTS idx_positions_status ON public.positions (status);

CREATE INDEX IF NOT EXISTS idx_orders_bot_id ON public.orders (bot_id);
CREATE INDEX IF NOT EXISTS idx_orders_symbol ON public.orders (symbol);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_submitted_at ON public.orders (submitted_at);

CREATE INDEX IF NOT EXISTS idx_trades_order_id ON public.trades (order_id);
CREATE INDEX IF NOT EXISTS idx_trades_bot_id ON public.trades (bot_id);
CREATE INDEX IF NOT EXISTS idx_trades_position_id ON public.trades (position_id);
CREATE INDEX IF NOT EXISTS idx_trades_symbol ON public.trades (symbol);
CREATE INDEX IF NOT EXISTS idx_trades_datetime ON public.trades (datetime);

CREATE INDEX IF NOT EXISTS idx_bots_user_id ON public.bots (user_id);
CREATE INDEX IF NOT EXISTS idx_bots_status ON public.bots (status);

-- Grant permissions for orders table
GRANT DELETE ON TABLE "public"."orders" TO "anon";
GRANT INSERT ON TABLE "public"."orders" TO "anon";
GRANT REFERENCES ON TABLE "public"."orders" TO "anon";
GRANT SELECT ON TABLE "public"."orders" TO "anon";
GRANT TRIGGER ON TABLE "public"."orders" TO "anon";
GRANT TRUNCATE ON TABLE "public"."orders" TO "anon";
GRANT UPDATE ON TABLE "public"."orders" TO "anon";

GRANT DELETE ON TABLE "public"."orders" TO "authenticated";
GRANT INSERT ON TABLE "public"."orders" TO "authenticated";
GRANT REFERENCES ON TABLE "public"."orders" TO "authenticated";
GRANT SELECT ON TABLE "public"."orders" TO "authenticated";
GRANT TRIGGER ON TABLE "public"."orders" TO "authenticated";
GRANT TRUNCATE ON TABLE "public"."orders" TO "authenticated";
GRANT UPDATE ON TABLE "public"."orders" TO "authenticated";

GRANT DELETE ON TABLE "public"."orders" TO "service_role";
GRANT INSERT ON TABLE "public"."orders" TO "service_role";
GRANT REFERENCES ON TABLE "public"."orders" TO "service_role";
GRANT SELECT ON TABLE "public"."orders" TO "service_role";
GRANT TRIGGER ON TABLE "public"."orders" TO "service_role";
GRANT TRUNCATE ON TABLE "public"."orders" TO "service_role";
GRANT UPDATE ON TABLE "public"."orders" TO "service_role";

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_bots BEFORE UPDATE ON bots FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_positions BEFORE UPDATE ON positions FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_orders BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_trades BEFORE UPDATE ON trades FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Create a view for portfolio summary (aggregate bot positions)
CREATE OR REPLACE VIEW portfolio_summary AS
SELECT 
    b.user_id,
    b.id as bot_id,
    b.name as bot_name,
    b.status as bot_status,
    b.capital_allocated,
    b.total_pnl,
    COUNT(p.id) as total_positions,
    COUNT(CASE WHEN p.status = 'open' THEN 1 END) as open_positions,
    SUM(CASE WHEN p.status = 'open' THEN p.market_value ELSE 0 END) as total_market_value,
    SUM(p.unrealized_pnl) as total_unrealized_pnl,
    SUM(p.realized_pnl) as total_realized_pnl
FROM bots b
LEFT JOIN positions p ON b.id = p.bot_id
GROUP BY b.user_id, b.id, b.name, b.status, b.capital_allocated, b.total_pnl;

-- Grant view permissions
GRANT SELECT ON portfolio_summary TO anon, authenticated, service_role;
