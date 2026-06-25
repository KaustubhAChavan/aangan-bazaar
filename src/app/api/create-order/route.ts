import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createRazorpayOrder,
  isRazorpayAuthError,
  RazorpayConfigError,
} from "@/lib/razorpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createOrderSchema = z.object({
  amount: z.coerce.number().int().min(100, "Minimum amount is 100 paise."),
  currency: z
    .string()
    .trim()
    .length(3, "Currency must be a three-letter ISO code.")
    .default("INR")
    .transform((value) => value.toUpperCase()),
  receipt: z.string().trim().min(1).max(40).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.at(0)?.message ?? "Invalid order payload." },
      { status: 400 },
    );
  }

  try {
    const input = parsed.data;
    const order = await createRazorpayOrder({
      amountPaise: input.amount,
      currency: input.currency,
      receipt: input.receipt ?? `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    if (error instanceof RazorpayConfigError || isRazorpayAuthError(error)) {
      return NextResponse.json({ error: "Razorpay authentication failed." }, { status: 401 });
    }

    console.error("Unable to create Razorpay order", error);
    return NextResponse.json({ error: "Unable to create Razorpay order." }, { status: 500 });
  }
}
