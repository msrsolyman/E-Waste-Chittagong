import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { jwtVerify } from "jose";

const intlMiddleware = createMiddleware(routing);

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "ewc_chittagong_dev_jwt_secret_key_secure_2026_xyz"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin Routes (Completely separate from multilingual public routes)
  if (pathname.startsWith("/admin")) {
    if (pathname.startsWith("/admin/login")) {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get("ewc_admin_session")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(sessionCookie, JWT_SECRET);
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("ewc_admin_session");
      return res;
    }

    return NextResponse.next();
  }

  // Handle locale routing for public pages
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|brand|images|.*\\..*).*)",
  ],
};
