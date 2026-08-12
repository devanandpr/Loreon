"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import CartDrawer from "@/components/cartdrawer/CartDrawer";
import ProductCard from "@/components/ProductCard/ProductCard";

import { PRODUCTS } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCartStore();

  const product = PRODUCTS.find(
    (p) => p.id === String(params.id)
  );

  // Product not found
  if (!product) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />

        <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Product Not Found
          </h1>

          <p className="text-zinc-500 mb-8">
            The product you are looking for does not exist.
          </p>

          <Link
            href="/products"
            className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
          >
            Back To Products
          </Link>
        </section>

        <Footer />
      </main>
    );
  }

  const relatedProducts = PRODUCTS.filter(
    (item) =>
      item.category === product.category &&
      item.id !== product.id
  ).slice(0, 4);

  const isOutOfStock = product.stock <= 0;

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <div className="text-sm text-zinc-500 mb-8">

          <Link
            href="/"
            className="hover:text-white transition"
          >
            Home
          </Link>

          <span className="mx-2">/</span>

          <Link
            href="/products"
            className="hover:text-white transition"
          >
            Products
          </Link>

          <span className="mx-2">/</span>

          <span className="text-white">
            {product.name}
          </span>

        </div>

        {/* Product */}
        <div className="grid lg:grid-cols-2 gap-20">

          {/* ================= LEFT ================= */}
          <div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10">

              <Image
                src={product.image}
                alt={product.name}
                width={650}
                height={650}
                priority
                className={`mx-auto object-contain transition duration-500 ${
                  isOutOfStock
                    ? "opacity-50"
                    : "hover:scale-105"
                }`}
              />

            </div>

          </div>

          {/* ================= RIGHT ================= */}
          <div>

            {/* Badge */}
            {product.badge && (
              <span className="inline-block bg-white text-black px-4 py-1 rounded-full text-sm font-semibold mb-5">
                {product.badge}
              </span>
            )}

            {/* Brand */}
            <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm">
              {product.brand}
            </p>

            {/* Name */}
            <h1 className="text-5xl font-bold mt-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mt-6">

              <span className="text-yellow-400 text-xl">
                ⭐ {product.rating}
              </span>

              <span className="text-zinc-500">
                ({product.reviews} Reviews)
              </span>

            </div>

            {/* Price */}
            <div className="mt-8 flex items-center gap-4">

              <span className="text-5xl font-bold">
                ${product.price}
              </span>

              {product.originalPrice && (
                <span className="line-through text-zinc-500 text-xl">
                  ${product.originalPrice}
                </span>
              )}

            </div>

            {/* Description */}
            <p className="mt-8 text-zinc-400 leading-8">
              {product.description}
            </p>

            {/* Stock */}
            <div className="mt-8">

              {isOutOfStock ? (
                <span className="font-semibold text-red-500">
                  Out Of Stock
                </span>
              ) : product.stock > 10 ? (
                <span className="font-semibold text-green-500">
                  {product.stock} In Stock
                </span>
              ) : (
                <span className="font-semibold text-orange-400">
                  Only {product.stock} Left
                </span>
              )}

            </div>

            {/* Features */}
            {product.features.length > 0 && (
              <div className="mt-10">

                <h3 className="font-semibold text-xl mb-4">
                  Features
                </h3>

                <ul className="space-y-3">

                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-zinc-400 flex gap-3"
                    >
                      <span className="text-green-500">
                        ✔
                      </span>

                      {feature}
                    </li>
                  ))}

                </ul>

              </div>
            )}

            {/* Colors */}
            {product.colors &&
              product.colors.length > 0 && (
                <div className="mt-10">

                  <h3 className="font-semibold mb-3">
                    Colors
                  </h3>

                  <div className="flex flex-wrap gap-3">

                    {product.colors.map((color) => (
                      <button
                        key={color}
                        className="border border-zinc-700 rounded-full px-5 py-2 hover:border-white cursor-pointer transition"
                      >
                        {color}
                      </button>
                    ))}

                  </div>

                </div>
              )}

            {/* Sizes */}
            {product.sizes &&
              product.sizes.length > 0 && (
                <div className="mt-10">

                  <h3 className="font-semibold mb-3">
                    Sizes
                  </h3>

                  <div className="flex flex-wrap gap-3">

                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className="border border-zinc-700 rounded-xl px-5 py-2 hover:border-white transition"
                      >
                        {size}
                      </button>
                    ))}

                  </div>

                </div>
              )}

            {/* ================= BUTTONS ================= */}
            <div className="flex gap-4 mt-12">

              <button
                disabled={isOutOfStock}
                onClick={() => addToCart(product)}
                className={`flex-1 py-4 rounded-xl font-semibold transition ${
                  isOutOfStock
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                {isOutOfStock
                  ? "Out Of Stock"
                  : "Add To Cart"}
              </button>

              <button
                disabled={isOutOfStock}
                className={`flex-1 border rounded-xl transition ${
                  isOutOfStock
                    ? "border-zinc-800 text-zinc-600 cursor-not-allowed"
                    : "border-zinc-700 hover:border-white"
                }`}
              >
                Buy Now
              </button>

            </div>

          </div>

        </div>

        {/* ================= RELATED PRODUCTS ================= */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">

            <h2 className="text-3xl font-bold mb-8">
              Related Products
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

              {relatedProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                />
              ))}

            </div>

          </section>
        )}

      </section>

      {/* Cart Drawer */}
      <CartDrawer />

      <Footer />

    </main>
  );
}