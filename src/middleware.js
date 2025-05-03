import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Cache control headers to prevent caching of sensitive pages
const noCacheHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'Pragma': 'no-cache'
}

export async function middleware(request) {
  const url = request.nextUrl.clone()
  const path = url.pathname
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // 1. Handle API routes and public assets
  if (path.startsWith('/api') || 
      path.startsWith('/_next') || 
      path.includes('.') || 
      ['/favicon.ico', '/robots.txt'].includes(path)) {
    return NextResponse.next()
  }

  // 2. Public routes (available to everyone)
  const publicRoutes = ['/', '/auth/error', '/job/listing', '/companies/listing']
  if (publicRoutes.includes(path)) {
    return NextResponse.next()
  }

  // 3. Auth-only routes (for logged-out users)
  const authOnlyRoutes = ['/login', '/signup', '/verify-email', '/forgotPassword']
  if (authOnlyRoutes.includes(path)) {
    if (token) {
      // Logged-in users trying to access auth pages get redirected
      url.pathname = getDefaultRedirect(token)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // 4. Handle unauthenticated users
  if (!token) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 5. Handle users without role
  if (token.role === 'none') {
    if (path !== '/select-role') {
      url.pathname = '/select-role'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // 6. Applicant routes
  if (token.role === 'applicant') {
    // Block access to any recruiter pages
    if (path.startsWith('/companies') && !path.startsWith('/companies/listing')) {
      url.pathname = token.has_resume ? '/applicant/dashboard' : '/upload-resume'
      return NextResponse.redirect(url, { headers: noCacheHeaders })
    }
    
    // Allow applicant routes and shared listings
    if (path.startsWith('/applicant') || path === '/companies/listing' || path === '/job/listing') {
      return NextResponse.next({ headers: noCacheHeaders })
    }
    
    // Redirect all other requests
    url.pathname = token.has_resume ? '/applicant/dashboard' : '/upload-resume'
    return NextResponse.redirect(url, { headers: noCacheHeaders })
  }

  // 7. Recruiter routes
  if (token.role === 'recruiter') {
    // Block access to any applicant pages
    if (path.startsWith('/applicant')) {
      url.pathname = token.has_company ? `/companies/${token.company_id}/dashboard` : '/companies/create'
      return NextResponse.redirect(url, { headers: noCacheHeaders })
    }
    
    // Allow recruiter routes and shared listings
    if (path.startsWith('/companies') || path === '/job/listing') {
      return NextResponse.next({ headers: noCacheHeaders })
    }
    
    // Redirect all other requests
    url.pathname = token.has_company ? `/companies/${token.company_id}/dashboard` : '/companies/create'
    return NextResponse.redirect(url, { headers: noCacheHeaders })
  }

  // Fallback for any unhandled cases
  return NextResponse.next()
}

// Helper function to determine default redirect
function getDefaultRedirect(token) {
  if (!token) return '/login'
  if (token.role === 'none') return '/select-role'
  if (token.role === 'applicant') return token.has_resume ? '/applicant/dashboard' : '/upload-resume'
  if (token.role === 'recruiter') return token.has_company ? `/companies/${token.company_id}/dashboard` : '/companies/create'
  return '/'
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}