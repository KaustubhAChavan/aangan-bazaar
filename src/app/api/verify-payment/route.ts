import { NextResponse } from "next/server";
import { z } from "zod";
import { RazorpayConfigError, verifyRazorpaySignature } from "@/lib/razorpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const verifyPaymentSchema = z.object({
  razorpay_payment_id: z.string().trim().min(1),
  razorpay_order_id: z.string().trim().min(1),
  razorpay_signature: z.string().trim().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = verifyPaymentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Missing payment verification fields." }, { status: 400 });
  }

  try {
    const input = parsed.data;
    const validSignature = verifyRazorpaySignature({
      razorpayOrderId: input.razorpay_order_id,
      razorpayPaymentId: input.razorpay_payment_id,
      razorpaySignature: input.razorpay_signature,
    });

    if (!validSignature) {
      return NextResponse.json({ error: "Payment signature mismatch." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof RazorpayConfigError) {
      return NextResponse.json({ error: "Razorpay authentication failed." }, { status: 401 });
    }

    console.error("Unable to verify Razorpay payment", error);
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}
