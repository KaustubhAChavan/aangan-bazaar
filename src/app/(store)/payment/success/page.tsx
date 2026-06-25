import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  void searchParams;
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 py-12 text-center">
      <div>
        <CheckCircle2 className="mx-auto h-16 w-16 text-[#2f7d4f]" aria-hidden="true" />
        <h1 className="mt-5 text-3xl font-black text-[#2b1b12]">Payment successful</h1>
        <p className="mt-3 text-[#76513d]">
          Your order is confirmed. You can track it from your account orders page.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Button asChild>
            <Link href="/account/orders">View orders</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/shop">Keep shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
