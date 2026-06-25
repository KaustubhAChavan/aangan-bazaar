"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form-controls";
import { useCart } from "@/components/store/cart-provider";
import { formatCurrency } from "@/lib/utils";

type AddressOption = {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
};

type PaymentOrderResponse = {
  error?: string;
  orderId?: string;
  razorpayOrderId?: string;
  amount?: number;
  key?: string;
};

export function CheckoutClient({
  profile,
  addresses,
}: {
  profile: { name: string | null; email: string; phone: string | null } | null;
  addresses: AddressOption[];
}) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const defaultAddress = addresses.find((item) => item.isDefault) ?? addresses[0];
  const [selectedAddressId, setSelectedAddressId] = React.useState(defaultAddress?.id ?? "new");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 79;

  const selectedAddress = addresses.find((item) => item.id === selectedAddressId);

  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onerror = () => {
      setError("Unable to load Razorpay checkout. Please refresh and try again.");
    };
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    if (!window.Razorpay) {
      setError("Razorpay checkout is still loading. Please try again.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const customerName = String(formData.get("customerName") ?? "");
    const customerEmail = String(formData.get("customerEmail") ?? "");
    const customerPhone = String(formData.get("customerPhone") ?? "");
    const address = selectedAddress
      ? {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2 ?? "",
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          country: selectedAddress.country,
          isDefault: selectedAddress.isDefault,
        }
      : {
          fullName: String(formData.get("fullName") ?? customerName),
          phone: String(formData.get("phone") ?? customerPhone),
          addressLine1: String(formData.get("addressLine1") ?? ""),
          addressLine2: String(formData.get("addressLine2") ?? ""),
          city: String(formData.get("city") ?? ""),
          state: String(formData.get("state") ?? ""),
          pincode: String(formData.get("pincode") ?? ""),
          country: "India",
          isDefault: false,
        };

    setPending(true);

    const response = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        customerEmail,
        customerPhone,
        address,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    });

    let order: PaymentOrderResponse;

    try {
      order = (await response.json()) as PaymentOrderResponse;
    } catch {
      order = { error: "Unable to create payment order." };
    }

    if (!response.ok) {
      setError(order.error ?? "Unable to create payment order.");
      setPending(false);
      return;
    }

    if (!order.orderId || !order.razorpayOrderId || !order.amount || !order.key) {
      setError("Payment order response was incomplete.");
      setPending(false);
      return;
    }

    const checkout = new window.Razorpay({
      key: order.key,
      amount: order.amount,
      currency: "INR",
      name: "Aangan Foods",
      description: "Secure homemade food order payment",
      order_id: order.razorpayOrderId,
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      },
      theme: { color: "#2f7d4f" },
      retry: { enabled: true },
      handler: async (payment) => {
        const verifyResponse = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.orderId,
            razorpayOrderId: payment.razorpay_order_id,
            razorpayPaymentId: payment.razorpay_payment_id,
            razorpaySignature: payment.razorpay_signature,
          }),
        });

        if (verifyResponse.ok) {
          clearCart();
          router.push(`/payment/success?orderId=${order.orderId}`);
        } else {
          router.push(`/payment/failed?orderId=${order.orderId}`);
        }
      },
      modal: {
        ondismiss: async () => {
          await fetch("/api/payments/failed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: order.orderId }),
          });
          setError("Payment was cancelled before completion.");
          setPending(false);
        },
      },
    });

    checkout.on("payment.failed", (response) => {
      setError(
        response.error?.description ??
          "Payment failed. Please check your payment details and try again.",
      );
      setPending(false);
    });

    checkout.open();
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="grid gap-5">
        <Card className="p-5">
          <h2 className="text-xl font-bold text-[#2b1b12]">Customer details</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Name">
              <Input name="customerName" defaultValue={profile?.name ?? ""} required />
            </Field>
            <Field label="Email">
              <Input name="customerEmail" type="email" defaultValue={profile?.email ?? ""} required />
            </Field>
            <Field label="Phone">
              <Input name="customerPhone" defaultValue={profile?.phone ?? ""} required />
            </Field>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-xl font-bold text-[#2b1b12]">Delivery address</h2>
          {addresses.length ? (
            <div className="mt-5 grid gap-3">
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className="flex cursor-pointer gap-3 rounded-md border border-[#e8d3b8] p-3"
                >
                  <input
                    type="radio"
                    name="addressId"
                    value={address.id}
                    checked={selectedAddressId === address.id}
                    onChange={() => setSelectedAddressId(address.id)}
                  />
                  <span className="text-sm leading-6">
                    <strong>{address.fullName}</strong>
                    <br />
                    {address.addressLine1}
                    {address.addressLine2 ? `, ${address.addressLine2}` : ""}, {address.city},{" "}
                    {address.state} {address.pincode}
                  </span>
                </label>
              ))}
              <label className="flex cursor-pointer gap-3 rounded-md border border-[#e8d3b8] p-3">
                <input
                  type="radio"
                  name="addressId"
                  value="new"
                  checked={selectedAddressId === "new"}
                  onChange={() => setSelectedAddressId("new")}
                />
                <span className="text-sm font-semibold">Use a new address</span>
              </label>
            </div>
          ) : null}

          {selectedAddressId === "new" ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Full name">
                <Input name="fullName" required />
              </Field>
              <Field label="Phone">
                <Input name="phone" required />
              </Field>
              <Field label="Address line 1">
                <Input name="addressLine1" required />
              </Field>
              <Field label="Address line 2">
                <Input name="addressLine2" />
              </Field>
              <Field label="City">
                <Input name="city" required />
              </Field>
              <Field label="State">
                <Input name="state" required />
              </Field>
              <Field label="Pincode">
                <Input name="pincode" required />
              </Field>
            </div>
          ) : null}
        </Card>
      </div>

      <Card className="h-fit p-5">
        <h2 className="text-xl font-bold text-[#2b1b12]">Payment summary</h2>
        <div className="mt-5 grid gap-3 text-sm">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between gap-3">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-[#e8d3b8] pt-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Delivery fee</span>
              <span className="font-semibold">{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
            </div>
          </div>
          <div className="flex justify-between border-t border-[#e8d3b8] pt-3 text-base font-bold">
            <span>Total</span>
            <span>{formatCurrency(subtotal + shipping)}</span>
          </div>
        </div>
        {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <Button type="submit" size="lg" disabled={pending || !items.length} className="mt-6 w-full">
          {pending ? "Opening Razorpay..." : "Pay securely"}
        </Button>
      </Card>
    </form>
  );
}
