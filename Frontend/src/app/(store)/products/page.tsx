"use client";

import { useState } from "react";
import Link from "next/link";

const allProducts = [
  { id: "1", name: "Running Cotton Lasershot Muscle Tee Black V13", price: "Rp 101.850", emoji: "👕", category: "baju" },
  { id: "2", name: "Active Tees Blue", price: "Rp 199.000", emoji: "👕", category: "baju" },
  { id: "3", name: "Essentials Black", price: "Rp 175.000", emoji: "👕", category: "baju" },
  { id: "4", name: "Run Shorts", price: "Rp 229.000", emoji: "🩳", category: "celana" },
  { id: "5", name: "Sport Cap", price: "Rp 149.000", emoji: "🧢", category: "aksesoris" },
  { id: "6", name: "Running Socks", price: "Rp 89.000", emoji: "🧦", category: "aksesoris" },
  { id: "7", name: "Jersey Team", price: "Rp 259.000", emoji: "🎽", category: "baju" },
  { id: "8", name: "Running Belt", price: "Rp 119.000", emoji: "👜", category: "aksesoris" },
];

const filters = ["semua", "baju", "celana", "aksesoris"];

export default function ProductsPage() {
  const [active, setActive] = useState("semua");
  const filtered = active === "semua" ? allProducts : allProducts.filter((p) => p.category === active);

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-200">
        <Link href="/" className="w-8 h-8 border-[1.5px] border-black rounded-full flex items-center justify-center text-sm hover:bg-black hover:text-white transition-colors" aria-label="Kembali">←</Link>
        <h1 className="font-black tracking-widest text-sm">SEMUA PRODUK</h1>
      </div>
      <div className="px-6 py-8">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button key={f} onClick={() => setActive(f)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase whitespace-nowrap border-[1.5px] transition-all ${active === f ? "bg-black text-white border-black" : "bg-transparent text-black border-gray-300 hover:border-black"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`}
              className="bg-[#e8e5e0] rounded-xl p-5 text-center cursor-pointer hover:-translate-y-1 transition-transform duration-200 block">
              <div className="text-5xl mb-2">{p.emoji}</div>
              <div className="text-[11px] font-bold tracking-wide mb-1">{p.name}</div>
              <div className="text-xs text-gray-500">{p.price}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
