"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ProductCard from "@/components/ProductCard/ProductCard";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products from backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Categories from backend products
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  // Filter + Search + Sort
  const filteredProducts = useMemo(() => {
    let items = [...products];

    // Category
    if (category !== "All") {
      items = items.filter(
        (item) => item.category === category
      );
    }

    // Search
    if (search.trim()) {
      const searchTerm = search.toLowerCase();

      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.brand.toLowerCase().includes(searchTerm)
      );
    }

    // Sort
    switch (sort) {
      case "featured":
        items.sort(
          (a, b) =>
            Number(b.isFeatured) - Number(a.isFeatured)
        );
        break;

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
  }, [products, search, category, sort]);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
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
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-3 outline-none focus:border-white"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
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

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-zinc-400">
            Loading products...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20 text-red-400">
            {error}
          </div>
        )}

        {/* Products */}
        {!loading && !error && (
          <>
            <p className="text-zinc-500 mb-8">
              {filteredProducts.length} Products Found
            </p>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-zinc-400 text-lg">
                  No products found.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                  className="mt-4 px-5 py-2 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </section>

      <Footer />
    </main>
  );
}