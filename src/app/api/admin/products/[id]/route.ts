import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";
import { productSchema } from "@/lib/validations";
import { uploadProductImage, deleteProductImage } from "@/lib/cloudinary";

// PATCH: update product fields (name, description, price, stock, status)
// and optionally replace the primary image.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: params.id }, include: { images: true } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  // Replace primary image if a new one was uploaded from the admin form.
  if (body.imageDataUri) {
    const uploaded = await uploadProductImage(body.imageDataUri);
    const oldPrimary = product.images.find((i) => i.isPrimary);
    if (oldPrimary?.publicId) {
      await deleteProductImage(oldPrimary.publicId).catch(() => {});
    }
    if (oldPrimary) {
      await prisma.productImage.update({
        where: { id: oldPrimary.id },
        data: { url: uploaded.url, publicId: uploaded.publicId },
      });
    } else {
      await prisma.productImage.create({
        data: { productId: product.id, url: uploaded.url, publicId: uploaded.publicId, isPrimary: true },
      });
    }
  }

  const updated = await prisma.product.update({
    where: { id: params.id },
    data: parsed.data,
    include: { images: true },
  });

  return NextResponse.json({ product: updated });
}

// DELETE: remove a product entirely (images cascade via schema relation)
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const product = await prisma.product.findUnique({ where: { id: params.id }, include: { images: true } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  for (const img of product.images) {
    if (img.publicId) await deleteProductImage(img.publicId).catch(() => {});
  }

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Product deleted" });
}
