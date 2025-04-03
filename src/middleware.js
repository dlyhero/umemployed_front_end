import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req;

    // Define route categories
    const loggedOutOnlyRoutes = ['/', '/login', '/signup', '/verify_email', '/forgotPassword']; // Added '/signup'
    const selectRoleRoute = '/select-role';
    const publicApiRoutes = ['/api/auth', '/auth/error'];

    // 1. First check for select-role route
    if (pathname.startsWith(selectRoleRoute)) {
      if (!token) return NextResponse.redirect(new URL('/login', req.url));
      if (token.role && token.role !== 'none') {
        return NextResponse.redirect(
          token.role === 'applicant' 
            ? new URL('/applicant/dashboard', req.url)
            : new URL('/recruiter/dashboard', req.url)
        );
      }
      return NextResponse.next(); // Only allow if role is 'none'
    }

    // 2. Handle public API routes
    if (publicApiRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // 3. Check authentication status
    if (!token) {
      // Unauthenticated users can only access loggedOutOnlyRoutes
      if (loggedOutOnlyRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // 4. At this point, user is authenticated - enforce role restrictions
    if (token.role === 'none') {
      // Users with 'none' role can ONLY access select-role
      return NextResponse.redirect(new URL(selectRoleRoute, req.url));
    }

    // 5. Handle role-specific routes for authenticated users with roles
    if (token.role === 'applicant') {
      if (pathname.startsWith('/applicant')) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/applicant/dashboard', req.url));
    }

    if (token.role === 'recruiter') {
      if (pathname.startsWith('/recruiter')) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/recruiter/dashboard', req.url));
    }

    // Fallback - should never reach here
    return NextResponse.redirect(new URL('/login', req.url));
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // Always run middleware
    },
    pages: {
      signIn: "/login",
      error: "/error",
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};