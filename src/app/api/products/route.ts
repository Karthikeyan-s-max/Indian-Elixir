export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? undefined;
  const q = searchParams.get("q") ?? undefined;

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
}
