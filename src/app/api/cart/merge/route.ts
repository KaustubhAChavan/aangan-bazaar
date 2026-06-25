import { NextResponse } from "next/server";
import { getOrCreateUserProfile } from "@/lib/auth";
import { mergeCartItems } from "@/lib/cart";
import { cartMergeSchema } from "@/lib/validations/schemas";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const profile = await getOrCreateUserProfile();
  if (!profile) {
    return NextResponse.json({ items: [] });
  }

  const parsed = cartMergeSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart payload." }, { status: 400 });
  }

  return NextResponse.json({
    items: await mergeCartItems(profile.id, parsed.data.items),
  });
}
