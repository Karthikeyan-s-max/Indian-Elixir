"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { formatINR } from "@/lib/utils";

type OrderItem = { id: string; productName: string; quantity: number; unitPrice: string };
type Order = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  city: string;
  state: string;
  items: OrderItem[];
};
type Profile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  orders: Order[];
  activities: { id: string; message: string; createdAt: string }[];
};

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PACKED: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        setProfile(d.user);
        setName(d.user?.name ?? "");
        setPhone(d.user?.phone ?? "");
      });
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
    const data = await res.json();
    if (res.ok) setSaveMsg("Saved!");
    else setSaveMsg(data.error);
    setTimeout(() => setSaveMsg(null), 2000);
  }

  if (!profile) {
    return <div className="container-page py-14 text-sm text-ink/50">Loading your account...</div>;
  }

  return (
    <div className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_1.4fr]">
      <div className="space-y-8">
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-forest">My details</h2>
          <form onSubmit={saveProfile} className="mt-4 space-y-4">
            <div>
              <label className="label-field">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">Email</label>
              <input value={profile.email} disabled className="input-field bg-forest/5" />
            </div>
            <div>
              <label className="label-field">WhatsApp number</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" />
            </div>
            {saveMsg && <p className="text-xs text-forest">{saveMsg}</p>}
            <button className="btn-secondary w-full">Save changes</button>
          </form>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-forest">Recent activity</h2>
          <ul className="mt-4 space-y-3">
            {profile.activities.length === 0 && <p className="text-sm text-ink/50">No activity yet.</p>}
            {profile.activities.map((a) => (
              <li key={a.id} className="text-xs text-ink/60">
                <span className="text-ink/40">{new Date(a.createdAt).toLocaleDateString()}</span> — {a.message}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-forest">Order history</h2>
        {profile.orders.length === 0 ? (
          <p className="mt-4 text-sm text-ink/50">You haven't placed any orders yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {profile.orders.map((o) => (
              <div key={o.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-forest">{o.orderNumber}</p>
                    <p className="text-xs text-ink/50">
                      {new Date(o.createdAt).toLocaleDateString()} · {o.city}, {o.state}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[o.status]}`}>
                    {o.status}
                  </span>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-ink/70">
                  {o.items.map((i) => (
                    <li key={i.id}>
                      {i.productName} × {i.quantity}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-right font-semibold text-copper-700">{formatINR(Number(o.totalAmount))}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
