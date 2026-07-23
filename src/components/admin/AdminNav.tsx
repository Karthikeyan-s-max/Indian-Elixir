"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ClipboardList, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/users", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {links.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold tracking-wide transition",
              active ? "bg-peach text-peach-ink" : "text-sage/90 hover:bg-white/5"
            )}
          >
            <l.icon className="h-[18px] w-[18px]" /> {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
