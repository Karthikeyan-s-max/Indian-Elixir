export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// POST /api/newsletter - Public route for website visitors to join newsletter
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = emailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid email" }, { status: 400 });
    }

    const { email } = parsed.data;

    // Save or ignore if already subscribed
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return NextResponse.json({
      success: true,
      message: "✨ Thank you for joining our circle! We've saved your email.",
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to join circle. Please try again." }, { status: 500 });
  }
}

// GET /api/newsletter - Admin route to list all subscriber emails
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ subscribers });
}
