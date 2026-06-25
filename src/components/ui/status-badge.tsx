import { Badge } from "@/components/ui/badge";

export function PaymentStatusBadge({ status }: { status: string }) {
  const variant =
    status === "PAID"
      ? "success"
      : status === "FAILED" || status === "REFUNDED"
        ? "danger"
        : "warning";
  return <Badge variant={variant}>{status}</Badge>;
}

export function OrderStatusBadge({ status }: { status: string }) {
  const variant =
    status === "DELIVERED"
      ? "success"
      : status === "CANCELLED" || status === "REFUNDED"
        ? "danger"
        : status === "PENDING"
          ? "warning"
          : "default";
  return <Badge variant={variant}>{status}</Badge>;
}
