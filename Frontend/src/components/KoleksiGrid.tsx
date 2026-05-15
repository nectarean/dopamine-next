import Link from "next/link";
import Image from "next/image";

const items = [
  { label: "Running", bg: "bg-gray-800", emoji: "🏃‍♂️", image: null, span: "row-span-2", href: "/products" },
  { label: "Apparel", bg: "bg-gray-500", emoji: "🧵", image: null, href: "/products" },
  { label: "Shorts",  bg: "bg-gray-600", emoji: "🩳", image: null, href: "/products" },
  { label: "Jersey",  bg: "bg-gray-700", emoji: "🎽", image: null, href: "/products" },
  { label: "Headwear",bg: "bg-gray-400", emoji: "🧢", image: null, href: "/products" },
];

export default function KoleksiGrid() {
  return (
    <section className="px-6 sm:px-10 md:px-16 lg:px-24 py-14 md:py-20 bg-[#f5f3ef]">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-black tracking-wide">Koleksi</h2>
        <p className="text-sm text-gray-500 mt-1.5 tracking-wide">Temukan pilihan terbaik untuk setiap aktivitas.</p>
      </div>

      {/*
        Grid layout:
        - Kolom 1 (Running): row-span-2 → tingginya mengikuti 2× tinggi kolom kanan
        - Kolom 2–3: 2 baris masing-masing
        - Baris terakhir full: "Click for more"

        Saat image tersedia, gambar mengisi penuh sel.
        Tinggi grid tidak di-hardcode — ikuti konten / aspect ratio.
      */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden">
        {/* Running — spans 2 rows */}
        <Link
          href={items[0].href}
          className={"row-span-2 relative flex items-end overflow-hidden group " + items[0].bg}
          style={{ minHeight: "320px" }}
        >
          {items[0].image ? (
            <Image src={items[0].image} alt={items[0].label} fill className="object-cover object-center" sizes="33vw" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-6xl md:text-7xl opacity-40 group-hover:scale-105 transition-transform duration-300">
              {items[0].emoji}
            </span>
          )}
          <span className="relative z-10 m-4 text-xs md:text-sm font-black tracking-[3px] uppercase text-white/90">
            {items[0].label}
          </span>
        </Link>

        {/* Apparel */}
        <Link
          href={items[1].href}
          className={"relative flex items-end overflow-hidden group " + items[1].bg}
          style={{ minHeight: "155px" }}
        >
          {items[1].image ? (
            <Image src={items[1].image} alt={items[1].label} fill className="object-cover object-center" sizes="33vw" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-5xl opacity-40 group-hover:scale-105 transition-transform duration-300">
              {items[1].emoji}
            </span>
          )}
          <span className="relative z-10 m-3 text-xs font-black tracking-[3px] uppercase text-white/90">{items[1].label}</span>
        </Link>

        {/* Shorts */}
        <Link
          href={items[2].href}
          className={"relative flex items-end overflow-hidden group " + items[2].bg}
          style={{ minHeight: "155px" }}
        >
          {items[2].image ? (
            <Image src={items[2].image} alt={items[2].label} fill className="object-cover object-center" sizes="33vw" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-5xl opacity-40 group-hover:scale-105 transition-transform duration-300">
              {items[2].emoji}
            </span>
          )}
          <span className="relative z-10 m-3 text-xs font-black tracking-[3px] uppercase text-white/90">{items[2].label}</span>
        </Link>

        {/* Jersey */}
        <Link
          href={items[3].href}
          className={"relative flex items-end overflow-hidden group " + items[3].bg}
          style={{ minHeight: "155px" }}
        >
          {items[3].image ? (
            <Image src={items[3].image} alt={items[3].label} fill className="object-cover object-center" sizes="33vw" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-5xl opacity-40 group-hover:scale-105 transition-transform duration-300">
              {items[3].emoji}
            </span>
          )}
          <span className="relative z-10 m-3 text-xs font-black tracking-[3px] uppercase text-white/90">{items[3].label}</span>
        </Link>

        {/* Headwear */}
        <Link
          href={items[4].href}
          className={"relative flex items-end overflow-hidden group " + items[4].bg}
          style={{ minHeight: "155px" }}
        >
          {items[4].image ? (
            <Image src={items[4].image} alt={items[4].label} fill className="object-cover object-center" sizes="33vw" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-5xl opacity-40 group-hover:scale-105 transition-transform duration-300">
              {items[4].emoji}
            </span>
          )}
          <span className="relative z-10 m-3 text-xs font-black tracking-[3px] uppercase text-white/90">{items[4].label}</span>
        </Link>

        {/* Click for more — full width */}
        <Link
          href="/products"
          className="col-span-3 bg-black flex items-center justify-center py-5 group"
        >
          <span className="text-xs md:text-sm font-black tracking-[4px] uppercase text-white/70 group-hover:text-white transition-colors">
            Lihat Semua Koleksi →
          </span>
        </Link>
      </div>
    </section>
  );
}
