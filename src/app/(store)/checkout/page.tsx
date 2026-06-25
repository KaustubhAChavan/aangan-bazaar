import type { Metadata } from "next";
import { CheckoutClient } from "@/components/store/checkout-client";
import { getOrCreateUserProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const profile = await getOrCreateUserProfile();
  const addressRecords = profile
    ? await prisma.address.findMany({
        where: { userProfileId: profile.id },
        orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
      })
    : [];
  const addresses = addressRecords.map((address) => ({
    id: address.id,
    fullName: address.fullName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    country: address.country,
    isDefault: address.isDefault,
  }));
  const plainProfile = profile
    ? {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      }
    : null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-7">
        <p className="text-sm font-bold uppercase text-[#d94a2b]">Checkout</p>
        <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">Secure payment</h1>
      </div>
      <CheckoutClient profile={plainProfile} addresses={addresses} />
    </div>
  );
}
