export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";
import { productSchema } from "@/lib/validations";
import { uploadProductImage, deleteProductImage } from "@/lib/cloudinary";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const product = await prisma.product.findUnique({ where: { id: params.id }, include: { images: true } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const parsed = productSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: params.id }, include: { images: true } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

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
  } catch (err) {
    console.error("Admin product PATCH error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const product = await prisma.product.findUnique({ where: { id: params.id }, include: { images: true } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    for (const img of product.images) {
      if (img.publicId) await deleteProductImage(img.publicId).catch(() => {});
    }

    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Admin product DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
