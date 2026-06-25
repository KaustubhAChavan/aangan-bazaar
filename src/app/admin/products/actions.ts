"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getOrCreateUserProfile, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { productSchema } from "@/lib/validations/schemas";

function parseProductForm(formData: FormData) {
  const rawImages = String(formData.get("images") ?? "[]");
  const images = JSON.parse(rawImages) as unknown;
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    shortDescription: formData.get("shortDescription"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice"),
    stock: formData.get("stock"),
    sku: formData.get("sku"),
    categoryId: formData.get("categoryId"),
    isActive: formData.get("isActive") === "true",
    isFeatured: formData.get("isFeatured") === "true",
    images,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues.at(0)?.message ?? "Invalid product.");
  }

  const data = parsed.data;
  return {
    ...data,
    slug: slugify(data.slug || data.name),
    sku: data.sku || null,
    compareAtPrice:
      data.compareAtPrice === "" || data.compareAtPrice === undefined
        ? null
        : data.compareAtPrice,
    images: data.images.map((image, index) => ({
      ...image,
      sortOrder: index,
      altText: image.altText || data.name,
    })),
  };
}

async function logAdmin(action: string, entityType: string, entityId?: string) {
  const admin = await getOrCreateUserProfile();
  if (!admin) {
    return;
  }

  await prisma.adminLog.create({
    data: {
      adminUserId: admin.id,
      action,
      entityType,
      entityId,
    },
  });
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const data = parseProductForm(formData);
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      stock: data.stock,
      sku: data.sku,
      categoryId: data.categoryId,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      images: {
        create: data.images,
      },
    },
  });
  await logAdmin("CREATE", "Product", product.id);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseProductForm(formData);
  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      stock: data.stock,
      sku: data.sku,
      categoryId: data.categoryId,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      images: {
        deleteMany: {},
        create: data.images,
      },
    },
  });
  await logAdmin("UPDATE", "Product", id);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}
