import { PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { getOrCreateUserProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createRazorpayOrder,
  isRazorpayAuthError,
  RazorpayConfigError,
} from "@/lib/razorpay";
import { generateOrderNumber, toNumber } from "@/lib/utils";
import { checkoutSchema } from "@/lib/validations/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

class CheckoutError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.at(0)?.message ?? "Invalid checkout details." },
      { status: 400 },
    );
  }

  try {
    const profile = await getOrCreateUserProfile();
    const input = parsed.data;
    const productIds = input.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    const productMap = new Map(products.map((product) => [product.id, product]));
    const orderItems = input.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new CheckoutError("A product in your cart is no longer available.", 409);
      }
      if (product.stock < item.quantity) {
        throw new CheckoutError(`${product.name} has only ${product.stock} left in stock.`, 409);
      }
      const price = toNumber(product.price);
      return {
        product,
        quantity: item.quantity,
        price,
        total: price * item.quantity,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
    const shippingCharge = subtotal > 999 ? 0 : 79;
    const discount = 0;
    const total = subtotal + shippingCharge - discount;
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userProfileId: profile?.id,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        shippingAddressJson: input.address,
        subtotal,
        shippingCharge,
        discount,
        total,
        paymentStatus: PaymentStatus.PENDING,
        orderStatus: "PENDING",
        items: {
          create: orderItems.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            productSku: item.product.sku,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
          })),
        },
      },
    });

    try {
      const razorpayOrder = await createRazorpayOrder({
        amountPaise: Math.round(total * 100),
        receipt: orderNumber,
        notes: {
          localOrderId: order.id,
          orderNumber,
        },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: razorpayOrder.id },
      });

      return NextResponse.json({
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      });
    } catch (error) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: PaymentStatus.FAILED },
      });

      if (error instanceof RazorpayConfigError || isRazorpayAuthError(error)) {
        return NextResponse.json(
          { error: "Razorpay authentication failed." },
          { status: 401 },
        );
      }

      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Unable to initialize Razorpay payment.",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Unable to create payment order", error);
    return NextResponse.json(
      { error: "Unable to create payment order right now. Please try again later." },
      { status: 500 },
    );
  }
}
