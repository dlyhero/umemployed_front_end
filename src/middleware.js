// middleware.ts
import { NextResponse } from 'next/server'
import  { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request) {
  const path = request.nextUrl.pathname
  const token = await getToken({ req: request })

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/jobs',
    '/companies/listing',
    '/blog',
    '/about',
    '/contact'
  ]

  // If it's a public route, don't do anything
  if (publicRoutes.includes(path) || 
      path.startsWith('/_next') || 
      path.startsWith('/api') ||
      path.startsWith('/static')) {
    return NextResponse.next()
  }

  // If not authenticated and trying to access protected route
  if (!token) {
    const HomeUrl = new URL('/', request.url)
    HomeUrl.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(HomeUrl)
  }

  // If user hasn't selected a role yet
  if (!token.role || token.role === 'none') {
    if (path !== '/select-role') {
      return NextResponse.redirect(new URL('/select-role', request.url))
    }
    return NextResponse.next()
  }

  // Role-based routing
  if (token.role === 'job_seeker') {
    if (!path.startsWith('/applicant') && 
        !path.startsWith('/jobs') && 
        !path.startsWith('/profile')) {
      return NextResponse.redirect(new URL('/applicant/dashboard', request.url))
    }
  } else if (token.role === 'recruiter') {
    if (!path.startsWith('/companies') && 
        !path.startsWith('/jobs') && 
        !path.startsWith('/profile')) {
      return NextResponse.redirect(new URL('/companies/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}