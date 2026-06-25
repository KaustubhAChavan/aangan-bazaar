import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-[#2b1b12]">Privacy policy</h1>
      <div className="mt-6 grid gap-4 leading-7 text-[#654332]">
        <p>
          Aangan Foods stores customer profile, delivery address, cart, order, and payment
          metadata needed to operate the homemade food shop. Authentication is handled by Clerk,
          menu item media is stored in Cloudinary, and payments are processed by Razorpay.
        </p>
        <p>
          Payment secrets and Cloudinary API secrets are server-only. The application
          stores Razorpay identifiers and verification results, not card or UPI credentials.
        </p>
      </div>
    </div>
  );
}
