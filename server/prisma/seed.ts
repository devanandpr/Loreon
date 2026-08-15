import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const products = [
  {
    id: "1",
    slug: "headphones",
    name: "Acoustic Noise-Canceling Headphones",
    brand: "Sony",
    category: "Audio",
    price: 299,
    originalPrice: 349,
    rating: 4.8,
    reviews: 425,
    image: "/images/products/headphones.png",
    description:
      "Premium wireless headphones featuring industry-leading active noise cancellation, immersive sound quality, and all-day battery life.",
    badge: "Best Seller",
    stock: 24,
    isFeatured: true,
  },

  {
    id: "2",
    slug: "sony-alpha-dslr-camera",
    name: "Sony Alpha DSLR Camera",
    brand: "Sony",
    category: "Cameras",
    price: 149,
    originalPrice: 179,
    rating: 4.6,
    reviews: 287,
    image: "/images/products/camera.png",
    description:
      "Capture stunning photos and videos with a lightweight DSLR featuring fast autofocus and exceptional image quality.",
    badge: "Popular",
    stock: 99,
    isFeatured: true,
  },

  {
    id: "3",
    slug: "apple-watch-series-10",
    name: "Apple Watch Series 10",
    brand: "Apple",
    category: "Wearables",
    price: 249,
    originalPrice: 299,
    rating: 4.8,
    reviews: 651,
    image: "/images/products/apple-watch-series-10.png",
    description:
      "Stay connected, active, and healthy with Apple's latest smartwatch featuring advanced health tracking and premium design.",
    badge: "New",
    stock: 99,
    isFeatured: true,
  },

  {
    id: "4",
    slug: "american-tourister-backpack",
    name: "American Tourister Backpack",
    brand: "American Tourister",
    category: "Accessories",
    price: 79,
    originalPrice: 99,
    rating: 4.7,
    reviews: 193,
    image: "/images/products/backpack.png",
    description:
      "A spacious and stylish backpack designed for work, travel, and everyday essentials with durable construction.",
    badge: "Trending",
    stock: 1500,
    isFeatured: true,
  },

  {
    id: "5",
    slug: "macbook-air-m4",
    name: "MacBook Air M4",
    brand: "Apple",
    category: "Laptops",
    price: 999,
    originalPrice: 1099,
    rating: 4.9,
    reviews: 842,
    image: "/images/products/macbook-air-m4.png",
    description:
      "Powerful and lightweight MacBook Air featuring Apple's M4 chip, stunning display, and all-day battery life.",
    badge: "Premium",
    stock: 99,
    isFeatured: true,
  },

  {
    id: "6",
    slug: "playstation-5-console",
    name: "PlayStation 5 Console",
    brand: "Sony",
    category: "Gaming",
    price: 499,
    originalPrice: 549,
    rating: 4.9,
    reviews: 1205,
    image: "/images/products/console.png",
    description:
      "Experience lightning-fast loading, immersive gaming, and stunning 4K graphics with the PlayStation 5 console.",
    badge: "Hot",
    stock: 259,
    isFeatured: true,
  },

  {
    id: "7",
    slug: "nike-running-shoes",
    name: "Nike Running Shoes",
    brand: "Nike",
    category: "Shoes",
    price: 119,
    originalPrice: 149,
    rating: 4.7,
    reviews: 374,
    image: "/images/products/shoes.png",
    description:
      "Comfortable performance running shoes engineered for everyday training with lightweight cushioning.",
    badge: "Trending",
    stock: 459,
    isFeatured: true,
  },

  {
    id: "8",
    slug: "iphone-16-pro",
    name: "iPhone 16 Pro",
    brand: "Apple",
    category: "Mobile",
    price: 699,
    originalPrice: 799,
    rating: 4.9,
    reviews: 1648,
    image: "/images/products/iphone-16-pro.png",
    description:
      "Apple's flagship smartphone featuring the latest A-series chip, advanced camera system, and premium titanium design.",
    badge: "Flagship",
    stock: 50,
    isFeatured: true,
  },
];

async function main() {
  console.log("🌱 Starting Loreon product seed...");

  for (const product of products) {
    await prisma.product.upsert({
      where: {
        id: product.id,
      },
      update: product,
      create: product,
    });

    console.log(`✅ ${product.name}`);
  }

  console.log("🎉 Loreon products seeded successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });