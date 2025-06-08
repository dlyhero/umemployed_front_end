import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define route patterns
const PUBLIC_ROUTES = [
  '/',
  '/jobs',
  '/jobs/[id]/details',
  '/companies/listing',
  '/companies/[id]/details',
  '/companies/joblisting/[id]',
];

const AUTH_ROUTES = [
  '/login',
  '/signup',
  '/forgetPassword',
  '/changePassword',
  '/verify_email',
  '/verify_email/failure',
  '/verify_email/success',
];

const ONBOARDING_ROUTES = [
  '/select-role',
  '/upload-resume',
  '/company/create',
];

const RECRUITER_ROUTES = [
  '/companies',
  '/companies/(.*)', // Match all sub-routes under /companies/
];

// Check if the path matches any pattern in the routes array
const matchesPattern = (path, patterns) => {
  return patterns.some(pattern => {
    const regexPattern = pattern
      .replace(/\[([^\]]+)\]/g, '[^/]+')
      .replace(/\//g, '\\/');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  });
};

// Helper function to redirect to the appropriate dashboard
function redirectToDashboard(token, request) {
  if (token.role === 'job_seeker') {
    return NextResponse.redirect(new URL('/applicant/dashboard', request.url));
  }
  if (token.role === 'recruiter') {
    const companyId = token.company_id || 'default';
    return NextResponse.redirect(new URL(`/companies/${companyId}/dashboard`, request.url));
  }
  return NextResponse.redirect(new URL('/', request.url));
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const userRole = token?.role || token?.user?.role;


    // Public routes are accessible to everyone
    if (matchesPattern(pathname, PUBLIC_ROUTES)) {
      return NextResponse.next();
    }

    // Authentication routes are only for non-authenticated users
    if (matchesPattern(pathname, AUTH_ROUTES)) {
      if (token) {
        return redirectToDashboard(token, request);
      }
      return NextResponse.next();
    }

    // If user is not authenticated, redirect to login with callbackUrl
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Handle onboarding routes
    if (matchesPattern(pathname, ONBOARDING_ROUTES)) {
      if (pathname === '/select-role' && userRole && userRole !== 'none') {
        return redirectToDashboard(token, request);
      }
      if (pathname === '/upload-resume' && (userRole !== 'job_seeker' || token.has_resume)) {
        return redirectToDashboard(token, request);
      }
      if (pathname === '/company/create' && (userRole !== 'recruiter' || token.has_company)) {
        return redirectToDashboard(token, request);
      }
      return NextResponse.next();
    }

    // Restrict /companies/ routes to recruiters
    if (matchesPattern(pathname, RECRUITER_ROUTES)) {
      if (userRole !== 'recruiter') {
        return redirectToDashboard(token, request);
      }
    }

    // If user has no role (role is "none") and tries to access protected routes
    if (!userRole || userRole === 'none') {
      return NextResponse.redirect(new URL('/select-role', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
};