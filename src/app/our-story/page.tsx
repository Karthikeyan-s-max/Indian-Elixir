import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Our Story | Indian Elixir" };

const philosophy = [
  {
    title: "Stone-Ground Murungai",
    body: "We utilize traditional stone-grinding techniques to ensure the leaves are processed without the high heat of industrial friction, preserving 100% of the enzymes and nutrients.",
  },
  {
    title: "Shadow Drying",
    body: "Our leaves are never exposed to direct sunlight during drying. This preserves the vibrant chlorophyll and delicate volatile oils that give our elixir its signature potency.",
  },
  {
    title: "Regenerative Cycle",
    body: "Every byproduct of our production goes back into the earth as organic compost, completing the circle of life and ensuring the soil remains fertile for decades to come.",
  },
];

export default function OurStoryPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex h-[520px] items-center justify-center overflow-hidden text-center">
        <Image src="/our story.png" alt="Our Story Hero" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-forest/50" />
        <div className="container-page relative flex flex-col items-center gap-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">The Heritage</p>
          <h1 className="max-w-3xl font-display text-4xl font-bold text-cream sm:text-5xl">
            Our Journey from the Red Soils of Tamil Nadu
          </h1>
          <p className="max-w-xl text-lg text-cream/80">
            A legacy of purity, rooted in ancestral wisdom and the rich biodiversity
            of the Kongu region.
          </p>
        </div>
      </section>

      {/* THE ROOTS */}
      <section className="bg-cream py-24">
        <div className="container-page grid items-center gap-12 md:grid-cols-2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl2 shadow-popover">
            <Image src="/farmer sand hand.png" alt="The red soils of Tamil Nadu" fill className="object-cover" />
          </div>
          <div className="space-y-4">
            <p className="eyebrow">The Roots</p>
            <h2 className="font-display text-3xl font-bold text-forest">Honesty Grown in Semmai</h2>
            <p className="text-ink-muted leading-relaxed">
              Indian Elixir was born from a simple realization: the most potent
              medicine is that which is grown with honesty. Our story begins in the
              heart of Tamil Nadu, in the &lsquo;Semmai&rsquo; — the iconic red soil known
              for its incredible mineral richness and life-giving properties.
            </p>
            <p className="text-ink-muted leading-relaxed">
              What started as a family tradition of harvesting Moringa (Murungai) for
              our own kitchen has blossomed into a mission to share the unadulterated
              purity of our land with the world.
            </p>
            <blockquote className="border-l-4 border-copper/30 pl-6 font-display italic text-forest">
              &ldquo;We don&apos;t just farm; we steward a legacy that spans generations.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* THE FARMERS */}
      <section className="bg-cream py-24">
        <div className="container-page grid items-center gap-16 md:grid-cols-2">
          <div className="space-y-4">
            <p className="eyebrow">Our Partners</p>
            <h2 className="font-display text-3xl font-bold text-forest">The Farmer to Jar Mission</h2>
            <p className="text-ink-muted leading-relaxed">
              At the heart of Indian Elixir are the small-batch farmers of Tamil
              Nadu. We don&apos;t just source ingredients; we build lifelong partnerships
              based on mutual respect and shared values.
            </p>
            <p className="text-ink-muted leading-relaxed">
              By eliminating the middleman, we ensure that our farmers receive fair,
              premium wages that empower their families and communities. Every jar of
              Indian Elixir can be traced back to the specific field where it was grown.
            </p>
            <div className="relative mt-6 h-56 w-full overflow-hidden rounded-xl">
              <Image src="/moringa powder.png" alt="Farmer to jar moringa powder" fill className="object-cover" />
            </div>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl2 shadow-popover">
            <Image src="/farmer photo.png" alt="Our farmers" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="bg-cream-card py-24">
        <div className="container-page">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="eyebrow">Our Philosophy</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-forest">
              Rooted in Tradition, Inspired by Nature
            </h2>
            <p className="mt-4 text-ink-muted">
              We bridge the gap between ancient botanical wisdom and modern wellness
              through methods that honor the integrity of the plant.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {philosophy.map((p) => (
              <div key={p.title} className="card p-8 text-center">
                <h3 className="font-display text-xl font-bold text-forest">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-20 text-center">
        <div className="container-page flex flex-col items-center gap-6">
          <h2 className="font-display text-3xl font-bold text-cream">Bring the Wisdom Home</h2>
          <p className="max-w-xl text-cream/80">
            Every purchase supports traditional farming communities and brings a
            piece of Indian heritage to your daily ritual.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products" className="btn-copper">
              Shop the Harvest <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/products" className="rounded-lg border border-sage/50 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-sage hover:bg-white/5">
              Our Process
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
