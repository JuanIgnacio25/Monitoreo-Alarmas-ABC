import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  title: string;
  subtitle: string;
  ctas: { label: string; href: string }[];
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
        <div className="absolute inset-0 bg-blue-900/70" />
      </div>

      <div className="h-full w-full flex flex-col md:flex-row justify-center md:justify-start items-center text-white px-4 md:px-12 ">
        {/* Contenido principal */}
        <div className="w-1/2 lg:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-lg md:text-xl mb-6">{subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            {ctas.map((cta, idx) => (
              <Button key={idx} size="lg" variant="main" asChild>
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Palabras escalonadas */}
        <div className="hidden md:flex absolute right-0 top-1/2 bg-black/20 py-6 px-6 text-white flex-col items-end rounded-l-md gap-3">
          <span className="text-3xl font-medium leading-none">ALERTA</span>
          <span className="text-4xl font-semibold">SEGURIDAD</span>
          <span className="text-4xl font-extrabold">TRANQUILIDAD</span>
        </div>
      </div>
    </section>
  );
}