import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentFailedPage() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 py-12 text-center">
      <div>
        <XCircle className="mx-auto h-16 w-16 text-[#b8322b]" aria-hidden="true" />
        <h1 className="mt-5 text-3xl font-black text-[#2b1b12]">Payment could not be verified</h1>
        <p className="mt-3 text-[#76513d]">
          The order remains visible to the store admin. Please retry checkout or contact support.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Button asChild>
            <Link href="/checkout">Try again</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
