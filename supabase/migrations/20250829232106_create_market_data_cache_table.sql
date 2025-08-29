-- Create market data cache table for storing cached market data
CREATE TABLE IF NOT EXISTS "public"."market_data_cache" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "key" text NOT NULL,
    "symbol" text,
    "timeframe" text,
    "data" jsonb NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "last_updated" timestamp with time zone DEFAULT now(),
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Create primary key
CREATE UNIQUE INDEX IF NOT EXISTS market_data_cache_pkey ON public.market_data_cache USING btree (id);
ALTER TABLE "public"."market_data_cache" ADD CONSTRAINT "market_data_cache_pkey" PRIMARY KEY USING INDEX "market_data_cache_pkey";

-- Create indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_market_data_cache_key ON public.market_data_cache (key);
CREATE INDEX IF NOT EXISTS idx_market_data_cache_symbol ON public.market_data_cache (symbol);
CREATE INDEX IF NOT EXISTS idx_market_data_cache_expires_at ON public.market_data_cache (expires_at);
CREATE INDEX IF NOT EXISTS idx_market_data_cache_last_updated ON public.market_data_cache (last_updated);

-- Grant permissions
GRANT DELETE ON TABLE "public"."market_data_cache" TO "anon";
GRANT INSERT ON TABLE "public"."market_data_cache" TO "anon";
GRANT REFERENCES ON TABLE "public"."market_data_cache" TO "anon";
GRANT SELECT ON TABLE "public"."market_data_cache" TO "anon";
GRANT TRIGGER ON TABLE "public"."market_data_cache" TO "anon";
GRANT TRUNCATE ON TABLE "public"."market_data_cache" TO "anon";
GRANT UPDATE ON TABLE "public"."market_data_cache" TO "anon";

GRANT DELETE ON TABLE "public"."market_data_cache" TO "authenticated";
GRANT INSERT ON TABLE "public"."market_data_cache" TO "authenticated";
GRANT REFERENCES ON TABLE "public"."market_data_cache" TO "authenticated";
GRANT SELECT ON TABLE "public"."market_data_cache" TO "authenticated";
GRANT TRIGGER ON TABLE "public"."market_data_cache" TO "authenticated";
GRANT TRUNCATE ON TABLE "public"."market_data_cache" TO "authenticated";
GRANT UPDATE ON TABLE "public"."market_data_cache" TO "authenticated";
GRANT UPDATE ON TABLE "public"."market_data_cache" TO "service_role";

GRANT DELETE ON TABLE "public"."market_data_cache" TO "service_role";
GRANT INSERT ON TABLE "public"."market_data_cache" TO "service_role";
GRANT REFERENCES ON TABLE "public"."market_data_cache" TO "service_role";
GRANT SELECT ON TABLE "public"."market_data_cache" TO "service_role";
GRANT TRIGGER ON TABLE "public"."market_data_cache" TO "service_role";
GRANT TRUNCATE ON TABLE "public"."market_data_cache" TO "service_role";

-- Create trigger for updated_at
CREATE TRIGGER set_timestamp_market_data_cache BEFORE UPDATE ON market_data_cache FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Enable RLS
ALTER TABLE "public"."market_data_cache" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now, can be restricted later)
CREATE POLICY "Allow all operations on market_data_cache" ON "public"."market_data_cache" FOR ALL USING (true);