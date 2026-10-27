import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSuperDashboardData } from "@/lib/analytics-service";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const rangeParam = searchParams.get("range") || "30d";
    const validRange = ["today", "7d", "30d", "all"].includes(rangeParam)
      ? (rangeParam as "today" | "7d" | "30d" | "all")
      : "30d";

    const data = await getSuperDashboardData(validRange);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch analytics";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
