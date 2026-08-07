"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiShoppingBag,
  FiSearch,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useCartStore } from "@/store/useCartStore";

export default function Navbar() {
  const { cart, openCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalItems = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto h-16 px-5 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-[0.25em] text-white"
          >
            LOREON
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">

            <Link
              href="/"
              className="hover:text-white transition-colors"
            >
              Home
            </Link>

            <Link
              href="/products"
              className="hover:text-white transition-colors"
            >
              Products
            </Link>

            <Link
              href="/#categories"
              className="hover:text-white transition-colors"
            >
              Categories
            </Link>

            <Link
              href="/#why-us"
              className="hover:text-white transition-colors"
            >
              Why Us
            </Link>

          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">

            <button className="p-2 rounded-full hover:bg-zinc-900 transition">
              <FiSearch className="w-5 h-5" />
            </button>

            <button className="p-2 rounded-full hover:bg-zinc-900 transition">
              <FiUser className="w-5 h-5" />
            </button>

            <button
              onClick={openCart}
              className="relative p-2 rounded-full hover:bg-zinc-900 transition"
            >
              <FiShoppingBag className="w-5 h-5" />

              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full hover:bg-zinc-900 transition"
            >
              {mobileOpen ? (
                <FiX size={22} />
              ) : (
                <FiMenu size={22} />
              )}
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800">

          <nav className="flex flex-col py-6">

            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="px-6 py-3 hover:bg-zinc-900 transition"
            >
              Home
            </Link>

            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="px-6 py-3 hover:bg-zinc-900 transition"
            >
              Products
            </Link>

            <Link
              href="/#categories"
              onClick={() => setMobileOpen(false)}
              className="px-6 py-3 hover:bg-zinc-900 transition"
            >
              Categories
            </Link>

            <Link
              href="/#why-us"
              onClick={() => setMobileOpen(false)}
              className="px-6 py-3 hover:bg-zinc-900 transition"
            >
              Why Us
            </Link>

          </nav>

        </div>
      )}
    </>
  );
}