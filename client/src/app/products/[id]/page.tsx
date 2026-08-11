"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import CartDrawer from "@/components/cartdrawer/CartDrawer";
import { getProduct, getProducts } from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/types/product";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);

        const { id } = await params;

        // Get the selected product
        const productData = await getProduct(id);

        if (!productData?.product) {
          throw new Error("Product not found");
        }

        const selectedProduct: Product = productData.product;

        setProduct(selectedProduct);

        // Get all products for related products
        const productsData = await getProducts();

        const related = productsData.products
          .filter(
            (item: Product) =>
              item.category === selectedProduct.category &&
              item.id !== selectedProduct.id
          )
          .slice(0, 4);

        setRelatedProducts(related);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setError("Product could not be found.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      return;
    }

    addToCart(product);
  };

  /* Loading */

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />

        <div className="min-h-[70vh] flex items-center justify-center">
          <p className="text-zinc-400">
            Loading product...
          </p>
        </div>

        <Footer />
      </main>
    );
  }

  /* Error / Product not found */

  if (error || !product) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />

        <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-bold">
            Product Not Found
          </h1>

          <p className="text-zinc-500 mt-3">
            {error || "This product does not exist."}
          </p>

          <Link
            href="/products"
            className="mt-6 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
          >
            Back to Products
          </Link>
        </div>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-12">

        {/* Breadcrumb */}

        <div className="text-sm text-zinc-500 mb-8">
          <Link
            href="/"
            className="hover:text-white"
          >
            Home
          </Link>

          <span className="mx-2">/</span>

          <Link
            href="/products"
            className="hover:text-white"
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

          {/* Left - Image */}

          <div>
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10">

              <Image
                src={product.image}
                alt={product.name}
                width={650}
                height={650}
                className="mx-auto object-contain hover:scale-105 transition duration-500"
              />

            </div>
          </div>

          {/* Right - Details */}

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

            {/* Product Name */}

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

              <span
                className={`font-semibold ${
                  product.stock > 10
                    ? "text-green-500"
                    : product.stock > 0
                    ? "text-orange-400"
                    : "text-red-500"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} In Stock`
                  : "Out Of Stock"}
              </span>

            </div>

            {/* Features */}

            <div className="mt-10">

              <h3 className="font-semibold text-xl mb-4">
                Features
              </h3>

              {product.features.length > 0 ? (
                <ul className="space-y-3">

                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-zinc-400 flex gap-3"
                    >
                      <span>✔</span>
                      <span>{feature}</span>
                    </li>
                  ))}

                </ul>
              ) : (
                <p className="text-zinc-500">
                  No features listed.
                </p>
              )}

            </div>

            {/* Colors */}

            {product.colors &&
              product.colors.length > 0 && (
                <div className="mt-10">

                  <h3 className="font-semibold mb-3">
                    Colors
                  </h3>

                  <div className="flex gap-3 flex-wrap">

                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className="border border-zinc-700 rounded-full px-5 py-2 hover:border-white transition"
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

                  <div className="flex gap-3 flex-wrap">

                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className="border border-zinc-700 rounded-xl px-5 py-2 hover:border-white transition"
                      >
                        {size}
                      </button>
                    ))}

                  </div>

                </div>
              )}

            {/* Buttons */}

            <div className="flex gap-4 mt-12">

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-white text-black py-4 rounded-xl font-semibold hover:bg-zinc-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {product.stock > 0
                  ? "Add To Cart"
                  : "Out Of Stock"}
              </button>

              <button
                type="button"
                disabled={product.stock <= 0}
                className="flex-1 border border-zinc-700 rounded-xl hover:border-white transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>

            </div>

          </div>

        </div>

        {/* Related Products */}

        {relatedProducts.length > 0 && (
          <section className="mt-24">

            <h2 className="text-3xl font-bold mb-8">
              Related Products
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

              {relatedProducts.map((item) => (
                <Link
                  href={`/products/${item.id}`}
                  key={item.id}
                  className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 hover:border-zinc-600 transition"
                >

                  <Image
                    src={item.image}
                    alt={item.name}
                    width={220}
                    height={220}
                    className="mx-auto h-48 object-contain"
                  />

                  <h3 className="mt-4 font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-zinc-500 mt-1">
                    ${item.price}
                  </p>

                </Link>
              ))}

            </div>

          </section>
        )}

           </section>

      <CartDrawer />

      <Footer />
    </main>
  );
}