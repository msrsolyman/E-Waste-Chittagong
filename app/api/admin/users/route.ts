import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Super Admin only" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Super Admin only" }, { status: 403 });
    }

    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role: role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "CONTENT_MANAGER",
        isActive: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_CREATED",
        details: JSON.stringify({ newUserId: newUser.id, email: newUser.email, role: newUser.role }),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Super Admin only" }, { status: 403 });
    }

    const { id, isActive, role, name, password } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Safeguard: Prevent deactivating own account
    if (id === user.id && isActive === false) {
      return NextResponse.json(
        { error: "Cannot deactivate your own active session" },
        { status: 400 }
      );
    }

    // Safeguard: Prevent demoting or deactivating the last active Super Admin
    if (targetUser.role === "SUPER_ADMIN" && (isActive === false || role === "CONTENT_MANAGER")) {
      const activeSuperAdminCount = await prisma.user.count({
        where: { role: "SUPER_ADMIN", isActive: true },
      });
      if (activeSuperAdminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot demote or deactivate the last remaining active Super Administrator" },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (role !== undefined) updateData.role = role;
    if (name !== undefined) updateData.name = name;

    if (password) {
      if (password.length < 12 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        return NextResponse.json(
          { error: "New password must be at least 12 characters and include uppercase and numeric characters" },
          { status: 400 }
        );
      }
      updateData.passwordHash = await hashPassword(password);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: password ? "USER_PASSWORD_RESET" : "USER_MODIFIED",
        details: JSON.stringify({ targetUserId: id, isActive, role, name }),
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Super Admin only" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (id === user.id) {
      return NextResponse.json({ error: "Cannot delete your own active account" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.role === "SUPER_ADMIN") {
      const activeSuperAdminCount = await prisma.user.count({
        where: { role: "SUPER_ADMIN", isActive: true },
      });
      if (activeSuperAdminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the last remaining active Super Administrator" },
          { status: 400 }
        );
      }
    }

    await prisma.auditLog.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_DELETED",
        details: JSON.stringify({ deletedUserId: id, email: targetUser.email }),
      },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
