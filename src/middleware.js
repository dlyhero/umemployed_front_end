import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

// Public routes accessible to everyone (logged-in or not)
const PUBLIC_ROUTES = [
  "/",         // homepage
  "/auth/error"
]

// Routes only accessible to logged-out users
const ROUTES_FOR_LOGGED_OUT_USERS = [
  "/login",
  "/signup",
  "/verify_email",
  "/forgotPassword",
  "/auth/error"
]

// Route patterns
const AUTH_API_PATTERN = /^\/api\/auth\/.*/
const APPLICANT_PATTERN = /^\/applicant\/.*/
const RECRUITER_PATTERN = /^\/companies\/.*/

const ROLE_SELECTION = "/select-role"

export async function middleware(req) {
  const url = req.nextUrl.clone()
  const path = url.pathname

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // 1. Always allow auth API for everyone
  if (AUTH_API_PATTERN.test(path)) {
    return NextResponse.next()
  }
  
  // 2. Handle logged-out users (no token)
  if (!token) {
    // Redirect to login if trying to access protected route
    if (!ROUTES_FOR_LOGGED_OUT_USERS.includes(path) && !PUBLIC_ROUTES.includes(path)) {
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // 3. Prevent logged-in users from accessing auth-only routes
  if (ROUTES_FOR_LOGGED_OUT_USERS.includes(path)) {
    if (token.role === "none") {
      url.pathname = ROLE_SELECTION
    } else if (token.role === "applicant") {
      url.pathname = "/applicant/dashboard"
    } else if (token.role === "recruiter") {
      url.pathname = "/companies/dashboard"
    }
    return NextResponse.redirect(url)
  }

  // 4. Handle users with role "none"
  if (token.role === "none") {
    // Allow access to role selection and public routes
    if (path === ROLE_SELECTION || PUBLIC_ROUTES.includes(path)) {
      return NextResponse.next()
    }
    // Redirect all other requests to role selection
    url.pathname = ROLE_SELECTION
    return NextResponse.redirect(url)
  }

  // 5. Public routes handling for logged-in users with valid roles
  if (PUBLIC_ROUTES.includes(path)) {
    // Allow access to public routes for users with valid roles
    return NextResponse.next()
  }

  // 6. Handle applicants
  if (token.role === "applicant") {
    if (!APPLICANT_PATTERN.test(path) && path !== "/api/auth/signout") {
      url.pathname = "/applicant/dashboard"
      return NextResponse.redirect(url)
    }
  }

  // 7. Handle recruiters
  if (token.role === "recruiter") {
    if (!RECRUITER_PATTERN.test(path) && path !== "/api/auth/signout") {
      url.pathname = "/companies/dashboard"
      return NextResponse.redirect(url)
    }
  }

  // 8. Allow all other valid cases
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|svg)$).*)",
  ],
}