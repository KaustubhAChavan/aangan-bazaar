import type { Metadata } from "next";
import { CartView } from "@/components/store/cart-view";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-7">
        <p className="text-sm font-bold uppercase text-[#d94a2b]">Cart</p>
        <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">Review your items</h1>
      </div>
      <CartView />
    </div>
  );
}
