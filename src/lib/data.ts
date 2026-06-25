import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/utils";

const productInclude = {
  category: true,
  images: { orderBy: { sortOrder: "asc" as const } },
};

type ProductWithMeta = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

export type ProductCard = ReturnType<typeof mapProduct>;

export function mapProduct(product: ProductWithMeta) {
  const firstImage = product.images.at(0);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    price: toNumber(product.price),
    compareAtPrice: product.compareAtPrice ? toNumber(product.compareAtPrice) : null,
    stock: product.stock,
    sku: product.sku,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      cloudinaryPublicId: image.cloudinaryPublicId,
      altText: image.altText,
      sortOrder: image.sortOrder,
    })),
    imageUrl: firstImage?.url ?? "/placeholder-product.svg",
    imageAlt: firstImage?.altText ?? product.name,
  };
}

const demoDate = new Date("2026-01-01T00:00:00.000Z");
const demoCategories = [
  {
    id: "demo-homestyle-meals",
    name: "Homestyle Meals",
    slug: "homestyle-meals",
    description: "Comforting lunch and dinner plates cooked in small daily batches.",
    imageUrl:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
    createdAt: demoDate,
    updatedAt: demoDate,
  },
  {
    id: "demo-breakfast-snacks",
    name: "Breakfast & Snacks",
    slug: "breakfast-snacks",
    description: "Fresh breakfast boxes and tea-time snacks for everyday cravings.",
    imageUrl:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
    createdAt: demoDate,
    updatedAt: demoDate,
  },
  {
    id: "demo-pickles-chutneys",
    name: "Pickles & Chutneys",
    slug: "pickles-chutneys",
    description: "Tangy jars, chutney packs, and condiments that make simple meals sing.",
    imageUrl:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
    createdAt: demoDate,
    updatedAt: demoDate,
  },
  {
    id: "demo-sweets-desserts",
    name: "Sweets & Desserts",
    slug: "sweets-desserts",
    description: "Homemade laddoos, halwa bowls, and celebration sweets.",
    imageUrl:
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
    createdAt: demoDate,
    updatedAt: demoDate,
  },
];

const demoProducts: ProductCard[] = [
  {
    id: "demo-thali",
    name: "Ghar-Style Veg Thali",
    slug: "ghar-style-veg-thali",
    description:
      "A comforting homemade thali with dal, seasonal sabzi, rice, rotis, pickle, and a small sweet. Cooked in limited lunch batches for a balanced everyday meal.",
    shortDescription: "Dal, sabzi, rice, rotis, pickle, and sweet in one homestyle plate.",
    price: 189,
    compareAtPrice: 229,
    stock: 45,
    sku: "AF-HM-THALI-01",
    isActive: true,
    isFeatured: true,
    category: { id: "demo-homestyle-meals", name: "Homestyle Meals", slug: "homestyle-meals" },
    images: [
      {
        id: "demo-thali-image",
        url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80",
        cloudinaryPublicId: "demo/ghar-style-veg-thali",
        altText: "Ghar-style veg thali",
        sortOrder: 0,
      },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Ghar-style veg thali",
  },
  {
    id: "demo-paneer-meal",
    name: "Paneer Butter Masala Meal",
    slug: "paneer-butter-masala-meal",
    description:
      "Creamy paneer butter masala served with jeera rice and two phulkas. Rich, familiar, and portioned for one satisfying dinner.",
    shortDescription: "Creamy paneer curry with jeera rice and soft phulkas.",
    price: 239,
    compareAtPrice: 279,
    stock: 32,
    sku: "AF-HM-PANEER-02",
    isActive: true,
    isFeatured: true,
    category: { id: "demo-homestyle-meals", name: "Homestyle Meals", slug: "homestyle-meals" },
    images: [
      {
        id: "demo-paneer-image",
        url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80",
        cloudinaryPublicId: "demo/paneer-butter-masala-meal",
        altText: "Paneer butter masala meal",
        sortOrder: 0,
      },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Paneer butter masala meal",
  },
  {
    id: "demo-paratha",
    name: "Aloo Paratha Breakfast Box",
    slug: "aloo-paratha-breakfast-box",
    description:
      "Two stuffed aloo parathas with curd, pickle, and a small butter portion. A hearty breakfast made fresh for morning orders.",
    shortDescription: "Two stuffed parathas with curd, pickle, and butter.",
    price: 149,
    compareAtPrice: 179,
    stock: 38,
    sku: "AF-BS-PARATHA-01",
    isActive: true,
    isFeatured: true,
    category: { id: "demo-breakfast-snacks", name: "Breakfast & Snacks", slug: "breakfast-snacks" },
    images: [
      {
        id: "demo-paratha-image",
        url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
        cloudinaryPublicId: "demo/aloo-paratha-breakfast-box",
        altText: "Aloo paratha breakfast box",
        sortOrder: 0,
      },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Aloo paratha breakfast box",
  },
  {
    id: "demo-poha",
    name: "Poha & Chai Snack Pack",
    slug: "poha-chai-snack-pack",
    description:
      "Light kanda poha finished with peanuts, coriander, sev, and lemon, paired with masala chai concentrate for a quick evening snack.",
    shortDescription: "Kanda poha with peanuts, sev, lemon, and chai concentrate.",
    price: 119,
    compareAtPrice: 149,
    stock: 50,
    sku: "AF-BS-POHA-02",
    isActive: true,
    isFeatured: true,
    category: { id: "demo-breakfast-snacks", name: "Breakfast & Snacks", slug: "breakfast-snacks" },
    images: [
      {
        id: "demo-poha-image",
        url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=1200&q=80",
        cloudinaryPublicId: "demo/poha-chai-snack-pack",
        altText: "Poha and chai snack pack",
        sortOrder: 0,
      },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Poha and chai snack pack",
  },
  {
    id: "demo-mango-pickle",
    name: "Mango Pickle Jar",
    slug: "mango-pickle-jar",
    description:
      "A 250g jar of tangy mango pickle with mustard oil, chilli, fenugreek, and slow-matured masala. Made in small batches for bold meal-side flavor.",
    shortDescription: "Tangy 250g mango pickle jar with mustard oil and bold masala.",
    price: 199,
    compareAtPrice: 249,
    stock: 70,
    sku: "AF-PC-PICKLE-01",
    isActive: true,
    isFeatured: true,
    category: { id: "demo-pickles-chutneys", name: "Pickles & Chutneys", slug: "pickles-chutneys" },
    images: [
      {
        id: "demo-pickle-image",
        url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80",
        cloudinaryPublicId: "demo/mango-pickle-jar",
        altText: "Mango pickle jar",
        sortOrder: 0,
      },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Mango pickle jar",
  },
  {
    id: "demo-chutney-trio",
    name: "Coconut Chutney Trio",
    slug: "coconut-chutney-trio",
    description:
      "Three fresh chutneys for idli, dosa, paratha, and snacks: coconut, tomato-garlic, and coriander-peanut. Packed chilled for same-day use.",
    shortDescription: "Coconut, tomato-garlic, and coriander-peanut chutneys.",
    price: 159,
    compareAtPrice: 199,
    stock: 44,
    sku: "AF-PC-CHUTNEY-02",
    isActive: true,
    isFeatured: false,
    category: { id: "demo-pickles-chutneys", name: "Pickles & Chutneys", slug: "pickles-chutneys" },
    images: [
      {
        id: "demo-chutney-image",
        url: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80",
        cloudinaryPublicId: "demo/coconut-chutney-trio",
        altText: "Coconut chutney trio",
        sortOrder: 0,
      },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Coconut chutney trio",
  },
  {
    id: "demo-laddoo",
    name: "Motichoor Laddoo Box",
    slug: "motichoor-laddoo-box",
    description:
      "A box of twelve soft motichoor laddoos made with ghee, cardamom, and a light festive finish. Ideal for gifting or after-meal dessert.",
    shortDescription: "Twelve soft laddoos with ghee and cardamom.",
    price: 349,
    compareAtPrice: 429,
    stock: 30,
    sku: "AF-SD-LADDOO-01",
    isActive: true,
    isFeatured: true,
    category: { id: "demo-sweets-desserts", name: "Sweets & Desserts", slug: "sweets-desserts" },
    images: [
      {
        id: "demo-laddoo-image",
        url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=80",
        cloudinaryPublicId: "demo/motichoor-laddoo-box",
        altText: "Motichoor laddoo box",
        sortOrder: 0,
      },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Motichoor laddoo box",
  },
  {
    id: "demo-halwa",
    name: "Gajar Halwa Bowl",
    slug: "gajar-halwa-bowl",
    description:
      "Slow-cooked carrot halwa with milk, ghee, cardamom, and nuts. A warm dessert bowl made for small-batch weekend orders.",
    shortDescription: "Slow-cooked carrot halwa with ghee, cardamom, and nuts.",
    price: 179,
    compareAtPrice: 229,
    stock: 28,
    sku: "AF-SD-HALWA-02",
    isActive: true,
    isFeatured: false,
    category: { id: "demo-sweets-desserts", name: "Sweets & Desserts", slug: "sweets-desserts" },
    images: [
      {
        id: "demo-halwa-image",
        url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
        cloudinaryPublicId: "demo/gajar-halwa-bowl",
        altText: "Gajar halwa bowl",
        sortOrder: 0,
      },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Gajar halwa bowl",
  },
];

function shouldUseDemoCatalog() {
  return !process.env.DATABASE_URL;
}

export async function getActiveCategories() {
  if (shouldUseDemoCatalog()) {
    return demoCategories;
  }

  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export async function getFeaturedCategories(limit = 4) {
  if (shouldUseDemoCatalog()) {
    return demoCategories.slice(0, limit).map((category) => ({
      ...category,
      _count: {
        products: demoProducts.filter((product) => product.category.id === category.id).length,
      },
    }));
  }

  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    take: limit,
    include: {
      _count: {
        select: {
          products: {
            where: { isActive: true },
          },
        },
      },
    },
  });
}

export async function getFeaturedProducts(limit = 8) {
  if (shouldUseDemoCatalog()) {
    return demoProducts.filter((product) => product.isFeatured).slice(0, limit);
  }

  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: productInclude,
    orderBy: [{ stock: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

  return products.map(mapProduct);
}

export async function getProducts({
  page = 1,
  q,
  categorySlug,
  sort = "newest",
}: {
  page?: number;
  q?: string;
  categorySlug?: string;
  sort?: string;
}) {
  const pageSize = 12;

  if (shouldUseDemoCatalog()) {
    let products = [...demoProducts];

    if (categorySlug) {
      products = products.filter((product) => product.category.slug === categorySlug);
    }

    if (q) {
      const query = q.toLowerCase();
      products = products.filter((product) =>
        [product.name, product.shortDescription, product.description].some((value) =>
          value.toLowerCase().includes(query),
        ),
      );
    }

    if (sort === "price-asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      products.sort((a, b) => b.price - a.price);
    }

    return {
      products: products.slice((page - 1) * pageSize, page * pageSize),
      total: products.length,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(products.length / pageSize)),
    };
  }

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    category: categorySlug
      ? {
          slug: categorySlug,
          isActive: true,
        }
      : { isActive: true },
  };

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput[] =
    sort === "price-asc"
      ? [{ price: "asc" }]
      : sort === "price-desc"
        ? [{ price: "desc" }]
        : [{ createdAt: "desc" }];

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map(mapProduct),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getProductBySlug(slug: string) {
  if (shouldUseDemoCatalog()) {
    return demoProducts.find((product) => product.slug === slug) ?? null;
  }

  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: productInclude,
  });

  return product ? mapProduct(product) : null;
}

export async function getRelatedProducts(productId: string, categoryId: string) {
  if (shouldUseDemoCatalog()) {
    return demoProducts
      .filter((product) => product.id !== productId && product.category.id === categoryId)
      .slice(0, 4);
  }

  const products = await prisma.product.findMany({
    where: {
      id: { not: productId },
      categoryId,
      isActive: true,
    },
    include: productInclude,
    take: 4,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return products.map(mapProduct);
}

export async function getCategoryBySlug(slug: string) {
  if (shouldUseDemoCatalog()) {
    return demoCategories.find((category) => category.slug === slug) ?? null;
  }

  return prisma.category.findFirst({
    where: { slug, isActive: true },
  });
}
