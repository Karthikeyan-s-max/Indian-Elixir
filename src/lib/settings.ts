import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
  id: "main",
  companyName: "Indian Elixir",
  companyBlurb: "Honoring ancestral Tamil wisdom through pure, farm-rooted ingredients.",
  aboutStory: "",
  supportEmail: "hello@indianelixir.com",
  supportPhone: "+91 99999 99999",
  helpQueriesEmail: "help@indianelixir.com",
  orderWhatsApp: "919999999999",
  updatedAt: new Date(),
};

export async function getSiteSettings() {
  try {
    const existing = await prisma.siteSettings.findUnique({ where: { id: "main" } });
    if (existing) return existing;
    return await prisma.siteSettings.create({ data: { id: "main" } });
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}
