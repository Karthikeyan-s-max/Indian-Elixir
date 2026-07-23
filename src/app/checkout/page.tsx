"use client";

export const dynamic = "force-dynamic";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Trash2, MessageCircle, Truck, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/components/cart/CartContext";
import { checkoutSchema } from "@/lib/validations";
import { formatINR } from "@/lib/utils";

const formSchema = checkoutSchema.omit({ items: true });
type FormValues = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const { items, total, removeItem, updateQuantity, clear } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [orderSuccess, setOrderSuccess] = useState<{ orderNumber: string; whatsappUrl: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (items.length === 0) {
      setServerError("Your cart is empty. Add a product before checking out.");
      return;
    }
    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong placing your order.");
        return;
      }

      clear();
      setOrderSuccess({ orderNumber: data.order.orderNumber, whatsappUrl: data.whatsappUrl });
      window.open(data.whatsappUrl, "_blank");
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page grid gap-12 py-24 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <h1 className="font-display text-5xl font-bold text-forest">Almost there</h1>
        <p className="mt-3 max-w-lg text-lg text-ink-muted">
          Fill in your details and we&apos;ll personally confirm your order on WhatsApp.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
          <div>
            <label className="label-field">Full Name</label>
            <input {...register("customerName")} className="input-field" placeholder="Your full name" />
            {errors.customerName && <p className="mt-1 text-xs text-red-600">{errors.customerName.message}</p>}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="label-field">WhatsApp Number</label>
              <input {...register("phone")} className="input-field" placeholder="98765 43210" />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="label-field">Email Address</label>
              <input {...register("email")} className="input-field" placeholder="you@example.com" />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label className="label-field">Delivery Address</label>
            <textarea {...register("addressLine1")} rows={3} className="input-field" placeholder="Apartment, Street, Area..." />
            {errors.addressLine1 && <p className="mt-1 text-xs text-red-600">{errors.addressLine1.message}</p>}
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <label className="label-field">City</label>
              <input {...register("city")} className="input-field" placeholder="Chennai" />
              {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
            </div>
            <div>
              <label className="label-field">State</label>
              <input {...register("state")} className="input-field" placeholder="Tamil Nadu" />
              {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
            </div>
            <div>
              <label className="label-field">Pincode</label>
              <input {...register("pincode")} className="input-field" placeholder="600001" />
              {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode.message}</p>}
            </div>
          </div>

          <div>
            <label className="label-field text-ink-muted">Notes (Optional)</label>
            <textarea {...register("notes")} rows={2} className="input-field" placeholder="Specific delivery instructions or gift notes..." />
          </div>

          {serverError && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{serverError}</p>}

          <div className="space-y-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-copper flex h-16 w-full items-center justify-center gap-3 !text-lg">
              <MessageCircle className="h-5 w-5" />
              {submitting ? "Placing order..." : "Place Order — We'll Confirm on WhatsApp"}
            </button>
            <p className="text-center text-sm font-bold text-forest">
              No payment needed right now. We&apos;ll chat on WhatsApp to finalize.
            </p>
          </div>
        </form>
      </div>

      <div className="h-fit rounded-xl2 bg-white p-8 shadow-card">
        <h2 className="border-b border-ink-border/20 pb-4 font-display text-2xl font-bold text-forest">
          Your Order
        </h2>
        {items.length === 0 ? (
          <p className="mt-6 text-sm text-ink-muted">Your cart is empty.</p>
        ) : (
          <ul className="mt-6 space-y-6">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-cream-line">
                  <Image src={item.image ?? "/logo.png"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <p className="font-medium text-ink">{item.name}</p>
                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-3 rounded-full border border-ink-border/30 bg-cream px-3 py-1">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="text-ink-muted">-</button>
                      <span className="text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="text-ink-muted">+</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink">{formatINR(item.price * item.quantity)}</span>
                      <button onClick={() => removeItem(item.productId)} aria-label="Remove item">
                        <Trash2 className="h-4 w-4 text-ink-muted/40 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 space-y-3 border-t border-ink-border/20 pt-6">
          <div className="flex justify-between text-sm text-ink-muted">
            <span>Subtotal</span>
            <span>{formatINR(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink-muted">Shipping</span>
            <span className="font-semibold text-forest">FREE</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg text-forest">Total</span>
            <span className="font-display text-2xl text-copper">{formatINR(total)}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3 rounded-lg bg-forest-400 p-4">
          <Truck className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
          <p className="text-sm text-sage">
            Ships within 24 hours via premium courier. Trackable on WhatsApp.
          </p>
        </div>
      </div>

      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-popover space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-sage/40 text-forest">
              <CheckCircle2 className="h-10 w-10 text-forest" />
            </div>
            <h2 className="font-display text-2xl font-bold text-forest">Order Placed Successfully! 🎉</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Your order <span className="font-bold text-copper">#{orderSuccess.orderNumber}</span> has been received. We are opening WhatsApp to finalize delivery details.
            </p>
            <div className="pt-4 space-y-3">
              <a
                href={orderSuccess.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-copper flex items-center justify-center gap-2 w-full !py-3.5"
              >
                <MessageCircle className="h-4 w-4" /> Open WhatsApp Chat
              </a>
              <button
                onClick={() => router.push("/account")}
                className="w-full rounded-lg border border-ink-border/30 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted hover:bg-cream"
              >
                View My Orders →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
