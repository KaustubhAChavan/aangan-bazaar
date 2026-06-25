import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/utils";
import { cartItemSchema } from "@/lib/validations/schemas";

export type CartLine = ReturnType<typeof mapCartItem>;

const cartInclude = {
  product: {
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" as const } },
    },
  },
};

type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: typeof cartInclude;
}>;

function mapCartItem(item: CartItemWithProduct) {
  const image = item.product.images.at(0);
  return {
    id: item.id,
    productId: item.productId,
    slug: item.product.slug,
    name: item.product.name,
    sku: item.product.sku,
    price: toNumber(item.product.price),
    stock: item.product.stock,
    isActive: item.product.isActive,
    imageUrl: image?.url ?? "/placeholder-product.svg",
    imageAlt: image?.altText ?? item.product.name,
    quantity: item.quantity,
    lineTotal: toNumber(item.product.price) * item.quantity,
  };
}

export function normalizeCartItems(items: unknown) {
  const input = Array.isArray(items) ? items : [];
  const aggregate = new Map<string, number>();

  for (const item of input) {
    const parsed = cartItemSchema.safeParse(item);
    if (!parsed.success) {
      continue;
    }
    const previous = aggregate.get(parsed.data.productId) ?? 0;
    aggregate.set(parsed.data.productId, Math.min(previous + parsed.data.quantity, 25));
  }

  return Array.from(aggregate, ([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

export async function getUserCart(userProfileId: string) {
  const items = await prisma.cartItem.findMany({
    where: { userProfileId },
    include: cartInclude,
    orderBy: { updatedAt: "desc" },
  });

  return items.map(mapCartItem).filter((item) => item.isActive);
}

export async function upsertCartItem(
  userProfileId: string,
  productId: string,
  quantity: number,
) {
  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
  });

  if (!product || product.stock <= 0) {
    throw new Error("Product is not available.");
  }

  const safeQuantity = Math.max(1, Math.min(quantity, product.stock, 25));

  return prisma.cartItem.upsert({
    where: {
      userProfileId_productId: {
        userProfileId,
        productId,
      },
    },
    update: { quantity: safeQuantity },
    create: {
      userProfileId,
      productId,
      quantity: safeQuantity,
    },
  });
}

export async function removeCartItem(userProfileId: string, productId: string) {
  await prisma.cartItem.deleteMany({
    where: { userProfileId, productId },
  });
}

export async function mergeCartItems(
  userProfileId: string,
  items: Array<{ productId: string; quantity: number }>,
) {
  for (const item of normalizeCartItems(items)) {
    const existing = await prisma.cartItem.findUnique({
      where: {
        userProfileId_productId: {
          userProfileId,
          productId: item.productId,
        },
      },
    });

    await upsertCartItem(
      userProfileId,
      item.productId,
      Math.min((existing?.quantity ?? 0) + item.quantity, 25),
    );
  }

  return getUserCart(userProfileId);
}

export async function clearUserCart(userProfileId: string) {
  await prisma.cartItem.deleteMany({ where: { userProfileId } });
}
