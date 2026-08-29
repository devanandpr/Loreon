"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useAuthStore } from "@/store/useAuthStore";
import { getOrder } from "@/lib/api";

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
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  createdAt: string;
  items: OrderItem[];
}

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function OrderDetailsPage() {
  const params = useParams();

  const orderId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const { token, user } = useAuthStore();

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [isHydrated, setIsHydrated] =
    useState(false);

  /* =====================================================
     ZUSTAND HYDRATION
  ===================================================== */

  useEffect(() => {
    const persist = useAuthStore.persist;

    if (persist.hasHydrated()) {
      setIsHydrated(true);
      return;
    }

    const unsubscribe =
      persist.onFinishHydration(() => {
        setIsHydrated(true);
      });

    return unsubscribe;
  }, []);

  /* =====================================================
     FETCH ORDER
  ===================================================== */

  useEffect(() => {
    if (!isHydrated) return;

    if (!orderId) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    if (!token) {
      setLoading(false);
      setError(
        "Please login to view your order."
      );
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrder(
          orderId,
          token
        );

        setOrder(data.order);
      } catch (err) {
        console.error(
          "Order details error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [isHydrated, orderId, token]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (!isHydrated || loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

        <div className="text-center">

          <div className="text-4xl mb-4">
            ⏳
          </div>

          <h1 className="text-2xl font-bold">
            Loading Order
          </h1>

          <p className="text-zinc-500 mt-2">
            Please wait...
          </p>

        </div>

      </main>
    );
  }

  /* =====================================================
     LOGIN REQUIRED
  ===================================================== */

  if (!token || !user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

        <div className="text-center max-w-md">

          <h1 className="text-3xl font-bold">
            Login Required
          </h1>

          <p className="text-zinc-400 mt-4">
            Please login to view your order.
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

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !order) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

        <div className="text-center max-w-md">

          <h1 className="text-3xl font-bold">
            Unable to Load Order
          </h1>

          <p className="text-red-400 mt-4">
            {error || "Order not found"}
          </p>

          <Link
            href="/orders"
            className="inline-block mt-8 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
          >
            Back to My Orders
          </Link>

        </div>

      </main>
    );
  }

  /* =====================================================
     ORDER STATUS
  ===================================================== */

  const currentStatusIndex =
    ORDER_STATUSES.indexOf(
      order.status
    );

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Header */}

      <header className="border-b border-zinc-800">

        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">

          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            LOREON
          </Link>

          <Link
            href="/orders"
            className="text-zinc-400 hover:text-white transition"
          >
            ← My Orders
          </Link>

        </div>

      </header>

      {/* Main */}

      <section className="max-w-6xl mx-auto px-6 py-12">

        {/* Title */}

        <div className="mb-10">

          <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm">
            Account
          </p>

          <h1 className="text-4xl font-bold mt-3">
            Order Details
          </h1>

          <p className="font-mono text-sm text-zinc-500 mt-3 break-all">
            Order #{order.id}
          </p>

          <p className="text-zinc-500 mt-2">
            Placed on{" "}
            {new Date(
              order.createdAt
            ).toLocaleString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </p>

        </div>

        {/* Order Status */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">

          <h2 className="text-xl font-bold">
            Order Status
          </h2>

          {order.status ===
          "CANCELLED" ? (

            <div className="mt-6">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  ✕
                </div>

                <div>

                  <p className="font-semibold text-red-400">
                    Order Cancelled
                  </p>

                  <p className="text-sm text-zinc-500 mt-1">
                    This order has been cancelled.
                  </p>

                </div>

              </div>

            </div>

          ) : (

            <div className="mt-8">

              <div className="flex items-center">

                {ORDER_STATUSES
                  .slice(0, 5)
                  .map(
                    (
                      status,
                      index
                    ) => {

                      const isCompleted =
                        currentStatusIndex >=
                        index;

                      const isCurrent =
                        order.status ===
                        status;

                      return (
                        <div
                          key={status}
                          className="flex items-center flex-1"
                        >

                          <div className="flex flex-col items-center">

                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border ${
                                isCompleted ||
                                isCurrent
                                  ? "bg-white text-black border-white"
                                  : "bg-black text-zinc-600 border-zinc-700"
                              }`}
                            >
                              {index + 1}
                            </div>

                            <p
                              className={`text-[10px] sm:text-xs mt-3 text-center whitespace-nowrap ${
                                isCurrent
                                  ? "text-white font-semibold"
                                  : isCompleted
                                  ? "text-zinc-300"
                                  : "text-zinc-600"
                              }`}
                            >
                              {status}
                            </p>

                          </div>

                          {index < 4 && (

                            <div
                              className={`h-1 flex-1 mx-2 rounded-full ${
                                currentStatusIndex >
                                index
                                  ? "bg-white"
                                  : "bg-zinc-800"
                              }`}
                            />

                          )}

                        </div>
                      );
                    }
                  )}

              </div>

              <div className="mt-8 text-center">

                <span className="inline-block px-4 py-2 rounded-full bg-white text-black text-sm font-semibold">
                  {order.status}
                </span>

              </div>

            </div>

          )}

        </div>

        {/* Customer + Shipping */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Customer */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <h2 className="text-xl font-bold">
              Customer Information
            </h2>

            <div className="mt-6 space-y-4">

              <div>

                <p className="text-sm text-zinc-500">
                  Name
                </p>

                <p className="mt-1">
                  {order.customerName}
                </p>

              </div>

              <div>

                <p className="text-sm text-zinc-500">
                  Email
                </p>

                <p className="mt-1 break-all">
                  {order.email}
                </p>

              </div>

              <div>

                <p className="text-sm text-zinc-500">
                  Phone
                </p>

                <p className="mt-1">
                  {order.phone}
                </p>

              </div>

            </div>

          </div>

          {/* Shipping */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <h2 className="text-xl font-bold">
              Shipping Address
            </h2>

            <div className="mt-6 text-zinc-300 leading-relaxed">

              <p>
                {order.address}
              </p>

              <p>
                {order.city},{" "}
                {order.state}
              </p>

              <p>
                {order.pincode}
              </p>

            </div>

          </div>

        </div>

        {/* Products */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-6">

          <h2 className="text-xl font-bold">
            Ordered Products
          </h2>

          <div className="mt-6 space-y-5">

            {order.items.map(
              (item) => (

                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-zinc-800 pb-5 last:border-b-0 last:pb-0"
                >

                  <div className="w-20 h-20 bg-black rounded-xl overflow-hidden flex-shrink-0">

                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain p-2"
                    />

                  </div>

                  <div className="flex-1">

                    <h3 className="font-semibold">
                      {item.product.name}
                    </h3>

                    <p className="text-sm text-zinc-500 mt-1">
                      Quantity:{" "}
                      {item.quantity}
                    </p>

                    <p className="text-sm text-zinc-500">
                      Unit price: ₹
                      {Number(
                        item.price
                      ).toFixed(2)}
                    </p>

                  </div>

                  <div className="font-bold">

                    ₹
                    {(
                      Number(
                        item.price
                      ) *
                      item.quantity
                    ).toFixed(2)}

                  </div>

                </div>

              )
            )}

          </div>

        </div>

        {/* Payment + Summary */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          {/* Payment */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <h2 className="text-xl font-bold">
              Payment
            </h2>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between gap-4">

                <span className="text-zinc-500">
                  Payment Method
                </span>

                <span className="font-semibold">
                  {order.paymentMethod ||
                    "COD"}
                </span>

              </div>

              <div className="flex justify-between gap-4">

                <span className="text-zinc-500">
                  Payment Status
                </span>

                <span className="font-semibold">
                  {order.paymentStatus}
                </span>

              </div>

            </div>

          </div>

          {/* Summary */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <h2 className="text-xl font-bold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between">

                <span className="text-zinc-500">
                  Subtotal
                </span>

                <span>
                  ₹
                  {Number(
                    order.subtotal
                  ).toFixed(2)}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-zinc-500">
                  Shipping
                </span>

                <span>
                  ₹
                  {Number(
                    order.shipping
                  ).toFixed(2)}
                </span>

              </div>

              <div className="border-t border-zinc-800 pt-4 flex justify-between">

                <span className="font-semibold">
                  Total
                </span>

                <span className="text-2xl font-bold">
                  ₹
                  {Number(
                    order.total
                  ).toFixed(2)}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Buttons */}

        <div className="mt-8 flex flex-col sm:flex-row gap-4">

          <Link
            href="/orders"
            className="inline-block border border-zinc-700 px-6 py-3 rounded-xl font-semibold hover:bg-zinc-900 transition text-center"
          >
            ← Back to My Orders
          </Link>

          <Link
            href="/products"
            className="inline-block bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition text-center"
          >
            Continue Shopping
          </Link>

        </div>

      </section>

    </main>
  );
}