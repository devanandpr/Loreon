"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

interface Order {
  id: string;
  customerName: string;
  email: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export default function AdminDashboard() {
  const { token, user } = useAuthStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || user?.role !== "ADMIN") {
      setLoading(false);
      return;
    }

    async function fetchDashboard() {
      try {
        const [ordersResponse, productsResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/orders", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            fetch("http://localhost:5000/api/products", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        const ordersData = await ordersResponse.json();
        const productsData = await productsResponse.json();

        if (!ordersResponse.ok) {
          throw new Error(
            ordersData.message || "Failed to fetch orders"
          );
        }

        if (!productsResponse.ok) {
          throw new Error(
            productsData.message || "Failed to fetch products"
          );
        }

        setOrders(ordersData.orders || []);
        setProducts(productsData.products || []);
      } catch (error) {
        console.error("Dashboard error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [token, user]);

  // ==============================
  // ACCESS CHECK
  // ==============================

  if (!token || !user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Login Required
          </h1>

          <p className="text-zinc-500 mt-3">
            Please login to access the admin dashboard.
          </p>

          <Link
            href="/login"
            className="inline-block mt-6 bg-white text-black px-6 py-3 rounded-xl font-semibold"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold">
            Access Denied
          </h1>

          <p className="text-zinc-500 mt-3">
            You do not have permission to access the admin dashboard.
          </p>

          <Link
            href="/"
            className="inline-block mt-6 bg-white text-black px-6 py-3 rounded-xl font-semibold"
          >
            Back To Store
          </Link>
        </div>
      </main>
    );
  }

  // ==============================
  // STATISTICS
  // ==============================

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.status !== "CANCELLED")
    .reduce(
      (total, order) => total + order.total,
      0
    );

  const lowStockProducts = products.filter(
    (product) =>
      product.stock > 0 && product.stock <= 10
  ).length;

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">
            ⏳
          </div>

          <h1 className="text-2xl font-bold">
            Loading Dashboard
          </h1>

          <p className="text-zinc-500 mt-2">
            Fetching store data...
          </p>
        </div>
      </main>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <h1 className="text-3xl font-bold">
            Dashboard Error
          </h1>

          <p className="text-red-400 mt-4">
            {error}
          </p>

          <p className="text-zinc-500 text-sm mt-4">
            Make sure your backend server is running and
            that your account has ADMIN privileges.
          </p>

          <Link
            href="/"
            className="inline-block mt-6 bg-white text-black px-6 py-3 rounded-xl font-semibold"
          >
            Back To Store
          </Link>
        </div>
      </main>
    );
  }

  // ==============================
  // DASHBOARD
  // ==============================

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Header */}

      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

          <div>
            <Link
              href="/"
              className="text-2xl font-bold"
            >
              LOREON
            </Link>

            <p className="text-xs text-zinc-500 mt-1">
              Admin Dashboard
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold">
              {user.name}
            </p>

            <p className="text-xs text-zinc-500">
              Administrator
            </p>
          </div>

        </div>
      </header>

      {/* Main */}

      <section className="max-w-7xl mx-auto px-6 py-12">

        {/* Heading */}

        <div className="mb-10">

          <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm">
            Overview
          </p>

          <h1 className="text-4xl font-bold mt-3">
            Dashboard
          </h1>

          <p className="text-zinc-400 mt-3">
            Manage your Loreon store from one place.
          </p>

        </div>

        {/* Statistics */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Orders */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <p className="text-zinc-500 text-sm">
              Total Orders
            </p>

            <p className="text-3xl font-bold mt-3">
              {totalOrders}
            </p>

            <p className="text-zinc-500 text-sm mt-2">
              All customer orders
            </p>

          </div>

          {/* Revenue */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <p className="text-zinc-500 text-sm">
              Revenue
            </p>

            <p className="text-3xl font-bold mt-3">
              ₹{totalRevenue.toFixed(2)}
            </p>

            <p className="text-zinc-500 text-sm mt-2">
              Excluding cancelled orders
            </p>

          </div>

          {/* Pending */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <p className="text-zinc-500 text-sm">
              Pending Orders
            </p>

            <p className="text-3xl font-bold mt-3 text-yellow-400">
              {pendingOrders}
            </p>

            <p className="text-zinc-500 text-sm mt-2">
              Awaiting processing
            </p>

          </div>

          {/* Products */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <p className="text-zinc-500 text-sm">
              Products
            </p>

            <p className="text-3xl font-bold mt-3">
              {products.length}
            </p>

            <p className="text-zinc-500 text-sm mt-2">
              {lowStockProducts} low stock
            </p>

          </div>

        </div>

        {/* Quick Actions */}

        <div className="mt-12">

          <h2 className="text-2xl font-bold mb-6">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <Link
              href="/admin/orders"
              className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-xl font-bold">
                    Manage Orders
                  </h3>

                  <p className="text-zinc-500 mt-2">
                    View orders and update their status.
                  </p>

                </div>

                <span className="text-2xl group-hover:translate-x-1 transition">
                  →
                </span>

              </div>

            </Link>

            <Link
              href="/admin/products"
              className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-xl font-bold">
                    Manage Products
                  </h3>

                  <p className="text-zinc-500 mt-2">
                    Manage products and inventory.
                  </p>

                </div>

                <span className="text-2xl group-hover:translate-x-1 transition">
                  →
                </span>

              </div>

            </Link>

          </div>

        </div>

        {/* Recent Orders */}

        <div className="mt-12">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">
              Recent Orders
            </h2>

            <Link
              href="/admin/orders"
              className="text-sm text-zinc-400 hover:text-white transition"
            >
              View All →
            </Link>

          </div>

          {orders.length === 0 ? (

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">

              <p className="text-zinc-500">
                No orders yet.
              </p>

            </div>

          ) : (

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="border-b border-zinc-800">

                    <tr className="text-left text-sm text-zinc-500">

                      <th className="px-6 py-4">
                        Customer
                      </th>

                      <th className="px-6 py-4">
                        Total
                      </th>

                      <th className="px-6 py-4">
                        Status
                      </th>

                      <th className="px-6 py-4">
                        Date
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {orders
                      .slice(0, 5)
                      .map((order) => (

                        <tr
                          key={order.id}
                          className="border-b border-zinc-800 last:border-b-0"
                        >

                          <td className="px-6 py-5">

                            <p className="font-semibold">
                              {order.customerName}
                            </p>

                            <p className="text-xs text-zinc-500 mt-1">
                              {order.email}
                            </p>

                          </td>

                          <td className="px-6 py-5 font-semibold">
                            ₹{order.total.toFixed(2)}
                          </td>

                          <td className="px-6 py-5">

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === "DELIVERED"
                                  ? "bg-green-500/10 text-green-400"
                                  : order.status === "CANCELLED"
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-yellow-500/10 text-yellow-400"
                              }`}
                            >
                              {order.status}
                            </span>

                          </td>

                          <td className="px-6 py-5 text-sm text-zinc-500">

                            {new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}

                          </td>

                        </tr>

                      ))}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </div>

        {/* Order Overview */}

        <div className="mt-12">

          <h2 className="text-2xl font-bold mb-6">
            Order Overview
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

              <p className="text-zinc-500 text-sm">
                Pending
              </p>

              <p className="text-2xl font-bold text-yellow-400 mt-2">
                {pendingOrders}
              </p>

            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

              <p className="text-zinc-500 text-sm">
                Delivered
              </p>

              <p className="text-2xl font-bold text-green-400 mt-2">
                {deliveredOrders}
              </p>

            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

              <p className="text-zinc-500 text-sm">
                Low Stock
              </p>

              <p className="text-2xl font-bold text-orange-400 mt-2">
                {lowStockProducts}
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}