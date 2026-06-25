import { v2 as cloudinary } from "cloudinary";

export function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (
    !cloudName ||
    !apiKey ||
    !apiSecret ||
    cloudName === "your-cloud-name" ||
    apiKey === "your-cloudinary-key" ||
    apiSecret === "your-cloudinary-secret"
  ) {
    throw new Error(
      "Cloudinary upload credentials are not configured. Add real CLOUDINARY_* values or paste a Media Library public ID.",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

export async function uploadProductImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  if (file.size > 4 * 1024 * 1024) {
    throw new Error("Images must be 4MB or smaller.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${bytes.toString("base64")}`;

  return getCloudinary().uploader.upload(dataUri, {
    folder: "aangan-bazaar/products",
    resource_type: "image",
    transformation: [
      { width: 1200, height: 1200, crop: "limit" },
      { quality: "auto", fetch_format: "auto" },
    ],
  });
}
