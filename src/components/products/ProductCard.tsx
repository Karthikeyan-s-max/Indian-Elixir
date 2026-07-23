import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/utils";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  price: number | string;
  stock: number;
  images: { url: string }[];
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0]?.url ?? "/moringa powder.png";
  const outOfStock = product.stock <= 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="card overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-forest-50">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          {outOfStock && (
            <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              Out of stock
            </span>
          )}
        </div>
        <div className="space-y-1 p-4">
          <p className="font-display text-base font-semibold text-forest">{product.name}</p>
          <p className="text-sm font-semibold text-copper-700">{formatINR(product.price)}</p>
        </div>
      </div>
    </Link>
  );
}
