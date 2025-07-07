import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { publicRoutes, authRoutes } from "./core/config/routes";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  if (intlResponse instanceof NextResponse && intlResponse.redirected) {
    return intlResponse;
  }

  const token = request.cookies.get('next-auth.session-token')?.value;
  const { pathname } = request.nextUrl;

  // Check if the path starts with /dashboard
  if (pathname.includes('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return intlResponse;
  }

  if (publicRoutes.includes(pathname)) {
    return intlResponse;
  }

  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
