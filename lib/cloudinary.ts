import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Configure Cloudinary server-side instance
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadOptions {
  folder?: string;
  resourceType?: "image" | "video" | "auto";
  publicId?: string;
}

export async function uploadStreamToCloudinary(
  buffer: Buffer,
  options: UploadOptions = {}
): Promise<UploadApiResponse> {
  const { folder = "ewaste-chittagong", resourceType = "auto" } = options;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        transformation:
          resourceType === "image"
            ? [{ quality: "auto", fetch_format: "auto" }]
            : undefined,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed without response"));
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

export { cloudinary };
