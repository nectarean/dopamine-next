"use client";

import { useState } from "react";
import Link from "next/link";

type TabType = "pembelian" | "favorit" | "pengaturan";

const statusStyle: Record<string, string> = {
  "Selesai": "text-green-600",
  "Dalam Proses Pembayaran": "text-yellow-600",
  "Diproses": "text-blue-600",
  "Dibatalkan": "text-red-500",
};

const pembelianData = [
  {
    id: 1,
    nama: "Running Cotton Lasershot Muscle Tee Semi Wash Sleeve Unisex Black V13 Baju Lari Bolong",
    ukuran: "M",
    varian: "LaserShot",
    harga: "Rp 101.850",
    status: "Dalam Proses Pembayaran",
    image: "/images/products/lasershot.jpg",
  },
  {
    id: 2,
    nama: "Basic Tee Black",
    ukuran: "L",
    varian: "Basic",
    harga: "Rp 189.000",
    status: "Selesai",
    image: "/images/products/basic-tee.jpg",
  },
  {
    id: 3,
    nama: "Run Shorts Navy",
    ukuran: "M",
    varian: "Navy",
    harga: "Rp 229.000",
    status: "Selesai",
    image: "/images/products/shorts.jpg",
  },
];

function PembelianTab() {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-light mb-8">Pembelian</h1>
      <div className="space-y-0">
        {pembelianData.map((item, i) => (
          <div
            key={item.id}
            className="flex items-start gap-4 py-6 border-b border-gray-200 first:border-t first:border-gray-200"
          >
            <span className="text-sm text-gray-400 w-4 flex-shrink-0 mt-0.5">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-snug mb-3 pr-4">{item.nama}</p>
              <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-1 mb-3">
                <span className="text-xs text-gray-400">Ukuran</span>
                <span className="text-xs">{item.ukuran}</span>
                <span className="text-xs text-gray-400">Varian</span>
                <span className="text-xs">{item.varian}</span>
              </div>
              <p className="text-sm font-bold mb-1">{item.harga}</p>
              <p className={`text-sm font-medium ${statusStyle[item.status] ?? "text-gray-600"}`}>
                {item.status}
              </p>
            </div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-[#e8e5e0] rounded-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.nama}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FavoritTab() {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-light mb-8">Favorit</h1>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl mb-4">🤍</div>
        <p className="text-sm text-gray-400">Belum ada produk favorit</p>
        <Link href="/products" className="mt-6 text-xs font-black tracking-widest underline hover:opacity-60 transition-opacity">
          LIHAT PRODUK →
        </Link>
      </div>
    </div>
  );
}

function PengaturanTab() {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-light mb-8">Pengaturan</h1>
      <div className="space-y-6 max-w-sm">
        {[
          { label: "Nama", value: "User Dopamine" },
          { label: "Email", value: "user@email.com" },
          { label: "No. HP", value: "+62 812-3456-7890" },
        ].map((field) => (
          <div key={field.label}>
            <label className="text-[11px] font-black tracking-widest text-gray-400 block mb-1.5">
              {field.label.toUpperCase()}
            </label>
            <input
              defaultValue={field.value}
              className="w-full border-b border-gray-300 pb-2 text-sm bg-transparent focus:outline-none focus:border-black transition-colors"
            />
          </div>
        ))}
        <button className="mt-4 bg-black text-white px-6 py-2.5 rounded-lg text-xs font-black tracking-widest hover:opacity-80 transition-opacity">
          SIMPAN
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("pembelian");

  const tabs: { id: TabType; label: string }[] = [
    { id: "pembelian", label: "Pembelian" },
    { id: "favorit", label: "Favorit" },
    { id: "pengaturan", label: "Pengaturan" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
        <div className="flex gap-12 sm:gap-20">

          {/* Sidebar */}
          <aside className="w-28 sm:w-36 flex-shrink-0">
            <nav className="space-y-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`block text-left text-lg sm:text-xl font-light transition-all w-full ${
                    activeTab === tab.id
                      ? "text-black font-semibold"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {activeTab === "pembelian" && <PembelianTab />}
            {activeTab === "favorit" && <FavoritTab />}
            {activeTab === "pengaturan" && <PengaturanTab />}
          </main>

        </div>
      </div>
    </div>
  );
}
