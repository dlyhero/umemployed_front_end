import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const { token } = req;

        // Public routes
        const publicRoutes = [
            '/login',
            '/verify_email',
            '/forgotPassword',
            '/select-role',
            '/api/auth',
            '/auth/error'
        ];
        
        if (publicRoutes.some(route => pathname.startsWith(route))) {
            return NextResponse.next();
        }

        // Strict role-based protection
        if (!token?.role || token.role === 'none') {
            return NextResponse.redirect(new URL('/select-role', req.url));
        }

        if (token.role === 'applicant' && !pathname.startsWith('/applicant')) {
            return NextResponse.redirect(new URL('/applicant/dashboard', req.url));
        }

        if (token.role === 'recruiter' && !pathname.startsWith('/recruiter')) {
            return NextResponse.redirect(new URL('/recruiter/dashboard', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
            error: "/auth/error",
        },
    }
);

export const config = {
    matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};