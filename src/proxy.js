import { NextResponse } from 'next/server';

// This proxy function checks protected routes before allowing access
export function proxy(request) {
  // Check for the short-lived access cookie issued by the server
  if (!request.cookies.get('promptgrid_access')) {
    // Create login page URL
    const login = new URL('/login', request.url);

    // Save the current route so user can return after login
    login.searchParams.set(
      'next',
      request.nextUrl.pathname + request.nextUrl.search
    );

    // Redirect unauthenticated user to login page
    return NextResponse.redirect(login);
  }

  // If token exists, allow the request to continue
  return NextResponse.next();
}

// Routes protected by this proxy
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/prompts/:path*',
    '/payment/:path*',
  ],
};
