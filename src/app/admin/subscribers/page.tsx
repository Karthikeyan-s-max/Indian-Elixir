"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Mail, Calendar, CheckCircle } from "lucide-react";

type Subscriber = {
  id: string;
  email: string;
  createdAt: string;
};

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/newsletter")
      .then((r) => r.json())
      .then((d) => {
        setSubscribers(d.subscribers ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest">Newsletter Subscribers</h1>
          <p className="mt-1 text-ink-muted">
            Customer emails collected from the &ldquo;Join Our Circle&rdquo; form on your website.
          </p>
        </div>
        <div className="rounded-xl border border-forest/10 bg-white px-4 py-2 text-sm font-semibold text-forest shadow-soft flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-forest" />
          <span>{subscribers.length} Total Subscribers</span>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl2 border border-forest/5 bg-white shadow-card">
        {loading ? (
          <div className="p-12 text-center text-ink-muted">Loading subscribers...</div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center text-ink-muted">
            <Mail className="mx-auto h-10 w-10 text-ink-muted/40 mb-3" />
            <p className="font-semibold text-ink">No subscribers yet.</p>
            <p className="text-xs mt-1">Emails submitted via &ldquo;Join Our Circle&rdquo; on the homepage/footer will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-forest/5 text-xs font-bold uppercase tracking-wide text-forest">
              <tr>
                <th className="px-6 py-4">Subscriber Email</th>
                <th className="px-6 py-4">Subscribed Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-t border-cream-line hover:bg-cream/20">
                  <td className="px-6 py-4 font-semibold text-ink flex items-center gap-2">
                    <Mail className="h-4 w-4 text-copper shrink-0" />
                    <span>{s.email}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-ink-muted">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-ink-muted/60" />
                      {new Date(s.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-sage/40 border border-sage/60 px-3 py-1 text-xs font-bold text-forest">
                      Subscribed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
