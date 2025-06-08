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
      // Redirect to home if already authenticated
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access a protected route,
  // redirect to login with callbackUrl
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Handle role-based access control for authenticated users
  const userRole = token.role || token.user?.role; // Adjust based on your token structure
  
  // // If user has a role (not "none") and tries to access select-role, redirect them away
  // if (pathname === '/select-role' && userRole && userRole !== 'none') {
  //   // Redirect based on their role or to a default page
  //   if (userRole === 'job_seeker') {
  //     return NextResponse.redirect(new URL('/jobs', request.url));
  //   } else if (userRole === 'recruiter') {
  //     return NextResponse.redirect(new URL('/companies/listing', request.url));
  //   } else {
  //     // Default redirect for other roles
  //     return NextResponse.redirect(new URL('/', request.url));
  //   }
  // }

  // If user has no role (role is "none") and tries to access protected routes other than onboarding,
  // redirect them to select-role
  if ((!userRole || userRole === 'none') && 
      !matchesPattern(pathname, ONBOARDING_ROUTES) && 
      !matchesPattern(pathname, PUBLIC_ROUTES) && 
      !matchesPattern(pathname, AUTH_ROUTES)) {
    return NextResponse.redirect(new URL('/select-role', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
};