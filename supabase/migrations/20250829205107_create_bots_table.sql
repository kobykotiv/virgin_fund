create table "public"."bots" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "name" text,
    "type" text,
    "risk" text,
    "config" jsonb,
    "created_at" timestamp with time zone default now(),
    "performance" numeric default 0
);


create table "public"."market_data" (
    "id" uuid not null default uuid_generate_v4(),
    "symbol" text,
    "bar" jsonb,
    "quote" jsonb,
    "historical_data" jsonb,
    "calendar_day" jsonb,
    "created_at" timestamp with time zone default now()
);


create table "public"."news" (
    "id" uuid not null default uuid_generate_v4(),
    "headline" text,
    "summary" text,
    "author" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "url" text,
    "images" text[],
    "symbols" text[],
    "source" text
);


create table "public"."portfolios" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "name" text,
    "focus" text,
    "icon" text,
    "tags" text[],
    "risk" text,
    "value" numeric,
    "return" numeric,
    "return_class" text,
    "chart_variant" text,
    "allocation" jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "public"."positions" (
    "id" uuid not null default uuid_generate_v4(),
    "portfolio_id" uuid,
    "asset_type" text,
    "ticker" text,
    "quantity" numeric,
    "avg_price" numeric,
    "current_price" numeric,
    "trades" jsonb,
    "name" text,
    "positions" jsonb,
    "created_at" timestamp with time zone default now()
);


create table "public"."trades" (
    "trade_id" uuid not null default uuid_generate_v4(),
    "position_id" uuid,
    "action" text,
    "side" text,
    "quantity" numeric,
    "price" numeric,
    "datetime" timestamp with time zone
);


CREATE UNIQUE INDEX bots_pkey ON public.bots USING btree (id);

CREATE UNIQUE INDEX market_data_pkey ON public.market_data USING btree (id);

CREATE UNIQUE INDEX news_pkey ON public.news USING btree (id);

CREATE UNIQUE INDEX portfolios_pkey ON public.portfolios USING btree (id);

CREATE UNIQUE INDEX positions_pkey ON public.positions USING btree (id);

CREATE UNIQUE INDEX trades_pkey ON public.trades USING btree (trade_id);

alter table "public"."bots" add constraint "bots_pkey" PRIMARY KEY using index "bots_pkey";

alter table "public"."market_data" add constraint "market_data_pkey" PRIMARY KEY using index "market_data_pkey";

alter table "public"."news" add constraint "news_pkey" PRIMARY KEY using index "news_pkey";

alter table "public"."portfolios" add constraint "portfolios_pkey" PRIMARY KEY using index "portfolios_pkey";

alter table "public"."positions" add constraint "positions_pkey" PRIMARY KEY using index "positions_pkey";

alter table "public"."trades" add constraint "trades_pkey" PRIMARY KEY using index "trades_pkey";

alter table "public"."bots" add constraint "bots_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."bots" validate constraint "bots_user_id_fkey";

alter table "public"."portfolios" add constraint "portfolios_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."portfolios" validate constraint "portfolios_user_id_fkey";

alter table "public"."positions" add constraint "positions_portfolio_id_fkey" FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) not valid;

alter table "public"."positions" validate constraint "positions_portfolio_id_fkey";

alter table "public"."trades" add constraint "trades_position_id_fkey" FOREIGN KEY (position_id) REFERENCES positions(id) not valid;

alter table "public"."trades" validate constraint "trades_position_id_fkey";

grant delete on table "public"."bots" to "anon";

grant insert on table "public"."bots" to "anon";

grant references on table "public"."bots" to "anon";

grant select on table "public"."bots" to "anon";

grant trigger on table "public"."bots" to "anon";

grant truncate on table "public"."bots" to "anon";

grant update on table "public"."bots" to "anon";

grant delete on table "public"."bots" to "authenticated";

grant insert on table "public"."bots" to "authenticated";

grant references on table "public"."bots" to "authenticated";

grant select on table "public"."bots" to "authenticated";

grant trigger on table "public"."bots" to "authenticated";

grant truncate on table "public"."bots" to "authenticated";

grant update on table "public"."bots" to "authenticated";

grant delete on table "public"."bots" to "service_role";

grant insert on table "public"."bots" to "service_role";

grant references on table "public"."bots" to "service_role";

grant select on table "public"."bots" to "service_role";

grant trigger on table "public"."bots" to "service_role";

grant truncate on table "public"."bots" to "service_role";

grant update on table "public"."bots" to "service_role";

grant delete on table "public"."market_data" to "anon";

grant insert on table "public"."market_data" to "anon";

grant references on table "public"."market_data" to "anon";

grant select on table "public"."market_data" to "anon";

grant trigger on table "public"."market_data" to "anon";

grant truncate on table "public"."market_data" to "anon";

grant update on table "public"."market_data" to "anon";

grant delete on table "public"."market_data" to "authenticated";

grant insert on table "public"."market_data" to "authenticated";

grant references on table "public"."market_data" to "authenticated";

grant select on table "public"."market_data" to "authenticated";

grant trigger on table "public"."market_data" to "authenticated";

grant truncate on table "public"."market_data" to "authenticated";

grant update on table "public"."market_data" to "authenticated";

grant delete on table "public"."market_data" to "service_role";

grant insert on table "public"."market_data" to "service_role";

grant references on table "public"."market_data" to "service_role";

grant select on table "public"."market_data" to "service_role";

grant trigger on table "public"."market_data" to "service_role";

grant truncate on table "public"."market_data" to "service_role";

grant update on table "public"."market_data" to "service_role";

grant delete on table "public"."news" to "anon";

grant insert on table "public"."news" to "anon";

grant references on table "public"."news" to "anon";

grant select on table "public"."news" to "anon";

grant trigger on table "public"."news" to "anon";

grant truncate on table "public"."news" to "anon";

grant update on table "public"."news" to "anon";

grant delete on table "public"."news" to "authenticated";

grant insert on table "public"."news" to "authenticated";

grant references on table "public"."news" to "authenticated";

grant select on table "public"."news" to "authenticated";

grant trigger on table "public"."news" to "authenticated";

grant truncate on table "public"."news" to "authenticated";

grant update on table "public"."news" to "authenticated";

grant delete on table "public"."news" to "service_role";

grant insert on table "public"."news" to "service_role";

grant references on table "public"."news" to "service_role";

grant select on table "public"."news" to "service_role";

grant trigger on table "public"."news" to "service_role";

grant truncate on table "public"."news" to "service_role";

grant update on table "public"."news" to "service_role";

grant delete on table "public"."portfolios" to "anon";

grant insert on table "public"."portfolios" to "anon";

grant references on table "public"."portfolios" to "anon";

grant select on table "public"."portfolios" to "anon";

grant trigger on table "public"."portfolios" to "anon";

grant truncate on table "public"."portfolios" to "anon";

grant update on table "public"."portfolios" to "anon";

grant delete on table "public"."portfolios" to "authenticated";

grant insert on table "public"."portfolios" to "authenticated";

grant references on table "public"."portfolios" to "authenticated";

grant select on table "public"."portfolios" to "authenticated";

grant trigger on table "public"."portfolios" to "authenticated";

grant truncate on table "public"."portfolios" to "authenticated";

grant update on table "public"."portfolios" to "authenticated";

grant delete on table "public"."portfolios" to "service_role";

grant insert on table "public"."portfolios" to "service_role";

grant references on table "public"."portfolios" to "service_role";

grant select on table "public"."portfolios" to "service_role";

grant trigger on table "public"."portfolios" to "service_role";

grant truncate on table "public"."portfolios" to "service_role";

grant update on table "public"."portfolios" to "service_role";

grant delete on table "public"."positions" to "anon";

grant insert on table "public"."positions" to "anon";

grant references on table "public"."positions" to "anon";

grant select on table "public"."positions" to "anon";

grant trigger on table "public"."positions" to "anon";

grant truncate on table "public"."positions" to "anon";

grant update on table "public"."positions" to "anon";

grant delete on table "public"."positions" to "authenticated";

grant insert on table "public"."positions" to "authenticated";

grant references on table "public"."positions" to "authenticated";

grant select on table "public"."positions" to "authenticated";

grant trigger on table "public"."positions" to "authenticated";

grant truncate on table "public"."positions" to "authenticated";

grant update on table "public"."positions" to "authenticated";

grant delete on table "public"."positions" to "service_role";

grant insert on table "public"."positions" to "service_role";

grant references on table "public"."positions" to "service_role";

grant select on table "public"."positions" to "service_role";

grant trigger on table "public"."positions" to "service_role";

grant truncate on table "public"."positions" to "service_role";

grant update on table "public"."positions" to "service_role";

grant delete on table "public"."trades" to "anon";

grant insert on table "public"."trades" to "anon";

grant references on table "public"."trades" to "anon";

grant select on table "public"."trades" to "anon";

grant trigger on table "public"."trades" to "anon";

grant truncate on table "public"."trades" to "anon";

grant update on table "public"."trades" to "anon";

grant delete on table "public"."trades" to "authenticated";

grant insert on table "public"."trades" to "authenticated";

grant references on table "public"."trades" to "authenticated";

grant select on table "public"."trades" to "authenticated";

grant trigger on table "public"."trades" to "authenticated";

grant truncate on table "public"."trades" to "authenticated";

grant update on table "public"."trades" to "authenticated";

grant delete on table "public"."trades" to "service_role";

grant insert on table "public"."trades" to "service_role";

grant references on table "public"."trades" to "service_role";

grant select on table "public"."trades" to "service_role";

grant trigger on table "public"."trades" to "service_role";

grant truncate on table "public"."trades" to "service_role";

grant update on table "public"."trades" to "service_role";


