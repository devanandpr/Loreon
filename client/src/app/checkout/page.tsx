"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";

export default function CheckoutPage() {
  const { cart } = useCartStore();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Order details:", {
      customer: form,
      items: cart,
      subtotal,
      shipping,
      total,
    });

    alert("Checkout form submitted!");
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">

          <h1 className="text-4xl font-bold">
            Your Cart Is Empty
          </h1>

          <p className="text-zinc-400 mt-4">
            Add some products before proceeding to checkout.
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
                className="w-full mt-8 bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition"
              >
                Place Order
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