"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    q: "Berapa lama pengiriman ke seluruh Indonesia?",
    a: "Pengiriman reguler 3–5 hari kerja. Express 1–2 hari kerja. Gratis ongkir untuk pembelian di atas Rp 300.000.",
  },
  {
    q: "Apakah produk Dopamine bisa di-return?",
    a: "Ya, kami menerima pengembalian barang dalam 7 hari setelah diterima, selama produk masih dalam kondisi baru dan belum digunakan.",
  },
  {
    q: "Bagaimana cara mengetahui ukuran yang tepat?",
    a: "Setiap produk dilengkapi size chart di halaman produk. Kami juga menyediakan panduan pengukuran tubuh untuk memilih ukuran yang paling pas.",
  },
  {
    q: "Apakah Dopamine tersedia di toko offline?",
    a: "Ya! Kami memiliki toko fisik di Kendari, Sulawesi Tenggara. Lihat detail lokasi di halaman Lokasi.",
  },
  {
    q: "Metode pembayaran apa saja yang diterima?",
    a: "Kami menerima transfer bank, kartu kredit/debit, e-wallet (GoPay, OVO, DANA), dan COD untuk wilayah tertentu.",
  },
  {
    q: "Apakah ada program diskon atau membership?",
    a: "Ya! Daftarkan diri Anda untuk mendapatkan akses awal ke produk terbaru dan diskon eksklusif member.",
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      {/* Back bar */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-200 bg-[#f5f3ef]">
        <Link
          href="/"
          className="w-8 h-8 border-[1.5px] border-black rounded-full flex items-center justify-center text-sm hover:bg-black hover:text-white transition-colors"
          aria-label="Kembali"
        >←</Link>
        <h1 className="font-black tracking-widest text-sm">FAQ</h1>
      </div>

      <div className="px-6 py-8 max-w-xl mx-auto">
        <p className="text-xs text-gray-500 mb-6">Pertanyaan yang sering ditanyakan</p>

        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-200">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full text-left py-4 flex justify-between items-start gap-4"
              >
                <span className="text-sm font-bold leading-snug">{faq.q}</span>
                <span className="text-lg font-light flex-shrink-0 mt-0.5">
                  {openIdx === i ? "−" : "+"}
                </span>
              </button>
              {openIdx === i && (
                <p className="text-xs text-gray-600 leading-relaxed pb-4">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
