export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category") ?? undefined;
    const q = req.nextUrl.searchParams.get("q") ?? undefined;

    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        ...(category ? { category } : {}),
        ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
      },
      include: { images: { orderBy: { isPrimary: "desc" } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (err) {
    console.error("Products GET error:", err);
    return NextResponse.json({ products: [] });
  }
}
