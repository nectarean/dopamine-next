import Image from "next/image";

interface DopamineLogoProps {
  variant?: "dark" | "light";
  className?: string;
}

export default function DopamineLogo({
  variant = "dark",
  className = "",
}: DopamineLogoProps) {
  return (
    <div className={`relative w-[140px] sm:w-[180px] h-[36px] sm:h-[44px] ${className}`}>
      <Image
        src={variant === "light" ? "/dopalogoputih.png" : "/dopalogohitam.png"}
        alt="DOPAMINE"
        fill
        className="object-contain object-left"
        priority
      />
    </div>
  );
}