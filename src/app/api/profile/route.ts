import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { profileUpdateSchema } from "@/lib/validations";

export async function GET() {
  const session = await requireUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
      activities: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const session = await requireUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...parsed.data,
      activities: { create: { type: "PROFILE_UPDATED", message: "Profile details updated" } },
    },
    select: { id: true, name: true, email: true, phone: true },
  });

  return NextResponse.json({ user });
}
