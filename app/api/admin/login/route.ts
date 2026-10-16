import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { isRateLimited, recordFailedAttempt, resetRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. Check if client IP is currently locked out (5 failed attempts per 15 min)
    const rateCheck = isRateLimited("admin-login", clientIp, 5);
    if (rateCheck.isLimited) {
      const minutesRemaining = Math.max(1, Math.ceil((rateCheck.resetAt - Date.now()) / 60000));
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Account access is temporarily locked. Please try again in ${minutesRemaining} minute(s).`,
        },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Constant-time check mitigation
    const dummyHash = "$2a$12$e80yq9g6GkC9Wl5J74qTDuP1X.b7t3gXjR92wMkJcRkI8a67m8QWe";
    const passwordHashToCompare = user?.passwordHash || dummyHash;
    const isValid = await verifyPassword(password, passwordHashToCompare);

    if (!user || !user.isActive || !isValid) {
      const failure = recordFailedAttempt("admin-login", clientIp, 5, 15 * 60 * 1000);
      return NextResponse.json(
        {
          error: "Invalid email or password",
          remainingAttempts: failure.remaining,
        },
        { status: 401 }
      );
    }

    // Reset rate limiter on successful authentication
    resetRateLimit("admin-login", clientIp);

    // Create session token
    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "SUPER_ADMIN" | "CONTENT_MANAGER",
    });

    // Record login in audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "ADMIN_LOGIN",
        details: JSON.stringify({ email: user.email, role: user.role }),
        ipAddress: req.headers.get("x-forwarded-for") || "local",
      },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
