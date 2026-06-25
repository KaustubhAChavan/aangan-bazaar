import Link from "next/link";
import { Utensils } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#e8d3b8] bg-[#2b1b12] text-[#fff8ec]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f4b63f] text-[#2b1b12]">
              <Utensils className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold">Aangan Foods</span>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#f1dcc4]">
            A single-vendor homemade food shop for comfort meals, breakfast boxes,
            snacks, pickles, chutneys, and sweets with secure checkout.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Shop</h3>
          <div className="mt-3 grid gap-2 text-sm text-[#f1dcc4]">
            <Link href="/shop">All products</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/account/orders">Orders</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Policies</h3>
          <div className="mt-3 grid gap-2 text-sm text-[#f1dcc4]">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy-policy">Privacy policy</Link>
            <Link href="/return-refund-policy">Return and refund policy</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-[#dfc6ae]">
        Built for fresh-food MVP operations on Vercel, Neon, Cloudinary, Clerk, and Razorpay.
      </div>
    </footer>
  );
}
