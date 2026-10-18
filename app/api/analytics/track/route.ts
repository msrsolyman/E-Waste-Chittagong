import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Map common ISO country codes to readable English names
const COUNTRY_NAME_MAP: Record<string, string> = {
  BD: "Bangladesh",
  CN: "China",
  JP: "Japan",
  AE: "United Arab Emirates",
  US: "United States",
  DE: "Germany",
  SG: "Singapore",
  VN: "Vietnam",
  KR: "South Korea",
  IN: "India",
  GB: "United Kingdom",
  MY: "Malaysia",
  NL: "Netherlands",
  AU: "Australia",
  CA: "Canada",
  TH: "Thailand",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path = typeof body.path === "string" ? body.path.slice(0, 255) : "/";
    const referer = typeof body.referer === "string" ? body.referer.slice(0, 500) : null;
    const device = typeof body.device === "string" ? body.device.slice(0, 50) : "Desktop";
    const browser = typeof body.browser === "string" ? body.browser.slice(0, 50) : "Chrome";

    // Skip tracking admin routes or internal api routes to preserve accuracy
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      null;

    // Detect Country from Edge headers (Vercel / Cloudflare)
    const rawCountryCode = (
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      "BD"
    ).toUpperCase();

    const countryCode = rawCountryCode.length === 2 ? rawCountryCode : "BD";
    const country = COUNTRY_NAME_MAP[countryCode] || countryCode;

    // Detect City / Region from Edge headers
    const rawCity =
      req.headers.get("x-vercel-ip-city") ||
      (countryCode === "BD" ? "Chittagong" : null);
    const city = rawCity ? decodeURIComponent(rawCity).slice(0, 100) : null;

    const rawRegion = req.headers.get("x-vercel-ip-country-region");
    const region = rawRegion ? decodeURIComponent(rawRegion).slice(0, 100) : null;

    // Persist to database asynchronously without blocking client
    await prisma.visitorLog.create({
      data: {
        ip: clientIp ? clientIp.slice(0, 45) : null,
        country,
        countryCode,
        city: city || (country === "Bangladesh" ? "Chittagong" : "Overseas"),
        region,
        path,
        device,
        browser,
        referer,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    // Analytics failures must never crash public traffic
    console.error("[Analytics Track Error]:", err);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
