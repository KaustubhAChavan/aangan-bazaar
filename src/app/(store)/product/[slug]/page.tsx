import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { ProductCard } from "@/components/store/product-card";
import { ProductGallery } from "@/components/store/product-gallery";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.name ?? "Product",
    description: product?.shortDescription ?? "Aangan Foods menu item.",
    openGraph: {
      title: product?.name,
      description: product?.shortDescription,
      images: product?.imageUrl ? [product.imageUrl] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.id, product.category.id);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery product={product} />
        <div className="lg:pt-6">
          <Link
            href={`/category/${product.category.slug}`}
            className="text-sm font-bold uppercase text-[#d94a2b]"
          >
            {product.category.name}
          </Link>
          <h1 className="mt-3 text-4xl font-black leading-tight text-[#2b1b12]">
            {product.name}
          </h1>
          <p className="mt-4 text-lg leading-8 text-[#76513d]">{product.shortDescription}</p>
          <div className="mt-6 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-black text-[#2b1b12]">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice ? (
              <span className="text-lg text-[#94715e] line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.stock > 0 ? (
              <Badge variant="success">In stock: {product.stock}</Badge>
            ) : (
              <Badge variant="danger">Out of stock</Badge>
            )}
            {product.sku ? <Badge variant="muted">SKU {product.sku}</Badge> : null}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton product={product} className="sm:w-52" />
            <Link
              href="/cart"
              className="inline-flex h-10 items-center justify-center rounded-md border border-[#dcc3a2] bg-white px-4 text-sm font-semibold hover:bg-[#fff0d1]"
            >
              View cart
            </Link>
          </div>
          <div className="mt-8 border-t border-[#e8d3b8] pt-6">
            <h2 className="text-xl font-bold text-[#2b1b12]">Description</h2>
            <p className="mt-3 whitespace-pre-line leading-7 text-[#654332]">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {related.length ? (
        <section className="mt-14">
          <h2 className="text-2xl font-black text-[#2b1b12]">Related products</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
