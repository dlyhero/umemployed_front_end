import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const noCacheHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'Pragma': 'no-cache'
};

export async function middleware(request) {
  console.log('req:', request.nextUrl.pathname);
  const url = request.nextUrl.clone();
  const path = url.pathname;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });


  const knownRoutePatterns = [
    /^\/login/,
    /^\/signup/,
    /^\/forgot-password/,
    /^\/verify-email/,
    /^\/reset-password/,
    /^\/applicant/,
    /^\/companies/,
    /^\/jobs/,
    /^\/upload-resume/,
    /^\/profile/,
    /^\/settings/,
    /^\/notifications/,
    /^\/messages/,
    /^\/select-role/,
    /^\/blog/,
    /^\/about/,
    /^\/contact/,
    /^\/help/,
    /^\/pricing/
  ];

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

  // 2. Public routes
  const publicRoutes = [
    '/',
    '/jobs',
    '/companies/listing',
    `/companies/joblisitng/${token.company_id}`,
    '/blog',
    '/about',
    '/contact',
    '/help',
    '/pricing',
    '404',
    "not-found" // explicitly allow the error page
  ];

  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // 3. Auth-only routes (for logged-out users)
  const authOnlyRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/verify-email',
    '/reset-password'
  ];

  if (authOnlyRoutes.includes(path)) {
    if (token) {
      url.pathname = getDefaultRedirect(token);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 4. Handle unauthenticated users
  if (!token) {
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // 5. Handle users without role
  if (!token.role || token.role === 'none') {
    if (path !== '/select-role') {
      url.pathname = '/select-role';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 6. Job Seeker routes
 // 6. Job Seeker routes
if (token.role === 'job_seeker') {
  const isCompanyDetailsPage = path.includes('/companies/') && path.endsWith('/details');
  const isCompanyJoblisting = path.includes('/companies/joblisitng/');

  const allowedPaths = [
    '/applicant',
    '/jobs',
    `/companies/listing/${token.company_id}`,
    `/companies/${token.company_id}/details`,
    `/companies/joblisitng/${token.company_id}`,
    '/companies/listing', // in case you show all companies
    '/upload-resume',
    '/profile',
    '/settings',
    '/notifications',
    '/messages'
  ];

  if (!allowedPaths.some(p => path.startsWith(p)) && !isCompanyDetailsPage && !isCompanyJoblisting) {
    url.pathname = token.has_resume ? '/applicant/dashboard' : '/upload-resume';
    return NextResponse.redirect(url, { headers: noCacheHeaders });
  }

  if (path === '/upload-resume' && token.has_resume) {
    url.pathname = '/applicant/dashboard';
    return NextResponse.redirect(url, { headers: noCacheHeaders });
  }

  return NextResponse.next({ headers: noCacheHeaders });
}


  // 7. Recruiter routes
  if (token.role === 'recruiter') {
    const allowedPaths = [
      '/companies',
      '/jobs',
      '/applicants',
      '/settings',
      '/notifications',
      '/messages'
    ];

    if (!allowedPaths.some(p => path.startsWith(p))) {
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

  // 8. Fallback: rewrite to 404 if no earlier conditions matched
  const isKnownRoute = knownRoutePatterns.some(pattern => pattern.test(path));
  
  if (!isKnownRoute && !publicRoutes.includes(path)) {
    url.pathname = 'not-found';
    return NextResponse.rewrite(url);
  }
  return NextResponse.rewrite(url);
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
