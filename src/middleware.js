// src/middleware.js
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
  '/companies/create',
];

const matchesPattern = (path, patterns) => {
  return patterns.some((pattern) => {
    const regexPattern = pattern.replace(/\[([^\]]+)\]/g, '[^/]+').replace(/\//g, '\\/');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  });
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log('[Middleware] Processing request:', { pathname });

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  console.log('[Middleware] Token fetched:', {
    hasToken: !!token,
    role: token?.role || token?.user?.role,
    hasCompany: token?.user?.has_company,
    companyId: token?.user?.company_id,
  });

  // Force session refresh
  await fetch('http://localhost:3000/api/auth/session', { cache: 'no-store' });
  const updatedToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  console.log('[Middleware] Updated token after refresh:', {
    role: updatedToken?.role || updatedToken?.user?.role,
    hasCompany: updatedToken?.user?.has_company,
    companyId: updatedToken?.user?.company_id,
  });

  if (matchesPattern(pathname, PUBLIC_ROUTES)) {
    console.log('[Middleware] Allowing access to public route:', pathname);
    return NextResponse.next();
  }

  if (matchesPattern(pathname, AUTH_ROUTES)) {
    if (token) {
      console.log('[Middleware] User authenticated, redirecting to / from:', pathname);
      return NextResponse.redirect(new URL('/', request.url));
    }
    console.log('[Middleware] Allowing access to auth route:', pathname);
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    console.log('[Middleware] No token, redirecting to login:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  const userRole = updatedToken?.role || updatedToken?.user?.role;
  console.log('[Middleware] User role:', userRole);

  if (pathname === '/select-role' && userRole && userRole !== 'none') {
    let redirectPath;
    if (userRole === 'job_seeker') {
      redirectPath = '/jobs';
    } else if (userRole === 'recruiter') {
      redirectPath = updatedToken?.user?.has_company
        ? `/companies/${updatedToken.user.company_id}/dashboard`
        : '/companies/listing';
    } else {
      redirectPath = '/';
    }
    console.log('[Middleware] User has role, redirecting from /select-role to:', redirectPath);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (
    (!userRole || userRole === 'none') &&
    !matchesPattern(pathname, ONBOARDING_ROUTES) &&
    !matchesPattern(pathname, PUBLIC_ROUTES) &&
    !matchesPattern(pathname, AUTH_ROUTES)
  ) {
    console.log('[Middleware] No role, redirecting to /select-role from:', pathname);
    return NextResponse.redirect(new URL('/select-role', request.url));
  }

  console.log('[Middleware] Allowing access to route:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|api).*)'],
};