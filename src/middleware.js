import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

// Public routes accessible to logged-out users
const PUBLIC_ROUTES = [
  "/",         // homepage
  "/login",
  "/signup",
  "/verify_email",
  "/forgotPassword",
  "/auth/error"
]

// Route patterns
const AUTH_API_PATTERN = /^\/api\/auth\/.*/
const APPLICANT_PATTERN = /^\/applicant\/.*/
const RECRUITER_PATTERN = /^\/recruiter\/.*/
const PUBLIC_PATTERN = new RegExp(`^(${PUBLIC_ROUTES.map(route => 
  route === '/' ? '\\/' : route.replace('/', '\\/')
).join('|')})$`)
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
    // Redirect to login if trying to access non-public route
    if (!PUBLIC_ROUTES.includes(path)) {
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // 3. Prevent logged-in users from accessing public routes
  if (PUBLIC_ROUTES.includes(path) && path !== "/") {
    if (token.role === "none") {
      url.pathname = ROLE_SELECTION
    } else if (token.role === "applicant") {
      url.pathname = "/applicant/dashboard"
    } else if (token.role === "recruiter") {
      url.pathname = "/companies/1024/dashboard"
    }
    return NextResponse.redirect(url)
  }

  // 4. Block homepage for logged-in users (all roles)
  if (path === "/") {
    if (token.role === "none") {
      url.pathname = ROLE_SELECTION
    } else if (token.role === "applicant") {
      url.pathname = "/applicant/dashboard"
    } else if (token.role === "recruiter") {
      url.pathname = "/companies/1024/dashboard"
    }
    return NextResponse.redirect(url)
  }

  // 5. Handle users with role "none"
  if (token.role === "none" && path !== ROLE_SELECTION && path !== "/api/auth/signout") {
    url.pathname = ROLE_SELECTION
    return NextResponse.redirect(url)
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
      url.pathname = "/companies/1024/dashboard"
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