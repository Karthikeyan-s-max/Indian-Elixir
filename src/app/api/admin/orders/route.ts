export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const month = req.nextUrl.searchParams.get("month");
    const status = req.nextUrl.searchParams.get("status");
    const sort = req.nextUrl.searchParams.get("sort") === "asc" ? "asc" : "desc";

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
  } catch (err) {
    console.error("Admin orders GET error:", err);
    return NextResponse.json({ orders: [] });
  }
}
