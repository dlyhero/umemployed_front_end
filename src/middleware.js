// middleware.js
export { default } from "next-auth/middleware";


export const config = {
  matcher: [
    "/companies/:path*",
    "/jobs/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/api/:path*", // Ensure API routes are also protected if needed
  ]
};