import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/form-controls";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/status-badge";
import { getOrCreateUserProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { orderStatusSchema } from "@/lib/validations/schemas";

export const dynamic = "force-dynamic";

async function updateOrderStatus(id: string, formData: FormData) {
  "use server";
  const parsed = orderStatusSchema.safeParse({
    orderStatus: formData.get("orderStatus"),
  });
  if (!parsed.success) {
    return;
  }
  await prisma.order.update({ where: { id }, data: parsed.data });
  const admin = await getOrCreateUserProfile();
  if (admin) {
    await prisma.adminLog.create({
      data: {
        adminUserId: admin.id,
        action: "UPDATE_STATUS",
        entityType: "Order",
        entityId: id,
        metadataJson: parsed.data,
      },
    });
  }
  revalidatePath(`/admin/orders/${id}`);
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payments: true, userProfile: true },
  });

  if (!order) {
    notFound();
  }

  async function saveStatus(formData: FormData) {
    "use server";
    await updateOrderStatus(id, formData);
  }

  const address = order.shippingAddressJson as Record<string, string | undefined>;

  return (
    <div>
      <p className="text-sm font-bold uppercase text-[#d94a2b]">Order</p>
      <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">{order.orderNumber}</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <PaymentStatusBadge status={order.paymentStatus} />
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-5">
          <Card className="p-5">
            <h2 className="text-xl font-bold text-[#2b1b12]">Ordered items</h2>
            <div className="mt-4 divide-y divide-[#e8d3b8]">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold text-[#2b1b12]">{item.productName}</p>
                    <p className="text-[#76513d]">Qty {item.quantity}</p>
                    {item.productSku ? <p className="text-[#94715e]">SKU {item.productSku}</p> : null}
                  </div>
                  <p className="font-bold">{formatCurrency(item.total.toString())}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="text-xl font-bold text-[#2b1b12]">Payment info</h2>
            <div className="mt-4 grid gap-2 text-sm text-[#654332]">
              <p>Razorpay order: {order.razorpayOrderId ?? "Not created"}</p>
              <p>Razorpay payment: {order.razorpayPaymentId ?? "Not paid"}</p>
              <p>Payments recorded: {order.payments.length}</p>
            </div>
          </Card>
        </div>
        <div className="grid gap-5">
          <Card className="p-5">
            <h2 className="text-xl font-bold text-[#2b1b12]">Update status</h2>
            <form action={saveStatus} className="mt-4 grid gap-3">
              <Select name="orderStatus" defaultValue={order.orderStatus}>
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
              <Button type="submit">Save status</Button>
            </form>
          </Card>
          <Card className="p-5">
            <h2 className="text-xl font-bold text-[#2b1b12]">Customer</h2>
            <p className="mt-3 text-sm leading-6 text-[#654332]">
              <strong>{order.customerName}</strong>
              <br />
              {order.customerEmail}
              <br />
              {order.customerPhone}
            </p>
          </Card>
          <Card className="p-5">
            <h2 className="text-xl font-bold text-[#2b1b12]">Address</h2>
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
          <Card className="p-5">
            <h2 className="text-xl font-bold text-[#2b1b12]">Totals</h2>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal.toString())}</span></div>
              <div className="flex justify-between"><span>Delivery fee</span><span>{formatCurrency(order.shippingCharge.toString())}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>{formatCurrency(order.discount.toString())}</span></div>
              <div className="flex justify-between border-t border-[#e8d3b8] pt-2 text-base font-bold"><span>Total</span><span>{formatCurrency(order.total.toString())}</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
