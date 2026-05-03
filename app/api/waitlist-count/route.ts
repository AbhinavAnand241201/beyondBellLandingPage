import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey)
    : null

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ count: 0 }, { status: 200 })
  }

  const { count, error } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })

  if (error) {
    return NextResponse.json({ count: 0 }, { status: 200 })
  }

  return NextResponse.json({ count: count ?? 0 }, { status: 200 })
}
