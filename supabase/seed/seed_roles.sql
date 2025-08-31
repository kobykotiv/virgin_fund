-- Seed roles and an admin user for initial setup

INSERT INTO public.users (id, email, name, role, is_demo) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@example.com',
  'Platform Admin',
  'admin',
  false
) ON CONFLICT (email) DO NOTHING;

-- Example free user
INSERT INTO public.users (id, email, name, role, is_demo) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'free@example.com',
  'Free User',
  'free',
  false
) ON CONFLICT (email) DO NOTHING;

-- Example pro user
INSERT INTO public.users (id, email, name, role, is_demo) VALUES (
  '00000000-0000-0000-0000-000000000003',
  'pro@example.com',
  'Pro User',
  'pro',
  false
) ON CONFLICT (email) DO NOTHING;
