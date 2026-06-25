import { UserButton } from "@clerk/nextjs";
import { LockKeyhole, UserRound } from "lucide-react";
import Link from "next/link";
import { DevAdminAccessButton } from "@/components/admin/dev-admin-access-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminUnauthorizedPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fff8ec] px-4 py-10">
      <Card className="w-full max-w-xl p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-md bg-[#f8ead5] text-[#b8322b]">
          <LockKeyhole className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-bold uppercase text-[#d94a2b]">Admin access</p>
        <h1 className="mt-2 text-3xl font-black text-[#2b1b12]">
          This account is not an admin.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#654332]">
          Your customer account is working, but this dashboard is only for store
          admins. In production, add <span className="font-bold">role: ADMIN</span>{" "}
          in Clerk metadata for this user.
        </p>
        <DevAdminAccessButton />
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/account">
              <UserRound className="h-4 w-4" aria-hidden="true" />
              Customer dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/login">Admin login</Link>
          </Button>
          <UserButton />
        </div>
      </Card>
    </main>
  );
}
