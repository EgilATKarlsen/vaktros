import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and auth handler routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/handler/')
  ) {
    return NextResponse.next();
  }
  
  // Check for session cookies to determine if user is authenticated
  const stackSession = request.cookies.get('stack-session');
  const sessionCookie = request.cookies.get('__session');
  
  const hasSession = stackSession || sessionCookie;
  
  // If trying to access auth pages with session, redirect to dashboard
  if (pathname.startsWith('/handler/sign-in') && hasSession) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 