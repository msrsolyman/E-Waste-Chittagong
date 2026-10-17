import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadStreamToCloudinary } from "@/lib/cloudinary";

// Limits
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Admin session required" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetCategory = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file was provided for upload" }, { status: 400 });
    }

    const mimeType = file.type.toLowerCase();
    const fileSize = file.size;
    const fileName = file.name;

    const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          error: `Unsupported file type (${mimeType}). Only images (JPG, PNG, WEBP, GIF, SVG) and videos (MP4, WEBM, MOV) are allowed.`,
        },
        { status: 400 }
      );
    }

    if (isImage && fileSize > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: `Image file exceeds maximum allowable size of 10MB (${(fileSize / (1024 * 1024)).toFixed(1)}MB).` },
        { status: 400 }
      );
    }

    if (isVideo && fileSize > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: `Video file exceeds maximum allowable size of 50MB (${(fileSize / (1024 * 1024)).toFixed(1)}MB).` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize folder path: ewaste-chittagong/{products|categories|gallery|general}
    const safeFolder = `ewaste-chittagong/${targetCategory.replace(/[^a-zA-Z0-9_-]/g, "")}`;

    const uploadResult = await uploadStreamToCloudinary(buffer, {
      folder: safeFolder,
      resourceType: isVideo ? "video" : "image",
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "MEDIA_UPLOADED",
        details: JSON.stringify({
          fileName,
          mimeType,
          bytes: uploadResult.bytes,
          format: uploadResult.format,
          resourceType: uploadResult.resource_type,
          publicId: uploadResult.public_id,
          secureUrl: uploadResult.secure_url,
          folder: safeFolder,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      resourceType: uploadResult.resource_type,
      bytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
    });
  } catch (error) {
    console.error("Cloudinary upload API error:", error);
    const msg = error instanceof Error ? error.message : "Failed to upload file to Cloudinary";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
