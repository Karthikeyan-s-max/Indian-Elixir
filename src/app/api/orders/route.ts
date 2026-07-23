import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { generateOrderNumber, buildWhatsAppLink } from "@/lib/utils";
import { getSiteSettings } from "@/lib/settings";

// POST /api/orders
// Captures the order form (no payment gateway yet - COD / WhatsApp confirmation).
// Stores full delivery + contact details and returns a wa.me link the
// storefront opens so the customer can message the store to confirm.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { customerName, phone, email, addressLine1, city, state, pincode, notes, items } = parsed.data;

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "One or more products are no longer available" }, { status: 400 });
  }

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!;
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `${product.name} only has ${product.stock} left in stock` },
        { status: 400 }
      );
    }
  }

  const totalAmount = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return sum + Number(product.price) * item.quantity;
  }, 0);

  const orderCount = await prisma.order.count();
  const orderNumber = generateOrderNumber(orderCount + 1);

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: session?.user?.id,
      customerName,
      phone,
      email,
      addressLine1,
      city,
      state,
      pincode,
      notes,
      totalAmount,
      items: {
        create: items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return {
            productId: product.id,
            productName: product.name,
            unitPrice: product.price,
            quantity: item.quantity,
          };
        }),
      },
    },
    include: { items: true },
  });

  if (session?.user?.id) {
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        type: "ORDER_PLACED",
        message: `Order ${orderNumber} placed`,
      },
    });
  }

  // Decrement stock
  await Promise.all(
    items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    )
  );

  // WhatsApp number is admin-editable via Site Settings, not hardcoded.
  const settings = await getSiteSettings();
  const storeNumber = settings.orderWhatsApp;

  const itemLines = order.items.map((i) => `- ${i.productName} x${i.quantity}`).join("\n");
  const message =
    `Hi Indian Elixir, I'd like to confirm my order ${order.orderNumber}.\n\n` +
    `${itemLines}\n\nTotal: Rs.${totalAmount}\n\n` +
    `Deliver to: ${addressLine1}, ${city}, ${state} - ${pincode}`;

  const whatsappUrl = buildWhatsAppLink(storeNumber, message);

  return NextResponse.json({ order, whatsappUrl }, { status: 201 });
}
