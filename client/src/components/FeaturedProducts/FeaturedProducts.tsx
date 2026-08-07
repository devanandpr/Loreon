import React from "react";
import { PRODUCTS } from "@/data/products";
import ProductCard from "../ProductCard/ProductCard";

export default function FeaturedProducts() {
  const featured = PRODUCTS.filter((p) => p.isFeatured);

  return (
    <section id="featured" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white">Featured Products</h2>
        <p className="text-zinc-400 text-sm">Handpicked top performers for your setup.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}