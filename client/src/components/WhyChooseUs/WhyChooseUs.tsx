import React from "react";
import { FiTruck, FiShield, FiHeadphones } from "react-icons/fi";

export default function WhyChooseUs() {
  const perks = [
    {
      icon: FiTruck,
      title: "Global Express Delivery",
      desc: "Fast, insured shipping direct to your doorstep worldwide.",
    },
    {
      icon: FiShield,
      title: "Two-Year Warranty",
      desc: "Guaranteed protection covering performance and defects.",
    },
    {
      icon: FiHeadphones,
      title: "24/7 Expert Support",
      desc: "Dedicated technical specialists available at any hour.",
    },
  ];

  return (
    <section id="why-us" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {perks.map((perk, i) => {
          const Icon = perk.icon;
          return (
            <div key={i} className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800">
              <Icon className="w-8 h-8 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{perk.title}</h3>
              <p className="text-sm text-zinc-400">{perk.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}