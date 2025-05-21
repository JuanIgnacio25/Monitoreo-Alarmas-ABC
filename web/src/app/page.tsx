import Hero from "@/components/hero/Hero";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      <Hero
        title="Protegé tu hogar o negocio las 24 hs"
        subtitle="Servicio profesional de monitoreo de alarmas con respuesta inmediata."
        ctas={[
          { label: "Empezar a protegerme", href: "/#contacto" },
          { label: "Nuestros Servicios", href: "/#servicios" },
        ]}
        backgroundImage="/assets/SafeFamily.jpg"
      />
    </div>
  );
}
