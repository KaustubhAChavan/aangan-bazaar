import { OrderStatus, PaymentStatus } from "@prisma/client";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const requiredText = (label: string, min = 2) =>
  z.string().trim().min(min, `${label} is required`);

export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .transform((value) => slugify(value));

export const categorySchema = z.object({
  name: requiredText("Category name"),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.coerce.boolean().default(true),
});

export const productImageSchema = z.object({
  url: z.string().url(),
  cloudinaryPublicId: z.string().min(1),
  altText: z.string().trim().min(1),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const productSchema = z.object({
  name: requiredText("Product name"),
  slug: z.string().trim().optional(),
  description: requiredText("Description", 20),
  shortDescription: requiredText("Short description", 10),
  price: z.coerce.number().positive("Price must be greater than 0"),
  compareAtPrice: z.coerce.number().positive().optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().trim().optional(),
  categoryId: z.string().min(1, "Category is required"),
  isActive: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
  images: z.array(productImageSchema).default([]),
});

export const addressSchema = z.object({
  fullName: requiredText("Full name"),
  phone: z.string().trim().min(10, "Enter a valid phone number").max(16),
  addressLine1: requiredText("Address line 1", 5),
  addressLine2: z.string().trim().optional(),
  city: requiredText("City"),
  state: requiredText("State"),
  pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/, "Enter a valid pincode"),
  country: z.string().trim().default("India"),
  isDefault: z.coerce.boolean().default(false),
});

export const checkoutSchema = z.object({
  customerName: requiredText("Name"),
  customerEmail: z.string().trim().email(),
  customerPhone: z.string().trim().min(10).max(16),
  address: addressSchema,
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().min(1).max(25),
      }),
    )
    .min(1, "Cart is empty"),
});

export const contactSchema = z.object({
  name: requiredText("Name"),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  message: requiredText("Message", 10).max(2000),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(25),
});

export const cartMergeSchema = z.object({
  items: z.array(cartItemSchema).max(50),
});

export const orderStatusSchema = z.object({
  orderStatus: z.nativeEnum(OrderStatus),
});

export const paymentFailureSchema = z.object({
  orderId: z.string().min(1),
});

export const paymentVerifySchema = z.object({
  orderId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export const orderFilterSchema = z.object({
  q: z.string().trim().optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  orderStatus: z.nativeEnum(OrderStatus).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type AddressInput = z.infer<typeof addressSchema>;
