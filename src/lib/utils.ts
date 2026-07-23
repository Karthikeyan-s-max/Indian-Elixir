import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number | string) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Human-readable order number, e.g. IE-24-000123
export function generateOrderNumber(sequence: number) {
  const yy = new Date().getFullYear().toString().slice(-2);
  return `IE-${yy}-${String(sequence).padStart(6, "0")}`;
}

/**
 * Builds a wa.me deep link that pre-fills an order confirmation message.
 * Used both by the customer (to notify the store) and by the admin
 * (to reply to the customer) since no payment gateway is wired up yet.
 */
export function buildWhatsAppLink(phoneWithCountryCode: string, message: string) {
  const cleanPhone = phoneWithCountryCode.replace(/[^\d]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
