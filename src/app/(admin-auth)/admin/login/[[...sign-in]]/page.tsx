import { SignIn } from "@clerk/nextjs";
import { ShieldCheck, Utensils } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#fff8ec] px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-8 lg:grid lg:grid-cols-[1fr_440px] lg:items-center">
        <section className="max-w-xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#2f7d4f]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#2f7d4f] text-white">
              <Utensils className="h-5 w-5" aria-hidden="true" />
            </span>
            Aangan Foods
          </Link>
          <div className="mt-10 inline-flex items-center gap-2 rounded-md bg-[#f8ead5] px-3 py-2 text-sm font-bold text-[#9a3412]">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Admin access
          </div>
          <h1 className="mt-5 text-4xl font-black leading-tight text-[#2b1b12] sm:text-5xl">
            Manage homemade food products, orders, and categories.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-[#654332]">
            Sign in with the Clerk user that has <span className="font-bold">ADMIN</span>{" "}
            role metadata to open the store dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/admin/products/new"
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#2f7d4f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f5d3d]"
            >
              Add food product
            </Link>
            <Link
              href="/admin/categories"
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#dcc3a2] bg-white px-4 py-2 text-sm font-semibold text-[#2b1b12] transition hover:bg-[#fff0d1]"
            >
              Manage categories
            </Link>
          </div>
        </section>

        <section className="flex justify-center lg:justify-end" aria-label="Admin sign in">
          <SignIn
            routing="path"
            path="/admin/login"
            signUpUrl="/sign-up"
            forceRedirectUrl="/admin"
            fallbackRedirectUrl="/admin"
          />
        </section>
      </div>
    </main>
  );
}
