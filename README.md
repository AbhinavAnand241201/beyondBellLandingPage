# BeyondBell Circle - Waitlist Landing Page (v3)

## Route Map

```
/                   -> app/page.tsx
/api/waitlist       -> app/api/waitlist/route.ts
/api/waitlist-count -> app/api/waitlist-count/route.ts
```

No navbar. No OAuth. No redirects. Single page with inline waitlist confirmation.

## Setup

### 1) Install

```bash
npm install
```

### 2) Supabase table setup

Run `supabase_setup.sql` in Supabase SQL Editor.

### 3) Environment

```bash
cp .env.example .env.local
```

Fill `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
```

### 4) Run

```bash
npm run dev
```

Open http://localhost:3000, submit the form, and verify rows in `public.waitlist`.

## Notes

- `SUPABASE_SERVICE_ROLE_KEY` is server-side only.
- Founding Member progress counter is fetched from `/api/waitlist-count`.