import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey)
    : null

const ROLES = ['Principal', 'Vice Principal', 'Coordinator', 'Teacher', 'Counsellor', 'Other']
const BOARDS = ['CBSE', 'ICSE', 'IGCSE', 'Other']

export async function POST(req: NextRequest) {
  if (!supabase) {
    return err('Server is not configured. Missing Supabase keys.')
  }

  try {
    const body = await req.json()
    const { full_name, email, role, board } = body

    if (!full_name?.trim()) return err('Full name is required.')
    if (!email?.trim()) return err('Email address is required.')
    if (!isValidEmail(email)) return err('Please enter a valid email address.')
    if (!ROLES.includes(role)) return err('Please select your role.')
    if (!BOARDS.includes(board)) return err('Please select your school board.')

    const normalizedEmail = email.trim().toLowerCase()
    const { error: dbError } = await supabase
      .from('waitlist')
      .insert({
        full_name: full_name.trim(),
        email: normalizedEmail,
        role,
        board,
        notified: false,
      })

    if (dbError) {
      if (dbError.code === '23505') {
        return NextResponse.json({ success: true, already: true }, { status: 200 })
      }
      return err('Something went wrong. Please try again.')
    }

    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (posthogKey) {
      fetch('https://app.posthog.com/capture/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: posthogKey,
          event: 'form_submitted',
          distinct_id: normalizedEmail,
          properties: {
            role,
            board,
            timestamp: new Date().toISOString(),
            source: 'waitlist_page',
          },
        }),
      }).catch(() => {})
    }

    return NextResponse.json({ success: true, already: false }, { status: 201 })
  } catch {
    return err('Something went wrong. Please try again.')
  }
}

function err(message: string) {
  return NextResponse.json({ success: false, message }, { status: 400 })
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
