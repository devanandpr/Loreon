"use client";

import { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types/product";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const featured = products.filter((product) => product.isFeatured);

  return (
    <section
      id="featured"
      className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white">
          Featured Products
        </h2>

        <p className="text-zinc-400 text-sm">
          Handpicked top performers for your setup.
        </p>
      </div>

      {loading && (
        <div className="text-zinc-400 text-center py-10">
          Loading products...
        </div>
      )}

      {error && (
        <div className="text-red-400 text-center py-10">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}