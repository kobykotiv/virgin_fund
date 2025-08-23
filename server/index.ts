// server/index.ts
// Express/Bun server skeleton for Supabase Auth, Captcha, Demo Accounts

import express, { Request, Response } from 'express';
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
app.get('/v1/captcha', async (req: Request, res: Response) => {
  // TODO: Generate 10-char token, SVG, store hash in DB, return { captcha_id, svg }
  res.json({ captcha_id: 'demo-id', svg: '<svg>...</svg>' });
});

// POST /register - register user with captcha
app.post('/v1/register', async (req: Request, res: Response) => {
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
app.post('/v1/login', async (req: Request, res: Response) => {
  const { email, password }: LoginRequestBody = req.body;
  // TODO: Proxy to Supabase Auth or handle login
  res.json({ access_token: 'demo-token', refresh_token: 'demo-refresh', user: { email } });
});

// POST /demo - create demo account
app.post('/v1/demo', async (req: Request, res: Response) => {
  // TODO: Create demo user, insert profile, return credentials
  res.json({ email: 'demo@example.com', password: 'demopass', expires_at: new Date(Date.now() + 24*60*60*1000).toISOString() });
});

// GET /profile - get user profile (JWT required)
app.get('/v1/profile', async (req: Request, res: Response) => {
  // TODO: Validate JWT, fetch profile
  res.json({ id: 'demo-user', email: 'demo@example.com', display_name: 'Demo', is_demo: true, demo_expires_at: null });
});

// PUT /profile - update profile (JWT required)
app.put('/v1/profile', async (req: Request, res: Response) => {
  const { display_name }: UpdateProfileRequestBody = req.body;
  // TODO: Validate JWT, update profile
  res.json({ id: 'demo-user', display_name });
});

// POST /logout - logout user (JWT required)
app.post('/v1/logout', async (req: Request, res: Response) => {
  // TODO: Invalidate refresh token
  res.json({ ok: true });
});

app.get('/v1/portfolios', async (req: Request, res: Response) => {
  // Mock data
  const portfolios: Portfolio[] = [
    { id: '1', name: 'Growth Portfolio', value: 12000 },
    { id: '2', name: 'Income Portfolio', value: 8500 },
  ];
  res.json({ portfolios });
});

// --- Backtest API Endpoints ---

// Helper: check demo mode (stub, replace with real logic)
function isDemoMode(req) {
  // Example: check header or user profile
  return req.headers['x-demo-mode'] === 'true';
}

// GET /api/backtest/list
app.get('/api/backtest/list', async (req: Request, res: Response) => {
  if (isDemoMode(req)) {
    // Return mock data
    return res.json({
      backtests: [
        {
          id: 'demo-1',
          user_id: 'demo-user',
          title: 'Demo SMA Crossover',
          description: 'Backtest of SMA crossover strategy',
          parameters: { fast: 10, slow: 50 },
          results: { equity_curve: [10000, 10200, 10150], metrics: { return: 2, drawdown: 1 } },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });
  }
  // TODO: Validate JWT, get user_id
  const user_id = req.headers['x-user-id'];
  const { data, error } = await supabaseAdmin
    .from('backtests')
    .select('*')
    .eq('user_id', user_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ backtests: data });
});

// POST /api/backtest/create
app.post('/api/backtest/create', async (req: Request, res: Response) => {
  if (isDemoMode(req)) {
    // Return mock created item
    return res.status(201).json({
      backtest: {
        id: 'demo-created',
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
  }
  // TODO: Validate JWT, get user_id
  const user_id = req.headers['x-user-id'];
  const { title, description, parameters, results } = req.body;
  const { data, error } = await supabaseAdmin
    .from('backtests')
    .insert([{ user_id, title, description, parameters, results }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ backtest: data });
});

// PUT /api/backtest/update/:id
app.put('/api/backtest/update/:id', async (req: Request, res: Response) => {
  if (isDemoMode(req)) {
    // Return mock updated item
    return res.json({
      backtest: {
        id: req.params.id,
        ...req.body,
        updated_at: new Date().toISOString(),
      },
    });
  }
  // TODO: Validate JWT, get user_id
  const user_id = req.headers['x-user-id'];
  const { title, description, parameters, results } = req.body;
  // Ownership check
  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from('backtests')
    .select('user_id')
    .eq('id', req.params.id)
    .single();
  if (fetchErr || !existing || existing.user_id !== user_id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { data, error } = await supabaseAdmin
    .from('backtests')
    .update({ title, description, parameters, results, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ backtest: data });
});

// DELETE /api/backtest/delete/:id
app.delete('/api/backtest/delete/:id', async (req: Request, res: Response) => {
  if (isDemoMode(req)) {
    // Return mock delete confirmation
    return res.json({ ok: true, id: req.params.id });
  }
  // TODO: Validate JWT, get user_id
  const user_id = req.headers['x-user-id'];
  // Ownership check
  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from('backtests')
    .select('user_id')
    .eq('id', req.params.id)
    .single();
  if (fetchErr || !existing || existing.user_id !== user_id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { error } = await supabaseAdmin
    .from('backtests')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true, id: req.params.id });
});

app.get('/api/overview/metrics', async (req: Request, res: Response) => {
  if (isDemoMode(req)) {
    // Return mock overview metrics
    return res.json({
      portfolioValue: 25000,
      cashBalance: 5000,
      totalPnL: 1200,
      activeBots: 3,
      pausedBots: 1,
      averageReturn: 7.5,
    });
  }
  // TODO: Validate JWT, get user_id
  const user_id = req.headers['x-user-id'];
  // TODO: Query Supabase for real metrics
  // Example stub response
  res.json({
    portfolioValue: 0,
    cashBalance: 0,
    totalPnL: 0,
    activeBots: 0,
    pausedBots: 0,
    averageReturn: 0,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
