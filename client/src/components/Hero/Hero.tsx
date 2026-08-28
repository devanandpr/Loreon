import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-[-180px] left-1/2 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div>
            <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs uppercase tracking-[0.25em] text-zinc-300">
              Premium Shopping Experience
            </span>

            <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              From
              <br />
              <span className="text-white">
                Everyday Essentials
              </span>
              <br />
              <span className="text-zinc-400">
                — Modern Luxuries
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">
              Discover carefully curated collections across fashion,
              electronics, beauty, home, lifestyle, accessories and more —
              bringing quality, style and convenience together in one place.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="#featured"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-black transition hover:bg-zinc-200"
              >
                Shop Now
                <FiArrowRight />
              </Link>

              <Link
                href="#categories"
                className="rounded-xl border border-zinc-700 px-7 py-4 font-semibold text-white transition hover:border-white hover:bg-zinc-900"
              >
                Browse Categories
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8">
              <div>
                <h2 className="text-3xl font-bold">10K+</h2>
                <p className="mt-2 text-sm text-zinc-500">
                  Products
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">100+</h2>
                <p className="mt-2 text-sm text-zinc-500">
                  Trusted Brands
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">50K+</h2>
                <p className="mt-2 text-sm text-zinc-500">
                  Happy Customers
                </p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative flex justify-center">
            <div className="absolute h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl" />

            <Image
              src="/images/hero/hero.png"
              alt="Loreon Hero"
              unoptimized
              width={700}
              height={700}
              priority
              className="relative z-10 w-full max-w-xl object-contain drop-shadow-[0_30px_60px_rgba(255,255,255,0.15)]"
            />
          </div>

        </div>
      </div>
    </section>
  );
}