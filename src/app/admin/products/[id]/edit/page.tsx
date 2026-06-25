import { notFound } from "next/navigation";
import { ProductForm } from "@/components/forms/product-form";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/app/admin/products/actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) {
    notFound();
  }

  async function save(formData: FormData) {
    "use server";
    await updateProduct(id, formData);
  }

  return (
    <div>
      <p className="text-sm font-bold uppercase text-[#d94a2b]">Products</p>
      <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">Edit product</h1>
      <div className="mt-6">
        <ProductForm
          categories={categories}
          action={save}
          submitLabel="Save product"
          initialProduct={{
            name: product.name,
            slug: product.slug,
            description: product.description,
            shortDescription: product.shortDescription,
            price: product.price.toString(),
            compareAtPrice: product.compareAtPrice?.toString() ?? "",
            stock: product.stock,
            sku: product.sku,
            categoryId: product.categoryId,
            isActive: product.isActive,
            isFeatured: product.isFeatured,
            images: product.images,
          }}
        />
      </div>
    </div>
  );
}
