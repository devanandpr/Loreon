"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

interface Product {
  id: string;
  name: string;
  image: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function OrdersPage() {
  const { token, user } = useAuthStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  // --------------------------------------------------
  // Wait for Zustand persist to hydrate
  // --------------------------------------------------

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // --------------------------------------------------
  // Fetch customer orders
  // --------------------------------------------------

  useEffect(() => {
    if (!isHydrated) return;

    if (!token) {
      setLoading(false);
      setError("Please login to view your orders.");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/orders/my-orders`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch orders"
          );
        }

        setOrders(data.orders || []);
      } catch (err) {
        console.error("Orders fetch error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, isHydrated]);

  // --------------------------------------------------
  // Loading / Hydration
  // --------------------------------------------------

  if (!isHydrated || loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>

          <h1 className="text-2xl font-bold">
            Loading Orders
          </h1>

          <p className="text-zinc-500 mt-2">
            Please wait...
          </p>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Not logged in
  // --------------------------------------------------

  if (!token || !user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold">
            Login Required
          </h1>

          <p className="text-zinc-400 mt-4">
            Please login to view your orders.
          </p>

          <Link
            href="/login"
            className="inline-block mt-8 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold">
            Unable to Load Orders
          </h1>

          <p className="text-zinc-400 mt-4">
            {error}
          </p>

          <Link
            href="/products"
            className="inline-block mt-8 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Orders Page
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Header */}

      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

          <Link
            href="/"
            className="text-2xl font-bold"
          >
            LOREON
          </Link>

          <div className="text-sm text-zinc-400">
            {user.name}
          </div>

        </div>
      </header>

      {/* Main Content */}

      <section className="max-w-5xl mx-auto px-6 py-12">

        {/* Page Heading */}

        <div className="mb-10">

          <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm">
            Account
          </p>

          <h1 className="text-4xl font-bold mt-3">
            My Orders
          </h1>

          <p className="text-zinc-400 mt-3">
            View your previous Loreon orders.
          </p>

        </div>

        {/* No Orders */}

        {orders.length === 0 ? (

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">

            <div className="text-5xl mb-5">
              📦
            </div>

            <h2 className="text-2xl font-bold">
              No Orders Yet
            </h2>

            <p className="text-zinc-500 mt-3">
              You haven&apos;t placed any orders yet.
            </p>

            <Link
              href="/products"
              className="inline-block mt-8 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
            >
              Start Shopping
            </Link>

          </div>

        ) : (

          /* Orders List */

          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
              >

                {/* Order Header */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>

                    <p className="text-sm text-zinc-500">
                      Order ID
                    </p>

                    <p className="font-mono text-sm mt-1 break-all">
                      {order.id}
                    </p>

                  </div>

                  <div className="text-left md:text-right">

                    <p className="text-sm text-zinc-500">
                      Date
                    </p>

                    <p className="mt-1">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                  </div>

                </div>

                {/* Products */}

                <div className="border-t border-zinc-800 mt-6 pt-6">

                  <div className="space-y-4">

                    {order.items.map((item) => (

                      <div
                        key={item.id}
                        className="flex items-center gap-4"
                      >

                        {/* Product Image */}

                        <div className="w-16 h-16 bg-zinc-950 rounded-xl overflow-hidden flex-shrink-0">

                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain p-2"
                          />

                        </div>

                        {/* Product Information */}

                        <div className="flex-1">

                          <p className="font-semibold">
                            {item.product.name}
                          </p>

                          <p className="text-sm text-zinc-500 mt-1">
                            Qty: {item.quantity}
                          </p>

                        </div>

                        {/* Item Price */}

                        <p className="font-semibold">
                          ₹
                          {(
                            Number(item.price) *
                            item.quantity
                          ).toFixed(2)}
                        </p>

                      </div>

                    ))}

                  </div>

                </div>

                {/* Bottom Section */}

                <div className="border-t border-zinc-800 mt-6 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                  {/* Status */}

                  <div className="flex flex-wrap gap-3">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === "DELIVERED"
                          ? "bg-green-500/10 text-green-400"
                          : order.status === "CANCELLED"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {order.status}
                    </span>

                    <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-sm">
                      {order.paymentStatus}
                    </span>

                  </div>

                  {/* Total + View */}

                  <div className="flex items-center gap-6">

                    <div>

                      <p className="text-sm text-zinc-500">
                        Total
                      </p>

                      <p className="text-xl font-bold">
                        ₹{Number(order.total).toFixed(2)}
                      </p>

                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="bg-white text-black px-5 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
                    >
                      View Order
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}