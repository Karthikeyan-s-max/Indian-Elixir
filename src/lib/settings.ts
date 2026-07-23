import { prisma } from "@/lib/prisma";

// The site settings table always has exactly one row (id = "main"). This
// helper creates it with defaults on first read so the rest of the app
// never has to null-check.
export async function getSiteSettings() {
  const existing = await prisma.siteSettings.findUnique({ where: { id: "main" } });
  if (existing) return existing;
  try {
    return await prisma.siteSettings.create({ data: { id: "main" } });
  } catch (e) {
    const fallback = await prisma.siteSettings.findUnique({ where: { id: "main" } });
    if (fallback) return fallback;
    throw e;
  }
}
