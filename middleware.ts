import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get current user session. Crucial: getUser() performs an API request to verify the token,
  // whereas getSession() only checks the token locally (which is less secure).
  const { data: { user } } = await supabase.auth.getUser()

  const url = new URL(request.url)
  const path = url.pathname

  // 1. If not logged in and accessing protected routes -> redirect to /login
  if (!user && (path.startsWith('/dashboard') || path.startsWith('/admin') || path.startsWith('/reset-password'))) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectedFrom', path)
    return NextResponse.redirect(redirectUrl)
  }

  // 2. If logged in, fetch user role to check access rights
  if (user) {
    // If user is trying to access /login or /signup, redirect to respective dashboard
    if (path.startsWith('/login') || path.startsWith('/signup')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      const role = profile?.role ?? 'user'
      if (role === 'admin' || role === 'staff') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If accessing /dashboard, redirect admins and staff to /admin
    if (path.startsWith('/dashboard')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      const role = profile?.role ?? 'user'
      if (role === 'admin' || role === 'staff') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }

    // If accessing /admin, ensure they are an admin or staff
    if (path.startsWith('/admin')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      const role = profile?.role ?? 'user'
      if (role !== 'admin' && role !== 'staff') {
        // Redirect standard users / sellers to the unauthorized access page
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (optional, if you want middleware to ignore API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
