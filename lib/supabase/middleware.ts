import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public routes that don't require auth
  const publicRoutes = ['/', '/login', '/signup', '/auth/callback', '/teachers']
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    (pathname.startsWith('/teachers/') && !pathname.endsWith('/edit'))

  // If not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Role-based route protection
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Admin-only routes
    if (pathname.startsWith('/admin') && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Booking requires maker role
    if (pathname.startsWith('/book') && profile?.role === 'teacher') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Teacher profile edit requires ownership
    if (pathname.match(/^\/teachers\/[^/]+\/edit$/)) {
      const slug = pathname.split('/')[2]
      const { data: teacherProfile } = await supabase
        .from('teacher_profiles')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!teacherProfile || teacherProfile.id !== user.id) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return response
}
