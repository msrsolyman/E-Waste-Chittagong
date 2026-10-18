import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

function maskEmail(email: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) return "••••@••••";
  const name = parts[0];
  const domain = parts[1];
  if (name.length <= 2) {
    return `${name[0]}***@${domain}`;
  }
  return `${name.slice(0, 2)}***${name.slice(-1)}@${domain}`;
}

function maskCompanyName(company: string): string {
  if (!company) return "";
  if (company.length <= 4) return company;
  return `${company.slice(0, 3)}***${company.slice(-2)}`;
}

export async function GET(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Rate Limiting: 60 tracking queries per hour per IP to prevent brute-forcing
    const rateCheck = checkRateLimit("public-track-inquiry", clientIp, 60, 60 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many tracking requests. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref")?.trim().toUpperCase();

    if (!ref || ref.length < 5) {
      return NextResponse.json(
        { error: "Please provide a valid inquiry reference number (e.g. EWC-2026-1001)." },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.findUnique({
      where: { referenceNo: ref },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                titleEn: true,
                titleBn: true,
                grade: true,
              },
            },
          },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: `No inquiry record found matching reference "${ref}". Please check the number or contact our logistics desk.` },
        { status: 404 }
      );
    }

    // Determine current milestone step (1 through 5)
    let currentStep = 1;
    switch (inquiry.status) {
      case "NEW":
        currentStep = 1;
        break;
      case "CONTACTED":
        currentStep = 2;
        break;
      case "IN_PROGRESS":
        currentStep = 3;
        break;
      case "QUOTED":
        currentStep = 4;
        break;
      case "CLOSED":
        currentStep = 5;
        break;
      default:
        currentStep = 1;
    }

    // Return sanitized public tracking data (privacy-safe: no raw phone numbers, no admin notes, no raw client IP)
    return NextResponse.json({
      success: true,
      inquiry: {
        referenceNo: inquiry.referenceNo,
        status: inquiry.status,
        currentStep,
        companyNameMasked: maskCompanyName(inquiry.companyName),
        emailMasked: maskEmail(inquiry.email),
        country: inquiry.country,
        interestedCategory: inquiry.interestedCategory,
        estimatedQty: inquiry.estimatedQty,
        createdAt: inquiry.createdAt,
        updatedAt: inquiry.updatedAt,
        linkedProduct: inquiry.items[0]?.product
          ? {
              slug: inquiry.items[0].product.slug,
              titleEn: inquiry.items[0].product.titleEn,
              titleBn: inquiry.items[0].product.titleBn,
              grade: inquiry.items[0].product.grade,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Tracking API error:", error);
    return NextResponse.json(
      { error: "Internal server error while tracking inquiry." },
      { status: 500 }
    );
  }
}
