import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      titleEn,
      titleBn,
      titleZh,
      titleJa,
      categoryId,
      grade,
      origin,
      packaging,
      minOrderQuantity,
      shortDescEn,
      shortDescBn,
      shortDescZh,
      shortDescJa,
      fullDescEn,
      fullDescBn,
      fullDescZh,
      fullDescJa,
      status,
      imageUrl,
    } = body;

    if (!titleEn || !categoryId || !shortDescEn) {
      return NextResponse.json(
        { error: "Title, category, and short description in English are required" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const baseSlug = titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

    const product = await prisma.product.create({
      data: {
        slug,
        status: status || "DRAFT",
        categoryId,
        titleEn,
        titleBn: titleBn || null,
        titleZh: titleZh || null,
        titleJa: titleJa || null,
        shortDescEn,
        shortDescBn: shortDescBn || null,
        shortDescZh: shortDescZh || null,
        shortDescJa: shortDescJa || null,
        fullDescEn: fullDescEn || shortDescEn,
        fullDescBn: fullDescBn || null,
        fullDescZh: fullDescZh || null,
        fullDescJa: fullDescJa || null,
        grade: grade || null,
        origin: origin || "Chittagong, Bangladesh",
        packaging: packaging || null,
        minOrderQuantity: minOrderQuantity || null,
        images: JSON.stringify(imageUrl ? [imageUrl] : ["/images/products/pcb-motherboards.jpg"]),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "PRODUCT_CREATED",
        details: JSON.stringify({ productId: product.id, titleEn, slug }),
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();

    const updated = await prisma.product.update({
      where: { id },
      data: { status },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "PRODUCT_STATUS_CHANGED",
        details: JSON.stringify({ productId: id, status }),
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
