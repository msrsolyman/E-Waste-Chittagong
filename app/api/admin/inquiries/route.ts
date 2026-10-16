import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const inquiries = await prisma.inquiry.findMany({
      where: status && status !== "ALL" ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: { select: { id: true, titleEn: true, slug: true } },
          },
        },
      },
    });

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("Fetch inquiries error:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ error: "Inquiry ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const updated = await prisma.inquiry.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "INQUIRY_UPDATED",
        details: JSON.stringify({
          inquiryId: id,
          referenceNo: updated.referenceNo,
          status: updated.status,
          updatedBy: user.email,
        }),
      },
    });

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error("Update inquiry error:", error);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Inquiry ID is required" }, { status: 400 });
    }

    const targetInquiry = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!targetInquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Delete related items first
    await prisma.inquiryItem.deleteMany({
      where: { inquiryId: id },
    });

    // Delete inquiry
    await prisma.inquiry.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "INQUIRY_DELETED",
        details: JSON.stringify({
          inquiryId: id,
          referenceNo: targetInquiry.referenceNo,
          companyName: targetInquiry.companyName,
          deletedBy: user.email,
        }),
      },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Delete inquiry error:", error);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
