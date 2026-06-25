import { Boxes, ReceiptText, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [products, orders, customers, revenue, pendingOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.userProfile.count(),
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
    prisma.order.count({ where: { orderStatus: { in: ["PENDING", "CONFIRMED", "PACKED"] } } }),
  ]);

  const metrics = [
    { label: "Products", value: products, icon: Boxes },
    { label: "Orders", value: orders, icon: ReceiptText },
    { label: "Customers", value: customers, icon: Users },
    { label: "Revenue", value: formatCurrency(revenue._sum.total?.toString() ?? 0), icon: TrendingUp },
    { label: "Pending orders", value: pendingOrders, icon: ReceiptText },
  ];

  return (
    <div>
      <p className="text-sm font-bold uppercase text-[#d94a2b]">Admin</p>
      <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-5">
            <metric.icon className="h-6 w-6 text-[#2f7d4f]" />
            <p className="mt-4 text-sm text-[#76513d]">{metric.label}</p>
            <p className="mt-1 text-2xl font-black text-[#2b1b12]">{metric.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
