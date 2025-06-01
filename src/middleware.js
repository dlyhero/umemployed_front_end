middleware.js
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
    // Convert Next.js dynamic route syntax to regex
    const regexPattern = pattern
      .replace(/\[([^\]]+)\]/g, '[^/]+') // Replace [id] with regex for any character except /
      .replace(/\//g, '\\/'); // Escape forward slashes
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  });
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Public routes are accessible to everyone
  if (matchesPattern(pathname, PUBLIC_ROUTES)) {
    return NextResponse.next();
  }

  // Authentication routes are only for non-authenticated users
  if (matchesPattern(pathname, AUTH_ROUTES)) {
    if (token) {
      // If user is already logged in, redirect based on their role and onboarding status
      return handleAuthenticatedRedirect(token, request);
    }
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access a protected route,
  // redirect to login with callbackUrl
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    // Store the intended destination as a callback URL
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Handle onboarding routes
  if (matchesPattern(pathname, ONBOARDING_ROUTES)) {
    // Check specific onboarding routes
    if (pathname === '/select-role' || pathname.startsWith('/select-role/')) {
      if (token.role !== 'none') {
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
}

// Helper function to redirect user based on their state after authentication
function handleAuthenticatedRedirect(token, request) {
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
    // Use the company_id if available
    const companyId = token.company_id || 'default';
    return NextResponse.redirect(new URL(`/companies/${companyId}/dashboard`, request.url));
  }
  
  // Fallback to homepage
  return NextResponse.redirect(new URL('/', request.url));
}

// Helper function to redirect to the appropriate dashboard
function redirectToDashboard(token, request) {
  if (token.role === 'job_seeker') {
    return NextResponse.redirect(new URL('/applicant/dashboard', request.url));
  }
  
  if (token.role === 'recruiter' && token.company_id) {
    return NextResponse.redirect(new URL(`/companies/${token.company_id}/dashboard`, request.url));
  }
  
  // Fallback to homepage
  return NextResponse.redirect(new URL('/', request.url));
}

// Configure which paths middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/* (image files stored in the public folder)
     * - api/* (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
};