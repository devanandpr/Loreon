import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { PRODUCTS } from "@/data/products";
interface PageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: PageProps) {
  const product = PRODUCTS.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = PRODUCTS.filter(
    (item) =>
      item.category === product.category &&
      item.id !== product.id
  ).slice(0, 4);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-12">

        {/* Breadcrumb */}

        <div className="text-sm text-zinc-500 mb-8">
          <Link href="/" className="hover:text-white">
            Home
          </Link>

          <span className="mx-2">/</span>

          <Link href="/products" className="hover:text-white">
            Products
          </Link>

          <span className="mx-2">/</span>

          <span className="text-white">{product.name}</span>
        </div>

        {/* Product */}

        <div className="grid lg:grid-cols-2 gap-20">

          {/* Left */}

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

          {/* Right */}

          <div>

            {product.badge && (

              <span className="inline-block bg-white text-black px-4 py-1 rounded-full text-sm font-semibold mb-5">
                {product.badge}
              </span>

            )}

            <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm">
              {product.brand}
            </p>

            <h1 className="text-5xl font-bold mt-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mt-6">

              <span className="text-yellow-400 text-xl">
                ⭐ {product.rating}
              </span>

              <span className="text-zinc-500">
                ({product.reviews} Reviews)
              </span>

            </div>

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

            <p className="mt-8 text-zinc-400 leading-8">
              {product.description}
            </p>

            {/* Stock */}

            <div className="mt-8">

              <span
                className={`font-semibold ${
                  product.stock > 10
                    ? "text-green-500"
                    : "text-orange-400"
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

              <ul className="space-y-3">

                {product.features.map((feature) => (

                  <li
                    key={feature}
                    className="text-zinc-400 flex gap-3"
                  >
                    ✔ {feature}
                  </li>

                ))}

              </ul>

            </div>

            {/* Colors */}

            {product.colors && (

              <div className="mt-10">

                <h3 className="font-semibold mb-3">
                  Colors
                </h3>

                <div className="flex gap-3">

                  {product.colors.map((color) => (

                    <div
                      key={color}
                      className="border border-zinc-700 rounded-full px-5 py-2 hover:border-white cursor-pointer transition"
                    >
                      {color}
                    </div>

                  ))}

                </div>

              </div>

            )}

            {/* Sizes */}

            {product.sizes && (

              <div className="mt-10">

                <h3 className="font-semibold mb-3">
                  Sizes
                </h3>

                <div className="flex gap-3">

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

            {/* Buttons */}

            <div className="flex gap-4 mt-12">

              <button className="flex-1 bg-white text-black py-4 rounded-xl font-semibold hover:bg-zinc-200 transition">
                Add To Cart
              </button>

              <button className="flex-1 border border-zinc-700 rounded-xl hover:border-white transition">
                Buy Now
              </button>

            </div>

          </div>

        </div>

        {/* Related */}

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

      <Footer />
    </main>
  );
}