import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/lib/validations/inquiry";
import { generateReferenceNo } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod validation
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      name,
      companyName,
      email,
      phoneOrWhatsApp,
      country,
      interestedCategory,
      estimatedQty,
      message,
      productId,
      website_field_hp,
    } = parsed.data;

    // Honeypot check
    if (website_field_hp) {
      return NextResponse.json(
        { error: "Spam detection triggered" },
        { status: 400 }
      );
    }

    const referenceNo = generateReferenceNo();

    // 2. Persist to Database
    const inquiry = await prisma.inquiry.create({
      data: {
        referenceNo,
        status: "NEW",
        name,
        companyName,
        email,
        phoneOrWhatsApp: phoneOrWhatsApp || null,
        country,
        interestedCategory: interestedCategory || null,
        estimatedQty: estimatedQty || null,
        message,
        items: productId
          ? {
              create: {
                productId: productId,
              },
            }
          : undefined,
      },
    });

    // 3. Create Audit Log
    await prisma.auditLog.create({
      data: {
        action: "INQUIRY_RECEIVED",
        details: JSON.stringify({
          inquiryId: inquiry.id,
          referenceNo,
          companyName,
          email,
          country,
        }),
        ipAddress: req.headers.get("x-forwarded-for") || "local",
      },
    });

    return NextResponse.json({
      success: true,
      referenceNo,
      message: "Inquiry received successfully",
    });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
