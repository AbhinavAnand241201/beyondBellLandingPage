-- BeyondBell Waitlist Schema
-- Safe to re-run: every statement uses IF NOT EXISTS / IF EXISTS.

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  role text not null,
  board text not null,
  plan text not null default 'founding' check (plan in ('founding', 'free')),
  notified boolean not null default false,
  created_at timestamptz not null default now()
);

-- If the table existed before this revision, add the plan column.
alter table public.waitlist
  add column if not exists plan text not null default 'founding';

-- Make sure the check constraint is in place (drop & recreate is safe).
alter table public.waitlist
  drop constraint if exists waitlist_plan_check;
alter table public.waitlist
  add constraint waitlist_plan_check check (plan in ('founding', 'free'));

alter table public.waitlist enable row level security;

drop policy if exists "Service role full access" on public.waitlist;
create policy "Service role full access"
  on public.waitlist for all
  to service_role
  using (true)
  with check (true);

create index if not exists idx_waitlist_email on public.waitlist(email);
create index if not exists idx_waitlist_notified on public.waitlist(notified);
create index if not exists idx_waitlist_created_at on public.waitlist(created_at desc);
create index if not exists idx_waitlist_board on public.waitlist(board);
create index if not exists idx_waitlist_role on public.waitlist(role);
create index if not exists idx_waitlist_plan on public.waitlist(plan);
