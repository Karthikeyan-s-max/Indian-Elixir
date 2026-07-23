"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBasket, User, LogOut, LayoutDashboard } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/our-story", label: "Our Story" },
];

export default function Header() {
  const { data: session } = useSession();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-border/20 bg-cream/90 shadow-soft backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-90"
        >
          <div className="flex size-12 items-center justify-center overflow-hidden rounded-full border border-ink-border/30 shadow-soft">
            <Image src="/logo.png" alt="Indian Elixir" width={48} height={48} className="h-full w-full object-cover" />
          </div>
          <span className="font-display text-lg font-bold uppercase tracking-wider text-forest">
            Indian Elixir
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "pb-1.5 text-sm font-semibold uppercase tracking-wide transition",
                  active ? "border-b-2 border-copper text-copper" : "text-ink-muted hover:text-forest"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/checkout"
            className="relative rounded-full p-2.5 hover:bg-forest/5"
            aria-label="Cart"
          >
            <ShoppingBasket className="h-5 w-5 text-forest" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-copper text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {session ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-ink-border/30 px-3 py-1.5 text-sm font-medium text-forest hover:bg-forest/5"
              >
                <User className="h-4 w-4" /> {session.user.name?.split(" ")[0]}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-ink-border/20 bg-cream py-2 shadow-card">
                  <Link href="/account" className="block px-4 py-2 text-sm hover:bg-forest/5" onClick={() => setMenuOpen(false)}>
                    My account
                  </Link>
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-forest/5" onClick={() => setMenuOpen(false)}>
                      <LayoutDashboard className="h-3.5 w-3.5" /> Admin dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="rounded-lg border-2 border-forest px-4 py-2 text-xs font-semibold uppercase tracking-wide text-forest hover:bg-forest/5">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
