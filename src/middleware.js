import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const url = request.nextUrl.clone();
  const path = url.pathname;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // 1. Skip static files and API routes
  if (path.startsWith('/_next') || path.startsWith('/api') || path.includes('.')) {
    return NextResponse.next();
  }

  // 2. Define public routes and patterns
  const publicRoutes = ['/', '/jobs', '/companies/listing', '/blog', '/about', '/contact', '/help', '/pricing'];
  const publicPatterns = [
    /^\/companies\/[^\/]+\/details$/,
    /^\/companies\/[^\/]+\/joblisting$/,
    /^\/jobs\/[^\/]+\/details$/
  ];

  if (publicRoutes.includes(path) || publicPatterns.some(pattern => pattern.test(path))) {
    return NextResponse.next();
  }

  // 3. Handle auth routes (login, signup, etc.)
  const authRoutes = ['/login', '/signup', '/forgot-password', '/verify_email', '/reset-password'];
  if (authRoutes.includes(path)) {
    if (token) {
      url.pathname = token.role === 'none' ? '/select-role' : getDashboardPath(token);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 4. Handle logout
  if (path === '/') {
    const response = NextResponse.redirect(new URL('/', url));
    response.cookies.delete('next-auth.session-token');
    return response;
  }

  // 5. Redirect unauthenticated users to login
  if (!token) {
    url.pathname = '/';
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }

  // 6. Handle role selection flow
  if (token.role === 'none') {
    if (path !== '/select-role') {
      url.pathname = '/select-role';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 7. Prevent access to select-role if role is already set
  if (path === '/select-role') {
    url.pathname = getDashboardPath(token);
    return NextResponse.redirect(url);
  }

  // 8. Role-based routing
  const dashboardPath = getDashboardPath(token);
  const allowedPaths = getAllowedPaths(token);

  if (!allowedPaths.some(allowedPath => path.startsWith(allowedPath))) {
    url.pathname = dashboardPath;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

function getDashboardPath(token) {
  if (!token?.role) return '/';
  if (token.role === 'job_seeker') {
    return token.has_resume ? '/applicant/dashboard' : '/upload-resume';
  }
  if (token.role === 'recruiter') {
    return token.has_company ? `/companies/${token.company_id}/dashboard` : '/companies/create';
  }
  return '/';
}

function getAllowedPaths(token) {
  const basePaths = ['/settings', '/notifications', '/messages', '/profile'];
  if (token?.role === 'job_seeker') {
    return [...basePaths, '/applicant', '/jobs', '/companies/listing', '/upload-resume'];
  }
  if (token?.role === 'recruiter') {
    return [...basePaths, '/companies', '/jobs', '/applicants'];
  }
  return [];
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};