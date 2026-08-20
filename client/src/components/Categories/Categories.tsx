"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { useEffect, useState } from "react";

import { getProducts } from "@/lib/api";
import type { Product } from "@/types/product";

const categoryImages: Record<string, string> = {
  Electronics: "/images/categories/electronics.png",
  Fashion: "/images/categories/fashion.png",
  "Home & Living": "/images/categories/home.png",
  Beauty: "/images/categories/beauty.png",
  Sports: "/images/categories/sports.png",
  Accessories: "/images/categories/accessories.png",
};

export default function Categories() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }

    fetchProducts();
  }, []);

  const categoryCounts = products.reduce(
    (counts: Record<string, number>, product) => {
      counts[product.category] =
        (counts[product.category] || 0) + 1;

      return counts;
    },
    {}
  );

  const categories = Object.keys(categoryCounts).map(
    (name) => ({
      name,
      count: categoryCounts[name],
      image:
        categoryImages[name] ||
        "/images/categories/accessories.png",
    })
  );

  return (
    <section
      id="categories"
      className="py-24 bg-black"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-end justify-between mb-14">

          <div>
            <span className="text-zinc-500 uppercase tracking-[0.3em] text-xs">
              Shop by Category
            </span>

            <h2 className="mt-3 text-4xl font-bold">
              Explore Collections
            </h2>

            <p className="mt-4 text-zinc-400 max-w-xl">
              Find everything you need, from everyday
              essentials to modern luxuries.
            </p>
          </div>

          <Link
            href="/products"
            className="hidden md:flex items-center gap-2 text-white hover:text-zinc-300"
          >
            View All
            <FiArrowRight />
          </Link>

        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

          {categories.map((category) => (

            <Link
              key={category.name}
              href={`/products?category=${encodeURIComponent(
                category.name
              )}`}
              className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900"
            >

              <div className="relative h-80">

                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8">

                  <h3 className="text-3xl font-bold text-white">
                    {category.name}
                  </h3>

                  <div className="mt-3 flex items-center justify-between">

                    <span className="text-zinc-300">
                      {category.count}{" "}
                      {category.count === 1
                        ? "Product"
                        : "Products"}
                    </span>

                    <div className="rounded-full bg-white p-3 text-black transition group-hover:translate-x-1">
                      <FiArrowRight />
                    </div>

                  </div>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>
    </section>
  );
}