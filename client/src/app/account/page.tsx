"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiPackage, FiLogOut, FiArrowRight } from "react-icons/fi";
import { useAuthStore } from "@/store/useAuthStore";

export default function AccountPage() {
  const router = useRouter();

  const { user, token, logout } = useAuthStore();

  // If user is not logged in
  if (!token || !user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">

          <div className="mx-auto w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
            <FiUser className="w-7 h-7 text-zinc-400" />
          </div>

          <h1 className="text-3xl font-bold">
            Login Required
          </h1>

          <p className="text-zinc-400 mt-3">
            Please login to view your account.
          </p>

          <Link
            href="/login"
            className="inline-block mt-6 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
          >
            Login
          </Link>

        </div>
      </main>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            LOREON
          </Link>

          <Link
            href="/products"
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            Continue Shopping
          </Link>

        </div>
      </header>

      {/* Main */}
      <section className="max-w-5xl mx-auto px-6 py-16">

        {/* Heading */}
        <div className="mb-10">

          <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm">
            Account
          </p>

          <h1 className="text-4xl font-bold mt-3">
            Welcome, {user.name}
          </h1>

          <p className="text-zinc-400 mt-3">
            Manage your Loreon account and orders.
          </p>

        </div>

        {/* Profile Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

          <div className="flex items-center gap-5">

            <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center">
              <FiUser className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {user.name}
              </h2>

              <p className="text-zinc-400 mt-1">
                {user.email}
              </p>
            </div>

          </div>

          {/* Account Details */}
          <div className="grid sm:grid-cols-2 gap-4 mt-8">

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">

              <div className="flex items-center gap-3">

                <FiMail className="text-zinc-500" />

                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Email
                  </p>

                  <p className="text-sm font-medium mt-1">
                    {user.email}
                  </p>
                </div>

              </div>

            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">

              <div className="flex items-center gap-3">

                <FiUser className="text-zinc-500" />

                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">
                    Account Type
                  </p>

                  <p className="text-sm font-medium mt-1 capitalize">
                    {user.role}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Account Actions */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">

          {/* Orders */}
          <Link
            href="/orders"
            className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition"
          >

            <div className="flex items-center justify-between">

              <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                <FiPackage className="w-5 h-5 text-zinc-300" />
              </div>

              <FiArrowRight className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition" />

            </div>

            <h2 className="text-xl font-bold mt-6">
              My Orders
            </h2>

            <p className="text-zinc-400 text-sm mt-2">
              View your previous orders and track their status.
            </p>

          </Link>

          {/* Shopping */}
          <Link
            href="/products"
            className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition"
          >

            <div className="flex items-center justify-between">

              <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                <FiPackage className="w-5 h-5 text-zinc-300" />
              </div>

              <FiArrowRight className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition" />

            </div>

            <h2 className="text-xl font-bold mt-6">
              Continue Shopping
            </h2>

            <p className="text-zinc-400 text-sm mt-2">
              Explore our latest products and collections.
            </p>

          </Link>

        </div>

        {/* Logout */}
        <div className="mt-8">

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-zinc-900 border border-zinc-800 text-red-400 py-4 rounded-xl font-semibold hover:bg-red-500/10 hover:border-red-500/30 transition"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>

        </div>

      </section>

    </main>
  );
}