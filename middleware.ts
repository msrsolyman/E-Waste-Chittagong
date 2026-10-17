import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { jwtVerify } from "jose";

const intlMiddleware = createMiddleware(routing);

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "FATAL SECURITY ERROR: JWT_SECRET environment variable must be set in production!"
      );
    }
    return new TextEncoder().encode(
      "ewc_chittagong_dev_jwt_secret_key_secure_2026_xyz"
    );
  }
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin Routes (Completely separate from multilingual public routes)
  if (pathname.startsWith("/admin")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-admin-pathname", pathname);

    if (pathname.startsWith("/admin/login")) {
      const sessionCookie = request.cookies.get("ewc_admin_session")?.value;
      if (sessionCookie) {
        try {
          await jwtVerify(sessionCookie, getJwtSecret());
          return NextResponse.redirect(new URL("/admin", request.url));
        } catch {
          const res = NextResponse.next({ request: { headers: requestHeaders } });
          res.cookies.delete("ewc_admin_session");
          return res;
        }
      }
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    const sessionCookie = request.cookies.get("ewc_admin_session")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(sessionCookie, getJwtSecret());
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("ewc_admin_session");
      return res;
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
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
