import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form-controls";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const customers = await prisma.userProfile.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      _count: { select: { orders: true, addresses: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <p className="text-sm font-bold uppercase text-[#d94a2b]">Customers</p>
      <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">Customer records</h1>
      <form className="mt-6 flex gap-3">
        <Input name="q" defaultValue={q} placeholder="Search name, email, or phone" />
        <Button type="submit">Search</Button>
      </form>
      <div className="mt-5 grid gap-5">
        {customers.map((customer) => {
          const paidTotal = customer.orders
            .filter((order) => order.paymentStatus === "PAID")
            .reduce((sum, order) => sum + Number(order.total), 0);

          return (
            <Card key={customer.id} className="p-5">
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
                <div>
                  <h2 className="text-xl font-bold text-[#2b1b12]">{customer.name ?? "Customer"}</h2>
                  <p className="mt-1 text-sm text-[#76513d]">{customer.email}</p>
                  {customer.phone ? <p className="text-sm text-[#76513d]">{customer.phone}</p> : null}
                  <p className="mt-2 text-sm text-[#94715e]">
                    {customer._count.orders} orders • {customer._count.addresses} addresses • {formatCurrency(paidTotal)}
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/admin/orders?q=${encodeURIComponent(customer.email)}`}>
                    View order history
                  </Link>
                </Button>
              </div>
              {customer.orders.length ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-[#76513d]">
                      <tr>
                        <th className="py-2">Recent order</th>
                        <th className="py-2">Payment</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e8d3b8]">
                      {customer.orders.map((order) => (
                        <tr key={order.id}>
                          <td className="py-2">{order.orderNumber}</td>
                          <td className="py-2">{order.paymentStatus}</td>
                          <td className="py-2">{order.orderStatus}</td>
                          <td className="py-2">{formatCurrency(order.total.toString())}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
