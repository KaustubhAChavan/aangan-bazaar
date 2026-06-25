import { NextResponse } from "next/server";
import { getOrCreateUserProfile } from "@/lib/auth";
import { getUserCart, removeCartItem, upsertCartItem } from "@/lib/cart";
import { cartItemSchema } from "@/lib/validations/schemas";

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await getOrCreateUserProfile();
  if (!profile) {
    return NextResponse.json({ items: [] });
  }

  return NextResponse.json({ items: await getUserCart(profile.id) });
}

export async function POST(request: Request) {
  const profile = await getOrCreateUserProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const parsed = cartItemSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
  }

  await upsertCartItem(profile.id, parsed.data.productId, parsed.data.quantity);
  return NextResponse.json({ items: await getUserCart(profile.id) });
}

export async function DELETE(request: Request) {
  const profile = await getOrCreateUserProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "Missing product id." }, { status: 400 });
  }

  await removeCartItem(profile.id, productId);
  return NextResponse.json({ items: await getUserCart(profile.id) });
}
