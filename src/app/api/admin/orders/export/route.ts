import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";

// GET /api/admin/orders/export?month=2026-07&sort=desc
// Streams back an .xlsx workbook with one row per order, grouped by
// customer, so the admin can download month-wise or full customer
// purchase-activity reports straight into Excel.
export async function GET(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // YYYY-MM, optional = all time
  const sort = searchParams.get("sort") === "asc" ? "asc" : "desc";

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
}
