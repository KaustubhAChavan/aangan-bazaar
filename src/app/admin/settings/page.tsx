import { Card } from "@/components/ui/card";

const limits = [
  "Vercel free tier is suitable for MVP testing and low traffic only.",
  "Neon free tier has limited database storage, branching, and compute.",
  "Cloudinary free tier has limited monthly credits, bandwidth, transformations, and storage.",
  "Images should be compressed, sized sensibly, and removed when products are retired.",
  "Recommended MVP range: up to 300 products, 1,000 compressed product images, 2,000 customer records, and 5,000 orders before reviewing upgrades.",
  "These are practical operating limits, not hard guarantees.",
];

export default function AdminSettingsPage() {
  return (
    <div>
      <p className="text-sm font-bold uppercase text-[#d94a2b]">Settings</p>
      <h1 className="mt-2 text-4xl font-black text-[#2b1b12]">Store settings</h1>
      <Card className="mt-6 p-5">
        <h2 className="text-xl font-bold text-[#2b1b12]">Free-tier operating notes</h2>
        <ul className="mt-4 grid gap-3 text-sm leading-6 text-[#654332]">
          {limits.map((item) => (
            <li key={item} className="rounded-md bg-[#fff8ec] p-3">
              {item}
            </li>
          ))}
        </ul>
      </Card>
      <Card className="mt-5 p-5">
        <h2 className="text-xl font-bold text-[#2b1b12]">Configuration checklist</h2>
        <div className="mt-4 grid gap-2 text-sm text-[#654332]">
          <p>Clerk role metadata: set admin users to <code className="rounded bg-[#f8ead5] px-1">ADMIN</code>.</p>
          <p>Razorpay: use test mode keys locally and live keys only in production.</p>
          <p>Cloudinary: keep API secret server-side and use admin upload route for product images.</p>
          <p>Neon: use pooled connection strings for Vercel serverless environments.</p>
        </div>
      </Card>
    </div>
  );
}
