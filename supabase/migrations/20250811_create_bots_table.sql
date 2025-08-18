create table if not exists bots (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  name text,
  type text,
  risk text,
  config jsonb,
  created_at timestamp with time zone default now()
);
