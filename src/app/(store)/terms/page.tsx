import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <PolicyPage title="Terms of service">
      <p>
        Aangan Foods is an MVP storefront for a single homemade food seller. Menu availability,
        pricing, batch capacity, and offers may change without notice. Orders are accepted only after
        payment is verified server-side and food stock is available.
      </p>
      <p>
        Customers are responsible for entering accurate contact and delivery details.
        The store may cancel or refund orders when fraud checks, kitchen capacity,
        ingredient availability, or operational limitations require it.
      </p>
    </PolicyPage>
  );
}

function PolicyPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-[#2b1b12]">{title}</h1>
      <div className="mt-6 grid gap-4 leading-7 text-[#654332]">{children}</div>
    </div>
  );
}
