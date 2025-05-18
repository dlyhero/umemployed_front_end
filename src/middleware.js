// middleware.js
import { NextResponse } from 'next/server'
import { verifyToken } from './lib/auth' // Your token verification utility

// Define route patterns
const publicRoutes = ['/', '/jobs', '/companies/listing', '/blog', '/about', '/contact', '/help', '/pricing']
const publicPatterns = [
  /^\/companies\/[^\/]+\/details$/,
  /^\/companies\/[^\/]+\/joblisting$/,
  /^\/jobs\/[^\/]+\/details$/
]
const authRoutes = ['/login', '/signup', '/forgot-password', '/verify-email', '/reset-password']
const selectRoleRoute = '/select-role'
const recruiterSetupRoute = '/company/create'
const applicantSetupRoute = '/resume-upload'
const protectedRecruiterPrefix = '/companies'
const protectedApplicantPrefix = '/applicant'

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value
  const hasCompletedSetup = request.cookies.get('setup_complete')?.value === 'true'

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(pathname) || 
                       publicPatterns.some(pattern => pattern.test(pathname)) ||
                       authRoutes.includes(pathname)

  // Allow public routes to proceed
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Handle auth routes for logged-in users
  if (authRoutes.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Verify token for protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verify token validity
  const isValidToken = await verifyToken(token)
  if (!isValidToken) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('token')
    response.cookies.delete('role')
    return response
  }

  // Handle role selection flow
  if (!role && pathname !== selectRoleRoute) {
    return NextResponse.redirect(new URL(selectRoleRoute, request.url))
  }

  if (pathname === selectRoleRoute && role) {
    return NextResponse.redirect(new URL(
      role === 'recruiter' ? recruiterSetupRoute : applicantSetupRoute, 
      request.url
    ))
  }

  // Handle setup completion flow
  if (!hasCompletedSetup && 
      pathname !== recruiterSetupRoute && 
      pathname !== applicantSetupRoute) {
    return NextResponse.redirect(new URL(
      role === 'recruiter' ? recruiterSetupRoute : applicantSetupRoute, 
      request.url
    ))
  }

  // Role-based route protection
  if (role === 'recruiter' && pathname.startsWith(protectedApplicantPrefix)) {
    return NextResponse.redirect(new URL('/company/create', request.url))
  }

  if (role === 'applicant' && pathname.startsWith(protectedRecruiterPrefix)) {
    return NextResponse.redirect(new URL('/resume-upload', request.url))
  }

  // Allow the request to proceed
  return NextResponse.next()
}

// Specify the paths middleware should run on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 