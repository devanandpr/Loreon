"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
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
  items: OrderItem[];
  createdAt: string;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/${orderId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch order"
          );
        }

        setOrder(data.order);
      } catch (error) {
        console.error("Order fetch error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>

          <h1 className="text-2xl font-bold">
            Loading Your Order
          </h1>

          <p className="text-zinc-500 mt-2">
            Please wait...
          </p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-xl w-full text-center">

          <div className="mx-auto w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <span className="text-4xl text-red-500">
              !
            </span>
          </div>

          <h1 className="text-3xl font-bold mt-8">
            Unable to Load Order
          </h1>

          <p className="text-zinc-400 mt-4">
            {error || "Order not found."}
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

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Header */}

      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">

          <Link
            href="/"
            className="text-2xl font-bold"
          >
            LOREON
          </Link>

        </div>
      </header>

      {/* Main */}

      <section className="max-w-5xl mx-auto px-6 py-12">

        {/* Success */}

        <div className="text-center">

          <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
            <span className="text-4xl text-green-500">
              ✓
            </span>
          </div>

          <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm mt-8">
            Order Confirmed
          </p>

          <h1 className="text-4xl font-bold mt-3">
            Thank You For Your Order
          </h1>

          <p className="text-zinc-400 mt-4">
            Your order has been successfully placed.
          </p>

          <div className="mt-6 inline-block bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4">

            <p className="text-xs text-zinc-500">
              Order ID
            </p>

            <p className="font-mono font-semibold mt-1 break-all">
              {order.id}
            </p>

          </div>

        </div>

        {/* Customer Information */}

        <div className="grid md:grid-cols-2 gap-6 mt-12">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <h2 className="text-xl font-bold mb-5">
              Customer Information
            </h2>

            <div className="space-y-3 text-sm">

              <div>
                <p className="text-zinc-500">
                  Name
                </p>

                <p className="mt-1">
                  {order.customerName}
                </p>
              </div>

              <div>
                <p className="text-zinc-500">
                  Email
                </p>

                <p className="mt-1">
                  {order.email}
                </p>
              </div>

              <div>
                <p className="text-zinc-500">
                  Phone
                </p>

                <p className="mt-1">
                  {order.phone}
                </p>
              </div>

            </div>

          </div>

          {/* Delivery */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <h2 className="text-xl font-bold mb-5">
              Delivery Address
            </h2>

            <p className="text-zinc-300 leading-relaxed">
              {order.address}
              <br />
              {order.city}, {order.state}
              <br />
              PIN: {order.pincode}
            </p>

          </div>

        </div>

        {/* Products */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-6">

          <h2 className="text-xl font-bold mb-6">
            Ordered Products
          </h2>

          <div className="space-y-5">

            {order.items.map((item) => (

              <div
                key={item.id}
                className="flex gap-4 items-center"
              >

                <div className="w-20 h-20 bg-zinc-950 rounded-xl overflow-hidden flex-shrink-0">

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
                    Quantity: {item.quantity}
                  </p>

                  <p className="text-sm text-zinc-500">
                    Price: ${item.price.toFixed(2)}
                  </p>

                </div>

                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* Order Summary */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-6">

          <h2 className="text-xl font-bold mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between text-zinc-400">
              <span>
                Subtotal
              </span>

              <span>
                ${order.subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-zinc-400">
              <span>
                Shipping
              </span>

              <span>
                {order.shipping === 0
                  ? "FREE"
                  : `$${order.shipping.toFixed(2)}`}
              </span>
            </div>

            <div className="border-t border-zinc-800 pt-4 flex justify-between text-xl font-bold">

              <span>
                Total
              </span>

              <span>
                ${order.total.toFixed(2)}
              </span>

            </div>

          </div>

        </div>

        {/* Status */}

        <div className="grid sm:grid-cols-2 gap-6 mt-6">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

            <p className="text-sm text-zinc-500">
              Order Status
            </p>

            <p className="mt-2 font-semibold">
              {order.status}
            </p>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

            <p className="text-sm text-zinc-500">
              Payment Status
            </p>

            <p className="mt-2 font-semibold">
              {order.paymentStatus}
            </p>

          </div>

        </div>

        {/* Buttons */}

        <div className="flex flex-col sm:flex-row gap-4 mt-10">

          <Link
            href="/products"
            className="flex-1 text-center bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition"
          >
            Continue Shopping
          </Link>

          <Link
            href="/"
            className="flex-1 text-center border border-zinc-700 py-4 rounded-xl font-bold hover:bg-zinc-900 transition"
          >
            Back To Home
          </Link>

        </div>

      </section>

    </main>
  );
}