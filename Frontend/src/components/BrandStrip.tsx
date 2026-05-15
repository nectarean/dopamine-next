import CategoryMarquee from "./CategoryMarquee";
import DopamineLogo from "./DopamineLogo";

export default function BrandStrip() {
  return (
    <section className="bg-black text-white py-20 md:py-28 px-6 sm:px-10 md:px-16 lg:px-24 text-center">
      {/* Logo */}
      <div className="flex justify-center mb-8 opacity-40">
        <DopamineLogo variant="light" />
      </div>

      {/* Tagline */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
        Because Feeling Good Matters.
      </h2>
      <p className="text-sm md:text-base opacity-60 mb-12 tracking-wide max-w-md mx-auto leading-relaxed">
        Run with comfort, move with confidence.
      </p>

      {/* Marquee */}
      <CategoryMarquee />
    </section>
  );
}
