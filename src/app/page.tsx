import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBasket, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import AnimatedHeroJar from "@/components/home/AnimatedHeroJar";

export const dynamic = "force-dynamic";

const COMING_SOON = [
  { name: "Wildflower Moringa Tea", tag: "HERBAL", note: "A soothing blend of dried leaves and local wild herbs." },
  { name: "Cold-Pressed Seed Oil", tag: "OILS", note: "Nutrient-dense facial oil for deep skin nourishment." },
];

export default async function HomePage() {
  const activeProducts = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: { images: { orderBy: { isPrimary: "desc" } } },
    orderBy: { createdAt: "desc" },
    take: 1,
  });
  const featured = activeProducts[0];

  return (
    <>

      {/* HERO */}
      <section className="relative min-h-[640px] flex items-center overflow-hidden py-16 sm:py-24 sm:min-h-[720px]">
        <Image src="/hero section background pic.png" alt="Indian Elixir Hero" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/90 via-forest/70 to-forest/40" />

        <div className="container-page relative z-10 grid items-center gap-12 lg:grid-cols-12">
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6 text-cream">
            <div className="inline-flex items-center gap-2 rounded-full border border-sage/40 bg-forest/80 px-4 py-1.5 backdrop-blur-md animate-badge-pulse">
              <span className="text-xs font-bold uppercase tracking-wider text-sage">🌿 100% Single-Origin &amp; Farm Direct</span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Ancient Wisdom for <br />
              <span className="font-display italic text-copper-100 underline decoration-copper/40 decoration-wavy underline-offset-8">
                Modern Wellness
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-cream/90 sm:text-lg">
              Sustainably harvested from the nutrient-rich red soils of Tamil Nadu, our
              Moringa brings the unadulterated purity of traditional organic farming to your daily ritual.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/products" className="btn-copper shimmer-btn flex items-center gap-2 !px-8 !py-4 shadow-popover hover:scale-105 transition transform">
                Shop the Harvest <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/our-story" className="rounded-xl border-2 border-cream/80 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-cream hover:bg-white/10 transition">
                Explore Our Heritage
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-medium text-cream/80 border-t border-cream/15">
              <span>✓ Free Delivery Across India</span>
              <span>✓ No Added Heat or Chemicals</span>
              <span>✓ 100% Traditional Tamil Roots</span>
            </div>
          </div>

          {/* Right Column Floating Jar Hero Display */}
          <div className="lg:col-span-5 flex justify-center">
            <AnimatedHeroJar imageUrl={featured?.images[0]?.url} slug={featured?.slug} />
          </div>
        </div>
      </section>

      {/* THE MORINGA STORY */}
      <section className="bg-cream py-24">
        <div className="container-page grid items-center gap-16 md:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-block rounded-full bg-sage px-4 py-1 text-xs font-bold uppercase tracking-wide text-forest">
              The Miracle Tree
            </span>
            <h2 className="font-display text-3xl font-bold text-forest">The Moringa Story</h2>
            <p className="text-lg leading-relaxed text-ink-muted">
              For centuries, the Murungai tree has been the cornerstone of Tamil
              Nadu&apos;s wellness traditions. Referred to as &lsquo;The Miracle Tree&rsquo;, its
              leaves are a nutritional powerhouse, packed with antioxidants,
              vitamins, and minerals that nourish the body from within.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="font-display text-2xl font-bold text-forest">90+ Nutrients</p>
                <p className="mt-1 text-sm text-ink-muted">
                  A comprehensive profile of essential amino acids and minerals.
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-forest">Antioxidant Rich</p>
                <p className="mt-1 text-sm text-ink-muted">
                  Potent compounds to fight oxidative stress naturally.
                </p>
              </div>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full border-[20px] border-cream-line shadow-card">
            <Image src="/moringa story pic.png" alt="Moringa story" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* FEATURED HARVEST */}
      <section className="bg-cream-card py-20">
        <div className="container-page">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-forest">Featured Harvest</h2>
              <p className="mt-2 max-w-md text-ink-muted">
                Straight from our farms to your kitchen. Pure, unprocessed, and potent.
              </p>
            </div>
            <Link href="/products" className="flex items-center gap-1 text-sm font-bold text-copper hover:text-copper-700">
              View All Products <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured ? (
              <ProductCard
                name={featured.name}
                tag={featured.category ?? "GREENS"}
                description={featured.description}
                price={Number(featured.price)}
                image={featured.images[0]?.url}
                slug={featured.slug}
                badge="BESTSELLER"
              />
            ) : (
              <div className="card col-span-full p-10 text-center text-ink-muted">
                No live products yet -- add Murungai Powder from the admin dashboard.
              </div>
            )}
            {COMING_SOON.map((p) => (
              <ComingSoonCard key={p.name} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* TRUST / HONESTY BANNER */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-forest to-forest-900" />
        <div className="container-page relative flex justify-center">
          <div className="max-w-3xl rounded-xl2 border border-white/20 bg-white/10 p-10 text-center backdrop-blur-md sm:p-16">
            <h2 className="font-display text-3xl font-bold text-cream sm:text-4xl">Honesty in Every Root</h2>
            <p className="mt-6 text-lg leading-relaxed text-cream/90">
              We don&apos;t just sell products; we cultivate relationships. Every leaf of
              Indian Elixir is grown on our family-run farms in Tamil Nadu using
              centuries-old organic practices. No chemicals, no compromises -- just the
              pure, potent essence of the earth delivered to your doorstep.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 border-t border-white/20 pt-8 text-cream">
              {[
                { big: "100%", small: "Organic Certified" },
                { big: "Direct", small: "From Our Farmers" },
                { big: "Ethical", small: "Sourcing Model" },
              ].map((s) => (
                <div key={s.small} className="text-center">
                  <p className="font-display text-3xl font-bold">{s.big}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-cream/70">{s.small}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-cream-line py-16">
        <div className="container-page">
          <div className="flex flex-col items-center gap-8 rounded-xl2 bg-forest p-10 sm:p-16 md:flex-row md:justify-between">
            <div className="max-w-md text-center md:text-left">
              <h2 className="font-display text-2xl font-bold text-cream sm:text-3xl">
                Join Our Circle of Wisdom
              </h2>
              <p className="mt-3 text-cream/80">
                Receive seasonal harvest updates, traditional recipes, and wellness
                insights from our village elders.
              </p>
            </div>
            <form className="flex w-full max-w-md gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-cream/20 bg-white/10 px-5 py-4 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-copper/40"
              />
              <button type="submit" className="btn-copper !py-4">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

import NewsletterForm from "@/components/layout/NewsletterForm";

function ProductCard({
  name,
  tag,
  description,
  price,
  image,
  slug,
  badge,
}: {
  name: string;
  tag: string;
  description: string;
  price: number;
  image?: string;
  slug: string;
  badge?: string;
}) {
  const displayImage = image ?? "/moringa powder.png";

  return (
    <Link href={`/products/${slug}`} className="group card flex flex-col gap-2 p-4 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-cream-card">
        <Image src={displayImage} alt={name} fill className="object-cover transition duration-500 group-hover:scale-105" />
        {badge && (
          <span className="absolute left-4 top-4 rounded-full bg-copper px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-soft">
            {badge}
          </span>
        )}
      </div>
      <p className="pt-4 text-xs font-semibold uppercase tracking-wide text-copper">{tag}</p>
      <h3 className="font-display text-2xl font-bold text-forest group-hover:text-copper transition-colors">
        {name}
      </h3>
      <p className="line-clamp-2 text-sm text-ink-muted">{description}</p>
      <div className="flex items-center justify-between pt-3">
        <span className="font-display text-xl font-bold text-copper">{formatINR(price)}</span>
        <span className="flex size-11 items-center justify-center rounded-full bg-forest text-cream group-hover:bg-copper transition-colors">
          <ShoppingBasket className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function ComingSoonCard({ name, tag, note }: { name: string; tag: string; note: string }) {
  return (
    <div className="card flex flex-col gap-2 p-4 opacity-80 grayscale-[30%]">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-cream-card">
        <Image src="/logo.png" alt={name} fill className="object-contain p-12 opacity-40" />
      </div>
      <p className="pt-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">{tag}</p>
      <p className="font-display text-2xl font-bold text-forest">{name}</p>
      <p className="line-clamp-2 text-sm text-ink-muted">{note}</p>
      <div className="flex items-center justify-between pt-3">
        <span className="font-display text-sm italic font-semibold text-copper/60">Coming Soon</span>
        <button className="rounded-lg border border-ink-border/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-muted hover:bg-cream">
          Notify Me
        </button>
      </div>
    </div>
  );
}
