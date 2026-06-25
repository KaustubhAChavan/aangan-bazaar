import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/status-badge";
import { getOrCreateUserProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const profile = await getOrCreateUserProfile();
  if (!profile) {
    return null;
  }

  const orders = await prisma.order.findMany({
    where: { userProfileId: profile.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <p className="text-sm font-bold uppercase text-[#d94a2b]">Orders</p>
      <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">Order history</h1>
      <div className="mt-6 grid gap-4">
        {orders.length ? (
          orders.map((order) => (
            <Card key={order.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <Link href={`/account/orders/${order.id}`} className="text-lg font-bold text-[#2b1b12] hover:text-[#2f7d4f]">
                  {order.orderNumber}
                </Link>
                <p className="mt-1 text-sm text-[#76513d]">
                  {order.items.length} items • {formatCurrency(order.total.toString())}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <PaymentStatusBadge status={order.paymentStatus} />
                  <OrderStatusBadge status={order.orderStatus} />
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href={`/account/orders/${order.id}`}>View details</Link>
              </Button>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-bold">No orders yet</h2>
            <p className="mt-2 text-[#76513d]">Your orders will appear here after checkout.</p>
            <Button asChild className="mt-5">
              <Link href="/shop">Shop now</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
