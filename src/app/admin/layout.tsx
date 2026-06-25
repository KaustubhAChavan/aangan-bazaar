import Link from "next/link";
import { BarChart3, Boxes, FolderTree, Inbox, ReceiptText, Settings, Users } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { requireAdmin } from "@/lib/auth";

const nav = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ReceiptText },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/contact-messages", label: "Messages", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[#fff8ec]">
      <header className="border-b border-[#e8d3b8] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="text-lg font-black text-[#2b1b12]">
            Aangan Admin
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-semibold text-[#2f7d4f]">
              View store
            </Link>
            <UserButton />
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside>
          <nav className="grid gap-1 rounded-lg border border-[#e8d3b8] bg-white p-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-[#4a3124] hover:bg-[#f8ead5]"
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
