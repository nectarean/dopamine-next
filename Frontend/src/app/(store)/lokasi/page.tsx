import Link from "next/link";

const stores = [
  {
    name: "Dopamine — Kendari Store",
    address: "Jl. MT. Haryono No.123, Kota Kendari, Sulawesi Tenggara 93121",
    hours: "Senin – Sabtu: 09.00 – 21.00 WITA",
    type: "Toko Fisik",
  },
  {
    name: "Dopamine — Online Store",
    address: "Tersedia di Shopee, Tokopedia, dan website resmi dopamine.id",
    hours: "Buka 24 jam, setiap hari",
    type: "Online",
  },
];

export default function LokasiPage() {
  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      {/* Back bar */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-200 bg-[#f5f3ef]">
        <Link
          href="/"
          className="w-8 h-8 border-[1.5px] border-black rounded-full flex items-center justify-center text-sm hover:bg-black hover:text-white transition-colors"
          aria-label="Kembali"
        >←</Link>
        <h1 className="font-black tracking-widest text-sm">LOKASI KAMI</h1>
      </div>

      <div className="px-6 py-8 max-w-xl mx-auto">
        {/* Map placeholder */}
        <div className="bg-[#e8e5e0] rounded-xl h-48 flex flex-col items-center justify-center mb-8 text-gray-500">
          <span className="text-4xl mb-2">🗺️</span>
          <span className="text-[11px] tracking-widest uppercase">Peta Interaktif</span>
          <span className="text-[10px] mt-1 opacity-60">Integrasikan Google Maps API di sini</span>
        </div>

        {/* Store cards */}
        <div className="space-y-4">
          {stores.map((store, i) => (
            <div
              key={i}
              className="bg-white border-[1.5px] border-gray-200 rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="font-black text-sm">{store.name}</h2>
                <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold tracking-wide">
                  {store.type}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{store.address}</p>
              <p className="text-[11px] text-gray-400">⏰ {store.hours}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
