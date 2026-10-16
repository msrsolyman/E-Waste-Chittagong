import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Fetch categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      nameEn,
      nameBn,
      nameZh,
      nameJa,
      descriptionEn,
      descriptionBn,
      descriptionZh,
      descriptionJa,
      imageUrl,
      displayOrder,
    } = body;

    if (!nameEn) {
      return NextResponse.json(
        { error: "Category name in English is required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let baseSlug = nameEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    let slug = baseSlug;
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      slug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const category = await prisma.category.create({
      data: {
        slug,
        nameEn,
        nameBn: nameBn || null,
        nameZh: nameZh || null,
        nameJa: nameJa || null,
        descriptionEn: descriptionEn || null,
        descriptionBn: descriptionBn || null,
        descriptionZh: descriptionZh || null,
        descriptionJa: descriptionJa || null,
        imageUrl: imageUrl || "/images/products/pcb-motherboards.jpg",
        displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
      },
      include: {
        _count: { select: { products: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CATEGORY_CREATED",
        details: JSON.stringify({ categoryId: category.id, nameEn, slug }),
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
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
      nameEn,
      nameBn,
      nameZh,
      nameJa,
      descriptionEn,
      descriptionBn,
      descriptionZh,
      descriptionJa,
      imageUrl,
      displayOrder,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        nameEn: nameEn !== undefined ? nameEn : undefined,
        nameBn: nameBn !== undefined ? nameBn : undefined,
        nameZh: nameZh !== undefined ? nameZh : undefined,
        nameJa: nameJa !== undefined ? nameJa : undefined,
        descriptionEn: descriptionEn !== undefined ? descriptionEn : undefined,
        descriptionBn: descriptionBn !== undefined ? descriptionBn : undefined,
        descriptionZh: descriptionZh !== undefined ? descriptionZh : undefined,
        descriptionJa: descriptionJa !== undefined ? descriptionJa : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : undefined,
      },
      include: {
        _count: { select: { products: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CATEGORY_UPDATED",
        details: JSON.stringify({ categoryId: id, nameEn: updated.nameEn }),
      },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
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
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    // Safety check: ensure category does not have associated products
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category: it is currently assigned to ${productCount} products. Please reassign or delete those products first to preserve catalog integrity.`,
        },
        { status: 400 }
      );
    }

    const deleted = await prisma.category.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CATEGORY_DELETED",
        details: JSON.stringify({ categoryId: id, nameEn: deleted.nameEn, slug: deleted.slug }),
      },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
