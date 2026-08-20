"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { createOrder } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();

  const { cart, clearCart } = useCartStore();
  const { token, user } = useAuthStore();

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

  // Fill customer details from logged-in user
  useEffect(() => {
    if (user) {
      setForm((current) => ({
        ...current,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // Calculate subtotal
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Free shipping over $100
  const shipping = subtotal >= 100 ? 0 : 10;

  const total = subtotal + shipping;

  // Handle form changes
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Submit order
  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    // User must be logged in
    if (!token) {
      alert("Please login before placing your order.");
      router.push("/login");
      return;
    }

    // Cart cannot be empty
    if (cart.length === 0) {
      alert("Your cart is empty.");
      router.push("/products");
      return;
    }

    try {
      setIsSubmitting(true);

      // Send only the information required by backend
      const orderData = {
        customer: form,

        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),

        subtotal,
        shipping,
        total,
        paymentMethod,
      };

      // Create order with authentication token
      const response = await createOrder(
        orderData,
        token
      );

      console.log(
        "Order created successfully:",
        response
      );

      const orderId = response.order.id;

      // Clear cart after successful order
      clearCart();

      // Go to success page
      router.push(
        `/order-success?orderId=${orderId}`
      );
    } catch (error) {
      console.error(
        "Order submission error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to place order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Header */}
        <div className="mb-10">

          <p className="uppercase tracking-[0.3em] text-zinc-500 text-sm">
            Checkout
          </p>

          <h1 className="text-4xl font-bold mt-3">
            Complete Your Order
          </h1>

        </div>

        {/* Login warning */}
        {!token && (
          <div className="mb-8 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-xl p-4">

            You need to login before placing an order.

            {" "}

            <Link
              href="/login"
              className="text-white underline"
            >
              Login here
            </Link>

          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-10">

          {/* ================= CUSTOMER INFORMATION ================= */}

          <div className="lg:col-span-2">

            <form
              onSubmit={handleSubmit}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >

              <h2 className="text-2xl font-bold mb-6">
                Customer Information
              </h2>

              {/* Name + Email */}
              <div className="grid sm:grid-cols-2 gap-5">

                {/* Name */}
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

                {/* Email */}
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

                {/* Phone */}
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

                {/* PIN */}
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

              {/* City + State */}
              <div className="grid sm:grid-cols-2 gap-5 mt-6">

                {/* City */}
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

                {/* State */}
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

              {/* ================= PAYMENT ================= */}

              <div className="mt-8">

                <h2 className="text-xl font-semibold">
                  Payment Method
                </h2>

                <div className="mt-4 space-y-3">

                  {/* COD */}
                  <label className="flex items-center gap-4 p-4 rounded-xl border border-zinc-700 bg-zinc-900 cursor-pointer">

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={
                        paymentMethod === "COD"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
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

                  {/* Online */}
                  <label className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 opacity-50 cursor-not-allowed">

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE"
                      disabled
                      checked={
                        paymentMethod === "ONLINE"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
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

              {/* ================= SUBMIT ================= */}

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !token ||
                  cart.length === 0
                }
                className="w-full mt-8 bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >

                {isSubmitting
                  ? "Placing Order..."
                  : "Place Order"}

              </button>

            </form>

          </div>

          {/* ================= ORDER SUMMARY ================= */}

          <div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-6">

              <h2 className="text-xl font-bold mb-6">
                Order Summary
              </h2>

              {/* Products */}
              <div className="space-y-5">

                {cart.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-4"
                  >

                    {/* Image */}
                    <div className="relative w-16 h-16 bg-zinc-950 rounded-lg overflow-hidden flex-shrink-0">

                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />

                    </div>

                    {/* Details */}
                    <div className="flex-1">

                      <h3 className="text-sm font-semibold">
                        {item.name}
                      </h3>

                      <p className="text-xs text-zinc-500 mt-1">
                        Quantity: {item.quantity}
                      </p>

                    </div>

                    {/* Item total */}
                    <p className="text-sm font-semibold">

                      $
                      {(
                        item.price *
                        item.quantity
                      ).toFixed(2)}

                    </p>

                  </div>

                ))}

              </div>

              {/* Totals */}
              <div className="border-t border-zinc-800 mt-6 pt-6 space-y-3">

                <div className="flex justify-between text-zinc-400">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    ${subtotal.toFixed(2)}
                  </span>

                </div>

                <div className="flex justify-between text-zinc-400">

                  <span>
                    Shipping
                  </span>

                  <span>
                    {shipping === 0
                      ? "FREE"
                      : `$${shipping.toFixed(2)}`}
                  </span>

                </div>

                <div className="border-t border-zinc-800 pt-4 flex justify-between text-lg font-bold">

                  <span>
                    Total
                  </span>

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