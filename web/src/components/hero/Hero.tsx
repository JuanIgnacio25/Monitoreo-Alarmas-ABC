import Image from "next/image";

import HeroContent from "./HeroContent";
import HeroWords from "./HeroWords";

interface CTA {
  label: string,
  href: string  
}

export interface HeroProps {
  title: string;
  subtitle: string;
  ctas: CTA[];
  backgroundImage: string;
}

export default function Hero({
  title,
  subtitle,
  ctas,
  backgroundImage,
}: HeroProps) {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={backgroundImage}
          alt="Fondo del hero"
          fill
          className="object-cover object-center"
          quality={80}
          priority
        />
        <div className="absolute inset-0 bg-blue-900/60" />
      </div>

      <div className="h-full w-full flex flex-col md:flex-row justify-center md:justify-start items-center text-white px-4 md:px-12 ">
        <HeroContent title={title} subtitle={subtitle} ctas={ctas}/>
        <HeroWords />
      </div>
    </section>
  );
}
