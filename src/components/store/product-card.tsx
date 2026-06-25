import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { ProductCard as ProductCardType } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: ProductCardType }) {
  return (
    <Card className="group grid overflow-hidden">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#f8ead5]">
          <Image
            src={product.imageUrl}
            alt={product.imageAlt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          {product.stock <= 8 && product.stock > 0 ? (
            <div className="absolute left-3 top-3">
              <Badge variant="warning">Only {product.stock} left</Badge>
            </div>
          ) : null}
        </div>
      </Link>
      <div className="grid gap-4 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="muted">{product.category.name}</Badge>
            {product.isFeatured ? <Badge>Featured</Badge> : null}
          </div>
          <Link
            href={`/product/${product.slug}`}
            className="block text-base font-bold leading-6 text-[#2b1b12] hover:text-[#2f7d4f]"
          >
            {product.name}
          </Link>
          <p className="line-clamp-2 min-h-10 text-sm leading-5 text-[#76513d]">
            {product.shortDescription}
          </p>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-lg font-bold text-[#2b1b12]">
              {formatCurrency(product.price)}
            </div>
            {product.compareAtPrice ? (
              <div className="text-xs text-[#94715e] line-through">
                {formatCurrency(product.compareAtPrice)}
              </div>
            ) : null}
          </div>
          <AddToCartButton product={product} className="shrink-0" />
        </div>
      </div>
    </Card>
  );
}
