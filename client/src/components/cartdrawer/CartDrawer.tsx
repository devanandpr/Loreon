"use client";

import React from "react";
import { FiX, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";

export default function CartDrawer() {
  const { isOpen, closeCart, cart, removeFromCart, updateQuantity } = useCartStore();

  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="relative z-10 w-full max-w-md bg-zinc-900 h-full flex flex-col justify-between p-6 border-l border-zinc-800 shadow-2xl">
        <div>
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h2 className="text-xl font-bold text-white">Your Cart</h2>
            <button onClick={closeCart} className="text-zinc-400 hover:text-white">
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {cart.length === 0 ? (
              <p className="text-zinc-500 text-center py-8">Your cart is currently empty.</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-lg border border-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded bg-zinc-700"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                      <p className="text-xs text-zinc-400">${item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-zinc-800 rounded p-1 border border-zinc-700">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-zinc-400 hover:text-white p-1"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="text-xs px-1 text-white font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-zinc-400 hover:text-white p-1"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-500 hover:text-red-400 transition"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-4">
          <div className="flex justify-between items-center mb-4 text-white">
            <span className="font-semibold text-sm">Subtotal</span>
            <span className="font-bold text-lg">${total.toFixed(2)}</span>
          </div>
          <Link
  href="/checkout"
  onClick={closeCart}
  className={`block w-full py-3 text-center bg-white text-black font-bold text-sm rounded-lg hover:bg-zinc-200 transition ${
    cart.length === 0
      ? "pointer-events-none opacity-50"
      : ""
  }`}
>
  Checkout
</Link>
        </div>
      </div>
    </div>
  );
}