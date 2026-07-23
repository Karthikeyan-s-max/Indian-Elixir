import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";

// GET /api/admin/orders?month=2026-07&status=PENDING&sort=desc
export async function GET(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // format YYYY-MM
  const status = searchParams.get("status");
  const sort = searchParams.get("sort") === "asc" ? "asc" : "desc";

  const where: any = {};
  if (status) where.status = status;
  if (month) {
    const [y, m] = month.split("-").map(Number);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 1);
    where.createdAt = { gte: start, lt: end };
  }

  const orders = await prisma.order.findMany({
    where,
    include: { items: true, user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: sort },
  });

  return NextResponse.json({ orders });
}
