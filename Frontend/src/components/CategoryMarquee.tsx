"use client";

const categories = ["Baju", "Celana", "Topi", "Kaos Kaki", "Running Belt", "Jersey"];
const doubled = [...categories, ...categories];

export default function CategoryMarquee() {
  return (
    <div className="overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((cat, i) => (
          <span
            key={i}
            className="inline-block px-8 py-2 text-xs font-bold tracking-[2px] uppercase border-r border-white/15 hover:opacity-60 transition-opacity cursor-pointer flex-shrink-0"
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
