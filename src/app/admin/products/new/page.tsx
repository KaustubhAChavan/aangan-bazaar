import Link from "next/link";
import { ProductForm } from "@/components/forms/product-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { createProduct } from "@/app/admin/products/actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  if (!categories.length) {
    return (
      <Card className="p-8 text-center">
        <h1 className="text-2xl font-black text-[#2b1b12]">Create a category first</h1>
        <p className="mt-2 text-[#76513d]">Products need a category before they can be added.</p>
        <Button asChild className="mt-5">
          <Link href="/admin/categories">Manage categories</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div>
      <p className="text-sm font-bold uppercase text-[#d94a2b]">Products</p>
      <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">Add product</h1>
      <div className="mt-6">
        <ProductForm categories={categories} action={createProduct} submitLabel="Create product" />
      </div>
    </div>
  );
}
