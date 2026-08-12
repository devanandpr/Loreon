"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCartStore();

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-zinc-700 transition duration-300">

      {/* Badge */}
      {product.badge && (
        <div className="absolute z-10 mt-4 ml-4">
          <span className="bg-white text-black text-xs font-semibold px-3 py-1 rounded-full">
            {product.badge}
          </span>
        </div>
      )}

      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square bg-zinc-950 overflow-hidden">

          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-contain p-8 group-hover:scale-105 transition duration-500 ${
              isOutOfStock ? "opacity-50" : ""
            }`}
          />

        </div>
      </Link>

      {/* Content */}
      <div className="p-5">

        <p className="text-xs uppercase tracking-widest text-zinc-500">
          {product.brand}
        </p>

        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold mt-2 hover:text-zinc-300 transition">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-3">

          <span className="text-yellow-400 text-sm">
            ⭐ {product.rating}
          </span>

          <span className="text-zinc-500 text-sm">
            ({product.reviews})
          </span>

        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mt-4">

          <span className="text-2xl font-bold">
            ${product.price}
          </span>

          {product.originalPrice && (
            <span className="line-through text-zinc-500">
              ${product.originalPrice}
            </span>
          )}

        </div>

        <div className="mt-3">
        {product.stock > 0 ? (
      <span
      className={`font-semibold ${
        product.stock > 10
          ? "text-green-500"
          : "text-orange-400"
      }`}
    >
      {product.stock > 10
        ? `${product.stock} In Stock`
        : `Only ${product.stock} Left`}
    </span>
  ) : (
    <span className="font-semibold text-red-500">
      Out Of Stock
    </span>
      )}
</div>

     <button
      onClick={() => addToCart(product)}
      disabled={product.stock === 0}
      className={`mt-6 w-full rounded-xl py-3 font-semibold transition ${
      product.stock === 0
      ? "bg-zinc-600 text-zinc-300 cursor-not-allowed"
      : "bg-white text-black hover:bg-zinc-200"
      }`}
    >
      {product.stock === 0 ? "Out Of Stock" : "Add to Cart"}
    </button>

      </div>
    </div>
  );
}