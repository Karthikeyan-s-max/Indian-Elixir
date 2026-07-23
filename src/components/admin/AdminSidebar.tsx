"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, ClipboardList, Users, Settings, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/users", label: "Customers", icon: Users },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export default function AdminSidebar({ name }: { name?: string | null }) {
  const pathname = usePathname();
  const initials = name
    ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "AD";

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col justify-between bg-gradient-to-b from-forest to-forest-400 px-4 py-8 shadow-popover">
      <div className="px-2">
        <div className="flex flex-col items-start gap-4">
          <div className="size-16 overflow-hidden rounded-full border-2 border-sage/60">
            <Image src="/logo.png" alt="Indian Elixir" width={64} height={64} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="font-display text-2xl text-copper-100">Indian Elixir</p>
            <p className="text-sm font-semibold tracking-wide text-white/70">Admin Dashboard</p>
          </div>
        </div>

        <nav className="mt-10 flex flex-col gap-2">
          {links.map((l) => {
            const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold tracking-wide transition",
                  active ? "bg-copper-100 text-forest-900" : "text-sage/90 hover:bg-white/5"
                )}
              >
                <l.icon className="h-[18px] w-[18px]" /> {l.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3 border-t border-sage/20 px-2 pt-6">
        <div className="flex size-10 items-center justify-center rounded-full bg-sage text-sm font-bold text-forest">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-white">Admin Profile</p>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="text-xs text-white/60 hover:text-white">
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
