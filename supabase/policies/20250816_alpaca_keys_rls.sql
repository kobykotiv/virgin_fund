-- Enable RLS for alpaca_keys
alter table public.alpaca_keys enable row level security;

create policy "Users can manage their alpaca keys" on public.alpaca_keys
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
