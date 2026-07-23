export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";
import { orderStatusSchema } from "@/lib/validations";

export async function GET() {
  return NextResponse.json({ error: "Use PATCH to update order status" }, { status: 405 });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const parsed = orderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    });

    if (order.userId) {
      await prisma.activityLog.create({
        data: {
          userId: order.userId,
          type: "ORDER_STATUS_UPDATED",
          message: `Order ${order.orderNumber} is now ${parsed.data.status}`,
        },
      });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error("Order status update error:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
