"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Download, MessageCircle } from "lucide-react";
import { formatINR, buildWhatsAppLink } from "@/lib/utils";

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  city: string;
  state: string;
  user: { id: string; name: string; email: string } | null;
  items: { id: string; productName: string; quantity: number }[];
};

const STATUSES = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PACKED: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState<string>(""); // empty = all time
  const [status, setStatus] = useState<string>("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (month) params.set("month", month);
    if (status) params.set("status", status);
    params.set("sort", sort);

    const res = await fetch(`/api/admin/orders?${params.toString()}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, status, sort]);

  async function updateStatus(id: string, newStatus: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    load();
  }

  async function exportExcel() {
    const params = new URLSearchParams();
    if (month) params.set("month", month);
    params.set("sort", sort);
    const url = `/api/admin/orders/export?${params.toString()}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = month ? `indian-elixir-orders-${month}.xlsx` : "indian-elixir-orders-all.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      window.location.href = url;
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest">Orders</h1>
          <p className="mt-1 text-ink-muted">View, filter, and update customer orders.</p>
        </div>
        <button onClick={exportExcel} className="btn-copper">
          <Download className="h-4 w-4" /> Export to Excel
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <select value={month} onChange={(e) => setMonth(e.target.value)} className="input-field w-auto">
          <option value="">All time</option>
          <option value={currentMonth()}>This month</option>
          {Array.from({ length: 6 }).map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (i + 1));
            const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            return (
              <option key={val} value={val}>
                {d.toLocaleString("default", { month: "long", year: "numeric" })}
              </option>
            );
          })}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field w-auto">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value as "asc" | "desc")} className="input-field w-auto">
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-forest/5 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest/5 text-xs font-bold uppercase tracking-wide text-forest">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Respond</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-ink-muted">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-ink-muted">No orders found.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t border-cream-line align-top">
                  <td className="px-4 py-3 font-bold text-forest">{o.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p>{o.customerName}</p>
                    <p className="text-xs text-ink-muted">{o.phone} · {o.city}, {o.state}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted">
                    {o.items.map((i) => `${i.productName} x${i.quantity}`).join(", ")}
                  </td>
                  <td className="px-4 py-3 font-bold text-copper">{formatINR(Number(o.totalAmount))}</td>
                  <td className="px-4 py-3 text-xs text-ink-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className={`rounded-full border-0 px-3 py-1 text-xs font-bold ${statusColors[o.status]}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={buildWhatsAppLink(
                        o.phone,
                        `Hi ${o.customerName}, this is Indian Elixir confirming your order ${o.orderNumber}. Current status: ${o.status}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-9 items-center justify-center rounded-full bg-forest text-white hover:bg-forest-400"
                      aria-label={`Respond to ${o.customerName} on WhatsApp`}
                      title="Respond via WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
