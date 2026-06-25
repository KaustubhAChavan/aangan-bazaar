import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/form-controls";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; paymentStatus?: string; orderStatus?: string }>;
}) {
  const params = await searchParams;
  const orders = await prisma.order.findMany({
    where: {
      AND: [
        params.q
          ? {
              OR: [
                { orderNumber: { contains: params.q, mode: "insensitive" } },
                { customerEmail: { contains: params.q, mode: "insensitive" } },
                { customerPhone: { contains: params.q, mode: "insensitive" } },
              ],
            }
          : {},
        params.paymentStatus ? { paymentStatus: params.paymentStatus as never } : {},
        params.orderStatus ? { orderStatus: params.orderStatus as never } : {},
      ],
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <p className="text-sm font-bold uppercase text-[#d94a2b]">Orders</p>
      <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">Manage orders</h1>
      <form className="mt-6 grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
        <Input name="q" defaultValue={params.q} placeholder="Order number, email, phone" />
        <Select name="paymentStatus" defaultValue={params.paymentStatus ?? ""}>
          <option value="">Payment status</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </Select>
        <Select name="orderStatus" defaultValue={params.orderStatus ?? ""}>
          <option value="">Order status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PACKED">Packed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
        </Select>
        <Button type="submit">Filter</Button>
      </form>
      <Card className="mt-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f8ead5] text-[#4a3124]">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8d3b8]">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3">
                    <p className="font-bold text-[#2b1b12]">{order.orderNumber}</p>
                    <p className="text-xs text-[#94715e]">{order.items.length} items</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{order.customerName}</p>
                    <p className="text-xs text-[#94715e]">{order.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3">{formatCurrency(order.total.toString())}</td>
                  <td className="px-4 py-3"><PaymentStatusBadge status={order.paymentStatus} /></td>
                  <td className="px-4 py-3"><OrderStatusBadge status={order.orderStatus} /></td>
                  <td className="px-4 py-3">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/orders/${order.id}`}>Open</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
