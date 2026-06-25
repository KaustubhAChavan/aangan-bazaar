import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/status-badge";
import { getOrCreateUserProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, profile] = await Promise.all([params, getOrCreateUserProfile()]);
  if (!profile) {
    return null;
  }

  const order = await prisma.order.findFirst({
    where: { id, userProfileId: profile.id },
    include: { items: true, payments: true },
  });

  if (!order) {
    notFound();
  }

  const address = order.shippingAddressJson as {
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };

  return (
    <div>
      <p className="text-sm font-bold uppercase text-[#d94a2b]">Order detail</p>
      <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">{order.orderNumber}</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <PaymentStatusBadge status={order.paymentStatus} />
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card className="p-5">
          <h2 className="text-xl font-bold text-[#2b1b12]">Items</h2>
          <div className="mt-4 divide-y divide-[#e8d3b8]">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 py-3 text-sm">
                <div>
                  <p className="font-semibold text-[#2b1b12]">{item.productName}</p>
                  {item.productSku ? <p className="text-[#94715e]">SKU {item.productSku}</p> : null}
                  <p className="text-[#76513d]">Qty {item.quantity}</p>
                </div>
                <p className="font-bold">{formatCurrency(item.total.toString())}</p>
              </div>
            ))}
          </div>
        </Card>
        <div className="grid gap-5">
          <Card className="p-5">
            <h2 className="text-xl font-bold text-[#2b1b12]">Total</h2>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal.toString())}</span></div>
              <div className="flex justify-between"><span>Delivery fee</span><span>{formatCurrency(order.shippingCharge.toString())}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>{formatCurrency(order.discount.toString())}</span></div>
              <div className="flex justify-between border-t border-[#e8d3b8] pt-2 text-base font-bold"><span>Total</span><span>{formatCurrency(order.total.toString())}</span></div>
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="text-xl font-bold text-[#2b1b12]">Delivery address</h2>
            <p className="mt-3 text-sm leading-6 text-[#654332]">
              <strong>{address.fullName}</strong>
              <br />
              {address.phone}
              <br />
              {address.addressLine1}
              {address.addressLine2 ? `, ${address.addressLine2}` : ""}
              <br />
              {address.city}, {address.state} {address.pincode}
              <br />
              {address.country ?? "India"}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
