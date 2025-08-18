-- Portfolio Table
create table if not exists portfolios (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  name text,
  focus text,
  icon text,
  tags text[],
  risk text,
  value numeric,
  return numeric,
  return_class text,
  chart_variant text,
  allocation jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Positions Table
create table if not exists positions (
  id uuid primary key default uuid_generate_v4(),
  portfolio_id uuid references portfolios(id),
  asset_type text,
  ticker text,
  quantity numeric,
  avg_price numeric,
  current_price numeric,
  trades jsonb,
  name text,
  positions jsonb,
  created_at timestamp with time zone default now()
);

-- Trades Table
create table if not exists trades (
  trade_id uuid primary key default uuid_generate_v4(),
  position_id uuid references positions(id),
  action text,
  side text,
  quantity numeric,
  price numeric,
  datetime timestamp with time zone
);

-- Market Data Table
create table if not exists market_data (
  id uuid primary key default uuid_generate_v4(),
  symbol text,
  bar jsonb,
  quote jsonb,
  historical_data jsonb,
  calendar_day jsonb,
  created_at timestamp with time zone default now()
);

-- News Table
create table if not exists news (
  id uuid primary key default uuid_generate_v4(),
  headline text,
  summary text,
  author text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  url text,
  images text[],
  symbols text[],
  source text
);
