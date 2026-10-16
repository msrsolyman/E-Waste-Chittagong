import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/lib/validations/inquiry";
import { generateReferenceNo } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Rate Limiting: 15 inquiries per hour per IP
    const rateCheck = checkRateLimit("public-inquiry", clientIp, 15, 60 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many inquiries submitted from this connection. Please try again later or contact our office directly via email." },
        { status: 429 }
      );
    }

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

    let validProductId: string | null = null;
    if (productId) {
      const matched = await prisma.product.findFirst({
        where: {
          OR: [{ id: productId }, { slug: productId }],
        },
        select: { id: true },
      });
      if (matched) {
        validProductId = matched.id;
      }
    }

    // 2. Persist to Database
    const referenceNo = generateReferenceNo();
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
        items: validProductId
          ? {
              create: {
                productId: validProductId,
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
