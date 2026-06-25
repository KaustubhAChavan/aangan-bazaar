"use client";

import { CldImage } from "next-cloudinary";
import { ImagePlus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form-controls";
import {
  cloudinaryImageConfig,
  getCloudinarySquareImageUrl,
  isCloudinaryDisplayConfigured,
} from "@/lib/cloudinary-image";

type ImageInput = {
  url: string;
  cloudinaryPublicId: string;
  altText: string;
  sortOrder: number;
};

type CategoryOption = {
  id: string;
  name: string;
};

type InitialProduct = {
  name?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  price?: string | number;
  compareAtPrice?: string | number | null;
  stock?: number;
  sku?: string | null;
  categoryId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  images?: ImageInput[];
};

export function ProductForm({
  categories,
  action,
  initialProduct,
  submitLabel,
}: {
  categories: CategoryOption[];
  action: (formData: FormData) => Promise<void>;
  initialProduct?: InitialProduct;
  submitLabel: string;
}) {
  const router = useRouter();
  const [images, setImages] = React.useState<ImageInput[]>(initialProduct?.images ?? []);
  const [manualPublicId, setManualPublicId] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError(null);
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as {
        url?: string;
        cloudinaryPublicId?: string;
        error?: string;
      };

      if (!response.ok || !result.url || !result.cloudinaryPublicId) {
        setError(result.error ?? "Upload failed.");
      } else {
        setImages((current) => [
          ...current,
          {
            url: result.url!,
            cloudinaryPublicId: result.cloudinaryPublicId!,
            altText: initialProduct?.name ?? "Product image",
            sortOrder: current.length,
          },
        ]);
      }
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function addPublicIdImage() {
    const publicId = manualPublicId.trim();
    if (!publicId) {
      setError("Enter a Cloudinary public ID.");
      return;
    }

    try {
      setImages((current) => [
        ...current,
        {
          url: getCloudinarySquareImageUrl(publicId),
          cloudinaryPublicId: publicId,
          altText: initialProduct?.name ?? "Product image",
          sortOrder: current.length,
        },
      ]);
      setManualPublicId("");
      setError(null);
    } catch (publicIdError) {
      setError(
        publicIdError instanceof Error
          ? publicIdError.message
          : "Could not add Cloudinary image.",
      );
    }
  }

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <Card className="p-5">
        <h2 className="text-xl font-bold text-[#2b1b12]">Product details</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Name">
            <Input name="name" defaultValue={initialProduct?.name} required />
          </Field>
          <Field label="Slug">
            <Input name="slug" defaultValue={initialProduct?.slug} placeholder="Auto-generated if blank" />
          </Field>
          <Field label="Category">
            <Select name="categoryId" defaultValue={initialProduct?.categoryId ?? categories[0]?.id} required>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="SKU">
            <Input name="sku" defaultValue={initialProduct?.sku ?? ""} />
          </Field>
          <Field label="Price">
            <Input name="price" type="number" min="0" step="0.01" defaultValue={initialProduct?.price} required />
          </Field>
          <Field label="Compare at price">
            <Input name="compareAtPrice" type="number" min="0" step="0.01" defaultValue={initialProduct?.compareAtPrice ?? ""} />
          </Field>
          <Field label="Stock">
            <Input name="stock" type="number" min="0" defaultValue={initialProduct?.stock ?? 0} required />
          </Field>
          <div className="flex flex-wrap items-end gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#4b3428]">
              <input type="checkbox" name="isActive" value="true" defaultChecked={initialProduct?.isActive ?? true} />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#4b3428]">
              <input type="checkbox" name="isFeatured" value="true" defaultChecked={initialProduct?.isFeatured ?? false} />
              Featured
            </label>
          </div>
          <div className="md:col-span-2">
            <Field label="Short description">
              <Input name="shortDescription" defaultValue={initialProduct?.shortDescription} required />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Description">
              <Textarea name="description" defaultValue={initialProduct?.description} required />
            </Field>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-[#2b1b12]">Images</h2>
            <p className="mt-1 text-sm text-[#76513d]">Upload a photo or paste a Cloudinary public ID.</p>
          </div>
          <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#f4b63f] px-4 py-2 text-sm font-semibold text-[#2b1b12] hover:bg-[#dfa02f]">
            <ImagePlus className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload image"}
            <input type="file" accept="image/*" className="sr-only" onChange={uploadImage} disabled={uploading} />
          </label>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
          <Field label="Cloudinary public ID">
            <Input
              value={manualPublicId}
              onChange={(event) => setManualPublicId(event.target.value)}
              placeholder="cld-sample-5"
            />
          </Field>
          <Button
            type="button"
            variant="outline"
            className="self-end"
            onClick={addPublicIdImage}
          >
            Add public ID
          </Button>
        </div>
        {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <div key={`${image.cloudinaryPublicId}-${index}`} className="rounded-lg border border-[#e8d3b8] bg-white p-3">
              <div className="aspect-square overflow-hidden rounded-md bg-[#f8ead5]">
                {isCloudinaryDisplayConfigured ? (
                  <CldImage
                    src={image.cloudinaryPublicId}
                    alt={image.altText}
                    width="500"
                    height="500"
                    crop={{
                      type: "auto",
                      source: true,
                    }}
                    config={cloudinaryImageConfig}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image.url}
                    alt={image.altText}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <Input
                className="mt-3"
                value={image.altText}
                onChange={(event) =>
                  setImages((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, altText: event.target.value } : item,
                    ),
                  )
                }
                aria-label="Image alt text"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button type="submit">{submitLabel}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
