"use client";

import {
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  Utensils,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/store/cart-provider";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const allowFrontendAdminRole = process.env.NODE_ENV !== "production";

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const { count } = useCart();
  const { isLoaded, isSignedIn, user } = useUser();
  const isAdmin =
    String(
      user?.publicMetadata?.role ??
        (allowFrontendAdminRole ? user?.unsafeMetadata?.role : undefined),
    ).toUpperCase() === "ADMIN";

  return (
    <header className="sticky top-0 z-40 border-b border-[#e8d3b8] bg-[#fff8ec]/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2"
          aria-label="Aangan Foods home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#2f7d4f] text-white">
            <Utensils className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="truncate text-lg font-bold text-[#2b1b12]">Aangan Foods</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-[#4a3124] transition hover:bg-[#f8ead5]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" aria-label="Search products">
            <Link href="/shop">
              <Search className="h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Cart">
            <Link href="/cart" className="relative">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {count > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d94a2b] px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              ) : null}
            </Link>
          </Button>
          <div className="hidden items-center gap-2 md:flex">
            {isLoaded && !isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm">
                    <UserRound className="h-4 w-4" aria-hidden="true" />
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                    Sign up
                  </Button>
                </SignUpButton>
              </>
            ) : null}
            {isLoaded && isSignedIn ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/account">
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                  Account
                </Link>
              </Button>
            ) : null}
            {isLoaded && isAdmin ? (
              <Button asChild size="sm">
                <Link href="/admin">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Admin
                </Link>
              </Button>
            ) : null}
            {isLoaded && isSignedIn ? (
              <UserButton>
                {isAdmin ? (
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="Admin"
                      href="/admin"
                      labelIcon={<ShieldCheck className="h-4 w-4" />}
                    />
                  </UserButton.MenuItems>
                ) : null}
              </UserButton>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-[#e8d3b8] bg-[#fff8ec] px-4 py-3 md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="grid gap-1" aria-label="Mobile">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-3 text-sm font-semibold text-[#4a3124] hover:bg-[#f8ead5]"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/account"
            className="rounded-md px-3 py-3 text-sm font-semibold text-[#4a3124] hover:bg-[#f8ead5]"
            onClick={() => setOpen(false)}
          >
            Account
          </Link>
          {isLoaded && !isSignedIn ? (
            <div className="grid gap-2 px-3 py-2">
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setOpen(false)}
                >
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  className="w-full justify-start"
                  onClick={() => setOpen(false)}
                >
                  <UserPlus className="h-4 w-4" aria-hidden="true" />
                  Sign up
                </Button>
              </SignUpButton>
            </div>
          ) : null}
          {isLoaded && isSignedIn ? (
            <div className="flex flex-wrap items-center gap-3 px-3 py-2">
              <Link
                href="/account"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#dcc3a2] bg-white px-3 py-2 text-sm font-semibold text-[#2b1b12] hover:bg-[#fff0d1]"
                onClick={() => setOpen(false)}
              >
                <UserRound className="h-4 w-4" aria-hidden="true" />
                Account
              </Link>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#2f7d4f] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1f5d3d]"
                  onClick={() => setOpen(false)}
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Admin
                </Link>
              ) : null}
              <UserButton>
                {isAdmin ? (
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="Admin"
                      href="/admin"
                      labelIcon={<ShieldCheck className="h-4 w-4" />}
                    />
                  </UserButton.MenuItems>
                ) : null}
              </UserButton>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
