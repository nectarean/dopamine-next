"use client";

import { useState, useEffect, useCallback } from "react";

const slides = [
  { image: "/hero1.png" },
  { image: "/hero2.png" },
  { image: "/hero3.png" },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div className="relative overflow-hidden h-[420px] md:h-[900px]">
      <div
        className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="min-w-full h-full relative flex items-center justify-center select-none"
          >
            {/* Foto background pakai img biasa */}
            <img
              src={slide.image}
              alt="hero"
              className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
            />

          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/15 text-white text-xl flex items-center justify-center hover:bg-white/30 transition-colors z-30"
        aria-label="Sebelumnya"
      >‹</button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/15 text-white text-xl flex items-center justify-center hover:bg-white/30 transition-colors z-30"
        aria-label="Berikutnya"
      >›</button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-5 bg-white" : "w-1.5 bg-white/40"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
