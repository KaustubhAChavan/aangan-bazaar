import { PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paymentFailureSchema } from "@/lib/validations/schemas";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = paymentFailureSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order id." }, { status: 400 });
  }

  await prisma.order.updateMany({
    where: {
      id: parsed.data.orderId,
      paymentStatus: PaymentStatus.PENDING,
    },
    data: { paymentStatus: PaymentStatus.FAILED },
  });

  return NextResponse.json({ ok: true });
}
