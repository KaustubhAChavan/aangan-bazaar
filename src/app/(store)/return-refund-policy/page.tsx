import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return and Refund Policy",
};

export default function ReturnRefundPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-[#2b1b12]">Return and refund policy</h1>
      <div className="mt-6 grid gap-4 leading-7 text-[#654332]">
        <p>
          Cancellation windows, delivery issue handling, and refund eligibility should be configured by
          the store owner before launch. The MVP tracks cancelled and refunded food orders
          from the admin dashboard but does not integrate with courier or delivery APIs.
        </p>
        <p>
          Refund status should be updated after Razorpay and kitchen operational checks are
          completed. Menu stock is reduced only after successful payment verification.
        </p>
      </div>
    </div>
  );
}
