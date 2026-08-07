"use client";

import { useMemo, useState } from "react";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ProductCard from "@/components/ProductCard/ProductCard";
import { PRODUCTS } from "@/data/products";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  const categories = [
    "All",
    ...new Set(PRODUCTS.map((p) => p.category)),
  ];

  const filteredProducts = useMemo(() => {
    let items = [...PRODUCTS];

    if (category !== "All") {
      items = items.filter(
        (item) => item.category === category
      );
    }

    if (search) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.brand.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (sort) {
      case "price-low":
        items.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        items.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        items.sort((a, b) => b.rating - a.rating);
        break;
    }

    return items;
  }, [search, category, sort]);

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="text-center mb-14">

          <p className="uppercase tracking-[0.35em] text-zinc-500">
            Shop
          </p>

          <h1 className="text-5xl font-bold mt-4">
            Explore Our Collection
          </h1>

          <p className="text-zinc-400 mt-5 max-w-2xl mx-auto">
            From everyday essentials – modern luxuries.
          </p>

        </div>

        {/* Search + Sort */}

        <div className="flex flex-col md:flex-row gap-4 mb-10">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-3 outline-none focus:border-white"
          />

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            className="rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-3"
          >
            <option value="featured">Featured</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">
              Price: Low to High
            </option>
            <option value="price-high">
              Price: High to Low
            </option>
          </select>

        </div>

        {/* Categories */}

        <div className="flex flex-wrap gap-3 mb-12">

          {categories.map((cat) => (

            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full border transition ${
                category === cat
                  ? "bg-white text-black border-white"
                  : "border-zinc-700 hover:border-white"
              }`}
            >
              {cat}
            </button>

          ))}

        </div>

        {/* Count */}

        <p className="text-zinc-500 mb-8">
          {filteredProducts.length} Products Found
        </p>

        {/* Products */}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {filteredProducts.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
            />

          ))}

        </div>

      </section>

      <Footer />

    </main>
  );
}