import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description: "About Aangan Foods and its single-kitchen homemade food ordering model.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase text-[#d94a2b]">About</p>
          <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">A focused kitchen for everyday homemade food</h1>
          <p className="mt-5 text-lg leading-8 text-[#654332]">
            Aangan Foods is built as a single-admin ecommerce MVP for small-batch homemade food:
            no seller marketplace, no delivery portals, no payout complexity. The store owner
            manages the menu, food photos, customer records, orders, and contact messages
            from one clear admin area.
          </p>
          <p className="mt-4 leading-7 text-[#76513d]">
            The brand is intentionally warm and practical: homestyle meals, breakfast boxes,
            snacks, pickles, chutneys, and sweets presented with honest daily batch stock,
            secure payments, and order snapshots that stay accurate after checkout.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#e8d3b8] bg-[#f8ead5]">
          <Image
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=80"
            alt="Fresh homemade food spread"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          ["Single kitchen", "One food team controls menu capacity, pricing, order status, and customer support."],
          ["Durable records", "Orders store delivery snapshots, product names, item totals, and payment identifiers."],
          ["MVP constraints", "The stack is tuned for Vercel, Neon, Cloudinary, Clerk, and Razorpay free/test tiers."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-lg border border-[#e8d3b8] bg-white p-5">
            <h2 className="font-bold text-[#2b1b12]">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#76513d]">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
