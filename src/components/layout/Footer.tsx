import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import NewsletterForm from "@/components/layout/NewsletterForm";

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="border-t border-ink-border/30 bg-cream-card">
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
        <div className="space-y-6">
          <div className="flex size-20 items-center justify-center overflow-hidden rounded-full border border-ink-border/30 shadow-soft">
            <Image src="/logo.png" alt={settings.companyName} width={80} height={80} className="h-full w-full object-cover" />
          </div>
          <p className="text-sm leading-relaxed text-ink-muted">{settings.companyBlurb}</p>
        </div>

        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-wide text-ink">Journey</p>
          <ul className="space-y-3 text-sm text-ink-muted">
            <li><Link href="/our-story" className="hover:text-forest transition-colors">Our Story</Link></li>
            <li><Link href="/products" className="hover:text-forest transition-colors">The Science of Moringa</Link></li>
            <li><Link href="/products" className="hover:text-forest transition-colors">Shop Harvest</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-wide text-ink">Support & Admin</p>
          <ul className="space-y-3 text-sm text-ink-muted">
            <li><a href={`mailto:${settings.supportEmail}`} className="hover:text-forest transition-colors">{settings.supportEmail}</a></li>
            <li><a href={`tel:${settings.supportPhone.replace(/\s/g, "")}`} className="hover:text-forest transition-colors">{settings.supportPhone}</a></li>
            <li><Link href="/account" className="hover:text-forest transition-colors">Track My Order</Link></li>
            <li className="pt-2 border-t border-ink-border/20">
              <Link href="/login" className="font-semibold text-copper hover:text-copper-700 transition-colors flex items-center gap-1">
                🔐 Admin Login Portal →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-ink-border/20 py-6 text-center text-xs text-ink-muted/70 flex flex-wrap justify-between container-page">
        <span>© {new Date().getFullYear()} {settings.companyName}. Rooted in Tradition.</span>
        <Link href="/login" className="hover:underline text-ink-muted/80">Admin Portal</Link>
      </div>
    </footer>
  );
}
