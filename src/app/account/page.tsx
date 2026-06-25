import { Package, MapPin, ReceiptText, UserRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getOrCreateUserProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const profile = await getOrCreateUserProfile();
  if (!profile) {
    return null;
  }

  const [orders, addresses, revenue] = await Promise.all([
    prisma.order.count({ where: { userProfileId: profile.id } }),
    prisma.address.count({ where: { userProfileId: profile.id } }),
    prisma.order.aggregate({
      where: { userProfileId: profile.id, paymentStatus: "PAID" },
      _sum: { total: true },
    }),
  ]);

  return (
    <div>
      <p className="text-sm font-bold uppercase text-[#d94a2b]">Account</p>
      <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">Your profile</h1>
      <Card className="mt-6 p-5">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-md bg-[#2f7d4f] text-white">
            <UserRound className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#2b1b12]">{profile.name ?? "Customer"}</h2>
            <p className="text-sm text-[#76513d]">{profile.email}</p>
            {profile.phone ? <p className="text-sm text-[#76513d]">{profile.phone}</p> : null}
          </div>
        </div>
      </Card>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          { icon: Package, label: "Orders", value: orders },
          { icon: MapPin, label: "Addresses", value: addresses },
          { icon: ReceiptText, label: "Paid total", value: formatCurrency(revenue._sum.total?.toString() ?? 0) },
        ].map((item) => (
          <Card key={item.label} className="p-5">
            <item.icon className="h-6 w-6 text-[#2f7d4f]" />
            <p className="mt-4 text-sm text-[#76513d]">{item.label}</p>
            <p className="mt-1 text-2xl font-black text-[#2b1b12]">{item.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
