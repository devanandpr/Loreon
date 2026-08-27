"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const { token, user } = useAuthStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Prevent flash of "Login Required" during client-side hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!orderId || !token || user?.role !== "ADMIN") {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch order");
        }

        setOrder(data.order);
      } catch (err) {
        console.error("Order details error:", err);
        setError(
          err instanceof Error ? err.message : "Unable to load order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token, user?.role, isHydrated]);

  const updateStatus = async (status: string) => {
    if (!order || !token) return;

    try {
      setUpdating(true);

      const response = await fetch(
        `${API_BASE_URL}/api/orders/${order.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order status");
      }

      setOrder({
        ...order,
        status: data.order?.status || status,
      });
    } catch (err) {
      console.error("Status update error:", err);
      alert(
        err instanceof Error ? err.message : "Failed to update order status"
      );
    } finally {
      setUpdating(false);
    }
  };

  // 1. Initial hydration and loading state
  if (!isHydrated || loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold">Loading Order</h1>
          <p className="text-zinc-500 mt-2">Please wait...</p>
        </div>
      </main>
    );
  }

  // 2. Authentication guard
  if (!token || !user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Login Required</h1>
          <p className="text-zinc-500 mt-3">Please login to access this page.</p>
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

  // 3. Authorization guard
  if (user.role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="text-zinc-500 mt-3">
            You do not have permission to access this page.
          </p>
          <Link
            href="/"
            className="inline-block mt-6 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
          >
            Back To Store
          </Link>
        </div>
      </main>
    );
  }

  // 4. Fetch error state
  if (error || !order) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold">Unable to Load Order</h1>
          <p className="text-red-400 mt-4">{error || "Order not found"}</p>
          <Link
            href="/admin/orders"
            className="inline-block mt-8 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
          >
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  // 5. Success state
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            LOREON
          </Link>
          <Link
            href="/admin/orders"
            className="text-zinc-400 hover:text-white transition"
          >
            ← Back to Orders
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm">
            Administration
          </p>
          <h1 className="text-4xl font-bold mt-3">Order Details</h1>
          <p className="font-mono text-zinc-500 mt-3 break-all">{order.id}</p>
          <p className="text-zinc-500 mt-2">
            {new Date(order.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold">Customer Information</h2>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-zinc-500">Name</p>
                <p className="mt-1">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Email</p>
                <p className="mt-1 break-all">{order.email}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Phone</p>
                <p className="mt-1">{order.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold">Shipping Address</h2>
            <div className="mt-6 text-zinc-300 leading-relaxed">
              <p>{order.address}</p>
              <p>
                {order.city}, {order.state}
              </p>
              <p>{order.pincode}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-6">
          <h2 className="text-xl font-bold">Ordered Products</h2>
          <div className="mt-6 space-y-5">
            {order.items.map((item) => (
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
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-zinc-500 mt-1">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-zinc-500">
                    Unit price: ₹{item.price.toFixed(2)}
                  </p>
                </div>

                <div className="font-bold">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold">Payment</h2>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">Payment Method</span>
                <span className="font-semibold">
                  {order.paymentMethod || "COD"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">Payment Status</span>
                <span className="font-semibold">{order.paymentStatus}</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-zinc-500">Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Shipping</span>
                <span>₹{order.shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-zinc-800 pt-4 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold">
                  ₹{order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h2 className="text-xl font-bold">Order Status</h2>
              <p className="text-zinc-500 mt-2">
                Update the current status of this order.
              </p>
            </div>

            <select
              value={order.status}
              disabled={updating}
              onChange={(e) => updateStatus(e.target.value)}
              className="bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-white disabled:opacity-50 cursor-pointer"
            >
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/admin/orders"
            className="inline-block border border-zinc-700 px-6 py-3 rounded-xl font-semibold hover:bg-zinc-900 transition"
          >
            ← Back to All Orders
          </Link>
        </div>
      </section>
    </main>
  );
}