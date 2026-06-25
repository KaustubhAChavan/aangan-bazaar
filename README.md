# Aangan Foods

Aangan Foods is a production-oriented single-vendor homemade food ecommerce MVP built with the Next.js App Router. It includes a public food menu, local/DB cart flow, customer account pages, Clerk authentication, role-protected admin management, Cloudinary menu image uploads, Neon/PostgreSQL via Prisma, and Razorpay order/payment verification.

This is intentionally not a marketplace. There are no seller dashboards, delivery-boy portals, courier integrations, seller payouts, wallets, GST automation, loyalty points, or mobile apps. It is designed for one kitchen/admin team selling homemade meals, breakfast/snacks, pickles, chutneys, and sweets.

## Tech Stack

- Next.js 16 App Router and TypeScript
- Tailwind CSS with shadcn-style local UI primitives
- Clerk authentication and role metadata
- Prisma ORM with PostgreSQL/Neon
- Cloudinary for menu item/category images
- Razorpay checkout, server-side order creation, and HMAC verification
- Zod validation for menu item, category, address, checkout, cart, contact, and admin updates
- Vercel-ready configuration

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Fill in:

   ```bash
   DATABASE_URL
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   CLERK_SECRET_KEY
   NEXT_PUBLIC_CLERK_SIGN_IN_URL
   NEXT_PUBLIC_CLERK_SIGN_UP_URL
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET
   RAZORPAY_KEY_ID
   RAZORPAY_KEY_SECRET
   NEXT_PUBLIC_RAZORPAY_KEY_ID
   NEXT_PUBLIC_APP_URL
   ```

4. Generate Prisma client and push/migrate schema:

   ```bash
   npm run db:generate
   npm run db:push
   ```

5. Seed sample food categories and menu items:

   ```bash
   npm run db:seed
   ```

6. Start development:

   ```bash
   npm run dev
   ```

## Database

Core models are in `prisma/schema.prisma`:

- `UserProfile`, `Address`
- `Category`, `Product`, `ProductImage`
- `CartItem`
- `Order`, `OrderItem`, `Payment`
- `ContactMessage`, `AdminLog`

For production, prefer Prisma migrations:

```bash
npm run db:migrate
```

For quick MVP setup or a disposable development DB:

```bash
npm run db:push
```

## Clerk Admin Role

Customers default to `CUSTOMER`. Admin routes require Clerk metadata role `ADMIN`.

In Clerk Dashboard, set one of these on the user:

```json
{
  "role": "ADMIN"
}
```

The app checks `sessionClaims.metadata.role`, `publicMetadata.role`, and `privateMetadata.role`, normalizing the value to uppercase.

Protected routes:

- `/admin/*` requires admin
- `/account/*` requires sign-in
- `/api/admin/*` requires admin

## Razorpay Test Mode

Use Razorpay test keys locally:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

Checkout creates a local `Order` with `PENDING` payment status before opening Razorpay. Verification happens in `/api/payments/verify` with HMAC SHA256. On verified payment, the app:

- creates/upserts a `Payment`
- marks the order `PAID` and `CONFIRMED`
- stores Razorpay payment IDs
- decrements product stock once
- clears the signed-in user cart

## Cloudinary

Admin product forms include an upload component that posts to `/api/admin/uploads`. The API route validates image type and size, uploads menu photos to Cloudinary with server-side credentials, and stores only image URL, public ID, alt text, and sort order in the database.

Do not expose `CLOUDINARY_API_SECRET` to the client.

## Vercel and Neon Notes

- Add all `.env.example` keys to Vercel project environment variables.
- Use the Neon pooled connection string for serverless deployments when appropriate.
- `npm run build` runs `prisma generate` before `next build`.
- Configure Clerk production URLs to match the Vercel domain.
- Use Razorpay live keys only after payment and refund policies are ready.

## Practical Free-Tier Limits

The admin settings page also documents these operating notes:

- Vercel free tier is suitable for MVP/testing/low traffic only.
- Neon free tier has limited database storage and compute.
- Cloudinary free tier has limited monthly credits/bandwidth/storage.
- Images should be optimized and limited.
- Recommended MVP limits: up to 300 menu items, up to 1,000 compressed food images, up to 2,000 customer records, and up to 5,000 orders initially.
- Upgrade when traffic, image usage, database size, or operational risk grows.

These are practical limits, not hard technical guarantees.

## Useful Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run db:generate
npm run db:push
npm run db:migrate
npm run db:seed
```

## Main Routes

Public:

- `/`, `/shop`, `/category/[slug]`, `/product/[slug]`
- `/cart`, `/checkout`, `/payment/success`, `/payment/failed`
- `/about`, `/contact`, `/terms`, `/privacy-policy`, `/return-refund-policy`

Customer:

- `/account`, `/account/orders`, `/account/orders/[id]`, `/account/addresses`

Admin:

- `/admin`
- `/admin/products`, `/admin/products/new`, `/admin/products/[id]/edit`
- `/admin/categories`
- `/admin/orders`, `/admin/orders/[id]`
- `/admin/customers`
- `/admin/contact-messages`
- `/admin/settings`
