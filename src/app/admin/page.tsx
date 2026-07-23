import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  PENDING: "bg-copper-100/40 border-copper-100 text-copper-700",
  CONFIRMED: "bg-sage/30 border-sage/50 text-forest-400",
  PACKED: "bg-sage/30 border-sage/50 text-forest-400",
  SHIPPED: "bg-sage/40 border-sage/60 text-forest",
  DELIVERED: "bg-forest border-forest/20 text-white",
  CANCELLED: "bg-red-100 border-red-200 text-red-700",
};

export default async function AdminOverviewPage() {
  const [productCount, orderCount, userCount, revenue, pendingOrders, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Total Revenue", value: formatINR(Number(revenue._sum.totalAmount ?? 0)) },
    { label: "Orders", value: orderCount },
    { label: "Pending Orders", value: pendingOrders },
    { label: "Products", value: productCount },
    { label: "Customers", value: userCount },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-forest">Dashboard</h1>
      <p className="mt-1 text-ink-muted">A quick look at how the store is doing.</p>

      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl2 border border-forest/5 bg-white p-6 text-center shadow-card">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">{s.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-forest">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-forest">Recent Orders</h2>
          <Link href="/admin/orders" className="flex items-center gap-1 text-sm font-bold text-copper hover:text-copper-700">
            View All Orders <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl2 border border-forest/5 bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-forest/5 text-xs font-bold uppercase tracking-wide text-forest">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-ink-muted">No orders yet.</td></tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-cream-line">
                    <td className="px-6 py-4 font-bold text-ink">#{o.orderNumber}</td>
                    <td className="px-6 py-4 text-ink">{o.customerName}</td>
                    <td className="px-6 py-4 font-bold text-ink">{formatINR(Number(o.totalAmount))}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyle[o.status]}`}>
                        {o.status.charAt(0) + o.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-ink-muted">
                      {o.createdAt.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-16 text-center text-xs font-bold uppercase tracking-wide text-forest/40">
        Indian Elixir Administration &middot; Grandmother&apos;s Kitchen Wisdom
      </p>
    </div>
  );
}
