import { cn } from "@/lib/utils";

const variants = {
  default: "bg-[#2f7d4f] text-white",
  muted: "bg-[#f8ead5] text-[#654332]",
  warning: "bg-[#f4b63f] text-[#2b1b12]",
  danger: "bg-[#b8322b] text-white",
  success: "bg-[#28784f] text-white",
};

export function Badge({
  className,
  variant = "default",
  children,
}: {
  className?: string;
  variant?: keyof typeof variants;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
