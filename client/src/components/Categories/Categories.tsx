import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const categories = [
  {
    name: "Electronics",
    products: "120+ Products",
    image: "/images/categories/electronics.png",
  },
  {
    name: "Fashion",
    products: "250+ Products",
    image: "/images/categories/fashion.png",
  },
  {
    name: "Home & Living",
    products: "90+ Products",
    image: "/images/categories/home.png",
  },
  {
    name: "Beauty",
    products: "75+ Products",
    image: "/images/categories/beauty.png",
  },
  {
    name: "Sports",
    products: "60+ Products",
    image: "/images/categories/sports.png",
  },
  {
    name: "Accessories",
    products: "150+ Products",
    image: "/images/categories/accessories.png",
  },
];

export default function Categories() {
  return (
    <section
      id="categories"
      className="py-24 bg-black"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-end justify-between mb-14">

          <div>
            <span className="text-zinc-500 uppercase tracking-[0.3em] text-xs">
              Shop by Category
            </span>

            <h2 className="mt-3 text-4xl font-bold">
              Explore Collections
            </h2>

            <p className="mt-4 text-zinc-400 max-w-xl">
              Find everything you need, from everyday essentials to modern luxuries.
            </p>
          </div>

          <Link
            href="/products"
            className="hidden md:flex items-center gap-2 text-white hover:text-zinc-300"
          >
            View All
            <FiArrowRight />
          </Link>

        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

          {categories.map((category) => (

            <Link
              key={category.name}
              href="/products"
              className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900"
            >

              <div className="relative h-80">

                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8">

                  <h3 className="text-3xl font-bold text-white">
                    {category.name}
                  </h3>

                  <div className="mt-3 flex items-center justify-between">

                    <span className="text-zinc-300">
                      {category.products}
                    </span>

                    <div className="rounded-full bg-white p-3 text-black transition group-hover:translate-x-1">
                      <FiArrowRight />
                    </div>

                  </div>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>
    </section>
  );
}