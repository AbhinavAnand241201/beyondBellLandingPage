//  i need the configs pasted here 
   


//landing page loads fully
✅ "Join Waitlist" button opens modal
✅ Google OAuth sign-in flow
✅ User gets saved to your waitlist table in Supabase automatically
✅ User lands on the success page
✅ You can see every signup in your Supabase dashboard


// make the waitlist database int he supbase 



// Option B — Automated trigger via Supabase Edge Function (proper way)
This fires an email automatically when you flip a switch. I can build this for you — it's about 40 lines of code. You'd run one SQL command when you go live and every waitlist user gets an email within minutes 



You run one SQL command
    → Postgres trigger fires
    → Edge Function wakes up
    → Loops through every waitlist member
    → Sends personalised email via Resend
    → Marks them notified = true




    Let's build it. Here's exactly what we're creating:
The flow: You run one SQL command → it updates a launched flag → a Supabase database trigger fires → an Edge Function picks it up → loops through every unnotified waitlist user → sends each one a beautiful launch email via Resend → marks them notified = true




The 6 steps to set this up (do once):

brew install supabase/tap/supabase then supabase login + supabase link
Sign up at resend.com, get API key, verify your beyondbell.in domain
supabase secrets set ... — 6 secrets total (all listed in the README)
supabase functions deploy send-launch-emails --no-verify-jwt
Paste 001_launch_system.sql into Supabase SQL Editor (edit the 2 lines at the bottom first with your URL and secret)
Test it with a curl command — the README has the exact command



UPDATE public.platform_config SET launched = true WHERE id = 1;


One command. Every waitlist email goes out. You watch it happen live in the Resend dashboard and the Edge Function logs. If anything fails for specific emails, running that curl command again resends only to the ones that didn't get through — it's fully idempotent.




# BeyondBell — Launch Email System

This folder contains everything needed to wire up automated launch emails.
When you run one SQL command, every waitlist member gets a personalised email within minutes.

---

## How it works

```
You run:
  UPDATE platform_config SET launched = true WHERE id = 1;
        │
        ▼
Postgres trigger fires (on_platform_launched)
        │
        ▼
pg_net calls the Supabase Edge Function (send-launch-emails)
        │
        ▼
Edge Function fetches all waitlist rows where notified = false
        │
        ├── sends personalised email via Resend to each member
        │
        └── marks notified = true in batches of 100
```

Total time from SQL command to all emails sent: ~1-3 minutes for 500 members.

---

## Full Setup — Do This Once

### Step 1 — Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows / Linux
npm install -g supabase

# Verify
supabase --version
```

---

### Step 2 — Link your project

```bash
cd beyondbell-launch

supabase login
# Opens browser → sign in to your Supabase account

supabase link --project-ref YOUR-PROJECT-REF
# Your project ref is in: Supabase dashboard → Settings → General → Reference ID
# Looks like: abcdefghijklmnop (20 chars)
```

---

### Step 3 — Get a Resend API key

1. Go to https://resend.com → Sign up (free)
2. **API Keys → Create API Key** → name it `beyondbell-production`
3. Copy the key — it starts with `re_`

4. **Add your sending domain** (important for deliverability):
   - Resend → Domains → Add Domain → `beyondbell.in`
   - Add the DNS records they show you to your domain registrar
   - Wait for verification (usually <30 min)
   - Once verified, your FROM address can be `thomas@beyondbell.in`

   If you don't have your domain ready yet, Resend gives you a test address
   like `onboarding@resend.dev` for testing.

---

### Step 4 — Set Edge Function secrets

```bash
# Your Supabase project URL
supabase secrets set SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co

# Your Supabase service role key
# Find it: Supabase dashboard → Settings → API → service_role (secret)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key...

# Your Resend API key
supabase secrets set RESEND_API_KEY=re_your_resend_key_here

# The FROM address for emails
supabase secrets set FROM_EMAIL=Thomas from BeyondBell <thomas@beyondbell.in>

# Your site URL (the landing page)
supabase secrets set SITE_URL=https://beyondbell.in

# FUNCTION_SECRET — a random string only you know
# Generate one: openssl rand -hex 32   (or any 32+ char random string)
# This protects the function from being called by anyone except the trigger
supabase secrets set FUNCTION_SECRET=your-random-secret-here-min-32-chars
```

Verify they were set:
```bash
supabase secrets list
```

---

### Step 5 — Deploy the Edge Function

```bash
supabase functions deploy send-launch-emails --no-verify-jwt
```

You should see: `Deployed Function send-launch-emails`

Test it's live:
```bash
# This should return 401 (good — it's protected)
curl https://YOUR-PROJECT-REF.supabase.co/functions/v1/send-launch-emails
```

---

### Step 6 — Run the SQL migration

In Supabase → **SQL Editor**, open `supabase/migrations/001_launch_system.sql`.

**Before pasting**, edit these two lines at the bottom:

```sql
alter database postgres
  set "app.settings.supabase_url" = 'https://YOUR-PROJECT-REF.supabase.co';
  --                                  ^^^ replace this

alter database postgres
  set "app.settings.function_secret" = 'YOUR-FUNCTION-SECRET-HERE';
  --                                    ^^^ must match what you set in Step 4
```

Then paste the whole file and click **Run**.

You should see: `Success. No rows returned.`

---

### Step 7 — Test with one real email first

```bash
# Manually call the Edge Function with your secret
curl -X POST \
  https://YOUR-PROJECT-REF.supabase.co/functions/v1/send-launch-emails \
  -H "Authorization: Bearer YOUR-FUNCTION-SECRET-HERE" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Expected response:
```json
{ "sent": 1, "failed": 0, "total": 1 }
```

Check your inbox. Check Resend dashboard → Emails to see delivery status.

---

## Launch Day — The One Command

When BeyondBell Circle is ready to go live, run this in Supabase SQL Editor:

```sql
UPDATE public.platform_config
SET launched = true
WHERE id = 1;
```

That's it. The trigger fires, the Edge Function runs, every waitlist member
gets their email. You can watch it happen in:

- **Supabase → Edge Functions → send-launch-emails → Logs**
- **Resend → Dashboard → Emails** (watch them appear in real time)

---

## Monitoring After Launch

### See email delivery status in Resend
https://resend.com/emails

### Check how many emails were sent
```sql
SELECT
  (SELECT COUNT(*) FROM waitlist)           AS total_waitlist,
  (SELECT COUNT(*) FROM waitlist WHERE notified = true)  AS emails_sent,
  (SELECT COUNT(*) FROM waitlist WHERE notified = false) AS remaining,
  (SELECT last_launch_email_sent_at FROM platform_config WHERE id = 1) AS sent_at;
```

### If some emails failed (notified = false after launch)
Simply call the function again — it only sends to `notified = false` rows:
```bash
curl -X POST \
  https://YOUR-PROJECT-REF.supabase.co/functions/v1/send-launch-emails \
  -H "Authorization: Bearer YOUR-FUNCTION-SECRET-HERE" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### View Edge Function logs
```bash
supabase functions logs send-launch-emails
```

---

## File Structure

```
beyondbell-launch/
├── supabase/
│   ├── config.toml
│   ├── functions/
│   │   └── send-launch-emails/
│   │       └── index.ts          ← The Edge Function
│   └── migrations/
│       └── 001_launch_system.sql ← Tables + trigger — run once in SQL Editor
└── README.md                     ← This file
```

---

## Troubleshooting

**"Unauthorized" when calling the function**
→ Your `Authorization: Bearer` header doesn't match `FUNCTION_SECRET`. Re-check both.

**"relation waitlist does not exist"**
→ The waitlist table from your landing page codebase hasn't been created yet.
   Run the waitlist table SQL from the landing page README first.

**Emails going to spam**
→ Domain not verified on Resend. Complete DNS verification for `beyondbell.in`.
   Also: don't test with Gmail-to-Gmail — use a work or school email.

**pg_net not available**
→ In Supabase SQL Editor run: `create extension if not exists pg_net;`
   pg_net is enabled by default on all Supabase projects since 2023.

**Trigger not firing**
→ Check that the `app.settings` were set correctly. Run:
   `select current_setting('app.settings.supabase_url', true);`
   If it returns blank, re-run the `alter database` lines and reconnect.






   /**
 * Supabase Edge Function: send-launch-emails
 *
 * Triggered by a Supabase Database Webhook when
 * platform_config.launched flips to TRUE.
 *
 * What it does:
 *   1. Verifies the request came from Supabase (not a random caller)
 *   2. Fetches every waitlist member where notified = false
 *   3. Sends each one a personalised launch email via Resend
 *   4. Marks them notified = true in batches
 *   5. Logs a summary to platform_config.last_launch_email_sent_at
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ─── Types ───────────────────────────────────────────────────────────────────

type WaitlistMember = {
  id: string
  email: string
  full_name: string | null
}

// ─── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {

  // ── 1. Verify the request came from Supabase ──────────────────────────────
  const authHeader = req.headers.get('Authorization')
  const expectedSecret = Deno.env.get('FUNCTION_SECRET')

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    console.error('[send-launch-emails] Unauthorized request blocked')
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // ── 2. Init Supabase admin client (bypasses RLS) ──────────────────────────
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } }
  )

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
  const FROM_EMAIL     = Deno.env.get('FROM_EMAIL') ?? 'Thomas from BeyondBell <thomas@beyondbell.in>'
  const SITE_URL       = Deno.env.get('SITE_URL')   ?? 'https://beyondbell.in'

  // ── 3. Fetch unnotified waitlist members ──────────────────────────────────
  const { data: members, error: fetchError } = await supabase
    .from('waitlist')
    .select('id, email, full_name')
    .eq('notified', false)
    .order('created_at', { ascending: true })

  if (fetchError) {
    console.error('[send-launch-emails] Failed to fetch waitlist:', fetchError.message)
    return new Response(JSON.stringify({ error: fetchError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!members || members.length === 0) {
    console.log('[send-launch-emails] No unnotified members found. Nothing to send.')
    return new Response(JSON.stringify({ sent: 0, message: 'No unnotified members' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  console.log(`[send-launch-emails] Sending to ${members.length} members…`)

  // ── 4. Send emails + collect results ─────────────────────────────────────
  let sent    = 0
  let failed  = 0
  const notifiedIds: string[] = []

  for (const member of members as WaitlistMember[]) {
    try {
      const firstName = member.full_name
        ? member.full_name.split(' ')[0]
        : 'there'

      const emailHtml = buildEmailHtml(firstName, SITE_URL)
      const emailText = buildEmailText(firstName, SITE_URL)

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from:    FROM_EMAIL,
          to:      [member.email],
          subject: '🎉 BeyondBell Circle is live — your waitlist spot is ready',
          html:    emailHtml,
          text:    emailText,
        }),
      })

      if (res.ok) {
        sent++
        notifiedIds.push(member.id)
        console.log(`[send-launch-emails] ✓ Sent to ${member.email}`)
      } else {
        const errBody = await res.text()
        failed++
        console.error(`[send-launch-emails] ✗ Failed for ${member.email}: ${errBody}`)
      }

    } catch (err) {
      failed++
      console.error(`[send-launch-emails] ✗ Exception for ${member.email}:`, err)
    }

    // Small delay between sends — keeps Resend happy on large lists
    await sleep(120)
  }

  // ── 5. Mark notified = true in batches of 100 ────────────────────────────
  if (notifiedIds.length > 0) {
    const BATCH = 100
    for (let i = 0; i < notifiedIds.length; i += BATCH) {
      const batch = notifiedIds.slice(i, i + BATCH)
      const { error: updateError } = await supabase
        .from('waitlist')
        .update({ notified: true })
        .in('id', batch)

      if (updateError) {
        console.error('[send-launch-emails] Failed to mark batch notified:', updateError.message)
      }
    }
  }

  // ── 6. Record timestamp on platform_config ────────────────────────────────
  await supabase
    .from('platform_config')
    .update({ last_launch_email_sent_at: new Date().toISOString() })
    .eq('id', 1)

  const summary = { sent, failed, total: members.length }
  console.log('[send-launch-emails] Done:', summary)

  return new Response(JSON.stringify(summary), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─── Email templates ──────────────────────────────────────────────────────────

function buildEmailHtml(firstName: string, siteUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BeyondBell Circle is live</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #F7F7F7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  </style>
</head>
<body>
  <div style="max-width: 580px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">

    <!-- Yellow header -->
    <div style="background: #F5A400; padding: 36px 40px; text-align: center;">
      <div style="display: inline-block; background: #111111; border-radius: 10px; width: 44px; height: 44px; line-height: 44px; text-align: center; margin-bottom: 14px;">
        <span style="color: #F5A400; font-weight: 900; font-size: 14px; font-family: sans-serif;">BB</span>
      </div>
      <h1 style="font-size: 26px; font-weight: 900; color: #111111; line-height: 1.2;">
        BeyondBell Circle<br />is officially live. 🎉
      </h1>
    </div>

    <!-- Body -->
    <div style="padding: 36px 40px;">

      <p style="font-size: 16px; color: #111111; margin-bottom: 16px; font-weight: 600;">
        Hi ${firstName},
      </p>

      <p style="font-size: 15px; color: #6B7280; line-height: 1.7; margin-bottom: 16px;">
        The wait is over. BeyondBell Circle — the AI-powered professional home for India's school educators — is now live and ready for you.
      </p>

      <p style="font-size: 15px; color: #6B7280; line-height: 1.7; margin-bottom: 24px;">
        You joined the waitlist early, which means your <strong style="color: #111111;">Founding Member</strong> spot is locked in. That means Standard tier pricing at ₹1,999/year — guaranteed for life, regardless of future price changes.
      </p>

      <!-- What's waiting -->
      <div style="background: #FFF4DC; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px;">
        <p style="font-size: 13px; font-weight: 700; color: #111111; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px;">What's waiting for you:</p>
        ${[
          '📋 Lesson Architect — complete lesson plans in 60 seconds',
          '📝 Assessment Builder — full question papers with answer keys',
          '💬 Parent Communicator — 20+ situations, English & Hindi',
          '🗓️ Event Architect — 8-document event packs, instantly',
          '👥 Community — board-specific Spaces, resource library, live events',
          '🏆 Circle Points — build your professional reputation',
        ].map(item => `
          <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px;">
            <span style="font-size: 14px; line-height: 1.5;">${item}</span>
          </div>
        `).join('')}
      </div>

      <!-- CTA button -->
      <div style="text-align: center; margin-bottom: 28px;">
        <a
          href="${siteUrl}"
          style="display: inline-block; background: #F5A400; color: #111111; font-weight: 700; font-size: 15px; padding: 14px 36px; border-radius: 10px; text-decoration: none;"
        >
          Claim your Founding Member spot →
        </a>
      </div>

      <p style="font-size: 14px; color: #6B7280; line-height: 1.7; margin-bottom: 16px;">
        I built BeyondBell Circle because I sit inside a school every week and watch talented educators work in professional isolation. This platform is your professional home — and I'm glad you're one of the first ones in.
      </p>

      <p style="font-size: 14px; color: #111111; font-weight: 600;">
        Thomas Koshy<br />
        <span style="font-weight: 400; color: #6B7280;">Founder, BeyondBell Circle</span>
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #F7F7F7; padding: 20px 40px; text-align: center; border-top: 1px solid #E5E5E5;">
      <p style="font-size: 12px; color: #9CA3AF;">
        You're receiving this because you joined the BeyondBell waitlist.<br />
        <a href="${siteUrl}" style="color: #F5A400; text-decoration: none;">beyondbell.in</a>
        &nbsp;·&nbsp;
        <a href="mailto:thomas@beyondbell.in" style="color: #9CA3AF; text-decoration: none;">thomas@beyondbell.in</a>
      </p>
    </div>

  </div>
</body>
</html>
  `.trim()
}

function buildEmailText(firstName: string, siteUrl: string): string {
  return `
Hi ${firstName},

BeyondBell Circle is officially live.

The wait is over. BeyondBell Circle — the AI-powered professional home for India's school educators — is now ready for you.

You joined the waitlist early, so your Founding Member spot is locked in: Standard tier at ₹1,999/year, guaranteed for life.

What's waiting for you:
- Lesson Architect — lesson plans in 60 seconds
- Assessment Builder — question papers with answer keys
- Parent Communicator — 20+ situations, English & Hindi
- Event Architect — 8-document event packs
- Community — board-specific Spaces, resource library, live events
- Circle Points — build your professional reputation

Claim your spot: ${siteUrl}

Thomas Koshy
Founder, BeyondBell Circle
thomas@beyondbell.in

---
You're receiving this because you joined the BeyondBell waitlist.
  `.trim()
}










-- ═══════════════════════════════════════════════════════════════════════════
-- BeyondBell Launch Email System — Full SQL Setup
-- Run this in Supabase → SQL Editor in one go.
-- ═══════════════════════════════════════════════════════════════════════════


-- ── STEP 1: platform_config table ────────────────────────────────────────────
-- One single row. `launched` is the switch you flip on launch day.

create table if not exists public.platform_config (
  id                           int  primary key default 1,    -- always row 1
  launched                     bool not null default false,
  launched_at                  timestamptz,
  last_launch_email_sent_at    timestamptz,
  constraint single_row check (id = 1)                        -- enforce one row
);

-- Insert the one row (safe to run multiple times)
insert into public.platform_config (id, launched)
values (1, false)
on conflict (id) do nothing;

-- RLS: only service_role can touch this table
alter table public.platform_config enable row level security;

create policy "Service role only"
  on public.platform_config for all
  to service_role
  using (true);


-- ── STEP 2: The trigger function ──────────────────────────────────────────────
-- Fires whenever `launched` changes from false → true.
-- Calls the Edge Function via pg_net (built into Supabase).

create or replace function public.trigger_launch_emails()
returns trigger
language plpgsql
security definer
as $$
declare
  function_url  text;
  secret        text;
  request_id    bigint;
begin

  -- Only fire when launched flips from false → true
  if (old.launched = false and new.launched = true) then

    -- Record when launch happened
    update public.platform_config
    set launched_at = now()
    where id = 1;

    -- Read config from Supabase secrets (set via CLI or dashboard)
    select current_setting('app.settings.supabase_url', true)    into function_url;
    select current_setting('app.settings.function_secret', true) into secret;

    function_url := function_url || '/functions/v1/send-launch-emails';

    -- Call the Edge Function asynchronously via pg_net
    select net.http_post(
      url     := function_url,
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || secret
      ),
      body    := '{}'::jsonb
    ) into request_id;

    raise notice '[trigger_launch_emails] Edge Function called. pg_net request_id: %', request_id;

  end if;

  return new;
end;
$$;


-- ── STEP 3: Attach trigger to platform_config ─────────────────────────────────

drop trigger if exists on_platform_launched on public.platform_config;

create trigger on_platform_launched
  after update of launched
  on public.platform_config
  for each row
  execute function public.trigger_launch_emails();


-- ── STEP 4: Set app settings (replace YOUR_... values before running) ─────────
-- These are read by the trigger function above.
-- Get your Supabase project URL from: Settings → API → Project URL
-- Generate FUNCTION_SECRET: any random string, 32+ chars (e.g. openssl rand -hex 32)

alter database postgres
  set "app.settings.supabase_url"    = 'https://YOUR-PROJECT-REF.supabase.co';

alter database postgres
  set "app.settings.function_secret" = 'YOUR-FUNCTION-SECRET-HERE';


-- ═══════════════════════════════════════════════════════════════════════════
-- LAUNCH DAY: run this one command to trigger all emails
-- ═══════════════════════════════════════════════════════════════════════════
-- update public.platform_config set launched = true where id = 1;
-- ═══════════════════════════════════════════════════════════════════════════