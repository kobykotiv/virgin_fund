-- Enable email auth provider for Supabase Auth
insert into auth.providers (id, name, enabled) values ('email', 'Email', true)
on conflict (id) do update set enabled = true;

-- Remove domain restrictions (allow all)
update auth.settings set allowed_email_domains = null;
