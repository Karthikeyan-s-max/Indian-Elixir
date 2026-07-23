import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";
import { getSiteSettings } from "@/lib/settings";
import { z } from "zod";

const settingsSchema = z.object({
  companyName: z.string().min(1),
  companyBlurb: z.string().min(1),
  aboutStory: z.string().optional().default(""),
  supportEmail: z.string().email(),
  supportPhone: z.string().min(5),
  helpQueriesEmail: z.string().email(),
  orderWhatsApp: z.string().regex(/^\d{10,15}$/, "Digits only, with country code, no + or spaces"),
});

// Public GET - the storefront (footer, contact info) reads this without auth.
export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

// PATCH - admin only, updates the singleton settings row.
export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: parsed.data,
    create: { id: "main", ...parsed.data },
  });

  return NextResponse.json({ settings });
}
