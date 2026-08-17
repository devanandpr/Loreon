"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  city: string;
  state: string;
  total: number;
  status: string;
  paymentStatus: string;
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/orders"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(data.orders);
    } catch (error) {
      console.error("Admin orders error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    orderId: string,
    status: string
  ) => {
    try {
      setUpdatingId(orderId);

      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order"
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      );
    } catch (error) {
      console.error("Status update error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
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

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Unable to Load Orders
          </h1>

          <p className="text-red-400 mt-4">
            {error}
          </p>

          <button
            onClick={fetchOrders}
            className="mt-6 bg-white text-black px-6 py-3 rounded-xl font-semibold"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

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

          <span className="text-zinc-500">
            Admin
          </span>

        </div>
      </header>

      {/* Dashboard */}

      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="mb-10">

          <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm">
            Administration
          </p>

          <h1 className="text-4xl font-bold mt-3">
            Orders
          </h1>

          <p className="text-zinc-400 mt-3">
            Manage customer orders and update their status.
          </p>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">
              Total Orders
            </p>

            <p className="text-3xl font-bold mt-2">
              {orders.length}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">
              Pending
            </p>

            <p className="text-3xl font-bold mt-2">
              {
                orders.filter(
                  (order) =>
                    order.status === "PENDING"
                ).length
              }
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">
              Processing
            </p>

            <p className="text-3xl font-bold mt-2">
              {
                orders.filter(
                  (order) =>
                    order.status === "PROCESSING"
                ).length
              }
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-500 text-sm">
              Delivered
            </p>

            <p className="text-3xl font-bold mt-2">
              {
                orders.filter(
                  (order) =>
                    order.status === "DELIVERED"
                ).length
              }
            </p>
          </div>

        </div>

        {/* Orders */}

        {orders.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">

            <h2 className="text-2xl font-bold">
              No Orders
            </h2>

            <p className="text-zinc-500 mt-3">
              There are currently no orders.
            </p>

          </div>
        ) : (

          <div className="space-y-5">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
              >

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                  {/* Customer */}

                  <div>

                    <p className="text-xs text-zinc-500 uppercase tracking-wider">
                      Customer
                    </p>

                    <h2 className="text-lg font-bold mt-1">
                      {order.customerName}
                    </h2>

                    <p className="text-sm text-zinc-500 mt-1">
                      {order.email}
                    </p>

                    <p className="text-sm text-zinc-500">
                      {order.phone}
                    </p>

                  </div>

                  {/* Order */}

                  <div>

                    <p className="text-xs text-zinc-500 uppercase tracking-wider">
                      Order ID
                    </p>

                    <p className="font-mono text-sm mt-1 break-all">
                      {order.id}
                    </p>

                    <p className="text-sm text-zinc-500 mt-2">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                  </div>

                  {/* Total */}

                  <div>

                    <p className="text-xs text-zinc-500 uppercase tracking-wider">
                      Total
                    </p>

                    <p className="text-2xl font-bold mt-1">
                      ₹{order.total.toFixed(2)}
                    </p>

                    <p className="text-sm text-zinc-500 mt-1">
                      Payment: {order.paymentStatus}
                    </p>

                  </div>

                  {/* Status */}

                  <div>

                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                      Order Status
                    </p>

                    <select
                      value={order.status}
                      disabled={
                        updatingId === order.id
                      }
                      onChange={(e) =>
                        updateStatus(
                          order.id,
                          e.target.value
                        )
                      }
                      className="bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-white disabled:opacity-50"
                    >
                      {ORDER_STATUSES.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        )
                      )}
                    </select>

                  </div>

                </div>

                {/* Products */}

                <div className="border-t border-zinc-800 mt-6 pt-5">

                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
                    Products
                  </p>

                  <div className="flex flex-wrap gap-3">

                    {order.items.map(
                      (item) => (
                        <div
                          key={item.id}
                          className="bg-black border border-zinc-800 rounded-xl px-4 py-3"
                        >
                          <p className="text-sm font-semibold">
                            {item.product.name}
                          </p>

                          <p className="text-xs text-zinc-500 mt-1">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      )
                    )}

                  </div>

                </div>

                {/* View Details */}

                <div className="border-t border-zinc-800 mt-6 pt-5 flex justify-end">

                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="bg-white text-black px-5 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
                  >
                    View Details →
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}