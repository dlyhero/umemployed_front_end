import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

// Public routes accessible to everyone (logged-in or not)
const PUBLIC_ROUTES = [
  "/",                     // homepage
  "/auth/error",
  "/job/listing",          // job listings
  "/companies/listing",    // company listings
  "/job/[id]",             // individual job view
  "/companies/[id]"        // individual company view
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
const PUBLIC_LISTING_PATTERNS = [
  /^\/job\/listing/,
  /^\/companies\/listing/,
  /^\/job\/[^/]+$/,       // individual job view
  /^\/companies\/[^/]+$/  // individual company view
]

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
    // Allow access to public routes and listing pages
    const isPublicRoute = PUBLIC_ROUTES.includes(path) || 
                         PUBLIC_LISTING_PATTERNS.some(pattern => pattern.test(path))
    
    if (!isPublicRoute && !ROUTES_FOR_LOGGED_OUT_USERS.includes(path)) {
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
      url.pathname = token.has_resume ? "/applicant/dashboard" : "/upload-resume"
    } else if (token.role === "recruiter") {
      url.pathname = token.has_company ? `/companies/${token.company_id}/dashboard` : "/companies/create"
    }
    return NextResponse.redirect(url)
  }

  // 4. Handle users with role "none"
  if (token.role === "none") {
    // Allow access to role selection and public routes
    if (path === ROLE_SELECTION || PUBLIC_ROUTES.includes(path) || 
        PUBLIC_LISTING_PATTERNS.some(pattern => pattern.test(path))) {
      return NextResponse.next()
    }
    // Redirect all other requests to role selection
    url.pathname = ROLE_SELECTION
    return NextResponse.redirect(url)
  }

  // 5. Public routes handling for logged-in users with valid roles
  if (PUBLIC_ROUTES.includes(path) || 
      PUBLIC_LISTING_PATTERNS.some(pattern => pattern.test(path))) {
    // Allow access to public routes for users with valid roles
    return NextResponse.next()
  }

  // 6. Handle applicants
  if (token.role === "applicant") {
    // Allow access to applicant routes and public listings
    if (APPLICANT_PATTERN.test(path) || 
        path === "/api/auth/signout" ||
        PUBLIC_LISTING_PATTERNS.some(pattern => pattern.test(path))) {
      return NextResponse.next()
    }
    
    // Redirect to appropriate page based on resume status
    url.pathname = token.has_resume ? "/applicant/dashboard" : "/upload-resume"
    return NextResponse.redirect(url)
  }

  // 7. Handle recruiters
  if (token.role === "recruiter") {
    // Allow access to recruiter routes and public listings
    if (RECRUITER_PATTERN.test(path) || 
        path === "/api/auth/signout" ||
        PUBLIC_LISTING_PATTERNS.some(pattern => pattern.test(path))) {
      return NextResponse.next()
    }
    
    // Redirect to appropriate page based on company status
    url.pathname = token.has_company ? `/companies/${token.company_id}/dashboard` : "/companies/create"
    return NextResponse.redirect(url)
  }

  // 8. Allow all other valid cases
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|svg)$).*)",
  ],
}