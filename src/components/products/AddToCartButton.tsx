"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export default function AddToCartButton({
  productId,
  name,
  price,
  image,
  stock,
}: {
  productId: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ productId, name, price, image }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (stock <= 0) {
    return (
      <button disabled className="btn-primary w-full opacity-50">
        Out of stock
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex items-center justify-center rounded-full border border-forest/20">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3" aria-label="Decrease quantity">
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center text-sm font-semibold">{qty}</span>
        <button onClick={() => setQty((q) => Math.min(stock, q + 1))} className="p-3" aria-label="Increase quantity">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button onClick={handleAdd} className="btn-primary flex-1">
        {added ? "Added ✓" : "Add to cart"}
      </button>
      <button
        onClick={() => {
          addItem({ productId, name, price, image }, qty);
          router.push("/checkout");
        }}
        className="btn-copper flex-1"
      >
        Buy now
      </button>
    </div>
  );
}
