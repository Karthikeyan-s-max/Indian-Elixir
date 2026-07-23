import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ChevronRight, Leaf, Package, FlaskConical, Sprout } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import AddToCartButton from "@/components/products/AddToCartButton";
import ProductReviewsSection from "@/components/products/ProductReviewsSection";

export const dynamic = "force-dynamic";

const NUTRIENTS = [
  { label: "High Iron", note: "Essential for energy production and oxygen transport in the body.", stat: "85% RDA per serving", bar: 85, bg: "bg-forest" },
  { label: "Vitamin C", note: "Powerful antioxidant to boost immunity and support skin health.", stat: "7x Orange potency", bar: 70, bg: "bg-copper" },
  { label: "Plant Calcium", note: "Highly bio-available calcium for strong bones and metabolic health.", stat: "4x Milk calcium", bar: 60, bg: "bg-forest-400" },
];

const TRUST_BADGES = [
  { icon: Leaf, label: "Non-GMO Verified" },
  { icon: Package, label: "Zero Plastic Shipping" },
  { icon: FlaskConical, label: "Bio-Available Nutrients" },
  { icon: Sprout, label: "Traditional Methods" },
];

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: { orderBy: { isPrimary: "desc" } } },
  });

  if (!product || product.status !== "ACTIVE") notFound();

  const image = product.images[0]?.url ?? "/logo.png";

  return (
    <>
      {/* BREADCRUMB + HERO */}
      <section className="container-page pt-16">
        <nav className="mb-8 flex items-center gap-2 text-sm text-ink-muted">
          <Link href="/products" className="hover:text-forest">Shop</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-copper">{product.name}</span>
        </nav>

        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <div className="card flex aspect-square items-center justify-center overflow-hidden p-8 shadow-card">
              <div className="relative h-full w-full">
                <Image src={image} alt={product.name} fill className="object-contain drop-shadow-xl" />
              </div>
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 flex justify-center gap-4">
                {product.images.map((img, i) => (
                  <div
                    key={img.id}
                    className={`relative size-20 overflow-hidden rounded-lg border-2 ${i === 0 ? "border-copper" : "border-ink-border/30 opacity-60"}`}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="font-display text-4xl font-bold leading-tight text-forest sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-4">
              <span className="font-display text-2xl text-ink">{formatINR(Number(product.price))}</span>
              <span className="flex items-center gap-2 rounded-full border border-forest/10 bg-forest/5 px-3 py-1">
                <span className="size-2 rounded-full bg-forest" />
                <span className="text-sm text-forest">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex text-copper">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-copper" />
                ))}
              </div>
              <span className="text-sm text-ink-muted">128 Reviews</span>
              <span className="size-1 rounded-full bg-ink-border" />
              <span className="text-sm font-semibold text-ink">100% Organic &amp; Farm-Sourced</span>
            </div>

            <p className="mt-6 text-lg leading-relaxed text-ink-muted">{product.description}</p>

            <div className="mt-8">
              <AddToCartButton
                productId={product.id}
                name={product.name}
                price={Number(product.price)}
                image={image}
                stock={product.stock}
              />
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-ink-border/20 pt-8">
              {TRUST_BADGES.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <b.icon className="h-4 w-4 text-ink-muted" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NUTRITIONAL POTENCY */}
      <section className="mt-24 bg-cream-card py-24">
        <div className="container-page">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-forest">Nutritional Potency</h2>
            <p className="mt-3 text-ink-muted">
              One teaspoon of Indian Elixir Murungai contains more concentrated
              nutrients than many whole foods combined.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {NUTRIENTS.map((n) => (
              <div key={n.label} className="card flex flex-col items-center p-8 text-center">
                <div className={`mb-4 flex size-16 items-center justify-center rounded-full ${n.bg}`}>
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-forest">{n.label}</h3>
                <p className="mt-2 text-sm text-ink-muted">{n.note}</p>
                <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-cream-line">
                  <div className={`h-full ${n.bg}`} style={{ width: `${n.bar}%` }} />
                </div>
                <p className="mt-2 text-xs font-bold uppercase text-copper">{n.stat}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECIPE CARD */}
      <section className="container-page py-24">
        <div className="overflow-hidden rounded-xl2 bg-forest shadow-popover md:flex">
          <div className="flex-1 p-10 sm:p-16">
            <p className="text-sm uppercase tracking-[0.15em] text-copper-100">The Ancient Ritual</p>
            <h2 className="mt-2 font-display text-4xl font-bold italic text-cream">
              Grandmother&apos;s Morning Tonic
            </h2>
            <blockquote className="mt-6 border-l-2 border-copper pl-6 italic text-cream/80">
              &ldquo;A daily ritual used for generations to ignite the agni (digestive
              fire) and ground the spirit before sunrise.&rdquo;
            </blockquote>
            <div className="mt-8">
              <p className="text-sm uppercase tracking-wide text-cream/60">Ingredients</p>
              <ul className="mt-4 space-y-2 text-cream/90">
                <li className="flex items-center gap-3"><span className="size-1.5 rounded-full bg-copper" /> 1 tsp Pure Murungai Leaf Powder</li>
                <li className="flex items-center gap-3"><span className="size-1.5 rounded-full bg-copper" /> Warm (not boiling) water</li>
                <li className="flex items-center gap-3"><span className="size-1.5 rounded-full bg-copper" /> A squeeze of fresh lime</li>
                <li className="flex items-center gap-3"><span className="size-1.5 rounded-full bg-copper" /> Raw wild honey (optional)</li>
              </ul>
            </div>
          </div>
          <div className="relative min-h-[300px] flex-1">
            <Image src="/grndmother tonic.png" alt="Grandmother's Morning Tonic" fill className="object-cover" />
            <div className="absolute inset-x-8 bottom-8 rounded-lg bg-white/90 p-6 backdrop-blur">
              <p className="text-sm font-bold text-forest">Pro Tip</p>
              <p className="mt-1 text-xs text-ink-muted">
                Avoid boiling water to preserve the delicate heat-sensitive Vitamin C
                and enzymes. Mix into a paste first to avoid clumps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REAL REVIEWS SECTION */}
      <ProductReviewsSection slug={params.slug} />
    </>
  );
}
