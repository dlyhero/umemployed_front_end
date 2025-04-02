// middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    // No additional logic needed if just redirecting
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // If no token, user is not logged in
        return !!token;
      },
    },
    pages: {
      signIn: "/login", // Redirect to login if unauthorized
      error: "/auth/error", // (Optional) Custom error page
    },
  }
);

export const config = {
  matcher: [
    "/companies/:path*",
    "/jobs/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/api/protected/:path*", // Only protect specific API routes
  ],
};