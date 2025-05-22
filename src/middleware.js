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

const RECRUITER_ROUTES = [
  '/companies',
];

const APPLICANT_ROUTES = [
  '/applicant',
];

const ONBOARDING_ROUTES = [
  '/select-role',
  '/upload-resume',
  '/company/create',
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

// Helper function to redirect user based on their state
function handleAuthenticatedRedirect(token, request) {
  // First-time login flow
  if (!token.role || token.role === 'none') {
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
    
    console.log('Middleware - Path:', pathname);
    console.log('Middleware - Token:', token);

    // Public routes are accessible to everyone
    if (matchesPattern(pathname, PUBLIC_ROUTES)) {
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
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Handle onboarding routes
    if (matchesPattern(pathname, ONBOARDING_ROUTES)) {
      if (pathname === '/select-role' || pathname.startsWith('/select-role/')) {
        if (token.role && token.role !== 'none') {
          return handleAuthenticatedRedirect(token, request);
        }
      } 
      else if (pathname === '/upload-resume' || pathname.startsWith('/upload-resume/')) {
        if (token.role !== 'job_seeker' || token.has_resume) {
          return handleAuthenticatedRedirect(token, request);
        }
      }
      else if (pathname === '/company/create' || pathname.startsWith('/company/create/')) {
        if (token.role !== 'recruiter' || token.has_company) {
          return handleAuthenticatedRedirect(token, request);
        }
      }
      return NextResponse.next();
    }

    // Role-based access control
    if (pathname.startsWith('/companies/')) {
      if (token.role !== 'recruiter') {
        return redirectToDashboard(token, request);
      }
    }
    
    if (pathname.startsWith('/applicant/')) {
      if (token.role !== 'job_seeker') {
        return redirectToDashboard(token, request);
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Redirect to homepage on any error (including session expiration or server issues)
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api|).*)',
    '/companies',
    '/applicant'
  ],
};