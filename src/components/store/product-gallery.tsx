"use client";

import { CldImage } from "next-cloudinary";
import Image from "next/image";
import * as React from "react";
import { ProductCard } from "@/lib/data";
import {
  cloudinaryImageConfig,
  isCloudinaryDisplayConfigured,
} from "@/lib/cloudinary-image";
import { cn } from "@/lib/utils";

export function ProductGallery({ product }: { product: ProductCard }) {
  const images = product.images.length
    ? product.images
    : [{ id: "placeholder", url: product.imageUrl, altText: product.imageAlt }];
  const [active, setActive] = React.useState(images[0]);
  const activePublicId =
    "cloudinaryPublicId" in active ? active.cloudinaryPublicId : undefined;

  return (
    <div className="grid gap-3">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-[#e8d3b8] bg-[#f8ead5]">
        {activePublicId && isCloudinaryDisplayConfigured ? (
          <CldImage
            src={activePublicId}
            alt={active.altText}
            width="1000"
            height="1000"
            crop={{
              type: "auto",
              source: true,
            }}
            config={cloudinaryImageConfig}
            className="h-full w-full object-cover"
            priority
          />
        ) : (
          <Image
            src={active.url}
            alt={active.altText}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        )}
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image) => {
            const publicId =
              "cloudinaryPublicId" in image ? image.cloudinaryPublicId : undefined;

            return (
              <button
                key={image.id}
                type="button"
                className={cn(
                  "focus-ring relative aspect-square overflow-hidden rounded-md border bg-white",
                  active.id === image.id ? "border-[#2f7d4f]" : "border-[#e8d3b8]",
                )}
                onClick={() => setActive(image)}
                aria-label={`View ${image.altText}`}
              >
                {publicId && isCloudinaryDisplayConfigured ? (
                  <CldImage
                    src={publicId}
                    alt={image.altText}
                    width="240"
                    height="240"
                    crop={{
                      type: "auto",
                      source: true,
                    }}
                    config={cloudinaryImageConfig}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={image.url}
                    alt={image.altText}
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
