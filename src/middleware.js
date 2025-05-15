import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const noCacheHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'Pragma': 'no-cache'
}

export async function middleware(request) {
 
}

function getDefaultRedirect(token) {
  if (!token) return '/login'
  if (!token.role || token.role === 'none') return '/select-role'
  if (token.role === 'job_seeker') return token.has_resume ? '/applicant/dashboard' : '/upload-resume'
  if (token.role === 'recruiter') return token.has_company ? `/companies/${token.company_id}/dashboard` : '/companies/create'
  return '/'
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}