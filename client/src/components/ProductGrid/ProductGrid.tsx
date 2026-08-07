"use client";

import { useMemo, useState } from "react";
import { PRODUCTS } from "@/data/products";
import ProductCard from "../ProductCard/ProductCard";

export default function ProductGrid() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(PRODUCTS.map((item) => item.category)),
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">

      {/* Search */}

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 outline-none focus:border-white"
        />
      </div>

      {/* Categories */}

      <div className="flex flex-wrap gap-3 mb-10">

        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`rounded-full px-5 py-2 transition ${
              category === item
                ? "bg-white text-black"
                : "bg-zinc-900 border border-zinc-800 hover:border-white"
            }`}
          >
            {item}
          </button>
        ))}

      </div>

      {/* Grid */}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-zinc-500">
          No products found.
        </div>
      )}

    </section>
  );
}