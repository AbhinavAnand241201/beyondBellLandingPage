create extension if not exists pg_net;

create table if not exists public.platform_config (
  id int primary key default 1,
  launched bool not null default false,
  launched_at timestamptz,
  last_launch_email_sent_at timestamptz,
  constraint single_row check (id = 1)
);

insert into public.platform_config (id, launched)
values (1, false)
on conflict (id) do nothing;

alter table public.platform_config enable row level security;

drop policy if exists "Service role only" on public.platform_config;
create policy "Service role only"
  on public.platform_config for all
  to service_role
  using (true);

create or replace function public.trigger_launch_emails()
returns trigger
language plpgsql
security definer
as $$
declare
  supabase_url text;
  secret text;
  function_url text;
  request_id bigint;
begin
  if old.launched = false and new.launched = true then
    update public.platform_config
    set launched_at = now()
    where id = 1;

    select current_setting('app.settings.supabase_url', true) into supabase_url;
    select current_setting('app.settings.function_secret', true) into secret;

    if supabase_url is null or secret is null then
      raise exception 'Missing app.settings.supabase_url or app.settings.function_secret';
    end if;

    function_url := supabase_url || '/functions/v1/send-launch-emails';

    select net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || secret
      ),
      body := '{}'::jsonb
    ) into request_id;

    raise notice '[trigger_launch_emails] queued request id: %', request_id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_platform_launched on public.platform_config;
create trigger on_platform_launched
  after update of launched
  on public.platform_config
  for each row
  execute function public.trigger_launch_emails();

-- Replace these two placeholders before executing in production SQL editor.
alter database postgres
  set "app.settings.supabase_url" = 'https://YOUR-PROJECT-REF.supabase.co';

alter database postgres
  set "app.settings.function_secret" = 'YOUR-FUNCTION-SECRET-HERE';
