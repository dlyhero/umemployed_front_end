import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const noCacheHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'Pragma': 'no-cache'
};

export async function middleware(request) {
  const url = request.nextUrl.clone();
  const path = url.pathname;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // 1. Handle static files and API routes
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.startsWith('/static') ||
    path.includes('.') ||
    ['/favicon.ico', '/robots.txt'].includes(path)
  ) {
    return NextResponse.next();
  }

  // Define public patterns
  const isCompanyDetailsPage = /^\/companies\/[^\/]+\/details$/.test(path);
  const isCompanyJobListingPage = /^\/companies\/[^\/]+\/joblisting$/.test(path);
  const isPublicJobPage =  /^\/jobs\/[^\/]+\/details$/.test(path);

  // 2. Public routes
  const publicRoutes = [
    '/',
    '/jobs',
    '/companies/listing',
    'jobs',
    '/blog',
    '/about',
    '/contact',
    '/help',
    '/pricing',
  ];

  if (
    publicRoutes.includes(path) || 
    isCompanyDetailsPage || 
    isCompanyJobListingPage ||
    isPublicJobPage
  ) {
    return NextResponse.next();
  }

  // 3. Auth routes (login, signup, etc.)
  const authRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/verify-email',
    '/reset-password'
  ];

  if (authRoutes.includes(path)) {
    // If user is already logged in, redirect them to their dashboard
    if (token) {
      url.pathname = getDefaultRedirect(token);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 4. Handle logout
  if (path === '/') {
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('next-auth.session-token');
    return response;
  }

  // 5. Handle unauthenticated users
  if (!token) {
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // 6. Handle users without role
  if (!token.role || token.role === 'none') {
    if (path !== '/select-role') {
      url.pathname = '/select-role';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 7. Job Seeker routes
  if (token.role === 'job_seeker') {
    const allowedPaths = [
      '/applicant',
      '/jobs',
      '/companies/listing',
      '/upload-resume',
      '/profile',
      '/settings',
      '/notifications',
      '/messages'
    ];

    const isAllowed = allowedPaths.some(p => path.startsWith(p)) || 
                     isCompanyDetailsPage || 
                     isCompanyJobListingPage ||
                     isPublicJobPage;

    if (!isAllowed) {
      url.pathname = token.has_resume ? '/applicant/dashboard' : '/upload-resume';
      return NextResponse.redirect(url, { headers: noCacheHeaders });
    }

    if (path === '/upload-resume' && token.has_resume) {
      url.pathname = '/applicant/dashboard';
      return NextResponse.redirect(url, { headers: noCacheHeaders });
    }

    return NextResponse.next({ headers: noCacheHeaders });
  }

  // 8. Recruiter routes
  if (token.role === 'recruiter') {
    const allowedPaths = [
      '/companies',
      '/jobs',
      '/applicants',
      '/settings',
      '/notifications',
      '/messages'
    ];

    const isAllowed = allowedPaths.some(p => path.startsWith(p)) || 
                     isCompanyDetailsPage || 
                     isCompanyJobListingPage ||
                     isPublicJobPage;

    if (!isAllowed) {
      url.pathname = token.has_company
        ? `/companies/${token.company_id}/dashboard`
        : '/companies/create';
      return NextResponse.redirect(url, { headers: noCacheHeaders });
    }

    if (path === '/companies/create' && token.has_company) {
      url.pathname = `/companies/${token.company_id}/dashboard`;
      return NextResponse.redirect(url, { headers: noCacheHeaders });
    }

    return NextResponse.next({ headers: noCacheHeaders });
  }

  // 9. Fallback to 404 for unknown routes
  return NextResponse.rewrite(new URL('/not-found', request.url));
}

function getDefaultRedirect(token) {
  if (!token) return '/login';
  if (!token.role || token.role === 'none') return '/select-role';
  if (token.role === 'job_seeker') return token.has_resume ? '/applicant/dashboard' : '/upload-resume';
  if (token.role === 'recruiter') return token.has_company ? `/companies/${token.company_id}/dashboard` : '/companies/create';
  return '/';
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};