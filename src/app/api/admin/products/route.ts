import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { uploadProductImage } from "@/lib/cloudinary";

// GET: full product list (including inactive) for the admin dashboard
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const products = await prisma.product.findMany({
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

// POST: create a new product. Accepts optional base64 `imageDataUri` which
// gets uploaded to Cloudinary. Additional images can be added later via
// the [id]/images sub-route.
export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { name, description, price, stock, category, status } = parsed.data;

  let slug = slugify(name);
  const existingSlug = await prisma.product.findUnique({ where: { slug } });
  if (existingSlug) slug = `${slug}-${Date.now().toString().slice(-5)}`;

  let imageCreate: { url: string; publicId?: string; isPrimary: boolean }[] = [];
  if (body.imageDataUri) {
    const uploaded = await uploadProductImage(body.imageDataUri);
    imageCreate = [{ url: uploaded.url, publicId: uploaded.publicId, isPrimary: true }];
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      stock,
      category,
      status,
      images: { create: imageCreate },
    },
    include: { images: true },
  });

  return NextResponse.json({ product }, { status: 201 });
}
