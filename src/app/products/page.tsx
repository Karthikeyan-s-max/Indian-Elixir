import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

const CATEGORIES = ["Greens", "Spices", "Seeds", "Oils"];

// Products we're planning but not yet selling -- shown greyed out with a
// waitlist capture, never purchasable, per the founder's instructions.
const COMING_SOON = [
  { name: "Organic Chia Seeds", tag: "SEEDS", note: "Cold-sourced and traditionally cleaned. Perfect for modern wellness with an ancient touch." },
  { name: "Golden Sesame Seeds", tag: "SEEDS", note: "Hand-harvested during the solar solstice. Rich in essential minerals and traditional flavor." },
  { name: "Ceylon Cardamom", tag: "SPICES", note: "Aromatic whole pods, sun-dried the traditional way." },
  { name: "Whole Cumin Seeds", tag: "SPICES", note: "Earthy, warm, and ground fresh to order once it launches." },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      ...(searchParams.category ? { category: searchParams.category.toLowerCase() } : {}),
    },
    include: { images: { orderBy: { isPrimary: "desc" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-page py-24">
      <div className="mb-16 max-w-2xl">
        <h1 className="font-display text-5xl font-bold text-forest">Traditional Treasures</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Honoring ancestral Tamil wisdom through pure, farm-rooted ingredients. Each
          product is a promise of quality, transparency, and holistic nourishment.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* SIDEBAR */}
        <aside className="card w-full shrink-0 space-y-8 p-6 lg:w-64">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted/70">Categories</p>
            <ul className="mt-4 space-y-3">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link
                    href={`/products?category=${c.toLowerCase()}`}
                    className="flex items-center justify-between text-sm font-semibold text-ink-muted hover:text-copper"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-ink-border/20 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted/70">Our Promise</p>
            <ul className="mt-4 space-y-2 text-xs text-ink-muted">
              <li>Tamil Heritage Formulations</li>
              <li>Zero Synthetic Pesticides</li>
            </ul>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <div className="flex-1 space-y-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.length === 0 && (
              <div className="col-span-full card p-10 text-center text-ink-muted">
                No products yet -- add Murungai Powder from the admin dashboard.
              </div>
            )}
            {products.map((p) => (
              <div key={p.id} className="card flex flex-col gap-2 p-4">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-cream-card">
                  <Image src={p.images[0]?.url ?? "/logo.png"} alt={p.name} fill className="object-cover" />
                  <span className="absolute left-4 top-5 rounded-full bg-forest/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-forest backdrop-blur">
                    Harvest Fresh
                  </span>
                </div>
                <p className="pt-4 text-xs font-semibold uppercase tracking-wide text-copper">
                  {p.category ?? "Greens"}
                </p>
                <Link href={`/products/${p.slug}`} className="font-display text-2xl font-bold text-forest hover:underline">
                  {p.name}
                </Link>
                <p className="line-clamp-2 text-sm text-ink-muted">{p.description}</p>
                <div className="flex items-center justify-between pt-3">
                  <span className="font-display text-lg text-copper">{formatINR(Number(p.price))}</span>
                  <Link href={`/products/${p.slug}`} className="btn-copper !px-6 !py-2 !text-xs">
                    Add to Cart
                  </Link>
                </div>
              </div>
            ))}

            {COMING_SOON.map((p) => (
              <div key={p.name} className="card flex flex-col gap-2 p-4 opacity-80 grayscale-[20%]">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-cream-card">
                  <Image src="/logo.png" alt={p.name} fill className="object-contain p-14 opacity-40" />
                </div>
                <p className="pt-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">{p.tag}</p>
                <p className="font-display text-2xl font-bold text-forest">{p.name}</p>
                <p className="line-clamp-3 text-sm text-ink-muted">{p.note}</p>
                <div className="flex items-center justify-between pt-3">
                  <span className="font-display text-sm italic font-semibold text-copper/60">Coming Soon</span>
                </div>
              </div>
            ))}
          </div>

          {/* WAITLIST CAPTURE */}
          <div className="rounded-2xl border-2 border-dashed border-ink-border/40 bg-cream-card/30 p-12 text-center">
            <h3 className="font-display text-2xl text-forest/60">More wisdom is ripening&hellip;</h3>
            <p className="mt-2 text-ink-muted/70">
              Sign up to get notified when our next seasonal harvest arrives.
            </p>
            <form className="mx-auto mt-6 flex max-w-sm gap-3">
              <input
                type="email"
                placeholder="Email address"
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary !px-6 !py-3 !text-xs">
                Notify Me
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
