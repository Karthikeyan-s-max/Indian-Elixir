export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: "desc" },
    });

    const total = reviews.length;
    const avgRating =
      total > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1))
        : 5.0;

    return NextResponse.json({ reviews, total, avgRating });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json();
    const { userName, userEmail, rating, comment } = body;

    if (!userName || !comment) {
      return NextResponse.json(
        { error: "Name and review comment are required." },
        { status: 400 }
      );
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5 stars." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        productId: product.id,
        userName: userName.trim(),
        userEmail: userEmail ? userEmail.trim() : null,
        rating: Math.round(numRating),
        comment: comment.trim(),
      },
    });

    return NextResponse.json(
      { message: "Thank you! Your review has been submitted.", review },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
