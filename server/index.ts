// server/index.ts
// Express/Bun server skeleton for Supabase Auth, Captcha, Demo Accounts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });

function hashSolution(solution: string) {
  return crypto.createHash('sha256').update(solution).digest('hex');
}

interface CaptchaResponse {
  captcha_id: string;
  svg: string;
}

interface RegisterRequestBody {
  email: string;
  password: string;
  captcha_id: string;
  captcha_solution: string;
  display_name?: string;
}

interface RegisterResponse {
  ok: boolean;
  user: {
    id: string;
    email: string;
  };
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    email: string;
  };
}

interface DemoResponse {
  email: string;
  password: string;
  expires_at: string;
}

interface ProfileResponse {
  id: string;
  email: string;
  display_name: string;
  is_demo: boolean;
  demo_expires_at: string | null;
}

interface UpdateProfileRequestBody {
  display_name: string;
}

interface UpdateProfileResponse {
  id: string;
  display_name: string;
}

interface LogoutResponse {
  ok: boolean;
}

interface Portfolio {
  id: string;
  name: string;
  value: number;
}

// GET /captcha - generate captcha
app.get('/v1/captcha', async (req, res) => {
  // TODO: Generate 10-char token, SVG, store hash in DB, return { captcha_id, svg }
  res.json<CaptchaResponse>({ captcha_id: 'demo-id', svg: '<svg>...</svg>' });
});

// POST /register - register user with captcha
app.post('/v1/register', async (req, res) => {
  const { email, password, captcha_id, captcha_solution, display_name }: RegisterRequestBody = req.body;
  if (!email || !password || !captcha_id || !captcha_solution) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Fetch captcha row
  const { data: capRow, error: capErr } = await supabaseAdmin
    .from('captchas')
    .select('*')
    .eq('id', captcha_id)
    .limit(1)
    .maybeSingle();

  if (capErr || !capRow) return res.status(400).json({ error: 'Invalid captcha' });
  if (new Date(capRow.expires_at) < new Date()) return res.status(400).json({ error: 'Captcha expired' });
  if (capRow.attempts >= 5) return res.status(400).json({ error: 'Too many attempts' });

  // Verify solution
  const hashed = hashSolution(captcha_solution);
  if (hashed !== capRow.solution_hash) {
    await supabaseAdmin.from('captchas').update({ attempts: capRow.attempts + 1 }).eq('id', captcha_id);
    return res.status(400).json({ error: 'Captcha incorrect' });
  }

  // Delete captcha after use
  await supabaseAdmin.from('captchas').delete().eq('id', captcha_id);

  // Create user via Supabase Admin API
  const { data: userData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createErr) return res.status(500).json({ error: createErr.message });

  // Insert profile row
  await supabaseAdmin.from('profiles').insert({
    id: userData.user.id,
    display_name: display_name || null,
    is_demo: false,
  });

  return res.status(201).json({ ok: true, user: { id: userData.user.id, email: userData.user.email } });
});

// POST /login - login user
app.post('/v1/login', async (req, res) => {
  const { email, password }: LoginRequestBody = req.body;
  // TODO: Proxy to Supabase Auth or handle login
  res.json({ access_token: 'demo-token', refresh_token: 'demo-refresh', user: { email } });
});

// POST /demo - create demo account
app.post('/v1/demo', async (req, res) => {
  // TODO: Create demo user, insert profile, return credentials
  res.json<DemoResponse>({ email: 'demo@example.com', password: 'demopass', expires_at: new Date(Date.now() + 24*60*60*1000).toISOString() });
});

// GET /profile - get user profile (JWT required)
app.get('/v1/profile', async (req, res) => {
  // TODO: Validate JWT, fetch profile
  res.json<ProfileResponse>({ id: 'demo-user', email: 'demo@example.com', display_name: 'Demo', is_demo: true, demo_expires_at: null });
});

// PUT /profile - update profile (JWT required)
app.put('/v1/profile', async (req, res) => {
  const { display_name }: UpdateProfileRequestBody = req.body;
  // TODO: Validate JWT, update profile
  res.json<UpdateProfileResponse>({ id: 'demo-user', display_name });
});

// POST /logout - logout user (JWT required)
app.post('/v1/logout', async (req, res) => {
  // TODO: Invalidate refresh token
  res.json<LogoutResponse>({ ok: true });
});

app.get('/v1/portfolios', async (req, res) => {
  // Mock data
  const portfolios: Portfolio[] = [
    { id: '1', name: 'Growth Portfolio', value: 12000 },
    { id: '2', name: 'Income Portfolio', value: 8500 },
  ];
  res.json({ portfolios });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
