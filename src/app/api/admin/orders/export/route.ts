export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const month = req.nextUrl.searchParams.get("month");
    const sort = req.nextUrl.searchParams.get("sort") === "asc" ? "asc" : "desc";

    const where: any = {};
    if (month) {
      const [y, m] = month.split("-").map(Number);
      where.createdAt = { gte: new Date(y, m - 1, 1), lt: new Date(y, m, 1) };
    }

    const orders = await prisma.order.findMany({
      where,
      include: { items: true, user: { select: { id: true, name: true, email: true } } },
      orderBy: [{ customerName: "asc" }, { createdAt: sort }],
    });

    const rows = orders.map((o) => ({
      "Customer ID": o.userId ?? "GUEST",
      "Customer Name": o.customerName,
      Email: o.email,
      "WhatsApp Number": o.phone,
      "Order Number": o.orderNumber,
      "Order Date": o.createdAt.toISOString().slice(0, 10),
      Items: o.items.map((i) => `${i.productName} x${i.quantity}`).join("; "),
      "Total Amount (INR)": Number(o.totalAmount),
      "Delivery City": o.city,
      "Delivery State": o.state,
      Pincode: o.pincode,
      Status: o.status,
      "Payment Method": o.paymentMethod,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 16 }, { wch: 20 }, { wch: 24 }, { wch: 16 }, { wch: 16 },
      { wch: 12 }, { wch: 40 }, { wch: 16 }, { wch: 14 }, { wch: 14 },
      { wch: 10 }, { wch: 12 }, { wch: 14 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Orders");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    const uint8 = new Uint8Array(buffer);

    const filename = month
      ? `indian-elixir-orders-${month}.xlsx`
      : `indian-elixir-orders-all.xlsx`;

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json({ error: "Failed to export orders" }, { status: 500 });
  }
}
