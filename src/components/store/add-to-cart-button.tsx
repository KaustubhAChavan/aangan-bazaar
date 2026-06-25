"use client";

import { Check, ShoppingBag } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/store/cart-provider";
import { ProductCard } from "@/lib/data";

export function AddToCartButton({
  product,
  quantity = 1,
  className,
}: {
  product: ProductCard;
  quantity?: number;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const disabled = product.stock <= 0 || !product.isActive;

  async function handleAdd() {
    setPending(true);
    await addItem(product, quantity);
    setAdded(true);
    setPending(false);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <Button
      type="button"
      className={className}
      disabled={disabled || pending}
      onClick={handleAdd}
      aria-label={`Add ${product.name} to cart`}
    >
      {added ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      )}
      {disabled ? "Out of stock" : added ? "Added" : "Add to cart"}
    </Button>
  );
}
