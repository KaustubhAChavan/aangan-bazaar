import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, HeartHandshake, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/store/product-card";
import { getFeaturedCategories, getFeaturedProducts } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getFeaturedCategories(),
    getFeaturedProducts(),
  ]);
  const heroProduct = products[0];

  return (
    <div>
      <section className="relative min-h-[72vh] overflow-hidden bg-[#2b1b12]">
        <Image
          src={heroProduct?.imageUrl ?? "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1600&q=80"}
          alt={heroProduct?.imageAlt ?? "Aangan Foods homemade meals"}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2b1b12]/90 via-[#2b1b12]/65 to-transparent" />
        <div className="relative mx-auto flex min-h-[72vh] w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <p className="mb-4 inline-flex rounded-full bg-[#f4b63f] px-3 py-1 text-sm font-bold text-[#2b1b12]">
              Fresh homemade food, made in small batches
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-6xl">
              Aangan Foods
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#fff0d1]">
              Order comforting homemade meals, breakfast boxes, tea-time snacks,
              pickles, chutneys, and sweets from one trusted kitchen with secure checkout.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/shop">
                  Order food
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/about">Our story</Link>
              </Button>
            </div>
            {heroProduct ? (
              <p className="mt-6 text-sm font-semibold text-[#ffe0a8]">
                Today&apos;s pick: {heroProduct.name} from {formatCurrency(heroProduct.price)}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase text-[#d94a2b]">Categories</p>
            <h2 className="mt-2 text-3xl font-black text-[#2b1b12]">Browse by craving</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/shop">View all products</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-[#e8d3b8] bg-[#f8ead5]"
            >
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition group-hover:scale-105"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b1b12]/80 via-[#2b1b12]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="text-lg font-bold">{category.name}</h3>
                <p className="text-sm text-[#fff0d1]">{category._count.products} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase text-[#d94a2b]">Featured</p>
              <h2 className="mt-2 text-3xl font-black text-[#2b1b12]">Fresh from the kitchen</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        {[
          { icon: HeartHandshake, title: "One trusted kitchen", text: "A single food team manages menu, portions, prep capacity, and support." },
          { icon: ShieldCheck, title: "Secure checkout", text: "Razorpay payment verification happens on the server before orders are confirmed." },
          { icon: Truck, title: "Delivery-ready orders", text: "Clear order states for confirmation, packing, dispatch, delivery, and refunds." },
          { icon: BadgeCheck, title: "Fresh-batch limits", text: "Stock works like daily kitchen capacity so items cannot be oversold." },
        ].map((item) => (
          <div key={item.title} className="rounded-lg border border-[#e8d3b8] bg-white p-5">
            <item.icon className="h-6 w-6 text-[#2f7d4f]" aria-hidden="true" />
            <h3 className="mt-4 font-bold text-[#2b1b12]">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#76513d]">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="bg-[#2f7d4f]">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-12 text-white sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
          <div>
            <h2 className="text-3xl font-black">Homemade taste, modern ordering.</h2>
            <p className="mt-3 max-w-2xl text-[#e6ffef]">
              Browse a focused food menu, pay securely, and keep every meal order traceable from kitchen prep to customer account.
            </p>
          </div>
          <Button asChild variant="secondary" size="lg">
            <Link href="/shop">Explore the menu</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
