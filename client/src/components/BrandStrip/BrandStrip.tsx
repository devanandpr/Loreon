import React from "react";
import { SiApple, SiSony, SiSamsung, SiNike, SiBose } from "react-icons/si";

export default function BrandStrip() {
  const brands = [
    { name: "Apple", icon: SiApple },
    { name: "Sony", icon: SiSony },
    { name: "Samsung", icon: SiSamsung },
    { name: "Bose", icon: SiBose },
    { name: "Nike", icon: SiNike },
  ];

  return (
    <section className="py-8 bg-zinc-900/50 border-y border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
        {brands.map((brand, i) => {
          const Icon = brand.icon;
          return (
            <div key={i} className="flex items-center gap-2 text-zinc-400">
              <Icon className="w-6 h-6" />
              <span className="text-sm font-semibold">{brand.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}