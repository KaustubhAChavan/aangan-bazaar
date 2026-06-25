import { OrderStatus, PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RazorpayConfigError, verifyRazorpaySignature } from "@/lib/razorpay";
import { toNumber } from "@/lib/utils";
import { paymentVerifySchema } from "@/lib/validations/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = paymentVerifySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payment payload." }, { status: 400 });
  }

  const input = parsed.data;
  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
    include: { items: true },
  });

  if (!order || order.razorpayOrderId !== input.razorpayOrderId) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (order.paymentStatus === PaymentStatus.PAID) {
    return NextResponse.json({ ok: true });
  }

  let validSignature = false;
  try {
    validSignature = verifyRazorpaySignature({
      razorpayOrderId: input.razorpayOrderId,
      razorpayPaymentId: input.razorpayPaymentId,
      razorpaySignature: input.razorpaySignature,
    });
  } catch (error) {
    if (error instanceof RazorpayConfigError) {
      return NextResponse.json(
        { error: "Razorpay authentication failed." },
        { status: 401 },
      );
    }

    console.error("Unable to verify Razorpay payment", error);
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }

  if (!validSignature) {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: PaymentStatus.FAILED },
    });
    return NextResponse.json({ error: "Payment signature mismatch." }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.upsert({
      where: { razorpayPaymentId: input.razorpayPaymentId },
      update: {
        status: PaymentStatus.PAID,
        rawResponseJson: input,
      },
      create: {
        orderId: order.id,
        razorpayOrderId: input.razorpayOrderId,
        razorpayPaymentId: input.razorpayPaymentId,
        razorpaySignature: input.razorpaySignature,
        amount: toNumber(order.total),
        status: PaymentStatus.PAID,
        rawResponseJson: input,
      },
    });

    const updated = await tx.order.updateMany({
      where: { id: order.id, paymentStatus: { not: PaymentStatus.PAID } },
      data: {
        paymentStatus: PaymentStatus.PAID,
        orderStatus: OrderStatus.CONFIRMED,
        razorpayPaymentId: input.razorpayPaymentId,
      },
    });

    if (updated.count > 0) {
      for (const item of order.items) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      if (order.userProfileId) {
        await tx.cartItem.deleteMany({ where: { userProfileId: order.userProfileId } });
      }
    }
  });

  return NextResponse.json({ ok: true });
}
