import crypto from "node:crypto";
import { existsSync } from "node:fs";
import Razorpay from "razorpay";

let razorpay: Razorpay | null = null;

const loadEnvFile = (
  process as NodeJS.Process & { loadEnvFile?: (path?: string) => void }
).loadEnvFile;

if (!process.env.RAZORPAY_KEY_ID && existsSync(".env.local")) {
  loadEnvFile?.(".env.local");
} else if (!process.env.RAZORPAY_KEY_ID && existsSync(".env")) {
  loadEnvFile?.(".env");
}

export class RazorpayConfigError extends Error {
  constructor(message = "Razorpay keys are not configured.") {
    super(message);
    this.name = "RazorpayConfigError";
  }
}

export function isRazorpayAuthError(error: unknown) {
  const maybeError = error as {
    statusCode?: number;
    error?: { code?: string; description?: string };
  };

  return maybeError.statusCode === 401 || maybeError.error?.code === "BAD_REQUEST_AUTHENTICATION";
}

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new RazorpayConfigError();
  }

  razorpay ??= new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  return razorpay;
}

export async function createRazorpayOrder({
  amountPaise,
  currency = "INR",
  receipt,
  notes,
}: {
  amountPaise: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}) {
  return getRazorpay().orders.create({
    amount: amountPaise,
    currency,
    receipt,
    notes,
  });
}

export function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new RazorpayConfigError("Razorpay secret is not configured.");
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(razorpaySignature);

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}
