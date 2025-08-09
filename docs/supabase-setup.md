# Supabase Setup

## Overview

Supabase is used for authentication, database, and storage operations in the Virgin Fund project.

---

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com).
2. Create a new project in the Supabase dashboard.

---

## Configuration

### Environment Variables

Add the following variables to your `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

### Database Schema

Use the Supabase dashboard to create the following tables:

#### Users

- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password`: String
- `created_at`: Timestamp

---

#### Demo Mode Tables

Add these tables for the Demo Mode feature:

```sql
create table demo_portfolios (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  currency text check (currency in ('USD','EUR','BTC')) not null,
  balance numeric not null,
  positions jsonb default '[]',
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '24 hours')
);

create table demo_trades (
  id uuid primary key default uuid_generate_v4(),
  portfolio_id uuid references demo_portfolios(id) on delete cascade,
  symbol text not null,
  side text check (side in ('buy','sell')) not null,
  qty numeric not null,
  price numeric not null,
  executed_at timestamptz default now()
);

create table demo_bots (
  id uuid primary key default uuid_generate_v4(),
  portfolio_id uuid references demo_portfolios(id) on delete cascade,
  name text not null,
  strategy text not null,
  status text check (status in ('active','paused')) default 'active'
);

create table demo_strategies (
  id uuid primary key default uuid_generate_v4(),
  portfolio_id uuid references demo_portfolios(id) on delete cascade,
  name text not null,
  description text,
  settings jsonb
);
```

---

## Integration

### Supabase Client

The Supabase client is initialized in `lib/supabase-client.ts`:

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### API Routes

Authentication routes are located in `pages/api/auth`:

- `signup.ts`: Handles user registration.
- `login.ts`: Handles user login.

---

## Testing

### Local Testing

1. Start the development server:

   ```bash
   bun dev
   ```

2. Test the API routes using Postman or curl.

### Deployment

Ensure the `.env` file is correctly configured in your production environment.

---

## Troubleshooting

### Common Issues

- **Invalid URL or Key**: Verify the Supabase URL and anon key in the `.env` file.
- **Database Errors**: Check the Supabase dashboard for schema issues.

### Support

For additional help, visit the [Supabase documentation](https://supabase.com/docs).
