import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req;

    // Define route categories
    const loggedOutOnlyRoutes = ['/', '/login', '/verify_email', '/forgotPassword'];
    const selectRoleRoute = '/select-role';
    const publicApiRoutes = ['/api/auth', '/auth/error'];
    const applicantRoutes = ['/applicant'];
    const recruiterRoutes = ['/recruiter'];

    // 1. Handle select-role route (special case)
    if (pathname.startsWith(selectRoleRoute)) {
      if (!token) return NextResponse.redirect(new URL('/login', req.url));
      if (token.role && token.role !== 'none') {
        return NextResponse.redirect(
          token.role === 'applicant' 
            ? new URL('/applicant/dashboard', req.url)
            : new URL('/recruiter/dashboard', req.url)
        );
      }
      return NextResponse.next(); // Allow access only for role 'none'
    }

    // 2. Block logged-in users from logged-out only routes
    if (loggedOutOnlyRoutes.some(route => pathname.startsWith(route))) {
      if (token) {
        return NextResponse.redirect(
          token.role === 'none'
            ? new URL(selectRoleRoute, req.url)
            : token.role === 'applicant'
              ? new URL('/applicant/dashboard', req.url)
              : new URL('/recruiter/dashboard', req.url)
        );
      }
      return NextResponse.next(); // Allow access for logged-out users
    }

    // 3. Allow public API routes
    if (publicApiRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // 4. Handle protected routes

    // Block unauthenticated access
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // STRICT ENFORCEMENT: Users with role 'none' can ONLY access /select-role
    if (token.role === 'none') {
      return NextResponse.redirect(new URL(selectRoleRoute, req.url));
    }

    // Enforce role-specific routes
    const isApplicant = token.role === 'applicant';
    const isRecruiter = token.role === 'recruiter';

    if (isApplicant && !pathname.startsWith('/applicant')) {
      return NextResponse.redirect(new URL('/applicant/dashboard', req.url));
    }

    if (isRecruiter && !pathname.startsWith('/recruiter')) {
      return NextResponse.redirect(new URL('/recruiter/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // Always run middleware
    },
    pages: {
      signIn: "/login",
      error: "/auth/error",
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};