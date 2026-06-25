import { existsSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { slugify } from "../src/lib/utils";

const loadEnvFile = (
  process as NodeJS.Process & { loadEnvFile?: (path?: string) => void }
).loadEnvFile;

if (existsSync(".env.local")) {
  loadEnvFile?.(".env.local");
} else if (existsSync(".env")) {
  loadEnvFile?.(".env");
}

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/aangan_bazaar";
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const categories = [
  {
    name: "Homestyle Meals",
    description: "Comforting lunch and dinner plates cooked in small daily batches.",
    imageUrl:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Breakfast & Snacks",
    description: "Fresh breakfast boxes and tea-time snacks for everyday cravings.",
    imageUrl:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Pickles & Chutneys",
    description: "Tangy jars, chutney packs, and condiments that make simple meals sing.",
    imageUrl:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Sweets & Desserts",
    description: "Homemade laddoos, halwa bowls, and celebration sweets.",
    imageUrl:
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=80",
  },
];

const products = [
  {
    category: "Homestyle Meals",
    name: "Ghar-Style Veg Thali",
    shortDescription: "Dal, sabzi, rice, rotis, pickle, and sweet in one homestyle plate.",
    description:
      "A comforting homemade thali with dal, seasonal sabzi, rice, rotis, pickle, and a small sweet. Cooked in limited lunch batches for a balanced everyday meal.",
    price: 189,
    compareAtPrice: 229,
    stock: 45,
    sku: "AF-HM-THALI-01",
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Homestyle Meals",
    name: "Paneer Butter Masala Meal",
    shortDescription: "Creamy paneer curry with jeera rice and soft phulkas.",
    description:
      "Creamy paneer butter masala served with jeera rice and two phulkas. Rich, familiar, and portioned for one satisfying dinner.",
    price: 239,
    compareAtPrice: 279,
    stock: 32,
    sku: "AF-HM-PANEER-02",
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Breakfast & Snacks",
    name: "Aloo Paratha Breakfast Box",
    shortDescription: "Two stuffed parathas with curd, pickle, and butter.",
    description:
      "Two stuffed aloo parathas with curd, pickle, and a small butter portion. A hearty breakfast made fresh for morning orders.",
    price: 149,
    compareAtPrice: 179,
    stock: 38,
    sku: "AF-BS-PARATHA-01",
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Breakfast & Snacks",
    name: "Poha & Chai Snack Pack",
    shortDescription: "Kanda poha with peanuts, sev, lemon, and chai concentrate.",
    description:
      "Light kanda poha finished with peanuts, coriander, sev, and lemon, paired with masala chai concentrate for a quick evening snack.",
    price: 119,
    compareAtPrice: 149,
    stock: 50,
    sku: "AF-BS-POHA-02",
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Pickles & Chutneys",
    name: "Mango Pickle Jar",
    shortDescription: "Tangy 250g mango pickle jar with mustard oil and bold masala.",
    description:
      "A 250g jar of tangy mango pickle with mustard oil, chilli, fenugreek, and slow-matured masala. Made in small batches for bold meal-side flavor.",
    price: 199,
    compareAtPrice: 249,
    stock: 70,
    sku: "AF-PC-PICKLE-01",
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Pickles & Chutneys",
    name: "Coconut Chutney Trio",
    shortDescription: "Coconut, tomato-garlic, and coriander-peanut chutneys.",
    description:
      "Three fresh chutneys for idli, dosa, paratha, and snacks: coconut, tomato-garlic, and coriander-peanut. Packed chilled for same-day use.",
    price: 159,
    compareAtPrice: 199,
    stock: 44,
    sku: "AF-PC-CHUTNEY-02",
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Sweets & Desserts",
    name: "Motichoor Laddoo Box",
    shortDescription: "Twelve soft laddoos with ghee and cardamom.",
    description:
      "A box of twelve soft motichoor laddoos made with ghee, cardamom, and a light festive finish. Ideal for gifting or after-meal dessert.",
    price: 349,
    compareAtPrice: 429,
    stock: 30,
    sku: "AF-SD-LADDOO-01",
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Sweets & Desserts",
    name: "Gajar Halwa Bowl",
    shortDescription: "Slow-cooked carrot halwa with ghee, cardamom, and nuts.",
    description:
      "Slow-cooked carrot halwa with milk, ghee, cardamom, and nuts. A warm dessert bowl made for small-batch weekend orders.",
    price: 179,
    compareAtPrice: 229,
    stock: 28,
    sku: "AF-SD-HALWA-02",
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
  },
];

async function main() {
  const categoryRecords = new Map<string, string>();

  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: slugify(category.name) },
      update: {
        description: category.description,
        imageUrl: category.imageUrl,
        isActive: true,
      },
      create: {
        name: category.name,
        slug: slugify(category.name),
        description: category.description,
        imageUrl: category.imageUrl,
        isActive: true,
      },
    });
    categoryRecords.set(category.name, record.id);
  }

  for (const product of products) {
    const categoryId = categoryRecords.get(product.category);
    if (!categoryId) {
      continue;
    }

    await prisma.product.upsert({
      where: { slug: slugify(product.name) },
      update: {
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
        isFeatured: product.isFeatured,
        isActive: true,
      },
      create: {
        name: product.name,
        slug: slugify(product.name),
        shortDescription: product.shortDescription,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
        sku: product.sku,
        categoryId,
        isFeatured: product.isFeatured,
        images: {
          create: {
            url: product.image,
            cloudinaryPublicId: `seed/${slugify(product.name)}`,
            altText: product.name,
            sortOrder: 0,
          },
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
