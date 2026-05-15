import Link from "next/link";
import DopamineLogo from "./DopamineLogo";

const footerLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Lokasi", href: "/lokasi" },
  { label: "Hubungi Kami", href: "/hubungi-kami" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-14 px-6 sm:px-10 md:px-16 lg:px-24">
      {/* Social icons */}
      <div className="flex gap-7 justify-center text-3xl mb-10">
        {["🛍", "📸", "🎵", "✳️"].map((icon, i) => (
          <span key={i} className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
            {icon}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-sm md:text-base text-center opacity-50 leading-relaxed max-w-sm md:max-w-md mx-auto mb-14">
        Dopamine adalah brand pakaian olahraga lokal yang dirancang untuk kenyamanan
        dan performa maksimal dalam setiap gerakan.
      </p>

      {/* Nav links */}
      <div className="flex justify-center gap-10 md:gap-16 border-t border-white/15 pt-8 mb-12">
        {footerLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs md:text-sm tracking-widest uppercase opacity-70 underline hover:opacity-100 transition-opacity font-semibold"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Logo */}
      <div className="flex justify-center">
        <DopamineLogo variant="light" className="mx-auto" />
      </div>
    </footer>
  );
}
