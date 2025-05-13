import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const noCacheHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'Pragma': 'no-cache'
}

export async function middleware(request) {
  const url = request.nextUrl.clone()
  const path = url.pathname
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  console.log('Middleware - Current path:', path); // Debug log
  console.log('Middleware - Token role:', token?.role); // Debug log

  // 1. Always allow verify-email route
  if (path === '/verify-email') {
    return NextResponse.next()
  }

  // 2. Handle API routes and public assets
  if (path.startsWith('/api') || 
      path.startsWith('/_next') || 
      path.includes('.') || 
      ['/favicon.ico', '/robots.txt'].includes(path)) {
    return NextResponse.next()
  }

  // 3. Public routes (available to everyone)
  const publicRoutes = ['/', '/auth/error', '/job/listing', '/companies/listing']
  if (publicRoutes.includes(path)) {
    return NextResponse.next()
  }

  // 4. Auth-only routes (for logged-out users)
  const authOnlyRoutes = ['/login', '/signup', '/forgotPassword', '/verify_email']
  if (authOnlyRoutes.includes(path)) {
    if (token) {
      url.pathname = getDefaultRedirect(token)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // 5. Handle unauthenticated users
  if (!token) {
    url.pathname = '/login'
    url.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // 6. Handle users without role
  if (!token.role || token.role === 'none') {
    if (path !== '/select-role') {
      url.pathname = '/select-role'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // 7. Applicant routes
  if (token.role === 'job_seeker') { // Changed from 'applicant' to 'job_seeker'
    if (path === '/upload-resume' && !token.has_resume) {
      return NextResponse.next({ headers: noCacheHeaders })
    }
    
    if (path.startsWith('/companies') && !path.startsWith('/companies/listing')) {
      url.pathname = token.has_resume ? '/applicant/dashboard' : '/upload-resume'
      return NextResponse.redirect(url, { headers: noCacheHeaders })
    }
    
    if (path.startsWith('/applicant') || 
        path === '/companies/listing' || 
        path === '/job/listing' ||
        path === '/upload-resume') {
      return NextResponse.next({ headers: noCacheHeaders })
    }
    
    url.pathname = token.has_resume ? '/applicant/dashboard' : '/upload-resume'
    return NextResponse.redirect(url, { headers: noCacheHeaders })
  }

  // 8. Recruiter routes
  if (token.role === 'recruiter') {
    if (path === '/companies/create' && !token.has_company) {
      return NextResponse.next({ headers: noCacheHeaders })
    }
    
    if (path.startsWith('/applicant')) {
      url.pathname = token.has_company ? `/companies/${token.company_id}/dashboard` : '/companies/create'
      return NextResponse.redirect(url, { headers: noCacheHeaders })
    }
    
    if (path.startsWith('/companies') || 
        path === '/job/listing' ||
        path === '/companies/create') {
      return NextResponse.next({ headers: noCacheHeaders })
    }
    
    url.pathname = token.has_company ? `/companies/${token.company_id}/dashboard` : '/companies/create'
    return NextResponse.redirect(url, { headers: noCacheHeaders })
  }

  return NextResponse.next()
}

function getDefaultRedirect(token) {
  if (!token) return '/login'
  if (!token.role || token.role === 'none') return '/select-role'
  if (token.role === 'job_seeker') return token.has_resume ? '/applicant/dashboard' : '/upload-resume'
  if (token.role === 'recruiter') return token.has_company ? `/companies/${token.company_id}/dashboard` : '/companies/create'
  return '/'
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}