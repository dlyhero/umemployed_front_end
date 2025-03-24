// middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add custom logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token; // Simple check if user is authenticated
      },
    },
    pages: {
      signIn: "/auth/signin", // Custom sign-in page
    }
  }
);

export const config = {
  matcher: [
    "/companies/:path*",
    "/dashboard/:path*",
    // Add other protected routes
  ]
};