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

    const body = await req.json();
    const {
      id,
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
      isFeatured,
      imageUrl,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (titleEn !== undefined) updateData.titleEn = titleEn;
    if (titleBn !== undefined) updateData.titleBn = titleBn;
    if (titleZh !== undefined) updateData.titleZh = titleZh;
    if (titleJa !== undefined) updateData.titleJa = titleJa;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (grade !== undefined) updateData.grade = grade;
    if (origin !== undefined) updateData.origin = origin;
    if (packaging !== undefined) updateData.packaging = packaging;
    if (minOrderQuantity !== undefined) updateData.minOrderQuantity = minOrderQuantity;
    if (shortDescEn !== undefined) updateData.shortDescEn = shortDescEn;
    if (shortDescBn !== undefined) updateData.shortDescBn = shortDescBn;
    if (shortDescZh !== undefined) updateData.shortDescZh = shortDescZh;
    if (shortDescJa !== undefined) updateData.shortDescJa = shortDescJa;
    if (fullDescEn !== undefined) updateData.fullDescEn = fullDescEn;
    if (fullDescBn !== undefined) updateData.fullDescBn = fullDescBn;
    if (fullDescZh !== undefined) updateData.fullDescZh = fullDescZh;
    if (fullDescJa !== undefined) updateData.fullDescJa = fullDescJa;
    if (imageUrl !== undefined) {
      updateData.images = JSON.stringify([imageUrl]);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: { select: { nameEn: true } } },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "PRODUCT_UPDATED",
        details: JSON.stringify({ productId: id, titleEn: updated.titleEn, status: updated.status }),
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

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Check if product is referenced in buyer inquiries
    const inquiryCount = await prisma.inquiryItem.count({
      where: { productId: id },
    });

    if (inquiryCount > 0) {
      // Archive instead of hard delete to preserve quotation history
      const archived = await prisma.product.update({
        where: { id },
        data: { status: "ARCHIVED" },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "PRODUCT_ARCHIVED_INQUIRY_PROTECTION",
          details: JSON.stringify({ productId: id, inquiryCount }),
        },
      });

      return NextResponse.json({
        success: true,
        archived: true,
        message: `Product is linked to ${inquiryCount} buyer inquiries. To protect RFQ history, it has been moved to ARCHIVED status instead of permanently deleted.`,
        product: archived,
      });
    }

    const deleted = await prisma.product.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "PRODUCT_DELETED",
        details: JSON.stringify({ productId: id, titleEn: deleted.titleEn, slug: deleted.slug }),
      },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
