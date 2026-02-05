import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware for protecting authenticated routes.
 * Checks for JWT token in localStorage (via cookie fallback for SSR).
 * Redirects to login with returnUrl if not authenticated.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected route prefixes
  const protectedPrefixes = ['/employer', '/talent'];
  const isProtectedRoute = protectedPrefixes.some(prefix => 
    pathname.startsWith(prefix)
  );

  if (isProtectedRoute) {
    // Check for auth token in cookie (set by client-side for SSR compatibility)
    const token = request.cookies.get('talentx_token')?.value;

    if (!token) {
      // Redirect to login with returnUrl
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match protected routes only
     */
    '/employer/:path*',
    '/talent/:path*',
  ],
};
