import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Admin session required" }, { status: 401 });
    }

    const settings = await prisma.companySetting.findMany();
    const settingsMap: Record<string, unknown> = {};

    for (const s of settings) {
      try {
        settingsMap[s.key] = JSON.parse(s.value);
      } catch {
        settingsMap[s.key] = s.value;
      }
    }

    return NextResponse.json({
      success: true,
      settings: settingsMap,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Admin session required" }, { status: 401 });
    }

    const body = await req.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
    }

    const stringifiedValue = typeof value === "string" ? value : JSON.stringify(value);

    const updated = await prisma.companySetting.upsert({
      where: { key },
      update: {
        value: stringifiedValue,
      },
      create: {
        key,
        value: stringifiedValue,
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "SETTING_UPDATED",
        details: JSON.stringify({
          key,
          value,
          updatedAt: updated.updatedAt,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Setting ${key} updated successfully`,
      data: updated,
    });
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}
