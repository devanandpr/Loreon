"use client";

import React from "react";

export default function NewsLetter() {
  return (
    <section className="py-16 bg-zinc-900/60 border-y border-zinc-800">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-2">Stay Updated</h2>
        <p className="text-zinc-400 text-sm mb-6">
          Subscribe to receive early access to new releases and exclusive pricing.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-white text-black font-semibold text-sm rounded-lg hover:bg-zinc-200 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}