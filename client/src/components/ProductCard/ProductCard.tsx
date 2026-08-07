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
            className="object-contain p-8 group-hover:scale-105 transition duration-500"
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

        <div className="flex items-center gap-2 mt-3">

          <span className="text-yellow-400 text-sm">
            ⭐ {product.rating}
          </span>

          <span className="text-zinc-500 text-sm">
            ({product.reviews})
          </span>

        </div>

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

        <button
          onClick={() => addToCart(product)}
          className="mt-6 w-full rounded-xl bg-white text-black py-3 font-semibold hover:bg-zinc-200 transition"
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
}