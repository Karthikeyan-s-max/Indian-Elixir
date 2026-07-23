# Indian Elixir — Full-Stack E-commerce Application

Organic wellness products storefront + admin management system.
Next.js 14 (App Router) · TypeScript · PostgreSQL · Prisma · NextAuth · Cloudinary · Tailwind.

---

## 1. Stack & why

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 App Router | One codebase for frontend + API routes, server components for fast product pages, easy Vercel deploy |
| Language | TypeScript | Type-safe forms, API contracts, Prisma models |
| Database | PostgreSQL | Relational data (users/orders/products) with strong constraints; free tiers on Neon/Supabase/Railway |
| ORM | Prisma | Type-safe queries, migrations, seeding |
| Auth | NextAuth (Credentials) + bcrypt | Full control over signup/reset flows without vendor lock-in; JWT sessions carry the `role` claim for admin gating |
| Images | Cloudinary | Free tier, automatic optimization/resizing, no server disk storage needed |
| Styling | Tailwind CSS | Fast to match a design system with custom tokens (see `tailwind.config.ts`) |
| Forms | React Hook Form + Zod | Same validation schema reused on client and server (`src/lib/validations.ts`) |
| Excel export | `xlsx` (SheetJS) | Generates real `.xlsx` files server-side, streamed as a download — no client library needed |

Order confirmation currently uses a **WhatsApp deep link (`wa.me`)** instead of a payment gateway, per your instructions — orders are stored as Cash on Delivery / "PENDING" and the store owner confirms manually over WhatsApp. Swapping in Razorpay/Stripe later only touches `src/app/api/orders/route.ts` and the checkout page.

---

## 2. Project structure

```
indian-elixir/
├─ prisma/
│  ├─ schema.prisma        # full DB schema (users, products, orders, etc.)
│  └─ seed.ts               # creates admin user + sample products
├─ public/
│  └─ logo.png               # your logo — also used as favicon
├─ src/
│  ├─ app/
│  │  ├─ page.tsx                     # homepage
│  │  ├─ products/                    # listing + [slug] detail
│  │  ├─ checkout/                    # cart → order form → WhatsApp confirm
│  │  ├─ login/ signup/ forgot-password/ reset-password/
│  │  ├─ account/                     # user profile + order history
│  │  ├─ admin/                       # role-protected dashboard
│  │  │  ├─ page.tsx                  # overview stats
│  │  │  ├─ products/                 # CRUD + image upload
│  │  │  ├─ orders/                   # status updates + Excel export
│  │  │  └─ users/                    # customer list + activity
│  │  └─ api/                         # all backend routes (see below)
│  ├─ components/
│  │  ├─ layout/    (Header, Footer, Providers)
│  │  ├─ products/  (ProductCard, AddToCartButton)
│  │  ├─ cart/       (CartContext — session-storage cart state)
│  │  └─ admin/      (ProductFormModal)
│  ├─ lib/           (prisma, auth, cloudinary, validations, utils, guards)
│  └─ middleware.ts   # protects /account and /admin
```

## 3. API routes

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Create account, hash password |
| GET/POST | `/api/auth/[...nextauth]` | — | NextAuth session handling |
| POST | `/api/auth/forgot-password` | Public | Issue reset token |
| POST | `/api/auth/reset-password` | Public | Consume token, set new password |
| GET | `/api/products` | Public | Active product catalog |
| GET | `/api/products/[slug]` | Public | Single product |
| GET/PATCH | `/api/profile` | User | View/update own profile, orders, activity |
| POST | `/api/orders` | Public (attaches user if logged in) | Place order, returns `wa.me` link |
| GET/POST | `/api/admin/products` | Admin | List / create products |
| PATCH/DELETE | `/api/admin/products/[id]` | Admin | Update / delete product (+ image swap) |
| GET | `/api/admin/orders` | Admin | List orders, filter by `month`, `status`, `sort` |
| PATCH | `/api/admin/orders/[id]` | Admin | Update order status |
| GET | `/api/admin/orders/export` | Admin | **Downloads .xlsx** — month-wise or all-time customer/order report |
| GET | `/api/admin/users` | Admin | All customers + recent orders |

All admin routes are additionally guarded by `src/middleware.ts`, so a non-admin session is redirected before the page even renders.

## 4. Database schema

See `prisma/schema.prisma`. Key relations:

- `User` 1—N `Order`, `Address`, `ActivityLog`
- `Product` 1—N `ProductImage`, `OrderItem`
- `Order` 1—N `OrderItem` (each item snapshots product name/price at order time, so later price edits don't rewrite history)
- `Role` enum (`USER`, `ADMIN`) drives all access control
- `OrderStatus` enum covers your requested pipeline: Pending → Confirmed → Packed → Shipped → Delivered, plus Cancelled

---

## 5. Local setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# then fill in:
#   DATABASE_URL              (see below)
#   NEXTAUTH_SECRET            openssl rand -base64 32
#   CLOUDINARY_*                from cloudinary.com dashboard (free tier is fine)
#   NEXT_PUBLIC_STORE_WHATSAPP_NUMBER   e.g. 919876543210

# 3. Get a free PostgreSQL database in under a minute:
#    Neon (neon.tech), Supabase, or Railway all give you a DATABASE_URL instantly.

# 4. Run migrations (creates all tables)
npx prisma migrate dev --name init

# 5. Seed an admin account + sample products
npm run seed
#   → prints the admin email/password (from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD)

# 6. Start the dev server
npm run dev
# open http://localhost:3000
# admin dashboard: http://localhost:3000/admin (log in with the seeded admin account)
```

## 6. Deployment

**Frontend + API (single deploy):**
Push this repo to GitHub → import into **Vercel** → set the same environment variables from `.env` in the Vercel project settings → deploy. Next.js API routes deploy automatically as serverless functions, no separate backend needed.

**Database:**
Use **Neon** or **Supabase** (both have a generous free Postgres tier and give you a `DATABASE_URL` immediately). Point `DATABASE_URL` at it, then run `npx prisma migrate deploy` once (Vercel can run this as a build step, or run it locally against the production URL).

**Images:**
Cloudinary free tier handles storage + delivery + resizing — no extra deployment needed, just the three `CLOUDINARY_*` env vars.

**Post-deploy checklist:**
1. `npx prisma migrate deploy` against the production `DATABASE_URL`
2. `npm run seed` once against production (creates the real admin login — then change that password)
3. Set `NEXTAUTH_URL` to your production domain
4. Update `NEXT_PUBLIC_STORE_WHATSAPP_NUMBER` to the real store WhatsApp number

---

## 7. What's stubbed for later (by design, per your instructions)

- **Payments:** currently COD + WhatsApp confirmation. `paymentMethod`/`paymentStatus` fields already exist on `Order` so adding Razorpay/Stripe later is additive, not a rewrite.
- **Transactional email:** password reset generates a real token and logs the reset link to the server console (`src/app/api/auth/forgot-password/route.ts`) — swap in Resend/Nodemailer when ready by replacing that one `console.log`.
- **Addresses model:** a full `Address` table exists for saved addresses on the user's account; the current checkout form captures the address inline per order (simpler for a v1). Wiring "save this address" is a small addition to `/api/profile`.

## 8. Design notes

Colors, type, and layout were extended from your logo (deep forest green, burnished copper/gold, warm cream) — see `tailwind.config.ts` for the exact token values (`forest`, `copper`, `moss`, `cream`). Display type is **Fraunces** (matches the logo's elegant serif wordmark), body type is **Inter**. The logo itself is used as the site favicon, header mark, and footer mark (`public/logo.png`).
