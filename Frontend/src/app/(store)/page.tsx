import HeroCarousel from "@/components/HeroCarousel";
import ProductCarousel from "@/components/ProductCarousel";
import BrandStrip from "@/components/BrandStrip";
import KoleksiGrid from "@/components/KoleksiGrid";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <ProductCarousel />
      <BrandStrip />
      <KoleksiGrid />
    </>
  );
}
