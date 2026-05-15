"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const productData: Record<string, {
  id: string;
  nama: string;
  hargaMin: string;
  hargaMax: string;
  mainImage: string;
  gridImages: string[];
  ukuran: string[];
  varian: string[];
  accordion: { label: string; content: string }[];
}> = {
  "1": {
    id: "1",
    nama: "Running Cotton Lasershot Muscle Tee Semi Wash Sleeve Unisex Black V13 Baju Lari Bolong",
    hargaMin: "Rp 101.850",
    hargaMax: "Rp 104.850",
    mainImage: "/images/products/lasershot-main.jpg",
    gridImages: [
      "/images/products/lasershot-back.jpg",
      "/images/products/lasershot-side.jpg",
      "/images/products/lasershot-detail.jpg",
      "/images/products/lasershot-more.jpg",
    ],
    ukuran: ["S", "M", "L", "XL", "XXL"],
    varian: ["Lasershot", "Tanpa Laser"],
    accordion: [
      {
        label: "Effective Sweat Absorption",
        content: "Cotton has the ability to absorb sweat, and with the perforations in the T-shirt, moisture evaporates quickly. This prevents a damp or sticky feeling on your body, keeping you comfortable during your run.",
      },
      {
        label: "Better Air Circulation",
        content: "The small perforations in the fabric allow for smoother airflow. This helps regulate body temperature by increasing ventilation, preventing you from overheating while running.",
      },
      {
        label: "Spesifikasi",
        content: "Muscle Tee Black\nScreen Printing with Plastisol INK\nLASERSHOT (bolong-bolong) OPSIONAL DI KOLOM VARIAN\nFree Zipper Premium Pouch & Free Sticker",
      },
    ],
  },
};

const defaultProduct = (id: string) => ({
  id,
  nama: "Produk Dopamine",
  hargaMin: "Rp 100.000",
  hargaMax: "Rp 150.000",
  mainImage: "",
  gridImages: ["", "", "", ""],
  ukuran: ["S", "M", "L", "XL", "XXL"],
  varian: ["Lasershot", "Tanpa Laser"],
  accordion: [
    { label: "Effective Sweat Absorption", content: "Cotton has the ability to absorb sweat, and with the perforations in the T-shirt, moisture evaporates quickly. This prevents a damp or sticky feeling on your body, keeping you comfortable during your run." },
    { label: "Better Air Circulation", content: "The small perforations in the fabric allow for smoother airflow. This helps regulate body temperature by increasing ventilation, preventing you from overheating while running." },
    { label: "Spesifikasi", content: "Muscle Tee Black\nScreen Printing with Plastisol INK\nLASERSHOT (bolong-bolong) OPSIONAL DI KOLOM VARIAN\nFree Zipper Premium Pouch & Free Sticker" },
  ],
});

const rekomendasiData = [
  { id: "2", nama: "Running Cotton Lasershot Short Sleeve Unisex Black V5", image: "/images/products/rec-1.jpg", harga: "Rp 98.000" },
  { id: "3", nama: "Running Cotton Lasershot Short Sleeve Unisex Deep Blue V7", image: "/images/products/rec-2.jpg", harga: "Rp 98.000" },
  { id: "4", nama: "Running Cotton Lasershot Muscle Tee Unisex Black V5", image: "/images/products/rec-3.jpg", harga: "Rp 101.850" },
  { id: "5", nama: "Running Cotton Muscle Tee Unisex White V3", image: "/images/products/rec-4.jpg", harga: "Rp 95.000" },
];

/* ── Accordion ── */
function AccordionItem({ label, content }: { label: string; content: string }) {
  const [open, setOpen] = useState(false);
  const lines = content.split("\n").filter(Boolean);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex justify-between items-center py-4 text-left group"
      >
        <span className="text-sm group-hover:opacity-60 transition-opacity">{label}</span>
        <span className={`text-xl font-light text-gray-400 ml-4 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      {open && (
        <div className="pb-5 pr-4">
          {lines.length > 1 ? (
            <ul className="space-y-1.5">
              {lines.map((line, i) => (
                <li key={i} className="text-xs text-gray-500 leading-relaxed flex gap-2">
                  <span className="text-gray-300 mt-0.5 flex-shrink-0">—</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 leading-relaxed">{content}</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Gambar dengan fallback ── */
function ProductImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) return <div className={`bg-[#d8d5cf] w-full h-full ${className ?? ""}`} />;
  return <img src={src} alt={alt} className={className} onError={() => setErr(true)} />;
}

/* ── Main Page ── */
export default function ProductDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "1";
  const product = productData[id] ?? defaultProduct(id);

  const router = useRouter();
  const [selectedUkuran, setSelectedUkuran] = useState("");
  const [selectedVarian, setSelectedVarian] = useState("");
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);

  function handleBeli() {
    if (!selectedUkuran || !selectedVarian) {
      alert("Pilih ukuran dan varian terlebih dahulu.");
      return;
    }
    setAdded(true);
    const params = new URLSearchParams({
      nama: product.nama,
      image: product.mainImage,
      ukuran: selectedUkuran,
      varian: selectedVarian,
      harga: product.hargaMin,
    });
    setTimeout(() => router.push(`/checkout?${params.toString()}`), 600);
  }

  return (
    <div className="min-h-screen bg-[#f5f3ef]">

      {/*
        LAYOUT (mengikuti desain):
        ┌─────────────────┬──────────────────┐
        │   Foto utama    │   Info + pilihan  │
        ├────────┬────────┤   + CTA          │
        │Accordion│ Grid  │                  │
        │ (kiri) │ foto  │                  │
        └────────┴────────┴──────────────────┘
      */}

      {/* ── BARIS 1: Foto utama (kiri) + Info produk (kanan) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-start">

        {/* Kolom kiri — foto utama */}
        <div className="relative bg-[#e8e5e0] aspect-[4/5] md:min-h-[580px]">
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <span className="font-black italic text-xs tracking-widest text-black/20 select-none">DOPAMINE</span>
          </div>
          <ProductImg
            src={product.mainImage}
            alt={product.nama}
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Kolom kanan — info produk */}
        <div className="sticky top-[57px] self-start px-8 sm:px-12 py-10 flex flex-col gap-6">

          {/* Nama produk */}
          <div>
            <h1 className="text-sm sm:text-[15px] leading-relaxed font-normal text-gray-800 mb-2">
              {product.nama}
            </h1>
            <p className="text-sm font-medium">
              {product.hargaMin} – {product.hargaMax}
            </p>
          </div>

          {/* Ukuran */}
          <div>
            <p className="text-[11px] font-black tracking-widest mb-3 text-gray-700">Ukuran</p>
            <div className="flex flex-wrap gap-2">
              {product.ukuran.map((u) => (
                <button
                  key={u}
                  onClick={() => setSelectedUkuran(u)}
                  className={`min-w-[52px] px-4 py-2 border text-xs font-medium transition-all ${
                    selectedUkuran === u
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white hover:border-black"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Varian */}
          <div>
            <p className="text-[11px] font-black tracking-widest mb-3 text-gray-700">Varian</p>
            <div className="flex flex-wrap gap-2">
              {product.varian.map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVarian(v)}
                  className={`px-5 py-2 border text-xs font-medium transition-all ${
                    selectedVarian === v
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white hover:border-black"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-2">
            <button
              onClick={handleBeli}
              className={`flex-1 py-3.5 font-black text-xs tracking-widest transition-all ${
                added ? "bg-green-600 text-white" : "bg-black text-white hover:opacity-80"
              }`}
            >
              {added ? "MENGARAHKAN..." : "Beli Sekarang"}
            </button>
            <button
              onClick={() => setSaved((v) => !v)}
              aria-label="Simpan"
              className={`w-12 border flex items-center justify-center transition-all text-base ${
                saved ? "border-black bg-black text-white" : "border-gray-300 bg-white hover:border-black"
              }`}
            >
              {saved ? "🔖" : "🏷"}
            </button>
          </div>

        </div>
      </div>

      {/* ── BARIS 2: Accordion (kiri bawah foto) + Grid foto (kanan) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Kolom kiri — Accordion tepat di bawah foto utama */}
        <div className="px-6 sm:px-10 py-8 border-t border-gray-200">
          <p className="text-xs font-black tracking-widest text-gray-400 mb-2">Deskripsi Produk</p>
          {product.accordion.map((item) => (
            <AccordionItem key={item.label} label={item.label} content={item.content} />
          ))}
        </div>

        {/* Kolom kanan — Grid 4 foto */}
        <div className="grid grid-cols-2 gap-0.5 bg-gray-300">
          {product.gridImages.slice(0, 3).map((img, i) => (
            <div key={i} className="relative bg-[#e8e5e0] aspect-square overflow-hidden">
              <div className="absolute top-2 right-2 z-10 pointer-events-none">
                <span className="font-black italic text-[10px] tracking-widest text-black/20">DOPAMINE</span>
              </div>
              <ProductImg
                src={img}
                alt={`foto ${i + 2}`}
                className="w-full h-full object-cover object-top"
              />
            </div>
          ))}
          {/* Click for more */}
          <div className="relative bg-[#d0cdc8] aspect-square overflow-hidden flex items-center justify-center cursor-pointer group">
            <ProductImg
              src={product.gridImages[3] ?? ""}
              alt="more"
              className="absolute inset-0 w-full h-full object-cover object-top opacity-30"
            />
            <span className="relative z-10 text-[11px] font-bold tracking-widest text-gray-600 group-hover:text-black transition-colors">
              Click for more
            </span>
          </div>
        </div>

      </div>

      {/* ── BARIS 3: Rekomendasi ── */}
      <div className="px-6 sm:px-10 py-12 border-t border-gray-200">
        <h2 className="text-sm font-normal mb-6 text-gray-700">Mungkin kamu juga suka</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {rekomendasiData.map((item) => (
            <Link key={item.id} href={`/products/${item.id}`} className="group">
              <div className="bg-[#e8e5e0] aspect-square rounded-sm overflow-hidden mb-3">
                <ProductImg
                  src={item.image}
                  alt={item.nama}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-xs leading-snug text-gray-700 mb-1 line-clamp-2">{item.nama}</p>
              <p className="text-xs font-bold">{item.harga}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
