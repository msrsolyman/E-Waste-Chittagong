import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status, adminNotes } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Inquiry ID and status are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: {
        status,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "INQUIRY_STATUS_UPDATED",
        details: JSON.stringify({
          inquiryId: id,
          referenceNo: updated.referenceNo,
          newStatus: status,
          updatedBy: user.email,
        }),
      },
    });

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
