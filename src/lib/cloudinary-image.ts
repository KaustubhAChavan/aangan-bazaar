import { getCldImageUrl, type GetCldImageUrlConfig } from "next-cloudinary";

export const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const isCloudinaryDisplayConfigured = Boolean(cloudinaryCloudName);

export const cloudinaryImageConfig: GetCldImageUrlConfig = {
  cloud: {
    cloudName: cloudinaryCloudName || "demo",
  },
};

export function getCloudinarySquareImageUrl(publicId: string, size = 1200) {
  return getCldImageUrl(
    {
      src: publicId,
      width: size,
      height: size,
      crop: {
        type: "auto",
        source: true,
      },
    },
    cloudinaryImageConfig,
  );
}
