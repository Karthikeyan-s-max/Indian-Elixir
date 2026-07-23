"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { formatINR } from "@/lib/utils";

type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  _count: { orders: number };
  orders: { totalAmount: string; createdAt: string; status: string }[];
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => {
        setUsers(d.users ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-forest">Customers</h1>
      <p className="mt-1 text-ink-muted">All registered users and their recent activity.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-forest/5 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest/5 text-xs font-bold uppercase tracking-wide text-forest">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Last order</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-ink/40">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-ink/40">No customers yet.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-t border-cream-line">
                  <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                  <td className="px-4 py-3 text-xs text-ink/60">{u.email}<br />{u.phone}</td>
                  <td className="px-4 py-3">{u._count.orders}</td>
                  <td className="px-4 py-3 text-xs text-ink/60">
                    {u.orders[0]
                      ? `${formatINR(Number(u.orders[0].totalAmount))} · ${new Date(u.orders[0].createdAt).toLocaleDateString()}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-ink/40">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
