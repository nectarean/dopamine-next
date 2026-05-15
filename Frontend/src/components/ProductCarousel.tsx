"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const products = [
  { name: "BASIC TEE BLACK", price: "Rp 189.000", image: null, emoji: "👕", colorClass: "" },
  { name: "ACTIVE TEES BLUE", price: "Rp 199.000", image: null, emoji: "👕", colorClass: "hue-rotate-[200deg]" },
  { name: "ESSENTIALS BLACK", price: "Rp 175.000", image: null, emoji: "👕", colorClass: "" },
  { name: "RUN SHORTS", price: "Rp 229.000", image: null, emoji: "🩳", colorClass: "" },
  { name: "SPORT CAP", price: "Rp 149.000", image: null, emoji: "🧢", colorClass: "" },
  { name: "RUNNING SOCKS", price: "Rp 89.000", image: null, emoji: "🧦", colorClass: "" },
];

const VISIBLE = 3;

export default function ProductCarousel() {
  const [index, setIndex] = useState(0);
  const maxIndex = products.length - VISIBLE;

  const move = (dir: number) =>
    setIndex((i) => Math.max(0, Math.min(i + dir, maxIndex)));

  return (
    <section className="px-6 sm:px-10 md:px-16 lg:px-24 py-14 md:py-20 bg-[#f5f3ef]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-gray-300 pb-4">
        <h2 className="text-2xl md:text-3xl font-black tracking-wide">Produk Baru</h2>
        <div className="flex gap-3">
          <button
            onClick={() => move(-1)}
            disabled={index === 0}
            className="w-10 h-10 border-[1.5px] border-black rounded-full flex items-center justify-center text-base hover:bg-black hover:text-white transition-colors disabled:opacity-30"
            aria-label="Sebelumnya"
          >←</button>
          <button
            onClick={() => move(1)}
            disabled={index >= maxIndex}
            className="w-10 h-10 border-[1.5px] border-black rounded-full flex items-center justify-center text-base hover:bg-black hover:text-white transition-colors disabled:opacity-30"
            aria-label="Berikutnya"
          >→</button>
        </div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden">
        <div
          className="flex gap-5 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(calc(-${index} * (33.333% + 6.67px)))` }}
        >
          {products.map((p, i) => (
            <div
              key={i}
              className="min-w-[calc(33.333%-13.33px)] flex-shrink-0 bg-[#e8e5e0] rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-200"
            >
              {/* Image area — aspect-[3/4] placeholder, diganti otomatis saat gambar ada */}
              <div className="relative w-full aspect-[3/4] bg-[#dedad4]">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={"text-7xl md:text-8xl " + p.colorClass}>{p.emoji}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="px-4 py-4 md:px-5 md:py-5">
                <div className="text-[11px] md:text-xs font-black tracking-widest uppercase mb-1.5 leading-tight">{p.name}</div>
                <div className="text-sm md:text-base font-semibold text-gray-700">{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer link */}
      <div className="text-right mt-6">
        <Link
          href="/products"
          className="text-sm tracking-widest uppercase underline hover:opacity-60 transition-opacity font-semibold"
        >
          Lihat Semua →
        </Link>
      </div>
    </section>
  );
}
