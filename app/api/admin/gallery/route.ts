import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { titleEn, titleBn, titleZh, titleJa, imageUrl, category, isVerified, caption } =
      await req.json();

    if (!titleEn || !imageUrl || !category) {
      return NextResponse.json(
        { error: "Title, image URL, and category are required" },
        { status: 400 }
      );
    }

    const cleanUrl = imageUrl.trim();
    if (!/^\/|^https?:\/\//i.test(cleanUrl) || /\.(exe|sh|bat|cmd|js|ts|php|py)$/i.test(cleanUrl)) {
      return NextResponse.json(
        { error: "Invalid image URL. Executable files and unsupported formats are rejected." },
        { status: 400 }
      );
    }

    const item = await prisma.galleryItem.create({
      data: {
        titleEn,
        titleBn: titleBn || null,
        titleZh: titleZh || null,
        titleJa: titleJa || null,
        imageUrl,
        category,
        isVerified: Boolean(isVerified),
        caption: caption || null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "GALLERY_ITEM_CREATED",
        details: JSON.stringify({ itemId: item.id, titleEn }),
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Gallery create error:", error);
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 });
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
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.galleryItem.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "GALLERY_ITEM_DELETED",
        details: JSON.stringify({ itemId: id }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
