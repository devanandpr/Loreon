"use client";

import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const addToCart = useCartStore((state) => state.addToCart);

  const isOutOfStock = product.stock <= 0;

  return (
    <button
      onClick={() => addToCart(product)}
      disabled={isOutOfStock}
      className={`flex-1 py-4 rounded-xl font-semibold transition ${
        isOutOfStock
          ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
          : "bg-white text-black hover:bg-zinc-200"
      }`}
    >
      {isOutOfStock ? "Out Of Stock" : "Add To Cart"}
    </button>
  );
}