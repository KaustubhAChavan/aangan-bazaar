"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/components/store/cart-provider";
import { formatCurrency } from "@/lib/utils";

export function CartView() {
  const { items, subtotal, updateItem, removeItem, isLoading } = useCart();
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 79;
  const total = subtotal + shipping;

  if (isLoading) {
    return <div className="rounded-lg border border-[#e8d3b8] bg-white p-8">Loading cart...</div>;
  }

  if (!items.length) {
    return (
      <div className="rounded-lg border border-[#e8d3b8] bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-[#2b1b12]">Your cart is empty</h1>
        <p className="mt-2 text-[#76513d]">Browse the shop and add something beautiful.</p>
        <Button asChild className="mt-6">
          <Link href="/shop">Start shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.productId} className="grid gap-4 p-4 sm:grid-cols-[120px_1fr]">
            <Link
              href={`/product/${item.slug}`}
              className="relative aspect-square overflow-hidden rounded-md bg-[#f8ead5]"
            >
              <Image
                src={item.imageUrl}
                alt={item.imageAlt}
                fill
                sizes="120px"
                className="object-cover"
              />
            </Link>
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div>
                <Link
                  href={`/product/${item.slug}`}
                  className="font-bold text-[#2b1b12] hover:text-[#2f7d4f]"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-[#76513d]">{formatCurrency(item.price)}</p>
                <p className="mt-2 text-xs text-[#94715e]">Stock available: {item.stock}</p>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <div className="flex h-10 items-center overflow-hidden rounded-md border border-[#dcc3a2]">
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center hover:bg-[#f8ead5]"
                    onClick={() => updateItem(item.productId, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center hover:bg-[#f8ead5]"
                    onClick={() => updateItem(item.productId, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Remove
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="h-fit p-5">
        <h2 className="text-xl font-bold text-[#2b1b12]">Order summary</h2>
        <div className="mt-5 grid gap-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery fee</span>
            <span className="font-semibold">{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
          </div>
          <div className="border-t border-[#e8d3b8] pt-3 text-base font-bold">
            <div className="flex justify-between">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
        <Button asChild size="lg" className="mt-6 w-full">
          <Link href="/checkout">Checkout</Link>
        </Button>
      </Card>
    </div>
  );
}
