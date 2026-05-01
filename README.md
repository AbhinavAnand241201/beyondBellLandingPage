# BeyondBell Circle - Waitlist + Launch Email Automation

## What is already implemented

- Landing page in Next.js App Router
- Join Waitlist modal with Google OAuth
- OAuth callback route that upserts user into `waitlist`
- Success page after signup
- Automated launch-email system via Supabase Edge Function + Postgres trigger

## Local setup (landing page)

1) Install deps:

```bash
npm install
```

2) Copy env:

```bash
cp .env.example .env.local
```

3) Fill `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4) Start app:

```bash
npm run dev
```

## Supabase setup (required for waitlist signup)

Run this SQL in Supabase SQL Editor:

```sql
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  avatar_url text,
  provider text default 'google',
  notified boolean default false,
  created_at timestamptz default now()
);

alter table public.waitlist enable row level security;

drop policy if exists "Authenticated insert" on public.waitlist;
create policy "Authenticated insert"
  on public.waitlist for insert
  to authenticated
  with check (true);

drop policy if exists "Service role full access" on public.waitlist;
create policy "Service role full access"
  on public.waitlist for all
  to service_role
  using (true);
```

## Google OAuth setup (required for modal sign-in)

In Google Cloud OAuth client, add redirect URI:

- `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`

In Supabase Auth URL configuration, add:

- Site URL: `http://localhost:3000`
- Redirect URL: `http://localhost:3000/auth/callback`

## Automated launch emails (implemented in this repo)

Files added:

- `supabase/functions/send-launch-emails/index.ts`
- `supabase/migrations/001_launch_system.sql`
- `supabase/config.toml`

### One-time setup

1) Install/login/link Supabase CLI:

```bash
brew install supabase/tap/supabase
supabase login
supabase link --project-ref YOUR-PROJECT-REF
```

2) Create Resend API key and verify sender domain.

3) Set function secrets:

```bash
supabase secrets set SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY
supabase secrets set RESEND_API_KEY=re_xxx
supabase secrets set FROM_EMAIL="Thomas from BeyondBell <thomas@beyondbell.in>"
supabase secrets set SITE_URL=https://beyondbell.in
supabase secrets set FUNCTION_SECRET=YOUR-32-CHAR-SECRET
```

4) Deploy function:

```bash
supabase functions deploy send-launch-emails --no-verify-jwt
```

5) Run SQL migration:

- Open `supabase/migrations/001_launch_system.sql`
- Replace:
  - `https://YOUR-PROJECT-REF.supabase.co`
  - `YOUR-FUNCTION-SECRET-HERE`
- Run in Supabase SQL Editor.

### Launch day command

```sql
update public.platform_config
set launched = true
where id = 1;
```

This triggers the Edge Function, sends all pending waitlist emails, and marks successful rows with `notified = true`.