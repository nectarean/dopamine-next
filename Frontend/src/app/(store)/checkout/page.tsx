"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/* ── Accordion row ── */
function AccordionRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex justify-between items-center py-5 text-left"
      >
        <span className="text-lg font-light">{label}</span>
        <span
          className={`text-gray-400 text-xl transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
        >
          ›
        </span>
      </button>
      {open && <div className="pb-6 px-1">{children}</div>}
    </div>
  );
}

/* ── Metode Pembayaran options ── */
const paymentMethods = [
  {
    id: "qris",
    label: "QRIS",
    desc: "Bayar dengan QR code — semua e-wallet & m-banking",
    available: true,
    icon: "▣",
  },
  {
    id: "bca",
    label: "Transfer BCA",
    desc: "Virtual Account BCA",
    available: false,
    icon: "🏦",
  },
  {
    id: "bni",
    label: "Transfer BNI",
    desc: "Virtual Account BNI",
    available: false,
    icon: "🏦",
  },
  {
    id: "mandiri",
    label: "Transfer Mandiri",
    desc: "Virtual Account Mandiri",
    available: false,
    icon: "🏦",
  },
  {
    id: "bri",
    label: "Transfer BRI",
    desc: "Virtual Account BRI",
    available: false,
    icon: "🏦",
  },
  {
    id: "cod",
    label: "COD (Bayar di Tempat)",
    desc: "Tersedia untuk wilayah tertentu",
    available: false,
    icon: "💵",
  },
];

/* ── Opsi Pengiriman ── */
const shippingOptions = [
  { id: "reguler", label: "Reguler", desc: "3–5 hari kerja", price: "Gratis", available: true },
  { id: "express", label: "Express", desc: "1–2 hari kerja", price: "Rp 25.000", available: false },
  { id: "same", label: "Same Day", desc: "Hari ini (khusus kota tertentu)", price: "Rp 45.000", available: false },
];

/* ── Main Page ── */
export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Data produk dari query params (dikirim dari halaman detail)
  const productName = searchParams.get("nama") ?? "Running Cotton Lasershot Muscle Tee Semi Wash Sleeve Unisex Black V13 Baju Lari Bolong";
  const productImage = searchParams.get("image") ?? "/images/products/lasershot-main.jpg";
  const productUkuran = searchParams.get("ukuran") ?? "M";
  const productVarian = searchParams.get("varian") ?? "Lasershot";
  const productHarga = searchParams.get("harga") ?? "Rp 101.850";

  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("reguler");
  const [diskon, setDiskon] = useState("");
  const [diskonApplied, setDiskonApplied] = useState(false);
  const [diskonError, setDiskonError] = useState("");

  function handleDiskon() {
    if (diskon.toUpperCase() === "DOPAMINE10") {
      setDiskonApplied(true);
      setDiskonError("");
    } else {
      setDiskonError("Kode diskon tidak valid.");
      setDiskonApplied(false);
    }
  }

  function handleLanjutkan() {
    if (!selectedPayment) {
      alert("Pilih metode pembayaran terlebih dahulu.");
      return;
    }
    alert("Fitur pembayaran segera hadir!");
  }

  const subtotal = parseInt(productHarga.replace(/\D/g, "")) || 101850;
  const diskonAmount = diskonApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - diskonAmount;

  function formatRp(n: number) {
    return "Rp " + n.toLocaleString("id-ID");
  }

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* ── Alamat Pengiriman ── */}
        <section className="mb-10">
          <h1 className="text-2xl font-light mb-6">Alamat Pengiriman</h1>
          <div className="pl-2">
            <p className="text-sm font-bold mb-2">Nama akun</p>
            <div className="space-y-1 text-sm text-gray-500 mb-4">
              <p>Nama penerima paket + No Telp Disini</p>
              <p>Lorem Ipsum@gmail.com</p>
              <p>Alamat Disini Provinsi, Kabupaten/Kota, Kelurahan sama kode pos disini</p>
              <p>Informasi Tambahan disini</p>
            </div>
            <button
              onClick={() => router.push("/shipping-detail")}
              className="text-sm font-bold underline hover:opacity-60 transition-opacity"
            >
              Edit Informasi
            </button>
          </div>
        </section>

        {/* ── Kartu Produk ── */}
        <div className="bg-black text-white rounded-2xl p-5 flex gap-4 items-start mb-10">
          {/* Foto produk */}
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-700 flex-shrink-0">
            <img
              src={productImage}
              alt={productName}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-snug mb-2 line-clamp-2">{productName}</p>
            <div className="flex gap-4 text-xs text-gray-400 mb-1">
              <span>Ukuran {productUkuran}</span>
              <span>Varian {productVarian}</span>
            </div>
            <p className="text-xs text-gray-400">1 Barang</p>
          </div>
        </div>

        {/* ── Accordion Sections ── */}
        <div className="mb-8">

          {/* Opsi Pengiriman */}
          <AccordionRow label="Opsi Pengiriman">
            <div className="space-y-3">
              {shippingOptions.map((opt) => (
                <button
                  key={opt.id}
                  disabled={!opt.available}
                  onClick={() => opt.available && setSelectedShipping(opt.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                    !opt.available
                      ? "border-gray-200 opacity-40 cursor-not-allowed"
                      : selectedShipping === opt.id
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white hover:border-black"
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold">{opt.label}</p>
                    <p className={`text-xs mt-0.5 ${selectedShipping === opt.id ? "text-gray-300" : "text-gray-400"}`}>
                      {opt.desc}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${opt.price === "Gratis" && selectedShipping !== opt.id ? "text-green-600" : ""}`}>
                      {opt.price}
                    </p>
                    {!opt.available && (
                      <p className="text-[10px] text-gray-400 mt-0.5">Segera hadir</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </AccordionRow>

          {/* Masukkan Diskon */}
          <AccordionRow label="Masukkan Diskon">
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={diskon}
                  onChange={(e) => {
                    setDiskon(e.target.value.toUpperCase());
                    setDiskonError("");
                    setDiskonApplied(false);
                  }}
                  placeholder="Masukkan kode diskon"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                />
                <button
                  onClick={handleDiskon}
                  className="bg-black text-white px-5 py-2.5 rounded-lg text-xs font-black tracking-widest hover:opacity-80 transition-opacity"
                >
                  PAKAI
                </button>
              </div>
              {diskonApplied && (
                <p className="text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  ✓ Diskon 10% berhasil diterapkan!
                </p>
              )}
              {diskonError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {diskonError}
                </p>
              )}
              <p className="text-[11px] text-gray-400">Coba kode: <span className="font-bold text-gray-600">DOPAMINE10</span></p>
            </div>
          </AccordionRow>

          {/* Metode Pembayaran */}
          <AccordionRow label="Metode Pembayaran">
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  disabled={!method.available}
                  onClick={() => method.available && setSelectedPayment(method.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    !method.available
                      ? "border-gray-200 opacity-40 cursor-not-allowed"
                      : selectedPayment === method.id
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white hover:border-black"
                  }`}
                >
                  <span className="text-xl w-7 flex-shrink-0 text-center">{method.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{method.label}</p>
                    <p className={`text-xs mt-0.5 ${selectedPayment === method.id ? "text-gray-300" : "text-gray-400"}`}>
                      {method.desc}
                    </p>
                  </div>
                  {method.available ? (
                    <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex-shrink-0">
                      Tersedia
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                      Segera
                    </span>
                  )}
                </button>
              ))}
            </div>
          </AccordionRow>

        </div>

        {/* ── Rincian Pembayaran ── */}
        <section className="mb-10">
          <h2 className="text-xl font-light mb-5">Rincian Pembayaran</h2>
          <div className="space-y-3 pl-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatRp(subtotal)}</span>
            </div>
            {diskonApplied && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Diskon (10%)</span>
                <span className="text-green-600 font-bold">− {formatRp(diskonAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Ongkos Kirim</span>
              <span className="font-bold text-green-600">Gratis</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Lainnya</span>
              <span>Rp0</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-sm font-black">
              <span>Total</span>
              <span>{formatRp(total)}</span>
            </div>
          </div>
        </section>

        {/* ── Tombol Lanjutkan ── */}
        <button
          onClick={handleLanjutkan}
          className="w-full max-w-xs mx-auto block bg-black text-white py-3.5 rounded-xl text-sm font-medium tracking-wide hover:opacity-80 transition-opacity"
        >
          Lanjutkan
        </button>

      </div>
    </div>
  );
}
