import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/store/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Aangan Foods | Homemade Meals, Snacks, Pickles and Sweets",
    template: "%s | Aangan Foods",
  },
  description:
    "A single-vendor homemade food ecommerce MVP for fresh meals, snacks, pickles, chutneys, and sweets.",
  openGraph: {
    title: "Aangan Foods",
    description: "Fresh, trustworthy homemade food ordering for everyday cravings.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col">
        <ClerkProvider>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
