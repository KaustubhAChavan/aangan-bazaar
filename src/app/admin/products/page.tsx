import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/form-controls";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function toggleProduct(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const isActive = String(formData.get("isActive")) === "true";
  await prisma.product.update({ where: { id }, data: { isActive: !isActive } });
  revalidatePath("/admin/products");
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = await prisma.product.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase text-[#d94a2b]">Products</p>
          <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">Manage products</h1>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>
      <form className="mt-6 flex gap-3">
        <Input name="q" defaultValue={q} placeholder="Search by name or SKU" />
        <Button type="submit">Search</Button>
      </form>
      <Card className="mt-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f8ead5] text-[#4a3124]">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8d3b8]">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <p className="font-bold text-[#2b1b12]">{product.name}</p>
                    <p className="text-xs text-[#94715e]">{product.sku}</p>
                  </td>
                  <td className="px-4 py-3">{product.category.name}</td>
                  <td className="px-4 py-3">{formatCurrency(product.price.toString())}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    <Badge variant={product.isActive ? "success" : "muted"}>{product.isActive ? "Active" : "Inactive"}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                      </Button>
                      <form action={toggleProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <input type="hidden" name="isActive" value={String(product.isActive)} />
                        <Button type="submit" variant="ghost" size="sm">
                          {product.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
