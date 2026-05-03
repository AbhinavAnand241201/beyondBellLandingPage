create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  role text not null,
  board text not null,
  notified boolean not null default false,
  created_at timestamptz not null default now()
);

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
