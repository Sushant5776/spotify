import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET as string,
  })
  const { pathname } = req.nextUrl

  // Allow the requests if the following in true
  // 1) Its a request for next-auth session & provider fetching
  // 2) The token exists

  if (pathname === '/login' && token) {
    return NextResponse.redirect('/')
  }

  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  // Redirect them to login if they don't have token and are requesting a protected route
  if (!token && pathname !== '/login') {
    return NextResponse.redirect('/login')
  }
}
