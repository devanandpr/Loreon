"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import {createOrder} from "@/lib/api";

export default function CheckoutPage() {
  const { cart , clearCart } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setIsSubmitting(true);

    const response = await fetch(
      "http://localhost:5000/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  customer: form,
  items: cart,
  subtotal,
  shipping,
  total,
  paymentMethod,
}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to create order"
      );
    }

    console.log("Order created:", data);

    clearCart();
    window.location.href = `/order-success?orderId=${data.order.id}`;
    clearCart();
  } catch (error) {
    console.error("Order submission error:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Unable to place order. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

<div className="mt-8">
  <h2 className="text-xl font-semibold">
    Payment Method
  </h2>

  <div className="mt-4 space-y-3">

    <label className="flex items-center gap-4 p-4 rounded-xl border border-zinc-700 bg-zinc-900 cursor-pointer">
      <input
        type="radio"
        name="paymentMethod"
        value="COD"
        checked={paymentMethod === "COD"}
        onChange={(e) =>
          setPaymentMethod(e.target.value)
        }
        className="w-4 h-4"
      />

      <div>
        <p className="font-semibold">
          Cash on Delivery
        </p>

        <p className="text-sm text-zinc-500">
          Pay when your order arrives.
        </p>
      </div>
    </label>

    <label className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 opacity-50 cursor-not-allowed">
      <input
        type="radio"
        name="paymentMethod"
        value="ONLINE"
        disabled
        checked={paymentMethod === "ONLINE"}
        onChange={(e) =>
          setPaymentMethod(e.target.value)
        }
        className="w-4 h-4"
      />

      <div>
        <p className="font-semibold">
          Online Payment
        </p>

        <p className="text-sm text-zinc-500">
          Coming soon.
        </p>
      </div>
    </label>

  </div>
</div>
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

      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="mb-10">

          <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm">
            Checkout
          </p>

          <h1 className="text-4xl font-bold mt-3">
            Complete Your Order
          </h1>

        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* Customer Information */}

          <div className="lg:col-span-2">

            <form
              onSubmit={handleSubmit}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >

              <h2 className="text-2xl font-bold mb-6">
                Customer Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Full Name
                  </label>

                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Email
                  </label>

                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Phone
                  </label>

                  <input
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    PIN Code
                  </label>

                  <input
                    required
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="670001"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-white"
                  />
                </div>

              </div>

              {/* Address */}

              <div className="mt-6">

                <label className="block text-sm text-zinc-400 mb-2">
                  Address
                </label>

                <input
                  required
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House number, street, locality"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-white"
                />

              </div>

              <div className="grid sm:grid-cols-2 gap-5 mt-6">

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    City
                  </label>

                  <input
                    required
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Kannur"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    State
                  </label>

                  <input
                    required
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="Kerala"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-white"
                  />
                </div>

              </div>

              <button
  type="submit"
  disabled={isSubmitting}
  className="w-full mt-8 bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isSubmitting ? "Placing Order..." : "Place Order"}
</button>

            </form>

          </div>

          {/* Order Summary */}

          <div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-6">

              <h2 className="text-xl font-bold mb-6">
                Order Summary
              </h2>

              <div className="space-y-5">

                {cart.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-4"
                  >

                    <div className="relative w-16 h-16 bg-zinc-950 rounded-lg overflow-hidden flex-shrink-0">

                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />

                    </div>

                    <div className="flex-1">

                      <h3 className="text-sm font-semibold">
                        {item.name}
                      </h3>

                      <p className="text-xs text-zinc-500 mt-1">
                        Quantity: {item.quantity}
                      </p>

                    </div>

                    <p className="text-sm font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                  </div>

                ))}

              </div>

              <div className="border-t border-zinc-800 mt-6 pt-6 space-y-3">

                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>

                  <span>
                    {shipping === 0
                      ? "FREE"
                      : `$${shipping.toFixed(2)}`}
                  </span>

                </div>

                <div className="border-t border-zinc-800 pt-4 flex justify-between text-lg font-bold">

                  <span>Total</span>

                  <span>
                    ${total.toFixed(2)}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}