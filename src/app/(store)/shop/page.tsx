import type { Metadata } from "next";
import { ProductCard } from "@/components/store/product-card";
import { Pagination } from "@/components/store/pagination";
import { ShopFilters } from "@/components/store/shop-filters";
import { getActiveCategories, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse Aangan Foods meals, snacks, pickles, chutneys, and sweets by category, search, and price sorting.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "newest";
  const page = typeof params.page === "string" ? Number(params.page) || 1 : 1;
  const [categories, result] = await Promise.all([
    getActiveCategories(),
    getProducts({ q, categorySlug: category, sort, page }),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-7">
        <p className="text-sm font-bold uppercase text-[#d94a2b]">Shop</p>
        <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">All products</h1>
      </div>
      <ShopFilters categories={categories} q={q} category={category} sort={sort} />
      {result.products.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {result.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-[#e8d3b8] bg-white p-8 text-center">
          <h2 className="text-xl font-bold">No products found</h2>
          <p className="mt-2 text-[#76513d]">Try a different search or category.</p>
        </div>
      )}
      <div className="mt-8">
        <Pagination
          page={result.page}
          totalPages={result.totalPages}
          basePath="/shop"
          params={{ q, category, sort }}
        />
      </div>
    </div>
  );
}
