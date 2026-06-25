"use client";

import { useUser } from "@clerk/nextjs";
import * as React from "react";
import { ProductCard } from "@/lib/data";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  imageAlt: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isLoading: boolean;
  addItem: (product: ProductCard, quantity?: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);
const STORAGE_KEY = "aangan-bazaar-cart";

function readLocalCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeLocalCart(items: CartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function cartPayload(items: CartItem[]) {
  return items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setItems(readLocalCart());
      setIsLoading(false);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  React.useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    const sync = async () => {
      setIsLoading(true);
      const localItems = readLocalCart();
      await fetch("/api/cart/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartPayload(localItems) }),
      });
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = (await response.json()) as { items: CartItem[] };
        setItems(data.items);
        writeLocalCart(data.items);
      }
      setIsLoading(false);
    };

    void sync();
  }, [isLoaded, isSignedIn]);

  const persist = React.useCallback(
    async (nextItems: CartItem[]) => {
      setItems(nextItems);
      writeLocalCart(nextItems);
    },
    [setItems],
  );

  const addItem = React.useCallback(
    async (product: ProductCard, quantity = 1) => {
      const next = [...items];
      const existing = next.find((item) => item.productId === product.id);
      const nextQuantity = Math.min(
        (existing?.quantity ?? 0) + quantity,
        product.stock,
        25,
      );

      if (existing) {
        existing.quantity = nextQuantity;
      } else {
        next.push({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl,
          imageAlt: product.imageAlt,
          quantity: Math.max(1, nextQuantity),
        });
      }

      await persist(next);

      if (isSignedIn) {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id, quantity: nextQuantity }),
        });
      }
    },
    [isSignedIn, items, persist],
  );

  const updateItem = React.useCallback(
    async (productId: string, quantity: number) => {
      const next = items
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock, 25)) }
            : item,
        )
        .filter((item) => item.quantity > 0);

      await persist(next);

      if (isSignedIn) {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        });
      }
    },
    [isSignedIn, items, persist],
  );

  const removeItem = React.useCallback(
    async (productId: string) => {
      const next = items.filter((item) => item.productId !== productId);
      await persist(next);

      if (isSignedIn) {
        await fetch(`/api/cart?productId=${productId}`, { method: "DELETE" });
      }
    },
    [isSignedIn, items, persist],
  );

  const clearCart = React.useCallback(() => {
    void persist([]);
  }, [persist]);

  const value = React.useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      isLoading,
      addItem,
      updateItem,
      removeItem,
      clearCart,
    }),
    [addItem, clearCart, isLoading, items, removeItem, updateItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
