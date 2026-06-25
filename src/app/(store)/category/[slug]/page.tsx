import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/store/product-card";
import { Pagination } from "@/components/store/pagination";
import { getCategoryBySlug, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return {
    title: category?.name ?? "Category",
    description: category?.description ?? "Aangan Foods menu category.",
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const sort = typeof query.sort === "string" ? query.sort : "newest";
  const page = typeof query.page === "string" ? Number(query.page) || 1 : 1;
  const result = await getProducts({ categorySlug: slug, sort, page });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-bold uppercase text-[#d94a2b]">Category</p>
        <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">{category.name}</h1>
        {category.description ? (
          <p className="mt-3 text-[#76513d]">{category.description}</p>
        ) : null}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {result.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-8">
        <Pagination
          page={result.page}
          totalPages={result.totalPages}
          basePath={`/category/${slug}`}
          params={{ sort }}
        />
      </div>
    </div>
  );
}
