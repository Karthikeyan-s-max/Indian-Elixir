"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function AnimatedHeroJar({
  imageUrl,
  slug,
}: {
  imageUrl?: string;
  slug?: string;
}) {
  const displayImage = imageUrl ?? "/moringa powder.png";

  return (
    <div className="relative flex justify-center">
      {/* Ambient Pulsing Aura behind the jar */}
      <div className="absolute inset-0 mx-auto max-w-xs rounded-full bg-emerald-500/30 animate-pulse-glow pointer-events-none" />

      {/* Floating 3D Card with Motion */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="animate-float relative w-full max-w-sm rounded-2xl border border-white/25 bg-white/10 p-6 backdrop-blur-md shadow-[0_25px_60px_rgba(8,39,25,0.45)] group hover:border-copper/40 transition duration-500"
      >
        <div className="relative aspect-square overflow-hidden rounded-xl bg-cream/90 shadow-card">
          <Image
            src={displayImage}
            alt="Pure Murungai Leaf Powder"
            fill
            className="object-cover transition duration-700 group-hover:scale-108"
          />
          <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-forest/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cream backdrop-blur-md shadow-soft">
            <Sparkles className="h-3 w-3 text-copper-100 animate-spin-slow" /> Pure Stone-Ground
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-cream group-hover:text-copper-100 transition">
              Pure Murungai Powder
            </h3>
            <div className="flex items-center gap-1 text-xs text-copper-100 mt-1">
              <div className="flex text-amber-400">★★★★★</div>
              <span className="font-medium text-cream/80">4.9/5 (120+ Reviews)</span>
            </div>
          </div>
          <Link
            href={`/products/${slug ?? "moringa-leaf-powder"}`}
            className="btn-copper shimmer-btn !py-2.5 !px-4 text-xs flex items-center gap-1.5 font-bold shadow-popover hover:scale-105 transition transform"
          >
            Shop Now <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
