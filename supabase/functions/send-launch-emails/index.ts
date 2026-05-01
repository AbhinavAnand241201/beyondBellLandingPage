import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type WaitlistMember = {
  id: string
  email: string
  full_name: string | null
}

Deno.serve(async (req: Request) => {
  const authHeader = req.headers.get('Authorization')
  const expectedSecret = Deno.env.get('FUNCTION_SECRET')

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const resendApiKey = Deno.env.get('RESEND_API_KEY')

  if (!supabaseUrl || !supabaseServiceRoleKey || !resendApiKey) {
    return new Response(
      JSON.stringify({ error: 'Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or RESEND_API_KEY' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  })

  const fromEmail = Deno.env.get('FROM_EMAIL') ?? 'Thomas from BeyondBell <thomas@beyondbell.in>'
  const siteUrl = Deno.env.get('SITE_URL') ?? 'https://beyondbell.in'

  const { data: members, error: fetchError } = await supabase
    .from('waitlist')
    .select('id, email, full_name')
    .eq('notified', false)
    .order('created_at', { ascending: true })

  if (fetchError) {
    return new Response(JSON.stringify({ error: fetchError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!members || members.length === 0) {
    return new Response(JSON.stringify({ sent: 0, failed: 0, total: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let sent = 0
  let failed = 0
  const notifiedIds: string[] = []

  for (const member of members as WaitlistMember[]) {
    try {
      const firstName = member.full_name ? member.full_name.split(' ')[0] : 'there'
      const html = buildEmailHtml(firstName, siteUrl)
      const text = buildEmailText(firstName, siteUrl)

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [member.email],
          subject: 'BeyondBell Circle is live - your waitlist spot is ready',
          html,
          text,
        }),
      })

      if (res.ok) {
        sent++
        notifiedIds.push(member.id)
      } else {
        failed++
      }
    } catch {
      failed++
    }

    await sleep(120)
  }

  if (notifiedIds.length > 0) {
    const BATCH_SIZE = 100
    for (let i = 0; i < notifiedIds.length; i += BATCH_SIZE) {
      const batch = notifiedIds.slice(i, i + BATCH_SIZE)
      await supabase.from('waitlist').update({ notified: true }).in('id', batch)
    }
  }

  await supabase
    .from('platform_config')
    .update({ last_launch_email_sent_at: new Date().toISOString() })
    .eq('id', 1)

  return new Response(JSON.stringify({ sent, failed, total: members.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildEmailHtml(firstName: string, siteUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BeyondBell Circle is live</title>
</head>
<body style="background:#F7F7F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:24px;">
  <div style="max-width:580px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
    <div style="background:#F5A400;padding:32px 28px;text-align:center;">
      <h1 style="margin:0;font-size:26px;color:#111111;line-height:1.2;">BeyondBell Circle is officially live</h1>
    </div>
    <div style="padding:28px;">
      <p style="font-size:16px;color:#111111;">Hi ${firstName},</p>
      <p style="font-size:15px;color:#6B7280;line-height:1.7;">
        The wait is over. BeyondBell Circle is now live and ready for you.
      </p>
      <p style="font-size:15px;color:#6B7280;line-height:1.7;">
        Your Founding Member spot is locked in. Click below to get started.
      </p>
      <p style="margin-top:24px;">
        <a href="${siteUrl}" style="display:inline-block;background:#F5A400;color:#111111;font-weight:700;padding:12px 22px;border-radius:10px;text-decoration:none;">
          Claim your Founding Member spot
        </a>
      </p>
      <p style="font-size:14px;color:#111111;margin-top:24px;">Thomas Koshy<br /><span style="color:#6B7280;">Founder, BeyondBell Circle</span></p>
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

You joined early, so your Founding Member spot is locked in.

Claim your spot: ${siteUrl}

Thomas Koshy
Founder, BeyondBell Circle
  `.trim()
}
