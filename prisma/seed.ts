import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@indianelixir.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Store Admin",
      email: adminEmail,
      phone: "9999999999",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`Admin user ready: ${adminEmail} / ${adminPassword}`);

  const products = [
    {
      name: "Cold-Pressed Coconut Oil",
      slug: "cold-pressed-coconut-oil",
      description:
        "Traditionally chekku-extracted coconut oil, cold-pressed to retain natural aroma and nutrients. No refining, no additives.",
      price: 399,
      stock: 40,
      category: "oils",
    },
    {
      name: "Wood-Pressed Groundnut Oil",
      slug: "wood-pressed-groundnut-oil",
      description:
        "Rich, nutty groundnut oil pressed slowly in a wooden ghani to preserve flavor and nutrition.",
      price: 349,
      stock: 35,
      category: "oils",
    },
    {
      name: "Amla Herbal Wellness Powder",
      slug: "amla-herbal-wellness-powder",
      description:
        "Sun-dried Indian gooseberry (amla), stone-ground into a fine powder — a daily immunity ritual.",
      price: 249,
      stock: 60,
      category: "herbal",
    },
    {
      name: "Moringa Leaf Powder",
      slug: "moringa-leaf-powder",
      description:
        "Nutrient-dense moringa leaves, shade-dried and milled to preserve their natural green vitality.",
      price: 279,
      stock: 50,
      category: "herbal",
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, status: "ACTIVE" },
    });
  }
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
