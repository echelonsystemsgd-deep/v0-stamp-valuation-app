import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  
  const url = new URL(request.url)
  return NextResponse.redirect(new URL('/', url.origin), {
    status: 303,
  })
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  
  const url = new URL(request.url)
  return NextResponse.redirect(new URL('/', url.origin), {
    status: 303,
  })
}
