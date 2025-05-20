import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define route patterns
const PUBLIC_ROUTES = [
  '/',
  '/jobs',
  '/jobs/[id]/details',
  '/companies/listing',
  '/companies/[id]/details',
  '/companies/joblisitng/[id]', // Made sure this is properly included
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

const PROTECTED_ROUTES = [
  '/companies',
  '/applicant'
];

const ONBOARDING_ROUTES = [
  '/select-role',
  '/upload-resume',
  '/company/create',
];

// Improved pattern matching function
const matchesPattern = (path, patterns) => {
  return patterns.some(pattern => {
    const regexPattern = pattern
      .replace(/\[([^\]]+)\]/g, '([^/]+)') // Capture dynamic segments
      .replace(/\//g, '\\/');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  });
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Public routes are accessible to everyone
  if (matchesPattern(pathname, PUBLIC_ROUTES)) {
    // Special handling for joblisting route
    if (pathname.startsWith('/companies/joblisting/')) {
      return handleJobListingAccess(token, request);
    }
    return NextResponse.next();
  }

  // Authentication routes are only for non-authenticated users
  if (matchesPattern(pathname, AUTH_ROUTES)) {
    if (token) {
      return handleAuthenticatedRedirect(token, request);
    }
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access a protected route
  if (!token) {
    return handleUnauthenticatedAccess(request);
  }

  // Handle onboarding routes
  if (matchesPattern(pathname, ONBOARDING_ROUTES)) {
    return handleOnboardingRoutes(token, request);
  }

  // Role-based access control
  return handleRoleBasedAccess(token, request);
}

// New helper function for job listing access
function handleJobListingAccess(token, request) {
  const { pathname } = request.nextUrl;
  
  // If public access is allowed (based on your business logic)
  if (isPublicJobListing(pathname)) {
    return NextResponse.next();
  }
  
  // If requires authentication
  if (!token) {
    return handleUnauthenticatedAccess(request);
  }
  
  // Add any additional checks for job listing access
  return NextResponse.next();
}

function isPublicJobListing(pathname) {
  // Implement your logic to determine if a job listing should be public
  // For example, check if the job is marked as public in the database
  return true; // Change this based on your requirements
}

function handleUnauthenticatedAccess(request) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('callbackUrl', request.url);
  
  // For API routes, return JSON response instead of redirect
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401, headers: { 'Location': loginUrl.toString() } }
    );
  }
  
  return NextResponse.redirect(loginUrl);
}

function handleOnboardingRoutes(token, request) {
  const { pathname } = request.nextUrl;
  
  if (pathname === '/select-role' && token.role !== 'none') {
    return handleAuthenticatedRedirect(token, request);
  }
  
  if (pathname === '/upload-resume' && 
      (token.role !== 'job_seeker' || token.has_resume)) {
    return handleAuthenticatedRedirect(token, request);
  }
  
  if (pathname === '/company/create' && 
      (token.role !== 'recruiter' || token.has_company)) {
    return handleAuthenticatedRedirect(token, request);
  }
  
  return NextResponse.next();
}

function handleRoleBasedAccess(token, request) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/companies/') && token.role !== 'recruiter') {
    return redirectToDashboard(token, request);
  }
  
  if (pathname.startsWith('/applicant/') && token.role !== 'job_seeker') {
    return redirectToDashboard(token, request);
  }
  
  return NextResponse.next();
}

function handleAuthenticatedRedirect(token, request) {
  // If there's a callbackUrl, respect it (unless it's an auth route)
  const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
  if (callbackUrl && !isAuthRoute(callbackUrl)) {
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  }

  // First-time login flow
  if (token.role === 'none') {
    return NextResponse.redirect(new URL('/select-role', request.url));
  }
  
  if (token.role === 'job_seeker') {
    if (!token.has_resume) {
      return NextResponse.redirect(new URL('/upload-resume', request.url));
    }
    return NextResponse.redirect(new URL('/applicant/dashboard', request.url));
  }
  
  if (token.role === 'recruiter') {
    if (!token.has_company) {
      return NextResponse.redirect(new URL('/company/create', request.url));
    }
    const companyId = token.company_id || 'default';
    return NextResponse.redirect(new URL(`/companies/${companyId}/dashboard`, request.url));
  }
  
  return NextResponse.redirect(new URL('/', request.url));
}

function redirectToDashboard(token, request) {
  if (token.role === 'job_seeker') {
    return NextResponse.redirect(new URL('/applicant/dashboard', request.url));
  }
  
  if (token.role === 'recruiter' && token.company_id) {
    return NextResponse.redirect(new URL(`/companies/${token.company_id}/dashboard`, request.url));
  }
  
  return NextResponse.redirect(new URL('/', request.url));
}

function isAuthRoute(path) {
  return AUTH_ROUTES.some(route => {
    const regex = new RegExp(`^${route.replace(/\[[^\]]+\]/g, '[^/]+')}$`);
    return regex.test(path);
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
};