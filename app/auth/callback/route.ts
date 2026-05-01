import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

type CookieToSet = {
  name: string
  value: string
  options?: Record<string, unknown>
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${origin}/?error=oauth_denied`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=no_code`)
  }

  const response = NextResponse.redirect(`${origin}/waitlist-success`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
  if (sessionError || !sessionData?.user) {
    return NextResponse.redirect(`${origin}/?error=session_failed`)
  }

  const user = sessionData.user
  await supabase.from('waitlist').upsert(
    {
      email: user.email,
      full_name: user.user_metadata?.full_name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      provider: 'google',
      notified: false,
    },
    { onConflict: 'email', ignoreDuplicates: true }
  )

  return response
}
